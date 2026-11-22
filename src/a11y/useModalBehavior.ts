import { useLayoutEffect, useRef } from 'react';
import type { RefObject } from 'react';
import { acquireBackgroundLock } from './backgroundLock';
import { pushEscapeLayer } from './escapeStack';
import { consumeFocusReturnTarget, restoreFocus } from './focusReturn';
import { trapTab } from './focusTrap';

export interface ModalBehaviorOptions {
  readonly panelRef: RefObject<HTMLElement | null>;
  readonly initialFocus: string;
  readonly onEscape: () => void;
}

export function useModalBehavior(options: ModalBehaviorOptions): void {
  const { panelRef, initialFocus } = options;
  const escapeRef = useRef(options.onEscape);

  useLayoutEffect(() => {
    escapeRef.current = options.onEscape;
  });

  useLayoutEffect(() => {
    const panel = panelRef.current;
    if (panel === null) return undefined;

    const returnTarget = consumeFocusReturnTarget();
    const releaseLock = acquireBackgroundLock();
    const removeLayer = pushEscapeLayer({ id: 'modal', onEscape: () => { escapeRef.current(); } });

    const initial = panel.querySelector<HTMLElement>(initialFocus);
    if (initial !== null) {
      initial.focus();
    } else {
      panel.focus();
    }

    const onKeyDown = (event: KeyboardEvent): void => {
      trapTab(event, panel);
    };
    panel.addEventListener('keydown', onKeyDown);

    return () => {
      panel.removeEventListener('keydown', onKeyDown);
      removeLayer();
      releaseLock();
      restoreFocus(returnTarget);
    };
  }, [panelRef, initialFocus]);
}
