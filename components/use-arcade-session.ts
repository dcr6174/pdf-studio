'use client';
/** React side of the arcade round protocol (lib/arcade-session.ts). */
import {useEffect,useRef} from 'react';
import {COMMAND_EVENT,forgetArcadeReport,publishArcadeReport,type ArcadeReport} from '@/lib/arcade-session';
type Commands={pause:()=>void;resume:()=>void;restart:()=>void;sound?:()=>void};
/** Reports a family's round state to the shared frame and routes frame commands back into the game. */
export function useArcadeSession(report:ArcadeReport,commands:Commands){
 const handlers=useRef(commands);
 useEffect(()=>{handlers.current=commands;});
 const {slug,phase,score,best,won,message,scoreKind,feel,letterKeys,canPause,sound,againLabel,detail}=report;
 useEffect(()=>{
  publishArcadeReport({slug,phase,score,best,won,message,scoreKind,feel,letterKeys,canPause,sound,againLabel,detail});
 },[slug,phase,score,best,won,message,scoreKind,feel,letterKeys,canPause,sound,againLabel,detail]);
 useEffect(()=>{
  const on=(event:Event)=>{
   const detail=(event as CustomEvent<{slug?:unknown;command?:unknown}>).detail;
   if(!detail||detail.slug!==slug)return;
   if(detail.command==='pause'||detail.command==='resume'||detail.command==='restart')handlers.current[detail.command]();
   else if(detail.command==='sound')handlers.current.sound?.();
  };
  window.addEventListener(COMMAND_EVENT,on);
  return()=>{window.removeEventListener(COMMAND_EVENT,on);forgetArcadeReport(slug);};
 },[slug]);
}
