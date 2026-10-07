# PDF Studio blog and Buddy story plan

Status: draft branch only. No merge or publication until the owner verifies.
Scope: 198 new article drafts across 66 tools, plus 20 existing articles.
Action pages remain dedicated workspaces. Blog styles, stories and explanatory copy belong only to /blog.

## Article experience
1. Breadcrumb and plain descriptive title.
2. One short answer matching the reader's problem.
3. Prominent playful action button linking directly to /tools/{canonical-slug}.
4. Four-scene Buddy walkthrough: problem, start, action, result.
5. Numbered steps using exact currently available control labels.
6. Task-specific examples, checks, tips, limitations and FAQs.
7. Relevant related guides for the same task.
8. Honest organization byline and actual modification dates.

## Visual skeleton
Lavender accents; restrained cards; high contrast; comfortable centred text column.
Desktop: narrow contents navigation alongside article text.
Mobile: single column; wrapping contents links; 44px or larger controls; no horizontal overflow.
Buddy: manually started story, pause/replay, scene buttons, permanent text captions.
Reduced motion: static scenes navigated manually; no animation.
No sound, distracting looping motion, large promotional banners or overlapping tooltips.

## Content coverage
Each tool has three drafts with different planned search intentions:
- how-to: complete the task accurately;
- practical workflow: solve a concrete real-world problem;
- troubleshooting: diagnose a specific failure or output limitation.

The current bulk drafts reuse guidance and require editorial rewriting.
Do not publish a quota of similar pages. Consolidate overlapping articles where there is no distinct useful answer.
Two printed pages are not a useful web-article target; use enough detail to complete the task without filler.

## Writing backlog for all 66 tools
- Verify current implementation and exact input requirements.
- Match instructions to the verified interface after planned UI changes.
- Assign distinct problem-focused titles to each draft.
- Replace generic workflow paragraphs with a realistic scenario.
- Add original screenshots taken from the verified version.
- Add at least one specific worked example and expected output.
- Include failure cases and route readers to an appropriate alternative tool.
- Check every factual claim, especially OCR, redaction, signatures, compression and privacy.
- Remove repetitive sections and FAQs that add no task-specific value.
- Check linked tool route, heading, metadata, canonical and sitemap.
- Record verification status; never label untested features as tested.

## Buddy storyboard production
The component skeleton uses the existing mascot and illustrative document cards.
Its four captions use article instructions, not simulated successful processing.
Later, author custom scenes per tool:
- Merge: scattered pages → add files → arrange → one document.
- Interleave: two stacks → choose order → A1/B1/A2/B2 → verify remainder.
- Compression: bulky document → quality choice → compare readable result → smaller file if achievable.
- Reader: long report → open → search/bookmarks → find the right passage.
- Blank check: empty-looking pages → scan → inspect faint content → candidate results.
- OCR: photographed text → language → recognition → selectable text with mistakes reviewed.
- Sign: unsigned form → create signature → place/resize → visual signed copy.

## Blog directory
Search and category filters; 12 initial cards; load more in groups of 12.
Keep stable crawlable article routes; directory filtering is for convenience.
Search should cover titles and summaries without downloading full article bodies.

## Release checks
Draft contents, route validation and local component checks first.
Then full application build, desktop/mobile visual review and keyboard/reduced-motion testing.
Verify screenshots and tool behavior before writing final claims.
Owner review comes before merging and publishing.

## Research sources
- https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- https://www.nngroup.com/articles/layer-cake-pattern-scanning/
- https://www.w3.org/WAI/WCAG22/Understanding/reflow.html
- https://www.ilovepdf.com/blog/how-to-merge-pdf-files
- https://smallpdf.com/blog/how-to-reduce-pdf-page-size
