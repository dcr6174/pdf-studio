
'use client';
import type {Loaded} from '@/lib/pdf-client';
import {formatBytes} from '@/components/file-facts';
export function MergeFiles({files,disabled,onMove,onRemove}:{files:Loaded[];disabled:boolean;onMove:(index:number,direction:number)=>void;onRemove:(id:string)=>void}){
 const forms=files.some(f=>f.doc&&f.doc.getForm().getFields().length>0);
 return <section className="merge-files" aria-label="Files in merge order"><h2>Files to merge</h2><p>Use Move up or Move down to choose the order. Expand Organize pages for individual page changes.</p><ol>{files.map((file,i)=><li key={file.id}><span className="merge-file-number">{i+1}</span><div><b>{file.name}</b><small>{file.pages} pages · {formatBytes(file.size)}</small></div><div className="merge-file-actions"><button disabled={disabled||i===0} onClick={()=>onMove(i,-1)} aria-label={'Move '+file.name+' up'}>Move up</button><button disabled={disabled||i===files.length-1} onClick={()=>onMove(i,1)} aria-label={'Move '+file.name+' down'}>Move down</button><button disabled={disabled} onClick={()=>onRemove(file.id)} aria-label={'Remove '+file.name}>Remove</button></div></li>)}</ol>{forms&&<p className="tool-note">One or more files contain fillable fields. Review form handling below; flattening makes those fields read-only.</p>}</section>;
}
