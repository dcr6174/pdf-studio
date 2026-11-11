'use client';
import {useEffect} from 'react';
const selector='button.primary,a.primary,button.secondary,a.secondary,.np-run,.hx-drop-btn,[data-slot=button]:not([data-variant=link])';
/** One delegated listener; no per-button animation state or progress re-renders. */
export function ButtonFeedback(){
 useEffect(()=>{
  const active=new Set<HTMLElement>();
  function ripple(event:PointerEvent|KeyboardEvent){
   if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
   if(event instanceof KeyboardEvent&&(event.repeat||!['Enter',' '].includes(event.key)))return;
   if(event instanceof PointerEvent&&event.button!==0)return;
   const target=event.target instanceof Element?event.target.closest<HTMLElement>(selector):null;
   if(!target||target.matches(':disabled,[aria-disabled=true]')||target.classList.contains('danger'))return;
   const box=target.getBoundingClientRect(),pointer=event instanceof PointerEvent;
   const x=pointer?event.clientX-box.left:box.width/2,y=pointer?event.clientY-box.top:box.height/2;
   const size=Math.hypot(box.width,box.height)*2;
   const layer=document.createElement('span');layer.className='md-button-ripple';layer.setAttribute('aria-hidden','true');
   Object.assign(layer.style,{width:size+'px',height:size+'px',left:(x-size/2)+'px',top:(y-size/2)+'px'});
   target.appendChild(layer);active.add(layer);
   const animation=layer.animate([{transform:'scale(0)',opacity:.12},{transform:'scale(1)',opacity:0}],{duration:500,easing:'cubic-bezier(.2,0,0,1)'});
   const remove=()=>{layer.remove();active.delete(layer);};animation.finished.then(remove,remove);
  }
  document.addEventListener('pointerdown',ripple);document.addEventListener('keydown',ripple);
  return()=>{document.removeEventListener('pointerdown',ripple);document.removeEventListener('keydown',ripple);for(const layer of active)layer.remove();};
 },[]);
 return null;
}
