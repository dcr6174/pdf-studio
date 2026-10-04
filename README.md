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
| Pages | Reading layout preference | Sets a PDF viewer preference. Some readers ignore it. |
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
| Pages | Interleave pages | Weave pages from multiple PDFs. |
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
| Privacy | Calculate file hash | Calculate a SHA-256 file hash. |
| Pages | Bundle PDFs | Put your PDF files in a ZIP. |
| Privacy | Repair readable PDF | Can resave PDFs that parse successfully. Severely damaged PDFs may not be recoverable. |

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

### Improvement-guide follow-up (October 2026)

- Homepage remains tool-first, with no upload target until a tool is selected. Its headline now explicitly identifies free PDF tools.
- All 56 tool landing pages include visible breadcrumbs and truthful free WebApplication structured data. No ratings or rich-result promises are included.
- Merge, split, compress, existing-text editing, signing, images to PDF, organize, OCR, redaction and form filling have task-specific instructions, use cases, output checks and common questions. This initial ten-tool batch was subsequently expanded to all 56 tools in the complete follow-up below.
- The production URL `pdf-studio.dcr6174.workers.dev` remains accessible without redirecting to `pdf-studio.in`, per the owner's request. Do not enable that redirect until the owner explicitly asks. Workers responses remain noindex; other preview hosts remain usable and noindex.
- Installation does not imply offline support: no service worker currently provides reliable offline operation. Search Console ownership, indexing, real-user performance and deployed redirect behavior still require external verification.

Generate assets with `npm run generate:site-assets`, then verify with `node checks/verify-seo.mjs`, `npm run verify:public`, `npx tsc --noEmit` and `npm run build:public`.

### Complete SEO and discovery follow-up

- 56 functional tools now have individually written configuration instructions, use cases and output checks. Each of the 62 landing pages contains three visible steps and five FAQs, with matching WebApplication, BreadcrumbList, HowTo and FAQPage schema. This does not promise Google rich results or rankings.
- Added real workspace pages for JPG to PDF, PNG to PDF, PDF to Excel, deleting pages, extracting pages and the online PDF editor. PDF-to-Excel remains heuristic text extraction; the online annotation editor is distinct from existing-text editing. No unsupported PowerPoint-to-PDF or HTML-to-PDF conversion is advertised.
- Renamed Interleave pages, Reading layout preference, Calculate file hash and Repair readable PDF while preserving the existing guide URLs and engine IDs.
- The homepage keeps six popular tools, shows category filter pills with counts, groups all 56 guides with descriptions, and explains free processing, offline limitations and actual limits. It has no upload target.
- A single light/dark button in the header follows the device setting until you pick a side, then remembers your choice locally. The PDF page canvas retains its document colors.
- Report a problem creates a copyable/downloadable local text template. It submits nothing and includes no document bytes, filenames, passwords or signatures automatically. A public support intake destination has not been configured.
- All landing pages and the homepage have generated 1200×630 PNG social cards using the existing logo and large-image Twitter metadata.
- `npm run generate:site-assets` regenerates social cards and the sitemap from the registry. Tracked content fingerprints preserve lastmod dates on unchanged rebuilds. The public build runs this automatically. Generated social PNGs are build outputs, not separately checked-in source; run the generator before standalone SEO checks.
- Workers URLs remain accessible and noindex. The production Workers redirect stays disabled until the owner explicitly authorizes it.

Not completed by code alone: Search Console/Bing ownership verification, search indexing, real-user Core Web Vitals, a configured support inbox, payments/donations and ads. No subscription, ad script, payment request or tracking expansion was introduced.

### UI consistency patch verification

Integrated the supplied UI patch: one theme button, one install control in the header, counted category filters, a collapsed crawlable guide directory, shared static-page header, and aligned footer actions. Privacy settings remain available. Theme initialization follows the device even if storage is blocked; a manual choice remains active for the current session in that case. SEO pages and PDF capabilities are preserved.

Validation for the UI patch: TypeScript, homepage SSR, navigation/install contracts, 62 SEO guides, owner-access rules, theme initialization tests and production build pass. All 28 source lint errors have now been fixed without disabling lint rules; full source lint passes with 0 errors and 31 warnings. Regression checks cover PDF processing, native-text export, signatures, workspace history, analytics and privacy preferences. Phone/desktop visuals, actual first paint and browser theme-button events remain unverified here.

### Tool-page layout and navigation follow-up (1 October 2026)

Tool pages use a dedicated wrapper so article styles cannot change workspace navigation. Each tool has one breadcrumb, and its task guide appears inside the workspace above the footer while that tool is selected. Anchor links and skip links retain the current tool; returning to a landing page with no fragment restores its tool. Empty-screen options align with the upload area, FAQ sections share styling, and Privacy/About include the shared footer. Related guides prioritize supported popular workflows.

Validation: archive integrity and patch application passed; source lint passes with 0 errors and 32 warnings (including the new footer image warning), TypeScript and production build pass. All 62 guide SSR checks confirm one breadcrumb, a working file input and instructions before the footer. `node checks/verify-tool-navigation.mjs` tests the actual history handler for anchors, tool/home/shelf routes and busy/unsaved-text guards. PDF processing, native-text export, signatures, analytics, owner access and theme checks pass. Dependencies and lockfile were unchanged; checks used the installed dependencies rather than a new `npm ci`. Real browser layout, focus, touch and mobile interactions remain unverified here. The Workers redirect remains disabled.

### Guide-link navigation (1 October 2026)

Landing-tool changes now synchronize the retained client workspace, so opening another guide does not leave the previous tool selected. Anchor links continue to preserve the tool. Tool-guide clicks are blocked during processing, unsaved native-text changes or pending redaction. Verification covers all 56 tool IDs and link destinations across 62 server-rendered guides; lint (0 errors, 31 warnings), TypeScript and production build pass. Actual live browser link clicks and Cloudflare deployment remain unverified.

### Browser-confirmed navigation failure and fix (1 October 2026)

On the deployed Workers site, guide and Privacy footer clicks did not change the URL. Console errors in the vinext Link chunk reported `TypeError: e is not a function` and RSC prefetch errors. Opening the Compress destination directly worked; its FAQ disclosure expanded correctly. Public page links now use `BrowserLink`, a standard HTML anchor, bypassing the failing client router. Existing workspace buttons and tool-menu handlers continue to preserve the document. Opening another guide, Privacy or About now loads a new page; save or download work first, and the existing beforeunload warning applies when documents/text are present. Native anchors support keyboard use, browser back/forward and opening new tabs. Automated link, homepage, 62-guide, navigation, lint, TypeScript and build checks pass. Live verification of this new commit requires Cloudflare to deploy it. The main domain returned 502 in this audit browser; this does not establish availability for other visitors. Workers-to-domain redirect stays disabled.

Tools-menu mouse clicks now keep a menu already opened by hover open; touch and keyboard activation still toggle it. Policy regression tests cover these input modes.

### Limit messaging (2 October 2026)

Removed the homepage processing-limits table and numeric caps from upload areas, tool notes, guides, FAQs and existing-text help. Supported formats and processing/privacy explanations remain visible. Validation thresholds remain enforced; exceeding file size, page count, image dimensions or batch count displays the relevant actionable error. This is a presentation change, not unlimited processing.

### React navigation and upload reliability (October 4, 2026)

The studio already uses React 19; this update improves the existing app rather than replacing it.

- Tool selections update to shareable `/tools/<slug>` URLs while retaining the in-memory document. Reloading opens that tool. Startup hashes do not add history entries; direct hash changes and Back/Forward share the same guards, including pending redactions.
- The Tools menu remains open after keyboard activation and supports native Ctrl/Cmd-click for opening a tool in another tab. A separate tab starts its own workspace.
- Rejected uploads retain the prior document and downloadable output. File counts and bytes are checked before parsing; page counts are checked incrementally. Removed pages no longer consume page capacity when appending documents.
- Form field extraction finishes before the workspace is replaced. Existing-text limits are validated before committing an upload and again when opening existing workspace content.
- Batch counts are validated at upload and processing time. Rejection messages state the actual amount, permitted amount and recovery action. Numeric limits remain absent from the normal homepage and tool screens.
- Signing shows signature/image placement controls; general annotation controls remain in Edit PDF. On narrow screens, the existing-text document appears before the controls.

Verification: `node checks/verify-react-workflows.mjs`, `node checks/verify-tool-navigation.mjs`, `node checks/verify-browser-links.mjs`, plus the existing PDF, signature, SEO and homepage checks. Workflow tests execute the actual upload handler with PDF parsing mocked; engine checks independently validate generated PDFs. These tests do not establish real-user performance or every mobile/browser interaction. Cloudflare deployment is separate; the Workers redirect remains disabled.

### Motion and lint cleanup (October 4, 2026)

Subtle EasyUI-inspired CSS interactions now provide button press feedback, tool-card hover elevation, menu reveal/chevron rotation, FAQ answer reveal and result confirmation. They use native controls, add no animation package, preserve server-rendered guide content, and respect reduced motion. PDF pages, signatures and drag coordinates are not animated. These are adapted interaction patterns, not an installation of the entire EasyUI component library.

React navigation uses a memoized callback with explicit dependencies; startup navigation uses an effect event so it reads current state without rerunning bootstrap. Thumbnail rendering tracks changed bytes and image data. Images use one browser-only component with explicit logo dimensions, asynchronous decoding and lazy private previews; document images never go through an image optimization server. The Next-specific server image-optimization lint rule is exempted only in that wrapper, where native images are required by the privacy model. Generated `.verify-*.mjs` files are excluded from lint because their TypeScript source is checked instead. Unused imports and variables were removed; form and installation conditionals are explicit. Check with `npm run lint` and `npx tsc --noEmit`.

EasyUI references and its MIT notice are recorded in `THIRD_PARTY_NOTICES.md` and `licenses/EasyUI-MIT.txt`.
