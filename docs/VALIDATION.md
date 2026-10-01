> Historical baseline below. Current feature changes and exact checks are tracked in [FEATURE_PARITY.md](FEATURE_PARITY.md); this baseline does not certify every new tool or real browser interaction.

# Validation - 30 September 2026

## Completed checks

- TypeScript compilation (`tsc --noEmit`).
- Existing 18 engine checks: page order/ranges, duplicates/reversal, rotation, crop validation, resize, n-up, mirror, standard metadata, AES-256, wrong passwords/decryption, split ZIP integrity, explicit form flattening and SHA-256.
- Expanded actual-engine fixture harness: **48 of the 50 catalogue entries execute processing fixtures**. Compare is a view rather than a processing job; OCR was not executed. Browser read-aloud text extraction is covered, actual voice playback is not.
- **32 further checks** cover preserved form values, malformed/encrypted input messages, redaction's absence of original text/metadata, signature/image position with offset CropBoxes and 0/90/180/270-degree native rotation plus 0/90-degree workspace rotation at 1x/2x render scales, a 400-page mixed-width reverse export, link annotation creation/unsafe URL rejection, exact 150 MiB/400-page selection boundaries, cancellation and history restoration.
- PDF export fixture image rectangles located at the expected normalized coordinates by inspecting actual raster pixels. All checked bounds within 1.2% of page dimensions; native raster dimensions account for integer pixel rounding. This is a geometry test, not a typography pixel-perfect guarantee.
- Rendered geometry contact sheet visually inspected. Annotated export also rendered independently with Poppler for text/image layout inspection. No site screenshot or live browser inspection was performed.
- Analytics aggregation/auth/payload/rate-limit regression harness passed. Tracker tests passed for retry IDs, acknowledgment, no document fields, shared browser identity, hidden-tab pausing, opt-out and DNT.
- Installed relevant package licenses checked; no production dependency was added. Mammoth's browser entry is explicitly selected so Office text imports do not accidentally require Node file-path APIs.
- Source packaging excludes credentials, actual environment values, repository identity, generated build output and temporary test fixtures. Includes MIT license, third-party notices, source, locked dependencies, migrations and documentation.

`checks/verify-studio.mjs` uses real application code, PDF.js and native canvas. Its harness replaces browser asset URLs with local fixture asset paths, uses a browser-compatible Mammoth bundle, and provides a small DOM text parser adapter for EPUB input. It does not automate a browser or prove user-interface behavior. Run from the project root with `npm run verify:studio`.

## Fixtures and precise limits

| Input / journey | Result | Remaining qualification |
|---|---|---|
| Ordinary three-page selectable-text PDF | Organize/convert/annotate outputs nonempty and parseable | Not a real-world document corpus |
| Mixed portrait/landscape pages | Page count/order preserved; output geometry exercised | Mobile preview unverified |
| Rotated PDF with offset CropBox | Actual exported image position/size checked at two scales | Browser CSS text layout, gestures and print drivers unverified |
| Encrypted PDF | Correct password decrypts; wrong password rejects; normal open directs to unlock | Not every encryption variant or rights configuration |
| Image-only PDF | Local raster conversions; text extraction reports OCR requirement | OCR accuracy/worker/model download not executed |
| Malformed input | Non-PDF bytes reject; previous workspace retained by atomic ingestion logic | No exhaustive fuzzing of corrupted PDFs |
| Large document | 400-page small fixture reverses and exports correctly | Not a 150 MiB stress test or low-memory phone benchmark |
| Redaction | New raster PDF contains no original text/author metadata | Region choice must be inspected by the user; not PDF/UA tagged |
| Form filling | Canonical field value remains editable; explicit flatten removes fields | Radio/XFA/signature fields unsupported; source-page reorganization refused |
| DOCX/XLSX/EPUB | Basic text export/import round trips execute | Original Office layout/charts/images/fonts are not preserved |
| Compression | Three quality paths exist; generated output bytes measured | Savings depend on document; no target-size guarantee |
| Cancellation | Pre-aborted jobs and mid-assembly abort reject without output | Synchronous work and OCR startup/recognition may finish before cancellation checkpoint |
| Undo/redo | Page order and marks restored; new branch clears redo | Browser keyboard events, storage and gestures not exercised |
| Batch | Uses per-file actual engine jobs and real ZIP generation | Full UI/mixed-failure batch journey not browser-tested |
| Draft save/restore/delete | Source reviewed; explicit bounded document snapshot, no credentials/settings | IndexedDB persistence/eviction/private browsing not runtime-tested |

## Required checks before public production use

1. Desktop Chrome/Firefox/Safari: real drag/drop, folder/non-file drops, repeated picker selection, drop overlays, encrypted errors, full export/download and continued editing.
2. iPhone Safari/Android Chrome/tablet: touch sorting, corner resize, zoom/scroll, virtual keyboard, file picker and download UX; profile memory with representative image-heavy files.
3. Keyboard and screen reader: navigation/dialog focus return, skip link, search, sortable announcements, element grouping, numeric controls, live progress/errors and output reading order; 200% text enlargement and 320 CSS px reflow.
4. OCR first load/offline model handling, cancellation during recognition, recognition alignment/accuracy and English-only limitations.
5. Complex Office fixtures with fonts/tables/embedded images and scans. Compare against the original and preserve the published limitations; do not advertise layout fidelity without stronger engines.
6. Batch partial failures/cancellation and local draft recovery after refresh. Verify saved draft/shelf deletion and ensure no document content enters network requests or logs.

No fake processing or seeded usage is used. Unverified areas remain declared rather than represented as passing.

Concurrent update reconciliation: preserved the independently added compact compression mode, search synonyms, up-front catalogue caveats and product review. The stronger shared-workspace/result-inspection journey replaces its earlier re-upload continuation.


## 1 October 2026 homepage/text refresh

- Production build and TypeScript passed.
- Homepage server-render check passed: one H1, six popular tools, clear limits, 21 crawlable guide links, FAQ and complete 56-tool README table.
- SEO guide checks passed for all 21 routes.
- PDFium tests passed: edit/save/reopen, real changed raster, preservation of other text, bounds at all four rotations, longer replacements fitted to the original area, excessive-shrink rejection/rollback, glyph restrictions, blank and malformed input.
- Studio regressions passed: 48 processing tools and 32 correctness/geometry/boundary/cancellation/history checks. OCR and UI/device checks excluded.
- Browser preview verification blocked: cloud browser rejected local URL with `ERR_BLOCKED_BY_CLIENT`. Visual, mobile, drag/drop and dirty-state interaction checks remain unverified.
- Commit/deployment are reported separately; a code push does not verify Cloudflare rollout or Google indexing.

## Install detection, all-tools menu and unified logo

The new all-tools disclosure renders all 56 unique working tool links in four categories, with hover, click/touch, search, focus-out and Escape handling. Existing-document navigation guards remain in place.

Install actions are suppressed until initial detection is complete, inside standalone/minimal-ui/iOS app mode, after a confirmed install (remembered locally), or when a supported browser reports this same PWA installed. Both install controls synchronize, and a fresh beforeinstallprompt event resets remembered installation. Browser-tab detection is not universally available: Safari/unsupported browsers and cleared storage may not reveal a previously installed PWA. Sources: https://developer.chrome.com/docs/capabilities/get-installed-related-apps and https://developer.mozilla.org/en-US/docs/Web/API/BeforeInstallPromptEvent/userChoice .

New SVG/PNG branding is shared across the public UI, owner dashboard, guides, metadata, README and PWA manifest. Versioned asset names avoid stale logo cache keys. App identity and start URL stay unchanged. PNGs include normal 192/512px, maskable 512px and Apple 180px icons.

verify-navigation-install checks unique menu links, category/disclosure markup, busy-state links, same-PWA identity detection, storage remembrance/reset/failure, manifest self-relationship, actual PNG dimensions and consistent logo references. Real hover, touch, installation/uninstallation and OS icon refresh remain unverified; the earlier cloud-browser local-preview block still applies.

## Folded P identity refinement

Replaced the document/check badge with an original folded P mark in two flat colors: indigo #2923b9 and teal #12bfb9. SVG is the production source, with raster exports for PWA, Apple and social consumers. Version 3 asset paths replace version 2 references; application identity is unchanged. The generated brand presentation is a visual concept, while production assets are clean SVG paths with transparent backgrounds and no textures/shadows.

## Refined P identity v4
Connected the P stem and bowl, shortened the stem, regularized the counter and integrated a document fold into the upper corner. Deep teal improves definition on white. Created a separately adjusted favicon and same-geometry monochrome SVG. Inspected actual raster renders at 16, 24 and 32 pixels and a header-style lockup. This is a design review board, not a live browser screenshot. Build and brand-reference checks remain separate from live deployment verification.

## All-tools menu icon treatment
Every one of the 56 tool links now includes a meaningful Lucide icon in a colored category tile. Icons are decorative to screen readers; the existing visible tool names remain accessible link labels. Pages, Edit & Sign, Convert and Privacy use lavender, peach, mint and blue respectively. Touch rows retain comfortable spacing.

Passed navigation/icon coverage, homepage SSR, TypeScript and the production build. Actual browser hover/touch behavior and deployed appearance remain unverified because local cloud-browser preview was blocked.

## October 1 audit (local, not deployed)
See AUDIT-2026-10-01.md. Retested 48 processing cases and 32 additional checks after updating SheetJS to upstream 0.20.3. Existing-text, signatures, extra operations, analytics and owner suites pass. All 56 landing pages now render their actual workspace. Source-level work guards, keyboard discovery, native-install relevance, lazy processing loading and preferred-host/private-indexing changes are included. Browser/device testing is still blocked by live 502 responses in this environment.

Final image-budget check passes; final TypeScript, 48 processing cases/32 checks, homepage/56 embedded tool SSR checks and production build pass after the image guard change.
