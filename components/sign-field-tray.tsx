'use client';
import {signatureFromFile} from '@/lib/signatures';
import Image from '@/components/browser-image';
import {useRef,useState,type ReactNode,type PointerEvent} from 'react';
import {createPortal} from 'react-dom';
import {PenLine,Plus,GripVertical,CalendarDays,Type,Check} from 'lucide-react';
export type SigningField={kind:'image';image:string}|{kind:'text';text:string};
function DragField({field,label,children,onDrop,onPlace,action,disabled=false}:{action?:ReactNode;disabled?:boolean;field:SigningField;label:string;children:ReactNode;onDrop:(field:SigningField,x:number,y:number)=>void;onPlace:(field:SigningField)=>void}){
 const start=useRef<{x:number;y:number;moved:boolean}|undefined>(undefined);const ignoreClick=useRef(false);
 const [ghost,setGhost]=useState<{x:number;y:number}|null>(null);
 function move(e:PointerEvent<HTMLButtonElement>){const s=start.current;if(!s)return;if(Math.hypot(e.clientX-s.x,e.clientY-s.y)>5)s.moved=true;if(s.moved)setGhost({x:e.clientX,y:e.clientY});}
 return <><div className="sign-field-card"><button type="button" className="sign-drag-field" disabled={disabled} aria-label={label+'. Drag onto the PDF or click to place.'} onPointerDown={e=>{if(e.button!==0)return;ignoreClick.current=false;start.current={x:e.clientX,y:e.clientY,moved:false};e.currentTarget.setPointerCapture(e.pointerId);}} onPointerMove={move} onPointerUp={e=>{const s=start.current;start.current=undefined;setGhost(null);if(s?.moved){ignoreClick.current=true;onDrop(field,e.clientX,e.clientY);}}} onPointerCancel={()=>{start.current=undefined;ignoreClick.current=true;setGhost(null);}} onClick={()=>{if(!ignoreClick.current)onPlace(field);}}><GripVertical size={16} aria-hidden="true"/><span className="sign-field-preview">{children}</span></button>{action}</div>{ghost&&createPortal(<div className="sign-drag-ghost" style={{left:ghost.x,top:ghost.y}} aria-hidden="true">{field.kind==='image'?<Image unoptimized width={220} height={54} src={field.image} alt=""/>:field.text}</div>,document.body)}</>;
}
export function SignFieldTray({image,onCreate,onDrop,onPlace,date,compact=false,nameValue,onNameChange,dateSettings}:{dateSettings?:ReactNode;nameValue?:string;onNameChange?:(name:string)=>void;image?:string;onCreate:()=>void;onDrop:(field:SigningField,x:number,y:number)=>void;onPlace:(field:SigningField)=>void;date:string;compact?:boolean}){
 const uploadInput=useRef<HTMLInputElement>(null);const [artwork,setArtwork]=useState(''),[uploadError,setUploadError]=useState(''),[uploading,setUploading]=useState(false);const uploadRequest=useRef(0);
 async function uploadArtwork(file?:File){if(!file)return;const request=++uploadRequest.current;setUploading(true);setUploadError('');try{const result=await signatureFromFile(file);if(request===uploadRequest.current)setArtwork(result);}catch(error){if(request===uploadRequest.current)setUploadError(error instanceof Error?error.message:'Could not open image.');}finally{if(request===uploadRequest.current)setUploading(false);}}
 const [initialsOverride,setInitialsOverride]=useState<string|null>(null),[editingInitials,setEditingInitials]=useState(false);
 const [localName,setLocalName]=useState('');const [customText,setCustomText]=useState('');const name=nameValue??localName;const setName=(value:string)=>{setLocalName(value);onNameChange?.(value);};const initials=initialsOverride??name.trim().split(/\s+/).map(word=>word[0]).join('').slice(0,8);
 return <section className={compact?'sign-mobile-tray':'sign-field-tray'} aria-label="Signing fields">
 {!compact&&<><h2>Sign your PDF</h2><p>Drag a field onto the page. Drag it again to move; use a corner to resize.</p></>}
 {!compact&&<label className="field sign-owner-input">Your name<input value={name} maxLength={80} autoComplete="name" onChange={e=>setName(e.target.value)} placeholder="Enter your name"/></label>}
 {!image&&<button type="button" className="primary sign-create-button" onClick={onCreate}><PenLine size={18}/>Create signature</button>}
 {image?<><DragField action={<button type="button" className="sign-card-edit" aria-label="Edit signature" title="Edit signature" onClick={onCreate}><PenLine size={17}/></button>} label="Your signature" field={{kind:'image',image}} onDrop={onDrop} onPlace={onPlace}><Image unoptimized width={220} height={54} src={image} alt="Your signature" draggable={false}/></DragField><small className="sign-drag-hint">Drag onto your PDF or click, then tap the page.</small></>:null}

 {!compact&&<section className="sign-optional-fields" aria-label="Optional signing fields"><h3>Optional fields</h3>

 <DragField action={<button type="button" className="sign-card-edit" aria-label="Edit initials" title="Edit initials" onClick={()=>setEditingInitials(v=>!v)}><PenLine size={17}/></button>} label="Initials" disabled={!initials.trim()} field={{kind:'text',text:initials.trim()}} onDrop={onDrop} onPlace={onPlace}><span className="sign-field-label">Initials</span><span className="sign-field-value">{initials.trim()||'Enter your name'}</span></DragField>
 {editingInitials&&<div className="sign-initials-editor"><label className="field">Initials<input aria-label="Your initials" value={initials} maxLength={8} onChange={e=>setInitialsOverride(e.target.value)}/></label><button type="button" className="sign-card-edit" aria-label="Finish editing initials" onClick={()=>setEditingInitials(false)}><Check size={17}/></button></div>}
 <DragField label="Name" disabled={!name.trim()} field={{kind:'text',text:name.trim()}} onDrop={onDrop} onPlace={onPlace}><Type size={16}/><span className="sign-field-label">Name</span>{name.trim()&&<span className="sign-field-value">{name.trim()}</span>}</DragField>
 <section className="sign-date-field"><DragField label="Date" field={{kind:'text',text:date}} onDrop={onDrop} onPlace={onPlace}><CalendarDays size={16}/><span className="sign-field-label">Date</span><span className="sign-field-value">{date}</span></DragField>
 {dateSettings}</section>
 <section className="sign-custom-text"><label className="field">Text to add<input value={customText} maxLength={160} onChange={e=>setCustomText(e.target.value)} placeholder="Enter text"/></label>{customText.trim()&&<DragField label="Text" field={{kind:'text',text:customText.trim()}} onDrop={onDrop} onPlace={onPlace}><Type size={16}/>{customText.trim()}</DragField>}</section>
 <section className="sign-artwork"><input ref={uploadInput} type="file" hidden accept="image/png,image/jpeg,image/webp" onChange={e=>{void uploadArtwork(e.target.files?.[0]);e.target.value='';}}/>{!artwork&&<button type="button" className="secondary" disabled={uploading} onClick={()=>uploadInput.current?.click()}>{uploading?'Opening image…':'Upload image or stamp'}</button>}{artwork&&<DragField action={<button type="button" className="sign-card-edit" disabled={uploading} aria-label="Edit image or stamp" title="Edit image or stamp" onClick={()=>uploadInput.current?.click()}><PenLine size={17}/></button>} label="Image or stamp" field={{kind:'image',image:artwork}} onDrop={onDrop} onPlace={onPlace}><Image unoptimized width={220} height={54} src={artwork} alt="Image or stamp" draggable={false}/></DragField>}{uploadError&&<p role="alert">{uploadError}</p>}</section>
 </section>}

 </section>;
}



