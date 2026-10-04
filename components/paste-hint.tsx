'use client';
import {useEffect,useState} from 'react';
import {ClipboardPaste} from 'lucide-react';

/** One quiet line under the drop zone. Hidden on touch screens (no Ctrl+V there). */
export function PasteHint(){
 const [mac,setMac]=useState(false);
 useEffect(()=>{queueMicrotask(()=>setMac(/Mac|iPhone|iPad/.test(navigator.platform||navigator.userAgent)));},[]);
 return <p className="paste-hint"><ClipboardPaste size={16} aria-hidden="true"/>Copy a file, then press <kbd>{mac?'⌘':'Ctrl'}</kbd> + <kbd>V</kbd> to paste it here.</p>;
}
