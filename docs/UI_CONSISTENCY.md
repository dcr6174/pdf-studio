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

Validation details: focused lint of the new theme/header/reporting policy and static pages reports 0 errors and 1 warning. Full source lint reports 28 errors and 31 warnings in analytics, workspace/editor, signature, activity and existing navigation code. Generated bundles and vendored assets are ignored, without relaxing source rules. The whole-repository lint check therefore does not pass. No dependency changes or fresh install were needed for this integration.
