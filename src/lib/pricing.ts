import { ADDRESSES } from '../data/addresses';
import { assertRupiah, floorDiv } from './intMath';
import type {
  Address, MenuItem, Restaurant, Rupiah, Voucher, VoucherSlot,
} from '../types/domain';
import { getNetPrice } from '../types/domain';
import type {
  AppliedVoucherResult, CalculateOrderInput, OrderBreakdown, RejectedVoucher, ResolvedLine,
  VoucherEvaluation,
} from '../types/pricing';

export const EMPTY_BREAKDOWN: OrderBreakdown = {
  isEmpty: true, itemCount: 0, subtotal: 0, taxableSubtotal: 0, tax: 0, packaging: 0,
  deliveryFee: 0, baseDeliveryFee: 0, addressDeliveryDelta: 0, serviceFee: 0,
  foodDiscount: 0, deliveryDiscount: 0, total: 0,
  appliedFoodVoucher: null, appliedDeliveryVoucher: null, rejectedVouchers: [],
};

export function computeSubtotal(lines: readonly ResolvedLine[]): Rupiah {
  let subtotal = 0;
  for (const line of lines) {
    subtotal += getNetPrice(line.item) * line.qty;
  }
  return subtotal;
}

export function evaluateVoucher(
  voucher: Voucher,
  context: { readonly restaurantId: Restaurant['id']; readonly subtotal: Rupiah },
): VoucherEvaluation {
  if (voucher.onlyRestaurantId !== null && voucher.onlyRestaurantId !== context.restaurantId) {
    return { eligible: false, reason: 'RESTAURANT_MISMATCH', onlyRestaurantId: voucher.onlyRestaurantId };
  }
  if (context.subtotal < voucher.minSubtotal) {
    return { eligible: false, reason: 'MIN_SUBTOTAL', shortfall: voucher.minSubtotal - context.subtotal };
  }
  return { eligible: true };
}

export function computeVoucherDiscount(
  voucher: Voucher,
  context: { readonly subtotal: Rupiah; readonly deliveryFee: Rupiah },
): Rupiah {
  const ceiling = voucher.slot === 'FOOD' ? context.subtotal : context.deliveryFee;
  let base: Rupiah;
  let cap: Rupiah;
  if (voucher.valueType === 'PERCENT') {
    base = floorDiv(context.subtotal * voucher.percent, 100);
    cap = voucher.maxDiscount;
  } else {
    base = voucher.value;
    cap = voucher.maxDiscount === null ? voucher.value : voucher.maxDiscount;
  }
  return Math.max(0, Math.min(base, cap, ceiling));
}

interface VoucherOutcome {
  readonly applied: AppliedVoucherResult | null;
  readonly rejected: RejectedVoucher | null;
}

function settleVoucher(
  voucher: Voucher | null,
  slot: VoucherSlot,
  restaurant: Restaurant,
  subtotal: Rupiah,
  deliveryFee: Rupiah,
): VoucherOutcome {
  if (voucher === null) return { applied: null, rejected: null };
  if (voucher.slot !== slot) {
    throw new RangeError('calculateOrder: voucher ' + voucher.id + ' bukan voucher slot ' + slot);
  }
  const evaluation = evaluateVoucher(voucher, { restaurantId: restaurant.id, subtotal });
  if (!evaluation.eligible) {
    return { applied: null, rejected: { voucherId: voucher.id, evaluation } };
  }
  const discount = computeVoucherDiscount(voucher, { subtotal, deliveryFee });
  return { applied: { voucherId: voucher.id, name: voucher.name, discount }, rejected: null };
}

export function calculateOrder(input: CalculateOrderInput): OrderBreakdown {
  const { restaurant, lines, address, foodVoucher, deliveryVoucher } = input;
  if (lines.length === 0) return EMPTY_BREAKDOWN;

  let subtotal = 0;
  let taxableSubtotal = 0;
  let itemCount = 0;
  for (const line of lines) {
    if (!Number.isInteger(line.qty) || line.qty < 1 || line.qty > 99) {
      throw new RangeError('calculateOrder: qty harus bilangan bulat 1..99');
    }
    if (line.item.restaurantId !== restaurant.id) {
      throw new RangeError('calculateOrder: item ' + line.item.id + ' bukan milik ' + restaurant.id);
    }
    const lineTotal = getNetPrice(line.item) * line.qty;
    subtotal += lineTotal;
    if (line.item.taxStatus === 'NOT_INCLUDED') taxableSubtotal += lineTotal;
    itemCount += line.qty;
  }
  assertRupiah(subtotal, 'subtotal');

  const tax = floorDiv(taxableSubtotal * restaurant.taxRatePercent + 50, 100);
  const packaging = itemCount * restaurant.packagingFeePerItem;
  const deliveryFee = restaurant.baseDeliveryFee + address.deliveryFeeDelta;
  const serviceFee = restaurant.serviceFee;

  const food = settleVoucher(foodVoucher, 'FOOD', restaurant, subtotal, deliveryFee);
  const delivery = settleVoucher(deliveryVoucher, 'DELIVERY', restaurant, subtotal, deliveryFee);
  const foodDiscount = food.applied === null ? 0 : food.applied.discount;
  const deliveryDiscount = delivery.applied === null ? 0 : delivery.applied.discount;

  const gross = subtotal + tax + packaging + deliveryFee + serviceFee;
  const total = Math.max(0, gross - foodDiscount - deliveryDiscount);

  const rejected: RejectedVoucher[] = [];
  if (food.rejected !== null) rejected.push(food.rejected);
  if (delivery.rejected !== null) rejected.push(delivery.rejected);

  return {
    isEmpty: false, itemCount, subtotal, taxableSubtotal, tax, packaging,
    deliveryFee, baseDeliveryFee: restaurant.baseDeliveryFee,
    addressDeliveryDelta: address.deliveryFeeDelta, serviceFee,
    foodDiscount, deliveryDiscount, total,
    appliedFoodVoucher: food.applied, appliedDeliveryVoucher: delivery.applied,
    rejectedVouchers: rejected,
  };
}

export function estimateMenuItemAllIn(restaurant: Restaurant, item: MenuItem): Rupiah {
  const baseline: Address = ADDRESSES['ADDR-01'];
  const breakdown = calculateOrder({
    restaurant,
    lines: [{ item, qty: 1 }],
    address: baseline,
    foodVoucher: null,
    deliveryVoucher: null,
  });
  return breakdown.total;
}

export function estimateRestaurantAllIn(restaurant: Restaurant, signatureItem: MenuItem): Rupiah {
  return estimateMenuItemAllIn(restaurant, signatureItem);
}
