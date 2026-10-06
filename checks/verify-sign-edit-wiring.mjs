import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import ts from 'typescript';
const load=async path=>import('data:text/javascript;base64,'+Buffer.from(ts.transpileModule(await readFile(path,'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText).toString('base64'));
const {validSignatureImage}=await load('lib/saved-signatures.ts');
assert.equal(validSignatureImage('data:image/png;base64,iVBORw0KGgo='),true);assert.equal(validSignatureImage('https://example.com/signature.png'),false);assert.equal(validSignatureImage('data:image/svg+xml,<script>bad</script>'),false);assert.equal(validSignatureImage('data:image/png;base64,'+'A'.repeat(1500000)),false);
const {arrowHead,arrowPreview}=await load('lib/page-geometry.ts');for(const [w,h] of [[100,20],[20,100],[500,600],[12,400],[400,12]]){const points=arrowHead(w,h);assert.equal(points.length,2);for(const p of points)assert.ok(Number.isFinite(p.x)&&Number.isFinite(p.y)&&p.x>=0&&p.x<=1&&p.y>=0&&p.y<=1);assert.ok(arrowPreview(w,h).includes('L 100 100'));}
const page=await readFile('app/page.tsx','utf8'),picker=await readFile('components/signature-picker.tsx','utf8'),result=await readFile('components/result-card.tsx','utf8');
for(const text of ["addSigningText(signingDate(new Date(),dateFormat))","addSigningText('Your initials')","addSigningText('Your name')",'Duplicate element','Add password to signed PDF','Whiteout only covers content','Pen drawing','arrowPreview','<OnlineTextEditor'])assert.ok((page+result).includes(text),text);
for(const text of ["savedSignatures('save'","savedSignatures('delete'",'Save on device','Use signature','signature-picker-footer','Photograph signature','capture="environment"'])assert.ok(picker.includes(text),text);
assert.ok(!page.includes('PdfTextHub'),'native editor was not replaced');
const storage=await readFile('lib/saved-signatures.ts','utf8');assert.ok(!storage.includes('fetch(')&&!storage.includes('localStorage'),'images kept in IndexedDB only');
console.log('PASS: signature validation, arrow geometry, editor actions, explicit local saving, camera input, honest whiteout copy and preserved native editor wiring. Real browser storage/camera remain unverified.');

const {signingDate}=await load('lib/signing-date.ts');const date=new Date(2026,9,4,12);assert.equal(signingDate(date,'iso'),'2026-10-04');assert.equal(signingDate(date,'day-first'),'04/10/2026');assert.equal(signingDate(date,'month-first'),'10/04/2026');
