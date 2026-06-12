import { BarChart3, FileClock, Sparkles, UserCircle } from 'lucide-react';
import { NavLink } from 'react-router-dom';

import { cn } from '../../utils/cn';

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: BarChart3 },
  { label: 'Generate Content', path: '/generate', icon: Sparkles },
  { label: 'History', path: '/history', icon: FileClock },
  { label: 'Profile', path: '/profile', icon: UserCircle },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-30 bg-slate-950/40 transition lg:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r bg-white px-4 py-5 transition-transform dark:border-slate-800 dark:bg-slate-950 lg:static lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-950 text-white dark:bg-white dark:text-slate-950">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-950 dark:text-white">AI Marketing</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Content workspace</p>
          </div>
        </div>

        <nav className="mt-8 grid gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition',
                    isActive
                      ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white',
                  )
                }
                key={item.path}
                onClick={onClose}
                to={item.path}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-auto rounded-lg border bg-slate-50 p-4 dark:bg-slate-900">
          <p className="text-sm font-medium text-slate-900 dark:text-white">Spring Boot API</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Calls are sent through the authenticated backend.
          </p>
        </div>
      </aside>
    </>
  );
}
