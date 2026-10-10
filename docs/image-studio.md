# Image Studio in Studio Lab

Scope: 25 image-only tools. No PDF tool routes, PDF editor components or PDF processing engines are modified. The existing size reducer keeps its `fitImage` behavior; its presentation becomes a full-viewport workspace.

## Tools and implemented behavior

| Tool | Behavior |
| --- | --- |
| Photo & signature size reducer | Existing measured KB ceiling, presets, optional pixel bounds, JPG/PNG, original/result comparison |
| Image compressor | Quality-based JPG/WebP encoding, per-file actual sizes, sequential batch and ZIP |
| Image resizer | Pixel dimensions, contain/cover/stretch |
| Image crop | Pointer selection and exact source-pixel rectangle |
| Rotate & flip | Arbitrary angle, expanded bounds, horizontal/vertical flip |
| Image blur | Selected-region box blur, independent of Canvas filter support |
| Image pixelate | Selected-region block sampling |
| Grayscale | Adjustable pixel-based luminance blend |
| Plain background remover | Click or numeric seed, connected flood fill, tolerance, transparency or color |
| JPG to PNG | PNG encoding from decoded pixels |
| PNG to JPG | JPEG encoding with solid background |
| Image to WebP | Checked WebP encoder, quality setting |
| SVG to image | Sanitized, self-contained SVG decoding, dimensions and raster export |
| SVG cleaner | Conservative XML cleanup; preserves geometry, removes comments, metadata and unsafe/external content |
| Image watermark | Text or logo, position, size, angle, opacity, repeat pattern |
| Image metadata remover | Pixel re-encoding without copying source EXIF/GPS/camera tags |
| Secret message in PNG | PBKDF2-SHA256 + AES-256-GCM, random salt/IV, RGB LSB in opaque pixels, extraction with password |
| Passport photo layout | Editable crop, custom millimeter dimensions and DPI-based pixel count, 6 × 4 inch PNG sheet |
| Signature cleaner | Pale-paper threshold, dark-stroke bounds, padding and automatic crop |
| ID card designer | Photo/name/details on a 1011 × 638 pixel card |
| Image color picker | Original-pixel HEX/RGB, clipboard and JSON download |
| Favicon generator | Seven PNG sizes, four-size PNG-backed ICO, manifest, HTML snippet, ZIP |
| Photo contact sheet | Configurable columns/tile width, names, PNG sheet |
| Brightness & contrast | Pixel-based brightness, contrast, saturation |
| Image sharpen | Adjustable four-neighbor sharpening kernel |

## Interaction and limits

Files stay in the browser. Object URLs are revoked when results change and on unmount. Batches run sequentially, up to 20 files and 25 MB per file. Decoded and output canvases are limited to 8,192 pixels per side and 24 megapixels. Setting/file changes invalidate pending exports. Batch selection regions and watermark/background seeds scale proportionally from the preview image to other images.

The image workspace uses the full viewport. On phones the canvas and actions remain visible while advanced settings scroll inside their panel. The reducer has a compact two-column controls layout on phones and a wide comparison canvas on desktops.

Important limits are stated in each tool: still images only; no HEIC decoder; no AI segmentation; no invented upscale detail; no SVGO geometry optimization; no certified passport compliance; no changed PNG print-density tag. Print sheets must be printed at their stated physical size. Metadata removal does not retain source color profiles or animation. Blur/pixelation should be visually inspected before sharing sensitive content. Secret PNGs must not be resized or converted to lossy formats.

The reference’s PDF conversions are excluded from this change. Existing PDF/printable tools are left alone. Additional image-only retouching and layout tools bring this scoped collection to 25.

## Research

- ToolAdda image-tool directory and individual pages: https://tooladda.online/image-tools.html — reviewed crop, resizer, rotate, blur, grayscale, background removal, compression, HEIC, JPG/PNG/WebP, SVG raster/optimizer, watermark, metadata removal, steganography, passport/signature, ID, poster, color and favicon flows. Their advertised advanced capabilities are not claimed as implemented here.
- Canvas export behavior: https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob — PNG fallback is rejected when the requested encoder is unavailable.
- SVG as an image: https://developer.mozilla.org/en-US/docs/Web/SVG/Guides/SVG_as_an_image — sources are sanitized and decoded as images rather than inserted as HTML.
- Web Crypto: https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/encrypt — AES-GCM with unique random IV and authenticated decryption.

## Validation

`node checks/verify-image-lab.mjs` checks real encoded output, crop/resize/rotation dimensions, background alpha, grayscale pixels, passport dimensions, ICO structure, encrypted Unicode recovery through a PNG encode/decode roundtrip including transparent pixels, wrong-password rejection and memory guards. The existing image-size regressions remain unchanged.

Browser verification additionally covers SVG cleanup/decoding, contact-sheet layout, actual UI downloads and phone/tablet/desktop viewport bounds. Production build and repository checks cover route compilation and unchanged PDF workflows.
