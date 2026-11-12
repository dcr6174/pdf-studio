'use client';
import {useEffect} from 'react';
export function ServiceWorkerRegister(){
 useEffect(()=>{
  if(!('serviceWorker' in navigator))return;
  if(location.hostname!=='pdf-studio.in'&&location.hostname!=='www.pdf-studio.in')return;
  const onLoad=()=>{navigator.serviceWorker.register('/sw.js').catch(()=>{});};
  if(document.readyState==='complete')onLoad();else{window.addEventListener('load',onLoad,{once:true});}
 },[]);
 return null;
}
