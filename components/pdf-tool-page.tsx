'use client';
/* eslint-disable @next/next/no-img-element -- Page previews are local blob data and never leave the browser. */
import {useEffect,useRef,useState} from 'react';
import {Upload,Plus,X,Loader2} from 'lucide-react';
import Link from '@/components/browser-link';
import {SiteHeader,SiteFooter} from '@/components/site-header';
import {useExportScreen} from '@/components/use-export-screen';
import {formatBytes} from '@/components/file-facts';
import {tools} from '@/lib/tools';
import {seoPages} from '@/lib/seo-tools';
import {toolGuidance} from '@/lib/tool-guidance';
import {exportFilename} from '@/lib/export-filename';
import {newTools} from '@/lib/new-tools';
import type {Extra,Values} from '@/lib/new-tools/types';
import {renderer} from '@/lib/pdf-client';
import '@/app/pdf-tool-page.css';

type Loaded={name:string;bytes:Uint8Array;pages:number};
const GENERIC=[
 ['Is this free?','Yes. It needs no account and adds no watermark.'],
 ['Do my documents leave my device?','No. The file is processed in your browser and is not uploaded. Closing the tab clears it.'],
];
export function PdfToolPage({id}:{id:string}){
 const def=newTools[id],tool=tools.find(t=>t.id===id)!,page=seoPages.find(p=>p.id===id)!,guide=toolGuidance[id];
 const [file,setFile]=useState<Loaded>(),[extra,setExtra]=useState<Extra[]>([]),[thumb,setThumb]=useState(''),[busy,setBusy]=useState(false),[opening,setOpening]=useState(false),[progress,setProgress]=useState(0),[error,setError]=useState(''),[drag,setDrag]=useState(false);
 const [values,setValues]=useState<Values>(()=>Object.fromEntries(def.fields.map(f=>[f.key,f.def])));
 const input=useRef<HTMLInputElement>(null),extraInput=useRef<HTMLInputElement>(null);
 const {prepare,visible,screen}=useExportScreen();
 const set=(key:string,value:string|number|boolean)=>setValues(v=>({...v,[key]:value}));
 useEffect(()=>{
  if(!file)return;
  let dead=false;
  void (async()=>{
   try{
    const doc=await renderer(file.bytes);
    try{
     const p=await doc.getPage(1),vp=p.getViewport({scale:1}),scale=Math.min(2,360/vp.width),view=p.getViewport({scale}),c=document.createElement('canvas');
     c.width=Math.round(view.width);c.height=Math.round(view.height);
     await p.render({canvasContext:c.getContext('2d')!,viewport:view}).promise;
     if(!dead)setThumb(c.toDataURL('image/jpeg',0.8));
    }finally{await doc.destroy();}
   }catch{/* The preview is optional. */}
  })();
  return()=>{dead=true;};
 },[file]);
 async function open(list:FileList|File[]|null){
  const f=Array.from(list??[])[0];if(!f)return;
  setError('');
  if(!/\.pdf$/i.test(f.name)&&f.type!=='application/pdf'){setError('Choose a PDF file.');return;}
  setOpening(true);
  try{
   const bytes=new Uint8Array(await f.arrayBuffer()),{PDFDocument}=await import('pdf-lib');
   let pages=0;
   try{pages=(await PDFDocument.load(bytes,{ignoreEncryption:false,updateMetadata:false})).getPageCount();}
   catch(e){
    if(/encrypt/i.test(e instanceof Error?e.message:''))throw new Error('This PDF is password protected. Use Remove password first, then open the unlocked copy here.');
    throw new Error('This file could not be read as a PDF. Try Repair readable PDF first.');
   }
   setFile({name:f.name,bytes,pages});
  }catch(e){setError(e instanceof Error?e.message:'Could not open the file.');}
  finally{setOpening(false);if(input.current)input.current.value='';}
 }
 async function addExtra(list:FileList|null){
  const files=Array.from(list??[]);if(!files.length)return;setError('');
  const next:Extra[]=[];
  for(const f of files)next.push({name:f.name,type:f.type,bytes:new Uint8Array(await f.arrayBuffer())});
  setExtra(def.extra?.multiple?[...extra,...next]:next.slice(0,1));
  if(extraInput.current)extraInput.current.value='';
 }
 async function run(){
  if(!file||busy)return;
  if(def.extra?.required&&!extra.length){setError(`Add ${def.extra.label.toLowerCase()} first.`);return;}
  setBusy(true);setError('');setProgress(0);
  try{
   const result=await def.run({bytes:file.bytes,name:file.name,pages:file.pages,extra,v:values,progress:setProgress});
   const name=exportFilename(tool.name,'out.'+result.ext,'',file.name);
   prepare(result.blob,name,undefined,result.report);
  }catch(e){setError(e instanceof Error?e.message:'That did not work. Try again.');}
  finally{setBusy(false);}
 }
 const faq:[string,string][]=[...guide.faq,...GENERIC as [string,string][]];
 const related=tools.filter(t=>t.group===tool.group&&t.id!==id).slice(0,6);
 const showSettings=!!file;
 return <div className="studio-shell np-shell">
  <SiteHeader/>
  <main className="content np-main">
   <div data-export-workspace tabIndex={-1} hidden={visible}>
    <div className="tool-heading np-heading"><h1>{page.heading.length<=48?page.heading:tool.name}</h1><p>{tool.description}</p></div>
    <input ref={input} type="file" accept=".pdf,application/pdf" hidden onChange={e=>void open(e.target.files)}/>
    {!file?<button type="button" className={`dropzone tool-drop np-drop${drag?' is-drag':''}`} disabled={opening} onClick={()=>input.current?.click()}
      onDragOver={e=>{e.preventDefault();setDrag(true);}} onDragLeave={()=>setDrag(false)} onDrop={e=>{e.preventDefault();setDrag(false);void open(e.dataTransfer.files);}}>
      <span className="upload-symbol"><Upload size={32}/></span><h2>{opening?'Opening your file…':'Choose your PDF'}</h2><p>Tap to choose a file, or drop it here from your device.</p><span className="primary">Choose files</span><small>PDF · Stays on your device</small>
     </button>
     :<section className="np-card" aria-label="Your document and settings">
      <div className="np-file">
       {thumb?<img src={thumb} alt="First page preview" className="np-thumb"/>:<div className="np-thumb np-thumb-empty" aria-hidden="true"/>}
       <div className="np-file-info"><b title={file.name}>{file.name}</b><span>{file.pages} {file.pages===1?'page':'pages'} · {formatBytes(file.bytes.length)}</span>
        <button type="button" className="secondary np-clear" disabled={busy} onClick={()=>{setFile(undefined);setThumb('');setExtra([]);setError('');}}><X size={15}/>Choose another file</button></div>
      </div>
      {def.extra&&<div className="np-extra"><input ref={extraInput} type="file" accept={def.extra.accept} multiple={def.extra.multiple} hidden onChange={e=>void addExtra(e.target.files)}/>
       <label className="np-label">{def.extra.label}{def.extra.required?'':' (optional)'}</label>
       {extra.map((x,i)=><div className="np-extra-row" key={i}><span title={x.name}>{x.name}</span><span>{formatBytes(x.bytes.length)}</span><button type="button" className="icon-button" aria-label={`Remove ${x.name}`} onClick={()=>setExtra(extra.filter((_,n)=>n!==i))}><X size={16}/></button></div>)}
       {(def.extra.multiple||!extra.length)&&<button type="button" className="secondary" disabled={busy} onClick={()=>extraInput.current?.click()}><Plus size={16}/>{extra.length?'Add another':'Choose file'}</button>}
       {def.extra.hint&&<small>{def.extra.hint}</small>}
      </div>}
      {showSettings&&def.fields.length>0&&<div className="np-settings">{def.fields.filter(f=>!f.when||f.when(values)).map(f=>{
       const fid=`np-${f.key}`;
       return <div className={`np-field${f.type==='checkbox'?' np-check':''}`} key={f.key}>
        {f.type==='checkbox'?<label htmlFor={fid}><input id={fid} type="checkbox" checked={!!values[f.key]} onChange={e=>set(f.key,e.target.checked)}/><span>{f.label}</span></label>
        :<><label htmlFor={fid} className="np-label">{f.label}</label>
         {f.type==='select'?<select id={fid} value={String(values[f.key])} onChange={e=>set(f.key,e.target.value)}>{f.options!.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select>
         :f.type==='textarea'?<textarea id={fid} rows={5} value={String(values[f.key])} placeholder={f.placeholder} onChange={e=>set(f.key,e.target.value)}/>
         :f.type==='number'?<input id={fid} type="number" inputMode="decimal" min={f.min} max={f.max} step={f.step??1} value={String(values[f.key])} onChange={e=>set(f.key,e.target.value===''?'':Number(e.target.value))}/>
         :f.type==='color'?<input id={fid} type="color" value={String(values[f.key])} onChange={e=>set(f.key,e.target.value)}/>
         :<input id={fid} type="text" value={String(values[f.key])} placeholder={f.placeholder} onChange={e=>set(f.key,e.target.value)}/>}</>}
        {f.help&&<small>{f.help}</small>}
       </div>;})}</div>}
      {error&&<p className="native-error np-error" role="alert">{error}</p>}
      <div className="np-actions"><button type="button" className="primary np-run" disabled={busy} onClick={()=>void run()}>{busy?<><Loader2 size={18} className="np-spin"/>Working… {progress>0&&progress<100?progress+'%':''}</>:def.action}</button></div>
     </section>}
    {!file&&error&&<p className="native-error np-error" role="alert">{error}</p>}
    <section className="np-about" aria-labelledby="np-about-title">
     <h2 id="np-about-title">{page.heading}</h2>
     <p>{page.intro}</p>
     <h3>How it works</h3>
     <ol>{guide.steps.map(s=><li key={s}>{s}</li>)}</ol>
     <p>{page.detail}</p>
     <h3>When to use this tool</h3><p>{guide.useCase}</p>
     <h3>Check the result</h3><p>{guide.checks}</p>
     <h3>Frequently asked questions</h3>
     {faq.map(([q,a])=><details key={q}><summary>{q}</summary><p>{a}</p></details>)}
     {related.length>0&&<><h3>Related tools</h3><ul className="np-related">{related.map(r=>{const p=seoPages.find(x=>x.id===r.id);return <li key={r.id}><Link href={'/tools/'+(p?.slug??r.id)}>{r.name}</Link><span>{r.description}</span></li>;})}</ul></>}
    </section>
   </div>
   {screen}
  </main>
  <SiteFooter tool={tool.name}/>
 </div>;
}
