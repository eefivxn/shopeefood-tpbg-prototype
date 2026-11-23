import { Modal } from './Modal';
import { Button } from './Button';

export interface ConfirmDialogProps {
  readonly open: boolean;
  readonly title: string;
  readonly message: string;
  readonly confirmLabel: string;
  readonly cancelLabel: string;
  readonly onConfirm: () => void;
  readonly onCancel: () => void;
  readonly titleId: string;
}

export function ConfirmDialog({
  open, title, message, confirmLabel, cancelLabel, onConfirm, onCancel, titleId,
}: ConfirmDialogProps): JSX.Element | null {
  return (
    <Modal
      variant="alertdialog"
      open={open}
      titleId={titleId}
      title={title}
      initialFocusSelector="[data-initial-focus]"
      onClose={onCancel}
      showClose={false}
    >
      <p className="text-sm text-stone-700">{message}</p>
      <div className="mt-4 flex flex-col gap-2">
        <Button variant="secondary" onClick={onCancel} data-initial-focus>
          {cancelLabel}
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
