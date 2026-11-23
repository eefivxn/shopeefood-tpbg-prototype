import { Trash2 } from 'lucide-react';
import { formatRupiah } from '../lib/formatRupiah';
import { getNetPrice } from '../types/domain';
import type { MenuItem, Rupiah } from '../types/domain';
import { QuantityStepper } from './QuantityStepper';
import { cx } from '../design/cx';
import { FOCUS } from '../design/focus';

export interface CartLineRowProps {
  readonly item: MenuItem;
  readonly qty: number;
  readonly lineSubtotal: Rupiah;
  readonly onIncrement: () => void;
  readonly onDecrement: () => void;
  readonly onRemove: () => void;
}

export function CartLineRow({ item, qty, lineSubtotal, onIncrement, onDecrement, onRemove }: CartLineRowProps): JSX.Element {
  const netPrice = getNetPrice(item);
  return (
    <div className="flex gap-3 rounded-xl border border-stone-200 bg-white p-3">
      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-semibold text-stone-900 break-words">{item.name}</h3>
        <p className="mt-0.5 text-xs tabular-nums text-stone-600">
          {formatRupiah(netPrice)} x {qty}
        </p>
        <p className="mt-0.5 text-sm font-semibold tabular-nums text-stone-900">{formatRupiah(lineSubtotal)}</p>
        <div className="mt-2">
          <QuantityStepper qty={qty} itemName={item.name} onIncrement={onIncrement} onDecrement={onDecrement} />
        </div>
      </div>
      <button
        type="button"
        onClick={onRemove}
        aria-label={'Hapus ' + item.name + ' dari keranjang'}
        className={cx([
          'inline-flex min-h-[44px] min-w-[44px] items-center justify-center self-start rounded-lg text-rose-700',
          FOCUS,
          'transition-colors motion-reduce:transition-none hover:bg-rose-50',
        ])}
      >
        <Trash2 className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
