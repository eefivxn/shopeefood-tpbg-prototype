import { describe, it, expect } from 'vitest';
import { filterAndSortRestaurants } from '../lib/discovery';
import { RESTAURANTS } from '../data/restaurants';
import { MENU_ITEMS } from '../data/menuItems';
import { estimateRestaurantAllIn } from '../lib/pricing';
import type { DiscoveryParams } from '../lib/discovery';

const baseParams: DiscoveryParams = {
  query: '',
  budget: 50000,
  spentToday: 12000,
  budgetFilterOn: false,
  sortMode: 'default',
};

describe('discovery vectors D-01..D-08', () => {
  it('D-01: estimates for all 6 restaurants match', () => {
    const expected: Record<string, number> = {
      'R-01': 50000, 'R-02': 26500, 'R-03': 25000, 'R-04': 28500, 'R-05': 41900, 'R-06': 35000,
    };
    for (const r of Object.values(RESTAURANTS)) {
      const est = estimateRestaurantAllIn(r, MENU_ITEMS[r.signatureMenuItemId]);
      expect(est).toBe(expected[r.id]);
    }
  });

  it('D-03: budgetFilterOn, default sort → R-02, R-03, R-04, R-06', () => {
    const models = filterAndSortRestaurants({ ...baseParams, budgetFilterOn: true });
    const ids = models.map((m) => m.restaurant.id);
    expect(ids).toEqual(expect.arrayContaining(['R-02', 'R-03', 'R-04', 'R-06']));
    expect(ids).not.toContain('R-01');
    expect(ids).not.toContain('R-05');
    expect(ids.length).toBe(4);
  });

  it('D-04: sort cheapest-all-in, no filter → R-03, R-02, R-04, R-06, R-05, R-01', () => {
    const models = filterAndSortRestaurants({ ...baseParams, sortMode: 'cheapest-all-in' });
    const ids = models.map((m) => m.restaurant.id);
    expect(ids).toEqual(['R-03', 'R-02', 'R-04', 'R-06', 'R-05', 'R-01']);
  });

  it('D-05: budgetFilterOn + cheapest-all-in → R-03, R-02, R-04, R-06', () => {
    const models = filterAndSortRestaurants({ ...baseParams, budgetFilterOn: true, sortMode: 'cheapest-all-in' });
    const ids = models.map((m) => m.restaurant.id);
    expect(ids).toEqual(['R-03', 'R-02', 'R-04', 'R-06']);
  });

  it('D-06: budget null, budgetFilterOn true → all 6, evaluation null', () => {
    const models = filterAndSortRestaurants({ ...baseParams, budget: null, budgetFilterOn: true });
    expect(models.length).toBe(6);
    for (const m of models) {
      expect(m.evaluation).toBeNull();
    }
  });

  it('D-07: query "ayam" → R-01, R-02, R-06', () => {
    const models = filterAndSortRestaurants({ ...baseParams, query: 'ayam' });
    const ids = models.map((m) => m.restaurant.id);
    expect(ids).toEqual(expect.arrayContaining(['R-01', 'R-02', 'R-06']));
    expect(ids.length).toBe(3);
  });

  it('D-08: query "  SATE " → R-06 (trim, case-insensitive)', () => {
    const models = filterAndSortRestaurants({ ...baseParams, query: '  SATE ' });
    const ids = models.map((m) => m.restaurant.id);
    expect(ids).toEqual(['R-06']);
  });

  it('query with no matches returns empty', () => {
    const models = filterAndSortRestaurants({ ...baseParams, query: 'martabak' });
    expect(models.length).toBe(0);
  });

  it('TS-06: budget 100000 → all 6 OK, filter shows all', () => {
    const models = filterAndSortRestaurants({ ...baseParams, budget: 100000, budgetFilterOn: true });
    expect(models.length).toBe(6);
    for (const m of models) {
      expect(m.evaluation?.status).toBe('OK');
    }
  });

  it('evaluation status matches expected for default profile', () => {
    const models = filterAndSortRestaurants(baseParams);
    const byId = new Map(models.map((m) => [m.restaurant.id, m.evaluation?.status]));
    expect(byId.get('R-01')).toBe('EXCEEDED');
    expect(byId.get('R-02')).toBe('OK');
    expect(byId.get('R-03')).toBe('OK');
    expect(byId.get('R-04')).toBe('WARN');
    expect(byId.get('R-05')).toBe('EXCEEDED');
    expect(byId.get('R-06')).toBe('WARN');
  });
});
