import { Outlet } from 'react-router-dom';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { cn } from '@/lib/utils';
import { useLocalStorage } from '@/hooks/use-localstorage';
import { ScrollArea } from '../ui/scroll-area';

export function AppLayout() {
  // use localstorage
  const [sidebarOpen, setSidebarOpen] = useLocalStorage('sidebar_open', true);

  return (
    <div className="h-electron-content flex flex-col bg-background contain-content">
      <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />

      <div
        className={cn(
          'flex flex-col flex-grow min-h-0 transition-all duration-300 ease-in-out',
          sidebarOpen ? 'lg:pl-64' : 'lg:pl-16'
        )}
      >
        <Header
          sidebarOpen={sidebarOpen}
          onSidebarOpenChange={setSidebarOpen}
        />

        <ScrollArea className="flex-grow bg-muted">
          <main className="p-4 md:p-6">
            <Outlet />
          </main>
        </ScrollArea>
      </div>
    </div>
  );
}
