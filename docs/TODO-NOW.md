# Do now: checklist (4 October 2026)

Work top to bottom. Each step says how to know it worked.

## A. Cloudflare (10 minutes, no code)
1. **Rocket Loader off.** Speed, Optimization, Content Optimization. It breaks React sites.
2. **Bot protection.** Security, Bots: keep Bot Fight Mode off while testing; Adjust bot exceptions only if desired. Check Security, Events for blocked `/assets/` requests.
3. **Cache.** Caching, Configuration, Purge stale cached HTML when recovering from a deployment mismatch; do not require full purges after every deploy. Keep HTML on short caching and let hashed asset files cache for a long time.
4. **Domain.** Custom domain pdf-studio.in set to Production only (not Preview).
5. **Rollback ready.** Workers, your worker, Deployments: note the last good version.

## B. Deploy this package (20 minutes)
1. Unzip `pdf-studio-overlay.zip` over your repo (keep your own `wrangler.public.json`). Delete the folder `app/prove-it` (it is replaced by `app/check-it-yourself`).
2. `npm ci`, then `npm run lint`, `npx tsc --noEmit`, `npm run generate:site-assets`.
3. Run the checks (each prints PASS): `node checks/verify-startup-guard.mjs`, `verify-claims`, `verify-theme-switch`, `verify-search`, `verify-welcome`, `verify-paste-result`, `verify-guides-comparisons`, `verify-homepage`, `verify-seo`, `verify-navigation-install`.
4. `npm run build:public`, then deploy to a test first if you can. Purge cached HTML only if stale markup is verified; do not make routine full-cache purges part of deployment.

## C. Check on a real phone AND a desktop (15 minutes)
- [ ] Home: tap three tool cards, tap Choose files, take a photo in Scan to PDF.
- [ ] Tools menu opens ABOVE the page (phone and desktop) and closes on outside tap.
- [ ] Moon/sun button: double-tap it quickly; the theme and icon agree and survive a reload.
- [ ] /prove-it redirects to /check-it-yourself. /guides, /contact, /about, /privacy: View source shows each page's own og:url.
- [ ] /compare/smallpdf-alternative: no numbers for limits, sources listed, "Checked" date shown, "We have not tested".
- [ ] Block a script on purpose (DevTools, Network, block `/_next/static/*.js`) and reload: after about 7 seconds a "This page did not finish loading" message with Refresh appears.
- [ ] Google Search Console: submit the sitemap; test a URL with URL Inspection.

## D. Next work (after A to C pass; see the plan)
1. Mobile layout: bottom bar (Home, Tools, My files, Guides), compact header, 2x3 tool tiles.
2. Installed-app home: Resume, Recent, Quick tools only.
3. Desktop: keep the current hero; make Ctrl+K a real quick-jump menu.
4. Speed: split the tool workspace out of the home page bundle so the home loads fast on 4G.
5. Self-host the OCR engine and English model.
6. Offline shell, only after testing it.
