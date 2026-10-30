# Search Console indexing export review — October 30, 2026

The owner supplied two additional URL-level exports. These are exported
reports, not direct authenticated Search Console access. Their charts end on
October 23, before the October 30 technical SEO releases.

## Discovered — currently not indexed

All 208 exported addresses currently return HTTP 200 and HTML. Each has a
matching canonical, appears in the current sitemap, and has no noindex
directive. No missing-page, wrong-canonical or noindex blocker was found in
this set.

Do not delete these valid pages to reduce the report count. Google may need to
crawl them; eligibility does not guarantee crawling, indexing or ranking.
Content quality and actual Google-selected canonicals require separate review.
Do not treat the export's placeholder date values as evidence that Google
crawled a discovered-only URL.

## Crawled — currently not indexed

All 25 exported addresses currently return HTTP 200:

- 14 HTML pages have matching canonicals, sitemap entries and no noindex.
- 11 are support resources, not landing pages: sample/test documents, fixture
  manifests, a handwriting-font source record, the favicon and web manifest.

Those resources support downloads and application behavior. They are not
missing pages and do not need to appear as Google search results. Do not
delete them, mark them Gone, put them in the page sitemap, or redirect them to
the homepage merely to make an indexing report smaller.

## Separate permanent removals

At the owner's explicit request, the 20 previously identified invalid/retired
addresses and the corresponding 18 unsuffixed retired-game addresses use HTTP
410 Gone, not ordinary 404s. The 317 recoverable historical addresses keep
their verified 308 redirects. Unknown unrelated URLs still return 404.

Website changes cannot erase Google's historical report entries immediately.
No indexing request, temporary Search Console removal, sitemap submission or
Google-side validation is claimed by this review.
