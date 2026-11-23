import { BUDGET_STATUS } from '../design/budgetStatus';
import type { BudgetStatus } from '../types/domain';
import { cx } from '../design/cx';
import { FOCUS } from '../design/focus';

export interface BudgetBadgeProps {
  readonly status: BudgetStatus;
  readonly className?: string;
}

export function BudgetBadge({ status, className }: BudgetBadgeProps): JSX.Element {
  const tokens = BUDGET_STATUS[status];
  const Icon = tokens.Icon;
  return (
    <span
      className={cx([
        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium',
        tokens.badge,
        className ?? false,
      ])}
    >
      <Icon className={cx([tokens.icon, 'h-3.5 w-3.5'])} aria-hidden="true" />
      {tokens.label}
    </span>
  );
}

export interface BudgetBadgeIconButtonProps {
  readonly status: BudgetStatus;
  readonly label: string;
  readonly onClick?: () => void;
}

export function BudgetBadgeIconButton({ status, label, onClick }: BudgetBadgeIconButtonProps): JSX.Element {
  const tokens = BUDGET_STATUS[status];
  const Icon = tokens.Icon;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cx([
        'inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium',
        tokens.badge,
        FOCUS,
        'transition-colors motion-reduce:transition-none',
      ])}
    >
      <Icon className={cx([tokens.icon, 'h-3.5 w-3.5'])} aria-hidden="true" />
      {tokens.label}
    </button>
  );
}
