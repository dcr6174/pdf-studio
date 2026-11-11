'use client';
import {useEffect,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import {Palette,Check} from 'lucide-react';
import {ACCENT_KEY,accentThemes,applyAccent} from '@/lib/accent-theme';
import './accent-picker.css';
export function AccentPicker(){
 const [open,setOpen]=useState(false),[color,setColor]=useState('#7045dc'),[header,setHeader]=useState<HTMLElement|null>(null);
 const button=useRef<HTMLButtonElement>(null),strip=useRef<HTMLDivElement>(null);
 useEffect(()=>{const node=button.current?.closest<HTMLElement>('.studio-header');queueMicrotask(()=>setHeader(node??null));let saved='#7045dc';try{const value=localStorage.getItem(ACCENT_KEY);if(value&&/^#[0-9a-f]{6}$/i.test(value))saved=value;}catch{}applyAccent(saved);queueMicrotask(()=>setColor(saved));const observer=new MutationObserver(()=>applyAccent(document.documentElement.dataset.accent??saved));observer.observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});return()=>observer.disconnect();},[]);
 useEffect(()=>{if(!open)return;const outside=(e:PointerEvent)=>{const target=e.target as Node;if(!strip.current?.contains(target)&&!button.current?.contains(target))setOpen(false);};const key=(e:KeyboardEvent)=>{if(e.key==='Escape'){setOpen(false);button.current?.focus();}};document.addEventListener('pointerdown',outside);document.addEventListener('keydown',key);return()=>{document.removeEventListener('pointerdown',outside);document.removeEventListener('keydown',key);};},[open]);
 function choose(value:string){setColor(value);applyAccent(value);try{localStorage.setItem(ACCENT_KEY,value);}catch{}}
 const selected=accentThemes.find(t=>t.color===color)?.name??'Custom Color';
 const panel=<div ref={strip} id="accent-strip" className={'accent-strip'+(open?' is-open':'')} aria-label="Color themes" aria-hidden={!open} inert={!open}><div className="accent-strip-inner"><div className="accent-swatches" role="group" aria-label="Choose a color theme">{accentThemes.map((theme,i)=><button type="button" key={theme.name} className="accent-swatch" style={{'--swatch':theme.color,'--swatch-index':i} as React.CSSProperties} title={theme.name} aria-label={theme.name} aria-pressed={color===theme.color} onClick={()=>choose(theme.color)}>{color===theme.color&&<Check size={17}/>}</button>)}<label className="accent-custom" title="Custom Color" style={{'--swatch-index':10} as React.CSSProperties}><Palette size={20}/><input type="color" aria-label="Custom Color" value={color} onChange={e=>choose(e.target.value)}/></label></div><p role="status">{selected}<small>Saved on this device</small></p></div></div>;
 return <><button ref={button} type="button" className="accent-toggle theme-toggle" onClick={()=>setOpen(v=>!v)} aria-label="Color themes" title="Color themes" aria-expanded={open} aria-controls="accent-strip"><Palette size={20}/></button>{header&&createPortal(panel,header)}</>;
}
