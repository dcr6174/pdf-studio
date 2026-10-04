# Direct existing-text editing and export reliability

Research and implementation: 4 October 2026.

## Competitor evidence
Reviewed official documentation and public tool descriptions, not competitor export benchmarks or proprietary implementations.

- Sejda documents clicking existing text to edit it and changing fonts/size/colour: https://files.sejda.com/pdf-editor
- Smallpdf documents selecting text through Edit Text; direct existing-text editing is advertised as Pro: https://smallpdf.com/en/edit-pdf
- Adobe documents on-page editing, independent text-box reflow and font substitution constraints: https://helpx.adobe.com/acrobat/using/edit-text-pdfs1.html and https://helpx.adobe.com/in/acrobat/web/edit-pdfs/edit-text-images-and-objects/edit-text.html
- iLovePDF's web editor page describes added text/shapes/comments/highlights; that does not prove native rewriting: https://www.ilovepdf.com/edit-pdf
- PDFgear's web editor describes overlays and directs existing-text changes to its offline software: https://www.pdfgear.com/edit-pdf/
- PDF24 exposes compression DPI/image quality and says image-heavy PDFs typically compress better than text-only files: https://tools.pdf24.org/en/compress-pdf
- ihatepdf.cv advertises in-place editing and local compression. Those are vendor claims; this work does not independently establish replacement/font correctness or its percentage reductions: https://www.ihatepdf.cv/

The common interaction is click-to-edit on the page. A PDF has positioned text objects rather than Word-style paragraphs; browser editing UI alone cannot provide paragraph reflow or missing font glyphs.

## Implemented

Existing-text selections now open a directly positioned input on the PDF page. Type there; Enter or Save text commits the native PDFium change. Escape or Cancel restores that line's value. The separate replacement textarea is removed. The canvas is rerendered from the saved PDF after each change; the transient input is not a whiteout export. Existing matrix, glyph and bounds checks remain. IME Enter does not commit during composition.

Pending typing marks the editor dirty, invalidates an older result and blocks export, page changes, zoom and history until saved or canceled. Undo back to the original bytes restores clean state. Font/fit feedback and the selectable text list remain as accessible alternatives. Saved edits can still be committed into the shared workspace.

Unchanged single-PDF Organize, Edit, Sign, single-file Merge and empty form-filling exports return the uploaded bytes directly when page identity/order/count/rotation and marks are unchanged. The text editor's initial Organize operation uses the same path, so exporting without edits preserves exact bytes and size. Actual changes and format conversions may change size. This does not promise that reconstructing a changed document after undo in every other workflow will regain byte identity.

Compact compression loads the original single PDF directly without metadata updates; it retains source bytes when resaving does not shrink them. Raster presets compare against the actual source being processed, preserve workspace edits in their fallback, and return the source when raster output is larger. Successful reports show actual before/after byte counts. All image presets are labelled as page images; those outputs lose searchable text, links and forms. No percentage reduction or target file size is guaranteed.

## Validation and limits

Processing checks verify byte-identical untouched Organize/Edit/Sign outputs, non-growing outputs across four compression presets, and actual shrinking of a generated noisy scan in all three raster presets. Files reopen independently; a rendered balanced scan is visually inspected. Existing PDFium tests cover actual replacement/save/reopen, page rotations, a 45° text-object matrix, unaffected text, fit bounds, rollback, missing glyphs and malformed inputs.

Single-line supported top-level text objects remain the scope. Nested objects, missing embedded glyphs, paragraph reflow, original-text style/movement controls and scanned-text reconstruction require further engine work. No proprietary competitor engine has been copied. Full mobile keyboard/focus/pointer interaction and current production deployment have not been independently verified. Technical input limits still appear only after rejection.

Validated noisy-scan fixture: 1,575,542 bytes became 12,982 (small), 91,121 (balanced), or 577,790 (high) bytes. Balanced output was rendered and its sample text visually inspected. This synthetic fixture is not a promised reduction for other documents. Compact is now the initial mode even on a directly opened compression URL.
