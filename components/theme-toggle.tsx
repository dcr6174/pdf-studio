'use client';
import {useEffect,useRef,useState} from 'react';
import {flushSync} from 'react-dom';
import {Moon,Sun} from 'lucide-react';
import {createThemeController,type Theme} from '@/lib/theme-switch';

const KEY='pdf-studio-appearance';
const FADE_MS=450;   // fallback colour fade for browsers without View Transitions (keep in sync with --theme-fade)
const REVEAL_MS=600; // the new theme grows out of the button in a circle: clearly visible, still quick
type TransitionDoc=Document&{startViewTransition?:(update:()=>void)=>{ready:Promise<void>;finished:Promise<void>}};

function systemTheme():Theme{return matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}
function savedTheme():Theme|null{try{const v=localStorage.getItem(KEY);return v==='light'||v==='dark'?v:null;}catch{return null;}}
function save(t:Theme){try{localStorage.setItem(KEY,t);}catch{/* storage blocked: the choice lasts for this visit */}}
function readDom():Theme{return document.documentElement.dataset.theme==='dark'?'dark':'light';}
function writeDom(t:Theme){document.documentElement.dataset.theme=t;}
function originOf(el:Element|null){
 const r=(el??document.querySelector('.theme-toggle'))?.getBoundingClientRect();
 return r?{x:r.left+r.width/2,y:r.top+r.height/2}:{x:innerWidth-40,y:36};
}

let fadeTimer=0;
/**
 * Run a theme change so it is easy to see:
 * - modern browsers: the new theme grows out of the button as a circle (View Transitions + clip-path, 600 ms);
 * - others: a 450 ms colour fade;
 * - reduced motion, or nothing visible changes: immediately.
 * The change itself always applies the LATEST wanted theme (see lib/theme-switch.ts), so quick clicks never fight each other.
 */
function animate(run:()=>void,from:Element|null,changes:boolean){
 const root=document.documentElement;
 if(!changes||matchMedia('(prefers-reduced-motion: reduce)').matches){run();return;}
 const doc=document as TransitionDoc;
 if(typeof doc.startViewTransition==='function'){
  const {x,y}=originOf(from);
  const r=Math.hypot(Math.max(x,innerWidth-x),Math.max(y,innerHeight-y));
  const t=doc.startViewTransition(()=>{flushSync(run);});
  t.ready.then(()=>{
   root.animate({clipPath:[`circle(0px at ${x}px ${y}px)`,`circle(${r}px at ${x}px ${y}px)`]},{duration:REVEAL_MS,easing:'cubic-bezier(.22,1,.36,1)',pseudoElement:'::view-transition-new(root)'});
  }).catch(()=>{/* a newer click replaced this transition: that one will animate */});
  return;
 }
 root.classList.add('theme-fade');
 run();
 window.clearTimeout(fadeTimer);
 fadeTimer=window.setTimeout(()=>root.classList.remove('theme-fade'),FADE_MS+50);
}

/** One direct light/dark button. Follows the device until the person picks a side. */
export function ThemeToggle(){
 const [theme,setTheme]=useState<Theme>('light');
 const [turned,setTurned]=useState(false);
 const ctrl=useRef<ReturnType<typeof createThemeController>|null>(null);
 const chosen=useRef(false);
 useEffect(()=>{
  const saved=savedTheme();chosen.current=!!saved;
  const initial=saved??systemTheme();
  writeDom(initial);
  const c=createThemeController({read:readDom,write:writeDom,persist:save,animate,commit:t=>{setTurned(true);setTheme(t);}});
  ctrl.current=c;
  queueMicrotask(()=>{setTurned(false);setTheme(initial);});
  const media=matchMedia('(prefers-color-scheme: dark)');
  const follow=()=>{if(!chosen.current)c.follow(systemTheme());};
  media.addEventListener('change',follow);
  return()=>{ctrl.current=null;media.removeEventListener('change',follow);window.clearTimeout(fadeTimer);};
 },[]);
 function toggle(e:React.MouseEvent<HTMLButtonElement>){chosen.current=true;ctrl.current?.toggle(e.currentTarget);}
 const label=theme==='dark'?'Switch to light mode':'Switch to dark mode';
 return <button type="button" className="theme-toggle" onClick={toggle} aria-label={label} title={label}><span className={turned?"theme-icon turned":"theme-icon"} key={theme}>{theme==='dark'?<Sun size={20} aria-hidden="true"/>:<Moon size={20} aria-hidden="true"/>}</span></button>;
}
