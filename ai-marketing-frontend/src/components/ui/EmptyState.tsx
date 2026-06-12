import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="panel flex min-h-64 flex-col items-center justify-center px-6 py-10 text-center">
      <div className="mb-4 rounded-lg border bg-slate-50 p-3 text-slate-500 dark:bg-slate-900 dark:text-slate-300">
        {icon}
      </div>
      <h2 className="text-lg font-semibold text-slate-950 dark:text-white">{title}</h2>
      <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
