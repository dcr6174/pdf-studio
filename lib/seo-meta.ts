/** Search titles and descriptions for tool, guide and Lab pages. Edit the text here only. 
*/
export type SeoMeta = {title: string; description: string};
export const toolMeta: Record<string, SeoMeta> = {
 "add-blank-pages": {title: "Add Blank Pages to a PDF: Start, End or Between", description: "Insert blank pages into a PDF at the start, the end, after chosen pages or after every N pages. Free, in your browser. Nothing is uploaded."},
 "split-pdf-by-page-count": {title: "Split PDF by Page Count: Equal Parts in a ZIP", description: "Split a PDF into files of N pages each, or into N equal parts, and download them as a ZIP. Free, in your browser, with no upload."},
 "extract-odd-even-pages": {title: "Extract Odd or Even Pages From a PDF", description: "Save only the odd pages or only the even pages of a PDF, or get both as two files. Reverse the order for manual duplex printing. Free, in your browser."},
 "add-border-to-pdf": {title: "Add a Border to PDF Pages: Solid, Dashed, Double", description: "Add a coloured border around PDF pages. Choose width, distance from the edge, dashed or double lines and rounded corners. Free, in your browser."},
 "add-margins-to-pdf": {title: "Add Margins to a PDF: Extra White Space Around Pages", description: "Add top, bottom, left and right margins to a PDF in millimetres, by enlarging pages or shrinking content. Free, in your browser, no upload."},
 "extract-pdf-attachments": {title: "Extract Attachments From a PDF: Embedded Files to ZIP", description: "Find files embedded inside a PDF, such as spreadsheets, invoices and images, and save them in a ZIP. Free, in your browser. Nothing is uploaded or opened."},
 "merge-pdf": {title: "Merge PDF Files Online Free, No Watermark", description: "Combine several PDFs into one file in your browser. Reorder pages by drag and drop, preview the result, then download. No sign-up, no watermark."},
 "split-pdf": {title: "Split PDF by Page Range: Extract Pages", description: "Enter pages or ranges like 1, 3-5 and save them as a new PDF. Your original file is not changed. Runs in your browser, free."},
 "compress-pdf": {title: "Compress PDF Online Free, Keep Text or Shrink More", 
description: "Reduce PDF file size in your browser. Compact mode keeps text and links; image modes shrink more but can remove selectable text."},
 "organize-pdf": {title: "Organize PDF Pages: Reorder, Rotate, Delete", description: 
"Preview page thumbnails, drag them into a new order, rotate, duplicate or delete pages, then download the new PDF. Free, in your browser."},
 "sign-pdf": {title: "Sign PDF Online Free: Draw, Type or Upload", description: "Add a drawn, typed or uploaded signature to a PDF and place it where you need it. A visual signature, not a certificate-based digital signature."},
 "images-to-pdf": {title: "Images to PDF: JPG, PNG, WebP to One PDF", description: "Pick JPG, PNG or WebP images, put them in order and save them as one PDF. Free, no sign-up, processed in your browser."},
 "edit-pdf-text": {title: "Edit Text in a PDF: Change the Original Text", description: 
"Click existing text in a PDF, type the replacement and preview the result. Works on selectable text, not scans. Free, no watermark."},
 "fill-pdf-forms": {title: "Fill PDF Forms Online Free: Text, Checkbox, Dropdown", 
description: "Open a fillable PDF, complete text fields, checkboxes and dropdowns, then download it editable or flattened. No sign-up, no watermark."},
 "create-fillable-pdf": {title: "Create a Fillable PDF Form From a List of Labels", 
description: "Type one label per line (up to 60) and get a new A4 PDF with fillable text fields. Free, in your browser. Text fields only."},
 "rotate-pdf": {title: "Rotate PDF Pages Online: Fix Sideways Pages", description: "Rotate all pages or selected pages by 90, 180 or 270 degrees and save the PDF. Free, no sign-up, runs in your browser."},
 "pdf-to-jpg": {title: "PDF to JPG: Save Every Page as an Image", description: "Convert PDF pages to JPG images at the resolution you choose and download them in a ZIP. Free. The result is images, not editable text."},
 "pdf-to-png": {title: "PDF to PNG: Export Pages as PNG Images", description: "Turn PDF pages into PNG files at 72, 144 or 288 DPI, delivered as a ZIP. Free, in your browser. Higher DPI uses more memory."},
 "ocr-pdf": {title: "OCR PDF: Make Scanned PDFs Searchable", description: "Add an invisible text layer to scanned pages so you can search and copy text. Supports English, French, German, Spanish, Italian and Portuguese."},
 "protect-pdf": {title: "Password Protect a PDF With AES-256", description: "Add an opening password (8 characters or more) to your PDF and download the protected copy. Free, in your browser. Keep the password safe."},
 "unlock-pdf": {title: "Remove PDF Password You Already Know", description: "Enter the current password to remove protection and get an unlocked copy. Only for documents you are allowed to open. Free, in your browser."},
 "redact-pdf": {title: "Redact PDF: Black Out Sensitive Areas", description: "Mark regions to redact, export, then check the result before sharing. A plain shape on top of text is not redaction, so always inspect the output."},
 "add-pdf-bookmarks": {title: "Add Bookmarks to a PDF: Clickable Outline", description: 
"Type a page number and title on each line to build a clickable bookmark outline, then download the PDF. Free, in your browser."},
 "split-pdf-in-half": {title: "Split PDF Pages in Half: Left and Right", description: "Cut each page into two halves, handy for side-by-side scans of books or notes. Free, in your browser. Review the halves before use."},
 "remove-pdf-annotations": {title: "Remove Comments, Highlights and Links From a PDF", 
description: "Export a copy of your PDF without comments, stamps, highlights and links. Form fields are kept. Works on one unchanged PDF at a time."},
 "add-page-numbers": {title: "Add Page Numbers to a PDF Free", description: "Choose the starting number and save a copy of your PDF with numbers on each page. Free, no sign-up, runs in your browser."},
 "remove-pdf-metadata": {title: "Remove PDF Metadata: Author, Title, Dates", description: 
"Clear the standard title, author, subject, keywords, producer and date fields and download a clean copy. Free, in your browser."},
 "pdf-to-handwriting": {title: "PDF to Handwriting: Handwritten-Style Notes", description: 
"Turn selectable PDF text into handwritten-style notes on new paper. Layout, images and tables are not kept. Scans need OCR first."},
 "pdf-workflows": {title: "PDF Workflow Automation: Chain Steps, Download One Result", description: 
"Pick a preset or arrange supported PDF steps in your own order, review them and download a single result. Free, in your browser."},
 "split-by-chapters": {title: "Split PDF by Chapters Using Bookmarks", description: "Split a PDF at its top-level bookmarks into separate files. Needs a PDF with usable bookmarks. Check chapter boundaries afterwards."},
 "find-possible-blank-pages": {title: "Find Blank Pages in a PDF", description: "Review pages that look blank, then decide what to do. Nothing is deleted automatically, and very faint content can be missed."},
 "pdf-reader": {title: "PDF Reader Online: Read, Search, Navigate", description: "Read a PDF without changing it. Single page, continuous or two-page view, text selection, search and outline. Scans need OCR to be searchable."},
 "pdf-to-webp": {title: "PDF to WebP: Lightweight Page Images", description: "Export PDF pages as WebP images in a ZIP. Small files, but they are images, not text. Needs a browser that can encode WebP."},
 "remove-bookmarks": {title: "Remove Bookmarks From a PDF", description: "Delete the navigation outline from a PDF and keep the pages and links. This does not remove sensitive text. Works on one original PDF."},
 "remove-embedded-files": {title: "Remove Embedded Files and Attachments From a PDF", 
description: "Strip reachable file attachments from a PDF before sharing. Not a full sanitizer: old unreachable data may remain. Free, in your browser."},
 "remove-pdf-links": {title: "Remove Links From a PDF", description: "Remove clickable link areas from your PDF. Visible text, comments and form fields stay, and URLs typed as text remain visible."},
 "reader-layout": {title: "Set PDF Reading Layout: Single or Two-Column", description: 
"Save a single-page or two-column viewing preference in your PDF. Some PDF readers ignore this setting."},
 "split-every-page": {title: "Split PDF Into Single Pages", description: "Save every page of a PDF as its own file, packed in one ZIP. Free, in your browser."},
 "reverse-pages": {title: "Reverse PDF Page Order", description: "Flip a PDF so the last page comes first. One click, free, runs in your browser."},
 "duplicate-pages": {title: "Duplicate PDF Pages", description: "Make a second copy of every page in a PDF and download the longer file. Free, in your browser."},
 "alternate-and-mix": {title: "Alternate & Mix PDF: Interleave Pages", 
description: "Weave pages from several PDFs into one, for example front sides and back sides from two scans. Free, in your browser."},
 "pages-per-sheet": {title: "Put 2 or 4 PDF Pages on One Sheet", description: "Fit 2 or 4 pages onto each sheet to save paper when printing. Free, runs in your browser. Check text size before printing."},
 "crop-margins": {title: "Crop PDF Margins", description: "Trim the edges of your pages. Cropping hides content outside the page boundary but does not delete it, so do not use it to hide secrets."},
 "resize-to-a4": {title: "Resize PDF to A4", description: "Fit every page of a PDF onto an A4 sheet. Free, in your browser. Check the result for scaling and margins."},
 "mirror-pages": {title: "Mirror PDF Pages Horizontally", description: "Flip a PDF left to right and download it. Free, runs in your browser."},
 "edit-pdf": {title: "Edit PDF Online: Add Text, Images, Highlights", description: "Add new text, images, highlights and drawings on top of a PDF. To change original text use Edit PDF text, and for removal use Redact."},
 "add-watermark": {title: "Add a Text Watermark to a PDF", description: "Put your own text across every page of a PDF and download the result. Free, in your browser. Place and check it before you share."},
 "bates-numbering": {title: "Bates Numbering for PDF: Prefix and Sequence", description: 
"Stamp each page with a prefix and a running number for legal or office filing. Free, in your browser."},
 "headers-and-footers": {title: "Add Headers and Footers to a PDF", description: "Add a label to the top or bottom of every page in your PDF. Free, no sign-up, runs in your browser."},
 "flatten-pdf": {title: "Flatten a PDF Into a Static Document", description: "Turn pages into images so they cannot be edited. Text becomes unselectable and links and forms are removed. Free, in your browser."},

 "edit-metadata": {title: "Edit PDF Metadata: Title, Author, Subject", description: 
"Change the title, author and subject stored inside a PDF and download the updated copy. Free, runs in your browser."},
 "scan-to-pdf": {title: "Scan to PDF: Photograph Pages Into One PDF", description: "Take photos of paper pages with your phone camera or pick images, adjust crop and perspective, and save one PDF. Run OCR after for searchable text."},
 "extract-text": {title: "Extract Text From a PDF to a TXT File", description: "Save the selectable text of a PDF as a plain text file. Scanned PDFs need OCR first. Free, in your browser."},
 "pdf-to-word": {title: "PDF to Word: Editable Text or Page Appearance", description: "Convert PDF to DOCX with editable text and basic styles, or retain page appearance as images. Automatic scan recognition available. Processed in your browser."},
 "pdf-to-html": {title: "PDF to HTML: Readable Webpage From Text", description: "Export the text of a PDF as a simple webpage. Layout is not reproduced. Free, in your browser."},
 "pdf-to-epub": {title: "PDF to EPUB: Reflow Text for E-Readers", description: "Convert the text of a PDF into an EPUB that reflows on e-reader screens. Images and original layout are not kept."},
 "pdf-to-powerpoint": {title: "PDF to PowerPoint: One Page per Slide", description: "Put each PDF page on its own PPTX slide. Slides hold page images, so the text and graphics are not editable."},
 "pdf-to-spreadsheet": {title: "PDF to Excel (XLSX): Extract Text Rows", description: 
"Pull text rows from a PDF into an XLSX spreadsheet. Extraction is a best guess, so check the columns. Scans need OCR first."},
 "pdf-to-csv": {title: "PDF to CSV: Extract Text Rows", description: "Export text rows from a PDF as a CSV file. Results are approximate, so review the columns. Scans need OCR first."},
 "create-pdf": {title: "Create a PDF From Typed Text or a Text File", description: "Write or paste text, or open a Unicode text file, pick page and font size, and create a PDF. Free, in your browser."},
 "markdown-to-pdf": {title: "Markdown to PDF: Headings, Lists, Plain Text", description: 
"Convert Markdown into a readable PDF. Basic formatting only: complex tables and embedded images are not supported."},
 "word-to-pdf": {title: "Word (DOCX) to PDF: Text Conversion", description: "Turn a DOCX file into a PDF. Text is reflowed, so original Word layout, images and styling are not kept. Old .doc is not supported."},
 "spreadsheet-to-pdf": {title: "Spreadsheet to PDF: XLSX, XLS, CSV", description: "Print the first sheet of a spreadsheet to a PDF as text. Complex styling and charts are not kept. Free, in your browser."},
 "epub-to-pdf": {title: "EPUB to PDF: Turn Book Text Into a PDF", description: "Convert EPUB book text into a PDF. Text is reflowed, and styling and illustrations are not preserved."},
 "grayscale-pdf": {title: "Convert PDF to Grayscale (Black and White)", description: "Make every page grayscale for printing. Pages become images, so text search, links and forms are lost. Free, in your browser."},
 "invert-colours": {title: "Invert PDF Colors: Dark Mode PDF", description: "Create a dark version of a PDF for night reading. Pages become images, so text search, links and forms are lost."},
 "read-aloud": {title: "Read PDF Aloud With Your Device's Voices", description: "Listen to a PDF using your browser's speech voices. Voices vary by device and some need internet. No audio file download."},
 "compare-pdfs": {title: "Compare Two PDFs Side by Side", description: "Open two PDF documents next to each other and check what changed. Free, in your browser."},
 "privacy-scanner": {title: "PDF Privacy Scanner: Check Metadata and Text", description: 
"Scan a PDF for metadata and text patterns before sharing. It can miss sensitive data or flag harmless text, so review the file yourself."},
 "file-fingerprint": {title: "File Hash Calculator: SHA-256 Checksum", description: 
"Calculate the SHA-256 hash of a file in your browser to check it has not changed. Free."},
 "bundle-pdfs": {title: "Bundle PDFs Into a ZIP File", description: "Put several PDF files into a single ZIP for easy sharing. The PDFs are not merged. Free, in your browser."},
 "resave-pdf": {title: "Repair a PDF: Resave a Readable File", description: "Rebuild the structure of a PDF that opens but misbehaves. Badly damaged files may not be recoverable."},
 "text-to-pdf": {title: "Text to PDF Converter: Paste Text, Get a PDF", description: 
"Paste or type text, choose page size and font size, and download a PDF. Text wraps onto new pages. Unsupported characters are flagged."},
 "txt-to-pdf": {title: "TXT to PDF: Convert a Text File", description: "Open a UTF-8 text file, or UTF-16 with a byte-order mark, review it and save a PDF. Unsupported encodings show a clear error."},

 "jpg-to-pdf": {title: "JPG to PDF: Photos Into One PDF", description: "Choose JPG photos, fix their order and save them as one PDF. Good for receipts and notes. Free, in your browser."},
 "png-to-pdf": {title: "PNG to PDF: Screenshots and Scans Into a PDF", description: 
"Choose PNG images, arrange them and save a PDF. Free, in your browser. Text in images is not searchable until you run OCR."},
 "pdf-to-excel": {title: "PDF to Excel: Extract Text Rows to XLSX", description: "Convert selectable PDF text rows into an Excel file. Tables and formatting are not rebuilt exactly. Scans need OCR first."},
 "delete-pdf-pages": {title: "Delete Pages From a PDF", description: "Preview thumbnails, remove pages you do not need and download the shorter PDF. To hide sensitive parts of a page, use Redact instead."},
 "extract-pdf-pages": {title: "Extract Pages From a PDF Into a New File", description: 
"Choose pages or ranges such as 1, 3-5 and save only those pages. Uses file page positions, not printed page labels."},
 "pdf-editor": {title: "Online PDF Editor: Annotate, Add Text and Images", description: 
"Add text, images, shapes, highlights and links to a PDF in your browser. This adds overlays. For changing original text use Edit PDF text."},
 "edit-cv-pdf": {title: "Edit a CV or Resume PDF Without Retyping", description: "Fix a phone number, date, job title or typo in a CV PDF with selectable text. Single-line edits. Scanned CVs may not be editable."},
 "compress-pdf-to-100kb": {title: "Compress PDF to 100 KB for Forms and Portals", 
description: "Shrink a PDF toward 100, 200 or 500 KB upload limits. No size is guaranteed: photos and scans need stronger settings. Size is shown before download."},
 "powerpoint-to-pdf": {title: "PowerPoint to PDF: How to Export Your Slides", description: 
"A guide to saving a PPT or PPTX as a PDF in PowerPoint, then organizing or compressing it here. PDF Studio does not convert PPTX itself."},
 "html-to-pdf": {title: "HTML to PDF: Save a Webpage as PDF", description: "A guide to using your browser's Print, Save as PDF to turn a webpage into a PDF. PDF Studio does not fetch URLs or convert HTML itself."},
 "resize-pages": {title: "Resize PDF Pages to A4 or US Letter", description: "Fit selected PDF pages onto A4 or US Letter and export a resized copy. Runs in your browser; the original file is not changed."},
 "add-text-and-images": {title: "Add Text and Images to a PDF Online", description: "Place new text, images and annotations on PDF pages in your browser. Adds overlays; use Edit PDF Text to replace existing text."},
 "sketch-over-pdf": {title: "Sketch Over a PDF: Draw and Highlight", description: "Draw and highlight on PDF pages on a spacious canvas, then export. Marks are visual additions, not redaction. Free, in your browser."},
 "pdf-cut-and-collect": {title: "PDF Cut and Collect: Gather Clippings", description: "Collect clippings from PDF pages with their source-page references and export them as images in a new PDF. Text is not editable."},
 "pdf-fold-lab": {title: "PDF Fold Lab: Booklets and Cards", description: "Turn PDF pages into a folded booklet or four cut-out cards per A4 sheet. Test duplex orientation before printing the full pack."},
 "pdf-attachment-map": {title: "PDF Attachment Map: Linked Index", description: "Connect supporting PDFs with a clickable document index and export a combined reading copy. Separate files are not embedded."},
};
export const labMeta: Record<string, SeoMeta> = {
 "text-to-handwriting": {title: "Text to Handwriting: Handwritten-Style PDF", description: 
"Type or paste text onto a live notebook page and download it as a handwritten-style PDF. Free, in your browser."},
 "notebook-maker": {title: "Notebook Maker: Printable Ruled, Dotted, Grid Paper", 
description: "Create printable ruled, dotted, grid or plain paper as a PDF. Pick the style, then print or save. Free, in your browser."},
 "handwriting-practice": {title: "Handwriting Practice Sheets With Tracing Lines", 
description: "Make practice sheets with light tracing lines and blank space underneath to write on. Download as a PDF. Free, in your browser."},
 "flipbook": {title: "PDF Flipbook: Page-Turn Reader and HTML Export", description: "Read a PDF with a page-turn animation and export it as an offline HTML book. A Lab tool, still in testing."},
 "word-cloud": {title: "PDF Word Cloud: Most Frequent Words", description: "See the most frequent words in a PDF with selectable text and export the cloud as SVG. Scanned PDFs need OCR first."},
 "page-palette": {title: "PDF Page Color Palette: Get Hex Codes", description: "Pick a PDF page and get its main colors as hex values you can copy. Free, runs in your browser."},
 "whiteboard": {title: "Online Whiteboard: Draw and Export PNG or PDF", description: 
"Sketch diagrams on a blank canvas and export PNG, PDF or an editable scene file. Free, in your browser."},
 "poster-collage": {title: "PDF Poster Collage: Pages on One Poster", description: 
"Arrange PDF pages on a colorful poster and download PNG or PDF. Pages are exported as images, so the text is not selectable."},
 "pdf-to-gif": {title: "PDF to GIF: Animated GIF From Pages", description: "Turn selected PDF pages into an animated GIF and set the speed. Free, in your browser. Large page counts make big files."},
 "sketch-pdf": {title: "Sketch on a PDF: Draw and Highlight", description: "Draw and highlight directly on PDF pages, then export the annotated document. Free, in your browser."},
};
/** Adds the brand only when the whole title stays at 60 characters or fewer. */
export function fullTitle(title: string) {
  const branded = title + ' | PDF Studio';
  if(branded.length<=60)return branded;
  if(title.length<=60)return title;
  return title.slice(0,57).trimEnd()+'...';
}

