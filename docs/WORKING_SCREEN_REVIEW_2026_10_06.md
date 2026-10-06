# PDF Studio working-screen review — 6 October 2026

## What this change fixes

The form tool previously displayed a wrapping list of inputs without rendering the PDF. It lost the document's layout, showed hidden fields, scattered unsupported-field warnings, and exported only text, checkbox and dropdown values. The replacement renders the actual PDF and overlays controls at widget rectangles. A separate Field list offers larger controls without changing the values. Navigation, fit-width/zoom, editable/flattened output and a grouped support note are included.

Export now supports radio groups and single/multi-select lists. Hidden/invisible/no-view widgets are excluded from editing and flattened output. Read-only values are preserved. Unsupported buttons remain visual content; PDF JavaScript, calculated totals, submission, reset, links and digital signing do not execute. XFA is explicitly rejected before pdf-lib can delete it. This is a form editor, not a general PDF sanitizer.

The shared working surface also adds a document/settings split for Merge, Compress, Split, Rotate, N-up, Crop, Resize, JPG, PNG, WebP, OCR, Workflows and Viewer. Their aliases inherit the same implementation. Phone layouts use Preview/Settings controls. The existing editor, reader and report surfaces keep their distinct task behavior. Marketing/help content is removed from the active loaded workspace. Export uses one bottom action; mobile content reserves space, and focused inputs move the action out of the fixed layer.

## Evidence and limits

- Read both supplied PDFs: the three-page form defect report and the 57-page working-screen specification. The specification covers 78 URLs, 66 tools, 10 aliases and two instruction-only guides; those counts are its inventory, not a fresh live crawl of every route.
- Inspected the current connected GitHub source, especially `app/page.tsx`, `lib/pdf-engine.ts`, the reader, result popup, merge, signature, workspace and style components.
- Viewed the live homepage and opened Fill PDF forms in the browser. The homepage already has a coherent purple brand, a short popular-task row, grouped tools and search. Its redesign does not need a new visual identity.
- Production build, TypeScript and changed-file lint passed. Existing engine checks and independent Poppler form-appearance regression passed.
- New form tests fill and reopen text, multiline, checkbox, radio, dropdown and multi-select fields; they also cover repeated widgets, hidden/read-only fields, page rotation/crop, invalid selections, XFA and flattened output.
- Independently reopened/rasterized generated PDFs with MuPDF. Flattened visible text exists, hidden text is absent, and no editable widgets remain.
- Downloaded the real Apryse sample from https://showcase.apryse.com/gallery/form.pdf. Filled its supported types, exported both modes, reopened and checked values. Its read-only calculated total remains unchanged, as expected without PDF scripts.
- The browser refused the local preview address with `ERR_BLOCKED_BY_CLIENT`. No successful browser test of the new UI, 390px layout, keyboard behavior or physical Nord 2 is claimed. Engine output correctness is not proof of touch usability. Production deployment is separate from this GitHub change.

## Design direction

Keep the purple identity, white/lavender light surfaces and a quieter dark theme. Use typography, spacing and the document itself to create polish. The mascot belongs in discovery, empty and success states; it should not compete with the page while someone edits a form or signs a document.

Use 16px phone gutters, 48px main touch controls, 16px input text, a flexible document area and a 300px desktop settings rail. Prefer thin borders and flat surfaces. Purple marks the selected tool, current view and main action. Keep decorative effects out of document controls. Retain reduced-motion behavior.

Small PDF fields are inherently cramped at fit-width. Do not enlarge their rectangles until they overlap adjacent fields. Provide the equivalent larger Field list and zoom. This preserves the original page arrangement while making entry possible on a phone.

## Highest-value improvements after this patch

| Priority | Improvement | Why it matters | Acceptance check |
|---|---|---|---|
| P0 | Live phone and keyboard acceptance | The reported failure happened on a phone; static checks cannot validate touch or viewport behavior | At 360/390/412px and on Nord 2: open, fill every type, change pages/zoom, open keyboard, export, reopen; no hidden fields or covered controls |
| P0 | A representative output corpus | A visually neat editor can still export an incorrect document | Test office forms, rotated/cropped pages, scanned forms, long values, legacy appearances, password files and damaged files in an independent reader |
| P1 | Faster first interaction | The build emits large optional chunks, and global CSS has accumulated | Measure mobile LCP/INP/CLS before changing architecture; lazy-load task-only UI and consolidate competing style layers |
| P1 | Tool-specific previews | Generic page-reordering controls can distract from conversion or privacy tasks | Every tool has only its required controls; reports show findings and readers show reading controls |
| P1 | Better document transitions | People often fill → sign → compress | Keep work and result identity while switching; explain operations that flatten fields, invalidate signatures or discard searchable text |
| P1 | A/B comparison on phones | Side-by-side pages become too small on narrow screens | A/B tabs preserve the same page and zoom; navigation stays synchronized |
| P1 | Password confirmation/show-hide | Password mistakes make outputs difficult to reopen | Confirm opening passwords, allow deliberate show/hide, preserve files after wrong-password errors |
| P1 | Complete cancellation/error UX | Users need to know whether work was retained | Real stage/status, safe-boundary cancellation, nearby correction, no lost fields, no double processing |
| P2 | Contextual element properties | Sign/edit/redact need large page surfaces | Phone Page/Tools/Properties views, selected element controls only, keyboard-accessible resize/move |
| P2 | Scan correction handles | Numeric coordinates are functional but slow on a phone | Touch corner handles plus retained numeric controls, Apply/Undo and real corrected preview |
| P2 | Conversion fidelity and language support | Office and OCR quality varies with the source | Use honest descriptions, multilingual fixtures, independent character/layout checks; avoid universal faithful-conversion claims |
| P2 | Recovery and workflow checkpoints | Large jobs can fail partway through | Step status, safe retry, originals retained, per-file outcomes and recoverable intermediate results |

## How the twelve supplied patterns should evolve

| Pattern | Recommended working surface | Current patch / follow-up |
|---|---|---|
| Arrange files | Queue first, reorder buttons, Add files, one action | Existing Merge queue kept; settings moved to focused rail/tab |
| Arrange pages | Thumbnails plus ranges and non-drag reorder | Shared surface; range/selection synchronization remains follow-up |
| Adjust/preview | Large source preview and short settings rail | Shared surface applied to Compress and fixed transforms |
| Edit on page | Page, compact mode toolbar, contextual properties | Existing editor/signing retained; mobile properties view is follow-up |
| Complete fields | Original page with overlays and large equivalent controls | Implemented with saved-value validation |
| Write/build | Writing first; preview/style separate on phones | Existing writing surfaces retained; dedicated phone views remain follow-up |
| Convert | Source facts/preview plus honest output format | Shared settings surface where controls exist; fidelity remains engine-specific |
| Inspect/protect | Findings or secret-entry surface | Keep report semantics; confirmation/show-hide and copy-hash polish are follow-up |
| Capture/correct | Photo review, correction, Apply/Undo | Existing correction preserved; touch handles are follow-up |
| Compare | Desktop A/B, phone tabs, matched navigation | Follow-up; do not imply automatic diff is implemented |
| Read/listen | Reading/listening surface with search or Stop | Existing dedicated reader/audio retained; no forced PDF-ready popup |
| Run sequence | Reviewed recipe, real step status, one result | Focused settings surface; detailed progress/checkpoints remain follow-up |

This is a focused implementation plus a roadmap. It is not a claim that all proposed controls in the 78-URL specification have been built or every tool's output has been exhaustively tested.

## Research that informs the direction

**Smallpdf:** its form page presents choose file → fill text/dates/checks → sign → download/share, and emphasizes review before finishing. That supports a short page-centered flow. Its product claims are not an independent output test. PDF Studio should retain its on-device processing distinction rather than reproduce Smallpdf's server-upload model. Source: https://smallpdf.com/pdf-form-filler

**iLovePDF:** its catalogue groups organization, optimization, conversion, editing and security, and exposes workflows. Its form description includes text, checkboxes, multiple-choice fields and lists. The useful lesson is consistent task discovery and reuse of workflows, not adding more tools before current working screens are dependable. Source: https://www.ilovepdf.com/

**Adobe:** Acrobat's online fill/sign page treats form completion and signature as a connected document task. PDF Studio should make that transition easy while continuing to distinguish a drawn/typed visual signature from cryptographic signing. Source: https://www.adobe.com/acrobat/online/sign-pdf.html

**W3C:** WCAG 2.2 target-size minimum is 24×24 CSS pixels or sufficient spacing, with documented exceptions. The proposed 48px primary controls are a product target, not the WCAG minimum. Focus must not be entirely obscured by author-created content; a pinned export bar needs reserved space and keyboard testing. Equivalent larger field controls are valuable where document widgets are small. Sources: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html and https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html

**Google Web Vitals:** target LCP ≤2.5s, INP ≤200ms and CLS ≤0.1 at the 75th percentile, segmented by mobile/desktop. These are measurement goals, not scores measured for PDF Studio during this review. Source: https://web.dev/articles/vitals

**PDF.js / pdf-lib:** viewport conversion is the basis for position/rotation/crop handling. Form field types require their own selection/value APIs, and flattening must be tested with actual appearances. Sources: https://mozilla.github.io/pdf.js/examples/ and https://pdf-lib.js.org/docs/api/classes/pdfoptionlist

## Release checks

1. Run `npx tsc --noEmit`, changed-file lint, `node checks/verify-form-workspace.mjs`, `node checks/verify-engine.mjs`, `node checks/verify-form-appearance.mjs` and the production build.
2. Run upload-to-download browser checks with the synthetic fixture and Apryse sample on desktop and 390px, then on Nord 2. Check editable and flattened output in another reader.
3. Test long filenames, keyboard open, landscape, rapid page/zoom changes, replacement failure, retry, radio clearing, multi-select, readonly and unsupported controls.
4. Inspect production asset responses after deployment. Use the existing production hosting configuration, never a local placeholder D1 configuration.
5. Check every shared-layout tool/alias for accessible settings and a reachable main action before expanding the pattern to the remaining task-specific refinements.
