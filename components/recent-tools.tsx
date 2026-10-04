'use client';
import Link from '@/components/browser-link';
import {Spotlight} from '@/components/spotlight';
import {toolIcons} from '@/lib/tool-icons';
import {seoTools} from '@/lib/seo-tools';
import {tools} from '@/lib/tools';

/** "Recently used" shortcuts. The list lives in this browser only (see lib/recent-tools.ts). */
export function RecentTools({ids,onOpen,onClear}:{ids:string[];onOpen:(id:string)=>void;onClear:()=>void}){
 const items=ids.map(id=>tools.find(t=>t.id===id)).filter((t):t is NonNullable<typeof t>=>!!t);
 if(!items.length)return null;
 return <section className="recent-tools" aria-labelledby="recent-title">
  <h2 id="recent-title">Recently used</h2>
  <Spotlight as="nav" className="recent-list" item="a" aria-label="Recently used tools">
   {items.map(t=>{const Icon=toolIcons[t.id];const page=seoTools.find(p=>p.id===t.id);
    return <Link key={t.id} href={'/tools/'+(page?.slug??t.id)} onClick={e=>{if(e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;e.preventDefault();onOpen(t.id);}}>{Icon&&<Icon size={16} aria-hidden="true"/>}{t.name}</Link>;})}
  </Spotlight>
  <button type="button" className="recent-clear" onClick={onClear}>Clear list</button>
 </section>;
}
