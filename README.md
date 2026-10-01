# PDF Studio

<img src="public/brand/pdf-studio-logo-v4.png" width="80" height="80" alt="PDF Studio logo" />

Free online PDF tools in a shared document workspace. Core tools require no account or subscription and add no watermark. Documents are processed on your device.

## Latest improvements

- **Unified logo:** clear P monogram with an integrated document fold, indigo and deep teal, plus an optically adjusted favicon, shared by the header, footer, guides, owner dashboard, social metadata, favicon and PWA icons.
- **All-tools menu:** hover Tools on desktop or click/tap it to reveal all 56 tools grouped by task, each with a meaningful icon and a colored category tile. Search, keyboard disclosure and Escape dismissal are supported.
- **Install awareness:** hides install actions in the installed app, after confirmed installs, and when supported browser APIs report this PWA installed. A fresh installable-browser event resets the remembered state after uninstall. Detection from Safari/unsupported browser tabs is limited.
- **Focused homepage:** six popular tools, searchable task categories and an explicit “Browse all 56 tools” action. Compact top navigation replaces the crowded sidebar and repeated shortcuts.
- **Full-width document workspace:** existing-text editing gives most of the screen to the actual PDF, with a narrow contextual editing panel. Mobile shows the page first and editing controls below.
- **Existing PDF text:** select a supported original text object, replace it, fit longer replacements into its area or preserve its size, and check the real PDF preview. Undo/redo and page selection are included.
- **Keep text edits:** commit the edited PDF into the shared workspace before switching tools. Navigation blocks accidental loss of uncommitted edits; explicit discard is available.
- **Signatures:** type a name or upload PNG/JPG/WebP with visible previews; optional drawing. Place, resize and export a visual signature.
- **Clear settings:** explicit choices and labeled actions replace theme, batch and analytics switches. Actual form and page-selection checkboxes remain.
- **Page and form tools:** insert blank pages, create bookmarks, split page halves, set reader layout, create new fillable text forms and remove annotations while preserving form widgets.
- **SEO:** descriptive homepage content, visible FAQ, crawlable guide links, 56 tool landing pages with an embedded workspace with metadata/canonicals/breadcrumbs, sitemap, privacy and about pages. No ranking guarantees.

## All available tools

Every current tool is listed below. “Available” does not mean every PDF is supported: important implementation boundaries are explicit.

| Category | Tool | Behavior and limits |
| --- | --- | --- |
| Pages | Add bookmarks | One bookmark per line: page number followed by its title. Replaces the exported outline. |
| Pages | Split pages in half | Uses CropBox boundaries; content outside each visible half is hidden, not securely removed. Rotations are retained. |
| Pages | Reader layout | Sets a PDF viewer preference. Some readers ignore it. |
| Privacy | Remove annotations | Works on the original single PDF; preserves form widgets. Export other workspace changes first. |
| Edit & sign | Create fillable form | Creates English text fields on new A4 pages. This does not add arbitrary field types to an existing PDF. |
| Pages | Merge PDFs | Bring your documents together. |
| Pages | Organize pages | Reorder, rotate and remove pages. |
| Pages | Split PDF | Extract the pages you need. |
| Pages | Split every page | One PDF per page, in a ZIP. |
| Pages | Compress PDF | Compact mode keeps text and links; image modes remove text search, links and forms. Savings depend on the document. |
| Pages | Rotate PDF | Turn pages in the right direction. |
| Pages | Reverse pages | Last page first. Simple. |
| Pages | Duplicate pages | Make a second copy of every page. |
| Pages | Alternate & mix | Weave pages from multiple PDFs. |
| Pages | Pages per sheet | Fit 2 or 4 pages on one sheet. |
| Pages | Crop margins | Cropping hides content outside the page boundary; it does not permanently remove it. |
| Pages | Resize to A4 | Fit every page onto an A4 sheet. |
| Pages | Mirror pages | Flip your document horizontally. |
| Edit & sign | Edit existing text | Browser text editing · 50 MB and 100 pages. Single-line edits can shrink to fit the original area (minimum half size). Embedded fonts need available characters; scans and nested graphics have limitations. No paragraph reflow. Editing invalidates digital signatures. |
| Edit & sign | Edit PDF | Adds new elements. Existing PDF text is not edited in place. |
| Edit & sign | Sign PDF | A visual signature, without a certificate or identity verification. |
| Edit & sign | Redact PDF | Export rebuilds all pages as images and removes original text, links, metadata and forms. |
| Edit & sign | Add watermark | Your text, across every page. |
| Edit & sign | Page numbers | Put your pages in order. |
| Edit & sign | Bates numbering | Add a prefix and sequential IDs. |
| Edit & sign | Headers & footers | Add a label to every page. |
| Edit & sign | Flatten PDF | Rebuilds pages as images. Text is no longer selectable; links and forms are removed. |
| Edit & sign | Fill PDF forms | Supports text, checkbox and dropdown fields. Choose editable fields or flatten the completed form. |
| Edit & sign | Edit metadata | Update title, author and subject. |
| Convert | Images to PDF | PNG, JPG and WebP below 22 megapixels per image; decoded images may use more memory than file size suggests. |
| Convert | PDF to JPG | Export pages as images in a ZIP. |
| Convert | PDF to PNG | Lossless page images, in a ZIP. |
| Convert | Extract text | Save selectable text as a TXT file. |
| Convert | PDF to Word | Text conversion; original layout and embedded images are not preserved. Use OCR first for scans. |
| Convert | PDF to HTML | Export text as a readable webpage. |
| Convert | PDF to EPUB | Reflow text for your e-reader. |
| Convert | PDF to PowerPoint | Slides are page images, not editable original text or graphics. |
| Convert | PDF to spreadsheet | Heuristic extraction. Review column alignment; scans need OCR first. |
| Convert | PDF to CSV | Extract text rows into a CSV. |
| Convert | Create PDF | Write a fresh document. |
| Convert | Markdown to PDF | Basic Markdown formatting; complex tables and embedded images are not supported. |
| Convert | Word to PDF | Reflows text; original Word layout, images and styling are not preserved. Legacy .doc is not supported. |
| Convert | Spreadsheet to PDF | Text-based conversion of the first sheet. Complex styling and charts are not preserved. |
| Convert | EPUB to PDF | Reflows text; ebook styling and illustrations are not preserved. |
| Convert | Grayscale PDF | Rebuilds pages as images. Text search, links and forms are lost. |
| Convert | Invert colours | Rebuilds pages as images. Text search, links and forms are lost. |
| Convert | Searchable PDF (OCR) | Downloads an English recognition model on first use. Accuracy varies; review important text. |
| Convert | Read aloud | Uses browser speech synthesis. Voice availability and offline support depend on your device. No audio-file export. |
| Pages | Compare PDFs | Check two documents side by side. |
| Privacy | Protect PDF | Add an AES-256 opening password. |
| Privacy | Remove password | Unlock with a password you know. |
| Privacy | Privacy scanner | Pattern matching can miss sensitive data or flag harmless text. Review the document before sharing. |
| Privacy | Remove metadata | Clears standard title, author, subject, keywords, producer and dates. It is not a complete sanitization of every hidden object. |
| Privacy | File fingerprint | Calculate a SHA-256 file hash. |
| Pages | Bundle PDFs | Put your PDF files in a ZIP. |
| Privacy | Resave PDF | Can resave PDFs that parse successfully. Severely damaged PDFs may not be recoverable. |

## Workspace features

- Reliable file-picker alternative to drag and drop, supported format checks and errors that retain the original workspace.
- Shared document across compatible tools; document undo/redo, thumbnail selection, zoom, rotation, page movement buttons and drag reordering.
- Insert matching-size blank pages; duplicate or delete selected pages.
- Inspect exported PDFs, download results, reopen results for further editing, or explicitly save them to My files.
- Explicit local saved drafts in IndexedDB. Clear browser data to remove saved copies. Unsaved work is not promised to survive a refresh.
- Batch ZIP output for compression, rotation, metadata removal, JPG/PNG export, protection, resaving and grayscale.
- Installable PWA, responsive layouts, visible keyboard focus, labeled controls and reduced-motion handling. Complete real-device accessibility verification remains pending.

## Important text-editor boundaries

**Edit existing text** changes supported original PDFium text objects. **Edit PDF** adds overlays. They are separate workflows.

Existing-text editing is limited to **50 MB and 100 pages**, single-line objects and available font characters. It does not provide paragraph reflow, arbitrary font substitution or editing text inside nested graphics. Fit mode can shrink text to **50%** of its original size; very long replacements are rejected and the original is retained. Editing invalidates existing cryptographic signatures.

OCR makes scans searchable, but the current OCR text layer does not turn the scanned image into editable original text. Signature placement is visual signing, not certificate-based digital signing. Redaction rebuilds pages as images and removes the original content layers; a crop or black shape alone is not redaction.

Office conversions are text-based or image-based as shown in the table; original layout, tables, images and fonts are not guaranteed. Full combined competitor feature parity remains incomplete: see [the coverage inventory](docs/FEATURE_PARITY.md).

## Privacy and owner analytics

Documents, filenames, passwords and PDF text do not enter analytics. Optional anonymous events count visits and tool activity; records expire after 48 hours. Usage counting can be disabled in **Privacy** and respects supported browser privacy signals. OCR downloads its recognition model. Read-aloud voices and network behavior depend on the browser and device.

Owner analytics is a separate protected route; public tools need no owner login. Configure runtime secrets and Cloudflare Access as described in [the hosting guide](docs/PUBLIC_HOSTING.md). The public website and owner/API routes must not share a blanket login restriction.

The normal workspace limit is **157.3 MB total and 400 pages**. Smaller feature-specific limits are shown in tools. Browser memory and device performance may impose practical limits before these ceilings. No unlimited free server processing is promised.

## Run locally

Requires Node.js **22.13 or newer**.

```sh
npm ci
npm run dev
```

PDF.js and PDFium assets are prepared automatically from pinned dependencies. A placeholder D1 configuration can support local builds; replace it with your real database ID before deployment.

## Deploy to Cloudflare

GitHub stores the code; Cloudflare Workers hosts the app and D1 analytics. Visitors need no GitHub or ChatGPT account. Follow [Start here](docs/START_HERE.md) and [the complete hosting guide](docs/PUBLIC_HOSTING.md).

```sh
node scripts/configure-public.mjs YOUR_DATABASE_ID
npm run build:public
npm run deploy:public
```

Set owner credentials as Cloudflare runtime secrets. Never commit tokens or passwords. With GitHub automatic deployment configured, a push can trigger a build; confirm the commit and successful deployment in Cloudflare. A GitHub push alone does not prove the live domain updated.

## Verification

```sh
npm install --no-save --package-lock=false @napi-rs/canvas@0.1.80 @xmldom/xmldom@0.8.15
npm run verify
npm run verify:studio
npm run verify:analytics
npm run verify:public
node checks/verify-extra-pdf.mjs
node checks/verify-signatures.mjs
node checks/verify-image-budget.mjs
node checks/verify-online-text.mjs
node checks/verify-seo.mjs
node checks/verify-homepage.mjs
node checks/verify-navigation-install.mjs
npx tsc --noEmit
npm run build:public
```

The raster helpers are development-only and pinned for reproducible verification. Tests validate generated PDFs and source-rendered pages; they do not replace browser/mobile testing. See [validation](docs/VALIDATION.md), [the UX audit](docs/HOMEPAGE_REFRESH.md) and [research/feature coverage](docs/RESEARCH_AND_AUDIT.md).

## License

Application code: [MIT](LICENSE). Dependencies and fonts retain their own licenses; see [third-party notices](THIRD_PARTY_NOTICES.md).

## Local audit improvements — 1 October 2026 (not deployed)

- All 56 catalog tools now have a direct landing URL, an embedded tool workspace, format/limit copy, troubleshooting, canonical metadata, breadcrumbs and relevant related tools. The sitemap includes every landing page. Existing 21 URLs are retained.
- Processing engine loads on the first document operation instead of a static homepage import. PDF.js, PDFium, OCR and conversion imports retain their task-specific loading. This is a bundle architecture improvement, not a measured Core Web Vitals claim.
- Replacing an open document requires an explicit confirmation; cancellation leaves the workspace intact. Undo can restore a successfully replaced workspace.
- Ctrl/Cmd+K respects processing and uncommitted existing-text guards. All-tools disclosure opens on keyboard focus as well as hover/click/tap.
- Install action is shown for an available native install prompt, or iOS Safari manual installation. Known installation and standalone detection remain best-effort, not universal. No service worker is currently registered; no offline/update-cache guarantee is made.
- Reduced-motion preference disables decorative spinner animation and transitions. Homepage explains that no installation or account is needed.

See [audit report](docs/AUDIT-2026-10-01.md) for evidence, the 56-tool status matrix, remaining gaps and validation. Files saved in My files/drafts remain in browser storage until explicitly removed or browser data is cleared. Read aloud can use network-backed browser voices; it is not covered by a blanket offline claim.

Security maintenance: SheetJS was updated from npm xlsx 0.18.5 to the upstream 0.20.3 tarball to address CVE-2023-30533 and CVE-2024-22363 affected version ranges. The lockfile records package integrity. Ordinary spreadsheet import/export regression passes; this is not a complete dependency security certification. Local owner routes receive noindex headers; www requests redirect to the preferred HTTPS domain when they reach the standalone Worker. Live bindings/headers remain unverified.

Image inputs now have a 22-megapixel canvas budget. Oversized PNG dimensions reject before bitmap decoding; all formats reject before canvas allocation. Bitmap/canvas resources are released on success and failure. JPEG/WebP decoding itself still occurs before the dimensions can be checked.

## Tool-first layout refinement
Homepage has no file-upload area; visitors choose a task before opening files. Empty tool entry, heading and upload card are centered. Shared workspaces use a centered maximum width while existing-text editing retains a wider canvas. Page thumbnails have a minimum-width grid and four equal-width action cells so delete buttons remain inside their card. Narrow document action rows wrap.
