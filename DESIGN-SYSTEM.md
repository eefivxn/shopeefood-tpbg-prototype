# Design System

# ShopeeFood Transparent Pricing and Budget Guardrail (TPBG) — Repository 2

---

## Section 1: Metadata Dokumen dan Prinsip Visual

### 1.1 Metadata Dokumen

| Atribut | Keterangan |
|---|---|
| **Project Title** | ShopeeFood Transparent Pricing and Budget Guardrail (TPBG) |
| **Nama Dokumen** | DESIGN-SYSTEM.md (Repository 2: implementasi antarmuka) |
| **Mata Kuliah** | Rekayasa Interaksi (Interaction Engineering) |
| **Author** | Muhammad Arifin (NIM: 202310370311054) |
| **Institusi** | Teknik Informatika, Universitas Muhammadiyah Malang |
| **Document Version** | 1.0.0 |
| **Tanggal** | 19 November 2026 |
| **Status Dokumen** | Draft untuk review dosen dan tim |
| **Dokumen Acuan Mutlak** | `PRD_2.md` (PRD TPBG v1.0.0) dan `UX-SPEC.md` v1.0.0 (Bagian 4 dan 5) |
| **Tech Stack** | React, Vite, **Tailwind CSS v3**, **lucide-react**, local mock data (tanpa backend) |
| **Cakupan Dokumen** | Token visual, tipografi, tata letak, dan spesifikasi visual komponen. Perilaku, rute, overlay, dan microcopy **tidak diubah** dari `UX-SPEC.md` |

> TPBG adalah prototype akademik dan tidak berafiliasi dengan platform pesan-antar mana pun. Seluruh data bersifat fiktif.

### 1.2 Hubungan dengan Dokumen Lain

| Dokumen | Peran terhadap dokumen ini |
|---|---|
| `PRD_2.md` | Sumber requirement (FR, NFR, BR) dan mock data. Dokumen ini hanya menerjemahkan ke gaya visual |
| `UX-SPEC.md` | Sumber struktur layar, 7 overlay, state komponen, microcopy, dan aturan aksesibilitas struktural. Bagian yang sebelumnya sengaja dikosongkan (warna dan tipografi) diisi oleh dokumen ini |
| `DESIGN-SYSTEM.md` | Sumber tunggal nilai visual: warna, skala huruf, spasi, ukuran, dan kelas Tailwind |

**Aturan konflik:** jika ada perbedaan, urutan otoritas adalah `PRD_2.md` → `UX-SPEC.md` → `DESIGN-SYSTEM.md`. Dokumen ini tidak boleh mengubah perilaku atau microcopy.

### 1.3 Rute dan Overlay yang Dicakup

| Rute | Layar |
|---|---|
| `/` | Home |
| `/cari` | Search |
| `/restoran/:id` | Menu Restoran |
| `/keranjang` | Cart |
| `/checkout` | Checkout |
| `/struk` | Struk Payment (simulasi) |

| No | Overlay (UX-SPEC 2.1) | Varian visual pada dokumen ini |
|---|---|---|
| 1 | Pengaturan Budget | `Modal variant="sheet"` |
| 2 | Info Sheet Komponen Biaya | `Modal variant="sheet"` |
| 3 | Daftar Voucher | `Modal variant="sheet"` |
| 4 | Pilih Alamat | `Modal variant="sheet"` |
| 5 | Konfirmasi Ganti Keranjang | `Modal variant="dialog"` (`ConfirmDialog`) |
| 6 | Pemberitahuan Perubahan Total | `Modal variant="dialog"` |
| 7 | Dialog EXCEEDED | `Modal variant="dialog"` dengan `role="alertdialog"` (`BudgetExceededDialog`) |

`ConfirmDialog` juga dipakai untuk konfirmasi "Reset data demo" (UX-SPEC 3.6 dan 5.3). Menu overflow header adalah popover non-modal, bukan salah satu dari 7 overlay.

### 1.4 Prinsip Visual Utama

| ID | Prinsip | Artinya pada antarmuka | Terkait |
|---|---|---|---|
| V-1 | **Transparansi Harga Radikal** | Angka uang adalah elemen visual terpenting. Angka selalu terbaca utuh (tidak pernah terpotong), sejajar vertikal (`tabular-nums`), dan berformat konsisten. Label "Est." selalu terlihat berdampingan dengan angka estimasi. Rincian di Cart, Checkout, dan Struk memakai komponen `PriceBreakdown` yang sama | BR-04, BR-02, BR-03, FR-03.2 |
| V-2 | **Ketenangan Guardrail Budget** | Status budget disampaikan dengan nada tenang: warna lembut berlatar tint terang, teks label eksplisit, dan ikon berbentuk berbeda. Merah hanya muncul untuk status `EXCEEDED` dan galat, tidak untuk hiasan. Dialog `EXCEEDED` informatif dan tidak menghakimi | FR-04.3, FR-04.4, FR-05.4 |
| V-3 | **Keterbacaan Mobile-First (`360px` sampai `1440px`)** | Desain dimulai dari `360px` satu kolom. Layar lebar hanya menata ulang. Tidak ada scroll horizontal. Area sentuh minimal `44 × 44 px` | NFR-01, UX-SPEC 4.11, 5.5.6 |
| V-4 | **Bebas Merek Dagang Pihak Ketiga** | Tidak ada logo, nama dagang, palet khas, atau aset visual Shopee/ShopeeFood. Seluruh ilustrasi dibuat lokal dari gradien CSS dan emoji. Palet dipilih dari palet bawaan Tailwind, bukan meniru warna merek pihak lain | PRD 1.3, NFR-04 |

### 1.5 Batasan Teknis dan Larangan

| Kategori | Aturan |
|---|---|
| **CSS** | Murni utilitas **Tailwind CSS v3**. Satu-satunya CSS kustom adalah `@layer base` pada `src/index.css` (Bagian 3.6). Tidak ada plugin Tailwind |
| **Ikon** | Hanya **`lucide-react`**. Ikon dekoratif memakai `aria-hidden="true"` |
| **Library UI** | **Dilarang:** MUI, Chakra UI, Shadcn UI, Ant Design, Headless UI, Radix, atau sejenisnya. Modal, bottom sheet, dan menu dibangun sendiri dengan elemen HTML dan utilitas Tailwind |
| **Gambar** | **Dilarang** URL gambar eksternal, `<img src="http...">`, CDN gambar, dan font web eksternal (NFR-04). Thumbnail memakai gradien CSS + emoji (Bagian 4.5) |
| **Font** | Tumpukan font sistem (`font-sans` bawaan Tailwind). Tidak memuat font dari jaringan |
| **Merek** | Dilarang memakai logo, nama, atau warna khas Shopee/ShopeeFood pada antarmuka. Teks disclaimer di UI tidak menyebut nama merek (lihat 5.17) |
| **Tema** | Hanya tema terang. Tidak ada varian `dark:`. Tambahkan `<meta name="color-scheme" content="light">` pada `index.html` |
| **Kelas dinamis** | Dilarang menyusun nama kelas Tailwind dengan penggabungan string (misalnya `` `bg-${warna}-700` ``) karena tidak terdeteksi oleh JIT. Gunakan peta objek berisi string kelas utuh (Bagian 2.5) |
| **Gaya inline** | Hanya untuk nilai numerik dinamis yang tidak dapat dibuat utilitas, yaitu `style={{ width: '81%' }}` pada isian progress bar |

### 1.6 Teks Default Struktural

UX-SPEC tidak menetapkan microcopy untuk beberapa elemen struktural. Nilai berikut dipakai sebagai default implementasi agar aturan landmark dan heading (UX-SPEC 5.5.1) terpenuhi. Semua microcopy lain **wajib persis** seperti `UX-SPEC.md`.

| Elemen | Teks default |
|---|---|
| Nama aplikasi pada header | "TPBG" |
| `h1` Home (disembunyikan secara visual, `sr-only`) | "Restoran" |
| `h1` Search (`sr-only`) | "Pencarian" |
| `h1` Menu Restoran | `{Nama restoran}` |
| `h1` Cart | "Keranjang" (diikuti `· {Nama restoran}` seperti pada UX-SPEC 4.4) |
| `h1` Checkout (pada header disederhanakan) | "Checkout" |
| `h1` Struk | "Pembayaran berhasil (simulasi)" |
| Skip link | "Lewati ke konten utama" (UX-SPEC 5.5.2) |
| `aria-label` tautan Cart | "Keranjang, {n} item" |
| `aria-label` tombol kurangi pada stepper | "Kurangi jumlah {Nama menu}" (qty 1: "Hapus {Nama menu} dari keranjang") |
| `aria-label` tombol tambah pada stepper | "Tambah jumlah {Nama menu}" |
| `aria-label` tombol tutup overlay | "Tutup" |
| Footer disclaimer | "Prototype akademik. Tidak berafiliasi dengan platform pesan-antar mana pun. Seluruh data bersifat fiktif." |

---

## Section 2: Sistem Token Warna dan Status Semantik (Budget Guardrail)

Seluruh warna diambil dari palet bawaan Tailwind v3 (`orange`, `stone`, `emerald`, `amber`, `rose`) sehingga tidak ada konfigurasi warna kustom. Kolom **Hex** adalah nilai resmi palet Tailwind v3 dan dipakai sebagai acuan desainer dan penguji kontras.

### 2.1 Brand Primary (Aksen Oranye Hangat yang Kontras)

Brand memakai `orange-700` sebagai warna isian dan teks, bukan `orange-500` atau `orange-600`, karena teks putih di atas `orange-500` dan `orange-600` tidak mencapai `4.5:1`.

| Token | Peran | Kelas Tailwind | Hex | Catatan penggunaan |
|---|---|---|---|---|
| `brand-primary` | Isian tombol utama, logo mark, badge jumlah Cart, tautan, ikon aksen | `bg-orange-700`, `text-orange-700`, `border-orange-700` | `#c2410c` | Teks putih di atasnya `5.2:1` |
| `brand-primary-hover` | Hover tombol utama dan tautan | `hover:bg-orange-800`, `hover:text-orange-800` | `#9a3412` | Teks putih `7.3:1` |
| `brand-primary-active` | Active (ditekan) tombol utama | `active:bg-orange-900` | `#7c2d12` | Lebih gelap dari hover |
| `brand-tint` | Latar lembut banner ajakan, opsi terpilih, hover tombol sekunder | `bg-orange-50` | `#fff7ed` | Teks isi di atasnya memakai `text-orange-900` |
| `brand-tint-strong` | Active tombol sekunder, label "Belum termasuk pajak" | `active:bg-orange-100`, `bg-orange-100` | `#ffedd5` | |
| `brand-border` | Border banner dan chip bertema brand | `border-orange-200` | `#fed7aa` | Dekoratif |
| `brand-text` | Teks bertema brand di atas putih atau tint | `text-orange-800` | `#9a3412` | `7.3:1` di atas putih, `6.9:1` di atas `orange-50` |
| `focus-ring` | Cincin fokus keyboard | `focus-visible:ring-2 focus-visible:ring-orange-700 focus-visible:ring-offset-2` | `#c2410c` | `5.2:1` terhadap latar putih (minimal `3:1`) |

### 2.2 Permukaan Netral, Teks, dan Border

Netral memakai palet `stone` (netral hangat) agar selaras dengan aksen oranye.

| Kelompok | Token | Peran | Kelas Tailwind | Hex |
|---|---|---|---|---|
| Permukaan | `background` | Latar halaman | `bg-stone-50` | `#fafaf9` |
| Permukaan | `surface` | Kartu, header, panel, modal, input | `bg-white` | `#ffffff` |
| Permukaan | `surface-muted` | Latar sekunder (price note, chip netral, awalan input, hover ghost) | `bg-stone-100` | `#f5f5f4` |
| Permukaan | `surface-sunken` | Track progress bar, hover price note | `bg-stone-200` | `#e7e5e4` |
| Permukaan | `overlay-backdrop` | Latar belakang modal | `bg-stone-900/60` | `#1c1917` pada opasitas 60% |
| Teks | `text-primary` | Judul, nama, angka utama | `text-stone-900` | `#1c1917` |
| Teks | `text-body` | Teks isi pada tint atau paragraf panjang | `text-stone-700` | `#44403c` |
| Teks | `text-secondary` | Meta, keterangan, label baris rincian | `text-stone-600` | `#57534e` |
| Teks | `text-muted` | Placeholder dan teks bantu tersier | `text-stone-500` | `#78716c` |
| Teks | `text-on-brand` | Teks di atas isian brand | `text-white` | `#ffffff` |
| Border | `border-subtle` | Tepi kartu | `border-stone-200` | `#e7e5e4` |
| Border | `border-default` | Pemisah, tepi panel, bar sticky | `border-stone-300` | `#d6d3d1` |
| Border | `border-strong` | **Tepi kontrol input**: input, select, checkbox, radio, stepper | `border-stone-500` | `#78716c` |

**Aturan penggunaan teks netral:**

- `text-stone-500` (`4.8:1` di atas putih, `4.6:1` di atas `stone-50`) **hanya** boleh dipakai di atas `bg-white` dan `bg-stone-50`. Di atas `bg-stone-100` kontrasnya `4.4:1` sehingga **dilarang**. Di atas `surface-muted` pakai `text-stone-600` atau `text-stone-700`.
- `border-stone-400` (`2.5:1`) dan yang lebih terang **dilarang** sebagai batas kontrol karena di bawah `3:1` (WCAG 1.4.11). Border terang hanya untuk elemen dekoratif (tepi kartu dan pemisah) yang identitasnya tidak bergantung pada tepi tersebut.
- Tidak ada `text-stone-400` atau yang lebih terang untuk teks.

### 2.3 Status Semantik Budget Guardrail

Tiga status mengikuti BR-09 dan label UX-SPEC 5.1 serta 5.2. Setiap status **wajib** memiliki tiga penanda sekaligus: (1) warna, (2) **teks label**, (3) **ikon berbentuk berbeda**.

| Status | Label teks (persis UX-SPEC) | Ikon `lucide-react` (bentuk) | Latar | Teks | Border | Ikon / isian bar |
|---|---|---|---|---|---|---|
| `OK` | "Sesuai budget" | `CircleCheck` (lingkaran + centang) | `bg-emerald-50` `#ecfdf5` | `text-emerald-800` `#065f46` | `border-emerald-300` `#6ee7b7` | `text-emerald-700` / `bg-emerald-700` `#047857` |
| `WARN` | "Mepet budget" | `TriangleAlert` (segitiga + tanda seru) | `bg-amber-50` `#fffbeb` | `text-amber-900` `#78350f` | `border-amber-300` `#fcd34d` | `text-amber-700` / `bg-amber-700` `#b45309` |
| `EXCEEDED` | "Melebihi budget" | `CircleX` (lingkaran + silang) | `bg-rose-50` `#fff1f2` | `text-rose-800` `#9f1239` | `border-rose-300` `#fda4af` | `text-rose-700` / `bg-rose-700` `#be123c` |

Pemetaan ambang (BR-09, aritmetika bilangan bulat tanpa pembulatan persen): `OK` jika `proyeksi × 100 < budget × 80`; `WARN` jika `proyeksi × 100 ≥ budget × 80` dan `proyeksi ≤ budget`; `EXCEEDED` jika `proyeksi > budget`.

### 2.4 Warna Semantik Pendukung

| Token | Dipakai untuk | Kelas Tailwind | Hex |
|---|---|---|---|
| `info` | Banner informasi netral, blok "Perubahan terakhir" | `border-stone-300 bg-stone-100 text-stone-900`, ikon `text-stone-700` | `#d6d3d1`, `#f5f5f4`, `#1c1917`, `#44403c` |
| `success` | Banner konfirmasi (voucher diganti) | `border-emerald-300 bg-emerald-50 text-emerald-800` | sama dengan `OK` |
| `warning` | Banner peringatan (voucher dilepas otomatis) | `border-amber-300 bg-amber-50 text-amber-900` | sama dengan `WARN` |
| `error` | Galat validasi, tombol bahaya, aksi "Lanjutkan tetap" | `border-rose-300 bg-rose-50 text-rose-800`; tombol `border-rose-700 text-rose-800` | sama dengan `EXCEEDED` |
| `discount` | Nilai potongan pada rincian dan voucher | `text-emerald-800` | `#065f46` (tanda "−" tetap wajib sebagai penanda utama) |
| `disabled` | Tombol nonaktif | `bg-stone-200 text-stone-600` | `#e7e5e4`, `#57534e` |

### 2.5 Peta Token Status (Kode Acuan)

Berkas `src/design/budgetStatus.js`. Seluruh nilai adalah string kelas utuh agar terdeteksi JIT.

```js
import { CircleCheck, TriangleAlert, CircleX } from 'lucide-react';

export const BUDGET_STATUS = {
  OK: {
    label: 'Sesuai budget',
    Icon: CircleCheck,
    badge: 'border-emerald-300 bg-emerald-50 text-emerald-800',
    banner: 'border-emerald-300 bg-emerald-50 text-emerald-800',
    icon: 'text-emerald-700',
    fill: 'bg-emerald-700',
  },
  WARN: {
    label: 'Mepet budget',
    Icon: TriangleAlert,
    badge: 'border-amber-300 bg-amber-50 text-amber-900',
    banner: 'border-amber-300 bg-amber-50 text-amber-900',
    icon: 'text-amber-700',
    fill: 'bg-amber-700',
  },
  EXCEEDED: {
    label: 'Melebihi budget',
    Icon: CircleX,
    badge: 'border-rose-300 bg-rose-50 text-rose-800',
    banner: 'border-rose-300 bg-rose-50 text-rose-800',
    icon: 'text-rose-700',
    fill: 'bg-rose-700',
  },
};

export function getBudgetStatus(proyeksi, budget) {
  if (proyeksi > budget) return 'EXCEEDED';
  if (proyeksi * 100 >= budget * 80) return 'WARN';
  return 'OK';
}
```

Pembantu gabungan kelas (tanpa library tambahan) pada `src/design/cx.js`:

```js
export function cx(parts) {
  return parts.filter(Boolean).join(' ');
}
```

### 2.6 Kepatuhan Kontras WCAG 2.1 AA

**Aturan wajib:**

| Jenis elemen | Rasio minimum | Kriteria |
|---|---|---|
| Teks normal (di bawah `18.66px` tebal atau `24px` reguler) | **`4.5:1`** | WCAG 1.4.3 |
| Teks besar, ikon bermakna, batas kontrol input, indikator fokus, isian progress bar | **`3:1`** | WCAG 1.4.3 dan 1.4.11 |
| Elemen nonaktif dan dekoratif murni | Dikecualikan | Tetap dijaga terbaca (`text-stone-600`) |

**Pasangan warna yang disetujui.** Rasio dihitung dengan rumus luminans relatif WCAG 2.1 dan dibulatkan satu desimal. Verifikasi ulang dengan alat kontras pada build akhir.

| Latar | Teks / elemen | Rasio | Penggunaan |
|---|---|---:|---|
| `white` | `stone-900` | 17.5:1 | Judul, angka utama |
| `stone-50` | `stone-900` | 16.7:1 | Teks di latar halaman |
| `stone-100` | `stone-900` | 16.0:1 | Banner info |
| `white` | `stone-600` | 7.6:1 | Meta dan label |
| `stone-50` | `stone-600` | 7.3:1 | Meta di latar halaman |
| `stone-100` | `stone-600` | 7.0:1 | Teks di atas `surface-muted` |
| `stone-100` | `stone-700` | 9.4:1 | Teks price note |
| `white` | `stone-500` | 4.8:1 | Placeholder, teks bantu (hanya di atas putih) |
| `stone-50` | `stone-500` | 4.6:1 | Teks bantu di latar halaman |
| `stone-100` | `stone-500` | **4.4:1** | **Dilarang** untuk teks |
| `orange-700` | `white` | 5.2:1 | Tombol utama |
| `orange-800` | `white` | 7.3:1 | Hover tombol utama |
| `white` | `orange-700` | 5.2:1 | Tautan, ikon aksen |
| `orange-50` | `orange-700` | 4.9:1 | Ikon dan teks aksen di tint |
| `orange-50` | `orange-800` | 6.9:1 | Teks brand di tint |
| `orange-50` | `orange-900` | 8.8:1 | Teks banner ajakan |
| `emerald-50` | `emerald-800` | 7.3:1 | Teks status `OK` |
| `emerald-50` | `emerald-700` | 5.2:1 | Ikon status `OK` |
| `white` | `emerald-800` | 7.7:1 | Nilai potongan |
| `stone-200` (track) | `emerald-700` (isian) | 4.4:1 | Isian bar `OK` |
| `amber-50` | `amber-900` | 8.8:1 | Teks status `WARN` |
| `amber-50` | `amber-700` | 4.8:1 | Ikon status `WARN` |
| `stone-200` (track) | `amber-700` (isian) | 4.0:1 | Isian bar `WARN` |
| `rose-50` | `rose-800` | 7.3:1 | Teks status `EXCEEDED` |
| `rose-50` | `rose-700` | 5.7:1 | Ikon status `EXCEEDED` |
| `white` | `rose-800` | 8.0:1 | Pesan galat, teks tombol bahaya |
| `white` | `rose-700` | 6.3:1 | Border input galat, border tombol bahaya |
| `stone-200` (track) | `rose-700` (isian) | 5.0:1 | Isian bar `EXCEEDED` |
| `white` | `stone-500` (border) | 4.8:1 | Tepi input, checkbox, radio, stepper |
| `stone-200` | `stone-600` | 6.1:1 | Teks tombol nonaktif |

**Larangan menyampaikan status hanya lewat warna** (FR-05.4, NFR-07, UX-SPEC 5.5.4). Setiap informasi yang dibawa warna harus punya penanda kedua yang tidak bergantung pada warna:

| Informasi | Penanda non-warna wajib |
|---|---|
| Status budget (`OK` / `WARN` / `EXCEEDED`) | Teks label + ikon berbentuk berbeda (lingkaran-centang, segitiga-seru, lingkaran-silang) + kalimat status |
| Posisi ambang 80% pada progress bar | Garis penanda berujung putih + label teks "80%" |
| Potongan harga | Tanda "−" dan awalan "−Rp" |
| Item berdiskon | Harga asli dicoret + teks `sr-only` "Harga asli" |
| Status pajak | Teks "Belum termasuk pajak" / "Sudah termasuk pajak" |
| Opsi terpilih (voucher, alamat) | Penanda bulat terisi pada radio + `aria-checked` |
| Toggle "Sesuai Budget Saya" aktif | Ikon centang di dalam kotak + `aria-checked` |
| Voucher tidak eligible | Teks alasan + ikon `Ban` + `aria-disabled="true"` |
| Galat input | Teks pesan + ikon `CircleAlert` + `aria-invalid="true"` |

### 2.7 Konfigurasi Tailwind

Berkas `tailwind.config.js`. Tidak ada warna kustom dan tidak ada plugin. Breakpoint bawaan (`md` = `768px`, `lg` = `1024px`) sudah sesuai UX-SPEC 4.11.

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          '"Noto Sans"',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Noto Color Emoji"',
        ],
      },
    },
  },
  plugins: [],
};
```

Konvensi kelas bersama (konstanta `FOCUS`), dipakai pada seluruh elemen interaktif:

```js
export const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-700 focus-visible:ring-offset-2';
```

---

## Section 3: Skala Tipografi, Keterbacaan Angka, dan Format Rupiah

### 3.1 Skala Tipografi

Font: `font-sans` (tumpukan font sistem, tanpa unduhan). Semua ukuran memakai satuan `rem` bawaan Tailwind agar mengikuti pengaturan ukuran huruf pengguna. **Ukuran minimum teks adalah `text-xs` (12px)**. Dilarang memakai `text-[10px]` atau `text-[11px]`.

| Peran | Kelas Tailwind (mobile) | Tambahan `≥768px` | Warna default | Dipakai pada |
|---|---|---|---|---|
| `h1` layar | `text-xl font-bold leading-7` | `md:text-2xl md:leading-8` | `text-stone-900` | Nama restoran (Menu), "Keranjang", struk |
| `h1` compact (header disederhanakan) | `text-lg font-semibold leading-6` | tetap | `text-stone-900` | "Checkout" pada header |
| `h2` bagian | `text-base font-semibold leading-6` | `md:text-lg md:leading-7` | `text-stone-900` | Rincian Biaya, Voucher, Budget Tracker, judul overlay (`text-lg`) |
| Judul kartu (`h3`) | `text-base font-semibold leading-6` | tetap | `text-stone-900` | Nama restoran, nama menu, nama voucher |
| Teks isi | `text-sm leading-5` | `md:text-base md:leading-6` | `text-stone-900` | Paragraf, deskripsi, label baris |
| Teks isi sekunder | `text-sm leading-5` | tetap | `text-stone-600` | Meta kartu, keterangan |
| Label mikro | `text-xs leading-4 font-medium` | tetap | sesuai konteks | Badge, chip status pajak, price note, teks bantu, label "80%" |
| Angka finansial: baris rincian | `text-sm leading-5 tabular-nums` | `md:text-base md:leading-6` | `text-stone-900` | `dd` pada `PriceBreakdown` |
| Angka finansial: sorotan | `text-base font-semibold leading-6 tabular-nums` | tetap | `text-stone-900` | Harga net menu, "Est." pada kartu, proyeksi |
| Angka finansial: total | `text-lg font-bold leading-7 tabular-nums` | `md:text-xl md:leading-7` | `text-stone-900` | Baris TOTAL |
| Angka pada tombol utama | `text-base font-semibold tabular-nums` | tetap | `text-white` | "Bayar Rp47.000" |
| Input angka | `text-base tabular-nums` | tetap | `text-stone-900` | Kolom budget (16px agar tidak memicu zoom otomatis iOS) |

**Aturan umum tipografi:**

- Panjang baris paragraf informasi (Info Sheet, deskripsi) dibatasi `max-w-prose` pada `≥768px`.
- Nama panjang boleh membungkus (`break-words`). Nama tidak dipotong. Pemotongan (`truncate`) hanya untuk baris 1 `PriceNote` (Bagian 3.2).
- Teks pada tombol tidak membungkus untuk aksi utama pendek. Aksi panjang ("Kembalikan alamat sebelumnya", "Tetap di keranjang lama") boleh membungkus dengan `text-center leading-5 py-2`.
- Huruf kapital semua (`uppercase`) hanya untuk label seksi kecil pada panel, dengan `tracking-wide`. Tidak dipakai untuk microcopy yang telah ditetapkan UX-SPEC.

### 3.2 Keterbacaan Angka Finansial

| Aturan | Kelas / Implementasi |
|---|---|
| Angka sejajar vertikal pada rincian | Setiap nilai uang memakai `tabular-nums` dan berada di kolom kanan `text-right` |
| Angka tidak pernah terpotong atau terputus baris | Bungkus dengan `whitespace-nowrap` |
| Struktur baris rincian | `<dl>` dengan baris `flex items-baseline justify-between gap-3`: `dt` kiri (`min-w-0 break-words`), `dd` kanan (`whitespace-nowrap tabular-nums`) |
| Potongan | Selalu diawali "−Rp" (U+2212) |
| Nol | Tampil "Rp0" atau "−Rp0" (UX-SPEC aturan C-2 dan C-3) |
| Perbandingan antar angka | Angka dalam satu kolom memakai ukuran dan bobot yang sama, kecuali baris TOTAL |
| Estimasi | Angka estimasi selalu berdampingan dengan label "Est." dalam satu elemen yang sama |

### 3.3 Aturan Ketat `PriceNote` Dua Baris (FR-02.2; UX-SPEC M-2 sampai M-4)

**Tujuan:** Baris 1 tidak pernah meluber ke baris ke-3 pada lebar `360px`, dan Baris 2 (`"Est. all-in 1 porsi: Rp{n}."`) selalu terbaca utuh.

**Pendekatan:** `PriceNote` terdiri dari **tepat dua elemen blok satu baris**. Baris 1 `truncate` (satu baris, ellipsis jika terpaksa). Baris 2 `whitespace-nowrap` (tidak pernah membungkus). Tinggi teks dikunci oleh `leading-4`. Dengan struktur ini jumlah baris teks secara struktural tidak mungkin lebih dari dua.

```jsx
<button
  type="button"
  aria-haspopup="dialog"
  onClick={openInfoSheet}
  className="block min-h-[44px] w-full rounded-lg bg-stone-100 px-2.5 py-1.5 text-left text-xs leading-4 text-stone-700 hover:bg-stone-200 active:bg-stone-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-700 focus-visible:ring-offset-2"
>
  <span className="block truncate">Belum termasuk pajak 10% + kemasan Rp2.000.</span>
  <span className="flex items-center justify-between gap-2">
    <span className="whitespace-nowrap font-semibold text-stone-900">
      Est. all-in 1 porsi: <span className="tabular-nums">Rp50.000</span>.
    </span>
    <Info className="h-4 w-4 shrink-0 text-orange-700" aria-hidden="true" />
  </span>
</button>
```

| Properti | Nilai | Alasan |
|---|---|---|
| Elemen | `<button>` seluruh blok (ikon `[i]` berada di dalamnya) | Area sentuh `≥ 44px` tanpa menyempitkan Baris 1. Satu tindakan membuka Info Sheet (FR-02.4, FR-02.5) |
| Tinggi minimum | `min-h-[44px]` (`py-1.5` + 2 × `leading-4` = 44px) | Target sentuh |
| Ukuran huruf | `text-xs leading-4` | Muat pada `360px` |
| Baris 1 | `block truncate` | Satu baris. Maksimum 2 baris total |
| Baris 2 | `flex items-center justify-between gap-2` dan `whitespace-nowrap` | Angka tidak terpotong. Ikon `Info` mengisi sisa ruang di kanan, bukan di Baris 1 |
| Ikon `[i]` | `h-4 w-4 shrink-0 text-orange-700 aria-hidden` | Dekoratif. Nama aksesibel tombol berasal dari teks |
| Nama aksesibel | Teks isi tombol + `<span className="sr-only"> Buka penjelasan komponen biaya.</span>` | Pembaca layar tahu bahwa elemen membuka Info Sheet |

**Anggaran lebar pada `360px`:**

| Bagian | Lebar |
|---|---:|
| Layar | 360 px |
| Padding kontainer (`px-4` × 2) | −32 px |
| Padding kartu (`p-3` × 2) | −24 px |
| Padding tombol price note (`px-2.5` × 2) | −20 px |
| **Lebar teks tersedia** | **284 px** |
| Baris 1 terpanjang ("Belum termasuk pajak 10% + kemasan Rp2.000." = 43 karakter × sekitar 6 px pada `text-xs`) | sekitar 255 px |
| Baris 2 terpanjang ("Est. all-in 1 porsi: Rp50.000." sekitar 30 karakter, semibold, ditambah ikon dan gap) | sekitar 210 px |

Cadangan sekitar 30 px untuk perbedaan font sistem. Pola kedua ("Sudah termasuk pajak. Kemasan Rp2.000.", 38 karakter) lebih pendek.

**Aturan tambahan:**

- Isi Baris 1 mengikuti dua pola tetap UX-SPEC 5.3. **Tidak ada versi singkat baru** karena akan mengubah microcopy. Kecukupan ruang dijamin lewat anggaran di atas.
- Jika pengguna memperbesar ukuran huruf sistem sehingga Baris 1 terpotong, `truncate` menjaga batas dua baris. Teks lengkap tetap ada di pohon aksesibilitas dan di Info Sheet.
- **Uji wajib** (Playwright atau sejenis) pada viewport `360 × 640` dengan skala huruf default untuk seluruh 24 item menu mock: (1) tinggi elemen price note `≤ 44px`; (2) `scrollWidth ≤ clientWidth` untuk Baris 1 (tidak ada elipsis); (3) teks Baris 2 sama persis dengan `"Est. all-in 1 porsi: Rp{n}."`.

### 3.4 Format Rupiah Manual (BR-01, BR-11)

**Aturan:**

| Aturan | Spesifikasi |
|---|---|
| Format | Awalan `Rp` tanpa spasi, pemisah ribuan titik: `Rp30.000`, `Rp0`, `Rp1.250.000` |
| Potongan | `−Rp5.000` memakai tanda minus matematis **U+2212** (bukan tanda hubung `-`) |
| Selisih bertanda | `+Rp3.000`, `+Rp0`, `−Rp1.000` |
| Persentase | Koma sebagai pemisah desimal, satu angka di belakang koma hanya jika bukan bilangan bulat: `81%`, `107,8%` |
| Larangan | **Dilarang** `Intl.NumberFormat`, `Number.prototype.toLocaleString`, `Date`-style formatter, dan `toFixed` |
| Alasan | Pada beberapa peramban, format `id-ID` menyisipkan spasi tak terputus (`\u00A0`) antara `Rp` dan angka, serta hasil berbeda antar versi. Itu merusak kesamaan teks (uji M-07), pencocokan pengujian, dan format BR-11 |
| Tipe data | Seluruh nilai adalah bilangan bulat Rupiah (BR-01). Nilai non-integer melempar galat |

Berkas `src/lib/formatRupiah.js`:

```js
const MINUS = '\u2212';

function groupThousands(digits) {
  let result = '';
  for (let i = 0; i < digits.length; i += 1) {
    const remaining = digits.length - i;
    result += digits[i];
    if (remaining > 1 && remaining % 3 === 1) {
      result += '.';
    }
  }
  return result;
}

export function formatRupiah(amount) {
  if (!Number.isInteger(amount)) {
    throw new RangeError('formatRupiah: nilai harus bilangan bulat (BR-01)');
  }
  const sign = amount < 0 ? MINUS : '';
  return sign + 'Rp' + groupThousands(String(Math.abs(amount)));
}

export function formatDiscount(amount) {
  if (!Number.isInteger(amount) || amount < 0) {
    throw new RangeError('formatDiscount: nilai harus bilangan bulat tidak negatif');
  }
  return MINUS + 'Rp' + groupThousands(String(amount));
}

export function formatSignedRupiah(amount) {
  if (!Number.isInteger(amount)) {
    throw new RangeError('formatSignedRupiah: nilai harus bilangan bulat (BR-01)');
  }
  const sign = amount < 0 ? MINUS : '+';
  return sign + 'Rp' + groupThousands(String(Math.abs(amount)));
}

export function formatPercent(proyeksi, budget) {
  if (!Number.isInteger(proyeksi) || !Number.isInteger(budget) || budget <= 0) {
    throw new RangeError('formatPercent: proyeksi dan budget harus bilangan bulat, budget > 0');
  }
  const tenths = Math.floor((proyeksi * 2000 + budget) / (2 * budget));
  const whole = Math.floor(tenths / 10);
  const fraction = tenths % 10;
  return fraction === 0 ? whole + '%' : whole + ',' + fraction + '%';
}

export function barPercent(proyeksi, budget) {
  if (!Number.isInteger(proyeksi) || !Number.isInteger(budget) || budget <= 0) {
    throw new RangeError('barPercent: proyeksi dan budget harus bilangan bulat, budget > 0');
  }
  return Math.min(100, Math.floor((proyeksi * 100) / budget));
}
```

`formatPercent` hanya untuk tampilan. Penentuan status tetap memakai `getBudgetStatus` (Bagian 2.5) dengan aritmetika bilangan bulat BR-09.

**Kasus uji wajib** (`formatRupiah.test.js`):

| Pemanggilan | Hasil yang diharapkan |
|---|---|
| `formatRupiah(30000)` | `Rp30.000` |
| `formatRupiah(0)` | `Rp0` |
| `formatRupiah(999)` | `Rp999` |
| `formatRupiah(1000)` | `Rp1.000` |
| `formatRupiah(500000)` | `Rp500.000` |
| `formatRupiah(1250000)` | `Rp1.250.000` |
| `formatRupiah(-5000)` | `−Rp5.000` |
| `formatDiscount(5000)` | `−Rp5.000` |
| `formatDiscount(0)` | `−Rp0` |
| `formatSignedRupiah(3000)` | `+Rp3.000` |
| `formatSignedRupiah(0)` | `+Rp0` |
| `formatSignedRupiah(-1000)` | `−Rp1.000` |
| `formatPercent(40500, 50000)` | `81%` |
| `formatPercent(40000, 50000)` | `80%` |
| `formatPercent(53900, 50000)` | `107,8%` |
| `formatPercent(59000, 50000)` | `118%` |
| `formatRupiah(12.5)` | melempar `RangeError` |

Setiap hasil harus lolos ekspresi `/^[\u2212+]?Rp\d{1,3}(\.\d{3})*$/` dan **tidak boleh** mengandung `\u00A0`, `\u202F`, atau `\u2009`.

**Pagar otomatis (ESLint)** pada `.eslintrc.cjs`:

```js
module.exports = {
  rules: {
    'no-restricted-globals': [
      'error',
      { name: 'Intl', message: 'Gunakan formatRupiah dari src/lib/formatRupiah.js (BR-11).' },
    ],
    'no-restricted-properties': [
      'error',
      { property: 'toLocaleString', message: 'Dilarang: menyisipkan spasi non-breaking (BR-11).' },
      { property: 'toFixed', message: 'Dilarang: gunakan aritmetika bilangan bulat (BR-01).' },
    ],
  },
};
```

**Pembungkus tampilan.** Setiap angka uang yang dirender memakai pola berikut agar tidak terputus di baris:

```jsx
<span className="whitespace-nowrap tabular-nums">{formatRupiah(total)}</span>
```

### 3.5 Hierarki Heading dan Landmark (Visual)

| Level | Peran | Aturan visual |
|---|---|---|
| `h1` | Satu per layar | Skala "`h1` layar", atau "`h1` compact" pada header disederhanakan. Home dan Search memakai `sr-only` |
| `h2` | Bagian layar (Rincian Biaya, Voucher, Budget Tracker, judul overlay) | Skala `h2` |
| `h3` | Judul item dalam daftar (nama restoran, nama menu, nama voucher) | Skala judul kartu |
| Landmark | `header`, satu `main` (`id="konten"`), `aside` untuk ringkasan, `footer` | Lihat template halaman (Bagian 4.4) |

### 3.6 CSS Dasar (`src/index.css`)

Satu-satunya CSS di luar utilitas. Hanya berisi reset dan aturan global yang tidak dapat dinyatakan sebagai kelas elemen.

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    -webkit-text-size-adjust: 100%;
    scroll-padding-top: 5rem;
    color-scheme: light;
  }

  html.modal-open {
    overflow: hidden;
  }

  body {
    @apply bg-stone-50 font-sans text-stone-900 antialiased;
  }

  button,
  a,
  input,
  select,
  label {
    touch-action: manipulation;
  }

  [aria-disabled='true'] {
    cursor: not-allowed;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Versi 1.0.0 tidak memakai animasi selain `transition-colors` pada tombol dan tautan. Setiap `transition-*` wajib diikuti `motion-reduce:transition-none`.

---

## Section 4: Grid Tata Letak Responsif, Spasi, dan Sistem Placeholder Art Lokal

### 4.1 Kontainer dan Breakpoint

**Kontainer standar** (dipakai pada `header`, `main`, dan `footer`):

```
mx-auto w-full max-w-screen-xl px-4 md:px-6
```

`max-w-screen-xl` = `1280px`, sehingga pada viewport `1440px` konten berada di tengah dengan margin otomatis.

| Rentang lebar | Breakpoint Tailwind | Home dan Search | Menu Restoran | Cart dan Checkout | Overlay |
|---|---|---|---|---|---|
| `360–767px` | (tanpa prefiks) | 1 kolom | 1 kolom | 1 kolom, bar aksi `fixed` di bawah | `sheet` = bottom sheet. `dialog` = di tengah |
| `768–1023px` | `md:` | grid 2 kolom | 1 kolom, header restoran di atas | 1 kolom dengan lebar dibatasi `max-w-2xl`, bar aksi `fixed` | `sheet` = modal terpusat. `dialog` = di tengah |
| `1024–1440px` | `lg:` | grid 3 kolom | menu 2 kolom | **2 kolom**: item dan voucher di kiri, ringkasan di kanan (sticky) | modal terpusat |

**Kelas grid per halaman:**

| Konteks | Kelas |
|---|---|
| Daftar kartu restoran (Home, Search) | `grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-3` |
| Daftar menu item (Menu Restoran) | `grid grid-cols-1 gap-3 md:gap-4 lg:grid-cols-2` |
| Cart dan Checkout (dua kolom pada `lg`) | `mx-auto max-w-2xl lg:grid lg:max-w-none lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start lg:gap-6` |
| Kolom ringkasan sticky | `mt-4 space-y-4 lg:sticky lg:top-20 lg:mt-0 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:overscroll-contain lg:-mx-1 lg:px-1` |
| Struk | `mx-auto max-w-xl space-y-4` |

`lg:top-20` (`5rem`) = tinggi header `h-14` (`3.5rem`) ditambah jarak `1.5rem`. Kolom kanan `24rem` (`384px`). Pada `1024px`, kolom kiri sekitar `568px`.

### 4.2 Jaminan Nol Scroll Horizontal (NFR-01)

| Aturan | Implementasi |
|---|---|
| Anak flex dan grid dapat menyusut | `min-w-0` pada setiap anak yang berisi teks panjang |
| Nama panjang membungkus | `break-words` pada nama restoran, menu, voucher, dan alamat |
| Angka tidak menyusut | `whitespace-nowrap shrink-0` pada nilai uang di baris `flex`. Label di kirinya yang membungkus |
| Tidak ada lebar tetap melebihi viewport | Lebar tetap hanya pada `h-*`/`w-*` kecil (thumbnail, ikon, tombol). Lebar blok memakai `w-full` dan `max-w-*` |
| Gambar | Tidak ada `<img>` eksternal. Thumbnail adalah `div` berlebar `w-full` atau ukuran tetap kecil |
| Tabel | Tidak ada elemen `<table>` pada antarmuka. Rincian memakai `<dl>` |
| Tidak menutupi masalah | **Dilarang** `overflow-x-hidden` pada `body` atau `html` untuk menyembunyikan luapan |
| Bar sticky | `fixed inset-x-0` (bukan `w-screen`) agar tidak menambah lebar |

**Uji wajib:** pada lebar `360`, `768`, `1024`, dan `1440 px`, `document.documentElement.scrollWidth <= window.innerWidth` untuk keenam rute dan ketujuh overlay dalam keadaan terbuka.

### 4.3 Skala Spasi, Radius, Bayangan, dan Z-Index

Satuan dasar `4px` (skala bawaan Tailwind).

| Token | Kelas | Nilai | Penggunaan |
|---|---|---:|---|
| Gap ikon–teks | `gap-1.5` / `gap-2` | 6 / 8 px | Ikon dalam badge dan tombol |
| Gap antar kartu (mobile / `md+`) | `gap-3` / `md:gap-4` | 12 / 16 px | Grid kartu |
| Padding kartu padat | `p-3` | 12 px | `RestaurantCard`, `MenuItemCard`, `CartLineRow` |
| Padding panel bagian | `p-4` | 16 px | `PriceBreakdown`, `BudgetTracker`, modal |
| Jarak antar bagian | `space-y-4` | 16 px | Antar panel pada kolom |
| Jarak antar kontrol sentuh | `gap-2` minimum, `gap-3` untuk `[–]`/`[+]` dan `[Hapus]` | 8 / 12 px | UX-SPEC 5.5.6 |
| Padding bar aksi | `px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]` | 16 / 12 px | `StickyActionBar` |
| Padding bawah halaman dengan bar | `pb-28` (`lg:pb-8` jika bar tidak fixed) | 112 px | Mencegah konten tertutup bar |

| Radius | Kelas | Dipakai pada |
|---|---|---|
| Kontrol dan thumbnail kecil | `rounded-lg` (8 px) | Tombol, input, select, thumbnail |
| Kartu dan panel | `rounded-xl` (12 px) | Kartu, panel, banner |
| Modal | `rounded-2xl` (16 px), sheet `rounded-t-2xl` | Overlay |
| Pil | `rounded-full` | Badge, progress bar, penanda radio |

| Bayangan | Kelas | Dipakai pada |
|---|---|---|
| Kartu | `shadow-sm` (hover `hover:shadow-md`) | Kartu interaktif |
| Bar sticky dan popover | `shadow-lg` | `StickyActionBar`, menu overflow |
| Modal | `shadow-xl` | `Modal` |

| Lapisan | Kelas z-index |
|---|---|
| Konten | tanpa z-index |
| Header sticky dan bar aksi | `z-30` |
| Popover menu overflow | `z-40` |
| Backdrop modal | `z-40` |
| Panel modal | `z-50` |
| Skip link (saat fokus) | `z-50` |

### 4.4 Standar Target Sentuh dan Jarak (UX-SPEC 5.5.6)

| Aturan | Kelas / Nilai |
|---|---|
| Target sentuh minimum | `min-h-[44px] min-w-[44px]` pada seluruh kontrol interaktif: tombol, ikon-tombol (`[i]`, tutup, `[⋮]`), `[–]`, `[+]`, tautan berdiri sendiri, label toggle, opsi radio |
| Tombol aksi utama | `min-h-[48px]` (`h-12`) untuk "Lanjut ke Checkout", "Bayar Rp{n}", "Lihat Keranjang" |
| Jarak antar target bersebelahan | minimal `gap-2` (8 px). Untuk `[–] n [+]` dan `[Hapus]`: `gap-3` |
| Ikon dalam target | Ikon `h-5 w-5` (20 px) pada ikon-tombol, berpusat dalam area `44 × 44` |
| Area sentuh perluasan | Boleh memakai padding, **tidak** boleh dengan margin negatif yang tumpang tindih kontrol lain |
| Tautan sebaris dalam kalimat | Dikecualikan dari `44px`, tetapi tetap dibedakan dengan garis bawah |

### 4.5 Sistem Placeholder Art Lokal (Gradien CSS + Emoji)

Thumbnail restoran dan item menu **tidak memakai gambar**. Setiap thumbnail adalah `div` dengan latar gradien Tailwind dan satu emoji di tengah. Tidak ada permintaan jaringan eksternal (NFR-04). Gradien tidak membawa makna status: palet gradien sengaja menghindari hijau, kuning, dan merah yang dipakai status budget.

**Komponen `Thumbnail`:**

```jsx
function Thumbnail({ emoji, gradient, className }) {
  return (
    <div
      aria-hidden="true"
      className={cx([
        'flex shrink-0 select-none items-center justify-center overflow-hidden bg-gradient-to-br',
        gradient,
        className,
      ])}
    >
      <span className="leading-none">{emoji}</span>
    </div>
  );
}
```

Emoji berukuran ditentukan oleh kelas `text-*` pada `className` induk melalui elemen `span`. Wrapper `aria-hidden="true"` menyembunyikan seluruh thumbnail dari pembaca layar (informasi sudah ada pada nama).

| Varian | Kelas ukuran wadah | Ukuran emoji (`span`) | Dipakai pada |
|---|---|---|---|
| `card` | `h-20 w-20 rounded-lg text-4xl` | `text-4xl` (36 px) | `RestaurantCard` |
| `line` | `h-16 w-16 rounded-lg text-3xl` | `text-3xl` (30 px) | `CartLineRow`, ringkasan Checkout |
| `menu` | `h-28 w-full rounded-none text-5xl` | `text-5xl` (48 px) | `MenuItemCard` (banner di bawah tepi atas kartu) |
| `cover` | `h-32 w-full rounded-xl text-6xl md:h-40` | `text-6xl` (60 px) | Header Menu Restoran |

(Kelas `text-*` ditulis pada wadah dan diwarisi oleh `span`.)

**Peta restoran:**

| Restoran | Emoji | Gradien (`bg-gradient-to-br` +) |
|---|---|---|
| R-01 Ayam Bakar Pak Dhe | 🍗 | `from-orange-100 to-orange-200` |
| R-02 Geprek Bu Rina | 🌶️ | `from-pink-100 to-pink-200` |
| R-03 Nasi Goreng Mas Joko | 🍛 | `from-sky-100 to-sky-200` |
| R-04 Bakso Pak Slamet | 🍜 | `from-violet-100 to-violet-200` |
| R-05 Kopi & Roti Senja | ☕ | `from-stone-200 to-stone-300` |
| R-06 Sate Ayam Madura | 🍢 | `from-indigo-100 to-indigo-200` |

**Peta item menu** (gradien mengikuti restoran induk):

| Item | Emoji | Item | Emoji |
|---|---|---|---|
| M-101 Paket Ayam Bakar Promo | 🍗 | M-401 Bakso Urat | 🍲 |
| M-102 Tahu Tempe Bakar | 🍢 | M-402 Bakso Campur Komplit | 🍲 |
| M-103 Nasi Putih | 🍚 | M-403 Mie Ayam Bakso | 🍜 |
| M-104 Es Jeruk | 🍊 | M-404 Es Campur | 🍧 |
| M-201 Ayam Geprek Original | 🍗 | M-501 Kopi Susu Gula Aren | ☕ |
| M-202 Ayam Geprek Keju | 🧀 | M-502 Roti Bakar Cokelat Keju | 🍞 |
| M-203 Nasi Putih | 🍚 | M-503 Paket Sarapan | 🥐 |
| M-204 Es Teh Manis | 🥤 | M-504 Air Mineral | 💧 |
| M-301 Nasi Goreng Ayam | 🍛 | M-601 Sate Ayam | 🍢 |
| M-302 Nasi Goreng Spesial | 🍳 | M-602 Sate Kambing | 🍢 |
| M-303 Mie Goreng Jawa | 🍜 | M-603 Lontong | 🍙 |
| M-304 Es Teh Tarik | 🥤 | M-604 Es Kelapa Muda | 🥥 |

Peta disimpan di berkas data lokal (`src/data/artwork.js`) terpisah dari komponen (NFR-09). Emoji dirender oleh font emoji sistem sehingga tampilan bisa berbeda antar platform, dan hal ini diterima karena thumbnail murni dekoratif.

### 4.6 Template Halaman

Seluruh halaman memakai kerangka berikut. Kelas pada elemen berkas adalah acuan wajib.

**Kerangka dasar:**

```jsx
<div className="min-h-screen bg-stone-50 text-stone-900">
  <a
    href="#konten"
    className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-orange-800 focus:ring-2 focus:ring-orange-700"
  >
    Lewati ke konten utama
  </a>
  <Header variant="default" />
  <main id="konten" className="mx-auto w-full max-w-screen-xl px-4 pb-8 pt-4 md:px-6">
    {konten halaman}
  </main>
  <footer className="mx-auto w-full max-w-screen-xl px-4 pb-6 text-xs leading-4 text-stone-600 md:px-6">
    Prototype akademik. Tidak berafiliasi dengan platform pesan-antar mana pun. Seluruh data bersifat fiktif.
  </footer>
</div>
```

**Home (`/`):**

```jsx
<main id="konten" className="mx-auto w-full max-w-screen-xl px-4 pb-8 pt-4 md:px-6">
  <h1 className="sr-only">Restoran</h1>
  <SearchField />
  <div className="mt-3 space-y-3">
    {budgetBelumDiatur && <NoticeBanner variant="brand">{/* ajakan UX-SPEC 4.1 */}</NoticeBanner>}
    <FilterSortBar />
  </div>
  <ul className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-3">
    <li><RestaurantCard /></li>
  </ul>
</main>
```

**Search (`/cari`):** sama dengan Home. Bar pencarian menjadi `[<] [input] [x]` dengan `h1 sr-only` "Pencarian". Daftar hasil memakai grid dan `RestaurantCard` yang identik (AC-05.5). Tanpa hasil: `EmptyState`.

**Menu Restoran (`/restoran/:id`):**

```jsx
<main id="konten" className="mx-auto w-full max-w-screen-xl px-4 pb-28 pt-4 md:px-6 lg:pb-28">
  <Thumbnail variant="cover" />
  <div className="mt-3 space-y-1">
    <h1 className="text-xl font-bold leading-7 md:text-2xl md:leading-8">{nama}</h1>
    <p className="text-sm leading-5 text-stone-600">{kategori} · {jarak}</p>
    <p className="flex flex-wrap gap-x-2 text-sm leading-5 text-stone-600">
      <span>Ongkir <span className="whitespace-nowrap tabular-nums">Rp12.000</span></span>
      <span>· Layanan <span className="whitespace-nowrap tabular-nums">Rp3.000</span></span>
      <span>· Kemasan <span className="whitespace-nowrap tabular-nums">Rp2.000</span>/item</span>
    </p>
    <BudgetBadge />
    <button className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-medium text-orange-700 underline underline-offset-2 hover:text-orange-800">
      <Info className="h-4 w-4" aria-hidden="true" /> Apa saja biaya ini?
    </button>
  </div>
  <ul className="mt-4 grid grid-cols-1 gap-3 md:gap-4 lg:grid-cols-2">
    <li><MenuItemCard /></li>
  </ul>
</main>
<StickyActionBar placement="fixed" variant="cart-summary" />
```

**Cart (`/keranjang`) dan Checkout (`/checkout`):** urutan DOM dan visual sama pada semua lebar. Ringkasan berada pada `aside` setelah kolom item.

```jsx
<main id="konten" className="mx-auto w-full max-w-screen-xl px-4 pb-28 pt-4 md:px-6 lg:pb-8">
  <div className="mx-auto max-w-2xl lg:grid lg:max-w-none lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start lg:gap-6">
    <div className="space-y-4">
      {/* Cart: judul, daftar CartLineRow, slot voucher */}
      {/* Checkout: alamat pengiriman, ringkasan pesanan (hanya-baca) */}
    </div>
    <aside
      aria-label="Ringkasan biaya"
      className="mt-4 space-y-4 lg:sticky lg:top-20 lg:mt-0 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:overscroll-contain lg:-mx-1 lg:px-1"
    >
      {/* PriceBreakdown, (Checkout: blok Perubahan terakhir), BudgetTracker, (Checkout: Pembayaran simulasi), StickyActionBar */}
    </aside>
  </div>
</main>
```

Urutan DOM ini sama dengan urutan wireframe mobile UX-SPEC 4.4 dan 4.5: pada Cart: item → voucher → rincian → tracker → aksi. Pada Checkout: alamat → pesanan → rincian → perubahan terakhir → tracker → pembayaran → aksi.

**Struk (`/struk`):**

```jsx
<main id="konten" className="mx-auto w-full max-w-screen-xl px-4 pb-8 pt-4 md:px-6">
  <div className="mx-auto max-w-xl space-y-4">
    <NoticeBanner variant="success">{/* h1 "Pembayaran berhasil (simulasi)" dan "Tidak ada transaksi nyata." */}</NoticeBanner>
    <section className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">{/* restoran, alamat, item */}</section>
    <PriceBreakdown readOnly />
    <section className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">{/* ringkasan budget */}</section>
    <Button variant="primary" size="lg" className="w-full">Kembali ke Home</Button>
  </div>
</main>
```

---

## Section 5: Spesifikasi Visual dan State Komponen

Setiap komponen memuat anatomi, ukuran, kelas Tailwind, dan tabel state. Kolom state mengikuti urutan: **default, hover, `:focus-visible`, active, disabled, error**. Nilai `n/a` berarti state tidak berlaku. Seluruh microcopy dan perilaku mengikuti `UX-SPEC.md`.

**Inventaris ikon `lucide-react`:**

| Ikon | Dipakai pada |
|---|---|
| `ReceiptText` | Logo mark TPBG di header |
| `Wallet` | Tombol sisa budget |
| `ShoppingCart` | Tautan Cart, `EmptyState` Cart kosong |
| `EllipsisVertical` | Menu overflow |
| `RotateCcw` | Aksi "Reset data demo" |
| `ArrowLeft` | Tombol kembali |
| `Search`, `SearchX` | Kolom pencarian, `EmptyState` tanpa hasil |
| `X` | Tutup overlay, hapus kata kunci, tutup banner |
| `Check` | Kotak toggle dan checkbox |
| `CircleCheck`, `TriangleAlert`, `CircleX` | Status `OK`, `WARN`, `EXCEEDED` |
| `CircleAlert` | Galat validasi input |
| `Info` | Price note, tautan info biaya, banner info |
| `Plus`, `Minus`, `Trash2` | Tambah, kurangi, hapus |
| `Ticket` | Slot voucher |
| `Ban` | Voucher tidak eligible |
| `ChevronRight`, `ChevronDown` | Slot voucher, select urutan |
| `MapPin` | Alamat pengiriman |
| `Equal` | Penanda "Selisih Rp0" |

**Konvensi ikon:** `className="h-4 w-4"` untuk ikon sebaris dengan teks kecil, `h-5 w-5` pada tombol, `h-6 w-6` pada tautan Cart dan `EmptyState`. Selalu tambahkan `shrink-0` dan `aria-hidden="true"` untuk ikon dekoratif. `strokeWidth` bawaan.

### 5.1 Button (Primitif)

Dipakai oleh seluruh komponen. Satu komponen dengan prop `variant` dan `size`.

**Kelas dasar:**

```
inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-700 focus-visible:ring-offset-2 disabled:cursor-not-allowed
```

| Varian | Kelas tambahan | Dipakai pada |
|---|---|---|
| `primary` | `bg-orange-700 text-white hover:bg-orange-800 active:bg-orange-900 disabled:bg-stone-200 disabled:text-stone-600` | Aksi utama: "Lanjut ke Checkout", "Bayar Rp{n}", "Mengerti", "Ubah pesanan", "Simpan", "Terapkan", "Pakai alamat ini" |
| `secondary` | `border-2 border-orange-700 bg-white text-orange-800 hover:bg-orange-50 active:bg-orange-100 disabled:border-stone-300 disabled:bg-stone-100 disabled:text-stone-600` | "Tambah", "Lihat yang sesuai budget", "Kembalikan alamat sebelumnya", "Batal" |
| `danger-outline` | `border-2 border-rose-700 bg-white text-rose-800 hover:bg-rose-50 active:bg-rose-100 disabled:border-stone-300 disabled:bg-stone-100 disabled:text-stone-600` | "Lanjutkan tetap", "Ganti keranjang", "Reset" |
| `ghost` | `bg-transparent text-stone-800 hover:bg-stone-100 active:bg-stone-200 disabled:text-stone-600` | "Kosongkan", "Lepas", "Matikan filter" |
| `ghost-danger` | `bg-transparent text-rose-800 hover:bg-rose-50 active:bg-rose-100` | "Hapus" |
| `icon` | `min-w-[44px] px-0 bg-transparent text-stone-800 hover:bg-stone-100 active:bg-stone-200` | Tutup, `[⋮]`, kembali, hapus kata kunci |

| Ukuran | Kelas |
|---|---|
| `md` (default) | `min-h-[44px] px-4 text-sm` |
| `lg` | `min-h-[48px] px-5 text-base` |
| `block` | tambahkan `w-full` |

| State | Perilaku visual |
|---|---|
| Default | Sesuai varian |
| Hover | Latar lebih gelap (`primary`) atau tint (`secondary`, `ghost`) |
| `:focus-visible` | Cincin `ring-2 ring-orange-700 ring-offset-2` |
| Active | Latar satu langkah lebih gelap |
| Disabled | `disabled:*` pada tabel di atas. Atribut `disabled` (atau `aria-disabled="true"` bila tetap harus bisa difokus) |
| Error | `n/a`. Galat ditampilkan pada kolom atau banner, bukan pada tombol |

### 5.2 Header (Normal dan Disederhanakan)

**Header normal** (Home, Search, Menu Restoran, Cart; UX-SPEC 2.2):

```jsx
<header className="sticky top-0 z-30 border-b border-stone-200 bg-white">
  <div className="mx-auto flex h-14 w-full max-w-screen-xl items-center gap-2 px-4 md:px-6">
    <a href="/" className="inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-lg pr-2 text-base font-bold text-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-700 focus-visible:ring-offset-2">
      <span aria-hidden="true" className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-700 text-white">
        <ReceiptText className="h-5 w-5" />
      </span>
      TPBG
    </a>
    <div className="min-w-0 flex-1" />
    <button type="button" className="inline-flex min-h-[44px] min-w-0 items-center gap-1.5 rounded-lg px-2 text-left text-stone-900 hover:bg-stone-100 active:bg-stone-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-700 focus-visible:ring-offset-2">
      <Wallet className="h-5 w-5 shrink-0 text-orange-700" aria-hidden="true" />
      <span className="flex flex-col leading-tight sm:flex-row sm:items-baseline sm:gap-1">
        <span className="text-xs text-stone-600 sm:text-sm">Sisa budget:</span>
        <span className="whitespace-nowrap text-sm font-semibold tabular-nums">Rp38.000</span>
      </span>
    </button>
    <a href="/keranjang" aria-label="Keranjang, 2 item" className="relative inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-stone-900 hover:bg-stone-100 active:bg-stone-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-700 focus-visible:ring-offset-2">
      <ShoppingCart className="h-6 w-6" aria-hidden="true" />
      <span className="absolute right-0 top-1 min-w-[20px] rounded-full bg-orange-700 px-1.5 text-center text-xs font-bold leading-5 text-white tabular-nums">2</span>
    </a>
    <button type="button" aria-label="Menu lainnya" aria-haspopup="menu" className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-stone-900 hover:bg-stone-100 active:bg-stone-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-700 focus-visible:ring-offset-2">
      <EllipsisVertical className="h-5 w-5" aria-hidden="true" />
    </button>
  </div>
</header>
```

**Anggaran lebar `360px` (kontainer 328 px):** logo + "TPBG" sekitar 72 px, tombol sisa budget maksimal sekitar 120 px (dua baris), Cart 44 px, overflow 44 px, tiga `gap-2` 24 px. Total sekitar 304 px.

**Varian teks tombol sisa budget** (UX-SPEC 2.2):

| Kondisi | Konten tombol | Kelas teks tambahan |
|---|---|---|
| Budget belum diatur | Teks tunggal "Atur budget" | `text-sm font-semibold text-orange-800` |
| Sisa `≥ 0` | "Sisa budget:" + `Rp{n}` (dua baris di `<640px`, satu baris di `sm:`) | seperti kode di atas |
| Pengeluaran melebihi budget | "Budget terlampaui" + `Rp{n}` | warna `text-rose-800`, ikon `Wallet` `text-rose-700` |

**Menu overflow (popover non-modal, berisi "Reset data demo"):**

| Bagian | Kelas |
|---|---|
| Wadah posisi | `relative` pada pembungkus tombol `[⋮]` |
| Panel | `absolute right-0 top-full z-40 mt-1 w-56 rounded-xl border border-stone-200 bg-white p-1 shadow-lg` dengan `role="menu"` |
| Item | `flex min-h-[44px] w-full items-center gap-2 rounded-lg px-3 text-left text-sm font-medium text-stone-900 hover:bg-stone-100 active:bg-stone-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-700` dengan `role="menuitem"`, ikon `RotateCcw h-4 w-4` |
| Perilaku | `Esc` dan klik di luar menutup. Memilih item membuka `ConfirmDialog` reset |

**Header disederhanakan** (Checkout dan Struk):

```jsx
<header className="sticky top-0 z-30 border-b border-stone-200 bg-white">
  <div className="mx-auto flex h-14 w-full max-w-screen-xl items-center gap-2 px-4 md:px-6">
    {/* Checkout: tombol kembali + h1 */}
    <Button variant="icon" aria-label="Kembali"><ArrowLeft className="h-5 w-5" aria-hidden="true" /></Button>
    <h1 className="text-lg font-semibold leading-6 text-stone-900">Checkout</h1>
  </div>
</header>
```

Struk: tanpa tombol kembali dan tanpa `h1` di header (judul `h1` berada pada konten). Header hanya memuat logo mark dan "TPBG" seperti header normal, tetapi tanpa tombol sisa budget, Cart, dan overflow. Tanpa kolom pencarian pada kedua varian.

| State | Header | Tombol sisa budget / Cart / `[⋮]` / kembali |
|---|---|---|
| Default | `bg-white border-b border-stone-200` | Teks `text-stone-900`, latar transparan |
| Hover | n/a | `hover:bg-stone-100` |
| `:focus-visible` | n/a | Cincin `ring-orange-700 ring-offset-2` |
| Active | n/a | `active:bg-stone-200` |
| Disabled | n/a | Tidak ada (selalu aktif) |
| Error | n/a | Status "Budget terlampaui" memakai `text-rose-800` + teks eksplisit |

### 5.3 FilterSortBar (termasuk SearchField dan Toggle)

**Anatomi:** `SearchField` (baris sendiri, hanya Home dan Search) → baris `FilterToggle` + `SortSelect` → teks jumlah hasil "{n} restoran".

**SearchField:**

```jsx
<div className="relative">
  <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-600" aria-hidden="true" />
  <input
    type="search"
    className="h-11 w-full min-w-0 rounded-lg border border-stone-500 bg-white pl-10 pr-11 text-base text-stone-900 placeholder:text-stone-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-700 focus-visible:ring-offset-2"
  />
  <button type="button" aria-label="Hapus kata kunci" className="absolute right-0 top-1/2 inline-flex min-h-[44px] min-w-[44px] -translate-y-1/2 items-center justify-center rounded-lg text-stone-700 hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-700">
    <X className="h-5 w-5" aria-hidden="true" />
  </button>
</div>
```

`h-11` (44px). Tombol hapus hanya dirender saat ada teks. Placeholder memakai teks dari UX-SPEC 4.1.

**FilterToggle "Sesuai Budget Saya":**

```jsx
<label className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-lg pr-2 text-sm font-medium text-stone-900">
  <input type="checkbox" className="peer sr-only" />
  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 border-stone-500 bg-white peer-checked:border-orange-700 peer-checked:bg-orange-700 peer-checked:[&>svg]:opacity-100 peer-focus-visible:ring-2 peer-focus-visible:ring-orange-700 peer-focus-visible:ring-offset-2 peer-disabled:cursor-not-allowed peer-disabled:border-stone-300 peer-disabled:bg-stone-100">
    <Check className="h-4 w-4 text-white opacity-0" aria-hidden="true" />
  </span>
  Sesuai Budget Saya
</label>
```

Teks bantu saat nonaktif (UX-SPEC H-5): `<p className="text-xs leading-4 text-stone-600">Atur budget untuk memakai filter ini</p>` di bawah toggle. Seluruh `label` (bukan hanya kotak) adalah target sentuh `≥ 44px`. Toggle yang nonaktif memakai teks `text-stone-600` dan `aria-disabled`.

**SortSelect ("Urutkan:"):**

```jsx
<div className="relative inline-flex items-center gap-2">
  <label htmlFor="urut" className="text-sm text-stone-600">Urutkan:</label>
  <div className="relative">
    <select id="urut" className="min-h-[44px] appearance-none rounded-lg border border-stone-500 bg-white py-2 pl-3 pr-9 text-sm font-medium text-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-700 focus-visible:ring-offset-2">
      <option>Default</option>
      <option>Termurah (all-in)</option>
    </select>
    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-700" aria-hidden="true" />
  </div>
</div>
```

**Baris dan jumlah hasil:**

```jsx
<div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
  {/* FilterToggle */}{/* SortSelect */}
</div>
<p aria-live="polite" className="mt-2 text-sm leading-5 text-stone-600">3 restoran</p>
```

| State | FilterToggle | SortSelect / SearchField |
|---|---|---|
| Default | Kotak `border-stone-500 bg-white` | `border-stone-500 bg-white` |
| Hover | `hover:bg-stone-100` pada label | `hover:border-stone-700` |
| `:focus-visible` | Cincin pada kotak (`peer-focus-visible`) | `ring-2 ring-orange-700 ring-offset-2` |
| Active / dicentang | `border-orange-700 bg-orange-700` + ikon `Check` putih | n/a |
| Disabled | `border-stone-300 bg-stone-100` + teks bantu | n/a |
| Error | n/a | n/a |

### 5.4 RestaurantCard

Seluruh kartu adalah satu tautan (UX-SPEC H-2). Tidak ada tombol di dalam kartu.

```jsx
<a
  href="/restoran/R-03"
  className="flex min-h-[44px] gap-3 rounded-xl border border-stone-200 bg-white p-3 shadow-sm transition-shadow hover:border-stone-300 hover:shadow-md active:bg-stone-50 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-700 focus-visible:ring-offset-2"
>
  <Thumbnail variant="card" />
  <div className="min-w-0 flex-1">
    <h3 className="break-words text-base font-semibold leading-6 text-stone-900">Nasi Goreng Mas Joko</h3>
    <p className="text-sm leading-5 text-stone-600">Nasi &amp; Mie · 0,8 km</p>
    <p className="mt-1 text-sm leading-5 text-stone-600">
      <span className="font-semibold text-stone-900">Est. <span className="whitespace-nowrap tabular-nums">Rp25.000</span></span>, sudah termasuk ongkir dan biaya
    </p>
    <div className="mt-2"><BudgetBadge status="OK" /></div>
  </div>
</a>
```

| Properti | Nilai |
|---|---|
| Susunan | Thumbnail `card` (80 × 80) kiri, konten kanan, `gap-3` |
| Tinggi | Mengikuti konten, minimum sekitar 104 px |
| Teks estimasi | Persis "Est. {Rp}, sudah termasuk ongkir dan biaya" (UX-SPEC H-3). Boleh membungkus hingga dua baris |
| Badge | Hanya jika budget sudah diatur (H-5) |
| Daftar | Dibungkus `<li>` dalam `<ul>` grid |

| State | Tampilan |
|---|---|
| Default | `border-stone-200 bg-white shadow-sm` |
| Hover | `hover:border-stone-300 hover:shadow-md` |
| `:focus-visible` | Cincin `ring-2 ring-orange-700 ring-offset-2` |
| Active | `active:bg-stone-50` |
| Disabled | n/a |
| Error | n/a |

### 5.5 BudgetBadge

Tiga status dengan teks label dan ikon (Bagian 2.3). Elemen informatif (tidak interaktif), sehingga tidak butuh target `44px`.

```jsx
function BudgetBadge({ status, size }) {
  const s = BUDGET_STATUS[status];
  const Icon = s.Icon;
  return (
    <span
      className={cx([
        'inline-flex items-center gap-1 rounded-full border font-semibold',
        size === 'md' ? 'px-3 py-1.5 text-sm' : 'px-2.5 py-1 text-xs',
        s.badge,
      ])}
    >
      <Icon className={cx(['h-4 w-4 shrink-0', s.icon])} aria-hidden="true" />
      {s.label}
    </span>
  );
}
```

| Status | Kelas isi (`s.badge`) | Teks |
|---|---|---|
| `OK` | `border-emerald-300 bg-emerald-50 text-emerald-800` | "Sesuai budget" |
| `WARN` | `border-amber-300 bg-amber-50 text-amber-900` | "Mepet budget" |
| `EXCEEDED` | `border-rose-300 bg-rose-50 text-rose-800` | "Melebihi budget" |
| Budget belum diatur | tidak dirender | tidak dirender |

| State | Tampilan |
|---|---|
| Default | Seperti tabel |
| Hover, focus-visible, active, disabled | n/a (non-interaktif) |
| Error | `EXCEEDED` adalah status peringatan, bukan galat sistem |

### 5.6 BudgetTracker

Tampil di Cart dan Checkout (FR-03.8, FR-04.3). Menampilkan progress bar dengan **penanda visual ambang 80%**.

```jsx
<section aria-labelledby="tracker-title" className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
  <div className="flex items-center justify-between gap-3">
    <h2 id="tracker-title" className="text-base font-semibold leading-6 text-stone-900">Budget hari ini</h2>
    <BudgetBadge status="WARN" size="md" />
  </div>

  <div className="mt-3">
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={81}
      aria-valuetext="Proyeksi 81 persen dari budget, status Mepet budget"
      className="relative h-3 w-full overflow-hidden rounded-full bg-stone-200 ring-1 ring-inset ring-stone-300"
    >
      <div className="h-full rounded-full bg-amber-700" style={{ width: '81%' }} />
      <span aria-hidden="true" className="absolute inset-y-0 left-[80%] w-0.5 -translate-x-1/2 bg-stone-900 ring-1 ring-white" />
    </div>
    <div aria-hidden="true" className="relative mt-1 h-4">
      <span className="absolute left-[80%] -translate-x-1/2 text-xs leading-4 text-stone-600">80%</span>
    </div>
  </div>

  <dl className="mt-2 space-y-1 text-sm leading-5">
    <div className="flex items-baseline justify-between gap-3">
      <dt className="min-w-0 break-words text-stone-600">Pengeluaran hari ini</dt>
      <dd className="whitespace-nowrap tabular-nums text-stone-900">Rp12.000</dd>
    </div>
    <div className="flex items-baseline justify-between gap-3">
      <dt className="min-w-0 break-words text-stone-600">Pesanan ini</dt>
      <dd className="whitespace-nowrap tabular-nums text-stone-900">Rp28.500</dd>
    </div>
  </dl>

  <p className="mt-3 text-sm font-semibold leading-5 text-stone-900">
    Proyeksi: <span className="whitespace-nowrap tabular-nums">Rp40.500</span> dari <span className="whitespace-nowrap tabular-nums">Rp50.000</span> (<span className="tabular-nums">81%</span>)
  </p>
  <p aria-live="polite" className="mt-1 text-sm leading-5 text-stone-700">Pesanan ini hampir menghabiskan budget hari ini. Sisa Rp9.500.</p>
</section>
```

**Spesifikasi progress bar:**

| Bagian | Kelas / aturan | Alasan |
|---|---|---|
| Track | `h-3 rounded-full bg-stone-200 ring-1 ring-inset ring-stone-300` | Tinggi 12 px, batas terlihat |
| Isian | `h-full rounded-full` + `s.fill` (`bg-emerald-700` / `bg-amber-700` / `bg-rose-700`) dan `style={{ width: barPercent(...) + '%' }}` | Lebar dinamis. Maksimum 100% |
| **Penanda ambang 80%** | `absolute inset-y-0 left-[80%] w-0.5 -translate-x-1/2 bg-stone-900 ring-1 ring-white` | Garis vertikal. Tepi putih memastikan kontras terhadap isian apa pun (`stone-900` saja hanya `2.8:1` terhadap `rose-700`) |
| Label ambang | `text-xs text-stone-600`, teks "80%" di posisi `left-[80%]` | Penanda tidak bergantung pada warna |
| Aksesibilitas | `role="progressbar"`, `aria-valuenow` (dijepit 0 sampai 100), `aria-valuetext` berisi kalimat UX-SPEC 5.1 | Nilai di atas 100% tetap ditulis apa adanya pada teks |
| Elemen dekoratif | Penanda dan label 80% `aria-hidden="true"` | Informasi sudah ada pada `aria-valuetext` |

**Kalimat status** (persis UX-SPEC 5.1): `OK` → "Pesanan ini masih aman untuk budget hari ini."; `WARN` → "Pesanan ini hampir menghabiskan budget hari ini. Sisa Rp{budget − proyeksi}."; `EXCEEDED` → "Pesanan ini melebihi budget hari ini sebesar Rp{proyeksi − budget}.".

| State | Tampilan |
|---|---|
| Default (`OK`) | Badge hijau + isian `bg-emerald-700` + kalimat status |
| `WARN` | Badge amber + isian `bg-amber-700` |
| `EXCEEDED` | Badge rose + isian `bg-rose-700` (bar penuh 100%) |
| Budget belum diatur | Seluruh `section` diganti ajakan "Atur budget" (UX-SPEC 5.1): `NoticeBanner variant="brand"` |
| Hover, focus-visible, active, disabled | n/a (non-interaktif) |
| Error | n/a |

### 5.7 MenuItemCard

Urutan DOM mengikuti UX-SPEC 4.3: foto → nama → harga → status pajak → price note → kontrol kuantitas.

```jsx
<article className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
  <Thumbnail variant="menu" />
  <div className="space-y-2 p-3">
    <h3 className="break-words text-base font-semibold leading-6 text-stone-900">Ayam Geprek Original</h3>
    <p className="line-clamp-2 text-sm leading-5 text-stone-600">{deskripsi}</p>

    <p className="flex flex-wrap items-baseline gap-x-2">
      <span className="whitespace-nowrap text-sm tabular-nums text-stone-600 line-through">
        <span className="sr-only">Harga asli </span>Rp17.000
      </span>
      <span className="whitespace-nowrap text-base font-semibold tabular-nums text-stone-900">Rp15.000</span>
    </p>

    <span className="inline-flex items-center rounded-md border border-orange-200 bg-orange-50 px-2 py-0.5 text-xs font-medium text-orange-800">Belum termasuk pajak</span>

    <PriceNote />

    {/* [Tambah] atau QuantityStepper */}
    <Button variant="secondary" className="w-full"><Plus className="h-5 w-5" aria-hidden="true" /> Tambah</Button>
  </div>
</article>
```

| Bagian | Spesifikasi |
|---|---|
| Wadah | `rounded-xl border border-stone-200 bg-white shadow-sm overflow-hidden`. Bukan tautan. Item dalam `<li>` |
| Foto | `Thumbnail variant="menu"` (`h-28 w-full`) |
| Deskripsi | Opsional, `line-clamp-2`. Tanpa deskripsi, baris dihilangkan |
| Harga asli | Hanya jika `diskon > 0`. Dicoret `line-through`, teks `sr-only` "Harga asli" |
| Status pajak (UX-SPEC M-1) | Chip teks. **Belum termasuk pajak**: `border-orange-200 bg-orange-50 text-orange-800` (`6.9:1`). **Sudah termasuk pajak**: `border-stone-300 bg-stone-100 text-stone-800` |
| Price note | Komponen `PriceNote` (Bagian 3.3), tepat di bawah status pajak |
| Tombol `[Tambah]` | Varian `secondary`, lebar penuh, ikon `Plus`. Setelah ditambahkan berganti `QuantityStepper` pada posisi yang sama |

| State | Tampilan |
|---|---|
| Default | Seperti kode |
| Hover | Tidak ada efek pada kartu (hanya kontrol di dalamnya) |
| `:focus-visible` | Pada kontrol di dalam kartu (tombol, price note) |
| Active | Pada kontrol di dalam kartu |
| Disabled | n/a |
| Error | n/a |

### 5.8 PriceNote

Spesifikasi lengkap, anggaran lebar, dan kode ada pada **Bagian 3.3**. Ringkasan state:

| State | Tampilan |
|---|---|
| Default | `bg-stone-100 text-stone-700`, Baris 2 `font-semibold text-stone-900`, ikon `Info text-orange-700` |
| Hover | `hover:bg-stone-200` |
| `:focus-visible` | Cincin `ring-2 ring-orange-700 ring-offset-2` |
| Active | `active:bg-stone-300` |
| Disabled | n/a |
| Error | n/a |

Pola Baris 1: "Belum termasuk pajak 10% + kemasan Rp{n}." atau "Sudah termasuk pajak. Kemasan Rp{n}.". Baris 2 selalu "Est. all-in 1 porsi: Rp{n}.".

### 5.9 QuantityStepper

Satu kontrol berbingkai berisi `[–]`, nilai, dan `[+]`. Dipakai pada `MenuItemCard` dan `CartLineRow`.

```jsx
<div className="inline-flex items-center rounded-lg border border-stone-500 bg-white">
  <button
    type="button"
    aria-label="Kurangi jumlah Ayam Geprek Original"
    className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-l-lg text-stone-900 hover:bg-stone-100 active:bg-stone-200 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-700 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:text-stone-600"
  >
    <Minus className="h-5 w-5" aria-hidden="true" />
  </button>
  <span aria-live="polite" className="min-w-[2.5rem] px-1 text-center text-base font-semibold tabular-nums text-stone-900">2</span>
  <button
    type="button"
    aria-label="Tambah jumlah Ayam Geprek Original"
    className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-r-lg text-stone-900 hover:bg-stone-100 active:bg-stone-200 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-700 focus-visible:ring-offset-2"
  >
    <Plus className="h-5 w-5" aria-hidden="true" />
  </button>
</div>
```

| Aspek | Spesifikasi |
|---|---|
| Ukuran | Tinggi 44 px, lebar total sekitar 130 px (`44 + 40 + 44` ditambah border) |
| Qty = 1 | Ikon `[–]` berganti `Trash2` (`text-rose-800`) dan `aria-label` berubah menjadi "Hapus {Nama menu} dari keranjang". Perilaku tetap (UX-SPEC M-7) |
| Nilai | Teks angka, dibacakan (`aria-live="polite"`) |

| State | Tampilan |
|---|---|
| Default | Bingkai `border-stone-500`, ikon `text-stone-900` |
| Hover | `hover:bg-stone-100` pada tombol |
| `:focus-visible` | Cincin `ring-orange-700` dengan `focus-visible:z-10` agar tidak tertutup tetangga |
| Active | `active:bg-stone-200` |
| Disabled | `disabled:text-stone-600 disabled:cursor-not-allowed` |
| Error | n/a |

### 5.10 CartLineRow

```jsx
<li className="flex gap-3 border-b border-stone-200 py-3 last:border-b-0">
  <Thumbnail variant="line" />
  <div className="min-w-0 flex-1">
    <h3 className="break-words text-base font-semibold leading-6 text-stone-900">Paket Ayam Bakar Promo</h3>
    <p className="text-sm leading-5 text-stone-600">
      <span className="whitespace-nowrap tabular-nums">Rp30.000</span> · Belum termasuk pajak
    </p>
    <div className="mt-2 flex flex-wrap items-center gap-3">
      <QuantityStepper />
      <Button variant="ghost-danger"><Trash2 className="h-4 w-4" aria-hidden="true" /> Hapus</Button>
    </div>
  </div>
</li>
```

Kontainer daftar: `<ul className="rounded-xl border border-stone-200 bg-white px-3 shadow-sm">`. Judul bagian "Keranjang · {Nama restoran}" dan aksi "Kosongkan" (`ghost`) berada di atas daftar: `flex items-center justify-between gap-3`.

| State | Tampilan |
|---|---|
| Default | Seperti kode |
| Hover | Pada kontrol di dalam baris (stepper, Hapus) |
| `:focus-visible` | Pada kontrol di dalam baris |
| Active | Pada kontrol di dalam baris |
| Disabled | n/a |
| Error | n/a |

### 5.11 VoucherSlot dan VoucherPanel

**VoucherSlot** (satu untuk makanan, satu untuk ongkir; UX-SPEC 4.4):

```jsx
<section aria-labelledby="voucher-title" className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
  <h2 id="voucher-title" className="text-base font-semibold leading-6 text-stone-900">Voucher</h2>
  <div className="mt-3 space-y-2">
    {/* Slot kosong */}
    <button type="button" className="flex min-h-[44px] w-full items-center gap-3 rounded-lg border border-stone-500 bg-white px-3 text-left text-sm hover:bg-stone-50 active:bg-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-700 focus-visible:ring-offset-2">
      <Ticket className="h-5 w-5 shrink-0 text-orange-700" aria-hidden="true" />
      <span className="min-w-0 flex-1"><span className="text-stone-600">Voucher makanan:</span> <span className="font-semibold text-orange-800">Pilih voucher</span></span>
      <ChevronRight className="h-5 w-5 shrink-0 text-stone-700" aria-hidden="true" />
    </button>

    {/* Slot terisi */}
    <div className="flex min-h-[44px] items-center gap-3 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm">
      <Ticket className="h-5 w-5 shrink-0 text-emerald-700" aria-hidden="true" />
      <span className="min-w-0 flex-1 break-words font-semibold text-emerald-800">Hemat Makan</span>
      <span className="whitespace-nowrap font-semibold tabular-nums text-emerald-800">−Rp5.000</span>
      <Button variant="ghost" className="shrink-0">Lepas</Button>
    </div>
  </div>
  {/* NoticeBanner inline: voucher dilepas / diganti */}
</section>
```

| State | Slot kosong | Slot terisi |
|---|---|---|
| Default | `border-stone-500 bg-white`, teks "Pilih voucher" `text-orange-800` | `border-emerald-300 bg-emerald-50`, nama + potongan `text-emerald-800` |
| Hover | `hover:bg-stone-50` | Tombol "Lepas": `hover:bg-stone-100` |
| `:focus-visible` | Cincin `ring-orange-700` | Cincin pada tombol "Lepas" |
| Active | `active:bg-stone-100` | `active:bg-stone-200` pada "Lepas" |
| Disabled | n/a (slot selalu dapat dibuka) | n/a |
| Error | n/a. Pesan voucher dilepas memakai `NoticeBanner variant="warning"` di bawah slot (`role="status"`) | n/a |

**VoucherPanel** (isi overlay "Daftar Voucher", `Modal variant="sheet"`):

```jsx
<fieldset className="space-y-2">
  <legend className="text-xs font-semibold uppercase tracking-wide text-stone-600">Voucher dapat dipakai</legend>

  <label data-checked="true" className="group flex min-h-[44px] cursor-pointer items-start gap-3 rounded-xl border-2 border-stone-300 bg-white p-3 data-[checked=true]:border-orange-700 data-[checked=true]:bg-orange-50">
    <input type="radio" name="voucher-makanan" className="peer sr-only" />
    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-stone-500 bg-white peer-checked:border-orange-700 peer-checked:bg-orange-700 peer-checked:[&>span]:opacity-100 peer-focus-visible:ring-2 peer-focus-visible:ring-orange-700 peer-focus-visible:ring-offset-2">
      <span className="h-2 w-2 rounded-full bg-white opacity-0" />
    </span>
    <span className="min-w-0 flex-1">
      <span className="block break-words text-sm font-semibold text-stone-900">Hemat Makan · Rp5.000</span>
      <span className="block text-xs leading-4 text-stone-600">Min. belanja Rp25.000 · Maks. Rp5.000</span>
    </span>
  </label>
</fieldset>

<div aria-disabled="true" className="mt-2 flex gap-3 rounded-xl border-2 border-stone-200 bg-stone-50 p-3">
  <Ban className="mt-0.5 h-5 w-5 shrink-0 text-stone-600" aria-hidden="true" />
  <div className="min-w-0 flex-1">
    <p className="break-words text-sm font-semibold text-stone-700">Hemat Makan · Rp5.000</p>
    <p className="text-sm leading-5 text-stone-700">Kurang Rp5.000 dari minimum belanja.</p>
  </div>
</div>
```

- Opsi yang tidak eligible **tidak memiliki** `input` sehingga tidak dapat dipilih. Teks alasan wajib tampil (FR-03.5). Subjudul kelompok: "Voucher dapat dipakai" dan "Voucher belum dapat dipakai" ditulis dengan huruf kapital semua melalui `uppercase`, sesuai UX-SPEC 4.4.1.
- Pratinjau di dekat tombol "Terapkan": `<p aria-live="polite" className="text-sm text-stone-700">Total menjadi <span className="whitespace-nowrap font-semibold tabular-nums text-stone-900">Rp{n}</span></p>`.

| State opsi | Tampilan |
|---|---|
| Default | `border-2 border-stone-300 bg-white`, penanda bulat kosong `border-stone-500` |
| Hover | `hover:border-stone-500` |
| `:focus-visible` | `peer-focus-visible:ring-2 peer-focus-visible:ring-orange-700 peer-focus-visible:ring-offset-2` pada penanda bulat |
| Active / dipilih | `data-[checked=true]:border-orange-700 data-[checked=true]:bg-orange-50` + penanda bulat terisi putih di dalam lingkaran `bg-orange-700` |
| Disabled (tidak eligible) | `border-stone-200 bg-stone-50`, teks `text-stone-700`, ikon `Ban`, `aria-disabled="true"` |
| Error | n/a |

### 5.12 PriceBreakdown

Satu komponen untuk Cart, Checkout, dan Struk (BR-02, FR-04.1). Urutan baris tetap (UX-SPEC C-1): Subtotal item, Pajak restoran (10%), Biaya kemasan, Ongkos kirim, Biaya layanan, Diskon voucher makanan, Diskon voucher ongkir, TOTAL.

```jsx
<section aria-labelledby="rincian-title" className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
  <div className="flex items-center justify-between gap-3">
    <h2 id="rincian-title" className="text-base font-semibold leading-6 text-stone-900">Rincian Biaya</h2>
    <button type="button" className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg px-2 text-sm font-medium text-orange-700 underline underline-offset-2 hover:text-orange-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-700 focus-visible:ring-offset-2">
      <Info className="h-4 w-4" aria-hidden="true" /> Info
    </button>
  </div>

  <dl className="mt-2">
    <div className="flex items-baseline justify-between gap-3 py-1.5">
      <dt className="min-w-0 break-words text-sm leading-5 text-stone-700 md:text-base md:leading-6">Subtotal item</dt>
      <dd className="whitespace-nowrap text-sm leading-5 tabular-nums text-stone-900 md:text-base md:leading-6">Rp38.000</dd>
    </div>
    <div className="flex items-baseline justify-between gap-3 py-1.5">
      <dt className="min-w-0 break-words text-sm leading-5 text-stone-700 md:text-base md:leading-6">Diskon voucher makanan</dt>
      <dd className="whitespace-nowrap text-sm leading-5 tabular-nums text-emerald-800 md:text-base md:leading-6">−Rp5.000</dd>
    </div>
    <div aria-live="polite" aria-atomic="true" className="mt-2 flex items-baseline justify-between gap-3 border-t border-stone-300 pt-3">
      <dt className="text-base font-semibold leading-6 text-stone-900">TOTAL</dt>
      <dd className="whitespace-nowrap text-lg font-bold leading-7 tabular-nums text-stone-900 md:text-xl">Rp47.000</dd>
    </div>
  </dl>
</section>
```

(Contoh memperlihatkan dua baris sebagai pola. Implementasi merender ke-8 baris sesuai urutan di atas.)

| Aspek | Spesifikasi |
|---|---|
| Wadah | `<dl>` agar pasangan label-nilai terbaca semantik |
| Baris | `flex items-baseline justify-between gap-3 py-1.5`. Label membungkus, angka tidak |
| Baris diskon | Nilai `text-emerald-800` dan **wajib** diawali "−Rp" (tanda minus adalah penanda utama). Tetap tampil sebagai "−Rp0" saat tidak aktif (UX-SPEC C-2) |
| Baris pajak nol | Nilai "Rp0" dan keterangan di bawahnya `text-xs leading-4 text-stone-600`: "Semua item sudah termasuk pajak" (UX-SPEC C-3) |
| TOTAL | Pemisah `border-t border-stone-300`, `aria-live="polite" aria-atomic="true"` agar perubahan total diumumkan (UX-SPEC 5.5.5) |
| Mode `readOnly` | Struktur dan kelas identik (Checkout dan Struk). Tidak ada kontrol selain tautan "Info" |
| Penanda Zero-Delta (Checkout) | Di bawah TOTAL: `<p className="mt-3 flex items-center gap-1.5 text-xs leading-4 text-stone-600"><Equal className="h-4 w-4 shrink-0" aria-hidden="true" /> Sama dengan Keranjang · Selisih Rp0</p>` |
| Penanda Zero-Delta (Struk) | Baris "Selisih dari Keranjang: Rp0" dengan gaya yang sama |

| State | Tampilan |
|---|---|
| Default | Seperti kode |
| Hover | Hanya pada tautan "Info" (`hover:text-orange-800`) |
| `:focus-visible` | Cincin `ring-orange-700` pada tautan "Info" |
| Active | n/a |
| Disabled | n/a |
| Error | n/a |

### 5.13 StickyActionBar

Bar aksi di bawah layar (mobile) yang menjadi blok biasa di kolom ringkasan pada `lg` (Cart dan Checkout). Pada Menu Restoran tetap `fixed` di semua lebar.

**Kelas wadah (`placement="inlineLg"`, Cart dan Checkout):**

```
fixed inset-x-0 bottom-0 z-30 border-t border-stone-300 bg-white px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-lg md:px-6 lg:static lg:z-auto lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none
```

**Kelas wadah (`placement="fixed"`, Menu Restoran):** sama tanpa awalan `lg:`.

**Isi:**

```jsx
<div className="mx-auto w-full max-w-screen-xl md:max-w-2xl lg:max-w-none">
  <Button variant="primary" size="lg" className="w-full tabular-nums">Lanjut ke Checkout</Button>
</div>
```

**Varian bar keranjang (Menu Restoran; UX-SPEC M-9):**

```jsx
<div className="mx-auto flex w-full max-w-screen-xl items-center justify-between gap-3">
  <p className="min-w-0 text-sm leading-5 text-stone-900">
    <span>2 item</span> · <span>Subtotal item <span className="whitespace-nowrap font-semibold tabular-nums">Rp38.000</span></span>
  </p>
  <Button variant="primary" size="lg" className="shrink-0">Lihat Keranjang</Button>
</div>
```

| Aturan | Spesifikasi |
|---|---|
| Tinggi tombol | `min-h-[48px]` |
| Ruang aman | `pb-[max(0.75rem,env(safe-area-inset-bottom))]` untuk perangkat dengan indikator beranda |
| Konten tidak tertutup | Halaman memberi `pb-28` |
| Label tombol bayar | "Bayar Rp{total}" memuat total persis (UX-SPEC K-3) |
| Tombol bayar saat overlay perubahan total terbuka | `aria-disabled="true"` dan gaya disabled (UX-SPEC K-6) |

| State | Tampilan |
|---|---|
| Default | Tombol `primary` |
| Hover | `hover:bg-orange-800` |
| `:focus-visible` | Cincin `ring-orange-700 ring-offset-2` |
| Active | `active:bg-orange-900` |
| Disabled | `bg-stone-200 text-stone-600` ("Lanjut ke Checkout" pada Cart kosong, UX-SPEC C-7 dan C-8) |
| Error | n/a |

### 5.14 NoticeBanner

Banner inline untuk pemberitahuan non-modal.

```jsx
<div role="status" className={cx(['flex gap-3 rounded-lg border p-3 text-sm leading-5', variantClass])}>
  <Icon className={cx(['mt-0.5 h-5 w-5 shrink-0', iconClass])} aria-hidden="true" />
  <div className="min-w-0 flex-1 break-words">{children}</div>
  {dismissible && (
    <button type="button" aria-label="Tutup" className="-m-1 inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-lg hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-700">
      <X className="h-5 w-5" aria-hidden="true" />
    </button>
  )}
</div>
```

| Varian | `variantClass` | Ikon (`iconClass`) | Dipakai pada | Role |
|---|---|---|---|---|
| `info` | `border-stone-300 bg-stone-100 text-stone-900` | `Info` (`text-stone-700`) | Blok "Perubahan terakhir" di Checkout | `status` |
| `brand` | `border-orange-200 bg-orange-50 text-orange-900` | `Info` (`text-orange-700`) | Ajakan atur budget di Home (dengan tombol "Atur budget") | tanpa role (statis) |
| `success` | `border-emerald-300 bg-emerald-50 text-emerald-800` | `CircleCheck` (`text-emerald-700`) | "{Voucher lama} diganti {Voucher baru}.", konfirmasi Struk | `status` |
| `warning` | `border-amber-300 bg-amber-50 text-amber-900` | `TriangleAlert` (`text-amber-700`) | Voucher dilepas otomatis | `status` |
| `error` | `border-rose-300 bg-rose-50 text-rose-800` | `CircleAlert` (`text-rose-700`) | Galat validasi tingkat formulir | `alert` |
| `status` (+ `status="OK" / "WARN" / "EXCEEDED"`) | `BUDGET_STATUS[status].banner` | `BUDGET_STATUS[status].Icon` | Blok perubahan status budget pada overlay Pemberitahuan Perubahan Total | tanpa role (di dalam dialog) |

| State | Tampilan |
|---|---|
| Default | Seperti tabel |
| Hover | Hanya tombol tutup (`hover:bg-black/5`) |
| `:focus-visible` | Cincin pada tombol tutup |
| Active | n/a |
| Disabled | n/a |
| Error | Varian `error` |

### 5.15 EmptyState

```jsx
<div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-stone-300 bg-white px-6 py-10 text-center">
  <span aria-hidden="true" className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-100 text-stone-700">
    <ShoppingCart className="h-6 w-6" />
  </span>
  <h2 className="text-base font-semibold leading-6 text-stone-900">Keranjangmu kosong.</h2>
  <p className="max-w-prose text-sm leading-5 text-stone-600">{teks pendukung bila ada}</p>
  <div className="flex flex-wrap items-center justify-center gap-2">
    <Button variant="primary">Lihat restoran</Button>
  </div>
</div>
```

| Varian | Ikon | Judul (persis UX-SPEC 5.3) | Aksi |
|---|---|---|---|
| Cart kosong | `ShoppingCart` | "Keranjangmu kosong." | `[Lihat restoran]` (`primary`, tautan) |
| Filter budget tanpa hasil | `SearchX` | "Tidak ada restoran yang sesuai budget." | `[Matikan filter]` (`secondary`) dan `[Atur budget]` (`primary`) |
| Pencarian tanpa hasil | `SearchX` | "Tidak ada hasil untuk '{kata kunci}'." | `[Hapus kata kunci]` (`secondary`) |

| State | Tampilan |
|---|---|
| Default | Seperti kode |
| Hover, focus-visible, active, disabled | Mengikuti `Button` |
| Error | n/a |

### 5.16 Modal dan BottomSheet

Satu komponen `Modal` dengan dua varian. Dibangun tanpa library: `div` dengan `role="dialog"`, `aria-modal="true"`, dan `aria-labelledby`. Pada Dialog EXCEEDED memakai `role="alertdialog"` (UX-SPEC 5.5.3).

**Varian dan perilaku responsif:**

| Varian | `<768px` | `≥768px` | Dipakai oleh |
|---|---|---|---|
| `sheet` | **Bottom sheet** menempel di bawah layar | Modal terpusat | Pengaturan Budget, Info Sheet, Daftar Voucher, Pilih Alamat |
| `dialog` | Dialog terpusat | Dialog terpusat | Konfirmasi Ganti Keranjang, Pemberitahuan Perubahan Total, Dialog EXCEEDED, konfirmasi Reset |

**Struktur kelas:**

```jsx
<>
  <div aria-hidden="true" className="fixed inset-0 z-40 bg-stone-900/60" onClick={onDismiss} />
  <div className={cx([
    'fixed inset-0 z-50 flex justify-center',
    variant === 'sheet' ? 'items-end md:items-center md:p-4' : 'items-center p-4',
  ])} onClick={onDismiss}>
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={stopPropagation}
      className={cx([
        'flex w-full flex-col overflow-hidden bg-white shadow-xl overscroll-contain',
        variant === 'sheet'
          ? 'max-h-[85vh] rounded-t-2xl md:max-w-lg md:rounded-2xl'
          : 'max-h-[85vh] max-w-sm rounded-2xl md:max-w-md',
      ])}
    >
      <div className="flex shrink-0 items-start justify-between gap-3 px-4 pb-2 pt-4">
        <h2 id="modal-title" className="min-w-0 break-words text-lg font-semibold leading-7 text-stone-900">{judul}</h2>
        <Button variant="icon" aria-label="Tutup" className="-mr-2 -mt-1"><X className="h-5 w-5" aria-hidden="true" /></Button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">{isi}</div>
      <div className="shrink-0 border-t border-stone-200 bg-white px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">{aksi}</div>
    </div>
  </div>
</>
```

| Aspek | Spesifikasi |
|---|---|
| Backdrop | `bg-stone-900/60`. Klik di luar = menutup dengan hasil yang ditetapkan UX-SPEC (E-4, N-5) |
| Panel | `rounded-t-2xl` (sheet mobile) atau `rounded-2xl`, `bg-white shadow-xl`, tinggi maksimum `max-h-[85vh]` |
| Struktur | Header tetap (`shrink-0`), badan dapat digulir (`min-h-0 flex-1 overflow-y-auto`), footer tetap (`shrink-0`) |
| Kunci gulir | Tambahkan kelas `modal-open` pada `<html>` saat terbuka (Bagian 3.6) |
| Fokus | Terkunci di dalam panel. Konten di belakang `inert`. Fokus awal dan pengembalian fokus mengikuti UX-SPEC 5.5.3 |
| Animasi | Tidak ada (v1.0.0). Panel muncul seketika |
| Tombol tutup | `[X]` selalu ada di sudut kanan atas, 44 × 44 px |
| Lebar sheet pada `≥768px` | `md:max-w-lg` (512 px). Dialog `max-w-sm` (384 px), `md:max-w-md` (448 px) |

| State | Tampilan |
|---|---|
| Default | Seperti kode |
| Hover | Hanya pada kontrol di dalam |
| `:focus-visible` | Cincin `ring-orange-700 ring-offset-2` pada kontrol dengan fokus |
| Active | Pada kontrol di dalam |
| Disabled | Tombol aksi yang tidak berlaku memakai gaya disabled `Button` |
| Error | Pesan galat di dalam isi (misalnya pada Pengaturan Budget) |

#### 5.16.1 BudgetExceededDialog (Dialog EXCEEDED)

`Modal variant="dialog"` dengan `role="alertdialog"`. Pesan, tiga aksi, urutan, dan perilaku **persis** UX-SPEC 4.9 (E-1 sampai E-7). Tidak ada animasi dan nada visual tenang.

```jsx
<Modal variant="dialog" role="alertdialog" title="Pesanan ini melebihi budget harianmu">
  <dl className="space-y-1.5 text-sm leading-5">
    <div className="flex items-baseline justify-between gap-3">
      <dt className="min-w-0 break-words text-stone-600">Budget harian</dt>
      <dd className="whitespace-nowrap tabular-nums text-stone-900">Rp50.000</dd>
    </div>
    <div className="flex items-baseline justify-between gap-3">
      <dt className="min-w-0 break-words text-stone-600">Pengeluaran hari ini</dt>
      <dd className="whitespace-nowrap tabular-nums text-stone-900">Rp12.000</dd>
    </div>
    <div className="flex items-baseline justify-between gap-3">
      <dt className="min-w-0 break-words text-stone-600">Pesanan ini</dt>
      <dd className="whitespace-nowrap tabular-nums text-stone-900">Rp47.000</dd>
    </div>
    <div className="flex items-baseline justify-between gap-3 border-t border-stone-200 pt-2">
      <dt className="min-w-0 break-words text-stone-600">Proyeksi</dt>
      <dd className="whitespace-nowrap font-semibold tabular-nums text-stone-900">Rp59.000 (118%)</dd>
    </div>
  </dl>
  <div className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-rose-300 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-800">
    <span className="flex items-center gap-2"><CircleX className="h-5 w-5 shrink-0 text-rose-700" aria-hidden="true" /> Melebihi budget</span>
    <span className="whitespace-nowrap tabular-nums">Rp9.000</span>
  </div>

  <div className="mt-4 flex flex-col gap-2">
    <Button variant="primary" size="lg" className="w-full">Ubah pesanan</Button>
    <Button variant="secondary" size="lg" className="w-full">Lihat yang sesuai budget</Button>
    <Button variant="danger-outline" size="lg" className="w-full">Lanjutkan tetap</Button>
  </div>
</Modal>
```

**Hierarki tombol (UX-SPEC E-2, E-3, prinsip P-7):**

| Urutan DOM dan visual | Aksi | Varian | Alasan hierarki |
|---|---|---|---|
| 1 (teratas) | "Ubah pesanan" | `primary` (`bg-orange-700 text-white`) | Aksi paling aman dan **fokus awal** |
| 2 | "Lihat yang sesuai budget" | `secondary` (`border-orange-700`) | Alternatif membantu |
| 3 (terbawah) | "Lanjutkan tetap" | `danger-outline` (`border-rose-700 text-rose-800`) | Aksi yang melewati budget. Tidak pernah fokus awal dan tidak berlatar penuh |

Ketiganya `w-full` bertumpuk vertikal pada semua lebar agar urutan DOM sama dengan urutan visual dan target sentuh tidak berdekatan secara horizontal.

#### 5.16.2 ConfirmDialog

Dialog dua aksi yang dipakai untuk Konfirmasi Ganti Keranjang (UX-SPEC 4.8) dan konfirmasi Reset data demo (UX-SPEC 5.3).

```jsx
<Modal variant="dialog" title="Ganti keranjang?">
  <p className="text-sm leading-5 text-stone-700 md:text-base md:leading-6">{isi pesan}</p>
  <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
    <Button variant="danger-outline" className="w-full sm:w-auto">Ganti keranjang</Button>
    <Button variant="primary" className="w-full sm:w-auto">Tetap di keranjang lama</Button>
  </div>
</Modal>
```

| Penggunaan | Aksi 1 (DOM pertama) | Aksi 2 | Fokus awal | Varian aksi aman |
|---|---|---|---|---|
| Ganti Keranjang | "Ganti keranjang" (`danger-outline`) | "Tetap di keranjang lama" (`primary`) | "Tetap di keranjang lama" | `primary` |
| Reset data demo | "Reset" (`danger-outline`) | "Batal" (`secondary`) | "Batal" | `secondary` |

Urutan DOM sama dengan urutan visual: bertumpuk atas-bawah di `<640px` dan kiri-kanan di `sm:` ke atas, seperti pada wireframe UX-SPEC. Aksi yang menghapus data selalu `danger-outline` (bukan latar penuh). Aksi aman memegang fokus awal.

#### 5.16.3 Isi Overlay Lainnya

**Pengaturan Budget (`sheet`)** — kolom input dengan awalan "Rp":

```jsx
<label htmlFor="budget" className="block text-sm font-medium text-stone-900">Budget makan harian</label>
<div className="mt-1.5 flex">
  <span className="inline-flex items-center rounded-l-lg border border-r-0 border-stone-500 bg-stone-100 px-3 text-sm font-semibold text-stone-700">Rp</span>
  <input
    id="budget"
    type="text"
    inputMode="numeric"
    autoComplete="off"
    aria-describedby="budget-help budget-error"
    className="h-12 min-w-0 flex-1 rounded-r-lg border border-stone-500 bg-white px-3 text-base tabular-nums text-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-700 focus-visible:ring-offset-2"
  />
</div>
<p id="budget-help" className="mt-1.5 text-sm leading-5 text-stone-600">Bilangan bulat, Rp10.000 sampai Rp500.000</p>
```

Kolom tidak memakai `type="number"` agar nilai desimal dapat divalidasi dan ditolak dengan pesan UX-SPEC 5.3, bukan diam-diam dipotong peramban.

| State input | Tampilan |
|---|---|
| Default | `border-stone-500 bg-white` |
| Hover | `hover:border-stone-700` |
| `:focus-visible` | Cincin `ring-2 ring-orange-700 ring-offset-2` |
| Active | Sama dengan fokus |
| Disabled | `disabled:bg-stone-100 disabled:text-stone-600` |
| **Error** | Kedua bagian (awalan dan kolom) `border-rose-700`, `aria-invalid="true"`, dan pesan di bawah: |

```jsx
<p id="budget-error" role="alert" className="mt-1.5 flex items-start gap-1.5 text-sm leading-5 text-rose-800">
  <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-rose-700" aria-hidden="true" />
  Budget minimal Rp10.000.
</p>
```

Pratinjau terformat (hanya jika nilai valid): `<p className="mt-1 text-sm font-semibold tabular-nums text-stone-900">Rp50.000</p>`. Footer aksi: `[Simpan]` (`primary`) dan `[Batal]` (`secondary`).

**Info Sheet (`sheet`)** — definisi komponen biaya:

```jsx
<dl className="divide-y divide-stone-200">
  <div className="py-3">
    <dt className="text-sm font-semibold text-stone-900">Pajak restoran</dt>
    <dd className="mt-1 max-w-prose text-sm leading-5 text-stone-700">Tarif 10%, hanya untuk item bertanda "Belum termasuk pajak".</dd>
  </div>
</dl>
```

Keempat komponen (pajak restoran, biaya kemasan, ongkos kirim, biaya layanan) dan blok "Tentang 'Est.'" memakai pola `div.py-3` yang sama. Teks mengikuti UX-SPEC 4.10. Footer: `[Mengerti]` (`primary`).

**Pilih Alamat (`sheet`)** — opsi radio memakai struktur yang sama dengan opsi voucher (Bagian 5.11). Setiap opsi memuat label alamat dan baris "Selisih ongkir: {+Rp0 / +Rp3.000 / +Rp5.000}" (`text-sm text-stone-700`, nilai `whitespace-nowrap tabular-nums`). Opsi alamat aktif tercentang saat dibuka. Ikon `MapPin h-5 w-5 text-orange-700` menggantikan posisi penanda radio hanya sebagai hiasan di samping label (penanda bulat radio tetap ada). Catatan bawah: `<p className="mt-3 text-sm leading-5 text-stone-600">`. Footer: `[Pakai alamat ini]` (`primary`).

**Pemberitahuan Perubahan Total (`dialog`)** — kerangka:

```jsx
<dl className="space-y-1.5 text-sm leading-5">
  <div className="flex items-baseline justify-between gap-3">
    <dt className="min-w-0 text-stone-600">Sebelum</dt>
    <dd className="whitespace-nowrap tabular-nums text-stone-900">Rp28.500</dd>
  </div>
  <div className="flex items-baseline justify-between gap-3">
    <dt className="min-w-0 text-stone-600">Sesudah</dt>
    <dd className="whitespace-nowrap text-base font-bold tabular-nums text-stone-900">Rp31.500</dd>
  </div>
  <div className="flex items-baseline justify-between gap-3 border-t border-stone-200 pt-2">
    <dt className="min-w-0 text-stone-600">Selisih</dt>
    <dd className="whitespace-nowrap font-semibold tabular-nums text-stone-900">+Rp3.000</dd>
  </div>
</dl>
<h3 className="mt-4 text-sm font-semibold text-stone-900">Penyebab</h3>
<ul className="mt-1 list-disc space-y-1 pl-5 text-sm leading-5 text-stone-700">
  <li>Ongkos kirim: <span className="whitespace-nowrap tabular-nums">Rp6.000</span> → <span className="whitespace-nowrap tabular-nums">Rp9.000</span> (<span className="whitespace-nowrap tabular-nums">+Rp3.000</span>)</li>
</ul>
```

- Blok status (kondisional): `NoticeBanner variant="status"` dengan status baru, di bawah daftar penyebab.
- Footer (bertumpuk): `[Mengerti]` (`primary`, `size="lg"`, fokus awal) di atas `[Kembalikan alamat sebelumnya]` (`secondary`). Urutan DOM sama dengan wireframe UX-SPEC 4.5.2.
- Setelah dialog ditutup, blok "Perubahan terakhir" pada Checkout memakai `NoticeBanner variant="info"`.

### 5.17 Checklist Verifikasi Visual

Seluruh butir wajib lolos sebelum rilis prototype.

| No | Pemeriksaan | Acuan |
|---|---|---|
| 1 | Tidak ada URL gambar eksternal, font eksternal, logo, atau nama merek pihak ketiga pada kode dan antarmuka | NFR-04, Bagian 1.5 |
| 2 | Tidak ada paket UI selain React, Tailwind CSS v3, dan `lucide-react` pada `package.json` | Bagian 1.5 |
| 3 | Tidak ada pemanggilan `Intl`, `toLocaleString`, atau `toFixed` (lolos ESLint). Seluruh hasil format lolos regex Bagian 3.4 | BR-11, BR-01 |
| 4 | Seluruh pasangan warna pada Bagian 2.6 terverifikasi dengan alat kontras | WCAG 1.4.3, 1.4.11 |
| 5 | Setiap status budget memiliki teks label dan ikon berbentuk berbeda di semua tempat muncul | FR-05.4, NFR-07 |
| 6 | Pada `360px`, `PriceNote` setinggi `≤ 44px` untuk 24 item menu dan Baris 2 utuh | Bagian 3.3, FR-02.2 |
| 7 | Tidak ada scroll horizontal pada `360`, `768`, `1024`, dan `1440 px` di semua rute dan overlay | NFR-01 |
| 8 | Seluruh kontrol interaktif memiliki area sentuh `≥ 44 × 44 px` | UX-SPEC 5.5.6 |
| 9 | Setiap elemen interaktif menampilkan cincin `:focus-visible`. Fokus awal dan pengembalian fokus overlay sesuai UX-SPEC 5.5.3 | UX-SPEC 5.5.3 |
| 10 | Rincian di Cart, Checkout, dan Struk dirender oleh `PriceBreakdown` yang sama dan memiliki urutan baris identik | BR-02, UX-SPEC C-1 |
| 11 | Seluruh thumbnail berasal dari gradien dan emoji dengan `aria-hidden="true"` | Bagian 4.5 |
| 12 | Seluruh microcopy sama persis dengan `UX-SPEC.md` (kecuali teks default pada Bagian 1.6) | UX-SPEC Bagian 4 dan 5 |

---

*Akhir dokumen DESIGN-SYSTEM TPBG v1.0.0*
