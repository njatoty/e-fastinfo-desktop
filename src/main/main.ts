/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import isDev from 'electron-is-dev';
import fs from 'fs';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import axios from 'axios';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDevelopment =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDevelopment) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDevelopment) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      webSecurity: false,
    },
    disableAutoHideCursor: true,
    // frame: false,
    titleBarStyle: 'hidden',
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));
  mainWindow.webContents.openDevTools();

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.on('maximize', () => {
    mainWindow?.webContents.send('window-state-changed', { isMaximized: true });
    console.log('maximized');
  });

  mainWindow.on('unmaximize', () => {
    mainWindow?.webContents.send('window-state-changed', {
      isMaximized: false,
    });
    console.log('unmaximized');
  });

  mainWindow.on('restore', () => {
    mainWindow?.webContents.send('window-state-changed', {
      isMaximized: false,
    });
    console.log('restored');
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);

// Prisma
const dbPath = isDev
  ? path.join(__dirname, '../../prisma/dev.db')
  : path.join(app.getPath('userData'), 'database.db');

if (!isDev) {
  try {
    // database file does not exist, need to create
    fs.copyFileSync(
      path.join(process.resourcesPath, 'prisma/dev.db'),
      dbPath,
      fs.constants.COPYFILE_EXCL
    );
    console.log(
      `DB does not exist. Create new DB from ${path.join(
        process.resourcesPath,
        'prisma/dev.db'
      )}`
    );
  } catch (err) {
    if (
      err &&
      'code' in (err as { code: string }) &&
      (err as { code: string }).code !== 'EEXIST'
    ) {
      console.error(`DB creation faild. Reason:`, err);
    } else {
      // throw err;
    }
  }
}

// Uploaded images path
const imagesFolder = isDev
  ? path.join(__dirname, '../../public/images')
  : path.join(app.getPath('userData'), 'images');

if (!fs.existsSync(imagesFolder)) {
  fs.mkdirSync(imagesFolder, { recursive: true });
}

const platformToExecutables: Record<string, any> = {
  win32: {
    migrationEngine:
      'node_modules/@prisma/engines/migration-engine-windows.exe',
    queryEngine: 'node_modules/@prisma/engines/query_engine-windows.dll.node',
  },
  linux: {
    migrationEngine:
      'node_modules/@prisma/engines/migration-engine-debian-openssl-1.1.x',
    queryEngine:
      'node_modules/@prisma/engines/libquery_engine-debian-openssl-1.1.x.so.node',
  },
  darwin: {
    migrationEngine: 'node_modules/@prisma/engines/migration-engine-darwin',
    queryEngine:
      'node_modules/@prisma/engines/libquery_engine-darwin.dylib.node',
  },
  darwinArm64: {
    migrationEngine:
      'node_modules/@prisma/engines/migration-engine-darwin-arm64',
    queryEngine:
      'node_modules/@prisma/engines/libquery_engine-darwin-arm64.dylib.node',
  },
};

function getPlatformName(): string {
  const isDarwin = process.platform === 'darwin';
  if (isDarwin && process.arch === 'arm64') {
    return `${process.platform}Arm64`;
  }

  return process.platform;
}

const extraResourcesPath = app.getAppPath().replace('app.asar', ''); // impacted by extraResources setting in electron-builder.yml
const platformName = getPlatformName();

const mePath = path.join(
  extraResourcesPath,
  platformToExecutables[platformName].migrationEngine
);
const qePath = path.join(
  extraResourcesPath,
  platformToExecutables[platformName].queryEngine
);

ipcMain.on('config:get-app-path', (event) => {
  event.returnValue = app.getAppPath();
});

ipcMain.on('config:get-platform-name', (event) => {
  const isDarwin = process.platform === 'darwin';
  event.returnValue =
    isDarwin && process.arch === 'arm64'
      ? `${process.platform}Arm64`
      : (event.returnValue = process.platform);
});

ipcMain.on('config:get-prisma-db-path', (event) => {
  event.returnValue = dbPath;
});

ipcMain.on('config:get-prisma-me-path', (event) => {
  event.returnValue = mePath;
});

ipcMain.on('config:get-prisma-qe-path', (event) => {
  event.returnValue = qePath;
});

// on close event
ipcMain.on('app:close', (event) => {
  mainWindow?.close();
  event.returnValue = true;
});

ipcMain.on('app:maximize', (event) => {
  if (mainWindow?.isMaximized()) {
    mainWindow.restore();
    event.returnValue = false;
  } else {
    mainWindow?.maximize();
    event.returnValue = true;
  }
});

ipcMain.on('app:minimize', (event) => {
  mainWindow?.minimize();
  event.returnValue = true;
});

ipcMain.handle('download-image', async (event, url: string) => {
  event.preventDefault();
  try {
    // Case 1: URL is a local file path
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      const srcPath = url; // local path
      const srcFilename = path.basename(srcPath); // extract just the filename
      const destPath = path.join(imagesFolder, srcFilename); // safe destination

      // if source and destination are the same
      if (destPath === srcPath) {
        return srcPath; // just return the path
      }

      await fs.promises.copyFile(srcPath, destPath);
      return destPath;
    }

    // Case 2: URL is online, download with axios
    const filename = url.split('/').pop()?.split('?')[0] || 'image.png';
    const savePath = path.join(imagesFolder, filename);

    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
      },
    });

    // Wrap the stream in a Promise
    await new Promise<void>((resolve, reject) => {
      const writer = fs.createWriteStream(savePath);
      response.data.pipe(writer);

      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    return savePath;
  } catch (error) {
    console.error('Error in download-image:', error);
    return null;
  }
});
