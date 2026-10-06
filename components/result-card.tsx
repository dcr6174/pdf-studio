'use client';
import {useState,type ReactNode} from 'react';
import {Check,Download,FolderOpen,Layers} from 'lucide-react';
import {Dialog,DialogContent,DialogTitle,DialogDescription} from '@/components/ui/dialog';
import {ResultSummary} from '@/components/result-summary';
import {SupportLink} from '@/components/support-link';
import {formatBytes} from '@/components/file-facts';
type Output={blob:Blob;name:string;report?:string;inputSize?:number};
export function ResultCard({output,open,onOpenChange,before,compress,onDownload,onOriginal,onContinue,onNextTool,onStartOver,onSave,onSettings,onProtect,error,previewContent}:{output:Output;open:boolean;onOpenChange:(v:boolean)=>void;before:{files:number;pages:number;size:number;unit:'page'|'image'};compress:boolean;onDownload:()=>void;onOriginal?:()=>void;onContinue?:()=>void;onNextTool?:(id:string)=>void;onStartOver?:()=>void;onSave:()=>void;onSettings:()=>void;onProtect?:()=>void;error:string;previewContent:ReactNode}){
 const [preview,setPreview]=useState(false);
 before={...before,size:output.inputSize??before.size};
 const pdf=output.blob.type==='application/pdf',larger=compress&&output.blob.size>before.size,help=compress&&before.size>0&&output.blob.size>=before.size;
 return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent viewportPositioned className="result-card" onOpenAutoFocus={e=>{e.preventDefault();requestAnimationFrame(()=>document.getElementById('download-result')?.focus({preventScroll:true}));}}>
 <header className="result-card-header"><span className="result-check" aria-hidden="true"><Check size={22}/></span><div><DialogTitle>Your {pdf?'PDF':'file'} is ready</DialogTitle><DialogDescription>{output.name} · {formatBytes(output.blob.size)}</DialogDescription></div></header>
 {compress&&before.size>0&&<ResultSummary compress before={before} afterSize={output.blob.size} afterBlob={output.blob} afterLabel="PDF"/>}
 <div className="result-card-download"><button id="download-result" className="primary" onClick={larger&&onOriginal?onOriginal:onDownload}><Download size={20}/>{larger&&onOriginal?'Download original':`Download ${pdf?'PDF':'file'}`}</button></div>
 <div className="result-card-body">
 {pdf&&<details className="result-inspect" onToggle={e=>setPreview(e.currentTarget.open)}><summary>Preview PDF</summary>{preview&&previewContent}</details>}
 {onContinue&&<button className="secondary result-continue" onClick={onContinue}><Layers size={17}/>Continue editing</button>}
 {onNextTool&&<nav className="result-next-tools" aria-label="Continue with result">{[['compress','Compress'],['sign','Sign'],['edit','Edit']].map(([id,label])=><button className="link-button" key={id} onClick={()=>onNextTool(id)}>{label} this PDF</button>)}</nav>}<details className="result-options"><summary>More options</summary><div>{onOriginal&&<button className="secondary" onClick={larger?onDownload:onOriginal}><Download size={17}/>{larger?'Download processed PDF':'Download original'}</button>}<button className="secondary" onClick={onSave}><FolderOpen size={17}/>Save to My files</button>{onProtect&&<button className="secondary" onClick={onProtect}>Add password to signed PDF</button>}</div></details>
 {help&&<section className="result-help"><h3>Need a smaller file?</h3><button className="secondary" onClick={onSettings}>Try other settings</button><details><summary>Compression tips</summary><ul><li>Try “Optimize JPEG images” to keep text and links.</li><li>“Smallest · page images” can shrink scans, but turns text into images and removes interactive features.</li><li>Preview the output to check readability.</li><li>Remove pages you do not need before compressing.</li><li>Some PDFs are already optimized and cannot shrink further with these settings.</li></ul></details></section>}
 {error&&<p className="native-error" role="alert">{error}</p>}{output.report&&<details className="result-details"><summary>Processing details</summary><pre className="result-report">{output.report}</pre></details>}
 </div><footer className="result-card-footer">{onStartOver&&<button className="link-button" onClick={onStartOver}>Start over</button>}<div className="result-support"><SupportLink success/></div></footer></DialogContent></Dialog>;
}
