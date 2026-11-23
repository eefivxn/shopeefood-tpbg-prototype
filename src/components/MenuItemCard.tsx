import { formatDiscount, formatRupiah } from '../lib/formatRupiah';
import { getNetPrice } from '../types/domain';
import type { MenuItem, Rupiah } from '../types/domain';
import { QuantityStepper } from './QuantityStepper';
import { Thumbnail } from './Thumbnail';
import { MENU_ITEM_EMOJI } from '../data/artwork';
import { PriceNote } from './PriceNote';
import { cx } from '../design/cx';

export interface MenuItemCardProps {
  readonly item: MenuItem;
  readonly packagingFee: Rupiah;
  readonly estimateAllIn: Rupiah;
  readonly qty: number;
  readonly inCart: boolean;
  readonly onAdd: () => void;
  readonly onIncrement: () => void;
  readonly onDecrement: () => void;
  readonly onOpenInfo: () => void;
}

export function MenuItemCard({
  item, packagingFee, estimateAllIn, qty, inCart, onAdd, onIncrement, onDecrement, onOpenInfo,
}: MenuItemCardProps): JSX.Element {
  const netPrice = getNetPrice(item);
  const hasDiscount = item.discount > 0;
  const taxLabel = item.taxStatus === 'NOT_INCLUDED' ? 'Belum termasuk pajak' : 'Sudah termasuk pajak';
  return (
    <li className="flex gap-3 rounded-xl border border-stone-200 bg-white p-3">
      <Thumbnail variant="menu" emoji={MENU_ITEM_EMOJI[item.id]} gradient="from-stone-100 to-stone-200" />
      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-semibold text-stone-900 break-words">{item.name}</h3>
        <div className="mt-0.5 flex items-baseline gap-2">
          <span className="text-sm font-semibold tabular-nums text-stone-900">{formatRupiah(netPrice)}</span>
          {hasDiscount && (
            <span className="text-xs tabular-nums text-stone-500 line-through" aria-hidden="true">
              {formatRupiah(item.listPrice)}
            </span>
          )}
          {hasDiscount && <span className="sr-only">Harga asli {formatRupiah(item.listPrice)}</span>}
          {hasDiscount && (
            <span className="text-xs font-medium tabular-nums text-rose-700">{formatDiscount(item.discount)}</span>
          )}
        </div>
        <p className="mt-0.5 text-xs text-stone-600">{taxLabel}</p>
        {item.description !== null && <p className="mt-0.5 text-xs text-stone-500">{item.description}</p>}
        <div className="mt-2">
          <PriceNote
            taxStatus={item.taxStatus}
            packagingFee={packagingFee}
            estimateAllIn={estimateAllIn}
            onOpenInfo={onOpenInfo}
          />
        </div>
        <div className="mt-2">
          {inCart ? (
            <QuantityStepper qty={qty} itemName={item.name} onIncrement={onIncrement} onDecrement={onDecrement} />
          ) : (
            <button
              type="button"
              onClick={onAdd}
              className={cx([
                'inline-flex min-h-[44px] items-center justify-center rounded-lg bg-orange-700 px-4 text-sm font-medium text-white',
                'transition-colors motion-reduce:transition-none hover:bg-orange-800 active:bg-orange-900',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-700 focus-visible:ring-offset-2',
              ])}
            >
              Tambah
            </button>
          )}
        </div>
      </div>
    </li>
  );
}
