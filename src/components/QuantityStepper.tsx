import { Minus, Plus } from 'lucide-react';
import { cx } from '../design/cx';
import { FOCUS } from '../design/focus';

export interface QuantityStepperProps {
  readonly qty: number;
  readonly itemName: string;
  readonly onIncrement: () => void;
  readonly onDecrement: () => void;
}

export function QuantityStepper({ qty, itemName, onIncrement, onDecrement }: QuantityStepperProps): JSX.Element {
  const atMax = qty >= 99;
  const decrementLabel = qty <= 1
    ? 'Hapus ' + itemName + ' dari keranjang'
    : 'Kurangi jumlah ' + itemName;
  const incrementLabel = 'Tambah jumlah ' + itemName;
  return (
    <div className="flex items-center gap-3" role="group" aria-label={'Jumlah ' + itemName}>
      <button
        type="button"
        aria-label={decrementLabel}
        onClick={onDecrement}
        className={cx([
          'inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-stone-500 bg-white text-stone-800',
          FOCUS,
          'transition-colors motion-reduce:transition-none hover:bg-stone-50 active:bg-stone-100',
        ])}
      >
        <Minus className="h-4 w-4" aria-hidden="true" />
      </button>
      <span className="min-w-[2ch] text-center text-sm font-semibold tabular-nums text-stone-800" aria-live="polite">
        {qty}
      </span>
      <button
        type="button"
        aria-label={incrementLabel}
        aria-disabled={atMax || undefined}
        onClick={atMax ? undefined : onIncrement}
        className={cx([
          'inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-stone-500 bg-white text-stone-800',
          FOCUS,
          'transition-colors motion-reduce:transition-none hover:bg-stone-50 active:bg-stone-100',
          atMax && 'aria-disabled:opacity-50 aria-disabled:cursor-not-allowed',
        ])}
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
