import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createRequire} from 'node:module';
import ts from 'typescript';
import {PDFDocument,StandardFonts,rgb,degrees} from 'pdf-lib';
import {createCanvas} from '@napi-rs/canvas';

const root=new URL('../',import.meta.url),out=new URL('work/watermark-check/',root);
await mkdir(out,{recursive:true});
for(const name of ['text-paragraph','online-text-engine','watermark-engine']){
 const source=await readFile(new URL('lib/'+name+'.ts',root),'utf8');
 const js=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText.replace("'./text-paragraph'","'./text-paragraph.mjs'").replace("'./online-text-engine'","'./online-text-engine.mjs'");
 await writeFile(new URL(name+'.mjs',out),js);
}
const require=createRequire(import.meta.url),wasm=await readFile(require.resolve('@embedpdf/pdfium/pdfium.wasm'));
globalThis.fetch=async url=>{assert.equal(url,'/vendor/pdfium.wasm');return new Response(wasm);};
const {openWatermarkDocument}=await import(new URL('watermark-engine.mjs',out));
const logo=createCanvas(80,30);logo.getContext('2d').fillStyle='#158061';logo.getContext('2d').fillRect(0,0,80,30);
async function fixture({mark=true,rotate=false,crop=false}={}){
 const pdf=await PDFDocument.create(),font=await pdf.embedFont(StandardFonts.Helvetica),image=await pdf.embedPng(logo.toBuffer('image/png'));
 pdf.setTitle('Preserve this title');
 for(let i=0;i<2;i++){const p=pdf.addPage([420,594]);if(rotate)p.setRotation(degrees(90));if(crop)p.setCropBox(20,20,380,554);p.drawText('Important body text '+(i+1),{x:45,y:510,size:15,font});p.drawRectangle({x:45,y:400,width:200,height:30,color:rgb(.1,.4,.7)});if(mark)p.drawText('DRAFT',{x:105,y:260,size:52,font,opacity:.25,rotate:degrees(25)});p.drawImage(image,{x:280,y:40,width:80,height:30});}
 const field=pdf.getForm().createTextField('keep-field');field.setText('keep value');field.addToPage(pdf.getPage(0),{x:45,y:70,width:130,height:22});
 return pdf.save();
}
for(const variation of [{},{rotate:true},{crop:true},{rotate:true,crop:true}]){
 const source=await fixture(variation),unchanged=source.slice(),original=await openWatermarkDocument(source),clean=await openWatermarkDocument(await fixture({...variation,mark:false}));
 const selection=[];for(let i=0;i<2;i++){const view=original.inspect(i),draft=view.objects.find(o=>o.label==='DRAFT');assert(draft);assert(view.objects.some(o=>o.kind==='image'));assert(draft.left>=0&&draft.top>=0&&draft.left+draft.width<=1&&draft.top+draft.height<=1);assert.equal(original.list(i).objects.find(o=>o.index===draft.index).key,draft.key);selection.push({...draft,page:i});}
 assert.equal(selection[0].key,selection[1].key,'repeated text has stable keys');
 const copy=await openWatermarkDocument(source);copy.remove(selection);const bytes=copy.save(),reopened=await openWatermarkDocument(bytes);
 for(let i=0;i<2;i++){const got=reopened.inspect(i),expected=clean.inspect(i);assert(!got.objects.some(o=>o.label==='DRAFT'));assert(got.objects.some(o=>o.label==='Important body text '+(i+1)));assert.deepEqual(got.rgba,expected.rgba,'only selected watermark changes rendered pixels');}
 const parsed=await PDFDocument.load(bytes);assert.equal(parsed.getPageCount(),2);assert.equal(parsed.getTitle(),'Preserve this title');assert.equal(parsed.getForm().getTextField('keep-field').getText(),'keep value');assert.deepEqual(parsed.getPage(0).getCropBox(),(await PDFDocument.load(source)).getPage(0).getCropBox());assert.equal(parsed.getPage(0).getRotation().angle,variation.rotate?90:0);assert.deepEqual(source,unchanged);assert(original.list(0).objects.some(o=>o.label==='DRAFT'),'original document unchanged');
 const bad=await openWatermarkDocument(source);assert.throws(()=>bad.remove([selection[0],{...selection[1],key:'stale'}]),/no longer matches/);assert(bad.list(0).objects.some(o=>o.label==='DRAFT'),'validation is atomic');assert.throws(()=>bad.remove([]),/Select/);assert.throws(()=>bad.remove([selection[0],selection[0]]),/repeated/);bad.close();assert.throws(()=>bad.inspect(0),/closed/);
 const imageCopy=await openWatermarkDocument(source),image=imageCopy.list(0).objects.find(o=>o.kind==='image');imageCopy.remove([{...image,page:0}]);const imageSaved=await openWatermarkDocument(imageCopy.save());assert(!imageSaved.list(0).objects.some(o=>o.kind==='image'));assert(imageSaved.list(1).objects.some(o=>o.kind==='image'));assert(imageSaved.list(0).objects.some(o=>o.label==='DRAFT'));
 const single=await openWatermarkDocument(source);single.remove([selection[0]]);const singleSaved=await openWatermarkDocument(single.save());assert(!singleSaved.list(0).objects.some(o=>o.label==='DRAFT'));assert(singleSaved.list(1).objects.some(o=>o.label==='DRAFT'));
 for(const doc of [original,clean,copy,reopened,imageCopy,imageSaved,single,singleSaved])doc.close();
 if(!variation.rotate&&!variation.crop)await writeFile(new URL('source.pdf',out),source);
}
const base=await PDFDocument.create();base.addPage([400,500]).drawText('Grouped watermark',{x:40,y:250});const grouped=await PDFDocument.create(),embedded=await grouped.embedPdf(await base.save());grouped.addPage([400,500]).drawPage(embedded[0]);const nested=await openWatermarkDocument(await grouped.save());assert(nested.list(0).hasForms);assert.equal(nested.list(0).objects.length,0);nested.close();
await assert.rejects(()=>openWatermarkDocument(new TextEncoder().encode('not a PDF')),/could not be opened/);
console.log('PASS: real text/image deletion, pixel preservation, rotated/cropped pages, form fields, metadata, untouched pages/source, stable matching, stale-selection rejection and grouped-object scope.');
