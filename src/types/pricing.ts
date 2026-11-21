import type {
  Address, BudgetStatus, MenuItem, Restaurant, Rupiah, Voucher, VoucherId,
} from './domain';

export interface ResolvedLine {
  readonly item: MenuItem;
  readonly qty: number;
}

export interface CalculateOrderInput {
  readonly restaurant: Restaurant;
  readonly lines: readonly ResolvedLine[];
  readonly address: Address;
  readonly foodVoucher: Voucher | null;
  readonly deliveryVoucher: Voucher | null;
}

export interface AppliedVoucherResult {
  readonly voucherId: VoucherId;
  readonly name: string;
  readonly discount: Rupiah;
}

export type VoucherEvaluation =
  | { readonly eligible: true }
  | { readonly eligible: false; readonly reason: 'RESTAURANT_MISMATCH'; readonly onlyRestaurantId: string }
  | { readonly eligible: false; readonly reason: 'MIN_SUBTOTAL'; readonly shortfall: Rupiah };

export interface RejectedVoucher {
  readonly voucherId: VoucherId;
  readonly evaluation: Exclude<VoucherEvaluation, { eligible: true }>;
}

export interface OrderBreakdown {
  readonly isEmpty: boolean;
  readonly itemCount: number;
  readonly subtotal: Rupiah;
  readonly taxableSubtotal: Rupiah;
  readonly tax: Rupiah;
  readonly packaging: Rupiah;
  readonly deliveryFee: Rupiah;
  readonly baseDeliveryFee: Rupiah;
  readonly addressDeliveryDelta: Rupiah;
  readonly serviceFee: Rupiah;
  readonly foodDiscount: Rupiah;
  readonly deliveryDiscount: Rupiah;
  readonly total: Rupiah;
  readonly appliedFoodVoucher: AppliedVoucherResult | null;
  readonly appliedDeliveryVoucher: AppliedVoucherResult | null;
  readonly rejectedVouchers: readonly RejectedVoucher[];
}

export interface BudgetEvaluation {
  readonly budget: Rupiah;
  readonly projection: Rupiah;
  readonly status: BudgetStatus;
  readonly leftover: Rupiah;
  readonly exceededBy: Rupiah;
  readonly barPercent: number;
  readonly percentLabel: string;
}
