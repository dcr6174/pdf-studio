/** Actual React/shared-frame interactions in a simulated DOM. No GPU, touch-device or visual claims. */
import assert from 'node:assert/strict';
import {build} from 'vite';
import {Window} from 'happy-dom';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
const window=new Window({url:'https://pdf-studio.in/lab/arcade/merge-2048'});
for(const k of ['window','document','navigator','localStorage','HTMLElement','HTMLInputElement','HTMLSelectElement','HTMLTextAreaElement','HTMLButtonElement','HTMLCanvasElement','Element','Node','Event','CustomEvent','KeyboardEvent','MutationObserver','ResizeObserver','screen','innerHeight','innerWidth','scrollY'])Object.defineProperty(globalThis,k,{configurable:true,value:k==='window'?window:window[k]});
window.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){}});
window.HTMLCanvasElement.prototype.getContext=()=>null;
window.confirm=()=>true;
globalThis.IS_REACT_ACT_ENVIRONMENT=true;
let now=1000,id=0;const frames=new Map();
globalThis.requestAnimationFrame=window.requestAnimationFrame=cb=>{frames.set(++id,cb);return id;};
globalThis.cancelAnimationFrame=window.cancelAnimationFrame=n=>frames.delete(n);
await build({configFile:false,logLevel:'error',resolve:{alias:{'@':process.cwd()}},build:{ssr:true,outDir:'.classic-interaction-check',emptyOutDir:true,rollupOptions:{input:{game:resolve('components/arcade-game.tsx'),preferences:resolve('components/game-preferences.tsx')},output:{entryFileNames:'[name].mjs'},external:['react','react-dom']}}});
process.env.NODE_ENV='development';
const {createElement,act}=await import('react');
const {createRoot}=await import('react-dom/client');
const {ArcadeGame}=await import(pathToFileURL(resolve('.classic-interaction-check/game.mjs')).href);
const {GamePreferences}=await import(pathToFileURL(resolve('.classic-interaction-check/preferences.mjs')).href);
const host=document.createElement('div');document.body.append(host);let root;
const errors=[],oldError=console.error;console.error=(...args)=>errors.push(args.join(' '));
const find=text=>[...host.querySelectorAll('button')].find(b=>b.textContent.trim()===text);
const click=async el=>{assert(el,'control exists');assert(!el.disabled,'control enabled');await act(async()=>{el.focus();el.click();});};
const tick=async(ms=100)=>{await act(async()=>{now+=ms;const tasks=[...frames.values()];frames.clear();tasks.forEach(cb=>cb(now));});};
const board=()=>[...host.querySelectorAll('.arcade-board button')].map(b=>b.textContent);
const key=async(el,k,extra={})=>{let e;await act(async()=>{e=new window.KeyboardEvent('keydown',{key:k,bubbles:true,cancelable:true,...extra});el.dispatchEvent(e);});return e;};
const mount=async slug=>{if(root)await act(async()=>root.unmount());frames.clear();root=createRoot(host);await act(async()=>{root.render(createElement(GamePreferences,{slug},createElement(ArcadeGame,{slug})));});await act(async()=>{await new Promise(r=>setTimeout(r,20));});};
const start=async()=>{await click(find('Let’s play')??find('Resume game'));await tick();};
try{
 // Known synthetic saved board: a pointer move followed immediately by an arrow-key move.
 localStorage.setItem('studio-arcade:board:merge-2048',JSON.stringify({board:[2,2,...Array(14).fill(0)],score:0,moves:0}));
 await mount('merge-2048');await start();await click(host.querySelector('[aria-label="Move left"]'));
 const before=board(),pad=host.querySelector('[aria-label="Move left"]');
 const event=await key(pad,'ArrowDown');assert.notDeepEqual(board(),before,'arrow input after pointer focus moves the board');assert(event.defaultPrevented);
 await click(find('Undo'));assert.deepEqual(board(),before,'undo returns the prior board');
 const input=document.createElement('input');host.append(input);const stable=board();await key(input,'ArrowDown');assert.deepEqual(board(),stable,'form fields retain arrow keys');input.remove();
 const shortcut=await key(pad,'ArrowDown',{ctrlKey:true});assert(!shortcut.defaultPrevented,'modified browser shortcuts stay native');assert.deepEqual(board(),stable);
 await click(host.querySelector('.gf-bar [aria-label="Pause (P)"]'));await key(pad,'ArrowDown');assert.deepEqual(board(),stable,'pause blocks movement');await click(host.querySelector('.gf-pause .gf-primary'));
 await key(pad,'ArrowDown');assert.notDeepEqual(board(),stable,'resume accepts input again');
 // The same key path must solve a sliding puzzle, without replacing its engine.
 localStorage.setItem('studio-arcade:board:sliding-puzzle',JSON.stringify({board:[1,2,3,4,5,6,7,0,8],score:0,moves:0}));
 await mount('sliding-puzzle');await start();await key(host.querySelector('[aria-label="Move right"]'),'ArrowRight');assert(host.textContent.includes('Nicely played!'),'legal keyboard move wins a solvable puzzle');
 // Every initial game starts, pauses, resumes, and restarts through the shared protocol.
 const slugs=['buddy-stack','paper-toss','merge-2048','bubble-pop','snake-sprint','memory-match','neon-breaker','odd-one','sliding-puzzle','buddy-runner'];
 for(const slug of slugs){
  localStorage.removeItem('studio-arcade:board:'+slug);await mount(slug);await start();
  assert.equal(host.querySelector('.gf-host').dataset.gfPhase,'playing',slug+' start');
  await click(host.querySelector('.gf-bar [aria-label="Pause (P)"]'));assert.equal(host.querySelector('.gf-host').dataset.gfPhase,'paused',slug+' pause');
  await click(host.querySelector('.gf-pause .gf-primary'));assert.equal(host.querySelector('.gf-host').dataset.gfPhase,'playing',slug+' resume');
  await click(host.querySelector('.gf-bar [aria-label="Arcade menu"]'));await click(host.querySelector('.gf-restart'));
  assert.equal(host.querySelector('.gf-host').dataset.gfPhase,'playing',slug+' restart');assert.equal(host.querySelector('.gf-host').dataset.gfScore,'0',slug+' score reset');
 }
 assert.deepEqual(errors,[],'no React/runtime errors');
 console.log('PASS: mixed pointer/keyboard 2048, undo, pause/resume, form/shortcut ownership, sliding victory; all 10 classic screens start/pause/resume/restart via shared frame. Simulated DOM, not visual/device gameplay.');
}finally{if(root)await act(async()=>root.unmount());console.error=oldError;await window.happyDOM.close();}
