'use client';
import {ChevronLeft,ChevronRight} from 'lucide-react';
import {useState,type ReactNode} from 'react';
import './tool-action-layout.css';
type Page={id:string;rotation:number;fileId:string;index:number};
export function EditPageRail({pages,activePage,onPage,thumbnail,disabled}:{pages:Page[];activePage:string;onPage:(id:string)=>void;thumbnail:(page:Page)=>ReactNode;disabled:boolean}){
 const [collapsed,setCollapsed]=useState(false);
 const toggle=<button type="button" className="rail-collapse-toggle" aria-label={collapsed?'Show page previews':'Hide page previews'} title={collapsed?'Show pages':'Hide pages'} aria-expanded={!collapsed} onClick={()=>setCollapsed(v=>!v)}>{collapsed?<ChevronRight size={12}/>:<ChevronLeft size={12}/>}</button>;
 return <nav className="edit-page-rail" aria-label="Document pages" data-collapsed={collapsed}>{collapsed?toggle:<><div className="rail-page-header"><div className="rail-title-row"><h2>Pages</h2>{toggle}</div></div><div className="edit-page-list">{pages.map((page,index)=><button type="button" key={page.id} aria-label={`Show page ${index+1}`} aria-current={activePage===page.id?'page':undefined} disabled={disabled} onClick={()=>onPage(page.id)}><div className="edit-page-thumbnail">{thumbnail(page)}</div><span>Page {index+1}</span></button>)}</div></>}</nav>;
}
