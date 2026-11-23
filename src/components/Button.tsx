import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { cx } from '../design/cx';
import { FOCUS } from '../design/focus';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-orange-700 text-white hover:bg-orange-800 active:bg-orange-900',
  secondary: 'bg-white border border-stone-500 text-stone-800 hover:bg-stone-50 active:bg-stone-100',
  ghost: 'bg-transparent text-stone-700 hover:bg-stone-100 active:bg-stone-200',
  danger: 'bg-rose-700 text-white hover:bg-rose-800 active:bg-rose-900',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'min-h-[44px] px-3 text-sm rounded-lg',
  md: 'min-h-[44px] px-4 text-sm rounded-lg',
  lg: 'h-12 px-6 text-base rounded-xl',
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly variant?: ButtonVariant;
  readonly size?: ButtonSize;
  readonly ariaDisabled?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', ariaDisabled = false, className, children, onClick, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      aria-disabled={ariaDisabled || undefined}
      onClick={ariaDisabled ? undefined : onClick}
      className={cx([
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        FOCUS,
        'inline-flex items-center justify-center gap-2 font-medium transition-colors motion-reduce:transition-none',
        ariaDisabled && 'aria-disabled:opacity-50 aria-disabled:cursor-not-allowed',
        className ?? false,
      ])}
      {...rest}
    >
      {children}
    </button>
  );
});
