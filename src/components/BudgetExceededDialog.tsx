import { Modal } from './Modal';
import { Button } from './Button';
import { formatRupiah } from '../lib/formatRupiah';
import type { ExceededSnapshot } from '../types/state';

export interface BudgetExceededDialogProps {
  readonly open: boolean;
  readonly snapshot: ExceededSnapshot;
  readonly onChangeOrder: () => void;
  readonly onShowAffordable: () => void;
  readonly onContinue: () => void;
  readonly titleId: string;
}

export function BudgetExceededDialog({
  open, snapshot, onChangeOrder, onShowAffordable, onContinue, titleId,
}: BudgetExceededDialogProps): JSX.Element | null {
  return (
    <Modal
      variant="alertdialog"
      open={open}
      titleId={titleId}
      title="Pesanan melebihi budget"
      initialFocusSelector="[data-initial-focus]"
      onClose={onChangeOrder}
      showClose={false}
    >
      <p className="text-sm text-stone-700">
        Proyeksi pengeluaran {formatRupiah(snapshot.projection)} melebihi budget {formatRupiah(snapshot.budget)} sebesar {formatRupiah(snapshot.exceededBy)}.
      </p>
      <div className="mt-4 flex flex-col gap-2">
        <Button variant="secondary" onClick={onChangeOrder} data-initial-focus>
          Ubah pesanan
        </Button>
        <Button variant="secondary" onClick={onShowAffordable}>
          Lihat yang sesuai budget
        </Button>
        <Button variant="danger" onClick={onContinue}>
          Lanjutkan tetap
        </Button>
      </div>
    </Modal>
  );
}
