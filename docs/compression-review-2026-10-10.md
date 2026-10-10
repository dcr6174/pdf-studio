# Compression review — 10 October 2026

## Scope and evidence
This is a source and documentation review of eight competing products and selected open-source implementations. It is not a comparative performance benchmark or a claim that every competitor was tested. Local synthetic fixture tests verify this implementation; production verification is separate.

## Product comparison
| Product | Published approach | Useful lesson |
| --- | --- | --- |
| iLovePDF | Extreme, Recommended and Less compression | Three clearly explained choices |
| Smallpdf | Basic, Moderate and Strong | Simple radio choices and actual output size |
| Adobe Acrobat online | High, Medium and Low | Explain the quality tradeoff |
| PDF24 | DPI, image quality, colour and lossless controls | Separate structural optimization from image loss |
| Sejda | Image quality and resolution | Protect text and document controls |
| PDFgear | Low, Medium and Strong | A clear default |
| PDF Candy | Recommended and Maximum | Avoid excessive configuration |
| Ghostscript | PDF rewrite and image downsampling presets | Rasterization and rewriting can affect interactive content; do not silently flatten |

## Original gaps and changes
- The image optimizer handled RGB JPEG images only. PNG/Flate RGB and grayscale scans now receive bounded decoding and image reduction, including TIFF and PNG predictors.
- Text-only documents had little opportunity to shrink. Lossless stream recompression and object-stream repacking now run alongside image optimization.
- Raster presets could sacrifice selectable text and interactive fields. The main UI now exposes Keep quality, Balanced and Smaller file, which retain document structure. Old workflow options remain compatible.
- Only smaller output replaces the input. Unsupported or masked image streams remain unchanged.
- Optional KB limits remain best effort within the selected quality level. Failure to meet a target is explicitly reported.
- Eligible single-file size previews run the actual compressor and reuse its result. They are not arbitrary percentage estimates. Previews are bounded to files at most 20 MB.
- File cards can be dragged as a whole. Nested controls retain their own actions.

## Verified fixtures
- JPEG fixture: 429,816 to 150,054 bytes, with editable form retained.
- One-megabyte fixture: Balanced under 200 KB, Smaller file under 100 KB; text extraction, a link and an editable form retained.
- PNG/Flate scan: predictor decoding, replacement dimensions and output stream validity checked.
- Masked images: retained rather than incorrectly flattened.
- Text-only PDF: structural shrink without image degradation.
- Impossible targets, cancellation, invalid input and no-enlargement behavior covered.
- Photo reducer: a 6 MB noise image fitted below 50, 200 and 300 KB. Aspect ratio and pixel limits checked; PNG alpha preserved.

## Limits
CMYK, indexed, masked and unsupported image encodings are skipped. Already optimized PDFs may not shrink. Image-heavy PDFs can lose fine detail in Balanced or Smaller file; inspect the output. Large images are bounded to prevent excessive memory use. Digitally signed PDFs should not be rewritten if signature validity must remain intact. Image upload acceptance also depends on dimensions and format, not only bytes.

## Open-source review
[Tiny](https://github.com/Sunzxyong/Tiny) is an Android Java/native image compressor, not a drop-in browser PDF engine. Its resize and quality-search approach informed the standalone image tool; no code was copied.

The [reduce-pdf-size topic](https://github.com/topics/reduce-pdf-size) includes marketing-only repositories as well as [pdf-email-optimizer](https://github.com/petehottelet/pdf-email-optimizer). Repository descriptions and advertised savings are not implementation evidence. qpdf's official documentation distinguishes image recompression, stream recompression and object-stream generation. Ghostscript's official documentation describes the consequences of PDF rewriting and presets.

## Primary references
- https://www.ilovepdf.com/compress_pdf
- https://smallpdf.com/compress-pdf
- https://www.adobe.com/acrobat/online/compress-pdf.html
- https://tools.pdf24.org/en/compress-pdf
- https://www.sejda.com/compress-pdf
- https://www.pdfgear.com/compress-pdf/
- https://pdfcandy.com/compress-pdf.html
- https://qpdf.readthedocs.io/en/stable/cli.html
- https://ghostscript.readthedocs.io/en/latest/VectorDevices.html
