'use client';
import {useEffect,useRef,type ReactNode} from 'react';
import {parsePreferences,rememberGame,validSelect} from '../lib/arcade-preferences';
const inputSelector='.arcade-game-sidebar select,.arcade-game-sidebar input[type="checkbox"],.club-sidebar select';
const toggleSelector='.fresh-preferences button[aria-pressed],.rooftop-head-actions button[aria-pressed],.arcade-game-controls button[aria-pressed]';
const choiceSelector='.pc-pregame .pc-choices button[aria-pressed]';
const startSelector='.arcade-stage-overlay button,.club-curtain button,.puzzle-curtain button,.fresh-curtain button,.rooftop-start,.pc-start';
const text=(el:Element)=>el.textContent?.trim()??'';
function controlKey(el:Element):string {
 if(el.matches(choiceSelector)){const group=el.closest('.pc-choices');return 'choice:'+text(group?.previousElementSibling??el);}
 if(el instanceof HTMLSelectElement||el instanceof HTMLInputElement)return 'input:'+(el.closest('label')?.childNodes[0]?.textContent?.trim()??el.getAttribute('aria-label')??'');
 if(el.closest('.fresh-preferences'))return text(el).includes('Comfort')?'toggle:comfort':'toggle:sound';
 return 'toggle:sound';
}
export function GamePreferences({slug,children}:{slug:string;children:ReactNode}) {
 const root=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const el=root.current;if(!el)return;
  const key='studio-arcade:preferences:v1:'+slug;
  let saved:ReturnType<typeof parsePreferences>={};try{saved=parsePreferences(localStorage.getItem(key));}catch{}
  let restoring=true,started=false,changedRound=false,ticks=0;
  const quick=new URL(window.location.href).searchParams.get('play')==='1';
  const persist=(event:Event)=>{
   if(restoring)return;const target=event.target;if(!(target instanceof Element))return;
   const node=target.closest(inputSelector+','+toggleSelector+','+choiceSelector);if(!node||!el.contains(node))return;
   window.setTimeout(()=>{const name=controlKey(node);if(node instanceof HTMLSelectElement)saved[name]=node.value;else if(node instanceof HTMLInputElement)saved[name]=node.checked;else if(node.matches(choiceSelector)){if(node.getAttribute('aria-pressed')==='true')saved[name]=text(node);}else saved[name]=node.getAttribute('aria-pressed')==='true';try{localStorage.setItem(key,JSON.stringify(saved));}catch{}},0);
  };
  el.addEventListener('change',persist);el.addEventListener('click',persist);
  const restore=()=>{
   for(const node of el.querySelectorAll(inputSelector)){
    const value=saved[controlKey(node)];
    if(node instanceof HTMLSelectElement&&validSelect(value,Array.from(node.options,o=>o.value))&&node.value!==value&&!node.disabled){const setter=Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,'value')?.set;setter?.call(node,value);node.dispatchEvent(new Event('change',{bubbles:true}));if(node.closest('.arcade-game-sidebar'))changedRound=true;}
    if(node instanceof HTMLInputElement&&typeof value==='boolean'&&node.checked!==value&&!node.disabled){node.click();if(node.closest('.arcade-game-sidebar'))changedRound=true;}
   }
   for(const node of el.querySelectorAll<HTMLButtonElement>(toggleSelector)){const value=saved[controlKey(node)];if(typeof value==='boolean'&&!node.disabled&&(node.getAttribute('aria-pressed')==='true')!==value)node.click();}
   for(const node of el.querySelectorAll<HTMLButtonElement>(choiceSelector)){if(saved[controlKey(node)]===text(node)&&node.getAttribute('aria-pressed')!=='true'&&!node.disabled)node.click();}
  };
  const interval=window.setInterval(()=>{
   ticks++;restore();
   if(ticks<5)return;
   restoring=false;
   if(quick&&!started){
    // Round options in the original canvas games apply when creating a new round.
    const restart=changedRound?Array.from(el.querySelectorAll<HTMLButtonElement>('.arcade-game-controls button')).find(b=>text(b)==='Restart'):undefined;
    const start=restart??Array.from(el.querySelectorAll<HTMLButtonElement>(startSelector)).find(b=>!b.disabled);
    if(start){started=true;start.click();const url=new URL(window.location.href);url.searchParams.delete('play');window.history.replaceState(window.history.state,'',url.pathname+url.search+url.hash);}
   }
   if(!quick||started||ticks>30)clearInterval(interval);
  },60);
  const historyTimer=setTimeout(()=>{try{rememberGame(localStorage,slug);}catch{}},100);
  return()=>{clearInterval(interval);clearTimeout(historyTimer);el.removeEventListener('change',persist);el.removeEventListener('click',persist);};
 },[slug]);
 return <div ref={root}>{children}</div>;
}
