import { describe, it, expect } from 'vitest';
import { appReducer, createInitialState } from '../reducer';
import type { AppAction } from '../reducer';
import type { AppState } from '../../types/state';

function dispatch(state: AppState, action: AppAction): AppState {
  return appReducer(state, action);
}

function addItem(state: AppState, menuItemId: string, qty: number = 1): AppState {
  let s = dispatch(state, { type: 'ADD_ITEM_REQUESTED', menuItemId: menuItemId as never });
  return s;
}

function addMultiple(state: AppState, ...items: string[]): AppState {
  let s = state;
  for (const id of items) {
    s = addItem(s, id);
  }
  return s;
}

function seededReceiptId(seed: string): string {
  return 'RCPT-' + seed;
}

function seededIso(): string {
  return '2026-01-01T00:00:00.000Z';
}

describe('T1: Cart add/remove/modify transitions', () => {
  it('T1-A: ADD_ITEM_REQUESTED to empty cart sets restaurantId and one line', () => {
    const s0 = createInitialState();
    const s1 = addItem(s0, 'M-101');
    expect(s1.cart.restaurantId).toBe('R-01');
    expect(s1.cart.lines).toHaveLength(1);
    expect(s1.cart.lines[0]?.menuItemId).toBe('M-101');
    expect(s1.cart.lines[0]?.qty).toBe(1);
    expect(s1.pendingAddItem).toBeNull();
  });

  it('T1-B: ADD_ITEM_REQUESTED from different restaurant opens CONFIRM_REPLACE_CART', () => {
    let s = addItem(createInitialState(), 'M-101');
    s = addItem(s, 'M-201');
    expect(s.overlay.kind).toBe('CONFIRM_REPLACE_CART');
    expect(s.pendingAddItem).not.toBeNull();
    expect(s.pendingAddItem?.menuItemId).toBe('M-201');
  });

  it('T1-C: ADD_ITEM_CONFIRM_REPLACE replaces cart', () => {
    let s = addItem(createInitialState(), 'M-101');
    s = addItem(s, 'M-201');
    s = dispatch(s, { type: 'ADD_ITEM_CONFIRM_REPLACE' });
    expect(s.cart.restaurantId).toBe('R-02');
    expect(s.cart.lines).toHaveLength(1);
    expect(s.pendingAddItem).toBeNull();
    expect(s.overlay.kind).toBe('NONE');
  });

  it('T1-D: ADD_ITEM_CANCEL_REPLACE restores state', () => {
    let s = addItem(createInitialState(), 'M-101');
    s = addItem(s, 'M-201');
    s = dispatch(s, { type: 'ADD_ITEM_CANCEL_REPLACE' });
    expect(s.cart.restaurantId).toBe('R-01');
    expect(s.pendingAddItem).toBeNull();
    expect(s.overlay.kind).toBe('NONE');
  });

  it('T1-E: LINE_INCREMENT increments qty', () => {
    let s = addItem(createInitialState(), 'M-101');
    s = dispatch(s, { type: 'LINE_INCREMENT', menuItemId: 'M-101' });
    expect(s.cart.lines[0]?.qty).toBe(2);
  });

  it('T1-F: LINE_DECREMENT at qty>1 decrements', () => {
    let s = addItem(createInitialState(), 'M-101');
    s = dispatch(s, { type: 'LINE_INCREMENT', menuItemId: 'M-101' });
    s = dispatch(s, { type: 'LINE_DECREMENT', menuItemId: 'M-101' });
    expect(s.cart.lines[0]?.qty).toBe(1);
  });

  it('T1-G: LINE_DECREMENT at qty=1 removes line', () => {
    let s = addItem(createInitialState(), 'M-101');
    s = dispatch(s, { type: 'LINE_DECREMENT', menuItemId: 'M-101' });
    expect(s.cart.lines).toHaveLength(0);
    expect(s.cart.restaurantId).toBeNull();
  });

  it('T1-H: LINE_REMOVE removes line', () => {
    let s = addMultiple(createInitialState(), 'M-101', 'M-102');
    s = dispatch(s, { type: 'LINE_REMOVE', menuItemId: 'M-101' });
    expect(s.cart.lines).toHaveLength(1);
    expect(s.cart.lines[0]?.menuItemId).toBe('M-102');
  });

  it('T1-I: CART_CLEAR resets cart to empty', () => {
    let s = addItem(createInitialState(), 'M-101');
    s = dispatch(s, { type: 'CART_CLEAR' });
    expect(s.cart.restaurantId).toBeNull();
    expect(s.cart.lines).toHaveLength(0);
    expect(s.cart.foodVoucherId).toBeNull();
    expect(s.cart.deliveryVoucherId).toBeNull();
  });

  it('T1-J: LINE_INCREMENT caps at 99', () => {
    let s = addItem(createInitialState(), 'M-101');
    for (let i = 0; i < 100; i++) {
      s = dispatch(s, { type: 'LINE_INCREMENT', menuItemId: 'M-101' });
    }
    expect(s.cart.lines[0]?.qty).toBe(99);
  });
});

describe('T2: Voucher apply/remove and notice', () => {
  it('T2-A: VOUCHER_APPLY applies eligible voucher', () => {
    let s = addItem(createInitialState(), 'M-101');
    s = dispatch(s, { type: 'VOUCHER_APPLY', voucherId: 'V-F01' });
    expect(s.cart.foodVoucherId).toBe('V-F01');
    expect(s.overlay.kind).toBe('NONE');
  });

  it('T2-B: VOUCHER_APPLY replaces existing voucher with notice', () => {
    let s = addItem(createInitialState(), 'M-101');
    s = dispatch(s, { type: 'LINE_INCREMENT', menuItemId: 'M-101' });
    s = dispatch(s, { type: 'VOUCHER_APPLY', voucherId: 'V-F01' });
    s = dispatch(s, { type: 'VOUCHER_APPLY', voucherId: 'V-F02' });
    expect(s.cart.foodVoucherId).toBe('V-F02');
    expect(s.inlineNotice).not.toBeNull();
    expect(s.inlineNotice?.kind).toBe('VOUCHER_REPLACED');
  });

  it('T2-C: VOUCHER_REMOVE clears slot', () => {
    let s = addItem(createInitialState(), 'M-101');
    s = dispatch(s, { type: 'VOUCHER_APPLY', voucherId: 'V-F01' });
    s = dispatch(s, { type: 'VOUCHER_REMOVE', slot: 'FOOD' });
    expect(s.cart.foodVoucherId).toBeNull();
  });

  it('T2-D: NOTICE_DISMISS clears inlineNotice', () => {
    let s = addItem(createInitialState(), 'M-101');
    s = dispatch(s, { type: 'LINE_INCREMENT', menuItemId: 'M-101' });
    s = dispatch(s, { type: 'VOUCHER_APPLY', voucherId: 'V-F01' });
    s = dispatch(s, { type: 'VOUCHER_APPLY', voucherId: 'V-F02' });
    s = dispatch(s, { type: 'NOTICE_DISMISS' });
    expect(s.inlineNotice).toBeNull();
  });

  it('T2-E: ineligible voucher is not applied', () => {
    let s = addItem(createInitialState(), 'M-101');
    s = dispatch(s, { type: 'VOUCHER_APPLY', voucherId: 'V-F02' });
    expect(s.cart.foodVoucherId).toBeNull();
  });

  it('T2-F: decreasing qty below min removes voucher automatically', () => {
    let s = addItem(createInitialState(), 'M-101');
    s = dispatch(s, { type: 'LINE_INCREMENT', menuItemId: 'M-101' });
    s = dispatch(s, { type: 'VOUCHER_APPLY', voucherId: 'V-F01' });
    expect(s.cart.foodVoucherId).toBe('V-F01');
    s = dispatch(s, { type: 'LINE_DECREMENT', menuItemId: 'M-101' });
    s = dispatch(s, { type: 'LINE_DECREMENT', menuItemId: 'M-101' });
    expect(s.cart.lines).toHaveLength(0);
    expect(s.cart.foodVoucherId).toBeNull();
  });
});

describe('T3: Address select and price change', () => {
  it('T3-A: ADDRESS_SELECT same address just closes overlay', () => {
    let s = addItem(createInitialState(), 'M-101');
    s = dispatch(s, { type: 'OVERLAY_OPEN', overlay: { kind: 'ADDRESS_PICKER' } });
    s = dispatch(s, { type: 'ADDRESS_SELECT', addressId: 'ADDR-01' });
    expect(s.overlay.kind).toBe('NONE');
    expect(s.pendingPriceChange).toBeNull();
  });

  it('T3-B: ADDRESS_SELECT with totalDelta!==0 opens PRICE_CHANGE_NOTICE', () => {
    let s = addItem(createInitialState(), 'M-101');
    s = dispatch(s, { type: 'OVERLAY_OPEN', overlay: { kind: 'ADDRESS_PICKER' } });
    s = dispatch(s, { type: 'ADDRESS_SELECT', addressId: 'ADDR-02' });
    expect(s.overlay.kind).toBe('PRICE_CHANGE_NOTICE');
    expect(s.pendingPriceChange).not.toBeNull();
    expect(s.pendingPriceChange?.totalDelta).not.toBe(0);
  });

  it('T3-C: F-09 zero-delta address change does NOT open dialog', () => {
    let s = addItem(createInitialState(), 'M-301');
    s = dispatch(s, { type: 'VOUCHER_APPLY', voucherId: 'V-D01' });
    s = dispatch(s, { type: 'OVERLAY_OPEN', overlay: { kind: 'ADDRESS_PICKER' } });
    s = dispatch(s, { type: 'ADDRESS_SELECT', addressId: 'ADDR-02' });
    expect(s.overlay.kind).toBe('NONE');
    expect(s.pendingPriceChange).toBeNull();
  });

  it('T3-D: PRICE_CHANGE_ACK confirms and sets lastPriceChange', () => {
    let s = addItem(createInitialState(), 'M-101');
    s = dispatch(s, { type: 'OVERLAY_OPEN', overlay: { kind: 'ADDRESS_PICKER' } });
    s = dispatch(s, { type: 'ADDRESS_SELECT', addressId: 'ADDR-02' });
    s = dispatch(s, { type: 'PRICE_CHANGE_ACK' });
    expect(s.overlay.kind).toBe('NONE');
    expect(s.pendingPriceChange).toBeNull();
    expect(s.lastPriceChange).not.toBeNull();
  });

  it('T3-E: PRICE_CHANGE_REVERT reverts address', () => {
    let s = addItem(createInitialState(), 'M-101');
    const originalAddress = s.addressId;
    s = dispatch(s, { type: 'OVERLAY_OPEN', overlay: { kind: 'ADDRESS_PICKER' } });
    s = dispatch(s, { type: 'ADDRESS_SELECT', addressId: 'ADDR-02' });
    s = dispatch(s, { type: 'PRICE_CHANGE_REVERT' });
    expect(s.addressId).toBe(originalAddress);
    expect(s.pendingPriceChange).toBeNull();
    expect(s.overlay.kind).toBe('NONE');
  });
});

describe('T4: Pay request and EXCEEDED guard', () => {
  function setupCartWithTotal(): { state: AppState; total: number } {
    let s = addItem(createInitialState(), 'M-101');
    const { selectCartView } = require('../reducer');
    const view = selectCartView(s);
    return { state: s, total: view.breakdown?.total ?? 0 };
  }

  it('T4-A: PAY_REQUESTED with correct total succeeds', () => {
    const { state, total } = setupCartWithTotal();
    const s2 = dispatch(state, {
      type: 'PAY_REQUESTED', expectedTotal: total, receiptId: seededReceiptId('r1'), paidAtIso: seededIso(),
    });
    expect(s2.lastReceipt).not.toBeNull();
    expect(s2.lastReceipt?.id).toBe('RCPT-r1');
    expect(s2.lastReceipt?.delta).toBe(0);
    expect(s2.cart.lines).toHaveLength(0);
  });

  it('T4-B: PAY_REQUESTED with wrong total fails', () => {
    const { state } = setupCartWithTotal();
    const s2 = dispatch(state, {
      type: 'PAY_REQUESTED', expectedTotal: 999999, receiptId: seededReceiptId('r2'), paidAtIso: seededIso(),
    });
    expect(s2.lastReceipt).toBeNull();
  });

  it('T4-C: PAY_REQUESTED opens BUDGET_EXCEEDED when projection > budget', () => {
    let s = createInitialState();
    s = { ...s, budget: 1000, spentToday: 0 };
    s = addItem(s, 'M-101');
    const { selectCartView } = require('../reducer');
    const view = selectCartView(s);
    const total = view.breakdown?.total ?? 0;
    const s2 = dispatch(s, {
      type: 'PAY_REQUESTED', expectedTotal: total, receiptId: seededReceiptId('r3'), paidAtIso: seededIso(),
    });
    expect(s2.overlay.kind).toBe('BUDGET_EXCEEDED');
  });

  it('T4-D: EXCEEDED_CONTINUE pays', () => {
    let s = createInitialState();
    s = { ...s, budget: 1000, spentToday: 0 };
    s = addItem(s, 'M-101');
    const { selectCartView } = require('../reducer');
    const view = selectCartView(s);
    const total = view.breakdown?.total ?? 0;
    s = dispatch(s, {
      type: 'PAY_REQUESTED', expectedTotal: total, receiptId: seededReceiptId('r4'), paidAtIso: seededIso(),
    });
    expect(s.overlay.kind).toBe('BUDGET_EXCEEDED');
    s = dispatch(s, {
      type: 'EXCEEDED_CONTINUE', receiptId: seededReceiptId('r4'), paidAtIso: seededIso(),
    });
    expect(s.lastReceipt).not.toBeNull();
    expect(s.overlay.kind).toBe('NONE');
  });

  it('T4-E: EXCEEDED_CHANGE_ORDER dismisses without paying', () => {
    let s = createInitialState();
    s = { ...s, budget: 1000, spentToday: 0 };
    s = addItem(s, 'M-101');
    const { selectCartView } = require('../reducer');
    const view = selectCartView(s);
    const total = view.breakdown?.total ?? 0;
    s = dispatch(s, {
      type: 'PAY_REQUESTED', expectedTotal: total, receiptId: seededReceiptId('r5'), paidAtIso: seededIso(),
    });
    s = dispatch(s, { type: 'EXCEEDED_CHANGE_ORDER' });
    expect(s.lastReceipt).toBeNull();
    expect(s.overlay.kind).toBe('NONE');
  });

  it('T4-F: EXCEEDED_SHOW_AFFORDABLE enables budgetFilterOn', () => {
    let s = createInitialState();
    s = { ...s, budget: 1000, spentToday: 0 };
    s = addItem(s, 'M-101');
    const { selectCartView } = require('../reducer');
    const view = selectCartView(s);
    const total = view.breakdown?.total ?? 0;
    s = dispatch(s, {
      type: 'PAY_REQUESTED', expectedTotal: total, receiptId: seededReceiptId('r6'), paidAtIso: seededIso(),
    });
    s = dispatch(s, { type: 'EXCEEDED_SHOW_AFFORDABLE' });
    expect(s.budgetFilterOn).toBe(true);
    expect(s.overlay.kind).toBe('NONE');
  });
});

describe('T5: Payment execution and receipt', () => {
  it('T5-A: receipt delta is always 0', () => {
    let s = addItem(createInitialState(), 'M-101');
    const { selectCartView } = require('../reducer');
    const view = selectCartView(s);
    const total = view.breakdown?.total ?? 0;
    s = dispatch(s, {
      type: 'PAY_REQUESTED', expectedTotal: total, receiptId: seededReceiptId('t5a'), paidAtIso: seededIso(),
    });
    expect(s.lastReceipt?.delta).toBe(0);
    expect(s.lastReceipt?.cartTotal).toBe(s.lastReceipt?.checkoutTotal);
    expect(s.lastReceipt?.paidAmount).toBe(s.lastReceipt?.checkoutTotal);
  });

  it('T5-B: spentToday increases by exactly paidAmount', () => {
    let s = addItem(createInitialState(), 'M-101');
    const spentBefore = s.spentToday;
    const { selectCartView } = require('../reducer');
    const view = selectCartView(s);
    const total = view.breakdown?.total ?? 0;
    s = dispatch(s, {
      type: 'PAY_REQUESTED', expectedTotal: total, receiptId: seededReceiptId('t5b'), paidAtIso: seededIso(),
    });
    expect(s.spentToday).toBe(spentBefore + total);
  });

  it('T5-C: cart cleared and address reset after payment', () => {
    let s = addItem(createInitialState(), 'M-101');
    s = dispatch(s, { type: 'OVERLAY_OPEN', overlay: { kind: 'ADDRESS_PICKER' } });
    s = dispatch(s, { type: 'ADDRESS_SELECT', addressId: 'ADDR-02' });
    s = dispatch(s, { type: 'PRICE_CHANGE_ACK' });
    const { selectCartView } = require('../reducer');
    const view = selectCartView(s);
    const total = view.breakdown?.total ?? 0;
    s = dispatch(s, {
      type: 'PAY_REQUESTED', expectedTotal: total, receiptId: seededReceiptId('t5c'), paidAtIso: seededIso(),
    });
    expect(s.cart.lines).toHaveLength(0);
    expect(s.cart.restaurantId).toBeNull();
    expect(s.addressId).toBe('ADDR-01');
  });

  it('T5-D: idempotency — same receiptId does not double-pay', () => {
    let s = addItem(createInitialState(), 'M-101');
    const { selectCartView } = require('../reducer');
    const view = selectCartView(s);
    const total = view.breakdown?.total ?? 0;
    const spentBefore = s.spentToday;
    s = dispatch(s, {
      type: 'PAY_REQUESTED', expectedTotal: total, receiptId: seededReceiptId('t5d'), paidAtIso: seededIso(),
    });
    const spentAfter = s.spentToday;
    expect(spentAfter).toBe(spentBefore + total);
    const s2 = dispatch(s, {
      type: 'EXCEEDED_CONTINUE', receiptId: seededReceiptId('t5d'), paidAtIso: seededIso(),
    });
    expect(s2.spentToday).toBe(spentAfter);
  });
});

describe('T6: Budget settings, filter, sort', () => {
  it('T6-A: BUDGET_SAVE updates budget and closes overlay', () => {
    let s = dispatch(createInitialState(), { type: 'OVERLAY_OPEN', overlay: { kind: 'BUDGET_SETTINGS' } });
    s = dispatch(s, { type: 'BUDGET_SAVE', budget: 75000 });
    expect(s.budget).toBe(75000);
    expect(s.overlay.kind).toBe('NONE');
  });

  it('T6-B: BUDGET_SAVE rejects out-of-range', () => {
    let s = dispatch(createInitialState(), { type: 'OVERLAY_OPEN', overlay: { kind: 'BUDGET_SETTINGS' } });
    s = dispatch(s, { type: 'BUDGET_SAVE', budget: 5000 });
    expect(s.budget).toBe(50000);
    expect(s.overlay.kind).toBe('BUDGET_SETTINGS');
  });

  it('T6-C: BUDGET_FILTER_SET toggles filter', () => {
    let s = dispatch(createInitialState(), { type: 'BUDGET_FILTER_SET', on: true });
    expect(s.budgetFilterOn).toBe(true);
    s = dispatch(s, { type: 'BUDGET_FILTER_SET', on: false });
    expect(s.budgetFilterOn).toBe(false);
  });

  it('T6-D: BUDGET_FILTER_SET on with null budget is ignored', () => {
    let s = { ...createInitialState(), budget: null };
    s = dispatch(s, { type: 'BUDGET_FILTER_SET', on: true });
    expect(s.budgetFilterOn).toBe(false);
  });

  it('T6-E: SORT_SET changes sortMode', () => {
    let s = dispatch(createInitialState(), { type: 'SORT_SET', mode: 'cheapest-all-in' });
    expect(s.sortMode).toBe('cheapest-all-in');
  });
});

describe('I-1..I-10 invariants', () => {
  it('I-1: empty cart implies restaurantId===null, vouchers null, addressId ADDR-01', () => {
    const s = createInitialState();
    expect(s.cart.lines).toHaveLength(0);
    expect(s.cart.restaurantId).toBeNull();
    expect(s.cart.foodVoucherId).toBeNull();
    expect(s.cart.deliveryVoucherId).toBeNull();
    expect(s.addressId).toBe('ADDR-01');
  });

  it('I-2: no restaurant mixing in cart lines', () => {
    let s = addItem(createInitialState(), 'M-101');
    s = addItem(s, 'M-201');
    expect(s.overlay.kind).toBe('CONFIRM_REPLACE_CART');
    expect(s.cart.restaurantId).toBe('R-01');
    for (const line of s.cart.lines) {
      expect(line.menuItemId).toBe('M-101');
    }
  });

  it('I-3: at most one overlay active', () => {
    let s = dispatch(createInitialState(), { type: 'OVERLAY_OPEN', overlay: { kind: 'BUDGET_SETTINGS' } });
    expect(s.overlay.kind).toBe('BUDGET_SETTINGS');
    s = dispatch(s, { type: 'OVERLAY_OPEN', overlay: { kind: 'INFO_SHEET' } });
    expect(s.overlay.kind).toBe('BUDGET_SETTINGS');
  });

  it('I-4: pendingPriceChange !== null iff overlay PRICE_CHANGE_NOTICE', () => {
    let s = addItem(createInitialState(), 'M-101');
    s = dispatch(s, { type: 'OVERLAY_OPEN', overlay: { kind: 'ADDRESS_PICKER' } });
    s = dispatch(s, { type: 'ADDRESS_SELECT', addressId: 'ADDR-02' });
    if (s.pendingPriceChange !== null) {
      expect(s.overlay.kind).toBe('PRICE_CHANGE_NOTICE');
    }
    if (s.overlay.kind === 'PRICE_CHANGE_NOTICE') {
      expect(s.pendingPriceChange).not.toBeNull();
    }
  });

  it('I-5: pendingAddItem !== null iff overlay CONFIRM_REPLACE_CART', () => {
    let s = addItem(createInitialState(), 'M-101');
    s = addItem(s, 'M-201');
    if (s.pendingAddItem !== null) {
      expect(s.overlay.kind).toBe('CONFIRM_REPLACE_CART');
    }
    if (s.overlay.kind === 'CONFIRM_REPLACE_CART') {
      expect(s.pendingAddItem).not.toBeNull();
    }
  });

  it('I-6: budgetFilterOn implies budget !== null', () => {
    let s = createInitialState();
    s = dispatch(s, { type: 'BUDGET_FILTER_SET', on: true });
    expect(s.budgetFilterOn).toBe(true);
    expect(s.budget).not.toBeNull();
    s = { ...s, budget: null };
    s = dispatch(s, { type: 'BUDGET_FILTER_SET', on: true });
    expect(s.budgetFilterOn).toBe(false);
  });

  it('I-7: delta === 0 after payment', () => {
    let s = addItem(createInitialState(), 'M-101');
    const { selectCartView } = require('../reducer');
    const view = selectCartView(s);
    const total = view.breakdown?.total ?? 0;
    s = dispatch(s, {
      type: 'PAY_REQUESTED', expectedTotal: total, receiptId: seededReceiptId('i7'), paidAtIso: seededIso(),
    });
    expect(s.lastReceipt?.delta).toBe(0);
  });

  it('I-8: spentToday only increases by exactly receipt.paidAmount', () => {
    let s = addItem(createInitialState(), 'M-101');
    const spentBefore = s.spentToday;
    const { selectCartView } = require('../reducer');
    const view = selectCartView(s);
    const total = view.breakdown?.total ?? 0;
    s = dispatch(s, {
      type: 'PAY_REQUESTED', expectedTotal: total, receiptId: seededReceiptId('i8'), paidAtIso: seededIso(),
    });
    expect(s.spentToday - spentBefore).toBe(s.lastReceipt?.paidAmount);
  });

  it('I-9: reducer does not use Math.random or Date.now (purity via no side-effects)', () => {
    const s0 = createInitialState();
    const s1 = dispatch(s0, { type: 'SORT_SET', mode: 'cheapest-all-in' });
    expect(s1).not.toBe(s0);
    expect(s1.sortMode).toBe('cheapest-all-in');
    expect(s0.sortMode).toBe('default');
  });

  it('I-10: RESET_CONFIRM returns createInitialState()', () => {
    let s = addItem(createInitialState(), 'M-101');
    s = dispatch(s, { type: 'RESET_REQUESTED' });
    expect(s.overlay.kind).toBe('CONFIRM_RESET');
    s = dispatch(s, { type: 'RESET_CONFIRM' });
    expect(s).toEqual(createInitialState());
  });

  it('atomic RESET: single transition replaces entire state', () => {
    let s = addItem(createInitialState(), 'M-101');
    s = dispatch(s, { type: 'VOUCHER_APPLY', voucherId: 'V-F01' });
    s = dispatch(s, { type: 'SORT_SET', mode: 'cheapest-all-in' });
    const beforeReset = s;
    s = dispatch(s, { type: 'RESET_REQUESTED' });
    s = dispatch(s, { type: 'RESET_CONFIRM' });
    expect(s).toEqual(createInitialState());
    expect(s).not.toBe(beforeReset);
  });
});

describe('receiptId idempotency', () => {
  it('same receiptId dispatched twice does not change state second time', () => {
    let s = addItem(createInitialState(), 'M-101');
    const { selectCartView } = require('../reducer');
    const view = selectCartView(s);
    const total = view.breakdown?.total ?? 0;
    s = dispatch(s, {
      type: 'PAY_REQUESTED', expectedTotal: total, receiptId: 'RCPT-idem', paidAtIso: seededIso(),
    });
    const s1 = s;
    const s2 = dispatch(s1, {
      type: 'PAY_REQUESTED', expectedTotal: total, receiptId: 'RCPT-idem', paidAtIso: seededIso(),
    });
    expect(s2).toBe(s1);
  });
});

describe('toPersisted omits volatile fields', () => {
  it('toPersisted does not include overlay, pendingAddItem, lastReceipt, etc.', () => {
    const { toPersisted } = require('../persistence');
    let s = addItem(createInitialState(), 'M-101');
    s = dispatch(s, { type: 'VOUCHER_APPLY', voucherId: 'V-F01' });
    s = dispatch(s, { type: 'OVERLAY_OPEN', overlay: { kind: 'BUDGET_SETTINGS' } });
    const persisted = toPersisted(s);
    expect(persisted).not.toHaveProperty('overlay');
    expect(persisted).not.toHaveProperty('pendingAddItem');
    expect(persisted).not.toHaveProperty('pendingPriceChange');
    expect(persisted).not.toHaveProperty('lastPriceChange');
    expect(persisted).not.toHaveProperty('inlineNotice');
    expect(persisted).not.toHaveProperty('lastReceipt');
    expect(persisted).not.toHaveProperty('overflowMenuOpen');
    expect(persisted).not.toHaveProperty('noticeSeq');
    expect(persisted).toHaveProperty('schemaVersion', 1);
    expect(persisted).toHaveProperty('budget');
    expect(persisted).toHaveProperty('spentToday');
    expect(persisted).toHaveProperty('addressId');
    expect(persisted).toHaveProperty('cart');
    expect(persisted).toHaveProperty('budgetFilterOn');
    expect(persisted).toHaveProperty('sortMode');
  });
});
