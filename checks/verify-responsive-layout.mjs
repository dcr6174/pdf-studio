import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {build} from 'vite';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import postcss from 'postcss';

// Catch the gap where JS uses mobile actions but CSS reserves a desktop sidebar.
function activeAt(node,width){
 for(let p=node.parent;p;p=p.parent){
  if(p.type!=='atrule'||p.name!=='media')continue;
  const min=/min-width:\s*(\d+)px/.exec(p.params),max=/max-width:\s*(\d+)px/.exec(p.params);
  if(min&&width<Number(min[1])||max&&width>Number(max[1]))return false;
 }
 return true;
}
const actionCSS=postcss.parse(await readFile('components/tool-action-layout.css','utf8'));
const app=await readFile('app/page.tsx','utf8');
const breakpoint=Number(/matchMedia\('\(max-width:(\d+)px\)'\)/.exec(app)[1]);
for(const width of [320,360,390,430,768,820,1024,1099,1100,1366]){
 let fixedSidebar=false,reservedSidebar=false;
 actionCSS.walkRules(rule=>{
  if(!activeAt(rule,width))return;
  rule.walkDecls(d=>{
   if(rule.selector.includes('.shared-tool-action-bar')&&d.prop==='position'&&d.value==='fixed')fixedSidebar=true;
   if(rule.selector.includes('.tool-action-ready')&&rule.selector.includes('.content')&&d.prop==='padding-right'&&parseFloat(d.value)>=300)reservedSidebar=true;
  });
 });
 assert.equal(fixedSidebar,width>breakpoint,`${width}px sidebar agrees with mobile control breakpoint`);
 assert.equal(reservedSidebar,width>breakpoint,`${width}px content does not keep an invisible sidebar gutter`);
}
const layoutCSS=postcss.parse(await readFile('app/responsive-layout.css','utf8'));
for(const width of [320,390,768,1024]){
 const variables={};layoutCSS.walkRules(rule=>{if(rule.selector!==':root'||!activeAt(rule,width))return;rule.walkDecls(d=>variables[d.prop]=d.value);});
 assert.match(variables['--studio-header-height'],/64px/,'compact header supplies offsets for rails and dialogs');
 assert.ok(width-Number.parseFloat(variables['--studio-rail-space'])-12>=232,'preview retains usable width on narrow phones');
}
await build({configFile:false,logLevel:'error',resolve:{alias:{'@':resolve('.')}},build:{ssr:true,outDir:'.responsive-check',emptyOutDir:true,rollupOptions:{input:{controls:'components/mobile-workspace-controls.tsx',action:'components/tool-action-bar.tsx',app:'app/page.tsx'},output:{entryFileNames:'[name].mjs'}}}});
const {MobileWorkspaceControls}=await import('../.responsive-check/controls.mjs');
const noop=()=>{};
const common={files:[{id:'a',name:'a.pdf',pages:1},{id:'b',name:'b.pdf',pages:1}],pageCount:2,addLabel:'Add files',onAdd:noop,onClear:noop,settings:createElement('p',null,'Options'),settingsAvailable:true,disabled:false,action:createElement('button',null,'Process PDF')};
function render(props){return renderToStaticMarkup(createElement(MobileWorkspaceControls,{...common,...props}));}
for(const props of [{},{onSort:noop},{onSort:noop,files:common.files.slice(0,1)},{settingsAvailable:false,addAvailable:false},{action:null}]){
 const html=render(props),sortable=!!props.onSort&&(props.files??common.files).length>1;
 assert.equal((html.match(/aria-label="Sort files /g)||[]).length,sortable?1:0);
 assert.equal((html.match(/class="mobile-workspace-action"/g)||[]).length,props.action===null?0:1,'one export action only when this tool needs it');
 assert.ok(!html.includes('aria-label="Files ('),'no redundant Files shortcut');
 assert.equal((html.match(/class="mobile-workspace-controls"/g)||[]).length,props.addAvailable===false&&props.settingsAvailable===false?0:1);
}
const {default:App}=await import('../.responsive-check/app.mjs');
for(const tool of ['create','markdown','create-form']){
 const html=renderToStaticMarkup(createElement(App,{initialTool:tool}));
 assert.match(html,/<textarea/,'new-document tool exposes its main input before opening Settings');
 assert.ok(html.indexOf('<textarea')>html.indexOf('class="task-canvas"'),'writing input belongs to the main canvas');
}
console.log('PASS: 10 viewport breakpoint checks, narrow-phone width budget, optional sorting and single action controls, and main-page writing inputs for all 3 creation tools. CSS/SSR checks; physical browser geometry and touch are not simulated.');
