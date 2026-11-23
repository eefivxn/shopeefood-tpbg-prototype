import { formatDiscount, formatRupiah } from '../lib/formatRupiah';
import type { OrderBreakdown } from '../types/pricing';
import { cx } from '../design/cx';

export interface PriceBreakdownProps {
  readonly breakdown: OrderBreakdown;
  readonly readOnly?: boolean;
  readonly className?: string;
}

interface RowProps {
  readonly label: string;
  readonly value: number;
  readonly isDiscount?: boolean;
  readonly note?: string;
}

function Row({ label, value, isDiscount, note }: RowProps): JSX.Element {
  return (
    <div className="flex items-baseline justify-between gap-2 py-1">
      <dt className="min-w-0 text-xs text-stone-600 break-words">
        {label}
        {note !== undefined && <span className="block text-xs text-stone-400">{note}</span>}
      </dt>
      <dd className={cx([
        'whitespace-nowrap shrink-0 tabular-nums text-xs font-medium',
        isDiscount ? 'text-rose-700' : 'text-stone-800',
      ])}>
        {isDiscount ? formatDiscount(value) : formatRupiah(value)}
      </dd>
    </div>
  );
}

export function PriceBreakdown({ breakdown, readOnly, className }: PriceBreakdownProps): JSX.Element {
  const taxNote = breakdown.taxableSubtotal === 0 && !breakdown.isEmpty
    ? 'Semua item sudah termasuk pajak'
    : undefined;
  return (
    <dl className={cx(['rounded-xl border border-stone-200 bg-white p-4', className ?? false])}>
      <Row label="Subtotal item" value={breakdown.subtotal} />
      <Row label="Pajak restoran (10%)" value={breakdown.tax} note={taxNote} />
      <Row label="Biaya kemasan" value={breakdown.packaging} />
      <Row label="Ongkos kirim" value={breakdown.deliveryFee} />
      <Row label="Biaya layanan" value={breakdown.serviceFee} />
      <Row label="Diskon voucher makanan" value={breakdown.foodDiscount} isDiscount />
      <Row label="Diskon voucher ongkir" value={breakdown.deliveryDiscount} isDiscount />
      <div className="mt-2 flex items-baseline justify-between gap-2 border-t border-stone-200 pt-2">
        <dt className="text-sm font-semibold text-stone-900">TOTAL</dt>
        <dd className="whitespace-nowrap shrink-0 tabular-nums text-sm font-bold text-stone-900">
          {formatRupiah(breakdown.total)}
        </dd>
      </div>
      {!readOnly && breakdown.total > 0 && (
        <div aria-live="polite" className="sr-only">
          Total {formatRupiah(breakdown.total)}
        </div>
      )}
    </dl>
  );
}
