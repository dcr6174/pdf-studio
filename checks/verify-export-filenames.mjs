import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import ts from 'typescript';
function load(path,require=()=>{throw new Error('Unexpected import');}){const exports={};new Function('exports','require',ts.transpileModule(readFileSync(path,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText)(exports,require);return exports;}
const {tools}=load('lib/tools.ts');const {exportFilename,brandDownloadName}=load('lib/export-filename.ts',()=>({tools}));
assert.equal(exportFilename('merge','invoice-merge.pdf','','invoice.pdf'),'invoice - pdf-studio.in - Merged.pdf');
assert.equal(exportFilename('sign','invoice - pdf-studio.in - Edited.pdf'),'invoice - pdf-studio.in - Signed.pdf');
assert.equal(exportFilename('word','invoice.docx'),'invoice - pdf-studio.in - PDF to Word.docx');
assert.equal(exportFilename('compress','batch.zip','Batch'),'batch - pdf-studio.in - Compressed - Batch.zip');
assert.notEqual(exportFilename('png','page.png','Page 1'),exportFilename('png','page.png','Page 2'));
for(const tool of tools){const name=exportFilename(tool.id,'source.pdf');assert.ok(name.includes(' - pdf-studio.in - '));assert.ok(name.endsWith('.pdf'));assert.equal(brandDownloadName(name),name);assert.ok(!/[<>:"/\\|?*\u0000-\u001f]/.test(name));}
assert.equal(brandDownloadName('pdf-studio-whiteboard.excalidraw'),'whiteboard - pdf-studio.in - Whiteboard.excalidraw');
assert.equal(brandDownloadName('../unsafe/report.txt'),'.. unsafe report - pdf-studio.in - Export.txt');
assert.equal(exportFilename('sign','output.pdf','','Quarterly_Report (final).PDF'),'Quarterly_Report (final) - pdf-studio.in - Signed.pdf');
console.log('PASS: branding for every catalog tool, action replacement, conversion extensions, unique ZIP entries, custom exports, idempotence and safe filenames.');
