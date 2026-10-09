import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {build} from 'vite';
import ts from 'typescript';
const draftSource=ts.transpileModule(await readFile('lib/commit-text-draft.ts','utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText;
const {commitTextDraft}=await import('data:text/javascript;base64,'+Buffer.from(draftSource).toString('base64')); 
import fontkit from '@pdf-lib/fontkit';
import {PDFDocument,StandardFonts,degrees} from 'pdf-lib';
await build({configFile:false,logLevel:'error',build:{ssr:'lib/online-text-engine.ts',outDir:'.text-check',emptyOutDir:true,rollupOptions:{output:{entryFileNames:'engine.mjs'}}}});
const wasm=await readFile('node_modules/@embedpdf/pdfium/dist/pdfium.wasm');
globalThis.fetch=async()=>new Response(wasm);
const {textEngine,OnlineTextDocument}=await import('../.text-check/engine.mjs');
const m=await textEngine();
async function fixture(rotation=0){const pdf=await PDFDocument.create();const f=await pdf.embedFont(StandardFonts.Helvetica);const p=pdf.addPage([500,700]);p.setRotation(degrees(rotation));p.drawText('Original text',{x:50,y:600,size:18,font:f});p.drawText('Second line',{x:50,y:560,size:18,font:f});return pdf.save();}
for(const rotation of [0,90,180,270]){const d=new OnlineTextDocument(m,await fixture(rotation));assert.equal(d.pageCount,1);const before=d.inspect(0);const target=before.objects.find(o=>o.text==='Original text');assert.ok(target);assert.ok(target.left>=0&&target.top>=0&&target.left+target.width<=1&&target.top+target.height<=1,'rotation bounds');d.replace(0,target.index,'Edited text');const output=d.save();assert.equal((await PDFDocument.load(output)).getPageCount(),1);const reopened=new OnlineTextDocument(m,output);const after=reopened.inspect(0);assert.ok(after.objects.some(o=>o.text==='Edited text'));assert.ok(!after.objects.some(o=>o.text==='Original text'));assert.ok(after.objects.some(o=>o.text==='Second line'));if(rotation===0){await writeFile('/tmp/online-text-preview.rgba',after.rgba);await writeFile('/tmp/online-text-preview.json',JSON.stringify({width:after.width,height:after.height}));}assert.notDeepEqual(after.rgba,before.rgba,'actual preview must change');reopened.close();d.close();}
const d=new OnlineTextDocument(m,await fixture()),v=d.inspect(0),o=v.objects.find(o=>o.text==='Original text');assert.throws(()=>d.replace(0,o.index,'A much much much longer sentence that cannot fit'),/exceeds/);assert.throws(()=>d.replace(0,o.index,'unsupported 😃'),/font/);assert.throws(()=>d.replace(0,o.index,'two\nlines'),/single line/);const unchanged=new OnlineTextDocument(m,d.save());assert.ok(unchanged.inspect(0).objects.some(o=>o.text==='Original text'));unchanged.close();d.close();
// Longer supported replacements can fit the actual original text bounds.
for(const rotation of [0,90,180,270]){const fitted=new OnlineTextDocument(m,await fixture(rotation));const old=fitted.inspect(0).objects.find(o=>o.text==='Original text');fitted.replace(0,old.index,'A longer replacement',true);const result=new OnlineTextDocument(m,fitted.save());const changed=result.inspect(0).objects.find(o=>o.text==='A longer replacement');assert.ok(changed);assert.ok(changed.left>=old.left-.002&&changed.top>=old.top-.002&&changed.left+changed.width<=old.left+old.width+.002&&changed.top+changed.height<=old.top+old.height+.002,'fitted bounds at every rotation');assert.ok(result.inspect(0).objects.some(o=>o.text==='Second line'));result.close();fitted.close();}
const huge=new OnlineTextDocument(m,await fixture());const target=huge.inspect(0).objects[0];assert.throws(()=>huge.replace(0,target.index,'An extremely long replacement repeated '.repeat(8),true),/too small/);const retained=new OnlineTextDocument(m,huge.save());assert.equal(retained.inspect(0).objects[0].text,target.text);retained.close();huge.close();
const embedded=await PDFDocument.create();embedded.registerFontkit(fontkit);const ef=await embedded.embedFont(await readFile('public/fonts/NotoSans-Regular.ttf'),{subset:true});embedded.addPage([500,700]).drawText('Original text',{x:50,y:600,size:18,font:ef});const ed=new OnlineTextDocument(m,await embedded.save());const eo=ed.inspect(0).objects[0];assert.deepEqual(ed.missingCharacters(0,eo.index,'Original'),[]);assert.deepEqual(ed.missingCharacters(0,eo.index,'Z'),['Z']);ed.replace(0,eo.index,'Original');const er=new OnlineTextDocument(m,ed.save());assert.equal(er.inspect(0).objects[0].text,'Original');assert.throws(()=>er.replace(0,eo.index,'Z'),/font/);er.close();ed.close();
const blank=await PDFDocument.create();blank.addPage();const b=new OnlineTextDocument(m,await blank.save());assert.equal(b.inspect(0).objects.length,0);b.close();assert.throws(()=>new OnlineTextDocument(m,new TextEncoder().encode('broken')),/cannot be opened/);
// Preserve the original text-object matrix, including rotation within a page.
const angledPDF=await PDFDocument.create(),angledFont=await angledPDF.embedFont(StandardFonts.Helvetica);angledPDF.addPage([500,700]).drawText('Original text',{x:120,y:420,size:20,font:angledFont,rotate:degrees(45)});const angled=new OnlineTextDocument(m,await angledPDF.save());const angledObject=angled.inspect(0).objects.find(o=>o.text==='Original text');
function matrixOf(document,index){const page=m.FPDF_LoadPage(document.doc,0),buffer=m.pdfium.wasmExports.malloc(24);try{assert.ok(m.FPDFPageObj_GetMatrix(m.FPDFPage_GetObject(page,index),buffer));return Array.from(m.pdfium.HEAPF32.slice(buffer/4,buffer/4+6));}finally{m.pdfium.wasmExports.free(buffer);m.FPDF_ClosePage(page);}}
const beforeMatrix=matrixOf(angled,angledObject.index);angled.replace(0,angledObject.index,'Original');const angledReopened=new OnlineTextDocument(m,angled.save()),afterObject=angledReopened.inspect(0).objects.find(o=>o.text==='Original');assert.ok(afterObject);assert.deepEqual(matrixOf(angledReopened,afterObject.index),beforeMatrix,'45-degree text-object transform survives exported replacement');angledReopened.close();angled.close();
const draftBytes=await fixture(),draftDoc=new OnlineTextDocument(m,draftBytes);assert.equal(commitTextDraft(draftDoc,draftBytes),draftBytes,'switching with no draft retains exact bytes');const draftObject=draftDoc.inspect(0).objects.find(o=>o.text==='Original text');const committedDraft=commitTextDraft(draftDoc,draftBytes,{page:0,index:draftObject.index,value:'Edited text',fit:false});const draftReopened=new OnlineTextDocument(m,committedDraft);assert.ok(draftReopened.inspect(0).objects.some(o=>o.text==='Edited text'),'pending inline typing is committed before switching');draftReopened.close();draftDoc.close();
console.log('Online native text: actual edit/save/reopen, changed raster preview, four page rotations, 45-degree text-object rotation, unaffected text, overflow rollback, fitted longer text and excessive-shrink rollback, unsupported glyphs, multiline, blank and malformed PDFs passed.');


// Focused editor: single-line replacements retain original PDF text, with fitting and style controls.
for(const rotation of [0,90,180,270]){
 const edited=new OnlineTextDocument(m,await fixture(rotation)),target=edited.inspect(0).objects.find(o=>o.text==='Original text');
 const width=target.layout.right-target.layout.left;
 assert.throws(()=>edited.replaceFlow(0,[target.index],'A longer replacement',{width,singleLine:true,fit:false}),/exceeds/);
 assert.ok(edited.inspect(0).objects.some(o=>o.text==='Original text'),'overflow retains the original');
 edited.replaceFlow(0,[target.index],'A longer replacement',{width,singleLine:true,fit:true});
 const reopened=new OnlineTextDocument(m,edited.save());
 assert.ok(reopened.inspect(0).objects.some(o=>o.text==='A longer replacement'));
 assert.ok(!reopened.inspect(0).objects.some(o=>o.text==='Original text'));
 assert.ok(reopened.inspect(0).objects.some(o=>o.text==='Second line'));reopened.close();edited.close();
}
const styled=new OnlineTextDocument(m,await fixture()),styleTarget=styled.inspect(0).objects.find(o=>o.text==='Original text'),styleWidth=styleTarget.layout.right-styleTarget.layout.left;
assert.throws(()=>styled.replaceFlow(0,[styleTarget.index],'Too much text '.repeat(50),{width:styleWidth,singleLine:true,fit:true}),/too small/);
styled.replaceFlow(0,[styleTarget.index],'Updated',{width:styleWidth,singleLine:true,fit:true,size:14,color:'#7c3aed'});
const styleSaved=new OnlineTextDocument(m,styled.save()),styleResult=styleSaved.inspect(0).objects.find(o=>o.text==='Updated');
assert.equal(styleResult.size,14);assert.equal(styleResult.color,'#7c3aed');
styleSaved.replaceFlow(0,[styleResult.index],'',{width:styleResult.layout.right-styleResult.layout.left,singleLine:true,fit:true});
assert.ok(!styleSaved.inspect(0).objects.some(o=>o.text==='Updated'));assert.ok(styleSaved.inspect(0).objects.some(o=>o.text==='Second line'));
styleSaved.close();styled.close();
console.log('Focused text editor: fitted single-line changes at four rotations, atomic overflow rejection, size/colour and real text deletion passed.');
