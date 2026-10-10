import assert from 'node:assert/strict';
import ts from 'typescript';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
import {build} from 'vite';
import {PDFDocument,StandardFonts,decodePDFRawStream} from 'pdf-lib';
await build({configFile:false,logLevel:'error',build:{ssr:'lib/pdf-engine.ts',outDir:'.workflow-check',emptyOutDir:true,rollupOptions:{output:{entryFileNames:'engine.mjs'}}}});
const {processPDF}=await import('../.workflow-check/engine.mjs');
async function fixture(id,width,label){const doc=await PDFDocument.create(),font=await doc.embedFont(StandardFonts.Helvetica);doc.addPage([width,600]).drawText(label,{font,x:30,y:550});const bytes=await doc.save();return {id,name:id+'.pdf',doc,bytes,size:bytes.length,pages:1};}
const first=await fixture('first',400,'FIRST'),second=await fixture('second',500,'SECOND');
const items=files=>files.flatMap(f=>Array.from({length:f.pages},(_,index)=>({id:f.id+'-page-'+index,fileId:f.id,index,rotation:0})));
const defaults={range:'',text:'',title:'',author:'',subject:'',password:'',quality:'balanced',angle:'90',margin:'20',start:'1',columns:'2',fields:{},recipe:'custom'};
const run=(files,workflowSteps,workflowSettings=workflowSteps.map(()=>({})),workflowDisabled=[])=>processPDF('workflow',files,items(files),[],{...defaults,workflowSteps,workflowSettings,workflowDisabled},()=>{});
const pdf=async out=>PDFDocument.load(await out.blob.arrayBuffer(),{updateMetadata:false});
let result=await pdf(await run([first],['compress'],[{quality:'compact'}]));assert.equal(result.getPageCount(),1);assert.equal(result.getPage(0).getWidth(),400);
const content=result.getPage(0).node.Contents().asArray().map(ref=>Buffer.from(decodePDFRawStream(result.context.lookup(ref)).decode()).toString()).join('');assert.match(content,/4649525354/i,'default compression retains original text objects');
result=await pdf(await run([second,first],['merge','rotate','compress'],[{}, {angle:'90'},{quality:'compact'}]));assert.equal(result.getPageCount(),2);assert.equal(result.getPage(0).getWidth(),500);assert.equal(result.getPage(1).getWidth(),400);assert.equal(result.getPage(0).getRotation().angle,90);
result=await pdf(await run([first],['rotate','compress'],[{angle:'90'},{quality:'compact'}],[0]));assert.equal(result.getPage(0).getRotation().angle,0);
await assert.rejects(run([first],['merge']),/second PDF/);await assert.rejects(run([first,second],['compress','merge']),/first step/);await assert.rejects(run([first],['remove'],[{range:'1'}]),/at least one page/);await assert.rejects(run([first],['compress'],[{quality:'compact'}],[0]),/at least one enabled workflow step/);
assert.equal(first.doc.getPage(0).getRotation().angle,0);assert.equal(first.doc.getPageCount(),1);
console.log('PASS: actual workflow engine default text retention, merged file order, rotation/settings, disabled steps, invalid sequences, original document preservation.');

// Everyday jobs use the same engine as custom recipes.
result=await pdf(await run([second,first],['merge','numbers'],[{}, {start:'5',numberPosition:'bottom-center'}]));assert.equal(result.getPageCount(),2);assert.equal(result.getPage(0).getWidth(),500);
result=await pdf(await run([first],['clean','compress'],[{}, {quality:'compact'}]));assert.equal(result.getPageCount(),1);
result=await pdf(await run([first],['resize','numbers'],[{resizeSize:'letter',resizeOrientation:'landscape'},{}]));assert.equal(Math.round(result.getPage(0).getWidth()),792);assert.equal(Math.round(result.getPage(0).getHeight()),612);
const originalFetch=globalThis.fetch;
const fontBytes=await readFile(new URL('../public/fonts/NotoSans-Regular.ttf',import.meta.url));
globalThis.fetch=async url=>{assert.equal(url,'/fonts/NotoSans-Regular.ttf');return new Response(fontBytes);};
try {result=await pdf(await run([first],['watermark','numbers'],[{text:'Approved',angle:'45'},{}]));assert.equal(result.getPageCount(),1);
result=await pdf(await run([second,first],['merge','rotate','watermark'],[{}, {angle:'270'}, {text:'APPROVED',angle:'0'}]));
assert.equal(result.getPageCount(),2);
assert.equal(result.getPage(0).getRotation().angle,270);
assert.equal(result.getPage(1).getRotation().angle,270);
assert.equal(first.doc.getPage(0).getRotation().angle,0,'guided changes keep original documents unchanged');

result=await pdf(await run([second,first],['merge','numbers','rotate','watermark'],[{}, {start:'5',numberPosition:'bottom-center'}, {angle:'270'}, {text:'APPROVED',angle:'0'}]));
assert.equal(result.getPageCount(),2,'library-selected sequence creates one two-page PDF');
assert.equal(result.getPage(0).getRotation().angle,270,'rotation survives numbering before watermark');
assert.equal(first.doc.getPage(0).getRotation().angle,0,'reordered sequence keeps originals');
}finally{globalThis.fetch=originalFetch;}
console.log('PASS: everyday combine/number, share, print and watermark jobs produce real PDFs.');

// Full-document sizing must process every page, not only a preview page.
const tenDoc=await PDFDocument.create();for(let i=0;i<10;i++)tenDoc.addPage([400+i*10,600]);const tenBytes=await tenDoc.save();const tenFile={id:'ten',name:'ten.pdf',doc:tenDoc,bytes:tenBytes,size:tenBytes.length,pages:10};
result=await pdf(await run([tenFile],['resize'],[{resizeSize:'a4',resizeOrientation:'portrait'}]));assert.equal(result.getPageCount(),10);for(const page of result.getPages()){assert.equal(Math.round(page.getWidth()),595);assert.equal(Math.round(page.getHeight()),842);}assert.equal(tenDoc.getPage(0).getWidth(),400,'full-document resize preserves original');
result=await pdf(await run([first],['duplicate','remove'],[{}, {range:'2'}]));assert.equal(result.getPageCount(),1,'remove can address pages created by an earlier step');
console.log('PASS: all ten pages resize to A4 and page ranges use the result of earlier actions.');

const recipes={};
vm.runInNewContext(ts.transpile(await readFile('lib/workflow-recipes.ts','utf8'),{module:ts.ModuleKind.CommonJS}),{exports:recipes,Error});
const readiness={};
vm.runInNewContext(ts.transpile(await readFile('lib/task-readiness.ts','utf8'),{module:ts.ModuleKind.CommonJS}),{exports:readiness,Error,require:name=>{assert.equal(name,'./workflow-recipes');return recipes;}});
const longSteps=['rotate','resize','numbers','clean','reverse','flip','blank','duplicate','compress'];
const longSettings=longSteps.map(step=>recipes.workflowSettings(step,{}));
const longRecipe=recipes.readWorkflowRecipe({name:'Long workflow',steps:longSteps,settings:longSettings});
assert.equal(longRecipe.steps.length,9,'recipes accept more than eight steps');
assert.equal(readiness.taskInputIssue('workflow',1,{...defaults,workflowSteps:longSteps,workflowSettings:longSettings},false,1),'','readiness accepts more than eight steps');
result=await pdf(await run([first],longSteps,longSettings));
assert.equal(result.getPageCount(),4,'all nine steps execute, including blank insertion and duplication');
assert.equal(first.doc.getPageCount(),1,'long workflow preserves original pages');
console.log('PASS: more than eight actions accepted by recipes, readiness and the real workflow engine.');

const presetExports={};
vm.runInNewContext(ts.transpile(await readFile('lib/workflow-presets.ts','utf8'),{module:ts.ModuleKind.CommonJS}),{exports:presetExports,require:name=>{assert.equal(name,'./workflow-recipes');return recipes;}});
assert.equal(presetExports.workflowPresets.length,8);
globalThis.fetch=async url=>{assert.equal(url,'/fonts/NotoSans-Regular.ttf');return new Response(fontBytes);};
try{
 for(const preset of presetExports.workflowPresets){
  for(const inputs of [[first],[first,second]]){
   const state=presetExports.workflowPresetState(preset,inputs.length);
   assert.equal(readiness.taskInputIssue('workflow',inputs.length,{...defaults,workflowSteps:state.steps,workflowSettings:state.settings},false,inputs.length),'',preset.id+' is ready');
   const processed=await pdf(await run(inputs,state.steps,state.settings));
   assert.equal(processed.getPageCount(),inputs.length,preset.id+' retains all pages');
   if(inputs.length>1)assert.equal(state.steps[0],'merge',preset.id+' combines inputs first');
  }
 }
}finally{globalThis.fetch=originalFetch;}
assert.equal(first.doc.getPageCount(),1);
console.log('PASS: all eight predefined workflows run on one or two PDFs, with merge first and originals retained.');
