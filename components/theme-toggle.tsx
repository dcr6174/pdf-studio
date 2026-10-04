'use client';
import {useEffect,useRef,useState} from 'react';
import {flushSync} from 'react-dom';
import {Moon,Sun} from 'lucide-react';

const KEY='pdf-studio-appearance';
const FADE_MS=700; // keep in sync with --theme-fade in studio-brand.css
type Theme='light'|'dark';
type TransitionDoc=Document&{startViewTransition?:(update:()=>void)=>{finished:Promise<void>}};

function systemTheme():Theme{return matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}
function savedTheme():Theme|null{try{const v=localStorage.getItem(KEY);return v==='light'||v==='dark'?v:null;}catch{return null;}}
function apply(theme:Theme){document.documentElement.dataset.theme=theme;}

/**
 * Switch theme with a slow, soft cross-fade.
 * Modern browsers: View Transitions fade the whole page as one picture, so nothing flickers.
 * Others: a temporary class eases colours, borders and fills for the same duration.
 * Reduced motion: instant.
 */
function switchTheme(next:Theme,update:()=>void){
 const root=document.documentElement;
 if(root.dataset.theme===next){update();return;}
 if(matchMedia('(prefers-reduced-motion: reduce)').matches){update();apply(next);return;}
 const doc=document as TransitionDoc;
 if(typeof doc.startViewTransition==='function'){
  try{const transition=doc.startViewTransition(()=>{flushSync(update);apply(next);});void transition.finished.catch(()=>{});}catch{update();apply(next);}
  return;
 }
 root.classList.add('theme-fade');
 update();apply(next);
 window.setTimeout(()=>root.classList.remove('theme-fade'),FADE_MS+50);
}

/** One direct light/dark button. Follows the device until the person picks a side. */
export function ThemeToggle(){
 const [theme,setTheme]=useState<Theme>('light');
 const chosen=useRef(false),desired=useRef<Theme>('light');
 const [turned,setTurned]=useState(false);
 useEffect(()=>{
  const saved=savedTheme();chosen.current=!!saved;
  const initial=saved??systemTheme();
  let active=true;desired.current=initial;apply(initial);
  queueMicrotask(()=>{if(active)setTheme(initial);});
  const media=matchMedia('(prefers-color-scheme: dark)');
  const follow=()=>{if(chosen.current)return;const next=systemTheme();desired.current=next;switchTheme(next,()=>setTheme(next));};
  media.addEventListener('change',follow);
  return()=>{active=false;media.removeEventListener('change',follow);};
 },[]);
 function toggle(){
  const next:Theme=desired.current==='dark'?'light':'dark';desired.current=next;
  chosen.current=true;
  switchTheme(next,()=>{setTurned(true);setTheme(next);});
  try{localStorage.setItem(KEY,next);}catch{}
 }
 const label=theme==='dark'?'Switch to light mode':'Switch to dark mode';
 return <button type="button" className="theme-toggle" onClick={toggle} aria-label={label} title={label}><span className={turned?"theme-icon turned":"theme-icon"} key={theme}>{theme==='dark'?<Sun size={20} aria-hidden="true"/>:<Moon size={20} aria-hidden="true"/>}</span></button>;
}
