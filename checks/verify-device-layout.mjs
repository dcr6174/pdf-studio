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
 assert.equal(toolbar.some(([p,v])=>p==='top'&&v==='var(--studio-header-bottom,var(--studio-header-height))'),width<1100,'toolbar attaches below header');
}
const header=await readFile('components/use-mobile-tool-header.ts','utf8');assert(header.includes("matchMedia('(max-width:1099px)')"));
const app=await readFile('app/page.tsx','utf8');assert(app.includes("const mobileAction=view==='reader'?null:sidebarAction"),'Rotate retains the reachable shared export action');
assert(app.includes("addAvailable={!newDocument&&view!=='edit'}"),'shared toolbar retains Add Files while edit owns its own Add');
const layout=await readFile('app/layout.tsx','utf8');assert(layout.includes('<ResponsiveViewport/>'));assert(layout.includes('interactiveWidget:"resizes-content"'));assert(!layout.includes('userScalable:false'));
console.log('PASS: 9 viewport geometries, browser-bar/keyboard separation, pinch-zoom stability, invalid measurement fallback, compact/desktop toolbar boundaries, Rotate export preservation and root viewport integration. CSS/math/source checks, not real-device browser geometry.');

// Server-render and exercise the actual compact controls without invoking PDF engines.
const {createElement}=await import('react');
const {renderToStaticMarkup}=await import('react-dom/server');
const presetsSource=ts.transpileModule(await readFile('lib/compression-presets.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const presetsURL='data:text/javascript;base64,'+Buffer.from(presetsSource).toString('base64');
const primarySource=ts.transpileModule(await readFile('components/mobile-tool-primary-controls.tsx','utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText.replace(/(["'])@\/lib\/compression-presets\1/g,JSON.stringify(presetsURL)).replace(/(["'])react\/jsx-runtime\1/g,JSON.stringify(import.meta.resolve('react/jsx-runtime')));
const {MobileToolPrimaryControls}=await import('data:text/javascript;base64,'+Buffer.from(primarySource).toString('base64'));
let selected='',range='';const common={tool:'compress',quality:'images',range:'',disabled:false,onQuality:value=>selected=value,onRange:value=>range=value};
const html=renderToStaticMarkup(createElement(MobileToolPrimaryControls,common));
assert(html.includes('aria-label="Compression level"'));assert.equal((html.match(/<option/g)||[]).length,3);
for(const [value,name] of [['compact','Keep quality'],['images','Balanced'],['image-small','Smaller file']]){assert(html.includes('value="'+value+'"'));assert(html.includes(name));}
for(const value of ['compact','images','image-small']){MobileToolPrimaryControls(common).props.onChange({target:{value}});assert.equal(selected,value);}
assert(MobileToolPrimaryControls({...common,disabled:true}).props.disabled);
MobileToolPrimaryControls({...common,tool:'split'}).props.onChange({target:{value:'1, 3-5'}});assert.equal(range,'1, 3-5');
for(const tool of ['jpg','png','webp']){const control=MobileToolPrimaryControls({...common,tool,quality:'2'});assert.equal(control.props.value,'2');assert.equal(control.props.children.length,3);}
assert.equal(MobileToolPrimaryControls({...common,tool:'reader'}),null,'Reader retains dedicated controls');
const desktopPresets=await readFile('components/compression-settings.tsx','utf8');assert(desktopPresets.includes("compressionPresets as presets"),'desktop and mobile share exact engine values');
console.log('PASS: actual compression selector renders three canonical options, selection callbacks/disabled state, page-range entry, image resolutions and dedicated-tool fallback. SSR/component checks, not phone gestures.');

// A real header-owned dock avoids conflicting fixed-position offsets.
const dockSource=await readFile('components/mobile-workspace-controls.tsx','utf8');
assert(dockSource.includes('createPortal(<div className="mobile-toolbar-dock">{controls}</div>,header)'));
const dockRules=[];css.walkRules(rule=>{if(rule.selector.includes('.mobile-toolbar-dock'))dockRules.push(rule);});
for(const width of [320,390,768,1099]){
 const parent=dockRules.find(rule=>rule.selector.endsWith('.studio-header>.mobile-toolbar-dock')&&active(rule,width));assert(parent,'dock exists only in compact layout');
 assert(parent.nodes.some(d=>d.prop==='top'&&d.value==='100%'),'dock starts at actual header boundary');
 const child=dockRules.find(rule=>rule.selector.endsWith('.mobile-toolbar-dock>.mobile-workspace-controls')&&active(rule,width));
 for(const [prop,value] of [['position','static'],['margin','0'],['inset','auto']])assert(child.nodes.some(d=>d.prop===prop&&d.value===value&&d.important),'clear old floating '+prop);
}
assert(dockRules.every(rule=>!active(rule,1366)),'desktop toolbar behavior unchanged');
console.log('PASS: shared toolbar mounts into its own header and resets floating offsets/margins; desktop unaffected. Structural/CSS checks, not physical-phone geometry.');

// Regression: legacy inset:0 + height:100dvh stretched the signature popup.
const signatureSelector='html body .signature-dialog.signature-dialog-small[data-slot=dialog-content]';
for(const [width,height] of [[320,568],[390,844],[390,390],[844,390],[1099,768]]){
 const rules=[];css.walkRules(rule=>{if(rule.selector===signatureSelector&&active(rule,width,height))rules.push(rule);});
 assert.equal(rules.length,1,'one compact signature geometry rule');
 const values=new Map(rules[0].nodes.filter(node=>node.type==='decl').map(d=>[d.prop,[d.value,d.important]]));
 for(const [prop,value] of [['inset','auto'],['height','auto'],['min-height','0'],['bottom','auto'],['transform','translateX(-50%)'],['max-height','calc(var(--studio-viewport-height) - 16px)']])assert.deepEqual(values.get(prop),[value,true],'reset legacy signature '+prop);
 assert.equal(values.get('top')[0],'calc(var(--studio-viewport-top) + 8px)','keyboard viewport owns top edge');
}
css.walkRules(rule=>{if(rule.selector===signatureSelector)assert(!active(rule,1366),'desktop signature layout unchanged');});
console.log('PASS: signature popup clears full-screen insets and height, uses visible keyboard viewport, and leaves desktop unchanged. CSS/source checks; real keyboard layout remains a device check.');
