import { ArrowLeft, FileText } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

import { buttonStyles } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { LoadingState } from '../components/ui/LoadingState';
import { VariationCard } from '../components/ui/VariationCard';
import { useContentDetails } from '../hooks/useContent';
import { formatDate, labelizePlatform } from '../utils/format';

export function ContentDetailsPage() {
  const params = useParams();
  const id = Number(params.id);
  const { data, isLoading, isError } = useContentDetails(id);

  if (isLoading) {
    return <LoadingState label="Loading content details" />;
  }

  if (isError || !data) {
    return (
      <EmptyState
        action={
          <Link className={buttonStyles('secondary')} to="/history">
            Back to History
          </Link>
        }
        description="The item may have been deleted or you may not have access to it."
        icon={<FileText className="h-6 w-6" />}
        title="Content not found"
      />
    );
  }

  return (
    <div className="grid gap-6">
      <section className="panel p-6">
        <Link className={buttonStyles('ghost')} to="/history">
          <ArrowLeft className="h-4 w-4" />
          History
        </Link>
        <div className="mt-5">
          <p className="text-sm font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Content Details
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">{data.productName}</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {labelizePlatform(data.platform)} - {formatDate(data.createdAt)}
          </p>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        {data.aiContent.variations.map((variation, index) => (
          <VariationCard index={index} key={`${variation.content}-${index}`} variation={variation} />
        ))}
      </section>
    </div>
  );
}
