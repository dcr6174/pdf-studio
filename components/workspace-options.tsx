'use client';
import {useEffect,useState,type ReactNode} from 'react';
import {Sheet,SheetTrigger,SheetContent,SheetHeader,SheetTitle,SheetDescription} from '@/components/ui/sheet';
export function WorkspaceOptions({children,disabled}:{children:ReactNode;disabled:boolean}){
 const [mobile,setMobile]=useState(false);
 useEffect(()=>{const query=matchMedia('(max-width: 640px)'),update=()=>setMobile(query.matches);update();query.addEventListener('change',update);return()=>query.removeEventListener('change',update);},[]);
 return <Sheet><SheetTrigger asChild><button className="secondary" disabled={disabled}>Options</button></SheetTrigger><SheetContent side={mobile?'bottom':'right'} className="workspace-options-sheet"><SheetHeader><SheetTitle>Page options</SheetTitle><SheetDescription>Manage the current document pages. Your changes stay in this workspace.</SheetDescription></SheetHeader><fieldset disabled={disabled} className="workspace-options-body">{children}</fieldset></SheetContent></Sheet>;
}
