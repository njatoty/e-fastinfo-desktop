import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Package,
  Tag,
  Settings,
  Users,
  AlertTriangle,
  ChevronRight,
  Laptop,
  History,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function Sidebar({ open, onOpenChange }: SidebarProps) {
  const navGroups = [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          href: '/',
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: 'Management',
      items: [
        {
          title: 'Products',
          href: '/products',
          icon: Package,
        },
        {
          title: 'Categories',
          href: '/categories',
          icon: Tag,
        },
        {
          title: 'Staff',
          href: '/staff',
          icon: Users,
        },
      ],
    },
    {
      title: 'Inventory',
      items: [
        {
          title: 'Low Stock',
          href: '/low-stock',
          icon: AlertTriangle,
        },
        {
          title: 'Stock Movements',
          href: '/stock-movements',
          icon: History,
        },
      ],
    },
    {
      title: 'Settings',
      items: [
        {
          title: 'Settings',
          href: '/settings',
          icon: Settings,
        },
      ],
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-background/80 lg:hidden"
          onClick={() => onOpenChange(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-card transition-transform duration-300 ease-in-out lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full lg:w-16'
        )}
      >
        <div
          className={cn(
            'flex h-16 items-center border-b px-4',
            open ? 'justify-between' : 'justify-center'
          )}
        >
          <div className="flex items-center gap-2">
            <Laptop className="h-6 w-6 text-primary" />
            {open && (
              <span className="text-lg font-semibold">ElectroAdmin</span>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:flex"
            onClick={() => onOpenChange(!open)}
          >
            <ChevronRight
              className={cn(
                'h-4 w-4 transition-transform',
                !open && 'rotate-180'
              )}
            />
          </Button>
        </div>

        <ScrollArea className="flex-1 py-2">
          <nav className="grid gap-4 px-2">
            {navGroups.map((group) => (
              <div key={group.title} className="grid gap-1">
                {open && (
                  <div className="px-3 py-1 text-xs font-semibold text-muted-foreground uppercase">
                    {group.title}
                  </div>
                )}
                {group.items.map((item) => (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    className={({ isActive }) =>
                      cn(
                        'group flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                        isActive
                          ? 'bg-accent text-accent-foreground'
                          : 'text-foreground hover:bg-muted',
                        !open && 'justify-center px-0'
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <item.icon
                          className={cn(
                            'h-5 w-5 transition-colors',
                            isActive ? 'text-accent-foreground' : 'text-accent',
                            !open && 'h-6 w-6'
                          )}
                        />
                        {open && <span>{item.title}</span>}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            ))}
          </nav>
        </ScrollArea>
      </div>
    </>
  );
}
