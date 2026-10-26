'use client';
import {useCallback,useEffect,useMemo,useRef,useState,type KeyboardEvent,type PointerEvent} from 'react';
import Link from '@/components/browser-link';
import {HOOPS,MOBILE_HOOPS,HOOPS_SHOTS,HOOPS_SPOTS,MOBILE_HOOPS_SPOTS,releaseHoopsBall,stepHoopsBall,traceHoopsShot,hoopsPoints,hoopsResultText,type HoopsBall,type HoopsCourt} from '@/lib/hoops-engine';
import {playSportsAudio,unlockSportsAudio,type SportsCue} from '@/lib/sports-audio';
type Phase='ready'|'play'|'paused'|'done';
type Aim={x:number;y:number};
const clamp=(n:number,a:number,b:number)=>Math.max(a,Math.min(b,n));
function PlayerFigure({x,y,shooting}:{x:number;y:number;shooting:boolean}){
 return <g transform={'translate('+x+' '+y+')'} className="hoops-athlete" aria-hidden="true">
  <ellipse cx="-4" cy="4" rx="40" ry="10" fill="#132d48" opacity=".35"/>
  <path d="M-19 -91L-30 -29M10 -89L28 -27" stroke="#29395b" strokeWidth="19" strokeLinecap="round"/>
  <path d="M-33 -28H-8M18 -25H44" stroke="#f9f0e1" strokeWidth="10" strokeLinecap="round"/>
  <path d="M-16 -158Q1 -169 19 -156L23 -95Q-2 -82 -24 -100Z" fill="#ff9b68" stroke="#412c49" strokeWidth="4"/>
  <path d="M-21 -115H23" stroke="#ffe3af" strokeWidth="5"/>
  <path d="M-20 -146L-44 -112L-16 -92" stroke="#aa654e" strokeWidth="13" strokeLinecap="round"/>
  <path d={shooting?'M18 -147L43 -207L59 -215':'M18 -147L35 -128L41 -105'} stroke="#d38c70" strokeWidth="14" strokeLinecap="round"/>
  <circle cy="-182" r="23" fill="#d9a184" stroke="#5b4550" strokeWidth="2"/>
  <path d="M-22 -189Q-12 -211 5 -209Q26 -211 24 -188L11 -201L-14 -195Z" fill="#323e55"/>
  <path d="M16 -176L27 -172" stroke="#514249" strokeWidth="3" strokeLinecap="round"/>
 </g>;
}
function BallArt({x,y,r,rotation=0}:{x:number;y:number;r:number;rotation?:number}){
 return <g transform={'translate('+x+' '+y+') rotate('+(rotation*180/Math.PI)+')'} aria-hidden="true">
   <circle r={r+3} fill="#0e2b3d" opacity=".25" cy="3"/>
   <circle r={r} fill="#f59a43" stroke="#713e32" strokeWidth="2.5"/>
   <ellipse cx={-r*.3} cy={-r*.34} rx={r*.35} ry={r*.27} fill="#ffbc73" opacity=".8"/>
   <path d={'M'+(-r)+' 0H'+r+'M0 '+(-r)+'V'+r} fill="none" stroke="#753f36" strokeWidth="2.4"/>
   <path d={'M'+(-r*.68)+' '+(-r*.73)+'Q'+(r*.53)+' 0 '+(-r*.68)+' '+(r*.73)+'M'+(r*.68)+' '+(-r*.73)+'Q'+(-r*.53)+' 0 '+(r*.68)+' '+(r*.73)} fill="none" stroke="#753f36" strokeWidth="2.2"/>
 </g>;
}
function RooftopCourt({court,compact,spot,ball,aimLine,toast,flying,score,shots,streak,dragging,onPointerDown,onPointerMove,onPointerUp,onPointerCancel}:{
 court:HoopsCourt;compact:boolean;spot:number;ball:{x:number;y:number;rotation:number};
 aimLine:readonly {x:number;y:number}[];toast:string;flying:boolean;score:number;shots:number;streak:number;dragging:boolean;
 onPointerDown:(e:PointerEvent<SVGSVGElement>)=>void;onPointerMove:(e:PointerEvent<SVGSVGElement>)=>void;onPointerUp:(e:PointerEvent<SVGSVGElement>)=>void;onPointerCancel:()=>void;
}){
 const width=court.width,height=court.height,ground=court.ground,skyTop=compact?180:120;
 const buildings=Array.from({length:13},(_,i)=>({x:i*(width/12)-14,w:width/12+2,h:50+(i*53%112)}));
 const netBottom=court.rimY+60;
 return <svg className={'hoops-court'+(dragging?' is-dragging':'')} viewBox={'0 0 '+width+' '+height} preserveAspectRatio="xMidYMid meet" role="img" aria-label={'Basketball court. Hoop to the right, score '+score+', '+shots+' of '+HOOPS_SHOTS+' shots. Pull back from the basketball to aim or use the angle and power controls.'} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerCancel}>
 <defs>
  <linearGradient id="hoops-night" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#0d2a58"/><stop offset=".52" stopColor="#5c638c"/><stop offset="1" stopColor="#ffb17e"/></linearGradient>
  <linearGradient id="hoops-floor" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#f4bc7a"/><stop offset="1" stopColor="#c57f58"/></linearGradient>
  <radialGradient id="hoops-light"><stop stopColor="#fff2c1" stopOpacity=".8"/><stop offset="1" stopColor="#ffb77f" stopOpacity="0"/></radialGradient>
  <filter id="hoops-glow"><feGaussianBlur stdDeviation="5"/></filter>
 </defs>
 <rect width={width} height={height} rx="20" fill="url(#hoops-night)"/>
 <circle cx={width*.75} cy={skyTop*.82} r={compact?125:180} fill="url(#hoops-light)" opacity=".5"/>
 <circle cx={width*.74} cy={skyTop*.83} r={compact?23:32} fill="#fff0c2" opacity=".92"/>
 {Array.from({length:12},(_,i)=><circle key={i} cx={40+(i*101)%width} cy={35+(i*37)%(ground*.43)} r={i%4===0?2:1.3} fill="#fff3d7" opacity=".75"/>)}
 <g opacity=".8">{buildings.map((b,i)=><g key={i}><rect x={b.x} y={ground-118-b.h} width={b.w} height={b.h+138} fill={['#293958','#334565','#28344d','#3a4865'][i%4]}/>{Array.from({length:8},(_,j)=><rect key={j} x={b.x+8+(j%2)*16} y={ground-105-b.h+Math.floor(j/2)*24} width="7" height="12" fill="#f7d4a3" opacity={(i+j)%4===0?.2:.75}/>)}</g>)}</g>
 <path d={'M0 '+(ground-10)+'Q'+(width*.35)+' '+(ground-60)+' '+width+' '+(ground-9)+'V'+height+'H0Z'} fill="url(#hoops-floor)"/>
 {Array.from({length:8},(_,i)=><path key={i} d={'M'+(i*width/7)+' '+ground+'L'+(width*.49)+' '+height} stroke="#fff1d9" strokeWidth="2" opacity=".2"/>)}
 <path d={'M0 '+(ground-8)+'H'+width} stroke="#fff6db" opacity=".8" strokeWidth="4"/>
 <path d={'M'+(width*.1)+' '+ground+'Q'+(width*.5)+' '+(ground-85)+' '+(width*.82)+' '+ground} stroke="#fff2d9" opacity=".28" strokeWidth="4" fill="none"/>
 <g opacity=".78">{Array.from({length:compact?15:29},(_,i)=><g key={i} transform={'translate('+((i+.45)*width/(compact?15:29))+' '+(ground-135+(i%3)*6)+')'}><circle cy="-12" r="7" fill={['#f4c5a4','#e1ba90','#8c7390'][i%3]}/><path d="M-9 -5H9L13 21H-13Z" fill={['#93a6d2','#f5b09b','#a7d6b1'][i%3]}/></g>)}</g>
 <rect x="0" y={ground-105} width={width} height="7" fill="#f7d9b0" opacity=".25"/>
 <g>
  <path d={'M'+(court.boardX+16)+' '+(court.boardTop-48)+'V'+ground} stroke="#c1d7df" strokeWidth="17" opacity=".7"/>
  <rect x={court.boardX-2} y={court.boardTop} width="15" height={court.boardBottom-court.boardTop+16} rx="3" fill="#e8eff1" stroke="#496779" strokeWidth="5"/>
  <rect x={court.rimRight-28} y={court.rimY-46} width="56" height="43" fill="#f3f3ed" opacity=".75" stroke="#6e839b" strokeWidth="2"/>
  <rect x={court.rimRight-12} y={court.rimY-32} width="29" height="20" fill="none" stroke="#f5a572" strokeWidth="3"/>
  <path d={'M'+court.rimLeft+' '+court.rimY+'L'+(court.rimLeft+18)+' '+netBottom+'Q'+((court.rimLeft+court.rimRight)/2)+' '+(netBottom+17)+' '+(court.rimRight-18)+' '+netBottom+'L'+court.rimRight+' '+court.rimY} fill="#ffffff10" stroke="#eaf7ef" strokeWidth="3"/>
  {Array.from({length:9},(_,i)=>{const x=court.rimLeft+i*(court.rimRight-court.rimLeft)/8;const base=(court.rimLeft+court.rimRight)/2;return <path key={i} d={'M'+x+' '+court.rimY+'L'+(base+(x-base)*.57)+' '+netBottom} stroke="#edf4ee" strokeWidth="1.4" opacity=".86"/>;})}
  {Array.from({length:4},(_,i)=><path key={i} d={'M'+(court.rimLeft+4+i*3)+' '+(court.rimY+13+i*12)+'H'+(court.rimRight-4-i*3)} stroke="#f2f9ee" strokeWidth="1.3" opacity=".75"/>)}
 </g>
 <PlayerFigure x={spot-20} y={ground-2} shooting={flying}/>
 {!flying&&aimLine.map((dot,i)=>i%2===0?<circle key={i} cx={dot.x} cy={dot.y} r={clamp(5-i*.026,2,5)} fill={dot.y<court.rimY+10?'#fff3c4':'#b5e9df'} opacity={.9-i/aimLine.length*.6}/>:null)}
 {!flying&&<g opacity=".85"><circle cx={ball.x} cy={ball.y} r={court.radius+8} stroke="#ffefc6" fill="none" strokeWidth="2" strokeDasharray="7 7" className="hoops-aim-pulse"/></g>}
 <ellipse cx={ball.x} cy={ground-3} rx="23" ry="7" fill="#4c393a" opacity={clamp(1-(ground-ball.y)/350,.12,.44)}/>
 <BallArt x={ball.x} y={ball.y} r={court.radius} rotation={ball.rotation}/>
 <path d={'M'+court.rimLeft+' '+court.rimY+'H'+court.rimRight} stroke="#813f30" strokeWidth="13" strokeLinecap="round"/>
 <path d={'M'+court.rimLeft+' '+(court.rimY-2)+'H'+court.rimRight} stroke="#f78539" strokeWidth="6" strokeLinecap="round"/>
 <g className="hoops-board-hud" aria-hidden="true">
  <rect x={compact?15:23} y="18" width={compact?145:190} height="70" rx="12" fill="#102438e8" stroke="#fff4c77a" strokeWidth="2"/>
  <text x={compact?30:40} y="44" fontSize="15" fontWeight="800" letterSpacing="2" fill="#c8e9d7">ROOFTOP HOOPS</text>
  <text x={compact?30:40} y="75" fontSize="27" fontWeight="900" fill="#fff1bb">{score} PTS</text>
  <rect x={width-(compact?155:200)} y="18" width={compact?140:172} height="70" rx="12" fill="#102438e8" stroke="#fff4c77a" strokeWidth="2"/>
  <text x={width-(compact?143:186)} y="44" fontSize="14" fontWeight="800" fill="#c8e9d7">SHOTS LEFT</text>
  <text x={width-(compact?143:186)} y="75" fontSize="28" fontWeight="900" fill="#fff1bb">{HOOPS_SHOTS-shots}</text>
 </g>
 {streak>=2&&<text x={width*.5} y={compact?110:87} textAnchor="middle" fontSize="18" fill="#fff2ae" fontWeight="900" className="hoops-streak">🔥 {streak} STREAK</text>}
 {toast&&<g className="hoops-toast" key={toast}><rect x={width*.12} y={compact?ground-215:ground-118} width={width*.76} height={compact?54:62} rx="16" fill="#17344beb" stroke="#f2df9e" strokeWidth="3"/><text x={width*.5} y={compact?ground-180:ground-78} textAnchor="middle" fontSize={compact?23:29} fontWeight="900" fill="#fff2b6">{toast.slice(0,48)}</text></g>}
 </svg>;
}
export function RooftopHoops(){
 const [compact,setCompact]=useState(false),[phase,setPhase]=useState<Phase>('ready');
 const [angle,setAngle]=useState(52),[power,setPower]=useState(64),[shots,setShots]=useState(0),[score,setScore]=useState(0),[best,setBest]=useState(0),[streak,setStreak]=useState(0);
 const [flying,setFlying]=useState(false),[view,setView]=useState<{x:number;y:number;rotation:number}|null>(null);
 const [sound,setSound]=useState(true),[toast,setToast]=useState(''),[dragging,setDragging]=useState(false),[loaded,setLoaded]=useState(false);
 const shotRef=useRef<HoopsBall|null>(null),startedDrag=useRef<Aim|null>(null),scoreCommitted=useRef(false),audioEnabled=useRef(true),lastFrame=useRef(0);
 const court=compact?MOBILE_HOOPS:HOOPS;
 const spot=(compact?MOBILE_HOOPS_SPOTS:HOOPS_SPOTS)[Math.min(shots,HOOPS_SHOTS-1)];
 const cue=useCallback((event:SportsCue)=>{if(audioEnabled.current)playSportsAudio(event);},[]);
 useEffect(()=>{
  const mq=window.matchMedia('(max-width: 760px)');
  const apply=()=>{setCompact(mq.matches);if(shotRef.current===null){setAngle(mq.matches?60:52);setPower(mq.matches?69:64);}};
  const timer=setTimeout(()=>{
   apply();
   try{
    const val=Number(localStorage.getItem('studio-club:hoops-best'));
    if(Number.isFinite(val)&&val>=0)setBest(val);
    const saved=localStorage.getItem('studio-club:hoops-sound');
    if(saved==='false'){setSound(false);audioEnabled.current=false;}
   }catch{}
   setLoaded(true);
  },0);mq.addEventListener('change',apply);
  return()=>{clearTimeout(timer);mq.removeEventListener('change',apply);};
 },[]);
 useEffect(()=>{
  if(phase!=='play'||!flying||!shotRef.current)return;
  let raf=0;lastFrame.current=0;
  const step=(now:number)=>{
   if(!lastFrame.current)lastFrame.current=now;
   const dt=Math.min(.043,(now-lastFrame.current)/1000);lastFrame.current=now;
   const b=shotRef.current;if(!b)return;
   stepHoopsBall(b,dt);
   for(const event of b.events){
    if(event==='rim')cue('hoops-rim');
    if(event==='glass')cue('hoops-board');
    if(event==='floor')cue('hoops-floor');
    if(event==='swish'&&!scoreCommitted.current){
     scoreCommitted.current=true;const points=hoopsPoints((compact?MOBILE_HOOPS_SPOTS:HOOPS_SPOTS)[shots-1],true,b.rimHits,b.court);
     setScore(s=>{const result=s+points;setBest(prev=>{if(result>prev){try{localStorage.setItem('studio-club:hoops-best',String(result));}catch{}return result;}return prev;});return result;});
     setStreak(s=>s+1);setToast(hoopsResultText(b,points));
     cue('hoops-swish');cue('hoops-cheer');
    }
   }
   setView({x:b.x,y:b.y,rotation:b.rotation});
   if(b.finished){
    if(!b.scored){setStreak(0);setToast(hoopsResultText(b,0));cue('hoops-miss');}
    setFlying(false);shotRef.current=null;
    if(shots>=HOOPS_SHOTS)setPhase('done');
    return;
   }
   raf=requestAnimationFrame(step);
  };
  raf=requestAnimationFrame(step);return()=>cancelAnimationFrame(raf);
 },[phase,flying,shots,compact,cue]);
 useEffect(()=>{const handle=()=>{if(document.hidden)setPhase(p=>p==='play'?'paused':p);};document.addEventListener('visibilitychange',handle);return()=>document.removeEventListener('visibilitychange',handle);},[]);
 const begin=()=>{unlockSportsAudio();setPhase('play');setToast('');};
 const reset=()=>{shotRef.current=null;setView(null);setShots(0);setScore(0);setStreak(0);setFlying(false);setToast('');setAngle(compact?60:52);setPower(compact?69:64);unlockSportsAudio();setPhase('play');};
 const launch=(a=angle,p=power)=>{
  if(phase!=='play'||flying||shots>=HOOPS_SHOTS)return;
  unlockSportsAudio();const b=releaseHoopsBall(spot,a,p,court);
  shotRef.current=b;scoreCommitted.current=false;setView({x:b.x,y:b.y,rotation:0});
  setShots(n=>n+1);setFlying(true);setToast('');cue('hoops-release');
 };
 const point=(e:PointerEvent<SVGSVGElement>):Aim=>{
  const rect=e.currentTarget.getBoundingClientRect();
  return{x:(e.clientX-rect.left)*court.width/rect.width,y:(e.clientY-rect.top)*court.height/rect.height};
 };
 const aimFrom=(a:Aim,b:Aim)=>{
  const dx=a.x-b.x,dy=b.y-a.y,dist=Math.hypot(dx,dy);
  if(dx<10||dy<-35||dist<25)return null;
  return{angle:clamp(Math.atan2(Math.max(7,dy),dx)*180/Math.PI,28,79),power:Math.round(clamp(dist*.55,25,100))};
 };
 const down=(e:PointerEvent<SVGSVGElement>)=>{
  if(phase!=='play'||flying)return;
  const p=point(e);startedDrag.current=p;setDragging(true);e.currentTarget.setPointerCapture(e.pointerId);
 };
 const move=(e:PointerEvent<SVGSVGElement>)=>{
  if(!startedDrag.current||!dragging||flying)return;
  const aim=aimFrom(startedDrag.current,point(e));if(aim){setAngle(Math.round(aim.angle));setPower(aim.power);}
 };
 const up=(e:PointerEvent<SVGSVGElement>)=>{
  const start=startedDrag.current;startedDrag.current=null;setDragging(false);
  if(!start||phase!=='play'||flying)return;
  const value=aimFrom(start,point(e));if(value){setAngle(Math.round(value.angle));setPower(value.power);launch(value.angle,value.power);}
 };
 const keyboard=(e:KeyboardEvent<HTMLElement>)=>{
  if(e.target instanceof HTMLInputElement||e.target instanceof HTMLButtonElement||e.repeat)return;
  if(e.code==='Space'){e.preventDefault();if(phase==='ready')begin();else if(phase==='done')reset();else launch();}
  else if(e.key==='ArrowUp'){e.preventDefault();setAngle(n=>clamp(n+2,28,79));}
  else if(e.key==='ArrowDown'){e.preventDefault();setAngle(n=>clamp(n-2,28,79));}
  else if(e.key==='ArrowLeft'){e.preventDefault();setPower(n=>clamp(n-2,25,100));}
  else if(e.key==='ArrowRight'){e.preventDefault();setPower(n=>clamp(n+2,25,100));}
 };
 const aimLine=useMemo(()=>phase==='play'&&!flying?traceHoopsShot(spot,angle,power,court):[],[phase,flying,spot,angle,power,court]);
 const position=flying&&view?view:{x:spot,y:court.launchY,rotation:0};
 const changeSound=()=>{const on=!sound;setSound(on);audioEnabled.current=on;if(on){unlockSportsAudio();cue('hoops-release');}try{localStorage.setItem('studio-club:hoops-sound',String(on));}catch{}};
 return <main className="hoops-main" onKeyDown={keyboard}>
  <nav className="hoops-nav"><Link href="/lab/arcade">← All games</Link><span>PLAY STUDIO · SPORTS</span><Link href="/lab">Studio Lab</Link></nav>
  <header className="hoops-heading"><div><span className="hoops-kicker">ORIGINAL ARCADE BASKETBALL</span><h1>ROOFTOP <em>HOOPS</em></h1></div><p>Read the arc. Beat the rim. Chase your best twelve shots.</p></header>
  <section className="hoops-shell" aria-label="Rooftop Hoops full court game">
   <div className="hoops-topline"><div className="hoops-stat"><span>SCORE</span><b>{score}</b></div><div className="hoops-stat"><span>BEST</span><b>{best}</b></div><div className="hoops-stat"><span>SHOTS</span><b>{shots} / {HOOPS_SHOTS}</b></div><div className="hoops-live-actions">
     <button aria-pressed={sound} onClick={changeSound}>{sound?'🔊 SOUND ON':'🔇 SOUND OFF'}</button>
     <button onClick={()=>setPhase(p=>p==='play'?'paused':p==='paused'?'play':p)} disabled={phase==='ready'||phase==='done'}>{phase==='paused'?'▶ RESUME':'⏸ PAUSE'}</button>
     <button onClick={reset}>↻ RESTART</button>
   </div></div>
   <div className="hoops-stage" data-orientation={compact?'portrait':'landscape'}>
    <RooftopCourt court={court} compact={compact} spot={spot} ball={position} aimLine={aimLine} toast={toast} score={score} shots={shots} streak={streak} dragging={dragging} flying={flying} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={()=>{startedDrag.current=null;setDragging(false);}}/>
    {phase==='ready'&&<div className="hoops-curtain"><span className="hoops-start-ball" aria-hidden="true">🏀</span><h2>THE COURT IS YOURS.</h2><p>Pull the ball back and release, or tune your angle and power below. Twelve shots. Every swish counts.</p><button disabled={!loaded} onClick={begin}>▶ TAKE THE COURT</button><small>Sound is on by default. Tap the speaker to mute.</small></div>}
    {phase==='paused'&&<div className="hoops-curtain"><h2>TIMEOUT.</h2><p>Your shot and score are saved for this round.</p><button onClick={()=>{unlockSportsAudio();setPhase('play');}}>▶ BACK IN THE GAME</button></div>}
    {phase==='done'&&<div className="hoops-curtain"><span className="hoops-start-ball" aria-hidden="true">{score>=18?'🏆':'🏀'}</span><h2>FINAL BUZZER!</h2><p><b>{score} points</b> from {HOOPS_SHOTS} shots. {score>=18?'You owned the roof!':'The rim is waiting for your comeback.'}</p><button onClick={reset}>↻ RUN IT BACK</button></div>}
   </div>
   <div className="hoops-control-deck">
    <div className="hoops-direction-tip"><strong>{flying?'BALL IN FLIGHT…':phase==='play'?'PULL BACK · RELEASE · SWISH':'ROOFTOP SHOOTOUT'}</strong><span>{compact?'Aim by pulling down-left, then release.':'Drag backwards from the ball to aim, or adjust the controls.'}</span></div>
    <div className="hoops-control-group">
      <label htmlFor="hoops-angle">ANGLE <b>{angle}°</b></label>
      <input id="hoops-angle" type="range" min="28" max="79" step="1" value={angle} disabled={flying||phase==='done'} onChange={e=>setAngle(Number(e.target.value))}/>
    </div>
    <div className="hoops-control-group">
      <label htmlFor="hoops-power">POWER <b>{power}%</b></label>
      <input id="hoops-power" type="range" min="25" max="100" step="1" value={power} disabled={flying||phase==='done'} onChange={e=>setPower(Number(e.target.value))}/>
    </div>
    <button className="hoops-shoot" disabled={phase!=='play'||flying||shots>=HOOPS_SHOTS} onClick={()=>launch()}>{flying?'BALL FLYING…':'🏀 SHOOT'}</button>
   </div>
   <div className="hoops-feedback" role="status"><strong>{toast||'FIND YOUR ARC.'}</strong><span>{flying?'Follow the ball and watch for a rim or backboard bounce.':streak>=2?streak+' made shots in a row!':'Adjust angle and power, then release.'}</span></div>
  </section>
  <p className="hoops-help">Original basketball challenge with real trajectories, rim and glass rebounds, two- and three-point scoring, and sound effects. On a keyboard, press Space to shoot; arrow keys adjust your aim. No accounts or purchases.</p>
 </main>;
}
