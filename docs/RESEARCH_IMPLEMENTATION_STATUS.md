# Research implementation status

This tracks the full research brief; implementation is not equivalent to verification or deployment.

| Research request | Status / evidence | Remaining work |
|---|---|---|
| Form preservation / explicit flatten merge | Implemented, reopened structural tests pass | Poppler equality passes for filled text/checkbox/dropdown; unusual appearances and signature widgets remain |
| Download viewport | Existing full-screen result retained | Real mobile/desktop viewport and one-download regression |
| Donation bottom | Implemented after result actions | Visual narrow-screen check |
| Document-first separate layouts | Existing responsive editor and new reader mobile/desktop controls | Unified shell refactor, measured page offsets, mobile keyboard corpus |
| Direct existing-text caret | Existing on-PDF input and supported object rewrite retained | Ayaan portable algorithm prototype, paragraph shaping/reflow, nested objects and Indian scripts |
| Ayaan evaluation | Source research complete, no native engine copied | Portable Rust/WASM proof plus independent save/reopen benchmarks |
| Workspace continuity | Existing shared controller; reader consumes it | Breakpoint/keyboard/resume browser regression |
| Compression no-larger output | Compact/raster no-larger guards plus supported RGB JPEG stream optimization implemented | Real browser decoder and representative visual quality benchmarks |
| Reader | Implemented single/continuous/spread, fit page, layered selection/links, local position/bookmarks | Thumbnails, pinch and encrypted prompt implemented; real-device tests pending |
| Multilingual OCR | Six Latin language controls implemented | Model/output benchmarks; Indian-script font embedding and shaping |
| Scan correction | Manual crop/straighten/perspective with preview, cancellation and undo | Automatic corner detection and physical camera validation |
| Chapter split | Implemented supported top-level destinations | Representative render tests, nested outline support |
| Blank candidates | Implemented review-only heuristic | Sensitivity benchmark; no automatic deletion |
| Recipes | Three explicit sequences implemented over the existing processing engine; originals retained | Custom ordered builder implemented; larger batch corpus pending |
| Template builder | Basic authored A4 positioned-text templates implemented inside Create PDF | Image/table schemas, backgrounds, richer designer, representative visual/device tests |
| Optional server conversions | Not implemented | Separate service, isolated uploads, resource policy, deployment credentials and retention validation |
| Privacy/analytics | Existing local processing/opt-out retained | Actual unique-fixture network trace; Cloudflare beacon setting verification |
| New guides | Added reader/chapter/blank instructions and honest FAQs | End-to-end link crawl and multilingual OCR guide expansion |
| Popular links | Prior live Scan/Compress routes worked | Every route/hash/back/modified click corpus |
| Redundant directory CTA | Previously removed | Keep directory reachable through existing navigation |
| Buddy | Implemented restrained float/pointer/tap and reduced motion | Rendered accessibility/CPU checks |
| Original-byte preservation | Automated unchanged export check passes | Full representative corpus beyond synthetic form |

No benchmark scores, universal font compatibility or production deployment is asserted. All numeric processing limits remain rejection-only.

### Reader follow-up
- Added PDF.js on-page selectable text rather than requiring the extracted-text panel.
- Added safe HTTP/HTTPS/mailto links and supported internal page destinations. Unsafe URL schemes are ignored.
- Each render owns its canvas, avoiding reuse while an earlier PDF.js render cancels. Canvas allocation is capped at four million pixels per page; zoom may therefore have limited sharpness on very large pages.
- Unchanged-download behavior remains in the shared processing engine.
- Pinch, thumbnails and encrypted prompting are implemented; physical-device interaction and selection/link testing remain unverified. Native and server research proposals remain separate work, not advertised implementations.

### Follow-up verification
- Native text tests cover unsupported-glyph preflight plus actual object rewrite/save/reopen and rotated objects.
- Scan tests verify projective corner mapping, finite interior points and crossed/degenerate corner rejection. Device/camera fidelity is not yet verified.
- Template tests independently reopen two A4 pages and verify text, plus invalid geometry/overflow/glyph rejection.
- Form flatten regression checks now require Poppler to render without syntax errors and compare original/export appearances pixel-for-pixel on the synthetic filled-field corpus.

- Reader passwords: actual encrypted fixture verifies missing/wrong password rejection, correct-password opening, encrypted-byte preservation and editing-intake rejection. Failed PDF.js loading tasks are destroyed.
- Reader render queue: verifies two simultaneous canvas tasks, queued progress, pending cancellation and idempotent release.

### Text conversion follow-up
- Dedicated Text to PDF and TXT to PDF landing pages reuse the real Create tool; old Create PDF URLs remain valid.
- Browser-local PDF generation supports A4/US Letter, font size, wrapping and automatic pages.
- UTF-8/UTF-16 text decoding and missing-font-character rejection avoid silent corruption. Current workspace is retained if text decoding fails.
- Indian-script shaping, paragraph editing of original PDFs and optional native/server work remain incomplete. No deployment is asserted.

### Mobile and signature theme fixes

Signature style samples now use a bounded transparency paper surface in both themes, without changing exported ink. Signature panels inherit readable theme colours; the popup has one scroll container and narrow-screen buttons wrap. Reader spread layout uses the same measured-width threshold as page rendering, avoiding half-width pages in a single column. Text to PDF now yields and checks cancellation within long paragraphs as well as between paragraphs. Physical camera, mobile keyboard and live deployment verification remain outstanding.
