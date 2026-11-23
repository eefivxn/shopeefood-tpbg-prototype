import { describe, it, expect } from 'vitest';
import {
  sanitizePersisted, toPersisted, loadPersistedState, savePersistedState,
  createStateFromStorage, STORAGE_KEY,
} from '../persistence';
import type { MinimalStorage } from '../persistence';
import { createInitialState } from '../reducer';
import type { AppState, PersistedState } from '../../types/state';

function makeStorage(initial: Record<string, string> = {}): MinimalStorage {
  const data: Record<string, string> = { ...initial };
  return {
    getItem: (key: string) => data[key] ?? null,
    setItem: (key: string, value: string) => { data[key] = value; },
    removeItem: (key: string) => { delete data[key]; },
  };
}

function validPersisted(overrides: Partial<PersistedState> = {}): PersistedState {
  return {
    schemaVersion: 1,
    budget: 50000,
    spentToday: 12000,
    addressId: 'ADDR-01',
    cart: { restaurantId: null, lines: [], foodVoucherId: null, deliveryVoucherId: null },
    budgetFilterOn: false,
    sortMode: 'default',
    ...overrides,
  };
}

describe('S-1..S-17 sanitizer', () => {
  it('S-1: try/catch all storage access — corrupt JSON returns default', () => {
    const storage = makeStorage({ [STORAGE_KEY]: '{corrupt json' });
    const result = loadPersistedState(storage);
    expect(result.status).toBe('DEFAULTED');
    expect(result.state.budget).toBe(50000);
  });

  it('S-2: null storage returns STORAGE_UNAVAILABLE with default', () => {
    const result = loadPersistedState(null);
    expect(result.status).toBe('STORAGE_UNAVAILABLE');
    expect(result.state.budget).toBe(50000);
  });

  it('S-3: schemaVersion !== 1 returns default', () => {
    const raw = { ...validPersisted(), schemaVersion: 2 };
    const result = sanitizePersisted(raw);
    expect(result).toEqual(createInitialState());
  });

  it('S-4: budget below 10000 → null', () => {
    const result = sanitizePersisted({ ...validPersisted(), budget: 5000 });
    expect(result.budget).toBeNull();
  });

  it('S-5: budget above 500000 → null', () => {
    const result = sanitizePersisted({ ...validPersisted(), budget: 600000 });
    expect(result.budget).toBeNull();
  });

  it('S-6: budget exactly 10000 is valid', () => {
    const result = sanitizePersisted({ ...validPersisted(), budget: 10000 });
    expect(result.budget).toBe(10000);
  });

  it('S-7: budget exactly 500000 is valid', () => {
    const result = sanitizePersisted({ ...validPersisted(), budget: 500000 });
    expect(result.budget).toBe(500000);
  });

  it('S-8: spentToday out of range → default 12000', () => {
    const result = sanitizePersisted({ ...validPersisted(), spentToday: -5 });
    expect(result.spentToday).toBe(12000);
  });

  it('S-9: spentToday above max → default 12000', () => {
    const result = sanitizePersisted({ ...validPersisted(), spentToday: 9999999999 });
    expect(result.spentToday).toBe(12000);
  });

  it('S-10: unknown addressId → ADDR-01', () => {
    const result = sanitizePersisted({ ...validPersisted(), addressId: 'ADDR-99' as never });
    expect(result.addressId).toBe('ADDR-01');
  });

  it('S-11: unknown restaurantId in cart → empty cart', () => {
    const result = sanitizePersisted({
      ...validPersisted(),
      cart: { restaurantId: 'R-99', lines: [], foodVoucherId: null, deliveryVoucherId: null } as never,
    });
    expect(result.cart.restaurantId).toBeNull();
  });

  it('S-12: cross-restaurant line items are dropped', () => {
    const result = sanitizePersisted({
      ...validPersisted(),
      cart: {
        restaurantId: 'R-01',
        lines: [
          { menuItemId: 'M-101', qty: 2 },
          { menuItemId: 'M-201', qty: 1 },
        ],
        foodVoucherId: null,
        deliveryVoucherId: null,
      } as never,
    });
    expect(result.cart.lines).toHaveLength(1);
    expect(result.cart.lines[0]?.menuItemId).toBe('M-101');
  });

  it('S-13: qty below 1 clamped to 1', () => {
    const result = sanitizePersisted({
      ...validPersisted(),
      cart: {
        restaurantId: 'R-01',
        lines: [{ menuItemId: 'M-101', qty: 0 }],
        foodVoucherId: null,
        deliveryVoucherId: null,
      } as never,
    });
    expect(result.cart.lines[0]?.qty).toBe(1);
  });

  it('S-14: qty above 99 clamped to 99', () => {
    const result = sanitizePersisted({
      ...validPersisted(),
      cart: {
        restaurantId: 'R-01',
        lines: [{ menuItemId: 'M-101', qty: 150 }],
        foodVoucherId: null,
        deliveryVoucherId: null,
      } as never,
    });
    expect(result.cart.lines[0]?.qty).toBe(99);
  });

  it('S-15: duplicate lines merged', () => {
    const result = sanitizePersisted({
      ...validPersisted(),
      cart: {
        restaurantId: 'R-01',
        lines: [
          { menuItemId: 'M-101', qty: 3 },
          { menuItemId: 'M-102', qty: 1 },
          { menuItemId: 'M-101', qty: 5 },
        ],
        foodVoucherId: null,
        deliveryVoucherId: null,
      } as never,
    });
    expect(result.cart.lines).toHaveLength(2);
    const m101 = result.cart.lines.find((l) => l.menuItemId === 'M-101');
    expect(m101?.qty).toBe(8);
  });

  it('S-16: voucher re-check — ineligible voucher removed', () => {
    const result = sanitizePersisted({
      ...validPersisted(),
      cart: {
        restaurantId: 'R-01',
        lines: [{ menuItemId: 'M-101', qty: 1 }],
        foodVoucherId: 'V-F02',
        deliveryVoucherId: null,
      } as never,
    });
    expect(result.cart.foodVoucherId).toBeNull();
  });

  it('S-17: budgetFilterOn false when budget null', () => {
    const result = sanitizePersisted({ ...validPersisted(), budget: null, budgetFilterOn: true });
    expect(result.budgetFilterOn).toBe(false);
  });

  it('S-extra: empty cart resets address to ADDR-01', () => {
    const result = sanitizePersisted({
      ...validPersisted(),
      addressId: 'ADDR-02',
      cart: { restaurantId: null, lines: [], foodVoucherId: null, deliveryVoucherId: null },
    });
    expect(result.addressId).toBe('ADDR-01');
  });

  it('S-extra: sortMode validated to known values', () => {
    const result = sanitizePersisted({ ...validPersisted(), sortMode: 'unknown' as never });
    expect(result.sortMode).toBe('default');
  });
});

describe('toPersisted / savePersistedState', () => {
  it('savePersistedState writes JSON to storage', () => {
    const storage = makeStorage();
    const state = validPersisted();
    const ok = savePersistedState(storage, state);
    expect(ok).toBe(true);
    const raw = storage.getItem(STORAGE_KEY);
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw as string) as PersistedState;
    expect(parsed.schemaVersion).toBe(1);
  });

  it('savePersistedState with null storage returns false', () => {
    expect(savePersistedState(null, validPersisted())).toBe(false);
  });

  it('createStateFromStorage produces valid AppState', () => {
    const storage = makeStorage();
    const state = createStateFromStorage(storage);
    expect(state.overlay.kind).toBe('NONE');
    expect(state.pendingAddItem).toBeNull();
    expect(state.lastReceipt).toBeNull();
  });

  it('toPersisted persists previousAddressId during price change dialog', () => {
    const { appReducer } = require('../reducer');
    let s = createInitialState();
    s = appReducer(s, { type: 'ADD_ITEM_REQUESTED', menuItemId: 'M-101' });
    s = appReducer(s, { type: 'OVERLAY_OPEN', overlay: { kind: 'ADDRESS_PICKER' } });
    s = appReducer(s, { type: 'ADDRESS_SELECT', addressId: 'ADDR-02' });
    expect(s.overlay.kind).toBe('PRICE_CHANGE_NOTICE');
    const persisted = toPersisted(s);
    expect(persisted.addressId).toBe('ADDR-01');
  });
});
