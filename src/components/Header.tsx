import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { MoreVertical, RotateCcw, ShoppingCart } from 'lucide-react';
import { getHeaderBudgetView } from '../lib/budget';
import { formatRupiah } from '../lib/formatRupiah';
import type { Rupiah } from '../types/domain';
import { cx } from '../design/cx';
import { FOCUS } from '../design/focus';

export interface HeaderProps {
  readonly budget: Rupiah | null;
  readonly spentToday: Rupiah;
  readonly cartItemCount: number;
  readonly showSearch: boolean;
  readonly searchSlot?: ReactNode;
  readonly overflowOpen: boolean;
  readonly onOverflowToggle: () => void;
  readonly onResetRequest: () => void;
}

export function Header({
  budget, spentToday, cartItemCount, showSearch, searchSlot, overflowOpen, onOverflowToggle, onResetRequest,
}: HeaderProps): JSX.Element {
  const budgetView = getHeaderBudgetView(budget, spentToday);
  const budgetText = budgetView.kind === 'NOT_SET'
    ? 'Atur budget'
    : budgetView.kind === 'EXCEEDED'
      ? 'Budget terlampaui ' + formatRupiah(budgetView.amount)
      : 'Sisa budget ' + formatRupiah(budgetView.amount);

  return (
    <header className="sticky top-0 z-10 border-b border-stone-200 bg-white">
      <div className="mx-auto w-full max-w-screen-xl px-4 md:px-6">
        <div className="flex h-14 items-center justify-between gap-2">
          <Link
            to="/"
            className={cx([
              'text-base font-bold text-orange-700',
              FOCUS,
              'rounded-lg',
            ])}
          >
            TPBG
          </Link>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className={cx(['text-xs text-stone-700 underline', FOCUS, 'rounded-lg'])}
            >
              {budgetText}
            </Link>
            <Link
              to="/keranjang"
              aria-label={'Keranjang, ' + cartItemCount + ' item'}
              className={cx([
                'relative inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-stone-700',
                FOCUS,
                'transition-colors motion-reduce:transition-none hover:bg-stone-100',
              ])}
            >
              <ShoppingCart className="h-5 w-5" aria-hidden="true" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex min-w-[20px] items-center justify-center rounded-full bg-orange-700 px-1 text-xs font-bold text-white tabular-nums">
                  {cartItemCount}
                </span>
              )}
            </Link>
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={overflowOpen}
              aria-label="Menu lainnya"
              onClick={onOverflowToggle}
              className={cx([
                'inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-stone-700',
                FOCUS,
                'transition-colors motion-reduce:transition-none hover:bg-stone-100',
              ])}
            >
              <MoreVertical className="h-5 w-5" aria-hidden="true" />
            </button>
            {overflowOpen && (
              <div role="menu" className="absolute right-4 top-14 z-20 rounded-lg border border-stone-200 bg-white py-1 shadow-lg">
                <button
                  type="button"
                  role="menuitem"
                  tabIndex={0}
                  onClick={onResetRequest}
                  className={cx([
                    'flex w-full items-center gap-2 px-4 py-2 text-sm text-stone-700',
                    FOCUS,
                    'transition-colors motion-reduce:transition-none hover:bg-stone-50',
                  ])}
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  Reset data demo
                </button>
              </div>
            )}
          </div>
        </div>
        {showSearch && searchSlot !== undefined && (
          <div className="pb-3">{searchSlot}</div>
        )}
      </div>
    </header>
  );
}
