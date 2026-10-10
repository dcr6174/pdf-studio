/** Image-only editorial content. Tool instructions follow the implemented controls. */
import type { ImageToolSlug } from "./image-tools";
export type ImageGuide = {
  slug: string;
  title: string;
  description: string;
  tools: ImageToolSlug[];
  kind: "Tool guide" | "Comparison";
  intro: string;
  steps: string[];
  sections: { title: string; text: string }[];
  example: { input: string; settings: string; expected: string };
  checks: string[];
  limitations: string[];
  faq: { question: string; answer: string }[];
  related: string[];
  tags: string[];
  sources: { label: string; url: string }[];
  published: string;
  updated: string;
};
export const imageGuides: ImageGuide[] = [
  {
    slug: "image-size-reducer",
    title: "How to reduce a photo or signature below a KB limit",
    description:
      "Prepare a JPG or PNG for a strict upload limit while checking dimensions, legibility and actual file size.",
    tools: ["image-size-reducer"],
    sections: [
      {
        title: "Start with the portal requirements",
        text: "Check the permitted format, maximum bytes and required dimensions first. The reducer accepts JPG, PNG and WebP up to 25 MB and below 40 megapixels. One KB here means 1,000 bytes; a portal may use a different convention.",
      },
      {
        title: "Make the file fit",
        text: "Upload the image, choose a preset or custom limit, and select JPG or PNG. Optional pixel limits constrain the longest usable dimensions without stretching or enlargement. JPG flattens transparency onto white. PNG retains transparency; it can require smaller dimensions to reach a very small limit. The reducer also limits its working longest edge to 4,096 pixels, so a very large image can be reduced even when you entered no optional dimension limits.",
      },
      {
        title: "Inspect the actual download",
        text: "Choose Reduce image size, then compare Original and Final result. The final preview is decoded from the file you download. The result reports actual bytes and pixel dimensions. Inspect small text, faces and signature strokes at 1:1. Very large original previews are scaled to 4,096 pixels and explicitly labeled.",
      },
      {
        title: "When a limit cannot be reached",
        text: "A limit-not-reached result is the smallest tested output, not a guarantee of acceptance. Try a larger limit or JPG if transparency is unnecessary. Keep the original file and check whether the portal also requires minimum dimensions. Clean a white-paper signature before reducing it if blank margins waste pixels.",
      },
    ],
    kind: "Tool guide",
    intro:
      "A form may reject a perfectly clear photo because its file exceeds the upload limit. The size reducer targets a maximum number of bytes, rather than asking you to guess a compression percentage. Start with the portal’s format and dimension rules: a smaller file is useful only if it still meets those rules.",
    steps: [
      "Check the required format, maximum KB and any minimum or maximum dimensions. Keep your original.",
      "Upload one JPG, PNG or WebP. Choose a size preset or custom limit, then JPG or PNG.",
      "Set optional maximum pixel dimensions only when appropriate. Choose Reduce image size.",
      "Compare Original and Final result, inspect at 1:1 and download the result whose status meets your limit.",
    ],
    example: {
      input: "A signature scan that must be below 50 KB.",
      settings:
        "Set Maximum file size to 50 KB; select the format permitted by the form.",
      expected:
        "A successful result must be below 50,000 bytes. Its dimensions may decrease; the displayed result, not this example, determines whether the target was reached.",
    },
    checks: [
      "Read the actual byte count and the limit-reached status. The reducer uses decimal KB, not 1,024-byte KiB.",
      "Check thin signature strokes, face detail and minimum dimensions in the downloaded file. Test that exact download in the intended form.",
    ],
    limitations: [
      "There is no guarantee that every source can meet a tiny limit while retaining required detail.",
      "The reducer handles one image at a time, accepts sources below 40 megapixels and limits its working longest edge to 4,096 pixels. Re-encoding may reduce dimensions even without an entered pixel limit.",
    ],
    faq: [
      {
        question: "Why did the dimensions change?",
        answer:
          "The reducer can lower JPEG quality and shrink pixel dimensions to reach the byte target. PNG does not offer the same quality control, so shrinking may be necessary.",
      },
      {
        question: "Can I use a transparent signature?",
        answer:
          "Choose PNG if the form accepts it. JPG flattens transparent areas onto white. Check the final image instead of assuming the background was preserved.",
      },
    ],
    related: ["signature-cleaner", "image-compressor", "image-resizer"],
    tags: ["Optimize", "Photo & Signature Size Reducer"],
    published: "2026-10-10",
    updated: "2026-10-10",
    sources: [],
  },
  {
    slug: "image-compressor",
    title: "How to compress images without guessing the result",
    description:
      "Compare JPG, PNG and WebP exports, inspect encoded quality and download a batch with real file sizes.",
    tools: ["image-compressor"],
    kind: "Tool guide",
    intro:
      "Compression is a tradeoff between a file’s size and what you can afford to lose. A photograph, a logo and a screenshot need different choices. Image Compressor exposes the encoded preview and output bytes so you can compare the result with the original before choosing which file to keep.",
    steps: [
      "Upload your images and inspect the active file. Add images appends; Replace starts a new set.",
      "Open Export settings. Choose JPG, PNG or WebP and adjust Export quality where available.",
      "Wait for Preview, inspect detailed regions at 1:1 and compare with Original.",
      "Choose Compress images, review per-file results and download one file or all files as ZIP.",
    ],
    sections: [
      {
        title: "Choose the format before the percentage",
        text: "JPG is an opaque, lossy choice for photographs. WebP offers a quality setting and can retain transparent pixels. PNG is useful for crisp artwork, but browser PNG encoding does not use the quality percentage. A PNG export is not guaranteed to be smaller than its source; compare actual bytes rather than the slider position.",
      },
      {
        title: "Treat Preview as a quality check",
        text: "The preview is decoded from an encoded image. Look at hair, small text, diagonal lines and smooth gradients, where compression can become visible. Fit is useful for composition; 1:1 is better for artifacts. Zoom changes the view, not the export dimensions. Final result becomes available after processing.",
      },
      {
        title: "Make batches easy to review",
        text: "Settings can target all images or the active image. A single percentage does not give identical quality or size across unrelated photographs. Inspect an example of each type in the batch. Individual failures are listed separately, and successful downloads remain available while you retry or remove a failed image.",
      },
      {
        title: "Use the right tool for a strict limit",
        text: "A quality percentage does not promise a specific KB size. If a form sets a hard maximum, finish the visual edits and use Photo & Signature Size Reducer. Resizing can also help a large photograph when the destination does not need its original dimensions. Avoid repeatedly recompressing previous JPG exports.",
      },
    ],
    example: {
      input: "Several product photographs and one transparent logo.",
      settings:
        "Try WebP at a moderate quality; keep transparency enabled for the logo.",
      expected:
        "Each file gets its own encoded size. The logo must retain transparent edges, and the photos must remain readable; no fixed reduction percentage is promised.",
    },
    checks: [
      "Compare output bytes with the source and inspect the downloaded image at actual size.",
      "Check alpha around the logo and verify that every intended file appears in the ZIP.",
    ],
    limitations: [
      "Re-encoding can change color rendering, metadata and animation; this is still-image editing.",
      "There is no universal quality percentage or guaranteed size saving. PNG quality is not adjustable through the browser encoder.",
    ],
    faq: [
      {
        question: "Can I compress to exactly 100 KB?",
        answer:
          "Use the size reducer for a maximum KB target. This compressor controls export format and quality, not an exact file-size promise.",
      },
      {
        question: "Why is my output larger?",
        answer:
          "A source may already be efficiently encoded, or the chosen format may suit it poorly. Inspect actual bytes and try another supported format or smaller pixel dimensions.",
      },
    ],
    related: ["image-size-reducer", "image-formats", "image-resizer"],
    tags: ["Optimize", "Image Compressor"],
    published: "2026-10-10",
    updated: "2026-10-10",
    sources: [
      {
        label: "MDN: browser canvas encoding and quality",
        url: "https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob",
      },
    ],
  },
  {
    slug: "image-resizer",
    title: "How to resize an image without stretching it",
    description:
      "Set pixel dimensions, preserve proportions and choose between fitting the whole image or cropping its edges.",
    tools: ["image-resizer"],
    kind: "Tool guide",
    intro:
      "Resizing changes the output canvas dimensions. It is different from zooming the workspace and different from selecting a crop. Decide whether your destination needs an exact rectangular canvas or simply a smaller proportional photograph, then use the fit option that matches that goal.",
    steps: [
      "Upload the image and enter Width and Height in pixels, or use Scale (%).",
      "Keep aspect ratio enabled when proportional dimensions are the goal.",
      "Choose Fit inside, Fill or Stretch deliberately. Enable Do not enlarge smaller images if needed.",
      "Inspect Preview, choose Resize images and check the downloaded pixel dimensions.",
    ],
    sections: [
      {
        title: "Keep proportions and canvas size separate",
        text: "Keep aspect ratio links width and height while you enter values. Fit inside preserves the complete picture inside the chosen canvas, leaving spare space when the shapes differ. Fill preserves proportions but crops edges to cover the canvas. Stretch uses the exact dimensions by changing proportions and can make faces or circles look wrong.",
      },
      {
        title: "Choose a useful resolution",
        text: "Start with the dimensions required by the recipient or page. Reducing a large photo can save bytes, but export format and quality still matter. Enlarging a small source adds pixels without recovering genuine captured detail. Do not enlarge smaller images provides a useful constraint when a batch mixes large and small sources.",
      },
      {
        title: "Inspect padding and crop placement",
        text: "The preview shows the actual resized composition. With Fit inside, check whether unused canvas areas should be transparent or use the selected background color. With Fill, inspect faces, text and edges that may be cropped. If a particular crop needs precise placement, use Image Crop first rather than relying on centered filling.",
      },
      {
        title: "Review mixed batches",
        text: "Output settings remain shared when you switch files. Inspect a portrait and a landscape separately before applying one target to both. The current image workspace limits outputs to 8,192 pixels per side and 24 megapixels in total. A dimension pair can exceed the total pixel budget even when each side is allowed.",
      },
    ],
    example: {
      input: "A 1,200 × 800 photograph needed on a 600 × 600 canvas.",
      settings:
        "Disable the aspect link to enter the square target; compare Fit inside and Fill.",
      expected:
        "Fit inside keeps the whole 3:2 photo with spare canvas space; Fill crops the longer direction. Stretch changes its proportions.",
    },
    checks: [
      "Verify the saved width and height, not the canvas zoom percentage.",
      "Inspect subject proportions and any cropped edges or padding.",
    ],
    limitations: [
      "Upscaling does not reconstruct missing detail.",
      "Output dimension and pixel-budget limits apply. Browser re-encoding is not an exact reproduction of every source color profile.",
    ],
    faq: [
      {
        question: "Does 50% zoom make the image smaller?",
        answer:
          "No. Canvas zoom changes only how the image is displayed. Use Scale (%) or output pixel dimensions to resize the file.",
      },
      {
        question: "Why do I see blank edges?",
        answer:
          "Fit inside preserves the whole image when its shape differs from the target. Choose Fill to crop edges, or use a proportional target to avoid the mismatch.",
      },
    ],
    related: ["image-crop", "resize-or-crop", "image-compressor"],
    tags: ["Edit", "Image Resizer"],
    published: "2026-10-10",
    updated: "2026-10-10",
    sources: [],
  },
  {
    slug: "image-crop",
    title: "How to crop an image with precise pixel controls",
    description:
      "Draw a crop on the original, use aspect-ratio presets and check exactly what remains in the export.",
    tools: ["image-crop"],
    kind: "Tool guide",
    intro:
      "A crop removes unwanted parts of an image without needing to redraw it. Use it to isolate a subject, trim borders or create the shape a destination needs. Keep the original available: the downloaded crop contains only the selected area, while the editor lets you revise the selection before processing.",
    steps: [
      "Upload the image and switch to Select area. Choose Draw new selection to start a fresh rectangle.",
      "Drag the rectangle, move it and resize its handles. Select an aspect ratio if needed.",
      "Open Exact selection for source-pixel X, Y, width and height. Check Preview.",
      "Choose Create crop, inspect Final result and download the cropped image.",
    ],
    sections: [
      {
        title: "Select on the original, inspect the result",
        text: "Select area shows the original image with a rectangle so you can see what will be removed. Preview shows the crop itself. These are different views of the same task. If you adjust the crop, return to Select area instead of trying to drag a rectangle on the already cropped preview.",
      },
      {
        title: "Use source pixels for exact work",
        text: "Exact selection values describe coordinates in the uploaded image, independently of canvas zoom. For a crop beginning 100 pixels from the left, enter X = 100 even if the image is displayed at 25%. The editor constrains the rectangle to the source bounds. A fixed aspect ratio helps preserve a consistent output shape.",
      },
      {
        title: "Make room for precise dragging",
        text: "Use Fit for the entire source, then zoom and pan when a small detail needs attention. The hand control or Space-drag pans the view; the selection handles change the crop. On touch screens, pinch changes the viewing scale. If the starting rectangle fills the image, Draw new selection makes a fresh smaller area easier to create.",
      },
      {
        title: "Do not confuse a crop with a resize",
        text: "Cropping changes which source pixels remain; resizing changes their output dimensions. A crop of 200 × 120 pixels is still 200 × 120 before any separate resize. For a profile photo, crop the composition first, then resize if the destination requires a different pixel count. Inspect mixed-aspect batches individually.",
      },
    ],
    example: {
      input: "A 400 × 240 image with a useful center region.",
      settings:
        "Use X = 100, Y = 60, width = 200 and height = 120 in Exact selection.",
      expected:
        "The selected source region produces a 200 × 120 crop. This geometry example assumes the stated source dimensions and does not measure output bytes.",
    },
    checks: [
      "Confirm all intended content is inside the selection and that the saved dimensions match the crop.",
      "Check the export at 1:1 for cut-off text, faces or signature strokes.",
    ],
    limitations: [
      "Cropping removes content from the exported image; keep the original.",
      "Selections are rectangular. This tool does not provide a freehand cutout or automatically detect a subject.",
    ],
    faq: [
      {
        question:
          "Why does the rectangle use different numbers from the screen?",
        answer:
          "Its values are source-image pixels. The displayed image may be zoomed smaller or larger.",
      },
      {
        question: "How do I start over?",
        answer:
          "Use Draw new selection for another rectangle, Undo for recent edits or Reset settings to return to defaults.",
      },
    ],
    related: ["image-resizer", "resize-or-crop", "passport-photo"],
    tags: ["Edit", "Image Crop"],
    published: "2026-10-10",
    updated: "2026-10-10",
    sources: [],
  },
  {
    slug: "image-rotate",
    title: "How to rotate, straighten and flip a photo",
    description:
      "Use quarter turns, a custom angle and mirror controls while checking the new canvas edges.",
    tools: ["image-rotate"],
    kind: "Tool guide",
    intro:
      "A sideways scan needs a quarter turn; a slightly tilted photograph needs a small angle. Rotate & Flip handles both, with separate horizontal and vertical mirroring. Straighten first and inspect the resulting bounds before cropping away spare edges, so you do not accidentally remove important content.",
    steps: [
      "Upload the image and choose a rotation preset or enter a custom angle.",
      "Use horizontal or vertical flip only when you intend to mirror the picture.",
      "Inspect Preview, especially the corners and any readable text.",
      "Choose Create result, download the result and crop blank corners separately if needed.",
    ],
    sections: [
      {
        title: "Quarter turns preserve the rectangular shape",
        text: "A 90-degree or 270-degree rotation swaps the output width and height. A 180-degree rotation keeps the same dimensions but turns the picture upside down. These choices are useful for scanned pages and phone photos whose visible orientation is incorrect. Read a line of text in the preview to confirm the intended direction.",
      },
      {
        title: "Small angles create a larger bounding canvas",
        text: "A tilted rectangle needs extra canvas area to contain all its corners. The tool computes those bounds rather than silently cutting the image to its original rectangle. A custom straightening angle can therefore introduce empty corner regions. Choose an appropriate export background and use Image Crop after rotation if those corners are unwanted.",
      },
      {
        title: "Mirroring is not the same as rotating",
        text: "Horizontal flip exchanges left and right; vertical flip exchanges top and bottom. Both can make text unreadable even when the image looks upright. Check logos, signs and handwriting before exporting. Rotating a selfie and mirroring it solve different problems, so compare with the original rather than applying both automatically.",
      },
      {
        title: "Finish with an edge check",
        text: "Transparency-capable exports can keep empty corners transparent; JPG needs an opaque background. Inspect the final decoded file, because encoder quality can affect fine lettering. For a batch, confirm that every source needs the same transformation. An upright image included with sideways scans should not receive an unwanted quarter turn.",
      },
    ],
    example: {
      input: "A sideways 1,200 × 800 scan.",
      settings:
        "Apply a 90-degree quarter turn and inspect its text direction.",
      expected:
        "The rotated rectangular canvas is 800 × 1,200. A small custom angle instead produces different bounding dimensions.",
    },
    checks: [
      "Read text and check left/right orientation in Final result.",
      "Inspect all corners, then verify downloaded dimensions after quarter turns.",
    ],
    limitations: [
      "Rotation does not repair perspective distortion or recover missing corners.",
      "Mirroring changes the visible orientation of text and symbols. Large rotated outputs remain subject to the workspace pixel budget.",
    ],
    faq: [
      {
        question: "Why did blank corners appear?",
        answer:
          "A non-right-angle rotation needs a bounding rectangle around the tilted image. Crop afterward if you prefer a tighter composition.",
      },
      {
        question: "Can it fix a perspective-skewed document?",
        answer:
          "This tool rotates and flips pixels. It does not provide perspective correction or document detection.",
      },
    ],
    related: ["image-crop", "image-resizer", "resize-or-crop"],
    tags: ["Edit", "Rotate & Flip"],
    published: "2026-10-10",
    updated: "2026-10-10",
    sources: [],
  },
  {
    slug: "image-blur",
    title: "How to blur a selected image area",
    description:
      "Choose a rectangular region, tune blur strength and verify the exported result before sharing.",
    tools: ["image-blur"],
    kind: "Tool guide",
    intro:
      "Blur softens detail in a photograph or selected rectangle. It can make an image less distracting, but a visually blurred name or number is not a reliable privacy guarantee. When the goal is to protect sensitive information, remove it or replace it with an opaque cover in an appropriate editor.",
    steps: [
      "Upload the image and use Select area to choose a rectangle, or select the whole image.",
      "Adjust Strength and inspect Preview at 1:1.",
      "Compare Original to confirm that useful content outside the region is unaffected.",
      "Choose Create result, download the result and reopen it for a final review.",
    ],
    sections: [
      {
        title: "Start with a deliberate rectangle",
        text: "The selection uses source-image pixels and can be moved or resized on the original. Exact selection fields help position it around a small detail. Select the whole area when you want an overall softening effect. There is no automatic face or subject detection, so inspect the boundaries rather than assuming the right content was selected.",
      },
      {
        title: "Inspect both the detail and the boundary",
        text: "Increase strength gradually. At a small fit scale, even a weak blur can appear effective; 1:1 reveals whether text or texture is still recognizable. A rectangular region may have a visible transition at its edge. Check whether that transition fits the design, particularly around a face, logo or transparent edge.",
      },
      {
        title: "Know what the tool actually applies",
        text: "The implementation applies a blur to the selected pixels. It does not create an editable depth-of-field layer, isolate a subject or analyze whether hidden information can be reconstructed. Settings remain revisable before exporting, but the downloaded image is a flattened still image with the effect already applied.",
      },
      {
        title: "Use blur for appearance, not a confidentiality promise",
        text: "A receipt, address or account number deserves more than a visual softening check. Sensitive shapes may still be inferred from context, or guessed from known alternatives. If you use blur decoratively, keep it subtle. If you need redaction, use a workflow that removes or fully replaces the sensitive image area and inspect the exact shared file.",
      },
    ],
    example: {
      input:
        "A product photo with a distracting rectangular label in the background.",
      settings:
        "Select only that label and increase Strength while checking the foreground product.",
      expected:
        "The selected area softens while the rest of the image remains available for comparison. This is an appearance example, not a redaction test.",
    },
    checks: [
      "Inspect the selected detail and the edges of the rectangle at 1:1.",
      "Open the downloaded file and confirm that no unintended region was blurred.",
    ],
    limitations: [
      "Blur is not secure redaction or an irreversible concealment guarantee.",
      "The tool uses rectangular selections and does not automatically find faces or complex subjects.",
    ],
    faq: [
      {
        question: "Can I blur only one face?",
        answer:
          "You can manually select a rectangle around it. The tool does not detect or track faces.",
      },
      {
        question: "Is blurred text safe to share?",
        answer:
          "Do not assume so. For sensitive text, remove it or fully replace the area and verify the exact file you will share.",
      },
    ],
    related: ["image-pixelate", "image-crop", "image-adjustments"],
    tags: ["Edit", "Image Blur"],
    published: "2026-10-10",
    updated: "2026-10-10",
    sources: [],
  },
  {
    slug: "image-pixelate",
    title: "How to pixelate a rectangular image region",
    description:
      "Set a source-pixel selection and block size, then inspect what remains recognizable in the download.",
    tools: ["image-pixelate"],
    kind: "Tool guide",
    intro:
      "Pixelation replaces fine detail with coarse blocks. It is useful for a mosaic effect or a deliberately simplified region, but it should not be treated as secure redaction. Decide whether you want a visual style or need to remove private information: those are different tasks with different verification needs.",
    steps: [
      "Upload the image, switch to Select area and draw or enter an exact rectangle.",
      "Adjust Block size and inspect the region at 1:1.",
      "Compare Original and Preview, including the selected boundaries.",
      "Choose Create result and reopen the downloaded result before sharing.",
    ],
    sections: [
      {
        title: "Select enough area for the effect",
        text: "Move the rectangle to cover the whole intended detail, not only the most obvious part of a character or face. The source-pixel coordinate fields remain meaningful at any zoom level. Use Draw new selection if the initial full-image rectangle is inconvenient. Content outside the selected area is not intentionally pixelated.",
      },
      {
        title: "Block size controls the visual scale",
        text: "Small blocks keep more of the original structure. Larger blocks produce a stronger mosaic but can still preserve recognizable shapes or colors. The numeric value describes the effect’s block scale, not the exported file’s dimensions. Fit helps assess composition; actual-size viewing helps inspect what each block reveals.",
      },
      {
        title: "Check nearby clues as well as the blocks",
        text: "A coarse face may still be identifiable from clothing or context. A pixelated number can sometimes be guessed from other visible information. Check the entire picture, including reflections, duplicated labels and nearby text. An appealing preview does not demonstrate that private information is inaccessible.",
      },
      {
        title: "Keep styling and privacy separate",
        text: "Use this tool confidently for a graphic mosaic style, while keeping the original for revisions. For confidentiality, use an opaque replacement or a workflow that removes the sensitive region, then inspect the exact shared image. Re-encoding or choosing a larger block alone does not make a reliable security promise.",
      },
    ],
    example: {
      input: "A background sign that should have a mosaic appearance.",
      settings: "Select the sign’s rectangle and compare two block sizes.",
      expected:
        "The larger block size creates a coarser visual effect. The output is a flattened still image; recognizability must be checked separately.",
    },
    checks: [
      "Check the mosaic boundaries and confirm important foreground details remain unchanged.",
      "Inspect the exact download for readable clues; do not call this a secure redaction check.",
    ],
    limitations: [
      "Pixelation can leave identifiable information and is not secure redaction.",
      "Only rectangular areas are supported; the tool does not provide automatic face detection.",
    ],
    faq: [
      {
        question: "Does a larger block guarantee privacy?",
        answer:
          "No. Coarse shapes, colors and context can remain informative. Remove or fully replace sensitive content instead.",
      },
      {
        question: "Will changing zoom change the blocks?",
        answer:
          "No. Zoom changes the workspace view. Block size is the processing setting.",
      },
    ],
    related: ["image-blur", "image-crop", "image-adjustments"],
    tags: ["Edit", "Image Pixelate"],
    published: "2026-10-10",
    updated: "2026-10-10",
    sources: [],
  },
  {
    slug: "image-grayscale",
    title: "How to create a grayscale image with a controlled mix",
    description:
      "Adjust black-and-white strength, compare tonal contrast and choose a suitable export.",
    tools: ["image-grayscale"],
    kind: "Tool guide",
    intro:
      "A black-and-white image can emphasize shape and light, but removing color can also make important details indistinguishable. Grayscale lets you control the mix instead of committing immediately to full strength. Compare the original with the preview, especially when color carries meaning in a chart, sign or logo.",
    steps: [
      "Upload the image and adjust Grayscale amount.",
      "Compare Original and Preview at both Fit and 1:1.",
      "Choose the export format and transparency settings required by your destination.",
      "Create the grayscale result, download it and check tonal separation in the saved file.",
    ],
    sections: [
      {
        title: "Use strength to control the change",
        text: "At low strength, the result keeps some original color. Full strength moves the image toward grayscale. The conversion uses a luminance-weighted color mix rather than assigning every channel equal importance. Treat the slider as a visual choice: a smaller number is not a compression setting and does not promise fewer bytes.",
      },
      {
        title: "Check colors that mean something",
        text: "Two distinct colors can become similar gray tones. Before sharing a grayscale chart or labeled screenshot, check whether the labels, patterns or shapes still distinguish categories. A logo may lose contrast against its destination background. If the grayscale view removes essential meaning, keep color or add clear labels in another editor.",
      },
      {
        title: "Choose export settings independently",
        text: "PNG can retain transparent artwork, while JPG is an opaque photographic export. WebP offers another supported still-image choice when your destination accepts it. A grayscale result is not necessarily a specialized one-channel grayscale file; the workspace edits image pixels and encodes them through the selected browser format.",
      },
      {
        title: "Evaluate the whole composition",
        text: "Fit is useful for overall mood; 1:1 reveals small details and encoder artifacts. If the result looks flat, Brightness & Contrast can help you prepare a separate revised copy. Preserve the original color image for later edits. With a batch, check whether each source benefits from the same grayscale strength.",
      },
    ],
    example: {
      input: "A colorful landscape intended for a monochrome newsletter.",
      settings: "Compare partial strength with full Grayscale amount.",
      expected:
        "The full-strength preview removes visible color while retaining the composition. Check whether the sky and mountains remain distinct in tone.",
    },
    checks: [
      "Inspect tonal contrast in faces, lettering and meaningful color categories.",
      "Reopen the export and check its background and fine details.",
    ],
    limitations: [
      "Grayscale can remove information conveyed only by color.",
      "The tool does not promise a smaller file, a print-ready color profile or a dedicated one-channel encoding.",
    ],
    faq: [
      {
        question: "Will grayscale reduce file size?",
        answer:
          "Not necessarily. The selected encoder and image content determine the output bytes.",
      },
      {
        question: "Can I keep some color?",
        answer:
          "Use a lower strength for a partial grayscale mix. This affects the entire image rather than a selectively isolated object.",
      },
    ],
    related: ["image-adjustments", "image-compressor", "image-formats"],
    tags: ["Edit", "Grayscale"],
    published: "2026-10-10",
    updated: "2026-10-10",
    sources: [],
  },
  {
    slug: "image-background-remover",
    title: "How to remove a plain background without losing detail",
    description:
      "Sample a connected background color, tune tolerance and restore accidentally removed pixels.",
    tools: ["image-background-remover"],
    sections: [
      {
        title: "Choose an image that suits the method",
        text: "This tool removes connected pixels similar to a sampled color. It is useful for simple graphics and flat backgrounds. It does not perform AI subject segmentation; hair, scenery, gradients and disconnected background islands need additional editing.",
      },
      {
        title: "Select the background explicitly",
        text: "Upload the image and click a background pixel or enter sample coordinates in settings. No background is removed until a sample is selected. Adjust color tolerance, then inspect Preview around the subject. High tolerance can remove similarly colored parts of the subject.",
      },
      {
        title: "Restore accidental removals",
        text: "Enable Restore brush and paint over the original image where detail should return. Undo settings changes or reset if the result is unsuitable. Restoration is specific to the image; avoid assuming it transfers correctly to an unrelated photo in a batch.",
      },
      {
        title: "Export with the right transparency",
        text: "Use PNG or WebP when transparent pixels matter, and keep Transparent background enabled. JPG cannot store alpha and uses a chosen matte. Compare the final image on the transparency checkerboard, then inspect it against its intended destination background.",
      },
    ],
    kind: "Tool guide",
    intro:
      "This background remover is designed for flat, connected backgrounds. It follows pixels similar to a selected sample, so a simple icon on plain paper is a better candidate than hair against a busy scene. Start with a clear background sample and inspect the edge before increasing tolerance.",
    steps: [
      "Upload the image and click a background pixel, or enter its sample coordinates.",
      "Adjust color tolerance while inspecting Preview around the subject.",
      "Use Restore brush on the original to recover accidentally removed detail.",
      "Keep transparency enabled for PNG or WebP, process the image and inspect the final export.",
    ],
    example: {
      input: "A dark graphic on an evenly colored white background.",
      settings:
        "Sample an empty white corner, start with modest tolerance and inspect the outline.",
      expected:
        "Matching connected background pixels become transparent. Separate background islands and complex edges may remain.",
    },
    checks: [
      "Inspect fine strokes and edges on the transparency checkerboard and on the intended destination background.",
      "Verify that similarly colored subject areas were not removed and that the download retains alpha.",
    ],
    limitations: [
      "This is connected-color removal, not AI subject segmentation.",
      "Busy scenery, gradients, hair and disconnected background regions may need manual editing elsewhere.",
    ],
    faq: [
      {
        question: "Why does another white area remain?",
        answer:
          "Only matching pixels connected to the sampled region are removed. A separate enclosed region may remain.",
      },
      {
        question: "Why did part of my subject disappear?",
        answer:
          "Its color may match the background within the selected tolerance. Lower tolerance, choose another sample or restore those pixels.",
      },
    ],
    related: ["signature-cleaner", "png-to-jpg", "image-color-picker"],
    tags: ["Edit", "Plain Background Remover"],
    published: "2026-10-10",
    updated: "2026-10-10",
    sources: [],
  },
  {
    slug: "jpg-to-png",
    title: "How to convert JPG to PNG and understand what changes",
    description:
      "Create a PNG from a JPG without assuming it restores lost detail or creates transparency.",
    tools: ["jpg-to-png"],
    kind: "Tool guide",
    intro:
      "JPG to PNG is useful when a destination asks for PNG or when you want a PNG copy for a later workflow. It changes the encoding, not the history of the photograph. Existing JPEG artifacts stay in the pixels, and an opaque JPG background remains opaque after conversion.",
    steps: [
      "Upload the JPG and inspect Original at 1:1.",
      "Review the PNG preview; the export format is fixed to PNG for this tool.",
      "Choose Create result and inspect the actual output size.",
      "Download the PNG and open it in the destination that requires this format.",
    ],
    sections: [
      {
        title: "A new format is not new detail",
        text: "A JPG may already contain compression artifacts or softened lettering. Encoding those decoded pixels as PNG does not reconstruct the information discarded by the earlier JPG encoder. Keep the original source photograph or artwork when it is available. Converting repeatedly between formats is not an enhancement workflow.",
      },
      {
        title: "Transparency must come from another operation",
        text: "JPG does not provide an alpha channel. A white rectangle around a logo therefore remains visible in its PNG copy. If the background is plain and connected, use Plain Background Remover separately and inspect its limitations. Merely selecting PNG does not identify or remove the background.",
      },
      {
        title: "Expect the size to change",
        text: "PNG may store a photographic image less compactly than its JPG source. The output can therefore become larger even though the dimensions stay the same. Check bytes after processing rather than assuming a conversion is a compression. If a form needs PNG under a hard limit, use the PNG size-reducer workflow afterward.",
      },
      {
        title: "Check the receiving application",
        text: "Choose a clear output filename and open the saved PNG where you intend to use it. Renaming a .jpg extension to .png is not conversion; the file contents must actually use the new encoding. This tool performs a raster export, so source metadata and color-profile behavior should not be assumed to match the JPG container exactly.",
      },
    ],
    example: {
      input: "A 1,200 × 800 JPG that a form requires as PNG.",
      settings: "Upload it and run JPG to PNG.",
      expected:
        "The PNG keeps the decoded image dimensions and visible background. It may have more bytes, and existing JPG artifacts remain.",
    },
    checks: [
      "Check the saved PNG’s dimensions and actual size, then inspect small text at 1:1.",
      "Confirm the receiving application opens it and does not reject its byte count.",
    ],
    limitations: [
      "Conversion does not restore JPEG detail or automatically remove the background.",
      "Raster re-encoding does not promise identical source metadata, color profiles or a smaller file.",
    ],
    faq: [
      {
        question: "Will the white background become transparent?",
        answer:
          "No. Use a background-removal operation if appropriate; PNG conversion alone keeps the visible background.",
      },
      {
        question: "Why is the PNG much bigger?",
        answer:
          "Photographs often encode compactly as JPG. PNG represents the same decoded pixels with a different encoding and may use more bytes.",
      },
    ],
    related: ["png-to-jpg", "image-background-remover", "image-formats"],
    tags: ["Convert", "JPG to PNG"],
    published: "2026-10-10",
    updated: "2026-10-10",
    sources: [
      {
        label: "MDN: image formats and transparency",
        url: "https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Image_types",
      },
    ],
  },
  {
    slug: "png-to-jpg",
    title: "How to convert PNG to JPG with the right background",
    description:
      "Choose a matte for transparent pixels, adjust JPEG quality and inspect the final edges.",
    tools: ["png-to-jpg"],
    kind: "Tool guide",
    intro:
      "A transparent PNG cannot stay transparent in a JPG. Before converting, choose the background color you want behind every transparent or partially transparent edge. This matters for logos, signatures and rounded graphics: a good matte can look clean in one destination and wrong in another.",
    steps: [
      "Upload the PNG and inspect its transparent edges against the checkerboard.",
      "Choose the background color and adjust Export quality.",
      "Inspect Preview at 1:1, particularly lettering and partially transparent borders.",
      "Choose Create result, download it and check it on the intended page or form.",
    ],
    sections: [
      {
        title: "Choose the destination background first",
        text: "JPG is opaque, so transparent pixels need a matte. White is useful for many forms, but it may leave a visible rectangle on a dark page. If the destination needs real transparency, keep PNG or use WebP where accepted. Decide this before optimizing the byte count.",
      },
      {
        title: "Inspect partially transparent edges",
        text: "Antialiased outlines, shadows and soft cutouts can contain partly transparent pixels. Their final appearance depends on the chosen background. Check logo curves, fine signature strokes and any pale fringe at 1:1. A preview on a checkerboard explains transparency in the source; the JPG itself must be reviewed on its opaque matte.",
      },
      {
        title: "Keep text readable at the chosen quality",
        text: "Lower quality may reduce bytes but can create ringing or softness around sharp lettering. Compare the encoded preview with Original before processing. A percentage is not an exact KB target. For a strict form limit, use the reducer after making sure the matte and visible image are correct.",
      },
      {
        title: "Avoid treating conversion as cleanup",
        text: "The converter does not remove a background, restore damaged edges or repair a low-resolution source. It creates a JPG from the decoded image with the selected settings. Keep your transparent original for other uses. Review mixed batches individually if their required backgrounds differ, rather than applying one matte without checking.",
      },
    ],
    example: {
      input:
        "A transparent black signature needed as JPG on a white application form.",
      settings:
        "Choose a white Background color and a quality that keeps fine strokes readable.",
      expected:
        "The JPG has an opaque white background. Its actual byte count depends on the signature and quality setting.",
    },
    checks: [
      "Inspect fine edges and confirm the matte matches the intended destination.",
      "Open the download and verify the required JPG format, dimensions and file-size limit.",
    ],
    limitations: [
      "JPG cannot retain alpha transparency.",
      "JPEG compression can change fine detail; conversion is not a background-removal or edge-repair tool.",
    ],
    faq: [
      {
        question: "Why does my logo now have a rectangle behind it?",
        answer:
          "JPG is opaque. The rectangle is the selected background color replacing transparent pixels.",
      },
      {
        question: "Can I keep transparency and get a smaller file?",
        answer:
          "Try WebP if your destination accepts it, and compare actual output quality and bytes rather than assuming it is always smaller.",
      },
    ],
    related: ["image-to-webp", "image-formats", "image-size-reducer"],
    tags: ["Convert", "PNG to JPG"],
    published: "2026-10-10",
    updated: "2026-10-10",
    sources: [
      {
        label: "MDN: image formats and transparency",
        url: "https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Image_types",
      },
    ],
  },
  {
    slug: "image-to-webp",
    title: "How to export an image as WebP",
    description:
      "Compare encoded quality, retain alpha when needed and check that your destination accepts WebP.",
    tools: ["image-to-webp"],
    kind: "Tool guide",
    intro:
      "WebP is a useful still-image export when the receiving application supports it. The tool lets you tune encoded quality and retain transparent pixels, but it does not promise that every image will become smaller. Compare the actual output with your original and test the file in its intended destination.",
    steps: [
      "Upload the image and review Original.",
      "Adjust Export quality and keep Transparent background enabled when alpha matters.",
      "Inspect the encoded Preview at 1:1.",
      "Choose Create result, download it and test the receiving application.",
    ],
    sections: [
      {
        title: "Verify acceptance before converting",
        text: "A website may accept WebP while an application form accepts only JPG or PNG. Check the recipient’s permitted formats before optimizing. Changing a filename extension does not change its encoding. If the destination rejects WebP, choose the format it explicitly permits instead of repeatedly trying the same unsupported file.",
      },
      {
        title: "Balance quality against actual bytes",
        text: "The quality control affects the browser’s WebP encoder. Lower values can reduce detail as well as size. Inspect small text, gradients and faces, then compare the output byte count with the source. An efficiently encoded original or a different type of artwork may not give the saving you expect.",
      },
      {
        title: "Check transparency separately",
        text: "WebP can hold transparent pixels, but your chosen export settings must retain them. Inspect alpha around logos and soft shadows against the checkerboard. Then test the saved image on its real destination background. A good photographic result does not demonstrate that a transparent graphic was exported correctly.",
      },
      {
        title: "Keep the workflow still-image focused",
        text: "The image workspace decodes and edits a still image. Uploading an animated GIF or WebP does not preserve its complete animation through this conversion. Source camera metadata and color profiles are not promised to survive raster re-encoding. Keep original assets if motion, metadata or professional color handling matters.",
      },
    ],
    example: {
      input: "A transparent graphic intended for a website that accepts WebP.",
      settings:
        "Keep transparency enabled and compare two Export quality settings.",
      expected:
        "The saved WebP should retain its transparent edges. Select a version based on real bytes and visible detail, not an assumed reduction percentage.",
    },
    checks: [
      "Verify alpha, fine detail and output bytes in Final result.",
      "Open the actual download in the destination browser or application.",
    ],
    limitations: [
      "This converter produces a still image, not an animated WebP sequence.",
      "Browser encoder support and recipient format acceptance matter; no universal size or quality gain is guaranteed.",
    ],
    faq: [
      {
        question: "Does WebP always look better and use fewer bytes?",
        answer:
          "No. Results depend on the source, settings and encoder. Compare your actual export.",
      },
      {
        question: "Why will my form not accept it?",
        answer:
          "The form may permit only JPG or PNG. Use the recipient’s stated format rather than assuming WebP support.",
      },
    ],
    related: ["image-compressor", "image-formats", "png-to-jpg"],
    tags: ["Convert", "Image to WebP"],
    published: "2026-10-10",
    updated: "2026-10-10",
    sources: [
      {
        label: "MDN: image formats and transparency",
        url: "https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Image_types",
      },
    ],
  },
  {
    slug: "svg-to-image",
    title: "How to turn an SVG into a PNG, JPG or WebP",
    description:
      "Rasterize a self-contained SVG at deliberate pixel dimensions and check fonts, gradients and transparent edges.",
    tools: ["svg-to-image"],
    kind: "Tool guide",
    intro:
      "An SVG describes artwork, while a raster export stores a fixed grid of pixels. SVG to Image is useful when a form or application cannot accept vector files. Choose the pixel dimensions for the final use, and make the SVG self-contained before uploading: linked resources can disappear during conservative cleanup.",
    steps: [
      "Upload a self-contained SVG and inspect the safe decoded image.",
      "Enter output width and height and choose the fit behavior.",
      "Choose PNG, JPG or WebP, then check Preview at 1:1.",
      "Create the raster result and retain the original SVG for later sizes.",
    ],
    sections: [
      {
        title: "Prepare the vector source",
        text: "Keep essential shapes, definitions and artwork inside the SVG. The workspace sanitizes active and external content before rendering. Local gradient and mask references can remain, but externally linked images, fonts and stylesheets may not. The current sanitizer also removes non-fragment resource references, so do not assume an embedded image data URL will survive.",
      },
      {
        title: "Choose pixels for the destination",
        text: "A raster image cannot scale indefinitely like vector artwork. Decide the required width and height before exporting. Fit keeps the entire artwork inside the target; Fill can crop edges; Stretch changes proportions. If the SVG’s viewBox leaves unused margins, inspect those margins rather than assuming every pixel will contain artwork.",
      },
      {
        title: "Inspect text and local effects",
        text: "Text can depend on fonts available to the browser. If exact lettering is essential, prepare outlined text in the original vector editor before conversion. Inspect gradients, masks, clipping and line widths. A successful decode does not demonstrate identical rendering of every SVG feature, especially after external content is removed.",
      },
      {
        title: "Export the correct background",
        text: "Use a transparency-capable format with transparency enabled for a logo that must sit on different backgrounds. JPG needs an opaque matte. The workspace limits each side to 8,192 pixels and the total canvas to 24 megapixels. Keep the original SVG rather than enlarging a small raster export for a later, larger use.",
      },
    ],
    example: {
      input: "A square self-contained SVG logo needed as a 512 × 512 PNG.",
      settings:
        "Set a square target, choose Fit inside and retain transparency.",
      expected:
        "The export is a fixed 512 × 512 raster canvas. Check whether the logo’s own margins and text render as intended.",
    },
    checks: [
      "Inspect text, gradients, masks and transparency in the downloaded raster image.",
      "Confirm pixel dimensions and test the file where it will be used.",
    ],
    limitations: [
      "External resources and non-fragment linked assets can be removed before rendering.",
      "Rasterization does not preserve vector editing, guarantee identical fonts or support unlimited output dimensions.",
    ],
    faq: [
      {
        question: "Why did an image or font disappear?",
        answer:
          "The SVG may depend on a removed resource or a font unavailable to the browser. Make the artwork self-contained and outline essential text in the source editor.",
      },
      {
        question: "Can I enlarge the exported PNG indefinitely?",
        answer:
          "No. It has fixed pixels. Export another size from the original SVG when you need a larger result.",
      },
    ],
    related: ["svg-cleaner", "safe-svg", "image-resizer"],
    tags: ["Convert", "SVG to Image"],
    published: "2026-10-10",
    updated: "2026-10-10",
    sources: [],
  },
  {
    slug: "svg-cleaner",
    title: "How to clean an SVG and review removed content",
    description:
      "Remove active and external SVG content while checking local artwork and understanding conservative cleanup.",
    tools: ["svg-cleaner"],
    kind: "Tool guide",
    intro:
      "SVG Cleaner removes certain active, descriptive and externally referenced content from an SVG. It is useful for preparing a simpler, self-contained asset, but it is not a geometry optimizer or a universal security certification. Review the cleaned markup and visual result before putting the file into another application.",
    steps: [
      "Upload a valid, self-contained SVG. Documents with a document type or entity declaration are rejected.",
      "Inspect the safe source preview and open the cleanup report.",
      "Compare the source and cleaned markup, including any reported removals.",
      "Download the cleaned SVG and test its appearance in the intended application.",
    ],
    sections: [
      {
        title: "Understand what is removed",
        text: "The cleaner removes scripts, event-handler attributes, metadata, comments and several unsupported active elements. It removes external resource references and unsafe CSS constructs. Local fragment references such as url(#gradient) are retained where supported, including quoted forms. Accessible titles are retained. The result can still contain vector paths and definitions.",
      },
      {
        title: "Plan for resources that will not survive",
        text: "A linked photograph, external stylesheet or font can be essential to the source artwork but incompatible with the cleanup rules. Non-fragment href resources, including image data URLs, are not a supported preservation route in the current implementation. Prepare essential raster artwork separately or in another trusted editor instead of expecting cleanup to repair a dependency.",
      },
      {
        title: "Review structure as well as appearance",
        text: "The source preview is sanitized before decoding, so it is a safe rendering rather than a raw execution of the uploaded document. Use the report to inspect what changed in the markup. Compare fills, gradients, masks and text, then open the actual download. Removed invisible metadata and removed visible artwork have different practical consequences.",
      },
      {
        title: "Use another workflow for optimization",
        text: "Cleaning does not simplify paths, merge shapes, guarantee the smallest SVG or repair every invalid document. A cleaner file can even serialize differently from the original. If your goal is a fixed-size image accepted by a form, use SVG to Image. Keep the source SVG so you can revise artwork and dependencies without relying only on the cleaned copy.",
      },
    ],
    example: {
      input:
        "An SVG containing a local gradient, comments and an external image reference.",
      settings: "Run cleanup and inspect the source/cleaned report.",
      expected:
        "The local gradient can remain while comments and unsupported linked resources are removed. Check that required artwork still appears.",
    },
    checks: [
      "Review removal counts and confirm required shapes, titles and local references remain usable.",
      "Open the download in the target viewer; do not rely only on a markup-size change.",
    ],
    limitations: [
      "This is conservative sanitization, not a complete security audit or geometric minifier.",
      "Unsupported resources or entities may be removed or rejected rather than repaired.",
    ],
    faq: [
      {
        question: "Will cleanup make every SVG smaller?",
        answer:
          "No. It removes selected content and serializes the document; it does not perform full path or geometry optimization.",
      },
      {
        question: "Why does the safe preview differ from my original editor?",
        answer:
          "The preview is sanitized, and the browser may lack required fonts or supported resources. Review the report and prepare a compatible source.",
      },
    ],
    related: ["svg-to-image", "safe-svg", "favicon-generator"],
    tags: ["Optimize", "SVG Cleaner"],
    published: "2026-10-10",
    updated: "2026-10-10",
    sources: [],
  },
  {
    slug: "image-watermark",
    title: "How to add a text or logo watermark to an image",
    description:
      "Place a multiline mark, control its size and opacity, and check placement on every image in a batch.",
    tools: ["image-watermark"],
    kind: "Tool guide",
    intro:
      "A useful watermark identifies an image without hiding the details people need to see. Image Watermark supports text or a logo, placement presets, dragging and repeated patterns. Start with a short, readable mark and check it on both light and dark parts of the photograph before exporting.",
    steps: [
      "Upload your images and choose Text or Logo in the settings.",
      "Enter watermark text, including line breaks if needed, or upload a logo.",
      "Set size, opacity and position. Drag on the image to place it precisely.",
      "Inspect Preview, choose Add watermark and review the final files before downloading.",
    ],
    sections: [
      {
        title: "Choose a mark that suits the image",
        text: "Text works well for a short name or attribution. The available text families are sans serif, serif and monospace; this tool does not offer every font or custom font uploads. A transparent logo can preserve a designed wordmark. Check the actual logo bounds, since blank space inside the logo file can affect the visible mark size.",
      },
      {
        title: "Balance readability and coverage",
        text: "Size is relative to the source, and opacity controls how strongly the mark overlays the pixels. A pale mark can disappear on a bright sky; a dark one can disappear in shadows. Try different locations while preserving useful faces, labels and product details. Multiline text can need more room than a one-line name, so inspect the whole mark at Fit and 1:1.",
      },
      {
        title: "Use the placement controls deliberately",
        text: "Preset positions give a starting point. Clicking or dragging on the image changes the placement, and advanced controls offer rotation and a repeated pattern. Repeating a mark can cover more area but may distract from the subject. Keep Original available to judge what the watermark obscures; Preview shows the composed export before the main action.",
      },
      {
        title: "Review every batch composition",
        text: "All-image settings use relative placement, while image inspection and active-image scope allow deliberate adjustments. Different aspect ratios can put the same mark across different subjects. Inspect a portrait and a landscape before processing a mixed batch. The result is flattened into the image, so retain the unwatermarked originals for later revisions.",
      },
    ],
    example: {
      input:
        "A portrait and landscape photograph requiring a two-line attribution.",
      settings:
        "Enter a short name and date on separate lines; place the mark away from faces and compare both files.",
      expected:
        "The exported photographs contain the watermark in their pixels. Its size and placement must be checked on each composition.",
    },
    checks: [
      "Verify that every line or logo edge is visible and nothing important is obscured.",
      "Check opacity, rotation and placement in the exact downloads, not only the original view.",
    ],
    limitations: [
      "A watermark is not DRM or a guarantee against removal, cropping or unauthorized use.",
      "Text uses the available font families, and exports contain a flattened mark rather than an editable watermark layer.",
    ],
    faq: [
      {
        question: "How do I start a new text line?",
        answer:
          "Press Enter in Watermark text. Inspect the multiline mark’s full height before exporting.",
      },
      {
        question: "Can I remove it later without losing quality?",
        answer:
          "Keep the original unwatermarked file. The exported mark is part of the pixels and is not a separate editable layer.",
      },
    ],
    related: ["image-contact-sheet", "image-resizer", "image-metadata-remover"],
    tags: ["Protect", "Image Watermark"],
    published: "2026-10-10",
    updated: "2026-10-10",
    sources: [],
  },
  {
    slug: "image-metadata-remover",
    title: "How to remove image metadata and check what remains",
    description:
      "Choose between preserving compressed image data and re-encoding pixels, with clear orientation and privacy limits.",
    tools: ["image-metadata-remover"],
    kind: "Tool guide",
    intro:
      "A photograph can contain descriptive tags in addition to visible pixels. Image Metadata Remover offers a preserve mode for supported JPG, PNG and WebP files, or a raster re-encode mode. Removing tags is only one part of a privacy review: faces, addresses and identifying objects can remain visible in the picture.",
    steps: [
      "Upload the image and inspect its orientation and visible identifying details.",
      "Choose Preserve image data or Re-encode pixels in Removal method.",
      "Process the image and read any orientation or format warning.",
      "Download the result, reopen it and inspect remaining metadata with a suitable viewer when privacy matters.",
    ],
    sections: [
      {
        title: "Preserve mode avoids unnecessary image recompression",
        text: "For supported JPG, PNG and WebP containers, preserve mode removes descriptive EXIF, GPS, text tags and thumbnails while retaining the compressed image payload and color profile. It aims to avoid changing picture data merely to remove descriptive tags. It is not a promise to remove every possible identifying byte from every proprietary format.",
      },
      {
        title: "Orientation can require re-encoding",
        text: "Some photos depend on EXIF orientation for upright display. Simply dropping that tag could make the picture appear sideways or mirrored, so preserve mode rejects cases requiring orientation handling. Use pixel re-encoding when appropriate, then inspect the actual saved orientation. Do not work around the warning by assuming all viewers display the source identically.",
      },
      {
        title: "Re-encode mode has different tradeoffs",
        text: "Re-encoding draws decoded pixels into a new still image. Source camera tags are not copied, but compression, animation and color-profile preservation can change. Inspect image detail and colors as well as the metadata outcome. Choose the format and quality for the intended recipient rather than treating re-encoding as a byte-for-byte preservation method.",
      },
      {
        title: "Complete the privacy review",
        text: "Check the filename and visible picture for names, documents, screens, locations and reflections. Tag removal does not anonymize a face, hide a street sign or eliminate information held by the service where you later upload the result. Keep the original privately and inspect the exact file you intend to share, not a different preview or earlier export.",
      },
    ],
    example: {
      input:
        "A JPG with camera tags that displays correctly without an EXIF orientation transform.",
      settings:
        "Use Preserve image data, then inspect the saved file in a metadata viewer.",
      expected:
        "Descriptive tags should be removed while the image payload and color profile remain. An orientation-dependent source may instead require re-encoding.",
    },
    checks: [
      "Reopen the download and check orientation, appearance and descriptive tags.",
      "Review the filename and visible contents for identifying information that tags cannot hide.",
    ],
    limitations: [
      "Metadata removal does not guarantee anonymity or remove visible private information.",
      "Preserve mode is format-specific; re-encoding can change image quality, color profiles and animation.",
    ],
    faq: [
      {
        question: "Why does preserve mode reject my phone photo?",
        answer:
          "Its visible orientation may depend on an EXIF transform. Use re-encoding and verify the resulting orientation.",
      },
      {
        question: "Does this make a photo anonymous?",
        answer:
          "No. The image itself, filename and sharing destination can still reveal information. Review those separately.",
      },
    ],
    related: ["image-secret-message", "image-watermark", "image-formats"],
    tags: ["Protect", "Image Metadata Remover"],
    published: "2026-10-10",
    updated: "2026-10-10",
    sources: [],
  },
  {
    slug: "image-secret-message",
    title: "How to hide and recover an encrypted message in a PNG",
    description:
      "Use a password, respect the image’s message capacity and keep the exported PNG unchanged for recovery.",
    tools: ["image-secret-message"],
    kind: "Tool guide",
    intro:
      "Secret Message in PNG stores password-encrypted text in image pixels and can recover messages created by the tool. The carrier must remain unchanged: resizing, filters, cropping or lossy conversion can destroy its stored bits. Treat this as a specific file workflow, not a promise that a message is undetectable or that a password can be recovered.",
    steps: [
      "Choose Hide message, upload a carrier image and enter a password and message.",
      "Check the displayed remaining capacity, especially for long or multilingual text.",
      "Create the result and download the generated PNG without further editing it.",
      "To recover, upload that exact PNG in Read message, enter the password and download the recovered text.",
    ],
    sections: [
      {
        title: "Capacity is about encoded bytes",
        text: "The available capacity depends on the carrier’s pixel count and the encrypted payload overhead. Characters can take different numbers of bytes, so a short-looking multilingual message may use more capacity than expected. Read the workspace capacity feedback instead of guessing a maximum character count. If needed, shorten the message or use a larger suitable carrier within the image limits.",
      },
      {
        title: "Keep the carrier file intact",
        text: "The output is a PNG because the pixel values carrying the message must survive saving. Do not convert it to JPG, resize it, sharpen it or run it through another image compressor. Even a visually identical transformed image can change the stored values. Share or archive the file as a document where possible if an application otherwise recompresses images.",
      },
      {
        title: "Use a password you can retain safely",
        text: "The message is password encrypted; a wrong password fails recovery. The tool does not provide an account-based recovery service or a way to reconstruct a forgotten password. A weak password is still a weak password. Test a non-sensitive message first, and do not publish the password alongside the carrier when separation matters.",
      },
      {
        title: "Verify a complete round trip",
        text: "Before relying on the workflow, read the message back from the exact saved PNG. Check punctuation, line breaks and non-ASCII characters. If the file passes through another application, test the returned copy as well. The carrier’s ordinary filename and visible image are not hidden, and message encryption does not make the whole file anonymous.",
      },
    ],
    example: {
      input: "A carrier image and a short two-line practice message.",
      settings:
        "Hide it with a retained password, download the PNG, then read that file with the same password.",
      expected:
        "The recovered text should match the practice message. A wrong password or altered carrier should not be treated as a recoverable success.",
    },
    checks: [
      "Read back the exact downloaded PNG and compare every line of text.",
      "Keep a secure record of the password and test copies after any sharing workflow.",
    ],
    limitations: [
      "Editing, resizing or lossy conversion can destroy the message.",
      "This is not guaranteed undetectable steganography, password recovery or a general encrypted-file container.",
    ],
    faq: [
      {
        question: "Why did recovery fail after sending the image?",
        answer:
          "The sending application may have resized or recompressed it. Test the original downloaded PNG and share an unchanged file copy.",
      },
      {
        question: "Can I recover a forgotten password?",
        answer:
          "The tool has no password-recovery feature. Keep the password safely and verify recovery before relying on the file.",
      },
    ],
    related: ["image-metadata-remover", "image-formats", "jpg-to-png"],
    tags: ["Protect", "Secret Message in PNG"],
    published: "2026-10-10",
    updated: "2026-10-10",
    sources: [],
  },
  {
    slug: "passport-photo",
    title: "How to prepare a passport-size photo layout and print sheet",
    description:
      "Set millimeter dimensions and pixel density, crop deliberately and check the current recipient requirements.",
    tools: ["passport-photo"],
    kind: "Tool guide",
    intro:
      "Passport Photo Layout prepares a chosen rectangular size and a separate 6 × 4 inch sheet. It does not certify that a photograph meets an authority’s rules. Check current requirements for pose, background, face size, dimensions and file format before editing, and keep the final recipient or print instructions in view.",
    steps: [
      "Upload the photograph and enter the required width and height in millimeters and the intended DPI.",
      "Use Select area to place the crop around the subject, then inspect Preview.",
      "Review both the individual photo and 6 × 4 sheet options.",
      "Create the photos, download the required outputs and verify digital dimensions or physical print size.",
    ],
    sections: [
      {
        title: "Translate physical size into pixels deliberately",
        text: "The tool calculates pixels from millimeters and the selected DPI using 25.4 millimeters per inch. More pixels are not a compliance guarantee. Check the displayed dimensions against your recipient’s requirements. The PNG export does not rewrite DPI metadata, so a printer may not automatically choose the physical size you entered.",
      },
      {
        title: "Inspect the face and the crop",
        text: "The crop is adapted to the selected output aspect ratio, and a centered adjustment can remove more of the selected rectangle than you expect. Check the top of the head, chin, shoulders and surrounding space. This tool does not detect face position, enforce head-size rules or replace an unsuitable background with a compliant one.",
      },
      {
        title: "Print the sheet at the intended size",
        text: "The sheet is a 6 × 4 inch canvas at the selected pixel density, with repeated copies that fit inside it. Print at 6 × 4 inches rather than using an arbitrary fit-to-page setting. Measure a photo after printing. If the chosen photo size cannot fit on that sheet, processing reports the issue instead of producing a misleading layout.",
      },
      {
        title: "Keep authority checks separate from layout checks",
        text: "Rules can differ between a passport, visa, school form and membership application. Look up the current recipient instructions and check the exact downloaded file or print. A correct rectangle does not establish acceptable lighting, expression, attire or identity. Mixed batches produce a separate sheet for each source photograph, not one mixed-person sheet.",
      },
    ],
    example: {
      input: "An illustrative 35 × 45 mm photo layout at 300 DPI.",
      settings:
        "Enter 35 and 45 mm and select 300 DPI; place the crop carefully.",
      expected:
        "The individual canvas is about 413 × 531 pixels, and the sheet is 1,800 × 1,200 pixels. These sizes illustrate the calculation, not a universal passport requirement.",
    },
    checks: [
      "Verify the current recipient rules and check the displayed and downloaded pixel dimensions.",
      "For printing, select 6 × 4 inches, measure the resulting photos and inspect face placement.",
    ],
    limitations: [
      "The tool does not certify passport or visa compliance or automatically validate faces.",
      "PNG DPI metadata is unchanged; physical print size depends on the print workflow.",
    ],
    faq: [
      {
        question: "Is 35 × 45 mm correct for every application?",
        answer:
          "No. Use the current dimensions and appearance rules published by your specific recipient.",
      },
      {
        question: "Why did the printer make the photos too large?",
        answer:
          "The printer may have fitted the sheet to another page size. Print the complete sheet at 6 × 4 inches and measure the output.",
      },
    ],
    related: ["image-crop", "image-size-reducer", "image-contact-sheet"],
    tags: ["Create", "Passport Photo Layout"],
    published: "2026-10-10",
    updated: "2026-10-10",
    sources: [],
  },
  {
    slug: "signature-cleaner",
    title: "How to clean a signature scan and preserve faint strokes",
    description:
      "Remove pale paper, restore important detail and trim margins before preparing the required file size.",
    tools: ["signature-cleaner"],
    sections: [
      {
        title: "Use the appropriate input",
        text: "A dark signature on pale, evenly lit paper works best. Strong shadows, textured paper and colored ink may need manual editing elsewhere. Upload the scan, inspect its original pixels, and start with a modest paper-cleanup threshold.",
      },
      {
        title: "Protect important strokes",
        text: "Increase paper cleanup until the background becomes transparent without losing faint lines. Use Restore brush to paint original pixels back where cleanup removed important detail. Undo reverts a change and Clear restoration removes restoration strokes. Inspect at 1:1 rather than relying on a small fit preview.",
      },
      {
        title: "Trim and choose an output",
        text: "Crop padding controls the margin around detected dark ink. PNG keeps transparent paper areas; JPG uses an opaque matte. The final preview is decoded from the export, so inspect edges and thin strokes there before downloading. Very faint or colored marks may fall outside the dark-ink crop detector.",
      },
      {
        title: "Meet an application limit",
        text: "Continue to the size reducer if a form requires a strict byte limit. Enter the permitted format and dimensions as well as maximum KB. Cleanup alone does not certify a signature, guarantee acceptance or necessarily produce the smallest possible file.",
      },
    ],
    kind: "Tool guide",
    intro:
      "Signature Cleaner works best with dark ink on pale, evenly lit paper. It removes light background pixels and crops around detected dark marks. A careful preview matters more than an aggressive cleanup value: the smallest-looking signature is not useful if a faint stroke disappears or the recipient requires a different background.",
    steps: [
      "Upload the scan and start with a modest Paper cleanup value.",
      "Inspect Preview at 1:1 and increase cleanup only while the strokes remain intact.",
      "Use Restore brush on the original where detail needs to return, then choose Crop padding.",
      "Select the export format, clean the signature and inspect the final file before reducing its bytes if necessary.",
    ],
    example: {
      input:
        "A dark signature on white paper with an important faint pen stroke.",
      settings:
        "Increase Paper cleanup gradually, restore the faint stroke and retain a modest crop margin.",
      expected:
        "The result should remove pale paper without cutting the intended signature. Its byte count is a separate check.",
    },
    checks: [
      "Compare every important stroke with the original at 1:1 and inspect the crop margin.",
      "Verify the required format, background, dimensions and bytes in the actual download.",
    ],
    limitations: [
      "Dark-ink detection can miss very faint or colored marks, shadows and textured paper.",
      "Cleaning does not verify a signature, guarantee acceptance or provide a cryptographic digital signature.",
    ],
    faq: [
      {
        question: "Why does it say no signature was found?",
        answer:
          "Lower Paper cleanup or choose a clearer scan with darker ink and more even lighting.",
      },
      {
        question: "How do I meet a 20 KB form limit?",
        answer:
          "First check that the cleaned signature is complete, then use the size reducer with the permitted format and dimensions.",
      },
    ],
    related: ["image-size-reducer", "image-background-remover", "image-crop"],
    tags: ["Optimize", "Signature Cleaner"],
    published: "2026-10-10",
    updated: "2026-10-10",
    sources: [],
  },
  {
    slug: "image-id-card",
    title: "How to create a simple membership-card image",
    description:
      "Add a photo, name and membership details to a fixed-size card layout and check its readable output.",
    tools: ["image-id-card"],
    kind: "Tool guide",
    intro:
      "ID Card Designer creates simple membership-card artwork from a photo and short text. It is useful for a club or example layout, but it does not establish identity, issue a credential or provide a secure badge system. Keep the purpose clear and obtain permission to use someone’s photograph and details.",
    steps: [
      "Upload the portrait you want on the card.",
      "Enter Name and short Membership details in the settings.",
      "Inspect Preview for photo framing and readable text.",
      "Create the card, download the image and test its display or print size.",
    ],
    sections: [
      {
        title: "Use a portrait that suits the fixed layout",
        text: "The output is a 1,011 × 638 pixel card with a fixed portrait area and text arrangement. The portrait is fitted to cover its area, so edge cropping can occur. Inspect the face and shoulders rather than assuming the full uploaded photo will appear. Crop your source deliberately beforehand if the automatic centered framing is unsuitable.",
      },
      {
        title: "Keep the text short and clear",
        text: "The name and membership details are designed as short fields. Long text is fitted to the available width and can become small. Although the details control allows text entry with line breaks, the fixed card renderer is not a general multiline document-layout engine. Prefer a concise single line and inspect the exact preview rather than assuming every line will flow.",
      },
      {
        title: "Choose a useful final format",
        text: "The exported card is a flattened image, not an editable template or a database record. PNG can keep crisp lettering; JPG or WebP quality should be checked around small text. A screen preview at Fit can hide legibility problems, so inspect at 1:1 and at the intended real display or print size.",
      },
      {
        title: "Separate artwork from credential issuance",
        text: "There are no issuer verification, QR validation, access permissions or tamper-proof credential features. Do not treat a card image as an official identity document. For a real organization, use an appropriate issuing process and keep personal data handling separate from making the graphic. Retain the source photo and text privately if you need revisions.",
      },
    ],
    example: {
      input:
        "A club portrait, the name “Alex” and the short detail “Member · 001”.",
      settings: "Enter the short fields and inspect the fixed portrait crop.",
      expected:
        "The result is 1,011 × 638 pixel membership-card artwork. It is not a verified identity credential.",
    },
    checks: [
      "Check the portrait crop and all text at actual size and the intended viewing size.",
      "Verify the spelling and avoid including unnecessary private information in the shared image.",
    ],
    limitations: [
      "The layout is fixed and does not offer arbitrary templates, editable layers or verified credentials.",
      "Long or multiline details may not lay out as a paragraph; keep fields short and inspect them.",
    ],
    faq: [
      {
        question: "Can I use this as an official ID?",
        answer:
          "The tool creates artwork only. It does not verify identity or meet every authority’s issuing requirements.",
      },
      {
        question: "Can I customize every part of the layout?",
        answer:
          "No. The current tool uses a fixed card design with a photo, name and short details.",
      },
    ],
    related: ["image-crop", "image-resizer", "image-watermark"],
    tags: ["Create", "ID Card Designer"],
    published: "2026-10-10",
    updated: "2026-10-10",
    sources: [],
  },
  {
    slug: "image-color-picker",
    title: "How to sample an image color and copy HEX or RGB",
    description:
      "Select a source pixel, check its transparency and use precise coordinates for repeatable samples.",
    tools: ["image-color-picker"],
    kind: "Tool guide",
    intro:
      "Image Color Picker reads the color at one chosen pixel. It is useful for matching a visible detail or recording a specific source location, but it does not automatically produce a dominant-color palette. A shadow, antialiased edge or translucent pixel can differ from the solid color you intended to sample.",
    steps: [
      "Upload the image and click the intended pixel on the canvas.",
      "Use Sample X and Sample Y for precise source-pixel coordinates.",
      "Read HEX, RGB and Alpha; move the sample if it lands on an edge.",
      "Copy HEX or RGB, or download the sampled-color JSON record.",
    ],
    sections: [
      {
        title: "Pick an appropriate region",
        text: "For a flat logo color, choose an interior area rather than the edge or shadow. An antialiased border mixes colors, and a JPG can include compression variations even inside a seemingly flat patch. Sample several nearby positions manually if needed. The tool reports a single pixel, not a statistical average of a selected region.",
      },
      {
        title: "Use source coordinates for repeatability",
        text: "Numeric coordinates refer to the uploaded image, independent of workspace zoom. Arrow keys in the coordinate fields move one source pixel at a time. Fit gives context, while zoom helps you target a small detail. Record the coordinates together with the file version if another person needs to reproduce the sample.",
      },
      {
        title: "Read alpha as well as the color code",
        text: "The HEX and RGB values describe color channels; Alpha describes opacity. A partially transparent pixel’s displayed appearance also depends on the background behind it. Copying only HEX does not capture that transparency. If you need to match a composited appearance, inspect it on the intended background and document the opacity separately.",
      },
      {
        title: "Check color expectations across applications",
        text: "The sample comes from the browser-decoded raster image. It is not a print-production color measurement or a guarantee of matching every source color profile. Test the copied value in your destination and consider display differences. The JSON download records the selected sample; it is not a complete palette or a conversion to CMYK.",
      },
    ],
    example: {
      input: "A 400 × 240 graphic with a solid colored region in its center.",
      settings:
        "Sample an interior pixel and record its X/Y values, HEX, RGB and Alpha.",
      expected:
        "The copied values describe that one decoded source pixel. They may differ from an edge or a transparent part of the graphic.",
    },
    checks: [
      "Confirm the sample location is the intended interior pixel and read its alpha value.",
      "Test the copied color in the destination and retain the source file version for repeatability.",
    ],
    limitations: [
      "This tool samples one pixel; it does not extract a whole palette or provide CMYK/print calibration.",
      "Decoded color channels and displayed appearance can differ when transparency or color management is involved.",
    ],
    faq: [
      {
        question: "Why do nearby pixels have different colors?",
        answer:
          "Edges, shadows, textures and compression can vary their values. Sample a solid interior region when you want its base color.",
      },
      {
        question: "Does HEX include the alpha value shown?",
        answer:
          "The displayed color code and the alpha readout are separate. Record opacity too if the sample is translucent.",
      },
    ],
    related: ["image-background-remover", "image-adjustments", "image-formats"],
    tags: ["Create", "Image Color Picker"],
    published: "2026-10-10",
    updated: "2026-10-10",
    sources: [],
  },
  {
    slug: "favicon-generator",
    title: "How to generate and install a favicon package",
    description:
      "Review tiny icon sizes, download matching package files and check the manifest and installation URLs.",
    tools: ["favicon-generator"],
    sections: [
      {
        title: "Choose a readable source",
        text: "Use a simple, roughly square logo with enough contrast at very small sizes. Upload it, set the site name and create the package. Inspect the 16 and 32 pixel results at actual size; detailed text often becomes unreadable at those sizes.",
      },
      {
        title: "Download the complete package",
        text: "The tool exports seven PNG sizes, a multi-size ICO, a web manifest and an installation snippet. Download all as ZIP to preserve the relative filenames. For a single source the files remain at the ZIP root. Multiple sources receive separate folders so packages do not overwrite each other.",
      },
      {
        title: "Install with the correct URL base",
        text: "Extract one package and place its files together at the intended public URL. Use the included snippet as a starting point and adapt root-relative paths if installing into a subdirectory. The manifest icon paths are relative to the manifest file. Keep filenames consistent rather than downloading only one randomly renamed icon.",
      },
      {
        title: "Check the deployed site",
        text: "Open the icon and manifest URLs directly, inspect the browser tab and test a fresh browser session. Favicon caches can retain an earlier icon. The generator produces artwork and supporting files; your hosting and application configuration determine how browsers discover them.",
      },
    ],
    kind: "Tool guide",
    intro:
      "A favicon must remain recognizable at a size where a detailed logo or wordmark can disappear. Favicon Generator creates a small package of raster icons and supporting files. Start with simple artwork, then test both the generated sizes and the actual URLs used by your deployed site.",
    steps: [
      "Upload a simple, roughly square logo and enter the Site name.",
      "Create the package and inspect the small icon previews at actual size.",
      "Download all as ZIP so the icon, manifest and snippet filenames stay together.",
      "Install one package at the intended URL location and test the browser tab and direct file URLs.",
    ],
    example: {
      input: "A simple square mark for one website.",
      settings:
        "Generate the package, inspect 16 and 32 pixel previews and extract its ZIP.",
      expected:
        "The package contains seven PNG icons, one multi-size ICO, a web manifest and a text installation snippet. Paths must still match your hosting location.",
    },
    checks: [
      "Open icon and manifest URLs directly and confirm that the manifest references files in the installed package.",
      "Test small-size readability and a fresh browser session after deployment.",
    ],
    limitations: [
      "The generator creates assets, not a hosted installation or a complete PWA configuration.",
      "Browser caches and application configuration affect discovery. A favicon package does not itself make a site installable.",
    ],
    faq: [
      {
        question: "Why does the browser still show my old icon?",
        answer:
          "Check the installed URLs and application markup, then test a fresh browser session. Favicon caches can retain an earlier asset.",
      },
      {
        question: "Should I upload only favicon.ico?",
        answer:
          "Use the included snippet as a starting point and install the matching files you reference. The PNG and manifest files serve different supported discovery routes.",
      },
    ],
    related: ["svg-to-image", "image-crop", "image-color-picker"],
    tags: ["Create", "Favicon Generator"],
    published: "2026-10-10",
    updated: "2026-10-10",
    sources: [
      {
        label: "MDN: web manifest icon paths",
        url: "https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/icons",
      },
    ],
  },
  {
    slug: "image-contact-sheet",
    title: "How to make a photo contact sheet with filenames",
    description:
      "Arrange multiple images in a compact overview, control columns and tile size, and verify order and labels.",
    tools: ["image-contact-sheet"],
    kind: "Tool guide",
    intro:
      "A contact sheet helps you review a set of photographs without opening each one separately. Photo Contact Sheet combines the selected files into one image, with optional filename labels. It is an overview, not a substitute for the full-resolution originals or a guarantee that small text will remain readable.",
    steps: [
      "Upload the photographs and add more files if needed.",
      "Use the file strip to put the images in the intended order.",
      "Set Columns, Tile width and Background color; choose whether to show filenames.",
      "Inspect the complete Preview, create the sheet and check the downloaded image.",
    ],
    sections: [
      {
        title: "Decide the reading order first",
        text: "The sheet follows the workspace file order, laid out across rows. Use the file-strip reorder controls before processing, and review the first and last row. A numbered filename can help distinguish similar photographs, but the filename itself may expose private names or locations if labels are enabled.",
      },
      {
        title: "Choose columns and tile width together",
        text: "More columns make a wider sheet at a given tile width. Tile width controls how much detail each thumbnail can show, while labels add space to the layout. Check the complete preview rather than multiplying dimensions from memory. The total output must remain inside the workspace side-length and pixel-budget limits.",
      },
      {
        title: "Check portrait and landscape thumbnails",
        text: "Images of different shapes do not all use the same visible picture area. Inspect whether a thumbnail preserves the detail you need and whether the chosen background makes spare space understandable. A contact sheet is meant for browsing; inspect individual original files when you need to judge sharpness, tiny text or exact color.",
      },
      {
        title: "Prepare the shared overview deliberately",
        text: "Choose Show filenames only when the labels help the recipient. Recheck spelling and private information in those names. Save the sheet with a useful descriptive filename and reopen it at the intended viewing size. If it is too crowded, use fewer columns, larger tiles within the limits, or split the input set into smaller sheets.",
      },
    ],
    example: {
      input: "Six photographs needing one labeled review image.",
      settings:
        "Arrange their order, choose three columns and enable Show filenames.",
      expected:
        "The six images are presented in two rows. The actual sheet dimensions include the configured tile layout and any label area.",
    },
    checks: [
      "Confirm image order, the complete last row and label visibility.",
      "Inspect the download at the recipient’s viewing size and check labels for private information.",
    ],
    limitations: [
      "This creates one flattened overview image and does not preserve full-resolution originals inside it.",
      "Very large tile/column combinations can exceed the output pixel budget.",
    ],
    faq: [
      {
        question: "Can I rearrange the pictures?",
        answer:
          "Yes. Use the workspace file strip to reorder them before creating the sheet.",
      },
      {
        question: "Why are the small captions hard to read?",
        answer:
          "The sheet may be displayed too small or contain too many tiles. Increase usable tile size, reduce the columns or split the batch.",
      },
    ],
    related: ["image-resizer", "image-watermark", "passport-photo"],
    tags: ["Create", "Photo Contact Sheet"],
    published: "2026-10-10",
    updated: "2026-10-10",
    sources: [],
  },
  {
    slug: "image-adjustments",
    title: "How to adjust brightness, contrast and saturation",
    description:
      "Balance light and color with reversible settings, then inspect clipping and detail in the exported image.",
    tools: ["image-adjustments"],
    kind: "Tool guide",
    intro:
      "Brightness & Contrast offers three practical controls: brightness, contrast and saturation. Use them to improve a readable image rather than pushing every slider upward. Compare with the original throughout, because a brighter preview can hide lost highlight detail and stronger contrast can bury information in shadows.",
    steps: [
      "Upload the image and start from the neutral adjustment values.",
      "Change one slider at a time: brightness, contrast or saturation.",
      "Compare Original and Preview at Fit and 1:1. Use the adjustment reset if needed.",
      "Apply adjustments and inspect the final download before sharing it.",
    ],
    sections: [
      {
        title: "Separate the three choices",
        text: "Brightness changes the overall lightness scale used by the tool. Contrast changes separation around midtones. Saturation changes the color mix relative to luminance. A value that helps one photo can make another look unnatural, so begin with small changes and compare against the original instead of treating a preset percentage as a universal correction.",
      },
      {
        title: "Protect highlights and shadows",
        text: "Inspect pale clouds, paper texture, dark clothing and hair. When light regions become flat white or dark regions become solid black, useful detail may be clipped. Lower an aggressive setting rather than assuming sharpening can bring that information back. Tiny fit previews can conceal this problem, especially on a phone with a bright display.",
      },
      {
        title: "Check faces and meaningful colors",
        text: "Strong saturation can distort skin tones and make product colors misleading. For a chart or evidence image, preserve the meaning of the colors and avoid presenting an edited picture as an untouched record. If monochrome is the goal, compare with the dedicated Grayscale tool, which makes the intended change easier to review.",
      },
      {
        title: "Inspect the encoded result",
        text: "The selected export format and quality can affect detail beyond the adjustments themselves. Compare the encoded Preview, then inspect Final result after processing. For a batch, check examples with different lighting before applying shared settings. Keep originals so you can revise the adjustment without repeatedly editing a compressed export.",
      },
    ],
    example: {
      input:
        "A slightly dim product photograph with readable detail in both light and dark areas.",
      settings:
        "Increase brightness modestly, then compare a small contrast adjustment before changing saturation.",
      expected:
        "The result should improve visibility without flattening highlights, burying shadows or changing the product color misleadingly.",
    },
    checks: [
      "Inspect bright and dark detail at 1:1 and compare skin or product colors with the original.",
      "Reopen the downloaded image and verify its chosen quality and background.",
    ],
    limitations: [
      "These are global pixel adjustments, not RAW development, selective masking or a color-calibrated workflow.",
      "Clipped or missing source detail cannot be reliably recovered by increasing another slider.",
    ],
    faq: [
      {
        question: "Why does stronger contrast lose detail?",
        answer:
          "It can push light pixels toward white and dark pixels toward black. Use smaller changes and inspect both ends of the tonal range.",
      },
      {
        question: "Can it fix only one dark area?",
        answer:
          "The current adjustments apply globally. They do not provide a selective brush or exposure mask.",
      },
    ],
    related: ["image-grayscale", "image-sharpen", "image-compressor"],
    tags: ["Edit", "Brightness & Contrast"],
    published: "2026-10-10",
    updated: "2026-10-10",
    sources: [],
  },
  {
    slug: "image-sharpen",
    title: "How to sharpen an image without creating harsh edges",
    description:
      "Use modest sharpening, inspect halos and noise at actual size, and distinguish sharpening from recovery.",
    tools: ["image-sharpen"],
    kind: "Tool guide",
    intro:
      "Sharpening increases local edge contrast. It can make an already useful image appear crisper, but it does not reconstruct a missing letter or turn an out-of-focus photograph into a genuinely sharp original. Start low, inspect at actual size and stop when the added edge contrast becomes more distracting than helpful.",
    steps: [
      "Upload the image and inspect Original at 1:1.",
      "Increase Strength gradually and compare Preview.",
      "Review text edges, hair, noise and bright/dark boundaries.",
      "Apply sharpening, download the result and inspect it at the intended viewing size.",
    ],
    sections: [
      {
        title: "Understand the visible effect",
        text: "The tool applies a sharpening filter to neighboring pixel values. It emphasizes local contrast rather than recovering a higher-resolution scene. A low setting can help an image that already contains useful edges; a strong setting can create artificial outlines. Choose the amount for the actual source, not because a high percentage sounds like higher quality.",
      },
      {
        title: "Look for halos and noise",
        text: "Inspect dark text on light paper, rooflines against the sky and hair around a face. Bright or dark fringes along those edges suggest too much sharpening. Grain and compression artifacts may also become more visible. Compare Original and Preview at 1:1, because a fit view can make an overly sharpened result appear deceptively crisp.",
      },
      {
        title: "Resize before evaluating the final appearance",
        text: "If the destination needs a much smaller image, resize it deliberately and judge a copy at that output size. A sharpening choice for the original resolution may not look the same after resizing or recompression. Avoid repeatedly applying sharpening to previous sharpened JPG exports. Retain the original to start another version cleanly.",
      },
      {
        title: "Check encoding and context",
        text: "Export format and quality can add artifacts or soften details independently of the filter. Inspect the decoded preview and the exact download. For a chart, document scan or product image, consider whether artificial edges might mislead the viewer. If the source is unreadable, obtain a clearer source instead of treating a sharper-looking outline as recovered evidence.",
      },
    ],
    example: {
      input:
        "A readable photograph that appears slightly soft at its intended display size.",
      settings: "Try a modest Strength and compare a high amount at 1:1.",
      expected:
        "Choose the version that improves edge clarity without visible halos or exaggerated noise. No recovered-detail claim follows from the slider.",
    },
    checks: [
      "Inspect high-contrast edges, text and noisy areas at actual size.",
      "Check the export at its intended display size and reject obvious halos.",
    ],
    limitations: [
      "Sharpening does not restore lost resolution, missing text or true out-of-focus detail.",
      "Strong filtering can emphasize noise and create artificial edge halos.",
    ],
    faq: [
      {
        question: "Can this recover an unreadable blurred number?",
        answer:
          "Do not rely on it. Sharpening emphasizes existing edge contrast rather than reconstructing reliable missing information.",
      },
      {
        question: "Why does the picture look grainier?",
        answer:
          "Sharpening can emphasize noise and compression artifacts. Lower the amount or use a cleaner source.",
      },
    ],
    related: ["image-resizer", "image-adjustments", "image-compressor"],
    tags: ["Edit", "Image Sharpen"],
    published: "2026-10-10",
    updated: "2026-10-10",
    sources: [],
  },
  {
    slug: "image-formats",
    title: "Choose JPG, PNG or WebP without surprising your image",
    description:
      "Understand transparency, quality and encoded previews when compressing or converting images.",
    tools: ["image-compressor", "jpg-to-png", "png-to-jpg", "image-to-webp"],
    sections: [
      {
        title: "Choose the format for the task",
        text: "JPG usually suits photographs but cannot store transparency. PNG suits sharp lines and transparent artwork. WebP supports transparency and adjustable lossy quality. Conversion does not recover detail already lost in a JPG or remove its background.",
      },
      {
        title: "Inspect the encoded preview",
        text: "Upload an image and choose an export format where available. Adjust JPG or WebP quality, wait for Preview to update, and inspect details at 1:1. Preview is decoded from an encoded file rather than showing only an uncompressed canvas. Final result shows the processed download after the main action.",
      },
      {
        title: "Protect transparent pixels",
        text: "PNG to JPG needs a background color because JPG is opaque. Check the chosen matte around hair, logos and rounded edges. PNG browser encoding ignores the quality slider; a smaller PNG is not guaranteed. Re-encoding animated images produces a still image.",
      },
      {
        title: "Work with several images",
        text: "Add images appends to the workspace; Replace starts a new set. Settings can apply to all images or the active image. Run the tool, download individually or use ZIP, and inspect any per-file errors. A failed image does not discard completed downloads. For a strict byte limit use the size reducer instead of guessing a quality percentage.",
      },
    ],
    kind: "Comparison",
    intro:
      "Choose an image format for the destination rather than following a universal ranking. Photographs, logos and screenshots have different needs, and a form may allow fewer formats than a website. This overview explains how the supported Studio Lab exports differ, then points to the dedicated conversion and compression guides.",
    steps: [
      "Check the recipient’s permitted format and any byte or dimension limit.",
      "Decide whether transparent pixels or sharp lettering matter.",
      "Try the relevant converter or compressor and compare its encoded Preview with Original.",
      "Download the chosen result and test it in the actual destination.",
    ],
    example: {
      input:
        "A transparent logo and an opaque photograph for the same website.",
      settings:
        "Compare a transparency-capable export for the logo and a quality-controlled export for the photograph.",
      expected:
        "The best choice can differ between the two images; verify actual bytes and visible edges.",
    },
    checks: [
      "Inspect alpha, fine text and actual bytes in the saved file.",
      "Remember that these image tools re-encode still images; animation is not preserved by ordinary conversion.",
    ],
    limitations: [
      "Format conversion does not recover information lost in an earlier export.",
      "No format or quality percentage guarantees a smaller file for every source.",
    ],
    faq: [
      {
        question: "Is PNG always better quality?",
        answer:
          "PNG encoding can retain the decoded pixels, but it cannot restore detail already lost in the source and may use more bytes.",
      },
      {
        question: "Which tool should I use for a maximum KB?",
        answer:
          "Use Photo & Signature Size Reducer with the destination’s allowed JPG or PNG format.",
      },
    ],
    related: ["jpg-to-png", "png-to-jpg", "image-to-webp", "image-compressor"],
    tags: ["Formats", "Workflow"],
    published: "2026-10-10",
    updated: "2026-10-10",
    sources: [
      {
        label: "MDN: image formats and transparency",
        url: "https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Image_types",
      },
    ],
  },
  {
    slug: "resize-or-crop",
    title: "Resize versus crop: keep the dimensions you intended",
    description:
      "Use aspect locks, source-pixel selections and canvas zoom to prepare an image accurately.",
    tools: ["image-resizer", "image-crop", "image-rotate"],
    sections: [
      {
        title: "Resize changes the output dimensions",
        text: "Set width and height in pixels or use a scale percentage. Keep aspect ratio links both dimensions. Fit keeps the full image inside the target canvas; Fill crops edges; Stretch changes proportions. Do not enlarge smaller images prevents upscaling. Inspect the preview for padding or cropping before creating the result.",
      },
      {
        title: "Crop chooses a smaller source area",
        text: "Use Select area, drag a rectangle, and move or resize its handles. Choose a fixed aspect ratio when the destination requires one. Exact selection controls use source-image pixels, independent of zoom. Preview shows the resulting crop; the selection view keeps the original available for adjustment.",
      },
      {
        title: "Zoom without changing the file",
        text: "Plus and minus change the canvas view, Fit restores a whole-image view and 1:1 shows one preview pixel per display CSS pixel. Pan with the hand control or hold Space and drag. Touch supports pinch zoom. Zoom controls do not resize the downloaded image.",
      },
      {
        title: "Batch settings and recovery",
        text: "Output dimensions remain shared when switching files. Placement is scaled relative to each source for all-image processing. Inspect different aspect ratios individually; a crop appropriate for one photograph may need adjustment for another. Undo reverts settings changes, while Reset restores defaults. Neither overwrites the uploaded file.",
      },
    ],
    kind: "Comparison",
    intro:
      "Resize, crop and canvas zoom solve different problems. Resize controls output dimensions, crop chooses which source area remains, and zoom only changes the workspace view. Make those decisions separately so a correctly sized export does not contain distorted faces or an accidental cut-off subject.",
    steps: [
      "Identify the required output dimensions and composition.",
      "Crop unwanted source edges if necessary, checking the subject.",
      "Resize the retained image with deliberate aspect and fit settings.",
      "Use 1:1 to inspect detail and verify the saved pixel dimensions.",
    ],
    example: {
      input: "A landscape image needed as a square profile picture.",
      settings:
        "Choose the square composition with Image Crop, then resize to the destination’s pixel count.",
      expected:
        "The subject should remain inside a square output without being stretched.",
    },
    checks: [
      "Check shape, pixel dimensions and all intended source content.",
      "Do not infer output size from a workspace zoom percentage.",
    ],
    limitations: [
      "Upscaling does not reconstruct real captured detail.",
      "Batch crops use relative placement and need individual composition checks.",
    ],
    faq: [
      {
        question: "Does zoom alter the downloaded dimensions?",
        answer: "No. Use output dimension controls to resize the file.",
      },
      {
        question: "Why does Fill cut off part of the image?",
        answer:
          "Fill covers the target canvas while preserving proportions. Some source edges must be cropped when shapes differ.",
      },
    ],
    related: ["image-resizer", "image-crop", "image-rotate"],
    tags: ["Formats", "Workflow"],
    published: "2026-10-10",
    updated: "2026-10-10",
    sources: [],
  },
  {
    slug: "safe-svg",
    title: "Clean or rasterize a self-contained SVG",
    description:
      "Preserve local gradients while removing active and external SVG content.",
    tools: ["svg-cleaner", "svg-to-image"],
    sections: [
      {
        title: "Prepare a self-contained file",
        text: "Keep required vector shapes and local definitions inside the SVG. External fonts, stylesheets and linked images can be removed. The current sanitizer also removes non-fragment image references, including data URLs. Outline essential text in the source editor if exact lettering matters, and review the safe preview before downloading.",
      },
      {
        title: "Understand conservative cleanup",
        text: "The cleaner removes scripts, comments, metadata, event handlers and external resources. Local fragment references such as url(#gradient) and quoted equivalents are retained. Accessible titles are preserved. Documents containing entity declarations are rejected. This is conservative sanitization, not geometric minification or a promise to repair every SVG.",
      },
      {
        title: "Inspect what changed",
        text: "The safe source preview is sanitized before decoding. Open the cleanup report to compare source and cleaned markup and see removal counts. A missing external asset is expected: make the original self-contained and retry. Inspect fills, masks and gradients before downloading the cleaned SVG.",
      },
      {
        title: "Export pixels when needed",
        text: "SVG to Image lets you choose raster dimensions, fit behavior and an export format. Use PNG for transparency; JPG requires an opaque background. The raster output is bounded by the workspace pixel budget. Preserve the original SVG if you may need another size later.",
      },
    ],
    kind: "Comparison",
    intro:
      "An SVG can depend on more than its visible shapes. Fonts, linked images, stylesheets and active elements affect portability. The Studio Lab SVG tools sanitize the source before rendering, so prepare a self-contained asset and review what changes before choosing a cleaned vector file or fixed-size raster export.",
    steps: [
      "Keep essential shapes and local definitions inside the source SVG.",
      "Use SVG Cleaner to inspect removals and cleaned markup.",
      "Review local gradients, masks and text in the safe preview.",
      "Choose a cleaned SVG or rasterize at deliberate pixel dimensions with SVG to Image.",
    ],
    example: {
      input: "An icon that uses a local gradient and text.",
      settings:
        "Inspect cleanup, then rasterize at the required size if the recipient needs PNG.",
      expected:
        "Local definitions can remain; exact font appearance depends on supported source artwork and browser fonts.",
    },
    checks: [
      "Inspect markup removals as well as the visible result.",
      "Open the downloaded file in the destination viewer and retain the source SVG.",
    ],
    limitations: [
      "The current sanitizer removes non-fragment resource references, including image data URLs.",
      "Cleanup is not complete geometry optimization, and raster exports do not retain vector editing.",
    ],
    faq: [
      {
        question: "Will embedded image data URLs be preserved?",
        answer:
          "Do not assume so. The current sanitizer removes non-fragment linked resources; prepare required artwork in a compatible source workflow.",
      },
      {
        question: "Why use the original SVG for another size?",
        answer:
          "It preserves the vector source. Enlarging a small raster export cannot recreate that vector information.",
      },
    ],
    related: ["svg-cleaner", "svg-to-image", "favicon-generator"],
    tags: ["Formats", "Workflow"],
    published: "2026-10-10",
    updated: "2026-10-10",
    sources: [],
  },
];
