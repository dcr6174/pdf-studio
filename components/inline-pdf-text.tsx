'use client';
import {useEffect,useRef} from 'react';
export function InlinePdfText({text,onChange,onFinish}:{text:string;onChange:(text:string)=>void;onFinish:()=>void}){
 const input=useRef<HTMLTextAreaElement>(null);
 useEffect(()=>{const node=input.current;if(node){node.focus();node.setSelectionRange(node.value.length,node.value.length);}},[]);
 return <textarea ref={input} className="inline-pdf-text" aria-label="Type text on the PDF" placeholder="Type here" value={text} rows={1} spellCheck onChange={e=>onChange(e.target.value)} onPointerDown={e=>e.stopPropagation()} onPointerMove={e=>e.stopPropagation()} onClick={e=>e.stopPropagation()} onDoubleClick={e=>e.stopPropagation()} onKeyDown={e=>{e.stopPropagation();if(e.key==='Escape'||(e.key==='Enter'&&(e.ctrlKey||e.metaKey))){e.preventDefault();input.current?.blur();}}} onBlur={onFinish}/>;
}
