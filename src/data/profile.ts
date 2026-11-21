import type { AddressId, Rupiah, SortMode } from '../types/domain';

export interface DefaultProfile {
  readonly budget: Rupiah | null;
  readonly spentToday: Rupiah;
  readonly addressId: AddressId;
  readonly budgetFilterOn: boolean;
  readonly sortMode: SortMode;
}

export const DEFAULT_PROFILE: DefaultProfile = {
  budget: 50000,
  spentToday: 12000,
  addressId: 'ADDR-01',
  budgetFilterOn: false,
  sortMode: 'default',
};
