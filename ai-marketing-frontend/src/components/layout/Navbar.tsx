import { LogOut, Menu, UserCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { queryClient } from '../../api/queryClient';
import { useAuthStore } from '../../stores/authStore';
import { Button } from '../ui/Button';
import { ThemeToggle } from '../ui/ThemeToggle';

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  function handleLogout() {
    logout();
    queryClient.clear();
    navigate('/login', { replace: true });
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-white/90 px-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/85 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          aria-label="Open navigation"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900 lg:hidden"
          onClick={onMenuClick}
          type="button"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <p className="text-sm font-semibold text-slate-950 dark:text-white">
            {user?.name ?? 'Workspace'}
          </p>
          <p className="hidden text-xs text-slate-500 dark:text-slate-400 sm:block">
            {user?.email ?? 'Authenticated session'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Button className="hidden sm:inline-flex" icon={<UserCircle className="h-4 w-4" />} onClick={() => navigate('/profile')} variant="secondary">
          Profile
        </Button>
        <Button icon={<LogOut className="h-4 w-4" />} onClick={handleLogout} variant="ghost">
          Logout
        </Button>
      </div>
    </header>
  );
}
