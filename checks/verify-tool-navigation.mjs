import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
const source=await readFile('app/page.tsx','utf8');
const handler=source.match(/const back=\(\)=>\{([\s\S]*?)\};window\.addEventListener\('popstate',back\)/);
assert.ok(handler,'test the actual popstate handler');
const body=handler[1].replace('let next:string','let next');
function run({hash='',pathname='/',view='compress',initialTool='compress',busy=false,loading=false,textDirty=false}={}){
 const calls=[],messages=[],pushes=[];
 vm.runInNewContext(`(()=>{${body}})()`,{location:{hash,pathname},view,initialTool,busy,loading,textDirty,tools:[{id:'compress'},{id:'merge'},{id:'native-text'}],navigate:(...args)=>calls.push(args),toast:s=>messages.push(s),window:{history:{pushState:(...args)=>pushes.push(args)}}});
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
