import assert from 'node:assert/strict';
import {build} from 'vite';
import {PDFDocument,StandardFonts,PDFRawStream,PDFName,PDFNumber,PDFString} from 'pdf-lib';
import {createCanvas,loadImage,DOMMatrix,ImageData,Path2D} from '@napi-rs/canvas';
import {createRequire} from 'node:module';

globalThis.DOMMatrix=DOMMatrix;globalThis.ImageData=ImageData;globalThis.Path2D=Path2D;
globalThis.document={createElement(){
 const canvas=createCanvas(1,1),ctx=canvas.getContext('2d'),draw=ctx.drawImage.bind(ctx);
 ctx.drawImage=(image,...args)=>draw(image.image??image,...args);
 canvas.toBlob=(callback,type,quality)=>callback(new Blob([canvas.toBuffer(type,Math.round(quality*100))],{type}));
 return canvas;
}};
globalThis.createImageBitmap=async file=>{const image=await loadImage(Buffer.from(await file.arrayBuffer()));return{width:image.width,height:image.height,image,close(){}};};
await build({configFile:false,logLevel:'error',plugins:[{name:'fixture-fonts',transform(code,id){if(id.endsWith('/lib/pdf-engine.ts'))return {code:code.replace(/standardFontDataUrl:\s*['"]\/standard_fonts\/['"]/g,'standardFontDataUrl: '+JSON.stringify(new URL('../node_modules/pdfjs-dist/standard_fonts/',import.meta.url).pathname)),map:null};}}],build:{ssr:'lib/pdf-engine.ts',outDir:'.compression-check',emptyOutDir:true,rollupOptions:{output:{entryFileNames:'engine.mjs'}}}});
const {processPDF,pdfjs}=await import('../.compression-check/engine.mjs');
const reader=await pdfjs();reader.GlobalWorkerOptions.workerSrc=createRequire(import.meta.url).resolve('pdfjs-dist/build/pdf.worker.min.mjs');
const defaults={range:'',text:'',title:'',author:'',subject:'',password:'',quality:'images',angle:'90',margin:'20',start:'1',columns:'2',fields:{}};
async function run(bytes,target,extra={},signal){
 const doc=await PDFDocument.load(bytes),file={id:'cv',name:'cv.pdf',bytes,size:bytes.length,pages:doc.getPageCount()},pages=doc.getPages().map((_,index)=>({id:'p'+index,fileId:'cv',index,rotation:0}));
 return processPDF('compress',[file],pages,[],{...defaults,compressTarget:String(target),...extra},()=>{},signal);
}
async function text(bytes){const d=await reader.getDocument({data:new Uint8Array(bytes),standardFontDataUrl:new URL('../node_modules/pdfjs-dist/standard_fonts/',import.meta.url).pathname}).promise;try{return (await (await d.getPage(1)).getTextContent()).items.map(i=>i.str??'').join(' ');}finally{await d.destroy();}}
const photo=createCanvas(1200,1600),ctx=photo.getContext('2d');const px=ctx.createImageData(1200,1600);let seed=31;
for(let y=0;y<1600;y++)for(let x=0;x<1200;x++){const i=(y*1200+x)*4;seed=(Math.imul(seed,1664525)+1013904223)>>>0;const noise=(seed&31)-16;px.data[i]=100+x/15+noise;px.data[i+1]=110+y/30+noise;px.data[i+2]=140+x/40+noise;px.data[i+3]=255;}ctx.putImageData(px,0,0);
const d=await PDFDocument.create(),font=await d.embedFont(StandardFonts.Helvetica),p=d.addPage([595,842]);
p.drawText('CV Applicant - Software Engineer',{x:40,y:790,font,size:16});
p.drawText('Experience: PDF Studio. Email: cv@example.test',{x:40,y:750,font,size:10});
const image=await d.embedJpg(photo.toBuffer('image/jpeg',100));p.drawImage(image,{x:450,y:650,width:90,height:120});
const field=d.getForm().createTextField('Applicant');field.setText('CV Applicant');field.addToPage(p,{x:40,y:680,width:240,height:25});
const link=d.context.register(d.context.obj({Type:'Annot',Subtype:'Link',Rect:[40,730,250,745],A:{S:'URI',URI:PDFString.of('https://example.test/cv')}}));p.node.addAnnot(link);
const bytes=await d.save();assert.ok(bytes.length>200000);
for(const target of [200,100]){
 const result=await run(bytes,target,{quality:target===100?'image-small':'images'}),out=new Uint8Array(await result.blob.arrayBuffer());
 assert.equal(result.target.met,true);assert.ok(out.length<target*1000);assert.ok(out.length<bytes.length);
 const reopened=await PDFDocument.load(out);assert.equal(reopened.getPageCount(),1);assert.equal(reopened.getForm().getTextField('Applicant').getText(),'CV Applicant');
 assert.match(await text(out),/CV Applicant - Software Engineer/);
 const annots=reopened.getPage(0).node.Annots().asArray().map(ref=>reopened.context.lookup(ref));assert.ok(annots.some(a=>a.get(PDFName.of('Subtype'))?.toString()==='/Link'));
 assert.ok(annots.some(a=>a.get(PDFName.of('Subtype'))?.toString()==='/Link'&&reopened.context.lookup(a.get(PDFName.of('A'))).get(PDFName.of('URI')).decodeText()==='https://example.test/cv')); 
 console.log(`PASS CV target ${target} KB: ${bytes.length} -> ${out.length} bytes; selectable text, link and editable form retained.`);
}
const plain=await PDFDocument.create(),plainFont=await plain.embedFont(StandardFonts.Helvetica);plain.addPage([595,842]).drawText('Text-only CV Applicant',{x:40,y:780,size:12,font:plainFont});
const padded=Buffer.concat([Buffer.from(await plain.save()),Buffer.alloc(250000,32)]);
for(const target of [100,200]){const result=await run(new Uint8Array(padded),target);assert.equal(result.target.met,true);assert.ok(result.blob.size<target*1000);assert.match(await text(await result.blob.arrayBuffer()),/Text-only CV Applicant/);}
console.log('PASS text-only CV targets: structural compression preserves extracted text.');
const pattern=await (await import('node:fs/promises')).readFile(new URL('../.compression-fixtures/png-scan.pdf',import.meta.url));{const compact=await run(pattern,10000,{quality:'compact',compressTarget:''}),balanced=await run(pattern,10000,{quality:'images',compressTarget:''});assert.ok(balanced.blob.size<=compact.blob.size,'Image optimization must not replace a smaller lossless stream');console.log('PASS lossless PNG repacking wins over a larger JPEG conversion.');}

for(const quality of ['small','balanced','high']){const result=await run(bytes,100,{quality,compressTarget:''});const out=await PDFDocument.load(await result.blob.arrayBuffer());assert.equal(out.getPageCount(),1);assert.equal(out.getPage(0).getWidth(),595);assert.equal(out.getPage(0).getHeight(),842);assert.ok(result.blob.size<=bytes.length);if(result.report.includes('Image-based output'))assert.equal(out.getForm().getFields().length,0);}console.log('PASS all raster presets reopen, retain page geometry and never enlarge the source.');
// Exercise resizing separately: changing pixels must also change the stream dictionary.
await build({configFile:false,logLevel:'error',build:{ssr:'lib/optimize-jpeg.ts',outDir:'.compression-jpeg-check',emptyOutDir:true,rollupOptions:{output:{entryFileNames:'optimize.mjs'}}}});
const {optimizeJPEGImages}=await import('../.compression-jpeg-check/optimize.mjs');
const resized=await PDFDocument.load(bytes);assert.equal(await optimizeJPEGImages(resized,undefined,{quality:.7,maxDimension:600}),1);
const obj=resized.context.enumerateIndirectObjects().map(([,o])=>o).find(o=>o instanceof PDFRawStream&&o.dict.get(PDFName.of('Subtype'))?.toString()==='/Image');
const decoded=await loadImage(Buffer.from(obj.contents));assert.equal(decoded.width,450);assert.equal(decoded.height,600);assert.equal(obj.dict.lookup(PDFName.of('Width'),PDFNumber).asNumber(),450);assert.equal(obj.dict.lookup(PDFName.of('Height'),PDFNumber).asNumber(),600);
const impossible=await run(bytes,.01);assert.equal(impossible.target.met,false);assert.ok(impossible.blob.size<=bytes.length);assert.match(impossible.report,/Target not reached/);
const compact=await run(bytes,100,{quality:'compact'});assert.equal(compact.target.met,false);assert.match(await text(await compact.blob.arrayBuffer()),/CV Applicant/);
for(const invalid of ['0','-1','abc','Infinity'])await assert.rejects(()=>run(bytes,invalid),/positive target/);
const controller=new AbortController();controller.abort();await assert.rejects(()=>run(bytes,100,{},controller.signal),{name:'AbortError'});
console.log('PASS resize/decode dimensions, impossible-target reporting, compact-only preservation, invalid targets and cancellation. Native canvas fixture; real-browser quality requires separate validation.');

// Byte-identical embedded resources must share one stream without changing page references.
const duplicateDoc=await PDFDocument.create();
for(let i=0;i<2;i++){const page=duplicateDoc.addPage([595,842]),jpg=await duplicateDoc.embedJpg(photo.toBuffer('image/jpeg',100));page.drawImage(jpg,{x:40,y:100,width:300,height:400});page.drawText('Shared image page '+(i+1),{x:40,y:780});}
const duplicateSource=await duplicateDoc.save(),duplicateResult=await run(duplicateSource,10000,{quality:'compact',compressTarget:''}),sharedDoc=await PDFDocument.load(await duplicateResult.blob.arrayBuffer());
assert.equal(sharedDoc.getPageCount(),2);assert.ok(duplicateResult.blob.size<duplicateSource.length*.6);assert.equal(sharedDoc.context.enumerateIndirectObjects().filter(([,o])=>o instanceof PDFRawStream&&o.dict.get(PDFName.of('Subtype'))?.toString()==='/Image').length,1);
assert.match(await text(await duplicateResult.blob.arrayBuffer()),/Shared image page 1/);
console.log('PASS duplicate embedded image streams shared across two intact pages.');
await build({configFile:false,logLevel:'error',build:{ssr:'lib/deduplicate-streams.ts',outDir:'.stream-check',emptyOutDir:true,rollupOptions:{output:{entryFileNames:'streams.mjs'}}}});
const {deduplicateStreams}=await import('../.stream-check/streams.mjs');
const graph=await PDFDocument.create(),payload=new Uint8Array(2048).fill(37),first=graph.context.register(graph.context.stream(payload,{Marker:1})),second=graph.context.register(graph.context.stream(payload,{Marker:1})),different=graph.context.register(graph.context.stream(payload,{Marker:2}));
const holder=graph.context.obj({Nested:{Refs:[second,different]}});graph.context.register(holder);
assert.equal(await deduplicateStreams(graph),1);const refs=holder.lookup(PDFName.of('Nested')).lookup(PDFName.of('Refs'));assert.equal(refs.get(0),first);assert.equal(refs.get(1),different);assert.ok(graph.context.lookup(different));assert.equal(graph.context.lookup(second),undefined);
console.log('PASS nested array references redirected; distinct stream dictionaries preserved.');
