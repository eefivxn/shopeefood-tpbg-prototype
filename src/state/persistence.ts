import { DEFAULT_ADDRESS_ID } from '../data/addresses';
import { MENU_ITEMS } from '../data/menuItems';
import { RESTAURANTS } from '../data/restaurants';
import { VOUCHERS } from '../data/vouchers';
import { createEmptyCart, computeCartSubtotal } from '../lib/cart';
import { evaluateVoucher } from '../lib/pricing';
import { DEFAULT_PROFILE } from '../data/profile';
import type { AddressId, MenuItemId, RestaurantId, Rupiah, SortMode, VoucherId } from '../types/domain';
import type { AppState, CartLine, CartState, PersistedState } from '../types/state';
import { createInitialState } from './reducer';

export const STORAGE_KEY = 'tpbg:v1';
const MAX_SPENT = 999999999;

export interface MinimalStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export function toPersisted(state: AppState): PersistedState {
  return {
    schemaVersion: 1,
    budget: state.budget,
    spentToday: state.spentToday,
    addressId: state.pendingPriceChange === null ? state.addressId : state.pendingPriceChange.previousAddressId,
    cart: state.cart,
    budgetFilterOn: state.budgetFilterOn,
    sortMode: state.sortMode,
  };
}

const VALID_ADDRESS_IDS: readonly AddressId[] = ['ADDR-01', 'ADDR-02', 'ADDR-03'];
const VALID_RESTAURANT_IDS = Object.keys(RESTAURANTS);
const VALID_VOUCHER_IDS = Object.keys(VOUCHERS);
const VALID_MENU_ITEM_IDS = Object.keys(MENU_ITEMS);

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function sanitizeQty(raw: unknown): number | null {
  if (typeof raw !== 'number' || !Number.isFinite(raw)) return null;
  let q = raw;
  if (!Number.isInteger(q)) q = Math.floor(q);
  if (q < 1) q = 1;
  if (q > 99) q = 99;
  return q;
}

function sanitizeCart(raw: unknown): CartState {
  if (!isObject(raw) || !isObject(raw.cart)) return createEmptyCart();
  const cartObj = raw.cart as Record<string, unknown>;
  const restaurantId = typeof cartObj.restaurantId === 'string' && VALID_RESTAURANT_IDS.includes(cartObj.restaurantId)
    ? (cartObj.restaurantId as RestaurantId)
    : null;

  if (restaurantId === null) return createEmptyCart();

  const rawLines = Array.isArray(cartObj.lines) ? cartObj.lines : [];
  const seen = new Map<string, number>();
  const cleanLines: CartLine[] = [];

  for (const entry of rawLines) {
    if (!isObject(entry)) continue;
    const menuItemId = typeof entry.menuItemId === 'string' && VALID_MENU_ITEM_IDS.includes(entry.menuItemId)
      ? entry.menuItemId
      : null;
    if (menuItemId === null) continue;
    const item = MENU_ITEMS[menuItemId as keyof typeof MENU_ITEMS];
    if (item.restaurantId !== restaurantId) continue;
    const qty = sanitizeQty(entry.qty);
    if (qty === null) continue;
    const itemId = menuItemId as MenuItemId;
    if (seen.has(itemId)) {
      const idx = seen.get(itemId);
      if (idx === undefined) continue;
      const existing = cleanLines[idx];
      if (existing === undefined) continue;
      const merged = Math.min(99, existing.qty + qty);
      cleanLines[idx] = { menuItemId: itemId, qty: merged };
    } else {
      seen.set(itemId, cleanLines.length);
      cleanLines.push({ menuItemId: itemId, qty });
    }
  }

  if (cleanLines.length === 0) return createEmptyCart();

  const foodVoucherId = sanitizeVoucherId(cartObj.foodVoucherId, 'FOOD', restaurantId, cleanLines);
  const deliveryVoucherId = sanitizeVoucherId(cartObj.deliveryVoucherId, 'DELIVERY', restaurantId, cleanLines);

  return { restaurantId, lines: cleanLines, foodVoucherId, deliveryVoucherId };
}

function sanitizeVoucherId(
  raw: unknown,
  slot: 'FOOD' | 'DELIVERY',
  restaurantId: RestaurantId,
  lines: readonly CartLine[],
): VoucherId | null {
  if (typeof raw !== 'string' || !VALID_VOUCHER_IDS.includes(raw)) return null;
  const voucher = VOUCHERS[raw as keyof typeof VOUCHERS];
  if (voucher.slot !== slot) return null;
  const subtotal = computeCartSubtotal(lines);
  if (!evaluateVoucher(voucher, { restaurantId, subtotal }).eligible) return null;
  return raw as VoucherId;
}

export function sanitizePersisted(raw: unknown): PersistedState {
  if (!isObject(raw)) return createInitialState();
  const obj = raw as Record<string, unknown>;

  if (obj.schemaVersion !== 1) return createInitialState();

  let budget: Rupiah | null = null;
  if (typeof obj.budget === 'number' && Number.isSafeInteger(obj.budget) && obj.budget >= 10000 && obj.budget <= 500000) {
    budget = obj.budget;
  }

  let spentToday: Rupiah = DEFAULT_PROFILE.spentToday;
  if (typeof obj.spentToday === 'number' && Number.isSafeInteger(obj.spentToday) && obj.spentToday >= 0 && obj.spentToday <= MAX_SPENT) {
    spentToday = obj.spentToday;
  }

  let addressId: AddressId = DEFAULT_ADDRESS_ID;
  if (typeof obj.addressId === 'string' && (VALID_ADDRESS_IDS as readonly string[]).includes(obj.addressId)) {
    addressId = obj.addressId as AddressId;
  }

  const cart = sanitizeCart(obj);
  if (cart.lines.length === 0) {
    addressId = DEFAULT_ADDRESS_ID;
  }

  let budgetFilterOn = false;
  if (typeof obj.budgetFilterOn === 'boolean') budgetFilterOn = obj.budgetFilterOn;
  if (budget === null) budgetFilterOn = false;

  let sortMode: SortMode = 'default';
  if (obj.sortMode === 'default' || obj.sortMode === 'cheapest-all-in') sortMode = obj.sortMode;

  return {
    schemaVersion: 1,
    budget,
    spentToday,
    addressId,
    cart,
    budgetFilterOn,
    sortMode,
  };
}

export type LoadStatus = 'LOADED' | 'DEFAULTED' | 'STORAGE_UNAVAILABLE';

export interface LoadResult {
  readonly state: PersistedState;
  readonly status: LoadStatus;
}

export function loadPersistedState(storage: MinimalStorage | null): LoadResult {
  if (storage === null) return { state: createInitialState(), status: 'STORAGE_UNAVAILABLE' };
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (raw === null) return { state: createInitialState(), status: 'DEFAULTED' };
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      try { storage.removeItem(STORAGE_KEY); } catch { void 0; }
      return { state: createInitialState(), status: 'DEFAULTED' };
    }
    const sanitized = sanitizePersisted(parsed);
    return { state: sanitized, status: 'LOADED' };
  } catch {
    return { state: createInitialState(), status: 'STORAGE_UNAVAILABLE' };
  }
}

export function savePersistedState(storage: MinimalStorage | null, state: PersistedState): boolean {
  if (storage === null) return false;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function createStateFromStorage(storage: MinimalStorage | null): AppState {
  const result = loadPersistedState(storage);
  const persisted = result.state;
  return {
    schemaVersion: 1,
    budget: persisted.budget,
    spentToday: persisted.spentToday,
    addressId: persisted.addressId,
    cart: persisted.cart,
    budgetFilterOn: persisted.budgetFilterOn,
    sortMode: persisted.sortMode,
    pendingAddItem: null,
    pendingPriceChange: null,
    lastPriceChange: null,
    inlineNotice: null,
    lastReceipt: null,
    overlay: { kind: 'NONE' },
    overflowMenuOpen: false,
    noticeSeq: 0,
  };
}
