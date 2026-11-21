# Errata Log — TPBG

## Applied Level 0 Errata

- **F-01 (P-11):** Vektor `P-11` dikoreksi. Dasar pajak `Rp45.000`, pajak `floorDiv(45000*10+50,100)=4.500` (bukan 4.000), total `62.500` (bukan 62.000). Lihat "Interpretation Decisions" untuk catatan diskrepansi harga per item.
- **F-09 (A-10):** Perpindahan alamat dengan `totalDelta === 0` tidak memunculkan dialog "Total pesananmu berubah". Alamat diperbarui langsung.
- **F-19 (formatPercent):** Aturan pembulatan batas status diterapkan: nearest tenth, kecuali saat nilai terbulat akan menampilkan "80%" saat status OK (gunakan floor whole-percent) atau "100%" saat status EXCEEDED (gunakan ceil whole-percent). Tepat sama → "100%".
- **F-17:** Versi paket dipin pada `package.json`: Node `>=20.19.0`, React `^18.3.1`, TypeScript `^5.6.0`, Tailwind `^3.4.14`, ESLint `^8.57.1`, lucide-react `^0.454.0`.
- **F-02:** `"type": "module"` ditambahkan; `tailwind.config.js` ESM dengan `content` diperbarui; contoh `.js`/`.jsx` dari DESIGN-SYSTEM diimplementasikan sebagai `.ts`/`.tsx`.
- **F-03:** `src/lib/`, `src/state/`, `src/data/` bebas dari `react`, `react-dom`, `react-router-dom`, `lucide-react`, `window`, `document`, `localStorage`, `crypto`. Aturan `no-restricted-imports` dan `no-restricted-globals` diterapkan via `.eslintrc.cjs` overrides.
- **F-04:** `react-router-dom` `^6.28.0` diizinkan.
- **F-25:** `src/__tests__/static-rules.test.ts` memindai pola terlarang via Node `fs`.
- **F-26:** `<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />`.
- **F-14:** `computeSubtotal` hanya di `pricing.ts`; `createEmptyCart` hanya di `cart.ts`.
- **F-23:** `@media (prefers-reduced-motion: reduce)` dibungkus dalam `@layer base` di `src/index.css`.

## Interpretation Decisions

- **formatPercent (F-19) reconciliation:** DESIGN-SYSTEM §3.4 menyatakan pembulatan nearest-tenth (`Math.floor((proyeksi*2000+budget)/(2*budget))`). Level 0 F-19 mensyaratkan `39.999/50.000 → "79%"` (status OK) dan `50.001/50.000 → "101%"` (status EXCEEDED), yang tidak konsisten dengan nearest-tenth murni (menghasilkan "80%" dan "100%"). Aturan rekonsiliasi: hitung nearest-tenth; jika hasil bulat adalah "80%" dan status OK, gunakan `floorDiv(projection*100, budget)` (floor whole-percent); jika hasil bulat adalah "100%" dan status EXCEEDED, gunakan `floorDiv(projection*100 + budget - 1, budget)` (ceil whole-percent); jika `projection === budget`, kembalikan "100%". Vektor lain (81%, 80% [WARN], 107,8%, 118%, 100% [WARN]) tetap lolos. Penentuan status di-inline di `formatPercent` (tanpa mengimpor `getBudgetStatus`) untuk menghindari dependensi sirkular.
- **P-11 per-item price discrepancy:** AGENTS.md §0.1 item 1 mengutip M-101 `Rp15.000`, M-102 `Rp18.000`, M-103 `Rp12.000`. PRD.md §9.3 (sumber mock data otoritatif) mendefinisikan M-101 `Rp30.000`, M-102 `Rp10.000`, M-103 `Rp5.000`. Keduanya berjumlah `Rp45.000`. Mock data PRD dipertahankan tanpa perubahan; hasil P-11 (pajak 4.500, total 62.500) benar untuk kedua himpunan harga karena hanya total dasar pajak yang relevan.

## Open Gaps

- **Placeholder UI:** `src/App.tsx` saat ini hanya merender `<main id="konten"><h1>TPBG</h1></main>` sebagai placeholder agar pratinjau Bolt tidak kosong. Diganti pada Prompt 3.
- **Layout-dependent DoD items:** DoD-05, DoD-06, sebagian DoD-07, K-03, K-04 tidak dapat diverifikasi penuh tanpa mesin layout nyata. Diverifikasi via proxy struktural + checklist manual (lihat "WebContainer Adaptations").

## WebContainer Adaptations

1. **Playwright tidak terpasang:** Level 0 item #9 (`@playwright/test`, `test:e2e`, uji tinggi PriceNote F-05) diganti dengan Vitest + jsdom. Skrip `test:e2e` tidak disertakan; `verify` = `typecheck && lint && test && build`.
2. **jsdom tanpa mesin layout:** jsdom tidak menghitung layout sungguhan dan tidak mendukung `inert` nyata. Item DoD yang bergantung pada layout (DoD-05 nol scroll horizontal, DoD-06 tinggi PriceNote <= 44px, DoD-07 focus trap/inert, K-03, K-04) diverifikasi via proxy struktural (struktur DOM, kelas, atribut) plus checklist manual. Tidak pernah dilaporkan sebagai lulus penuh.
3. **Versi Vite/Vitest:** `vite ^5.4.11`, `vitest ^2.1.8`, `jsdom ^25.0.1` dipilih untuk kompatibilitas WebContainer.
4. **Node v22.23.1:** Memenuhi syarat `>=20.19.0`. Tidak perlu peringatan.
