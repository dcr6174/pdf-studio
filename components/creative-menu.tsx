'use client';
import {useEffect,useRef,useState} from 'react';
import {ChevronDown,PenLine,NotebookPen,BookOpen,FilePenLine,Sparkles} from 'lucide-react';
import Link from '@/components/browser-link';
import {creativeTools} from '@/lib/handwriting';
const icons=[PenLine,FilePenLine,BookOpen,NotebookPen];
export function CreativeMenu({disabled=false}:{disabled?:boolean}){
 const [open,setOpen]=useState(false);const root=useRef<HTMLDivElement>(null);
 useEffect(()=>{const outside=(e:PointerEvent)=>{if(!root.current?.contains(e.target as Node))setOpen(false);};document.addEventListener('pointerdown',outside);return()=>document.removeEventListener('pointerdown',outside);},[]);
 return <div className="creative-menu" ref={root} onMouseEnter={()=>{if(!disabled)setOpen(true);}} onMouseLeave={()=>setOpen(false)} onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget as Node))setOpen(false);}} onKeyDown={e=>{if(e.key==='Escape'){setOpen(false);root.current?.querySelector('button')?.focus();}}}><button type="button" disabled={disabled} aria-expanded={open} aria-controls="creative-menu-links" onClick={()=>setOpen(v=>!v)}>Creative tools <ChevronDown size={14} aria-hidden="true"/></button>{open&&<div className="creative-menu-links" id="creative-menu-links">{creativeTools.map((tool,i)=>{const Icon=icons[i];return <Link href={'/creative/'+tool.slug} key={tool.slug}><Icon size={22} aria-hidden="true"/><span><strong>{tool.title}</strong><small>{tool.description}</small></span></Link>;})}<Link href="/creative"><Sparkles size={20} aria-hidden="true"/><strong>All creative tools</strong></Link></div>}</div>;
}
