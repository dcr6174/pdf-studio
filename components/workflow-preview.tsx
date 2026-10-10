'use client';
import {useEffect,useMemo,useRef,useState,type CSSProperties} from 'react';
import {PdfCropEditor,type WorkflowCropControl} from './pdf-crop-editor';
import Image from '@/components/browser-image';
import {pageGeometry} from '@/lib/page-geometry';
import {Loader2,ChevronLeft,ChevronRight,RefreshCw,Rows3,ZoomIn,ZoomOut,File as FileIcon} from 'lucide-react';
import {processPDF,loadFile,render,type Loaded,type PageItem,type Options,type Mark} from '@/lib/pdf-client';

let pending:Promise<unknown>=Promise.resolve();
function enqueue<T>(job:()=>Promise<T>){const next=pending.then(job,job);pending=next.catch(()=>{});return next;}
const noMarks:Mark[]=[];
type Request={files:Loaded[];pages:PageItem[];marks:Mark[];options:Options;retry:number};
type Snapshot={request:Request;progress:number;bytes?:Uint8Array;pages?:number;ratios?:number[];cropPage?:{width:number;height:number;rotation:number};error?:string};

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
function ScrollPage({bytes,page,label,ratio=3/4}:{bytes:Uint8Array;page:number;label:string;ratio?:number}){
 const ref=useRef<HTMLDivElement>(null),[visible,setVisible]=useState(false);
 useEffect(()=>{const node=ref.current;if(!node)return;const observer=new IntersectionObserver(entries=>setVisible(entries[0]?.isIntersecting??false),{root:node.closest('.workflow-preview-paper'),rootMargin:'400px'});observer.observe(node);return()=>observer.disconnect();},[]);
 return <div ref={ref} className="workflow-scroll-page"><small>Page {page+1}</small><div className="workflow-scroll-sheet" style={{aspectRatio:ratio}}>{visible?<PreviewPage bytes={bytes} page={page} label={label}/>:<div className="workflow-page-placeholder" aria-label={`Page ${page+1}`}/>}</div></div>;
}
function PreviewLayout({scroll,onChange}:{scroll:boolean;onChange:(value:boolean)=>void}){
 return <div className="workflow-preview-layout" role="group" aria-label="Preview layout"><button type="button" aria-label="Single page review" title="Single page review" aria-pressed={!scroll} onClick={()=>onChange(false)}><FileIcon size={17}/></button><button type="button" aria-label="Scroll through pages" title="Scroll through pages" aria-pressed={scroll} onClick={()=>onChange(true)}><Rows3 size={17}/></button></div>;
}
function PageControls({page,count,onChange,original=false}:{page:number;count:number;onChange:(page:number)=>void;original?:boolean}){
 const prefix=original?'original':'workflow';
 return <div className="workflow-preview-pages"><button type="button" className="secondary" aria-label={`Previous ${prefix} preview page`} disabled={page===0} onClick={()=>onChange(page-1)}><ChevronLeft size={18}/><span>Previous</span></button><label>Page<select aria-label={`${original?'Original':'Workflow'} preview page`} value={page} onChange={e=>onChange(Number(e.target.value))}>{Array.from({length:count},(_,i)=><option key={i} value={i}>{i+1}</option>)}</select><span>of {count}</span></label><button type="button" className="secondary" aria-label={`Next ${prefix} preview page`} disabled={page===count-1} onClick={()=>onChange(page+1)}><span>Next</span><ChevronRight size={18}/></button></div>;
}
/** Originals render directly. Changes use a disposable output from the same engine as Run workflow. */
export function WorkflowPreview({files,pages,marks=noMarks,options,initialView='changes',issue,crop}:{files:Loaded[];pages:PageItem[];marks?:Mark[];options:Options;initialView?:'original'|'changes';issue?:string;crop?:WorkflowCropControl}){
 const [view,setView]=useState(initialView),[scroll,setScroll]=useState(true),[zoom,setZoom]=useState(1),[retry,setRetry]=useState(0),[selectedPage,setSelectedPage]=useState(0),[selectedOriginalPage,setSelectedOriginalPage]=useState(0),[selectedFile,setSelectedFile]=useState(''),[snapshot,setSnapshot]=useState<Snapshot>();
 const cached=useRef<Snapshot|undefined>(undefined);
 const cropIndex=crop?(options.workflowSteps??[]).indexOf('crop'):-1;
 const previewKey=JSON.stringify(cropIndex>=0?{...options,workflowSteps:options.workflowSteps?.slice(0,cropIndex),workflowSettings:options.workflowSettings?.slice(0,cropIndex),workflowDisabled:options.workflowDisabled?.filter(i=>i<cropIndex)}:options);
 const previewOptions=useMemo(()=>JSON.parse(previewKey) as Options,[previewKey]);
 const request=useMemo(()=>({files,pages,marks,options:previewOptions,retry}),[files,pages,marks,previewOptions,retry]);
 const mode=crop?'changes':issue?'original':view;
 useEffect(()=>{
  if(mode!=='changes'||cached.current?.request===request&&cached.current.bytes)return;
  const controller=new AbortController();
  const timer=setTimeout(()=>{void enqueue(async()=>{
   controller.signal.throwIfAborted();
   setSnapshot({request,progress:0});
   const output=await processPDF(request.options.workflowSteps?.length?'workflow':'merge',request.files,request.pages,request.marks,request.options,n=>{if(!controller.signal.aborted)setSnapshot({request,progress:n});},controller.signal);
   controller.signal.throwIfAborted();
   const file=await loadFile(new File([output.blob],'workflow-preview.pdf',{type:'application/pdf'}));
   controller.signal.throwIfAborted();
   const result={request,progress:100,bytes:file.bytes,pages:file.pages,cropPage:file.doc?{...file.doc.getPage(0).getCropBox(),rotation:file.doc.getPage(0).getRotation().angle}:undefined,ratios:file.doc?.getPages().map(page=>{const g=pageGeometry(page);return g.width/g.height;})};
   cached.current=result;setSnapshot(result);
  }).catch(e=>{if(!controller.signal.aborted)setSnapshot({request,progress:0,error:e instanceof Error?e.message:'The workflow could not be previewed.'});});},400);
  return()=>{clearTimeout(timer);controller.abort();};
 },[request,mode]);
 const current=snapshot?.request===request?snapshot:undefined;
 const count=current?.pages??0,page=Math.max(0,Math.min(selectedPage,count-1));
 const sourceFiles=files.filter(f=>!f.readerOnly&&f.pages>0),source=sourceFiles.find(f=>f.id===selectedFile)??sourceFiles[0];
 const originalPage=Math.max(0,Math.min(selectedOriginalPage,(source?.pages??1)-1));
 if(crop)return <div className="workflow-crop-review">{current?.bytes&&current.cropPage?<PdfCropEditor bytes={current.bytes} {...current.cropPage} settings={crop.settings} onChange={crop.onChange}/>:<p role={current?.error?'alert':'status'}>{current?.error||'Preparing page for cropping…'}</p>}</div>;
 return <div className="workflow-result-preview" aria-label="PDF preview">
  <div className="workflow-preview-mode-bar"><div className="workflow-preview-modes" role="group" aria-label="Choose PDF preview"><button type="button" aria-pressed={mode==='original'} onClick={()=>setView('original')}>Original PDF</button><button type="button" aria-pressed={mode==='changes'} disabled={!!issue} title={issue||'See all enabled workflow changes'} onClick={()=>setView('changes')}>With changes</button></div><PreviewLayout scroll={scroll} onChange={setScroll}/></div><div className="workflow-preview-zoom" role="group" aria-label="Preview zoom"><button type="button" aria-label="Zoom out" disabled={zoom<=.5} onClick={()=>setZoom(z=>Math.max(.5,z-.25))}><ZoomOut size={16}/></button><button type="button" aria-label="Reset preview zoom" onClick={()=>setZoom(1)}>{Math.round(zoom*100)}%</button><button type="button" aria-label="Zoom in" disabled={zoom>=3} onClick={()=>setZoom(z=>Math.min(3,z+.25))}><ZoomIn size={16}/></button></div>
  {mode==='original'?source?<>{sourceFiles.length>1&&<label className="workflow-preview-file">File<select aria-label="Original PDF file" value={source.id} onChange={e=>{setSelectedFile(e.target.value);setSelectedOriginalPage(0);}}>{sourceFiles.map(f=><option key={f.id} value={f.id}>{f.name}</option>)}</select></label>}{!scroll&&<PageControls original page={originalPage} count={source.pages} onChange={setSelectedOriginalPage}/>}<div style={{'--workflow-zoom':zoom} as CSSProperties} className={`workflow-preview-paper ${scroll?'workflow-continuous-review':''} ${zoom!==1?'workflow-is-zoomed':''}`} tabIndex={0} role="region" aria-label="Original PDF pages" key={source.id}>{scroll?Array.from({length:source.pages},(_,i)=><ScrollPage key={i} bytes={source.bytes} page={i} ratio={source.doc?(()=>{const g=pageGeometry(source.doc!.getPage(i));return g.width/g.height;})():undefined} label={`Original PDF, page ${i+1} of ${source.name}`}/>):<PreviewPage bytes={source.bytes} page={originalPage} label={`Original PDF, page ${originalPage+1} of ${source.name}`}/>}</div><p className="workflow-preview-caption">{source.name} · Original file, unchanged</p></>:<div className="workflow-preview-message" role="status">Choose a PDF to preview it.</div>:current?.error?<div className="workflow-preview-message" role="alert"><p>{current.error}</p><button type="button" className="secondary" onClick={()=>setRetry(n=>n+1)}><RefreshCw size={16}/>Retry preview</button></div>:!current?.bytes?<div className="workflow-preview-message" role="status" aria-live="polite"><Loader2 className="spin" size={28}/><p>Applying your changes… {current?.progress??0}%</p><small>Your original PDFs stay unchanged.</small></div>:<>{!scroll&&<PageControls page={page} count={count} onChange={setSelectedPage}/>}<div style={{'--workflow-zoom':zoom} as CSSProperties} className={`workflow-preview-paper ${scroll?'workflow-continuous-review':''} ${zoom!==1?'workflow-is-zoomed':''}`} tabIndex={0} role="region" aria-label="Changed PDF pages">{scroll?Array.from({length:count},(_,i)=><ScrollPage key={i} bytes={current.bytes!} page={i} ratio={current.ratios?.[i]} label={`Workflow preview, page ${i+1} with changes applied`}/>):<PreviewPage bytes={current.bytes} page={page} label={`Workflow preview, page ${page+1} with changes applied`}/>}</div><p className="workflow-preview-caption">All enabled changes applied · {count} {count===1?'page':'pages'} · Original PDFs unchanged</p></>}
 </div>;
}
