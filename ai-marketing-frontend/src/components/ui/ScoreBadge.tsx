import { cn } from '../../utils/cn';

export function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 80
      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
      : score >= 60
        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
        : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300';

  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold', color)}>
      {score}/100
    </span>
  );
}
