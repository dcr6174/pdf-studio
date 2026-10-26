'use client';
import {useCallback,useEffect,useRef,useState} from 'react';
import {applyStroke,ballAt,createInnings,cricketFielders,evaluateStroke,inningsResult,makeDelivery,missedDelivery,renderOvers,requiredRate,type BowledBall,type Difficulty,type Footwork,type Innings,type ShotSide,type StrokeResult} from '@/lib/cricket-engine';
import type {ArcadeEffect} from '@/lib/arcade-audio';
type Props={active:boolean;comfort:boolean;sound?:boolean;onToggleSound?:()=>void;onScore:(score:number)=>void;onFinish:(won:boolean,message:string)=>void;onSound:(effect:ArcadeEffect)=>void};
type Phase='setup'|'bowling'|'result'|'done';
const sideInfo:{id:ShotSide;label:string;key:string;icon:string}[]=[
 {id:'leg',label:'LEG SIDE',key:'←',icon:'↖'},
 {id:'straight',label:'STRAIGHT',key:'↓ / Space',icon:'↑'},
 {id:'off',label:'OFF SIDE',key:'→',icon:'↗'}
];
const fieldMap:Record<ShotSide,{x:number;y:number}>={leg:{x:83,y:181},straight:{x:373,y:55},off:{x:663,y:188}};
function CricketStadium({ball,elapsed,result,shotDirection,loft,phase,strokeFlash}:{
 ball:BowledBall;elapsed:number;result:StrokeResult|null;shotDirection:ShotSide;loft:boolean;phase:Phase;strokeFlash:number;
}){
 const current=ballAt(ball,elapsed),target=result?{x:result.impactX,y:result.impactY}:fieldMap[shotDirection];
 const sw=Math.min(1,elapsed/ball.contactMs),landing=ballAt(ball,ball.contactMs*ball.bounce);
 const progressPercent=Math.round(sw*100);
 return <svg className="play-cricket-field" viewBox="0 0 760 555" role="img" aria-label={'Cricket ground from behind the striker; ball approaching '+ball.length+' length on '+(ball.line<-1?'leg':ball.line>1?'off':'middle')+' stump. Delivery progress '+progressPercent+' percent.'}>
 <defs>
 <radialGradient id="pc-outfield" cx="49%" cy="54%" r="70%"><stop offset="0" stopColor="#7dbb6f"/><stop offset=".75" stopColor="#4e9a62"/><stop offset="1" stopColor="#2b704c"/></radialGradient>
 <linearGradient id="pc-stand" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3a355c"/><stop offset="1" stopColor="#616389"/></linearGradient>
 <linearGradient id="pc-pitch" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#d8ba85"/><stop offset="1" stopColor="#a98757"/></linearGradient>
 <filter id="pc-ball-shadow"><feGaussianBlur stdDeviation="2"/></filter>
 </defs>
 <rect width="760" height="555" rx="20" fill="#8ed0db"/>
 <path d="M0 67Q380 -25 760 67V191H0Z" fill="url(#pc-stand)"/>
 {Array.from({length:43},(_,i)=><g key={i}><rect x={i*19-5} y={82+i%3*11} width="8" height="5" rx="2" fill={['#e6c69c','#b5dfe6','#efb7b8','#d8cbf0'][i%4]}/><rect x={i*18+8} y={121+i%4*8} width="7" height="5" rx="2" fill="#e2d6c5"/></g>)}
 <rect y="176" width="760" height="15" fill="#e9ece3"/>
 <rect y="191" width="760" height="364" fill="url(#pc-outfield)"/>
 <ellipse cx="380" cy="363" rx="350" ry="162" fill="none" stroke="#d5e5b1" strokeWidth="3.5" strokeDasharray="9 7" opacity=".75"/>
 {[215,292,370,449].map((y,i)=><path key={i} d={'M33 '+y+'Q380 '+(y-42)+' 727 '+y} fill="none" stroke="#ffffff16" strokeWidth="19"/>)}
 <path d="M335 159H425L513 550H248Z" fill="url(#pc-pitch)" stroke="#ffeac3" strokeWidth="3"/>
 <path d="M332 193H428M276 466H480" stroke="#fff5d9" strokeWidth="6"/>
 <path d="M353 171V199M374 171V199M395 171V199M348 456V500M378 456V500M408 456V500" stroke="#e7b985" strokeWidth="1.5" opacity=".7"/>
 <path d="M352 168V135M379 168V135M406 168V135" stroke="#fff4da" strokeWidth="7" strokeLinecap="round"/>
 <path d="M348 135H411" stroke="#fff4da" strokeWidth="5"/>
 {cricketFielders.map((p,i)=><g key={p.name} transform={'translate('+p.x+' '+p.y+')'}><ellipse cy="11" rx="13" ry="5" fill="#244d4b44"/><circle cy="-9" r="7" fill="#f1c4a8"/><path d="M-9 -2h18l8 20h-34z" fill={i%2?'#eea784':'#fee3a9'} stroke="#ffffffaa" strokeWidth="1.5"/><circle cx="0" cy="-19" r="5" fill="#263e61"/></g>)}
 <g transform="translate(378 188) scale(.78)"><ellipse cy="19" rx="13" ry="4" fill="#533d2866"/><circle cy="-17" r="12" fill="#f4c3a5"/><path d="M-14 -6h28l6 37h-38z" fill="#e0e8f2" stroke="#7da5bd" strokeWidth="2"/><path d="M-13 30l-6 24m31-24 8 24" stroke="#e0e8f2" strokeWidth="8" strokeLinecap="round"/></g>
 <g transform="translate(362 474)"><ellipse cx="-10" cy="51" rx="30" ry="8" fill="#45382266"/><path d="M-7 -10l-10 41m17-40 18 42" stroke="#dfe7fa" strokeWidth="14" strokeLinecap="round"/><path d="M-31 -12Q-8 -30 15 -18l16 39-52 6z" fill="#f5f5ec" stroke="#879aaf" strokeWidth="3"/><circle cx="-6" cy="-34" r="15" fill="#d79f82"/><path d="M-22 -38q7-21 30-15l12 10-26 8z" fill="#315e86"/><path d="M-25 -1l-14 16m36-21 28 7" stroke="#f0bb9e" strokeWidth="12" strokeLinecap="round"/><path className={phase==='result'?'pc-bat-swing':''} key={strokeFlash} d="M26 7L69 43" stroke="#f1d6a2" strokeWidth="13" strokeLinecap="round"/></g>
 <g><path d="M340 462V515m18-54v54m18-54v54" stroke="#fff6e7" strokeWidth="7" strokeLinecap="round"/><path d="M337 462H380" stroke="#fff6e7" strokeWidth="5"/></g>
 {phase==='bowling'&&<>
  <circle cx={landing.x} cy={landing.y+9} r="20" fill="#e3eeae24" stroke="#ffefc1" strokeWidth="3" strokeDasharray="8 5"/>
  <ellipse cx={current.x} cy={current.y+14} rx={7+sw*7} ry="5" fill="#13282788" filter="url(#pc-ball-shadow)"/>
  <circle cx={current.x} cy={current.y-current.z} r={5+sw*5.2} fill="#f5f3e8" stroke="#bb3c45" strokeWidth={1.6+sw}/>
  <path d={'M'+(current.x-4)+' '+(current.y-current.z-3)+'l6 6'} stroke="#bc4651" strokeWidth="2"/>
 </>}
 {phase==='result'&&result&&<>
  <path key={strokeFlash} className={loft?'pc-flight pc-flight-loft':'pc-flight'} d={'M359 452Q'+(result.direction==='leg'?120:result.direction==='off'?642:380)+' '+(loft?28:208)+' '+target.x+' '+target.y} stroke={result.wicket?'#ffd0c0':'#fceaa7'} strokeWidth="5" fill="none" strokeDasharray={loft?'10 7':'5 7'}/>
  <circle cx={target.x} cy={target.y} r="19" fill="#fff9d5aa" stroke="#ffffff" strokeWidth="4" className="pc-impact"/>
  <text x="380" y="110" textAnchor="middle" className="pc-big-result">{result.wicket?'OUT!':result.runs===6?'SIX!':result.runs===4?'FOUR!':result.runs?result.runs+' RUN'+(result.runs===1?'':'S'):'DOT BALL'}</text>
 </>}
 <text x="22" y="31" fill="#1e403f" fontSize="15" fontWeight="800">BATTING CAMERA · ORIGINAL PLAY STUDIO</text>
 </svg>;
}
export function CricketMatch({active,comfort,sound=true,onToggleSound,onScore,onFinish,onSound}:Props){
 const [overs,setOvers]=useState<2|5|10>(2),[difficulty,setDifficulty]=useState<Difficulty>('club');
 const [innings,setInnings]=useState<Innings>(()=>createInnings(2)),[phase,setPhase]=useState<Phase>('setup');
 const [delivery,setDelivery]=useState<BowledBall>(()=>makeDelivery(0,'club'));
 const [elapsed,setElapsed]=useState(0),[foot,setFoot]=useState<Footwork>('front'),[loft,setLoft]=useState(false);
 const [direction,setDirection]=useState<ShotSide>('straight'),[result,setResult]=useState<StrokeResult|null>(null);
 const [message,setMessage]=useState('Choose a match, then read the bounce marker and time your shot.'),[swingCount,setSwingCount]=useState(0);
 const inningsRef=useRef(innings),phaseRef=useRef<Phase>('setup'),elapsedRef=useRef(0),ballRef=useRef(delivery),lastView=useRef(0),matchSeed=useRef(23),swingCommitted=useRef(false),bouncePlayed=useRef(false),stadiumRef=useRef<HTMLDivElement|null>(null);
 const setPhaseBoth=(p:Phase)=>{phaseRef.current=p;setPhase(p);};
 const completeDelivery=useCallback((outcome:StrokeResult)=>{
  if(phaseRef.current!=='bowling')return;
  const updated=applyStroke(inningsRef.current,outcome);
  inningsRef.current=updated;setInnings(updated);setResult(outcome);setMessage(outcome.comment);
  onScore(updated.runs);onSound(outcome.wicket?'miss':outcome.runs>=4?'goal':outcome.runs?'hit':'bounce');
  setPhaseBoth(updated.ended?'done':'result');
  if(updated.ended)onFinish(updated.won,inningsResult(updated));
 },[onScore,onSound,onFinish]);
 const nextBall=useCallback(()=>{
  if(inningsRef.current.ended)return;
  const ball=makeDelivery(inningsRef.current.balls,difficulty,matchSeed.current);
  ballRef.current=ball;swingCommitted.current=false;bouncePlayed.current=false;setDelivery(ball);elapsedRef.current=0;setElapsed(0);lastView.current=0;
  setResult(null);setMessage(ball.style.toUpperCase()+' · '+ball.length+' · '+ball.speed+' km/h. Watch the bounce circle.');
  setPhaseBoth('bowling');onSound('tap');
 },[difficulty,overs,onSound]);
 const start=()=>{matchSeed.current=(Date.now()>>>0)%65521+overs*31;const next=createInnings(overs);inningsRef.current=next;setInnings(next);setDirection('straight');setLoft(false);setFoot('front');nextBall();if(typeof window!=='undefined'&&window.innerWidth<1070)requestAnimationFrame(()=>stadiumRef.current?.scrollIntoView({block:'start',behavior:'smooth'}));};
 const strike=useCallback((side:ShotSide)=>{
  if(!active||phaseRef.current!=='bowling'||swingCommitted.current)return;
  swingCommitted.current=true;
  const t=elapsedRef.current,b=ballRef.current;
  const output=evaluateStroke(b,{side,foot,loft},t,difficulty);
  setDirection(side);setSwingCount(n=>n+1);completeDelivery(output);
 },[active,foot,loft,difficulty,completeDelivery,onSound]);
 useEffect(()=>{
  if(!active||phase!=='bowling')return;
  let raf=0,last=0;
  const frame=(now:number)=>{
   if(!last)last=now;const dt=Math.min(now-last,48);last=now;
   const next=elapsedRef.current+dt*(comfort?.68:1);elapsedRef.current=next;
   if(!bouncePlayed.current&&next>=ballRef.current.contactMs*ballRef.current.bounce){bouncePlayed.current=true;onSound('bounce');}
   if(now-lastView.current>32){setElapsed(next);lastView.current=now;}
   if(next>ballRef.current.contactMs+380){
    completeDelivery(missedDelivery(ballRef.current));
    return;
   }
   raf=requestAnimationFrame(frame);
  };
  raf=requestAnimationFrame(frame);return()=>cancelAnimationFrame(raf);
 },[active,phase,comfort,completeDelivery,onSound]);
 useEffect(()=>{
  if(!active||phase!=='result')return;
  const id=setTimeout(nextBall,1500);return()=>clearTimeout(id);
 },[active,phase,nextBall]);
 useEffect(()=>{
  if(!active)return;
  const keyboard=(e:KeyboardEvent)=>{
   if(e.repeat||e.target instanceof HTMLInputElement||e.target instanceof HTMLSelectElement||e.target instanceof HTMLTextAreaElement)return;
   if(e.key==='ArrowLeft'||e.key==='1'){e.preventDefault();strike('leg');}
   else if(e.key==='ArrowDown'||e.key===' '||e.key==='2'){e.preventDefault();strike('straight');}
   else if(e.key==='ArrowRight'||e.key==='3'){e.preventDefault();strike('off');}
   else if(e.key.toLowerCase()==='z')setLoft(v=>!v);
   else if(e.key.toLowerCase()==='x')setFoot(v=>v==='front'?'back':'front');
  };
  window.addEventListener('keydown',keyboard);return()=>window.removeEventListener('keydown',keyboard);
 },[active,strike]);
 const oversBall=Math.floor(innings.balls/6),withinOver=innings.balls%6;
 const bowlerLine=delivery.line===0?'MIDDLE':delivery.line<0?'LEG':'OFF',bowlerLength=delivery.length.toUpperCase();
 const timingTotal=delivery.contactMs+380;
 const percent=Math.min(100,Math.max(0,Math.round(elapsed/timingTotal*100)));
 const contactMarker=delivery.contactMs/timingTotal*100;
 const greenStart=Math.max(0,(delivery.contactMs-220)/timingTotal*100),greenEnd=Math.min(100,(delivery.contactMs+220)/timingTotal*100);
 return <div className="play-cricket">
  <div className="pc-score-strip">
   <div className="pc-main-score"><small>YOUR INNINGS</small><strong>{innings.runs}<em>/{innings.wickets}</em></strong><button className="pc-audio-toggle" type="button" onClick={onToggleSound} aria-label={sound?'Mute cricket stadium sounds':'Enable cricket stadium sounds'} aria-pressed={sound}>{sound?'🔊 SOUND ON':'🔇 SOUND OFF'}</button></div>
   <div><small>OVERS</small><b>{renderOvers(innings.balls)} <i>/ {overs}</i></b></div>
   <div><small>TARGET</small><b>{innings.target}</b></div>
   <div><small>NEED</small><b>{Math.max(0,innings.target-innings.runs)}</b></div>
   <div><small>REQ. RATE</small><b>{requiredRate(innings).toFixed(1)}</b></div>
  </div>
  <div className={"pc-match-layout"+(phase==="setup"?" is-setup":"")}>
   <div className="pc-stage-wrap" ref={stadiumRef}>
    <CricketStadium ball={delivery} elapsed={elapsed} result={result} phase={phase} loft={loft} shotDirection={direction} strokeFlash={swingCount}/>
    <div className="pc-overlay-score" aria-live="polite">
     {phase==='bowling'?<><strong>{delivery.speed} km/h · {delivery.style.toUpperCase()}</strong><span>{bowlerLine} · {bowlerLength}</span></>:phase==='result'&&result?<><strong>{result.wicket?'WICKET':result.runs===0?'DOT':result.runs+' RUNS'}</strong><span>{result.grade.toUpperCase()} TIMING · {result.timingError>0?'+':''}{result.timingError}ms</span></>:<><strong>BOUNDARY CRICKET</strong><span>Three directions. One swing per ball.</span></>}
    </div>
    {phase==='bowling'&&<div className="pc-timing" aria-label={'Delivery '+percent+' percent through its flight'}><div className="pc-timing-track"><span className="pc-hit-window" style={{left:greenStart+"%",width:(greenEnd-greenStart)+"%"}}/><span className="pc-hit-marker" style={{left:contactMarker+"%"}}/><i style={{left:percent+"%"}}/></div><span className="pc-timing-label">BALL ARRIVING · HIT NEAR THE GREEN ZONE</span></div>}
   </div>
   <section className="pc-controller" aria-label="Cricket batting controller">
    {phase==='setup'&&<div className="pc-pregame"><h2>Ready for the chase?</h2><p>Watch each delivery. Pick your side as the ball reaches the batsman. Start with ground shots, then master the loft.</p><span className="pc-control-label">MATCH LENGTH</span><div className="pc-choices">{([2,5,10] as const).map(n=><button type="button" key={n} aria-pressed={overs===n} onClick={()=>{setOvers(n);const t=createInnings(n);inningsRef.current=t;setInnings(t);}}>{n} overs</button>)}</div><span className="pc-control-label">BOWLING DIFFICULTY</span><div className="pc-choices">{(['easy','club','pro'] as const).map(n=><button type="button" key={n} aria-pressed={difficulty===n} onClick={()=>setDifficulty(n)}>{n==='easy'?'Academy':n==='club'?'Club':'Pro'}</button>)}</div><div className="pc-sound-info">{sound?'🔊 Stadium sound ready — bat, bounce, wickets and cheering.':'🔇 Sound muted. Tap SOUND OFF beside your score to enable.'}</div><button className="fresh-primary pc-start" onClick={start}>🏏 START CHASE · {innings.target} RUNS</button></div>}
    {phase!=='setup'&&<>
     <div className="pc-controller-heading"><span className="pc-control-label">BATTING CONTROLS</span><strong>{phase==='done'?'INNINGS ENDED':phase==='result'?'SHOT PLAYED':'READ · AIM · TIME'}</strong></div>
     <span className="pc-control-label">TAP A DIRECTION AT CONTACT</span>
     <div className="pc-bat-buttons">{sideInfo.map(s=><button className={'pc-bat-'+s.id} key={s.id} disabled={!active||phase!=='bowling'} onClick={()=>strike(s.id)} aria-label={s.label+' shot, keyboard '+s.key}><span>{s.icon}</span><b>{s.label}</b><small>{s.key}</small></button>)}</div>
     <details className="pc-advanced-options"><summary>Batting options · {foot==='front'?'Front foot':'Back foot'} · {loft?'Loft':'Ground'}</summary>
       <div className="pc-shot-options"><span className="pc-control-label">FOOTWORK · X TO SWITCH</span><div className="pc-choices"><button aria-pressed={foot==='front'} disabled={!active||phase==='done'} onClick={()=>setFoot('front')}>FRONT FOOT</button><button aria-pressed={foot==='back'} disabled={!active||phase==='done'} onClick={()=>setFoot('back')}>BACK FOOT</button></div><small>Full/yorker: front · Short: back</small></div>
       <div className="pc-shot-options"><span className="pc-control-label">SHOT STYLE · Z TO SWITCH</span><div className="pc-choices"><button aria-pressed={!loft} disabled={!active||phase==='done'} onClick={()=>setLoft(false)}>GROUND · SAFE</button><button aria-pressed={loft} disabled={!active||phase==='done'} onClick={()=>setLoft(true)}>LOFT · RISKY</button></div></div>
     </details>
     <div className="pc-bowler-info"><div><span>PACE</span><strong>{delivery.speed} km/h</strong></div><div><span>LINE</span><strong>{bowlerLine}</strong></div><div><span>LENGTH</span><strong>{bowlerLength}</strong></div></div>
     <div className="pc-ball-feed"><strong>THIS OVER</strong><div>{Array.from({length:6},(_,i)=>{const label=innings.history[oversBall*6+i]??'—';return <span key={i} className={label==='W'?'is-wicket':label==='4'||label==='6'?'is-boundary':''}>{i<withinOver?label:'—'}</span>})}</div></div>
     </>}
     <p className="pc-commentary" role="status" aria-live="polite">{message}</p>
     {phase==='result'&&<button className="pc-next" onClick={nextBall}>Next delivery →</button>}
     {phase==='done'&&<button className="pc-next" onClick={()=>{setPhaseBoth('setup');setResult(null);}}>Choose a new chase ↻</button>}
    </section>
   </div>
   {phase==='bowling'&&<div className="pc-mobile-pad" role="group" aria-label="Always-visible mobile cricket batting buttons">{sideInfo.map(s=><button key={s.id} onClick={()=>strike(s.id)} disabled={!active} aria-label={'Play '+s.label+' shot'}><span>{s.icon}</span><b>{s.label}</b></button>)}</div>}
   <div className="pc-smallprint">Original arcade cricket: quick timing-based batting inspired by the accessible controls of Stick Cricket and the timing, footwork and placement cues of Cricket 2007. Not a reproduction, licensed simulation, or official franchise game. <strong>Comfort Mode</strong> gives longer read time; pause freezes the ball.</div>
 </div>;
}
