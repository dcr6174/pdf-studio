# Arcade review implementation — 21 October 2026

This is an incremental fix batch, not a declaration that all 60 review requests are complete. No games are added or removed. Existing PDF/image routes and dependencies are untouched.

## Shared changes

Compact directory hero; continue-playing shortcuts; eight curated favourites; daily crossword shortcut; intent filters alongside genres. Optional help collapses in club games. Desktop playfields use viewport bounds; unused recommendations panel is hidden. Recent route history is optional and isolated from existing saves.

## Per-game status

| # | Game | Status in this batch |
|---|---|---|
| 1 | Buddy Stack | Perfect-drop streak and early/late alignment feedback; milestone message. |
| 2 | Paper Toss | Swipe/button labels and last-miss marker with direction advice. |
| 3 | Merge 2048 | Distinct tile colours and next tile milestone. |
| 4 | Bubble Pop | Thirty-shot limit; designed levels and bank guide remain. |
| 5 | Snake Sprint | Gentle/classic/fast and wall-wrap choices; daily mode remains. |
| 6 | Memory Match | 6/8/12-pair decks; themes remain. |
| 7 | Neon Brick Breaker | Pending: One brick layout will wear thin. Add stages, brick types and occasional power-ups. |
| 8 | Tap the Odd One | Pending: Good quick-break material. Progress through genuinely harder visual distinctions, with accessible alternatives. |
| 9 | Sliding Puzzle | New sessions start 3×3; optional 4×4; both save formats restore. Dedicated records remain. |
| 10 | Buddy Runner | Gentler first ten seconds and visible 1000-distance goal; patterns remain. |
| 11 | Daily Desk Crossword | Pending: A potential daily habit. Prioritize clue quality, explain the reset time locally and provide an archive. |
| 12 | Buddy Jigsaw | Number assistance follows optional picture reference; natural interaction remains. |
| 13 | Letter Trails | Circular wheel with pointer tracing and retained tap/keyboard controls. |
| 14 | Crossword Garden | Pending: Needs its own purpose. Make it the gentle teaching mode, with thematic clues and gradual assistance. |
| 15 | Word Families | Pending: Promote. Strong social puzzle potential. Invest in unambiguous categories and explain connections after completion. |
| 16 | Crossword Sprint | Pending: A timer alone is a thin distinction. Build short, deliberately timed boards with quick keyboard navigation. |
| 17 | Triple Tile Tea | Stronger covered-tile differentiation; tray danger preview remains. |
| 18 | Hex Escape | Pending: Promote. Clear spatial reasoning potential. Animate blocked paths and make direction legible without relying on colour. |
| 19 | Letter Dice | Pending: Currently closer to a timed rack game than conventional adjacent-letter dice play. Clarify the rule or add adjacency. |
| 20 | Word Safari | Pending: Familiar but serviceable. Add themed grids, strong drag feedback and adjustable word directions. |
| 21 | Secret Quote | Pending: Needs richer content. Use memorable original quotes and explain repeated-letter deduction through a tiny tutorial. |
| 22 | Crossword Atlas | Pending: “Travel” needs progression beyond naming. Give destinations distinct themes, achievements and board structures. |
| 23 | Word Postcards | Pending: Scenery alone is not enough. Make completed postcards collectible and tie vocabulary to their destinations. |
| 24 | Word Duel | Seeded variation across three best remaining replies; difficulty remains. |
| 25 | Clue Hunt | Pending: A useful twist on word search. Reveal clues progressively and reward solving without exposing the answer. |
| 26 | Block Bloom | Pending: Promote. Strong repeat-play foundation. Add drag placement, placement previews and satisfying simultaneous clears. |
| 27 | Number River | Merged-value preview in selected-chain output. |
| 28 | Word Path | Backtracking retains touched endpoint; visible connector trace remains. |
| 29 | Letter Solitaire | Pending: Rules need demonstration. Animate one example showing how removing top cards exposes useful letters. |
| 30 | Quiet Words | Hints preserve score and stars. |
| 31 | Orbit Words | Full-length word banks immediately. |
| 32 | Sudoku Studio | Naked-single explanation instead of revealing an arbitrary answer; grading remains. |
| 33 | Category Cards | Pending: Distinguish it clearly from Word Families. Emphasize uncovering cards and planning, not just category matching. |
| 34 | Mahjong Meadow | Pending: Flat mirrored rows weaken discovery. Introduce thoughtfully layered layouts and unmistakable free-tile states. |
| 35 | Pocket Puzzle Mix | Pending: Better as a daily playlist than another standalone game. Give it one shared completion goal. |
| 36 | Picture Patchwork | Optional numbered assistance and existing reference peek; artwork remains. |
| 37 | Paw Parks | Separate row, column, park and touching conflict reasons. |
| 38 | Rooftop Hoops | Percentage power, trajectory guide and miss-direction advice. |
| 39 | Pocket Mini Golf | Trajectory guide and fewer-strokes record; course/par redesign remains. |
| 40 | Lavender Chess | Relaxed/standard AI and move history; coordinates/explanations remain. |
| 41 | Crown Checkers | Visible compulsory-capture guidance and relaxed opponent; chain animation remains. |
| 42 | Buddy Pachisi Race | Pending: Overlaps with Ludo and uses custom rules. Present it prominently as a quick two-player race variant. |
| 43 | Four in Orbit | Relaxed/standard/strategic bounded alpha-beta opponent; win animation remains. |
| 44 | Moon Disc Reversi | Relaxed/standard/strategic bounded alpha-beta opponent; existing forced-pass message retained. |
| 45 | Dot District | Pending: Strategic potential, weak drama without feedback. Highlight dangerous third edges and animate claimed chains. |
| 46 | Paper Fleet | Ship-sunk versus hit feedback; manual placement remains. |
| 47 | Seed & Stone | Visible sow-direction and extra-turn explanation; movement animation remains. |
| 48 | Peg Garden | Select and explain a legal jump; alternative layouts/deeper coaching remain. |
| 49 | Neon Air Hockey | Pending: Success depends on feel. Prioritize responsive paddle movement, readable puck trails and fair goalie difficulty. |
| 50 | Bullseye 301 | Target score and visit total; detailed checkout combinations remain. |
| 51 | Pixel Picnic | Pending: Promote. Unique-solution checking is valuable. Add larger boards, clue completion feedback and recognizable finished pictures. |
| 52 | Buddy Ludo | Pending: Familiar expectations are high. Keep rule differences visible, animate movement clearly and show every legal runner after a roll. |
| 53 | Snakes & Ladders | Pending: Mostly luck, so presentation must carry it. Add fast turns, cheerful movement and a family-friendly local mode. |
| 54 | Domino Dock | Draw/pass explanation and enabled legal-end buttons; visual end preview remains. |
| 55 | Dice Delight | Existing score previews retained; zero-score selection requires a second confirmation tap. |
| 56 | Pocket Mines | Remaining-mine count; difficulty/chording remain. |
| 57 | Rhythm Recall | Pending: It needs a musical identity. Offer distinct tones per pad and a clear accessible visual-only mode. |
| 58 | Buddy Burrows | Hit streak and decoy resets; duration choices remain. |
| 59 | Crate Escape | Push count, moves and non-goal corner warnings; records/progression remain. |
| 60 | Disc Drop Plinko | Visible pocket reward/risk explanation; optional challenge remains. |

## Validation

Local strict TypeScript for all three game families; existing ten-game mechanics/collision checks; 27 puzzle engine and SSR checks; 23 club engine and SSR checks; 60 unique emblems and Arcade CSS scoping. Added regressions cover 3×3/4×4 restoration, larger matching decks, wrap-edge fruit, strategic legal/winning moves, Quiet Words hint penalties, Orbit word acceptance and path backtracking. Full repository lint/typecheck/build and PDF/image checks run in PR CI. Physical phones and FPS are not certified. Browser interaction checks are recorded separately after deployment.

## Remaining work

Every item marked pending, and the remaining portion of each partial item, stays open. Important larger work: designed levels, broader word vocabulary/themes, manual fleet placement, layered Mahjong, larger Nonograms, unified result records and new artwork. These require individual mechanics and interaction verification; the shared layout alone does not resolve them.
