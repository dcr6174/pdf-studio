# Targeted Search Console 404 repair

## Evidence and scope

The owner's October 30, 2026 Search Console drilldown contains 338 URLs.
Read-only production requests found 337 returning 404 and one already fixed
308 redirect (`/tools/edit-pdf` to `/tools/add-text-and-images`).

Of the 335 colon-suffixed addresses, 317 have verified working destinations:
314 source addresses correspond to a 200 page after removing the suffix, and
three correspond to existing canonical aliases with final 200 destinations.
These 317 addresses resolve to 312 distinct unsuffixed paths before alias
normalization. A suffix pattern also appears in Vinext's streamed-icon metadata
identifiers; this match alone does not prove how Google discovered the URLs.
No malformed anchor links were found in the documents checked.

The other 18 suffixed addresses are explicitly retired games. Two more
addresses contain invalid file names ending in `þÿ`. All 20 retain genuine 404
responses and noindex metadata. They are not redirected to a generic category
or the homepage, and the retired games are not re-enabled.

## Implementation

- An exact 317-path allowlist, not a wildcard suffix redirect.
- The shared canonical resolver removes the suffix only for allowlisted paths,
  then applies existing aliases, giving a single permanent 308 hop.
- Query parameters are preserved. Encoded-colon and trailing-slash forms of
  those same addresses normalize too. GET and HEAD are supported; writes and
  API endpoints are not redirected.
- Unknown hashes, unknown routes, and extra metadata-index suffixes remain
  untouched.
- No dependencies, DNS, databases, saved games or framework code are changed.

## Verification

The helper checks cover all approved addresses, query preservation, HEAD/POST,
encoded colons, trailing slashes, and excluded paths. The built-worker HTTP
checks exercise all 317 redirects and their final destinations, all 20 excluded
404s, and the existing full sitemap SEO checks.

Production checks must verify the exported addresses again after deployment.
This repair does not claim Search Console validation has completed or guarantee
indexing. Google must recrawl; intentional 404s can legitimately remain in the
report.
