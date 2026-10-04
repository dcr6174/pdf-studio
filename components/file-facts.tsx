import {FileText} from 'lucide-react';

/** Decimal units (1 MB = 1,000,000 bytes), the same as the 157.3 MB workspace limit shown in the app. */
export function formatBytes(n:number){
 if(n<1000)return n+' B';
 if(n<1e6)return Math.max(1,Math.round(n/1000))+' KB';
 if(n<1e9)return (n/1e6).toFixed(n<1e7?2:1)+' MB';
 return (n/1e9).toFixed(2)+' GB';
}
const LARGE=100e6;

/** What the person just opened, before any options: name, pages, size (and a gentle warning for big files). */
export function FileFacts({files,pageCount}:{files:{name:string;size:number}[];pageCount:number}){
 if(!files.length)return null;
 const total=files.reduce((s,f)=>s+f.size,0),single=files.length===1;
 const parts=[pageCount>0?`${pageCount} ${pageCount===1?'page':'pages'}`:'',formatBytes(total)].filter(Boolean);
 const title=single?files[0].name:`${files.length} files`;
 const names=single?'':files.slice(0,3).map(f=>f.name).join(', ')+(files.length>3?` and ${files.length-3} more`:'');
 return <div className="file-facts">
  <span className="file-facts-icon" aria-hidden="true"><FileText size={22}/></span>
  <div className="file-facts-text">
   <b title={single?files[0].name:names}>{title}</b>
   <span>{parts.join(' · ')}</span>
   {!single&&<small title={files.map(f=>f.name).join(', ')}>{names}</small>}
   {total>LARGE&&<em>Large file: processing may be slow, especially on phones.</em>}
  </div>
  <span className="sr-only" role="status">{`Opened ${title}. ${parts.join(', ')}.`}</span>
 </div>;
}
