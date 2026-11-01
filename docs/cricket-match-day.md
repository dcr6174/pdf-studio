# Boundary Cricket: quick match

Route: `/lab/arcade/boundary-cricket`.

## Run

Use the repository's supported Node/npm versions, run `npm ci`, then `npm run dev`. Open the route above. `npm run build:public` creates the production build. No new dependencies, game backend, account, API keys, paid services or remote game assets are needed.

## Play

Home includes Play Now, How to Play, Rules, Records and Settings. Match setup accepts custom team names and kit colours, Easy/Medium/Hard, 1/2/5 overs, Bat First/Chase and Quick Match/Practice. The loading screen prepares the interface; the stadium reports when 3D is ready and falls back to the playable SVG if WebGL fails. Low graphics explicitly uses 2D; High enables sharper rendering/shadows.

Desktop: Left/A selects leg side; Right/D selects off side; Up/Down selects straight. Space swings. Touch/mouse: select a large direction button, then BAT at contact. Ground is safer; Loft adds boundary opportunity and catch risk. One shot is committed per delivery. Read line/length/speed and the timing meter. The tutorial includes a repeatable timing exercise. The ball animation completes before the score changes.

The computer's innings scores each legal ball through the same engine, with difficulty affecting its timing. Skip Animation accelerates presentation without changing outcomes. Both batting orders lead through an innings break/target to the result. Practice is a single batting innings excluded from match records.

## Simplified rules

6 legal deliveries per over; 10 wickets; innings stop at the over limit or all out. Valid outcomes: 0/1/2/3/4/6/wicket. Four is a grounded boundary; six clears the rope in the air. Running is automatic. Target is first score + 1 and a successful chase stops immediately. Equal scores are a tie. No wides, no-balls, byes, leg-byes, LBW, reviews, run-outs or fielding restrictions. Squads/colours are fictional, with no licensed badges or players.

The inherited engine retains helpers for the older cricket subset, but the public quick-match state machine never generates extras or LBW. Perfect timing improves placement but does not guarantee six; deterministic variation avoids random scoring on repeated clicks. The engine and rendering share ball/bounce/landing coordinates.

## State, settings and records

`lib/cricket-quick.ts` owns menu/match phases and scoring transitions. Animation clocks pause on shared pause, scorecard expansion and settings; restarting clears previous deliveries. Shared GamePreferences/GameFrame owns global pause/restart/mixer controls. An explicit `nativeResult` report lets cricket show its own result screen while shared progression still records a completed match. Other games retain the shared result dialog.

Music and SFX have separate local sliders, plus mute, reduced motion, graphics and optional vibration. Global Arcade mixer levels also apply. Original synthesized effects/music start only after a gesture; optional browser speech announces boundaries. Audio failure never affects scoring. Pause/exit/unmount stops sound.

Records are local to this browser, under `studio-cricket:records:v2`; settings use `studio-cricket:settings:v2`. Records include best score, most fours/sixes in one innings, fastest team fifty measured in legal balls, wins and 12 recent matches. Practice is excluded. Settings/records parse corrupt storage safely; storage failures are disclosed. No files, names or scores are sent to a game server.

## Verification and limits

`npm run verify:cricket`: 240 scoring scenarios, 1,200 timing checks, 240 shared 3D trajectories, all 1/2/5-over orders, all out, early chase, ties, duplicate guards, zero-safe statistics and save/record reconciliation. Actual React workflow checks in Happy DOM cover all menu screens, tutorial interaction, aim vs swing, full batting-first/chasing matches, AI skip, shared pause/settings/home/replay, mute, reload persistence and practice exclusion.

`npm run build:public` includes the cricket suite, shared game checks, TypeScript, asset generation and production build. Full ESLint and SEO checks also run. These are automated DOM/math/source checks, not physical-phone, GPU, audible sound or screen-reader verification. A connected browser could not reach local preview, and Cloudflare's branch preview URLs were disabled during development. Do not present automated tests as device performance evidence.

Manual release checklist: desktop, 390×844 portrait and 844×390 landscape; visible pitch/ball and reachable BAT button; focused keyboard direction + Space; actual audio/sliders/mute; pause during delivery and shot flight; WebGL fallback; low/high switch; reduced motion; result and recent record; restart/exit without lingering sounds. The game has no multiplayer, tournament, licensed squads, saved in-progress match or full cricket simulation.
