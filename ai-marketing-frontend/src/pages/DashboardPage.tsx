import { ArrowRight, FileClock, Sparkles, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

import { buttonStyles } from '../components/ui/Button';
import { LoadingState } from '../components/ui/LoadingState';
import { useHistory } from '../hooks/useContent';
import { useAuthStore } from '../stores/authStore';
import { formatDate, labelizePlatform } from '../utils/format';

export function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const { data: history = [], isLoading } = useHistory();
  const recentItems = history.slice(0, 3);

  return (
    <div className="grid gap-6">
      <section className="panel p-6">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Dashboard
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">
              Welcome{user?.name ? `, ${user.name}` : ''}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              Generate content through the Spring Boot backend, store every result, and revisit campaigns from history.
            </p>
          </div>
          <Link className={buttonStyles('primary')} to="/generate">
            <Sparkles className="h-4 w-4" />
            Generate Content
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="panel p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500 dark:text-slate-400">Saved generations</p>
            <FileClock className="h-5 w-5 text-slate-400" />
          </div>
          <p className="mt-4 text-3xl font-semibold text-slate-950 dark:text-white">{history.length}</p>
        </div>
        <div className="panel p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500 dark:text-slate-400">AI variations per run</p>
            <Sparkles className="h-5 w-5 text-slate-400" />
          </div>
          <p className="mt-4 text-3xl font-semibold text-slate-950 dark:text-white">3</p>
        </div>
        <div className="panel p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500 dark:text-slate-400">Backend status</p>
            <TrendingUp className="h-5 w-5 text-slate-400" />
          </div>
          <p className="mt-4 text-3xl font-semibold text-emerald-600 dark:text-emerald-400">Ready</p>
        </div>
      </section>

      <section className="panel p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Recent history</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Latest saved content generations.</p>
          </div>
          <Link className="text-sm font-medium text-slate-950 underline dark:text-white" to="/history">
            View all
          </Link>
        </div>

        {isLoading ? (
          <LoadingState label="Loading history" />
        ) : recentItems.length === 0 ? (
          <div className="mt-6 rounded-lg border border-dashed p-8 text-center text-sm text-slate-500 dark:text-slate-400">
            No generated content yet.
          </div>
        ) : (
          <div className="mt-5 grid gap-3">
            {recentItems.map((item) => (
              <Link
                className="flex items-center justify-between gap-4 rounded-lg border p-4 transition hover:bg-slate-50 dark:hover:bg-slate-900"
                key={item.id}
                to={`/content/${item.id}`}
              >
                <div>
                  <p className="font-medium text-slate-950 dark:text-white">{item.productName}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {labelizePlatform(item.platform)} - {formatDate(item.createdAt)}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
