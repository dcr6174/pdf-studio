import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import ts from 'typescript';
const mod=text=>'data:text/javascript;base64,'+Buffer.from(ts.transpileModule(text,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText).toString('base64');
const P=await import(mod(await readFile('lib/paste.ts','utf8')));
const R=await import(mod(await readFile('lib/result-summary.ts','utf8')));
const file=(name,size=10,type='application/pdf')=>new File([new Uint8Array(size)],name,{type});

// ---- paste-to-open
assert.deepEqual(P.filesFromClipboard(null),[]);assert.deepEqual(P.filesFromClipboard({files:[]}),[]);
assert.deepEqual(P.filesFromClipboard({files:[file('a.pdf'),file('empty.pdf',0)]}).map(f=>f.name),['a.pdf'],'empty files are dropped');
assert.deepEqual(P.filesFromClipboard({files:[],items:[{kind:'string',getAsFile:()=>null},{kind:'file',getAsFile:()=>file('b.pdf')}]}).map(f=>f.name),['b.pdf'],'falls back to clipboard items');
const shot=P.filesFromClipboard({files:[file('image.png',20,'image/png')]},new Date(2026,9,4,19,38,5));
assert.equal(shot[0].name,'pasted-image-20261004-193805.png','a pasted screenshot gets a unique name');assert.equal(shot[0].type,'image/png');
assert.equal(P.filesFromClipboard({files:[file('photo.jpg',5,'image/jpeg')]})[0].name,'photo.jpg','real names are kept');
const el=(tagName,extra={})=>({tagName,isContentEditable:false,closest:()=>null,...extra});
for(const t of ['INPUT','TEXTAREA','SELECT'])assert.equal(P.isEditableTarget(el(t)),true,t+' keeps its own paste');
assert.equal(P.isEditableTarget(el('DIV',{isContentEditable:true})),true);
assert.equal(P.isEditableTarget(el('SPAN',{closest:s=>s.includes('contenteditable')?{}:null})),true);
assert.equal(P.isEditableTarget(el('BODY')),false);assert.equal(P.isEditableTarget(null),false);

// ---- before / after
assert.deepEqual(R.describeChange(10_000_000,4_000_000,true),{pct:60,tone:'good',headline:'60% smaller'});
assert.deepEqual(R.describeChange(10_000_000,10_400_000,true),{pct:4,tone:'bad',headline:'4% larger'});
assert.equal(R.describeChange(10_000_000,9_960_000,true).headline,'About the same size');assert.equal(R.describeChange(10_000_000,9_960_000,true).tone,'same');
assert.equal(R.describeChange(10_000_000,4_000_000,false).tone,'neutral','only Compress treats smaller as good');
assert.equal(R.describeChange(0,100,true).headline,'');assert.equal(R.describeChange(100,-1,true).headline,'');
assert.deepEqual(R.barWidths(100,50),{before:100,after:50});assert.deepEqual(R.barWidths(50,100),{before:50,after:100});assert.equal(R.barWidths(1000,1).after,2,'a bar never vanishes');
assert.equal(R.plural(1,'page'),'1 page');assert.equal(R.plural(3,'file'),'3 files');

// ---- wiring and the proof page
const page=await readFile('app/page.tsx','utf8'),prove=await readFile('app/check-it-yourself/page.tsx','utf8'),sitemap=await readFile('public/sitemap.xml','utf8'),gen=await readFile('scripts/generate-site-assets.mjs','utf8');
assert.ok(page.includes("document.addEventListener('paste', onPaste)")&&page.includes('isEditableTarget(e.target)'),'paste ignores text fields');
assert.ok(page.includes("c.view === 'home'")&&page.includes('Open a tool first'),'home does not take uploads, so paste there only explains');
assert.ok(page.includes('<PasteHint/>')&&page.includes('<ResultSummary'));
assert.ok(page.includes("['create','markdown','create-form','hash','privacy','audio','compare'].includes(view)"),'summary skipped where sizes mean nothing');
for(const must of ['Preserve log','collect','zebra-lantern','Offline','Do Not Track','What these checks cannot show','Privacy policy'])assert.ok(prove.includes(must),'check page mentions '+must);
assert.ok(!/we (?:guarantee|promise) 100%|military|bank-level|unhackable/i.test(prove),'no overclaiming');
assert.ok(sitemap.includes('https://pdf-studio.in/check-it-yourself')&&gen.includes("'/check-it-yourself'"));
console.log('PASS: paste (files, items fallback, screenshots, text fields untouched, home explains), before/after maths and tones, wiring, and the Prove it page content and sitemap.');
