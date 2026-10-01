# PDF Studio — combined feature coverage

Research date: 1 October 2026. This is the combined scope of the six services’ public catalogues reviewed below. It does not claim exhaustive analysis of hidden settings, account-only functions, APIs or every desktop capability. A named competitor tool is evidence that the service advertises it, not proof of its output quality, privacy or fidelity. No competitor document was uploaded during this review.

## Sources and observations

- [iLovePDF](https://www.ilovepdf.com/): public feature catalogue reviewed.
- [Smallpdf](https://smallpdf.com/pdf-tools): public feature catalogue reviewed.
- [Sejda](https://www.sejda.com/): public feature catalogue reviewed.
- [PDF24](https://tools.pdf24.org/en/all-tools): public feature catalogue reviewed.
- [PDFgear](https://www.pdfgear.com/online-tools/): public feature catalogue reviewed.
- [ihatepdf](https://www.ihatepdf.cv/): public feature catalogue reviewed.

Sejda explicitly distinguishes its server-based web processing from its desktop application. PDFgear likewise separates quick browser tools from its broader installed software. PDF24’s catalogue includes specialist format, invoice and archival tasks. Smallpdf and iLovePDF also list AI capabilities. ihatepdf advertises local operation, but its homepage uses inconsistent tool counts and both uncapped and size-bounded language; those claims are not copied into PDF Studio.

## What the statuses mean

- **Implemented**: a concrete code path exists; not a guarantee of every document’s compatibility. This release’s validation section identifies what was retested.
- **Partial**: a useful subset exists with explicit limits, not feature parity.
- **Missing**: no current implementation.
- **Constrained**: missing and dependent on another engine, service, integration or platform.

## Feature matrix

| Capability | Advertised by | Before | Now | Tool | Priority | Scope / gap |
|---|---|---|---|---|---|---|
| AI assistant | Smallpdf | Constrained | Constrained | — | P2 | Needs additional engine, service, integration or platform support; not available in the current browser app. |
| AI document chat | Smallpdf, ihatepdf | Constrained | Constrained | — | P2 | Needs additional engine, service, integration or platform support; not available in the current browser app. |
| AI quizzes | Smallpdf | Constrained | Constrained | — | P2 | Needs additional engine, service, integration or platform support; not available in the current browser app. |
| AI summaries | iLovePDF, Smallpdf, ihatepdf | Constrained | Constrained | — | P2 | Needs additional engine, service, integration or platform support; not available in the current browser app. |
| AZW3 import | ihatepdf | Missing | Missing | — | P2 | No working implementation is advertised. |
| Annotation removal | Sejda | Missing | Implemented | remove-annotations | P1 | Removes non-widget annotations on original single PDF. |
| Annotations | Smallpdf, Sejda, PDF24, PDFgear | Partial | Partial | edit | P1 | Overlay highlights and shapes; no full comments/replies or freehand annotation system. |
| Application package | PDF24 | Missing | Missing | — | P2 | No working implementation is advertised. |
| Archival PDF conversion | iLovePDF, Smallpdf, PDF24 | Constrained | Constrained | — | P2 | Needs additional engine, service, integration or platform support; not available in the current browser app. |
| Archival PDF validation | PDF24 | Constrained | Constrained | — | P2 | Needs additional engine, service, integration or platform support; not available in the current browser app. |
| Audio transcription | ihatepdf | Constrained | Constrained | — | P2 | Needs additional engine, service, integration or platform support; not available in the current browser app. |
| Audio-file export | ihatepdf | Constrained | Constrained | — | P2 | Needs additional engine, service, integration or platform support; not available in the current browser app. |
| Bates numbering | Sejda | Implemented | Implemented | bates | P1 | Existing implementation; applicable caveats remain in the tool description. |
| Bookmark-based split | Sejda | Missing | Missing | — | P2 | No working implementation is advertised. |
| Bookmarks | Sejda, PDF24 | Missing | Implemented | bookmarks | P1 | Flat outline from page/title pairs. |
| CSV import | Smallpdf, ihatepdf | Missing | Missing | — | P2 | No working implementation is advertised. |
| Camera capture | iLovePDF, Smallpdf, PDF24, ihatepdf | Missing | Missing | — | P2 | No working implementation is advertised. |
| Colour inversion | ihatepdf | Implemented | Implemented | invert | P1 | Existing implementation; applicable caveats remain in the tool description. |
| Comparison | iLovePDF, PDF24, ihatepdf | Partial | Partial | compare | P1 | Side-by-side pages; no automatic change detection. |
| Compress | iLovePDF, Smallpdf, Sejda, PDF24, PDFgear, ihatepdf | Partial | Partial | compress | P0 | Image presets rasterize; compact mode has document-dependent savings. |
| Content-based rename | Sejda | Missing | Missing | — | P2 | No working implementation is advertised. |
| Crop | iLovePDF, Smallpdf, Sejda, PDF24, PDFgear, ihatepdf | Partial | Partial | crop | P1 | Margin trimming; not secure removal. |
| Deskew | Sejda | Missing | Missing | — | P1 | No working implementation is advertised. |
| Document search | PDF24 | Missing | Missing | — | P1 | No working implementation is advertised. |
| EPUB export | PDF24, ihatepdf | Implemented | Implemented | epub | P1 | Existing implementation; applicable caveats remain in the tool description. |
| EPUB import | Smallpdf, PDF24, ihatepdf | Partial | Partial | ebook | P1 | Reflowed text only; images and styling not retained. |
| Electronic invoices | PDF24 | Constrained | Constrained | — | P2 | Needs additional engine, service, integration or platform support; not available in the current browser app. |
| Encryption | iLovePDF, Smallpdf, Sejda, PDF24, ihatepdf | Implemented | Implemented | encrypt | P1 | Existing implementation; applicable caveats remain in the tool description. |
| Existing-text editing | Sejda, ihatepdf | Partial | Partial | native-text | P0 | Bounded edits; glyph and nested-object limits; no paragraph reflow. |
| Flatten | Smallpdf, Sejda, PDF24, PDFgear, ihatepdf | Implemented | Implemented | flatten | P1 | Existing implementation; applicable caveats remain in the tool description. |
| Form creation | iLovePDF, Sejda, PDF24, PDFgear | Missing | Partial | create-form | P1 | New A4 text-field forms only; not arbitrary field placement or full field types. |
| Form filling | iLovePDF, Smallpdf, Sejda, PDF24, PDFgear | Partial | Partial | form | P0 | Text, checkbox and dropdown support; original document workflow. |
| GST invoices | ihatepdf | Missing | Missing | — | P2 | No working implementation is advertised. |
| Grayscale | Sejda | Implemented | Implemented | grayscale | P1 | Existing implementation; applicable caveats remain in the tool description. |
| HEIC import | PDF24, PDFgear | Missing | Missing | — | P2 | No working implementation is advertised. |
| HEIC to JPEG | PDF24 | Missing | Missing | — | P2 | No working implementation is advertised. |
| HEIC to PNG | PDF24 | Missing | Missing | — | P2 | No working implementation is advertised. |
| HTML export | PDF24, ihatepdf | Implemented | Implemented | html | P1 | Existing implementation; applicable caveats remain in the tool description. |
| HTML import | iLovePDF, Smallpdf, Sejda, PDF24, ihatepdf | Missing | Missing | — | P2 | No working implementation is advertised. |
| HWP import | Smallpdf | Constrained | Constrained | — | P2 | Needs additional engine, service, integration or platform support; not available in the current browser app. |
| Headers and footers | Sejda, ihatepdf | Implemented | Implemented | headers | P1 | Existing implementation; applicable caveats remain in the tool description. |
| Image extraction | Sejda, PDF24 | Missing | Missing | — | P1 | No working implementation is advertised. |
| Image import | iLovePDF, Smallpdf, Sejda, PDF24, PDFgear, ihatepdf | Implemented | Implemented | images | P1 | Existing implementation; applicable caveats remain in the tool description. |
| Images | Sejda | Implemented | Implemented | edit | P1 | Existing implementation; applicable caveats remain in the tool description. |
| Interleaving | Sejda | Implemented | Implemented | interleave | P1 | Existing implementation; applicable caveats remain in the tool description. |
| Invoice XML rendering | PDF24 | Missing | Missing | — | P2 | No working implementation is advertised. |
| Invoice validation | PDF24 | Constrained | Constrained | — | P2 | Needs additional engine, service, integration or platform support; not available in the current browser app. |
| Invoices | PDF24 | Missing | Missing | — | P2 | No working implementation is advertised. |
| JPEG export | iLovePDF, Smallpdf, Sejda, PDF24, PDFgear, ihatepdf | Implemented | Implemented | jpg | P1 | Existing implementation; applicable caveats remain in the tool description. |
| Leak tracing | ihatepdf | Constrained | Constrained | — | P2 | Needs additional engine, service, integration or platform support; not available in the current browser app. |
| Legacy PowerPoint import | PDF24 | Constrained | Constrained | — | P2 | Needs additional engine, service, integration or platform support; not available in the current browser app. |
| Legacy Word import | PDF24 | Constrained | Constrained | — | P2 | Needs additional engine, service, integration or platform support; not available in the current browser app. |
| Links | Sejda | Implemented | Implemented | edit | P1 | Existing implementation; applicable caveats remain in the tool description. |
| MOBI import | ihatepdf | Missing | Missing | — | P2 | No working implementation is advertised. |
| Markdown export | iLovePDF, PDF24 | Missing | Missing | — | P2 | No working implementation is advertised. |
| Markdown import | PDF24, ihatepdf | Partial | Partial | markdown | P1 | Basic headings and lists, not full rich Markdown. |
| Merge | iLovePDF, Smallpdf, Sejda, PDF24, PDFgear, ihatepdf | Implemented | Implemented | merge | P1 | Existing implementation; applicable caveats remain in the tool description. |
| Metadata editing | Sejda, PDF24 | Implemented | Implemented | metadata | P1 | Existing implementation; applicable caveats remain in the tool description. |
| Metadata removal | PDF24 | Implemented | Implemented | clean | P1 | Existing implementation; applicable caveats remain in the tool description. |
| Mirroring | Sejda | Implemented | Implemented | flip | P1 | Existing implementation; applicable caveats remain in the tool description. |
| N-up | Sejda, PDF24 | Implemented | Implemented | nup | P1 | Existing implementation; applicable caveats remain in the tool description. |
| Native print driver | PDF24 | Constrained | Constrained | — | P2 | Needs additional engine, service, integration or platform support; not available in the current browser app. |
| OCR | iLovePDF, Smallpdf, Sejda, PDF24, ihatepdf | Partial | Partial | ocr | P0 | English recognition; ASCII searchable output; review errors. |
| ODG import | PDF24 | Missing | Missing | — | P2 | No working implementation is advertised. |
| ODP export | PDF24 | Missing | Missing | — | P2 | No working implementation is advertised. |
| ODP import | Smallpdf, PDF24 | Missing | Missing | — | P2 | No working implementation is advertised. |
| ODS export | PDF24 | Missing | Missing | — | P2 | No working implementation is advertised. |
| ODS import | Smallpdf, PDF24 | Missing | Missing | — | P2 | No working implementation is advertised. |
| ODT export | PDF24 | Missing | Missing | — | P2 | No working implementation is advertised. |
| ODT import | Smallpdf, PDF24 | Missing | Missing | — | P2 | No working implementation is advertised. |
| PDF invoice extraction | PDF24 | Constrained | Constrained | — | P2 | Needs additional engine, service, integration or platform support; not available in the current browser app. |
| PDF reader | Smallpdf, PDF24, PDFgear | Partial | Partial | organize | P1 | Page previews and zoom; no full reader search or bookmarking controls. |
| PNG export | Smallpdf, Sejda, PDF24, PDFgear | Implemented | Implemented | png | P1 | Existing implementation; applicable caveats remain in the tool description. |
| POS billing | ihatepdf | Missing | Missing | — | P2 | No working implementation is advertised. |
| PSD export | PDFgear | Constrained | Constrained | — | P2 | Needs additional engine, service, integration or platform support; not available in the current browser app. |
| PSD import | PDFgear | Constrained | Constrained | — | P2 | Needs additional engine, service, integration or platform support; not available in the current browser app. |
| Page deletion | iLovePDF, Smallpdf, Sejda, PDF24, PDFgear, ihatepdf | Implemented | Implemented | organize | P1 | Existing implementation; applicable caveats remain in the tool description. |
| Page extraction | iLovePDF, Smallpdf, Sejda, PDF24, PDFgear, ihatepdf | Implemented | Implemented | split | P1 | Existing implementation; applicable caveats remain in the tool description. |
| Page halving | Sejda, PDF24 | Missing | Implemented | halve | P1 | CropBox halves with rotation retained; hidden content is not redacted. |
| Page insertion | Smallpdf, PDFgear | Missing | Implemented | organize | P1 | Blank page insertion plus existing PDF merge/workspace organization. |
| Page numbering | iLovePDF, Smallpdf, PDF24, ihatepdf | Implemented | Implemented | numbers | P1 | Existing implementation; applicable caveats remain in the tool description. |
| Page organization | iLovePDF, Smallpdf, Sejda, PDF24, PDFgear, ihatepdf | Implemented | Implemented | organize | P1 | Existing implementation; applicable caveats remain in the tool description. |
| Page overlay | PDF24 | Missing | Missing | — | P2 | No working implementation is advertised. |
| Page resize | Sejda, PDF24, ihatepdf | Partial | Partial | resize | P1 | A4 fitting only; no arbitrary dimensions. |
| Page-image ZIP | ihatepdf | Implemented | Implemented | zip | P1 | Existing implementation; applicable caveats remain in the tool description. |
| Pages import | Smallpdf | Constrained | Constrained | — | P2 | Needs additional engine, service, integration or platform support; not available in the current browser app. |
| Password generation | PDF24 | Missing | Missing | — | P2 | No working implementation is advertised. |
| Password removal | iLovePDF, Smallpdf, Sejda, PDF24, PDFgear, ihatepdf | Implemented | Implemented | decrypt | P1 | Existing implementation; applicable caveats remain in the tool description. |
| Peer sharing | ihatepdf | Constrained | Constrained | — | P2 | Needs additional engine, service, integration or platform support; not available in the current browser app. |
| PowerPoint export | iLovePDF, Smallpdf, Sejda, PDF24, PDFgear, ihatepdf | Partial | Partial | pptx | P1 | Page-image slides, not editable original graphics. |
| PowerPoint import | iLovePDF, Smallpdf, PDF24, PDFgear, ihatepdf | Constrained | Constrained | — | P1 | Needs additional engine, service, integration or platform support; not available in the current browser app. |
| Privacy scan | ihatepdf | Partial | Partial | privacy | P1 | Standard metadata and pattern matching, not full hidden-object inspection. |
| Publisher import | PDF24 | Constrained | Constrained | — | P2 | Needs additional engine, service, integration or platform support; not available in the current browser app. |
| QR generation | PDF24 | Missing | Missing | — | P2 | No working implementation is advertised. |
| RTF export | PDF24 | Missing | Missing | — | P2 | No working implementation is advertised. |
| RTF import | Smallpdf, PDF24, PDFgear | Missing | Missing | — | P2 | No working implementation is advertised. |
| Rasterization | PDF24 | Missing | Missing | — | P2 | No working implementation is advertised. |
| Redaction | iLovePDF, Smallpdf, PDF24, ihatepdf | Implemented | Implemented | redact | P1 | Existing implementation; applicable caveats remain in the tool description. |
| Repair | iLovePDF, Sejda, PDF24, ihatepdf | Partial | Partial | repair | P1 | Resaves parsable PDFs; no forensic reconstruction. |
| Rich document authoring | ihatepdf | Partial | Partial | create | P1 | Plain text creation, not a rich text document editor. |
| Rotation | iLovePDF, Smallpdf, Sejda, PDF24, PDFgear, ihatepdf | Implemented | Implemented | rotate | P1 | Existing implementation; applicable caveats remain in the tool description. |
| SVG export | PDF24 | Missing | Missing | — | P2 | No working implementation is advertised. |
| SVG import | PDF24 | Missing | Missing | — | P2 | No working implementation is advertised. |
| Shapes | Sejda | Implemented | Implemented | edit | P1 | Existing implementation; applicable caveats remain in the tool description. |
| Shared whiteboard | ihatepdf | Constrained | Constrained | — | P2 | Needs additional engine, service, integration or platform support; not available in the current browser app. |
| Size-based split | Sejda | Missing | Missing | — | P2 | No working implementation is advertised. |
| Split | iLovePDF, Smallpdf, Sejda, PDF24, PDFgear, ihatepdf | Implemented | Implemented | split | P1 | Existing implementation; applicable caveats remain in the tool description. |
| Spreadsheet export | iLovePDF, Smallpdf, Sejda, PDF24, PDFgear, ihatepdf | Partial | Partial | xlsx | P1 | Heuristic text rows; no reliable table reconstruction. |
| Spreadsheet import | iLovePDF, Smallpdf, PDF24, PDFgear, ihatepdf | Partial | Partial | sheet | P1 | First sheet, text rows; no charts or original styling. |
| TIFF export | Sejda, PDF24 | Missing | Missing | — | P2 | No working implementation is advertised. |
| TIFF import | PDF24 | Missing | Missing | — | P2 | No working implementation is advertised. |
| Text export | Sejda, PDF24, ihatepdf | Implemented | Implemented | text | P1 | Existing implementation; applicable caveats remain in the tool description. |
| Text import | Smallpdf, PDF24, PDFgear | Missing | Missing | — | P2 | No working implementation is advertised. |
| Text overlays | iLovePDF, Smallpdf, Sejda, PDF24 | Implemented | Implemented | edit | P1 | Existing implementation; applicable caveats remain in the tool description. |
| Text-based split | Sejda | Missing | Missing | — | P2 | No working implementation is advertised. |
| Translation | iLovePDF, Smallpdf | Constrained | Constrained | — | P2 | Needs additional engine, service, integration or platform support; not available in the current browser app. |
| Viewer preferences | PDF24 | Missing | Implemented | viewer | P1 | Single-page or two-column preference; reader support varies. |
| Visual invoice design | PDF24 | Missing | Missing | — | P2 | No working implementation is advertised. |
| Visual signatures | iLovePDF, Smallpdf, Sejda, PDF24, PDFgear, ihatepdf | Implemented | Implemented | sign | P0 | Existing implementation; applicable caveats remain in the tool description. |
| Watermarks | iLovePDF, Smallpdf, Sejda, PDF24, ihatepdf | Implemented | Implemented | watermark | P1 | Existing implementation; applicable caveats remain in the tool description. |
| Web optimization | PDF24 | Missing | Missing | — | P2 | No working implementation is advertised. |
| WebP to JPEG | PDF24 | Missing | Missing | — | P2 | No working implementation is advertised. |
| WebP to PNG | PDF24 | Missing | Missing | — | P2 | No working implementation is advertised. |
| Word export | iLovePDF, Smallpdf, Sejda, PDF24, PDFgear, ihatepdf | Partial | Partial | word | P0 | Text-only DOCX, no original layout. |
| Word import | iLovePDF, Smallpdf, Sejda, PDF24, PDFgear, ihatepdf | Partial | Partial | docx | P0 | DOCX text reflow only; no layout or image preservation. |
| Workflow chains | Sejda | Partial | Partial | organize | P1 | Continue editing and shared workspace; no saved automated recipes. |
| ZIP import | Smallpdf | Missing | Missing | — | P2 | No working implementation is advertised. |

## Prioritized delivery sequence

1. **P0: trustworthy everyday workflows.** Visible type/upload signing, drag and keyboard placement, bounded existing-text edits, honest conversions, output previews, clear controls and recovery.
2. **P1: browser feature depth.** Arbitrary form placement and field types, image extraction, document search, camera capture, deskew, automatic comparisons, custom paper sizes, richer editing and saved workflow recipes.
3. **P1: conversion engine.** A self-hosted sandboxed LibreOffice service for supported Office formats; isolated jobs, explicit limits, private storage, cancellation, cleanup, and representative fidelity tests. No conversion guarantee. This requires a deployment beyond the existing Worker-only runtime.
4. **P2: archival and specialist formats.** Validate PDF/A with a standards validator; do not label a generic resave as PDF/A. HEIC/TIFF and legacy/specialist imports need tested codecs.
5. **P2: signing and collaboration.** Certificate signing, identity-backed requests and audits need key management, storage and service design. A signature PNG is not cryptographic signing. Peer transfer needs signalling and connectivity support; it cannot be promised to work everywhere without a relay option.
6. **P2: AI and business tools.** Add separately after choosing local models or sustainable server budgets. Summaries, translation and quizzes need evaluation and clear consent when text leaves the browser. Billing, tax and e-invoice outputs need jurisdiction-specific validation. They remain unavailable, rather than fake tools.

## Changes in this release

Visible name entry and upload signing, preview before placement, optional drawing, transparent-padding crop, explicit batch/privacy choices, a consistent light interface, blank-page insertion, bookmarks, annotation removal preserving form widgets, rotation-aware page halves, reader layout and basic new fillable text forms. SEO adds useful server-rendered tool guides, page-specific metadata, breadcrumb data, a refreshed sitemap, and public About/Privacy pages. No ranking claim or fake review data.

## Verification and remaining checks

New tests validate native PDF objects, bookmark destinations, rotated half-page boundaries, fillable form round trips, preservation of form widgets, and signature PNG decoding/cropping/embedding. Existing engine regression checks cover page organization, encryption, forms and exports. Raster tests use @napi-rs/canvas, also used by the existing studio check; these are test dependencies, not part of browser processing. For raster checks, install `@napi-rs/canvas@0.1.80` and `@xmldom/xmldom@0.8.15` locally with `npm install --no-save --package-lock=false`; dependency changes from that local test setup do not need to be committed.

Real mobile interactions, uploads on actual devices, real large documents, Office fidelity, OCR beyond English, and advanced missing tools are not validated by those tests. Full combined parity is not complete.

SEO reference: [Google Search Central starter guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide). Submit the deployed sitemap in Search Console and verify canonical pages and indexing after Cloudflare succeeds; deployment and ranking are separate from a passing local build.

Release validation: new PDF-object checks, signature raster checks, 21 server-rendered SEO guide checks, existing 18-check engine suite, existing 48-tool/32-check studio suite, existing-text WASM checks, TypeScript and production build passed. The local HTTP preview could not start because Wrangler encountered an OS network-interface error; real browser/mobile UI behavior and Cloudflare rollout remain unverified.
