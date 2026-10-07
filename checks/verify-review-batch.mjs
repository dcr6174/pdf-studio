import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
import {build} from 'vite';
import {createCanvas,DOMMatrix,ImageData,Path2D} from '@napi-rs/canvas';
import {PDFDocument,PDFName,PDFArray} from 'pdf-lib';
import JSZip from 'jszip';
Object.assign(globalThis,{DOMMatrix,ImageData,Path2D});
globalThis.document={createElement(name){assert.equal(name,'canvas');return createCanvas(1,1);}};
const root=path.resolve('.'),nativeFetch=globalThis.fetch;
globalThis.fetch=(url,...args)=>typeof url==='string'&&url.startsWith('/')?Promise.resolve(new Response(fs.readFileSync(path.join(root,'public',url)))):nativeFetch(url,...args);
await build({configFile:false,logLevel:'error',resolve:{alias:{'@':root}},build:{ssr:'lib/pdf-engine.ts',outDir:'.review-check',emptyOutDir:true,rollupOptions:{output:{entryFileNames:'engine.mjs'}}}});
// Node's PDF.js font factory reads filesystem paths, unlike the browser fetch factory.
const bundle='.review-check/engine.mjs';fs.writeFileSync(bundle,fs.readFileSync(bundle,'utf8').replaceAll('"/standard_fonts/"',JSON.stringify(path.join(root,'public/standard_fonts')+'/')));
const {loadFile,processPDF,renderer,pdfjs}=await import('../.review-check/engine.mjs');
(await pdfjs()).GlobalWorkerOptions.workerSrc=pathToFileURL(path.join(root,'public/pdf.worker.min.mjs')).href;
const opts={range:'',text:'',title:'',author:'',subject:'',password:'',quality:'images',angle:'90',margin:'20',start:'1',columns:'2',fields:{}};
const open=async name=>loadFile(new File([fs.readFileSync('public/test-fixtures/'+name)],name));
const items=file=>Array.from({length:file.pages},(_,index)=>({id:file.id+'-'+index,fileId:file.id,index,rotation:0}));
const run=(id,file,options={},pages=items(file),files=[file])=>processPDF(id,files,pages,[],{...opts,...options},()=>{});
const pdf=async result=>PDFDocument.load(await result.blob.arrayBuffer());
const chapters=await open('split-chapters.pdf');
async function counts(result){const zip=await JSZip.loadAsync(await result.blob.arrayBuffer());return Promise.all(Object.values(zip.files).filter(f=>!f.dir).map(async f=>(await PDFDocument.load(await f.async('uint8array'))).getPageCount()));}
assert.deepEqual(await counts(await run('split-chapters',chapters)),[3,3]);
const blank=await PDFDocument.create();blank.addPage();const blankFile=await loadFile(new File([await blank.save()],'inserted-blank.pdf'));
const chapterPages=items(chapters),inserted=[chapterPages[0],...items(blankFile),...chapterPages.slice(1)];
assert.deepEqual(await counts(await run('split-chapters',chapters,{},inserted,[chapters,blankFile])),[4,3]);
assert.deepEqual(await counts(await run('split-chapters',chapters,{},chapterPages,[chapters,blankFile])),[3,3]);
const links=await open('remove-links.pdf'),linkOut=await pdf(await run('remove-links',links));
for(const page of linkOut.getPages()){const a=page.node.lookupMaybe(PDFName.of('Annots'),PDFArray);assert.ok(!a||a.asArray().every(ref=>linkOut.context.lookup(ref).get(PDFName.of('Subtype'))?.toString()!=='/Link'));}
const annotation=await open('remove-annotations.pdf'),annotationOut=await pdf(await run('remove-annotations',annotation));
assert.equal(annotationOut.getForm().getTextField('Name').getText(),'Original value');
for(const page of annotationOut.getPages()){const a=page.node.lookupMaybe(PDFName.of('Annots'),PDFArray);assert.ok(!a||a.asArray().every(ref=>annotationOut.context.lookup(ref).get(PDFName.of('Subtype'))?.toString()==='/Widget'));}
const attachments=await open('remove-attachments.pdf'),attachmentOut=await pdf(await run('remove-attachments',attachments));
assert.ok(!attachmentOut.catalog.lookup(PDFName.of('Names')).has(PDFName.of('EmbeddedFiles')));
const blanks=await open('blank-check.pdf'),findings=await run('blank-check',blanks);assert.deepEqual(findings.blankCandidates,[2]);assert.equal((await pdf(findings)).getPageCount(),6);
const viewer=await run('viewer',chapters,{columns:'2'}),viewDoc=await renderer(new Uint8Array(await viewer.blob.arrayBuffer()));assert.equal(await viewDoc.getPageLayout(),'TwoColumnLeft');await viewDoc.destroy();
assert.equal((await pdf(await run('nup',chapters,{columns:'4'}))).getPageCount(),2);
for(const angle of ['90','180','270'])assert.deepEqual((await pdf(await run('rotate',chapters,{range:'2',angle}))).getPages().map(p=>p.getRotation().angle),[0,Number(angle),0,0,0,0]);
const manifest=JSON.parse(fs.readFileSync('public/test-fixtures/manifest.json','utf8'));assert.equal(manifest.length,66);assert.equal(new Set(manifest.map(m=>m.tool)).size,66);for(const m of manifest){assert.ok(fs.existsSync('public/test-fixtures/'+m.input));assert.ok(m.expected.length>30);if(m.additionalInput)assert.ok(fs.existsSync('public/test-fixtures/'+m.additionalInput));}
const pack=await JSZip.loadAsync(fs.readFileSync('public/test-fixtures/pdf-studio-test-pack.zip'));assert.ok(pack.file('manifest.json'));assert.ok(pack.file('README.txt'));
console.log('PASS: source bookmarks survive insertion/removal; explicit links removed; annotations removed with form retained; attachments removed; faint text/scans retained; blank candidates review-only; reading metadata; all rotation angles; incomplete sheets; 66-fixture mappings and ZIP.');
