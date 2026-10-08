'use client';
import type {ReactNode} from 'react';
import {Plus,ZoomIn,ZoomOut,Maximize} from 'lucide-react';
import './mobile-edit-workspace.css';
export function MobileEditToolbar({toolbar,options,onAdd,disabled,zoom,onZoom,onFit}:{toolbar:ReactNode;options?:ReactNode;onAdd:()=>void;disabled:boolean;zoom:number;onZoom:(value:number)=>void;onFit:()=>void}){
 return <><div className="mobile-edit-chrome"><div className="mobile-edit-tools">{toolbar}<button type="button" className="mobile-edit-add" aria-label="Add PDF files" title="Add PDF files" disabled={disabled} onClick={onAdd}><Plus size={22}/></button></div>{options}</div><nav className="mobile-edit-zoom" aria-label="PDF zoom"><button type="button" aria-label="Zoom out" disabled={disabled||zoom<=.05} onClick={()=>onZoom(Math.max(.05,zoom-.25))}><ZoomOut size={18}/></button><button type="button" aria-label="Fit PDF to screen width" title="Fit width" disabled={disabled} onClick={onFit}><Maximize size={16}/><span>{Math.round(zoom*100)}%</span></button><button type="button" aria-label="Zoom in" disabled={disabled||zoom>=3} onClick={()=>onZoom(Math.min(3,zoom+.25))}><ZoomIn size={18}/></button></nav></>;
}
