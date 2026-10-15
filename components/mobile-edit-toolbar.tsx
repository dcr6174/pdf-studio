'use client';
import {useEffect,useRef,type ReactNode} from 'react';
import {Plus,ZoomIn,ZoomOut,Maximize,Check,Settings,Trash2,Search} from 'lucide-react';
import './mobile-edit-workspace.css';
export function MobileEditToolbar({toolbar,options,onDelete,onDone,onOptions,onAdd,disabled,zoom,onZoom,onFit}:{toolbar:ReactNode;options?:ReactNode;onDelete?:()=>void;onDone?:()=>void;onOptions?:()=>void;onAdd:()=>void;disabled:boolean;zoom:number;onZoom:(value:number)=>void;onFit:()=>void}){
 const chrome=useRef<HTMLDivElement>(null);
 useEffect(()=>{const node=chrome.current,shell=node?.closest<HTMLElement>('.mobile-edit-workspace');if(!node||!shell)return;const update=()=>shell.style.setProperty('--studio-edit-toolbar-space',node.getBoundingClientRect().height+'px');update();const observer=new ResizeObserver(update);observer.observe(node);return()=>{observer.disconnect();shell.style.removeProperty('--studio-edit-toolbar-space');};},[]);
 useEffect(()=>{
  const shell=chrome.current?.closest('.mobile-edit-workspace');if(!shell)return;
  const update=()=>{const active=document.activeElement;const typing=active instanceof HTMLElement&&active.matches('.inline-pdf-text');shell.classList.toggle('mobile-edit-text-focus',typing);};
  const blur=()=>queueMicrotask(update);
  document.addEventListener('focusin',update,true);document.addEventListener('focusout',blur,true);update();
  return()=>{document.removeEventListener('focusin',update,true);document.removeEventListener('focusout',blur,true);shell.classList.remove('mobile-edit-text-focus');};
 },[]);
 return <><div ref={chrome} className="mobile-edit-chrome"><div className="mobile-edit-tools">{toolbar}<details className="mobile-edit-zoom-menu"><summary aria-label="PDF zoom controls" title="PDF zoom controls"><Search size={20} aria-hidden="true"/></summary><nav className="mobile-edit-zoom" aria-label="PDF zoom"><button type="button" aria-label="Zoom out" disabled={disabled||zoom<=.05} onClick={()=>onZoom(Math.max(.05,zoom-.25))}><ZoomOut size={18}/></button><button type="button" aria-label="Fit PDF to screen width" title="Fit width" disabled={disabled} onClick={onFit}><Maximize size={16}/><span>{Math.round(zoom*100)}%</span></button><button type="button" aria-label="Zoom in" disabled={disabled||zoom>=3} onClick={()=>onZoom(Math.min(3,zoom+.25))}><ZoomIn size={18}/></button></nav></details>{onOptions&&<button type="button" className="mobile-edit-options" aria-label="Options" title="Options" disabled={disabled} onClick={onOptions}><Settings size={18} aria-hidden="true"/></button>}<button type="button" className="mobile-edit-add" aria-label="Add PDF files" title="Add PDF files" disabled={disabled} onClick={onAdd}><Plus size={22}/></button></div>{options&&<div className="mobile-edit-context">{options}<div className="mobile-edit-selection-actions">{onDelete&&<button type="button" className="mobile-edit-delete" aria-label="Delete selected element" title="Delete selected element" disabled={disabled} onClick={onDelete}><Trash2 size={18}/></button>}<button type="button" className="mobile-edit-done" aria-label="Done editing selected element" title="Done" disabled={disabled} onClick={onDone}><Check size={20}/></button></div></div>}</div></>;
}




