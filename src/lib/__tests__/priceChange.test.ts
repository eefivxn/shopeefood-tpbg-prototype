import { describe, it, expect } from 'vitest';
import { RESTAURANTS } from '../data/restaurants';
import { MENU_ITEMS } from '../data/menuItems';
import { VOUCHERS } from '../data/vouchers';
import { ADDRESSES } from '../data/addresses';
import { calculateOrder } from '../lib/pricing';
import { buildPendingPriceChange, priceChangeCauseText } from '../lib/priceChange';
import { evaluateBudget } from '../lib/budget';
import type { CalculateOrderInput } from '../types/pricing';
import type { AddressId, Rupiah } from '../types/domain';

function order(
  restaurantId: keyof typeof RESTAURANTS,
  lines: ReadonlyArray<{ item: keyof typeof MENU_ITEMS; qty: number }>,
  addressId: keyof typeof ADDRESSES = 'ADDR-01',
  foodVoucher: keyof typeof VOUCHERS | null = null,
  deliveryVoucher: keyof typeof VOUCHERS | null = null,
): CalculateOrderInput {
  return {
    restaurant: RESTAURANTS[restaurantId],
    lines: lines.map((l) => ({ item: MENU_ITEMS[l.item], qty: l.qty })),
    address: ADDRESSES[addressId],
    foodVoucher: foodVoucher === null ? null : VOUCHERS[foodVoucher],
    deliveryVoucher: deliveryVoucher === null ? null : VOUCHERS[deliveryVoucher],
  };
}

const BUDGET: Rupiah = 50000;
const SPENT: Rupiah = 12000;

describe('address vectors A-01..A-10', () => {
  it('A-01: Contoh C ADDR-01, deliveryFee 6000, total 28500, projection 40500 WARN', () => {
    const b = calculateOrder(order('R-02', [{ item: 'M-201', qty: 1 }, { item: 'M-203', qty: 1 }, { item: 'M-204', qty: 1 }], 'ADDR-01', 'V-F01', 'V-D02'));
    expect(b.deliveryFee).toBe(6000);
    expect(b.total).toBe(28500);
    const e = evaluateBudget(BUDGET, SPENT, b.total);
    expect(e?.status).toBe('WARN');
    expect(e?.projection).toBe(40500);
  });

  it('A-02: Contoh C ADDR-02, deliveryFee 9000, total 31500, projection 43500 WARN', () => {
    const b = calculateOrder(order('R-02', [{ item: 'M-201', qty: 1 }, { item: 'M-203', qty: 1 }, { item: 'M-204', qty: 1 }], 'ADDR-02', 'V-F01', 'V-D02'));
    expect(b.deliveryFee).toBe(9000);
    expect(b.total).toBe(31500);
    const e = evaluateBudget(BUDGET, SPENT, b.total);
    expect(e?.status).toBe('WARN');
    expect(e?.projection).toBe(43500);
  });

  it('A-03: Contoh C ADDR-03, deliveryFee 11000, total 33500, projection 45500 WARN', () => {
    const b = calculateOrder(order('R-02', [{ item: 'M-201', qty: 1 }, { item: 'M-203', qty: 1 }, { item: 'M-204', qty: 1 }], 'ADDR-03', 'V-F01', 'V-D02'));
    expect(b.deliveryFee).toBe(11000);
    expect(b.total).toBe(33500);
    const e = evaluateBudget(BUDGET, SPENT, b.total);
    expect(e?.status).toBe('WARN');
    expect(e?.projection).toBe(45500);
  });

  it('A-04: Contoh B ADDR-02, deliveryFee 15000, total 50000, projection 62000 EXCEEDED', () => {
    const b = calculateOrder(order('R-01', [{ item: 'M-101', qty: 1 }, { item: 'M-104', qty: 1 }], 'ADDR-02', 'V-F01', 'V-D01'));
    expect(b.deliveryFee).toBe(15000);
    expect(b.total).toBe(50000);
    const e = evaluateBudget(BUDGET, SPENT, b.total);
    expect(e?.status).toBe('EXCEEDED');
    expect(e?.projection).toBe(62000);
  });

  it('A-05: Contoh B ADDR-03, deliveryFee 17000, total 52000, projection 64000 EXCEEDED', () => {
    const b = calculateOrder(order('R-01', [{ item: 'M-101', qty: 1 }, { item: 'M-104', qty: 1 }], 'ADDR-03', 'V-F01', 'V-D01'));
    expect(b.deliveryFee).toBe(17000);
    expect(b.total).toBe(52000);
    const e = evaluateBudget(BUDGET, SPENT, b.total);
    expect(e?.status).toBe('EXCEEDED');
    expect(e?.projection).toBe(64000);
  });

  it('A-06: R-03 M-301 ADDR-02, deliveryFee 7000, total 28000, projection 40000 WARN (exactly 80%)', () => {
    const b = calculateOrder(order('R-03', [{ item: 'M-301', qty: 1 }], 'ADDR-02'));
    expect(b.deliveryFee).toBe(7000);
    expect(b.total).toBe(28000);
    const e = evaluateBudget(BUDGET, SPENT, b.total);
    expect(e?.status).toBe('WARN');
    expect(e?.projection).toBe(40000);
  });

  it('A-07: R-03 M-301 ADDR-03, deliveryFee 9000, total 30000, projection 42000 WARN', () => {
    const b = calculateOrder(order('R-03', [{ item: 'M-301', qty: 1 }], 'ADDR-03'));
    expect(b.deliveryFee).toBe(9000);
    expect(b.total).toBe(30000);
    const e = evaluateBudget(BUDGET, SPENT, b.total);
    expect(e?.status).toBe('WARN');
    expect(e?.projection).toBe(42000);
  });

  it('A-08: R-03 M-301+V-D02 ADDR-01, deliveryFee 4000, total 21000, projection 33000 OK', () => {
    const b = calculateOrder(order('R-03', [{ item: 'M-301', qty: 1 }], 'ADDR-01', null, 'V-D02'));
    expect(b.deliveryFee).toBe(4000);
    expect(b.total).toBe(21000);
    const e = evaluateBudget(BUDGET, SPENT, b.total);
    expect(e?.status).toBe('OK');
    expect(e?.projection).toBe(33000);
  });

  it('A-09: R-03 M-301+V-D02 ADDR-02, deliveryFee 7000, total 23000, projection 35000 OK', () => {
    const b = calculateOrder(order('R-03', [{ item: 'M-301', qty: 1 }], 'ADDR-02', null, 'V-D02'));
    expect(b.deliveryFee).toBe(7000);
    expect(b.total).toBe(23000);
    const e = evaluateBudget(BUDGET, SPENT, b.total);
    expect(e?.status).toBe('OK');
    expect(e?.projection).toBe(35000);
  });
});

describe('buildPendingPriceChange', () => {
  it('A-08 to A-09: totalDelta = +2000, deliveryFee line +3000, delivery discount line -1000', () => {
    const before = calculateOrder(order('R-03', [{ item: 'M-301', qty: 1 }], 'ADDR-01', null, 'V-D02'));
    const after = calculateOrder(order('R-03', [{ item: 'M-301', qty: 1 }], 'ADDR-02', null, 'V-D02'));
    const pending = buildPendingPriceChange({
      previousAddressId: 'ADDR-01',
      nextAddressId: 'ADDR-02',
      before,
      after,
      budget: BUDGET,
      spentToday: SPENT,
    });
    expect(pending.totalDelta).toBe(2000);
    expect(pending.previousTotal).toBe(21000);
    expect(pending.nextTotal).toBe(23000);
    const feeLine = pending.lines.find((l) => l.key === 'DELIVERY_FEE');
    expect(feeLine?.totalEffect).toBe(3000);
    expect(feeLine?.changed).toBe(true);
    const discLine = pending.lines.find((l) => l.key === 'DELIVERY_DISCOUNT');
    expect(discLine?.totalEffect).toBe(-1000);
    expect(discLine?.changed).toBe(true);
    const sumEffects = pending.lines.reduce((acc, l) => acc + l.totalEffect, 0);
    expect(sumEffects).toBe(pending.totalDelta);
  });

  it('A-10 (F-09 zero-delta): R-03 M-301+M-304+V-D01 ADDR-01→ADDR-02, totalDelta = 0, no dialog', () => {
    const before = calculateOrder(order('R-03', [{ item: 'M-301', qty: 1 }, { item: 'M-304', qty: 1 }], 'ADDR-01', null, 'V-D01'));
    const after = calculateOrder(order('R-03', [{ item: 'M-301', qty: 1 }, { item: 'M-304', qty: 1 }], 'ADDR-02', null, 'V-D01'));
    const pending = buildPendingPriceChange({
      previousAddressId: 'ADDR-01',
      nextAddressId: 'ADDR-02',
      before,
      after,
      budget: BUDGET,
      spentToday: SPENT,
    });
    expect(before.total).toBe(28000);
    expect(after.total).toBe(28000);
    expect(pending.totalDelta).toBe(0);
  });

  it('priceChangeCauseText uses address label', () => {
    const text = priceChangeCauseText('ADDR-02');
    expect(text).toContain(ADDRESSES['ADDR-02'].label);
  });

  it('status transition A-06: OK to WARN captured', () => {
    const before = calculateOrder(order('R-03', [{ item: 'M-301', qty: 1 }], 'ADDR-01'));
    const after = calculateOrder(order('R-03', [{ item: 'M-301', qty: 1 }], 'ADDR-02'));
    const pending = buildPendingPriceChange({
      previousAddressId: 'ADDR-01',
      nextAddressId: 'ADDR-02',
      before,
      after,
      budget: BUDGET,
      spentToday: SPENT,
    });
    expect(pending.statusBefore).toBe('OK');
    expect(pending.statusAfter).toBe('WARN');
  });
});
