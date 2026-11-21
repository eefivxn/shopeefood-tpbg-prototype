import { RESTAURANTS } from '../data/restaurants';
import type { RestaurantId } from '../types/domain';
import type { VoucherEvaluation } from '../types/pricing';
import { formatRupiah } from './formatRupiah';

export function voucherReasonMessage(evaluation: Exclude<VoucherEvaluation, { eligible: true }>): string {
  if (evaluation.reason === 'MIN_SUBTOTAL') {
    return 'Kurang ' + formatRupiah(evaluation.shortfall) + ' dari minimum belanja.';
  }
  const restaurant = RESTAURANTS[evaluation.onlyRestaurantId as RestaurantId];
  return 'Hanya berlaku di ' + restaurant.name + '.';
}
