# Dependency security review — 30 October 2026

## Scope and measured results

Repository: `dcr6174/pdf-studio`. PR [#218](https://github.com/dcr6174/pdf-studio/pull/218)
merged at 04:09:57 UTC on 30 October 2026. This review starts from subsequent
`main` commit `e884cc8`, not the Replit starter application, and does not merge or
deploy anything.

| Measurement | Critical | High | Moderate / medium | Low |
| --- | ---: | ---: | ---: | ---: |
| Historical GitHub default-branch push summary, before #218 | 4 | 43 | 39 | 13 |
| Actual open GitHub alerts retrieved after #218 merged | 0 | 39 | 34 | 11 |
| Original branch lockfile, npm audit affected-package counts | 0 | 17 | 16 | 3 |
| Remediated branch lockfile, npm audit affected-package counts | 0 | 0 | 7 | 6 |
| Open GitHub advisory ranges still matching the remediated lockfile | 0 | 0 | 2 | 2 |

GitHub's 84 open alerts were fetched through its paginated Dependabot API.
All 80 addressed alerts (39 high, 32 medium, 9 low) were compared against
**every installed occurrence** of their package in `package-lock.json`, not just
the top-level version. GitHub comma-separated version constraints were normalized
to semver comparator sets before comparison. The four remaining matches are
listed below. GitHub will continue to show default-branch alerts until a reviewer
merges this PR and GitHub refreshes its dependency graph.

The npm result contains **13 affected-package records**, not 13 distinct
advisories. Parent packages inherit child severity. Its four distinct remaining
advisories are the same four listed below. Do not compare npm's package totals
directly with GitHub's advisory alerts, or treat the historical 99-alert summary
as a fresh measurement of this branch.

## What #218 already fixed

The API reports these 15 alerts fixed immediately after #218 merged:

| Package and existing patched version | Fixed alert numbers | Advisory IDs |
| --- | --- | --- |
| Next / ESLint config 16.4.3 | #64, #68–73, #79–81, #85 | GHSA-vcvr-r3jv-pc5j, GHSA-cjq9-62q9-8jv4, GHSA-mcj8-r9mp-w47p, GHSA-f87g-xv8r-7p7x, GHSA-39w2-rjm5-chcv, GHSA-4jqv-mc3x-m676, GHSA-3w37-wq28-93x7, GHSA-p3m5-59mp-jv5r, GHSA-2464-fhr4-w9xw, GHSA-h694-7cp9-m8p3, GHSA-673q-mjm6-r5xr |
| DOMPurify 3.4.17 override | #82–84 | GHSA-c6gr-qvv4-5v3f, GHSA-mrv2-3pqr-j5jr, GHSA-cg2g-xh64-v4q7 |
| react-server-dom-webpack 19.3.1 | #24 | GHSA-wx67-qw84-cm4g |

These include **all four critical alerts**: Next #64, #80 and #85, and DOMPurify
#84. React and React DOM remain aligned at 19.3.1, but the browser packages
themselves had no separate alert in this retrieved fixed-alert list.

## Targeted remediation in this PR

Only Vite and Zod change among direct dependency versions. Existing ranges were
refreshed for vulnerable utilities and their required children; this is not an
unrestricted dependency update or an `npm audit fix --force`.

| Package | Remediated lockfile version(s) | Addressed GitHub alert numbers |
| --- | --- | --- |
| undici | 7.30.1 | #13–19, #29–33, #48–56, #91–93, #95–99 |
| fast-uri | 3.1.9 | #63, #87–90 |
| zod | 4.6.7 | #86 |
| vite | 8.1.6 | #11–12, #74–78 |
| sharp | 0.35.5 | #67 |
| source-map-js | 1.2.2 | #65 |
| brace-expansion | 1.1.21, 5.0.12 | #21–22, #25–28, #57–62 |
| image-size | 2.0.3 | #46–47 |
| js-yaml | 4.3.2 | #20, #23, #34, #45 |
| baseline-browser-mapping | 2.11.34 | #44 |
| fflate | 0.7.5 (0.8.3 also remains) | #43 |
| nanoid | 3.3.18, 5.1.16 (docx's 6.0.1 remains unchanged) | #1–2, #35–38, #41–42 |
| browserslist | 4.29.5 | #39–40 |
| @babel/core | 7.29.7 | #10 |
| ws | 8.21.0 | #7, #9 |
| lodash-es | 4.18.1 | #4–6 |

The top-level esbuild update to 0.28.2 also removes its low finding; the nested
Wrangler copy remains affected as documented below.

### Compatibility decisions

- Use lodash-es `4.18.1`; `4.18.0` is deprecated by its publisher as a bad
  release. Its suggested fallback `4.17.23` now has high-severity template and
  prototype-pollution advisories, so do not downgrade to it. Keep the override
  and lockfile synchronized and regression-test collection and object helpers.
- Keep Vinext `1.0.0-beta.5`, Cloudflare Vite plugin `1.37.1`, Wrangler `4.92.0`
  and their existing workerd release. Newer parent releases bring wider framework
  changes, including a new Miniflare beta line. Pin the vulnerable HTTP,
  WebSocket and image-processing children rather than replacing this toolchain.
- Excalidraw's latest release is still `0.18.1` and pins vulnerable Nano ID
  versions. Its Nano ID 3 consumer moves to 3.3.18. The Mermaid converter's
  pinned Nano ID 4 has no patched 4.x release; it moves to the compatible named
  ESM `nanoid` API in 5.1.16. ID lengths/alphabet and generation are checked
  against both consumers' actual resolved imports. No persisted game IDs or
  save formats are changed.
- PptxGenJS's latest release is still `4.0.1`; its image-size 1 dependency has no
  patched 1.x release. This release ships that dependency without invoking it in
  its CJS entry. The 2.0.3 override is guarded by a source assertion and a real
  text-plus-image PowerPoint ZIP export. Vinext already uses image-size 2's
  named `imageSize` byte-buffer API. **Do not reuse this override blindly if a
  future PptxGenJS version starts using the old callable/path-string API.**
- Zod's fix is in major version 4. The connector already imports `zod/v4` in
  other modules. Update the two remaining one-argument `z.record()` calls to
  explicit string-key records and refresh zod-validation-error to 4.0.2.
  Valid/invalid records, strict field rejection, grants, session defaults and
  driver responses have regression checks.
- Canonical npm tarball URLs replace environment-private mirror URLs in the
  committed lockfile for external CI portability, including inherited entries.
  Versions and integrity hashes are retained. Installation used the configured
  security policy; no blocked package or policy was bypassed.

## Exact remaining risks

These are retained findings, **not a clean security bill of health**.

| GitHub alert | Severity / advisory | Locked dependency path | Risk, boundary and follow-up |
| --- | --- | --- | --- |
| [#94](https://github.com/dcr6174/pdf-studio/security/dependabot/94) | Moderate — [GHSA-wx4j-mvgx-mqwp](https://github.com/advisories/GHSA-wx4j-mvgx-mqwp) | vinext → @vercel/og → satori **0.16.0**, fixed in **0.33.5** | Crafted values can become SVG markup. No direct application ImageResponse/Satori imports were found, but that is not proof of unreachability. Do not send attacker-controlled content through Satori. There is no complete workaround; update the parent rendering stack with dedicated generated-image regressions rather than force a large Satori pre-1.0 jump here. |
| [#3](https://github.com/dcr6174/pdf-studio/security/dependabot/3) | Moderate — [GHSA-67mh-4wv8-2f99](https://github.com/advisories/GHSA-67mh-4wv8-2f99) | drizzle-kit → @esbuild-kit/esm-loader → @esbuild-kit/core-utils → esbuild **0.18.20**, fixed in **0.25.0** | esbuild's development `serve` API allows cross-origin reads. This is database tooling, not proof of an exposed production endpoint. Avoid this old serve API; replace/update the obsolete loader chain with database-generation regressions before removing it. Do not use npm's suggested downgrade to old drizzle-kit. |
| [#8](https://github.com/dcr6174/pdf-studio/security/dependabot/8) | Low — [GHSA-g7r4-m6w7-qqqr](https://github.com/advisories/GHSA-g7r4-m6w7-qqqr) | wrangler → esbuild **0.27.3**, fixed in **0.28.1** | Windows esbuild `servedir` can traverse outside its root using backslashes. The verification environment is Linux; this does not clear Windows developer exposure. Avoid serving files this way on Windows and upgrade Wrangler/esbuild together with local-worker regression checks. |
| [#66](https://github.com/dcr6174/pdf-studio/security/dependabot/66) | Low — [GHSA-238p-pmpm-9mq7](https://github.com/advisories/GHSA-238p-pmpm-9mq7) | @excalidraw/excalidraw → @excalidraw/mermaid-to-excalidraw → mermaid → katex **0.16.47**, fixed in **0.18.2** | A pre-existing prototype-pollution source can change trusted-rendering options; attacker expressions plus insertion without separate sanitization can enable unsafe links/resources. KaTeX does not create the pollution itself. DOMPurify remains pinned, but do not claim that proves all Mermaid paths safe. Upgrade the renderer with math/diagram and sanitization regressions rather than force a cross-minor KaTeX API change. |

The seven moderate npm package records are `@esbuild-kit/core-utils`,
`@esbuild-kit/esm-loader`, `@vercel/og`, `drizzle-kit`, `esbuild`, `satori`, and
`vinext`. The six low records are `@cloudflare/vite-plugin`,
`@excalidraw/excalidraw`, `@excalidraw/mermaid-to-excalidraw`, `katex`, `mermaid`,
and `wrangler`. esbuild's aggregate moderate record includes the separate low
Windows advisory.

## Verification

Verified locally with Node 24.22.1 and npm 11.19.1:

```sh
npm run install:ci                  # npm ci, including PDF asset preparation
node checks/verify-dependency-compatibility.mjs
npm run lint                       # zero warnings
npx tsc --noEmit
npm run build:public               # actual Vite/Vinext Cloudflare worker build
npm run verify:seo
npm run verify:seo:rendered
npm audit --audit-level=high
```

Lint, TypeScript, production build, both SEO suites and dependency compatibility
checks passed. The rendered suite executed the built worker locally: **558
pages**, unique metadata, canonical/social URLs, one H1, valid JSON-LD, no orphan
pages, nine permanent redirects and four noindex 404s. No Cloudflare deployment,
remote database access or production mutation occurred.

The build also runs the existing Play Studio and CI fallback regressions.
PDFium 2.15.1, libpdf 0.5.1, fontkit 1.1.1, pdf-lib 1.17.1, PDF.js 4.10.38 and
Tesseract 7.0.0 retain their exact locked versions; no PDF-engine or game-source
files are changed. Existing legacy Excalidraw/Radix React peer-range warnings and
non-fatal build chunking warnings remain; passing checks do not establish every
browser interaction or every malformed document has been tested.

CI now runs the compatibility check and rejects critical/high npm audit findings.
The moderate/low findings above deliberately do not fail that threshold.

To refresh evidence, retrieve both paginated alert states, run `npm ci` and
`npm audit --json`, and compare all lockfile occurrences to the advisories:

```sh
gh api --paginate 'repos/dcr6174/pdf-studio/dependabot/alerts?state=open'
gh api --paginate 'repos/dcr6174/pdf-studio/dependabot/alerts?state=fixed'
```

Advisory databases change over time. These counts describe this review snapshot,
not a promise about future scans or the deployed application's dependency state.
