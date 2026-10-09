'use client';
import {useMemo,useRef,useState} from 'react';
import {ArrowUpRight,BookOpen,ChevronLeft,ChevronRight,Layers,PenLine,Repeat,ShieldCheck} from 'lucide-react';
import Link from '@/components/browser-link';
import type {Article} from '@/lib/articles';
const palettes:Record<string,string>={'All':'all','Pages':'pages','Edit & sign':'edit','Convert':'convert','Privacy':'privacy'};
const icons:Record<string,typeof BookOpen>={'All':BookOpen,'Pages':Layers,'Edit & sign':PenLine,'Convert':Repeat,'Privacy':ShieldCheck};

export function BlogDirectory({articles}:{articles:Pick<Article,'slug'|'title'|'summary'|'category'|'intent'|'tags'>[]}){
 const [query,setQuery]=useState(''),[category,setCategory]=useState('All'),[page,setPage]=useState(1),[pageSize,setPageSize]=useState(12);
 const results=useRef<HTMLParagraphElement>(null);
 const groups=['All',...new Set(articles.map(a=>a.category))];
 const matches=useMemo(()=>articles.filter(a=>(category==='All'||a.category===category)&&`${a.title} ${a.summary} ${a.tags?.join(' ')||''}`.toLowerCase().includes(query.trim().toLowerCase())),[articles,category,query]);
 const totalPages=Math.ceil(matches.length/pageSize),start=(page-1)*pageSize;
 const numbers=Array.from({length:totalPages},(_,i)=>i+1).filter(n=>n===1||n===totalPages||Math.abs(n-page)<=1||(page<=3&&n<=4)||(page>=totalPages-2&&n>=totalPages-3));
 function changePage(next:number){setPage(next);results.current?.focus({preventScroll:true});results.current?.scrollIntoView({block:'start',behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});}
 return <section className="guide-directory" aria-label="PDF guides">
  <div className="guide-directory-controls"><div><label className="guide-search-label" htmlFor="guide-search">Find your next guide</label><div className="guide-search"><input id="guide-search" type="search" placeholder="Try rotate, signature, smaller, OCR…" value={query} onChange={e=>{setQuery(e.target.value);setPage(1)}}/>{query&&<button aria-label="Clear guide search" onClick={()=>{setQuery('');setPage(1)}}>×</button>}</div></div>
  <div className="guide-filter-strip" aria-label="Guide categories">{groups.map(g=>{const Icon=icons[g]||BookOpen;return <button key={g} data-category={palettes[g]||'all'} aria-pressed={category===g} onClick={()=>{setCategory(g);setPage(1)}}><Icon size={18} aria-hidden="true"/>{g}</button>})}</div></div>
  <p ref={results} tabIndex={-1} className="guide-count" role="status">{matches.length} {matches.length===1?'guide':'guides'}{query?' matching your search':''}{matches.length>0&&<span>Showing {start+1}–{Math.min(start+pageSize,matches.length)}</span>}</p>
  <div className="native-blog-grid">{matches.slice(start,start+pageSize).map(a=>{const Icon=icons[a.category]||BookOpen;return <Link key={a.slug} href={'/blog/'+a.slug} className="native-blog-card" data-category={palettes[a.category]||'all'}><div className="guide-card-top"><span className="guide-card-icon"><Icon size={25} aria-hidden="true"/></span><small>{a.category} · {a.intent||'Guide'}</small></div><h2>{a.title}</h2><p>{a.summary}</p><span className="guide-card-link">Read the guide <ArrowUpRight size={18} aria-hidden="true"/></span></Link>})}</div>
  {matches.length===0&&<p className="blog-empty">No matching guide yet. Try a tool name such as Merge, Rotate or Sign, or choose All.</p>}
  {matches.length>0&&<nav className="guide-pagination" aria-label="Guide pagination"><div className="guide-page-controls"><button aria-label="Previous page" disabled={page===1} onClick={()=>changePage(page-1)}><ChevronLeft size={20} aria-hidden="true"/><span>Previous</span></button><div className="guide-page-numbers">{numbers.map((n,i)=><span key={n} className="guide-page-slot" data-neighbor={n!==1&&n!==totalPages&&n!==page?true:undefined}>{i>0&&n-numbers[i-1]>1&&<span className="guide-page-gap" aria-hidden="true">…</span>}<button aria-label={`Page ${n}`} aria-current={page===n?'page':undefined} onClick={()=>changePage(n)}>{n}</button></span>)}</div><button aria-label="Next page" disabled={page===totalPages} onClick={()=>changePage(page+1)}><span>Next</span><ChevronRight size={20} aria-hidden="true"/></button></div><label className="guide-page-size"><span className="guide-visually-hidden">Guides per page</span><select value={pageSize} onChange={e=>{setPageSize(Number(e.target.value));setPage(1)}}><option value={12}>12 guides</option><option value={24}>24 guides</option><option value={48}>48 guides</option></select></label><p>Page <strong>{page}</strong> of {totalPages}</p></nav>}
 </section>;
}
