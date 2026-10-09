'use client';
import {useMemo,useState} from 'react';
import Link from '@/components/browser-link';
import type {Article} from '@/lib/articles';
export function BlogDirectory({articles}:{articles:Pick<Article,'slug'|'title'|'summary'|'category'|'intent'|'tags'>[]}){
 const [query,setQuery]=useState(''),[category,setCategory]=useState('All'),[limit,setLimit]=useState(12);
 const groups=['All',...new Set(articles.map(a=>a.category))];
 const matches=useMemo(()=>articles.filter(a=>(category==='All'||a.category===category)&&`${a.title} ${a.summary} ${a.tags?.join(' ')||''}`.toLowerCase().includes(query.trim().toLowerCase())),[articles,category,query]);
 return <section aria-label="PDF guides"><label className="guide-search-label" htmlFor="guide-search">Find a guide</label><div className="guide-search"><input id="guide-search" type="search" placeholder="Try rotate, signature, smaller, OCR…" value={query} onChange={e=>{setQuery(e.target.value);setLimit(12)}}/>{query&&<button aria-label="Clear guide search" onClick={()=>{setQuery('');setLimit(12)}}>×</button>}</div><div className="guide-filter-strip" aria-label="Guide categories">{groups.map(g=><button key={g} aria-pressed={category===g} onClick={()=>{setCategory(g);setLimit(12)}}>{g}</button>)}</div><p className="guide-count" role="status">{matches.length} {matches.length===1?'guide':'guides'}{query?' matching your search':''}</p><div className="native-blog-grid">{matches.slice(0,limit).map(a=><Link key={a.slug} href={'/blog/'+a.slug} className="native-blog-card"><small>{a.category} · {a.intent||'Guide'}</small><h2>{a.title}</h2><p>{a.summary}</p><span>Read the guide →</span></Link>)}</div>{matches.length===0&&<p className="blog-empty">No matching guide yet. Try a tool name such as Merge, Rotate or Sign, or choose All.</p>}{limit<matches.length&&<button className="guide-load-more" onClick={()=>setLimit(n=>n+12)}>Show 12 more guides · {matches.length-limit} remaining</button>}</section>;
}
