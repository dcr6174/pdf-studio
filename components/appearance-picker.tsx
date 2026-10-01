'use client';
import {useEffect,useState} from 'react';
export function AppearancePicker(){
 const [mode,setMode]=useState('system');
 useEffect(()=>{try{const saved=localStorage.getItem('pdf-studio-appearance');if(['light','dark','system'].includes(saved??''))setMode(saved!);}catch{}},[]);
 useEffect(()=>{const media=matchMedia('(prefers-color-scheme: dark)');const apply=()=>{document.documentElement.dataset.theme=mode==='system'?(media.matches?'dark':'light'):mode;};apply();media.addEventListener('change',apply);return()=>media.removeEventListener('change',apply);},[mode]);
 return <label className="appearance-picker"><span>Appearance</span><select aria-label="Website appearance" value={mode} onChange={e=>{setMode(e.target.value);try{localStorage.setItem('pdf-studio-appearance',e.target.value);}catch{}}}><option value="system">Device setting</option><option value="light">Light</option><option value="dark">Dark</option></select></label>;
}
