import assert from 'node:assert/strict';
import fs from 'node:fs';
import {resolve} from 'node:path';
import {execFileSync,spawnSync} from 'node:child_process';
import {build} from 'vite';
import {PDFDocument,StandardFonts} from 'pdf-lib';
import JSZip from 'jszip';

// Exercise the shipped engine, not a second implementation of the operation.
const dir='.guide-examples-check';
fs.mkdirSync(dir,{recursive:true});
await build({configFile:false,logLevel:'error',resolve:{alias:{'@':resolve('.')}},build:{ssr:'lib/pdf-engine.ts',outDir:dir,emptyOutDir:false,rollupOptions:{output:{entryFileNames:'engine.mjs'}}}});
const {processPDF,ranges}=await import('../'+dir+'/engine.mjs');
const destination='public/examples/guide-intent';
fs.mkdirSync(destination,{recursive:true});
const defaults={range:'',text:'',title:'',author:'',subject:'',password:'',quality:'compact',angle:'90',margin:'20',start:'1',columns:'2',fields:{}};
const results=[];
async function source(id,labels){
 const doc=await PDFDocument.create(),font=await doc.embedFont(StandardFonts.Helvetica);
 for(const [index,label] of labels.entries()){
  const page=doc.addPage([420,595]);
  page.drawText(label,{font,size:22,x:30,y:530});
  page.drawText(`PDF position ${index+1} of ${labels.length}`,{font,size:14,x:30,y:485});
  page.drawText('Synthetic teaching sample - no customer information',{font,size:10,x:30,y:40});
 }
 const bytes=await doc.save();
 fs.writeFileSync(`${destination}/${id}-input.pdf`,bytes);
 return {id,name:id+'.pdf',bytes,size:bytes.length,pages:labels.length};
}
function items(file){return Array.from({length:file.pages},(_,index)=>({id:file.id+'-'+index,fileId:file.id,index,rotation:0}));}
function labels(bytes,name){
 const path=`${dir}/${name}.pdf`;fs.writeFileSync(path,bytes);
 return execFileSync('pdftotext',['-layout',path,'-'],{encoding:'utf8'}).split('\f').map(p=>p.trim().split('\n')[0]).filter(Boolean);
}
async function run(id,tool,input,options,expected){
 const file=await source(id,input);
 const output=await processPDF(tool,[file],items(file),[],{...defaults,...options},()=>{});
 const bytes=new Uint8Array(await output.blob.arrayBuffer()),zip=output.name.endsWith('.zip');
 const href=`${destination}/${id}-result.${zip?'zip':'pdf'}`;
 fs.writeFileSync(href,bytes);
 let actual;
 if(zip){
  const archive=await JSZip.loadAsync(bytes);
  actual=await Promise.all(Object.values(archive.files).filter(f=>!f.dir).map(async(f,i)=>({name:f.name,pages:labels(await f.async('uint8array'),id+'-'+i)})));
  assert.deepEqual(actual.map(f=>f.pages),expected);
 }else{actual=labels(bytes,id);assert.deepEqual(actual,expected);}
 results.push({id,tool,options,expected,actual,input:`/${destination.slice(7)}/${id}-input.pdf`,output:`/${href.slice(7)}`});
 return {file,output:bytes};
}
await run('select-chapter','split',['Cover','Contents','Chapter 1','Chapter 2'],{range:'3-4',splitOutput:'one'},['Chapter 1','Chapter 2']);
await run('invoice-groups','split',['Batch cover','INV-101 main','INV-101 receipt','INV-102 main','INV-103 main','INV-103 receipt'],{range:'2-3;5-6',splitOutput:'groups'},[['INV-101 main','INV-101 receipt'],['INV-103 main','INV-103 receipt']]);
await run('selection-order','split',['A1','A2','A3'],{range:'3,1,3',splitOutput:'one'},['A3','A1']);
await run('reverse-basics','reverse',['A1','A2','A3'],{},['A3','A2','A1']);
const backs=await run('reverse-backs','reverse',['B3','B2','B1'],{},['B1','B2','B3']);
await run('reverse-misplaced','reverse',['A1','A3','A2'],{},['A2','A3','A1']);
const front=await source('fronts',['A1','A2','A3']);
const back={...backs.file,bytes:backs.output,size:backs.output.length};
const mixed=await processPDF('interleave',[front,back],[...items(front),...items(back)],[],defaults,()=>{});
const mixedBytes=new Uint8Array(await mixed.blob.arrayBuffer());
assert.deepEqual(labels(mixedBytes,'mixed'),['A1','B1','A2','B2','A3','B3']);
fs.writeFileSync(`${destination}/reverse-backs-mixed.pdf`,mixedBytes);
assert.deepEqual(ranges('',3),[0,1,2]);
assert.throws(()=>ranges('1–3',3),/Use page numbers/);
assert.throws(()=>ranges('4',3),/between 1 and 3/);
assert.throws(()=>ranges('3-1',3),/between 1 and 3/);
const form=await PDFDocument.create();form.addPage([420,595]);form.addPage([420,595]);
form.getForm().createTextField('name').addToPage(form.getPage(0),{x:30,y:100,width:150,height:20});
const bytes=await form.save(),file={id:'form',name:'form.pdf',bytes,size:bytes.length,pages:2};
await assert.rejects(()=>processPDF('split',[file],items(file),[],{...defaults,range:'1'},()=>{}),/fillable fields/);
const report={date:new Date().toISOString().slice(0,10),environment:`Node ${process.version}; pdf-lib; ${spawnSync('pdftotext',['-v'],{encoding:'utf8'}).stderr.split('\n')[0]}`,scope:'Fresh synthetic engine runs. Independent text-order checks; no real-device, production or visual-fidelity guarantee.',results,limitations:['Blank range selects every page.','En dash and descending ranges are rejected.','Repeated positions are deduplicated in first-encounter order.','Copying a subset of fillable pages requires read-only fields.','Reverse reverses all pages, not just a misplaced pair.']};
fs.writeFileSync(`${destination}/verification.json`,JSON.stringify(report,null,2)+'\n');
console.log(`PASS: ${results.length} distinct examples, grouped ZIP contents, front/back interleave and five limitation assertions.`);
