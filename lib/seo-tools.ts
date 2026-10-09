import {canonicalToolRoutes} from './canonical-routes';
import { tools } from './tools';

const curatedTools = [
  {
    "slug": "merge-pdf",
    "id": "merge",
    "title": "Merge PDF files",
    "heading": "Combine multiple PDFs into one document",
    "intro": "Choose your PDFs, arrange their pages, then export one combined PDF.",
    "detail": "Drag pages into order or use the keyboard and page movement buttons. Review the result before downloading."
  },
  {
    "slug": "split-pdf",
    "id": "split",
    "title": "Split PDF files",
    "heading": "Extract the PDF pages you need",
    "intro": "Open a PDF and enter the pages or ranges you want to extract, such as 1, 3–5.",
    "detail": "Export a new PDF with your chosen pages. Your original file stays on your device."
  },
  {
    "slug": "compress-pdf",
    "id": "compress",
    "title": "Compress PDF files",
    "heading": "Reduce PDF size with clear quality choices",
    "intro": "Choose compact mode to preserve text and links, or use image-based quality choices for a smaller result.",
    "detail": "Compression depends on the source document. Compare the output size and inspect its quality before downloading. Image-based modes can remove selectable text and links."
  },
  {
    "slug": "organize-pdf",
    "id": "organize",
    "title": "Organize PDF pages",
    "heading": "Reorder, rotate, duplicate and delete pages",
    "intro": "Open a PDF to preview its pages, change their order and remove pages you do not need.",
    "detail": "Use drag and drop or accessible page movement buttons, then inspect and download the exported document."
  },
  {
    "slug": "sign-pdf",
    "id": "sign",
    "title": "Sign PDF documents",
    "heading": "Add a drawn, typed or uploaded signature",
    "intro": "Draw your signature, type your name or upload a signature image, then place it on the PDF.",
    "detail": "Adjust placement and size before exporting. This adds a visual signature; it is not certificate-based digital signing."
  },
  {
    "slug": "images-to-pdf",
    "id": "images",
    "title": "Images to PDF",
    "heading": "Turn JPG, PNG and WebP images into a PDF",
    "intro": "Choose supported images, arrange their order and export them together as a PDF document.",
    "detail": "Preview and organize the resulting pages in the shared workspace before downloading."
  },
  {
    "slug": "edit-pdf-text",
    "id": "native-text",
    "title": "Edit existing PDF text",
    "heading": "Change the original text in a PDF",
    "intro": "Choose a text object on the page, enter your replacement and preview the actual changed PDF.",
    "detail": "Click existing text and type on the PDF. Compatible aligned paragraphs wrap within their existing lines at the original font size. Edits apply when you leave the text; Undo restores applied changes. Single lines can shrink to half size. Embedded fonts need available characters; scans, mixed-font paragraphs, extra-line reflow and nested graphics are not supported."
  },
  {
    "slug": "fill-pdf-forms",
    "id": "form",
    "title": "Fill PDF forms",
    "heading": "Complete text fields, checkboxes and dropdowns",
    "intro": "Open a PDF containing fillable fields, complete its supported fields and export the result.",
    "detail": "Use the original PDF for form filling. Unsupported form types are identified. You can keep fields editable or flatten the completed form."
  },
  {
    "slug": "create-fillable-pdf",
    "id": "create-form",
    "title": "Create a fillable PDF",
    "heading": "Build a form from your field labels",
    "intro": "Enter an English label on each line to create a new PDF with fillable text fields.",
    "detail": "Supports up to 60 labels of 80 characters. This creates a new A4 form; it does not place arbitrary field types on an existing PDF."
  },
  {
    "slug": "rotate-pdf",
    "id": "rotate",
    "title": "Rotate PDF pages",
    "heading": "Fix sideways PDF pages",
    "intro": "Choose a rotation and export the PDF. You can also rotate selected pages in the workspace.",
    "detail": "Original page content remains in PDF form; rotation changes its display orientation."
  },
  {
    "slug": "pdf-to-jpg",
    "id": "jpg",
    "title": "PDF to JPG",
    "heading": "Download PDF pages as JPG images",
    "intro": "Choose a resolution, process your PDF and download each page as a JPG image in a ZIP.",
    "detail": "The output contains page images. Text is not separately editable in a JPG."
  },
  {
    "slug": "pdf-to-png",
    "id": "png",
    "title": "PDF to PNG",
    "heading": "Export PDF pages as PNG images",
    "intro": "Convert the pages in your current workspace into PNG files, packaged as a ZIP.",
    "detail": "Choose 72, 144 or 288 DPI. Higher resolutions use more memory."
  },
  {
    "slug": "ocr-pdf",
    "id": "ocr",
    "title": "Make a PDF searchable",
    "heading": "Recognize text in scanned pages",
    "intro": "Choose a supported language and add an invisible searchable text layer to scanned PDF pages.",
    "detail": "The first run downloads a recognition model. Accuracy varies; review names, numbers and important text. Choose English, French, German, Spanish, Italian or Portuguese. Unsupported searchable characters are reported in the export result."
  },
  {
    "slug": "protect-pdf",
    "id": "encrypt",
    "title": "Password protect a PDF",
    "heading": "Add an opening password to a PDF",
    "intro": "Choose a password of at least eight characters and export an AES-256 protected PDF.",
    "detail": "Keep the password safe. Recipients need it to open the document. Processing runs in your browser."
  },
  {
    "slug": "unlock-pdf",
    "id": "decrypt",
    "title": "Remove a PDF password",
    "heading": "Unlock a document you are authorized to use",
    "intro": "Enter the existing password, remove protection and download an unlocked copy.",
    "detail": "A correct password is required. This tool does not bypass passwords or access permissions."
  },
  {
    "slug": "redact-pdf",
    "id": "redact",
    "title": "Redact PDF regions",
    "heading": "Remove sensitive regions from the exported document",
    "intro": "Mark areas to redact, export, then inspect the resulting PDF before sharing.",
    "detail": "All exported pages are rebuilt as images with the marked regions removed. Original text, links, forms and metadata are discarded; other visible content remains in the output."
  },
  {
    "slug": "add-pdf-bookmarks",
    "id": "bookmarks",
    "title": "Add PDF bookmarks",
    "heading": "Create a clickable document outline",
    "intro": "Enter a page number and title on each line, then export a PDF with bookmarks.",
    "detail": "Supports 100 bookmarks and valid page numbers. The exported outline replaces the previous outline."
  },
  {
    "slug": "split-pdf-in-half",
    "id": "halve",
    "title": "Split PDF pages in half",
    "heading": "Separate left and right page halves",
    "intro": "Split each page into two visible halves, useful for side-by-side scans.",
    "detail": "The operation uses page boundaries. It does not securely remove content hidden outside those boundaries."
  },
  {
    "slug": "remove-pdf-annotations",
    "id": "remove-annotations",
    "title": "Remove PDF annotations",
    "heading": "Remove comments, stamps, highlights and links",
    "intro": "Open an unchanged single PDF and export a copy with non-form annotations removed.",
    "detail": "Form widgets are preserved. Export other workspace changes first; annotation removal cannot undo graphics already flattened into page content."
  },
  {
    "slug": "add-page-numbers",
    "id": "numbers",
    "title": "Add PDF page numbers",
    "heading": "Number PDF pages in sequence",
    "intro": "Choose the starting number and export a copy with page numbers.",
    "detail": "Inspect the output to confirm the numbers do not overlap existing page content."
  },
  {
    "slug": "remove-pdf-metadata",
    "id": "clean",
    "title": "Remove PDF metadata",
    "heading": "Clear standard document properties",
    "intro": "Export a copy with standard title, author, subject, keywords, producer and date metadata cleared.",
    "detail": "This is not complete sanitization of every hidden object, attachment or visible personal detail. Inspect the document before sharing."
  }
] as const;

const curatedById = new Map<string, (typeof curatedTools)[number]>(curatedTools.map(tool => [tool.id, tool]));

/**
 * Keep the hand-written pages above, but never let a catalogue tool become an
 * orphan with no crawlable, shareable guide URL. New catalogue entries get an
 * honest baseline guide until their copy is expanded.
 */
export const seoTools = tools.map(tool => {
  const curated = curatedById.get(tool.id);
  if (curated) return { ...curated, group: tool.group };
  const stableSlugs:Record<string,string>={"sketch-pdf":"sketch-over-pdf","cut-collect":"pdf-cut-and-collect","fold-lab":"pdf-fold-lab","attachment-map":"pdf-attachment-map",create:"create-pdf",reader:"pdf-reader",viewer:"reader-layout",interleave:"alternate-and-mix",hash:"file-fingerprint",repair:"resave-pdf"};
  const slug = stableSlugs[tool.id] ?? tool.name
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return {
    slug,
    id: tool.id,
    title: tool.name,
    heading: tool.description.replace(/\.$/, ''),
    intro: `${tool.description} Configure the available options, inspect the result and download it from your browser.`,
    detail: tool.note ?? `This tool performs ${tool.name.toLowerCase()} in the shared PDF Studio workspace. Inspect the exported result before using it.`,
    group: tool.group,
  };
});

/** Keyword pages reuse real tools; no unsupported conversion is advertised. */
const keywordPages = [
 {slug:'text-to-pdf',id:'create',title:'Text to PDF',heading:'Convert text to a PDF in your browser',intro:'Type or paste text, or open a Unicode text file, choose a page size and font size, then create and inspect your PDF.',detail:'Text wraps onto new pages. Uses local Noto Sans; missing glyphs and unsupported encodings are rejected. Source formatting is not reconstructed.'},
 {slug:'txt-to-pdf',id:'create',title:'TXT to PDF',heading:'Turn a text file into a readable PDF',intro:'Open a UTF-8 text file or a UTF-16 file with a byte-order mark, review the text and export a PDF.',detail:'Review page breaks and characters before downloading. Unsupported encodings or font characters produce a clear error. Files are processed in this browser.'},
 {slug:'jpg-to-pdf',id:'images',title:'JPG to PDF',heading:'Combine JPG photos into a PDF',intro:'Choose JPG photos, review their orientation and arrange them into one PDF.',detail:'Useful for photographed receipts or notes. The same workspace also accepts PNG and WebP; image conversion does not recognize text.'},
 {slug:'png-to-pdf',id:'images',title:'PNG to PDF',heading:'Create a PDF from PNG images',intro:'Choose PNG screenshots or scans and arrange them into a PDF document.',detail:'Inspect transparency and margins in the exported page; searchable text requires a separate OCR step.'},
 {slug:'pdf-to-excel',id:'xlsx',title:'PDF to Excel',heading:'Extract PDF text rows into an Excel spreadsheet',intro:'Convert selectable PDF text rows to XLSX, then review column alignment in Excel.',detail:'This is heuristic text extraction. Original tables, formulas, images and formatting are not faithfully reconstructed. Scans need OCR first.'},
 {slug:'delete-pdf-pages',id:'organize',title:'Delete PDF pages',heading:'Remove unwanted pages from your PDF',intro:'Preview thumbnails, delete whole pages and export the remaining document.',detail:'Check the final page count and order. Deleting whole pages is different from redacting sensitive regions within a retained page.'},
 {slug:'extract-pdf-pages',id:'split',title:'Extract PDF pages',heading:'Save selected pages as a new PDF',intro:'Choose page positions or ranges and export only the pages you need.',detail:'Use file positions, such as 1, 3–5, rather than printed page labels. Reopen the exported selection before sending it.'},
 {slug:'pdf-editor',id:'edit',title:'Online PDF editor',heading:'Add text, images and annotations online',intro:'Annotate a PDF with new text, images, shapes, highlights and links in your browser.',detail:'This tool adds overlays. To replace supported original text objects, choose Edit existing text. A shape over sensitive text is not genuine redaction.'},
 {slug:'edit-cv-pdf',id:'native-text',title:'Edit CV PDF',heading:'Fix your CV or resume PDF without retyping it',intro:'Replace a supported single-line phone number, date, job title or typo in your CV PDF, inspect the result, and download without a watermark.',detail:'Works on PDFs with real, selectable text (for example exported from Word or Google Docs). Edits are single-line replacements; OCR can make a scanned CV searchable, but does not guarantee its original visible text can be edited.'},
 {slug:'compress-pdf-to-100kb',id:'compress',title:'Compress PDF to 100 KB',heading:'Get a PDF under 100 KB for forms and job portals',intro:'Shrink a PDF for upload limits such as 100 KB, 200 KB or 500 KB, check the result size, and try a stronger setting if needed.',detail:'There is no guaranteed target size: text-only PDFs may already be small, while photos and scans need an image quality option. The result shows the new size before you download.'},
].map(page=>({...page,group:tools.find(tool=>tool.id===page.id)!.group}));
export const seoPages=[...seoTools,...keywordPages].filter(page=>!canonicalToolRoutes[page.slug]);
