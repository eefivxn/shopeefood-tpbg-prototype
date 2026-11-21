import { describe, it, expect } from 'vitest';
import { RESTAURANTS, RESTAURANT_LIST } from '../../data/restaurants';
import { MENU_ITEMS, MENU_ITEM_LIST, getMenuItemsByRestaurant } from '../../data/menuItems';
import { VOUCHERS, VOUCHER_LIST, listVouchersForSlot } from '../../data/vouchers';
import { ADDRESSES, ADDRESS_LIST, DEFAULT_ADDRESS_ID } from '../../data/addresses';
import { DEFAULT_PROFILE } from '../../data/profile';
import { getNetPrice } from '../../types/domain';
import type { RestaurantId, MenuItemId, VoucherId } from '../../types/domain';

describe('mock data integrity', () => {
  it('has exactly 6 restaurants R-01..R-06', () => {
    expect(RESTAURANT_LIST.length).toBe(6);
    const ids = RESTAURANT_LIST.map((r) => r.id).sort();
    expect(ids).toEqual(['R-01', 'R-02', 'R-03', 'R-04', 'R-05', 'R-06']);
  });

  it('R-01 values match PRD 9.2', () => {
    const r = RESTAURANTS['R-01'];
    expect(r.name).toBe('Ayam Bakar Pak Dhe');
    expect(r.category).toBe('Ayam & Bakaran');
    expect(r.distanceLabel).toBe('3,2 km');
    expect(r.baseDeliveryFee).toBe(12000);
    expect(r.serviceFee).toBe(3000);
    expect(r.packagingFeePerItem).toBe(2000);
    expect(r.taxRatePercent).toBe(10);
    expect(r.signatureMenuItemId).toBe('M-101');
  });

  it('R-02 values match PRD 9.2', () => {
    const r = RESTAURANTS['R-02'];
    expect(r.name).toBe('Geprek Bu Rina');
    expect(r.baseDeliveryFee).toBe(6000);
    expect(r.serviceFee).toBe(3000);
    expect(r.packagingFeePerItem).toBe(1000);
    expect(r.signatureMenuItemId).toBe('M-201');
  });

  it('R-03 values match PRD 9.2', () => {
    const r = RESTAURANTS['R-03'];
    expect(r.name).toBe('Nasi Goreng Mas Joko');
    expect(r.baseDeliveryFee).toBe(4000);
    expect(r.serviceFee).toBe(2000);
    expect(r.packagingFeePerItem).toBe(1000);
    expect(r.signatureMenuItemId).toBe('M-301');
  });

  it('R-04 values match PRD 9.2', () => {
    const r = RESTAURANTS['R-04'];
    expect(r.name).toBe('Bakso Pak Slamet');
    expect(r.baseDeliveryFee).toBe(8000);
    expect(r.serviceFee).toBe(3000);
    expect(r.packagingFeePerItem).toBe(1000);
    expect(r.signatureMenuItemId).toBe('M-401');
  });

  it('R-05 values match PRD 9.2', () => {
    const r = RESTAURANTS['R-05'];
    expect(r.name).toBe('Kopi & Roti Senja');
    expect(r.baseDeliveryFee).toBe(15000);
    expect(r.serviceFee).toBe(4000);
    expect(r.packagingFeePerItem).toBe(2000);
    expect(r.signatureMenuItemId).toBe('M-501');
  });

  it('R-06 values match PRD 9.2', () => {
    const r = RESTAURANTS['R-06'];
    expect(r.name).toBe('Sate Ayam Madura');
    expect(r.baseDeliveryFee).toBe(9000);
    expect(r.serviceFee).toBe(3000);
    expect(r.packagingFeePerItem).toBe(1000);
    expect(r.signatureMenuItemId).toBe('M-601');
  });

  it('all restaurants have taxRatePercent 10', () => {
    for (const r of RESTAURANT_LIST) {
      expect(r.taxRatePercent).toBe(10);
    }
  });

  it('has exactly 24 menu items M-101..M-604', () => {
    expect(MENU_ITEM_LIST.length).toBe(24);
    const expectedIds: MenuItemId[] = [
      'M-101', 'M-102', 'M-103', 'M-104',
      'M-201', 'M-202', 'M-203', 'M-204',
      'M-301', 'M-302', 'M-303', 'M-304',
      'M-401', 'M-402', 'M-403', 'M-404',
      'M-501', 'M-502', 'M-503', 'M-504',
      'M-601', 'M-602', 'M-603', 'M-604',
    ];
    const actualIds = MENU_ITEM_LIST.map((m) => m.id).sort();
    expect(actualIds).toEqual([...expectedIds].sort());
  });

  it('M-101 values match PRD 9.3', () => {
    const m = MENU_ITEMS['M-101'];
    expect(m.name).toBe('Paket Ayam Bakar Promo');
    expect(m.listPrice).toBe(30000);
    expect(m.discount).toBe(0);
    expect(m.taxStatus).toBe('NOT_INCLUDED');
    expect(m.restaurantId).toBe('R-01');
  });

  it('M-201 has discount 2000 (net 15000)', () => {
    const m = MENU_ITEMS['M-201'];
    expect(m.listPrice).toBe(17000);
    expect(m.discount).toBe(2000);
    expect(getNetPrice(m)).toBe(15000);
    expect(m.taxStatus).toBe('NOT_INCLUDED');
  });

  it('M-501 has discount 3000 (net 19000)', () => {
    const m = MENU_ITEMS['M-501'];
    expect(m.listPrice).toBe(22000);
    expect(m.discount).toBe(3000);
    expect(getNetPrice(m)).toBe(19000);
    expect(m.taxStatus).toBe('NOT_INCLUDED');
  });

  it('R-03 all items are INCLUDED', () => {
    const items = getMenuItemsByRestaurant('R-03');
    for (const item of items) {
      expect(item.taxStatus).toBe('INCLUDED');
    }
  });

  it('each menu item belongs to its restaurant', () => {
    for (const item of MENU_ITEM_LIST) {
      expect(getMenuItemsByRestaurant(item.restaurantId).some((m) => m.id === item.id)).toBe(true);
    }
  });

  it('signature menu items exist and belong to their restaurant', () => {
    for (const r of RESTAURANT_LIST) {
      const sig = MENU_ITEMS[r.signatureMenuItemId];
      expect(sig).toBeDefined();
      expect(sig.restaurantId).toBe(r.id);
    }
  });

  it('has exactly 5 vouchers V-F01..V-D02', () => {
    expect(VOUCHER_LIST.length).toBe(5);
    const ids = VOUCHER_LIST.map((v) => v.id).sort();
    const expected: VoucherId[] = ['V-D01', 'V-D02', 'V-F01', 'V-F02', 'V-F03'];
    expect(ids).toEqual(expected);
  });

  it('V-F01 values match PRD 9.4', () => {
    const v = VOUCHERS['V-F01'];
    expect(v.name).toBe('Hemat Makan');
    expect(v.slot).toBe('FOOD');
    expect(v.valueType).toBe('FIXED');
    if (v.valueType === 'FIXED') {
      expect(v.value).toBe(5000);
      expect(v.maxDiscount).toBeNull();
    }
    expect(v.minSubtotal).toBe(25000);
    expect(v.onlyRestaurantId).toBeNull();
  });

  it('V-F02 is percent 20% with max 8000 and min 30000', () => {
    const v = VOUCHERS['V-F02'];
    expect(v.slot).toBe('FOOD');
    expect(v.valueType).toBe('PERCENT');
    if (v.valueType === 'PERCENT') {
      expect(v.percent).toBe(20);
      expect(v.maxDiscount).toBe(8000);
    }
    expect(v.minSubtotal).toBe(30000);
  });

  it('V-F03 is only for R-05', () => {
    const v = VOUCHERS['V-F03'];
    expect(v.onlyRestaurantId).toBe('R-05');
    if (v.valueType === 'FIXED') {
      expect(v.value).toBe(10000);
    }
    expect(v.minSubtotal).toBe(40000);
  });

  it('V-D01 values match PRD 9.4', () => {
    const v = VOUCHERS['V-D01'];
    expect(v.slot).toBe('DELIVERY');
    if (v.valueType === 'FIXED') {
      expect(v.value).toBe(8000);
      expect(v.maxDiscount).toBe(8000);
    }
    expect(v.minSubtotal).toBe(20000);
  });

  it('V-D02 values match PRD 9.4', () => {
    const v = VOUCHERS['V-D02'];
    expect(v.slot).toBe('DELIVERY');
    if (v.valueType === 'FIXED') {
      expect(v.value).toBe(5000);
      expect(v.maxDiscount).toBe(5000);
    }
    expect(v.minSubtotal).toBe(15000);
  });

  it('listVouchersForSlot FOOD on R-05 includes V-F03', () => {
    const food = listVouchersForSlot('FOOD', 'R-05');
    expect(food.map((v) => v.id)).toContain('V-F03');
  });

  it('listVouchersForSlot FOOD on R-01 excludes V-F03', () => {
    const food = listVouchersForSlot('FOOD', 'R-01');
    expect(food.map((v) => v.id)).not.toContain('V-F03');
  });

  it('has exactly 3 addresses ADDR-01..ADDR-03', () => {
    expect(ADDRESS_LIST.length).toBe(3);
    expect(DEFAULT_ADDRESS_ID).toBe('ADDR-01');
  });

  it('ADDR deliveryFeeDelta values match UX-SPEC A1', () => {
    expect(ADDRESSES['ADDR-01'].deliveryFeeDelta).toBe(0);
    expect(ADDRESSES['ADDR-02'].deliveryFeeDelta).toBe(3000);
    expect(ADDRESSES['ADDR-03'].deliveryFeeDelta).toBe(5000);
  });

  it('DEFAULT_PROFILE matches PRD 9.1', () => {
    expect(DEFAULT_PROFILE.budget).toBe(50000);
    expect(DEFAULT_PROFILE.spentToday).toBe(12000);
    expect(DEFAULT_PROFILE.addressId).toBe('ADDR-01');
    expect(DEFAULT_PROFILE.budgetFilterOn).toBe(false);
    expect(DEFAULT_PROFILE.sortMode).toBe('default');
  });

  it('every restaurantId in RESTAURANTS is a valid key', () => {
    const validIds: RestaurantId[] = ['R-01', 'R-02', 'R-03', 'R-04', 'R-05', 'R-06'];
    for (const r of RESTAURANT_LIST) {
      expect(validIds).toContain(r.id);
    }
  });
});
