import { Outlet } from 'react-router-dom';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { cn } from '@/lib/utils';
import { useLocalStorage } from '@/hooks/use-localstorage';

export function AppLayout() {
  // use localstorage
  const [sidebarOpen, setSidebarOpen] = useLocalStorage('sidebar_open', true);

  return (
    <div className="h-electron-content flex flex-col bg-background contain-content">
      <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />

      <div
        className={cn(
          'flex flex-col flex-grow overflow-y-auto transition-all duration-300 ease-in-out',
          sidebarOpen ? 'lg:pl-64' : 'lg:pl-16'
        )}
      >
        <Header
          sidebarOpen={sidebarOpen}
          onSidebarOpenChange={setSidebarOpen}
        />

        <main className="flex-grow p-4 md:p-6 bg-muted overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
