'use client';
import {useState,type ReactNode} from 'react';
import {Plus,Settings,ArrowDownAZ,ArrowUpAZ} from 'lucide-react';
import {Dialog,DialogContent,DialogTitle,DialogDescription} from '@/components/ui/dialog';
import './mobile-workspace-controls.css';
import {WorkspaceFloatingControls} from '@/components/workspace-floating-controls';

type FileInfo={id:string;name:string;pages:number};
export function MobileWorkspaceControls({files,pageCount,addLabel,onAdd,onSort,onClear,settings,settingsAvailable,action,disabled,organize,initialFocusId,addAvailable=true}:{files:FileInfo[];pageCount:number;addLabel:string;onAdd:()=>void;onSort?:(descending:boolean)=>void;onClear:()=>void;settings:ReactNode;settingsAvailable:boolean;action:ReactNode;disabled:boolean;organize?:ReactNode;initialFocusId?:string;addAvailable?:boolean}) {
 const [settingsOpen,setSettingsOpen]=useState(false);
 const [descending,setDescending]=useState(false);
 return <>
  {(organize||settingsAvailable||addAvailable||onSort&&files.length>1)&&<nav className="mobile-workspace-controls" aria-label="Document controls">
   {(settingsAvailable||organize)&&<button type="button" disabled={disabled} onClick={()=>setSettingsOpen(true)} aria-label="Settings" title="Settings" aria-expanded={settingsOpen}><Settings size={20} aria-hidden="true"/></button>}
   {addAvailable&&<button type="button" className="mobile-add-control" disabled={disabled} onClick={onAdd} aria-label={addLabel} title={addLabel}><Plus size={22} aria-hidden="true"/></button>}
   {onSort&&files.length>1&&<button type="button" disabled={disabled} onClick={()=>{onSort(descending);setDescending(value=>!value);}} aria-label={descending?'Sort files Z to A':'Sort files A to Z'} title={descending?'Sort Z–A':'Sort A–Z'}>{descending?<ArrowUpAZ size={20} aria-hidden="true"/>:<ArrowDownAZ size={20} aria-hidden="true"/>}</button>}
  </nav>}
  <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}><DialogContent className="mobile-workspace-panel" onOpenAutoFocus={event=>{const field=initialFocusId?document.getElementById(initialFocusId):null;if(field){event.preventDefault();field.focus();}}}>
   <DialogTitle>Tool settings</DialogTitle><DialogDescription>Adjust your tool or organize pages below.</DialogDescription>
   <p>{files.length} {files.length===1?'file':'files'} · {pageCount} pages</p>
   <WorkspaceFloatingControls pages={organize} disabled={disabled}/>{settingsAvailable&&settings}
   <button type="button" className="secondary" disabled={disabled} onClick={()=>{setSettingsOpen(false);onClear();}}>Clear workspace</button>
   <button type="button" className="primary" onClick={()=>setSettingsOpen(false)}>Done</button>
  </DialogContent></Dialog>
  {action&&<div className="mobile-workspace-action">{action}</div>}
 </>;
}
