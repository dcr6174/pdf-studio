import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';
const source=await readFile('app/page.tsx','utf8');
const validation=ts.transpile(await readFile('lib/input-validation.ts','utf8'),{module:ts.ModuleKind.CommonJS});
const exports={};vm.runInNewContext(validation,{exports,Error});
const {validateSelection,validatePages,validateBatch,validateTextInput,MAX_BYTES,SOFT_BYTES,MAX_PAGES}=exports;
const feedbackExports={};vm.runInNewContext(ts.transpile(await readFile('lib/upload-feedback.ts','utf8'),{module:ts.ModuleKind.CommonJS}),{exports:feedbackExports,Error});
const {uploadFeedback}=feedbackExports;
validateSelection([{name:'a.pdf',size:MAX_BYTES}],'.pdf',true);
assert.match(validateSelection([{name:'a.pdf',size:SOFT_BYTES+1}],'.pdf',true),/Large files/);
validatePages(MAX_PAGES);assert.throws(()=>validatePages(MAX_PAGES+1),/5001 pages/);
validateBatch(20);assert.throws(()=>validateBatch(21),/21 files/);
validateTextInput(SOFT_BYTES+1,MAX_PAGES);assert.throws(()=>validateTextInput(1,MAX_PAGES+1),/5001 pages/);
const ingest=ts.transpile(source.slice(source.indexOf('    async function ingest('),source.indexOf('    async function run(')),{target:ts.ScriptTarget.ES2022});
async function check({list,existing=[],pages=[],batchMode=false,target='compress',fieldFailure=false}){
 const output={name:'previous-result.pdf'},state={output,error:'',commits:0,loads:0};
 const context={error:'',useEffect:()=>{},paintProgress:async()=>{},setOcrDraft:()=>{},Error,uploadFeedback,setUploadIssue:()=>{},setSizeWarning:()=>{},openingDeadline:work=>work,validateSelection,validatePages,validateBatch,validateTextInput,view:target,batchMode,pages,marks:[],busy:false,textDirty:false,queue:{current:false},pendingFiles:{},workspace:{getFiles:()=>existing,replace:()=>state.commits++},accepted:()=>'.pdf',isMulti:id=>['merge','organize','compare'].includes(id),setReplaceOpen:()=>{},setLoading:()=>{},setError:value=>state.error=value,setOutput:value=>state.output=value,loadFile:async f=>{state.loads++;return {...f,id:'fixture',bytes:new Uint8Array(),pages:f.pages??1};},fields:async()=>{if(fieldFailure)throw new Error('Form parser failed');return [];},setFormFields:()=>{},setOptions:()=>{},setActivePage:()=>{},opt:()=>{},navigate:()=>{},toast:{error:()=>{}},crypto:{randomUUID:()=> 'page-id'},File:class{},TextDecoder};
 vm.createContext(context);vm.runInContext(ingest+'\nglobalThis.ingest=ingest;',context);await context.ingest(list,target,true);return state;
}
const pdf=(size=1,pages=1)=>({name:'test.pdf',size,pages});
let r=await check({list:[pdf(SOFT_BYTES+1)]});assert.equal(r.loads,1);assert.equal(r.commits,1,'large files remain allowed');
r=await check({list:Array.from({length:21},()=>pdf()),batchMode:true});assert.equal(r.loads,0);assert.equal(r.commits,0);assert.match(r.error,/21 files/);
r=await check({target:'merge',list:[pdf(1,MAX_PAGES+1),pdf()]});assert.equal(r.loads,1,'stop parsing as soon as page cap is exceeded');assert.equal(r.commits,0);
r=await check({target:'merge',existing:[pdf(1,MAX_PAGES)],pages:[{id:'remaining'}],list:[pdf(1,MAX_PAGES-1)]});assert.equal(r.commits,1,'deleted pages do not count against new page capacity');
r=await check({target:'form',list:[pdf()],fieldFailure:true});assert.equal(r.commits,0,'failed form extraction cannot replace the previous workspace');assert.equal(r.output.name,'previous-result.pdf');
r=await check({target:'native-text',list:[pdf(SOFT_BYTES+1)]});assert.equal(r.loads,1);assert.equal(r.commits,1);
r=await check({target:'native-text',list:[pdf(1,MAX_PAGES+1)]});assert.equal(r.commits,0);assert.match(r.error,/5001 pages/);
assert.ok(source.includes("if(batchMode&&view!=='rotate'){try{validateBatch(files.length);}"),'batch limit checked again before processing');
console.log('PASS: actual upload handler preserves output on rejection, warns on large files without blocking, rejects batch limits before parsing, stops at page overflow, stages form fields and validates existing-text inputs. PDF parsing mocked; engine output covered separately.');

