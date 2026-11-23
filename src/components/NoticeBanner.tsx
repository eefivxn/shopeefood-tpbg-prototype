import { type ReactNode } from 'react';
import { cx } from '../design/cx';

export interface NoticeBannerProps {
  readonly variant: 'warning' | 'success';
  readonly messages: readonly string[];
  readonly onDismiss?: () => void;
  readonly dismissLabel?: string;
  readonly children?: ReactNode;
}

const VARIANT_CLASSES: Record<'warning' | 'success', string> = {
  warning: 'border-amber-300 bg-amber-50 text-amber-900',
  success: 'border-emerald-300 bg-emerald-50 text-emerald-800',
};

export function NoticeBanner({ variant, messages, onDismiss, dismissLabel = 'Tutup pemberitahuan', children }: NoticeBannerProps): JSX.Element {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cx([
        'flex items-start justify-between gap-3 rounded-lg border px-3 py-2',
        VARIANT_CLASSES[variant],
      ])}
    >
      <div className="min-w-0 flex-1">
        {messages.map((msg, i) => (
          <p key={i} className="text-xs break-words">{msg}</p>
        ))}
        {children}
      </div>
      {onDismiss !== undefined && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label={dismissLabel}
          className="shrink-0 text-xs font-medium underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-700 focus-visible:ring-offset-2"
        >
          Tutup
        </button>
      )}
    </div>
  );
}
