import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { cn } from '@/lib/utils';

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />

      <div
        className={cn(
          'flex flex-col min-h-screen transition-all duration-300 ease-in-out',
          sidebarOpen ? 'lg:pl-64' : 'lg:pl-16'
        )}
      >
        <Header
          sidebarOpen={sidebarOpen}
          onSidebarOpenChange={setSidebarOpen}
        />

        <main className="flex-1 p-4 md:p-6 bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
