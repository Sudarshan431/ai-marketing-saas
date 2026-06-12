import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';

import { buttonStyles } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';

export function NotFoundPage() {
  return (
    <main className="min-h-screen bg-slate-50 p-4 dark:bg-slate-950">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-2xl items-center justify-center">
        <EmptyState
          action={
            <Link className={buttonStyles('primary')} to="/dashboard">
              Go to Dashboard
            </Link>
          }
          description="The route does not exist in this workspace."
          icon={<Search className="h-6 w-6" />}
          title="Page not found"
        />
      </div>
    </main>
  );
}
