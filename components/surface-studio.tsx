'use client';
import {useCallback,useEffect,useRef,useState,type PointerEvent} from 'react';
import type {ArcadeEffect} from '@/lib/arcade-audio';
type Props={kind:'clean'|'polish';active:boolean;comfort:boolean;onScore:(n:number)=>void;onFinish:(won:boolean,message:string)=>void;onSound:(effect:ArcadeEffect)=>void};
const W=720,H=420,COLS=36,ROWS=21;
function SurfaceArtwork({kind}:{kind:'clean'|'polish'}){
 return <svg className="surface-art" viewBox="0 0 720 420" role="img" aria-label={kind==='clean'?'Painted sunlit coastal garden under the dirty window':'An engraved copper and ceramic decorative plate gradually being polished'}>
 {kind==='clean'?<><defs><linearGradient id="surface-clean-sky" y2="1" x2="0"><stop offset="0" stopColor="#a3d4f1"/><stop offset="1" stopColor="#f5e7ad"/></linearGradient></defs>
  <rect width="720" height="420" fill="url(#surface-clean-sky)"/>
  <circle cx="553" cy="85" r="48" fill="#ffeaad"/><circle cx="553" cy="85" r="65" fill="none" stroke="#fff7cb88" strokeWidth="14"/>
  <path d="M0 263Q134 151 259 246T538 197T720 242V420H0Z" fill="#8cbab0"/>
  <path d="M0 300Q152 211 304 305T720 264V420H0Z" fill="#508f82"/>
  <path d="M0 348Q169 270 336 356T720 319V420H0Z" fill="#33786c"/>
  <path d="M321 420Q314 335 390 280T481 188" stroke="#e6c9a3" strokeWidth="46" fill="none"/>
  <path d="M330 420Q317 338 391 280T476 192" stroke="#fff1cf" strokeWidth="28" fill="none"/>
  <g><path d="M114 312V121" stroke="#755c4d" strokeWidth="17"/><path d="M58 148Q35 62 121 55Q202 47 203 139Q215 207 138 217Q49 204 58 148Z" fill="#4e9374"/><path d="M78 138Q56 77 124 79Q171 74 184 125" fill="none" stroke="#84bb8e" strokeWidth="18"/><circle cx="97" cy="156" r="8" fill="#ffdba8"/><circle cx="159" cy="134" r="9" fill="#ffdba8"/></g>
  {Array.from({length:24},(_,i)=>{const x=(i*107)%690+14,y=326+((i*17)%80);return <g key={i}><path d={'M'+x+' '+(y+10)+'v-21'} stroke="#c9d891" strokeWidth="3"/><circle cx={x} cy={y-10} r={5+i%3*2} fill={['#f8c3b6','#d9c4f1','#fff0b0'][i%3]}/></g>})}
  <path d="M0 0H720V420H0Z" fill="none" stroke="#e7f4f0" strokeWidth="11"/><path d="M360 0V420" stroke="#e1eeeb" strokeWidth="8"/>
 </>:<><defs><radialGradient id="surface-plate" cx=".35" cy=".23"><stop offset="0" stopColor="#ffefbc"/><stop offset=".45" stopColor="#eec180"/><stop offset="1" stopColor="#8d625d"/></radialGradient></defs>
  <rect width="720" height="420" fill="#31405e"/>
  {Array.from({length:13},(_,i)=><path key={i} d={'M'+(i*60-80)+' 420L'+(i*60+190)+' 0'} stroke="#d7e8de" strokeOpacity=".11" strokeWidth="2"/>)}
  <ellipse cx="360" cy="224" rx="245" ry="180" fill="#4e393d" opacity=".7"/>
  <ellipse cx="360" cy="201" rx="226" ry="171" fill="url(#surface-plate)" stroke="#fff0b9" strokeWidth="10"/>
  <ellipse cx="360" cy="201" rx="192" ry="145" fill="none" stroke="#a57761" strokeWidth="10"/>
  <ellipse cx="360" cy="201" rx="161" ry="118" fill="#598e9c" stroke="#ffe4a9" strokeWidth="5"/>
  <ellipse cx="360" cy="201" rx="139" ry="100" fill="none" stroke="#e8cda2" strokeWidth="3" strokeDasharray="7 9"/>
  <circle cx="360" cy="201" r="71" fill="#e3b878" stroke="#fff0bc" strokeWidth="8"/>
  <circle cx="360" cy="201" r="48" fill="#637a9b" stroke="#e9e4c3" strokeWidth="8"/>
  <circle cx="360" cy="201" r="26" fill="#dcb476"/><circle cx="351" cy="188" r="10" fill="#fff1cb" opacity=".65"/>
  {Array.from({length:16},(_,i)=>{const a=i*Math.PI/8,x=360+183*Math.cos(a),y=201+136*Math.sin(a);return <g key={i}><circle cx={x} cy={y} r="10" fill={i%2?'#d9a96d':'#f0e1b3'} stroke="#865f4a" strokeWidth="3"/><circle cx={x} cy={y} r="3" fill="#fff3d5"/></g>})}
  {Array.from({length:8},(_,i)=>{const a=i*Math.PI/4,x=360+108*Math.cos(a),y=201+82*Math.sin(a);return <path key={i} d={'M'+x+' '+y+'q-22 -20 -40 0q16 31 40 0Z'} fill="#f4dab1" stroke="#c4a17c" strokeWidth="3" transform={'rotate('+(i*45)+' '+x+' '+y+')'}/>})}
 </>}
 </svg>;
}
export function SurfaceStudio({kind,active,comfort,onScore,onFinish,onSound}:Props){
 const canvas=useRef<HTMLCanvasElement|null>(null),visited=useRef(new Set<number>()),pointer=useRef<{x:number;y:number}|null>(null),finished=useRef(false),lastSound=useRef(0);
 const [percent,setPercent]=useState(0),[radius,setRadius]=useState(comfort?44:31);
 useEffect(()=>{
  const el=canvas.current;if(!el)return;
  el.width=W;el.height=H;
  const ctx=el.getContext('2d');if(!ctx)return;
  ctx.globalCompositeOperation='source-over';
  const grd=ctx.createLinearGradient(0,0,W,H);
  if(kind==='clean'){grd.addColorStop(0,'rgba(92,87,80,.96)');grd.addColorStop(.65,'rgba(117,104,85,.97)');grd.addColorStop(1,'rgba(76,80,78,.98)');}
  else{grd.addColorStop(0,'rgba(98,109,121,.98)');grd.addColorStop(.5,'rgba(67,80,92,.96)');grd.addColorStop(1,'rgba(93,89,88,.98)');}
  ctx.fillStyle=grd;ctx.fillRect(0,0,W,H);
  // Stable speckles and streaks; artistic texture is generated locally and has no remote assets.
  for(let i=0;i<860;i++){const x=(i*97+i*i*11)%W,y=(i*59+i*i*7)%H;ctx.fillStyle=i%3===0?'#1e28261c':'#e3d7ad18';ctx.beginPath();ctx.arc(x,y,i%7+1,0,Math.PI*2);ctx.fill();}
  visited.current.clear();pointer.current=null;finished.current=false;
 },[kind]);
 const scrub=useCallback((x:number,y:number)=>{
  if(!active||finished.current)return;
  const el=canvas.current,ctx=el?.getContext('2d');if(!ctx)return;
  ctx.globalCompositeOperation='destination-out';
  const prev=pointer.current??{x,y};
  ctx.lineCap='round';ctx.lineJoin='round';ctx.lineWidth=radius*2;
  ctx.strokeStyle='rgba(0,0,0,1)';ctx.beginPath();ctx.moveTo(prev.x,prev.y);ctx.lineTo(x,y);ctx.stroke();
  ctx.beginPath();ctx.arc(x,y,radius,0,Math.PI*2);ctx.fillStyle='rgba(0,0,0,1)';ctx.fill();
  pointer.current={x,y};
  const minX=Math.max(0,Math.floor((Math.min(prev.x,x)-radius)/(W/COLS))),maxX=Math.min(COLS-1,Math.ceil((Math.max(prev.x,x)+radius)/(W/COLS)));
  const minY=Math.max(0,Math.floor((Math.min(prev.y,y)-radius)/(H/ROWS))),maxY=Math.min(ROWS-1,Math.ceil((Math.max(prev.y,y)+radius)/(H/ROWS)));
  const seen=visited.current;
  for(let row=minY;row<=maxY;row++)for(let col=minX;col<=maxX;col++){
   const cx=(col+.5)*W/COLS,cy=(row+.5)*H/ROWS;
   const dx=x-prev.x,dy=y-prev.y,t=Math.min(1,Math.max(0,((cx-prev.x)*dx+(cy-prev.y)*dy)/(dx*dx+dy*dy||1)));
   if(Math.hypot(cx-(prev.x+t*dx),cy-(prev.y+t*dy))<=radius)seen.add(row*COLS+col);
  }
  const n=Math.floor(seen.size/(COLS*ROWS)*100);
  setPercent(n);onScore(n);
  if(n%8===0&&Date.now()-lastSound.current>190){onSound('tap');lastSound.current=Date.now();}
  if(n>=88){finished.current=true;onSound('goal');onFinish(true,kind==='clean'?'Window clear! You uncovered the whole garden.':'Polish complete! The engraved plate is shining again.');}
 },[active,kind,onFinish,onScore,onSound,radius]);
 const pos=(e:PointerEvent<HTMLCanvasElement>)=>{const r=e.currentTarget.getBoundingClientRect();return{x:(e.clientX-r.left)/r.width*W,y:(e.clientY-r.top)/r.height*H};};
 return <div className="surface-experience"><div className="surface-top"><strong>{kind==='clean'?'WINDOW WASH':'BRASS POLISH'}</strong><span>Revealed <b>{percent}%</b> · Goal 88%</span></div>
 <div className="surface-viewport"><SurfaceArtwork kind={kind}/><canvas ref={canvas} className="surface-dirt" role="img" aria-label={kind==='clean'?'Dirty surface; drag to clean wherever you like':'Tarnished engraved plate; drag to polish in a continuous trail'} onPointerDown={e=>{if(!active)return;e.currentTarget.setPointerCapture(e.pointerId);const p=pos(e);pointer.current=null;scrub(p.x,p.y);}} onPointerMove={e=>{if(e.buttons&&active){const p=pos(e);scrub(p.x,p.y);}}} onPointerUp={()=>{pointer.current=null;}} onPointerCancel={()=>{pointer.current=null;}}/>
 </div>
 <div className="surface-meter" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent} aria-label="Surface revealed"><span style={{width:percent+'%'}}/></div>
 <div className="surface-controls"><label>Brush size <input type="range" min="18" max="56" step="2" value={radius} onChange={e=>setRadius(Number(e.target.value))}/></label><button disabled={!active} onClick={()=>{const n=visited.current.size;const index=n%(COLS*ROWS),col=index%COLS,row=Math.floor(index/COLS);pointer.current=null;scrub((col+.5)*W/COLS,(row+.5)*H/ROWS);}}>Clean next spot · keyboard</button></div>
 <p className="fresh-instruction">Drag your finger or mouse to wipe away the dirt with a smooth, continuous brush. The artwork is revealed exactly under the path — no tile disappearing. Choose a brush size; no timer or penalties.</p></div>;
}
