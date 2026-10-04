# UI consistency pass (1 October 2026)

Changed
- Appearance dropdown replaced by one light/dark button (`components/theme-toggle.tsx`) in the header. Follows the device until a side is chosen; the choice is stored locally under the same key as before. A tiny script in `app/layout.tsx` applies the theme before first paint.
- Header: logo, Tools, My files on the left; Install and theme button on the right. The "Files stay on your device" badge and the header Privacy button were removed (same message is in the hero and footer).
- Home: removed the duplicate category cards (the filter pills now show the counts), the two all-caps eyebrow labels, the repeated "no account" sentence, and the second "free" FAQ entry (merged into "How is this free?").
- Tool guide list stays in the page for search engines but is folded into a closed <details>.
- Footer: one row. Brand on the left; Report a problem, Privacy settings, Privacy policy, About on the right. Install moved to the header only.
- Privacy and About pages use the shared `SiteHeader` instead of a bare logo link.
- CSS: dead rules for the dropdown, category cards and header badge deleted. New "Consistency layer" block at the end of `app/studio-brand.css` is the single place that decides header, filters, tool cards, labels and footer. Edit that block, not the older layers.

Integrated and checked in the project environment: TypeScript, production build, homepage, navigation/install, 62 SEO landing pages, owner boundary and theme bootstrap cases. Generated-check bundles and vendored PDF workers are excluded from lint; repository-wide source lint findings are reported separately. Live phone/desktop visuals and button interaction remain unverified because the cloud browser blocks local preview.

Validation details: focused lint of the new theme/header/reporting policy and static pages reports 0 errors and 1 warning. The follow-up fix resolves all 28 source errors in analytics, workspace/editor, signature, activity and navigation code. Full source lint now passes with 0 errors and 31 warnings. Generated bundles and vendored assets are ignored, without relaxing source rules. TypeScript and regression checks for PDF processing, text editing, signatures, history, analytics and access controls pass. No dependency changes or fresh install were needed for this integration.

## Lint fixes — 2026-10-01

Internal navigation uses Next Link. Workspace undo/redo availability and native text history counts use React state rather than reading refs during render. File operations read the current workspace snapshot without a second mutable file ref. Effect initialization is deferred with lifecycle guards; typed signatures are generated in the input handler. The owner dashboard captures its saved theme before persisting the default. Source lint rules remain enabled. Production build passes; actual browser/mobile interactions remain unverified.

## Pass 2 (tool pages)

Bugs fixed
- Clicking "Go to …" (or the skip link) on a tool page switched the page to the home screen. Cause: the back/forward handler treated any hash, including `#studio-content`, as "go home". It now ignores hashes that are not a view, and an empty hash on `/tools/...` returns to that page's tool.
- Every tool page inherited the article styles for `.seo-page` (underlined purple header links, article margins on headings, flex on all navs). The tool page wrapper is now `.tool-page`; `.seo-page` is only used by Privacy and About.
- The guide text rendered after the footer. It is now passed into the studio (`guide` prop) and appears above the footer, only while its own tool is open.
- A second breadcrumb sat above the site header. Each tool heading now has one breadcrumb (All tools / group / tool) that replaces the old back link and group label.

Cleanups
- Guide: removed the Troubleshooting paragraph that repeated "What to check before sharing"; related tools favour popular tools; headings use one scale; FAQ uses the same divider style as the homepage.
- Homepage FAQ: limits table moved below the questions; "Guides for every tool" shows its disclosure arrow again.
- Footer spans the content width so its edges line up with the page; Privacy and About get the same footer.
- Option fields on empty tool screens use the same width as the note and drop zone.

### Pass 2 validation in the project environment

The ZIP integrity check passed and all seven patch files applied without conflicts. Integrated the patch into the current source, keeping the prior lint fixes. New internal links use Next Link; popular-related IDs match the actual tool registry. Lint: 0 errors, 32 warnings. TypeScript and production build pass. All 62 SEO SSR pages have one breadcrumb, the tool-specific wrapper and guide content before the footer. Added `checks/verify-tool-navigation.mjs` to run the actual history handler with anchor, empty-fragment, tool/shelf/home and busy/dirty-text cases. Homepage, discovery/install, PDF processing, text export, signatures, analytics, owner boundary and theme checks pass. Browser screenshots, focus/scroll and phone/tablet controls were not verified. No dependency changes or fresh install were required. GitHub publication only; Cloudflare production status is not verified.

## Refresh (October 2026)
Superseded look: see `docs/REFRESH-2026-10.md`. The "Consistency layer" and later blocks in `app/studio-brand.css` still apply, but `app/studio-refresh.css` loads last and wins on colours, cards, filters, search, header and motion.
