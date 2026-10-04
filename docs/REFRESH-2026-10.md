# PDF Studio Refresh: design, usability and accessibility playbook

October 2026. This document explains the refreshed design, how the new hover animation works, what the research says, and a step-by-step plan to apply, test and improve the site.

**What I could and could not check.** I read your code, rendered the pages in a real browser (Chrome) in light and dark themes at desktop and phone widths, measured the hover animation frame by frame, and checked colour contrast with numbers. I could not run your build, lint, TypeScript or `checks/` scripts here (dependencies cannot be installed), I did not test with a screen reader or on a real phone, and I did not measure real-world speed. Steps 2 to 4 below close those gaps.

---

## 1. The refresh in one page

**Direction: calm and minimal.** Fewer boxes, fewer colours, more space. One violet accent, four quiet category hues, hairline borders instead of heavy cards, and motion only where it explains something.

| Area | Before | After |
|---|---|---|
| Home hero | Headline, long subtitle, small search box far below | Buddy, headline, subtitle, **large search box as the main action**, six one-tap tasks (Edit text, Merge, Compress, Sign, Scan, Split) |
| Tool cards | Tall boxes with a heading, text and a category label | **Compact rows**: icon tile, name, one line of text. No repeated category label; an arrow appears on hover |
| Category filter | Five separate pills | **One segmented control** whose dark pill slides to the tab you choose |
| Hover | Each card lifted on its own | **One highlight glides between items** (cards, quick tasks, menu links, related guides) |
| Colour | Several purples and blues | One token set in `app/studio-refresh.css`; light and dark both pass WCAG AA |
| Type | System font everywhere | System font for text; **Outfit Bold** (16 KB, self-hosted) for headings, matching the logo |
| Header | White bar | Slim translucent sticky bar (not sticky on phones, to save screen space) |
| Headings in cards | 57 `<h3>` inside buttons | Removed: cleaner heading list for screen-reader users, and valid HTML (a heading is not allowed inside a button) |

**Try it:** open the interactive preview, hover or press Tab across the tools, click a filter tab, open the Tools menu, switch to dark mode.

---

## 2. How the hover animation works (and how to tune it)

### What you see
Move the pointer from one tool to another. Instead of the first card switching off and the second switching on, a single soft highlight **glides** to the new card in about 0.28 seconds and settles with a gentle ease-out. As it arrives the icon tile fills with its category colour and tilts a few degrees, and a small arrow slides in. Leave the grid and the highlight fades out.

The same highlight is used in five places so the whole site feels like one system:
1. Tool cards on the home page
2. The quick-task chips under the search box
3. The links in the header Tools menu (it glides across columns)
4. Related tools on tool pages, and cards on the guides and comparison pages
5. The category filter, where it **stays** behind the chosen tab and slides when you pick another

### How it is built
- `components/spotlight.tsx` renders one decorative `<span>` (hidden from screen readers) and moves it with a CSS `transform` and `width/height`. Only transforms and opacity animate, so it stays smooth and does not cause layout shift.
- It listens for pointer movement over items (mouse and pen only) **and for keyboard focus**, so Tab moves the highlight too. Touch screens do not show it; they get a normal pressed state.
- Styles are in `app/studio-refresh.css` under "The sliding highlight".
- I measured it in Chrome: moving from the first card to the third, the highlight travelled 44, then 547, then 787, then 845 pixels at roughly 0, 50, 110 and 200 ms (fast start, soft landing). The filter pill moved from x 642 to x 1000 and resized from 100 to 121 pixels when "Convert" was chosen.

### Why this approach
Highlights that follow the pointer between menu items are a well-known pattern (used in many product navigations). It can be built with CSS anchor positioning and no JavaScript, but that is still limited to newer browsers, so I used a small measured-transform component that works everywhere. You can swap to the CSS-only version later without changing the markup.

### Tuning (one place)
In `app/studio-refresh.css`:

| Want | Change |
|---|---|
| Slower or faster glide | `--dur-hover: 280ms` (stay between 150 and 400 ms) |
| Different feel | `--ease-out: cubic-bezier(.22,1,.36,1)` |
| Stronger highlight | `.spotlight-bar` `background` and the ring in `box-shadow` |
| No icon tilt | remove `transform:rotate(-6deg) scale(1.05)` from `.tool-card[data-spot] .tool-icon` |
| Turn it off for one list | remove `<Spotlight>` and use a normal element; the cards keep a plain hover colour |

### Accessibility behaviour (built in)
- **Reduced motion:** the highlight jumps instead of gliding, the icon does not tilt, the arrow does not slide. Verified: the transition duration measured 0.00001 s.
- **Keyboard:** pressing Tab moves the highlight to the focused item. The normal 3-pixel focus ring is also drawn, so focus never depends on the highlight.
- **Windows contrast themes (forced colors):** the tinted highlight is hidden and the hovered or focused item gets a real system-colour outline.
- **No JavaScript:** cards still show a plain hover background; the selected filter tab stays dark.

---

## 3. What the research says (and what I did about it)

I searched for current guidance on accessibility, upload design, motion, performance, error writing and what people dislike about free PDF tools. Sources are listed at the end. I summarised in my own words and kept only what applies to a tool site.

### 3.1 Accessibility (WCAG 2.2)
- **Target size:** WCAG 2.2 requires pointer targets of at least 24 by 24 CSS pixels (Level AA) and recommends 44 by 44 where possible. *Done:* buttons, chips, tabs, menu links and cards are 40 to 84 pixels high; chips and the theme button are 44.
- **Focus not obscured:** a sticky header must not hide the element you tab to. *Done:* `scroll-padding-top: 88px` and a header that is not sticky on phones.
- **Focus appearance:** the focus indicator should be large and high contrast. *Done:* one 3-pixel outline with a 3-pixel offset in the accent colour (5.9:1 on light, 7.0:1 on dark).
- **Dragging movements:** anything done by dragging needs a single-click alternative. *Already true:* every upload has a button, and page reordering has move buttons. Keep this when adding features.
- **Contrast:** text 4.5:1, interface boundaries 3:1. *Done and measured:* body text 17:1 and muted text 6.2:1 on light, 16.5:1 and 8.1:1 on dark; control borders 4.1:1 and 4.8:1; category colours 5.0:1 to 13:1.
- **Windows contrast themes:** custom focus styles that rely on `box-shadow` disappear. *Done:* focus uses `outline`; the search box keeps a transparent outline that turns solid in forced colors; a `forced-colors` block restores borders.

### 3.2 File upload and drop zones
Guidance from design systems and UX writers agrees on a short list:
1. Always pair drag-and-drop with a visible "choose files" button, because drag-and-drop does not work with keyboards, screen readers or phones.
2. Say which file types and limits are accepted before the person fails.
3. Give clear drag-over feedback, then per-file progress, with an easy way to cancel or remove a file.
4. On phones, make "take a photo" and "choose files" obvious.

*Already in PDF Studio:* the button fallback, accepted types and limits in the drop zone, a Stop button, per-file removal, camera capture on Scan to PDF. *Added in this refresh:* a calmer, larger drop zone that highlights on hover and drag. *Ideas in section 6:* paste with Ctrl+V, show page count and size right after selecting.

### 3.3 Motion
- Interface motion that feels responsive is usually 100 to 500 ms: about 150 to 200 ms for small feedback, 200 to 300 ms for state changes, up to 500 ms for layout changes. Longer than 500 ms feels sluggish. Web transitions are often shorter than on mobile.
- Honour the reduced-motion setting, and prefer a gentle fade over motion for those users.
- Avoid animating everything: too much motion tires people.
*Applied:* highlight 280 ms, colour changes 200 to 250 ms, theme switch 450 ms, page-load Buddy entrance about 1.4 s once.

### 3.4 Performance (Core Web Vitals)
Targets at the 75th percentile of real visits: **LCP 2.5 s or less, INP 200 ms or less, CLS 0.1 or less.** INP replaced FID in 2024 and is often the hardest for interactive apps. *Applied:* the highlight uses transforms only (no layout shifts); the heading font is 16 KB and preloaded with `font-display: swap`; no new libraries. *To do:* measure real values in Search Console after launch (step 4).

### 3.5 Error messages
Good errors say what happened, why, how to fix it, and what happened to the person's work. *Applied earlier:* "That didn't work" panel now has the worried Buddy and a dismiss button. *To do:* review each message in `app/page.tsx` against the pattern in step 5.

### 3.6 What people dislike about free PDF tools
Across articles, forums and review sites the same complaints repeat: files uploaded to servers, watermarks on output, daily or hourly limits, sign-in walls (sometimes only after the work is done), intrusive ads, and size caps. Adobe's own free online tools, for example, ask you to sign in for most work and limit free use of premium tools (its regional FAQ pages differ, so check the current one). PDF Studio already avoids all of these; the refresh makes that visible in the first screen (the two promises under the search box) and in the comparison pages.

---

## 4. Step-by-step: apply, test and improve

### Step 1. Apply the update (15 minutes)
1. Create a branch: `git checkout -b refresh-2026-10`.
2. Copy the contents of `pdf-studio-main/` from the zip over your repository.
3. Remove old logo files if you have not already (see `docs/HOW_TO_APPLY.md`).
4. Run:
   ```sh
   npm ci
   npm run lint
   npx tsc --noEmit
   npm run generate:site-assets
   npm run verify
   npm run verify:studio
   node checks/verify-seo.mjs
   node checks/verify-homepage.mjs
   node checks/verify-navigation-install.mjs
   node checks/verify-theme.mjs
   npm run build:public
   ```
5. If a check fails, copy the error and send it to me. The most likely cause is a test that expects the old card markup (`<h3>` inside a card, or the old placeholder text).

### Step 2. Look at it yourself (20 minutes)
Run `npm run dev` and tick each item:
- [ ] Home: search box is the focus; six chips; "Pick a tool" with a sliding filter.
- [ ] Hover across the cards: one highlight glides; icon fills and tilts; arrow appears.
- [ ] Press Tab through the page: the highlight follows focus; the focus ring is always visible; the header never covers the focused item.
- [ ] Click each filter tab: the dark pill slides and the grid updates.
- [ ] Open Tools in the header: highlight glides across links and columns.
- [ ] Switch light and dark: slow fade; icons and text stay readable.
- [ ] Phone width (390 px in DevTools device mode, then a real phone): one column of cards, no sideways scroll, header scrolls away.
- [ ] Turn on "reduce motion" in your OS: the highlight jumps, nothing glides.
- [ ] A tool page (for example Compress PDF): breadcrumb, large drop zone, guide below.

### Step 3. Accessibility audit (1 to 2 hours)
1. **Automated:** install the axe DevTools extension (or run Lighthouse). Run on the home page, a tool page, Guides and a comparison page. Fix every "critical" and "serious" finding.
2. **Keyboard only:** unplug the mouse. Reach every control, open and close the Tools menu with Esc, upload with Enter on "Choose files", reorder pages with the move buttons.
3. **Screen reader:** NVDA with Firefox or Chrome on Windows (free), or VoiceOver on iPhone. Check that tool cards read as "Merge PDFs, Bring your documents together" (a button), that status changes are announced, and that the decorative highlight is ignored.
4. **Zoom and text size:** browser zoom 200 percent and 400 percent: no content lost, no sideways scrolling for text.
5. **Forced colors:** in Chrome DevTools, Rendering panel, "Emulate CSS media feature forced-colors: active". Check focus is visible and cards have borders.
6. **Contrast:** use a contrast checker on any colour you add later. Keep text at 4.5:1 and interface boundaries at 3:1.
7. **Publish a short accessibility statement** (`/accessibility`): what is supported, known gaps, a contact email.

### Step 4. Performance (1 hour)
1. Run PageSpeed Insights on `/` and `/tools/merge-pdf` for mobile. Save the numbers.
2. Targets: LCP 2.5 s or less, INP 200 ms or less, CLS 0.1 or less.
3. If INP is slow, load heavy engines (pdfium, OCR) only when a tool opens (see the guide, Part 6).
4. After launch, watch the Core Web Vitals report in Search Console for 28 days.

### Step 5. Usability test with real people (half a day)
1. Ask five people who are not technical. Give each three tasks one at a time, no help: *make this PDF smaller for email; sign this form; fix a typo in this PDF.*
2. Watch silently. Write down where they hesitate, mis-click, or ask a question.
3. Fix the top three problems, then repeat with five new people. Five users usually reveal most major problems.
4. Rewrite any error message they do not understand using this pattern: **what happened, why, what to do, what happened to your file.** Example: "This PDF is password-protected, so it cannot be opened. Use Remove a PDF password if you know the password. Your original file has not been changed."

### Step 6. Improve in this order (see the backlog)
Do the "quick wins" first, then the upload flow, then discovery, then reach. Measure after each.

---

## 5. Design system reference

### Colour tokens (light / dark)
| Token | Light | Dark | Use |
|---|---|---|---|
| `--background` | #FAF9FF | #0E0C1D | Page |
| `--card` | #FFFFFF | #161330 | Panels, search box |
| `--foreground` | #17142E | #EEEBFF | Text |
| `--muted` | #5E5B78 | #A8A4C6 | Secondary text |
| `--border` | #E6E3F2 | #2B2750 | Hairlines |
| `--border-strong` | #7A7694 | #7F7AA8 | Control borders (3:1 or better) |
| `--primary` | #5B3DF5 | #9D8CFF | Buttons, links, focus ring |
| `--soft` | #F1EEFF | #1E1A40 | Hover tint, filter track |
| `--cat-0..3` | #5B3DF5 #C2410C #0F766E #1D4ED8 | #A594FF #FDBA74 #5EEAD4 #93C5FD | Pages, Edit and sign, Convert, Privacy |

### Motion tokens
| Token | Value | Used for |
|---|---|---|
| `--dur-hover` | 280 ms | Highlight glide |
| `--ease-out` | cubic-bezier(.22,1,.36,1) | All entrances and glides |
| Colour fades | 200 to 250 ms | Icon tile, border |
| Theme switch | 450 ms | Whole-page crossfade (Buddy and the theme button are drawn live, not faded) |
| Reduced motion | about 0 ms | Everything above |

### Type scale
Headings: Outfit Bold. Hero 2.2 to 3.6 rem; page titles 1.9 to 2.6 rem; section titles 1.5 to 1.6 rem. Body 1 rem with 1.5 to 1.7 line height; descriptions 0.875 rem.

### Files changed in this refresh
- New: `app/studio-refresh.css`, `components/spotlight.tsx`, `public/fonts/Outfit-Bold-subset.woff`, `public/fonts/Outfit-OFL.txt`, `docs/REFRESH-2026-10.md`
- Edited: `app/page.tsx` (hero search, quick tasks, filter control, card markup), `components/tools-menu.tsx`, `app/tools/[slug]/page.tsx`, `app/guides/page.tsx`, `app/compare/[slug]/page.tsx`, `app/layout.tsx` (CSS import, font preload), `THIRD_PARTY_NOTICES.md`

---

## 6. Idea backlog (ranked)

**Done since this playbook was first written (4 October 2026):** better tool search, recently used, file facts, a Contact page and email, the Tools menu overlay fix, calm Buddy with theme reactions, the welcome area, a more visible circular theme switch, paste-to-open, the before/after result screen and the Prove it page. Remaining backlog starts at item 5 (keyboard help) and item 8 (honest progress).

**Quick wins (hours)**
1. **Better tool search.** Add a `keywords` list per tool so "reduce size", "shrink", "jpg", "photo", "cv", "resume", "unlock" all find the right tool. (The homepage search only matches name and description today.)
2. **Recently used tools** row above the grid (saved in the browser only).
3. **Show file facts after choosing a file:** name, pages, size, and a "Replace" button, before any options.
4. **Paste to open:** Ctrl+V a copied PDF anywhere on a tool page.
5. **Keyboard help:** press `?` for a short list of shortcuts.
6. **Accessibility statement** page and a visible "Report a problem" link on every result screen (the link exists in the footer).

**Upload and result flow (days)**
7. **Result screen:** before and after size for Compress, page count for Merge and Split, and three "what next" suggestions.
8. **Honest progress:** page-by-page progress for long jobs, with Stop.
9. **Large-file warning** before processing, based on file size and device memory.
10. **Drag-over state** on the whole drop zone with a short message ("Release to add 2 files").

**Discovery and trust (weeks)**
11. **"Prove it" panel:** a short page showing how to confirm in the browser's network tab that nothing is uploaded. It turns your main promise into something checkable.
12. **Command palette:** make Ctrl/⌘ K a true palette with recent and suggested actions.
13. **Hindi interface and guides** (translate the ten most visited pages first).
14. **Offline mode:** test and document it; claim it only after testing.

**Later**
15. CSS anchor-positioning version of the highlight (zero JavaScript) once browser support is broad.
16. Saved "recipes" (for example Compress, then Protect) for repeat jobs.
17. Optional server features (AI summary, large-file OCR, sync) as the opt-in paid tier, with the browser tools staying free.

---

## 7. Acceptance checklist (use before every release)

| Area | Pass when |
|---|---|
| Keyboard | Every control reachable and operable; focus ring always visible; Esc closes menus |
| Touch | Targets at least 44 px (never below 24); no hover-only information |
| Contrast | Text 4.5:1; borders and icons 3:1; checked in light, dark and forced-colors |
| Motion | Reduced motion removes gliding and tilting; nothing moves without a reason |
| Screen reader | Cards read as buttons with a name and description; status and errors announced |
| Zoom | 200 percent zoom and 400 percent zoom keep all content usable |
| Speed | LCP 2.5 s or less, INP 200 ms or less, CLS 0.1 or less on mobile |
| Errors | Each message says what happened, why, what to do, and what happened to the file |
| Claims | "No upload", "free", "no limits" wording matches what the code does, with exceptions stated |

---

## Sources

- WCAG 2.2 new criteria (target size, focus not obscured, focus appearance, dragging movements): Deque University, https://dequeuniversity.com/resources/wcag-2.2 ; TetraLogical, https://tetralogical.com/blog/2023/10/05/whats-new-wcag-2.2 ; Disability World, https://www.disabilityworld.org/toolkit/glossary/wcag-2-2/
- Accessible file upload and drop zones: Visa Product Design System, https://design.visa.com/patterns/file-upload/accessibility/ ; ezud, https://ezud.com/accessible-file-upload-design/ ; SaaS UI patterns, https://www.saasui.design/blog/saas-file-upload-ux-patterns ; Filestack, https://blog.filestack.com/upload-ui-components-drag-drop-progress-preview/
- Motion duration and reduced motion: University of Michigan design system, https://design-system.lib.umich.edu/visual-elements/motion ; Cantina, https://cantina.co/the-ux-of-animation/
- Core Web Vitals thresholds: corewebvitals.io, https://corewebvitals.io/core-web-vitals ; RGB.ir (checked 14 August 2026), https://rgb.ir/en/blog/core-web-vitals-thresholds-2026/
- Error message writing: UX Tigers on heuristic 9, https://uxtigers.com/post/heuristic-9-error-messages ; Ramotion, https://www.ramotion.com/blog/error-message-design/
- Forced colors and focus styles: CSSence, https://cssence.com/2024/forced-colors-mode-strategies ; Manuel Matuzović, https://matuzo.at/blog/2022/focus-outline ; Tempertemper, https://tempertemper.net/blog/windows-high-contrast-mode-and-focus-outlines
- Sliding-highlight navigation patterns: FreeFrontend (CSS anchor positioning), https://freefrontend.com/code/css-anchor-positioning-navigation-effect-2026-01-22/
- What users dislike about free PDF tools: Trishakti Tech, https://peerlist.io/triishaktitech/articles/why-pdf-merge-tools-are-more-frustrating-than-they-should-be ; Adobe Acrobat online services FAQ, https://helpx.adobe.com/document-cloud/faq/free-online-pdf.html
