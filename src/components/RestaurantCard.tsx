import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import type { RestaurantCardModel } from '../lib/discovery';
import { formatRupiah } from '../lib/formatRupiah';
import { Thumbnail } from './Thumbnail';
import { BudgetBadge } from './BudgetBadge';
import { RESTAURANT_ARTWORK } from '../data/artwork';
import { cx } from '../design/cx';

export interface RestaurantCardProps {
  readonly model: RestaurantCardModel;
  readonly to: string;
}

export function RestaurantCard({ model, to }: RestaurantCardProps): JSX.Element {
  const { restaurant, signatureItem, estimate, evaluation } = model;
  const artwork = RESTAURANT_ARTWORK[restaurant.id];
  return (
    <li>
      <Link
        to={to}
        className={cx([
          'flex gap-3 rounded-xl border border-stone-200 bg-white p-3',
          'transition-colors motion-reduce:transition-none hover:border-stone-300 hover:bg-stone-50',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-700 focus-visible:ring-offset-2',
        ])}
      >
        <Thumbnail variant="restaurant" emoji={artwork.emoji} gradient={artwork.gradient} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-semibold text-stone-900 break-words">{restaurant.name}</h3>
            {evaluation !== null && <BudgetBadge status={evaluation.status} className="shrink-0" />}
          </div>
          <p className="mt-0.5 text-xs text-stone-600">{restaurant.category}</p>
          <p className="mt-0.5 text-xs text-stone-500">{restaurant.distanceLabel}</p>
          <div className="mt-1.5 flex items-center gap-1.5">
            <Star className="h-3.5 w-3.5 shrink-0 text-orange-700" aria-hidden="true" />
            <span className="text-xs text-stone-600">Andalan: {signatureItem.name}</span>
          </div>
          <p className="mt-1 text-xs font-medium tabular-nums text-stone-700">
            Est. all-in: {formatRupiah(estimate)}
          </p>
        </div>
      </Link>
    </li>
  );
}
