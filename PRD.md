# Product Requirements Document (PRD)

# ShopeeFood Transparent Pricing and Budget Guardrail (TPBG)

---

## Section 1: Document Overview dan Project Metadata

### 1.1 Metadata Proyek

| Atribut | Keterangan |
|---|---|
| **Project Title** | ShopeeFood Transparent Pricing and Budget Guardrail (TPBG) |
| **Mata Kuliah** | Rekayasa Interaksi (Interaction Engineering) |
| **Author** | Muhammad Arifin (NIM: 202310370311054) |
| **Institusi** | Teknik Informatika, Universitas Muhammadiyah Malang |
| **Document Version** | 1.0.0 |
| **Status Dokumen** | Draft untuk review dosen dan tim |
| **Tanggal** | 18 November 2026 |
| **Jenis Deliverable** | Standalone Responsive Web Application (prototype) |
| **Tech Stack Target** | React, Vite, Tailwind CSS, dan local mock data (tanpa backend) |

### 1.2 Tujuan Dokumen

Dokumen ini mendefinisikan **apa** yang harus dilakukan oleh fitur TPBG dan **mengapa** fitur ini dibutuhkan: masalah, persona, tujuan, functional requirements, business rules, user stories, acceptance criteria, dan batasan scope.

Dokumen ini **tidak** membahas:

- Visual design system, wireframe, dan micro-interaction (dibahas di dokumen UX/Design).
- Arsitektur teknis dan struktur kode (dibahas di dokumen Engineering).

### 1.3 Disclaimer

TPBG adalah prototype akademik untuk keperluan mata kuliah. Proyek ini **tidak berafiliasi** dengan Shopee atau ShopeeFood. Seluruh data restoran, menu, harga, voucher, dan biaya pada dokumen ini bersifat fiktif (mock data).

### 1.4 Glosarium Singkat

| Istilah | Definisi |
|---|---|
| **KU** | Kebutuhan Pengguna hasil UX research (KU-1 sampai KU-5) |
| **Hidden Costs** | Biaya wajib (ongkir, pajak restoran, biaya layanan, biaya kemasan) yang baru terlihat lengkap di layar akhir |
| **Cart Abandonment** | Pengguna meninggalkan atau membatalkan keranjang sebelum pembayaran |
| **All-in Price** | Harga yang sudah mencakup seluruh biaya wajib dan diskon yang eligible |
| **Delta** | Selisih total antara dua tahap (Cart vs Checkout vs Payment) |
| **Budget Guardrail** | Mekanisme pemantau dan pengingat agar pengeluaran tidak melewati budget harian |
| **Est.** | Label untuk setiap harga turunan yang ditampilkan sebelum layar Cart |

### 1.5 Riwayat Revisi

| Versi | Tanggal | Perubahan | Author |
|---|---|---|---|
| 1.0.0 | 18 Nov 2026 | Versi awal PRD | Muhammad Arifin |

---

## Section 2: Background, Problem Statement, dan Worked Example

### 2.1 Latar Belakang

Aplikasi pesan-antar makanan menampilkan harga menu di halaman Home dan Menu, sedangkan biaya wajib lainnya (ongkir, pajak restoran, biaya layanan, dan biaya kemasan) baru muncul lengkap di layar Checkout. Bagi pengguna dengan budget ketat, perbedaan antara harga yang dilihat di awal dan total akhir membuat mereka sulit merencanakan pengeluaran.

### 2.2 Problem Statement

> Pengguna sering mengalami **Hidden Costs** yang baru muncul secara kumulatif di layar checkout akhir. Hal ini menyebabkan **financial shock** dan berujung pada **Cart Abandonment**.

Akar masalah yang ditangani oleh TPBG:

1. **Harga awal tidak representatif.** Harga di listing dan menu tidak menggambarkan total yang benar-benar dibayar.
2. **Status pajak tidak jelas.** Pengguna tidak tahu apakah harga menu sudah atau belum termasuk pajak.
3. **Kalkulasi tersebar.** Tidak ada satu titik yang jelas sebagai sumber kebenaran angka final.
4. **Tidak ada pengaman budget.** Pengguna baru sadar melewati budget setelah semua keputusan diambil.
5. **Perbandingan antar restoran sulit.** Pengguna tidak bisa membandingkan harga all-in tanpa menghitung manual.

### 2.3 Worked Example

Seorang mahasiswa melihat **Paket Ayam Bakar Promo** seharga **Rp30.000** pada halaman menu, lalu memilihnya dengan harapan membayar sekitar Rp30.000. Di checkout, biaya wajib ditambahkan:

| Komponen | Nominal |
|---|---:|
| Harga menu | Rp30.000 |
| Pajak restoran (10%) | Rp3.000 |
| Biaya kemasan | Rp2.000 |
| Ongkos kirim | Rp12.000 |
| Biaya layanan | Rp3.000 |
| **Total di checkout** | **Rp50.000** |

Total akhir naik **Rp20.000 (sekitar 66 persen)** dari harga yang diiklankan. Pengguna terpaksa membatalkan pesanan atau membangun ulang keranjang.

**Bagaimana TPBG mengubah pengalaman ini:** sejak halaman Home, pengguna sudah melihat "Est. Rp50.000, sudah termasuk ongkir dan biaya" dengan badge kecocokan budget. Di menu, tiap item menampilkan status pajak dan estimasi all-in. Di Cart, rincian lengkap muncul dan total yang sama dipakai persis di Checkout dan Payment.

---

## Section 3: Product Goals dan Success Metrics

### 3.1 Product Goals

| ID | Goal | Terkait |
|---|---|---|
| G-01 | Pengguna dapat menemukan restoran yang sesuai budget tanpa menghitung manual | FR-01, FR-05 |
| G-02 | Pengguna memahami komponen harga (terutama pajak) sebelum menambahkan item ke Cart | FR-02 |
| G-03 | Pengguna melihat rincian biaya yang transparan dan lengkap di satu titik otoritatif (Cart) | FR-03 |
| G-04 | Tidak ada selisih harga antara Cart, Checkout, dan Payment (Zero-Delta) | FR-04 |
| G-05 | Pengguna mendapat peringatan proaktif sebelum membayar pesanan yang melebihi budget | FR-04 |
| G-06 | Pengguna dapat membandingkan harga all-in antar restoran langsung dari kartu listing | FR-05 |

### 3.2 Success Metrics

Karena deliverable adalah prototype tanpa trafik pengguna nyata, metrik diukur lewat **usability testing** dan **automated test**. Metrik bisnis (di bawah) hanya hipotesis untuk implementasi nyata di masa depan.

**A. Metrik yang diukur pada prototype**

| ID | Metrik | Target | Metode Pengukuran |
|---|---|---|---|
| M-01 | Zero-Delta compliance: Cart total = Checkout total = Payment amount | 100% pada seluruh skenario uji | Automated unit test fungsi kalkulasi dan skenario end-to-end |
| M-02 | Task success: "Temukan restoran yang muat budget dan masuk ke Cart" | ≥ 90% peserta berhasil | Usability test (minimal 5 peserta) |
| M-03 | Persepsi kejutan harga: "Total akhir sesuai dengan harapan saya" (Likert 1–5) | Rata-rata ≥ 4,0 | Kuesioner pasca-tes |
| M-04 | Peserta dapat menyebutkan komponen biaya pesanan setelah melihat Cart | ≥ 80% menyebutkan minimal 4 komponen | Wawancara singkat pasca-tes |
| M-05 | Peserta menyadari pesanan melebihi budget sebelum membayar | 100% pada skenario EXCEEDED | Observasi usability test |
| M-06 | System Usability Scale (SUS) | ≥ 68 | Kuesioner SUS |
| M-07 | Kebenaran kalkulasi pada seluruh mock data | 100% sesuai tabel contoh perhitungan | Unit test |

**B. Hipotesis metrik bisnis (tidak diukur di prototype)**

| Metrik | Arah yang diharapkan |
|---|---|
| Cart abandonment rate pada tahap checkout | Menurun |
| Rasio pembatalan pesanan akibat kejutan harga | Menurun |
| Konversi dari listing ke checkout | Meningkat |

---

## Section 4: Target User Persona (Wira)

### 4.1 Profil

| Atribut | Keterangan |
|---|---|
| **Nama** | Wira |
| **Usia** | 21 tahun |
| **Peran** | Mahasiswa sekaligus pekerja paruh waktu |
| **Konteks** | Memesan makanan beberapa kali per minggu, sering saat jam kuliah atau selesai kerja |
| **Perangkat utama** | Smartphone (browser mobile), kadang laptop |

### 4.2 Perilaku

- Mengelola **budget makan harian** yang ketat.
- **Menghitung pengeluaran terlebih dahulu** sebelum memesan.
- **Membandingkan harga all-in** antar restoran.
- **Sensitif terhadap selisih harga kecil**, karena selisih beberapa ribu rupiah berarti di budget harian.

### 4.3 Pain Points

| Pain Point | Dampak |
|---|---|
| Merasa "dijebak" oleh biaya kejutan di checkout | Hilang kepercayaan pada platform |
| Berisiko melewati budget harian tanpa sadar | Tekanan finansial akhir bulan |
| Membuang waktu membatalkan dan menyusun ulang pesanan | Frustrasi dan waktu terbuang |

### 4.4 Kebutuhan dan Pemetaan ke Fitur

| Kebutuhan Wira | Fitur |
|---|---|
| "Saya ingin tahu restoran mana yang muat budget saya" | FR-01, FR-05 |
| "Saya ingin tahu harga menu ini sudah termasuk pajak atau belum" | FR-02 |
| "Saya ingin tahu persis apa saja yang saya bayar" | FR-03 |
| "Jangan ada angka yang berubah diam-diam saat bayar" | FR-04 |
| "Ingatkan saya sebelum saya kebablasan" | FR-04 |

---

## Section 5: Functional Requirements (FR-01 sampai FR-05)

**Skala prioritas:** **Must** = wajib ada di prototype; **Should** = sangat diharapkan; **Could** = opsional jika waktu memungkinkan.

### FR-01: Budget-Aware Discovery (KU-1)

**Tujuan:** pengguna dapat menetapkan budget dan menemukan restoran sesuai budget dengan cepat.

| ID | Requirement | Prioritas |
|---|---|---|
| FR-01.1 | Pengguna dapat mengatur **budget makan harian** (contoh: Rp50.000) melalui input angka bulat Rupiah. | Must |
| FR-01.2 | **Header** menampilkan sisa budget hari ini (budget dikurangi pengeluaran hari ini). | Must |
| FR-01.3 | Tersedia toggle filter **"Sesuai Budget Saya"** yang hanya menampilkan restoran dengan status budget OK atau WARN (lihat BR-08 dan BR-09). | Must |
| FR-01.4 | Tersedia opsi pengurutan **"Termurah (all-in)"** berdasarkan estimasi all-in ascending. | Must |
| FR-01.5 | Daftar restoran menampilkan **harga net setelah diskon promo yang eligible**. | Must |
| FR-01.6 | Validasi input budget: bilangan bulat, minimal Rp10.000 dan maksimal Rp500.000. Input tidak valid ditolak dengan pesan jelas. | Must |
| FR-01.7 | Budget dan pengeluaran hari ini tersimpan di local storage agar bertahan setelah refresh halaman. | Should |
| FR-01.8 | Jika budget belum diatur, filter "Sesuai Budget Saya" dinonaktifkan dan pengguna diarahkan untuk mengatur budget. | Should |

### FR-02: Upfront Tax dan Price Clarity (KU-2)

**Tujuan:** pengguna memahami status pajak dan estimasi biaya tambahan sebelum menambah item ke Cart.

| ID | Requirement | Prioritas |
|---|---|---|
| FR-02.1 | Setiap item menu menampilkan **status pajak** secara eksplisit: "Belum termasuk pajak" atau "Sudah termasuk pajak". | Must |
| FR-02.2 | Di bawah foto item menu muncul **price note** ringkas (**maksimal 2 baris**) yang menjelaskan estimasi biaya tambahan (misalnya pajak dan kemasan). | Must |
| FR-02.3 | Setiap item menampilkan **estimasi all-in untuk satu porsi** (diberi label "Est."), mencakup harga net, pajak, kemasan, ongkir, dan biaya layanan restoran tersebut. | Must |
| FR-02.4 | Tersedia **info sheet** (modal atau bottom sheet) yang menjelaskan tiap komponen biaya: pajak restoran, biaya kemasan, ongkos kirim, dan biaya layanan. | Must |
| FR-02.5 | Info sheet dapat dibuka dari price note dan dari halaman menu restoran. | Should |
| FR-02.6 | Jika item memiliki diskon promo, harga asli dan harga net sama-sama terlihat, dan estimasi memakai harga net. | Should |

**Contoh price note:** Baris 1: "Belum termasuk pajak 10% + kemasan Rp2.000." Baris 2: "Est. all-in 1 porsi: Rp50.000."

### FR-03: Authoritative Cart Breakdown (KU-3)

**Tujuan:** Cart menjadi satu-satunya titik kalkulasi final, dengan rincian yang transparan.

| ID | Requirement | Prioritas |
|---|---|---|
| FR-03.1 | Cart adalah **single authoritative point** kalkulasi harga final. | Must |
| FR-03.2 | Cart menampilkan rincian: **subtotal item, pajak restoran, biaya kemasan, ongkos kirim, biaya layanan, diskon voucher/promo, dan total akhir**. | Must |
| FR-03.3 | Pengguna dapat menerapkan **maksimal 1 voucher makanan dan 1 voucher ongkir** secara bersamaan. | Must |
| FR-03.4 | Perubahan di Cart (jumlah item, hapus item, pasang/lepas voucher) memicu **kalkulasi ulang instan** tanpa reload halaman. | Must |
| FR-03.5 | Voucher yang tidak memenuhi syarat (misalnya minimum belanja) ditampilkan dengan **alasan ketidaksesuaian** dan tidak dapat diterapkan. | Must |
| FR-03.6 | Jika perubahan Cart membuat voucher yang sudah terpasang tidak lagi memenuhi syarat, voucher dilepas otomatis disertai **pemberitahuan** ke pengguna. | Should |
| FR-03.7 | Cart hanya berisi item dari **satu restoran**. Menambah item dari restoran lain memunculkan konfirmasi untuk mengganti keranjang. | Should |
| FR-03.8 | Cart menampilkan Budget Tracker (lihat FR-04.3). | Should |

### FR-04: Zero-Delta Checkout dan Budget Guardrail (KU-4)

**Tujuan:** total tidak pernah berubah setelah Cart, dan pengguna diingatkan sebelum melewati budget.

| ID | Requirement | Prioritas |
|---|---|---|
| FR-04.1 | **Total di Checkout dan struk Payment harus sama persis dengan total di Cart** (Delta = Rp0). | Must |
| FR-04.2 | Cart dan Checkout menggunakan **fungsi kalkulasi yang sama** (lihat BR-02). | Must |
| FR-04.3 | **Budget Tracker** real-time menampilkan penggunaan budget dengan tiga status: **OK** (di bawah 80%), **WARN** (80% sampai 100%), dan **EXCEEDED** (di atas 100%). | Must |
| FR-04.4 | Jika status **EXCEEDED**, saat pengguna menekan tombol bayar muncul **dialog konfirmasi proaktif sebelum pembayaran** dengan tiga aksi: **"Ubah pesanan"**, **"Lihat yang sesuai budget"**, dan **"Lanjutkan tetap"**. | Must |
| FR-04.5 | Menutup dialog tanpa memilih aksi **tidak** melanjutkan pembayaran. | Must |
| FR-04.6 | Jika setelah Cart ada perubahan (misalnya alamat atau voucher) yang mengubah total, aplikasi **menampilkan pemberitahuan transparan** berisi total sebelum, total sesudah, dan penyebabnya (lihat BR-05). Harga tidak boleh berubah secara diam-diam. | Must |
| FR-04.7 | Struk Payment menampilkan rincian yang identik dengan Cart. Jika pengguna memilih "Lanjutkan tetap", struk mencatat jumlah yang melebihi budget. | Should |
| FR-04.8 | Setelah pembayaran simulasi berhasil, pengeluaran hari ini bertambah sebesar total pembayaran dan header diperbarui. | Should |

### FR-05: All-Inclusive Card Preview (KU-5)

**Tujuan:** pengguna dapat menilai harga dan kecocokan budget langsung dari kartu restoran.

| ID | Requirement | Prioritas |
|---|---|---|
| FR-05.1 | Kartu restoran di halaman **Home** dan **Search** menampilkan estimasi all-in: **"Est. RpXX.000, sudah termasuk ongkir dan biaya"**. | Must |
| FR-05.2 | Kartu menampilkan **badge kecocokan budget** dengan tiga kondisi: "Sesuai budget" (OK), "Mepet budget" (WARN), dan "Melebihi budget" (EXCEEDED). | Must |
| FR-05.3 | Status badge mengikuti aturan yang sama dengan Budget Tracker (BR-08 dan BR-09). | Must |
| FR-05.4 | Badge tidak hanya mengandalkan warna. Setiap status memiliki teks label. | Should |
| FR-05.5 | Jika budget belum diatur, badge disembunyikan, sedangkan estimasi all-in tetap tampil. | Should |

---

## Section 6: Business Rules dan Pricing Invariants

### 6.1 Core Business Rules

| ID | Aturan |
|---|---|
| **BR-01 Integer Rupiah Only** | Seluruh kalkulasi mata uang memakai **bilangan bulat Rupiah (IDR)**. Tidak boleh ada desimal atau floating-point. Setiap pembagian atau persentase dibulatkan sesuai BR-06. |
| **BR-02 Single Pricing Logic** | Cart dan Checkout **wajib memakai satu fungsi kalkulasi yang sama** dengan input yang sama. Tidak boleh ada logika harga ganda. |
| **BR-03 Zero-Delta Invariant** | Total Cart = total Checkout = jumlah Payment (**Delta = Rp0**). |
| **BR-04 Pre-Cart Estimate Labeling** | Setiap harga turunan yang tampil **sebelum layar Cart** (estimasi all-in pada kartu dan menu) wajib berlabel **"Est."**. Harga menu per item (list price) bukan estimasi, tetapi wajib disertai status pajak. |
| **BR-05 Transparent Post-Cart Change** | Perubahan setelah Cart (alamat, voucher, jumlah item) dihitung ulang dengan fungsi yang sama, memperbarui Cart dan Checkout sekaligus, dan **wajib diberitahukan** ke pengguna (total sebelum, total sesudah, dan penyebab). Pembayaran hanya dapat dilanjutkan setelah pemberitahuan ditampilkan. |

### 6.2 Aturan Kalkulasi Harga (Prototype)

Urutan kalkulasi:

| Langkah | Komponen | Rumus |
|---|---|---|
| 1 | **Subtotal** | Σ (harga net item × qty). Harga net = harga asli dikurangi diskon promo item. |
| 2 | **Pajak restoran** | Tarif pajak restoran (10% pada mock data) dikenakan hanya pada subtotal item berstatus "Belum termasuk pajak". Item "Sudah termasuk pajak" tidak menambah pajak. |
| 3 | **Biaya kemasan** | Total qty item × biaya kemasan per item restoran. |
| 4 | **Ongkos kirim** | Tarif tetap per restoran (berdasarkan jarak pada mock data). |
| 5 | **Biaya layanan** | Tarif tetap per pesanan per restoran. |
| 6 | **Diskon voucher makanan** | Lihat BR-07. Dihitung terhadap subtotal. |
| 7 | **Diskon voucher ongkir** | Lihat BR-07. Dihitung terhadap ongkos kirim. |
| 8 | **Total akhir** | Subtotal + pajak + kemasan + ongkir + layanan − diskon makanan − diskon ongkir. Tidak boleh bernilai negatif. |

### 6.3 Aturan Tambahan

| ID | Aturan |
|---|---|
| **BR-06 Rounding** | Pembulatan memakai aturan **round half up** pada Rupiah terdekat dengan operasi bilangan bulat: `pajak = floor((dasarPajak × tarifPersen + 50) / 100)`. Diskon persentase dibulatkan **ke bawah** (`floor`). |
| **BR-07 Voucher** | (a) Maksimal 1 voucher makanan dan 1 voucher ongkir per pesanan. (b) Syarat minimum belanja dihitung terhadap **subtotal** (setelah diskon promo item, sebelum pajak) dan bersifat inklusif (subtotal ≥ minimum). (c) Diskon makanan = min(nilai voucher, batas maksimal voucher, subtotal). (d) Diskon ongkir = min(nilai voucher, batas maksimal voucher, ongkos kirim). (e) Voucher khusus restoran hanya berlaku di restoran tersebut. |
| **BR-08 Perhitungan Budget Usage** | `proyeksi = pengeluaran hari ini + nilai pesanan`. Untuk kartu restoran, nilai pesanan = estimasi all-in. Untuk Cart dan Checkout, nilai pesanan = total akhir Cart. |
| **BR-09 Status Budget** | Dibandingkan dengan budget harian, tanpa pembulatan persen: **OK** jika `proyeksi × 100 < budget × 80`; **WARN** jika `proyeksi × 100 ≥ budget × 80` dan `proyeksi ≤ budget`; **EXCEEDED** jika `proyeksi > budget`. Nilai tepat 100% termasuk WARN. |
| **BR-10 Estimasi All-in Kartu** | Estimasi kartu restoran dihitung dari **menu andalan** restoran (1 porsi), memakai aturan 6.2 langkah 1 sampai 5 tanpa voucher. Estimasi menu item dihitung dengan cara yang sama untuk item tersebut (1 porsi). |
| **BR-11 Format Tampilan** | Mata uang ditampilkan dengan format Indonesia: awalan "Rp", pemisah ribuan titik (contoh: Rp30.000). |

### 6.4 Contoh Perhitungan Acuan

**Contoh A: Worked Example (Restoran R-01, 1 porsi M-101)**

| Komponen | Perhitungan | Nominal |
|---|---|---:|
| Subtotal | 1 × 30.000 | Rp30.000 |
| Pajak | 10% × 30.000 | Rp3.000 |
| Kemasan | 1 × 2.000 | Rp2.000 |
| Ongkir | tarif R-01 | Rp12.000 |
| Layanan | tarif R-01 | Rp3.000 |
| **Total** | | **Rp50.000** |

**Contoh B: Cart R-01 melebihi budget (M-101 + M-104, voucher V-F01 dan V-D01)**

| Komponen | Perhitungan | Nominal |
|---|---|---:|
| Subtotal | 30.000 + 8.000 | Rp38.000 |
| Pajak | 10% × 30.000 (M-104 sudah termasuk pajak) | Rp3.000 |
| Kemasan | 2 item × 2.000 | Rp4.000 |
| Ongkir | | Rp12.000 |
| Layanan | | Rp3.000 |
| Diskon voucher makanan V-F01 | | −Rp5.000 |
| Diskon voucher ongkir V-D01 | min(8.000, 12.000) | −Rp8.000 |
| **Total** | | **Rp47.000** |

Proyeksi budget Wira: 12.000 + 47.000 = Rp59.000 dari Rp50.000 (118%), sehingga status **EXCEEDED**.

**Contoh C: Cart R-02 di batas WARN (M-201 + M-203 + M-204, voucher V-F01 dan V-D02)**

| Komponen | Perhitungan | Nominal |
|---|---|---:|
| Subtotal | 15.000 + 5.000 + 5.000 | Rp25.000 |
| Pajak | 10% × 15.000 | Rp1.500 |
| Kemasan | 3 item × 1.000 | Rp3.000 |
| Ongkir | | Rp6.000 |
| Layanan | | Rp3.000 |
| Diskon voucher makanan V-F01 | subtotal 25.000 memenuhi minimum 25.000 | −Rp5.000 |
| Diskon voucher ongkir V-D02 | min(5.000, 6.000) | −Rp5.000 |
| **Total** | | **Rp28.500** |

Proyeksi: 12.000 + 28.500 = Rp40.500 (81%), sehingga status **WARN**. Tanpa voucher, total Rp38.500 dan proyeksi Rp50.500 (101%) berstatus **EXCEEDED**.

---

## Section 7: User Stories dan Acceptance Criteria

Format acceptance criteria: **Given** (kondisi awal), **When** (aksi), **Then** (hasil yang diharapkan). Seluruh contoh angka mengacu pada mock data di Section 9.

### 7.1 FR-01: Budget-Aware Discovery

**User Stories**

- **US-01.1** Sebagai mahasiswa dengan budget ketat, saya ingin mengatur budget makan harian agar saya tahu batas pengeluaran saya.
- **US-01.2** Sebagai mahasiswa, saya ingin memfilter restoran yang sesuai budget agar saya tidak membuang waktu melihat pilihan yang terlalu mahal.
- **US-01.3** Sebagai mahasiswa, saya ingin mengurutkan restoran dari yang termurah secara all-in agar saya bisa membandingkan dengan cepat.

**Acceptance Criteria**

- **AC-01.1** **Given** budget belum diatur, **When** pengguna membuka Home, **Then** muncul ajakan untuk mengatur budget dan filter "Sesuai Budget Saya" nonaktif.
- **AC-01.2** **Given** pengguna membuka pengaturan budget, **When** pengguna memasukkan 50000 dan menyimpan, **Then** budget tersimpan dan header menampilkan sisa budget (budget dikurangi pengeluaran hari ini).
- **AC-01.3** **Given** pengguna memasukkan nilai tidak valid (kosong, desimal, di bawah Rp10.000, atau di atas Rp500.000), **When** pengguna menyimpan, **Then** nilai ditolak dan muncul pesan kesalahan yang menjelaskan batas yang berlaku.
- **AC-01.4** **Given** profil Wira default (budget Rp50.000, pengeluaran Rp12.000), **When** pengguna mengaktifkan "Sesuai Budget Saya", **Then** hanya R-03, R-02, R-04, dan R-06 yang tampil, dan R-05 serta R-01 tersembunyi.
- **AC-01.5** **Given** daftar restoran tampil, **When** pengguna memilih "Termurah (all-in)", **Then** urutan menjadi R-03, R-02, R-04, R-06, R-05, R-01 berdasarkan estimasi all-in ascending.
- **AC-01.6** **Given** restoran memiliki diskon promo pada menu andalan (contoh R-02), **When** kartu restoran tampil, **Then** estimasi memakai harga net setelah diskon (Rp15.000), bukan harga asli.
- **AC-01.7** **Given** pengguna sudah mengatur budget, **When** halaman di-refresh, **Then** budget dan pengeluaran hari ini tetap tersimpan.

### 7.2 FR-02: Upfront Tax dan Price Clarity

**User Stories**

- **US-02.1** Sebagai pengguna, saya ingin tahu apakah harga menu sudah termasuk pajak agar saya tidak kaget di checkout.
- **US-02.2** Sebagai pengguna, saya ingin melihat estimasi total satu porsi langsung di menu agar saya bisa memutuskan sebelum menambah ke keranjang.
- **US-02.3** Sebagai pengguna, saya ingin penjelasan singkat tentang tiap komponen biaya agar saya paham apa yang saya bayar.

**Acceptance Criteria**

- **AC-02.1** **Given** pengguna membuka menu R-01, **When** daftar menu tampil, **Then** M-101 berlabel "Belum termasuk pajak" dan M-104 berlabel "Sudah termasuk pajak".
- **AC-02.2** **Given** item menu tampil, **When** pengguna melihat area di bawah foto item, **Then** price note tampil dengan **maksimal 2 baris** dan menyebut estimasi biaya tambahan (pajak dan kemasan).
- **AC-02.3** **Given** pengguna melihat M-101, **When** estimasi all-in satu porsi dihitung, **Then** nilainya **Est. Rp50.000** dan berlabel "Est.".
- **AC-02.4** **Given** pengguna melihat M-104 (sudah termasuk pajak), **When** estimasi dihitung, **Then** pajak tidak ditambahkan: 8.000 + 2.000 kemasan + 12.000 ongkir + 3.000 layanan = **Est. Rp25.000**.
- **AC-02.5** **Given** price note tampil, **When** pengguna membuka info sheet, **Then** info sheet menjelaskan pajak restoran, biaya kemasan, ongkos kirim, dan biaya layanan, dan dapat ditutup untuk kembali ke menu.
- **AC-02.6** **Given** item berdiskon (M-201: Rp17.000 menjadi Rp15.000), **When** item tampil, **Then** harga asli dan harga net terlihat, dan estimasi all-in memakai harga net.

### 7.3 FR-03: Authoritative Cart Breakdown

**User Stories**

- **US-03.1** Sebagai pengguna, saya ingin melihat rincian lengkap biaya di Cart agar saya tahu total yang akan saya bayar.
- **US-03.2** Sebagai pengguna, saya ingin memasang voucher dan langsung melihat dampaknya pada total.
- **US-03.3** Sebagai pengguna, saya ingin tahu alasan jika sebuah voucher tidak bisa dipakai.

**Acceptance Criteria**

- **AC-03.1** **Given** Cart berisi M-101 dan M-104 dari R-01, **When** pengguna membuka Cart, **Then** rincian menampilkan subtotal Rp38.000, pajak Rp3.000, kemasan Rp4.000, ongkir Rp12.000, layanan Rp3.000, dan total Rp60.000.
- **AC-03.2** **Given** Cart pada AC-03.1, **When** pengguna memasang V-F01, **Then** diskon makanan −Rp5.000 muncul dan total menjadi Rp55.000 **tanpa reload halaman**.
- **AC-03.3** **Given** V-F01 sudah terpasang, **When** pengguna memasang V-D01, **Then** diskon ongkir −Rp8.000 muncul dan total menjadi Rp47.000.
- **AC-03.4** **Given** V-F01 sudah terpasang, **When** pengguna mencoba memasang V-F02, **Then** voucher makanan lama diganti (atau pengguna diminta mengonfirmasi penggantian), sehingga tidak pernah ada lebih dari 1 voucher makanan aktif.
- **AC-03.5** **Given** Cart dengan subtotal Rp20.000, **When** pengguna melihat daftar voucher, **Then** V-F01 (minimum Rp25.000) ditampilkan tidak dapat dipakai dengan alasan "kurang Rp5.000 dari minimum belanja".
- **AC-03.6** **Given** V-F01 terpasang pada Cart R-02 dengan subtotal Rp25.000, **When** pengguna mengurangi item sehingga subtotal di bawah Rp25.000, **Then** V-F01 dilepas otomatis, muncul pemberitahuan, dan total dihitung ulang.
- **AC-03.7** **Given** Cart berisi item dari R-01, **When** pengguna menambah item dari R-02, **Then** muncul konfirmasi penggantian keranjang dan tidak ada pencampuran item dua restoran.
- **AC-03.8** **Given** Cart kosong, **When** pengguna membuka Cart, **Then** muncul keadaan kosong dengan tautan kembali ke daftar restoran, dan tombol checkout nonaktif.

### 7.4 FR-04: Zero-Delta Checkout dan Budget Guardrail

**User Stories**

- **US-04.1** Sebagai pengguna, saya ingin total di Checkout dan struk sama persis dengan Cart agar saya percaya pada angka yang ditampilkan.
- **US-04.2** Sebagai pengguna, saya ingin melihat seberapa dekat pesanan saya dengan batas budget agar saya bisa menyesuaikan.
- **US-04.3** Sebagai pengguna, saya ingin diperingatkan sebelum membayar jika pesanan melebihi budget agar saya bisa memutuskan dengan sadar.

**Acceptance Criteria**

- **AC-04.1** **Given** Cart bertotal Rp47.000, **When** pengguna lanjut ke Checkout lalu menyelesaikan pembayaran simulasi, **Then** total di Checkout dan jumlah pada struk Payment sama persis dengan Rp47.000 (Delta = Rp0).
- **AC-04.2** **Given** pengguna sedang di Checkout, **When** pengguna mengubah alamat sehingga ongkir berubah, **Then** muncul pemberitahuan berisi total sebelum, total sesudah, dan penyebab, serta Cart ikut diperbarui. Harga **tidak** berubah tanpa pemberitahuan.
- **AC-04.3** **Given** profil Wira default dan total Cart Rp28.500 (Contoh C), **When** tracker dihitung, **Then** proyeksi Rp40.500 (81%) tampil sebagai **WARN**.
- **AC-04.4** **Given** total Cart Rp47.000 (Contoh B), **When** tracker dihitung, **Then** proyeksi Rp59.000 (118%) tampil sebagai **EXCEEDED**.
- **AC-04.5** **Given** proyeksi yang menghasilkan di bawah 80% (misalnya total Cart Rp20.000, proyeksi Rp32.000 atau 64%), **When** tracker dihitung, **Then** status **OK**.
- **AC-04.6** **Given** proyeksi tepat Rp50.000 (100%), **When** tracker dihitung, **Then** status **WARN**, bukan EXCEEDED.
- **AC-04.7** **Given** status EXCEEDED, **When** pengguna menekan tombol bayar, **Then** dialog konfirmasi muncul **sebelum** pembayaran dengan tiga aksi: "Ubah pesanan", "Lihat yang sesuai budget", dan "Lanjutkan tetap".
- **AC-04.8** **Given** dialog EXCEEDED tampil, **When** pengguna memilih "Ubah pesanan", **Then** pengguna kembali ke Cart tanpa pembayaran.
- **AC-04.9** **Given** dialog EXCEEDED tampil, **When** pengguna memilih "Lihat yang sesuai budget", **Then** pengguna menuju Home dengan filter "Sesuai Budget Saya" aktif.
- **AC-04.10** **Given** dialog EXCEEDED tampil, **When** pengguna memilih "Lanjutkan tetap", **Then** pembayaran simulasi dilanjutkan dan struk mencatat jumlah yang melebihi budget.
- **AC-04.11** **Given** dialog EXCEEDED tampil, **When** pengguna menutup dialog tanpa memilih aksi, **Then** pembayaran tidak dilanjutkan.
- **AC-04.12** **Given** pembayaran simulasi berhasil dengan total Rp28.500, **When** pengguna kembali ke Home, **Then** pengeluaran hari ini menjadi Rp40.500 dan sisa budget di header menjadi Rp9.500.

### 7.5 FR-05: All-Inclusive Card Preview

**User Stories**

- **US-05.1** Sebagai pengguna, saya ingin melihat harga all-in pada kartu restoran agar saya bisa membandingkan tanpa membuka tiap restoran.
- **US-05.2** Sebagai pengguna, saya ingin penanda cepat apakah restoran cocok dengan budget saya.

**Acceptance Criteria**

- **AC-05.1** **Given** profil Wira default, **When** Home tampil, **Then** kartu R-03 menampilkan "Est. Rp25.000, sudah termasuk ongkir dan biaya" dengan badge "Sesuai budget".
- **AC-05.2** **Given** profil Wira default, **When** Home tampil, **Then** kartu R-04 (Est. Rp28.500, proyeksi 81%) dan R-06 (Est. Rp35.000, proyeksi 94%) berbadge "Mepet budget".
- **AC-05.3** **Given** profil Wira default, **When** Home tampil, **Then** kartu R-05 (Est. Rp41.900, proyeksi 107,8%) dan R-01 (Est. Rp50.000, proyeksi 124%) berbadge "Melebihi budget".
- **AC-05.4** **Given** pengguna mengubah budget menjadi Rp100.000, **When** Home tampil, **Then** seluruh badge dihitung ulang dan tampil sesuai budget baru.
- **AC-05.5** **Given** kartu restoran tampil di halaman Search, **When** pengguna melihat kartu, **Then** format estimasi dan badge identik dengan kartu di Home.
- **AC-05.6** **Given** badge tampil, **When** pengguna melihat badge, **Then** status dapat dipahami dari **teks label**, tidak hanya dari warna.
- **AC-05.7** **Given** budget belum diatur, **When** Home tampil, **Then** badge tidak tampil, tetapi estimasi all-in tetap tampil.

---

## Section 8: Non-Functional Requirements dan Prototype Scope

### 8.1 Non-Functional Requirements

| ID | Kategori | Requirement |
|---|---|---|
| NFR-01 | **Responsiveness** | Aplikasi dapat dipakai pada lebar layar 360 px hingga 1440 px tanpa scroll horizontal. Pendekatan **mobile-first**. |
| NFR-02 | **Performance** | Kalkulasi ulang harga selesai kurang dari 100 ms (terasa instan). Halaman utama termuat kurang dari 3 detik pada koneksi lokal biasa. |
| NFR-03 | **Correctness** | Fungsi kalkulasi harga memiliki **unit test** yang mencakup seluruh contoh di Section 6.4, kasus batas WARN/EXCEEDED, kasus voucher, dan pembulatan. |
| NFR-04 | **Data** | Seluruh data bersumber dari **local mock data**. Tidak ada backend, API eksternal, atau database. |
| NFR-05 | **Persistence** | Budget, pengeluaran hari ini, dan isi Cart tersimpan di local storage. Tersedia aksi "Reset data demo" untuk mengembalikan ke profil Wira default. |
| NFR-06 | **Compatibility** | Berjalan di versi terbaru Chrome, Edge, dan Firefox, serta Chrome dan Safari mobile. |
| NFR-07 | **Accessibility (dasar)** | Elemen interaktif dapat dioperasikan dengan keyboard. Dialog dan info sheet memiliki fokus yang terkelola. Informasi status tidak hanya bergantung pada warna. Detail spesifikasi ada di dokumen UX. |
| NFR-08 | **Localization** | Bahasa antarmuka Indonesia. Format mata uang sesuai BR-11. |
| NFR-09 | **Maintainability** | Aturan harga dan konfigurasi mock data terpisah dari komponen tampilan agar mudah diuji dan diubah. |
| NFR-10 | **Error Handling** | Input tidak valid, Cart kosong, dan voucher tidak eligible ditangani dengan pesan yang jelas, tanpa error yang menghentikan aplikasi. |

### 8.2 Prototype Scope

#### In-Scope

| Area | Cakupan |
|---|---|
| **Halaman** | Home, Search, Menu Restoran, Cart, Checkout, dan Payment Receipt (simulasi) |
| **Budget** | Pengaturan budget harian, sisa budget di header, Budget Tracker, dialog EXCEEDED |
| **Discovery** | Filter "Sesuai Budget Saya", sort "Termurah (all-in)", pencarian sederhana berdasarkan nama atau kategori |
| **Price Clarity** | Status pajak, price note, estimasi all-in per item, info sheet |
| **Cart dan Voucher** | Rincian biaya, 1 voucher makanan + 1 voucher ongkir, kalkulasi ulang instan |
| **Checkout** | Zero-Delta, simulasi perubahan alamat dengan pemberitahuan transparan |
| **Pembayaran** | Simulasi pembayaran (tanpa transaksi nyata) |
| **Data** | 6 restoran mock, voucher mock, profil Wira default |
| **Quality** | Unit test fungsi kalkulasi dan uji usability prototype |

#### Out-of-Scope

| Area | Alasan |
|---|---|
| Aplikasi native (Android/iOS) | Deliverable adalah web responsif |
| Backend, database, dan API nyata | Prototype memakai mock data lokal |
| Integrasi data Shopee/ShopeeFood sungguhan | Proyek akademik dan tidak berafiliasi |
| Pembayaran nyata dan payment gateway | Hanya simulasi |
| Autentikasi dan manajemen akun | Tidak relevan terhadap hipotesis UX |
| Geolokasi, peta, dan pelacakan driver | Ongkir pada prototype adalah tarif tetap |
| Rating, ulasan, dan rekomendasi personalisasi | Di luar fokus transparansi harga |
| Riwayat pesanan dan notifikasi push | Di luar fokus |
| Keranjang multi-restoran | Disederhanakan menjadi satu restoran per Cart |
| Analytics dan A/B testing nyata | Metrik diukur lewat usability test |
| Spesifikasi visual, wireframe, dan animasi | Dibahas di dokumen UX/Design |
| Arsitektur teknis terperinci | Dibahas di dokumen Engineering |

### 8.3 Asumsi

1. Tarif pajak, biaya layanan, kemasan, dan ongkir pada mock data adalah nilai fiktif yang dirancang untuk skenario uji.
2. Ongkir berupa tarif tetap per restoran, tidak berubah berdasarkan waktu atau permintaan.
3. Pengeluaran hari ini pada profil default merepresentasikan pembelian makan sebelumnya pada hari yang sama.
4. Budget bersifat harian dan tidak direset otomatis. Pengguna memakai aksi "Reset data demo" saat pengujian.

---

## Section 9: Mock Data Specification

### 9.1 Profil Default Wira

| Atribut | Nilai |
|---|---|
| Nama | Wira |
| Budget makan harian | Rp50.000 |
| Pengeluaran hari ini | Rp12.000 (sarapan) |
| Sisa budget (header) | Rp38.000 |
| Alamat pengiriman | Kos dekat kampus, Malang (data fiktif) |
| Voucher tersedia | V-F01, V-F02, V-D01, V-D02 (V-F03 hanya untuk R-05) |

### 9.2 Restoran

Seluruh restoran memakai tarif pajak 10% (hanya untuk item "Belum termasuk pajak"). Estimasi dihitung dari menu andalan (BR-10) dan status budget dari profil default (BR-08 dan BR-09).

| ID | Nama | Kategori | Jarak | Ongkir | Layanan | Kemasan/item | Menu Andalan | Est. All-in | Proyeksi Budget | Status |
|---|---|---|---|---|---|---|---|---:|---|---|
| R-01 | Ayam Bakar Pak Dhe | Ayam & Bakaran | 3,2 km | Rp12.000 | Rp3.000 | Rp2.000 | M-101 | Rp50.000 | Rp62.000 (124%) | EXCEEDED |
| R-02 | Geprek Bu Rina | Ayam Geprek | 1,1 km | Rp6.000 | Rp3.000 | Rp1.000 | M-201 | Rp26.500 | Rp38.500 (77%) | OK |
| R-03 | Nasi Goreng Mas Joko | Nasi & Mie | 0,8 km | Rp4.000 | Rp2.000 | Rp1.000 | M-301 | Rp25.000 | Rp37.000 (74%) | OK |
| R-04 | Bakso Pak Slamet | Bakso & Mie | 2,0 km | Rp8.000 | Rp3.000 | Rp1.000 | M-401 | Rp28.500 | Rp40.500 (81%) | WARN |
| R-05 | Kopi & Roti Senja | Kopi & Roti | 4,5 km | Rp15.000 | Rp4.000 | Rp2.000 | M-501 | Rp41.900 | Rp53.900 (107,8%) | EXCEEDED |
| R-06 | Sate Ayam Madura | Sate | 2,6 km | Rp9.000 | Rp3.000 | Rp1.000 | M-601 | Rp35.000 | Rp47.000 (94%) | WARN |

**Urutan "Termurah (all-in)":** R-03 (25.000), R-02 (26.500), R-04 (28.500), R-06 (35.000), R-05 (41.900), R-01 (50.000).
**Hasil filter "Sesuai Budget Saya":** R-03, R-02, R-04, R-06.

### 9.3 Menu Item

**R-01: Ayam Bakar Pak Dhe**

| ID | Nama Menu | Harga Asli | Diskon | Harga Net | Status Pajak |
|---|---|---:|---:|---:|---|
| M-101 ★ | Paket Ayam Bakar Promo (ayam bakar, nasi, lalapan) | Rp30.000 | Rp0 | Rp30.000 | Belum termasuk pajak |
| M-102 | Tahu Tempe Bakar | Rp10.000 | Rp0 | Rp10.000 | Belum termasuk pajak |
| M-103 | Nasi Putih | Rp5.000 | Rp0 | Rp5.000 | Belum termasuk pajak |
| M-104 | Es Jeruk | Rp8.000 | Rp0 | Rp8.000 | Sudah termasuk pajak |

**R-02: Geprek Bu Rina**

| ID | Nama Menu | Harga Asli | Diskon | Harga Net | Status Pajak |
|---|---|---:|---:|---:|---|
| M-201 ★ | Ayam Geprek Original | Rp17.000 | Rp2.000 | Rp15.000 | Belum termasuk pajak |
| M-202 | Ayam Geprek Keju | Rp22.000 | Rp0 | Rp22.000 | Belum termasuk pajak |
| M-203 | Nasi Putih | Rp5.000 | Rp0 | Rp5.000 | Sudah termasuk pajak |
| M-204 | Es Teh Manis | Rp5.000 | Rp0 | Rp5.000 | Sudah termasuk pajak |

**R-03: Nasi Goreng Mas Joko** (seluruh menu sudah termasuk pajak)

| ID | Nama Menu | Harga Asli | Diskon | Harga Net | Status Pajak |
|---|---|---:|---:|---:|---|
| M-301 ★ | Nasi Goreng Ayam | Rp18.000 | Rp0 | Rp18.000 | Sudah termasuk pajak |
| M-302 | Nasi Goreng Spesial | Rp20.000 | Rp0 | Rp20.000 | Sudah termasuk pajak |
| M-303 | Mie Goreng Jawa | Rp17.000 | Rp0 | Rp17.000 | Sudah termasuk pajak |
| M-304 | Es Teh Tarik | Rp6.000 | Rp0 | Rp6.000 | Sudah termasuk pajak |

**R-04: Bakso Pak Slamet**

| ID | Nama Menu | Harga Asli | Diskon | Harga Net | Status Pajak |
|---|---|---:|---:|---:|---|
| M-401 ★ | Bakso Urat | Rp15.000 | Rp0 | Rp15.000 | Belum termasuk pajak |
| M-402 | Bakso Campur Komplit | Rp20.000 | Rp0 | Rp20.000 | Sudah termasuk pajak |
| M-403 | Mie Ayam Bakso | Rp14.000 | Rp0 | Rp14.000 | Belum termasuk pajak |
| M-404 | Es Campur | Rp10.000 | Rp0 | Rp10.000 | Belum termasuk pajak |

**R-05: Kopi & Roti Senja**

| ID | Nama Menu | Harga Asli | Diskon | Harga Net | Status Pajak |
|---|---|---:|---:|---:|---|
| M-501 ★ | Kopi Susu Gula Aren | Rp22.000 | Rp3.000 | Rp19.000 | Belum termasuk pajak |
| M-502 | Roti Bakar Cokelat Keju | Rp18.000 | Rp0 | Rp18.000 | Belum termasuk pajak |
| M-503 | Paket Sarapan (roti + kopi) | Rp35.000 | Rp0 | Rp35.000 | Belum termasuk pajak |
| M-504 | Air Mineral | Rp5.000 | Rp0 | Rp5.000 | Sudah termasuk pajak |

**R-06: Sate Ayam Madura**

| ID | Nama Menu | Harga Asli | Diskon | Harga Net | Status Pajak |
|---|---|---:|---:|---:|---|
| M-601 ★ | Sate Ayam (10 tusuk) | Rp20.000 | Rp0 | Rp20.000 | Belum termasuk pajak |
| M-602 | Sate Kambing (10 tusuk) | Rp30.000 | Rp0 | Rp30.000 | Belum termasuk pajak |
| M-603 | Lontong | Rp4.000 | Rp0 | Rp4.000 | Sudah termasuk pajak |
| M-604 | Es Kelapa Muda | Rp10.000 | Rp0 | Rp10.000 | Sudah termasuk pajak |

★ = menu andalan yang dipakai untuk estimasi all-in pada kartu restoran.

### 9.4 Voucher

| ID | Nama | Jenis | Nilai | Batas Maksimal | Minimum Subtotal | Berlaku Untuk |
|---|---|---|---|---:|---:|---|
| V-F01 | Hemat Makan | Makanan (nominal) | Rp5.000 | n/a | Rp25.000 | Semua restoran |
| V-F02 | Diskon 20% Makan | Makanan (persentase) | 20% | Rp8.000 | Rp30.000 | Semua restoran |
| V-F03 | Spesial Senja | Makanan (nominal) | Rp10.000 | n/a | Rp40.000 | Hanya R-05 |
| V-D01 | Gratis Ongkir | Ongkir (nominal) | Rp8.000 | Rp8.000 | Rp20.000 | Semua restoran |
| V-D02 | Potongan Ongkir | Ongkir (nominal) | Rp5.000 | Rp5.000 | Rp15.000 | Semua restoran |

Diskon ongkir tidak pernah melebihi ongkos kirim restoran (BR-07d).

### 9.5 Skenario Uji yang Disarankan

| ID | Skenario | Cakupan |
|---|---|---|
| TS-01 | Worked Example: M-101, 1 porsi, tanpa voucher, total Rp50.000. Ulangi dengan pengeluaran hari ini Rp0 sehingga proyeksi tepat Rp50.000 (100%) | Contoh A, AC-02.3, AC-04.6 (batas WARN) |
| TS-02 | Cart R-01 (M-101 + M-104) dengan V-F01 dan V-D01, total Rp47.000 | Contoh B, dialog EXCEEDED, AC-04.4 sampai AC-04.11 |
| TS-03 | Cart R-02 (M-201 + M-203 + M-204) dengan V-F01 dan V-D02, total Rp28.500 | Contoh C, status WARN, AC-04.3 |
| TS-04 | Kurangi item pada TS-03 sehingga subtotal di bawah Rp25.000 | Voucher dilepas otomatis, AC-03.6 |
| TS-05 | Cart R-03 saja (semua item sudah termasuk pajak) | Pajak Rp0, status OK |
| TS-06 | Ubah budget menjadi Rp100.000 | Badge dan filter dihitung ulang, AC-05.4 |
| TS-07 | Ubah alamat saat Checkout | Pemberitahuan transparan dan Zero-Delta, AC-04.2 |
| TS-08 | Budget belum diatur | Badge tersembunyi, filter nonaktif, AC-01.1 dan AC-05.7 |

---

*Akhir dokumen PRD TPBG v1.0.0*
