'use client';
import {useMemo,useState} from 'react';
import Link from '@/components/browser-link';
type Guide={slug:string;title:string;summary:string;category:string};
export function BlogDirectory({guides}:{guides:Guide[]}){
 const [query,setQuery]=useState(''),[category,setCategory]=useState('All guides'),[visible,setVisible]=useState(12);
 const categories=['All guides',...new Set(guides.map(g=>g.category))];
 const filtered=useMemo(()=>guides.filter(g=>(category==='All guides'||g.category===category)&&`${g.title} ${g.summary}`.toLowerCase().includes(query.toLowerCase().trim())),[guides,query,category]);
 return <section className="blog-directory" aria-label="Find a PDF guide">
 <label className="blog-search">Find your next PDF fix<input type="search" value={query} onChange={e=>{setQuery(e.target.value);setVisible(12);}} placeholder="Try merge, OCR, bookmarks…" /></label>
 <div className="blog-category-list" aria-label="Guide categories">{categories.map(c=><button type="button" key={c} aria-pressed={category===c} onClick={()=>{setCategory(c);setVisible(12);}}>{c}</button>)}</div>
 <p role="status" className="blog-result-count">{filtered.length} guides{query.trim()?' matching your search':''}</p>
 <div className="native-blog-grid">{filtered.slice(0,visible).map(g=><Link key={g.slug} href={'/blog/'+g.slug} className="native-blog-card"><small>{g.category}</small><h2>{g.title}</h2><p>{g.summary}</p><span>Read the guide →</span></Link>)}</div>
 {filtered.length===0&&<p className="blog-empty">No matches yet. Try another tool name or choose All guides.</p>}
 {visible<filtered.length&&<button className="blog-quiet-button blog-load-more" type="button" onClick={()=>setVisible(n=>n+12)}>Show 12 more guides</button>}
 </section>;
}
