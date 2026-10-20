# Studio Arcade: sixty games — 20 October 2026

60 catalogue routes: ten existing action games, 27 existing word/puzzle variants, and 23 new sports/board/logic games. Every title has its own original vector emblem in the catalogue and game heading. No competitor assets, commercial app code or proprietary puzzle databases are used.

## New games

All routes below begin `https://pdf-studio.in/lab/arcade/`.

| Game | Route suffix | Play and scope |
|---|---|---|
| Rooftop Hoops | `rooftop-hoops` | Projectile basketball, rim/backboard collisions, ten shots, drag or angle/power controls |
| Pocket Mini Golf | `pocket-mini-golf` | Twelve course layouts, wall banking, friction, speed-limited cup capture, stroke count |
| Lavender Chess | `lavender-chess` | Legal chess including castling/en passant/promotion, mate and draws; casual computer or local opponent |
| Crown Checkers | `crown-checkers` | English-style compulsory forward captures, multi-jumps, short kings and turn-ending promotion; 160-move draw cap |
| Buddy Pachisi Race | `buddy-pachisi` | Custom two-colour dice race with four runners per side; six to enter and exact finish; not traditional Pachisi |
| Four in Orbit | `four-in-orbit` | Gravity-based connect-four, computer blocks immediate threats, local multiplayer |
| Moon Disc Reversi | `moon-disc-reversi` | Eight-direction captures, legal hints, automatic passes and final disc counting |
| Dot District | `dot-district` | Sixteen boxes, edge claiming, extra turns for completed boxes |
| Paper Fleet | `paper-fleet` | Two seeded 8×8 fleets of lengths 4/3/3/2; ships do not touch; computer hunts around hits |
| Seed & Stone | `seed-and-stone` | Six-pit mancala, own-store extra turn, opposite capture and final sweep |
| Peg Garden | `peg-garden` | 33-space peg solitaire, orthogonal jumps, unlimited turn undo; centre finish distinguished |
| Neon Air Hockey | `neon-air-hockey` | Puck/paddle physics, computer goalie, first to seven, drag and keyboard controls |
| Bullseye 301 | `bullseye-301` | Three-dart visits, segmented board, treble/double/bulls, bust recovery, straight-out checkout |
| Pixel Picnic | `pixel-picnic` | Generated 5×5 nonograms independently checked for a unique solution |
| Buddy Ludo | `buddy-ludo` | Four-colour race, three computer seats or local hotseat; six/capture/home extra turns, three-sixes forfeit; no stack blocking |
| Snakes & Ladders | `snakes-and-ladders` | Numbered 100-square board with visible snakes/ladders and exact finish |
| Domino Dock | `domino-dock` | Double-six draw dominoes, both open ends, stock/pass handling and blocked-game pip result |
| Dice Delight | `dice-delight` | Five dice, three rolls, hold controls, thirteen categories and upper-section bonus; no joker or extra five-kind bonus |
| Pocket Mines | `pocket-mines` | 8×8 ten-mine fields, first reveal plus neighbours safe, flood reveal, flag mode and win/loss |
| Rhythm Recall | `rhythm-recall` | Twenty growing four-pad sequences, numbered keyboard alternatives and pause-safe replay |
| Buddy Burrows | `buddy-burrows` | Sixty active seconds, changing burrows, distinct decoys and duplicate-tap protection |
| Crate Escape | `crate-escape` | Generated 6×6 two-crate push puzzles with a known reversible construction and independently tested solutions |
| Disc Drop Plinko | `disc-drop-plinko` | Ten free discs, pin collisions, lane selection and score pockets; no money, wagers or prizes |

## Presentation

The directory and all sixty game workspaces use available desktop width. Action and board games have a playfield plus a consistent control/help column; existing word puzzles gain larger boards and adjacent controls at desktop breakpoints. Boards preserve their aspect ratio and readable maximum sizes rather than distorting pieces across a widescreen display. On small screens, controls stack and content scrolls normally; pointer gestures stay inside their playfields. All new selectors are scoped to `.arcade-shell`.

Every catalogue entry and game header uses a specific SVG drawing. The icon component intentionally has no generic family fallback; its rendering regression verifies sixty distinct SVG outputs. Existing ten game engines and the 27 puzzle engines/save keys remain unchanged.

## State and limits

New games use `studio-club:v1:<slug>` browser saves, with typed, bounded state and Undo-snapshot validation. Storage failure does not prevent play. Mode can be changed before a game or while paused, starting a new match. No accounts, remote opponents, paid prizes or cloud saves. Computers are casual heuristic opponents, not rated engines. Shared-screen fleet play cannot keep ships private from another person looking at the screen; use the computer for hidden-fleet play.

Realtime games use capped, time-based substeps; pause/hidden tabs stop their work and reset frame timing on resume. SVG rendering stays sharp without forcing a 4K canvas. No mobile FPS number or real-device compatibility claim is made.

Golf has twelve layouts; other rounds are bounded or seed-generated. No claim of thousands of authored levels. Mines may require a guess; only nonograms assert solution uniqueness. Crate puzzles are deliberately small. Undo retains forty moves in the new games and removes the computer reply when returning to the human turn.

## Dependency and attribution

Chess rules use `chess.js` **1.4.0**, pinned with its registry integrity in the lockfile. No other dependency versions were changed. The BSD-2-Clause notice is distributed at `/licenses/chess-js.txt`. Official source: https://github.com/jhlywa/chess.js . All other new game rules, physics, interfaces and drawings are implemented in this repository.

## Verification

- New model, game UI and catalogue pass strict TypeScript locally.
- Pure-engine tests complete matches for the new turn-based families; exercise mate, castling, en passant, compulsory capture chains, crowning, extra turns, blocked dominoes, dice scoring and first-click mine safety.
- Independent searches check generated crate solvability and nonogram uniqueness across seeds; sports checks use real integrated trajectories, ball settlement, cup capture, goal scoring and finite plinko completion.
- All 23 actual React screens render with explicit start, navigation, instructions and no ad embeds; all sixty emblems differ; all new CSS remains scoped to Arcade.
- Existing 27 puzzle regressions continue to pass locally. Repository CI runs the existing ten game checks, full PDF/image regressions, lint, TypeScript, production builds and sixty-route sitemap coverage.
- Browser visual/gesture checks and production status are recorded in the delivery PR. Local engine/SSR tests are not physical Android/iPhone testing.
