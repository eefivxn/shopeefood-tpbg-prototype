import { describe, it, expect } from 'vitest';
import { RESTAURANTS } from '../data/restaurants';
import { MENU_ITEMS } from '../data/menuItems';
import { VOUCHERS } from '../data/vouchers';
import { calculateOrder, evaluateVoucher, computeVoucherDiscount } from '../lib/pricing';
import { voucherReasonMessage } from '../lib/voucherCopy';
import type { CalculateOrderInput } from '../types/pricing';
import type { Voucher } from '../types/domain';

function order(
  restaurantId: keyof typeof RESTAURANTS,
  lines: ReadonlyArray<{ item: keyof typeof MENU_ITEMS; qty: number }>,
  addressId: 'ADDR-01' | 'ADDR-02' | 'ADDR-03' = 'ADDR-01',
  foodVoucher: keyof typeof VOUCHERS | null = null,
  deliveryVoucher: keyof typeof VOUCHERS | null = null,
): CalculateOrderInput {
  return {
    restaurant: RESTAURANTS[restaurantId],
    lines: lines.map((l) => ({ item: MENU_ITEMS[l.item], qty: l.qty })),
    address: { id: addressId, label: '', deliveryFeeDelta: 0 },
    foodVoucher: foodVoucher === null ? null : VOUCHERS[foodVoucher],
    deliveryVoucher: deliveryVoucher === null ? null : VOUCHERS[deliveryVoucher],
  };
}

describe('voucher eligibility vectors E-01..E-07', () => {
  it('E-01: V-F01 (min 25000) at subtotal 20000 → not eligible, shortfall 5000', () => {
    const v: Voucher = VOUCHERS['V-F01'];
    const result = evaluateVoucher(v, { restaurantId: 'R-02', subtotal: 20000 });
    expect(result.eligible).toBe(false);
    if (!result.eligible && result.reason === 'MIN_SUBTOTAL') {
      expect(result.shortfall).toBe(5000);
    }
  });

  it('E-02: V-F01 at subtotal 25000 → eligible (inclusive)', () => {
    const v: Voucher = VOUCHERS['V-F01'];
    const result = evaluateVoucher(v, { restaurantId: 'R-02', subtotal: 25000 });
    expect(result.eligible).toBe(true);
  });

  it('E-03: V-F02 (min 30000) at subtotal 27000 → not eligible, shortfall 3000', () => {
    const v: Voucher = VOUCHERS['V-F02'];
    const result = evaluateVoucher(v, { restaurantId: 'R-02', subtotal: 27000 });
    expect(result.eligible).toBe(false);
    if (!result.eligible && result.reason === 'MIN_SUBTOTAL') {
      expect(result.shortfall).toBe(3000);
    }
  });

  it('E-04: V-D01 (min 20000) at subtotal 15000 → not eligible, shortfall 5000', () => {
    const v: Voucher = VOUCHERS['V-D01'];
    const result = evaluateVoucher(v, { restaurantId: 'R-02', subtotal: 15000 });
    expect(result.eligible).toBe(false);
    if (!result.eligible && result.reason === 'MIN_SUBTOTAL') {
      expect(result.shortfall).toBe(5000);
    }
  });

  it('E-05: V-D02 (min 15000) at subtotal 15000 → eligible (inclusive)', () => {
    const v: Voucher = VOUCHERS['V-D02'];
    const result = evaluateVoucher(v, { restaurantId: 'R-02', subtotal: 15000 });
    expect(result.eligible).toBe(true);
  });

  it('E-06: V-F03 (min 40000) at subtotal 35000 → not eligible, shortfall 5000', () => {
    const v: Voucher = VOUCHERS['V-F03'];
    const result = evaluateVoucher(v, { restaurantId: 'R-05', subtotal: 35000 });
    expect(result.eligible).toBe(false);
    if (!result.eligible && result.reason === 'MIN_SUBTOTAL') {
      expect(result.shortfall).toBe(5000);
    }
  });

  it('E-07: V-F03 on R-01 (wrong restaurant) → RESTAURANT_MISMATCH', () => {
    const v: Voucher = VOUCHERS['V-F03'];
    const result = evaluateVoucher(v, { restaurantId: 'R-01', subtotal: 45000 });
    expect(result.eligible).toBe(false);
    if (!result.eligible && result.reason === 'RESTAURANT_MISMATCH') {
      expect(result.onlyRestaurantId).toBe('R-05');
    }
  });
});

describe('voucherReasonMessage', () => {
  it('MIN_SUBTOTAL message format', () => {
    const msg = voucherReasonMessage({ eligible: false, reason: 'MIN_SUBTOTAL', shortfall: 5000 });
    expect(msg).toBe('Kurang Rp5.000 dari minimum belanja.');
  });

  it('RESTAURANT_MISMATCH message format', () => {
    const msg = voucherReasonMessage({ eligible: false, reason: 'RESTAURANT_MISMATCH', onlyRestaurantId: 'R-05' });
    expect(msg).toBe('Hanya berlaku di Kopi & Roti Senja.');
  });
});

describe('rejected vouchers in calculateOrder', () => {
  it('rejected voucher does not reduce total', () => {
    const result = calculateOrder(order('R-02', [{ item: 'M-201', qty: 1 }], 'ADDR-01', 'V-F01'));
    expect(result.foodDiscount).toBe(0);
    expect(result.appliedFoodVoucher).toBeNull();
    expect(result.rejectedVouchers.length).toBe(1);
    expect(result.rejectedVouchers[0]?.voucherId).toBe('V-F01');
  });

  it('delivery voucher rejected when subtotal below min', () => {
    const result = calculateOrder(order('R-02', [{ item: 'M-201', qty: 1 }], 'ADDR-01', null, 'V-D01'));
    expect(result.deliveryDiscount).toBe(0);
    expect(result.rejectedVouchers.length).toBe(1);
    expect(result.rejectedVouchers[0]?.voucherId).toBe('V-D01');
  });
});

describe('computeVoucherDiscount additional cases', () => {
  it('PERCENT discount floor', () => {
    const v: Voucher = VOUCHERS['V-F02'];
    expect(computeVoucherDiscount(v, { subtotal: 38000, deliveryFee: 12000 })).toBe(7600);
  });
});
