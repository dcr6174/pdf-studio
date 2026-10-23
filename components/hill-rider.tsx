'use client';
import {useCallback,useEffect,useRef,useState,type PointerEvent} from 'react';
import {createHill,hillFuelStations,hillGoal,hillHeight,hillRocks,hillSlope,stepHill,type HillInput,type HillModel,type HillTrack} from '@/lib/hill-physics';
import type {ArcadeEffect} from '@/lib/arcade-audio';
type Props={active:boolean;comfort:boolean;onScore:(score:number)=>void;onFinish:(won:boolean,message:string)=>void;onSound:(effect:ArcadeEffect)=>void};
const tracks:{id:HillTrack;label:string}[]=[{id:'meadow',label:'Green Valley'},{id:'canyon',label:'Dusty Hills'},{id:'ridge',label:'Rocky Ridge'}];
const clamp=(v:number,a:number,b:number)=>Math.min(b,Math.max(a,v));
export function HillRider({active,comfort,onScore,onFinish,onSound}:Props){
 const [track,setTrack]=useState<HillTrack>('meadow');
 const [view,setView]=useState<HillModel>(()=>createHill('meadow'));
 const model=useRef<HillModel>(createHill('meadow'));
 const controls=useRef<HillInput>({gas:false,brake:false,jump:false,tilt:0});
 const done=useRef(false),scoreRef=useRef(0);
 const reset=useCallback((kind:HillTrack)=>{const fresh=createHill(kind);model.current=fresh;setView(fresh);done.current=false;scoreRef.current=0;controls.current={gas:false,brake:false,jump:false,tilt:0};onScore(0);},[onScore]);
 useEffect(()=>{
  if(!active||done.current)return;
  let frame=0,last=0,seen=0;
  const tick=(now:number)=>{
   if(!last)last=now;const dt=Math.min(.045,(now-last)/1000);last=now;
   const adjusted=comfort?dt*.83:dt;
   const {state,event}=stepHill(model.current,controls.current,adjusted,track);
   model.current=state;controls.current.jump=false;
   const point=Math.floor(state.best/10)*10;
   if(point>scoreRef.current){scoreRef.current=point;onScore(point);}
   if(event==='fuel')onSound('success');
   if(event==='collision')onSound('miss');
   if(event==='jump')onSound('bounce');
   if(now-seen>32||state.done){setView({...state});seen=now;}
   if(state.done){
    done.current=true;
    const won=event==='finished';
    onFinish(won,won?'Hill Rider cleared '+hillGoal+' metres! '+Math.ceil(state.fuel)+'% fuel left.':
     event==='empty'?'Out of fuel at '+Math.floor(state.best)+' metres. Use hills and collect fuel.':'Car damaged after three collisions at '+Math.floor(state.best)+' metres.');
    return;
   }
   frame=requestAnimationFrame(tick);
  };
  frame=requestAnimationFrame(tick);return()=>cancelAnimationFrame(frame);
 },[active,comfort,track,onScore,onFinish,onSound]);
 useEffect(()=>{
  if(!active)return;
  const keyDown=(e:KeyboardEvent)=>{if(e.target instanceof HTMLInputElement||e.target instanceof HTMLSelectElement)return;
   if(e.key==='ArrowRight'||e.key.toLowerCase()==='d'){e.preventDefault();controls.current.gas=true;}
   if(e.key==='ArrowLeft'||e.key.toLowerCase()==='a'){e.preventDefault();controls.current.brake=true;}
   if(e.key===' '||e.key==='ArrowUp'){e.preventDefault();controls.current.jump=true;}
   if(e.key.toLowerCase()==='q')controls.current.tilt=-1;
   if(e.key.toLowerCase()==='e')controls.current.tilt=1;
  };
  const keyUp=(e:KeyboardEvent)=>{if(e.key==='ArrowRight'||e.key.toLowerCase()==='d')controls.current.gas=false;if(e.key==='ArrowLeft'||e.key.toLowerCase()==='a')controls.current.brake=false;if('qe'.includes(e.key.toLowerCase()))controls.current.tilt=0;};
  window.addEventListener('keydown',keyDown);window.addEventListener('keyup',keyUp);
  return()=>{window.removeEventListener('keydown',keyDown);window.removeEventListener('keyup',keyUp);controls.current.gas=false;controls.current.brake=false;controls.current.tilt=0;};
 },[active]);
 const camera=Math.max(0,view.x-210);
 const terrain=Array.from({length:97},(_,i)=>{const x=camera+i*8,y=hillHeight(x,track);return{x,y};});
 const ground='M0 420L'+terrain.map(p=>(p.x-camera).toFixed(1)+' '+p.y.toFixed(1)).join('L')+'L760 420Z';
 const slope=hillSlope(view.x,track),canSwitch=view.x<68&&view.best<68;
 const press=(name:'gas'|'brake',value:boolean)=>(e:PointerEvent<HTMLButtonElement>)=>{if(value)e.currentTarget.setPointerCapture(e.pointerId);controls.current[name]=value;};
 return <div className="play-hill">
 <div className="play-hill-stats"><span>DISTANCE <b>{Math.floor(view.best)} / {hillGoal} m</b></span><span>SPEED <b>{Math.floor(Math.abs(view.vx)*1.7)} km/h</b></span><span>FUEL <b>{Math.floor(view.fuel)}%</b></span><span>DAMAGE <b>{view.damage}/3</b></span></div>
 <svg className="play-hill-stage" viewBox="0 0 760 390" role="img" aria-label={'Side-scrolling '+track+' with moving car, slopes, fuel and rocks. Distance '+Math.floor(view.best)+' meters.'}>
 <defs><linearGradient id="hill-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#98cce9"/><stop offset="1" stopColor="#fff0bf"/></linearGradient><linearGradient id="hill-earth" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={track==='canyon'?'#c99875':'#70b782'}/><stop offset="1" stopColor={track==='ridge'?'#465a63':'#48754f'}/></linearGradient></defs>
 <rect width="760" height="390" fill="url(#hill-sky)"/>
 <circle cx={680-(camera*.04)%900} cy="70" r="34" fill="#fff2b7" opacity=".85"/>
 <path d="M0 244Q100 160 200 223T410 187T760 229V390H0Z" fill="#93b3b1" opacity=".55"/>
 <path d="M0 281Q130 204 240 265T490 232T760 285V390H0Z" fill="#7db3ac" opacity=".5"/>
 <path d={ground} fill="url(#hill-earth)" stroke="#d6eab1" strokeWidth="6" strokeLinejoin="round"/>
 {terrain.filter((_,i)=>i%4===0).map((p,i)=><path key={i} d={'M'+(p.x-camera)+' '+(p.y+4)+'l-9 12'} stroke="#396b4e" strokeWidth="2" opacity=".35"/>)}
 {hillFuelStations.filter(x=>x>camera-30&&x<camera+800&&!view.collected.includes(x)).map(x=><g key={x} transform={'translate('+(x-camera)+' '+(hillHeight(x,track)-45)+')'}><circle r="20" fill="#fbe9a6" stroke="#d99856" strokeWidth="3"/><rect x="-7" y="-14" width="14" height="26" rx="3" fill="#4a9478"/><text y="-24" textAnchor="middle" fontWeight="900" fontSize="11" fill="#355e51">+35</text></g>)}
 {hillRocks.filter(x=>x>camera-30&&x<camera+800&&!view.hazards.includes(x)).map(x=><path key={x} d={'M'+(x-camera-19)+' '+hillHeight(x,track)+'l13-29 23 0 11 28Z'} stroke="#ddd0aa" strokeWidth="2" fill="#766e74"/>)}
 <g transform={'translate('+(view.x-camera)+' '+view.y+') rotate('+(view.angle*180/Math.PI)+')'}>
  <ellipse cx="0" cy="36" rx="48" ry="8" fill="#23382a56"/>
  <circle cx="-29" cy="24" r="17" fill="#27383d" stroke="#101d22" strokeWidth="5"/>
  <circle cx="31" cy="24" r="17" fill="#27383d" stroke="#101d22" strokeWidth="5"/>
  <circle cx="-29" cy="24" r="7" fill="#e6e0d3"/><circle cx="31" cy="24" r="7" fill="#e6e0d3"/>
  <path d="M-57 5L-44-16H5L32-2 55 8 52 25H-56Z" fill="#f4b978" stroke="#ffffffd8" strokeWidth="3"/>
  <path d="M-28-14L-15-30H10L29-14Z" fill="#2e677e" stroke="#e8efe9" strokeWidth="3"/>
  <rect x="31" y="3" width="15" height="7" rx="2" fill="#fff5c2"/>
  <circle cx="-5" cy="-36" r="8" fill="#f3cca8"/><path d="M-11 -43h13v6h-17Z" fill="#264e65"/>
 </g>
 <g transform="translate(12 16)"><rect width="215" height="23" rx="8" fill="#183d48dd"/><rect x="5" y="5" width={clamp(view.best/hillGoal*205,0,205)} height="13" rx="5" fill="#9ce2b2"/><text x="110" y="16" fontSize="11" textAnchor="middle" fontWeight="850" fill="#fff">TRACK PROGRESS</text></g>
 <text x="14" y="374" fill="#153f3c" fontSize="13" fontWeight="800">SLOPE {slope>0?'+':''}{slope.toFixed(2)} · {view.airborne?'AIRBORNE':'ON GROUND'}</text>
 </svg>
 <div className="play-hill-controller">
 <div className="play-hill-driving"><button className="play-hill-brake" disabled={!active} onPointerDown={press('brake',true)} onPointerUp={press('brake',false)} onPointerCancel={press('brake',false)}>◀ HOLD BRAKE</button><button className="play-hill-jump" disabled={!active} onClick={()=>{controls.current.jump=true;}}>↥ JUMP</button><button className="play-hill-gas" disabled={!active} onPointerDown={press('gas',true)} onPointerUp={press('gas',false)} onPointerCancel={press('gas',false)}>HOLD GAS ▶</button></div>
 <div className="play-hill-secondary"><span>Car tilts naturally with the slope. During jumps, Q/E adjusts balance:</span><button disabled={!active} onPointerDown={()=>{controls.current.tilt=-1;}} onPointerUp={()=>{controls.current.tilt=0;}}>↶ LEAN BACK</button><button disabled={!active} onPointerDown={()=>{controls.current.tilt=1;}} onPointerUp={()=>{controls.current.tilt=0;}}>LEAN FORWARD ↷</button></div>
 {canSwitch&&<div className="play-hill-track"><span>TRACK</span>{tracks.map(t=><button key={t.id} aria-pressed={track===t.id} onClick={()=>{setTrack(t.id);reset(t.id);}}>{t.label}</button>)}</div>}
 </div>
 <p className="fresh-instruction">Hold Gas to accelerate and Brake to control descents; leap over rocks and reach the finish before fuel or your three collision chances run out. Collect glowing fuel cans along the way. Keyboard: → Gas, ← Brake, ↑ Jump, Q/E lean. Comfort Mode slows the physics.</p>
 </div>;
}
