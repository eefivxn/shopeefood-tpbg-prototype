import type { Restaurant, RestaurantId } from '../types/domain';

export const RESTAURANTS: Record<RestaurantId, Restaurant> = {
  'R-01': { id: 'R-01', name: 'Ayam Bakar Pak Dhe', category: 'Ayam & Bakaran', distanceLabel: '3,2 km', baseDeliveryFee: 12000, serviceFee: 3000, packagingFeePerItem: 2000, taxRatePercent: 10, signatureMenuItemId: 'M-101' },
  'R-02': { id: 'R-02', name: 'Geprek Bu Rina', category: 'Ayam Geprek', distanceLabel: '1,1 km', baseDeliveryFee: 6000, serviceFee: 3000, packagingFeePerItem: 1000, taxRatePercent: 10, signatureMenuItemId: 'M-201' },
  'R-03': { id: 'R-03', name: 'Nasi Goreng Mas Joko', category: 'Nasi & Mie', distanceLabel: '0,8 km', baseDeliveryFee: 4000, serviceFee: 2000, packagingFeePerItem: 1000, taxRatePercent: 10, signatureMenuItemId: 'M-301' },
  'R-04': { id: 'R-04', name: 'Bakso Pak Slamet', category: 'Bakso & Mie', distanceLabel: '2,0 km', baseDeliveryFee: 8000, serviceFee: 3000, packagingFeePerItem: 1000, taxRatePercent: 10, signatureMenuItemId: 'M-401' },
  'R-05': { id: 'R-05', name: 'Kopi & Roti Senja', category: 'Kopi & Roti', distanceLabel: '4,5 km', baseDeliveryFee: 15000, serviceFee: 4000, packagingFeePerItem: 2000, taxRatePercent: 10, signatureMenuItemId: 'M-501' },
  'R-06': { id: 'R-06', name: 'Sate Ayam Madura', category: 'Sate', distanceLabel: '2,6 km', baseDeliveryFee: 9000, serviceFee: 3000, packagingFeePerItem: 1000, taxRatePercent: 10, signatureMenuItemId: 'M-601' },
};

export const RESTAURANT_LIST: readonly Restaurant[] = Object.values(RESTAURANTS);
