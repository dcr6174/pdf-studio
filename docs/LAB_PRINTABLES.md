# Six creative print tools

The existing Lab layout is retained. Six working tools join its Fun & Play cards:

| Route | Input | Output |
| --- | --- | --- |
| `/lab/mini-zine-maker` | Eight images, or eight consecutive PDF pages | A single landscape sheet with eight imposed panels, optional fold guides and a centre slit |
| `/lab/photo-booth-strips` | Four reorderable photos | Two matching 50 × 190 mm strips on A4 or Letter, with caption, frame style, monochrome option and cut marks |
| `/lab/custom-bingo` | At least 24 unique entries with a free centre, or 25 without it | 1–40 distinct seeded 5 × 5 cards, title and accent colour |
| `/lab/giant-poster` | One image | A labelled row/column tile set at a chosen physical width, with overlap and printer margins |
| `/lab/photo-coloring-page` | One photo | Black-and-white edge outlines with detail, smoothing and line-weight controls |
| `/lab/printable-flashcards` | User-written questions/answers, optionally selected PDF passages | Six cards per sheet with aligned question/answer sides for long- or short-edge duplex printing |

## Preview and downloads

All tools use local browser canvases. The same pixels shown in the preview are embedded in the PDF; these exports are image-based, with no selectable text, original links or editable forms. Current-sheet PNG export is also available. A4 and Letter are supported. Images are normalized to at most 1,800 pixels on their longest edge; print sheets use four pixels per millimetre (approximately 102 dpi). This is a bounded browser-memory tradeoff, not a claim of press-quality or vector text output. Large posters can look soft; source quality matters.

Settings changes invalidate download until a new preview is generated. Failed generation and rejected uploads retain earlier work. Cancelling jobs prevents committing partial results. Controls disable during active operations. Decorative spinners respect reduced motion. Mobile uses Design/Preview panels with shared download actions. The page warns before leaving unsaved work; there is no automatic persistence.

No image, imported PDF text or question is sent to a generation service. Example artwork is generated locally. Imported PDF pages are rendered by the existing `pdf-client` wrapper. PDF extraction reads selectable text; scans require OCR first. Passage selection makes an answer with a page reference; users write and verify the question. This is not AI answer generation. Coloring is a smoothed edge filter rather than subject-aware illustration generation.

## Print guidance

Use Actual size / 100%. Zines are single-sided, landscape. Flashcards are portrait and double-sided with the chosen flip edge; test the first pair because printer feed and alignment differ. Poster sheets are portrait; arrange by row/column labels and use overlapping image areas to align the tiles. No tool assumes a borderless printer.

## Validation

Run `node checks/verify-printables.mjs` with the existing TypeScript, pdf-lib, @napi-rs/canvas dependencies and Poppler installed. It generates and reopens real PDFs for all six tools, independently rasterizes their first pages, and verifies dimensions, page counts, seeded bingo uniqueness, zine orientation, duplex mapping, poster coverage/overlap, coloring pixels, rejected settings, cancellation and partial flashcard sheets.

Run the repository's normal lint, TypeScript and production-build checks before merging. Browser checks should cover image uploads, PDF imports, selection-to-answer, image reordering, stale previews, each paper size, downloads and mobile panel switching. Physical folding, cutting, printer alignment and arbitrary device performance require real-device checks.
