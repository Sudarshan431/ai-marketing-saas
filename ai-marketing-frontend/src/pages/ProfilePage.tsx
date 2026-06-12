import { Mail, ShieldCheck, UserCircle } from 'lucide-react';

import { LoadingState } from '../components/ui/LoadingState';
import { useCurrentUser } from '../hooks/useAuth';
import { useAuthStore } from '../stores/authStore';
import { formatDate } from '../utils/format';

export function ProfilePage() {
  const storedUser = useAuthStore((state) => state.user);
  const { data, isLoading } = useCurrentUser();
  const user = data ?? storedUser;

  if (isLoading && !user) {
    return <LoadingState label="Loading profile" />;
  }

  return (
    <div className="grid gap-6">
      <section>
        <p className="text-sm font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Profile</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">Account details</h1>
      </section>

      <section className="panel p-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-slate-950 text-white dark:bg-white dark:text-slate-950">
            <UserCircle className="h-10 w-10" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">{user?.name ?? 'User'}</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{user?.email}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border p-4">
            <Mail className="h-5 w-5 text-slate-400" />
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Email</p>
            <p className="mt-1 font-medium text-slate-950 dark:text-white">{user?.email ?? '-'}</p>
          </div>
          <div className="rounded-lg border p-4">
            <ShieldCheck className="h-5 w-5 text-emerald-500" />
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Authentication</p>
            <p className="mt-1 font-medium text-slate-950 dark:text-white">JWT active</p>
          </div>
          <div className="rounded-lg border p-4">
            <UserCircle className="h-5 w-5 text-slate-400" />
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Created</p>
            <p className="mt-1 font-medium text-slate-950 dark:text-white">
              {user?.createdAt ? formatDate(user.createdAt) : '-'}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
