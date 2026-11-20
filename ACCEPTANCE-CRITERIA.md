# Acceptance Criteria (ACCEPTANCE-CRITERIA)

# ShopeeFood Transparent Pricing and Budget Guardrail (TPBG)

---

| Atribut | Keterangan |
|---|---|
| **Project Title** | ShopeeFood Transparent Pricing and Budget Guardrail (TPBG) |
| **Nama Dokumen** | `ACCEPTANCE-CRITERIA.md` |
| **Mata Kuliah** | Rekayasa Interaksi (Interaction Engineering) |
| **Document Version** | 1.0.0 |
| **Status Dokumen** | Final Baseline untuk Verifikasi dan Validasi Prototype |
| **Tanggal** | 20 November 2026 |

> **Disclaimer:** ShopeeFood Transparent Pricing and Budget Guardrail (TPBG) adalah prototype akademik yang dikembangkan untuk keperluan mata kuliah Rekayasa Interaksi (Interaction Engineering). Proyek ini **tidak berafiliasi** dengan Shopee, ShopeeFood, maupun platform pesan-antar makanan mana pun. Seluruh nama restoran, menu, harga, ongkos kirim, voucher, alamat pengiriman, dan simulasi pembayaran bersifat fiktif (mock data) dan tidak melibatkan transaksi finansial nyata.

---

## Daftar Isi

- **Section 1: Metadata Dokumen dan Definition of Done (DoD) Global**
  - 1.1 Metadata Dokumen
  - 1.2 Disclaimer
  - 1.3 Hierarki Otoritas Dokumen, Konvensi Penomoran, dan Catatan Keselarasan
  - 1.4 Definition of Done (DoD) Global
  - 1.5 Riwayat Revisi
- **Section 2: Matriks Kriteria Penerimaan Fungsional dan Non-Fungsional (Given / When / Then)**
  - 2.0 Konvensi, Nilai Acuan, dan Katalog Microcopy Baku
    - 2.0.1 Profil Default Wira dan Nilai Acuan Mock Data
    - 2.0.2 Rumus Bilangan Bulat (`BR-01` s.d. `BR-11`), Ambang Status Budget, dan Perilaku `budget: null`
    - 2.0.3 Katalog Microcopy Baku (`UX-SPEC.md`)
  - 2.1 Epic 1: Manajemen Budget dan Discovery (`FR-01`) — `AC-01.1` s.d. `AC-01.8`
  - 2.2 Epic 2: Transparansi Harga Menu dan Restoran (`FR-02` dan `FR-05`) — `AC-02.1` s.d. `AC-02.7`
  - 2.3 Epic 3: Keranjang dan Multi-Voucher Engine (`FR-03`) — `AC-03.1` s.d. `AC-03.8`
  - 2.4 Epic 4: Checkout Zero-Delta, Perubahan Alamat, dan Budget Guardrail (`FR-04`) — `AC-04.1` s.d. `AC-04.13`
  - 2.5 Epic 5: Non-Fungsional, Aksesibilitas, dan Ketahanan State (`NFR-01` s.d. `NFR-10`) — `AC-05.1` s.d. `AC-05.7`
- **Section 3: Panduan Eksekusi Skenario Uji End-to-End (`TS-01` s.d. `TS-08`)**
  - 3.0 Konvensi Eksekusi & Fixture JSON (`localStorage["tpbg:v1"]`)
  - 3.1 `TS-01`: Worked Example dan Batas Atas Status `WARN` (Tepat 100%)
  - 3.2 `TS-02`: Cart R-01 Melebihi Budget (`EXCEEDED`) dan Dialog Guardrail Proaktif
  - 3.3 `TS-03`: Cart R-02 di Batas `WARN` (81%) dan Jalur Pembayaran Normal
  - 3.4 `TS-04`: Pelepasan Otomatis Voucher Saat Subtotal Turun di Bawah Minimum Belanja
  - 3.5 `TS-05`: Cart R-03 dengan Seluruh Item Sudah Termasuk Pajak (`Pajak Rp0`, Status `OK`)
  - 3.6 `TS-06`: Perubahan Budget Menjadi `Rp100.000` dan Kalibrasi Ulang Badge serta Filter
  - 3.7 `TS-07`: Perubahan Alamat di Checkout, Pemberitahuan Transparan, dan Invarian Zero-Delta
  - 3.8 `TS-08`: Keadaan Budget Belum Diatur (`budget: null`)
- **Section 4: Traceability Matrix (Matriks Ketertelusuran)**
  - 4.1 Kebutuhan → Acceptance Criteria → Skenario Uji → Kode Transisi / Vektor Uji
  - 4.2 Acceptance Criteria → Kebutuhan, Skenario Uji, dan Kode
  - 4.3 Skenario Uji → Acceptance Criteria, Kebutuhan, dan Kode
  - 4.4 Konkordansi AC `PRD.md` Section 7 ↔ AC Dokumen Ini

---

## Section 1: Metadata Dokumen dan Definition of Done (DoD) Global

### 1.1 Metadata Dokumen

| Atribut | Keterangan |
|---|---|
| **Project Title** | ShopeeFood Transparent Pricing and Budget Guardrail (TPBG) |
| **Nama Dokumen** | `ACCEPTANCE-CRITERIA.md` |
| **Mata Kuliah** | Rekayasa Interaksi (Interaction Engineering) |
| **Author** | Muhammad Arifin |
| **NIM** | 202310370311054 |
| **Institusi** | Teknik Informatika, Universitas Muhammadiyah Malang |
| **Document Version** | 1.0.0 |
| **Status Dokumen** | Final Baseline untuk Verifikasi dan Validasi Prototype |
| **Tanggal** | 20 November 2026 |
| **Tech Stack Target** | React, Vite, Tailwind CSS v3, `lucide-react`, TypeScript strict mode, local mock data |
| **Dokumen Acuan** | `PRD.md` (v1.0.0), `UX-SPEC.md` (v1.0.0), `DESIGN-SYSTEM.md` (v1.0.0), `INTERACTION-SPEC.md` (v1.0.0) |

### 1.2 Disclaimer

TPBG adalah aplikasi web responsif berbentuk prototype akademik untuk mengevaluasi desain interaksi transparansi harga dan pengaman budget harian pada skenario pemesanan makanan daring. Prototype ini tidak terhubung ke backend, gateway pembayaran, layanan peta/geolokasi, maupun sistem Shopee atau ShopeeFood. Seluruh data restoran, menu, tarif ongkir, pajak, voucher, alamat, dan bukti pembayaran merupakan data fiktif yang disusun khusus untuk pengujian fungsional, non-fungsional, dan usability testing.

### 1.3 Hierarki Otoritas Dokumen, Konvensi Penomoran, dan Catatan Keselarasan

#### A. Hierarki Otoritas Mutlak

Apabila ditemukan perbedaan penafsiran antar dokumen spesifikasi proyek, resolusi wajib mengikuti urutan otoritas mutlak berikut dari kiri (tertinggi) ke kanan:

```
PRD.md  ->  UX-SPEC.md  ->  DESIGN-SYSTEM.md  ->  INTERACTION-SPEC.md  ->  ACCEPTANCE-CRITERIA.md
```

- **`PRD.md`** mengunci seluruh kebutuhan fungsional (`FR-01` s.d. `FR-05`), kebutuhan non-fungsional (`NFR-01` s.d. `NFR-10`), aturan bisnis (`BR-01` s.d. `BR-11`), rumus kalkulasi harga (Section 6.2), mock data dasar (Section 9), dan skenario uji (`TS-01` s.d. `TS-08`).
- **`UX-SPEC.md`** mengunci arsitektur informasi (6 rute dan 7 overlay modal), alur pengguna (`F-1` s.d. `F-6`), struktur komponen, katalog microcopy baku (Section 5.3), aturan aksesibilitas struktural (Section 5.5), serta asumsi desain (`A1` s.d. `A12`).
- **`DESIGN-SYSTEM.md`** mengunci palet warna kontras WCAG 2.1 AA, skala tipografi, tata letak responsif `360px`–`1440px`, kelas Tailwind CSS v3, komponen placeholder art lokal (gradien CSS + emoji), aturan dua baris `PriceNote`, dan fungsi format Rupiah manual.
- **`INTERACTION-SPEC.md`** mengunci skema state TypeScript `strict: true`, persistensi `localStorage["tpbg:v1"]`, kontrak mesin kalkulasi tunggal `calculateOrder`, tabel transisi atomik reducer (`T1` s.d. `T6`), vektor uji deterministik, serta koreografi fokus dan keyboard (`K-01` s.d. `K-12`).
- **`ACCEPTANCE-CRITERIA.md`** mengonsolidasikan keempat dokumen sumber ke dalam 43 kriteria penerimaan terukur (`AC-01.1` s.d. `AC-05.7`), panduan eksekusi 8 skenario end-to-end (`TS-01` s.d. `TS-08`), dan matriks ketertelusuran penuh tanpa mengubah aturan bisnis maupun microcopy sumber.

#### B. Konvensi Penomoran dan Alias Dokumen

1. **Alias Dokumen PRD:** Rujukan `PRD_2.md` yang tercantum pada header `DESIGN-SYSTEM.md` dan `INTERACTION-SPEC.md` merujuk pada dokumen spesifikasi kebutuhan yang sama dengan `PRD.md` (PRD TPBG v1.0.0) dan diperlakukan sebagai alias identik.
2. **Pembedaan ID Kriteria Penerimaan:**
   - ID berformat **`AC-xx.y`** (tanpa awalan `PRD`) merujuk pada **43 kriteria penerimaan** di dalam dokumen `ACCEPTANCE-CRITERIA.md` ini (`AC-01.1` s.d. `AC-01.8`, `AC-02.1` s.d. `AC-02.7`, `AC-03.1` s.d. `AC-03.8`, `AC-04.1` s.d. `AC-04.13`, dan `AC-05.1` s.d. `AC-05.7`).
   - ID berformat **`PRD AC-xx.y`** merujuk pada **40 kriteria penerimaan awal** pada `PRD.md` Section 7 (`PRD AC-01.1` s.d. `PRD AC-05.7`). Pemetaan satu-ke-satu antara keduanya disajikan pada Section 4.4.

#### C. Catatan Keselarasan Antar Dokumen Sumber

1. **Penggantian Otomatis Voucher Makanan dengan Banner Inline:** `PRD AC-03.4` mengizinkan penggantian langsung maupun dialog konfirmasi saat pengguna memasang voucher makanan kedua. Sesuai `UX-SPEC.md` aturan `C-5`, Section 5.3, dan `INTERACTION-SPEC.md` transisi `T2-B`, prototype menerapkan **penggantian otomatis langsung** tanpa dialog modal, disertai banner inline `role="status"` dengan teks eksak `"{Voucher lama} diganti {Voucher baru}."`.
2. **Perlakuan Cart Kosong:** Sesuai `UX-SPEC.md` aturan `C-8` dan `DESIGN-SYSTEM.md` Section 5.13 & 5.15, ketika Cart kosong, layar `/keranjang` menampilkan `EmptyState` `"Keranjangmu kosong."` dengan tautan `"[Lihat restoran]"`, menyembunyikan panel `PriceBreakdown` serta `BudgetTracker`, dan menjaga tombol `"[Lanjut ke Checkout]"` dalam keadaan nonaktif. Akses langsung ke `/checkout` saat Cart kosong dialihkan ke `/keranjang` (`INTERACTION-SPEC.md` Section 4.1).
3. **Penggunaan Alamat `ADDR-02` dan `ADDR-03`:** Melengkapi `ADDR-01` (`+Rp0`) pada `PRD.md` Section 9.1, `UX-SPEC.md` Section 4.5.1 (Asumsi `A1`) dan `INTERACTION-SPEC.md` Section 2.1 menetapkan `ADDR-02` (`"Rumah teman di Lowokwaru, Malang (data fiktif)"`, `+Rp3.000`) dan `ADDR-03` (`"Tempat kerja paruh waktu di Klojen, Malang (data fiktif)"`, `+Rp5.000`). Estimasi all-in sebelum Cart selalu menggunakan ongkir dasar restoran (setara `ADDR-01`).
4. **Penanaman Fixture `localStorage["tpbg:v1"]`:** Karena UI tidak menyediakan tombol untuk menghapus budget kembali ke `null` (`INTERACTION-SPEC.md` Section 2.4.3), pengujian keadaan budget belum diatur (`TS-08`, `AC-01.1`) maupun pengujian kondisi awal `spentToday: 0` (`TS-01` Bagian B, `AC-04.5`) dilakukan dengan menanam objek JSON valid pada kunci `localStorage["tpbg:v1"]` sebelum memuat ulang halaman (lihat Section 3.0).
5. **Label Konsisten `"Subtotal item"`:** Sesuai `UX-SPEC.md` aturan `M-9`, Section 4.4, dan `DESIGN-SYSTEM.md` Section 5.12 & 5.13, baris pertama rincian biaya maupun ringkasan bar keranjang di Menu Restoran menggunakan label baku `"Subtotal item"` (bukan `"Subtotal"` saja atau `"Total"`) agar tidak membingungkan pengguna dengan total akhir all-in.

### 1.4 Definition of Done (DoD) Global

Prototype TPBG dinyatakan **selesai (Done)** dan siap diserahkan untuk evaluasi akademik hanya apabila seluruh 12 kriteria `DoD-01` sampai `DoD-12` di bawah ini terpenuhi 100%:

| ID | Kriteria Definition of Done (DoD) | Metode Verifikasi | Sumber Acuan |
|---|---|---|---|
| **DoD-01** | **TypeScript Strict Mode Bersih:** Kompilasi `tsc --noEmit` dengan konfigurasi `strict: true`, `noUncheckedIndexedAccess: true`, `noImplicitOverride: true`, dan `noFallthroughCasesInSwitch: true` menghasilkan **0 error** dan **0 warning**, tanpa satu pun penggunaan `any` maupun non-null assertion (`!`). | Pemeriksaan statis (`tsc --noEmit`) dan audit kode sumber `src/**/*.ts(x)` | `INTERACTION-SPEC` 1.4 |
| **DoD-02** | **ESLint Bersih & Kepatuhan Format Integer:** Pemeriksaan `eslint` menghasilkan **0 error**, termasuk kepatuhan terhadap aturan larangan global `Intl` serta larangan properti `toLocaleString` dan `toFixed`. Seluruh pemformatan mata uang hanya melewati `src/lib/formatRupiah.ts`. | Pemeriksaan `npm run lint` dan audit `.eslintrc.cjs` | `DESIGN-SYSTEM` 3.4, `BR-01`, `BR-11` |
| **DoD-03** | **Unit Test Domain 100% Lulus:** Seluruh suite unit test (`Vitest`) pada lapisan domain murni (`formatRupiah`, `intMath`, `pricing`, `budget`, `cart`, `discovery`, `priceChange`, `persistence`, dan `reducer`) lulus **100%**, mencakup seluruh vektor `P-01`..`P-13`, pembulatan `BR-06`, alamat `A-01`..`A-09`, voucher `E-01`..`E-07`, proyeksi `E`, discovery `D-01`..`D-08`, validasi budget, dan invarian `I-1`..`I-10`. | Eksekusi `vitest run` dengan 100% test case pass | `NFR-03`, `M-07`, `INTERACTION-SPEC` 3.10 & 4.1 |
| **DoD-04** | **Seluruh 8 Skenario Uji End-to-End Lulus:** Skenario `TS-01` sampai `TS-08` berhasil dieksekusi dari awal hingga akhir (baik melalui pengujian E2E otomatis Playwright maupun walkthrough terverifikasi) dengan hasil angka Rupiah dan alur transisi yang 100% identik dengan Section 3. | Eksekusi E2E test suite (`TS-01` s.d. `TS-08`) | `PRD` 9.5, `M-01` |
| **DoD-05** | **Responsif `360px`–`1440px` Tanpa Scroll Horizontal:** Pada lebar viewport `360px`, `768px`, `1024px`, dan `1440px`, seluruh 6 rute (`/`, `/cari`, `/restoran/:id`, `/keranjang`, `/checkout`, `/struk`) dan ketujuh overlay memenuhi `document.documentElement.scrollWidth <= window.innerWidth`, serta seluruh target sentuh interaktif berukuran minimal `44 × 44 px`. | Uji tata letak lintas viewport (Playwright / DevTools) | `NFR-01`, `UX-SPEC` 4.11 & 5.5.6, `DESIGN-SYSTEM` 4.2 & 4.4 |
| **DoD-06** | **Kepatuhan `PriceNote` Dua Baris (`≤ 44px`):** Pada viewport `360 × 640 px` dengan skala huruf default, seluruh 24 item menu (`M-101` s.d. `M-604`) merender komponen `PriceNote` dengan tinggi `≤ 44px` (maksimal 2 baris), Baris 1 utuh tanpa elipsis (`scrollWidth <= clientWidth`), dan Baris 2 menampilkan `"Est. all-in 1 porsi: Rp{n}."` tanpa terpotong. | Uji DOM otomatis pada ke-24 item menu di lebar `360px` | `FR-02.2`, `DESIGN-SYSTEM` 3.3 |
| **DoD-07** | **Kepatuhan Aksesibilitas WCAG 2.1 AA:** Seluruh pasangan warna teks dan elemen UI memenuhi kontras minimum (`4.5:1` teks normal, `3:1` komponen UI & cincin fokus), setiap status budget memiliki teks label dan ikon berbentuk berbeda, seluruh alur dapat dioperasikan dengan keyboard (`K-01` s.d. `K-12`), focus trap & `inert` berfungsi pada overlay, dan live region mengumumkan perubahan dinamis. | Audit aksesibilitas otomatis + uji keyboard manual (`K-01` s.d. `K-12`) | `NFR-07`, `FR-05.4`, `UX-SPEC` 5.5, `DESIGN-SYSTEM` 2.6, `INTERACTION-SPEC` 5.12 |
| **DoD-08** | **Invarian Zero-Delta (`Delta = Rp0`) Terjaga:** `calculateOrder` menjadi satu-satunya sumber kebenaran harga sehingga total Cart, total Checkout, dan jumlah dibayar pada Struk selalu bernilai sama (`Delta = Rp0`), serta setiap perubahan alamat di Checkout memunculkan dialog pemberitahuan sebelum/sesudah/penyebab sebelum pembayaran dapat dilakukan. | Unit test & E2E verification (`TS-02`, `TS-03`, `TS-07`) | `BR-02`, `BR-03`, `BR-05`, `M-01` |
| **DoD-09** | **Kepatuhan Microcopy 100% Sesuai `UX-SPEC.md`:** Seluruh label status, pesan galat validasi budget, pola `PriceNote`, pemberitahuan voucher, pesan keadaan kosong, dialog `EXCEEDED`, dan dialog perubahan total sama persis karakter demi karakter dengan `UX-SPEC.md` (ditambah teks struktural default `DESIGN-SYSTEM.md` 1.6). | Audit string UI dan assertion teks pada pengujian otomatis | `UX-SPEC` 4 & 5, `DESIGN-SYSTEM` 1.6 & 5.17 |
| **DoD-10** | **Bebas Aset, Paket UI, dan Permintaan Jaringan Eksternal:** `package.json` hanya memuat paket inti yang diizinkan (React, Vite, Tailwind CSS v3, `lucide-react`, TypeScript, tooling uji/lint), tanpa library UI pihak ketiga, tanpa font web eksternal, tanpa URL gambar eksternal (`<img src="http...">`), dan tanpa merek dagang pihak ketiga di UI. | Audit `package.json`, Network tab (0 external requests), dan inspeksi kode | `NFR-04`, `DESIGN-SYSTEM` 1.5 & 4.5 |
| **DoD-11** | **Persistensi `localStorage["tpbg:v1"]` & Reset Atomik:** State persisten bertahan setelah reload, data korup/tidak valid disanitasi tanpa crash (`S-1` s.d. `S-17`), `pendingPriceChange` tidak membocorkan alamat baru sebelum dikonfirmasi, dan aksi `"Reset data demo"` mengembalikan seluruh state ke profil default Wira dalam satu transisi atomik. | Unit test `persistence.test.ts` dan E2E test reset/refresh | `NFR-05`, `NFR-10`, `INTERACTION-SPEC` 2.4 & 2.5 |
| **DoD-12** | **Seluruh 43 Acceptance Criteria Terverifikasi Lulus:** Seluruh kriteria penerimaan `AC-01.1` sampai `AC-05.7` pada Section 2 telah diuji dan dinyatakan lulus tanpa cacat kritis maupun mayor. | Laporan hasil pengujian matriks `AC-01.1` s.d. `AC-05.7` | Section 2 & Section 4 dokumen ini |

#### Checklist Penutupan Rilis Prototype

- [ ] `tsc --noEmit` lulus dengan 0 error (`DoD-01`).
- [ ] `npm run lint` lulus dengan 0 error (`DoD-02`).
- [ ] `vitest run` lulus 100% untuk seluruh vektor domain dan invarian (`DoD-03`).
- [ ] Skenario E2E `TS-01` sampai `TS-08` seluruhnya lulus (`DoD-04`).
- [ ] Verifikasi viewport `360px`, `768px`, `1024px`, dan `1440px` lulus tanpa scroll horizontal dan `PriceNote <= 44px` (`DoD-05`, `DoD-06`).
- [ ] Uji keyboard `K-01` sampai `K-12` dan pemeriksaan kontras WCAG 2.1 AA selesai (`DoD-07`).
- [ ] Audit Zero-Delta, microcopy baku, bebas aset/paket eksternal, serta persistensi/reset `localStorage["tpbg:v1"]` terverifikasi (`DoD-08` s.d. `DoD-11`).
- [ ] Ke-43 Acceptance Criteria (`AC-01.1` s.d. `AC-05.7`) tercentang lulus (`DoD-12`).

### 1.5 Riwayat Revisi

| Versi | Tanggal | Perubahan | Author |
|---|---|---|---|
| 1.0.0 | 20 November 2026 | Penyusunan baseline lengkap `ACCEPTANCE-CRITERIA.md` yang mengonsolidasikan `PRD.md` v1.0.0, `UX-SPEC.md` v1.0.0, `DESIGN-SYSTEM.md` v1.0.0, dan `INTERACTION-SPEC.md` v1.0.0 ke dalam 43 kriteria penerimaan terukur, panduan 8 skenario E2E, dan 4 tabel traceability matrix. | Muhammad Arifin |

---

## Section 2: Matriks Kriteria Penerimaan Fungsional dan Non-Fungsional (Given / When / Then)

### 2.0 Konvensi, Nilai Acuan, dan Katalog Microcopy Baku

#### 2.0.1 Profil Default Wira dan Nilai Acuan Mock Data

**A. Profil Default Wira (`DEFAULT_PROFILE` & `ADDRESSES`):**

| Atribut | Nilai Acuan | Keterangan |
|---|---|---|
| Nama Pengguna | `Wira` | Mahasiswa & pekerja paruh waktu (21 tahun) |
| `budget` | `50000` (`Rp50.000`) | Budget makan harian default |
| `spentToday` | `12000` (`Rp12.000`) | Pengeluaran makan sebelumnya pada hari yang sama |
| Sisa budget awal (Header) | `38000` (`Rp38.000`) | `50.000 − 12.000` |
| `ADDR-01` (Default) | `Kos dekat kampus, Malang (data fiktif)` | Selisih ongkir: `+Rp0` (`deliveryFeeDelta: 0`) |
| `ADDR-02` | `Rumah teman di Lowokwaru, Malang (data fiktif)` | Selisih ongkir: `+Rp3.000` (`deliveryFeeDelta: 3000`) |
| `ADDR-03` | `Tempat kerja paruh waktu di Klojen, Malang (data fiktif)` | Selisih ongkir: `+Rp5.000` (`deliveryFeeDelta: 5000`) |

**B. Katalog Voucher Mock (`VOUCHERS`):**

| ID | Nama Voucher | Slot | Jenis Nilai | Nilai | Batas Maksimal | Minimum Subtotal | Berlaku Untuk |
|---|---|---|---|---:|---:|---:|---|
| `V-F01` | `Hemat Makan` | `FOOD` | Nominal (`FIXED`) | `Rp5.000` | `n/a` | `Rp25.000` | Semua restoran (`null`) |
| `V-F02` | `Diskon 20% Makan` | `FOOD` | Persentase (`PERCENT`) | `20%` | `Rp8.000` | `Rp30.000` | Semua restoran (`null`) |
| `V-F03` | `Spesial Senja` | `FOOD` | Nominal (`FIXED`) | `Rp10.000` | `n/a` | `Rp40.000` | Hanya `R-05` (`Kopi & Roti Senja`) |
| `V-D01` | `Gratis Ongkir` | `DELIVERY` | Nominal (`FIXED`) | `Rp8.000` | `Rp8.000` | `Rp20.000` | Semua restoran (`null`) |
| `V-D02` | `Potongan Ongkir` | `DELIVERY` | Nominal (`FIXED`) | `Rp5.000` | `Rp5.000` | `Rp15.000` | Semua restoran (`null`) |

**C. Tabel Acuan 6 Restoran Mock (Profil Default Wira: `budget = Rp50.000`, `spentToday = Rp12.000`, `ADDR-01`):**

| ID | Nama Restoran | Kategori | Jarak | Ongkir Dasar | Layanan | Kemasan / Item | Menu Andalan (Net & Pajak) | Est. All-In (`BR-10`) | Proyeksi Budget (`BR-08`) | Persen & Status (`BR-09`) |
|---|---|---|---|---:|---:|---:|---|---:|---:|---|
| `R-01` | Ayam Bakar Pak Dhe | Ayam & Bakaran | `3,2 km` | `Rp12.000` | `Rp3.000` | `Rp2.000` | `M-101` (`Rp30.000`, Belum termasuk pajak) | `Rp50.000` | `Rp62.000` | `124%` — `EXCEEDED` (`Melebihi budget`) |
| `R-02` | Geprek Bu Rina | Ayam Geprek | `1,1 km` | `Rp6.000` | `Rp3.000` | `Rp1.000` | `M-201` (Asli `Rp17.000`, Diskon `Rp2.000`, Net `Rp15.000`, Belum termasuk pajak) | `Rp26.500` | `Rp38.500` | `77%` — `OK` (`Sesuai budget`) |
| `R-03` | Nasi Goreng Mas Joko | Nasi & Mie | `0,8 km` | `Rp4.000` | `Rp2.000` | `Rp1.000` | `M-301` (`Rp18.000`, Sudah termasuk pajak) | `Rp25.000` | `Rp37.000` | `74%` — `OK` (`Sesuai budget`) |
| `R-04` | Bakso Pak Slamet | Bakso & Mie | `2,0 km` | `Rp8.000` | `Rp3.000` | `Rp1.000` | `M-401` (`Rp15.000`, Belum termasuk pajak) | `Rp28.500` | `Rp40.500` | `81%` — `WARN` (`Mepet budget`) |
| `R-05` | Kopi & Roti Senja | Kopi & Roti | `4,5 km` | `Rp15.000` | `Rp4.000` | `Rp2.000` | `M-501` (Asli `Rp22.000`, Diskon `Rp3.000`, Net `Rp19.000`, Belum termasuk pajak) | `Rp41.900` | `Rp53.900` | `107,8%` — `EXCEEDED` (`Melebihi budget`) |
| `R-06` | Sate Ayam Madura | Sate | `2,6 km` | `Rp9.000` | `Rp3.000` | `Rp1.000` | `M-601` (`Rp20.000`, Belum termasuk pajak) | `Rp35.000` | `Rp47.000` | `94%` — `WARN` (`Mepet budget`) |

#### 2.0.2 Rumus Bilangan Bulat (`BR-01` s.d. `BR-11`), Ambang Status Budget, dan Perilaku `budget: null`

1. **Aritmetika Bilangan Bulat (`BR-01`, `BR-06`):**
   - Seluruh perhitungan uang menggunakan bilangan bulat Rupiah (`Rupiah = number` integer aman).
   - $\text{subtotal} = \sum (\text{hargaNetItem} \times \text{qty})$, di mana $\text{hargaNetItem} = \text{listPrice} - \text{discount}$.
   - $\text{dasarPajak} = \sum (\text{hargaNetItem} \times \text{qty})$ khusus untuk item bertanda `"Belum termasuk pajak"`.
   - $\text{pajak} = \lfloor (\text{dasarPajak} \times \text{tarifPersen} + 50) / 100 \rfloor$ (pembulatan *round half up* satu kali atas total dasar pajak).
   - $\text{biayaKemasan} = \left(\sum \text{qty}\right) \times \text{packagingFeePerItem}$.
   - $\text{ongkirEfektif} = \text{baseDeliveryFee} + \text{address.deliveryFeeDelta}$.
   - $\text{diskonMakanan} = \min(\text{nilaiVoucher}, \text{batasMaksimal}, \text{subtotal})$ untuk nominal, atau $\min(\lfloor (\text{subtotal} \times \text{persen}) / 100 \rfloor, \text{batasMaksimal}, \text{subtotal})$ untuk persentase (pembulatan ke bawah).
   - $\text{diskonOngkir} = \min(\text{nilaiVoucher}, \text{batasMaksimal}, \text{ongkirEfektif})$.
   - $\text{total} = \max(0, \text{subtotal} + \text{pajak} + \text{biayaKemasan} + \text{ongkirEfektif} + \text{biayaLayanan} - \text{diskonMakanan} - \text{diskonOngkir})$.
2. **Aturan Status Budget Tanpa Pembulatan Persen (`BR-08`, `BR-09`):**
   - $\text{proyeksi} = \text{spentToday} + \text{nilaiPesanan}$.
   - **`OK` (`Sesuai budget`):** $\text{proyeksi} \times 100 < \text{budget} \times 80$.
   - **`WARN` (`Mepet budget`):** $\text{proyeksi} \times 100 \ge \text{budget} \times 80$ dan $\text{proyeksi} \le \text{budget}$ (mencakup tepat $80\%$ hingga tepat $100\%$).
   - **`EXCEEDED` (`Melebihi budget`):** $\text{proyeksi} > \text{budget}$.
3. **Perilaku Saat `budget === null` (`FR-01.8`, `FR-05.5`, `UX-SPEC` H-5 & 5.1):**
   - Header menampilkan tombol `"Atur budget"`.
   - Home menampilkan banner ajakan mengatur budget; toggle `"Sesuai Budget Saya"` tetap dirender dalam status nonaktif (`aria-disabled`) dengan teks bantu `"Atur budget untuk memakai filter ini"`.
   - Kartu restoran dan Menu Restoran tetap menampilkan estimasi `"Est. Rp{n}..."` tetapi tidak merender `BudgetBadge`.
   - `BudgetTracker` pada Cart dan Checkout digantikan banner ajakan `"Atur budget"`.
   - Pembayaran di Checkout berjalan langsung tanpa dialog `EXCEEDED`.

#### 2.0.3 Katalog Microcopy Baku (`UX-SPEC.md`)

Seluruh string antarmuka di bawah ini disalin 100% persis dari `UX-SPEC.md` (serta teks default struktural `DESIGN-SYSTEM.md` 1.6) dan menjadi acuan verifikasi eksak:

| Kategori / Konteks | Teks Antarmuka Baku (Eksak) | Sumber |
|---|---|---|
| Header sisa budget (belum diatur) | `"Atur budget"` | `UX-SPEC` 2.2 |
| Header sisa budget (`sisa >= 0`) | `"Sisa budget: Rp{n}"` (contoh: `"Sisa budget: Rp38.000"`, `"Sisa budget: Rp0"`) | `UX-SPEC` 2.2 |
| Header sisa budget (`spentToday > budget`) | `"Budget terlampaui Rp{n}"` (contoh: `"Budget terlampaui Rp9.000"`) | `UX-SPEC` 2.2, A8 |
| Banner ajakan budget di Home | `"Atur budget harianmu agar kami bisa menilai restoran yang sesuai."` + tombol `"[Atur budget]"` | `UX-SPEC` 4.1 |
| Teks bantu filter budget nonaktif | `"Atur budget untuk memakai filter ini"` | `UX-SPEC` H-5 |
| Estimasi pada kartu restoran | `"Est. Rp{n}, sudah termasuk ongkir dan biaya"` | `UX-SPEC` H-3 |
| Status pajak item menu | `"Belum termasuk pajak"` / `"Sudah termasuk pajak"` | `UX-SPEC` M-1 |
| `PriceNote` Baris 1 (belum termasuk pajak) | `"Belum termasuk pajak 10% + kemasan Rp{n}."` | `UX-SPEC` 5.3 |
| `PriceNote` Baris 1 (sudah termasuk pajak) | `"Sudah termasuk pajak. Kemasan Rp{n}."` | `UX-SPEC` 5.3 |
| `PriceNote` Baris 2 | `"Est. all-in 1 porsi: Rp{n}."` | `UX-SPEC` 5.3 |
| Keterangan pajak Rp0 di rincian biaya | `"Semua item sudah termasuk pajak"` | `UX-SPEC` C-3 |
| Label status budget (`OK` / `WARN` / `EXCEEDED`) | `"Sesuai budget"` / `"Mepet budget"` / `"Melebihi budget"` | `UX-SPEC` 5.1, 5.2 |
| Kalimat status `BudgetTracker` (`OK`) | `"Pesanan ini masih aman untuk budget hari ini."` | `UX-SPEC` 5.1 |
| Kalimat status `BudgetTracker` (`WARN`) | `"Pesanan ini hampir menghabiskan budget hari ini. Sisa Rp{budget − proyeksi}."` | `UX-SPEC` 5.1 |
| Kalimat status `BudgetTracker` (`EXCEEDED`) | `"Pesanan ini melebihi budget hari ini sebesar Rp{proyeksi − budget}."` | `UX-SPEC` 5.1 |
| Galat budget: kosong | `"Isi budget harian dulu. Contoh: 50000."` | `UX-SPEC` 5.3 |
| Galat budget: desimal / non-angka | `"Budget harus bilangan bulat tanpa desimal."` | `UX-SPEC` 5.3 |
| Galat budget: kurang dari Rp10.000 | `"Budget minimal Rp10.000."` | `UX-SPEC` 5.3 |
| Galat budget: lebih dari Rp500.000 | `"Budget maksimal Rp500.000."` | `UX-SPEC` 5.3 |
| Voucher tidak eligible (minimum) | `"Kurang Rp{n} dari minimum belanja."` | `UX-SPEC` 5.3 |
| Voucher tidak eligible (restoran) | `"Hanya berlaku di {Nama restoran}."` | `UX-SPEC` 5.3 |
| Voucher otomatis dilepas | `"{Nama voucher} dilepas karena subtotal di bawah minimum Rp{n}. Total dihitung ulang."` | `UX-SPEC` 5.3 |
| Voucher diganti | `"{Voucher lama} diganti {Voucher baru}."` | `UX-SPEC` 5.3 |
| Keadaan kosong: Cart kosong | `"Keranjangmu kosong."` + tombol `"[Lihat restoran]"` | `UX-SPEC` 5.3 |
| Keadaan kosong: Filter budget 0 hasil | `"Tidak ada restoran yang sesuai budget."` + `"[Matikan filter]"` `"[Atur budget]"` | `UX-SPEC` 5.3 |
| Keadaan kosong: Pencarian 0 hasil | `"Tidak ada hasil untuk '{kata kunci}'."` + `"[Hapus kata kunci]"` | `UX-SPEC` 5.3 |
| Dialog konfirmasi reset data demo | `"Kembalikan data demo ke awal? Budget, pengeluaran, alamat, dan keranjang akan direset."` + `"[Reset]"` `"[Batal]"` | `UX-SPEC` 5.3 |
| Penanda Zero-Delta Checkout / Struk | `"Sama dengan Keranjang · Selisih Rp0"` / `"Selisih dari Keranjang: Rp0"` | `UX-SPEC` 4.5, 4.6 |
| Dialog `EXCEEDED` | Judul `"Pesanan ini melebihi budget harianmu"`; aksi: `"[Ubah pesanan]"`, `"[Lihat yang sesuai budget]"`, `"[Lanjutkan tetap]"` | `UX-SPEC` 4.9 |
| Dialog perubahan total Checkout | Judul `"Total pesananmu berubah"`; aksi: `"[Mengerti]"`, `"[Kembalikan alamat sebelumnya]"` | `UX-SPEC` 4.5.2 |
| Struk Payment (simulasi) | `"Pembayaran berhasil (simulasi)"` dan `"Tidak ada transaksi nyata."` | `UX-SPEC` 4.6 |

---

### 2.1 Epic 1: Manajemen Budget dan Discovery (`FR-01`)

#### `AC-01.1` — Keadaan Awal Budget Belum Diatur pada Home dan Header
- **Asal:** `FR-01.8`, `FR-05.5` | `PRD AC-01.1`, `PRD AC-05.7` | `INTERACTION-SPEC` `T6-E`, `D-06`, `getHeaderBudgetView`
- **Given:** Kunci `localStorage["tpbg:v1"]` menyimpan state dengan `budget: null` (`FIXTURE-BUDGET-NULL`).
- **When:** Pengguna membuka halaman Home (`/`).
- **Then:**
  1. Tombol status budget di header menampilkan teks `"Atur budget"` (bukan `"Sisa budget: ..."`).
  2. Banner ajakan tampil di bawah kolom pencarian dengan teks `"Atur budget harianmu agar kami bisa menilai restoran yang sesuai."` disertai tombol `"[Atur budget]"`.
  3. Toggle filter `"Sesuai Budget Saya"` tetap tampil dalam status nonaktif (`aria-disabled`) dengan teks bantu `"Atur budget untuk memakai filter ini"`, dan percobaan mengaktifkannya tidak menyaring daftar (`T6-E`).
  4. Seluruh 6 kartu restoran (`R-01` s.d. `R-06`) tetap menampilkan `"Est. Rp{n}, sudah termasuk ongkir dan biaya"`, sedangkan komponen `BudgetBadge` tidak dirender pada kartu mana pun.

#### `AC-01.2` — Penyimpanan Budget Harian Valid dan Pembaruan Sisa Budget di Header
- **Asal:** `FR-01.1`, `FR-01.2` | `PRD AC-01.2` | `INTERACTION-SPEC` `T6-A`, `T6-C`, `BUDGET_SAVE`
- **Given:** Pengguna membuka overlay Pengaturan Budget (`"Budget makan harian"`) dari tombol header atau tombol `"[Atur budget]"` saat `spentToday` bernilai `12000`.
- **When:** Pengguna memasukkan angka bulat valid `"50000"` pada kolom `#budget` dan menekan tombol `"[Simpan]"` (atau tombol `Enter`).
- **Then:**
  1. Overlay Pengaturan Budget menutup dan fokus kembali ke elemen pemicu.
  2. Nilai `budget = 50000` tersimpan pada state aplikasi dan `localStorage["tpbg:v1"]`.
  3. Header langsung menampilkan `"Sisa budget: Rp38.000"` (`50.000 − 12.000`).
  4. Apabila sebelumnya `budget` bernilai `null`, banner ajakan `"Atur budget"` hilang dan toggle `"Sesuai Budget Saya"` menjadi aktif.

#### `AC-01.3` — Penolakan Input Budget Tidak Valid dengan Pesan Kesalahan Terkait
- **Asal:** `FR-01.6`, `NFR-10` | `PRD AC-01.3` | `INTERACTION-SPEC` `T6-B`, `validateBudgetInput`, `BUDGET_ERROR_MESSAGES`
- **Given:** Overlay Pengaturan Budget terbuka.
- **When:** Pengguna memasukkan nilai tidak valid dan menekan `"[Simpan]"`:
  - Kasus 1: kolom kosong atau hanya spasi (`""`, `"   "`).
  - Kasus 2: mengandung titik/koma desimal atau karakter non-angka (`"50.000"`, `"50,5"`, `"5e4"`, `"-10000"`, `"abc"`).
  - Kasus 3: bilangan bulat kurang dari `Rp10.000` (`"9999"`, `"0"`).
  - Kasus 4: bilangan bulat lebih dari `Rp500.000` (`"500001"`).
- **Then:**
  1. Nilai `budget` yang lama tidak berubah dan overlay tetap terbuka.
  2. Kolom input `#budget` diberi `aria-invalid="true"`, border `border-rose-700`, dan terhubung ke elemen galat melalui `aria-describedby="budget-help budget-error"`.
  3. Pesan galat (`role="alert"`) tampil persis sesuai kasus:
     - Kasus 1: `"Isi budget harian dulu. Contoh: 50000."`
     - Kasus 2: `"Budget harus bilangan bulat tanpa desimal."`
     - Kasus 3: `"Budget minimal Rp10.000."`
     - Kasus 4: `"Budget maksimal Rp500.000."`
  4. Fokus dikembalikan ke kolom input `#budget`.

#### `AC-01.4` — Filter "Sesuai Budget Saya" Menyaring Restoran OK dan WARN (Inklusif 100%)
- **Asal:** `FR-01.3`, `BR-08`, `BR-09` | `PRD AC-01.4` | `INTERACTION-SPEC` `T6-F`, `BUDGET_FILTER_SET`, `filterAndSortRestaurants`, `D-03`
- **Given:** Profil default Wira aktif (`budget = 50000`, `spentToday = 12000`) pada halaman Home (`/`).
- **When:** Pengguna mengaktifkan toggle `"Sesuai Budget Saya"`.
- **Then:**
  1. Daftar hanya menampilkan 4 restoran dengan status `OK` atau `WARN`: `R-02` (`Est. Rp26.500`, proyeksi `Rp38.500` / `77%`, `OK`), `R-03` (`Est. Rp25.000`, proyeksi `Rp37.000` / `74%`, `OK`), `R-04` (`Est. Rp28.500`, proyeksi `Rp40.500` / `81%`, `WARN`), dan `R-06` (`Est. Rp35.000`, proyeksi `Rp47.000` / `94%`, `WARN`).
  2. Restoran berstatus `EXCEEDED` yaitu `R-01` (`Est. Rp50.000`, proyeksi `Rp62.000` / `124%`) dan `R-05` (`Est. Rp41.900`, proyeksi `Rp53.900` / `107,8%`) disembunyikan.
  3. Live region `aria-live="polite"` memperbarui jumlah hasil menjadi `"4 restoran"`.
  4. Apabila nilai `budget` diatur sedemikian rupa sehingga proyeksi restoran tepat `100%` (`proyeksi === budget`), restoran tersebut tetap tampil karena `100%` termasuk `WARN`.

#### `AC-01.5` — Pengurutan "Termurah (all-in)" Menaik Berdasarkan Estimasi All-In
- **Asal:** `FR-01.4`, `BR-10` | `PRD AC-01.5` | `INTERACTION-SPEC` `T6-F`, `SORT_SET`, `filterAndSortRestaurants`, `D-04`, `D-05`
- **Given:** Pengguna berada di halaman Home (`/`) atau Search (`/cari`) dengan daftar restoran tampil.
- **When:** Pengguna memilih opsi `"Termurah (all-in)"` pada kontrol dropdown `"Urutkan:"`.
- **Then:**
  1. Saat filter `"Sesuai Budget Saya"` nonaktif, keenam restoran diurutkan menaik berdasarkan estimasi all-in: `R-03` (`Rp25.000`), `R-02` (`Rp26.500`), `R-04` (`Rp28.500`), `R-06` (`Rp35.000`), `R-05` (`Rp41.900`), `R-01` (`Rp50.000`).
  2. Saat filter `"Sesuai Budget Saya"` aktif bersama urutan `"Termurah (all-in)"`, urutan menjadi: `R-03`, `R-02`, `R-04`, `R-06`.

#### `AC-01.6` — Pencarian Kata Kunci Berdasarkan Nama atau Kategori Restoran
- **Asal:** `FR-01`, `PRD` Section 8.2 (In-Scope Discovery) | `UX-SPEC` 4.2 & 5.3 | `INTERACTION-SPEC` `filterAndSortRestaurants`, `D-07`, `D-08`
- **Given:** Pengguna berada di halaman Home (`/`) atau Search (`/cari`).
- **When:** Pengguna mengetik kata kunci pada kolom pencarian (tanpa harus menekan tombol kirim).
- **Then:**
  1. Pencarian mencocokkan substring pada `name` atau `category` restoran secara *case-insensitive* dan memangkas spasi di awal/akhir:
     - Kata kunci `"ayam"` menampilkan `R-01` (`Ayam Bakar Pak Dhe`), `R-02` (`Geprek Bu Rina` — kategori `Ayam Geprek`), dan `R-06` (`Sate Ayam Madura`).
     - Kata kunci `"  SATE "` hanya menampilkan `R-06`.
  2. Filter `"Sesuai Budget Saya"` dan mode pengurutan yang sedang aktif tetap dipertahankan antara Home dan Search.
  3. Jika tidak ada restoran yang cocok (misalnya `"martabak"`), tampil `EmptyState` `"Tidak ada hasil untuk '{kata kunci}'."` dengan tombol `"[Hapus kata kunci]"`.

#### `AC-01.7` — Persistensi Budget dan Pengeluaran Hari Ini Setelah Refresh Halaman
- **Asal:** `FR-01.7`, `NFR-05` | `PRD AC-01.7` | `INTERACTION-SPEC` `savePersistedState`, `loadPersistedState`, `STORAGE_KEY = "tpbg:v1"`
- **Given:** Pengguna telah mengatur nilai `budget` baru (misalnya `Rp100.000`) atau menyelesaikan pembayaran simulasi yang menambah `spentToday`.
- **When:** Pengguna melakukan refresh/muat ulang halaman peramban.
- **Then:**
  1. Aplikasi membaca `localStorage["tpbg:v1"]` melalui `loadPersistedState`.
  2. Nilai `budget`, `spentToday`, `addressId`, `cart`, `budgetFilterOn`, dan `sortMode` tetap bertahan sesuai kondisi sebelum refresh.

#### `AC-01.8` — Kalibrasi Ulang Badge dan Filter Seketika Saat Budget Diubah
- **Asal:** `FR-01.3`, `FR-05.3`, `NFR-02` | `PRD AC-05.4` | `INTERACTION-SPEC` `T6-C`, `BUDGET_SAVE`, `evaluateBudget`
- **Given:** Pengguna berada di Home dengan profil default Wira (`budget = 50000`, `spentToday = 12000`), di mana `R-04` & `R-06` berstatus `WARN` dan `R-01` & `R-05` berstatus `EXCEEDED`.
- **When:** Pengguna membuka Pengaturan Budget, memasukkan `"100000"`, dan menekan `"[Simpan]"`.
- **Then:**
  1. Tanpa reload halaman (`< 100 ms`), header menampilkan `"Sisa budget: Rp88.000"`.
  2. Seluruh 6 kartu restoran menghitung ulang proyeksinya terhadap budget `Rp100.000` (`R-01`: `62%`, `R-02`: `38,5%`, `R-03`: `37%`, `R-04`: `40,5%`, `R-05`: `53,9%`, `R-06`: `47%` — seluruhnya `< 80%`) sehingga semua kartu menampilkan badge `"Sesuai budget"`.
  3. Jika toggle `"Sesuai Budget Saya"` diaktifkan, seluruh 6 restoran tampil (`"6 restoran"`).

---

### 2.2 Epic 2: Transparansi Harga Menu dan Restoran (`FR-02` dan `FR-05`)

#### `AC-02.1` — Label Status Pajak Eksplisit pada Setiap Item Menu
- **Asal:** `FR-02.1`, `BR-04` | `PRD AC-02.1` | `UX-SPEC` M-1 | `DESIGN-SYSTEM` 5.7
- **Given:** Pengguna membuka halaman Menu Restoran `R-01` (`/restoran/R-01`).
- **When:** Daftar menu `R-01` ditampilkan.
- **Then:**
  1. Setiap kartu item menu menampilkan status pajak sebagai teks eksplisit (bukan ikon semata).
  2. `M-101` (`Paket Ayam Bakar Promo`), `M-102` (`Tahu Tempe Bakar`), dan `M-103` (`Nasi Putih`) menampilkan chip teks `"Belum termasuk pajak"`.
  3. `M-104` (`Es Jeruk`) menampilkan chip teks `"Sudah termasuk pajak"`.

#### `AC-02.2` — Price Note Ringkas Maksimal 2 Baris pada Semua Item Menu (`360 px`)
- **Asal:** `FR-02.2`, `NFR-01` | `PRD AC-02.2` | `UX-SPEC` M-2, M-3 & 5.3 | `DESIGN-SYSTEM` 3.3
- **Given:** Pengguna membuka halaman Menu Restoran pada viewport mobile `360 × 640 px` dengan skala huruf sistem default untuk seluruh 24 item menu (`M-101` s.d. `M-604`).
- **When:** Elemen tombol `PriceNote` di bawah status pajak setiap item dirender.
- **Then:**
  1. Tinggi elemen `PriceNote` tidak melebihi `44px` (maksimal 2 baris teks).
  2. Baris 1 menampilkan pola baku `"Belum termasuk pajak 10% + kemasan Rp{n}."` (untuk `NOT_INCLUDED`) atau `"Sudah termasuk pajak. Kemasan Rp{n}."` (untuk `INCLUDED`) dalam satu baris tanpa luapan horizontal (`scrollWidth <= clientWidth`).
  3. Baris 2 menampilkan `"Est. all-in 1 porsi: Rp{n}."` secara utuh tanpa angka terpotong.

#### `AC-02.3` — Kalkulasi Estimasi All-In 1 Porsi Item Belum Termasuk Pajak (`M-101`)
- **Asal:** `FR-02.3`, `BR-04`, `BR-06`, `BR-10` | `PRD AC-02.3` | `INTERACTION-SPEC` `estimateMenuItemAllIn`, `P-01`, `D-01`
- **Given:** Pengguna melihat item `M-101` (`Paket Ayam Bakar Promo`, harga `Rp30.000`, `NOT_INCLUDED`) pada menu `R-01` (tarif pajak `10%`, kemasan `Rp2.000`/item, ongkir `Rp12.000`, layanan `Rp3.000`).
- **When:** `estimateMenuItemAllIn(R-01, M-101)` menghitung estimasi 1 porsi tanpa voucher dengan alamat `ADDR-01`.
- **Then:**
  1. Pajak dihitung `10% × 30.000 = Rp3.000`.
  2. `PriceNote` Baris 2 menampilkan `"Est. all-in 1 porsi: Rp50.000."` (`30.000 + 3.000 + 2.000 + 12.000 + 3.000`) dengan awalan label `"Est."`.

#### `AC-02.4` — Kalkulasi Estimasi All-In 1 Porsi Item Sudah Termasuk Pajak (`M-104`)
- **Asal:** `FR-02.3`, `BR-04`, `BR-10` | `PRD AC-02.4` | `INTERACTION-SPEC` `estimateMenuItemAllIn`, `D-02`
- **Given:** Pengguna melihat item `M-104` (`Es Jeruk`, harga `Rp8.000`, `INCLUDED`) pada menu `R-01`.
- **When:** `estimateMenuItemAllIn(R-01, M-104)` menghitung estimasi 1 porsi.
- **Then:**
  1. Pajak restoran tidak ditambahkan (`pajak = Rp0`).
  2. `PriceNote` Baris 2 menampilkan `"Est. all-in 1 porsi: Rp25.000."` (`8.000 + 0 + 2.000 + 12.000 + 3.000`).

#### `AC-02.5` — Info Sheet Komponen Biaya Dapat Dibuka dan Ditutup dengan Pengembalian Fokus
- **Asal:** `FR-02.4`, `FR-02.5`, `NFR-07` | `PRD AC-02.5` | `UX-SPEC` 4.10 & M-6 | `INTERACTION-SPEC` `OVERLAY_OPEN { INFO_SHEET }`, `useModalBehavior`
- **Given:** Pengguna berada di Menu Restoran (menekan blok `PriceNote` atau tautan `"Apa saja biaya ini?"`) atau di Cart (menekan tautan `"Info"` pada Rincian Biaya).
- **When:** Pengguna membuka Info Sheet lalu menutupnya melalui tombol `"[Mengerti]"`, tombol tutup `[X]`, tombol `Escape`, atau klik backdrop.
- **Then:**
  1. Info Sheet tampil dengan judul `"Apa saja biaya pesananmu?"` dan menjelaskan seluruh komponen: `"Pajak restoran"` (`Tarif 10%, hanya untuk item bertanda "Belum termasuk pajak".`), `"Biaya kemasan"` (`Dikenakan per item.`), `"Ongkos kirim"` (`Tarif tetap sesuai restoran dan alamat.`), `"Biaya layanan"` (`Tarif tetap per pesanan.`), dan `"Tentang \"Est.\""` (`Perkiraan satu porsi sebelum voucher. Total pasti ada di Keranjang.`).
  2. Saat ditutup, fokus keyboard dan posisi gulir layar kembali persis ke elemen pemicu.

#### `AC-02.6` — Tampilan Harga Asli, Harga Net, dan Estimasi Berbasis Harga Net untuk Item Berdiskon
- **Asal:** `FR-01.5`, `FR-02.6`, `BR-10` | `PRD AC-01.6`, `PRD AC-02.6` | `UX-SPEC` H-8 & M-5 | `INTERACTION-SPEC` `getNetPrice`, `D-01`
- **Given:** Item memiliki diskon promo:
  - `M-201` (`Ayam Geprek Original` di `R-02`): `listPrice = 17000`, `discount = 2000`, `netPrice = 15000`, `NOT_INCLUDED`.
  - `M-501` (`Kopi Susu Gula Aren` di `R-05`): `listPrice = 22000`, `discount = 3000`, `netPrice = 19000`, `NOT_INCLUDED`.
- **When:** Pengguna melihat kartu restoran di Home/Search dan kartu item pada Menu Restoran `R-02` serta `R-05`.
- **Then:**
  1. Pada Menu Restoran, harga asli dicoret (`Rp17.000` pada `M-201`, `Rp22.000` pada `M-501`, disertai teks `sr-only` `"Harga asli"`) dan tampil berdampingan dengan harga net (`Rp15.000` dan `Rp19.000`).
  2. Estimasi all-in 1 porsi menghitung pajak dan total dari harga net, menghasilkan `"Est. all-in 1 porsi: Rp26.500."` untuk `M-201` (`15.000 + 1.500 + 1.000 + 6.000 + 3.000`) dan `"Est. all-in 1 porsi: Rp41.900."` untuk `M-501` (`19.000 + 1.900 + 2.000 + 15.000 + 4.000`), selaras dengan kartu restoran di Home dan Search.

#### `AC-02.7` — Kartu Preview All-In dan Badge Kecocokan Budget Non-Warna di Home dan Search
- **Asal:** `FR-05.1`, `FR-05.2`, `FR-05.3`, `FR-05.4`, `NFR-07` | `PRD AC-05.1`, `PRD AC-05.2`, `PRD AC-05.3`, `PRD AC-05.5`, `PRD AC-05.6` | `DESIGN-SYSTEM` 2.3 & 5.4
- **Given:** Profil default Wira aktif (`budget = 50000`, `spentToday = 12000`) pada halaman Home (`/`) maupun halaman Search (`/cari`).
- **When:** Kartu restoran dirender pada Home dan Search.
- **Then:**
  1. Setiap kartu menampilkan estimasi berformat eksak `"Est. Rp{n}, sudah termasuk ongkir dan biaya"`.
  2. Setiap badge menyampaikan status melalui kombinasi warna, ikon berbentuk berbeda, dan teks label eksplisit:
     - `R-03` (`Est. Rp25.000`, proyeksi `74%`) dan `R-02` (`Est. Rp26.500`, proyeksi `77%`): ikon `CircleCheck` + teks `"Sesuai budget"`.
     - `R-04` (`Est. Rp28.500`, proyeksi `81%`) dan `R-06` (`Est. Rp35.000`, proyeksi `94%`): ikon `TriangleAlert` + teks `"Mepet budget"`.
     - `R-05` (`Est. Rp41.900`, proyeksi `107,8%`) dan `R-01` (`Est. Rp50.000`, proyeksi `124%`): ikon `CircleX` + teks `"Melebihi budget"`.
  3. Struktur dan tampilan kartu restoran di halaman Search identik 100% dengan kartu di halaman Home.

---

### 2.3 Epic 3: Keranjang dan Multi-Voucher Engine (`FR-03`)

#### `AC-03.1` — Rincian Biaya Otoritatif di Cart dengan Item Campuran Pajak
- **Asal:** `FR-03.1`, `FR-03.2`, `BR-01`, `BR-02`, `BR-06` | `PRD AC-03.1` | `INTERACTION-SPEC` `calculateOrder`, `P-02` | `UX-SPEC` C-1, C-2
- **Given:** Cart berisi `M-101` (qty 1, `Rp30.000`, `NOT_INCLUDED`) dan `M-104` (qty 1, `Rp8.000`, `INCLUDED`) dari `R-01` dengan alamat `ADDR-01` dan tanpa voucher.
- **When:** Pengguna membuka halaman Cart (`/keranjang`).
- **Then:**
  1. Panel `"Rincian Biaya"` menampilkan ke-8 baris dalam urutan tetap tanpa label `"Est."`:
     - `Subtotal item`: `Rp38.000`
     - `Pajak restoran (10%)`: `Rp3.000` (dihitung hanya dari `M-101` `Rp30.000`)
     - `Biaya kemasan`: `Rp4.000` (`2 item × Rp2.000`)
     - `Ongkos kirim`: `Rp12.000`
     - `Biaya layanan`: `Rp3.000`
     - `Diskon voucher makanan`: `−Rp0`
     - `Diskon voucher ongkir`: `−Rp0`
     - `TOTAL`: `Rp60.000`

#### `AC-03.2` — Penerapan Voucher Makanan dan Kalkulasi Ulang Instan Tanpa Reload
- **Asal:** `FR-03.3`, `FR-03.4`, `BR-07`, `NFR-02` | `PRD AC-03.2` | `INTERACTION-SPEC` `T2-A`, `VOUCHER_APPLY`, `P-03`
- **Given:** Cart pada `AC-03.1` (`R-01`: `M-101` + `M-104`, subtotal `Rp38.000`, total `Rp60.000`) terbuka di `/keranjang`.
- **When:** Pengguna membuka slot `"Voucher makanan"`, memilih `V-F01` (`Hemat Makan`, nominal `Rp5.000`, min. `Rp25.000`), dan menekan tombol `"[Terapkan]"`.
- **Then:**
  1. Tanpa reload halaman (`< 100 ms`), overlay Daftar Voucher menutup.
  2. Slot voucher makanan menampilkan `"Hemat Makan"` dengan potongan `"−Rp5.000"` dan tombol `"[Lepas]"`.
  3. Baris `Diskon voucher makanan` diperbarui menjadi `−Rp5.000` dan `TOTAL` menjadi `Rp55.000` (diumumkan melalui `aria-live="polite"`).

#### `AC-03.3` — Kombinasi Multi-Voucher (1 Voucher Makanan + 1 Voucher Ongkir) dan Plafon Ongkir
- **Asal:** `FR-03.3`, `BR-07` (a)(d) | `PRD AC-03.3` | `INTERACTION-SPEC` `T2-A`, `computeVoucherDiscount`, `P-04`, `P-12`
- **Given:** Cart pada `AC-03.2` (`R-01`: `M-101` + `M-104`, subtotal `Rp38.000`, ongkir `Rp12.000`) sudah memasang `V-F01` (`−Rp5.000`).
- **When:** Pengguna membuka slot `"Voucher ongkir"`, memilih `V-D01` (`Gratis Ongkir`, nominal `Rp8.000`, maks. `Rp8.000`, min. `Rp20.000`), dan menekan `"[Terapkan]"`.
- **Then:**
  1. Kedua voucher aktif bersamaan: slot makanan berisi `V-F01` (`−Rp5.000`) dan slot ongkir berisi `V-D01` (`−Rp8.000`).
  2. Rincian biaya menampilkan `Diskon voucher makanan` = `−Rp5.000`, `Diskon voucher ongkir` = `−Rp8.000`, dan `TOTAL` = `Rp47.000`.
  3. Apabila `V-D01` (`Rp8.000`) diterapkan pada restoran dengan ongkir lebih kecil seperti `R-03` (`ongkir = Rp4.000`, vektor `P-12`), diskon ongkir dibatasi sebesar ongkir efektif (`−Rp4.000`), tidak pernah menghasilkan diskon melebihi ongkir.

#### `AC-03.4` — Penggantian Otomatis Voucher Makanan Kedua dengan Pemberitahuan Inline
- **Asal:** `FR-03.3`, `BR-07` (a) | `PRD AC-03.4` | `INTERACTION-SPEC` `T2-B`, `VOUCHER_APPLY`, `buildReplacedNotice` | `UX-SPEC` C-5 & 5.3
- **Given:** Cart `R-01` (`subtotal = Rp38.000`) sudah memiliki voucher makanan `V-F01` (`Hemat Makan`) terpasang.
- **When:** Pengguna membuka slot `"Voucher makanan"`, memilih `V-F02` (`Diskon 20% Makan`, `20%`, maks. `Rp8.000`, min. `Rp30.000`), dan menekan `"[Terapkan]"`.
- **Then:**
  1. `V-F01` otomatis digantikan oleh `V-F02` sehingga hanya ada 1 voucher makanan aktif.
  2. Diskon voucher makanan dihitung menjadi `−Rp7.600` (`20% × Rp38.000`) dan total dihitung ulang instan.
  3. Di area voucher muncul banner inline `role="status"` bertuliskan `"Hemat Makan diganti Diskon 20% Makan."`.

#### `AC-03.5` — Penampilan Voucher Tidak Eligible Beserta Alasan Eksak dan Pencegahan Pemilihan
- **Asal:** `FR-03.5`, `BR-07` (b)(e), `NFR-10` | `PRD AC-03.5` | `INTERACTION-SPEC` `T2-D`, `evaluateVoucher`, `voucherReasonMessage`, `E-01`
- **Given:** Cart `R-02` berisi `M-201` (net `Rp15.000`) dan `M-203` (`Rp5.000`) sehingga `subtotal = Rp20.000`.
- **When:** Pengguna membuka panel `"Pilih voucher makanan"`.
- **Then:**
  1. Voucher `V-F01` (`Hemat Makan`, min. `Rp25.000`) tampil pada kelompok `"VOUCHER BELUM DAPAT DIPAKAI"` dengan atribut `aria-disabled="true"` tanpa elemen `input` radio sehingga tidak dapat dipilih.
  2. Di bawah nama `V-F01` tampil alasan eksak `"Kurang Rp5.000 dari minimum belanja."`.
  3. Voucher khusus restoran lain (`V-F03` `Spesial Senja` yang hanya berlaku di `R-05`) tidak ditampilkan pada daftar voucher `R-02` (`UX-SPEC` A7).

#### `AC-03.6` — Pelepasan Otomatis Voucher Saat Subtotal Turun di Bawah Minimum Belanja
- **Asal:** `FR-03.6`, `BR-07` (b) | `PRD AC-03.6` | `INTERACTION-SPEC` `T2-F`, `reconcileVouchers`, `buildRemovedNotice`, `P-07`
- **Given:** Cart `R-02` berisi `M-201` (`Rp15.000`), `M-203` (`Rp5.000`), dan `M-204` (`Rp5.000`) dengan `subtotal = Rp25.000`, serta `V-F01` (`Hemat Makan`, min. `Rp25.000`) dan `V-D02` (`Potongan Ongkir`, min. `Rp15.000`) terpasang (`TOTAL = Rp28.500`).
- **When:** Pengguna menghapus `M-204` (`Es Teh Manis`) atau mengurangi kuantitas item sehingga subtotal turun menjadi `Rp20.000` (`< Rp25.000`).
- **Then:**
  1. Dalam satu transisi atomik, `V-F01` dilepas otomatis (`foodVoucherId = null`), sedangkan `V-D02` tetap terpasang (`20.000 >= 15.000`).
  2. Muncul banner inline `role="status"` di area voucher dengan teks eksak `"Hemat Makan dilepas karena subtotal di bawah minimum Rp25.000. Total dihitung ulang."`.
  3. Rincian biaya dan `TOTAL` langsung dihitung ulang menjadi `Rp27.500` (`20.000` subtotal + `1.500` pajak + `2.000` kemasan + `6.000` ongkir + `3.000` layanan − `0` diskon makanan − `5.000` diskon ongkir).

#### `AC-03.7` — Guardrail Keranjang Tunggal Restoran dengan Dialog Konfirmasi Penggantian
- **Asal:** `FR-03.7` | `PRD AC-03.7` | `INTERACTION-SPEC` `T1-C`, `T1-C1`, `T1-C2`, `CONFIRM_REPLACE_CART` | `UX-SPEC` M-8 & 4.8
- **Given:** Cart saat ini sudah berisi minimal 1 item dari `R-01` (`Ayam Bakar Pak Dhe`).
- **When:** Pengguna membuka halaman Menu Restoran `R-02` (`Geprek Bu Rina`) dan menekan tombol `"[Tambah]"` pada item `M-201`.
- **Then:**
  1. Item `R-02` tidak langsung dimasukkan dan item dua restoran tidak pernah tercampur.
  2. Muncul dialog modal `"Ganti keranjang?"` dengan teks `"Keranjangmu berisi item dari Ayam Bakar Pak Dhe. Menambah item dari Geprek Bu Rina akan mengosongkan keranjang yang lama."` dan fokus awal pada `"[Tetap di keranjang lama]"`.
  3. Jika pengguna memilih `"[Tetap di keranjang lama]"` (atau `Escape` / `[X]` / klik luar), dialog menutup dan isi Cart `R-01` tetap utuh.
  4. Jika pengguna memilih `"[Ganti keranjang]"`, dalam satu transisi atomik Cart `R-01` (termasuk voucher dan alamat non-default) dikosongkan dan diganti dengan 1 porsi `M-201` dari `R-02`.

#### `AC-03.8` — Keadaan Cart Kosong dan Penonaktifan Tombol Checkout
- **Asal:** `FR-03`, `NFR-10` | `PRD AC-03.8` | `INTERACTION-SPEC` `T1-D3`, `T1-D4`, `CART_CLEAR` | `UX-SPEC` C-7, C-8, C-9 & 5.3
- **Given:** Cart berada dalam keadaan kosong (awal sesi, setelah menekan tombol `"Kosongkan"`, atau setelah menghapus/mengurangi item terakhir hingga 0).
- **When:** Pengguna berada di halaman Cart (`/keranjang`).
- **Then:**
  1. Layar menampilkan `EmptyState` dengan judul `"Keranjangmu kosong."` dan tombol/tautan `"[Lihat restoran]"` menuju `/`.
  2. Panel `PriceBreakdown` dan `BudgetTracker` disembunyikan, tombol `"[Lanjut ke Checkout]"` berstatus nonaktif, dan badge angka pada ikon Cart di header disembunyikan.
  3. Percobaan membuka `/checkout` secara langsung saat Cart kosong dialihkan otomatis ke `/keranjang`.

---

### 2.4 Epic 4: Checkout Zero-Delta, Perubahan Alamat, dan Budget Guardrail (`FR-04`)

#### `AC-04.1` — Invarian Zero-Delta (`Delta = Rp0`) dari Cart ke Checkout Hingga Struk Payment
- **Asal:** `FR-04.1`, `FR-04.2`, `BR-02`, `BR-03` | `PRD AC-04.1` | `INTERACTION-SPEC` `T5-A`, `calculateOrder`, `executePayment`
- **Given:** Cart `R-01` (`M-101` + `M-104` dengan `V-F01` dan `V-D01`) menampilkan `TOTAL` = `Rp47.000`.
- **When:** Pengguna menekan `"[Lanjut ke Checkout]"`, memeriksa rincian di `/checkout`, lalu menyelesaikan pembayaran simulasi hingga `/struk`.
- **Then:**
  1. Cart, Checkout, dan Struk menggunakan satu fungsi kalkulasi `calculateOrder` yang sama.
  2. Checkout menampilkan seluruh komponen biaya dan `TOTAL` = `Rp47.000` dengan penanda `"Sama dengan Keranjang · Selisih Rp0"` serta tombol aksi `"[Bayar Rp47.000]"`.
  3. Struk Payment menampilkan rincian identik dengan `TOTAL DIBAYAR` = `Rp47.000` dan penanda `"Selisih dari Keranjang: Rp0"` (`delta === 0`).

#### `AC-04.2` — Simulasi Perubahan Alamat di Checkout dengan Pemberitahuan Transparan dan Sinkronisasi Cart
- **Asal:** `FR-04.6`, `FR-04.2`, `BR-02`, `BR-05` | `PRD AC-04.2` | `INTERACTION-SPEC` `T3-A` s.d. `T3-H`, `ADDRESS_SELECT`, `buildPendingPriceChange`, `A-01` s.d. `A-09`
- **Given:** Pengguna berada di halaman Checkout (`/checkout`) dengan alamat awal `ADDR-01` (`+Rp0`), misalnya pada Cart Contoh C (`R-02`: `M-201` + `M-203` + `M-204` dengan `V-F01` + `V-D02`, `TOTAL = Rp28.500`, `ongkir = Rp6.000`).
- **When:** Pengguna menekan `"[Ubah alamat]"`, memilih `ADDR-02` (`Rumah teman di Lowokwaru, Malang (data fiktif)`, `Selisih ongkir: +Rp3.000`), dan menekan `"[Pakai alamat ini]"`.
- **Then:**
  1. Harga **tidak** berubah diam-diam: dialog modal `"Total pesananmu berubah"` muncul segera dengan fokus awal pada `"[Mengerti]"`, menampilkan:
     - `Sebelum`: `Rp28.500`
     - `Sesudah`: `Rp31.500`
     - `Selisih`: `+Rp3.000`
     - `Penyebab`: `"Alamat diganti ke Rumah teman di Lowokwaru, Malang (data fiktif)"`, `"Ongkos kirim: Rp6.000 → Rp9.000 (+Rp3.000)"`, dan `"Diskon voucher ongkir: tidak berubah"`.
  2. Apabila perubahan alamat juga mengubah status budget (misalnya `R-03` `M-301` tanpa voucher dari `ADDR-01` `Rp25.000` / `74%` `OK` menjadi `ADDR-02` `Rp28.000` / `80%` `WARN`), dialog menampilkan blok status `"Berubah dari Sesuai budget menjadi Mepet budget (80%)."`.
  3. Selama dialog terbuka, tombol bayar di latar tidak dapat ditekan (`inert`, `aria-disabled="true"`).
  4. Setelah menekan `"[Mengerti]"` (atau menutup dialog), Checkout menampilkan total baru `Rp31.500` dengan `"Sama dengan Keranjang · Selisih Rp0"`, blok `"Perubahan terakhir"` tampil di Checkout, dan navigasi kembali ke `/keranjang` memperlihatkan total Cart ikut menjadi `Rp31.500` (atau jika menekan `"[Kembalikan alamat sebelumnya]"`, alamat dan total kembali ke `Rp28.500`).

#### `AC-04.3` — Status Budget Tracker `OK` (`< 80%`)
- **Asal:** `FR-03.8`, `FR-04.3`, `BR-08`, `BR-09` | `PRD AC-04.5` | `INTERACTION-SPEC` `evaluateBudget`, `getBudgetStatus` | `UX-SPEC` 5.1
- **Given:** Pengguna memiliki `budget = 50000`, `spentToday = 12000`, dan Cart bertotal `Rp20.000` (proyeksi `Rp32.000`, yaitu `64%` karena `32.000 × 100 < 50.000 × 80`).
- **When:** Komponen `BudgetTracker` dirender di Cart dan Checkout.
- **Then:**
  1. `BudgetTracker` menampilkan badge `"Sesuai budget"` (`CircleCheck`), proyeksi `"Proyeksi: Rp32.000 dari Rp50.000 (64%)"`, progress bar berisian `64%` dengan penanda ambang `"80%"`, dan kalimat `"Pesanan ini masih aman untuk budget hari ini."`.

#### `AC-04.4` — Status Budget Tracker `WARN` (`80%` sampai `< 100%`)
- **Asal:** `FR-03.8`, `FR-04.3`, `BR-08`, `BR-09` | `PRD AC-04.3` | `INTERACTION-SPEC` `evaluateBudget`, `P-05` | `UX-SPEC` 5.1
- **Given:** Pengguna memiliki profil default Wira (`budget = 50000`, `spentToday = 12000`) dan Cart Contoh C bertotal `Rp28.500` (proyeksi `Rp40.500`, yaitu `81%`).
- **When:** Komponen `BudgetTracker` dirender di Cart dan Checkout.
- **Then:**
  1. `BudgetTracker` menampilkan badge `"Mepet budget"` (`TriangleAlert`), proyeksi `"Proyeksi: Rp40.500 dari Rp50.000 (81%)"`, progress bar berisian `81%` dengan penanda ambang `"80%"`, dan kalimat `"Pesanan ini hampir menghabiskan budget hari ini. Sisa Rp9.500."`.

#### `AC-04.5` — Kasus Batas Tepat `100%` Termasuk Status `WARN` (Bukan `EXCEEDED`)
- **Asal:** `FR-04.3`, `BR-09` | `PRD AC-04.6` | `INTERACTION-SPEC` `getBudgetStatus`, `T4-F`, `TS-01` | `UX-SPEC` 5.1 & E-7
- **Given:** Pengguna memiliki `budget = 50000`, `spentToday = 0` (`FIXTURE-SPENT-0`), dan Cart `R-01` (`M-101`, 1 porsi, tanpa voucher) bertotal `Rp50.000` sehingga proyeksi tepat `Rp50.000` (`100%`).
- **When:** Komponen `BudgetTracker` dirender dan pengguna menekan tombol `"[Bayar Rp50.000]"` di Checkout.
- **Then:**
  1. Status pada `BudgetTracker` adalah `"Mepet budget"` (`WARN`) dengan kalimat `"Pesanan ini hampir menghabiskan budget hari ini. Sisa Rp0."`.
  2. Penekanan tombol `"[Bayar Rp50.000]"` **tidak** memunculkan dialog `EXCEEDED` dan langsung memproses pembayaran simulasi menuju `/struk`.

#### `AC-04.6` — Status Budget Tracker `EXCEEDED` (`> 100%`)
- **Asal:** `FR-03.8`, `FR-04.3`, `BR-08`, `BR-09` | `PRD AC-04.4` | `INTERACTION-SPEC` `evaluateBudget`, `P-04` | `UX-SPEC` 5.1
- **Given:** Pengguna memiliki profil default Wira (`budget = 50000`, `spentToday = 12000`) dan Cart Contoh B bertotal `Rp47.000` (proyeksi `Rp59.000`, yaitu `118%`).
- **When:** Komponen `BudgetTracker` dirender di Cart dan Checkout.
- **Then:**
  1. `BudgetTracker` menampilkan badge `"Melebihi budget"` (`CircleX`), proyeksi `"Proyeksi: Rp59.000 dari Rp50.000 (118%)"`, progress bar penuh `100%` (tidak melampaui wadah) dengan penanda `"80%"`, dan kalimat `"Pesanan ini melebihi budget hari ini sebesar Rp9.000."`.

#### `AC-04.7` — Kemunculan Dialog Konfirmasi Proaktif Sebelum Pembayaran pada Status `EXCEEDED`
- **Asal:** `FR-04.4` | `PRD AC-04.7` | `INTERACTION-SPEC` `T4-A`, `PAY_REQUESTED`, `BudgetExceededDialog` | `UX-SPEC` 4.9 (E-1, E-2, E-3, E-6)
- **Given:** Pengguna berada di Checkout (`/checkout`) dengan status `EXCEEDED` (Contoh B: `budget = 50000`, `spentToday = 12000`, pesanan `Rp47.000`, proyeksi `Rp59.000 (118%)`, melebihi `Rp9.000`).
- **When:** Pengguna menekan tombol `"[Bayar Rp47.000]"`.
- **Then:**
  1. Pembayaran simulasi **belum** dijalankan.
  2. Muncul dialog `role="alertdialog"` berjudul `"Pesanan ini melebihi budget harianmu"` yang memuat rincian: `Budget harian` (`Rp50.000`), `Pengeluaran hari ini` (`Rp12.000`), `Pesanan ini` (`Rp47.000`), `Proyeksi` (`Rp59.000 (118%)`), dan `Melebihi budget` (`Rp9.000`).
  3. Dialog menampilkan tiga tombol bertumpuk vertikal dari atas ke bawah: `"[Ubah pesanan]"` (memegang fokus awal), `"[Lihat yang sesuai budget]"`, dan `"[Lanjutkan tetap]"` (paling bawah, tidak pernah fokus awal).

#### `AC-04.8` — Aksi "Ubah pesanan" pada Dialog `EXCEEDED` Mengembalikan Pengguna ke Cart
- **Asal:** `FR-04.4` | `PRD AC-04.8` | `INTERACTION-SPEC` `T4-B`, `EXCEEDED_CHANGE_ORDER` | `UX-SPEC` E-5
- **Given:** Dialog `EXCEEDED` sedang terbuka di Checkout.
- **When:** Pengguna menekan tombol `"[Ubah pesanan]"`.
- **Then:**
  1. Dialog menutup tanpa menjalankan pembayaran (`spentToday` tetap `Rp12.000`).
  2. Pengguna diarahkan kembali ke halaman Cart (`/keranjang`) dengan seluruh item dan voucher sebelumnya tetap utuh untuk disesuaikan.

#### `AC-04.9` — Aksi "Lihat yang sesuai budget" pada Dialog `EXCEEDED` Mengaktifkan Filter di Home Tanpa Menghapus Cart
- **Asal:** `FR-04.4`, `NFR-05` | `PRD AC-04.9` | `INTERACTION-SPEC` `T4-C`, `EXCEEDED_SHOW_AFFORDABLE` | `UX-SPEC` E-5 & 2.3
- **Given:** Dialog `EXCEEDED` sedang terbuka di Checkout.
- **When:** Pengguna menekan tombol `"[Lihat yang sesuai budget]"`.
- **Then:**
  1. Dialog menutup tanpa menjalankan pembayaran dan pengguna diarahkan ke halaman Home (`/`).
  2. Filter `"Sesuai Budget Saya"` otomatis diaktifkan (`budgetFilterOn = true`) sehingga hanya menampilkan restoran yang muat budget (`R-03`, `R-02`, `R-04`, `R-06`).
  3. Isi Cart sebelumnya tetap tersimpan persisten (`NFR-05`).

#### `AC-04.10` — Aksi "Lanjutkan tetap" pada Dialog `EXCEEDED` Melanjutkan Pembayaran dan Mencatat Kelebihan Budget di Struk
- **Asal:** `FR-04.4`, `FR-04.7`, `FR-04.8` | `PRD AC-04.10` | `INTERACTION-SPEC` `T4-D`, `T5-D`, `T5-H`, `EXCEEDED_CONTINUE` | `UX-SPEC` 4.6 & A8
- **Given:** Dialog `EXCEEDED` sedang terbuka pada Contoh B (`budget = 50000`, `spentToday = 12000`, total `Rp47.000`).
- **When:** Pengguna menekan tombol `"[Lanjutkan tetap]"`.
- **Then:**
  1. Pembayaran simulasi dijalankan dan pengguna diarahkan ke `/struk`.
  2. Struk menampilkan `TOTAL DIBAYAR` = `Rp47.000`, `Selisih dari Keranjang: Rp0`, `Budget harian` = `Rp50.000`, `Pengeluaran hari ini (diperbarui)` = `Rp59.000`, `Sisa budget` = `Rp0`, dan baris eksplisit `"Pesanan ini melebihi budget Rp9.000."`.
  3. Cart dikosongkan, dan setelah pengguna menekan `"[Kembali ke Home]"`, header menampilkan `"Budget terlampaui Rp9.000"`.

#### `AC-04.11` — Menutup Dialog `EXCEEDED` Tanpa Memilih Aksi Membatalkan Eksekusi Pembayaran
- **Asal:** `FR-04.5` | `PRD AC-04.11` | `INTERACTION-SPEC` `T4-E`, `EXCEEDED_DISMISS` | `UX-SPEC` E-4 & 5.5.3
- **Given:** Dialog `EXCEEDED` sedang terbuka di Checkout.
- **When:** Pengguna menutup dialog menggunakan tombol tutup `[X]`, menekan tombol `Escape`, atau mengklik backdrop di luar dialog.
- **Then:**
  1. Dialog menutup dan pembayaran **tidak** dijalankan (`spentToday` tetap `Rp12.000`, tidak berpindah ke `/struk`).
  2. Pengguna tetap berada di Checkout (`/checkout`) dan fokus kembali ke tombol `"Bayar Rp{total}"`.

#### `AC-04.12` — Pembaruan Pengeluaran Hari Ini dan Sisa Budget di Header Setelah Pembayaran Berhasil
- **Asal:** `FR-04.8`, `NFR-05` | `PRD AC-04.12` | `INTERACTION-SPEC` `T5-A`, `T5-E`, `T5-G`, `executePayment` | `UX-SPEC` 4.6
- **Given:** Pengguna dengan profil default Wira (`budget = 50000`, `spentToday = 12000`) menyelesaikan pembayaran simulasi untuk pesanan bertotal `Rp28.500` (Contoh C).
- **When:** Halaman Struk (`/struk`) tampil dan pengguna menekan tombol `"[Kembali ke Home]"`.
- **Then:**
  1. Halaman Struk menampilkan `"Pembayaran berhasil (simulasi)"`, `"Tidak ada transaksi nyata."`, `Pengeluaran hari ini (diperbarui)` = `Rp40.500` (`12.000 + 28.500`), dan `Sisa budget` = `Rp9.500` (`50.000 − 40.500`).
  2. Cart dikosongkan (`cart.lines = []`, `addressId = "ADDR-01"`).
  3. Saat kembali ke Home (`/`), header menampilkan `"Sisa budget: Rp9.500"` dan badge kecocokan budget seluruh restoran diperbarui terhadap sisa budget `Rp9.500`.

#### `AC-04.13` — Perlindungan Anti-Double-Submit dan Penjaga Rute Checkout / Struk
- **Asal:** `FR-04.1`, `NFR-10` | `INTERACTION-SPEC` `T5-B`, `T5-F`, `T5-G`, `createReceiptId`, `ROUTE_CHANGED` | `UX-SPEC` 2.3
- **Given:** Pengguna menekan tombol `"Bayar Rp{total}"` dua kali berturut-turut dengan cepat, atau membuka/me-refresh `/struk` saat `lastReceipt === null`, atau membuka `/checkout` saat Cart kosong.
- **When:** Aksi ganda atau navigasi langsung tersebut terjadi.
- **Then:**
  1. Mekanisme idempotensi `receiptId` mencegah pembayaran ganda sehingga `spentToday` hanya bertambah satu kali.
  2. Akses ke `/struk` tanpa data pembayaran aktif (`lastReceipt === null`) dialihkan otomatis ke `/`.
  3. Akses ke `/checkout` saat Cart kosong dialihkan otomatis ke `/keranjang`.

---

### 2.5 Epic 5: Non-Fungsional, Aksesibilitas, dan Ketahanan State (`NFR-01` s.d. `NFR-10`)

#### `AC-05.1` — Tata Letak Responsif Mobile-First `360 px` hingga `1440 px` Tanpa Scroll Horizontal
- **Asal:** `NFR-01` | `DESIGN-SYSTEM` 4.1, 4.2 & 4.4 | `UX-SPEC` 4.11 & 5.5.6
- **Given:** Aplikasi dibuka pada lebar viewport `360 px`, `768 px`, `1024 px`, dan `1440 px`.
- **When:** Pengguna menavigasi seluruh 6 rute (`/`, `/cari`, `/restoran/:id`, `/keranjang`, `/checkout`, `/struk`) serta membuka ketujuh overlay.
- **Then:**
  1. `document.documentElement.scrollWidth <= window.innerWidth` terpenuhi pada seluruh layar, overlay, dan ukuran viewport (nol scroll horizontal).
  2. Tata letak beradaptasi secara responsif: 1 kolom pada `360px`, grid 2 kolom pada `768px`, dan grid 3 kolom (Home/Search) serta 2 kolom dengan panel ringkasan sticky (Cart/Checkout) pada `1024–1440px` tanpa mengurangi fungsionalitas.
  3. Seluruh elemen interaktif memenuhi ukuran target sentuh minimum `44 × 44 px` dengan jarak antar kontrol yang memadai.

#### `AC-05.2` — Performa Kalkulasi Ulang Instan (`< 100 ms`) dan Kinerja Pemuatan Lokal
- **Asal:** `NFR-02` | `INTERACTION-SPEC` `calculateOrder`, `filterAndSortRestaurants`, `selectCartView`
- **Given:** Prototype berjalan secara lokal dengan mock data tanpa ketergantungan jaringan eksternal.
- **When:** Pengguna mengubah kuantitas item, menghapus item, memasang/melepas voucher, mengubah alamat, menyimpan budget baru, atau mengetik pencarian.
- **Then:**
  1. Kalkulasi ulang rincian biaya, total, status budget, dan daftar restoran selesai secara sinkron dalam waktu kurang dari `100 ms` tanpa reload halaman.

#### `AC-05.3` — Kebenaran Deterministik Bilangan Bulat Rupiah dan Pembulatan (`BR-01`, `BR-06`, `BR-11`)
- **Asal:** `NFR-03`, `NFR-08`, `BR-01`, `BR-06`, `BR-11` | `INTERACTION-SPEC` `formatRupiah.ts`, `intMath.ts`, `pricing.ts`, vektor `P-01`..`P-13`
- **Given:** Suite unit test (`Vitest`) menjalankan seluruh vektor perhitungan domain (`P-01`..`P-13`, pembulatan pajak `BR-06`, alamat `A-01`..`A-09`, voucher `E-01`..`E-07`, proyeksi `E`, discovery `D-01`..`D-08`, validasi budget).
- **When:** `vitest run` dijalankan.
- **Then:**
  1. 100% test case lulus menggunakan aritmetika bilangan bulat aman tanpa `float`, `Intl`, `toLocaleString`, maupun `toFixed`.
  2. Seluruh format mata uang memenuhi pola `/^[\u2212+]?Rp\d{1,3}(\.\d{3})*$/` dengan pemisah ribuan titik dan bahasa antarmuka Indonesia.

#### `AC-05.4` — Operabilitas Keyboard Penuh, Focus Trap Modal, dan Pengumuman Live Region (WCAG 2.1 AA)
- **Asal:** `NFR-07`, `FR-05.4` | `UX-SPEC` 5.5 | `DESIGN-SYSTEM` 2.6 | `INTERACTION-SPEC` `K-01` s.d. `K-12`, `useModalBehavior`
- **Given:** Pengguna berinteraksi hanya dengan keyboard (`Tab`, `Shift+Tab`, `Enter`, `Space`, tombol panah, `Escape`) dan teknologi bantu.
- **When:** Pengguna menavigasi halaman serta membuka dan menutup seluruh overlay dan menu overflow `[⋮]`.
- **Then:**
  1. Skip link `"Lewati ke konten utama"` menjadi elemen fokus pertama halaman dan memindahkan fokus ke `main#konten`.
  2. Urutan `Tab` sejajar dengan urutan baca visual; setiap elemen interaktif menampilkan cincin fokus `:focus-visible`.
  3. Saat overlay terbuka, `#app-root` menjadi `inert`, gulir latar terkunci (`html.modal-open`), fokus awal ditempatkan sesuai tabel `INTERACTION-SPEC` 5.3, `Tab`/`Shift+Tab` terperangkap di dalam panel (`trapTab`), `Escape` menutup hanya lapisan teratas (`escapeStack`), dan saat ditutup fokus kembali ke pemicu atau `data-focus-key`.
  4. Perubahan dinamis diumumkan melalui `aria-live="polite"`, `role="status"`, atau `role="alert"`; seluruh pasangan warna memenuhi kontras WCAG 2.1 AA (`4.5:1` teks normal, `3:1` kontrol/fokus).

#### `AC-05.5` — Ketahanan Persistensi, Sanitasi Data Rusak, dan Reset Data Demo Atomik
- **Asal:** `NFR-05`, `NFR-10` | `INTERACTION-SPEC` `loadPersistedState`, `sanitizePersisted` (`S-1`..`S-17`), `RESET_REQUESTED`, `RESET_CONFIRM`
- **Given:** `localStorage["tpbg:v1"]` menyimpan JSON rusak, nilai di luar rentang, item lintas restoran, atau akses `localStorage` diblokir; atau pengguna telah memodifikasi state selama sesi demo.
- **When:** Aplikasi dimuat dari storage atau pengguna memilih `"Reset data demo"` pada menu overflow `[⋮]` lalu mengonfirmasi tombol `"[Reset]"`.
- **Then:**
  1. Data storage yang rusak atau tidak valid disanitasi secara aman (`S-1` s.d. `S-17`) tanpa melempar error yang menghentikan aplikasi.
  2. Konfirmasi `"[Reset]"` pada dialog `"Kembalikan data demo ke awal? Budget, pengeluaran, alamat, dan keranjang akan direset."` mengembalikan seluruh state persisten dan volatil secara atomik ke profil default Wira (`budget = 50000`, `spentToday = 12000`, `addressId = "ADDR-01"`, `cart` kosong, `budgetFilterOn = false`, `sortMode = "default"`).

#### `AC-05.6` — Isolasi Data Lokal Tanpa Backend dan Kompatibilitas Lintas Peramban
- **Asal:** `NFR-04`, `NFR-06` | `DESIGN-SYSTEM` 1.5 & 4.5 | `INTERACTION-SPEC` `src/data/*`
- **Given:** Aplikasi dibuka pada versi terbaru Chrome, Edge, Firefox, serta Chrome dan Safari mobile tanpa koneksi backend maupun internet.
- **When:** Pengguna menjalankan seluruh alur pemesanan dari Home hingga Struk Payment.
- **Then:**
  1. Seluruh data dan thumbnail (gradien CSS + emoji) bersumber 100% dari modul lokal tanpa permintaan jaringan eksternal, font eksternal, URL gambar eksternal, maupun paket UI eksternal.

#### `AC-05.7` — Pemisahan Bersih Logika Domain dari Komponen Tampilan (`Maintainability`)
- **Asal:** `NFR-09` | `INTERACTION-SPEC` 1.3 & 1.4
- **Given:** Kode sumber proyek TPBG disusun dengan TypeScript `strict: true`.
- **When:** Dilakukan audit arsitektur modul dan kompilasi TypeScript (`tsc --noEmit`).
- **Then:**
  1. Seluruh logika kalkulasi harga, evaluasi budget, discovery, sanitasi persistensi, dan reducer berada di modul murni (`src/lib/*`, `src/data/*`, `src/state/*`) yang bebas dari impor komponen React, DOM, maupun `lucide-react`, dan lolos kompilasi `strict: true` dengan 0 error.

---

## Section 3: Panduan Eksekusi Skenario Uji End-to-End (`TS-01` s.d. `TS-08`)

### 3.0 Konvensi Eksekusi & Fixture JSON (`localStorage["tpbg:v1"]`)

1. **Cara Penyiapan Fixture Sebelum Skenario:**
   - Untuk skenario yang menggunakan profil default Wira (`TS-02` s.d. `TS-07`, serta `TS-01` Bagian A), jalankan aksi `"Reset data demo"` melalui menu overflow `[⋮]` atau tanam `FIXTURE-DEFAULT` ke `localStorage["tpbg:v1"]` lalu muat ulang halaman (`/`).
   - Untuk skenario khusus yang memerlukan `spentToday: 0` (`TS-01` Bagian B) atau `budget: null` (`TS-08`), jalankan perintah berikut pada DevTools Console atau `page.evaluate` Playwright sebelum `page.goto("/")`:
     ```js
     localStorage.setItem('tpbg:v1', JSON.stringify(FIXTURE));
     ```
2. **Tiga Fixture JSON Baku (`schemaVersion: 1`):**

#### `FIXTURE-DEFAULT` (Profil Default Wira)
```json
{
  "schemaVersion": 1,
  "budget": 50000,
  "spentToday": 12000,
  "addressId": "ADDR-01",
  "cart": {
    "restaurantId": null,
    "lines": [],
    "foodVoucherId": null,
    "deliveryVoucherId": null
  },
  "budgetFilterOn": false,
  "sortMode": "default"
}
```

#### `FIXTURE-SPENT-0` (Pengeluaran Hari Ini `Rp0` untuk Uji Batas Tepat 100% pada `TS-01` Bagian B)
```json
{
  "schemaVersion": 1,
  "budget": 50000,
  "spentToday": 0,
  "addressId": "ADDR-01",
  "cart": {
    "restaurantId": null,
    "lines": [],
    "foodVoucherId": null,
    "deliveryVoucherId": null
  },
  "budgetFilterOn": false,
  "sortMode": "default"
}
```

#### `FIXTURE-BUDGET-NULL` (Budget Belum Diatur untuk `TS-08`)
```json
{
  "schemaVersion": 1,
  "budget": null,
  "spentToday": 12000,
  "addressId": "ADDR-01",
  "cart": {
    "restaurantId": null,
    "lines": [],
    "foodVoucherId": null,
    "deliveryVoucherId": null
  },
  "budgetFilterOn": false,
  "sortMode": "default"
}
```

---

### 3.1 `TS-01`: Worked Example dan Batas Atas Status `WARN` (Tepat 100%)

- **Tujuan:** Memverifikasi perhitungan Worked Example (`R-01`, 1 porsi `M-101` = `Rp50.000`) dari kartu restoran hingga Cart dan Checkout, serta membuktikan bahwa proyeksi tepat `100%` (`Rp50.000` dari `Rp50.000` saat `spentToday = Rp0`) diklasifikasikan sebagai `WARN` (`Mepet budget`) dan tidak memicu dialog `EXCEEDED`.
- **Prakondisi:**
  - **Bagian A:** `FIXTURE-DEFAULT` (`budget: 50000`, `spentToday: 12000`, Cart kosong).
  - **Bagian B:** `FIXTURE-SPENT-0` (`budget: 50000`, `spentToday: 0`, Cart kosong).
- **Langkah Aksi & Hasil yang Diharapkan:**

| Langkah | Langkah Aksi | Hasil yang Diharapkan |
|---|---|---|
| **1** | **(Bagian A)** Buka `/` dengan `FIXTURE-DEFAULT` dan amati kartu `R-01` (`Ayam Bakar Pak Dhe`). | Header menampilkan `"Sisa budget: Rp38.000"`. Kartu `R-01` menampilkan `"Est. Rp50.000, sudah termasuk ongkir dan biaya"` dan badge `"Melebihi budget"`. |
| **2** | Ketuk kartu `R-01` untuk membuka `/restoran/R-01` dan periksa item `M-101` (`Paket Ayam Bakar Promo`). | `M-101` menampilkan harga `Rp30.000`, label `"Belum termasuk pajak"`, dan `PriceNote` 2 baris: Baris 1 `"Belum termasuk pajak 10% + kemasan Rp2.000."`, Baris 2 `"Est. all-in 1 porsi: Rp50.000."`. |
| **3** | Tekan tombol `"[Tambah]"` pada `M-101`, lalu tekan `"[Lihat Keranjang]"` menuju `/keranjang`. | Rincian biaya menampilkan: `Subtotal item` = `Rp30.000`, `Pajak restoran (10%)` = `Rp3.000`, `Biaya kemasan` = `Rp2.000`, `Ongkos kirim` = `Rp12.000`, `Biaya layanan` = `Rp3.000`, `Diskon voucher makanan` = `−Rp0`, `Diskon voucher ongkir` = `−Rp0`, dan `TOTAL` = `Rp50.000`. |
| **4** | **(Bagian B)** Tanam `FIXTURE-SPENT-0` (`spentToday: 0`) dan muat ulang `/` lalu buka `/restoran/R-01` → tambahkan 1 porsi `M-101` → buka `/keranjang`. | Header menampilkan `"Sisa budget: Rp50.000"`. Di Cart, `TOTAL` = `Rp50.000`. `BudgetTracker` menampilkan badge `"Mepet budget"` (`WARN`), `"Proyeksi: Rp50.000 dari Rp50.000 (100%)"`, dan kalimat `"Pesanan ini hampir menghabiskan budget hari ini. Sisa Rp0."`. |
| **5** | Tekan `"[Lanjut ke Checkout]"` menuju `/checkout`, lalu tekan tombol `"[Bayar Rp50.000]"`. | Checkout menampilkan `TOTAL` = `Rp50.000` (`"Sama dengan Keranjang · Selisih Rp0"`) dan status `"Mepet budget"`. Penekanan `"[Bayar Rp50.000]"` **tidak** memunculkan dialog `EXCEEDED` dan langsung menuju `/struk` (`TOTAL DIBAYAR` = `Rp50.000`, `Sisa budget` = `Rp0`). |

- **Referensi:**
  - **Cakupan PRD:** Contoh A (Section 6.4), `FR-02.3`, `FR-04.3`, `BR-09`, `TS-01`.
  - **AC Dokumen Ini:** `AC-02.3`, `AC-04.5`.
  - **Kode `INTERACTION-SPEC`:** Vektor `P-01`, `D-01`, Tabel Proyeksi `E` (`0 + 50.000 = WARN`), Transisi `T1-A`, `T4-F`, `T5-A`.

---

### 3.2 `TS-02`: Cart R-01 Melebihi Budget (`EXCEEDED`) dan Dialog Guardrail Proaktif

- **Tujuan:** Memverifikasi kalkulasi multi-voucher pada Contoh B (`R-01`: `M-101` + `M-104` + `V-F01` + `V-D01` = `Rp47.000`), kemunculan dialog guardrail `EXCEEDED` sebelum pembayaran (`proyeksi = Rp59.000` / `118%`), perilaku tombol tutup (`Escape`/`X`), serta ketiga aksi dialog (`"Ubah pesanan"`, `"Lihat yang sesuai budget"`, dan `"Lanjutkan tetap"`).
- **Prakondisi:** `FIXTURE-DEFAULT` (`budget: 50000`, `spentToday: 12000`, `ADDR-01`, Cart kosong).
- **Langkah Aksi & Hasil yang Diharapkan:**

| Langkah | Langkah Aksi | Hasil yang Diharapkan |
|---|---|---|
| **1** | Buka `/restoran/R-01`, tambahkan 1 porsi `M-101` (`Rp30.000`, `NOT_INCLUDED`) dan 1 porsi `M-104` (`Rp8.000`, `INCLUDED`), lalu buka `/keranjang`. | Rincian biaya menampilkan `Subtotal item` = `Rp38.000`, `Pajak restoran (10%)` = `Rp3.000`, `Biaya kemasan` = `Rp4.000`, `Ongkos kirim` = `Rp12.000`, `Biaya layanan` = `Rp3.000`, dan `TOTAL` = `Rp60.000`. |
| **2** | Pasang voucher makanan `V-F01` (`Hemat Makan`), lalu pasang voucher ongkir `V-D01` (`Gratis Ongkir`). | Setelah `V-F01`: `Diskon voucher makanan` = `−Rp5.000`, total menjadi `Rp55.000`. Setelah `V-D01`: `Diskon voucher ongkir` = `−Rp8.000`, `TOTAL` menjadi `Rp47.000` secara instan tanpa reload. |
| **3** | Periksa `BudgetTracker` di Cart, lalu tekan `"[Lanjut ke Checkout]"`. | `BudgetTracker` menampilkan badge `"Melebihi budget"`, `"Proyeksi: Rp59.000 dari Rp50.000 (118%)"`, dan `"Pesanan ini melebihi budget hari ini sebesar Rp9.000."`. Checkout menampilkan `TOTAL` = `Rp47.000` (`"Sama dengan Keranjang · Selisih Rp0"`). |
| **4** | Tekan tombol `"[Bayar Rp47.000]"`, lalu tekan tombol `Escape` (atau tombol `[X]`). | Dialog `role="alertdialog"` `"Pesanan ini melebihi budget harianmu"` muncul **sebelum** pembayaran dengan fokus awal pada `"[Ubah pesanan]"`. Menekan `Escape` menutup dialog tanpa pembayaran dan mengembalikan fokus ke `"[Bayar Rp47.000]"`. |
| **5** | Tekan kembali `"[Bayar Rp47.000]"`, lalu pilih aksi pertama `"[Ubah pesanan]"`. | Dialog menutup tanpa pembayaran dan pengguna diarahkan ke `/keranjang` dengan item serta voucher tetap utuh. |
| **6** | Kembali ke `/checkout`, tekan `"[Bayar Rp47.000]"`, lalu pilih aksi kedua `"[Lihat yang sesuai budget]"`. | Dialog menutup tanpa pembayaran dan pengguna diarahkan ke `/` (Home) dengan filter `"Sesuai Budget Saya"` otomatis aktif (menampilkan `R-03`, `R-02`, `R-04`, `R-06`), sedangkan Cart `R-01` tetap tersimpan (`badge Cart = 2`). |
| **7** | Buka kembali `/keranjang` → `/checkout`, tekan `"[Bayar Rp47.000]"`, lalu pilih aksi ketiga `"[Lanjutkan tetap]"`. | Pembayaran simulasi dijalankan menuju `/struk`: `TOTAL DIBAYAR` = `Rp47.000`, `Selisih dari Keranjang: Rp0`, `Pengeluaran hari ini (diperbarui)` = `Rp59.000`, `Sisa budget` = `Rp0`, dan tampil baris `"Pesanan ini melebihi budget Rp9.000."`. |
| **8** | Tekan `"[Kembali ke Home]"`. | Header menampilkan `"Budget terlampaui Rp9.000"` dan Cart telah kosong. |

- **Referensi:**
  - **Cakupan PRD:** Contoh B (Section 6.4), `FR-03.1`..`FR-03.4`, `FR-04.1`, `FR-04.3`..`FR-04.5`, `FR-04.7`, `TS-02`.
  - **AC Dokumen Ini:** `AC-03.1`, `AC-03.2`, `AC-03.3`, `AC-04.1`, `AC-04.6`, `AC-04.7`, `AC-04.8`, `AC-04.9`, `AC-04.10`, `AC-04.11`.
  - **Kode `INTERACTION-SPEC`:** Vektor `P-02`, `P-03`, `P-04`, Transisi `T2-A`, `T4-A` s.d. `T4-E`, `T5-D`, `T5-H`.

---

### 3.3 `TS-03`: Cart R-02 di Batas `WARN` (81%) dan Jalur Pembayaran Normal

- **Tujuan:** Memverifikasi Contoh C (`R-02`: `M-201` berdiskon + `M-203` + `M-204` dengan `V-F01` + `V-D02`), transisi status dari `EXCEEDED` (`101%` tanpa voucher) menjadi `WARN` (`81%` setelah voucher), kesamaan total `Rp28.500` hingga Struk, serta pembaruan sisa budget header menjadi `Rp9.500`.
- **Prakondisi:** `FIXTURE-DEFAULT` (`budget: 50000`, `spentToday: 12000`, `ADDR-01`, Cart kosong).
- **Langkah Aksi & Hasil yang Diharapkan:**

| Langkah | Langkah Aksi | Hasil yang Diharapkan |
|---|---|---|
| **1** | Buka `/restoran/R-02` (`Geprek Bu Rina`), periksa item berdiskon `M-201` (`Ayam Geprek Original`), lalu tambahkan 1 porsi `M-201`, 1 porsi `M-203` (`Nasi Putih`), dan 1 porsi `M-204` (`Es Teh Manis`). | `M-201` menampilkan harga asli dicoret `Rp17.000`, harga net `Rp15.000`, status `"Belum termasuk pajak"`, dan `"Est. all-in 1 porsi: Rp26.500."`. `M-203` & `M-204` berlabel `"Sudah termasuk pajak"`. |
| **2** | Buka `/keranjang` sebelum memasang voucher. | Rincian biaya menampilkan: `Subtotal item` = `Rp25.000` (`15.000 + 5.000 + 5.000`), `Pajak restoran (10%)` = `Rp1.500` (hanya dari `M-201`), `Biaya kemasan` = `Rp3.000` (`3 × Rp1.000`), `Ongkos kirim` = `Rp6.000`, `Biaya layanan` = `Rp3.000`, dan `TOTAL` = `Rp38.500` (proyeksi `Rp50.500` / `101%`, `EXCEEDED`). |
| **3** | Pasang voucher makanan `V-F01` (`Hemat Makan`, `Rp5.000`, min. `Rp25.000`) dan voucher ongkir `V-D02` (`Potongan Ongkir`, `Rp5.000`, min. `Rp15.000`). | `Diskon voucher makanan` = `−Rp5.000`, `Diskon voucher ongkir` = `−Rp5.000`, dan `TOTAL` menjadi `Rp28.500`. `BudgetTracker` berubah menjadi badge `"Mepet budget"` (`WARN`), `"Proyeksi: Rp40.500 dari Rp50.000 (81%)"`, dan `"Pesanan ini hampir menghabiskan budget hari ini. Sisa Rp9.500."`. |
| **4** | Tekan `"[Lanjut ke Checkout]"` menuju `/checkout`, lalu tekan `"[Bayar Rp28.500]"`. | Checkout menampilkan `TOTAL` = `Rp28.500` (`"Sama dengan Keranjang · Selisih Rp0"`). Penekanan `"[Bayar Rp28.500]"` **tidak** memunculkan dialog `EXCEEDED` dan langsung menuju `/struk`. |
| **5** | Periksa Struk Payment dan tekan `"[Kembali ke Home]"`. | Struk menampilkan `TOTAL DIBAYAR` = `Rp28.500`, `Selisih dari Keranjang: Rp0`, `Pengeluaran hari ini (diperbarui)` = `Rp40.500`, dan `Sisa budget` = `Rp9.500`. Saat kembali ke Home, header menampilkan `"Sisa budget: Rp9.500"`. |

- **Referensi:**
  - **Cakupan PRD:** Contoh C (Section 6.4), `FR-02.6`, `FR-03.3`, `FR-04.1`, `FR-04.3`, `FR-04.8`, `TS-03`.
  - **AC Dokumen Ini:** `AC-02.6`, `AC-03.3`, `AC-04.1`, `AC-04.4`, `AC-04.12`.
  - **Kode `INTERACTION-SPEC`:** Vektor `P-05`, `P-06`, Tabel Proyeksi `E` (`81% WARN`), Transisi `T2-A`, `T4-F`, `T5-A`, `T5-E`.

---

### 3.4 `TS-04`: Pelepasan Otomatis Voucher Saat Subtotal Turun di Bawah Minimum Belanja

- **Tujuan:** Memverifikasi aturan `BR-07(b)` dan `FR-03.6` bahwa ketika perubahan item di Cart menyebabkan subtotal turun di bawah syarat minimum voucher makanan (`V-F01` min. `Rp25.000`), voucher makanan dilepas otomatis disertai banner pemberitahuan inline sementara voucher ongkir yang masih memenuhi syarat (`V-D02` min. `Rp15.000`) tetap dipertahankan.
- **Prakondisi:** Cart berada dalam kondisi langkah 3 pada `TS-03` (`FIXTURE-DEFAULT`, `R-02`: `M-201` + `M-203` + `M-204`, `subtotal = Rp25.000`, `V-F01` dan `V-D02` terpasang, `TOTAL = Rp28.500`, `proyeksi = Rp40.500` / `81%` `WARN`).
- **Langkah Aksi & Hasil yang Diharapkan:**

| Langkah | Langkah Aksi | Hasil yang Diharapkan |
|---|---|---|
| **1** | Di halaman Cart (`/keranjang`), tekan tombol `"[Hapus]"` (atau `[–]` pada qty 1) pada baris item `M-204` (`Es Teh Manis`, `Rp5.000`). | Item `M-204` dihapus dari Cart sehingga `subtotal` turun dari `Rp25.000` menjadi `Rp20.000`. |
| **2** | Amati area slot voucher dan banner notifikasi di bawahnya. | Slot `"Voucher makanan"` otomatis kembali kosong (`"Pilih voucher"`), slot `"Voucher ongkir"` tetap mempertahankan `V-D02` (`Potongan Ongkir` `−Rp5.000`), dan muncul banner inline `role="status"` bertuliskan `"Hemat Makan dilepas karena subtotal di bawah minimum Rp25.000. Total dihitung ulang."`. |
| **3** | Periksa panel `PriceBreakdown` dan `BudgetTracker`. | Rincian menampilkan: `Subtotal item` = `Rp20.000`, `Pajak restoran (10%)` = `Rp1.500`, `Biaya kemasan` = `Rp2.000` (`2 × Rp1.000`), `Ongkos kirim` = `Rp6.000`, `Biaya layanan` = `Rp3.000`, `Diskon voucher makanan` = `−Rp0`, `Diskon voucher ongkir` = `−Rp5.000`, dan `TOTAL` = `Rp27.500`. `BudgetTracker` berubah menjadi badge `"Sesuai budget"` (`OK`) dengan `"Proyeksi: Rp39.500 dari Rp50.000 (79%)"`. |
| **4** | Buka panel `"Pilih voucher makanan"` untuk memverifikasi kelayakan `V-F01`. | `V-F01` tampil pada daftar tidak dapat dipakai (`aria-disabled="true"`) dengan alasan `"Kurang Rp5.000 dari minimum belanja."`. |

- **Referensi:**
  - **Cakupan PRD:** `FR-03.4`, `FR-03.5`, `FR-03.6`, `BR-07(b)`, `TS-04`.
  - **AC Dokumen Ini:** `AC-03.5`, `AC-03.6`, `AC-04.3`.
  - **Kode `INTERACTION-SPEC`:** Vektor `P-07`, `E-01`, Transisi `T1-D2`, `T2-F`.

---

### 3.5 `TS-05`: Cart R-03 dengan Seluruh Item Sudah Termasuk Pajak (`Pajak Rp0`, Status `OK`)

- **Tujuan:** Memverifikasi perlakuan item yang seluruhnya bertanda `"Sudah termasuk pajak"` (`R-03`: `Nasi Goreng Mas Joko`), memastikan komponen pajak di rincian biaya bernilai `Rp0` dengan keterangan eksplisit `"Semua item sudah termasuk pajak"`, serta memastikan status budget adalah `OK` (`74%`).
- **Prakondisi:** `FIXTURE-DEFAULT` (`budget: 50000`, `spentToday: 12000`, `ADDR-01`, Cart kosong).
- **Langkah Aksi & Hasil yang Diharapkan:**

| Langkah | Langkah Aksi | Hasil yang Diharapkan |
|---|---|---|
| **1** | Buka `/restoran/R-03` (`Nasi Goreng Mas Joko`) dan periksa daftar menunya (`M-301` s.d. `M-304`). | Seluruh 4 item menu menampilkan label `"Sudah termasuk pajak"` dan `PriceNote` Baris 1 berbunyi `"Sudah termasuk pajak. Kemasan Rp1.000."`. Pada `M-301` (`Nasi Goreng Ayam`, `Rp18.000`), Baris 2 berbunyi `"Est. all-in 1 porsi: Rp25.000."`. |
| **2** | Tambahkan 1 porsi `M-301` ke Cart, lalu buka `/keranjang`. | `PriceBreakdown` menampilkan: `Subtotal item` = `Rp18.000`, `Pajak restoran (10%)` = `Rp0` disertai keterangan `"Semua item sudah termasuk pajak"`, `Biaya kemasan` = `Rp1.000`, `Ongkos kirim` = `Rp4.000`, `Biaya layanan` = `Rp2.000`, `Diskon voucher makanan` = `−Rp0`, `Diskon voucher ongkir` = `−Rp0`, dan `TOTAL` = `Rp25.000`. |
| **3** | Periksa komponen `BudgetTracker` di Cart. | `BudgetTracker` menampilkan badge `"Sesuai budget"` (`OK`), `"Proyeksi: Rp37.000 dari Rp50.000 (74%)"`, dan kalimat `"Pesanan ini masih aman untuk budget hari ini."`. |

- **Referensi:**
  - **Cakupan PRD:** `FR-02.1`, `FR-03.2`, `FR-04.3`, `BR-02`, `TS-05`.
  - **AC Dokumen Ini:** `AC-02.1`, `AC-02.2`, `AC-04.3`.
  - **Kode `INTERACTION-SPEC`:** Vektor `P-08`, `D-01`.

---

### 3.6 `TS-06`: Perubahan Budget Menjadi `Rp100.000` dan Kalibrasi Ulang Badge serta Filter

- **Tujuan:** Memverifikasi validasi input pada Pengaturan Budget dan memastikan perubahan `budget` menjadi `Rp100.000` menghitung ulang sisa budget header, seluruh badge kecocokan budget pada kartu restoran, serta hasil filter `"Sesuai Budget Saya"` secara instan.
- **Prakondisi:** `FIXTURE-DEFAULT` (`budget: 50000`, `spentToday: 12000`, Cart kosong).
- **Langkah Aksi & Hasil yang Diharapkan:**

| Langkah | Langkah Aksi | Hasil yang Diharapkan |
|---|---|---|
| **1** | Buka `/` (Home) dan amati status awal header serta keenam kartu restoran. | Header menampilkan `"Sisa budget: Rp38.000"`. Kartu `R-02` & `R-03` berbadge `"Sesuai budget"`, `R-04` & `R-06` berbadge `"Mepet budget"`, dan `R-01` & `R-05` berbadge `"Melebihi budget"`. |
| **2** | Ketuk tombol `"Sisa budget: Rp38.000"` di header untuk membuka Pengaturan Budget (`"Budget makan harian"`). | Bottom sheet/modal Pengaturan Budget terbuka dengan fokus awal pada kolom input `#budget`. |
| **3** | Uji validasi dengan mengetik `"50.000"` lalu tekan `"[Simpan]"`, kemudian uji `"9999"` lalu tekan `"[Simpan]"`. | Untuk `"50.000"` muncul galat `"Budget harus bilangan bulat tanpa desimal."`; untuk `"9999"` muncul galat `"Budget minimal Rp10.000."`; overlay tetap terbuka. |
| **4** | Hapus input, ketik `"100000"`, lalu tekan `"[Simpan]"`. | Overlay menutup. Header langsung berubah menjadi `"Sisa budget: Rp88.000"` (`100.000 − 12.000`). Seluruh 6 kartu restoran (`R-01` s.d. `R-06`) langsung diperbarui menjadi berbadge `"Sesuai budget"`. |
| **5** | Aktifkan toggle filter `"Sesuai Budget Saya"`. | Keenam restoran (`R-01` s.d. `R-06`) tetap tampil dan live region mengumumkan `"6 restoran"`. |

- **Referensi:**
  - **Cakupan PRD:** `FR-01.1`, `FR-01.2`, `FR-01.3`, `FR-01.6`, `FR-05.3`, `TS-06`.
  - **AC Dokumen Ini:** `AC-01.2`, `AC-01.3`, `AC-01.8`.
  - **Kode `INTERACTION-SPEC`:** Transisi `T6-A`, `T6-B`, `T6-C`, `T6-F`, `validateBudgetInput`.

---

### 3.7 `TS-07`: Perubahan Alamat di Checkout, Pemberitahuan Transparan, dan Invarian Zero-Delta

- **Tujuan:** Memverifikasi bahwa perubahan alamat pengiriman di Checkout menghitung ulang total menggunakan `calculateOrder`, menampilkan dialog modal pemberitahuan transparan (total sebelum, total sesudah, penyebab per komponen, dan perubahan status budget bila terjadi) sebelum pembayaran dapat dilakukan, serta menjaga konsistensi Zero-Delta antara Cart dan Checkout.
- **Prakondisi:** `FIXTURE-DEFAULT` (`budget: 50000`, `spentToday: 12000`, `ADDR-01`).
- **Langkah Aksi & Hasil yang Diharapkan:**

| Langkah | Langkah Aksi | Hasil yang Diharapkan |
|---|---|---|
| **1** | Siapkan Cart Contoh C (`R-02`: `M-201` + `M-203` + `M-204` dengan `V-F01` dan `V-D02`, `TOTAL = Rp28.500`), lalu masuk ke `/checkout`. | Checkout menampilkan alamat `ADDR-01` (`"Kos dekat kampus, Malang (data fiktif)"`), `TOTAL` = `Rp28.500`, `"Sama dengan Keranjang · Selisih Rp0"`, dan tombol `"[Bayar Rp28.500]"`. |
| **2** | Tekan `"[Ubah alamat]"`, pilih `ADDR-02` (`"Rumah teman di Lowokwaru, Malang (data fiktif)"`, `Selisih ongkir: +Rp3.000`), dan tekan `"[Pakai alamat ini]"`. | Muncul dialog `"Total pesananmu berubah"` dengan fokus awal pada `"[Mengerti]"`, menampilkan `Sebelum` = `Rp28.500`, `Sesudah` = `Rp31.500`, `Selisih` = `+Rp3.000`, dan `Penyebab`: `"Alamat diganti ke Rumah teman di Lowokwaru, Malang (data fiktif)"`, `"Ongkos kirim: Rp6.000 → Rp9.000 (+Rp3.000)"`, `"Diskon voucher ongkir: tidak berubah"`. Tombol bayar di latar terkunci (`inert`). |
| **3** | Tekan tombol `"[Kembalikan alamat sebelumnya]"`. | Dialog menutup tanpa pemberitahuan tambahan; alamat kembali ke `ADDR-01` dan total kembali ke `Rp28.500`. |
| **4** | Ulangi langkah 2 untuk memilih `ADDR-02`, lalu pada dialog perubahan total tekan tombol `"[Mengerti]"`. | Dialog menutup; Checkout menampilkan alamat `ADDR-02`, `Ongkos kirim` = `Rp9.000`, `TOTAL` = `Rp31.500`, `"Sama dengan Keranjang · Selisih Rp0"`, tombol `"[Bayar Rp31.500]"`, serta blok `"Perubahan terakhir"` dengan teks `"Total berubah dari Rp28.500 menjadi Rp31.500 karena alamat diganti ke Rumah teman di Lowokwaru, Malang (data fiktif)."`. |
| **5** | Kembali ke `/keranjang` untuk memverifikasi sinkronisasi Cart. | Halaman Cart menampilkan `Ongkos kirim` = `Rp9.000` dan `TOTAL` = `Rp31.500` (identik dengan Checkout, `Delta = Rp0`). |
| **6** | **(Uji perubahan status budget & plafon voucher ongkir)** Reset data demo, tambahkan `M-301` (`Rp18.000`) dari `R-03` tanpa voucher (`TOTAL = Rp25.000`, proyeksi `Rp37.000` / `74%` `OK`), lalu di `/checkout` ubah alamat dari `ADDR-01` ke `ADDR-02` (`+Rp3.000`). | Total naik menjadi `Rp28.000` (`proyeksi = Rp40.000`, tepat `80%` `WARN`), dan dialog perubahan total menampilkan blok perubahan status `"Berubah dari Sesuai budget menjadi Mepet budget (80%)."`. |

- **Referensi:**
  - **Cakupan PRD:** `FR-04.1`, `FR-04.2`, `FR-04.6`, `BR-02`, `BR-03`, `BR-05`, `TS-07`.
  - **AC Dokumen Ini:** `AC-04.1`, `AC-04.2`.
  - **Kode `INTERACTION-SPEC`:** Vektor `A-01`, `A-02`, `A-06`, `A-08`, `A-09`, Transisi `T3-A` s.d. `T3-H`, `buildPendingPriceChange`.

---

### 3.8 `TS-08`: Keadaan Budget Belum Diatur (`budget: null`)

- **Tujuan:** Memverifikasi perilaku aplikasi ketika pengguna belum mengatur budget harian (`budget: null`), memastikan badge budget disembunyikan di kartu restoran, estimasi all-in tetap tampil, filter `"Sesuai Budget Saya"` dinonaktifkan disertai ajakan mengatur budget, dan alur checkout berjalan tanpa dialog `EXCEEDED`.
- **Prakondisi:** Tanam `FIXTURE-BUDGET-NULL` pada `localStorage["tpbg:v1"]` (`budget: null`, `spentToday: 12000`, `ADDR-01`, Cart kosong) lalu muat ulang `/`.
- **Langkah Aksi & Hasil yang Diharapkan:**

| Langkah | Langkah Aksi | Hasil yang Diharapkan |
|---|---|---|
| **1** | Amati header dan bagian atas halaman Home (`/`). | Header menampilkan tombol `"Atur budget"`. Banner ajakan tampil dengan teks `"Atur budget harianmu agar kami bisa menilai restoran yang sesuai."` dan tombol `"[Atur budget]"`. |
| **2** | Amati toggle filter `"Sesuai Budget Saya"` dan coba klik/tekan `Space` pada toggle tersebut. | Toggle berada dalam status nonaktif (`aria-disabled`), teks bantu `"Atur budget untuk memakai filter ini"` tampil di bawahnya, dan klik/tekan tombol tidak menyaring daftar restoran. |
| **3** | Amati keenam kartu restoran (`R-01` s.d. `R-06`) di Home maupun di Search (`/cari`). | Seluruh kartu tetap menampilkan `"Est. Rp{n}, sudah termasuk ongkir dan biaya"`, sedangkan `BudgetBadge` tidak dirender sama sekali. |
| **4** | Buka `/restoran/R-01`, tambahkan 1 porsi `M-101` (`Rp50.000`), buka `/keranjang` lalu `/checkout`, dan tekan `"[Bayar Rp50.000]"`. | Pada Cart dan Checkout, komponen `BudgetTracker` digantikan banner ajakan `"Atur budget"`. Penekanan `"[Bayar Rp50.000]"` langsung menyelesaikan pembayaran simulasi menuju `/struk` tanpa memunculkan dialog `EXCEEDED`. |

- **Referensi:**
  - **Cakupan PRD:** `FR-01.8`, `FR-05.5`, `TS-08`.
  - **AC Dokumen Ini:** `AC-01.1`.
  - **Kode `INTERACTION-SPEC`:** Vektor `D-06`, Transisi `T6-E`, `T4-G`, `getHeaderBudgetView` (`NOT_SET`).

---

## Section 4: Traceability Matrix (Matriks Ketertelusuran)

### 4.1 Kebutuhan → Acceptance Criteria → Skenario Uji → Kode Transisi / Vektor Uji

Tabel berikut memetakan **seluruh** 35 Functional Requirements (`FR-01.1`..`FR-05.5`), 11 Business Rules (`BR-01`..`BR-11`), dan 10 Non-Functional Requirements (`NFR-01`..`NFR-10`) dari `PRD.md` ke Acceptance Criteria dokumen ini, skenario uji E2E, dan kode implementasi/vektor uji pada `INTERACTION-SPEC.md` & `DESIGN-SYSTEM.md`.

| ID Kebutuhan | Ringkasan Kebutuhan / Aturan (`PRD.md`) | Acceptance Criteria | Skenario Uji (`TS`) | Kode Transisi / Vektor / Modul Acuan |
|---|---|---|---|---|
| **FR-01.1** | Pengaturan budget makan harian (input angka bulat Rupiah) | `AC-01.2` | `TS-06` | `T6-A`, `T6-C`, `BUDGET_SAVE`, `src/lib/budget.ts` |
| **FR-01.2** | Header menampilkan sisa budget hari ini (`budget − spentToday`) | `AC-01.2` | `TS-01`, `TS-03`, `TS-06` | `getHeaderBudgetView` (`REMAINING` / `EXCEEDED`), `Header` |
| **FR-01.3** | Toggle filter `"Sesuai Budget Saya"` (`OK` atau `WARN`) | `AC-01.4`, `AC-01.8` | `TS-02`, `TS-06` | `T6-F`, `BUDGET_FILTER_SET`, `filterAndSortRestaurants`, `D-03` |
| **FR-01.4** | Opsi pengurutan `"Termurah (all-in)"` berdasarkan estimasi ascending | `AC-01.5` | — | `T6-F`, `SORT_SET`, `filterAndSortRestaurants`, `D-04`, `D-05` |
| **FR-01.5** | Daftar restoran menampilkan harga net setelah diskon promo | `AC-02.6` | `TS-03` | `getNetPrice`, `estimateRestaurantAllIn`, `D-01` |
| **FR-01.6** | Validasi input budget (`Rp10.000` s.d. `Rp500.000`, bilangan bulat) | `AC-01.3` | `TS-06` | `T6-B`, `validateBudgetInput`, `BUDGET_ERROR_MESSAGES` |
| **FR-01.7** | Budget dan pengeluaran hari ini tersimpan di `localStorage` | `AC-01.7` | `TS-06`, `TS-08` | `savePersistedState`, `loadPersistedState`, `STORAGE_KEY = "tpbg:v1"` |
| **FR-01.8** | Filter `"Sesuai Budget Saya"` nonaktif & ajakan atur budget saat `budget: null` | `AC-01.1` | `TS-08` | `T6-E`, `D-06`, `getHeaderBudgetView` (`NOT_SET`) |
| **FR-02.1** | Status pajak eksplisit pada setiap item menu (`Belum` / `Sudah termasuk pajak`) | `AC-02.1` | `TS-01`, `TS-03`, `TS-05` | `TaxStatus`, `MenuItemCard`, `UX-SPEC` M-1 |
| **FR-02.2** | `PriceNote` ringkas maksimal 2 baris di bawah foto item menu | `AC-02.2` | `TS-01`, `TS-05` | `PriceNote`, `DESIGN-SYSTEM` 3.3 (`≤ 44px` pada `360px`) |
| **FR-02.3** | Estimasi all-in 1 porsi berlabel `"Est."` per item menu | `AC-02.3`, `AC-02.4` | `TS-01`, `TS-03`, `TS-05` | `estimateMenuItemAllIn`, `P-01`, `D-01`, `D-02` |
| **FR-02.4** | Info Sheet menjelaskan pajak, kemasan, ongkir, dan biaya layanan | `AC-02.5` | — | `OVERLAY_OPEN { INFO_SHEET }`, `UX-SPEC` 4.10 |
| **FR-02.5** | Info Sheet dapat dibuka dari `PriceNote` dan header Menu Restoran | `AC-02.5` | — | `useModalBehavior`, `focusReturn`, `UX-SPEC` M-6 |
| **FR-02.6** | Item berdiskon menampilkan harga asli dicoret & estimasi memakai harga net | `AC-02.6` | `TS-03` | `getNetPrice`, `estimateMenuItemAllIn`, `MenuItemCard` |
| **FR-03.1** | Cart sebagai *single authoritative point* kalkulasi harga final | `AC-03.1` | `TS-01`, `TS-02`, `TS-03` | `calculateOrder`, `selectCartView`, `src/lib/pricing.ts` |
| **FR-03.2** | Rincian biaya lengkap di Cart (subtotal, pajak, kemasan, ongkir, layanan, diskon, total) | `AC-03.1` | `TS-01`, `TS-02`, `TS-03`, `TS-05` | `PriceBreakdown`, `P-01`..`P-13`, `UX-SPEC` C-1..C-3 |
| **FR-03.3** | Maksimal 1 voucher makanan dan 1 voucher ongkir bersamaan (penggantian otomatis) | `AC-03.2`, `AC-03.3`, `AC-03.4` | `TS-02`, `TS-03` | `T2-A`, `T2-B`, `VOUCHER_APPLY`, `P-03`, `P-04` |
| **FR-03.4** | Perubahan di Cart memicu kalkulasi ulang instan tanpa reload halaman | `AC-03.2`, `AC-03.6` | `TS-02`, `TS-03`, `TS-04` | `LINE_INCREMENT`, `LINE_DECREMENT`, `LINE_REMOVE`, `VOUCHER_APPLY` |
| **FR-03.5** | Voucher tidak eligible tampil dengan alasan ketidaksesuaian & tidak dapat dipilih | `AC-03.5` | `TS-04` | `T2-D`, `evaluateVoucher`, `voucherReasonMessage`, `E-01`..`E-07` |
| **FR-03.6** | Pelepasan otomatis voucher saat subtotal turun di bawah minimum + pemberitahuan | `AC-03.6` | `TS-04` | `T2-F`, `T2-G`, `reconcileVouchers`, `buildRemovedNotice`, `P-07` |
| **FR-03.7** | Cart hanya berisi item dari 1 restoran; dialog konfirmasi penggantian keranjang | `AC-03.7` | — | `T1-C`, `T1-C1`, `T1-C2`, `CONFIRM_REPLACE_CART` |
| **FR-03.8** | Cart menampilkan `BudgetTracker` real-time | `AC-04.3`, `AC-04.4`, `AC-04.6` | `TS-01`, `TS-02`, `TS-03`, `TS-04`, `TS-05` | `BudgetTracker`, `evaluateBudget`, `selectCartView` |
| **FR-04.1** | Total Checkout dan Struk Payment identik dengan Cart (`Delta = Rp0`) | `AC-04.1`, `AC-04.13` | `TS-01`, `TS-02`, `TS-03`, `TS-07` | `T5-A`, `executePayment`, `buildReceipt`, `PriceBreakdown` |
| **FR-04.2** | Cart dan Checkout menggunakan fungsi kalkulasi `calculateOrder` yang sama | `AC-04.1`, `AC-04.2` | `TS-01`..`TS-03`, `TS-07` | `calculateOrder`, `resolveCart`, `selectCartView` |
| **FR-04.3** | `BudgetTracker` real-time dengan 3 status: `OK` (`<80%`), `WARN` (`80%..100%`), `EXCEEDED` (`>100%`) | `AC-04.3`, `AC-04.4`, `AC-04.5`, `AC-04.6` | `TS-01`..`TS-05` | `evaluateBudget`, `getBudgetStatus`, Tabel Proyeksi `E` |
| **FR-04.4** | Dialog proaktif sebelum pembayaran pada status `EXCEEDED` dengan 3 aksi | `AC-04.7`, `AC-04.8`, `AC-04.9`, `AC-04.10` | `TS-02` | `T4-A`..`T4-D`, `BudgetExceededDialog`, `UX-SPEC` 4.9 |
| **FR-04.5** | Menutup dialog `EXCEEDED` tanpa memilih aksi tidak melanjutkan pembayaran | `AC-04.11` | `TS-02` | `T4-E`, `EXCEEDED_DISMISS`, `escapeStack` |
| **FR-04.6** | Pemberitahuan transparan (sebelum, sesudah, penyebab) saat alamat mengubah total | `AC-04.2` | `TS-07` | `T3-A`..`T3-H`, `ADDRESS_SELECT`, `buildPendingPriceChange`, `A-01`..`A-09` |
| **FR-04.7** | Struk identik dengan Cart & mencatat jumlah melebihi budget saat `"Lanjutkan tetap"` | `AC-04.10` | `TS-02` | `T5-D`, `T5-E`, `Receipt.budgetSnapshot.exceededBy` |
| **FR-04.8** | Pengeluaran hari ini bertambah & header diperbarui setelah pembayaran berhasil | `AC-04.10`, `AC-04.12` | `TS-01`, `TS-02`, `TS-03` | `T5-A`, `T5-H`, `executePayment`, `getHeaderBudgetView` |
| **FR-05.1** | Kartu restoran di Home & Search menampilkan `"Est. RpXX.000, sudah termasuk ongkir dan biaya"` | `AC-02.7` | `TS-01`, `TS-06`, `TS-08` | `RestaurantCard`, `estimateRestaurantAllIn`, `D-01` |
| **FR-05.2** | Kartu menampilkan badge kecocokan budget (`Sesuai` / `Mepet` / `Melebihi budget`) | `AC-02.7` | `TS-01`, `TS-06` | `BudgetBadge`, `BUDGET_STATUS`, `D-01` |
| **FR-05.3** | Status badge mengikuti aturan `BR-08` dan `BR-09` yang sama dengan `BudgetTracker` | `AC-01.8`, `AC-02.7` | `TS-01`, `TS-06` | `evaluateBudget`, `getBudgetStatus` |
| **FR-05.4** | Badge memiliki teks label dan ikon berbentuk berbeda (tidak hanya warna) | `AC-02.7`, `AC-05.4` | `TS-01`, `TS-06` | `BUDGET_STATUS` (`CircleCheck`, `TriangleAlert`, `CircleX`) |
| **FR-05.5** | Badge disembunyikan saat `budget: null`, estimasi all-in tetap tampil | `AC-01.1` | `TS-08` | `evaluateBudget` mengembalikan `null`, `D-06` |
| **BR-01** | Seluruh kalkulasi memakai bilangan bulat Rupiah (tanpa float/desimal) | `AC-03.1`, `AC-05.3` | `TS-01`..`TS-07` | `Rupiah`, `intMath.ts`, `assertRupiah`, `formatRupiah.ts` |
| **BR-02** | Satu fungsi kalkulasi tunggal untuk Cart dan Checkout | `AC-03.1`, `AC-04.1`, `AC-04.2` | `TS-01`..`TS-07` | `calculateOrder` (`src/lib/pricing.ts`) |
| **BR-03** | Invarian Zero-Delta (`Cart total = Checkout total = Payment amount`, `Delta = Rp0`) | `AC-04.1` | `TS-01`..`TS-03`, `TS-07` | `T5-A`, `T5-C`, `Receipt.delta === 0` |
| **BR-04** | Setiap harga turunan sebelum Cart berlabel `"Est."`; harga item disertai status pajak | `AC-02.1`, `AC-02.3`, `AC-02.4` | `TS-01`, `TS-03`, `TS-05` | `PriceNote`, `RestaurantCard` |
| **BR-05** | Perubahan pasca-Cart wajib dihitung ulang dan diberitahukan sebelum pembayaran | `AC-04.2` | `TS-07` | `T3-C`, `T3-F`, `toPersisted` (menahan `addressId` baru hingga `ACK`) |
| **BR-06** | Pembulatan pajak *round half up* (`floorDiv(dasar × 10 + 50, 100)`), diskon persen `floor` | `AC-03.1`, `AC-05.3` | `TS-01`..`TS-04` | `floorDiv`, `calculateOrder`, `computeVoucherDiscount`, Tabel `BR-06` |
| **BR-07** | Aturan voucher (maks. 1 makanan + 1 ongkir, min. subtotal inklusif, plafon, restoran khusus) | `AC-03.2`..`AC-03.6` | `TS-02`, `TS-03`, `TS-04` | `evaluateVoucher`, `computeVoucherDiscount`, `P-03`..`P-13`, `E-01`..`E-07` |
| **BR-08** | Rumus proyeksi budget (`spentToday + nilaiPesanan`) | `AC-01.4`, `AC-04.3`..`AC-04.6` | `TS-01`..`TS-06` | `getProjection` (`src/lib/budget.ts`) |
| **BR-09** | Ambang status budget integer (`<80%` `OK`, `80%..100%` `WARN`, `>100%` `EXCEEDED`) | `AC-01.4`, `AC-04.3`..`AC-04.6` | `TS-01`..`TS-06` | `getBudgetStatus` (`src/lib/budget.ts`), Tabel Proyeksi `E` |
| **BR-10** | Estimasi all-in kartu dari menu andalan 1 porsi langkah 1–5 tanpa voucher | `AC-01.5`, `AC-02.3`, `AC-02.4`, `AC-02.6` | `TS-01`, `TS-03`, `TS-05` | `estimateMenuItemAllIn`, `estimateRestaurantAllIn`, `D-01`, `D-02` |
| **BR-11** | Format mata uang Indonesia (`Rp` tanpa spasi, pemisah ribuan titik, minus `U+2212`) | `AC-05.3` | `TS-01`..`TS-08` | `formatRupiah`, `formatDiscount`, `formatSignedRupiah` |
| **NFR-01** | Responsif `360px`–`1440px` tanpa scroll horizontal, mobile-first | `AC-02.2`, `AC-05.1` | `TS-01`..`TS-08` | `DESIGN-SYSTEM` 4.1, 4.2 & 4.4 (`min-h-[44px]`) |
| **NFR-02** | Kalkulasi ulang `< 100 ms` tanpa reload, pemuatan lokal `< 3 detik` | `AC-01.8`, `AC-03.2`, `AC-05.2` | `TS-02`, `TS-03`, `TS-06` | Fungsi murni $O(n)$ sinkron |
| **NFR-03** | Unit test mencakup seluruh contoh 6.4, batas `WARN`/`EXCEEDED`, voucher, dan pembulatan | `AC-05.3` | `TS-01`..`TS-08` | `INTERACTION-SPEC` 3.10 (`P-01`..`P-13`, `A-01`..`A-09`, `E-01`..`E-07`) |
| **NFR-04** | 100% local mock data tanpa backend, API eksternal, atau aset eksternal | `AC-05.6` | `TS-01`..`TS-08` | `src/data/*`, `Thumbnail` (gradien CSS + emoji) |
| **NFR-05** | Persistensi `localStorage` & aksi `"Reset data demo"` ke profil default Wira | `AC-01.7`, `AC-03.8`, `AC-04.9`, `AC-04.12`, `AC-05.5` | `TS-02`, `TS-06`, `TS-08` | `persistence.ts` (`"tpbg:v1"`), `RESET_REQUESTED`, `RESET_CONFIRM` |
| **NFR-06** | Kompatibilitas lintas peramban modern desktop & mobile | `AC-05.6` | `TS-01`..`TS-08` | `inert`, `ES2020`, `DESIGN-SYSTEM` 1.5 |
| **NFR-07** | Aksesibilitas keyboard, manajemen fokus modal, kontras & non-warna | `AC-02.5`, `AC-02.7`, `AC-05.4` | `TS-02`, `TS-06`, `TS-07` | `src/a11y/*`, `K-01`..`K-12`, `DESIGN-SYSTEM` 2.6 |
| **NFR-08** | Lokalisasi Bahasa Indonesia & format mata uang `BR-11` | `AC-05.3` | `TS-01`..`TS-08` | `UX-SPEC` 5.3, `formatRupiah.ts`, `<html lang="id">` |
| **NFR-09** | Pemisahan logika harga & mock data dari komponen tampilan | `AC-05.7` | — | `src/lib/*`, `src/data/*`, `src/state/*` |
| **NFR-10** | Penanganan error ramah pengguna tanpa crash (input invalid, Cart kosong, storage rusak) | `AC-01.3`, `AC-03.5`, `AC-03.8`, `AC-04.13`, `AC-05.5` | `TS-04`, `TS-06`, `TS-08` | `validateBudgetInput`, `sanitizePersisted` (`S-1`..`S-17`), penjaga rute |

---

### 4.2 Acceptance Criteria → Kebutuhan, Skenario Uji, dan Kode

Tabel berikut memetakan **ke-43 kriteria penerimaan** (`AC-01.1` sampai `AC-05.7`) dari Section 2 secara lengkap.

| ID AC | Judul Kriteria Penerimaan | Kebutuhan (`FR` / `BR` / `NFR`) | `PRD AC` Asal | Skenario Uji (`TS`) | Kode Transisi / Vektor / Modul |
|---|---|---|---|---|---|
| **AC-01.1** | Keadaan Awal Budget Belum Diatur pada Home dan Header | `FR-01.8`, `FR-05.5` | `PRD AC-01.1`, `PRD AC-05.7` | `TS-08` | `T6-E`, `D-06`, `getHeaderBudgetView` (`NOT_SET`) |
| **AC-01.2** | Penyimpanan Budget Harian Valid dan Pembaruan Sisa Budget di Header | `FR-01.1`, `FR-01.2` | `PRD AC-01.2` | `TS-06` | `T6-A`, `T6-C`, `BUDGET_SAVE`, `getHeaderBudgetView` |
| **AC-01.3** | Penolakan Input Budget Tidak Valid dengan Pesan Kesalahan Terkait | `FR-01.6`, `NFR-10` | `PRD AC-01.3` | `TS-06` | `T6-B`, `validateBudgetInput`, `BUDGET_ERROR_MESSAGES` |
| **AC-01.4** | Filter "Sesuai Budget Saya" Menyaring Restoran OK dan WARN (Inklusif 100%) | `FR-01.3`, `BR-08`, `BR-09` | `PRD AC-01.4` | `TS-02`, `TS-06` | `T6-F`, `BUDGET_FILTER_SET`, `filterAndSortRestaurants`, `D-03` |
| **AC-01.5** | Pengurutan "Termurah (all-in)" Menaik Berdasarkan Estimasi All-In | `FR-01.4`, `BR-10` | `PRD AC-01.5` | — | `T6-F`, `SORT_SET`, `filterAndSortRestaurants`, `D-04`, `D-05` |
| **AC-01.6** | Pencarian Kata Kunci Berdasarkan Nama atau Kategori Restoran | `FR-01`, `PRD` 8.2 | — | — | `filterAndSortRestaurants`, `D-07`, `D-08`, `UX-SPEC` 4.2 |
| **AC-01.7** | Persistensi Budget dan Pengeluaran Hari Ini Setelah Refresh Halaman | `FR-01.7`, `NFR-05` | `PRD AC-01.7` | `TS-06`, `TS-08` | `savePersistedState`, `loadPersistedState`, `"tpbg:v1"` |
| **AC-01.8** | Kalibrasi Ulang Badge dan Filter Seketika Saat Budget Diubah | `FR-01.3`, `FR-05.3`, `NFR-02` | `PRD AC-05.4` | `TS-06` | `T6-C`, `BUDGET_SAVE`, `evaluateBudget` |
| **AC-02.1** | Label Status Pajak Eksplisit pada Setiap Item Menu | `FR-02.1`, `BR-04` | `PRD AC-02.1` | `TS-01`, `TS-03`, `TS-05` | `TaxStatus`, `MenuItemCard`, `UX-SPEC` M-1 |
| **AC-02.2** | Price Note Ringkas Maksimal 2 Baris pada Semua Item Menu (`360 px`) | `FR-02.2`, `NFR-01` | `PRD AC-02.2` | `TS-01`, `TS-05` | `PriceNote`, `DESIGN-SYSTEM` 3.3 |
| **AC-02.3** | Kalkulasi Estimasi All-In 1 Porsi Item Belum Termasuk Pajak (`M-101`) | `FR-02.3`, `BR-04`, `BR-06`, `BR-10` | `PRD AC-02.3` | `TS-01` | `estimateMenuItemAllIn`, `P-01`, `D-01` |
| **AC-02.4** | Kalkulasi Estimasi All-In 1 Porsi Item Sudah Termasuk Pajak (`M-104`) | `FR-02.3`, `BR-04`, `BR-10` | `PRD AC-02.4` | — | `estimateMenuItemAllIn`, `D-02` |
| **AC-02.5** | Info Sheet Komponen Biaya Dapat Dibuka dan Ditutup dengan Pengembalian Fokus | `FR-02.4`, `FR-02.5`, `NFR-07` | `PRD AC-02.5` | — | `OVERLAY_OPEN { INFO_SHEET }`, `useModalBehavior` |
| **AC-02.6** | Tampilan Harga Asli, Harga Net, dan Estimasi Berbasis Harga Net untuk Item Berdiskon | `FR-01.5`, `FR-02.6`, `BR-10` | `PRD AC-01.6`, `PRD AC-02.6` | `TS-03` | `getNetPrice`, `estimateMenuItemAllIn`, `D-01` |
| **AC-02.7** | Kartu Preview All-In dan Badge Kecocokan Budget Non-Warna di Home dan Search | `FR-05.1`..`FR-05.4`, `NFR-07` | `PRD AC-05.1`..`05.3`, `05.5`..`05.6` | `TS-01`, `TS-06` | `RestaurantCard`, `BudgetBadge`, `BUDGET_STATUS`, `D-01` |
| **AC-03.1** | Rincian Biaya Otoritatif di Cart dengan Item Campuran Pajak | `FR-03.1`, `FR-03.2`, `BR-01`, `BR-02`, `BR-06` | `PRD AC-03.1` | `TS-02` | `calculateOrder`, `P-02`, `PriceBreakdown` |
| **AC-03.2** | Penerapan Voucher Makanan dan Kalkulasi Ulang Instan Tanpa Reload | `FR-03.3`, `FR-03.4`, `BR-07`, `NFR-02` | `PRD AC-03.2` | `TS-02` | `T2-A`, `VOUCHER_APPLY`, `P-03` |
| **AC-03.3** | Kombinasi Multi-Voucher (1 Voucher Makanan + 1 Voucher Ongkir) dan Plafon Ongkir | `FR-03.3`, `BR-07` (a)(d) | `PRD AC-03.3` | `TS-02`, `TS-03` | `T2-A`, `computeVoucherDiscount`, `P-04`, `P-05`, `P-12` |
| **AC-03.4** | Penggantian Otomatis Voucher Makanan Kedua dengan Pemberitahuan Inline | `FR-03.3`, `BR-07` (a) | `PRD AC-03.4` | — | `T2-B`, `VOUCHER_APPLY`, `buildReplacedNotice`, `P-10` |
| **AC-03.5** | Penampilan Voucher Tidak Eligible Beserta Alasan Eksak dan Pencegahan Pemilihan | `FR-03.5`, `BR-07` (b)(e), `NFR-10` | `PRD AC-03.5` | `TS-04` | `T2-D`, `evaluateVoucher`, `voucherReasonMessage`, `E-01`..`E-07` |
| **AC-03.6** | Pelepasan Otomatis Voucher Saat Subtotal Turun di Bawah Minimum Belanja | `FR-03.6`, `BR-07` (b) | `PRD AC-03.6` | `TS-04` | `T2-F`, `T2-G`, `reconcileVouchers`, `buildRemovedNotice`, `P-07` |
| **AC-03.7** | Guardrail Keranjang Tunggal Restoran dengan Dialog Konfirmasi Penggantian | `FR-03.7` | `PRD AC-03.7` | — | `T1-C`, `T1-C1`, `T1-C2`, `CONFIRM_REPLACE_CART` |
| **AC-03.8** | Keadaan Cart Kosong dan Penonaktifan Tombol Checkout | `FR-03`, `NFR-10` | `PRD AC-03.8` | — | `T1-D3`, `T1-D4`, `CART_CLEAR`, `EmptyState` |
| **AC-04.1** | Invarian Zero-Delta (`Delta = Rp0`) dari Cart ke Checkout Hingga Struk Payment | `FR-04.1`, `FR-04.2`, `BR-02`, `BR-03` | `PRD AC-04.1` | `TS-01`, `TS-02`, `TS-03`, `TS-07` | `T5-A`, `calculateOrder`, `executePayment`, `Receipt` |
| **AC-04.2** | Simulasi Perubahan Alamat di Checkout dengan Pemberitahuan Transparan dan Sinkronisasi Cart | `FR-04.6`, `FR-04.2`, `BR-02`, `BR-05` | `PRD AC-04.2` | `TS-07` | `T3-A`..`T3-H`, `ADDRESS_SELECT`, `buildPendingPriceChange`, `A-01`..`A-09` |
| **AC-04.3** | Status Budget Tracker `OK` (`< 80%`) | `FR-03.8`, `FR-04.3`, `BR-08`, `BR-09` | `PRD AC-04.5` | `TS-04`, `TS-05` | `evaluateBudget`, `getBudgetStatus`, `BudgetTracker` |
| **AC-04.4** | Status Budget Tracker `WARN` (`80%` sampai `< 100%`) | `FR-03.8`, `FR-04.3`, `BR-08`, `BR-09` | `PRD AC-04.3` | `TS-03` | `evaluateBudget`, `getBudgetStatus`, `P-05`, `BudgetTracker` |
| **AC-04.5** | Kasus Batas Tepat `100%` Termasuk Status `WARN` (Bukan `EXCEEDED`) | `FR-04.3`, `BR-09` | `PRD AC-04.6` | `TS-01` | `getBudgetStatus`, `T4-F`, Tabel Proyeksi `E` |
| **AC-04.6** | Status Budget Tracker `EXCEEDED` (`> 100%`) | `FR-03.8`, `FR-04.3`, `BR-08`, `BR-09` | `PRD AC-04.4` | `TS-02` | `evaluateBudget`, `getBudgetStatus`, `P-04`, `BudgetTracker` |
| **AC-04.7** | Kemunculan Dialog Konfirmasi Proaktif Sebelum Pembayaran pada Status `EXCEEDED` | `FR-04.4` | `PRD AC-04.7` | `TS-02` | `T4-A`, `PAY_REQUESTED`, `BudgetExceededDialog` |
| **AC-04.8** | Aksi "Ubah pesanan" pada Dialog `EXCEEDED` Mengembalikan Pengguna ke Cart | `FR-04.4` | `PRD AC-04.8` | `TS-02` | `T4-B`, `EXCEEDED_CHANGE_ORDER` |
| **AC-04.9** | Aksi "Lihat yang sesuai budget" pada Dialog `EXCEEDED` Mengaktifkan Filter di Home Tanpa Menghapus Cart | `FR-04.4`, `NFR-05` | `PRD AC-04.9` | `TS-02` | `T4-C`, `EXCEEDED_SHOW_AFFORDABLE` |
| **AC-04.10** | Aksi "Lanjutkan tetap" pada Dialog `EXCEEDED` Melanjutkan Pembayaran dan Mencatat Kelebihan Budget di Struk | `FR-04.4`, `FR-04.7`, `FR-04.8` | `PRD AC-04.10` | `TS-02` | `T4-D`, `T5-D`, `T5-H`, `EXCEEDED_CONTINUE` |
| **AC-04.11** | Menutup Dialog `EXCEEDED` Tanpa Memilih Aksi Membatalkan Eksekusi Pembayaran | `FR-04.5` | `PRD AC-04.11` | `TS-02` | `T4-E`, `EXCEEDED_DISMISS` |
| **AC-04.12** | Pembaruan Pengeluaran Hari Ini dan Sisa Budget di Header Setelah Pembayaran Berhasil | `FR-04.8`, `NFR-05` | `PRD AC-04.12` | `TS-01`, `TS-02`, `TS-03` | `T5-A`, `T5-E`, `T5-G`, `executePayment` |
| **AC-04.13** | Perlindungan Anti-Double-Submit dan Penjaga Rute Checkout / Struk | `FR-04.1`, `NFR-10` | — | — | `T5-B`, `T5-F`, `T5-G`, `createReceiptId`, `ROUTE_CHANGED` |
| **AC-05.1** | Tata Letak Responsif Mobile-First `360 px` hingga `1440 px` Tanpa Scroll Horizontal | `NFR-01` | — | `TS-01`..`TS-08` | `DESIGN-SYSTEM` 4.1, 4.2 & 4.4 (`min-h-[44px]`) |
| **AC-05.2** | Performa Kalkulasi Ulang Instan (`< 100 ms`) dan Kinerja Pemuatan Lokal | `NFR-02` | — | `TS-02`, `TS-03`, `TS-06` | `calculateOrder`, `filterAndSortRestaurants`, `selectCartView` |
| **AC-05.3** | Kebenaran Deterministik Bilangan Bulat Rupiah dan Pembulatan (`BR-01`, `BR-06`, `BR-11`) | `NFR-03`, `NFR-08`, `BR-01`, `BR-06`, `BR-11` | — | `TS-01`..`TS-08` | `formatRupiah.ts`, `intMath.ts`, `pricing.ts`, `P-01`..`P-13` |
| **AC-05.4** | Operabilitas Keyboard Penuh, Focus Trap Modal, dan Pengumuman Live Region (WCAG 2.1 AA) | `NFR-07`, `FR-05.4` | — | `TS-02`, `TS-06`, `TS-07` | `src/a11y/*`, `K-01`..`K-12`, `DESIGN-SYSTEM` 2.6 |
| **AC-05.5** | Ketahanan Persistensi, Sanitasi Data Rusak, dan Reset Data Demo Atomik | `NFR-05`, `NFR-10` | — | `TS-06`, `TS-08` | `loadPersistedState`, `sanitizePersisted` (`S-1`..`S-17`), `RESET_CONFIRM` |
| **AC-05.6** | Isolasi Data Lokal Tanpa Backend dan Kompatibilitas Lintas Peramban | `NFR-04`, `NFR-06` | — | `TS-01`..`TS-08` | `src/data/*`, `Thumbnail` (gradien CSS + emoji) |
| **AC-05.7** | Pemisahan Bersih Logika Domain dari Komponen Tampilan (`Maintainability`) | `NFR-09` | — | — | `src/lib/*`, `src/data/*`, `src/state/*` (`strict: true`) |

---

### 4.3 Skenario Uji → Acceptance Criteria, Kebutuhan, dan Kode

| ID Skenario | Nama Skenario Uji (`PRD.md` 9.5) | Acceptance Criteria yang Diuji | Kebutuhan (`FR` / `BR` / `NFR`) | Kode Transisi / Vektor / Fixture |
|---|---|---|---|---|
| **TS-01** | Worked Example dan Batas Atas Status `WARN` (Tepat 100%) | `AC-02.1`, `AC-02.2`, `AC-02.3`, `AC-02.7`, `AC-04.1`, `AC-04.5`, `AC-04.12`, `AC-05.1`, `AC-05.3`, `AC-05.6` | `FR-01.2`, `FR-02.1`..`02.3`, `FR-03.1`, `FR-03.2`, `FR-04.1`..`04.3`, `FR-04.8`, `FR-05.1`..`05.4`, `BR-01`..`BR-04`, `BR-06`, `BR-08`..`BR-11`, `NFR-01`, `NFR-03`, `NFR-04`, `NFR-08` | `FIXTURE-DEFAULT`, `FIXTURE-SPENT-0`, `P-01`, `D-01`, Tabel `E` (`100% WARN`), `T1-A`, `T4-F`, `T5-A` |
| **TS-02** | Cart R-01 Melebihi Budget (`EXCEEDED`) dan Dialog Guardrail Proaktif | `AC-01.4`, `AC-03.1`, `AC-03.2`, `AC-03.3`, `AC-04.1`, `AC-04.6`, `AC-04.7`, `AC-04.8`, `AC-04.9`, `AC-04.10`, `AC-04.11`, `AC-04.12`, `AC-05.1`..`AC-05.4`, `AC-05.6` | `FR-01.3`, `FR-03.1`..`03.4`, `FR-03.8`, `FR-04.1`..`04.5`, `FR-04.7`, `FR-04.8`, `BR-01`..`BR-03`, `BR-06`..`BR-09`, `BR-11`, `NFR-01`..`NFR-05`, `NFR-07`, `NFR-08` | `FIXTURE-DEFAULT`, `P-02`, `P-03`, `P-04`, `T2-A`, `T4-A`..`T4-E`, `T5-D`, `T5-H` |
| **TS-03** | Cart R-02 di Batas `WARN` (81%) dan Jalur Pembayaran Normal | `AC-02.1`, `AC-02.6`, `AC-03.3`, `AC-04.1`, `AC-04.4`, `AC-04.12`, `AC-05.1`..`AC-05.3`, `AC-05.6` | `FR-01.2`, `FR-01.5`, `FR-02.1`, `FR-02.3`, `FR-02.6`, `FR-03.1`..`03.4`, `FR-03.8`, `FR-04.1`..`04.3`, `FR-04.8`, `BR-01`..`BR-04`, `BR-06`..`BR-11`, `NFR-01`..`NFR-04`, `NFR-08` | `FIXTURE-DEFAULT`, `P-05`, `P-06`, Tabel `E` (`81% WARN`), `T2-A`, `T4-F`, `T5-A`, `T5-E` |
| **TS-04** | Pelepasan Otomatis Voucher Saat Subtotal Turun di Bawah Minimum Belanja | `AC-03.5`, `AC-03.6`, `AC-04.3`, `AC-05.1`, `AC-05.3`, `AC-05.6` | `FR-03.4`, `FR-03.5`, `FR-03.6`, `FR-03.8`, `FR-04.3`, `BR-01`, `BR-06`..`BR-09`, `BR-11`, `NFR-01`, `NFR-03`, `NFR-04`, `NFR-08`, `NFR-10` | `FIXTURE-DEFAULT`, `P-07`, `E-01`, `T1-D2`, `T2-D`, `T2-F` |
| **TS-05** | Cart R-03 dengan Seluruh Item Sudah Termasuk Pajak (`Pajak Rp0`, Status `OK`) | `AC-02.1`, `AC-02.2`, `AC-04.3`, `AC-05.1`, `AC-05.3`, `AC-05.6` | `FR-02.1`..`02.3`, `FR-03.2`, `FR-03.8`, `FR-04.3`, `BR-01`, `BR-02`, `BR-04`, `BR-08`..`BR-11`, `NFR-01`, `NFR-03`, `NFR-04`, `NFR-08` | `FIXTURE-DEFAULT`, `P-08`, `D-01`, `UX-SPEC` C-3 |
| **TS-06** | Perubahan Budget Menjadi `Rp100.000` dan Kalibrasi Ulang Badge serta Filter | `AC-01.2`, `AC-01.3`, `AC-01.4`, `AC-01.7`, `AC-01.8`, `AC-02.7`, `AC-05.1`..`AC-05.6` | `FR-01.1`..`01.3`, `FR-01.6`, `FR-01.7`, `FR-05.1`..`05.4`, `BR-01`, `BR-08`, `BR-09`, `BR-11`, `NFR-01`..`NFR-05`, `NFR-07`, `NFR-08`, `NFR-10` | `FIXTURE-DEFAULT`, `T6-A`, `T6-B`, `T6-C`, `T6-F`, `validateBudgetInput` |
| **TS-07** | Perubahan Alamat di Checkout, Pemberitahuan Transparan, dan Invarian Zero-Delta | `AC-04.1`, `AC-04.2`, `AC-05.1`, `AC-05.3`, `AC-05.4`, `AC-05.6` | `FR-04.1`, `FR-04.2`, `FR-04.6`, `BR-01`..`BR-03`, `BR-05`, `BR-07(d)`, `BR-08`, `BR-09`, `BR-11`, `NFR-01`, `NFR-03`, `NFR-04`, `NFR-07`, `NFR-08` | `FIXTURE-DEFAULT`, `A-01`, `A-02`, `A-06`, `A-08`, `A-09`, `T3-A`..`T3-H`, `buildPendingPriceChange` |
| **TS-08** | Keadaan Budget Belum Diatur (`budget: null`) | `AC-01.1`, `AC-01.7`, `AC-05.1`, `AC-05.3`, `AC-05.5`, `AC-05.6` | `FR-01.7`, `FR-01.8`, `FR-05.1`, `FR-05.5`, `BR-04`, `BR-10`, `BR-11`, `NFR-01`, `NFR-03`..`NFR-05`, `NFR-08`, `NFR-10` | `FIXTURE-BUDGET-NULL`, `D-06`, `T6-E`, `T4-G`, `getHeaderBudgetView` (`NOT_SET`) |

---

### 4.4 Konkordansi AC `PRD.md` Section 7 ↔ AC Dokumen Ini

Tabel konkordansi berikut memetakan **seluruh 40 kriteria penerimaan** pada `PRD.md` Section 7 (`PRD AC-01.1` sampai `PRD AC-05.7`) ke **43 kriteria penerimaan** pada `ACCEPTANCE-CRITERIA.md` (`AC-01.1` sampai `AC-05.7`) beserta catatan perluasan spesifikasinya.

| ID di `PRD.md` Section 7 | ID di `ACCEPTANCE-CRITERIA.md` | Keterangan Pemetaan & Penyelarasan |
|---|---|---|
| `PRD AC-01.1` | `AC-01.1` | Pemetaan langsung 1:1 (keadaan awal `budget: null` pada Home & header). |
| `PRD AC-01.2` | `AC-01.2` | Pemetaan langsung 1:1 (simpan `budget = 50000` & perbarui sisa budget header). |
| `PRD AC-01.3` | `AC-01.3` | Pemetaan langsung 1:1 (penolakan input kosong, desimal, `< Rp10.000`, `> Rp500.000`). |
| `PRD AC-01.4` | `AC-01.4` | Pemetaan langsung 1:1 (filter `"Sesuai Budget Saya"` menyisakan `R-03`, `R-02`, `R-04`, `R-06`). |
| `PRD AC-01.5` | `AC-01.5` | Pemetaan langsung 1:1 (urutan `"Termurah (all-in)"`: `R-03`, `R-02`, `R-04`, `R-06`, `R-05`, `R-01`). |
| `PRD AC-01.6` | `AC-02.6` | Dikonsolidasikan bersama `PRD AC-02.6` untuk item berdiskon (`M-201` net `Rp15.000`, `M-501` net `Rp19.000`) baik pada kartu restoran maupun menu. |
| `PRD AC-01.7` | `AC-01.7` | Pemetaan langsung 1:1 (persistensi `budget` dan `spentToday` pada `localStorage["tpbg:v1"]`). |
| *(Baru dari `PRD` 8.2 & `UX-SPEC` 4.2)* | `AC-01.6` | Kriteria tambahan untuk pencarian kata kunci nama/kategori restoran pada Home & Search. |
| `PRD AC-02.1` | `AC-02.1` | Pemetaan langsung 1:1 (label teks status pajak pada `M-101` dan `M-104`). |
| `PRD AC-02.2` | `AC-02.2` | Pemetaan langsung 1:1 (`PriceNote` maksimal 2 baris `≤ 44px` di bawah status pajak). |
| `PRD AC-02.3` | `AC-02.3` | Pemetaan langsung 1:1 (estimasi 1 porsi `M-101` = `"Est. all-in 1 porsi: Rp50.000."`). |
| `PRD AC-02.4` | `AC-02.4` | Pemetaan langsung 1:1 (estimasi 1 porsi `M-104` sudah termasuk pajak = `"Est. all-in 1 porsi: Rp25.000."`). |
| `PRD AC-02.5` | `AC-02.5` | Pemetaan langsung 1:1 (pembukaan, konten, penutupan, dan pengembalian fokus Info Sheet). |
| `PRD AC-02.6` | `AC-02.6` | Pemetaan langsung 1:1 (harga asli dicoret + harga net + estimasi berbasis harga net). |
| `PRD AC-03.1` | `AC-03.1` | Pemetaan langsung 1:1 (rincian biaya Cart `R-01`: `M-101` + `M-104` = `Rp60.000`). |
| `PRD AC-03.2` | `AC-03.2` | Pemetaan langsung 1:1 (pasang `V-F01` `−Rp5.000` → total `Rp55.000` instan tanpa reload). |
| `PRD AC-03.3` | `AC-03.3` | Pemetaan langsung 1:1 (kombinasi `V-F01` + `V-D01` `−Rp8.000` → total `Rp47.000`). |
| `PRD AC-03.4` | `AC-03.4` | Pemetaan langsung 1:1 (penggantian otomatis voucher makanan kedua dengan banner inline `UX-SPEC` C-5). |
| `PRD AC-03.5` | `AC-03.5` | Pemetaan langsung 1:1 (`V-F01` pada subtotal `Rp20.000` menampilkan `"Kurang Rp5.000 dari minimum belanja."`). |
| `PRD AC-03.6` | `AC-03.6` | Pemetaan langsung 1:1 (pelepasan otomatis `V-F01` saat subtotal turun di bawah `Rp25.000` dengan banner inline). |
| `PRD AC-03.7` | `AC-03.7` | Pemetaan langsung 1:1 (dialog `"Ganti keranjang?"` saat menambah item dari restoran berbeda). |
| `PRD AC-03.8` | `AC-03.8` | Pemetaan langsung 1:1 (`EmptyState` `"Keranjangmu kosong."`, tautan `"[Lihat restoran]"`, checkout nonaktif). |
| `PRD AC-04.1` | `AC-04.1` | Pemetaan langsung 1:1 (Zero-Delta `Rp47.000` dari Cart ke Checkout hingga Struk Payment). |
| `PRD AC-04.2` | `AC-04.2` | Pemetaan langsung 1:1 (perubahan alamat di Checkout memunculkan dialog perubahan total & menyinkronkan Cart). |
| `PRD AC-04.3` | `AC-04.4` | Penomoran diurutkan progresif berdasarkan tingkat status (`OK` → `WARN` → `100%` → `EXCEEDED`): `PRD AC-04.3` (Contoh C `81%` `WARN`) dipetakan ke `AC-04.4`. |
| `PRD AC-04.4` | `AC-04.6` | `PRD AC-04.4` (Contoh B `118%` `EXCEEDED`) dipetakan ke `AC-04.6`. |
| `PRD AC-04.5` | `AC-04.3` | `PRD AC-04.5` (status `OK` `< 80%`, mis. proyeksi `Rp32.000` / `64%`) dipetakan ke `AC-04.3`. |
| `PRD AC-04.6` | `AC-04.5` | `PRD AC-04.6` (kasus batas tepat `100%` `Rp50.000` = `WARN`) dipetakan ke `AC-04.5`. |
| `PRD AC-04.7` | `AC-04.7` | Pemetaan langsung 1:1 (dialog `EXCEEDED` muncul sebelum pembayaran dengan 3 aksi). |
| `PRD AC-04.8` | `AC-04.8` | Pemetaan langsung 1:1 (aksi `"[Ubah pesanan]"` kembali ke `/keranjang` tanpa pembayaran). |
| `PRD AC-04.9` | `AC-04.9` | Pemetaan langsung 1:1 (aksi `"[Lihat yang sesuai budget]"` ke `/` dengan filter aktif & Cart tetap tersimpan). |
| `PRD AC-04.10` | `AC-04.10` | Pemetaan langsung 1:1 (aksi `"[Lanjutkan tetap]"` ke `/struk` dengan catatan kelebihan budget). |
| `PRD AC-04.11` | `AC-04.11` | Pemetaan langsung 1:1 (menutup dialog `EXCEEDED` tanpa aksi membatalkan eksekusi pembayaran). |
| `PRD AC-04.12` | `AC-04.12` | Pemetaan langsung 1:1 (`spentToday` bertambah menjadi `Rp40.500` & header menampilkan `"Sisa budget: Rp9.500"`). |
| *(Baru dari `INTERACTION-SPEC` 4.1 & 4.6)* | `AC-04.13` | Kriteria tambahan untuk perlindungan idempotensi anti-double-submit (`receiptId`) dan penjaga rute `/checkout` serta `/struk`. |
| `PRD AC-05.1` | `AC-02.7` | Dikonsolidasikan ke `AC-02.7` (format teks `"Est. Rp25.000, sudah termasuk ongkir dan biaya"` & badge `"Sesuai budget"` pada `R-03`). |
| `PRD AC-05.2` | `AC-02.7` | Dikonsolidasikan ke `AC-02.7` (badge `"Mepet budget"` pada `R-04` dan `R-06`). |
| `PRD AC-05.3` | `AC-02.7` | Dikonsolidasikan ke `AC-02.7` (badge `"Melebihi budget"` pada `R-05` dan `R-01`). |
| `PRD AC-05.4` | `AC-01.8` | Dipetakan ke `AC-01.8` (kalibrasi ulang seluruh badge dan filter di Home seketika saat budget diubah ke `Rp100.000`). |
| `PRD AC-05.5` | `AC-02.7` | Dikonsolidasikan ke `AC-02.7` (kesamaan format estimasi dan badge pada kartu di Search dan Home). |
| `PRD AC-05.6` | `AC-02.7`, `AC-05.4` | Dipetakan ke `AC-02.7` dan `AC-05.4` (status disampaikan lewat teks label + ikon berbeda bentuk, bukan warna semata). |
| `PRD AC-05.7` | `AC-01.1` | Dipetakan ke `AC-01.1` (badge disembunyikan saat `budget: null`, estimasi all-in tetap tampil). |
| *(Baru dari `PRD` Section 8.1)* | `AC-05.1` s.d. `AC-05.7` | Tujuh kriteria penerimaan non-fungsional yang menguji seluruh `NFR-01` sampai `NFR-10` secara eksplisit dan terukur. |

---

*Akhir dokumen ACCEPTANCE-CRITERIA TPBG v1.0.0*