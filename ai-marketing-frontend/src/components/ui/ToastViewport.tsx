import { CheckCircle2, Info, X, XCircle } from 'lucide-react';

import { useToastStore, type ToastKind } from '../../stores/toastStore';
import { cn } from '../../utils/cn';

const icons: Record<ToastKind, JSX.Element> = {
  success: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
  error: <XCircle className="h-5 w-5 text-rose-500" />,
  info: <Info className="h-5 w-5 text-sky-500" />,
};

export function ToastViewport() {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  return (
    <div className="fixed right-4 top-4 z-50 grid w-[min(380px,calc(100vw-2rem))] gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            'flex items-start gap-3 rounded-lg border bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-950',
            toast.kind === 'error' && 'border-rose-200 dark:border-rose-900',
          )}
        >
          {icons[toast.kind]}
          <p className="min-w-0 flex-1 text-sm text-slate-700 dark:text-slate-200">{toast.message}</p>
          <button
            aria-label="Dismiss notification"
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-900 dark:hover:text-slate-100"
            onClick={() => removeToast(toast.id)}
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
