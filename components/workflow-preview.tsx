'use client';
import {useEffect,useMemo,useState} from 'react';
import Image from '@/components/browser-image';
import {Loader2,ChevronLeft,ChevronRight,RefreshCw} from 'lucide-react';
import {processPDF,loadFile,render,type Loaded,type PageItem,type Options,type Mark} from '@/lib/pdf-client';

let pending:Promise<unknown>=Promise.resolve();
function enqueue<T>(job:()=>Promise<T>){const next=pending.then(job,job);pending=next.catch(()=>{});return next;}
const noMarks:Mark[]=[];
type Request={files:Loaded[];pages:PageItem[];marks:Mark[];options:Options;retry:number};
type Snapshot={request:Request;progress:number;bytes?:Uint8Array;pages?:number;error?:string};

function PreviewPage({bytes,page}:{bytes:Uint8Array;page:number}){
 const [image,setImage]=useState<{bytes:Uint8Array;page:number;src:string}>(),[error,setError]=useState<{bytes:Uint8Array;page:number;message:string}>();
 useEffect(()=>{
  const controller=new AbortController();
  void render(bytes,page,1.25,undefined,0,controller.signal).then(canvas=>{
   try{if(!controller.signal.aborted)setImage({bytes,page,src:canvas.toDataURL('image/png')});}
   finally{canvas.width=0;canvas.height=0;}
  }).catch(e=>{if(!controller.signal.aborted)setError({bytes,page,message:e instanceof Error?e.message:'This page could not be previewed.'});});
  return()=>controller.abort();
 },[bytes,page]);
 const current=image?.bytes===bytes&&image.page===page?image:undefined;
 const failure=error?.bytes===bytes&&error.page===page?error:undefined;
 return <div className="workflow-result-sheet" aria-busy={!current&&!failure}>{current?<Image unoptimized width={612} height={792} src={current.src} alt={`Workflow preview, page ${page+1} with changes applied`} draggable={false} style={{height:'auto'}}/>:failure?<p role="alert">{failure.message}</p>:<span role="status"><Loader2 className="spin" size={24}/>Rendering page…</span>}</div>;
}

/** Disposable full-workflow output: the same engine as Create PDF, without a download or workspace mutation. */
export function WorkflowPreview({files,pages,marks=noMarks,options}:{files:Loaded[];pages:PageItem[];marks?:Mark[];options:Options}){
 const [retry,setRetry]=useState(0),[selectedPage,setSelectedPage]=useState(0),[snapshot,setSnapshot]=useState<Snapshot>();
 const request=useMemo(()=>({files,pages,marks,options,retry}),[files,pages,marks,options,retry]);
 useEffect(()=>{
  const controller=new AbortController();
  const timer=setTimeout(()=>{void enqueue(async()=>{
   controller.signal.throwIfAborted();
   setSnapshot({request,progress:0});
   const output=await processPDF('workflow',request.files,request.pages,request.marks,request.options,n=>{if(!controller.signal.aborted)setSnapshot({request,progress:n});},controller.signal);
   controller.signal.throwIfAborted();
   const file=await loadFile(new File([output.blob],'workflow-preview.pdf',{type:'application/pdf'}));
   controller.signal.throwIfAborted();
   setSnapshot({request,progress:100,bytes:file.bytes,pages:file.pages});
  }).catch(e=>{if(!controller.signal.aborted)setSnapshot({request,progress:0,error:e instanceof Error?e.message:'The workflow could not be previewed.'});});},400);
  return()=>{clearTimeout(timer);controller.abort();};
 },[request]);
 const current=snapshot?.request===request?snapshot:undefined;
 const count=current?.pages??0,page=Math.max(0,Math.min(selectedPage,count-1));
 return <div className="workflow-result-preview" aria-label="Workflow result preview">
  {current?.error?<div className="workflow-preview-message" role="alert"><p>{current.error}</p><button type="button" className="secondary" onClick={()=>setRetry(n=>n+1)}><RefreshCw size={16}/>Retry preview</button></div>:!current?.bytes?<div className="workflow-preview-message" role="status" aria-live="polite"><Loader2 className="spin" size={28}/><p>Applying your changes… {current?.progress??0}%</p><small>Your original PDFs stay unchanged.</small></div>:<><div className="workflow-preview-pages"><button type="button" className="secondary" aria-label="Previous workflow preview page" disabled={page===0} onClick={()=>setSelectedPage(page-1)}><ChevronLeft size={18}/><span>Previous</span></button><label>Page<select aria-label="Workflow preview page" value={page} onChange={e=>setSelectedPage(Number(e.target.value))}>{Array.from({length:count},(_,i)=><option key={i} value={i}>{i+1}</option>)}</select><span>of {count}</span></label><button type="button" className="secondary" aria-label="Next workflow preview page" disabled={page===count-1} onClick={()=>setSelectedPage(page+1)}><span>Next</span><ChevronRight size={18}/></button></div><div className="workflow-preview-paper"><PreviewPage bytes={current.bytes} page={page}/></div><p className="workflow-preview-caption">All enabled changes applied · {count} {count===1?'page':'pages'} · Original PDFs unchanged</p></>}
 </div>;
}
