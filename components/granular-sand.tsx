'use client';
import {useCallback,useEffect,useRef,useState} from 'react';
import type {ArcadeEffect} from '@/lib/arcade-audio';
type Props={active:boolean;comfort:boolean;onScore:(n:number)=>void;onFinish:(won:boolean,message:string)=>void;onSound:(effect:ArcadeEffect)=>void};
const targets=[62,76,57,82,68,89] as const;
const sands=['#f3c487','#b5dfcc','#e7b4b7','#cfc1f2','#eedb96','#a7d5ed'];
export function SandPour({active,comfort,onScore,onFinish,onSound}:Props){
 const [jar,setJar]=useState(0),[fill,setFill]=useState(0),[rate,setRate]=useState(2),[spout,setSpout]=useState(360),[pouring,setPouring]=useState(false),[spill,setSpill]=useState(0),[message,setMessage]=useState('Move the spout over the jar. Hold Pour; stop near the glowing fill mark.'),[time,setTime]=useState(0);
 const model=useRef({fill:0,spilled:0,jar:0,done:false}),last=useRef(0),soundAt=useRef(0),pour=useRef(false);
 const finished=useRef(false);
 const target=targets[Math.min(jar,targets.length-1)];
 const seal=useCallback(()=>{
  if(!active||model.current.done)return;
  const difference=model.current.fill-target;
  if(Math.abs(difference)>3){setMessage(difference>0?'Overfilled by '+Math.abs(difference).toFixed(1)+'%. Empty and try again.':'Fill is '+Math.abs(difference).toFixed(1)+'% below the mark. Pour a little more.');onSound('miss');return;}
  const points=Math.max(25,100-Math.round(Math.abs(difference)*13)-Math.floor(model.current.spilled/6)*5);
  const next=jar+1;onScore(next*100+points);onSound('goal');
  pour.current=false;setPouring(false);
  if(next>=targets.length){model.current.done=true;finished.current=true;setMessage('Six accurate fills complete! Precision bonus '+points+'.');onFinish(true,'Six jars filled with flowing sand. Last accuracy bonus '+points+' points.');return;}
  model.current={fill:0,spilled:0,jar:next,done:false};
  setJar(next);setFill(0);setSpill(0);setSpout(360);setMessage('Sealed jar '+next+'. Next target '+targets[next]+'%.');
 },[jar,target,active,onScore,onSound,onFinish]);
 useEffect(()=>{
  if(!active||!pouring||finished.current)return;
  let frame=0,prev=0,seen=0;
  const tick=(now:number)=>{
   if(!prev)prev=now;const dt=Math.min(.045,(now-prev)/1000);prev=now;
   if(!pour.current)return;
   const m=model.current,delta=dt*(rate===1?9:rate===2?18:29)*(comfort?.78:1);
   const aligned=Math.abs(spout-360)<=36;
   if(aligned)m.fill=Math.min(100,m.fill+delta);
   else m.spilled+=delta;
   if(now-seen>35){setFill(m.fill);setSpill(m.spilled);setTime(now);seen=now;}
   if(m.fill>target+5||m.spilled>65){
    pour.current=false;setPouring(false);setMessage(m.fill>target+5?'Overflow! Empty and restart this jar.':'Too much sand missed the jar. Align the nozzle and restart.');onSound('miss');return;
   }
   if(now-soundAt.current>430){onSound('tap');soundAt.current=now;}
   frame=requestAnimationFrame(tick);
  };
  frame=requestAnimationFrame(tick);return()=>cancelAnimationFrame(frame);
 },[pouring,active,rate,spout,target,comfort,onSound]);
 const toggle=()=>{if(!active||finished.current)return;const value=!pour.current;pour.current=value;setPouring(value);if(value)onSound('tap');};
 const reset=()=>{pour.current=false;setPouring(false);model.current.fill=0;model.current.spilled=0;setFill(0);setSpill(0);setMessage('Jar emptied. Try again with a gentler pour.');};
 const setNozzle=(x:number)=>setSpout(Math.max(200,Math.min(520,x)));
 return <div className="sand-pour-game">
  <div className="sand-head"><span>JAR {jar+1} OF {targets.length}</span><strong>Target {target}%</strong><span>Fill {fill.toFixed(1)}% · Spill {spill.toFixed(0)}%</span></div>
  <svg viewBox="0 0 720 420" className="sand-pour-stage" role="img" aria-label={'Granular sand jar '+(jar+1)+', target '+target+' percent, current fill '+fill.toFixed(1)+' percent'} onPointerDown={e=>{if(!active)return;const r=e.currentTarget.getBoundingClientRect();setNozzle((e.clientX-r.left)*720/r.width);}}>
   <defs><linearGradient id="sand-back" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#344963"/><stop offset="1" stopColor="#1e2f43"/></linearGradient><pattern id="sand-lines" patternUnits="userSpaceOnUse" width="14" height="10"><path d="M0 5h14" stroke="#fff4ba" strokeWidth="1" opacity=".16"/></pattern></defs>
   <rect width="720" height="420" rx="17" fill="url(#sand-back)"/>
   <rect x="45" y="360" width="630" height="18" rx="5" fill="#d5b995"/><rect x="65" y="380" width="588" height="13" rx="4" fill="#907e71"/>
   <path d={'M'+(spout-55)+' 18H'+(spout+55)+'L'+(spout+23)+' 96L'+(spout+14)+' 126H'+(spout-14)+'L'+(spout-23)+' 96Z'} fill={sands[jar]} stroke="#ffe9c8" strokeWidth="5"/>
   {pouring&&Array.from({length:22},(_,i)=>{
     const speed=1.35+rate*.22,phase=(time/1000*speed+i/22)%1;
     const y=127+phase*222,x=spout+Math.sin(i*8.3+phase*5)*4+(spout-360)*.025;
     return <circle key={i} cx={x} cy={y} r={i%3===0?3.2:1.7} fill={sands[jar]} opacity={1-phase*.45}/>;
   })}
   <path d="M274 171H446L462 339Q463 359 442 359H278Q257 358 258 339Z" fill="#ccefff12" stroke="#e6eef5" strokeWidth="8"/>
   <path d="M276 175H444L448 340Q447 348 438 348H282Q271 348 272 340Z" fill="#ffffff0d"/>
   <rect x="278" y={348-169*Math.min(100,fill)/100} width="164" height={169*Math.min(100,fill)/100} fill={sands[jar]} opacity=".9"/>
   <rect x="278" y={348-169*Math.min(100,fill)/100} width="164" height={169*Math.min(100,fill)/100} fill="url(#sand-lines)"/>
   <path d={'M264 '+(348-169*target/100)+'H456'} stroke="#ffed9f" strokeWidth="5" strokeDasharray="12 5"/>
   <text x="469" y={345-169*target/100} fill="#ffeab8" fontSize="15" fontWeight="900">{target}%</text>
   <path d="M283 171H435" stroke="#fff7e6" strokeWidth="5" strokeLinecap="round"/>
   <path d="M250 372Q360 347 469 372" stroke="#ffffff24" strokeWidth="8" fill="none"/>
   <path d={'M'+(spout-70)+' 34H'+(spout+70)} stroke="#ffffff66" strokeWidth="2"/>
   {spill>0&&Array.from({length:Math.min(15,Math.ceil(spill/4))},(_,i)=><ellipse key={i} cx={270+(i*37)%180} cy={357+i%3*2} rx={5+i%3*2} ry="3" fill={sands[jar]}/>)}
   <text x="25" y="32" fill="#e1f1eb" fontWeight="850" fontSize="13">DRAG TOP TO POSITION SPOUT</text>
  </svg>
  <div className="sand-actions"><label>Flow <select value={rate} onChange={e=>setRate(Number(e.target.value))} disabled={!active}><option value="1">Gentle</option><option value="2">Normal</option><option value="3">Fast</option></select></label><button className="sand-hold" disabled={!active||finished.current} aria-pressed={pouring} onClick={toggle}>{pouring?'Ⅱ Stop pouring':'▶ Start pouring'}</button><button disabled={!active} onClick={seal}>✓ Seal near target</button><button disabled={!active} onClick={reset}>↶ Empty</button></div>
  <p className="fresh-instruction" role="status">{message} Keep the flowing grains inside the mouth of the jar. Fine adjustments improve accuracy.</p>
 </div>;
}
