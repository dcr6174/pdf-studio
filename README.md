# PDF Studio

Public hosting on your own domain: **[GitHub + Cloudflare setup](docs/PUBLIC_HOSTING.md)**. The standalone build needs no ChatGPT or GitHub account for visitors. Owner analytics uses a separate password.

<img src="public/brand/pdf-studio-mark.png" width="96" height="96" alt="PDF Studio logo" />

A free, MIT-licensed PDF studio with 50 implemented tool entries (with documented scope and runtime limits), drag-and-drop page organization, a visual annotation/signature editor, and an optional device-local file shelf.

## Run it

Requires Node.js 22.13 or newer.

```sh
npm ci
npm run dev
```

The development server prints its URL. Standard PDF tools run in the browser; they do not send document contents to the server. The supplied source is the full application, not a screenshot or UI mockup.

```sh
npm run verify
npx tsc --noEmit
npm run build
```

The tests create their own sample documents. They check reordered pages, split ranges, rotation, crop validation, A4 resizing, n-up, mirroring, metadata removal, AES-256 encryption, incorrect-password rejection, decryption, split ZIPs, fillable form flattening, and SHA-256.

## What works

- Merge, organize, split, rotate, reverse, duplicate, interleave, crop, A4 resize, mirror and n-up.
- Touch/mouse drag handles and keyboard sorting. Every page also has earlier/later buttons.
- Add text, PNG/JPG/WebP images, highlights, rectangles, ellipses and links; draw/type/upload visual signatures. Drag elements and resize their corners.
- Redaction creates a new raster PDF and discards the original document objects.
- Watermarks, pagination, Bates numbers, headers, fillable forms and standard metadata.
- PDF/image/text/Word/HTML/EPUB/PowerPoint/CSV/XLSX conversions; document creation; DOCX/first-sheet/EPUB text import.
- Image-based compression, grayscale, inverted colours, English OCR, and browser read-aloud.
- AES-256 opening passwords, password removal with known credentials, standard metadata removal, a text-pattern privacy scanner and SHA-256.
- Side-by-side comparison, PDF ZIP bundling and resaving parseable PDFs.
- Save chosen outputs to IndexedDB in the current browser; reopen, download or remove them. No cloud synchronization. A shared workspace, bounded undo/redo and an explicit local draft save support multi-step work.
- Light/dark theme, responsive layouts, tool search and accessible UI primitives.

## Exact limits

This is an independently written alternative inspired by ihatepdf.cv's workflow. It does not reproduce all 67 tools advertised on the reference, its brand, testimonials, or its proprietary assets.

- PDF editing adds new elements. It does not edit existing text in place. Visual signatures are not certificate-based digital signatures.
- DOCX/PDF text conversion reflows text and does not preserve original Office layouts, images or fonts. Legacy DOC is not supported.
- PDF-to-PowerPoint places page images on slides; original graphics are not individually editable. Spreadsheet extraction is heuristic and must be reviewed.
- Basic Markdown supports headings/list text, not complex tables or embedded images. EPUB conversion reflows text; it does not preserve every illustration/style. Noto Sans covers Latin, Greek and Cyrillic; other scripts can require additional fonts.
- Crop hides content outside the CropBox. For permanent removal use Redact.
- Image-preset compression, redaction, flattening and colour conversion rebuild pages as images. Searchable text, forms, links and embedded objects are removed. OCR adds a new recognized text layer; OCR accuracy is not guaranteed.
- The standard metadata cleaner is not a complete hidden-data sanitizer. The privacy scanner uses patterns and is not an exhaustive security audit.
- Password removal requires successful password authentication. It respects the library's modification permissions.
- Resave can only rebuild documents that parse successfully. Severe corruption is not repaired.
- Read aloud uses browser voices, may depend on the operating system or connectivity, and does not export an audio file.
- The OCR worker, WASM engine and English model are downloaded from upstream package/model hosts on first use. Document images are passed to a local worker, not uploaded. Other PDF libraries, worker assets and fonts are bundled with the app.
- No AI chat, AI summarization, audio transcription, peer-to-peer sharing, collaborative whiteboard, camera edge detection, or tax/billing system is implemented.
- A session has a 150 MiB safety limit and a 400-page workspace limit to reduce browser memory failures. These are device protection limits, not paid tiers.
- No claim of fully offline operation is made. Browser caches and OCR model availability affect offline use.

## Testing status

Engine fixtures and TypeScript/build checks passed. Live browser QA and WebMCP validation were unavailable in the creation environment. Test real drag/drop, signature resizing, OCR downloads, large PDFs, mobile Safari/Chrome and downloads on your intended devices before relying on this in production. The optional WebMCP tool opens a tool while retaining the document. Browser UI validation remains unavailable.

## Self-hosting and privacy

The app uses React, Vinext/Vite and browser libraries. The starter's managed Sites adapter is included for deployment. `npm run dev` also runs without document-processing services or API keys. A normal HTTPS origin is recommended for crypto and browser features. The deployed preview starts private; source licensing and site audience are separate.

Files saved to My files exist only in that browser profile. Clearing browser data, changing origin, private browsing or eviction may remove them. Download important outputs. Browser speech services may use online voices; check your device's settings for offline requirements.

## Licence

Application code: MIT, see `LICENSE`. Third-party code/fonts retain their own licences; see `THIRD_PARTY_NOTICES.md`. No user documents or credentials are bundled with the source download.

## First-party analytics

The `/analytics` owner dashboard now shows live online browsers, rolling 1-hour/24-hour visitors, successful/failed tool runs, download-button clicks, a per-tool breakdown, and an hourly completion chart. It refreshes every 10 seconds. The PDF workspace sends a heartbeat every 25 seconds while visible; presence expires after 90 seconds. Multiple tabs reuse a browser ID so presence is not multiplied by open tabs.

Events are emitted by the actual tool code, not inferred from DOM clicks or URL guesses. An event UUID is retained across retries, and the database primary key deduplicates the retries. Server receipt time controls the rolling windows. PDF processing never waits for analytics to succeed.

Persistent data is stored in D1 under the `DB` logical binding. The generated, schema-only Drizzle migration creates `analytics_visitors` and `analytics_events` and their query indexes. Nothing creates tables at runtime. Deploying the Site applies the migration.

Set `ANALYTICS_OWNER_EMAIL` as a server runtime secret matching the verified owner's sign-in email. Both the page and summary API enforce this against trusted dispatch-authenticated headers; the client sidebar link is only a convenience, not the authorization boundary. Access fails closed when identity or owner configuration is missing. No private owner address is included in the downloadable source. When self-hosting outside Sites, supply your own verified session authentication and replace this dispatch-specific check; do not trust client-supplied identity headers.

Stored analytics fields are limited to random visitor/event UUIDs, tool IDs, event kinds, server timestamps and an ingestion rate counter. No document contents, filenames, passwords, IP addresses, user-agent strings, account emails or document error messages are stored. Records older than 48 hours are pruned on ingestion. Browser-scoped random IDs remain until the browser's local storage is cleared. Pending event IDs may be queued in session storage; at most 100 are retained.

Users can opt out in **Open source & privacy**. Do Not Track and Global Privacy Control disable tracking. Common bot/crawler/headless user-agent patterns are filtered before persistence. The dashboard itself emits no tracking events. Same-origin validation, strict payload allowlists, body limits and per-visitor ingestion limits constrain writes. The public event endpoint still accepts unverified browser events, so this is not fraud-proof human counting.

Visitors mean browsers, not identified people. Offline use, blockers, privacy choices, request loss and cleared storage affect counts. Live online is an estimate. A download click is not proof that a file was saved. Historical traffic before deployment cannot be backfilled. Counts include the owner using PDF tools, but not the owner reading the dashboard. The Site audience has not been changed.

Run `npm run verify:analytics` for server/SQLite and tracker tests, including rolling-window boundaries, 90-second presence expiry, multi-tab deduplication, idempotent retry, retention, validation, authorization, payload privacy and opt-out behaviour. Live browser visual QA remains unavailable in the creation environment.

## Studio refresh (30 September 2026)

Read [research and audit](docs/RESEARCH_AND_AUDIT.md), [validation](docs/VALIDATION.md) and [the feature matrix](docs/RESEARCH_AND_AUDIT.md#implementation-order-and-final-feature-matrix).

- Files, page order and annotations remain when changing compatible tools. Inspect exported results and Continue editing to consolidate them without another file selection.
- Undo/redo keeps up to 20 document snapshots. Source bytes are shared between snapshots. Tool options/text-creation drafts are outside document history.
- Save draft explicitly stores files/page order/annotations in this browser. It is not automatic, synchronized or encrypted. Restore/delete is shown when a saved draft exists. Passwords/tool settings/form values are excluded.
- Keyboard sorting and earlier/later buttons remain. Element arrow keys move; Shift+arrows resize; numeric controls position accurately. Signature Type/Upload are alternatives to drawing.
- CropBox-aware export mapping handles native and workspace page rotation. Imported image aspect is preserved initially; users can explicitly reshape it.
- Form fields remain editable by default. Flattening is optional; unsupported field types and page-organization/form limitations are disclosed.
- Selected tools support a ZIP batch of up to 20 PDFs, with per-file failures. Cooperative stop checks safe boundaries; some synchronous library work must finish first.
- Compact compression keeps text and links; image presets rebuild pages. It can produce a larger result. The input/output comparison and original download prevent a misleading success claim.

```sh
npm run verify:studio
```

The engine harness uses actual application functions and native canvas to inspect rendered PDFs. It does not simulate a browser or prove mobile interaction, browser storage, speech playback or OCR downloads.

Concurrent update reconciliation: preserved the independently added compact compression mode, search synonyms, up-front catalogue caveats and product review. The stronger shared-workspace/result-inspection journey replaces its earlier re-upload continuation.

PDF.js worker, CMaps and standard fonts are restored from the locked `pdfjs-dist` dependency during `npm ci` and public builds. The custom logo and Noto font are included in the repository.
