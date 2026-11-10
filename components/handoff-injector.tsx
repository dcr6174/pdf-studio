'use client';
import {useEffect} from 'react';
import {usePathname} from 'next/navigation';
import {hasHandoff,takeHandoff} from '@/lib/file-handoff';
/** After the homepage hands over a file, drops it into the first PDF file input of the tool page that opens. */
export function HandoffInjector(){
 const pathname=usePathname()||'/';
 useEffect(()=>{
  if(pathname==='/'||!hasHandoff())return;
  let stop=false,tries=0;
  const timer=window.setInterval(()=>{
   if(stop||++tries>50){window.clearInterval(timer);return;}
   const input=[...document.querySelectorAll<HTMLInputElement>('input[type=file]')].find(i=>/pdf/i.test(i.accept||''));
   if(!input)return;
   window.clearInterval(timer);stop=true;
   void takeHandoff().then(file=>{
    if(!file)return;
    const dt=new DataTransfer();dt.items.add(file);input.files=dt.files;
    input.dispatchEvent(new Event('change',{bubbles:true}));
   }).catch(()=>undefined);
  },200);
  return()=>{stop=true;window.clearInterval(timer);};
 },[pathname]);
 return null;
}
