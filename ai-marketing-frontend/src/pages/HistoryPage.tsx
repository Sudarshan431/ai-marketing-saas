import { Eye, FileClock, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button, buttonStyles } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { LoadingState } from '../components/ui/LoadingState';
import { useDeleteContent, useHistory } from '../hooks/useContent';
import { formatDate, labelizePlatform } from '../utils/format';

export function HistoryPage() {
  const { data: history = [], isLoading } = useHistory();
  const deleteMutation = useDeleteContent();

  function handleDelete(id: number) {
    if (window.confirm('Delete this generated content?')) {
      deleteMutation.mutate(id);
    }
  }

  if (isLoading) {
    return <LoadingState label="Loading content history" />;
  }

  return (
    <div className="grid gap-6">
      <section>
        <p className="text-sm font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">History</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">Generated content</h1>
      </section>

      {history.length === 0 ? (
        <EmptyState
          action={
            <Link className={buttonStyles('primary')} to="/generate">
              Generate Content
            </Link>
          }
          description="Saved content will appear after your first generation."
          icon={<FileClock className="h-6 w-6" />}
          title="No history yet"
        />
      ) : (
        <section className="panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-3">Product</th>
                  <th className="px-5 py-3">Platform</th>
                  <th className="px-5 py-3">Created</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-slate-800">
                {history.map((item) => (
                  <tr key={item.id}>
                    <td className="px-5 py-4 font-medium text-slate-950 dark:text-white">{item.productName}</td>
                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300">{labelizePlatform(item.platform)}</td>
                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300">{formatDate(item.createdAt)}</td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <Link className={buttonStyles('secondary')} to={`/content/${item.id}`}>
                          <Eye className="h-4 w-4" />
                          View
                        </Link>
                        <Button
                          icon={<Trash2 className="h-4 w-4" />}
                          isLoading={deleteMutation.isPending}
                          onClick={() => handleDelete(item.id)}
                          type="button"
                          variant="danger"
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
