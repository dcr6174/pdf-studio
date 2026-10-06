'use client';
import {useState} from 'react';
import {Search} from 'lucide-react';
import {ToolIcon} from '@/components/tool-icon';
import Link from '@/components/browser-link';
import {tools,groups} from '@/lib/tools';
import {seoTools} from '@/lib/seo-tools';
import {searchToolsDetailed} from '@/lib/tool-search';
export function ToolsDirectory(){
 const [query,setQuery]=useState(''),[category,setCategory]=useState('All tools');
 const found=query.trim()?searchToolsDetailed(query).tools:tools;
 const shown=found.filter(t=>category==='All tools'||t.group===category);
 return <section className="tools-directory" aria-label="Find a PDF tool"><label className="search"><Search size={20}/><input type="search" value={query} onChange={e=>setQuery(e.target.value)} aria-label="Search all PDF tools" placeholder="Search tools"/></label><div className="filters" role="group" aria-label="Tool categories">{groups.filter(g=>g!=='My files').map(g=><button key={g} aria-pressed={category===g} className={category===g?'selected':''} onClick={()=>setCategory(g)}>{g} <span>{g==='All tools'?'60+':tools.filter(t=>t.group===g).length}</span></button>)}</div><p role="status">{query.trim()||category!=='All tools'?`${shown.length} ${shown.length===1?'tool':'tools'}${query.trim()?` matching “${query}”`:''}`:'60+ free tools'}</p>{groups.filter(g=>g!=='All tools'&&g!=='My files').map(g=>{const list=shown.filter(t=>t.group===g);if(!list.length)return null;return <section key={g}><h2>{g}</h2><div className="tool-grid">{list.map(t=>{return <Link className="tool-card" key={t.id} href={'/tools/'+seoTools.find(p=>p.id===t.id)!.slug}><span className="tool-icon"><ToolIcon name={t.icon}/></span><b>{t.name}</b><p>{t.description}</p></Link>;})}</div></section>;})}{!shown.length&&<p>No matching tools. Try another task or choose All tools.</p>}</section>;
}
