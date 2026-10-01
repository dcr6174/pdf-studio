import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';
const source=await readFile('lib/theme-policy.ts','utf8');
const code=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext}}).outputText;
const {themeBootstrapScript}=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
for(const [stored,system,expected] of [['dark',false,'dark'],['light',true,'light'],['system',true,'dark'],[null,false,'light'],['unexpected',true,'dark']]){
 const document={documentElement:{dataset:{}}};vm.runInNewContext(themeBootstrapScript,{document,localStorage:{getItem:()=>stored},matchMedia:()=>({matches:system})});assert.equal(document.documentElement.dataset.theme,expected);
}
const document={documentElement:{dataset:{}}};vm.runInNewContext(themeBootstrapScript,{document,localStorage:{getItem(){throw Error('Blocked storage');}},matchMedia:()=>({matches:true})});assert.equal(document.documentElement.dataset.theme,'dark');
console.log('PASS: before-paint theme initialization honors saved settings, device fallback, invalid values and blocked storage. Real browser paint and button interactions remain unverified.');
