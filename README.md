# Secure SDLC Controls Assessment

A frontend for running a Secure SDLC controls assessment against multiple
frameworks — OWASP SAMM, NIST CSF 2.0, and NIST SSDF today, with more easy to
add later. Ingest supporting evidence (documents, interview notes, images,
other files), work through each framework's controls, record a maturity
rating and observation notes, link the evidence that backs each observation,
and see maturity dashboards and gap reports roll up automatically.

This is frontend-only for now. There is no backend yet — evidence metadata
and observations are persisted client-side (localStorage + IndexedDB for
file bytes) behind a small service layer designed to be swapped for real API
calls later without touching any page or component.

## Getting started

```bash
npm install
npm run dev      # starts the Vite dev server
npm run build    # typecheck + production build
npm run lint     # oxlint
```

## Architecture

- `src/types/domain.ts` — the core model: `Framework`, `FrameworkFunction`,
  `Control`, `Observation`, `Evidence`. Every framework's own catalog
  structure is preserved (SAMM's functions/practices/streams, CSF's
  functions/categories, SSDF's practice groups), but all frameworks are
  rated on the same normalized 0–3 maturity scale so cross-framework
  reporting stays comparable.
- `src/data/frameworks/` — the framework registry. `samm.ts`, `nistCsf.ts`,
  and `ssdf.ts` each export a `Framework` with its compact control catalog;
  `index.ts` lists them in `FRAMEWORKS`. **Adding a new framework is just
  adding a module here and listing it** — no page hardcodes framework logic.
- `src/services/` — `evidenceService.ts` and `assessmentService.ts` are the
  only places that read/write persisted data. They expose plain async
  functions (`list`, `addFile`, `upsert`, ...) so a real backend can replace
  their internals later; every page and component goes through
  `AppDataContext`, never through storage directly.
- `src/lib/idb.ts` — a minimal IndexedDB wrapper used only for evidence file
  bytes. Metadata lives in localStorage via `services/storage.ts`.
- `src/utils/scoring.ts` — maturity scoring and gap-finding, pure functions
  over `Observation[]`, shared by the Dashboard and Reports pages.
- `src/pages/` — `DashboardPage`, `EvidencePage`, `AssessmentPage`,
  `ReportsPage`.

## Wiring up a real backend later

Replace the bodies of `evidenceService` and `assessmentService` with calls to
your API (keeping their function signatures), and swap `AppDataContext`'s
initial state from synchronous localStorage reads to an async fetch on
mount. Nothing else in the app needs to change.
