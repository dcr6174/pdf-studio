'use client';
import {PDF_TOOL_COUNT} from '@/lib/tools';
import {useEffect,useRef,useState} from 'react';
import {Search} from 'lucide-react';
import {ToolIcon} from '@/components/tool-icon';
import {ToolIdIcon} from '@/components/tool-id-icon';
import Link from '@/components/browser-link';
import {tools,groups} from '@/lib/tools';
import {seoTools,seoPages} from '@/lib/seo-tools';
import {searchToolsDetailed} from '@/lib/tool-search';
// Keyword pages (delete-pdf-pages, extract-pdf-pages, compress-pdf-to-100kb) open real tools
// with their own slug and preset; list them alongside the main catalogue so they are reachable.
const extraPages=seoPages.filter(p=>!seoTools.some(s=>s.slug===p.slug)).map(p=>({slug:p.slug,name:p.title,description:p.intro,group:p.group,icon:tools.find(t=>t.id===p.id)?.icon??'file'}));
export function ToolsDirectory(){
 const [query,setQuery]=useState(''),[category,setCategory]=useState('All tools'),[sort,setSort]=useState('recommended');
 const box=useRef<HTMLInputElement>(null);
 useEffect(()=>{if(location.hash==='#search')box.current?.focus();},[]);
 const q=query.trim().toLowerCase();
 const found0=q?searchToolsDetailed(query).tools:tools;const found=sort==='az'?[...found0].sort((a,b)=>a.name.localeCompare(b.name)):found0;
 const extraFound=extraPages.filter(p=>!q||p.name.toLowerCase().includes(q)||p.description.toLowerCase().includes(q));
 const shown=found.filter(t=>category==='All tools'||t.group===category);
 const shownExtra=extraFound.filter(p=>category==='All tools'||p.group===category);
 const total=PDF_TOOL_COUNT;
 return <section className="tools-directory" aria-label="Find a PDF tool"><label className="search"><Search size={20}/><input ref={box} type="search" value={query} onChange={e=>setQuery(e.target.value)} aria-label="Search all PDF tools" placeholder="Search tools"/></label><div className="filters" role="group" aria-label="Tool categories">{groups.filter(g=>g!=='My files').map(g=><button key={g} aria-pressed={category===g} className={category===g?'selected':''} onClick={()=>setCategory(g)}>{g} <span>{g==='All tools'?total:tools.filter(t=>t.group===g).length}</span></button>)}</div><div className="dir-bar"><label className="dir-sort">Sort <select value={sort} onChange={e=>setSort(e.target.value)} aria-label="Sort tools"><option value="recommended">Recommended</option><option value="az">A to Z</option></select></label></div><p role="status">{q||category!=='All tools'?`${shown.length+shownExtra.length} ${shown.length+shownExtra.length===1?'tool':'tools'}${q?` matching “${query}”`:''}`:`${total} free tools + ${extraPages.length} shortcuts`}</p>{groups.filter(g=>g!=='All tools'&&g!=='My files').map(g=>{const list=shown.filter(t=>t.group===g),extras=shownExtra.filter(p=>p.group===g);if(!list.length&&!extras.length)return null;return <section key={g} data-group={g.toLowerCase().split(" ")[0]}><h2>{g} <small>{list.length}{extras.length?` + ${extras.length} shortcuts`:null}</small></h2><div className="tool-grid">{list.map(t=>{return <Link className="tool-card" key={t.id} href={'/tools/'+seoTools.find(p=>p.id===t.id)!.slug}><span className="tool-icon"><ToolIdIcon id={t.id} icon={t.icon}/></span><b>{t.name}</b><p>{t.description}</p></Link>;})}{extras.map(p=><Link className="tool-card" key={p.slug} href={'/tools/'+p.slug}><span className="tool-icon"><ToolIcon name={p.icon}/></span><b>{p.name}</b><p>{p.description}</p></Link>)}</div></section>;})}{!shown.length&&!shownExtra.length&&<p>No matching tools. Try another task or choose All tools.</p>}</section>;
}
