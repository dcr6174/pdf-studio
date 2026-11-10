PDF Studio synthetic test fixtures

All data is synthetic. manifest.json maps every tool to its input and expected checks. A fixture is not a passing test.
Encrypted fixture password: Test1234!
Scan: Alpha Bravo Charlie Delta.

PDF to handwriting
Input: pdf-to-handwriting.pdf
Expected: Selectable text should import; images/layout are not preserved. Scan input must explain OCR prerequisite. Sidebar typing must retain the previous preview while updating.

PDF Workflow Automation
Input: workflow.pdf
Expected: Run Rotate + Watermark. All intended pages must rotate and contain the configured watermark. Test mobile Run action.

Split by chapters
Input: split-chapters.pdf
Expected: Expect two chapters (pages 1-3 and 4-6). Insert a blank page after page 1 and repeat; remove it and repeat. Alpha/Delta destinations must still map to the current order.

Find possible blank pages
Input: blank-check.pdf
Expected: Expect candidate page 2 only. Page 3 has faint selectable text; page 4 has faint scanned text. Review candidates, exclude any page, then optionally delete selected pages.

PDF Reader
Input: reader.pdf
Expected: Check page 1, 30, 100 and 120; continuous scrolling, search, zoom, thumbnails and reading focus. Viewing must not change original bytes.

PDF to WebP
Input: webp.pdf
Expected: Complete PDF to WebP. Inspect output content, page count, ordering, filename and all configured options. Check validation and both desktop/mobile controls. Rendered page images, not editable text. Requires browser WebP encoding support.

Remove bookmarks
Input: remove-bookmarks.pdf
Expected: Alpha/Delta outline must be absent; pages and visible text remain.

Remove embedded files
Input: remove-attachments.pdf
Expected: Embedded source.txt and FileAttachment references must be removed. Check page text remains.

Remove PDF links
Input: remove-links.pdf
Expected: Explicit URI and internal Link annotations must disappear. Printed abc.com text must remain; some external readers auto-detect URLs.

Add bookmarks
Input: bookmarks.pdf
Expected: Complete Add bookmarks. Inspect output content, page count, ordering, filename and all configured options. Check validation and both desktop/mobile controls. One bookmark per line: page number followed by its title. Appends by default; choose Replace to remove the existing outline.

Split pages in half
Input: halve.pdf
Expected: Complete Split pages in half. Inspect output content, page count, ordering, filename and all configured options. Check validation and both desktop/mobile controls. Uses CropBox boundaries; content outside each visible half is hidden, not securely removed. Rotations are retained.

Reading layout preference
Input: viewer.pdf
Expected: Switch Single page/Two columns and inspect the main preview. Export and inspect PageLayout in a reader that honors it.

Remove annotations
Input: remove-annotations.pdf
Expected: Text notes, highlights, stamps and links must disappear; the Name form widget and its value must remain.

Create fillable form
Input: create-form.pdf
Expected: Complete Create fillable form. Inspect output content, page count, ordering, filename and all configured options. Check validation and both desktop/mobile controls. Creates English text fields on new A4 pages. This does not add arbitrary field types to an existing PDF.

Merge PDFs
Input: merge.pdf + stack-b.pdf
Expected: Use merge.pdf and stack-b.pdf. Check chosen file order, page count, additive file picker and desktop sorting.

Organize pages
Input: organize.pdf
Expected: Complete Organize pages. Inspect output content, page count, ordering, filename and all configured options. Check validation and both desktop/mobile controls. 

Split PDF
Input: split.pdf
Expected: Complete Split PDF. Inspect output content, page count, ordering, filename and all configured options. Check validation and both desktop/mobile controls. 

Split every page
Input: split-all.pdf
Expected: Complete Split every page. Inspect output content, page count, ordering, filename and all configured options. Check validation and both desktop/mobile controls. 

Compress PDF
Input: compress.pdf
Expected: Compare source/output size and verify retained text, links and form widgets in image/repack modes. Raster mode must disclose losses. An unsuccessful target must remain visible.

Rotate PDF
Input: rotate.pdf
Expected: Rotate page 2 only, then test 90, 180 and 270 degrees. Page order and other pages must remain unchanged.

Reverse pages
Input: reverse.pdf
Expected: Complete Reverse pages. Inspect output content, page count, ordering, filename and all configured options. Check validation and both desktop/mobile controls. 

Duplicate pages
Input: duplicate.pdf
Expected: Complete Duplicate pages. Inspect output content, page count, ordering, filename and all configured options. Check validation and both desktop/mobile controls. 

Alternate & Mix PDF
Input: interleave.pdf + stack-b.pdf
Expected: Use interleave.pdf (A1-A6) and stack-b.pdf (B1-B3). Expect A1 B1 A2 B2 A3 B3 A4 A5 A6.

Pages per sheet
Input: nup.pdf
Expected: Test 2/4/6/9 pages per sheet. Check incomplete final sheet, output count, margins and scrollability.

Crop margins
Input: crop.pdf
Expected: Complete Crop margins. Inspect output content, page count, ordering, filename and all configured options. Check validation and both desktop/mobile controls. Cropping hides content outside the page boundary; it does not permanently remove it.

Resize pages
Input: resize.pdf
Expected: Complete Resize pages. Inspect output content, page count, ordering, filename and all configured options. Check validation and both desktop/mobile controls. 

Mirror pages
Input: flip.pdf
Expected: Complete Mirror pages. Inspect output content, page count, ordering, filename and all configured options. Check validation and both desktop/mobile controls. 

Edit existing text
Input: native-text.pdf
Expected: Complete Edit existing text. Inspect output content, page count, ordering, filename and all configured options. Check validation and both desktop/mobile controls. Edit original text objects, lines and compatible paragraphs. Keep the original font or use an embedded fallback / uploaded TTF or OTF. Nested text is edited when it can be detached safely. OCR reconstruction is a separate, explicit path. Editing invalidates digital signatures.

Add text & images
Input: edit.pdf
Expected: Complete Add text & images. Inspect output content, page count, ordering, filename and all configured options. Check validation and both desktop/mobile controls. Adds new elements and visual whiteout. Use Edit existing text for actual text replacement; use Redact for content removal.

Sign PDF
Input: sign.pdf
Expected: Complete Sign PDF. Inspect output content, page count, ordering, filename and all configured options. Check validation and both desktop/mobile controls. A visual signature, without a certificate or identity verification.

Redact PDF
Input: redact.pdf
Expected: Complete Redact PDF. Inspect output content, page count, ordering, filename and all configured options. Check validation and both desktop/mobile controls. Export rebuilds all pages as images and removes original text, links, metadata and forms.

Add watermark
Input: watermark.pdf
Expected: Complete Add watermark. Inspect output content, page count, ordering, filename and all configured options. Check validation and both desktop/mobile controls. 

Page numbers
Input: numbers.pdf
Expected: Complete Page numbers. Inspect output content, page count, ordering, filename and all configured options. Check validation and both desktop/mobile controls. 

Bates numbering
Input: bates.pdf
Expected: Complete Bates numbering. Inspect output content, page count, ordering, filename and all configured options. Check validation and both desktop/mobile controls. 

Headers & footers
Input: headers.pdf
Expected: Complete Headers & footers. Inspect output content, page count, ordering, filename and all configured options. Check validation and both desktop/mobile controls. 

Flatten PDF
Input: flatten.pdf
Expected: Complete Flatten PDF. Inspect output content, page count, ordering, filename and all configured options. Check validation and both desktop/mobile controls. Rebuilds pages as images. Text is no longer selectable; links and forms are removed.

Fill PDF forms
Input: form.pdf
Expected: Fill Name with Test User and confirm logical field value, widget appearance and editability after reopening.

Edit metadata
Input: metadata.pdf
Expected: Complete Edit metadata. Inspect output content, page count, ordering, filename and all configured options. Check validation and both desktop/mobile controls. 

Scan to PDF
Input: scan.jpg
Expected: Complete Scan to PDF. Inspect output content, page count, ordering, filename and all configured options. Check validation and both desktop/mobile controls. Take a photo can open the camera on supported phones; other browsers show a file picker. Each photo becomes a page. Review manual crop, straightening or four-corner perspective correction before applying. Text is not recognized; run OCR afterwards.

Images to PDF
Input: scan.png
Expected: Complete Images to PDF. Inspect output content, page count, ordering, filename and all configured options. Check validation and both desktop/mobile controls. PNG, JPG and WebP images. Browser memory also depends on decoded images, not just file size.

PDF to JPG
Input: jpg.pdf
Expected: Complete PDF to JPG. Inspect output content, page count, ordering, filename and all configured options. Check validation and both desktop/mobile controls. 

PDF to PNG
Input: png.pdf
Expected: Complete PDF to PNG. Inspect output content, page count, ordering, filename and all configured options. Check validation and both desktop/mobile controls. 

Extract text
Input: text.pdf
Expected: Complete Extract text. Inspect output content, page count, ordering, filename and all configured options. Check validation and both desktop/mobile controls. 

PDF to Word
Input: word.pdf
Expected: Complete PDF to Word. Inspect output content, page count, ordering, filename and all configured options. Check validation and both desktop/mobile controls. Editable text keeps page breaks and basic styles, with automatic scan recognition. Pictures and complex table/column structure are not rebuilt. Page appearance keeps pages as images; their text is not editable.

PDF to HTML
Input: html.pdf
Expected: Complete PDF to HTML. Inspect output content, page count, ordering, filename and all configured options. Check validation and both desktop/mobile controls. 

PDF to EPUB
Input: epub.pdf
Expected: Complete PDF to EPUB. Inspect output content, page count, ordering, filename and all configured options. Check validation and both desktop/mobile controls. 

PDF to PowerPoint
Input: pptx.pdf
Expected: Complete PDF to PowerPoint. Inspect output content, page count, ordering, filename and all configured options. Check validation and both desktop/mobile controls. Slides are page images, not editable original text or graphics.

PDF to spreadsheet
Input: xlsx.pdf
Expected: Complete PDF to spreadsheet. Inspect output content, page count, ordering, filename and all configured options. Check validation and both desktop/mobile controls. Heuristic extraction. Review column alignment; scans need OCR first.

PDF to CSV
Input: csv.pdf
Expected: Complete PDF to CSV. Inspect output content, page count, ordering, filename and all configured options. Check validation and both desktop/mobile controls. 

Text to PDF
Input: source.txt
Expected: Complete Text to PDF. Inspect output content, page count, ordering, filename and all configured options. Check validation and both desktop/mobile controls. 

Markdown to PDF
Input: source.md
Expected: Complete Markdown to PDF. Inspect output content, page count, ordering, filename and all configured options. Check validation and both desktop/mobile controls. Basic Markdown formatting; complex tables and embedded images are not supported.

Word to PDF
Input: source.docx
Expected: Complete Word to PDF. Inspect output content, page count, ordering, filename and all configured options. Check validation and both desktop/mobile controls. Reflows text; original Word layout, images and styling are not preserved. Legacy .doc is not supported.

Spreadsheet to PDF
Input: source.xlsx
Expected: Complete Spreadsheet to PDF. Inspect output content, page count, ordering, filename and all configured options. Check validation and both desktop/mobile controls. Choose which sheets to include. Text rows are exported; charts, images and original styling are not preserved.

EPUB to PDF
Input: source.epub
Expected: Complete EPUB to PDF. Inspect output content, page count, ordering, filename and all configured options. Check validation and both desktop/mobile controls. Reflows text; ebook styling and illustrations are not preserved.

Grayscale PDF
Input: grayscale.pdf
Expected: Complete Grayscale PDF. Inspect output content, page count, ordering, filename and all configured options. Check validation and both desktop/mobile controls. Rebuilds pages as images. Text search, links and forms are lost.

Invert colours
Input: invert.pdf
Expected: Complete Invert colours. Inspect output content, page count, ordering, filename and all configured options. Check validation and both desktop/mobile controls. Rebuilds pages as images. Text search, links and forms are lost.

Searchable PDF (OCR)
Input: ocr.pdf
Expected: Scan has no selectable text. Expect searchable Alpha Bravo Charlie Delta after recognition/review/export; inspect visible scan fidelity.

Read aloud
Input: audio.pdf
Expected: Complete Read aloud. Inspect output content, page count, ordering, filename and all configured options. Check validation and both desktop/mobile controls. Uses browser speech synthesis. Voice availability and offline support depend on your device. No audio-file export.

Compare PDFs
Input: compare.pdf + compare-revised.pdf
Expected: Use this fixture and compare-revised.pdf. The revised page has different visible text; check both scrollable previews.

Protect PDF
Input: encrypt.pdf
Expected: Complete Protect PDF. Inspect output content, page count, ordering, filename and all configured options. Check validation and both desktop/mobile controls. 

Remove password
Input: encrypted-aes256-r6.pdf
Expected: Use encrypted-aes256-r6.pdf with password Test1234!. Wrong password must fail; correct output must reopen without a password.

Privacy scanner
Input: privacy.pdf
Expected: Complete Privacy scanner. Inspect output content, page count, ordering, filename and all configured options. Check validation and both desktop/mobile controls. Pattern matching can miss sensitive data or flag harmless text. Review the document before sharing.

Remove metadata
Input: clean.pdf
Expected: Complete Remove metadata. Inspect output content, page count, ordering, filename and all configured options. Check validation and both desktop/mobile controls. Clears standard title, author, subject, keywords, producer and dates. It is not a complete sanitization of every hidden object.

Calculate SHA-256
Input: hash.pdf
Expected: Complete Calculate SHA-256. Inspect output content, page count, ordering, filename and all configured options. Check validation and both desktop/mobile controls. 

Bundle PDFs
Input: zip.pdf
Expected: Complete Bundle PDFs. Inspect output content, page count, ordering, filename and all configured options. Check validation and both desktop/mobile controls. 

Repair readable PDF
Input: repair.pdf
Expected: Complete Repair readable PDF. Inspect output content, page count, ordering, filename and all configured options. Check validation and both desktop/mobile controls. Can resave PDFs that parse successfully. Severely damaged PDFs may not be recoverable.

Sketch over PDF
Input: sketch-pdf.pdf
Expected: Complete Sketch over PDF. Inspect output content, page count, ordering, filename and all configured options. Check validation and both desktop/mobile controls. Adds visual marks while retaining original page contents. Not redaction.

PDF Cut & Collect
Input: cut-collect.pdf
Expected: Complete PDF Cut & Collect. Inspect output content, page count, ordering, filename and all configured options. Check validation and both desktop/mobile controls. Clippings export as images in a new PDF; text is not editable.

PDF Fold Lab
Input: fold-lab.pdf
Expected: Complete PDF Fold Lab. Inspect output content, page count, ordering, filename and all configured options. Check validation and both desktop/mobile controls. Creates an A4 print layout from rendered pages. Test duplex orientation before printing the full pack.

PDF Attachment Map
Input: attachment-map.pdf
Expected: Complete PDF Attachment Map. Inspect output content, page count, ordering, filename and all configured options. Check validation and both desktop/mobile controls. Creates a combined reading copy with links to supporting documents and main-document sections. Does not embed separate file attachments.

Add blank pages
Input: add-blank-pages.pdf
Expected: Complete Add blank pages. Inspect output content, page count, ordering, filename and all configured options. Check validation and both desktop/mobile controls. Blank pages match the neighbouring page size unless you pick A4 or Letter. Existing pages are not changed.

Split PDF by page count
Input: split-by-page-count.pdf
Expected: Complete Split PDF by page count. Inspect output content, page count, ordering, filename and all configured options. Check validation and both desktop/mobile controls. Output is a ZIP of PDFs. Fillable form fields may need flattening first.

Odd & even pages
Input: odd-even-pages.pdf
Expected: Complete Odd & even pages. Inspect output content, page count, ordering, filename and all configured options. Check validation and both desktop/mobile controls. Pages are copied as they are. Choose reverse order when feeding paper back by hand for double-sided printing.

Add page border
Input: add-page-border.pdf
Expected: Complete Add page border. Inspect output content, page count, ordering, filename and all configured options. Check validation and both desktop/mobile controls. The border is drawn on top of the page. Text, links and form fields are untouched.

Add margins to PDF
Input: add-pdf-margins.pdf
Expected: Complete Add margins to PDF. Inspect output content, page count, ordering, filename and all configured options. Check validation and both desktop/mobile controls. Make pages bigger keeps everything intact. Keep the page size redraws the pages, so links and form fields on them are dropped.

Extract PDF attachments
Input: extract-pdf-attachments.pdf
Expected: Complete Extract PDF attachments. Inspect output content, page count, ordering, filename and all configured options. Check validation and both desktop/mobile controls. Finds embedded files in the document attachment list and file-attachment annotations. Nothing is opened or run.

Insert PDF pages
Input: insert-pdf-pages.pdf
Expected: Complete Insert PDF pages. Inspect output content, page count, ordering, filename and all configured options. Check validation and both desktop/mobile controls. Choose where the pages go and which pages to take from the second file. The original file is not changed.

Overlay PDF
Input: overlay-pdf.pdf
Expected: Complete Overlay PDF. Inspect output content, page count, ordering, filename and all configured options. Check validation and both desktop/mobile controls. The overlay is scaled to fit each page. Use opacity to keep the text underneath readable.

Add PDF background
Input: add-pdf-background.pdf
Expected: Complete Add PDF background. Inspect output content, page count, ordering, filename and all configured options. Check validation and both desktop/mobile controls. The background sits behind the existing content, so text, links and form fields keep working.

Stamp PDF
Input: stamp-pdf.pdf
Expected: Complete Stamp PDF. Inspect output content, page count, ordering, filename and all configured options. Check validation and both desktop/mobile controls. Pick a ready stamp or type your own text. Choose colour, size and position.

Add logo to PDF
Input: add-logo-to-pdf.pdf
Expected: Complete Add logo to PDF. Inspect output content, page count, ordering, filename and all configured options. Check validation and both desktop/mobile controls. PNG and JPG images are supported. Transparent PNG backgrounds are kept.

Highlight text in PDF
Input: highlight-text-in-pdf.pdf
Expected: Complete Highlight text in PDF. Inspect output content, page count, ordering, filename and all configured options. Check validation and both desktop/mobile controls. Works on PDFs with real text. Scanned pages need OCR first.

Flatten form fields
Input: flatten-form-fields.pdf
Expected: Complete Flatten form fields. Inspect output content, page count, ordering, filename and all configured options. Check validation and both desktop/mobile controls. After flattening, the values can no longer be edited. Keep the original if you may need to change answers.

Lock form fields
Input: lock-form-fields.pdf
Expected: Complete Lock form fields. Inspect output content, page count, ordering, filename and all configured options. Check validation and both desktop/mobile controls. Fields stay in the file but cannot be changed in a normal PDF reader. This is not encryption.

Export PDF form data
Input: export-pdf-form-data.pdf
Expected: Complete Export PDF form data. Inspect output content, page count, ordering, filename and all configured options. Check validation and both desktop/mobile controls. Each field name and value is listed. Passwords and signatures are not read.

Extract PDF links
Input: extract-pdf-links.pdf
Expected: Complete Extract PDF links. Inspect output content, page count, ordering, filename and all configured options. Check validation and both desktop/mobile controls. Reads real link annotations, not just text that looks like a URL.

Extract PDF bookmarks
Input: extract-pdf-bookmarks.pdf
Expected: Complete Extract PDF bookmarks. Inspect output content, page count, ordering, filename and all configured options. Check validation and both desktop/mobile controls. Keeps the nesting of chapters and sections.

PDF word counter
Input: pdf-word-counter.pdf
Expected: Complete PDF word counter. Inspect output content, page count, ordering, filename and all configured options. Check validation and both desktop/mobile controls. Counts selectable text only. Scans need OCR first.

PDF document info
Input: pdf-document-info.pdf
Expected: Complete PDF document info. Inspect output content, page count, ordering, filename and all configured options. Check validation and both desktop/mobile controls. Reads the file only. Nothing is changed.

PDF to Markdown
Input: pdf-to-markdown.pdf
Expected: Complete PDF to Markdown. Inspect output content, page count, ordering, filename and all configured options. Check validation and both desktop/mobile controls. Headings are guessed from font size, so check the result.

PDF to JSON
Input: pdf-to-json.pdf
Expected: Complete PDF to JSON. Inspect output content, page count, ordering, filename and all configured options. Check validation and both desktop/mobile controls. One entry per page. Scans need OCR first.

Remove blank pages
Input: remove-blank-pages.pdf
Expected: Complete Remove blank pages. Inspect output content, page count, ordering, filename and all configured options. Check validation and both desktop/mobile controls. Pages are checked by looking at the rendered page. Choose a strictness that suits your scans.

Crop PDF to content
Input: crop-pdf-to-content.pdf
Expected: Complete Crop PDF to content. Inspect output content, page count, ordering, filename and all configured options. Check validation and both desktop/mobile controls. Crops each page, or all pages to one shared area. The hidden area is masked, not deleted.

Attach files to PDF
Input: add-pdf-attachment.pdf
Expected: Complete Attach files to PDF. Inspect output content, page count, ordering, filename and all configured options. Check validation and both desktop/mobile controls. Up to 10 files and 20 MB in total. Readers show them in an attachments panel.

Extract images from PDF
Input: extract-pdf-images.pdf
Expected: Complete Extract images from PDF. Inspect output content, page count, ordering, filename and all configured options. Check validation and both desktop/mobile controls. Pulls embedded images only. Pages drawn as vectors have none to extract.

PDF booklet maker
Input: pdf-booklet.pdf
Expected: Complete PDF booklet maker. Inspect output content, page count, ordering, filename and all configured options. Check validation and both desktop/mobile controls. Print double-sided, flip on the short edge, then fold. Pages are padded to a multiple of 4.

Extract pages by keyword
Input: extract-pages-by-keyword.pdf
Expected: Complete Extract pages by keyword. Inspect output content, page count, ordering, filename and all configured options. Check validation and both desktop/mobile controls. Searches selectable text. Scans need OCR first.

Delete pages by keyword
Input: delete-pages-by-keyword.pdf
Expected: Complete Delete pages by keyword. Inspect output content, page count, ordering, filename and all configured options. Check validation and both desktop/mobile controls. At least one page must remain. Scans need OCR first.
