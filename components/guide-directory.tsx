'use client';
import {useState} from 'react';
import {Search,FileText} from 'lucide-react';
import Link from '@/components/browser-link';
import {toolIcons} from '@/lib/tool-icons';
type Guide={slug:string;title:string;intro:string;group:string;id:string};
export function GuideDirectory({guides}:{guides:Guide[]}){
 const [query,setQuery]=useState(''),[category,setCategory]=useState('All guides');
 const categories=['All guides',...new Set(guides.map(g=>g.group))];
 const filtered=guides.filter(g=>(category==='All guides'||g.group===category)&&`${g.title} ${g.intro}`.toLowerCase().includes(query.trim().toLowerCase()));
 return <section className="guide-directory" aria-labelledby="all-guides-title"><div className="guide-section-heading"><h2 id="all-guides-title">Find your guide</h2><p>Choose a task, learn the steps, and open the tool.</p></div><label className="guide-search"><Search size={20} aria-hidden="true"/><span className="sr-only">Search PDF guides</span><input type="search" placeholder="Search guides, e.g. sign or compress" value={query} onChange={e=>setQuery(e.target.value)}/></label><div className="guide-filters" role="group" aria-label="Guide categories">{categories.map(c=><button key={c} type="button" aria-pressed={category===c} onClick={()=>setCategory(c)}>{c}</button>)}</div><p className="guide-status" role="status">{filtered.length} {filtered.length===1?'guide':'guides'}{query.trim()?` matching “${query.trim()}”`:''}</p><div className="guide-cards">{filtered.map(g=>{const Icon=toolIcons[g.id]??FileText;return <Link key={g.slug} href={'/guides/'+g.slug} className={'guide-card guide-tone-'+['Pages','Edit & sign','Convert','Privacy'].indexOf(g.group)}><span className="guide-card-icon" aria-hidden="true"><Icon size={22}/></span><span><small>{g.group}</small><h3>{g.title}</h3><p>{g.intro.replace(' Configure the available options, inspect the result and download it from your browser.','')}</p></span></Link>;})}</div>{!filtered.length&&<div className="guide-no-results"><h3>No guides match yet</h3><p>Try a shorter task name or choose another category.</p><button type="button" onClick={()=>{setQuery('');setCategory('All guides');}}>Show all guides</button></div>}</section>;
}
