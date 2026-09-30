# PDF Studio for Windows — private development plan

Status: engine evaluation, not a released desktop app. No website download link or desktop promotion. PWA and Windows application are separate deliverables.

## Product acceptance
Click existing PDF text, edit it, preview the actual rewritten document, then save a separate PDF. Preserve untouched content, page dimensions, rotation and order. No rectangle-cover trick. Preserve original input and provide undo. Identify unsupported text before an edit. Warn that edits invalidate digital signatures. Never upload document bytes by default.

## Engine path
Evaluate the native PDF4QT C++20/Qt content editor as the first candidate. Pin a source revision, build upstream on Windows, and run its content-editor tests before any rebranding. Review core and all third-party licenses independently. Do not add a remote Electron wrapper and claim improved PDF capabilities. Native Qt UI or a local native service must be selected only after the actual editing API is exercised.

Reference revision reviewed: b3cf609468dc413dae835c1f7b1f6dacfdad0c9a. Relevant files: Pdf4QtLibCore/sources/pdfpagecontenteditorprocessor.cpp, pdfpagecontenteditorcontentstreambuilder.cpp; Pdf4QtLibWidgets/sources/pdfpagecontenteditorwidget.cpp; UnitTests/tst_contenteditortest.cpp. Upstream source https://github.com/JakubMelka/PDF4QT.

## Incremental gates
1. Reproduce Windows upstream build and original-content editing with synthetic documents. Record compiler, Qt, dependency versions and output.
2. Assess the API boundary: load, enumerate objects, font/encoding mapping, edit, render, save. Verify asynchronous cancellation and resource cleanup.
3. Prototype one-page editing with complete preview/export agreement, undo, original retention and deterministic failures.
4. Validate embedded/subset fonts, TJ positioning arrays, nested Form XObjects, mixed rotations, Unicode, ligatures and unsupported glyphs. Scans require a distinct OCR workflow, not fake native-text editing.
5. Build a Windows UI around verified operations: file picker/drop, page navigation, text selection, properties, undo/redo and save-as. Keyboard and high-DPI checks are mandatory.
6. Add page organization, annotations and signatures only after editing reliability. Local privacy behavior verified using network tracing.
7. Produce a private unsigned test package, install/uninstall and test with ordinary Windows accounts. Code signing and public distribution are later decisions.

## Release evidence
Per fixture retain original/output hashes, extracted text, rendered comparison, page/object preservation results and actual limitations. Test encrypted input, malformed input, large documents and existing signatures. Memory, cancellation and recovery must pass. No release or functioning native editor is claimed until these gates have evidence.

No unattended ongoing development runs are scheduled. Work continues in active development sessions.
