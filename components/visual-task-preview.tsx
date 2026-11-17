'use client';
import Image from '@/components/browser-image';
import {useEffect,useRef,useState} from 'react';
import {previewPDF,renderer,render,type Loaded,type PageItem,type Options} from '@/lib/pdf-client';
export const sourcePreviewTools=['remove-attachments','remove-links','remove-bookmarks','remove-annotations','split-chapters','blank-check','bookmarks','split','webp','jpg','png','compress','reverse','duplicate','split-all'];
export const visualPreviewTools=['crop','nup','numbers','bates','headers','flip','grayscale','invert','rotate','halve','viewer',...sourcePreviewTools];
let queue:Promise<unknown>=Promise.resolve();
function enqueue<T>(job:()=>Promise<T>){const next=queue.then(job,job);queue=next.catch(()=>{});return next;}
function Sheet({view,files,items,options,offset,total,onRotate}:{view:string;files:Loaded[];items:PageItem[];options:Options;offset:number;total:number;onRotate?:()=>void}){
 const root=useRef<HTMLDivElement>(null);const [visible,setVisible]=useState(false);
 const [images,setImages]=useState<string[]>([]);const [error,setError]=useState('');const [busy,setBusy]=useState(true);const [retry,setRetry]=useState(0);
 const key=items.map(p=>p.id+':'+p.rotation).join(',');
 useEffect(()=>{const node=root.current;if(!node)return;const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{rootMargin:'200px'});observer.observe(node);return()=>observer.disconnect();},[]);
 useEffect(()=>{
  if(!visible)return;
  const controller=new AbortController();queueMicrotask(()=>{if(!controller.signal.aborted){setBusy(true);setError('');}});
  const timer=setTimeout(()=>{enqueue(async()=>{
   controller.signal.throwIfAborted();
   const selectedFiles=files.filter(f=>items.some(p=>p.fileId===f.id));
   const output=await previewPDF(view,selectedFiles,items,options,offset,total,controller.signal);
   controller.signal.throwIfAborted();
   const bytes=new Uint8Array(await output.blob.arrayBuffer());
   const doc=await renderer(bytes);const count=doc.numPages;await doc.destroy();
   const urls:string[]=[];
   for(let i=0;i<count;i++){const canvas=await render(bytes,i,1.15,undefined,0,controller.signal);try{urls.push(canvas.toDataURL('image/jpeg',.9));}finally{canvas.width=0;canvas.height=0;}}
   controller.signal.throwIfAborted();setImages(urls);setBusy(false);
  }).catch(err=>{if(!controller.signal.aborted){setError(err instanceof Error?err.message:'Preview failed.');setBusy(false);}});},300);
  return()=>{clearTimeout(timer);controller.abort();};
 // Page identity includes order and rotation; options trigger a fresh disposable preview.
 },[visible,view,files,key,items,options,offset,total,retry]);
 return <div ref={root} data-preview-offset={offset} className="visual-preview-sheet" data-reader-columns={view==='viewer'?options.columns:undefined} aria-busy={busy}>
  <div className="visual-preview-status" role="status">{sourcePreviewTools.includes(view)?'Source page '+(offset+1)+' of '+total+' · inspect changes after export':busy?'Updating preview…':view==='nup'?'Sheet '+(Math.floor(offset/(Number(options.columns)||2))+1):'Page '+(offset+1)+' of '+total}</div>
  {view==='rotate'&&onRotate&&<button type="button" className="secondary" onClick={onRotate}>Rotate this page 90°</button>}
  {error?<div role="alert" className="visual-preview-error">{error}<button onClick={()=>setRetry(n=>n+1)}>Retry preview</button></div>:images.length?images.map((src,i)=><Image unoptimized width={612} height={792} key={i} src={src} alt={'PDF preview, page '+(offset+1)+(images.length>1?', part '+(i+1):'')} />):<div className="visual-preview-placeholder"/>}
 </div>;
}
function parseRange(text:string,max:number){const set=new Set<number>();for(const part of text.split(',')){const m=/^\s*(\d+)\s*(?:-\s*(\d+))?\s*$/.exec(part);if(!m)continue;const a=Number(m[1]),b=m[2]?Number(m[2]):a;for(let i=Math.max(1,Math.min(a,b));i<=Math.min(max,Math.max(a,b));i++)set.add(i);}return set;}
function formatRange(set:Set<number>){const n=[...set].sort((a,b)=>a-b),out:string[]=[];for(let i=0;i<n.length;){let j=i;while(j+1<n.length&&n[j+1]===n[j]+1)j++;out.push(j>i?n[i]+'-'+n[j]:String(n[i]));i=j+1;}return out.join(', ');}
export function VisualTaskPreview({view,files,pages,options,currentPageId,onPage,mobile,onRotatePage,tapRange,onTapRange}:{tapRange?:string;onTapRange?:(value:string)=>void;view:string;files:Loaded[];pages:PageItem[];options:Options;currentPageId:string;onPage:(id:string)=>void;mobile:boolean;onRotatePage?:(id:string)=>void}){
 const scroll=useRef<HTMLDivElement>(null);
 const size=['nup','viewer'].includes(view)?Number(options.columns)||2:1;
 const active=Math.max(0,pages.findIndex(p=>p.id===currentPageId));const group=Math.floor(active/size);
 useEffect(()=>{const frame=requestAnimationFrame(()=>{const host=scroll.current,target=host?.querySelector<HTMLElement>(`[data-preview-offset="${group*size}"]`);if(host&&target)host.scrollTop+=target.getBoundingClientRect().top-host.getBoundingClientRect().top;});return()=>cancelAnimationFrame(frame);},[group,size]);
 const offsets=Array.from({length:Math.ceil(pages.length/size)},(_,i)=>i*size);
 return <section className="visual-main-preview" aria-label="Document preview">
 {!mobile&&<div className="visual-preview-navigation"><button aria-label="Previous preview page" disabled={group===0} onClick={()=>onPage(pages[(group-1)*size].id)}>‹</button><span>{view==='nup'?'Sheet':'Page'} {group+1} of {Math.ceil(pages.length/size)}</span><button aria-label="Next preview page" disabled={(group+1)*size>=pages.length} onClick={()=>onPage(pages[(group+1)*size].id)}>›</button></div>}
 <div ref={scroll} className="visual-preview-scroll" role="region" aria-label="Scrollable document preview" tabIndex={0}>{offsets.map(offset=>{const sheet=<Sheet key={view+':'+offset} view={view} files={files} items={pages.slice(offset,offset+size)} options={options} offset={offset} total={pages.length} onRotate={onRotatePage?()=>onRotatePage(pages[offset].id):undefined}/>;
  if(!onTapRange)return sheet;
  const chosen=parseRange(tapRange||'',pages.length),on=chosen.has(offset+1);
  return <div key={view+':'+offset} role="button" tabIndex={0} aria-pressed={on} aria-label={'Page '+(offset+1)+(on?', selected':', not selected')} className={'split-tap-page'+(on?' is-selected':'')} onClick={()=>{const next=new Set(chosen);if(on)next.delete(offset+1);else next.add(offset+1);onTapRange(formatRange(next));}} onKeyDown={e=>{if(e.key===' '||e.key==='Enter'){e.preventDefault();e.currentTarget.click();}}}>{sheet}{on&&<span className="split-tap-check" aria-hidden="true">✓</span>}</div>;})}</div>
 </section>;
}

