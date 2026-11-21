export type Rupiah = number;

export type RestaurantId = 'R-01' | 'R-02' | 'R-03' | 'R-04' | 'R-05' | 'R-06';

export type MenuItemId =
  | 'M-101' | 'M-102' | 'M-103' | 'M-104'
  | 'M-201' | 'M-202' | 'M-203' | 'M-204'
  | 'M-301' | 'M-302' | 'M-303' | 'M-304'
  | 'M-401' | 'M-402' | 'M-403' | 'M-404'
  | 'M-501' | 'M-502' | 'M-503' | 'M-504'
  | 'M-601' | 'M-602' | 'M-603' | 'M-604';

export type VoucherId = 'V-F01' | 'V-F02' | 'V-F03' | 'V-D01' | 'V-D02';
export type AddressId = 'ADDR-01' | 'ADDR-02' | 'ADDR-03';

export type BudgetStatus = 'OK' | 'WARN' | 'EXCEEDED';
export type TaxStatus = 'NOT_INCLUDED' | 'INCLUDED';
export type VoucherSlot = 'FOOD' | 'DELIVERY';
export type SortMode = 'default' | 'cheapest-all-in';

export interface Restaurant {
  readonly id: RestaurantId;
  readonly name: string;
  readonly category: string;
  readonly distanceLabel: string;
  readonly baseDeliveryFee: Rupiah;
  readonly serviceFee: Rupiah;
  readonly packagingFeePerItem: Rupiah;
  readonly taxRatePercent: number;
  readonly signatureMenuItemId: MenuItemId;
}

export interface MenuItem {
  readonly id: MenuItemId;
  readonly restaurantId: RestaurantId;
  readonly name: string;
  readonly description: string | null;
  readonly listPrice: Rupiah;
  readonly discount: Rupiah;
  readonly taxStatus: TaxStatus;
}

export interface Address {
  readonly id: AddressId;
  readonly label: string;
  readonly deliveryFeeDelta: Rupiah;
}

interface VoucherBase {
  readonly id: VoucherId;
  readonly name: string;
  readonly minSubtotal: Rupiah;
  readonly onlyRestaurantId: RestaurantId | null;
}

export interface FoodFixedVoucher extends VoucherBase {
  readonly slot: 'FOOD';
  readonly valueType: 'FIXED';
  readonly value: Rupiah;
  readonly maxDiscount: Rupiah | null;
}

export interface FoodPercentVoucher extends VoucherBase {
  readonly slot: 'FOOD';
  readonly valueType: 'PERCENT';
  readonly percent: number;
  readonly maxDiscount: Rupiah;
}

export interface DeliveryFixedVoucher extends VoucherBase {
  readonly slot: 'DELIVERY';
  readonly valueType: 'FIXED';
  readonly value: Rupiah;
  readonly maxDiscount: Rupiah;
}

export type Voucher = FoodFixedVoucher | FoodPercentVoucher | DeliveryFixedVoucher;

export function getNetPrice(item: MenuItem): Rupiah {
  return item.listPrice - item.discount;
}
