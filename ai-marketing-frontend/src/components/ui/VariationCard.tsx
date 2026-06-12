import { Copy, Hash } from 'lucide-react';

import { useToastStore } from '../../stores/toastStore';
import type { ContentVariation } from '../../types/content';
import { copyToClipboard } from '../../utils/format';
import { Button } from './Button';
import { ScoreBadge } from './ScoreBadge';

interface VariationCardProps {
  index: number;
  variation: ContentVariation;
}

export function VariationCard({ index, variation }: VariationCardProps) {
  const pushToast = useToastStore((state) => state.pushToast);

  async function copyContent() {
    await copyToClipboard(variation.content);
    pushToast({ kind: 'success', message: 'Content copied.' });
  }

  async function copyHashtags() {
    await copyToClipboard(variation.hashtags.join(' '));
    pushToast({ kind: 'success', message: 'Hashtags copied.' });
  }

  return (
    <article className="panel flex min-h-[280px] flex-col p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Variation {index + 1}
          </p>
          <h3 className="mt-1 text-lg font-semibold text-slate-950 dark:text-white">Generated copy</h3>
        </div>
        <ScoreBadge score={variation.score} />
      </div>

      <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-700 dark:text-slate-200">
        {variation.content}
      </p>

      {variation.hashtags.length > 0 ? (
        <div className="mt-5 flex flex-wrap gap-2">
          {variation.hashtags.map((hashtag) => (
            <span
              className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-900 dark:text-slate-300"
              key={hashtag}
            >
              <Hash className="h-3 w-3" />
              {hashtag.replace(/^#/, '')}
            </span>
          ))}
        </div>
      ) : null}

      <div className="mt-5 rounded-lg border bg-slate-50 p-3 dark:bg-slate-900">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">CTA</p>
        <p className="mt-1 text-sm text-slate-800 dark:text-slate-100">{variation.cta}</p>
      </div>

      <div className="mt-auto flex flex-wrap gap-2 pt-5">
        <Button icon={<Copy className="h-4 w-4" />} onClick={copyContent} type="button" variant="secondary">
          Copy Content
        </Button>
        <Button
          disabled={variation.hashtags.length === 0}
          icon={<Hash className="h-4 w-4" />}
          onClick={copyHashtags}
          type="button"
          variant="ghost"
        >
          Copy Hashtags
        </Button>
      </div>
    </article>
  );
}
