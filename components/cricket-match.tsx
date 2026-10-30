'use client';
import {useCallback,useEffect,useRef,useState} from 'react';
import {applyStroke,createInnings,evaluateStroke,inningsResult,makeDelivery,missedDelivery,renderOvers,requiredRate,type BowledBall,type Difficulty,type Footwork,type Innings,type ShotSide,type StrokeResult} from '@/lib/cricket-engine';
import {CricketStadium} from '@/components/cricket-stadium';
import {cricketTimingFeedback,cricketOverHistory} from '@/lib/cricket-presentation';
import type {ArcadeEffect} from '@/lib/arcade-audio';
import {playStadiumSound,startCricketAmbience,stopCricketAmbience,unlockStadiumAudio} from '@/lib/stadium-audio';
type Props={active:boolean;comfort:boolean;sound?:boolean;onToggleSound?:()=>void;onScore:(score:number)=>void;onFinish:(won:boolean,message:string)=>void;onSound:(effect:ArcadeEffect)=>void};
type Phase='setup'|'bowling'|'result'|'done';
const sideInfo:{id:ShotSide;label:string;key:string;icon:string}[]=[
 {id:'leg',label:'LEG SIDE',key:'A / ←',icon:'↖'},
 {id:'straight',label:'STRAIGHT',key:'↓ / Space',icon:'↑'},
 {id:'off',label:'OFF SIDE',key:'D / →',icon:'↗'}
];
export function CricketMatch({active,comfort,sound=true,onScore,onFinish,onSound}:Props){
 const [overs,setOvers]=useState<2|5|10>(2),[difficulty,setDifficulty]=useState<Difficulty>('club');
 const [innings,setInnings]=useState<Innings>(()=>createInnings(2)),[phase,setPhase]=useState<Phase>('setup');
 const [delivery,setDelivery]=useState<BowledBall>(()=>makeDelivery(0,'club'));
 const [elapsed,setElapsed]=useState(0),[foot,setFoot]=useState<Footwork>('front'),[autoFoot,setAutoFoot]=useState(true),[loft,setLoft]=useState(false);
 const [optionsOpen,setOptionsOpen]=useState(false);
 const playing=active&&!optionsOpen;
 const [direction,setDirection]=useState<ShotSide>('straight'),[result,setResult]=useState<StrokeResult|null>(null);
 const [message,setMessage]=useState('Choose a match, then read the bounce marker and time your shot.'),[swingCount,setSwingCount]=useState(0);
 const inningsRef=useRef(innings),phaseRef=useRef<Phase>('setup'),elapsedRef=useRef(0),ballRef=useRef(delivery),lastView=useRef(0),matchSeed=useRef(23),swingCommitted=useRef(false),bouncePlayed=useRef(false);
 const setPhaseBoth=(p:Phase)=>{phaseRef.current=p;setPhase(p);};
 const completeDelivery=useCallback((outcome:StrokeResult)=>{
  if(phaseRef.current!=='bowling')return;
  const updated=applyStroke(inningsRef.current,outcome);
  inningsRef.current=updated;setInnings(updated);setResult(outcome);setMessage(outcome.comment);
  onScore(updated.runs);if(outcome.wicket){if(sound)playStadiumSound('cricket','wicket');}else onSound(outcome.runs>=4?'goal':outcome.contact===0?'miss':'hit');
  setPhaseBoth(updated.ended?'done':'result');
 },[onScore,onSound,sound]);
 const nextBall=useCallback(()=>{
  if(inningsRef.current.ended)return;
  const ball=makeDelivery(inningsRef.current.balls,difficulty,matchSeed.current);
  ballRef.current=ball;swingCommitted.current=false;bouncePlayed.current=false;setDelivery(ball);elapsedRef.current=0;setElapsed(0);lastView.current=0;
  setResult(null);setMessage(ball.style.toUpperCase()+' · '+ball.length+' · '+ball.speed+' km/h. Watch the bounce circle.');
  setPhaseBoth('bowling');onSound('tap');
 },[difficulty,onSound]);
 useEffect(()=>{
  if(!playing||!sound||phase==='setup'||phase==='done'){stopCricketAmbience();return;}
  startCricketAmbience();return()=>stopCricketAmbience();
 },[playing,sound,phase]);
 const start=()=>{if(sound){unlockStadiumAudio();playStadiumSound('cricket','start');}matchSeed.current=(Date.now()>>>0)%65521+overs*31;const next=createInnings(overs);inningsRef.current=next;setInnings(next);setDirection('straight');setLoft(false);setFoot('front');setOptionsOpen(false);onScore(0);nextBall();};
 const strike=useCallback((side:ShotSide)=>{
  if(!playing||phaseRef.current!=='bowling'||swingCommitted.current)return;
  swingCommitted.current=true;
  const t=elapsedRef.current,b=ballRef.current;
  const chosenFoot=autoFoot?(b.length==='short'?'back':'front'):foot;
  const output=evaluateStroke(b,{side,foot:chosenFoot,loft},t,difficulty);
  setDirection(side);setSwingCount(n=>n+1);completeDelivery(output);
 },[playing,foot,autoFoot,loft,difficulty,completeDelivery]);
 useEffect(()=>{
  if(!playing||phase!=='bowling')return;
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
 },[playing,phase,comfort,completeDelivery,onSound]);
 useEffect(()=>{
  if(!playing||phase!=='result')return;
  const id=setTimeout(nextBall,1800);return()=>clearTimeout(id);
 },[playing,phase,nextBall]);
 // Show the last ball before the parent presents the end-of-chase card. Pause cancels this timer.
 useEffect(()=>{
  if(!playing||phase!=='done')return;
  const id=setTimeout(()=>onFinish(inningsRef.current.won,inningsResult(inningsRef.current)),1800);
  return()=>clearTimeout(id);
 },[playing,phase,onFinish]);
 useEffect(()=>{
  if(!playing)return;
  const keyboard=(e:KeyboardEvent)=>{
   if(e.repeat||e.target instanceof HTMLInputElement||e.target instanceof HTMLSelectElement||e.target instanceof HTMLTextAreaElement)return;
   if(e.key===' '&&e.target instanceof HTMLButtonElement&&e.isTrusted)return;
   if(e.key==='ArrowLeft'||e.key==='1'||e.key.toLowerCase()==='a'){e.preventDefault();strike('leg');}
   else if(e.key==='ArrowDown'||e.key===' '||e.key==='2'){e.preventDefault();strike('straight');}
   else if(e.key==='ArrowRight'||e.key==='3'||e.key.toLowerCase()==='d'){e.preventDefault();strike('off');}
   else if(e.key.toLowerCase()==='z')setLoft(v=>!v);
   else if(e.key.toLowerCase()==='x'){setAutoFoot(false);setFoot(v=>v==='front'?'back':'front');}
  };
  window.addEventListener('keydown',keyboard);return()=>window.removeEventListener('keydown',keyboard);
 },[playing,strike]);
 const overHistory=cricketOverHistory(innings,phase==='bowling');
 const timing=result?cricketTimingFeedback(result):null;
 const bowlerLine=delivery.line===0?'MIDDLE':delivery.line<0?'LEG':'OFF',bowlerLength=delivery.length.toUpperCase();
 const timingTotal=delivery.contactMs+380;
 const percent=Math.min(100,Math.max(0,Math.round(elapsed/timingTotal*100)));
 const contactMarker=delivery.contactMs/timingTotal*100;
 const greenStart=Math.max(0,(delivery.contactMs-220)/timingTotal*100),greenEnd=Math.min(100,(delivery.contactMs+220)/timingTotal*100);
 return <div className={'play-cricket pc-immersive'+(phase==='setup'?' pc-is-setup':'')}>
  <div className="pc-score-strip">
   <div className="pc-main-score"><small>YOUR INNINGS</small><strong data-game-score>{innings.runs}<em>/{innings.wickets}</em></strong></div>
   <div><small>OVERS</small><b>{renderOvers(innings.balls)} <i>/ {overs}</i></b></div>
   <div><small>TARGET</small><b>{innings.target}</b></div>
   <div><small>NEED</small><b>{Math.max(0,innings.target-innings.runs)}</b></div>
   <div><small>REQ. RATE</small><b>{requiredRate(innings).toFixed(1)}</b></div>
  </div>
  <div className={"pc-match-layout"+(phase==="setup"?" is-setup":"")}>
   <div className="pc-stage-wrap">
    <CricketStadium ball={delivery} elapsed={elapsed} result={result} phase={phase} loft={loft} shotDirection={direction} strokeFlash={swingCount} active={playing} comfort={comfort}/>
    <div className="pc-overlay-score" aria-live="polite">
     {phase==='bowling'?<><strong>{delivery.speed} km/h · {delivery.style.toUpperCase()}</strong><span>{bowlerLine} · {bowlerLength}</span></>:(phase==='result'||phase==='done')&&result?<><strong>{result.wicket?'WICKET':result.runs===0?'DOT':result.runs+' RUNS'}</strong><span>{timing?.label.toUpperCase()} TIMING · {result.timingError>0?'+':''}{result.timingError}ms</span></>:<><strong>BOUNDARY CRICKET</strong><span>Three directions. One swing per ball.</span></>}
    </div>
    {phase==='bowling'&&<div className="pc-timing" aria-label={'Delivery '+percent+' percent through its flight'}><div className="pc-timing-track"><span className="pc-hit-window" style={{left:greenStart+"%",width:(greenEnd-greenStart)+"%"}}/><span className="pc-hit-marker" style={{left:contactMarker+"%"}}/><i style={{left:percent+"%"}}/></div><span className="pc-timing-label">BALL ARRIVING · HIT NEAR THE GREEN ZONE</span></div>}
   </div>
   <section className="pc-controller" aria-label="Cricket batting controller">
    {phase==='setup'&&<div className="pc-pregame"><h2>Ready for the chase?</h2><p>Time your swing as the ball reaches the bat. Choose leg, straight or off. Automatic footwork helps you start.</p><span className="pc-control-label">MATCH LENGTH</span><div className="pc-choices">{([2,5,10] as const).map(n=><button type="button" key={n} aria-pressed={overs===n} onClick={()=>{setOvers(n);const t=createInnings(n);inningsRef.current=t;setInnings(t);}}>{n} overs</button>)}</div><span className="pc-control-label">BOWLING DIFFICULTY</span><div className="pc-choices">{(['easy','club','pro'] as const).map(n=><button type="button" key={n} aria-pressed={difficulty===n} onClick={()=>setDifficulty(n)}>{n==='easy'?'Academy':n==='club'?'Club':'Pro'}</button>)}</div><div className="pc-sound-info">{sound?'Sound on · change it in the Arcade menu.':'Sound off · enable it in the Arcade menu.'}</div><button className="fresh-primary pc-start" onClick={start}>🏏 START CHASE · {innings.target} RUNS</button></div>}
    {phase!=='setup'&&<>
     <div className="pc-controller-heading"><span className="pc-control-label">BATTING CONTROLS</span><strong>{phase==='done'?'INNINGS ENDED':phase==='result'?'SHOT PLAYED':'READ · AIM · TIME'}</strong></div>
     <span className="pc-control-label">TAP A DIRECTION AT CONTACT</span>
     <div className="pc-bat-buttons">{sideInfo.map(s=><button className={'pc-bat-'+s.id} key={s.id} disabled={!playing||phase!=='bowling'} onClick={()=>strike(s.id)} aria-label={s.label+' shot, keyboard '+s.key}><span>{s.icon}</span><b>{s.label}</b><small>{s.key}</small></button>)}</div>
     <details className="pc-advanced-options" open={optionsOpen} onToggle={e=>setOptionsOpen(e.currentTarget.open)}><summary>Batting options · {autoFoot?'Auto footwork':foot==='front'?'Front foot':'Back foot'} · {loft?'Loft':'Ground'}</summary>
       <div className="pc-shot-options"><label className="pc-auto-foot"><input type="checkbox" checked={autoFoot} onChange={e=>setAutoFoot(e.target.checked)}/> Automatic footwork</label><span className="pc-control-label">MANUAL FOOTWORK · X TO SWITCH</span><div className="pc-choices"><button aria-pressed={foot==='front'} disabled={!active||phase==='done'} onClick={()=>{setAutoFoot(false);setFoot('front');}}>FRONT FOOT</button><button aria-pressed={foot==='back'} disabled={!active||phase==='done'} onClick={()=>{setAutoFoot(false);setFoot('back');}}>BACK FOOT</button></div><small>Full/yorker: front · Short: back</small></div>
       <div className="pc-shot-options"><span className="pc-control-label">SHOT STYLE · Z TO SWITCH</span><div className="pc-choices"><button aria-pressed={!loft} disabled={!active||phase==='done'} onClick={()=>setLoft(false)}>GROUND · SAFE</button><button aria-pressed={loft} disabled={!active||phase==='done'} onClick={()=>setLoft(true)}>LOFT · RISKY</button></div></div>
     </details>
     <div className="pc-bowler-info"><div><span>PACE</span><strong>{delivery.speed} km/h</strong></div><div><span>LINE</span><strong>{bowlerLine}</strong></div><div><span>LENGTH</span><strong>{bowlerLength}</strong></div></div>
     <div className="pc-ball-feed"><strong>{innings.balls>0&&innings.balls%6===0&&phase!=='bowling'?'OVER COMPLETE':'THIS OVER'}</strong><div>{overHistory.map((label,i)=><span key={i} className={label==='W'?'is-wicket':label==='4'||label==='6'?'is-boundary':''}>{label}</span>)}</div></div>
     </>}
     <p className="pc-commentary" role="status" aria-live="polite">{message}</p>
     {phase==='result'&&<button className="pc-next" onClick={nextBall}>Next delivery →</button>}
     {phase==='done'&&<button className="pc-next" onClick={()=>{setPhaseBoth('setup');setResult(null);}}>Choose a new chase ↻</button>}
    </section>
   </div>
   <div className="pc-smallprint">Original arcade cricket: quick timing-based batting inspired by the accessible controls of Stick Cricket and the timing, footwork and placement cues of Cricket 2007. Not a reproduction, licensed simulation, or official franchise game. <strong>Comfort Mode</strong> gives longer read time; pause freezes the ball.</div>
 </div>;
}

