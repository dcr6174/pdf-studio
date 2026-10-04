# Revised editor and PageSpeed review — 4 October 2026

Reviewed `pdf-studio-text-editor (2).zip` from the supplied attachment. Unlike the earlier overlay version, this revision enumerates PDFium text objects and removes/recreates the original text. That is real replacement, but it is not safe to substitute for the existing editor yet.

A PDFium engine test generated a PDF with Helvetica text at 0° and 45°, changed the text using the uploaded TrueTextDoc, saved it, independently reopened it with pdf-lib, and decoded the output content stream. Both replacements exported `1 0 0 1 120 420 cm`. The 45° text-object angle was lost. The uploaded engine unconditionally uses an identity linear transform with a baseline translation. Preserve the original object matrix and validate transformed bounds before integrating. Font substitution and resource cleanup also need review. No new editor from this ZIP was installed; the current existing-text editor and the previously verified Sign/Edit improvements remain.

Screenshot findings addressed:

- The owner capability probe now returns HTTP 200 with only `{owner:false}` or `{owner:true}` and no-store/noindex headers. Anonymous visitors are normal state. The boundary still validates signed cookies and strips forged identity headers. All private report endpoints continue requiring owner access.
- Category buttons and counts use opaque foreground colours. Selected buttons invert foreground/card colours. Source-based WCAG contrast checks cover light/dark normal, selected and hover states.
- Both footer implementations use the existing 1,829-byte SVG logo instead of the 91,972-byte PNG at 22px. The brand mark is preserved and the footer image loads lazily.

The bookmarkpdf screenshot shows a bookmark workflow, not an existing-text editor. Its step-by-step model is useful, but its visible field/error overlap and obstructive mobile banners should not be copied.

The supplied PageSpeed mobile test reports FCP 2.7s, LCP 3.3s, TBT 0ms and CLS 0. Those are the user's laboratory results, not new measurements performed here. Remaining unused JavaScript, CSS delivery, and Cloudflare beacon advisories need a fresh trace on the deployed build. Third-party beacon polyfills/cache policy cannot be fixed by editing our bundle. No new PageSpeed score, real-device interaction or deployment verification is claimed.

Validation commands: `npm run lint`, `npx tsc --noEmit`, `npm run verify:public`, `node checks/verify-pagespeed-fixes.mjs`, `npm run verify:analytics`, `npm run build:public`.
