import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';
const source=await readFile('app/page.tsx','utf8');
const handler=source.match(/const back=\(\)=>\{([\s\S]*?)\};window\.addEventListener\('popstate',back\)/);
assert.ok(handler,'test the actual popstate handler');
const body=ts.transpile(handler[1],{target:ts.ScriptTarget.ES2022});
function run({hash='',pathname='/',view='compress',initialTool='compress',busy=false,loading=false,textDirty=false,marks=[]}={}){
 const calls=[],messages=[],pushes=[];
 vm.runInNewContext(`(()=>{${body}})()`,{location:{hash,pathname},view,initialTool,busy,loading,textDirty,marks,seoTools:[{id:'compress',slug:'compress-pdf'},{id:'merge',slug:'merge-pdf'},{id:'native-text',slug:'edit-pdf-text'}],seoPages:[{id:'compress',slug:'compress-pdf'},{id:'merge',slug:'merge-pdf'},{id:'native-text',slug:'edit-pdf-text'},{id:'edit',slug:'pdf-editor'}],tools:[{id:'compress'},{id:'merge'},{id:'native-text'}],navigate:(...args)=>calls.push(args),toast:s=>messages.push(s),window:{history:{pushState:(...args)=>pushes.push(args)}}});
 return {calls,messages,pushes};
}
for(const hash of ['#studio-content','#tool-guide-title','#unknown'])assert.deepEqual(run({hash}).calls,[],'anchor changes keep current tool');
assert.deepEqual(run({pathname:'/tools/compress-pdf',view:'merge'}).calls,[['compress',false]],'empty hash restores landing tool');
assert.deepEqual(run({pathname:'/',view:'merge'}).calls,[['home',false]]);
assert.deepEqual(run({hash:'#merge'}).calls,[['merge',false]]);
assert.deepEqual(run({hash:'#shelf'}).calls,[['shelf',false]]);
assert.deepEqual(run({hash:'#compress'}).calls,[],'same tool keeps current state');
for(const state of [{busy:true},{loading:true},{view:'native-text',textDirty:true}]){const result=run({hash:'#merge',...state});assert.equal(result.calls.length,0);assert.equal(result.messages.length,1);assert.equal(result.pushes.length,1);}
console.log('PASS: actual history handler preserves anchors, restores landing tool, handles home/tool/shelf and blocks busy or unsaved-text navigation. Browser focus/scroll remains unverified.');

const effectStart=source.indexOf('useEffect(()=>{',source.indexOf('const landingTool='));
const effectEnd=source.indexOf('    useEffect(()=>{const back=',effectStart);
const routeEffect=source.slice(effectStart,effectEnd).match(/useEffect\(\(\)=>\{([\s\S]*?)\n    \},/);
assert.ok(routeEffect,'route changes synchronize the retained workspace');
function effect(state){const callbacks=[];const context={...state,queueMicrotask:fn=>callbacks.push(fn),navigate:(id,record)=>{state.calls.push([id,record]);state.view=id;},syncLocation:id=>state.locations.push(id),toast:()=>{}};const cleanup=vm.runInNewContext('(()=>{'+routeEffect[1]+'})()',context);callbacks.forEach(fn=>fn());return cleanup;}
for(const initialTool of ['form','word','merge','home']){const state={initialTool,landingTool:{current:'word'},view:'word',busy:false,loading:false,textDirty:false,marks:[],calls:[],locations:[]};effect(state);effect(state);assert.equal(state.view,initialTool);assert.equal(state.landingTool.current,initialTool);}
for(const key of ['busy','loading']){const state={initialTool:'form',landingTool:{current:'word'},view:'word',busy:false,loading:false,textDirty:false,marks:[],calls:[],locations:[],[key]:true};effect(state);assert.deepEqual(state.calls,[]);assert.equal(state.landingTool.current,'word','pending route is retained');state[key]=false;effect(state);effect(state);assert.equal(state.view,'form');assert.equal(state.landingTool.current,'form');}
console.log('PASS: Forms route waits for busy/loading state, then replaces stale Word content; landing route is acknowledged only after synchronization.');

assert.equal(run({hash:'#merge',marks:[{kind:'redact'}]}).calls.length,0,'pending redactions block history navigation');
assert.deepEqual(run({pathname:'/tools/merge-pdf',view:'compress'}).calls,[['merge',false]],'history resolves the actual tool path');
assert.ok(source.includes('queueMicrotask(()=>bootstrapNavigate(id))')&&source.includes('useEffectEvent((id:string)=>navigate(id,false))'),'hash startup never pushes history');
assert.ok(source.includes("window.addEventListener('hashchange',back)"),'direct hash changes share the navigation handler');

assert.deepEqual(run({pathname:'/tools/pdf-editor',view:'compress'}).calls,[['edit',false]],'search aliases resolve during browser history');
