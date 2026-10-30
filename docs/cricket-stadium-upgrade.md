# Boundary Cricket stadium upgrade

The scoring engine, match lengths, targets and existing browser save keys remain in use. Cricket now loads an original procedural Three.js stadium on demand. Players have articulated shoulder/hip/bat pivots, ball and bounce cues share the engine clock, and boundary shots receive a brief camera follow. Reduced motion or Comfort Mode disables camera follow and impact particles. The existing SVG stadium remains playable when WebGL cannot initialize or loses its context.

The compact score strip and bottom batting dock replace the large side panel. Shared arcade controls own pause, full screen, sound, Comfort Mode and restart through an opt-in event bridge. Other game families retain their existing controls. Opening batting options freezes the current delivery. A/D and the existing direction keys work; automatic footwork is enabled by default and manual footwork remains available.

Correctness fixes:
- Early/late labels derive from signed contact error, independently of shot grade.
- Wrong footwork/placement is not described as late contact when timing was good.
- The sixth ball remains in the over history, and the next over starts with an empty feed.
- The last ball is presented before the end-of-chase card; pause stops this transition.
- Muted wickets stay silent. Scores reset on a new chase.
- Fallback result elements have unique React keys.

## Validation

- `npm run verify:cricket`: 240 existing delivery scenarios; 1,200 timing outcomes and 240 3D trajectories; browserless interaction tests of the actual React screen and shared frame.
- `node checks/verify-play-studio-ui.mjs`: 58 newer game screens and the directory/Lab showcase.
- Shared progress, preferences and shortcuts checks.
- Type check of cricket and the transitive FreshGame/GamePreferences dependency graph; lint of changed source/test files.
- Production client bundle of the actual cricket screen and shared frame.

Browserless interaction tests cover mouse and A/D inputs, one swing per ball, pause/resume, the shared menu, sound toggle, batting-options pause, a full over, a finished chase, replay and WebGL fallback. They do not verify GPU rendering, audio quality, CSS layout or performance on physical phones.

## Outstanding device checks before release

The automated browser rejected a local-file preview URL. The 3D screen has not been visually approved, and no real-device frame-rate or audio measurements are claimed. Check desktop and portrait/landscape phones, score/controls fit, leg/straight/off swings, boundaries/wickets, reduced motion, pause/full screen, audio, context-loss fallback and a full two-over chase before publishing.

No external models, textures, audio recordings, team branding or competitor assets were copied.
