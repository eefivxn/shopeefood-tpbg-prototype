import { type ReactElement } from 'react';
import { type Root } from 'react-dom/client';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';

export { act };

export interface RenderResult {
  readonly container: HTMLElement;
  readonly root: Root;
  readonly unmount: () => void;
}

function ensureRoots(): { appRoot: HTMLElement; overlayRoot: HTMLElement } {
  let appRoot = document.getElementById('app-root');
  if (appRoot === null) {
    appRoot = document.createElement('div');
    appRoot.id = 'app-root';
    document.body.appendChild(appRoot);
  }
  let overlayRoot = document.getElementById('overlay-root');
  if (overlayRoot === null) {
    overlayRoot = document.createElement('div');
    overlayRoot.id = 'overlay-root';
    document.body.appendChild(overlayRoot);
  }
  return { appRoot, overlayRoot };
}

export function render(node: ReactElement): RenderResult {
  (globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;
  const { appRoot } = ensureRoots();
  const container = document.createElement('div');
  appRoot.appendChild(container);
  const root = createRoot(container);
  act(() => {
    root.render(node);
  });
  return {
    container,
    root,
    unmount: () => {
      act(() => {
        root.unmount();
      });
      container.remove();
    },
  };
}

export function click(element: Element | null): void {
  if (element === null) return;
  act(() => {
    element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
  });
}

export function pressKey(target: Element, key: string, opts: { shiftKey?: boolean; bubbles?: boolean } = {}): void {
  act(() => {
    target.dispatchEvent(new KeyboardEvent('keydown', {
      key,
      shiftKey: opts.shiftKey ?? false,
      bubbles: opts.bubbles ?? true,
      cancelable: true,
    }));
  });
}

export function typeInput(input: Element, value: string): void {
  act(() => {
    const el = input as HTMLInputElement;
    el.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
}

export function byText(container: Element, text: string): Element | null {
  const all = container.querySelectorAll('*');
  for (const el of Array.from(all)) {
    if (el.textContent !== null && el.textContent.trim() === text.trim()) return el;
  }
  return null;
}

export function byRole(container: Element, role: string): Element | null {
  return container.querySelector('[role="' + role + '"]');
}

export function byLabel(container: Element, label: string): Element | null {
  return container.querySelector('[aria-label="' + label + '"]');
}

export function cleanup(): void {
  document.body.innerHTML = '';
}
