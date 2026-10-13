# Studio Arcade

The isolated `/lab/arcade` directory contains ten games with direct `/lab/arcade/<slug>` routes. The catalogue is `lib/arcade-catalog.ts`; mechanics live in `lib/arcade-engine.ts`, canvas drawing in `lib/arcade-draw.ts`, and controls/storage/audio in `components/arcade-game.tsx`.

## Controls and lifecycle

- Canvas games have labelled action buttons, keyboard alternatives and touch controls. Snake accepts swipes; 2048 has swipe and direction controls. Memory, Odd One and Sliding Puzzle use native labelled grid buttons.
- Play is explicit. Escape pauses. Hiding the browser tab pauses; returning does not automatically resume. Paused games stop their animation loop. Restart replaces the current round; unfinished saved puzzles ask before replacement.
- Sound defaults to off. Only an explicit sound toggle enables short score tones. Audio uses Web Audio; failure leaves games playable.
- Best scores are local browser keys prefixed `studio-arcade:best:`. 2048 and Sliding Puzzle save boards under `studio-arcade:board:`. Storage exceptions are caught. These games do not implement an online leaderboard or transmit game state.
- Decorative motion respects reduced motion. Fast gameplay still moves while Play is active; Pause is always available. Button/canvas alternatives do not imply certification for every assistive technology.
- `isAdvertisingPage` excludes Arcade routes. PDF/image tools, engines, dependencies and upload/export flows are unchanged.

## Verification

`node checks/verify-arcade.mjs` covers all ten mechanics with reproducible seeds and positive/negative outcomes. `node checks/verify-arcade-routes.mjs` checks generated sitemap coverage and advertising policy after the production build. The standard lint, TypeScript, PDF/image regressions and production build still run in repository CI.

Check real devices separately: pointer coordinate scaling, swipes, keyboard focus after Play, Pause/Resume, hidden-tab pause, sound toggle, blocked storage, reload restoration, portrait/landscape scrolling and both website themes. Use the How to play section for each game's exact controls. No multiplayer, accounts, cloud scores, imported photos or file access are included.
