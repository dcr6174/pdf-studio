'use client';
import {type ReactNode} from 'react';
import {Plus,X} from 'lucide-react';
import './tool-action-layout.css';
export function ToolActionBar({title,summary,settings,shortcuts,children,action,onReplace,onClear,disabled}:{title:string;summary:string;settings:ReactNode;shortcuts?:ReactNode;children?:ReactNode;action:ReactNode;onReplace?:()=>void;onClear:()=>void;disabled:boolean}){
 return <aside className="action-bar shared-tool-action-bar" aria-label="Tool actions">
  <header className="tool-action-heading"><div className="tool-action-title-row"><h2>{title}</h2><button type="button" className="icon-button tool-action-clear" title="Clear workspace" aria-label="Clear workspace" disabled={disabled} onClick={onClear}><X size={20}/></button></div><p>{summary}</p><div className="row">{onReplace&&<button type="button" className="icon-button" title="Add files" aria-label="Add files" disabled={disabled} onClick={onReplace}><Plus size={20}/></button>}</div></header>
  <div className="tool-action-settings">{shortcuts}{children}{settings}</div>
  <div className="tool-action-bottom">{action}</div>
 </aside>;
}

