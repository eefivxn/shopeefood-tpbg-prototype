import { ADDRESSES } from '../data/addresses';
import { DEFAULT_ADDRESS_ID } from '../data/addresses';
import { MENU_ITEMS } from '../data/menuItems';
import { VOUCHERS } from '../data/vouchers';
import { createEmptyCart, computeCartSubtotal, reconcileVouchers, resolveCart } from '../lib/cart';
import { BUDGET_MIN, BUDGET_MAX, evaluateBudget } from '../lib/budget';
import { calculateOrder } from '../lib/pricing';
import { evaluateVoucher } from '../lib/pricing';
import { formatRupiah } from '../lib/formatRupiah';
import { getNetPrice } from '../types/domain';
import type {
  AddressId, MenuItemId, Rupiah, SortMode, Voucher, VoucherId, VoucherSlot,
} from '../types/domain';
import type {
  CalculateOrderInput, BudgetEvaluation, OrderBreakdown,
} from '../types/pricing';
import type {
  AppState, AppRouteKey, CartLine, InlineNotice, OpenableOverlay,
  OverlayState, Receipt,
} from '../types/state';
import { DEFAULT_PROFILE } from '../data/profile';
import { buildPendingPriceChange } from '../lib/priceChange';
import type { ExceededSnapshot } from '../types/state';

export type AppAction =
  | { readonly type: 'BUDGET_SAVE'; readonly budget: Rupiah }
  | { readonly type: 'BUDGET_FILTER_SET'; readonly on: boolean }
  | { readonly type: 'SORT_SET'; readonly mode: SortMode }
  | { readonly type: 'ADD_ITEM_REQUESTED'; readonly menuItemId: MenuItemId }
  | { readonly type: 'ADD_ITEM_CONFIRM_REPLACE' }
  | { readonly type: 'ADD_ITEM_CANCEL_REPLACE' }
  | { readonly type: 'LINE_INCREMENT'; readonly menuItemId: MenuItemId }
  | { readonly type: 'LINE_DECREMENT'; readonly menuItemId: MenuItemId }
  | { readonly type: 'LINE_REMOVE'; readonly menuItemId: MenuItemId }
  | { readonly type: 'CART_CLEAR' }
  | { readonly type: 'VOUCHER_APPLY'; readonly voucherId: VoucherId }
  | { readonly type: 'VOUCHER_REMOVE'; readonly slot: VoucherSlot }
  | { readonly type: 'NOTICE_DISMISS' }
  | { readonly type: 'ADDRESS_SELECT'; readonly addressId: AddressId }
  | { readonly type: 'PRICE_CHANGE_ACK' }
  | { readonly type: 'PRICE_CHANGE_REVERT' }
  | { readonly type: 'PAY_REQUESTED'; readonly expectedTotal: Rupiah; readonly receiptId: string; readonly paidAtIso: string }
  | { readonly type: 'EXCEEDED_CONTINUE'; readonly receiptId: string; readonly paidAtIso: string }
  | { readonly type: 'EXCEEDED_CHANGE_ORDER' }
  | { readonly type: 'EXCEEDED_SHOW_AFFORDABLE' }
  | { readonly type: 'EXCEEDED_DISMISS' }
  | { readonly type: 'RECEIPT_CLOSE' }
  | { readonly type: 'OVERLAY_OPEN'; readonly overlay: OpenableOverlay }
  | { readonly type: 'OVERLAY_DISMISS' }
  | { readonly type: 'OVERFLOW_SET'; readonly open: boolean }
  | { readonly type: 'ROUTE_CHANGED'; readonly from: AppRouteKey; readonly to: AppRouteKey }
  | { readonly type: 'RESET_REQUESTED' }
  | { readonly type: 'RESET_CONFIRM' };

const NONE: OverlayState = { kind: 'NONE' };
const QTY_MAX = 99;

function patch<T extends object>(base: T, changes: Partial<T>): T {
  return Object.assign({}, base, changes);
}

export function createInitialState(): AppState {
  return {
    schemaVersion: 1,
    budget: DEFAULT_PROFILE.budget,
    spentToday: DEFAULT_PROFILE.spentToday,
    addressId: DEFAULT_PROFILE.addressId,
    cart: createEmptyCart(),
    budgetFilterOn: DEFAULT_PROFILE.budgetFilterOn,
    sortMode: DEFAULT_PROFILE.sortMode,
    pendingAddItem: null,
    pendingPriceChange: null,
    lastPriceChange: null,
    inlineNotice: null,
    lastReceipt: null,
    overlay: NONE,
    overflowMenuOpen: false,
    noticeSeq: 0,
  };
}

function clearCart(state: AppState): AppState {
  return patch(state, {
    cart: createEmptyCart(),
    addressId: DEFAULT_ADDRESS_ID,
    inlineNotice: null,
    lastPriceChange: null,
    pendingPriceChange: null,
    pendingAddItem: null,
  });
}

function buildRemovedNotice(removed: readonly Voucher[], seq: number): InlineNotice {
  return {
    seq,
    kind: 'VOUCHER_REMOVED',
    variant: 'warning',
    messages: removed.map(
      (v) => v.name + ' dilepas karena subtotal di bawah minimum ' + formatRupiah(v.minSubtotal) + '. Total dihitung ulang.',
    ),
  };
}

function buildReplacedNotice(oldVoucher: Voucher, newVoucher: Voucher, seq: number): InlineNotice {
  return {
    seq,
    kind: 'VOUCHER_REPLACED',
    variant: 'success',
    messages: [oldVoucher.name + ' diganti ' + newVoucher.name + '.'],
  };
}

function incrementOrAppend(lines: readonly CartLine[], menuItemId: MenuItemId): readonly CartLine[] {
  const exists = lines.some((l) => l.menuItemId === menuItemId);
  if (!exists) return lines.concat([{ menuItemId, qty: 1 }]);
  return lines.map((l) =>
    l.menuItemId === menuItemId ? { menuItemId: l.menuItemId, qty: Math.min(QTY_MAX, l.qty + 1) } : l);
}

function applyLines(state: AppState, lines: readonly CartLine[]): AppState {
  if (lines.length === 0) return clearCart(state);
  const reconciled = reconcileVouchers(patch(state.cart, { lines }));
  if (reconciled.removed.length === 0) {
    return patch(state, { cart: reconciled.cart, inlineNotice: null });
  }
  const seq = state.noticeSeq + 1;
  return patch(state, {
    cart: reconciled.cart,
    inlineNotice: buildRemovedNotice(reconciled.removed, seq),
    noticeSeq: seq,
  });
}

interface PayParams {
  readonly expectedTotal: Rupiah;
  readonly receiptId: string;
  readonly paidAtIso: string;
}

function buildReceipt(state: AppState, input: CalculateOrderInput, breakdown: OrderBreakdown, p: PayParams): Receipt {
  const spentAfter = state.spentToday + breakdown.total;
  const budget = state.budget;
  return {
    id: p.receiptId,
    paidAtIso: p.paidAtIso,
    restaurantId: input.restaurant.id,
    restaurantName: input.restaurant.name,
    addressId: input.address.id,
    addressLabel: input.address.label,
    lines: input.lines.map((line) => ({
      menuItemId: line.item.id,
      name: line.item.name,
      qty: line.qty,
      unitNetPrice: getNetPrice(line.item),
      lineSubtotal: getNetPrice(line.item) * line.qty,
    })),
    breakdown,
    cartTotal: breakdown.total,
    checkoutTotal: p.expectedTotal,
    paidAmount: breakdown.total,
    delta: 0,
    budgetSnapshot: {
      budget,
      spentBefore: state.spentToday,
      spentAfter,
      remainingBudget: budget === null ? null : Math.max(0, budget - spentAfter),
      exceededBy: budget === null ? 0 : Math.max(0, spentAfter - budget),
    },
  };
}

function executePayment(state: AppState, p: PayParams): AppState {
  if (state.lastReceipt !== null && state.lastReceipt.id === p.receiptId) return state;
  const input = resolveCart(state.cart, state.addressId);
  if (input === null) return state;
  const breakdown = calculateOrder(input);
  if (breakdown.rejectedVouchers.length > 0 || breakdown.total !== p.expectedTotal) return state;

  const receipt = buildReceipt(state, input, breakdown, p);
  return patch(state, {
    spentToday: state.spentToday + breakdown.total,
    cart: createEmptyCart(),
    addressId: DEFAULT_ADDRESS_ID,
    lastReceipt: receipt,
    pendingAddItem: null,
    pendingPriceChange: null,
    lastPriceChange: null,
    inlineNotice: null,
    overlay: NONE,
  });
}

export interface CartView {
  readonly input: CalculateOrderInput | null;
  readonly breakdown: OrderBreakdown | null;
  readonly budgetEvaluation: BudgetEvaluation | null;
}

export function selectCartView(state: AppState): CartView {
  const input = resolveCart(state.cart, state.addressId);
  if (input === null) return { input: null, breakdown: null, budgetEvaluation: null };
  const breakdown = calculateOrder(input);
  return {
    input,
    breakdown,
    budgetEvaluation: evaluateBudget(state.budget, state.spentToday, breakdown.total),
  };
}

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'BUDGET_SAVE': {
      if (state.overlay.kind !== 'BUDGET_SETTINGS') return state;
      if (!Number.isInteger(action.budget) || action.budget < BUDGET_MIN || action.budget > BUDGET_MAX) return state;
      return patch(state, { budget: action.budget, overlay: NONE });
    }

    case 'BUDGET_FILTER_SET':
      if (action.on && state.budget === null) return state;
      return patch(state, { budgetFilterOn: action.on });

    case 'SORT_SET':
      return patch(state, { sortMode: action.mode });

    case 'ADD_ITEM_REQUESTED': {
      if (state.overlay.kind !== 'NONE') return state;
      const item = MENU_ITEMS[action.menuItemId];
      const cart = state.cart;
      if (cart.restaurantId === null || cart.lines.length === 0) {
        return patch(state, {
          cart: { restaurantId: item.restaurantId, lines: [{ menuItemId: item.id, qty: 1 }], foodVoucherId: null, deliveryVoucherId: null },
          addressId: DEFAULT_ADDRESS_ID,
          inlineNotice: null,
          lastPriceChange: null,
          pendingPriceChange: null,
        });
      }
      if (cart.restaurantId !== item.restaurantId) {
        return patch(state, {
          pendingAddItem: { menuItemId: item.id, restaurantId: item.restaurantId, fromRestaurantId: cart.restaurantId },
          overlay: { kind: 'CONFIRM_REPLACE_CART' },
        });
      }
      return applyLines(state, incrementOrAppend(cart.lines, item.id));
    }

    case 'ADD_ITEM_CONFIRM_REPLACE': {
      const pending = state.pendingAddItem;
      if (state.overlay.kind !== 'CONFIRM_REPLACE_CART' || pending === null) return state;
      return patch(state, {
        cart: { restaurantId: pending.restaurantId, lines: [{ menuItemId: pending.menuItemId, qty: 1 }], foodVoucherId: null, deliveryVoucherId: null },
        addressId: DEFAULT_ADDRESS_ID,
        pendingAddItem: null,
        pendingPriceChange: null,
        lastPriceChange: null,
        inlineNotice: null,
        overlay: NONE,
      });
    }

    case 'ADD_ITEM_CANCEL_REPLACE':
      if (state.overlay.kind !== 'CONFIRM_REPLACE_CART') return state;
      return patch(state, { pendingAddItem: null, overlay: NONE });

    case 'LINE_INCREMENT':
      return applyLines(state, incrementOrAppend(state.cart.lines, action.menuItemId));

    case 'LINE_DECREMENT': {
      const line = state.cart.lines.find((l) => l.menuItemId === action.menuItemId);
      if (line === undefined) return state;
      if (line.qty > 1) {
        return applyLines(state, state.cart.lines.map((l) =>
          l.menuItemId === action.menuItemId ? { menuItemId: l.menuItemId, qty: l.qty - 1 } : l));
      }
      return applyLines(state, state.cart.lines.filter((l) => l.menuItemId !== action.menuItemId));
    }

    case 'LINE_REMOVE':
      return applyLines(state, state.cart.lines.filter((l) => l.menuItemId !== action.menuItemId));

    case 'CART_CLEAR':
      return clearCart(state);

    case 'VOUCHER_APPLY': {
      const input = resolveCart(state.cart, state.addressId);
      if (input === null) return state;
      const voucher = VOUCHERS[action.voucherId];
      const subtotal = computeCartSubtotal(state.cart.lines);
      if (!evaluateVoucher(voucher, { restaurantId: input.restaurant.id, subtotal }).eligible) return state;

      const currentId = voucher.slot === 'FOOD' ? state.cart.foodVoucherId : state.cart.deliveryVoucherId;
      if (currentId === voucher.id) return patch(state, { overlay: NONE });

      const replaced = currentId === null ? null : VOUCHERS[currentId];
      const cart = voucher.slot === 'FOOD'
        ? patch(state.cart, { foodVoucherId: voucher.id })
        : patch(state.cart, { deliveryVoucherId: voucher.id });
      if (replaced === null) return patch(state, { cart, inlineNotice: null, overlay: NONE });
      const seq = state.noticeSeq + 1;
      return patch(state, { cart, inlineNotice: buildReplacedNotice(replaced, voucher, seq), noticeSeq: seq, overlay: NONE });
    }

    case 'VOUCHER_REMOVE': {
      const cart = action.slot === 'FOOD'
        ? patch(state.cart, { foodVoucherId: null })
        : patch(state.cart, { deliveryVoucherId: null });
      return patch(state, { cart, inlineNotice: null });
    }

    case 'NOTICE_DISMISS':
      return patch(state, { inlineNotice: null });

    case 'ADDRESS_SELECT': {
      if (state.overlay.kind !== 'ADDRESS_PICKER') return state;
      if (action.addressId === state.addressId) return patch(state, { overlay: NONE });
      const before = resolveCart(state.cart, state.addressId);
      const after = resolveCart(state.cart, action.addressId);
      if (before === null || after === null) return state;
      const change = buildPendingPriceChange({
        previousAddressId: state.addressId,
        nextAddressId: action.addressId,
        before: calculateOrder(before),
        after: calculateOrder(after),
        budget: state.budget,
        spentToday: state.spentToday,
      });
      if (change.totalDelta === 0) {
        return patch(state, { addressId: action.addressId, pendingPriceChange: null, overlay: NONE });
      }
      return patch(state, {
        addressId: action.addressId,
        pendingPriceChange: change,
        overlay: { kind: 'PRICE_CHANGE_NOTICE' },
      });
    }

    case 'PRICE_CHANGE_ACK': {
      const pending = state.pendingPriceChange;
      if (state.overlay.kind !== 'PRICE_CHANGE_NOTICE' || pending === null) return state;
      return patch(state, {
        lastPriceChange: {
          previousTotal: pending.previousTotal,
          nextTotal: pending.nextTotal,
          causeText: 'alamat diganti ke ' + ADDRESSES[pending.nextAddressId].label,
        },
        pendingPriceChange: null,
        overlay: NONE,
      });
    }

    case 'PRICE_CHANGE_REVERT': {
      const pending = state.pendingPriceChange;
      if (state.overlay.kind !== 'PRICE_CHANGE_NOTICE' || pending === null) return state;
      return patch(state, { addressId: pending.previousAddressId, pendingPriceChange: null, overlay: NONE });
    }

    case 'PAY_REQUESTED': {
      if (state.overlay.kind !== 'NONE' || state.pendingPriceChange !== null) return state;
      const input = resolveCart(state.cart, state.addressId);
      if (input === null) return state;
      const breakdown = calculateOrder(input);
      if (breakdown.total !== action.expectedTotal) return state;
      const evaluation = evaluateBudget(state.budget, state.spentToday, breakdown.total);
      if (state.budget !== null && evaluation !== null && evaluation.projection > state.budget) {
        const snapshot: ExceededSnapshot = {
          budget: state.budget,
          spentToday: state.spentToday,
          expectedTotal: breakdown.total,
          projection: evaluation.projection,
          exceededBy: evaluation.exceededBy,
        };
        return patch(state, { overlay: { kind: 'BUDGET_EXCEEDED', snapshot } });
      }
      return executePayment(state, { expectedTotal: breakdown.total, receiptId: action.receiptId, paidAtIso: action.paidAtIso });
    }

    case 'EXCEEDED_CONTINUE': {
      if (state.overlay.kind !== 'BUDGET_EXCEEDED') return state;
      return executePayment(state, {
        expectedTotal: state.overlay.snapshot.expectedTotal,
        receiptId: action.receiptId,
        paidAtIso: action.paidAtIso,
      });
    }

    case 'EXCEEDED_CHANGE_ORDER':
    case 'EXCEEDED_DISMISS':
      if (state.overlay.kind !== 'BUDGET_EXCEEDED') return state;
      return patch(state, { overlay: NONE });

    case 'EXCEEDED_SHOW_AFFORDABLE':
      if (state.overlay.kind !== 'BUDGET_EXCEEDED') return state;
      return patch(state, { overlay: NONE, budgetFilterOn: state.budget !== null });

    case 'RECEIPT_CLOSE':
      return patch(state, { lastReceipt: null });

    case 'OVERLAY_OPEN': {
      if (state.overlay.kind !== 'NONE') return state;
      if ((action.overlay.kind === 'VOUCHER_PANEL' || action.overlay.kind === 'ADDRESS_PICKER') && state.cart.lines.length === 0) {
        return state;
      }
      return patch(state, { overlay: action.overlay, overflowMenuOpen: false });
    }

    case 'OVERLAY_DISMISS':
      switch (state.overlay.kind) {
        case 'NONE':
          return state;
        case 'CONFIRM_REPLACE_CART':
          return appReducer(state, { type: 'ADD_ITEM_CANCEL_REPLACE' });
        case 'PRICE_CHANGE_NOTICE':
          return appReducer(state, { type: 'PRICE_CHANGE_ACK' });
        case 'BUDGET_EXCEEDED':
          return appReducer(state, { type: 'EXCEEDED_DISMISS' });
        default:
          return patch(state, { overlay: NONE });
      }

    case 'OVERFLOW_SET':
      if (action.open && state.overlay.kind !== 'NONE') return state;
      return patch(state, { overflowMenuOpen: action.open });

    case 'ROUTE_CHANGED': {
      let next = state;
      if (next.overlay.kind !== 'NONE') {
        next = appReducer(next, { type: 'OVERLAY_DISMISS' });
      }
      if (action.from === 'CHECKOUT' && action.to !== 'CHECKOUT') {
        next = patch(next, { pendingPriceChange: null, lastPriceChange: null });
      }
      if (action.from === 'CART' && action.to !== 'CART') {
        next = patch(next, { inlineNotice: null });
      }
      if (action.from === 'RECEIPT' && action.to !== 'RECEIPT') {
        next = patch(next, { lastReceipt: null });
      }
      return patch(next, { overflowMenuOpen: false, pendingAddItem: null });
    }

    case 'RESET_REQUESTED':
      return patch(state, { overflowMenuOpen: false, overlay: { kind: 'CONFIRM_RESET' } });

    case 'RESET_CONFIRM':
      if (state.overlay.kind !== 'CONFIRM_RESET') return state;
      return createInitialState();

    default:
      return state;
  }
}
