/** Real React components in Happy DOM. These are workflow/rules checks, not GPU or phone testing. */
import assert from 'node:assert/strict';
import {build} from 'vite';
import {Window} from 'happy-dom';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
const window=new Window({url:'https://pdf-studio.in/lab/arcade/boundary-cricket'});
for(const k of ['window','document','navigator','localStorage','HTMLElement','HTMLInputElement','HTMLSelectElement','HTMLTextAreaElement','HTMLButtonElement','HTMLCanvasElement','Element','Node','Event','CustomEvent','KeyboardEvent','MutationObserver','ResizeObserver','screen','innerHeight','innerWidth','scrollY'])Object.defineProperty(globalThis,k,{configurable:true,value:k==='window'?window:window[k]});
window.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){}});
window.HTMLCanvasElement.prototype.getContext=()=>null;window.HTMLElement.prototype.setPointerCapture=()=>{};
globalThis.IS_REACT_ACT_ENVIRONMENT=true;
let now=1000,id=0;const frames=new Map();
globalThis.requestAnimationFrame=window.requestAnimationFrame=cb=>{frames.set(++id,cb);return id;};
globalThis.cancelAnimationFrame=window.cancelAnimationFrame=n=>frames.delete(n);
await build({configFile:false,logLevel:'error',resolve:{alias:{'@':process.cwd()}},build:{ssr:true,outDir:'.cricket-day-interaction-check',emptyOutDir:true,rollupOptions:{input:{game:resolve('components/fresh-game.tsx'),preferences:resolve('components/game-preferences.tsx')},output:{entryFileNames:'[name].mjs'},external:['react','react-dom']}}});
process.env.NODE_ENV='development';
const {createElement,act}=await import('react');const {createRoot}=await import('react-dom/client');
const {FreshGame}=await import(pathToFileURL(resolve('.cricket-day-interaction-check/game.mjs')).href),{GamePreferences}=await import(pathToFileURL(resolve('.cricket-day-interaction-check/preferences.mjs')).href);
const host=document.createElement('div');document.body.append(host);let root;
const errors=[],oldError=console.error,oldDate=Date.now;Date.now=()=>0;
console.error=(...args)=>{const s=args.join(' ');if(!s.includes('Error creating WebGL context'))errors.push(s);};
const find=s=>[...host.querySelectorAll('button')].find(b=>b.textContent.includes(s));
const click=async b=>{assert(b,'control exists');assert(!b.disabled,'control enabled: '+b.textContent);await act(async()=>b.click());};
const tick=async(ms=32)=>{await act(async()=>{now+=ms;const list=[...frames.values()];frames.clear();list.forEach(cb=>cb(now));});};
const settle=async(ms=30)=>act(async()=>{await new Promise(r=>setTimeout(r,ms));});
const mount=async()=>{if(root)await act(async()=>root.unmount());frames.clear();root=createRoot(host);await act(async()=>root.render(createElement(GamePreferences,{slug:'boundary-cricket'},createElement(FreshGame,{slug:'boundary-cricket'}))));await settle();};
const select=async(label,value)=>{const el=[...host.querySelectorAll('label')].find(l=>l.textContent.startsWith(label))?.querySelector('select')??host.querySelector('select[aria-label="'+label+'"]');assert(el,label);await act(async()=>{el.value=value;el.dispatchEvent(new window.Event('change',{bubbles:true}));});};
const progress=()=>host.querySelector('.pc-timing')?.getAttribute('aria-label');
async function tossAndChoose(bat){await click(find('WALK OUT'));await click(find('TAILS'));assert(host.textContent.includes('You won the toss.'));await click(find(bat?'BAT FIRST':'BOWL FIRST'));}
async function batInnings(){await click(find('START INNINGS'));let count=0;while(host.querySelector('[aria-label="Cricket batting controller"]')&&!find('DEFEND THE TOTAL')&&!find('CHASE THE TARGET')){
 if(find('START INNINGS'))throw Error('unexpected restart');
 if(host.querySelector('.pc-timing')){for(let i=0;i<150&&host.querySelector('.pc-timing')&&!progress()?.includes('78 percent');i++){
  const pct=Number(progress()?.match(/\d+/)?.[0]);if(pct>=78)break;await tick(16);
 }
 const line=host.querySelector('.pc-overlay-score span').textContent;await click(host.querySelector('.pc-bat-buttons button[aria-label^="'+(line.includes('LEG')?'LEG SIDE':line.includes('OFF')?'OFF SIDE':'STRAIGHT')+'"]'));count++;
 }
 const next=find('Next delivery');if(next)await click(next);else{await settle(1850);break;}
 assert(count<30,'innings terminates');
 }return count;}
async function bowlBall(line=0,good=true){await select('Bowling line',String(line));await click(find('START RUN-UP'));await tick();if(good)for(let i=0;i<14;i++)await tick(32);await click(find('RELEASE BALL'));for(let i=0;i<100&&host.querySelector('[aria-label="Bowling release precision"]')===null&&!find('PLAN NEXT BALL')&&host.querySelector('[aria-label="Cricket bowling controller"]');i++)await tick(48);}
try{
 await mount();assert(find('WALK OUT'));assert.equal(host.querySelectorAll('.pc-fixture-selects select option').length,16);await select('Your team','aus');assert.equal(host.querySelectorAll('.pc-fixture-selects select')[1].value,'ind','opponent cannot equal player');await select('Your team','ind');await select('Opposition','aus');
 await tossAndChoose(true);assert(host.textContent.includes('India v Australia'));const balls=await batInnings();assert(balls>=10,'first innings completed meaningful deliveries');assert(find('DEFEND THE TOTAL'));assert(host.textContent.includes('INNINGS BREAK'));
 await click(find('DEFEND THE TOTAL'));assert(find('START RUN-UP'));
 // A wide and no-ball add extras without consuming a legal ball.
 await bowlBall(3);assert(host.textContent.includes('Wide. One extra'));assert(host.querySelector('.pc-score-strip').textContent.includes('0.0'));await click(find('PLAN NEXT BALL'));
 await bowlBall(0,false);assert(host.textContent.includes('No-ball.'));assert(host.querySelector('.pc-score-strip').textContent.includes('0.0'));assert(host.textContent.includes('FREE HIT'));await click(find('PLAN NEXT BALL'));
 // Pause during run-up keeps the same meter value. Resume and complete the innings.
 await click(find('START RUN-UP'));await tick();await tick(100);const before=host.querySelector('[role="meter"]').getAttribute('aria-valuenow');await click(host.querySelector('.gf-bar [aria-label="Pause (P)"]'));for(let i=0;i<5;i++)await tick();assert.equal(host.querySelector('[role="meter"]').getAttribute('aria-valuenow'),before);await click(host.querySelector('.gf-pause .gf-primary'));await click(find('RELEASE BALL'));for(let i=0;i<100&&!find('PLAN NEXT BALL');i++)await tick(48);if(find('PLAN NEXT BALL'))await click(find('PLAN NEXT BALL'));
 let delivered=0;while(find('START RUN-UP')&&!find('WALK OUT')){await bowlBall(0);if(find('PLAN NEXT BALL'))await click(find('PLAN NEXT BALL'));else{await settle(1850);break;}assert(++delivered<25);}
 await settle(1550);assert.equal(host.querySelector('[data-game-state]').dataset.gameState,'finished','full batting-first match ends');
 // Shared restart must clear match state; bowl first, then chase in a second full workflow.
 await settle(750);await click(host.querySelector('.gf-end .gf-primary'));assert(find('WALK OUT'));await tossAndChoose(false);
 delivered=0;while(find('START RUN-UP')){await bowlBall(0);if(find('PLAN NEXT BALL'))await click(find('PLAN NEXT BALL'));else{await settle(1850);break;}assert(++delivered<25);}
 assert(find('CHASE THE TARGET'));await click(find('CHASE THE TARGET'));await batInnings();await settle(1550);assert.equal(host.querySelector('[data-game-state]').dataset.gameState,'finished','bowling-first match ends after chase');
 assert.deepEqual(errors,[],'no React/runtime errors');console.log('PASS: actual teams/toss choice, both complete two-innings workflows, wide/no-ball/free hit, run-up pause/resume, chase, result and shared replay. Simulated DOM; no GPU/device claim.');
}finally{if(root)await act(async()=>root.unmount());console.error=oldError;Date.now=oldDate;await window.happyDOM.close();}
