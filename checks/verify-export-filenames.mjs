import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import ts from 'typescript';
function load(path,require=()=>{throw new Error('Unexpected import');}){const exports={};new Function('exports','require',ts.transpileModule(readFileSync(path,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText)(exports,require);return exports;}
const {tools}=load('lib/tools.ts');const {exportFilename,brandDownloadName}=load('lib/export-filename.ts',()=>({tools}));
assert.equal(exportFilename('merge','invoice-merge.pdf','','invoice.pdf'),'invoice-merged.pdf');
assert.equal(exportFilename('sign','invoice-edited.pdf'),'invoice-signed.pdf');
assert.equal(exportFilename('word','invoice.docx'),'invoice-pdf-to-word.docx');
assert.equal(exportFilename('compress','batch.zip','Batch'),'batch-compressed-batch.zip');
assert.notEqual(exportFilename('png','page.png','Page 1'),exportFilename('png','page.png','Page 2'));
for(const tool of tools){const name=exportFilename(tool.id,'source.pdf');assert.ok(!name.includes('pdf-studio.in'));assert.ok(name.endsWith('.pdf'));assert.equal(brandDownloadName(name),name);assert.ok(!/[<>:"/\\|?*\u0000-\u001f]/.test(name));}
assert.equal(brandDownloadName('pdf-studio-whiteboard.excalidraw'),'whiteboard.excalidraw');
assert.equal(brandDownloadName('../unsafe/report.txt'),'.. unsafe report.txt');
assert.equal(exportFilename('sign','output.pdf','','Quarterly_Report (final).PDF'),'Quarterly_Report (final)-signed.pdf');
assert.equal(exportFilename('merge','out.pdf','','invoice-signed.pdf'),'invoice-signed-merged.pdf');
assert.equal(brandDownloadName('invoice - pdf-studio.in - Merged.pdf'),'invoice-merged.pdf');
assert.equal(exportFilename('merge','out.pdf','','1-invoice.pdf'),'1-invoice-merged.pdf');
console.log('PASS: clean names for every catalog tool, action replacement, conversion extensions, unique ZIP entries, custom exports, idempotence and safe filenames.');
