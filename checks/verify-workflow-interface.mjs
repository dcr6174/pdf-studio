import assert from 'node:assert/strict';
import {build} from 'vite';
import {PDFDocument,StandardFonts,decodePDFRawStream} from 'pdf-lib';
await build({configFile:false,logLevel:'error',build:{ssr:'lib/pdf-engine.ts',outDir:'.workflow-check',emptyOutDir:true,rollupOptions:{output:{entryFileNames:'engine.mjs'}}}});
const {processPDF}=await import('../.workflow-check/engine.mjs');
async function fixture(id,width,label){const doc=await PDFDocument.create(),font=await doc.embedFont(StandardFonts.Helvetica);doc.addPage([width,600]).drawText(label,{font,x:30,y:550});const bytes=await doc.save();return {id,name:id+'.pdf',doc,bytes,size:bytes.length,pages:1};}
const first=await fixture('first',400,'FIRST'),second=await fixture('second',500,'SECOND');
const items=files=>files.map(f=>({id:f.id+'-page',fileId:f.id,index:0,rotation:0}));
const defaults={range:'',text:'',title:'',author:'',subject:'',password:'',quality:'balanced',angle:'90',margin:'20',start:'1',columns:'2',fields:{},recipe:'custom'};
const run=(files,workflowSteps,workflowSettings=workflowSteps.map(()=>({})),workflowDisabled=[])=>processPDF('workflow',files,items(files),[],{...defaults,workflowSteps,workflowSettings,workflowDisabled},()=>{});
const pdf=async out=>PDFDocument.load(await out.blob.arrayBuffer(),{updateMetadata:false});
let result=await pdf(await run([first],['compress'],[{quality:'compact'}]));assert.equal(result.getPageCount(),1);assert.equal(result.getPage(0).getWidth(),400);
const content=result.getPage(0).node.Contents().asArray().map(ref=>Buffer.from(decodePDFRawStream(result.context.lookup(ref)).decode()).toString()).join('');assert.match(content,/4649525354/i,'default compression retains original text objects');
result=await pdf(await run([second,first],['merge','rotate','compress'],[{}, {angle:'90'},{quality:'compact'}]));assert.equal(result.getPageCount(),2);assert.equal(result.getPage(0).getWidth(),500);assert.equal(result.getPage(1).getWidth(),400);assert.equal(result.getPage(0).getRotation().angle,90);
result=await pdf(await run([first],['rotate','compress'],[{angle:'90'},{quality:'compact'}],[0]));assert.equal(result.getPage(0).getRotation().angle,0);
await assert.rejects(run([first],['merge']),/second PDF/);await assert.rejects(run([first,second],['compress','merge']),/first step/);await assert.rejects(run([first],['remove'],[{range:'1'}]),/at least one page/);await assert.rejects(run([first],['compress'],[{quality:'compact'}],[0]),/at least one workflow step/);
assert.equal(first.doc.getPage(0).getRotation().angle,0);assert.equal(first.doc.getPageCount(),1);
console.log('PASS: actual workflow engine default text retention, merged file order, rotation/settings, disabled steps, invalid sequences, original document preservation.');
