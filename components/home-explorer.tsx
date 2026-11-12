'use client';
import {useEffect,useMemo,useRef,useState} from 'react';
import Link from '@/components/browser-link';
import {Search,UploadCloud,X,ArrowRight,ChevronDown,Star,Clock3,ShieldCheck,LockKeyhole,BadgeCheck,Zap,FileText,Grid2X2,PenLine,Repeat2} from 'lucide-react';
import {tools,PDF_TOOL_COUNT,type Tool} from '@/lib/tools';
import {seoTools} from '@/lib/seo-tools';
import {toolIcons} from '@/lib/tool-icons';
import {searchToolsDetailed} from '@/lib/tool-search';
import {getRecent} from '@/lib/recent-tools';
import {getFavourites,toggleFavourite} from '@/lib/favourite-tools';
import {putHandoff} from '@/lib/file-handoff';
import './home-explorer.css';

const popularIds=['merge','compress','split','edit','sign','word','jpg','rotate','organize'];
const dropActions=['compress','split','merge','rotate','sign','edit','word','jpg','organize','numbers','encrypt','ocr'];
const quickIds=['merge','compress','split','word','sign','edit'];
const categoryMeta:Record<string,{icon:typeof Grid2X2;blurb:string}>={
 'Pages':{icon:Grid2X2,blurb:'Merge, split, organize and repair'},
 'Edit & sign':{icon:PenLine,blurb:'Edit text, fill forms and sign'},
 'Convert':{icon:Repeat2,blurb:'PDF to Word, images, ebooks and back'},
 'Privacy':{icon:LockKeyhole,blurb:'Protect, unlock and inspect'},
};
const groupOrder=['Pages','Edit & sign','Convert','Privacy'];
const howSteps:[string,string][]=[
 ['Choose a tool','Search or pick a task. Your file opens right there.'],
 ['Do the work','Everything runs on your device. Nothing uploads.'],
 ['Download','Save the result, or continue in the next tool.'],
];
const whyPoints:[typeof ShieldCheck,string,string][]=[
 [ShieldCheck,'Files stay on your device','Processing happens in your browser, not on a server.'],
 [Zap,'Free core tools','Every PDF tool is free, with no added watermark.'],
 [LockKeyhole,'No sign-up','Open a tool and start. No account, no email.'],
 [BadgeCheck,'Made to be clear','One job per tool, in plain language.'],
];

function href(t:Tool){return '/tools/'+(seoTools.find(p=>p.id===t.id)?.slug??t.id);}

export function HomeExplorer({onNavigate}:{onNavigate:(id:string)=>void}){
 const [query,setQuery]=useState('');
 const [recent,setRecent]=useState<string[]>([]);
 const [favourites,setFavourites]=useState<string[]>([]);
 const input=useRef<HTMLInputElement>(null),fileInput=useRef<HTMLInputElement>(null);
 const [file,setFile]=useState<File|null>(null),[drag,setDrag]=useState(false),[dropError,setDropError]=useState('');
 const [toolQuery,setToolQuery]=useState('');
 const pick=(list:FileList|null)=>{const f=list?.[0];if(!f)return;if(!/\.pdf$/i.test(f.name)&&f.type!=='application/pdf'){setDropError('That is not a PDF. Choose a .pdf file.');return;}setDropError('');setFile(f);};
 const sendTo=async(e:React.MouseEvent<HTMLAnchorElement>,t:Tool)=>{if(e.button!==0||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;e.preventDefault();if(file){try{await putHandoff(file);}catch{/* the tool will ask for the file */}}open(t.id);};
 useEffect(()=>{let alive=true;queueMicrotask(()=>{if(alive){setRecent(getRecent());setFavourites(getFavourites());}});return()=>{alive=false;};},[]);
 const searching=query.trim()!=='';
 const found=useMemo(()=>searchToolsDetailed(query),[query]);
 const toolResults=useMemo(()=>toolQuery.trim()?searchToolsDetailed(toolQuery).tools.filter(t=>!dropActions.includes(t.id)):[],[toolQuery]);
 const shown=searching?found.tools:tools;
 const open=(id:string)=>onNavigate(id);
 const follow=(e:React.MouseEvent<HTMLAnchorElement>,t:Tool)=>{if(e.button!==0||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;e.preventDefault();open(t.id);};
 const star=(e:React.MouseEvent,id:string)=>{e.preventDefault();e.stopPropagation();setFavourites(toggleFavourite(id));};
 const card=(t:Tool,compact=false)=>{
  const Icon=toolIcons[t.id]??FileText;
  return <Link key={t.id} className={compact?'hx-card hx-chip':'hx-card'} href={href(t)} onClick={e=>follow(e,t)}>
   <span className="hx-card-icon" aria-hidden="true"><Icon size={20}/></span>
   <span className="hx-card-text"><b>{t.name}</b>{!compact&&<span>{t.description}</span>}</span>
   <button type="button" className="hx-star" aria-label={favourites.includes(t.id)?`Remove ${t.name} from favourites`:`Save ${t.name} as a favourite`} aria-pressed={favourites.includes(t.id)} onClick={e=>star(e,t.id)}><Star size={16} fill={favourites.includes(t.id)?'currentColor':'none'}/></button>
  </Link>;
 };
 const chipRow=(ids:string[],label:string,Icon:typeof Clock3)=>(
  <section className="hx-row" aria-label={label}>
   <h2><Icon size={17} aria-hidden="true"/>{label}</h2>
   <div className="hx-chips">{ids.map(id=>{const t=tools.find(t=>t.id===id);return t?card(t,true):null;})}</div>
  </section>
 );
 return <div className="hx-home">
  <section className="hx-hero">
   <span className="hx-pill"><i aria-hidden="true"/>{PDF_TOOL_COUNT} tools · private by design</span>
   <h1>Everything you need to work with PDFs.</h1>
   <p>100+ free PDF tools to edit, convert, organize and protect your documents, all running on your device. No sign-up, no watermark.</p>
   <div className={'hx-drop'+(drag?' is-drag':'')+(file?' has-file':'')} onDragOver={e=>{e.preventDefault();setDrag(true);}} onDragLeave={()=>setDrag(false)} onDrop={e=>{e.preventDefault();setDrag(false);pick(e.dataTransfer.files);}}>
    <input ref={fileInput} type="file" accept=".pdf,application/pdf" hidden onChange={e=>{pick(e.target.files);e.target.value='';}}/>
    {!file?<>
     <span className="hx-drop-icon" aria-hidden="true"><UploadCloud size={26}/></span>
     <b>Drop a PDF here</b>
     <span className="hx-drop-sub">or choose one from your device, then pick what to do with it.</span>
     <button type="button" className="hx-drop-btn" onClick={()=>fileInput.current?.click()}>Choose PDF</button>
    </>:<>
     <div className="hx-file"><span className="hx-drop-icon" aria-hidden="true"><FileText size={22}/></span><span className="hx-file-name"><b title={file.name}>{file.name}</b><span>{file.size>=1048576?(file.size/1048576).toFixed(1)+' MB':Math.max(1,Math.round(file.size/1024))+' KB'}</span></span><button type="button" className="hx-file-x" aria-label="Remove this file" onClick={()=>{setFile(null);setToolQuery('');}}><X size={18}/></button></div>
     <span className="hx-drop-sub">What would you like to do?</span>
     <div className="hx-actions">{dropActions.map(id=>{const t=tools.find(t=>t.id===id);if(!t)return null;const Icon=toolIcons[t.id]??FileText;return <Link key={id} href={href(t)} onClick={e=>void sendTo(e,t)}><Icon size={18} aria-hidden="true"/>{t.name}</Link>;})}</div>
     <div className="hx-toolfind"><Search size={16} aria-hidden="true"/><input value={toolQuery} onChange={e=>setToolQuery(e.target.value)} placeholder="Find another tool…" aria-label="Find another tool for this file" onKeyDown={e=>{if(e.key==='Enter'&&toolResults.length){e.preventDefault();const t=toolResults[0];putHandoff(file).catch(()=>{}).finally(()=>open(t.id));}}}/></div>
     {toolQuery.trim()!==''&&<div className="hx-toolfind-results">{toolResults.slice(0,6).map(t=>{const Icon=toolIcons[t.id]??FileText;return <Link key={t.id} href={href(t)} onClick={e=>void sendTo(e,t)}><Icon size={16} aria-hidden="true"/>{t.name}</Link>;})}{!toolResults.length&&<span className="hx-toolfind-empty">No tools found.</span>}</div>}
    </>}
    <span className="hx-privacy"><ShieldCheck size={15} aria-hidden="true"/>Private by design: your file stays on this device. Nothing is uploaded.</span>
    {dropError&&<span className="hx-drop-error" role="alert">{dropError}</span>}
   </div>
   <div className="hx-search">
    <Search size={21} aria-hidden="true"/>
    <label className="sr-only" htmlFor="mobile-home-search">Search PDF tools</label>
    <input ref={input} id="mobile-home-search" type="search" value={query} placeholder="What would you like to do?" autoComplete="off"
     onChange={e=>setQuery(e.target.value)}
     onKeyDown={e=>{if(e.key==='Enter'&&searching&&shown.length){e.preventDefault();open(shown[0].id);}if(e.key==='Escape')setQuery('');}}/>
    {query&&<button type="button" className="hx-clear" onClick={()=>{setQuery('');input.current?.focus();}}>Clear</button>}
   </div>
   <p className="sr-only" role="status">{searching?shown.length?`${shown.length} ${shown.length===1?'tool':'tools'} found. Press Enter to open ${shown[0].name}.`:'No tools found. Try merge, compress or sign.':''}</p>
   {!searching&&<div className="hx-popular-actions">{quickIds.map(id=>{const t=tools.find(t=>t.id===id)!;return <Link key={id} href={href(t)} onClick={e=>follow(e,t)}>{t.name}<ArrowRight size={14} aria-hidden="true"/></Link>;})}</div>}
  </section>

  {searching?<section className="hx-results" aria-label="Search results">
   <div className="hx-grid">{shown.map(t=>card(t))}</div>
   {!shown.length&&<p className="hx-empty">No tools found. Try “merge”, “compress” or “sign”.</p>}
  </section>:<>
   <section className="hx-section" aria-labelledby="hx-popular-title">
    <div className="hx-section-head"><h2 id="hx-popular-title">Popular tools <span className="hx-count">{popularIds.length}</span></h2><p>Everyday favourites.</p></div>
    <div className="hx-grid hx-grid-3">{popularIds.map(id=>{const t=tools.find(t=>t.id===id);return t?card(t):null;})}</div>
   </section>

   <section className="hx-section" aria-labelledby="hx-categories-title">
    <div className="hx-section-head"><h2 id="hx-categories-title">Browse by category</h2><p>{PDF_TOOL_COUNT} tools, grouped by the job they do.</p></div>
    <div className="hx-categories">
     {groupOrder.map(g=>{
      const items=tools.filter(t=>t.group===g);
      const meta=categoryMeta[g];const Icon=meta.icon;
      return <details key={g} className="hx-category">
       <summary><span className="hx-cat-icon" aria-hidden="true"><Icon size={20}/></span><span className="hx-cat-name">{g}<span>{meta.blurb}</span></span><span className="hx-cat-count">{items.length}</span><ChevronDown size={18} aria-hidden="true"/></summary>
       <div className="hx-grid">{items.map(t=>card(t))}</div>
      </details>;
     })}
    </div>
   </section>

   {recent.length>0&&chipRow(recent.slice(0,4),'Recent activity',Clock3)}
   {favourites.length>0&&chipRow(favourites,'Favorites',Star)}

   <section className="hx-section hx-why" aria-labelledby="hx-why-title">
    <div className="hx-section-head"><h2 id="hx-why-title">Why PDF Studio</h2></div>
    <ul>{whyPoints.map(([Icon,title,text])=><li key={title}><Icon size={20} aria-hidden="true"/><div><b>{title}</b><p>{text}</p></div></li>)}</ul>
   </section>

   <section className="hx-section hx-how" aria-labelledby="hx-how-title">
    <div className="hx-section-head"><h2 id="hx-how-title">How it works</h2></div>
    <ol>{howSteps.map(([title,text],i)=><li key={title}><span aria-hidden="true">{String(i+1).padStart(2,'0')}</span><div><b>{title}</b><p>{text}</p></div></li>)}</ol>
   </section>

   <Link className="hx-directory" href="/tools">Explore all {PDF_TOOL_COUNT} tools<ArrowRight size={18} aria-hidden="true"/></Link>


  </>}
 </div>;
}
