'use client';
import {useLayoutEffect,useRef,type PointerEvent} from 'react';
export function InlinePdfText({text,onChange,onFinish,onEmptyDrag}:{onEmptyDrag?:(e:PointerEvent<HTMLTextAreaElement>)=>void;text:string;onChange:(text:string)=>void;onFinish:()=>void}){
 const input=useRef<HTMLTextAreaElement>(null);
 useLayoutEffect(()=>{const node=input.current;if(node){node.focus();node.setSelectionRange(node.value.length,node.value.length);}},[]);
 return <textarea ref={input} className="inline-pdf-text" aria-label="Type text on the PDF" placeholder="Type here" value={text} rows={1} autoFocus spellCheck onChange={e=>onChange(e.target.value)} onFocus={e=>e.stopPropagation()} onPointerDown={e=>{e.stopPropagation();if(!text.trim()&&e.button===0)onEmptyDrag?.(e);}} onPointerMove={e=>e.stopPropagation()} onClick={e=>e.stopPropagation()} onDoubleClick={e=>e.stopPropagation()} onKeyDown={e=>{e.stopPropagation();if(e.key==='Escape'||(e.key==='Enter'&&(e.ctrlKey||e.metaKey))){e.preventDefault();input.current?.blur();}}} onBlur={onFinish}/>;
}
