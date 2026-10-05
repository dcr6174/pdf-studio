# Research implementation status

This tracks the full research brief; implementation is not equivalent to verification or deployment.

| Research request | Status / evidence | Remaining work |
|---|---|---|
| Form preservation / explicit flatten merge | Implemented, reopened structural tests pass | Pixel comparison, unusual field appearances and signature widgets |
| Download viewport | Existing full-screen result retained | Real mobile/desktop viewport and one-download regression |
| Donation bottom | Implemented after result actions | Visual narrow-screen check |
| Document-first separate layouts | Existing responsive editor and new reader mobile/desktop controls | Unified shell refactor, measured page offsets, mobile keyboard corpus |
| Direct existing-text caret | Existing on-PDF input and supported object rewrite retained | Ayaan portable algorithm prototype, paragraph shaping/reflow, nested objects and Indian scripts |
| Ayaan evaluation | Source research complete, no native engine copied | Portable Rust/WASM proof plus independent save/reopen benchmarks |
| Workspace continuity | Existing shared controller; reader consumes it | Breakpoint/keyboard/resume browser regression |
| Compression no-larger output | Compact/raster no-larger guards plus supported RGB JPEG stream optimization implemented | Real browser decoder and representative visual quality benchmarks |
| Reader | Implemented single page/search/outlines/extracted-text/position | Continuous and two-page viewing, layered selection/links, pinch, encrypted prompt, real-device tests |
| Multilingual OCR | Six Latin language controls implemented | Model/output benchmarks; Indian-script font embedding and shaping |
| Scan correction | Manual crop/straighten with explicit apply/undo | Perspective detection and physical camera validation |
| Chapter split | Implemented supported top-level destinations | Representative render tests, nested outline support |
| Blank candidates | Implemented review-only heuristic | Sensitivity benchmark; no automatic deletion |
| Recipes | Three explicit sequences implemented over the existing processing engine; originals retained | Custom workflow builder and larger batch corpus |
| Template builder | Not implemented | Pinned licensed dependency, authored schemas, fonts and representative export tests |
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
- Continuous/spread layouts, pinch controls, encrypted-file prompting and physical-device selection/link testing remain unverified or incomplete. Native and server research proposals remain separate work, not advertised implementations.
