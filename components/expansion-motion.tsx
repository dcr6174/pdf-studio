'use client';
import {useCallback,useEffect,useRef,useState} from 'react';
import type {ExpansionKind} from '@/lib/expansion-catalog';
import type {ArcadeEffect} from '@/lib/arcade-audio';
import {nextWave,resolveWave,nextTrafficX,safeTrafficStep,type RunningKind} from '@/lib/runner-hazards';
type Props={kind:ExpansionKind;active:boolean;comfort:boolean;onScore:(n:number)=>void;onFinish:(won:boolean,message:string)=>void;onSound:(effect:ArcadeEffect)=>void};
type Model={steps:number;lane:number;level:number;life:number;fuel:number;x:number;steer:number;bonus:number;altitude:number;speed:number;hold:boolean;jump:number;duck:number;message:string;over:boolean};
const newModel=():Model=>({steps:0,lane:1,level:0,life:3,fuel:100,x:0,steer:0,bonus:0,altitude:1,speed:2,hold:false,jump:0,duck:0,message:'Start moving! The next obstacle is coming.',over:false});
export function ExpansionMotion({kind,active,comfort,onScore,onFinish,onSound}:Props){
 const ref=useRef<Model>(newModel()),[s,setS]=useState<Model>(()=>newModel()),done=useRef(false);
 const publish=()=>setS({...ref.current});
 const finish=useCallback((won:boolean,message:string)=>{if(done.current)return;done.current=true;ref.current.over=true;ref.current.message=message;setS({...ref.current});onSound(won?'goal':'miss');onFinish(won,message);},[onSound,onFinish]);
 const move=(delta:number)=>{if(!active||done.current)return;const q=ref.current;if(kind==='prix'){q.x=Math.min(1.6,Math.max(-1.6,q.x+delta*.25));}else if(kind==='hill'){q.speed=Math.min(6,Math.max(.4,q.speed+delta*.4));}else if(kind==='rocket'){q.altitude=Math.min(2,Math.max(0,q.altitude-delta));}else if(kind==='river'||kind==='snow'){q.steer=Math.min(.46,Math.max(-.46,q.steer+delta*(kind==='river'?.18:.27)));}else{q.lane=Math.min(2,Math.max(0,q.lane+delta));}onSound('tap');publish();};
 const action=(what:'jump'|'duck')=>{if(!active||done.current)return;ref.current[what]=comfort?6:4;onSound('hit');publish();};
 const tick=useCallback(()=>{if(done.current||!active)return;const q=ref.current;
 if(kind==='traffic'){q.steps+=0.15;q.message='Choose your moment. Tap Forward only when the centre crossing is clear.';publish();return;}
 if(kind==='drift'){q.steps++;const curve=q.steps%12>=5&&q.steps%12<=9;if(q.steps%12===10){if(q.hold){q.life--;q.message='Release on the straight!';}else q.message='Straight section cleared.';}if(q.steps%12===7&&!q.hold){q.life--;q.message='Hold Drift through the corner!';}if(q.hold&&curve)q.message='Nice drift! Keep holding through the bend.';}
 else if(kind==='hill'){q.steps+=q.speed*.32;q.fuel-=q.speed*.6;const steep=Math.sin(q.steps/7)*.8+Math.sin(q.steps/13)*.5;q.message=steep>.6?'Steep climb! Add Gas.':'Rolling along the hills.';if(q.fuel<18)q.message='Fuel is running low!';if(q.fuel<=0)q.life=0;if(Math.floor(q.steps)%18===0&&q.fuel<100)q.fuel=Math.min(100,q.fuel+5);}
 else if(kind==='prix'){q.steps++;const road=Math.sin(q.steps/5)*.85;if(Math.abs(q.x-road)>.68){q.life--;q.message='Off the track. Steer toward the middle!';}else q.message='On track. Chase the next checkpoint.';}
 else{q.steps++;const nextGate=Math.floor(q.steps/8),detail=nextWave(kind as RunningKind,nextGate);
 if(kind==='river'||kind==='snow'){q.x=Math.min(1,Math.max(-1,q.x+q.steer));q.steer*=kind==='river'?.88:.7;q.lane=Math.max(0,Math.min(2,Math.round(q.x+1)));}
 if(kind==='rocket'){if(q.hold)q.altitude=Math.min(2,q.altitude+.26);else q.altitude=Math.max(0,q.altitude-.13);}
 if(q.steps%8===0&&q.steps>0){
 const test=resolveWave(kind as RunningKind,detail,q.lane,q.jump,q.duck);
 if(test.passed){q.level++;if(test.nearMiss)q.bonus+=15;q.message=test.nearMiss?'Near miss! Bonus +15.':test.reason;onSound('success');}
 else{q.life--;q.message=test.reason;onSound('miss');}
 }else if(q.steps%8>=4)q.message='Obstacle approaching. Read the lane and prepare.';}
 q.jump=Math.max(0,q.jump-1);q.duck=Math.max(0,q.duck-1);
 const target=kind==='hill'?72:kind==='prix'?90:kind==='drift'?100:kind==='rocket'?14:20;
 const progress=kind==='hill'||kind==='prix'||kind==='drift'?q.steps:q.level;
 onScore(Math.max(0,Math.floor(progress))*10+q.bonus);
 if(q.life<=0){finish(false,'You reached '+Math.floor(progress)+' checkpoints. Have another go!');return;}
 if(progress>=target){finish(true,'You finished all '+target+' checkpoints!');return;}
 publish();
 },[active,kind,onScore,onSound,finish]);
 useEffect(()=>{if(!active||done.current)return;const timer=setInterval(tick,Math.max(105,(comfort?255:185)-s.level*3));return()=>{clearInterval(timer);};},[active,comfort,tick,s.level]);
 const advance=()=>{if(!active||done.current)return;const q=ref.current;if(kind==='traffic'){const next=Math.floor(q.level),clear=safeTrafficStep(q.steps,next%8);if(!clear){q.life--;q.message='A car was passing! Wait for a clear gap.';onSound('miss');}else{q.level++;q.message='Safe crossing! Another lane ahead.';onSound('success');onScore(q.level*10);}if(q.life<=0)finish(false,'Traffic caught you. Try again with better timing.');if(q.level>=20)finish(true,'You safely crossed twenty lanes!');publish();return;}action('jump');};
 const hold=(yes:boolean)=>{if(!active||done.current)return;ref.current.hold=yes;publish();if(yes)onSound('tap');};
 const labels:Record<string,[string,string,string]>={
 highway:['Change lane','Avoid the red cars','20 traffic waves'],
 metro:['Lane / Jump / Duck','Crates and hanging signs','20 obstacles'],
 jungle:['Lane / Jump / Duck','Logs and jungle vines','20 obstacles'],
 hill:['Gas / Brake','Climb without running out of fuel','Rolling hills'],
 drift:['Hold / Release Drift','Drift only through the curves','100 track steps'],
 snow:['Steer through gates','Match the glowing gate lane','20 gates'],
 river:['Steer the boat','Sail through the buoy gap','20 gates'],
 rocket:['Thrust / Glide','Fly through a glowing ring','14 rings'],
 traffic:['Tap Forward','Wait for a safe gap','20 streets'],
 prix:['Steer the kart','Stay on the curving road','90 checkpoints']
 };
 const [,hint,goal]=labels[kind]??['Drive','Avoid obstacles','Finish'];
 const angle=Math.sin(s.steps/5)*.85;
 const sceneIsRunner=['highway','metro','jungle','snow','river'].includes(kind);
 const roadKind=kind==='river'?'#376eaa':kind==='snow'?'#e6edf6':kind==='jungle'?'#916e54':'#405369';
 const playerSymbol=kind==='river'?'🚤':kind==='snow'?'⛷️':kind==='highway'?'🚙':kind==='jungle'?'🏃':'🏃';
 const approaching=sceneIsRunner?nextWave(kind as RunningKind,Math.floor(s.steps/8)+1):null;
 const waveY=70+(s.steps%8)/8*332;
 const playerX=(kind==='river'||kind==='snow')?181+s.x*75:106+s.lane*75;
 return <div className="fresh-casual expand-motion">
 <div className="fresh-sport-top"><span>{goal} <b>{kind==='hill'||kind==='prix'||kind==='drift'?Math.floor(s.steps):s.level}</b></span><span>Hearts <b>{'♥'.repeat(Math.max(0,s.life))}</b></span>{kind==='highway'&&<span>Near-miss bonus <b>+{s.bonus}</b></span>}{kind==='hill'&&<span>Fuel <b>{Math.floor(s.fuel)}%</b></span>}</div>
 <svg className="expand-motion-view" viewBox="0 0 360 475" role="img" aria-label={hint} onPointerDown={e=>{if(!active)return;const r=e.currentTarget.getBoundingClientRect(),x=(e.clientX-r.left)/r.width;if(kind==='rocket')hold(true);else if(sceneIsRunner||kind==='prix')move(x<.45?-1:x>.55?1:0);}} onPointerUp={()=>{if(kind==='rocket')hold(false);}} onPointerCancel={()=>{if(kind==='rocket')hold(false);}}>
 <rect width="360" height="475" fill={kind==='snow'?'#a5d5ee':kind==='river'?'#bce4ca':kind==='rocket'?'#283c6a':kind==='hill'?'#bce1ec':'#8ebc9a'}/>
 {sceneIsRunner&&<><path d="M100 0H260L350 475H10z" fill={roadKind}/><path d="M154 0 128 475M206 0 232 475" stroke={kind==='snow'?'#8594b0':'#f2e6b899'} strokeDasharray="18 22" strokeWidth="5"/>
 {approaching&&<g transform={'translate('+(kind==='snow'||kind==='river'?105+approaching.gate*75:105+approaching.lane*75)+' '+waveY+') scale('+(0.55+waveY/475*.56)+')'}>
 {kind==='snow'||kind==='river'?<><path d="M-37 0H37" stroke="#ffe7a4" strokeWidth="13"/><circle cx="-37" r="10" fill="#f8a0bc"/><circle cx="37" r="10" fill="#f8a0bc"/></>:
 approaching.type==='car'?<g><rect x="-26" y="-24" width="52" height="60" rx="9" fill="#f19d83" stroke="#ffdac3" strokeWidth="5"/><rect x="-20" y="-10" width="40" height="22" rx="5" fill="#9cb5d2"/><path d="M-23 27H23" stroke="#fff0ad" strokeWidth="7"/></g>:
 approaching.type==='crate'||approaching.type==='log'?<g><rect x="-31" y="-22" width="62" height="45" rx="5" fill={approaching.type==='log'?'#906853':'#cfaa7c'} stroke="#f0dac3" strokeWidth="4"/><path d="M-25 -15L25 17M25 -15L-25 17" stroke="#684b40" strokeWidth="4"/></g>:
 <g><path d="M-35 -35H35V8H-35Z" fill={kind==='jungle'?'#4e8a6d':'#c5cad9'} stroke="#ffe9b6" strokeWidth="5"/><path d="M-30 5V22M30 5V22" stroke="#c3e2cf" strokeWidth="4"/></g>}
 </g>}
 <text x={playerX} y="410" textAnchor="middle" fontSize="55">{playerSymbol}</text>
 {(kind==='metro'||kind==='jungle')&&s.jump>0&&<text x={playerX} y="347" fontSize="24" textAnchor="middle">⬆</text>}
 {(kind==='metro'||kind==='jungle')&&s.duck>0&&<text x={playerX} y="347" fontSize="24" textAnchor="middle">⬇</text>}
 </>}
 {kind==='traffic'&&<>{Array.from({length:8},(_,i)=><g key={i}><rect x="20" y={i*60} width="320" height="46" fill="#414e67"/><path d={'M20 '+(i*60+23)+'H340'} stroke="#fff7" strokeDasharray="18 14" strokeWidth="2"/><text x={nextTrafficX(s.steps,i)} y={i*60+35} fontSize="30">🚕</text></g>)}<rect x="16" y={s.level%8*60} width="328" height="46" fill="none" stroke="#fee8ae" strokeWidth="3" strokeDasharray="9 7"/><text x="177" y="426" textAnchor="middle" fontSize="50">🚶</text></>}
 {kind==='hill'&&<><path d={Array.from({length:37},(_,i)=>{const x=i*10,y=280+Math.sin((i+s.steps*1.2)/5)*32+Math.sin((i+s.steps*1.2)/10)*25;return (i?'L':'M')+x+' '+y;}).join(' ')+'L360 475H0Z'} fill="#578c68"/><circle cx="128" cy={220+Math.sin(s.steps/5)*32} r="30" fill="#d0a3ef"/><text x="106" y={217+Math.sin(s.steps/5)*32} fontSize="47">🚙</text><text x="20" y="45" fontSize="20" fill="#254c3a">⛽ {Math.max(0,Math.floor(s.fuel))}%</text></>}
 {kind==='drift'&&<><path d="M170 0Q360 110 170 230T190 475" stroke="#b2b9c7" strokeWidth="110" fill="none"/><path d="M170 0Q360 110 170 230T190 475" stroke="#45536b" strokeWidth="90" fill="none"/><path d="M170 0Q360 110 170 230T190 475" stroke="#e2e3ca" strokeDasharray="25 20" strokeWidth="3" fill="none"/><text x="190" y="335" textAnchor="middle" fontSize="64" transform={'rotate('+(s.hold?25:-4)+' 190 330)'}>🏎️</text><text x="175" y="66" fontSize="20" textAnchor="middle" fill="#fff">{s.steps%12>=5&&s.steps%12<=9?'CORNER — HOLD DRIFT':'STRAIGHT — RELEASE'}</text></>}
 {kind==='prix'&&<><path d={'M'+(160+angle*44)+' 0Q'+(150-angle*54)+' 170 '+(188+angle*40)+' 475'} stroke="#45536b" strokeWidth="150" fill="none"/><path d={'M'+(160+angle*44)+' 0Q'+(150-angle*54)+' 170 '+(188+angle*40)+' 475'} stroke="#fff8b2" strokeDasharray="32 16" strokeWidth="4" fill="none"/><text x={185+s.x*46} y="360" textAnchor="middle" fontSize="64">🏎️</text></>}
 {kind==='rocket'&&<><circle cx="290" cy="62" r="31" fill="#f9dfa1"/><text x="20" y="50" fill="white" fontSize="18">Hold thrust to rise</text>{Array.from({length:4},(_,i)=><g key={i}><ellipse cx={80+i*75} cy={100+(((i+Math.floor(s.steps/8))*73)%250)} rx="28" ry="40" stroke="#7df0d1" strokeWidth="12" fill="none"/></g>)}<text x="110" y={375-s.altitude*110} textAnchor="middle" fontSize="65">🚀</text></>}
 </svg>
 <p className="fresh-instruction" role="status">{s.message}</p>
 <div className="fresh-row expand-motion-controls">
 {sceneIsRunner||kind==='prix'?<><button disabled={!active} onClick={()=>move(-1)}>◀ Left</button><button disabled={!active} onClick={()=>move(1)}>Right ▶</button></>:null}
 {(kind==='metro'||kind==='jungle')&&<><button disabled={!active} onClick={()=>action('jump')}>⬆ Jump</button><button disabled={!active} onClick={()=>action('duck')}>⬇ Duck</button></>}
 {kind==='hill'&&<><button disabled={!active} onClick={()=>move(-1)}>Brake</button><button disabled={!active} onClick={()=>move(1)}>⛽ Gas</button></>}
 {kind==='drift'&&<button className="fresh-primary" disabled={!active} onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);hold(true);}} onPointerUp={()=>hold(false)} onPointerCancel={()=>hold(false)} onKeyDown={e=>{if(e.key===' '||e.key==='Enter')hold(true);}} onKeyUp={()=>hold(false)}>🏎️ {s.hold?'DRIFTING':'Hold to drift'}</button>}
 {kind==='rocket'&&<><button disabled={!active} onClick={()=>move(-1)}>⬆ Higher</button><button className="fresh-primary" disabled={!active} onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);hold(true);}} onPointerUp={()=>hold(false)}>🚀 Hold thrust</button><button disabled={!active} onClick={()=>move(1)}>⬇ Lower</button></>}
 {kind==='traffic'&&<button className="fresh-primary" disabled={!active} onClick={advance}>🚶 Forward — cross next lane</button>}
 </div><p className="fresh-instruction">{hint}. {comfort?'Comfort Mode: slower movement.':'Controls also work with touch.'}</p></div>;
}
