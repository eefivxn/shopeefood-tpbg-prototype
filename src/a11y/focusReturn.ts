export interface FocusReturnTarget {
  readonly element: HTMLElement | null;
  readonly key: string | null;
}

let nextTarget: FocusReturnTarget | null = null;

function capture(el: Element | null): FocusReturnTarget {
  if (!(el instanceof HTMLElement)) return { element: null, key: null };
  const holder = el.closest<HTMLElement>('[data-focus-key]');
  return { element: el, key: holder === null ? null : holder.getAttribute('data-focus-key') };
}

export function rememberFocusReturn(trigger: Element | null): void {
  nextTarget = capture(trigger);
}

export function consumeFocusReturnTarget(): FocusReturnTarget {
  const target = nextTarget !== null ? nextTarget : capture(document.activeElement);
  nextTarget = null;
  return target;
}

export function restoreFocus(target: FocusReturnTarget): void {
  window.requestAnimationFrame(() => {
    const el = target.element;
    if (el !== null && el.isConnected) {
      el.focus();
      return;
    }
    if (target.key !== null) {
      const byKey = document.querySelector<HTMLElement>('[data-focus-key="' + CSS.escape(target.key) + '"]');
      if (byKey !== null) {
        byKey.focus();
        return;
      }
    }
    const main = document.getElementById('konten');
    if (main !== null) main.focus();
  });
}
