import { describe, it, expect } from 'vitest';
import { RESTAURANTS } from '../../data/restaurants';
import { MENU_ITEMS } from '../../data/menuItems';
import { VOUCHERS } from '../../data/vouchers';
import { ADDRESSES } from '../../data/addresses';
import { calculateOrder, estimateMenuItemAllIn, estimateRestaurantAllIn, computeVoucherDiscount, computeSubtotal, EMPTY_BREAKDOWN } from '../../lib/pricing';
import { floorDiv } from '../../lib/intMath';
import type { CalculateOrderInput } from '../../types/pricing';
import type { MenuItem, Rupiah, Voucher } from '../../types/domain';

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

function expectBreakdown(
  result: ReturnType<typeof calculateOrder>,
  expected: { subtotal: Rupiah; tax: Rupiah; packaging: Rupiah; deliveryFee: Rupiah; serviceFee: Rupiah; foodDiscount: Rupiah; deliveryDiscount: Rupiah; total: Rupiah },
) {
  expect(result.isEmpty).toBe(false);
  expect(result.subtotal).toBe(expected.subtotal);
  expect(result.tax).toBe(expected.tax);
  expect(result.packaging).toBe(expected.packaging);
  expect(result.deliveryFee).toBe(expected.deliveryFee);
  expect(result.serviceFee).toBe(expected.serviceFee);
  expect(result.foodDiscount).toBe(expected.foodDiscount);
  expect(result.deliveryDiscount).toBe(expected.deliveryDiscount);
  expect(result.total).toBe(expected.total);
}

describe('calculateOrder pricing vectors P-01..P-13', () => {
  it('P-01 (Contoh A): R-01 M-101, no vouchers, total 50000', () => {
    const result = calculateOrder(order('R-01', [{ item: 'M-101', qty: 1 }]));
    expectBreakdown(result, { subtotal: 30000, tax: 3000, packaging: 2000, deliveryFee: 12000, serviceFee: 3000, foodDiscount: 0, deliveryDiscount: 0, total: 50000 });
  });

  it('P-02 (AC-03.1): R-01 M-101+M-104, no vouchers, total 60000', () => {
    const result = calculateOrder(order('R-01', [{ item: 'M-101', qty: 1 }, { item: 'M-104', qty: 1 }]));
    expectBreakdown(result, { subtotal: 38000, tax: 3000, packaging: 4000, deliveryFee: 12000, serviceFee: 3000, foodDiscount: 0, deliveryDiscount: 0, total: 60000 });
  });

  it('P-03 (AC-03.2): R-01 M-101+M-104 with V-F01, total 55000', () => {
    const result = calculateOrder(order('R-01', [{ item: 'M-101', qty: 1 }, { item: 'M-104', qty: 1 }], 'ADDR-01', 'V-F01'));
    expectBreakdown(result, { subtotal: 38000, tax: 3000, packaging: 4000, deliveryFee: 12000, serviceFee: 3000, foodDiscount: 5000, deliveryDiscount: 0, total: 55000 });
  });

  it('P-04 (Contoh B): R-01 M-101+M-104 with V-F01+V-D01, total 47000', () => {
    const result = calculateOrder(order('R-01', [{ item: 'M-101', qty: 1 }, { item: 'M-104', qty: 1 }], 'ADDR-01', 'V-F01', 'V-D01'));
    expectBreakdown(result, { subtotal: 38000, tax: 3000, packaging: 4000, deliveryFee: 12000, serviceFee: 3000, foodDiscount: 5000, deliveryDiscount: 8000, total: 47000 });
  });

  it('P-05 (Contoh C): R-02 M-201+M-203+M-204 with V-F01+V-D02, total 28500', () => {
    const result = calculateOrder(order('R-02', [{ item: 'M-201', qty: 1 }, { item: 'M-203', qty: 1 }, { item: 'M-204', qty: 1 }], 'ADDR-01', 'V-F01', 'V-D02'));
    expectBreakdown(result, { subtotal: 25000, tax: 1500, packaging: 3000, deliveryFee: 6000, serviceFee: 3000, foodDiscount: 5000, deliveryDiscount: 5000, total: 28500 });
  });

  it('P-06: R-02 M-201+M-203+M-204 no vouchers, total 38500', () => {
    const result = calculateOrder(order('R-02', [{ item: 'M-201', qty: 1 }, { item: 'M-203', qty: 1 }, { item: 'M-204', qty: 1 }]));
    expectBreakdown(result, { subtotal: 25000, tax: 1500, packaging: 3000, deliveryFee: 6000, serviceFee: 3000, foodDiscount: 0, deliveryDiscount: 0, total: 38500 });
  });

  it('P-07 (TS-04): R-02 M-201+M-203 with V-D02 only, total 27500', () => {
    const result = calculateOrder(order('R-02', [{ item: 'M-201', qty: 1 }, { item: 'M-203', qty: 1 }], 'ADDR-01', null, 'V-D02'));
    expectBreakdown(result, { subtotal: 20000, tax: 1500, packaging: 2000, deliveryFee: 6000, serviceFee: 3000, foodDiscount: 0, deliveryDiscount: 5000, total: 27500 });
  });

  it('P-08 (TS-05): R-03 M-301 no vouchers, tax 0, total 25000', () => {
    const result = calculateOrder(order('R-03', [{ item: 'M-301', qty: 1 }]));
    expectBreakdown(result, { subtotal: 18000, tax: 0, packaging: 1000, deliveryFee: 4000, serviceFee: 2000, foodDiscount: 0, deliveryDiscount: 0, total: 25000 });
  });

  it('P-09: R-04 M-401x2+M-402 no vouchers, total 67000', () => {
    const result = calculateOrder(order('R-04', [{ item: 'M-401', qty: 2 }, { item: 'M-402', qty: 1 }]));
    expectBreakdown(result, { subtotal: 50000, tax: 3000, packaging: 3000, deliveryFee: 8000, serviceFee: 3000, foodDiscount: 0, deliveryDiscount: 0, total: 67000 });
  });

  it('P-10 (percentage): R-01 M-101+M-104 with V-F02, foodDiscount 7600, total 52400', () => {
    const result = calculateOrder(order('R-01', [{ item: 'M-101', qty: 1 }, { item: 'M-104', qty: 1 }], 'ADDR-01', 'V-F02'));
    expectBreakdown(result, { subtotal: 38000, tax: 3000, packaging: 4000, deliveryFee: 12000, serviceFee: 3000, foodDiscount: 7600, deliveryDiscount: 0, total: 52400 });
  });

  it('P-11 (percentage cap, ERRATA F-01): R-01 M-101+M-102+M-103 with V-F02, foodDiscount 8000 (capped), tax 4500, total 62500', () => {
    const result = calculateOrder(order('R-01', [{ item: 'M-101', qty: 1 }, { item: 'M-102', qty: 1 }, { item: 'M-103', qty: 1 }], 'ADDR-01', 'V-F02'));
    expectBreakdown(result, { subtotal: 45000, tax: 4500, packaging: 6000, deliveryFee: 12000, serviceFee: 3000, foodDiscount: 8000, deliveryDiscount: 0, total: 62500 });
  });

  it('P-12 (delivery discount cap): R-03 M-301+M-304 with V-D01, deliveryDiscount 4000, total 28000', () => {
    const result = calculateOrder(order('R-03', [{ item: 'M-301', qty: 1 }, { item: 'M-304', qty: 1 }], 'ADDR-01', null, 'V-D01'));
    expectBreakdown(result, { subtotal: 24000, tax: 0, packaging: 2000, deliveryFee: 4000, serviceFee: 2000, foodDiscount: 0, deliveryDiscount: 4000, total: 28000 });
  });

  it('P-13 (V-F03): R-05 M-503x2 with V-F03, foodDiscount 10000, total 90000', () => {
    const result = calculateOrder(order('R-05', [{ item: 'M-503', qty: 2 }], 'ADDR-01', 'V-F03'));
    expectBreakdown(result, { subtotal: 70000, tax: 7000, packaging: 4000, deliveryFee: 15000, serviceFee: 4000, foodDiscount: 10000, deliveryDiscount: 0, total: 90000 });
  });

  it('empty cart returns EMPTY_BREAKDOWN', () => {
    const result = calculateOrder({ restaurant: RESTAURANTS['R-01'], lines: [], address: ADDRESSES['ADDR-01'], foodVoucher: null, deliveryVoucher: null });
    expect(result).toBe(EMPTY_BREAKDOWN);
  });

  it('throws on item from wrong restaurant', () => {
    expect(() =>
      calculateOrder(order('R-01', [{ item: 'M-201', qty: 1 }])),
    ).toThrow(RangeError);
  });

  it('throws on invalid qty', () => {
    expect(() =>
      calculateOrder({ restaurant: RESTAURANTS['R-01'], lines: [{ item: MENU_ITEMS['M-101'], qty: 0 }], address: ADDRESSES['ADDR-01'], foodVoucher: null, deliveryVoucher: null }),
    ).toThrow(RangeError);
  });
});

describe('BR-06 tax rounding (round half up)', () => {
  it('floorDiv(taxable*10+50,100) for 15000 → 1500', () => {
    expect(floorDiv(15000 * 10 + 50, 100)).toBe(1500);
  });

  it('floorDiv(taxable*10+50,100) for 30000 → 3000', () => {
    expect(floorDiv(30000 * 10 + 50, 100)).toBe(3000);
  });

  it('floorDiv(taxable*10+50,100) for 45000 → 4500 (F-01 errata)', () => {
    expect(floorDiv(45000 * 10 + 50, 100)).toBe(4500);
  });

  it('small values: 15 → 2, 14 → 1, 5 → 1, 4 → 0', () => {
    expect(floorDiv(15 * 10 + 50, 100)).toBe(2);
    expect(floorDiv(14 * 10 + 50, 100)).toBe(1);
    expect(floorDiv(5 * 10 + 50, 100)).toBe(1);
    expect(floorDiv(4 * 10 + 50, 100)).toBe(0);
  });
});

describe('computeVoucherDiscount', () => {
  it('FIXED food voucher capped by subtotal', () => {
    const v: Voucher = VOUCHERS['V-F01'];
    expect(computeVoucherDiscount(v, { subtotal: 38000, deliveryFee: 12000 })).toBe(5000);
  });

  it('PERCENT food voucher with cap', () => {
    const v: Voucher = VOUCHERS['V-F02'];
    expect(computeVoucherDiscount(v, { subtotal: 38000, deliveryFee: 12000 })).toBe(7600);
  });

  it('PERCENT food voucher capped by maxDiscount', () => {
    const v: Voucher = VOUCHERS['V-F02'];
    expect(computeVoucherDiscount(v, { subtotal: 45000, deliveryFee: 12000 })).toBe(8000);
  });

  it('delivery voucher capped by deliveryFee', () => {
    const v: Voucher = VOUCHERS['V-D01'];
    expect(computeVoucherDiscount(v, { subtotal: 24000, deliveryFee: 4000 })).toBe(4000);
  });
});

describe('estimateMenuItemAllIn', () => {
  it('D-01: R-01 M-101 estimate = 50000', () => {
    expect(estimateMenuItemAllIn(RESTAURANTS['R-01'], MENU_ITEMS['M-101'])).toBe(50000);
  });

  it('D-02: R-01 M-104 estimate = 25000', () => {
    expect(estimateMenuItemAllIn(RESTAURANTS['R-01'], MENU_ITEMS['M-104'])).toBe(25000);
  });

  it('R-02 M-201 estimate = 26500', () => {
    expect(estimateMenuItemAllIn(RESTAURANTS['R-02'], MENU_ITEMS['M-201'])).toBe(26500);
  });

  it('R-03 M-301 estimate = 25000', () => {
    expect(estimateMenuItemAllIn(RESTAURANTS['R-03'], MENU_ITEMS['M-301'])).toBe(25000);
  });

  it('R-04 M-401 estimate = 28500', () => {
    expect(estimateMenuItemAllIn(RESTAURANTS['R-04'], MENU_ITEMS['M-401'])).toBe(28500);
  });

  it('R-05 M-501 estimate = 41900', () => {
    expect(estimateMenuItemAllIn(RESTAURANTS['R-05'], MENU_ITEMS['M-501'])).toBe(41900);
  });

  it('R-06 M-601 estimate = 35000', () => {
    expect(estimateMenuItemAllIn(RESTAURANTS['R-06'], MENU_ITEMS['M-601'])).toBe(35000);
  });
});

describe('estimateRestaurantAllIn', () => {
  it('delegates to estimateMenuItemAllIn with signature item', () => {
    for (const r of Object.values(RESTAURANTS)) {
      const sig: MenuItem = MENU_ITEMS[r.signatureMenuItemId];
      expect(estimateRestaurantAllIn(r, sig)).toBe(estimateMenuItemAllIn(r, sig));
    }
  });
});

describe('computeSubtotal', () => {
  it('computes sum of netPrice * qty', () => {
    const lines = [{ item: MENU_ITEMS['M-101'], qty: 1 }, { item: MENU_ITEMS['M-104'], qty: 1 }];
    expect(computeSubtotal(lines)).toBe(38000);
  });

  it('M-201 net 15000 * 2 = 30000', () => {
    const lines = [{ item: MENU_ITEMS['M-201'], qty: 2 }];
    expect(computeSubtotal(lines)).toBe(30000);
  });
});
