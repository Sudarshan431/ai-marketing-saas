import { FileText, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

import { buttonStyles } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { VariationCard } from '../components/ui/VariationCard';
import { useContentStore } from '../stores/contentStore';
import { formatDate, labelizePlatform } from '../utils/format';

export function ResultsPage() {
  const result = useContentStore((state) => state.latestResult);

  if (!result) {
    return (
      <EmptyState
        action={
          <Link className={buttonStyles('primary')} to="/generate">
            <Sparkles className="h-4 w-4" />
            Generate Content
          </Link>
        }
        description="Run a new content request to see generated variations here."
        icon={<FileText className="h-6 w-6" />}
        title="No result selected"
      />
    );
  }

  return (
    <div className="grid gap-6">
      <section className="panel p-6">
        <p className="text-sm font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Results
        </p>
        <div className="mt-2 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="text-3xl font-semibold text-slate-950 dark:text-white">{result.productName}</h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {labelizePlatform(result.platform)} - {formatDate(result.createdAt)}
            </p>
          </div>
          <Link className={buttonStyles('secondary')} to={`/content/${result.id}`}>
            Open Details
          </Link>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        {result.aiContent.variations.map((variation, index) => (
          <VariationCard index={index} key={`${variation.content}-${index}`} variation={variation} />
        ))}
      </section>
    </div>
  );
}
