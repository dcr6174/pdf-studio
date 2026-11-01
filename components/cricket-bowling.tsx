'use client';
import {useCallback,useEffect,useRef,useState} from 'react';
import {applyExtra,applyStroke,createInnings,renderOvers,type BowledBall,type Innings,type StrokeResult} from '@/lib/cricket-engine';
import {bowlingOutcome,pitchSelection,playerDelivery,type BowlingPlan} from '@/lib/cricket-match-day';
import {CricketStadium} from '@/components/cricket-stadium';
import {CricketTracker,CricketRadar} from '@/components/cricket-tracker';
import type {CricketBattingPreset,CricketMatchProps} from '@/components/cricket-match';
type Props=CricketMatchProps&{preset:CricketBattingPreset;seed:number;onComplete:(innings:Innings)=>void};
type Phase='plan'|'meter'|'live'|'result'|'done';
const initialPlan:BowlingPlan={line:0,length:'good',style:'pace'};
export function CricketBowling({preset,seed,active,comfort,onComplete,onSound}:Props){
 const [innings,setInnings]=useState(()=>createInnings(preset.overs,preset.target,10)),[plan,setPlan]=useState(initialPlan),[phase,setPhase]=useState<Phase>('plan'),[extraLabel,setExtraLabel]=useState('');
 const [ball,setBall]=useState<BowledBall>(()=>playerDelivery(0,initialPlan,preset.difficulty,seed));
 const [elapsed,setElapsed]=useState(0),[precision,setPrecision]=useState(0),[result,setResult]=useState<StrokeResult|null>(null),[message,setMessage]=useState('Place the landing marker. Choose a variation, start your run-up, then release in the gold zone.');
 const [trackerOpen,setTrackerOpen]=useState(false);const playing=active&&!trackerOpen;
 const inn=useRef(innings),clock=useRef(0),meter=useRef(0),currentBall=useRef(ball),committed=useRef(false),pending=useRef<ReturnType<typeof bowlingOutcome>|null>(null),lastPlan=useRef(''),repeated=useRef(0),bounced=useRef(false),phaseRef=useRef(phase);
 const changePhase=(next:Phase)=>{phaseRef.current=next;setPhase(next);};
 const finish=useCallback(()=>{
  if(phaseRef.current!=='live'||!pending.current)return;
  const {extra,outcome}=pending.current;
  const updated=extra?applyExtra(inn.current,extra,extra==='no-ball'?outcome:undefined):applyStroke(inn.current,outcome);
  inn.current=updated;setInnings(updated);
  const visual=extra?{...outcome,runs:extra==='no-ball'?outcome.runs:0,wicket:false,out:null,label:extra==='wide'?'Wd':'Nb',comment:extra==='wide'?'Wide. One extra; bowl again.':`No-ball. One extra${outcome.runs?' plus '+outcome.runs+' off the bat':''}; free hit next.`}:updated.last!;
  setResult(visual);setExtraLabel(extra?.toUpperCase()??'');setMessage(visual.comment);onSound(visual.wicket?'miss':visual.runs>=4?'goal':'hit');changePhase(updated.ended?'done':'result');
 },[onSound]);
 useEffect(()=>{
  if(!playing||(phase!=='meter'&&phase!=='live'))return;
  let frame=0,last=0;
  const loop=(now:number)=>{if(!last)last=now;const dt=Math.min(48,now-last)*(comfort?.68:1);last=now;clock.current+=dt;
   if(phase==='meter'){meter.current=1-Math.abs((clock.current/900)%2-1);setPrecision(meter.current);}
   else{setElapsed(clock.current);if(!bounced.current&&clock.current>=currentBall.current.contactMs*currentBall.current.bounce){bounced.current=true;onSound('bounce');}if(clock.current>=currentBall.current.contactMs){finish();return;}}
   frame=requestAnimationFrame(loop);
  };frame=requestAnimationFrame(loop);return()=>cancelAnimationFrame(frame);
 },[playing,phase,comfort,finish,onSound]);
 useEffect(()=>{if(!playing||phase!=='done')return;const id=setTimeout(()=>onComplete(inn.current),1800);return()=>clearTimeout(id);},[playing,phase,onComplete]);
 const runUp=()=>{if(!playing||phaseRef.current!=='plan')return;clock.current=0;meter.current=0;setPrecision(0);changePhase('meter');onSound('tap');};
 const release=()=>{
  if(!playing||phaseRef.current!=='meter'||committed.current)return;committed.current=true;
  const signature=JSON.stringify(plan);repeated.current=lastPlan.current===signature?repeated.current+1:0;lastPlan.current=signature;
  const next=playerDelivery(inn.current.events.length,plan,preset.difficulty,seed);currentBall.current=next;setBall(next);
  pending.current=bowlingOutcome(next,plan,meter.current,preset.difficulty,seed,repeated.current);clock.current=0;bounced.current=false;setElapsed(0);setResult(null);setMessage(`${plan.style.toUpperCase()} · ${plan.length} · ${next.speed} km/h`);changePhase('live');
 };
 const next=()=>{if(!playing||phaseRef.current!=='result')return;committed.current=false;pending.current=null;setResult(null);clock.current=0;setElapsed(0);setMessage('Vary the line, length or style. Repeated identical deliveries become easier to read.');changePhase('plan');};
 const aim=(e:React.PointerEvent<SVGSVGElement>)=>{if(!playing||phase!=='plan')return;const r=e.currentTarget.getBoundingClientRect();setPlan(p=>({...p,...pitchSelection((e.clientX-r.left)/r.width,(e.clientY-r.top)/r.height)}));};
 const legal=phase==='plan',lengths=['short','good','full','yorker'] as const;
 return <div className="play-cricket pc-immersive pc-day-live pc-you-bowl">
  <div className="pc-score-strip"><div className="pc-main-score"><small>{preset.batting.code}</small><strong>{innings.runs}<em>/{innings.wickets}</em></strong></div><div><small>OVERS</small><b>{renderOvers(innings.balls)} / {preset.overs}</b></div><div><small>{preset.target===null?'INNINGS':'TARGET'}</small><b>{preset.target??'1st'}</b></div><div><small>EXTRAS</small><b>{innings.extras}</b></div><div><small>{innings.freeHit?'FREE HIT':'YOU'}</small><b>{innings.freeHit?'NEXT':'BOWL'}</b></div></div>
  <div className="pc-match-layout"><div className="pc-stage-wrap"><CricketStadium view="bowl" ball={ball} elapsed={elapsed} result={result} shotDirection={result?.direction??'straight'} loft={!!result&&result.flight>.5} phase={phase==='live'?'bowling':phase==='result'?'result':phase==='done'?'done':'setup'} strokeFlash={innings.events.length} active={playing} comfort={comfort} battingColor={preset.batting.color} fieldingColor={preset.fielding.color} night={preset.night}/><CricketRadar ball={ball} elapsed={elapsed} result={result}/><div className="pc-match-context">{preset.fielding.code} v {preset.batting.code} · INNINGS {preset.inningsNumber} · YOU BOWL</div><div className="pc-overlay-score" role="status"><strong>{result?result.wicket?'WICKET':extraLabel||result.runs+' RUNS':'SET YOUR DELIVERY'}</strong><span>{plan.style.toUpperCase()} · {plan.length.toUpperCase()} · {plan.line<0?'LEG':plan.line>0?'OFF':'MIDDLE'}</span></div></div>
  <section className="pc-controller" aria-label="Cricket bowling controller"><h2>You’re bowling</h2><p className="pc-bowl-instruction">Aim → run-up → release in gold.</p>
   <svg className="pc-pitch-target" viewBox="0 0 210 128" role="img" aria-label={'Bowling target: '+plan.length+', line '+plan.line+'. Use the controls below for keyboard aiming.'} onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);aim(e);}} onPointerMove={e=>{if(e.buttons)aim(e);}}><rect x="0" y="0" width="210" height="128" rx="12" fill="#1d433a"/><rect x="62" width="86" height="128" fill="#b69f72"/>{[32,64,96].map(y=><line key={y} x1="0" y1={y} x2="210" y2={y} stroke="#ebf3e133"/>)}<path d="M96 112h18m-15 0v-9m6 9v-9m6 9v-9" stroke="#fff5dc" strokeWidth="2"/><circle cx={(plan.line/6+.5)*210} cy={(lengths.indexOf(plan.length)+.5)*32} r="10" fill="#f4ce76" stroke="#fff4d2" strokeWidth="3"/>{lengths.map((l,i)=><text key={l} x="8" y={i*32+20} fill="#edf4df" fontSize="9">{l.toUpperCase()}</text>)}</svg>
   <div className="pc-bowling-selects"><label>Line<select aria-label="Bowling line" disabled={!playing||!legal} value={plan.line} onChange={e=>setPlan(p=>({...p,line:Number(e.target.value)}))}>{[-3,-2,-1,0,1,2,3].map(n=><option key={n} value={n}>{n===0?'Middle stump':n<0?`Leg ${Math.abs(n)}${n===-3?' · wide risk':''}`:`Off ${n}${n===3?' · wide risk':''}`}</option>)}</select></label><label>Length<select aria-label="Bowling length" disabled={!playing||!legal} value={plan.length} onChange={e=>setPlan(p=>({...p,length:e.target.value as BowlingPlan['length']}))}>{lengths.map(l=><option key={l}>{l}</option>)}</select></label></div>
   <div className="pc-choices" aria-label="Bowling variation">{(['pace','swing','spin'] as const).map(s=><button key={s} disabled={!playing||!legal} aria-pressed={plan.style===s} onClick={()=>setPlan(p=>({...p,style:s}))}>{s.toUpperCase()}</button>)}</div>
   <div className="pc-bowl-action">{phase==='meter'&&<div className="pc-release-meter" role="meter" aria-label="Bowling release precision" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(precision*100)}><span/><i style={{left:precision*100+'%'}}/><p>Release inside the gold band · edges risk no-ball</p></div>}
   <button className="pc-start" disabled={!playing||!['plan','meter','result'].includes(phase)} onClick={phase==='meter'?release:phase==='result'?next:runUp}>{phase==='meter'?'RELEASE BALL':phase==='result'?'PLAN NEXT BALL →':phase==='live'?'BALL IN FLIGHT…':'START RUN-UP'}</button></div>
   {innings.freeHit&&<p className="pc-free-hit">FREE HIT: bowl a legal ball; supported dismissals do not count.</p>}<p className="pc-commentary" role="status">{message}</p><CricketTracker innings={innings} onOpenChange={setTrackerOpen}/>
  </section></div></div>;
}
