import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import ts from 'typescript';
import postcss from 'postcss';
const source=await readFile('lib/responsive-viewport.ts','utf8');
const code=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText;
const {responsiveViewport}=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
for(const [width,height] of [[320,568],[390,844],[844,390],[768,1024],[1024,768],[1099,900],[1100,900],[1366,768],[1920,1080]]){
 assert.deepEqual(responsiveViewport({width,height,editing:false}),{width,height,top:0,keyboard:false});
 const reduced=responsiveViewport({width,height,visibleHeight:height-60,editing:false});assert.equal(reduced.keyboard,false,'browser bars do not imply keyboard');
}
assert.deepEqual(responsiveViewport({width:390,height:844,visibleHeight:390,offsetTop:20,editing:true}),{width:390,height:390,top:20,keyboard:true});
assert.equal(responsiveViewport({width:390,height:844,visibleHeight:390,editing:false}).keyboard,false,'resizing while not editing is not keyboard input');
assert.deepEqual(responsiveViewport({width:390,height:844,visibleWidth:195,visibleHeight:422,scale:2,offsetTop:80,editing:true}),{width:390,height:844,top:0,keyboard:false},'pinch zoom must not reflow editor or hide controls');
assert.deepEqual(responsiveViewport({width:NaN,height:0,visibleWidth:Infinity,visibleHeight:-1,offsetTop:-5,editing:false}),{width:320,height:640,top:0,keyboard:false});
const css=postcss.parse(await readFile('app/device-layout.css','utf8'));
function active(rule,width,height=844){for(let p=rule.parent;p;p=p.parent){if(p.type!=='atrule'||p.name!=='media')continue;const max=/max-width:\s*(\d+)px/.exec(p.params),min=/min-width:\s*(\d+)px/.exec(p.params),maxH=/max-height:\s*(\d+)px/.exec(p.params);if(max&&width>+max[1]||min&&width<+min[1]||maxH&&height>+maxH[1])return false;}return true;}
for(const width of [320,390,768,820,1024,1099,1100,1366,1920]){
 const toolbar=[];css.walkRules(r=>{if(r.selector==='html body .studio-shell.document-shell .mobile-workspace-controls'&&active(r,width))r.walkDecls(d=>toolbar.push([d.prop,d.value]));});
 assert.equal(toolbar.some(([p,v])=>p==='flex-direction'&&v==='row'),width<1100,'compact controls agree with workspace breakpoint at '+width);
 assert.equal(toolbar.some(([p,v])=>p==='top'&&v==='var(--studio-header-height)'),width<1100,'toolbar attaches below header');
}
const header=await readFile('components/use-mobile-tool-header.ts','utf8');assert(header.includes("matchMedia('(max-width:1099px)')"));
const app=await readFile('app/page.tsx','utf8');assert(app.includes("const mobileAction=view==='reader'?null:sidebarAction"),'Rotate retains the reachable shared export action');
assert(app.includes("addAvailable={!newDocument&&view!=='edit'}"),'shared toolbar retains Add Files while edit owns its own Add');
const layout=await readFile('app/layout.tsx','utf8');assert(layout.includes('<ResponsiveViewport/>'));assert(layout.includes('interactiveWidget:"resizes-content"'));assert(!layout.includes('userScalable:false'));
console.log('PASS: 9 viewport geometries, browser-bar/keyboard separation, pinch-zoom stability, invalid measurement fallback, compact/desktop toolbar boundaries, Rotate export preservation and root viewport integration. CSS/math/source checks, not real-device browser geometry.');
