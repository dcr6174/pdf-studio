'use client';
import {InstallApp} from '@/components/install-app';
import Link from '@/components/browser-link';
import {useEffect,useState,useSyncExternalStore} from 'react';
import {Menu,Search,FileText,ChevronDown,Heart,X,Home,FolderOpen,Sparkles,BookOpen,Clock,ArrowUpRight} from 'lucide-react';
import {Dialog,DialogContent,DialogTitle,DialogDescription,DialogTrigger} from '@/components/ui/dialog';
import {tools,groups} from '@/lib/tools';
import {seoTools} from '@/lib/seo-tools';
import {toolIcons} from '@/lib/tool-icons';
import {searchTools} from '@/lib/tool-search';
import {getRecent,clearRecent} from '@/lib/recent-tools';
import {shelf,type ShelfFile} from '@/lib/shelf';
import './tools-drawer.css';
const mobileQuery='(max-width:767px)';
function subscribeMobile(onChange:()=>void){const media=matchMedia(mobileQuery);media.addEventListener('change',onChange);return()=>media.removeEventListener('change',onChange);}
const mobileSnapshot=()=>matchMedia(mobileQuery).matches;
const desktopSnapshot=()=>false;
export type NavigationHistory={currentFiles?:string[];draftFiles?:string[];onResume?:()=>void;onRestoreDraft?:()=>void;onOpenSaved?:(file:ShelfFile)=>void};
export function ToolsDrawer({onSelect,disabled=false,currentFiles=[],draftFiles=[],onResume,onRestoreDraft,onOpenSaved}:{onSelect?:(id:string)=>void;disabled?:boolean}&NavigationHistory){
 const [open,setOpen]=useState(false),[query,setQuery]=useState('');
 const mobile=useSyncExternalStore(subscribeMobile,mobileSnapshot,desktopSnapshot);
 const [recent,setRecent]=useState<string[]>([]),[saved,setSaved]=useState<ShelfFile[]>([]);
 useEffect(()=>{if(!open)return;let alive=true;queueMicrotask(()=>{if(alive)setRecent(getRecent());});shelf('list').then(rows=>{if(alive)setSaved(rows);}).catch(()=>{if(alive)setSaved([]);});return()=>{alive=false;};},[open]);
 const close=()=>{setOpen(false);setQuery('');};
 const searching=!!query.trim(),matched=searchTools(query),matches=new Set(matched.map(t=>t.id));
 function select(event:React.MouseEvent<HTMLAnchorElement>,id:string){if(event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;if(disabled){event.preventDefault();return;}if(onSelect){event.preventDefault();onSelect(id);}close();}
 function toolLink(id:string,compact=false){const tool=tools.find(t=>t.id===id),page=seoTools.find(p=>p.id===id),Icon=toolIcons[id]??FileText;return tool&&page?<Link key={id} className={compact?'drawer-quick-tool':'drawer-tool-link'} href={'/tools/'+page.slug} aria-disabled={disabled} onClick={event=>select(event,id)}><span className="drawer-tool-icon"><Icon size={18}/></span><span>{tool.name}</span>{!compact&&<ArrowUpRight size={14} className="drawer-link-arrow" aria-hidden="true"/>}</Link>:null;}
 const shortcuts=[{href:'/',label:'Home',detail:'Start fresh',Icon:Home,id:'home'},{href:'/#shelf',label:'My files',detail:'Saved on this device',Icon:FolderOpen,id:'shelf'},{href:'/lab',label:'Studio Lab',detail:'Make something fun',Icon:Sparkles},{href:'/blog',label:'Learn',detail:'Tips and guides',Icon:BookOpen}];
 return <Dialog modal={false} open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild><button className="navigation-drawer-trigger" aria-label={open?'Close studio navigation':'Open studio navigation'} aria-expanded={open} aria-controls="studio-sitemap"><Menu size={21}/></button></DialogTrigger>
  <DialogContent showCloseButton={false} viewportPositioned id="studio-sitemap" className="navigation-drawer">
   <div className="drawer-title-row"><div><span className="drawer-eyebrow">PDF STUDIO</span><DialogTitle>Your workspace</DialogTitle></div><button type="button" className="navigation-drawer-trigger drawer-close" aria-label="Close studio navigation" onClick={close}><X size={20}/></button></div>
   <DialogDescription>Find a tool. Pick up where you left off.</DialogDescription>
   <label className="navigation-drawer-search"><Search size={19}/><input type="search" autoFocus={!mobile} aria-label="Find a tool" placeholder="Search tools…" value={query} onChange={event=>setQuery(event.target.value)}/>{searching&&<button type="button" aria-label="Clear tool search" onClick={()=>setQuery('')}><X size={16}/></button>}</label>
   <nav aria-label="Site navigation" className="navigation-drawer-body">
    {searching?<section className="drawer-search-results"><h2>{matched.length} {matched.length===1?'tool':'tools'} found</h2>{matched.map(tool=>toolLink(tool.id))}{!matched.length&&<div className="drawer-empty"><Search size={24}/><b>No matching tools</b><p>Try merge, sign, compress or convert.</p><button type="button" className="secondary" onClick={()=>setQuery('')}>Show all tools</button></div>}</section>:<>
     <div className="drawer-shortcuts">{shortcuts.map(({href,label,detail,Icon,id})=><Link key={href} href={href} aria-disabled={disabled} onClick={event=>{if(id){select(event,id);return;}if(event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;if(disabled){event.preventDefault();return;}close();}}><Icon size={20}/><span><b>{label}</b><small>{detail}</small></span></Link>)}</div>
     <section className="drawer-popular"><div className="drawer-section-heading"><h2>Everyday tools</h2><Link href="/tools" onClick={close}>View all <ArrowUpRight size={13}/></Link></div><div className="drawer-quick-grid">{['merge','compress','sign','split','native-text','jpg'].map(id=>toolLink(id,true))}</div></section>
     <section className="drawer-tool-groups"><h2 className="drawer-section-label">Browse by task</h2>{groups.filter(group=>!['All tools','My files'].includes(group)).map((group,index)=>{const items=tools.filter(tool=>tool.group===group&&matches.has(tool.id));return items.length?<details key={group} className={'drawer-category category-'+index}><summary><span className="drawer-category-dot" aria-hidden="true"/><b>{group}</b><span className="drawer-category-count">{items.length}</span><ChevronDown size={17} aria-hidden="true"/></summary><div className="drawer-category-tools">{items.map(tool=>toolLink(tool.id))}</div></details>:null;})}</section>
     <details className="drawer-activity"><summary><Clock size={18}/><b>Recent work</b><span>On this device</span><ChevronDown size={17}/></summary><div>
      <section className="drawer-history"><h2>Recent files</h2>{currentFiles.length>0&&<button type="button" disabled={disabled} onClick={()=>{onResume?.();close();}}><FileText size={18}/><span><b>Current document</b><small>{currentFiles.join(', ')}</small></span></button>}{draftFiles.length>0&&<button type="button" disabled={disabled} onClick={()=>{onRestoreDraft?.();close();}}><FileText size={18}/><span><b>Saved draft</b><small>{draftFiles.join(', ')}</small></span></button>}{saved.slice(0,5).map(file=><Link key={file.id} href="/#shelf" aria-disabled={disabled} onClick={event=>{if(event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;if(disabled){event.preventDefault();return;}if(onOpenSaved){event.preventDefault();onOpenSaved(file);}close();}}><FileText size={18}/><span>{file.name}</span></Link>)}{!currentFiles.length&&!draftFiles.length&&!saved.length&&<p>Your saved files will appear here.</p>}</section>
      <section className="drawer-history"><div className="drawer-section-heading"><h2>Recently used tools</h2>{recent.length>0&&<button type="button" className="drawer-clear-history" onClick={()=>{clearRecent();setRecent([]);}}>Clear tool history</button>}</div>{recent.length?recent.slice(0,6).map(id=>toolLink(id)):<p>No tools used yet.</p>}</section>
     </div></details>
     <div className="drawer-site-links">{[['/guides','Guides'],['/about','About'],['/contact','Contact'],['/privacy','Privacy']].map(([href,label])=><Link key={href} href={href} onClick={close}>{label}</Link>)}</div>
    </>}
   </nav>
   <section className="drawer-support">{mobile&&<div className="mobile-drawer-install"><InstallApp allowManual/></div>}<Link className="drawer-donate" href="https://buymeacoffee.com/dcr6174" target="_blank" rel="noopener noreferrer"><Heart size={19} aria-hidden="true"/><span>Keep PDF Studio free<small>Support the studio</small></span><b>Donate <ArrowUpRight size={15}/></b></Link></section>
  </DialogContent>
 </Dialog>;
}
