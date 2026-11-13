'use client';
import {useEffect} from 'react';
import {useRouter} from 'next/navigation';
import {isNativeApp,nativeTakePendingOpen} from '@/lib/app-bridge';
import {putHandoff} from '@/lib/file-handoff';
/** Where a file handed over by the Android app opens. Reader-tool values come from the native reader's tools menu; an unknown value opens the editor, never the tool catalogue. */
export function appOpenRoute(dest?:string):string{
 switch(dest){
  case undefined:case 'reader':return '/tools/pdf-reader';
  case 'tools':return '/';
  case 'sign':return '/tools/sign-pdf';
  case 'draw':return '/tools/add-text-and-images?mode=sketch';
  case 'highlight':return '/tools/add-text-and-images?mode=highlight';
  case 'text':return '/tools/add-text-and-images?mode=text';
  default:return typeof dest==='string'&&/^tool:[a-z0-9-]{1,60}$/.test(dest)?'/tools/'+dest.slice(5):'/tools/add-text-and-images';
 }
}
/** Inside the Android app: takes a PDF that arrived via Open with / share sheet (or the native reader's Edit/Tools) and opens it: dest 'tools' stages it on the home tool picker, anything else opens the reader. */
export function AppOpenBridge(){
 const router=useRouter();
 useEffect(()=>{
  let stop=false;let handle:{remove:()=>void}|undefined;
  try{
  if(!isNativeApp())return;
  const open=(pending:{name:string;data:string;dest?:string}|null)=>{
   if(!pending||stop)return;
   try{
    const bin=atob(pending.data),bytes=new Uint8Array(bin.length);
    for(let i=0;i<bin.length;i++)bytes[i]=bin.charCodeAt(i);
    const file=new File([bytes],pending.name,{type:'application/pdf'});
    void putHandoff(file).then(()=>{if(!stop)router.push(appOpenRoute(pending.dest));});
   }catch{/* ignore malformed payloads */}
  };
  void nativeTakePendingOpen().then(open);
  const plugins=(window as unknown as {Capacitor?:{Plugins?:Record<string,{addListener?:(e:string,cb:()=>void)=>Promise<{remove:()=>void}>}>}}).Capacitor?.Plugins;
  void plugins?.NativeFiles?.addListener?.('openFile',()=>{void nativeTakePendingOpen().then(open);})?.then(h=>{handle=h;},()=>{});
  }catch{/* the native bridge must never break page rendering */}
  return()=>{stop=true;try{handle?.remove();}catch{/* ignore */}};
 },[router]);
 return null;
}
