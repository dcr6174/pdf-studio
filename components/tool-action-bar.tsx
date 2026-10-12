'use client';
import {type ReactNode} from 'react';
import {Plus,X} from 'lucide-react';
import {toolIcons} from '@/lib/tool-icons';
import './tool-action-layout.css';
export function ToolActionBar({title,toolId,summary,settings,shortcuts,children,action,onReplace,onClear,disabled}:{title:string;toolId?:string;summary:string;settings:ReactNode;shortcuts?:ReactNode;children?:ReactNode;action:ReactNode;onReplace?:()=>void;onClear:()=>void;disabled:boolean}){
 const Symbol=toolId?toolIcons[toolId]:undefined;
 return <aside className="action-bar shared-tool-action-bar" aria-label="Tool actions">
  <header className="tool-action-heading"><div className="tool-action-title-row"><div className="tool-action-identity">{Symbol&&<span className="tool-action-symbol" aria-hidden="true"><Symbol size={36}/></span>}<h2>{title}</h2></div><button type="button" className="icon-button tool-action-clear" title="Clear workspace" aria-label="Clear workspace" disabled={disabled} onClick={onClear}><X size={20}/></button></div><p>{summary}</p>{onReplace&&<div className="row"><button type="button" className="icon-button" title="Add files" aria-label="Add files" disabled={disabled} onClick={onReplace}><Plus size={20}/></button></div>}</header>
  <div className="tool-action-settings">{shortcuts}{children}{settings}</div>
  <div className="tool-action-bottom">{action}</div>
 </aside>;
}

