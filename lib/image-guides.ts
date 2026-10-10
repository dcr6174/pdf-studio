/** Image-only tutorials: instructions reflect the browser implementation. */
export const imageGuides = [
  {
    slug: "image-size-reducer",
    title: "Reduce a photo or signature to a strict KB limit",
    description:
      "Set an upload limit, inspect the final image, and understand why dimensions may change.",
    tools: ["image-size-reducer", "signature-cleaner"],
    sections: [
      {
        title: "Start with the portal requirements",
        text: "Check the permitted format, maximum bytes and required dimensions first. The reducer accepts JPG, PNG and WebP up to 25 MB and below 40 megapixels. One KB here means 1,000 bytes; a portal may use a different convention.",
      },
      {
        title: "Make the file fit",
        text: "Upload the image, choose a preset or custom limit, and select JPG or PNG. Optional pixel limits constrain the longest usable dimensions without stretching or enlargement. JPG flattens transparency onto white. PNG retains transparency; it can require smaller dimensions to reach a very small limit.",
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
        text: "The SVG tools accept SVG files up to the image upload limit. Keep required artwork, shapes and definitions inside the file. External fonts, linked images and stylesheets may not survive cleanup. Embed or outline essential artwork in an SVG editor before uploading.",
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
  },
  {
    slug: "favicon-generator",
    title: "Generate and install a consistent favicon package",
    description:
      "Inspect actual icon sizes and use a ZIP whose manifest paths match its files.",
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
  },
  {
    slug: "signature-cleaner",
    title: "Clean a dark signature on plain paper",
    description:
      "Remove pale paper, restore faint strokes and crop margins before reducing file size.",
    tools: ["signature-cleaner", "image-size-reducer"],
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
  },
  {
    slug: "image-background-remover",
    title: "Remove a connected plain background",
    description:
      "Choose a background sample, tune tolerance and restore pixels with clear limitations.",
    tools: ["image-background-remover", "png-to-jpg"],
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
  },
] as const;
