const { contextBridge, ipcRenderer } = require('electron');
const { PrismaClient } = require('@prisma/client');

const dbPath = ipcRenderer.sendSync('config:get-prisma-db-path');
const qePath = ipcRenderer.sendSync('config:get-prisma-qe-path');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: `file:${dbPath}`,
    },
  },
  // see https://github.com/prisma/prisma/discussions/5200
  __internal: {
    engine: {
      // @ts-expect-error internal prop
      binaryPath: qePath,
    },
  },
});

const validChannels = [
  'ipc-example',
  'window-state-changed',
  'window-is-moving',
];

const api = {
  prisma: () => prisma,
  ipcRenderer: {
    myPing() {
      ipcRenderer.send('ipc-example', 'ping');
    },
    send(channel, data) {
      return ipcRenderer.send(channel, data);
    },
    sendSync(channel, data) {
      return ipcRenderer.sendSync(channel, data);
    },
    on(channel, func) {
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
    once(channel, func) {
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.once(channel, (event, ...args) => func(...args));
      }
    },
    downloadImage: (url, outputPath) =>
      ipcRenderer.invoke('download-image', url),
  },
};

contextBridge.exposeInMainWorld('electron', api);

module.exports = { api };
