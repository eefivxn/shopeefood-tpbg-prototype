const APP_ROOT_ID = 'app-root';
let depth = 0;

export function acquireBackgroundLock(): () => void {
  const root = document.getElementById(APP_ROOT_ID);
  depth += 1;
  if (depth === 1) {
    if (root !== null) {
      root.setAttribute('inert', '');
      root.setAttribute('aria-hidden', 'true');
    }
    document.documentElement.classList.add('modal-open');
  }
  let released = false;
  return () => {
    if (released) return;
    released = true;
    depth -= 1;
    if (depth === 0) {
      const current = document.getElementById(APP_ROOT_ID);
      if (current !== null) {
        current.removeAttribute('inert');
        current.removeAttribute('aria-hidden');
      }
      document.documentElement.classList.remove('modal-open');
    }
  };
}
