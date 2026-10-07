'use client';
import {useState,type ReactNode} from 'react';
import {CardMouseSensor,CardTouchSensor} from '@/components/document-drag-sensors';
import {DndContext,KeyboardSensor,closestCenter,useSensor,useSensors,type DragEndEvent} from '@dnd-kit/core';
import {SortableContext,useSortable,sortableKeyboardCoordinates,rectSortingStrategy} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import {ArrowUp,ArrowDown,Trash2,Plus,RotateCw} from 'lucide-react';
import type {Loaded,PageItem} from '@/lib/pdf-client';
import {formatBytes} from '@/components/file-facts';
import './merge-files.css';
type Props={fileLabel?:string;files:Loaded[];disabled:boolean;onMove:(index:number,direction:number)=>void;onRemove:(id:string)=>void;preview?:(file:Loaded,page?:PageItem)=>ReactNode;retainedPages?:(file:Loaded)=>number;pages?:PageItem[];onRotatePage?:(id:string)=>void;onRemovePage?:(id:string)=>void;onMovePage?:(id:string,direction:number)=>void;onAdd?:()=>void};
function FileCard({file,index,props}:{file:Loaded;index:number;props:Props}){
 const [expanded,setExpanded]=useState(false);
 const {setNodeRef,attributes,listeners,transform,transition,isDragging}=useSortable({id:file.id,disabled:props.disabled});
 const pages=props.pages?.filter(p=>p.fileId===file.id)??[];
 return <li ref={setNodeRef} {...attributes} {...listeners} aria-label={'Reorder '+file.name} className="merge-document-card" style={{transform:CSS.Transform.toString(transform),transition,opacity:isDragging?.5:1}}>
 <div className="merge-card-top"><span className="merge-order">{index+1}</span><button type="button" className="merge-remove" disabled={props.disabled} onClick={()=>props.onRemove(file.id)} aria-label={'Remove '+file.name}><Trash2 size={18}/></button></div>
 <div className="merge-cover" aria-hidden="true">{props.preview?.(file)}</div><div className="merge-file-info"><b title={file.name}>{file.name}</b><small>{props.retainedPages?.(file)??file.pages} pages · {formatBytes(file.size)}</small></div>
 <div className="merge-card-actions"><button type="button" disabled={props.disabled} aria-expanded={expanded} onClick={()=>setExpanded(v=>!v)}>{expanded?'Close pages':'Edit pages'}</button></div>
 {expanded&&<div className="merge-inline-pages" role="region" aria-label={'Pages in '+file.name}>{pages.map((page,i)=><div className="merge-inline-page" key={page.id}><div className="merge-page-thumb" aria-hidden="true">{props.preview?.(file,page)}</div><span>Page {i+1}</span><div><button type="button" disabled={props.disabled||i===0} onClick={()=>props.onMovePage?.(page.id,-1)} aria-label={'Move page '+(i+1)+' earlier in '+file.name}><ArrowUp size={14}/></button><button type="button" disabled={props.disabled||i===pages.length-1} onClick={()=>props.onMovePage?.(page.id,1)} aria-label={'Move page '+(i+1)+' later in '+file.name}><ArrowDown size={14}/></button><button type="button" disabled={props.disabled} onClick={()=>props.onRotatePage?.(page.id)} aria-label={'Rotate page '+(i+1)+' in '+file.name}><RotateCw size={14}/></button><button type="button" disabled={props.disabled} onClick={()=>props.onRemovePage?.(page.id)} aria-label={'Remove page '+(i+1)+' from '+file.name}><Trash2 size={14}/></button></div></div>)}{!pages.length&&<p>No pages remain. Remove this file or add another document.</p>}</div>}
 </li>;
}
export function MergeFiles(props:Props){
 const sensors=useSensors(useSensor(CardMouseSensor,{activationConstraint:{distance:8}}),useSensor(CardTouchSensor,{activationConstraint:{delay:250,tolerance:8}}),useSensor(KeyboardSensor,{coordinateGetter:sortableKeyboardCoordinates}));
 function reorder(e:DragEndEvent){if(props.disabled||!e.over||e.active.id===e.over.id)return;const from=props.files.findIndex(f=>f.id===e.active.id),to=props.files.findIndex(f=>f.id===e.over!.id);if(from>=0&&to>=0)props.onMove(from,to-from);}
 return <section className="merge-files merge-focused" aria-label="Documents in output order"><div className="merge-list-heading"><div><h2>Arrange your {props.fileLabel??'PDFs'}</h2><p>Drag a document to reorder. On touch screens, hold then drag.</p></div><button type="button" className="secondary" disabled={props.disabled} onClick={props.onAdd}><Plus size={18}/>Add {props.fileLabel??'PDFs'}</button></div><DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={reorder}><SortableContext items={props.files.map(f=>f.id)} strategy={rectSortingStrategy}><ol className="merge-document-grid">{props.files.map((file,index)=><FileCard key={file.id} file={file} index={index} props={props}/>)}</ol></SortableContext></DndContext></section>;
}
