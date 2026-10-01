<p align="center"><img src="public/brand/pdf-studio-mark.png" width="80" height="80" alt="PDF Studio logo" /></p>

<h1 align="center">PDF Studio</h1>
<p align="center">Free PDF tools. Your documents stay on your device.</p>

PDF Studio is an open-source workspace for organizing, annotating, signing and exporting PDFs. No subscription, mandatory account or added watermark for core tools.

## What you can do

- **Organize:** merge, split, extract, reorder, rotate, delete and duplicate pages.
- **Edit and sign:** add text, images, highlights, shapes, links and visual signatures.
- **Optimize:** compact PDFs while keeping text, or choose image-based compression.
- **Convert:** PDF/images/text and supported document conversions.
- **Protect:** opening passwords, authorized password removal and raster redaction.
- **Keep working:** shared workspace, undo/redo, result previews and local saved drafts.

Light and dark themes, searchable tools, keyboard controls and responsive layouts are included.

## Privacy

PDF processing happens in your browser. Files and drafts are saved on your device only when you choose to save them. Anonymous analytics records tool activity, never document contents, filenames or passwords. Tracking can be disabled in **Open source & privacy**.

## Run locally

Requires Node.js **22.13 or newer**.

```sh
npm ci
npm run dev
```

The terminal prints the local website address. PDF.js assets are restored automatically from the pinned dependency. A placeholder database configuration is created for local builds; use your real D1 database ID before deployment.

## Publish your website

**[Start here](docs/START_HERE.md)** for the next Cloudflare step, or follow the **[complete hosting guide](docs/PUBLIC_HOSTING.md)**.

GitHub stores the code. Cloudflare Workers hosts the public app and D1 analytics. Visitors need no GitHub or ChatGPT account. The owner analytics dashboard uses a separate owner password. The custom domain is not activated by uploading code to GitHub.

```sh
node scripts/configure-public.mjs YOUR_DATABASE_ID
npm run build
npm run deploy:public
```

Set owner credentials only as Cloudflare runtime secrets. Never commit passwords or tokens.

## Important limits

- Editing adds overlays; existing PDF text is not edited in place.
- Visual signatures are not certificate-based digital signatures.
- Office/text conversions may reflow content and lose formatting.
- Raster compression/redaction removes original text layers, forms and links.
- Workspaces are limited to **157.3 MB total** and **400 pages** to protect browser memory.

See the [combined competitor feature inventory](docs/FEATURE_PARITY.md) for current coverage and remaining gaps. Full combined parity is not complete.

See the [feature matrix and research](docs/RESEARCH_AND_AUDIT.md) and [validation results](docs/VALIDATION.md). Live browser/mobile and OCR verification remains pending.

## Checks

```sh
npm run verify
npm run verify:analytics
npm run verify:public
npx tsc --noEmit
```

## License

**MIT** for application code. Dependencies and fonts retain their own licenses; see [LICENSE](LICENSE) and [third-party notices](THIRD_PARTY_NOTICES.md).


## Current feature work

Signatures expose name entry and image upload together, with previews and optional drawing. Existing-text editing uses browser PDFium. Page tools include blank insertion, bookmarks, page halving and reader-layout preferences. Basic new fillable text forms and original-document annotation removal are available.

Additional checks: `node checks/verify-extra-pdf.mjs`, `node checks/verify-signatures.mjs`, `node checks/verify-online-text.mjs`, `node checks/verify-seo.mjs`, and `npm run verify:studio`. For raster tests, run `npm install --no-save --package-lock=false @napi-rs/canvas@0.1.80 @xmldom/xmldom@0.8.15` after `npm ci`. These packages are test helpers.
