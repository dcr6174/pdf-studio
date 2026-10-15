# Responsive Studio changes — 15 October 2026

Branch: `codex/responsive-studio-2026-10-15`. Baseline: `907714349996b9bd03ba406b7ff033ae6d94d0b8`.

## Changes and coverage

The site already used responsive CSS and shared PDF processors. This change aligns the main compact workspace with its existing JavaScript breakpoint (below 1100px), rather than introducing separate mobile processing. Device-model detection is not used.

- Shared Add Files, sort and settings controls become one attached row below the compact header. The stale reserved right-hand strip is removed. Only a rendered controls row reserves top space; writing tools without one do not acquire an empty strip.
- Reader's compact toolbar and reading-options dialog now cover tablet widths through 1099px, matching the shared shell. Desktop navigation/sidebar behavior remains at 1100px and above.
- Add Text & Images retains its in-layout toolbar and context row. The visible browser viewport sizes its flex canvas; bottom scroll clearance lets the last PDF page move above the fixed export action.
- Merge keeps file-card drag sorting, file previews and processing. Add/sort/settings share the attached row; its old empty heading no longer reserves 168px of height.
- Rotate keeps Undo/Redo, per-page and bulk rotation. Shared Add/settings/export remain reachable. The duplicated Add button and in-list export are hidden only while shared mobile controls are active; its page-control header does not overlap the attached row.
- Root viewport metadata allows safe-area insets and asks supported browsers to resize for keyboards. A small event-driven component tracks visible viewport height, orientation and keyboard occlusion. Listeners and RAF are cleaned up. Native pinch zoom preserves layout geometry and is not classified as an on-screen keyboard.
- Mobile settings dialogs have visible-height bounds, scrolling and layers above the sticky header. A large viewport reduction while editing hides fixed export controls that would cover typing. This is a geometry heuristic, not a guarantee for every browser/keyboard.
- Image Studio retains its own 760px layout switch. Its small-screen viewport, zoom/view targets and horizontal control overflow are strengthened. Lab fields/toolbars and Creative PDF single-column controls receive shared width safeguards. Guides/blogs retain existing mobile layout with wrapping/media safeguards. Homepage colours, popular tools, search, mascot and footer layout remain as established.
- No PDF/image engine, document dimensions, mark coordinates, storage key, dependency, route or game mechanic changes.

The [70-tool matrix](RESPONSIVE_TOOL_MATRIX_2026_10_15.csv) lists registry IDs and the shared or dedicated layout path. It is a coverage inventory, not 70 completed physical-device tests. Separate tools such as native-text, Workflow, handwriting and Sketch retain their dedicated workspace behavior; they benefit only from the listed shared rules.

## Validation

Local checks: `node checks/verify-device-layout.mjs`, focused TypeScript for the new viewport component/helper, and targeted ESLint. Tests cover nine phone/tablet/desktop geometries, browser bars versus keyboard occlusion, pinch zoom, invalid measurement fallbacks and compact/desktop toolbar boundaries. They parse CSS and calculate geometry; they do not run browser layout or simulate touch.

The existing CI workflow runs the new check alongside existing responsive SSR, PDF/image/output regressions, lint, full TypeScript and production builds. See PR checks for final results.

Live baseline Merge was opened in the cloud browser and its upload/header controls were inspected. The cloud browser exposes no viewport-emulation control, and no approved branch preview was available for post-change browser testing. No phone screenshot, post-change browser screenshot, real-device touch or complete 70-tool processing certification is claimed.

## Manual acceptance checks after a review build is available

Use 320×568, 390×844, 430×932, 768×1024, 1024×768, 1099px, 1100px, 1366×768 and 1920×1080, plus an actual Android phone and iPhone. Repeat landscape, both themes, a hardware keyboard, a software keyboard, browser-bar expansion/collapse and pinch zoom. At the 1099/1100 boundary confirm no simultaneous desktop sidebar and mobile toolbar, no invisible gutter and no lost controls.

1. [Add Text & Images](https://pdf-studio.in/tools/add-text-and-images): upload, place/type text, change its style, sketch/select/delete, scroll to the last page, zoom, rotate phone while typing, export and reopen the PDF.
2. [Merge](https://pdf-studio.in/tools/merge-pdf): add two files, sort both ways, hold/drag reorder, open settings, clear/cancel, merge and reopen the output. The toolbar must stay below the header without obscuring cards.
3. [Rotate](https://pdf-studio.in/tools/rotate-pdf): rotate a page, Undo/Redo, rotate a range/all pages, add a file and export. The main action must remain reachable from the first page even in a long PDF.
4. [Reader](https://pdf-studio.in/tools/pdf-reader): page navigation, zoom, search, bookmarks, options close/reopen and continuous scrolling. Confirm the reader fits between header and visible viewport on a tablet.
5. Homepage, tool directory, My files, a blog/guide, Image Studio, handwriting, Workflow and Creative tools: check ordinary vertical scrolling, long filenames, field focus, no page-wide horizontal overflow, usable close buttons and download/result actions.

Production links above continue to show main until this PR is merged/deployed. Verify canonical routes through the site's navigation if a tool URL redirects. Approval should follow an updated browser build and physical-phone checks; desktop checks must remain part of acceptance.
