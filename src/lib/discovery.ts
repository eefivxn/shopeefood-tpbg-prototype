import { MENU_ITEMS } from '../data/menuItems';
import { RESTAURANT_LIST } from '../data/restaurants';
import type { MenuItem, Restaurant, Rupiah, SortMode } from '../types/domain';
import type { BudgetEvaluation } from '../types/pricing';
import { estimateRestaurantAllIn } from './pricing';
import { evaluateBudget } from './budget';

export interface DiscoveryParams {
  readonly query: string;
  readonly budget: Rupiah | null;
  readonly spentToday: Rupiah;
  readonly budgetFilterOn: boolean;
  readonly sortMode: SortMode;
}

export interface RestaurantCardModel {
  readonly restaurant: Restaurant;
  readonly signatureItem: MenuItem;
  readonly estimate: Rupiah;
  readonly evaluation: BudgetEvaluation | null;
}

export function filterAndSortRestaurants(params: DiscoveryParams): readonly RestaurantCardModel[] {
  const q = params.query.trim().toLowerCase();
  const models: RestaurantCardModel[] = RESTAURANT_LIST.map((restaurant) => {
    const signatureItem = MENU_ITEMS[restaurant.signatureMenuItemId];
    const estimate = estimateRestaurantAllIn(restaurant, signatureItem);
    return {
      restaurant,
      signatureItem,
      estimate,
      evaluation: evaluateBudget(params.budget, params.spentToday, estimate),
    };
  });

  const searched = q.length === 0
    ? models
    : models.filter(
        (m) => m.restaurant.name.toLowerCase().includes(q) || m.restaurant.category.toLowerCase().includes(q),
      );

  const filtered = params.budgetFilterOn && params.budget !== null
    ? searched.filter((m) => m.evaluation !== null && m.evaluation.status !== 'EXCEEDED')
    : searched;

  if (params.sortMode === 'cheapest-all-in') {
    return filtered.slice().sort((a, b) =>
      a.estimate !== b.estimate
        ? a.estimate - b.estimate
        : a.restaurant.id < b.restaurant.id ? -1 : 1,
    );
  }
  return filtered;
}
