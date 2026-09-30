'use client';
import {useEffect,useState} from 'react';
type InstallPrompt=Event & {prompt:()=>Promise<void>;userChoice:Promise<{outcome:string}>};
export function InstallApp(){
 const [prompt,setPrompt]=useState<InstallPrompt|null>(null),[installed,setInstalled]=useState(false),[help,setHelp]=useState(false);
 useEffect(()=>{setInstalled(matchMedia('(display-mode: standalone)').matches||Boolean((navigator as Navigator & {standalone?:boolean}).standalone));const available=(e:Event)=>{e.preventDefault();setPrompt(e as InstallPrompt);};const done=()=>{setInstalled(true);setPrompt(null);};window.addEventListener('beforeinstallprompt',available);window.addEventListener('appinstalled',done);return()=>{window.removeEventListener('beforeinstallprompt',available);window.removeEventListener('appinstalled',done);};},[]);
 if(installed)return null;
 return <div className="install-app"><button className="source-top" onClick={async()=>{if(!prompt){setHelp(h=>!h);return;}try{await prompt.prompt();await prompt.userChoice;}catch{setHelp(true);}finally{setPrompt(null);}}}>Install app</button>{help&&<div className="install-help" role="status"><b>Install PDF Studio</b><p>Chrome or Edge: open the browser menu and choose Install app if available. On iPhone or iPad, open this site in Safari, tap Share, then Add to Home Screen.</p><p>This version needs an internet connection to load. PDF processing stays on your device.</p><button onClick={()=>setHelp(false)} aria-label="Close installation instructions">Close</button></div>}</div>;
}
