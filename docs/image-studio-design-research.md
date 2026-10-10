# Image Studio visual redesign — 10 October 2026

## Problem and scope

The existing image workspace looked like a pair of dashboard cards: repeated rounded containers, a checkerboard across the entire canvas, a native tool dropdown, tiny status text and weak hierarchy. This iteration changes the shared image presentation and navigation across the actual 25-tool catalog. Processing engines, PDF tools, routes, dependencies and export behavior remain unchanged.

## Evidence and design decisions

Sources reviewed on 10 October 2026. “Observed” means the public browser interface was opened; “documented” means official published guidance. This is a design comparison, not a claim of exhaustive competitor processing tests.

| Service / source | Evidence | Relevant pattern | Decision for Studio Lab |
| --- | --- | --- | --- |
| [Canva photo editor](https://www.canva.com/photo-editor/) and [editor help](https://www.canva.com/help/image-editor/) | Public landing page and upload entry observed; editor behavior documented, not processed in a signed-in account. Help describes selecting an image then Edit, contextual side-panel tools, Undo at the top and Reset in Adjust. | Clear entry action; contextual editing; deliberate visual hierarchy. The marketing page is not the editor. | Keep the image as the focus, strengthen brand/header hierarchy, retain Undo and explicit Reset, use a focused settings inspector. No invented AI, layers or templates. |
| [Adobe Express image editor](https://www.adobe.com/express/feature/image/editor) | Public landing flow observed. The page exposes upload, file types and size guidance, and documents select/edit/download. Advanced features are marketing/documentation, not independently tested. | Task-oriented entry with clear input constraints and a short workflow. | Keep Choose Images prominent, preserve format/size guidance, maintain one processing/download action in the inspector. |
| [Photopea workspace](https://www.photopea.com/learn/workspace) | Official workspace documentation and illustration reviewed. Describes working area in the center, tools on the left, sidebar on the right and menu above. | Persistent editor chrome with a distinct artboard and properties area. | Replace nested dashboard cards with a continuous editor, right inspector and stable canvas controls. Avoid an unnecessary left rail for unsupported layer tools. |
| [Squoosh](https://squoosh.app/) and [official source](https://github.com/GoogleChromeLabs/squoosh) | Actual sample-photo editor observed: original/MozJPEG comparison, quality slider, advanced disclosure, zoom, background toggle, output bytes, reduction and downloads. No competitor output quality benchmark was performed. | Image-first workspace, nearby view controls, advanced settings disclosure, real output feedback. | Confine the transparency checker to the image; retain zoom/fit/1:1/pan, real byte counts and separate Original/Preview/Final states. Do not imply new codecs or a comparison slider were implemented. |
| [Figma toolbar](https://help.figma.com/hc/en-us/articles/360041064174-Access-design-tools-from-the-toolbar) | Official documentation reviewed. Toolbar groups tools; property controls are contextual. | Clear active-tool identity and discoverable navigation. | Searchable toolkit with five categories from the existing catalog, active-tool indication, keyboard dismissal and focus restoration. Tool changes explicitly start a new workspace. |
| [iLoveIMG crop](https://www.iloveimg.com/crop-image) | Official public tool page reviewed; the crop flow was not uploaded/downloaded in this comparison. | A task-specific action and direct image crop rather than general editor complexity. | Preserve crop selection and exact settings; apply the same visual hierarchy without adding unrelated controls. |
| [TinyPNG](https://tinypng.com/) | Official public page reviewed; smart compression and transparency support are vendor claims, not measured here. | A focused upload and output-size story rather than a dense editor. | Keep compressor and KB reducer task-oriented. Existing byte counts and output constraints remain authoritative; no unsupported “lossless” claim. |

## Implemented visual system

- Continuous 72px graphite header with a compact Studio Lab mark, active-tool chooser and existing undo/fullscreen controls.
- Searchable native-dialog toolkit: all 25 existing routes, actual catalog categories and descriptions, visible active tool, no-results state, Escape/backdrop/close handling and focus return. Opening another tool explicitly starts a new workspace, matching existing navigation semantics.
- Neutral image artboard with a restrained dot texture; checkerboard only behind transparent image pixels. A white image shadow separates content from editor chrome.
- Right inspector at 332px on desktop, 300px on narrower desktop; stronger title hierarchy, readable form fields, segmented options, framed advanced disclosures and a anchored primary action.
- Canvas view controls remain in a floating dock; Add Images stays at the opposite edge. Original/Preview/Final controls use a distinct segmented presentation.
- An original CSS illustration and centered upload empty state; no external assets, decorative download payloads or new dependencies.
- Mobile preserves canvas priority, compact tool chooser, existing settings sheet and bottom action. Small-height empty states reduce decoration; controls retain touch sizing and 16px inputs.
- Existing reduced-motion support applies to the new dialog and hover/focus transitions.

## Verification and limits

Local Chromium: all 25 tools each completed upload, settings, processing and a real download on desktop 1440×900 and mobile 390×844 (50 flows), with no reported runtime errors or page overflow. Existing gesture checks passed source-pixel crop dragging, watermark positioning, grouped undo, keyboard zoom, fit/actual size, 320×568, 844×390 and 1280×720 containment, and reduced motion. New toolkit checks covered all 25 links, filtered search, Escape dismissal and focus restoration. Targeted TypeScript and zero-warning ESLint passed.

The engine files are byte-identical to the starting main commit. This iteration does not claim Safari/iOS hardware verification, a complete assistive-technology audit, every possible format/size/error combination, or competitor export-quality/performance benchmarking. Repository-wide CI is reported in the pull request. Local screenshots represent the new implementation, not a claim that production has deployed it.
