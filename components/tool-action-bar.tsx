'use client';
import {type ReactNode} from 'react';
import {Settings,Plus,X} from 'lucide-react';
import './tool-action-layout.css';
export function ToolActionBar({title,summary,settings,children,action,onReplace,onClear,disabled}:{title:string;summary:string;settings:ReactNode;children?:ReactNode;action:ReactNode;onReplace:()=>void;onClear:()=>void;disabled:boolean}){
 return <aside className="action-bar shared-tool-action-bar" aria-label="Tool actions">
  <header className="tool-action-heading"><h2>{title}</h2><p>{summary}</p><div className="row"><button type="button" className="icon-button" title="Add or replace files" aria-label="Add or replace files" disabled={disabled} onClick={onReplace}><Plus size={20}/></button><button type="button" className="icon-button" title="Clear workspace" aria-label="Clear workspace" disabled={disabled} onClick={onClear}><X size={20}/></button></div></header>
  <div className="tool-action-settings">{children}<details className="task-settings-disclosure"><summary aria-label="Settings" title="Settings"><Settings size={20}/></summary>{settings}</details></div>
  <div className="tool-action-bottom">{action}</div>
 </aside>;
}
