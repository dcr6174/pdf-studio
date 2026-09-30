'use client';
import {useEffect,useState} from 'react';
import {tools} from './tools';
import type {ActivityEvent,EventKind} from './analytics-contract';
const validTools=new Set(tools.map(t=>t.id));
const disabledKey='openpdf-analytics-disabled',visitorKey='openpdf-analytics-visitor',queueKey='openpdf-analytics-queue';
function storageGet(storage:Storage,key:string){try{return storage.getItem(key);}catch{return null;}}
function storageSet(storage:Storage,key:string,value:string){try{storage.setItem(key,value);}catch{/* Device storage is optional. */}}
export function privacySignal(){return typeof navigator!=='undefined'&&(navigator.doNotTrack==='1'||(navigator as Navigator&{globalPrivacyControl?:boolean}).globalPrivacyControl===true);}
let active=false,visitorId='',toolId:string|null=null,queue:ActivityEvent[]=[],inFlight=false,failures=0;
let flushTimer:ReturnType<typeof setTimeout>|undefined;
function persist(){storageSet(sessionStorage,queueKey,JSON.stringify(queue.slice(-100)));}
function schedule(delay=200){if(!active||flushTimer)return;flushTimer=setTimeout(()=>{flushTimer=undefined;void flush();},delay);}
async function flush(heartbeat=false){
 if(!active||inFlight||(!queue.length&&!heartbeat)||!navigator.onLine)return;
 const sent=queue.slice(0,20);inFlight=true;
 try{
  const r=await fetch('/api/analytics/collect',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'same-origin',cache:'no-store',keepalive:true,body:JSON.stringify({visitorId,visible:document.visibilityState==='visible',toolId,events:sent})});
  if(r.ok){const body=await r.json() as {accepted?:string[]};const ack=new Set<string>(body.accepted??[]);queue=queue.filter(e=>!ack.has(e.id));failures=0;persist();}
  else if([400,403,413,415].includes(r.status)){const ids=new Set(sent.map(e=>e.id));queue=queue.filter(e=>!ids.has(e.id));persist();failures++;}
  else failures++;
 }catch{failures++;}finally{inFlight=false;if(queue.length)schedule(Math.min(60_000,failures?2000*2**Math.min(failures,5):200));}
}
export function trackActivity(kind:EventKind,tool:string|null){if(!active||privacySignal()||storageGet(localStorage,disabledKey)==='1')return;if(kind!=='visit'&&(!tool||!validTools.has(tool)))return;queue.push({id:crypto.randomUUID(),kind,toolId:tool&&validTools.has(tool)?tool:null});if(queue.length>100)queue=queue.slice(-100);persist();schedule();}
function start(){
 if(privacySignal()||storageGet(localStorage,disabledKey)==='1')return()=>{};
 active=true;visitorId=storageGet(localStorage,visitorKey)??crypto.randomUUID();if(!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(visitorId))visitorId=crypto.randomUUID();storageSet(localStorage,visitorKey,visitorId);
 try{queue=JSON.parse(storageGet(sessionStorage,queueKey)??'[]').filter((e:ActivityEvent)=>e&&typeof e.id==='string'&&typeof e.kind==='string').slice(-100);}catch{queue=[];}
 failures=0;trackActivity('visit',null);
 const heartbeat=()=>{if(document.visibilityState==='visible')void flush(true);};
 const visibility=()=>{if(document.visibilityState==='visible')heartbeat();};
 const online=()=>{schedule(0);heartbeat();};
 const unload=()=>{if(!queue.length||!active)return;try{navigator.sendBeacon('/api/analytics/collect',new Blob([JSON.stringify({visitorId,visible:false,toolId,events:queue.slice(0,20)})],{type:'application/json'}));}catch{/* The retained queue can retry on reload. */}};
 const storage=(e:StorageEvent)=>{if(e.key===disabledKey&&e.newValue==='1'){active=false;queue=[];persist();}};
 const timer=setInterval(heartbeat,25_000);document.addEventListener('visibilitychange',visibility);window.addEventListener('online',online);window.addEventListener('pagehide',unload);window.addEventListener('storage',storage);
 schedule();
 return()=>{active=false;clearInterval(timer);if(flushTimer){clearTimeout(flushTimer);flushTimer=undefined;}document.removeEventListener('visibilitychange',visibility);window.removeEventListener('online',online);window.removeEventListener('pagehide',unload);window.removeEventListener('storage',storage);};
}
export function useActivityTracking(view:string){
 const [disabled,setDisabled]=useState(false),[privacyBlocked,setPrivacyBlocked]=useState(false);
 useEffect(()=>{setDisabled(storageGet(localStorage,disabledKey)==='1');setPrivacyBlocked(privacySignal());const changed=(e:StorageEvent)=>{if(e.key===disabledKey)setDisabled(e.newValue==='1');};window.addEventListener('storage',changed);return()=>window.removeEventListener('storage',changed);},[]);
 useEffect(()=>{if(disabled||privacyBlocked)return;return start();},[disabled,privacyBlocked]);
 useEffect(()=>{toolId=validTools.has(view)?view:null;if(toolId)trackActivity('tool_open',toolId);},[view,disabled,privacyBlocked]);
 function setEnabled(enabled:boolean){storageSet(localStorage,disabledKey,enabled?'0':'1');setDisabled(!enabled);if(!enabled){active=false;queue=[];persist();}}
 return {enabled:!disabled&&!privacyBlocked,privacyBlocked,setEnabled};
}
