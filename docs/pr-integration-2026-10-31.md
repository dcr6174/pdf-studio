# Latest 15 PR integration — 31 October 2026

Reviewed PRs #214–#228 against main. Eight of the latest ten were already merged; only #227/#228 needed a merge. Old failed checks are historical; do not re-merge or revert already-integrated SEO/dependency commits merely to make those old checks green.

|PR|Scope|Historical merged build|Integration result|
|---|---|---|---|
|214|Portrait hoops / cricket animation and sound|Success|Retained; hoops/cricket suites pass|
|215|/arcade and /games shortcuts|Success|Retained; permanent shortcut checks pass|
|216|Remembered settings and logging|Success|Retained; preference/storage checks pass|
|217|Phone layout and tool shortcuts|Success|Retained; viewport/keyboard/layout checks pass|
|218|Technical SEO / canonicals / discovery|Failure|Later fixes retained; current source and built HTTP SEO suites pass|
|219|Dependency compatibility/security fixes|Success|Retained; compatibility checks pass; no claim of zero remaining advisory risk|
|220|Portable Cloudflare installation|Success|Retained; 1,199 public HTTPS download URLs with integrity checks verified|
|221|Distinct worked examples and content|Success|Retained; six generated PDF/ZIP examples and published asset links pass|
|222|Search Console redirects|Success|Retained; allowlist, query/method and final destinations verified|
|223|Permanent removals|Success|Retained; 410 + noindex and unknown 404 policies verified|
|224|Shared frame and progression|Failure|Retained; current shared-frame/progress/interaction tests pass|
|225|Viewport/session/mixer integration|Failure|Retained; current full production build passes|
|226|Original 3D cricket|Failure|Retained; old control assertions repaired by #228; real live WebGL renderer now initializes without console errors|
|227|Cricket full-viewport layout|Old branch failed|Merged latest main into branch; fixed semantic CSS conflicts with newer 3D dock; see below|
|228|Mixed input / obsolete build assertions|Branch succeeded|Merged as 42f081853079b6870f47d2986ec8b9669ec0a68d; production Cloudflare build succeeded|

## Corrected integration defects

1. Old cricket tests asserted deleted mobile-pad/audio-preview markup. #228 now checks the replacement controller/timing marker/shared sound and retains actual physics and React interaction coverage.
2. #227 moved the new three-column bottom dock into a 300 px side panel without clearing inherited grid columns and child positions. Its controller now uses one column with automatic rows. Setup resets the old floating-card transform/insets. Expanded batting options stay in the scrollable controller rather than opening outside its clipped boundary. Desktop/portrait/landscape controls remain available.
3. Cricket renderer/layout changes were missing from sitemap content fingerprints. The generator now includes the actual 3D renderer, 2D fallback, controller, rules/presentation, audio and cricket styles for Boundary Cricket only. A real-generator regression confirms a rebuild retains the date, a cricket CSS revision changes that page, and unrelated page hashes/dates stay unchanged. Generated sitemap/state also catch up with previously merged Arcade changes; no PDF/blog content dates were advanced by these Arcade edits.

## Validation on combined sources

- Full `npm run build:public`: passed, including Arcade lint/tests, all-repository TypeScript, fallback checks, PDF assets/fixtures, social/sitemap generation and all five Vite production build stages.
- SEO source/canonical/freshness suites: passed; 558 canonical URLs and 73 tool/guide pairs.
- Actual built Cloudflare worker: all 558 sitemap HTTP pages checked; unique title/description/social/canonical metadata, one H1, valid JSON-LD and no orphan pages; 326 redirects, 38 permanent removals, seven unknown noindex 404 cases; six guide examples and all their links/assets.
- Six worked PDF/ZIP examples, front/back mixing and article overlap audit: passed. Existing remaining content-overlap candidates are documented by the audit; this is not a claim that every article is unique.
- Shared sessions, preferences, progress, shortcuts, device-layout logic and dependency compatibility/portable lockfile checks: passed.
- Changed JavaScript/TypeScript lint: passed.
- Live current-main cricket: WebGL reached LIVE · STADIUM 01; no error-level console messages observed during initialization. This does not establish frame rate, physical-phone performance or audible sound quality.

## Limits

No claim that all 100 Arcade games were manually played. Physical phones, screen readers and audible sound still need dedicated checks. GitHub Actions verify jobs can fail before producing logs; do not confuse those with the independently successful Cloudflare build or local production checks. No pipeline safety checks were disabled. The persistent per-game audit remains under docs/arcade-audit.
