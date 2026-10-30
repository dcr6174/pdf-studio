import type {Article} from './articles';

export type WorkedExample={
 id:string;
 inputLabel:string;
 outputLabel:string;
 settings:string;
 expected:string;
 extra?:{href:string;label:string}[];
 screenshots?:{src:string;alt:string;caption:string;width:number;height:number}[];
};
const root='/examples/guide-intent/';
const example=(id:string,inputLabel:string,outputLabel:string,settings:string,expected:string):WorkedExample=>({id,inputLabel,outputLabel,settings,expected});
type Revision=Pick<Article,'summary'|'steps'|'check'|'limit'|'sections'|'tips'|'faq'|'hero'>&{workedExample:WorkedExample};

// Six editorial revisions, not a generator for the rest of the catalogue.
export const articleRevisions:Record<string,Revision>={
 'save-only-selected-pages':{
  summary:'Select a chapter by its physical PDF positions, distinguish one-file output from ZIP modes, and avoid confusing printed page numbers with file positions.',
  steps:['Open Split PDF and choose select-chapter-input.pdf from the sample below.','In Pages to extract, enter 3-4 using a normal hyphen. Under Save extracted pages as, choose One PDF.','Choose Extract selected pages and download the result. It must contain Chapter 1 followed by Chapter 2, not the cover or contents.'],
  sections:[
   {heading:'Map the printed chapter to physical positions',paragraphs:['The four-page sample starts with Cover and Contents. Chapter 1 is physical position 3, even if a real report prints “1” in its footer. Chapter 2 is position 4. Selecting 1-2 would send the cover and contents instead of either chapter.']},
   {heading:'Choose a container before exporting',paragraphs:['One PDF puts the selected positions into a single document. Separate pages puts individual PDFs in a ZIP; groups uses semicolons to separate PDFs within a ZIP. For this chapter handoff, use One PDF: a recipient needs one two-page reading copy, not an archive.']},
   {heading:'Keep document selection separate from confidentiality',paragraphs:['This operation omits whole pages. It does not remove an account number printed on a page you keep. Inspect every retained page before sharing, and use Redact if a retained page contains sensitive text. The sample contains only synthetic labels.']}
  ],
  check:'Open the download: two pages, Chapter 1 then Chapter 2. The source remains four pages.',
  limit:'A blank range selects all pages. Page positions refer to the current workspace order, not printed labels. Copying a subset of fillable pages can be blocked until fields are made read-only.',
  tips:['Write down the first and last physical positions before entering a range.','Keep the editable original if you make a form read-only.'],
  faq:[{question:'Does 3-4 include both endpoints?',answer:'Yes. The checked output contains physical pages 3 and 4.'},{question:'Should I type a long dash?',answer:'No. The engine accepts the ordinary hyphen in 3-4; the en dash in 3–4 is rejected.'}],
  hero:{input:'Cover · Contents · Chapter 1 · Chapter 2',output:'Chapter 1 · Chapter 2'},
  workedExample:example('select-chapter','Four-page chapter sample','Two-page chapter PDF','Pages to extract: 3-4; Save extracted pages as: One PDF','Chapter 1 → Chapter 2. Cover and Contents are absent.')
 },
 'extract-selected-invoices-from-a-longer-pdf':{
  summary:'Separate two multi-page invoices from a six-page batch into a ZIP, preserving each receipt with its invoice and omitting the unrelated invoice.',
  steps:['Choose invoice-groups-input.pdf in Split PDF. Locate the cover at position 1 and the three invoices after it.','Under Save extracted pages as, choose Page groups · ZIP. Enter 2-3;5-6 in Pages to extract: the semicolon separates invoice files.','Choose Extract selected pages, download and extract the ZIP. Open both PDFs and compare their page labels with the expected groups below.'],
  sections:[
   {heading:'Inventory the batch before choosing ranges',paragraphs:['Position 1 is Batch cover. Positions 2 and 3 are INV-101 main and INV-101 receipt. Position 4 is INV-102 main, which is not requested. Positions 5 and 6 are INV-103 main and INV-103 receipt. Invoice identifiers are printed labels, not range values.']},
   {heading:'Keep each receipt with its invoice',paragraphs:['Enter 2-3;5-6 in grouped mode. The expected ZIP has two PDFs: [INV-101 main, INV-101 receipt] and [INV-103 main, INV-103 receipt]. One PDF with 2-3,5-6 would bundle both invoices together. Separate pages would detach receipts into individual files. Neither is the requested handoff.']},
   {heading:'Verify the archive before emailing it',paragraphs:['Extract the ZIP before inspecting it. Check two PDFs with two pages each, then read both first-page invoice identifiers and both receipt labels. Do not rely on generated filenames as invoice identifiers. The checked result uses synthetic teaching labels and does not validate real invoice totals or bookkeeping.']}
  ],
  check:'Two PDFs in the ZIP, each two pages. INV-101 and INV-103 keep their receipts. Batch cover and INV-102 are absent.',
  limit:'Groups are explicit ranges, not automatic invoice recognition. If one invoice has an extra page in your source, update its physical range; the tool cannot infer which supporting page belongs to it.',
  tips:['Use a semicolon between documents and a hyphen within each consecutive range.','Rename the verified extracted PDFs for recipients only after reading their labels.'],
  faq:[{question:'Why not use Separate pages?',answer:'That mode creates one PDF per selected page, so a main invoice and its receipt would become separate files.'},{question:'Can I use the invoice number as a range?',answer:'No. INV-101 is a label. This example uses physical positions 2-3 for that invoice.'}],
  hero:{input:'Cover · INV-101 · INV-102 · INV-103',output:'INV-101 + receipt | INV-103 + receipt'},
  workedExample:{...example('invoice-groups','Six-page invoice batch','Checked two-invoice ZIP','Pages to extract: 2-3;5-6; Save extracted pages as: Page groups · ZIP','Group 1: INV-101 main → INV-101 receipt. Group 2: INV-103 main → INV-103 receipt.'),screenshots:[{src:root+'invoice-groups-browser.png',alt:'Actual local Split PDF completion screen with Download ZIP for the invoice-groups sample',caption:'Local desktop Chromium 152.0.7977.64, 30 October 2026: the grouped invoice export reaches Download ZIP. This capture shows completion, not a visual inspection of the pages inside.',width:940,height:428}]}
 },
 'split-pdf-common-problems-and-how-to-fix-them':{
  summary:'Diagnose wrong split order, duplicate selections, rejected dash characters and unexpected ZIP files with a three-page counterexample.',
  steps:['Choose selection-order-input.pdf, whose physical order is A1, A2, A3.','Choose One PDF and enter 3,1,3 in Pages to extract. Choose Extract selected pages and inspect the two-page download.','Compare A3, A1 with the three requested positions. To retain repeated copies, use Duplicate pages or an explicit Organize workflow instead.'],
  sections:[
   {heading:'A repeated position does not create another copy',paragraphs:['The reproducible input 3,1,3 produces A3 then A1. Selection keeps first-encounter order and removes repeated positions. It neither sorts into source order nor outputs A3 twice. This is a useful diagnostic if a result has fewer pages than the number of comma-separated entries.']},
   {heading:'A copied dash can invalidate a range',paragraphs:['The parser rejects 1–3 with an en dash and accepts 1-3 with a normal hyphen. It also rejects descending 3-1 and position 4 in a three-page document. Replace punctuation before investigating the PDF itself. A blank range is valid and means every page, not no pages.']},
   {heading:'A ZIP is a mode choice, not a corrupt PDF',paragraphs:['One PDF creates one document; separate and grouped modes create archives. Open a ZIP with your archive manager, not a PDF reader. If you wanted one reading copy, return to One PDF and repeat the export.']},
   {heading:'Fillable fields need a separate decision',paragraphs:['The subset-copy check uses a two-page synthetic form with a text field. Selecting one page is rejected with a fillable-field warning. Keep the editable source, make a separate read-only copy in Flatten PDF if appropriate, then split that copy. Do not claim that the split output preserves editable field behavior.']}
  ],
  check:'The 3,1,3 output has exactly two pages: A3 then A1. Compare the range, output mode and physical source count before retrying.',
  limit:'These checks cover simple synthetic PDFs and parser behavior, not every damaged, encrypted or signed PDF. Splitting is not a repair service or a redaction operation.',
  tips:['Use the error wording to distinguish range syntax from a form-copy restriction.','Never flatten your only editable original just to bypass a warning.'],
  faq:[{question:'Why did three selections produce two pages?',answer:'Repeated positions are deduplicated. The checked 3,1,3 selection yields A3, A1.'},{question:'Why did an empty range export everything?',answer:'An empty range explicitly selects all current pages. Enter the required positions before exporting.'}],
  hero:{input:'A1 · A2 · A3; selection 3,1,3',output:'A3 · A1, not A3 · A1 · A3'},
  workedExample:example('selection-order','Three-page range diagnostic','Checked deduplicated PDF','Pages to extract: 3,1,3; Save extracted pages as: One PDF','A3 → A1. Two pages, not three.')
 },
 'how-to-reverse-the-order-of-pdf-pages':{
  summary:'Reverse a complete PDF stack and check every position, while distinguishing page order from rotation, mirroring and isolated reordering.',
  steps:['Open Reverse pages and choose reverse-basics-input.pdf. Its order is A1, A2, A3.','Run Reverse pages. This operation reverses the entire current stack; there is no selected-page range.','Download the result and inspect all three labels: A3, A2, A1. Keep the original if you also need the forward-order copy.'],
  sections:[
   {heading:'What a complete reversal means',paragraphs:['In the three-page sample, the last page becomes first, the first becomes last, and the middle page stays in the middle. Checking only A3 at the start is insufficient: read A2 and A1 too. Reversal changes reading order, not which way text faces.']},
   {heading:'Choose a different tool for a different defect',paragraphs:['A sideways page needs Rotate PDF. A mirrored print layout needs Mirror pages. One misplaced sheet needs Organize pages. Reverse pages is appropriate only when the complete stack is backwards; it does not inspect printed page numbers to discover the intended order.']},
   {heading:'Apply the operation once',paragraphs:['Reversing the downloaded result again would restore the source order. Give the result a clear filename and compare it with the original before performing another operation. Do not repeatedly reverse in the hope that one isolated pair will become correct.']}
  ],
  check:'Three pages in the result: A3, A2, A1. Text stays upright and no label is missing.',
  limit:'The entire current sequence is reversed. It does not rotate pages, identify fronts and backs, or insert missing sheets.',
  tips:['Inspect first, middle and last pages; for longer documents compare all labels.','Use a copy when the source must remain available in its original order.'],
  faq:[{question:'Will this turn an upside-down page upright?',answer:'No. It changes sequence, not orientation. Use Rotate PDF for orientation.'},{question:'Does it reverse only the pages I mention?',answer:'No. This tool reverses the complete current stack. Use Organize for a selective reorder.'}],
  hero:{input:'A1 · A2 · A3',output:'A3 · A2 · A1'},
  workedExample:example('reverse-basics','Forward three-page stack','Reversed stack PDF','Reverse pages; no page range','A3 → A2 → A1; still three upright pages.')
 },
 'correct-a-back-page-scan-stored-in-reverse-order':{
  summary:'Correct backs scanned as B3, B2, B1 before alternating them with fronts A1, A2, A3; verify all six page pairings rather than just the first.',
  steps:['Choose reverse-backs-input.pdf in Reverse pages. Confirm its labels are B3, B2, B1. Keep fronts-input.pdf separate.','Run Reverse pages and download the B1, B2, B3 result.','Open Alternate & Mix. Choose fronts-input.pdf first, followed by the corrected backs result. Run the tool and check A1, B1, A2, B2, A3, B3.'],
  sections:[
   {heading:'Diagnose the scanner output before changing it',paragraphs:['This synthetic fixture represents three front/back pairs. Fronts are already A1, A2, A3, but backs were captured B3, B2, B1. Reverse only the back stack. Reversing the already-correct fronts would destroy the pairing you are trying to establish.']},
   {heading:'Use a six-label acceptance check',paragraphs:['After reversing backs, Alternate & Mix with fronts first must yield A1, B1, A2, B2, A3, B3. The engine check exports and independently reads all six labels. Without correcting backs, mixing those two original inputs would pair A1 with B3, which is wrong even though the total page count is six.']},
   {heading:'A missing back is not an order problem',paragraphs:['If a scanner omits a blank back, later fronts and backs can shift even after reversal. Inspect the source stacks and restore the missing position deliberately before mixing. Equal page counts and synthetic labels do not prove a real scan has the right pairings; compare its actual content.']}
  ],
  check:'Corrected backs: B1, B2, B3. Final alternating result: A1, B1, A2, B2, A3, B3.',
  limit:'This recipe assumes one front and one back per sheet, with all backs present and in exactly reversed order. It does not detect blank omissions, rotation or incorrectly identified sheets.',
  tips:['Never combine front and back stacks before fixing the back order.','Inspect all pairings in a short trial before processing a larger real scan.'],
  faq:[{question:'Which file goes first in Alternate & Mix?',answer:'Fronts first, then corrected backs. Otherwise each pair starts with its back.'},{question:'Will reversing fix a missing blank back?',answer:'No. Reversal changes order only. Investigate and restore the missing position before alternating.'}],
  hero:{input:'Backs B3 · B2 · B1',output:'Backs B1 · B2 · B3, then mix with fronts'},
  workedExample:{...example('reverse-backs','Reversed three-page back scan','Corrected backs PDF','Reverse backs alone; then Alternate & Mix, fronts first','Backs: B1 → B2 → B3. Mixed: A1 → B1 → A2 → B2 → A3 → B3.'),extra:[{href:root+'fronts-input.pdf',label:'Download the separate fronts PDF'},{href:root+'reverse-backs-mixed.pdf',label:'Download the checked six-page mixed result'}],screenshots:[{src:root+'reverse-backs-browser.png',alt:'Actual local Reverse pages completion screen with Download PDF for the back-page sample',caption:'Local desktop Chromium 152.0.7977.64, 30 October 2026: the back-stack reversal reaches Download PDF. The six-page alternating result is checked separately by the engine example, not shown in this capture.',width:940,height:428}]}
 },
 'reverse-pages-common-problems-and-how-to-fix-them':{
  summary:'Use a deliberately misplaced-page counterexample to see why full reversal cannot repair a local ordering error, and choose a targeted reorder instead.',
  steps:['Choose reverse-misplaced-input.pdf. Read its labels: A1, A3, A2. Only the last pair is misplaced.','Run Reverse pages and inspect the counterexample result: A2, A3, A1. Reversal has not repaired the intended A1, A2, A3 order.','Return to the original in Organize pages. Move A2 between A1 and A3, then export and compare all labels. This last repair is a manual instruction, not the downloadable reverse result.'],
  sections:[
   {heading:'The first page becomes wrong after reversal',paragraphs:['The checked counterexample begins A1, A3, A2. Full reversal gives A2, A3, A1, not the desired A1, A2, A3. This shows why a correctly implemented reverse operation can still be the wrong fix. Do not present the downloadable result here as a repaired document.']},
   {heading:'Different symptoms need different corrections',paragraphs:['Whole stack backwards: reverse it once. Isolated misplaced page: reorder it in Organize. Sideways content: rotate the affected page. Front/back pairs still wrong: inspect stack identity, which stack comes first and whether a blank back is missing. None of those diagnoses can be made from total page count alone.']},
   {heading:'Retain an acceptance sequence',paragraphs:['Write the desired labels A1, A2, A3 before retrying. Compare the exported file, not just workspace thumbnails. If your real pages lack labels, record a short description of each page or identify section starts before moving anything. A second full reversal only returns to A1, A3, A2.']}
  ],
  check:'The counterexample output is A2, A3, A1 and is intentionally not fixed. Your manual Organize repair should instead be A1, A2, A3.',
  limit:'The download proves the behavior of Reverse on this fixture, not the suggested manual repair. No automatic page-number recognition or missing-page recovery is claimed.',
  tips:['Keep the original counterexample for comparison.','Do not confuse a successful export with a correct reading order.'],
  faq:[{question:'Is the checked download the repaired document?',answer:'No. It deliberately demonstrates the wrong result from using full reversal on a local ordering problem.'},{question:'Should I reverse again to fix the last pair?',answer:'No. That restores the original A1, A3, A2 order. Move the isolated page in Organize instead.'}],
  hero:{input:'Misplaced pair: A1 · A3 · A2',output:'Reverse gives A2 · A3 · A1 — still wrong'},
  workedExample:example('reverse-misplaced','Misplaced-page counterexample','Intentionally unrepaired reverse result','Reverse pages on A1, A3, A2','A2 → A3 → A1. This is a failure demonstration, not a repair.')
 }
};

export function reviseArticle(article:Article):Article{
 const revision=articleRevisions[article.slug];
 if(!revision)return article;
 // Historical generic evidence does not establish this new scenario.
 return {...article,...revision,evidence:undefined,updated:'2026-10-30'};
}
