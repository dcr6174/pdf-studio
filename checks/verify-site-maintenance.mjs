import assert from 'node:assert/strict';
import {readFile,readdir,access} from 'node:fs/promises';
import {resolve} from 'node:path';
import {build} from 'vite';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import postcss from 'postcss';

await build({configFile:false,logLevel:'error',resolve:{alias:{'@':resolve('.'),'next/image':resolve('node_modules/vinext/dist/shims/image.js')}},build:{ssr:true,outDir:'.maintenance-check',emptyOutDir:true,rollupOptions:{input:{tools:'app/tools/[slug]/page.tsx',guides:'app/guides/[slug]/page.tsx',files:'components/merge-files.tsx',bar:'components/tool-action-bar.tsx',result:'lib/result-summary.ts'},output:{entryFileNames:'[name].mjs'}}}});
const tools=await import('../.maintenance-check/tools.mjs');
const guides=await import('../.maintenance-check/guides.mjs');
for(const [page,prefix] of [[tools,'tools'],[guides,'guides']]){
 await assert.rejects(()=>page.default({params:Promise.resolve({slug:'resize-to-a4'})}),error=>error.digest?.includes('/'+prefix+'/resize-pages;'),'historical Resize links reach the current task');
 const metadata=await page.generateMetadata({params:Promise.resolve({slug:'resize-pages'})});
 assert.equal(metadata.alternates.canonical,'/'+prefix+'/resize-pages');
}
const registered=tools.generateStaticParams().map(p=>p.slug);
assert.equal(new Set(registered).size,registered.length);
let rendered=0;
for(const slug of registered){
 for(const [page,prefix] of [[tools,'tools'],[guides,'guides']]){
  const params={params:Promise.resolve({slug})};
  const metadata=await page.generateMetadata(params);
  assert.equal(metadata.alternates.canonical,'/'+prefix+'/'+slug);
  try{const html=renderToStaticMarkup(await page.default(params));assert.ok(html.includes('<h1'),'task heading in '+prefix+'/'+slug);rendered++;}
  catch(error){if(!error.digest?.includes('/guides/'+slug+';'))throw new Error(prefix+'/'+slug+': '+error.message,{cause:error});}
 }
}
console.log(`PASS: ${registered.length} registered tool routes, their guide metadata and ${rendered} server-rendered pages (manual-export redirects checked separately).`);
const {MergeFiles}=await import('../.maintenance-check/files.mjs');
const noop=()=>{};
const files=['A','B'].map(id=>({id,name:id+'.pdf',bytes:new Uint8Array(),size:100,pages:1}));
for(const count of [1,2]){
 const html=renderToStaticMarkup(createElement(MergeFiles,{files:files.slice(0,count),disabled:false,onAdd:noop,onSort:noop,onMove:noop,onRemove:noop,hidePageActions:true}));
 assert.ok(html.includes('aria-label="Add files"'));
 assert.equal(html.includes('aria-label="Sort files A to Z"'),count>1);
 assert.equal(html.includes('Drag a file to reorder'),count>1);
}
const {ToolActionBar}=await import('../.maintenance-check/bar.mjs');
const bar=renderToStaticMarkup(createElement(ToolActionBar,{title:'Compress PDF',toolId:'compress',summary:'1 file',settings:null,onClear:noop,disabled:false,action:createElement('button',null,'Compress PDF')}));
assert.equal((bar.match(/aria-label="Clear workspace"/g)||[]).length,1);
assert.ok(!bar.includes('<div class="row"></div>'));
const css=postcss.parse(await readFile('components/rotate-workspace.css','utf8'));
for(const width of [320,390,767,768,1099,1100,1366]){
 let hidden=false;css.walkRules(rule=>{if(!rule.selector.includes('.rotate-clear-workspace'))return;for(let p=rule.parent;p;p=p.parent){if(p.type==='atrule'&&p.name==='media'){const min=/min-width:\s*(\d+)px/.exec(p.params);if(min&&width<Number(min[1]))return;}}rule.walkDecls('display',d=>{if(d.value==='none')hidden=true;});});
 assert.equal(hidden,width>=1100,'Clear remains available below the desktop-sidebar breakpoint');
}
const {describeChange}=await import('../.maintenance-check/result.mjs');
assert.equal(describeChange(1000000,1,true).headline,'99.9% smaller');
assert.equal(describeChange(1000,1000,true).headline,'About the same size');
assert.equal(describeChange(1000,1200,true).headline,'20% larger');

// Guard the removed scaffold assets against new runtime references. This does
// not replace the manual history, dynamic-reference and deployment review.
const removed=['file.svg','globe.svg','window.svg'];
for(const name of removed)await assert.rejects(()=>access('public/'+name));
async function inspect(directory){for(const entry of await readdir(directory,{withFileTypes:true})){const path=directory+'/'+entry.name;if(entry.isDirectory())await inspect(path);else if(/\.(?:tsx?|m?js|css|json|html|md|sh)$/.test(path)){const source=await readFile(path,'utf8');for(const name of removed)assert.ok(!source.includes('/'+name)&&!source.includes("'"+name+"'")&&!source.includes('"'+name+'"'),'removed asset is not referenced by '+path);}}}
for(const directory of ['app','components','lib','build','scripts'])await inspect(directory);
console.log('PASS: real Resize tool/guide redirects and canonical targets; one/two-file controls; action-bar controls; phone/tablet Clear availability; truthful size labels; no runtime references to removed scaffold assets. CSS/SSR checks, not touch/browser emulation.');
