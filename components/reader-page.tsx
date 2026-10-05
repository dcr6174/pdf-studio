'use client';
import {useEffect,useRef} from 'react';
import type {PDFDocumentProxy} from 'pdfjs-dist';
import {safeLink} from '@/lib/page-geometry';

/** A fresh canvas per render prevents PDF.js cancellation races on rapid zoom. */
export function ReaderPage({document,page,width,zoom,rotation,onText,onError,onPage}:{document:PDFDocumentProxy;page:number;width:number;zoom:number;rotation:number;onText:(text:string)=>void;onError:(message:string)=>void;onPage:(page:number)=>void}){
 const host=useRef<HTMLDivElement>(null);
 useEffect(()=>{let active=true;let renderTask:{cancel:()=>void;promise:Promise<unknown>}|undefined;let textLayer:{cancel:()=>void}|undefined;
 const root=host.current;if(!root)return;root.replaceChildren();
 void(async()=>{try{
 const p=await document.getPage(page);if(!active)return;
 const angle=(p.rotate+rotation)%360,base=p.getViewport({scale:1,rotation:angle});
 const requested=Math.min(2,Math.max(.25,(width-24)/base.width))*zoom;
 const scale=Math.min(requested,Math.sqrt(4000000/(base.width*base.height)));
 const view=p.getViewport({scale,rotation:angle});
 const canvas=window.document.createElement('canvas');canvas.width=Math.ceil(view.width);canvas.height=Math.ceil(view.height);canvas.setAttribute('aria-label',`PDF page ${page}`);
 root.style.width=`${view.width}px`;root.style.height=`${view.height}px`;root.appendChild(canvas);
 const ctx=canvas.getContext('2d');if(!ctx)throw new Error('Canvas is unavailable.');
 renderTask=p.render({canvasContext:ctx,viewport:view});await renderTask.promise;if(!active)return;
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
 }catch(e){if(active&&!(e instanceof Error&&e.name==='RenderingCancelledException'))onError('This page could not render. Try another page.');}})();
 return()=>{active=false;renderTask?.cancel();textLayer?.cancel();root.replaceChildren();};
 },[document,page,width,zoom,rotation,onText,onError,onPage]);
 return <div ref={host} className="reader-page-surface"/>;
}
