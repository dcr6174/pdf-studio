/** Task-specific instructions describe available controls, not promised fidelity. */
export type ToolGuidance = { steps: string[]; useCase: string; checks: string; faq: [string, string][] };
export const toolGuidance: Record<string, ToolGuidance> = {
  merge: {
    steps: ['Choose two or more PDF files. Add additional files from the workspace if needed.', 'Review the thumbnails and arrange pages in the order you want. Use movement buttons as an alternative to dragging.', 'Export the combined PDF, check the first and last pages of each source, then download.'],
    useCase: 'Combine application documents, receipts or lecture notes into one file. Merge keeps pages together; use Split when you only need selected pages.',
    checks: 'Check page order and orientation. Combining already compressed files usually increases the total size rather than reducing it. Exporting a signed PDF may invalidate its original cryptographic signatures.',
    faq: [['Can I change the order?', 'Yes. Arrange pages in the shared workspace before exporting.'], ['Does merging compress the files?', 'No. Use Compress after merging if you also need a smaller output.']]
  },
  split: {
    steps: ['Open the source PDF and review its page thumbnails.', 'Enter the required pages or ranges, for example 1, 3–5. Use the displayed page count to check your selection.', 'Export the selected pages, reopen the result and confirm that it contains only the pages you need.'],
    useCase: 'Extract one chapter, an invoice or a section of a longer document. Use Organize for visual reordering and deleting pages.',
    checks: 'Page numbers refer to positions in the file, which may differ from numbers printed on the pages. Extracting pages does not redact sensitive content within a retained page.',
    faq: [['Will the original PDF change?', 'No. Export creates a separate result. Keep your original as a backup.'], ['Can I remove sensitive text this way?', 'Only whole excluded pages are omitted. Use Redact for sensitive regions on pages you retain.']]
  },
  compress: {
    steps: ['Open your PDF and note its original size.', 'Choose compact mode to retain PDF text and links, or an image-based quality option when those features are less important.', 'Process the file, compare the sizes and inspect small text and images before downloading.'],
    useCase: 'Prepare attachments for a portal or email size limit. A PDF that already contains optimized images may not become smaller.',
    checks: 'Image-based modes rebuild pages and can remove selectable text, links and forms. Check readability at normal zoom. Keep the original if the result is larger or the quality is insufficient.',
    faq: [['Is compression lossless?', 'Compact mode retains PDF content. Image-based modes can lose detail and document features.'], ['Why is the result not smaller?', 'The source may already be optimized. Reduction depends on its content and the selected mode.']]
  },
  'native-text': {
    steps: ['Open a PDF within the 50 MB and 100-page limits. Select an existing text object on the page.', 'Enter a short replacement and preview the changed PDF. Use characters supported by the available font and keep the replacement within its bounds.', 'Keep the edited document in the workspace or export it. Reopen the output and inspect each changed line.'],
    useCase: 'Correct a short label, date or typo in a PDF containing real text objects. Use Add text for a new note; it does not replace underlying text.',
    checks: 'Scanned text is an image and cannot be edited with this tool. Paragraph reflow is unsupported. Embedded fonts may lack new characters; fitting can shrink text to half its original size. A visible replacement is not a redaction guarantee.',
    faq: [['Why can I not select a sentence?', 'It may be a scan, outlined artwork or unsupported text structure. OCR adds searchable text but does not reconstruct a fully editable layout.'], ['Does this edit the original text?', 'Supported single-line PDF text objects are changed in the exported PDF. This is different from adding a text overlay.']]
  },
  sign: {
    steps: ['Open the PDF and choose drawing, typing or image upload to create your signature.', 'Place the signature on the page and adjust its size. Check the location at your chosen zoom and orientation.', 'Export and reopen the PDF to confirm that the signature is on the intended page and does not cover important text.'],
    useCase: 'Place a visual signature on a document when the recipient accepts this method. Confirm the recipient’s requirements before submitting.',
    checks: 'A signature image is not certificate-based digital signing or identity verification. Use a transparent image when possible and inspect the output before sharing.',
    faq: [['Can I upload my signature?', 'Yes. Choose the image-upload option in the signature controls.'], ['Is this cryptographic signing?', 'No. The tool places a visual signature; it does not issue a certificate or verify identity.']]
  },
  images: {
    steps: ['Choose JPG, PNG or WebP images below the 22-megapixel per-image limit.', 'Review the resulting pages and arrange their order in the workspace.', 'Export the PDF and check orientation, margins and small details before downloading.'],
    useCase: 'Combine photographed notes, receipts or scanned images into one PDF. This creates image pages rather than searchable text.',
    checks: 'Very large images use substantial browser memory. Reduce their dimensions first if necessary. Use OCR afterwards when you need searchable English text.',
    faq: [['Can I use PNG as well as JPG?', 'Yes. JPG, PNG and WebP inputs are supported.'], ['Will the PDF text be selectable?', 'Image conversion alone does not recognize text. OCR is a separate operation.']]
  },
  organize: {
    steps: ['Open the PDF and inspect the page thumbnails.', 'Reorder, rotate, duplicate or delete pages. Use the labeled page buttons when dragging is inconvenient.', 'Export and reopen the document to check the final order and page count.'],
    useCase: 'Fix a scan with sideways pages or assemble only the pages you need. Undo and redo apply to supported workspace changes.',
    checks: 'Deleting a whole page differs from securely removing a region within a page. Review all pages before sharing, especially after duplication or deletion.',
    faq: [['Do I have to drag pages?', 'No. Page movement buttons provide an alternative.'], ['Can I continue with another tool?', 'Compatible tools reuse the shared document. Export important work before leaving the site.']]
  },
  ocr: {
    steps: ['Open a scanned PDF with legible English text.', 'Run recognition. The first use downloads a recognition model, so an internet connection is needed for that download.', 'Export the searchable PDF and check names, dates and numbers by searching or copying text.'],
    useCase: 'Make scanned notes or documents searchable. Recognition adds an invisible text layer to rendered pages.',
    checks: 'Recognition accuracy depends on scan quality. English is currently supported. OCR does not recreate a Word document or make image text directly editable.',
    faq: [['Does OCR upload my PDF?', 'Recognition runs in the browser; model assets are downloaded separately.'], ['Are other languages supported?', 'This implementation currently supports English. Review recognized text before relying on it.']]
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
