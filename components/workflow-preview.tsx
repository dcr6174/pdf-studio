'use client';
import {useEffect,useMemo,useRef,useState} from 'react';
import Image from '@/components/browser-image';
import {Loader2,ChevronLeft,ChevronRight,RefreshCw} from 'lucide-react';
import {processPDF,loadFile,render,type Loaded,type PageItem,type Options,type Mark} from '@/lib/pdf-client';

let pending:Promise<unknown>=Promise.resolve();
function enqueue<T>(job:()=>Promise<T>){const next=pending.then(job,job);pending=next.catch(()=>{});return next;}
const noMarks:Mark[]=[];
type Request={files:Loaded[];pages:PageItem[];marks:Mark[];options:Options;retry:number};
type Snapshot={request:Request;progress:number;bytes?:Uint8Array;pages?:number;error?:string};

function PreviewPage({bytes,page,label}:{bytes:Uint8Array;page:number;label:string}){
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
 return <div className="workflow-result-sheet" aria-busy={!current&&!failure}>{current?<Image unoptimized width={612} height={792} src={current.src} alt={label} draggable={false} style={{height:'auto'}}/>:failure?<p role="alert">{failure.message}</p>:<span role="status"><Loader2 className="spin" size={24}/>Rendering page…</span>}</div>;
}
function PageControls({page,count,onChange,original=false}:{page:number;count:number;onChange:(page:number)=>void;original?:boolean}){
 const prefix=original?'original':'workflow';
 return <div className="workflow-preview-pages"><button type="button" className="secondary" aria-label={`Previous ${prefix} preview page`} disabled={page===0} onClick={()=>onChange(page-1)}><ChevronLeft size={18}/><span>Previous</span></button><label>Page<select aria-label={`${original?'Original':'Workflow'} preview page`} value={page} onChange={e=>onChange(Number(e.target.value))}>{Array.from({length:count},(_,i)=><option key={i} value={i}>{i+1}</option>)}</select><span>of {count}</span></label><button type="button" className="secondary" aria-label={`Next ${prefix} preview page`} disabled={page===count-1} onClick={()=>onChange(page+1)}><span>Next</span><ChevronRight size={18}/></button></div>;
}
/** Originals render directly. Changes use a disposable output from the same engine as Run workflow. */
export function WorkflowPreview({files,pages,marks=noMarks,options,initialView='changes',issue}:{files:Loaded[];pages:PageItem[];marks?:Mark[];options:Options;initialView?:'original'|'changes';issue?:string}){
 const [view,setView]=useState(initialView),[retry,setRetry]=useState(0),[selectedPage,setSelectedPage]=useState(0),[selectedOriginalPage,setSelectedOriginalPage]=useState(0),[selectedFile,setSelectedFile]=useState(''),[snapshot,setSnapshot]=useState<Snapshot>();
 const cached=useRef<Snapshot|undefined>(undefined);
 const request=useMemo(()=>({files,pages,marks,options,retry}),[files,pages,marks,options,retry]);
 const mode=issue?'original':view;
 useEffect(()=>{
  if(mode!=='changes'||cached.current?.request===request&&cached.current.bytes)return;
  const controller=new AbortController();
  const timer=setTimeout(()=>{void enqueue(async()=>{
   controller.signal.throwIfAborted();
   setSnapshot({request,progress:0});
   const output=await processPDF('workflow',request.files,request.pages,request.marks,request.options,n=>{if(!controller.signal.aborted)setSnapshot({request,progress:n});},controller.signal);
   controller.signal.throwIfAborted();
   const file=await loadFile(new File([output.blob],'workflow-preview.pdf',{type:'application/pdf'}));
   controller.signal.throwIfAborted();
   const result={request,progress:100,bytes:file.bytes,pages:file.pages};
   cached.current=result;setSnapshot(result);
  }).catch(e=>{if(!controller.signal.aborted)setSnapshot({request,progress:0,error:e instanceof Error?e.message:'The workflow could not be previewed.'});});},400);
  return()=>{clearTimeout(timer);controller.abort();};
 },[request,mode]);
 const current=snapshot?.request===request?snapshot:undefined;
 const count=current?.pages??0,page=Math.max(0,Math.min(selectedPage,count-1));
 const sourceFiles=files.filter(f=>!f.readerOnly&&f.pages>0),source=sourceFiles.find(f=>f.id===selectedFile)??sourceFiles[0];
 const originalPage=Math.max(0,Math.min(selectedOriginalPage,(source?.pages??1)-1));
 return <div className="workflow-result-preview" aria-label="PDF preview">
  <div className="workflow-preview-modes" role="group" aria-label="Choose PDF preview"><button type="button" aria-pressed={mode==='original'} onClick={()=>setView('original')}>Original PDF</button><button type="button" aria-pressed={mode==='changes'} disabled={!!issue} title={issue||'See all enabled workflow changes'} onClick={()=>setView('changes')}>With changes</button></div>
  {mode==='original'?source?<>{sourceFiles.length>1&&<label className="workflow-preview-file">File<select aria-label="Original PDF file" value={source.id} onChange={e=>{setSelectedFile(e.target.value);setSelectedOriginalPage(0);}}>{sourceFiles.map(f=><option key={f.id} value={f.id}>{f.name}</option>)}</select></label>}<PageControls original page={originalPage} count={source.pages} onChange={setSelectedOriginalPage}/><div className="workflow-preview-paper"><PreviewPage bytes={source.bytes} page={originalPage} label={`Original PDF, page ${originalPage+1} of ${source.name}`}/></div><p className="workflow-preview-caption">{source.name} · Original file, unchanged</p></>:<div className="workflow-preview-message" role="status">Choose a PDF to preview it.</div>:current?.error?<div className="workflow-preview-message" role="alert"><p>{current.error}</p><button type="button" className="secondary" onClick={()=>setRetry(n=>n+1)}><RefreshCw size={16}/>Retry preview</button></div>:!current?.bytes?<div className="workflow-preview-message" role="status" aria-live="polite"><Loader2 className="spin" size={28}/><p>Applying your changes… {current?.progress??0}%</p><small>Your original PDFs stay unchanged.</small></div>:<><PageControls page={page} count={count} onChange={setSelectedPage}/><div className="workflow-preview-paper"><PreviewPage bytes={current.bytes} page={page} label={`Workflow preview, page ${page+1} with changes applied`}/></div><p className="workflow-preview-caption">All enabled changes applied · {count} {count===1?'page':'pages'} · Original PDFs unchanged</p></>}
 </div>;
}
