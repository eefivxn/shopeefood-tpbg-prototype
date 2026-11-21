import { ADDRESSES } from '../data/addresses';
import { MENU_ITEMS } from '../data/menuItems';
import { RESTAURANTS } from '../data/restaurants';
import { VOUCHERS } from '../data/vouchers';
import type { AddressId, RestaurantId, Rupiah, Voucher, VoucherId } from '../types/domain';
import { getNetPrice } from '../types/domain';
import type { CalculateOrderInput, ResolvedLine } from '../types/pricing';
import type { CartState } from '../types/state';
import { evaluateVoucher } from './pricing';

export function createEmptyCart(): CartState {
  return { restaurantId: null, lines: [], foodVoucherId: null, deliveryVoucherId: null };
}

export interface CartLineView {
  readonly menuItemId: CartState['lines'][number]['menuItemId'];
  readonly qty: number;
  readonly netPrice: Rupiah;
  readonly lineSubtotal: Rupiah;
}

export function computeCartSubtotal(lines: readonly CartState['lines']): Rupiah {
  let subtotal = 0;
  for (const line of lines) {
    const item = MENU_ITEMS[line.menuItemId];
    subtotal += getNetPrice(item) * line.qty;
  }
  return subtotal;
}

export function resolveCart(cart: CartState, addressId: AddressId): CalculateOrderInput | null {
  if (cart.restaurantId === null || cart.lines.length === 0) return null;
  const restaurant = RESTAURANTS[cart.restaurantId];
  const lines: ResolvedLine[] = cart.lines.map((line) => ({ item: MENU_ITEMS[line.menuItemId], qty: line.qty }));
  return {
    restaurant,
    lines,
    address: ADDRESSES[addressId],
    foodVoucher: cart.foodVoucherId === null ? null : VOUCHERS[cart.foodVoucherId],
    deliveryVoucher: cart.deliveryVoucherId === null ? null : VOUCHERS[cart.deliveryVoucherId],
  };
}

export interface ReconcileResult {
  readonly cart: CartState;
  readonly removed: readonly Voucher[];
}

export function reconcileVouchers(cart: CartState): ReconcileResult {
  if (cart.restaurantId === null) {
    return { cart: createEmptyCart(), removed: [] };
  }
  const restaurantId: RestaurantId = cart.restaurantId;
  const subtotal = computeCartSubtotal(cart.lines);
  const removed: Voucher[] = [];

  function keep(voucherId: VoucherId | null): VoucherId | null {
    if (voucherId === null) return null;
    const voucher = VOUCHERS[voucherId];
    if (evaluateVoucher(voucher, { restaurantId, subtotal }).eligible) return voucherId;
    removed.push(voucher);
    return null;
  }

  const foodVoucherId = keep(cart.foodVoucherId);
  const deliveryVoucherId = keep(cart.deliveryVoucherId);
  return {
    cart: { restaurantId: cart.restaurantId, lines: cart.lines, foodVoucherId, deliveryVoucherId },
    removed,
  };
}
