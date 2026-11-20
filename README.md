# ShopeeFood Transparent Pricing and Budget Guardrail (TPBG)

> **Disclaimer Akademik:** ShopeeFood Transparent Pricing and Budget Guardrail (TPBG) adalah **prototype akademik** untuk keperluan mata kuliah **Rekayasa Interaksi (Interaction Engineering)**. Proyek ini **tidak berafiliasi** dengan Shopee, ShopeeFood, maupun platform pesan-antar makanan mana pun. Seluruh data (restoran, menu, harga, ongkos kirim, voucher, alamat pengiriman, dan simulasi pembayaran) bersifat **100% fiktif (mock data)** dan tidak melibatkan backend maupun transaksi finansial nyata.

| Atribut | Keterangan |
| --- | --- |
| **Nama Proyek** | ShopeeFood Transparent Pricing and Budget Guardrail (TPBG) |
| **Repositori** | `shopeefood-transparent-pricing-budget-guardrail` |
| **Mata Kuliah** | Rekayasa Interaksi (Interaction Engineering) |
| **Penulis** | Muhammad Arifin (NIM: `202310370311054`) |
| **Program Studi** | Teknik Informatika, Universitas Muhammadiyah Malang |
| **Versi Baseline** | `1.0.0` (20 November 2026) |

---

## 1. Latar Belakang & Pilar Solusi

Pada layanan pesan-antar makanan daring, pengguna sering mengalami *drip pricing* (kejutan lonjakan biaya pajak, kemasan, layanan, dan ongkos kirim yang baru terlihat di akhir proses pemesanan) serta kesulitan mengendalikan pengeluaran makan harian (*daily overspending*).

**TPBG** merancang ulang alur interaksi pemesanan makanan melalui **5 pilar utama**:

1. **Estimasi All-In Sejak Awal (`Est.`):** Setiap kartu restoran di Home/Search dan setiap item menu menampilkan estimasi total biaya 1 porsi (`Est. all-in`) yang sudah memperhitungkan status pajak eksplisit (`Belum termasuk pajak` vs `Sudah termasuk pajak`), biaya kemasan, ongkos kirim dasar, dan biaya layanan.
2. **Invarian Zero-Delta (`Selisih Rp0`):** Keranjang (Cart), Checkout, dan Struk menggunakan **satu mesin kalkulasi bilangan bulat tunggal** (`calculateOrder`) sehingga total harga di Keranjang selalu identik dengan jumlah yang dibayar pada Struk (`Delta = Rp0`).
3. **Multi-Voucher Engine Deterministik:** Mendukung kombinasi maksimal **1 voucher makanan + 1 voucher ongkir** secara bersamaan, lengkap dengan penggantian otomatis voucher makanan kedua, pelepasan otomatis saat subtotal turun di bawah syarat minimum belanja, serta penjelasan alasan pada voucher yang belum memenuhi syarat.
4. **Budget Guardrail Real-Time & Proaktif:** Memantau proyeksi pengeluaran harian (`pengeluaran hari ini + pesanan saat ini`) dalam 3 status multi-modal (warna, ikon, dan teks label):
* **`Sesuai budget` (`OK`):** proyeksi `< 80%` dari budget harian.
* **`Mepet budget` (`WARN`):** proyeksi `80%` sampai `100%` (inklusif) dari budget harian.
* **`Melebihi budget` (`EXCEEDED`):** proyeksi `> 100%`, memicu dialog konfirmasi proaktif sebelum pembayaran dengan opsi *Ubah pesanan*, *Lihat yang sesuai budget*, atau *Lanjutkan tetap*.


5. **Pemberitahuan Transparan Perubahan Pasca-Keranjang (`BR-05`):** Setiap perubahan alamat pengiriman di Checkout yang memengaruhi ongkos kirim dan total akhir wajib diumumkan melalui dialog perbandingan (*Sebelum*, *Sesudah*, *Selisih*, dan *Penyebab per komponen*) sebelum pembayaran dapat dilanjutkan.

---

## 2. Tech Stack & Arsitektur Direktori

### Tech Stack

* **Framework & Build:** React + Vite + TypeScript (`strict: true`)
* **Routing:** `react-router-dom` v6
* **Styling & Ikon:** Tailwind CSS v3 + `lucide-react`
* **Testing & Linting:** Vitest + ESLint 8 (`no-restricted-globals` untuk melarang `Intl`, `toLocaleString`, dan `toFixed` demi determinisme bilangan bulat Rupiah)
* **Aksesibilitas:** Standar WCAG 2.1 Level AA (kontras warna terverifikasi, fokus terperangkap pada modal dengan atribut `inert` pada latar, tumpukan `Escape` LIFO, dan `aria-live` region)

### Struktur Direktori

```text
.
├─ PRD.md                     # Spesifikasi Kebutuhan Produk (FR, NFR, BR, Rumus, Mock Data)
├─ UX-SPEC.md                 # Arsitektur Informasi, 6 Rute, 7 Overlay, Katalog Microcopy
├─ DESIGN-SYSTEM.md           # Token Warna WCAG AA, Tipografi, Grid Responsif, Komponen
├─ INTERACTION-SPEC.md        # State Machine, Reducer, Persistensi, Vektor Uji, Keyboard
├─ ACCEPTANCE-CRITERIA.md     # 43 Kriteria Penerimaan, DoD-01..12, Panduan TS-01..08, Matriks
├─ AGENTS.md                  # Kontrak & Aturan Pengembangan untuk AI Coding Assistant
├─ README.md                  # Dokumentasi Utama Repositori
└─ src/
   ├─ types/                  # Definisi tipe domain, kalkulasi, dan state (strict)
   ├─ data/                   # Mock data lokal (6 restoran, 24 menu, 5 voucher, 3 alamat)
   ├─ lib/                    # Mesin kalkulasi murni (pricing, budget, formatRupiah, discovery)
   ├─ state/                  # Reducer atomik, sanitasi & persistensi localStorage["tpbg:v1"]
   ├─ design/                 # Pemetaan token kelas Tailwind dan status budget
   ├─ a11y/                   # Utilitas aksesibilitas (focusTrap, focusReturn, escapeStack, inert)
   ├─ components/             # Komponen UI atomik & 7 overlay modal + ConfirmDialog
   └─ pages/                  # 6 halaman rute (/, /cari, /restoran/:id, /keranjang, /checkout, /struk)

```

### Daftar Rute Aplikasi

| Rute | Halaman | Deskripsi |
| --- | --- | --- |
| `/` | **Home** | Ringkasan sisa budget di header, pencarian, filter *"Sesuai Budget Saya"*, urutan *"Termurah (all-in)"*, dan daftar 6 restoran. |
| `/cari?q=` | **Search** | Pencarian restoran berdasarkan nama atau kategori dengan mempertahankan filter & urutan aktif. |
| `/restoran/:id` | **Menu Restoran** | Daftar menu lengkap dengan label status pajak, `PriceNote` ringkas 2 baris, dan stepper kuantitas. |
| `/keranjang` | **Cart** | Titik kalkulasi otoritatif: daftar item, slot multi-voucher, `PriceBreakdown`, dan `BudgetTracker`. |
| `/checkout` | **Checkout** | Ringkasan pesanan Zero-Delta (`Selisih Rp0`), pemilih alamat pengiriman, `BudgetTracker`, dan aksi bayar simulasi. |
| `/struk` | **Struk Payment** | Bukti pembayaran simulasi beserta pembaruan pengeluaran hari ini dan sisa budget. |

---

## 3. Cara Menjalankan & Perintah Verifikasi

Pastikan Node.js (v18+) dan npm sudah terpasang di sistem Anda.

```bash
# 1. Instal dependensi proyek
npm install

# 2. Jalankan server pengembangan lokal
npm run dev

```

### Perintah Verifikasi Kualitas (Quality Gates)

Seluruh perintah berikut wajib lulus dengan **0 error** sebelum rilis dinyatakan selesai (`DoD-01` s.d. `DoD-03`):

```bash
# Pemeriksaan tipe TypeScript strict mode
npx tsc --noEmit

# Pemeriksaan aturan ESLint (termasuk pagar larangan Intl, toLocaleString, toFixed)
npm run lint

# Eksekusi unit test domain engine & reducer (Vitest)
npm test

# Build produksi
npm run build

```

---

## 4. Panduan Demo & Skenario Pengujian (`TS-01` s.d. `TS-08`)

### Profil Default Demo (Wira)

Secara bawaan, aplikasi memuat profil mahasiswa bernama **Wira** dengan konfigurasi berikut:

* **Budget makan harian:** `Rp50.000`
* **Pengeluaran hari ini:** `Rp12.000` (sisa budget awal di header: `Sisa budget: Rp38.000`)
* **Alamat default (`ADDR-01`):** `Kos dekat kampus, Malang (data fiktif)` (`+Rp0`)

Untuk mengembalikan seluruh data ke kondisi awal kapan saja, tekan tombol menu overflow **`[⋮]`** di pojok kanan atas header lalu pilih **`Reset data demo`**.

### Ringkasan 8 Skenario Uji End-to-End

Detail langkah dan asersi lengkap tersedia di **`ACCEPTANCE-CRITERIA.md` Section 3**:

| ID | Nama Skenario | Fokus Verifikasi |
| --- | --- | --- |
| **TS-01** | Worked Example & Batas `WARN` 100% | Konsistensi `Est. Rp50.000` (`R-01` + `M-101`) hingga Struk, serta pembuktian proyeksi tepat `100%` (`spentToday = Rp0`) berstatus `WARN` tanpa dialog `EXCEEDED`. |
| **TS-02** | Cart `R-01` `EXCEEDED` & Dialog Guardrail | Kombinasi `V-F01` + `V-D01` (`TOTAL = Rp47.000`, proyeksi `118%`), dialog `EXCEEDED` sebelum bayar, serta ketiga aksinya (*Ubah pesanan*, *Lihat yang sesuai budget*, *Lanjutkan tetap*). |
| **TS-03** | Cart `R-02` Batas `WARN` (81%) | Item berdiskon (`M-201` net `Rp15.000`), kombinasi `V-F01` + `V-D02` (`TOTAL = Rp28.500`, proyeksi `81%`), dan pembayaran normal hingga sisa budget `Rp9.500`. |
| **TS-04** | Pelepasan Otomatis Voucher | Penghapusan item menurunkan subtotal di bawah minimum `V-F01` (`Rp25.000`) sehingga `V-F01` dilepas otomatis dengan banner pemberitahuan sementara `V-D02` tetap aktif. |
| **TS-05** | Cart `R-03` Pajak Inklusif (`Pajak Rp0`) | Seluruh item bertanda *"Sudah termasuk pajak"* menghasilkan baris `Pajak restoran (10%) = Rp0` dengan keterangan *"Semua item sudah termasuk pajak"* dan status `OK` (`74%`). |
| **TS-06** | Ubah Budget ke `Rp100.000` | Validasi input budget (`Rp10.000`–`Rp500.000`) dan kalibrasi ulang seketika seluruh badge restoran menjadi *"Sesuai budget"* tanpa reload. |
| **TS-07** | Perubahan Alamat di Checkout (`BR-05`) | Penggantian alamat ke `ADDR-02` (`+Rp3.000`) memunculkan dialog *"Total pesananmu berubah"* sebelum bayar dan menyinkronkan total Cart (`Delta = Rp0`). |
| **TS-08** | Keadaan Budget Belum Diatur (`budget: null`) | Penyembunyian badge budget, penonaktifan filter dengan teks bantu, penggantian `BudgetTracker` dengan ajakan atur budget, dan pembayaran tanpa dialog `EXCEEDED`. |

### Fixture JSON untuk Pengujian State Khusus

Untuk menguji `TS-01` Bagian B (`spentToday = 0`) atau `TS-08` (`budget = null`), tanam JSON berikut ke `localStorage["tpbg:v1"]` melalui DevTools Console sebelum me-refresh halaman:

```js
// FIXTURE-SPENT-0 (untuk TS-01 Bagian B)
localStorage.setItem('tpbg:v1', JSON.stringify({
  schemaVersion: 1, budget: 50000, spentToday: 0, addressId: 'ADDR-01',
  cart: { restaurantId: null, lines: [], foodVoucherId: null, deliveryVoucherId: null },
  budgetFilterOn: false, sortMode: 'default'
}));

// FIXTURE-BUDGET-NULL (untuk TS-08)
localStorage.setItem('tpbg:v1', JSON.stringify({
  schemaVersion: 1, budget: null, spentToday: 12000, addressId: 'ADDR-01',
  cart: { restaurantId: null, lines: [], foodVoucherId: null, deliveryVoucherId: null },
  budgetFilterOn: false, sortMode: 'default'
}));

```

---

## 5. Peta Dokumentasi Spesifikasi

Seluruh dokumen spesifikasi di repositori ini mengikuti hierarki otoritas mutlak dari atas ke bawah:

1. **[`PRD.md`](./PRD.md)** — Kebutuhan fungsional (`FR-01`–`FR-05`), non-fungsional (`NFR-01`–`NFR-10`), aturan bisnis (`BR-01`–`BR-11`), rumus kalkulasi, dan mock data.
2. **[`UX-SPEC.md`](./UX-SPEC.md)** — Arsitektur layar (6 rute & 7 overlay), alur interaksi pengguna, katalog microcopy baku, dan struktur aksesibilitas.
3. **[`DESIGN-SYSTEM.md`](./DESIGN-SYSTEM.md)** — Palet warna kontras WCAG 2.1 AA, tipografi, aturan responsif `360px`–`1440px`, kelas Tailwind CSS v3, dan aturan `PriceNote` 2 baris.
4. **[`INTERACTION-SPEC.md`](./INTERACTION-SPEC.md)** — Kontrak TypeScript `strict: true`, fungsi domain murni, tabel transisi reducer, vektor uji deterministik, dan koreografi keyboard.
5. **[`ACCEPTANCE-CRITERIA.md`](./ACCEPTANCE-CRITERIA.md)** — 43 kriteria penerimaan (*Given/When/Then*), `DoD-01`–`DoD-12`, panduan eksekusi `TS-01`–`TS-08`, dan *Traceability Matrix*.
6. **[`AGENTS.md`](./AGENTS.md)** — Kontrak teknis, larangan keras (*hard prohibitions*), dan gerbang verifikasi bertahap bagi AI *coding assistant*.
