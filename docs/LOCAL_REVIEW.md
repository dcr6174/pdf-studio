# Review locally without publishing

These changes are not pushed or deployed. Extract the source archive and open the pdf-studio directory in VS Code.

Use Node 22.13+ (Node 24 used in the audit):

```sh
npm ci
cp wrangler.public.example.json wrangler.public.json
npx tsc --noEmit
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
npm run build:public
```

The copied example is for local build configuration. Set your own database/domain configuration later; no credentials or actual account configuration are included in the archive. Do not run deploy:public during review. A build is not publication. Developer-only raster helpers are declared in devDependencies.

Review docs/AUDIT-2026-10-01.md and README.md. Synthetic output fixtures and machine-readable results are in work/validation. Before release, test real browser drag/drop, cancel, replacement confirmation, draft restore, focus/Escape, install visibility, signature placement and exported PDFs on mobile and desktop. OCR and voice playback require separate verification. The report records limits rather than pretending these browser checks passed.

Before running the standalone SEO check, run `npm run generate:site-assets`. The production build generates the social PNGs automatically; their editable source is `scripts/generate-site-assets.mjs`.
