'use client';
import {useState,type ReactNode} from 'react';
import {Plus,Files,Settings2,X} from 'lucide-react';
import './mobile-workspace-controls.css';

type FileInfo={id:string;name:string;pages:number};
export function MobileWorkspaceControls({files,pageCount,addLabel,onAdd,settings,settingsAvailable,action,disabled}:{files:FileInfo[];pageCount:number;addLabel:string;onAdd:()=>void;settings:ReactNode;settingsAvailable:boolean;action:ReactNode;disabled:boolean}) {
 const [panel,setPanel]=useState<'files'|'settings'|null>(null);
 const toggle=(next:'files'|'settings')=>setPanel(current=>current===next?null:next);
 return <>
  <nav className="mobile-workspace-controls" aria-label="Document controls">
   <button type="button" disabled={disabled} onClick={()=>{setPanel(null);onAdd();}} aria-label={addLabel} title={addLabel}><Plus size={20} aria-hidden="true"/><span>{addLabel==='Replace file'?'Replace':'Add files'}</span></button>
   <button type="button" disabled={disabled||!files.length} onClick={()=>toggle('files')} aria-expanded={panel==='files'} aria-controls="mobile-workspace-panel"><Files size={20} aria-hidden="true"/><span>Files ({files.length})</span></button>
   <button type="button" disabled={disabled||!settingsAvailable} onClick={()=>toggle('settings')} aria-expanded={panel==='settings'} aria-controls="mobile-workspace-panel"><Settings2 size={20} aria-hidden="true"/><span>Settings</span></button>
  </nav>
  {panel&&<section className="mobile-workspace-panel" id="mobile-workspace-panel" aria-label={panel==='files'?'Open files':'Tool settings'} onKeyDown={e=>{if(e.key==='Escape')setPanel(null);}}>
   <header><h2>{panel==='files'?'Files':'Settings'}</h2><button type="button" onClick={()=>setPanel(null)} aria-label="Close panel"><X size={20}/></button></header>
   {panel==='settings'?settings:<><p>{files.length} {files.length===1?'file':'files'} · {pageCount} pages</p><ul>{files.map(file=><li key={file.id}><b>{file.name}</b><span>{file.pages} pages</span></li>)}</ul></>}
  </section>}
  {action&&<div className="mobile-workspace-action">{action}</div>}
 </>;
}
