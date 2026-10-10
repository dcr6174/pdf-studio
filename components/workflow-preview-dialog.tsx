'use client';
import {useEffect,useId,useRef,type ReactNode} from 'react';
import {X} from 'lucide-react';

export function WorkflowPreviewDialog({open,onClose,children}:{open:boolean;onClose:()=>void;children:ReactNode}){
 const ref=useRef<HTMLDialogElement>(null),title=useId(),description=useId();
 useEffect(()=>{const node=ref.current;if(!node)return;if(open&&!node.open)node.showModal();else if(!open&&node.open)node.close();return()=>{if(node.open)node.close();};},[open]);
 return <dialog ref={ref} className="workflow-preview-dialog" aria-labelledby={title} aria-describedby={description} onCancel={e=>{e.preventDefault();onClose();}} onClick={e=>{if(e.target!==e.currentTarget)return;const box=e.currentTarget.getBoundingClientRect();if(e.clientX<box.left||e.clientX>box.right||e.clientY<box.top||e.clientY>box.bottom)onClose();}}>
  <div className="workflow-preview-dialog-heading"><div><h2 id={title}>Preview PDF</h2><p id={description}>See the original file or check your workflow’s changes.</p></div><button type="button" className="secondary" aria-label="Close workflow preview" autoFocus onClick={onClose}><X size={20}/></button></div>
  {children}
 </dialog>;
}
