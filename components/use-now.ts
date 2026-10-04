'use client';
import {useEffect,useState} from 'react';
import {msToNextTick,partOfDay,type PartOfDay} from '@/lib/time-of-day';

/** The device's time, refreshed on the minute (or on the second if SHOW_SECONDS is on). null until mounted, so server and browser agree. */
export function useNow():Date|null{
 const [now,setNow]=useState<Date|null>(null);
 useEffect(()=>{
  let timer=0,active=true;
  const tick=()=>{if(!active)return;const d=new Date();setNow(d);timer=window.setTimeout(tick,msToNextTick(d)+30);};
  const visible=()=>{if(document.visibilityState==='visible'){window.clearTimeout(timer);tick();}};
  queueMicrotask(tick);
  document.addEventListener('visibilitychange',visible);
  return()=>{active=false;window.clearTimeout(timer);document.removeEventListener('visibilitychange',visible);};
 },[]);
 return now;
}
export function usePartOfDay():PartOfDay{const now=useNow();return now?partOfDay(now):'day';}
