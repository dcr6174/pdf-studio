# PdfCraft and REA integration review — 22 October 2026

## Shipped scope

PDF Studio keeps its React interface and current PDF engines. This update implements independently written improvements informed by PdfCraft's documented navigation and preservation behaviour:

- Reader document bookmarks retain nested chapters, support title search and keep matching ancestors visible.
- Reader page previews have a 120–210 px size control. Actual PDF page labels appear alongside physical page numbers.
- Standard bookmark destinations retain their view coordinates and zoom after supported page assembly instead of being reset to Fit.
- Custom PDF page labels survive page assembly, including reordering and duplication. Unlabelled pages use output page numbers. Labels are flattened into per-page descriptors; original number-tree structure is not retained.
- Malformed or cyclic optional label trees are bounded. Unsupported bookmark view parameters fall back to Fit. No PDF actions are executed by the reader bookmark panel.

No upstream code, branding, dependencies, agent configuration or native executables are incorporated. Document processing stays on the visitor's device. REA is not added to the public application.

## Why the engines were not replaced

PdfCraft is a Rust workspace with a browser app built with egui/eframe and Trunk. Its web app is not a React SDK. Selective reuse would require a purpose-built WASM interface, lifecycle and memory handling, a worker adapter and output compatibility testing.

The current site already provides OCR, original-text editing, comparison, workflows, output checks and bookmark/internal-link preservation. Replacing these wholesale would expand compatibility risk without demonstrated benefit.

## Follow-up candidates and release gates

1. Content-level redaction: trial the `redact` crate behind a separate experimental adapter. Verify removed content, accessibility replacement text, images, shared resources, links, forms and full-rewrite output independently. Retain the existing image-rebuild path until the experiment is proven.
2. Form-data exchange: design explicit import conflict handling and test supported field types, Unicode and saved appearances before adding XFDF/FDF.
3. PDF/A readiness: upstream preflight checks only a subset of requirements. Do not advertise certified conformance or conversion without independent validation.
4. Certificate signatures: separate visual signatures from cryptographic signing. Browser support and certificate/trust handling require dedicated investigation.
5. REA: consider local developer-only investigation when ordinary source inspection is insufficient. Do not install or run downloaded analysis software as a side effect of normal PDF use.

## Sources and licensing

- https://github.com/storytold/pdfcraft — README, Cargo workspace, web app Cargo manifest, redaction source, signing dependencies and preflight source reviewed.
- https://github.com/morluto/rea — README and repository metadata reviewed.

PdfCraft workspace code declares MIT OR Apache-2.0; its branding is excluded from that grant. REA declares MIT. Any future code reuse requires retaining applicable notices and checking the actual selected dependencies/assets, rather than assuming the top-level licence covers everything.

## Validation boundaries

`checks/verify-reader-navigation.mjs` exercises bookmark resolution and filtering, malformed destinations, bounded cyclic structures, mixed/reordered page labels and saved/reopened bookmark coordinates. It is included in repository CI alongside reader password and render-queue checks. Existing form assembly tests independently render saved output with Poppler. These checks do not certify all PDFs, real-phone touch behaviour or the upstream engines, which were not built or installed for this change.
