'use client';
import {useEffect,useRef,type ElementType,type HTMLAttributes,type ReactNode} from 'react';

type Props={
 as?:ElementType;
 /** CSS selector for the items the highlight can sit behind. */
 item:string;
 /** hover: follows the pointer or keyboard focus between items (fades out when you leave).
  *  selected: stays behind the item matching `item` (use with aria-pressed / aria-current). */
 mode?:'hover'|'selected';
 className?:string;
 children:ReactNode;
}&Omit<HTMLAttributes<HTMLElement>,'className'|'children'>;

/**
 * One soft highlight that glides from item to item instead of every item flashing on its own.
 * - Mouse and pen only (touch has no hover); keyboard focus moves it too, so it never depends on a mouse.
 * - Pure transform/size transitions, so it stays smooth; reduced-motion users get an instant jump (CSS).
 * - Without JavaScript the items keep a plain :hover/.selected style (see studio-refresh.css).
 * The highlight is decorative (aria-hidden) and never receives pointer events.
 */
export function Spotlight({as:Tag='div',item,mode='hover',className,children,...rest}:Props){
 const root=useRef<HTMLElement>(null),bar=useRef<HTMLSpanElement>(null);
 useEffect(()=>{
  const el=root.current,b=bar.current;if(!el||!b)return;
  let current:HTMLElement|null=null,visible=false,raf=0;
  const place=(target:HTMLElement,instant:boolean)=>{
   const r=el.getBoundingClientRect(),t=target.getBoundingClientRect();
   if(instant)b.dataset.instant='true';
   b.style.width=t.width+'px';b.style.height=t.height+'px';
   b.style.transform=`translate3d(${t.left-r.left-el.clientLeft+el.scrollLeft}px,${t.top-r.top-el.clientTop+el.scrollTop}px,0)`;
   if(instant){void b.offsetWidth;delete b.dataset.instant;}
  };
  const mark=(next:HTMLElement|null)=>{if(current&&current!==next)delete current.dataset.spot;current=next;if(next)next.dataset.spot='true';};
  const show=(target:HTMLElement)=>{
   if(target===current&&visible)return;
   const first=!visible;
   place(target,first);mark(target);
   b.dataset.on='true';visible=true;
  };
  const hide=()=>{if(mode!=='hover')return;visible=false;delete b.dataset.on;mark(null);};
  const find=(node:EventTarget|null)=>{const t=(node as Element|null)?.closest?.(item) as HTMLElement|null;return t&&el.contains(t)?t:null;};

  const cleanups:(()=>void)[]=[];
  if(mode==='hover'){
   const over=(e:PointerEvent)=>{if(e.pointerType==='touch')return;const t=find(e.target);if(t)show(t);};
   const focus=(e:FocusEvent)=>{const t=find(e.target);if(t&&(e.target as HTMLElement).matches(':focus-visible'))show(t);};
   const leave=()=>hide();
   const blur=(e:FocusEvent)=>{if(!el.contains(e.relatedTarget as Node|null))hide();};
   el.addEventListener('pointerover',over);el.addEventListener('pointerleave',leave);el.addEventListener('focusin',focus);el.addEventListener('focusout',blur);
   // Items can be filtered away while hovered; drop the highlight if its item is gone.
   const mo=new MutationObserver(()=>{if(current&&!current.isConnected)hide();});mo.observe(el,{childList:true,subtree:true});
   cleanups.push(()=>{el.removeEventListener('pointerover',over);el.removeEventListener('pointerleave',leave);el.removeEventListener('focusin',focus);el.removeEventListener('focusout',blur);mo.disconnect();});
  }else{
   const sync=(instant:boolean)=>{
    cancelAnimationFrame(raf);
    raf=requestAnimationFrame(()=>{
     const t=el.querySelector<HTMLElement>(item);
     if(!t){delete b.dataset.on;visible=false;return;}
     const first=!visible;place(t,instant||first);b.dataset.on='true';visible=true;el.dataset.spReady='true';
    });
   };
   sync(true);
   const mo=new MutationObserver(()=>sync(false));mo.observe(el,{attributes:true,attributeFilter:['aria-pressed','aria-current','aria-selected','class'],subtree:true,childList:true});
   const ro=new ResizeObserver(()=>sync(true));ro.observe(el);
   document.fonts?.ready.then(()=>sync(true)).catch(()=>{});
   cleanups.push(()=>{mo.disconnect();ro.disconnect();cancelAnimationFrame(raf);});
  }
  if(mode==='hover')el.dataset.spReady='true';
  return()=>{cleanups.forEach(fn=>fn());mark(null);delete el.dataset.spReady;};
 },[item,mode]);
 return <Tag ref={root} className={'spotlight '+(className??'')} data-spotlight={mode} {...rest}><span ref={bar} className="spotlight-bar" aria-hidden="true"/>{children}</Tag>;
}
