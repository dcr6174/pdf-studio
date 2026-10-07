# Audit fixes — 7 October 2026

The supplied report is an external audit. Its original fixtures were not attached. These changes are checked with independently generated documents and targeted live workflows; they do not repeat or certify the audit's 186 cases.

| IDs | Change | Validation |
| --- | --- | --- |
| F01 | Same-origin OCR worker and all WASM core variants copied during build; both OCR entry points use them. The restrictive script policy is unchanged. | Asset presence checks; live recognition/export check after deployment. Language data is still downloaded from the existing approved host. |
| F02 | PDFium authenticates the supplied password and writes a fresh copy with encryption removed. Distinct password, unsupported-security and damaged-file errors. | Independently generated AES-256 V5/R6 fixture; wrong password rejected; four unencrypted pages independently reopened with original text. |
| F03 | Workflow receives the shared mobile Run action. | Source regression check; desktop workflow output validation. |
| F04–F05 | Mobile signature tray has its own non-overlapping layer; signature dialog uses explicit viewport positioning without centre translations. General centred dialogs have explicit bounds and scrolling. | Static layout review; live signature dialog check. Physical mobile devices remain untested. |
| F06–F07 | Sortable attributes/listeners move to dedicated drag buttons. File cards retain native list-item semantics; page cards no longer act as buttons containing other controls. | Markup regression checks; keyboard drag and ordinary action checks. Full screen-reader certification is not claimed. |
| F08–F09 | Scrollable workspace, reader, compare, continuous-page and Resize previews have focusable region semantics; Resize page naming uses a group. | Markup checks and live focus checks. |
| F10 | Markdown exports inline bold/italic/both styles with embedded PDF font runs, wrapping and escaped delimiters. | Independent text extraction has no emphasis delimiters; PDF resources include Helvetica-Bold, Helvetica-Oblique and Helvetica-BoldOblique. |
| G01 | Watermark becomes a configurable workflow step. Operation count is computed from the library. | Rotate + Watermark produces four rotated pages, each with the expected watermark. |
| G02 | Rotate settings offer page checkboxes and a page-range field; unselected pages are preserved. Preview applies the same range. | One-page rotation yields rotations 0/90/0/0; invalid ranges rejected. |
| U01 | Blank-page findings and review warning are visible above download controls. | Result markup review; live result check. No pages are automatically removed. |
| U02 | Handwriting exports retain the successfully imported source filename before the website/action suffix. | Filename policy and source-state checks. |
| U03 | Remove password validates PDF input on opening; plain text disguised as PDF and zero-page documents are rejected. Encrypted input remains eligible for password entry. | Invalid input regression test. |
| O01 | Reader jumps align the requested page to its scroll region; page tracking observes that region and ignores a preceding page's remaining tail. Continuous editor tracking uses the top of the viewport. | Controlled follow-up check; the original timing observation was unconfirmed. |

Run `node checks/verify-audit-fixes.mjs` for targeted processing regressions. The encryption fixture is synthetic and generated independently using pypdf AES-256; its test password is `Test1234!`.

Remaining verification limits: physical phones, audible speech, complete assistive-technology testing, Indic/RTL OCR, certificate-encrypted PDFs, XFA and large-file stress cases. No claim is made that every tool or PDF variant is certified.
