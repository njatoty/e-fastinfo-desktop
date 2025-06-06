import { X, Minus, Laptop, Square, SquaresUnite } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

export function ElectronTopBar() {
  const ipc = window.electron.ipcRenderer;
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    ipc.on('window-state-changed', (data: any) => {
      setIsMaximized(!!data.isMaximized);
    });
  }, []);

  function handleMaximize() {
    ipc.sendSync('app:maximize');
  }

  function handleRestore() {
    ipc.sendSync('app:maximize');
  }

  function handleMinimize() {
    ipc.sendSync('app:minimize');
  }

  function handleClose() {
    ipc.sendSync('app:close');
  }

  return (
    <div className="electron-title-bar flex items-center justify-between bg-background text-foreground h-electron-topbar select-none user-select-none border-b border-border">
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
          className="hover:bg-muted-foreground/10 hover:text-foreground"
        >
          <Minus className="w-4 h-4" />
        </Button>

        {isMaximized ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRestore}
            aria-label="Restore window"
            className="hover:bg-muted-foreground/10 hover:text-foreground"
          >
            <SquaresUnite className="w-4 h-4 transform scale-y-[-1]" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMaximize}
            aria-label="Maximize window"
            className="hover:bg-muted-foreground/10 hover:text-foreground"
          >
            <Square className="w-4 h-4" />
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
