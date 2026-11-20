
# AGENTS.md — Kontrak Pengembangan TPBG

> *Status: MUTLAK. Berkas ini adalah kontrak pengembangan untuk setiap AI coding assistant (Claude Code, Cursor, Antigravity, dan sejenisnya) yang menulis kode di repositori ini. Baca seluruh berkas ini sebelum menulis satu baris kode. Bagian 0 (Amandemen & Errata) menempati otoritas tertinggi di atas seluruh dokumen spesifikasi; untuk ketentuan di luar Bagian 0, dokumen sumber menang sesuai hierarki di Bagian 1.3.

---

## 0. Amandemen & Errata Spesifikasi (Otoritas Tertinggi — Resolusi F-01 s.d. F-27)

Bagian ini menempati **peringkat tertinggi (Level 0)** dalam rantai otoritas proyek, menimpa seluruh ketentuan yang bertentangan pada `PRD.md`, `UX-SPEC.md`, `DESIGN-SYSTEM.md`, `INTERACTION-SPEC.md`, `ACCEPTANCE-CRITERIA.md`, maupun bagian bawah `AGENTS.md` dan `README.md`.

### 0.1 Errata Angka, Vektor Uji & Protokol Koreksi (`F-01`, `F-09`, `F-19`)
1. **Koreksi Vektor `P-11` (`F-01`):** Pada `INTERACTION-SPEC.md §3.10-A` dan `AGENTS.md §5.1`, kombinasi `M-101` (`Rp15.000`, `NOT_INCLUDED`) + `M-102` (`Rp18.000`, `NOT_INCLUDED`) + `M-103` (`Rp12.000`, `NOT_INCLUDED`) memiliki dasar pajak `Rp45.000`. Nilai pajak yang sah adalah `floorDiv(45000 * 10, 100) = 4.500` (bukan `4.000`), dan total akhir yang sah adalah **`62.500`** (bukan `62.000`).
2. **Protokol Errata Pengujian (`F-01`):** Aturan larangan mengubah uji (`AGENTS.md §5.2`) tidak berlaku untuk kesalahan aritmetika pada dokumen spesifikasi. Apabila ditemukan selisih antara vektor uji dan rumus domain (`PRD.md §6.2` / `INTERACTION-SPEC.md §3.2`), wajib dilakukan verifikasi matematis dan pencatatan errata sebelum mengunci tes—dilarang mengubah logika domain yang benar demi mengejar angka tes yang keliru.
3. **Perubahan Alamat Zero-Delta (`F-09`):** Apabila perpindahan alamat menghasilkan selisih total akhir **`Rp0`** (contoh vektor **`A-10`**: Cart `R-03` item `M-301 + M-304` + voucher `V-D01`, pindah `ADDR-01 → ADDR-02`, ongkir naik `Rp4.000 → Rp7.000` dan diskon ongkir naik `Rp4.000 → Rp7.000`, total tetap `Rp28.000`), dialog `"Total pesananmu berubah"` **tidak boleh muncul**; alamat langsung diperbarui dengan pengumuman status `"Alamat pengiriman diperbarui."`.
4. **Pembulatan `formatPercent` (`F-19`):** Fungsi `formatPercent(projected, budget)` di `DESIGN-SYSTEM.md §3.4` wajib menggunakan `Math.floor` saat `projected < budget` (sehingga `39.999 / 50.000` tampil `"79%"`, selaras dengan status `OK`), `Math.ceil` saat `projected > budget` (sehingga `50.001 / 50.000` tampil `"101%"`, selaras dengan status `EXCEEDED`), dan `"100%"` tepat saat `projected === budget`. Tambahkan vektor uji `39.999 → "79%"` dan `50.001 → "101%"`.

### 0.2 Toolchain, Konfigurasi & Kemurnian Lapisan (`F-02`, `F-03`, `F-04`, `F-05`, `F-17`, `F-25`, `F-26`)
5. **Pin Versi Runtime & Paket (`F-17`):** Kunci versi pada `package.json`: Node.js `>=20.19.0`, `react` `^18.3.1` & `react-dom` `^18.3.1` (jangan gunakan React 19), `typescript` `^5.6.0`, `tailwindcss` `^3.4.14`, `eslint` `^8.57.1` (dengan `@typescript-eslint/parser` & `@typescript-eslint/eslint-plugin`), dan `lucide-react` `^0.454.0`.
6. **Konfigurasi ESM, Tailwind & Konversi TypeScript (`F-02`):** Tambahkan `"type": "module"` pada `package.json`. Ubah `content` pada `tailwind.config.js` menjadi `['./index.html', './src/**/*.{js,ts,jsx,tsx}']`. Seluruh contoh kode `.js`/`.jsx` di `DESIGN-SYSTEM.md` (termasuk `.eslintrc.cjs` dan komponen `§5`) wajib diimplementasikan sebagai TypeScript ketat (`.ts`/`.tsx`) tanpa `any` maupun `!`.
7. **Pemisahan Lapisan Murni (`F-03`):** Folder `src/lib/`, `src/state/`, dan `src/data/` wajib bebas dari `react`, `react-dom`, `react-router-dom`, `lucide-react`, serta akses global `window`, `document`, `localStorage`, atau `crypto`.
   - Pindahkan `AppStateProvider` dan hook `useAppState` ke `src/app/AppStateProvider.tsx`.
   - `src/state/persistence.ts` hanya menerima antarmuka injeksi `MinimalStorage`; adapter `window.localStorage` dipasang di `src/app/`.
   - `src/lib/receiptId.ts` menerima fungsi generator/seed injeksi dari lapisan `src/app/`.
   - Terapkan aturan ESLint `no-restricted-imports` untuk memblokir impor UI/DOM di `src/lib/**`, `src/state/**`, dan `src/data/**`.
8. **Izin `react-router-dom` & Navigasi SPA (`F-04`):** Amandemen `AC DoD-10`: izinkan `react-router-dom` (`^6.28.0`) sebagai dependensi resmi. Seluruh contoh `<a href="...">` navigasi internal di `DESIGN-SYSTEM.md` wajib diganti menjadi `<Link to="...">` atau `<NavLink to="...">` agar state volatil tidak hilang akibat *full reload*.
9. Toolchain E2E Playwright & Font Deterministik (F-05): Tambahkan @playwright/test dan daftarkan skrip "typecheck": "tsc --noEmit", "test:e2e": "playwright test", serta "verify": "npm run typecheck && npm run lint && npm run test && npm run test:e2e && npm run build" di package.json. Seluruh uji tinggi PriceNote <= 44px (24 item di 360×640), focus trap, inert, dan E2E dijalankan di Playwright dengan injeksi font metrik deterministik (bukan jsdom).
10. **Uji Pemindaian Pola Terlarang (`F-25`):** Buat `src/__tests__/static-rules.test.ts` pada Vitest yang memindai seluruh berkas `src/` via Node `fs` untuk memverifikasi nol kemunculan `Intl.`, `.toLocaleString`, `.toFixed`, `dark:`, kelas font mikro ilegal (`text-[10px]`, dll.), URL `http://`/`https://` eksternal, dan kata merek terlarang.
11. **Meta Viewport Safe-Area (`F-26`):** `index.html` wajib memuat `<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />` agar `env(safe-area-inset-bottom)` bekerja.

### 0.3 Resolusi Perilaku UI, Aksesibilitas & Arsitektur State (`F-06` s.d. `F-16`, `F-18`, `F-20` s.d. `F-24`, `F-27`)
12. **Konkordansi ID `AC-xx.y` (`F-06`, `F-24`):** Seluruh kode `AC-xx.y` di dalam `PRD.md`, `UX-SPEC.md`, `DESIGN-SYSTEM.md`, dan `INTERACTION-SPEC.md` merujuk pada **`PRD AC-xx.y`**, sedangkan ID `AC-xx.y` tanpa awalan merujuk pada `ACCEPTANCE-CRITERIA.md §2` sesuai tabel konsolidasi `§4.4`.
13. **Header Checkout & Struk (`F-07`):** Mengikuti `UX-SPEC.md §2.2`, header pada `/checkout` dan `/struk` tetap mempertahankan indikator sisa budget, ikon Keranjang, dan menu `[⋮]` (`"Reset data demo"`), dan **hanya menyembunyikan bilah pencarian**.
14. **Varian Visual `aria-disabled` (`F-08`):** Kontrol nonaktif yang tetap harus fokusabel (`Button`, toggle `"Sesuai Budget Saya"`, dan tombol `[+]` `QuantityStepper` saat `qty === 99`) wajib memakai atribut `aria-disabled="true"` (bukan HTML `disabled`) serta kelas `aria-disabled:opacity-50 aria-disabled:cursor-not-allowed` (dan `peer-aria-disabled:` untuk label), serta menonaktifkan efek `hover:` saat `aria-disabled="true"`.
15. **Tombol Back Peramban & Guardrail Overlay (`F-10`, `F-18`):** Jumlah overlay resmi disamakan menjadi **8 overlay** (termasuk `ResetConfirmDialog`). Hapus ketentuan penutupan dialog oleh tombol Back peramban pada `T4-E`; tombol Back memicu `ROUTE_CHANGED` dan berpindah rute secara konservatif.
16. **Pencarian Home, Input Budget & Basis Status (`F-11`, `F-12`, `F-13`, `F-27`):**
    - Input/submit pencarian di `/` menavigasi ke `/cari?q=<kata_kunci>`. Teks hitungan hasil seragam: `"{n} hasil untuk '{kata kunci}'"` (saat ber-query) atau `"{n} restoran tersedia"` (tanpa query).
    - Input budget tidak menyaring keystroke; validasi berjalan saat tombol `[Simpan]` ditekan (`AC-01.3`).
    - Pada `/struk`, jika `budget === null`, sembunyikan baris target budget dan sisa budget. Badge header `/restoran/:id` dihitung dari estimasi menu andalan restoran tersebut.
    - Nilai `{n}` pada badge dan `aria-label="Keranjang, {n} item"` adalah **total kuantitas seluruh item (`Σ qty`)**.
17. **Konsolidasi Fungsi & Snippet (`F-14`, `F-23`):**
    - `computeSubtotal` hanya didefinisikan di `src/lib/pricing.ts` (`cart.ts` mendelegasikan); `createEmptyCart` hanya didefinisikan di `src/lib/cart.ts`.
    - Impor `RestaurantId` di `src/lib/pricing.ts`, ekspor `toPersisted` di `src/state/persistence.ts`, terapkan guard keranjang valid di `T5-A` untuk jalur normal maupun `EXCEEDED`, dan sediakan fallback aman saat `removeItem` mengosongkan keranjang.
    - Bungkus `@media (prefers-reduced-motion: reduce)` dalam `@layer base` di `src/index.css`. Izinkan 4 token gradien dekoratif artwork (`pink`, `sky`, `violet`, `indigo`) khusus pada komponen `Thumbnail`. Tetapkan lokasi `src/design/focus.ts` (`FOCUS`), `src/design/cx.ts` (`cx`), serta peta prop `variant` pada `Thumbnail`.
18. **Live Region Persisten & Landmark (`F-16`, `F-20`):**
    - Kontainer `role="status"` / `aria-live="polite"` pada `BudgetTracker` (format teks: `"{Label}. Proyeksi {persen} persen."`) dan banner penggantian voucher wajib dirender permanen di DOM sejak awal mount.
    - `StickyActionBar` pada halaman Menu ditempatkan di dalam `<main>` atau dibungkus `<footer aria-label="Ringkasan keranjang">`.
19. **Batasan Merek & Penambahan Microcopy (`F-21`, `F-22`, `F-24`):**
    - Larangan merek eksternal berlaku pada teks UI, atribut aksesibilitas, `index.html`, `package.json` (`name`/`description`), dan nama identifier kode; berkas dokumentasi dikecualikan. Standarkan nama berkas dokumentasi akar menjadi `README.md`.
    - Microcopy tambahan yang dikunci: selisih ongkir alamat (`"Ongkir lebih hemat {selisih}"` / `"Ongkir lebih mahal {selisih}"` / `"Ongkir sama"`), lipat/buka item Checkout (`"Lihat item ({n})"` / `"Sembunyikan item"`), dan subteks `EmptyState` Keranjang (`"Pilih menu dari restoran favoritmu untuk mulai menghitung estimasi biaya dan budget."`).
20. **Skenario E2E Tambahan (`F-15`):** Selain `TS-01..TS-08`, wajib diimplementasikan **`TS-09`** (urutkan & cari katalog, menutup `AC-01.5`, `AC-01.6`), **`TS-10`** (ganti keranjang lintas restoran & keranjang kosong, menutup `AC-02.4`, `AC-02.5`, `AC-03.4`, `AC-03.7`, `AC-03.8`), dan **`TS-11`** (penjagaan rute langsung & anti *double-submit* pembayaran, menutup `AC-04.13`).

---

### 0.4 Gerbang Eksekusi Bertahap (Pengganti Jadwal Tahap di Bagian 5)

| Tahap | Ruang Lingkup | Gerbang Validasi Wajib (Lulus 100% Sebelum Lanjut) |
|---|---|---|
| **Tahap 0** | Penerapan seluruh amandemen `§0.1 – §0.3` | Errata `P-11` (`62.500`), `A-10` (zero-delta), dan `formatPercent` (`39.999` / `50.001`) terkunci. |
| **Tahap 1** | Setup proyek, `package.json` (versi pin + Playwright), `tsconfig`, `.eslintrc.cjs`, `tailwind.config.js`, `src/types/*`, `src/data/*` | `npm run typecheck` & `npm run lint` lolos 0 error; uji Vitest integritas mock data (6 restoran, 24 menu, 5 voucher, 3 alamat) & `static-rules.test.ts` lolos. |
| **Tahap 2** | Domain engine murni (`src/lib/*`: `pricing`, `budget`, `cart`, `format`, `receiptId`) | Seluruh vektor `P-01..P-13` (dengan `P-11` ter-errata), `BR-06`, `A-01..A-10`, `E-01..E-07`, `D-01..D-08`, dan `formatPercent` lulus di Vitest tanpa impor DOM/React. |
| **Tahap 3** | State reducer & sanitizer murni (`src/state/*`) | Seluruh transisi `T1..T6`, invarian `I-1..I-10` (dengan PRNG ber-seed), sanitasi `S-1..S-17`, idempotensi `receiptId`, dan reset atomik lulus di Vitest. |
| **Tahap 4** | Design system (`src/design/*`), util a11y (`src/a11y/*`), `AppStateProvider` (`src/app/*`), dan 17 komponen atomik (`src/components/*`) | `typecheck` & `lint` bersih; seluruh varian `aria-disabled` dan live region persisten terpasang sesuai kontras WCAG 2.1 AA. |
| **Tahap 5a** | Router, penjaga rute, halaman `/`, `/cari`, dan `/restoran/:id` | Playwright lolos `TS-06`, `TS-08`, `TS-09`, `AC-01.x`, `AC-02.x`, serta uji tinggi `PriceNote <= 44px` untuk seluruh 24 item menu pada viewport `360×640`. |
| **Tahap 5b** | Halaman `/keranjang` dan overlay pemilihan voucher | Playwright lolos `TS-01` (Bagian A), `TS-03`, `TS-04`, `TS-05`, dan `TS-10` (`AC-03.x`). |
| **Tahap 5c** | Halaman `/checkout`, `/struk`, alamat, guardrail `EXCEEDED`, dan reset | Playwright lolos `TS-01` (Bagian B), `TS-02`, `TS-07`, dan `TS-11` (`AC-04.x`). |
| **Tahap 5d** | Audit aksesibilitas keyboard & matriks responsif | Playwright lolos koreografi `K-01..K-12` dan pemeriksaan 4 viewport × 6 rute × 8 overlay tanpa overflow horizontal. |
| **Tahap 6** | Verifikasi rilis akhir (`DoD-01..DoD-12` & 43 AC) | Perintah tunggal `npm run verify` (`typecheck` + `lint` + `test` + `test:e2e` + `build`) keluar dengan exit code `0`. |



## 1. Identitas & Konteks Proyek

### 1.1 Ringkasan

- **Nama:** ShopeeFood Transparent Pricing and Budget Guardrail (TPBG).
- **Jenis:** prototype akademik mata kuliah **Rekayasa Interaksi**, aplikasi web responsif. **Tidak berafiliasi** dengan platform pesan-antar mana pun.
- **Data:** 100% **client-side mock data** fiktif (6 restoran, 24 item menu, 5 voucher, 3 alamat, profil Wira). **Dilarang** backend, database, API eksternal, autentikasi, payment gateway nyata, peta, dan geolokasi.
- **Inti produk:** (1) harga turunan sebelum Cart selalu berlabel "Est."; (2) Cart adalah satu-satunya titik kalkulasi final; (3) **Zero-Delta**: total Cart = total Checkout = jumlah Struk (Selisih Rp0); (4) **Budget Guardrail** OK / WARN / EXCEEDED, dengan dialog konfirmasi **sebelum** pembayaran saat EXCEEDED; (5) perubahan total setelah Cart (alamat) **wajib** diumumkan: sebelum, sesudah, penyebab.
- **Rute (6):** `/` Home, `/cari?q=` Search, `/restoran/:id` Menu, `/keranjang` Cart, `/checkout` Checkout, `/struk` Struk (simulasi).
- **Overlay modal (7):** Pengaturan Budget, Info Sheet Komponen Biaya, Daftar Voucher, Konfirmasi Ganti Keranjang, Pilih Alamat, Pemberitahuan Perubahan Total, Dialog EXCEEDED. Ditambah `ConfirmDialog` untuk "Reset data demo" (total 8 overlay pada uji `K-01`). Menu overflow `[⋮]` adalah popover non-modal, **bukan** overlay.

### 1.2 Tech Stack Terkunci

| Lapisan | Pilihan (terkunci) |
|---|---|
| UI | React + Vite |
| Bahasa | TypeScript dengan `strict: true` (berkas `.ts` / `.tsx`) |
| Styling | **Tailwind CSS v3** (bukan v4), tanpa plugin Tailwind |
| Ikon | `lucide-react` (satu-satunya pustaka ikon) |
| Uji | Vitest |
| Lint | ESLint 8.x dengan konfigurasi `.eslintrc.cjs` |
| Routing | Spesifikasi hanya mensyaratkan `navigate(path, { replace: true })`, `:id`, dan `location.pathname`. Gunakan `react-router-dom` v6 (pustaka routing, bukan pustaka UI). **Jangan** menambah pustaka runtime lain. |

Dependensi yang diizinkan: React, Vite, TypeScript, Tailwind CSS v3 (+ PostCSS, Autoprefixer), `lucide-react`, serta **devDependencies** uji/lint (Vitest, ESLint dan plugin-nya, jsdom, Playwright bila dipakai untuk E2E). **Dilarang** menambah paket lain tanpa persetujuan eksplisit pengguna (`DoD-10`).

`tsconfig.json` wajib memuat: `strict`, `noUncheckedIndexedAccess`, `noImplicitOverride`, `noFallthroughCasesInSwitch`, `noUnusedLocals`, `noUnusedParameters`, `isolatedModules`, `forceConsistentCasingInFileNames`, `skipLibCheck`; `target: ES2020`, `moduleResolution: Bundler`, `jsx: react-jsx`, `types: ["vite/client"]`, `include: ["src"]`.

### 1.3 Hierarki Otoritas Dokumen (Mutlak)

```
PRD.md  ->  UX-SPEC.md  ->  DESIGN-SYSTEM.md  ->  INTERACTION-SPEC.md  ->  ACCEPTANCE-CRITERIA.md
```

| Dokumen | Yang dikunci |
|---|---|
| `PRD.md` | FR-01..05, NFR-01..10, BR-01..11, rumus harga (6.2), mock data (Bagian 9), skenario `TS-01..TS-08` |
| `UX-SPEC.md` | 6 rute, 7 overlay, alur F-1..F-6, struktur komponen, **katalog microcopy (5.3)**, aksesibilitas struktural (5.5), asumsi A1..A12 |
| `DESIGN-SYSTEM.md` | Token warna dan kontras, tipografi, grid responsif, kelas Tailwind, placeholder art, `PriceNote` dua baris, format Rupiah manual, teks default struktural (1.6) |
| `INTERACTION-SPEC.md` | Tipe TypeScript, state, `localStorage["tpbg:v1"]`, `calculateOrder`, reducer dan transisi `T1..T6`, vektor uji, koreografi fokus dan keyboard `K-01..K-12` |
| `ACCEPTANCE-CRITERIA.md` | 43 AC (`AC-01.1..AC-05.7`), `DoD-01..DoD-12`, panduan E2E, traceability |

**Aturan konflik:**

1. Dokumen di kiri menang. `PRD_2.md` yang muncul di dokumen lain adalah **alias identik** `PRD.md`.
2. Dokumen di bawah `UX-SPEC.md` **tidak boleh** mengubah perilaku atau microcopy.
3. Contoh kode `.js` di `DESIGN-SYSTEM.md` (`formatRupiah.js`, `budgetStatus.js`, `artwork.js`, `cx.js`) **wajib ditulis sebagai `.ts`** sesuai `INTERACTION-SPEC.md` 3.9. Isi logikanya tidak berubah.
4. Jika sebuah situasi tidak diatur oleh kelima dokumen, **jangan mengarang perilaku**. Pilih opsi paling konservatif yang tidak melanggar aturan mana pun, lalu laporkan celah itu secara eksplisit kepada pengguna.

### 1.4 Rujukan Cepat: Rumus dan Invarian (Sumber: PRD 6.2, BR-06..BR-10)

Seluruh uang adalah **bilangan bulat Rupiah** (`Rupiah = number`, `Number.isSafeInteger`).

| Komponen | Rumus |
|---|---|
| `subtotal` | `Σ (listPrice − discount) × qty` |
| `tax` | `floorDiv(taxableSubtotal × taxRatePercent + 50, 100)`, **sekali** atas total dasar pajak, hanya item `NOT_INCLUDED` |
| `packaging` | `Σ qty × packagingFeePerItem` |
| `deliveryFee` | `baseDeliveryFee + address.deliveryFeeDelta` (ADDR-01 `+0`, ADDR-02 `+3000`, ADDR-03 `+5000`) |
| `serviceFee` | tarif tetap restoran |
| Diskon makanan | `min(nilai atau floor(subtotal × persen / 100), batasMaks, subtotal)` |
| Diskon ongkir | `min(nilai, batasMaks, deliveryFee)` |
| Syarat voucher | `subtotal ≥ minimum` (inklusif), dihitung terhadap subtotal, **tidak** terpengaruh alamat |
| `total` | `max(0, subtotal + tax + packaging + deliveryFee + serviceFee − diskonMakanan − diskonOngkir)` |
| `proyeksi` | `spentToday + nilaiPesanan` (kartu: Est. all-in; Cart/Checkout: total Cart) |
| Status budget | `EXCEEDED` jika `proyeksi > budget`; `WARN` jika `proyeksi × 100 ≥ budget × 80`; selain itu `OK`. Tepat 100% = `WARN` |
| Est. all-in | 1 porsi, tanpa voucher, memakai **ongkir dasar** (setara ADDR-01), harga net; kartu memakai menu andalan (★) |

Angka acuan: Contoh A `Rp50.000`, Contoh B `Rp47.000` (proyeksi `Rp59.000`, 118%, EXCEEDED), Contoh C `Rp28.500` (proyeksi `Rp40.500`, 81%, WARN). Profil default Wira: budget `Rp50.000`, pengeluaran `Rp12.000`, alamat ADDR-01, filter nonaktif, urutan `default`, Cart kosong.

**Invarian state `I-1..I-10`** (INTERACTION-SPEC 4.1) wajib terjaga oleh reducer, di antaranya: Cart kosong ⇔ `restaurantId === null` dan ADDR-01 dan voucher `null`; tidak ada pencampuran restoran; paling banyak satu overlay aktif; `pendingPriceChange !== null` ⇔ overlay `PRICE_CHANGE_NOTICE`; `pendingAddItem !== null` ⇔ overlay `CONFIRM_REPLACE_CART`; `budgetFilterOn` mengharuskan `budget !== null`; `delta === 0` setelah pembayaran; `spentToday` hanya bertambah sebesar tepat `receipt.paidAmount`.

### 1.5 Keputusan Perilaku Terkunci (Sering Salah, Jangan Diubah)

1. Baris diskon yang tidak aktif **tetap tampil** sebagai `−Rp0` (UX-SPEC C-2, A9). Urutan baris rincian sama di Cart, Checkout, dan Struk.
2. Label baris pertama rincian dan bar keranjang Menu adalah **"Subtotal item"** (bukan "Subtotal" atau "Total").
3. Cart yang seluruh itemnya sudah termasuk pajak: baris pajak `Rp0` dengan keterangan "Semua item sudah termasuk pajak".
4. Voucher makanan kedua **mengganti otomatis** tanpa dialog, dengan banner inline `role="status"` berisi "{Voucher lama} diganti {Voucher baru}." (UX-SPEC C-5, A6).
5. Voucher yang tidak lagi eligible **dilepas otomatis** dengan pemberitahuan inline (nama voucher dan alasan). Voucher tidak eligible tidak pernah mengurangi total.
6. V-F03 hanya muncul pada Cart R-05.
7. `budget === null`: header menampilkan "Atur budget"; badge **tidak dirender**; toggle "Sesuai Budget Saya" tetap tampil tetapi `aria-disabled` dengan teks bantu "Atur budget untuk memakai filter ini"; Budget Tracker diganti ajakan "Atur budget"; pembayaran berjalan tanpa dialog EXCEEDED. Tidak ada aksi UI untuk menghapus budget.
8. Header saat `spentToday > budget`: "Budget terlampaui Rp{n}" (tidak pernah angka negatif).
9. Dialog EXCEEDED: fokus awal `[Ubah pesanan]` (**tidak pernah** `[Lanjutkan tetap]`); urutan aksi "Ubah pesanan", "Lihat yang sesuai budget", "Lanjutkan tetap"; menutup tanpa aksi **tidak** membayar; tidak muncul untuk OK atau WARN (termasuk tepat 100%).
10. Perubahan alamat ke alamat yang **sama** menutup panel tanpa pemberitahuan. Alamat berbeda memicu kalkulasi ulang dan dialog "Total pesananmu berubah" (sebelum, sesudah, selisih, penyebab per komponen, perubahan status budget bila ada). `Escape` dan tombol tutup pada dialog ini setara `[Mengerti]`.
11. Tombol bayar memuat angka ("Bayar Rp47.000") dan tidak dapat ditekan saat dialog perubahan total terbuka. Idempotensi `receiptId` mencegah pembayaran ganda.
12. Setelah pembayaran berhasil: `spentToday += total`, Cart dikosongkan, alamat kembali ADDR-01. Jika dilanjutkan dari EXCEEDED, Struk wajib menampilkan "Pesanan ini melebihi budget Rp{n}."
13. **Penjaga rute:** `/checkout` dengan Cart kosong → `/keranjang`; `/struk` dengan `lastReceipt === null` → `/`; `/restoran/:id` dengan ID tak dikenal → `/`; semuanya `replace: true`.
14. Thumbnail restoran dan item adalah `div` gradien Tailwind + satu emoji (`aria-hidden="true"`), tanpa gambar.
15. Hanya tema terang. Teks disclaimer UI: "Prototype akademik. Tidak berafiliasi dengan platform pesan-antar mana pun. Seluruh data bersifat fiktif." (tanpa nama merek).

---

## 2. Aturan Larangan Keras (Hard Prohibitions)

Pelanggaran terhadap aturan berikut **tidak dapat dinegosiasikan**. Jangan menyiasati dengan komentar `eslint-disable`, `@ts-ignore`, `@ts-expect-error`, cast `as any`, atau pembungkus.

### 2.1 Dilarang `Intl`, `toLocaleString`, dan `toFixed`

- **Dilarang** memakai `Intl.*`, `Number.prototype.toLocaleString`, dan `toFixed` di **seluruh** kode produksi **dan** berkas uji (`*.test.ts(x)`).
- **Wajib** memformat uang dan persen hanya lewat helper manual berbasis bilangan bulat di `src/lib/formatRupiah.ts` (`DESIGN-SYSTEM.md` 3.4): `formatRupiah`, `formatDiscount`, `formatSignedRupiah`, `formatPercent`, `barPercent`.
- Format keluaran: `Rp30.000`, `Rp0`, `Rp1.250.000`; potongan `−Rp5.000` dan selisih `+Rp3.000` / `−Rp1.000` memakai **U+2212** (bukan tanda hubung `-`); persen `81%`, `107,8%`. Tidak boleh ada `\u00A0`, `\u202F`, atau `\u2009`. Setiap hasil lolos `/^[\u2212+]?Rp\d{1,3}(\.\d{3})*$/`. Nilai non-integer melempar `RangeError`.
- Pembagian bilangan bulat hanya lewat `floorDiv` (`src/lib/intMath.ts`). Tidak ada `Math.floor` atas hasil pembagian desimal.
- Pagar otomatis **wajib** ada di `.eslintrc.cjs` dan **tidak boleh** dilonggarkan oleh `overrides` (termasuk untuk berkas uji):

```js
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 2020, sourceType: 'module', ecmaFeatures: { jsx: true } },
  plugins: ['@typescript-eslint', 'react-hooks'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:react-hooks/recommended'],
  rules: {
    'no-restricted-globals': [
      'error',
      { name: 'Intl', message: 'Gunakan formatRupiah dari src/lib/formatRupiah.ts (BR-11).' },
    ],
    'no-restricted-properties': [
      'error',
      { object: 'window', property: 'Intl', message: 'Dilarang (BR-11).' },
      { object: 'globalThis', property: 'Intl', message: 'Dilarang (BR-11).' },
      { property: 'toLocaleString', message: 'Dilarang: menyisipkan spasi non-breaking (BR-11).' },
      { property: 'toLocaleDateString', message: 'Dilarang (BR-11).' },
      { property: 'toLocaleTimeString', message: 'Dilarang (BR-11).' },
      { property: 'toFixed', message: 'Dilarang: gunakan aritmetika bilangan bulat (BR-01).' },
    ],
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-non-null-assertion': 'error',
  },
};
```

### 2.2 Dilarang `any` dan Non-Null Assertion (`!`)

- **Dilarang** `any` (eksplisit maupun implisit) dan operator `!` pada nilai (`value!`). Gunakan `unknown` + penyempitan tipe, pengecekan `=== undefined` / `=== null`, atau type guard.
- `tsc --noEmit` wajib **0 error dan 0 warning** (`DoD-01`).
- Seluruh struktur state dan domain bertipe `readonly` dan diubah hanya dengan membuat objek baru. Pencarian pada `Record` / array wajib menangani `undefined` (`noUncheckedIndexedAccess`).
- Gunakan `switch` eksaustif pada union (`type`, `kind`, `BudgetStatus`) tanpa `default` yang menelan kasus baru.

### 2.3 Dilarang Aset, Merek, dan Paket Eksternal

- **Dilarang:** URL gambar eksternal, `<img src="http...">`, CDN gambar, Google Fonts, font web apa pun, dan permintaan jaringan eksternal (Network tab wajib 0 permintaan eksternal).
- **Dilarang:** logo, nama dagang, palet khas, atau aset visual Shopee/ShopeeFood di UI, `index.html` (`<title>`, meta), `package.json` (`name`, `description`), identifier, string, dan komentar kode.
- **Dilarang:** library UI (MUI, Chakra, Shadcn, Ant Design, Headless UI, Radix, dan sejenisnya), plugin Tailwind, Tailwind v4, dan pustaka CSS-in-JS. Modal, bottom sheet, dan popover dibangun sendiri dengan HTML + utilitas Tailwind.
- **Dilarang** font eksternal: pakai tumpukan font sistem (`font-sans` pada `tailwind.config.js`).
- **Dilarang** `dark:` dan varian tema gelap. Tambahkan `<meta name="color-scheme" content="light">` di `index.html` dan atur `<html lang="id">`.

### 2.4 Dilarang Menduplikasi Rumus Kalkulasi Harga

- `calculateOrder` (`src/lib/pricing.ts`) adalah **satu-satunya** sumber angka final di Cart, Checkout, Struk, pratinjau voucher ("Total menjadi Rp{n}"), dan dialog perubahan alamat (sebelum/sesudah). Estimasi (`estimateMenuItemAllIn`, `estimateRestaurantAllIn`) juga dibangun **di atas** `calculateOrder`.
- **Dilarang** menghitung pajak, kemasan, ongkir, diskon, atau total di dalam komponen, hook, reducer, atau helper lain. Komponen hanya **menampilkan** `OrderBreakdown`.
- **Dilarang** menyimpan angka total sebagai state turunan yang terpisah dari hasil `calculateOrder`. Hitung dari `cart + alamat + voucher` setiap render (memoisasi boleh).
- `getBudgetStatus` hanya satu, di `src/lib/budget.ts`. `src/design/budgetStatus.ts` hanya mengekspor ulang. Status ditentukan dengan aritmetika bilangan bulat BR-09, **bukan** dari persentase yang ditampilkan.
- Reducer dan fungsi domain **murni**: **dilarang** `Date.now()`, `Math.random()`, akses `localStorage`, dan navigasi di dalamnya. ID dan waktu (`receiptId`, `paidAtIso`) dibuat di luar reducer lalu dikirim lewat payload action.

### 2.5 Dilarang Mengubah Microcopy dan Pesan Error

- Seluruh string antarmuka **wajib persis, karakter demi karakter**, seperti `UX-SPEC.md` (Bagian 4 dan 5.3) dan katalog `ACCEPTANCE-CRITERIA.md` Bagian 2.0.3, ditambah teks default struktural `DESIGN-SYSTEM.md` 1.6 (nama aplikasi "TPBG", `h1` per layar, skip link "Lewati ke konten utama", `aria-label` stepper dan Cart, disclaimer footer).
- **Dilarang** memparafrase, menyingkat, menerjemahkan ulang, mengganti tanda baca (titik di akhir kalimat termasuk), atau membuat "versi singkat" (khususnya `PriceNote`). **Salin** string dari dokumen; jangan menulis dari ingatan.
- String yang paling sering rusak: galat budget ("Isi budget harian dulu. Contoh: 50000." / "Budget harus bilangan bulat tanpa desimal." / "Budget minimal Rp10.000." / "Budget maksimal Rp500.000."), pola `PriceNote` ("Belum termasuk pajak 10% + kemasan Rp{n}." / "Sudah termasuk pajak. Kemasan Rp{n}." / "Est. all-in 1 porsi: Rp{n}."), label status ("Sesuai budget" / "Mepet budget" / "Melebihi budget"), "Sama dengan Keranjang · Selisih Rp0", "Selisih dari Keranjang: Rp0", "Keranjangmu kosong.", dan teks dialog reset.
- Tulis uji yang meng-assert string baku (`DoD-09`).

---

## 3. Struktur Direktori & Arsitektur Modul yang Wajib Diikuti

```
.
├─ index.html                     # lang="id", color-scheme light, skip link target
├─ .eslintrc.cjs  tailwind.config.js  postcss.config.js  tsconfig.json  vite.config.ts
├─ src/
│  ├─ main.tsx  App.tsx           # #app-root dan #overlay-root bersaudara di <body>
│  ├─ index.css                   # satu-satunya CSS kustom: @layer base (DESIGN-SYSTEM 3.6)
│  ├─ types/                      # domain.ts  pricing.ts  state.ts   (tipe murni)
│  ├─ data/                       # restaurants.ts menuItems.ts vouchers.ts addresses.ts profile.ts artwork.ts
│  ├─ lib/                        # fungsi domain murni + format Rupiah
│  │  ├─ intMath.ts  formatRupiah.ts  pricing.ts  cart.ts  budget.ts
│  │  └─ discovery.ts  priceChange.ts  voucherCopy.ts  receiptId.ts
│  ├─ state/                      # persistence.ts  reducer.ts  (+ AppStateProvider)
│  ├─ design/                     # budgetStatus.ts  cx.ts  (token kelas Tailwind utuh)
│  ├─ a11y/                       # escapeStack  backgroundLock  focusReturn  focusTrap  useModalBehavior
│  ├─ components/                 # komponen UI atomik (stateless sejauh mungkin)
│  │  └─ overlays/                # Modal/BottomSheet + tujuh overlay + ConfirmDialog
│  └─ pages/                      # Home  Search  Restaurant  Cart  Checkout  Receipt
```

**Aturan arsitektur:**

| Lapisan | Isi | Boleh mengimpor | Dilarang mengimpor |
|---|---|---|---|
| `src/types/` | tipe dan helper tipe murni | (tidak ada) | semuanya |
| `src/data/` | mock data tetap, `artwork.ts` | `types` | `lib`, `state`, React, DOM |
| `src/lib/` | fungsi domain murni, `formatRupiah` | `types`, `data` | React, DOM, `lucide-react`, `state`, `components`, `pages` |
| `src/state/` | reducer murni, sanitasi, persistensi | `types`, `data`, `lib` | `components`, `pages`, `lucide-react`; DOM hanya `localStorage` lewat antarmuka storage yang diinjeksi dan dibungkus `try/catch` |
| `src/design/` | peta kelas dan ikon status | `types`, `lib` (ekspor ulang) | `state`, `pages` |
| `src/a11y/` | utilitas fokus dan keyboard | DOM, React | `state`, `lib` harga |
| `src/components/` | UI tampilan | `types`, `lib` (format dan tampilan), `design`, `a11y`, React, `lucide-react` | logika harga sendiri, akses `localStorage` |
| `src/pages/` | rakitan rute dan pemanggil `dispatch` | semua lapisan di atas | — |

**Kewajiban modul:**

1. Mock data (`NFR-04`, `NFR-09`) terpisah dari komponen. Nilainya **persis** PRD Bagian 9 (ditambah ADDR-02 `+3000` dan ADDR-03 `+5000` dari UX-SPEC A1). Jangan menambah, menghapus, atau mengubah restoran, menu, voucher, dan tarif.
2. `src/lib/` dan `src/state/` bebas dari React, DOM, dan `lucide-react` (`AC-05.7`). Lapisan domain lulus `tsc` strict tanpa lib DOM bila memungkinkan.
3. Persistensi `localStorage["tpbg:v1"]` (`schemaVersion: 1`):
   - **Disimpan:** `budget`, `spentToday`, `addressId`, `cart`, `budgetFilterOn`, `sortMode`.
   - **Tidak disimpan (volatil):** `pendingAddItem`, `pendingPriceChange`, `lastPriceChange`, `inlineNotice`, `overlay`, `overflowMenuOpen`, `noticeSeq`, `lastReceipt`.
   - `toPersisted` menyimpan `pendingPriceChange.previousAddressId` selagi dialog perubahan total terbuka, sehingga refresh tidak pernah meninggalkan alamat berubah tanpa pemberitahuan (BR-05).
   - Sanitasi saat membaca mengikuti `S-1..S-17` (INTERACTION-SPEC 2.4.2): semua akses dalam `try/catch`; JSON rusak, `schemaVersion !== 1`, budget di luar `10000..500000` (→ `null`), `spentToday` di luar rentang (→ `12000`), alamat tak dikenal (→ ADDR-01), item lintas restoran dibuang, `qty` dijepit ke `1..99`, duplikat digabung. Aplikasi **tidak pernah** crash karena storage.
   - Simpan hanya ketika hasil `JSON.stringify(toPersisted(state))` berubah. Kuota penuh atau storage diblokir: tetap berjalan dari memori tanpa dialog galat.
4. Reducer (`appReducer`, `createInitialState`, `AppAction`): setiap action menghasilkan **satu** objek `AppState` baru tanpa keadaan antara yang dapat dirender (transisi `T1..T6`). Perubahan state lewat `patch`/objek baru, tanpa mutasi. Efek samping (navigasi, fokus, persistensi, ID, waktu) dilakukan **di luar** reducer.
5. "Reset data demo" adalah **satu** transisi `RESET_CONFIRM` yang mengganti seluruh state dengan `createInitialState()`, lalu navigasi ke `/` (`replace: true`) bila rute aktif bukan Home.

---

## 4. Aturan UI, Responsif, & Aksesibilitas (WCAG 2.1 AA)

### 4.1 Responsif Mobile-First (`NFR-01`, `DoD-05`)

- Desain mulai dari **360px satu kolom**; layar lebar hanya menata ulang, tidak menambah fungsi. Urutan DOM = urutan baca di semua lebar.
- Kontainer standar `header`/`main`/`footer`: `mx-auto w-full max-w-screen-xl px-4 md:px-6`.

| Lebar | Home/Search | Menu | Cart/Checkout | Overlay |
|---|---|---|---|---|
| `360–767px` | 1 kolom | 1 kolom | 1 kolom, bar aksi `fixed` | `sheet` = bottom sheet; `dialog` di tengah |
| `768–1023px` (`md:`) | `md:grid-cols-2` | 1 kolom | `max-w-2xl`, bar aksi `fixed` | modal terpusat |
| `1024–1440px` (`lg:`) | `lg:grid-cols-3` | `lg:grid-cols-2` | 2 kolom `lg:grid-cols-[minmax(0,1fr)_24rem]`, ringkasan `sticky` | modal terpusat |

- **Wajib** `document.documentElement.scrollWidth <= window.innerWidth` pada `360`, `768`, `1024`, `1440px` untuk **6 rute dan 7 overlay terbuka**.
- **Dilarang** `overflow-x-hidden` pada `html`/`body` untuk menyembunyikan luapan; **dilarang** `<table>` (rincian memakai `<dl>`); bar sticky memakai `fixed inset-x-0`, bukan `w-screen`.
- Anak flex/grid berisi teks: `min-w-0`; nama panjang `break-words`; nilai uang `whitespace-nowrap shrink-0 tabular-nums`; konten halaman dengan bar aksi diberi `pb-28`.

### 4.2 Aturan Ketat `PriceNote` (`FR-02.2`, `DoD-06`)

- Tepat **dua elemen blok satu baris** di dalam satu `<button type="button" aria-haspopup="dialog">` yang membuka Info Sheet:
  - Baris 1: `block truncate` (pola tetap UX-SPEC 5.3; **tidak ada versi singkat baru**).
  - Baris 2: `flex items-center justify-between gap-2` + `whitespace-nowrap`, isi `Est. all-in 1 porsi: Rp{n}.` dan ikon `Info` (`h-4 w-4 shrink-0 text-orange-700`, `aria-hidden`).
  - Kelas dasar: `block min-h-[44px] w-full rounded-lg bg-stone-100 px-2.5 py-1.5 text-left text-xs leading-4 text-stone-700` + `FOCUS`. Nama aksesibel: teks tombol + `<span className="sr-only"> Buka penjelasan komponen biaya.</span>`.
- Pada viewport **`360 × 640`**, skala huruf default, untuk **seluruh 24 item menu** (`M-101..M-604`): (1) tinggi `PriceNote` **≤ 44px** dan maksimal 2 baris; (2) Baris 1 `scrollWidth ≤ clientWidth` (tanpa elipsis); (3) teks Baris 2 sama persis dengan `"Est. all-in 1 porsi: Rp{n}."`. Wajib ada uji otomatis (Playwright atau sejenis).
- Urutan konten item menu (DOM dan baca): foto → nama → harga → status pajak → price note → kontrol kuantitas. Status pajak selalu **teks** ("Belum termasuk pajak" / "Sudah termasuk pajak"). Item berdiskon: harga asli dicoret + `sr-only` "Harga asli", estimasi memakai harga net.

### 4.3 Token Visual, Kontras, dan Tailwind

- Warna **hanya** dari palet bawaan Tailwind v3 (`orange`, `stone`, `emerald`, `amber`, `rose`) sesuai `DESIGN-SYSTEM.md` Bagian 2. Tidak ada warna kustom.
- Kontras minimum: teks normal **4.5:1**; teks besar, ikon bermakna, batas kontrol, cincin fokus, isian progress bar **3:1**.
- Larangan kontras yang sering dilanggar:
  - Teks putih di atas `orange-500`/`orange-600` **dilarang**; isian dan teks brand memakai `orange-700` (hover `orange-800`, active `orange-900`).
  - `text-stone-500` **hanya** di atas `bg-white` dan `bg-stone-50`; di atas `bg-stone-100` pakai `text-stone-600`/`700`. Tidak ada `text-stone-400` atau lebih terang untuk teks.
  - Tepi kontrol input/checkbox/radio/stepper memakai `border-stone-500`; `border-stone-400` dan lebih terang **dilarang** sebagai batas kontrol.
- Kelas Tailwind **wajib string utuh**. **Dilarang** menyusun kelas dengan interpolasi (`` `bg-${warna}-700` ``); gunakan peta objek (`BUDGET_STATUS`) dan `cx(parts)`.
- Gaya inline hanya `style={{ width: '81%' }}` pada isian progress bar. CSS kustom hanya `@layer base` di `src/index.css`.
- Cincin fokus: konstanta `FOCUS` (`focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-700 focus-visible:ring-offset-2`) pada **setiap** elemen interaktif.
- Tipografi: ukuran minimum `text-xs` (12px); dilarang `text-[10px]`/`text-[11px]`. Angka finansial memakai `tabular-nums`; input angka `text-base`. Tidak ada animasi selain `transition-colors`, dan setiap `transition-*` diikuti `motion-reduce:transition-none`.
- `h1` satu per layar (Home `sr-only` "Restoran", Search `sr-only` "Pencarian"), `h2` bagian, `h3` judul item; tanpa lompat level. Landmark: `header`, satu `main#konten` (`tabindex="-1"`), `footer`. Perbarui `document.title` sesuai `h1` pada tiap perubahan rute.

### 4.4 Status Budget Multi-Modal (`FR-05.4`, `NFR-07`)

Setiap kemunculan status (badge kartu, badge Menu, Budget Tracker, banner) **wajib** memiliki **ketiganya sekaligus**: warna, **teks label**, dan **ikon berbentuk berbeda**.

| Status | Label | Ikon `lucide-react` | Ambang |
|---|---|---|---|
| `OK` | "Sesuai budget" | `CircleCheck` | `proyeksi × 100 < budget × 80` |
| `WARN` | "Mepet budget" | `TriangleAlert` | `≥ 80%` dan `≤ 100%` (tepat 100% termasuk) |
| `EXCEEDED` | "Melebihi budget" | `CircleX` | `proyeksi > budget` |

- Budget Tracker (Cart dan Checkout): label + ikon, progress bar `role="progressbar"` (`aria-valuenow` persen, `aria-valuemin="0"`, `aria-valuemax="100"`, `aria-valuetext` "Proyeksi {n} persen dari budget, status {Label}"), garis ambang **80%** dengan label teks "80%", kalimat status baku. Bar tidak melewati kontainer; persen >100% ditulis apa adanya (`107,8%`).
- Penanda non-warna lain yang wajib: potongan `−Rp`; item berdiskon harga asli dicoret; voucher tidak eligible = teks alasan + ikon `Ban` + `aria-disabled="true"`; galat input = teks + ikon `CircleAlert` + `aria-invalid="true"`; opsi terpilih = penanda terisi + `aria-checked`; toggle aktif = ikon centang + `aria-checked`.
- Merah hanya untuk `EXCEEDED` dan galat.

### 4.5 Area Sentuh, Keyboard, dan Struktur

- Seluruh kontrol interaktif (`[–]`, `[+]`, `[i]`, tutup, `[⋮]`, toggle, opsi radio) minimal **`44 × 44 px`** (`min-h-[44px] min-w-[44px]`); tombol aksi utama `h-12`; jarak antar kontrol berdekatan `gap-2`, untuk `[–] n [+]` dan `[Hapus]` `gap-3`. Perluasan area sentuh dengan padding, bukan margin negatif.
- Navigasi antar layar = `<a>`/`Link`; aksi di halaman = `<button>`. Kartu restoran = **satu** tautan (tanpa tombol di dalamnya). Daftar restoran/menu = `ul`/`li`.
- Skip link "Lewati ke konten utama" adalah elemen fokus pertama. Perubahan rute memindahkan fokus ke `main#konten` (perubahan query pencarian tidak).
- Tidak ada bottom navigation bar. Search memakai kartu yang identik dengan Home dan membawa filter/urutan aktif.

### 4.6 Overlay: `inert`, Focus Trap, dan Tumpukan `Escape`

- Struktur DOM: `<div id="app-root">` dan `<div id="overlay-root">` bersaudara di `<body>`; overlay dirender lewat **portal** ke `#overlay-root`.
- Saat overlay terbuka: `#app-root` mendapat **`inert`** dan `aria-hidden="true"`; `<html>` mendapat kelas `modal-open`; fokus **terkunci** (`Tab`/`Shift+Tab` berputar di panel); scroll latar terkunci. Saat ditutup, semuanya dibersihkan hanya ketika penghitung kedalaman kembali 0 (`K-11`).
- Panel: `role="dialog"` (`alertdialog` untuk EXCEEDED), `aria-modal="true"`, `aria-labelledby` ke judul, `tabindex="-1"`, elemen fokus awal bertanda `data-initial-focus`. Pemicu memanggil `rememberFocusReturn` **sebelum** `dispatch`.
- Satu pendengar `keydown` global mengelola **tumpukan `Escape` (LIFO)**: hanya lapisan teratas yang menerima `Escape`, `preventDefault()` dipanggil, `event.isComposing` dan `defaultPrevented` diabaikan. Prioritas: modal > popover `[⋮]` > halaman (tidak melakukan apa pun).
- Klik backdrop = aksi `Escape` overlay tersebut.

| Overlay | Fokus awal | `Escape` / `X` / klik luar | Fokus kembali ke |
|---|---|---|---|
| Pengaturan Budget | input `#budget` | tutup tanpa menyimpan | pemicu |
| Info Sheet | tombol tutup | tutup | ikon `[i]` / tautan pemicu |
| Daftar Voucher | judul panel (`h2 tabindex="-1"`) | tutup tanpa menerapkan | slot voucher pemicu |
| Pilih Alamat | opsi alamat aktif | tutup tanpa mengubah | "Ubah alamat" |
| Ganti Keranjang | "Tetap di keranjang lama" | = "Tetap di keranjang lama" | tombol "Tambah" / stepper item |
| Perubahan Total | "Mengerti" | = "Mengerti" | "Ubah alamat" |
| Dialog EXCEEDED | "Ubah pesanan" | pembayaran **tidak** berjalan | tombol "Bayar Rp{total}" |
| Reset data demo | "Batal" | = "Batal" | `[⋮]` |

- Menu overflow `[⋮]`: `aria-haspopup="menu"`, `aria-expanded`, `aria-controls`; item `role="menuitem"` dengan roving `tabindex`; satu item "Reset data demo" (`RotateCcw`); `Escape` menutup menu dan memfokuskan `[⋮]`.

### 4.7 Live Region dan Pengumuman

| Peristiwa | Teknik |
|---|---|
| Total Cart berubah | `aria-live="polite"` pada baris total: "Total Rp{n}" |
| Status Budget Tracker berubah | `aria-live="polite"`: "{Label status}. Proyeksi {persen} persen." |
| Jumlah restoran berubah | `aria-live="polite"`: "{n} restoran" |
| Voucher dilepas/diganti | `role="status"` |
| Galat validasi | `role="alert"` (terhubung ke input lewat `aria-describedby`) |
| Perubahan total (alamat) | fokus dipindah ke dialog, bukan live region |

### 4.8 Komponen yang Wajib Ada (DESIGN-SYSTEM Bagian 5)

`Button`, `Header` (normal dan disederhanakan), `FilterSortBar` (+ `SearchField`, `Toggle`), `RestaurantCard`, `BudgetBadge`, `BudgetTracker`, `MenuItemCard`, `PriceNote`, `QuantityStepper`, `CartLineRow`, `VoucherSlot`/`VoucherPanel`, **`PriceBreakdown`**, `StickyActionBar`, `NoticeBanner`, `EmptyState`, `Modal`/`BottomSheet`, `BudgetExceededDialog`, `ConfirmDialog`, `Thumbnail`.

- `PriceBreakdown` adalah **satu** komponen yang dipakai Cart, Checkout, dan Struk (hanya-baca di Checkout dan Struk) dengan urutan baris identik: Subtotal item, Pajak restoran (10%), Biaya kemasan, Ongkos kirim, Biaya layanan, Diskon voucher makanan, Diskon voucher ongkir, **TOTAL**.
- Stepper: `[–]` pada qty 1 menghapus item; qty `1..99`; `aria-label` "Kurangi jumlah {Nama menu}" (qty 1: "Hapus {Nama menu} dari keranjang") dan "Tambah jumlah {Nama menu}".

---

## 5. Alur Kerja Eksekusi & Verifikasi Wajib (Workflow Gates)

Kerjakan **berurutan**. **Dilarang** melompat ke tahap berikutnya sebelum gerbang keluar tahap saat ini lulus.

| Tahap | Pekerjaan | Gerbang keluar (wajib lulus) |
|---|---|---|
| **1. Setup + Konfigurasi + Mock Data** | Inisialisasi Vite + React + TS; Tailwind v3 (`tailwind.config.js` tanpa plugin, `index.css` Bagian 3.6); `tsconfig.json` strict (Bagian 1.2); `.eslintrc.cjs` dengan pagar Bagian 2.1; skrip `package.json`; `index.html` (`lang="id"`, `color-scheme` light); `src/types/*`; seluruh `src/data/*` persis PRD Bagian 9 + ADDR-02/03 | `npx tsc --noEmit` dan `npm run lint` bersih; tidak ada dependensi di luar daftar 1.2 |
| **2. Domain Engine Murni + Vitest** | `intMath`, `formatRupiah`, `pricing` (`calculateOrder`, `evaluateVoucher`, `computeVoucherDiscount`, estimasi), `voucherCopy`, `budget`, `cart`, `discovery`, `priceChange`, `receiptId` + uji | **Vitest 100% hijau untuk SEMUA vektor INTERACTION-SPEC 3.10** (lihat di bawah) dan kasus uji `formatRupiah` (DESIGN-SYSTEM 3.4). **Tidak boleh mulai UI sebelum ini lulus.** |
| **3. State Reducer & Sanitizer** | `reducer.ts` (semua `AppAction`, transisi `T1..T6`, invarian `I-1..I-10`), `persistence.ts` (`toPersisted`, sanitasi `S-1..S-17`), `AppStateProvider` | Uji reducer dan persistensi 100% hijau (termasuk reset atomik, anti-double-submit `receiptId`, `pendingPriceChange` tidak bocor ke storage) |
| **4. Design System & Komponen** | `design/*`, `a11y/*`, komponen atomik Bagian 4.8, `PriceNote`, `BudgetTracker`, `Modal` | Kontras diverifikasi; uji `PriceNote` 24 item di `360 × 640`; tidak ada kelas dinamis, `dark:`, atau ukuran teks di bawah `text-xs` |
| **5. Rute & 7 Overlay** | 6 halaman + penjaga rute, 7 overlay + `ConfirmDialog`, popover `[⋮]`, koreografi fokus, live region | `TS-01..TS-08` lulus (E2E Playwright atau walkthrough terverifikasi); `K-01..K-12` lulus; nol scroll horizontal di 4 viewport |
| **6. Verifikasi Akhir** | Audit terhadap `DoD-01..DoD-12` dan 43 AC | Seluruh perintah verifikasi di bawah hijau dan semua DoD terpenuhi |

### 5.1 Vektor Uji Wajib Tahap 2 (INTERACTION-SPEC 3.10, `NFR-03`, `M-07`)

- **Pricing `P-01..P-13`** (termasuk 50.000, 60.000, 55.000, 47.000, 28.500, 38.500, 27.500, 25.000, 67.000, 52.400, 62.000 (plafon persentase), 28.000 (plafon ongkir), 90.000 (V-F03)).
- **Pembulatan pajak `BR-06`:** dasar 15→2, 14→1, 5→1, 4→0, 15.000→1.500, 30.000→3.000.
- **Alamat `A-01..A-09`**, **voucher `E-01..E-07`**, **proyeksi/status** (termasuk 39.999 OK, 40.000 WARN, 50.000 WARN, 50.001 EXCEEDED; `TS-06` budget 100.000 → semua OK), **discovery `D-01..D-08`**, **validasi budget** (`EMPTY`, `BELOW_MIN`, `ABOVE_MAX`, `NOT_INTEGER`, batas inklusif).
- **`formatRupiah`:** seluruh kasus DESIGN-SYSTEM 3.4 + regex format + tanpa karakter spasi non-breaking.
- Uji **tidak boleh** memakai `Intl`, `toLocaleString`, atau `toFixed`.

### 5.2 Perintah Verifikasi Wajib

`package.json` wajib memiliki skrip: `"lint": "eslint . --ext .ts,.tsx --max-warnings 0"`, `"test": "vitest run"`, `"build": "tsc --noEmit && vite build"`, `"dev": "vite"`.

Sebelum menyatakan tugas **selesai**, jalankan **semua** perintah berikut dan pastikan hasilnya bersih:

```bash
npx tsc --noEmit
npm run lint
npm test
npm run build
```

Aturan pelaporan:

1. Tampilkan ringkasan hasil keempat perintah. **Dilarang** menyatakan "selesai" bila ada yang gagal, dilewati, atau tidak dijalankan.
2. Jangan memperbaiki kegagalan dengan melonggarkan `tsconfig.json`, `.eslintrc.cjs`, atau menghapus/melewati uji (`it.skip`, `.only`, mengubah ekspektasi angka agar cocok dengan bug).
3. Jika sebuah uji gagal karena angka berbeda dari spesifikasi, **perbaiki kode**, bukan uji. Angka acuan berasal dari PRD dan INTERACTION-SPEC.

### 5.3 Checklist Penutupan (`DoD-01..DoD-12`)

| ID | Kriteria ringkas |
|---|---|
| DoD-01 | `tsc --noEmit` 0 error/0 warning; tanpa `any` dan `!` |
| DoD-02 | `npm run lint` 0 error; format uang hanya lewat `src/lib/formatRupiah.ts` |
| DoD-03 | Vitest domain 100% lulus (`P`, `BR-06`, `A`, `E`, proyeksi, `D`, validasi, `I-1..I-10`, `S-1..S-17`) |
| DoD-04 | `TS-01..TS-08` lulus end-to-end |
| DoD-05 | Nol scroll horizontal di `360/768/1024/1440px` pada 6 rute dan 7 overlay; target sentuh `≥ 44 × 44 px` |
| DoD-06 | `PriceNote ≤ 44px`, Baris 1 utuh, Baris 2 tidak terpotong untuk 24 item di `360 × 640` |
| DoD-07 | WCAG 2.1 AA: kontras, status multi-modal, keyboard `K-01..K-12`, focus trap + `inert`, live region |
| DoD-08 | Zero-Delta: `calculateOrder` satu-satunya sumber; perubahan alamat memunculkan dialog sebelum bayar |
| DoD-09 | Microcopy 100% sama dengan `UX-SPEC.md` + `DESIGN-SYSTEM.md` 1.6 |
| DoD-10 | `package.json` bersih; tanpa library UI, font/gambar eksternal, merek pihak ketiga; 0 permintaan eksternal |
| DoD-11 | Persistensi `tpbg:v1`, sanitasi data rusak, reset atomik |
| DoD-12 | 43 AC (`AC-01.1..AC-05.7`) terverifikasi lulus |

### 5.4 Disiplin Perubahan

1. Setiap perubahan fitur wajib ditelusuri ke ID spesifikasi (`FR`, `BR`, `AC`, `T`, `K`). Jangan menambah fitur di luar scope PRD 8.2 (tanpa multi-restoran, pembayaran nyata, rating, riwayat, push notification, pemilihan metode bayar).
2. Jangan mengubah mock data, rumus, microcopy, rute, atau daftar overlay demi kemudahan implementasi. Jika spesifikasi tampak keliru atau saling bertentangan, ikuti hierarki Bagian 1.3 dan laporkan temuan kepada pengguna.
3. Pertahankan kode yang sudah lulus gerbang. Perubahan pada `src/lib/` dan `src/state/` wajib diikuti menjalankan ulang seluruh uji domain.

*Akhir AGENTS.md. Berlaku untuk TPBG v1.0.0.*


