# Boundary Cricket: Match Day

Route: `/lab/arcade/boundary-cricket`. This feature changes cricket only.

## Play

Match Day is the default. Choose one of eight country teams, a different opponent, 2/5/10 overs, Academy/Club/Pro and a day/night venue. These are original fictional elevens and procedural kits, not licensed squads or badges. Call heads/tails; the winning captain chooses to bat or bowl. Complete both innings, with an interval and target, then inspect both batting cards and actual shot landing maps. Quick Chase remains available from fixture setup.

Bat by tapping Leg/Straight/Off at contact, swiping left/up/right on the field, or using A/Down/D (arrows and Space also supported). Automatic footwork is the default; optional front/back and ground/loft choices pause the ball while open. The small radar uses engine ball/bounce/landing coordinates.

Bowl by touching the pitch target or selecting line and length with the keyboard, choosing pace/swing/spin, starting the run-up and releasing in the gold zone. Edge releases become no-balls; extreme lines become wides. Identical repeated deliveries become easier for the computer to read. Camera changes to the bowling end. Comfort Mode slows the timeline; shared pause/menu freezes play.

## Rules and deliberate limits

Two innings, eleven batters, ten wickets, six legal deliveries per over, odd-run/end-over strike changes, run/wicket victory margins and ties. Wides/no-balls add an extra without using a legal delivery. No-ball bat runs are credited to the batter. Free hit survives another illegal delivery and suppresses bowled/caught/LBW dismissals in this model. Chases end when the target is reached, including on extras.

This is arcade cricket: no run-outs, stumping, byes/leg-byes, manual running, reviews, injury/weather simulation, individual bowler quotas, super over, tournament, licensed roster, multiplayer or saved in-progress match. LBW is simplified; the computer chooses strokes through a deterministic difficulty model, not a full cricket AI. The 3D renderer falls back to the existing playable SVG if WebGL is unavailable. No remote models/textures are fetched.

## Verification

`npm run verify:cricket` runs the legacy quick-chase/scoring/presentation checks plus Match Day rules and actual React component workflows in Happy DOM. The new workflows complete batting-first/defending and bowling-first/chasing matches, extras/free hit, pause/resume and shared replay. These checks are not GPU, screen-reader or physical touch-device testing.

`npm run build:public` includes the cricket suite, shared game checks, TypeScript, generated asset fingerprints and production Vite build. Targeted ESLint covers changed cricket sources.

Manual release checks: desktop fixture/toss/both innings; 390×844 portrait and 844×390 landscape; reachable release button without jumping the page; tap/swipe with one committed stroke per delivery; keyboard-only line/length/release; pause during run-up; open scorecard freezes delivery; retry/restart clears fixture; both scorecards remain inspectable after closing the shared result; WebGL loss fallback; reduced motion and muted sound. Record real browser/device evidence separately.

## Design references

Only workflow ideas were used, not competitor code, art or licensed assets. Official source descriptions informed the simple captain/toss and timing/placement controls:

- EA Cricket 2007: https://www.ea.com/games/cricket/cricket-2007
- Stick Sports: https://www.sticksports.com/stick-cricket-super-league/
- Laws and playing conditions: https://lawsofcricket.lords.org/laws-and-playing-conditions
- ICC no-ball clause: https://www.icc-cricket.com/news/mens-odi-match-clause-21-no-ball

The visible rules disclose the arcade subset rather than claiming a complete MCC/ICC simulation.
