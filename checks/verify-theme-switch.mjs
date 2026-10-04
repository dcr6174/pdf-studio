import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import ts from 'typescript';
const {createThemeController}=await import('data:text/javascript;base64,'+Buffer.from(ts.transpileModule(await readFile('lib/theme-switch.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText).toString('base64'));

/** A page whose changes only land LATER (like a view transition), so fast clicks overlap. */
function world(start){
 const w={dom:start,button:start,saved:start,queue:[],animateCalls:[]};
 const c=createThemeController({
  read:()=>w.dom,write:t=>{w.dom=t;},commit:t=>{w.button=t;},persist:t=>{w.saved=t;},
  animate:(run,from,changes)=>{w.animateCalls.push(changes);if(changes)w.queue.push(run);else run();},
 });
 return {w,c};
}
const settle=(w,order='in-order')=>{const q=[...w.queue];w.queue.length=0;(order==='reverse'?q.reverse():q).forEach(run=>run());};

for(const start of ['light','dark']){
 const other=start==='light'?'dark':'light';
 for(const order of ['in-order','reverse']){
  for(const [presses,expected] of [[1,other],[2,start],[3,other],[4,start],[7,other],[10,start]]){
   const {w,c}=world(start);
   for(let i=0;i<presses;i++)c.toggle();            // every press lands before any transition has finished
   assert.equal(w.saved,expected,`${presses} presses from ${start}: saved choice`);
   settle(w,order);
   assert.equal(w.dom,expected,`${presses} presses from ${start} (${order}): page`);
   assert.equal(w.button,expected,`${presses} presses from ${start} (${order}): button icon and label`);
   assert.equal(c.target,expected);
  }
 }
}
// presses spread out in time still behave
{const {w,c}=world('light');c.toggle();settle(w);c.toggle();settle(w);c.toggle();settle(w);assert.equal(w.dom,'dark');assert.equal(w.button,'dark');assert.equal(w.saved,'dark');}
// pressing back to the visible theme asks for no animation (nothing visible would change)
{const {w,c}=world('light');c.toggle();c.toggle();assert.deepEqual(w.animateCalls,[true,false]);}
// device change (only used before a choice) and first load
{const {w,c}=world('light');c.follow('dark');settle(w);assert.equal(w.dom,'dark');assert.equal(w.saved,'light','following the device does not save a choice');}
{const {w,c}=world('light');c.sync('dark');assert.equal(w.dom,'dark');assert.equal(w.button,'dark');assert.equal(w.animateCalls.length,0,'first load never animates');}
// the component uses the controller, not stale React state
const src=await readFile('components/theme-toggle.tsx','utf8');
assert.ok(src.includes('createThemeController')&&src.includes('ctrl.current?.toggle'),'button goes through the controller');
assert.ok(!/const next:Theme=theme===/.test(src),'no next-theme guess from React state');
console.log('PASS: fast presses (same moment, any finishing order) never cancel each other: 1 to 10 presses from light and dark end on the right theme, with matching saved choice, icon and label; no animation when nothing visible changes.');
