'use client';
import type {ReactNode} from 'react';
import {Plus,ZoomIn,ZoomOut,Maximize,Check,Settings,Trash2} from 'lucide-react';
import './mobile-edit-workspace.css';
export function MobileEditToolbar({toolbar,options,onDelete,onDone,onOptions,onAdd,disabled,zoom,onZoom,onFit}:{toolbar:ReactNode;options?:ReactNode;onDelete?:()=>void;onDone?:()=>void;onOptions?:()=>void;onAdd:()=>void;disabled:boolean;zoom:number;onZoom:(value:number)=>void;onFit:()=>void}){
 return <><div className="mobile-edit-chrome"><div className="mobile-edit-tools">{toolbar}{onOptions&&<button type="button" className="mobile-edit-options" disabled={disabled} onClick={onOptions}><Settings size={18}/><span>Options</span></button>}<button type="button" className="mobile-edit-add" aria-label="Add PDF files" title="Add PDF files" disabled={disabled} onClick={onAdd}><Plus size={22}/></button></div>{options&&<div className="mobile-edit-context">{options}<div className="mobile-edit-selection-actions">{onDelete&&<button type="button" className="mobile-edit-delete" aria-label="Delete selected element" title="Delete selected element" disabled={disabled} onClick={onDelete}><Trash2 size={18}/></button>}<button type="button" className="mobile-edit-done" aria-label="Done editing selected element" title="Done" disabled={disabled} onClick={onDone}><Check size={20}/></button></div></div>}</div><nav className="mobile-edit-zoom" aria-label="PDF zoom"><button type="button" aria-label="Zoom out" disabled={disabled||zoom<=.05} onClick={()=>onZoom(Math.max(.05,zoom-.25))}><ZoomOut size={18}/></button><button type="button" aria-label="Fit PDF to screen width" title="Fit width" disabled={disabled} onClick={onFit}><Maximize size={16}/><span>{Math.round(zoom*100)}%</span></button><button type="button" aria-label="Zoom in" disabled={disabled||zoom>=3} onClick={()=>onZoom(Math.min(3,zoom+.25))}><ZoomIn size={18}/></button></nav></>;
}



