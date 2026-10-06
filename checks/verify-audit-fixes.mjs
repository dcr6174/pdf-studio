import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
import {build} from 'vite';
import {PDFDocument,rgb} from 'pdf-lib';
import JSZip from 'jszip';
import fontkit from '@pdf-lib/fontkit';
import {createCanvas,DOMMatrix,Path2D,ImageData} from '@napi-rs/canvas';
import {execFileSync} from 'node:child_process';
async function pure(path){return import('data:text/javascript;base64,'+Buffer.from(ts.transpileModule(fs.readFileSync(path,'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText).toString('base64'));}
const {uploadFeedback}=await pure('lib/upload-feedback.ts');
for(const message of ['These files total 180 MB. This workspace accepts up to 157.3 MB.','This would create 401 pages.','Choose an image below 22 megapixels.','You selected 21 files. Batch processing accepts up to 20 files.','This document has 101 pages.'])assert.equal(uploadFeedback(new Error(message)).message,message);
const invalid=uploadFeedback(new Error("Cannot read properties of undefined (reading 'size')"));assert.equal(invalid.message,'This file could not be read. Choose another file, or try opening and saving it in your PDF viewer first.');assert(invalid.technical.includes('undefined'));assert(uploadFeedback(new Error('Failed to fetch dynamically imported module')).reload);assert.match(uploadFeedback(new Error('encrypted PDF')).message,/password-protected/);
const {sensitiveTextCandidates}=await pure('lib/sensitive-text.ts');
for(const phone of ['9876543210','+91 9876543210','+91-98765-43210','98765 43210','987-654-3210'])assert(sensitiveTextCandidates('Phone: '+phone+' end').includes(phone),phone);
assert.equal(sensitiveTextCandidates('12345678901234').length,0);assert.equal(sensitiveTextCandidates('9876543210123').length,0);
const {orderMergePages}=await pure('lib/merge-order.ts');const pages=[{id:'a2',fileId:'a',index:1,rotation:90},{id:'b1',fileId:'b',index:0,rotation:0},{id:'a1',fileId:'a',index:0,rotation:0}];const ordered=orderMergePages(pages,['b','a']);assert.deepEqual(ordered.map(p=>p.id),['b1','a2','a1']);assert.equal(ordered[1].rotation,90);assert.equal(pages[0].id,'a2');
const {readWorkflowRecipe}=await pure('lib/workflow-recipes.ts');const recipe=readWorkflowRecipe({name:'Safe recipe',steps:['clean','compress'],disabled:[1],password:'SECRET',bytes:[1,2]});assert.deepEqual(Object.keys(recipe),['name','steps','disabled']);assert.throws(()=>readWorkflowRecipe({name:'bad',steps:['execute-code']}));assert.throws(()=>readWorkflowRecipe({name:'bad',steps:['compress'],disabled:[4]}));
await build({configFile:false,logLevel:'error',build:{ssr:'lib/pdf-engine.ts',outDir:'.audit-check',emptyOutDir:true,rollupOptions:{output:{entryFileNames:'engine.mjs'}}}});
const engine=await import('../.audit-check/engine.mjs');
const doc=await PDFDocument.create();doc.registerFontkit(fontkit);const font=await doc.embedFont(fs.readFileSync('public/fonts/NotoSans-Regular.ttf'),{subset:true});for(let i=0;i<3;i++){const page=doc.addPage([612,792]);page.drawText('SOURCE PAGE '+(i+1),{font,x:50,y:650,size:24});page.drawRectangle({x:40,y:300,width:200,height:100,color:rgb(.2,.3,.7)});}
const bytes=await doc.save(),file={id:'source',name:'letter.pdf',bytes,size:bytes.length,pages:3,doc},items=doc.getPages().map((_,index)=>({id:'p'+index,fileId:file.id,index,rotation:0}));const options={range:'1,3',text:'',title:'',author:'',subject:'',password:'',quality:'compact',angle:'90',margin:'20',start:'1',columns:'2',fields:{}};
const run=(id,o={},ps=items,marks=[])=>engine.processPDF(id,[file],ps,marks,{...options,...o},()=>{});
const compact=await run('compress',{},[items[2],items[0]]);assert(compact.inputSize>0);assert(compact.blob.size<=compact.inputSize);assert.equal((await PDFDocument.load(await compact.blob.arrayBuffer())).getPageCount(),2);
const split=await run('split',{splitOutput:'separate'});const zip=await JSZip.loadAsync(split.blob.arrayBuffer());assert.deepEqual(Object.keys(zip.files),['page-1.pdf','page-3.pdf']);for(const name of Object.keys(zip.files))assert.equal((await PDFDocument.load(await zip.file(name).async('uint8array'))).getPageCount(),1);
const flow=await run('workflow',{recipe:'custom',workflowSteps:['reverse','rotate','compress'],workflowDisabled:[1]});const flowDoc=await PDFDocument.load(await flow.blob.arrayBuffer());assert.equal(flowDoc.getPageCount(),3);assert.equal(flowDoc.getPage(0).getRotation().angle,0);assert.match(flow.report,/reverse → compress/);
const resized=await run('resize',{resizeSize:'letter',resizeOrientation:'landscape'});const result=await PDFDocument.load(await resized.blob.arrayBuffer());assert.equal(result.getPage(0).getWidth(),792);assert.equal(result.getPage(0).getHeight(),612);
// Real PDF.js rendering with a native test canvas; independent Poppler text inspection afterwards.
Object.assign(globalThis,{DOMMatrix,Path2D,ImageData});globalThis.document={createElement:()=>createCanvas(1,1)};
const pdfjs=await engine.pdfjs();pdfjs.GlobalWorkerOptions.workerSrc=new URL('../public/pdf.worker.min.mjs',import.meta.url).href;
const oldFetch=globalThis.fetch;globalThis.fetch=async url=>String(url).startsWith('/fonts/')?new Response(fs.readFileSync('public'+url)):oldFetch(url);
try{
 const redacted=await run('redact',{},items,[{id:'redaction',pageId:'p0',kind:'redact',text:'',x:0,y:0,w:1,h:.3,color:'#000000',fontSize:12}]);const reopened=await PDFDocument.load(await redacted.blob.arrayBuffer());for(const p of reopened.getPages()){assert.equal(p.getWidth(),612);assert.equal(p.getHeight(),792);}
 fs.writeFileSync('.audit-check/redacted.pdf',new Uint8Array(await redacted.blob.arrayBuffer()));const extracted=execFileSync('pdftotext',['.audit-check/redacted.pdf','-'],{encoding:'utf8'});assert(!extracted.includes('SOURCE PAGE'));
 const raster=await run('compress',{quality:'small'});assert.equal(raster.inputSize,bytes.length);assert(raster.blob.size<=raster.inputSize);
 console.log('PASS: rejected size/page/image/batch limits stay specific; parser and stale-module recovery; five Indian phone formats; stable file reordering; compression baseline; separate selected-page ZIP; Letter landscape; real raster redaction retains Letter geometry and removes extractable text; raster fallback never exceeds its baseline.');
}finally{globalThis.fetch=oldFetch;}
