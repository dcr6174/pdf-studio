# iHatePDF source comparison and PDF Studio update

Reviewed 5 October 2026. Source snapshot: cu-sanjay/iHatePDF main, 29eb82110f22f97e6a22253412c640ee9f1813a5. This is a source review, not a benchmark of that project's deployed UI, and is not a review of ihatepdf.cv.

Sources:
- https://github.com/cu-sanjay/iHatePDF/blob/main/README.md
- https://github.com/cu-sanjay/iHatePDF/blob/main/LICENSE
- https://github.com/cu-sanjay/iHatePDF/blob/main/client/src/lib/pdfUtils.ts
- https://github.com/cu-sanjay/iHatePDF/blob/main/client/src/pages/CompressPdf.tsx
- https://github.com/cu-sanjay/iHatePDF/blob/main/client/src/pages/SignPdf.tsx
- https://github.com/cu-sanjay/iHatePDF/blob/main/server/routes.ts

## Evidence and decisions

| Capability | Source evidence | PDF Studio decision |
|---|---|---|
| Local processing | routes.ts has a health endpoint and no document upload route; PDF utilities operate on browser Files/canvases | Keep our browser processing; source inspection cannot establish every deployed network request |
| WebP page export | convertPdfToImages accepts jpg/png/webp and uses canvas encoding | Added PDF to WebP with selected resolution, ZIP export and an error if encoding is unsupported |
| Compression target and preview | UI accepts target KB; utility derives scale/quality heuristically rather than achieving an exact target | Keep truthful quality choices and original-byte fallback. Preview/target iteration is future work, not a guaranteed size claim |
| Compression fallback | Utility chooses raster only when smaller than baseline and original, but otherwise returns baseline even if larger than original | Do not copy: our non-growing fallback is safer |
| Signing | SignPdf uses ratios for placement, pointer capture, ink cropping and pen undo | Retain our Type/Draw/Upload/Camera workflow and rotation-aware engine; future pen undo/cropping improvements need real device tests |
| Merge | mergePdfFiles copies pages into a new PDF | Does not solve form-tree preservation. Our known form limitation is disclosed; fill and flatten forms first |
| Resume / LaTeX / equation tools | README lists three document/math builders | Useful future projects, but not implemented or counted as working PDF tools in this update |
| Licensing | MIT, copyright Sanjay Choudhary | No competitor source or branding copied; our changes extend existing dependencies |

## Changes implemented

PDF Studio catalogue grows from 57 to 61 distinct tools with four additions: PDF to WebP, Remove bookmarks, Remove embedded files and Remove PDF links. Reader/inspection utilities are included in the catalogue; this does not mean 61 independent editing engines. Existing capabilities are not counted again as alias pages.

Cleanup tools operate on the original unchanged single PDF, reject pending workspace changes, preserve original bytes when there is nothing to remove, and preserve page content. Link cleanup retains visible URL text, comments and form widgets. Attachment cleanup removes reachable EmbeddedFiles name trees, associated-file references and FileAttachment annotations. It does not garbage-collect all unreachable objects or securely erase historical attachment bytes, and is not advertised as secure sanitization.

The search shortcut remains wired but its visible badge is removed. A compact privacy disclosure reveals Check it yourself on hover, focus or tap, with Escape dismissal. No document-size limits were added to initial screens. Merge export appears only after at least two accepted PDFs are added, and the engine rejects one-file merge calls. A form-field warning is now explicit. Result buttons no longer stretch to enormous heights. Upload copy says Stays on your device; retained-workspace errors are conditional on an actual open document.

## Validation and outstanding work

Automated checks and outcomes are recorded in the final delivery. Canvas output tests use Node canvas and actual PDF.js rendering, not a real mobile browser. Hover/touch, focus behavior and layout bounds require a live browser check after deployment. This update does not fix the audit's form-preserving merge gap, www DNS/522, Cloudflare beacon configuration/disclosure, genuine paragraph editing, redaction drag sizing or security headers. Those are independent follow-up tasks, not completed claims.

Verified locally: lint with zero warnings; TypeScript; production build; cleanup round-trip fixtures retaining forms/comments; actual PDF.js to WebP ZIP export with RIFF/WEBP header checks; no-op cleanup byte equality; six-page two-file merge and one-file rejection; 53 processing fixture results and 49 additional checks; 61 unique menu/directory links; 71 tool/guide routes; upload rejection preservation; hash navigation; search and no-upfront-limit checks. Canvas tests do not simulate browser interactions.
