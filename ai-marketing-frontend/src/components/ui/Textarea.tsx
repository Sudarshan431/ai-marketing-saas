import type { TextareaHTMLAttributes } from 'react';

import { cn } from '../../utils/cn';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export function Textarea({ label, error, className, id, ...props }: TextareaProps) {
  const inputId = id ?? props.name;

  return (
    <label className="grid gap-2" htmlFor={inputId}>
      <span className="field-label">{label}</span>
      <textarea
        id={inputId}
        className={cn(
          'min-h-32 resize-y rounded-lg border bg-white px-3 py-3 text-sm text-slate-950 transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-200 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-slate-300 dark:focus:ring-slate-800',
          error && 'border-rose-400 focus:border-rose-500 focus:ring-rose-100 dark:focus:ring-rose-950',
          className,
        )}
        {...props}
      />
      {error ? <span className="field-error">{error}</span> : null}
    </label>
  );
}
