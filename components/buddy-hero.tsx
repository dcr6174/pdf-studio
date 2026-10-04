'use client';
import {useCallback,useEffect,useId,useRef,useState} from 'react';

const PAGE='M42 12H78L106 40V90Q106 108 88 108H40Q22 108 22 90V32Q22 12 42 12Z';
const FOLD='M78 12V30Q78 40 88 40H106Z';

/**
 * Animated Page Buddy for the home hero.
 * Entrance: drop + squash, fold pops, eyes open, smile draws. Idle: float + blink.
 * Eyes follow a mouse pointer. Tap, or drag a file over the page, to make it hop.
 * Everything is CSS on an inline SVG; reduced-motion users get the still logo.
 */
export function BuddyHero(){
 const uid=useId().replace(/[^a-zA-Z0-9]/g,'');
 const id=(name:string)=>`bh${uid}${name}`;
 const svgRef=useRef<SVGSVGElement>(null);
 const timer=useRef<number|undefined>(undefined);
 const [mood,setMood]=useState<'happy'|'joy'>('happy');
 const [hop,setHop]=useState(0);
 const [paused,setPaused]=useState(false);

 const cheer=useCallback(()=>{
  if(paused||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  setMood('joy');setHop(n=>n+1);
  window.clearTimeout(timer.current);
  timer.current=window.setTimeout(()=>setMood('happy'),1400);
 },[paused]);

 useEffect(()=>{
  const svg=svgRef.current;if(!svg||paused)return;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce)return;
  let raf=0,px=0,py=0;
  const look=()=>{raf=0;const r=svg.getBoundingClientRect();const dx=px-(r.left+r.width/2),dy=py-(r.top+r.height*.45);const d=Math.hypot(dx,dy)||1;const k=Math.min(1,d/320);
   svg.style.setProperty('--bh-x',(dx/d*3.2*k).toFixed(2)+'px');svg.style.setProperty('--bh-y',(dy/d*2.6*k).toFixed(2)+'px');};
  const move=(e:PointerEvent)=>{if(e.pointerType!=='mouse')return;px=e.clientX;py=e.clientY;if(!raf)raf=requestAnimationFrame(look);};
  let dragging=false;
  const drag=(e:DragEvent)=>{if(!e.dataTransfer?.types?.includes('Files')||dragging)return;dragging=true;cheer();};
  const dragEnd=()=>{dragging=false;};
  window.addEventListener('pointermove',move,{passive:true});
  window.addEventListener('dragenter',drag);window.addEventListener('dragleave',dragEnd);window.addEventListener('drop',dragEnd);
  return()=>{window.removeEventListener('pointermove',move);window.removeEventListener('dragenter',drag);window.removeEventListener('dragleave',dragEnd);window.removeEventListener('drop',dragEnd);cancelAnimationFrame(raf);window.clearTimeout(timer.current);};
 },[paused,cheer]);

 return <div className={paused?'buddy-display buddy-paused':'buddy-display'}><button type="button" className={`buddy-hero mood-${mood}`} onClick={cheer} aria-label="Say hi to Buddy, the PDF Studio mascot">
  <svg ref={svgRef} viewBox="0 0 128 136" width="132" height="140" aria-hidden="true" focusable="false">
   <defs>
    <linearGradient id={id('g')} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#9B86FF"/><stop offset=".55" stopColor="#6A4DFF"/><stop offset="1" stopColor="#4B2FE0"/></linearGradient>
    <linearGradient id={id('f')} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff"/><stop offset="1" stopColor="#D3CBFF"/></linearGradient>
    <radialGradient id={id('s')} cx=".28" cy=".2" r=".6"><stop offset="0" stopColor="#fff" stopOpacity=".5"/><stop offset="1" stopColor="#fff" stopOpacity="0"/></radialGradient>
   </defs>
   <ellipse className="bh-ground" cx="64" cy="124" rx="34" ry="5"/>
   <g className="bh-body">
    <g className="bh-float">
     <g className="bh-hop" key={hop}>
      <path d={PAGE} fill={`url(#${id('g')})`}/>
      <path d={PAGE} fill={`url(#${id('s')})`}/>
      <g className="bh-fold"><path d={FOLD} fill="#3A20C4" opacity=".35" transform="translate(-2 3)"/><path d={FOLD} fill={`url(#${id('f')})`}/></g>
      <g className="bh-cheeks"><ellipse cx="39" cy="77" rx="7" ry="4.5"/><ellipse cx="89" cy="77" rx="7" ry="4.5"/></g>
      <g className="bh-eyes"><g className="bh-look">
       <ellipse cx="50" cy="62" rx="6.5" ry="8.5" fill="#1B1640"/><ellipse cx="78" cy="62" rx="6.5" ry="8.5" fill="#1B1640"/>
       <circle cx="52.2" cy="58.8" r="2.4" fill="#fff"/><circle cx="80.2" cy="58.8" r="2.4" fill="#fff"/>
      </g></g>
      <path className="bh-joy-eyes" d="M43 64Q50 55 57 64M71 64Q78 55 85 64" fill="none" stroke="#1B1640" strokeWidth="5" strokeLinecap="round"/>
      <g className="bh-mouth"><path className="bh-smile" d="M56 79Q64 87 72 79" pathLength={1} fill="none" stroke="#1B1640" strokeWidth="5" strokeLinecap="round"/></g>
      <g className="bh-grin"><path d="M54 76Q64 76 74 76Q72 89 64 89Q56 89 54 76Z" fill="#1B1640"/><path d="M58 84Q64 81 70 84Q67 88 64 88Q61 88 58 84Z" fill="#FF6F9C"/></g>
     </g>
    </g>
   </g>
  </svg>
 </button><button type="button" className="buddy-motion-toggle" aria-pressed={paused} onClick={()=>setPaused(value=>!value)}>{paused?'Play Buddy':'Pause Buddy'}</button></div>;
}
