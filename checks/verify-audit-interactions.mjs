import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {build} from 'vite';
await build({configFile:false,logLevel:'error',build:{ssr:'lib/task-action-label.ts',outDir:'.audit-check',emptyOutDir:true,rollupOptions:{output:{entryFileNames:'actions.mjs'}}}});
const {taskActionLabel}=await import('../.audit-check/actions.mjs');
assert.equal(taskActionLabel('merge',2),'Merge 2 files');
assert.equal(taskActionLabel('word',1),'Convert to Word');
assert.equal(taskActionLabel('workflow',3),'Run workflow');
assert.equal(taskActionLabel('compress',2,true),'Process files · download ZIP');
const ts=await import('typescript');
async function module(path){const source=ts.transpileModule(await readFile(path,'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext}}).outputText;return import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));}
const {regionBox}=await module('lib/region-box.ts');
for(const [a,b] of [[[.2,.3],[.8,.9]],[[.8,.9],[.2,.3]],[[.2,.9],[.8,.3]],[[.8,.3],[.2,.9]]]){const r=regionBox(...a,...b);assert.equal(r.x,.2);assert.equal(r.y,.3);assert(Math.abs(r.w-.6)<1e-10);assert(Math.abs(r.h-.6)<1e-10);}
assert.deepEqual(regionBox(-.5,2,2,-.3),{x:0,y:0,w:1,h:1});
const {describeChange}=await module('lib/result-summary.ts');
assert.equal(describeChange(423000,421000,true).headline,'About the same size');
assert.equal(describeChange(1000,1200,true).headline,'20% larger');
assert.equal(describeChange(1000,800,true).headline,'20% smaller');
const workflow=await module('lib/workflow-recipes.ts');
const recipe=workflow.readWorkflowRecipe({name:'My workflow',steps:['rotate','compress'],disabled:[],settings:[{angle:'180'},{quality:'compact'}]});
assert.equal(recipe.settings[0].angle,'180');assert.throws(()=>workflow.readWorkflowRecipe({name:'bad',steps:['unknown']}));
console.log('PASS: result-producing labels, batch ZIP label, redaction rectangles in all four directions and page bounds, compression near-equality and savings, and validated workflow settings.');
