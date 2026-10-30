# Arcade implementation rules
- The shared GamePreferences boundary owns device-local settings and one-tap returning play; allowlisted controls preserve existing game engines and save formats across all 100 games.
- Every arcade game is wrapped by the shared frame in `components/game-frame-core.ts` (via `GamePreferences`); add game-wide UI there instead of per game. Progress/XP/missions/daily/hall-of-fame rules live in `lib/arcade-progress.ts`, covered by `checks/verify-arcade-progress.mjs`. Why: one frame keeps 100 games consistent.
