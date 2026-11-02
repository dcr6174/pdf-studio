# Existing Boundary Cricket upgrade

Scope: `/lab/arcade/boundary-cricket`. Keeps its URL, procedural stadium, stroke engine, shared Arcade frame and mixer. No PDF tool changes.

## Changes

Home/loading/setup/tutorial/rules/settings/records, innings break and custom result screens. Configurable teams and colours; 1/2/5 overs; Easy/Medium/Hard; ten wickets; bat first/chase; visible computer innings with fast-forward; practice without records. Score commits after animation; delivery tokens reject duplicate scoring. Immediate successful chases, ties, six-ball overs and finite run-rate statistics. Local browser records retain the existing best score. Shared pause/restart/home/mute remain integrated; custom results retain shared progression. Responsive portrait and landscape docks, reduced motion, vibration option and graphics levels. Original synthesized audio uses mixer buses, with separate music/crowd and effects volume. Boundary announcements are visual with synthetic celebrations; no recorded voice commentary.

Controls: A/Left selects leg, D/Right off, S/Down straight; Space/BAT swings once; Z toggles loft. Automatic footwork is enabled by default; manual front/back remains available. Running is automatic. Rules explain omitted extras, LBW, reviews and fielding restrictions.

## Evidence

| Check | Result and limit |
| --- | --- |
| Quick-match engine | Both batting orders at 1/2/5 overs, ten wickets, immediate chase, ties, duplicate rejection, finite rates, practice exclusion, fifty and record persistence; 3,000 valid AI outcomes pass. |
| Existing stroke engine | 240 delivery/shot cases and deterministic replay pass. Legacy three-wicket adapter is unchanged; the new match layer uses ten wickets. |
| Presentation math | 1,200 timing outcomes and 240 trajectory cases pass. Math coverage, not live WebGL evidence. |
| React/shared-frame interaction | Happy DOM: tutorial, direction selection, single swing, delayed scoring, paused clock, settings, complete matches in both batting orders, restart, home, mute, records and fallback pass. |
| Arcade regression | `npm run verify:play-studio` passes, including classic interactions and other game engines. Source assertions now reflect the new cricket controls and direct mixer cues. |
| Shared protocol/progression | Progress, session, arcade, improvements and device-layout checks pass. Unrelated watermark verification cannot run locally: source-only checkout lacks `public/fonts/NotoSans-Regular.ttf`. |
| Types/lint | TypeScript and targeted changed-source ESLint pass. |
| Browser responsive inspection | Actual FreshGame/GamePreferences preview inspected at desktop 1363×936 and embedded 390×844 portrait / 844×390 landscape / 768×1024 tablet viewports. Home, setup, live scoreboard and reachable batting controls inspected. Browser selects 2D fallback. |
| Client bundle | Actual game-components Vite build passes; >500 KB shared-game chunk warning remains. |

## Untested

Physical iOS/Android touch/vibration; audible speaker/headphone quality; low-end-phone frame rate; live WebGL/context loss; screen-reader operation; 200–400% browser zoom; production deployment. Browser layout inspection and simulated-DOM full matches are distinct evidence. No WCAG certification is claimed. Full public production build was not completed locally because this checkout lacks binary public assets; repository CI remains the production-build gate.

CI evidence: commit `b04b8928795e90b58b2fac92bdb7e1165ff030d2` passed Cloudflare Workers Builds and the Lab watermark workflow, including `npm run build:public`. Repository-wide lint and TypeScript also passed. The CI test harness now waits for the actual home screen rather than assuming a fixed stadium-load duration.

## Combined PR 230/233 follow-up

The retained UI, manual/automatic footwork, original best-score import and shared progression are from #233. Computer batting now uses #230's seeded timing approach against the actual delivery and the existing `evaluateStroke` collision/placement engine. Fast-forward changes presentation only; it cannot reroll a result. Legal scoring, ten wickets, both batting orders, practice exclusion and delayed/duplicate-safe scoring remain unchanged.

Spoken boundary cues are opt-in and saved with cricket settings. They announce only “Four!”/“Six!” with an English device voice where available. Web Speech cannot connect to Web Audio buses: its utterance volume explicitly mirrors the shared master/effects gains and it cancels on mixer changes, game mute, pause, settings/exit and unmount. No remote voice is selected. Visual and synthesized cues remain available when device speech is unavailable.

Fixed the duplicate primary-heading regression: the enclosing FreshGame keeps the page H1, and cricket screens use focusable section headings with corresponding visual selectors.

Local follow-up validation: all `verify:play-studio` checks pass, including the actual React/shared-frame full-match harness. Three thousand seeded AI cases verify legal/finite outcomes, displayed-delivery alignment, deterministic results across repeated evaluation and improved timing at higher difficulty. Speech tests verify text, volume, queue cancellation, device/language restriction and failure fallback. TypeScript and targeted zero-warning lint pass. These speech tests simulate the browser API and do not establish audible quality.

The isolated actual-component client bundle builds. The connected browser could not reach its localhost server (connection refused); new pre-merge visual/device checks remain unverified. The production CI and rendered SEO checks are the merge gates. Physical-phone, live GPU and audible speaker/headphone checks remain separate from automated evidence.
