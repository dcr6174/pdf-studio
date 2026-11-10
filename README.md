# PDF Studio

<img src="public/brand/pdf-studio-lockup-v5.svg" height="64" alt="PDF Studio — Page Buddy logo" />

[PDF Studio](https://pdf-studio.in/) provides free browser-based PDF tools with no account required and no added watermark. The current catalogue contains **100+ free PDF tools** (generated from the registry via PDF_TOOL_COUNT, never hardcoded), with separate Image Studio and creative utilities in Studio Lab. Documents are processed on the visitor’s device.

## Features

- Merge, split, organize, rotate, reverse and duplicate pages; alternate pages from different PDFs; manage local bookmarks and page links.
- Compress PDFs with three primary choices: **Keep quality**, **Balanced** and **Smaller file**, plus an optional best-effort KB limit.
- Add text, images, drawings, watermarks and visual signatures; edit supported original PDF text in a separate editor.
- Fill existing PDF forms, create simple fillable forms, redact selected regions, and inspect document metadata.
- Convert supported text, Office and image inputs; export PDF text, page images and other supported formats; recognize scanned text with OCR.
- Read and search PDFs, compare documents, make booklets, collect clippings and build linked document packs.
- Preserve compatible documents when switching tools; preview exports, download, or explicitly save them to **My files**.
- Desktop right action sidebar; attached compact toolbars below 1100px with Add Files, contextual settings and a reachable main action. Visible-viewport sizing supports browser bars, orientation changes and on-screen keyboards without treating pinch zoom as a keyboard. Theme selection, keyboard controls and reduced-motion handling are included.

The PDF catalogue count is derived from `lib/tools.ts` (`PDF_TOOL_COUNT`); Lab tools and SEO aliases are separate collections.

The catalogue and accepted file types are defined in [lib/tools.ts](lib/tools.ts); public routes are defined in [lib/seo-tools.ts](lib/seo-tools.ts). Availability does not imply support for every PDF or full Office-layout fidelity.

## Privacy and data handling

The PDF/image processors run in the browser; their normal processing flows do not upload document bytes to the application server. My files, drafts, reading preferences and text-edit recovery use browser storage. They can be lost when browser data is cleared or storage is unavailable; download important work before leaving.

This is **not a zero-network website**:

- Anonymous first-party usage events can include a tool ID and coarse device/browser/country context. The event schema excludes document bytes, filenames, document text and passwords. Usage counting can be disabled through **Preferences**, and supported Do Not Track/Global Privacy Control signals are respected. Server activity records are retained for up to 48 hours.
- OCR downloads language data when needed. Read-aloud voices may use network-backed browser services.
- Google AdSense is enabled on eligible pages. Advertising is separate from the first-party usage preference. See [docs/adsense.md](docs/adsense.md) for removal steps; the central switch is `ADS_ENABLED` in [lib/advertising.ts](lib/advertising.ts).

The owner analytics dashboard has a separate authentication boundary. Public PDF tools do not require that login. See [the privacy page](https://pdf-studio.in/privacy) and [the hosting guide](docs/PUBLIC_HOSTING.md).

## Prerequisites

- **Node.js 22.13.0 or newer** and npm. CI uses Node 22.
- A modern browser with JavaScript and sufficient memory for the document.
- For independent output checks: Poppler (`pdftotext`, `pdftoppm`) and Python 3 with Pillow. The canvas/XML helpers are already pinned in `devDependencies`; no extra unpinned npm install is needed.

The app uses React/TypeScript and Next-compatible routing through **Vite + vinext**. The public deployment target is **Cloudflare Workers**, with D1 for optional owner analytics. It is not a GitHub Pages static export.

## Install and develop

```sh
npm ci
npm run dev
```

`postinstall` and the development command run `scripts/prepare-pdf-assets.mjs`. It restores PDF.js workers/CMaps/fonts, PDFium WASM, OCR workers/cores and Excalidraw fonts from the installed dependencies. If no local Cloudflare configuration exists, it copies `wrangler.public.example.json` to `wrangler.public.json`.

Open the URL printed by Vite. The all-zero D1 identifier is a local build placeholder, not a production database. Owner analytics requires runtime configuration; public document tools can be developed without owner credentials.

## Build and run the production output locally

```sh
npm run build:public
npm run start
```

`npm run build` is an alias for `build:public`. The build prepares runtime assets, regenerates synthetic tool fixtures, brand-option previews, social images and the sitemap, then builds with `vite.public.config.ts`. The Worker output is in `dist/server/`, including its generated `wrangler.json`. `start` runs that output with Wrangler; build first.

To regenerate individual public assets:

```sh
npm run generate:test-fixtures
npm run generate:brand-options
npm run generate:site-assets
```

Generated public assets that are linked from tools, articles, downloads, metadata or tests are intentional. Do not remove them merely because they are generated. Local regression output directories are disposable; tracked fixtures under `checks/fixtures/` are required inputs.

## Validation

Start with the same core checks used for review:

```sh
npm run lint
npx tsc --noEmit
npm run verify:compression
node checks/verify-form-appearance.mjs
node checks/verify-desktop-audit.mjs
node checks/verify-responsive-layout.mjs
node checks/verify-site-maintenance.mjs
npm run generate:site-assets
node checks/verify-review-sitemap.mjs
npm run build:public
```

The full review suite is specified in [.github/workflows/repository-quality.yml](.github/workflows/repository-quality.yml). It also covers original-text editing, image outputs, drawing, watermark/signature output, uploads, workflows and PDF-to-Word conversion. Other named scripts, including `verify`, `verify:text`, `verify:analytics` and `verify:public`, are available in [package.json](package.json).

These are engine, source, CSS or server-rendered checks unless their output explicitly says otherwise. They do **not** certify real-phone touch, camera/file sharing, screen readers, printer alignment, browser memory ceilings or every possible PDF. Historical test files are retained for investigation; not every legacy check matches the current tool-first interface.

For browser smoke tests, use a synthetic PDF and verify **upload → processing → result preview → download**, then reopen the downloaded output with an independent PDF reader. Check desktop and mobile separately, including both themes and keyboard/touch behavior. The latest scoped audit and its exact tested/untested boundaries are in [docs/SAFE_AUDIT_2026_10_12.md](docs/SAFE_AUDIT_2026_10_12.md).

## Deploy to Cloudflare

Deployment requires a real D1 database ID and access to the owner’s Cloudflare account. Configure and migrate the database as described in [docs/PUBLIC_HOSTING.md](docs/PUBLIC_HOSTING.md).

```sh
node scripts/configure-public.mjs YOUR_DATABASE_ID
npx wrangler d1 migrations apply pdf-studio-analytics --remote --config wrangler.public.json
npm run build:public
npm run deploy:public
```

The deploy script rejects a placeholder D1 ID or the wrong build configuration. Set `OWNER_PASSWORD` and `ANALYTICS_OWNER_EMAIL` as **Worker runtime secrets**, never client variables or committed credentials. A local `.dev.vars` may be used for local secrets and must remain untracked.

GitHub is connected to Cloudflare Builds with `main` as the production branch. A merge/push can therefore release changes. Review the PR and check CI before merging; a successful push alone does not prove deployment succeeded. Verify the deployed commit and the live custom domain afterwards. No merge or deployment was performed for the 12 October audit PR.

## Directory structure

| Path | Purpose |
| --- | --- |
| `app/` | Public routes, guides/blogs, owner/API routes and shared styles |
| `components/` | Workspaces, upload/results UI, navigation and shared controls |
| `lib/` | PDF/image engines, tool registries, validation, privacy and route policy |
| `lib/vendor/`, `vendor/`, `licenses/` | Vendored helpers and retained license notices |
| `public/` | Brand, fonts, runtime assets, linked samples, fixtures and SEO assets |
| `checks/` | Regression scripts and required test fixtures |
| `scripts/` | Asset preparation, configuration, build/deployment helpers |
| `build/public-worker.ts` | Cloudflare entry, route redirects and security/owner boundary |
| `db/`, `drizzle/` | D1 schema and migrations |
| `.github/workflows/` | Automated PR checks |
| `docs/` | Current operating guides and dated research/validation records |
| `examples/`, `desktop/` | Retained examples and future desktop planning; not the public app entry |

The Page Buddy v5 assets are in `public/brand/`. Follow [docs/BRAND-V5.md](docs/BRAND-V5.md) and keep license notices with fonts/assets.

## Known limits

- The shared workspace ceiling is **150 MiB (about 157.3 decimal MB), 400 pages**; supported batch processing accepts up to 20 files. Individual tools impose additional limits. These are validation ceilings, not guarantees that a low-memory device can process that much.
- Original-text editing supports available font characters, compatible text objects and bounded paragraph edits. It does not offer arbitrary document-wide reflow. Scans need OCR; OCR does not make the scanned image into editable original text. Fitting may shrink supported replacements to half their original size. PDF editing invalidates cryptographic signatures.
- Signatures are visible marks, not certificate-based identity verification. Cropping or drawing a black shape is not secure redaction. The dedicated Redact export rebuilds image pages and removes original text, links and editable forms; keep the original and inspect the result.
- Form-bearing page operations require the supported explicit field-handling choice. Do not assume every field type, appearance or external bookmark action survives every operation.
- Compression cannot guarantee a particular size or savings. The three current compression choices preserve text/links/forms; workflows with an explicitly rasterized output can remove them. Always inspect fine detail.
- Word/EPUB/spreadsheet imports have explicit fidelity limits. Spreadsheet import exports selected sheets as text rows; charts and original styling are not reconstructed. DOCX import reflows text and omits images/layout. PDF-to-Word has editable-text and page-image modes; neither guarantees a perfect original document.
- Grayscale, invert, mirrored pages, page-image exports and some layout tools can remove document interactivity. Their warnings are part of the workflow.
- Blank-page detection and privacy scanning produce candidates, not guarantees. Metadata removal is not complete sanitization; Repair readable PDF is not recovery of arbitrary corrupted/encrypted files.
- Browser speech, PWA installation, OCR downloads, saved-state recovery and large-file performance depend on the browser/device. No blanket offline or universal accessibility certification is claimed.

## License

Application code is [MIT licensed](LICENSE). Dependencies, engines, fonts and vendored assets retain their own licenses: [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).




