'use client';
import {useEffect,useRef,useState,type ReactNode} from 'react';
import {Plus,Settings,X} from 'lucide-react';
import './clean-edit-workspace.css';

export function CleanEditControls({tools,files,settings,action,onOpen,disabled}:{tools:ReactNode;files:ReactNode;settings:ReactNode;action:ReactNode;onOpen:()=>void;disabled:boolean}){
 const [panel,setPanel]=useState<'tools'|'settings'|null>(null);
 const root=useRef<HTMLDivElement>(null);
 useEffect(()=>{const key=(e:KeyboardEvent)=>{if(e.key==='Escape')setPanel(null);};const outside=(e:PointerEvent)=>{if(e.target instanceof Node&&!root.current?.contains(e.target))setPanel(null);};window.addEventListener('keydown',key);document.addEventListener('pointerdown',outside);return()=>{window.removeEventListener('keydown',key);document.removeEventListener('pointerdown',outside);};},[]);
 const close=()=>setPanel(null);
 return <div ref={root} className="clean-edit-controls" onKeyDown={e=>{if(e.key==='Escape')close();}}>
  <nav aria-label="PDF editing controls" className="clean-edit-toolbar">
   {([{id:'settings',label:'Settings',Icon:Settings},{id:'tools',label:'Add text or image',Icon:Plus}] as const).map(({id,label,Icon})=><button key={id} type="button" title={label} aria-label={label} aria-expanded={panel===id} aria-controls="clean-edit-panel" disabled={disabled} onClick={()=>{onOpen();setPanel(p=>p===id?null:id);}}><Icon size={21} aria-hidden="true"/></button>)}
  </nav>
  {panel&&<section id="clean-edit-panel" className="clean-edit-panel" aria-label={panel==='tools'?'Add content':'Settings'}>
   <header><h2>{panel==='tools'?'Add content':'Settings'}</h2><button type="button" aria-label="Close menu" onClick={close}><X size={20}/></button></header>
   <div onClick={e=>{if(panel==='tools'&&(e.target as Element).closest('button'))close();}}>{panel==='tools'?tools:<>{settings}<details><summary>Files and pages</summary>{files}</details></>}</div>
  </section>}
  <div className="clean-edit-export">{action}</div>
 </div>;
}

