import { type ReactNode } from 'react';

export interface StickyActionBarProps {
  readonly children: ReactNode;
  readonly ariaLabel?: string;
}

export function StickyActionBar({ children, ariaLabel }: StickyActionBarProps): JSX.Element {
  return (
    <footer
      aria-label={ariaLabel ?? 'Ringkasan keranjang'}
      className="fixed inset-x-0 bottom-0 z-10 border-t border-stone-200 bg-white px-4 py-3 md:px-6"
      style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}
    >
      <div className="mx-auto w-full max-w-screen-xl">{children}</div>
    </footer>
  );
}
