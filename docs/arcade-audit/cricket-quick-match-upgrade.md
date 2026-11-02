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
