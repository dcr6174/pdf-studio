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
const {imageTools}=load('lib/image-tools.ts');
let imageCases=0;
for(const tool of imageTools){for(const ext of ['png','jpg','webp','svg','ico','zip']){const original=`${tool.slug}-result.${ext}`,name=brandDownloadName(original);assert.ok(name.includes(' - pdf-studio.in - '));assert.ok(name.endsWith('.'+ext));assert.equal(brandDownloadName(name),name);imageCases++;}}
for(const ext of ['pdf','png','jpg','jpeg','webp','svg','ico','zip','txt','csv','json','docx','pptx','xlsx','excalidraw']){for(const tool of tools){const name=exportFilename(tool.id,'source.'+ext,'Page 1','invoice.pdf');assert.ok(name.includes(' - pdf-studio.in - '));assert.ok(name.endsWith('.'+ext));}}
console.log(`PASS: ${tools.length} catalog actions x 15 output extensions; ${imageTools.length} image tools x 6 output extensions (${imageCases} image cases).`);
