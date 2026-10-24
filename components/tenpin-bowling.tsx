'use client';
import {useCallback,useEffect,useRef,useState} from 'react';
import {bowlingFrameDisplay,simulateBowlingRoll,startBowling,type BowlingState} from '@/lib/tenpin-engine';
import {tenPins} from '@/lib/sport-contact';
import type {ArcadeEffect} from '@/lib/arcade-audio';
type Props={active:boolean;comfort:boolean;onScore:(points:number)=>void;onFinish:(won:boolean,message:string)=>void;onSound:(effect:ArcadeEffect)=>void};
type Flight=ReturnType<typeof simulateBowlingRoll>['flight'];
const cx=(aim:number)=>250+(aim-2)*37;
export function TenPinBowling({active,comfort,onScore,onFinish,onSound}:Props){
 const [game,setGame]=useState<BowlingState>(startBowling);
 const [aim,setAim]=useState(2),[power,setPower]=useState(66),[hook,setHook]=useState(0);
 const [flight,setFlight]=useState<Flight|null>(null),[travel,setTravel]=useState(0),[preview,setPreview]=useState<number[]>([]);
 const pending=useRef<ReturnType<typeof simulateBowlingRoll>|null>(null);
 const committed=useRef(false);
 const shoot=useCallback(()=>{
  if(!active||committed.current||game.ended)return;
  committed.current=true;
  const result=simulateBowlingRoll(game,aim,power,hook);
  pending.current=result;
  setFlight(result.flight);setPreview(result.flight.contacted);
  setTravel(0);onSound('hit');
 },[active,game,aim,power,hook,onSound]);
 useEffect(()=>{
  if(!active||!flight||!pending.current)return;
  let raf=0,start=0,previous=0;
  const tick=(now:number)=>{
   if(!start)start=now;
   const p=Math.min(1,(now-start)/(comfort?1350:900));
   if(now-previous>24||p===1){setTravel(p);previous=now;}
   if(p<1){raf=requestAnimationFrame(tick);return;}
   const next=pending.current?.next;
   pending.current=null;
   setFlight(null);setPreview([]);committed.current=false;
   if(!next)return;
   setGame(next);onScore(next.total);onSound(next.isStrike?'goal':next.lastPins>=6?'success':'bounce');
   if(next.ended)onFinish(next.total>=105,'Ten-frame game complete. Your scored '+next.total+' pins with strike and spare bonuses. '+(next.total>=105?'Target cleared!':'Beat 105 to win next time.'));
  };
  raf=requestAnimationFrame(tick);
  return()=>cancelAnimationFrame(raf);
 },[active,flight,comfort,onFinish,onScore,onSound]);
 const frameDisplay=bowlingFrameDisplay(game.rolls);
 const shownFrame=Math.min(10,game.frame+1);
 const standing=new Set(game.standing);
 const end=flight?flight.endX:cx(aim)+(power-55)*.32+hook*26;
 const showPin=(id:number,y:number)=>!preview.includes(id)||travel<Math.max(.2,(260-y)/210);
 return <div className="tenpin-game">
  <div className="tenpin-score"><div><small>FRAME</small><strong>{shownFrame} / 10</strong></div><div><small>TOTAL</small><strong>{game.total}</strong></div><div><small>THIS FRAME</small><strong>{game.attempt+1}{game.attempt===0?'st':game.attempt===1?'nd':'rd'} roll</strong></div><div><small>PINS LEFT</small><strong>{game.standing.length}</strong></div></div>
  <svg className="tenpin-lane" viewBox="0 0 500 330" role="img" aria-label={'Bowling lane with '+game.standing.length+' standing pins. A projected roll path and moving ball.'} onPointerDown={e=>{if(!active||!!flight)return;const r=e.currentTarget.getBoundingClientRect(),x=(e.clientX-r.left)/r.width;setAim(Math.max(0,Math.min(4,Math.round(x*5-.5))));}}>
   <defs><linearGradient id="tenpin-lane-floor" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#a97f58"/><stop offset=".1" stopColor="#efd2a0"/><stop offset=".5" stopColor="#e9c89a"/><stop offset=".9" stopColor="#efd2a0"/><stop offset="1" stopColor="#a97f58"/></linearGradient></defs>
   <rect width="500" height="330" rx="17" fill="#3c3d53"/>
   <path d="M145 7H355L415 325H85Z" fill="url(#tenpin-lane-floor)" stroke="#ffe7b8" strokeWidth="6"/>
   <path d="M131 3L68 326M371 3L432 326" stroke="#544e56" strokeWidth="23"/>
   {[0,1,2,3].map(i=><path key={i} d={'M'+(185+i*43)+' 8l'+((i-1.5)*13)+' 312'} stroke="#fcebd0" opacity=".21" strokeWidth="4"/>)}
   <path d={'M250 289Q'+(249+hook*50)+' 172 '+end+' 66'} fill="none" stroke="#ebfbdb" strokeWidth="3" strokeDasharray="9 7" opacity={flight?.3:.75}/>
   {tenPins.filter(p=>standing.has(p.id)).map(p=><g key={p.id} transform={'translate('+p.x+' '+p.y+')'} opacity={showPin(p.id,p.y)?1:.12}>
    <ellipse cx="0" cy="7" rx="9" ry="4" fill="#2a29284b"/><path d="M-6 -11Q-2 -15 0 -16Q4 -15 7 -11L8 7H-8Z" fill="#fffaf0" stroke="#d3af97" strokeWidth="1.7"/><path d="M-7 -3H7" stroke="#d66e78" strokeWidth="4"/><circle cx="0" cy="-14" r="6" fill="#fffaf0"/>
   </g>)}
   {flight?<circle cx={250+(flight.endX-250)*travel} cy={289-219*travel} r={12-travel*3} fill="#345d85" stroke="#f9e4d5" strokeWidth="3"/>:<circle cx={250} cy={289} r="13" fill="#345d85" stroke="#f9e4d5" strokeWidth="3"/>}
   {travel>=.6&&preview.length>0&&<text x="250" y="145" textAnchor="middle" fontWeight="900" fontSize="32" fill="#fef6c9" stroke="#523c47" strokeWidth=".4">{preview.length} PINS!</text>}
   <text x="20" y="29" fill="#f2edf1" fontSize="12" fontWeight="750">TEN-PIN · FULL SCORE</text>
  </svg>
  <div className="tenpin-frames" aria-label="Ten bowling frame scorecards">{frameDisplay.map((rolls,i)=><div key={i} className={i===game.frame?'is-current':''}><small>{i+1}</small><strong>{rolls.join(' · ')||'—'}</strong></div>)}</div>
  <div className="tenpin-control"><div className="tenpin-aim"><span>START POSITION</span>{[0,1,2,3,4].map(i=><button key={i} aria-pressed={aim===i} disabled={!active||!!flight} onClick={()=>setAim(i)}>{i+1}</button>)}</div>
  <label>Power <strong>{power}%</strong><input type="range" min="25" max="100" value={power} onChange={e=>setPower(Number(e.target.value))} disabled={!active||!!flight}/></label>
  <label>Hook <strong>{hook<0?'Left':hook>0?'Right':'Straight'}</strong><input type="range" min="-2" max="2" step="1" value={hook} onChange={e=>setHook(Number(e.target.value))} disabled={!active||!!flight}/></label>
  <button className="tenpin-bowl" disabled={!active||!!flight||game.ended} onClick={shoot}>{flight?'● Ball rolling…':'● Roll ball'}</button></div>
  <p role="status" className="tenpin-result">{game.message} Normal ten-pin strike/spare bonuses apply. Aim and power change the actual collision path.</p>
 </div>;
}
