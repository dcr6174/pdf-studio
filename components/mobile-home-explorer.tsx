'use client';
import {useRef,useState} from 'react';
import {Search,X,ChevronRight,FileText} from 'lucide-react';
import Link from '@/components/browser-link';
import {BuddyHero} from '@/components/buddy-hero';
import {tools,type Tool} from '@/lib/tools';
import {seoTools} from '@/lib/seo-tools';
import {toolIcons} from '@/lib/tool-icons';
import {searchToolsDetailed} from '@/lib/tool-search';
import './mobile-home-explorer.css';

const favourites=[['merge','Merge PDF'],['compress','Compress PDF'],['split','Split PDF'],['edit','Edit PDF'],['sign','Sign PDF'],['word','PDF to Word'],['images','Images to PDF'],['docx','Word to PDF'],['rotate','Rotate PDF'],['organize','Organize pages']];
const categories=[['All','All'],['Pages','Pages'],['Edit & sign','Edit & sign'],['Convert','Convert'],['Privacy','Privacy']];
export function MobileHomeExplorer({onNavigate}:{onNavigate:(id:string)=>void}){
 const [query,setQuery]=useState(''),[category,setCategory]=useState('All'),[open,setOpen]=useState(false),[active,setActive]=useState(-1);
 const input=useRef<HTMLInputElement>(null),list=useRef<HTMLDivElement>(null);
 const found=searchToolsDetailed(query),suggestions=query.trim()?found.tools.slice(0,5):[];
 const expanded=open&&!!query.trim(),items=(query.trim()?found.tools:tools).filter(t=>category==='All'||t.group===category);
 const href=(t:Tool)=>'/tools/'+(seoTools.find(p=>p.id===t.id)?.slug??t.id);
 const choose=(t:Tool)=>{setOpen(false);input.current?.blur();onNavigate(t.id);};
 const selectIndex=(index:number)=>{setOpen(true);setActive(index);requestAnimationFrame(()=>list.current?.children[index]?.scrollIntoView({block:'nearest'}));};
 const follow=(e:React.MouseEvent<HTMLAnchorElement>,t:Tool)=>{if(e.button!==0||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;e.preventDefault();choose(t);};
 return <div className="mobile-home-explorer">
  <section className="mobile-home-welcome"><div><h1>What would you like to do with your PDF?</h1><p>Your files stay on your device.</p></div><div className="mobile-home-buddy" aria-hidden="true"><BuddyHero/></div></section>
  <section className="mobile-tool-search" aria-label="Search PDF tools" onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget as Node|null)){setOpen(false);setActive(-1);}}}>
   <div className="mobile-tool-search-field"><Search size={20} aria-hidden="true"/><label className="sr-only" htmlFor="mobile-home-search">Search PDF tools</label><input ref={input} id="mobile-home-search" type="search" role="combobox" aria-autocomplete="list" aria-haspopup="listbox" aria-expanded={expanded} aria-controls="mobile-tool-suggestions" aria-activedescendant={expanded&&active>=0&&suggestions[active]?'mobile-tool-option-'+suggestions[active].id:undefined} aria-describedby="mobile-tool-search-status" autoComplete="off" placeholder="Search tools — try ‘smaller’" value={query} onFocus={()=>setOpen(true)} onChange={e=>{setQuery(e.target.value);setCategory('All');setOpen(true);setActive(-1);}} onKeyDown={e=>{if(e.nativeEvent.isComposing)return;if(e.key==='ArrowDown'&&suggestions.length){e.preventDefault();selectIndex(Math.min(suggestions.length-1,active+1));}else if(e.key==='ArrowUp'&&suggestions.length){e.preventDefault();selectIndex(active<0?suggestions.length-1:Math.max(0,active-1));}else if(e.key==='Escape'){e.preventDefault();setOpen(false);setActive(-1);}else if(e.key==='Enter'&&expanded&&active>=0&&suggestions[active]){e.preventDefault();choose(suggestions[active]);}}}/>{query&&<button type="button" aria-label="Clear tool search" onClick={()=>{setQuery('');setActive(-1);setOpen(false);input.current?.focus();}}><X size={18}/></button>}</div>
   <p id="mobile-tool-search-status" className="sr-only" role="status">{query.trim()?suggestions.length?`${found.tools.length} matching tools. Use arrow keys to choose a suggestion and Enter to open it.`:'No tools found. Try merge, compress or sign.':''}</p>
   {expanded&&<><div ref={list} id="mobile-tool-suggestions" role="listbox" aria-label="Suggested PDF tools">{suggestions.map((t,i)=>{const Icon=toolIcons[t.id]??FileText;return <div key={t.id} id={'mobile-tool-option-'+t.id} role="option" aria-selected={active===i} tabIndex={-1} onMouseDown={e=>e.preventDefault()} onClick={()=>choose(t)}><Icon size={20} aria-hidden="true"/><span><b>{t.name}</b><small>{t.description}</small></span><ChevronRight size={16} aria-hidden="true"/></div>;})}</div>{!suggestions.length&&<p className="mobile-search-empty">No matching tools. Try “merge”, “compress” or “sign”.</p>}</>}
  </section>
  <section className="mobile-popular-tools" aria-labelledby="mobile-popular-title"><h2 id="mobile-popular-title">Popular tools</h2><div className="mobile-popular-grid">{favourites.map(([id,label])=>{const t=tools.find(t=>t.id===id);if(!t)return null;const Icon=toolIcons[id]??FileText;return <Link key={id} href={href(t)} onClick={e=>follow(e,t)} className="mobile-popular-tile" data-category={t.group}><Icon size={22} aria-hidden="true"/><span>{label}</span></Link>;})}</div></section>
  <section className="mobile-full-catalogue" aria-labelledby="mobile-catalogue-title"><h2 id="mobile-catalogue-title">Browse all {tools.length} tools</h2><div className="mobile-category-strip" role="group" aria-label="Tool categories">{categories.map(([value,label])=><button key={value} type="button" aria-pressed={category===value} onClick={()=>{setCategory(value);setQuery('');setOpen(false);setActive(-1);}}>{label}</button>)}</div><div className="mobile-catalogue-heading"><h3>{query.trim()?'Search results':category==='All'?'All tools':category}</h3><span>{items.length} tools</span></div><div className="mobile-catalogue-list">{items.map(t=>{const Icon=toolIcons[t.id]??FileText;return <Link key={t.id} href={href(t)} onClick={e=>follow(e,t)} className="mobile-catalogue-card" data-category={t.group}><span className="mobile-catalogue-icon"><Icon size={21} aria-hidden="true"/></span><span><b>{t.name}</b><small>{t.description}</small></span><ChevronRight size={17} aria-hidden="true"/></Link>;})}</div>{!items.length&&<p className="mobile-search-empty">No matching tools. Clear your search to browse everything.</p>}</section>
 </div>;
}

