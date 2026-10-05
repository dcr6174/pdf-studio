'use client';
import {useState} from 'react';
import {ShieldCheck} from 'lucide-react';
import Link from '@/components/browser-link';
export function PrivacyProof(){
 const [open,setOpen]=useState(false);
 return <div className="privacy-proof" onMouseEnter={()=>setOpen(true)} onMouseLeave={e=>{if(!e.currentTarget.contains(document.activeElement))setOpen(false);}} onFocus={()=>setOpen(true)} onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget))setOpen(false);}} onKeyDown={e=>{if(e.key==='Escape'){setOpen(false);e.stopPropagation();}}}>
  <button type="button" className="privacy-proof-trigger" aria-expanded={open} aria-controls="privacy-proof-panel" onClick={()=>setOpen(true)}><ShieldCheck size={17} aria-hidden="true"/>Files stay on your device</button>
  <div id="privacy-proof-panel" className="privacy-proof-popover" hidden={!open}><p>PDF processing happens in your browser. Usage counting does not include your documents.</p><Link href="/check-it-yourself">Check it yourself →</Link></div>
 </div>;
}
