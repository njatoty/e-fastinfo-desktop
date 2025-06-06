import {
  X, // Close
  Minus, // Minimize
  Maximize, // Maximize
  Minimize, // Restore (optional)
  Laptop, // App icon (as example)
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

export function ElectronTopBar() {
  const ipc = window.electron.ipcRenderer;
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    // window is maximized
    ipc.on('isMaximized', () => {
      setIsMaximized(true);
    });
    // is restored
    ipc.on('isRestored', () => {
      setIsMaximized(false);
    });
  }, []);

  async function handleMaximize() {
    const maximised = ipc.sendSync('app:maximize');
    setIsMaximized(maximised);
  }

  async function handleRestore() {
    const maximised = ipc.sendSync('app:maximize');
    setIsMaximized(maximised);
  }

  async function handleMinimize() {
    ipc.send('app:minimize');
  }

  async function handleClose() {
    console.log('close');
    ipc.send('app:close');
  }

  return (
    <div className="electron-top-bar flex items-center justify-between bg-accent text-accent-foreground h-electron-topbar select-none user-select-none border-b border-border">
      {/* Left side: Icon + Theme dropdown */}
      <div className="flex items-center gap-2 px-2">
        <Laptop className="w-5 h-5" />
        <span className="text-sm">Store management</span>
      </div>

      {/* Right side: Window control buttons */}
      <div className="electron-control-buttons flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleMinimize}
          aria-label="Minimize window"
          className="hover:bg-muted"
        >
          <Minus className="w-4 h-4" />
        </Button>

        {isMaximized ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRestore}
            aria-label="Restore window"
            className="hover:bg-muted"
          >
            <Minimize className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMaximize}
            aria-label="Maximize window"
            className="hover:bg-muted"
          >
            <Maximize className="w-4 h-4" />
          </Button>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={handleClose}
          aria-label="Close window"
          className="hover:bg-red-600 hover:text-white"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
