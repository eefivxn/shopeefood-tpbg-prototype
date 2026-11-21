import type { MenuItemId, RestaurantId } from '../types/domain';

export interface RestaurantArtwork {
  readonly emoji: string;
  readonly gradient: string;
}

export const RESTAURANT_ARTWORK: Record<RestaurantId, RestaurantArtwork> = {
  'R-01': { emoji: '🍗', gradient: 'from-orange-100 to-orange-200' },
  'R-02': { emoji: '🌶️', gradient: 'from-pink-100 to-pink-200' },
  'R-03': { emoji: '🍛', gradient: 'from-sky-100 to-sky-200' },
  'R-04': { emoji: '🍜', gradient: 'from-violet-100 to-violet-200' },
  'R-05': { emoji: '☕', gradient: 'from-stone-200 to-stone-300' },
  'R-06': { emoji: '🍢', gradient: 'from-indigo-100 to-indigo-200' },
};

export const MENU_ITEM_EMOJI: Record<MenuItemId, string> = {
  'M-101': '🍗',
  'M-102': '🍢',
  'M-103': '🍚',
  'M-104': '🍊',
  'M-201': '🍗',
  'M-202': '🧀',
  'M-203': '🍚',
  'M-204': '🥤',
  'M-301': '🍛',
  'M-302': '🍳',
  'M-303': '🍜',
  'M-304': '🥤',
  'M-401': '🍲',
  'M-402': '🍲',
  'M-403': '🍜',
  'M-404': '🍧',
  'M-501': '☕',
  'M-502': '🍞',
  'M-503': '🥐',
  'M-504': '💧',
  'M-601': '🍢',
  'M-602': '🍢',
  'M-603': '🍙',
  'M-604': '🥥',
};
