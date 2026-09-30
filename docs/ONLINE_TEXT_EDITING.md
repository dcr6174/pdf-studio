# Online existing-text editing

Implemented 2026-09-30. Uses @embedpdf/pdfium 2.15.1 and its bundled PDFium WASM. It runs in the browser; only engine assets are fetched from our own origin. Document bytes are never sent to the engine host or analytics.

Open **Edit existing text**, choose a PDF, click a text object or select it from the accessible text list, change the text, **Apply and preview**, then **Export edited PDF**. Preview uses PDFium's actual changed document, rather than an HTML text overlay. The saved PDF contains the changed native text object. Other workspace operations and annotations are assembled before editing. Export before changing tools; Continue editing moves the exported document into the shared workspace.

## Supported scope

- Top-level text objects, including embedded fonts when the requested characters occur in the same font on that page.
- Standard Helvetica, Times and Courier ASCII edits.
- Single-line edits within the original object bounds; no paragraph reflow.
- Native page rotations, click selection, keyboard-accessible text list, zoom, ten document snapshots for undo/redo, export and actual PDF preview.
- 50 MB / 100 pages for this editor; engine loaded on demand. No accounts, watermarks or server processing.

## Limits and verification

Scans have no original text objects. Nested form graphics aren't traversed yet. Unavailable embedded glyphs require future explicit font substitution; current edits reject them. Existing PDF shaping, unusual fonts, clipping, text split across many objects and font encodings need representative document testing. Editing invalidates digital signatures. This is not secure redaction.

`node checks/verify-online-text.mjs` exercises real WASM edit/save/reopen, changed raster pixels, four page rotations, preserved adjacent text, overflow rollback, unsupported characters, multiline rejection, blank and malformed files. TypeScript and production build also run. Device/browser interactions and large real documents have not been independently verified.

## Deployment and licensing

`npm ci` and `npm run build:public` copy the pinned WASM and upstream license notices into `/public/vendor`. Deploy normally with the existing Cloudflare build; no new service, secrets or paid API is required. Wrapper MIT license and PDFium/third-party notices are distributed alongside the asset; see installed `LICENSE` and `LICENSE.pdfium` for exact terms. WASM is approximately 4.6 MB before transfer compression.

Sources reviewed: https://github.com/embedpdf/embed-pdf-viewer/tree/main/packages/pdfium and https://pdfium.googlesource.com/pdfium/+/refs/heads/main/public/fpdf_edit.h . Marketing claims about full paragraph editing are not relied on for this implementation.
