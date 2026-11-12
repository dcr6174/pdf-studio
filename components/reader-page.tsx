'use client';
import {useEffect,useRef,useState} from 'react';
import type {PDFDocumentProxy} from 'pdfjs-dist';
import {acquireReaderRender} from '@/lib/reader-render-queue';
import {safeLink} from '@/lib/page-geometry';

/** A fresh canvas per render prevents PDF.js cancellation races on rapid zoom. */
export function ReaderPage({document,page,width,zoom,rotation,onText,onError,onPage,fit='width',thumbnail=false}:{document:PDFDocumentProxy;page:number;width:number;zoom:number;rotation:number;fit?:'width'|'page';thumbnail?:boolean;onText:(text:string)=>void;onError:(message:string)=>void;onPage:(page:number)=>void}){
 const host=useRef<HTMLDivElement>(null);
 const [visible,setVisible]=useState(false),[reservedHeight,setReservedHeight]=useState(0);
 useEffect(()=>{const element=host.current;if(!element)return;const observer=new IntersectionObserver(entries=>setVisible(entries[0].isIntersecting),{rootMargin:"900px 0px"});observer.observe(element);return()=>observer.disconnect();},[]);
 useEffect(()=>{let active=true;const cancel=new AbortController();let release:(()=>void)|undefined;let renderTask:{cancel:()=>void;promise:Promise<unknown>}|undefined;let textLayer:{cancel:()=>void}|undefined;
 const root=host.current;if(!root||!visible)return;
 // The previous canvas stays on screen until its replacement is ready: no
 // white flash while a zoom, rotation or page change re-renders underneath.
 void(async()=>{try{
 // Never raster mid-fling: while the reader scroller is moving, page renders
 // wait for a 140ms quiet patch, keeping the main thread free for scrolling.
 const scroller=root.closest('.reader-page');
 if(scroller&&!thumbnail){
  let lastScroll=0;const onScroll=()=>{lastScroll=performance.now();};
  scroller.addEventListener('scroll',onScroll,{passive:true});
  try{
   await new Promise<void>(resolve=>requestAnimationFrame(()=>resolve()));
   while(active&&lastScroll&&performance.now()-lastScroll<140)await new Promise<void>(resolve=>setTimeout(resolve,60));
  }finally{scroller.removeEventListener('scroll',onScroll);}
  if(!active)return;
 }
 release=await acquireReaderRender(cancel.signal);const p=await document.getPage(page);if(!active)return;
 const angle=(p.rotate+rotation)%360,base=p.getViewport({scale:1,rotation:angle});
 const widthScale=Math.max(.1,(width-24)/base.width);const requested=Math.min(2,fit==='page'?Math.min(widthScale,Math.max(200,window.innerHeight-200)/base.height):widthScale)*zoom;
 const scale=Math.min(requested,Math.sqrt(4000000/(base.width*base.height)));
 const view=p.getViewport({scale,rotation:angle});setReservedHeight(view.height);
 const canvas=window.document.createElement('canvas');canvas.width=Math.ceil(view.width);canvas.height=Math.ceil(view.height);canvas.setAttribute('aria-label',`PDF page ${page}`);
 root.style.width=`${view.width}px`;root.style.height=`${view.height}px`;
 if(!active)return;root.replaceChildren();root.appendChild(canvas);
 const ctx=canvas.getContext('2d');if(!ctx)throw new Error('Canvas is unavailable.');
 renderTask=p.render({canvasContext:ctx,viewport:view});await renderTask.promise;release();release=undefined;if(!active||thumbnail)return;
 // The page is on screen. The selection layer and link annotations are
 // invisible, so they build in idle time instead of competing with scrolling.
 await new Promise<void>(resolve=>{const w=window as Window&{requestIdleCallback?:(cb:()=>void)=>number};if(typeof w.requestIdleCallback==='function')w.requestIdleCallback(()=>resolve());else window.setTimeout(resolve,32);});
 if(!active)return;
 const content=await p.getTextContent();if(!active)return;onText(content.items.map(i=>'str' in i?i.str:'').join(' '));
 const layer=window.document.createElement('div');layer.className='reader-text-layer';layer.style.setProperty('--scale-factor',String(scale));root.appendChild(layer);
 const pdfjs=await import('pdfjs-dist');if(!active)return;
 const selection=new pdfjs.TextLayer({textContentSource:content,container:layer,viewport:view});textLayer=selection;await selection.render();if(!active)return;
 const annotations=await p.getAnnotations({intent:'display'});if(!active)return;
 for(const a of annotations){if(a.subtype!=='Link'||!Array.isArray(a.rect))continue;const url=typeof a.url==='string'?safeLink(a.url):undefined;if(!url&&!a.dest)continue;
 const rect=view.convertToViewportRectangle(a.rect);const link=window.document.createElement(url?'a':'button');
 link.className='reader-pdf-link';link.setAttribute('aria-label',url?`Open link: ${url}`:'Go to linked PDF page');
 Object.assign(link.style,{left:`${Math.min(rect[0],rect[2])}px`,top:`${Math.min(rect[1],rect[3])}px`,width:`${Math.abs(rect[2]-rect[0])}px`,height:`${Math.abs(rect[3]-rect[1])}px`});
 if(url){const anchor=link as HTMLAnchorElement;anchor.href=url;anchor.target='_blank';anchor.rel='noopener noreferrer';}
 else{(link as HTMLButtonElement).type='button';link.onclick=()=>{void(async()=>{try{const dest=typeof a.dest==='string'?await document.getDestination(a.dest):a.dest;if(!Array.isArray(dest))return;const n=typeof dest[0]==='number'?dest[0]:await document.getPageIndex(dest[0]);if(active)onPage(n+1);}catch{if(active)onError('This PDF link has an unsupported destination.');}})();};}root.appendChild(link);
 }
 }catch(e){if(active&&!(e instanceof Error&&e.name==='RenderingCancelledException'))onError('This page could not render. Try another page.');}finally{release?.();}})();
 return()=>{active=false;cancel.abort();renderTask?.cancel();textLayer?.cancel();};
 },[document,page,width,zoom,rotation,onText,onError,onPage,visible,fit,thumbnail]);
 // Pages scrolled out of view release their canvas memory; visible pages keep
 // their current frame until a re-render replaces it (no white flash).
 useEffect(()=>{if(!visible&&host.current)host.current.replaceChildren();},[visible]);
 return <div ref={host} className="reader-page-surface" style={{minHeight:reservedHeight||Math.max(180,width*1.3)}}/>;
}
