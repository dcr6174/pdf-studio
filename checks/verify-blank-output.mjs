import fs from 'node:fs';
import assert from 'node:assert/strict';
import ts from 'typescript';
import {build} from 'vite';
import {PDFDocument,StandardFonts,degrees,decodePDFRawStream} from 'pdf-lib';
const source=fs.readFileSync(new URL('../lib/output-integrity.ts',import.meta.url),'utf8');
const {pixelsHaveInk,rejectBlankOutput}=await import('data:text/javascript;base64,'+Buffer.from(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext}}).outputText).toString('base64'));
assert.equal(pixelsHaveInk(new Uint8Array([255,255,255,255,0,0,0,0])),false);
assert.equal(pixelsHaveInk(new Uint8Array([0,0,0,255])),true);
await assert.rejects(()=>rejectBlankOutput(['blank'],['ink'],async page=>page==='ink'),/result is blank/);
await rejectBlankOutput(['blank'],['blank'],async()=>false);
await rejectBlankOutput(['ink'],['ink'],async()=>true);
const controller=new AbortController();controller.abort();await assert.rejects(()=>rejectBlankOutput(['blank'],['blank'],async()=>false,controller.signal),{name:'AbortError'});
await build({configFile:false,logLevel:'error',build:{ssr:'lib/pdf-engine.ts',outDir:'.blank-check',emptyOutDir:true,rollupOptions:{output:{entryFileNames:'engine.mjs'}}}});
const {processPDF}=await import('../.blank-check/engine.mjs');
const oldFetch=globalThis.fetch;globalThis.fetch=async url=>{assert.equal(String(url),'/fonts/NotoSans-Regular.ttf');return new Response(fs.readFileSync(new URL('../public/fonts/NotoSans-Regular.ttf',import.meta.url)));};
try{
 const image=fs.readFileSync(new URL('../public/brand/pdf-studio-logo-v5.png',import.meta.url));
 const photo={id:'photo',name:'photo.png',bytes:new Uint8Array(image),size:image.length,pages:1,image:'data:image/png;base64,'+image.toString('base64')};
 const photoPages=[{id:'photo-page',fileId:'photo',index:0,rotation:0}];
 const options={range:'',text:'',title:'',author:'',subject:'',password:'',quality:'compact',angle:'90',margin:'20',start:'1',columns:'2',fields:{}};
 for(const id of ['organize','edit','sign','compress']){
  const output=await processPDF(id,[photo],photoPages,[],options,()=>{});
  const bytes=new Uint8Array(await output.blob.arrayBuffer());assert.match(new TextDecoder().decode(bytes.slice(0,8)),/%PDF-/);
  const d=await PDFDocument.load(bytes);assert.equal(d.getPageCount(),1);
  const content=d.getPage(0).node.Contents().asArray().map(ref=>Buffer.from(decodePDFRawStream(d.context.lookup(ref)).decode()).toString()).join('');assert.match(content,/ Do/);
 }
 const doc=await PDFDocument.create(),font=await doc.embedFont(StandardFonts.Helvetica);
 for(let i=0;i<4;i++){const p=doc.addPage([400,600]);p.drawText('Content must survive '+i,{font,x:40,y:480,size:24});p.setRotation(degrees(i*90));}
 const bytes=await doc.save(),file={id:'pdf',name:'test.pdf',bytes,size:bytes.length,pages:4,doc},pages=doc.getPages().map((_,index)=>({id:'p'+index,fileId:'pdf',index,rotation:0}));
 const original=await processPDF('edit',[file],pages,[],options,()=>{});assert.deepEqual(new Uint8Array(await original.blob.arrayBuffer()),bytes);const organized=await processPDF('organize',[file],pages,[],{...options,flattenForm:true},()=>{});assert.deepEqual(new Uint8Array(await organized.blob.arrayBuffer()),bytes);
 for(const id of ['rotate','reverse','split','compress','edit','sign','watermark']){
  const marks=['edit','sign','watermark'].includes(id)?[{id:'mark',pageId:'p0',kind:'text',text:'DRAFT',fontSize:24,x:.2,y:.5,w:.6,h:.15,color:'#6545df',watermark:id==='watermark'}]:[];
  const output=await processPDF(id,[file],pages,marks,{...options,range:'2-3'},()=>{}),result=await PDFDocument.load(await output.blob.arrayBuffer());
  assert.equal(result.getPageCount(),id==='split'?2:4);
  for(const p of result.getPages()){const content=p.node.Contents().asArray().map(ref=>Buffer.from(decodePDFRawStream(result.context.lookup(ref)).decode()).toString()).join('');assert.match(content,/ Tj/);}
  if(process.env.BLANK_TEST_DIR)fs.writeFileSync(process.env.BLANK_TEST_DIR+'/'+id+'.pdf',new Uint8Array(await output.blob.arrayBuffer()));
 }
 console.log('PASS: blank-output rejection, legitimate blanks, cancellation, image-to-PDF regression across four tools, unchanged PDF byte identity, and content preservation across seven export paths.');
}finally{globalThis.fetch=oldFetch;}

