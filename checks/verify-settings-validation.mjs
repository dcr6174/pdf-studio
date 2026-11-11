import assert from 'node:assert/strict';
import {build} from 'vite';
import {resolve} from 'node:path';
await build({configFile:false,logLevel:'error',resolve:{alias:{'@':resolve('.')}},build:{ssr:true,outDir:'.settings-check',emptyOutDir:true,rollupOptions:{input:{validation:'lib/new-tools/validation.ts',catalog:'lib/new-tools/index.ts'},output:{entryFileNames:'[name].mjs'}}}});
const {validateToolFields:check}=await import('../.settings-check/validation.mjs');
const {newTools}=await import('../.settings-check/catalog.mjs');
for(const tool of Object.values(newTools)){const values=Object.fromEntries(tool.fields.map(f=>[f.key,f.def]));assert.deepEqual(check(tool.fields,values),{},tool.id+' defaults must remain valid');}
const f=[{key:'n',label:'Count',type:'number',def:1,min:1,max:20},{key:'width',type:'number',min:.25,max:20,step:.25,when:v=>v.show}];
assert.deepEqual(check(f,{n:1,show:false}),{});
assert.equal(check(f,{n:''}).n,'Enter a number.');assert.equal(check(f,{n:Infinity}).n,'Enter a number.');
assert.equal(check(f,{n:0}).n,'Use 1 or more.');assert.equal(check(f,{n:21}).n,'Use 20 or less.');
assert.equal(check(f,{n:1.5}).n,'Use a whole number.');assert.deepEqual(check(f,{n:2,show:true,width:1.5}),{});
assert(check(f,{n:2,show:true,width:1.6}).width);assert.deepEqual(check(f,{n:2,show:false,width:''}),{},'hidden fields do not block execution');
console.log('PASS: all standalone tool defaults, numeric empty/finite/bounds/whole/step checks and hidden field rules.');
