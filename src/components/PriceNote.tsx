import { Info } from 'lucide-react';
import { formatRupiah } from '../lib/formatRupiah';
import { cx } from '../design/cx';
import { FOCUS } from '../design/focus';
import type { Rupiah } from '../types/domain';

export interface PriceNoteProps {
  readonly taxStatus: 'NOT_INCLUDED' | 'INCLUDED';
  readonly packagingFee: Rupiah;
  readonly estimateAllIn: Rupiah;
  readonly onOpenInfo: () => void;
}

export function PriceNote({ taxStatus, packagingFee, estimateAllIn, onOpenInfo }: PriceNoteProps): JSX.Element {
  const line1 = taxStatus === 'NOT_INCLUDED'
    ? 'Belum termasuk pajak 10% + kemasan ' + formatRupiah(packagingFee) + '.'
    : 'Sudah termasuk pajak. Kemasan ' + formatRupiah(packagingFee) + '.';
  const line2 = 'Est. all-in 1 porsi: ' + formatRupiah(estimateAllIn) + '.';
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      onClick={onOpenInfo}
      className={cx([
        'block min-h-[44px] w-full rounded-lg bg-stone-100 px-2.5 py-1.5 text-left text-xs leading-4 text-stone-700',
        FOCUS,
      ])}
    >
      <span className="block truncate">{line1}</span>
      <span className="flex items-center justify-between gap-2 whitespace-nowrap">
        <span>{line2}</span>
        <Info className="h-4 w-4 shrink-0 text-orange-700" aria-hidden="true" />
      </span>
      <span className="sr-only"> Buka penjelasan komponen biaya.</span>
    </button>
  );
}
