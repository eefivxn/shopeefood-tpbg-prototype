import { BUDGET_STATUS } from '../design/budgetStatus';
import { formatRupiah } from '../lib/formatRupiah';
import type { BudgetEvaluation } from '../types/pricing';
import { cx } from '../design/cx';

export interface BudgetTrackerProps {
  readonly evaluation: BudgetEvaluation;
}

export function BudgetTracker({ evaluation }: BudgetTrackerProps): JSX.Element {
  const tokens = BUDGET_STATUS[evaluation.status];
  const Icon = tokens.Icon;
  const liveText = tokens.label + '. Proyeksi ' + evaluation.percentLabel.replace('%', '') + ' persen.';
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Icon className={cx([tokens.icon, 'h-5 w-5'])} aria-hidden="true" />
          <span className="text-sm font-semibold text-stone-900">{tokens.label}</span>
        </div>
        <span className="text-sm font-semibold tabular-nums text-stone-700">{evaluation.percentLabel}</span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={evaluation.barPercent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuetext={'Proyeksi ' + evaluation.percentLabel.replace('%', '') + ' persen dari budget, status ' + tokens.label}
        className="mt-3 relative h-3 w-full overflow-hidden rounded-full bg-stone-200"
      >
        <div className={cx(['h-full rounded-full transition-colors motion-reduce:transition-none', tokens.fill])} style={{ width: evaluation.barPercent + '%' }} />
        <div className="absolute top-0 bottom-0 w-px bg-stone-500" style={{ left: '80%' }} aria-hidden="true" />
      </div>
      <div className="mt-1 flex justify-between">
        <span className="text-xs text-stone-500">0%</span>
        <span className="text-xs text-stone-500">80%</span>
        <span className="text-xs text-stone-500">100%</span>
      </div>
      <div className="mt-2 flex items-center justify-between gap-2 text-xs text-stone-600">
        <span>Sisa budget: {formatRupiah(evaluation.leftover)}</span>
        {evaluation.exceededBy > 0 && (
          <span className="tabular-nums text-rose-700">Lebih {formatRupiah(evaluation.exceededBy)}</span>
        )}
      </div>
      <div role="status" aria-live="polite" className="sr-only">
        {liveText}
      </div>
    </div>
  );
}
