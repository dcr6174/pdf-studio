# Review batch decisions — 7 October 2026

Blog content, layouts and publishing (PS-063–PS-078) are excluded by the user's latest instruction. General sitemap correctness (PS-079) is checked without editing blog content or registries.

## Reader references (PS-017, PS-018)

Use continuous scrolling by default, a visible single/two-page choice, fit width/page, search, thumbnails, outline and optional locally stored reading bookmarks. These fit the existing PDF.js renderer. Keep reading controls separate from PDF export transformations. The Reader now honors supported `PageLayout` metadata. OCR is an explicit route for scans, not a claim that every scanned document is searchable.

Official references: https://www.sumatrapdfreader.org/docs/Scrolling-and-zooming and https://www.sumatrapdfreader.org/docs/Commands. PDF-XChange's official OCR description: https://www.pdf-xchange.com/knowledgebase/351-How-do-I-OCR-documents-with-the-PDF-XChange-family-of-products . The user-supplied PDF-XChange download repository was not treated as an official dependency.

## Image resolution (PS-019, PS-020)

Print export now offers actual 300 DPI instead of labeling a 4x scale as print (288 DPI). 600 and 1000 DPI were investigated, not promised for arbitrary pages. An A4 page is approximately 2480×3508 at 300 DPI, 4961×7016 at 600 DPI and 8268×11694 at 1000 DPI. The respective single RGBA surfaces alone consume about 35, 139 and 387 MB, before decoding, encoding and ZIP buffers. The existing renderer's 22-million-pixel limit rejects the latter two A4 requests. Some mobile canvases also have a 4096-pixel dimension limit.

Decision: retain a reliable 300-DPI print choice and on-demand page rendering. Do not introduce unsafe whole-page 600/1000-DPI options or a new heavyweight image library. Higher-resolution export needs a separately tested tiled encoder and device-aware limits. Primary browser reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/canvas .

## Compression (PS-039, PS-040)

Use three explicit methods: optimize supported JPEG images while keeping text/forms; lossless structural repacking; and clearly disclosed page-image rebuilding. Image quality presets and a best-effort target size are visible. Keep the smaller of original and generated output. An impossible target reports failure to meet the target rather than claiming success. Regression checks verify text, links, editable forms, geometry and target handling; visual quality still requires inspection of the actual user's documents.

## Bookmarks and removal (PS-009, PS-010, PS-023, PS-026, PS-032)

Chapter splitting maps original top-level destinations to the current workspace's retained source pages; it does not rely on an outline surviving PDF page copying. Removed destinations are omitted. Unsupported/no-boundary cases remain explicit errors.

Page/title rows are the primary bookmark input. Bulk multiline paste is optional, with the same validated page/title syntax. Link cleanup removes explicit Link annotations; printed URLs remain, and an external viewer may independently detect them. Annotation cleanup retains Widget annotations and their field values.

## Unrecoverable references

PS-054: the report does not include the exact highlighted removal regions. General redundant headings/spacing are addressed; exact screenshot matching remains open.

PS-081: Library and Personal Context searches did not recover the original concept 78 sheet. The current logo is preserved. Forty new SVG/PNG explorations and a small-size PDF comparison are provided separately; none is represented as concept 78.

## Verification boundaries

`checks/verify-review-batch.mjs` uses independent synthetic fixtures for bookmark insertion/removal, links, annotations/forms, attachments, faint selectable/scanned text, layout metadata, rotation and incomplete sheets. `checks/verify-compression-targets.mjs` and `checks/verify-jpeg-optimization.mjs` test retained structures and target sizes. Local TypeScript/lint/build checks are distinct from live desktop checks. The 66-tool mobile matrix is a test plan; it does not certify physical-phone behavior without testing.
