import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';
const src=await readFile('lib/startup-guard.ts','utf8');
const {startupGuardScript,STARTUP_GUARD_MS}=await import('data:text/javascript;base64,'+Buffer.from(ts.transpileModule(src,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText).toString('base64'));
assert.ok(STARTUP_GUARD_MS>=5000&&STARTUP_GUARD_MS<=10000,'waits long enough for slow phones but not forever');
function run(ready){
 const added=[];let timer=null;
 const doc={readyState:'complete',documentElement:{dataset:ready?{ready:'1'}:{}},body:{appendChild:n=>added.push(n)},getElementById:()=>null,
  createElement:()=>({style:{},setAttribute(){},querySelector:()=>({}),set innerHTML(v){this.html=v}})};
 vm.runInNewContext(startupGuardScript,{document:doc,window:{addEventListener(){}},setTimeout:(fn,ms)=>{timer={fn,ms};},location:{reload(){}}});
 assert.equal(timer.ms,STARTUP_GUARD_MS);timer.fn();return added;
}
assert.equal(run(true).length,0,'no message when the app started');
const shown=run(false);assert.equal(shown.length,1,'message appears when the app never started');
assert.ok(/Refresh/.test(shown[0].html)&&/did not finish loading/.test(shown[0].html));
const layout=await readFile('app/layout.tsx','utf8'),ready=await readFile('components/startup-ready.tsx','utf8');
assert.ok(layout.includes('startupGuardScript')&&layout.includes('<StartupReady/>')&&layout.includes('<noscript>'));
assert.ok(ready.includes("dataset.ready='1'"));
console.log('PASS: startup guard shows a Refresh message only when the app never marks itself ready; layout wires the guard, the ready marker and a no-JavaScript notice.');

let listener;vm.runInNewContext(startupGuardScript,{document:{readyState:'loading',addEventListener:(event,fn)=>{assert.equal(event,'DOMContentLoaded');listener=fn;}},setTimeout(){}});assert.equal(typeof listener,'function');
