/** Task-specific instructions describe available controls, not promised fidelity. */
export type ToolGuidance = { steps: string[]; useCase: string; checks: string; faq: [string, string][] };
export const toolGuidance: Record<string, ToolGuidance> = {
"cut-collect":{"steps": ["Open one or more PDFs with Add PDFs. Choose a document and page.", "Drag across the preview to select a region, or set Left, Top, Width and Height percentages. Add an optional caption and press Collect selection.", "Repeat on other pages. Move or remove clippings, press Create collection PDF, then Download PDF."], "useCase": "PDF Cut & Collect", "checks": "Clippings are images. They do not retain selectable text, links or the structure of a source table. Collection is not redaction; your originals remain unchanged.", "faq": [["Do files leave my device?", "No. Files are processed in your browser."], ["Is the original changed?", "No. Export a separate result."]]},"fold-lab":{"steps": ["Open one PDF and choose Folded booklet or Four cut-out cards.", "Enter optional source page ranges such as 1, 3-5. For a booklet, review the front/back sheet plan; zero positions are shown as blanks.", "Press Create print PDF and Download PDF. Print a test sheet at 100%; use landscape short-edge duplex for the booklet, then stack and fold."], "useCase": "PDF Fold Lab", "checks": "Print layouts contain page images, so selectable text, links and form fields do not survive. A4 paper and a short-edge duplex test are required for the booklet. No printer setting is controlled automatically.", "faq": [["Do files leave my device?", "No. Files are processed in your browser."], ["Is the original changed?", "No. Export a separate result."]]},"attachment-map":{"steps": ["Add a main PDF first, then supporting PDFs. The first file is the main document.", "For each support, enter a section description and a page position in the main PDF. Use the move controls to arrange the pack.", "Press Create mapped PDF and Download PDF. Click the index document titles and main-section references to check their destinations."], "useCase": "PDF Attachment Map", "checks": "This is a combined reading copy, not embedded file attachments. Fill and flatten forms before using it. Original signatures, outlines and embedded attachments are not preserved; keep all original files.", "faq": [["Do files leave my device?", "No. Files are processed in your browser."], ["Is the original changed?", "No. Export a separate result."]]},"sketch-pdf":{"steps": ["Open one PDF in Sketch over PDF.", "Choose Pen or Highlight, ink colour and thickness. Draw on the page. Use Scroll to navigate without drawing.", "Use Previous or Next for another page. Undo, redo or clear marks on the current page.", "Press Create sketched PDF, then Download PDF on the result screen. Use Download this page PNG when you only need the current view."], "useCase": "Annotate a PDF on a spacious canvas.", "checks": "Sketch adds visible strokes to original page content. If fillable fields could cover your marks, make fields read-only before export. No-change exports return the original bytes. Digital signatures can be invalidated by changes. Work is not automatically saved when the tab closes.", "faq": [["Can I scroll without drawing?", "Choose Scroll in the toolbar."], ["Are my marks saved automatically?", "No. Download before closing the tab."]]},

'pdf-to-handwriting':{steps:['Open a PDF with selectable text.','Review extracted text and choose a handwriting style and paper.','Inspect the generated PDF and download it.'],useCase:'Turn typed PDF notes into handwritten-style pages.',checks:'Text is reflowed; source layout, tables and images are not preserved. Scans require OCR first. Unsupported font characters are reported.',faq:[['Is this OCR?','No. Import requires selectable PDF text.'],['Does this preserve the original PDF?','Your original stays unchanged; download a newly generated document.']]},

create:{steps:['Type or paste text, or choose a Unicode text file.','Review the text, then choose A4 or US Letter and a font size.','Create the PDF, inspect page breaks and characters, then download or continue editing.'],useCase:'Turn notes, letters or plain-text documents into a readable PDF.',checks:'Supports UTF-8 and BOM-marked UTF-16 files. Uses local Noto Sans; unavailable font characters are rejected. Text wraps across pages; source formatting, tables and images are not reconstructed.',faq:[['Can I type instead of opening a file?','Yes. Paste or type directly into the document text field.'],['Can I convert Indian-language text?','Full Indian-script font coverage and shaping are not implemented. Unsupported font characters are rejected.']]},
"remove-attachments": {"steps": ["Open the original single PDF.", "Export a copy without reachable embedded-file attachment entries.", "Check the reader attachment panel and inspect the output before sharing."], "useCase": "Remove embedded companion files from a document.", "checks": "Deletes attachment name trees, associated-file references and attachment annotations. Unreachable objects may remain in the bytes; use a dedicated sanitization workflow for sensitive documents.", "faq": [["Does this upload my document?", "No. Document processing happens in this browser."], ["Will the original change?", "No. Download is a separate file. Keep the original for recovery."]]},
"remove-links": {"steps": ["Open the original single PDF.", "Export a copy without page Link annotations.", "Check that visible text and form fields still appear."], "useCase": "Remove clickable page URLs before sharing.", "checks": "Visible URL text, bookmarks, comments and forms remain. This does not remove scripts or securely sanitize a document.", "faq": [["Does this upload my document?", "No. Document processing happens in this browser."], ["Will the original change?", "No. Download is a separate file. Keep the original for recovery."]]},
"remove-bookmarks": {"steps": ["Open the original single PDF.", "Export a copy without its navigation outline.", "Reopen the PDF and check page content and reader navigation."], "useCase": "Remove an outdated table of contents from the reader sidebar.", "checks": "Removes bookmarks only. Page links and visible content remain; export existing workspace changes first.", "faq": [["Does this upload my document?", "No. Document processing happens in this browser."], ["Will the original change?", "No. Download is a separate file. Keep the original for recovery."]]},
"webp": {"steps": ["Open a PDF and review its pages.", "Choose screen, standard or print resolution.", "Export the ZIP, extract it and check the WebP page images."], "useCase": "Share lightweight rendered page images.", "checks": "Images do not preserve searchable text or forms. Browsers without WebP encoding receive an error and can use PNG or JPG instead.", "faq": [["Does this upload my document?", "No. Document processing happens in this browser."], ["Will the original change?", "No. Download is a separate file. Keep the original for recovery."]]},
  'split-chapters':{steps:['Open a PDF containing top-level bookmarks.','Export a ZIP split at supported bookmark destinations.','Extract and inspect the first and last page of every chapter.'],useCase:'Separate a bookmarked manual into chapter files.',checks:'Bookmarks without local page destinations cannot define boundaries. Nested bookmarks are not chapter boundaries. Page copying can remove editable forms; flatten them explicitly first.',faq:[['Can I split a PDF without bookmarks?','Use Split with explicit page ranges or add bookmarks first.'],['Are nested entries used?','No. Only supported top-level local destinations define chapters.']]},
  'blank-check':{steps:['Open the PDF and run the page check.','Read the reported candidate page numbers.','Inspect candidates in Organize before deleting any page.'],useCase:'Find likely empty sheets in a scan.',checks:'This is a heuristic, not proof a page is empty. Small or faint marks can be missed, and scan noise can hide blank pages. No page is automatically deleted.',faq:[['Will it delete pages?','No. Review and remove candidates yourself in Organize.'],['Does this change the original?','No. An unchanged single PDF keeps its original bytes.']]},
  workflow:{steps:['Choose PDF files for the selected sequence. Merge requires two or more files.','Choose a preset or arrange custom steps before exporting; rotate uses 90 degrees clockwise.','Export once, inspect the result and keep your originals for recovery.'],useCase:'Complete common sequences without downloading and reopening each intermediate result.',checks:'Compact does not guarantee savings. Clear metadata removes standard properties, not all hidden or visible personal information. Unsupported form page copying stops safely; flatten forms first when needed.',faq:[['Can I cancel?','Stop requests are checked between supported processing steps. Some library calls finish before stopping.'],['Will a failed sequence replace my workspace?','No. Only the final result is returned; originals remain in the workspace.']]},
  reader:{steps:['Choose a PDF and read its first page.','Choose single-page, continuous or wide-screen two-page viewing; use search or the outline to navigate.','Download the original when unchanged, or switch to Edit or Sign with the same workspace.'],useCase:'Read a document locally without installing an application.',checks:'View rotation and zoom do not alter document bytes. Extracted text can have an incorrect reading order in untagged documents. The Reader prompts for a password for protected files. Reading retains the encrypted source; use Remove password explicitly before editing.',faq:[['Can I search a scan?','Image-only pages have no searchable text. Run OCR first.'],['Does reading alter my file?','No. A single unchanged PDF is returned byte-for-byte. Workspace edits are exported into the reader copy.']]},
  merge: {
    steps: ['Choose two or more PDF files. Add additional files from the workspace if needed.', 'Review the thumbnails and arrange pages in the order you want. Use movement buttons as an alternative to dragging.', 'Export the combined PDF, check the first and last pages of each source, then download.'],
    useCase: 'Combine application documents, receipts or lecture notes into one file. Merge keeps pages together; use Split when you only need selected pages.',
    checks: 'Check page order and orientation. Combining already compressed files usually increases the total size rather than reducing it. Exporting a signed PDF may invalidate its original cryptographic signatures.',
    faq: [['Can I change the order?', 'Yes. Arrange pages in the shared workspace before exporting.'], ['Does merging compress the files?', 'No. Use Compress after merging if you also need a smaller output.']]
  },
  split: {
    steps: ['Open the source PDF and review its page thumbnails.', 'Enter the required pages in Pages to extract, for example 1, 3-5. Use a normal hyphen and the physical page positions.', 'Choose Extract selected pages, reopen the result and confirm that it contains only the pages you need.'],
    useCase: 'Extract one chapter, an invoice or a section of a longer document. Use Organize for visual reordering and deleting pages.',
    checks: 'Page numbers refer to positions in the file, which may differ from numbers printed on the pages. Extracting pages does not redact sensitive content within a retained page.',
    faq: [['Will the original PDF change?', 'No. Export creates a separate result. Keep your original as a backup.'], ['Can I remove sensitive text this way?', 'Only whole excluded pages are omitted. Use Redact for sensitive regions on pages you retain.']]
  },
  compress: {
    steps: ['Open your PDF and note its original size.', 'Choose compact mode to retain PDF text and links, or an image-based quality option when those features are less important.', 'Process the file, compare the sizes and inspect small text and images before downloading.'],
    useCase: 'Prepare attachments for a portal or email size limit. A PDF that already contains optimized images may not become smaller.',
    checks: 'Image-based modes rebuild pages and can remove selectable text, links and forms. Check readability at normal zoom. Keep the original if the result is larger or the quality is insufficient.',
    faq: [['Is compression lossless?', 'Compact mode retains PDF content. JPEG optimization keeps document structure but reduces supported image quality. Whole-page image modes can lose text, links and forms.'], ['Why is the result not smaller?', 'The source may already be optimized. Reduction depends on its content and the selected mode.']]
  },
  'native-text': {
    steps: ['Open a PDF. Select an existing text object on the page.', 'Enter a short replacement and preview the changed PDF. Use characters supported by the available font and keep the replacement within its bounds.', 'Keep the edited document in the workspace or export it. Reopen the output and inspect each changed line.'],
    useCase: 'Correct a short label, date or typo in a PDF containing real text objects. Use Add text for a new note; it does not replace underlying text.',
    checks: 'Compatible paragraphs wrap inside their selected area. Font fallback can change appearance; upload a suitable TTF/OTF when needed. Scans use explicit OCR reconstruction, which flattens the edited page background. Review the exported PDF. Text removal is not secure redaction.',
    faq: [['Why can I not select a sentence?', 'It may be a scan, outlined artwork or clipped text. Use recognition to review and reconstruct a scanned region. Some clipping and transparency cannot be edited safely.'], ['Does this edit the original text?', 'Native edits replace supported original PDF text objects. OCR reconstruction uses an image background with editable replacement text and is labelled separately.']]
  },
  sign: {
    steps: ['Open the PDF, enter your name below Organize pages, then choose Create signature. Use Type, Draw or Upload in the popup.', 'Drag the signature, name, initials, date, custom text or uploaded image/stamp onto the PDF. Dates default to DD/MM/YYYY. Move and resize the placed field.', 'Export and reopen the PDF to confirm that the signature is on the intended page and does not cover important text.'],
    useCase: 'Place a visual signature on a document when the recipient accepts this method. Confirm the recipient’s requirements before submitting.',
    checks: 'A signature image is not certificate-based digital signing or identity verification. Use a transparent image when possible and inspect the output before sharing.',
    faq: [['Can I upload my signature?', 'Yes. Choose the image-upload option in the signature controls.'], ['Is this cryptographic signing?', 'No. The tool places a visual signature; it does not issue a certificate or verify identity.']]
  },
  scan: {
    steps: ['Open Scan to PDF on your phone and tap Take a photo. Hold the phone straight above the page, in good light, with the whole page in the frame.', 'Take another photo for each page. Reorder or delete pages in the workspace; use Rotate if a photo came out sideways.', 'Export the PDF, zoom in to check the smallest writing, then download it.'],
    useCase: 'Turn signed forms, receipts, ID copies or handwritten notes into one PDF without installing a scanner app. Photos stay on your device.',
    checks: 'Each photo becomes one page. Review manual crop, straightening or four-corner perspective correction before applying; automatic edge detection is not included. Text is not recognized; run Make a PDF searchable afterwards if you need selectable text. Large camera photos can make the PDF big; use Compress PDF if a portal has a size limit.',
    faq: [['Does Scan to PDF upload my photos?', 'No. Photos are read and assembled into a PDF inside your browser.'], ['Can it straighten or crop the page automatically?', 'Automatic correction is not included. Use Review crop and straighten for manual cropping, rotation or four-corner perspective correction; preview before applying.']]
  },
  images: {
    steps: ['Choose JPG, PNG or WebP images.', 'Review the resulting pages and arrange their order in the workspace.', 'Export the PDF and check orientation, margins and small details before downloading.'],
    useCase: 'Combine photographed notes, receipts or scanned images into one PDF. This creates image pages rather than searchable text.',
    checks: 'Very large images use substantial browser memory. Reduce their dimensions first if necessary. Use OCR afterwards when you need searchable text.',
    faq: [['Can I use PNG as well as JPG?', 'Yes. JPG, PNG and WebP inputs are supported.'], ['Will the PDF text be selectable?', 'Image conversion alone does not recognize text. OCR is a separate operation.']]
  },
  organize: {
    steps: ['Open the PDF and inspect the page thumbnails.', 'Reorder, rotate, duplicate or delete pages. Use the labeled page buttons when dragging is inconvenient.', 'Export and reopen the document to check the final order and page count.'],
    useCase: 'Fix a scan with sideways pages or assemble only the pages you need. Undo and redo apply to supported workspace changes.',
    checks: 'Deleting a whole page differs from securely removing a region within a page. Review all pages before sharing, especially after duplication or deletion.',
    faq: [['Do I have to drag pages?', 'No. Page movement buttons provide an alternative.'], ['Can I continue with another tool?', 'Compatible tools reuse the shared document. Export important work before leaving the site.']]
  },
  ocr: {
    steps: ['Open a scanned PDF with legible text in a supported language.', 'Run recognition. The first use downloads a recognition model, so an internet connection is needed for that download.', 'Export the searchable PDF and check names, dates and numbers by searching or copying text.'],
    useCase: 'Make scanned notes or documents searchable. Recognition adds an invisible text layer to rendered pages.',
    checks: 'Recognition accuracy depends on scan quality. English, French, German, Spanish, Italian and Portuguese are selectable. OCR does not recreate a Word document or make image text directly editable.',
    faq: [['Does OCR upload my PDF?', 'Recognition runs in the browser; model assets are downloaded separately.'], ['Are other languages supported?', 'Choose English, French, German, Spanish, Italian or Portuguese. Indian scripts and arbitrary Unicode embedding are not yet supported. Review the result.']]
  },
  redact: {
    steps: ['Open the PDF and mark each sensitive region carefully.', 'Export the redacted document. Pages are rebuilt as images with the marked regions removed.', 'Inspect every affected page and verify that sensitive content cannot be selected or found in the result before sharing.'],
    useCase: 'Remove visible sensitive regions while discarding the original text, forms, links and metadata in the exported reconstruction.',
    checks: 'An ordinary black shape is not redaction. This operation rasterizes all pages and loses searchable text and interactive features. Review region edges, other pages and visible identifying information.',
    faq: [['Is a black rectangle enough?', 'No. A normal overlay may leave underlying content intact. Use the dedicated Redact export.'], ['Will forms and selectable text remain?', 'No. This implementation rebuilds pages as images and discards those original features.']]
  },
  form: {
    steps: ['Open the original PDF containing fillable fields.', 'Complete supported text fields, checkboxes and dropdowns. Review all fields before export.', 'Choose an editable or flattened output, then reopen it and confirm the saved values.'],
    useCase: 'Complete supported PDF forms without printing. Use Add text when the PDF has no fillable fields.',
    checks: 'Unsupported form types may not work. Flattening makes the completed values static, so keep an editable copy if you will need to revise them.',
    faq: [['Why are there no fields?', 'The PDF may be a scan or a static form without interactive fields.'], ['What does flatten mean?', 'Flattening makes field values part of the page appearance rather than editable form controls.']]
  }
};

// Individually reviewed instructions for the remaining catalogue operations.
const additional: Record<string, [string,string,string,string]> = {
  "bookmarks": [
    "Enter one page number and bookmark title per line, using positions in the file.",
    "Review the before/after outline, choose Append or Replace, then export.",
    "Navigate reports or chapters without scrolling through every page.",
    "New entries append by default; choose Replace existing bookmarks to remove the previous outline. Check bookmark destinations in a reader that displays PDF outlines."
  ],
  "halve": [
    "Open the PDF and inspect whether the content is arranged in left and right halves.",
    "Export two halves per source page and check their reading order.",
    "Separate side-by-side scans for easier reading.",
    "Cropping hides content outside boundaries; it is not secure removal."
  ],
  "viewer": [
    "Choose the available single-page or two-column reader preference.",
    "Export and open the PDF in your preferred reader.",
    "Set a preferred reading layout for a document.",
    "This sets a viewer preference, not a permanent redesign. Readers may ignore it."
  ],
  "remove-annotations": [
    "Use the original single PDF before making other workspace changes.",
    "Export the cleaned copy and inspect comments, stamps, highlights and links.",
    "Prepare a copy without non-form annotations.",
    "Form widgets are preserved. Graphics already flattened into page content cannot be removed as annotations."
  ],
  "create-form": [
    "Enter an English label on each line, up to 60 labels of 80 characters.",
    "Create the A4 form, fill a sample field and inspect the export.",
    "Build a simple questionnaire with new text fields.",
    "Creates a new form. It does not place arbitrary field types on an existing PDF."
  ],
  "split-all": [
    "Review the PDF page count before splitting.",
    "Export the ZIP and open several individual PDFs to check the page sequence.",
    "Send individual pages as separate documents.",
    "The result is an archive of single-page PDFs. Unzip it before opening a PDF in a reader."
  ],
  "rotate": [
    "Choose a rotation angle and inspect the workspace orientation.",
    "Export the PDF and check portrait and landscape pages.",
    "Fix sideways pages in scanned documents.",
    "Rotation changes display orientation. Use Organize when only selected pages should rotate."
  ],
  "reverse": [
    "Confirm that reversing the entire document matches your intended order.",
    "Export and check that the original last page is now first.",
    "Correct scans captured backwards.",
    "The operation reverses every page. Use Organize for a custom order instead."
  ],
  "duplicate": [
    "Check the original page count.",
    "Export and verify the order of repeated pages.",
    "Create repeated page copies for document preparation.",
    "Page duplication increases the page count and file size."
  ],
  "interleave": [
    "Choose the PDFs you want to alternate and check their starting order.",
    "Export and inspect transitions between each source document.",
    "Combine separately scanned fronts and backs of pages.",
    "Check the result when inputs have unequal page counts. Use Merge for consecutive documents rather than alternation."
  ],
  "nup": [
    "Choose two or four pages per sheet.",
    "Export and inspect small text at the intended print size.",
    "Make a compact handout or reduce the number of printed sheets.",
    "Multiple pages on one sheet reduce their visible size. Use Resize for one page on each A4 sheet."
  ],
  "crop": [
    "Choose the margin to trim and inspect content near every edge.",
    "Export and check that useful text is not clipped.",
    "Reduce unwanted white borders around a document.",
    "Crop boundaries hide content; they do not securely erase it. Use Redact for sensitive regions."
  ],
  "resize": [
    "Inspect the page orientations before fitting them to A4.",
    "Export and check margins and scaling on mixed-size pages.",
    "Prepare a document for standard A4 printing.",
    "Scaling may make small text harder to read. It does not reflow paragraphs."
  ],
  "flip": [
    "Confirm that a horizontal mirror is what you need.",
    "Export and check the orientation of text and artwork.",
    "Mirror artwork or correct a mirrored page image.",
    "Mirrored text reads backwards. This is different from rotating a sideways page."
  ],
  "edit": [
    "Choose text, an image, highlight, shape or link and place it on the page.",
    "Export and inspect each added element at normal zoom.",
    "Annotate a document or add information to a static form.",
    "Adds new elements over page content. Use Edit existing text for supported text-object replacements and Redact for secure removal."
  ],
  "watermark": [
    "Enter the watermark text and inspect its placement.",
    "Export and check readability on pages with different orientations.",
    "Label copies with a visible draft or ownership notice.",
    "A watermark is a visual label, not encryption or an access-control mechanism."
  ],
  "numbers": [
    "Choose the starting number for the sequence.",
    "Export and check that numbering does not cover source text.",
    "Add consistent page references to a report.",
    "Workspace page positions can differ from printed page numbers. Check the exported sequence."
  ],
  "bates": [
    "Enter the prefix and starting number for your identifiers.",
    "Export and check the first and last identifiers.",
    "Give pages sequential reference labels.",
    "These are visual identifiers, not proof of authenticity. Check the labeling requirements of the recipient."
  ],
  "headers": [
    "Enter the header or footer label in the available controls.",
    "Export and inspect margins on every page orientation.",
    "Label a document with a repeating title or reference.",
    "Labels may overlap content near page edges. Reopen the output before sharing."
  ],
  "flatten": [
    "Review whether you still need selectable text, links or interactive forms.",
    "Choose form-field mode to retain text, or image mode to flatten the entire appearance.",
    "Make filled form fields read-only or create static image pages.",
    "Form-field mode preserves selectable text and makes form fields read-only. Image mode removes searchable text, links and editable forms, and may enlarge the file."
  ],
  "metadata": [
    "Enter the title, author or subject you want in the document properties.",
    "Export and inspect properties in another reader.",
    "Correct standard document information.",
    "Metadata changes do not remove visible personal information. Use Remove metadata when you need those standard fields cleared."
  ],
  "jpg": [
    "Choose a resolution suitable for screen viewing or printing.",
    "Export the ZIP and inspect the JPG images after extracting it.",
    "Share PDF pages in an image format.",
    "JPG is lossy and does not contain selectable text. Higher resolution uses more memory."
  ],
  "png": [
    "Choose 72, 144 or 288 DPI according to your intended use.",
    "Export the ZIP and inspect the extracted PNG images.",
    "Create page images without JPG compression artifacts.",
    "PNG preserves rendered pixels, not editable PDF objects. High resolution may produce large files."
  ],
  "text": [
    "Use a PDF containing selectable text; run OCR first for a scan.",
    "Export the TXT file and check reading order and missing sections.",
    "Copy document text into a plain-text workflow.",
    "Columns and positioned text may come out in an unexpected order. Images and layout are not preserved."
  ],
  "word": [
    "Use a text PDF, or run OCR first when the source is a scan.",
    "Export the DOCX and review paragraphs, numbers and reading order.",
    "Move extracted PDF text into a Word document for further writing.",
    "This is text conversion. Original layout, tables and embedded images are not faithfully reconstructed."
  ],
  "html": [
    "Open a PDF with selectable text.",
    "Export the HTML and review its text in a browser.",
    "Make extracted document text readable as a webpage.",
    "The output is text-based. Original page styling, images and interactive PDF features are not retained."
  ],
  "epub": [
    "Use a PDF with readable text in a sensible reading order.",
    "Export the EPUB and inspect several chapters in an e-reader.",
    "Read extracted PDF text in a reflowable format.",
    "Complex page layouts and illustrations are not preserved. Review columns and headings."
  ],
  "pptx": [
    "Review the page order you want as slides.",
    "Export the PPTX and inspect slide dimensions and readability.",
    "Present PDF pages as slides.",
    "Each page becomes an image. Original text and graphics are not separately editable on the slides."
  ],
  "xlsx": [
    "Use a PDF with selectable text rows; run OCR first for scans.",
    "Export the XLSX and check every column and numeric value.",
    "Move simple text rows into a spreadsheet.",
    "Extraction uses heuristics. It does not guarantee original tables, formulas or column alignment."
  ],
  "csv": [
    "Use selectable PDF text with consistent rows.",
    "Export the CSV and check row and column separation.",
    "Import extracted rows into a spreadsheet or another data tool.",
    "Review amounts, dates and delimiters. Original formulas and cell formatting are not available from PDF text."
  ],
  "create": [
    "Write the text for your new document in the editor.",
    "Create the PDF and inspect line wrapping and page breaks.",
    "Produce a simple PDF from written text.",
    "This creates a text document, not a full desktop publishing layout. Keep a copy of the source text."
  ],
  "markdown": [
    "Enter Markdown text using supported headings and lists.",
    "Export and inspect the rendered headings and page breaks.",
    "Convert simple structured notes to a readable PDF.",
    "Complex tables and embedded images are unsupported. Review the result instead of assuming every Markdown extension works."
  ],
  "docx": [
    "Choose a DOCX file containing the text you want to convert.",
    "Export and inspect paragraph order and page breaks.",
    "Create a PDF from Word document text.",
    "Text is reflowed. Original layout, images and complex styling are not preserved; legacy DOC files are unsupported."
  ],
  "sheet": [
    "Choose an XLSX, XLS or CSV input and check which sheet contains your data.",
    "Export and inspect the printed text rows.",
    "Create a simple PDF view of spreadsheet rows.",
    "Choose sheets in the action panel; all sheets are selected by default. Charts, images, complex styling and original print layout are not preserved."
  ],
  "ebook": [
    "Choose an EPUB containing readable book text.",
    "Export and inspect the reading order and page breaks.",
    "Make a text-based PDF copy of an EPUB.",
    "Illustrations and ebook styling are not preserved. Unsupported or protected EPUB files may fail."
  ],
  "grayscale": [
    "Review whether your content relies on color distinctions.",
    "Export and inspect graphs, highlights and small text.",
    "Create a black-and-white page appearance.",
    "Pages are rebuilt as images; text search, links and forms are lost. Similar colors can become hard to distinguish."
  ],
  "invert": [
    "Review the source pages before changing their colors.",
    "Export and inspect photographs, diagrams and text contrast.",
    "Create an inverted page appearance for a specific document.",
    "This modifies the document, unlike the website dark theme. Rasterization removes text search, links and forms."
  ],
  "audio": [
    "Open a PDF with selectable text and choose an available browser voice.",
    "Start playback and use the available stop controls when needed.",
    "Listen to extracted text while reviewing a document.",
    "There is no audio-file export. Network behavior and offline availability depend on the selected browser voice."
  ],
  "compare": [
    "Choose two PDFs and inspect corresponding pages side by side.",
    "Review differences visually, including dates, numbers and missing pages.",
    "Compare versions of a document.",
    "This is a comparison workspace, not guaranteed automatic semantic or legal difference detection."
  ],
  "encrypt": [
    "Choose an opening password of at least eight characters.",
    "Export the encrypted PDF and reopen it using that password.",
    "Require an opening password for a copy of your document.",
    "Keep the password safely and share it separately. There is no password recovery service."
  ],
  "decrypt": [
    "Choose the protected PDF and enter a password you know.",
    "Export the unlocked copy and confirm it opens without prompting.",
    "Remove an opening password from a document you are authorized to use.",
    "The correct password is required. This does not bypass unknown passwords or access permissions."
  ],
  "privacy": [
    "Open a PDF with readable text and review the metadata and pattern findings.",
    "Inspect each finding against the original document before deciding what to remove.",
    "Check common patterns and standard document properties before sharing.",
    "Pattern matching can miss sensitive information and flag harmless text. It is not a complete security audit."
  ],
  "clean": [
    "Review which standard document properties need clearing.",
    "Export and check title, author, subject and other standard properties.",
    "Remove standard identifying metadata.",
    "This is not complete sanitization of attachments, hidden objects or visible personal details."
  ],
  "hash": [
    "Choose the PDF whose exact bytes you want to identify.",
    "Calculate the SHA-256 value and copy it for comparison.",
    "Check whether two file copies have identical bytes.",
    "Any byte change alters the hash. A matching hash does not identify the author or verify a digital signature."
  ],
  "zip": [
    "Choose the PDF files to include in one archive.",
    "Download the ZIP and check that all intended files are present.",
    "Package several PDFs for a single download.",
    "ZIP packaging does not merge pages into a PDF or necessarily reduce the size of already compressed files."
  ],
  "repair": [
    "Choose a PDF that can still be parsed by the browser engine.",
    "Export the rebuilt copy and check all pages in an independent reader.",
    "Resave a readable PDF structure as a new file.",
    "Severely damaged documents may not be recoverable. Successful parsing is not a guarantee that all original content survives."
  ]
};
for (const [id, [configure, finish, useCase, checks]] of Object.entries(additional)) {
  toolGuidance[id] = {
    steps: [(['create','markdown','create-form'].includes(id) ? 'Enter the content for your new document.' : 'Choose the supported source file or files from your device.'), configure, finish],
    useCase, checks,
    faq: [['What is this tool useful for?', useCase], ['What should I check in the result?', checks]]
  };
}

toolGuidance.edit.steps = [
 'Choose your PDF. On a phone, the editing tools are attached below the main header. Tap Text, then tap the page where the text should go; typing starts after placement.',
 'Select an element to change its colour, font or other supported properties in the second row. Use the dustbin to delete it or the green tick to finish. Open the toolbar zoom control for zoom and Fit width; the + button adds PDF files.',
 'Scroll through the pages, then choose Export PDF. The export bar is hidden while on-page text has focus; finish typing to bring it back. Reopen the download and inspect each change.'
];
toolGuidance.edit.faq.push(
 ['Where are zoom and Options on mobile?', 'Both are in the attached editing toolbar. Open the zoom control for Zoom out, Fit width and Zoom in. Options opens the additional tool choices.'],
 ['How do I remove added text or a sketch?', 'Select the added element and use the dustbin beside the green tick. This removes the added element, not underlying PDF content.']
);

toolGuidance.reader.steps=['Choose your PDF. On a phone, pages scroll continuously below the attached reading toolbar.','Use the page-number field to jump, the zoom control to fit the page width, or Search and reading options for text search, the outline and bookmarks. The + button adds PDF files.','Read without exporting. On desktop, the existing reading views and download controls remain available. View rotation does not change the PDF.'];
toolGuidance.rotate.steps=['Choose your PDF and tap Rotate under the page that needs turning. Each tap turns that page clockwise by 90 degrees.','On a phone, Add PDFs and Undo/Redo are attached below the header. Open More rotation options for Rotate all pages or page numbers such as 1, 3-5.','Choose Save rotated PDF, download the result and inspect the orientation of every changed page.'];
toolGuidance["add-blank-pages"]={"steps": ["Open your PDF.", "Choose where the blank pages go: the end, the start, after pages you list, or after every N pages.", "Set how many blank pages to add at each spot and whether they match the neighbouring page or use A4 or Letter.", "Add the pages, then check the page count in the result."], "useCase": "Leave room for handwritten notes, separate chapters when printing, or add a blank back page so double-sided printing starts each section on a fresh sheet.", "checks": "Open the result and look at the pages around each insertion. The report lists how many blank pages were added and the new page count.", "faq": [["Can I add a blank page after every page?", "Yes. Choose After every N pages and enter 1. Each original page is followed by a blank one."], ["What size are the blank pages?", "By default each blank page copies the page before it. You can force A4 or US Letter instead."], ["Will bookmarks and links still work?", "Yes. The tool inserts pages without rebuilding the document, so existing bookmarks, links and form fields stay in place."]]};
toolGuidance["split-by-page-count"]={"steps": ["Open your PDF.", "Choose Pages per file or Number of equal files, then enter the value.", "Press Split into files.", "Unzip the download and check the page ranges in the file names."], "useCase": "Break a 200-page scan into 20-page chapters, stay under an email or portal size limit, or hand each reviewer an equal share of a long document.", "checks": "The report states how many files were made and the pages per file. Open the first and last part to confirm the ranges.", "faq": [["What happens when the pages do not divide evenly?", "The last file simply has fewer pages. For 25 pages split every 10, you get files of 10, 10 and 5 pages."], ["Can I split into a set number of files instead?", "Yes. Choose Number of equal files, enter how many you want, and the page count per file is worked out for you."], ["How is this different from Split PDF?", "Split PDF extracts ranges you type. This tool cuts the whole document into even pieces automatically."]]};
toolGuidance["odd-even-pages"]={"steps": ["Open your PDF.", "Choose Odd pages, Even pages or Both as two PDFs.", "Tick Reverse the order if you will print the second side by hand.", "Extract the pages and download the PDF or ZIP."], "useCase": "Print double-sided on a single-sided printer, separate the fronts and backs of a scanned stack, or pull alternate pages from a combined document.", "checks": "The report shows how many pages each file holds. Open the result and confirm the first page number you expect.", "faq": [["How do I print double-sided on a single-sided printer?", "Print the odd pages, flip the stack and feed it back, then print the even pages with Reverse the order ticked so they land on the right backs."], ["What does Both do?", "You get two PDFs in a ZIP, one with the odd pages and one with the even pages."], ["Do odd and even refer to printed page labels?", "No. They refer to the position of the page in the file, starting from 1."]]};
toolGuidance["add-page-border"]={"steps": ["Open your PDF.", "Pick the pages, colour, line width, distance from the edge and style.", "Add the border.", "Open the result and check that the border clears any content near the edge."], "useCase": "Frame certificates, flyers and worksheets, mark printed pages that tend to blur into the paper edge, or give scanned pages a clean outline.", "checks": "Look at the page corners and any text near the edge. If the line touches content, increase the distance from the edge and run it again on the original.", "faq": [["Can I put the border on some pages only?", "Yes. Enter page numbers such as 1, 3-5 or leave the field empty for every page."], ["Will the border cover my content?", "It is a thin line at the distance you set. Use a larger distance if the page has content near its edges."], ["Can I remove the border later?", "Not with this tool. Keep your original file and run the tool on the original again with new settings."]]};
toolGuidance["add-pdf-margins"]={"steps": ["Open your PDF.", "Choose Make each page bigger or Keep the page size, and enter the margin on each side in millimetres.", "Optionally limit the change to some pages.", "Add the margins and check the result in a PDF viewer."], "useCase": "Leave space for binding or hole punches, add room for handwritten notes, or stop a scan that runs to the edge from being clipped by a printer.", "checks": "Check that the content looks centred where you expect and that nothing was clipped. For a bound document, compare the inner and outer margins.", "faq": [["Which option should I use for printing?", "Use Keep the page size when the paper size must stay A4 or Letter. Use Make each page bigger when you only need space on screen or the final size does not matter."], ["Do links and form fields still work?", "When you enlarge pages, yes. When you shrink the content, links and form fields on those pages are not carried over."], ["Can I set different margins per side?", "Yes. Top, right, bottom and left are set separately, in millimetres."]]};
toolGuidance["extract-pdf-attachments"]={"steps": ["Open the PDF that has attachments.", "Press Extract attachments.", "Download the ZIP and unzip it.", "Scan files you do not recognise with your own antivirus before opening them."], "useCase": "Recover the original spreadsheet from a report, pull the XML from an electronic invoice, or check what a PDF is carrying before you share it.", "checks": "The report lists each file name and size. If it says none were found, the PDF has no embedded files this tool can read.", "faq": [["Why does it say no embedded files were found?", "Most PDFs have none. Attachments are separate from the page content, so text and images you see on the pages are not attachments."], ["Is it safe to open the extracted files?", "The tool never opens or runs them. Treat them like any download and scan files from unknown senders before opening."], ["Can I remove attachments instead?", "Yes. Use Remove embedded files to save a copy of the PDF without them."]]};
toolGuidance["insert-pdf-pages"]={"steps": ["Open the PDF that will receive the pages.", "Add the second PDF using the extra file box.", "Set the page to insert after (0 means the very start) and optionally a page range from the second file.", "Insert the pages and open the result to check the order."], "useCase": "Slot a signed cover page into a contract, add an appendix in the middle of a report, or drop a replacement page into an existing file.", "checks": "The report names the file, how many pages were added and the new page count. Open the result and look at the pages around the join.", "faq": [["Can I insert only some pages of the second PDF?", "Yes. Enter a range such as 1, 3-5 and only those pages are inserted."], ["How do I add pages at the very start?", "Set Insert after page to 0. To add at the end, use the last page number of your document."], ["Does this change my original files?", "No. Both files are read in your browser and a new PDF is saved as the result."]]};
toolGuidance["overlay-pdf"]={"steps": ["Open the base PDF.", "Add the PDF to lay on top.", "Choose which overlay page to use, the opacity and the pages to cover.", "Run the overlay and check the result."], "useCase": "Add a printed form grid over a scan, mark up drawings with a transparent layer, or stamp a diagram on every page.", "checks": "Zoom into one page of the result to see both layers. The report says how many pages were covered.", "faq": [["Can the overlay be see-through?", "Yes. Set opacity from 5 to 100 percent."], ["What if the overlay has fewer pages?", "Choose Repeat all its pages in turn, or use the first page on every page."], ["Is the original text still there?", "Yes. The overlay is added on top and the original content is not removed."]]};
toolGuidance["add-pdf-background"]={"steps": ["Open your document.", "Add the letterhead or background PDF.", "Choose the background page to use and which pages get it.", "Apply it and check the result."], "useCase": "Put company stationery behind a plain export, add a branded template to invoices, or place ruled paper behind notes.", "checks": "Look at the top and bottom of the first page. The report lists how many pages received the background.", "faq": [["Does the background cover my text?", "No. It is inserted underneath the page content, so text stays on top."], ["Can each page get a different background?", "Yes. Choose Page by page and page 1 goes behind page 1, page 2 behind page 2."], ["Will form fields and links still work?", "Yes. Only a layer is added behind the page. Fields and links are not touched."]]};
toolGuidance["stamp-pdf"]={"steps": ["Open your PDF.", "Pick a ready stamp or type custom text.", "Set colour, size, position, rotation and the pages to mark.", "Apply the stamp and check each page."], "useCase": "Mark a contract as Draft while it is reviewed, stamp invoices as Paid, or label internal documents Confidential.", "checks": "Open the result and confirm the stamp does not hide text. The report lists the stamped pages.", "faq": [["Can I use my own wording?", "Yes. Choose custom and type your own text."], ["Can I stamp only some pages?", "Yes. List pages such as 1, 3-5 or leave it empty for all."], ["Can the stamp be removed later?", "It is drawn into the page, so it needs a PDF editor to remove. Keep your original file."]]};
toolGuidance["add-logo-to-pdf"]={"steps": ["Open your PDF.", "Add the logo image.", "Choose the position, width, opacity and pages.", "Apply and check the corners of each page."], "useCase": "Brand a proposal with your logo, add a school crest to handouts, or put a small mark on every page of a report.", "checks": "Zoom into the corner you picked on a few pages. The report lists the pages that received the logo.", "faq": [["Which image formats work?", "PNG and JPG. A PNG with a transparent background stays transparent."], ["Can the logo sit in the centre?", "Yes. Pick centre, or any of the four corners, and set a margin."], ["Will it work on landscape or rotated pages?", "Yes. Placement follows how the page looks on screen."]]};
toolGuidance["highlight-text-in-pdf"]={"steps": ["Open your PDF.", "Type the word or phrase to find.", "Pick a colour and whether to match case.", "Highlight and check the matches in the result."], "useCase": "Mark every mention of a name in a contract, flag key terms in a study, or highlight deadlines in a long notice.", "checks": "The report says how many matches were highlighted and on which pages. Scroll the result to see them.", "faq": [["Does it work on scanned PDFs?", "Only if the scan has a text layer. Run OCR first for image-only pages."], ["Is the highlight see-through?", "Yes. It uses multiply blending so the text stays dark and readable."], ["Can I match exact case?", "Yes. Turn on match case to ignore other capitalisation."]]};
toolGuidance["flatten-form-fields"]={"steps": ["Open the filled form.", "Check the field count in the settings.", "Flatten the form.", "Open the result and check every answer is still visible."], "useCase": "Send a completed form that must not be edited, archive a signed application, or make a form print the same everywhere.", "checks": "The report gives the number of flattened fields. Open the result and confirm the fields are no longer clickable.", "faq": [["Will my answers still show?", "Yes. They become part of the page and print as before."], ["Can I undo flattening?", "No. Keep the original fillable file if you may need to edit it."], ["What if my PDF has no form?", "The tool tells you there are no fillable fields and nothing is changed."]]};
toolGuidance["lock-form-fields"]={"steps": ["Open your form.", "Lock the fields.", "Open the result and try to type in a field."], "useCase": "Share a completed form for review, keep prefilled values from being changed by mistake, or hand out a form that only displays data.", "checks": "The report gives the number of locked fields. Try typing into one in a PDF reader.", "faq": [["Is this the same as a password?", "No. Read-only stops normal edits but is not encryption. Use Protect PDF for a password."], ["Can I still copy the values?", "Yes. The values stay readable and copyable."], ["How is it different from flatten?", "Flatten removes the fields. Lock keeps the fields but turns off editing."]]};
toolGuidance["export-pdf-form-data"]={"steps": ["Open a filled PDF form.", "Choose JSON or CSV.", "Export and open the downloaded file."], "useCase": "Move survey answers into a spreadsheet, check what was typed in a long form, or feed form data into another tool.", "checks": "The report gives the number of fields exported. Open the file and compare a few values with the PDF.", "faq": [["Which format should I pick?", "CSV opens in Excel or Sheets. JSON suits developers and scripts."], ["Are checkboxes included?", "Yes. They show as true or false, and radio groups show the selected option."], ["What if there are no fields?", "You get a clear message that the PDF has no fillable form fields."]]};
