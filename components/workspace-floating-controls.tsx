'use client';
import {useState,type ReactNode} from 'react';
import {Info,Plus} from 'lucide-react';
import {Dialog,DialogContent,DialogTitle,DialogDescription} from '@/components/ui/dialog';

export function WorkspaceFloatingControls({pages,about,addLabel,onAdd,disabled}:{pages?:ReactNode;about:string;addLabel:string;onAdd:()=>void;disabled:boolean}){
 const [panel,setPanel]=useState<'pages'|'about'|null>(null);
 return <><nav className="workspace-floating-controls" aria-label="Document shortcuts">
 {pages&&<button type="button" disabled={disabled} onClick={()=>setPanel('pages')} aria-label="Organize pages" title="Organize pages"><OrganizePagesIcon/></button>}
 <button type="button" className="workspace-desktop-info" disabled={disabled} onClick={()=>setPanel('about')} aria-label="About this tool" title="About this tool"><Info size={22}/></button>
 <button type="button" className="workspace-mobile-add" disabled={disabled} onClick={onAdd} aria-label={addLabel} title={addLabel}><Plus size={22}/><span>{addLabel}</span></button>
 </nav><Dialog open={panel!==null} onOpenChange={open=>{if(!open)setPanel(null);}}><DialogContent className="workspace-shortcut-panel"><DialogTitle>{panel==='pages'?'Organize pages':'About this tool'}</DialogTitle><DialogDescription>{panel==='pages'?'Changes apply to your current document. Your original files are retained.':about}</DialogDescription>{panel==='pages'&&<div className="page-settings-controls">{pages}</div>}</DialogContent></Dialog></>;
}

export function OrganizePagesIcon(){return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><rect x="3" y="3" width="7" height="8" rx="1.5"/><rect x="14" y="3" width="7" height="8" rx="1.5"/><rect x="3" y="15" width="7" height="6" rx="1.5"/><path d="M14 17h7m-3-3 3 3-3 3"/></svg>;}
