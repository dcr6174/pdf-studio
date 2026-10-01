# Live navigation audit — 1 October 2026

Scope: live desktop Chrome interaction at the Workers deployment, plus source and automated checks. This is a focused navigation audit, not a claim to test every document workflow or mobile device.

| Priority | Finding | Reproduction and evidence | Fix / status |
| --- | --- | --- | --- |
| P0 | Guide page clicks do nothing | Expand Guides for every tool on the homepage, click Compress PDF files. URL remains `/`. Console: `TypeError: e is not a function` in the deployed Link chunk, with RSC prefetch setup errors. Direct opening `/tools/compress-pdf` renders the correct tool. | Replace framework Link imports with native BrowserLink anchors in public, static and owner UI. Automated link and 62-page checks pass; deployed fix still requires verification. |
| P0 | Footer Privacy link also does nothing | On the directly opened Compress page, click Privacy policy. URL remains on Compress. | Same shared link fix. Native page navigation invokes browser unload protection; download/save before leaving a workspace. |
| P1 | Clicking Tools closes the hover-opened menu | Move pointer to Tools and click. Menu stays collapsed in AX and screenshot. Source opens on pointer enter then toggles on click. | Mouse click keeps it open; touch and keyboard still toggle. Regression checks cover the actual click policy. |
| P1 | Custom domain unavailable in audit browser | `https://pdf-studio.in/` displays 502 Bad Gateway / Connection refused. | Hosting/domain issue separate from links. No DNS or hosting configuration changed. Not a claim of global unavailability. |
| Verified working | FAQ answer disclosure | On Compress page, click Is compression lossless? Answer visibly expands. | No FAQ disclosure change needed. |
| Verified working | Shared workspace My files link | Click My files on Compress page; URL changes to `/#shelf` and My files heading is visible. | Existing local workspace handlers preserved. |

Checks: source lint 0 errors / 31 warnings, TypeScript, production build, homepage SSR, 62 guide SSR/link destinations, history/landing-tool policy, browser-link attributes/events and discovery/install contracts. Real clicks on the new deployment and mobile/touch layouts remain unverified. Prior route-state tests did not catch the deployed framework Link runtime failure; this audit adds a regression check preventing reintroduction of that dependency in navigation.

Cross-page guide/About/Privacy links now use full browser navigation. Tool-menu operations still reuse the current workspace. Browser beforeunload protection warns about loaded documents/text when leaving; do not rely on browser memory as a saved backup.
