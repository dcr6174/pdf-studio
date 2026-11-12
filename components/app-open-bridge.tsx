'use client';
import {useEffect} from 'react';
import {useRouter} from 'next/navigation';
import {isNativeApp,nativeTakePendingOpen} from '@/lib/app-bridge';
import {putHandoff} from '@/lib/file-handoff';
/** Inside the Android app: takes a PDF that arrived via Open with / share sheet (or the native reader's Edit/Tools) and opens it: dest 'tools' stages it on the home tool picker, anything else opens the reader. */
export function AppOpenBridge(){
 const router=useRouter();
 useEffect(()=>{
  if(!isNativeApp())return;
  let stop=false;
  const open=(pending:{name:string;data:string;dest?:string}|null)=>{
   if(!pending||stop)return;
   try{
    const bin=atob(pending.data),bytes=new Uint8Array(bin.length);
    for(let i=0;i<bin.length;i++)bytes[i]=bin.charCodeAt(i);
    const file=new File([bytes],pending.name,{type:'application/pdf'});
    void putHandoff(file).then(()=>{if(!stop)router.push(pending.dest==='tools'?'/':'/tools/pdf-reader');});
   }catch{/* ignore malformed payloads */}
  };
  void nativeTakePendingOpen().then(open);
  const plugins=(window as unknown as {Capacitor?:{Plugins?:Record<string,{addListener?:(e:string,cb:()=>void)=>Promise<{remove:()=>void}>}>}}).Capacitor?.Plugins;
  let handle:{remove:()=>void}|undefined;
  void plugins?.NativeFiles?.addListener?.('openFile',()=>{void nativeTakePendingOpen().then(open);})?.then(h=>{handle=h;});
  return()=>{stop=true;handle?.remove();};
 },[router]);
 return null;
}
