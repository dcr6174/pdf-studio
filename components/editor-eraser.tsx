'use client';
import {useRef,type PointerEvent} from 'react';
import type {Mark} from '@/lib/pdf-client';
import {hitsAddedMark} from '@/lib/editor-hit';
export function EditorEraser({marks,onErase}:{marks:Mark[];onErase:(id:string)=>void}){
 const pointer=useRef<number|null>(null),erased=useRef(new Set<string>());
 function erase(e:PointerEvent<HTMLDivElement>){const r=e.currentTarget.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;const mark=[...marks].reverse().find(m=>!erased.current.has(m.id)&&hitsAddedMark(m,x,y,r.width,r.height));if(mark){erased.current.add(mark.id);onErase(mark.id);}}
 return <div className="editor-eraser" role="img" aria-label="Eraser: tap or drag across added elements" onPointerDown={e=>{e.stopPropagation();if(e.button!==0)return;pointer.current=e.pointerId;erased.current.clear();e.currentTarget.setPointerCapture(e.pointerId);erase(e);}} onPointerMove={e=>{if(pointer.current===e.pointerId)erase(e);}} onPointerUp={()=>{pointer.current=null;}} onPointerCancel={()=>{pointer.current=null;}}/>;
}
