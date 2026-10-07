'use client';
import {useEffect,useRef,useState,type ReactNode} from 'react';
import {ArrowLeft,Download,FolderOpen,Pencil,Copy,FileText} from 'lucide-react';
import {formatBytes} from '@/components/file-facts';
import {toolIcons} from '@/lib/tool-icons';
import './result-screen.css';

type Output={blob:Blob;name:string;report?:string;inputSize?:number;warnings?:string[];target?:{requestedKB:number;met:boolean}};
type Props={
 output:Output;open:boolean;fullPage?:boolean;toolId?:string;resultTitle?:string;onOpenChange?:(value:boolean)=>void;
 before?:{files:number;pages:number;size:number;unit:'page'|'image'};compress?:boolean;
 onDownload:()=>void;onOriginal?:()=>void;onContinue?:()=>void;onNextTool?:(id:string)=>void;onStartOver?:()=>void;onSave?:()=>void;onSettings:()=>void;onProtect?:()=>void;error?:string;previewContent?:ReactNode;
};
export function ResultCard({output,open,toolId,resultTitle,before,compress,onDownload,onOriginal,onContinue,onNextTool,onSave,onSettings,onProtect,error,previewContent}:Props){
 const [preview,setPreview]=useState(false),[copied,setCopied]=useState(false),[copyError,setCopyError]=useState('');
 const downloadButton=useRef<HTMLButtonElement>(null);
 useEffect(()=>{if(!open)return;const frame=requestAnimationFrame(()=>{setPreview(false);setCopied(false);setCopyError('');downloadButton.current?.focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});});return()=>cancelAnimationFrame(frame);},[open,output]);
 if(!open)return null;
 const pdf=output.blob.type==='application/pdf',ext=output.name.split('.').pop()?.toUpperCase();
 const label=pdf?'PDF':ext&&ext.length<=5?ext:'file';
 const inputSize=output.inputSize??before?.size??0;
 const larger=!!compress&&inputSize>0&&output.blob.size>inputSize;
 const saved=compress&&inputSize>output.blob.size?Math.round((1-output.blob.size/inputSize)*100):0;
 const originalPreferred=larger&&!!onOriginal;
 const next=[['compress','Compress PDF'],['sign','Sign PDF'],['watermark','Add watermark'],['edit','Edit PDF']].filter(([id])=>id!==toolId).slice(0,3);
 return <section className="merge-result-page export-result-page" aria-labelledby="export-result-heading">
  <div className="merge-result-check" aria-hidden="true"><svg viewBox="0 0 40 40" fill="none"><path d="M10 21 17 28 30 13" pathLength="1"/></svg></div>
  <h1 id="export-result-heading">{resultTitle??`Your ${label} is ready`}</h1>
  <p className="merge-result-file">{output.name} · {formatBytes(output.blob.size)}</p>
  {compress&&inputSize>0&&<p className="export-size-summary" role="status">{formatBytes(inputSize)} → {formatBytes(output.blob.size)}{saved>0?` · ${saved}% smaller`:larger?' · The original is smaller.':' · About the same size.'}</p>}
  {output.target&&<p className="export-size-summary" role="status">{output.target.met?'Target met':'Target not met'} · Result {(output.blob.size/1000).toFixed(1)} KB / target {output.target.requestedKB} KB</p>}
  <button ref={downloadButton} className="primary merge-result-download" onClick={originalPreferred?onOriginal:onDownload}><Download size={26}/>{originalPreferred?'Download original PDF':toolId==='merge'?'Download merged PDF':`Download ${label}`}</button>
  <div className="merge-result-secondary"><button className="secondary" onClick={onSettings}><ArrowLeft size={17}/>Back to {toolId==='merge'?'files':'workspace'}</button>{onSave&&<button className="secondary" onClick={onSave}><FolderOpen size={17}/>Save to My files</button>}{onOriginal&&<button className="secondary" onClick={originalPreferred?onDownload:onOriginal}><Download size={17}/>{originalPreferred?'Download processed PDF':'Download original PDF'}</button>}{onProtect&&<button className="secondary" onClick={onProtect}>Add password</button>}</div>
  {output.warnings?.map(warning=><p className="export-warning" key={warning} role="status">{warning}</p>)}
  {error&&<p className="native-error" role="alert">{error}</p>}
  {compress&&saved===0&&<details className="merge-result-preview"><summary>How to make it smaller</summary><div><p>This file may already be optimized. Return to settings to try stronger compression or lower image quality. Check text and image clarity before sharing.</p><button className="secondary" onClick={onSettings}>Adjust compression</button></div></details>}
  {pdf&&previewContent&&<details className="merge-result-preview" onToggle={event=>setPreview(event.currentTarget.open)}><summary>Preview {toolId==='merge'?'merged PDF':label}</summary>{preview&&previewContent}</details>}
  {output.report&&<details className="merge-result-preview" open={!pdf&&output.blob.type.startsWith('text/')}><summary>{pdf?'What changed':'Result details'}</summary><div><pre className="export-report">{output.report}</pre>{!pdf&&<button className="secondary" onClick={()=>{void navigator.clipboard.writeText(output.report!).then(()=>setCopied(true)).catch(()=>setCopyError('Copy unavailable. Select the report text or download the file.'));}}><Copy size={16}/>{copied?'Copied':'Copy report'}</button>}{copyError&&<p role="status">{copyError}</p>}</div></details>}
  {pdf&&(onContinue||onNextTool)&&<div className="merge-result-next"><h2>Continue with this PDF</h2><div>{onNextTool?next.map(([id,text])=>{const Icon=toolIcons[id]??FileText;return <button key={id} className="secondary" onClick={()=>onNextTool(id)}><span className={`merge-next-icon merge-next-icon-${id}`}><Icon size={19}/></span>{text}</button>;}):onContinue&&<button className="secondary" onClick={onContinue}><Pencil size={19}/>Continue editing</button>}</div></div>}
 </section>;
}
