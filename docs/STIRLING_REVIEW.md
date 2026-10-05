# Stirling-PDF review

Reviewed 5 October 2026 against main tree 885eac4b67f67b292c91b4bd02ba204f551d021e. Source review only; no comparative export-quality benchmark or deployed UI test.

| Opportunity | Source observed | PDF Studio recommendation |
|---|---|---|
| Better compression | CompressController uses PDFBox image resources and JPEG encoding | Prioritize image-object optimization that retains text over whole-page rasterization; verify masks, nested graphics and output fidelity |
| Split by chapters | SplitPdfByChaptersController resolves bookmark chapters; a PDFBox branch preserves form fields | Add bookmark-driven splitting with a range preview; preserve forms or disclose flattening |
| Blank-page detection | BlankPageController combines rendering/text checks with threshold controls | Offer detected candidates for user review; never silently delete faint signatures or annotations |
| Office conversions | ConvertOfficeController invokes LibreOffice and sanitizes input before conversion | Optional isolated server service, not a browser-only claim; disclose upload/retention and resource costs |
| OCR languages | OCRController includes language processing and external process orchestration | Browser language selection is a worthwhile independent upgrade; download only selected models and test Indian scripts |
| Automation | README advertises UI pipelines and APIs | Start with local saved workflow recipes over compatible operations, preserving originals and exposing lossy steps |

Our current single-line original-text editor is not improved simply by adding another website's UI. Paragraph editing, font substitution and actual fidelity validation remain separate work. No Stirling functionality was implemented or counted as new in this copy update.

## License and architecture

The top-level LICENSE is MIT with explicit exceptions for engine/, proprietary, desktop, cloud, SaaS and other directories. engine/LICENSE requires a valid user license for production and restricts client-facing use and derivative distribution. Do not assume every component is MIT. Review the specific source and dependency licenses before adopting any code. Existing app/core controllers are evidence of capabilities, not proof that their complete dependency chain can be reused without review.

Server-side Java/PDFBox and LibreOffice functionality does not run directly inside the present Cloudflare Worker/browser runtime. A self-hosted service would require a separate container host, resource controls, isolation, cleanup and an accurate privacy disclosure.

## Sources

- https://github.com/Stirling-Tools/Stirling-PDF/blob/main/README.md
- https://github.com/Stirling-Tools/Stirling-PDF/blob/main/LICENSE
- https://github.com/Stirling-Tools/Stirling-PDF/blob/main/engine/LICENSE
- https://github.com/Stirling-Tools/Stirling-PDF/blob/main/app/core/src/main/java/stirling/software/SPDF/controller/api/misc/CompressController.java
- https://github.com/Stirling-Tools/Stirling-PDF/blob/main/app/core/src/main/java/stirling/software/SPDF/controller/api/misc/BlankPageController.java
- https://github.com/Stirling-Tools/Stirling-PDF/blob/main/app/core/src/main/java/stirling/software/SPDF/controller/api/SplitPdfByChaptersController.java
- https://github.com/Stirling-Tools/Stirling-PDF/blob/main/app/core/src/main/java/stirling/software/SPDF/controller/api/converters/ConvertOfficeController.java
- https://github.com/Stirling-Tools/Stirling-PDF/blob/main/app/core/src/main/java/stirling/software/SPDF/controller/api/misc/OCRController.java

## Public copy change

Homepage: “60+ free tools to edit, organize, sign and convert. No account, no installation.” Search: “Search 60+ PDF tools”. Browse action: “Browse 60+ tools”. Menu: “60+ tools · your document stays with you”. Directory total: “60+”. Individual category and search-result counts retain their actual meaning; internal validation still checks the real catalogue size.
