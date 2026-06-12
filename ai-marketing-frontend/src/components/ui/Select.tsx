import type { SelectHTMLAttributes } from 'react';

import { cn } from '../../utils/cn';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: Array<{ label: string; value: string }>;
}

export function Select({ label, error, className, id, options, ...props }: SelectProps) {
  const inputId = id ?? props.name;

  return (
    <label className="grid gap-2" htmlFor={inputId}>
      <span className="field-label">{label}</span>
      <select
        id={inputId}
        className={cn(
          'h-11 rounded-lg border bg-white px-3 text-sm text-slate-950 transition focus:border-slate-900 focus:ring-4 focus:ring-slate-200 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-slate-300 dark:focus:ring-slate-800',
          error && 'border-rose-400 focus:border-rose-500 focus:ring-rose-100 dark:focus:ring-rose-950',
          className,
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <span className="field-error">{error}</span> : null}
    </label>
  );
}
