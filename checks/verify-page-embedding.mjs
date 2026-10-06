import fs from 'node:fs';
import assert from 'node:assert/strict';
import {build} from 'vite';
import {execFileSync} from 'node:child_process';
import {PDFDocument,StandardFonts,degrees,rgb,PDFName,PDFDict} from 'pdf-lib';
await build({configFile:false,logLevel:'error',build:{ssr:'lib/pdf-engine.ts',outDir:'.embedding-check',emptyOutDir:true,rollupOptions:{output:{entryFileNames:'engine.mjs'}}}});
const {processPDF}=await import('../.embedding-check/engine.mjs');
globalThis.fetch=async()=>new Response(fs.readFileSync('public/fonts/NotoSans-Regular.ttf'));
const d=await PDFDocument.create(),font=await d.embedFont(StandardFonts.Helvetica);
for(let i=0;i<4;i++){const p=d.addPage([440,640]);p.setCropBox(20,30,400,600);p.setRotation(degrees(i*90));p.drawRectangle({x:80,y:350,width:200,height:120,color:rgb(.15,.3,.7)});p.drawText('VISIBLE CONTENT '+i,{font,size:20,x:60,y:540});}
const bytes=await d.save(),file={id:'source',name:'source.pdf',bytes,size:bytes.length,pages:4,doc:d},pages=d.getPages().map((_,index)=>({id:'p'+index,fileId:file.id,index,rotation:0}));
const options={range:'',text:'',title:'',author:'',subject:'',password:'',quality:'compact',angle:'90',margin:'20',start:'1',columns:'2',fields:{}};
const dir=fs.mkdtempSync('/tmp/pdf-embedding-');
function assertPainted(path){
 execFileSync('pdftoppm',['-scale-to','500','-png',path,path.replace(/\.pdf$/,'')],{stdio:'pipe'});
 const stats=JSON.parse(execFileSync('python3',['-c',`import json,sys;from pathlib import Path;from PIL import Image;p=Path(sys.argv[1]);print(json.dumps([sum(1 for x in Image.open(f).convert("RGB").getdata() if min(x)<220) for f in p.parent.glob(p.stem+"-*.png")]))`,path],{encoding:'utf8'}));
 assert(stats.length>0);for(const ink of stats)assert(ink>500,'Export rendered blank or lost the painted source rectangle');
}
try{
 for(const id of ['flip','resize','nup']){
  const output=await processPDF(id,[file],pages,[],options,()=>{}),b=new Uint8Array(await output.blob.arrayBuffer()),reopened=await PDFDocument.load(b);
  assert.equal(reopened.getPageCount(),id==='nup'?2:4);
  const path=dir+'/'+id+'.pdf';fs.writeFileSync(path,b);assertPainted(path);
 }
 const made=await processPDF('create-form',[],[],[],{...options,text:'Name'},()=>{}),fb=new Uint8Array(await made.blob.arrayBuffer()),formDoc=await PDFDocument.load(fb),widget=formDoc.getForm().getFields()[0].acroField.getWidgets()[0];
 const mk=widget.dict.lookup(PDFName.of('MK'),PDFDict);assert(!mk.has(PDFName.of('BG'))||mk.lookup(PDFName.of('BG')).toString()==='[ ]','Generated field must have no opaque background');
 const f={id:'form',name:'form.pdf',bytes:fb,size:fb.length,pages:1,doc:formDoc},order=[{id:'form-page',fileId:'form',index:0,rotation:0}];
 const mark={id:'signed',pageId:'form-page',kind:'text',text:'SIGNED',x:.10,y:.12,w:.5,h:.08,fontSize:24,color:'#6545df'};
 await assert.rejects(()=>processPDF('sign',[f],order,[mark],options,()=>{}),/overlaps a fillable field/);
 const signed=await processPDF('sign',[f],order,[mark],{...options,flattenForm:true},()=>{}),sb=new Uint8Array(await signed.blob.arrayBuffer()),read=await PDFDocument.load(sb);
 assert.equal(read.getForm().getFields().length,0);
 const signedPath=dir+'/signed.pdf';fs.writeFileSync(signedPath,sb);assertPainted(signedPath);
 console.log('PASS: all pages visibly render after mirror, A4 resize and n-up with four rotations and CropBoxes; transparent generated fields, overlap rejection and opt-in flattening before signing.');
}finally{fs.rmSync(dir,{recursive:true,force:true});}

