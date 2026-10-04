'use client';
import {useEffect,useRef,useState} from 'react';
import {flushSync} from 'react-dom';
import {Moon,Sun} from 'lucide-react';

const KEY='pdf-studio-appearance';
const FADE_MS=450;   // fallback colour fade for browsers without View Transitions (keep in sync with --theme-fade)
const REVEAL_MS=600; // the new theme grows out of the button in a circle: clearly visible, still quick
type Theme='light'|'dark';
type TransitionDoc=Document&{startViewTransition?:(update:()=>void)=>{ready:Promise<void>;finished:Promise<void>}};

function systemTheme():Theme{return matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}
function savedTheme():Theme|null{try{const v=localStorage.getItem(KEY);return v==='light'||v==='dark'?v:null;}catch{return null;}}
function apply(theme:Theme){document.documentElement.dataset.theme=theme;}
function originOf(el:Element|null){
 const r=(el??document.querySelector('.theme-toggle'))?.getBoundingClientRect();
 return r?{x:r.left+r.width/2,y:r.top+r.height/2}:{x:innerWidth-40,y:36};
}

/**
 * Switch theme so the change is easy to see:
 * - Modern browsers: the new theme grows out of the theme button as a circle (View Transitions + clip-path, 600 ms).
 *   The page layout never changes; only colours do.
 * - Others: a short colour fade (450 ms).
 * - Reduced motion: instant. (Buddy's own reaction is separate; see buddy-hero.tsx.)
 */
function switchTheme(next:Theme,update:()=>void,from:Element|null=null){
 const root=document.documentElement;
 if(root.dataset.theme===next){update();return;}
 if(matchMedia('(prefers-reduced-motion: reduce)').matches){update();apply(next);return;}
 const doc=document as TransitionDoc;
 if(typeof doc.startViewTransition==='function'){
  const {x,y}=originOf(from);
  const r=Math.hypot(Math.max(x,innerWidth-x),Math.max(y,innerHeight-y));
  try { const t=doc.startViewTransition(()=>{flushSync(update);apply(next);});
  void t.finished.catch(()=>{});
  t.ready.then(()=>{
   root.animate({clipPath:[`circle(0px at ${x}px ${y}px)`,`circle(${r}px at ${x}px ${y}px)`]},{duration:REVEAL_MS,easing:'cubic-bezier(.22,1,.36,1)',pseudoElement:'::view-transition-new(root)'});
  }).catch(()=>{});
  } catch {update();apply(next);}
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
 function toggle(e:React.MouseEvent<HTMLButtonElement>){
  const next:Theme=desired.current==='dark'?'light':'dark';desired.current=next;
  chosen.current=true;
  switchTheme(next,()=>{setTurned(true);setTheme(next);},e.currentTarget);
  try{localStorage.setItem(KEY,next);}catch{}
 }
 const label=theme==='dark'?'Switch to light mode':'Switch to dark mode';
 return <button type="button" className="theme-toggle" onClick={toggle} aria-label={label} title={label}><span className={turned?"theme-icon turned":"theme-icon"} key={theme}>{theme==='dark'?<Sun size={20} aria-hidden="true"/>:<Moon size={20} aria-hidden="true"/>}</span></button>;
}
