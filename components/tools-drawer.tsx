'use client';
import {useState} from 'react';
import {Menu,Search,FileText,ChevronDown} from 'lucide-react';
import {Dialog,DialogContent,DialogTitle,DialogDescription,DialogTrigger} from '@/components/ui/dialog';
import {tools,groups} from '@/lib/tools';
import {seoTools} from '@/lib/seo-tools';
import {toolIcons} from '@/lib/tool-icons';
import {searchTools} from '@/lib/tool-search';
import './tools-drawer.css';
export function ToolsDrawer({onSelect,disabled=false}:{onSelect?:(id:string)=>void;disabled?:boolean}){
 const [open,setOpen]=useState(false),[query,setQuery]=useState('');
 const matches=new Set(searchTools(query).map(t=>t.id));
 return <Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><button className="navigation-drawer-trigger" aria-label="Open site navigation"><Menu size={21}/></button></DialogTrigger><DialogContent className="navigation-drawer"><DialogTitle>Tools</DialogTitle><DialogDescription>Find a tool or explore PDF Studio.</DialogDescription><label className="navigation-drawer-search"><Search size={18}/><input type="search" autoFocus aria-label="Find a tool" placeholder="Find a tool" value={query} onChange={e=>setQuery(e.target.value)}/></label><nav aria-label="Site navigation" className="navigation-drawer-body">{groups.filter(g=>!['All tools','My files'].includes(g)).map((g,i)=>{const items=tools.filter(t=>t.group===g&&matches.has(t.id));return items.length?<details key={g} open={query.trim()?true:undefined} className={'drawer-category category-'+i}><summary>{g}<ChevronDown size={16}/></summary>{items.map(t=>{const page=seoTools.find(p=>p.id===t.id),Icon=toolIcons[t.id]??FileText;return page?<a key={t.id} href={'/tools/'+page.slug} aria-disabled={disabled} onClick={e=>{if(e.button!==0||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;if(disabled){e.preventDefault();return;}if(onSelect){e.preventDefault();onSelect(t.id);}setOpen(false);setQuery('');}}><Icon size={18}/>{t.name}</a>:null;})}</details>:null;})}{!matches.size&&<p role="status">No matching tools.</p>}<div className="drawer-site-links">{[['/tools','All tools'],['/#shelf','My files'],['/lab','Studio Lab'],['/guides','Guides'],['/blog','Blog'],['/about','About'],['/contact','Contact'],['/privacy','Privacy']].map(([href,label])=><a key={href} href={href} onClick={e=>{if(href==='/#shelf'&&onSelect&&!e.ctrlKey&&!e.metaKey){e.preventDefault();onSelect('shelf');}setOpen(false);}}>{label}</a>)}</div></nav></DialogContent></Dialog>;
}
