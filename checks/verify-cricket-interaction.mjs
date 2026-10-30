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
const progress=()=>Number(host.querySelector('.play-cricket-field')?.getAttribute('aria-label')?.match(/progress (\d+) percent/)?.[1]??0);
const score=()=>host.querySelector('.pc-main-score strong')?.textContent;
try{
 await act(async()=>{root.render(createElement(GamePreferences,{slug:'boundary-cricket'},createElement(FreshGame,{slug:'boundary-cricket'})));await new Promise(r=>setTimeout(r,25));});
 assert(find('START CHASE'));await click(find('START CHASE'));await tick();
 assert(host.querySelector('.pc-auto-foot input').checked,'beginner footwork starts automatic');
 // An early A key commits one delivery; subsequent D/Space inputs cannot score it twice.
 await act(async()=>window.dispatchEvent(new window.KeyboardEvent('keydown',{key:'a',bubbles:true})));
 assert(host.querySelector('.pc-overlay-score').textContent.includes('MISSED'));
 const after=host.querySelector('.pc-score-strip').textContent;
 await act(async()=>{for(const key of ['d',' ','ArrowRight'])window.dispatchEvent(new window.KeyboardEvent('keydown',{key,bubbles:true}));});
 assert.equal(host.querySelector('.pc-score-strip').textContent,after,'one swing per ball');
 await click(find('Next delivery'));await tick();
 // The shared pause owns the match, including keyboard input and its animation clock.
 await click(host.querySelector('.gf-bar [aria-label="Pause (P)"]'));
 assert.equal(host.querySelector('[data-game-state]').dataset.gameState,'paused');
 const frozen=progress(),frozenScore=score();
 for(let i=0;i<10;i++)await tick(48);
 await act(async()=>window.dispatchEvent(new window.KeyboardEvent('keydown',{key:'d',bubbles:true})));
 assert.equal(progress(),frozen);assert.equal(score(),frozenScore);
 await click(host.querySelector('.gf-pause .gf-primary'));
 assert.equal(host.querySelector('[data-game-state]').dataset.gameState,'play');
 // Opening the shared menu pauses; closing it resumes only a match it paused.
 await click(host.querySelector('.gf-bar [aria-label="Arcade menu"]'));
 assert.equal(host.querySelector('[data-game-state]').dataset.gameState,'paused');
 const mute=find('Stadium sound');assert(mute);const was=mute.getAttribute('aria-pressed');
 await click(mute);assert.notEqual(mute.getAttribute('aria-pressed'),was);
 await click(host.querySelector('[aria-label="Close menu"]'));
 assert.equal(host.querySelector('[data-game-state]').dataset.gameState,'play');
 // Batting settings pause the ball but remain operable, then release the same delivery.
 const options=host.querySelector('.pc-advanced-options');
 await act(async()=>{options.open=true;options.dispatchEvent(new window.Event('toggle'));});
 const before=progress();for(let i=0;i<5;i++)await tick(48);assert.equal(progress(),before);
 await act(async()=>{options.open=false;options.dispatchEvent(new window.Event('toggle'));});
 // Play actual, aligned ground strokes through to a complete over and a finished chase.
 let rounds=1,seenOver=false;
 while(rounds<12&&host.querySelector('[data-game-state]').dataset.gameState==='play'){
  for(let i=0;i<300&&progress()<97;i++)await tick();
  const line=host.querySelector('.pc-overlay-score span').textContent;
  const side=line.includes('LEG')?'LEG SIDE':line.includes('OFF')?'OFF SIDE':'STRAIGHT';
  await click(host.querySelector('.pc-bat-buttons button[aria-label^="'+side+'"]'));
  rounds++;
  if(rounds===6){assert.equal(host.querySelectorAll('.pc-ball-feed span').length,6);assert(Array.from(host.querySelectorAll('.pc-ball-feed span')).every(s=>s.textContent!=='—'));seenOver=true;}
  const next=find('Next delivery');if(next)await click(next);else break;
 }
 assert(seenOver,'a complete over was played');
 await act(async()=>{await new Promise(r=>setTimeout(r,1900));});
 assert.equal(host.querySelector('[data-game-state]').dataset.gameState,'finished','chase ends after final-ball presentation');
 await click(find('Play again'));assert(find('START CHASE'),'replay returns to setup');
 await click(find('START CHASE'));assert.equal(score(),'0/0','new chase resets score');
 await act(async()=>{await new Promise(r=>setTimeout(r,30));});
 assert(host.textContent.includes('2D compatibility mode'),'no WebGL falls back to a playable stadium');
 assert.deepEqual(errors,[],'no unexpected React/runtime errors');
 console.log('PASS: mouse/A-D batting, one swing per ball, shared pause/resume/menu, sound toggle, settings freeze, full over, chase end, replay and no-WebGL fallback.');
}finally{await act(async()=>root.unmount());console.error=oldError;await window.happyDOM.close();}
