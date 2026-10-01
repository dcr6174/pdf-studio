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
3. Keyboard and screen reader: sidebar/dialog focus return, skip link, search, sortable announcements, element grouping, numeric controls, live progress/errors and output reading order; 200% text enlargement and 320 CSS px reflow.
4. OCR first load/offline model handling, cancellation during recognition, recognition alignment/accuracy and English-only limitations.
5. Complex Office fixtures with fonts/tables/embedded images and scans. Compare against the original and preserve the published limitations; do not advertise layout fidelity without stronger engines.
6. Batch partial failures/cancellation and local draft recovery after refresh. Verify saved draft/shelf deletion and ensure no document content enters network requests or logs.

No fake processing or seeded usage is used. Unverified areas remain declared rather than represented as passing.

Concurrent update reconciliation: preserved the independently added compact compression mode, search synonyms, up-front catalogue caveats and product review. The stronger shared-workspace/result-inspection journey replaces its earlier re-upload continuation.

