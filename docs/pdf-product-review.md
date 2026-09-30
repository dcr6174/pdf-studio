# OpenPDF product review and redesign

Research date: 30 September 2026. Scope: eight representative PDF services; this is not an exhaustive review of every PDF website. Public pages and review excerpts were inspected, not every competitor workflow or paid account. Complaints are qualitative signals, not a representative survey. Self-promotional Reddit posts were excluded as proof of prevalence.

## Competitor findings

| Service | Evidence reviewed | Useful lesson | Opportunity for OpenPDF |
| --- | --- | --- | --- |
| iLovePDF | Official pricing and tool list | Broad catalog and clear task naming. Basic has limited processing; Premium includes workflows and digital signatures. OCR Word/Excel conversion is premium. | Free task chaining; clear distinction between visual and certificate signatures. |
| Smallpdf | Official pricing, support, Free vs Pro comparison; Capterra reviews | Free tools have download and advanced-feature restrictions; users mention daily limits. | Explain costs and capability before work starts, keep exports free. |
| Sejda | Official editor | Existing-text editing, forms, image placement. Editor advertises 200 pages / 50 MB / three tasks hourly; uploads are deleted after two hours. | Retain local processing and disclose practical memory limits. True existing-text editing remains a gap. |
| PDF24 | Official tools homepage | Already free without artificial limits; server processing and ads support its model. Offline Creator keeps files local. | Free pricing alone is insufficient differentiation. Provide a coherent, uncluttered local workspace. |
| PDFgear | Official secure-tools page | Already offers local browser processing. | Compete on workflow, accessible controls and truthful output quality. |
| ihatepdf.cv | Official homepage | Browser-first breadth; editor, OCR, privacy tools and conversions. Page contains mixed tool counts and a no-size-cap claim alongside a desktop size figure. Its AI chat names an external provider. | Consistent tool counts; qualify device limits; never imply external AI is on-device. Claims were not independently validated. |
| Adobe Acrobat online | Official tools page | Strong task taxonomy across conversion, editing, signing, AI; encourages sign-in and trial. | Start core tasks immediately; retain free download. No claim of matching Adobe's engine fidelity. |
| PDF Candy / Soda PDF | Official catalog / editor | Large catalog and editor entry points. | Make common tasks prominent rather than treating tool count as the primary benefit. Paid limits were not verified. |

## User pain points and implementation

| Pain point | Evidence strength | Response shipped |
| --- | --- | --- |
| Unexpected free-tier limits | Official plans plus Smallpdf review excerpts | Explicit no daily task limits; existing free exports retained. |
| Privacy concerns when uploading | Architecture confirmed in official Sejda/PDF24/PDFgear pages; preference inferred | Local file processing retained; clear on-device status. Analytics remains content-free with opt-out. |
| Too many tools to scan | Design inference, not a measured complaint | Eight everyday shortcuts; categorized catalog and task/file aliases in search. |
| Editing or conversion promises exceed results | Confirmed against OpenPDF implementation | Limitations visible on cards and before opening files. Existing text editing is not advertised. |
| Compression damages usability | Confirmed in OpenPDF raster implementation | Default compact mode keeps text and links; raster presets explicitly disclose losses. No promised percentage savings. |
| Re-uploading between tasks | Confirmed in previous OpenPDF flow | Continue from exported PDF into organize, sign, compress or protect without downloading/reselecting. |
| Difficult phone interactions | Design risk, not measured complaint | Larger controls, wrapping toolbars, compact essential grid, sticky export controls, narrow-screen layout. |
| Silent reading state | Confirmed in former inert workspace | Visible reading status outside the disabled workspace. |
| File rejected after selection | Confirmed implementation cap | Display practical 150 MB / 400 page limits before selection. No claim of unlimited memory. |
| No compression savings | Confirmed possible output | Show measured result and practical advice to keep the original or try another preset. |

## Feature coverage and remaining work

Existing free tools cover merging, extraction, organization, image export, visual text/image/highlight additions, drawn signatures, forms, OCR (English), AES-256 password protection, known-password removal, metadata, privacy patterns, raster redaction and text-based conversions. Fifty tools remain functional and free; this release improves their discovery and workflow rather than adding placeholder premium cards.

1. True existing-text editing: resolve fonts, encodings, ligatures, text runs and layout; provide a fallback annotation mode. A white rectangle is not secure removal.
2. Layout-faithful Office conversion: use a tested open-source conversion service or desktop/self-hosted companion. Browser text extraction does not preserve Word layout, PowerPoint editability or complex spreadsheet styling. Server infrastructure has costs even if users pay nothing; clearly opt in before uploading.
3. Better compression: image-aware optimization preserving text, links and forms; target-size iteration with an achievable/unachievable result and before/after previews. Current compact mode rewrites PDF objects; image presets rasterize.
4. OCR languages: downloadable language selection and confidence review. Device performance and model downloads need explicit estimates.
5. Certificate signing: distinguish drawn signatures from cryptographic signatures and managed signing requests. Identity verification and trusted certificates are not supplied by drawing a signature.
6. Scan to PDF: camera capture, cropping, deskew, image cleanup and mobile batch capture.
7. Accessibility validation: keyboard-only task completion, screen reader review, 200% zoom, low-memory phones and long filenames.
8. Performance: move suitable CPU work to dedicated workers, cancellation and recovery; retain device caps until measured.
9. Offline PWA: cache app/assets and offer optional OCR-model caching. Do not advertise fully offline before cold-start and repeat-use tests pass.
10. Discoverability: dedicated crawlable tool routes, task-specific descriptions and help, after workflow contracts are stable.

## Acceptance criteria for subsequent releases

- No payment or account wall at export for tools labeled free.
- Clearly show any network processing before sending document bytes.
- Merge output matches visible page order; touch and keyboard have alternatives to dragging.
- Compact compression keeps fixture text and page order; raster mode tells users what is lost.
- Conversion output is labeled text-only or image-only where appropriate.
- Redacted content is absent from exported text, images, metadata and attachments; do not equate overlay/crop with redaction.
- Visual signature position matches output on rotated pages and at different zoom levels.
- No horizontal clipping at 320px; interactive controls remain usable at 200% zoom.
- Practical size limits and errors appear before or during processing, never disguised as an upgrade offer.

## Sources

- https://www.ilovepdf.com/pricing
- https://smallpdf.com/pricing
- https://smallpdf.com/support
- https://smallpdf.com/blog/smallpdf-free-vs-pro-plan-comparison (search excerpt; direct fetch timed out)
- https://www.capterra.com/p/172606/Smallpdf/reviews/
- https://www.sejda.com/pdf-editor
- https://tools.pdf24.org/en/
- https://www.pdfgear.com/secure-pdf-tools/
- https://www.ihatepdf.cv/
- https://www.adobe.com/acrobat/online.html
- https://pdfcandy.com/
- https://www.sodapdf.com/pdf-tools/pdf-editor/

## Validation of this release

PDF-engine checks include compact output retaining original text content and reordered pages, plus existing merge/order, extraction, encryption, forms and ZIP checks. TypeScript and production build run before publication. Browser visual QA is unavailable in this environment because its required control-browser skill is not exposed; responsive changes are code-checked, not claimed as device-tested.
