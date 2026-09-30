# OpenPDF: research, audit and implementation review

Research date: **30 September 2026 (India)**. Project audited: the existing OpenPDF source, baseline commit `6b0fc300e15f2780ff2b6610adc44c55c77f8f29`. This is broad coverage of eight relevant products, not every PDF service.

## Method and confidence

Official product, editor, pricing and privacy pages were retrieved on the research date. These establish what the sites publish and which controls/instructions their public pages expose. They do **not** establish successful processing, mobile ergonomics, accessibility conformance, paid-account behavior or server deletion. No competitor document was uploaded and no purchase was made. Distinguish published product claims from a tested workflow. Public reviews are self-reports, not independently reproduced defects. No review prevalence or satisfaction statistic is inferred. Search results that looked like affiliate material or competitor promotion were not treated as independent complaints.

The source audit examined every catalogue entry against its processing branch and important navigation, loading, editing, export, shelf, privacy and analytics paths. Engine fixtures and rendered PDF checks provide stronger evidence for individual functions than the source audit. Live browser/UI, phone/tablet and assistive-technology testing were unavailable: the required managed-preview browser skill was not provided. There is no claim of full end-to-end or WCAG certification.

## Competitor comparison

All prices are page snapshots, may depend on region and billing term, and are not a purchasing recommendation.

| Product | Published capabilities and workflow | Free limits / paid separation | File handling / privacy claims | Mobile and download observations |
|---|---|---|---|---|
| iLovePDF | Task catalogue; editor describes adding text, shapes, comments, images and highlights. Page exposes file-picker/drop and upload/processing states. Premium lists reusable workflows. | Basic: limited processing; published free examples are merge 25 files/100 MB and Word-to-PDF 15 MB. Premium observed ₹283/month billed ₹3,400 annually. | Security page says ordinary processed files deleted within two hours, manual delete from results; signed documents can be retained up to five years. | Web/mobile/desktop offerings are listed; actual touch use untested. Results/deletion described on security page. [I1–I3] |
| Smallpdf | Editor instructions: upload, annotate/organize, export, download; result pages can send files to another tool. Existing-text editing differs from overlays. | Free pricing page specifies limited downloads; Pro adds existing-text editing, stronger compression, OCR and batch access. Exact daily numeric limit and price did not render reliably; not guessed. | Privacy notice distinguishes accounts/storage: account files generally deleted within an hour unless saved; deletion of saved files generally within 14 days; guest retention wording is less specific. | Public pages promote mobile apps. Cross-tool continuation is documented, not hands-on verified. [S1–S5] |
| Adobe Acrobat Online | Broad conversion, organize, fill/sign, OCR and AI catalogue. Main online page emphasizes sign-in. | Pro snapshot US$19.99/month for an annual commitment billed monthly. Advanced comparison/redaction features are in paid plans. Exact anonymous free quotas were not established from retrieved pages. | Cloud/sign-in workflows advertised; a precise ordinary-upload retention time was not established here. Do not substitute competitors' retention times. | Online tools and device workflows advertised; no mobile runtime or download-gate test. [A1–A2] |
| PDF24 | Editor page exposes choose/drop, text/image/shapes/freehand controls and save-then-download instructions. Recommends conversion for existing-text changes. | Publishes no artificial usage/time restrictions, no registration and ad-funded operation. These are provider statements, not stress-tested guarantees. | Published cloud processing, servers in Germany and automatic deletion after one hour. Offline desktop alternative also exists. | Claims broad OS/browser support; touch targets and keyboard controls untested. [P1–P2] |
| Sejda | Editor describes existing-text editing, links, images, shapes, fill/sign. Picker/drop plus cloud sources; explicit upload retry/session-expiry states. | Editor visibly states 200 pages or 50 MB and three tasks/hour. Other tools differ. Web week pass $5 once, monthly $7.50, annual desktop+web $63. | Editor says automatic deletion after two hours. Web uploads/server processing; desktop runs locally. | Published editor has extensive controls; no phone interaction test. Apply/download workflow described. [J1–J3] |
| PDF Candy | Large catalogue; editor instructions cover page navigation, undo/redo, typed/drawn/uploaded signatures, export and download. | Pricing specifies page/hour restrictions, limited size and no batch for free, without a numeric hourly quota. Editor states 50 MB free. Monthly web $6; annual desktop+web shown $4/month; lifetime $99. | Pricing claims uploads/results kept no longer than two hours. | Finger signatures are documented; actual mobile execution untested. Editor explicitly says no watermark. [C1–C3] |
| ihatepdf.cv | Broad browser PDF studio with organizer, editor, OCR, conversions and privacy tools. | Advertises free/no watermark/no upload. Capability/fidelity claims were not validated by processing documents. | Advertises local processing. No blanket audit of its network behavior or all its tools was conducted. | Public catalogue and technical guide available; phone and export behavior not tested this session. [H1–H2] |
| Stirling PDF | Expanded research to a source-available self-hosting platform with editing, signing, redaction, conversion and automation. | Public repository and self-hosting; deployment costs still exist. Inspect current license and enterprise distinctions before reuse. | Self-hosted processing lets the operator control documents; it is not proof that every installation is private. | Useful issue evidence on rotated-page placement; not a hands-on product comparison. [T1–T2] |

Useful patterns to adopt: clear picker/drop alternatives, preview before export, typed/upload signatures, undo/redo, visible tool limits, and continuing with an output. OpenPDF uses its own navy navigation, cobalt task accents, typography, spacing and document workspace. No competitor assets, copy or branding were copied.

## Evidence-backed pain points and priorities

P0 = safety/correctness/work loss; P1 = frequent task success; P2 = advanced capability or further validation. Repeated means multiple independent examples in this small research set, not a measured population rate.

| Problem | Evidence and confidence | Affected workflow | Solution / final state | Priority |
|---|---|---|---|---|
| A free-looking experience can block export | Trustpilot review dated 28 Sep 2026 reports an unexpected download wait; separate Reddit discussion dated 22 May 2026 describes surprise save/export paywalls. Repeated theme; neither reproduced. Current Smallpdf pricing confirms limited downloads, not the exact reported wait. [R1–R2, S1] | Edit → export → download | No paid gate/watermark in core code; capacity limits before picking files. Hosted audience remains private. | P1 |
| Fonts, tables and layout break in conversion | Smallpdf support says absent server fonts can change output. Adobe community 2021 conversion report and a recent Reddit table-layout question give separate examples. Repeated fidelity concern, not a comparison ranking. [S3, R3–R4] | Office ↔ PDF | Up-front reflow/text-only notices, actual result preview. High-fidelity engine integration deferred. | P1 |
| Images/signatures land incorrectly on rotated pages | Stirling GitHub #7796 (Sep 2026) reports rotated-page image scaling; #6784 separately describes rotation coordinate changes. Two specific issue reports, not proof every version is affected. Our own source also used raw unrotated page dimensions. [R5–R6] | Edit/sign → export | CropBox-aware display-to-PDF transformation; pixel-position fixtures at 0/90/180/270 degrees and two scales. | P0 |
| Users distrust server uploads of sensitive documents | A Dec 2025 privacy discussion specifically asks about Smallpdf. Local-processing project authors also report concern, but their commercial/self-promotional interest weakens independent evidence. [R7] | Upload contracts/IDs | Documents stay in browser; analytics strict allowlist excludes file bytes/names/passwords. Explicit device-only draft save. | P0 |
| Work can disappear between steps | Sejda editor publishes expired-session/re-upload states; this is an observed page state, not frequency evidence. OpenPDF baseline `navigate()` cleared files/pages/marks on tool changes. [J2 + source audit] | Switch tool / refresh / continue | Shared workspace, 20-step document history, explicit draft save/restore/delete, unload warning, output continuation. | P0 |
| Failed uploads/processing lack recovery | Sejda publishes retry upload states; Smallpdf support advises retrying after processing/browser failures. Neither establishes crash prevalence. [J2, S3] | Choose/drop → process | Atomic ingestion, originals retained on errors, actionable invalid/encrypted input errors, cooperative stop. | P1 |
| Compression isn't guaranteed to meet a target | No strong independent comparative quality evidence established in this research. Both compact resaving and raster compression can grow already optimized PDFs. | Compress → submit/download | Quality/DPI notices, input/output size comparison, explicit no-reduction message and original download. No fabricated size estimate or guaranteed percentage. | P1 |
| Tiny controls or drag-only interaction | Primarily our source audit: some page actions were about 25–30 px; element movement required pointer gestures. No external prevalence claim. | Reorder / edit on touch or keyboard | Larger controls, keyboard sorting and arrows, element keyboard movement/resize, numeric position fields, type/upload signatures, skip link and focus styles. Device/AT validation pending. | P1 |
| Too many tools obscure the useful task | Our 50-link sidebar created a long navigation surface. Public catalogues demonstrate broad tools, not user frustration by themselves. | Find tool | Curated sidebar + nine common tasks + searchable full catalogue. | P1 |
| Limits, accounts and subscriptions vary | Current official pricing pages confirm free caps and premium distinctions. This does not prove all sites hide limits or add watermarks. | Choose tool → upload | Technical limits published before selection; no time quotas. Existing private hosting gate explicitly disclosed. | P1 |

## Audit of the actual project

Baseline uses React 19, Vinext/Vite and Cloudflare-compatible hosting, pdf-lib/PDF.js, @libpdf/core, browser conversions, IndexedDB and first-party analytics. Existing architecture retained. The two compressed source files were formatted for maintainability; focused workspace/history, geometry and validation modules were added. No new application dependency was needed.

| Finding | Baseline evidence / impact | Resolution or limit |
|---|---|---|
| Navigation erased loaded work | `navigate()` reset files, pages, marks and field state | Retains document, page order and overlays. Incompatible formats produce a visible prompt instead of silent processing. |
| “Undo” only removed the last overlay | UI used `marks.slice(0,-1)` | Bounded immutable document history; undo/redo for loads, page operations, annotations and continuation. Tool option changes and text-document creation are not included. |
| Annotation preview/export used different geometry | Export calculated positions from MediaBox width/height; rotation and cropped origins ignored | Unified CropBox/rotation mapping; PDF.js thumbnails use actual extra rotation. |
| No actual-output preview or chaining | Download/shelf actions only | Inspect exported PDF; Continue editing loads its actual bytes. Password-protected output opens in a reader/unlock tool. |
| Draft recovery missing | Only finished files could be explicitly saved | Explicit saved draft with files/pages/marks, restore/delete. Passwords/form values/tool options are not persisted. No automatic save promise. |
| Small regular text and pointer controls | Sidebar/footer/source metadata and page buttons | Larger regular text, contrast tokens, touch controls, focus/skip, keyboard alternatives. Some compact secondary metadata remains 12 px. |
| Form filling always flattened | Engine called `form.flatten()` unconditionally | Keeps supported fields editable; flatten is an explicit choice. Reordering source form pages first is refused rather than dropping field data. |
| Advanced conversions oversold in initial README | “50 working tools” didn't distinguish display-only compare or runtime constraints | Feature matrix below separates implemented scope, fixture validation and unverified/absent capabilities. |
| Poor errors around encrypted/malformed input | Raw parser errors | Actionable known-password unlock instructions and invalid/corrupt input messages. Workspace retained on failure. |
| Raster tools can remove accessibility | Compression/redaction/flatten/color tools discard original text/forms/links | Disclosed before use. OCR can add a text layer, but does not create a fully tagged accessible PDF. |
| 150 MiB/400 pages enforced late/not stated on dropzones | Engine/UI memory guards existed | Selection limits published, pure boundary checks; output page expansion also capped. |
| In-place text editing absent | Overlay drawing only | Explicitly remains absent. No white rectangle presented as text editing or redaction. |
| Signed/encrypted exports | Password and image signatures exist | Visual signing only; no certificate signer/validation. Known password required to decrypt. |

## Implementation order and final feature matrix

Implemented P0 correctness/shared history first, then P1 editing/recovery/output journey and responsive design. P2 work still requires additional engines, infrastructure or real-device testing. All existing catalogue tools remain reachable. A processing fixture establishes execution and basic output integrity, not complete UI or document fidelity. Status labels: **working** within the stated scope; **partial** has important capability limits; **constrained** depends on runtime/device or a fundamentally limited technique; **missing** not implemented.

| Tool / capability | Baseline | Final | Validation / exact scope |
|---|---|---|---|
| Merge | working | working | Source pages assembled; fixtures |
| Organize | partial | working | Drag/keyboard/button reorder, rotate/delete; history, select/bulk actions, duplicate selected |
| Split/extract | working | working | Ordered, validated page ranges |
| Split every page | working | working | ZIP of individual page PDFs |
| Compress | constrained | constrained | Compact mode keeps text/links; image presets lose them; savings vary |
| Rotate | working | working | Page rotations; thumbnails and export aligned |
| Reverse | working | working | Reversed output order |
| Duplicate all | working | working | Duplicate all pages; output cap 400 |
| Alternate/interleave | partial | working | Now respects currently retained page stacks |
| N-up | partial | working | 2/4 pages per sheet; handles visible rotations/crops |
| Crop | constrained | constrained | CropBox only; not permanent removal |
| Resize A4 | partial | working | Fits visible rotated/cropped pages |
| Mirror | partial | working | Normalizes visible rotation before horizontal mirror |
| Edit PDF | partial | partial | Overlays only; text/images/highlights plus rectangle/ellipse/link; rotation-correct export |
| Sign | partial | partial | Draw/type/upload visual image; preserves initial image aspect; no certificates |
| Redact | working technique, geometry risk | working | Raster output discards underlying objects; geometry matches rendered page |
| Watermark | working | working | Adds text, no platform watermark |
| Page numbers | working | working | Starting number supported |
| Bates numbers | working | working | Prefix and sequence |
| Headers/footers | partial | working | Separate header/footer text; placed in visible rotated page coordinates |
| Flatten | constrained | constrained | Full raster rebuild, unlike targeted annotation-only flatten |
| Fill forms | partial | working | Text/checkbox/dropdown; interactive or explicit flatten; other fields unsupported |
| Metadata edit | working | working | Standard title/author/subject |
| Images to PDF | working | working | JPG/PNG/WebP; 22 MP raster safety limit |
| PDF to JPG | working | working | Image ZIP with resolution choices |
| PDF to PNG | working | working | Image ZIP with resolution choices |
| Extract text | working | working | Selectable text; scans require OCR |
| PDF to Word | partial | partial | Text paragraphs; no original images/layout reconstruction |
| PDF to HTML | partial | partial | Escaped text webpage, not original layout |
| PDF to EPUB | partial | partial | Reflowed text book |
| PDF to PowerPoint | partial | partial | One raster page per slide; not editable original objects |
| PDF to XLSX | partial | partial | Heuristic text rows; review columns |
| PDF to CSV | partial | partial | Heuristic text rows; not reliable table recognition |
| Create PDF | working | working | Plain text creation with bundled font |
| Markdown to PDF | partial | partial | Basic headings/list text, no complex tables/images |
| DOCX to PDF | partial | partial | Raw text reflow, not Office fidelity; no legacy DOC |
| Spreadsheet to PDF | partial | partial | First sheet text; no charts/format preservation |
| EPUB to PDF | partial | partial | Spine text reflow; styling/images omitted |
| Grayscale | constrained | constrained | Raster conversion loses text layer |
| Invert colours | constrained | constrained | Raster conversion loses text layer |
| OCR/searchable PDF | constrained | constrained | English model downloaded; no recognition test this session; not PDF/UA tagging |
| Read aloud | constrained | constrained | Text extraction tested; actual device voices/playback unverified; no audio export |
| Compare | partial | partial | Two source PDFs side-by-side; no automatic visual/text differences |
| Password protection | working | working | AES-256 password; no signature or DRM guarantee |
| Authorized password removal | working | working | Valid credentials only; incorrect password rejected |
| Privacy scanner | partial | partial | Standard metadata and regex text patterns; incomplete findings |
| Remove metadata | partial | partial | Standard properties cleared/reset; not every hidden object sanitized |
| SHA-256 | working | working | Original input file fingerprint |
| Bundle PDF ZIP | working | working | Original inputs, not unexported edits |
| Resave/repair | constrained | constrained | Only PDFs the parser can read |
| Insert pages | partial | working | Add PDFs in organizer, reposition appended pages; no dedicated blank-page creator |
| Shared document workspace | missing | working | Compatible tool navigation retains sources/order/overlays; result continuation consolidates |
| Undo/redo | partial | working | Bounded 20-step document history; grouped fast gestures |
| Save/restore draft | missing | working, UI unverified | Explicit local IndexedDB file/page/annotation snapshot |
| Result inspection | missing | working, UI unverified | Preview from actual exported bytes, lazy pages |
| Batch | missing | working, UI unverified | Selected optimize/protect/image tools, at most 20 files, ZIP, per-file failures |
| Stop processing | missing | partial | Cooperative checkpoints and render cancellation; synchronous library calls may finish first |
| Existing-text editing | missing | missing | Requires a suitable content-stream editor and font handling |
| Cryptographic signatures | missing | missing | Certificate identity/trust/validation not implemented |
| High-fidelity Office engine | missing | missing | Optional self-hosted service plan below; not advertised as available |
| Automatic comparison | missing | missing | Current compare is manual view |
| Owner analytics | working | working | Server authorization and counts preserved; no documents collected |

## Sustainability, licensing and deployment

Browser processing avoids paying for document jobs; the host still pays for serving app assets and first-party analytics. There is no processing server or document-upload endpoint. A 150 MiB selection, 400-page output/workspace, 22 MP rendered page/image and 20-file batch are safety limits, not free-tier daily quotas. Passing those checks cannot guarantee a low-memory phone will succeed. Originals remain in memory; history shares references and is capped. Saved drafts/shelf are explicit browser storage and require explicit deletion or clearing browser data. Clearing the current workspace drops history references but does not delete separately saved copies or guarantee forensic memory erasure.

Installed component licenses checked from their actual package manifests on this date: pdf-lib/fontkit/@libpdf/core/jsPDF/docx/pptxgenjs MIT; PDF.js/SheetJS/Tesseract.js Apache-2.0; Mammoth BSD-2-Clause; JSZip dual MIT or GPL-3.0-or-later (use MIT). PDF.js worker/CMaps/fonts keep Apache notice; Noto Sans keeps SIL OFL. No new production component or license change. MIT covers our application, not competitor assets or third-party licenses. `THIRD_PARTY_NOTICES.md` has details. Public source download is a full project ZIP; a public GitHub repository has not been created.

### Run and deploy current code

Requires Node >=22.13 and HTTPS for reliable crypto/browser behavior:

```sh
npm ci
npm run dev
npx tsc --noEmit
npm run verify
npm run verify:analytics
npm run verify:studio
npm run build
```

The managed deployment uses the existing Sites project and preserves its audience and owner analytics secret. Hosting's private audience is separate from the core application's account-free design: **the current deployed site is still owner-private**. Self-hosted/public distribution can expose core tools without accounts. Do not trust client-supplied owner headers when self-hosting. Replace the Sites-specific owner authentication with verified server sessions, or remove/disable analytics routes; set `ANALYTICS_OWNER_EMAIL` privately and provision `DB` with the included schema-only migrations if retaining analytics. Cloudflare-compatible Worker output and static assets are generated by the supplied starter; no PDF document storage bucket is needed.

Analytics stores only event/browser UUIDs, tool IDs, event kinds and server activity/rate timestamps. Strict payload tests enforce no filenames/passwords/document data. 48-hour deletion occurs on ingestion, not a continuously scheduled erasure task; if traffic stops, retained database rows can remain until ingestion resumes. Browser opt-out, DNT and GPC honored. Hosting infrastructure may retain ordinary request logs; document contents are never sent by the app. OCR fetches upstream code/model on first use; local images go to its local worker. Read-aloud voice services can depend on operating system connectivity. No full-offline guarantee.

### Optional server roadmap (not implemented)

For better Office fidelity, isolate LibreOffice headless plus required fonts in a self-hosted container; for repair/image optimization, consider qpdf/Ghostscript only after license review (Ghostscript AGPL/commercial terms must not be ignored). Proposed start: 2 vCPU/4 GiB, concurrency 1, private tmp directory per job, 50 MB upload, 200 pages, 60-second CPU/task timeout, absolute 2-minute wall timeout, no public object URLs, authenticated job tokens if history is provided. Refuse archive bombs and active external fetching; sandbox conversions; delete temporary originals/results immediately after download or after a 15-minute TTL plus periodic cleanup. Keep request/error logs free of filenames/content. Configure rate quotas before upload to protect cost; optional service outages must not break local tools.

No external service was installed or represented by a fake button. Budget must be measured against the chosen provider: monthly compute cost = instance hourly price × running hours (about 730), plus storage/egress, backups and monitoring; no specific host price was researched here. Run a local container only when needed to avoid an always-on cost. This is a practical proposal, not an implemented deployment or a promise of unlimited free conversion.

## Validation and remaining work

See `VALIDATION.md` for exact checks/results. Ordinary, mixed orientation, cropped, encrypted, malformed, image-only and large-page-count fixtures cover core engine risks. The byte-limit boundary is checked without allocating a 150 MiB PDF; not a performance benchmark. No UI, phone/tablet, screen-reader, real OS download, OCR model, real-world Office collection or severely malformed recovery test was possible. These remain explicit release checks.

Highest next priorities: real-device mobile/AT QA; accurate tagged accessibility exports; an audited worker strategy for longer main-thread operations; optional high-fidelity Office pipeline with bounded cost; existing-text editing and cryptographic signing only after dedicated engine evaluation.

## Sources

All official URLs retrieved 30 Sep 2026 unless a report's own date is noted. No quoted marketing counters are used as quality evidence.

- I1 https://www.ilovepdf.com/pricing
- I2 https://www.ilovepdf.com/edit-pdf
- I3 https://www.ilovepdf.com/help/security
- S1 https://smallpdf.com/pricing
- S2 https://smallpdf.com/edit-pdf
- S3 https://smallpdf.com/support
- S4 https://smallpdf.com/privacy
- S5 https://smallpdf.com/starter-guide-to-smallpdf
- A1 https://www.adobe.com/acrobat/online.html
- A2 https://www.adobe.com/acrobat/pricing.html
- P1 https://tools.pdf24.org/en/
- P2 https://tools.pdf24.org/en/edit-pdf
- J1 https://www.sejda.com/upgrade
- J2 https://www.sejda.com/pdf-editor
- J3 https://www.sejda.com/privacy
- C1 https://pdfcandy.com/pricing.html
- C2 https://pdfcandy.com/edit-pdf.html
- C3 https://pdfcandy.com/privacy-policy.html
- H1 https://www.ihatepdf.cv/
- H2 https://www.ihatepdf.cv/ (linked technical guide; not a verified full-code audit)
- T1 https://github.com/Stirling-Tools/stirling-pdf
- T2 https://github.com/Stirling-Tools/Stirling-PDF/blob/main/LICENSE
- R1 https://au.trustpilot.com/review/smallpdf.com (Chris Higgins review, 28 Sep 2026; many positive reviews also present)
- R2 https://www.reddit.com/r/startup/comments/1tkp3d8/what_pdf_editor_are_you_guys_using_these_days/ (22 May 2026)
- R3 https://community.adobe.com/questions-9/pdf-to-word-conversion-formatting-issue-1261231 (2021 report; historical evidence)
- R4 https://www.reddit.com/r/MicrosoftWord/comments/1wlgpa6/cant_open_my_pdf_file_in_word_exactly_as_it/ (recent individual report)
- R5 https://github.com/Stirling-Tools/Stirling-PDF/issues/7796
- R6 https://github.com/Stirling-Tools/Stirling-PDF/issues/6784
- R7 https://www.reddit.com/r/privacy/comments/1pcg0vy/whats_the_best_privacy_focused_pdf_editor_for/ (2 Dec 2025)

Concurrent update reconciliation: preserved the independently added compact compression mode, search synonyms, up-front catalogue caveats and product review. The stronger shared-workspace/result-inspection journey replaces its earlier re-upload continuation.
