# Search intent and user frustrations — October 4, 2026

Research is a targeted public-source sample, not an exhaustive competitor audit or a statistical survey. Reports below were retrieved October 4, 2026. Reddit posts are user reports, not independently reproduced product defects. Repeated spreadsheet complaints suggest a pattern in this sample; one OCR report does not establish prevalence.

| Problem and evidence | Status in PDF Studio | Change / next action | Priority |
|---|---|---|---|
| Spreadsheet columns/rows become disorganized: reports July 3, 2025 and December 5, 2025; https://www.reddit.com/r/excel/comments/1lqm9r0/struggling_to_convert_messy_pdf_data_into_a_clean/ and https://www.reddit.com/r/excel/comments/1pf0zw8/whats_the_most_accurate_way_to_convert_pdf_tables/ | Heuristic text-row extraction; not table reconstruction | PDF-to-Excel instructions explain cleanup and scans; exported result now displays page coverage and a small text-row preview. Larger future work: coordinate-aware table extraction with representative ground truth. | P1 |
| OCR makes text selectable but correction remains confusing: isolated March 21, 2026 report https://www.reddit.com/r/pdf/comments/1s04avv/how_to_edit_ocr_recognized_text_in_a_pdf/ | OCR and existing-text editing are distinct and limited | Editor landing copy distinguishes overlays, searchable text and supported original-text edits. Avoid telling users OCR guarantees an editable original layout. | P1 |
| Advanced editing can require registration/payment: vendor documentation https://smallpdf.com/blog/smallpdf-edit-PDF-tool-now-even-better and https://smallpdf.com/pricing; isolated April 23, 2026 review https://chrome-stats.com/d/ohfgljdgelakfkefopgklcohadegdpjf/reviews | Core tools require no account and add no watermark | Keep the free statement visible and do not introduce a post-edit paywall. Review evidence supports frustration, not a claim that every competitor hides pricing. | P1 |
| Search names differ from catalogue names: repository audit showed existing keyword pages were missing from the homepage directory and reused generic task instructions | Existing aliases reuse working tools | Directory now links all six aliases; keyword-specific instructions/FAQs and H1s match the page intent. | P1 |
| Page positions can differ from printed labels; annotation can be mistaken for redaction | Product distinction, not a measured complaint frequency | Extract/delete guides explain file positions, Undo, output verification and real redaction. | P1 |
| Searches for PPTX/HTML conversion lead to unsupported expectations | No direct PPT/PPTX or HTML rendering engine | Added explicitly labelled manual export guides, with official sources and links to tools for finishing the exported PDF. No upload button or WebApplication schema claims a converter. | P2 |

## Routes and actual capabilities

- `/tools/jpg-to-pdf`, `/tools/png-to-pdf`: existing image-to-PDF engine.
- `/tools/pdf-to-excel`: existing heuristic XLSX extraction, with result review guidance.
- `/tools/delete-pdf-pages`: Organize workspace.
- `/tools/extract-pdf-pages`: Split/range extraction.
- `/tools/edit-pdf`, `/tools/pdf-editor`: annotation overlays.
- `/tools/edit-pdf-text`: supported existing-text objects, not general paragraph editing.
- `/tools/powerpoint-to-pdf`: manual PowerPoint export guide. Official steps: https://support.microsoft.com/en-us/powerpoint/training/save-powerpoint-presentations-as-pdf-files .
- `/tools/html-to-pdf`: browser print guide. Official instructions: https://support.google.com/chrome/answer/1069693 .

Processing caps remain rejection-only. Search landing pages do not imply guaranteed Google indexing, ranking, rich results or perfect conversion fidelity. Cloudflare Workers redirects remain unchanged.
