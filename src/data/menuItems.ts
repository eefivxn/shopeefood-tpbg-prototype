import type { MenuItem, MenuItemId, RestaurantId, Rupiah, TaxStatus } from '../types/domain';

function menuItem(
  id: MenuItemId,
  restaurantId: RestaurantId,
  name: string,
  listPrice: Rupiah,
  discount: Rupiah,
  taxStatus: TaxStatus,
  description: string | null = null,
): MenuItem {
  return { id, restaurantId, name, description, listPrice, discount, taxStatus };
}

export const MENU_ITEMS: Record<MenuItemId, MenuItem> = {
  'M-101': menuItem('M-101', 'R-01', 'Paket Ayam Bakar Promo', 30000, 0, 'NOT_INCLUDED', 'ayam bakar, nasi, lalapan'),
  'M-102': menuItem('M-102', 'R-01', 'Tahu Tempe Bakar', 10000, 0, 'NOT_INCLUDED'),
  'M-103': menuItem('M-103', 'R-01', 'Nasi Putih', 5000, 0, 'NOT_INCLUDED'),
  'M-104': menuItem('M-104', 'R-01', 'Es Jeruk', 8000, 0, 'INCLUDED'),
  'M-201': menuItem('M-201', 'R-02', 'Ayam Geprek Original', 17000, 2000, 'NOT_INCLUDED'),
  'M-202': menuItem('M-202', 'R-02', 'Ayam Geprek Keju', 22000, 0, 'NOT_INCLUDED'),
  'M-203': menuItem('M-203', 'R-02', 'Nasi Putih', 5000, 0, 'INCLUDED'),
  'M-204': menuItem('M-204', 'R-02', 'Es Teh Manis', 5000, 0, 'INCLUDED'),
  'M-301': menuItem('M-301', 'R-03', 'Nasi Goreng Ayam', 18000, 0, 'INCLUDED'),
  'M-302': menuItem('M-302', 'R-03', 'Nasi Goreng Spesial', 20000, 0, 'INCLUDED'),
  'M-303': menuItem('M-303', 'R-03', 'Mie Goreng Jawa', 17000, 0, 'INCLUDED'),
  'M-304': menuItem('M-304', 'R-03', 'Es Teh Tarik', 6000, 0, 'INCLUDED'),
  'M-401': menuItem('M-401', 'R-04', 'Bakso Urat', 15000, 0, 'NOT_INCLUDED'),
  'M-402': menuItem('M-402', 'R-04', 'Bakso Campur Komplit', 20000, 0, 'INCLUDED'),
  'M-403': menuItem('M-403', 'R-04', 'Mie Ayam Bakso', 14000, 0, 'NOT_INCLUDED'),
  'M-404': menuItem('M-404', 'R-04', 'Es Campur', 10000, 0, 'NOT_INCLUDED'),
  'M-501': menuItem('M-501', 'R-05', 'Kopi Susu Gula Aren', 22000, 3000, 'NOT_INCLUDED'),
  'M-502': menuItem('M-502', 'R-05', 'Roti Bakar Cokelat Keju', 18000, 0, 'NOT_INCLUDED'),
  'M-503': menuItem('M-503', 'R-05', 'Paket Sarapan', 35000, 0, 'NOT_INCLUDED', 'roti + kopi'),
  'M-504': menuItem('M-504', 'R-05', 'Air Mineral', 5000, 0, 'INCLUDED'),
  'M-601': menuItem('M-601', 'R-06', 'Sate Ayam', 20000, 0, 'NOT_INCLUDED', '10 tusuk'),
  'M-602': menuItem('M-602', 'R-06', 'Sate Kambing', 30000, 0, 'NOT_INCLUDED', '10 tusuk'),
  'M-603': menuItem('M-603', 'R-06', 'Lontong', 4000, 0, 'INCLUDED'),
  'M-604': menuItem('M-604', 'R-06', 'Es Kelapa Muda', 10000, 0, 'INCLUDED'),
};

export const MENU_ITEM_LIST: readonly MenuItem[] = Object.values(MENU_ITEMS);

export function getMenuItemsByRestaurant(restaurantId: RestaurantId): readonly MenuItem[] {
  return MENU_ITEM_LIST.filter((item) => item.restaurantId === restaurantId);
}
