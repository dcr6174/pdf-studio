'use client';
import {useEffect,useState} from 'react';
import {INSTALL_CHANGED,INSTALL_KEY,isStudioInstalled,rememberInstall,rememberedInstall,type RelatedApp} from '@/lib/install-state';
type InstallPrompt=Event & {prompt:()=>Promise<void>;userChoice:Promise<{outcome:string}>};
type InstallNavigator=Navigator & {standalone?:boolean;getInstalledRelatedApps?:()=>Promise<RelatedApp[]>};
const INSTALL_PROMPT_CONSUMED='studio-install-prompt-consumed';
let pendingInstallPrompt:InstallPrompt|null=null;
export function InstallApp(){
 const [prompt,setPrompt]=useState<InstallPrompt|null>(pendingInstallPrompt),[installed,setInstalled]=useState(false),[checked,setChecked]=useState(false),[help,setHelp]=useState(false);
 useEffect(()=>{let alive=true,revision=0;const nav=navigator as InstallNavigator,modes=[matchMedia('(display-mode: standalone)'),matchMedia('(display-mode: minimal-ui)')];const standalone=()=>modes.some(m=>m.matches)||Boolean(nav.standalone);
  const stored=()=>{try{return rememberedInstall(localStorage);}catch{return false;}};
  const persist=(value:boolean)=>{try{rememberInstall(localStorage,value);}catch{}};
  const update=(value:boolean)=>{if(!alive)return;setInstalled(value);setChecked(true);if(value){setPrompt(null);setHelp(false);}};
  const done=()=>{pendingInstallPrompt=null;revision++;persist(true);update(true);window.dispatchEvent(new CustomEvent(INSTALL_CHANGED,{detail:true}));};
  const check=async()=>{const version=revision;let found=standalone()||stored();if(standalone())persist(true);if(found||!nav.getInstalledRelatedApps)update(found);try{if(nav.getInstalledRelatedApps){found=found||isStudioInstalled(await nav.getInstalledRelatedApps(),location.origin);if(alive&&revision===version){if(found)persist(true);update(found);}}}catch{if(alive&&revision===version)update(found);/* Unsupported/platform-restricted detection uses the local fallback. */}};
  const available=(e:Event)=>{e.preventDefault();revision++;if(standalone()){done();return;}persist(false);update(false);pendingInstallPrompt=e as InstallPrompt;setPrompt(pendingInstallPrompt);window.dispatchEvent(new CustomEvent(INSTALL_CHANGED,{detail:false}));};
  const sync=(e:Event)=>{revision++;update(standalone()||Boolean((e as CustomEvent<boolean>).detail));};
  const storage=(e:StorageEvent)=>{if(e.key===INSTALL_KEY){revision++;update(standalone()||stored());}};
  const consumed=()=>setPrompt(null);
  const visible=()=>{if(document.visibilityState==='visible')void check();};const mode=()=>{if(standalone())done();else void check();};
  void check();window.addEventListener(INSTALL_PROMPT_CONSUMED,consumed);window.addEventListener('beforeinstallprompt',available);window.addEventListener('appinstalled',done);window.addEventListener(INSTALL_CHANGED,sync);window.addEventListener('storage',storage);document.addEventListener('visibilitychange',visible);modes.forEach(m=>m.addEventListener('change',mode));
  return()=>{alive=false;window.removeEventListener(INSTALL_PROMPT_CONSUMED,consumed);window.removeEventListener('beforeinstallprompt',available);window.removeEventListener('appinstalled',done);window.removeEventListener(INSTALL_CHANGED,sync);window.removeEventListener('storage',storage);document.removeEventListener('visibilitychange',visible);modes.forEach(m=>m.removeEventListener('change',mode));};
 },[]);
 const manualInstall=typeof navigator!=='undefined'&&/iPad|iPhone|iPod/.test(navigator.userAgent)&&/Safari/.test(navigator.userAgent)&&!/CriOS|FxiOS|EdgiOS/.test(navigator.userAgent);
 if(!checked||installed||(!prompt&&!manualInstall))return null;
 return <div className="install-app"><button className="source-top" onClick={async()=>{if(!prompt){setHelp(h=>!h);return;}try{await prompt.prompt();const choice=await prompt.userChoice;if(choice.outcome==='accepted'){try{rememberInstall(localStorage,true);}catch{}setInstalled(true);setHelp(false);window.dispatchEvent(new CustomEvent(INSTALL_CHANGED,{detail:true}));}}catch{setHelp(true);}finally{pendingInstallPrompt=null;setPrompt(null);window.dispatchEvent(new Event(INSTALL_PROMPT_CONSUMED));}}}>Install app</button>{help&&<div className="install-help" role="status"><b>Install PDF Studio</b><p>Chrome or Edge: open the browser menu and choose Install app if available. On iPhone or iPad, open this site in Safari, tap Share, then Add to Home Screen.</p><p>This version needs an internet connection to load. PDF processing stays on your device.</p><button onClick={()=>setHelp(false)} aria-label="Close installation instructions">Close</button></div>}</div>;
}

