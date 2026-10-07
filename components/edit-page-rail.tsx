'use client';
import {type ReactNode} from 'react';
import './tool-action-layout.css';
type Page={id:string;rotation:number;fileId:string;index:number};
export function EditPageRail({pages,activePage,onPage,thumbnail,disabled}:{pages:Page[];activePage:string;onPage:(id:string)=>void;thumbnail:(page:Page)=>ReactNode;disabled:boolean}){
 return <nav className="edit-page-rail" aria-label="Document pages"><h2><span>Pages</span><select aria-label="Go to PDF page" value={activePage} disabled={disabled} onChange={e=>onPage(e.target.value)}>{pages.map((page,index)=><option key={page.id} value={page.id}>{index+1}</option>)}</select></h2><div className="edit-page-list">{pages.map((page,index)=><button type="button" key={page.id} aria-label={`Show page ${index+1}`} aria-current={activePage===page.id?'page':undefined} disabled={disabled} onClick={()=>onPage(page.id)}><div className="edit-page-thumbnail">{thumbnail(page)}</div><span>Page {index+1}</span></button>)}</div></nav>;
}
