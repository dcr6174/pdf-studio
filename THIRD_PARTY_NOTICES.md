# Third-party notices

Dependencies retain the licences in their installed packages, as locked in package-lock.json. Application MIT licensing does not replace those licences.

- PDF.js worker, CMaps and standard fonts: Mozilla PDF.js, Apache-2.0. See public/PDFJS-LICENSE.txt and upstream https://github.com/mozilla/pdf.js.
- Noto Sans Regular: SIL Open Font License 1.1. See public/fonts/OFL.txt and upstream https://github.com/notofonts/notofonts.github.io.
- pdf-lib and @pdf-lib/fontkit: MIT.
- @libpdf/core: MIT.
- React, dnd-kit, Radix UI, jsPDF, docx, pptxgenjs: MIT as declared in their installed package manifests.
- JSZip 3.10.2: dual MIT OR GPL-3.0-or-later; this distribution uses the MIT option.
- Mammoth 1.13.0, including its browser bundle: BSD-2-Clause.
- @napi-rs/canvas 0.1.100: MIT; transitive PDF.js dependency used by the Node validation harness, not added as a browser-processing service.
- Tesseract.js / OCR assets: Apache-2.0 and applicable upstream licences. Model assets are fetched at runtime.
- SheetJS xlsx 0.20.3: Apache-2.0. The upstream tarball and integrity are pinned in package-lock.json; the unmaintained npm 0.18.5 package is not used.
- Vinext/Sites starter and bundled UI primitives retain applicable upstream notices in the source.

## Interaction design attribution

The restrained press-compression and unfolding/reveal patterns in `app/studio-motion.css` were adapted for PDF Studio after inspecting EasyUI's PressButton and UnfoldAccordion source. The implementation uses native CSS rather than EasyUI's Framer Motion components and keeps PDF Studio's existing markup, colors and accessibility behavior.

- Project: https://github.com/Surajmaurya1/easyui
- Website: https://www.easyui.site/
- Reference source: `public/source/press-button.json` and `public/source/unfold-accordion.json`, inspected October 4, 2026.
- Copyright (c) 2026 Suraj Maurya. MIT License: see `licenses/EasyUI-MIT.txt`.

Other component and PDF dependencies retain their package licenses and existing notices.


## Outfit (logo wordmark)

The "pdf studio" wordmark in the v5 logo files is drawn from Outfit Bold, converted to vector outlines. Outfit is licensed under the SIL Open Font License 1.1 (https://openfontlicense.org). A Latin subset of Outfit Bold (public/fonts/Outfit-Bold-subset.woff, about 16 KB) is also shipped as the heading font; its license is in public/fonts/Outfit-OFL.txt.

## gifenc 1.0.3

Animated GIF encoding uses [gifenc](https://github.com/mattdesl/gifenc), Copyright Matt DesLauriers, under the MIT license. The license is included at `public/GIFENC-LICENSE.txt`. It is loaded only for the PDF-to-GIF worker.
