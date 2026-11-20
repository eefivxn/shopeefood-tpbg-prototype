# Interaction Specification (INTERACTION-SPEC)

# ShopeeFood Transparent Pricing and Budget Guardrail (TPBG) — Repository 2

---

## Section 1: Metadata Dokumen dan Hierarki Acuan

### 1.1 Metadata Dokumen

| Atribut | Keterangan |
|---|---|
| **Project Title** | ShopeeFood Transparent Pricing and Budget Guardrail (TPBG) |
| **Nama Dokumen** | INTERACTION-SPEC.md (Repository 2: logika, state, dan interaksi) |
| **Mata Kuliah** | Rekayasa Interaksi (Interaction Engineering) |
| **Author** | Muhammad Arifin (NIM: 202310370311054) |
| **Institusi** | Teknik Informatika, Universitas Muhammadiyah Malang |
| **Document Version** | 1.0.0 |
| **Tanggal** | 19 November 2026 |
| **Status Dokumen** | Draft untuk review dosen dan tim |
| **Tech Stack** | React, Vite, Tailwind CSS v3, lucide-react, **TypeScript strict mode** (`.ts` / `.tsx`), local mock data (tanpa backend) |
| **Cakupan** | Skema state dan persistensi, mesin kalkulasi tunggal, state machine alur kritis, koreografi fokus dan keyboard |

> TPBG adalah prototype akademik dan tidak berafiliasi dengan platform pesan-antar mana pun. Seluruh data bersifat fiktif.

### 1.2 Hierarki dan Urutan Otoritas Dokumen

Jika terjadi perbedaan, dokumen di sebelah kiri menang atas dokumen di sebelah kanannya.

```
PRD_2.md  ->  UX-SPEC.md  ->  DESIGN-SYSTEM.md  ->  INTERACTION-SPEC.md
(requirement)  (struktur,       (token visual,        (state, logika,
                microcopy,       kelas Tailwind,       transisi, fokus)
                7 overlay)       komponen)
```

| Dokumen | Yang dikunci untuk dokumen ini |
|---|---|
| `PRD_2.md` | Rumus harga (6.2), pembulatan `BR-06`, voucher `BR-07`, proyeksi `BR-08`, ambang status `BR-09`, estimasi `BR-10`, mock data Section 9, skenario `TS-01` sampai `TS-08` |
| `UX-SPEC.md` | Rute, 7 overlay, perilaku tiap overlay, seluruh microcopy, aturan fokus (5.5.2 dan 5.5.3), asumsi A1 sampai A12 (termasuk data alamat ADDR-01/02/03) |
| `DESIGN-SYSTEM.md` | Nama modul, format Rupiah manual (`formatRupiah.ts`), peta status (`budgetStatus.ts`), peta artwork (`artwork.ts`), kelas `modal-open` |
| `INTERACTION-SPEC.md` | Tipe TypeScript, kontrak fungsi domain, action reducer, tabel transisi, siklus fokus. **Tidak mengubah microcopy atau perilaku dokumen di atasnya** |

**Aturan:** setiap string antarmuka pada dokumen ini disalin persis dari `UX-SPEC.md` Bagian 4 dan 5. Satu-satunya string yang disusun di sini adalah rangkaian kalimat dari potongan baku (misalnya `"alamat diganti ke {Label alamat}"` pada blok "Perubahan terakhir"), dan ditandai pada tempatnya.

### 1.3 Peta Modul (Selaras `DESIGN-SYSTEM.md`)

Modul pada `DESIGN-SYSTEM.md` yang semula `.js` kini menjadi `.ts`. Isi logikanya tidak berubah, hanya ditambah anotasi tipe.

| Modul | Peran | Asal |
|---|---|---|
| `src/lib/formatRupiah.ts` | `formatRupiah`, `formatDiscount`, `formatSignedRupiah`, `formatPercent`, `barPercent` | `DESIGN-SYSTEM` 3.4 (dianotasi tipe, lihat 3.9) |
| `src/design/budgetStatus.ts` | `BUDGET_STATUS` (label, ikon, kelas), re-ekspor `getBudgetStatus` | `DESIGN-SYSTEM` 2.5 (lihat 3.9) |
| `src/data/artwork.ts` | Peta emoji dan gradien restoran dan item | `DESIGN-SYSTEM` 4.5 (lihat 3.9) |
| `src/lib/intMath.ts` | `floorDiv`, `clampInt`, `assertRupiah` | Baru (Bagian 3.1) |
| `src/types/domain.ts` | ID, `Restaurant`, `MenuItem`, `Voucher`, `Address`, tipe pricing | Baru (Bagian 2.1 dan 3) |
| `src/types/state.ts` | `AppState`, `PersistedState`, `CartState`, dan tipe turunan | Baru (Bagian 2.2) |
| `src/data/restaurants.ts`, `menuItems.ts`, `vouchers.ts`, `addresses.ts`, `profile.ts` | Mock data (NFR-04, NFR-09) | Baru (Bagian 2.1) |
| `src/lib/pricing.ts` | `calculateOrder`, `evaluateVoucher`, `computeVoucherDiscount`, `estimateMenuItemAllIn`, `estimateRestaurantAllIn` | Baru (Bagian 3) |
| `src/lib/cart.ts` | `resolveCart`, `computeCartSubtotal`, `reconcileVouchers`, `createEmptyCart` | Baru (Bagian 3.7) |
| `src/lib/budget.ts` | `getProjection`, `getBudgetStatus`, `evaluateBudget`, `validateBudgetInput` | Baru (Bagian 3.6) |
| `src/lib/discovery.ts` | `filterAndSortRestaurants` | Baru (Bagian 3.8) |
| `src/lib/priceChange.ts` | `buildPendingPriceChange` | Baru (Bagian 4.4) |
| `src/lib/voucherCopy.ts` | `voucherReasonMessage` | Baru (Bagian 3.4) |
| `src/state/persistence.ts` | Muat, sanitasi, simpan `"tpbg:v1"` | Baru (Bagian 2.4) |
| `src/state/reducer.ts` | `appReducer`, `createInitialState`, `AppAction` | Baru (Bagian 4) |
| `src/a11y/*.ts(x)` | Focus trap, escape stack, kunci latar, hook modal | Baru (Bagian 5) |

### 1.4 Konfigurasi TypeScript Strict

`tsconfig.json` (bagian `compilerOptions`):

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noFallthroughCasesInSwitch": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "isolatedModules": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "types": ["vite/client"]
  },
  "include": ["src"]
}
```

**Konvensi kode:**

| Aturan | Alasan |
|---|---|
| Dilarang `any` dan non-null assertion (`!`) | Strict mode harus sungguh-sungguh melindungi invarian harga |
| Seluruh nilai uang bertipe `Rupiah` (alias `number`, bilangan bulat) dan lolos `Number.isSafeInteger` | `BR-01` |
| Seluruh struktur state `readonly` dan diubah hanya dengan membuat objek baru | Reducer murni, memudahkan unit test |
| Reducer dan fungsi domain **murni**: tanpa `Date.now()`, `Math.random()`, akses `localStorage`, atau navigasi di dalamnya | Deterministik dan dapat diuji (NFR-03) |
| Waktu dan ID dibangkitkan di luar reducer lalu dikirim lewat payload action | Menjaga kemurnian reducer |

---

## Section 2: Skema State Aplikasi dan Persistensi (`localStorage` key `"tpbg:v1"`)

### 2.1 Tipe Identitas dan Data Referensi

Berkas `src/types/domain.ts`:

```ts
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
```

Berkas `src/data/restaurants.ts` (PRD 9.2):

```ts
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
```

Berkas `src/data/menuItems.ts` (PRD 9.3). Kurung pada nama menu di PRD dipindahkan ke `description`:

```ts
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
```

Berkas `src/data/vouchers.ts` (PRD 9.4):

```ts
import type { RestaurantId, Voucher, VoucherId, VoucherSlot } from '../types/domain';

export const VOUCHERS: Record<VoucherId, Voucher> = {
  'V-F01': { id: 'V-F01', name: 'Hemat Makan', slot: 'FOOD', valueType: 'FIXED', value: 5000, maxDiscount: null, minSubtotal: 25000, onlyRestaurantId: null },
  'V-F02': { id: 'V-F02', name: 'Diskon 20% Makan', slot: 'FOOD', valueType: 'PERCENT', percent: 20, maxDiscount: 8000, minSubtotal: 30000, onlyRestaurantId: null },
  'V-F03': { id: 'V-F03', name: 'Spesial Senja', slot: 'FOOD', valueType: 'FIXED', value: 10000, maxDiscount: null, minSubtotal: 40000, onlyRestaurantId: 'R-05' },
  'V-D01': { id: 'V-D01', name: 'Gratis Ongkir', slot: 'DELIVERY', valueType: 'FIXED', value: 8000, maxDiscount: 8000, minSubtotal: 20000, onlyRestaurantId: null },
  'V-D02': { id: 'V-D02', name: 'Potongan Ongkir', slot: 'DELIVERY', valueType: 'FIXED', value: 5000, maxDiscount: 5000, minSubtotal: 15000, onlyRestaurantId: null },
};

export const VOUCHER_LIST: readonly Voucher[] = Object.values(VOUCHERS);

/** Daftar voucher untuk satu slot. Voucher khusus restoran lain disembunyikan (UX-SPEC A7). */
export function listVouchersForSlot(slot: VoucherSlot, restaurantId: RestaurantId): readonly Voucher[] {
  return VOUCHER_LIST.filter(
    (v) => v.slot === slot && (v.onlyRestaurantId === null || v.onlyRestaurantId === restaurantId),
  );
}
```

Berkas `src/data/addresses.ts` (UX-SPEC 4.5.1, asumsi A1):

```ts
import type { Address, AddressId } from '../types/domain';

export const DEFAULT_ADDRESS_ID: AddressId = 'ADDR-01';

export const ADDRESSES: Record<AddressId, Address> = {
  'ADDR-01': { id: 'ADDR-01', label: 'Kos dekat kampus, Malang (data fiktif)', deliveryFeeDelta: 0 },
  'ADDR-02': { id: 'ADDR-02', label: 'Rumah teman di Lowokwaru, Malang (data fiktif)', deliveryFeeDelta: 3000 },
  'ADDR-03': { id: 'ADDR-03', label: 'Tempat kerja paruh waktu di Klojen, Malang (data fiktif)', deliveryFeeDelta: 5000 },
};

export const ADDRESS_LIST: readonly Address[] = Object.values(ADDRESSES);
```

Berkas `src/data/profile.ts` (PRD 9.1):

```ts
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
```

### 2.2 Interface State

Berkas `src/types/state.ts`:

```ts
import type {
  AddressId, BudgetStatus, MenuItemId, RestaurantId, Rupiah, SortMode, VoucherId, VoucherSlot,
} from './domain';
import type { OrderBreakdown } from './pricing';

export interface CartLine {
  readonly menuItemId: MenuItemId;
  /** Bilangan bulat 1..99 (QTY_MIN..QTY_MAX). */
  readonly qty: number;
}

export interface CartState {
  /** null jika dan hanya jika lines kosong. */
  readonly restaurantId: RestaurantId | null;
  readonly lines: readonly CartLine[];
  readonly foodVoucherId: VoucherId | null;
  readonly deliveryVoucherId: VoucherId | null;
}

export const QTY_MIN = 1;
export const QTY_MAX = 99;

/** Bagian state yang disimpan ke localStorage["tpbg:v1"]. */
export interface PersistedState {
  readonly schemaVersion: 1;
  /** null = belum diatur. Jika bukan null: bilangan bulat 10000..500000. */
  readonly budget: Rupiah | null;
  readonly spentToday: Rupiah;
  readonly addressId: AddressId;
  readonly cart: CartState;
  readonly budgetFilterOn: boolean;
  readonly sortMode: SortMode;
}

/** Item yang menunggu konfirmasi "Ganti keranjang?". */
export interface PendingAddItem {
  readonly menuItemId: MenuItemId;
  readonly restaurantId: RestaurantId;
  readonly fromRestaurantId: RestaurantId;
}

/** Satu komponen yang berubah pada pemberitahuan perubahan total (UX-SPEC N-1, N-2). */
export interface PriceChangeLine {
  readonly key: 'DELIVERY_FEE' | 'DELIVERY_DISCOUNT';
  readonly label: 'Ongkos kirim' | 'Diskon voucher ongkir';
  readonly before: Rupiah;
  readonly after: Rupiah;
  /** Pengaruh perubahan komponen ini terhadap TOTAL (bertanda). Jumlah seluruh totalEffect = totalDelta. */
  readonly totalEffect: number;
  readonly changed: boolean;
}

export interface PendingPriceChange {
  readonly reason: 'ADDRESS_CHANGE';
  readonly previousAddressId: AddressId;
  readonly nextAddressId: AddressId;
  readonly previousTotal: Rupiah;
  readonly nextTotal: Rupiah;
  /** nextTotal - previousTotal (bertanda). */
  readonly totalDelta: number;
  readonly lines: readonly PriceChangeLine[];
  readonly statusBefore: BudgetStatus | null;
  readonly statusAfter: BudgetStatus | null;
  readonly projectionAfter: Rupiah | null;
}

/** Isi blok "Perubahan terakhir" di Checkout (UX-SPEC 4.5 dan K-7). */
export interface LastPriceChange {
  readonly previousTotal: Rupiah;
  readonly nextTotal: Rupiah;
  /** Disusun dari potongan baku: "alamat diganti ke {Label alamat}". */
  readonly causeText: string;
}

/** Pemberitahuan inline di area voucher Cart (UX-SPEC C-5, C-6). */
export interface InlineNotice {
  /** Naik setiap ada pemberitahuan baru, agar live region diumumkan ulang. */
  readonly seq: number;
  readonly kind: 'VOUCHER_REMOVED' | 'VOUCHER_REPLACED';
  readonly variant: 'warning' | 'success';
  /** Satu baris per voucher. Teks persis UX-SPEC 5.3. */
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
  /** max(0, budget - spentAfter). null jika budget belum diatur. */
  readonly remainingBudget: Rupiah | null;
  /** max(0, spentAfter - budget). 0 jika tidak melebihi atau budget belum diatur. */
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
  /** Total di Cart, di Checkout, dan jumlah dibayar. Ketiganya selalu sama (BR-03). */
  readonly cartTotal: Rupiah;
  readonly checkoutTotal: Rupiah;
  readonly paidAmount: Rupiah;
  /** paidAmount - checkoutTotal. Selalu 0 (FR-04.1). */
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

/** Tepat satu overlay aktif pada satu waktu. */
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

/** State penuh aplikasi: bagian persisten + bagian volatil (hilang saat refresh). */
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
```

**Pemetaan overlay `OverlayState` ke 7 overlay `UX-SPEC` 2.1:**

| `overlay.kind` | Overlay UX-SPEC | Varian `Modal` (DESIGN-SYSTEM 5.16) |
|---|---|---|
| `BUDGET_SETTINGS` | 1. Pengaturan Budget | `sheet` |
| `INFO_SHEET` | 2. Info Sheet Komponen Biaya | `sheet` |
| `VOUCHER_PANEL` | 3. Daftar Voucher | `sheet` |
| `ADDRESS_PICKER` | 4. Pilih Alamat | `sheet` |
| `CONFIRM_REPLACE_CART` | 5. Konfirmasi Ganti Keranjang | `dialog` (`ConfirmDialog`) |
| `PRICE_CHANGE_NOTICE` | 6. Pemberitahuan Perubahan Total | `dialog` |
| `BUDGET_EXCEEDED` | 7. Dialog EXCEEDED | `dialog` (`alertdialog`) |
| `CONFIRM_RESET` | Konfirmasi "Reset data demo" (UX-SPEC 3.6 dan 5.3, memakai `ConfirmDialog`) | `dialog` |

**Tipe pricing** (`src/types/pricing.ts`), dipakai oleh `AppState.Receipt` dan Bagian 3:

```ts
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
  /** Ongkir efektif = ongkir dasar restoran + selisih ongkir alamat (UX-SPEC A-5). */
  readonly deliveryFee: Rupiah;
  readonly baseDeliveryFee: Rupiah;
  readonly addressDeliveryDelta: Rupiah;
  readonly serviceFee: Rupiah;
  readonly foodDiscount: Rupiah;
  readonly deliveryDiscount: Rupiah;
  readonly total: Rupiah;
  readonly appliedFoodVoucher: AppliedVoucherResult | null;
  readonly appliedDeliveryVoucher: AppliedVoucherResult | null;
  /** Voucher terpasang yang tidak eligible. Pada state sehat selalu kosong (invarian I-2). */
  readonly rejectedVouchers: readonly RejectedVoucher[];
}

export interface BudgetEvaluation {
  readonly budget: Rupiah;
  readonly projection: Rupiah;
  readonly status: BudgetStatus;
  /** max(0, budget - projection). Dipakai kalimat WARN "Sisa Rp{n}". */
  readonly leftover: Rupiah;
  /** max(0, projection - budget). Dipakai kalimat EXCEEDED dan dialog. */
  readonly exceededBy: Rupiah;
  readonly barPercent: number;
  readonly percentLabel: string;
}
```

### 2.3 Nilai Awal Profil Default Wira

`createInitialState()` (di `src/state/reducer.ts`) mengembalikan:

| Properti | Nilai awal | Sumber |
|---|---|---|
| `schemaVersion` | `1` | Versi skema |
| `budget` | `50000` | PRD 9.1 |
| `spentToday` | `12000` | PRD 9.1 |
| `addressId` | `"ADDR-01"` | PRD 9.1, UX-SPEC A1 |
| `cart` | `{ restaurantId: null, lines: [], foodVoucherId: null, deliveryVoucherId: null }` | NFR-05 |
| `budgetFilterOn` | `false` | Profil default |
| `sortMode` | `"default"` | UX-SPEC H-1 |
| `pendingAddItem`, `pendingPriceChange`, `lastPriceChange`, `inlineNotice`, `lastReceipt` | `null` | Volatil |
| `overlay` | `{ kind: "NONE" }` | Volatil |
| `overflowMenuOpen` | `false` | Volatil |
| `noticeSeq` | `0` | Volatil |

```ts
export function createEmptyCart(): CartState {
  return { restaurantId: null, lines: [], foodVoucherId: null, deliveryVoucherId: null };
}

export function createInitialState(): AppState {
  return {
    schemaVersion: 1,
    budget: DEFAULT_PROFILE.budget,
    spentToday: DEFAULT_PROFILE.spentToday,
    addressId: DEFAULT_PROFILE.addressId,
    cart: createEmptyCart(),
    budgetFilterOn: DEFAULT_PROFILE.budgetFilterOn,
    sortMode: DEFAULT_PROFILE.sortMode,
    pendingAddItem: null,
    pendingPriceChange: null,
    lastPriceChange: null,
    inlineNotice: null,
    lastReceipt: null,
    overlay: { kind: 'NONE' },
    overflowMenuOpen: false,
    noticeSeq: 0,
  };
}
```

### 2.4 Persistensi `localStorage["tpbg:v1"]`

#### 2.4.1 Apa yang Disimpan

| Disimpan (`PersistedState`) | Tidak disimpan (volatil) | Alasan |
|---|---|---|
| `budget`, `spentToday`, `cart`, `addressId` | `pendingAddItem`, `pendingPriceChange`, `lastPriceChange` | Dialog dan blok sementara tidak boleh "hidup lagi" setelah refresh |
| `budgetFilterOn`, `sortMode` | `inlineNotice`, `overlay`, `overflowMenuOpen`, `noticeSeq` | Efek UI sesaat |
| `schemaVersion` | `lastReceipt` | Struk tidak dapat dibuka kembali (UX-SPEC 2.3). Refresh pada `/struk` mengarahkan ke `/` |

**Aturan `toPersisted` (mencegah perubahan harga diam-diam, BR-05).** Jika `pendingPriceChange !== null` (dialog perubahan total sedang terbuka), `addressId` yang disimpan adalah `pendingPriceChange.previousAddressId`. Alamat baru baru dipersistensi setelah pemberitahuan ditampilkan dan dikonfirmasi (`PRICE_CHANGE_ACK`). Dengan begitu refresh di tengah dialog tidak pernah meninggalkan alamat berubah tanpa pemberitahuan.

```ts
export function toPersisted(state: AppState): PersistedState {
  return {
    schemaVersion: 1,
    budget: state.budget,
    spentToday: state.spentToday,
    addressId: state.pendingPriceChange === null ? state.addressId : state.pendingPriceChange.previousAddressId,
    cart: state.cart,
    budgetFilterOn: state.budgetFilterOn,
    sortMode: state.sortMode,
  };
}
```

#### 2.4.2 Aturan Validasi dan Sanitasi Saat Membaca

| No | Aturan | Perlakuan jika tidak valid |
|---|---|---|
| S-1 | `localStorage` tidak dapat diakses (`SecurityError`, mode privat, dinonaktifkan) | Seluruh akses dalam `try/catch`. Aplikasi berjalan dari state awal dan tetap berfungsi di memori |
| S-2 | Kunci tidak ada | Pakai `createInitialState()` |
| S-3 | `JSON.parse` gagal (JSON rusak) | Pakai `createInitialState()`. Coba `removeItem` di dalam `try/catch` |
| S-4 | Nilai hasil parse bukan objek biasa, atau `schemaVersion !== 1` | Pakai `createInitialState()` |
| S-5 | `budget` bukan `null` dan bukan bilangan bulat dalam `10000..500000` | `null` ("belum diatur"). Aplikasi tidak pernah menciptakan budget yang tidak diatur pengguna |
| S-6 | `spentToday` bukan bilangan bulat aman dalam `0..999999999` | `12000` (profil default) |
| S-7 | `addressId` bukan salah satu dari `ADDR-01`, `ADDR-02`, `ADDR-03` | `"ADDR-01"` |
| S-8 | `cart.restaurantId` bukan ID restoran yang ada | Seluruh cart dikosongkan |
| S-9 | Entri `lines` bukan objek, `menuItemId` tidak ada pada mock data, `qty` bukan angka hingga | Entri dibuang |
| S-10 | `menuItemId` bukan milik `cart.restaurantId` | Entri dibuang (tidak ada pencampuran restoran, FR-03.7) |
| S-11 | `qty` bukan bilangan bulat `1..99` | `Math.floor` lalu dijepit ke `1..99` (misalnya `0` menjadi `1`, `2.7` menjadi `2`, `500` menjadi `99`) |
| S-12 | `menuItemId` ganda | Digabung (qty dijumlahkan lalu dijepit ke `99`), urutan kemunculan pertama dipertahankan |
| S-13 | `lines` kosong setelah sanitasi | `cart` kosong, `addressId` menjadi `"ADDR-01"` (invarian I-4) |
| S-14 | `foodVoucherId` / `deliveryVoucherId` bukan ID voucher, salah slot, atau tidak lolos `evaluateVoucher` terhadap subtotal dan restoran cart | Dilepas **secara diam-diam** menjadi `null` (tanpa `InlineNotice`) |
| S-15 | `budgetFilterOn` bukan boolean | `false`. Jika `budget === null` maka dipaksa `false` (FR-01.8) |
| S-16 | `sortMode` bukan `"default"` atau `"cheapest-all-in"` | `"default"` |
| S-17 | Properti tidak dikenal | Diabaikan |

**Kode sanitasi** (`src/state/persistence.ts`):

```ts
import { ADDRESSES, DEFAULT_ADDRESS_ID } from '../data/addresses';
import { MENU_ITEMS } from '../data/menuItems';
import { DEFAULT_PROFILE } from '../data/profile';
import { RESTAURANTS } from '../data/restaurants';
import { VOUCHERS } from '../data/vouchers';
import { BUDGET_MAX, BUDGET_MIN } from '../lib/budget';
import { computeCartSubtotal, createEmptyCart } from '../lib/cart';
import { clampInt } from '../lib/intMath';
import { evaluateVoucher } from '../lib/pricing';
import type {
  AddressId, MenuItemId, RestaurantId, SortMode, VoucherId, VoucherSlot,
} from '../types/domain';
import type { AppState, CartLine, CartState, PersistedState } from '../types/state';
import { QTY_MAX, QTY_MIN } from '../types/state';

export const STORAGE_KEY = 'tpbg:v1';
const MAX_SPENT = 999999999;

export interface MinimalStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export function getBrowserStorage(): MinimalStorage | null {
  try {
    return typeof window === 'undefined' ? null : window.localStorage;
  } catch {
    return null;
  }
}

function hasOwn(obj: object, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isRestaurantId(value: unknown): value is RestaurantId {
  return typeof value === 'string' && hasOwn(RESTAURANTS, value);
}

function isMenuItemId(value: unknown): value is MenuItemId {
  return typeof value === 'string' && hasOwn(MENU_ITEMS, value);
}

function isVoucherId(value: unknown): value is VoucherId {
  return typeof value === 'string' && hasOwn(VOUCHERS, value);
}

function isAddressId(value: unknown): value is AddressId {
  return typeof value === 'string' && hasOwn(ADDRESSES, value);
}

function isSortMode(value: unknown): value is SortMode {
  return value === 'default' || value === 'cheapest-all-in';
}

function sanitizeVoucherSlot(
  raw: unknown,
  slot: VoucherSlot,
  restaurantId: RestaurantId,
  subtotal: number,
): VoucherId | null {
  if (!isVoucherId(raw)) return null;
  const voucher = VOUCHERS[raw];
  if (voucher.slot !== slot) return null;
  const evaluation = evaluateVoucher(voucher, { restaurantId, subtotal });
  return evaluation.eligible ? voucher.id : null;
}

export function sanitizeCart(raw: unknown): CartState {
  if (!isRecord(raw)) return createEmptyCart();
  const restaurantId = raw['restaurantId'];
  const rawLines = raw['lines'];
  if (!isRestaurantId(restaurantId) || !Array.isArray(rawLines)) return createEmptyCart();

  const merged = new Map<MenuItemId, number>();
  for (const entry of rawLines as unknown[]) {
    if (!isRecord(entry)) continue;
    const id = entry['menuItemId'];
    const qty = entry['qty'];
    if (!isMenuItemId(id) || typeof qty !== 'number' || !Number.isFinite(qty)) continue;
    if (MENU_ITEMS[id].restaurantId !== restaurantId) continue;
    const clamped = clampInt(Math.floor(qty), QTY_MIN, QTY_MAX);
    merged.set(id, clampInt((merged.get(id) ?? 0) + clamped, QTY_MIN, QTY_MAX));
  }

  const lines: CartLine[] = [];
  merged.forEach((qty, menuItemId) => {
    lines.push({ menuItemId, qty });
  });
  if (lines.length === 0) return createEmptyCart();

  const subtotal = computeCartSubtotal(lines);
  return {
    restaurantId,
    lines,
    foodVoucherId: sanitizeVoucherSlot(raw['foodVoucherId'], 'FOOD', restaurantId, subtotal),
    deliveryVoucherId: sanitizeVoucherSlot(raw['deliveryVoucherId'], 'DELIVERY', restaurantId, subtotal),
  };
}

export function sanitizePersisted(raw: unknown): PersistedState {
  if (!isRecord(raw) || raw['schemaVersion'] !== 1) return toPersistedDefault();

  const rawBudget = raw['budget'];
  const budget =
    typeof rawBudget === 'number' &&
    Number.isInteger(rawBudget) &&
    rawBudget >= BUDGET_MIN &&
    rawBudget <= BUDGET_MAX
      ? rawBudget
      : null;

  const rawSpent = raw['spentToday'];
  const spentToday =
    typeof rawSpent === 'number' && Number.isSafeInteger(rawSpent) && rawSpent >= 0 && rawSpent <= MAX_SPENT
      ? rawSpent
      : DEFAULT_PROFILE.spentToday;

  const cart = sanitizeCart(raw['cart']);
  const rawAddress = raw['addressId'];
  const addressId: AddressId =
    cart.lines.length > 0 && isAddressId(rawAddress) ? rawAddress : DEFAULT_ADDRESS_ID;

  const rawFilter = raw['budgetFilterOn'];
  const budgetFilterOn = budget !== null && rawFilter === true;
  const rawSort = raw['sortMode'];
  const sortMode: SortMode = isSortMode(rawSort) ? rawSort : 'default';

  return { schemaVersion: 1, budget, spentToday, addressId, cart, budgetFilterOn, sortMode };
}

function toPersistedDefault(): PersistedState {
  return {
    schemaVersion: 1,
    budget: DEFAULT_PROFILE.budget,
    spentToday: DEFAULT_PROFILE.spentToday,
    addressId: DEFAULT_PROFILE.addressId,
    cart: createEmptyCart(),
    budgetFilterOn: DEFAULT_PROFILE.budgetFilterOn,
    sortMode: DEFAULT_PROFILE.sortMode,
  };
}

export type LoadStatus = 'LOADED' | 'DEFAULTED' | 'STORAGE_UNAVAILABLE';

export interface LoadResult {
  readonly state: PersistedState;
  readonly status: LoadStatus;
}

export function loadPersistedState(storage: MinimalStorage | null): LoadResult {
  if (storage === null) return { state: toPersistedDefault(), status: 'STORAGE_UNAVAILABLE' };
  let raw: string | null;
  try {
    raw = storage.getItem(STORAGE_KEY);
  } catch {
    return { state: toPersistedDefault(), status: 'STORAGE_UNAVAILABLE' };
  }
  if (raw === null) return { state: toPersistedDefault(), status: 'DEFAULTED' };
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    try {
      storage.removeItem(STORAGE_KEY);
    } catch {
      /* penyimpanan tidak dapat diubah: abaikan, aplikasi tetap berjalan */
    }
    return { state: toPersistedDefault(), status: 'DEFAULTED' };
  }
  return { state: sanitizePersisted(parsed), status: 'LOADED' };
}

/** Mengembalikan false jika penyimpanan penuh atau tidak tersedia. Tidak pernah melempar galat. */
export function savePersistedState(storage: MinimalStorage | null, state: PersistedState): boolean {
  if (storage === null) return false;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function createStateFromStorage(storage: MinimalStorage | null): AppState {
  const loaded = loadPersistedState(storage).state;
  return {
    schemaVersion: 1,
    budget: loaded.budget,
    spentToday: loaded.spentToday,
    addressId: loaded.addressId,
    cart: loaded.cart,
    budgetFilterOn: loaded.budgetFilterOn,
    sortMode: loaded.sortMode,
    pendingAddItem: null,
    pendingPriceChange: null,
    lastPriceChange: null,
    inlineNotice: null,
    lastReceipt: null,
    overlay: { kind: 'NONE' },
    overflowMenuOpen: false,
    noticeSeq: 0,
  };
}
```

#### 2.4.3 Aturan Menyimpan dan Menyambungkan ke React

| Aturan | Spesifikasi |
|---|---|
| Pemicu simpan | Setiap kali hasil `JSON.stringify(toPersisted(state))` berubah (bukan setiap perubahan state volatil) |
| Kuota penuh atau penyimpanan diblokir | `savePersistedState` mengembalikan `false`. Aplikasi tetap berjalan dari memori tanpa dialog galat (NFR-10) dan mencoba lagi pada perubahan berikutnya |
| Tab ganda | Tidak ada sinkronisasi lintas tab. Perilaku "tulis terakhir menang" diterima untuk prototype |
| Asal `null` pada budget | Tidak ada aksi UI untuk menghapus budget (PRD tidak mendefinisikannya). Nilai `null` dicapai lewat sanitasi S-5 atau dengan menanam `localStorage["tpbg:v1"]` berisi `budget: null` untuk skenario `TS-08` |

```tsx
export function AppStateProvider({ children }: { children: ReactNode }): JSX.Element {
  const storage = useMemo(() => getBrowserStorage(), []);
  const [state, dispatch] = useReducer(appReducer, storage, createStateFromStorage);
  const serialized = JSON.stringify(toPersisted(state));

  useEffect(() => {
    savePersistedState(storage, JSON.parse(serialized) as PersistedState);
  }, [storage, serialized]);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}
```

### 2.5 Urutan Reset Atomik "Reset data demo" (UX-SPEC 3.6 dan 5.3)

Reset adalah **satu transisi reducer** (`RESET_CONFIRM`). Tidak ada keadaan setengah-reset yang dapat dirender.

| Langkah | Aksi | Keterangan |
|---|---|---|
| 1 | Menu overflow `[⋮]` → item "Reset data demo" | Handler memanggil `rememberFocusReturn` pada `[⋮]` lalu dispatch `RESET_REQUESTED`: `overflowMenuOpen = false`, `overlay = { kind: "CONFIRM_RESET" }` |
| 2 | Dialog konfirmasi: "Kembalikan data demo ke awal? Budget, pengeluaran, alamat, dan keranjang akan direset." dengan `[Reset]` dan `[Batal]` | Fokus awal `[Batal]`. `Escape`, `X`, atau klik luar sama dengan `[Batal]` |
| 3 | `[Reset]` → dispatch `RESET_CONFIRM` | Guard: `overlay.kind === "CONFIRM_RESET"`. Selain itu diabaikan |
| 4 | Reducer mengembalikan `createInitialState()` secara utuh | Mengganti **seluruh** state: `budget = 50000`, `spentToday = 12000`, `addressId = "ADDR-01"`, `cart` kosong dengan kedua voucher `null`, `budgetFilterOn = false`, `sortMode = "default"`. Seluruh bagian volatil ikut bersih: `pendingAddItem`, `pendingPriceChange`, `lastPriceChange`, `inlineNotice`, `lastReceipt` = `null`, `overlay = NONE`, `overflowMenuOpen = false`, `noticeSeq = 0` |
| 5 | Efek persistensi menyimpan `toPersisted(state)` | Tepat satu `setItem` menimpa isi `"tpbg:v1"`. Jika gagal, coba `removeItem` (di dalam `try/catch`) agar refresh tidak memuat data lama |
| 6 | Navigasi | Jika rute aktif bukan Home, `navigate("/", { replace: true })` agar tidak berada di Checkout atau Struk dengan cart kosong |
| 7 | Fokus | Jika berpindah rute: fokus ke `main#konten`. Jika tetap di Home: fokus kembali ke `[⋮]` (target pengembalian) |
| 8 | Hasil terlihat | Header: "Sisa budget: Rp38.000". Badge dan filter dihitung ulang. Badge Cart di header hilang |

```ts
case 'RESET_REQUESTED':
  return patch(state, { overflowMenuOpen: false, overlay: { kind: 'CONFIRM_RESET' } });

case 'RESET_CONFIRM':
  if (state.overlay.kind !== 'CONFIRM_RESET') return state;
  return createInitialState();
```

---

## Section 3: Kontrak Mesin Kalkulasi Tunggal (`calculateOrder`) dan Fungsi Domain Murni

Seluruh fungsi pada bagian ini **murni** (tanpa efek samping), berbasis **bilangan bulat** (`BR-01`), dan memenuhi `NFR-02` (kalkulasi ulang kurang dari 100 ms: kompleksitas O(jumlah baris) dengan jumlah baris maksimal 4 pada mock data).

### 3.1 Primitif Bilangan Bulat (`src/lib/intMath.ts`)

```ts
export function floorDiv(dividend: number, divisor: number): number {
  if (!Number.isSafeInteger(dividend) || !Number.isSafeInteger(divisor) || dividend < 0 || divisor <= 0) {
    throw new RangeError('floorDiv: operan harus bilangan bulat aman, dividend >= 0, divisor > 0 (BR-01)');
  }
  return (dividend - (dividend % divisor)) / divisor;
}

export function clampInt(value: number, min: number, max: number): number {
  if (!Number.isInteger(value)) {
    throw new RangeError('clampInt: nilai harus bilangan bulat');
  }
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

export function assertRupiah(value: number, name: string): void {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new RangeError(name + ': harus bilangan bulat Rupiah >= 0 (BR-01)');
  }
}
```

`floorDiv` memakai sisa bagi (`%`) sehingga pembagian terakhir selalu dari dua bilangan bulat yang habis dibagi. Tidak ada `Math.floor` pada hasil pembagian desimal.

### 3.2 `calculateOrder` (`src/lib/pricing.ts`)

**Signature:**

```ts
export function calculateOrder(input: CalculateOrderInput): OrderBreakdown;
```

`calculateOrder` adalah **satu-satunya** fungsi yang menghasilkan angka harga final. Ia dipakai oleh Cart, Checkout, Struk, pratinjau voucher ("Total menjadi Rp{n}"), perhitungan sebelum/sesudah perubahan alamat, dan estimasi (Bagian 3.5). Tidak ada komponen yang menghitung harga sendiri (`BR-02`, `FR-04.2`, `FR-03.1`).

**Langkah demi langkah** (urutan PRD 6.2):

| Langkah | Komponen | Rumus bilangan bulat | Aturan |
|---|---|---|---|
| 0 | Prakondisi | `lines.length === 0` → kembalikan `EMPTY_BREAKDOWN` (seluruh nilai `0`, `isEmpty = true`). Setiap `qty` bilangan bulat `1..99`. Setiap `item.restaurantId === restaurant.id`. Selain itu melempar `RangeError` (galat pemrogram, bukan input pengguna) | NFR-10 |
| 1 | `subtotal` | `Σ (listPrice − discount) × qty` | `BR-01`, PRD 6.2 langkah 1 |
| 2 | `taxableSubtotal`, `tax` | `taxableSubtotal = Σ netPrice × qty` hanya untuk `taxStatus === "NOT_INCLUDED"`. `tax = floorDiv(taxableSubtotal × taxRatePercent + 50, 100)` | `BR-06` (round half up). Pajak dihitung **sekali atas total dasar pajak**, bukan per item |
| 3 | `itemCount`, `packaging` | `itemCount = Σ qty`. `packaging = itemCount × packagingFeePerItem` | PRD 6.2 langkah 3 |
| 4 | `deliveryFee` | `baseDeliveryFee + address.deliveryFeeDelta` | Ongkir efektif (UX-SPEC A-5) |
| 5 | `serviceFee` | `restaurant.serviceFee` | Tarif tetap per pesanan |
| 6 | `foodDiscount` | Jika `foodVoucher !== null`: `evaluateVoucher` terhadap `subtotal`. Jika eligible: `computeVoucherDiscount` dengan `subtotal`. Jika tidak: `0` dan voucher masuk `rejectedVouchers` | `BR-07` (a)(b)(c)(e) |
| 7 | `deliveryDiscount` | Jika `deliveryVoucher !== null`: sama, terhadap `deliveryFee` (ongkir efektif) | `BR-07` (a)(b)(d)(e) |
| 8 | `total` | `max(0, subtotal + tax + packaging + deliveryFee + serviceFee − foodDiscount − deliveryDiscount)` | PRD 6.2 langkah 8, tidak boleh negatif |

**Aturan slot:** `foodVoucher` harus berslot `FOOD` dan `deliveryVoucher` berslot `DELIVERY`. Pelanggaran melempar `RangeError`.

**Implementasi acuan:**

```ts
import { ADDRESSES } from '../data/addresses';
import { assertRupiah, floorDiv } from './intMath';
import type {
  Address, MenuItem, Restaurant, Rupiah, Voucher, VoucherSlot,
} from '../types/domain';
import { getNetPrice } from '../types/domain';
import type {
  AppliedVoucherResult, CalculateOrderInput, OrderBreakdown, RejectedVoucher,
  ResolvedLine, VoucherEvaluation,
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
```

**Jaminan kontrak:**

| Jaminan | Penjelasan |
|---|---|
| Determinisme | Input sama selalu menghasilkan output sama (BR-02, BR-03) |
| Tidak ada float | Semua operasi `+ − ×` pada bilangan bulat aman. Pembagian hanya lewat `floorDiv` |
| Tidak mengubah input | Seluruh tipe `readonly` |
| Tidak diam-diam | Voucher tidak eligible tidak pernah mengurangi total, dan dilaporkan di `rejectedVouchers` |
| Satu sumber | Hanya fungsi ini yang memproduksi `total` untuk tampilan Cart, Checkout, Struk, dan dialog |

### 3.3 `evaluateVoucher` dan `computeVoucherDiscount`

**Signature:**

```ts
export function evaluateVoucher(
  voucher: Voucher,
  context: { readonly restaurantId: RestaurantId; readonly subtotal: Rupiah },
): VoucherEvaluation;

export function computeVoucherDiscount(
  voucher: Voucher,
  context: { readonly subtotal: Rupiah; readonly deliveryFee: Rupiah },
): Rupiah;
```

**`evaluateVoucher`** (`BR-07` b dan e, `AC-03.5`):

| Urutan | Kondisi | Hasil |
|---|---|---|
| 1 | `voucher.onlyRestaurantId !== null` dan `!== restaurantId` | `{ eligible: false, reason: "RESTAURANT_MISMATCH", onlyRestaurantId }` |
| 2 | `subtotal < voucher.minSubtotal` (syarat inklusif: `subtotal ≥ minimum` lolos) | `{ eligible: false, reason: "MIN_SUBTOTAL", shortfall: voucher.minSubtotal − subtotal }` |
| 3 | Selain itu | `{ eligible: true }` |

`shortfall` adalah selisih **eksak** (bilangan bulat positif) dan dipakai langsung pada pesan. Contoh `AC-03.5`: subtotal `Rp20.000` dan `V-F01` (minimum `Rp25.000`) menghasilkan `shortfall = 5000`.

```ts
export function evaluateVoucher(
  voucher: Voucher,
  context: { readonly restaurantId: RestaurantId; readonly subtotal: Rupiah },
): VoucherEvaluation {
  if (voucher.onlyRestaurantId !== null && voucher.onlyRestaurantId !== context.restaurantId) {
    return { eligible: false, reason: 'RESTAURANT_MISMATCH', onlyRestaurantId: voucher.onlyRestaurantId };
  }
  if (context.subtotal < voucher.minSubtotal) {
    return { eligible: false, reason: 'MIN_SUBTOTAL', shortfall: voucher.minSubtotal - context.subtotal };
  }
  return { eligible: true };
}
```

**`computeVoucherDiscount`** (`BR-06` untuk persentase, `BR-07` c dan d). Prasyarat: voucher sudah eligible.

| Jenis | Nilai dasar | Plafon | Hasil |
|---|---|---|---|
| Makanan nominal (`FOOD`, `FIXED`) | `value` | `maxDiscount ?? value` (n/a berarti tanpa plafon tambahan) | `min(value, plafon, subtotal)` |
| Makanan persentase (`FOOD`, `PERCENT`) | `floorDiv(subtotal × percent, 100)` (dibulatkan **ke bawah**, BR-06) | `maxDiscount` | `min(nilai dasar, maxDiscount, subtotal)` |
| Ongkir nominal (`DELIVERY`, `FIXED`) | `value` | `maxDiscount` | `min(value, maxDiscount, deliveryFee)` (**ongkir efektif**, UX-SPEC A-5) |

```ts
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
```

### 3.4 Pesan Alasan Voucher (`src/lib/voucherCopy.ts`)

Teks persis `UX-SPEC` 5.3. Pesan **tidak** dibuat di dalam `pricing.ts` agar mesin kalkulasi bebas dari format dan data tampilan.

```ts
import { RESTAURANTS } from '../data/restaurants';
import type { RestaurantId } from '../types/domain';
import type { VoucherEvaluation } from '../types/pricing';
import { formatRupiah } from './formatRupiah';

export function voucherReasonMessage(evaluation: Exclude<VoucherEvaluation, { eligible: true }>): string {
  if (evaluation.reason === 'MIN_SUBTOTAL') {
    return 'Kurang ' + formatRupiah(evaluation.shortfall) + ' dari minimum belanja.';
  }
  const restaurant = RESTAURANTS[evaluation.onlyRestaurantId as RestaurantId];
  return 'Hanya berlaku di ' + restaurant.name + '.';
}
```

| Kejadian | Teks (persis) |
|---|---|
| Tidak eligible (minimum) | `Kurang Rp5.000 dari minimum belanja.` |
| Tidak eligible (restoran) | `Hanya berlaku di {Nama restoran}.` (hanya untuk kelengkapan. Voucher khusus restoran lain tidak tampil di daftar, UX-SPEC A7) |
| Voucher dilepas otomatis | `{Nama voucher} dilepas karena subtotal di bawah minimum Rp{n}. Total dihitung ulang.` |
| Voucher diganti | `{Voucher lama} diganti {Voucher baru}.` |

### 3.5 `estimateMenuItemAllIn` dan `estimateRestaurantAllIn` (`BR-10`, UX-SPEC A2)

**Signature:**

```ts
export function estimateMenuItemAllIn(restaurant: Restaurant, item: MenuItem): Rupiah;
export function estimateRestaurantAllIn(restaurant: Restaurant, signatureItem: MenuItem): Rupiah;
```

| Aturan | Spesifikasi |
|---|---|
| Satuan | 1 porsi (`qty = 1`) |
| Langkah | PRD 6.2 langkah 1 sampai 5, **tanpa voucher** (`foodVoucher = null`, `deliveryVoucher = null`) |
| Ongkir | Ongkir dasar restoran, setara alamat `ADDR-01` (`deliveryFeeDelta = 0`). Memilih alamat lain di Checkout tidak memengaruhi estimasi (UX-SPEC A2) |
| Harga | Harga net setelah diskon promo item (`FR-01.5`, `AC-01.6`) |
| Implementasi | Memanggil `calculateOrder` (bukan rumus kedua), sehingga selalu konsisten dengan Cart |
| `estimateRestaurantAllIn` | Sama dengan `estimateMenuItemAllIn(restaurant, signatureItem)`. Pemanggil mengirim menu andalan `MENU_ITEMS[restaurant.signatureMenuItemId]` |

```ts
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
```

**Nilai acuan (wajib lolos unit test):**

| Restoran | Menu andalan | Estimasi | Proyeksi (profil default) | Status |
|---|---|---:|---|---|
| R-01 | M-101 | Rp50.000 | Rp62.000 (124%) | EXCEEDED |
| R-02 | M-201 (net Rp15.000) | Rp26.500 | Rp38.500 (77%) | OK |
| R-03 | M-301 | Rp25.000 | Rp37.000 (74%) | OK |
| R-04 | M-401 | Rp28.500 | Rp40.500 (81%) | WARN |
| R-05 | M-501 (net Rp19.000) | Rp41.900 | Rp53.900 (107,8%) | EXCEEDED |
| R-06 | M-601 | Rp35.000 | Rp47.000 (94%) | WARN |
| R-01 | M-104 (sudah termasuk pajak) | Rp25.000 | n/a | n/a |

### 3.6 `getProjection`, `getBudgetStatus`, dan Validasi Budget (`src/lib/budget.ts`)

**Signature dan aturan:**

```ts
export function getProjection(spentToday: Rupiah, orderValue: Rupiah): Rupiah;
export function getBudgetStatus(projection: Rupiah, budget: Rupiah): BudgetStatus;
export function evaluateBudget(
  budget: Rupiah | null,
  spentToday: Rupiah,
  orderValue: Rupiah,
): BudgetEvaluation | null;
```

| Fungsi | Aturan |
|---|---|
| `getProjection` | `spentToday + orderValue` (`BR-08`). Untuk kartu restoran `orderValue` = estimasi all-in. Untuk Cart dan Checkout `orderValue` = `breakdown.total` |
| `getBudgetStatus` | Aritmetika bilangan bulat tanpa pembulatan persen (`BR-09`): `EXCEEDED` jika `projection > budget`. `WARN` jika `projection × 100 ≥ budget × 80` (dan tidak EXCEEDED, sehingga tepat 100% adalah WARN). Selain itu `OK` |
| `evaluateBudget` | `null` jika `budget === null` (badge dan tracker tidak dirender, `FR-05.5`). Selain itu mengisi `BudgetEvaluation` (Bagian 2.2) memakai `formatPercent` dan `barPercent` dari `formatRupiah.ts` |

```ts
import { barPercent, formatPercent } from './formatRupiah';

export const BUDGET_MIN = 10000;
export const BUDGET_MAX = 500000;

export function getProjection(spentToday: Rupiah, orderValue: Rupiah): Rupiah {
  return spentToday + orderValue;
}

export function getBudgetStatus(projection: Rupiah, budget: Rupiah): BudgetStatus {
  if (projection > budget) return 'EXCEEDED';
  if (projection * 100 >= budget * 80) return 'WARN';
  return 'OK';
}

export function evaluateBudget(
  budget: Rupiah | null,
  spentToday: Rupiah,
  orderValue: Rupiah,
): BudgetEvaluation | null {
  if (budget === null) return null;
  const projection = getProjection(spentToday, orderValue);
  return {
    budget,
    projection,
    status: getBudgetStatus(projection, budget),
    leftover: Math.max(0, budget - projection),
    exceededBy: Math.max(0, projection - budget),
    barPercent: barPercent(projection, budget),
    percentLabel: formatPercent(projection, budget),
  };
}
```

**Tampilan sisa budget header** (UX-SPEC 2.2 dan A8):

```ts
export type HeaderBudgetView =
  | { readonly kind: 'NOT_SET' }
  | { readonly kind: 'REMAINING'; readonly amount: Rupiah }
  | { readonly kind: 'EXCEEDED'; readonly amount: Rupiah };

export function getHeaderBudgetView(budget: Rupiah | null, spentToday: Rupiah): HeaderBudgetView {
  if (budget === null) return { kind: 'NOT_SET' };
  if (spentToday > budget) return { kind: 'EXCEEDED', amount: spentToday - budget };
  return { kind: 'REMAINING', amount: budget - spentToday };
}
```

`NOT_SET` → "Atur budget". `REMAINING` → "Sisa budget: Rp{n}" (termasuk `Rp0` saat tepat habis). `EXCEEDED` → "Budget terlampaui Rp{n}".

**Validasi input budget** (`FR-01.1`, `FR-01.6`, `AC-01.3`):

```ts
export type BudgetInputError = 'EMPTY' | 'NOT_INTEGER' | 'BELOW_MIN' | 'ABOVE_MAX';

export const BUDGET_ERROR_MESSAGES: Record<BudgetInputError, string> = {
  EMPTY: 'Isi budget harian dulu. Contoh: 50000.',
  NOT_INTEGER: 'Budget harus bilangan bulat tanpa desimal.',
  BELOW_MIN: 'Budget minimal Rp10.000.',
  ABOVE_MAX: 'Budget maksimal Rp500.000.',
};

export type BudgetInputResult =
  | { readonly ok: true; readonly value: Rupiah }
  | { readonly ok: false; readonly error: BudgetInputError; readonly message: string };

function reject(error: BudgetInputError): BudgetInputResult {
  return { ok: false, error, message: BUDGET_ERROR_MESSAGES[error] };
}

export function validateBudgetInput(raw: string): BudgetInputResult {
  const text = raw.trim();
  if (text.length === 0) return reject('EMPTY');
  if (!/^[0-9]+$/.test(text)) return reject('NOT_INTEGER');
  const digits = text.replace(/^0+/, '');
  if (digits.length === 0) return reject('BELOW_MIN');
  if (digits.length > 6) return reject('ABOVE_MAX');
  const value = Number(digits);
  if (value < BUDGET_MIN) return reject('BELOW_MIN');
  if (value > BUDGET_MAX) return reject('ABOVE_MAX');
  return { ok: true, value };
}
```

### 3.7 Fungsi Cart (`src/lib/cart.ts`)

```ts
export function createEmptyCart(): CartState;

export function computeCartSubtotal(lines: readonly CartLine[]): Rupiah;

export function resolveCart(cart: CartState, addressId: AddressId): CalculateOrderInput | null;

export interface ReconcileResult {
  readonly cart: CartState;
  readonly removed: readonly Voucher[];
}
export function reconcileVouchers(cart: CartState): ReconcileResult;
```

| Fungsi | Aturan |
|---|---|
| `resolveCart` | `null` jika `restaurantId === null` atau `lines` kosong. Selain itu mengubah ID menjadi objek mock data dan memanggil input `calculateOrder` |
| `computeCartSubtotal` | Σ `netPrice × qty` dari `lines` (dipakai sanitasi dan reconcile tanpa harus membuat `CalculateOrderInput`) |
| `reconcileVouchers` | Mengevaluasi voucher makanan lalu voucher ongkir terhadap subtotal baru. Voucher yang tidak lagi eligible diganti `null` dan dikembalikan pada `removed` (urutan: makanan lalu ongkir). **Hanya melepas, tidak pernah memasang** voucher |

```ts
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

export function reconcileVouchers(cart: CartState): ReconcileResult {
  if (cart.restaurantId === null) {
    return { cart: createEmptyCart(), removed: [] };
  }
  const restaurantId = cart.restaurantId;
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
```

### 3.8 `filterAndSortRestaurants` (`src/lib/discovery.ts`)

**Signature:**

```ts
export interface DiscoveryParams {
  readonly query: string;
  readonly budget: Rupiah | null;
  readonly spentToday: Rupiah;
  readonly budgetFilterOn: boolean;
  readonly sortMode: SortMode;
}

export interface RestaurantCardModel {
  readonly restaurant: Restaurant;
  readonly signatureItem: MenuItem;
  /** Estimasi all-in menu andalan (BR-10), memakai harga net. */
  readonly estimate: Rupiah;
  readonly evaluation: BudgetEvaluation | null;
}

export function filterAndSortRestaurants(params: DiscoveryParams): readonly RestaurantCardModel[];
```

**Langkah:**

| Langkah | Aturan | Sumber |
|---|---|---|
| 1 | Bangun model kartu untuk seluruh restoran: `estimate = estimateRestaurantAllIn(restaurant, signatureItem)`, `evaluation = evaluateBudget(budget, spentToday, estimate)` | `BR-08`, `BR-10` |
| 2 | **Pencarian:** `q = query.trim().toLowerCase()`. Jika `q` kosong, tidak ada pembatasan. Jika tidak, simpan restoran yang `name` atau `category`-nya (huruf kecil) memuat `q` sebagai substring | PRD 8.2 (nama atau kategori) |
| 3 | **Filter "Sesuai Budget Saya":** hanya jika `budgetFilterOn === true` **dan** `budget !== null`. Simpan restoran dengan `evaluation.status` `OK` atau `WARN` (tepat 100% termasuk WARN). Jika `budget === null`, filter tidak berlaku | `FR-01.3`, `FR-01.8` |
| 4 | **Urut:** `"default"` = urutan data (`R-01` sampai `R-06`). `"cheapest-all-in"` = `estimate` menaik, seri dipecah dengan urutan ID menaik (stabil) | `FR-01.4`, UX-SPEC H-1 |

```ts
export function filterAndSortRestaurants(params: DiscoveryParams): readonly RestaurantCardModel[] {
  const q = params.query.trim().toLowerCase();
  const models: RestaurantCardModel[] = RESTAURANT_LIST.map((restaurant) => {
    const signatureItem = MENU_ITEMS[restaurant.signatureMenuItemId];
    const estimate = estimateRestaurantAllIn(restaurant, signatureItem);
    return {
      restaurant,
      signatureItem,
      estimate,
      evaluation: evaluateBudget(params.budget, params.spentToday, estimate),
    };
  });

  const searched = q.length === 0
    ? models
    : models.filter(
        (m) => m.restaurant.name.toLowerCase().includes(q) || m.restaurant.category.toLowerCase().includes(q),
      );

  const filtered = params.budgetFilterOn && params.budget !== null
    ? searched.filter((m) => m.evaluation !== null && m.evaluation.status !== 'EXCEEDED')
    : searched;

  if (params.sortMode === 'cheapest-all-in') {
    return filtered.slice().sort((a, b) =>
      a.estimate !== b.estimate
        ? a.estimate - b.estimate
        : a.restaurant.id < b.restaurant.id ? -1 : 1,
    );
  }
  return filtered;
}
```

### 3.9 Penyelarasan Modul `DESIGN-SYSTEM.md` ke TypeScript

**`src/lib/formatRupiah.ts`** (isi fungsi tidak berubah dari `DESIGN-SYSTEM` 3.4. Hanya signature yang diberi tipe):

```ts
export function formatRupiah(amount: number): string;
export function formatDiscount(amount: number): string;
export function formatSignedRupiah(amount: number): string;
export function formatPercent(proyeksi: number, budget: number): string;
export function barPercent(proyeksi: number, budget: number): number;
```

**`src/design/budgetStatus.ts`:** logika `getBudgetStatus` dipindahkan ke `src/lib/budget.ts` agar lapisan domain tidak mengimpor `lucide-react` (NFR-09). Modul desain mengekspor ulangnya sehingga `DESIGN-SYSTEM` 2.5 tetap valid.

```ts
import { CircleCheck, CircleX, TriangleAlert } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { BudgetStatus } from '../types/domain';

export { getBudgetStatus } from '../lib/budget';

export interface BudgetStatusTokens {
  readonly label: 'Sesuai budget' | 'Mepet budget' | 'Melebihi budget';
  readonly Icon: LucideIcon;
  readonly badge: string;
  readonly banner: string;
  readonly icon: string;
  readonly fill: string;
}

export const BUDGET_STATUS: Record<BudgetStatus, BudgetStatusTokens> = {
  OK: { label: 'Sesuai budget', Icon: CircleCheck, badge: 'border-emerald-300 bg-emerald-50 text-emerald-800', banner: 'border-emerald-300 bg-emerald-50 text-emerald-800', icon: 'text-emerald-700', fill: 'bg-emerald-700' },
  WARN: { label: 'Mepet budget', Icon: TriangleAlert, badge: 'border-amber-300 bg-amber-50 text-amber-900', banner: 'border-amber-300 bg-amber-50 text-amber-900', icon: 'text-amber-700', fill: 'bg-amber-700' },
  EXCEEDED: { label: 'Melebihi budget', Icon: CircleX, badge: 'border-rose-300 bg-rose-50 text-rose-800', banner: 'border-rose-300 bg-rose-50 text-rose-800', icon: 'text-rose-700', fill: 'bg-rose-700' },
};
```

**`src/data/artwork.ts`:**

```ts
import type { MenuItemId, RestaurantId } from '../types/domain';

export interface RestaurantArtwork {
  readonly emoji: string;
  readonly gradient: string;
}

export const RESTAURANT_ARTWORK: Record<RestaurantId, RestaurantArtwork>;
export const MENU_ITEM_EMOJI: Record<MenuItemId, string>;
```

Nilainya sama dengan tabel `DESIGN-SYSTEM` 4.5 (peta restoran dan peta item). Gradien memakai string kelas utuh.

### 3.10 Vektor Uji Wajib (NFR-03, M-07)

**A. Pricing (`calculateOrder`).** Seluruh baris alamat `ADDR-01` kecuali dinyatakan lain.

| ID | Cart | Voucher | Subtotal | Pajak | Kemasan | Ongkir | Layanan | Diskon makanan | Diskon ongkir | Total |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|
| P-01 (Contoh A) | R-01: M-101 | tidak ada | 30.000 | 3.000 | 2.000 | 12.000 | 3.000 | 0 | 0 | **50.000** |
| P-02 (AC-03.1) | R-01: M-101 + M-104 | tidak ada | 38.000 | 3.000 | 4.000 | 12.000 | 3.000 | 0 | 0 | **60.000** |
| P-03 (AC-03.2) | idem | V-F01 | 38.000 | 3.000 | 4.000 | 12.000 | 3.000 | 5.000 | 0 | **55.000** |
| P-04 (Contoh B, TS-02) | idem | V-F01 + V-D01 | 38.000 | 3.000 | 4.000 | 12.000 | 3.000 | 5.000 | 8.000 | **47.000** |
| P-05 (Contoh C, TS-03) | R-02: M-201 + M-203 + M-204 | V-F01 + V-D02 | 25.000 | 1.500 | 3.000 | 6.000 | 3.000 | 5.000 | 5.000 | **28.500** |
| P-06 | idem P-05 | tidak ada | 25.000 | 1.500 | 3.000 | 6.000 | 3.000 | 0 | 0 | **38.500** |
| P-07 (TS-04) | R-02: M-201 + M-203 | V-D02 (V-F01 dilepas) | 20.000 | 1.500 | 2.000 | 6.000 | 3.000 | 0 | 5.000 | **27.500** |
| P-08 (TS-05) | R-03: M-301 | tidak ada | 18.000 | 0 | 1.000 | 4.000 | 2.000 | 0 | 0 | **25.000** |
| P-09 | R-04: M-401 × 2 + M-402 | tidak ada | 50.000 | 3.000 | 3.000 | 8.000 | 3.000 | 0 | 0 | **67.000** |
| P-10 (persentase) | R-01: M-101 + M-104 | V-F02 | 38.000 | 3.000 | 4.000 | 12.000 | 3.000 | 7.600 | 0 | **52.400** |
| P-11 (plafon persentase) | R-01: M-101 + M-102 + M-103 | V-F02 | 45.000 | 4.000 | 6.000 | 12.000 | 3.000 | 8.000 (20% = 9.000 dipotong plafon) | 0 | **62.000** |
| P-12 (batas diskon ongkir) | R-03: M-301 + M-304 | V-D01 | 24.000 | 0 | 2.000 | 4.000 | 2.000 | 0 | 4.000 (dibatasi ongkir) | **28.000** |
| P-13 (V-F03) | R-05: M-503 × 2 | V-F03 | 70.000 | 7.000 | 4.000 | 15.000 | 4.000 | 10.000 | 0 | **90.000** |

Rincian cek P-07: 20.000 + 1.500 + 2.000 + 6.000 + 3.000 = 32.500, dikurangi 5.000 = 27.500. Proyeksi 39.500 (`39.500 × 100 = 3.950.000 < 4.000.000`), status OK.

**B. Pembulatan pajak (`BR-06`)** dengan fixture sintetis (tarif 10%):

| Dasar pajak | `floorDiv(dasar × 10 + 50, 100)` | Pajak |
|---:|---|---:|
| 15 | `floorDiv(200, 100)` | 2 |
| 14 | `floorDiv(190, 100)` | 1 |
| 5 | `floorDiv(100, 100)` | 1 |
| 4 | `floorDiv(90, 100)` | 0 |
| 15.000 | `floorDiv(150.050, 100)` | 1.500 |
| 30.000 | `floorDiv(300.050, 100)` | 3.000 |

**C. Alamat (UX-SPEC 4.5.1, asumsi A1).** Ongkir efektif = ongkir dasar + selisih alamat.

| ID | Cart | Alamat | Ongkir | Diskon ongkir | Total | Proyeksi | Status |
|---|---|---|---:|---:|---:|---|---|
| A-01 | Contoh C | ADDR-01 | 6.000 | 5.000 | 28.500 | 40.500 (81%) | WARN |
| A-02 | Contoh C | ADDR-02 | 9.000 | 5.000 | 31.500 | 43.500 (87%) | WARN |
| A-03 | Contoh C | ADDR-03 | 11.000 | 5.000 | 33.500 | 45.500 (91%) | WARN |
| A-04 | Contoh B | ADDR-02 | 15.000 | 8.000 | 50.000 | 62.000 (124%) | EXCEEDED |
| A-05 | Contoh B | ADDR-03 | 17.000 | 8.000 | 52.000 | 64.000 (128%) | EXCEEDED |
| A-06 | R-03: M-301 | ADDR-02 | 7.000 | 0 | 28.000 | 40.000 (80%) | WARN (tepat di batas) |
| A-07 | R-03: M-301 | ADDR-03 | 9.000 | 0 | 30.000 | 42.000 (84%) | WARN |
| A-08 | R-03: M-301 + V-D02 | ADDR-01 | 4.000 | 4.000 | 21.000 | 33.000 (66%) | OK |
| A-09 | R-03: M-301 + V-D02 | ADDR-02 | 7.000 | 5.000 | 23.000 | 35.000 (70%) | OK |

A-08 ke A-09: ongkir naik Rp3.000 tetapi total hanya naik Rp2.000 karena diskon ongkir naik Rp1.000 (`totalEffect` komponen: `+3.000` dan `−1.000`).

**D. Voucher (`evaluateVoucher`).**

| ID | Voucher | Cart (subtotal) | Hasil |
|---|---|---|---|
| E-01 (AC-03.5) | V-F01 (min 25.000) | subtotal 20.000 | tidak eligible, `shortfall = 5000` → "Kurang Rp5.000 dari minimum belanja." |
| E-02 (inklusif) | V-F01 | subtotal 25.000 | eligible |
| E-03 | V-F02 (min 30.000) | R-02: M-202 + M-203 = 27.000 | tidak eligible, `shortfall = 3000` |
| E-04 | V-D01 (min 20.000) | R-02: M-201 = 15.000 | tidak eligible, `shortfall = 5000` |
| E-05 | V-D02 (min 15.000) | R-02: M-201 = 15.000 | eligible |
| E-06 | V-F03 | R-05: M-503 = 35.000 | tidak eligible, `shortfall = 5000` |
| E-07 | V-F03 | R-01 (restoran lain) | `RESTAURANT_MISMATCH` |

**E. Proyeksi dan status (`getBudgetStatus`).** `budget = 50000`.

| Pengeluaran | Nilai pesanan | Proyeksi | Status | Acuan |
|---:|---:|---:|---|---|
| 12.000 | 20.000 | 32.000 (64%) | OK | AC-04.5 |
| 12.000 | 28.500 | 40.500 (81%) | WARN | AC-04.3 |
| 12.000 | 47.000 | 59.000 (118%) | EXCEEDED | AC-04.4 |
| 0 | 50.000 | 50.000 (100%) | WARN | TS-01, AC-04.6 |
| 0 | 39.999 | 39.999 | OK | Batas bawah WARN |
| 0 | 40.000 | 40.000 (80%) | WARN | Batas bawah WARN |
| 0 | 50.001 | 50.001 | EXCEEDED | Batas EXCEEDED |

`TS-06`: dengan `budget = 100000` dan `spentToday = 12000`, keenam restoran berstatus OK.

**F. Estimasi dan discovery.**

| ID | Pemeriksaan | Hasil |
|---|---|---|
| D-01 | Estimasi enam restoran | 50.000, 26.500, 25.000, 28.500, 41.900, 35.000 |
| D-02 | `AC-02.4` `estimateMenuItemAllIn(R-01, M-104)` | 25.000 |
| D-03 | `AC-01.4` filter aktif, urut default | R-02, R-03, R-04, R-06 (R-01 dan R-05 tersembunyi) |
| D-04 | `AC-01.5` urut "Termurah (all-in)" tanpa filter | R-03, R-02, R-04, R-06, R-05, R-01 |
| D-05 | Filter aktif + urut termurah | R-03, R-02, R-04, R-06 |
| D-06 | `budget = null`, `budgetFilterOn = true` | Filter tidak berlaku, enam restoran, `evaluation = null` (`TS-08`) |
| D-07 | Kueri `"ayam"` | R-01, R-02, R-06 (nama atau kategori) |
| D-08 | Kueri `"  SATE "` | R-06 (pangkas spasi, tidak peka huruf besar-kecil) |

**G. Validasi budget (`validateBudgetInput`).**

| Input mentah | Hasil |
|---|---|
| `""`, `"   "` | `EMPTY` |
| `"50000"`, `" 50000 "`, `"00050000"` | `ok`, 50000 |
| `"10000"`, `"500000"` | `ok` (batas inklusif) |
| `"9999"`, `"0"`, `"000"` | `BELOW_MIN` |
| `"500001"`, `"99999999999999999999"` | `ABOVE_MAX` |
| `"50.000"`, `"50,5"`, `"5e4"`, `"-1"`, `"50 000"`, `"abc"`, `"５００００"` | `NOT_INTEGER` |

---

## Section 4: State Machine dan Tabel Transisi Atomik (Alur Interaksi Kritis)

### 4.1 Kontrak Reducer

**Prinsip transisi atomik.** Setiap action menghasilkan **satu** objek `AppState` baru. Tidak ada keadaan antara yang dapat dirender (misalnya keranjang sudah diganti tetapi voucher lama masih terpasang). Efek samping nonmurni (navigasi, fokus, persistensi, pembuatan ID dan waktu) dilakukan di luar reducer dan dicantumkan pada kolom **Efek Samping UI**.

```ts
import type {
  AddressId, MenuItemId, Rupiah, SortMode, VoucherId, VoucherSlot,
} from '../types/domain';
import type { AppRouteKey, OpenableOverlay } from '../types/state';

export type AppAction =
  // Budget dan discovery
  | { readonly type: 'BUDGET_SAVE'; readonly budget: Rupiah }
  | { readonly type: 'BUDGET_FILTER_SET'; readonly on: boolean }
  | { readonly type: 'SORT_SET'; readonly mode: SortMode }
  // Keranjang
  | { readonly type: 'ADD_ITEM_REQUESTED'; readonly menuItemId: MenuItemId }
  | { readonly type: 'ADD_ITEM_CONFIRM_REPLACE' }
  | { readonly type: 'ADD_ITEM_CANCEL_REPLACE' }
  | { readonly type: 'LINE_INCREMENT'; readonly menuItemId: MenuItemId }
  | { readonly type: 'LINE_DECREMENT'; readonly menuItemId: MenuItemId }
  | { readonly type: 'LINE_REMOVE'; readonly menuItemId: MenuItemId }
  | { readonly type: 'CART_CLEAR' }
  // Voucher
  | { readonly type: 'VOUCHER_APPLY'; readonly voucherId: VoucherId }
  | { readonly type: 'VOUCHER_REMOVE'; readonly slot: VoucherSlot }
  | { readonly type: 'NOTICE_DISMISS' }
  // Alamat dan perubahan harga
  | { readonly type: 'ADDRESS_SELECT'; readonly addressId: AddressId }
  | { readonly type: 'PRICE_CHANGE_ACK' }
  | { readonly type: 'PRICE_CHANGE_REVERT' }
  // Pembayaran dan guardrail
  | { readonly type: 'PAY_REQUESTED'; readonly expectedTotal: Rupiah; readonly receiptId: string; readonly paidAtIso: string }
  | { readonly type: 'EXCEEDED_CONTINUE'; readonly receiptId: string; readonly paidAtIso: string }
  | { readonly type: 'EXCEEDED_CHANGE_ORDER' }
  | { readonly type: 'EXCEEDED_SHOW_AFFORDABLE' }
  | { readonly type: 'EXCEEDED_DISMISS' }
  | { readonly type: 'RECEIPT_CLOSE' }
  // Overlay, menu, rute, reset
  | { readonly type: 'OVERLAY_OPEN'; readonly overlay: OpenableOverlay }
  | { readonly type: 'OVERLAY_DISMISS' }
  | { readonly type: 'OVERFLOW_SET'; readonly open: boolean }
  | { readonly type: 'ROUTE_CHANGED'; readonly from: AppRouteKey; readonly to: AppRouteKey }
  | { readonly type: 'RESET_REQUESTED' }
  | { readonly type: 'RESET_CONFIRM' };
```

**Pembantu reducer** (`src/state/reducer.ts`). Perubahan state selalu lewat `patch` sehingga tidak ada mutasi:

```ts
const NONE: OverlayState = { kind: 'NONE' };

function patch<T extends object>(base: T, changes: Partial<T>): T {
  return Object.assign({}, base, changes);
}

function clearCart(state: AppState): AppState {
  return patch(state, {
    cart: createEmptyCart(),
    addressId: DEFAULT_ADDRESS_ID,
    inlineNotice: null,
    lastPriceChange: null,
    pendingPriceChange: null,
    pendingAddItem: null,
  });
}

function buildRemovedNotice(removed: readonly Voucher[], seq: number): InlineNotice {
  return {
    seq,
    kind: 'VOUCHER_REMOVED',
    variant: 'warning',
    messages: removed.map(
      (v) => v.name + ' dilepas karena subtotal di bawah minimum ' + formatRupiah(v.minSubtotal) + '. Total dihitung ulang.',
    ),
  };
}

function buildReplacedNotice(oldVoucher: Voucher, newVoucher: Voucher, seq: number): InlineNotice {
  return {
    seq,
    kind: 'VOUCHER_REPLACED',
    variant: 'success',
    messages: [oldVoucher.name + ' diganti ' + newVoucher.name + '.'],
  };
}

/** Terapkan daftar baris baru: kosong = bersihkan cart, selain itu lepas voucher yang tidak lagi eligible. */
function applyLines(state: AppState, lines: readonly CartLine[]): AppState {
  if (lines.length === 0) return clearCart(state);
  const reconciled = reconcileVouchers(patch(state.cart, { lines }));
  if (reconciled.removed.length === 0) {
    return patch(state, { cart: reconciled.cart, inlineNotice: null });
  }
  const seq = state.noticeSeq + 1;
  return patch(state, {
    cart: reconciled.cart,
    inlineNotice: buildRemovedNotice(reconciled.removed, seq),
    noticeSeq: seq,
  });
}
```

**Selektor turunan** (tidak disimpan di state, dihitung dengan `useMemo` dari `cart`, `addressId`, `budget`, `spentToday`):

```ts
export interface CartView {
  readonly input: CalculateOrderInput | null;
  readonly breakdown: OrderBreakdown | null;
  readonly budgetEvaluation: BudgetEvaluation | null;
}

export function selectCartView(state: AppState): CartView {
  const input = resolveCart(state.cart, state.addressId);
  if (input === null) return { input: null, breakdown: null, budgetEvaluation: null };
  const breakdown = calculateOrder(input);
  return {
    input,
    breakdown,
    budgetEvaluation: evaluateBudget(state.budget, state.spentToday, breakdown.total),
  };
}
```

**Penjaga rute (route guard):**

| Rute | Kondisi | Perlakuan |
|---|---|---|
| `/checkout` | `cart.lines.length === 0` | `navigate("/keranjang", { replace: true })` |
| `/struk` | `lastReceipt === null` | `navigate("/", { replace: true })` (UX-SPEC 2.3, Alur 5) |
| `/restoran/:id` | `:id` bukan ID restoran yang ada | `navigate("/", { replace: true })` (NFR-10, tanpa galat yang menghentikan aplikasi) |
| `/keranjang` | Cart kosong | Tetap tampil dengan keadaan kosong (`AC-03.8`) |

**Aksi lintas-rute `ROUTE_CHANGED`** (dikirim oleh efek pada perubahan lokasi):

```ts
case 'ROUTE_CHANGED': {
  let next = state;
  if (next.overlay.kind !== 'NONE') {
    next = appReducer(next, { type: 'OVERLAY_DISMISS' });
  }
  if (action.from === 'CHECKOUT' && action.to !== 'CHECKOUT') {
    next = patch(next, { pendingPriceChange: null, lastPriceChange: null });
  }
  if (action.from === 'CART' && action.to !== 'CART') {
    next = patch(next, { inlineNotice: null });
  }
  if (action.from === 'RECEIPT' && action.to !== 'RECEIPT') {
    next = patch(next, { lastReceipt: null });
  }
  return patch(next, { overflowMenuOpen: false, pendingAddItem: null });
}
```

**Ketentuan `OVERLAY_DISMISS`** (`Escape`, tombol `X`, klik luar, atau tombol kembali peramban): perilakunya sama dengan aksi "tutup" tiap overlay menurut `UX-SPEC`:

```ts
case 'OVERLAY_OPEN': {
  if (state.overlay.kind !== 'NONE') return state;
  if ((action.overlay.kind === 'VOUCHER_PANEL' || action.overlay.kind === 'ADDRESS_PICKER') && state.cart.lines.length === 0) {
    return state;
  }
  return patch(state, { overlay: action.overlay, overflowMenuOpen: false });
}

case 'OVERFLOW_SET':
  if (action.open && state.overlay.kind !== 'NONE') return state;
  return patch(state, { overflowMenuOpen: action.open });

case 'OVERLAY_DISMISS':
  switch (state.overlay.kind) {
    case 'NONE':
      return state;
    case 'CONFIRM_REPLACE_CART':
      return appReducer(state, { type: 'ADD_ITEM_CANCEL_REPLACE' });
    case 'PRICE_CHANGE_NOTICE':
      return appReducer(state, { type: 'PRICE_CHANGE_ACK' });
    case 'BUDGET_EXCEEDED':
      return appReducer(state, { type: 'EXCEEDED_DISMISS' });
    default:
      return patch(state, { overlay: NONE });
  }
```

Ringkasnya:

| `overlay.kind` | Hasil `OVERLAY_DISMISS` | Acuan |
|---|---|---|
| `BUDGET_SETTINGS`, `INFO_SHEET`, `VOUCHER_PANEL`, `ADDRESS_PICKER`, `CONFIRM_RESET` | `overlay = NONE`, tidak ada perubahan lain | UX-SPEC 4.7, 4.10, 4.4.1, 4.5.1, 5.3 |
| `CONFIRM_REPLACE_CART` | Setara `ADD_ITEM_CANCEL_REPLACE` | UX-SPEC 4.8 |
| `PRICE_CHANGE_NOTICE` | Setara `PRICE_CHANGE_ACK` | UX-SPEC N-5 |
| `BUDGET_EXCEEDED` | Setara `EXCEEDED_DISMISS` (pembayaran tidak berjalan) | UX-SPEC E-4, AC-04.11 |

**Invarian global** (harus benar setelah setiap transisi, dan diuji dengan uji berbasis properti pada urutan action acak):

| ID | Invarian |
|---|---|
| I-1 | `cart.restaurantId === null` jika dan hanya jika `cart.lines.length === 0` |
| I-2 | Setiap voucher terpasang eligible terhadap subtotal dan restoran cart. Akibatnya `rejectedVouchers` pada hasil `calculateOrder` selalu kosong |
| I-3 | Semua `CartLine.menuItemId` milik `cart.restaurantId` (tidak ada pencampuran restoran) dan `qty` bilangan bulat `1..99` |
| I-4 | `cart.lines.length === 0` mengakibatkan `addressId === "ADDR-01"`, kedua voucher `null` |
| I-5 | Paling banyak satu overlay aktif. `overlay.kind === "BUDGET_EXCEEDED"` mengakibatkan `budget !== null` |
| I-6 | `pendingPriceChange !== null` jika dan hanya jika `overlay.kind === "PRICE_CHANGE_NOTICE"` |
| I-7 | `pendingAddItem !== null` jika dan hanya jika `overlay.kind === "CONFIRM_REPLACE_CART"` |
| I-8 | `budgetFilterOn === true` mengakibatkan `budget !== null` |
| I-9 | Setelah pembayaran: `lastReceipt.paidAmount === lastReceipt.checkoutTotal === lastReceipt.cartTotal` dan `delta === 0` |
| I-10 | `spentToday` hanya bertambah pada pembayaran, sebesar tepat `receipt.paidAmount` |

### 4.2 Alur 1: Penambahan Item dan Guardrail Keranjang Tunggal (`FR-03.7`, `AC-03.7`)

**Kode reducer:**

```ts
case 'ADD_ITEM_REQUESTED': {
  if (state.overlay.kind !== 'NONE') return state;
  const item = MENU_ITEMS[action.menuItemId];
  const cart = state.cart;
  if (cart.restaurantId === null || cart.lines.length === 0) {
    return patch(state, {
      cart: { restaurantId: item.restaurantId, lines: [{ menuItemId: item.id, qty: 1 }], foodVoucherId: null, deliveryVoucherId: null },
      addressId: DEFAULT_ADDRESS_ID,
      inlineNotice: null,
      lastPriceChange: null,
      pendingPriceChange: null,
    });
  }
  if (cart.restaurantId !== item.restaurantId) {
    return patch(state, {
      pendingAddItem: { menuItemId: item.id, restaurantId: item.restaurantId, fromRestaurantId: cart.restaurantId },
      overlay: { kind: 'CONFIRM_REPLACE_CART' },
    });
  }
  return applyLines(state, incrementOrAppend(cart.lines, item.id));
}

case 'ADD_ITEM_CONFIRM_REPLACE': {
  const pending = state.pendingAddItem;
  if (state.overlay.kind !== 'CONFIRM_REPLACE_CART' || pending === null) return state;
  return patch(state, {
    cart: { restaurantId: pending.restaurantId, lines: [{ menuItemId: pending.menuItemId, qty: 1 }], foodVoucherId: null, deliveryVoucherId: null },
    addressId: DEFAULT_ADDRESS_ID,
    pendingAddItem: null,
    pendingPriceChange: null,
    lastPriceChange: null,
    inlineNotice: null,
    overlay: NONE,
  });
}

case 'ADD_ITEM_CANCEL_REPLACE':
  if (state.overlay.kind !== 'CONFIRM_REPLACE_CART') return state;
  return patch(state, { pendingAddItem: null, overlay: NONE });

case 'LINE_INCREMENT':
  return applyLines(state, incrementOrAppend(state.cart.lines, action.menuItemId));

case 'LINE_DECREMENT': {
  const line = state.cart.lines.find((l) => l.menuItemId === action.menuItemId);
  if (line === undefined) return state;
  if (line.qty > 1) {
    return applyLines(state, state.cart.lines.map((l) =>
      l.menuItemId === action.menuItemId ? { menuItemId: l.menuItemId, qty: l.qty - 1 } : l));
  }
  return applyLines(state, state.cart.lines.filter((l) => l.menuItemId !== action.menuItemId));
}

case 'LINE_REMOVE':
  return applyLines(state, state.cart.lines.filter((l) => l.menuItemId !== action.menuItemId));

case 'CART_CLEAR':
  return clearCart(state);
```

```ts
function incrementOrAppend(lines: readonly CartLine[], menuItemId: MenuItemId): readonly CartLine[] {
  const exists = lines.some((l) => l.menuItemId === menuItemId);
  if (!exists) return lines.concat([{ menuItemId, qty: 1 }]);
  return lines.map((l) =>
    l.menuItemId === menuItemId ? { menuItemId: l.menuItemId, qty: Math.min(QTY_MAX, l.qty + 1) } : l);
}
```

**Tabel transisi:**

| ID | State Awal | Pemicu | Guard / Kondisi | State Akhir (atomik, satu transisi) | Efek Samping UI |
|---|---|---|---|---|---|
| T1-A | `cart.lines.length === 0`, `overlay = NONE` | `ADD_ITEM_REQUESTED { menuItemId }` pada tombol "Tambah" | `cart.lines.length === 0` (**Kasus A: Keranjang Kosong**) | `cart.restaurantId = item.restaurantId`; `cart.lines = [{ menuItemId, qty: 1 }]`; kedua voucher `null`; `addressId = "ADDR-01"`; `inlineNotice`, `lastPriceChange`, `pendingPriceChange` = `null` | **Tidak** membuka `ConfirmDialog`. Tombol "Tambah" berganti stepper `[–] 1 [+]` dan fokus dipindahkan ke `[+]` item yang sama (kunci fokus `add-item:{id}`). Bar keranjang muncul. Badge Cart header menjadi 1 |
| T1-B1 | `cart.lines.length > 0`, `cart.restaurantId === target`, baris item **sudah ada** | `ADD_ITEM_REQUESTED` atau `LINE_INCREMENT` | `cart.restaurantId === item.restaurantId` dan `qty < 99` (**Kasus B: Restoran Sama**) | `qty = qty + 1` pada baris tersebut; `reconcileVouchers` tidak melepas apa pun (subtotal naik); `inlineNotice = null` | Nilai stepper berubah dan dibacakan (`aria-live="polite"`). Subtotal bar keranjang diperbarui |
| T1-B2 | Sama dengan T1-B1, baris item **belum ada** | `ADD_ITEM_REQUESTED` | `cart.restaurantId === item.restaurantId` | Baris baru `{ menuItemId, qty: 1 }` ditambahkan di akhir `lines` | Tombol "Tambah" menjadi stepper. Fokus ke `[+]` |
| T1-B3 | Baris sudah `qty === 99` | `LINE_INCREMENT` | `qty === 99` | **Tidak berubah** (batas `QTY_MAX`) | Tombol `[+]` memakai `aria-disabled="true"` (tetap dapat difokus, tidak `disabled` agar fokus tidak hilang) dan klik tidak berefek |
| T1-C | `cart.lines.length > 0`, `cart.restaurantId !== target` | `ADD_ITEM_REQUESTED` | `cart.lines.length > 0` dan `cart.restaurantId !== item.restaurantId` (**Kasus C: Restoran Berbeda**) | `pendingAddItem = { menuItemId, restaurantId: target, fromRestaurantId }`; `overlay = CONFIRM_REPLACE_CART`. **Cart tidak berubah** | `ConfirmDialog` "Ganti keranjang?" terbuka: "Keranjangmu berisi item dari {Restoran A}. Menambah item dari {Restoran B} akan mengosongkan keranjang yang lama." Fokus awal `[Tetap di keranjang lama]`. Latar `inert`, scroll terkunci |
| T1-C1 | `overlay = CONFIRM_REPLACE_CART`, `pendingAddItem !== null` | `ADD_ITEM_CONFIRM_REPLACE` (tombol "Ganti keranjang") | `overlay.kind === CONFIRM_REPLACE_CART` dan `pendingAddItem !== null` | **Satu transisi:** `lines` lama dikosongkan; `foodVoucherId = null`; `deliveryVoucherId = null`; `addressId = "ADDR-01"`; `restaurantId = pending.restaurantId`; `lines = [{ pending.menuItemId, qty: 1 }]`; `pendingAddItem = null`; `pendingPriceChange`, `lastPriceChange`, `inlineNotice` = `null`; `overlay = NONE` | Dialog menutup. Pada Menu restoran baru, item tampil sebagai stepper `1`. Bar keranjang memuat "1 item · Subtotal item Rp{n}". Fokus kembali ke kontrol item pemicu (stepper `[+]` pada kunci fokus yang sama) |
| T1-C2 | `overlay = CONFIRM_REPLACE_CART` | `ADD_ITEM_CANCEL_REPLACE` (tombol "Tetap di keranjang lama", `X`, `Escape`, klik luar) | `overlay.kind === CONFIRM_REPLACE_CART` | `pendingAddItem = null`; `overlay = NONE`. **Seluruh cart, voucher, dan alamat tidak berubah** | Dialog menutup. Fokus kembali ke tombol "Tambah" pemicu |
| T1-C3 | Tidak ada dialog terbuka (guard anti-gema) | `ADD_ITEM_CONFIRM_REPLACE` | `pendingAddItem === null` atau `overlay.kind !== CONFIRM_REPLACE_CART` | **Tidak berubah** (mencegah klik ganda mengganti dua kali) | Tidak ada |
| T1-D1 | Baris `qty > 1` | `LINE_DECREMENT` (`[–]`) | `qty > 1` | `qty − 1`. Lalu `reconcileVouchers` (lihat Alur 2) | Stepper turun. Total dihitung ulang |
| T1-D2 | Baris `qty === 1`, masih ada baris lain | `LINE_DECREMENT` (`[–]`, ikon berubah menjadi tempat sampah) atau `LINE_REMOVE` (tombol "Hapus") | Baris ada | Baris dihapus dari `lines`. `reconcileVouchers` | Baris hilang dari Cart. Fokus dipindahkan ke baris berikutnya (atau sebelumnya jika terakhir) |
| T1-D3 | Cart berisi tepat satu baris, `qty === 1` | `LINE_DECREMENT` atau `LINE_REMOVE` | Baris tersebut satu-satunya | **Kasus D:** `restaurantId = null`; `lines = []`; `foodVoucherId = null`; `deliveryVoucherId = null`; `addressId = "ADDR-01"`; `inlineNotice`, `lastPriceChange`, `pendingPriceChange`, `pendingAddItem` = `null` | Cart menampilkan keadaan kosong "Keranjangmu kosong." dengan `[Lihat restoran]`. Tombol "Lanjut ke Checkout" nonaktif. Fokus ke judul `EmptyState` (`tabindex="-1"`). Badge Cart header hilang |
| T1-D4 | Cart berisi satu baris atau lebih | `CART_CLEAR` (tombol "Kosongkan") | `cart.lines.length > 0` | Sama dengan T1-D3 (reset penuh `restaurantId`, `lines`, kedua voucher, `addressId`) | Sama dengan T1-D3. Aksi langsung tanpa dialog (UX-SPEC tidak mendefinisikan konfirmasi) |

### 4.3 Alur 2: Evaluasi, Penggantian, dan Pelepasan Otomatis Voucher (`FR-03.3` sampai `FR-03.6`, UX-SPEC 3.5, C-5, C-6)

**Kode reducer:**

```ts
case 'VOUCHER_APPLY': {
  const input = resolveCart(state.cart, state.addressId);
  if (input === null) return state;
  const voucher = VOUCHERS[action.voucherId];
  const subtotal = computeCartSubtotal(state.cart.lines);
  if (!evaluateVoucher(voucher, { restaurantId: input.restaurant.id, subtotal }).eligible) return state;

  const currentId = voucher.slot === 'FOOD' ? state.cart.foodVoucherId : state.cart.deliveryVoucherId;
  if (currentId === voucher.id) return patch(state, { overlay: NONE });

  const replaced = currentId === null ? null : VOUCHERS[currentId];
  const cart = voucher.slot === 'FOOD'
    ? patch(state.cart, { foodVoucherId: voucher.id })
    : patch(state.cart, { deliveryVoucherId: voucher.id });
  if (replaced === null) return patch(state, { cart, inlineNotice: null, overlay: NONE });
  const seq = state.noticeSeq + 1;
  return patch(state, { cart, inlineNotice: buildReplacedNotice(replaced, voucher, seq), noticeSeq: seq, overlay: NONE });
}

case 'VOUCHER_REMOVE': {
  const cart = action.slot === 'FOOD'
    ? patch(state.cart, { foodVoucherId: null })
    : patch(state.cart, { deliveryVoucherId: null });
  return patch(state, { cart, inlineNotice: null });
}

case 'NOTICE_DISMISS':
  return patch(state, { inlineNotice: null });
```

**Tabel transisi:**

| ID | State Awal | Pemicu | Guard / Kondisi | State Akhir (atomik) | Efek Samping UI |
|---|---|---|---|---|---|
| T2-A | Cart tidak kosong, slot voucher kosong, `overlay = VOUCHER_PANEL` | `VOUCHER_APPLY { voucherId }` (tombol "Terapkan") | Voucher eligible (`evaluateVoucher`) | Slot sesuai `voucher.slot` terisi `voucherId`; `inlineNotice = null`; `overlay = NONE` | Panel menutup. Slot menampilkan nama dan "−Rp{n}". Rincian, total, Budget Tracker diperbarui tanpa reload (`AC-03.2`, `AC-03.3`). Contoh: Cart `AC-03.1` + `V-F01` → total Rp55.000 |
| T2-B | Slot makanan terisi `V-F01` | `VOUCHER_APPLY { "V-F02" }` | `V-F02` eligible | `foodVoucherId = "V-F02"` (voucher lama **diganti**, tidak pernah ada dua voucher makanan, `AC-03.4`); `inlineNotice = { kind: VOUCHER_REPLACED, variant: "success", messages: ["Hemat Makan diganti Diskon 20% Makan."] }`; `overlay = NONE` | Banner inline (`role="status"`) di bawah slot. Total dihitung ulang |
| T2-C | Slot terisi voucher X | `VOUCHER_APPLY { X }` (voucher sama) | `currentId === voucherId` | Tidak ada perubahan selain `overlay = NONE` | Panel menutup, tanpa pemberitahuan |
| T2-D | Voucher tidak eligible tampil di panel | Pengguna mencoba memilih | Voucher tidak eligible | Tidak dapat dipilih (tidak memiliki `input`, `aria-disabled="true"`). Jika action tetap dikirim, reducer **tidak berubah** | Alasan tampil: "Kurang Rp{n} dari minimum belanja." (`AC-03.5`). `[Terapkan]` `aria-disabled` bila tidak ada pilihan |
| T2-E | Slot terisi | `VOUCHER_REMOVE { slot }` (tombol "Lepas") | Slot terisi | Slot menjadi `null`; `inlineNotice = null` | Slot kembali "Pilih voucher". Total dihitung ulang. Fokus ke tombol "Pilih voucher" slot yang sama |
| T2-F | Cart R-02 (subtotal 25.000) dengan `V-F01` dan `V-D02` terpasang (`TS-03`) | `LINE_DECREMENT` / `LINE_REMOVE` yang menurunkan subtotal ke 20.000 (`TS-04`, `AC-03.6`) | `subtotal < minSubtotal` untuk `V-F01` (25.000), `V-D02` masih eligible (min 15.000) | **Satu transisi:** baris berubah, `foodVoucherId = null`, `deliveryVoucherId = "V-D02"` tetap; `inlineNotice = { kind: VOUCHER_REMOVED, variant: "warning", messages: ["Hemat Makan dilepas karena subtotal di bawah minimum Rp25.000. Total dihitung ulang."] }` | Banner inline `role="status"` diumumkan. Total langsung Rp27.500. Budget Tracker: proyeksi Rp39.500, OK |
| T2-G | Dua voucher terpasang, keduanya jatuh di bawah minimum sekaligus (misalnya subtotal turun di bawah 20.000 dengan `V-F01` dan `V-D01`) | Pengurangan qty atau hapus baris | `subtotal < min` untuk keduanya | Kedua slot `null`. `messages` memuat dua baris: voucher makanan dahulu, lalu voucher ongkir | Satu banner berisi dua paragraf. Satu kali pengumuman |
| T2-H | Cart dengan voucher terpasang | `LINE_INCREMENT` / tambah item | Subtotal naik | Voucher **tidak** dilepas dan **tidak** ada voucher baru dipasang otomatis | Total dihitung ulang |
| T2-I | `inlineNotice !== null` | Aksi cart berikutnya yang tidak menghasilkan pemberitahuan baru, atau `ROUTE_CHANGED` keluar dari `CART`, atau `NOTICE_DISMISS` | Salah satunya | `inlineNotice = null` | Banner hilang |

### 4.4 Alur 3: Simulasi Perubahan Alamat di Checkout (`BR-05`, `FR-04.6`, UX-SPEC 3.4, 4.5.1 dan 4.5.2)

**Pembangun pemberitahuan** (`src/lib/priceChange.ts`, murni):

```ts
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
```

Invarian N-2: jumlah `totalEffect` semua `lines` sama dengan `totalDelta`. Contoh `A-08` ke `A-09`: `+3.000` (ongkir) + `−1.000` (diskon ongkir) = `+2.000`.

**Kode reducer:**

```ts
case 'ADDRESS_SELECT': {
  if (state.overlay.kind !== 'ADDRESS_PICKER') return state;
  if (action.addressId === state.addressId) return patch(state, { overlay: NONE });
  const before = resolveCart(state.cart, state.addressId);
  const after = resolveCart(state.cart, action.addressId);
  if (before === null || after === null) return state;
  const change = buildPendingPriceChange({
    previousAddressId: state.addressId,
    nextAddressId: action.addressId,
    before: calculateOrder(before),
    after: calculateOrder(after),
    budget: state.budget,
    spentToday: state.spentToday,
  });
  return patch(state, {
    addressId: action.addressId,
    pendingPriceChange: change,
    overlay: { kind: 'PRICE_CHANGE_NOTICE' },
  });
}

case 'PRICE_CHANGE_ACK': {
  const pending = state.pendingPriceChange;
  if (state.overlay.kind !== 'PRICE_CHANGE_NOTICE' || pending === null) return state;
  return patch(state, {
    lastPriceChange: {
      previousTotal: pending.previousTotal,
      nextTotal: pending.nextTotal,
      causeText: 'alamat diganti ke ' + ADDRESSES[pending.nextAddressId].label,
    },
    pendingPriceChange: null,
    overlay: NONE,
  });
}

case 'PRICE_CHANGE_REVERT': {
  const pending = state.pendingPriceChange;
  if (state.overlay.kind !== 'PRICE_CHANGE_NOTICE' || pending === null) return state;
  return patch(state, { addressId: pending.previousAddressId, pendingPriceChange: null, overlay: NONE });
}
```

**Tabel transisi:**

| ID | State Awal | Pemicu | Guard / Kondisi | State Akhir (atomik) | Efek Samping UI |
|---|---|---|---|---|---|
| T3-A | Route `/checkout`, cart tidak kosong, `overlay = NONE` | `OVERLAY_OPEN { ADDRESS_PICKER }` (tombol "Ubah alamat") | `overlay.kind === NONE`, cart tidak kosong | `overlay = ADDRESS_PICKER` | Sheet "Pilih alamat pengiriman" terbuka. Fokus awal pada opsi alamat aktif. Setiap opsi menampilkan "Selisih ongkir: +Rp0 / +Rp3.000 / +Rp5.000" |
| T3-B | `overlay = ADDRESS_PICKER` | `ADDRESS_SELECT { addressId }` dengan alamat **sama** dengan `state.addressId` | `action.addressId === state.addressId` | `overlay = NONE`. **Tidak ada perubahan lain** | Sheet menutup tanpa pemberitahuan (UX-SPEC A-3). Fokus kembali ke "Ubah alamat" |
| T3-C | `overlay = ADDRESS_PICKER`, `pendingPriceChange = null` | `ADDRESS_SELECT { addressId }` dengan alamat **berbeda** (tombol "Pakai alamat ini") | `action.addressId !== state.addressId`; `before` dan `after` dapat di-resolve | **Satu transisi:** `addressId = next`; `pendingPriceChange` diisi (`previousTotal`, `nextTotal`, `lines`, `statusBefore`/`statusAfter`, `projectionAfter`); `overlay = PRICE_CHANGE_NOTICE`. `calculateOrder` yang sama menghitung `before` dan `after` (BR-02, BR-05). `lastPriceChange` lama tidak diubah | Sheet alamat digantikan dialog "Total pesananmu berubah" (fokus awal `[Mengerti]`). Cart dan Checkout (rincian, total, tracker) **sudah memuat angka baru** di balik dialog dan total diumumkan lewat `aria-live`. Tombol "Bayar Rp{total}" tidak dapat dipakai selama dialog terbuka (latar `inert`, UX-SPEC K-6). Dialog memuat Sebelum, Sesudah, Selisih, Penyebab: "Alamat diganti ke {Label alamat baru}", "Ongkos kirim: Rp{a} → Rp{b} (+Rp{c})", dan jika voucher ongkir terpasang: "Diskon voucher ongkir: tidak berubah" atau "−Rp{x} → −Rp{y} (−Rp{z})" |
| T3-C-S | Seperti T3-C | (bagian dari T3-C) | `statusBefore !== statusAfter` dan keduanya tidak `null` | Sama dengan T3-C | Blok status ditambahkan: "Berubah dari {label lama} menjadi {label baru} ({persen})." (UX-SPEC N-3), memakai `NoticeBanner variant="status"`. Persen: `formatPercent(projectionAfter, budget)` (contoh `R-03`, ADDR-01 ke ADDR-02: "Berubah dari Sesuai budget menjadi Mepet budget (80%).") |
| T3-D | `overlay = PRICE_CHANGE_NOTICE` | `PRICE_CHANGE_ACK` (tombol "Mengerti"; juga `X`, `Escape`, klik luar sesuai N-5) | `pendingPriceChange !== null` | `lastPriceChange = { previousTotal, nextTotal, causeText: "alamat diganti ke {Label alamat}" }`; `pendingPriceChange = null`; `overlay = NONE`. Alamat baru kini dipersistensi (lihat 2.4.1) | Dialog menutup. Blok "Perubahan terakhir": "Total berubah dari Rp{a} menjadi Rp{b} karena alamat diganti ke {Label}." Tombol bayar aktif. Fokus kembali ke "Ubah alamat" |
| T3-E | `overlay = PRICE_CHANGE_NOTICE` | `PRICE_CHANGE_REVERT` (tombol "Kembalikan alamat sebelumnya") | `pendingPriceChange !== null` | `addressId = previousAddressId`; `pendingPriceChange = null`; `overlay = NONE`. `lastPriceChange` **tidak** berubah | Dialog menutup tanpa pemberitahuan tambahan (UX-SPEC N-4). Total kembali ke angka sebelumnya di Cart dan Checkout. Tombol bayar aktif. Fokus ke "Ubah alamat" |
| T3-F | `overlay = PRICE_CHANGE_NOTICE` | `PAY_REQUESTED` | `overlay.kind !== NONE` atau `pendingPriceChange !== null` | **Tidak berubah** | Tidak ada. Pembayaran hanya dapat dilanjutkan setelah pemberitahuan ditampilkan dan ditutup (BR-05) |
| T3-G | `lastPriceChange !== null` | `ADDRESS_SELECT` berbeda lagi | Seperti T3-C | `pendingPriceChange` baru. `lastPriceChange` diganti saat `PRICE_CHANGE_ACK` | Blok "Perubahan terakhir" diperbarui setelah konfirmasi (K-7) |
| T3-H | `lastPriceChange` atau `pendingPriceChange` ada | `ROUTE_CHANGED` keluar dari `CHECKOUT` | `from === CHECKOUT` | Keduanya `null` (setelah `PRICE_CHANGE_ACK` implisit bila dialog masih terbuka) | Blok "Perubahan terakhir" hilang |

### 4.5 Alur 4: Dialog Guardrail Budget Proaktif (`EXCEEDED`, `FR-04.4`, `FR-04.5`, UX-SPEC 3.3 dan 4.9)

**Kode reducer:**

```ts
case 'PAY_REQUESTED': {
  if (state.overlay.kind !== 'NONE' || state.pendingPriceChange !== null) return state;
  const input = resolveCart(state.cart, state.addressId);
  if (input === null) return state;
  const breakdown = calculateOrder(input);
  if (breakdown.total !== action.expectedTotal) return state;
  const evaluation = evaluateBudget(state.budget, state.spentToday, breakdown.total);
  if (state.budget !== null && evaluation !== null && evaluation.projection > state.budget) {
    return patch(state, {
      overlay: {
        kind: 'BUDGET_EXCEEDED',
        snapshot: {
          budget: state.budget,
          spentToday: state.spentToday,
          expectedTotal: breakdown.total,
          projection: evaluation.projection,
          exceededBy: evaluation.exceededBy,
        },
      },
    });
  }
  return executePayment(state, { expectedTotal: breakdown.total, receiptId: action.receiptId, paidAtIso: action.paidAtIso });
}

case 'EXCEEDED_CONTINUE': {
  if (state.overlay.kind !== 'BUDGET_EXCEEDED') return state;
  return executePayment(state, {
    expectedTotal: state.overlay.snapshot.expectedTotal,
    receiptId: action.receiptId,
    paidAtIso: action.paidAtIso,
  });
}

case 'EXCEEDED_CHANGE_ORDER':
case 'EXCEEDED_DISMISS':
  if (state.overlay.kind !== 'BUDGET_EXCEEDED') return state;
  return patch(state, { overlay: NONE });

case 'EXCEEDED_SHOW_AFFORDABLE':
  if (state.overlay.kind !== 'BUDGET_EXCEEDED') return state;
  return patch(state, { overlay: NONE, budgetFilterOn: state.budget !== null });
```

**Tabel transisi:**

| ID | State Awal | Pemicu | Guard / Kondisi | State Akhir (atomik) | Efek Samping UI |
|---|---|---|---|---|---|
| T4-A | Route `/checkout`, `overlay = NONE`, `pendingPriceChange = null`, tracker status EXCEEDED | `PAY_REQUESTED { expectedTotal, receiptId, paidAtIso }` (tombol "Bayar Rp{total}") | Cart tidak kosong; `breakdown.total === expectedTotal` (hasil `calculateOrder`); `budget !== null && projection > budget` | `overlay = BUDGET_EXCEEDED` dengan `snapshot` (budget, spentToday, expectedTotal, projection, exceededBy). **Tidak ada pembayaran, state lain tidak berubah** | `BudgetExceededDialog` (`role="alertdialog"`) muncul **sebelum** pembayaran: judul "Pesanan ini melebihi budget harianmu", rincian Budget harian, Pengeluaran hari ini, Pesanan ini, Proyeksi, "Melebihi budget Rp{n}". Tiga tombol bertumpuk: "Ubah pesanan", "Lihat yang sesuai budget", "Lanjutkan tetap". Fokus awal `[Ubah pesanan]`. Angka sama persis dengan Budget Tracker (E-6). Contoh Contoh B: Rp12.000 + Rp47.000 = Rp59.000 (118%), melebihi Rp9.000 |
| T4-B | `overlay = BUDGET_EXCEEDED` | `EXCEEDED_CHANGE_ORDER` (tombol "Ubah pesanan") | `overlay.kind === BUDGET_EXCEEDED` | `overlay = NONE`. Cart, voucher, alamat tidak berubah | Navigasi `navigate("/keranjang")` (UX-SPEC E-5, `AC-04.8`). Tanpa pembayaran. Fokus ke `main#konten` Cart |
| T4-C | `overlay = BUDGET_EXCEEDED` | `EXCEEDED_SHOW_AFFORDABLE` (tombol "Lihat yang sesuai budget") | `overlay.kind === BUDGET_EXCEEDED` | `overlay = NONE`; `budgetFilterOn = true` (budget pasti tidak `null`, invarian I-5). **Cart dipertahankan** (NFR-05) | Navigasi `navigate("/")` (UX-SPEC E-5, `AC-04.9`). Home menampilkan filter "Sesuai Budget Saya" aktif dengan R-02, R-03, R-04, R-06 (profil default) |
| T4-D | `overlay = BUDGET_EXCEEDED` | `EXCEEDED_CONTINUE { receiptId, paidAtIso }` (tombol "Lanjutkan tetap") | `overlay.kind === BUDGET_EXCEEDED` dan `executePayment` lolos guard (Alur 5) | Seluruh transisi pembayaran Alur 5, dengan `overlay = NONE` | Pembayaran simulasi dilanjutkan, lalu `/struk` mencatat jumlah melebihi budget (`AC-04.10`) |
| T4-E | `overlay = BUDGET_EXCEEDED` | `EXCEEDED_DISMISS` (`X`, `Escape`, klik luar, atau tombol kembali peramban) | `overlay.kind === BUDGET_EXCEEDED` | `overlay = NONE`. **Tidak ada pembayaran, tidak ada perubahan lain** (`FR-04.5`, `AC-04.11`) | Fokus kembali ke tombol "Bayar Rp{total}". Tetap di `/checkout` |
| T4-F | Status OK atau WARN (termasuk proyeksi tepat 100%) | `PAY_REQUESTED` | `projection ≤ budget` | Langsung `executePayment` (Alur 5). Dialog **tidak** muncul (E-7, `AC-04.6`) | Berlanjut ke `/struk` |
| T4-G | `budget === null` | `PAY_REQUESTED` | `budget === null` | Langsung `executePayment` (tidak ada guardrail tanpa budget) | Berlanjut ke `/struk` |

### 4.6 Alur 5: Eksekusi Pembayaran Simulasi dan Invarian Zero-Delta (`BR-02`, `BR-03`, `FR-04.1`, `FR-04.8`)

**Kode eksekusi:**

```ts
interface PayParams {
  readonly expectedTotal: Rupiah;
  readonly receiptId: string;
  readonly paidAtIso: string;
}

function buildReceipt(state: AppState, input: CalculateOrderInput, breakdown: OrderBreakdown, p: PayParams): Receipt {
  const spentAfter = state.spentToday + breakdown.total;
  const budget = state.budget;
  return {
    id: p.receiptId,
    paidAtIso: p.paidAtIso,
    restaurantId: input.restaurant.id,
    restaurantName: input.restaurant.name,
    addressId: input.address.id,
    addressLabel: input.address.label,
    lines: input.lines.map((line) => ({
      menuItemId: line.item.id,
      name: line.item.name,
      qty: line.qty,
      unitNetPrice: getNetPrice(line.item),
      lineSubtotal: getNetPrice(line.item) * line.qty,
    })),
    breakdown,
    cartTotal: breakdown.total,
    checkoutTotal: p.expectedTotal,
    paidAmount: breakdown.total,
    delta: 0,
    budgetSnapshot: {
      budget,
      spentBefore: state.spentToday,
      spentAfter,
      remainingBudget: budget === null ? null : Math.max(0, budget - spentAfter),
      exceededBy: budget === null ? 0 : Math.max(0, spentAfter - budget),
    },
  };
}

function executePayment(state: AppState, p: PayParams): AppState {
  if (state.lastReceipt !== null && state.lastReceipt.id === p.receiptId) return state;
  const input = resolveCart(state.cart, state.addressId);
  if (input === null) return state;
  const breakdown = calculateOrder(input);
  if (breakdown.rejectedVouchers.length > 0 || breakdown.total !== p.expectedTotal) return state;

  const receipt = buildReceipt(state, input, breakdown, p);
  return patch(state, {
    spentToday: state.spentToday + breakdown.total,
    cart: createEmptyCart(),
    addressId: DEFAULT_ADDRESS_ID,
    lastReceipt: receipt,
    pendingAddItem: null,
    pendingPriceChange: null,
    lastPriceChange: null,
    inlineNotice: null,
    overlay: NONE,
  });
}

case 'RECEIPT_CLOSE':
  return patch(state, { lastReceipt: null });
```

**Tabel transisi:**

| ID | State Awal | Pemicu | Guard / Kondisi | State Akhir (atomik) | Efek Samping UI |
|---|---|---|---|---|---|
| T5-A | `/checkout`, cart tidak kosong, total `T`, `overlay = NONE`, `pendingPriceChange = null`, status OK/WARN atau `budget = null` | `PAY_REQUESTED { expectedTotal: T, receiptId, paidAtIso }` | **Anti-double-submit** (lapis 1: idempotensi) `lastReceipt?.id !== receiptId`; (lapis 2) `cart.lines.length > 0`; (lapis 3) `overlay.kind === NONE`; **Zero-Delta:** `breakdown.total === expectedTotal` (hasil `calculateOrder`) dan `rejectedVouchers` kosong | **Satu transisi:** `Receipt` dibangun **langsung dari hasil `calculateOrder`** (`cartTotal = checkoutTotal = paidAmount = T`, `delta = 0`); `spentToday = spentToday + T`; `cart = createEmptyCart()` (kedua voucher `null`); `addressId = "ADDR-01"`; `lastReceipt = receipt`; `pendingAddItem`, `pendingPriceChange`, `lastPriceChange`, `inlineNotice` = `null`; `overlay = NONE` | Efek pada halaman Checkout memantau `lastReceipt !== null` lalu `navigate("/struk", { replace: true })` (replace agar tombol kembali tidak membuka Checkout dengan keranjang kosong). Header memperbarui sisa budget otomatis |
| T5-B | Klik ganda cepat pada tombol bayar | `PAY_REQUESTED` kedua | Cart sudah kosong (`resolveCart === null`) atau `receiptId` sama dengan `lastReceipt.id` | **Tidak berubah** | Tidak ada. Pembayaran hanya terjadi sekali |
| T5-C | Total yang ditampilkan `T` berbeda dengan hasil hitung ulang | `PAY_REQUESTED` | `breakdown.total !== expectedTotal` | **Tidak berubah** (pembayaran ditolak, harga tidak boleh berubah diam-diam, BR-05) | Pada mode pengembangan, `console.error("ZERO_DELTA_MISMATCH")`. Pada kondisi normal kasus ini tidak terjadi karena Cart dan Checkout memakai `calculateOrder` yang sama |
| T5-D | `overlay = BUDGET_EXCEEDED` | `EXCEEDED_CONTINUE` | Guard T5-A | Sama dengan T5-A. `Receipt.budgetSnapshot.exceededBy > 0` | `/struk` menampilkan "Pesanan ini melebihi budget Rp{n}." (UX-SPEC 4.6, `AC-04.10`) |
| T5-E | `route = /struk`, `lastReceipt !== null` | Render `/struk` | Penjaga rute lolos | Tidak ada perubahan state | Struk menampilkan rincian identik dengan Cart (`PriceBreakdown readOnly`), "Selisih dari Keranjang: Rp0", Budget harian, Pengeluaran hari ini (diperbarui), Sisa budget (`max(0, budget − spentAfter)`), dan baris melebihi budget bila ada. Contoh `AC-04.12`: Rp12.000 + Rp28.500 = Rp40.500, sisa Rp9.500 |
| T5-F | `route = /struk`, `lastReceipt === null` (misalnya refresh) | Render `/struk` | `lastReceipt === null` | Tidak ada | `navigate("/", { replace: true })` |
| T5-G | `route = /struk` | `RECEIPT_CLOSE` (tombol "Kembali ke Home") atau `ROUTE_CHANGED` keluar dari `RECEIPT` | Selalu | `lastReceipt = null` | `navigate("/")`. Struk tidak dapat dibuka kembali |
| T5-H | Pembayaran berhasil pada budget tersisa nol atau terlampaui | Header dihitung ulang | `spentToday > budget` | (turunan) | Header: "Budget terlampaui Rp{n}". `spentToday === budget` menampilkan "Sisa budget: Rp0" |

**Pembuatan ID dan waktu (di luar reducer):**

```ts
// src/lib/receiptId.ts
let fallbackCounter = 0;
export function createReceiptId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return 'RCPT-' + crypto.randomUUID();
  }
  fallbackCounter += 1;
  return 'RCPT-' + Date.now().toString(36) + '-' + fallbackCounter.toString(36);
}
```

`CheckoutPage` membuat satu `receiptId` per kunjungan (`useRef(createReceiptId())`). Klik ganda memakai `receiptId` yang sama sehingga idempotensi lapis 1 menolak transisi kedua. `paidAtIso` dibuat dengan `new Date().toISOString()` di handler klik.

### 4.7 Alur 6: Validasi dan Simpan Pengaturan Budget (`FR-01.1`, `FR-01.6`, UX-SPEC 4.7 dan 5.3)

Input mentah (`string`) disimpan sebagai state lokal komponen. Validasi memakai `validateBudgetInput` (Bagian 3.6) dan dijalankan **saat Simpan** (UX-SPEC 4.7).

**Aturan validasi string mentah, berurutan:**

| Urutan | Pemeriksaan | Kode galat | Pesan (persis UX-SPEC 5.3) |
|---|---|---|---|
| 1 | `raw.trim().length === 0` (kosong atau spasi saja) | `EMPTY` | Isi budget harian dulu. Contoh: 50000. |
| 2 | `trim()` tidak cocok `/^[0-9]+$/` (titik atau koma desimal, `e`, tanda minus, spasi di tengah, huruf, simbol, digit non-ASCII) | `NOT_INTEGER` | Budget harus bilangan bulat tanpa desimal. |
| 3 | Setelah membuang nol di depan, panjang digit `> 6` (terlalu besar, tanpa mengonversi ke angka tidak aman) | `ABOVE_MAX` | Budget maksimal Rp500.000. |
| 4 | Nilai `< 10000` (termasuk `0`) | `BELOW_MIN` | Budget minimal Rp10.000. |
| 5 | Nilai `> 500000` | `ABOVE_MAX` | Budget maksimal Rp500.000. |
| 6 | Lolos | (valid) | Disimpan |

**Kode reducer:**

```ts
case 'BUDGET_SAVE': {
  if (state.overlay.kind !== 'BUDGET_SETTINGS') return state;
  if (!Number.isInteger(action.budget) || action.budget < BUDGET_MIN || action.budget > BUDGET_MAX) return state;
  return patch(state, { budget: action.budget, overlay: NONE });
}
case 'BUDGET_FILTER_SET':
  if (action.on && state.budget === null) return state;
  return patch(state, { budgetFilterOn: action.on });
case 'SORT_SET':
  return patch(state, { sortMode: action.mode });
```

**Tabel transisi:**

| ID | State Awal | Pemicu | Guard / Kondisi | State Akhir (atomik) | Efek Samping UI |
|---|---|---|---|---|---|
| T6-A | `overlay = NONE` | `OVERLAY_OPEN { BUDGET_SETTINGS }` (tombol sisa budget di header, atau "Atur budget" pada banner atau `EmptyState`) | `overlay.kind === NONE` | `overlay = BUDGET_SETTINGS` | Sheet "Budget makan harian" terbuka. Menampilkan "Budget saat ini: {Rp atau belum diatur}", "Pengeluaran hari ini: Rp{n}". Fokus awal pada kolom input |
| T6-B | `overlay = BUDGET_SETTINGS` | Tombol "Simpan" atau `Enter` pada kolom input | `validateBudgetInput(raw).ok === false` | **State global tidak berubah** (`budget` lama tetap, `overlay` tetap) | Pesan galat tampil di bawah kolom (`role="alert"`, ikon `CircleAlert`, `aria-invalid="true"`, `aria-describedby` menuju bantuan dan galat). Tepi kolom `border-rose-700`. Fokus dikembalikan ke kolom input. Pesan dihapus saat pengguna mengetik lagi |
| T6-C | `overlay = BUDGET_SETTINGS` | Tombol "Simpan" atau `Enter` | `validateBudgetInput(raw).ok === true` | `BUDGET_SAVE { budget: value }`: `budget = value`; `overlay = NONE`. Persistensi menyimpan nilai baru (`AC-01.7`) | Sheet menutup. Header: "Sisa budget: Rp{budget − spentToday}" (`AC-01.2`: 50000 → "Rp38.000"). Seluruh badge, filter, dan Budget Tracker dihitung ulang seketika (`AC-05.4`, `TS-06`). Banner ajakan "Atur budget" hilang. Toggle "Sesuai Budget Saya" menjadi aktif (tidak nonaktif lagi). Fokus kembali ke pemicu |
| T6-D | `overlay = BUDGET_SETTINGS` | Tombol "Batal", `X`, `Escape`, klik luar | Selalu | `overlay = NONE`. Budget tidak berubah | Fokus kembali ke pemicu |
| T6-E | `budget === null` | `BUDGET_FILTER_SET { on: true }` | `action.on && budget === null` | **Tidak berubah** (filter nonaktif, `FR-01.8`) | Toggle `aria-disabled` dengan teks bantu "Atur budget untuk memakai filter ini" (UX-SPEC H-5). Badge tidak dirender, estimasi tetap tampil (`TS-08`) |
| T6-F | `budget !== null` | `BUDGET_FILTER_SET { on }` atau `SORT_SET { mode }` | Selalu | `budgetFilterOn` atau `sortMode` berubah | Daftar restoran dihitung ulang lewat `filterAndSortRestaurants`. Jumlah hasil "{n} restoran" diumumkan (`aria-live="polite"`) |

### 4.8 Matriks Skenario Uji → Transisi

| Skenario PRD 9.5 | Transisi dan vektor |
|---|---|
| TS-01 | P-01, tabel proyeksi E (0 + 50.000 = tepat 100%, WARN), T4-F |
| TS-02 | P-04, T4-A sampai T4-E, T5-D |
| TS-03 | P-05, tabel E (81% WARN) |
| TS-04 | P-07, T2-F |
| TS-05 | P-08 |
| TS-06 | T6-C, tabel E (budget 100.000) |
| TS-07 | A-01 sampai A-09, T3-A sampai T3-H |
| TS-08 | D-06, T6-E |

---

## Section 5: Koreografi Fokus Modal, Popover Overflow, dan Interaksi Keyboard (`UX-SPEC` 5.5.2 dan 5.5.3)

### 5.1 Model Lapisan

| Lapisan | Elemen | z-index (DESIGN-SYSTEM 4.3) | Siklus |
|---|---|---|---|
| Halaman | `#app-root` (header, `main`, footer, bar sticky) | `z-30` | Menjadi `inert` saat ada overlay |
| Popover | Menu overflow `[⋮]` (`role="menu"`) | `z-40` | Non-modal. Latar tidak `inert` |
| Modal | `#overlay-root` (backdrop `z-40`, panel `z-50`) | `z-50` | Modal. Latar `inert` dan scroll terkunci |

Struktur DOM: `<div id="app-root">` dan `<div id="overlay-root">` bersaudara di dalam `<body>`. Overlay dirender lewat portal ke `#overlay-root`, sehingga `#app-root` dapat dijadikan `inert` tanpa ikut mematikan overlay.

### 5.2 Siklus Hidup Overlay (Urutan Wajib)

**Saat dibuka:**

| Langkah | Aksi |
|---|---|
| 1 | Handler pemicu memanggil `rememberFocusReturn(event.currentTarget)` **sebelum** `dispatch`. Ini perlu karena pemicu dapat hilang dari DOM pada render yang sama (misalnya item menu overflow) |
| 2 | `dispatch` action `OVERLAY_OPEN` (dengan `overlay` yang dipilih) atau transisi lain yang mengatur `overlay` |
| 3 | Komponen `Modal` ter-mount. Dalam `useLayoutEffect` (sebelum cat): ambil target pengembalian fokus, kunci latar, daftarkan lapisan `Escape`, pindahkan fokus awal, pasang focus trap |
| 4 | Kunci latar: `#app-root` mendapat `inert` dan `aria-hidden="true"`; `<html>` mendapat kelas `modal-open` (`overflow: hidden`, DESIGN-SYSTEM 3.6). Posisi gulir halaman tidak berubah |

**Saat ditutup:** kebalikan dari urutan di atas, lalu fokus dikembalikan.

| Langkah | Aksi |
|---|---|
| 1 | Lepas pendengar focus trap dan lapisan `Escape` |
| 2 | Hapus `inert`, `aria-hidden`, dan kelas `modal-open` (hanya ketika penghitung kedalaman kembali ke 0) |
| 3 | Kembalikan fokus (Bagian 5.4) pada frame animasi berikutnya, setelah DOM stabil |

### 5.3 Tabel Fokus Awal, `Escape`, dan Pengembalian Fokus per Overlay

Selaras `UX-SPEC` 5.5.3.

| Overlay | Fokus awal | `Escape` / `X` / klik luar | Fokus dikembalikan ke |
|---|---|---|---|
| Pengaturan Budget | Kolom input `#budget` | Tutup tanpa menyimpan (T6-D) | Pemicu (tombol sisa budget, "Atur budget") |
| Info Sheet | Tombol tutup `[X]` | Tutup | Ikon `[i]` / tautan pemicu |
| Daftar Voucher | Judul panel (`h2` dengan `tabindex="-1"`). `Tab` pertama menuju opsi pertama | Tutup tanpa menerapkan | Slot voucher pemicu (kunci `voucher-slot:FOOD` atau `voucher-slot:DELIVERY`) |
| Pilih Alamat | Opsi alamat yang sedang aktif (radio tercentang) | Tutup tanpa mengubah | Tombol "Ubah alamat" |
| Konfirmasi Ganti Keranjang | `[Tetap di keranjang lama]` | Setara "Tetap di keranjang lama" (T1-C2) | Tombol "Tambah" pemicu. Jika item sudah masuk (setelah "Ganti keranjang"), ke stepper `[+]` dengan kunci `add-item:{id}` yang sama |
| Pemberitahuan Perubahan Total | `[Mengerti]` | Setara `[Mengerti]` (N-5, T3-D) | Tombol "Ubah alamat" |
| Dialog EXCEEDED | `[Ubah pesanan]` (bukan `[Lanjutkan tetap]`) | Pembayaran tidak berjalan (E-4, T4-E) | Tombol "Bayar Rp{total}". Jika tindakan berpindah rute, fokus ke `main#konten` rute baru |
| Konfirmasi Reset data demo | `[Batal]` | Setara `[Batal]` | `[⋮]` pada header (kunci `overflow-trigger`). Setelah reset berpindah rute, ke `main#konten` |

### 5.4 Pengembalian Fokus dan Kunci Fokus

Atribut `data-focus-key` pada pemicu dan kontrol penggantinya menjamin fokus tidak hilang saat elemen pemicu diganti (misalnya "Tambah" berubah menjadi stepper).

| Kunci | Dipasang pada |
|---|---|
| `add-item:{menuItemId}` | Tombol "Tambah" dan, setelah item masuk, tombol `[+]` stepper item yang sama |
| `voucher-slot:FOOD`, `voucher-slot:DELIVERY` | Tombol "Pilih voucher" slot, dan tombol "Lepas" slot yang sama saat terisi |
| `overflow-trigger` | Tombol `[⋮]` dan item menu overflow |
| `change-address` | Tombol "Ubah alamat" |
| `pay` | Tombol "Bayar Rp{total}" |

**Rantai pengembalian fokus:** (1) elemen pemicu asli jika masih `isConnected`; (2) elemen pertama dengan `data-focus-key` yang sama; (3) `main#konten` (`tabindex="-1"`).

```ts
// src/a11y/focusReturn.ts
export interface FocusReturnTarget {
  readonly element: HTMLElement | null;
  readonly key: string | null;
}

let nextTarget: FocusReturnTarget | null = null;

function capture(el: Element | null): FocusReturnTarget {
  if (!(el instanceof HTMLElement)) return { element: null, key: null };
  const holder = el.closest<HTMLElement>('[data-focus-key]');
  return { element: el, key: holder === null ? null : holder.getAttribute('data-focus-key') };
}

export function rememberFocusReturn(trigger: Element | null): void {
  nextTarget = capture(trigger);
}

export function consumeFocusReturnTarget(): FocusReturnTarget {
  const target = nextTarget !== null ? nextTarget : capture(document.activeElement);
  nextTarget = null;
  return target;
}

export function restoreFocus(target: FocusReturnTarget): void {
  window.requestAnimationFrame(() => {
    const el = target.element;
    if (el !== null && el.isConnected) {
      el.focus();
      return;
    }
    if (target.key !== null) {
      const byKey = document.querySelector<HTMLElement>('[data-focus-key="' + CSS.escape(target.key) + '"]');
      if (byKey !== null) {
        byKey.focus();
        return;
      }
    }
    const main = document.getElementById('konten');
    if (main !== null) main.focus();
  });
}
```

### 5.5 Kunci Latar dan Scroll (`inert` dan `html.modal-open`)

```ts
// src/a11y/backgroundLock.ts
const APP_ROOT_ID = 'app-root';
let depth = 0;

export function acquireBackgroundLock(): () => void {
  const root = document.getElementById(APP_ROOT_ID);
  depth += 1;
  if (depth === 1) {
    if (root !== null) {
      root.setAttribute('inert', '');
      root.setAttribute('aria-hidden', 'true');
    }
    document.documentElement.classList.add('modal-open');
  }
  let released = false;
  return () => {
    if (released) return;
    released = true;
    depth -= 1;
    if (depth === 0) {
      const current = document.getElementById(APP_ROOT_ID);
      if (current !== null) {
        current.removeAttribute('inert');
        current.removeAttribute('aria-hidden');
      }
      document.documentElement.classList.remove('modal-open');
    }
  };
}
```

| Aturan | Spesifikasi |
|---|---|
| Penghitung kedalaman | Hanya pembuka pertama yang mengunci dan hanya penutup terakhir yang melepas, sehingga transisi dari satu overlay ke overlay lain tidak berkedip |
| `inert` | Menonaktifkan fokus, klik, dan akses pembaca layar pada seluruh `#app-root`. Didukung penuh di Chrome, Edge, Firefox, dan Safari terbaru (NFR-06). `aria-hidden` ditambahkan sebagai pengaman |
| Posisi gulir | `overflow: hidden` pada `<html>` tidak mengubah posisi gulir. Panel memakai `overscroll-contain` (DESIGN-SYSTEM 5.16) agar gulir di dalam panel tidak merambat ke latar |
| Isi `#overlay-root` | Tidak pernah `inert` |

### 5.6 Focus Trap (`Tab` dan `Shift+Tab`)

**Perilaku:**

| Situasi | Perilaku |
|---|---|
| `Tab` pada elemen fokus **terakhir** di panel | Fokus pindah ke elemen fokus **pertama** (siklus) |
| `Shift+Tab` pada elemen fokus **pertama** | Fokus pindah ke elemen fokus **terakhir** |
| Fokus berada di luar panel (misalnya klik pada backdrop yang tidak fokus) | `Tab` mengembalikan fokus ke elemen pertama (atau terakhir jika `Shift+Tab`) |
| Panel tidak memiliki elemen yang dapat difokus | Fokus ke panel itu sendiri (`tabindex="-1"`) dan `Tab` ditahan |
| Elemen `aria-disabled="true"` | Tetap dapat difokus (agar pengguna keyboard tahu keberadaannya). Aksinya diabaikan |
| Elemen `disabled` | Tidak dapat difokus dan dilewati |
| Konten dinamis muncul (misalnya pesan galat `role="alert"`) | Daftar elemen dihitung ulang pada setiap penekanan `Tab` (tidak di-cache) |
| Radio group | Satu titik `Tab` per grup (perilaku bawaan peramban). Anak panah berpindah antar opsi |

```ts
// src/a11y/focusTrap.ts
const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export function getFocusable(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => el.getClientRects().length > 0 && window.getComputedStyle(el).visibility !== 'hidden',
  );
}

export function trapTab(event: KeyboardEvent, container: HTMLElement): void {
  if (event.key !== 'Tab') return;
  const items = getFocusable(container);
  const first = items[0];
  const last = items[items.length - 1];
  if (first === undefined || last === undefined) {
    event.preventDefault();
    container.focus();
    return;
  }
  const active = document.activeElement;
  const outside = !(active instanceof Node) || !container.contains(active);
  if (event.shiftKey) {
    if (active === first || outside) {
      event.preventDefault();
      last.focus();
    }
  } else if (active === last || outside) {
    event.preventDefault();
    first.focus();
  }
}
```

### 5.7 Penanganan `Escape` dan Urutan Prioritas

Satu pendengar global `keydown` mengelola **tumpukan lapisan** (LIFO). Hanya lapisan **teratas** yang menerima `Escape`.

| Prioritas | Lapisan | Perilaku `Escape` |
|---|---|---|
| 1 (tertinggi) | Modal / bottom sheet / dialog | Menjalankan aksi "tutup" sesuai tabel 5.3. Popover tidak ikut tertutup oleh penekanan yang sama |
| 2 | Popover menu overflow | Menutup menu dan mengembalikan fokus ke `[⋮]` |
| 3 | Lainnya (halaman) | Tidak melakukan apa pun (kolom pencarian tidak dikosongkan oleh `Escape`) |

**Penjelasan urutan:** lapisan modal selalu didaftarkan setelah popover. Latar menjadi `inert` saat modal terbuka, sehingga popover (bagian dari header di `#app-root`) tidak dapat dibuka selama modal aktif. Jika menu overflow terbuka dan pengguna memilih "Reset data demo", handler menutup popover (lapisannya dilepas) sebelum modal konfirmasi mendaftarkan lapisannya.

| Aturan tambahan | Spesifikasi |
|---|---|
| `event.isComposing` | `Escape` yang dipakai IME diabaikan |
| `event.defaultPrevented` | Jika sudah ditangani elemen lain, diabaikan |
| `Escape` pada `<select>` | Overlay dan popover tidak memuat `<select>` native, sehingga tidak ada konflik dengan daftar pilihan bawaan peramban |
| Satu penekanan, satu lapisan | `preventDefault()` dipanggil sehingga satu `Escape` tidak menutup dua lapisan |

```ts
// src/a11y/escapeStack.ts
export interface EscapeLayer {
  readonly id: string;
  readonly onEscape: () => void;
}

const layers: EscapeLayer[] = [];
let listening = false;

function handleKeyDown(event: KeyboardEvent): void {
  if (event.key !== 'Escape' || event.isComposing || event.defaultPrevented) return;
  const top = layers[layers.length - 1];
  if (top === undefined) return;
  event.preventDefault();
  top.onEscape();
}

export function pushEscapeLayer(layer: EscapeLayer): () => void {
  layers.push(layer);
  if (!listening) {
    document.addEventListener('keydown', handleKeyDown);
    listening = true;
  }
  return () => {
    const index = layers.indexOf(layer);
    if (index >= 0) layers.splice(index, 1);
    if (layers.length === 0 && listening) {
      document.removeEventListener('keydown', handleKeyDown);
      listening = false;
    }
  };
}
```

### 5.8 Hook `useModalBehavior`

```tsx
// src/a11y/useModalBehavior.ts
import { useLayoutEffect, useRef } from 'react';
import type { RefObject } from 'react';
import { acquireBackgroundLock } from './backgroundLock';
import { pushEscapeLayer } from './escapeStack';
import { consumeFocusReturnTarget, restoreFocus } from './focusReturn';
import { trapTab } from './focusTrap';

export interface ModalBehaviorOptions {
  readonly panelRef: RefObject<HTMLElement>;
  /** Selektor CSS (di dalam panel) untuk elemen fokus awal. Contoh: '[data-initial-focus]'. */
  readonly initialFocus: string;
  /** Aksi "tutup" overlay ini (lihat tabel 5.3). */
  readonly onEscape: () => void;
}

export function useModalBehavior(options: ModalBehaviorOptions): void {
  const { panelRef, initialFocus } = options;
  const escapeRef = useRef(options.onEscape);

  useLayoutEffect(() => {
    escapeRef.current = options.onEscape;
  });

  useLayoutEffect(() => {
    const panel = panelRef.current;
    if (panel === null) return undefined;

    const returnTarget = consumeFocusReturnTarget();
    const releaseLock = acquireBackgroundLock();
    const removeLayer = pushEscapeLayer({ id: 'modal', onEscape: () => { escapeRef.current(); } });

    const initial = panel.querySelector<HTMLElement>(initialFocus);
    (initial !== null ? initial : panel).focus();

    const onKeyDown = (event: KeyboardEvent): void => {
      trapTab(event, panel);
    };
    panel.addEventListener('keydown', onKeyDown);

    return () => {
      panel.removeEventListener('keydown', onKeyDown);
      removeLayer();
      releaseLock();
      restoreFocus(returnTarget);
    };
  }, [panelRef, initialFocus]);
}
```

**Kontrak `Modal`:** panel memiliki `role="dialog"` (atau `alertdialog` untuk EXCEEDED), `aria-modal="true"`, `aria-labelledby` ke judul, `tabindex="-1"`, dan elemen fokus awal ditandai `data-initial-focus`. Klik pada backdrop memanggil `onEscape` yang sama.

### 5.9 Popover Menu Overflow `[⋮]`

**ARIA:** tombol `[⋮]` memakai `aria-haspopup="menu"`, `aria-expanded`, dan `aria-controls`. Panel memakai `role="menu"` dan `aria-labelledby` menuju tombol. Setiap item memakai `role="menuitem"` dan `tabindex="-1"` (roving).

| Tombol / Kondisi | Perilaku |
|---|---|
| `Enter`, `Space`, `ArrowDown` pada `[⋮]` | Buka menu dan fokus ke item pertama |
| `ArrowUp` pada `[⋮]` | Buka menu dan fokus ke item terakhir |
| `ArrowDown` / `ArrowUp` pada item | Pindah ke item berikutnya / sebelumnya (berputar) |
| `Home` / `End` pada item | Item pertama / terakhir |
| `Enter` / `Space` pada item | Jalankan aksi. Untuk "Reset data demo": tutup menu, panggil `rememberFocusReturn` pada `[⋮]`, dispatch `RESET_REQUESTED` |
| `Escape` | Tutup menu dan fokus kembali ke `[⋮]` (prioritas 2, Bagian 5.7) |
| `Tab` | Menutup menu. Fokus berlanjut secara alami, tanpa dikembalikan paksa ke `[⋮]` |
| Klik atau ketuk di luar menu | Menutup menu tanpa memindahkan fokus |
| Fokus keluar dari panel (`focusout` ke luar) | Menutup menu |
| Rute berubah | Menu ditutup (`ROUTE_CHANGED` mengatur `overflowMenuOpen = false`) |
| Membuka overlay lain (`OVERLAY_OPEN`) | Menu ditutup (`overflowMenuOpen = false`) |

Menu hanya memuat satu item ("Reset data demo", ikon `RotateCcw`). Mekanisme roving tetap diterapkan agar penambahan item pada masa depan tidak mengubah perilaku.

### 5.10 Peta Keyboard Komponen (UX-SPEC 5.5.2)

| Elemen | Tombol | Perilaku |
|---|---|---|
| Seluruh kontrol interaktif | `Tab` / `Shift+Tab` | Dijangkau berurutan menurut urutan DOM, yang sama dengan urutan baca visual |
| Skip link "Lewati ke konten utama" | `Tab` pertama pada halaman, `Enter` | Fokus ke `main#konten`. Hanya tampil saat difokus |
| Kartu restoran (tautan) | `Enter` | Buka `/restoran/:id` |
| Tombol, tautan | `Enter` (tautan dan tombol), `Space` (tombol) | Aktifkan |
| Stepper `[–]` / `[+]` | `Enter` / `Space` | Mengurangi atau menambah. `[+]` pada `99` dan `[–]` yang menghapus tidak memindahkan fokus keluar tak terduga: setelah penghapusan fokus ke baris berikutnya atau `EmptyState` |
| Toggle "Sesuai Budget Saya" | `Space` | Ubah status. Dilewati sebagai aksi bila `aria-disabled` |
| Radio alamat dan voucher | `ArrowDown`/`ArrowRight` dan `ArrowUp`/`ArrowLeft` memilih opsi berikutnya atau sebelumnya. `Space` memilih | Perilaku bawaan `input type="radio"` dengan nama grup yang sama |
| Kolom budget | `Enter` | Kirim formulir (Simpan). `Escape` menutup sheet tanpa menyimpan |
| Pilihan "Urutkan" (`<select>`) | Perilaku bawaan peramban | Mengubah `sortMode` |
| Tombol bayar | `Enter` / `Space` | `PAY_REQUESTED`. Tidak berefek selama overlay terbuka (latar `inert`) |
| Overlay terbuka | `Tab`, `Shift+Tab`, `Escape` | Bagian 5.6 dan 5.7 |

### 5.11 Fokus dan Pengumuman pada Perubahan Rute

| Aturan | Spesifikasi |
|---|---|
| Fokus setelah navigasi | Setiap perubahan rute memindahkan fokus ke `main#konten` (`tabindex="-1"`). Perubahan kecil (query pencarian) tidak memindahkan fokus |
| Judul dokumen | `document.title` diperbarui sesuai `h1` layar |
| Pengecualian | Jika overlay baru saja ditutup dan target pengembalian fokus ada di rute yang sama, fokus kembali ke target tersebut (Bagian 5.4) |
| Dispatch `ROUTE_CHANGED` | Dikirim oleh satu efek pada perubahan `location.pathname` dengan pasangan `from` dan `to` |

### 5.12 Uji Perilaku Fokus dan Keyboard

| ID | Pemeriksaan | Hasil yang diharapkan |
|---|---|---|
| K-01 | Buka tiap dari 8 overlay | Fokus awal sesuai tabel 5.3 |
| K-02 | `Tab` pada elemen terakhir, `Shift+Tab` pada elemen pertama | Fokus berputar di dalam panel |
| K-03 | Coba fokus elemen di latar | Tidak mungkin (`inert`) |
| K-04 | Gulir latar saat overlay terbuka | Latar tidak bergulir. Isi panel bergulir sendiri |
| K-05 | `Escape` pada tiap overlay | Hasil sesuai tabel 5.3 (EXCEEDED: pembayaran tidak berjalan. Perubahan total: setara "Mengerti") |
| K-06 | Menu overflow terbuka, tekan `Escape` | Menu tertutup, fokus ke `[⋮]`, tidak ada overlay yang tertutup |
| K-07 | Pilih "Reset data demo" lewat keyboard, lalu `Escape` pada dialog | Dialog tertutup, fokus ke `[⋮]`, tidak ada data yang direset |
| K-08 | Tutup tiap overlay | Fokus kembali ke pemicu atau kunci fokus yang sesuai. Setelah "Ganti keranjang", fokus ke stepper item |
| K-09 | Dialog EXCEEDED dibuka | Fokus awal bukan pada "Lanjutkan tetap" |
| K-10 | Klik ganda "Bayar" | Satu `Receipt`, `spentToday` bertambah satu kali |
| K-11 | Overlay dibuka dan ditutup berulang kali | Kelas `modal-open` dan atribut `inert` selalu bersih setelah penutupan terakhir |
| K-12 | Tab ke seluruh halaman Cart tanpa overlay | Urutan fokus sama dengan urutan baca: item, voucher, rincian, tracker, aksi |

---

*Akhir dokumen INTERACTION-SPEC TPBG v1.0.0*
