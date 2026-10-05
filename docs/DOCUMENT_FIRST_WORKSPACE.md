# Document-first workspace — 5 October 2026

## Changes

1. Loaded tool pages use a compact heading with filename, page count, size and Replace file. The duplicate workspace rail is confined to home; duplicate FileFacts cards are removed. Editor modes sit immediately above the canvas. Warnings remain visible. No measured 570px saving is claimed.
2. Edit text, Edit PDF and Sign share a mode bar and the same workspace. Switching away from native text commits both saved edits and pending inline typing through the real PDFium engine before navigation. Invalid text stays in the editor with an error. Redaction guards remain. Added marks are preserved when native edits are committed; engine limitations documented elsewhere still apply.
3. On phones, selecting text raises zoom to 150%, centers the selected line and opens an editing sheet. The sheet responds to VisualViewport keyboard changes and safe-area insets. Enter/Save commits; Escape/Cancel keeps the previous value. Physical phone keyboard behavior remains unverified.
4. Export opens one full-screen, focus-managed result dialog. Download is first, receives focus and scrolls into view. Result previews load only after opening Inspect exported PDF. Closing retains the output and exposes View exported result. Toasts are not rendered over this dialog. Download, continue editing, local saving and signed-output password protection remain available.
5. Native selects/options, Radix selects, editor controls, signature cards, dialogs and errors use shared theme variables. Document canvases and signature image previews deliberately remain white. Light/dark foreground, error and success pairs are measured by `checks/verify-document-first.mjs` and exceed WCAG AA's 4.5:1 normal-text requirement.
6. Signature creation has keyboard-operated Type/Draw/Upload/Camera tabs. Selecting Use signature starts placement; click/tap the page to insert it. A Place in page centre alternative and Cancel are visible. Existing pointer resize handles, arrow-key movement, shift-arrow resizing and numeric fields remain. Camera is a capture file input whose behavior depends on the device/browser. Saved signatures remain optional and local.
7. `/tools` provides a categorized, searchable directory with 57 unique direct destinations and consistent individual tool icons. Home cards are now anchors; ordinary clicks preserve workspace navigation, while modified clicks/new tabs use real URLs. The menu and static headers link to the directory; it has metadata and a sitemap entry.

## Verification

Lint, TypeScript and production build; actual PDFium edit/export/reopen at four page rotations and a 45-degree text-object angle; original byte preservation and pending draft commit; signing/export wiring; homepage and menu SSR; searchable directory destinations; signature tab semantics; theme contrast; tool navigation; SEO; owner boundaries; processing fixtures.

Full interactive browser/mobile, touch placement, virtual keyboard and camera testing could not be completed in this environment. No live deployment result or Lighthouse improvement is claimed. The build retains existing bundler warnings. Run `node checks/verify-document-first.mjs` for the new SSR/contrast checks.

## Preserved limits

Uploads appear inside tools, not on the homepage. Input limits are explained only after rejection. No account is needed. Files/signatures remain locally processed/stored. Untouched exports preserve their bytes in the supported workflows. Existing-text editing still does not support arbitrary paragraph reflow, missing embedded glyphs, nested text or reconstructed scan editing. Appearance changes do not extend those engine capabilities.
