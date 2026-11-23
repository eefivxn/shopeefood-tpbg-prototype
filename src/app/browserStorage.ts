import type { MinimalStorage } from '../state/persistence';

export function getBrowserStorage(): MinimalStorage | null {
  try {
    const testKey = '__tpbg_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return {
      getItem: (key: string): string | null => {
        try { return window.localStorage.getItem(key); } catch { return null; }
      },
      setItem: (key: string, value: string): void => {
        try { window.localStorage.setItem(key, value); } catch { void 0; }
      },
      removeItem: (key: string): void => {
        try { window.localStorage.removeItem(key); } catch { void 0; }
      },
    };
  } catch {
    return null;
  }
}
