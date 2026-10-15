'use client';
import {useEffect} from 'react';
import {responsiveViewport} from '@/lib/responsive-viewport';

/** Keeps constrained editors and dialogs inside the visible browser/keyboard viewport. */
export function ResponsiveViewport(){
 useEffect(()=>{
  const root=document.documentElement,viewport=window.visualViewport;
  let frame=0,layoutHeight=window.innerHeight,layoutWidth=window.innerWidth;
  const update=()=>{
   frame=0;
   const active=document.activeElement;
   const editing=active instanceof HTMLElement&&(active.isContentEditable||active.matches('textarea,input:not([type=checkbox]):not([type=radio]):not([type=range]):not([type=color]):not([type=file]):not([type=button]):not([type=submit])'));
   if(!editing||Math.abs(window.innerWidth-layoutWidth)>40){layoutHeight=window.innerHeight;layoutWidth=window.innerWidth;}
   const state=responsiveViewport({width:window.innerWidth,height:Math.max(layoutHeight,window.innerHeight),visibleWidth:viewport?.width??window.innerWidth,visibleHeight:viewport?.height??window.innerHeight,offsetTop:viewport?.offsetTop,scale:viewport?.scale,editing});
   root.style.setProperty('--studio-viewport-height',state.height+'px');
   root.style.setProperty('--studio-viewport-top',state.top+'px');
   root.dataset.studioKeyboard=state.keyboard?'open':'closed';
   const header=document.querySelector<HTMLElement>('.studio-header.studio-shared');
   if(header)root.style.setProperty('--studio-header-bottom',Math.max(0,header.getBoundingClientRect().bottom)+'px');
  };
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(update);};
  const header=document.querySelector('.studio-header.studio-shared'),observer=new ResizeObserver(schedule);if(header)observer.observe(header);
  update();window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);window.addEventListener('orientationchange',schedule);
  viewport?.addEventListener('resize',schedule);viewport?.addEventListener('scroll',schedule);
  document.addEventListener('focusin',schedule);document.addEventListener('focusout',schedule);
  return()=>{cancelAnimationFrame(frame);observer.disconnect();window.removeEventListener('scroll',schedule);root.style.removeProperty('--studio-header-bottom');window.removeEventListener('resize',schedule);window.removeEventListener('orientationchange',schedule);viewport?.removeEventListener('resize',schedule);viewport?.removeEventListener('scroll',schedule);document.removeEventListener('focusin',schedule);document.removeEventListener('focusout',schedule);root.style.removeProperty('--studio-viewport-height');root.style.removeProperty('--studio-viewport-top');delete root.dataset.studioKeyboard;};
 },[]);
 return null;
}
