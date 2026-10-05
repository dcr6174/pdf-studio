'use client';
import {useEffect,useState} from 'react';
import {ArrowRight} from 'lucide-react';
import {describeChange,plural} from '@/lib/result-summary';

type Side={files:number;pages:number;size:number;unit:'page'|'image'};
const PAGE_COUNT_LIMIT=120*1048576;

/** PDF page count of the result, read in this browser. Skipped for very large files. */
function useAfterPages(blob:Blob|undefined,known?:number){
 const [result,setResult]=useState<{blob:Blob;pages:number}>();
 useEffect(()=>{
  if(known!==undefined||!blob||blob.type!=='application/pdf'||blob.size>PAGE_COUNT_LIMIT)return;
  let alive=true;
  (async()=>{
   try{
    const {PDFDocument}=await import('pdf-lib');
    const doc=await PDFDocument.load(await blob.arrayBuffer(),{ignoreEncryption:true,updateMetadata:false});
    if(alive)setResult({blob,pages:doc.getPageCount()});
   }catch{/* page count is a nice extra; the sizes still show */}
  })();
  return()=>{alive=false;};
 },[blob,known]);
 return known??(result?.blob===blob?result?.pages:undefined);
}

/** Before and after, in plain numbers: size, pages and files. For Compress it says how much was saved. */
export function ResultSummary({compress,before,afterSize,afterBlob,afterLabel,afterPages:knownPages}:{compress:boolean;before:Side;afterSize:number;afterBlob?:Blob;afterLabel:string;afterPages?:number}){
 const afterPages=useAfterPages(afterBlob,knownPages);
 const change=describeChange(before.size,afterSize,compress);
 const saved=before.size-afterSize,pct=before.size>0?Math.abs(saved)/before.size*100:0;
 const precise=(n:number)=>new Intl.NumberFormat('en',{maximumFractionDigits:2}).format(n/1000)+' KB';
 const beforeDetail=[before.files>1?plural(before.files,'file'):'',before.pages>0?plural(before.pages,before.unit):''].filter(Boolean).join(' · ');
 const afterDetail=[afterLabel,afterPages!==undefined?plural(afterPages,'page'):''].filter(Boolean).join(' · ');
 return <section className={`result-summary tone-${change.tone}`} aria-label="Before and after">
  <div className="rs-col"><span className="rs-tag">Before</span><b>{precise(before.size)}</b><span className="rs-detail">{beforeDetail||'\u00a0'}</span></div>
  <ArrowRight className="rs-arrow" size={22} aria-hidden="true"/>
  <div className="rs-col rs-after"><span className="rs-tag">After</span><b>{precise(afterSize)}</b><span className="rs-detail">{afterDetail||'\u00a0'}</span></div>
  {compress&&<><p className="rs-savings">{saved>0?`Saved ${precise(saved)} · ${pct.toFixed(1)}%`:saved===0?'No size change':`Added ${precise(-saved)} · ${pct.toFixed(1)}%`}</p><p className="rs-headline"><strong>{saved<0?'This version is larger. Download the original for the smaller file.':saved===0?'No size change. Your PDF may already be optimized.':pct<1?'Only slightly smaller. Your PDF may already be optimized.':`Your PDF is ${pct.toFixed(1)}% smaller.`}</strong></p></> }
 </section>;
}
