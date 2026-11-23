import { Ban, Check, Tag } from 'lucide-react';
import { formatRupiah } from '../lib/formatRupiah';
import { voucherReasonMessage } from '../lib/voucherCopy';
import { evaluateVoucher } from '../lib/pricing';
import { computeCartSubtotal } from '../lib/cart';
import type { Voucher, VoucherId, VoucherSlot, RestaurantId } from '../types/domain';
import type { CartState } from '../types/state';
import { cx } from '../design/cx';
import { FOCUS } from '../design/focus';

export interface VoucherSlotProps {
  readonly slot: VoucherSlot;
  readonly selectedId: VoucherId | null;
  readonly cart: CartState;
  readonly restaurantId: RestaurantId;
  readonly onOpen: () => void;
  readonly onRemove: () => void;
}

export function VoucherSlotTrigger({ slot, selectedId, cart, onOpen, onRemove }: VoucherSlotProps): JSX.Element {
  const label = slot === 'FOOD' ? 'Voucher makanan' : 'Voucher ongkir';
  if (selectedId === null) {
    const eligible = cart.lines.length > 0;
    return (
      <button
        type="button"
        onClick={eligible ? onOpen : undefined}
        aria-disabled={eligible ? undefined : 'true'}
        aria-label={'Pilih ' + label}
        className={cx([
          'inline-flex min-h-[44px] w-full items-center gap-2 rounded-lg border border-stone-500 bg-white px-3 text-sm text-stone-700',
          FOCUS,
          'transition-colors motion-reduce:transition-none hover:bg-stone-50',
          !eligible && 'aria-disabled:opacity-50 aria-disabled:cursor-not-allowed',
        ])}
      >
        <Tag className="h-4 w-4 text-orange-700" aria-hidden="true" />
        <span>Pilih {label}</span>
      </button>
    );
  }
  return (
    <div className="flex items-center gap-2 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2">
      <Check className="h-4 w-4 shrink-0 text-emerald-700" aria-hidden="true" />
      <span className="min-w-0 flex-1 text-sm text-emerald-800 break-words">{selectedId}</span>
      <button
        type="button"
        onClick={onRemove}
        aria-label={'Lepas ' + label}
        className={cx([
          'inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-rose-700',
          FOCUS,
          'transition-colors motion-reduce:transition-none hover:bg-rose-50',
        ])}
      >
        <Ban className="h-4 w-4" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={onOpen}
        aria-label={'Ganti ' + label}
        className={cx([
          'inline-flex min-h-[44px] items-center justify-center rounded-lg px-3 text-xs font-medium text-stone-700 underline',
          FOCUS,
        ])}
      >
        Ganti
      </button>
    </div>
  );
}

export interface VoucherOptionProps {
  readonly voucher: Voucher;
  readonly restaurantId: RestaurantId;
  readonly subtotal: number;
  readonly selected: boolean;
  readonly onSelect: () => void;
}

export function VoucherOption({ voucher, restaurantId, subtotal, selected, onSelect }: VoucherOptionProps): JSX.Element {
  const evaluation = evaluateVoucher(voucher, { restaurantId, subtotal });
  const eligible = evaluation.eligible;
  const valueText = voucher.valueType === 'PERCENT'
    ? voucher.percent + '% (maks ' + formatRupiah(voucher.maxDiscount) + ')'
    : formatRupiah(voucher.value);
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-disabled={eligible ? undefined : 'true'}
      onClick={eligible ? onSelect : undefined}
      className={cx([
        'flex w-full items-start gap-3 rounded-lg border p-3 text-left',
        FOCUS,
        'transition-colors motion-reduce:transition-none',
        selected ? 'border-orange-700 bg-orange-50' : 'border-stone-300 bg-white hover:bg-stone-50',
        !eligible && 'aria-disabled:opacity-50 aria-disabled:cursor-not-allowed',
      ])}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          {selected && <Check className="h-4 w-4 shrink-0 text-orange-700" aria-hidden="true" />}
          <span className="text-sm font-semibold text-stone-900 break-words">{voucher.name}</span>
        </div>
        <p className="mt-0.5 text-xs text-stone-600">Potongan {valueText}</p>
        <p className="mt-0.5 text-xs text-stone-500">Min. belanja {formatRupiah(voucher.minSubtotal)}</p>
        {!eligible && (
          <p className="mt-1 flex items-center gap-1 text-xs text-rose-700">
            <Ban className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {voucherReasonMessage(evaluation)}
          </p>
        )}
      </div>
    </button>
  );
}

export interface VoucherPanelProps {
  readonly slot: VoucherSlot;
  readonly vouchers: readonly Voucher[];
  readonly selectedId: VoucherId | null;
  readonly restaurantId: RestaurantId;
  readonly cart: CartState;
  readonly onSelect: (id: VoucherId) => void;
}

export function VoucherPanel({ slot, vouchers, selectedId, restaurantId, cart, onSelect }: VoucherPanelProps): JSX.Element {
  const subtotal = computeCartSubtotal(cart.lines);
  return (
    <div role="radiogroup" aria-label={slot === 'FOOD' ? 'Pilih voucher makanan' : 'Pilih voucher ongkir'}>
      {vouchers.map((v) => (
        <VoucherOption
          key={v.id}
          voucher={v}
          restaurantId={restaurantId}
          subtotal={subtotal}
          selected={v.id === selectedId}
          onSelect={() => onSelect(v.id)}
        />
      ))}
    </div>
  );
}
