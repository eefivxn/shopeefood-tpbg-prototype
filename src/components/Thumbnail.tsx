import { cx } from '../design/cx';

export type ThumbnailVariant = 'restaurant' | 'menu';

export interface ThumbnailProps {
  readonly variant: ThumbnailVariant;
  readonly emoji: string;
  readonly gradient: string;
  readonly className?: string;
}

export function Thumbnail({ variant, emoji, gradient, className }: ThumbnailProps): JSX.Element {
  const sizeClass = variant === 'restaurant' ? 'h-20 w-20 text-3xl' : 'h-14 w-14 text-2xl';
  return (
    <div
      aria-hidden="true"
      className={cx([
        'flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br',
        gradient,
        sizeClass,
        className ?? false,
      ])}
    >
      <span>{emoji}</span>
    </div>
  );
}
