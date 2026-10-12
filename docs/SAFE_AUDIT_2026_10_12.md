# Safe website and repository audit — 12 October 2026

## Scope and evidence boundary

Baseline: `dcr6174/pdf-studio` main commit `474725db613346837fddf8024b238f7eef474704`. The initial GitHub tree was untruncated: 974 tracked files. Before final validation, the branch was reconciled with newer main commit `98fb5b3c0b179d0f9e939609478607f17987488c`. Its page-count/object-generation repairs, workflow changes and task-first Lab work were retained in full; none overlapped the cleanup deletions. New runtime and Lab documentation references were rechecked. No `AGENTS.md` was present. The audit read the README, manifests/lockfile, Vite/vinext and Wrangler configuration, workflows, Worker entry, routes, shared controls/styles, tool registries, privacy/storage code and relevant processors/checks. Asset-reference searches covered runtime imports, dynamic registries, routes, CSS/public paths, manifests, scripts, checks and documentation. Candidate file history was retrieved before deletion.

This is a scoped audit and low-risk maintenance PR, not certification of every possible PDF. The separate Image Studio article PR #178 was open at inspection and was not merged, rewritten or included here. No production merge or deployment is authorized for this PR.

Evidence labels below:

- **Live**: observed in the existing production site in desktop Chrome, around 1360 CSS pixels wide. These observations describe the existing production site, not a deployment of the PR. Other main-branch releases occurred during the audit, so the exact production commit was not pinned for each browser step.
- **Source/SSR**: code inspection, compiled route/component rendering or CSS breakpoint checks. These are not physical-device interaction tests.
- **Engine/output**: synthetic files processed and independently reopened or raster-compared. No personal documents were used for live smoke tests.

## Findings and branch changes

| ID | Severity | Exact URL or path | Evidence | Action/status |
| --- | --- | --- | --- | --- |
| A01 | High | `README.md` | Source: about 92 KB of accumulated release notes; obsolete 56/57-tool counts, replaced-outline and first-sheet-only descriptions, old text-editor limits, and a form-merging claim contradicted current behavior. | Rewritten to current architecture, commands, 70-tool catalogue, privacy handling, deployment, directory structure and explicit limits. Dated research stays in `docs/`. |
| A02 | High | https://pdf-studio.in/tools/resize-to-a4 ; `lib/canonical-routes.ts` ; `public/sitemap.xml` | Live: historical tool URL rendered “This page could not be found.” The committed sitemap still contained `/tools/resize-to-a4` and `/guides/resize-to-a4`; current registry uses `resize-pages`. | Added the historical slug to the existing redirect policy. Real tool/guide server functions redirect to Resize pages; current canonicals and regenerated sitemap checked. Not yet deployed. |
| A03 | Medium | https://pdf-studio.in/tools/compress-pdf ; `components/compression-settings.tsx` | Source: estimate used integer `Math.round`, so a nonempty output could display `100% smaller`. Live: a same-size file displayed `0% smaller` beside equal rounded sizes. | Reuse the existing truthful result formatter: cap nonempty reductions at 99.9%, describe same-size output honestly and identify increases correctly. No compression algorithm changed. |
| A04 | Low | https://pdf-studio.in/tools/compress-pdf ; `components/merge-files.tsx` | Live: one file showed a disabled sort button and instructions to reorder files. Source: same shared file cards serve Merge, Compress, images and scans. | Hide sort/reordering instructions only for one file. Multi-file sorting, drag/keyboard ordering and Add Files remain. One/two-file SSR checks pass. |
| A05 | Low | https://pdf-studio.in/tools/rotate-pdf ; `components/rotate-workspace.tsx` ; `components/rotate-workspace.css` | Live: Clear workspace appeared in the Rotate toolbar and desktop action sidebar, with the same clearing purpose. | Hide only the toolbar duplicate at the actual desktop-sidebar breakpoint (1100px). Phone/tablet Clear, per-page rotation, ranges, undo/redo, Add Files and Save remain. CSS boundary checks include 768–1099px. |
| A06 | Low | `components/tool-action-bar.tsx` | Source/SSR: an empty action row rendered when `onReplace` was absent. | Render that row only when it has an action; preserve the existing sidebar and button callbacks. |
| A07 | Low | `app/page.tsx` | Live/source: `1 files` and spreadsheet/text inputs reported `0 pages` before any PDF existed. | Use singular/plural labels and omit a page count when there are no PDF pages yet. |
| A08 | Medium | https://pdf-studio.in/tools/pdf-reader ; `app/page.tsx` ; `components/pdf-reader.tsx` | Live: two controls said Download PDF. Source: the shared action downloads source bytes; Reader’s action downloads the assembled reading copy. They are not safely interchangeable. | Keep both functions and label them Download original PDF / Download reading copy. No Reader engine, layout or mobile export behavior changed. |
| A09 | Low | https://pdf-studio.in/tools/add-watermark ; `app/page.tsx` | Source/SSR: the lazy initial fallback had only a loading paragraph, without the task heading or the `#studio-content` target used by Skip to workspace. | Add a heading and focusable main target to the fallback. It disappears when the existing workspace loads; no loaded-tool redesign. |
| A10 | Medium | https://pdf-studio.in/tools/pdf-reader ; `app/tools/error.tsx` | Live: switching into Reader once failed to fetch `/_next/static/chunks/pdf-reader-CJ9ksOPy.js`. Try again remounted an empty workspace. A fresh page load and upload then passed rendering, search and navigation. The network/status cause was not established. | **Needs investigation.** Preserve originals before recovery; reproduce asset/version/cache behavior and consider a tool-local recovery boundary that retains workspace state. No speculative automatic reload or processor change was added. |
| A11 | Medium | `checks/verify-seo.mjs`, `checks/verify-studio.mjs`, other historical checks | Source: some legacy assertions still require article/FAQ content in action pages or use older test-module assumptions. The current architecture deliberately keeps guides separate. | Retained, not advertised as the primary acceptance suite. New maintenance checks use the production vinext image shim and current routes. Legacy-suite refresh remains separate work. |
| A12 | Medium | Mobile layouts and `components/*mobile*`, `app/responsive-layout.css` | Source/SSR: responsive checks cover 320, 360, 390, 430, 768, 820, 1024, 1099, 1100 and 1366px, plus Rotate Clear boundaries. This browser session did not expose supported viewport/device emulation; an attempted browser zoom did not change the CSS viewport. | **Real mobile geometry/touch remains unverified.** No claim that cropped desktop screenshots simulate a phone. Preserve mobile controls; test Android/iOS and screen readers before broader redesign. |
| A13 | Low | `docs/PUBLIC_HOSTING.md` | Source: introductory text still said domain activation/deployment were pending, despite the public site being reachable. | Update the introduction; account bindings/secrets/DNS still require owner-account verification. |
| A14 | Low | `.gitignore` | Source: several regression scripts create root-level `.*-check` / `.*-fixtures` outputs; ignore rules covered only selected names. | Ignore those reproducible root directories. Preserve tracked `checks/fixtures`, public samples and all stored user data. |

## UI decisions kept deliberately

The right desktop action sidebar, floating/toolbar Add Files, compact contextual settings and accessible mobile main action remain. No category colours, homepage structure, tool engines, routes with working distinct behavior, form controls, conversion modes, dependencies or saved-data behavior were removed.

Compression keeps three visible presets and a collapsed optional size limit. Merge still uses whole-file cards and preserves multiple-file sorting. Rotate still has a button under each page and optional page ranges. Reader’s distinct downloads were clarified instead of deleting a useful output. Guide content stays out of action pages.

## Deletion review

**Safe to remove — deleted in this PR:** 10 files, **1,081,498 bytes** in the baseline tree.

| File | Bytes | History and evidence |
| --- | ---: | --- |
| `public/file.svg` | 392 | Unmodified scaffold asset from `ff7524b5e59939db80788b9551e099bd10e936c3`; no current import, CSS/public URL, dynamic registry, manifest, script, test, route or documentation consumer. |
| `public/globe.svg` | 1,036 | Same original-publish history and completed reference/registry review as above. Tool icons use their registered icon components. |
| `public/window.svg` | 386 | Same original-publish history and completed reference/registry review as above. Not a worker/font/deployment asset. |
| `docs/prove-it-preview.png` | 244,677 | Historical refresh preview, added only in `ca00533d1b551e97886e12f2ba71dfa2bde26412`; no current consumer or runtime/build path. |
| `docs/welcome-preview.png` | 100,900 | Same historical refresh commit; no current consumer or runtime/build path. |
| `docs/refresh-preview-dark.png` | 111,420 | Same historical refresh commit; referenced only by obsolete README release notes, removed in the README rewrite. |
| `docs/refresh-preview-light.png` | 222,315 | Same historical refresh commit and obsolete README-only reference. |
| `docs/result-summary-preview.png` | 165,133 | Same historical refresh commit; no current consumer or runtime/build path. |
| `docs/theme-reveal-frames.png` | 178,577 | Same historical refresh commit; no current consumer or runtime/build path. |
| `docs/buddy-lighting.png` | 56,662 | Same historical refresh commit; historical proof image without a current consumer. Active v5 branding and brand sheet retained. |

This decision is not based only on absent imports. The review also checked URL/string construction, tool/brand/font registries, asset preparation/generation, public serving configuration, metadata/PWA paths, documentation references, checks/workflows and history. `docs/` is not a public runtime asset directory. All deletions are recoverable from the baseline Git commit; no user caches or stored data were deleted.

**Needs investigation — left untouched:**

| Candidate | Reason to retain |
| --- | --- |
| Older `public/brand/*-v2.*`, `*-v3.*`, `*-v4.*` and legacy icon paths | Current source mainly uses v5, but installed-app/cached metadata or external path compatibility was not established. Absence of current imports is insufficient. |
| `scripts/install-ci.*`, `install-pnpm.sh`, `pnpm-install.mjs`, `npm-install.mjs`, `run-framework.mjs`, `sites-env.*`, `connector-preview/` | Alternative installers and external execution/preview integration may be invoked by name outside the package scripts. No safe proof of abandonment. |
| Historical audit/research/TODO documents | Some statements are dated, but they contain provenance or planning and can be referenced outside the current README. Retained as dated records, not current acceptance evidence. |
| Unused-looking `components/ui/*`, CSS overrides and helpers | Optional/vendored or dynamic paths need deeper tracing; deleting based on one import scan would be unsafe. |
| Tracked-and-ignored `wrangler.public.json` | It matches the placeholder example but is the build configuration path. Changing its tracking policy needs a separate deployment review. Do not put secrets in it. |

**Keep:** `public/screenshots/fill-pdf-forms-workspace.jpg` (active FormLanding reference), `docs/brand-sheet-v5.png`, current logos/PWA/favicon/social assets, linked article examples, `public/test-fixtures`, `public/examples`, fonts and notices, PDF workers/WASM, OCR cores, vendored runtime helpers/licenses, required checks/fixtures, manifests/lockfiles, D1 schema/migrations, deployment configuration, `examples/d1` and `desktop/ENGINE_PLAN.md`. Generated assets used by routes, metadata, downloads or tests are intentional dependencies, not disposable clutter.

## Validation record

Local environment: Node 24.19.0, Python 3.12.14, Poppler 24.02.0; existing pinned dependency cache. Clean Node 22 installation and the full review suite are delegated to the PR’s existing GitHub CI, with added maintenance/sitemap coverage. CI status belongs to the PR and is not inferred from local success.

| Check | Result and limits |
| --- | --- |
| Full lint; TypeScript; targeted final lint/types | Passed. |
| Production `npm run build:public` | Passed; regenerates public fixtures, social/brand assets and sitemap. No deployment command executed. |
| `checks/verify-site-maintenance.mjs` | Passed: 75 registered tool routes and corresponding guide metadata; 148 server-rendered pages and two explicit manual-export redirects; historical Resize redirects; file controls; action row; phone/tablet Clear boundaries; truthful size labels; removed scaffold references. SSR does not exercise browser processing. |
| `checks/verify-responsive-layout.mjs` | Passed: 10 breakpoint combinations, narrow-width budget, optional sorting/single mobile action and writing inputs. CSS/SSR only; touch and physical geometry are not simulated. |
| `checks/verify-tool-navigation.mjs` | Passed: retained workspace routing, anchors, busy/unsaved guards and queued-navigation cancellation. |
| `npm run verify:compression` | Passed: JPEG/Flate/PNG handling, supported targets, retained text/links/forms, impossible targets, cancellation and duplicate-stream handling. |
| `checks/verify-form-appearance.mjs` | Passed: independent Poppler appearance comparison and explicit form-copy consent; unusual/signature field types remain outside scope. |
| `checks/verify-desktop-audit.mjs` | Passed: nested local outlines/internal destinations, Bates prefix, half-page links, EPUB blocks, workbook selections, ZIP bytes and nonempty compression percentages. |
| Generated sitemap coverage | Passed: 435 unique URLs and 73 canonical tool/guide pairs; published blog registry coverage. Source examples and article bodies unchanged. |
| Live Merge | Two two-page PDFs uploaded; four preview pages; exported PDF independently reopened with all ALPHA/BETA labels in order. |
| Live Compress | Continued the merged result into Compress; already-compact result retained four readable pages/all labels; original download remained available. |
| Live Rotate | Rotated only page one; independently reopened output rotations were `[90, 0, 0, 0]`. |
| Live Add text & images | Placed a text mark, edited it on-page, deselected and exported; independently reopened output kept both original page labels and `QA SMOKE EDIT` on two pages. |
| Live Reader | Initial tool-switch load failure recorded in A10. Fresh direct upload then displayed both pages, found ALPHA on both and navigated to page two. Not an unqualified pass for every session. |
| Standard local Worker startup/HTTP smoke | **Could not run.** `npm run start` and an explicit loopback-IP retry failed in this execution environment with `uv_interface_addresses returned Unknown system error 1`. No dependency patch or runtime shim was used to hide this limitation. Build/SSR checks passed; local Worker HTTP/browser behavior is not certified. |
| Full physical-mobile, camera, screen-reader, large/hostile PDFs and all 70 processors | **Not run.** Requires separate device/output coverage; catalogue/route checks do not prove every processor works on every input. |

## Remaining work

1. Reproduce Reader’s intermittent dynamic-file failure and recovery behavior across releases without discarding unsaved workspace state.
2. Run physical Android/iOS, tablet and screen-reader checks; verify overflow, focus, keyboard, file sharing and download behavior.
3. Refresh the legacy test suite against the current action/guide separation; keep genuine output assertions.
4. Review uncertain versioned assets/install helpers and tracked configuration only with their external consumers/deployment history established.
5. Reconcile CI workflow additions with open PR #178 when those changes are actually approved; rerun CI after any rebase/merge.
6. Merge and deploy only after explicit authorization. Production smoke tests above describe the unchanged live baseline, not the branch UI.
