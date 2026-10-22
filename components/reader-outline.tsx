'use client';
import {useState} from 'react';
import {filterReaderOutline,readerPageLabel,type ReaderOutline} from '@/lib/reader-navigation';

export function ReaderOutlinePanel({rows,labels,onPage}:{rows:ReaderOutline[];labels:string[];onPage:(page:number)=>void}){
 const [query,setQuery]=useState('');const filtered=filterReaderOutline(rows,query);
 function list(entries:ReaderOutline[]){return <ul className="reader-outline-list">{entries.map(row=><li key={row.id}>{row.children.length?<details open={query.trim()?true:undefined}><summary>{row.title}</summary>{row.page!==undefined&&<button type="button" onClick={()=>onPage(row.page!)}>Open {readerPageLabel(row.page,labels)}</button>}{list(row.children)}</details>:row.page!==undefined?<button type="button" onClick={()=>onPage(row.page!)}><span>{row.title}</span><small>{readerPageLabel(row.page,labels)}</small></button>:<span className="muted">{row.title}</span>}</li>)}</ul>;}
 return <details className="reader-outline"><summary>Document bookmarks</summary>{rows.length?<><label className="field">Find a bookmark<input type="search" value={query} placeholder="Chapter or section" onChange={e=>setQuery(e.target.value)}/></label>{filtered.length?list(filtered):<p role="status">No matching bookmarks.</p>}</>:<p>No document bookmarks in this PDF.</p>}</details>;
}
