import { type ReactNode, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useModalBehavior } from '../a11y/useModalBehavior';
import { CloseButton } from './FilterSortBar';
import { cx } from '../design/cx';

export type ModalVariant = 'dialog' | 'sheet' | 'alertdialog';

export interface ModalProps {
  readonly variant: ModalVariant;
  readonly open: boolean;
  readonly titleId: string;
  readonly title: string;
  readonly initialFocusSelector?: string;
  readonly onClose: () => void;
  readonly children: ReactNode;
  readonly closeLabel?: string;
  readonly showClose?: boolean;
}

export function Modal({
  variant, open, titleId, title, initialFocusSelector, onClose, children, closeLabel, showClose = true,
}: ModalProps): JSX.Element | null {
  const panelRef = useRef<HTMLDivElement>(null);
  const initialFocus = initialFocusSelector ?? '#' + titleId;

  useEffect(() => {
    if (!open) return;
    const overlayRoot = document.getElementById('overlay-root');
    if (overlayRoot === null) return;
  }, [open]);

  useModalBehavior({
    panelRef,
    initialFocus,
    onEscape: onClose,
  });

  if (!open) return null;

  const role = variant === 'alertdialog' ? 'alertdialog' : 'dialog';
  const isSheet = variant === 'sheet';
  const overlayRoot = document.getElementById('overlay-root');

  const content = (
    <div
      className={cx([
        'fixed inset-0 z-50 flex items-end justify-center bg-stone-900/50',
        isSheet ? 'md:items-center' : 'items-center',
      ])}
      onClick={onClose}
    >
      <div
        ref={panelRef}
        role={role}
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className={cx([
          'relative w-full bg-white shadow-xl',
          isSheet
            ? 'max-h-[85vh] overflow-y-auto rounded-t-2xl md:max-w-md md:rounded-2xl'
            : 'max-h-[85vh] overflow-y-auto rounded-2xl md:max-w-md',
        ])}
      >
        <div className="flex items-center justify-between gap-2 border-b border-stone-200 px-4 py-3">
          <h2 id={titleId} tabIndex={-1} className="text-sm font-semibold text-stone-900">{title}</h2>
          {showClose && <CloseButton onClick={onClose} label={closeLabel} />}
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );

  if (overlayRoot === null) return content;
  return createPortal(content, overlayRoot);
}
