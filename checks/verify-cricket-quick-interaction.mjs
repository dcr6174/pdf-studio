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
await build({configFile:false,logLevel:'error',resolve:{alias:{'@':process.cwd()}},build:{ssr:true,outDir:'.cricket-quick-interaction-check',emptyOutDir:true,rollupOptions:{input:{game:resolve('components/fresh-game.tsx'),preferences:resolve('components/game-preferences.tsx')},output:{entryFileNames:'[name].mjs'},external:['react','react-dom']}}});
process.env.NODE_ENV='development';
const {createElement,act}=await import('react');const {createRoot}=await import('react-dom/client');
const {FreshGame}=await import(pathToFileURL(resolve('.cricket-quick-interaction-check/game.mjs')).href),{GamePreferences}=await import(pathToFileURL(resolve('.cricket-quick-interaction-check/preferences.mjs')).href);
const host=document.createElement('div');document.body.append(host);let root;
const errors=[],oldError=console.error,oldDate=Date.now;Date.now=()=>0;
console.error=(...args)=>{const s=args.join(' ');if(!s.includes('Error creating WebGL context'))errors.push(s);};
const find=s=>[...host.querySelectorAll('button')].find(b=>b.textContent.includes(s));
const click=async b=>{assert(b,'control exists');assert(!b.disabled,'control enabled: '+b.textContent);await act(async()=>b.click());};
const tick=async(ms=32)=>{await act(async()=>{now+=ms;const list=[...frames.values()];frames.clear();list.forEach(cb=>cb(now));});};
const settle=async(ms=30)=>act(async()=>{await new Promise(r=>setTimeout(r,ms));});
const mount=async()=>{if(root)await act(async()=>root.unmount());frames.clear();root=createRoot(host);await act(async()=>root.render(createElement(GamePreferences,{slug:'boundary-cricket'},createElement(FreshGame,{slug:'boundary-cricket'}))));await settle();};


const game=()=>host.querySelector('[data-cricket-screen]');
const phase=()=>game()?.dataset.cricketPhase;
const screen=()=>game()?.dataset.cricketScreen;
const key=async value=>act(async()=>window.dispatchEvent(new window.KeyboardEvent('keydown',{key:value,bubbles:true})));
async function start(batFirst=true){await click(find('PLAY NOW'));if(!batFirst)await click(find('CHASE'));await click(find('TAKE THE FIELD'));assert.equal(screen(),'match');await click(find(batFirst?'START BATTING':'START COMPUTER'));}
async function humanInnings(){let balls=0;while(screen()==='match'){
 if(phase()==='ready'){await click(find('START BATTING'));continue;}
 if(phase()==='delivery'){
  const marker=parseFloat(host.querySelector('.cq-timing-track>b').style.left);
  for(let i=0;i<180&&phase()==='delivery';i++){const p=Number(host.querySelector('[aria-label="Batting timing"]').getAttribute('aria-valuenow'));if(p>=marker)break;await tick(16);}
  const line=host.querySelector('.cq-delivery-label span').textContent;await key(line.startsWith('LEG')?'a':line.startsWith('OFF')?'d':'ArrowUp');assert.equal(phase(),'delivery','direction selection does not swing');const scoreBefore=host.querySelector('.cq-score-main').textContent;await key(' ');await key(' ');assert.equal(phase(),'flight');assert.equal(host.querySelector('.cq-score-main').textContent,scoreBefore,'score waits for completed shot animation');balls++;
 }
 for(let i=0;i<220&&screen()==='match'&&phase()!=='delivery';i++)await tick(32);
 assert(balls<=30,'human innings completes');
 }return balls;}
async function cpuInnings(){if(phase()==='ready')await click(find('START COMPUTER'));if(find('SKIP ANIMATION'))await click(find('SKIP ANIMATION'));for(let i=0;i<350&&screen()==='match';i++)await tick(48);assert.notEqual(screen(),'match','computer innings completes');}
try{
 await mount();await settle(700);assert.equal(screen(),'home');
 await click(find('How to Play'));assert.equal(screen(),'tutorial');await click(find('LEG'));assert(host.textContent.includes('Selected leg'));await click(find('NEXT'));await tick(48);await click(find('TRY BAT'));assert(host.textContent.includes('EARLY'));await click(find('NEXT'));await click(find('LET’S PLAY'));assert.equal(screen(),'setup');await click(find('HOME'));
 await click(find('Rules'));assert(host.textContent.includes('No wides, no-balls'));await click(find('HOME'));
 await click(find('Settings'));const slider=host.querySelector('[aria-label="Music volume"]');await act(async()=>{slider.value='35';slider.dispatchEvent(new window.Event('change',{bubbles:true}));slider.dispatchEvent(new window.Event('input',{bubbles:true}));});await click(host.querySelector('[aria-label="Mute cricket audio"]'));assert.equal(host.querySelector('[aria-label="Unmute cricket audio"]').getAttribute('aria-pressed'),'true');assert(JSON.parse(localStorage.getItem('studio-cricket:settings:v2')).muted);await click(find('HOME'));
 await start(true);await tick(200);const timing=host.querySelector('[aria-label="Batting timing"]').getAttribute('aria-valuenow');await click(host.querySelector('[aria-label="Pause cricket match"]'));for(let i=0;i<8;i++)await tick(48);assert.equal(host.querySelector('[aria-label="Batting timing"]').getAttribute('aria-valuenow'),timing);assert(find('Exit to Home'));await click(host.querySelector('.gf-pause .gf-primary'));
 await click(host.querySelector('[aria-label="Cricket match settings"]'));assert.equal(screen(),'settings');for(let i=0;i<10;i++)await tick(48);await click(find('BACK TO MATCH'));assert.equal(screen(),'match');
 const balls=await humanInnings();assert(balls>=1);assert.equal(screen(),'break');assert(find('START CHASE'));await click(find('START CHASE'));await cpuInnings();assert.equal(screen(),'result');await settle(750);assert.equal(host.querySelector('[data-game-state]').dataset.gameState,'finished');assert.equal(JSON.parse(localStorage.getItem('studio-cricket:records:v2')).recent.length,1);assert(find('PLAY AGAIN'));assert(!host.querySelector('.gf-end .gf-primary'),'native cricket result owns presentation');
 await click(find('PLAY AGAIN'));assert.equal(screen(),'match');assert.equal(host.querySelector('[data-game-state]').dataset.gameState,'play');await click(host.querySelector('[aria-label="Pause cricket match"]'));await click(find('Exit to Home'));assert.equal(screen(),'home');
 await start(false);await cpuInnings();assert.equal(screen(),'break');await click(find('START CHASE'));await humanInnings();assert.equal(screen(),'result');await settle(80);assert.equal(JSON.parse(localStorage.getItem('studio-cricket:records:v2')).recent.length,2);await click(find('VIEW RECORDS'));assert.equal(screen(),'records');assert(host.textContent.includes('Local to this browser'));
 // Remount simulates a fresh visit; records and mute persist without changing PDF/game data.
 await mount();await settle(700);assert.equal(screen(),'home');assert(host.querySelector('[aria-label="Unmute cricket audio"]'));await click(find('Records'));assert.equal(host.querySelectorAll('.cq-matches li').length,2);await click(find('HOME'));
 await click(find('PLAY NOW'));await click(find('PRACTICE'));await click(find('TAKE THE FIELD'));await humanInnings();assert.equal(screen(),'result');assert.equal(JSON.parse(localStorage.getItem('studio-cricket:records:v2')).recent.length,2,'practice excluded from records');
 assert.deepEqual(errors,[],'no React/runtime errors');console.log('PASS: home/tutorial/rules/settings, muted save+reload, separate aim/Space swing, one swing per ball, animation-before-score, shared pause/settings/exit, both full match orders, AI skip, result/replay, persisted records and practice. Happy DOM only, not GPU/phone testing.');
}finally{if(root)await act(async()=>root.unmount());console.error=oldError;Date.now=oldDate;await window.happyDOM.close();}
