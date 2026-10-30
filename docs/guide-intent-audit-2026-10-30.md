# Guide intent and original examples

## Starting point and scope

PR #218 was **merged** when checked on 30 October 2026. This work starts from the latest main branch, including those technical SEO fixes and the subsequent portable dependency-download fix. No deployment, production-data change, route removal, new article route, redirect or noindex rule is part of this change.

The catalogue contains **211 articles in 70 tool families**. The accompanying `article-overlap-inventory.json` records every within-family pair before and after this batch. Its flags use exact equality of complete steps/FAQs or at least two repeated section paragraphs. Before this batch, 68 families and 204 pairs were flagged. After six targeted revisions, 66 families and 198 pairs remain flagged.

These counts are editorial triage, **not** a semantic content score, proof of plagiarism, proof of search cannibalization or a Google ranking measurement. No Search Console query, traffic, conversion or live indexing data was available. The original array remains available to the audit script so reviewers can reproduce the before/after comparison without relying on prose claims.

## What is genuinely repetitive

The repeated pattern is usually three articles per tool: a general how-to, a nominal practical example, and troubleshooting. The titles and opening sections differ, but the steps and FAQs frequently match exactly. Some practical examples describe a scenario that their shared evidence does not actually exercise.

Examples inspected manually:

| Family | Evidence of overlap or missing information gain | Editorial priority |
| --- | --- | --- |
| Selected-page extraction (`split`) | All three reused the `1,3` check although the invoice scenario requested positions `1,3-4`. General how-to, invoice example and troubleshooting reused instructions and FAQ answers. | First batch: explicit ranges, multiple output containers, counterexamples and separate acceptance checks. |
| Reverse pages (`reverse`) | All three reused “source page six becomes first”; the back-scan article described B3/B2/B1, but its evidence did not establish that pairing workflow. | First batch: short labelled stacks, a six-label mixing check and a deliberately unsuccessful repair. |
| Page labels (`numbers`, `bates`, `headers`) | Repeated tool-level setup, warnings and FAQ answers across generic, practical and troubleshooting articles. A different title alone does not demonstrate different output. | Next: verify a report with a cover excluded from numbering, stable Bates IDs and actual supported header tokens separately. |
| Forms (`create-form`, `form`, `flatten`) | Within-family triplets reuse steps/FAQs; field existence, successful filling and retaining a revisable copy are different outcomes requiring different evidence. | High consequence: test long/empty values and editable versus read-only results before expanding claims. |
| Text changes and confidentiality (`native-text`, `redact`, `metadata`, `clean`) | Within-family instructions recur. Visible appearance, text removal and metadata cleanup are not interchangeable promises. | High consequence: use exact synthetic secrets, search/extraction checks and explicit residual-data limits. Do not claim a privacy guarantee from an illustration. |
| Export families (`word`, `html`, `epub`, `xlsx`, `csv`) | Many articles share an extraction checklist and historical sample output. Topic-specific numbers, reading order or table repair are not established by reusing that output. | Separate text-reading, accessibility, numeric-import and layout-preservation intent; use distinct fixtures. |
| Merge / Alternate & Mix | Bespoke templates already provide more differentiated instructions, sample policies and first-hand context than the general template. Exact-field flags alone are insufficient to assess those rendered bodies. | Preserve useful bespoke work; do not replace it with generic templates. |

These are groups to improve, **not a consolidation proposal**. No page has been deleted or deindexed. If later query-level evidence supports consolidation, show the user each source URL, proposed destination, preserved useful material and redirect rationale before implementing it.

## Intent boundaries

- `/tools/*`: do the task on a real document. No teaching downloads or article narrative are added.
- `/guides/*`: explain controls and supported use. The split, extraction and reverse guides now direct readers to the relevant distinct worked scenarios rather than copying their complete article bodies.
- `/blog/*`: teach one specific job or diagnose a specific failure. Each revised page retains its URL, publication date, CTA and related links; only revised articles receive a new article `updated` date.

The general article template retains existing historical evidence for other tools. Only these six articles replace their older generic check with new scenario-specific evidence. Their contents navigation targets the real worked-example section, before the optional Buddy story. Animations are not relabelled as screenshots or test evidence.

## Delivered batch: six distinct jobs

| Existing article slug | Input / settings | Independently checked outcome |
| --- | --- | --- |
| `save-only-selected-pages` | Cover, Contents, Chapter 1, Chapter 2; `3-4`, One PDF | Chapter 1, Chapter 2; two pages. |
| `extract-selected-invoices-from-a-longer-pdf` | Six-page invoice batch; `2-3;5-6`, Page groups · ZIP | Two PDFs: INV-101 with receipt; INV-103 with receipt. Cover and INV-102 excluded. |
| `split-pdf-common-problems-and-how-to-fix-them` | A1, A2, A3; `3,1,3`, One PDF | A3, A1; first-encounter order with repeated positions deduplicated. |
| `how-to-reverse-the-order-of-pdf-pages` | A1, A2, A3; Reverse | A3, A2, A1. |
| `correct-a-back-page-scan-stored-in-reverse-order` | B3, B2, B1; Reverse, then Alternate & Mix with separate fronts first | B1, B2, B3, then A1, B1, A2, B2, A3, B3. |
| `reverse-pages-common-problems-and-how-to-fix-them` | A1, A3, A2; Reverse | A2, A3, A1: intentionally **not repaired**. Organize is a suggested manual correction, not a claimed checked result. |

The page-selection engine also checks empty ranges (all pages), rejected en dashes, rejected descending/out-of-bounds ranges and a blocked subset copy of a two-page fillable form. The affected split guide instructions now use an ordinary hyphen and actual visible control names.

## Evidence provenance

- New source PDFs and checked results: `public/examples/guide-intent/`.
- Machine-readable settings, actual label sequences and environment: `public/examples/guide-intent/verification.json`.
- `checks/verify-guide-examples.mjs` bundles the **actual shipped engine**, creates synthetic inputs, exports results, then uses independent Poppler `pdftotext` extraction to assert every page label and ZIP member sequence.
- `invoice-groups-browser.png` and `reverse-backs-browser.png` are **real local desktop Chromium 152.0.7977.64 completion-screen captures** from 30 October 2026, not illustrations. Both were captured after processing the corresponding fixture in the UI. They are cropped to completion/download controls, exclude the document preview, and have no pointer over the capture.
- The screenshots establish that those two local flows reached their download screens; they do not establish visual fidelity of all pages, all devices or the deployed site. Engine output inspection is recorded separately.
- `scripts/capture-guide-examples.mjs` documents the capture process. It requires a running local app and Chromium with remote debugging on port 9222; use only synthetic files. Its React hydration wait avoids selecting a file before upload handlers are attached.
- Public pages link to samples and verification settings, not repository URLs or source revision identifiers.

## Reproduce and verify

From this repository, with Node 22.13+ and Poppler installed:

```sh
npm ci
npm run verify:guide-examples
npm run lint
npx tsc --noEmit
npm run build:public
node checks/verify-review-sitemap.mjs
node checks/verify-image-guides.mjs
node checks/verify-arcade-routes.mjs
npm run verify:seo
npm run verify:seo:rendered
```

The new guide checks are wired into repository CI after Poppler setup. The rendered SEO check additionally verifies all six scenario blocks and downloadable assets, the three guide-to-article link sets, and the absence of these sample panels on action pages.

The full-site check uses the actual built Cloudflare worker locally: all 558 sitemap pages, unique titles/descriptions, self-canonicals and social URLs, one H1, parseable JSON-LD, incoming HTML links, nine permanent alias cases and four proper noindex 404 cases. These are local build assertions, not production or search-index assertions.

## Remaining decisions

This is deliberately a bounded improvement batch, not a claim that every article is now distinctive. The machine inventory identifies the remaining candidates; prioritize high-consequence content and genuinely different reproducible scenarios before adding pages. Any future consolidation requires user-visible proposals and approval. Search Console evidence is needed to distinguish actual query cannibalization from benign overlap.
