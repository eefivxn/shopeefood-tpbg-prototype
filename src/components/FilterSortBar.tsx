import { type ReactNode } from 'react';
import { Check, X } from 'lucide-react';
import { cx } from '../design/cx';
import { FOCUS } from '../design/focus';

export interface ToggleProps {
  readonly checked: boolean;
  readonly ariaDisabled?: boolean;
  readonly label: string;
  readonly helperText?: string;
  readonly onChange: () => void;
}

export function Toggle({ checked, ariaDisabled, label, helperText, onChange }: ToggleProps): JSX.Element {
  return (
    <label className={cx(['flex items-center gap-3', ariaDisabled && 'peer-aria-disabled:opacity-50'])}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-disabled={ariaDisabled || undefined}
        onClick={ariaDisabled ? undefined : onChange}
        className={cx([
          'relative inline-flex min-h-[44px] min-w-[44px] items-center rounded-full border-2 p-0.5',
          FOCUS,
          'transition-colors motion-reduce:transition-none',
          checked ? 'border-orange-700 bg-orange-700' : 'border-stone-500 bg-stone-200',
          ariaDisabled && 'aria-disabled:cursor-not-allowed',
        ])}
      >
        <span
          className={cx([
            'inline-block h-5 w-5 rounded-full bg-white transition-transform motion-reduce:transition-none',
            checked ? 'translate-x-5' : 'translate-x-0',
          ])}
        />
        {checked && <Check className="absolute left-0.5 h-4 w-4 text-white" aria-hidden="true" />}
      </button>
      <span className="min-w-0 flex-1">
        <span className="block text-sm text-stone-800">{label}</span>
        {helperText !== undefined && <span className="block text-xs text-stone-500">{helperText}</span>}
      </span>
    </label>
  );
}

export interface SearchFieldProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly onSubmit: () => void;
  readonly placeholder?: string;
  readonly resultCount?: number;
  readonly resultText?: string;
}

export function SearchField({ value, onChange, onSubmit, placeholder }: SearchFieldProps): JSX.Element {
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSubmit(); }}
      className="flex gap-2"
    >
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? 'Cari restoran atau kategori'}
        className="min-h-[44px] flex-1 rounded-lg border border-stone-500 bg-white px-3 text-base text-stone-900 placeholder:text-stone-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-700 focus-visible:ring-offset-2"
      />
      <button
        type="submit"
        className={cx([
          'inline-flex min-h-[44px] items-center justify-center rounded-lg bg-orange-700 px-4 text-sm font-medium text-white',
          FOCUS,
          'transition-colors motion-reduce:transition-none hover:bg-orange-800 active:bg-orange-900',
        ])}
      >
        Cari
      </button>
    </form>
  );
}

export interface FilterSortBarProps {
  readonly children?: ReactNode;
}

export function FilterSortBar({ children }: FilterSortBarProps): JSX.Element {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-stone-200 bg-white p-3">
      {children}
    </div>
  );
}

export interface SortOptionProps {
  readonly mode: 'default' | 'cheapest-all-in';
  readonly current: 'default' | 'cheapest-all-in';
  readonly onSelect: () => void;
}

export function SortOption({ mode, current, onSelect }: SortOptionProps): JSX.Element {
  const selected = mode === current;
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={cx([
        'inline-flex min-h-[44px] items-center gap-2 rounded-lg border px-3 text-sm',
        FOCUS,
        'transition-colors motion-reduce:transition-none',
        selected ? 'border-orange-700 bg-orange-50 text-orange-800' : 'border-stone-500 bg-white text-stone-700 hover:bg-stone-50',
      ])}
    >
      {selected && <Check className="h-4 w-4" aria-hidden="true" />}
      {mode === 'default' ? 'Urutan default' : 'Termurah all-in'}
    </button>
  );
}

export interface CloseButtonProps {
  readonly onClick: () => void;
  readonly label?: string;
}

export function CloseButton({ onClick, label = 'Tutup' }: CloseButtonProps): JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cx([
        'inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-stone-600',
        FOCUS,
        'transition-colors motion-reduce:transition-none hover:bg-stone-100 hover:text-stone-800',
      ])}
    >
      <X className="h-5 w-5" aria-hidden="true" />
    </button>
  );
}
