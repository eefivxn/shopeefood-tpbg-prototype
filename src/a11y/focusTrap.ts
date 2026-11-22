const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export function getFocusable(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => el.getClientRects().length > 0 && window.getComputedStyle(el).visibility !== 'hidden',
  );
}

export function trapTab(event: KeyboardEvent, container: HTMLElement): void {
  if (event.key !== 'Tab') return;
  const items = getFocusable(container);
  const first = items[0];
  const last = items[items.length - 1];
  if (first === undefined || last === undefined) {
    event.preventDefault();
    container.focus();
    return;
  }
  const active = document.activeElement;
  const outside = !(active instanceof Node) || !container.contains(active);
  if (event.shiftKey) {
    if (active === first || outside) {
      event.preventDefault();
      last.focus();
    }
  } else if (active === last || outside) {
    event.preventDefault();
    first.focus();
  }
}
