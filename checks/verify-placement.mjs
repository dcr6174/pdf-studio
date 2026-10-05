import fs from 'node:fs';
import assert from 'node:assert/strict';
import ts from 'typescript';
import {build} from 'vite';
import {PDFDocument,degrees,decodePDFRawStream,PDFName,PDFDict} from 'pdf-lib';
const source=fs.readFileSync(new URL('../lib/mark-resize.ts',import.meta.url),'utf8');
const {resizeBox,resizeHandles}=await import('data:text/javascript;base64,'+Buffer.from(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext}}).outputText).toString('base64'));
const box={x:.2,y:.3,w:.4,h:.2};
for(const handle of resizeHandles)for(const dx of [-5,-.05,0,.05,5])for(const dy of [-5,-.05,0,.05,5]){
 const r=resizeBox(box,handle,dx,dy);
 assert(r.x>=0&&r.y>=0&&r.x+r.w<=1.00001&&r.y+r.h<=1.00001&&r.w>=.02999&&r.h>=.01999);
 if(!handle.includes('w'))assert.equal(r.x,box.x);
 if(!handle.includes('n'))assert.equal(r.y,box.y);
 if(['nw','ne','sw','se'].includes(handle)){
  const p=resizeBox(box,handle,dx,dy,true);assert(Math.abs(p.w/p.h-box.w/box.h)<1e-9);
  assert(p.x>=-1e-9&&p.y>=-1e-9&&p.x+p.w<=1.00001&&p.y+p.h<=1.00001);
 }
}
await build({configFile:false,logLevel:'error',build:{ssr:'lib/pdf-engine.ts',outDir:'.placement-check',emptyOutDir:true,rollupOptions:{output:{entryFileNames:'engine.mjs'}}}});
const {applyMarks,processPDF}=await import('../.placement-check/engine.mjs');
const oldFetch=globalThis.fetch;
globalThis.fetch=async url=>{assert.equal(String(url),'/fonts/NotoSans-Regular.ttf');return new Response(fs.readFileSync(new URL('../public/fonts/NotoSans-Regular.ttf',import.meta.url)));};
try{
 const doc=await PDFDocument.create(),order=[];
 for(const rotation of [0,90,180,270]){
  const p=doc.addPage([400,600]);p.setRotation(degrees(rotation));order.push({id:'p'+rotation,index:order.length,fileId:'test',rotation:0});
 }
 const marks=order.map(p=>({id:p.id,pageId:p.id,kind:'text',x:.2,y:.3,w:.6,h:.15,fontSize:24,color:'#6545df',text:'DRAFT',watermark:true,opacity:.22}));
 await applyMarks(doc,order,marks);
 const bytes=await doc.save(),reopened=await PDFDocument.load(bytes);
 const input=await PDFDocument.create();input.addPage([400,600]);const original=await input.save();const file={id:'test',name:'fixture.pdf',bytes:original,size:original.length,pages:1,doc:input};const options={range:'',text:'',title:'',author:'',subject:'',password:'',quality:'balanced',angle:'90',margin:'20',start:'1',columns:'2',fields:{}};
 await assert.rejects(()=>processPDF('watermark',[file],[order[0]],[],options,()=>{}),/Place a watermark/);
 const result=await processPDF('watermark',[file],[order[0]],[marks[0]],options,()=>{});assert.equal((await PDFDocument.load(await result.blob.arrayBuffer())).getPageCount(),1);
 assert.equal(reopened.getPageCount(),4);
 for(const p of reopened.getPages()){
  const streams=p.node.Contents().asArray().map(ref=>Buffer.from(decodePDFRawStream(reopened.context.lookup(ref)).decode()).toString()).join('');
  assert.match(streams,/ cm/);assert.match(streams,/ gs/);assert.match(streams,/ Tj/);
  const states=p.node.Resources().lookupMaybe(PDFName.of('ExtGState'),PDFDict);
  assert(states&&states.values().some(v=>reopened.context.lookup(v).get(PDFName.of('ca')).asNumber()===.22));
 }
 // Saving only when explicitly requested keeps ordinary checks free of artifacts.
 if(process.env.PLACEMENT_PDF)fs.writeFileSync(process.env.PLACEMENT_PDF,bytes);
 console.log('PASS: 200 edge/corner boundary cases, proportional corner checks, and reopened exports at four page rotations with opacity.');
}finally{globalThis.fetch=oldFetch;}
