# PDF Studio

<img src="public/brand/pdf-studio-lockup-v5.svg" height="64" alt="PDF Studio logo: Page Buddy, a friendly folded page" />

Free online PDF tools in a shared document workspace. Core tools require no account or subscription and add no watermark. Documents are processed on your device.

## Latest improvements

- **New brand, Page Buddy (v5):** a friendly soft-3D page with a folded-corner tuft and a simple face, with an Outfit Bold lowercase "pdf studio" wordmark converted to shapes. Light and dark lockups in the header swap with the theme; favicon (SVG + ICO), Apple touch, PWA and maskable icons, footer, dashboard and social images all use it. Full kit and rules: [docs/BRAND-V5.md](docs/BRAND-V5.md).
- **Homepage mascot animation:** Buddy drops in with a squash-and-bounce, the fold pops, eyes open and the smile draws (about 1.4 s, once). He then floats and blinks, his eyes follow a mouse pointer, and a tap or a file dragged onto the page makes him hop. Reduced-motion users see the still logo. Code: `components/buddy-hero.tsx`.
- **Slow light/dark switch:** the theme button cross-fades the whole page over 700 ms (View Transitions where supported, colour easing elsewhere, instant with reduced motion). The sun/moon icon turns as it swaps. Speed: `--theme-fade` in `app/studio-brand.css` and `FADE_MS` in `components/theme-toggle.tsx`.
- **All-tools menu:** hover Tools on desktop or click/tap it to reveal 60+ tools grouped by task, each with a meaningful icon and a colored category tile. Search, keyboard disclosure and Escape dismissal are supported.
- **Install awareness:** hides install actions in the installed app, after confirmed installs, and when supported browser APIs report this PWA installed. A fresh installable-browser event resets the remembered state after uninstall. Detection from Safari/unsupported browser tabs is limited.
- **Focused homepage:** six popular tools, searchable task categories and an explicit “Browse 60+ tools” action. Compact top navigation replaces the crowded sidebar and repeated shortcuts.
- **Full-width document workspace:** existing-text editing gives most of the screen to the actual PDF, with a narrow contextual editing panel. Mobile shows the page first and editing controls below.
- **Existing PDF text:** select a supported original text object, replace it, fit longer replacements into its area or preserve its size, and check the real PDF preview. Undo/redo and page selection are included.
- **Keep text edits:** commit the edited PDF into the shared workspace before switching tools. Navigation blocks accidental loss of uncommitted edits; explicit discard is available.
- **Signatures:** type a name or upload PNG/JPG/WebP with visible previews; optional drawing. Place, resize and export a visual signature.
- **Clear settings:** explicit choices and labeled actions replace theme, batch and analytics switches. Actual form and page-selection checkboxes remain.
- **Page and form tools:** insert blank pages, create bookmarks, split page halves, set reader layout, create new fillable text forms and remove annotations while preserving form widgets.
- **SEO:** descriptive homepage content, visible FAQ, crawlable guide links, 57 tool landing pages with an embedded workspace with metadata/canonicals/breadcrumbs, sitemap, privacy and about pages. No ranking guarantees.

## All available tools

Every current tool is listed below. “Available” does not mean every PDF is supported: important implementation boundaries are explicit.

| Category | Tool | Behavior and limits |
| --- | --- | --- |
| Pages | Add bookmarks | One bookmark per line: page number followed by its title. Replaces the exported outline. |
| Pages | Split pages in half | Uses CropBox boundaries; content outside each visible half is hidden, not securely removed. Rotations are retained. |
| Pages | Reading layout preference | Sets a PDF viewer preference. Some readers ignore it. |
| Convert | PDF to WebP | Rasterized page images in ZIP; browser WebP support required. |
| Pages | Remove bookmarks | Removes the outline on the original single PDF, keeping content and links. |
| Privacy | Remove embedded files | Removes reachable attachment entries and references; not secure sanitization of old bytes. |
| Privacy | Remove PDF links | Removes Link annotations, preserving comments, form widgets and visible URL text. |
| Privacy | Remove annotations | Works on the original single PDF; preserves form widgets. Export other workspace changes first. |
| Edit & sign | Create fillable form | Creates English text fields on new A4 pages. This does not add arbitrary field types to an existing PDF. |
| Pages | Merge PDFs | Export appears after two PDFs are added. Fillable form fields are not preserved; fill and flatten forms before merging. |
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
| Convert | Scan to PDF | Take a photo with the phone or tablet camera (or choose photos); each photo becomes a page. No automatic cropping or text recognition. |
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
| Convert | Text to PDF | Write a fresh document. |
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

The normal workspace limit is **157.3 MB total and 400 pages**. Feature-specific limits are reported when validation rejects an input. Browser memory and device performance may impose practical limits before these ceilings. No unlimited free server processing is promised.

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

## Brand and theme

- Logo files live in `public/brand/` (`*-v5.*`), mascot expressions in `public/brand/buddy/`. Older v2 to v4 logos were removed.
- Colours: violet `#6A4DFF`, deep violet `#4B2FE0`, ink `#1B1640`, lavender `#EDE9FF`, blush `#FF8FB8`, mint `#22C79E`.
- Do not edit the SVGs by hand to recolour them; follow [docs/BRAND-V5.md](docs/BRAND-V5.md). A preview sheet is in `docs/brand-sheet-v5.png`.
- Applying an update package: see [docs/HOW_TO_APPLY.md](docs/HOW_TO_APPLY.md).

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

### Search landing pages and evidence-backed guidance (October 4, 2026)

JPG-to-PDF, PNG-to-PDF, PDF-to-Excel, Delete PDF pages, Extract PDF pages and PDF editor already existed as working-tool aliases. They now have task-specific steps, use cases, checks and FAQs, matching page headings, and crawlable links in the homepage guide directory. The directory also links the existing Edit PDF page. The normal homepage still has no upload area.

`/tools/powerpoint-to-pdf` and `/tools/html-to-pdf` are clearly labelled manual export guides with official instructions, separate structured data, social previews, canonical URLs and sitemap entries. They do not accept PPTX/HTML or pretend to offer direct conversion. Export in PowerPoint or the browser first, then use PDF Studio to finish the PDF. External applications/webpages have their own file handling and network behavior.

Spreadsheet/CSV results show extracted row count, pages containing selectable text and a short browser-local row preview. Missing text pages are flagged; original tables, formulas and formatting are not reconstructed. This preview is not sent to analytics. See `docs/SEARCH_INTENT_AND_PAIN_POINTS.md` for dated sources, limitations and follow-up priorities. Numeric input caps remain visible only after rejection.

### Page Buddy brand, mascot animation and slow theme switch (October 4, 2026)

- Replaced the folded-P logo with Page Buddy v5 everywhere (header lockup with light/dark versions, favicon SVG + ICO, PWA/Apple icons, footer, dashboard, social image generator, manifest colours `#6A4DFF` / `#F7F6FF`).
- Added `components/buddy-hero.tsx` above the homepage headline.
- Theme button now cross-fades over 700 ms; automatic device-theme changes use the same fade.
- Dark mode: the homepage FAQ no longer sits on a separate panel.
- `checks/verify-navigation-install.mjs` now requires the v5 logo and rejects v4 references.
- The original ZIP was unbuilt. During integration, lint (zero warnings), TypeScript, generated SEO assets, production build and processing checks passed using the existing installed dependencies. A fresh `npm ci`, real-device camera and visual interaction checks remain for the deployment environment.

### Scan to PDF, guides hub, comparisons and Buddy states (October 4, 2026)

- **Scan to PDF** (57th tool): a Take a photo button can open the camera on supported phones and tablets; other browsers show a file picker (`capture="environment"`), each photo becomes a page, and "Take another photo" adds more. The same camera button appears on Images to PDF. No auto-crop or OCR; the page says so.
- **New search pages:** `/tools/edit-cv-pdf` (Edit existing text) and `/tools/compress-pdf-to-100kb` (Compress PDF), with their own steps and FAQs and no promised exact size.
- **Guides hub** at `/guides`: popular tasks, every tool guide by category, export guides and comparisons. "Guides" is in the header.
- **Comparison pages** at `/compare/ilovepdf-alternative`, `/compare/smallpdf-alternative`, `/compare/sejda-alternative`, `/compare/adobe-acrobat-alternative`. Dated (checked 4 October 2026), sourced, and each says when the other product is the better choice. Data: `lib/comparisons.ts`; re-check the sources before changing the date.
- **Homepage title:** "PDF Studio: Free PDF Editor & Tools, No Watermark, No Upload".
- **Buddy expressions:** sleepy on the empty My files screen, cheering on "Your file is ready", worried on errors.
- Sitemap generation includes `/guides` and `/compare/*`. Checks updated for 61 tools and 71 tool/guide routes.

Integration verification: the uploaded package was reviewed against the current main branch. Corrected upfront caps and batch claims in comparisons, clarified Adobe India terms and scanned-CV editing limitations, added a pause control for ongoing Buddy motion, hardened theme-transition error handling, and corrected stale test counts. Previous upload-recovery, privacy and navigation fixes are preserved. Real-phone camera behavior and live deployment remain unverified.

Validation: 49 fixture-based processing workflows and 33 additional correctness/boundary/history checks passed, including Scan to PDF export. Native-text edit/save/reopen and signature embedding passed, as did rejection recovery, browser-link policies, analytics and owner access tests. Server-rendered SEO tests cover 71 tool/guide routes; the new guides/comparison check verifies all four comparisons and their internal destinations. These are local automated checks, not live click, OCR or real-device results.

### Refreshed design and sliding hover highlight (October 4, 2026)

- **New look:** calm, minimal, one violet accent with four quiet category hues. Tokens and components are in `app/studio-refresh.css` (loaded last); change colours, motion speed and spacing there. Headings use a 16 KB self-hosted subset of Outfit Bold.
- **Home:** the search box is the hero action, six one-tap tasks sit under it (Edit text, Merge, Compress, Sign, Scan, Split), tool cards are compact rows, and the category filter is one segmented control whose pill slides to the chosen tab.
- **Sliding hover highlight:** `components/spotlight.tsx` moves one soft highlight between items on the tool grid, quick tasks, header Tools menu, related tools and guide cards. It follows mouse and keyboard focus, is skipped on touch, jumps instead of gliding with reduced motion, and is replaced by real outlines in Windows contrast themes.
- **Accessibility:** measured contrast (text 6.2:1 or better on both themes, controls 4:1 or better), 3 px focus outline with offset, `scroll-padding-top` so a sticky header never covers focused items, 44 px targets for chips and header controls, no headings inside buttons.
- Playbook with research, step-by-step testing plan and a ranked idea backlog: [docs/REFRESH-2026-10.md](docs/REFRESH-2026-10.md). Previews: `docs/refresh-preview-light.png`, `docs/refresh-preview-dark.png`.
- Not verified here: `npm ci`, lint, TypeScript, `checks/` scripts and the production build (dependencies could not be installed in the packaging environment). Pages were rendered and tested in Chrome through a stand-in build.

### Smarter search, recently used, file facts, menu overlay and contact (October 4, 2026)

- **Better tool search** (`lib/tool-search.ts`): every tool has keyword phrases people really type ("reduce size", "shrink", "under 100kb", "resume", "unlock", "dark mode", "checksum"). Direction matters ("jpg to pdf" finds Images to PDF, "pdf to jpg" finds PDF to JPG), one-letter typos work ("compres", "mrege"), results are ranked, and if no tool matches every word the closest matches are shown with a note. Enter opens the best match; a live status line announces the result count. The header Tools menu uses the same engine. Test: `node checks/verify-search.mjs` (48 queries).
- **Recently used** (`lib/recent-tools.ts`, `components/recent-tools.tsx`): the last six tools you opened appear above the tool list on the home page, with "Clear list". Stored only in this browser's local storage; described in the privacy policy.
- **File facts** (`components/file-facts.tsx`): after choosing a file you see its name, page count and size (or the file count, total pages and size for several files), a warning above 100 MB, and a screen-reader announcement.
- **Tools menu is a real overlay:** on phones the header used to be non-sticky and static, so page cards painted over the open menu. The header now stays in the stacking order above the page, the panel fits the screen height and scrolls inside itself, and a dimmed backdrop (screens up to 900 px) closes the menu when tapped.
- **Contact:** `pdf.studio.in@gmail.com` (change it in `lib/contact.ts`). New `/contact` page with question, problem and suggestion buttons that open a draft in the visitor's own mail app; "Email report" in the problem-report dialog; "Email us about this" on error messages; Contact link in both footers; mentioned in the privacy policy and About page; added to the sitemap.

### Calm Buddy, theme reactions and a quiet welcome (October 4, 2026)

- **Buddy is calmer** (`components/buddy-hero.tsx`, `app/studio-buddy.css`). Idle: an occasional blink (about every 6 and 10 seconds, from two uneven slow cycles) and a tiny smile; no floating, no bouncing, no eye-following. A tap, or a file dropped on the page, gives a quick happy reaction.
- **Theme reactions.** To dark: Buddy closes its eyes briefly, then opens them as a soft moonlit glow arrives. To light: Buddy wakes, smiles and does one small bounce while a warm glow comes up. The purple logo never changes; only the light on it and its expression do. Reduced motion: the lighting still changes, nothing moves.
- **Time-aware lighting (light theme only):** morning (05:00-10:59) warm glow, daytime (11:00-16:59) cheerful wider smile, evening and night (17:00-04:59) softer rosy light and a gentler smile. The chosen theme always wins: dark is always moonlight.
- **Crossfade 400-500 ms:** `--theme-fade` is 450 ms. Buddy and the theme button have their own view-transition names and are drawn live, so they do not ghost; the fallback (browsers without View Transitions) skips pictures of the document.
- **Welcome around Buddy** (`components/welcome.tsx`, `lib/time-of-day.ts`): "Good morning / afternoon / evening. Let's make something easier." from the device time; a small clock line (for example "7:38 PM · Sunday, October 4", device locale) that updates on the minute and never ticks seconds; one short daily line chosen by the local date (12 lines, stable for the whole visit).
- **Ready to continue?** `components/welcome.tsx` offers "Resume your document" only when `recoverableDraft()` (`lib/resume.ts`) finds a saved draft with at least one file and one page. The plain "saved draft" banner is hidden on the home page while this is shown, and still appears for drafts that cannot be resumed so they can be deleted.
- **Export celebration** (`components/ready-note.tsx`): "Nicely done. Your PDF is ready." (or ZIP file, Word document and so on) with a smiling Buddy and a one-time pop. Download is the primary action; the others are quiet outlines.
- Tests: `node checks/verify-welcome.mjs` (parts of the day, greeting, theme-over-time, minute clock, daily line, resume rules, no ticking timers, Download stays primary).

### Visible theme switch, rolling clock, paste-to-open, before/after results and a "Prove it" page (October 4, 2026)

- **Theme switch you can see.** The new theme now grows out of the theme button as a circle (600 ms, View Transitions + clip-path; `components/theme-toggle.tsx`). Layout never changes, only colours. Browsers without View Transitions get a 450 ms colour fade; reduced motion switches instantly. Buddy reacts more clearly too: going dark, his eyes close, twinkling stars appear and the moonlight rises as he opens them; going light, he wakes, smiles, bounces once (a little higher than before) and sun rays fade out around him. The sun/moon icon spins in.
- **Clock pill with rolling digits** (`components/rolling-clock.tsx`): a small pill with a live dot, the time and the date (for example "7:38 PM · Sunday, October 4"). Only the digits that change roll, once a minute. `SHOW_SECONDS` in `lib/time-of-day.ts` turns on a ticking seconds digit (off by default). Uses a compact clock presentation.
- **Paste-to-open** (`lib/paste.ts`, `components/paste-hint.tsx`): on a tool page, copy a file (or a screenshot) and press Ctrl+V / Cmd+V. It opens exactly like a drop. Text fields keep their normal paste; on the home page it only explains (the home page takes no uploads); a hint line under the drop zone is hidden on touch screens.
- **Before / after result screen** (`components/result-summary.tsx`, `lib/result-summary.ts`): size before and after with proportional bars, file and page counts (page count of the result is read in the browser), and for Compress "62% smaller", "About the same size", or "5% larger than the original. Try a stronger setting, or keep the original file." Sizes use decimal units (1 MB = 1,000,000 bytes) everywhere, matching the 157.3 MB limit.
- **Prove it page** (`/prove-it`): four checks anyone can run (Network tab, search for a secret word, offline test, inspect optional usage requests), a plain table of what may leave the device, honest limits, and FAQ + HowTo structured data. Linked from both footers, the hero ("Check it yourself"), the home FAQ, the privacy policy, the guides hub and the sitemap.
- Tests: `node checks/verify-paste-result.mjs` (paste, before/after maths, wiring, Prove it content) and the updated `node checks/verify-welcome.mjs`.

Refresh integration: corrected clock render errors, timer cleanup, interrupted/rapid theme switching, stale result page counts and privacy verification claims. Retained the previously reviewed comparison and CV guidance, rejection-only caps, accessible logo names and supported camera formats. Local checks and their remaining limitations are recorded after verification.

Refresh validation (4 October 2026): lint, TypeScript, search/welcome/paste/result checks, SEO routes and public-page links, upload rejection/recovery checks, and 49 fixture-based processing workflows plus 33 additional correctness checks passed. Production build passed with existing bundler warnings. No fresh package installation, real-phone camera test or rendered visual interaction test was performed for this integration. Cloudflare deployment is not verified.

The local clock and daily encouraging line appear at the bottom of the homepage, after the guides and above the footer. Greeting and saved-document recovery remain near the top.

### Canonical domain and simplified homepage (4 October 2026)

The greeting, local clock and daily line appear above the homepage footer. Saved-document recovery remains available. All `*.workers.dev` requests that reach this app now redirect to `https://pdf-studio.in`, preserving the path and query with HTTP 308, including preview hosts and non-GET requests. This supersedes the earlier instructions to keep Workers URLs accessible. The repository robots.txt contains no Claude-User-specific allow block. Cloudflare-managed robots additions are separate from this source file. Live rollout remains unverified.

Asset incident correction (4 October 2026): reverted the all-assets Worker-first setting after production CSS/JS 404 reports. Cloudflare again serves matching static assets directly; Worker-served pages retain canonical Workers redirects. A clean production build is required. This supersedes the earlier all-request redirect description.

### Owner sign-in screen (4 October 2026)

`/analytics` now shows a responsive Page Buddy login card with device light/dark styling, a password visibility button, loading state and useful error messages. The browser Basic-auth prompt is replaced by same-origin `POST /api/owner/login`; passwords are not passed to the application or analytics. Secure HttpOnly SameSite cookies expire after eight hours. The dashboard includes Sign out (`POST /api/owner/logout`). Missing runtime secrets show a clear configuration message; the new UI does not bypass this requirement. No accounts are needed for public tools. Login requests enforce HTTPS, same-origin checks, a 2 KB streamed body limit and a best-effort eight-attempts-per-minute per-isolate throttle. Use Cloudflare protection for stronger distributed enforcement. Authentication tests, lint, TypeScript and a production build pass locally; rendered browser/mobile and live deployment remain unverified.

### Recovery and review fixes applied on top of your latest code (October 4, 2026)

- **Startup safety net** (`lib/startup-guard.ts`, `components/startup-ready.tsx`, `app/layout.tsx`): if the app's JavaScript has not started after 7 seconds, a plain "This page did not finish loading" message with a Refresh button appears; a `<noscript>` notice covers disabled JavaScript. Package-author testing claims (not independently verified): Chrome: hidden when the app starts, shown when the script is blocked (desktop and phone).
- **Theme button:** your `desired`-ref version could leave the saved choice and the visible theme disagreeing after fast clicks (saved light, showing dark). Replaced with `lib/theme-switch.ts` (always flips the last theme asked for). Automated tests cover rapid bursts and callbacks finishing in different orders. `node checks/verify-theme-switch.mjs`.
- **Comparisons** rewritten as "what each publishes": no numeric limits, no superiority wording, per-row source numbers, dated, "we have not tested". Adobe row still mentions India so your existing check passes. `node checks/verify-claims.mjs`.
- **"Prove it" renamed "Check it yourself"** (`/check-it-yourself`, hedged wording, phone options, OCR host disclosure); `/prove-it` redirects (301); your `verify-guides-comparisons.mjs` and `verify-paste-result.mjs` updated.
- **Page-specific Open Graph tags** (`lib/page-meta.ts`) on guides, contact, about, privacy and the check page.
- **Home guide directory** shows each keyword page's own description (no repeats).
- **Home title/description** no longer say "No Upload" (now "No Watermark, No Sign-up"; the description says files are designed to be processed on your device).
- `docs/TODO-NOW.md`: the checklist.

Integration note: the ZIP supplies recovery, theme, comparison and metadata changes. Its matching patch additionally describes mobile/PWA/OCR work not shipped in the ZIP; that work has not been applied or verified here. Package-author browser claims are not our own verification results. The owner login, direct static asset delivery, and bottom-of-page greeting/clock/quote are preserved.

## Owner audience and Cloudflare reports
The owner dashboard includes colorful country, device, OS and browser breakdowns for the last hour or 24 hours. Filters apply to the audience explorer, not the existing global activity counters. Context is collected only through the existing opted-in activity endpoint. Country is coarse; user-agent categories are estimates. No IP, raw user agent, filenames, passwords or document contents are stored. Context expires after 48 hours; old activity has no retroactive breakdown. The analytics_context table is initialized automatically in the existing DB binding.

Cloudflare HTTP traffic is a separate server-side report: requests, transferred MB, visits and ranked country/device breakdowns for pdf-studio.in. It is not identical to app-user counts and may be sampled. It does not include all Cloudflare products, security datasets or Core Web Vitals. No configured API connection means an explicit connection notice, never invented numbers.

Setup: create a read-only Cloudflare Analytics API token following https://developers.cloudflare.com/analytics/graphql-api/getting-started/authentication/api-token-auth/ (the current guide uses Account → Account Analytics → Read). Limit it to the account and zone needed for pdf-studio.in. Add runtime secret CLOUDFLARE_ANALYTICS_TOKEN and runtime variable CLOUDFLARE_ZONE_ID to the deployed Worker. Redeploy. Never put the token in NEXT_PUBLIC variables, GitHub source, or browser code. Existing OWNER_PASSWORD, ANALYTICS_OWNER_EMAIL and DB binding remain required. Reports are owner-only, no-store, refreshed every minute, with bounded server-side caching and a 12-second API timeout.

Validation for this integration: ESLint and TypeScript, owner authentication, activity/tracker, rapid theme switching, startup warning, claims/redirects, comparison/guide rendering, and audience/Cloudflare fixture checks were run locally. Audience SQL was also executed against SQLite to check rolling-window and 48-hour cleanup behavior. Cloudflare API responses are mocked in tests; no live API token or Cloudflare deployment was available. Real-phone and rendered dashboard interaction checks remain unverified.

## Sign and Edit improvements (4 October 2026)
Sign: typed signatures have Classic, Simple and Typewriter styles with ink colours; drawing uses the selected ink. Image upload and a camera capture input are available. Browser/device camera behavior is not guaranteed. Signatures may be explicitly saved in this browser’s IndexedDB and reused or deleted; they are never uploaded. Storage is capped at five images with a readable error after an attempted save exceeds capacity. Anyone using the same browser profile can reuse saved images.

Name, initials and today’s date add editable text boxes. Six date formats and S/I/N/D/T shortcuts are provided; shortcuts do not intercept typing in inputs. Check the local date and replace it if needed. Signed output can be reopened in Password protection; password protection is not an uneditable lock and is not certificate signing.

Edit: lines, arrows, whiteout, a freehand drawing pad and duplicate-element action join existing text/image/highlight/shape/link controls. Freehand marks are PNG overlays that can be placed and resized. Numeric position fields and keyboard movement remain available. Whiteout only covers content; underlying text remains extractable. Redact is the removal workflow.

Added text supports Unicode Noto Sans or standard Helvetica, Times and Courier; standard-font variants have bold and italic, all support underline, strikethrough and left/center/right alignment. Noto bold/italic are disabled because those font files are not provided. Unsupported characters in a standard font cause an actionable export error. These formatting controls apply to added text; the actual existing-text editor is preserved. No paragraph reflow or automatic scan-text replacement has been introduced.

Validation: lint and TypeScript pass, and 49 processing fixtures plus 39 correctness checks pass, including drawing exports at four rotations and styled-text export/reopen. Signature tests cover styles, colours, image validation and PDF embedding. Rendered drawing output was inspected. Full browser/mobile interaction, signature-storage behavior on real browsers and camera capture remain unverified.

## Revised editor review and PageSpeed fixes
The second supplied text-editor ZIP performs real text replacement but failed a rotated-text-object export test: 45° text became horizontal. It has not replaced the current editor. See `docs/EDITOR_PAGESPEED_REVIEW.md` for evidence and required matrix/font validation.

The public owner-access capability check returns 200 with a boolean, avoiding an expected 403 error on every anonymous homepage visit. Private reports remain protected; session cookies are verified and forged identity headers ignored. Filter labels/counts now use opaque, contrasting theme colours, and both footers use the existing small SVG brand mark instead of a full-size PNG. `node checks/verify-pagespeed-fixes.mjs` verifies source contrast and logo wiring; `npm run verify:public` covers anonymous, authenticated and forged access probes. Input limits still appear only following rejection. PageSpeed screenshots are prior lab results; a fresh live score has not been measured.

## Direct on-page text editing and unchanged exports
Click supported existing text and type directly on the PDF. Enter/Save text commits the real PDFium edit; Escape/Cancel abandons pending typing. The separate replacement textarea is removed. Pending text cannot be accidentally exported or lost through page/zoom/history changes. The actual PDF is rerendered after saving. Embedded-font glyph restrictions, single-line limits and no paragraph reflow remain; scans and nested text structures are not reconstructed.

An untouched single PDF exported through Organize, Edit, Sign or the existing-text editor retains its original bytes and size. Compression keeps the source when the requested preset would enlarge it, with real size feedback. Compact retains text/links; page-image presets can lose search, links and forms. Tests include byte equality, four compression presets and a noisy scanned-page fixture. See `docs/DIRECT_TEXT_AND_COMPRESSION.md` for competitor documentation, precise scope and verification limitations.

## Document-first editor and tools directory
Loaded tools use a slim filename/page-count/size bar. Edit text, Edit PDF and Sign share a mode bar; native edits and pending typing are validated and committed before switching. On phones, selecting text opens a bottom editing sheet, auto-zooms and uses the visual viewport to account for the keyboard. These device interactions still need real-phone verification.

Export opens a full-screen result with Download first, focus management, optional actual-output inspection and no toast over the controls. Signature creation uses Type/Draw/Upload/Camera tabs; tap to place, or use the page-centre alternative, then resize/move with existing handles and keyboard/numeric controls. Shared light/dark variables now cover dropdowns, signature cards and error banners; measured text/error/success contrast exceeds 4.5:1.

`/tools` is a searchable categorized directory with 57 real tool links and individual icons. Home tool cards are real links too. Metadata and sitemap include the directory. Run `node checks/verify-document-first.mjs`; details and unverified browser/device checks are in `docs/DOCUMENT_FIRST_WORKSPACE.md`. Upload placement, rejection-only limits, account-free access, byte-identical untouched exports and existing text-engine limitations are preserved.


Download dialog fix: exported results use a dedicated full-screen dialog layout with zero viewport offsets and no centered-dialog translations. Download remains the first focused action. `node checks/verify-download-layout.mjs` verifies the layout contract and preserves normal dialog centering. Lint, TypeScript and the production build passed; live browser positioning after Cloudflare deployment remains unverified.


October 5 update: 61 catalogue tools (including inspection and reader utilities, not 61 PDF editing engines). Homepage keyboard search shortcut remains available without a visible badge. Privacy proof opens on hover, focus or tap. Merge export requires at least two input files. Result buttons have bounded height; limits remain visible only after rejected validation. Source comparison: docs/IHATEPDF_REVIEW.md.

Public catalogue copy uses “60+ tools” on the homepage, search prompt, menu and directory. Exact counts remain in internal checks and filtered search results. Stirling-PDF source review and prioritized ideas: docs/STIRLING_REVIEW.md.

### Homepage discoverability and revalidation

`public/llms.txt` links to actual guides, tools and privacy resources. The shared JSON-LD identifies PDF Studio and its existing public contact address. Homepage instructions use an ordered list; closed tool menus and guide directories render their contents when opened. Document/image file inputs have accessible labels, and `#shelf` has a permanent target.

Anonymous homepage HTML uses an ETag with private revalidation; owner/API no-store protections remain in place. This does not add document caching. Audit coverage and unresolved external/legal items are recorded in `docs/GEO_FIXES_2026-10-05.md`. No GEO score or live pass is claimed.

### Upload compatibility and optional support
Camera JPG/PNG/WebP files with MIME metadata can be opened even when their filename has no image extension. A browser image decoder fallback handles bitmap decoder failures; unsupported HEIC is not advertised as supported. Asynchronous opening has a timeout with a recovery error and keeps existing workspace data. This cannot interrupt a synchronous parser blocking the main thread. Device-level camera/EXIF behavior still requires real mobile validation.

Optional Buy Me a Coffee links appear in shared headers and successful-export results. Downloads remain free and primary; no donation scripts are embedded.

File opening displays a local CSS document animation, with a static reduced-motion alternative. It indicates actual pending validation, without estimated percentages or external animation requests.


Signature controls stay in normal document flow rather than a fixed overlay. The existing nine style cards and ink controls live inside the signature popup; changing name, style or ink regenerates the typed signature and discards stale asynchronous previews. Drawing, upload and camera creation remain available.

## Research refresh implementation — 5 October 2026

- Optional Buy Me a Coffee appears at the bottom of export results, after all download/edit/save/report actions.
- Form-safe assembly keeps a full single PDF's field structure. Page-copy operations reject fillable documents unless an explicit supported flattening path is chosen; Merge offers that choice. Originals are not mutated. Flattened appearance pixels still require visual verification.
- PDF Reader (`/tools/pdf-reader`) shares the workspace: single-page canvas, fit width/zoom/view rotation, page navigation, document-wide extracted-text search, supported outlines, selectable extracted text, reading focus and optional local reading position with a forget action. Unchanged downloads retain original bytes. Pinch controls and encrypted-file prompting are implemented but still need physical-device UI checks. Untagged extracted text can have incorrect reading order. No universal accessibility/offline guarantee.
- Scan offers reviewed manual edge cropping and straightening, with workspace undo. No automatic perspective detection or deskew claim. Camera decoding still needs physical Android/iOS checks.
- Split by chapters uses supported top-level local bookmark destinations, exports ZIP files and refuses editable forms. Nested destinations do not define chapters. Output boundaries require inspection.
- Find possible blank pages reports low-resolution visual candidates and retains every page. Small/faint content can be missed; users must inspect before removing pages.
- OCR exposes English, French, German, Spanish, Italian and Portuguese models loaded on demand. Non-encodable characters are reported rather than silently discarded; visible scans remain. Model quality and multilingual corpus results have not been benchmarked. Indian script shaping/searchable embedding is not implemented.
- Buddy has restrained floating and pointer-local eye tracking, suspends motion when hidden/offscreen and stays static with reduced motion. Homepage dragging never suggests acceptance.
- Validation: lint/TypeScript, existing 18 engine checks, camera/input-budget checks and `checks/verify-refresh-core.mjs`. Real devices, new reader/scan screenshots, chapter rendering and OCR model benchmarks remain unverified.

The research brief also proposes larger engine, server and template projects. These are not implemented merely by adding this documentation; see `docs/RESEARCH_IMPLEMENTATION_STATUS.md` for remaining acceptance gates.

Compression also offers supported RGB JPEG resource optimization: recompresses unmasked JPEG streams at reduced quality while retaining PDF text and form structure. Other codecs, masks/custom decode images and very large images are skipped. The final file must be smaller or source bytes are returned. This is lossy image optimization, not lossless compression.

PDF workflows offer explicit merge→compact, rotate 90°→compact and clear-standard-metadata→compact sequences. Cancellation is checked between engine stages; only the final result is returned and source workspace is retained. Metadata clearing is not sanitization.

| Tool | Implementation and limits |
| --- | --- |
| PDF Reader | Single-page reading, extracted-text search/selection, outlines, view-only rotation and local position opt-in. Encrypted-file password prompt retains original encrypted bytes. |
| Split by chapters | Supported top-level local bookmark destinations; ZIP export; editable forms require prior flattening. |
| Find possible blank pages | Review-only low-resolution candidate report. Faint/small content may be missed. Never deletes pages automatically. |
| PDF workflows | Three explicit browser sequences with source preservation and stage cancellation. Ordered custom workflows support merge, rotation, reversal, metadata clearing and compacting. |

Reader follow-up: PDF Reader supports selection directly on rendered text and safe external links plus supported internal page links. Scans still require OCR for text selection. Reader canvases are capped at four million pixels to limit memory use, so very large pages can lose zoom sharpness. Continuous/spread reading and encrypted-file prompting are not yet included.

## Remaining-research follow-up

- Reader: continuous mode renders near-visible pages and releases offscreen canvases; two-page mode falls back to one page on narrow screens. Fit page, fit width, on-page selection/links, optional local reading bookmarks and delete actions are available. Source PDFs may have poor text order or missing accessibility tags. Page thumbnails, pinch controls and direct encrypted prompting are included; device checks remain pending.
- Existing-text editing: unavailable embedded-font characters are reported while typing and Save is disabled for them. Native rewrite, overflow rollback and Enter/Escape behavior remain. Paragraph reflow, nested-object edits and Indian-script shaping remain unsupported.
- Scan: manual four-corner projective correction, bilinear sampling, explicit preview/apply, cancellation and workspace undo. Large correction images are downsampled for memory safety; automatic detection is not implemented. Physical camera tests remain pending.
- Workflows: choose presets or reorder a custom sequence of merge, rotate 90°, reverse pages, clear metadata and compact without rasterizing. Unsupported and oversized sequences are rejected at processing. Sources are retained.
- Create PDF: optional authored A4 positioned-text templates using the existing local Noto Sans font. Configure page, position, width, height and font size; field overflow and unavailable glyphs are rejected. No imported backgrounds, image/table schemas or cross-page paragraph reflow.
- Form safety: flattening removes real widget references from page annotations, rejects unattached widgets and retains non-widget annotations. Poppler appearance checks cover filled text, checkbox and dropdown fields on two merged pages, with no syntax warnings. Signature widgets and unusual appearances remain unverified.

Checks: `verify-scan-perspective.mjs`, `verify-template.mjs`, `verify-form-appearance.mjs` (requires Poppler), `verify-online-text.mjs`, and `verify-refresh-core.mjs`. These supplement browser/mobile testing; they do not establish production deployment.

Protected Reader files: enter a password for local viewing; missing/wrong passwords are rejected and failed loading tasks are destroyed. The encrypted source is retained for download. Use Remove password explicitly before editing. Page thumbnails and two-finger reader zoom are included; pinch/keyboard/camera behavior still requires real-device checks. Passwords are cleared after submission and never saved to reading-position storage.

### Text to PDF

Open `/tools/text-to-pdf` or `/tools/txt-to-pdf`. Type/paste text or open a `.txt` file, choose A4/US Letter and a font size, then create, inspect and download. Existing `/tools/create-pdf` links still work. Processing stays in the browser; Noto Sans is loaded from this site. UTF-8 and BOM-marked UTF-16 are supported; invalid encodings and unavailable font characters are rejected. Long text wraps across pages. Original formatting is not reconstructed; full Indian-script font coverage/shaping remains unsupported. Authored templates remain available in the same tool.

Validation: `checks/verify-text-document.mjs` checks Unicode decoding, encoding rejection, page dimensions, multi-page output and rejected empty/missing-glyph input. Device/UI review remains separate.
