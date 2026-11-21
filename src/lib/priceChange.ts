import { ADDRESSES } from '../data/addresses';
import type { AddressId, Rupiah } from '../types/domain';
import type { OrderBreakdown } from '../types/pricing';
import type { PendingPriceChange, PriceChangeLine } from '../types/state';
import { evaluateBudget } from './budget';

export function buildPendingPriceChange(params: {
  readonly previousAddressId: AddressId;
  readonly nextAddressId: AddressId;
  readonly before: OrderBreakdown;
  readonly after: OrderBreakdown;
  readonly budget: Rupiah | null;
  readonly spentToday: Rupiah;
}): PendingPriceChange {
  const { before, after, budget, spentToday } = params;
  const lines: PriceChangeLine[] = [
    {
      key: 'DELIVERY_FEE',
      label: 'Ongkos kirim',
      before: before.deliveryFee,
      after: after.deliveryFee,
      totalEffect: after.deliveryFee - before.deliveryFee,
      changed: after.deliveryFee !== before.deliveryFee,
    },
  ];
  if (before.appliedDeliveryVoucher !== null || after.appliedDeliveryVoucher !== null) {
    lines.push({
      key: 'DELIVERY_DISCOUNT',
      label: 'Diskon voucher ongkir',
      before: before.deliveryDiscount,
      after: after.deliveryDiscount,
      totalEffect: before.deliveryDiscount - after.deliveryDiscount,
      changed: after.deliveryDiscount !== before.deliveryDiscount,
    });
  }
  const evalBefore = evaluateBudget(budget, spentToday, before.total);
  const evalAfter = evaluateBudget(budget, spentToday, after.total);
  return {
    reason: 'ADDRESS_CHANGE',
    previousAddressId: params.previousAddressId,
    nextAddressId: params.nextAddressId,
    previousTotal: before.total,
    nextTotal: after.total,
    totalDelta: after.total - before.total,
    lines,
    statusBefore: evalBefore === null ? null : evalBefore.status,
    statusAfter: evalAfter === null ? null : evalAfter.status,
    projectionAfter: evalAfter === null ? null : evalAfter.projection,
  };
}

export function priceChangeCauseText(nextAddressId: AddressId): string {
  return 'alamat diganti ke ' + ADDRESSES[nextAddressId].label;
}
