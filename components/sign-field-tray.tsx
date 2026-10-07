'use client';
import {useRef,useState,type ReactNode,type PointerEvent} from 'react';
import {createPortal} from 'react-dom';
import {PenLine,Plus,GripVertical,CalendarDays,Type} from 'lucide-react';
export type SigningField={kind:'image';image:string}|{kind:'text';text:string};
function DragField({field,label,children,onDrop,onPlace}:{field:SigningField;label:string;children:ReactNode;onDrop:(field:SigningField,x:number,y:number)=>void;onPlace:(field:SigningField)=>void}){
 const start=useRef<{x:number;y:number;moved:boolean}|undefined>(undefined);const ignoreClick=useRef(false);
 const [ghost,setGhost]=useState<{x:number;y:number}|null>(null);
 function move(e:PointerEvent<HTMLButtonElement>){const s=start.current;if(!s)return;if(Math.hypot(e.clientX-s.x,e.clientY-s.y)>5)s.moved=true;if(s.moved)setGhost({x:e.clientX,y:e.clientY});}
 return <><button type="button" className="sign-drag-field" aria-label={label+'. Drag onto the PDF or click to place.'} onPointerDown={e=>{if(e.button!==0)return;ignoreClick.current=false;start.current={x:e.clientX,y:e.clientY,moved:false};e.currentTarget.setPointerCapture(e.pointerId);}} onPointerMove={move} onPointerUp={e=>{const s=start.current;start.current=undefined;setGhost(null);if(s?.moved){ignoreClick.current=true;onDrop(field,e.clientX,e.clientY);}}} onPointerCancel={()=>{start.current=undefined;ignoreClick.current=true;setGhost(null);}} onClick={()=>{if(!ignoreClick.current)onPlace(field);}}><GripVertical size={16} aria-hidden="true"/><span className="sign-field-preview">{children}</span></button>{ghost&&createPortal(<div className="sign-drag-ghost" style={{left:ghost.x,top:ghost.y}} aria-hidden="true">{field.kind==='image'?<img src={field.image} alt=""/>:field.text}</div>,document.body)}</>;
}
export function SignFieldTray({image,onCreate,onDrop,onPlace,date,compact=false}:{image?:string;onCreate:()=>void;onDrop:(field:SigningField,x:number,y:number)=>void;onPlace:(field:SigningField)=>void;date:string;compact?:boolean}){
 const [name,setName]=useState('');
 return <section className={compact?'sign-mobile-tray':'sign-field-tray'} aria-label="Signing fields">
 {!compact&&<><h2>Sign your PDF</h2><p>Drag a field onto the page. Drag it again to move; use a corner to resize.</p></>}
 {image?<><DragField label="Your signature" field={{kind:'image',image}} onDrop={onDrop} onPlace={onPlace}><img src={image} alt="Your signature" draggable={false}/></DragField><button type="button" className="sign-change-signature" onClick={onCreate}><PenLine size={15}/>Change signature</button></>:<button type="button" className="primary sign-create-button" onClick={onCreate}><Plus size={18}/>Create signature</button>}
 {!compact&&<details className="sign-extra"><summary>Initials, name & date</summary><label className="field">Your name<input value={name} maxLength={80} onChange={e=>setName(e.target.value)} placeholder="Enter your name"/></label>{name.trim()&&<><DragField label="Name" field={{kind:'text',text:name.trim()}} onDrop={onDrop} onPlace={onPlace}><Type size={16}/>{name.trim()}</DragField><DragField label="Initials" field={{kind:'text',text:name.trim().split(/\s+/).map(word=>word[0]).join('').slice(0,8)}} onDrop={onDrop} onPlace={onPlace}>Initials · {name.trim().split(/\s+/).map(word=>word[0]).join('').slice(0,8)}</DragField></>}<DragField label="Date" field={{kind:'text',text:date}} onDrop={onDrop} onPlace={onPlace}><CalendarDays size={16}/>{date}</DragField></details>}
 </section>;
}
