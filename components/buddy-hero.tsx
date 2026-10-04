'use client';
import {useEffect,useId,useRef,useState} from 'react';
import {usePartOfDay} from '@/components/use-now';

const PAGE='M42 12H78L106 40V90Q106 108 88 108H40Q22 108 22 90V32Q22 12 42 12Z';
const FOLD='M78 12V30Q78 40 88 40H106Z';

/**
 * Buddy, calm version. The purple page never changes; only the light on it and its expression do.
 * - Idle: an occasional blink (two slow, uneven cycles) and a tiny smile. No floating, no bouncing.
 * - Dark theme: eyes close for a moment, then open under a soft moonlit glow.
 * - Light theme: eyes open, a smile, one small bounce; warm morning glow, cheerful day, softer evening.
 * - Tap (or drop a file on the page): a quick happy reaction.
 * The chosen theme always wins over the time of day. Lighting is pure CSS (see studio-buddy.css);
 * this component only knows the time of day and when the theme changes.
 */
export function BuddyHero(){
 const uid=useId().replace(/[^a-zA-Z0-9]/g,'');
 const id=(name:string)=>`bh${uid}${name}`;
 const timer=useRef<number|undefined>(undefined);
 const reactTimer=useRef<number|undefined>(undefined);
 const [mood,setMood]=useState<'happy'|'joy'>('happy');
 const [hop,setHop]=useState(0);
 const [reaction,setReaction]=useState<''|'dark'|'light'>('');
 const part=usePartOfDay();

 function cheer(){
  setMood('joy');setHop(n=>n+1);
  window.clearTimeout(timer.current);
  timer.current=window.setTimeout(()=>setMood('happy'),1200);
 }

 useEffect(()=>{
  const root=document.documentElement;
  let last=root.dataset.theme;
  const reduce=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
  // React when the theme flips (button, or the device switching at night). Reduced motion: lighting still changes, nothing moves.
  const mo=new MutationObserver(()=>{
   const next=root.dataset.theme;if(next===last)return;last=next;
   if(reduce())return;
   setReaction(next==='dark'?'dark':'light');
   window.clearTimeout(reactTimer.current);
   reactTimer.current=window.setTimeout(()=>setReaction(''),1400);
  });
  mo.observe(root,{attributes:true,attributeFilter:['data-theme']});
  let dragging=false;
  const drag=(e:DragEvent)=>{if(!e.dataTransfer?.types?.includes('Files')||dragging||reduce())return;dragging=true;cheer();};
  const end=()=>{dragging=false;};
  window.addEventListener('dragenter',drag);window.addEventListener('dragleave',end);window.addEventListener('drop',end);
  return()=>{mo.disconnect();window.removeEventListener('dragenter',drag);window.removeEventListener('dragleave',end);window.removeEventListener('drop',end);window.clearTimeout(timer.current);window.clearTimeout(reactTimer.current);};
 },[]);

 return <button type="button" className={`buddy-hero mood-${mood}${reaction?` react-${reaction}`:''}`} data-part={part} onClick={cheer} aria-label="Say hi to Buddy, the PDF Studio mascot">
  <svg viewBox="0 0 128 136" width="132" height="140" aria-hidden="true" focusable="false">
   <defs>
    <linearGradient id={id('g')} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#9B86FF"/><stop offset=".55" stopColor="#6A4DFF"/><stop offset="1" stopColor="#4B2FE0"/></linearGradient>
    <linearGradient id={id('f')} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff"/><stop offset="1" stopColor="#D3CBFF"/></linearGradient>
    <radialGradient id={id('s')} cx=".28" cy=".2" r=".6"><stop offset="0" stopColor="#fff" stopOpacity=".5"/><stop offset="1" stopColor="#fff" stopOpacity="0"/></radialGradient>
    <radialGradient id={id('tw')} cx=".25" cy=".18" r=".75"><stop offset="0" stopColor="#FFE2A0" stopOpacity=".7"/><stop offset="1" stopColor="#FFE2A0" stopOpacity="0"/></radialGradient>
    <radialGradient id={id('tc')} cx=".78" cy=".16" r=".8"><stop offset="0" stopColor="#CFE0FF" stopOpacity=".65"/><stop offset="1" stopColor="#CFE0FF" stopOpacity="0"/></radialGradient>
    <radialGradient id={id('tr')} cx=".3" cy=".22" r=".75"><stop offset="0" stopColor="#FFC4E0" stopOpacity=".42"/><stop offset="1" stopColor="#FFC4E0" stopOpacity="0"/></radialGradient>
    <radialGradient id={id('gm')}><stop offset="0" stopColor="#A9C4FF" stopOpacity=".85"/><stop offset=".55" stopColor="#8FA9FF" stopOpacity=".32"/><stop offset="1" stopColor="#8FA9FF" stopOpacity="0"/></radialGradient>
    <radialGradient id={id('gw')}><stop offset="0" stopColor="#FFC56E" stopOpacity=".85"/><stop offset=".55" stopColor="#FFB45A" stopOpacity=".3"/><stop offset="1" stopColor="#FFB45A" stopOpacity="0"/></radialGradient>
    <radialGradient id={id('gd')}><stop offset="0" stopColor="#C7B8FF" stopOpacity=".8"/><stop offset=".6" stopColor="#B7A6FF" stopOpacity=".25"/><stop offset="1" stopColor="#B7A6FF" stopOpacity="0"/></radialGradient>
    <radialGradient id={id('ge')}><stop offset="0" stopColor="#FF9CC8" stopOpacity=".8"/><stop offset=".6" stopColor="#FF9CC8" stopOpacity=".24"/><stop offset="1" stopColor="#FF9CC8" stopOpacity="0"/></radialGradient>
   </defs>
   <ellipse className="bh-ground" cx="64" cy="124" rx="34" ry="5"/>
   <g className="bh-glows">
    <ellipse className="bh-glow bh-glow-moon" cx="64" cy="60" rx="66" ry="62" fill={`url(#${id('gm')})`}/>
    <ellipse className="bh-glow bh-glow-warm" cx="64" cy="60" rx="64" ry="60" fill={`url(#${id('gw')})`}/>
    <ellipse className="bh-glow bh-glow-day" cx="64" cy="60" rx="62" ry="58" fill={`url(#${id('gd')})`}/>
    <ellipse className="bh-glow bh-glow-rose" cx="64" cy="60" rx="62" ry="58" fill={`url(#${id('ge')})`}/>
   </g>
   <g className="bh-stars" aria-hidden="true">{[[10,30,0],[118,24,.15],[125,76,.3],[3,88,.45],[98,3,.6]].map(([x,y,d],i)=><path key={i} className="bh-star" style={{animationDelay:`${.55+(d as number)}s`,transformOrigin:`${x}px ${y}px`}} d={`M${x} ${(y as number)-6}L${(x as number)+1.5} ${(y as number)-1.5}L${(x as number)+6} ${y}L${(x as number)+1.5} ${(y as number)+1.5}L${x} ${(y as number)+6}L${(x as number)-1.5} ${(y as number)+1.5}L${(x as number)-6} ${y}L${(x as number)-1.5} ${(y as number)-1.5}Z`}/>)}</g>
   <g className="bh-rays" aria-hidden="true">{Array.from({length:8},(_,i)=>{const a=i*Math.PI/4+Math.PI/8,c=Math.cos(a),n=Math.sin(a);return <line key={i} className="bh-ray" x1={64+c*70} y1={60+n*66} x2={64+c*84} y2={60+n*79} style={{animationDelay:`${.3+i*.03}s`}}/>;})}</g>
   <g className="bh-body">
    <g className="bh-hop" key={hop}>
     <path d={PAGE} fill={`url(#${id('g')})`}/>
     <path className="bh-shine" d={PAGE} fill={`url(#${id('s')})`}/>
     <path className="bh-tint bh-tint-warm" d={PAGE} fill={`url(#${id('tw')})`}/>
     <path className="bh-tint bh-tint-cool" d={PAGE} fill={`url(#${id('tc')})`}/>
     <path className="bh-tint bh-tint-rose" d={PAGE} fill={`url(#${id('tr')})`}/>
     <g className="bh-fold"><path d={FOLD} fill="#3A20C4" opacity=".35" transform="translate(-2 3)"/><path d={FOLD} fill={`url(#${id('f')})`}/></g>
     <g className="bh-cheeks"><ellipse cx="39" cy="77" rx="7" ry="4.5"/><ellipse cx="89" cy="77" rx="7" ry="4.5"/></g>
     <g className="bh-eyes"><g className="bh-lid-a"><g className="bh-lid-b"><g className="bh-pupils">
      <ellipse cx="50" cy="62" rx="6.5" ry="8.5" fill="#1B1640"/><ellipse cx="78" cy="62" rx="6.5" ry="8.5" fill="#1B1640"/>
      <circle cx="52.2" cy="58.8" r="2.4" fill="#fff"/><circle cx="80.2" cy="58.8" r="2.4" fill="#fff"/>
     </g></g></g></g>
     <path className="bh-joy-eyes" d="M43 64Q50 55 57 64M71 64Q78 55 85 64" fill="none" stroke="#1B1640" strokeWidth="5" strokeLinecap="round"/>
     <g className="bh-mouth"><path className="bh-smile" d="M56 79Q64 87 72 79" pathLength={1} fill="none" stroke="#1B1640" strokeWidth="5" strokeLinecap="round"/></g>
     <g className="bh-grin"><path d="M54 76Q64 76 74 76Q72 89 64 89Q56 89 54 76Z" fill="#1B1640"/><path d="M58 84Q64 81 70 84Q67 88 64 88Q61 88 58 84Z" fill="#FF6F9C"/></g>
    </g>
   </g>
  </svg>
 </button>;
}
