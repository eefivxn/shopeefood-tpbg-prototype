import type { Address, AddressId } from '../types/domain';

export const DEFAULT_ADDRESS_ID: AddressId = 'ADDR-01';

export const ADDRESSES: Record<AddressId, Address> = {
  'ADDR-01': { id: 'ADDR-01', label: 'Kos dekat kampus, Malang (data fiktif)', deliveryFeeDelta: 0 },
  'ADDR-02': { id: 'ADDR-02', label: 'Rumah teman di Lowokwaru, Malang (data fiktif)', deliveryFeeDelta: 3000 },
  'ADDR-03': { id: 'ADDR-03', label: 'Tempat kerja paruh waktu di Klojen, Malang (data fiktif)', deliveryFeeDelta: 5000 },
};

export const ADDRESS_LIST: readonly Address[] = Object.values(ADDRESSES);
