import { type ReactNode } from 'react';

export interface EmptyStateProps {
  readonly icon?: ReactNode;
  readonly title: string;
  readonly subtitle?: string;
  readonly action?: ReactNode;
}

export function EmptyState({ icon, title, subtitle, action }: EmptyStateProps): JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-stone-300 bg-stone-50 p-8 text-center">
      {icon !== undefined && <div className="text-stone-400">{icon}</div>}
      <h2 className="text-sm font-semibold text-stone-800">{title}</h2>
      {subtitle !== undefined && <p className="max-w-xs text-xs text-stone-600">{subtitle}</p>}
      {action !== undefined && <div className="mt-2">{action}</div>}
    </div>
  );
}
