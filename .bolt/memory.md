# Project memory

## Product intent & audience

- Project `tpbg`: academic prototype for price transparency and budget supervision in a pesan-antar (delivery/messaging) context.
- Audience: academic/evaluation context governed by `AGENTS.md` and `ERRATA-LOG.md`.

## Brand personality & voice

- Domain copy and spec labels in Bahasa Indonesia (e.g. "transparansi harga", "pengawal budget").
- Technical/errata labels use stable codes `F-XX` from `AGENTS.md §0`; cite exactly, never relabel.

## Visual design & UX direction

- Stack: React 18 + react-router-dom 6 + lucide-react, Tailwind 3, TypeScript (ESM), Vite 5.
- Tailwind config is plain JS without JSDoc comments.
- SPA navigation only (F-04 permits react-router-dom).
- Meta viewport must include safe-area (F-26).

## Decisions, constraints & rationale

- Node engine `>=20.19.0`; project `type: module`.
- Strict quality gate: `tsc --noEmit` + `eslint --max-warnings 0` + `vitest run` + `vite build` must all pass before completion.
- No comments allowed in source/config (grep for `//` and `/*` must return empty); glob `/*` inside path patterns is a false positive, JSDoc `/** @type */` is a real violation and was removed.
- Pure layer separation (F-03): logic in `src/lib`, fixtures in `src/data`, UI separate; static-rules test enforces forbidden patterns.
- Applied errata referenced: F-01, F-02, F-03, F-04, F-09, F-14, F-17, F-19, F-23, F-25, F-26; all labels verified against `AGENTS.md §0`.
- Libs include: pricing, priceChange, budget, voucher, discovery, formatRupiah, receiptId; 169 tests across 9 files.

## Open questions & assumptions

- User confirmation gate: assistant pauses ("AWAITING CONFIRMATION") between stages and must not proceed to next prompt until approved.
- `.bolt/prompt` currently absent; instructions are inferred from this turn only.
- WebContainer adaptations noted in ERRATA-LOG.md (specifics not yet surfaced).