import type {
  AddressId, BudgetStatus, MenuItemId, RestaurantId, Rupiah, SortMode, VoucherId, VoucherSlot,
} from './domain';
import type { OrderBreakdown } from './pricing';

export interface CartLine {
  readonly menuItemId: MenuItemId;
  readonly qty: number;
}

export interface CartState {
  readonly restaurantId: RestaurantId | null;
  readonly lines: readonly CartLine[];
  readonly foodVoucherId: VoucherId | null;
  readonly deliveryVoucherId: VoucherId | null;
}

export const QTY_MIN = 1;
export const QTY_MAX = 99;

export interface PersistedState {
  readonly schemaVersion: 1;
  readonly budget: Rupiah | null;
  readonly spentToday: Rupiah;
  readonly addressId: AddressId;
  readonly cart: CartState;
  readonly budgetFilterOn: boolean;
  readonly sortMode: SortMode;
}

export interface PendingAddItem {
  readonly menuItemId: MenuItemId;
  readonly restaurantId: RestaurantId;
  readonly fromRestaurantId: RestaurantId;
}

export interface PriceChangeLine {
  readonly key: 'DELIVERY_FEE' | 'DELIVERY_DISCOUNT';
  readonly label: 'Ongkos kirim' | 'Diskon voucher ongkir';
  readonly before: Rupiah;
  readonly after: Rupiah;
  readonly totalEffect: number;
  readonly changed: boolean;
}

export interface PendingPriceChange {
  readonly reason: 'ADDRESS_CHANGE';
  readonly previousAddressId: AddressId;
  readonly nextAddressId: AddressId;
  readonly previousTotal: Rupiah;
  readonly nextTotal: Rupiah;
  readonly totalDelta: number;
  readonly lines: readonly PriceChangeLine[];
  readonly statusBefore: BudgetStatus | null;
  readonly statusAfter: BudgetStatus | null;
  readonly projectionAfter: Rupiah | null;
}

export interface LastPriceChange {
  readonly previousTotal: Rupiah;
  readonly nextTotal: Rupiah;
  readonly causeText: string;
}

export interface InlineNotice {
  readonly seq: number;
  readonly kind: 'VOUCHER_REMOVED' | 'VOUCHER_REPLACED';
  readonly variant: 'warning' | 'success';
  readonly messages: readonly string[];
}

export interface ReceiptLine {
  readonly menuItemId: MenuItemId;
  readonly name: string;
  readonly qty: number;
  readonly unitNetPrice: Rupiah;
  readonly lineSubtotal: Rupiah;
}

export interface ReceiptBudgetSnapshot {
  readonly budget: Rupiah | null;
  readonly spentBefore: Rupiah;
  readonly spentAfter: Rupiah;
  readonly remainingBudget: Rupiah | null;
  readonly exceededBy: Rupiah;
}

export interface Receipt {
  readonly id: string;
  readonly paidAtIso: string;
  readonly restaurantId: RestaurantId;
  readonly restaurantName: string;
  readonly addressId: AddressId;
  readonly addressLabel: string;
  readonly lines: readonly ReceiptLine[];
  readonly breakdown: OrderBreakdown;
  readonly cartTotal: Rupiah;
  readonly checkoutTotal: Rupiah;
  readonly paidAmount: Rupiah;
  readonly delta: 0;
  readonly budgetSnapshot: ReceiptBudgetSnapshot;
}

export interface ExceededSnapshot {
  readonly budget: Rupiah;
  readonly spentToday: Rupiah;
  readonly expectedTotal: Rupiah;
  readonly projection: Rupiah;
  readonly exceededBy: Rupiah;
}

export type OverlayState =
  | { readonly kind: 'NONE' }
  | { readonly kind: 'BUDGET_SETTINGS' }
  | { readonly kind: 'INFO_SHEET' }
  | { readonly kind: 'VOUCHER_PANEL'; readonly slot: VoucherSlot }
  | { readonly kind: 'ADDRESS_PICKER' }
  | { readonly kind: 'CONFIRM_REPLACE_CART' }
  | { readonly kind: 'PRICE_CHANGE_NOTICE' }
  | { readonly kind: 'BUDGET_EXCEEDED'; readonly snapshot: ExceededSnapshot }
  | { readonly kind: 'CONFIRM_RESET' };

export type OpenableOverlay = Extract<
  OverlayState,
  { kind: 'BUDGET_SETTINGS' | 'INFO_SHEET' | 'VOUCHER_PANEL' | 'ADDRESS_PICKER' }
>;

export type AppRouteKey = 'HOME' | 'SEARCH' | 'MENU' | 'CART' | 'CHECKOUT' | 'RECEIPT';

export interface AppState extends PersistedState {
  readonly pendingAddItem: PendingAddItem | null;
  readonly pendingPriceChange: PendingPriceChange | null;
  readonly lastPriceChange: LastPriceChange | null;
  readonly inlineNotice: InlineNotice | null;
  readonly lastReceipt: Receipt | null;
  readonly overlay: OverlayState;
  readonly overflowMenuOpen: boolean;
  readonly noticeSeq: number;
}
