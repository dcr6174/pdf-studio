'use client';
import Image from '@/components/browser-image';
import {useRef,useState,type ReactNode,type PointerEvent} from 'react';
import {createPortal} from 'react-dom';
import {PenLine,Plus,GripVertical,CalendarDays,Type} from 'lucide-react';
export type SigningField={kind:'image';image:string}|{kind:'text';text:string};
function DragField({field,label,children,onDrop,onPlace,disabled=false}:{disabled?:boolean;field:SigningField;label:string;children:ReactNode;onDrop:(field:SigningField,x:number,y:number)=>void;onPlace:(field:SigningField)=>void}){
 const start=useRef<{x:number;y:number;moved:boolean}|undefined>(undefined);const ignoreClick=useRef(false);
 const [ghost,setGhost]=useState<{x:number;y:number}|null>(null);
 function move(e:PointerEvent<HTMLButtonElement>){const s=start.current;if(!s)return;if(Math.hypot(e.clientX-s.x,e.clientY-s.y)>5)s.moved=true;if(s.moved)setGhost({x:e.clientX,y:e.clientY});}
 return <><button type="button" className="sign-drag-field" disabled={disabled} aria-label={label+'. Drag onto the PDF or click to place.'} onPointerDown={e=>{if(e.button!==0)return;ignoreClick.current=false;start.current={x:e.clientX,y:e.clientY,moved:false};e.currentTarget.setPointerCapture(e.pointerId);}} onPointerMove={move} onPointerUp={e=>{const s=start.current;start.current=undefined;setGhost(null);if(s?.moved){ignoreClick.current=true;onDrop(field,e.clientX,e.clientY);}}} onPointerCancel={()=>{start.current=undefined;ignoreClick.current=true;setGhost(null);}} onClick={()=>{if(!ignoreClick.current)onPlace(field);}}><GripVertical size={16} aria-hidden="true"/><span className="sign-field-preview">{children}</span></button>{ghost&&createPortal(<div className="sign-drag-ghost" style={{left:ghost.x,top:ghost.y}} aria-hidden="true">{field.kind==='image'?<Image unoptimized width={220} height={54} src={field.image} alt=""/>:field.text}</div>,document.body)}</>;
}
export function SignFieldTray({image,onCreate,onDrop,onPlace,date,compact=false,nameValue,onNameChange,dateSettings}:{dateSettings?:ReactNode;nameValue?:string;onNameChange?:(name:string)=>void;image?:string;onCreate:()=>void;onDrop:(field:SigningField,x:number,y:number)=>void;onPlace:(field:SigningField)=>void;date:string;compact?:boolean}){
 const [localName,setLocalName]=useState('');const [customText,setCustomText]=useState('');const name=nameValue??localName;const setName=(value:string)=>{setLocalName(value);onNameChange?.(value);};
 return <section className={compact?'sign-mobile-tray':'sign-field-tray'} aria-label="Signing fields">
 {!compact&&<><h2>Sign your PDF</h2><p>Drag a field onto the page. Drag it again to move; use a corner to resize.</p></>}
 {image?<><DragField label="Your signature" field={{kind:'image',image}} onDrop={onDrop} onPlace={onPlace}><Image unoptimized width={220} height={54} src={image} alt="Your signature" draggable={false}/></DragField><button type="button" className="sign-change-signature" onClick={onCreate}><PenLine size={15}/>Change signature</button></>:<button type="button" className="primary sign-create-button" onClick={onCreate}><Plus size={18}/>Create signature</button>}
 {!compact&&image&&name.trim()&&<p className="signature-owner">{name.trim()}</p>}
 {!compact&&<section className="sign-optional-fields" aria-label="Optional signing fields"><h3>Optional fields</h3>
 <section className="sign-name-fields"><h3>Name & initials</h3><label className="field">Your name<input value={name} maxLength={80} onChange={e=>setName(e.target.value)} placeholder="Enter your name"/></label></section>
 <DragField label="Initials" disabled={!name.trim()} field={{kind:'text',text:name.trim().split(/\s+/).map(word=>word[0]).join('').slice(0,8)}} onDrop={onDrop} onPlace={onPlace}><span className="sign-field-label">Initials</span><span className="sign-field-value">{name.trim()?name.trim().split(/\s+/).map(word=>word[0]).join('').slice(0,8):'Enter your name'}</span></DragField>
 <DragField label="Name" disabled={!name.trim()} field={{kind:'text',text:name.trim()}} onDrop={onDrop} onPlace={onPlace}><Type size={16}/><span className="sign-field-label">Name</span>{name.trim()&&<span className="sign-field-value">{name.trim()}</span>}</DragField>
 <DragField label="Date" field={{kind:'text',text:date}} onDrop={onDrop} onPlace={onPlace}><CalendarDays size={16}/><span className="sign-field-label">Date</span><span className="sign-field-value">{date}</span></DragField>
 {dateSettings}
 <details className="sign-extra"><summary>Custom text</summary><label className="field">Text to add<input value={customText} maxLength={160} onChange={e=>setCustomText(e.target.value)} placeholder="Enter text"/></label>{customText.trim()&&<DragField label="Text" field={{kind:'text',text:customText.trim()}} onDrop={onDrop} onPlace={onPlace}><Type size={16}/>{customText.trim()}</DragField>}</details>
 </section>}

 </section>;
}



