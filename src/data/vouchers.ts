import type { RestaurantId, Voucher, VoucherId, VoucherSlot } from '../types/domain';

export const VOUCHERS: Record<VoucherId, Voucher> = {
  'V-F01': { id: 'V-F01', name: 'Hemat Makan', slot: 'FOOD', valueType: 'FIXED', value: 5000, maxDiscount: null, minSubtotal: 25000, onlyRestaurantId: null },
  'V-F02': { id: 'V-F02', name: 'Diskon 20% Makan', slot: 'FOOD', valueType: 'PERCENT', percent: 20, maxDiscount: 8000, minSubtotal: 30000, onlyRestaurantId: null },
  'V-F03': { id: 'V-F03', name: 'Spesial Senja', slot: 'FOOD', valueType: 'FIXED', value: 10000, maxDiscount: null, minSubtotal: 40000, onlyRestaurantId: 'R-05' },
  'V-D01': { id: 'V-D01', name: 'Gratis Ongkir', slot: 'DELIVERY', valueType: 'FIXED', value: 8000, maxDiscount: 8000, minSubtotal: 20000, onlyRestaurantId: null },
  'V-D02': { id: 'V-D02', name: 'Potongan Ongkir', slot: 'DELIVERY', valueType: 'FIXED', value: 5000, maxDiscount: 5000, minSubtotal: 15000, onlyRestaurantId: null },
};

export const VOUCHER_LIST: readonly Voucher[] = Object.values(VOUCHERS);

export function listVouchersForSlot(slot: VoucherSlot, restaurantId: RestaurantId): readonly Voucher[] {
  return VOUCHER_LIST.filter(
    (v) => v.slot === slot && (v.onlyRestaurantId === null || v.onlyRestaurantId === restaurantId),
  );
}
