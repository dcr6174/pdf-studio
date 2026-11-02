/** Browserless integration checks. These exercise the real React screen and shared frame;
 * they do not substitute for WebGL/device visual or audio testing. */
import assert from 'node:assert/strict';
import {build} from 'vite';
import {Window} from 'happy-dom';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
const window=new Window({url:'https://pdf-studio.in/lab/arcade/boundary-cricket'});
for(const key of ['window','document','navigator','localStorage','HTMLElement','HTMLInputElement','HTMLSelectElement','HTMLTextAreaElement','HTMLButtonElement','HTMLCanvasElement','Element','Node','Event','CustomEvent','KeyboardEvent','MutationObserver','ResizeObserver','screen','innerHeight','innerWidth','scrollY']){
 Object.defineProperty(globalThis,key,{configurable:true,value:key==='window'?window:window[key]});
}
window.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){}});
window.HTMLCanvasElement.prototype.getContext=()=>null;
window.SpeechSynthesisUtterance=class {constructor(text){this.text=text;}};
window.speechSynthesis={getVoices:()=>[{lang:'en-IN',localService:true}],speak(){},cancel(){}};

globalThis.IS_REACT_ACT_ENVIRONMENT=true;
let now=1000,id=0;const frames=new Map();
globalThis.requestAnimationFrame=window.requestAnimationFrame=cb=>{frames.set(++id,cb);return id;};
globalThis.cancelAnimationFrame=window.cancelAnimationFrame=n=>frames.delete(n);
await build({configFile:false,logLevel:'error',resolve:{alias:{'@':process.cwd()}},build:{ssr:true,outDir:'.cricket-interaction-check',emptyOutDir:true,rollupOptions:{input:{game:resolve('components/fresh-game.tsx'),preferences:resolve('components/game-preferences.tsx')},output:{entryFileNames:'[name].mjs'},external:['react','react-dom']}}});
// Vite sets NODE_ENV=production during build; React's interaction harness needs its dev act API.
process.env.NODE_ENV='development';
const {createElement,act}=await import('react');
const {createRoot}=await import('react-dom/client');
const {FreshGame}=await import(pathToFileURL(resolve('.cricket-interaction-check/game.mjs')).href);
const {GamePreferences}=await import(pathToFileURL(resolve('.cricket-interaction-check/preferences.mjs')).href);
const host=document.createElement('div');document.body.append(host);const root=createRoot(host);
const errors=[],oldError=console.error;
console.error=(...args)=>{const text=args.join(' ');if(!text.includes('Error creating WebGL context'))errors.push(text);};
const click=async el=>{assert(el,'expected a control');await act(async()=>{el.click();});};
const find=text=>Array.from(host.querySelectorAll('button')).find(b=>b.textContent.includes(text));
const tick=async(ms=16)=>{await act(async()=>{now+=ms;const tasks=[...frames.values()];frames.clear();tasks.forEach(cb=>cb(now));});};
const phase=()=>host.querySelector('[data-cricket-phase]')?.dataset.cricketPhase;
const score=()=>host.querySelector('[data-game-score]')?.textContent;
const advance=async(test,max=2000)=>{for(let n=0;n<max&&!test();n++)await tick(48);assert(test(),'expected game state before timeout');};
const key=async k=>act(async()=>window.dispatchEvent(new window.KeyboardEvent('keydown',{key:k,bubbles:true})));
try{
 await act(async()=>{root.render(createElement(GamePreferences,{slug:'boundary-cricket'},createElement(FreshGame,{slug:'boundary-cricket'})));await new Promise(r=>setTimeout(r,30));});
 for(let n=0;n<200&&!find('How to play');n++)await act(async()=>{await new Promise(r=>setTimeout(r,20));});
 assert(find('How to play'),'stadium resolves to the home screen');
 assert.equal(host.querySelectorAll('h1').length,1,'shared page owns the only primary heading');
 await click(find('Settings'));const speech=host.querySelector('.cq-settings input[type=checkbox]');
 assert.equal(speech.checked,false,'speech is opt-in');await act(async()=>{speech.click();});
 assert.equal(JSON.parse(localStorage.getItem('studio-arcade:cricket:settings:v2')).spokenBoundaries,true,'spoken preference saves');
 await click(find('Back to home'));

 await click(find('How to play'));await click(find('Leg side'));await click(find('Next step'));await click(find('Try a swing'));await click(find('Next step'));await click(find('Set up a match'));
 await click(find('1 over'));await click(find('Start match'));
 await advance(()=>phase()==='bowling');
 await key('a');assert.equal(find('Leg side').getAttribute('aria-pressed'),'true','A selects direction without swinging');assert.equal(phase(),'bowling');
 await key(' ');assert.equal(phase(),'flight');const frozen=score();await key(' ');await key('d');assert.equal(score(),frozen,'scoring waits for animation');
 await click(host.querySelector('.gf-bar [aria-label="Pause (P)"]'));
 assert.equal(host.querySelector('[data-game-state]').dataset.gameState,'paused');
 for(let i=0;i<100;i++)await tick(48);assert.equal(score(),frozen);assert.equal(phase(),'flight');
 await click(host.querySelector('.gf-pause .gf-primary'));
 await advance(()=>phase()==='result');const completed=score();for(let i=0;i<5;i++)await tick(48);assert.equal(score(),completed,'one score per ball');
 await click(find('Match settings'));assert(find('Back to match'));const before=score();for(let i=0;i<60;i++)await tick(48);assert.equal(score(),before);await click(find('Back to match'));
 await advance(()=>!!find('Start chase'));
 assert(host.textContent.includes('1.0 overs'),'six balls display one over');
 await click(find('Start chase'));await click(find('Skip animation'));
 await advance(()=>!!find('Play again'),3000);
 assert.equal(host.querySelector('[data-game-state]').dataset.gameState,'finished');
 assert.equal(JSON.parse(localStorage.getItem('studio-arcade:cricket:records:v2')).matches,1);
 assert.equal(host.querySelector('.gf-end')?.hidden,true,'custom result avoids competing end cards');
 assert.equal(JSON.parse(localStorage.getItem('studio-arcade:progress:v1')).rounds,1,'custom result retains shared progression exactly once');
 await click(find('Exit to home'));await click(find('Play now'));await click(find('Chase'));await click(find('Start match'));await click(find('Skip animation'));
 await advance(()=>!!find('Start chase'));await click(find('Start chase'));
 await advance(()=>phase()==='bowling');
 await click(host.querySelector('.gf-bar [aria-label="Pause (P)"]'));await click(find('Restart match'));
 assert.equal(score(),'0/0','restart clears previous innings');
 await click(find('Skip animation'));await advance(()=>!!find('Start chase'));await click(find('Start chase'));
 await advance(()=>!!find('Play again'),3000);
 assert.equal(JSON.parse(localStorage.getItem('studio-arcade:cricket:records:v2')).matches,2);
 await click(find('Play again'));assert.equal(score(),'0/0');
 await click(host.querySelector('.gf-bar [aria-label="Pause (P)"]'));await click(find('Exit to game home'));assert(find('Play now'));
 await click(find('Settings'));const mute=host.querySelector('.cq-settings [aria-pressed]');assert(mute);const was=mute.getAttribute('aria-pressed');await click(mute);assert.notEqual(mute.getAttribute('aria-pressed'),was);
 assert(host.textContent.includes('2D compatibility mode'),'no-WebGL fallback');
 assert.deepEqual(errors,[],'no React/runtime errors');
 console.log('PASS: tutorial, direction + single swing, delayed score, pause/resume, settings freeze, both complete batting orders, restart, exit, mute, records and no-WebGL fallback.');
}finally{await act(async()=>root.unmount());console.error=oldError;await window.happyDOM.close();}
