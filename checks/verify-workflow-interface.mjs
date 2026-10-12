import assert from 'node:assert/strict';
import ts from 'typescript';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
import {build} from 'vite';
import {PDFDocument,StandardFonts,decodePDFRawStream,PDFName,PDFDict,PDFArray,PDFNumber} from 'pdf-lib';
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
assert.equal(presetExports.workflowPresets.length,10);
globalThis.fetch=async url=>{assert.equal(url,'/fonts/NotoSans-Regular.ttf');return new Response(fontBytes);};
try{
 for(const preset of presetExports.workflowPresets){
  for(const inputs of [[first],[first,second]]){
   const state=presetExports.workflowPresetState(preset,inputs.length);
   if(preset.id==='selected-pages')state.settings[state.steps.indexOf('extract')]={range:`1-${inputs.length}`};
   assert.equal(readiness.taskInputIssue('workflow',inputs.length,{...defaults,workflowSteps:state.steps,workflowSettings:state.settings},false,inputs.length),'',preset.id+' is ready');
   const processed=await pdf(await run(inputs,state.steps,state.settings));
   assert.equal(processed.getPageCount(),preset.id==='save-paper'?Math.ceil(inputs.length/2):inputs.length,preset.id+' creates the expected pages');
   if(inputs.length>1)assert.equal(state.steps[0],'merge',preset.id+' combines inputs first');
  }
 }
}finally{globalThis.fetch=originalFetch;}
assert.equal(first.doc.getPageCount(),1);
console.log('PASS: all ten predefined workflows run on one or two PDFs, with merge first and originals retained.');

// Missing inputs belong to their own action, including long workflows.
const sixteen=['rotate','resize','watermark','numbers','flatten','clean','compress','crop','headers','reverse','duplicate','blank','bates','flip','remove','reorder'];
const sixteenSettings=sixteen.map(step=>recipes.workflowSettings(step,{}));
let inputIssues=readiness.workflowInputIssues(sixteen,sixteenSettings,[],1,2);
assert.deepEqual(Array.from(inputIssues,e=>e.index),[14,15]);
assert.match(inputIssues[0].message,/pages to remove/i);
assert.match(inputIssues[1].message,/page order/i);
sixteenSettings[14]={range:'2'};sixteenSettings[15]={range:'1-4'};
assert.equal(readiness.workflowInputIssues(sixteen,sixteenSettings,[],1,2).length,0,'sixteen valid actions have no action-count restriction');
assert.equal(readiness.taskInputIssue('workflow',1,{...defaults,workflowSteps:sixteen,workflowSettings:sixteenSettings},false,2),'');
sixteenSettings[15]={range:'1-5'};
assert.match(readiness.workflowInputIssues(sixteen,sixteenSettings,[],1,2)[0].message,/4|every page/i,'range bounds follow duplicate, blank and removal');
assert.equal(readiness.workflowInputIssues(['remove','reorder'],[{range:''},{range:''}],[0],1,2)[0].index,1,'disabled actions need no details');
assert.equal(readiness.workflowInputIssues(['numbers','watermark'],[{start:''},{text:''}],[],1,2).length,2,'report all missing details together');
console.log('PASS: per-action missing inputs, sixteen actions, disabled actions and sequential page bounds.');

// Every listed operation must run through the real PDF workflow engine.
assert.equal(recipes.workflowChoices.length,30);
const seeds={remove:{range:'10'},reorder:{range:'10,1-9'},extract:{range:'1,3-5'},metadata:{title:'Invoice',author:'PDF Studio',subject:'Quarterly report'},bookmarks:{text:'1 Introduction\n3 Details'}};
globalThis.fetch=async url=>{assert.equal(url,'/fonts/NotoSans-Regular.ttf');return new Response(fontBytes);};
try{
 for(const [operation] of recipes.workflowChoices){
  const inputs=['merge','interleave'].includes(operation)?[second,first]:[tenFile];
  const settings=recipes.workflowSettings(operation,seeds[operation]);
  assert.equal(readiness.taskInputIssue('workflow',inputs.length,{...defaults,workflowSteps:[operation],workflowSettings:[settings]},false,inputs.reduce((n,f)=>n+f.pages,0)),'',operation+' readiness');
  const doc=await pdf(await run(inputs,[operation],[settings]));
  const expected={merge:2,interleave:2,remove:9,extract:4,odd:5,even:5,halve:20,nup:5,duplicate:20,blank:11}[operation]??10;
  assert.equal(doc.getPageCount(),expected,operation+' page count');
  if(operation==='extract')assert.deepEqual(doc.getPages().map(p=>p.getWidth()),[400,420,430,440]);
  if(operation==='odd')assert.equal(doc.getPage(1).getWidth(),420);
  if(operation==='even')assert.equal(doc.getPage(0).getWidth(),410);
  if(operation==='interleave')assert.deepEqual(doc.getPages().map(p=>p.getWidth()),[500,400]);
  if(operation==='halve')assert.equal(doc.getPage(0).getCropBox().width,200);
  if(operation==='viewer')assert.equal(doc.catalog.get(PDFName.of('PageLayout')).toString(),'/SinglePage');
  if(operation==='metadata'){assert.equal(doc.getTitle(),'Invoice');assert.equal(doc.getAuthor(),'PDF Studio');}
  if(operation==='bookmarks')assert.equal(doc.catalog.lookup(PDFName.of('Outlines'),PDFDict).lookup(PDFName.of('Count')).asNumber(),2);
 }
}finally{globalThis.fetch=originalFetch;}
await assert.rejects(run([first],['interleave']),/second PDF/);
await assert.rejects(run([first,second],['rotate','interleave']),/first step/);
await assert.rejects(run([first],['even']),/no even pages/);
assert.equal(readiness.taskInputIssue('workflow',1,{...defaults,workflowSteps:['nup','remove'],workflowSettings:[{columns:'4'},{range:'4'}]},false,10).includes('1-3'),true);
assert.equal(readiness.taskInputIssue('workflow',1,{...defaults,workflowSteps:['extract','bookmarks'],workflowSettings:[{range:'1,3'},{text:'3 Missing page'}]},false,10).includes('valid page'),true);
result=await pdf(await run([tenFile],['bookmarks','remove-bookmarks'],[{text:'1 Introduction\n3 Details'},{}]));
assert.equal(result.catalog.has(PDFName.of('Outlines')),false);
const rich=await PDFDocument.create();const richPage=rich.addPage([400,600]);richPage.drawText('CONTENT');const richForm=rich.getForm();richForm.createTextField('Name').addToPage(richPage,{x:20,y:200,width:100,height:30});richForm.getTextField('Name').setText('Alice');
const richAnnots=richPage.node.lookup(PDFName.of('Annots'),PDFArray);
for(const subtype of ['Link','Text'])richAnnots.push(rich.context.register(rich.context.obj({Type:'Annot',Subtype:subtype,Rect:[20,20,60,50],Contents:'Example',...(subtype==='Link'?{A:{S:'URI',URI:'https://example.com'}}:{})})));
await rich.attach(new Uint8Array([65,66,67]),'example.txt');const richBytes=await rich.save();const richFile={id:'rich',name:'rich.pdf',bytes:richBytes,size:richBytes.length,pages:1,doc:rich};
const annotations=doc=>doc.getPage(0).node.lookup(PDFName.of('Annots'),PDFArray).asArray().map(ref=>doc.context.lookup(ref,PDFDict).get(PDFName.of('Subtype')).toString());
result=await pdf(await run([richFile],['remove-links']));assert.equal(annotations(result).includes('/Link'),false);assert.equal(annotations(result).includes('/Text'),true);
result=await pdf(await run([richFile],['remove-annotations']));assert.deepEqual(annotations(result),['/Widget']);assert.equal(result.getForm().getTextField('Name').getText(),'Alice');
result=await pdf(await run([richFile],['remove-attachments']));assert.equal(result.catalog.lookup(PDFName.of('Names'),PDFDict).has(PDFName.of('EmbeddedFiles')),false);
assert.equal(tenDoc.getPageCount(),10);assert.equal(rich.getForm().getTextField('Name').getText(),'Alice');
console.log('PASS: all thirty operations, ten presets, page transformations, alternating PDFs, bookmarks, metadata and targeted cleanup with originals retained.');

// New settings affect real PDF content and remain compatible with old recipes.
const styled={text:'COPY',angle:'25',watermarkColor:'#ef3344',watermarkOpacity:'65',watermarkSize:'48',watermarkPosition:'bottom-right'};
assert.equal(recipes.workflowSettings('watermark',{}).watermarkOpacity,'22');
for(const invalid of [{watermarkColor:'red'},{watermarkOpacity:'0'},{watermarkSize:'200'},{angle:'181'},{watermarkPosition:'outside'}])assert.throws(()=>recipes.workflowSettings('watermark',invalid));
globalThis.fetch=async url=>{assert.equal(url,'/fonts/NotoSans-Regular.ttf');return new Response(fontBytes);};
try{
 const styledPDF=await pdf(await run([first,second],['merge','watermark'],[{},styled]));
 for(const page of styledPDF.getPages()){
  const stream=page.node.Contents().asArray().map(ref=>Buffer.from(decodePDFRawStream(styledPDF.context.lookup(ref)).decode()).toString()).join('');
  assert.equal((stream.match(/ Tj/g)??[]).length,2,'one source text and exactly one watermark per page');
  assert.match(stream,/48 Tf/,'configured text size');
  const colorRows=stream.split('\n').filter(line=>line.endsWith(' rg')).map(line=>line.split(' ').slice(0,3).map(Number));
  assert(colorRows.some(([r,g,b])=>Math.abs(r-239/255)<1e-8&&Math.abs(g-51/255)<1e-8&&Math.abs(b-68/255)<1e-8),'configured RGB color');
  const matrices=stream.split('\n').filter(line=>line.endsWith(' cm')).map(line=>line.split(' ').slice(0,6).map(Number));
  const stamp=matrices.find(([a,b])=>Math.abs(a-Math.cos(25*Math.PI/180))<1e-8&&Math.abs(b-Math.sin(25*Math.PI/180))<1e-8);
  assert(stamp,'configured 25-degree angle');assert(stamp[4]>page.getWidth()/2&&stamp[5]<page.getHeight()/2,'bottom-right placement');
  const states=page.node.Resources().lookup(PDFName.of('ExtGState'),PDFDict);assert(states.entries().some(([,ref])=>styledPDF.context.lookup(ref).lookup(PDFName.of('ca')).asNumber()===.65),'configured opacity');
 }
 const cropped=await pdf(await run([first],['crop','rotate','watermark'],[{margin:'20'},{angle:'270'},styled]));assert.equal(cropped.getPage(0).getRotation().angle,270);assert.equal(cropped.getPage(0).getCropBox().width,360);
 assert.equal(first.doc.getPage(0).getRotation().angle,0,'original rotation retained');
}finally{globalThis.fetch=originalFetch;}
console.log('PASS: custom workflow watermark size, RGB color, angle, opacity, one stamp per page, crop/rotation chain and legacy defaults.');

const edgeCrop=await pdf(await run([first],['crop'],[{cropTop:'12',cropRight:'24',cropBottom:'36',cropLeft:'48'}]));
assert.deepEqual(edgeCrop.getPage(0).getCropBox(),{x:48,y:36,width:328,height:552});
for(const [id,settings] of [['watermark',{text:'COPY',watermarkFont:'times',watermarkOpacity:'45'}],['numbers',{labelFont:'courier',labelOpacity:'65'}],['headers',{text:'HEADER',labelFont:'times',labelOpacity:'45'}],['bates',{text:'REF',labelFont:'courier',labelOpacity:'65'}]]){
 const output=await pdf(await run([first],[id],[settings])),page=output.getPage(0),resources=page.node.Resources();
 const fonts=resources.lookup(PDFName.of('Font'),PDFDict);
 assert(fonts.entries().some(([,ref])=>output.context.lookup(ref,PDFDict).get(PDFName.of('BaseFont'))?.toString().includes(settings.watermarkFont==='times'||settings.labelFont==='times'?'Times':'Courier')),id+' uses selected font');
 const gs=resources.lookup(PDFName.of('ExtGState'),PDFDict);
 assert(gs.entries().some(([,ref])=>Math.abs(output.context.lookup(ref,PDFDict).get(PDFName.of('ca'))?.asNumber()-Number(settings.watermarkOpacity??settings.labelOpacity)/100)<.001),id+' uses selected opacity');
}
console.log('PASS: independent crop edges and actual watermark/page-number/header/Bates fonts and opacity.');

for(const quality of ['compact','images','image-small']){assert.equal(recipes.workflowSettings('compress',{quality}).quality,quality);const output=await pdf(await run([first],['compress'],[{quality}]));assert.equal(output.getPageCount(),1);}
console.log('PASS: all three standalone compression levels accepted and executed in workflows.');

const previewExports={};vm.runInNewContext(ts.transpile(await readFile('lib/workflow-preview-operation.ts','utf8'),{module:ts.ModuleKind.CommonJS}),{exports:previewExports});
const {workflowPreviewOperation}=previewExports;
assert.equal(workflowPreviewOperation(),'organize');
assert.equal(workflowPreviewOperation(['rotate'],[0]),'organize');
assert.equal(workflowPreviewOperation(['rotate','resize'],[0]),'workflow');
for(const [steps,disabled] of [[[],[]],[['rotate'],[0]]]){
 const inputPages=items([first]).map(p=>({...p,rotation:90}));
 const output=await pdf(await processPDF(workflowPreviewOperation(steps,disabled),[first],inputPages,[],{...defaults,workflowSteps:steps,workflowDisabled:disabled},()=>{}));
 assert.equal(output.getPageCount(),1);assert.equal(output.getPage(0).getRotation().angle,90);
 assert.deepEqual(output.getPage(0).getCropBox(),first.doc.getPage(0).getCropBox());
}
console.log('PASS: Crop-first and disabled-prefix previews assemble one PDF without requiring a merge; workspace rotation and page bounds retained.');

for(const count of [1,20]){
 const malformed=await PDFDocument.create();for(let i=0;i<3;i++)malformed.addPage([400,600]);malformed.catalog.Pages().set(PDFName.of('Count'),PDFNumber.of(count));
 const bytes=await malformed.save(),doc=await PDFDocument.load(bytes),file={id:'stale-count',name:'stale-count.pdf',bytes,doc,size:bytes.length,pages:doc.getPageCount()},before=bytes.slice();
 for(const angle of ['0','90','180','270']){
  assert.equal(recipes.workflowSettings('rotate',{angle}).angle,angle);
  const result=await pdf(await run([file],['rotate'],[{angle}]));
  assert.equal(result.getPageCount(),3);assert.equal(result.catalog.Pages().Count().asNumber(),3);
  assert(result.getPages().every(page=>page.getRotation().angle===Number(angle)));
 }
 assert.deepEqual(bytes,before,'repair does not mutate source bytes');
}
console.log('PASS: stale PDF page counts repaired, every page retained, all four rotation states and originals preserved.');
