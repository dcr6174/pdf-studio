# Studio Arcade puzzle expansion — 20 October 2026

## Scope

27 original browser puzzle entries, in addition to the existing ten arcade games. The screenshot is the inventory reference. These are original adaptations with progressive rounds and saved sessions, **not ports, licensed versions, or reproductions of PlaySimple apps**. They use original names, hand-written word/clue content and locally rendered vector artwork. No competitor images, code, puzzle databases or trademarks are used as product branding.

## Reference → Studio Arcade map

| Screenshot reference | Studio game | Rules / variant | Test route |
|---|---|---|---|
| Daily Themed Crossword Puzzles | Daily Desk Crossword | crossword / daily | `/lab/arcade/daily-desk-crossword` |
| Jigsaw Puzzle HD | Buddy Jigsaw | picture / jigsaw | `/lab/arcade/buddy-jigsaw` |
| Word Trip | Letter Trails | letters / trail | `/lab/arcade/letter-trails` |
| Crossword Jam | Crossword Garden | crossword / garden | `/lab/arcade/crossword-garden` |
| Word Connect Association | Word Families | groups / groups | `/lab/arcade/word-families` |
| Crossword Go | Crossword Sprint | crossword / sprint | `/lab/arcade/crossword-sprint` |
| Tile Match – Triple puzzle | Triple Tile Tea | tiles / triple | `/lab/arcade/triple-tile-tea` |
| Hexa Tap Away Puzzle | Hex Escape | hex / hex | `/lab/arcade/hex-escape` |
| Word Roll | Letter Dice | letters / dice | `/lab/arcade/letter-dice` |
| Word Search Explorer | Word Safari | search / search | `/lab/arcade/word-safari` |
| PlaySimple Cryptogram | Secret Quote | cipher / cipher | `/lab/arcade/secret-quote` |
| Crossword Explorer | Crossword Atlas | crossword / atlas | `/lab/arcade/crossword-atlas` |
| Word Tour | Word Postcards | letters / tour | `/lab/arcade/word-postcards` |
| Word Wars | Word Duel | duel / duel | `/lab/arcade/word-duel` |
| Crossword Search | Clue Hunt | search / clues | `/lab/arcade/clue-hunt` |
| Color Block Crush | Block Bloom | blocks / blocks | `/lab/arcade/block-bloom` |
| 2248 Merge World | Number River | chain / chain | `/lab/arcade/number-river` |
| Word Trek | Word Path | path / path | `/lab/arcade/word-path` |
| Word Search Solitaire | Letter Solitaire | cards / cards | `/lab/arcade/letter-solitaire` |
| Word Bliss | Quiet Words | letters / zen | `/lab/arcade/quiet-words` |
| Word Planet | Orbit Words | letters / orbit | `/lab/arcade/orbit-words` |
| Sudoku Go | Sudoku Studio | sudoku / sudoku | `/lab/arcade/sudoku-studio` |
| Solitaire Word Association | Category Cards | groups / solitaire | `/lab/arcade/category-cards` |
| Mahjong Match Empire | Mahjong Meadow | tiles / mahjong | `/lab/arcade/mahjong-meadow` |
| Offline Puzzle Master | Pocket Puzzle Mix | mix / mix | `/lab/arcade/pocket-puzzle-mix` |
| PicMerge | Picture Patchwork | picture / swap | `/lab/arcade/picture-patchwork` |
| Pawzzle | Paw Parks | queens / queens | `/lab/arcade/paw-parks` |

## Implementation boundaries

- Word-wheel titles share the letter-selection engine. Zen hides the clock; dice has a 90-second deadline; orbit requires shorter words before the full-rack words. Other wheel campaigns use themed target sets. These are related variants, not claims of 27 unrelated engines.
- Crossword variants share generated crossing grids; daily uses the UTC date, sprint has a two-minute deadline, and other campaigns progress through the curated packs.
- The expanded authored library has 54 usable letter racks, 367 word definitions, 16 category groups and 24 original quote messages. Word search and mixed crosswords draw seeded subsets from the full vocabulary. Category rounds combine four disjoint groups. Content remains finite and eventually repeats; generated rounds are not advertised as thousands of authored levels.
- Word Duel is local against an explicitly labelled deterministic computer. There are no accounts, online opponents, multiplayer service, cloud leaderboard or purchases.
- Jigsaw is a tap/drag-to-position rectangular piece puzzle; Patchwork uses picture swaps. They do not reproduce a commercial app's piece shapes, campaigns or progression.
- Pocket Puzzle Mix rotates Sudoku, hex escape and Mahjong. It is not a claim that an uncached first visit works without a network.
- New puzzle saves reconstruct the exact in-progress board, time, score and Undo history from validated moves. Version 1 round/best saves migrate; existing ten Arcade save keys and engines remain unchanged. Version 2 accepts at most 20,000 validated actions per round and bounded metadata. Saves are local, not cloud sync; browser storage can be blocked, cleared or filled. Daily boards use the current UTC date; an old daily board does not overwrite today’s puzzle.
- Puppy parks are generated with a known valid solution and accept any placement satisfying the rules; uniqueness is not asserted. Generated Sudoku removes clues only while exactly one solution remains.
- No in-game ad slot/loader; existing editorial advertising is unchanged. PDF/image functionality is outside this patch.

## Deeper campaigns

- Word Path replaces the two fixed three-word boards with generated, adjacent snake paths: 3×3, then 4×4 and 5×5. Letter Solitaire deals five to twelve shuffled word layers across three to five columns, always with a constructed legal completion.
- Word wheels accept curated bonus words. Target counts increase within the available rack vocabulary. Quiet Words stays untimed; Dice remains a timed challenge; Orbit requires short targets before full-rack targets. Daily crossword uses UTC day content, mixed variants use a broader clue pool, and Garden stays rack-based.
- Searches grow from 9×9 to 12×12 and six to twelve targets. Crosswords allow up to twelve crossing entries on a 13×13 construction area; actual crossings depend on the sampled words.
- Triple Tile Tea uses exposed column tops, a seven-slot tray, and 36–72 tiles. Stacks are constructed in solvable triple batches. Mahjong grows from 32 to 64 tiles; Hex Escape grows to an 8×8 bounding grid with a known clearing sequence.
- Jigsaw grows from nine to 36 pieces; Patchwork grows from 16 to 36. Artwork currently has four palette variants of the original scene, not a large illustration library. Puppy parks grow from 5×5 to 8×8. Sudoku retains its unique-solution check while removing more clues.
- Block Bloom goals rise from 150 to 1,650 points. Number River goals rise from 256 to 4,096. Difficulty caps deliberately; no claim of endless escalation.
- Completed rounds earn one to three stars based on hints/mistakes. A chapter label groups ten rounds, and Journey exposes the latest thirty rounds for replay. These are generated progression tracks, not hand-authored narrative campaigns. Word Duel remains a local five-turn computer match.

## Controls and layout

Every puzzle has a start screen, a one-sentence rule, visible undo/hint/restart controls and completion/retry. Pause and visibility changes stop the timer. Tiles have tap alternatives; pictures support tapping and HTML drag/drop; word search supports two endpoint taps and pointer dragging. Crossword/cipher/Sudoku support direct keyboard letters/numbers inside the play region, plus on-screen buttons. Other board buttons support Tab/Enter. Dense boards use smaller cells; action buttons target at least 44 CSS pixels. Reduced-motion styling avoids essential animation.

## Validation and limits

- Local strict TypeScript: passed for the new model, data, artwork and game interface.
- Local engine tests solve rounds for all 27 entries, check deterministic generation, Sudoku uniqueness, word placement, arrow/puppy solvability across seeds, tray loss and undo, timer loss and malformed saves.
- Actual puzzle components server-render for all 27 routes with headings, navigation, instructions, start/undo/restart and no iframe/ad embeds.
- Repository-wide lint/type checks, existing PDF/image/game regressions, production build and sitemap coverage run in CI. See PR status for the final result.
- **No physical Android/iPhone playtest, visual phone certification, browser FPS measurement or complete in-browser round claimed.** The connected browser timed out during this session. Actual gesture testing and physical-phone review remain limitations; the user explicitly authorized merging the checked changes.

## Primary references consulted

- https://playsimple.cc/ (showcase lists eight portfolio entries; screenshot supplies the 27-app scope)
- https://apps.apple.com/in/developer/playsimple-games-pte-ltd/id1189416142
- https://apps.apple.com/gb/app/solitaire-word-association/id6759447324
- https://apps.apple.com/bb/app/word-search-solitaire/id6740845687
- https://apps.apple.com/us/app/pawzzle/id6794282078

The screenshot's revenue/download estimates are not verified and are not used in product claims.
