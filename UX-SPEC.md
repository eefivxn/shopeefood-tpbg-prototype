# UX Specification (UX-SPEC)

# ShopeeFood Transparent Pricing and Budget Guardrail (TPBG)

---

| Atribut | Keterangan |
|---|---|
| **Project Title** | ShopeeFood Transparent Pricing and Budget Guardrail (TPBG) |
| **Mata Kuliah** | Rekayasa Interaksi (Interaction Engineering) |
| **Dokumen Acuan** | PRD TPBG v1.0.0 (18 November 2026) |
| **Document Version** | 1.0.0 |
| **Status** | Draft untuk review dosen dan tim |
| **Tanggal** | 19 November 2026 |
| **Kedalaman Spesifikasi** | Blueprint struktural. Warna dan tipografi **tidak** dispesifikasikan di dokumen ini |

> TPBG adalah prototype akademik dan tidak berafiliasi dengan Shopee atau ShopeeFood. Seluruh data (restoran, menu, harga, voucher, alamat) bersifat fiktif.

**Daftar isi**

1. Ringkasan dan Prinsip Desain
2. Arsitektur Informasi dan Navigasi
3. User Flow
4. Spesifikasi Layar dan Overlay
5. Komponen, State, Microcopy, dan Aksesibilitas Struktural
- Lampiran A: Asumsi Desain

---

## 1. Ringkasan dan Prinsip Desain

### 1.1 Tujuan Dokumen

Dokumen ini menerjemahkan PRD menjadi **struktur antarmuka**: layar, urutan konten, perilaku interaksi, state, microcopy, dan aturan aksesibilitas struktural. Dokumen ini tidak menetapkan warna, jenis huruf, ukuran huruf, ikon final, atau animasi. Semua itu ditangani pada fase visual design.

### 1.2 Notasi

| Notasi | Arti |
|---|---|
| `[Teks]` | Tombol atau kontrol interaktif |
| `[x]` / `[ ]` | Toggle atau checkbox aktif / tidak aktif |
| `( )` / `(o)` | Radio tidak dipilih / dipilih |
| `{Teks}` | Konten dinamis dari data atau kalkulasi |
| `(kondisional)` | Elemen hanya tampil pada kondisi tertentu |
| **Must / Should** | Mengikuti skala prioritas PRD |

### 1.3 Prinsip Desain

| ID | Prinsip | Implikasi pada antarmuka | Sumber |
|---|---|---|---|
| P-1 | **Angka tidak boleh mengejutkan** | Setiap harga turunan sebelum Cart berlabel "Est."; angka final hanya lahir di Cart | BR-04, FR-03.1 |
| P-2 | **Satu sumber kebenaran** | Rincian di Checkout dan Struk identik dengan Cart, dan ada penanda eksplisit "Selisih Rp0" | BR-02, BR-03 |
| P-3 | **Perubahan selalu diumumkan** | Setiap perubahan total setelah Cart memunculkan pemberitahuan sebelum / sesudah / penyebab | BR-05 |
| P-4 | **Peringatan sebelum, bukan sesudah** | Budget Tracker tampil sejak kartu restoran; dialog EXCEEDED muncul sebelum pembayaran | FR-04 |
| P-5 | **Status tidak bergantung pada tampilan visual** | Setiap status punya teks label dan bentuk ikon berbeda | FR-05.4, NFR-07 |
| P-6 | **Mobile-first** | Satu kolom pada 360 px. Layar lebar hanya menata ulang, tidak menambah fungsi | NFR-01 |
| P-7 | **Keputusan sadar** | Aksi yang melanjutkan melewati budget ("Lanjutkan tetap") tidak pernah menjadi aksi default | FR-04.4, FR-04.5 |

### 1.4 Traceability Ringkas

| Layar / Overlay | FR | AC utama |
|---|---|---|
| Home dan Search | FR-01, FR-05 | AC-01.1 sampai AC-01.7, AC-05.1 sampai AC-05.7 |
| Menu Restoran dan Info Sheet | FR-02, FR-03.7 | AC-02.1 sampai AC-02.6, AC-03.7 |
| Cart dan Daftar Voucher | FR-03, FR-04.3 | AC-03.1 sampai AC-03.8, AC-04.3 sampai AC-04.6 |
| Checkout, Pilih Alamat, Pemberitahuan Perubahan | FR-04.1, FR-04.2, FR-04.6 | AC-04.1, AC-04.2 |
| Dialog EXCEEDED | FR-04.4, FR-04.5 | AC-04.7 sampai AC-04.11 |
| Struk Payment | FR-04.1, FR-04.7, FR-04.8 | AC-04.1, AC-04.10, AC-04.12 |
| Pengaturan Budget | FR-01.1, FR-01.6, FR-01.7 | AC-01.2, AC-01.3, AC-01.7 |

---

## 2. Arsitektur Informasi dan Navigasi

### 2.1 Sitemap

```
TPBG
├── Home                      /
├── Search                    /cari?q=
├── Menu Restoran             /restoran/:id
├── Cart                      /keranjang
├── Checkout                  /checkout
├── Struk Payment (simulasi)  /struk
│
└── Overlay (tidak punya URL sendiri)
    ├── Pengaturan Budget          (bottom sheet / dialog)
    ├── Info Sheet Komponen Biaya  (bottom sheet / dialog)
    ├── Daftar Voucher             (bottom sheet / panel)
    ├── Konfirmasi Ganti Keranjang (dialog)
    ├── Pilih Alamat               (bottom sheet / dialog)
    ├── Pemberitahuan Perubahan Total (dialog)
    └── Dialog EXCEEDED            (dialog)
```

### 2.2 Elemen Global (Header)

Header tampil di Home, Search, Menu Restoran, dan Cart. Pada Checkout dan Struk, header disederhanakan (tanpa pencarian).

| Elemen | Perilaku | Sumber |
|---|---|---|
| Tombol kembali / nama aplikasi | Kembali ke layar sebelumnya, atau ke Home | |
| **Sisa budget** | Menampilkan `{budget} − {pengeluaran hari ini}`. Ketuk membuka Pengaturan Budget | FR-01.2 |
| Ikon Cart + jumlah item | Menuju Cart. Badge jumlah disembunyikan jika Cart kosong | FR-03 |
| Menu overflow `[⋮]` | Berisi aksi **"Reset data demo"** | NFR-05 |

**Keadaan sisa budget:**

| Kondisi | Teks pada header |
|---|---|
| Budget belum diatur | "Atur budget" (berfungsi sebagai ajakan) |
| Budget diatur, sisa ≥ 0 | "Sisa budget: Rp38.000" |
| Pengeluaran melebihi budget (setelah "Lanjutkan tetap") | "Budget terlampaui Rp9.000" (bukan angka negatif) |

### 2.3 Model Navigasi

- **Linear utama:** Home/Search → Menu → Cart → Checkout → Struk.
- Tidak ada bottom navigation bar. Fokus prototype adalah satu alur tugas.
- Tombol kembali peramban dan tombol kembali di layar harus konsisten.
- **Cart persisten** (local storage, NFR-05). Keluar dari alur (misalnya melalui "Lihat yang sesuai budget") tidak mengosongkan Cart.
- Dari Struk, satu-satunya aksi lanjut adalah kembali ke Home. Struk tidak dapat dibuka kembali lewat tombol kembali tanpa data pembayaran (jika tidak ada data, arahkan ke Home).

### 2.4 Hierarki Informasi Harga

Urutan kepercayaan angka, dari estimasi ke final:

| Tahap | Angka yang tampil | Label wajib | Status |
|---|---|---|---|
| Home / Search | Est. all-in menu andalan | "Est." | Estimasi |
| Menu Restoran | Harga menu, status pajak, Est. all-in 1 porsi | "Est." pada angka turunan | Estimasi |
| **Cart** | Rincian lengkap dan total | (tanpa "Est.") | **Final (otoritatif)** |
| Checkout | Total yang sama dengan Cart | "Sama dengan Keranjang" | Final |
| Struk | Jumlah dibayar yang sama | "Selisih dari Keranjang: Rp0" | Final |

---

## 3. User Flow

### 3.1 Flow F-1: Temukan Restoran Sesuai Budget → Cart (Task M-02)

```
Home
 ├─ (budget belum diatur) → banner ajakan → [Atur budget] → Pengaturan Budget → simpan → Home (badge muncul)
 └─ (budget sudah diatur)
     ├─ aktifkan [x] Sesuai Budget Saya → daftar tersaring (R-03, R-02, R-04, R-06)
     ├─ pilih urutan "Termurah (all-in)"
     └─ ketuk kartu restoran
          → Menu Restoran
              ├─ baca status pajak + price note (+ Info Sheet jika perlu)
              ├─ [Tambah] item → stepper kuantitas
              │     └─ (Cart berisi restoran lain) → Dialog Ganti Keranjang
              └─ [Lihat Keranjang] → Cart
```

### 3.2 Flow F-2: Cart → Checkout → Pembayaran (jalur normal, status OK atau WARN)

```
Cart
 ├─ ubah qty / hapus item / pasang atau lepas voucher → total dihitung ulang instan
 ├─ Budget Tracker menampilkan OK atau WARN
 └─ [Lanjut ke Checkout]
      → Checkout (total identik dengan Cart, "Selisih Rp0")
          ├─ (opsional) [Ubah alamat] → Flow F-4
          └─ [Bayar RpXX]
               → Struk Payment (simulasi)
               → pengeluaran hari ini bertambah, header diperbarui
               → [Kembali ke Home]
```

### 3.3 Flow F-3: Guardrail EXCEEDED

```
Checkout (status EXCEEDED)
 └─ [Bayar RpXX]
      → Dialog EXCEEDED (SEBELUM pembayaran)
          ├─ [Ubah pesanan]            → Cart (tanpa pembayaran)
          ├─ [Lihat yang sesuai budget] → Home dengan filter "Sesuai Budget Saya" aktif (Cart tetap tersimpan)
          ├─ [Lanjutkan tetap]         → pembayaran simulasi → Struk (mencatat jumlah melebihi budget)
          └─ Tutup (X / Esc / klik di luar) → tetap di Checkout, pembayaran TIDAK berjalan
```

### 3.4 Flow F-4: Ubah Alamat di Checkout (Zero-Delta yang transparan)

```
Checkout
 └─ [Ubah alamat] → Pilih Alamat (ADDR-01 / ADDR-02 / ADDR-03)
      ├─ pilih alamat yang sama dengan sebelumnya → tutup, tidak ada perubahan, tidak ada pemberitahuan
      └─ pilih alamat berbeda
           → fungsi kalkulasi yang sama dipanggil ulang (BR-02, BR-05)
           → Cart dan Checkout diperbarui bersamaan
           → Pemberitahuan Perubahan Total (sebelum / sesudah / penyebab)
               ├─ [Mengerti] → kembali ke Checkout; tombol bayar aktif
               └─ [Kembalikan alamat sebelumnya] → alamat dan total kembali; tombol bayar aktif
```

### 3.5 Flow F-5: Voucher Otomatis Dilepas

```
Cart (voucher terpasang)
 └─ kurangi qty / hapus item → subtotal < minimum voucher
      → voucher dilepas otomatis
      → pemberitahuan inline di area voucher (nama voucher + alasan)
      → total dihitung ulang
```

### 3.6 Flow F-6: Keadaan Khusus

| Keadaan | Perilaku | Sumber |
|---|---|---|
| Cart kosong | Layar kosong dengan tautan "Lihat restoran" dan tombol checkout nonaktif | AC-03.8 |
| Budget belum diatur | Badge disembunyikan, Est. tetap tampil, toggle "Sesuai Budget Saya" nonaktif disertai ajakan | AC-01.1, FR-05.5 |
| Pencarian tanpa hasil | Keadaan kosong dengan saran menghapus kata kunci atau mematikan filter | FR-01 |
| Filter budget menghasilkan 0 restoran | Pesan "Tidak ada restoran yang sesuai budget" + aksi [Matikan filter] dan [Atur budget] | FR-01.3 |
| Reset data demo | Dialog konfirmasi → kembali ke profil Wira default (budget Rp50.000, pengeluaran Rp12.000, ADDR-01, Cart kosong) | NFR-05 |

---

## 4. Spesifikasi Layar dan Overlay

Semua wireframe berukuran **mobile 360 px**. Tanda `~` berarti teks dapat membungkus ke baris berikutnya. Wireframe hanya menunjukkan struktur dan urutan, bukan tampilan visual.

### 4.1 Home (`/`)

**Tujuan:** menemukan restoran yang muat budget tanpa menghitung manual (G-01, G-06).

```
+----------------------------------------------+
| HEADER                                       |
| [Nama aplikasi]   [Sisa budget] [Cart] [⋮]   |
+----------------------------------------------+
| [ Cari nama restoran atau kategori...  ]     |
+----------------------------------------------+
| (kondisional: budget belum diatur)           |
| "Atur budget harianmu agar kami bisa menilai |
|  restoran yang sesuai."      [Atur budget]   |
+----------------------------------------------+
| [x] Sesuai Budget Saya        Urutkan: [v]   |
| "{n} restoran"                               |
+----------------------------------------------+
| KARTU RESTORAN (diulang)                     |
| +------------------------------------------+ |
| | [Foto]  {Nama}                           | |
| |         {Kategori} · {Jarak}             | |
| |         Est. {Rp}, sudah termasuk ~      | |
| |         ongkir dan biaya                 | |
| |         [{ikon} Sesuai budget]           | |
| |         (kondisional, lihat 5.2)         | |
| +------------------------------------------+ |
+----------------------------------------------+
```

**Aturan:**

| ID | Aturan |
|---|---|
| H-1 | Urutan default daftar: R-01 sampai R-06 (urutan data). Pilihan urutan: "Default" dan "Termurah (all-in)" |
| H-2 | Seluruh kartu adalah satu area ketuk menuju Menu Restoran. Tidak ada tombol di dalam kartu |
| H-3 | Teks estimasi pada kartu: "Est. Rp25.000, sudah termasuk ongkir dan biaya" (FR-05.1) |
| H-4 | Badge memakai tiga label: "Sesuai budget", "Mepet budget", "Melebihi budget" |
| H-5 | Budget belum diatur: badge tidak dirender, toggle filter nonaktif (bukan disembunyikan) dengan teks bantu "Atur budget untuk memakai filter ini" |
| H-6 | Mengubah budget menghitung ulang seluruh badge dan hasil filter seketika (AC-05.4, TS-06) |
| H-7 | Jumlah hasil dibacakan: "{n} restoran" berubah mengikuti filter (`aria-live="polite"`) |
| H-8 | Kartu menampilkan harga net pada estimasi untuk menu andalan berdiskon (AC-01.6) |

**Hasil acuan (profil default):** tanpa filter, 6 kartu. Dengan filter dan "Termurah (all-in)": R-03 (Est. Rp25.000, Sesuai budget), R-02 (Est. Rp26.500, Sesuai budget), R-04 (Est. Rp28.500, Mepet budget), R-06 (Est. Rp35.000, Mepet budget).

> Catatan badge pada profil default: R-03 dan R-02 "Sesuai budget" (74% dan 77%), R-04 dan R-06 "Mepet budget" (81% dan 94%), R-05 dan R-01 "Melebihi budget" (107,8% dan 124%).

### 4.2 Search (`/cari`)

Search memakai struktur dan komponen kartu yang identik dengan Home (AC-05.5).

```
+----------------------------------------------+
| HEADER (sama dengan Home)                    |
+----------------------------------------------+
| [<] [ {kata kunci}                    ] [x]  |
+----------------------------------------------+
| [x] Sesuai Budget Saya        Urutkan: [v]   |
| "{n} hasil untuk '{kata kunci}'"             |
+----------------------------------------------+
| KARTU RESTORAN (identik dengan Home)         |
+----------------------------------------------+
| (kondisional: tanpa hasil)                   |
| "Tidak ada hasil untuk '{kata kunci}'."      |
| [Hapus kata kunci]                           |
+----------------------------------------------+
```

- Pencarian mencocokkan **nama** atau **kategori** (cakupan PRD 8.2), tidak peka huruf besar-kecil.
- Pencarian berjalan saat pengguna mengetik (tanpa tombol kirim wajib).
- Filter dan urutan yang aktif di Home dibawa ke Search.

### 4.3 Menu Restoran (`/restoran/:id`)

**Tujuan:** pengguna memahami komponen harga sebelum menambah item (G-02).

```
+----------------------------------------------+
| HEADER                                       |
+----------------------------------------------+
| [Foto sampul]                                |
| {Nama restoran}                              |
| {Kategori} · {Jarak}                         |
| Ongkir {Rp} · Layanan {Rp} · Kemasan {Rp}/item|
| [Badge budget] (kondisional)                 |
| [i Apa saja biaya ini?]                      |
+----------------------------------------------+
| DAFTAR MENU (diulang)                        |
| +------------------------------------------+ |
| | [Foto item]                              | |
| | {Nama menu}                              | |
| | {Deskripsi singkat} (kondisional)        | |
| | {Harga asli dicoret} {Harga net}         | |
| |   (harga asli hanya jika ada diskon)     | |
| | {Status pajak}                           | |
| | PRICE NOTE (maks. 2 baris):              | |
| |   Baris 1: {Status pajak + kemasan}      | |
| |   Baris 2: Est. all-in 1 porsi: {Rp}     | |
| |   [i]                                    | |
| | [Tambah]  atau  [–] {qty} [+]            | |
| +------------------------------------------+ |
+----------------------------------------------+
| BAR KERANJANG (sticky, kondisional)          |
| {n} item · Subtotal {Rp}   [Lihat Keranjang] |
+----------------------------------------------+
```

**Urutan konten dalam item (struktur DOM dan urutan baca):** foto → nama → harga → status pajak → price note → kontrol kuantitas.

**Aturan:**

| ID | Aturan | Sumber |
|---|---|---|
| M-1 | Status pajak tampil sebagai **teks** pada setiap item: "Belum termasuk pajak" atau "Sudah termasuk pajak" | FR-02.1 |
| M-2 | Price note berada tepat di bawah foto item, **maksimal 2 baris** | FR-02.2, AC-02.2 |
| M-3 | Baris 1 price note mengikuti dua pola tetap (lihat 5.3). Pada layar sempit, baris 1 dipersingkat, **tidak boleh menjadi 3 baris** | FR-02.2 |
| M-4 | Baris 2 selalu berformat "Est. all-in 1 porsi: Rp{n}" dan angkanya tidak boleh terpotong | BR-04, FR-02.3 |
| M-5 | Item berdiskon: harga asli dan harga net sama-sama terlihat, estimasi memakai harga net (contoh M-201: Rp17.000 → Rp15.000) | FR-02.6, AC-02.6 |
| M-6 | Ikon `[i]` pada price note dan tautan "Apa saja biaya ini?" keduanya membuka **Info Sheet** yang sama | FR-02.4, FR-02.5 |
| M-7 | Pertama kali item ditambahkan, tombol `[Tambah]` berubah menjadi stepper `[–] n [+]`. Kuantitas minimal 1. `[–]` pada qty 1 menghapus item dari Cart | FR-03.4 |
| M-8 | Menambah item dari restoran yang berbeda dari isi Cart memunculkan Dialog Ganti Keranjang (4.8) dan **tidak** mencampur item | FR-03.7, AC-03.7 |
| M-9 | Bar keranjang tampil hanya jika Cart berisi item restoran ini. Subtotal di bar memakai label "Subtotal item" (bukan total) agar tidak dikira total akhir | P-1 |

### 4.4 Cart (`/keranjang`)

**Tujuan:** satu titik kalkulasi otoritatif dengan rincian lengkap (G-03).

```
+----------------------------------------------+
| HEADER                                       |
+----------------------------------------------+
| Keranjang · {Nama restoran}   [Kosongkan]    |
+----------------------------------------------+
| ITEM (diulang)                               |
| [Foto] {Nama menu}                           |
|        {Harga net} · {Status pajak}          |
|        [–] {qty} [+]            [Hapus]      |
+----------------------------------------------+
| VOUCHER                                      |
| Voucher makanan : [Pilih voucher >]          |
|    atau {Nama} −Rp{n}   [Lepas]              |
| Voucher ongkir  : [Pilih voucher >]          |
|    atau {Nama} −Rp{n}   [Lepas]              |
| (kondisional: pemberitahuan voucher dilepas) |
+----------------------------------------------+
| RINCIAN BIAYA                      [i Info]  |
| Subtotal item ..................... Rp{n}    |
| Pajak restoran (10%) .............. Rp{n}    |
| Biaya kemasan ..................... Rp{n}    |
| Ongkos kirim ...................... Rp{n}    |
| Biaya layanan ..................... Rp{n}    |
| Diskon voucher makanan ........... −Rp{n}    |
| Diskon voucher ongkir ............ −Rp{n}    |
| -------------------------------------------- |
| TOTAL ............................. Rp{n}    |
+----------------------------------------------+
| BUDGET TRACKER (lihat 5.1)                   |
+----------------------------------------------+
| BAR AKSI (sticky)                            |
| [Lanjut ke Checkout]                         |
+----------------------------------------------+
```

**Aturan:**

| ID | Aturan | Sumber |
|---|---|---|
| C-1 | Urutan baris rincian tetap seperti wireframe dan tidak berubah antar layar (Cart, Checkout, Struk) | FR-03.2, P-2 |
| C-2 | Baris diskon yang tidak aktif tetap tampil sebagai "−Rp0" atau disembunyikan secara konsisten. **Keputusan: tetap tampil sebagai "−Rp0"** agar struktur rincian sama pada semua kondisi | P-2 |
| C-3 | Baris pajak untuk Cart yang seluruh itemnya "Sudah termasuk pajak" tampil "Rp0" dengan keterangan "Semua item sudah termasuk pajak" (TS-05) | BR-02 |
| C-4 | Setiap perubahan (qty, hapus, voucher) memperbarui seluruh rincian, total, dan Budget Tracker pada satu pembaruan tanpa reload | FR-03.4, NFR-02 |
| C-5 | Hanya satu slot voucher makanan dan satu slot voucher ongkir. Memasang voucher makanan kedua **mengganti** yang lama, dan penggantian disampaikan lewat pemberitahuan inline | FR-03.3, AC-03.4 |
| C-6 | Jika voucher terpasang tidak lagi memenuhi syarat, voucher dilepas otomatis disertai pemberitahuan inline yang menyebut nama voucher dan alasan | FR-03.6, AC-03.6 |
| C-7 | Tombol "Lanjut ke Checkout" aktif jika Cart berisi minimal 1 item | AC-03.8 |
| C-8 | Cart kosong: tampil "Keranjangmu kosong" dengan tautan [Lihat restoran]. Rincian, Budget Tracker, dan bar aksi disembunyikan, tombol checkout nonaktif | AC-03.8 |
| C-9 | Mengubah qty ke 0 sama dengan menghapus. Menghapus item terakhir memicu keadaan Cart kosong | FR-03.4 |

#### 4.4.1 Overlay: Daftar Voucher

```
+----------------------------------------------+
| Pilih voucher makanan             [Tutup X]  |
+----------------------------------------------+
| VOUCHER DAPAT DIPAKAI                        |
| ( ) {Nama} · {Nilai}                         |
|     Min. belanja {Rp} · Maks. {Rp}           |
| ...                                          |
| VOUCHER BELUM DAPAT DIPAKAI                  |
|   {Nama} · {Nilai}                           |
|   Alasan: "Kurang Rp5.000 dari minimum"      |
|   (tidak dapat dipilih)                      |
+----------------------------------------------+
| [Terapkan]                                   |
+----------------------------------------------+
```

- Setiap kali dibuka, panel hanya memuat jenis yang sesuai slot (makanan atau ongkir).
- Voucher yang tidak memenuhi syarat tampil dengan **alasan tertulis** dan tidak dapat dipilih (FR-03.5, AC-03.5).
- Voucher khusus restoran (V-F03) hanya muncul pada Cart R-05 (BR-07e).
- Pratinjau dampak: di dekat tombol Terapkan, tampil "Total menjadi Rp{n}" untuk pilihan yang sedang ditandai.

### 4.5 Checkout (`/checkout`)

**Tujuan:** konfirmasi tanpa kejutan. Tidak ada kalkulasi baru, hanya tampilan hasil fungsi yang sama dengan Cart (G-04).

```
+----------------------------------------------+
| HEADER (disederhanakan)  [<] Checkout        |
+----------------------------------------------+
| ALAMAT PENGIRIMAN                            |
| {Label alamat}                  [Ubah alamat]|
| {Keterangan selisih ongkir, jika ≠ Rp0}      |
+----------------------------------------------+
| PESANAN · {Nama restoran}                    |
| {n} item  [Lihat item v] (lipat/buka)        |
+----------------------------------------------+
| RINCIAN BIAYA                                |
| (struktur identik dengan Cart, hanya-baca)   |
| ...                                          |
| TOTAL ............................. Rp{n}    |
| "Sama dengan Keranjang · Selisih Rp0"        |
+----------------------------------------------+
| (kondisional) PERUBAHAN TERAKHIR             |
| "Total berubah dari Rp{a} menjadi Rp{b}      |
|  karena {penyebab}."                         |
+----------------------------------------------+
| BUDGET TRACKER (lihat 5.1)                   |
+----------------------------------------------+
| PEMBAYARAN                                   |
| "Pembayaran simulasi, tanpa transaksi nyata" |
+----------------------------------------------+
| BAR AKSI (sticky)                            |
| [Bayar Rp{total}]                            |
+----------------------------------------------+
```

**Aturan:**

| ID | Aturan | Sumber |
|---|---|---|
| K-1 | Total di Checkout dihasilkan oleh fungsi kalkulasi yang sama dengan Cart. Tidak boleh ada kalkulasi terpisah di komponen | BR-02, FR-04.2 |
| K-2 | Label "Sama dengan Keranjang · Selisih Rp0" tampil jika total = total Cart. Setelah perubahan alamat, Cart ikut diperbarui sehingga label tetap berlaku | FR-04.1 |
| K-3 | Tombol bayar memuat angka total (misalnya "Bayar Rp47.000") agar angka yang disetujui terlihat persis pada aksi | P-2 |
| K-4 | Daftar item di Checkout **hanya-baca**. Mengubah isi pesanan dilakukan di Cart melalui tautan "Ubah di Keranjang" | FR-03.1 |
| K-5 | Saat status EXCEEDED, tombol bayar tetap berlabel jumlah, dan penekanannya memicu Dialog EXCEEDED, bukan pembayaran | FR-04.4 |
| K-6 | Tombol bayar tidak dapat ditekan sementara overlay Pemberitahuan Perubahan Total terbuka | BR-05 |
| K-7 | Blok "Perubahan terakhir" tetap terlihat sampai pengguna meninggalkan Checkout atau mengubah alamat lagi | FR-04.6 |

#### 4.5.1 Overlay: Pilih Alamat

```
+----------------------------------------------+
| Pilih alamat pengiriman           [Tutup X]  |
+----------------------------------------------+
| (o) {Label alamat}                           |
|     Selisih ongkir: {+Rp0 / +Rp3.000 / ...}  |
| ( ) ...                                      |
| ( ) ...                                      |
+----------------------------------------------+
| "Selisih ongkir dihitung dari ongkir dasar   |
|  restoran. Total akhir dihitung ulang."      |
+----------------------------------------------+
| [Pakai alamat ini]                           |
+----------------------------------------------+
```

**Data alamat mock (selisih ongkir tetap, bilangan bulat, berlaku untuk semua restoran):**

| ID | Label alamat | Selisih ongkir | Keterangan |
|---|---|---:|---|
| ADDR-01 | Kos dekat kampus, Malang (data fiktif) | +Rp0 | Default profil Wira |
| ADDR-02 | Rumah teman di Lowokwaru, Malang (data fiktif) | +Rp3.000 | |
| ADDR-03 | Tempat kerja paruh waktu di Klojen, Malang (data fiktif) | +Rp5.000 | |

Rumus: `ongkir efektif = ongkir dasar restoran + selisih ongkir alamat`. Seluruh bilangan bulat Rupiah (BR-01).

**Aturan:**

| ID | Aturan |
|---|---|
| A-1 | Alamat terpilih awal = ADDR-01 (atau alamat terakhir yang dipakai pada sesi Cart yang sama) |
| A-2 | Setiap opsi menampilkan label alamat dan selisih ongkir sebagai teks, termasuk "+Rp0" untuk ADDR-01 agar perbandingannya jelas |
| A-3 | Memilih alamat yang sama dengan alamat aktif menutup panel tanpa perubahan dan tanpa pemberitahuan |
| A-4 | Memilih alamat berbeda memicu kalkulasi ulang dan overlay Pemberitahuan Perubahan Total (4.5.2) |
| A-5 | Voucher ongkir dihitung ulang terhadap ongkir efektif yang baru: `min(nilai, batas maksimal, ongkir efektif)` (BR-07d). Syarat minimum voucher dihitung terhadap subtotal sehingga **tidak terpengaruh** perubahan alamat |

**Contoh dampak alamat terhadap total (angka dihitung dengan aturan BR-06 sampai BR-09; profil default, budget Rp50.000, pengeluaran Rp12.000):**

| Cart | Alamat | Ongkir efektif | Diskon ongkir | Total | Proyeksi | Status |
|---|---|---:|---:|---:|---|---|
| Contoh C (R-02, V-F01 + V-D02) | ADDR-01 | Rp6.000 | −Rp5.000 | Rp28.500 | Rp40.500 (81%) | WARN |
| Contoh C | ADDR-02 | Rp9.000 | −Rp5.000 | Rp31.500 | Rp43.500 (87%) | WARN |
| Contoh C | ADDR-03 | Rp11.000 | −Rp5.000 | Rp33.500 | Rp45.500 (91%) | WARN |
| Contoh B (R-01, V-F01 + V-D01) | ADDR-01 | Rp12.000 | −Rp8.000 | Rp47.000 | Rp59.000 (118%) | EXCEEDED |
| Contoh B | ADDR-02 | Rp15.000 | −Rp8.000 | Rp50.000 | Rp62.000 (124%) | EXCEEDED |
| Contoh B | ADDR-03 | Rp17.000 | −Rp8.000 | Rp52.000 | Rp64.000 (128%) | EXCEEDED |
| R-03 (M-301 saja, tanpa voucher) | ADDR-01 | Rp4.000 | Rp0 | Rp25.000 | Rp37.000 (74%) | OK |
| R-03 | ADDR-02 | Rp7.000 | Rp0 | Rp28.000 | Rp40.000 (80%) | WARN (tepat di batas) |
| R-03 | ADDR-03 | Rp9.000 | Rp0 | Rp30.000 | Rp42.000 (84%) | WARN |
| R-03 (M-301 + V-D02) | ADDR-01 | Rp4.000 | −Rp4.000 | Rp21.000 | Rp33.000 (66%) | OK |
| R-03 (M-301 + V-D02) | ADDR-02 | Rp7.000 | −Rp5.000 | Rp23.000 | Rp35.000 (70%) | OK |

> Dua temuan desain dari tabel ini: (1) **perubahan total tidak selalu sama dengan selisih ongkir.** Pada R-03 dengan V-D02, ADDR-02 menaikkan ongkir Rp3.000 tetapi total hanya naik Rp2.000 karena diskon ongkir ikut naik dari Rp4.000 ke Rp5.000 (ongkir dasar Rp4.000 masih di bawah batas voucher). Karena itu pemberitahuan harus menguraikan penyebab per komponen. (2) **Status budget dapat berubah** akibat ganti alamat (R-03: OK → WARN pada ADDR-02 dan ADDR-03), sehingga pemberitahuan juga menyebut perubahan status.

#### 4.5.2 Overlay: Pemberitahuan Perubahan Total

Muncul segera setelah alamat berubah (BR-05, FR-04.6, AC-04.2). Bersifat dialog modal.

```
+----------------------------------------------+
| Total pesananmu berubah                      |
+----------------------------------------------+
| Sebelum ........................... Rp28.500 |
| Sesudah ........................... Rp31.500 |
| Selisih ........................... +Rp3.000 |
+----------------------------------------------+
| Penyebab                                     |
| Alamat diganti ke {Label alamat baru}        |
| • Ongkos kirim: Rp6.000 → Rp9.000 (+Rp3.000) |
| • Diskon voucher ongkir: tidak berubah       |
|   (atau: −Rp4.000 → −Rp5.000 (−Rp1.000))    |
+----------------------------------------------+
| (kondisional) Status budget:                 |
| "Berubah dari Sesuai budget menjadi Mepet    |
|  budget (80%)."                              |
+----------------------------------------------+
| [Mengerti]                                   |
| [Kembalikan alamat sebelumnya]               |
+----------------------------------------------+
```

**Aturan:**

| ID | Aturan |
|---|---|
| N-1 | Memuat **tiga unsur wajib**: total sebelum, total sesudah, dan penyebab (FR-04.6) |
| N-2 | Penyebab menguraikan setiap komponen yang berubah. Jumlah perubahan komponen harus sama dengan selisih total |
| N-3 | Jika status budget berubah (OK/WARN/EXCEEDED), perubahan status disebut pada blok tersendiri |
| N-4 | Fokus awal pada `[Mengerti]`. `[Kembalikan alamat sebelumnya]` mengembalikan alamat dan total lama, lalu menutup dialog tanpa pemberitahuan tambahan |
| N-5 | Menutup dialog dengan Esc atau tombol tutup diperlakukan sama dengan `[Mengerti]`: perubahan tetap berlaku dan pemberitahuan sudah ditampilkan, lalu blok "Perubahan terakhir" tetap tersedia di Checkout |
| N-6 | Angka "sesudah" di dialog sama persis dengan total yang tampil di Cart dan Checkout setelah dialog ditutup (tidak ada angka kedua) |

### 4.6 Struk Payment (`/struk`)

```
+----------------------------------------------+
| HEADER (disederhanakan)                      |
+----------------------------------------------+
| "Pembayaran berhasil (simulasi)"             |
| "Tidak ada transaksi nyata."                 |
+----------------------------------------------+
| {Nama restoran} · {Label alamat}             |
| ITEM: {nama × qty ... Rp}                    |
+----------------------------------------------+
| RINCIAN BIAYA (identik dengan Cart)          |
| TOTAL DIBAYAR ..................... Rp{n}    |
| "Selisih dari Keranjang: Rp0"                |
+----------------------------------------------+
| BUDGET                                       |
| Budget harian ..................... Rp{n}    |
| Pengeluaran hari ini (diperbarui) . Rp{n}    |
| Sisa budget ....................... Rp{n}    |
| (kondisional: dilanjutkan saat EXCEEDED)     |
| "Pesanan ini melebihi budget Rp{n}."         |
+----------------------------------------------+
| [Kembali ke Home]                            |
+----------------------------------------------+
```

- Pengeluaran hari ini = pengeluaran sebelumnya + total dibayar (FR-04.8). Contoh AC-04.12: Rp12.000 + Rp28.500 = Rp40.500, sisa Rp9.500.
- Jika pembayaran dilanjutkan dari dialog EXCEEDED, baris "Pesanan ini melebihi budget Rp{n}" wajib tampil dengan jumlah lebihnya (FR-04.7). Contoh Contoh B: Rp12.000 + Rp47.000 = Rp59.000, melebihi Rp9.000.
- Setelah struk, Cart dikosongkan.

### 4.7 Overlay: Pengaturan Budget

```
+----------------------------------------------+
| Budget makan harian               [Tutup X]  |
+----------------------------------------------+
| Budget saat ini: {Rp atau "belum diatur"}    |
| Pengeluaran hari ini: Rp{n}                  |
| Rp [ {input angka}                      ]    |
| "Bilangan bulat, Rp10.000 sampai Rp500.000"  |
| (kondisional) pesan kesalahan                |
+----------------------------------------------+
| [Simpan]   [Batal]                           |
+----------------------------------------------+
```

- Kolom input menerima angka bulat saja. Pratinjau terformat (misalnya "Rp50.000") tampil di dekat kolom saat mengetik.
- Validasi dijalankan saat **Simpan**. Pesan kesalahan tampil di bawah kolom dan terhubung ke kolom lewat `aria-describedby` (FR-01.6, AC-01.3).
- Setelah simpan berhasil: overlay menutup, header memperbarui sisa budget, badge dan filter dihitung ulang (AC-01.2, AC-05.4).
- Pesan kesalahan: lihat 5.3.

### 4.8 Overlay: Konfirmasi Ganti Keranjang

```
+----------------------------------------------+
| Ganti keranjang?                             |
+----------------------------------------------+
| Keranjangmu berisi item dari {Restoran A}.   |
| Menambah item dari {Restoran B} akan         |
| mengosongkan keranjang yang lama.            |
+----------------------------------------------+
| [Ganti keranjang]   [Tetap di keranjang lama]|
+----------------------------------------------+
```

- Fokus awal pada `[Tetap di keranjang lama]` (aksi yang tidak menghapus data).
- Tutup dialog = tetap di keranjang lama.

### 4.9 Overlay: Dialog EXCEEDED

```
+----------------------------------------------+
| Pesanan ini melebihi budget harianmu         |
+----------------------------------------------+
| Budget harian ..................... Rp50.000 |
| Pengeluaran hari ini .............. Rp12.000 |
| Pesanan ini ....................... Rp47.000 |
| Proyeksi .......... Rp59.000 (118%)          |
| Melebihi budget ................... Rp9.000  |
+----------------------------------------------+
| [Ubah pesanan]                               |
| [Lihat yang sesuai budget]                   |
| [Lanjutkan tetap]                            |
+----------------------------------------------+
```

| ID | Aturan | Sumber |
|---|---|---|
| E-1 | Muncul **sebelum** pembayaran ketika tombol bayar ditekan dengan status EXCEEDED | FR-04.4, AC-04.7 |
| E-2 | Tiga aksi wajib, dengan urutan dan hierarki: "Ubah pesanan", "Lihat yang sesuai budget", "Lanjutkan tetap". Aksi yang melewati budget berada paling akhir | P-7 |
| E-3 | Fokus awal pada `[Ubah pesanan]`. `[Lanjutkan tetap]` tidak pernah menerima fokus awal | P-7 |
| E-4 | Menutup dialog (tombol tutup, Esc, atau klik di luar) **tidak** melanjutkan pembayaran dan tidak mengubah apa pun | FR-04.5, AC-04.11 |
| E-5 | "Ubah pesanan" → Cart. "Lihat yang sesuai budget" → Home dengan filter aktif. "Lanjutkan tetap" → pembayaran simulasi dan Struk | AC-04.8 sampai AC-04.10 |
| E-6 | Angka pada dialog (proyeksi dan persentase) sama dengan Budget Tracker di Checkout | FR-04.3 |
| E-7 | Dialog tidak muncul untuk status OK atau WARN (termasuk tepat 100%) | AC-04.6 |

### 4.10 Overlay: Info Sheet Komponen Biaya

```
+----------------------------------------------+
| Apa saja biaya pesananmu?         [Tutup X]  |
+----------------------------------------------+
| Pajak restoran                               |
|   Tarif 10%, hanya untuk item bertanda       |
|   "Belum termasuk pajak".                    |
| Biaya kemasan                                |
|   Dikenakan per item.                        |
| Ongkos kirim                                 |
|   Tarif tetap sesuai restoran dan alamat.    |
| Biaya layanan                                |
|   Tarif tetap per pesanan.                   |
| Tentang "Est."                               |
|   Perkiraan satu porsi sebelum voucher.      |
|   Total pasti ada di Keranjang.              |
+----------------------------------------------+
| [Mengerti]                                   |
+----------------------------------------------+
```

- Dibuka dari: price note, tautan di header Menu Restoran, dan tautan `[i Info]` di rincian Cart (FR-02.5).
- Menutup dialog mengembalikan fokus dan posisi gulir ke pemicu (AC-02.5).

### 4.11 Penataan Ulang pada Layar Lebar

Layar lebar hanya menata ulang. Tidak ada fungsi tambahan.

| Rentang lebar (usulan) | Home / Search | Menu Restoran | Cart / Checkout | Overlay |
|---|---|---|---|---|
| 360 sampai 767 px | 1 kolom | 1 kolom | 1 kolom, bar aksi sticky di bawah | Bottom sheet; dialog di tengah |
| 768 sampai 1023 px | Grid 2 kolom | Daftar menu 1 kolom dengan header restoran di atas | 1 kolom, lebar konten dibatasi | Dialog di tengah |
| 1024 sampai 1440 px | Grid 3 kolom, lebar maksimum kontainer dibatasi | Header restoran di atas, menu 2 kolom | **2 kolom**: item dan voucher di kiri, rincian + Budget Tracker + aksi di kanan (sticky) | Dialog di tengah |

- Tidak ada gulir horizontal pada 360 sampai 1440 px (NFR-01).
- Urutan DOM sama dengan urutan baca pada semua lebar, sehingga penataan ulang tidak mengubah urutan keyboard.

---

## 5. Komponen, State, Microcopy, dan Aksesibilitas Struktural

### 5.1 Budget Tracker

Komponen ini tampil di Cart dan Checkout (FR-03.8, FR-04.3). Pada kartu restoran dan Menu, hanya badge yang tampil.

```
+----------------------------------------------+
| Budget hari ini            [{ikon} {Status}] |
| [=========|------------]  progress bar       |
| Pengeluaran hari ini ............. Rp12.000  |
| Pesanan ini ...................... Rp28.500  |
| Proyeksi: Rp40.500 dari Rp50.000 (81%)       |
| {kalimat status}                             |
+----------------------------------------------+
```

| State | Kondisi (BR-09) | Label teks | Kalimat status |
|---|---|---|---|
| **OK** | `proyeksi × 100 < budget × 80` | "Sesuai budget" | "Pesanan ini masih aman untuk budget hari ini." |
| **WARN** | `proyeksi × 100 ≥ budget × 80` dan `proyeksi ≤ budget` (termasuk tepat 100%) | "Mepet budget" | "Pesanan ini hampir menghabiskan budget hari ini. Sisa Rp{budget − proyeksi}." |
| **EXCEEDED** | `proyeksi > budget` | "Melebihi budget" | "Pesanan ini melebihi budget hari ini sebesar Rp{proyeksi − budget}." |
| **Tidak diatur** | Budget belum diatur | (tidak dirender) | Diganti ajakan "Atur budget" |

**Aturan struktural:**

- Label teks wajib selalu ada. Ikon (tiga bentuk berbeda, misalnya centang, tanda seru, silang) mendampingi teks, bukan pengganti (FR-05.4, NFR-07).
- Progress bar adalah elemen pendamping. Seluruh informasinya juga tersedia sebagai teks: `role="progressbar"` dengan `aria-valuenow` (persen), `aria-valuemin="0"`, `aria-valuemax="100"`, dan `aria-valuetext` berisi kalimat "Proyeksi 81 persen dari budget, status Mepet budget".
- Nilai di atas 100% ditulis apa adanya (misalnya "107,8%"). Bar hanya penuh, tidak melewati kontainer.
- Persentase ditampilkan dengan koma sebagai pemisah desimal (satu angka di belakang koma jika bukan bilangan bulat). Penentuan status memakai aritmatika bilangan bulat BR-09, bukan persentase yang ditampilkan.
- Perubahan status diumumkan melalui `aria-live="polite"` (lihat 5.4).

### 5.2 Badge Kecocokan Budget (Kartu dan Menu)

| State | Label | Ikon (bentuk) |
|---|---|---|
| OK | "Sesuai budget" | Centang |
| WARN | "Mepet budget" | Tanda seru |
| EXCEEDED | "Melebihi budget" | Silang |
| Budget belum diatur | (tidak dirender) | (tidak dirender) |

Badge selalu berisi teks label dan mengikuti aturan BR-08 dan BR-09 yang sama dengan Budget Tracker (FR-05.3). Nilai pesanan yang dipakai pada kartu adalah Est. all-in menu andalan.

### 5.3 Microcopy Utama

**Pesan kesalahan input budget (FR-01.6, AC-01.3):**

| Kondisi | Pesan |
|---|---|
| Kosong | "Isi budget harian dulu. Contoh: 50000." |
| Mengandung desimal atau karakter non-angka | "Budget harus bilangan bulat tanpa desimal." |
| Kurang dari Rp10.000 | "Budget minimal Rp10.000." |
| Lebih dari Rp500.000 | "Budget maksimal Rp500.000." |

**Pola price note, baris 1 (FR-02.2):**

| Status pajak | Baris 1 |
|---|---|
| Belum termasuk pajak | "Belum termasuk pajak 10% + kemasan Rp{n}." |
| Sudah termasuk pajak | "Sudah termasuk pajak. Kemasan Rp{n}." |

Baris 2 selalu: "Est. all-in 1 porsi: Rp{n}."

**Pemberitahuan voucher (FR-03.5, FR-03.6):**

| Kejadian | Pesan |
|---|---|
| Tidak eligible (minimum) | "Kurang Rp{n} dari minimum belanja." |
| Tidak eligible (restoran) | "Hanya berlaku di {Nama restoran}." |
| Voucher otomatis dilepas | "{Nama voucher} dilepas karena subtotal di bawah minimum Rp{n}. Total dihitung ulang." |
| Voucher diganti | "{Voucher lama} diganti {Voucher baru}." |

**Keadaan kosong dan sistem:**

| Konteks | Pesan |
|---|---|
| Cart kosong | "Keranjangmu kosong." + `[Lihat restoran]` |
| Filter budget tanpa hasil | "Tidak ada restoran yang sesuai budget." + `[Matikan filter]` `[Atur budget]` |
| Pencarian tanpa hasil | "Tidak ada hasil untuk '{kata kunci}'." |
| Reset data demo | "Kembalikan data demo ke awal? Budget, pengeluaran, alamat, dan keranjang akan direset." + `[Reset]` `[Batal]` |

### 5.4 Katalog State Komponen

| Komponen | State yang harus didefinisikan |
|---|---|
| Kartu restoran | Default, fokus keyboard, ditekan, dengan/tanpa badge |
| Toggle "Sesuai Budget Saya" | Aktif, tidak aktif, nonaktif (budget belum diatur), fokus |
| Item menu | Belum di Cart (tombol Tambah), di Cart (stepper), berdiskon, fokus |
| Stepper kuantitas | Qty 1 (`[–]` = hapus), qty > 1, fokus |
| Voucher (daftar) | Dapat dipilih, dipilih, tidak eligible (dengan alasan), fokus |
| Slot voucher di Cart | Kosong, terpasang, baru dilepas otomatis (dengan pemberitahuan) |
| Baris rincian | Nilai normal, nilai diskon (negatif), nol |
| Tombol "Lanjut ke Checkout" | Aktif, nonaktif (Cart kosong) |
| Tombol bayar | Aktif, nonaktif (overlay pemberitahuan terbuka), memicu dialog (EXCEEDED) |
| Budget Tracker | OK, WARN, EXCEEDED, tidak diatur |
| Input budget | Normal, fokus, galat |
| Overlay | Terbuka, tertutup, fokus awal terdefinisi |

### 5.5 Aksesibilitas Struktural (NFR-07)

Dokumen ini hanya menetapkan aksesibilitas yang bersifat struktural dan perilaku. **Kontras warna, ukuran dan jenis huruf, serta penampilan indikator fokus berada di luar cakupan** dan dibahas pada fase visual design.

#### 5.5.1 Struktur Halaman

| Aturan | Spesifikasi |
|---|---|
| Landmark | Setiap layar memiliki `header`, `main` (satu), dan `nav` jika ada navigasi. Bar aksi sticky berada di dalam `main` atau `footer` yang berlabel |
| Heading | Satu `h1` per layar (nama layar atau restoran). Bagian berikutnya `h2` (Rincian Biaya, Voucher, Budget Tracker). Tidak melompati level |
| Urutan DOM | Sama dengan urutan baca visual |
| Daftar | Daftar restoran dan menu memakai elemen daftar. Setiap kartu satu `li` |
| Link vs tombol | Navigasi antar layar = tautan. Aksi di halaman (tambah, bayar, lepas) = tombol |
| Bahasa | Atribut bahasa dokumen: Indonesia (`id`) |

#### 5.5.2 Keyboard

| Elemen | Perilaku |
|---|---|
| Seluruh kontrol | Dapat dijangkau dengan `Tab` dan diaktifkan dengan `Enter` / `Space` |
| Kartu restoran | Satu titik fokus per kartu (tautan ke Menu) |
| Stepper kuantitas | `[–]` dan `[+]` adalah tombol terpisah. Kuantitas dibacakan sebagai teks |
| Radio alamat dan voucher | Panah untuk berpindah antar opsi, `Space` untuk memilih |
| Overlay | `Esc` menutup overlay. Hasilnya mengikuti aturan masing-masing: pada Dialog EXCEEDED pembayaran tidak berjalan (E-4), pada Pemberitahuan Perubahan Total diperlakukan sama dengan `[Mengerti]` (N-5) |
| Skip link | "Lewati ke konten utama" sebagai elemen fokus pertama |

#### 5.5.3 Manajemen Fokus Overlay

| Overlay | Fokus awal | Saat ditutup |
|---|---|---|
| Pengaturan Budget | Kolom input | Kembali ke pemicu |
| Info Sheet | Tombol tutup | Kembali ke ikon `[i]` atau tautan pemicu |
| Daftar Voucher | Judul panel / opsi pertama | Kembali ke slot voucher pemicu |
| Pilih Alamat | Opsi alamat yang sedang aktif | Kembali ke `[Ubah alamat]` |
| Pemberitahuan Perubahan Total | `[Mengerti]` | Kembali ke `[Ubah alamat]` |
| Dialog EXCEEDED | `[Ubah pesanan]` | Jika ditutup tanpa aksi: kembali ke tombol bayar |
| Konfirmasi Ganti Keranjang | `[Tetap di keranjang lama]` | Kembali ke tombol Tambah pemicu |

- Seluruh overlay: `role="dialog"`, `aria-modal="true"`, judul ditautkan dengan `aria-labelledby`.
- Fokus **terkunci** di dalam overlay selama terbuka, dan konten di belakang tidak dapat dijangkau (`inert`).
- Dialog EXCEEDED memakai `role="alertdialog"` karena memerlukan keputusan.

#### 5.5.4 Informasi Status Tanpa Bergantung pada Warna

| Informasi | Cara disampaikan selain warna |
|---|---|
| Status budget (OK / WARN / EXCEEDED) | Teks label + bentuk ikon berbeda + kalimat status |
| Diskon / potongan | Tanda minus dan awalan "−Rp" |
| Voucher tidak eligible | Teks alasan dan atribut `aria-disabled="true"` |
| Item berdiskon | Harga asli dicoret dan diberi teks bantu "Harga asli" untuk pembaca layar |
| Toggle aktif | Status "dipilih" dapat diakses (`aria-pressed` atau checkbox) dan tampil sebagai teks/ikon, bukan hanya perubahan tampilan |
| Galat input | Teks pesan + ikon + `aria-invalid="true"` |

#### 5.5.5 Pengumuman Dinamis (Live Region)

| Peristiwa | Teknik | Isi yang diumumkan |
|---|---|---|
| Total Cart berubah | `aria-live="polite"` pada baris total | "Total Rp{n}" |
| Status Budget Tracker berubah | `aria-live="polite"` | "{Label status}. Proyeksi {persen} persen." |
| Jumlah hasil restoran berubah | `aria-live="polite"` | "{n} restoran" |
| Voucher dilepas otomatis | `role="status"` | Pesan pemberitahuan voucher |
| Galat validasi | `role="alert"` | Pesan galat |
| Pemberitahuan perubahan total | Fokus dipindahkan ke dialog (bukan live region) | Judul dialog dibacakan |

#### 5.5.6 Area Sentuh dan Jarak (Struktural)

- Kontrol interaktif memiliki area sentuh minimal 44 × 44 px, termasuk `[–]`, `[+]`, `[i]`, dan tombol tutup.
- Antar kontrol yang berdekatan dijaga jarak yang cukup agar tidak salah sentuh, terutama `[–] n [+]` dan `[Lepas]`.
- Tombol aksi utama (Lanjut ke Checkout, Bayar) berada di bar sticky yang tidak menutupi konten penting. Konten di atasnya diberi ruang agar tidak terhalang.

### 5.6 Matriks Skenario Uji → Bagian Spesifikasi

| Skenario (PRD 9.5) | Bagian dokumen ini |
|---|---|
| TS-01 | 3.2, 4.1, 4.3, 5.1 (batas WARN 100%) |
| TS-02 | 3.3, 4.4, 4.9 |
| TS-03 | 4.4, 5.1 (WARN) |
| TS-04 | 3.5, 4.4 (aturan C-6) |
| TS-05 | 4.4 (aturan C-3) |
| TS-06 | 4.1 (aturan H-6), 4.7 |
| TS-07 | 3.4, 4.5.1, 4.5.2 |
| TS-08 | 3.6, 4.1 (aturan H-5) |

---

## Lampiran A: Asumsi Desain

Asumsi berikut dibuat karena PRD belum menetapkannya secara eksplisit. Setiap asumsi dapat dibatalkan tanpa mengubah 5 bagian utama.

| No | Asumsi | Alasan |
|---|---|---|
| A1 | PRD 9.1 hanya mendefinisikan alamat ADDR-01. Dokumen ini menambahkan **ADDR-02 (+Rp3.000)** dan **ADDR-03 (+Rp5.000)** dengan selisih ongkir tetap untuk semua restoran (tabel di 4.5.1). Disarankan memperbarui PRD Section 9.1 dan 9.2 pada revisi berikutnya | Diperlukan untuk menguji TS-07 dan AC-04.2 |
| A2 | Est. all-in sebelum Cart (kartu dan Menu) selalu memakai ongkir dasar restoran, setara alamat ADDR-01. Pemilihan alamat hanya ada di Checkout dan baru memengaruhi angka final di Cart | PRD menetapkan alamat hanya diubah saat Checkout (TS-07) |
| A3 | Alamat terpilih tersimpan bersama Cart (NFR-05) dan kembali ke ADDR-01 saat Cart dikosongkan atau "Reset data demo" | Konsistensi Zero-Delta |
| A4 | Pemberitahuan perubahan total menguraikan penyebab per komponen dan menyebut perubahan status budget jika ada | Perubahan total tidak selalu sama dengan selisih ongkir karena batas voucher ongkir (lihat 4.5.1) |
| A5 | Pemberitahuan memiliki aksi sekunder "Kembalikan alamat sebelumnya" | Memberi jalan keluar tanpa melanggar BR-05; dapat dihapus jika dianggap di luar scope |
| A6 | Penggantian voucher makanan dilakukan otomatis dengan pemberitahuan inline, tanpa dialog konfirmasi | AC-03.4 mengizinkan kedua opsi |
| A7 | V-F03 hanya ditampilkan pada Cart R-05; pada restoran lain tidak muncul di daftar | BR-07e |
| A8 | Jika pengeluaran melebihi budget setelah "Lanjutkan tetap", header menampilkan "Budget terlampaui Rp{n}" dan bukan angka negatif | Menghindari angka sisa negatif yang membingungkan |
| A9 | Baris diskon pada rincian tetap tampil "−Rp0" saat tidak ada voucher | Struktur rincian konsisten di Cart, Checkout, dan Struk |
| A10 | Cart dikosongkan setelah pembayaran simulasi berhasil | Cart berisi satu restoran dan pesanan sudah selesai |
| A11 | Metode pembayaran tidak dapat dipilih (satu jalur simulasi) | Pemilihan metode pembayaran tidak ada dalam scope PRD |
| A12 | Breakpoint pada 4.11 adalah usulan awal dan dapat disesuaikan pada fase implementasi | PRD hanya menetapkan rentang 360 sampai 1440 px |

---

*Akhir dokumen UX-SPEC TPBG v1.0.0*
