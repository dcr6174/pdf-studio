'use client';
import {useEffect,useRef,useState} from 'react';
import {Moon,Sun} from 'lucide-react';

const KEY='pdf-studio-appearance';
type Theme='light'|'dark';

function systemTheme():Theme{return matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}
function savedTheme():Theme|null{try{const v=localStorage.getItem(KEY);return v==='light'||v==='dark'?v:null;}catch{return null;}}
function apply(theme:Theme){document.documentElement.dataset.theme=theme;}

/** One direct light/dark button. Follows the device until the person picks a side. */
export function ThemeToggle(){
 const [theme,setTheme]=useState<Theme>('light');
 const chosen=useRef(false);
 useEffect(()=>{
  const saved=savedTheme();chosen.current=!!saved;
  const initial=saved??systemTheme();
  let active=true;apply(initial);
  queueMicrotask(()=>{if(active)setTheme(initial);});
  const media=matchMedia('(prefers-color-scheme: dark)');
  const follow=()=>{if(chosen.current)return;const next=systemTheme();setTheme(next);apply(next);};
  media.addEventListener('change',follow);
  return()=>{active=false;media.removeEventListener('change',follow);};
 },[]);
 function toggle(){
  const next:Theme=theme==='dark'?'light':'dark';
  chosen.current=true;setTheme(next);apply(next);
  try{localStorage.setItem(KEY,next);}catch{}
 }
 const label=theme==='dark'?'Switch to light mode':'Switch to dark mode';
 return <button type="button" className="theme-toggle" onClick={toggle} aria-label={label} title={label}>{theme==='dark'?<Sun size={20} aria-hidden="true"/>:<Moon size={20} aria-hidden="true"/>}</button>;
}
