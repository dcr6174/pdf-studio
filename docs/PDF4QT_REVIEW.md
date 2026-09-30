# PDF4QT comparison — reviewed 30 September 2026

Sources: https://www.reddit.com/r/linux/comments/1hbqms1/open_source_program_to_modify_pdf_text_is_pdf4qt/ and https://github.com/JakubMelka/PDF4QT (master b3cf609468dc413dae835c1f7b1f6dacfdad0c9a).

The Reddit thread distinguishes original text editing from annotation and reports font changes with imported PDFs. These are individual reports, not measured prevalence. PDF4QT's current source contains a content editor processor and stream builder; its README lists desktop editing, attachments, optional layers, signature validation/signing, XFA viewing and public-key encryption. Those are upstream capabilities, not independently tested here.

PDF4QT is a native C++20/Qt toolkit, not a JavaScript browser package. The core is MIT; Qt and other bundled libraries have separate licenses. No upstream code was copied. A browser port would require dependency, build, memory and rendering work; the current Workers deployment does not run this desktop executable.

| Capability | PDF Studio status / next action |
|---|---|
| Existing text replacement | Added conservative native content-stream replacement: standard Type1 fonts, printable English, single Tj operands, replacement no wider than original. Not full paragraph editing. |
| General existing text editing | Missing. Requires font encoding/subset handling, TJ runs, transforms, shared forms, reflow and faithful previews. |
| Existing image/object manipulation | Missing; current image elements are overlays. Requires content-object editing engine. |
| Page organization, overlays, forms, speech, compression | Existing workflows retained; fidelity and device limits remain. |
| Document comparison | Existing visual comparison; semantic diff missing. |
| Attachments and bookmarks editing | Missing; next browser-compatible document-structure work. |
| Layers and internal structure inspection | Missing; prioritize reader layers before arbitrary object mutation. |
| Certificate signing/validation | Missing; signature image placement is not certificate signing. Requires key custody, trust chain and incremental-save validation. |
| XFA | Not promised; dynamic XFA unsupported. |
| Public-key security | Missing; current password encryption is different. |
| OCR and redaction | Existing bounded implementations; redaction rasterizes output. |

New text replacement never paints a cover rectangle. Unsupported matches fail; original input is retained. Supported replacement is visible in the exported-result inspector, not a live original-page preview. Removing an occurrence from a stream is not secure redaction: other streams, metadata or attachments may contain copies. Use the dedicated redaction workflow for sensitive information. Editing invalidates existing digital signatures. Always inspect exported output.

Validation: automated synthetic PDF test verifies actual operand replacement, saved PDF/page integrity, width guard, absent-text and Unicode rejection. Embedded-font, complex-script, Form XObject and full paragraph editing are not implemented. No desktop PDF4QT runtime or browser visual test was run. Full parity is not claimed.
