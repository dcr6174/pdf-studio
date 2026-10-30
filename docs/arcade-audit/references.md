# Competitor references — source review, 2026-10-30

No competitor gameplay was directly tested in these stages. These pages document mechanics; they do not prove usability or retention. Borrow principles, never proprietary assets/code.

- 2048: https://gabrielecirulli.github.io/2048/ — original game instructions; equal tiles merge, clear keyboard control.
- Brick breaker: https://atari.com/pages/breakout — official mechanics; paddle, serve and miss consequence.
- Chess: https://support.chess.com/en/articles/8708726-how-do-i-make-moves-in-live-chess — help; drag OR select/select alternatives.
- Reversi: https://worldothello.org/about/about-othello/othello-rules/official-rules/english — official rules; legal moves and forced passes.
- Water sort: https://happyvials.com/ — marketing/how-to; two-step source/destination, undo and restart.
- Word ladder: https://weavergame.org/how-to-play — instructions; one-letter rule, valid dictionary and rejection feedback.
- Hidden objects: https://support.arkadium.com/support/solutions/articles/44002611471--find-hidden-object-how-to-play-tips-scoring — support; target list, hints and wrong-tap feedback.
- Cricket: https://www.worldcricketchampionship.com/cricket/wcc-rivals/guides — official FAQ; distinguish automated fielding from player responsibility.

## Principles applied in stage 2
- Honest result screens (classic arcade convention): a loss against the computer now says "YOU LOSE", a draw shows a handshake, a win shows a trophy — no softened wording that hides the outcome.
- One status line, one bar (mobile casual convention): duplicate score/best/pause/help controls inside games are hidden while the shared bar is present; the live readout that matters (time left, moves, shot number) sits in the bar.
- Rules one tap away: every game's instructions are in the bar menu under "How to play", so sideways phones can drop inline instruction text.

## Asset/license record
Stage 2 adds no external art, audio, code or dependencies. New sounds (board/puzzle cues, mixer noise bursts, crowd ambience routing) are synthesized at runtime with the Web Audio API in `lib/board-audio.ts`, `lib/arcade-mixer.ts`, `lib/arcade-audio.ts` and `lib/stadium-audio.ts`. Existing SVG/canvas assets remain unchanged; a complete audit of their original provenance remains pending. No license claims are inferred from appearance.
