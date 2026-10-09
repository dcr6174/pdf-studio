export type Article={slug:string;title:string;category:string;tool:string;summary:string;steps:string[];check:string;limit:string;toolId?:string;toolNumber?:number;cta?:string;sections?:{heading:string;paragraphs:string[]}[];tips?:string[];faq?:{question:string;answer:string}[];intent?:string;published?:string;updated?:string;tags?:string[];evidence?:{inputs?:{href:string;label:string}[];id:string;input:string;output:string;date:string;environment:string;check:string;scope:string;options:Record<string,unknown>;preview?:{input:string;output:string}};hero?:{input:string;output:string}};
export const articles:Article[]=
[
  {
    "slug": "how-to-merge-pdf-files",
    "title": "How to merge PDF files into one document",
    "summary": "Combine complete documents in the order you choose, check the page count, and download one PDF.",
    "steps": [
      "Open Merge PDFs and choose at least two PDFs. Use Add PDFs or the + button to add another file.",
      "Arrange the numbered file cards in output order. Hold and drag a card on your phone; use its grip or keyboard on desktop. Open Edit pages if you need to inspect or change pages inside a file.",
      "Press Merge PDFs. Download PDF when processing finishes, then reopen the downloaded file and check its order."
    ],
    "sections": [
      {
        "heading": "Merge keeps each document together",
        "paragraphs": [
          "Merging puts the retained pages of the first file before the retained pages of the second. With A1, A2, A3 in PDF A and B1, B2 in PDF B, the result is A1, A2, A3, B1, B2. It does not alternate A and B pages. Use Alternate & Mix PDF when you want A1, B1, A2, B2 instead.",
          "This makes merging useful for a report followed by appendices, a CV followed by certificates, or a set of related receipts. Check the recipient’s required order before uploading the files. A good filename identifies the finished pack, but filenames alone do not prove the contents are correct."
        ]
      },
      {
        "heading": "Prepare a clean set of inputs",
        "paragraphs": [
          "Keep the originals and open each source before combining it. Check that it is the intended version, contains the expected pages and is readable. Avoid adding both the original and a revised copy unless you deliberately need both.",
          "A merge does not compress the final document to a particular upload limit. First complete the order and content checks. If the recipient sets a file-size limit, inspect the merged size and use Compress PDF separately if necessary. Recheck readability after compression."
        ]
      },
      {
        "heading": "Review forms before page copying",
        "paragraphs": [
          "The merge engine checks for fillable form fields. If it asks you to make fields read-only before merging, complete the forms first and review their visible values. Use the offered flattening option only when you no longer need editable fields, or fill and flatten the source in its original editor.",
          "A visual appearance is different from an editable field. Keep your editable originals. Do not assume that merging preserves certificates, digital signatures or every interactive feature. For signed documents, ask the recipient whether a combined reading copy is acceptable and retain the separately signed originals."
        ]
      }
    ],
    "check": "For the reference inputs, expect five pages: A1, A2, A3, B1, B2. For your files, sum the retained page counts and inspect every source boundary.",
    "limit": "Merging copies pages; it does not recognize text, pair scanned fronts and backs, reduce file size automatically or preserve a digital signature’s validity.",
    "tips": [
      "Add documents in their intended reading order, then check the numbered cards.",
      "Inspect the transition between the last page of one source and the first page of the next.",
      "Use a short trial before merging a large batch on a phone.",
      "Keep original signed or fillable documents separately."
    ],
    "faq": [
      {
        "question": "Is Merge the same as Alternate & Mix?",
        "answer": "No. Merge keeps each document’s pages together. Alternate & Mix takes a page from each file in turn."
      },
      {
        "question": "Can I merge scans?",
        "answer": "Yes, readable scanned PDFs can be combined as pages. Merging does not add OCR or make their text searchable."
      },
      {
        "question": "Will merging make my PDF smaller?",
        "answer": "There is no guaranteed reduction. Use the separate compression tool after checking the merged document."
      }
    ],
    "category": "Pages",
    "tool": "merge-pdf",
    "toolId": "merge",
    "toolNumber": 15,
    "cta": "Merge my PDFs →",
    "tags": [
      "merge",
      "combine",
      "join"
    ]
  },
  {
    "slug": "arrange-pdf-files-and-pages-before-merging",
    "title": "Arrange PDF files and pages before merging",
    "summary": "Set file order, review pages within each document and avoid accidental alphabetical sorting.",
    "steps": [
      "Open Merge PDFs and add your documents. Read the numbered cards: these show the file sequence.",
      "Drag whole file cards into the desired order. Use A–Z sorting only when alphabetical filename order is the order you actually want.",
      "Open Edit pages on a file to move, rotate or remove its pages. Check the retained counts, then press Merge PDFs and inspect the download."
    ],
    "sections": [
      {
        "heading": "File order and page order are two separate decisions",
        "paragraphs": [
          "Moving a whole file card changes where that document appears in the pack. Moving a page inside Edit pages changes that file’s internal sequence. For a report and appendix, put the report card first; do not move individual report pages to imitate a file reorder.",
          "The numbered cards are a useful final check. Read them in order before processing, then look at the first page preview of each file. Long or similar filenames can be misleading, so inspect the actual content as well."
        ]
      },
      {
        "heading": "Use filename sorting deliberately",
        "paragraphs": [
          "The sorting button offers ascending and descending filename order. Alphabetical order is useful for carefully named batches, but it does not understand chronology, document importance or printed page numbers. Check the visible sequence after every sort.",
          "For example, a CV may need to come before a certificate even when its filename sorts later. Manual ordering is safer when the recipient gives a document checklist. Consistent filenames such as 01-cover, 02-report and 03-appendix can make a batch easier to identify, but still verify the card numbers."
        ]
      },
      {
        "heading": "Fix a source without rebuilding the entire pack",
        "paragraphs": [
          "Use Edit pages on the relevant card to inspect its page thumbnails and available move, rotate and remove controls. Rotation changes the direction a page faces; movement changes its position. Check that the selected control addresses the problem you actually see.",
          "Removing a page changes the expected total. Write down or compare the retained counts after editing. If you removed a required page accidentally, restore the source from your original rather than accepting an incomplete pack. Keep at least one useful page in every file you retain."
        ]
      },
      {
        "heading": "Check the boundary pages",
        "paragraphs": [
          "A file can look correct on its cover while containing a duplicate or misplaced page later. After merging, inspect the final page of each source and the first page of the next. A1, A2, A3 followed by B1, B2 should have its boundary between positions three and four.",
          "Printed page labels may restart in each document. Use actual PDF positions for counting. For a submission pack, also check names, dates and version identifiers so the right order does not conceal the wrong source version."
        ]
      }
    ],
    "check": "Confirm both levels of order: numbered file cards before processing, then internal page order and source boundaries in the downloaded PDF.",
    "limit": "Sorting uses filenames, not document meaning. The tool cannot infer your required submission order or detect that a source is the wrong version.",
    "tips": [
      "Check card numbers after sorting or dragging.",
      "Use Edit pages for a problem inside one source, not for changing whole-file order.",
      "Compare retained counts after removing pages.",
      "Open the final download in the reader you normally use."
    ],
    "faq": [
      {
        "question": "Does A–Z sorting sort pages?",
        "answer": "It sorts files by name. Use Edit pages to change the sequence within a file."
      },
      {
        "question": "Why do printed page numbers restart?",
        "answer": "Each source can have its own printed numbering. The merged PDF still has one continuous set of document positions."
      },
      {
        "question": "Can I rotate only one page?",
        "answer": "The file’s Edit pages area provides individual-page rotation controls. Check that page after export."
      }
    ],
    "category": "Pages",
    "tool": "merge-pdf",
    "toolId": "merge",
    "toolNumber": 15,
    "cta": "Merge my PDFs →",
    "tags": [
      "merge",
      "combine",
      "join"
    ]
  },
  {
    "slug": "fix-pdf-merge-order-forms-and-missing-pages",
    "title": "PDF merge troubleshooting: wrong order, forms and missing pages",
    "summary": "Separate file-order problems from source-page problems, handle form warnings and check the actual downloaded PDF.",
    "steps": [
      "Keep your originals. Compare the retained page counts with the output count and identify the first point where the result differs.",
      "Correct the relevant file order or internal page sequence. For a fillable-form warning, complete and safely flatten the source or use the offered read-only-fields option.",
      "Merge a short test again, download it and inspect the affected boundary before processing the full pack."
    ],
    "sections": [
      {
        "heading": "The output begins with the wrong document",
        "paragraphs": [
          "Check the first numbered file card. A normal merge starts with that file’s retained pages. Drag the intended first document into position one and review the rest of the sequence. Do not repeatedly press the sort button without checking its resulting order.",
          "If you need every front page followed by its corresponding back, the issue may be tool choice rather than a broken merge. Use Alternate & Mix PDF for that sequence after preparing both source stacks. Merge intentionally keeps whole documents together."
        ]
      },
      {
        "heading": "A page is missing, repeated or unexpected",
        "paragraphs": [
          "First compare the output total with the sum of the retained page counts. If you removed pages in Edit pages, use those retained counts rather than the original totals. A correct total does not prove the sequence is correct: a duplicate can replace a missing page without changing the count.",
          "Open the original source and check whether the page was present there. Look for duplicate file cards, different versions and an accidental page removal. A merge cannot recreate content absent from the inputs. Correct the source set and try a short labelled sample before rerunning the entire batch."
        ]
      },
      {
        "heading": "The tool reports fillable fields",
        "paragraphs": [
          "This is a safety check, not a reason to keep trying the same settings. The engine avoids blindly copying interactive form pages. Complete the form and check all visible values before choosing the option to make its fields read-only or flattening it in the original form editor.",
          "If safe flattening still fails, preserve the original and use its form editor to save a completed reading copy. Verify that copy before merging. Do not accept a result with missing field values just because the surrounding page text looks normal."
        ]
      },
      {
        "heading": "The file will not open or processing stops",
        "paragraphs": [
          "Try opening each input separately in a trusted reader. A password-protected document may need unlocking with a password you know before the merge can read it. A file with a .pdf name is not necessarily a readable PDF, and a severely damaged source may not be recoverable.",
          "On a phone, try fewer or shorter inputs if processing stops on a large pack. File bytes are only part of the memory cost. Keep the tab open while the action runs and retain the originals. Record the exact error text and the input counts when reporting a problem; leave private contents and passwords out of a public report."
        ]
      },
      {
        "heading": "The result is larger or signatures look different",
        "paragraphs": [
          "Merge is a page-combination task, not a size-targeting task. A larger output does not by itself prove failure. Inspect its content first, then use compression if the recipient has a size limit and review the compressed copy separately.",
          "A merged reading copy is a new document. An original digital signature should not be treated as a valid certificate for that new combined file. Keep the signed originals and follow the recipient’s requirements. Visible signature artwork alone is not proof of cryptographic validity."
        ]
      }
    ],
    "check": "Check the actual downloaded file, not only the workspace. Compare count, sequence, form values and readability independently.",
    "limit": "The reference engine check covers simple labelled PDFs. It does not certify every form, encrypted file, signed document, large batch or physical phone.",
    "tips": [
      "Record the exact error before changing settings.",
      "Check source boundaries as well as the page count.",
      "Use the reference PDFs to distinguish ordinary merge order from alternation.",
      "Do not post private PDFs or passwords in a public issue."
    ],
    "faq": [
      {
        "question": "Does the right count prove the merge is correct?",
        "answer": "No. Check the sequence and content too; duplicates and wrong versions can have the same total."
      },
      {
        "question": "Why is a form-flattening choice required?",
        "answer": "The engine checks for interactive fields before copying pages so it can avoid silently losing their visible values."
      },
      {
        "question": "Can the repair tool recover every broken PDF?",
        "answer": "No. Repair readable PDF can resave documents that parse successfully; severe damage may prevent recovery."
      }
    ],
    "category": "Pages",
    "tool": "merge-pdf",
    "toolId": "merge",
    "toolNumber": 15,
    "cta": "Merge my PDFs →",
    "tags": [
      "merge",
      "combine",
      "join"
    ]
  },
  {
    "slug": "pdf-too-large-for-a-job-portal",
    "title": "PDF too large for a job portal? Aim for 100 KB",
    "category": "Pages",
    "tool": "compress-pdf-to-100kb",
    "summary": "Choose a method that fits the document and check the exact size before uploading.",
    "steps": [
      "Open your PDF and note its original size.",
      "Choose compact mode to retain PDF text and links, or an image-based quality option when those features are less important.",
      "Process the file, compare the sizes and inspect small text and images before downloading."
    ],
    "check": "Image-based modes rebuild pages and can remove selectable text, links and forms. Check readability at normal zoom. Keep the original if the result is larger or the quality is insufficient.",
    "limit": "Recommended optimizes supported JPEGs while keeping text, links and forms. Page-image presets remove these features.",
    "toolId": "compress",
    "toolNumber": 19,
    "intent": "How-to",
    "published": "2026-10-07",
    "updated": "2026-10-09",
    "tags": [
      "Compress PDF",
      "How-to",
      "file size",
      "upload limits",
      "smaller",
      "reduce size",
      "shrink",
      "compression"
    ],
    "sections": [
      {
        "heading": "What this tool actually does",
        "paragraphs": [
          "Compression depends on what is inside the PDF. Supported JPEG optimization can reduce images while retaining document structure; whole-page image presets exchange searchable and interactive features for a different representation."
        ]
      },
      {
        "heading": "Choose the controls for your document",
        "paragraphs": [
          "Compare the reported bytes with the portal limit and inspect small print. Try a short document first on a phone; extra DPI or a quality slider does not guarantee a smaller file."
        ]
      },
      {
        "heading": "Before your first export",
        "paragraphs": [
          "For a portal attachment, check the portal’s unit and limit before choosing a target. Inspect the smallest important text after compression. If an acceptable reading copy cannot fit, ask whether the portal permits separate files."
        ]
      },
      {
        "heading": "The result is not smaller",
        "paragraphs": [
          "The source may already be compact, or its data may not match a supported optimization. Keep the original when the result offers no useful reduction."
        ]
      }
    ],
    "tips": [
      "Compare the reported bytes with the portal limit and inspect small print. Try a short document first on a phone; extra DPI or a quality slider does not guarantee a smaller file.",
      "The source may already be compact, or its data may not match a supported optimization. Keep the original when the result offers no useful reduction.",
      "A numeric target does not prove usability. Compare names, dates and small print at normal reading size; use a less aggressive method or split the submission if permitted."
    ],
    "faq": [
      {
        "question": "The result is not smaller?",
        "answer": "The source may already be compact, or its data may not match a supported optimization. Keep the original when the result offers no useful reduction."
      },
      {
        "question": "The file meets the limit but looks poor?",
        "answer": "A numeric target does not prove usability. Compare names, dates and small print at normal reading size; use a less aggressive method or split the submission if permitted."
      },
      {
        "question": "Is compression lossless?",
        "answer": "Compact mode retains PDF content. JPEG optimization keeps document structure but reduces supported image quality. Whole-page image modes can lose text, links and forms."
      },
      {
        "question": "Why is the result not smaller?",
        "answer": "The source may already be optimized. Reduction depends on its content and the selected mode."
      }
    ],
    "hero": {
      "input": "Original PDF",
      "output": "Smaller if useful"
    },
    "cta": "Open Compress PDF →",
    "evidence": {
      "id": "compress",
      "input": "/examples/verified-tools/compress-input.pdf",
      "output": "/examples/verified-tools/compress-result.pdf",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "All six source pages remain readable in the parsed output.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      },
      "preview": {
        "input": "/examples/verified-tools/compress-input.png",
        "output": "/examples/verified-tools/compress-result.png"
      }
    }
  },
  {
    "slug": "combine-job-application-documents",
    "title": "Combine your CV and certificates into one PDF",
    "category": "Pages",
    "tool": "merge-pdf",
    "summary": "Arrange documents in the required order and preserve an original copy.",
    "steps": [
      "Choose Merge PDFs and add at least two documents.",
      "Use the file list to put your CV first and certificates afterwards. If a document has editable fields, review the flattening choice.",
      "Merge, preview the combined PDF, and download it."
    ],
    "check": "Check the first and last page of every source document and confirm the total page count.",
    "limit": "Page copying does not preserve every editable form. Filled form appearances may need flattening before merging.",
    "hero": {
      "input": "CV + certificates",
      "output": "One application pack"
    },
    "intent": "Practical example",
    "published": "2026-10-07",
    "updated": "2026-10-09",
    "toolId": "merge",
    "sections": [
      {
        "heading": "Follow the application checklist",
        "paragraphs": [
          "Put your CV first only when the employer asks for that order. Add required certificates and a cover letter as separate files, check names and dates, then arrange the numbered cards. Omit unrelated documents and keep separately signed originals."
        ]
      },
      {
        "heading": "Inspect the finished pack",
        "paragraphs": [
          "Count the retained pages, inspect the transition from CV to certificates and reopen the actual download. If the portal sets a size limit, compress this checked copy separately and inspect its small text again. Merge does not interpret application requirements or verify that a certificate belongs to the applicant."
        ]
      }
    ],
    "faq": [
      {
        "question": "Does merging reduce file size?",
        "answer": "No. Check the combined size and use Compress PDF separately if needed."
      }
    ],
    "tips": [
      "Follow the employer’s requested document order.",
      "Check names, dates and source versions.",
      "Keep signed originals separately."
    ],
    "tags": [
      "merge",
      "combine",
      "join"
    ]
  },
  {
    "slug": "sign-a-pdf-without-printing",
    "title": "Sign a PDF without printing or scanning it",
    "category": "Edit & sign",
    "tool": "sign-pdf",
    "summary": "Create a signature image, place it on the page and export a signed copy.",
    "steps": [
      "Open your PDF. Enter your name in the signing panel and choose Create signature.",
      "In the popup, draw, type or upload your signature. Confirm it, then drag the signature or optional name, initials and date onto the intended page.",
      "Adjust each item, use its edit control when needed, then choose Export PDF. Reopen the download and check every placement."
    ],
    "check": "A signature image is not certificate-based digital signing or identity verification. Use a transparent image when possible and inspect the output before sharing.",
    "limit": "A visual signature, without a certificate or identity verification.",
    "toolId": "sign",
    "toolNumber": 30,
    "intent": "How-to",
    "published": "2026-10-07",
    "updated": "2026-10-09",
    "tags": [
      "Sign PDF",
      "How-to",
      "signature",
      "signing"
    ],
    "sections": [
      {
        "heading": "What this tool actually does",
        "paragraphs": [
          "Type, Draw and Upload create reusable visual artwork. A trailing edit pencil changes that artwork; it does not require adding a second signature card."
        ]
      },
      {
        "heading": "Choose the controls for your document",
        "paragraphs": [
          "Keep Name above Create signature, choose the date with DD/MM/YYYY format, and use one uploaded image or stamp field when needed. Move and resize each placed item before Export PDF."
        ]
      },
      {
        "heading": "Before your first export",
        "paragraphs": [
          "For a consent form, put the signature, name and date in their respective spaces. Review the date format and each page requiring a signature. A visual signature does not establish identity or provide certificate validation."
        ]
      },
      {
        "heading": "The signature is on the wrong page",
        "paragraphs": [
          "Check the current document and page before dropping it. Remove the misplaced field and place it again; use the selected-field page scope only when repetition is intended."
        ]
      }
    ],
    "tips": [
      "Keep Name above Create signature, choose the date with DD/MM/YYYY format, and use one uploaded image or stamp field when needed. Move and resize each placed item before Export PDF.",
      "Check the current document and page before dropping it. Remove the misplaced field and place it again; use the selected-field page scope only when repetition is intended.",
      "A signature image does not supply identity verification or cryptographic signing. Follow the recipient’s specified signing method rather than treating visible artwork as a certificate."
    ],
    "faq": [
      {
        "question": "The signature is on the wrong page?",
        "answer": "Check the current document and page before dropping it. Remove the misplaced field and place it again; use the selected-field page scope only when repetition is intended."
      },
      {
        "question": "A recipient asks for a digital certificate?",
        "answer": "A signature image does not supply identity verification or cryptographic signing. Follow the recipient’s specified signing method rather than treating visible artwork as a certificate."
      },
      {
        "question": "Is this cryptographic signing?",
        "answer": "No. The tool places a visual signature; it does not issue a certificate or verify identity."
      }
    ],
    "hero": {
      "input": "Signature fields",
      "output": "Placed signature"
    },
    "cta": "Open Sign PDF →"
  },
  {
    "slug": "fix-a-phone-number-in-a-pdf",
    "title": "Fix a phone number or typo in a PDF",
    "category": "Edit & sign",
    "tool": "edit-pdf-text",
    "summary": "Replace supported original text and inspect the PDF after the edit.",
    "steps": [
      "Open a PDF. Select an existing text object on the page.",
      "Enter a short replacement and preview the changed PDF. Use characters supported by the available font and keep the replacement within its bounds.",
      "Keep the edited document in the workspace or export it. Reopen the output and inspect each changed line."
    ],
    "check": "Scanned text is an image and cannot be edited with this tool. Paragraph reflow is unsupported. Embedded fonts may lack new characters; fitting can shrink text to half its original size. A visible replacement is not a redaction guarantee.",
    "limit": "Browser text editing. Single-line edits can shrink to fit the original area (minimum half size). Embedded fonts need available characters; scans and nested graphics have limitations. No paragraph reflow. Editing invalidates digital signatures.",
    "toolId": "native-text",
    "toolNumber": 28,
    "intent": "How-to",
    "published": "2026-10-07",
    "updated": "2026-10-09",
    "tags": [
      "Edit existing text",
      "How-to"
    ],
    "sections": [
      {
        "heading": "What this tool actually does",
        "paragraphs": [
          "This changes supported original text objects. Adding a white box and a new label is a different overlay workflow and may leave the old value extractable."
        ]
      },
      {
        "heading": "Choose the controls for your document",
        "paragraphs": [
          "Keep the replacement within the supported font and text area. Aligned compatible paragraph editing has limits; mixed fonts, extra lines, scans and nested graphics can still prevent a reliable replacement."
        ]
      },
      {
        "heading": "Before your first export",
        "paragraphs": [
          "For a contact-detail correction, compare the new number character by character. Reopen the downloaded PDF and test selection around the edit. A visually correct replacement still needs a check for wrapping and neighbouring text."
        ]
      },
      {
        "heading": "The text cannot be selected",
        "paragraphs": [
          "It may be an image, outlined letters or unsupported structure. OCR can add searchability to a scan without rebuilding editable original text."
        ]
      }
    ],
    "tips": [
      "Keep the replacement within the supported font and text area. Aligned compatible paragraph editing has limits; mixed fonts, extra lines, scans and nested graphics can still prevent a reliable replacement.",
      "It may be an image, outlined letters or unsupported structure. OCR can add searchability to a scan without rebuilding editable original text.",
      "Try a shorter value and characters supported by the source font. Check the actual output and undo an edit that makes the line unreadable."
    ],
    "faq": [
      {
        "question": "The text cannot be selected?",
        "answer": "It may be an image, outlined letters or unsupported structure. OCR can add searchability to a scan without rebuilding editable original text."
      },
      {
        "question": "The replacement shrinks or loses characters?",
        "answer": "Try a shorter value and characters supported by the source font. Check the actual output and undo an edit that makes the line unreadable."
      },
      {
        "question": "Why can I not select a sentence?",
        "answer": "It may be a scan, outlined artwork or unsupported text structure. OCR adds searchable text but does not reconstruct a fully editable layout."
      },
      {
        "question": "Does this edit the original text?",
        "answer": "Supported single-line PDF text objects are changed in the exported PDF. This is different from adding a text overlay."
      }
    ],
    "hero": {
      "input": "Old contact line",
      "output": "Changed text object"
    },
    "cta": "Open Edit existing text →"
  },
  {
    "slug": "remove-sensitive-information",
    "title": "Remove sensitive information before sharing a PDF",
    "category": "Edit & sign",
    "tool": "redact-pdf",
    "summary": "Use redaction for permanent removal of selected regions rather than visual whiteout.",
    "steps": [
      "Open the PDF and mark each sensitive region carefully.",
      "Export the redacted document. Pages are rebuilt as images with the marked regions removed.",
      "Inspect every affected page and verify that sensitive content cannot be selected or found in the result before sharing."
    ],
    "check": "An ordinary black shape is not redaction. This operation rasterizes all pages and loses searchable text and interactive features. Review region edges, other pages and visible identifying information.",
    "limit": "Export rebuilds all pages as images and removes original text, links, metadata and forms.",
    "toolId": "redact",
    "toolNumber": 31,
    "intent": "How-to",
    "published": "2026-10-07",
    "updated": "2026-10-09",
    "tags": [
      "Redact PDF",
      "How-to"
    ],
    "sections": [
      {
        "heading": "What this tool actually does",
        "paragraphs": [
          "The dedicated export rebuilds all pages as images with the selected regions removed. A normal rectangle or whiteout overlay does not provide that removal."
        ]
      },
      {
        "heading": "Choose the controls for your document",
        "paragraphs": [
          "Cover the complete item with a little boundary allowance. Review every occurrence, other pages and visible identifying clues; metadata cleanup alone does not solve this task."
        ]
      },
      {
        "heading": "Before your first export",
        "paragraphs": [
          "For a public copy, identify every occurrence of the sensitive detail, including headers and repeated pages. After export, inspect the visible page and extracted text. A single covered region does not address other copies of the information."
        ]
      },
      {
        "heading": "The phrase can still be seen outside the region",
        "paragraphs": [
          "Expand the marked region and repeat from the original. Check small text and neighbouring lines at high zoom instead of accepting a roughly placed box."
        ]
      }
    ],
    "tips": [
      "Cover the complete item with a little boundary allowance. Review every occurrence, other pages and visible identifying clues; metadata cleanup alone does not solve this task.",
      "Expand the marked region and repeat from the original. Check small text and neighbouring lines at high zoom instead of accepting a roughly placed box.",
      "That is a consequence of the image-based redaction output. Keep the original privately and use the redacted reading copy only for the intended sharing purpose."
    ],
    "faq": [
      {
        "question": "The phrase can still be seen outside the region?",
        "answer": "Expand the marked region and repeat from the original. Check small text and neighbouring lines at high zoom instead of accepting a roughly placed box."
      },
      {
        "question": "Search and form fields disappear?",
        "answer": "That is a consequence of the image-based redaction output. Keep the original privately and use the redacted reading copy only for the intended sharing purpose."
      },
      {
        "question": "Is a black rectangle enough?",
        "answer": "No. A normal overlay may leave underlying content intact. Use the dedicated Redact export."
      },
      {
        "question": "Will forms and selectable text remain?",
        "answer": "No. This implementation rebuilds pages as images and discards those original features."
      }
    ],
    "hero": {
      "input": "Sensitive region",
      "output": "Removed region"
    },
    "cta": "Open Redact PDF →"
  },
  {
    "slug": "make-a-scanned-pdf-searchable",
    "title": "Make a scanned PDF searchable",
    "category": "Convert",
    "tool": "ocr-pdf",
    "summary": "Add a searchable text layer and check recognition mistakes before sharing.",
    "steps": [
      "Open a scanned PDF with legible text in a supported language.",
      "Run recognition. The first use downloads a recognition model, so an internet connection is needed for that download.",
      "Export the searchable PDF and check names, dates and numbers by searching or copying text."
    ],
    "check": "Recognition accuracy depends on scan quality. English, French, German, Spanish, Italian and Portuguese are selectable. OCR does not recreate a Word document or make image text directly editable.",
    "limit": "English, French, German, Spanish, Italian and Portuguese models download on demand. Accuracy varies; unsupported searchable characters are reported.",
    "toolId": "ocr",
    "toolNumber": 57,
    "intent": "How-to",
    "published": "2026-10-07",
    "updated": "2026-10-09",
    "tags": [
      "Searchable PDF (OCR)",
      "How-to",
      "searchable scans",
      "text recognition"
    ],
    "sections": [
      {
        "heading": "What this tool actually does",
        "paragraphs": [
          "OCR adds recognized text to image pages. Searchability is useful but is not proof the words are correct or that visible source text can be edited as original PDF objects."
        ]
      },
      {
        "heading": "Choose the controls for your document",
        "paragraphs": [
          "Use the selected language and page range; review the recognition screen where available. First use may download a model, so test with a short scan and a stable connection."
        ]
      },
      {
        "heading": "Before your first export",
        "paragraphs": [
          "For a scanned receipt, review the date, merchant and total against the image. Searchability is useful, but a recognized digit can be wrong. Correct extracted records before using them for accounting or a submission."
        ]
      },
      {
        "heading": "Names or numbers are wrong",
        "paragraphs": [
          "Correct the recognized text against the scan. Similar characters such as 0/O and 1/l need manual review, especially in identifiers."
        ]
      }
    ],
    "tips": [
      "Use the selected language and page range; review the recognition screen where available. First use may download a model, so test with a short scan and a stable connection.",
      "Correct the recognized text against the scan. Similar characters such as 0/O and 1/l need manual review, especially in identifiers.",
      "A searchable text layer can be invisible by design. Search for a known phrase and inspect extracted text while checking that the scan remains readable."
    ],
    "faq": [
      {
        "question": "Names or numbers are wrong?",
        "answer": "Correct the recognized text against the scan. Similar characters such as 0/O and 1/l need manual review, especially in identifiers."
      },
      {
        "question": "The visible scan still looks unchanged?",
        "answer": "A searchable text layer can be invisible by design. Search for a known phrase and inspect extracted text while checking that the scan remains readable."
      },
      {
        "question": "Are other languages supported?",
        "answer": "Choose English, French, German, Spanish, Italian or Portuguese. Indian scripts and arbitrary Unicode embedding are not yet supported. Review the result."
      }
    ],
    "hero": {
      "input": "Image-only scan",
      "output": "Searchable text layer"
    },
    "cta": "Open Searchable PDF (OCR) →"
  },
  {
    "slug": "remove-unwanted-pdf-pages",
    "title": "Remove unwanted pages from a PDF",
    "category": "Pages",
    "tool": "delete-pdf-pages",
    "summary": "Review page thumbnails and retain at least one page.",
    "steps": [
      "Open the PDF and inspect the page thumbnails.",
      "Reorder, rotate, duplicate or delete pages. Use the labeled page buttons when dragging is inconvenient.",
      "Export and reopen the document to check the final order and page count."
    ],
    "check": "Deleting a whole page differs from securely removing a region within a page. Review all pages before sharing, especially after duplication or deletion.",
    "limit": "Deleting a whole page differs from securely removing a region within a page. Review all pages before sharing, especially after duplication or deletion.",
    "toolId": "organize",
    "toolNumber": 16,
    "intent": "How-to",
    "published": "2026-10-07",
    "updated": "2026-10-09",
    "tags": [
      "Organize pages",
      "How-to"
    ],
    "sections": [
      {
        "heading": "What this tool actually does",
        "paragraphs": [
          "Organize changes the page list. Reordering a thumbnail changes reading position; rotating changes orientation; deleting removes the whole page from the output. These controls solve different problems."
        ]
      },
      {
        "heading": "Choose the controls for your document",
        "paragraphs": [
          "Select only the pages needed for the operation. Use movement controls when dragging is awkward, and keep at least one page in the finished document."
        ]
      },
      {
        "heading": "Before your first export",
        "paragraphs": [
          "For the assembled report, inspect the cover, each section boundary and the final page. The thumbnail grid is useful for order, while a full page view helps identify a wrong version with a similar-looking cover."
        ]
      },
      {
        "heading": "Printed numbers appear out of order",
        "paragraphs": [
          "Printed numbers are part of page content. Moving pages does not rewrite them; use Page numbers to add a new consistent sequence when suitable."
        ]
      }
    ],
    "tips": [
      "Select only the pages needed for the operation. Use movement controls when dragging is awkward, and keep at least one page in the finished document.",
      "Printed numbers are part of page content. Moving pages does not rewrite them; use Page numbers to add a new consistent sequence when suitable.",
      "Use Undo where available or reopen the original. Inspect the retained page count and boundary content before exporting again."
    ],
    "faq": [
      {
        "question": "Printed numbers appear out of order?",
        "answer": "Printed numbers are part of page content. Moving pages does not rewrite them; use Page numbers to add a new consistent sequence when suitable."
      },
      {
        "question": "The wrong page was removed?",
        "answer": "Use Undo where available or reopen the original. Inspect the retained page count and boundary content before exporting again."
      },
      {
        "question": "Do I have to drag pages?",
        "answer": "No. Page movement buttons provide an alternative."
      },
      {
        "question": "Can I continue with another tool?",
        "answer": "Compatible tools reuse the shared document. Export important work before leaving the site."
      }
    ],
    "hero": {
      "input": "Page thumbnails",
      "output": "Chosen order"
    },
    "cta": "Open Organize pages →",
    "evidence": {
      "id": "organize",
      "input": "/examples/verified-tools/organize-input.pdf",
      "output": "/examples/verified-tools/organize-result.pdf",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "All six source pages remain readable in the parsed output.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      },
      "preview": {
        "input": "/examples/verified-tools/organize-input.png",
        "output": "/examples/verified-tools/organize-result.png"
      }
    }
  },
  {
    "slug": "save-only-selected-pages",
    "title": "Send only selected pages from a long PDF",
    "category": "Pages",
    "tool": "split-pdf",
    "summary": "Extract page positions or ranges into one PDF or several files.",
    "steps": [
      "Open the source PDF and review its page thumbnails.",
      "Enter the required pages or ranges, for example 1, 3–5. Use the displayed page count to check your selection.",
      "Export the selected pages, reopen the result and confirm that it contains only the pages you need."
    ],
    "check": "Page numbers refer to positions in the file, which may differ from numbers printed on the pages. Extracting pages does not redact sensitive content within a retained page.",
    "limit": "Page numbers refer to positions in the file, which may differ from numbers printed on the pages. Extracting pages does not redact sensitive content within a retained page.",
    "toolId": "split",
    "toolNumber": 17,
    "intent": "How-to",
    "published": "2026-10-07",
    "updated": "2026-10-09",
    "tags": [
      "Split PDF",
      "How-to"
    ],
    "sections": [
      {
        "heading": "What this tool actually does",
        "paragraphs": [
          "Split selects actual positions in the current PDF. Printed labels such as invoice numbers or Roman page numbers are not the range values."
        ]
      },
      {
        "heading": "Choose the controls for your document",
        "paragraphs": [
          "Choose the output mode deliberately: one PDF, a PDF for each selected page, or semicolon-separated groups in a ZIP. Keep grouping separate from page-selection syntax."
        ]
      },
      {
        "heading": "Before your first export",
        "paragraphs": [
          "For a single invoice, confirm whether supporting pages belong to that invoice before choosing a range. Printed numbering can restart inside a source; use PDF positions rather than the number in its footer."
        ]
      },
      {
        "heading": "The wrong pages are extracted",
        "paragraphs": [
          "Count from the first physical PDF page, including covers. Compare thumbnail positions before repeating the action."
        ]
      }
    ],
    "tips": [
      "Choose the output mode deliberately: one PDF, a PDF for each selected page, or semicolon-separated groups in a ZIP. Keep grouping separate from page-selection syntax.",
      "Count from the first physical PDF page, including covers. Compare thumbnail positions before repeating the action.",
      "A separate-page or grouped output mode creates an archive. Extract it and open the PDFs inside, or choose one-PDF output."
    ],
    "faq": [
      {
        "question": "The wrong pages are extracted?",
        "answer": "Count from the first physical PDF page, including covers. Compare thumbnail positions before repeating the action."
      },
      {
        "question": "The download is a ZIP rather than a PDF?",
        "answer": "A separate-page or grouped output mode creates an archive. Extract it and open the PDFs inside, or choose one-PDF output."
      },
      {
        "question": "Will the original PDF change?",
        "answer": "No. Export creates a separate result. Keep your original as a backup."
      },
      {
        "question": "Can I remove sensitive text this way?",
        "answer": "Only whole excluded pages are omitted. Use Redact for sensitive regions on pages you retain."
      }
    ],
    "hero": {
      "input": "Page range",
      "output": "Selected pages"
    },
    "cta": "Open Split PDF →",
    "evidence": {
      "id": "split",
      "input": "/examples/verified-tools/split-input.pdf",
      "output": "/examples/verified-tools/split-result.pdf",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "Only positions one and three remain.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "1,3",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      },
      "preview": {
        "input": "/examples/verified-tools/split-input.png",
        "output": "/examples/verified-tools/split-result.png"
      }
    }
  },
  {
    "slug": "fix-sideways-pdf-pages",
    "title": "Fix sideways or upside-down PDF pages",
    "category": "Pages",
    "tool": "rotate-pdf",
    "summary": "Turn PDF pages without rebuilding them as photographs.",
    "steps": [
      "Choose your PDF and tap Rotate under the page that needs turning. Each tap turns that page clockwise by 90 degrees.",
      "On a phone, Add PDFs and Undo/Redo are attached below the header. Open More rotation options for Rotate all pages or page numbers such as 1, 3-5.",
      "Choose Save rotated PDF, download the result and inspect the orientation of every changed page."
    ],
    "check": "Rotation changes display orientation. Use Organize when only selected pages should rotate.",
    "limit": "Rotation changes display orientation. Use Organize when only selected pages should rotate.",
    "toolId": "rotate",
    "toolNumber": 20,
    "intent": "How-to",
    "published": "2026-10-07",
    "updated": "2026-10-09",
    "tags": [
      "Rotate PDF",
      "How-to"
    ],
    "sections": [
      {
        "heading": "What this tool actually does",
        "paragraphs": [
          "Rotation changes how a page faces. A 90° turn is not mirroring and does not move the page to a different position."
        ]
      },
      {
        "heading": "Choose the controls for your document",
        "paragraphs": [
          "Use the per-page control for mixed orientations. The optional all-pages and page-number controls are useful for a consistently sideways scan, but preview the chosen range before processing."
        ]
      },
      {
        "heading": "Before your first export",
        "paragraphs": [
          "For mixed scanner output, correct the affected pages individually and leave upright pages alone. Verify the first and last lines after export; a changed rotation is useful only when the page is comfortable to read."
        ]
      },
      {
        "heading": "Every page turns when only one should",
        "paragraphs": [
          "Check whether the all-pages action or an empty range was used. Restore the original orientation and apply the operation to the intended page only."
        ]
      }
    ],
    "tips": [
      "Use the per-page control for mixed orientations. The optional all-pages and page-number controls are useful for a consistently sideways scan, but preview the chosen range before processing.",
      "Check whether the all-pages action or an empty range was used. Restore the original orientation and apply the operation to the intended page only.",
      "Apply another 90° turn or choose 180° where available. Compare text direction rather than relying on the thumbnail aspect ratio alone."
    ],
    "faq": [
      {
        "question": "Every page turns when only one should?",
        "answer": "Check whether the all-pages action or an empty range was used. Restore the original orientation and apply the operation to the intended page only."
      },
      {
        "question": "The page is upside down after one turn?",
        "answer": "Apply another 90° turn or choose 180° where available. Compare text direction rather than relying on the thumbnail aspect ratio alone."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Fix sideways pages in scanned documents."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Rotation changes display orientation. Use Organize when only selected pages should rotate."
      }
    ],
    "hero": {
      "input": "Sideways page",
      "output": "Upright page"
    },
    "cta": "Open Rotate PDF →",
    "evidence": {
      "id": "rotate",
      "input": "/examples/verified-tools/rotate-input.pdf",
      "output": "/examples/verified-tools/rotate-result.pdf",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "All six pages have a 90° rotation.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      },
      "preview": {
        "input": "/examples/verified-tools/rotate-input.png",
        "output": "/examples/verified-tools/rotate-result.png"
      }
    }
  },
  {
    "slug": "turn-receipt-photos-into-a-pdf",
    "title": "Turn receipt photos into one PDF",
    "category": "Convert",
    "tool": "images-to-pdf",
    "summary": "Arrange photos into a document that is easy to send.",
    "steps": [
      "Choose JPG, PNG or WebP images.",
      "Review the resulting pages and arrange their order in the workspace.",
      "Export the PDF and check orientation, margins and small details before downloading."
    ],
    "check": "Very large images use substantial browser memory. Reduce their dimensions first if necessary. Use OCR afterwards when you need searchable text.",
    "limit": "PNG, JPG and WebP images. Browser memory also depends on decoded images, not just file size.",
    "toolId": "images",
    "toolNumber": 40,
    "intent": "How-to",
    "published": "2026-10-07",
    "updated": "2026-10-09",
    "tags": [
      "Images to PDF",
      "How-to",
      "jpg",
      "png",
      "photos"
    ],
    "sections": [
      {
        "heading": "What this tool actually does",
        "paragraphs": [
          "Image conversion creates a page for each supported image. It does not recognize receipt text or reconstruct columns and totals as editable objects."
        ]
      },
      {
        "heading": "Choose the controls for your document",
        "paragraphs": [
          "Choose Page size, Orientation and Margin for the output purpose. Image-dimensions mode uses the image shape; standard sheets fit the photograph within the chosen page."
        ]
      },
      {
        "heading": "Before your first export",
        "paragraphs": [
          "For a receipt bundle, arrange photographs chronologically and check orientation. Keep a legible margin around each image. Converting photos to PDF packages them as pages rather than recognizing their text."
        ]
      },
      {
        "heading": "A large image cannot open",
        "paragraphs": [
          "Decoded pixels use much more memory than compressed file bytes. Resize the photograph or try fewer inputs, especially on a phone."
        ]
      }
    ],
    "tips": [
      "Choose Page size, Orientation and Margin for the output purpose. Image-dimensions mode uses the image shape; standard sheets fit the photograph within the chosen page.",
      "Decoded pixels use much more memory than compressed file bytes. Resize the photograph or try fewer inputs, especially on a phone.",
      "Review the selected paper size and margin. A portrait photograph on a landscape standard sheet naturally leaves unused space."
    ],
    "faq": [
      {
        "question": "A large image cannot open?",
        "answer": "Decoded pixels use much more memory than compressed file bytes. Resize the photograph or try fewer inputs, especially on a phone."
      },
      {
        "question": "The output has unexpected white borders?",
        "answer": "Review the selected paper size and margin. A portrait photograph on a landscape standard sheet naturally leaves unused space."
      },
      {
        "question": "Can I use PNG as well as JPG?",
        "answer": "Yes. JPG, PNG and WebP inputs are supported."
      },
      {
        "question": "Will the PDF text be selectable?",
        "answer": "Image conversion alone does not recognize text. OCR is a separate operation."
      }
    ],
    "hero": {
      "input": "Photo sequence",
      "output": "One PDF"
    },
    "cta": "Open Images to PDF →"
  },
  {
    "slug": "number-a-document",
    "title": "Add clear page numbers to a document",
    "category": "Edit & sign",
    "tool": "add-page-numbers",
    "summary": "Choose position, numbering format and a starting number.",
    "steps": [
      "Choose the supported source file or files from your device.",
      "Choose the starting number for the sequence.",
      "Export and check that numbering does not cover source text."
    ],
    "check": "Workspace page positions can differ from printed page numbers. Check the exported sequence.",
    "limit": "Workspace page positions can differ from printed page numbers. Check the exported sequence.",
    "toolId": "numbers",
    "toolNumber": 33,
    "intent": "How-to",
    "published": "2026-10-07",
    "updated": "2026-10-09",
    "tags": [
      "Page numbers",
      "How-to"
    ],
    "sections": [
      {
        "heading": "What this tool actually does",
        "paragraphs": [
          "Added page numbers are visible labels on the exported pages. They do not rewrite old printed labels or change the document’s physical positions."
        ]
      },
      {
        "heading": "Choose the controls for your document",
        "paragraphs": [
          "Choose Starting number, Number format, Position and inset margin. Use the page range when only a section should receive labels; inspect the first and final numbered pages."
        ]
      },
      {
        "heading": "Before your first export",
        "paragraphs": [
          "For an appendix, decide whether numbering starts at the cover or at the first content page. Check the final displayed number and the selected position so the sequence matches the intended reading order."
        ]
      },
      {
        "heading": "Numbers overlap a footer",
        "paragraphs": [
          "Move their position or increase the inset carefully. Compare a page with a long footer, not only a blank cover."
        ]
      }
    ],
    "tips": [
      "Choose Starting number, Number format, Position and inset margin. Use the page range when only a section should receive labels; inspect the first and final numbered pages.",
      "Move their position or increase the inset carefully. Compare a page with a long footer, not only a blank cover.",
      "Check Starting number and the selected range. Printed numbering in the source is independent of the newly added sequence."
    ],
    "faq": [
      {
        "question": "Numbers overlap a footer?",
        "answer": "Move their position or increase the inset carefully. Compare a page with a long footer, not only a blank cover."
      },
      {
        "question": "The added sequence starts at the wrong value?",
        "answer": "Check Starting number and the selected range. Printed numbering in the source is independent of the newly added sequence."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Add consistent page references to a report."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Workspace page positions can differ from printed page numbers. Check the exported sequence."
      }
    ],
    "hero": {
      "input": "Unlabelled pages",
      "output": "Numbered pages"
    },
    "cta": "Open Page numbers →",
    "evidence": {
      "id": "numbers",
      "input": "/examples/verified-tools/numbers-input.pdf",
      "output": "/examples/verified-tools/numbers-result.pdf",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "Requested label is present in extracted output text.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      },
      "preview": {
        "input": "/examples/verified-tools/numbers-input.png",
        "output": "/examples/verified-tools/numbers-result.png"
      }
    }
  },
  {
    "slug": "bates-numbering-for-a-review-pack",
    "title": "Bates-number a document review pack",
    "category": "Edit & sign",
    "tool": "bates-numbering",
    "summary": "Use a consistent prefix, suffix and padded numeric sequence.",
    "steps": [
      "Choose the supported source file or files from your device.",
      "Enter the prefix and starting number for your identifiers.",
      "Export and check the first and last identifiers."
    ],
    "check": "These are visual identifiers, not proof of authenticity. Check the labeling requirements of the recipient.",
    "limit": "These are visual identifiers, not proof of authenticity. Check the labeling requirements of the recipient.",
    "toolId": "bates",
    "toolNumber": 34,
    "intent": "How-to",
    "published": "2026-10-07",
    "updated": "2026-10-09",
    "tags": [
      "Bates numbering",
      "How-to"
    ],
    "sections": [
      {
        "heading": "What this tool actually does",
        "paragraphs": [
          "Bates numbering creates a sequential visible identifier. Its consistency depends on final page order, prefix, suffix and starting number rather than a document title alone."
        ]
      },
      {
        "heading": "Choose the controls for your document",
        "paragraphs": [
          "Set Prefix, Suffix, Number of digits and Starting number. Keep a register of the intended range so later batches do not reuse identifiers accidentally."
        ]
      },
      {
        "heading": "Before your first export",
        "paragraphs": [
          "For a review bundle, choose a prefix that identifies the matter and a start value that follows previous batches. Record the first and last identifiers. Duplicating a labelled file later can create repeated identifiers."
        ]
      },
      {
        "heading": "Two packs share the same IDs",
        "paragraphs": [
          "Choose the next starting value or a distinct prefix before exporting the next pack. The tool does not maintain a central case-wide numbering register."
        ]
      }
    ],
    "tips": [
      "Set Prefix, Suffix, Number of digits and Starting number. Keep a register of the intended range so later batches do not reuse identifiers accidentally.",
      "Choose the next starting value or a distinct prefix before exporting the next pack. The tool does not maintain a central case-wide numbering register.",
      "Reduce font size, shorten the prefix or use a clearer margin position. Check the longest identifier in the batch."
    ],
    "faq": [
      {
        "question": "Two packs share the same IDs?",
        "answer": "Choose the next starting value or a distinct prefix before exporting the next pack. The tool does not maintain a central case-wide numbering register."
      },
      {
        "question": "A label is clipped or too wide?",
        "answer": "Reduce font size, shorten the prefix or use a clearer margin position. Check the longest identifier in the batch."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Give pages sequential reference labels."
      },
      {
        "question": "What should I check in the result?",
        "answer": "These are visual identifiers, not proof of authenticity. Check the labeling requirements of the recipient."
      }
    ],
    "hero": {
      "input": "Review pages",
      "output": "CASE-000101…"
    },
    "cta": "Open Bates numbering →",
    "evidence": {
      "id": "bates",
      "input": "/examples/verified-tools/bates-input.pdf",
      "output": "/examples/verified-tools/bates-result.pdf",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "Requested label is present in extracted output text.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "CASE-",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      },
      "preview": {
        "input": "/examples/verified-tools/bates-input.png",
        "output": "/examples/verified-tools/bates-result.png"
      }
    }
  },
  {
    "slug": "crop-white-borders",
    "title": "Crop white borders around PDF pages",
    "category": "Pages",
    "tool": "crop-margins",
    "summary": "Set each margin and preview the retained page area.",
    "steps": [
      "Choose the supported source file or files from your device.",
      "Choose the margin to trim and inspect content near every edge.",
      "Export and check that useful text is not clipped."
    ],
    "check": "Crop boundaries hide content; they do not securely erase it. Use Redact for sensitive regions.",
    "limit": "Cropping hides content outside the page boundary; it does not permanently remove it.",
    "toolId": "crop",
    "toolNumber": 25,
    "intent": "How-to",
    "published": "2026-10-07",
    "updated": "2026-10-09",
    "tags": [
      "Crop margins",
      "How-to"
    ],
    "sections": [
      {
        "heading": "What this tool actually does",
        "paragraphs": [
          "Cropping changes the visible boundary. Hidden content outside it can remain in the PDF, so cropping is unsuitable for permanently removing personal information."
        ]
      },
      {
        "heading": "Choose the controls for your document",
        "paragraphs": [
          "Margins use points rather than percentages. Check mixed page sizes individually before applying one set of values to the whole file; leave room around page numbers and stamps."
        ]
      },
      {
        "heading": "Before your first export",
        "paragraphs": [
          "For white scanner borders, inspect pages with writing closest to each edge. Leave enough space for notes, signatures and stamps. The tightest page, rather than the neatest one, should guide a shared crop setting."
        ]
      },
      {
        "heading": "Content disappears at an edge",
        "paragraphs": [
          "Reduce the relevant crop margin and inspect the original. A margin that suits one page can clip another page with a different layout."
        ]
      }
    ],
    "tips": [
      "Margins use points rather than percentages. Check mixed page sizes individually before applying one set of values to the whole file; leave room around page numbers and stamps.",
      "Reduce the relevant crop margin and inspect the original. A margin that suits one page can clip another page with a different layout.",
      "Changing a boundary does not necessarily discard the underlying data. Use compression for size reduction and redaction for genuine content removal."
    ],
    "faq": [
      {
        "question": "Content disappears at an edge?",
        "answer": "Reduce the relevant crop margin and inspect the original. A margin that suits one page can clip another page with a different layout."
      },
      {
        "question": "The file is not much smaller?",
        "answer": "Changing a boundary does not necessarily discard the underlying data. Use compression for size reduction and redaction for genuine content removal."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Reduce unwanted white borders around a document."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Crop boundaries hide content; they do not securely erase it. Use Redact for sensitive regions."
      }
    ],
    "hero": {
      "input": "Wide margins",
      "output": "Tighter boundary"
    },
    "cta": "Open Crop margins →",
    "evidence": {
      "id": "crop",
      "input": "/examples/verified-tools/crop-input.pdf",
      "output": "/examples/verified-tools/crop-result.pdf",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "The crop boundary is narrower than the original page.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      },
      "preview": {
        "input": "/examples/verified-tools/crop-input.png",
        "output": "/examples/verified-tools/crop-result.png"
      }
    }
  },
  {
    "slug": "fit-a-document-to-a4",
    "title": "Fit mixed page sizes onto A4 sheets",
    "category": "Pages",
    "tool": "resize-to-a4",
    "summary": "Choose fit or fill deliberately and review the output.",
    "steps": [
      "Choose the supported source file or files from your device.",
      "Inspect the page orientations before fitting them to A4.",
      "Export and check margins and scaling on mixed-size pages."
    ],
    "check": "Scaling may make small text harder to read. It does not reflow paragraphs.",
    "limit": "Scaling may make small text harder to read. It does not reflow paragraphs.",
    "toolId": "resize",
    "toolNumber": 26,
    "intent": "How-to",
    "published": "2026-10-07",
    "updated": "2026-10-09",
    "tags": [
      "Resize to A4",
      "How-to"
    ],
    "sections": [
      {
        "heading": "What this tool actually does",
        "paragraphs": [
          "Resizing can scale and position a source page on a new sheet. It is different from changing a crop boundary or merely rotating the original page."
        ]
      },
      {
        "heading": "Choose the controls for your document",
        "paragraphs": [
          "Choose A4, orientation and the available fit behaviour deliberately. Use the range control for a subset when supported; compare both a portrait and a landscape source."
        ]
      },
      {
        "heading": "Before your first export",
        "paragraphs": [
          "For an A4 submission, check whether the recipient needs an actual A4 page or merely an A4 print setting. Resize creates new page geometry; a print dialog can scale a document without changing the file."
        ]
      },
      {
        "heading": "Content is tiny with large margins",
        "paragraphs": [
          "A very wide source may need landscape orientation or a different fit strategy. Inspect its readable text size rather than only the A4 page dimensions."
        ]
      }
    ],
    "tips": [
      "Choose A4, orientation and the available fit behaviour deliberately. Use the range control for a subset when supported; compare both a portrait and a landscape source.",
      "A very wide source may need landscape orientation or a different fit strategy. Inspect its readable text size rather than only the A4 page dimensions.",
      "Review fill versus fit behaviour and the source bounds. Use a fit setting when preserving all visible content is the priority."
    ],
    "faq": [
      {
        "question": "Content is tiny with large margins?",
        "answer": "A very wide source may need landscape orientation or a different fit strategy. Inspect its readable text size rather than only the A4 page dimensions."
      },
      {
        "question": "Edges are clipped?",
        "answer": "Review fill versus fit behaviour and the source bounds. Use a fit setting when preserving all visible content is the priority."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Prepare a document for standard A4 printing."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Scaling may make small text harder to read. It does not reflow paragraphs."
      }
    ],
    "hero": {
      "input": "Mixed sizes",
      "output": "A4 sheets"
    },
    "cta": "Open Resize to A4 →",
    "evidence": {
      "id": "resize",
      "input": "/examples/verified-tools/resize-input.pdf",
      "output": "/examples/verified-tools/resize-result.pdf",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "Output has A4 page width.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      },
      "preview": {
        "input": "/examples/verified-tools/resize-input.png",
        "output": "/examples/verified-tools/resize-result.png"
      }
    }
  },
  {
    "slug": "print-more-pages-per-sheet",
    "title": "Print 2, 4, 6 or 9 PDF pages per sheet",
    "category": "Pages",
    "tool": "pages-per-sheet",
    "summary": "Make compact handout sheets with a visible output-count estimate.",
    "steps": [
      "Choose the supported source file or files from your device.",
      "Choose two or four pages per sheet.",
      "Export and inspect small text at the intended print size."
    ],
    "check": "Multiple pages on one sheet reduce their visible size. Use Resize for one page on each A4 sheet.",
    "limit": "Multiple pages on one sheet reduce their visible size. Use Resize for one page on each A4 sheet.",
    "toolId": "nup",
    "toolNumber": 24,
    "intent": "How-to",
    "published": "2026-10-07",
    "updated": "2026-10-09",
    "tags": [
      "Pages per sheet",
      "How-to"
    ],
    "sections": [
      {
        "heading": "What this tool actually does",
        "paragraphs": [
          "N-up reduces each source page to fit a slot on a new sheet. It is a physical page-layout transformation, unlike a reader two-column preference."
        ]
      },
      {
        "heading": "Choose the controls for your document",
        "paragraphs": [
          "Choose 2, 4, 6 or 9 according to source text size. An incomplete last sheet is normal when the input count is not divisible by the selected number."
        ]
      },
      {
        "heading": "Before your first export",
        "paragraphs": [
          "For lecture handouts, choose readability before maximum paper savings. Print a trial sheet if possible. Page previews on a high-resolution screen can conceal how small equations and footnotes become on paper."
        ]
      },
      {
        "heading": "Text is too small to read",
        "paragraphs": [
          "Reduce the number of pages per sheet or use a larger output sheet. More slots save paper but shrink every page."
        ]
      }
    ],
    "tips": [
      "Choose 2, 4, 6 or 9 according to source text size. An incomplete last sheet is normal when the input count is not divisible by the selected number.",
      "Reduce the number of pages per sheet or use a larger output sheet. More slots save paper but shrink every page.",
      "That follows from the retained count. Check the expected sheet count with ceiling(input pages / slots); empty final slots are not missing pages."
    ],
    "faq": [
      {
        "question": "Text is too small to read?",
        "answer": "Reduce the number of pages per sheet or use a larger output sheet. More slots save paper but shrink every page."
      },
      {
        "question": "The last sheet has empty spaces?",
        "answer": "That follows from the retained count. Check the expected sheet count with ceiling(input pages / slots); empty final slots are not missing pages."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Make a compact handout or reduce the number of printed sheets."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Multiple pages on one sheet reduce their visible size. Use Resize for one page on each A4 sheet."
      }
    ],
    "hero": {
      "input": "Four pages",
      "output": "One four-up sheet"
    },
    "cta": "Open Pages per sheet →",
    "evidence": {
      "id": "nup",
      "input": "/examples/verified-tools/nup-input.pdf",
      "output": "/examples/verified-tools/nup-result.pdf",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "Six inputs become two four-up sheets.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "4",
        "fields": {}
      },
      "preview": {
        "input": "/examples/verified-tools/nup-input.png",
        "output": "/examples/verified-tools/nup-result.png"
      }
    }
  },
  {
    "slug": "why-a-pdf-spreadsheet-needs-review",
    "title": "Why a PDF-to-spreadsheet export needs review",
    "category": "Convert",
    "tool": "pdf-to-spreadsheet",
    "summary": "Distinguish extracted text lines from reliably reconstructed tables.",
    "steps": [
      "Choose the supported source file or files from your device.",
      "Use a PDF with selectable text rows; run OCR first for scans.",
      "Export the XLSX and check every column and numeric value."
    ],
    "check": "Extraction uses heuristics. It does not guarantee original tables, formulas or column alignment.",
    "limit": "Heuristic extraction. Review column alignment; scans need OCR first.",
    "toolId": "xlsx",
    "toolNumber": 48,
    "intent": "How-to",
    "published": "2026-10-07",
    "updated": "2026-10-09",
    "tags": [
      "PDF to spreadsheet",
      "How-to"
    ],
    "sections": [
      {
        "heading": "What this tool actually does",
        "paragraphs": [
          "The extraction is heuristic text grouping. It does not recover the original spreadsheet, formulas, merged cells or table semantics from a PDF."
        ]
      },
      {
        "heading": "Choose the controls for your document",
        "paragraphs": [
          "Check headers, numeric columns, minus signs, decimal separators and wrapped descriptions. Validate totals using the source rather than assuming the extracted cells are authoritative."
        ]
      },
      {
        "heading": "Before your first export",
        "paragraphs": [
          "For a review spreadsheet, compare totals and decimal values with the original page. Do not apply formulas to extracted numbers until you have checked column alignment, separators and missing cells."
        ]
      },
      {
        "heading": "A number lands in the wrong column",
        "paragraphs": [
          "Inspect spacing and wrapped lines in the original. Realign the rows manually or use a source spreadsheet if one is available."
        ]
      }
    ],
    "tips": [
      "Check headers, numeric columns, minus signs, decimal separators and wrapped descriptions. Validate totals using the source rather than assuming the extracted cells are authoritative.",
      "Inspect spacing and wrapped lines in the original. Realign the rows manually or use a source spreadsheet if one is available.",
      "Run OCR first and review recognized characters. Even correct OCR words do not guarantee correct spreadsheet columns."
    ],
    "faq": [
      {
        "question": "A number lands in the wrong column?",
        "answer": "Inspect spacing and wrapped lines in the original. Realign the rows manually or use a source spreadsheet if one is available."
      },
      {
        "question": "A scan produces no useful rows?",
        "answer": "Run OCR first and review recognized characters. Even correct OCR words do not guarantee correct spreadsheet columns."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Move simple text rows into a spreadsheet."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Extraction uses heuristics. It does not guarantee original tables, formulas or column alignment."
      }
    ],
    "hero": {
      "input": "PDF rows",
      "output": "Reviewable XLSX"
    },
    "cta": "Open PDF to spreadsheet →",
    "evidence": {
      "id": "xlsx",
      "input": "/examples/verified-tools/xlsx-input.pdf",
      "output": "/examples/verified-tools/xlsx-result.xlsx",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "Output package contains its document content part.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      }
    }
  },
  {
    "slug": "protect-a-pdf-with-a-password",
    "title": "Protect a PDF with an opening password",
    "category": "Privacy",
    "tool": "protect-pdf",
    "summary": "Choose a passphrase, confirm it and keep it somewhere safe.",
    "steps": [
      "Choose the supported source file or files from your device.",
      "Choose an opening password of at least eight characters.",
      "Export the encrypted PDF and reopen it using that password."
    ],
    "check": "Keep the password safely and share it separately. There is no password recovery service.",
    "limit": "Keep the password safely and share it separately. There is no password recovery service.",
    "toolId": "encrypt",
    "toolNumber": 60,
    "intent": "How-to",
    "published": "2026-10-07",
    "updated": "2026-10-09",
    "tags": [
      "Protect PDF",
      "How-to"
    ],
    "sections": [
      {
        "heading": "What this tool actually does",
        "paragraphs": [
          "Opening-password encryption controls access to the encrypted file. It does not prevent a recipient who knows the password from photographing or copying readable content."
        ]
      },
      {
        "heading": "Choose the controls for your document",
        "paragraphs": [
          "Use at least eight characters and prefer a longer memorable passphrase. Keep the password securely and share it separately from the document when appropriate."
        ]
      },
      {
        "heading": "Before your first export",
        "paragraphs": [
          "For a confidential attachment, communicate the opening password through an appropriate separate channel. Test the download with the correct and an incorrect password. Encryption controls opening, not what an authenticated recipient can do afterwards."
        ]
      },
      {
        "heading": "The two password fields do not match",
        "paragraphs": [
          "Re-enter both carefully and use Show password only in a private environment. Do not paste the password into a public issue or screenshot."
        ]
      }
    ],
    "tips": [
      "Use at least eight characters and prefer a longer memorable passphrase. Keep the password securely and share it separately from the document when appropriate.",
      "Re-enter both carefully and use Show password only in a private environment. Do not paste the password into a public issue or screenshot.",
      "The tool does not provide password recovery. Keep a safe original and a secure password record rather than expecting an encrypted copy to be recoverable."
    ],
    "faq": [
      {
        "question": "The two password fields do not match?",
        "answer": "Re-enter both carefully and use Show password only in a private environment. Do not paste the password into a public issue or screenshot."
      },
      {
        "question": "The password is forgotten?",
        "answer": "The tool does not provide password recovery. Keep a safe original and a secure password record rather than expecting an encrypted copy to be recoverable."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Require an opening password for a copy of your document."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Keep the password safely and share it separately. There is no password recovery service."
      }
    ],
    "hero": {
      "input": "Readable PDF",
      "output": "Password required"
    },
    "cta": "Open Protect PDF →"
  },
  {
    "slug": "remove-a-known-pdf-password",
    "title": "Remove a PDF password you already know",
    "category": "Privacy",
    "tool": "unlock-pdf",
    "summary": "Create an unlocked copy using your current password.",
    "steps": [
      "Choose the supported source file or files from your device.",
      "Choose the protected PDF and enter a password you know.",
      "Export the unlocked copy and confirm it opens without prompting."
    ],
    "check": "The correct password is required. This does not bypass unknown passwords or access permissions.",
    "limit": "The correct password is required. This does not bypass unknown passwords or access permissions.",
    "toolId": "decrypt",
    "toolNumber": 61,
    "intent": "How-to",
    "published": "2026-10-07",
    "updated": "2026-10-09",
    "tags": [
      "Remove password",
      "How-to"
    ],
    "sections": [
      {
        "heading": "What this tool actually does",
        "paragraphs": [
          "Decryption requires a password you know and authorization to use the document. A reader temporarily opening an encrypted file does not itself remove protection from the saved source."
        ]
      },
      {
        "heading": "Choose the controls for your document",
        "paragraphs": [
          "Use the correct current password and check that the unlocked copy still has the expected pages. Protect the unlocked file appropriately because it can now open without credentials."
        ]
      },
      {
        "heading": "Before your first export",
        "paragraphs": [
          "For your own protected document, use the known opening password and inspect the unlocked copy before editing. Keep the protected original if it remains your archival version; the new copy no longer requires that opening password."
        ]
      },
      {
        "heading": "The password is rejected",
        "paragraphs": [
          "Check spelling, case and the exact source file. This operation does not guess or bypass an unknown password."
        ]
      }
    ],
    "tips": [
      "Use the correct current password and check that the unlocked copy still has the expected pages. Protect the unlocked file appropriately because it can now open without credentials.",
      "Check spelling, case and the exact source file. This operation does not guess or bypass an unknown password.",
      "Open the newly downloaded unlocked PDF as the next source. A reader session can still retain the original encrypted bytes."
    ],
    "faq": [
      {
        "question": "The password is rejected?",
        "answer": "Check spelling, case and the exact source file. This operation does not guess or bypass an unknown password."
      },
      {
        "question": "Editing still reports an encrypted document?",
        "answer": "Open the newly downloaded unlocked PDF as the next source. A reader session can still retain the original encrypted bytes."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Remove an opening password from a document you are authorized to use."
      },
      {
        "question": "What should I check in the result?",
        "answer": "The correct password is required. This does not bypass unknown passwords or access permissions."
      }
    ],
    "hero": {
      "input": "Encrypted PDF",
      "output": "Unlocked copy"
    },
    "cta": "Open Remove password →"
  },
  {
    "slug": "check-a-file-with-sha256",
    "title": "Check whether two files match with SHA-256",
    "category": "Privacy",
    "tool": "file-fingerprint",
    "summary": "Calculate a digest of the exact file bytes and compare it with a trusted value.",
    "steps": [
      "Choose the supported source file or files from your device.",
      "Choose the PDF whose exact bytes you want to identify.",
      "Calculate the SHA-256 value and copy it for comparison."
    ],
    "check": "Any byte change alters the hash. A matching hash does not identify the author or verify a digital signature.",
    "limit": "Any byte change alters the hash. A matching hash does not identify the author or verify a digital signature.",
    "toolId": "hash",
    "toolNumber": 64,
    "intent": "How-to",
    "published": "2026-10-07",
    "updated": "2026-10-09",
    "tags": [
      "Calculate SHA-256",
      "How-to"
    ],
    "sections": [
      {
        "heading": "What this tool actually does",
        "paragraphs": [
          "A file hash fingerprints bytes, not the document’s meaning or author. Two visually identical PDFs can have different hashes after metadata or serialization changes."
        ]
      },
      {
        "heading": "Choose the controls for your document",
        "paragraphs": [
          "Compare the complete digest and exact file, not a renamed substitute. A matching value is useful only when the reference value itself comes from a trusted source."
        ]
      },
      {
        "heading": "Before your first export",
        "paragraphs": [
          "For a transfer check, compare the full digest with one obtained from the exact original file. Matching filenames or page counts are insufficient. Any saved change, including metadata changes, can produce a different digest."
        ]
      },
      {
        "heading": "The hashes differ after an edit",
        "paragraphs": [
          "Any byte change can alter SHA-256, including metadata. Compare the correct versions; a mismatch does not identify which visible part changed."
        ]
      }
    ],
    "tips": [
      "Compare the complete digest and exact file, not a renamed substitute. A matching value is useful only when the reference value itself comes from a trusted source.",
      "Any byte change can alter SHA-256, including metadata. Compare the correct versions; a mismatch does not identify which visible part changed.",
      "A hash alone does not establish trust or authenticity. Obtain a trusted reference or a proper signing method when source identity matters."
    ],
    "faq": [
      {
        "question": "The hashes differ after an edit?",
        "answer": "Any byte change can alter SHA-256, including metadata. Compare the correct versions; a mismatch does not identify which visible part changed."
      },
      {
        "question": "The hash looks correct but the source is unknown?",
        "answer": "A hash alone does not establish trust or authenticity. Obtain a trusted reference or a proper signing method when source identity matters."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Check whether two file copies have identical bytes."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Any byte change alters the hash. A matching hash does not identify the author or verify a digital signature."
      }
    ],
    "hero": {
      "input": "File bytes",
      "output": "SHA-256 digest"
    },
    "cta": "Open Calculate SHA-256 →",
    "evidence": {
      "id": "hash",
      "input": "/examples/verified-tools/hash-input.pdf",
      "output": "/examples/verified-tools/hash-result.txt",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "Digest matches an independent SHA-256 calculation.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      }
    }
  },
  {
    "slug": "automate-a-repeat-pdf-task",
    "title": "Build a repeatable PDF workflow",
    "category": "Pages",
    "tool": "pdf-workflows",
    "summary": "Start empty, add supported operations, and save a recipe without storing document contents.",
    "steps": [
      "Choose PDF files for the selected sequence. Merge requires two or more files.",
      "Choose a preset or arrange custom steps before exporting; rotate uses 90 degrees clockwise.",
      "Export once, inspect the result and keep your originals for recovery."
    ],
    "check": "Compact does not guarantee savings. Clear metadata removes standard properties, not all hidden or visible personal information. Unsupported form page copying stops safely; flatten forms first when needed.",
    "limit": "Choose a preset or arrange supported steps in your own sequence. Originals remain in the workspace.",
    "toolId": "workflow",
    "toolNumber": 2,
    "intent": "How-to",
    "published": "2026-10-07",
    "updated": "2026-10-09",
    "tags": [
      "PDF workflows",
      "How-to"
    ],
    "sections": [
      {
        "heading": "What this tool actually does",
        "paragraphs": [
          "A workflow passes one intermediate result into the next step. The order matters: a later page-layout change can move content added earlier. Review the configured sequence rather than assuming a preset suits every file."
        ]
      },
      {
        "heading": "Choose the controls for your document",
        "paragraphs": [
          "Enable only the steps you need. Give each step its own settings and check whether it uses the current page order or original source. Save a reusable recipe only after inspecting one result."
        ]
      },
      {
        "heading": "Before your first export",
        "paragraphs": [
          "For the weekly review pack, record the expected page orientation and watermark wording alongside the recipe. A reusable sequence saves repeated setup, but each new source can have different dimensions, forms or existing marks."
        ]
      },
      {
        "heading": "A later step fails",
        "paragraphs": [
          "Keep the originals and identify the failing operation from the error. Run that operation separately on a small copy to distinguish unsuitable input from a sequence problem."
        ]
      }
    ],
    "tips": [
      "Enable only the steps you need. Give each step its own settings and check whether it uses the current page order or original source. Save a reusable recipe only after inspecting one result.",
      "Keep the originals and identify the failing operation from the error. Run that operation separately on a small copy to distinguish unsuitable input from a sequence problem.",
      "Inspect the step order and the settings for each enabled step. Disable unrelated operations; do not add compression or metadata removal to a task that only needs rotation."
    ],
    "faq": [
      {
        "question": "A later step fails?",
        "answer": "Keep the originals and identify the failing operation from the error. Run that operation separately on a small copy to distinguish unsuitable input from a sequence problem."
      },
      {
        "question": "The final file has an unexpected layout?",
        "answer": "Inspect the step order and the settings for each enabled step. Disable unrelated operations; do not add compression or metadata removal to a task that only needs rotation."
      },
      {
        "question": "Can I cancel?",
        "answer": "Stop requests are checked between supported processing steps. Some library calls finish before stopping."
      },
      {
        "question": "Will a failed sequence replace my workspace?",
        "answer": "No. Only the final result is returned; originals remain in the workspace."
      }
    ],
    "hero": {
      "input": "Input PDF",
      "output": "Reviewed sequence"
    },
    "cta": "Open PDF workflows →"
  },
  {
    "category": "Pages",
    "tool": "alternate-and-mix",
    "toolId": "interleave",
    "toolNumber": 23,
    "cta": "Mix my PDF pages →",
    "check": "Verify the first, middle and last pairs, and confirm the output count equals the sum of the input counts.",
    "limit": "Interleaving does not infer which pages belong together, correct scan direction or perform OCR. Prepare the source sequences first.",
    "slug": "how-to-alternate-and-mix",
    "title": "How to alternate and mix PDF pages",
    "summary": "Take one page from each PDF, in turn, to create one combined document. Follow the A1, B1, A2, B2 sequence, keep remaining pages and check the result.",
    "steps": [
      "Open Interleave pages and add the PDFs in the intended file order. The first file supplies the first output page.",
      "Keep the page sequence within each source document deliberate. The output takes one page from each source in turn.",
      "Run the interleave action and inspect the resulting sequence before downloading. Check the final pages when the inputs have different lengths."
    ],
    "sections": [
      {
        "heading": "Interleave is different from merge",
        "paragraphs": [
          "A normal merge places all pages of the first document before all pages of the next. Interleaving alternates the documents page by page. Choose interleave when two stacks need to be woven together; choose merge when each document should stay together."
        ]
      },
      {
        "heading": "A worked example with unequal files",
        "paragraphs": [
          "Suppose document A contains ALPHA, BRAVO, CHARLIE and DELTA, while B contains ECHO, FOXTROT and GOLF. The intended result is ALPHA, ECHO, BRAVO, FOXTROT, CHARLIE, GOLF, DELTA. DELTA must remain at the end; it should not disappear because B has fewer pages.",
          "The output should contain seven pages. Checking the total alone is insufficient: open the result and confirm the sequence."
        ]
      },
      {
        "heading": "Choose the first source carefully",
        "paragraphs": [
          "The first source determines the first page of each pair. If you need a front side followed by its back side, arrange the fronts first and the backs second. Use recognizable page labels in a small test before processing a large scan."
        ]
      }
    ],
    "tips": [
      "Test with short labelled documents before using a long batch.",
      "Count the pages in every input and compare their sum with the output.",
      "Review the last unpaired page when one source is longer."
    ],
    "faq": [
      {
        "question": "What if the PDFs have different page counts?",
        "answer": "The expected sequence retains leftover pages from the longer source. Review those pages rather than assuming both inputs must have the same length."
      },
      {
        "question": "Does this recreate scanned text?",
        "answer": "No. Interleaving changes page order. Use OCR separately when a scan needs searchable text."
      }
    ],
    "tags": [
      "interleave",
      "interleaving",
      "interleve",
      "weave",
      "alternate and mix",
      "front and back scans"
    ]
  },
  {
    "category": "Pages",
    "tool": "alternate-and-mix",
    "toolId": "interleave",
    "toolNumber": 23,
    "cta": "Mix my PDF pages →",
    "slug": "combine-front-and-back-pdf-scans",
    "title": "How to combine front and back PDF scans in the right order",
    "summary": "Scan both sides into separate PDFs, check the back-page order, and alternate fronts and backs into one readable document.",
    "steps": [
      "Check the front PDF and back PDF separately. Confirm which back belongs to the first front before combining anything.",
      "If the back stack runs backwards, use Reverse pages on that PDF and download the corrected copy. Keep the original scan.",
      "Open Alternate & Mix PDF. Click Choose files for the fronts first, then Add PDFs for the corrected backs. Click Alternate & Mix PDF and review the output before Download PDF."
    ],
    "check": "For a three-sheet document, verify F1, B1, F2, B2, F3, B3. Read each front/back pair and compare the output count with the total input pages.",
    "limit": "This combines existing pages. It cannot identify matching sides, recover a missing scan, straighten skewed text or recognize handwriting automatically.",
    "sections": [
      {
        "heading": "Start with the paper, not the merge button",
        "paragraphs": [
          "A scanner without automatic two-sided scanning often leaves you with two files: all the fronts and all the backs. Putting those files together with a normal merge produces every front first, followed by every back. Alternate & Mix PDF takes a page from each file in turn, so the two stacks can become a single document in reading order.",
          "Before scanning a long stack, try two sheets marked Front 1, Back 1, Front 2 and Back 2. Scan them using the same feeding and flipping method you intend to use for the real document. Scanner output order depends on that method; do not assume the back file will start with Back 1."
        ]
      },
      {
        "heading": "Check whether the back stack is reversed",
        "paragraphs": [
          "Open both input PDFs. If the fronts read F1, F2, F3 and the backs read B3, B2, B1, the back stack needs reversing. Otherwise the first pair would become F1, B3, which is the wrong sheet even though the output page count is correct.",
          "Use Reverse pages on the back PDF alone and download it. Confirm the corrected sequence is B1, B2, B3 before adding it to the mix. A sideways page needs rotation; a backwards stack needs reversal. These are different problems, and fixing one does not fix the other."
        ]
      },
      {
        "heading": "Decide what to do with blank backs",
        "paragraphs": [
          "Keep blank back pages when they represent real sheets in a front/back scan. Removing B2 from the back file makes the next back shift forward, so F2 may be paired with B3. Finish combining the two stacks before deciding whether a blank page should be removed from the final reading copy.",
          "If a back page was never scanned, do not treat the shorter file as harmless. Interleaving keeps remaining pages at the end, but it cannot know which scan is missing. Restore the missing scan or a deliberate placeholder in the correct source position, then check every pair."
        ]
      },
      {
        "heading": "Review a few pairs before accepting the result",
        "paragraphs": [
          "The source files should be added one at a time: fronts first, corrected backs second. After processing, inspect the first pair, a pair in the middle and the final pair. For important documents, check every pair rather than relying on a small spot check.",
          "Two six-page inputs should produce twelve pages. A correct count catches missing or duplicated pages, but it does not establish correct pairing. Use page headings, sheet numbers, signatures or other recognizable content to confirm the relationship between each front and back. Keep both original scans until you have checked the downloaded PDF."
        ]
      }
    ],
    "tips": [
      "Use a two-sheet trial to learn your scanner’s back-page order.",
      "Keep blank backs until the front/back sequence is complete.",
      "Download the reversed-back copy with a recognizable filename so you do not accidentally choose the original.",
      "Check the downloaded result in the PDF reader you normally use."
    ],
    "faq": [
      {
        "question": "Should fronts or backs be added first?",
        "answer": "Add the fronts first when the first reading page is a front. Choose that PDF alone, then add the backs. File order determines which stack starts each pair."
      },
      {
        "question": "Does rotating a PDF reverse its pages?",
        "answer": "No. Rotation changes page orientation. Reverse pages changes the order of the pages."
      },
      {
        "question": "Can I use scanned PDFs without OCR?",
        "answer": "Yes. Mixing pages does not require selectable text. OCR is a separate task if you want to search the scan."
      },
      {
        "question": "What if one scan has fewer pages?",
        "answer": "Remaining pages are retained, but a missing back in the middle can break pairing. Inspect the inputs and restore the missing position before mixing."
      }
    ],
    "tags": [
      "interleave",
      "interleaving",
      "interleve",
      "weave",
      "alternate and mix",
      "front and back scans"
    ]
  },
  {
    "category": "Pages",
    "tool": "alternate-and-mix",
    "toolId": "interleave",
    "toolNumber": 23,
    "cta": "Mix my PDF pages →",
    "slug": "fix-alternating-pdf-page-order",
    "title": "Alternate & Mix PDF troubleshooting: wrong order, reversed backs and missing pages",
    "summary": "Find the cause of an incorrect PDF mix, fix the source sequence and check the downloaded result without guessing.",
    "steps": [
      "Keep the original files. Compare their first pages and write down the intended output sequence before changing the workspace.",
      "Fix the source problem: add the correct first file, reverse a backwards stack, or restore a missing page position.",
      "Run a small mix again. Open Preview PDF and the downloaded PDF, then check the first, middle and final pairs."
    ],
    "check": "A3 plus B2 should contain five pages in the sequence A1, B1, A2, B2, A3. Compare both the count and the labels; one correct check does not replace the other.",
    "limit": "The tool alternates sources mechanically. It does not infer matching pages or prove that two scans represent the same document.",
    "sections": [
      {
        "heading": "The output starts with the wrong document",
        "paragraphs": [
          "If you wanted A1 first but received B1 first, check which file was added first. The first source supplies the first output page. Page thumbnails can make a workspace look correct while the source-file order is still wrong; moving one page is not a reliable way to change which file starts every pair.",
          "Keep your inputs, use Clear workspace and confirm the clear action. Choose the intended first PDF with Choose files, then add the next PDF with Add PDFs. For a short trial, label the first pages A1 and B1 so you can tell which document started the output."
        ]
      },
      {
        "heading": "Front pages are paired with the wrong backs",
        "paragraphs": [
          "A common scan problem is a back file in reverse order. With fronts F1, F2, F3 and backs B3, B2, B1, the output begins F1, B3. The tool has alternated correctly, but the source order is unsuitable. Open each input by itself to check this before repeating the same mix.",
          "Reverse the back PDF alone using Reverse pages, download the corrected file and add that copy second. If only one back is in the wrong position, inspect the original scan and correct that source sequence. Reversing the entire document is appropriate only when the whole back stack runs backwards."
        ]
      },
      {
        "heading": "A page seems missing or appears at the end",
        "paragraphs": [
          "Unequal lengths do not require the tool to discard anything. The previously verified three-page A and two-page B example ends with A3, after A1, B1, A2, B2. That final unpaired page is expected. Count all input pages and compare the sum with the output before concluding that a page is missing.",
          "If a page is absent from the input, mixing cannot recreate it. If a blank back was removed before mixing, subsequent pairs may shift. Check original files, page labels and scan settings. Restore missing positions where necessary and rerun a short test. Never insert a guess where a document page should be."
        ]
      },
      {
        "heading": "The order is right but a page is sideways",
        "paragraphs": [
          "Fix orientation separately from sequence. A 90° turn does not move a page earlier or later. Use Rotate PDF or a supported individual-page rotation control, then verify the resulting orientation in the downloaded file.",
          "If your document contains both portrait and landscape pages, avoid rotating every page blindly. Read the labels and turn only the pages that need it. Keep the content and ordering checks separate so a successful orientation fix does not hide an unresolved pairing problem."
        ]
      },
      {
        "heading": "The result differs from what you expected",
        "paragraphs": [
          "Try the two reference PDFs below to separate a source problem from an unfamiliar workflow. Their previously checked result is A1, B1, A2, B2, A3. If your own files behave differently, record their counts, first pages and intended sequence. That information is more useful than a screenshot of an error without the input order.",
          "A completed action means a file was produced, not that every recipient requirement has been met. Reopen the actual downloaded PDF, confirm that all pages can be read, and review the end of the document. If processing stops with a form or password message, follow the message and preserve the original files rather than repeatedly changing page order."
        ]
      }
    ],
    "tips": [
      "Use the reference PDFs to understand the normal output before investigating a large scan.",
      "Compare page count and page sequence independently.",
      "Start again with explicit file order when the wrong source goes first.",
      "Keep filenames, private document contents and passwords out of public problem reports."
    ],
    "faq": [
      {
        "question": "Why is the last page not paired?",
        "answer": "One input may be longer. Available pages continue at the end; the verified A3/B2 example keeps A3 as the fifth page."
      },
      {
        "question": "Can the tool match front and back content?",
        "answer": "No. It uses the order of the source files and their pages. You must check that corresponding positions belong together."
      },
      {
        "question": "Why does Merge PDFs look different?",
        "answer": "Merge keeps whole documents together. Alternate & Mix PDF takes one page from each source in turn."
      },
      {
        "question": "Does a correct page count prove the result is correct?",
        "answer": "No. The same count can contain wrong pairs or reversed order. Inspect labels and content as well."
      }
    ],
    "tags": [
      "interleave",
      "interleaving",
      "interleve",
      "weave",
      "alternate and mix",
      "front and back scans"
    ]
  },
  {
    "slug": "how-to-turn-pdf-text-into-handwriting-style-pages",
    "title": "How to turn PDF text into handwriting-style pages",
    "category": "Convert",
    "tool": "pdf-to-handwriting",
    "toolId": "pdf-to-handwriting",
    "toolNumber": 1,
    "summary": "Turn selectable PDF text into handwritten-style notes. Learn the available controls, a practical example and what to check.",
    "intent": "How-to",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "PDF to handwriting",
      "How-to"
    ],
    "steps": [
      "Open a PDF with selectable text.",
      "Review extracted text and choose a handwriting style and paper.",
      "Inspect the generated PDF and download it."
    ],
    "check": "Text is reflowed; source layout, tables and images are not preserved. Scans require OCR first. Unsupported font characters are reported.",
    "limit": "Extracts and reflows selectable text onto new paper. Images, tables and original layout are not preserved. Scans need OCR first.",
    "sections": [
      {
        "heading": "What this tool actually does",
        "paragraphs": [
          "Handwriting conversion extracts words and lays them out again. It does not trace the original page or preserve its columns. A short paragraph is a better first trial than a dense table."
        ]
      },
      {
        "heading": "Choose the controls for your document",
        "paragraphs": [
          "Choose the handwriting style, paper and text size for legibility. Check line breaks after changing a font; wider characters can push words onto another page."
        ]
      },
      {
        "heading": "Before your first export",
        "paragraphs": [
          "For revision notes, choose short sections and leave space between ideas. Keep equations, tables and precise diagrams in their original format; handwriting styling changes presentation rather than improving the accuracy of the source."
        ]
      },
      {
        "heading": "Nothing imports from a scan",
        "paragraphs": [
          "Image-only pages contain pixels rather than words. Run OCR first and correct its text before importing; OCR recognition is not proof the text is accurate."
        ]
      }
    ],
    "tips": [
      "Choose the handwriting style, paper and text size for legibility. Check line breaks after changing a font; wider characters can push words onto another page.",
      "Image-only pages contain pixels rather than words. Run OCR first and correct its text before importing; OCR recognition is not proof the text is accurate.",
      "Reflow has no table structure to preserve. Rewrite the essential facts as short labelled lines or retain the original PDF for the table."
    ],
    "faq": [
      {
        "question": "Nothing imports from a scan?",
        "answer": "Image-only pages contain pixels rather than words. Run OCR first and correct its text before importing; OCR recognition is not proof the text is accurate."
      },
      {
        "question": "Tables become a confusing paragraph?",
        "answer": "Reflow has no table structure to preserve. Rewrite the essential facts as short labelled lines or retain the original PDF for the table."
      },
      {
        "question": "Is this OCR?",
        "answer": "No. Import requires selectable PDF text."
      },
      {
        "question": "Does this preserve the original PDF?",
        "answer": "Your original stays unchanged; download a newly generated document."
      }
    ],
    "hero": {
      "input": "Typed notes",
      "output": "Handwritten notes"
    },
    "cta": "Open PDF to handwriting →"
  },
  {
    "slug": "turn-typed-revision-notes-into-handwritten-style-pages",
    "title": "Turn typed revision notes into handwritten-style pages",
    "category": "Convert",
    "tool": "pdf-to-handwriting",
    "toolId": "pdf-to-handwriting",
    "toolNumber": 1,
    "summary": "A student has two pages of selectable revision notes and wants a notebook-style reading copy.",
    "intent": "Practical example",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "PDF to handwriting",
      "Practical example"
    ],
    "steps": [
      "Open a PDF with selectable text.",
      "Review extracted text and choose a handwriting style and paper.",
      "Inspect the generated PDF and download it."
    ],
    "check": "Text is reflowed; source layout, tables and images are not preserved. Scans require OCR first. Unsupported font characters are reported.",
    "limit": "Extracts and reflows selectable text onto new paper. Images, tables and original layout are not preserved. Scans need OCR first.",
    "sections": [
      {
        "heading": "The document and the intended outcome",
        "paragraphs": [
          "A student has two pages of selectable revision notes and wants a notebook-style reading copy. Import the text, remove repeated headers, then choose handwriting and paper before generating new pages."
        ]
      },
      {
        "heading": "Make this example work for your file",
        "paragraphs": [
          "For revision notes, choose short sections and leave space between ideas. Keep equations, tables and precise diagrams in their original format; handwriting styling changes presentation rather than improving the accuracy of the source."
        ]
      },
      {
        "heading": "Choose only the settings this case needs",
        "paragraphs": [
          "Choose the handwriting style, paper and text size for legibility. Check line breaks after changing a font; wider characters can push words onto another page."
        ]
      },
      {
        "heading": "When the example needs a different approach",
        "paragraphs": [
          "Reflow has no table structure to preserve. Rewrite the essential facts as short labelled lines or retain the original PDF for the table."
        ]
      }
    ],
    "tips": [
      "Choose the handwriting style, paper and text size for legibility. Check line breaks after changing a font; wider characters can push words onto another page.",
      "Image-only pages contain pixels rather than words. Run OCR first and correct its text before importing; OCR recognition is not proof the text is accurate.",
      "Reflow has no table structure to preserve. Rewrite the essential facts as short labelled lines or retain the original PDF for the table."
    ],
    "faq": [
      {
        "question": "Nothing imports from a scan?",
        "answer": "Image-only pages contain pixels rather than words. Run OCR first and correct its text before importing; OCR recognition is not proof the text is accurate."
      },
      {
        "question": "Tables become a confusing paragraph?",
        "answer": "Reflow has no table structure to preserve. Rewrite the essential facts as short labelled lines or retain the original PDF for the table."
      },
      {
        "question": "Is this OCR?",
        "answer": "No. Import requires selectable PDF text."
      },
      {
        "question": "Does this preserve the original PDF?",
        "answer": "Your original stays unchanged; download a newly generated document."
      }
    ],
    "hero": {
      "input": "Typed notes",
      "output": "Handwritten notes"
    },
    "cta": "Open PDF to handwriting →"
  },
  {
    "slug": "pdf-to-handwriting-common-problems-and-how-to-fix-them",
    "title": "PDF to handwriting: common problems and how to fix them",
    "category": "Convert",
    "tool": "pdf-to-handwriting",
    "toolId": "pdf-to-handwriting",
    "toolNumber": 1,
    "summary": "Resolve nothing imports from a scan and tables become a confusing paragraph. Understand the limits before retrying.",
    "intent": "Troubleshooting",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "PDF to handwriting",
      "Troubleshooting"
    ],
    "steps": [
      "Open a PDF with selectable text.",
      "Review extracted text and choose a handwriting style and paper.",
      "Inspect the generated PDF and download it."
    ],
    "check": "Text is reflowed; source layout, tables and images are not preserved. Scans require OCR first. Unsupported font characters are reported.",
    "limit": "Extracts and reflows selectable text onto new paper. Images, tables and original layout are not preserved. Scans need OCR first.",
    "sections": [
      {
        "heading": "Nothing imports from a scan",
        "paragraphs": [
          "Image-only pages contain pixels rather than words. Run OCR first and correct its text before importing; OCR recognition is not proof the text is accurate."
        ]
      },
      {
        "heading": "Tables become a confusing paragraph",
        "paragraphs": [
          "Reflow has no table structure to preserve. Rewrite the essential facts as short labelled lines or retain the original PDF for the table."
        ]
      },
      {
        "heading": "Check whether this is the right operation",
        "paragraphs": [
          "Handwriting conversion extracts words and lays them out again. It does not trace the original page or preserve its columns. A short paragraph is a better first trial than a dense table."
        ]
      },
      {
        "heading": "A more useful retry",
        "paragraphs": [
          "For revision notes, choose short sections and leave space between ideas. Keep equations, tables and precise diagrams in their original format; handwriting styling changes presentation rather than improving the accuracy of the source."
        ]
      }
    ],
    "tips": [
      "Choose the handwriting style, paper and text size for legibility. Check line breaks after changing a font; wider characters can push words onto another page.",
      "Image-only pages contain pixels rather than words. Run OCR first and correct its text before importing; OCR recognition is not proof the text is accurate.",
      "Reflow has no table structure to preserve. Rewrite the essential facts as short labelled lines or retain the original PDF for the table."
    ],
    "faq": [
      {
        "question": "Nothing imports from a scan?",
        "answer": "Image-only pages contain pixels rather than words. Run OCR first and correct its text before importing; OCR recognition is not proof the text is accurate."
      },
      {
        "question": "Tables become a confusing paragraph?",
        "answer": "Reflow has no table structure to preserve. Rewrite the essential facts as short labelled lines or retain the original PDF for the table."
      },
      {
        "question": "Is this OCR?",
        "answer": "No. Import requires selectable PDF text."
      },
      {
        "question": "Does this preserve the original PDF?",
        "answer": "Your original stays unchanged; download a newly generated document."
      }
    ],
    "hero": {
      "input": "Typed notes",
      "output": "Handwritten notes"
    },
    "cta": "Open PDF to handwriting →"
  },
  {
    "slug": "prepare-a-repeatable-pdf-review-pack",
    "title": "Prepare a repeatable PDF review pack",
    "category": "Pages",
    "tool": "pdf-workflows",
    "toolId": "workflow",
    "toolNumber": 2,
    "summary": "An office repeats the same rotate-and-watermark task each week.",
    "intent": "Practical example",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "PDF workflows",
      "Practical example"
    ],
    "steps": [
      "Choose PDF files for the selected sequence. Merge requires two or more files.",
      "Choose a preset or arrange custom steps before exporting; rotate uses 90 degrees clockwise.",
      "Export once, inspect the result and keep your originals for recovery."
    ],
    "check": "Compact does not guarantee savings. Clear metadata removes standard properties, not all hidden or visible personal information. Unsupported form page copying stops safely; flatten forms first when needed.",
    "limit": "Choose a preset or arrange supported steps in your own sequence. Originals remain in the workspace.",
    "sections": [
      {
        "heading": "The document and the intended outcome",
        "paragraphs": [
          "An office repeats the same rotate-and-watermark task each week. Start with a small document, set the intended rotation and watermark text, arrange those steps, and run the sequence once."
        ]
      },
      {
        "heading": "Make this example work for your file",
        "paragraphs": [
          "For the weekly review pack, record the expected page orientation and watermark wording alongside the recipe. A reusable sequence saves repeated setup, but each new source can have different dimensions, forms or existing marks."
        ]
      },
      {
        "heading": "Choose only the settings this case needs",
        "paragraphs": [
          "Enable only the steps you need. Give each step its own settings and check whether it uses the current page order or original source. Save a reusable recipe only after inspecting one result."
        ]
      },
      {
        "heading": "When the example needs a different approach",
        "paragraphs": [
          "Inspect the step order and the settings for each enabled step. Disable unrelated operations; do not add compression or metadata removal to a task that only needs rotation."
        ]
      }
    ],
    "tips": [
      "Enable only the steps you need. Give each step its own settings and check whether it uses the current page order or original source. Save a reusable recipe only after inspecting one result.",
      "Keep the originals and identify the failing operation from the error. Run that operation separately on a small copy to distinguish unsuitable input from a sequence problem.",
      "Inspect the step order and the settings for each enabled step. Disable unrelated operations; do not add compression or metadata removal to a task that only needs rotation."
    ],
    "faq": [
      {
        "question": "A later step fails?",
        "answer": "Keep the originals and identify the failing operation from the error. Run that operation separately on a small copy to distinguish unsuitable input from a sequence problem."
      },
      {
        "question": "The final file has an unexpected layout?",
        "answer": "Inspect the step order and the settings for each enabled step. Disable unrelated operations; do not add compression or metadata removal to a task that only needs rotation."
      },
      {
        "question": "Can I cancel?",
        "answer": "Stop requests are checked between supported processing steps. Some library calls finish before stopping."
      },
      {
        "question": "Will a failed sequence replace my workspace?",
        "answer": "No. Only the final result is returned; originals remain in the workspace."
      }
    ],
    "hero": {
      "input": "Input PDF",
      "output": "Reviewed sequence"
    },
    "cta": "Open PDF workflows →"
  },
  {
    "slug": "pdf-workflows-common-problems-and-how-to-fix-them",
    "title": "PDF workflows: common problems and how to fix them",
    "category": "Pages",
    "tool": "pdf-workflows",
    "toolId": "workflow",
    "toolNumber": 2,
    "summary": "Resolve a later step fails and the final file has an unexpected layout. Understand the limits before retrying.",
    "intent": "Troubleshooting",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "PDF workflows",
      "Troubleshooting"
    ],
    "steps": [
      "Choose PDF files for the selected sequence. Merge requires two or more files.",
      "Choose a preset or arrange custom steps before exporting; rotate uses 90 degrees clockwise.",
      "Export once, inspect the result and keep your originals for recovery."
    ],
    "check": "Compact does not guarantee savings. Clear metadata removes standard properties, not all hidden or visible personal information. Unsupported form page copying stops safely; flatten forms first when needed.",
    "limit": "Choose a preset or arrange supported steps in your own sequence. Originals remain in the workspace.",
    "sections": [
      {
        "heading": "A later step fails",
        "paragraphs": [
          "Keep the originals and identify the failing operation from the error. Run that operation separately on a small copy to distinguish unsuitable input from a sequence problem."
        ]
      },
      {
        "heading": "The final file has an unexpected layout",
        "paragraphs": [
          "Inspect the step order and the settings for each enabled step. Disable unrelated operations; do not add compression or metadata removal to a task that only needs rotation."
        ]
      },
      {
        "heading": "Check whether this is the right operation",
        "paragraphs": [
          "A workflow passes one intermediate result into the next step. The order matters: a later page-layout change can move content added earlier. Review the configured sequence rather than assuming a preset suits every file."
        ]
      },
      {
        "heading": "A more useful retry",
        "paragraphs": [
          "For the weekly review pack, record the expected page orientation and watermark wording alongside the recipe. A reusable sequence saves repeated setup, but each new source can have different dimensions, forms or existing marks."
        ]
      }
    ],
    "tips": [
      "Enable only the steps you need. Give each step its own settings and check whether it uses the current page order or original source. Save a reusable recipe only after inspecting one result.",
      "Keep the originals and identify the failing operation from the error. Run that operation separately on a small copy to distinguish unsuitable input from a sequence problem.",
      "Inspect the step order and the settings for each enabled step. Disable unrelated operations; do not add compression or metadata removal to a task that only needs rotation."
    ],
    "faq": [
      {
        "question": "A later step fails?",
        "answer": "Keep the originals and identify the failing operation from the error. Run that operation separately on a small copy to distinguish unsuitable input from a sequence problem."
      },
      {
        "question": "The final file has an unexpected layout?",
        "answer": "Inspect the step order and the settings for each enabled step. Disable unrelated operations; do not add compression or metadata removal to a task that only needs rotation."
      },
      {
        "question": "Can I cancel?",
        "answer": "Stop requests are checked between supported processing steps. Some library calls finish before stopping."
      },
      {
        "question": "Will a failed sequence replace my workspace?",
        "answer": "No. Only the final result is returned; originals remain in the workspace."
      }
    ],
    "hero": {
      "input": "Input PDF",
      "output": "Reviewed sequence"
    },
    "cta": "Open PDF workflows →"
  },
  {
    "slug": "how-to-split-a-pdf-at-chapter-bookmarks",
    "title": "How to split a PDF at chapter bookmarks",
    "category": "Pages",
    "tool": "split-by-chapters",
    "toolId": "split-chapters",
    "toolNumber": 3,
    "summary": "Split at supported top-level bookmark destinations. Learn the available controls, a practical example and what to check.",
    "intent": "How-to",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Split by chapters",
      "How-to"
    ],
    "steps": [
      "Open a PDF containing top-level bookmarks.",
      "Export a ZIP split at supported bookmark destinations.",
      "Extract and inspect the first and last page of every chapter."
    ],
    "check": "Bookmarks without local page destinations cannot define boundaries. Nested bookmarks are not chapter boundaries. Page copying can remove editable forms; flatten them explicitly first.",
    "limit": "Requires usable outline entries. Inspect resulting chapter boundaries.",
    "sections": [
      {
        "heading": "What this tool actually does",
        "paragraphs": [
          "The splitter uses bookmark destinations, not headings printed on the paper. A visible table of contents is not the same as the document outline available in a reader sidebar."
        ]
      },
      {
        "heading": "Choose the controls for your document",
        "paragraphs": [
          "Inspect the top-level outline and its destinations before splitting. After inserting or removing a page, check chapter boundaries again instead of relying on old printed page numbers."
        ]
      },
      {
        "heading": "Before your first export",
        "paragraphs": [
          "For the manual example, compare every chapter filename with its first heading. A bookmark can point to a title page before the actual chapter; keep that opening page when it belongs to the section."
        ]
      },
      {
        "heading": "No top-level bookmarks are reported",
        "paragraphs": [
          "Open the outline in a reader. Nested entries, remote destinations and an image of a contents page may not supply supported local boundaries. Use explicit Split ranges when necessary."
        ]
      }
    ],
    "tips": [
      "Inspect the top-level outline and its destinations before splitting. After inserting or removing a page, check chapter boundaries again instead of relying on old printed page numbers.",
      "Open the outline in a reader. Nested entries, remote destinations and an image of a contents page may not supply supported local boundaries. Use explicit Split ranges when necessary.",
      "Compare its first page with the source bookmark destination. Remove ambiguous duplicate boundaries or create a clean outline before repeating the split."
    ],
    "faq": [
      {
        "question": "No top-level bookmarks are reported?",
        "answer": "Open the outline in a reader. Nested entries, remote destinations and an image of a contents page may not supply supported local boundaries. Use explicit Split ranges when necessary."
      },
      {
        "question": "A chapter begins on the wrong page?",
        "answer": "Compare its first page with the source bookmark destination. Remove ambiguous duplicate boundaries or create a clean outline before repeating the split."
      },
      {
        "question": "Can I split a PDF without bookmarks?",
        "answer": "Use Split with explicit page ranges or add bookmarks first."
      },
      {
        "question": "Are nested entries used?",
        "answer": "No. Only supported top-level local destinations define chapters."
      }
    ],
    "hero": {
      "input": "Bookmarked manual",
      "output": "Chapter files"
    },
    "cta": "Open Split by chapters →",
    "evidence": {
      "id": "split-chapters",
      "input": "/examples/verified-tools/split-chapters-input.pdf",
      "output": "/examples/verified-tools/split-chapters-result.zip",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "Alpha and Delta boundaries produce two readable chapter files.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      }
    }
  },
  {
    "slug": "separate-a-bookmarked-manual-into-chapter-pdfs",
    "title": "Separate a bookmarked manual into chapter PDFs",
    "category": "Pages",
    "tool": "split-by-chapters",
    "toolId": "split-chapters",
    "toolNumber": 3,
    "summary": "A six-page manual has Alpha starting at page 1 and Delta starting at page 4.",
    "intent": "Practical example",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Split by chapters",
      "Practical example"
    ],
    "steps": [
      "Open a PDF containing top-level bookmarks.",
      "Export a ZIP split at supported bookmark destinations.",
      "Extract and inspect the first and last page of every chapter."
    ],
    "check": "Bookmarks without local page destinations cannot define boundaries. Nested bookmarks are not chapter boundaries. Page copying can remove editable forms; flatten them explicitly first.",
    "limit": "Requires usable outline entries. Inspect resulting chapter boundaries.",
    "sections": [
      {
        "heading": "The document and the intended outcome",
        "paragraphs": [
          "A six-page manual has Alpha starting at page 1 and Delta starting at page 4. Two supported top-level destinations should define chapters covering positions 1–3 and 4–6."
        ]
      },
      {
        "heading": "Make this example work for your file",
        "paragraphs": [
          "For the manual example, compare every chapter filename with its first heading. A bookmark can point to a title page before the actual chapter; keep that opening page when it belongs to the section."
        ]
      },
      {
        "heading": "Choose only the settings this case needs",
        "paragraphs": [
          "Inspect the top-level outline and its destinations before splitting. After inserting or removing a page, check chapter boundaries again instead of relying on old printed page numbers."
        ]
      },
      {
        "heading": "When the example needs a different approach",
        "paragraphs": [
          "Compare its first page with the source bookmark destination. Remove ambiguous duplicate boundaries or create a clean outline before repeating the split."
        ]
      }
    ],
    "tips": [
      "Inspect the top-level outline and its destinations before splitting. After inserting or removing a page, check chapter boundaries again instead of relying on old printed page numbers.",
      "Open the outline in a reader. Nested entries, remote destinations and an image of a contents page may not supply supported local boundaries. Use explicit Split ranges when necessary.",
      "Compare its first page with the source bookmark destination. Remove ambiguous duplicate boundaries or create a clean outline before repeating the split."
    ],
    "faq": [
      {
        "question": "No top-level bookmarks are reported?",
        "answer": "Open the outline in a reader. Nested entries, remote destinations and an image of a contents page may not supply supported local boundaries. Use explicit Split ranges when necessary."
      },
      {
        "question": "A chapter begins on the wrong page?",
        "answer": "Compare its first page with the source bookmark destination. Remove ambiguous duplicate boundaries or create a clean outline before repeating the split."
      },
      {
        "question": "Can I split a PDF without bookmarks?",
        "answer": "Use Split with explicit page ranges or add bookmarks first."
      },
      {
        "question": "Are nested entries used?",
        "answer": "No. Only supported top-level local destinations define chapters."
      }
    ],
    "hero": {
      "input": "Bookmarked manual",
      "output": "Chapter files"
    },
    "cta": "Open Split by chapters →",
    "evidence": {
      "id": "split-chapters",
      "input": "/examples/verified-tools/split-chapters-input.pdf",
      "output": "/examples/verified-tools/split-chapters-result.zip",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "Alpha and Delta boundaries produce two readable chapter files.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      }
    }
  },
  {
    "slug": "split-by-chapters-common-problems-and-how-to-fix-them",
    "title": "Split by chapters: common problems and how to fix them",
    "category": "Pages",
    "tool": "split-by-chapters",
    "toolId": "split-chapters",
    "toolNumber": 3,
    "summary": "Resolve no top-level bookmarks are reported and a chapter begins on the wrong page. Understand the limits before retrying.",
    "intent": "Troubleshooting",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Split by chapters",
      "Troubleshooting"
    ],
    "steps": [
      "Open a PDF containing top-level bookmarks.",
      "Export a ZIP split at supported bookmark destinations.",
      "Extract and inspect the first and last page of every chapter."
    ],
    "check": "Bookmarks without local page destinations cannot define boundaries. Nested bookmarks are not chapter boundaries. Page copying can remove editable forms; flatten them explicitly first.",
    "limit": "Requires usable outline entries. Inspect resulting chapter boundaries.",
    "sections": [
      {
        "heading": "No top-level bookmarks are reported",
        "paragraphs": [
          "Open the outline in a reader. Nested entries, remote destinations and an image of a contents page may not supply supported local boundaries. Use explicit Split ranges when necessary."
        ]
      },
      {
        "heading": "A chapter begins on the wrong page",
        "paragraphs": [
          "Compare its first page with the source bookmark destination. Remove ambiguous duplicate boundaries or create a clean outline before repeating the split."
        ]
      },
      {
        "heading": "Check whether this is the right operation",
        "paragraphs": [
          "The splitter uses bookmark destinations, not headings printed on the paper. A visible table of contents is not the same as the document outline available in a reader sidebar."
        ]
      },
      {
        "heading": "A more useful retry",
        "paragraphs": [
          "For the manual example, compare every chapter filename with its first heading. A bookmark can point to a title page before the actual chapter; keep that opening page when it belongs to the section."
        ]
      }
    ],
    "tips": [
      "Inspect the top-level outline and its destinations before splitting. After inserting or removing a page, check chapter boundaries again instead of relying on old printed page numbers.",
      "Open the outline in a reader. Nested entries, remote destinations and an image of a contents page may not supply supported local boundaries. Use explicit Split ranges when necessary.",
      "Compare its first page with the source bookmark destination. Remove ambiguous duplicate boundaries or create a clean outline before repeating the split."
    ],
    "faq": [
      {
        "question": "No top-level bookmarks are reported?",
        "answer": "Open the outline in a reader. Nested entries, remote destinations and an image of a contents page may not supply supported local boundaries. Use explicit Split ranges when necessary."
      },
      {
        "question": "A chapter begins on the wrong page?",
        "answer": "Compare its first page with the source bookmark destination. Remove ambiguous duplicate boundaries or create a clean outline before repeating the split."
      },
      {
        "question": "Can I split a PDF without bookmarks?",
        "answer": "Use Split with explicit page ranges or add bookmarks first."
      },
      {
        "question": "Are nested entries used?",
        "answer": "No. Only supported top-level local destinations define chapters."
      }
    ],
    "hero": {
      "input": "Bookmarked manual",
      "output": "Chapter files"
    },
    "cta": "Open Split by chapters →",
    "evidence": {
      "id": "split-chapters",
      "input": "/examples/verified-tools/split-chapters-input.pdf",
      "output": "/examples/verified-tools/split-chapters-result.zip",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "Alpha and Delta boundaries produce two readable chapter files.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      }
    }
  },
  {
    "slug": "how-to-check-a-pdf-for-blank-pages",
    "title": "How to check a PDF for blank pages",
    "category": "Pages",
    "tool": "find-possible-blank-pages",
    "toolId": "blank-check",
    "toolNumber": 4,
    "summary": "Review likely blank pages without deleting them. Learn the available controls, a practical example and what to check.",
    "intent": "How-to",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Find possible blank pages",
      "How-to"
    ],
    "steps": [
      "Open the PDF and run the page check.",
      "Read the reported candidate page numbers.",
      "Inspect candidates in Organize before deleting any page."
    ],
    "check": "This is a heuristic, not proof a page is empty. Small or faint marks can be missed, and scan noise can hide blank pages. No page is automatically deleted.",
    "limit": "Checks selectable text and visible pixels conservatively. Review candidates before optional deletion. No pages are deleted automatically.",
    "sections": [
      {
        "heading": "What this tool actually does",
        "paragraphs": [
          "Blank checking combines text and pixel clues. Pale text, tiny marks, noise and page backgrounds can make automated classifications uncertain. A candidate is a request to review, not an instruction to delete."
        ]
      },
      {
        "heading": "Choose the controls for your document",
        "paragraphs": [
          "Read the candidate page positions in the result. Decide which pages are genuinely unnecessary before the optional deletion step; keep the original download available."
        ]
      },
      {
        "heading": "Before your first export",
        "paragraphs": [
          "A scan may deliberately include a blank reverse side between sections. Decide whether those separators matter before deleting candidates. First inspect the next page so removing a blank does not disrupt a duplex print or front/back pairing."
        ]
      },
      {
        "heading": "A faint page is listed as blank",
        "paragraphs": [
          "Inspect the page at high zoom and deselect it from removal. Do not accept the detection result as proof that faint writing is absent."
        ]
      }
    ],
    "tips": [
      "Read the candidate page positions in the result. Decide which pages are genuinely unnecessary before the optional deletion step; keep the original download available.",
      "Inspect the page at high zoom and deselect it from removal. Do not accept the detection result as proof that faint writing is absent.",
      "Paper texture or scan noise can look like content. Remove a page manually only after inspecting it and confirming it is not needed for front/back pairing."
    ],
    "faq": [
      {
        "question": "A faint page is listed as blank?",
        "answer": "Inspect the page at high zoom and deselect it from removal. Do not accept the detection result as proof that faint writing is absent."
      },
      {
        "question": "An apparently blank scan is not listed?",
        "answer": "Paper texture or scan noise can look like content. Remove a page manually only after inspecting it and confirming it is not needed for front/back pairing."
      },
      {
        "question": "Will it delete pages?",
        "answer": "No. Review and remove candidates yourself in Organize."
      },
      {
        "question": "Does this change the original?",
        "answer": "No. An unchanged single PDF keeps its original bytes."
      }
    ],
    "hero": {
      "input": "Scanned pages",
      "output": "Candidate list"
    },
    "cta": "Open Find possible blank pages →",
    "evidence": {
      "id": "blank-check",
      "input": "/examples/verified-tools/blank-check-input.pdf",
      "output": "/examples/verified-tools/blank-check-result.pdf",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "Empty page two is flagged; faint text and scan pages three and four are retained.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      },
      "preview": {
        "input": "/examples/verified-tools/blank-check-input.png",
        "output": "/examples/verified-tools/blank-check-result.png"
      }
    }
  },
  {
    "slug": "review-empty-scan-sheets-without-losing-faint-content",
    "title": "Review empty scan sheets without losing faint content",
    "category": "Pages",
    "tool": "find-possible-blank-pages",
    "toolId": "blank-check",
    "toolNumber": 4,
    "summary": "A scan contains a truly empty page, a faint note and a pale scanned mark.",
    "intent": "Practical example",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Find possible blank pages",
      "Practical example"
    ],
    "steps": [
      "Open the PDF and run the page check.",
      "Read the reported candidate page numbers.",
      "Inspect candidates in Organize before deleting any page."
    ],
    "check": "This is a heuristic, not proof a page is empty. Small or faint marks can be missed, and scan noise can hide blank pages. No page is automatically deleted.",
    "limit": "Checks selectable text and visible pixels conservatively. Review candidates before optional deletion. No pages are deleted automatically.",
    "sections": [
      {
        "heading": "The document and the intended outcome",
        "paragraphs": [
          "A scan contains a truly empty page, a faint note and a pale scanned mark. Use the result as a candidate list, inspect each page at high zoom, and retain anything with meaningful content."
        ]
      },
      {
        "heading": "Make this example work for your file",
        "paragraphs": [
          "A scan may deliberately include a blank reverse side between sections. Decide whether those separators matter before deleting candidates. First inspect the next page so removing a blank does not disrupt a duplex print or front/back pairing."
        ]
      },
      {
        "heading": "Choose only the settings this case needs",
        "paragraphs": [
          "Read the candidate page positions in the result. Decide which pages are genuinely unnecessary before the optional deletion step; keep the original download available."
        ]
      },
      {
        "heading": "When the example needs a different approach",
        "paragraphs": [
          "Paper texture or scan noise can look like content. Remove a page manually only after inspecting it and confirming it is not needed for front/back pairing."
        ]
      }
    ],
    "tips": [
      "Read the candidate page positions in the result. Decide which pages are genuinely unnecessary before the optional deletion step; keep the original download available.",
      "Inspect the page at high zoom and deselect it from removal. Do not accept the detection result as proof that faint writing is absent.",
      "Paper texture or scan noise can look like content. Remove a page manually only after inspecting it and confirming it is not needed for front/back pairing."
    ],
    "faq": [
      {
        "question": "A faint page is listed as blank?",
        "answer": "Inspect the page at high zoom and deselect it from removal. Do not accept the detection result as proof that faint writing is absent."
      },
      {
        "question": "An apparently blank scan is not listed?",
        "answer": "Paper texture or scan noise can look like content. Remove a page manually only after inspecting it and confirming it is not needed for front/back pairing."
      },
      {
        "question": "Will it delete pages?",
        "answer": "No. Review and remove candidates yourself in Organize."
      },
      {
        "question": "Does this change the original?",
        "answer": "No. An unchanged single PDF keeps its original bytes."
      }
    ],
    "hero": {
      "input": "Scanned pages",
      "output": "Candidate list"
    },
    "cta": "Open Find possible blank pages →",
    "evidence": {
      "id": "blank-check",
      "input": "/examples/verified-tools/blank-check-input.pdf",
      "output": "/examples/verified-tools/blank-check-result.pdf",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "Empty page two is flagged; faint text and scan pages three and four are retained.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      },
      "preview": {
        "input": "/examples/verified-tools/blank-check-input.png",
        "output": "/examples/verified-tools/blank-check-result.png"
      }
    }
  },
  {
    "slug": "find-possible-blank-pages-common-problems-and-how-to-fix-them",
    "title": "Find possible blank pages: common problems and how to fix them",
    "category": "Pages",
    "tool": "find-possible-blank-pages",
    "toolId": "blank-check",
    "toolNumber": 4,
    "summary": "Resolve a faint page is listed as blank and an apparently blank scan is not listed. Understand the limits before retrying.",
    "intent": "Troubleshooting",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Find possible blank pages",
      "Troubleshooting"
    ],
    "steps": [
      "Open the PDF and run the page check.",
      "Read the reported candidate page numbers.",
      "Inspect candidates in Organize before deleting any page."
    ],
    "check": "This is a heuristic, not proof a page is empty. Small or faint marks can be missed, and scan noise can hide blank pages. No page is automatically deleted.",
    "limit": "Checks selectable text and visible pixels conservatively. Review candidates before optional deletion. No pages are deleted automatically.",
    "sections": [
      {
        "heading": "A faint page is listed as blank",
        "paragraphs": [
          "Inspect the page at high zoom and deselect it from removal. Do not accept the detection result as proof that faint writing is absent."
        ]
      },
      {
        "heading": "An apparently blank scan is not listed",
        "paragraphs": [
          "Paper texture or scan noise can look like content. Remove a page manually only after inspecting it and confirming it is not needed for front/back pairing."
        ]
      },
      {
        "heading": "Check whether this is the right operation",
        "paragraphs": [
          "Blank checking combines text and pixel clues. Pale text, tiny marks, noise and page backgrounds can make automated classifications uncertain. A candidate is a request to review, not an instruction to delete."
        ]
      },
      {
        "heading": "A more useful retry",
        "paragraphs": [
          "A scan may deliberately include a blank reverse side between sections. Decide whether those separators matter before deleting candidates. First inspect the next page so removing a blank does not disrupt a duplex print or front/back pairing."
        ]
      }
    ],
    "tips": [
      "Read the candidate page positions in the result. Decide which pages are genuinely unnecessary before the optional deletion step; keep the original download available.",
      "Inspect the page at high zoom and deselect it from removal. Do not accept the detection result as proof that faint writing is absent.",
      "Paper texture or scan noise can look like content. Remove a page manually only after inspecting it and confirming it is not needed for front/back pairing."
    ],
    "faq": [
      {
        "question": "A faint page is listed as blank?",
        "answer": "Inspect the page at high zoom and deselect it from removal. Do not accept the detection result as proof that faint writing is absent."
      },
      {
        "question": "An apparently blank scan is not listed?",
        "answer": "Paper texture or scan noise can look like content. Remove a page manually only after inspecting it and confirming it is not needed for front/back pairing."
      },
      {
        "question": "Will it delete pages?",
        "answer": "No. Review and remove candidates yourself in Organize."
      },
      {
        "question": "Does this change the original?",
        "answer": "No. An unchanged single PDF keeps its original bytes."
      }
    ],
    "hero": {
      "input": "Scanned pages",
      "output": "Candidate list"
    },
    "cta": "Open Find possible blank pages →",
    "evidence": {
      "id": "blank-check",
      "input": "/examples/verified-tools/blank-check-input.pdf",
      "output": "/examples/verified-tools/blank-check-result.pdf",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "Empty page two is flagged; faint text and scan pages three and four are retained.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      },
      "preview": {
        "input": "/examples/verified-tools/blank-check-input.png",
        "output": "/examples/verified-tools/blank-check-result.png"
      }
    }
  },
  {
    "slug": "how-to-read-and-navigate-a-pdf-in-your-browser",
    "title": "How to read and navigate a PDF in your browser",
    "category": "Pages",
    "tool": "pdf-reader",
    "toolId": "reader",
    "toolNumber": 5,
    "summary": "Read, search and navigate a PDF without changing it. Learn the available controls, a practical example and what to check.",
    "intent": "How-to",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "PDF Reader",
      "How-to"
    ],
    "steps": [
      "Choose your PDF. On a phone, pages scroll continuously below the attached reading toolbar.",
      "Use the page-number field to jump, the zoom control to fit the page width, or Search and reading options for text search, the outline and bookmarks. The + button adds PDF files.",
      "Read without exporting. On desktop, the existing reading views and download controls remain available. View rotation does not change the PDF."
    ],
    "check": "View rotation and zoom do not alter document bytes. Extracted text can have an incorrect reading order in untagged documents. The Reader prompts for a password for protected files. Reading retains the encrypted source; use Remove password explicitly before editing.",
    "limit": "Single-page, continuous and wide-screen two-page viewing, on-page text selection, search and document outlines. Scans need OCR for search.",
    "sections": [
      {
        "heading": "What this tool actually does",
        "paragraphs": [
          "Reader zoom and viewing layout affect the screen, not the original file. Two-page viewing is useful on a wide screen; continuous single-column reading usually makes better use of a phone."
        ]
      },
      {
        "heading": "Choose the controls for your document",
        "paragraphs": [
          "Choose the viewing mode before adjusting zoom. Search real text and use page positions for navigation. Keep page orientation changes in the reader separate from exported Rotate changes."
        ]
      },
      {
        "heading": "Before your first export",
        "paragraphs": [
          "For a long manual, navigate with its outline rather than scrolling through every page. Search a distinctive phrase to find a section, then read the surrounding paragraph; a match alone may lack the context needed to interpret it."
        ]
      },
      {
        "heading": "Search finds no word in a scan",
        "paragraphs": [
          "A photographed page has no text layer to search. Make a searchable copy with OCR first, then verify recognition against the visible page."
        ]
      }
    ],
    "tips": [
      "Choose the viewing mode before adjusting zoom. Search real text and use page positions for navigation. Keep page orientation changes in the reader separate from exported Rotate changes.",
      "A photographed page has no text layer to search. Make a searchable copy with OCR first, then verify recognition against the visible page.",
      "The PDF may not contain bookmarks. Use page navigation or search; printed chapter titles alone do not create reader outline entries."
    ],
    "faq": [
      {
        "question": "Search finds no word in a scan?",
        "answer": "A photographed page has no text layer to search. Make a searchable copy with OCR first, then verify recognition against the visible page."
      },
      {
        "question": "The outline panel is empty?",
        "answer": "The PDF may not contain bookmarks. Use page navigation or search; printed chapter titles alone do not create reader outline entries."
      },
      {
        "question": "Can I search a scan?",
        "answer": "Image-only pages have no searchable text. Run OCR first."
      },
      {
        "question": "Does reading alter my file?",
        "answer": "No. A single unchanged PDF is returned byte-for-byte. Workspace edits are exported into the reader copy."
      }
    ],
    "hero": {
      "input": "Long PDF",
      "output": "Read and search"
    },
    "cta": "Open PDF Reader →"
  },
  {
    "slug": "read-a-long-pdf-with-search-and-continuous-scrolling",
    "title": "Read a long PDF with search and continuous scrolling",
    "category": "Pages",
    "tool": "pdf-reader",
    "toolId": "reader",
    "toolNumber": 5,
    "summary": "A reader wants to review a long manual and jump to Alpha without editing it.",
    "intent": "Practical example",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "PDF Reader",
      "Practical example"
    ],
    "steps": [
      "Choose your PDF. On a phone, pages scroll continuously below the attached reading toolbar.",
      "Use the page-number field to jump, the zoom control to fit the page width, or Search and reading options for text search, the outline and bookmarks. The + button adds PDF files.",
      "Read without exporting. On desktop, the existing reading views and download controls remain available. View rotation does not change the PDF."
    ],
    "check": "View rotation and zoom do not alter document bytes. Extracted text can have an incorrect reading order in untagged documents. The Reader prompts for a password for protected files. Reading retains the encrypted source; use Remove password explicitly before editing.",
    "limit": "Single-page, continuous and wide-screen two-page viewing, on-page text selection, search and document outlines. Scans need OCR for search.",
    "sections": [
      {
        "heading": "The document and the intended outcome",
        "paragraphs": [
          "A reader wants to review a long manual and jump to Alpha without editing it. Open the document, select continuous viewing, search for a known word and use its outline where available."
        ]
      },
      {
        "heading": "Make this example work for your file",
        "paragraphs": [
          "For a long manual, navigate with its outline rather than scrolling through every page. Search a distinctive phrase to find a section, then read the surrounding paragraph; a match alone may lack the context needed to interpret it."
        ]
      },
      {
        "heading": "Choose only the settings this case needs",
        "paragraphs": [
          "Choose the viewing mode before adjusting zoom. Search real text and use page positions for navigation. Keep page orientation changes in the reader separate from exported Rotate changes."
        ]
      },
      {
        "heading": "When the example needs a different approach",
        "paragraphs": [
          "The PDF may not contain bookmarks. Use page navigation or search; printed chapter titles alone do not create reader outline entries."
        ]
      }
    ],
    "tips": [
      "Choose the viewing mode before adjusting zoom. Search real text and use page positions for navigation. Keep page orientation changes in the reader separate from exported Rotate changes.",
      "A photographed page has no text layer to search. Make a searchable copy with OCR first, then verify recognition against the visible page.",
      "The PDF may not contain bookmarks. Use page navigation or search; printed chapter titles alone do not create reader outline entries."
    ],
    "faq": [
      {
        "question": "Search finds no word in a scan?",
        "answer": "A photographed page has no text layer to search. Make a searchable copy with OCR first, then verify recognition against the visible page."
      },
      {
        "question": "The outline panel is empty?",
        "answer": "The PDF may not contain bookmarks. Use page navigation or search; printed chapter titles alone do not create reader outline entries."
      },
      {
        "question": "Can I search a scan?",
        "answer": "Image-only pages have no searchable text. Run OCR first."
      },
      {
        "question": "Does reading alter my file?",
        "answer": "No. A single unchanged PDF is returned byte-for-byte. Workspace edits are exported into the reader copy."
      }
    ],
    "hero": {
      "input": "Long PDF",
      "output": "Read and search"
    },
    "cta": "Open PDF Reader →"
  },
  {
    "slug": "pdf-reader-common-problems-and-how-to-fix-them",
    "title": "PDF Reader: common problems and how to fix them",
    "category": "Pages",
    "tool": "pdf-reader",
    "toolId": "reader",
    "toolNumber": 5,
    "summary": "Resolve search finds no word in a scan and the outline panel is empty. Understand the limits before retrying.",
    "intent": "Troubleshooting",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "PDF Reader",
      "Troubleshooting"
    ],
    "steps": [
      "Choose your PDF. On a phone, pages scroll continuously below the attached reading toolbar.",
      "Use the page-number field to jump, the zoom control to fit the page width, or Search and reading options for text search, the outline and bookmarks. The + button adds PDF files.",
      "Read without exporting. On desktop, the existing reading views and download controls remain available. View rotation does not change the PDF."
    ],
    "check": "View rotation and zoom do not alter document bytes. Extracted text can have an incorrect reading order in untagged documents. The Reader prompts for a password for protected files. Reading retains the encrypted source; use Remove password explicitly before editing.",
    "limit": "Single-page, continuous and wide-screen two-page viewing, on-page text selection, search and document outlines. Scans need OCR for search.",
    "sections": [
      {
        "heading": "Search finds no word in a scan",
        "paragraphs": [
          "A photographed page has no text layer to search. Make a searchable copy with OCR first, then verify recognition against the visible page."
        ]
      },
      {
        "heading": "The outline panel is empty",
        "paragraphs": [
          "The PDF may not contain bookmarks. Use page navigation or search; printed chapter titles alone do not create reader outline entries."
        ]
      },
      {
        "heading": "Check whether this is the right operation",
        "paragraphs": [
          "Reader zoom and viewing layout affect the screen, not the original file. Two-page viewing is useful on a wide screen; continuous single-column reading usually makes better use of a phone."
        ]
      },
      {
        "heading": "A more useful retry",
        "paragraphs": [
          "For a long manual, navigate with its outline rather than scrolling through every page. Search a distinctive phrase to find a section, then read the surrounding paragraph; a match alone may lack the context needed to interpret it."
        ]
      }
    ],
    "tips": [
      "Choose the viewing mode before adjusting zoom. Search real text and use page positions for navigation. Keep page orientation changes in the reader separate from exported Rotate changes.",
      "A photographed page has no text layer to search. Make a searchable copy with OCR first, then verify recognition against the visible page.",
      "The PDF may not contain bookmarks. Use page navigation or search; printed chapter titles alone do not create reader outline entries."
    ],
    "faq": [
      {
        "question": "Search finds no word in a scan?",
        "answer": "A photographed page has no text layer to search. Make a searchable copy with OCR first, then verify recognition against the visible page."
      },
      {
        "question": "The outline panel is empty?",
        "answer": "The PDF may not contain bookmarks. Use page navigation or search; printed chapter titles alone do not create reader outline entries."
      },
      {
        "question": "Can I search a scan?",
        "answer": "Image-only pages have no searchable text. Run OCR first."
      },
      {
        "question": "Does reading alter my file?",
        "answer": "No. A single unchanged PDF is returned byte-for-byte. Workspace edits are exported into the reader copy."
      }
    ],
    "hero": {
      "input": "Long PDF",
      "output": "Read and search"
    },
    "cta": "Open PDF Reader →"
  },
  {
    "slug": "how-to-export-pdf-pages-as-webp-images",
    "title": "How to export PDF pages as WebP images",
    "category": "Convert",
    "tool": "pdf-to-webp",
    "toolId": "webp",
    "toolNumber": 6,
    "summary": "Export lightweight page images in a ZIP. Learn the available controls, a practical example and what to check.",
    "intent": "How-to",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "PDF to WebP",
      "How-to"
    ],
    "steps": [
      "Open a PDF and review its pages.",
      "Choose screen, standard or print resolution.",
      "Export the ZIP, extract it and check the WebP page images."
    ],
    "check": "Images do not preserve searchable text or forms. Browsers without WebP encoding receive an error and can use PNG or JPG instead.",
    "limit": "Rendered page images, not editable text. Requires browser WebP encoding support.",
    "sections": [
      {
        "heading": "What this tool actually does",
        "paragraphs": [
          "WebP is an image output. The pixels capture visible page appearance but do not retain PDF text selection, editable fields or clickable PDF links."
        ]
      },
      {
        "heading": "Choose the controls for your document",
        "paragraphs": [
          "Choose a resolution suited to the image display. Begin with a moderate setting; higher resolution increases pixel count and memory, not the original scan detail."
        ]
      },
      {
        "heading": "Before your first export",
        "paragraphs": [
          "For website previews, export only the pages the reader needs. Serve the rendered images as illustrations and keep a separately accessible PDF link; an image gallery does not retain the document’s searchable or interactive features."
        ]
      },
      {
        "heading": "WebP encoding is unavailable",
        "paragraphs": [
          "Use PNG or JPG on a browser that cannot encode WebP. Renaming a PNG with a .webp extension does not convert it."
        ]
      }
    ],
    "tips": [
      "Choose a resolution suited to the image display. Begin with a moderate setting; higher resolution increases pixel count and memory, not the original scan detail.",
      "Use PNG or JPG on a browser that cannot encode WebP. Renaming a PNG with a .webp extension does not convert it.",
      "Increase rendering resolution for a short trial, then compare the actual image. A low-detail source image may remain blurred at every setting."
    ],
    "faq": [
      {
        "question": "WebP encoding is unavailable?",
        "answer": "Use PNG or JPG on a browser that cannot encode WebP. Renaming a PNG with a .webp extension does not convert it."
      },
      {
        "question": "Small print is blurred?",
        "answer": "Increase rendering resolution for a short trial, then compare the actual image. A low-detail source image may remain blurred at every setting."
      }
    ],
    "hero": {
      "input": "PDF pages",
      "output": "WebP images"
    },
    "cta": "Open PDF to WebP →"
  },
  {
    "slug": "create-compact-pdf-page-images-for-a-website",
    "title": "Create compact PDF page images for a website",
    "category": "Convert",
    "tool": "pdf-to-webp",
    "toolId": "webp",
    "toolNumber": 6,
    "summary": "A three-page handout needs image previews for a webpage.",
    "intent": "Practical example",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "PDF to WebP",
      "Practical example"
    ],
    "steps": [
      "Open a PDF and review its pages.",
      "Choose screen, standard or print resolution.",
      "Export the ZIP, extract it and check the WebP page images."
    ],
    "check": "Images do not preserve searchable text or forms. Browsers without WebP encoding receive an error and can use PNG or JPG instead.",
    "limit": "Rendered page images, not editable text. Requires browser WebP encoding support.",
    "sections": [
      {
        "heading": "The document and the intended outcome",
        "paragraphs": [
          "A three-page handout needs image previews for a webpage. Export WebP page images, extract the ZIP and inspect each page at its intended display size."
        ]
      },
      {
        "heading": "Make this example work for your file",
        "paragraphs": [
          "For website previews, export only the pages the reader needs. Serve the rendered images as illustrations and keep a separately accessible PDF link; an image gallery does not retain the document’s searchable or interactive features."
        ]
      },
      {
        "heading": "Choose only the settings this case needs",
        "paragraphs": [
          "Choose a resolution suited to the image display. Begin with a moderate setting; higher resolution increases pixel count and memory, not the original scan detail."
        ]
      },
      {
        "heading": "When the example needs a different approach",
        "paragraphs": [
          "Increase rendering resolution for a short trial, then compare the actual image. A low-detail source image may remain blurred at every setting."
        ]
      }
    ],
    "tips": [
      "Choose a resolution suited to the image display. Begin with a moderate setting; higher resolution increases pixel count and memory, not the original scan detail.",
      "Use PNG or JPG on a browser that cannot encode WebP. Renaming a PNG with a .webp extension does not convert it.",
      "Increase rendering resolution for a short trial, then compare the actual image. A low-detail source image may remain blurred at every setting."
    ],
    "faq": [
      {
        "question": "WebP encoding is unavailable?",
        "answer": "Use PNG or JPG on a browser that cannot encode WebP. Renaming a PNG with a .webp extension does not convert it."
      },
      {
        "question": "Small print is blurred?",
        "answer": "Increase rendering resolution for a short trial, then compare the actual image. A low-detail source image may remain blurred at every setting."
      }
    ],
    "hero": {
      "input": "PDF pages",
      "output": "WebP images"
    },
    "cta": "Open PDF to WebP →"
  },
  {
    "slug": "pdf-to-webp-common-problems-and-how-to-fix-them",
    "title": "PDF to WebP: common problems and how to fix them",
    "category": "Convert",
    "tool": "pdf-to-webp",
    "toolId": "webp",
    "toolNumber": 6,
    "summary": "Resolve webp encoding is unavailable and small print is blurred. Understand the limits before retrying.",
    "intent": "Troubleshooting",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "PDF to WebP",
      "Troubleshooting"
    ],
    "steps": [
      "Open a PDF and review its pages.",
      "Choose screen, standard or print resolution.",
      "Export the ZIP, extract it and check the WebP page images."
    ],
    "check": "Images do not preserve searchable text or forms. Browsers without WebP encoding receive an error and can use PNG or JPG instead.",
    "limit": "Rendered page images, not editable text. Requires browser WebP encoding support.",
    "sections": [
      {
        "heading": "WebP encoding is unavailable",
        "paragraphs": [
          "Use PNG or JPG on a browser that cannot encode WebP. Renaming a PNG with a .webp extension does not convert it."
        ]
      },
      {
        "heading": "Small print is blurred",
        "paragraphs": [
          "Increase rendering resolution for a short trial, then compare the actual image. A low-detail source image may remain blurred at every setting."
        ]
      },
      {
        "heading": "Check whether this is the right operation",
        "paragraphs": [
          "WebP is an image output. The pixels capture visible page appearance but do not retain PDF text selection, editable fields or clickable PDF links."
        ]
      },
      {
        "heading": "A more useful retry",
        "paragraphs": [
          "For website previews, export only the pages the reader needs. Serve the rendered images as illustrations and keep a separately accessible PDF link; an image gallery does not retain the document’s searchable or interactive features."
        ]
      }
    ],
    "tips": [
      "Choose a resolution suited to the image display. Begin with a moderate setting; higher resolution increases pixel count and memory, not the original scan detail.",
      "Use PNG or JPG on a browser that cannot encode WebP. Renaming a PNG with a .webp extension does not convert it.",
      "Increase rendering resolution for a short trial, then compare the actual image. A low-detail source image may remain blurred at every setting."
    ],
    "faq": [
      {
        "question": "WebP encoding is unavailable?",
        "answer": "Use PNG or JPG on a browser that cannot encode WebP. Renaming a PNG with a .webp extension does not convert it."
      },
      {
        "question": "Small print is blurred?",
        "answer": "Increase rendering resolution for a short trial, then compare the actual image. A low-detail source image may remain blurred at every setting."
      }
    ],
    "hero": {
      "input": "PDF pages",
      "output": "WebP images"
    },
    "cta": "Open PDF to WebP →"
  },
  {
    "slug": "how-to-remove-pdf-bookmarks",
    "title": "How to remove PDF bookmarks",
    "category": "Pages",
    "tool": "remove-bookmarks",
    "toolId": "remove-bookmarks",
    "toolNumber": 7,
    "summary": "Remove the document navigation outline. Learn the available controls, a practical example and what to check.",
    "intent": "How-to",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Remove bookmarks",
      "How-to"
    ],
    "steps": [
      "Open the original single PDF.",
      "Export a copy without its navigation outline.",
      "Reopen the PDF and check page content and reader navigation."
    ],
    "check": "Removes bookmarks only. Page links and visible content remain; export existing workspace changes first.",
    "limit": "Original single PDF only. Page content and links remain; removing navigation does not remove sensitive text.",
    "sections": [
      {
        "heading": "What this tool actually does",
        "paragraphs": [
          "Bookmarks are navigation objects outside the visible page text. Removing them keeps printed headings, page content and ordinary page links."
        ]
      },
      {
        "heading": "Choose the controls for your document",
        "paragraphs": [
          "Use the unchanged source PDF for this operation. If you already edited pages in another tool, export those changes first and open that result as the new source."
        ]
      },
      {
        "heading": "Before your first export",
        "paragraphs": [
          "For a renamed report, remove an obsolete outline only after deciding whether to replace it with useful navigation. A reader without bookmarks may be harder to browse even when every visible page is unchanged."
        ]
      },
      {
        "heading": "The printed contents page remains",
        "paragraphs": [
          "That page is ordinary visible content. Remove it with Organize if appropriate; bookmark removal does not erase words printed on a page."
        ]
      }
    ],
    "tips": [
      "Use the unchanged source PDF for this operation. If you already edited pages in another tool, export those changes first and open that result as the new source.",
      "That page is ordinary visible content. Remove it with Organize if appropriate; bookmark removal does not erase words printed on a page.",
      "Page links are different objects. Use Remove PDF links if that is the intended task, and inspect the result independently."
    ],
    "faq": [
      {
        "question": "The printed contents page remains?",
        "answer": "That page is ordinary visible content. Remove it with Organize if appropriate; bookmark removal does not erase words printed on a page."
      },
      {
        "question": "Links are still clickable?",
        "answer": "Page links are different objects. Use Remove PDF links if that is the intended task, and inspect the result independently."
      }
    ],
    "hero": {
      "input": "PDF outline",
      "output": "No outline"
    },
    "cta": "Open Remove bookmarks →",
    "evidence": {
      "id": "remove-bookmarks",
      "input": "/examples/verified-tools/remove-bookmarks-input.pdf",
      "output": "/examples/verified-tools/remove-bookmarks-result.pdf",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "The document outline is absent.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      },
      "preview": {
        "input": "/examples/verified-tools/remove-bookmarks-input.png",
        "output": "/examples/verified-tools/remove-bookmarks-result.png"
      }
    }
  },
  {
    "slug": "remove-an-outdated-reader-outline-from-a-report",
    "title": "Remove an outdated reader outline from a report",
    "category": "Pages",
    "tool": "remove-bookmarks",
    "toolId": "remove-bookmarks",
    "toolNumber": 7,
    "summary": "A revised report still opens an outline with obsolete chapter labels.",
    "intent": "Practical example",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Remove bookmarks",
      "Practical example"
    ],
    "steps": [
      "Open the original single PDF.",
      "Export a copy without its navigation outline.",
      "Reopen the PDF and check page content and reader navigation."
    ],
    "check": "Removes bookmarks only. Page links and visible content remain; export existing workspace changes first.",
    "limit": "Original single PDF only. Page content and links remain; removing navigation does not remove sensitive text.",
    "sections": [
      {
        "heading": "The document and the intended outcome",
        "paragraphs": [
          "A revised report still opens an outline with obsolete chapter labels. Remove bookmarks from the original single PDF and reopen the copy to confirm the outline is gone."
        ]
      },
      {
        "heading": "Make this example work for your file",
        "paragraphs": [
          "For a renamed report, remove an obsolete outline only after deciding whether to replace it with useful navigation. A reader without bookmarks may be harder to browse even when every visible page is unchanged."
        ]
      },
      {
        "heading": "Choose only the settings this case needs",
        "paragraphs": [
          "Use the unchanged source PDF for this operation. If you already edited pages in another tool, export those changes first and open that result as the new source."
        ]
      },
      {
        "heading": "When the example needs a different approach",
        "paragraphs": [
          "Page links are different objects. Use Remove PDF links if that is the intended task, and inspect the result independently."
        ]
      }
    ],
    "tips": [
      "Use the unchanged source PDF for this operation. If you already edited pages in another tool, export those changes first and open that result as the new source.",
      "That page is ordinary visible content. Remove it with Organize if appropriate; bookmark removal does not erase words printed on a page.",
      "Page links are different objects. Use Remove PDF links if that is the intended task, and inspect the result independently."
    ],
    "faq": [
      {
        "question": "The printed contents page remains?",
        "answer": "That page is ordinary visible content. Remove it with Organize if appropriate; bookmark removal does not erase words printed on a page."
      },
      {
        "question": "Links are still clickable?",
        "answer": "Page links are different objects. Use Remove PDF links if that is the intended task, and inspect the result independently."
      }
    ],
    "hero": {
      "input": "PDF outline",
      "output": "No outline"
    },
    "cta": "Open Remove bookmarks →",
    "evidence": {
      "id": "remove-bookmarks",
      "input": "/examples/verified-tools/remove-bookmarks-input.pdf",
      "output": "/examples/verified-tools/remove-bookmarks-result.pdf",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "The document outline is absent.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      },
      "preview": {
        "input": "/examples/verified-tools/remove-bookmarks-input.png",
        "output": "/examples/verified-tools/remove-bookmarks-result.png"
      }
    }
  },
  {
    "slug": "remove-bookmarks-common-problems-and-how-to-fix-them",
    "title": "Remove bookmarks: common problems and how to fix them",
    "category": "Pages",
    "tool": "remove-bookmarks",
    "toolId": "remove-bookmarks",
    "toolNumber": 7,
    "summary": "Resolve the printed contents page remains and links are still clickable. Understand the limits before retrying.",
    "intent": "Troubleshooting",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Remove bookmarks",
      "Troubleshooting"
    ],
    "steps": [
      "Open the original single PDF.",
      "Export a copy without its navigation outline.",
      "Reopen the PDF and check page content and reader navigation."
    ],
    "check": "Removes bookmarks only. Page links and visible content remain; export existing workspace changes first.",
    "limit": "Original single PDF only. Page content and links remain; removing navigation does not remove sensitive text.",
    "sections": [
      {
        "heading": "The printed contents page remains",
        "paragraphs": [
          "That page is ordinary visible content. Remove it with Organize if appropriate; bookmark removal does not erase words printed on a page."
        ]
      },
      {
        "heading": "Links are still clickable",
        "paragraphs": [
          "Page links are different objects. Use Remove PDF links if that is the intended task, and inspect the result independently."
        ]
      },
      {
        "heading": "Check whether this is the right operation",
        "paragraphs": [
          "Bookmarks are navigation objects outside the visible page text. Removing them keeps printed headings, page content and ordinary page links."
        ]
      },
      {
        "heading": "A more useful retry",
        "paragraphs": [
          "For a renamed report, remove an obsolete outline only after deciding whether to replace it with useful navigation. A reader without bookmarks may be harder to browse even when every visible page is unchanged."
        ]
      }
    ],
    "tips": [
      "Use the unchanged source PDF for this operation. If you already edited pages in another tool, export those changes first and open that result as the new source.",
      "That page is ordinary visible content. Remove it with Organize if appropriate; bookmark removal does not erase words printed on a page.",
      "Page links are different objects. Use Remove PDF links if that is the intended task, and inspect the result independently."
    ],
    "faq": [
      {
        "question": "The printed contents page remains?",
        "answer": "That page is ordinary visible content. Remove it with Organize if appropriate; bookmark removal does not erase words printed on a page."
      },
      {
        "question": "Links are still clickable?",
        "answer": "Page links are different objects. Use Remove PDF links if that is the intended task, and inspect the result independently."
      }
    ],
    "hero": {
      "input": "PDF outline",
      "output": "No outline"
    },
    "cta": "Open Remove bookmarks →",
    "evidence": {
      "id": "remove-bookmarks",
      "input": "/examples/verified-tools/remove-bookmarks-input.pdf",
      "output": "/examples/verified-tools/remove-bookmarks-result.pdf",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "The document outline is absent.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      },
      "preview": {
        "input": "/examples/verified-tools/remove-bookmarks-input.png",
        "output": "/examples/verified-tools/remove-bookmarks-result.png"
      }
    }
  },
  {
    "slug": "how-to-remove-embedded-attachments-from-a-pdf",
    "title": "How to remove embedded attachments from a PDF",
    "category": "Privacy",
    "tool": "remove-embedded-files",
    "toolId": "remove-attachments",
    "toolNumber": 8,
    "summary": "Remove reachable embedded file attachments. Learn the available controls, a practical example and what to check.",
    "intent": "How-to",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Remove embedded files",
      "How-to"
    ],
    "steps": [
      "Open the original single PDF.",
      "Export a copy without reachable embedded-file attachment entries.",
      "Check the reader attachment panel and inspect the output before sharing."
    ],
    "check": "Deletes attachment name trees, associated-file references and attachment annotations. Unreachable objects may remain in the bytes; use a dedicated sanitization workflow for sensitive documents.",
    "limit": "Removes attachment name trees, associated-file references and file-attachment annotations. Not complete sanitization; unreachable historical bytes may remain.",
    "sections": [
      {
        "heading": "What this tool actually does",
        "paragraphs": [
          "A PDF can hold file attachments through several reachable structures. Removing their references is a targeted cleanup; it is not proof every old byte or hidden object has been securely erased."
        ]
      },
      {
        "heading": "Choose the controls for your document",
        "paragraphs": [
          "Work from the original single PDF and check embedded-file entries after export. Also review visible page content because an attachment cleanup does not remove sensitive text on the pages."
        ]
      },
      {
        "heading": "Before your first export",
        "paragraphs": [
          "For an externally shared report, inspect the attachment panel before and after export. An attachment can be a legitimate companion spreadsheet, so keep it separately if the recipient still needs those figures."
        ]
      },
      {
        "heading": "The document still contains sensitive information",
        "paragraphs": [
          "Inspect metadata, page text and other objects separately. Attachment removal addresses companion files, not a complete privacy review."
        ]
      }
    ],
    "tips": [
      "Work from the original single PDF and check embedded-file entries after export. Also review visible page content because an attachment cleanup does not remove sensitive text on the pages.",
      "Inspect metadata, page text and other objects separately. Attachment removal addresses companion files, not a complete privacy review.",
      "It may be flattened artwork rather than a live attachment annotation. Confirm whether a file can actually be opened from it before choosing another editing action."
    ],
    "faq": [
      {
        "question": "The document still contains sensitive information?",
        "answer": "Inspect metadata, page text and other objects separately. Attachment removal addresses companion files, not a complete privacy review."
      },
      {
        "question": "An attachment symbol remains on a page?",
        "answer": "It may be flattened artwork rather than a live attachment annotation. Confirm whether a file can actually be opened from it before choosing another editing action."
      }
    ],
    "hero": {
      "input": "Attached PDF",
      "output": "Reading copy"
    },
    "cta": "Open Remove embedded files →",
    "evidence": {
      "id": "remove-attachments",
      "input": "/examples/verified-tools/remove-attachments-input.pdf",
      "output": "/examples/verified-tools/remove-attachments-result.pdf",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "Reachable embedded-file name tree is absent.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      },
      "preview": {
        "input": "/examples/verified-tools/remove-attachments-input.png",
        "output": "/examples/verified-tools/remove-attachments-result.png"
      }
    }
  },
  {
    "slug": "share-a-report-without-its-embedded-companion-files",
    "title": "Share a report without its embedded companion files",
    "category": "Privacy",
    "tool": "remove-embedded-files",
    "toolId": "remove-attachments",
    "toolNumber": 8,
    "summary": "A report includes an embedded source spreadsheet that should not travel with the reading copy.",
    "intent": "Practical example",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Remove embedded files",
      "Practical example"
    ],
    "steps": [
      "Open the original single PDF.",
      "Export a copy without reachable embedded-file attachment entries.",
      "Check the reader attachment panel and inspect the output before sharing."
    ],
    "check": "Deletes attachment name trees, associated-file references and attachment annotations. Unreachable objects may remain in the bytes; use a dedicated sanitization workflow for sensitive documents.",
    "limit": "Removes attachment name trees, associated-file references and file-attachment annotations. Not complete sanitization; unreachable historical bytes may remain.",
    "sections": [
      {
        "heading": "The document and the intended outcome",
        "paragraphs": [
          "A report includes an embedded source spreadsheet that should not travel with the reading copy. Remove reachable embedded files, then inspect the attachment panel in a reader."
        ]
      },
      {
        "heading": "Make this example work for your file",
        "paragraphs": [
          "For an externally shared report, inspect the attachment panel before and after export. An attachment can be a legitimate companion spreadsheet, so keep it separately if the recipient still needs those figures."
        ]
      },
      {
        "heading": "Choose only the settings this case needs",
        "paragraphs": [
          "Work from the original single PDF and check embedded-file entries after export. Also review visible page content because an attachment cleanup does not remove sensitive text on the pages."
        ]
      },
      {
        "heading": "When the example needs a different approach",
        "paragraphs": [
          "It may be flattened artwork rather than a live attachment annotation. Confirm whether a file can actually be opened from it before choosing another editing action."
        ]
      }
    ],
    "tips": [
      "Work from the original single PDF and check embedded-file entries after export. Also review visible page content because an attachment cleanup does not remove sensitive text on the pages.",
      "Inspect metadata, page text and other objects separately. Attachment removal addresses companion files, not a complete privacy review.",
      "It may be flattened artwork rather than a live attachment annotation. Confirm whether a file can actually be opened from it before choosing another editing action."
    ],
    "faq": [
      {
        "question": "The document still contains sensitive information?",
        "answer": "Inspect metadata, page text and other objects separately. Attachment removal addresses companion files, not a complete privacy review."
      },
      {
        "question": "An attachment symbol remains on a page?",
        "answer": "It may be flattened artwork rather than a live attachment annotation. Confirm whether a file can actually be opened from it before choosing another editing action."
      }
    ],
    "hero": {
      "input": "Attached PDF",
      "output": "Reading copy"
    },
    "cta": "Open Remove embedded files →",
    "evidence": {
      "id": "remove-attachments",
      "input": "/examples/verified-tools/remove-attachments-input.pdf",
      "output": "/examples/verified-tools/remove-attachments-result.pdf",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "Reachable embedded-file name tree is absent.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      },
      "preview": {
        "input": "/examples/verified-tools/remove-attachments-input.png",
        "output": "/examples/verified-tools/remove-attachments-result.png"
      }
    }
  },
  {
    "slug": "remove-embedded-files-common-problems-and-how-to-fix-them",
    "title": "Remove embedded files: common problems and how to fix them",
    "category": "Privacy",
    "tool": "remove-embedded-files",
    "toolId": "remove-attachments",
    "toolNumber": 8,
    "summary": "Resolve the document still contains sensitive information and an attachment symbol remains on a page. Understand the limits before retrying.",
    "intent": "Troubleshooting",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Remove embedded files",
      "Troubleshooting"
    ],
    "steps": [
      "Open the original single PDF.",
      "Export a copy without reachable embedded-file attachment entries.",
      "Check the reader attachment panel and inspect the output before sharing."
    ],
    "check": "Deletes attachment name trees, associated-file references and attachment annotations. Unreachable objects may remain in the bytes; use a dedicated sanitization workflow for sensitive documents.",
    "limit": "Removes attachment name trees, associated-file references and file-attachment annotations. Not complete sanitization; unreachable historical bytes may remain.",
    "sections": [
      {
        "heading": "The document still contains sensitive information",
        "paragraphs": [
          "Inspect metadata, page text and other objects separately. Attachment removal addresses companion files, not a complete privacy review."
        ]
      },
      {
        "heading": "An attachment symbol remains on a page",
        "paragraphs": [
          "It may be flattened artwork rather than a live attachment annotation. Confirm whether a file can actually be opened from it before choosing another editing action."
        ]
      },
      {
        "heading": "Check whether this is the right operation",
        "paragraphs": [
          "A PDF can hold file attachments through several reachable structures. Removing their references is a targeted cleanup; it is not proof every old byte or hidden object has been securely erased."
        ]
      },
      {
        "heading": "A more useful retry",
        "paragraphs": [
          "For an externally shared report, inspect the attachment panel before and after export. An attachment can be a legitimate companion spreadsheet, so keep it separately if the recipient still needs those figures."
        ]
      }
    ],
    "tips": [
      "Work from the original single PDF and check embedded-file entries after export. Also review visible page content because an attachment cleanup does not remove sensitive text on the pages.",
      "Inspect metadata, page text and other objects separately. Attachment removal addresses companion files, not a complete privacy review.",
      "It may be flattened artwork rather than a live attachment annotation. Confirm whether a file can actually be opened from it before choosing another editing action."
    ],
    "faq": [
      {
        "question": "The document still contains sensitive information?",
        "answer": "Inspect metadata, page text and other objects separately. Attachment removal addresses companion files, not a complete privacy review."
      },
      {
        "question": "An attachment symbol remains on a page?",
        "answer": "It may be flattened artwork rather than a live attachment annotation. Confirm whether a file can actually be opened from it before choosing another editing action."
      }
    ],
    "hero": {
      "input": "Attached PDF",
      "output": "Reading copy"
    },
    "cta": "Open Remove embedded files →",
    "evidence": {
      "id": "remove-attachments",
      "input": "/examples/verified-tools/remove-attachments-input.pdf",
      "output": "/examples/verified-tools/remove-attachments-result.pdf",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "Reachable embedded-file name tree is absent.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      },
      "preview": {
        "input": "/examples/verified-tools/remove-attachments-input.png",
        "output": "/examples/verified-tools/remove-attachments-result.png"
      }
    }
  },
  {
    "slug": "how-to-remove-clickable-links-from-a-pdf",
    "title": "How to remove clickable links from a PDF",
    "category": "Privacy",
    "tool": "remove-pdf-links",
    "toolId": "remove-links",
    "toolNumber": 9,
    "summary": "Remove clickable page link annotations. Learn the available controls, a practical example and what to check.",
    "intent": "How-to",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Remove PDF links",
      "How-to"
    ],
    "steps": [
      "Open the original single PDF.",
      "Export a copy without page Link annotations.",
      "Check that visible text and form fields still appear."
    ],
    "check": "Visible URL text, bookmarks, comments and forms remain. This does not remove scripts or securely sanitize a document.",
    "limit": "Keeps visible text, comments and form widgets. Text that looks like a URL remains visible. Original single PDF only.",
    "sections": [
      {
        "heading": "What this tool actually does",
        "paragraphs": [
          "A Link annotation makes an area interactive. The visible letters beneath it are separate page content, and some readers automatically recognize addresses even without an annotation."
        ]
      },
      {
        "heading": "Choose the controls for your document",
        "paragraphs": [
          "Use an original single PDF. Check an explicit external link and an internal page link in a reader that exposes annotations; do not judge only by blue text."
        ]
      },
      {
        "heading": "Before your first export",
        "paragraphs": [
          "For a handout, removal should leave the printed address readable when it forms part of the explanation. If the address itself is private, link removal is insufficient; use a content-removal workflow instead."
        ]
      },
      {
        "heading": "A web address is still clickable",
        "paragraphs": [
          "The reader may auto-detect URLs. Try disabling that reader feature or inspect annotation objects before concluding that explicit link removal failed."
        ]
      }
    ],
    "tips": [
      "Use an original single PDF. Check an explicit external link and an internal page link in a reader that exposes annotations; do not judge only by blue text.",
      "The reader may auto-detect URLs. Try disabling that reader feature or inspect annotation objects before concluding that explicit link removal failed.",
      "That is expected. Use a genuine text edit or redaction when the address itself must be removed; removing interaction does not remove the address."
    ],
    "faq": [
      {
        "question": "A web address is still clickable?",
        "answer": "The reader may auto-detect URLs. Try disabling that reader feature or inspect annotation objects before concluding that explicit link removal failed."
      },
      {
        "question": "The URL text is still visible?",
        "answer": "That is expected. Use a genuine text edit or redaction when the address itself must be removed; removing interaction does not remove the address."
      }
    ],
    "hero": {
      "input": "Linked pages",
      "output": "Plain page areas"
    },
    "cta": "Open Remove PDF links →",
    "evidence": {
      "id": "remove-links",
      "input": "/examples/verified-tools/remove-links-input.pdf",
      "output": "/examples/verified-tools/remove-links-result.pdf",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "Explicit page link annotations are absent.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      },
      "preview": {
        "input": "/examples/verified-tools/remove-links-input.png",
        "output": "/examples/verified-tools/remove-links-result.png"
      }
    }
  },
  {
    "slug": "remove-clickable-pdf-links-while-keeping-readable-text",
    "title": "Remove clickable PDF links while keeping readable text",
    "category": "Privacy",
    "tool": "remove-pdf-links",
    "toolId": "remove-links",
    "toolNumber": 9,
    "summary": "A handout should display web addresses without carrying explicit clickable PDF annotations.",
    "intent": "Practical example",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Remove PDF links",
      "Practical example"
    ],
    "steps": [
      "Open the original single PDF.",
      "Export a copy without page Link annotations.",
      "Check that visible text and form fields still appear."
    ],
    "check": "Visible URL text, bookmarks, comments and forms remain. This does not remove scripts or securely sanitize a document.",
    "limit": "Keeps visible text, comments and form widgets. Text that looks like a URL remains visible. Original single PDF only.",
    "sections": [
      {
        "heading": "The document and the intended outcome",
        "paragraphs": [
          "A handout should display web addresses without carrying explicit clickable PDF annotations. Remove links, then inspect both the text and the reader behaviour."
        ]
      },
      {
        "heading": "Make this example work for your file",
        "paragraphs": [
          "For a handout, removal should leave the printed address readable when it forms part of the explanation. If the address itself is private, link removal is insufficient; use a content-removal workflow instead."
        ]
      },
      {
        "heading": "Choose only the settings this case needs",
        "paragraphs": [
          "Use an original single PDF. Check an explicit external link and an internal page link in a reader that exposes annotations; do not judge only by blue text."
        ]
      },
      {
        "heading": "When the example needs a different approach",
        "paragraphs": [
          "That is expected. Use a genuine text edit or redaction when the address itself must be removed; removing interaction does not remove the address."
        ]
      }
    ],
    "tips": [
      "Use an original single PDF. Check an explicit external link and an internal page link in a reader that exposes annotations; do not judge only by blue text.",
      "The reader may auto-detect URLs. Try disabling that reader feature or inspect annotation objects before concluding that explicit link removal failed.",
      "That is expected. Use a genuine text edit or redaction when the address itself must be removed; removing interaction does not remove the address."
    ],
    "faq": [
      {
        "question": "A web address is still clickable?",
        "answer": "The reader may auto-detect URLs. Try disabling that reader feature or inspect annotation objects before concluding that explicit link removal failed."
      },
      {
        "question": "The URL text is still visible?",
        "answer": "That is expected. Use a genuine text edit or redaction when the address itself must be removed; removing interaction does not remove the address."
      }
    ],
    "hero": {
      "input": "Linked pages",
      "output": "Plain page areas"
    },
    "cta": "Open Remove PDF links →",
    "evidence": {
      "id": "remove-links",
      "input": "/examples/verified-tools/remove-links-input.pdf",
      "output": "/examples/verified-tools/remove-links-result.pdf",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "Explicit page link annotations are absent.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      },
      "preview": {
        "input": "/examples/verified-tools/remove-links-input.png",
        "output": "/examples/verified-tools/remove-links-result.png"
      }
    }
  },
  {
    "slug": "remove-pdf-links-common-problems-and-how-to-fix-them",
    "title": "Remove PDF links: common problems and how to fix them",
    "category": "Privacy",
    "tool": "remove-pdf-links",
    "toolId": "remove-links",
    "toolNumber": 9,
    "summary": "Resolve a web address is still clickable and the url text is still visible. Understand the limits before retrying.",
    "intent": "Troubleshooting",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Remove PDF links",
      "Troubleshooting"
    ],
    "steps": [
      "Open the original single PDF.",
      "Export a copy without page Link annotations.",
      "Check that visible text and form fields still appear."
    ],
    "check": "Visible URL text, bookmarks, comments and forms remain. This does not remove scripts or securely sanitize a document.",
    "limit": "Keeps visible text, comments and form widgets. Text that looks like a URL remains visible. Original single PDF only.",
    "sections": [
      {
        "heading": "A web address is still clickable",
        "paragraphs": [
          "The reader may auto-detect URLs. Try disabling that reader feature or inspect annotation objects before concluding that explicit link removal failed."
        ]
      },
      {
        "heading": "The URL text is still visible",
        "paragraphs": [
          "That is expected. Use a genuine text edit or redaction when the address itself must be removed; removing interaction does not remove the address."
        ]
      },
      {
        "heading": "Check whether this is the right operation",
        "paragraphs": [
          "A Link annotation makes an area interactive. The visible letters beneath it are separate page content, and some readers automatically recognize addresses even without an annotation."
        ]
      },
      {
        "heading": "A more useful retry",
        "paragraphs": [
          "For a handout, removal should leave the printed address readable when it forms part of the explanation. If the address itself is private, link removal is insufficient; use a content-removal workflow instead."
        ]
      }
    ],
    "tips": [
      "Use an original single PDF. Check an explicit external link and an internal page link in a reader that exposes annotations; do not judge only by blue text.",
      "The reader may auto-detect URLs. Try disabling that reader feature or inspect annotation objects before concluding that explicit link removal failed.",
      "That is expected. Use a genuine text edit or redaction when the address itself must be removed; removing interaction does not remove the address."
    ],
    "faq": [
      {
        "question": "A web address is still clickable?",
        "answer": "The reader may auto-detect URLs. Try disabling that reader feature or inspect annotation objects before concluding that explicit link removal failed."
      },
      {
        "question": "The URL text is still visible?",
        "answer": "That is expected. Use a genuine text edit or redaction when the address itself must be removed; removing interaction does not remove the address."
      }
    ],
    "hero": {
      "input": "Linked pages",
      "output": "Plain page areas"
    },
    "cta": "Open Remove PDF links →",
    "evidence": {
      "id": "remove-links",
      "input": "/examples/verified-tools/remove-links-input.pdf",
      "output": "/examples/verified-tools/remove-links-result.pdf",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "Explicit page link annotations are absent.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      },
      "preview": {
        "input": "/examples/verified-tools/remove-links-input.png",
        "output": "/examples/verified-tools/remove-links-result.png"
      }
    }
  },
  {
    "slug": "how-to-add-bookmarks-to-a-pdf",
    "title": "How to add bookmarks to a PDF",
    "category": "Pages",
    "tool": "add-pdf-bookmarks",
    "toolId": "bookmarks",
    "toolNumber": 10,
    "summary": "Create a clickable document outline. Learn the available controls, a practical example and what to check.",
    "intent": "How-to",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Add bookmarks",
      "How-to"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Enter one page number and bookmark title per line, using positions in the file.",
      "Preview the page references, then export a PDF with a new outline."
    ],
    "check": "Existing outline entries are replaced. Check bookmark destinations in a reader that displays PDF outlines.",
    "limit": "One bookmark per line: page number followed by its title. Replaces the exported outline.",
    "sections": [
      {
        "heading": "What this tool actually does",
        "paragraphs": [
          "Bookmarks point to actual PDF positions. They do not insert a printed contents page, renumber the document or detect headings automatically."
        ]
      },
      {
        "heading": "Choose the controls for your document",
        "paragraphs": [
          "Enter a valid page position and title for each bookmark. Keep titles short enough to scan in a sidebar; export replaces the previous outline rather than merging two competing outlines."
        ]
      },
      {
        "heading": "Before your first export",
        "paragraphs": [
          "For the review pack, use a small set of descriptive chapter titles. Match each entry to the PDF position after the cover and contents pages, then click every entry in the exported outline."
        ]
      },
      {
        "heading": "A bookmark opens the wrong section",
        "paragraphs": [
          "Compare the destination with the PDF position, not a printed page number that may start after a cover. Update the entry and check it again after export."
        ]
      }
    ],
    "tips": [
      "Enter a valid page position and title for each bookmark. Keep titles short enough to scan in a sidebar; export replaces the previous outline rather than merging two competing outlines.",
      "Compare the destination with the PDF position, not a printed page number that may start after a cover. Update the entry and check it again after export.",
      "Use a page number within the document and a nonempty title. Start with one simple entry to isolate a formatting problem."
    ],
    "faq": [
      {
        "question": "A bookmark opens the wrong section?",
        "answer": "Compare the destination with the PDF position, not a printed page number that may start after a cover. Update the entry and check it again after export."
      },
      {
        "question": "An entry is rejected?",
        "answer": "Use a page number within the document and a nonempty title. Start with one simple entry to isolate a formatting problem."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Navigate reports or chapters without scrolling through every page."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Existing outline entries are replaced. Check bookmark destinations in a reader that displays PDF outlines."
      }
    ],
    "hero": {
      "input": "Report pages",
      "output": "Chapter outline"
    },
    "cta": "Open Add bookmarks →",
    "evidence": {
      "id": "bookmarks",
      "input": "/examples/verified-tools/bookmarks-input.pdf",
      "output": "/examples/verified-tools/bookmarks-result.pdf",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "A document outline was added.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "1 Alpha\n4 Delta",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      },
      "preview": {
        "input": "/examples/verified-tools/bookmarks-input.png",
        "output": "/examples/verified-tools/bookmarks-result.png"
      }
    }
  },
  {
    "slug": "add-a-clear-chapter-outline-to-a-report",
    "title": "Add a clear chapter outline to a report",
    "category": "Pages",
    "tool": "add-pdf-bookmarks",
    "toolId": "bookmarks",
    "toolNumber": 10,
    "summary": "A six-page report has Introduction at position 1 and Findings at position 4.",
    "intent": "Practical example",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Add bookmarks",
      "Practical example"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Enter one page number and bookmark title per line, using positions in the file.",
      "Preview the page references, then export a PDF with a new outline."
    ],
    "check": "Existing outline entries are replaced. Check bookmark destinations in a reader that displays PDF outlines.",
    "limit": "One bookmark per line: page number followed by its title. Replaces the exported outline.",
    "sections": [
      {
        "heading": "The document and the intended outcome",
        "paragraphs": [
          "A six-page report has Introduction at position 1 and Findings at position 4. Add those destinations with useful titles so readers can jump directly to the sections."
        ]
      },
      {
        "heading": "Make this example work for your file",
        "paragraphs": [
          "For the review pack, use a small set of descriptive chapter titles. Match each entry to the PDF position after the cover and contents pages, then click every entry in the exported outline."
        ]
      },
      {
        "heading": "Choose only the settings this case needs",
        "paragraphs": [
          "Enter a valid page position and title for each bookmark. Keep titles short enough to scan in a sidebar; export replaces the previous outline rather than merging two competing outlines."
        ]
      },
      {
        "heading": "When the example needs a different approach",
        "paragraphs": [
          "Use a page number within the document and a nonempty title. Start with one simple entry to isolate a formatting problem."
        ]
      }
    ],
    "tips": [
      "Enter a valid page position and title for each bookmark. Keep titles short enough to scan in a sidebar; export replaces the previous outline rather than merging two competing outlines.",
      "Compare the destination with the PDF position, not a printed page number that may start after a cover. Update the entry and check it again after export.",
      "Use a page number within the document and a nonempty title. Start with one simple entry to isolate a formatting problem."
    ],
    "faq": [
      {
        "question": "A bookmark opens the wrong section?",
        "answer": "Compare the destination with the PDF position, not a printed page number that may start after a cover. Update the entry and check it again after export."
      },
      {
        "question": "An entry is rejected?",
        "answer": "Use a page number within the document and a nonempty title. Start with one simple entry to isolate a formatting problem."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Navigate reports or chapters without scrolling through every page."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Existing outline entries are replaced. Check bookmark destinations in a reader that displays PDF outlines."
      }
    ],
    "hero": {
      "input": "Report pages",
      "output": "Chapter outline"
    },
    "cta": "Open Add bookmarks →",
    "evidence": {
      "id": "bookmarks",
      "input": "/examples/verified-tools/bookmarks-input.pdf",
      "output": "/examples/verified-tools/bookmarks-result.pdf",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "A document outline was added.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "1 Alpha\n4 Delta",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      },
      "preview": {
        "input": "/examples/verified-tools/bookmarks-input.png",
        "output": "/examples/verified-tools/bookmarks-result.png"
      }
    }
  },
  {
    "slug": "add-bookmarks-common-problems-and-how-to-fix-them",
    "title": "Add bookmarks: common problems and how to fix them",
    "category": "Pages",
    "tool": "add-pdf-bookmarks",
    "toolId": "bookmarks",
    "toolNumber": 10,
    "summary": "Resolve a bookmark opens the wrong section and an entry is rejected. Understand the limits before retrying.",
    "intent": "Troubleshooting",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Add bookmarks",
      "Troubleshooting"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Enter one page number and bookmark title per line, using positions in the file.",
      "Preview the page references, then export a PDF with a new outline."
    ],
    "check": "Existing outline entries are replaced. Check bookmark destinations in a reader that displays PDF outlines.",
    "limit": "One bookmark per line: page number followed by its title. Replaces the exported outline.",
    "sections": [
      {
        "heading": "A bookmark opens the wrong section",
        "paragraphs": [
          "Compare the destination with the PDF position, not a printed page number that may start after a cover. Update the entry and check it again after export."
        ]
      },
      {
        "heading": "An entry is rejected",
        "paragraphs": [
          "Use a page number within the document and a nonempty title. Start with one simple entry to isolate a formatting problem."
        ]
      },
      {
        "heading": "Check whether this is the right operation",
        "paragraphs": [
          "Bookmarks point to actual PDF positions. They do not insert a printed contents page, renumber the document or detect headings automatically."
        ]
      },
      {
        "heading": "A more useful retry",
        "paragraphs": [
          "For the review pack, use a small set of descriptive chapter titles. Match each entry to the PDF position after the cover and contents pages, then click every entry in the exported outline."
        ]
      }
    ],
    "tips": [
      "Enter a valid page position and title for each bookmark. Keep titles short enough to scan in a sidebar; export replaces the previous outline rather than merging two competing outlines.",
      "Compare the destination with the PDF position, not a printed page number that may start after a cover. Update the entry and check it again after export.",
      "Use a page number within the document and a nonempty title. Start with one simple entry to isolate a formatting problem."
    ],
    "faq": [
      {
        "question": "A bookmark opens the wrong section?",
        "answer": "Compare the destination with the PDF position, not a printed page number that may start after a cover. Update the entry and check it again after export."
      },
      {
        "question": "An entry is rejected?",
        "answer": "Use a page number within the document and a nonempty title. Start with one simple entry to isolate a formatting problem."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Navigate reports or chapters without scrolling through every page."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Existing outline entries are replaced. Check bookmark destinations in a reader that displays PDF outlines."
      }
    ],
    "hero": {
      "input": "Report pages",
      "output": "Chapter outline"
    },
    "cta": "Open Add bookmarks →",
    "evidence": {
      "id": "bookmarks",
      "input": "/examples/verified-tools/bookmarks-input.pdf",
      "output": "/examples/verified-tools/bookmarks-result.pdf",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "A document outline was added.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "1 Alpha\n4 Delta",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      },
      "preview": {
        "input": "/examples/verified-tools/bookmarks-input.png",
        "output": "/examples/verified-tools/bookmarks-result.png"
      }
    }
  },
  {
    "slug": "how-to-divide-a-pdf-spread-into-two-pages",
    "title": "How to divide a PDF spread into two pages",
    "category": "Pages",
    "tool": "split-pdf-in-half",
    "toolId": "halve",
    "toolNumber": 11,
    "summary": "Separate left and right halves of each page. Learn the available controls, a practical example and what to check.",
    "intent": "How-to",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Split pages in half",
      "How-to"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Open the PDF and inspect whether the content is arranged in left and right halves.",
      "Export two halves per source page and check their reading order."
    ],
    "check": "Cropping hides content outside boundaries; it is not secure removal.",
    "limit": "Uses CropBox boundaries; content outside each visible half is hidden, not securely removed. Rotations are retained.",
    "sections": [
      {
        "heading": "What this tool actually does",
        "paragraphs": [
          "The split uses page geometry rather than recognizing a book gutter. It creates two visible crops per source page; outside content is hidden by boundaries, not securely removed."
        ]
      },
      {
        "heading": "Choose the controls for your document",
        "paragraphs": [
          "Check rotation and CropBox before choosing this operation. For uneven halves, a separate crop may be more suitable than assuming the centre of the PDF is the book gutter."
        ]
      },
      {
        "heading": "Before your first export",
        "paragraphs": [
          "For a scanned open book, check both the left and right halves of the first spread. A centre gutter can conceal text; dividing the page does not recover words missing from the photograph."
        ]
      },
      {
        "heading": "Words are cut at the centre",
        "paragraphs": [
          "The source halves may be unequal or the scan may be tilted. Correct the scan first or use a deliberate crop instead of accepting clipped text."
        ]
      }
    ],
    "tips": [
      "Check rotation and CropBox before choosing this operation. For uneven halves, a separate crop may be more suitable than assuming the centre of the PDF is the book gutter.",
      "The source halves may be unequal or the scan may be tilted. Correct the scan first or use a deliberate crop instead of accepting clipped text.",
      "Inspect source orientation and the first pair. Rotate the source appropriately and repeat a short trial before splitting a long book scan."
    ],
    "faq": [
      {
        "question": "Words are cut at the centre?",
        "answer": "The source halves may be unequal or the scan may be tilted. Correct the scan first or use a deliberate crop instead of accepting clipped text."
      },
      {
        "question": "The halves appear in an unexpected order?",
        "answer": "Inspect source orientation and the first pair. Rotate the source appropriately and repeat a short trial before splitting a long book scan."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Separate side-by-side scans for easier reading."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Cropping hides content outside boundaries; it is not secure removal."
      }
    ],
    "hero": {
      "input": "Two-page scan",
      "output": "Separate halves"
    },
    "cta": "Open Split pages in half →",
    "evidence": {
      "id": "halve",
      "input": "/examples/verified-tools/halve-input.pdf",
      "output": "/examples/verified-tools/halve-result.pdf",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "Six inputs become twelve half-page views.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      },
      "preview": {
        "input": "/examples/verified-tools/halve-input.png",
        "output": "/examples/verified-tools/halve-result.png"
      }
    }
  },
  {
    "slug": "separate-a-side-by-side-book-scan-into-reading-pages",
    "title": "Separate a side-by-side book scan into reading pages",
    "category": "Pages",
    "tool": "split-pdf-in-half",
    "toolId": "halve",
    "toolNumber": 11,
    "summary": "A landscape scan contains a left page and a right page.",
    "intent": "Practical example",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Split pages in half",
      "Practical example"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Open the PDF and inspect whether the content is arranged in left and right halves.",
      "Export two halves per source page and check their reading order."
    ],
    "check": "Cropping hides content outside boundaries; it is not secure removal.",
    "limit": "Uses CropBox boundaries; content outside each visible half is hidden, not securely removed. Rotations are retained.",
    "sections": [
      {
        "heading": "The document and the intended outcome",
        "paragraphs": [
          "A landscape scan contains a left page and a right page. Split each source page into two visible halves, then inspect the resulting reading order and centre boundary."
        ]
      },
      {
        "heading": "Make this example work for your file",
        "paragraphs": [
          "For a scanned open book, check both the left and right halves of the first spread. A centre gutter can conceal text; dividing the page does not recover words missing from the photograph."
        ]
      },
      {
        "heading": "Choose only the settings this case needs",
        "paragraphs": [
          "Check rotation and CropBox before choosing this operation. For uneven halves, a separate crop may be more suitable than assuming the centre of the PDF is the book gutter."
        ]
      },
      {
        "heading": "When the example needs a different approach",
        "paragraphs": [
          "Inspect source orientation and the first pair. Rotate the source appropriately and repeat a short trial before splitting a long book scan."
        ]
      }
    ],
    "tips": [
      "Check rotation and CropBox before choosing this operation. For uneven halves, a separate crop may be more suitable than assuming the centre of the PDF is the book gutter.",
      "The source halves may be unequal or the scan may be tilted. Correct the scan first or use a deliberate crop instead of accepting clipped text.",
      "Inspect source orientation and the first pair. Rotate the source appropriately and repeat a short trial before splitting a long book scan."
    ],
    "faq": [
      {
        "question": "Words are cut at the centre?",
        "answer": "The source halves may be unequal or the scan may be tilted. Correct the scan first or use a deliberate crop instead of accepting clipped text."
      },
      {
        "question": "The halves appear in an unexpected order?",
        "answer": "Inspect source orientation and the first pair. Rotate the source appropriately and repeat a short trial before splitting a long book scan."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Separate side-by-side scans for easier reading."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Cropping hides content outside boundaries; it is not secure removal."
      }
    ],
    "hero": {
      "input": "Two-page scan",
      "output": "Separate halves"
    },
    "cta": "Open Split pages in half →",
    "evidence": {
      "id": "halve",
      "input": "/examples/verified-tools/halve-input.pdf",
      "output": "/examples/verified-tools/halve-result.pdf",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "Six inputs become twelve half-page views.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      },
      "preview": {
        "input": "/examples/verified-tools/halve-input.png",
        "output": "/examples/verified-tools/halve-result.png"
      }
    }
  },
  {
    "slug": "split-pages-in-half-common-problems-and-how-to-fix-them",
    "title": "Split pages in half: common problems and how to fix them",
    "category": "Pages",
    "tool": "split-pdf-in-half",
    "toolId": "halve",
    "toolNumber": 11,
    "summary": "Resolve words are cut at the centre and the halves appear in an unexpected order. Understand the limits before retrying.",
    "intent": "Troubleshooting",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Split pages in half",
      "Troubleshooting"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Open the PDF and inspect whether the content is arranged in left and right halves.",
      "Export two halves per source page and check their reading order."
    ],
    "check": "Cropping hides content outside boundaries; it is not secure removal.",
    "limit": "Uses CropBox boundaries; content outside each visible half is hidden, not securely removed. Rotations are retained.",
    "sections": [
      {
        "heading": "Words are cut at the centre",
        "paragraphs": [
          "The source halves may be unequal or the scan may be tilted. Correct the scan first or use a deliberate crop instead of accepting clipped text."
        ]
      },
      {
        "heading": "The halves appear in an unexpected order",
        "paragraphs": [
          "Inspect source orientation and the first pair. Rotate the source appropriately and repeat a short trial before splitting a long book scan."
        ]
      },
      {
        "heading": "Check whether this is the right operation",
        "paragraphs": [
          "The split uses page geometry rather than recognizing a book gutter. It creates two visible crops per source page; outside content is hidden by boundaries, not securely removed."
        ]
      },
      {
        "heading": "A more useful retry",
        "paragraphs": [
          "For a scanned open book, check both the left and right halves of the first spread. A centre gutter can conceal text; dividing the page does not recover words missing from the photograph."
        ]
      }
    ],
    "tips": [
      "Check rotation and CropBox before choosing this operation. For uneven halves, a separate crop may be more suitable than assuming the centre of the PDF is the book gutter.",
      "The source halves may be unequal or the scan may be tilted. Correct the scan first or use a deliberate crop instead of accepting clipped text.",
      "Inspect source orientation and the first pair. Rotate the source appropriately and repeat a short trial before splitting a long book scan."
    ],
    "faq": [
      {
        "question": "Words are cut at the centre?",
        "answer": "The source halves may be unequal or the scan may be tilted. Correct the scan first or use a deliberate crop instead of accepting clipped text."
      },
      {
        "question": "The halves appear in an unexpected order?",
        "answer": "Inspect source orientation and the first pair. Rotate the source appropriately and repeat a short trial before splitting a long book scan."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Separate side-by-side scans for easier reading."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Cropping hides content outside boundaries; it is not secure removal."
      }
    ],
    "hero": {
      "input": "Two-page scan",
      "output": "Separate halves"
    },
    "cta": "Open Split pages in half →",
    "evidence": {
      "id": "halve",
      "input": "/examples/verified-tools/halve-input.pdf",
      "output": "/examples/verified-tools/halve-result.pdf",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "Six inputs become twelve half-page views.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      },
      "preview": {
        "input": "/examples/verified-tools/halve-input.png",
        "output": "/examples/verified-tools/halve-result.png"
      }
    }
  },
  {
    "slug": "how-to-set-the-preferred-reading-layout-of-a-pdf",
    "title": "How to set the preferred reading layout of a PDF",
    "category": "Pages",
    "tool": "reader-layout",
    "toolId": "viewer",
    "toolNumber": 12,
    "summary": "Choose single-page or two-column viewing. Learn the available controls, a practical example and what to check.",
    "intent": "How-to",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Reading layout preference",
      "How-to"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Choose the available single-page or two-column reader preference.",
      "Export and open the PDF in your preferred reader."
    ],
    "check": "This sets a viewer preference, not a permanent redesign. Readers may ignore it.",
    "limit": "Sets a PDF viewer preference. Some readers ignore it.",
    "sections": [
      {
        "heading": "What this tool actually does",
        "paragraphs": [
          "A viewing preference is a hint stored in the PDF. It does not physically place two pages on one sheet and cannot force every browser or mobile reader to honour it."
        ]
      },
      {
        "heading": "Choose the controls for your document",
        "paragraphs": [
          "Choose single-page or two-column layout directly in the tool. For an actual printable two-up sheet, use Pages per sheet instead."
        ]
      },
      {
        "heading": "Before your first export",
        "paragraphs": [
          "For a booklet, test the requested preference in the recipient’s usual reader. Some readers ignore document layout preferences or substitute their own setting; retain a sensible single-page document order."
        ]
      },
      {
        "heading": "The exported file still opens as one page",
        "paragraphs": [
          "The receiving reader may ignore PageLayout. Check its own view settings; identical page content is expected because the tool changes preference rather than geometry."
        ]
      }
    ],
    "tips": [
      "Choose single-page or two-column layout directly in the tool. For an actual printable two-up sheet, use Pages per sheet instead.",
      "The receiving reader may ignore PageLayout. Check its own view settings; identical page content is expected because the tool changes preference rather than geometry.",
      "Print layout is a different decision. Use a print dialog with multiple pages per sheet or create a new n-up PDF."
    ],
    "faq": [
      {
        "question": "The exported file still opens as one page?",
        "answer": "The receiving reader may ignore PageLayout. Check its own view settings; identical page content is expected because the tool changes preference rather than geometry."
      },
      {
        "question": "Printing still uses one page per sheet?",
        "answer": "Print layout is a different decision. Use a print dialog with multiple pages per sheet or create a new n-up PDF."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Set a preferred reading layout for a document."
      },
      {
        "question": "What should I check in the result?",
        "answer": "This sets a viewer preference, not a permanent redesign. Readers may ignore it."
      }
    ],
    "hero": {
      "input": "Single-page hint",
      "output": "Two-column hint"
    },
    "cta": "Open Reading layout preference →",
    "evidence": {
      "id": "viewer",
      "input": "/examples/verified-tools/viewer-input.pdf",
      "output": "/examples/verified-tools/viewer-result.pdf",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "PDF catalog requests TwoColumnLeft viewing.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      },
      "preview": {
        "input": "/examples/verified-tools/viewer-input.png",
        "output": "/examples/verified-tools/viewer-result.png"
      }
    }
  },
  {
    "slug": "set-a-preferred-two-column-pdf-reading-layout",
    "title": "Set a preferred two-column PDF reading layout",
    "category": "Pages",
    "tool": "reader-layout",
    "toolId": "viewer",
    "toolNumber": 12,
    "summary": "A publication is intended for side-by-side viewing in a desktop reader.",
    "intent": "Practical example",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Reading layout preference",
      "Practical example"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Choose the available single-page or two-column reader preference.",
      "Export and open the PDF in your preferred reader."
    ],
    "check": "This sets a viewer preference, not a permanent redesign. Readers may ignore it.",
    "limit": "Sets a PDF viewer preference. Some readers ignore it.",
    "sections": [
      {
        "heading": "The document and the intended outcome",
        "paragraphs": [
          "A publication is intended for side-by-side viewing in a desktop reader. Set two-column preference, export and test it in the application where the recipient will open it."
        ]
      },
      {
        "heading": "Make this example work for your file",
        "paragraphs": [
          "For a booklet, test the requested preference in the recipient’s usual reader. Some readers ignore document layout preferences or substitute their own setting; retain a sensible single-page document order."
        ]
      },
      {
        "heading": "Choose only the settings this case needs",
        "paragraphs": [
          "Choose single-page or two-column layout directly in the tool. For an actual printable two-up sheet, use Pages per sheet instead."
        ]
      },
      {
        "heading": "When the example needs a different approach",
        "paragraphs": [
          "Print layout is a different decision. Use a print dialog with multiple pages per sheet or create a new n-up PDF."
        ]
      }
    ],
    "tips": [
      "Choose single-page or two-column layout directly in the tool. For an actual printable two-up sheet, use Pages per sheet instead.",
      "The receiving reader may ignore PageLayout. Check its own view settings; identical page content is expected because the tool changes preference rather than geometry.",
      "Print layout is a different decision. Use a print dialog with multiple pages per sheet or create a new n-up PDF."
    ],
    "faq": [
      {
        "question": "The exported file still opens as one page?",
        "answer": "The receiving reader may ignore PageLayout. Check its own view settings; identical page content is expected because the tool changes preference rather than geometry."
      },
      {
        "question": "Printing still uses one page per sheet?",
        "answer": "Print layout is a different decision. Use a print dialog with multiple pages per sheet or create a new n-up PDF."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Set a preferred reading layout for a document."
      },
      {
        "question": "What should I check in the result?",
        "answer": "This sets a viewer preference, not a permanent redesign. Readers may ignore it."
      }
    ],
    "hero": {
      "input": "Single-page hint",
      "output": "Two-column hint"
    },
    "cta": "Open Reading layout preference →",
    "evidence": {
      "id": "viewer",
      "input": "/examples/verified-tools/viewer-input.pdf",
      "output": "/examples/verified-tools/viewer-result.pdf",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "PDF catalog requests TwoColumnLeft viewing.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      },
      "preview": {
        "input": "/examples/verified-tools/viewer-input.png",
        "output": "/examples/verified-tools/viewer-result.png"
      }
    }
  },
  {
    "slug": "reading-layout-preference-common-problems-and-how-to-fix-them",
    "title": "Reading layout preference: common problems and how to fix them",
    "category": "Pages",
    "tool": "reader-layout",
    "toolId": "viewer",
    "toolNumber": 12,
    "summary": "Resolve the exported file still opens as one page and printing still uses one page per sheet. Understand the limits before retrying.",
    "intent": "Troubleshooting",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Reading layout preference",
      "Troubleshooting"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Choose the available single-page or two-column reader preference.",
      "Export and open the PDF in your preferred reader."
    ],
    "check": "This sets a viewer preference, not a permanent redesign. Readers may ignore it.",
    "limit": "Sets a PDF viewer preference. Some readers ignore it.",
    "sections": [
      {
        "heading": "The exported file still opens as one page",
        "paragraphs": [
          "The receiving reader may ignore PageLayout. Check its own view settings; identical page content is expected because the tool changes preference rather than geometry."
        ]
      },
      {
        "heading": "Printing still uses one page per sheet",
        "paragraphs": [
          "Print layout is a different decision. Use a print dialog with multiple pages per sheet or create a new n-up PDF."
        ]
      },
      {
        "heading": "Check whether this is the right operation",
        "paragraphs": [
          "A viewing preference is a hint stored in the PDF. It does not physically place two pages on one sheet and cannot force every browser or mobile reader to honour it."
        ]
      },
      {
        "heading": "A more useful retry",
        "paragraphs": [
          "For a booklet, test the requested preference in the recipient’s usual reader. Some readers ignore document layout preferences or substitute their own setting; retain a sensible single-page document order."
        ]
      }
    ],
    "tips": [
      "Choose single-page or two-column layout directly in the tool. For an actual printable two-up sheet, use Pages per sheet instead.",
      "The receiving reader may ignore PageLayout. Check its own view settings; identical page content is expected because the tool changes preference rather than geometry.",
      "Print layout is a different decision. Use a print dialog with multiple pages per sheet or create a new n-up PDF."
    ],
    "faq": [
      {
        "question": "The exported file still opens as one page?",
        "answer": "The receiving reader may ignore PageLayout. Check its own view settings; identical page content is expected because the tool changes preference rather than geometry."
      },
      {
        "question": "Printing still uses one page per sheet?",
        "answer": "Print layout is a different decision. Use a print dialog with multiple pages per sheet or create a new n-up PDF."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Set a preferred reading layout for a document."
      },
      {
        "question": "What should I check in the result?",
        "answer": "This sets a viewer preference, not a permanent redesign. Readers may ignore it."
      }
    ],
    "hero": {
      "input": "Single-page hint",
      "output": "Two-column hint"
    },
    "cta": "Open Reading layout preference →",
    "evidence": {
      "id": "viewer",
      "input": "/examples/verified-tools/viewer-input.pdf",
      "output": "/examples/verified-tools/viewer-result.pdf",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "PDF catalog requests TwoColumnLeft viewing.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      },
      "preview": {
        "input": "/examples/verified-tools/viewer-input.png",
        "output": "/examples/verified-tools/viewer-result.png"
      }
    }
  },
  {
    "slug": "how-to-remove-pdf-comments-and-annotations",
    "title": "How to remove PDF comments and annotations",
    "category": "Privacy",
    "tool": "remove-pdf-annotations",
    "toolId": "remove-annotations",
    "toolNumber": 13,
    "summary": "Remove comments, highlights, links and stamps. Learn the available controls, a practical example and what to check.",
    "intent": "How-to",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Remove annotations",
      "How-to"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Use the original single PDF before making other workspace changes.",
      "Export the cleaned copy and inspect comments, stamps, highlights and links."
    ],
    "check": "Form widgets are preserved. Graphics already flattened into page content cannot be removed as annotations.",
    "limit": "Works on the original single PDF; preserves form widgets. Export other workspace changes first.",
    "sections": [
      {
        "heading": "What this tool actually does",
        "paragraphs": [
          "Annotations can exist separately from the main page drawing. Once an annotation has been flattened into page graphics, an annotation-removal operation cannot identify it as a removable comment."
        ]
      },
      {
        "heading": "Choose the controls for your document",
        "paragraphs": [
          "Use the original single PDF before other workspace edits. Inspect the comments panel and several annotated pages after export; preserve the review original for reference."
        ]
      },
      {
        "heading": "Before your first export",
        "paragraphs": [
          "For a reviewed draft, decide whether comments and highlights are part of the record you must retain. Save the reviewed original separately before making a clean reading copy."
        ]
      },
      {
        "heading": "A highlight remains visible",
        "paragraphs": [
          "It may already be part of page content. Do not assume the tool failed simply because coloured pixels remain; check whether a live annotation is still present."
        ]
      }
    ],
    "tips": [
      "Use the original single PDF before other workspace edits. Inspect the comments panel and several annotated pages after export; preserve the review original for reference.",
      "It may already be part of page content. Do not assume the tool failed simply because coloured pixels remain; check whether a live annotation is still present.",
      "Form widgets are intentionally kept. Fill or flatten them separately if you need a static reading copy."
    ],
    "faq": [
      {
        "question": "A highlight remains visible?",
        "answer": "It may already be part of page content. Do not assume the tool failed simply because coloured pixels remain; check whether a live annotation is still present."
      },
      {
        "question": "A fillable box remains?",
        "answer": "Form widgets are intentionally kept. Fill or flatten them separately if you need a static reading copy."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Prepare a copy without non-form annotations."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Form widgets are preserved. Graphics already flattened into page content cannot be removed as annotations."
      }
    ],
    "hero": {
      "input": "Reviewed draft",
      "output": "Clean annotations"
    },
    "cta": "Open Remove annotations →",
    "evidence": {
      "id": "remove-annotations",
      "input": "/examples/verified-tools/remove-annotations-input.pdf",
      "output": "/examples/verified-tools/remove-annotations-result.pdf",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "Non-form annotations removed; Name field value retained.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      },
      "preview": {
        "input": "/examples/verified-tools/remove-annotations-input.png",
        "output": "/examples/verified-tools/remove-annotations-result.png"
      }
    }
  },
  {
    "slug": "create-a-reading-copy-without-review-comments",
    "title": "Create a reading copy without review comments",
    "category": "Privacy",
    "tool": "remove-pdf-annotations",
    "toolId": "remove-annotations",
    "toolNumber": 13,
    "summary": "A reviewed draft contains notes, highlights, stamps and page links.",
    "intent": "Practical example",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Remove annotations",
      "Practical example"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Use the original single PDF before making other workspace changes.",
      "Export the cleaned copy and inspect comments, stamps, highlights and links."
    ],
    "check": "Form widgets are preserved. Graphics already flattened into page content cannot be removed as annotations.",
    "limit": "Works on the original single PDF; preserves form widgets. Export other workspace changes first.",
    "sections": [
      {
        "heading": "The document and the intended outcome",
        "paragraphs": [
          "A reviewed draft contains notes, highlights, stamps and page links. Remove non-form annotations and check that visible document content and form widgets remain."
        ]
      },
      {
        "heading": "Make this example work for your file",
        "paragraphs": [
          "For a reviewed draft, decide whether comments and highlights are part of the record you must retain. Save the reviewed original separately before making a clean reading copy."
        ]
      },
      {
        "heading": "Choose only the settings this case needs",
        "paragraphs": [
          "Use the original single PDF before other workspace edits. Inspect the comments panel and several annotated pages after export; preserve the review original for reference."
        ]
      },
      {
        "heading": "When the example needs a different approach",
        "paragraphs": [
          "Form widgets are intentionally kept. Fill or flatten them separately if you need a static reading copy."
        ]
      }
    ],
    "tips": [
      "Use the original single PDF before other workspace edits. Inspect the comments panel and several annotated pages after export; preserve the review original for reference.",
      "It may already be part of page content. Do not assume the tool failed simply because coloured pixels remain; check whether a live annotation is still present.",
      "Form widgets are intentionally kept. Fill or flatten them separately if you need a static reading copy."
    ],
    "faq": [
      {
        "question": "A highlight remains visible?",
        "answer": "It may already be part of page content. Do not assume the tool failed simply because coloured pixels remain; check whether a live annotation is still present."
      },
      {
        "question": "A fillable box remains?",
        "answer": "Form widgets are intentionally kept. Fill or flatten them separately if you need a static reading copy."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Prepare a copy without non-form annotations."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Form widgets are preserved. Graphics already flattened into page content cannot be removed as annotations."
      }
    ],
    "hero": {
      "input": "Reviewed draft",
      "output": "Clean annotations"
    },
    "cta": "Open Remove annotations →",
    "evidence": {
      "id": "remove-annotations",
      "input": "/examples/verified-tools/remove-annotations-input.pdf",
      "output": "/examples/verified-tools/remove-annotations-result.pdf",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "Non-form annotations removed; Name field value retained.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      },
      "preview": {
        "input": "/examples/verified-tools/remove-annotations-input.png",
        "output": "/examples/verified-tools/remove-annotations-result.png"
      }
    }
  },
  {
    "slug": "remove-annotations-common-problems-and-how-to-fix-them",
    "title": "Remove annotations: common problems and how to fix them",
    "category": "Privacy",
    "tool": "remove-pdf-annotations",
    "toolId": "remove-annotations",
    "toolNumber": 13,
    "summary": "Resolve a highlight remains visible and a fillable box remains. Understand the limits before retrying.",
    "intent": "Troubleshooting",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Remove annotations",
      "Troubleshooting"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Use the original single PDF before making other workspace changes.",
      "Export the cleaned copy and inspect comments, stamps, highlights and links."
    ],
    "check": "Form widgets are preserved. Graphics already flattened into page content cannot be removed as annotations.",
    "limit": "Works on the original single PDF; preserves form widgets. Export other workspace changes first.",
    "sections": [
      {
        "heading": "A highlight remains visible",
        "paragraphs": [
          "It may already be part of page content. Do not assume the tool failed simply because coloured pixels remain; check whether a live annotation is still present."
        ]
      },
      {
        "heading": "A fillable box remains",
        "paragraphs": [
          "Form widgets are intentionally kept. Fill or flatten them separately if you need a static reading copy."
        ]
      },
      {
        "heading": "Check whether this is the right operation",
        "paragraphs": [
          "Annotations can exist separately from the main page drawing. Once an annotation has been flattened into page graphics, an annotation-removal operation cannot identify it as a removable comment."
        ]
      },
      {
        "heading": "A more useful retry",
        "paragraphs": [
          "For a reviewed draft, decide whether comments and highlights are part of the record you must retain. Save the reviewed original separately before making a clean reading copy."
        ]
      }
    ],
    "tips": [
      "Use the original single PDF before other workspace edits. Inspect the comments panel and several annotated pages after export; preserve the review original for reference.",
      "It may already be part of page content. Do not assume the tool failed simply because coloured pixels remain; check whether a live annotation is still present.",
      "Form widgets are intentionally kept. Fill or flatten them separately if you need a static reading copy."
    ],
    "faq": [
      {
        "question": "A highlight remains visible?",
        "answer": "It may already be part of page content. Do not assume the tool failed simply because coloured pixels remain; check whether a live annotation is still present."
      },
      {
        "question": "A fillable box remains?",
        "answer": "Form widgets are intentionally kept. Fill or flatten them separately if you need a static reading copy."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Prepare a copy without non-form annotations."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Form widgets are preserved. Graphics already flattened into page content cannot be removed as annotations."
      }
    ],
    "hero": {
      "input": "Reviewed draft",
      "output": "Clean annotations"
    },
    "cta": "Open Remove annotations →",
    "evidence": {
      "id": "remove-annotations",
      "input": "/examples/verified-tools/remove-annotations-input.pdf",
      "output": "/examples/verified-tools/remove-annotations-result.pdf",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "Non-form annotations removed; Name field value retained.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      },
      "preview": {
        "input": "/examples/verified-tools/remove-annotations-input.png",
        "output": "/examples/verified-tools/remove-annotations-result.png"
      }
    }
  },
  {
    "slug": "how-to-create-a-simple-fillable-pdf-form",
    "title": "How to create a simple fillable PDF form",
    "category": "Edit & sign",
    "tool": "create-fillable-pdf",
    "toolId": "create-form",
    "toolNumber": 14,
    "summary": "Turn field labels into a new fillable PDF. Learn the available controls, a practical example and what to check.",
    "intent": "How-to",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Create fillable form",
      "How-to"
    ],
    "steps": [
      "Enter one field label per line. Prefix a checkbox label with [checkbox].",
      "Create the form and open it in a reader that supports PDF form fields.",
      "Fill a short trial, save it and reopen it to check values."
    ],
    "check": "Creates a new form. It does not place arbitrary field types on an existing PDF.",
    "limit": "Creates English text fields on new A4 pages. This does not add arbitrary field types to an existing PDF.",
    "sections": [
      {
        "heading": "What this tool actually does",
        "paragraphs": [
          "This creates a new A4 document from labels. It is different from filling an existing form or designing arbitrary field positions on top of an uploaded PDF."
        ]
      },
      {
        "heading": "Choose the controls for your document",
        "paragraphs": [
          "Use a label on each line and keep labels within the stated English-text limits. The current generator also recognizes a [checkbox] prefix for a checkbox; verify the generated field type before distribution."
        ]
      },
      {
        "heading": "Before your first export",
        "paragraphs": [
          "For a simple registration sheet, distinguish required information in the field labels. Test a long name and an empty answer before distributing the template; a field’s existence does not prove its size or label is suitable."
        ]
      },
      {
        "heading": "An uploaded static form has no fields",
        "paragraphs": [
          "Use Fill PDF forms only for existing interactive fields. Add text can fill a static appearance, while this generator creates a separate form."
        ]
      }
    ],
    "tips": [
      "Use a label on each line and keep labels within the stated English-text limits. The current generator also recognizes a [checkbox] prefix for a checkbox; verify the generated field type before distribution.",
      "Use Fill PDF forms only for existing interactive fields. Add text can fill a static appearance, while this generator creates a separate form.",
      "Check English characters, length and total field count. Shorten the label and test a small questionnaire before building the complete version."
    ],
    "faq": [
      {
        "question": "An uploaded static form has no fields?",
        "answer": "Use Fill PDF forms only for existing interactive fields. Add text can fill a static appearance, while this generator creates a separate form."
      },
      {
        "question": "A label is rejected?",
        "answer": "Check English characters, length and total field count. Shorten the label and test a small questionnaire before building the complete version."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Build a simple questionnaire with new text fields."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Creates a new form. It does not place arbitrary field types on an existing PDF."
      }
    ],
    "hero": {
      "input": "Field labels",
      "output": "New fillable PDF"
    },
    "cta": "Open Create fillable form →"
  },
  {
    "slug": "create-a-small-fillable-questionnaire-from-labels",
    "title": "Create a small fillable questionnaire from labels",
    "category": "Edit & sign",
    "tool": "create-fillable-pdf",
    "toolId": "create-form",
    "toolNumber": 14,
    "summary": "Build a contact questionnaire with Full name, Email and Notes as separate labels.",
    "intent": "Practical example",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Create fillable form",
      "Practical example"
    ],
    "steps": [
      "Enter one field label per line. Prefix a checkbox label with [checkbox].",
      "Create the form and open it in a reader that supports PDF form fields.",
      "Fill a short trial, save it and reopen it to check values."
    ],
    "check": "Creates a new form. It does not place arbitrary field types on an existing PDF.",
    "limit": "Creates English text fields on new A4 pages. This does not add arbitrary field types to an existing PDF.",
    "sections": [
      {
        "heading": "The document and the intended outcome",
        "paragraphs": [
          "Build a contact questionnaire with Full name, Email and Notes as separate labels. Generate the form, type test values in the new fields and reopen a saved copy."
        ]
      },
      {
        "heading": "Make this example work for your file",
        "paragraphs": [
          "For a simple registration sheet, distinguish required information in the field labels. Test a long name and an empty answer before distributing the template; a field’s existence does not prove its size or label is suitable."
        ]
      },
      {
        "heading": "Choose only the settings this case needs",
        "paragraphs": [
          "Use a label on each line and keep labels within the stated English-text limits. The current generator also recognizes a [checkbox] prefix for a checkbox; verify the generated field type before distribution."
        ]
      },
      {
        "heading": "When the example needs a different approach",
        "paragraphs": [
          "Check English characters, length and total field count. Shorten the label and test a small questionnaire before building the complete version."
        ]
      }
    ],
    "tips": [
      "Use a label on each line and keep labels within the stated English-text limits. The current generator also recognizes a [checkbox] prefix for a checkbox; verify the generated field type before distribution.",
      "Use Fill PDF forms only for existing interactive fields. Add text can fill a static appearance, while this generator creates a separate form.",
      "Check English characters, length and total field count. Shorten the label and test a small questionnaire before building the complete version."
    ],
    "faq": [
      {
        "question": "An uploaded static form has no fields?",
        "answer": "Use Fill PDF forms only for existing interactive fields. Add text can fill a static appearance, while this generator creates a separate form."
      },
      {
        "question": "A label is rejected?",
        "answer": "Check English characters, length and total field count. Shorten the label and test a small questionnaire before building the complete version."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Build a simple questionnaire with new text fields."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Creates a new form. It does not place arbitrary field types on an existing PDF."
      }
    ],
    "hero": {
      "input": "Field labels",
      "output": "New fillable PDF"
    },
    "cta": "Open Create fillable form →"
  },
  {
    "slug": "create-fillable-form-common-problems-and-how-to-fix-them",
    "title": "Create fillable form: common problems and how to fix them",
    "category": "Edit & sign",
    "tool": "create-fillable-pdf",
    "toolId": "create-form",
    "toolNumber": 14,
    "summary": "Resolve an uploaded static form has no fields and a label is rejected. Understand the limits before retrying.",
    "intent": "Troubleshooting",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Create fillable form",
      "Troubleshooting"
    ],
    "steps": [
      "Enter one field label per line. Prefix a checkbox label with [checkbox].",
      "Create the form and open it in a reader that supports PDF form fields.",
      "Fill a short trial, save it and reopen it to check values."
    ],
    "check": "Creates a new form. It does not place arbitrary field types on an existing PDF.",
    "limit": "Creates English text fields on new A4 pages. This does not add arbitrary field types to an existing PDF.",
    "sections": [
      {
        "heading": "An uploaded static form has no fields",
        "paragraphs": [
          "Use Fill PDF forms only for existing interactive fields. Add text can fill a static appearance, while this generator creates a separate form."
        ]
      },
      {
        "heading": "A label is rejected",
        "paragraphs": [
          "Check English characters, length and total field count. Shorten the label and test a small questionnaire before building the complete version."
        ]
      },
      {
        "heading": "Check whether this is the right operation",
        "paragraphs": [
          "This creates a new A4 document from labels. It is different from filling an existing form or designing arbitrary field positions on top of an uploaded PDF."
        ]
      },
      {
        "heading": "A more useful retry",
        "paragraphs": [
          "For a simple registration sheet, distinguish required information in the field labels. Test a long name and an empty answer before distributing the template; a field’s existence does not prove its size or label is suitable."
        ]
      }
    ],
    "tips": [
      "Use a label on each line and keep labels within the stated English-text limits. The current generator also recognizes a [checkbox] prefix for a checkbox; verify the generated field type before distribution.",
      "Use Fill PDF forms only for existing interactive fields. Add text can fill a static appearance, while this generator creates a separate form.",
      "Check English characters, length and total field count. Shorten the label and test a small questionnaire before building the complete version."
    ],
    "faq": [
      {
        "question": "An uploaded static form has no fields?",
        "answer": "Use Fill PDF forms only for existing interactive fields. Add text can fill a static appearance, while this generator creates a separate form."
      },
      {
        "question": "A label is rejected?",
        "answer": "Check English characters, length and total field count. Shorten the label and test a small questionnaire before building the complete version."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Build a simple questionnaire with new text fields."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Creates a new form. It does not place arbitrary field types on an existing PDF."
      }
    ],
    "hero": {
      "input": "Field labels",
      "output": "New fillable PDF"
    },
    "cta": "Open Create fillable form →"
  },
  {
    "slug": "build-a-clean-application-pack-by-editing-page-order",
    "title": "Build a clean application pack by editing page order",
    "category": "Pages",
    "tool": "organize-pdf",
    "toolId": "organize",
    "toolNumber": 16,
    "summary": "An application PDF contains a cover, certificates and one duplicate page.",
    "intent": "Practical example",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Organize pages",
      "Practical example"
    ],
    "steps": [
      "Open the PDF and inspect the page thumbnails.",
      "Reorder, rotate, duplicate or delete pages. Use the labeled page buttons when dragging is inconvenient.",
      "Export and reopen the document to check the final order and page count."
    ],
    "check": "Deleting a whole page differs from securely removing a region within a page. Review all pages before sharing, especially after duplication or deletion.",
    "limit": "Deleting a whole page differs from securely removing a region within a page. Review all pages before sharing, especially after duplication or deletion.",
    "sections": [
      {
        "heading": "The document and the intended outcome",
        "paragraphs": [
          "An application PDF contains a cover, certificates and one duplicate page. Move the cover first, remove the duplicate, rotate sideways pages and compare the retained count before export."
        ]
      },
      {
        "heading": "Make this example work for your file",
        "paragraphs": [
          "For the assembled report, inspect the cover, each section boundary and the final page. The thumbnail grid is useful for order, while a full page view helps identify a wrong version with a similar-looking cover."
        ]
      },
      {
        "heading": "Choose only the settings this case needs",
        "paragraphs": [
          "Select only the pages needed for the operation. Use movement controls when dragging is awkward, and keep at least one page in the finished document."
        ]
      },
      {
        "heading": "When the example needs a different approach",
        "paragraphs": [
          "Use Undo where available or reopen the original. Inspect the retained page count and boundary content before exporting again."
        ]
      }
    ],
    "tips": [
      "Select only the pages needed for the operation. Use movement controls when dragging is awkward, and keep at least one page in the finished document.",
      "Printed numbers are part of page content. Moving pages does not rewrite them; use Page numbers to add a new consistent sequence when suitable.",
      "Use Undo where available or reopen the original. Inspect the retained page count and boundary content before exporting again."
    ],
    "faq": [
      {
        "question": "Printed numbers appear out of order?",
        "answer": "Printed numbers are part of page content. Moving pages does not rewrite them; use Page numbers to add a new consistent sequence when suitable."
      },
      {
        "question": "The wrong page was removed?",
        "answer": "Use Undo where available or reopen the original. Inspect the retained page count and boundary content before exporting again."
      },
      {
        "question": "Do I have to drag pages?",
        "answer": "No. Page movement buttons provide an alternative."
      },
      {
        "question": "Can I continue with another tool?",
        "answer": "Compatible tools reuse the shared document. Export important work before leaving the site."
      }
    ],
    "hero": {
      "input": "Page thumbnails",
      "output": "Chosen order"
    },
    "cta": "Open Organize pages →",
    "evidence": {
      "id": "organize",
      "input": "/examples/verified-tools/organize-input.pdf",
      "output": "/examples/verified-tools/organize-result.pdf",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "All six source pages remain readable in the parsed output.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      },
      "preview": {
        "input": "/examples/verified-tools/organize-input.png",
        "output": "/examples/verified-tools/organize-result.png"
      }
    }
  },
  {
    "slug": "organize-pages-common-problems-and-how-to-fix-them",
    "title": "Organize pages: common problems and how to fix them",
    "category": "Pages",
    "tool": "organize-pdf",
    "toolId": "organize",
    "toolNumber": 16,
    "summary": "Resolve printed numbers appear out of order and the wrong page was removed. Understand the limits before retrying.",
    "intent": "Troubleshooting",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Organize pages",
      "Troubleshooting"
    ],
    "steps": [
      "Open the PDF and inspect the page thumbnails.",
      "Reorder, rotate, duplicate or delete pages. Use the labeled page buttons when dragging is inconvenient.",
      "Export and reopen the document to check the final order and page count."
    ],
    "check": "Deleting a whole page differs from securely removing a region within a page. Review all pages before sharing, especially after duplication or deletion.",
    "limit": "Deleting a whole page differs from securely removing a region within a page. Review all pages before sharing, especially after duplication or deletion.",
    "sections": [
      {
        "heading": "Printed numbers appear out of order",
        "paragraphs": [
          "Printed numbers are part of page content. Moving pages does not rewrite them; use Page numbers to add a new consistent sequence when suitable."
        ]
      },
      {
        "heading": "The wrong page was removed",
        "paragraphs": [
          "Use Undo where available or reopen the original. Inspect the retained page count and boundary content before exporting again."
        ]
      },
      {
        "heading": "Check whether this is the right operation",
        "paragraphs": [
          "Organize changes the page list. Reordering a thumbnail changes reading position; rotating changes orientation; deleting removes the whole page from the output. These controls solve different problems."
        ]
      },
      {
        "heading": "A more useful retry",
        "paragraphs": [
          "For the assembled report, inspect the cover, each section boundary and the final page. The thumbnail grid is useful for order, while a full page view helps identify a wrong version with a similar-looking cover."
        ]
      }
    ],
    "tips": [
      "Select only the pages needed for the operation. Use movement controls when dragging is awkward, and keep at least one page in the finished document.",
      "Printed numbers are part of page content. Moving pages does not rewrite them; use Page numbers to add a new consistent sequence when suitable.",
      "Use Undo where available or reopen the original. Inspect the retained page count and boundary content before exporting again."
    ],
    "faq": [
      {
        "question": "Printed numbers appear out of order?",
        "answer": "Printed numbers are part of page content. Moving pages does not rewrite them; use Page numbers to add a new consistent sequence when suitable."
      },
      {
        "question": "The wrong page was removed?",
        "answer": "Use Undo where available or reopen the original. Inspect the retained page count and boundary content before exporting again."
      },
      {
        "question": "Do I have to drag pages?",
        "answer": "No. Page movement buttons provide an alternative."
      },
      {
        "question": "Can I continue with another tool?",
        "answer": "Compatible tools reuse the shared document. Export important work before leaving the site."
      }
    ],
    "hero": {
      "input": "Page thumbnails",
      "output": "Chosen order"
    },
    "cta": "Open Organize pages →",
    "evidence": {
      "id": "organize",
      "input": "/examples/verified-tools/organize-input.pdf",
      "output": "/examples/verified-tools/organize-result.pdf",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "All six source pages remain readable in the parsed output.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      },
      "preview": {
        "input": "/examples/verified-tools/organize-input.png",
        "output": "/examples/verified-tools/organize-result.png"
      }
    }
  },
  {
    "slug": "extract-selected-invoices-from-a-longer-pdf",
    "title": "Extract selected invoices from a longer PDF",
    "category": "Pages",
    "tool": "split-pdf",
    "toolId": "split",
    "toolNumber": 17,
    "summary": "A six-page batch contains needed invoices at positions 1, 3 and 4.",
    "intent": "Practical example",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Split PDF",
      "Practical example"
    ],
    "steps": [
      "Open the source PDF and review its page thumbnails.",
      "Enter the required pages or ranges, for example 1, 3–5. Use the displayed page count to check your selection.",
      "Export the selected pages, reopen the result and confirm that it contains only the pages you need."
    ],
    "check": "Page numbers refer to positions in the file, which may differ from numbers printed on the pages. Extracting pages does not redact sensitive content within a retained page.",
    "limit": "Page numbers refer to positions in the file, which may differ from numbers printed on the pages. Extracting pages does not redact sensitive content within a retained page.",
    "sections": [
      {
        "heading": "The document and the intended outcome",
        "paragraphs": [
          "A six-page batch contains needed invoices at positions 1, 3 and 4. Enter 1, 3–4, choose one combined PDF or separate files, then check the retained pages."
        ]
      },
      {
        "heading": "Make this example work for your file",
        "paragraphs": [
          "For a single invoice, confirm whether supporting pages belong to that invoice before choosing a range. Printed numbering can restart inside a source; use PDF positions rather than the number in its footer."
        ]
      },
      {
        "heading": "Choose only the settings this case needs",
        "paragraphs": [
          "Choose the output mode deliberately: one PDF, a PDF for each selected page, or semicolon-separated groups in a ZIP. Keep grouping separate from page-selection syntax."
        ]
      },
      {
        "heading": "When the example needs a different approach",
        "paragraphs": [
          "A separate-page or grouped output mode creates an archive. Extract it and open the PDFs inside, or choose one-PDF output."
        ]
      }
    ],
    "tips": [
      "Choose the output mode deliberately: one PDF, a PDF for each selected page, or semicolon-separated groups in a ZIP. Keep grouping separate from page-selection syntax.",
      "Count from the first physical PDF page, including covers. Compare thumbnail positions before repeating the action.",
      "A separate-page or grouped output mode creates an archive. Extract it and open the PDFs inside, or choose one-PDF output."
    ],
    "faq": [
      {
        "question": "The wrong pages are extracted?",
        "answer": "Count from the first physical PDF page, including covers. Compare thumbnail positions before repeating the action."
      },
      {
        "question": "The download is a ZIP rather than a PDF?",
        "answer": "A separate-page or grouped output mode creates an archive. Extract it and open the PDFs inside, or choose one-PDF output."
      },
      {
        "question": "Will the original PDF change?",
        "answer": "No. Export creates a separate result. Keep your original as a backup."
      },
      {
        "question": "Can I remove sensitive text this way?",
        "answer": "Only whole excluded pages are omitted. Use Redact for sensitive regions on pages you retain."
      }
    ],
    "hero": {
      "input": "Page range",
      "output": "Selected pages"
    },
    "cta": "Open Split PDF →",
    "evidence": {
      "id": "split",
      "input": "/examples/verified-tools/split-input.pdf",
      "output": "/examples/verified-tools/split-result.pdf",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "Only positions one and three remain.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "1,3",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      },
      "preview": {
        "input": "/examples/verified-tools/split-input.png",
        "output": "/examples/verified-tools/split-result.png"
      }
    }
  },
  {
    "slug": "split-pdf-common-problems-and-how-to-fix-them",
    "title": "Split PDF: common problems and how to fix them",
    "category": "Pages",
    "tool": "split-pdf",
    "toolId": "split",
    "toolNumber": 17,
    "summary": "Resolve the wrong pages are extracted and the download is a zip rather than a pdf. Understand the limits before retrying.",
    "intent": "Troubleshooting",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Split PDF",
      "Troubleshooting"
    ],
    "steps": [
      "Open the source PDF and review its page thumbnails.",
      "Enter the required pages or ranges, for example 1, 3–5. Use the displayed page count to check your selection.",
      "Export the selected pages, reopen the result and confirm that it contains only the pages you need."
    ],
    "check": "Page numbers refer to positions in the file, which may differ from numbers printed on the pages. Extracting pages does not redact sensitive content within a retained page.",
    "limit": "Page numbers refer to positions in the file, which may differ from numbers printed on the pages. Extracting pages does not redact sensitive content within a retained page.",
    "sections": [
      {
        "heading": "The wrong pages are extracted",
        "paragraphs": [
          "Count from the first physical PDF page, including covers. Compare thumbnail positions before repeating the action."
        ]
      },
      {
        "heading": "The download is a ZIP rather than a PDF",
        "paragraphs": [
          "A separate-page or grouped output mode creates an archive. Extract it and open the PDFs inside, or choose one-PDF output."
        ]
      },
      {
        "heading": "Check whether this is the right operation",
        "paragraphs": [
          "Split selects actual positions in the current PDF. Printed labels such as invoice numbers or Roman page numbers are not the range values."
        ]
      },
      {
        "heading": "A more useful retry",
        "paragraphs": [
          "For a single invoice, confirm whether supporting pages belong to that invoice before choosing a range. Printed numbering can restart inside a source; use PDF positions rather than the number in its footer."
        ]
      }
    ],
    "tips": [
      "Choose the output mode deliberately: one PDF, a PDF for each selected page, or semicolon-separated groups in a ZIP. Keep grouping separate from page-selection syntax.",
      "Count from the first physical PDF page, including covers. Compare thumbnail positions before repeating the action.",
      "A separate-page or grouped output mode creates an archive. Extract it and open the PDFs inside, or choose one-PDF output."
    ],
    "faq": [
      {
        "question": "The wrong pages are extracted?",
        "answer": "Count from the first physical PDF page, including covers. Compare thumbnail positions before repeating the action."
      },
      {
        "question": "The download is a ZIP rather than a PDF?",
        "answer": "A separate-page or grouped output mode creates an archive. Extract it and open the PDFs inside, or choose one-PDF output."
      },
      {
        "question": "Will the original PDF change?",
        "answer": "No. Export creates a separate result. Keep your original as a backup."
      },
      {
        "question": "Can I remove sensitive text this way?",
        "answer": "Only whole excluded pages are omitted. Use Redact for sensitive regions on pages you retain."
      }
    ],
    "hero": {
      "input": "Page range",
      "output": "Selected pages"
    },
    "cta": "Open Split PDF →",
    "evidence": {
      "id": "split",
      "input": "/examples/verified-tools/split-input.pdf",
      "output": "/examples/verified-tools/split-result.pdf",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "Only positions one and three remain.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "1,3",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      },
      "preview": {
        "input": "/examples/verified-tools/split-input.png",
        "output": "/examples/verified-tools/split-result.png"
      }
    }
  },
  {
    "slug": "how-to-save-every-pdf-page-as-a-separate-file",
    "title": "How to save every PDF page as a separate file",
    "category": "Pages",
    "tool": "split-every-page",
    "toolId": "split-all",
    "toolNumber": 18,
    "summary": "One PDF per page, in a ZIP. Learn the available controls, a practical example and what to check.",
    "intent": "How-to",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Split every page",
      "How-to"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Review the PDF page count before splitting.",
      "Export the ZIP and open several individual PDFs to check the page sequence."
    ],
    "check": "The result is an archive of single-page PDFs. Unzip it before opening a PDF in a reader.",
    "limit": "The result is an archive of single-page PDFs. Unzip it before opening a PDF in a reader.",
    "sections": [
      {
        "heading": "What this tool actually does",
        "paragraphs": [
          "Every source page becomes a separate PDF. This changes packaging rather than turning pages into images, so a ZIP viewer is needed before a PDF reader."
        ]
      },
      {
        "heading": "Choose the controls for your document",
        "paragraphs": [
          "Review the source count and ordering first. Check the first, middle and last extracted file; confirm each has one page instead of assuming the archive name proves its contents."
        ]
      },
      {
        "heading": "Before your first export",
        "paragraphs": [
          "For a page-by-page review queue, preserve a mapping from each exported filename to its original position. Single-page files lose the surrounding context, so retain the full source as a reference."
        ]
      },
      {
        "heading": "The archive will not open in a PDF reader",
        "paragraphs": [
          "Use the device file manager to extract the ZIP. A ZIP is a container, not a PDF, even when all its members are PDFs."
        ]
      }
    ],
    "tips": [
      "Review the source count and ordering first. Check the first, middle and last extracted file; confirm each has one page instead of assuming the archive name proves its contents.",
      "Use the device file manager to extract the ZIP. A ZIP is a container, not a PDF, even when all its members are PDFs.",
      "Compare each file content with its intended recipient. Avoid relying only on alphabetical ordering in a mail attachment picker."
    ],
    "faq": [
      {
        "question": "The archive will not open in a PDF reader?",
        "answer": "Use the device file manager to extract the ZIP. A ZIP is a container, not a PDF, even when all its members are PDFs."
      },
      {
        "question": "A recipient receives the wrong page?",
        "answer": "Compare each file content with its intended recipient. Avoid relying only on alphabetical ordering in a mail attachment picker."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Send individual pages as separate documents."
      },
      {
        "question": "What should I check in the result?",
        "answer": "The result is an archive of single-page PDFs. Unzip it before opening a PDF in a reader."
      }
    ],
    "hero": {
      "input": "One document",
      "output": "One PDF per page"
    },
    "cta": "Open Split every page →",
    "evidence": {
      "id": "split-all",
      "input": "/examples/verified-tools/split-all-input.pdf",
      "output": "/examples/verified-tools/split-all-result.zip",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "ZIP contains six readable single-page PDFs.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      }
    }
  },
  {
    "slug": "send-each-page-of-a-batch-as-a-separate-pdf",
    "title": "Send each page of a batch as a separate PDF",
    "category": "Pages",
    "tool": "split-every-page",
    "toolId": "split-all",
    "toolNumber": 18,
    "summary": "A six-page batch needs six separate one-page files.",
    "intent": "Practical example",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Split every page",
      "Practical example"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Review the PDF page count before splitting.",
      "Export the ZIP and open several individual PDFs to check the page sequence."
    ],
    "check": "The result is an archive of single-page PDFs. Unzip it before opening a PDF in a reader.",
    "limit": "The result is an archive of single-page PDFs. Unzip it before opening a PDF in a reader.",
    "sections": [
      {
        "heading": "The document and the intended outcome",
        "paragraphs": [
          "A six-page batch needs six separate one-page files. Split every page, extract the ZIP and inspect filenames and contents before sending individual documents."
        ]
      },
      {
        "heading": "Make this example work for your file",
        "paragraphs": [
          "For a page-by-page review queue, preserve a mapping from each exported filename to its original position. Single-page files lose the surrounding context, so retain the full source as a reference."
        ]
      },
      {
        "heading": "Choose only the settings this case needs",
        "paragraphs": [
          "Review the source count and ordering first. Check the first, middle and last extracted file; confirm each has one page instead of assuming the archive name proves its contents."
        ]
      },
      {
        "heading": "When the example needs a different approach",
        "paragraphs": [
          "Compare each file content with its intended recipient. Avoid relying only on alphabetical ordering in a mail attachment picker."
        ]
      }
    ],
    "tips": [
      "Review the source count and ordering first. Check the first, middle and last extracted file; confirm each has one page instead of assuming the archive name proves its contents.",
      "Use the device file manager to extract the ZIP. A ZIP is a container, not a PDF, even when all its members are PDFs.",
      "Compare each file content with its intended recipient. Avoid relying only on alphabetical ordering in a mail attachment picker."
    ],
    "faq": [
      {
        "question": "The archive will not open in a PDF reader?",
        "answer": "Use the device file manager to extract the ZIP. A ZIP is a container, not a PDF, even when all its members are PDFs."
      },
      {
        "question": "A recipient receives the wrong page?",
        "answer": "Compare each file content with its intended recipient. Avoid relying only on alphabetical ordering in a mail attachment picker."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Send individual pages as separate documents."
      },
      {
        "question": "What should I check in the result?",
        "answer": "The result is an archive of single-page PDFs. Unzip it before opening a PDF in a reader."
      }
    ],
    "hero": {
      "input": "One document",
      "output": "One PDF per page"
    },
    "cta": "Open Split every page →",
    "evidence": {
      "id": "split-all",
      "input": "/examples/verified-tools/split-all-input.pdf",
      "output": "/examples/verified-tools/split-all-result.zip",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "ZIP contains six readable single-page PDFs.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      }
    }
  },
  {
    "slug": "split-every-page-common-problems-and-how-to-fix-them",
    "title": "Split every page: common problems and how to fix them",
    "category": "Pages",
    "tool": "split-every-page",
    "toolId": "split-all",
    "toolNumber": 18,
    "summary": "Resolve the archive will not open in a pdf reader and a recipient receives the wrong page. Understand the limits before retrying.",
    "intent": "Troubleshooting",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Split every page",
      "Troubleshooting"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Review the PDF page count before splitting.",
      "Export the ZIP and open several individual PDFs to check the page sequence."
    ],
    "check": "The result is an archive of single-page PDFs. Unzip it before opening a PDF in a reader.",
    "limit": "The result is an archive of single-page PDFs. Unzip it before opening a PDF in a reader.",
    "sections": [
      {
        "heading": "The archive will not open in a PDF reader",
        "paragraphs": [
          "Use the device file manager to extract the ZIP. A ZIP is a container, not a PDF, even when all its members are PDFs."
        ]
      },
      {
        "heading": "A recipient receives the wrong page",
        "paragraphs": [
          "Compare each file content with its intended recipient. Avoid relying only on alphabetical ordering in a mail attachment picker."
        ]
      },
      {
        "heading": "Check whether this is the right operation",
        "paragraphs": [
          "Every source page becomes a separate PDF. This changes packaging rather than turning pages into images, so a ZIP viewer is needed before a PDF reader."
        ]
      },
      {
        "heading": "A more useful retry",
        "paragraphs": [
          "For a page-by-page review queue, preserve a mapping from each exported filename to its original position. Single-page files lose the surrounding context, so retain the full source as a reference."
        ]
      }
    ],
    "tips": [
      "Review the source count and ordering first. Check the first, middle and last extracted file; confirm each has one page instead of assuming the archive name proves its contents.",
      "Use the device file manager to extract the ZIP. A ZIP is a container, not a PDF, even when all its members are PDFs.",
      "Compare each file content with its intended recipient. Avoid relying only on alphabetical ordering in a mail attachment picker."
    ],
    "faq": [
      {
        "question": "The archive will not open in a PDF reader?",
        "answer": "Use the device file manager to extract the ZIP. A ZIP is a container, not a PDF, even when all its members are PDFs."
      },
      {
        "question": "A recipient receives the wrong page?",
        "answer": "Compare each file content with its intended recipient. Avoid relying only on alphabetical ordering in a mail attachment picker."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Send individual pages as separate documents."
      },
      {
        "question": "What should I check in the result?",
        "answer": "The result is an archive of single-page PDFs. Unzip it before opening a PDF in a reader."
      }
    ],
    "hero": {
      "input": "One document",
      "output": "One PDF per page"
    },
    "cta": "Open Split every page →",
    "evidence": {
      "id": "split-all",
      "input": "/examples/verified-tools/split-all-input.pdf",
      "output": "/examples/verified-tools/split-all-result.zip",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "ZIP contains six readable single-page PDFs.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      }
    }
  },
  {
    "slug": "prepare-a-readable-pdf-for-an-upload-size-limit",
    "title": "Prepare a readable PDF for an upload-size limit",
    "category": "Pages",
    "tool": "compress-pdf",
    "toolId": "compress",
    "toolNumber": 19,
    "summary": "A portal accepts a 500 KB attachment.",
    "intent": "Practical example",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Compress PDF",
      "Practical example",
      "file size",
      "upload limits",
      "smaller",
      "reduce size",
      "shrink",
      "compression"
    ],
    "steps": [
      "Open your PDF and note its original size.",
      "Choose compact mode to retain PDF text and links, or an image-based quality option when those features are less important.",
      "Process the file, compare the sizes and inspect small text and images before downloading."
    ],
    "check": "Image-based modes rebuild pages and can remove selectable text, links and forms. Check readability at normal zoom. Keep the original if the result is larger or the quality is insufficient.",
    "limit": "Recommended optimizes supported JPEGs while keeping text, links and forms. Page-image presets remove these features.",
    "sections": [
      {
        "heading": "The document and the intended outcome",
        "paragraphs": [
          "A portal accepts a 500 KB attachment. Note the source size, begin with a structure-preserving method, then try stronger image options only if necessary and inspect the exact result size."
        ]
      },
      {
        "heading": "Make this example work for your file",
        "paragraphs": [
          "For a portal attachment, check the portal’s unit and limit before choosing a target. Inspect the smallest important text after compression. If an acceptable reading copy cannot fit, ask whether the portal permits separate files."
        ]
      },
      {
        "heading": "Choose only the settings this case needs",
        "paragraphs": [
          "Compare the reported bytes with the portal limit and inspect small print. Try a short document first on a phone; extra DPI or a quality slider does not guarantee a smaller file."
        ]
      },
      {
        "heading": "When the example needs a different approach",
        "paragraphs": [
          "A numeric target does not prove usability. Compare names, dates and small print at normal reading size; use a less aggressive method or split the submission if permitted."
        ]
      }
    ],
    "tips": [
      "Compare the reported bytes with the portal limit and inspect small print. Try a short document first on a phone; extra DPI or a quality slider does not guarantee a smaller file.",
      "The source may already be compact, or its data may not match a supported optimization. Keep the original when the result offers no useful reduction.",
      "A numeric target does not prove usability. Compare names, dates and small print at normal reading size; use a less aggressive method or split the submission if permitted."
    ],
    "faq": [
      {
        "question": "The result is not smaller?",
        "answer": "The source may already be compact, or its data may not match a supported optimization. Keep the original when the result offers no useful reduction."
      },
      {
        "question": "The file meets the limit but looks poor?",
        "answer": "A numeric target does not prove usability. Compare names, dates and small print at normal reading size; use a less aggressive method or split the submission if permitted."
      },
      {
        "question": "Is compression lossless?",
        "answer": "Compact mode retains PDF content. JPEG optimization keeps document structure but reduces supported image quality. Whole-page image modes can lose text, links and forms."
      },
      {
        "question": "Why is the result not smaller?",
        "answer": "The source may already be optimized. Reduction depends on its content and the selected mode."
      }
    ],
    "hero": {
      "input": "Original PDF",
      "output": "Smaller if useful"
    },
    "cta": "Open Compress PDF →",
    "evidence": {
      "id": "compress",
      "input": "/examples/verified-tools/compress-input.pdf",
      "output": "/examples/verified-tools/compress-result.pdf",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "All six source pages remain readable in the parsed output.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      },
      "preview": {
        "input": "/examples/verified-tools/compress-input.png",
        "output": "/examples/verified-tools/compress-result.png"
      }
    }
  },
  {
    "slug": "compress-pdf-common-problems-and-how-to-fix-them",
    "title": "Compress PDF: common problems and how to fix them",
    "category": "Pages",
    "tool": "compress-pdf",
    "toolId": "compress",
    "toolNumber": 19,
    "summary": "Resolve the result is not smaller and the file meets the limit but looks poor. Understand the limits before retrying.",
    "intent": "Troubleshooting",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Compress PDF",
      "Troubleshooting",
      "file size",
      "upload limits",
      "smaller",
      "reduce size",
      "shrink",
      "compression"
    ],
    "steps": [
      "Open your PDF and note its original size.",
      "Choose compact mode to retain PDF text and links, or an image-based quality option when those features are less important.",
      "Process the file, compare the sizes and inspect small text and images before downloading."
    ],
    "check": "Image-based modes rebuild pages and can remove selectable text, links and forms. Check readability at normal zoom. Keep the original if the result is larger or the quality is insufficient.",
    "limit": "Recommended optimizes supported JPEGs while keeping text, links and forms. Page-image presets remove these features.",
    "sections": [
      {
        "heading": "The result is not smaller",
        "paragraphs": [
          "The source may already be compact, or its data may not match a supported optimization. Keep the original when the result offers no useful reduction."
        ]
      },
      {
        "heading": "The file meets the limit but looks poor",
        "paragraphs": [
          "A numeric target does not prove usability. Compare names, dates and small print at normal reading size; use a less aggressive method or split the submission if permitted."
        ]
      },
      {
        "heading": "Check whether this is the right operation",
        "paragraphs": [
          "Compression depends on what is inside the PDF. Supported JPEG optimization can reduce images while retaining document structure; whole-page image presets exchange searchable and interactive features for a different representation."
        ]
      },
      {
        "heading": "A more useful retry",
        "paragraphs": [
          "For a portal attachment, check the portal’s unit and limit before choosing a target. Inspect the smallest important text after compression. If an acceptable reading copy cannot fit, ask whether the portal permits separate files."
        ]
      }
    ],
    "tips": [
      "Compare the reported bytes with the portal limit and inspect small print. Try a short document first on a phone; extra DPI or a quality slider does not guarantee a smaller file.",
      "The source may already be compact, or its data may not match a supported optimization. Keep the original when the result offers no useful reduction.",
      "A numeric target does not prove usability. Compare names, dates and small print at normal reading size; use a less aggressive method or split the submission if permitted."
    ],
    "faq": [
      {
        "question": "The result is not smaller?",
        "answer": "The source may already be compact, or its data may not match a supported optimization. Keep the original when the result offers no useful reduction."
      },
      {
        "question": "The file meets the limit but looks poor?",
        "answer": "A numeric target does not prove usability. Compare names, dates and small print at normal reading size; use a less aggressive method or split the submission if permitted."
      },
      {
        "question": "Is compression lossless?",
        "answer": "Compact mode retains PDF content. JPEG optimization keeps document structure but reduces supported image quality. Whole-page image modes can lose text, links and forms."
      },
      {
        "question": "Why is the result not smaller?",
        "answer": "The source may already be optimized. Reduction depends on its content and the selected mode."
      }
    ],
    "hero": {
      "input": "Original PDF",
      "output": "Smaller if useful"
    },
    "cta": "Open Compress PDF →",
    "evidence": {
      "id": "compress",
      "input": "/examples/verified-tools/compress-input.pdf",
      "output": "/examples/verified-tools/compress-result.pdf",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "All six source pages remain readable in the parsed output.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      },
      "preview": {
        "input": "/examples/verified-tools/compress-input.png",
        "output": "/examples/verified-tools/compress-result.png"
      }
    }
  },
  {
    "slug": "fix-one-sideways-page-in-an-otherwise-upright-pdf",
    "title": "Fix one sideways page in an otherwise upright PDF",
    "category": "Pages",
    "tool": "rotate-pdf",
    "toolId": "rotate",
    "toolNumber": 20,
    "summary": "A three-page PDF has only page 2 sideways.",
    "intent": "Practical example",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Rotate PDF",
      "Practical example"
    ],
    "steps": [
      "Choose your PDF and tap Rotate under the page that needs turning. Each tap turns that page clockwise by 90 degrees.",
      "On a phone, Add PDFs and Undo/Redo are attached below the header. Open More rotation options for Rotate all pages or page numbers such as 1, 3-5.",
      "Choose Save rotated PDF, download the result and inspect the orientation of every changed page."
    ],
    "check": "Rotation changes display orientation. Use Organize when only selected pages should rotate.",
    "limit": "Rotation changes display orientation. Use Organize when only selected pages should rotate.",
    "sections": [
      {
        "heading": "The document and the intended outcome",
        "paragraphs": [
          "A three-page PDF has only page 2 sideways. Turn that page using its rotate control, leave pages 1 and 3 unchanged, then inspect orientation and order after export."
        ]
      },
      {
        "heading": "Make this example work for your file",
        "paragraphs": [
          "For mixed scanner output, correct the affected pages individually and leave upright pages alone. Verify the first and last lines after export; a changed rotation is useful only when the page is comfortable to read."
        ]
      },
      {
        "heading": "Choose only the settings this case needs",
        "paragraphs": [
          "Use the per-page control for mixed orientations. The optional all-pages and page-number controls are useful for a consistently sideways scan, but preview the chosen range before processing."
        ]
      },
      {
        "heading": "When the example needs a different approach",
        "paragraphs": [
          "Apply another 90° turn or choose 180° where available. Compare text direction rather than relying on the thumbnail aspect ratio alone."
        ]
      }
    ],
    "tips": [
      "Use the per-page control for mixed orientations. The optional all-pages and page-number controls are useful for a consistently sideways scan, but preview the chosen range before processing.",
      "Check whether the all-pages action or an empty range was used. Restore the original orientation and apply the operation to the intended page only.",
      "Apply another 90° turn or choose 180° where available. Compare text direction rather than relying on the thumbnail aspect ratio alone."
    ],
    "faq": [
      {
        "question": "Every page turns when only one should?",
        "answer": "Check whether the all-pages action or an empty range was used. Restore the original orientation and apply the operation to the intended page only."
      },
      {
        "question": "The page is upside down after one turn?",
        "answer": "Apply another 90° turn or choose 180° where available. Compare text direction rather than relying on the thumbnail aspect ratio alone."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Fix sideways pages in scanned documents."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Rotation changes display orientation. Use Organize when only selected pages should rotate."
      }
    ],
    "hero": {
      "input": "Sideways page",
      "output": "Upright page"
    },
    "cta": "Open Rotate PDF →",
    "evidence": {
      "id": "rotate",
      "input": "/examples/verified-tools/rotate-input.pdf",
      "output": "/examples/verified-tools/rotate-result.pdf",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "All six pages have a 90° rotation.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      },
      "preview": {
        "input": "/examples/verified-tools/rotate-input.png",
        "output": "/examples/verified-tools/rotate-result.png"
      }
    }
  },
  {
    "slug": "rotate-pdf-common-problems-and-how-to-fix-them",
    "title": "Rotate PDF: common problems and how to fix them",
    "category": "Pages",
    "tool": "rotate-pdf",
    "toolId": "rotate",
    "toolNumber": 20,
    "summary": "Resolve every page turns when only one should and the page is upside down after one turn. Understand the limits before retrying.",
    "intent": "Troubleshooting",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Rotate PDF",
      "Troubleshooting"
    ],
    "steps": [
      "Choose your PDF and tap Rotate under the page that needs turning. Each tap turns that page clockwise by 90 degrees.",
      "On a phone, Add PDFs and Undo/Redo are attached below the header. Open More rotation options for Rotate all pages or page numbers such as 1, 3-5.",
      "Choose Save rotated PDF, download the result and inspect the orientation of every changed page."
    ],
    "check": "Rotation changes display orientation. Use Organize when only selected pages should rotate.",
    "limit": "Rotation changes display orientation. Use Organize when only selected pages should rotate.",
    "sections": [
      {
        "heading": "Every page turns when only one should",
        "paragraphs": [
          "Check whether the all-pages action or an empty range was used. Restore the original orientation and apply the operation to the intended page only."
        ]
      },
      {
        "heading": "The page is upside down after one turn",
        "paragraphs": [
          "Apply another 90° turn or choose 180° where available. Compare text direction rather than relying on the thumbnail aspect ratio alone."
        ]
      },
      {
        "heading": "Check whether this is the right operation",
        "paragraphs": [
          "Rotation changes how a page faces. A 90° turn is not mirroring and does not move the page to a different position."
        ]
      },
      {
        "heading": "A more useful retry",
        "paragraphs": [
          "For mixed scanner output, correct the affected pages individually and leave upright pages alone. Verify the first and last lines after export; a changed rotation is useful only when the page is comfortable to read."
        ]
      }
    ],
    "tips": [
      "Use the per-page control for mixed orientations. The optional all-pages and page-number controls are useful for a consistently sideways scan, but preview the chosen range before processing.",
      "Check whether the all-pages action or an empty range was used. Restore the original orientation and apply the operation to the intended page only.",
      "Apply another 90° turn or choose 180° where available. Compare text direction rather than relying on the thumbnail aspect ratio alone."
    ],
    "faq": [
      {
        "question": "Every page turns when only one should?",
        "answer": "Check whether the all-pages action or an empty range was used. Restore the original orientation and apply the operation to the intended page only."
      },
      {
        "question": "The page is upside down after one turn?",
        "answer": "Apply another 90° turn or choose 180° where available. Compare text direction rather than relying on the thumbnail aspect ratio alone."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Fix sideways pages in scanned documents."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Rotation changes display orientation. Use Organize when only selected pages should rotate."
      }
    ],
    "hero": {
      "input": "Sideways page",
      "output": "Upright page"
    },
    "cta": "Open Rotate PDF →",
    "evidence": {
      "id": "rotate",
      "input": "/examples/verified-tools/rotate-input.pdf",
      "output": "/examples/verified-tools/rotate-result.pdf",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "All six pages have a 90° rotation.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      },
      "preview": {
        "input": "/examples/verified-tools/rotate-input.png",
        "output": "/examples/verified-tools/rotate-result.png"
      }
    }
  },
  {
    "slug": "how-to-reverse-the-order-of-pdf-pages",
    "title": "How to reverse the order of PDF pages",
    "category": "Pages",
    "tool": "reverse-pages",
    "toolId": "reverse",
    "toolNumber": 21,
    "summary": "Last page first. Simple. Learn the available controls, a practical example and what to check.",
    "intent": "How-to",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Reverse pages",
      "How-to"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Confirm that reversing the entire document matches your intended order.",
      "Export and check that the original last page is now first."
    ],
    "check": "The operation reverses every page. Use Organize for a custom order instead.",
    "limit": "The operation reverses every page. Use Organize for a custom order instead.",
    "sections": [
      {
        "heading": "What this tool actually does",
        "paragraphs": [
          "Reverse puts the last page first and reverses the complete sequence. It does not rotate pages, detect matching fronts and backs or repair a single misplaced page."
        ]
      },
      {
        "heading": "Choose the controls for your document",
        "paragraphs": [
          "Confirm that the entire stack is backwards. Use Organize for one isolated misplaced page; keep the original front stack unchanged."
        ]
      },
      {
        "heading": "Before your first export",
        "paragraphs": [
          "For a back-page scan stack, reverse that stack before mixing it with the fronts. Use labelled pages to confirm the pairings; a reversed total order can still begin with the wrong side if the scanner output was misunderstood."
        ]
      },
      {
        "heading": "The first page is now wrong",
        "paragraphs": [
          "The source may not have been a completely reversed stack. Compare all labels and use a deliberate page reorder instead."
        ]
      }
    ],
    "tips": [
      "Confirm that the entire stack is backwards. Use Organize for one isolated misplaced page; keep the original front stack unchanged.",
      "The source may not have been a completely reversed stack. Compare all labels and use a deliberate page reorder instead.",
      "A missing blank back can shift positions even after reversal. Restore missing positions and verify a short alternating trial."
    ],
    "faq": [
      {
        "question": "The first page is now wrong?",
        "answer": "The source may not have been a completely reversed stack. Compare all labels and use a deliberate page reorder instead."
      },
      {
        "question": "Front and back pairs still mismatch?",
        "answer": "A missing blank back can shift positions even after reversal. Restore missing positions and verify a short alternating trial."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Correct scans captured backwards."
      },
      {
        "question": "What should I check in the result?",
        "answer": "The operation reverses every page. Use Organize for a custom order instead."
      }
    ],
    "hero": {
      "input": "A1 A2 A3",
      "output": "A3 A2 A1"
    },
    "cta": "Open Reverse pages →",
    "evidence": {
      "id": "reverse",
      "input": "/examples/verified-tools/reverse-input.pdf",
      "output": "/examples/verified-tools/reverse-result.pdf",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "Output starts with source page six.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      },
      "preview": {
        "input": "/examples/verified-tools/reverse-input.png",
        "output": "/examples/verified-tools/reverse-result.png"
      }
    }
  },
  {
    "slug": "correct-a-back-page-scan-stored-in-reverse-order",
    "title": "Correct a back-page scan stored in reverse order",
    "category": "Pages",
    "tool": "reverse-pages",
    "toolId": "reverse",
    "toolNumber": 21,
    "summary": "A scanner produces backs B3, B2, B1.",
    "intent": "Practical example",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Reverse pages",
      "Practical example"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Confirm that reversing the entire document matches your intended order.",
      "Export and check that the original last page is now first."
    ],
    "check": "The operation reverses every page. Use Organize for a custom order instead.",
    "limit": "The operation reverses every page. Use Organize for a custom order instead.",
    "sections": [
      {
        "heading": "The document and the intended outcome",
        "paragraphs": [
          "A scanner produces backs B3, B2, B1. Reverse that file alone to B1, B2, B3 before mixing it with the corresponding front-page file."
        ]
      },
      {
        "heading": "Make this example work for your file",
        "paragraphs": [
          "For a back-page scan stack, reverse that stack before mixing it with the fronts. Use labelled pages to confirm the pairings; a reversed total order can still begin with the wrong side if the scanner output was misunderstood."
        ]
      },
      {
        "heading": "Choose only the settings this case needs",
        "paragraphs": [
          "Confirm that the entire stack is backwards. Use Organize for one isolated misplaced page; keep the original front stack unchanged."
        ]
      },
      {
        "heading": "When the example needs a different approach",
        "paragraphs": [
          "A missing blank back can shift positions even after reversal. Restore missing positions and verify a short alternating trial."
        ]
      }
    ],
    "tips": [
      "Confirm that the entire stack is backwards. Use Organize for one isolated misplaced page; keep the original front stack unchanged.",
      "The source may not have been a completely reversed stack. Compare all labels and use a deliberate page reorder instead.",
      "A missing blank back can shift positions even after reversal. Restore missing positions and verify a short alternating trial."
    ],
    "faq": [
      {
        "question": "The first page is now wrong?",
        "answer": "The source may not have been a completely reversed stack. Compare all labels and use a deliberate page reorder instead."
      },
      {
        "question": "Front and back pairs still mismatch?",
        "answer": "A missing blank back can shift positions even after reversal. Restore missing positions and verify a short alternating trial."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Correct scans captured backwards."
      },
      {
        "question": "What should I check in the result?",
        "answer": "The operation reverses every page. Use Organize for a custom order instead."
      }
    ],
    "hero": {
      "input": "A1 A2 A3",
      "output": "A3 A2 A1"
    },
    "cta": "Open Reverse pages →",
    "evidence": {
      "id": "reverse",
      "input": "/examples/verified-tools/reverse-input.pdf",
      "output": "/examples/verified-tools/reverse-result.pdf",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "Output starts with source page six.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      },
      "preview": {
        "input": "/examples/verified-tools/reverse-input.png",
        "output": "/examples/verified-tools/reverse-result.png"
      }
    }
  },
  {
    "slug": "reverse-pages-common-problems-and-how-to-fix-them",
    "title": "Reverse pages: common problems and how to fix them",
    "category": "Pages",
    "tool": "reverse-pages",
    "toolId": "reverse",
    "toolNumber": 21,
    "summary": "Resolve the first page is now wrong and front and back pairs still mismatch. Understand the limits before retrying.",
    "intent": "Troubleshooting",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Reverse pages",
      "Troubleshooting"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Confirm that reversing the entire document matches your intended order.",
      "Export and check that the original last page is now first."
    ],
    "check": "The operation reverses every page. Use Organize for a custom order instead.",
    "limit": "The operation reverses every page. Use Organize for a custom order instead.",
    "sections": [
      {
        "heading": "The first page is now wrong",
        "paragraphs": [
          "The source may not have been a completely reversed stack. Compare all labels and use a deliberate page reorder instead."
        ]
      },
      {
        "heading": "Front and back pairs still mismatch",
        "paragraphs": [
          "A missing blank back can shift positions even after reversal. Restore missing positions and verify a short alternating trial."
        ]
      },
      {
        "heading": "Check whether this is the right operation",
        "paragraphs": [
          "Reverse puts the last page first and reverses the complete sequence. It does not rotate pages, detect matching fronts and backs or repair a single misplaced page."
        ]
      },
      {
        "heading": "A more useful retry",
        "paragraphs": [
          "For a back-page scan stack, reverse that stack before mixing it with the fronts. Use labelled pages to confirm the pairings; a reversed total order can still begin with the wrong side if the scanner output was misunderstood."
        ]
      }
    ],
    "tips": [
      "Confirm that the entire stack is backwards. Use Organize for one isolated misplaced page; keep the original front stack unchanged.",
      "The source may not have been a completely reversed stack. Compare all labels and use a deliberate page reorder instead.",
      "A missing blank back can shift positions even after reversal. Restore missing positions and verify a short alternating trial."
    ],
    "faq": [
      {
        "question": "The first page is now wrong?",
        "answer": "The source may not have been a completely reversed stack. Compare all labels and use a deliberate page reorder instead."
      },
      {
        "question": "Front and back pairs still mismatch?",
        "answer": "A missing blank back can shift positions even after reversal. Restore missing positions and verify a short alternating trial."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Correct scans captured backwards."
      },
      {
        "question": "What should I check in the result?",
        "answer": "The operation reverses every page. Use Organize for a custom order instead."
      }
    ],
    "hero": {
      "input": "A1 A2 A3",
      "output": "A3 A2 A1"
    },
    "cta": "Open Reverse pages →",
    "evidence": {
      "id": "reverse",
      "input": "/examples/verified-tools/reverse-input.pdf",
      "output": "/examples/verified-tools/reverse-result.pdf",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "Output starts with source page six.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      },
      "preview": {
        "input": "/examples/verified-tools/reverse-input.png",
        "output": "/examples/verified-tools/reverse-result.png"
      }
    }
  },
  {
    "slug": "how-to-duplicate-pdf-pages",
    "title": "How to duplicate PDF pages",
    "category": "Pages",
    "tool": "duplicate-pages",
    "toolId": "duplicate",
    "toolNumber": 22,
    "summary": "Make a second copy of every page. Learn the available controls, a practical example and what to check.",
    "intent": "How-to",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Duplicate pages",
      "How-to"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Check the original page count.",
      "Export and verify the order of repeated pages."
    ],
    "check": "Page duplication increases the page count and file size.",
    "limit": "Page duplication increases the page count and file size.",
    "sections": [
      {
        "heading": "What this tool actually does",
        "paragraphs": [
          "Duplicating page content is different from asking a printer for two collated copies. Check whether you need A1, A1, A2, A2 or two complete document sets."
        ]
      },
      {
        "heading": "Choose the controls for your document",
        "paragraphs": [
          "Review the output count, which should double for the retained input pages. Printed page numbers remain the same on duplicates unless you add new labels separately."
        ]
      },
      {
        "heading": "Before your first export",
        "paragraphs": [
          "For a reusable worksheet, confirm whether students need a second blank copy or a duplicate of completed work. Duplication faithfully repeats the selected content, including any answers already printed on it."
        ]
      },
      {
        "heading": "The output is not collated into two sets",
        "paragraphs": [
          "Use a printer collation setting or merge two full copies if you need A1, A2, A1, A2. Consecutive page duplication has a different purpose."
        ]
      }
    ],
    "tips": [
      "Review the output count, which should double for the retained input pages. Printed page numbers remain the same on duplicates unless you add new labels separately.",
      "Use a printer collation setting or merge two full copies if you need A1, A2, A1, A2. Consecutive page duplication has a different purpose.",
      "Interactive fields require separate review during page copying. Complete and safely flatten a reading copy first when editable behaviour is unnecessary."
    ],
    "faq": [
      {
        "question": "The output is not collated into two sets?",
        "answer": "Use a printer collation setting or merge two full copies if you need A1, A2, A1, A2. Consecutive page duplication has a different purpose."
      },
      {
        "question": "Duplicated form pages behave unexpectedly?",
        "answer": "Interactive fields require separate review during page copying. Complete and safely flatten a reading copy first when editable behaviour is unnecessary."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Create repeated page copies for document preparation."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Page duplication increases the page count and file size."
      }
    ],
    "hero": {
      "input": "A1 A2",
      "output": "A1 A1 A2 A2"
    },
    "cta": "Open Duplicate pages →",
    "evidence": {
      "id": "duplicate",
      "input": "/examples/verified-tools/duplicate-input.pdf",
      "output": "/examples/verified-tools/duplicate-result.pdf",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "Six inputs become twelve pages.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      },
      "preview": {
        "input": "/examples/verified-tools/duplicate-input.png",
        "output": "/examples/verified-tools/duplicate-result.png"
      }
    }
  },
  {
    "slug": "create-consecutive-copies-of-each-pdf-page",
    "title": "Create consecutive copies of each PDF page",
    "category": "Pages",
    "tool": "duplicate-pages",
    "toolId": "duplicate",
    "toolNumber": 22,
    "summary": "A teacher needs each worksheet twice in one file.",
    "intent": "Practical example",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Duplicate pages",
      "Practical example"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Check the original page count.",
      "Export and verify the order of repeated pages."
    ],
    "check": "Page duplication increases the page count and file size.",
    "limit": "Page duplication increases the page count and file size.",
    "sections": [
      {
        "heading": "The document and the intended outcome",
        "paragraphs": [
          "A teacher needs each worksheet twice in one file. Duplicate produces two copies of each page, then the next pair, so inspect the sequence before printing."
        ]
      },
      {
        "heading": "Make this example work for your file",
        "paragraphs": [
          "For a reusable worksheet, confirm whether students need a second blank copy or a duplicate of completed work. Duplication faithfully repeats the selected content, including any answers already printed on it."
        ]
      },
      {
        "heading": "Choose only the settings this case needs",
        "paragraphs": [
          "Review the output count, which should double for the retained input pages. Printed page numbers remain the same on duplicates unless you add new labels separately."
        ]
      },
      {
        "heading": "When the example needs a different approach",
        "paragraphs": [
          "Interactive fields require separate review during page copying. Complete and safely flatten a reading copy first when editable behaviour is unnecessary."
        ]
      }
    ],
    "tips": [
      "Review the output count, which should double for the retained input pages. Printed page numbers remain the same on duplicates unless you add new labels separately.",
      "Use a printer collation setting or merge two full copies if you need A1, A2, A1, A2. Consecutive page duplication has a different purpose.",
      "Interactive fields require separate review during page copying. Complete and safely flatten a reading copy first when editable behaviour is unnecessary."
    ],
    "faq": [
      {
        "question": "The output is not collated into two sets?",
        "answer": "Use a printer collation setting or merge two full copies if you need A1, A2, A1, A2. Consecutive page duplication has a different purpose."
      },
      {
        "question": "Duplicated form pages behave unexpectedly?",
        "answer": "Interactive fields require separate review during page copying. Complete and safely flatten a reading copy first when editable behaviour is unnecessary."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Create repeated page copies for document preparation."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Page duplication increases the page count and file size."
      }
    ],
    "hero": {
      "input": "A1 A2",
      "output": "A1 A1 A2 A2"
    },
    "cta": "Open Duplicate pages →",
    "evidence": {
      "id": "duplicate",
      "input": "/examples/verified-tools/duplicate-input.pdf",
      "output": "/examples/verified-tools/duplicate-result.pdf",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "Six inputs become twelve pages.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      },
      "preview": {
        "input": "/examples/verified-tools/duplicate-input.png",
        "output": "/examples/verified-tools/duplicate-result.png"
      }
    }
  },
  {
    "slug": "duplicate-pages-common-problems-and-how-to-fix-them",
    "title": "Duplicate pages: common problems and how to fix them",
    "category": "Pages",
    "tool": "duplicate-pages",
    "toolId": "duplicate",
    "toolNumber": 22,
    "summary": "Resolve the output is not collated into two sets and duplicated form pages behave unexpectedly. Understand the limits before retrying.",
    "intent": "Troubleshooting",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Duplicate pages",
      "Troubleshooting"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Check the original page count.",
      "Export and verify the order of repeated pages."
    ],
    "check": "Page duplication increases the page count and file size.",
    "limit": "Page duplication increases the page count and file size.",
    "sections": [
      {
        "heading": "The output is not collated into two sets",
        "paragraphs": [
          "Use a printer collation setting or merge two full copies if you need A1, A2, A1, A2. Consecutive page duplication has a different purpose."
        ]
      },
      {
        "heading": "Duplicated form pages behave unexpectedly",
        "paragraphs": [
          "Interactive fields require separate review during page copying. Complete and safely flatten a reading copy first when editable behaviour is unnecessary."
        ]
      },
      {
        "heading": "Check whether this is the right operation",
        "paragraphs": [
          "Duplicating page content is different from asking a printer for two collated copies. Check whether you need A1, A1, A2, A2 or two complete document sets."
        ]
      },
      {
        "heading": "A more useful retry",
        "paragraphs": [
          "For a reusable worksheet, confirm whether students need a second blank copy or a duplicate of completed work. Duplication faithfully repeats the selected content, including any answers already printed on it."
        ]
      }
    ],
    "tips": [
      "Review the output count, which should double for the retained input pages. Printed page numbers remain the same on duplicates unless you add new labels separately.",
      "Use a printer collation setting or merge two full copies if you need A1, A2, A1, A2. Consecutive page duplication has a different purpose.",
      "Interactive fields require separate review during page copying. Complete and safely flatten a reading copy first when editable behaviour is unnecessary."
    ],
    "faq": [
      {
        "question": "The output is not collated into two sets?",
        "answer": "Use a printer collation setting or merge two full copies if you need A1, A2, A1, A2. Consecutive page duplication has a different purpose."
      },
      {
        "question": "Duplicated form pages behave unexpectedly?",
        "answer": "Interactive fields require separate review during page copying. Complete and safely flatten a reading copy first when editable behaviour is unnecessary."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Create repeated page copies for document preparation."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Page duplication increases the page count and file size."
      }
    ],
    "hero": {
      "input": "A1 A2",
      "output": "A1 A1 A2 A2"
    },
    "cta": "Open Duplicate pages →",
    "evidence": {
      "id": "duplicate",
      "input": "/examples/verified-tools/duplicate-input.pdf",
      "output": "/examples/verified-tools/duplicate-result.pdf",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "Six inputs become twelve pages.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      },
      "preview": {
        "input": "/examples/verified-tools/duplicate-input.png",
        "output": "/examples/verified-tools/duplicate-result.png"
      }
    }
  },
  {
    "slug": "print-a-lecture-handout-with-four-pages-per-sheet",
    "title": "Print a lecture handout with four pages per sheet",
    "category": "Pages",
    "tool": "pages-per-sheet",
    "toolId": "nup",
    "toolNumber": 24,
    "summary": "An eight-page lecture can become two four-up sheets.",
    "intent": "Practical example",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Pages per sheet",
      "Practical example"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Choose two or four pages per sheet.",
      "Export and inspect small text at the intended print size."
    ],
    "check": "Multiple pages on one sheet reduce their visible size. Use Resize for one page on each A4 sheet.",
    "limit": "Multiple pages on one sheet reduce their visible size. Use Resize for one page on each A4 sheet.",
    "sections": [
      {
        "heading": "The document and the intended outcome",
        "paragraphs": [
          "An eight-page lecture can become two four-up sheets. Choose four pages per sheet, select sheet orientation and margin, then test readability at the intended print scale."
        ]
      },
      {
        "heading": "Make this example work for your file",
        "paragraphs": [
          "For lecture handouts, choose readability before maximum paper savings. Print a trial sheet if possible. Page previews on a high-resolution screen can conceal how small equations and footnotes become on paper."
        ]
      },
      {
        "heading": "Choose only the settings this case needs",
        "paragraphs": [
          "Choose 2, 4, 6 or 9 according to source text size. An incomplete last sheet is normal when the input count is not divisible by the selected number."
        ]
      },
      {
        "heading": "When the example needs a different approach",
        "paragraphs": [
          "That follows from the retained count. Check the expected sheet count with ceiling(input pages / slots); empty final slots are not missing pages."
        ]
      }
    ],
    "tips": [
      "Choose 2, 4, 6 or 9 according to source text size. An incomplete last sheet is normal when the input count is not divisible by the selected number.",
      "Reduce the number of pages per sheet or use a larger output sheet. More slots save paper but shrink every page.",
      "That follows from the retained count. Check the expected sheet count with ceiling(input pages / slots); empty final slots are not missing pages."
    ],
    "faq": [
      {
        "question": "Text is too small to read?",
        "answer": "Reduce the number of pages per sheet or use a larger output sheet. More slots save paper but shrink every page."
      },
      {
        "question": "The last sheet has empty spaces?",
        "answer": "That follows from the retained count. Check the expected sheet count with ceiling(input pages / slots); empty final slots are not missing pages."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Make a compact handout or reduce the number of printed sheets."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Multiple pages on one sheet reduce their visible size. Use Resize for one page on each A4 sheet."
      }
    ],
    "hero": {
      "input": "Four pages",
      "output": "One four-up sheet"
    },
    "cta": "Open Pages per sheet →",
    "evidence": {
      "id": "nup",
      "input": "/examples/verified-tools/nup-input.pdf",
      "output": "/examples/verified-tools/nup-result.pdf",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "Six inputs become two four-up sheets.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "4",
        "fields": {}
      },
      "preview": {
        "input": "/examples/verified-tools/nup-input.png",
        "output": "/examples/verified-tools/nup-result.png"
      }
    }
  },
  {
    "slug": "pages-per-sheet-common-problems-and-how-to-fix-them",
    "title": "Pages per sheet: common problems and how to fix them",
    "category": "Pages",
    "tool": "pages-per-sheet",
    "toolId": "nup",
    "toolNumber": 24,
    "summary": "Resolve text is too small to read and the last sheet has empty spaces. Understand the limits before retrying.",
    "intent": "Troubleshooting",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Pages per sheet",
      "Troubleshooting"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Choose two or four pages per sheet.",
      "Export and inspect small text at the intended print size."
    ],
    "check": "Multiple pages on one sheet reduce their visible size. Use Resize for one page on each A4 sheet.",
    "limit": "Multiple pages on one sheet reduce their visible size. Use Resize for one page on each A4 sheet.",
    "sections": [
      {
        "heading": "Text is too small to read",
        "paragraphs": [
          "Reduce the number of pages per sheet or use a larger output sheet. More slots save paper but shrink every page."
        ]
      },
      {
        "heading": "The last sheet has empty spaces",
        "paragraphs": [
          "That follows from the retained count. Check the expected sheet count with ceiling(input pages / slots); empty final slots are not missing pages."
        ]
      },
      {
        "heading": "Check whether this is the right operation",
        "paragraphs": [
          "N-up reduces each source page to fit a slot on a new sheet. It is a physical page-layout transformation, unlike a reader two-column preference."
        ]
      },
      {
        "heading": "A more useful retry",
        "paragraphs": [
          "For lecture handouts, choose readability before maximum paper savings. Print a trial sheet if possible. Page previews on a high-resolution screen can conceal how small equations and footnotes become on paper."
        ]
      }
    ],
    "tips": [
      "Choose 2, 4, 6 or 9 according to source text size. An incomplete last sheet is normal when the input count is not divisible by the selected number.",
      "Reduce the number of pages per sheet or use a larger output sheet. More slots save paper but shrink every page.",
      "That follows from the retained count. Check the expected sheet count with ceiling(input pages / slots); empty final slots are not missing pages."
    ],
    "faq": [
      {
        "question": "Text is too small to read?",
        "answer": "Reduce the number of pages per sheet or use a larger output sheet. More slots save paper but shrink every page."
      },
      {
        "question": "The last sheet has empty spaces?",
        "answer": "That follows from the retained count. Check the expected sheet count with ceiling(input pages / slots); empty final slots are not missing pages."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Make a compact handout or reduce the number of printed sheets."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Multiple pages on one sheet reduce their visible size. Use Resize for one page on each A4 sheet."
      }
    ],
    "hero": {
      "input": "Four pages",
      "output": "One four-up sheet"
    },
    "cta": "Open Pages per sheet →",
    "evidence": {
      "id": "nup",
      "input": "/examples/verified-tools/nup-input.pdf",
      "output": "/examples/verified-tools/nup-result.pdf",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "Six inputs become two four-up sheets.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "4",
        "fields": {}
      },
      "preview": {
        "input": "/examples/verified-tools/nup-input.png",
        "output": "/examples/verified-tools/nup-result.png"
      }
    }
  },
  {
    "slug": "trim-white-scanner-borders-without-cutting-the-text",
    "title": "Trim white scanner borders without cutting the text",
    "category": "Pages",
    "tool": "crop-margins",
    "toolId": "crop",
    "toolNumber": 25,
    "summary": "A scanned handout has large white edges.",
    "intent": "Practical example",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Crop margins",
      "Practical example"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Choose the margin to trim and inspect content near every edge.",
      "Export and check that useful text is not clipped."
    ],
    "check": "Crop boundaries hide content; they do not securely erase it. Use Redact for sensitive regions.",
    "limit": "Cropping hides content outside the page boundary; it does not permanently remove it.",
    "sections": [
      {
        "heading": "The document and the intended outcome",
        "paragraphs": [
          "A scanned handout has large white edges. Start with small top, right, bottom and left margins, inspect the tightest page and export only when every line remains visible."
        ]
      },
      {
        "heading": "Make this example work for your file",
        "paragraphs": [
          "For white scanner borders, inspect pages with writing closest to each edge. Leave enough space for notes, signatures and stamps. The tightest page, rather than the neatest one, should guide a shared crop setting."
        ]
      },
      {
        "heading": "Choose only the settings this case needs",
        "paragraphs": [
          "Margins use points rather than percentages. Check mixed page sizes individually before applying one set of values to the whole file; leave room around page numbers and stamps."
        ]
      },
      {
        "heading": "When the example needs a different approach",
        "paragraphs": [
          "Changing a boundary does not necessarily discard the underlying data. Use compression for size reduction and redaction for genuine content removal."
        ]
      }
    ],
    "tips": [
      "Margins use points rather than percentages. Check mixed page sizes individually before applying one set of values to the whole file; leave room around page numbers and stamps.",
      "Reduce the relevant crop margin and inspect the original. A margin that suits one page can clip another page with a different layout.",
      "Changing a boundary does not necessarily discard the underlying data. Use compression for size reduction and redaction for genuine content removal."
    ],
    "faq": [
      {
        "question": "Content disappears at an edge?",
        "answer": "Reduce the relevant crop margin and inspect the original. A margin that suits one page can clip another page with a different layout."
      },
      {
        "question": "The file is not much smaller?",
        "answer": "Changing a boundary does not necessarily discard the underlying data. Use compression for size reduction and redaction for genuine content removal."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Reduce unwanted white borders around a document."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Crop boundaries hide content; they do not securely erase it. Use Redact for sensitive regions."
      }
    ],
    "hero": {
      "input": "Wide margins",
      "output": "Tighter boundary"
    },
    "cta": "Open Crop margins →",
    "evidence": {
      "id": "crop",
      "input": "/examples/verified-tools/crop-input.pdf",
      "output": "/examples/verified-tools/crop-result.pdf",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "The crop boundary is narrower than the original page.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      },
      "preview": {
        "input": "/examples/verified-tools/crop-input.png",
        "output": "/examples/verified-tools/crop-result.png"
      }
    }
  },
  {
    "slug": "crop-margins-common-problems-and-how-to-fix-them",
    "title": "Crop margins: common problems and how to fix them",
    "category": "Pages",
    "tool": "crop-margins",
    "toolId": "crop",
    "toolNumber": 25,
    "summary": "Resolve content disappears at an edge and the file is not much smaller. Understand the limits before retrying.",
    "intent": "Troubleshooting",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Crop margins",
      "Troubleshooting"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Choose the margin to trim and inspect content near every edge.",
      "Export and check that useful text is not clipped."
    ],
    "check": "Crop boundaries hide content; they do not securely erase it. Use Redact for sensitive regions.",
    "limit": "Cropping hides content outside the page boundary; it does not permanently remove it.",
    "sections": [
      {
        "heading": "Content disappears at an edge",
        "paragraphs": [
          "Reduce the relevant crop margin and inspect the original. A margin that suits one page can clip another page with a different layout."
        ]
      },
      {
        "heading": "The file is not much smaller",
        "paragraphs": [
          "Changing a boundary does not necessarily discard the underlying data. Use compression for size reduction and redaction for genuine content removal."
        ]
      },
      {
        "heading": "Check whether this is the right operation",
        "paragraphs": [
          "Cropping changes the visible boundary. Hidden content outside it can remain in the PDF, so cropping is unsuitable for permanently removing personal information."
        ]
      },
      {
        "heading": "A more useful retry",
        "paragraphs": [
          "For white scanner borders, inspect pages with writing closest to each edge. Leave enough space for notes, signatures and stamps. The tightest page, rather than the neatest one, should guide a shared crop setting."
        ]
      }
    ],
    "tips": [
      "Margins use points rather than percentages. Check mixed page sizes individually before applying one set of values to the whole file; leave room around page numbers and stamps.",
      "Reduce the relevant crop margin and inspect the original. A margin that suits one page can clip another page with a different layout.",
      "Changing a boundary does not necessarily discard the underlying data. Use compression for size reduction and redaction for genuine content removal."
    ],
    "faq": [
      {
        "question": "Content disappears at an edge?",
        "answer": "Reduce the relevant crop margin and inspect the original. A margin that suits one page can clip another page with a different layout."
      },
      {
        "question": "The file is not much smaller?",
        "answer": "Changing a boundary does not necessarily discard the underlying data. Use compression for size reduction and redaction for genuine content removal."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Reduce unwanted white borders around a document."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Crop boundaries hide content; they do not securely erase it. Use Redact for sensitive regions."
      }
    ],
    "hero": {
      "input": "Wide margins",
      "output": "Tighter boundary"
    },
    "cta": "Open Crop margins →",
    "evidence": {
      "id": "crop",
      "input": "/examples/verified-tools/crop-input.pdf",
      "output": "/examples/verified-tools/crop-result.pdf",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "The crop boundary is narrower than the original page.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      },
      "preview": {
        "input": "/examples/verified-tools/crop-input.png",
        "output": "/examples/verified-tools/crop-result.png"
      }
    }
  },
  {
    "slug": "fit-a-mixed-size-document-onto-a4-pages",
    "title": "Fit a mixed-size document onto A4 pages",
    "category": "Pages",
    "tool": "resize-to-a4",
    "toolId": "resize",
    "toolNumber": 26,
    "summary": "A pack includes US Letter and smaller pages but must print on A4.",
    "intent": "Practical example",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Resize to A4",
      "Practical example"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Inspect the page orientations before fitting them to A4.",
      "Export and check margins and scaling on mixed-size pages."
    ],
    "check": "Scaling may make small text harder to read. It does not reflow paragraphs.",
    "limit": "Scaling may make small text harder to read. It does not reflow paragraphs.",
    "sections": [
      {
        "heading": "The document and the intended outcome",
        "paragraphs": [
          "A pack includes US Letter and smaller pages but must print on A4. Select the target size, review orientation and fit mode, then inspect page dimensions and content placement."
        ]
      },
      {
        "heading": "Make this example work for your file",
        "paragraphs": [
          "For an A4 submission, check whether the recipient needs an actual A4 page or merely an A4 print setting. Resize creates new page geometry; a print dialog can scale a document without changing the file."
        ]
      },
      {
        "heading": "Choose only the settings this case needs",
        "paragraphs": [
          "Choose A4, orientation and the available fit behaviour deliberately. Use the range control for a subset when supported; compare both a portrait and a landscape source."
        ]
      },
      {
        "heading": "When the example needs a different approach",
        "paragraphs": [
          "Review fill versus fit behaviour and the source bounds. Use a fit setting when preserving all visible content is the priority."
        ]
      }
    ],
    "tips": [
      "Choose A4, orientation and the available fit behaviour deliberately. Use the range control for a subset when supported; compare both a portrait and a landscape source.",
      "A very wide source may need landscape orientation or a different fit strategy. Inspect its readable text size rather than only the A4 page dimensions.",
      "Review fill versus fit behaviour and the source bounds. Use a fit setting when preserving all visible content is the priority."
    ],
    "faq": [
      {
        "question": "Content is tiny with large margins?",
        "answer": "A very wide source may need landscape orientation or a different fit strategy. Inspect its readable text size rather than only the A4 page dimensions."
      },
      {
        "question": "Edges are clipped?",
        "answer": "Review fill versus fit behaviour and the source bounds. Use a fit setting when preserving all visible content is the priority."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Prepare a document for standard A4 printing."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Scaling may make small text harder to read. It does not reflow paragraphs."
      }
    ],
    "hero": {
      "input": "Mixed sizes",
      "output": "A4 sheets"
    },
    "cta": "Open Resize to A4 →",
    "evidence": {
      "id": "resize",
      "input": "/examples/verified-tools/resize-input.pdf",
      "output": "/examples/verified-tools/resize-result.pdf",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "Output has A4 page width.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      },
      "preview": {
        "input": "/examples/verified-tools/resize-input.png",
        "output": "/examples/verified-tools/resize-result.png"
      }
    }
  },
  {
    "slug": "resize-to-a4-common-problems-and-how-to-fix-them",
    "title": "Resize to A4: common problems and how to fix them",
    "category": "Pages",
    "tool": "resize-to-a4",
    "toolId": "resize",
    "toolNumber": 26,
    "summary": "Resolve content is tiny with large margins and edges are clipped. Understand the limits before retrying.",
    "intent": "Troubleshooting",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Resize to A4",
      "Troubleshooting"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Inspect the page orientations before fitting them to A4.",
      "Export and check margins and scaling on mixed-size pages."
    ],
    "check": "Scaling may make small text harder to read. It does not reflow paragraphs.",
    "limit": "Scaling may make small text harder to read. It does not reflow paragraphs.",
    "sections": [
      {
        "heading": "Content is tiny with large margins",
        "paragraphs": [
          "A very wide source may need landscape orientation or a different fit strategy. Inspect its readable text size rather than only the A4 page dimensions."
        ]
      },
      {
        "heading": "Edges are clipped",
        "paragraphs": [
          "Review fill versus fit behaviour and the source bounds. Use a fit setting when preserving all visible content is the priority."
        ]
      },
      {
        "heading": "Check whether this is the right operation",
        "paragraphs": [
          "Resizing can scale and position a source page on a new sheet. It is different from changing a crop boundary or merely rotating the original page."
        ]
      },
      {
        "heading": "A more useful retry",
        "paragraphs": [
          "For an A4 submission, check whether the recipient needs an actual A4 page or merely an A4 print setting. Resize creates new page geometry; a print dialog can scale a document without changing the file."
        ]
      }
    ],
    "tips": [
      "Choose A4, orientation and the available fit behaviour deliberately. Use the range control for a subset when supported; compare both a portrait and a landscape source.",
      "A very wide source may need landscape orientation or a different fit strategy. Inspect its readable text size rather than only the A4 page dimensions.",
      "Review fill versus fit behaviour and the source bounds. Use a fit setting when preserving all visible content is the priority."
    ],
    "faq": [
      {
        "question": "Content is tiny with large margins?",
        "answer": "A very wide source may need landscape orientation or a different fit strategy. Inspect its readable text size rather than only the A4 page dimensions."
      },
      {
        "question": "Edges are clipped?",
        "answer": "Review fill versus fit behaviour and the source bounds. Use a fit setting when preserving all visible content is the priority."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Prepare a document for standard A4 printing."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Scaling may make small text harder to read. It does not reflow paragraphs."
      }
    ],
    "hero": {
      "input": "Mixed sizes",
      "output": "A4 sheets"
    },
    "cta": "Open Resize to A4 →",
    "evidence": {
      "id": "resize",
      "input": "/examples/verified-tools/resize-input.pdf",
      "output": "/examples/verified-tools/resize-result.pdf",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "Output has A4 page width.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      },
      "preview": {
        "input": "/examples/verified-tools/resize-input.png",
        "output": "/examples/verified-tools/resize-result.png"
      }
    }
  },
  {
    "slug": "how-to-mirror-pdf-pages",
    "title": "How to mirror PDF pages",
    "category": "Pages",
    "tool": "mirror-pages",
    "toolId": "flip",
    "toolNumber": 27,
    "summary": "Mirror your pages horizontally or vertically. Learn the available controls, a practical example and what to check.",
    "intent": "How-to",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Mirror pages",
      "How-to"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Confirm that a horizontal mirror is what you need.",
      "Export and check the orientation of text and artwork."
    ],
    "check": "Mirrored text reads backwards. This is different from rotating a sideways page.",
    "limit": "Mirrored text reads backwards. This is different from rotating a sideways page.",
    "sections": [
      {
        "heading": "What this tool actually does",
        "paragraphs": [
          "Mirroring reflects content rather than turning it. Horizontal reverses left and right; vertical reverses top and bottom. Ordinary reading copies usually do not need either."
        ]
      },
      {
        "heading": "Choose the controls for your document",
        "paragraphs": [
          "Choose Mirror direction and test one page. Confirm the printer will not mirror the result again, which would cancel the transformation."
        ]
      },
      {
        "heading": "Before your first export",
        "paragraphs": [
          "For transfer printing, confirm the required mirror direction with the printing process. Read the resulting labels backwards on screen and inspect orientation; mirroring is different from rotating a page."
        ]
      },
      {
        "heading": "The page is upside down rather than left-right reversed",
        "paragraphs": [
          "Review the selected mirror direction. Rotation and vertical reflection can look similar on a symmetrical page; use an asymmetric word for checking."
        ]
      }
    ],
    "tips": [
      "Choose Mirror direction and test one page. Confirm the printer will not mirror the result again, which would cancel the transformation.",
      "Review the selected mirror direction. Rotation and vertical reflection can look similar on a symmetrical page; use an asymmetric word for checking.",
      "Check the print driver and application settings. Use mirroring in one place only, then test a small disposable print."
    ],
    "faq": [
      {
        "question": "The page is upside down rather than left-right reversed?",
        "answer": "Review the selected mirror direction. Rotation and vertical reflection can look similar on a symmetrical page; use an asymmetric word for checking."
      },
      {
        "question": "The printed transfer is reversed twice?",
        "answer": "Check the print driver and application settings. Use mirroring in one place only, then test a small disposable print."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Mirror artwork or correct a mirrored page image."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Mirrored text reads backwards. This is different from rotating a sideways page."
      }
    ],
    "hero": {
      "input": "Original letters",
      "output": "Reflected letters"
    },
    "cta": "Open Mirror pages →",
    "evidence": {
      "id": "flip",
      "input": "/examples/verified-tools/flip-input.pdf",
      "output": "/examples/verified-tools/flip-result.pdf",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "All six source pages remain readable in the parsed output.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      },
      "preview": {
        "input": "/examples/verified-tools/flip-input.png",
        "output": "/examples/verified-tools/flip-result.png"
      }
    }
  },
  {
    "slug": "create-a-mirrored-pdf-for-a-deliberate-print-workflow",
    "title": "Create a mirrored PDF for a deliberate print workflow",
    "category": "Pages",
    "tool": "mirror-pages",
    "toolId": "flip",
    "toolNumber": 27,
    "summary": "A transfer-printing task needs a left-right mirror.",
    "intent": "Practical example",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Mirror pages",
      "Practical example"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Confirm that a horizontal mirror is what you need.",
      "Export and check the orientation of text and artwork."
    ],
    "check": "Mirrored text reads backwards. This is different from rotating a sideways page.",
    "limit": "Mirrored text reads backwards. This is different from rotating a sideways page.",
    "sections": [
      {
        "heading": "The document and the intended outcome",
        "paragraphs": [
          "A transfer-printing task needs a left-right mirror. Choose horizontal mirroring and inspect a word or asymmetric symbol so the direction is unambiguous."
        ]
      },
      {
        "heading": "Make this example work for your file",
        "paragraphs": [
          "For transfer printing, confirm the required mirror direction with the printing process. Read the resulting labels backwards on screen and inspect orientation; mirroring is different from rotating a page."
        ]
      },
      {
        "heading": "Choose only the settings this case needs",
        "paragraphs": [
          "Choose Mirror direction and test one page. Confirm the printer will not mirror the result again, which would cancel the transformation."
        ]
      },
      {
        "heading": "When the example needs a different approach",
        "paragraphs": [
          "Check the print driver and application settings. Use mirroring in one place only, then test a small disposable print."
        ]
      }
    ],
    "tips": [
      "Choose Mirror direction and test one page. Confirm the printer will not mirror the result again, which would cancel the transformation.",
      "Review the selected mirror direction. Rotation and vertical reflection can look similar on a symmetrical page; use an asymmetric word for checking.",
      "Check the print driver and application settings. Use mirroring in one place only, then test a small disposable print."
    ],
    "faq": [
      {
        "question": "The page is upside down rather than left-right reversed?",
        "answer": "Review the selected mirror direction. Rotation and vertical reflection can look similar on a symmetrical page; use an asymmetric word for checking."
      },
      {
        "question": "The printed transfer is reversed twice?",
        "answer": "Check the print driver and application settings. Use mirroring in one place only, then test a small disposable print."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Mirror artwork or correct a mirrored page image."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Mirrored text reads backwards. This is different from rotating a sideways page."
      }
    ],
    "hero": {
      "input": "Original letters",
      "output": "Reflected letters"
    },
    "cta": "Open Mirror pages →",
    "evidence": {
      "id": "flip",
      "input": "/examples/verified-tools/flip-input.pdf",
      "output": "/examples/verified-tools/flip-result.pdf",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "All six source pages remain readable in the parsed output.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      },
      "preview": {
        "input": "/examples/verified-tools/flip-input.png",
        "output": "/examples/verified-tools/flip-result.png"
      }
    }
  },
  {
    "slug": "mirror-pages-common-problems-and-how-to-fix-them",
    "title": "Mirror pages: common problems and how to fix them",
    "category": "Pages",
    "tool": "mirror-pages",
    "toolId": "flip",
    "toolNumber": 27,
    "summary": "Resolve the page is upside down rather than left-right reversed and the printed transfer is reversed twice. Understand the limits before retrying.",
    "intent": "Troubleshooting",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Mirror pages",
      "Troubleshooting"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Confirm that a horizontal mirror is what you need.",
      "Export and check the orientation of text and artwork."
    ],
    "check": "Mirrored text reads backwards. This is different from rotating a sideways page.",
    "limit": "Mirrored text reads backwards. This is different from rotating a sideways page.",
    "sections": [
      {
        "heading": "The page is upside down rather than left-right reversed",
        "paragraphs": [
          "Review the selected mirror direction. Rotation and vertical reflection can look similar on a symmetrical page; use an asymmetric word for checking."
        ]
      },
      {
        "heading": "The printed transfer is reversed twice",
        "paragraphs": [
          "Check the print driver and application settings. Use mirroring in one place only, then test a small disposable print."
        ]
      },
      {
        "heading": "Check whether this is the right operation",
        "paragraphs": [
          "Mirroring reflects content rather than turning it. Horizontal reverses left and right; vertical reverses top and bottom. Ordinary reading copies usually do not need either."
        ]
      },
      {
        "heading": "A more useful retry",
        "paragraphs": [
          "For transfer printing, confirm the required mirror direction with the printing process. Read the resulting labels backwards on screen and inspect orientation; mirroring is different from rotating a page."
        ]
      }
    ],
    "tips": [
      "Choose Mirror direction and test one page. Confirm the printer will not mirror the result again, which would cancel the transformation.",
      "Review the selected mirror direction. Rotation and vertical reflection can look similar on a symmetrical page; use an asymmetric word for checking.",
      "Check the print driver and application settings. Use mirroring in one place only, then test a small disposable print."
    ],
    "faq": [
      {
        "question": "The page is upside down rather than left-right reversed?",
        "answer": "Review the selected mirror direction. Rotation and vertical reflection can look similar on a symmetrical page; use an asymmetric word for checking."
      },
      {
        "question": "The printed transfer is reversed twice?",
        "answer": "Check the print driver and application settings. Use mirroring in one place only, then test a small disposable print."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Mirror artwork or correct a mirrored page image."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Mirrored text reads backwards. This is different from rotating a sideways page."
      }
    ],
    "hero": {
      "input": "Original letters",
      "output": "Reflected letters"
    },
    "cta": "Open Mirror pages →",
    "evidence": {
      "id": "flip",
      "input": "/examples/verified-tools/flip-input.pdf",
      "output": "/examples/verified-tools/flip-result.pdf",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "All six source pages remain readable in the parsed output.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      },
      "preview": {
        "input": "/examples/verified-tools/flip-input.png",
        "output": "/examples/verified-tools/flip-result.png"
      }
    }
  },
  {
    "slug": "correct-a-contact-line-in-a-pdf-cv",
    "title": "Correct a contact line in a PDF CV",
    "category": "Edit & sign",
    "tool": "edit-pdf-text",
    "toolId": "native-text",
    "toolNumber": 28,
    "summary": "A CV exported from Word has an outdated phone number in real text.",
    "intent": "Practical example",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Edit existing text",
      "Practical example"
    ],
    "steps": [
      "Open a PDF. Select an existing text object on the page.",
      "Enter a short replacement and preview the changed PDF. Use characters supported by the available font and keep the replacement within its bounds.",
      "Keep the edited document in the workspace or export it. Reopen the output and inspect each changed line."
    ],
    "check": "Scanned text is an image and cannot be edited with this tool. Paragraph reflow is unsupported. Embedded fonts may lack new characters; fitting can shrink text to half its original size. A visible replacement is not a redaction guarantee.",
    "limit": "Browser text editing. Single-line edits can shrink to fit the original area (minimum half size). Embedded fonts need available characters; scans and nested graphics have limitations. No paragraph reflow. Editing invalidates digital signatures.",
    "sections": [
      {
        "heading": "The document and the intended outcome",
        "paragraphs": [
          "A CV exported from Word has an outdated phone number in real text. Select the existing line, enter a short replacement, leave the line to apply it and inspect the exported text."
        ]
      },
      {
        "heading": "Make this example work for your file",
        "paragraphs": [
          "For a contact-detail correction, compare the new number character by character. Reopen the downloaded PDF and test selection around the edit. A visually correct replacement still needs a check for wrapping and neighbouring text."
        ]
      },
      {
        "heading": "Choose only the settings this case needs",
        "paragraphs": [
          "Keep the replacement within the supported font and text area. Aligned compatible paragraph editing has limits; mixed fonts, extra lines, scans and nested graphics can still prevent a reliable replacement."
        ]
      },
      {
        "heading": "When the example needs a different approach",
        "paragraphs": [
          "Try a shorter value and characters supported by the source font. Check the actual output and undo an edit that makes the line unreadable."
        ]
      }
    ],
    "tips": [
      "Keep the replacement within the supported font and text area. Aligned compatible paragraph editing has limits; mixed fonts, extra lines, scans and nested graphics can still prevent a reliable replacement.",
      "It may be an image, outlined letters or unsupported structure. OCR can add searchability to a scan without rebuilding editable original text.",
      "Try a shorter value and characters supported by the source font. Check the actual output and undo an edit that makes the line unreadable."
    ],
    "faq": [
      {
        "question": "The text cannot be selected?",
        "answer": "It may be an image, outlined letters or unsupported structure. OCR can add searchability to a scan without rebuilding editable original text."
      },
      {
        "question": "The replacement shrinks or loses characters?",
        "answer": "Try a shorter value and characters supported by the source font. Check the actual output and undo an edit that makes the line unreadable."
      },
      {
        "question": "Why can I not select a sentence?",
        "answer": "It may be a scan, outlined artwork or unsupported text structure. OCR adds searchable text but does not reconstruct a fully editable layout."
      },
      {
        "question": "Does this edit the original text?",
        "answer": "Supported single-line PDF text objects are changed in the exported PDF. This is different from adding a text overlay."
      }
    ],
    "hero": {
      "input": "Old contact line",
      "output": "Changed text object"
    },
    "cta": "Open Edit existing text →"
  },
  {
    "slug": "edit-existing-text-common-problems-and-how-to-fix-them",
    "title": "Edit existing text: common problems and how to fix them",
    "category": "Edit & sign",
    "tool": "edit-pdf-text",
    "toolId": "native-text",
    "toolNumber": 28,
    "summary": "Resolve the text cannot be selected and the replacement shrinks or loses characters. Understand the limits before retrying.",
    "intent": "Troubleshooting",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Edit existing text",
      "Troubleshooting"
    ],
    "steps": [
      "Open a PDF. Select an existing text object on the page.",
      "Enter a short replacement and preview the changed PDF. Use characters supported by the available font and keep the replacement within its bounds.",
      "Keep the edited document in the workspace or export it. Reopen the output and inspect each changed line."
    ],
    "check": "Scanned text is an image and cannot be edited with this tool. Paragraph reflow is unsupported. Embedded fonts may lack new characters; fitting can shrink text to half its original size. A visible replacement is not a redaction guarantee.",
    "limit": "Browser text editing. Single-line edits can shrink to fit the original area (minimum half size). Embedded fonts need available characters; scans and nested graphics have limitations. No paragraph reflow. Editing invalidates digital signatures.",
    "sections": [
      {
        "heading": "The text cannot be selected",
        "paragraphs": [
          "It may be an image, outlined letters or unsupported structure. OCR can add searchability to a scan without rebuilding editable original text."
        ]
      },
      {
        "heading": "The replacement shrinks or loses characters",
        "paragraphs": [
          "Try a shorter value and characters supported by the source font. Check the actual output and undo an edit that makes the line unreadable."
        ]
      },
      {
        "heading": "Check whether this is the right operation",
        "paragraphs": [
          "This changes supported original text objects. Adding a white box and a new label is a different overlay workflow and may leave the old value extractable."
        ]
      },
      {
        "heading": "A more useful retry",
        "paragraphs": [
          "For a contact-detail correction, compare the new number character by character. Reopen the downloaded PDF and test selection around the edit. A visually correct replacement still needs a check for wrapping and neighbouring text."
        ]
      }
    ],
    "tips": [
      "Keep the replacement within the supported font and text area. Aligned compatible paragraph editing has limits; mixed fonts, extra lines, scans and nested graphics can still prevent a reliable replacement.",
      "It may be an image, outlined letters or unsupported structure. OCR can add searchability to a scan without rebuilding editable original text.",
      "Try a shorter value and characters supported by the source font. Check the actual output and undo an edit that makes the line unreadable."
    ],
    "faq": [
      {
        "question": "The text cannot be selected?",
        "answer": "It may be an image, outlined letters or unsupported structure. OCR can add searchability to a scan without rebuilding editable original text."
      },
      {
        "question": "The replacement shrinks or loses characters?",
        "answer": "Try a shorter value and characters supported by the source font. Check the actual output and undo an edit that makes the line unreadable."
      },
      {
        "question": "Why can I not select a sentence?",
        "answer": "It may be a scan, outlined artwork or unsupported text structure. OCR adds searchable text but does not reconstruct a fully editable layout."
      },
      {
        "question": "Does this edit the original text?",
        "answer": "Supported single-line PDF text objects are changed in the exported PDF. This is different from adding a text overlay."
      }
    ],
    "hero": {
      "input": "Old contact line",
      "output": "Changed text object"
    },
    "cta": "Open Edit existing text →"
  },
  {
    "slug": "how-to-add-text-images-and-drawings-to-a-pdf",
    "title": "How to add text, images and drawings to a PDF",
    "category": "Edit & sign",
    "tool": "add-text-and-images",
    "toolId": "edit",
    "toolNumber": 29,
    "summary": "Add text, images and annotations. Learn the available controls, a practical example and what to check.",
    "intent": "How-to",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Add text & images",
      "How-to",
      "annotate",
      "add text",
      "insert image"
    ],
    "steps": [
      "Open your PDF and choose the text, image or drawing tool.",
      "For text on mobile, tap the page to place it before typing. Select an item to adjust its color and size; use the tick to finish or the bin to remove it.",
      "Choose Export PDF, reopen the download and check added items at normal reading size."
    ],
    "check": "Adds new elements over page content. Use Edit existing text for supported text-object replacements and Redact for secure removal.",
    "limit": "Adds new elements and visual whiteout. Use Edit existing text for actual text replacement; use Redact for content removal.",
    "sections": [
      {
        "heading": "What this tool actually does",
        "paragraphs": [
          "Add text & images creates new elements over the page. Move and resize those elements without assuming underlying source text has been replaced or securely removed."
        ]
      },
      {
        "heading": "Choose the controls for your document",
        "paragraphs": [
          "On mobile, choose Text before placing the field; edit after placement. Use the compact second-row colour controls, tick to finish and delete control to remove a selected addition."
        ]
      },
      {
        "heading": "Before your first export",
        "paragraphs": [
          "For an annotated review copy, use a consistent color and keep additions clear of the original text. Select each addition to adjust or delete it. Added notes should explain the document without obscuring its source content."
        ]
      },
      {
        "heading": "The old wording still exists underneath",
        "paragraphs": [
          "An overlay does not delete it. Use Edit existing text for supported replacement, or Redact for permanent removal of a region."
        ]
      }
    ],
    "tips": [
      "On mobile, choose Text before placing the field; edit after placement. Use the compact second-row colour controls, tick to finish and delete control to remove a selected addition.",
      "An overlay does not delete it. Use Edit existing text for supported replacement, or Redact for permanent removal of a region.",
      "Select it and move or resize it; remove it if unnecessary. Inspect the exported page at normal zoom to check that notes do not cover required content."
    ],
    "faq": [
      {
        "question": "The old wording still exists underneath?",
        "answer": "An overlay does not delete it. Use Edit existing text for supported replacement, or Redact for permanent removal of a region."
      },
      {
        "question": "A newly added element is in the wrong place?",
        "answer": "Select it and move or resize it; remove it if unnecessary. Inspect the exported page at normal zoom to check that notes do not cover required content."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Annotate a document or add information to a static form."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Adds new elements over page content. Use Edit existing text for supported text-object replacements and Redact for secure removal."
      }
    ],
    "hero": {
      "input": "Source page",
      "output": "Added note and image"
    },
    "cta": "Open Add text & images →"
  },
  {
    "slug": "add-a-review-note-and-image-to-a-pdf",
    "title": "Add a review note and image to a PDF",
    "category": "Edit & sign",
    "tool": "add-text-and-images",
    "toolId": "edit",
    "toolNumber": 29,
    "summary": "A reviewer adds an Approved note and a small reference image without changing original wording.",
    "intent": "Practical example",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Add text & images",
      "Practical example",
      "annotate",
      "add text",
      "insert image"
    ],
    "steps": [
      "Open your PDF and choose the text, image or drawing tool.",
      "For text on mobile, tap the page to place it before typing. Select an item to adjust its color and size; use the tick to finish or the bin to remove it.",
      "Choose Export PDF, reopen the download and check added items at normal reading size."
    ],
    "check": "Adds new elements over page content. Use Edit existing text for supported text-object replacements and Redact for secure removal.",
    "limit": "Adds new elements and visual whiteout. Use Edit existing text for actual text replacement; use Redact for content removal.",
    "sections": [
      {
        "heading": "The document and the intended outcome",
        "paragraphs": [
          "A reviewer adds an Approved note and a small reference image without changing original wording. Choose Text, place it on the page, edit it, then insert and position the image."
        ]
      },
      {
        "heading": "Make this example work for your file",
        "paragraphs": [
          "For an annotated review copy, use a consistent color and keep additions clear of the original text. Select each addition to adjust or delete it. Added notes should explain the document without obscuring its source content."
        ]
      },
      {
        "heading": "Choose only the settings this case needs",
        "paragraphs": [
          "On mobile, choose Text before placing the field; edit after placement. Use the compact second-row colour controls, tick to finish and delete control to remove a selected addition."
        ]
      },
      {
        "heading": "When the example needs a different approach",
        "paragraphs": [
          "Select it and move or resize it; remove it if unnecessary. Inspect the exported page at normal zoom to check that notes do not cover required content."
        ]
      }
    ],
    "tips": [
      "On mobile, choose Text before placing the field; edit after placement. Use the compact second-row colour controls, tick to finish and delete control to remove a selected addition.",
      "An overlay does not delete it. Use Edit existing text for supported replacement, or Redact for permanent removal of a region.",
      "Select it and move or resize it; remove it if unnecessary. Inspect the exported page at normal zoom to check that notes do not cover required content."
    ],
    "faq": [
      {
        "question": "The old wording still exists underneath?",
        "answer": "An overlay does not delete it. Use Edit existing text for supported replacement, or Redact for permanent removal of a region."
      },
      {
        "question": "A newly added element is in the wrong place?",
        "answer": "Select it and move or resize it; remove it if unnecessary. Inspect the exported page at normal zoom to check that notes do not cover required content."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Annotate a document or add information to a static form."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Adds new elements over page content. Use Edit existing text for supported text-object replacements and Redact for secure removal."
      }
    ],
    "hero": {
      "input": "Source page",
      "output": "Added note and image"
    },
    "cta": "Open Add text & images →"
  },
  {
    "slug": "add-text-images-common-problems-and-how-to-fix-them",
    "title": "Add text & images: common problems and how to fix them",
    "category": "Edit & sign",
    "tool": "add-text-and-images",
    "toolId": "edit",
    "toolNumber": 29,
    "summary": "Resolve the old wording still exists underneath and a newly added element is in the wrong place. Understand the limits before retrying.",
    "intent": "Troubleshooting",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Add text & images",
      "Troubleshooting",
      "annotate",
      "add text",
      "insert image"
    ],
    "steps": [
      "Open your PDF and choose the text, image or drawing tool.",
      "For text on mobile, tap the page to place it before typing. Select an item to adjust its color and size; use the tick to finish or the bin to remove it.",
      "Choose Export PDF, reopen the download and check added items at normal reading size."
    ],
    "check": "Adds new elements over page content. Use Edit existing text for supported text-object replacements and Redact for secure removal.",
    "limit": "Adds new elements and visual whiteout. Use Edit existing text for actual text replacement; use Redact for content removal.",
    "sections": [
      {
        "heading": "The old wording still exists underneath",
        "paragraphs": [
          "An overlay does not delete it. Use Edit existing text for supported replacement, or Redact for permanent removal of a region."
        ]
      },
      {
        "heading": "A newly added element is in the wrong place",
        "paragraphs": [
          "Select it and move or resize it; remove it if unnecessary. Inspect the exported page at normal zoom to check that notes do not cover required content."
        ]
      },
      {
        "heading": "Check whether this is the right operation",
        "paragraphs": [
          "Add text & images creates new elements over the page. Move and resize those elements without assuming underlying source text has been replaced or securely removed."
        ]
      },
      {
        "heading": "A more useful retry",
        "paragraphs": [
          "For an annotated review copy, use a consistent color and keep additions clear of the original text. Select each addition to adjust or delete it. Added notes should explain the document without obscuring its source content."
        ]
      }
    ],
    "tips": [
      "On mobile, choose Text before placing the field; edit after placement. Use the compact second-row colour controls, tick to finish and delete control to remove a selected addition.",
      "An overlay does not delete it. Use Edit existing text for supported replacement, or Redact for permanent removal of a region.",
      "Select it and move or resize it; remove it if unnecessary. Inspect the exported page at normal zoom to check that notes do not cover required content."
    ],
    "faq": [
      {
        "question": "The old wording still exists underneath?",
        "answer": "An overlay does not delete it. Use Edit existing text for supported replacement, or Redact for permanent removal of a region."
      },
      {
        "question": "A newly added element is in the wrong place?",
        "answer": "Select it and move or resize it; remove it if unnecessary. Inspect the exported page at normal zoom to check that notes do not cover required content."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Annotate a document or add information to a static form."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Adds new elements over page content. Use Edit existing text for supported text-object replacements and Redact for secure removal."
      }
    ],
    "hero": {
      "input": "Source page",
      "output": "Added note and image"
    },
    "cta": "Open Add text & images →"
  },
  {
    "slug": "place-a-signature-name-and-date-without-printing",
    "title": "Place a signature, name and date without printing",
    "category": "Edit & sign",
    "tool": "sign-pdf",
    "toolId": "sign",
    "toolNumber": 30,
    "summary": "A document needs a visual signature, initials and today’s date.",
    "intent": "Practical example",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Sign PDF",
      "Practical example",
      "signature",
      "signing"
    ],
    "steps": [
      "Open your PDF. Enter your name in the signing panel and choose Create signature.",
      "In the popup, draw, type or upload your signature. Confirm it, then drag the signature or optional name, initials and date onto the intended page.",
      "Adjust each item, use its edit control when needed, then choose Export PDF. Reopen the download and check every placement."
    ],
    "check": "A signature image is not certificate-based digital signing or identity verification. Use a transparent image when possible and inspect the output before sharing.",
    "limit": "A visual signature, without a certificate or identity verification.",
    "sections": [
      {
        "heading": "The document and the intended outcome",
        "paragraphs": [
          "A document needs a visual signature, initials and today’s date. Enter your name, create the signature in the popup, then drag the required fields to their designated places."
        ]
      },
      {
        "heading": "Make this example work for your file",
        "paragraphs": [
          "For a consent form, put the signature, name and date in their respective spaces. Review the date format and each page requiring a signature. A visual signature does not establish identity or provide certificate validation."
        ]
      },
      {
        "heading": "Choose only the settings this case needs",
        "paragraphs": [
          "Keep Name above Create signature, choose the date with DD/MM/YYYY format, and use one uploaded image or stamp field when needed. Move and resize each placed item before Export PDF."
        ]
      },
      {
        "heading": "When the example needs a different approach",
        "paragraphs": [
          "A signature image does not supply identity verification or cryptographic signing. Follow the recipient’s specified signing method rather than treating visible artwork as a certificate."
        ]
      }
    ],
    "tips": [
      "Keep Name above Create signature, choose the date with DD/MM/YYYY format, and use one uploaded image or stamp field when needed. Move and resize each placed item before Export PDF.",
      "Check the current document and page before dropping it. Remove the misplaced field and place it again; use the selected-field page scope only when repetition is intended.",
      "A signature image does not supply identity verification or cryptographic signing. Follow the recipient’s specified signing method rather than treating visible artwork as a certificate."
    ],
    "faq": [
      {
        "question": "The signature is on the wrong page?",
        "answer": "Check the current document and page before dropping it. Remove the misplaced field and place it again; use the selected-field page scope only when repetition is intended."
      },
      {
        "question": "A recipient asks for a digital certificate?",
        "answer": "A signature image does not supply identity verification or cryptographic signing. Follow the recipient’s specified signing method rather than treating visible artwork as a certificate."
      },
      {
        "question": "Is this cryptographic signing?",
        "answer": "No. The tool places a visual signature; it does not issue a certificate or verify identity."
      }
    ],
    "hero": {
      "input": "Signature fields",
      "output": "Placed signature"
    },
    "cta": "Open Sign PDF →"
  },
  {
    "slug": "sign-pdf-common-problems-and-how-to-fix-them",
    "title": "Sign PDF: common problems and how to fix them",
    "category": "Edit & sign",
    "tool": "sign-pdf",
    "toolId": "sign",
    "toolNumber": 30,
    "summary": "Resolve the signature is on the wrong page and a recipient asks for a digital certificate. Understand the limits before retrying.",
    "intent": "Troubleshooting",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Sign PDF",
      "Troubleshooting",
      "signature",
      "signing"
    ],
    "steps": [
      "Open your PDF. Enter your name in the signing panel and choose Create signature.",
      "In the popup, draw, type or upload your signature. Confirm it, then drag the signature or optional name, initials and date onto the intended page.",
      "Adjust each item, use its edit control when needed, then choose Export PDF. Reopen the download and check every placement."
    ],
    "check": "A signature image is not certificate-based digital signing or identity verification. Use a transparent image when possible and inspect the output before sharing.",
    "limit": "A visual signature, without a certificate or identity verification.",
    "sections": [
      {
        "heading": "The signature is on the wrong page",
        "paragraphs": [
          "Check the current document and page before dropping it. Remove the misplaced field and place it again; use the selected-field page scope only when repetition is intended."
        ]
      },
      {
        "heading": "A recipient asks for a digital certificate",
        "paragraphs": [
          "A signature image does not supply identity verification or cryptographic signing. Follow the recipient’s specified signing method rather than treating visible artwork as a certificate."
        ]
      },
      {
        "heading": "Check whether this is the right operation",
        "paragraphs": [
          "Type, Draw and Upload create reusable visual artwork. A trailing edit pencil changes that artwork; it does not require adding a second signature card."
        ]
      },
      {
        "heading": "A more useful retry",
        "paragraphs": [
          "For a consent form, put the signature, name and date in their respective spaces. Review the date format and each page requiring a signature. A visual signature does not establish identity or provide certificate validation."
        ]
      }
    ],
    "tips": [
      "Keep Name above Create signature, choose the date with DD/MM/YYYY format, and use one uploaded image or stamp field when needed. Move and resize each placed item before Export PDF.",
      "Check the current document and page before dropping it. Remove the misplaced field and place it again; use the selected-field page scope only when repetition is intended.",
      "A signature image does not supply identity verification or cryptographic signing. Follow the recipient’s specified signing method rather than treating visible artwork as a certificate."
    ],
    "faq": [
      {
        "question": "The signature is on the wrong page?",
        "answer": "Check the current document and page before dropping it. Remove the misplaced field and place it again; use the selected-field page scope only when repetition is intended."
      },
      {
        "question": "A recipient asks for a digital certificate?",
        "answer": "A signature image does not supply identity verification or cryptographic signing. Follow the recipient’s specified signing method rather than treating visible artwork as a certificate."
      },
      {
        "question": "Is this cryptographic signing?",
        "answer": "No. The tool places a visual signature; it does not issue a certificate or verify identity."
      }
    ],
    "hero": {
      "input": "Signature fields",
      "output": "Placed signature"
    },
    "cta": "Open Sign PDF →"
  },
  {
    "slug": "remove-a-private-identifier-before-sharing-a-pdf",
    "title": "Remove a private identifier before sharing a PDF",
    "category": "Edit & sign",
    "tool": "redact-pdf",
    "toolId": "redact",
    "toolNumber": 31,
    "summary": "A reading copy contains a private identifier in a header.",
    "intent": "Practical example",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Redact PDF",
      "Practical example"
    ],
    "steps": [
      "Open the PDF and mark each sensitive region carefully.",
      "Export the redacted document. Pages are rebuilt as images with the marked regions removed.",
      "Inspect every affected page and verify that sensitive content cannot be selected or found in the result before sharing."
    ],
    "check": "An ordinary black shape is not redaction. This operation rasterizes all pages and loses searchable text and interactive features. Review region edges, other pages and visible identifying information.",
    "limit": "Export rebuilds all pages as images and removes original text, links, metadata and forms.",
    "sections": [
      {
        "heading": "The document and the intended outcome",
        "paragraphs": [
          "A reading copy contains a private identifier in a header. Mark the whole region, apply redaction, then inspect visible edges and search or extract the output to check the old phrase is absent."
        ]
      },
      {
        "heading": "Make this example work for your file",
        "paragraphs": [
          "For a public copy, identify every occurrence of the sensitive detail, including headers and repeated pages. After export, inspect the visible page and extracted text. A single covered region does not address other copies of the information."
        ]
      },
      {
        "heading": "Choose only the settings this case needs",
        "paragraphs": [
          "Cover the complete item with a little boundary allowance. Review every occurrence, other pages and visible identifying clues; metadata cleanup alone does not solve this task."
        ]
      },
      {
        "heading": "When the example needs a different approach",
        "paragraphs": [
          "That is a consequence of the image-based redaction output. Keep the original privately and use the redacted reading copy only for the intended sharing purpose."
        ]
      }
    ],
    "tips": [
      "Cover the complete item with a little boundary allowance. Review every occurrence, other pages and visible identifying clues; metadata cleanup alone does not solve this task.",
      "Expand the marked region and repeat from the original. Check small text and neighbouring lines at high zoom instead of accepting a roughly placed box.",
      "That is a consequence of the image-based redaction output. Keep the original privately and use the redacted reading copy only for the intended sharing purpose."
    ],
    "faq": [
      {
        "question": "The phrase can still be seen outside the region?",
        "answer": "Expand the marked region and repeat from the original. Check small text and neighbouring lines at high zoom instead of accepting a roughly placed box."
      },
      {
        "question": "Search and form fields disappear?",
        "answer": "That is a consequence of the image-based redaction output. Keep the original privately and use the redacted reading copy only for the intended sharing purpose."
      },
      {
        "question": "Is a black rectangle enough?",
        "answer": "No. A normal overlay may leave underlying content intact. Use the dedicated Redact export."
      },
      {
        "question": "Will forms and selectable text remain?",
        "answer": "No. This implementation rebuilds pages as images and discards those original features."
      }
    ],
    "hero": {
      "input": "Sensitive region",
      "output": "Removed region"
    },
    "cta": "Open Redact PDF →"
  },
  {
    "slug": "redact-pdf-common-problems-and-how-to-fix-them",
    "title": "Redact PDF: common problems and how to fix them",
    "category": "Edit & sign",
    "tool": "redact-pdf",
    "toolId": "redact",
    "toolNumber": 31,
    "summary": "Resolve the phrase can still be seen outside the region and search and form fields disappear. Understand the limits before retrying.",
    "intent": "Troubleshooting",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Redact PDF",
      "Troubleshooting"
    ],
    "steps": [
      "Open the PDF and mark each sensitive region carefully.",
      "Export the redacted document. Pages are rebuilt as images with the marked regions removed.",
      "Inspect every affected page and verify that sensitive content cannot be selected or found in the result before sharing."
    ],
    "check": "An ordinary black shape is not redaction. This operation rasterizes all pages and loses searchable text and interactive features. Review region edges, other pages and visible identifying information.",
    "limit": "Export rebuilds all pages as images and removes original text, links, metadata and forms.",
    "sections": [
      {
        "heading": "The phrase can still be seen outside the region",
        "paragraphs": [
          "Expand the marked region and repeat from the original. Check small text and neighbouring lines at high zoom instead of accepting a roughly placed box."
        ]
      },
      {
        "heading": "Search and form fields disappear",
        "paragraphs": [
          "That is a consequence of the image-based redaction output. Keep the original privately and use the redacted reading copy only for the intended sharing purpose."
        ]
      },
      {
        "heading": "Check whether this is the right operation",
        "paragraphs": [
          "The dedicated export rebuilds all pages as images with the selected regions removed. A normal rectangle or whiteout overlay does not provide that removal."
        ]
      },
      {
        "heading": "A more useful retry",
        "paragraphs": [
          "For a public copy, identify every occurrence of the sensitive detail, including headers and repeated pages. After export, inspect the visible page and extracted text. A single covered region does not address other copies of the information."
        ]
      }
    ],
    "tips": [
      "Cover the complete item with a little boundary allowance. Review every occurrence, other pages and visible identifying clues; metadata cleanup alone does not solve this task.",
      "Expand the marked region and repeat from the original. Check small text and neighbouring lines at high zoom instead of accepting a roughly placed box.",
      "That is a consequence of the image-based redaction output. Keep the original privately and use the redacted reading copy only for the intended sharing purpose."
    ],
    "faq": [
      {
        "question": "The phrase can still be seen outside the region?",
        "answer": "Expand the marked region and repeat from the original. Check small text and neighbouring lines at high zoom instead of accepting a roughly placed box."
      },
      {
        "question": "Search and form fields disappear?",
        "answer": "That is a consequence of the image-based redaction output. Keep the original privately and use the redacted reading copy only for the intended sharing purpose."
      },
      {
        "question": "Is a black rectangle enough?",
        "answer": "No. A normal overlay may leave underlying content intact. Use the dedicated Redact export."
      },
      {
        "question": "Will forms and selectable text remain?",
        "answer": "No. This implementation rebuilds pages as images and discards those original features."
      }
    ],
    "hero": {
      "input": "Sensitive region",
      "output": "Removed region"
    },
    "cta": "Open Redact PDF →"
  },
  {
    "slug": "how-to-add-a-watermark-to-a-pdf",
    "title": "How to add a watermark to a PDF",
    "category": "Edit & sign",
    "tool": "add-watermark",
    "toolId": "watermark",
    "toolNumber": 32,
    "summary": "Your text, across every page. Learn the available controls, a practical example and what to check.",
    "intent": "How-to",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Add watermark",
      "How-to"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Enter the watermark text and inspect its placement.",
      "Export and check readability on pages with different orientations."
    ],
    "check": "A watermark is a visual label, not encryption or an access-control mechanism.",
    "limit": "A watermark is a visual label, not encryption or an access-control mechanism.",
    "sections": [
      {
        "heading": "What this tool actually does",
        "paragraphs": [
          "A text watermark adds a visible label. It does not prevent copying, authenticate ownership or replace document access controls."
        ]
      },
      {
        "heading": "Choose the controls for your document",
        "paragraphs": [
          "Choose text, size, position, rotation and opacity where available. Avoid covering essential small print; inspect both portrait and landscape pages in a mixed pack."
        ]
      },
      {
        "heading": "Before your first export",
        "paragraphs": [
          "For a draft pack, place the label where it remains visible without masking numbers or signatures. The watermark communicates document status; it does not restrict copying or prevent a recipient from editing the file."
        ]
      },
      {
        "heading": "The label covers important text",
        "paragraphs": [
          "Lower opacity, reduce size or move it to a suitable position. A watermark should communicate status without making the document unusable."
        ]
      }
    ],
    "tips": [
      "Choose text, size, position, rotation and opacity where available. Avoid covering essential small print; inspect both portrait and landscape pages in a mixed pack.",
      "Lower opacity, reduce size or move it to a suitable position. A watermark should communicate status without making the document unusable.",
      "Check the exported result and available placement controls. Test on a page with a full-page image because layering may differ from a mostly textual page."
    ],
    "faq": [
      {
        "question": "The label covers important text?",
        "answer": "Lower opacity, reduce size or move it to a suitable position. A watermark should communicate status without making the document unusable."
      },
      {
        "question": "The label appears behind existing artwork?",
        "answer": "Check the exported result and available placement controls. Test on a page with a full-page image because layering may differ from a mostly textual page."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Label copies with a visible draft or ownership notice."
      },
      {
        "question": "What should I check in the result?",
        "answer": "A watermark is a visual label, not encryption or an access-control mechanism."
      }
    ],
    "hero": {
      "input": "Review document",
      "output": "DRAFT label"
    },
    "cta": "Open Add watermark →",
    "evidence": {
      "id": "watermark",
      "input": "/examples/verified-tools/watermark-input.pdf",
      "output": "/examples/verified-tools/watermark-result.pdf",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "Requested label is present in extracted output text.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "DRAFT",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      },
      "preview": {
        "input": "/examples/verified-tools/watermark-input.png",
        "output": "/examples/verified-tools/watermark-result.png"
      }
    }
  },
  {
    "slug": "label-a-review-pdf-as-a-draft",
    "title": "Label a review PDF as a draft",
    "category": "Edit & sign",
    "tool": "add-watermark",
    "toolId": "watermark",
    "toolNumber": 32,
    "summary": "A report is ready for review but not final release.",
    "intent": "Practical example",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Add watermark",
      "Practical example"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Enter the watermark text and inspect its placement.",
      "Export and check readability on pages with different orientations."
    ],
    "check": "A watermark is a visual label, not encryption or an access-control mechanism.",
    "limit": "A watermark is a visual label, not encryption or an access-control mechanism.",
    "sections": [
      {
        "heading": "The document and the intended outcome",
        "paragraphs": [
          "A report is ready for review but not final release. Add DRAFT with an unobtrusive angle and opacity, inspect a dense page and export the labelled copy."
        ]
      },
      {
        "heading": "Make this example work for your file",
        "paragraphs": [
          "For a draft pack, place the label where it remains visible without masking numbers or signatures. The watermark communicates document status; it does not restrict copying or prevent a recipient from editing the file."
        ]
      },
      {
        "heading": "Choose only the settings this case needs",
        "paragraphs": [
          "Choose text, size, position, rotation and opacity where available. Avoid covering essential small print; inspect both portrait and landscape pages in a mixed pack."
        ]
      },
      {
        "heading": "When the example needs a different approach",
        "paragraphs": [
          "Check the exported result and available placement controls. Test on a page with a full-page image because layering may differ from a mostly textual page."
        ]
      }
    ],
    "tips": [
      "Choose text, size, position, rotation and opacity where available. Avoid covering essential small print; inspect both portrait and landscape pages in a mixed pack.",
      "Lower opacity, reduce size or move it to a suitable position. A watermark should communicate status without making the document unusable.",
      "Check the exported result and available placement controls. Test on a page with a full-page image because layering may differ from a mostly textual page."
    ],
    "faq": [
      {
        "question": "The label covers important text?",
        "answer": "Lower opacity, reduce size or move it to a suitable position. A watermark should communicate status without making the document unusable."
      },
      {
        "question": "The label appears behind existing artwork?",
        "answer": "Check the exported result and available placement controls. Test on a page with a full-page image because layering may differ from a mostly textual page."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Label copies with a visible draft or ownership notice."
      },
      {
        "question": "What should I check in the result?",
        "answer": "A watermark is a visual label, not encryption or an access-control mechanism."
      }
    ],
    "hero": {
      "input": "Review document",
      "output": "DRAFT label"
    },
    "cta": "Open Add watermark →",
    "evidence": {
      "id": "watermark",
      "input": "/examples/verified-tools/watermark-input.pdf",
      "output": "/examples/verified-tools/watermark-result.pdf",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "Requested label is present in extracted output text.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "DRAFT",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      },
      "preview": {
        "input": "/examples/verified-tools/watermark-input.png",
        "output": "/examples/verified-tools/watermark-result.png"
      }
    }
  },
  {
    "slug": "add-watermark-common-problems-and-how-to-fix-them",
    "title": "Add watermark: common problems and how to fix them",
    "category": "Edit & sign",
    "tool": "add-watermark",
    "toolId": "watermark",
    "toolNumber": 32,
    "summary": "Resolve the label covers important text and the label appears behind existing artwork. Understand the limits before retrying.",
    "intent": "Troubleshooting",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Add watermark",
      "Troubleshooting"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Enter the watermark text and inspect its placement.",
      "Export and check readability on pages with different orientations."
    ],
    "check": "A watermark is a visual label, not encryption or an access-control mechanism.",
    "limit": "A watermark is a visual label, not encryption or an access-control mechanism.",
    "sections": [
      {
        "heading": "The label covers important text",
        "paragraphs": [
          "Lower opacity, reduce size or move it to a suitable position. A watermark should communicate status without making the document unusable."
        ]
      },
      {
        "heading": "The label appears behind existing artwork",
        "paragraphs": [
          "Check the exported result and available placement controls. Test on a page with a full-page image because layering may differ from a mostly textual page."
        ]
      },
      {
        "heading": "Check whether this is the right operation",
        "paragraphs": [
          "A text watermark adds a visible label. It does not prevent copying, authenticate ownership or replace document access controls."
        ]
      },
      {
        "heading": "A more useful retry",
        "paragraphs": [
          "For a draft pack, place the label where it remains visible without masking numbers or signatures. The watermark communicates document status; it does not restrict copying or prevent a recipient from editing the file."
        ]
      }
    ],
    "tips": [
      "Choose text, size, position, rotation and opacity where available. Avoid covering essential small print; inspect both portrait and landscape pages in a mixed pack.",
      "Lower opacity, reduce size or move it to a suitable position. A watermark should communicate status without making the document unusable.",
      "Check the exported result and available placement controls. Test on a page with a full-page image because layering may differ from a mostly textual page."
    ],
    "faq": [
      {
        "question": "The label covers important text?",
        "answer": "Lower opacity, reduce size or move it to a suitable position. A watermark should communicate status without making the document unusable."
      },
      {
        "question": "The label appears behind existing artwork?",
        "answer": "Check the exported result and available placement controls. Test on a page with a full-page image because layering may differ from a mostly textual page."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Label copies with a visible draft or ownership notice."
      },
      {
        "question": "What should I check in the result?",
        "answer": "A watermark is a visual label, not encryption or an access-control mechanism."
      }
    ],
    "hero": {
      "input": "Review document",
      "output": "DRAFT label"
    },
    "cta": "Open Add watermark →",
    "evidence": {
      "id": "watermark",
      "input": "/examples/verified-tools/watermark-input.pdf",
      "output": "/examples/verified-tools/watermark-result.pdf",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "Requested label is present in extracted output text.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "DRAFT",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      },
      "preview": {
        "input": "/examples/verified-tools/watermark-input.png",
        "output": "/examples/verified-tools/watermark-result.png"
      }
    }
  },
  {
    "slug": "number-a-report-after-assembling-its-pages",
    "title": "Number a report after assembling its pages",
    "category": "Edit & sign",
    "tool": "add-page-numbers",
    "toolId": "numbers",
    "toolNumber": 33,
    "summary": "A report’s covers and appendices have inconsistent printed labels.",
    "intent": "Practical example",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Page numbers",
      "Practical example"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Choose the starting number for the sequence.",
      "Export and check that numbering does not cover source text."
    ],
    "check": "Workspace page positions can differ from printed page numbers. Check the exported sequence.",
    "limit": "Workspace page positions can differ from printed page numbers. Check the exported sequence.",
    "sections": [
      {
        "heading": "The document and the intended outcome",
        "paragraphs": [
          "A report’s covers and appendices have inconsistent printed labels. Assemble the final page order first, then add a new sequence in a clear bottom margin."
        ]
      },
      {
        "heading": "Make this example work for your file",
        "paragraphs": [
          "For an appendix, decide whether numbering starts at the cover or at the first content page. Check the final displayed number and the selected position so the sequence matches the intended reading order."
        ]
      },
      {
        "heading": "Choose only the settings this case needs",
        "paragraphs": [
          "Choose Starting number, Number format, Position and inset margin. Use the page range when only a section should receive labels; inspect the first and final numbered pages."
        ]
      },
      {
        "heading": "When the example needs a different approach",
        "paragraphs": [
          "Check Starting number and the selected range. Printed numbering in the source is independent of the newly added sequence."
        ]
      }
    ],
    "tips": [
      "Choose Starting number, Number format, Position and inset margin. Use the page range when only a section should receive labels; inspect the first and final numbered pages.",
      "Move their position or increase the inset carefully. Compare a page with a long footer, not only a blank cover.",
      "Check Starting number and the selected range. Printed numbering in the source is independent of the newly added sequence."
    ],
    "faq": [
      {
        "question": "Numbers overlap a footer?",
        "answer": "Move their position or increase the inset carefully. Compare a page with a long footer, not only a blank cover."
      },
      {
        "question": "The added sequence starts at the wrong value?",
        "answer": "Check Starting number and the selected range. Printed numbering in the source is independent of the newly added sequence."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Add consistent page references to a report."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Workspace page positions can differ from printed page numbers. Check the exported sequence."
      }
    ],
    "hero": {
      "input": "Unlabelled pages",
      "output": "Numbered pages"
    },
    "cta": "Open Page numbers →",
    "evidence": {
      "id": "numbers",
      "input": "/examples/verified-tools/numbers-input.pdf",
      "output": "/examples/verified-tools/numbers-result.pdf",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "Requested label is present in extracted output text.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      },
      "preview": {
        "input": "/examples/verified-tools/numbers-input.png",
        "output": "/examples/verified-tools/numbers-result.png"
      }
    }
  },
  {
    "slug": "page-numbers-common-problems-and-how-to-fix-them",
    "title": "Page numbers: common problems and how to fix them",
    "category": "Edit & sign",
    "tool": "add-page-numbers",
    "toolId": "numbers",
    "toolNumber": 33,
    "summary": "Resolve numbers overlap a footer and the added sequence starts at the wrong value. Understand the limits before retrying.",
    "intent": "Troubleshooting",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Page numbers",
      "Troubleshooting"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Choose the starting number for the sequence.",
      "Export and check that numbering does not cover source text."
    ],
    "check": "Workspace page positions can differ from printed page numbers. Check the exported sequence.",
    "limit": "Workspace page positions can differ from printed page numbers. Check the exported sequence.",
    "sections": [
      {
        "heading": "Numbers overlap a footer",
        "paragraphs": [
          "Move their position or increase the inset carefully. Compare a page with a long footer, not only a blank cover."
        ]
      },
      {
        "heading": "The added sequence starts at the wrong value",
        "paragraphs": [
          "Check Starting number and the selected range. Printed numbering in the source is independent of the newly added sequence."
        ]
      },
      {
        "heading": "Check whether this is the right operation",
        "paragraphs": [
          "Added page numbers are visible labels on the exported pages. They do not rewrite old printed labels or change the document’s physical positions."
        ]
      },
      {
        "heading": "A more useful retry",
        "paragraphs": [
          "For an appendix, decide whether numbering starts at the cover or at the first content page. Check the final displayed number and the selected position so the sequence matches the intended reading order."
        ]
      }
    ],
    "tips": [
      "Choose Starting number, Number format, Position and inset margin. Use the page range when only a section should receive labels; inspect the first and final numbered pages.",
      "Move their position or increase the inset carefully. Compare a page with a long footer, not only a blank cover.",
      "Check Starting number and the selected range. Printed numbering in the source is independent of the newly added sequence."
    ],
    "faq": [
      {
        "question": "Numbers overlap a footer?",
        "answer": "Move their position or increase the inset carefully. Compare a page with a long footer, not only a blank cover."
      },
      {
        "question": "The added sequence starts at the wrong value?",
        "answer": "Check Starting number and the selected range. Printed numbering in the source is independent of the newly added sequence."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Add consistent page references to a report."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Workspace page positions can differ from printed page numbers. Check the exported sequence."
      }
    ],
    "hero": {
      "input": "Unlabelled pages",
      "output": "Numbered pages"
    },
    "cta": "Open Page numbers →",
    "evidence": {
      "id": "numbers",
      "input": "/examples/verified-tools/numbers-input.pdf",
      "output": "/examples/verified-tools/numbers-result.pdf",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "Requested label is present in extracted output text.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      },
      "preview": {
        "input": "/examples/verified-tools/numbers-input.png",
        "output": "/examples/verified-tools/numbers-result.png"
      }
    }
  },
  {
    "slug": "create-stable-review-ids-for-a-document-pack",
    "title": "Create stable review IDs for a document pack",
    "category": "Edit & sign",
    "tool": "bates-numbering",
    "toolId": "bates",
    "toolNumber": 34,
    "summary": "A reviewer wants labels such as CASE-000101 through CASE-000106.",
    "intent": "Practical example",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Bates numbering",
      "Practical example"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Enter the prefix and starting number for your identifiers.",
      "Export and check the first and last identifiers."
    ],
    "check": "These are visual identifiers, not proof of authenticity. Check the labeling requirements of the recipient.",
    "limit": "These are visual identifiers, not proof of authenticity. Check the labeling requirements of the recipient.",
    "sections": [
      {
        "heading": "The document and the intended outcome",
        "paragraphs": [
          "A reviewer wants labels such as CASE-000101 through CASE-000106. Set prefix, starting value and digit count, then compare the first and last identifiers after export."
        ]
      },
      {
        "heading": "Make this example work for your file",
        "paragraphs": [
          "For a review bundle, choose a prefix that identifies the matter and a start value that follows previous batches. Record the first and last identifiers. Duplicating a labelled file later can create repeated identifiers."
        ]
      },
      {
        "heading": "Choose only the settings this case needs",
        "paragraphs": [
          "Set Prefix, Suffix, Number of digits and Starting number. Keep a register of the intended range so later batches do not reuse identifiers accidentally."
        ]
      },
      {
        "heading": "When the example needs a different approach",
        "paragraphs": [
          "Reduce font size, shorten the prefix or use a clearer margin position. Check the longest identifier in the batch."
        ]
      }
    ],
    "tips": [
      "Set Prefix, Suffix, Number of digits and Starting number. Keep a register of the intended range so later batches do not reuse identifiers accidentally.",
      "Choose the next starting value or a distinct prefix before exporting the next pack. The tool does not maintain a central case-wide numbering register.",
      "Reduce font size, shorten the prefix or use a clearer margin position. Check the longest identifier in the batch."
    ],
    "faq": [
      {
        "question": "Two packs share the same IDs?",
        "answer": "Choose the next starting value or a distinct prefix before exporting the next pack. The tool does not maintain a central case-wide numbering register."
      },
      {
        "question": "A label is clipped or too wide?",
        "answer": "Reduce font size, shorten the prefix or use a clearer margin position. Check the longest identifier in the batch."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Give pages sequential reference labels."
      },
      {
        "question": "What should I check in the result?",
        "answer": "These are visual identifiers, not proof of authenticity. Check the labeling requirements of the recipient."
      }
    ],
    "hero": {
      "input": "Review pages",
      "output": "CASE-000101…"
    },
    "cta": "Open Bates numbering →",
    "evidence": {
      "id": "bates",
      "input": "/examples/verified-tools/bates-input.pdf",
      "output": "/examples/verified-tools/bates-result.pdf",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "Requested label is present in extracted output text.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "CASE-",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      },
      "preview": {
        "input": "/examples/verified-tools/bates-input.png",
        "output": "/examples/verified-tools/bates-result.png"
      }
    }
  },
  {
    "slug": "bates-numbering-common-problems-and-how-to-fix-them",
    "title": "Bates numbering: common problems and how to fix them",
    "category": "Edit & sign",
    "tool": "bates-numbering",
    "toolId": "bates",
    "toolNumber": 34,
    "summary": "Resolve two packs share the same ids and a label is clipped or too wide. Understand the limits before retrying.",
    "intent": "Troubleshooting",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Bates numbering",
      "Troubleshooting"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Enter the prefix and starting number for your identifiers.",
      "Export and check the first and last identifiers."
    ],
    "check": "These are visual identifiers, not proof of authenticity. Check the labeling requirements of the recipient.",
    "limit": "These are visual identifiers, not proof of authenticity. Check the labeling requirements of the recipient.",
    "sections": [
      {
        "heading": "Two packs share the same IDs",
        "paragraphs": [
          "Choose the next starting value or a distinct prefix before exporting the next pack. The tool does not maintain a central case-wide numbering register."
        ]
      },
      {
        "heading": "A label is clipped or too wide",
        "paragraphs": [
          "Reduce font size, shorten the prefix or use a clearer margin position. Check the longest identifier in the batch."
        ]
      },
      {
        "heading": "Check whether this is the right operation",
        "paragraphs": [
          "Bates numbering creates a sequential visible identifier. Its consistency depends on final page order, prefix, suffix and starting number rather than a document title alone."
        ]
      },
      {
        "heading": "A more useful retry",
        "paragraphs": [
          "For a review bundle, choose a prefix that identifies the matter and a start value that follows previous batches. Record the first and last identifiers. Duplicating a labelled file later can create repeated identifiers."
        ]
      }
    ],
    "tips": [
      "Set Prefix, Suffix, Number of digits and Starting number. Keep a register of the intended range so later batches do not reuse identifiers accidentally.",
      "Choose the next starting value or a distinct prefix before exporting the next pack. The tool does not maintain a central case-wide numbering register.",
      "Reduce font size, shorten the prefix or use a clearer margin position. Check the longest identifier in the batch."
    ],
    "faq": [
      {
        "question": "Two packs share the same IDs?",
        "answer": "Choose the next starting value or a distinct prefix before exporting the next pack. The tool does not maintain a central case-wide numbering register."
      },
      {
        "question": "A label is clipped or too wide?",
        "answer": "Reduce font size, shorten the prefix or use a clearer margin position. Check the longest identifier in the batch."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Give pages sequential reference labels."
      },
      {
        "question": "What should I check in the result?",
        "answer": "These are visual identifiers, not proof of authenticity. Check the labeling requirements of the recipient."
      }
    ],
    "hero": {
      "input": "Review pages",
      "output": "CASE-000101…"
    },
    "cta": "Open Bates numbering →",
    "evidence": {
      "id": "bates",
      "input": "/examples/verified-tools/bates-input.pdf",
      "output": "/examples/verified-tools/bates-result.pdf",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "Requested label is present in extracted output text.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "CASE-",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      },
      "preview": {
        "input": "/examples/verified-tools/bates-input.png",
        "output": "/examples/verified-tools/bates-result.png"
      }
    }
  },
  {
    "slug": "how-to-add-pdf-headers-and-footers",
    "title": "How to add PDF headers and footers",
    "category": "Edit & sign",
    "tool": "headers-and-footers",
    "toolId": "headers",
    "toolNumber": 35,
    "summary": "Add a label to every page. Learn the available controls, a practical example and what to check.",
    "intent": "How-to",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Headers & footers",
      "How-to"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Enter the header or footer label in the available controls.",
      "Export and inspect margins on every page orientation."
    ],
    "check": "Labels may overlap content near page edges. Reopen the output before sharing.",
    "limit": "Labels may overlap content near page edges. Reopen the output before sharing.",
    "sections": [
      {
        "heading": "What this tool actually does",
        "paragraphs": [
          "Headers and footers add new text to the page. Dynamic placeholders use current PDF positions and totals; they do not infer chapter numbers printed in the source."
        ]
      },
      {
        "heading": "Choose the controls for your document",
        "paragraphs": [
          "Use left, centre or right slots and the supported {page}, {total} and {date} tokens. Keep font size and inset suitable for the source margins."
        ]
      },
      {
        "heading": "Before your first export",
        "paragraphs": [
          "For a committee pack, use short running labels and leave space around the body text. Compare the longest header with the narrowest page; one clean page is not enough to prove the whole pack fits."
        ]
      },
      {
        "heading": "A placeholder prints literally",
        "paragraphs": [
          "Check the exact supported token spelling and braces. Unsupported placeholders are not a template language."
        ]
      }
    ],
    "tips": [
      "Use left, centre or right slots and the supported {page}, {total} and {date} tokens. Keep font size and inset suitable for the source margins.",
      "Check the exact supported token spelling and braces. Unsupported placeholders are not a template language.",
      "Increase usable margins or move the label to another slot. Adding a footer does not automatically reflow the original page away from it."
    ],
    "faq": [
      {
        "question": "A placeholder prints literally?",
        "answer": "Check the exact supported token spelling and braces. Unsupported placeholders are not a template language."
      },
      {
        "question": "The new label overlaps content?",
        "answer": "Increase usable margins or move the label to another slot. Adding a footer does not automatically reflow the original page away from it."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Label a document with a repeating title or reference."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Labels may overlap content near page edges. Reopen the output before sharing."
      }
    ],
    "hero": {
      "input": "Original pages",
      "output": "Header and footer"
    },
    "cta": "Open Headers & footers →",
    "evidence": {
      "id": "headers",
      "input": "/examples/verified-tools/headers-input.pdf",
      "output": "/examples/verified-tools/headers-result.pdf",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "Requested label is present in extracted output text.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "Review copy",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      },
      "preview": {
        "input": "/examples/verified-tools/headers-input.png",
        "output": "/examples/verified-tools/headers-result.png"
      }
    }
  },
  {
    "slug": "add-a-document-label-and-page-aware-footer",
    "title": "Add a document label and page-aware footer",
    "category": "Edit & sign",
    "tool": "headers-and-footers",
    "toolId": "headers",
    "toolNumber": 35,
    "summary": "A team wants a project name above each page and Page {page} of {total} below it.",
    "intent": "Practical example",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Headers & footers",
      "Practical example"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Enter the header or footer label in the available controls.",
      "Export and inspect margins on every page orientation."
    ],
    "check": "Labels may overlap content near page edges. Reopen the output before sharing.",
    "limit": "Labels may overlap content near page edges. Reopen the output before sharing.",
    "sections": [
      {
        "heading": "The document and the intended outcome",
        "paragraphs": [
          "A team wants a project name above each page and Page {page} of {total} below it. Configure the header and footer slots, then inspect the longest label on a dense page."
        ]
      },
      {
        "heading": "Make this example work for your file",
        "paragraphs": [
          "For a committee pack, use short running labels and leave space around the body text. Compare the longest header with the narrowest page; one clean page is not enough to prove the whole pack fits."
        ]
      },
      {
        "heading": "Choose only the settings this case needs",
        "paragraphs": [
          "Use left, centre or right slots and the supported {page}, {total} and {date} tokens. Keep font size and inset suitable for the source margins."
        ]
      },
      {
        "heading": "When the example needs a different approach",
        "paragraphs": [
          "Increase usable margins or move the label to another slot. Adding a footer does not automatically reflow the original page away from it."
        ]
      }
    ],
    "tips": [
      "Use left, centre or right slots and the supported {page}, {total} and {date} tokens. Keep font size and inset suitable for the source margins.",
      "Check the exact supported token spelling and braces. Unsupported placeholders are not a template language.",
      "Increase usable margins or move the label to another slot. Adding a footer does not automatically reflow the original page away from it."
    ],
    "faq": [
      {
        "question": "A placeholder prints literally?",
        "answer": "Check the exact supported token spelling and braces. Unsupported placeholders are not a template language."
      },
      {
        "question": "The new label overlaps content?",
        "answer": "Increase usable margins or move the label to another slot. Adding a footer does not automatically reflow the original page away from it."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Label a document with a repeating title or reference."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Labels may overlap content near page edges. Reopen the output before sharing."
      }
    ],
    "hero": {
      "input": "Original pages",
      "output": "Header and footer"
    },
    "cta": "Open Headers & footers →",
    "evidence": {
      "id": "headers",
      "input": "/examples/verified-tools/headers-input.pdf",
      "output": "/examples/verified-tools/headers-result.pdf",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "Requested label is present in extracted output text.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "Review copy",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      },
      "preview": {
        "input": "/examples/verified-tools/headers-input.png",
        "output": "/examples/verified-tools/headers-result.png"
      }
    }
  },
  {
    "slug": "headers-footers-common-problems-and-how-to-fix-them",
    "title": "Headers & footers: common problems and how to fix them",
    "category": "Edit & sign",
    "tool": "headers-and-footers",
    "toolId": "headers",
    "toolNumber": 35,
    "summary": "Resolve a placeholder prints literally and the new label overlaps content. Understand the limits before retrying.",
    "intent": "Troubleshooting",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Headers & footers",
      "Troubleshooting"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Enter the header or footer label in the available controls.",
      "Export and inspect margins on every page orientation."
    ],
    "check": "Labels may overlap content near page edges. Reopen the output before sharing.",
    "limit": "Labels may overlap content near page edges. Reopen the output before sharing.",
    "sections": [
      {
        "heading": "A placeholder prints literally",
        "paragraphs": [
          "Check the exact supported token spelling and braces. Unsupported placeholders are not a template language."
        ]
      },
      {
        "heading": "The new label overlaps content",
        "paragraphs": [
          "Increase usable margins or move the label to another slot. Adding a footer does not automatically reflow the original page away from it."
        ]
      },
      {
        "heading": "Check whether this is the right operation",
        "paragraphs": [
          "Headers and footers add new text to the page. Dynamic placeholders use current PDF positions and totals; they do not infer chapter numbers printed in the source."
        ]
      },
      {
        "heading": "A more useful retry",
        "paragraphs": [
          "For a committee pack, use short running labels and leave space around the body text. Compare the longest header with the narrowest page; one clean page is not enough to prove the whole pack fits."
        ]
      }
    ],
    "tips": [
      "Use left, centre or right slots and the supported {page}, {total} and {date} tokens. Keep font size and inset suitable for the source margins.",
      "Check the exact supported token spelling and braces. Unsupported placeholders are not a template language.",
      "Increase usable margins or move the label to another slot. Adding a footer does not automatically reflow the original page away from it."
    ],
    "faq": [
      {
        "question": "A placeholder prints literally?",
        "answer": "Check the exact supported token spelling and braces. Unsupported placeholders are not a template language."
      },
      {
        "question": "The new label overlaps content?",
        "answer": "Increase usable margins or move the label to another slot. Adding a footer does not automatically reflow the original page away from it."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Label a document with a repeating title or reference."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Labels may overlap content near page edges. Reopen the output before sharing."
      }
    ],
    "hero": {
      "input": "Original pages",
      "output": "Header and footer"
    },
    "cta": "Open Headers & footers →",
    "evidence": {
      "id": "headers",
      "input": "/examples/verified-tools/headers-input.pdf",
      "output": "/examples/verified-tools/headers-result.pdf",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "Requested label is present in extracted output text.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "Review copy",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      },
      "preview": {
        "input": "/examples/verified-tools/headers-input.png",
        "output": "/examples/verified-tools/headers-result.png"
      }
    }
  },
  {
    "slug": "how-to-flatten-completed-pdf-form-fields",
    "title": "How to flatten completed PDF form fields",
    "category": "Edit & sign",
    "tool": "flatten-pdf",
    "toolId": "flatten",
    "toolNumber": 36,
    "summary": "Bake pages into a static document. Learn the available controls, a practical example and what to check.",
    "intent": "How-to",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Flatten PDF",
      "How-to"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Review whether you still need selectable text, links or interactive forms.",
      "Choose form-field mode to retain text, or image mode to flatten the entire appearance."
    ],
    "check": "Form-field mode preserves selectable text and makes form fields read-only. Image mode removes searchable text, links and editable forms, and may enlarge the file.",
    "limit": "Rebuilds pages as images. Text is no longer selectable; links and forms are removed.",
    "sections": [
      {
        "heading": "What this tool actually does",
        "paragraphs": [
          "The current tool distinguishes making form fields read-only from rebuilding the entire visible page as an image. Those choices preserve different features."
        ]
      },
      {
        "heading": "Choose the controls for your document",
        "paragraphs": [
          "For form mode, inspect saved field appearances and selectable body text. For image mode, expect loss of text selection, links and editable fields, and inspect every page."
        ]
      },
      {
        "heading": "Before your first export",
        "paragraphs": [
          "For a completed form, check every visible answer before flattening. Keep the editable original separately. A read-only reading copy is useful for sharing, but it prevents the recipient from correcting fields in the normal form interface."
        ]
      },
      {
        "heading": "A comment remains after form flattening",
        "paragraphs": [
          "Form flattening targets fields, not every annotation. Use the appropriate annotation cleanup or whole-page mode only when that is the intended result."
        ]
      }
    ],
    "tips": [
      "For form mode, inspect saved field appearances and selectable body text. For image mode, expect loss of text selection, links and editable fields, and inspect every page.",
      "Form flattening targets fields, not every annotation. Use the appropriate annotation cleanup or whole-page mode only when that is the intended result.",
      "Preserve the original and review the form in its original editor. Unsupported or overlapping field appearances may require a different safe flattening path."
    ],
    "faq": [
      {
        "question": "A comment remains after form flattening?",
        "answer": "Form flattening targets fields, not every annotation. Use the appropriate annotation cleanup or whole-page mode only when that is the intended result."
      },
      {
        "question": "A filled value disappears?",
        "answer": "Preserve the original and review the form in its original editor. Unsupported or overlapping field appearances may require a different safe flattening path."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Make filled form fields read-only or create static image pages."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Form-field mode preserves selectable text and makes form fields read-only. Image mode removes searchable text, links and editable forms, and may enlarge the file."
      }
    ],
    "hero": {
      "input": "Interactive fields",
      "output": "Static appearance"
    },
    "cta": "Open Flatten PDF →",
    "evidence": {
      "id": "flatten",
      "input": "/examples/verified-tools/flatten-input.pdf",
      "output": "/examples/verified-tools/flatten-result.pdf",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "Field values remain as text; editable fields are absent.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      },
      "preview": {
        "input": "/examples/verified-tools/flatten-input.png",
        "output": "/examples/verified-tools/flatten-result.png"
      }
    }
  },
  {
    "slug": "make-completed-form-values-static-without-choosing-unnecessary-image-loss",
    "title": "Make completed form values static without choosing unnecessary image loss",
    "category": "Edit & sign",
    "tool": "flatten-pdf",
    "toolId": "flatten",
    "toolNumber": 36,
    "summary": "A completed form should be a reading copy that cannot be edited as form fields.",
    "intent": "Practical example",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Flatten PDF",
      "Practical example"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Review whether you still need selectable text, links or interactive forms.",
      "Choose form-field mode to retain text, or image mode to flatten the entire appearance."
    ],
    "check": "Form-field mode preserves selectable text and makes form fields read-only. Image mode removes searchable text, links and editable forms, and may enlarge the file.",
    "limit": "Rebuilds pages as images. Text is no longer selectable; links and forms are removed.",
    "sections": [
      {
        "heading": "The document and the intended outcome",
        "paragraphs": [
          "A completed form should be a reading copy that cannot be edited as form fields. Use form flattening when suitable; choose whole-page image mode only when its losses are acceptable."
        ]
      },
      {
        "heading": "Make this example work for your file",
        "paragraphs": [
          "For a completed form, check every visible answer before flattening. Keep the editable original separately. A read-only reading copy is useful for sharing, but it prevents the recipient from correcting fields in the normal form interface."
        ]
      },
      {
        "heading": "Choose only the settings this case needs",
        "paragraphs": [
          "For form mode, inspect saved field appearances and selectable body text. For image mode, expect loss of text selection, links and editable fields, and inspect every page."
        ]
      },
      {
        "heading": "When the example needs a different approach",
        "paragraphs": [
          "Preserve the original and review the form in its original editor. Unsupported or overlapping field appearances may require a different safe flattening path."
        ]
      }
    ],
    "tips": [
      "For form mode, inspect saved field appearances and selectable body text. For image mode, expect loss of text selection, links and editable fields, and inspect every page.",
      "Form flattening targets fields, not every annotation. Use the appropriate annotation cleanup or whole-page mode only when that is the intended result.",
      "Preserve the original and review the form in its original editor. Unsupported or overlapping field appearances may require a different safe flattening path."
    ],
    "faq": [
      {
        "question": "A comment remains after form flattening?",
        "answer": "Form flattening targets fields, not every annotation. Use the appropriate annotation cleanup or whole-page mode only when that is the intended result."
      },
      {
        "question": "A filled value disappears?",
        "answer": "Preserve the original and review the form in its original editor. Unsupported or overlapping field appearances may require a different safe flattening path."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Make filled form fields read-only or create static image pages."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Form-field mode preserves selectable text and makes form fields read-only. Image mode removes searchable text, links and editable forms, and may enlarge the file."
      }
    ],
    "hero": {
      "input": "Interactive fields",
      "output": "Static appearance"
    },
    "cta": "Open Flatten PDF →",
    "evidence": {
      "id": "flatten",
      "input": "/examples/verified-tools/flatten-input.pdf",
      "output": "/examples/verified-tools/flatten-result.pdf",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "Field values remain as text; editable fields are absent.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      },
      "preview": {
        "input": "/examples/verified-tools/flatten-input.png",
        "output": "/examples/verified-tools/flatten-result.png"
      }
    }
  },
  {
    "slug": "flatten-pdf-common-problems-and-how-to-fix-them",
    "title": "Flatten PDF: common problems and how to fix them",
    "category": "Edit & sign",
    "tool": "flatten-pdf",
    "toolId": "flatten",
    "toolNumber": 36,
    "summary": "Resolve a comment remains after form flattening and a filled value disappears. Understand the limits before retrying.",
    "intent": "Troubleshooting",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Flatten PDF",
      "Troubleshooting"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Review whether you still need selectable text, links or interactive forms.",
      "Choose form-field mode to retain text, or image mode to flatten the entire appearance."
    ],
    "check": "Form-field mode preserves selectable text and makes form fields read-only. Image mode removes searchable text, links and editable forms, and may enlarge the file.",
    "limit": "Rebuilds pages as images. Text is no longer selectable; links and forms are removed.",
    "sections": [
      {
        "heading": "A comment remains after form flattening",
        "paragraphs": [
          "Form flattening targets fields, not every annotation. Use the appropriate annotation cleanup or whole-page mode only when that is the intended result."
        ]
      },
      {
        "heading": "A filled value disappears",
        "paragraphs": [
          "Preserve the original and review the form in its original editor. Unsupported or overlapping field appearances may require a different safe flattening path."
        ]
      },
      {
        "heading": "Check whether this is the right operation",
        "paragraphs": [
          "The current tool distinguishes making form fields read-only from rebuilding the entire visible page as an image. Those choices preserve different features."
        ]
      },
      {
        "heading": "A more useful retry",
        "paragraphs": [
          "For a completed form, check every visible answer before flattening. Keep the editable original separately. A read-only reading copy is useful for sharing, but it prevents the recipient from correcting fields in the normal form interface."
        ]
      }
    ],
    "tips": [
      "For form mode, inspect saved field appearances and selectable body text. For image mode, expect loss of text selection, links and editable fields, and inspect every page.",
      "Form flattening targets fields, not every annotation. Use the appropriate annotation cleanup or whole-page mode only when that is the intended result.",
      "Preserve the original and review the form in its original editor. Unsupported or overlapping field appearances may require a different safe flattening path."
    ],
    "faq": [
      {
        "question": "A comment remains after form flattening?",
        "answer": "Form flattening targets fields, not every annotation. Use the appropriate annotation cleanup or whole-page mode only when that is the intended result."
      },
      {
        "question": "A filled value disappears?",
        "answer": "Preserve the original and review the form in its original editor. Unsupported or overlapping field appearances may require a different safe flattening path."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Make filled form fields read-only or create static image pages."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Form-field mode preserves selectable text and makes form fields read-only. Image mode removes searchable text, links and editable forms, and may enlarge the file."
      }
    ],
    "hero": {
      "input": "Interactive fields",
      "output": "Static appearance"
    },
    "cta": "Open Flatten PDF →",
    "evidence": {
      "id": "flatten",
      "input": "/examples/verified-tools/flatten-input.pdf",
      "output": "/examples/verified-tools/flatten-result.pdf",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "Field values remain as text; editable fields are absent.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      },
      "preview": {
        "input": "/examples/verified-tools/flatten-input.png",
        "output": "/examples/verified-tools/flatten-result.png"
      }
    }
  },
  {
    "slug": "how-to-fill-pdf-form-fields",
    "title": "How to fill PDF form fields",
    "category": "Edit & sign",
    "tool": "fill-pdf-forms",
    "toolId": "form",
    "toolNumber": 37,
    "summary": "Complete existing fillable fields. Learn the available controls, a practical example and what to check.",
    "intent": "How-to",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Fill PDF forms",
      "How-to"
    ],
    "steps": [
      "Open the original PDF containing fillable fields.",
      "Complete supported text fields, checkboxes and dropdowns. Review all fields before export.",
      "Choose an editable or flattened output, then reopen it and confirm the saved values."
    ],
    "check": "Unsupported form types may not work. Flattening makes the completed values static, so keep an editable copy if you will need to revise them.",
    "limit": "Supports text, checkbox and dropdown fields. Choose editable fields or flatten the completed form.",
    "sections": [
      {
        "heading": "What this tool actually does",
        "paragraphs": [
          "Interactive fields are objects in the PDF. A scanned or static form that only looks like boxes has no field controls for this tool to fill."
        ]
      },
      {
        "heading": "Choose the controls for your document",
        "paragraphs": [
          "Start with the original form and check supported field types. Save an editable copy before flattening if you expect to revise a value later."
        ]
      },
      {
        "heading": "Before your first export",
        "paragraphs": [
          "For a registration form, fill a short test with deliberately long values. Save and reopen it in the intended reader. Pay special attention to checkboxes and multiline fields rather than checking only the first text box."
        ]
      },
      {
        "heading": "No fillable fields are detected",
        "paragraphs": [
          "The source may be a scan or static artwork. Use Add text for a visual fill-in, or obtain a genuine interactive version from the issuer."
        ]
      }
    ],
    "tips": [
      "Start with the original form and check supported field types. Save an editable copy before flattening if you expect to revise a value later.",
      "The source may be a scan or static artwork. Use Add text for a visual fill-in, or obtain a genuine interactive version from the issuer.",
      "Reopen the downloaded PDF and check both visible appearance and field value. Some readers cache form appearances; verify using the actual exported copy."
    ],
    "faq": [
      {
        "question": "No fillable fields are detected?",
        "answer": "The source may be a scan or static artwork. Use Add text for a visual fill-in, or obtain a genuine interactive version from the issuer."
      },
      {
        "question": "The value looks correct but is not saved?",
        "answer": "Reopen the downloaded PDF and check both visible appearance and field value. Some readers cache form appearances; verify using the actual exported copy."
      },
      {
        "question": "Why are there no fields?",
        "answer": "The PDF may be a scan or a static form without interactive fields."
      },
      {
        "question": "What does flatten mean?",
        "answer": "Flattening makes field values part of the page appearance rather than editable form controls."
      }
    ],
    "hero": {
      "input": "Existing form",
      "output": "Completed fields"
    },
    "cta": "Open Fill PDF forms →",
    "evidence": {
      "id": "form",
      "input": "/examples/verified-tools/form-input.pdf",
      "output": "/examples/verified-tools/form-result.pdf",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "Name field contains Alex after reopening.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {
          "Name": "Alex"
        }
      },
      "preview": {
        "input": "/examples/verified-tools/form-input.png",
        "output": "/examples/verified-tools/form-result.png"
      }
    }
  },
  {
    "slug": "complete-an-interactive-application-form-and-keep-a-revisable-copy",
    "title": "Complete an interactive application form and keep a revisable copy",
    "category": "Edit & sign",
    "tool": "fill-pdf-forms",
    "toolId": "form",
    "toolNumber": 37,
    "summary": "An application PDF contains text fields, a checkbox and a dropdown.",
    "intent": "Practical example",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Fill PDF forms",
      "Practical example"
    ],
    "steps": [
      "Open the original PDF containing fillable fields.",
      "Complete supported text fields, checkboxes and dropdowns. Review all fields before export.",
      "Choose an editable or flattened output, then reopen it and confirm the saved values."
    ],
    "check": "Unsupported form types may not work. Flattening makes the completed values static, so keep an editable copy if you will need to revise them.",
    "limit": "Supports text, checkbox and dropdown fields. Choose editable fields or flatten the completed form.",
    "sections": [
      {
        "heading": "The document and the intended outcome",
        "paragraphs": [
          "An application PDF contains text fields, a checkbox and a dropdown. Fill the supported controls, review all values, then choose editable or flattened output according to the recipient."
        ]
      },
      {
        "heading": "Make this example work for your file",
        "paragraphs": [
          "For a registration form, fill a short test with deliberately long values. Save and reopen it in the intended reader. Pay special attention to checkboxes and multiline fields rather than checking only the first text box."
        ]
      },
      {
        "heading": "Choose only the settings this case needs",
        "paragraphs": [
          "Start with the original form and check supported field types. Save an editable copy before flattening if you expect to revise a value later."
        ]
      },
      {
        "heading": "When the example needs a different approach",
        "paragraphs": [
          "Reopen the downloaded PDF and check both visible appearance and field value. Some readers cache form appearances; verify using the actual exported copy."
        ]
      }
    ],
    "tips": [
      "Start with the original form and check supported field types. Save an editable copy before flattening if you expect to revise a value later.",
      "The source may be a scan or static artwork. Use Add text for a visual fill-in, or obtain a genuine interactive version from the issuer.",
      "Reopen the downloaded PDF and check both visible appearance and field value. Some readers cache form appearances; verify using the actual exported copy."
    ],
    "faq": [
      {
        "question": "No fillable fields are detected?",
        "answer": "The source may be a scan or static artwork. Use Add text for a visual fill-in, or obtain a genuine interactive version from the issuer."
      },
      {
        "question": "The value looks correct but is not saved?",
        "answer": "Reopen the downloaded PDF and check both visible appearance and field value. Some readers cache form appearances; verify using the actual exported copy."
      },
      {
        "question": "Why are there no fields?",
        "answer": "The PDF may be a scan or a static form without interactive fields."
      },
      {
        "question": "What does flatten mean?",
        "answer": "Flattening makes field values part of the page appearance rather than editable form controls."
      }
    ],
    "hero": {
      "input": "Existing form",
      "output": "Completed fields"
    },
    "cta": "Open Fill PDF forms →",
    "evidence": {
      "id": "form",
      "input": "/examples/verified-tools/form-input.pdf",
      "output": "/examples/verified-tools/form-result.pdf",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "Name field contains Alex after reopening.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {
          "Name": "Alex"
        }
      },
      "preview": {
        "input": "/examples/verified-tools/form-input.png",
        "output": "/examples/verified-tools/form-result.png"
      }
    }
  },
  {
    "slug": "fill-pdf-forms-common-problems-and-how-to-fix-them",
    "title": "Fill PDF forms: common problems and how to fix them",
    "category": "Edit & sign",
    "tool": "fill-pdf-forms",
    "toolId": "form",
    "toolNumber": 37,
    "summary": "Resolve no fillable fields are detected and the value looks correct but is not saved. Understand the limits before retrying.",
    "intent": "Troubleshooting",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Fill PDF forms",
      "Troubleshooting"
    ],
    "steps": [
      "Open the original PDF containing fillable fields.",
      "Complete supported text fields, checkboxes and dropdowns. Review all fields before export.",
      "Choose an editable or flattened output, then reopen it and confirm the saved values."
    ],
    "check": "Unsupported form types may not work. Flattening makes the completed values static, so keep an editable copy if you will need to revise them.",
    "limit": "Supports text, checkbox and dropdown fields. Choose editable fields or flatten the completed form.",
    "sections": [
      {
        "heading": "No fillable fields are detected",
        "paragraphs": [
          "The source may be a scan or static artwork. Use Add text for a visual fill-in, or obtain a genuine interactive version from the issuer."
        ]
      },
      {
        "heading": "The value looks correct but is not saved",
        "paragraphs": [
          "Reopen the downloaded PDF and check both visible appearance and field value. Some readers cache form appearances; verify using the actual exported copy."
        ]
      },
      {
        "heading": "Check whether this is the right operation",
        "paragraphs": [
          "Interactive fields are objects in the PDF. A scanned or static form that only looks like boxes has no field controls for this tool to fill."
        ]
      },
      {
        "heading": "A more useful retry",
        "paragraphs": [
          "For a registration form, fill a short test with deliberately long values. Save and reopen it in the intended reader. Pay special attention to checkboxes and multiline fields rather than checking only the first text box."
        ]
      }
    ],
    "tips": [
      "Start with the original form and check supported field types. Save an editable copy before flattening if you expect to revise a value later.",
      "The source may be a scan or static artwork. Use Add text for a visual fill-in, or obtain a genuine interactive version from the issuer.",
      "Reopen the downloaded PDF and check both visible appearance and field value. Some readers cache form appearances; verify using the actual exported copy."
    ],
    "faq": [
      {
        "question": "No fillable fields are detected?",
        "answer": "The source may be a scan or static artwork. Use Add text for a visual fill-in, or obtain a genuine interactive version from the issuer."
      },
      {
        "question": "The value looks correct but is not saved?",
        "answer": "Reopen the downloaded PDF and check both visible appearance and field value. Some readers cache form appearances; verify using the actual exported copy."
      },
      {
        "question": "Why are there no fields?",
        "answer": "The PDF may be a scan or a static form without interactive fields."
      },
      {
        "question": "What does flatten mean?",
        "answer": "Flattening makes field values part of the page appearance rather than editable form controls."
      }
    ],
    "hero": {
      "input": "Existing form",
      "output": "Completed fields"
    },
    "cta": "Open Fill PDF forms →",
    "evidence": {
      "id": "form",
      "input": "/examples/verified-tools/form-input.pdf",
      "output": "/examples/verified-tools/form-result.pdf",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "Name field contains Alex after reopening.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {
          "Name": "Alex"
        }
      },
      "preview": {
        "input": "/examples/verified-tools/form-input.png",
        "output": "/examples/verified-tools/form-result.png"
      }
    }
  },
  {
    "slug": "how-to-edit-pdf-document-properties",
    "title": "How to edit PDF document properties",
    "category": "Edit & sign",
    "tool": "edit-metadata",
    "toolId": "metadata",
    "toolNumber": 38,
    "summary": "Update title, author and subject. Learn the available controls, a practical example and what to check.",
    "intent": "How-to",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Edit metadata",
      "How-to"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Enter the title, author or subject you want in the document properties.",
      "Export and inspect properties in another reader."
    ],
    "check": "Metadata changes do not remove visible personal information. Use Remove metadata when you need those standard fields cleared.",
    "limit": "Metadata changes do not remove visible personal information. Use Remove metadata when you need those standard fields cleared.",
    "sections": [
      {
        "heading": "What this tool actually does",
        "paragraphs": [
          "Metadata is descriptive information separate from visible page text. Changing Author does not remove an author name printed on a cover or inside an attachment."
        ]
      },
      {
        "heading": "Choose the controls for your document",
        "paragraphs": [
          "Review Title, Author, Subject, Keywords, Creator and Producer. Leave a value empty deliberately when it should be cleared; do not add keyword lists unrelated to the document."
        ]
      },
      {
        "heading": "Before your first export",
        "paragraphs": [
          "For a distributed report, set a meaningful title and an appropriate author value. Check visible headers separately: document properties and text printed on a page are independent sources of identifying information."
        ]
      },
      {
        "heading": "The visible title does not change",
        "paragraphs": [
          "That title is page content. Use a supported text edit or create a revised source; metadata editing addresses reader properties."
        ]
      }
    ],
    "tips": [
      "Review Title, Author, Subject, Keywords, Creator and Producer. Leave a value empty deliberately when it should be cleared; do not add keyword lists unrelated to the document.",
      "That title is page content. Use a supported text edit or create a revised source; metadata editing addresses reader properties.",
      "Check page text, annotations, embedded files and other structures separately. A correct properties panel is not complete sanitization."
    ],
    "faq": [
      {
        "question": "The visible title does not change?",
        "answer": "That title is page content. Use a supported text edit or create a revised source; metadata editing addresses reader properties."
      },
      {
        "question": "Personal information remains elsewhere?",
        "answer": "Check page text, annotations, embedded files and other structures separately. A correct properties panel is not complete sanitization."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Correct standard document information."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Metadata changes do not remove visible personal information. Use Remove metadata when you need those standard fields cleared."
      }
    ],
    "hero": {
      "input": "Old properties",
      "output": "Updated properties"
    },
    "cta": "Open Edit metadata →",
    "evidence": {
      "id": "metadata",
      "input": "/examples/verified-tools/metadata-input.pdf",
      "output": "/examples/verified-tools/metadata-result.pdf",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "The requested title is stored.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "Review pack",
        "author": "Example author",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      },
      "preview": {
        "input": "/examples/verified-tools/metadata-input.png",
        "output": "/examples/verified-tools/metadata-result.png"
      }
    }
  },
  {
    "slug": "correct-document-properties-before-distribution",
    "title": "Correct document properties before distribution",
    "category": "Edit & sign",
    "tool": "edit-metadata",
    "toolId": "metadata",
    "toolNumber": 38,
    "summary": "A report still shows an old author and title in reader properties.",
    "intent": "Practical example",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Edit metadata",
      "Practical example"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Enter the title, author or subject you want in the document properties.",
      "Export and inspect properties in another reader."
    ],
    "check": "Metadata changes do not remove visible personal information. Use Remove metadata when you need those standard fields cleared.",
    "limit": "Metadata changes do not remove visible personal information. Use Remove metadata when you need those standard fields cleared.",
    "sections": [
      {
        "heading": "The document and the intended outcome",
        "paragraphs": [
          "A report still shows an old author and title in reader properties. Load its current values, update the intended fields and inspect the properties of the exported file."
        ]
      },
      {
        "heading": "Make this example work for your file",
        "paragraphs": [
          "For a distributed report, set a meaningful title and an appropriate author value. Check visible headers separately: document properties and text printed on a page are independent sources of identifying information."
        ]
      },
      {
        "heading": "Choose only the settings this case needs",
        "paragraphs": [
          "Review Title, Author, Subject, Keywords, Creator and Producer. Leave a value empty deliberately when it should be cleared; do not add keyword lists unrelated to the document."
        ]
      },
      {
        "heading": "When the example needs a different approach",
        "paragraphs": [
          "Check page text, annotations, embedded files and other structures separately. A correct properties panel is not complete sanitization."
        ]
      }
    ],
    "tips": [
      "Review Title, Author, Subject, Keywords, Creator and Producer. Leave a value empty deliberately when it should be cleared; do not add keyword lists unrelated to the document.",
      "That title is page content. Use a supported text edit or create a revised source; metadata editing addresses reader properties.",
      "Check page text, annotations, embedded files and other structures separately. A correct properties panel is not complete sanitization."
    ],
    "faq": [
      {
        "question": "The visible title does not change?",
        "answer": "That title is page content. Use a supported text edit or create a revised source; metadata editing addresses reader properties."
      },
      {
        "question": "Personal information remains elsewhere?",
        "answer": "Check page text, annotations, embedded files and other structures separately. A correct properties panel is not complete sanitization."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Correct standard document information."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Metadata changes do not remove visible personal information. Use Remove metadata when you need those standard fields cleared."
      }
    ],
    "hero": {
      "input": "Old properties",
      "output": "Updated properties"
    },
    "cta": "Open Edit metadata →",
    "evidence": {
      "id": "metadata",
      "input": "/examples/verified-tools/metadata-input.pdf",
      "output": "/examples/verified-tools/metadata-result.pdf",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "The requested title is stored.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "Review pack",
        "author": "Example author",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      },
      "preview": {
        "input": "/examples/verified-tools/metadata-input.png",
        "output": "/examples/verified-tools/metadata-result.png"
      }
    }
  },
  {
    "slug": "edit-metadata-common-problems-and-how-to-fix-them",
    "title": "Edit metadata: common problems and how to fix them",
    "category": "Edit & sign",
    "tool": "edit-metadata",
    "toolId": "metadata",
    "toolNumber": 38,
    "summary": "Resolve the visible title does not change and personal information remains elsewhere. Understand the limits before retrying.",
    "intent": "Troubleshooting",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Edit metadata",
      "Troubleshooting"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Enter the title, author or subject you want in the document properties.",
      "Export and inspect properties in another reader."
    ],
    "check": "Metadata changes do not remove visible personal information. Use Remove metadata when you need those standard fields cleared.",
    "limit": "Metadata changes do not remove visible personal information. Use Remove metadata when you need those standard fields cleared.",
    "sections": [
      {
        "heading": "The visible title does not change",
        "paragraphs": [
          "That title is page content. Use a supported text edit or create a revised source; metadata editing addresses reader properties."
        ]
      },
      {
        "heading": "Personal information remains elsewhere",
        "paragraphs": [
          "Check page text, annotations, embedded files and other structures separately. A correct properties panel is not complete sanitization."
        ]
      },
      {
        "heading": "Check whether this is the right operation",
        "paragraphs": [
          "Metadata is descriptive information separate from visible page text. Changing Author does not remove an author name printed on a cover or inside an attachment."
        ]
      },
      {
        "heading": "A more useful retry",
        "paragraphs": [
          "For a distributed report, set a meaningful title and an appropriate author value. Check visible headers separately: document properties and text printed on a page are independent sources of identifying information."
        ]
      }
    ],
    "tips": [
      "Review Title, Author, Subject, Keywords, Creator and Producer. Leave a value empty deliberately when it should be cleared; do not add keyword lists unrelated to the document.",
      "That title is page content. Use a supported text edit or create a revised source; metadata editing addresses reader properties.",
      "Check page text, annotations, embedded files and other structures separately. A correct properties panel is not complete sanitization."
    ],
    "faq": [
      {
        "question": "The visible title does not change?",
        "answer": "That title is page content. Use a supported text edit or create a revised source; metadata editing addresses reader properties."
      },
      {
        "question": "Personal information remains elsewhere?",
        "answer": "Check page text, annotations, embedded files and other structures separately. A correct properties panel is not complete sanitization."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Correct standard document information."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Metadata changes do not remove visible personal information. Use Remove metadata when you need those standard fields cleared."
      }
    ],
    "hero": {
      "input": "Old properties",
      "output": "Updated properties"
    },
    "cta": "Open Edit metadata →",
    "evidence": {
      "id": "metadata",
      "input": "/examples/verified-tools/metadata-input.pdf",
      "output": "/examples/verified-tools/metadata-result.pdf",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "The requested title is stored.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "Review pack",
        "author": "Example author",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      },
      "preview": {
        "input": "/examples/verified-tools/metadata-input.png",
        "output": "/examples/verified-tools/metadata-result.png"
      }
    }
  },
  {
    "slug": "how-to-make-a-pdf-from-camera-photos",
    "title": "How to make a PDF from camera photos",
    "category": "Convert",
    "tool": "scan-to-pdf",
    "toolId": "scan",
    "toolNumber": 39,
    "summary": "Photograph paper pages and save them as one PDF. Learn the available controls, a practical example and what to check.",
    "intent": "How-to",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Scan to PDF",
      "How-to"
    ],
    "steps": [
      "Open Scan to PDF on your phone and tap Take a photo. Hold the phone straight above the page, in good light, with the whole page in the frame.",
      "Take another photo for each page. Reorder or delete pages in the workspace; use Rotate if a photo came out sideways.",
      "Export the PDF, zoom in to check the smallest writing, then download it."
    ],
    "check": "Each photo becomes one page. Review manual crop, straightening or four-corner perspective correction before applying; automatic edge detection is not included. Text is not recognized; run Make a PDF searchable afterwards if you need selectable text. Large camera photos can make the PDF big; use Compress PDF if a portal has a size limit.",
    "limit": "Take a photo can open the camera on supported phones; other browsers show a file picker. Each photo becomes a page. Review manual crop, straightening or four-corner perspective correction before applying. Text is not recognized; run OCR afterwards.",
    "sections": [
      {
        "heading": "What this tool actually does",
        "paragraphs": [
          "Scan to PDF packages photographs as pages. Camera capture availability depends on the browser; recognition and searchable text require a separate OCR step."
        ]
      },
      {
        "heading": "Choose the controls for your document",
        "paragraphs": [
          "Avoid shadows, glare and fingers over the paper. Use manual crop, straightening or four-corner correction and apply the adjustment before reviewing the resulting page."
        ]
      },
      {
        "heading": "Before your first export",
        "paragraphs": [
          "For photographed receipts, include the whole receipt and avoid shadows over the totals. Check the original image before conversion; cropping and contrast cannot recover details outside the photo or unreadable glare."
        ]
      },
      {
        "heading": "The camera button opens a file picker",
        "paragraphs": [
          "That browser may not support direct capture. Choose existing photos or use the phone camera first; do not assume every device exposes the same capture flow."
        ]
      }
    ],
    "tips": [
      "Avoid shadows, glare and fingers over the paper. Use manual crop, straightening or four-corner correction and apply the adjustment before reviewing the resulting page.",
      "That browser may not support direct capture. Choose existing photos or use the phone camera first; do not assume every device exposes the same capture flow.",
      "Retake the photo with focus and parallel framing when possible. Perspective correction cannot recover detail that was never captured."
    ],
    "faq": [
      {
        "question": "The camera button opens a file picker?",
        "answer": "That browser may not support direct capture. Choose existing photos or use the phone camera first; do not assume every device exposes the same capture flow."
      },
      {
        "question": "The text is blurred or distorted?",
        "answer": "Retake the photo with focus and parallel framing when possible. Perspective correction cannot recover detail that was never captured."
      },
      {
        "question": "Can it straighten or crop the page automatically?",
        "answer": "Automatic correction is not included. Use Review crop and straighten for manual cropping, rotation or four-corner perspective correction; preview before applying."
      }
    ],
    "hero": {
      "input": "Paper photos",
      "output": "Scanned PDF"
    },
    "cta": "Open Scan to PDF →"
  },
  {
    "slug": "photograph-paper-pages-into-a-readable-pdf",
    "title": "Photograph paper pages into a readable PDF",
    "category": "Convert",
    "tool": "scan-to-pdf",
    "toolId": "scan",
    "toolNumber": 39,
    "summary": "Capture a receipt on a flat surface with even lighting, crop the paper edges, correct perspective if needed and arrange several photos before creating the PDF..",
    "intent": "Practical example",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Scan to PDF",
      "Practical example"
    ],
    "steps": [
      "Open Scan to PDF on your phone and tap Take a photo. Hold the phone straight above the page, in good light, with the whole page in the frame.",
      "Take another photo for each page. Reorder or delete pages in the workspace; use Rotate if a photo came out sideways.",
      "Export the PDF, zoom in to check the smallest writing, then download it."
    ],
    "check": "Each photo becomes one page. Review manual crop, straightening or four-corner perspective correction before applying; automatic edge detection is not included. Text is not recognized; run Make a PDF searchable afterwards if you need selectable text. Large camera photos can make the PDF big; use Compress PDF if a portal has a size limit.",
    "limit": "Take a photo can open the camera on supported phones; other browsers show a file picker. Each photo becomes a page. Review manual crop, straightening or four-corner perspective correction before applying. Text is not recognized; run OCR afterwards.",
    "sections": [
      {
        "heading": "The document and the intended outcome",
        "paragraphs": [
          "Capture a receipt on a flat surface with even lighting, crop the paper edges, correct perspective if needed and arrange several photos before creating the PDF."
        ]
      },
      {
        "heading": "Make this example work for your file",
        "paragraphs": [
          "For photographed receipts, include the whole receipt and avoid shadows over the totals. Check the original image before conversion; cropping and contrast cannot recover details outside the photo or unreadable glare."
        ]
      },
      {
        "heading": "Choose only the settings this case needs",
        "paragraphs": [
          "Avoid shadows, glare and fingers over the paper. Use manual crop, straightening or four-corner correction and apply the adjustment before reviewing the resulting page."
        ]
      },
      {
        "heading": "When the example needs a different approach",
        "paragraphs": [
          "Retake the photo with focus and parallel framing when possible. Perspective correction cannot recover detail that was never captured."
        ]
      }
    ],
    "tips": [
      "Avoid shadows, glare and fingers over the paper. Use manual crop, straightening or four-corner correction and apply the adjustment before reviewing the resulting page.",
      "That browser may not support direct capture. Choose existing photos or use the phone camera first; do not assume every device exposes the same capture flow.",
      "Retake the photo with focus and parallel framing when possible. Perspective correction cannot recover detail that was never captured."
    ],
    "faq": [
      {
        "question": "The camera button opens a file picker?",
        "answer": "That browser may not support direct capture. Choose existing photos or use the phone camera first; do not assume every device exposes the same capture flow."
      },
      {
        "question": "The text is blurred or distorted?",
        "answer": "Retake the photo with focus and parallel framing when possible. Perspective correction cannot recover detail that was never captured."
      },
      {
        "question": "Can it straighten or crop the page automatically?",
        "answer": "Automatic correction is not included. Use Review crop and straighten for manual cropping, rotation or four-corner perspective correction; preview before applying."
      }
    ],
    "hero": {
      "input": "Paper photos",
      "output": "Scanned PDF"
    },
    "cta": "Open Scan to PDF →"
  },
  {
    "slug": "scan-to-pdf-common-problems-and-how-to-fix-them",
    "title": "Scan to PDF: common problems and how to fix them",
    "category": "Convert",
    "tool": "scan-to-pdf",
    "toolId": "scan",
    "toolNumber": 39,
    "summary": "Resolve the camera button opens a file picker and the text is blurred or distorted. Understand the limits before retrying.",
    "intent": "Troubleshooting",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Scan to PDF",
      "Troubleshooting"
    ],
    "steps": [
      "Open Scan to PDF on your phone and tap Take a photo. Hold the phone straight above the page, in good light, with the whole page in the frame.",
      "Take another photo for each page. Reorder or delete pages in the workspace; use Rotate if a photo came out sideways.",
      "Export the PDF, zoom in to check the smallest writing, then download it."
    ],
    "check": "Each photo becomes one page. Review manual crop, straightening or four-corner perspective correction before applying; automatic edge detection is not included. Text is not recognized; run Make a PDF searchable afterwards if you need selectable text. Large camera photos can make the PDF big; use Compress PDF if a portal has a size limit.",
    "limit": "Take a photo can open the camera on supported phones; other browsers show a file picker. Each photo becomes a page. Review manual crop, straightening or four-corner perspective correction before applying. Text is not recognized; run OCR afterwards.",
    "sections": [
      {
        "heading": "The camera button opens a file picker",
        "paragraphs": [
          "That browser may not support direct capture. Choose existing photos or use the phone camera first; do not assume every device exposes the same capture flow."
        ]
      },
      {
        "heading": "The text is blurred or distorted",
        "paragraphs": [
          "Retake the photo with focus and parallel framing when possible. Perspective correction cannot recover detail that was never captured."
        ]
      },
      {
        "heading": "Check whether this is the right operation",
        "paragraphs": [
          "Scan to PDF packages photographs as pages. Camera capture availability depends on the browser; recognition and searchable text require a separate OCR step."
        ]
      },
      {
        "heading": "A more useful retry",
        "paragraphs": [
          "For photographed receipts, include the whole receipt and avoid shadows over the totals. Check the original image before conversion; cropping and contrast cannot recover details outside the photo or unreadable glare."
        ]
      }
    ],
    "tips": [
      "Avoid shadows, glare and fingers over the paper. Use manual crop, straightening or four-corner correction and apply the adjustment before reviewing the resulting page.",
      "That browser may not support direct capture. Choose existing photos or use the phone camera first; do not assume every device exposes the same capture flow.",
      "Retake the photo with focus and parallel framing when possible. Perspective correction cannot recover detail that was never captured."
    ],
    "faq": [
      {
        "question": "The camera button opens a file picker?",
        "answer": "That browser may not support direct capture. Choose existing photos or use the phone camera first; do not assume every device exposes the same capture flow."
      },
      {
        "question": "The text is blurred or distorted?",
        "answer": "Retake the photo with focus and parallel framing when possible. Perspective correction cannot recover detail that was never captured."
      },
      {
        "question": "Can it straighten or crop the page automatically?",
        "answer": "Automatic correction is not included. Use Review crop and straighten for manual cropping, rotation or four-corner perspective correction; preview before applying."
      }
    ],
    "hero": {
      "input": "Paper photos",
      "output": "Scanned PDF"
    },
    "cta": "Open Scan to PDF →"
  },
  {
    "slug": "combine-receipt-photos-into-a-single-pdf",
    "title": "Combine receipt photos into a single PDF",
    "category": "Convert",
    "tool": "images-to-pdf",
    "toolId": "images",
    "toolNumber": 40,
    "summary": "Three receipt photos need one attachment.",
    "intent": "Practical example",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Images to PDF",
      "Practical example",
      "jpg",
      "png",
      "photos"
    ],
    "steps": [
      "Choose JPG, PNG or WebP images.",
      "Review the resulting pages and arrange their order in the workspace.",
      "Export the PDF and check orientation, margins and small details before downloading."
    ],
    "check": "Very large images use substantial browser memory. Reduce their dimensions first if necessary. Use OCR afterwards when you need searchable text.",
    "limit": "PNG, JPG and WebP images. Browser memory also depends on decoded images, not just file size.",
    "sections": [
      {
        "heading": "The document and the intended outcome",
        "paragraphs": [
          "Three receipt photos need one attachment. Add JPG, PNG or WebP images, arrange the sequence, choose image-size pages or a standard sheet, then inspect all edges."
        ]
      },
      {
        "heading": "Make this example work for your file",
        "paragraphs": [
          "For a receipt bundle, arrange photographs chronologically and check orientation. Keep a legible margin around each image. Converting photos to PDF packages them as pages rather than recognizing their text."
        ]
      },
      {
        "heading": "Choose only the settings this case needs",
        "paragraphs": [
          "Choose Page size, Orientation and Margin for the output purpose. Image-dimensions mode uses the image shape; standard sheets fit the photograph within the chosen page."
        ]
      },
      {
        "heading": "When the example needs a different approach",
        "paragraphs": [
          "Review the selected paper size and margin. A portrait photograph on a landscape standard sheet naturally leaves unused space."
        ]
      }
    ],
    "tips": [
      "Choose Page size, Orientation and Margin for the output purpose. Image-dimensions mode uses the image shape; standard sheets fit the photograph within the chosen page.",
      "Decoded pixels use much more memory than compressed file bytes. Resize the photograph or try fewer inputs, especially on a phone.",
      "Review the selected paper size and margin. A portrait photograph on a landscape standard sheet naturally leaves unused space."
    ],
    "faq": [
      {
        "question": "A large image cannot open?",
        "answer": "Decoded pixels use much more memory than compressed file bytes. Resize the photograph or try fewer inputs, especially on a phone."
      },
      {
        "question": "The output has unexpected white borders?",
        "answer": "Review the selected paper size and margin. A portrait photograph on a landscape standard sheet naturally leaves unused space."
      },
      {
        "question": "Can I use PNG as well as JPG?",
        "answer": "Yes. JPG, PNG and WebP inputs are supported."
      },
      {
        "question": "Will the PDF text be selectable?",
        "answer": "Image conversion alone does not recognize text. OCR is a separate operation."
      }
    ],
    "hero": {
      "input": "Photo sequence",
      "output": "One PDF"
    },
    "cta": "Open Images to PDF →"
  },
  {
    "slug": "images-to-pdf-common-problems-and-how-to-fix-them",
    "title": "Images to PDF: common problems and how to fix them",
    "category": "Convert",
    "tool": "images-to-pdf",
    "toolId": "images",
    "toolNumber": 40,
    "summary": "Resolve a large image cannot open and the output has unexpected white borders. Understand the limits before retrying.",
    "intent": "Troubleshooting",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Images to PDF",
      "Troubleshooting",
      "jpg",
      "png",
      "photos"
    ],
    "steps": [
      "Choose JPG, PNG or WebP images.",
      "Review the resulting pages and arrange their order in the workspace.",
      "Export the PDF and check orientation, margins and small details before downloading."
    ],
    "check": "Very large images use substantial browser memory. Reduce their dimensions first if necessary. Use OCR afterwards when you need searchable text.",
    "limit": "PNG, JPG and WebP images. Browser memory also depends on decoded images, not just file size.",
    "sections": [
      {
        "heading": "A large image cannot open",
        "paragraphs": [
          "Decoded pixels use much more memory than compressed file bytes. Resize the photograph or try fewer inputs, especially on a phone."
        ]
      },
      {
        "heading": "The output has unexpected white borders",
        "paragraphs": [
          "Review the selected paper size and margin. A portrait photograph on a landscape standard sheet naturally leaves unused space."
        ]
      },
      {
        "heading": "Check whether this is the right operation",
        "paragraphs": [
          "Image conversion creates a page for each supported image. It does not recognize receipt text or reconstruct columns and totals as editable objects."
        ]
      },
      {
        "heading": "A more useful retry",
        "paragraphs": [
          "For a receipt bundle, arrange photographs chronologically and check orientation. Keep a legible margin around each image. Converting photos to PDF packages them as pages rather than recognizing their text."
        ]
      }
    ],
    "tips": [
      "Choose Page size, Orientation and Margin for the output purpose. Image-dimensions mode uses the image shape; standard sheets fit the photograph within the chosen page.",
      "Decoded pixels use much more memory than compressed file bytes. Resize the photograph or try fewer inputs, especially on a phone.",
      "Review the selected paper size and margin. A portrait photograph on a landscape standard sheet naturally leaves unused space."
    ],
    "faq": [
      {
        "question": "A large image cannot open?",
        "answer": "Decoded pixels use much more memory than compressed file bytes. Resize the photograph or try fewer inputs, especially on a phone."
      },
      {
        "question": "The output has unexpected white borders?",
        "answer": "Review the selected paper size and margin. A portrait photograph on a landscape standard sheet naturally leaves unused space."
      },
      {
        "question": "Can I use PNG as well as JPG?",
        "answer": "Yes. JPG, PNG and WebP inputs are supported."
      },
      {
        "question": "Will the PDF text be selectable?",
        "answer": "Image conversion alone does not recognize text. OCR is a separate operation."
      }
    ],
    "hero": {
      "input": "Photo sequence",
      "output": "One PDF"
    },
    "cta": "Open Images to PDF →"
  },
  {
    "slug": "how-to-export-pdf-pages-as-jpg-images",
    "title": "How to export PDF pages as JPG images",
    "category": "Convert",
    "tool": "pdf-to-jpg",
    "toolId": "jpg",
    "toolNumber": 41,
    "summary": "Export pages as images in a ZIP. Learn the available controls, a practical example and what to check.",
    "intent": "How-to",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "PDF to JPG",
      "How-to"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Choose a resolution suitable for screen viewing or printing.",
      "Export the ZIP and inspect the JPG images after extracting it."
    ],
    "check": "JPG is lossy and does not contain selectable text. Higher resolution uses more memory.",
    "limit": "JPG is lossy and does not contain selectable text. Higher resolution uses more memory.",
    "sections": [
      {
        "heading": "What this tool actually does",
        "paragraphs": [
          "JPG uses lossy image encoding. It is often suitable for photographs, while fine lines and small text need careful inspection for compression artifacts."
        ]
      },
      {
        "heading": "Choose the controls for your document",
        "paragraphs": [
          "Start with standard resolution and test a page containing the smallest print. The pixel dimensions depend on page size and rendering scale, so DPI alone is not a quality guarantee."
        ]
      },
      {
        "heading": "Before your first export",
        "paragraphs": [
          "For a slide image, inspect thin lines and small labels after JPEG encoding. Use a higher-quality choice when necessary and PNG when clean diagram edges matter more than image size."
        ]
      },
      {
        "heading": "The download contains a ZIP",
        "paragraphs": [
          "Each page is a separate image inside the archive. Extract it before opening individual pictures or uploading them to a gallery."
        ]
      }
    ],
    "tips": [
      "Start with standard resolution and test a page containing the smallest print. The pixel dimensions depend on page size and rendering scale, so DPI alone is not a quality guarantee.",
      "Each page is a separate image inside the archive. Extract it before opening individual pictures or uploading them to a gallery.",
      "Try PNG or a higher sensible resolution. Do not assume enlarging an image-only source restores missing detail."
    ],
    "faq": [
      {
        "question": "The download contains a ZIP?",
        "answer": "Each page is a separate image inside the archive. Extract it before opening individual pictures or uploading them to a gallery."
      },
      {
        "question": "The output is fuzzy around letters?",
        "answer": "Try PNG or a higher sensible resolution. Do not assume enlarging an image-only source restores missing detail."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Share PDF pages in an image format."
      },
      {
        "question": "What should I check in the result?",
        "answer": "JPG is lossy and does not contain selectable text. Higher resolution uses more memory."
      }
    ],
    "hero": {
      "input": "PDF pages",
      "output": "JPG files"
    },
    "cta": "Open PDF to JPG →"
  },
  {
    "slug": "export-pdf-pages-as-jpg-images-for-sharing",
    "title": "Export PDF pages as JPG images for sharing",
    "category": "Convert",
    "tool": "pdf-to-jpg",
    "toolId": "jpg",
    "toolNumber": 41,
    "summary": "A recipient needs pictures rather than a PDF.",
    "intent": "Practical example",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "PDF to JPG",
      "Practical example"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Choose a resolution suitable for screen viewing or printing.",
      "Export the ZIP and inspect the JPG images after extracting it."
    ],
    "check": "JPG is lossy and does not contain selectable text. Higher resolution uses more memory.",
    "limit": "JPG is lossy and does not contain selectable text. Higher resolution uses more memory.",
    "sections": [
      {
        "heading": "The document and the intended outcome",
        "paragraphs": [
          "A recipient needs pictures rather than a PDF. Choose a suitable resolution, export JPG pages, extract the archive and inspect filenames and small text."
        ]
      },
      {
        "heading": "Make this example work for your file",
        "paragraphs": [
          "For a slide image, inspect thin lines and small labels after JPEG encoding. Use a higher-quality choice when necessary and PNG when clean diagram edges matter more than image size."
        ]
      },
      {
        "heading": "Choose only the settings this case needs",
        "paragraphs": [
          "Start with standard resolution and test a page containing the smallest print. The pixel dimensions depend on page size and rendering scale, so DPI alone is not a quality guarantee."
        ]
      },
      {
        "heading": "When the example needs a different approach",
        "paragraphs": [
          "Try PNG or a higher sensible resolution. Do not assume enlarging an image-only source restores missing detail."
        ]
      }
    ],
    "tips": [
      "Start with standard resolution and test a page containing the smallest print. The pixel dimensions depend on page size and rendering scale, so DPI alone is not a quality guarantee.",
      "Each page is a separate image inside the archive. Extract it before opening individual pictures or uploading them to a gallery.",
      "Try PNG or a higher sensible resolution. Do not assume enlarging an image-only source restores missing detail."
    ],
    "faq": [
      {
        "question": "The download contains a ZIP?",
        "answer": "Each page is a separate image inside the archive. Extract it before opening individual pictures or uploading them to a gallery."
      },
      {
        "question": "The output is fuzzy around letters?",
        "answer": "Try PNG or a higher sensible resolution. Do not assume enlarging an image-only source restores missing detail."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Share PDF pages in an image format."
      },
      {
        "question": "What should I check in the result?",
        "answer": "JPG is lossy and does not contain selectable text. Higher resolution uses more memory."
      }
    ],
    "hero": {
      "input": "PDF pages",
      "output": "JPG files"
    },
    "cta": "Open PDF to JPG →"
  },
  {
    "slug": "pdf-to-jpg-common-problems-and-how-to-fix-them",
    "title": "PDF to JPG: common problems and how to fix them",
    "category": "Convert",
    "tool": "pdf-to-jpg",
    "toolId": "jpg",
    "toolNumber": 41,
    "summary": "Resolve the download contains a zip and the output is fuzzy around letters. Understand the limits before retrying.",
    "intent": "Troubleshooting",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "PDF to JPG",
      "Troubleshooting"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Choose a resolution suitable for screen viewing or printing.",
      "Export the ZIP and inspect the JPG images after extracting it."
    ],
    "check": "JPG is lossy and does not contain selectable text. Higher resolution uses more memory.",
    "limit": "JPG is lossy and does not contain selectable text. Higher resolution uses more memory.",
    "sections": [
      {
        "heading": "The download contains a ZIP",
        "paragraphs": [
          "Each page is a separate image inside the archive. Extract it before opening individual pictures or uploading them to a gallery."
        ]
      },
      {
        "heading": "The output is fuzzy around letters",
        "paragraphs": [
          "Try PNG or a higher sensible resolution. Do not assume enlarging an image-only source restores missing detail."
        ]
      },
      {
        "heading": "Check whether this is the right operation",
        "paragraphs": [
          "JPG uses lossy image encoding. It is often suitable for photographs, while fine lines and small text need careful inspection for compression artifacts."
        ]
      },
      {
        "heading": "A more useful retry",
        "paragraphs": [
          "For a slide image, inspect thin lines and small labels after JPEG encoding. Use a higher-quality choice when necessary and PNG when clean diagram edges matter more than image size."
        ]
      }
    ],
    "tips": [
      "Start with standard resolution and test a page containing the smallest print. The pixel dimensions depend on page size and rendering scale, so DPI alone is not a quality guarantee.",
      "Each page is a separate image inside the archive. Extract it before opening individual pictures or uploading them to a gallery.",
      "Try PNG or a higher sensible resolution. Do not assume enlarging an image-only source restores missing detail."
    ],
    "faq": [
      {
        "question": "The download contains a ZIP?",
        "answer": "Each page is a separate image inside the archive. Extract it before opening individual pictures or uploading them to a gallery."
      },
      {
        "question": "The output is fuzzy around letters?",
        "answer": "Try PNG or a higher sensible resolution. Do not assume enlarging an image-only source restores missing detail."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Share PDF pages in an image format."
      },
      {
        "question": "What should I check in the result?",
        "answer": "JPG is lossy and does not contain selectable text. Higher resolution uses more memory."
      }
    ],
    "hero": {
      "input": "PDF pages",
      "output": "JPG files"
    },
    "cta": "Open PDF to JPG →"
  },
  {
    "slug": "how-to-export-pdf-pages-as-png-images",
    "title": "How to export PDF pages as PNG images",
    "category": "Convert",
    "tool": "pdf-to-png",
    "toolId": "png",
    "toolNumber": 42,
    "summary": "Lossless page images, in a ZIP. Learn the available controls, a practical example and what to check.",
    "intent": "How-to",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "PDF to PNG",
      "How-to"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Choose 72, 144 or 288 DPI according to your intended use.",
      "Export the ZIP and inspect the extracted PNG images."
    ],
    "check": "PNG preserves rendered pixels, not editable PDF objects. High resolution may produce large files.",
    "limit": "PNG preserves rendered pixels, not editable PDF objects. High resolution may produce large files.",
    "sections": [
      {
        "heading": "What this tool actually does",
        "paragraphs": [
          "PNG avoids lossy JPEG artifacts but can produce larger files. Its pixels preserve visible appearance rather than PDF text objects or interactive elements."
        ]
      },
      {
        "heading": "Choose the controls for your document",
        "paragraphs": [
          "Choose resolution according to display or print needs. Higher pixel counts increase memory; test one page before rendering a large technical manual."
        ]
      },
      {
        "heading": "Before your first export",
        "paragraphs": [
          "For a technical diagram, inspect fine grid lines and text at the intended display scale. PNG avoids JPEG-style block artefacts, but rendered pixels still have a finite resolution."
        ]
      },
      {
        "heading": "The PNG files are much larger than expected",
        "paragraphs": [
          "Lossless image encoding can be expensive for detailed scans. Use a lower resolution or compare a suitable JPG/WebP output if size is the priority."
        ]
      }
    ],
    "tips": [
      "Choose resolution according to display or print needs. Higher pixel counts increase memory; test one page before rendering a large technical manual.",
      "Lossless image encoding can be expensive for detailed scans. Use a lower resolution or compare a suitable JPG/WebP output if size is the priority.",
      "An exported page image has no PDF text layer. Keep the PDF when search, links or text selection are required."
    ],
    "faq": [
      {
        "question": "The PNG files are much larger than expected?",
        "answer": "Lossless image encoding can be expensive for detailed scans. Use a lower resolution or compare a suitable JPG/WebP output if size is the priority."
      },
      {
        "question": "Image text cannot be selected?",
        "answer": "An exported page image has no PDF text layer. Keep the PDF when search, links or text selection are required."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Create page images without JPG compression artifacts."
      },
      {
        "question": "What should I check in the result?",
        "answer": "PNG preserves rendered pixels, not editable PDF objects. High resolution may produce large files."
      }
    ],
    "hero": {
      "input": "PDF diagram",
      "output": "PNG image"
    },
    "cta": "Open PDF to PNG →"
  },
  {
    "slug": "export-a-crisp-pdf-page-image-for-a-diagram",
    "title": "Export a crisp PDF page image for a diagram",
    "category": "Convert",
    "tool": "pdf-to-png",
    "toolId": "png",
    "toolNumber": 42,
    "summary": "A page contains a line diagram and small labels.",
    "intent": "Practical example",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "PDF to PNG",
      "Practical example"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Choose 72, 144 or 288 DPI according to your intended use.",
      "Export the ZIP and inspect the extracted PNG images."
    ],
    "check": "PNG preserves rendered pixels, not editable PDF objects. High resolution may produce large files.",
    "limit": "PNG preserves rendered pixels, not editable PDF objects. High resolution may produce large files.",
    "sections": [
      {
        "heading": "The document and the intended outcome",
        "paragraphs": [
          "A page contains a line diagram and small labels. Export PNG, extract the ZIP and inspect the labels at the size where the image will be used."
        ]
      },
      {
        "heading": "Make this example work for your file",
        "paragraphs": [
          "For a technical diagram, inspect fine grid lines and text at the intended display scale. PNG avoids JPEG-style block artefacts, but rendered pixels still have a finite resolution."
        ]
      },
      {
        "heading": "Choose only the settings this case needs",
        "paragraphs": [
          "Choose resolution according to display or print needs. Higher pixel counts increase memory; test one page before rendering a large technical manual."
        ]
      },
      {
        "heading": "When the example needs a different approach",
        "paragraphs": [
          "An exported page image has no PDF text layer. Keep the PDF when search, links or text selection are required."
        ]
      }
    ],
    "tips": [
      "Choose resolution according to display or print needs. Higher pixel counts increase memory; test one page before rendering a large technical manual.",
      "Lossless image encoding can be expensive for detailed scans. Use a lower resolution or compare a suitable JPG/WebP output if size is the priority.",
      "An exported page image has no PDF text layer. Keep the PDF when search, links or text selection are required."
    ],
    "faq": [
      {
        "question": "The PNG files are much larger than expected?",
        "answer": "Lossless image encoding can be expensive for detailed scans. Use a lower resolution or compare a suitable JPG/WebP output if size is the priority."
      },
      {
        "question": "Image text cannot be selected?",
        "answer": "An exported page image has no PDF text layer. Keep the PDF when search, links or text selection are required."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Create page images without JPG compression artifacts."
      },
      {
        "question": "What should I check in the result?",
        "answer": "PNG preserves rendered pixels, not editable PDF objects. High resolution may produce large files."
      }
    ],
    "hero": {
      "input": "PDF diagram",
      "output": "PNG image"
    },
    "cta": "Open PDF to PNG →"
  },
  {
    "slug": "pdf-to-png-common-problems-and-how-to-fix-them",
    "title": "PDF to PNG: common problems and how to fix them",
    "category": "Convert",
    "tool": "pdf-to-png",
    "toolId": "png",
    "toolNumber": 42,
    "summary": "Resolve the png files are much larger than expected and image text cannot be selected. Understand the limits before retrying.",
    "intent": "Troubleshooting",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "PDF to PNG",
      "Troubleshooting"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Choose 72, 144 or 288 DPI according to your intended use.",
      "Export the ZIP and inspect the extracted PNG images."
    ],
    "check": "PNG preserves rendered pixels, not editable PDF objects. High resolution may produce large files.",
    "limit": "PNG preserves rendered pixels, not editable PDF objects. High resolution may produce large files.",
    "sections": [
      {
        "heading": "The PNG files are much larger than expected",
        "paragraphs": [
          "Lossless image encoding can be expensive for detailed scans. Use a lower resolution or compare a suitable JPG/WebP output if size is the priority."
        ]
      },
      {
        "heading": "Image text cannot be selected",
        "paragraphs": [
          "An exported page image has no PDF text layer. Keep the PDF when search, links or text selection are required."
        ]
      },
      {
        "heading": "Check whether this is the right operation",
        "paragraphs": [
          "PNG avoids lossy JPEG artifacts but can produce larger files. Its pixels preserve visible appearance rather than PDF text objects or interactive elements."
        ]
      },
      {
        "heading": "A more useful retry",
        "paragraphs": [
          "For a technical diagram, inspect fine grid lines and text at the intended display scale. PNG avoids JPEG-style block artefacts, but rendered pixels still have a finite resolution."
        ]
      }
    ],
    "tips": [
      "Choose resolution according to display or print needs. Higher pixel counts increase memory; test one page before rendering a large technical manual.",
      "Lossless image encoding can be expensive for detailed scans. Use a lower resolution or compare a suitable JPG/WebP output if size is the priority.",
      "An exported page image has no PDF text layer. Keep the PDF when search, links or text selection are required."
    ],
    "faq": [
      {
        "question": "The PNG files are much larger than expected?",
        "answer": "Lossless image encoding can be expensive for detailed scans. Use a lower resolution or compare a suitable JPG/WebP output if size is the priority."
      },
      {
        "question": "Image text cannot be selected?",
        "answer": "An exported page image has no PDF text layer. Keep the PDF when search, links or text selection are required."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Create page images without JPG compression artifacts."
      },
      {
        "question": "What should I check in the result?",
        "answer": "PNG preserves rendered pixels, not editable PDF objects. High resolution may produce large files."
      }
    ],
    "hero": {
      "input": "PDF diagram",
      "output": "PNG image"
    },
    "cta": "Open PDF to PNG →"
  },
  {
    "slug": "how-to-extract-selectable-text-from-a-pdf",
    "title": "How to extract selectable text from a PDF",
    "category": "Convert",
    "tool": "extract-text",
    "toolId": "text",
    "toolNumber": 43,
    "summary": "Save selectable text as a TXT file. Learn the available controls, a practical example and what to check.",
    "intent": "How-to",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Extract text",
      "How-to"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Use a PDF containing selectable text; run OCR first for a scan.",
      "Export the TXT file and check reading order and missing sections."
    ],
    "check": "Columns and positioned text may come out in an unexpected order. Images and layout are not preserved.",
    "limit": "Columns and positioned text may come out in an unexpected order. Images and layout are not preserved.",
    "sections": [
      {
        "heading": "What this tool actually does",
        "paragraphs": [
          "Extraction reads available text objects. Multi-column layouts, unusual character mappings and untagged reading order can produce a sequence different from what the page looks like."
        ]
      },
      {
        "heading": "Choose the controls for your document",
        "paragraphs": [
          "Choose a PDF containing selectable text and inspect page boundaries in the result. Keep the PDF alongside the TXT so quotations can be checked against the source."
        ]
      },
      {
        "heading": "Before your first export",
        "paragraphs": [
          "For extracted notes, compare the first paragraph, a multi-column page and the final paragraph with the original. Reorder text manually when the source’s drawing order differs from its human reading order."
        ]
      },
      {
        "heading": "The TXT is empty for a scan",
        "paragraphs": [
          "The page is an image. Run OCR first and review the recognized words before relying on extracted text."
        ]
      }
    ],
    "tips": [
      "Choose a PDF containing selectable text and inspect page boundaries in the result. Keep the PDF alongside the TXT so quotations can be checked against the source.",
      "The page is an image. Run OCR first and review the recognized words before relying on extracted text.",
      "Plain-text extraction does not reconstruct the original layout. Reorder the relevant passage manually after comparing it with the visible page."
    ],
    "faq": [
      {
        "question": "The TXT is empty for a scan?",
        "answer": "The page is an image. Run OCR first and review the recognized words before relying on extracted text."
      },
      {
        "question": "Columns appear mixed together?",
        "answer": "Plain-text extraction does not reconstruct the original layout. Reorder the relevant passage manually after comparing it with the visible page."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Copy document text into a plain-text workflow."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Columns and positioned text may come out in an unexpected order. Images and layout are not preserved."
      }
    ],
    "hero": {
      "input": "Text objects",
      "output": "TXT words"
    },
    "cta": "Open Extract text →",
    "evidence": {
      "id": "text",
      "input": "/examples/verified-tools/text-input.pdf",
      "output": "/examples/verified-tools/text-result.txt",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "Extracted content contains the source Alpha text.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      }
    }
  },
  {
    "slug": "extract-selectable-pdf-text-into-a-plain-text-file",
    "title": "Extract selectable PDF text into a plain-text file",
    "category": "Convert",
    "tool": "extract-text",
    "toolId": "text",
    "toolNumber": 43,
    "summary": "A researcher needs words from a report for quotation review.",
    "intent": "Practical example",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Extract text",
      "Practical example"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Use a PDF containing selectable text; run OCR first for a scan.",
      "Export the TXT file and check reading order and missing sections."
    ],
    "check": "Columns and positioned text may come out in an unexpected order. Images and layout are not preserved.",
    "limit": "Columns and positioned text may come out in an unexpected order. Images and layout are not preserved.",
    "sections": [
      {
        "heading": "The document and the intended outcome",
        "paragraphs": [
          "A researcher needs words from a report for quotation review. Extract text, open the TXT file and compare several paragraphs with their original pages."
        ]
      },
      {
        "heading": "Make this example work for your file",
        "paragraphs": [
          "For extracted notes, compare the first paragraph, a multi-column page and the final paragraph with the original. Reorder text manually when the source’s drawing order differs from its human reading order."
        ]
      },
      {
        "heading": "Choose only the settings this case needs",
        "paragraphs": [
          "Choose a PDF containing selectable text and inspect page boundaries in the result. Keep the PDF alongside the TXT so quotations can be checked against the source."
        ]
      },
      {
        "heading": "When the example needs a different approach",
        "paragraphs": [
          "Plain-text extraction does not reconstruct the original layout. Reorder the relevant passage manually after comparing it with the visible page."
        ]
      }
    ],
    "tips": [
      "Choose a PDF containing selectable text and inspect page boundaries in the result. Keep the PDF alongside the TXT so quotations can be checked against the source.",
      "The page is an image. Run OCR first and review the recognized words before relying on extracted text.",
      "Plain-text extraction does not reconstruct the original layout. Reorder the relevant passage manually after comparing it with the visible page."
    ],
    "faq": [
      {
        "question": "The TXT is empty for a scan?",
        "answer": "The page is an image. Run OCR first and review the recognized words before relying on extracted text."
      },
      {
        "question": "Columns appear mixed together?",
        "answer": "Plain-text extraction does not reconstruct the original layout. Reorder the relevant passage manually after comparing it with the visible page."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Copy document text into a plain-text workflow."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Columns and positioned text may come out in an unexpected order. Images and layout are not preserved."
      }
    ],
    "hero": {
      "input": "Text objects",
      "output": "TXT words"
    },
    "cta": "Open Extract text →",
    "evidence": {
      "id": "text",
      "input": "/examples/verified-tools/text-input.pdf",
      "output": "/examples/verified-tools/text-result.txt",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "Extracted content contains the source Alpha text.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      }
    }
  },
  {
    "slug": "extract-text-common-problems-and-how-to-fix-them",
    "title": "Extract text: common problems and how to fix them",
    "category": "Convert",
    "tool": "extract-text",
    "toolId": "text",
    "toolNumber": 43,
    "summary": "Resolve the txt is empty for a scan and columns appear mixed together. Understand the limits before retrying.",
    "intent": "Troubleshooting",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Extract text",
      "Troubleshooting"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Use a PDF containing selectable text; run OCR first for a scan.",
      "Export the TXT file and check reading order and missing sections."
    ],
    "check": "Columns and positioned text may come out in an unexpected order. Images and layout are not preserved.",
    "limit": "Columns and positioned text may come out in an unexpected order. Images and layout are not preserved.",
    "sections": [
      {
        "heading": "The TXT is empty for a scan",
        "paragraphs": [
          "The page is an image. Run OCR first and review the recognized words before relying on extracted text."
        ]
      },
      {
        "heading": "Columns appear mixed together",
        "paragraphs": [
          "Plain-text extraction does not reconstruct the original layout. Reorder the relevant passage manually after comparing it with the visible page."
        ]
      },
      {
        "heading": "Check whether this is the right operation",
        "paragraphs": [
          "Extraction reads available text objects. Multi-column layouts, unusual character mappings and untagged reading order can produce a sequence different from what the page looks like."
        ]
      },
      {
        "heading": "A more useful retry",
        "paragraphs": [
          "For extracted notes, compare the first paragraph, a multi-column page and the final paragraph with the original. Reorder text manually when the source’s drawing order differs from its human reading order."
        ]
      }
    ],
    "tips": [
      "Choose a PDF containing selectable text and inspect page boundaries in the result. Keep the PDF alongside the TXT so quotations can be checked against the source.",
      "The page is an image. Run OCR first and review the recognized words before relying on extracted text.",
      "Plain-text extraction does not reconstruct the original layout. Reorder the relevant passage manually after comparing it with the visible page."
    ],
    "faq": [
      {
        "question": "The TXT is empty for a scan?",
        "answer": "The page is an image. Run OCR first and review the recognized words before relying on extracted text."
      },
      {
        "question": "Columns appear mixed together?",
        "answer": "Plain-text extraction does not reconstruct the original layout. Reorder the relevant passage manually after comparing it with the visible page."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Copy document text into a plain-text workflow."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Columns and positioned text may come out in an unexpected order. Images and layout are not preserved."
      }
    ],
    "hero": {
      "input": "Text objects",
      "output": "TXT words"
    },
    "cta": "Open Extract text →",
    "evidence": {
      "id": "text",
      "input": "/examples/verified-tools/text-input.pdf",
      "output": "/examples/verified-tools/text-result.txt",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "Extracted content contains the source Alpha text.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      }
    }
  },
  {
    "slug": "how-to-extract-pdf-text-into-a-word-document",
    "title": "How to extract PDF text into a Word document",
    "category": "Convert",
    "tool": "pdf-to-word",
    "toolId": "word",
    "toolNumber": 44,
    "summary": "Export document text to DOCX. Learn the available controls, a practical example and what to check.",
    "intent": "How-to",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "PDF to Word",
      "How-to"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Use a text PDF, or run OCR first when the source is a scan.",
      "Export the DOCX and review paragraphs, numbers and reading order."
    ],
    "check": "This is text conversion. Original layout, tables and embedded images are not faithfully reconstructed.",
    "limit": "Text conversion; original layout and embedded images are not preserved. Use OCR first for scans.",
    "sections": [
      {
        "heading": "What this tool actually does",
        "paragraphs": [
          "This tool converts text content. Images, tables, page geometry and exact fonts are not reproduced as an editable original Word document."
        ]
      },
      {
        "heading": "Choose the controls for your document",
        "paragraphs": [
          "Check names, headings, paragraph order and page transitions in the DOCX. Use OCR first for scans and proofread recognition errors before further editing."
        ]
      },
      {
        "heading": "Before your first export",
        "paragraphs": [
          "For a working draft, treat the extracted DOCX as a starting point. Rebuild headings and tables as needed in Word, then compare important facts with the PDF before producing a revised version."
        ]
      },
      {
        "heading": "Images are missing from the DOCX",
        "paragraphs": [
          "The conversion is text-oriented. Keep the original PDF for visual reference and insert essential images manually if you need a new Word layout."
        ]
      }
    ],
    "tips": [
      "Check names, headings, paragraph order and page transitions in the DOCX. Use OCR first for scans and proofread recognition errors before further editing.",
      "The conversion is text-oriented. Keep the original PDF for visual reference and insert essential images manually if you need a new Word layout.",
      "Columns and text positions may not have a natural reading sequence. Compare with the original and restructure the draft deliberately."
    ],
    "faq": [
      {
        "question": "Images are missing from the DOCX?",
        "answer": "The conversion is text-oriented. Keep the original PDF for visual reference and insert essential images manually if you need a new Word layout."
      },
      {
        "question": "A complex page becomes disordered text?",
        "answer": "Columns and text positions may not have a natural reading sequence. Compare with the original and restructure the draft deliberately."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Move extracted PDF text into a Word document for further writing."
      },
      {
        "question": "What should I check in the result?",
        "answer": "This is text conversion. Original layout, tables and embedded images are not faithfully reconstructed."
      }
    ],
    "hero": {
      "input": "PDF wording",
      "output": "DOCX text draft"
    },
    "cta": "Open PDF to Word →",
    "evidence": {
      "id": "word",
      "input": "/examples/verified-tools/word-input.pdf",
      "output": "/examples/verified-tools/word-result.docx",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "Output package contains its document content part.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      }
    }
  },
  {
    "slug": "make-an-editable-text-draft-from-a-pdf",
    "title": "Make an editable text draft from a PDF",
    "category": "Convert",
    "tool": "pdf-to-word",
    "toolId": "word",
    "toolNumber": 44,
    "summary": "A report must become an editable wording draft.",
    "intent": "Practical example",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "PDF to Word",
      "Practical example"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Use a text PDF, or run OCR first when the source is a scan.",
      "Export the DOCX and review paragraphs, numbers and reading order."
    ],
    "check": "This is text conversion. Original layout, tables and embedded images are not faithfully reconstructed.",
    "limit": "Text conversion; original layout and embedded images are not preserved. Use OCR first for scans.",
    "sections": [
      {
        "heading": "The document and the intended outcome",
        "paragraphs": [
          "A report must become an editable wording draft. Export its selectable text to DOCX and rebuild formatting in Word instead of expecting a faithful copy of every PDF layout detail."
        ]
      },
      {
        "heading": "Make this example work for your file",
        "paragraphs": [
          "For a working draft, treat the extracted DOCX as a starting point. Rebuild headings and tables as needed in Word, then compare important facts with the PDF before producing a revised version."
        ]
      },
      {
        "heading": "Choose only the settings this case needs",
        "paragraphs": [
          "Check names, headings, paragraph order and page transitions in the DOCX. Use OCR first for scans and proofread recognition errors before further editing."
        ]
      },
      {
        "heading": "When the example needs a different approach",
        "paragraphs": [
          "Columns and text positions may not have a natural reading sequence. Compare with the original and restructure the draft deliberately."
        ]
      }
    ],
    "tips": [
      "Check names, headings, paragraph order and page transitions in the DOCX. Use OCR first for scans and proofread recognition errors before further editing.",
      "The conversion is text-oriented. Keep the original PDF for visual reference and insert essential images manually if you need a new Word layout.",
      "Columns and text positions may not have a natural reading sequence. Compare with the original and restructure the draft deliberately."
    ],
    "faq": [
      {
        "question": "Images are missing from the DOCX?",
        "answer": "The conversion is text-oriented. Keep the original PDF for visual reference and insert essential images manually if you need a new Word layout."
      },
      {
        "question": "A complex page becomes disordered text?",
        "answer": "Columns and text positions may not have a natural reading sequence. Compare with the original and restructure the draft deliberately."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Move extracted PDF text into a Word document for further writing."
      },
      {
        "question": "What should I check in the result?",
        "answer": "This is text conversion. Original layout, tables and embedded images are not faithfully reconstructed."
      }
    ],
    "hero": {
      "input": "PDF wording",
      "output": "DOCX text draft"
    },
    "cta": "Open PDF to Word →",
    "evidence": {
      "id": "word",
      "input": "/examples/verified-tools/word-input.pdf",
      "output": "/examples/verified-tools/word-result.docx",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "Output package contains its document content part.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      }
    }
  },
  {
    "slug": "pdf-to-word-common-problems-and-how-to-fix-them",
    "title": "PDF to Word: common problems and how to fix them",
    "category": "Convert",
    "tool": "pdf-to-word",
    "toolId": "word",
    "toolNumber": 44,
    "summary": "Resolve images are missing from the docx and a complex page becomes disordered text. Understand the limits before retrying.",
    "intent": "Troubleshooting",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "PDF to Word",
      "Troubleshooting"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Use a text PDF, or run OCR first when the source is a scan.",
      "Export the DOCX and review paragraphs, numbers and reading order."
    ],
    "check": "This is text conversion. Original layout, tables and embedded images are not faithfully reconstructed.",
    "limit": "Text conversion; original layout and embedded images are not preserved. Use OCR first for scans.",
    "sections": [
      {
        "heading": "Images are missing from the DOCX",
        "paragraphs": [
          "The conversion is text-oriented. Keep the original PDF for visual reference and insert essential images manually if you need a new Word layout."
        ]
      },
      {
        "heading": "A complex page becomes disordered text",
        "paragraphs": [
          "Columns and text positions may not have a natural reading sequence. Compare with the original and restructure the draft deliberately."
        ]
      },
      {
        "heading": "Check whether this is the right operation",
        "paragraphs": [
          "This tool converts text content. Images, tables, page geometry and exact fonts are not reproduced as an editable original Word document."
        ]
      },
      {
        "heading": "A more useful retry",
        "paragraphs": [
          "For a working draft, treat the extracted DOCX as a starting point. Rebuild headings and tables as needed in Word, then compare important facts with the PDF before producing a revised version."
        ]
      }
    ],
    "tips": [
      "Check names, headings, paragraph order and page transitions in the DOCX. Use OCR first for scans and proofread recognition errors before further editing.",
      "The conversion is text-oriented. Keep the original PDF for visual reference and insert essential images manually if you need a new Word layout.",
      "Columns and text positions may not have a natural reading sequence. Compare with the original and restructure the draft deliberately."
    ],
    "faq": [
      {
        "question": "Images are missing from the DOCX?",
        "answer": "The conversion is text-oriented. Keep the original PDF for visual reference and insert essential images manually if you need a new Word layout."
      },
      {
        "question": "A complex page becomes disordered text?",
        "answer": "Columns and text positions may not have a natural reading sequence. Compare with the original and restructure the draft deliberately."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Move extracted PDF text into a Word document for further writing."
      },
      {
        "question": "What should I check in the result?",
        "answer": "This is text conversion. Original layout, tables and embedded images are not faithfully reconstructed."
      }
    ],
    "hero": {
      "input": "PDF wording",
      "output": "DOCX text draft"
    },
    "cta": "Open PDF to Word →",
    "evidence": {
      "id": "word",
      "input": "/examples/verified-tools/word-input.pdf",
      "output": "/examples/verified-tools/word-result.docx",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "Output package contains its document content part.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      }
    }
  },
  {
    "slug": "how-to-extract-pdf-text-into-html",
    "title": "How to extract PDF text into HTML",
    "category": "Convert",
    "tool": "pdf-to-html",
    "toolId": "html",
    "toolNumber": 45,
    "summary": "Export text as a readable webpage. Learn the available controls, a practical example and what to check.",
    "intent": "How-to",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "PDF to HTML",
      "How-to"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Open a PDF with selectable text.",
      "Export the HTML and review its text in a browser."
    ],
    "check": "The output is text-based. Original page styling, images and interactive PDF features are not retained.",
    "limit": "The output is text-based. Original page styling, images and interactive PDF features are not retained.",
    "sections": [
      {
        "heading": "What this tool actually does",
        "paragraphs": [
          "HTML output is a readable text conversion, not a recreation of the PDF’s exact design or an automatic website publication."
        ]
      },
      {
        "heading": "Choose the controls for your document",
        "paragraphs": [
          "Inspect the exported file locally first. Preserve the original for diagrams and tables that the text conversion does not reconstruct."
        ]
      },
      {
        "heading": "Before your first export",
        "paragraphs": [
          "For an internal text page, review the extracted order before publishing it. Add semantic headings in your website editor when appropriate; extraction alone does not recreate the PDF’s visual or accessibility structure."
        ]
      },
      {
        "heading": "The page does not look like the PDF",
        "paragraphs": [
          "Reflowed web text has different line and page breaks. Apply a suitable web layout separately when visual fidelity matters."
        ]
      }
    ],
    "tips": [
      "Inspect the exported file locally first. Preserve the original for diagrams and tables that the text conversion does not reconstruct.",
      "Reflowed web text has different line and page breaks. Apply a suitable web layout separately when visual fidelity matters.",
      "Use OCR and correct the recognition first. Packaging an image scan into HTML does not create usable document text."
    ],
    "faq": [
      {
        "question": "The page does not look like the PDF?",
        "answer": "Reflowed web text has different line and page breaks. Apply a suitable web layout separately when visual fidelity matters."
      },
      {
        "question": "Scanned pages contribute no text?",
        "answer": "Use OCR and correct the recognition first. Packaging an image scan into HTML does not create usable document text."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Make extracted document text readable as a webpage."
      },
      {
        "question": "What should I check in the result?",
        "answer": "The output is text-based. Original page styling, images and interactive PDF features are not retained."
      }
    ],
    "hero": {
      "input": "PDF text",
      "output": "HTML draft"
    },
    "cta": "Open PDF to HTML →",
    "evidence": {
      "id": "html",
      "input": "/examples/verified-tools/html-input.pdf",
      "output": "/examples/verified-tools/html-result.html",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "Extracted content contains the source Alpha text.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      }
    }
  },
  {
    "slug": "turn-pdf-text-into-a-readable-html-draft",
    "title": "Turn PDF text into a readable HTML draft",
    "category": "Convert",
    "tool": "pdf-to-html",
    "toolId": "html",
    "toolNumber": 45,
    "summary": "An internal document needs a lightweight text webpage.",
    "intent": "Practical example",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "PDF to HTML",
      "Practical example"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Open a PDF with selectable text.",
      "Export the HTML and review its text in a browser."
    ],
    "check": "The output is text-based. Original page styling, images and interactive PDF features are not retained.",
    "limit": "The output is text-based. Original page styling, images and interactive PDF features are not retained.",
    "sections": [
      {
        "heading": "The document and the intended outcome",
        "paragraphs": [
          "An internal document needs a lightweight text webpage. Export HTML, open it in a browser and review headings, text order and characters before hosting or distributing it."
        ]
      },
      {
        "heading": "Make this example work for your file",
        "paragraphs": [
          "For an internal text page, review the extracted order before publishing it. Add semantic headings in your website editor when appropriate; extraction alone does not recreate the PDF’s visual or accessibility structure."
        ]
      },
      {
        "heading": "Choose only the settings this case needs",
        "paragraphs": [
          "Inspect the exported file locally first. Preserve the original for diagrams and tables that the text conversion does not reconstruct."
        ]
      },
      {
        "heading": "When the example needs a different approach",
        "paragraphs": [
          "Use OCR and correct the recognition first. Packaging an image scan into HTML does not create usable document text."
        ]
      }
    ],
    "tips": [
      "Inspect the exported file locally first. Preserve the original for diagrams and tables that the text conversion does not reconstruct.",
      "Reflowed web text has different line and page breaks. Apply a suitable web layout separately when visual fidelity matters.",
      "Use OCR and correct the recognition first. Packaging an image scan into HTML does not create usable document text."
    ],
    "faq": [
      {
        "question": "The page does not look like the PDF?",
        "answer": "Reflowed web text has different line and page breaks. Apply a suitable web layout separately when visual fidelity matters."
      },
      {
        "question": "Scanned pages contribute no text?",
        "answer": "Use OCR and correct the recognition first. Packaging an image scan into HTML does not create usable document text."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Make extracted document text readable as a webpage."
      },
      {
        "question": "What should I check in the result?",
        "answer": "The output is text-based. Original page styling, images and interactive PDF features are not retained."
      }
    ],
    "hero": {
      "input": "PDF text",
      "output": "HTML draft"
    },
    "cta": "Open PDF to HTML →",
    "evidence": {
      "id": "html",
      "input": "/examples/verified-tools/html-input.pdf",
      "output": "/examples/verified-tools/html-result.html",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "Extracted content contains the source Alpha text.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      }
    }
  },
  {
    "slug": "pdf-to-html-common-problems-and-how-to-fix-them",
    "title": "PDF to HTML: common problems and how to fix them",
    "category": "Convert",
    "tool": "pdf-to-html",
    "toolId": "html",
    "toolNumber": 45,
    "summary": "Resolve the page does not look like the pdf and scanned pages contribute no text. Understand the limits before retrying.",
    "intent": "Troubleshooting",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "PDF to HTML",
      "Troubleshooting"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Open a PDF with selectable text.",
      "Export the HTML and review its text in a browser."
    ],
    "check": "The output is text-based. Original page styling, images and interactive PDF features are not retained.",
    "limit": "The output is text-based. Original page styling, images and interactive PDF features are not retained.",
    "sections": [
      {
        "heading": "The page does not look like the PDF",
        "paragraphs": [
          "Reflowed web text has different line and page breaks. Apply a suitable web layout separately when visual fidelity matters."
        ]
      },
      {
        "heading": "Scanned pages contribute no text",
        "paragraphs": [
          "Use OCR and correct the recognition first. Packaging an image scan into HTML does not create usable document text."
        ]
      },
      {
        "heading": "Check whether this is the right operation",
        "paragraphs": [
          "HTML output is a readable text conversion, not a recreation of the PDF’s exact design or an automatic website publication."
        ]
      },
      {
        "heading": "A more useful retry",
        "paragraphs": [
          "For an internal text page, review the extracted order before publishing it. Add semantic headings in your website editor when appropriate; extraction alone does not recreate the PDF’s visual or accessibility structure."
        ]
      }
    ],
    "tips": [
      "Inspect the exported file locally first. Preserve the original for diagrams and tables that the text conversion does not reconstruct.",
      "Reflowed web text has different line and page breaks. Apply a suitable web layout separately when visual fidelity matters.",
      "Use OCR and correct the recognition first. Packaging an image scan into HTML does not create usable document text."
    ],
    "faq": [
      {
        "question": "The page does not look like the PDF?",
        "answer": "Reflowed web text has different line and page breaks. Apply a suitable web layout separately when visual fidelity matters."
      },
      {
        "question": "Scanned pages contribute no text?",
        "answer": "Use OCR and correct the recognition first. Packaging an image scan into HTML does not create usable document text."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Make extracted document text readable as a webpage."
      },
      {
        "question": "What should I check in the result?",
        "answer": "The output is text-based. Original page styling, images and interactive PDF features are not retained."
      }
    ],
    "hero": {
      "input": "PDF text",
      "output": "HTML draft"
    },
    "cta": "Open PDF to HTML →",
    "evidence": {
      "id": "html",
      "input": "/examples/verified-tools/html-input.pdf",
      "output": "/examples/verified-tools/html-result.html",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "Extracted content contains the source Alpha text.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      }
    }
  },
  {
    "slug": "how-to-create-an-epub-reading-copy-from-pdf-text",
    "title": "How to create an EPUB reading copy from PDF text",
    "category": "Convert",
    "tool": "pdf-to-epub",
    "toolId": "epub",
    "toolNumber": 46,
    "summary": "Reflow text for your e-reader. Learn the available controls, a practical example and what to check.",
    "intent": "How-to",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "PDF to EPUB",
      "How-to"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Use a PDF with readable text in a sensible reading order.",
      "Export the EPUB and inspect several chapters in an e-reader."
    ],
    "check": "Complex page layouts and illustrations are not preserved. Review columns and headings.",
    "limit": "Complex page layouts and illustrations are not preserved. Review columns and headings.",
    "sections": [
      {
        "heading": "What this tool actually does",
        "paragraphs": [
          "EPUB reflows text to the reader’s font size and screen. A fixed-layout PDF with charts or multiple columns is not automatically reconstructed as a polished ebook."
        ]
      },
      {
        "heading": "Choose the controls for your document",
        "paragraphs": [
          "Set Book title and Author where available. Test at small and large e-reader font sizes; keep the original PDF when illustrations are essential."
        ]
      },
      {
        "heading": "Before your first export",
        "paragraphs": [
          "For a reading copy, check chapter boundaries and reading order on the target e-reader. Reflow suits prose better than complex page layouts; keep the original PDF for diagrams or precise references."
        ]
      },
      {
        "heading": "Paragraphs appear in the wrong order",
        "paragraphs": [
          "Check the PDF text layer and column structure. Clean the extracted reading order before treating the ebook as a faithful source."
        ]
      }
    ],
    "tips": [
      "Set Book title and Author where available. Test at small and large e-reader font sizes; keep the original PDF when illustrations are essential.",
      "Check the PDF text layer and column structure. Clean the extracted reading order before treating the ebook as a faithful source.",
      "The conversion is text-based. Use an ebook authoring workflow for a designed illustrated publication."
    ],
    "faq": [
      {
        "question": "Paragraphs appear in the wrong order?",
        "answer": "Check the PDF text layer and column structure. Clean the extracted reading order before treating the ebook as a faithful source."
      },
      {
        "question": "Pictures or styling are absent?",
        "answer": "The conversion is text-based. Use an ebook authoring workflow for a designed illustrated publication."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Read extracted PDF text in a reflowable format."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Complex page layouts and illustrations are not preserved. Review columns and headings."
      }
    ],
    "hero": {
      "input": "Fixed PDF text",
      "output": "Reflowing EPUB"
    },
    "cta": "Open PDF to EPUB →",
    "evidence": {
      "id": "epub",
      "input": "/examples/verified-tools/epub-input.pdf",
      "output": "/examples/verified-tools/epub-result.epub",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "Output package contains its document content part.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      }
    }
  },
  {
    "slug": "create-a-reflowing-ebook-from-a-text-pdf",
    "title": "Create a reflowing ebook from a text PDF",
    "category": "Convert",
    "tool": "pdf-to-epub",
    "toolId": "epub",
    "toolNumber": 46,
    "summary": "A text-heavy reading document needs adjustable type in an e-reader.",
    "intent": "Practical example",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "PDF to EPUB",
      "Practical example"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Use a PDF with readable text in a sensible reading order.",
      "Export the EPUB and inspect several chapters in an e-reader."
    ],
    "check": "Complex page layouts and illustrations are not preserved. Review columns and headings.",
    "limit": "Complex page layouts and illustrations are not preserved. Review columns and headings.",
    "sections": [
      {
        "heading": "The document and the intended outcome",
        "paragraphs": [
          "A text-heavy reading document needs adjustable type in an e-reader. Export EPUB with a useful title and author, then check chapter text and reading order in the target app."
        ]
      },
      {
        "heading": "Make this example work for your file",
        "paragraphs": [
          "For a reading copy, check chapter boundaries and reading order on the target e-reader. Reflow suits prose better than complex page layouts; keep the original PDF for diagrams or precise references."
        ]
      },
      {
        "heading": "Choose only the settings this case needs",
        "paragraphs": [
          "Set Book title and Author where available. Test at small and large e-reader font sizes; keep the original PDF when illustrations are essential."
        ]
      },
      {
        "heading": "When the example needs a different approach",
        "paragraphs": [
          "The conversion is text-based. Use an ebook authoring workflow for a designed illustrated publication."
        ]
      }
    ],
    "tips": [
      "Set Book title and Author where available. Test at small and large e-reader font sizes; keep the original PDF when illustrations are essential.",
      "Check the PDF text layer and column structure. Clean the extracted reading order before treating the ebook as a faithful source.",
      "The conversion is text-based. Use an ebook authoring workflow for a designed illustrated publication."
    ],
    "faq": [
      {
        "question": "Paragraphs appear in the wrong order?",
        "answer": "Check the PDF text layer and column structure. Clean the extracted reading order before treating the ebook as a faithful source."
      },
      {
        "question": "Pictures or styling are absent?",
        "answer": "The conversion is text-based. Use an ebook authoring workflow for a designed illustrated publication."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Read extracted PDF text in a reflowable format."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Complex page layouts and illustrations are not preserved. Review columns and headings."
      }
    ],
    "hero": {
      "input": "Fixed PDF text",
      "output": "Reflowing EPUB"
    },
    "cta": "Open PDF to EPUB →",
    "evidence": {
      "id": "epub",
      "input": "/examples/verified-tools/epub-input.pdf",
      "output": "/examples/verified-tools/epub-result.epub",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "Output package contains its document content part.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      }
    }
  },
  {
    "slug": "pdf-to-epub-common-problems-and-how-to-fix-them",
    "title": "PDF to EPUB: common problems and how to fix them",
    "category": "Convert",
    "tool": "pdf-to-epub",
    "toolId": "epub",
    "toolNumber": 46,
    "summary": "Resolve paragraphs appear in the wrong order and pictures or styling are absent. Understand the limits before retrying.",
    "intent": "Troubleshooting",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "PDF to EPUB",
      "Troubleshooting"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Use a PDF with readable text in a sensible reading order.",
      "Export the EPUB and inspect several chapters in an e-reader."
    ],
    "check": "Complex page layouts and illustrations are not preserved. Review columns and headings.",
    "limit": "Complex page layouts and illustrations are not preserved. Review columns and headings.",
    "sections": [
      {
        "heading": "Paragraphs appear in the wrong order",
        "paragraphs": [
          "Check the PDF text layer and column structure. Clean the extracted reading order before treating the ebook as a faithful source."
        ]
      },
      {
        "heading": "Pictures or styling are absent",
        "paragraphs": [
          "The conversion is text-based. Use an ebook authoring workflow for a designed illustrated publication."
        ]
      },
      {
        "heading": "Check whether this is the right operation",
        "paragraphs": [
          "EPUB reflows text to the reader’s font size and screen. A fixed-layout PDF with charts or multiple columns is not automatically reconstructed as a polished ebook."
        ]
      },
      {
        "heading": "A more useful retry",
        "paragraphs": [
          "For a reading copy, check chapter boundaries and reading order on the target e-reader. Reflow suits prose better than complex page layouts; keep the original PDF for diagrams or precise references."
        ]
      }
    ],
    "tips": [
      "Set Book title and Author where available. Test at small and large e-reader font sizes; keep the original PDF when illustrations are essential.",
      "Check the PDF text layer and column structure. Clean the extracted reading order before treating the ebook as a faithful source.",
      "The conversion is text-based. Use an ebook authoring workflow for a designed illustrated publication."
    ],
    "faq": [
      {
        "question": "Paragraphs appear in the wrong order?",
        "answer": "Check the PDF text layer and column structure. Clean the extracted reading order before treating the ebook as a faithful source."
      },
      {
        "question": "Pictures or styling are absent?",
        "answer": "The conversion is text-based. Use an ebook authoring workflow for a designed illustrated publication."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Read extracted PDF text in a reflowable format."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Complex page layouts and illustrations are not preserved. Review columns and headings."
      }
    ],
    "hero": {
      "input": "Fixed PDF text",
      "output": "Reflowing EPUB"
    },
    "cta": "Open PDF to EPUB →",
    "evidence": {
      "id": "epub",
      "input": "/examples/verified-tools/epub-input.pdf",
      "output": "/examples/verified-tools/epub-result.epub",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "Output package contains its document content part.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      }
    }
  },
  {
    "slug": "how-to-export-pdf-pages-to-powerpoint-slides",
    "title": "How to export PDF pages to PowerPoint slides",
    "category": "Convert",
    "tool": "pdf-to-powerpoint",
    "toolId": "pptx",
    "toolNumber": 47,
    "summary": "Put each PDF page on a slide. Learn the available controls, a practical example and what to check.",
    "intent": "How-to",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "PDF to PowerPoint",
      "How-to"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Review the page order you want as slides.",
      "Export the PPTX and inspect slide dimensions and readability."
    ],
    "check": "Each page becomes an image. Original text and graphics are not separately editable on the slides.",
    "limit": "Slides are page images, not editable original text or graphics.",
    "sections": [
      {
        "heading": "What this tool actually does",
        "paragraphs": [
          "Each PDF page is represented by an image on a slide. The result is not a reconstruction of editable original text boxes, charts and vector graphics."
        ]
      },
      {
        "heading": "Choose the controls for your document",
        "paragraphs": [
          "Choose sources whose page shape suits the presentation screen. Check image sharpness and margins on a real slide-size display."
        ]
      },
      {
        "heading": "Before your first export",
        "paragraphs": [
          "For a presentation, check each slide on the actual screen or projector scale. A rendered PDF page can be legible as a document but too dense as a slide, and its content may not be editable as separate slide objects."
        ]
      },
      {
        "heading": "The slide text cannot be edited individually",
        "paragraphs": [
          "That is expected for page-image slides. Recreate the relevant text in PowerPoint if you need editable content."
        ]
      }
    ],
    "tips": [
      "Choose sources whose page shape suits the presentation screen. Check image sharpness and margins on a real slide-size display.",
      "That is expected for page-image slides. Recreate the relevant text in PowerPoint if you need editable content.",
      "Different aspect ratios leave spare space. Crop or redesign deliberately; avoid stretching text to fill the screen."
    ],
    "faq": [
      {
        "question": "The slide text cannot be edited individually?",
        "answer": "That is expected for page-image slides. Recreate the relevant text in PowerPoint if you need editable content."
      },
      {
        "question": "A portrait page looks small on a wide screen?",
        "answer": "Different aspect ratios leave spare space. Crop or redesign deliberately; avoid stretching text to fill the screen."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Present PDF pages as slides."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Each page becomes an image. Original text and graphics are not separately editable on the slides."
      }
    ],
    "hero": {
      "input": "PDF pages",
      "output": "Image slides"
    },
    "cta": "Open PDF to PowerPoint →"
  },
  {
    "slug": "place-pdf-pages-on-presentation-slides",
    "title": "Place PDF pages on presentation slides",
    "category": "Convert",
    "tool": "pdf-to-powerpoint",
    "toolId": "pptx",
    "toolNumber": 47,
    "summary": "A trainer needs a PDF handout projected as slides.",
    "intent": "Practical example",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "PDF to PowerPoint",
      "Practical example"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Review the page order you want as slides.",
      "Export the PPTX and inspect slide dimensions and readability."
    ],
    "check": "Each page becomes an image. Original text and graphics are not separately editable on the slides.",
    "limit": "Slides are page images, not editable original text or graphics.",
    "sections": [
      {
        "heading": "The document and the intended outcome",
        "paragraphs": [
          "A trainer needs a PDF handout projected as slides. Convert it to PowerPoint and inspect every page image in slideshow mode before presenting."
        ]
      },
      {
        "heading": "Make this example work for your file",
        "paragraphs": [
          "For a presentation, check each slide on the actual screen or projector scale. A rendered PDF page can be legible as a document but too dense as a slide, and its content may not be editable as separate slide objects."
        ]
      },
      {
        "heading": "Choose only the settings this case needs",
        "paragraphs": [
          "Choose sources whose page shape suits the presentation screen. Check image sharpness and margins on a real slide-size display."
        ]
      },
      {
        "heading": "When the example needs a different approach",
        "paragraphs": [
          "Different aspect ratios leave spare space. Crop or redesign deliberately; avoid stretching text to fill the screen."
        ]
      }
    ],
    "tips": [
      "Choose sources whose page shape suits the presentation screen. Check image sharpness and margins on a real slide-size display.",
      "That is expected for page-image slides. Recreate the relevant text in PowerPoint if you need editable content.",
      "Different aspect ratios leave spare space. Crop or redesign deliberately; avoid stretching text to fill the screen."
    ],
    "faq": [
      {
        "question": "The slide text cannot be edited individually?",
        "answer": "That is expected for page-image slides. Recreate the relevant text in PowerPoint if you need editable content."
      },
      {
        "question": "A portrait page looks small on a wide screen?",
        "answer": "Different aspect ratios leave spare space. Crop or redesign deliberately; avoid stretching text to fill the screen."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Present PDF pages as slides."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Each page becomes an image. Original text and graphics are not separately editable on the slides."
      }
    ],
    "hero": {
      "input": "PDF pages",
      "output": "Image slides"
    },
    "cta": "Open PDF to PowerPoint →"
  },
  {
    "slug": "pdf-to-powerpoint-common-problems-and-how-to-fix-them",
    "title": "PDF to PowerPoint: common problems and how to fix them",
    "category": "Convert",
    "tool": "pdf-to-powerpoint",
    "toolId": "pptx",
    "toolNumber": 47,
    "summary": "Resolve the slide text cannot be edited individually and a portrait page looks small on a wide screen. Understand the limits before retrying.",
    "intent": "Troubleshooting",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "PDF to PowerPoint",
      "Troubleshooting"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Review the page order you want as slides.",
      "Export the PPTX and inspect slide dimensions and readability."
    ],
    "check": "Each page becomes an image. Original text and graphics are not separately editable on the slides.",
    "limit": "Slides are page images, not editable original text or graphics.",
    "sections": [
      {
        "heading": "The slide text cannot be edited individually",
        "paragraphs": [
          "That is expected for page-image slides. Recreate the relevant text in PowerPoint if you need editable content."
        ]
      },
      {
        "heading": "A portrait page looks small on a wide screen",
        "paragraphs": [
          "Different aspect ratios leave spare space. Crop or redesign deliberately; avoid stretching text to fill the screen."
        ]
      },
      {
        "heading": "Check whether this is the right operation",
        "paragraphs": [
          "Each PDF page is represented by an image on a slide. The result is not a reconstruction of editable original text boxes, charts and vector graphics."
        ]
      },
      {
        "heading": "A more useful retry",
        "paragraphs": [
          "For a presentation, check each slide on the actual screen or projector scale. A rendered PDF page can be legible as a document but too dense as a slide, and its content may not be editable as separate slide objects."
        ]
      }
    ],
    "tips": [
      "Choose sources whose page shape suits the presentation screen. Check image sharpness and margins on a real slide-size display.",
      "That is expected for page-image slides. Recreate the relevant text in PowerPoint if you need editable content.",
      "Different aspect ratios leave spare space. Crop or redesign deliberately; avoid stretching text to fill the screen."
    ],
    "faq": [
      {
        "question": "The slide text cannot be edited individually?",
        "answer": "That is expected for page-image slides. Recreate the relevant text in PowerPoint if you need editable content."
      },
      {
        "question": "A portrait page looks small on a wide screen?",
        "answer": "Different aspect ratios leave spare space. Crop or redesign deliberately; avoid stretching text to fill the screen."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Present PDF pages as slides."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Each page becomes an image. Original text and graphics are not separately editable on the slides."
      }
    ],
    "hero": {
      "input": "PDF pages",
      "output": "Image slides"
    },
    "cta": "Open PDF to PowerPoint →"
  },
  {
    "slug": "review-extracted-pdf-rows-before-using-them-in-excel",
    "title": "Review extracted PDF rows before using them in Excel",
    "category": "Convert",
    "tool": "pdf-to-spreadsheet",
    "toolId": "xlsx",
    "toolNumber": 48,
    "summary": "A report has Item and Quantity columns that must become spreadsheet rows.",
    "intent": "Practical example",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "PDF to spreadsheet",
      "Practical example"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Use a PDF with selectable text rows; run OCR first for scans.",
      "Export the XLSX and check every column and numeric value."
    ],
    "check": "Extraction uses heuristics. It does not guarantee original tables, formulas or column alignment.",
    "limit": "Heuristic extraction. Review column alignment; scans need OCR first.",
    "sections": [
      {
        "heading": "The document and the intended outcome",
        "paragraphs": [
          "A report has Item and Quantity columns that must become spreadsheet rows. Extract XLSX, compare a small sample against the source and correct column alignment before calculations."
        ]
      },
      {
        "heading": "Make this example work for your file",
        "paragraphs": [
          "For a review spreadsheet, compare totals and decimal values with the original page. Do not apply formulas to extracted numbers until you have checked column alignment, separators and missing cells."
        ]
      },
      {
        "heading": "Choose only the settings this case needs",
        "paragraphs": [
          "Check headers, numeric columns, minus signs, decimal separators and wrapped descriptions. Validate totals using the source rather than assuming the extracted cells are authoritative."
        ]
      },
      {
        "heading": "When the example needs a different approach",
        "paragraphs": [
          "Run OCR first and review recognized characters. Even correct OCR words do not guarantee correct spreadsheet columns."
        ]
      }
    ],
    "tips": [
      "Check headers, numeric columns, minus signs, decimal separators and wrapped descriptions. Validate totals using the source rather than assuming the extracted cells are authoritative.",
      "Inspect spacing and wrapped lines in the original. Realign the rows manually or use a source spreadsheet if one is available.",
      "Run OCR first and review recognized characters. Even correct OCR words do not guarantee correct spreadsheet columns."
    ],
    "faq": [
      {
        "question": "A number lands in the wrong column?",
        "answer": "Inspect spacing and wrapped lines in the original. Realign the rows manually or use a source spreadsheet if one is available."
      },
      {
        "question": "A scan produces no useful rows?",
        "answer": "Run OCR first and review recognized characters. Even correct OCR words do not guarantee correct spreadsheet columns."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Move simple text rows into a spreadsheet."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Extraction uses heuristics. It does not guarantee original tables, formulas or column alignment."
      }
    ],
    "hero": {
      "input": "PDF rows",
      "output": "Reviewable XLSX"
    },
    "cta": "Open PDF to spreadsheet →",
    "evidence": {
      "id": "xlsx",
      "input": "/examples/verified-tools/xlsx-input.pdf",
      "output": "/examples/verified-tools/xlsx-result.xlsx",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "Output package contains its document content part.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      }
    }
  },
  {
    "slug": "pdf-to-spreadsheet-common-problems-and-how-to-fix-them",
    "title": "PDF to spreadsheet: common problems and how to fix them",
    "category": "Convert",
    "tool": "pdf-to-spreadsheet",
    "toolId": "xlsx",
    "toolNumber": 48,
    "summary": "Resolve a number lands in the wrong column and a scan produces no useful rows. Understand the limits before retrying.",
    "intent": "Troubleshooting",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "PDF to spreadsheet",
      "Troubleshooting"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Use a PDF with selectable text rows; run OCR first for scans.",
      "Export the XLSX and check every column and numeric value."
    ],
    "check": "Extraction uses heuristics. It does not guarantee original tables, formulas or column alignment.",
    "limit": "Heuristic extraction. Review column alignment; scans need OCR first.",
    "sections": [
      {
        "heading": "A number lands in the wrong column",
        "paragraphs": [
          "Inspect spacing and wrapped lines in the original. Realign the rows manually or use a source spreadsheet if one is available."
        ]
      },
      {
        "heading": "A scan produces no useful rows",
        "paragraphs": [
          "Run OCR first and review recognized characters. Even correct OCR words do not guarantee correct spreadsheet columns."
        ]
      },
      {
        "heading": "Check whether this is the right operation",
        "paragraphs": [
          "The extraction is heuristic text grouping. It does not recover the original spreadsheet, formulas, merged cells or table semantics from a PDF."
        ]
      },
      {
        "heading": "A more useful retry",
        "paragraphs": [
          "For a review spreadsheet, compare totals and decimal values with the original page. Do not apply formulas to extracted numbers until you have checked column alignment, separators and missing cells."
        ]
      }
    ],
    "tips": [
      "Check headers, numeric columns, minus signs, decimal separators and wrapped descriptions. Validate totals using the source rather than assuming the extracted cells are authoritative.",
      "Inspect spacing and wrapped lines in the original. Realign the rows manually or use a source spreadsheet if one is available.",
      "Run OCR first and review recognized characters. Even correct OCR words do not guarantee correct spreadsheet columns."
    ],
    "faq": [
      {
        "question": "A number lands in the wrong column?",
        "answer": "Inspect spacing and wrapped lines in the original. Realign the rows manually or use a source spreadsheet if one is available."
      },
      {
        "question": "A scan produces no useful rows?",
        "answer": "Run OCR first and review recognized characters. Even correct OCR words do not guarantee correct spreadsheet columns."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Move simple text rows into a spreadsheet."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Extraction uses heuristics. It does not guarantee original tables, formulas or column alignment."
      }
    ],
    "hero": {
      "input": "PDF rows",
      "output": "Reviewable XLSX"
    },
    "cta": "Open PDF to spreadsheet →",
    "evidence": {
      "id": "xlsx",
      "input": "/examples/verified-tools/xlsx-input.pdf",
      "output": "/examples/verified-tools/xlsx-result.xlsx",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "Output package contains its document content part.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      }
    }
  },
  {
    "slug": "how-to-extract-pdf-text-rows-into-csv",
    "title": "How to extract PDF text rows into CSV",
    "category": "Convert",
    "tool": "pdf-to-csv",
    "toolId": "csv",
    "toolNumber": 49,
    "summary": "Extract text rows into a CSV. Learn the available controls, a practical example and what to check.",
    "intent": "How-to",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "PDF to CSV",
      "How-to"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Use selectable PDF text with consistent rows.",
      "Export the CSV and check row and column separation."
    ],
    "check": "Review amounts, dates and delimiters. Original formulas and cell formatting are not available from PDF text.",
    "limit": "Review amounts, dates and delimiters. Original formulas and cell formatting are not available from PDF text.",
    "sections": [
      {
        "heading": "What this tool actually does",
        "paragraphs": [
          "CSV carries cell-like text values but no formulas, styles or exact PDF layout. The extraction can infer rows imperfectly, especially for multi-line descriptions."
        ]
      },
      {
        "heading": "Choose the controls for your document",
        "paragraphs": [
          "Review delimiters, headers and the destination system’s expected columns. Keep identifiers as text where leading zeros matter and check numeric formatting before import."
        ]
      },
      {
        "heading": "Before your first export",
        "paragraphs": [
          "For imported rows, choose the spreadsheet’s delimiter and encoding explicitly. Inspect identifiers with leading zeros; automatic number conversion can change a value even when extraction itself preserved the text."
        ]
      },
      {
        "heading": "Rows have different numbers of values",
        "paragraphs": [
          "Wrapped source text or uneven spacing can break grouping. Inspect the affected records and normalize the CSV before importing."
        ]
      }
    ],
    "tips": [
      "Review delimiters, headers and the destination system’s expected columns. Keep identifiers as text where leading zeros matter and check numeric formatting before import.",
      "Wrapped source text or uneven spacing can break grouping. Inspect the affected records and normalize the CSV before importing.",
      "Spreadsheet software may auto-convert values. Import with explicit column types and compare the raw CSV to distinguish extraction from application formatting."
    ],
    "faq": [
      {
        "question": "Rows have different numbers of values?",
        "answer": "Wrapped source text or uneven spacing can break grouping. Inspect the affected records and normalize the CSV before importing."
      },
      {
        "question": "Dates change when opened in a spreadsheet?",
        "answer": "Spreadsheet software may auto-convert values. Import with explicit column types and compare the raw CSV to distinguish extraction from application formatting."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Import extracted rows into a spreadsheet or another data tool."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Review amounts, dates and delimiters. Original formulas and cell formatting are not available from PDF text."
      }
    ],
    "hero": {
      "input": "PDF text rows",
      "output": "CSV draft"
    },
    "cta": "Open PDF to CSV →",
    "evidence": {
      "id": "csv",
      "input": "/examples/verified-tools/csv-input.pdf",
      "output": "/examples/verified-tools/csv-result.csv",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "Extracted content contains the source Alpha text.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      }
    }
  },
  {
    "slug": "export-pdf-text-rows-for-a-csv-import",
    "title": "Export PDF text rows for a CSV import",
    "category": "Convert",
    "tool": "pdf-to-csv",
    "toolId": "csv",
    "toolNumber": 49,
    "summary": "A small text table needs a CSV draft for an import process.",
    "intent": "Practical example",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "PDF to CSV",
      "Practical example"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Use selectable PDF text with consistent rows.",
      "Export the CSV and check row and column separation."
    ],
    "check": "Review amounts, dates and delimiters. Original formulas and cell formatting are not available from PDF text.",
    "limit": "Review amounts, dates and delimiters. Original formulas and cell formatting are not available from PDF text.",
    "sections": [
      {
        "heading": "The document and the intended outcome",
        "paragraphs": [
          "A small text table needs a CSV draft for an import process. Extract it, open it as text and in a spreadsheet, and compare the same records with the PDF."
        ]
      },
      {
        "heading": "Make this example work for your file",
        "paragraphs": [
          "For imported rows, choose the spreadsheet’s delimiter and encoding explicitly. Inspect identifiers with leading zeros; automatic number conversion can change a value even when extraction itself preserved the text."
        ]
      },
      {
        "heading": "Choose only the settings this case needs",
        "paragraphs": [
          "Review delimiters, headers and the destination system’s expected columns. Keep identifiers as text where leading zeros matter and check numeric formatting before import."
        ]
      },
      {
        "heading": "When the example needs a different approach",
        "paragraphs": [
          "Spreadsheet software may auto-convert values. Import with explicit column types and compare the raw CSV to distinguish extraction from application formatting."
        ]
      }
    ],
    "tips": [
      "Review delimiters, headers and the destination system’s expected columns. Keep identifiers as text where leading zeros matter and check numeric formatting before import.",
      "Wrapped source text or uneven spacing can break grouping. Inspect the affected records and normalize the CSV before importing.",
      "Spreadsheet software may auto-convert values. Import with explicit column types and compare the raw CSV to distinguish extraction from application formatting."
    ],
    "faq": [
      {
        "question": "Rows have different numbers of values?",
        "answer": "Wrapped source text or uneven spacing can break grouping. Inspect the affected records and normalize the CSV before importing."
      },
      {
        "question": "Dates change when opened in a spreadsheet?",
        "answer": "Spreadsheet software may auto-convert values. Import with explicit column types and compare the raw CSV to distinguish extraction from application formatting."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Import extracted rows into a spreadsheet or another data tool."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Review amounts, dates and delimiters. Original formulas and cell formatting are not available from PDF text."
      }
    ],
    "hero": {
      "input": "PDF text rows",
      "output": "CSV draft"
    },
    "cta": "Open PDF to CSV →",
    "evidence": {
      "id": "csv",
      "input": "/examples/verified-tools/csv-input.pdf",
      "output": "/examples/verified-tools/csv-result.csv",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "Extracted content contains the source Alpha text.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      }
    }
  },
  {
    "slug": "pdf-to-csv-common-problems-and-how-to-fix-them",
    "title": "PDF to CSV: common problems and how to fix them",
    "category": "Convert",
    "tool": "pdf-to-csv",
    "toolId": "csv",
    "toolNumber": 49,
    "summary": "Resolve rows have different numbers of values and dates change when opened in a spreadsheet. Understand the limits before retrying.",
    "intent": "Troubleshooting",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "PDF to CSV",
      "Troubleshooting"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Use selectable PDF text with consistent rows.",
      "Export the CSV and check row and column separation."
    ],
    "check": "Review amounts, dates and delimiters. Original formulas and cell formatting are not available from PDF text.",
    "limit": "Review amounts, dates and delimiters. Original formulas and cell formatting are not available from PDF text.",
    "sections": [
      {
        "heading": "Rows have different numbers of values",
        "paragraphs": [
          "Wrapped source text or uneven spacing can break grouping. Inspect the affected records and normalize the CSV before importing."
        ]
      },
      {
        "heading": "Dates change when opened in a spreadsheet",
        "paragraphs": [
          "Spreadsheet software may auto-convert values. Import with explicit column types and compare the raw CSV to distinguish extraction from application formatting."
        ]
      },
      {
        "heading": "Check whether this is the right operation",
        "paragraphs": [
          "CSV carries cell-like text values but no formulas, styles or exact PDF layout. The extraction can infer rows imperfectly, especially for multi-line descriptions."
        ]
      },
      {
        "heading": "A more useful retry",
        "paragraphs": [
          "For imported rows, choose the spreadsheet’s delimiter and encoding explicitly. Inspect identifiers with leading zeros; automatic number conversion can change a value even when extraction itself preserved the text."
        ]
      }
    ],
    "tips": [
      "Review delimiters, headers and the destination system’s expected columns. Keep identifiers as text where leading zeros matter and check numeric formatting before import.",
      "Wrapped source text or uneven spacing can break grouping. Inspect the affected records and normalize the CSV before importing.",
      "Spreadsheet software may auto-convert values. Import with explicit column types and compare the raw CSV to distinguish extraction from application formatting."
    ],
    "faq": [
      {
        "question": "Rows have different numbers of values?",
        "answer": "Wrapped source text or uneven spacing can break grouping. Inspect the affected records and normalize the CSV before importing."
      },
      {
        "question": "Dates change when opened in a spreadsheet?",
        "answer": "Spreadsheet software may auto-convert values. Import with explicit column types and compare the raw CSV to distinguish extraction from application formatting."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Import extracted rows into a spreadsheet or another data tool."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Review amounts, dates and delimiters. Original formulas and cell formatting are not available from PDF text."
      }
    ],
    "hero": {
      "input": "PDF text rows",
      "output": "CSV draft"
    },
    "cta": "Open PDF to CSV →",
    "evidence": {
      "id": "csv",
      "input": "/examples/verified-tools/csv-input.pdf",
      "output": "/examples/verified-tools/csv-result.csv",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "Extracted content contains the source Alpha text.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      }
    }
  },
  {
    "slug": "how-to-create-a-pdf-from-plain-text",
    "title": "How to create a PDF from plain text",
    "category": "Convert",
    "tool": "create-pdf",
    "toolId": "create",
    "toolNumber": 50,
    "summary": "Turn typed text or a text file into a PDF. Learn the available controls, a practical example and what to check.",
    "intent": "How-to",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Text to PDF",
      "How-to"
    ],
    "steps": [
      "Enter the content for your new document.",
      "Write the text for your new document in the editor.",
      "Create the PDF and inspect line wrapping and page breaks."
    ],
    "check": "This creates a text document, not a full desktop publishing layout. Keep a copy of the source text.",
    "limit": "This creates a text document, not a full desktop publishing layout. Keep a copy of the source text.",
    "sections": [
      {
        "heading": "What this tool actually does",
        "paragraphs": [
          "Text to PDF lays out a new document. It does not recreate source tables, images or rich formatting simply because the words were pasted from another application."
        ]
      },
      {
        "heading": "Choose the controls for your document",
        "paragraphs": [
          "Use supported Unicode text and a sensible type size. Review unusual characters and long lines before export; the local font may not support every writing system."
        ]
      },
      {
        "heading": "Before your first export",
        "paragraphs": [
          "For a plain-text letter, preview the final page break and the signature space. Text-to-PDF wraps paragraphs; it does not understand where a letter’s closing should appear or reproduce rich document formatting."
        ]
      },
      {
        "heading": "A character is rejected",
        "paragraphs": [
          "The selected font may not contain that glyph. Use a supported character or a document-authoring workflow with the required script support."
        ]
      }
    ],
    "tips": [
      "Use supported Unicode text and a sensible type size. Review unusual characters and long lines before export; the local font may not support every writing system.",
      "The selected font may not contain that glyph. Use a supported character or a document-authoring workflow with the required script support.",
      "Long text wraps to the sheet width. Add deliberate paragraphs and inspect the final page rather than judging only the input field."
    ],
    "faq": [
      {
        "question": "A character is rejected?",
        "answer": "The selected font may not contain that glyph. Use a supported character or a document-authoring workflow with the required script support."
      },
      {
        "question": "Line breaks are surprising?",
        "answer": "Long text wraps to the sheet width. Add deliberate paragraphs and inspect the final page rather than judging only the input field."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Produce a simple PDF from written text."
      },
      {
        "question": "What should I check in the result?",
        "answer": "This creates a text document, not a full desktop publishing layout. Keep a copy of the source text."
      }
    ],
    "hero": {
      "input": "Plain text",
      "output": "New PDF"
    },
    "cta": "Open Text to PDF →"
  },
  {
    "slug": "turn-a-plain-text-letter-into-a-readable-pdf",
    "title": "Turn a plain-text letter into a readable PDF",
    "category": "Convert",
    "tool": "create-pdf",
    "toolId": "create",
    "toolNumber": 50,
    "summary": "A letter exists as typed notes or a UTF-8 text file.",
    "intent": "Practical example",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Text to PDF",
      "Practical example"
    ],
    "steps": [
      "Enter the content for your new document.",
      "Write the text for your new document in the editor.",
      "Create the PDF and inspect line wrapping and page breaks."
    ],
    "check": "This creates a text document, not a full desktop publishing layout. Keep a copy of the source text.",
    "limit": "This creates a text document, not a full desktop publishing layout. Keep a copy of the source text.",
    "sections": [
      {
        "heading": "The document and the intended outcome",
        "paragraphs": [
          "A letter exists as typed notes or a UTF-8 text file. Review its wording, choose A4 or US Letter and font size, then inspect wrapping and page breaks in the generated PDF."
        ]
      },
      {
        "heading": "Make this example work for your file",
        "paragraphs": [
          "For a plain-text letter, preview the final page break and the signature space. Text-to-PDF wraps paragraphs; it does not understand where a letter’s closing should appear or reproduce rich document formatting."
        ]
      },
      {
        "heading": "Choose only the settings this case needs",
        "paragraphs": [
          "Use supported Unicode text and a sensible type size. Review unusual characters and long lines before export; the local font may not support every writing system."
        ]
      },
      {
        "heading": "When the example needs a different approach",
        "paragraphs": [
          "Long text wraps to the sheet width. Add deliberate paragraphs and inspect the final page rather than judging only the input field."
        ]
      }
    ],
    "tips": [
      "Use supported Unicode text and a sensible type size. Review unusual characters and long lines before export; the local font may not support every writing system.",
      "The selected font may not contain that glyph. Use a supported character or a document-authoring workflow with the required script support.",
      "Long text wraps to the sheet width. Add deliberate paragraphs and inspect the final page rather than judging only the input field."
    ],
    "faq": [
      {
        "question": "A character is rejected?",
        "answer": "The selected font may not contain that glyph. Use a supported character or a document-authoring workflow with the required script support."
      },
      {
        "question": "Line breaks are surprising?",
        "answer": "Long text wraps to the sheet width. Add deliberate paragraphs and inspect the final page rather than judging only the input field."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Produce a simple PDF from written text."
      },
      {
        "question": "What should I check in the result?",
        "answer": "This creates a text document, not a full desktop publishing layout. Keep a copy of the source text."
      }
    ],
    "hero": {
      "input": "Plain text",
      "output": "New PDF"
    },
    "cta": "Open Text to PDF →"
  },
  {
    "slug": "text-to-pdf-common-problems-and-how-to-fix-them",
    "title": "Text to PDF: common problems and how to fix them",
    "category": "Convert",
    "tool": "create-pdf",
    "toolId": "create",
    "toolNumber": 50,
    "summary": "Resolve a character is rejected and line breaks are surprising. Understand the limits before retrying.",
    "intent": "Troubleshooting",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Text to PDF",
      "Troubleshooting"
    ],
    "steps": [
      "Enter the content for your new document.",
      "Write the text for your new document in the editor.",
      "Create the PDF and inspect line wrapping and page breaks."
    ],
    "check": "This creates a text document, not a full desktop publishing layout. Keep a copy of the source text.",
    "limit": "This creates a text document, not a full desktop publishing layout. Keep a copy of the source text.",
    "sections": [
      {
        "heading": "A character is rejected",
        "paragraphs": [
          "The selected font may not contain that glyph. Use a supported character or a document-authoring workflow with the required script support."
        ]
      },
      {
        "heading": "Line breaks are surprising",
        "paragraphs": [
          "Long text wraps to the sheet width. Add deliberate paragraphs and inspect the final page rather than judging only the input field."
        ]
      },
      {
        "heading": "Check whether this is the right operation",
        "paragraphs": [
          "Text to PDF lays out a new document. It does not recreate source tables, images or rich formatting simply because the words were pasted from another application."
        ]
      },
      {
        "heading": "A more useful retry",
        "paragraphs": [
          "For a plain-text letter, preview the final page break and the signature space. Text-to-PDF wraps paragraphs; it does not understand where a letter’s closing should appear or reproduce rich document formatting."
        ]
      }
    ],
    "tips": [
      "Use supported Unicode text and a sensible type size. Review unusual characters and long lines before export; the local font may not support every writing system.",
      "The selected font may not contain that glyph. Use a supported character or a document-authoring workflow with the required script support.",
      "Long text wraps to the sheet width. Add deliberate paragraphs and inspect the final page rather than judging only the input field."
    ],
    "faq": [
      {
        "question": "A character is rejected?",
        "answer": "The selected font may not contain that glyph. Use a supported character or a document-authoring workflow with the required script support."
      },
      {
        "question": "Line breaks are surprising?",
        "answer": "Long text wraps to the sheet width. Add deliberate paragraphs and inspect the final page rather than judging only the input field."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Produce a simple PDF from written text."
      },
      {
        "question": "What should I check in the result?",
        "answer": "This creates a text document, not a full desktop publishing layout. Keep a copy of the source text."
      }
    ],
    "hero": {
      "input": "Plain text",
      "output": "New PDF"
    },
    "cta": "Open Text to PDF →"
  },
  {
    "slug": "how-to-create-a-pdf-from-markdown-notes",
    "title": "How to create a PDF from Markdown notes",
    "category": "Convert",
    "tool": "markdown-to-pdf",
    "toolId": "markdown",
    "toolNumber": 51,
    "summary": "Headings, lists and readable text. Learn the available controls, a practical example and what to check.",
    "intent": "How-to",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Markdown to PDF",
      "How-to"
    ],
    "steps": [
      "Enter the content for your new document.",
      "Enter Markdown text using supported headings and lists.",
      "Export and inspect the rendered headings and page breaks."
    ],
    "check": "Complex tables and embedded images are unsupported. Review the result instead of assuming every Markdown extension works.",
    "limit": "Basic Markdown formatting; complex tables and embedded images are not supported.",
    "sections": [
      {
        "heading": "What this tool actually does",
        "paragraphs": [
          "Basic Markdown formatting is supported, but this is not a complete browser or publishing engine. Complex tables, embedded images and advanced extensions need a different workflow."
        ]
      },
      {
        "heading": "Choose the controls for your document",
        "paragraphs": [
          "Start with a small heading-and-list example. Keep the syntax simple and check whether emphasis and list items remain readable after conversion."
        ]
      },
      {
        "heading": "Before your first export",
        "paragraphs": [
          "For structured notes, keep headings short and check lists in the output. Use the supported Markdown features deliberately; a syntax accepted by another Markdown renderer may not have the same layout here."
        ]
      },
      {
        "heading": "A complex table is not reproduced",
        "paragraphs": [
          "Simplify it to labelled text or use a source document tool that supports the table layout. Do not disguise missing cells as a successful conversion."
        ]
      }
    ],
    "tips": [
      "Start with a small heading-and-list example. Keep the syntax simple and check whether emphasis and list items remain readable after conversion.",
      "Simplify it to labelled text or use a source document tool that supports the table layout. Do not disguise missing cells as a successful conversion.",
      "Check the supported Markdown subset and remove unsupported extensions. Verify the actual generated page before sharing."
    ],
    "faq": [
      {
        "question": "A complex table is not reproduced?",
        "answer": "Simplify it to labelled text or use a source document tool that supports the table layout. Do not disguise missing cells as a successful conversion."
      },
      {
        "question": "Syntax appears unexpectedly in the output?",
        "answer": "Check the supported Markdown subset and remove unsupported extensions. Verify the actual generated page before sharing."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Convert simple structured notes to a readable PDF."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Complex tables and embedded images are unsupported. Review the result instead of assuming every Markdown extension works."
      }
    ],
    "hero": {
      "input": "Markdown notes",
      "output": "Formatted PDF"
    },
    "cta": "Open Markdown to PDF →"
  },
  {
    "slug": "create-a-simple-formatted-pdf-from-markdown-notes",
    "title": "Create a simple formatted PDF from Markdown notes",
    "category": "Convert",
    "tool": "markdown-to-pdf",
    "toolId": "markdown",
    "toolNumber": 51,
    "summary": "A set of notes uses headings, bold emphasis and a short list.",
    "intent": "Practical example",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Markdown to PDF",
      "Practical example"
    ],
    "steps": [
      "Enter the content for your new document.",
      "Enter Markdown text using supported headings and lists.",
      "Export and inspect the rendered headings and page breaks."
    ],
    "check": "Complex tables and embedded images are unsupported. Review the result instead of assuming every Markdown extension works.",
    "limit": "Basic Markdown formatting; complex tables and embedded images are not supported.",
    "sections": [
      {
        "heading": "The document and the intended outcome",
        "paragraphs": [
          "A set of notes uses headings, bold emphasis and a short list. Import Markdown, generate the PDF and compare hierarchy and wrapping with the intended reading order."
        ]
      },
      {
        "heading": "Make this example work for your file",
        "paragraphs": [
          "For structured notes, keep headings short and check lists in the output. Use the supported Markdown features deliberately; a syntax accepted by another Markdown renderer may not have the same layout here."
        ]
      },
      {
        "heading": "Choose only the settings this case needs",
        "paragraphs": [
          "Start with a small heading-and-list example. Keep the syntax simple and check whether emphasis and list items remain readable after conversion."
        ]
      },
      {
        "heading": "When the example needs a different approach",
        "paragraphs": [
          "Check the supported Markdown subset and remove unsupported extensions. Verify the actual generated page before sharing."
        ]
      }
    ],
    "tips": [
      "Start with a small heading-and-list example. Keep the syntax simple and check whether emphasis and list items remain readable after conversion.",
      "Simplify it to labelled text or use a source document tool that supports the table layout. Do not disguise missing cells as a successful conversion.",
      "Check the supported Markdown subset and remove unsupported extensions. Verify the actual generated page before sharing."
    ],
    "faq": [
      {
        "question": "A complex table is not reproduced?",
        "answer": "Simplify it to labelled text or use a source document tool that supports the table layout. Do not disguise missing cells as a successful conversion."
      },
      {
        "question": "Syntax appears unexpectedly in the output?",
        "answer": "Check the supported Markdown subset and remove unsupported extensions. Verify the actual generated page before sharing."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Convert simple structured notes to a readable PDF."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Complex tables and embedded images are unsupported. Review the result instead of assuming every Markdown extension works."
      }
    ],
    "hero": {
      "input": "Markdown notes",
      "output": "Formatted PDF"
    },
    "cta": "Open Markdown to PDF →"
  },
  {
    "slug": "markdown-to-pdf-common-problems-and-how-to-fix-them",
    "title": "Markdown to PDF: common problems and how to fix them",
    "category": "Convert",
    "tool": "markdown-to-pdf",
    "toolId": "markdown",
    "toolNumber": 51,
    "summary": "Resolve a complex table is not reproduced and syntax appears unexpectedly in the output. Understand the limits before retrying.",
    "intent": "Troubleshooting",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Markdown to PDF",
      "Troubleshooting"
    ],
    "steps": [
      "Enter the content for your new document.",
      "Enter Markdown text using supported headings and lists.",
      "Export and inspect the rendered headings and page breaks."
    ],
    "check": "Complex tables and embedded images are unsupported. Review the result instead of assuming every Markdown extension works.",
    "limit": "Basic Markdown formatting; complex tables and embedded images are not supported.",
    "sections": [
      {
        "heading": "A complex table is not reproduced",
        "paragraphs": [
          "Simplify it to labelled text or use a source document tool that supports the table layout. Do not disguise missing cells as a successful conversion."
        ]
      },
      {
        "heading": "Syntax appears unexpectedly in the output",
        "paragraphs": [
          "Check the supported Markdown subset and remove unsupported extensions. Verify the actual generated page before sharing."
        ]
      },
      {
        "heading": "Check whether this is the right operation",
        "paragraphs": [
          "Basic Markdown formatting is supported, but this is not a complete browser or publishing engine. Complex tables, embedded images and advanced extensions need a different workflow."
        ]
      },
      {
        "heading": "A more useful retry",
        "paragraphs": [
          "For structured notes, keep headings short and check lists in the output. Use the supported Markdown features deliberately; a syntax accepted by another Markdown renderer may not have the same layout here."
        ]
      }
    ],
    "tips": [
      "Start with a small heading-and-list example. Keep the syntax simple and check whether emphasis and list items remain readable after conversion.",
      "Simplify it to labelled text or use a source document tool that supports the table layout. Do not disguise missing cells as a successful conversion.",
      "Check the supported Markdown subset and remove unsupported extensions. Verify the actual generated page before sharing."
    ],
    "faq": [
      {
        "question": "A complex table is not reproduced?",
        "answer": "Simplify it to labelled text or use a source document tool that supports the table layout. Do not disguise missing cells as a successful conversion."
      },
      {
        "question": "Syntax appears unexpectedly in the output?",
        "answer": "Check the supported Markdown subset and remove unsupported extensions. Verify the actual generated page before sharing."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Convert simple structured notes to a readable PDF."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Complex tables and embedded images are unsupported. Review the result instead of assuming every Markdown extension works."
      }
    ],
    "hero": {
      "input": "Markdown notes",
      "output": "Formatted PDF"
    },
    "cta": "Open Markdown to PDF →"
  },
  {
    "slug": "how-to-convert-word-document-text-into-a-pdf",
    "title": "How to convert Word document text into a PDF",
    "category": "Convert",
    "tool": "word-to-pdf",
    "toolId": "docx",
    "toolNumber": 52,
    "summary": "Convert DOCX text into a PDF. Learn the available controls, a practical example and what to check.",
    "intent": "How-to",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Word to PDF",
      "How-to"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Choose a DOCX file containing the text you want to convert.",
      "Export and inspect paragraph order and page breaks."
    ],
    "check": "Text is reflowed. Original layout, images and complex styling are not preserved; legacy DOC files are unsupported.",
    "limit": "Reflows text; original Word layout, images and styling are not preserved. Legacy .doc is not supported.",
    "sections": [
      {
        "heading": "What this tool actually does",
        "paragraphs": [
          "Word to PDF here reflows document text. It does not preserve Word’s full layout engine, embedded images, complex styling or legacy .doc files."
        ]
      },
      {
        "heading": "Choose the controls for your document",
        "paragraphs": [
          "Use .docx and choose a simple text source. Export directly from Word or another compatible editor when exact page breaks, tables or images are essential."
        ]
      },
      {
        "heading": "Before your first export",
        "paragraphs": [
          "For a text-only reading copy, compare the extracted beginning and ending with the Word original. Important information stored in unsupported document elements may need a different conversion workflow."
        ]
      },
      {
        "heading": "The source layout changes",
        "paragraphs": [
          "Reflow changes pages and line breaks. This is a text reading copy, not a print-faithful rendering of the original Word design."
        ]
      }
    ],
    "tips": [
      "Use .docx and choose a simple text source. Export directly from Word or another compatible editor when exact page breaks, tables or images are essential.",
      "Reflow changes pages and line breaks. This is a text reading copy, not a print-faithful rendering of the original Word design.",
      "Legacy binary Word files are not supported. Save a DOCX from a suitable editor or export PDF there."
    ],
    "faq": [
      {
        "question": "The source layout changes?",
        "answer": "Reflow changes pages and line breaks. This is a text reading copy, not a print-faithful rendering of the original Word design."
      },
      {
        "question": "A .doc file is rejected?",
        "answer": "Legacy binary Word files are not supported. Save a DOCX from a suitable editor or export PDF there."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Create a PDF from Word document text."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Text is reflowed. Original layout, images and complex styling are not preserved; legacy DOC files are unsupported."
      }
    ],
    "hero": {
      "input": "DOCX text",
      "output": "Reflowed PDF"
    },
    "cta": "Open Word to PDF →"
  },
  {
    "slug": "make-a-pdf-reading-copy-from-a-simple-word-draft",
    "title": "Make a PDF reading copy from a simple Word draft",
    "category": "Convert",
    "tool": "word-to-pdf",
    "toolId": "docx",
    "toolNumber": 52,
    "summary": "A DOCX contains short headings and paragraphs without critical visual layout.",
    "intent": "Practical example",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Word to PDF",
      "Practical example"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Choose a DOCX file containing the text you want to convert.",
      "Export and inspect paragraph order and page breaks."
    ],
    "check": "Text is reflowed. Original layout, images and complex styling are not preserved; legacy DOC files are unsupported.",
    "limit": "Reflows text; original Word layout, images and styling are not preserved. Legacy .doc is not supported.",
    "sections": [
      {
        "heading": "The document and the intended outcome",
        "paragraphs": [
          "A DOCX contains short headings and paragraphs without critical visual layout. Convert it, then compare wording and paragraph order with the source document."
        ]
      },
      {
        "heading": "Make this example work for your file",
        "paragraphs": [
          "For a text-only reading copy, compare the extracted beginning and ending with the Word original. Important information stored in unsupported document elements may need a different conversion workflow."
        ]
      },
      {
        "heading": "Choose only the settings this case needs",
        "paragraphs": [
          "Use .docx and choose a simple text source. Export directly from Word or another compatible editor when exact page breaks, tables or images are essential."
        ]
      },
      {
        "heading": "When the example needs a different approach",
        "paragraphs": [
          "Legacy binary Word files are not supported. Save a DOCX from a suitable editor or export PDF there."
        ]
      }
    ],
    "tips": [
      "Use .docx and choose a simple text source. Export directly from Word or another compatible editor when exact page breaks, tables or images are essential.",
      "Reflow changes pages and line breaks. This is a text reading copy, not a print-faithful rendering of the original Word design.",
      "Legacy binary Word files are not supported. Save a DOCX from a suitable editor or export PDF there."
    ],
    "faq": [
      {
        "question": "The source layout changes?",
        "answer": "Reflow changes pages and line breaks. This is a text reading copy, not a print-faithful rendering of the original Word design."
      },
      {
        "question": "A .doc file is rejected?",
        "answer": "Legacy binary Word files are not supported. Save a DOCX from a suitable editor or export PDF there."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Create a PDF from Word document text."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Text is reflowed. Original layout, images and complex styling are not preserved; legacy DOC files are unsupported."
      }
    ],
    "hero": {
      "input": "DOCX text",
      "output": "Reflowed PDF"
    },
    "cta": "Open Word to PDF →"
  },
  {
    "slug": "word-to-pdf-common-problems-and-how-to-fix-them",
    "title": "Word to PDF: common problems and how to fix them",
    "category": "Convert",
    "tool": "word-to-pdf",
    "toolId": "docx",
    "toolNumber": 52,
    "summary": "Resolve the source layout changes and a .doc file is rejected. Understand the limits before retrying.",
    "intent": "Troubleshooting",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Word to PDF",
      "Troubleshooting"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Choose a DOCX file containing the text you want to convert.",
      "Export and inspect paragraph order and page breaks."
    ],
    "check": "Text is reflowed. Original layout, images and complex styling are not preserved; legacy DOC files are unsupported.",
    "limit": "Reflows text; original Word layout, images and styling are not preserved. Legacy .doc is not supported.",
    "sections": [
      {
        "heading": "The source layout changes",
        "paragraphs": [
          "Reflow changes pages and line breaks. This is a text reading copy, not a print-faithful rendering of the original Word design."
        ]
      },
      {
        "heading": "A .doc file is rejected",
        "paragraphs": [
          "Legacy binary Word files are not supported. Save a DOCX from a suitable editor or export PDF there."
        ]
      },
      {
        "heading": "Check whether this is the right operation",
        "paragraphs": [
          "Word to PDF here reflows document text. It does not preserve Word’s full layout engine, embedded images, complex styling or legacy .doc files."
        ]
      },
      {
        "heading": "A more useful retry",
        "paragraphs": [
          "For a text-only reading copy, compare the extracted beginning and ending with the Word original. Important information stored in unsupported document elements may need a different conversion workflow."
        ]
      }
    ],
    "tips": [
      "Use .docx and choose a simple text source. Export directly from Word or another compatible editor when exact page breaks, tables or images are essential.",
      "Reflow changes pages and line breaks. This is a text reading copy, not a print-faithful rendering of the original Word design.",
      "Legacy binary Word files are not supported. Save a DOCX from a suitable editor or export PDF there."
    ],
    "faq": [
      {
        "question": "The source layout changes?",
        "answer": "Reflow changes pages and line breaks. This is a text reading copy, not a print-faithful rendering of the original Word design."
      },
      {
        "question": "A .doc file is rejected?",
        "answer": "Legacy binary Word files are not supported. Save a DOCX from a suitable editor or export PDF there."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Create a PDF from Word document text."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Text is reflowed. Original layout, images and complex styling are not preserved; legacy DOC files are unsupported."
      }
    ],
    "hero": {
      "input": "DOCX text",
      "output": "Reflowed PDF"
    },
    "cta": "Open Word to PDF →"
  },
  {
    "slug": "how-to-convert-spreadsheet-text-into-a-pdf",
    "title": "How to convert spreadsheet text into a PDF",
    "category": "Convert",
    "tool": "spreadsheet-to-pdf",
    "toolId": "sheet",
    "toolNumber": 53,
    "summary": "Print spreadsheet rows to a PDF. Learn the available controls, a practical example and what to check.",
    "intent": "How-to",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Spreadsheet to PDF",
      "How-to"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Choose an XLSX, XLS or CSV input and check which sheet contains your data.",
      "Export and inspect the printed text rows."
    ],
    "check": "Only the first sheet is converted. Charts, complex styling and original print layout are not preserved.",
    "limit": "Text-based conversion of the first sheet. Complex styling and charts are not preserved.",
    "sections": [
      {
        "heading": "What this tool actually does",
        "paragraphs": [
          "Spreadsheet to PDF is text-based and uses the first sheet. It does not faithfully print charts, complex cell styling or a workbook’s entire multi-sheet design."
        ]
      },
      {
        "heading": "Choose the controls for your document",
        "paragraphs": [
          "Put the intended data on the first sheet in a copy. Use short column headings and inspect long values that may wrap; retain the workbook for formulas and further editing."
        ]
      },
      {
        "heading": "Before your first export",
        "paragraphs": [
          "For a simple data listing, move the intended source sheet into the first position in your spreadsheet editor before conversion. Inspect headings and long rows. A text rendering is different from a spreadsheet’s print layout with charts and formulas."
        ]
      },
      {
        "heading": "The wrong sheet appears",
        "paragraphs": [
          "Check which sheet is first in the workbook copy. This operation does not infer the active business worksheet."
        ]
      }
    ],
    "tips": [
      "Put the intended data on the first sheet in a copy. Use short column headings and inspect long values that may wrap; retain the workbook for formulas and further editing.",
      "Check which sheet is first in the workbook copy. This operation does not infer the active business worksheet.",
      "Use the spreadsheet application’s own PDF export when those visual features are required. A row-based PDF is suitable for simpler reading copies."
    ],
    "faq": [
      {
        "question": "The wrong sheet appears?",
        "answer": "Check which sheet is first in the workbook copy. This operation does not infer the active business worksheet."
      },
      {
        "question": "Charts and formatting disappear?",
        "answer": "Use the spreadsheet application’s own PDF export when those visual features are required. A row-based PDF is suitable for simpler reading copies."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Create a simple PDF view of spreadsheet rows."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Only the first sheet is converted. Charts, complex styling and original print layout are not preserved."
      }
    ],
    "hero": {
      "input": "First-sheet rows",
      "output": "Text PDF"
    },
    "cta": "Open Spreadsheet to PDF →"
  },
  {
    "slug": "create-a-pdf-reading-copy-of-a-small-first-sheet-table",
    "title": "Create a PDF reading copy of a small first-sheet table",
    "category": "Convert",
    "tool": "spreadsheet-to-pdf",
    "toolId": "sheet",
    "toolNumber": 53,
    "summary": "A workbook’s first sheet lists Item and Quantity.",
    "intent": "Practical example",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Spreadsheet to PDF",
      "Practical example"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Choose an XLSX, XLS or CSV input and check which sheet contains your data.",
      "Export and inspect the printed text rows."
    ],
    "check": "Only the first sheet is converted. Charts, complex styling and original print layout are not preserved.",
    "limit": "Text-based conversion of the first sheet. Complex styling and charts are not preserved.",
    "sections": [
      {
        "heading": "The document and the intended outcome",
        "paragraphs": [
          "A workbook’s first sheet lists Item and Quantity. Convert its rows, then compare headers, row count and values with the source workbook before sharing."
        ]
      },
      {
        "heading": "Make this example work for your file",
        "paragraphs": [
          "For a simple data listing, move the intended source sheet into the first position in your spreadsheet editor before conversion. Inspect headings and long rows. A text rendering is different from a spreadsheet’s print layout with charts and formulas."
        ]
      },
      {
        "heading": "Choose only the settings this case needs",
        "paragraphs": [
          "Put the intended data on the first sheet in a copy. Use short column headings and inspect long values that may wrap; retain the workbook for formulas and further editing."
        ]
      },
      {
        "heading": "When the example needs a different approach",
        "paragraphs": [
          "Use the spreadsheet application’s own PDF export when those visual features are required. A row-based PDF is suitable for simpler reading copies."
        ]
      }
    ],
    "tips": [
      "Put the intended data on the first sheet in a copy. Use short column headings and inspect long values that may wrap; retain the workbook for formulas and further editing.",
      "Check which sheet is first in the workbook copy. This operation does not infer the active business worksheet.",
      "Use the spreadsheet application’s own PDF export when those visual features are required. A row-based PDF is suitable for simpler reading copies."
    ],
    "faq": [
      {
        "question": "The wrong sheet appears?",
        "answer": "Check which sheet is first in the workbook copy. This operation does not infer the active business worksheet."
      },
      {
        "question": "Charts and formatting disappear?",
        "answer": "Use the spreadsheet application’s own PDF export when those visual features are required. A row-based PDF is suitable for simpler reading copies."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Create a simple PDF view of spreadsheet rows."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Only the first sheet is converted. Charts, complex styling and original print layout are not preserved."
      }
    ],
    "hero": {
      "input": "First-sheet rows",
      "output": "Text PDF"
    },
    "cta": "Open Spreadsheet to PDF →"
  },
  {
    "slug": "spreadsheet-to-pdf-common-problems-and-how-to-fix-them",
    "title": "Spreadsheet to PDF: common problems and how to fix them",
    "category": "Convert",
    "tool": "spreadsheet-to-pdf",
    "toolId": "sheet",
    "toolNumber": 53,
    "summary": "Resolve the wrong sheet appears and charts and formatting disappear. Understand the limits before retrying.",
    "intent": "Troubleshooting",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Spreadsheet to PDF",
      "Troubleshooting"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Choose an XLSX, XLS or CSV input and check which sheet contains your data.",
      "Export and inspect the printed text rows."
    ],
    "check": "Only the first sheet is converted. Charts, complex styling and original print layout are not preserved.",
    "limit": "Text-based conversion of the first sheet. Complex styling and charts are not preserved.",
    "sections": [
      {
        "heading": "The wrong sheet appears",
        "paragraphs": [
          "Check which sheet is first in the workbook copy. This operation does not infer the active business worksheet."
        ]
      },
      {
        "heading": "Charts and formatting disappear",
        "paragraphs": [
          "Use the spreadsheet application’s own PDF export when those visual features are required. A row-based PDF is suitable for simpler reading copies."
        ]
      },
      {
        "heading": "Check whether this is the right operation",
        "paragraphs": [
          "Spreadsheet to PDF is text-based and uses the first sheet. It does not faithfully print charts, complex cell styling or a workbook’s entire multi-sheet design."
        ]
      },
      {
        "heading": "A more useful retry",
        "paragraphs": [
          "For a simple data listing, move the intended source sheet into the first position in your spreadsheet editor before conversion. Inspect headings and long rows. A text rendering is different from a spreadsheet’s print layout with charts and formulas."
        ]
      }
    ],
    "tips": [
      "Put the intended data on the first sheet in a copy. Use short column headings and inspect long values that may wrap; retain the workbook for formulas and further editing.",
      "Check which sheet is first in the workbook copy. This operation does not infer the active business worksheet.",
      "Use the spreadsheet application’s own PDF export when those visual features are required. A row-based PDF is suitable for simpler reading copies."
    ],
    "faq": [
      {
        "question": "The wrong sheet appears?",
        "answer": "Check which sheet is first in the workbook copy. This operation does not infer the active business worksheet."
      },
      {
        "question": "Charts and formatting disappear?",
        "answer": "Use the spreadsheet application’s own PDF export when those visual features are required. A row-based PDF is suitable for simpler reading copies."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Create a simple PDF view of spreadsheet rows."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Only the first sheet is converted. Charts, complex styling and original print layout are not preserved."
      }
    ],
    "hero": {
      "input": "First-sheet rows",
      "output": "Text PDF"
    },
    "cta": "Open Spreadsheet to PDF →"
  },
  {
    "slug": "how-to-convert-epub-text-into-a-pdf",
    "title": "How to convert EPUB text into a PDF",
    "category": "Convert",
    "tool": "epub-to-pdf",
    "toolId": "ebook",
    "toolNumber": 54,
    "summary": "Turn book text into a document. Learn the available controls, a practical example and what to check.",
    "intent": "How-to",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "EPUB to PDF",
      "How-to"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Choose an EPUB containing readable book text.",
      "Export and inspect the reading order and page breaks."
    ],
    "check": "Illustrations and ebook styling are not preserved. Unsupported or protected EPUB files may fail.",
    "limit": "Reflows text; ebook styling and illustrations are not preserved.",
    "sections": [
      {
        "heading": "What this tool actually does",
        "paragraphs": [
          "This reflows ebook text into PDF pages. It does not preserve every ebook stylesheet, illustration or fixed-layout design."
        ]
      },
      {
        "heading": "Choose the controls for your document",
        "paragraphs": [
          "Use a supported EPUB file and compare a short chapter first. Keep the EPUB for flexible e-reader viewing and the PDF for the chosen fixed-page purpose."
        ]
      },
      {
        "heading": "Before your first export",
        "paragraphs": [
          "For a chapter reference copy, compare the chapter sequence with the EPUB’s reading order. Fixed-page PDF output can introduce new page breaks; it does not retain an e-reader’s flexible font and screen settings."
        ]
      },
      {
        "heading": "The book design or pictures disappear",
        "paragraphs": [
          "The converter is text-focused. Use a publishing workflow that understands the ebook’s design if those features are essential."
        ]
      }
    ],
    "tips": [
      "Use a supported EPUB file and compare a short chapter first. Keep the EPUB for flexible e-reader viewing and the PDF for the chosen fixed-page purpose.",
      "The converter is text-focused. Use a publishing workflow that understands the ebook’s design if those features are essential.",
      "Inspect the source book’s reading order and the resulting text. A malformed or unusual EPUB may need repair in an ebook editor before conversion."
    ],
    "faq": [
      {
        "question": "The book design or pictures disappear?",
        "answer": "The converter is text-focused. Use a publishing workflow that understands the ebook’s design if those features are essential."
      },
      {
        "question": "Chapters appear in a strange order?",
        "answer": "Inspect the source book’s reading order and the resulting text. A malformed or unusual EPUB may need repair in an ebook editor before conversion."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Make a text-based PDF copy of an EPUB."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Illustrations and ebook styling are not preserved. Unsupported or protected EPUB files may fail."
      }
    ],
    "hero": {
      "input": "EPUB text",
      "output": "PDF reading copy"
    },
    "cta": "Open EPUB to PDF →"
  },
  {
    "slug": "make-a-pdf-reading-copy-of-a-text-epub",
    "title": "Make a PDF reading copy of a text EPUB",
    "category": "Convert",
    "tool": "epub-to-pdf",
    "toolId": "ebook",
    "toolNumber": 54,
    "summary": "An ebook with straightforward chapter text needs a printable reading copy.",
    "intent": "Practical example",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "EPUB to PDF",
      "Practical example"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Choose an EPUB containing readable book text.",
      "Export and inspect the reading order and page breaks."
    ],
    "check": "Illustrations and ebook styling are not preserved. Unsupported or protected EPUB files may fail.",
    "limit": "Reflows text; ebook styling and illustrations are not preserved.",
    "sections": [
      {
        "heading": "The document and the intended outcome",
        "paragraphs": [
          "An ebook with straightforward chapter text needs a printable reading copy. Convert EPUB and inspect its reading order, chapter boundaries and line wrapping."
        ]
      },
      {
        "heading": "Make this example work for your file",
        "paragraphs": [
          "For a chapter reference copy, compare the chapter sequence with the EPUB’s reading order. Fixed-page PDF output can introduce new page breaks; it does not retain an e-reader’s flexible font and screen settings."
        ]
      },
      {
        "heading": "Choose only the settings this case needs",
        "paragraphs": [
          "Use a supported EPUB file and compare a short chapter first. Keep the EPUB for flexible e-reader viewing and the PDF for the chosen fixed-page purpose."
        ]
      },
      {
        "heading": "When the example needs a different approach",
        "paragraphs": [
          "Inspect the source book’s reading order and the resulting text. A malformed or unusual EPUB may need repair in an ebook editor before conversion."
        ]
      }
    ],
    "tips": [
      "Use a supported EPUB file and compare a short chapter first. Keep the EPUB for flexible e-reader viewing and the PDF for the chosen fixed-page purpose.",
      "The converter is text-focused. Use a publishing workflow that understands the ebook’s design if those features are essential.",
      "Inspect the source book’s reading order and the resulting text. A malformed or unusual EPUB may need repair in an ebook editor before conversion."
    ],
    "faq": [
      {
        "question": "The book design or pictures disappear?",
        "answer": "The converter is text-focused. Use a publishing workflow that understands the ebook’s design if those features are essential."
      },
      {
        "question": "Chapters appear in a strange order?",
        "answer": "Inspect the source book’s reading order and the resulting text. A malformed or unusual EPUB may need repair in an ebook editor before conversion."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Make a text-based PDF copy of an EPUB."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Illustrations and ebook styling are not preserved. Unsupported or protected EPUB files may fail."
      }
    ],
    "hero": {
      "input": "EPUB text",
      "output": "PDF reading copy"
    },
    "cta": "Open EPUB to PDF →"
  },
  {
    "slug": "epub-to-pdf-common-problems-and-how-to-fix-them",
    "title": "EPUB to PDF: common problems and how to fix them",
    "category": "Convert",
    "tool": "epub-to-pdf",
    "toolId": "ebook",
    "toolNumber": 54,
    "summary": "Resolve the book design or pictures disappear and chapters appear in a strange order. Understand the limits before retrying.",
    "intent": "Troubleshooting",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "EPUB to PDF",
      "Troubleshooting"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Choose an EPUB containing readable book text.",
      "Export and inspect the reading order and page breaks."
    ],
    "check": "Illustrations and ebook styling are not preserved. Unsupported or protected EPUB files may fail.",
    "limit": "Reflows text; ebook styling and illustrations are not preserved.",
    "sections": [
      {
        "heading": "The book design or pictures disappear",
        "paragraphs": [
          "The converter is text-focused. Use a publishing workflow that understands the ebook’s design if those features are essential."
        ]
      },
      {
        "heading": "Chapters appear in a strange order",
        "paragraphs": [
          "Inspect the source book’s reading order and the resulting text. A malformed or unusual EPUB may need repair in an ebook editor before conversion."
        ]
      },
      {
        "heading": "Check whether this is the right operation",
        "paragraphs": [
          "This reflows ebook text into PDF pages. It does not preserve every ebook stylesheet, illustration or fixed-layout design."
        ]
      },
      {
        "heading": "A more useful retry",
        "paragraphs": [
          "For a chapter reference copy, compare the chapter sequence with the EPUB’s reading order. Fixed-page PDF output can introduce new page breaks; it does not retain an e-reader’s flexible font and screen settings."
        ]
      }
    ],
    "tips": [
      "Use a supported EPUB file and compare a short chapter first. Keep the EPUB for flexible e-reader viewing and the PDF for the chosen fixed-page purpose.",
      "The converter is text-focused. Use a publishing workflow that understands the ebook’s design if those features are essential.",
      "Inspect the source book’s reading order and the resulting text. A malformed or unusual EPUB may need repair in an ebook editor before conversion."
    ],
    "faq": [
      {
        "question": "The book design or pictures disappear?",
        "answer": "The converter is text-focused. Use a publishing workflow that understands the ebook’s design if those features are essential."
      },
      {
        "question": "Chapters appear in a strange order?",
        "answer": "Inspect the source book’s reading order and the resulting text. A malformed or unusual EPUB may need repair in an ebook editor before conversion."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Make a text-based PDF copy of an EPUB."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Illustrations and ebook styling are not preserved. Unsupported or protected EPUB files may fail."
      }
    ],
    "hero": {
      "input": "EPUB text",
      "output": "PDF reading copy"
    },
    "cta": "Open EPUB to PDF →"
  },
  {
    "slug": "how-to-make-a-grayscale-pdf-reading-copy",
    "title": "How to make a grayscale PDF reading copy",
    "category": "Convert",
    "tool": "grayscale-pdf",
    "toolId": "grayscale",
    "toolNumber": 55,
    "summary": "Make pages black and white. Learn the available controls, a practical example and what to check.",
    "intent": "How-to",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Grayscale PDF",
      "How-to"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Review whether your content relies on color distinctions.",
      "Export and inspect graphs, highlights and small text."
    ],
    "check": "Pages are rebuilt as images; text search, links and forms are lost. Similar colors can become hard to distinguish.",
    "limit": "Rebuilds pages as images. Text search, links and forms are lost.",
    "sections": [
      {
        "heading": "What this tool actually does",
        "paragraphs": [
          "Grayscale rebuilds visible pages as images. It removes text search, page links and editable form behaviour rather than only setting a reader display theme."
        ]
      },
      {
        "heading": "Choose the controls for your document",
        "paragraphs": [
          "Compare charts and light coloured marks carefully. A legend that relies only on red versus green may need extra labels in the source before conversion."
        ]
      },
      {
        "heading": "Before your first export",
        "paragraphs": [
          "For a black-and-white handout, inspect charts whose categories originally relied on color. Distinct colors can become similar shades, so labels or patterns may be needed in the source for clear interpretation."
        ]
      },
      {
        "heading": "Two coloured categories look identical",
        "paragraphs": [
          "Equal luminance colours can become similar shades. Add text labels or patterns in the source instead of assuming grayscale will separate them."
        ]
      }
    ],
    "tips": [
      "Compare charts and light coloured marks carefully. A legend that relies only on red versus green may need extra labels in the source before conversion.",
      "Equal luminance colours can become similar shades. Add text labels or patterns in the source instead of assuming grayscale will separate them.",
      "That follows from page-image output. Keep the original when searchable text and interactive features are required."
    ],
    "faq": [
      {
        "question": "Two coloured categories look identical?",
        "answer": "Equal luminance colours can become similar shades. Add text labels or patterns in the source instead of assuming grayscale will separate them."
      },
      {
        "question": "Text is no longer selectable?",
        "answer": "That follows from page-image output. Keep the original when searchable text and interactive features are required."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Create a black-and-white page appearance."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Pages are rebuilt as images; text search, links and forms are lost. Similar colors can become hard to distinguish."
      }
    ],
    "hero": {
      "input": "Colour pages",
      "output": "Grayscale images"
    },
    "cta": "Open Grayscale PDF →"
  },
  {
    "slug": "create-a-monochrome-pdf-reading-copy",
    "title": "Create a monochrome PDF reading copy",
    "category": "Convert",
    "tool": "grayscale-pdf",
    "toolId": "grayscale",
    "toolNumber": 55,
    "summary": "A colour handout must be reviewed in black and white.",
    "intent": "Practical example",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Grayscale PDF",
      "Practical example"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Review whether your content relies on color distinctions.",
      "Export and inspect graphs, highlights and small text."
    ],
    "check": "Pages are rebuilt as images; text search, links and forms are lost. Similar colors can become hard to distinguish.",
    "limit": "Rebuilds pages as images. Text search, links and forms are lost.",
    "sections": [
      {
        "heading": "The document and the intended outcome",
        "paragraphs": [
          "A colour handout must be reviewed in black and white. Convert it and check whether coloured labels, charts and highlighted distinctions remain understandable without hue."
        ]
      },
      {
        "heading": "Make this example work for your file",
        "paragraphs": [
          "For a black-and-white handout, inspect charts whose categories originally relied on color. Distinct colors can become similar shades, so labels or patterns may be needed in the source for clear interpretation."
        ]
      },
      {
        "heading": "Choose only the settings this case needs",
        "paragraphs": [
          "Compare charts and light coloured marks carefully. A legend that relies only on red versus green may need extra labels in the source before conversion."
        ]
      },
      {
        "heading": "When the example needs a different approach",
        "paragraphs": [
          "That follows from page-image output. Keep the original when searchable text and interactive features are required."
        ]
      }
    ],
    "tips": [
      "Compare charts and light coloured marks carefully. A legend that relies only on red versus green may need extra labels in the source before conversion.",
      "Equal luminance colours can become similar shades. Add text labels or patterns in the source instead of assuming grayscale will separate them.",
      "That follows from page-image output. Keep the original when searchable text and interactive features are required."
    ],
    "faq": [
      {
        "question": "Two coloured categories look identical?",
        "answer": "Equal luminance colours can become similar shades. Add text labels or patterns in the source instead of assuming grayscale will separate them."
      },
      {
        "question": "Text is no longer selectable?",
        "answer": "That follows from page-image output. Keep the original when searchable text and interactive features are required."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Create a black-and-white page appearance."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Pages are rebuilt as images; text search, links and forms are lost. Similar colors can become hard to distinguish."
      }
    ],
    "hero": {
      "input": "Colour pages",
      "output": "Grayscale images"
    },
    "cta": "Open Grayscale PDF →"
  },
  {
    "slug": "grayscale-pdf-common-problems-and-how-to-fix-them",
    "title": "Grayscale PDF: common problems and how to fix them",
    "category": "Convert",
    "tool": "grayscale-pdf",
    "toolId": "grayscale",
    "toolNumber": 55,
    "summary": "Resolve two coloured categories look identical and text is no longer selectable. Understand the limits before retrying.",
    "intent": "Troubleshooting",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Grayscale PDF",
      "Troubleshooting"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Review whether your content relies on color distinctions.",
      "Export and inspect graphs, highlights and small text."
    ],
    "check": "Pages are rebuilt as images; text search, links and forms are lost. Similar colors can become hard to distinguish.",
    "limit": "Rebuilds pages as images. Text search, links and forms are lost.",
    "sections": [
      {
        "heading": "Two coloured categories look identical",
        "paragraphs": [
          "Equal luminance colours can become similar shades. Add text labels or patterns in the source instead of assuming grayscale will separate them."
        ]
      },
      {
        "heading": "Text is no longer selectable",
        "paragraphs": [
          "That follows from page-image output. Keep the original when searchable text and interactive features are required."
        ]
      },
      {
        "heading": "Check whether this is the right operation",
        "paragraphs": [
          "Grayscale rebuilds visible pages as images. It removes text search, page links and editable form behaviour rather than only setting a reader display theme."
        ]
      },
      {
        "heading": "A more useful retry",
        "paragraphs": [
          "For a black-and-white handout, inspect charts whose categories originally relied on color. Distinct colors can become similar shades, so labels or patterns may be needed in the source for clear interpretation."
        ]
      }
    ],
    "tips": [
      "Compare charts and light coloured marks carefully. A legend that relies only on red versus green may need extra labels in the source before conversion.",
      "Equal luminance colours can become similar shades. Add text labels or patterns in the source instead of assuming grayscale will separate them.",
      "That follows from page-image output. Keep the original when searchable text and interactive features are required."
    ],
    "faq": [
      {
        "question": "Two coloured categories look identical?",
        "answer": "Equal luminance colours can become similar shades. Add text labels or patterns in the source instead of assuming grayscale will separate them."
      },
      {
        "question": "Text is no longer selectable?",
        "answer": "That follows from page-image output. Keep the original when searchable text and interactive features are required."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Create a black-and-white page appearance."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Pages are rebuilt as images; text search, links and forms are lost. Similar colors can become hard to distinguish."
      }
    ],
    "hero": {
      "input": "Colour pages",
      "output": "Grayscale images"
    },
    "cta": "Open Grayscale PDF →"
  },
  {
    "slug": "how-to-invert-pdf-page-colors",
    "title": "How to invert PDF page colors",
    "category": "Convert",
    "tool": "invert-colours",
    "toolId": "invert",
    "toolNumber": 56,
    "summary": "Create a dark version of your PDF. Learn the available controls, a practical example and what to check.",
    "intent": "How-to",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Invert colours",
      "How-to"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Review the source pages before changing their colors.",
      "Export and inspect photographs, diagrams and text contrast."
    ],
    "check": "This modifies the document, unlike the website dark theme. Rasterization removes text search, links and forms.",
    "limit": "Rebuilds pages as images. Text search, links and forms are lost.",
    "sections": [
      {
        "heading": "What this tool actually does",
        "paragraphs": [
          "Inversion changes page colours and rebuilds them as images. It is different from turning on a reader’s dark theme, which can leave original document bytes intact."
        ]
      },
      {
        "heading": "Choose the controls for your document",
        "paragraphs": [
          "Test a mixed page with both text and pictures. Inversion can make photographs unnatural and does not guarantee a comfortable contrast for every colour combination."
        ]
      },
      {
        "heading": "Before your first export",
        "paragraphs": [
          "For personal night reading, inspect photographs and highlighted regions as well as text. Inverting a rendered page changes all pixels, so it can make some illustrations less natural or less legible."
        ]
      },
      {
        "heading": "Photos look like negatives",
        "paragraphs": [
          "That is an expected effect of colour inversion. Use a reader theme when you only want a darker interface around unchanged pages."
        ]
      }
    ],
    "tips": [
      "Test a mixed page with both text and pictures. Inversion can make photographs unnatural and does not guarantee a comfortable contrast for every colour combination.",
      "That is an expected effect of colour inversion. Use a reader theme when you only want a darker interface around unchanged pages.",
      "The output is image-based. Retain the original for interactive reading or run a separate OCR workflow when a text layer is necessary."
    ],
    "faq": [
      {
        "question": "Photos look like negatives?",
        "answer": "That is an expected effect of colour inversion. Use a reader theme when you only want a darker interface around unchanged pages."
      },
      {
        "question": "Search and links stop working?",
        "answer": "The output is image-based. Retain the original for interactive reading or run a separate OCR workflow when a text layer is necessary."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Create an inverted page appearance for a specific document."
      },
      {
        "question": "What should I check in the result?",
        "answer": "This modifies the document, unlike the website dark theme. Rasterization removes text search, links and forms."
      }
    ],
    "hero": {
      "input": "Light page",
      "output": "Inverted image"
    },
    "cta": "Open Invert colours →"
  },
  {
    "slug": "create-an-inverted-pdf-copy-for-a-specific-reading-preference",
    "title": "Create an inverted PDF copy for a specific reading preference",
    "category": "Convert",
    "tool": "invert-colours",
    "toolId": "invert",
    "toolNumber": 56,
    "summary": "A reader wants a dark-looking copy of a mostly black-on-white document.",
    "intent": "Practical example",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Invert colours",
      "Practical example"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Review the source pages before changing their colors.",
      "Export and inspect photographs, diagrams and text contrast."
    ],
    "check": "This modifies the document, unlike the website dark theme. Rasterization removes text search, links and forms.",
    "limit": "Rebuilds pages as images. Text search, links and forms are lost.",
    "sections": [
      {
        "heading": "The document and the intended outcome",
        "paragraphs": [
          "A reader wants a dark-looking copy of a mostly black-on-white document. Invert it, then inspect photographs, pale text and coloured diagrams before relying on it."
        ]
      },
      {
        "heading": "Make this example work for your file",
        "paragraphs": [
          "For personal night reading, inspect photographs and highlighted regions as well as text. Inverting a rendered page changes all pixels, so it can make some illustrations less natural or less legible."
        ]
      },
      {
        "heading": "Choose only the settings this case needs",
        "paragraphs": [
          "Test a mixed page with both text and pictures. Inversion can make photographs unnatural and does not guarantee a comfortable contrast for every colour combination."
        ]
      },
      {
        "heading": "When the example needs a different approach",
        "paragraphs": [
          "The output is image-based. Retain the original for interactive reading or run a separate OCR workflow when a text layer is necessary."
        ]
      }
    ],
    "tips": [
      "Test a mixed page with both text and pictures. Inversion can make photographs unnatural and does not guarantee a comfortable contrast for every colour combination.",
      "That is an expected effect of colour inversion. Use a reader theme when you only want a darker interface around unchanged pages.",
      "The output is image-based. Retain the original for interactive reading or run a separate OCR workflow when a text layer is necessary."
    ],
    "faq": [
      {
        "question": "Photos look like negatives?",
        "answer": "That is an expected effect of colour inversion. Use a reader theme when you only want a darker interface around unchanged pages."
      },
      {
        "question": "Search and links stop working?",
        "answer": "The output is image-based. Retain the original for interactive reading or run a separate OCR workflow when a text layer is necessary."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Create an inverted page appearance for a specific document."
      },
      {
        "question": "What should I check in the result?",
        "answer": "This modifies the document, unlike the website dark theme. Rasterization removes text search, links and forms."
      }
    ],
    "hero": {
      "input": "Light page",
      "output": "Inverted image"
    },
    "cta": "Open Invert colours →"
  },
  {
    "slug": "invert-colours-common-problems-and-how-to-fix-them",
    "title": "Invert colours: common problems and how to fix them",
    "category": "Convert",
    "tool": "invert-colours",
    "toolId": "invert",
    "toolNumber": 56,
    "summary": "Resolve photos look like negatives and search and links stop working. Understand the limits before retrying.",
    "intent": "Troubleshooting",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Invert colours",
      "Troubleshooting"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Review the source pages before changing their colors.",
      "Export and inspect photographs, diagrams and text contrast."
    ],
    "check": "This modifies the document, unlike the website dark theme. Rasterization removes text search, links and forms.",
    "limit": "Rebuilds pages as images. Text search, links and forms are lost.",
    "sections": [
      {
        "heading": "Photos look like negatives",
        "paragraphs": [
          "That is an expected effect of colour inversion. Use a reader theme when you only want a darker interface around unchanged pages."
        ]
      },
      {
        "heading": "Search and links stop working",
        "paragraphs": [
          "The output is image-based. Retain the original for interactive reading or run a separate OCR workflow when a text layer is necessary."
        ]
      },
      {
        "heading": "Check whether this is the right operation",
        "paragraphs": [
          "Inversion changes page colours and rebuilds them as images. It is different from turning on a reader’s dark theme, which can leave original document bytes intact."
        ]
      },
      {
        "heading": "A more useful retry",
        "paragraphs": [
          "For personal night reading, inspect photographs and highlighted regions as well as text. Inverting a rendered page changes all pixels, so it can make some illustrations less natural or less legible."
        ]
      }
    ],
    "tips": [
      "Test a mixed page with both text and pictures. Inversion can make photographs unnatural and does not guarantee a comfortable contrast for every colour combination.",
      "That is an expected effect of colour inversion. Use a reader theme when you only want a darker interface around unchanged pages.",
      "The output is image-based. Retain the original for interactive reading or run a separate OCR workflow when a text layer is necessary."
    ],
    "faq": [
      {
        "question": "Photos look like negatives?",
        "answer": "That is an expected effect of colour inversion. Use a reader theme when you only want a darker interface around unchanged pages."
      },
      {
        "question": "Search and links stop working?",
        "answer": "The output is image-based. Retain the original for interactive reading or run a separate OCR workflow when a text layer is necessary."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Create an inverted page appearance for a specific document."
      },
      {
        "question": "What should I check in the result?",
        "answer": "This modifies the document, unlike the website dark theme. Rasterization removes text search, links and forms."
      }
    ],
    "hero": {
      "input": "Light page",
      "output": "Inverted image"
    },
    "cta": "Open Invert colours →"
  },
  {
    "slug": "make-a-scanned-letter-searchable-and-check-recognition-errors",
    "title": "Make a scanned letter searchable and check recognition errors",
    "category": "Convert",
    "tool": "ocr-pdf",
    "toolId": "ocr",
    "toolNumber": 57,
    "summary": "A scanned letter contains Alpha Bravo Charlie Delta and a date.",
    "intent": "Practical example",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Searchable PDF (OCR)",
      "Practical example",
      "searchable scans",
      "text recognition"
    ],
    "steps": [
      "Open a scanned PDF with legible text in a supported language.",
      "Run recognition. The first use downloads a recognition model, so an internet connection is needed for that download.",
      "Export the searchable PDF and check names, dates and numbers by searching or copying text."
    ],
    "check": "Recognition accuracy depends on scan quality. English, French, German, Spanish, Italian and Portuguese are selectable. OCR does not recreate a Word document or make image text directly editable.",
    "limit": "English, French, German, Spanish, Italian and Portuguese models download on demand. Accuracy varies; unsupported searchable characters are reported.",
    "sections": [
      {
        "heading": "The document and the intended outcome",
        "paragraphs": [
          "A scanned letter contains Alpha Bravo Charlie Delta and a date. Choose its supported language, recognize the scan and compare every important word and number before exporting."
        ]
      },
      {
        "heading": "Make this example work for your file",
        "paragraphs": [
          "For a scanned receipt, review the date, merchant and total against the image. Searchability is useful, but a recognized digit can be wrong. Correct extracted records before using them for accounting or a submission."
        ]
      },
      {
        "heading": "Choose only the settings this case needs",
        "paragraphs": [
          "Use the selected language and page range; review the recognition screen where available. First use may download a model, so test with a short scan and a stable connection."
        ]
      },
      {
        "heading": "When the example needs a different approach",
        "paragraphs": [
          "A searchable text layer can be invisible by design. Search for a known phrase and inspect extracted text while checking that the scan remains readable."
        ]
      }
    ],
    "tips": [
      "Use the selected language and page range; review the recognition screen where available. First use may download a model, so test with a short scan and a stable connection.",
      "Correct the recognized text against the scan. Similar characters such as 0/O and 1/l need manual review, especially in identifiers.",
      "A searchable text layer can be invisible by design. Search for a known phrase and inspect extracted text while checking that the scan remains readable."
    ],
    "faq": [
      {
        "question": "Names or numbers are wrong?",
        "answer": "Correct the recognized text against the scan. Similar characters such as 0/O and 1/l need manual review, especially in identifiers."
      },
      {
        "question": "The visible scan still looks unchanged?",
        "answer": "A searchable text layer can be invisible by design. Search for a known phrase and inspect extracted text while checking that the scan remains readable."
      },
      {
        "question": "Are other languages supported?",
        "answer": "Choose English, French, German, Spanish, Italian or Portuguese. Indian scripts and arbitrary Unicode embedding are not yet supported. Review the result."
      }
    ],
    "hero": {
      "input": "Image-only scan",
      "output": "Searchable text layer"
    },
    "cta": "Open Searchable PDF (OCR) →"
  },
  {
    "slug": "searchable-pdf-ocr-common-problems-and-how-to-fix-them",
    "title": "Searchable PDF (OCR): common problems and how to fix them",
    "category": "Convert",
    "tool": "ocr-pdf",
    "toolId": "ocr",
    "toolNumber": 57,
    "summary": "Resolve names or numbers are wrong and the visible scan still looks unchanged. Understand the limits before retrying.",
    "intent": "Troubleshooting",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Searchable PDF (OCR)",
      "Troubleshooting",
      "searchable scans",
      "text recognition"
    ],
    "steps": [
      "Open a scanned PDF with legible text in a supported language.",
      "Run recognition. The first use downloads a recognition model, so an internet connection is needed for that download.",
      "Export the searchable PDF and check names, dates and numbers by searching or copying text."
    ],
    "check": "Recognition accuracy depends on scan quality. English, French, German, Spanish, Italian and Portuguese are selectable. OCR does not recreate a Word document or make image text directly editable.",
    "limit": "English, French, German, Spanish, Italian and Portuguese models download on demand. Accuracy varies; unsupported searchable characters are reported.",
    "sections": [
      {
        "heading": "Names or numbers are wrong",
        "paragraphs": [
          "Correct the recognized text against the scan. Similar characters such as 0/O and 1/l need manual review, especially in identifiers."
        ]
      },
      {
        "heading": "The visible scan still looks unchanged",
        "paragraphs": [
          "A searchable text layer can be invisible by design. Search for a known phrase and inspect extracted text while checking that the scan remains readable."
        ]
      },
      {
        "heading": "Check whether this is the right operation",
        "paragraphs": [
          "OCR adds recognized text to image pages. Searchability is useful but is not proof the words are correct or that visible source text can be edited as original PDF objects."
        ]
      },
      {
        "heading": "A more useful retry",
        "paragraphs": [
          "For a scanned receipt, review the date, merchant and total against the image. Searchability is useful, but a recognized digit can be wrong. Correct extracted records before using them for accounting or a submission."
        ]
      }
    ],
    "tips": [
      "Use the selected language and page range; review the recognition screen where available. First use may download a model, so test with a short scan and a stable connection.",
      "Correct the recognized text against the scan. Similar characters such as 0/O and 1/l need manual review, especially in identifiers.",
      "A searchable text layer can be invisible by design. Search for a known phrase and inspect extracted text while checking that the scan remains readable."
    ],
    "faq": [
      {
        "question": "Names or numbers are wrong?",
        "answer": "Correct the recognized text against the scan. Similar characters such as 0/O and 1/l need manual review, especially in identifiers."
      },
      {
        "question": "The visible scan still looks unchanged?",
        "answer": "A searchable text layer can be invisible by design. Search for a known phrase and inspect extracted text while checking that the scan remains readable."
      },
      {
        "question": "Are other languages supported?",
        "answer": "Choose English, French, German, Spanish, Italian or Portuguese. Indian scripts and arbitrary Unicode embedding are not yet supported. Review the result."
      }
    ],
    "hero": {
      "input": "Image-only scan",
      "output": "Searchable text layer"
    },
    "cta": "Open Searchable PDF (OCR) →"
  },
  {
    "slug": "how-to-listen-to-pdf-text-aloud",
    "title": "How to listen to PDF text aloud",
    "category": "Convert",
    "tool": "read-aloud",
    "toolId": "audio",
    "toolNumber": 58,
    "summary": "Listen with your device’s voices. Learn the available controls, a practical example and what to check.",
    "intent": "How-to",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Read aloud",
      "How-to"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Open a PDF with selectable text and choose an available browser voice.",
      "Start playback and use the available stop controls when needed."
    ],
    "check": "There is no audio-file export. Network behavior and offline availability depend on the selected browser voice.",
    "limit": "Uses browser speech synthesis. Voice availability and offline support depend on your device. No audio-file export.",
    "sections": [
      {
        "heading": "What this tool actually does",
        "paragraphs": [
          "Read aloud uses browser speech synthesis. Voices, pronunciation and offline support depend on the device; the tool does not export an audio recording."
        ]
      },
      {
        "heading": "Choose the controls for your document",
        "paragraphs": [
          "Check extracted reading order before listening to a complex page. Select a voice appropriate to the text language and test a short passage before a long session."
        ]
      },
      {
        "heading": "Before your first export",
        "paragraphs": [
          "For listening to revision notes, start with a short paragraph and choose an available device voice. Listen for skipped headings and unusual number pronunciation. Speech output follows extracted text rather than the page’s visual reading order."
        ]
      },
      {
        "heading": "A voice is unavailable",
        "paragraphs": [
          "The browser or operating system may not supply it. Choose an installed voice or adjust device language support rather than expecting the PDF tool to download every voice."
        ]
      }
    ],
    "tips": [
      "Check extracted reading order before listening to a complex page. Select a voice appropriate to the text language and test a short passage before a long session.",
      "The browser or operating system may not supply it. Choose an installed voice or adjust device language support rather than expecting the PDF tool to download every voice.",
      "Speech follows extracted text, which can differ from visual order. Use a simpler source or review the text before listening."
    ],
    "faq": [
      {
        "question": "A voice is unavailable?",
        "answer": "The browser or operating system may not supply it. Choose an installed voice or adjust device language support rather than expecting the PDF tool to download every voice."
      },
      {
        "question": "Columns are read in the wrong order?",
        "answer": "Speech follows extracted text, which can differ from visual order. Use a simpler source or review the text before listening."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Listen to extracted text while reviewing a document."
      },
      {
        "question": "What should I check in the result?",
        "answer": "There is no audio-file export. Network behavior and offline availability depend on the selected browser voice."
      }
    ],
    "hero": {
      "input": "PDF text",
      "output": "Device speech"
    },
    "cta": "Open Read aloud →"
  },
  {
    "slug": "listen-to-a-text-pdf-using-device-voices",
    "title": "Listen to a text PDF using device voices",
    "category": "Convert",
    "tool": "read-aloud",
    "toolId": "audio",
    "toolNumber": 58,
    "summary": "A reader wants to listen to a text-heavy document while following the page.",
    "intent": "Practical example",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Read aloud",
      "Practical example"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Open a PDF with selectable text and choose an available browser voice.",
      "Start playback and use the available stop controls when needed."
    ],
    "check": "There is no audio-file export. Network behavior and offline availability depend on the selected browser voice.",
    "limit": "Uses browser speech synthesis. Voice availability and offline support depend on your device. No audio-file export.",
    "sections": [
      {
        "heading": "The document and the intended outcome",
        "paragraphs": [
          "A reader wants to listen to a text-heavy document while following the page. Choose a device voice, start reading and use the available pause or stop controls when changing sections."
        ]
      },
      {
        "heading": "Make this example work for your file",
        "paragraphs": [
          "For listening to revision notes, start with a short paragraph and choose an available device voice. Listen for skipped headings and unusual number pronunciation. Speech output follows extracted text rather than the page’s visual reading order."
        ]
      },
      {
        "heading": "Choose only the settings this case needs",
        "paragraphs": [
          "Check extracted reading order before listening to a complex page. Select a voice appropriate to the text language and test a short passage before a long session."
        ]
      },
      {
        "heading": "When the example needs a different approach",
        "paragraphs": [
          "Speech follows extracted text, which can differ from visual order. Use a simpler source or review the text before listening."
        ]
      }
    ],
    "tips": [
      "Check extracted reading order before listening to a complex page. Select a voice appropriate to the text language and test a short passage before a long session.",
      "The browser or operating system may not supply it. Choose an installed voice or adjust device language support rather than expecting the PDF tool to download every voice.",
      "Speech follows extracted text, which can differ from visual order. Use a simpler source or review the text before listening."
    ],
    "faq": [
      {
        "question": "A voice is unavailable?",
        "answer": "The browser or operating system may not supply it. Choose an installed voice or adjust device language support rather than expecting the PDF tool to download every voice."
      },
      {
        "question": "Columns are read in the wrong order?",
        "answer": "Speech follows extracted text, which can differ from visual order. Use a simpler source or review the text before listening."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Listen to extracted text while reviewing a document."
      },
      {
        "question": "What should I check in the result?",
        "answer": "There is no audio-file export. Network behavior and offline availability depend on the selected browser voice."
      }
    ],
    "hero": {
      "input": "PDF text",
      "output": "Device speech"
    },
    "cta": "Open Read aloud →"
  },
  {
    "slug": "read-aloud-common-problems-and-how-to-fix-them",
    "title": "Read aloud: common problems and how to fix them",
    "category": "Convert",
    "tool": "read-aloud",
    "toolId": "audio",
    "toolNumber": 58,
    "summary": "Resolve a voice is unavailable and columns are read in the wrong order. Understand the limits before retrying.",
    "intent": "Troubleshooting",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Read aloud",
      "Troubleshooting"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Open a PDF with selectable text and choose an available browser voice.",
      "Start playback and use the available stop controls when needed."
    ],
    "check": "There is no audio-file export. Network behavior and offline availability depend on the selected browser voice.",
    "limit": "Uses browser speech synthesis. Voice availability and offline support depend on your device. No audio-file export.",
    "sections": [
      {
        "heading": "A voice is unavailable",
        "paragraphs": [
          "The browser or operating system may not supply it. Choose an installed voice or adjust device language support rather than expecting the PDF tool to download every voice."
        ]
      },
      {
        "heading": "Columns are read in the wrong order",
        "paragraphs": [
          "Speech follows extracted text, which can differ from visual order. Use a simpler source or review the text before listening."
        ]
      },
      {
        "heading": "Check whether this is the right operation",
        "paragraphs": [
          "Read aloud uses browser speech synthesis. Voices, pronunciation and offline support depend on the device; the tool does not export an audio recording."
        ]
      },
      {
        "heading": "A more useful retry",
        "paragraphs": [
          "For listening to revision notes, start with a short paragraph and choose an available device voice. Listen for skipped headings and unusual number pronunciation. Speech output follows extracted text rather than the page’s visual reading order."
        ]
      }
    ],
    "tips": [
      "Check extracted reading order before listening to a complex page. Select a voice appropriate to the text language and test a short passage before a long session.",
      "The browser or operating system may not supply it. Choose an installed voice or adjust device language support rather than expecting the PDF tool to download every voice.",
      "Speech follows extracted text, which can differ from visual order. Use a simpler source or review the text before listening."
    ],
    "faq": [
      {
        "question": "A voice is unavailable?",
        "answer": "The browser or operating system may not supply it. Choose an installed voice or adjust device language support rather than expecting the PDF tool to download every voice."
      },
      {
        "question": "Columns are read in the wrong order?",
        "answer": "Speech follows extracted text, which can differ from visual order. Use a simpler source or review the text before listening."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Listen to extracted text while reviewing a document."
      },
      {
        "question": "What should I check in the result?",
        "answer": "There is no audio-file export. Network behavior and offline availability depend on the selected browser voice."
      }
    ],
    "hero": {
      "input": "PDF text",
      "output": "Device speech"
    },
    "cta": "Open Read aloud →"
  },
  {
    "slug": "how-to-compare-two-pdf-documents",
    "title": "How to compare two PDF documents",
    "category": "Pages",
    "tool": "compare-pdfs",
    "toolId": "compare",
    "toolNumber": 59,
    "summary": "Check two documents side by side. Learn the available controls, a practical example and what to check.",
    "intent": "How-to",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Compare PDFs",
      "How-to"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Choose two PDFs and inspect corresponding pages side by side.",
      "Review differences visually, including dates, numbers and missing pages."
    ],
    "check": "This is a comparison workspace, not guaranteed automatic semantic or legal difference detection.",
    "limit": "This is a comparison workspace, not guaranteed automatic semantic or legal difference detection.",
    "sections": [
      {
        "heading": "What this tool actually does",
        "paragraphs": [
          "Side-by-side viewing helps a human compare appearance. It is not an automatic legal redline, semantic diff or proof that every change has been identified."
        ]
      },
      {
        "heading": "Choose the controls for your document",
        "paragraphs": [
          "Add the intended two versions in a clear order. Match zoom and corresponding positions, and keep a short list of differences as you review."
        ]
      },
      {
        "heading": "Before your first export",
        "paragraphs": [
          "For revised terms, compare matching sections rather than assuming the same PDF position contains the same paragraph. An inserted page can shift every later page without changing their actual content."
        ]
      },
      {
        "heading": "The same position shows unrelated pages",
        "paragraphs": [
          "One version may contain an inserted or removed page. Align by headings or content instead of assuming page 4 matches page 4."
        ]
      }
    ],
    "tips": [
      "Add the intended two versions in a clear order. Match zoom and corresponding positions, and keep a short list of differences as you review.",
      "One version may contain an inserted or removed page. Align by headings or content instead of assuming page 4 matches page 4.",
      "Zoom into the relevant area and check source text when possible. Use a dedicated text-diff workflow for exhaustive wording comparison."
    ],
    "faq": [
      {
        "question": "The same position shows unrelated pages?",
        "answer": "One version may contain an inserted or removed page. Align by headings or content instead of assuming page 4 matches page 4."
      },
      {
        "question": "A small wording change is easy to miss?",
        "answer": "Zoom into the relevant area and check source text when possible. Use a dedicated text-diff workflow for exhaustive wording comparison."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Compare versions of a document."
      },
      {
        "question": "What should I check in the result?",
        "answer": "This is a comparison workspace, not guaranteed automatic semantic or legal difference detection."
      }
    ],
    "hero": {
      "input": "Original and revision",
      "output": "Side-by-side review"
    },
    "cta": "Open Compare PDFs →"
  },
  {
    "slug": "compare-a-revised-report-with-its-earlier-version",
    "title": "Compare a revised report with its earlier version",
    "category": "Pages",
    "tool": "compare-pdfs",
    "toolId": "compare",
    "toolNumber": 59,
    "summary": "Open an original and revised report side by side.",
    "intent": "Practical example",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Compare PDFs",
      "Practical example"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Choose two PDFs and inspect corresponding pages side by side.",
      "Review differences visually, including dates, numbers and missing pages."
    ],
    "check": "This is a comparison workspace, not guaranteed automatic semantic or legal difference detection.",
    "limit": "This is a comparison workspace, not guaranteed automatic semantic or legal difference detection.",
    "sections": [
      {
        "heading": "The document and the intended outcome",
        "paragraphs": [
          "Open an original and revised report side by side. Inspect matching pages, compare headings and changed paragraphs, then check page counts so inserted pages do not shift your comparisons."
        ]
      },
      {
        "heading": "Make this example work for your file",
        "paragraphs": [
          "For revised terms, compare matching sections rather than assuming the same PDF position contains the same paragraph. An inserted page can shift every later page without changing their actual content."
        ]
      },
      {
        "heading": "Choose only the settings this case needs",
        "paragraphs": [
          "Add the intended two versions in a clear order. Match zoom and corresponding positions, and keep a short list of differences as you review."
        ]
      },
      {
        "heading": "When the example needs a different approach",
        "paragraphs": [
          "Zoom into the relevant area and check source text when possible. Use a dedicated text-diff workflow for exhaustive wording comparison."
        ]
      }
    ],
    "tips": [
      "Add the intended two versions in a clear order. Match zoom and corresponding positions, and keep a short list of differences as you review.",
      "One version may contain an inserted or removed page. Align by headings or content instead of assuming page 4 matches page 4.",
      "Zoom into the relevant area and check source text when possible. Use a dedicated text-diff workflow for exhaustive wording comparison."
    ],
    "faq": [
      {
        "question": "The same position shows unrelated pages?",
        "answer": "One version may contain an inserted or removed page. Align by headings or content instead of assuming page 4 matches page 4."
      },
      {
        "question": "A small wording change is easy to miss?",
        "answer": "Zoom into the relevant area and check source text when possible. Use a dedicated text-diff workflow for exhaustive wording comparison."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Compare versions of a document."
      },
      {
        "question": "What should I check in the result?",
        "answer": "This is a comparison workspace, not guaranteed automatic semantic or legal difference detection."
      }
    ],
    "hero": {
      "input": "Original and revision",
      "output": "Side-by-side review"
    },
    "cta": "Open Compare PDFs →"
  },
  {
    "slug": "compare-pdfs-common-problems-and-how-to-fix-them",
    "title": "Compare PDFs: common problems and how to fix them",
    "category": "Pages",
    "tool": "compare-pdfs",
    "toolId": "compare",
    "toolNumber": 59,
    "summary": "Resolve the same position shows unrelated pages and a small wording change is easy to miss. Understand the limits before retrying.",
    "intent": "Troubleshooting",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Compare PDFs",
      "Troubleshooting"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Choose two PDFs and inspect corresponding pages side by side.",
      "Review differences visually, including dates, numbers and missing pages."
    ],
    "check": "This is a comparison workspace, not guaranteed automatic semantic or legal difference detection.",
    "limit": "This is a comparison workspace, not guaranteed automatic semantic or legal difference detection.",
    "sections": [
      {
        "heading": "The same position shows unrelated pages",
        "paragraphs": [
          "One version may contain an inserted or removed page. Align by headings or content instead of assuming page 4 matches page 4."
        ]
      },
      {
        "heading": "A small wording change is easy to miss",
        "paragraphs": [
          "Zoom into the relevant area and check source text when possible. Use a dedicated text-diff workflow for exhaustive wording comparison."
        ]
      },
      {
        "heading": "Check whether this is the right operation",
        "paragraphs": [
          "Side-by-side viewing helps a human compare appearance. It is not an automatic legal redline, semantic diff or proof that every change has been identified."
        ]
      },
      {
        "heading": "A more useful retry",
        "paragraphs": [
          "For revised terms, compare matching sections rather than assuming the same PDF position contains the same paragraph. An inserted page can shift every later page without changing their actual content."
        ]
      }
    ],
    "tips": [
      "Add the intended two versions in a clear order. Match zoom and corresponding positions, and keep a short list of differences as you review.",
      "One version may contain an inserted or removed page. Align by headings or content instead of assuming page 4 matches page 4.",
      "Zoom into the relevant area and check source text when possible. Use a dedicated text-diff workflow for exhaustive wording comparison."
    ],
    "faq": [
      {
        "question": "The same position shows unrelated pages?",
        "answer": "One version may contain an inserted or removed page. Align by headings or content instead of assuming page 4 matches page 4."
      },
      {
        "question": "A small wording change is easy to miss?",
        "answer": "Zoom into the relevant area and check source text when possible. Use a dedicated text-diff workflow for exhaustive wording comparison."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Compare versions of a document."
      },
      {
        "question": "What should I check in the result?",
        "answer": "This is a comparison workspace, not guaranteed automatic semantic or legal difference detection."
      }
    ],
    "hero": {
      "input": "Original and revision",
      "output": "Side-by-side review"
    },
    "cta": "Open Compare PDFs →"
  },
  {
    "slug": "protect-a-pdf-with-an-opening-password",
    "title": "Protect a PDF with an opening password",
    "category": "Privacy",
    "tool": "protect-pdf",
    "toolId": "encrypt",
    "toolNumber": 60,
    "summary": "A document needs an opening password before being sent.",
    "intent": "Practical example",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Protect PDF",
      "Practical example"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Choose an opening password of at least eight characters.",
      "Export the encrypted PDF and reopen it using that password."
    ],
    "check": "Keep the password safely and share it separately. There is no password recovery service.",
    "limit": "Keep the password safely and share it separately. There is no password recovery service.",
    "sections": [
      {
        "heading": "The document and the intended outcome",
        "paragraphs": [
          "A document needs an opening password before being sent. Choose a long passphrase, confirm it, create the protected copy and test correct and incorrect passwords in a reader."
        ]
      },
      {
        "heading": "Make this example work for your file",
        "paragraphs": [
          "For a confidential attachment, communicate the opening password through an appropriate separate channel. Test the download with the correct and an incorrect password. Encryption controls opening, not what an authenticated recipient can do afterwards."
        ]
      },
      {
        "heading": "Choose only the settings this case needs",
        "paragraphs": [
          "Use at least eight characters and prefer a longer memorable passphrase. Keep the password securely and share it separately from the document when appropriate."
        ]
      },
      {
        "heading": "When the example needs a different approach",
        "paragraphs": [
          "The tool does not provide password recovery. Keep a safe original and a secure password record rather than expecting an encrypted copy to be recoverable."
        ]
      }
    ],
    "tips": [
      "Use at least eight characters and prefer a longer memorable passphrase. Keep the password securely and share it separately from the document when appropriate.",
      "Re-enter both carefully and use Show password only in a private environment. Do not paste the password into a public issue or screenshot.",
      "The tool does not provide password recovery. Keep a safe original and a secure password record rather than expecting an encrypted copy to be recoverable."
    ],
    "faq": [
      {
        "question": "The two password fields do not match?",
        "answer": "Re-enter both carefully and use Show password only in a private environment. Do not paste the password into a public issue or screenshot."
      },
      {
        "question": "The password is forgotten?",
        "answer": "The tool does not provide password recovery. Keep a safe original and a secure password record rather than expecting an encrypted copy to be recoverable."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Require an opening password for a copy of your document."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Keep the password safely and share it separately. There is no password recovery service."
      }
    ],
    "hero": {
      "input": "Readable PDF",
      "output": "Password required"
    },
    "cta": "Open Protect PDF →"
  },
  {
    "slug": "protect-pdf-common-problems-and-how-to-fix-them",
    "title": "Protect PDF: common problems and how to fix them",
    "category": "Privacy",
    "tool": "protect-pdf",
    "toolId": "encrypt",
    "toolNumber": 60,
    "summary": "Resolve the two password fields do not match and the password is forgotten. Understand the limits before retrying.",
    "intent": "Troubleshooting",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Protect PDF",
      "Troubleshooting"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Choose an opening password of at least eight characters.",
      "Export the encrypted PDF and reopen it using that password."
    ],
    "check": "Keep the password safely and share it separately. There is no password recovery service.",
    "limit": "Keep the password safely and share it separately. There is no password recovery service.",
    "sections": [
      {
        "heading": "The two password fields do not match",
        "paragraphs": [
          "Re-enter both carefully and use Show password only in a private environment. Do not paste the password into a public issue or screenshot."
        ]
      },
      {
        "heading": "The password is forgotten",
        "paragraphs": [
          "The tool does not provide password recovery. Keep a safe original and a secure password record rather than expecting an encrypted copy to be recoverable."
        ]
      },
      {
        "heading": "Check whether this is the right operation",
        "paragraphs": [
          "Opening-password encryption controls access to the encrypted file. It does not prevent a recipient who knows the password from photographing or copying readable content."
        ]
      },
      {
        "heading": "A more useful retry",
        "paragraphs": [
          "For a confidential attachment, communicate the opening password through an appropriate separate channel. Test the download with the correct and an incorrect password. Encryption controls opening, not what an authenticated recipient can do afterwards."
        ]
      }
    ],
    "tips": [
      "Use at least eight characters and prefer a longer memorable passphrase. Keep the password securely and share it separately from the document when appropriate.",
      "Re-enter both carefully and use Show password only in a private environment. Do not paste the password into a public issue or screenshot.",
      "The tool does not provide password recovery. Keep a safe original and a secure password record rather than expecting an encrypted copy to be recoverable."
    ],
    "faq": [
      {
        "question": "The two password fields do not match?",
        "answer": "Re-enter both carefully and use Show password only in a private environment. Do not paste the password into a public issue or screenshot."
      },
      {
        "question": "The password is forgotten?",
        "answer": "The tool does not provide password recovery. Keep a safe original and a secure password record rather than expecting an encrypted copy to be recoverable."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Require an opening password for a copy of your document."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Keep the password safely and share it separately. There is no password recovery service."
      }
    ],
    "hero": {
      "input": "Readable PDF",
      "output": "Password required"
    },
    "cta": "Open Protect PDF →"
  },
  {
    "slug": "remove-a-known-opening-password-from-your-own-pdf-copy",
    "title": "Remove a known opening password from your own PDF copy",
    "category": "Privacy",
    "tool": "unlock-pdf",
    "toolId": "decrypt",
    "toolNumber": 61,
    "summary": "A password-protected document must be edited locally.",
    "intent": "Practical example",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Remove password",
      "Practical example"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Choose the protected PDF and enter a password you know.",
      "Export the unlocked copy and confirm it opens without prompting."
    ],
    "check": "The correct password is required. This does not bypass unknown passwords or access permissions.",
    "limit": "The correct password is required. This does not bypass unknown passwords or access permissions.",
    "sections": [
      {
        "heading": "The document and the intended outcome",
        "paragraphs": [
          "A password-protected document must be edited locally. Enter the current password, export an unlocked copy and reopen it without credentials before starting another edit."
        ]
      },
      {
        "heading": "Make this example work for your file",
        "paragraphs": [
          "For your own protected document, use the known opening password and inspect the unlocked copy before editing. Keep the protected original if it remains your archival version; the new copy no longer requires that opening password."
        ]
      },
      {
        "heading": "Choose only the settings this case needs",
        "paragraphs": [
          "Use the correct current password and check that the unlocked copy still has the expected pages. Protect the unlocked file appropriately because it can now open without credentials."
        ]
      },
      {
        "heading": "When the example needs a different approach",
        "paragraphs": [
          "Open the newly downloaded unlocked PDF as the next source. A reader session can still retain the original encrypted bytes."
        ]
      }
    ],
    "tips": [
      "Use the correct current password and check that the unlocked copy still has the expected pages. Protect the unlocked file appropriately because it can now open without credentials.",
      "Check spelling, case and the exact source file. This operation does not guess or bypass an unknown password.",
      "Open the newly downloaded unlocked PDF as the next source. A reader session can still retain the original encrypted bytes."
    ],
    "faq": [
      {
        "question": "The password is rejected?",
        "answer": "Check spelling, case and the exact source file. This operation does not guess or bypass an unknown password."
      },
      {
        "question": "Editing still reports an encrypted document?",
        "answer": "Open the newly downloaded unlocked PDF as the next source. A reader session can still retain the original encrypted bytes."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Remove an opening password from a document you are authorized to use."
      },
      {
        "question": "What should I check in the result?",
        "answer": "The correct password is required. This does not bypass unknown passwords or access permissions."
      }
    ],
    "hero": {
      "input": "Encrypted PDF",
      "output": "Unlocked copy"
    },
    "cta": "Open Remove password →"
  },
  {
    "slug": "remove-password-common-problems-and-how-to-fix-them",
    "title": "Remove password: common problems and how to fix them",
    "category": "Privacy",
    "tool": "unlock-pdf",
    "toolId": "decrypt",
    "toolNumber": 61,
    "summary": "Resolve the password is rejected and editing still reports an encrypted document. Understand the limits before retrying.",
    "intent": "Troubleshooting",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Remove password",
      "Troubleshooting"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Choose the protected PDF and enter a password you know.",
      "Export the unlocked copy and confirm it opens without prompting."
    ],
    "check": "The correct password is required. This does not bypass unknown passwords or access permissions.",
    "limit": "The correct password is required. This does not bypass unknown passwords or access permissions.",
    "sections": [
      {
        "heading": "The password is rejected",
        "paragraphs": [
          "Check spelling, case and the exact source file. This operation does not guess or bypass an unknown password."
        ]
      },
      {
        "heading": "Editing still reports an encrypted document",
        "paragraphs": [
          "Open the newly downloaded unlocked PDF as the next source. A reader session can still retain the original encrypted bytes."
        ]
      },
      {
        "heading": "Check whether this is the right operation",
        "paragraphs": [
          "Decryption requires a password you know and authorization to use the document. A reader temporarily opening an encrypted file does not itself remove protection from the saved source."
        ]
      },
      {
        "heading": "A more useful retry",
        "paragraphs": [
          "For your own protected document, use the known opening password and inspect the unlocked copy before editing. Keep the protected original if it remains your archival version; the new copy no longer requires that opening password."
        ]
      }
    ],
    "tips": [
      "Use the correct current password and check that the unlocked copy still has the expected pages. Protect the unlocked file appropriately because it can now open without credentials.",
      "Check spelling, case and the exact source file. This operation does not guess or bypass an unknown password.",
      "Open the newly downloaded unlocked PDF as the next source. A reader session can still retain the original encrypted bytes."
    ],
    "faq": [
      {
        "question": "The password is rejected?",
        "answer": "Check spelling, case and the exact source file. This operation does not guess or bypass an unknown password."
      },
      {
        "question": "Editing still reports an encrypted document?",
        "answer": "Open the newly downloaded unlocked PDF as the next source. A reader session can still retain the original encrypted bytes."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Remove an opening password from a document you are authorized to use."
      },
      {
        "question": "What should I check in the result?",
        "answer": "The correct password is required. This does not bypass unknown passwords or access permissions."
      }
    ],
    "hero": {
      "input": "Encrypted PDF",
      "output": "Unlocked copy"
    },
    "cta": "Open Remove password →"
  },
  {
    "slug": "how-to-review-a-pdf-for-possible-private-information",
    "title": "How to review a PDF for possible private information",
    "category": "Privacy",
    "tool": "privacy-scanner",
    "toolId": "privacy",
    "toolNumber": 62,
    "summary": "Inspect metadata and text patterns. Learn the available controls, a practical example and what to check.",
    "intent": "How-to",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Privacy scanner",
      "How-to"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Open a PDF with readable text and review the metadata and pattern findings.",
      "Inspect each finding against the original document before deciding what to remove."
    ],
    "check": "Pattern matching can miss sensitive information and flag harmless text. It is not a complete security audit.",
    "limit": "Pattern matching can miss sensitive data or flag harmless text. Review the document before sharing.",
    "sections": [
      {
        "heading": "What this tool actually does",
        "paragraphs": [
          "The scanner uses patterns and properties. It can miss sensitive data and flag harmless values; a clean report is not a certification that sharing is safe."
        ]
      },
      {
        "heading": "Choose the controls for your document",
        "paragraphs": [
          "Treat findings as leads for review. Use Redact for retained-page regions, Remove metadata for standard properties and attachment cleanup for companion files as separate deliberate actions."
        ]
      },
      {
        "heading": "Before your first export",
        "paragraphs": [
          "For a public report, review findings in context and manually check visible personal information. A pattern can identify a harmless reference number or miss a name entirely, so the report is a review aid rather than clearance to publish."
        ]
      },
      {
        "heading": "A harmless number is flagged",
        "paragraphs": [
          "Check its context and decide whether it identifies anyone. Pattern matching cannot know every business meaning."
        ]
      }
    ],
    "tips": [
      "Treat findings as leads for review. Use Redact for retained-page regions, Remove metadata for standard properties and attachment cleanup for companion files as separate deliberate actions.",
      "Check its context and decide whether it identifies anyone. Pattern matching cannot know every business meaning.",
      "Inspect the whole document and scans manually. Image text or unusual identifier formats may not match the scanner’s available patterns."
    ],
    "faq": [
      {
        "question": "A harmless number is flagged?",
        "answer": "Check its context and decide whether it identifies anyone. Pattern matching cannot know every business meaning."
      },
      {
        "question": "A private detail is not flagged?",
        "answer": "Inspect the whole document and scans manually. Image text or unusual identifier formats may not match the scanner’s available patterns."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Check common patterns and standard document properties before sharing."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Pattern matching can miss sensitive information and flag harmless text. It is not a complete security audit."
      }
    ],
    "hero": {
      "input": "Document clues",
      "output": "Review findings"
    },
    "cta": "Open Privacy scanner →"
  },
  {
    "slug": "review-privacy-warnings-before-sharing-a-pdf",
    "title": "Review privacy warnings before sharing a PDF",
    "category": "Privacy",
    "tool": "privacy-scanner",
    "toolId": "privacy",
    "toolNumber": 62,
    "summary": "A report needs a privacy review.",
    "intent": "Practical example",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Privacy scanner",
      "Practical example"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Open a PDF with readable text and review the metadata and pattern findings.",
      "Inspect each finding against the original document before deciding what to remove."
    ],
    "check": "Pattern matching can miss sensitive information and flag harmless text. It is not a complete security audit.",
    "limit": "Pattern matching can miss sensitive data or flag harmless text. Review the document before sharing.",
    "sections": [
      {
        "heading": "The document and the intended outcome",
        "paragraphs": [
          "A report needs a privacy review. Scan it, examine flagged text and metadata, then manually inspect visible names, headers, comments and embedded files before deciding what to change."
        ]
      },
      {
        "heading": "Make this example work for your file",
        "paragraphs": [
          "For a public report, review findings in context and manually check visible personal information. A pattern can identify a harmless reference number or miss a name entirely, so the report is a review aid rather than clearance to publish."
        ]
      },
      {
        "heading": "Choose only the settings this case needs",
        "paragraphs": [
          "Treat findings as leads for review. Use Redact for retained-page regions, Remove metadata for standard properties and attachment cleanup for companion files as separate deliberate actions."
        ]
      },
      {
        "heading": "When the example needs a different approach",
        "paragraphs": [
          "Inspect the whole document and scans manually. Image text or unusual identifier formats may not match the scanner’s available patterns."
        ]
      }
    ],
    "tips": [
      "Treat findings as leads for review. Use Redact for retained-page regions, Remove metadata for standard properties and attachment cleanup for companion files as separate deliberate actions.",
      "Check its context and decide whether it identifies anyone. Pattern matching cannot know every business meaning.",
      "Inspect the whole document and scans manually. Image text or unusual identifier formats may not match the scanner’s available patterns."
    ],
    "faq": [
      {
        "question": "A harmless number is flagged?",
        "answer": "Check its context and decide whether it identifies anyone. Pattern matching cannot know every business meaning."
      },
      {
        "question": "A private detail is not flagged?",
        "answer": "Inspect the whole document and scans manually. Image text or unusual identifier formats may not match the scanner’s available patterns."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Check common patterns and standard document properties before sharing."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Pattern matching can miss sensitive information and flag harmless text. It is not a complete security audit."
      }
    ],
    "hero": {
      "input": "Document clues",
      "output": "Review findings"
    },
    "cta": "Open Privacy scanner →"
  },
  {
    "slug": "privacy-scanner-common-problems-and-how-to-fix-them",
    "title": "Privacy scanner: common problems and how to fix them",
    "category": "Privacy",
    "tool": "privacy-scanner",
    "toolId": "privacy",
    "toolNumber": 62,
    "summary": "Resolve a harmless number is flagged and a private detail is not flagged. Understand the limits before retrying.",
    "intent": "Troubleshooting",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Privacy scanner",
      "Troubleshooting"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Open a PDF with readable text and review the metadata and pattern findings.",
      "Inspect each finding against the original document before deciding what to remove."
    ],
    "check": "Pattern matching can miss sensitive information and flag harmless text. It is not a complete security audit.",
    "limit": "Pattern matching can miss sensitive data or flag harmless text. Review the document before sharing.",
    "sections": [
      {
        "heading": "A harmless number is flagged",
        "paragraphs": [
          "Check its context and decide whether it identifies anyone. Pattern matching cannot know every business meaning."
        ]
      },
      {
        "heading": "A private detail is not flagged",
        "paragraphs": [
          "Inspect the whole document and scans manually. Image text or unusual identifier formats may not match the scanner’s available patterns."
        ]
      },
      {
        "heading": "Check whether this is the right operation",
        "paragraphs": [
          "The scanner uses patterns and properties. It can miss sensitive data and flag harmless values; a clean report is not a certification that sharing is safe."
        ]
      },
      {
        "heading": "A more useful retry",
        "paragraphs": [
          "For a public report, review findings in context and manually check visible personal information. A pattern can identify a harmless reference number or miss a name entirely, so the report is a review aid rather than clearance to publish."
        ]
      }
    ],
    "tips": [
      "Treat findings as leads for review. Use Redact for retained-page regions, Remove metadata for standard properties and attachment cleanup for companion files as separate deliberate actions.",
      "Check its context and decide whether it identifies anyone. Pattern matching cannot know every business meaning.",
      "Inspect the whole document and scans manually. Image text or unusual identifier formats may not match the scanner’s available patterns."
    ],
    "faq": [
      {
        "question": "A harmless number is flagged?",
        "answer": "Check its context and decide whether it identifies anyone. Pattern matching cannot know every business meaning."
      },
      {
        "question": "A private detail is not flagged?",
        "answer": "Inspect the whole document and scans manually. Image text or unusual identifier formats may not match the scanner’s available patterns."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Check common patterns and standard document properties before sharing."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Pattern matching can miss sensitive information and flag harmless text. It is not a complete security audit."
      }
    ],
    "hero": {
      "input": "Document clues",
      "output": "Review findings"
    },
    "cta": "Open Privacy scanner →"
  },
  {
    "slug": "how-to-remove-standard-pdf-metadata",
    "title": "How to remove standard PDF metadata",
    "category": "Privacy",
    "tool": "remove-pdf-metadata",
    "toolId": "clean",
    "toolNumber": 63,
    "summary": "Clear standard document properties. Learn the available controls, a practical example and what to check.",
    "intent": "How-to",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Remove metadata",
      "How-to"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Review which standard document properties need clearing.",
      "Export and check title, author, subject and other standard properties."
    ],
    "check": "This is not complete sanitization of attachments, hidden objects or visible personal details.",
    "limit": "Clears standard title, author, subject, keywords, producer and dates. It is not a complete sanitization of every hidden object.",
    "sections": [
      {
        "heading": "What this tool actually does",
        "paragraphs": [
          "This clears standard descriptive fields. It does not scrub every hidden object, erase visible names or guarantee removal of historical bytes and attachments."
        ]
      },
      {
        "heading": "Choose the controls for your document",
        "paragraphs": [
          "Use the output as a targeted cleanup step. Compare Title, Author, Subject, Keywords, Producer and dates in a reader that exposes document properties."
        ]
      },
      {
        "heading": "Before your first export",
        "paragraphs": [
          "For a shared report, inspect standard properties after export and review visible names separately. Clearing the author property does not remove a name printed in the header, an embedded attachment or every custom object."
        ]
      },
      {
        "heading": "A name remains on the cover",
        "paragraphs": [
          "That is visible page content. Decide whether a text edit or redaction is necessary; metadata cleanup does not alter the page wording."
        ]
      }
    ],
    "tips": [
      "Use the output as a targeted cleanup step. Compare Title, Author, Subject, Keywords, Producer and dates in a reader that exposes document properties.",
      "That is visible page content. Decide whether a text edit or redaction is necessary; metadata cleanup does not alter the page wording.",
      "Some readers or later save operations add their own properties. Inspect the exact downloaded file before opening and resaving it elsewhere."
    ],
    "faq": [
      {
        "question": "A name remains on the cover?",
        "answer": "That is visible page content. Decide whether a text edit or redaction is necessary; metadata cleanup does not alter the page wording."
      },
      {
        "question": "The reader shows new application information?",
        "answer": "Some readers or later save operations add their own properties. Inspect the exact downloaded file before opening and resaving it elsewhere."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Remove standard identifying metadata."
      },
      {
        "question": "What should I check in the result?",
        "answer": "This is not complete sanitization of attachments, hidden objects or visible personal details."
      }
    ],
    "hero": {
      "input": "Standard properties",
      "output": "Cleared properties"
    },
    "cta": "Open Remove metadata →",
    "evidence": {
      "id": "clean",
      "input": "/examples/verified-tools/clean-input.pdf",
      "output": "/examples/verified-tools/clean-result.pdf",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "Standard author property is absent.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      },
      "preview": {
        "input": "/examples/verified-tools/clean-input.png",
        "output": "/examples/verified-tools/clean-result.png"
      }
    }
  },
  {
    "slug": "clear-stale-document-properties-from-a-sharing-copy",
    "title": "Clear stale document properties from a sharing copy",
    "category": "Privacy",
    "tool": "remove-pdf-metadata",
    "toolId": "clean",
    "toolNumber": 63,
    "summary": "A document’s standard Author and Title properties contain an old name.",
    "intent": "Practical example",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Remove metadata",
      "Practical example"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Review which standard document properties need clearing.",
      "Export and check title, author, subject and other standard properties."
    ],
    "check": "This is not complete sanitization of attachments, hidden objects or visible personal details.",
    "limit": "Clears standard title, author, subject, keywords, producer and dates. It is not a complete sanitization of every hidden object.",
    "sections": [
      {
        "heading": "The document and the intended outcome",
        "paragraphs": [
          "A document’s standard Author and Title properties contain an old name. Remove metadata, then reopen properties and inspect visible pages independently."
        ]
      },
      {
        "heading": "Make this example work for your file",
        "paragraphs": [
          "For a shared report, inspect standard properties after export and review visible names separately. Clearing the author property does not remove a name printed in the header, an embedded attachment or every custom object."
        ]
      },
      {
        "heading": "Choose only the settings this case needs",
        "paragraphs": [
          "Use the output as a targeted cleanup step. Compare Title, Author, Subject, Keywords, Producer and dates in a reader that exposes document properties."
        ]
      },
      {
        "heading": "When the example needs a different approach",
        "paragraphs": [
          "Some readers or later save operations add their own properties. Inspect the exact downloaded file before opening and resaving it elsewhere."
        ]
      }
    ],
    "tips": [
      "Use the output as a targeted cleanup step. Compare Title, Author, Subject, Keywords, Producer and dates in a reader that exposes document properties.",
      "That is visible page content. Decide whether a text edit or redaction is necessary; metadata cleanup does not alter the page wording.",
      "Some readers or later save operations add their own properties. Inspect the exact downloaded file before opening and resaving it elsewhere."
    ],
    "faq": [
      {
        "question": "A name remains on the cover?",
        "answer": "That is visible page content. Decide whether a text edit or redaction is necessary; metadata cleanup does not alter the page wording."
      },
      {
        "question": "The reader shows new application information?",
        "answer": "Some readers or later save operations add their own properties. Inspect the exact downloaded file before opening and resaving it elsewhere."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Remove standard identifying metadata."
      },
      {
        "question": "What should I check in the result?",
        "answer": "This is not complete sanitization of attachments, hidden objects or visible personal details."
      }
    ],
    "hero": {
      "input": "Standard properties",
      "output": "Cleared properties"
    },
    "cta": "Open Remove metadata →",
    "evidence": {
      "id": "clean",
      "input": "/examples/verified-tools/clean-input.pdf",
      "output": "/examples/verified-tools/clean-result.pdf",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "Standard author property is absent.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      },
      "preview": {
        "input": "/examples/verified-tools/clean-input.png",
        "output": "/examples/verified-tools/clean-result.png"
      }
    }
  },
  {
    "slug": "remove-metadata-common-problems-and-how-to-fix-them",
    "title": "Remove metadata: common problems and how to fix them",
    "category": "Privacy",
    "tool": "remove-pdf-metadata",
    "toolId": "clean",
    "toolNumber": 63,
    "summary": "Resolve a name remains on the cover and the reader shows new application information. Understand the limits before retrying.",
    "intent": "Troubleshooting",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Remove metadata",
      "Troubleshooting"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Review which standard document properties need clearing.",
      "Export and check title, author, subject and other standard properties."
    ],
    "check": "This is not complete sanitization of attachments, hidden objects or visible personal details.",
    "limit": "Clears standard title, author, subject, keywords, producer and dates. It is not a complete sanitization of every hidden object.",
    "sections": [
      {
        "heading": "A name remains on the cover",
        "paragraphs": [
          "That is visible page content. Decide whether a text edit or redaction is necessary; metadata cleanup does not alter the page wording."
        ]
      },
      {
        "heading": "The reader shows new application information",
        "paragraphs": [
          "Some readers or later save operations add their own properties. Inspect the exact downloaded file before opening and resaving it elsewhere."
        ]
      },
      {
        "heading": "Check whether this is the right operation",
        "paragraphs": [
          "This clears standard descriptive fields. It does not scrub every hidden object, erase visible names or guarantee removal of historical bytes and attachments."
        ]
      },
      {
        "heading": "A more useful retry",
        "paragraphs": [
          "For a shared report, inspect standard properties after export and review visible names separately. Clearing the author property does not remove a name printed in the header, an embedded attachment or every custom object."
        ]
      }
    ],
    "tips": [
      "Use the output as a targeted cleanup step. Compare Title, Author, Subject, Keywords, Producer and dates in a reader that exposes document properties.",
      "That is visible page content. Decide whether a text edit or redaction is necessary; metadata cleanup does not alter the page wording.",
      "Some readers or later save operations add their own properties. Inspect the exact downloaded file before opening and resaving it elsewhere."
    ],
    "faq": [
      {
        "question": "A name remains on the cover?",
        "answer": "That is visible page content. Decide whether a text edit or redaction is necessary; metadata cleanup does not alter the page wording."
      },
      {
        "question": "The reader shows new application information?",
        "answer": "Some readers or later save operations add their own properties. Inspect the exact downloaded file before opening and resaving it elsewhere."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Remove standard identifying metadata."
      },
      {
        "question": "What should I check in the result?",
        "answer": "This is not complete sanitization of attachments, hidden objects or visible personal details."
      }
    ],
    "hero": {
      "input": "Standard properties",
      "output": "Cleared properties"
    },
    "cta": "Open Remove metadata →",
    "evidence": {
      "id": "clean",
      "input": "/examples/verified-tools/clean-input.pdf",
      "output": "/examples/verified-tools/clean-result.pdf",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "Standard author property is absent.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      },
      "preview": {
        "input": "/examples/verified-tools/clean-input.png",
        "output": "/examples/verified-tools/clean-result.png"
      }
    }
  },
  {
    "slug": "check-whether-two-pdf-copies-have-identical-bytes",
    "title": "Check whether two PDF copies have identical bytes",
    "category": "Privacy",
    "tool": "file-fingerprint",
    "toolId": "hash",
    "toolNumber": 64,
    "summary": "A sender provides a SHA-256 value for a PDF.",
    "intent": "Practical example",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Calculate SHA-256",
      "Practical example"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Choose the PDF whose exact bytes you want to identify.",
      "Calculate the SHA-256 value and copy it for comparison."
    ],
    "check": "Any byte change alters the hash. A matching hash does not identify the author or verify a digital signature.",
    "limit": "Any byte change alters the hash. A matching hash does not identify the author or verify a digital signature.",
    "sections": [
      {
        "heading": "The document and the intended outcome",
        "paragraphs": [
          "A sender provides a SHA-256 value for a PDF. Calculate the value for the received file and compare all 64 hexadecimal characters, using a trusted reference channel."
        ]
      },
      {
        "heading": "Make this example work for your file",
        "paragraphs": [
          "For a transfer check, compare the full digest with one obtained from the exact original file. Matching filenames or page counts are insufficient. Any saved change, including metadata changes, can produce a different digest."
        ]
      },
      {
        "heading": "Choose only the settings this case needs",
        "paragraphs": [
          "Compare the complete digest and exact file, not a renamed substitute. A matching value is useful only when the reference value itself comes from a trusted source."
        ]
      },
      {
        "heading": "When the example needs a different approach",
        "paragraphs": [
          "A hash alone does not establish trust or authenticity. Obtain a trusted reference or a proper signing method when source identity matters."
        ]
      }
    ],
    "tips": [
      "Compare the complete digest and exact file, not a renamed substitute. A matching value is useful only when the reference value itself comes from a trusted source.",
      "Any byte change can alter SHA-256, including metadata. Compare the correct versions; a mismatch does not identify which visible part changed.",
      "A hash alone does not establish trust or authenticity. Obtain a trusted reference or a proper signing method when source identity matters."
    ],
    "faq": [
      {
        "question": "The hashes differ after an edit?",
        "answer": "Any byte change can alter SHA-256, including metadata. Compare the correct versions; a mismatch does not identify which visible part changed."
      },
      {
        "question": "The hash looks correct but the source is unknown?",
        "answer": "A hash alone does not establish trust or authenticity. Obtain a trusted reference or a proper signing method when source identity matters."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Check whether two file copies have identical bytes."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Any byte change alters the hash. A matching hash does not identify the author or verify a digital signature."
      }
    ],
    "hero": {
      "input": "File bytes",
      "output": "SHA-256 digest"
    },
    "cta": "Open Calculate SHA-256 →",
    "evidence": {
      "id": "hash",
      "input": "/examples/verified-tools/hash-input.pdf",
      "output": "/examples/verified-tools/hash-result.txt",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "Digest matches an independent SHA-256 calculation.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      }
    }
  },
  {
    "slug": "calculate-sha-256-common-problems-and-how-to-fix-them",
    "title": "Calculate SHA-256: common problems and how to fix them",
    "category": "Privacy",
    "tool": "file-fingerprint",
    "toolId": "hash",
    "toolNumber": 64,
    "summary": "Resolve the hashes differ after an edit and the hash looks correct but the source is unknown. Understand the limits before retrying.",
    "intent": "Troubleshooting",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Calculate SHA-256",
      "Troubleshooting"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Choose the PDF whose exact bytes you want to identify.",
      "Calculate the SHA-256 value and copy it for comparison."
    ],
    "check": "Any byte change alters the hash. A matching hash does not identify the author or verify a digital signature.",
    "limit": "Any byte change alters the hash. A matching hash does not identify the author or verify a digital signature.",
    "sections": [
      {
        "heading": "The hashes differ after an edit",
        "paragraphs": [
          "Any byte change can alter SHA-256, including metadata. Compare the correct versions; a mismatch does not identify which visible part changed."
        ]
      },
      {
        "heading": "The hash looks correct but the source is unknown",
        "paragraphs": [
          "A hash alone does not establish trust or authenticity. Obtain a trusted reference or a proper signing method when source identity matters."
        ]
      },
      {
        "heading": "Check whether this is the right operation",
        "paragraphs": [
          "A file hash fingerprints bytes, not the document’s meaning or author. Two visually identical PDFs can have different hashes after metadata or serialization changes."
        ]
      },
      {
        "heading": "A more useful retry",
        "paragraphs": [
          "For a transfer check, compare the full digest with one obtained from the exact original file. Matching filenames or page counts are insufficient. Any saved change, including metadata changes, can produce a different digest."
        ]
      }
    ],
    "tips": [
      "Compare the complete digest and exact file, not a renamed substitute. A matching value is useful only when the reference value itself comes from a trusted source.",
      "Any byte change can alter SHA-256, including metadata. Compare the correct versions; a mismatch does not identify which visible part changed.",
      "A hash alone does not establish trust or authenticity. Obtain a trusted reference or a proper signing method when source identity matters."
    ],
    "faq": [
      {
        "question": "The hashes differ after an edit?",
        "answer": "Any byte change can alter SHA-256, including metadata. Compare the correct versions; a mismatch does not identify which visible part changed."
      },
      {
        "question": "The hash looks correct but the source is unknown?",
        "answer": "A hash alone does not establish trust or authenticity. Obtain a trusted reference or a proper signing method when source identity matters."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Check whether two file copies have identical bytes."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Any byte change alters the hash. A matching hash does not identify the author or verify a digital signature."
      }
    ],
    "hero": {
      "input": "File bytes",
      "output": "SHA-256 digest"
    },
    "cta": "Open Calculate SHA-256 →",
    "evidence": {
      "id": "hash",
      "input": "/examples/verified-tools/hash-input.pdf",
      "output": "/examples/verified-tools/hash-result.txt",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "Digest matches an independent SHA-256 calculation.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      }
    }
  },
  {
    "slug": "how-to-bundle-separate-pdfs-in-a-zip",
    "title": "How to bundle separate PDFs in a ZIP",
    "category": "Pages",
    "tool": "bundle-pdfs",
    "toolId": "zip",
    "toolNumber": 65,
    "summary": "Put your PDF files in a ZIP. Learn the available controls, a practical example and what to check.",
    "intent": "How-to",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Bundle PDFs",
      "How-to"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Choose the PDF files to include in one archive.",
      "Download the ZIP and check that all intended files are present."
    ],
    "check": "ZIP packaging does not merge pages into a PDF or necessarily reduce the size of already compressed files.",
    "limit": "ZIP packaging does not merge pages into a PDF or necessarily reduce the size of already compressed files.",
    "sections": [
      {
        "heading": "What this tool actually does",
        "paragraphs": [
          "ZIP packaging keeps documents separate. It does not combine pages into one PDF, add OCR or guarantee that already compressed PDF bytes become substantially smaller."
        ]
      },
      {
        "heading": "Choose the controls for your document",
        "paragraphs": [
          "Use clear unique filenames and check the input set before bundling. Open at least one extracted PDF and confirm the archive contains the expected number of documents."
        ]
      },
      {
        "heading": "Before your first export",
        "paragraphs": [
          "For an archive, use distinctive source filenames and check extracted files individually. A ZIP keeps separate documents together; it is different from merging their pages into one PDF and does not encrypt them by default."
        ]
      },
      {
        "heading": "The recipient cannot open the ZIP as a PDF",
        "paragraphs": [
          "Explain that it must be extracted using a file manager. Use Merge instead if the recipient requires one continuous document."
        ]
      }
    ],
    "tips": [
      "Use clear unique filenames and check the input set before bundling. Open at least one extracted PDF and confirm the archive contains the expected number of documents.",
      "Explain that it must be extracted using a file manager. Use Merge instead if the recipient requires one continuous document.",
      "PDF content is often already compressed. Bundling is primarily a delivery convenience, not a guaranteed size reduction."
    ],
    "faq": [
      {
        "question": "The recipient cannot open the ZIP as a PDF?",
        "answer": "Explain that it must be extracted using a file manager. Use Merge instead if the recipient requires one continuous document."
      },
      {
        "question": "The archive is barely smaller?",
        "answer": "PDF content is often already compressed. Bundling is primarily a delivery convenience, not a guaranteed size reduction."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Package several PDFs for a single download."
      },
      {
        "question": "What should I check in the result?",
        "answer": "ZIP packaging does not merge pages into a PDF or necessarily reduce the size of already compressed files."
      }
    ],
    "hero": {
      "input": "Separate PDFs",
      "output": "One ZIP archive"
    },
    "cta": "Open Bundle PDFs →",
    "evidence": {
      "id": "zip",
      "input": "/examples/verified-tools/zip-input.pdf",
      "output": "/examples/verified-tools/zip-result.zip",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "Archived source bytes match the original.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      }
    }
  },
  {
    "slug": "bundle-related-pdfs-without-merging-their-pages",
    "title": "Bundle related PDFs without merging their pages",
    "category": "Pages",
    "tool": "bundle-pdfs",
    "toolId": "zip",
    "toolNumber": 65,
    "summary": "A recipient needs three original PDFs in one download.",
    "intent": "Practical example",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Bundle PDFs",
      "Practical example"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Choose the PDF files to include in one archive.",
      "Download the ZIP and check that all intended files are present."
    ],
    "check": "ZIP packaging does not merge pages into a PDF or necessarily reduce the size of already compressed files.",
    "limit": "ZIP packaging does not merge pages into a PDF or necessarily reduce the size of already compressed files.",
    "sections": [
      {
        "heading": "The document and the intended outcome",
        "paragraphs": [
          "A recipient needs three original PDFs in one download. Bundle them into a ZIP, extract the archive and confirm the filenames and file contents remain individually usable."
        ]
      },
      {
        "heading": "Make this example work for your file",
        "paragraphs": [
          "For an archive, use distinctive source filenames and check extracted files individually. A ZIP keeps separate documents together; it is different from merging their pages into one PDF and does not encrypt them by default."
        ]
      },
      {
        "heading": "Choose only the settings this case needs",
        "paragraphs": [
          "Use clear unique filenames and check the input set before bundling. Open at least one extracted PDF and confirm the archive contains the expected number of documents."
        ]
      },
      {
        "heading": "When the example needs a different approach",
        "paragraphs": [
          "PDF content is often already compressed. Bundling is primarily a delivery convenience, not a guaranteed size reduction."
        ]
      }
    ],
    "tips": [
      "Use clear unique filenames and check the input set before bundling. Open at least one extracted PDF and confirm the archive contains the expected number of documents.",
      "Explain that it must be extracted using a file manager. Use Merge instead if the recipient requires one continuous document.",
      "PDF content is often already compressed. Bundling is primarily a delivery convenience, not a guaranteed size reduction."
    ],
    "faq": [
      {
        "question": "The recipient cannot open the ZIP as a PDF?",
        "answer": "Explain that it must be extracted using a file manager. Use Merge instead if the recipient requires one continuous document."
      },
      {
        "question": "The archive is barely smaller?",
        "answer": "PDF content is often already compressed. Bundling is primarily a delivery convenience, not a guaranteed size reduction."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Package several PDFs for a single download."
      },
      {
        "question": "What should I check in the result?",
        "answer": "ZIP packaging does not merge pages into a PDF or necessarily reduce the size of already compressed files."
      }
    ],
    "hero": {
      "input": "Separate PDFs",
      "output": "One ZIP archive"
    },
    "cta": "Open Bundle PDFs →",
    "evidence": {
      "id": "zip",
      "input": "/examples/verified-tools/zip-input.pdf",
      "output": "/examples/verified-tools/zip-result.zip",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "Archived source bytes match the original.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      }
    }
  },
  {
    "slug": "bundle-pdfs-common-problems-and-how-to-fix-them",
    "title": "Bundle PDFs: common problems and how to fix them",
    "category": "Pages",
    "tool": "bundle-pdfs",
    "toolId": "zip",
    "toolNumber": 65,
    "summary": "Resolve the recipient cannot open the zip as a pdf and the archive is barely smaller. Understand the limits before retrying.",
    "intent": "Troubleshooting",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Bundle PDFs",
      "Troubleshooting"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Choose the PDF files to include in one archive.",
      "Download the ZIP and check that all intended files are present."
    ],
    "check": "ZIP packaging does not merge pages into a PDF or necessarily reduce the size of already compressed files.",
    "limit": "ZIP packaging does not merge pages into a PDF or necessarily reduce the size of already compressed files.",
    "sections": [
      {
        "heading": "The recipient cannot open the ZIP as a PDF",
        "paragraphs": [
          "Explain that it must be extracted using a file manager. Use Merge instead if the recipient requires one continuous document."
        ]
      },
      {
        "heading": "The archive is barely smaller",
        "paragraphs": [
          "PDF content is often already compressed. Bundling is primarily a delivery convenience, not a guaranteed size reduction."
        ]
      },
      {
        "heading": "Check whether this is the right operation",
        "paragraphs": [
          "ZIP packaging keeps documents separate. It does not combine pages into one PDF, add OCR or guarantee that already compressed PDF bytes become substantially smaller."
        ]
      },
      {
        "heading": "A more useful retry",
        "paragraphs": [
          "For an archive, use distinctive source filenames and check extracted files individually. A ZIP keeps separate documents together; it is different from merging their pages into one PDF and does not encrypt them by default."
        ]
      }
    ],
    "tips": [
      "Use clear unique filenames and check the input set before bundling. Open at least one extracted PDF and confirm the archive contains the expected number of documents.",
      "Explain that it must be extracted using a file manager. Use Merge instead if the recipient requires one continuous document.",
      "PDF content is often already compressed. Bundling is primarily a delivery convenience, not a guaranteed size reduction."
    ],
    "faq": [
      {
        "question": "The recipient cannot open the ZIP as a PDF?",
        "answer": "Explain that it must be extracted using a file manager. Use Merge instead if the recipient requires one continuous document."
      },
      {
        "question": "The archive is barely smaller?",
        "answer": "PDF content is often already compressed. Bundling is primarily a delivery convenience, not a guaranteed size reduction."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Package several PDFs for a single download."
      },
      {
        "question": "What should I check in the result?",
        "answer": "ZIP packaging does not merge pages into a PDF or necessarily reduce the size of already compressed files."
      }
    ],
    "hero": {
      "input": "Separate PDFs",
      "output": "One ZIP archive"
    },
    "cta": "Open Bundle PDFs →",
    "evidence": {
      "id": "zip",
      "input": "/examples/verified-tools/zip-input.pdf",
      "output": "/examples/verified-tools/zip-result.zip",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "Archived source bytes match the original.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      }
    }
  },
  {
    "slug": "how-to-resave-a-readable-pdf-with-a-rebuilt-structure",
    "title": "How to resave a readable PDF with a rebuilt structure",
    "category": "Privacy",
    "tool": "resave-pdf",
    "toolId": "repair",
    "toolNumber": 66,
    "summary": "Rebuild a readable PDF structure. Learn the available controls, a practical example and what to check.",
    "intent": "How-to",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Repair readable PDF",
      "How-to"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Choose a PDF that can still be parsed by the browser engine.",
      "Export the rebuilt copy and check all pages in an independent reader."
    ],
    "check": "Severely damaged documents may not be recoverable. Successful parsing is not a guarantee that all original content survives.",
    "limit": "Can resave PDFs that parse successfully. Severely damaged PDFs may not be recoverable.",
    "sections": [
      {
        "heading": "What this tool actually does",
        "paragraphs": [
          "Repair readable PDF can rebuild a document that the parser can open. It cannot recreate missing source bytes or guarantee recovery from severe corruption."
        ]
      },
      {
        "heading": "Choose the controls for your document",
        "paragraphs": [
          "Preserve the original and record the exact failure. Check every page of the resaved copy, including forms and interactive features relevant to its intended use."
        ]
      },
      {
        "heading": "Before your first export",
        "paragraphs": [
          "For a readable but awkward document, keep the original and compare the resaved output in the reader that had difficulty. Successfully resaving a file does not guarantee recovery of missing content or support for every reader feature."
        ]
      },
      {
        "heading": "The source cannot be parsed",
        "paragraphs": [
          "Try obtaining another copy or opening it in its original application. A resave operation needs readable source structure to work."
        ]
      }
    ],
    "tips": [
      "Preserve the original and record the exact failure. Check every page of the resaved copy, including forms and interactive features relevant to its intended use.",
      "Try obtaining another copy or opening it in its original application. A resave operation needs readable source structure to work.",
      "Rebuilding bytes can invalidate cryptographic signatures. Keep the signed original and follow the recipient’s requirements for any reading copy."
    ],
    "faq": [
      {
        "question": "The source cannot be parsed?",
        "answer": "Try obtaining another copy or opening it in its original application. A resave operation needs readable source structure to work."
      },
      {
        "question": "A signed document reports invalid signing after resave?",
        "answer": "Rebuilding bytes can invalidate cryptographic signatures. Keep the signed original and follow the recipient’s requirements for any reading copy."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Resave a readable PDF structure as a new file."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Severely damaged documents may not be recoverable. Successful parsing is not a guarantee that all original content survives."
      }
    ],
    "hero": {
      "input": "Readable structure",
      "output": "Resaved PDF"
    },
    "cta": "Open Repair readable PDF →",
    "evidence": {
      "id": "repair",
      "input": "/examples/verified-tools/repair-input.pdf",
      "output": "/examples/verified-tools/repair-result.pdf",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "All six source pages remain readable in the parsed output.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      },
      "preview": {
        "input": "/examples/verified-tools/repair-input.png",
        "output": "/examples/verified-tools/repair-result.png"
      }
    }
  },
  {
    "slug": "resave-a-readable-pdf-into-a-fresh-structure",
    "title": "Resave a readable PDF into a fresh structure",
    "category": "Privacy",
    "tool": "resave-pdf",
    "toolId": "repair",
    "toolNumber": 66,
    "summary": "A PDF opens in one reader but a downstream service rejects it.",
    "intent": "Practical example",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Repair readable PDF",
      "Practical example"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Choose a PDF that can still be parsed by the browser engine.",
      "Export the rebuilt copy and check all pages in an independent reader."
    ],
    "check": "Severely damaged documents may not be recoverable. Successful parsing is not a guarantee that all original content survives.",
    "limit": "Can resave PDFs that parse successfully. Severely damaged PDFs may not be recoverable.",
    "sections": [
      {
        "heading": "The document and the intended outcome",
        "paragraphs": [
          "A PDF opens in one reader but a downstream service rejects it. Try resaving the readable document, then test the output in that same destination and compare page content."
        ]
      },
      {
        "heading": "Make this example work for your file",
        "paragraphs": [
          "For a readable but awkward document, keep the original and compare the resaved output in the reader that had difficulty. Successfully resaving a file does not guarantee recovery of missing content or support for every reader feature."
        ]
      },
      {
        "heading": "Choose only the settings this case needs",
        "paragraphs": [
          "Preserve the original and record the exact failure. Check every page of the resaved copy, including forms and interactive features relevant to its intended use."
        ]
      },
      {
        "heading": "When the example needs a different approach",
        "paragraphs": [
          "Rebuilding bytes can invalidate cryptographic signatures. Keep the signed original and follow the recipient’s requirements for any reading copy."
        ]
      }
    ],
    "tips": [
      "Preserve the original and record the exact failure. Check every page of the resaved copy, including forms and interactive features relevant to its intended use.",
      "Try obtaining another copy or opening it in its original application. A resave operation needs readable source structure to work.",
      "Rebuilding bytes can invalidate cryptographic signatures. Keep the signed original and follow the recipient’s requirements for any reading copy."
    ],
    "faq": [
      {
        "question": "The source cannot be parsed?",
        "answer": "Try obtaining another copy or opening it in its original application. A resave operation needs readable source structure to work."
      },
      {
        "question": "A signed document reports invalid signing after resave?",
        "answer": "Rebuilding bytes can invalidate cryptographic signatures. Keep the signed original and follow the recipient’s requirements for any reading copy."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Resave a readable PDF structure as a new file."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Severely damaged documents may not be recoverable. Successful parsing is not a guarantee that all original content survives."
      }
    ],
    "hero": {
      "input": "Readable structure",
      "output": "Resaved PDF"
    },
    "cta": "Open Repair readable PDF →",
    "evidence": {
      "id": "repair",
      "input": "/examples/verified-tools/repair-input.pdf",
      "output": "/examples/verified-tools/repair-result.pdf",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "All six source pages remain readable in the parsed output.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      },
      "preview": {
        "input": "/examples/verified-tools/repair-input.png",
        "output": "/examples/verified-tools/repair-result.png"
      }
    }
  },
  {
    "slug": "repair-readable-pdf-common-problems-and-how-to-fix-them",
    "title": "Repair readable PDF: common problems and how to fix them",
    "category": "Privacy",
    "tool": "resave-pdf",
    "toolId": "repair",
    "toolNumber": 66,
    "summary": "Resolve the source cannot be parsed and a signed document reports invalid signing after resave. Understand the limits before retrying.",
    "intent": "Troubleshooting",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "tags": [
      "Repair readable PDF",
      "Troubleshooting"
    ],
    "steps": [
      "Choose the supported source file or files from your device.",
      "Choose a PDF that can still be parsed by the browser engine.",
      "Export the rebuilt copy and check all pages in an independent reader."
    ],
    "check": "Severely damaged documents may not be recoverable. Successful parsing is not a guarantee that all original content survives.",
    "limit": "Can resave PDFs that parse successfully. Severely damaged PDFs may not be recoverable.",
    "sections": [
      {
        "heading": "The source cannot be parsed",
        "paragraphs": [
          "Try obtaining another copy or opening it in its original application. A resave operation needs readable source structure to work."
        ]
      },
      {
        "heading": "A signed document reports invalid signing after resave",
        "paragraphs": [
          "Rebuilding bytes can invalidate cryptographic signatures. Keep the signed original and follow the recipient’s requirements for any reading copy."
        ]
      },
      {
        "heading": "Check whether this is the right operation",
        "paragraphs": [
          "Repair readable PDF can rebuild a document that the parser can open. It cannot recreate missing source bytes or guarantee recovery from severe corruption."
        ]
      },
      {
        "heading": "A more useful retry",
        "paragraphs": [
          "For a readable but awkward document, keep the original and compare the resaved output in the reader that had difficulty. Successfully resaving a file does not guarantee recovery of missing content or support for every reader feature."
        ]
      }
    ],
    "tips": [
      "Preserve the original and record the exact failure. Check every page of the resaved copy, including forms and interactive features relevant to its intended use.",
      "Try obtaining another copy or opening it in its original application. A resave operation needs readable source structure to work.",
      "Rebuilding bytes can invalidate cryptographic signatures. Keep the signed original and follow the recipient’s requirements for any reading copy."
    ],
    "faq": [
      {
        "question": "The source cannot be parsed?",
        "answer": "Try obtaining another copy or opening it in its original application. A resave operation needs readable source structure to work."
      },
      {
        "question": "A signed document reports invalid signing after resave?",
        "answer": "Rebuilding bytes can invalidate cryptographic signatures. Keep the signed original and follow the recipient’s requirements for any reading copy."
      },
      {
        "question": "What is this tool useful for?",
        "answer": "Resave a readable PDF structure as a new file."
      },
      {
        "question": "What should I check in the result?",
        "answer": "Severely damaged documents may not be recoverable. Successful parsing is not a guarantee that all original content survives."
      }
    ],
    "hero": {
      "input": "Readable structure",
      "output": "Resaved PDF"
    },
    "cta": "Open Repair readable PDF →",
    "evidence": {
      "id": "repair",
      "input": "/examples/verified-tools/repair-input.pdf",
      "output": "/examples/verified-tools/repair-result.pdf",
      "date": "2026-10-09",
      "environment": "Node 24.19.0 · engine revision 65388e2 · PDF.js 4.10.38 · pdf-lib 1.17.1 / Poppler",
      "check": "All six source pages remain readable in the parsed output.",
      "scope": "Synthetic engine check. This is not a live browser or phone test.",
      "options": {
        "range": "",
        "text": "",
        "title": "",
        "author": "",
        "subject": "",
        "password": "",
        "quality": "compact",
        "angle": "90",
        "margin": "20",
        "start": "1",
        "columns": "2",
        "fields": {}
      },
      "preview": {
        "input": "/examples/verified-tools/repair-input.png",
        "output": "/examples/verified-tools/repair-result.png"
      }
    }
  },
  {
    "slug": "how-to-collect-pdf-clippings-with-source-references",
    "title": "How to collect PDF clippings with source-page references",
    "summary": "Build a concise reading pack from useful passages, diagrams or tables without losing where each excerpt came from.",
    "category": "Edit & sign",
    "tool": "pdf-cut-and-collect",
    "toolId": "cut-collect",
    "toolNumber": 68,
    "steps": [
      "Open one or more PDFs with Add PDFs. Choose a document and page.",
      "Drag across the preview to select a region, or set Left, Top, Width and Height percentages. Add an optional caption and press Collect selection.",
      "Repeat on other pages. Move or remove clippings, press Create collection PDF, then Download PDF."
    ],
    "check": "Reopen the downloaded PDF. Check page count, readable content and the source filename and page beneath every clipping.",
    "limit": "Clippings are images. They do not retain selectable text, links or the structure of a source table. Collection is not redaction; your originals remain unchanged.",
    "intent": "How-to",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "cta": "Open PDF Cut & Collect →",
    "tags": [
      "PDF Cut & Collect",
      "PDF",
      "free",
      "browser",
      "How-to"
    ],
    "hero": {
      "input": "Passages on several pages",
      "output": "Clips with source references"
    },
    "sections": [
      {
        "heading": "Start with a deliberate selection",
        "paragraphs": [
          "Choose the exact passage you need, including its heading or legend. A tiny excerpt can lose meaning when separated from its surrounding paragraphs. Include table column names and units when collecting numerical data."
        ]
      },
      {
        "heading": "A source reference is a navigation aid",
        "paragraphs": [
          "Each output page includes the original filename and the one-based source page position. These are references to the file you opened, not to printed page labels. Keep the original documents if a reviewer needs to check context."
        ]
      },
      {
        "heading": "Keep your workflow focused",
        "paragraphs": [
          "Upload only the documents required for this task. Files are processed in this browser, and the original documents are not overwritten. Download the result before closing the tab. These dedicated workspaces do not automatically import unsaved changes from another PDF Studio tool.",
          "If a document is protected, use Remove password with a password you know before opening it here. Large or complex pages can require substantial memory. The workspace accepts PDFs under 50 MB each, at most 12 files, and bounded page counts; split an unusually large document first."
        ]
      }
    ],
    "tips": [
      "Keep the originals and use a descriptive filename for the exported copy.",
      "Each output page includes the original filename and the one-based source page position. These are references to the file you opened, not to printed page labels. Keep the original documents if a reviewer needs to check context."
    ],
    "faq": [
      {
        "question": "Will my original files change?",
        "answer": "No. Download a separate result. The source files remain unchanged."
      },
      {
        "question": "Do the files leave my device?",
        "answer": "No document upload is used. PDF processing runs in your browser."
      },
      {
        "question": "What should I check before sharing?",
        "answer": "Clippings are images. They do not retain selectable text, links or the structure of a source table. Collection is not redaction; your originals remain unchanged."
      }
    ],
    "evidence": {
      "id": "new-cut-collect",
      "input": "/examples/new-tools/alpha-six-pages.pdf",
      "output": "/examples/new-tools/collected-reference.pdf",
      "date": "2026-10-09",
      "environment": "Node.js engine check + independent Poppler render",
      "scope": "Synthetic output-engine check. This does not certify a physical phone, printer, or fresh browser processing run. The fold input pages were rendered by Poppler for this check.",
      "check": "One clipping, one output page, with the Alpha filename and source page 1 in the footer.",
      "options": {
        "layout": "cut-collect"
      },
      "preview": {
        "input": "/examples/new-tools/alpha-preview.png",
        "output": "/examples/new-tools/collected-reference-preview.png"
      }
    }
  },
  {
    "slug": "build-a-research-excerpt-pack-from-pdfs",
    "title": "Build a research excerpt pack from several PDFs",
    "summary": "Gather selected evidence from different documents into one ordered PDF with captions and traceable page references.",
    "category": "Edit & sign",
    "tool": "pdf-cut-and-collect",
    "toolId": "cut-collect",
    "toolNumber": 68,
    "steps": [
      "Open one or more PDFs with Add PDFs. Choose a document and page.",
      "Drag across the preview to select a region, or set Left, Top, Width and Height percentages. Add an optional caption and press Collect selection.",
      "Repeat on other pages. Move or remove clippings, press Create collection PDF, then Download PDF."
    ],
    "check": "Reopen the downloaded PDF. Check page count, readable content and the source filename and page beneath every clipping.",
    "limit": "Clippings are images. They do not retain selectable text, links or the structure of a source table. Collection is not redaction; your originals remain unchanged.",
    "intent": "Practical example",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "cta": "Open PDF Cut & Collect →",
    "tags": [
      "PDF Cut & Collect",
      "PDF",
      "free",
      "browser",
      "Practical example"
    ],
    "hero": {
      "input": "Passages on several pages",
      "output": "Clips with source references"
    },
    "sections": [
      {
        "heading": "Make one point per clipping",
        "paragraphs": [
          "For a literature review, start with a definition, follow with a supporting chart and finish with a contrasting finding. Collect only what supports your question. Capture enough surrounding material to avoid changing the author’s intended meaning."
        ]
      },
      {
        "heading": "Arrange before exporting",
        "paragraphs": [
          "Use the move controls to put your clippings in the order a reader needs. A caption explains why an excerpt belongs in the pack. The original source and page reference are added automatically beneath it, so the caption can focus on your observation."
        ]
      },
      {
        "heading": "Keep your workflow focused",
        "paragraphs": [
          "Upload only the documents required for this task. Files are processed in this browser, and the original documents are not overwritten. Download the result before closing the tab. These dedicated workspaces do not automatically import unsaved changes from another PDF Studio tool.",
          "If a document is protected, use Remove password with a password you know before opening it here. Large or complex pages can require substantial memory. The workspace accepts PDFs under 50 MB each, at most 12 files, and bounded page counts; split an unusually large document first."
        ]
      }
    ],
    "tips": [
      "Keep the originals and use a descriptive filename for the exported copy.",
      "Use the move controls to put your clippings in the order a reader needs. A caption explains why an excerpt belongs in the pack. The original source and page reference are added automatically beneath it, so the caption can focus on your observation."
    ],
    "faq": [
      {
        "question": "Will my original files change?",
        "answer": "No. Download a separate result. The source files remain unchanged."
      },
      {
        "question": "Do the files leave my device?",
        "answer": "No document upload is used. PDF processing runs in your browser."
      },
      {
        "question": "What should I check before sharing?",
        "answer": "Clippings are images. They do not retain selectable text, links or the structure of a source table. Collection is not redaction; your originals remain unchanged."
      }
    ],
    "evidence": {
      "id": "new-cut-collect",
      "input": "/examples/new-tools/alpha-six-pages.pdf",
      "output": "/examples/new-tools/collected-reference.pdf",
      "date": "2026-10-09",
      "environment": "Node.js engine check + independent Poppler render",
      "scope": "Synthetic output-engine check. This does not certify a physical phone, printer, or fresh browser processing run. The fold input pages were rendered by Poppler for this check.",
      "check": "One clipping, one output page, with the Alpha filename and source page 1 in the footer.",
      "options": {
        "layout": "cut-collect"
      },
      "preview": {
        "input": "/examples/new-tools/alpha-preview.png",
        "output": "/examples/new-tools/collected-reference-preview.png"
      }
    }
  },
  {
    "slug": "fix-pdf-clipping-quality-and-selection",
    "title": "PDF clipping troubleshooting: cut-off text and blurry output",
    "summary": "Adjust the selection, keep table headings and understand the image quality limit before exporting your collection.",
    "category": "Edit & sign",
    "tool": "pdf-cut-and-collect",
    "toolId": "cut-collect",
    "toolNumber": 68,
    "steps": [
      "Open one or more PDFs with Add PDFs. Choose a document and page.",
      "Drag across the preview to select a region, or set Left, Top, Width and Height percentages. Add an optional caption and press Collect selection.",
      "Repeat on other pages. Move or remove clippings, press Create collection PDF, then Download PDF."
    ],
    "check": "Reopen the downloaded PDF. Check page count, readable content and the source filename and page beneath every clipping.",
    "limit": "Clippings are images. They do not retain selectable text, links or the structure of a source table. Collection is not redaction; your originals remain unchanged.",
    "intent": "Troubleshooting",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "cta": "Open PDF Cut & Collect →",
    "tags": [
      "PDF Cut & Collect",
      "PDF",
      "free",
      "browser",
      "Troubleshooting"
    ],
    "hero": {
      "input": "Passages on several pages",
      "output": "Clips with source references"
    },
    "sections": [
      {
        "heading": "Check all four edges",
        "paragraphs": [
          "If a line or chart label is missing, enlarge the selection before pressing Collect selection. Percentage fields provide an alternative to touch dragging. Removing a bad clipping and collecting it again is safer than keeping an incomplete excerpt."
        ]
      },
      {
        "heading": "Understand the rendering limit",
        "paragraphs": [
          "The workspace renders a page preview at a bounded resolution to manage browser memory. A very small region from a large page may not contain enough pixels for enlargement. Choose a larger region or keep the source PDF alongside the collection. This feature does not reconstruct editable tables."
        ]
      },
      {
        "heading": "Keep your workflow focused",
        "paragraphs": [
          "Upload only the documents required for this task. Files are processed in this browser, and the original documents are not overwritten. Download the result before closing the tab. These dedicated workspaces do not automatically import unsaved changes from another PDF Studio tool.",
          "If a document is protected, use Remove password with a password you know before opening it here. Large or complex pages can require substantial memory. The workspace accepts PDFs under 50 MB each, at most 12 files, and bounded page counts; split an unusually large document first."
        ]
      }
    ],
    "tips": [
      "Keep the originals and use a descriptive filename for the exported copy.",
      "The workspace renders a page preview at a bounded resolution to manage browser memory. A very small region from a large page may not contain enough pixels for enlargement. Choose a larger region or keep the source PDF alongside the collection. This feature does not reconstruct editable tables."
    ],
    "faq": [
      {
        "question": "Will my original files change?",
        "answer": "No. Download a separate result. The source files remain unchanged."
      },
      {
        "question": "Do the files leave my device?",
        "answer": "No document upload is used. PDF processing runs in your browser."
      },
      {
        "question": "What should I check before sharing?",
        "answer": "Clippings are images. They do not retain selectable text, links or the structure of a source table. Collection is not redaction; your originals remain unchanged."
      }
    ],
    "evidence": {
      "id": "new-cut-collect",
      "input": "/examples/new-tools/alpha-six-pages.pdf",
      "output": "/examples/new-tools/collected-reference.pdf",
      "date": "2026-10-09",
      "environment": "Node.js engine check + independent Poppler render",
      "scope": "Synthetic output-engine check. This does not certify a physical phone, printer, or fresh browser processing run. The fold input pages were rendered by Poppler for this check.",
      "check": "One clipping, one output page, with the Alpha filename and source page 1 in the footer.",
      "options": {
        "layout": "cut-collect"
      },
      "preview": {
        "input": "/examples/new-tools/alpha-preview.png",
        "output": "/examples/new-tools/collected-reference-preview.png"
      }
    }
  },
  {
    "slug": "how-to-make-a-folded-pdf-booklet",
    "title": "How to make a folded PDF booklet from ordinary pages",
    "summary": "Turn PDF pages into an A4 landscape booklet with a visible sheet plan and blanks added only where needed.",
    "category": "Pages",
    "tool": "pdf-fold-lab",
    "toolId": "fold-lab",
    "toolNumber": 69,
    "steps": [
      "Open one PDF and choose Folded booklet or Four cut-out cards.",
      "Enter optional source page ranges such as 1, 3-5. For a booklet, review the front/back sheet plan; zero positions are shown as blanks.",
      "Press Create print PDF and Download PDF. Print a test sheet at 100%; use landscape short-edge duplex for the booklet, then stack and fold."
    ],
    "check": "Reopen the downloaded PDF. Check page count, readable content and front/back alignment on a test print.",
    "limit": "Print layouts contain page images, so selectable text, links and form fields do not survive. A4 paper and a short-edge duplex test are required for the booklet. No printer setting is controlled automatically.",
    "intent": "How-to",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "cta": "Open PDF Fold Lab →",
    "tags": [
      "PDF Fold Lab",
      "PDF",
      "free",
      "browser",
      "How-to"
    ],
    "hero": {
      "input": "Six reading pages",
      "output": "Folded print sheet"
    },
    "sections": [
      {
        "heading": "Why pages look out of order on screen",
        "paragraphs": [
          "A booklet places the first and last reading pages together on the outside of a sheet. The inner sheets continue that pattern. With six selected pages, the first sheet front is blank / 1 and its back is 2 / blank; the second sheet front is 6 / 3 and back is 4 / 5. After duplex printing, nesting and folding, the reading order becomes 1 through 6."
        ]
      },
      {
        "heading": "Test before printing everything",
        "paragraphs": [
          "Print only the first front/back sheet at actual size. Use A4 landscape and short-edge flip, then fold it and check that the two sides are upright. Printer drivers can use different labels for duplex orientation. If the test is inverted, change the flip setting before printing the whole pack."
        ]
      },
      {
        "heading": "Keep your workflow focused",
        "paragraphs": [
          "Upload only the documents required for this task. Files are processed in this browser, and the original documents are not overwritten. Download the result before closing the tab. These dedicated workspaces do not automatically import unsaved changes from another PDF Studio tool.",
          "If a document is protected, use Remove password with a password you know before opening it here. Large or complex pages can require substantial memory. The workspace accepts PDFs under 50 MB each, at most 12 files, and bounded page counts; split an unusually large document first."
        ]
      }
    ],
    "tips": [
      "Keep the originals and use a descriptive filename for the exported copy.",
      "Print only the first front/back sheet at actual size. Use A4 landscape and short-edge flip, then fold it and check that the two sides are upright. Printer drivers can use different labels for duplex orientation. If the test is inverted, change the flip setting before printing the whole pack."
    ],
    "faq": [
      {
        "question": "Will my original files change?",
        "answer": "No. Download a separate result. The source files remain unchanged."
      },
      {
        "question": "Do the files leave my device?",
        "answer": "No document upload is used. PDF processing runs in your browser."
      },
      {
        "question": "What should I check before sharing?",
        "answer": "Print layouts contain page images, so selectable text, links and form fields do not survive. A4 paper and a short-edge duplex test are required for the booklet. No printer setting is controlled automatically."
      }
    ],
    "evidence": {
      "id": "new-fold-lab",
      "input": "/examples/new-tools/alpha-six-pages.pdf",
      "output": "/examples/new-tools/folded-booklet.pdf",
      "date": "2026-10-09",
      "environment": "Node.js engine check + independent Poppler render",
      "scope": "Synthetic output-engine check. This does not certify a physical phone, printer, or fresh browser processing run. The fold input pages were rendered by Poppler for this check.",
      "check": "Six Alpha pages produced four landscape output pages, using two duplex sheets and two padded blanks. The printed fold itself needs your printer check.",
      "options": {
        "layout": "fold-lab"
      },
      "preview": {
        "input": "/examples/new-tools/alpha-preview.png",
        "output": "/examples/new-tools/folded-booklet-preview.png"
      }
    }
  },
  {
    "slug": "make-four-pdf-revision-cards-per-sheet",
    "title": "Make four PDF revision cards per A4 sheet",
    "summary": "Reuse selected PDF pages as cut-out revision cards, handouts or compact reference sheets.",
    "category": "Pages",
    "tool": "pdf-fold-lab",
    "toolId": "fold-lab",
    "toolNumber": 69,
    "steps": [
      "Open one PDF and choose Folded booklet or Four cut-out cards.",
      "Enter optional source page ranges such as 1, 3-5. For a booklet, review the front/back sheet plan; zero positions are shown as blanks.",
      "Press Create print PDF and Download PDF. Print a test sheet at 100%; use landscape short-edge duplex for the booklet, then stack and fold."
    ],
    "check": "Reopen the downloaded PDF. Check page count, readable content and front/back alignment on a test print.",
    "limit": "Print layouts contain page images, so selectable text, links and form fields do not survive. A4 paper and a short-edge duplex test are required for the booklet. No printer setting is controlled automatically.",
    "intent": "Practical example",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "cta": "Open PDF Fold Lab →",
    "tags": [
      "PDF Fold Lab",
      "PDF",
      "free",
      "browser",
      "Practical example"
    ],
    "hero": {
      "input": "Six reading pages",
      "output": "Folded print sheet"
    },
    "sections": [
      {
        "heading": "Choose material that survives reduction",
        "paragraphs": [
          "A page with a short diagram or summary works better than dense small-print notes. The four-card layout fits each selected page into a quarter of A4 while retaining its aspect ratio. It adds source-page labels and dotted cut guides. The last sheet may have empty spaces."
        ]
      },
      {
        "heading": "Cut guides are not fold instructions",
        "paragraphs": [
          "This layout produces four separate cards. Print at 100%, inspect a test page for readability and cut along the dotted guides. It is different from the folded booklet option, which imposes a reading sequence across both sides of paper."
        ]
      },
      {
        "heading": "Keep your workflow focused",
        "paragraphs": [
          "Upload only the documents required for this task. Files are processed in this browser, and the original documents are not overwritten. Download the result before closing the tab. These dedicated workspaces do not automatically import unsaved changes from another PDF Studio tool.",
          "If a document is protected, use Remove password with a password you know before opening it here. Large or complex pages can require substantial memory. The workspace accepts PDFs under 50 MB each, at most 12 files, and bounded page counts; split an unusually large document first."
        ]
      }
    ],
    "tips": [
      "Keep the originals and use a descriptive filename for the exported copy.",
      "This layout produces four separate cards. Print at 100%, inspect a test page for readability and cut along the dotted guides. It is different from the folded booklet option, which imposes a reading sequence across both sides of paper."
    ],
    "faq": [
      {
        "question": "Will my original files change?",
        "answer": "No. Download a separate result. The source files remain unchanged."
      },
      {
        "question": "Do the files leave my device?",
        "answer": "No document upload is used. PDF processing runs in your browser."
      },
      {
        "question": "What should I check before sharing?",
        "answer": "Print layouts contain page images, so selectable text, links and form fields do not survive. A4 paper and a short-edge duplex test are required for the booklet. No printer setting is controlled automatically."
      }
    ],
    "evidence": {
      "id": "new-fold-lab",
      "input": "/examples/new-tools/alpha-six-pages.pdf",
      "output": "/examples/new-tools/folded-booklet.pdf",
      "date": "2026-10-09",
      "environment": "Node.js engine check + independent Poppler render",
      "scope": "Synthetic output-engine check. This does not certify a physical phone, printer, or fresh browser processing run. The fold input pages were rendered by Poppler for this check.",
      "check": "Six Alpha pages produced four landscape output pages, using two duplex sheets and two padded blanks. The printed fold itself needs your printer check.",
      "options": {
        "layout": "fold-lab"
      },
      "preview": {
        "input": "/examples/new-tools/alpha-preview.png",
        "output": "/examples/new-tools/folded-booklet-preview.png"
      }
    }
  },
  {
    "slug": "fix-booklet-printing-order-and-upside-down-backs",
    "title": "Fix booklet printing: page order, blanks and upside-down backs",
    "summary": "Use the sheet plan to separate expected booklet imposition from a printer orientation problem.",
    "category": "Pages",
    "tool": "pdf-fold-lab",
    "toolId": "fold-lab",
    "toolNumber": 69,
    "steps": [
      "Open one PDF and choose Folded booklet or Four cut-out cards.",
      "Enter optional source page ranges such as 1, 3-5. For a booklet, review the front/back sheet plan; zero positions are shown as blanks.",
      "Press Create print PDF and Download PDF. Print a test sheet at 100%; use landscape short-edge duplex for the booklet, then stack and fold."
    ],
    "check": "Reopen the downloaded PDF. Check page count, readable content and front/back alignment on a test print.",
    "limit": "Print layouts contain page images, so selectable text, links and form fields do not survive. A4 paper and a short-edge duplex test are required for the booklet. No printer setting is controlled automatically.",
    "intent": "Troubleshooting",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "cta": "Open PDF Fold Lab →",
    "tags": [
      "PDF Fold Lab",
      "PDF",
      "free",
      "browser",
      "Troubleshooting"
    ],
    "hero": {
      "input": "Six reading pages",
      "output": "Folded print sheet"
    },
    "sections": [
      {
        "heading": "Expected blanks do not mean pages are missing",
        "paragraphs": [
          "Booklets need a multiple of four page positions. Six source pages therefore use eight positions, with two blanks. The visible sheet plan shows where these occur. Source ranges are collected in the order entered, and the sheet-plan numbers refer to that selected sequence."
        ]
      },
      {
        "heading": "Avoid a second booklet transformation",
        "paragraphs": [
          "The downloaded PDF is already imposed. Do not choose another booklet mode in a printer driver, because it will rearrange the pages again. Print it as ordinary A4 landscape sheets, at actual size, duplex short-edge. If your printer has no duplex support, run a small manual front/back test before handling a full stack."
        ]
      },
      {
        "heading": "Keep your workflow focused",
        "paragraphs": [
          "Upload only the documents required for this task. Files are processed in this browser, and the original documents are not overwritten. Download the result before closing the tab. These dedicated workspaces do not automatically import unsaved changes from another PDF Studio tool.",
          "If a document is protected, use Remove password with a password you know before opening it here. Large or complex pages can require substantial memory. The workspace accepts PDFs under 50 MB each, at most 12 files, and bounded page counts; split an unusually large document first."
        ]
      }
    ],
    "tips": [
      "Keep the originals and use a descriptive filename for the exported copy.",
      "The downloaded PDF is already imposed. Do not choose another booklet mode in a printer driver, because it will rearrange the pages again. Print it as ordinary A4 landscape sheets, at actual size, duplex short-edge. If your printer has no duplex support, run a small manual front/back test before handling a full stack."
    ],
    "faq": [
      {
        "question": "Will my original files change?",
        "answer": "No. Download a separate result. The source files remain unchanged."
      },
      {
        "question": "Do the files leave my device?",
        "answer": "No document upload is used. PDF processing runs in your browser."
      },
      {
        "question": "What should I check before sharing?",
        "answer": "Print layouts contain page images, so selectable text, links and form fields do not survive. A4 paper and a short-edge duplex test are required for the booklet. No printer setting is controlled automatically."
      }
    ],
    "evidence": {
      "id": "new-fold-lab",
      "input": "/examples/new-tools/alpha-six-pages.pdf",
      "output": "/examples/new-tools/folded-booklet.pdf",
      "date": "2026-10-09",
      "environment": "Node.js engine check + independent Poppler render",
      "scope": "Synthetic output-engine check. This does not certify a physical phone, printer, or fresh browser processing run. The fold input pages were rendered by Poppler for this check.",
      "check": "Six Alpha pages produced four landscape output pages, using two duplex sheets and two padded blanks. The printed fold itself needs your printer check.",
      "options": {
        "layout": "fold-lab"
      },
      "preview": {
        "input": "/examples/new-tools/alpha-preview.png",
        "output": "/examples/new-tools/folded-booklet-preview.png"
      }
    }
  },
  {
    "slug": "how-to-create-a-clickable-pdf-attachment-map",
    "title": "How to create a clickable PDF attachment map",
    "summary": "Connect a main document and its supporting PDFs with a readable index and links to the relevant main-document pages.",
    "category": "Pages",
    "tool": "pdf-attachment-map",
    "toolId": "attachment-map",
    "toolNumber": 70,
    "steps": [
      "Add a main PDF first, then supporting PDFs. The first file is the main document.",
      "For each support, enter a section description and a page position in the main PDF. Use the move controls to arrange the pack.",
      "Press Create mapped PDF and Download PDF. Click the index document titles and main-section references to check their destinations."
    ],
    "check": "Reopen the downloaded PDF. Check page count, readable content and every clickable index destination.",
    "limit": "This is a combined reading copy, not embedded file attachments. Fill and flatten forms before using it. Original signatures, outlines and embedded attachments are not preserved; keep all original files.",
    "intent": "How-to",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "cta": "Open PDF Attachment Map →",
    "tags": [
      "PDF Attachment Map",
      "PDF",
      "free",
      "browser",
      "How-to"
    ],
    "hero": {
      "input": "Report and supporting PDF",
      "output": "Clickable document map"
    },
    "sections": [
      {
        "heading": "Choose the main document first",
        "paragraphs": [
          "The first file supplies the main-document page numbering used by section links. Supporting documents follow in the order shown. You can reorder files, but making a different file first changes what “main page” means. Review all section page values after changing that first file."
        ]
      },
      {
        "heading": "Two useful links for each support",
        "paragraphs": [
          "The document title opens the first page of that supporting PDF in the pack. The line underneath opens the page you entered in the main document. A clear description such as “Evidence for section 2” helps a reader understand the relationship before they click."
        ]
      },
      {
        "heading": "Keep your workflow focused",
        "paragraphs": [
          "Upload only the documents required for this task. Files are processed in this browser, and the original documents are not overwritten. Download the result before closing the tab. These dedicated workspaces do not automatically import unsaved changes from another PDF Studio tool.",
          "If a document is protected, use Remove password with a password you know before opening it here. Large or complex pages can require substantial memory. The workspace accepts PDFs under 50 MB each, at most 12 files, and bounded page counts; split an unusually large document first."
        ]
      }
    ],
    "tips": [
      "Keep the originals and use a descriptive filename for the exported copy.",
      "The document title opens the first page of that supporting PDF in the pack. The line underneath opens the page you entered in the main document. A clear description such as “Evidence for section 2” helps a reader understand the relationship before they click."
    ],
    "faq": [
      {
        "question": "Will my original files change?",
        "answer": "No. Download a separate result. The source files remain unchanged."
      },
      {
        "question": "Do the files leave my device?",
        "answer": "No document upload is used. PDF processing runs in your browser."
      },
      {
        "question": "What should I check before sharing?",
        "answer": "This is a combined reading copy, not embedded file attachments. Fill and flatten forms before using it. Original signatures, outlines and embedded attachments are not preserved; keep all original files."
      }
    ],
    "evidence": {
      "id": "new-attachment-map",
      "input": "/examples/new-tools/alpha-six-pages.pdf",
      "output": "/examples/new-tools/mapped-pack.pdf",
      "date": "2026-10-09",
      "environment": "Node.js engine check + independent Poppler render",
      "scope": "Synthetic output-engine check. This does not certify a physical phone, printer, or fresh browser processing run. The fold input pages were rendered by Poppler for this check.",
      "check": "Six Alpha pages plus one Beta page produced eight pages including the index. All three internal link destinations were checked.",
      "options": {
        "layout": "attachment-map"
      },
      "preview": {
        "input": "/examples/new-tools/alpha-preview.png",
        "output": "/examples/new-tools/mapped-pack-preview.png"
      },
      "inputs": [
        {
          "href": "/examples/new-tools/beta-support.pdf",
          "label": "Download Beta supporting PDF"
        }
      ]
    }
  },
  {
    "slug": "build-a-report-and-evidence-pdf-pack",
    "title": "Build a report-and-evidence PDF pack with a document map",
    "summary": "Give reviewers a main report, supporting evidence and an index that shows how the documents connect.",
    "category": "Pages",
    "tool": "pdf-attachment-map",
    "toolId": "attachment-map",
    "toolNumber": 70,
    "steps": [
      "Add a main PDF first, then supporting PDFs. The first file is the main document.",
      "For each support, enter a section description and a page position in the main PDF. Use the move controls to arrange the pack.",
      "Press Create mapped PDF and Download PDF. Click the index document titles and main-section references to check their destinations."
    ],
    "check": "Reopen the downloaded PDF. Check page count, readable content and every clickable index destination.",
    "limit": "This is a combined reading copy, not embedded file attachments. Fill and flatten forms before using it. Original signatures, outlines and embedded attachments are not preserved; keep all original files.",
    "intent": "Practical example",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "cta": "Open PDF Attachment Map →",
    "tags": [
      "PDF Attachment Map",
      "PDF",
      "free",
      "browser",
      "Practical example"
    ],
    "hero": {
      "input": "Report and supporting PDF",
      "output": "Clickable document map"
    },
    "sections": [
      {
        "heading": "Make evidence easy to trace",
        "paragraphs": [
          "Place the report first. Add a receipt, chart or certificate as a supporting PDF, enter a short section description and choose the main-report page that cites it. Repeat for the remaining evidence. The generated index creates a route into the evidence and a route back to the relevant report page."
        ]
      },
      {
        "heading": "Check the actual pack",
        "paragraphs": [
          "In the checked example, Alpha has six pages and Beta has one. The index adds one page, producing an eight-page pack. Alpha starts at pack page 2, Beta at pack page 8, and the reference to Alpha source page 2 opens pack page 3. The output page positions differ from the original-file positions because the index comes first."
        ]
      },
      {
        "heading": "Keep your workflow focused",
        "paragraphs": [
          "Upload only the documents required for this task. Files are processed in this browser, and the original documents are not overwritten. Download the result before closing the tab. These dedicated workspaces do not automatically import unsaved changes from another PDF Studio tool.",
          "If a document is protected, use Remove password with a password you know before opening it here. Large or complex pages can require substantial memory. The workspace accepts PDFs under 50 MB each, at most 12 files, and bounded page counts; split an unusually large document first."
        ]
      }
    ],
    "tips": [
      "Keep the originals and use a descriptive filename for the exported copy.",
      "In the checked example, Alpha has six pages and Beta has one. The index adds one page, producing an eight-page pack. Alpha starts at pack page 2, Beta at pack page 8, and the reference to Alpha source page 2 opens pack page 3. The output page positions differ from the original-file positions because the index comes first."
    ],
    "faq": [
      {
        "question": "Will my original files change?",
        "answer": "No. Download a separate result. The source files remain unchanged."
      },
      {
        "question": "Do the files leave my device?",
        "answer": "No document upload is used. PDF processing runs in your browser."
      },
      {
        "question": "What should I check before sharing?",
        "answer": "This is a combined reading copy, not embedded file attachments. Fill and flatten forms before using it. Original signatures, outlines and embedded attachments are not preserved; keep all original files."
      }
    ],
    "evidence": {
      "id": "new-attachment-map",
      "input": "/examples/new-tools/alpha-six-pages.pdf",
      "output": "/examples/new-tools/mapped-pack.pdf",
      "date": "2026-10-09",
      "environment": "Node.js engine check + independent Poppler render",
      "scope": "Synthetic output-engine check. This does not certify a physical phone, printer, or fresh browser processing run. The fold input pages were rendered by Poppler for this check.",
      "check": "Six Alpha pages plus one Beta page produced eight pages including the index. All three internal link destinations were checked.",
      "options": {
        "layout": "attachment-map"
      },
      "preview": {
        "input": "/examples/new-tools/alpha-preview.png",
        "output": "/examples/new-tools/mapped-pack-preview.png"
      },
      "inputs": [
        {
          "href": "/examples/new-tools/beta-support.pdf",
          "label": "Download Beta supporting PDF"
        }
      ]
    }
  },
  {
    "slug": "fix-pdf-map-links-and-main-page-references",
    "title": "PDF map troubleshooting: wrong section links and form fields",
    "summary": "Check main-document page positions, reorder safely and prepare forms before creating a linked reading pack.",
    "category": "Pages",
    "tool": "pdf-attachment-map",
    "toolId": "attachment-map",
    "toolNumber": 70,
    "steps": [
      "Add a main PDF first, then supporting PDFs. The first file is the main document.",
      "For each support, enter a section description and a page position in the main PDF. Use the move controls to arrange the pack.",
      "Press Create mapped PDF and Download PDF. Click the index document titles and main-section references to check their destinations."
    ],
    "check": "Reopen the downloaded PDF. Check page count, readable content and every clickable index destination.",
    "limit": "This is a combined reading copy, not embedded file attachments. Fill and flatten forms before using it. Original signatures, outlines and embedded attachments are not preserved; keep all original files.",
    "intent": "Troubleshooting",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "cta": "Open PDF Attachment Map →",
    "tags": [
      "PDF Attachment Map",
      "PDF",
      "free",
      "browser",
      "Troubleshooting"
    ],
    "hero": {
      "input": "Report and supporting PDF",
      "output": "Clickable document map"
    },
    "sections": [
      {
        "heading": "Use file positions, not printed labels",
        "paragraphs": [
          "A PDF may contain a cover and contents before its printed page 1. The section field expects the actual one-based position in the first PDF. Open that source, count from its first page, and use the correct position. A page outside the main PDF is rejected rather than linked to an unrelated output page."
        ]
      },
      {
        "heading": "Preserve the originals for interactive work",
        "paragraphs": [
          "Copying pages into a reading pack is not a reliable way to preserve editable form fields or digital signatures. This tool refuses unflattened form fields. Complete and flatten forms in a separate copy, inspect their values and add that copy. Keep separately signed or editable originals when they are required."
        ]
      },
      {
        "heading": "Keep your workflow focused",
        "paragraphs": [
          "Upload only the documents required for this task. Files are processed in this browser, and the original documents are not overwritten. Download the result before closing the tab. These dedicated workspaces do not automatically import unsaved changes from another PDF Studio tool.",
          "If a document is protected, use Remove password with a password you know before opening it here. Large or complex pages can require substantial memory. The workspace accepts PDFs under 50 MB each, at most 12 files, and bounded page counts; split an unusually large document first."
        ]
      }
    ],
    "tips": [
      "Keep the originals and use a descriptive filename for the exported copy.",
      "Copying pages into a reading pack is not a reliable way to preserve editable form fields or digital signatures. This tool refuses unflattened form fields. Complete and flatten forms in a separate copy, inspect their values and add that copy. Keep separately signed or editable originals when they are required."
    ],
    "faq": [
      {
        "question": "Will my original files change?",
        "answer": "No. Download a separate result. The source files remain unchanged."
      },
      {
        "question": "Do the files leave my device?",
        "answer": "No document upload is used. PDF processing runs in your browser."
      },
      {
        "question": "What should I check before sharing?",
        "answer": "This is a combined reading copy, not embedded file attachments. Fill and flatten forms before using it. Original signatures, outlines and embedded attachments are not preserved; keep all original files."
      }
    ],
    "evidence": {
      "id": "new-attachment-map",
      "input": "/examples/new-tools/alpha-six-pages.pdf",
      "output": "/examples/new-tools/mapped-pack.pdf",
      "date": "2026-10-09",
      "environment": "Node.js engine check + independent Poppler render",
      "scope": "Synthetic output-engine check. This does not certify a physical phone, printer, or fresh browser processing run. The fold input pages were rendered by Poppler for this check.",
      "check": "Six Alpha pages plus one Beta page produced eight pages including the index. All three internal link destinations were checked.",
      "options": {
        "layout": "attachment-map"
      },
      "preview": {
        "input": "/examples/new-tools/alpha-preview.png",
        "output": "/examples/new-tools/mapped-pack-preview.png"
      },
      "inputs": [
        {
          "href": "/examples/new-tools/beta-support.pdf",
          "label": "Download Beta supporting PDF"
        }
      ]
    }
  },
  {
    "slug": "how-to-sketch-directly-on-pdf-pages",
    "title": "How to sketch directly on PDF pages",
    "summary": "Use the new canvas-first workspace to draw, highlight and export an annotated copy.",
    "category": "Edit & sign",
    "tool": "sketch-over-pdf",
    "toolId": "sketch-pdf",
    "toolNumber": 67,
    "intent": "Practical guide",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "steps": [
      "Open one PDF in Sketch over PDF.",
      "Choose Pen or Highlight, ink colour and thickness. Draw on the page. Use Scroll to navigate without drawing.",
      "Use Previous or Next for another page. Undo, redo or clear marks on the current page.",
      "Press Download annotated PDF, then Download PDF on the result screen. Use Download this page PNG when you only need the current view."
    ],
    "sections": [
      {
        "heading": "A canvas for the document",
        "paragraphs": [
          "Drawing controls sit above the paper so the canvas can use the available width. On a phone the compact toolbar scrolls horizontally. Pen and Highlight make marks; Scroll lets a touch gesture move through the workspace without adding a stroke.",
          "Marks are stored separately for each source page while the tab remains open. Switching pages retains them. Undo and redo affect the current page, and Clear page removes that page’s marks. A no-change PDF export returns the original bytes."
        ]
      },
      {
        "heading": "Keep marks understandable",
        "paragraphs": [
          "Choose a visible ink colour that contrasts with the source. Thin pen strokes work for short notes, while highlights use translucent broad strokes. Inspect the result at readable size and avoid obscuring a chart or required form value.",
          "These marks are annotations in a reading copy. They do not replace original text and do not securely remove sensitive material. Use the dedicated Redact tool when permanent removal is required."
        ]
      }
    ],
    "check": "Reopen the annotated PDF and inspect every marked page, especially pages with rotation or fillable fields.",
    "limit": "Sketch adds visible strokes to original page content. If fillable fields could cover your marks, make fields read-only before export. No-change exports return the original bytes. Digital signatures can be invalidated by changes. Work is not automatically saved when the tab closes.",
    "tips": [
      "Choose Scroll before navigating with a finger.",
      "Keep an unmarked original and download before leaving."
    ],
    "faq": [
      {
        "question": "Can I erase a mistake?",
        "answer": "Use Undo for the latest stroke or Clear page for all marks on the current page."
      },
      {
        "question": "Why is touching the page drawing instead of scrolling?",
        "answer": "Pen or Highlight is selected. Choose Scroll in the drawing toolbar."
      },
      {
        "question": "Is drawing over a name a secure redaction?",
        "answer": "No. Original content remains. Use Redact PDF for permanent content removal."
      }
    ],
    "tags": [
      "sketch",
      "draw",
      "highlight",
      "annotate",
      "canvas"
    ],
    "cta": "Open Sketch over PDF →",
    "hero": {
      "input": "Original PDF page",
      "output": "Drawn notes and highlights"
    }
  },
  {
    "slug": "mark-up-a-pdf-for-a-review",
    "title": "Mark up a PDF for a review",
    "summary": "Use colour, readable strokes and a separate annotated copy to explain a review.",
    "category": "Edit & sign",
    "tool": "sketch-over-pdf",
    "toolId": "sketch-pdf",
    "toolNumber": 67,
    "intent": "Practical guide",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "steps": [
      "Open one PDF in Sketch over PDF.",
      "Choose Pen or Highlight, ink colour and thickness. Draw on the page. Use Scroll to navigate without drawing.",
      "Use Previous or Next for another page. Undo, redo or clear marks on the current page.",
      "Press Download annotated PDF, then Download PDF on the result screen. Use Download this page PNG when you only need the current view."
    ],
    "sections": [
      {
        "heading": "A canvas for the document",
        "paragraphs": [
          "Drawing controls sit above the paper so the canvas can use the available width. On a phone the compact toolbar scrolls horizontally. Pen and Highlight make marks; Scroll lets a touch gesture move through the workspace without adding a stroke.",
          "Marks are stored separately for each source page while the tab remains open. Switching pages retains them. Undo and redo affect the current page, and Clear page removes that page’s marks. A no-change PDF export returns the original bytes."
        ]
      },
      {
        "heading": "Keep marks understandable",
        "paragraphs": [
          "Choose a visible ink colour that contrasts with the source. Thin pen strokes work for short notes, while highlights use translucent broad strokes. Inspect the result at readable size and avoid obscuring a chart or required form value.",
          "These marks are annotations in a reading copy. They do not replace original text and do not securely remove sensitive material. Use the dedicated Redact tool when permanent removal is required."
        ]
      }
    ],
    "check": "Reopen the annotated PDF and inspect every marked page, especially pages with rotation or fillable fields.",
    "limit": "Sketch adds visible strokes to original page content. If fillable fields could cover your marks, make fields read-only before export. No-change exports return the original bytes. Digital signatures can be invalidated by changes. Work is not automatically saved when the tab closes.",
    "tips": [
      "Choose Scroll before navigating with a finger.",
      "Keep an unmarked original and download before leaving."
    ],
    "faq": [
      {
        "question": "Can I erase a mistake?",
        "answer": "Use Undo for the latest stroke or Clear page for all marks on the current page."
      },
      {
        "question": "Why is touching the page drawing instead of scrolling?",
        "answer": "Pen or Highlight is selected. Choose Scroll in the drawing toolbar."
      },
      {
        "question": "Is drawing over a name a secure redaction?",
        "answer": "No. Original content remains. Use Redact PDF for permanent content removal."
      }
    ],
    "tags": [
      "sketch",
      "draw",
      "highlight",
      "annotate",
      "canvas"
    ],
    "cta": "Open Sketch over PDF →",
    "hero": {
      "input": "Original PDF page",
      "output": "Drawn notes and highlights"
    }
  },
  {
    "slug": "fix-pdf-sketch-scroll-and-export",
    "title": "PDF sketch troubleshooting: scrolling, forms and export",
    "summary": "Choose Scroll when navigating and handle fillable fields before exporting visible marks.",
    "category": "Edit & sign",
    "tool": "sketch-over-pdf",
    "toolId": "sketch-pdf",
    "toolNumber": 67,
    "intent": "Practical guide",
    "published": "2026-10-09",
    "updated": "2026-10-09",
    "steps": [
      "Open one PDF in Sketch over PDF.",
      "Choose Pen or Highlight, ink colour and thickness. Draw on the page. Use Scroll to navigate without drawing.",
      "Use Previous or Next for another page. Undo, redo or clear marks on the current page.",
      "Press Download annotated PDF, then Download PDF on the result screen. Use Download this page PNG when you only need the current view."
    ],
    "sections": [
      {
        "heading": "A canvas for the document",
        "paragraphs": [
          "Drawing controls sit above the paper so the canvas can use the available width. On a phone the compact toolbar scrolls horizontally. Pen and Highlight make marks; Scroll lets a touch gesture move through the workspace without adding a stroke.",
          "Marks are stored separately for each source page while the tab remains open. Switching pages retains them. Undo and redo affect the current page, and Clear page removes that page’s marks. A no-change PDF export returns the original bytes."
        ]
      },
      {
        "heading": "Keep marks understandable",
        "paragraphs": [
          "Choose a visible ink colour that contrasts with the source. Thin pen strokes work for short notes, while highlights use translucent broad strokes. Inspect the result at readable size and avoid obscuring a chart or required form value.",
          "These marks are annotations in a reading copy. They do not replace original text and do not securely remove sensitive material. Use the dedicated Redact tool when permanent removal is required."
        ]
      }
    ],
    "check": "Reopen the annotated PDF and inspect every marked page, especially pages with rotation or fillable fields.",
    "limit": "Sketch adds visible strokes to original page content. If fillable fields could cover your marks, make fields read-only before export. No-change exports return the original bytes. Digital signatures can be invalidated by changes. Work is not automatically saved when the tab closes.",
    "tips": [
      "Choose Scroll before navigating with a finger.",
      "Keep an unmarked original and download before leaving."
    ],
    "faq": [
      {
        "question": "Can I erase a mistake?",
        "answer": "Use Undo for the latest stroke or Clear page for all marks on the current page."
      },
      {
        "question": "Why is touching the page drawing instead of scrolling?",
        "answer": "Pen or Highlight is selected. Choose Scroll in the drawing toolbar."
      },
      {
        "question": "Is drawing over a name a secure redaction?",
        "answer": "No. Original content remains. Use Redact PDF for permanent content removal."
      }
    ],
    "tags": [
      "sketch",
      "draw",
      "highlight",
      "annotate",
      "canvas"
    ],
    "cta": "Open Sketch over PDF →",
    "hero": {
      "input": "Original PDF page",
      "output": "Drawn notes and highlights"
    }
  }
];
