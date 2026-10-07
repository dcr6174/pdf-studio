'use client';
import {useEffect,useRef,useState} from 'react';
import {ArrowLeft,ArrowRight,Download,ScanSearch,Check} from 'lucide-react';
import type {PDFDocumentProxy} from 'pdfjs-dist';
import {renderer} from '@/lib/pdf-client';
import {ReaderPage} from './reader-page';
import './blank-review-result.css';
const noop=()=>{};
export function BlankReviewResult({output,totalPages,onReview,onDownload,onBack,error}:{output:{blob:Blob;name:string;blankCandidates?:number[]};totalPages?:number;onReview?:()=>void;onDownload:()=>void;onBack:()=>void;error?:string}){
 const pages=output.blankCandidates??[],count=pages.length;
 const action=useRef<HTMLButtonElement>(null),[pdf,setPDF]=useState<PDFDocumentProxy>(),[previewError,setPreviewError]=useState('');
 useEffect(()=>{action.current?.focus({preventScroll:true});},[]);
 useEffect(()=>{if(!count)return;let active=true;let opened:PDFDocumentProxy|undefined;void(async()=>{try{opened=await renderer(new Uint8Array(await output.blob.arrayBuffer()));if(active)setPDF(opened);else await opened.destroy();}catch{if(active)setPreviewError('Preview unavailable. Open page review to inspect these pages.');}})();return()=>{active=false;if(opened)void opened.destroy();};},[output,count]);
 return <section className="blank-result" aria-labelledby="export-result-heading">
  <button className="blank-back" onClick={onBack}><ArrowLeft size={16}/>Back to document</button>
  <header className="blank-result-heading"><span className="blank-result-symbol" aria-hidden="true">{count?<ScanSearch size={24}/>:<Check size={24}/>}</span><div><p className="blank-result-eyebrow">BLANK PAGE CHECK</p><h1 id="export-result-heading">{count?`${count} ${count===1?'page needs':'pages need'} a closer look`:'No blank pages found'}</h1><p>{count?'Check the pages below before removing anything.':'Every page contains text or visible content.'}</p></div></header>
  <div className="blank-result-body"><section className="blank-candidates" aria-label="Candidate page previews">
   {count?<><div className="blank-candidates-label"><h2>Pages to review</h2><span>{totalPages?`${count} of ${totalPages} pages`:`${count} ${count===1?'page':'pages'}`}</span></div><div className="blank-candidate-grid">{pages.map(page=><figure key={page}><div className="blank-candidate-paper">{pdf?<ReaderPage document={pdf} page={page} width={180} zoom={1} rotation={0} thumbnail onText={noop} onPage={noop} onError={setPreviewError}/>:<span>{previewError?'Preview unavailable':'Loading preview…'}</span>}</div><figcaption>Page {page}<span>Possibly blank</span></figcaption></figure>)}</div>{previewError&&<p role="status">{previewError}</p>}</>:<div className="blank-result-empty"><Check size={32} aria-hidden="true"/><h2>All pages kept</h2><p>Your document is ready to use.</p></div>}
  </section><aside className="blank-result-actions"><h2>{count?'You decide what stays':'Check complete'}</h2><p>{count?'Faint marks and scanned content can be easy to miss. Open page review to inspect, keep or remove a page.':'Nothing needs to be removed.'}</p>{count&&onReview?<button ref={action} className="primary" onClick={onReview}>Review {count===1?`page ${pages[0]}`:`${count} pages`}<ArrowRight size={18}/></button>:<button ref={action} className="primary" onClick={onBack}>Back to document<ArrowRight size={18}/></button>}<p className="blank-kept"><Check size={15}/>No pages have been deleted</p><div className="blank-result-download"><button onClick={onDownload}><Download size={17}/>Download PDF</button><span>Same pages as before this check</span></div></aside></div>
  {error&&<p role="alert">{error}</p>}
 </section>;
}
