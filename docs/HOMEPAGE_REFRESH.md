# Homepage and online text editor refresh

Research/audit date: 1 October 2026. Source of truth: current repository, not screenshots inferred from old conversations.

## Concrete audit findings

| Finding | Change | Verification |
| --- | --- | --- |
| Sidebar, essentials and large catalogue repeated navigation | Compact top navigation; six initial tasks; search and categories reveal the catalogue | Server-rendered homepage regression |
| Homepage headline did not name PDF tasks | Descriptive PDF headline, explanatory copy, FAQ and guide directory | Server-rendered content and metadata checks |
| Desktop sidebar and maximum content width squeezed the PDF | Remove permanent sidebar; full-width tool workspace, contextual 290px panel | CSS/source checked; visual device check pending |
| Repeated document summaries consumed editor height | Existing-text editor has one command bar, without duplicated workspace rails | Source checked |
| Longer replacements always failed | Fit to original bounds with minimum 50% size; original-size choice; reject excessive shrinking | Actual PDFium save/reopen and bounds tests at 0/90/180/270 degrees |
| Text-edit state was lost when switching tools | Explicit Keep edits in workspace, navigation guard and explicit discard | Source checked; browser interaction pending |
| Keyboard search and browser back did not follow the same navigation | Browser history handling; dirty editor guard; focus and scroll reset | TypeScript/source; browser interaction pending |
| README said text editing was impossible, and advertised removed themes | Complete 56-tool table, current UI and editor limitations, test commands | Coverage check against tool registry |

## SEO rationale

Google recommends crawlable anchor links and server rendering/pre-rendering where practical:
- https://developers.google.com/search/docs/crawling-indexing/links-crawlable
- https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics

The initial homepage HTML contains a single H1, supported PDF task descriptions, upload limits, visible FAQs and 21 real guide links. Existing guide routes have individual canonical metadata, descriptions and breadcrumb structured data. The homepage description now mentions supported existing-text editing. We do not claim ranking results or invent FAQ/rating rich-result eligibility.

## Text-editor behavior

Supported single-line original text objects remain real PDF text. Fit mode applies a uniform transformation inside the original object bounds; it does not extend into adjacent content or reflow paragraphs. Fits below 50% size are rejected. Original-size mode retains the previous conservative bounds check. Unsupported new embedded-font glyphs still produce an explicit error.

Selecting a line keeps its editor selection after an edit/zoom render. The preview comes from edited PDF bytes, with zoom-aware raster resolution. On desktop the canvas uses available width and scrolls vertically; mobile places editing controls below the page. Text edits must be committed to the shared document to chain operations. Export alone does not commit them; the original workspace remains available.

## Remaining verification limits

Production build, TypeScript, PDFium output tests, tool regressions and server-rendered SEO checks can run here. The cloud browser rejected the local preview URL with `ERR_BLOCKED_BY_CLIENT`; no browser visual, touch-device, drag/drop or end-to-end interaction verification is claimed. Live Cloudflare/domain rollout and Google indexing are also not verified by a code push.

Latest audit integration: all 56 tools now have landing pages with an embedded workspace. Earlier validation counts above describe their original release; see AUDIT-2026-10-01.md and VALIDATION.md for the current scope.
