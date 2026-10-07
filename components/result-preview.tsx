'use client';
import {useCallback,useEffect,useRef,useState} from 'react';
import {renderer} from '@/lib/pdf-client';
import type {PDFDocumentProxy} from 'pdfjs-dist';
import {ReaderPage} from '@/components/reader-page';
const ignoreText=()=>{};
export function ResultPreview({output}:{output:{blob:Blob;name:string}}){
 const host=useRef<HTMLDivElement>(null),[pdf,setPDF]=useState<PDFDocumentProxy>(),[width,setWidth]=useState(600),[message,setMessage]=useState('');
 useEffect(()=>{let alive=true;let opened:PDFDocumentProxy|undefined;queueMicrotask(()=>{if(alive){setPDF(undefined);setMessage('');}});void(async()=>{try{opened=await renderer(new Uint8Array(await output.blob.arrayBuffer()));if(alive)setPDF(opened);else await opened.destroy();}catch{if(alive)setMessage('This result cannot be previewed here. Download it to inspect it in your PDF reader.');}})();return()=>{alive=false;if(opened)void opened.destroy();};},[output]);
 useEffect(()=>{const node=host.current;if(!node)return;const observer=new ResizeObserver(entries=>setWidth(Math.max(200,entries[0].contentRect.width)));observer.observe(node);return()=>observer.disconnect();},[]);
 const jump=useCallback((page:number)=>{host.current?.querySelector(`[data-result-page="${page}"]`)?.scrollIntoView({block:'start',behavior:'auto'});},[]);
 return <div ref={host} className="result-preview" role="region" aria-label="Exported PDF preview" tabIndex={0}>{pdf?Array.from({length:pdf.numPages},(_,i)=><section key={i} data-result-page={i+1}><p>Page {i+1}</p><ReaderPage document={pdf} page={i+1} width={width} zoom={1} rotation={0} onText={ignoreText} onError={setMessage} onPage={jump}/></section>):<p role="status">{message||'Opening the exported PDF…'}</p>}{pdf&&message&&<p role="status">{message}</p>}</div>;
}
