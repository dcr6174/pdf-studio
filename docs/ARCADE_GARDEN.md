# Buddy’s Paper Garden — Arcade only

An optional daily check-in shared by all 60 Arcade games and the Arcade directory. PDF tools, their headers, document processing and results are not integrated with this feature.

## Where to try it

Open `/lab/arcade` and choose **Buddy’s Garden**, or use **Buddy’s Garden** in a game’s existing navigation row. Opening the garden pauses the current game; closing it preserves the board and leaves the game paused for explicit resumption. There are no automatic popups or floating overlays over gameplay.

Fold a three-step paper flower, or choose **Quick grow & collect** for exactly the same reward. Both paths plant a flower and grant guaranteed XP/Stars plus a random bonus. Cosmetic rewards do not alter game scores or difficulty. Collection lets you buy a specific cosmetic with earned Stars or use a milestone choice. There are no payments, ads, paid rerolls or cash-equivalent rewards.

## Progression

One claim per UTC date across the entire Arcade, using the device clock. The interface displays the next refresh in local time. Missed days do not reset progress or multipliers. A chapter is 30 completed visits, not a calendar month. XP, Stars, cosmetics and total visits remain across chapters. Visit 30 also grants a guaranteed garden trophy (a duplicate converts to 15 Stars). A new chapter starts on claim 31. The latest 30 completed garden scenes can be revisited; total creations and the full cosmetic collection remain.

Visits 1–7 use multipliers 1, 1.1, 1.25, 1.35, 1.5, 1.75, 2. Later bands and milestones are defined in `lib/arcade-garden.ts`. Base reward: rounded `20 × multiplier` XP and rounded `10 × multiplier` Stars. Visits 7, 14, 21, 28 and 30 add 50, 75, 100, 125 and 200 Stars. Visits 3, 7, 14, 21, 28 and 30 grant a choice of any unowned cosmetic, including rare ones. If the collection is complete, exchange a choice for 50 Stars.

Ordinary random bonus: 60% five Stars, 25% ten Stars, 12% common cosmetic, 3% rare cosmetic. After nine claims without a cosmetic, the tenth guarantees a cosmetic: 97% common / 3% rare. Cosmetic duplicates become 15 Stars. All rules are visible in **How it works**. Sound starts off. Optional short reward audio and flower growth respect user choice/reduced-motion settings.

## Storage and boundaries

`studio-arcade-garden-v1` is a separate IndexedDB database. A single read/write transaction reads the latest state, checks the day, generates/stores the reward, advances progress and commits. Success is shown only after transaction completion. This serializes claims and purchases across tabs. Blocked/full/invalid storage fails visibly without inventing a saved reward. Existing Arcade and PDF saves are not read or overwritten.

This is a local cosmetic prototype, not an account-backed economy. Clearing browser site data removes progress. Different browsers/devices do not sync. Device-clock changes are not cheat-proof; dates earlier than the last claim cannot claim again. Nothing of monetary value is attached to this local state. No document bytes, filenames or document events enter the garden.

The same implementation is used by all game families. Styles are imported only by Arcade routes and scoped to `.arcade-shell` or `.buddy-garden`. The panel is lazy-loaded on request, uses a native modal dialog, restores focus, and supports Escape/Close/Done. Fold interaction has large buttons and no timer or required dragging.

## Validation

`node checks/verify-arcade-garden.mjs` covers daily limits, rollback, missed days, milestones, RNG boundaries, guarantees, duplicates, purchase budgets, chapter transitions, saved-state validation and Arcade-only integration. Existing Arcade SSR suites render the shared trigger on every game. Full repository CI includes lint, TypeScript, PDF/image output regressions, Arcade engines and the production build.

Browser smoke: claim in one game; open another game/directory and confirm the same balance with no second claim; reload to confirm persistence; open two tabs and attempt a same-date claim; inspect collection, journey, both themes, modal scrolling, pause/resume and focus. Real phones, screen-reader software and cross-device sync are not certified by source/engine tests.

## Removal

Remove the `ArcadeGarden` import/render from `components/arcade-directory.tsx`, `components/arcade-game.tsx`, `components/puzzle-game.tsx`, and `components/club-game.tsx`; remove the garden stylesheet import from the two Arcade route files. No PDF tool or processing changes are needed. Leave the IndexedDB database intact so a later re-enable preserves the local collection. Do not automatically delete user progress.
