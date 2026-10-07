# October 7 audit revamp

Scope: PDFStudio-Full-Audit-Oct7.pdf and pdfstudio-workflow-study-ihatepdf-ae6f2777.pdf. Lab requests and suggested implementation dates are excluded as instructed. This is an implementation status, not a claim that all 100 findings are closed.

## Included in this release

- Compact accessible result dialog: Download first, size comparison, output report, settings recovery, collapsed next tools and Donate last.
- Dedicated task layout and selected-file facts, document previews, larger mobile targets, compact catalogs, one-row mobile navigation, sample PDF and privacy-check handoff.
- Empty workflow canvas and presets before upload; searchable 16-operation library, configuration, enabled steps, reorder, duplicate/delete, undo/redo, validated versioned recipes and local completion history. Eight-step maximum retained. Engine reports step timings and preserves originals on failure.
- Page numbering formats/position/range/font/inset; Bates suffix/digits; six header/footer fields and dynamic labels; four independent crop margins and edge sliders; real editable metadata; confirmed passwords; mirror direction; image paper/orientation/margins; EPUB title/author; 2/4/6/9 pages per sheet.
- Honest extraction reports, no-growth compression and target-status/name, SHA-256 report copying, unencrypted-password message, optional OCR review, read-aloud Pause/Resume/Stop without a spurious TXT result.
- Native blog and 20 problem-focused articles, visible server-rendered tool instructions/FAQ, duplicate-intent redirects, sitemap updates, title caps, branded recovery page, privacy disclosure, CSP/Permissions headers and anonymous-public HTML cache policy.

## Pending implementation or verification

| Audit IDs | Page / feature | Remaining work |
| --- | --- | --- |
| F-004, F-029, F-062 | Page-selection tools | Dedicated deletion state and deleted filename; synchronized extract range/grid; duplicate copy count/placement; mirror page range; audit all thumbnail retries and accessible selection names. |
| F-005 | Spreadsheet/CSV and privacy results | Real table-region detection and on-screen first-row preview; categorized privacy findings with page/match. Current spreadsheet report identifies extraction limits but does not establish true tables. |
| F-006, F-075 | Compression | Reliable pre-run estimates validated against representative files; concise three-level chips. Actual result size and unmet target are already reported. |
| F-008 | Redaction | User-facing verify action that inspects the redacted regions and reports retained metadata. Reopened-output text-removal and page-size checks pass. |
| F-017, F-018 | Watermark / labels / crop | Image/tiled watermark presets; labels over the actual document instead of a schematic; multi-file Bates sequence; direct draggable crop handles and per-page/all-page toggle. |
| F-020 | Compare PDFs | Separate Original/Revised upload slots from first paint and a navigable difference list. Existing comparison remains. |
| F-022 | Markdown | Live formatted desktop preview beside the full-width editor. |
| F-023 | OCR | Model download sizes, recognized-word counts and remaining skip-row wrap checks. Review can now be skipped. |
| F-027 | PDF to handwriting | Standard staged flow, output-page estimate before export and full console/output review. Lab handwriting remains excluded. |
| F-040 | Original-text editor | Consolidated floating formatting/Find and Replace/autosave presentation; embedded-font edit regression across representative documents. Distinct overlay and original-text editor URLs are retained intentionally. |
| F-041 | Chapters and bookmarks | Detect/show chapter ranges and names before run; no-bookmark disabled state before processing. |
| F-047, F-048 | Read aloud / viewer layout | Voice/rate picker and audible-device test; side-by-side reader-preference preview. |
| F-049, F-050, F-053 | Cleanup / resize / split | Consistent object-count summaries and before/after page geometry; precise split output-count/name preview and half-page diagram. |
| F-051, F-088 | Scan and camera | Explicit Capture/Review/Export stages and reliable device-camera availability detection. |
| F-054, F-055 | Image export / EPUB | WebP encoder preflight and diverse real EPUB/corrupt EPUB tests. Pixel-size estimate and EPUB title/author are present. |
| F-076, F-077 | Workflow depth | Watermark/encrypt/split steps beyond the current 16; live per-step status, intermediate downloads and refresh-in-place run history; exhaustive order permutations. Passwords are never persisted in recipes. |
| F-016, F-037, F-059, F-062, F-063, F-081, F-082, F-086, F-089 | Accessibility and editors | Full 200% zoom, keyboard/screen-reader, dark-mode contrast and every action-position check; residual complex editor chrome/OCR empty-state refinements. Shared targets/layout are improved. |
| F-034, F-039 | Speed and page length | Production Lighthouse mobile LCP target and unused-JS reduction; exact directory-height and all-device performance measurements. Reader loading is deferred. |
| F-069, F-070, F-071, F-100 | Production operations | Deployment/header/redirect validation; Cloudflare CPU logs and alerting, cache hit/TTFB comparison and full-day outage observation. Requires production access and elapsed observation. |
| F-032, F-072, F-092, F-097 | Search/content validation | Full crawl of surviving intents, description lengths and internal links; competitor pages refreshed using dated evidence; Search Console impact checks. Native 20-article content and canonical map are implemented. |
| F-095 | Result version undo | Version-labelled undo beyond Change settings and retained original. |

## Excluded by instruction

F-078, F-079, F-083, F-084 and F-085 (Lab ideas). Lab-only parts of F-027/F-081 are excluded. These are not blockers to the main-tool revamp.

## Validation

Public production build, TypeScript and ESLint pass. Engine exports reopened successfully: page ranges, rotation, crop, resizing, mirror, 2/4/6/9-up, numbering/Bates, metadata, AES/password failures, target compression, workflow reorder/remove/blank and invalid recipes. Poppler verifies redacted text is absent, sizes are preserved and form flattening retains searchable text. Upload/react workflow, analytics and tracker checks pass. Desktop/390px browser checks cover home, workflows, blog and numbering; workflow has no horizontal overflow. The legacy verify-studio harness has an unresolved local module dependency and is not counted as passed.

Production deployment is recorded separately in the accompanying pending PDF and GitHub pull request. Do not infer live deployment from a successful build or merge.
