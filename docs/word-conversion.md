# PDF to Word conversion

The browser converter exports editable text, tagged or clearly ruled tables, source-pixel images when their placement is simple, and rendered visual regions for diagrams and composite artwork. It uses PDF.js and docx. Documents stay on the device.

## Content preservation

- Graphics are expanded to include complete intersecting words and tables before cropping. Text is removed from the editable flow only when its visual region retains it.
- Table text belongs to exactly one cell. Ambiguous tagged structures fall back rather than duplicate words. Untagged text within a tagged table's bounds remains in the document.
- Illustrated tables fall back to a visual region when cell-level placement cannot be recovered safely.
- Repeated raster images are distinguished from drawing-only pages. Scans retain their original visual alongside recognized text, with an explicit warning if no words are recognized.
- Source page count is checked before export. Word may subsequently reflow content and change the output page count.
- Whole-page appearance mode preserves visual layout as images; its text is not editable.

## pdf2docx reference review

Reviewed https://github.com/ArtifexSoftware/pdf2docx on 2026-10-10. Its documentation describes Python extraction through PyMuPDF and reconstruction through python-docx; its requirements include OpenCV. Table construction includes both ruled/lattice and borderless/stream processing. Its repository states Artifex no longer actively maintains the project.

It is a useful reference for future table and layout reconstruction, but is not an npm/browser replacement for this converter. Running that implementation would require a separately provisioned Python execution environment. A server conversion option would also need a deliberate upload workflow, accurate processing disclosures, operational limits and representative output benchmarks. No Python service or pdf2docx dependency has been added here, and no parity claim is made.

## Remaining limitations

Untagged borderless tables, merged/nested cells, multi-column reading order and exact pagination are not universally reconstructed. Diagram labels remain part of the retained image. Arbitrary font embedding and editable vector shapes, charts or equations are not implemented. OCR requires review. Neither the browser implementation nor the reference review establishes perfect conversion for every PDF.

## Validation

`checks/verify-word-layout.mjs` tests mixed text/tables/images, source pixel dimensions, rotated and labelled graphics, drawing-only pages, hyperlinks, cancellation, source-count validation, unique cell boundaries, ambiguous tags, complete crop labels, repeated-image classification, small-page sizing and unmatched table text. Existing Word style and incremental-source regressions remain in repository CI.
