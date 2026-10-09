'use client';
import {useEffect,useState} from 'react';
import Image from '@/components/browser-image';
import {render,type Loaded} from '@/lib/pdf-client';
import {ChevronLeft,ChevronRight,MoveHorizontal} from 'lucide-react';

/** Read-only, optional view. It never changes files, page order or download bytes. */
export function PDFSwipeComparison({original,revised}:{original:Loaded;revised:Loaded}){
 const [open,setOpen]=useState(false);
 return <details className="pdf-swipe-disclosure" onToggle={e=>setOpen(e.currentTarget.open)}><summary><MoveHorizontal size={18} aria-hidden="true"/>Swipe comparison <span>Optional</span></summary><p>Slide across the same page number in both files. This is a visual comparison, not an automatic difference detector. Different page sizes are fitted inside the same frame.</p>{open&&<SwipePages key={original.id+revised.id} original={original} revised={revised}/>}</details>;
}
function SwipePages({original,revised}:{original:Loaded;revised:Loaded}){
 const count=Math.min(original.pages,revised.pages);
 const [page,setPage]=useState(0),[position,setPosition]=useState(50),[preview,setPreview]=useState<{page:number;before:string;after:string;ratio:number}>(),[error,setError]=useState('');
 useEffect(()=>{
  const controller=new AbortController();
  void(async()=>{let first:HTMLCanvasElement|undefined,second:HTMLCanvasElement|undefined;
   try{
    first=await render(original.bytes,page,1.2,undefined,0,controller.signal);
    second=await render(revised.bytes,page,1.2,undefined,0,controller.signal);
    if(!controller.signal.aborted){setPreview({page,before:first.toDataURL('image/png'),after:second.toDataURL('image/png'),ratio:first.width/first.height});setError('');}
   }catch{if(!controller.signal.aborted)setError('Swipe preview unavailable. Use the original side-by-side previews below.');}
   finally{if(first){first.width=0;first.height=0;}if(second){second.width=0;second.height=0;}}
  })();return()=>controller.abort();
 },[original.bytes,revised.bytes,page]);
 const current=preview?.page===page?preview:undefined;
 return <div className="pdf-swipe-pages"><div className="pdf-swipe-navigation"><button type="button" aria-label="Previous comparison page" disabled={page===0} onClick={()=>setPage(p=>p-1)}><ChevronLeft size={18}/></button><span>Page {page+1} / {count}</span><button type="button" aria-label="Next comparison page" disabled={page>=count-1} onClick={()=>setPage(p=>p+1)}><ChevronRight size={18}/></button></div>{error?<p role="status">{error}</p>:current?<><div className="pdf-swipe-frame" style={{aspectRatio:current.ratio}}><div className="pdf-swipe-image"><Image unoptimized src={current.after} width={1000} height={1400} alt={`Revised PDF, page ${page+1}`} draggable={false}/></div><div className="pdf-swipe-image pdf-swipe-before" style={{clipPath:`inset(0 ${100-position}% 0 0)`}}><Image unoptimized src={current.before} width={1000} height={1400} alt={`Original PDF, page ${page+1}`} draggable={false}/></div><span className="pdf-swipe-label pdf-swipe-original">Original</span><span className="pdf-swipe-label pdf-swipe-revised">Revised</span><span className="pdf-swipe-divider" style={{left:position+'%'}} aria-hidden="true"><MoveHorizontal size={22}/></span><input className="pdf-swipe-range" type="range" min="0" max="100" step="1" value={position} onChange={e=>setPosition(Number(e.target.value))} aria-label="Original versus revised comparison" aria-valuetext={`${position}% original, ${100-position}% revised`}/></div><p className="pdf-swipe-hint">Drag the handle, or focus it and use the arrow keys.</p></>:<p role="status">Opening comparison page…</p>}{original.pages!==revised.pages&&<p className="pdf-swipe-hint">{count} paired pages. Extra pages remain visible in the side-by-side previews below.</p>}</div>;
}
