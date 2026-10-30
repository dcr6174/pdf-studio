# Arcade audit and rollout

- [x] Identify /lab/arcade and count 100 active unique URLs; do not equate URL uniqueness with distinct complete gameplay.
- [x] Smoke-load all 100 games on emulated 390x844 phone with proposed screen sizing: HTTP 200, shared frame present, no page errors or horizontal overflow.
- [ ] Complete desktop/mobile start-play-outcome-restart-repeat evidence for every game; smoke tests are NOT gameplay passes.
- [ ] Classify every implementation as distinct, variant, duplicate, placeholder or broken with evidence.
- [ ] Research same-mechanic competitors; label source-reviewed versus directly played.
- [ ] Broken games and correctness PRs.
- [ ] Shared browser-filling shell, all game-family exceptions, controls and fullscreen fallback.
- [ ] Individual gameplay improvements.
- [ ] Visual/audio polish with licenses and non-audio feedback.
- [ ] Accessibility and measured performance; document real-device limitations.
- [ ] Reviewable PRs with exact played, passed, failed, untested, merged and deployed status.

## Confirmed findings
- Previous cricket and classic boards are constrained by nested catalogue-style width caps and duplicated headings/controls.
- Catalogue has 100 active unique slugs and 18 retired slugs. Distinct-complete count remains unverified.
- Snow Slalom and River Slalom share an ExpansionMotion gate mechanism with different steering damping; classify only after playtesting.
- Metro Sprint and Jungle Escape share runner machinery; differences require direct play and hazard inspection.
- GitHub Actions are blocked by account billing. Cloudflare can build independently.

## Scope
Only Arcade/game changes. Preserve document tools, Image Studio, URLs and existing local save keys. Do not stretch/clip boards to claim screen usage; adapt orientation by genre.
