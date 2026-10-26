'use client';
import {useCallback,useEffect,useMemo,useRef,useState,type PointerEvent} from 'react';
import Link from '@/components/browser-link';
import {HOOPS,hoopPosition,shooterPosition,launchY,makeHoopsBall,stepHoops,previewHoops,evaluateHoopsScore,type HoopsBall} from '@/lib/rooftop-hoops-engine';
import {playStadiumSound} from '@/lib/stadium-audio';
type Phase='ready'|'play'|'paused'|'done';
const SHOTS=10;
const clamp=(n:number,lo:number,hi:number)=>Math.max(lo,Math.min(hi,n));
const buildings=[{x:0,w:105,h:178},{x:98,w:105,h:222},{x:207,w:92,h:183},{x:312,w:105,h:238},{x:412,w:113,h:172},{x:534,w:102,h:215},{x:635,w:106,h:184},{x:747,w:130,h:235},{x:879,w:121,h:187}];
export function RooftopHoops(){
 const [phase,setPhase]=useState<Phase>('ready'),[sound,setSound]=useState(true),[loaded,setLoaded]=useState(false);
 const [angle,setAngle]=useState(51),[power,setPower]=useState(820),[attempts,setAttempts]=useState(0),[score,setScore]=useState(0);
 const [streak,setStreak]=useState(0),[best,setBest]=useState(0),[message,setMessage]=useState('One ball. One roof. Make the shot.');
 const [feedback,setFeedback]=useState(''),[flight,setFlight]=useState<HoopsBall|null>(null),[inFlight,setInFlight]=useState(false);
 const ballRef=useRef<HoopsBall|null>(null),dragRef=useRef<{x:number;y:number}|null>(null),scoreRef=useRef(0);
 const [dragging,setDragging]=useState(false);
 const arena=useRef<SVGSVGElement|null>(null);
 const round=Math.min(SHOTS,attempts+1),rimX=hoopPosition(attempts),fromX=shooterPosition(attempts);
 const canShoot=phase==='play'&&!inFlight&&attempts<SHOTS;
 const trail=useMemo(()=>canShoot?previewHoops(angle,power,fromX,rimX):[],[angle,power,fromX,rimX,canShoot]);
 useEffect(()=>{
  const t=setTimeout(()=>{
   try{
    const n=Number(localStorage.getItem('studio-arcade:best:rooftop-hoops'));if(Number.isFinite(n))setBest(Math.max(0,n));
    const stored=localStorage.getItem('studio-arcade:sound:rooftop');if(stored!==null)setSound(stored==='true');
    const recent=JSON.parse(localStorage.getItem('studio-arcade:recent')||'[]');
    localStorage.setItem('studio-arcade:recent',JSON.stringify(['rooftop-hoops',...(Array.isArray(recent)?recent:[]).filter(v=>typeof v==='string'&&v!=='rooftop-hoops')].slice(0,4)));
   }catch{/* browser storage is optional */}
   setLoaded(true);
  },0);
  return()=>clearTimeout(t);
 },[]);
 useEffect(()=>{const hide=()=>{if(document.hidden)setPhase(p=>p==='play'?'paused':p);};document.addEventListener('visibilitychange',hide);return()=>document.removeEventListener('visibilitychange',hide);},[]);
 const effect=useCallback((cue:'shoot'|'rim'|'backboard'|'bounce'|'score'|'miss'|'start')=>{if(sound)playStadiumSound('hoops',cue);},[sound]);
 const start=()=>{
  setScore(0);scoreRef.current=0;setStreak(0);setAttempts(0);setFlight(null);setInFlight(false);ballRef.current=null;
  setAngle(51);setPower(820);setFeedback('');setMessage('Swipe diagonally upwards, or press SHOOT. Ten attempts.');
  setPhase('play');effect('start');
 };
 const shoot=useCallback((a=angle,p=power)=>{
  if(phase!=='play'||ballRef.current||attempts>=SHOTS)return;
  const next=makeHoopsBall(a,p,fromX);
  ballRef.current=next;setFlight(next);setInFlight(true);setFeedback('');setMessage('Ball in the air…');
  effect('shoot');
 },[angle,power,attempts,fromX,phase,effect]);
 const toggleSound=()=>{const next=!sound;setSound(next);try{localStorage.setItem('studio-arcade:sound:rooftop',String(next));}catch{}if(next)playStadiumSound('hoops','start');};
 useEffect(()=>{
  if(phase!=='play'||!inFlight)return;
  let raf=0,last=0,paint=0;
  const tick=(now:number)=>{
   if(!last)last=now;
   const dt=clamp((now-last)/1000,0,.045);last=now;
   const b=ballRef.current;if(!b)return;
   const step=stepHoops(b,dt,rimX),current=step.ball;
   ballRef.current=current;
   if(step.event==='rim')effect('rim');
   if(step.event==='board')effect('backboard');
   if(step.event==='swish'){
    const points=evaluateHoopsScore(current,streak),newScore=scoreRef.current+points;
    scoreRef.current=newScore;setScore(newScore);setStreak(v=>v+1);setFeedback('SPLASH! +'+points);
    setMessage(current.rimHits===0?'Nothing but net! +3. A hot streak adds a bonus.':'Off the iron and in! +2.');
    effect('score');
    setBest(old=>{if(newScore<=old)return old;try{localStorage.setItem('studio-arcade:best:rooftop-hoops',String(newScore));}catch{}return newScore;});
   }else if(step.event==='bounce')effect('bounce');
   if(now-paint>24||current.done){setFlight({...current});paint=now;}
   if(current.done){
    ballRef.current=null;setInFlight(false);
    if(!current.scored){setFeedback('SO CLOSE!');setMessage('Try adjusting the arc and power.');setStreak(0);effect('miss');}
    else setMessage('Great shot! Find the sweet spot from the next position.');
    setAttempts(v=>v+1);
    if(attempts+1>=SHOTS)setPhase('done');
    setFlight(null);
    return;
   }
   raf=requestAnimationFrame(tick);
  };
  raf=requestAnimationFrame(tick);return()=>cancelAnimationFrame(raf);
 },[phase,inFlight,attempts,rimX,streak,effect]);
 const pos=(e:PointerEvent<SVGSVGElement>)=>{const b=arena.current!.getBoundingClientRect();return{x:(e.clientX-b.left)*1000/b.width,y:(e.clientY-b.top)*600/b.height};};
 const dragTo=(p:{x:number;y:number})=>{
  if(!dragRef.current)return;
  const dx=p.x-dragRef.current.x,dy=dragRef.current.y-p.y,len=Math.hypot(dx,dy);
  if(len<12)return;
  setAngle(Math.round(clamp(Math.atan2(dy,Math.max(10,dx))*180/Math.PI,27,78)));
  setPower(Math.round(clamp(len*3.9+360,460,1170)));
 };
 const down=(e:PointerEvent<SVGSVGElement>)=>{if(!canShoot)return;dragRef.current=pos(e);e.currentTarget.setPointerCapture(e.pointerId);setDragging(true);};
 const move=(e:PointerEvent<SVGSVGElement>)=>{if(dragRef.current)dragTo(pos(e));};
 const up=(e:PointerEvent<SVGSVGElement>)=>{
  if(!dragRef.current)return;
  const first=dragRef.current,p=pos(e),dx=p.x-first.x,dy=first.y-p.y,len=Math.hypot(dx,dy);
  dragRef.current=null;setDragging(false);
  if(len>28){
   const a=Math.round(clamp(Math.atan2(dy,Math.max(10,dx))*180/Math.PI,27,78));
   const powerNow=Math.round(clamp(len*3.9+360,460,1170));
   setAngle(a);setPower(powerNow);shoot(a,powerNow);
  }
 };
 useEffect(()=>{
  const key=(e:KeyboardEvent)=>{
   if(e.ctrlKey||e.altKey||e.metaKey||['INPUT','TEXTAREA','SELECT'].includes((e.target as HTMLElement)?.tagName))return;
   if(e.key===' '&&phase==='play'){e.preventDefault();shoot();}
   if(e.key==='Escape')setPhase(p=>p==='play'?'paused':p==='paused'?'play':p);
   if(e.key==='ArrowUp'&&phase==='play'){e.preventDefault();setAngle(a=>clamp(a+2,27,78));}
   if(e.key==='ArrowDown'&&phase==='play'){e.preventDefault();setAngle(a=>clamp(a-2,27,78));}
   if(e.key==='ArrowRight'&&phase==='play'){e.preventDefault();setPower(p=>clamp(p+20,460,1170));}
   if(e.key==='ArrowLeft'&&phase==='play'){e.preventDefault();setPower(p=>clamp(p-20,460,1170));}
  };
  window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key);
 },[phase,shoot]);
 const ball=flight??{x:fromX,y:launchY};
 const jumping=Boolean(inFlight&&flight&&flight.age<.65),net=Boolean(flight?.scored);
 return <main className="rooftop-main" aria-label="Rooftop Hoops basketball shootout">
  <nav className="rooftop-nav"><Link href="/lab/arcade">← All games</Link><span>PLAY STUDIO · SPORTS</span><Link href="/lab">Studio Lab</Link></nav>
  <header className="rooftop-head"><div><span className="rooftop-eyebrow">ROOFTOP LEAGUE · ORIGINAL ARCADE BASKETBALL</span><h1>Rooftop Hoops</h1></div>
   <div className="rooftop-head-actions"><button type="button" onClick={toggleSound} aria-label={sound?'Mute basketball sounds':'Enable basketball sounds'} aria-pressed={sound}>{sound?'🔊 SOUND ON':'🔇 SOUND OFF'}</button><button type="button" onClick={()=>setPhase(p=>p==='play'?'paused':p==='paused'?'play':p)} disabled={phase==='ready'||phase==='done'}>{phase==='paused'?'▶ RESUME':'⏸ PAUSE'}</button><button type="button" onClick={start}>↻ RESTART</button></div></header>
  <div className="rooftop-scoreline" aria-label="Basketball scoreboard"><div><span>POINTS</span><strong>{score}</strong></div><div><span>SHOT</span><strong>{round} <small>/ {SHOTS}</small></strong></div><div><span>HOT STREAK</span><strong>{streak>0?'🔥 '+streak:'—'}</strong></div><div><span>YOUR BEST</span><strong>{best}</strong></div></div>
  <div className="rooftop-stage" data-phase={phase}>
   <svg ref={arena} className="rooftop-court" viewBox="0 0 1000 600" role="group" aria-label={'Full rooftop basketball court. Shot '+round+' of ten. Drag upward and toward hoop to shoot.'} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={()=>{dragRef.current=null;setDragging(false);}}>
    <defs>
     <linearGradient id="rh-sky" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#111f4b"/><stop offset=".53" stopColor="#875879"/><stop offset=".95" stopColor="#f5ac7a"/><stop offset="1" stopColor="#f8cca0"/></linearGradient>
     <linearGradient id="rh-court" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#db935e"/><stop offset=".7" stopColor="#ac6352"/><stop offset="1" stopColor="#56364d"/></linearGradient>
     <linearGradient id="rh-jersey"><stop stopColor="#91ede2"/><stop offset="1" stopColor="#389bb2"/></linearGradient>
     <radialGradient id="rh-ball" cx=".3" cy=".24" r=".83"><stop stopColor="#ffd29c"/><stop offset=".6" stopColor="#ed843b"/><stop offset="1" stopColor="#a83b28"/></radialGradient>
    </defs>
    <rect width="1000" height="600" rx="15" fill="url(#rh-sky)"/>
    <circle cx="815" cy="98" r="59" fill="#ffdfa7"/><circle cx="815" cy="98" r="88" fill="#ffdfaa" opacity=".17"/>
    <g className="rh-clouds" opacity=".28" fill="#f2ddda"><ellipse cx="165" cy="127" rx="112" ry="17"/><ellipse cx="272" cy="146" rx="96" ry="20"/><ellipse cx="565" cy="101" rx="126" ry="15"/></g>
    {buildings.map((v,i)=><g key={i}><rect x={v.x} y={422-v.h} width={v.w} height={v.h+44} fill={i%2?'#393352':'#2c3455'}/>{Array.from({length:Math.floor(v.h/28)*3},(_,j)=><rect key={j} x={v.x+10+(j%3)*25} y={433-v.h+Math.floor(j/3)*27} width="11" height="12" fill={j%3===0?'#ffe4a9':'#e8bad0'} opacity={j%2?'.27':'.55'}/>)}</g>)}
    <rect y="418" width="1000" height="182" fill="url(#rh-court)"/>
    <path d="M0 519H1000M0 560H1000M80 418l110 180m150-180 113 180m130-180 150 180m72-180 120 180" stroke="#fae5c1" strokeWidth="4" opacity=".32"/>
    <path d="M58 525H938M58 525Q174 423 325 525M715 525Q817 420 946 525" stroke="#fce8cc" strokeWidth="5" fill="none"/>
    <path d="M0 418H1000" stroke="#ffe6b8" strokeWidth="5"/>
    {Array.from({length:17},(_,i)=><g key={i} fill="#292e4a" opacity=".6"><circle cx={i*62+13} cy={398+i%3*2} r="7"/><path d={'M'+(i*62+2)+' 411v11h24v-11z'}/></g>)}
    <path d={'M'+(rimX+65)+' 270V432H'+(rimX+112)} fill="none" stroke="#c3d4d5" strokeWidth="13"/>
    <rect x={rimX+52} y="131" width="12" height="134" rx="3" fill="#c7e6e6" stroke="#fff4e4" strokeWidth="3"/>
    <path d={'M'+(rimX+52)+' 190h-70v65h70'} fill="none" stroke="#fff5eb" strokeWidth="4"/>
    <path d={'M'+(rimX-HOOPS.hoopHalf)+' '+HOOPS.rimY+'h'+(HOOPS.hoopHalf*2)} stroke="#ff954f" strokeWidth="7" strokeLinecap="round"/>
    <path className={net?'rh-net-pop':''} d={'M'+(rimX-36)+' '+(HOOPS.rimY+4)+'Q'+(rimX-28)+' '+(HOOPS.rimY+48)+' '+rimX+' '+(HOOPS.rimY+49)+'Q'+(rimX+28)+' '+(HOOPS.rimY+48)+' '+(rimX+36)+' '+(HOOPS.rimY+4)} fill="none" stroke="#fff5e3" strokeWidth="4" strokeDasharray="5 4"/>
    <g className={jumping?'rh-player-shoot':''} transform={'translate('+fromX+' '+(launchY+24-(jumping?26:0))+')'}>
     <ellipse cx="3" cy="54" rx="38" ry="8" fill="#1d21385c"/>
     <path d="M-15 7l-16 36 13 3 18-37m18-2 10 36 15 2-9-37" stroke="#1e2e54" strokeWidth="16" fill="none" strokeLinecap="round"/>
     <path d="M-30 44h27m28 1h24" stroke="#e4f9f7" strokeWidth="10" strokeLinecap="round"/>
     <path d="M-25 -53Q0-61 28-53l8 55-58 4z" fill="url(#rh-jersey)" stroke="#e0f8ee" strokeWidth="4"/>
     <text x="5" y="-15" textAnchor="middle" fontSize="26" fontWeight="900" fill="#1b4662">7</text>
     <path d={jumping?'M-22 -50l-19-35m67 32 12-41':'M-22 -50l-18 15m66-15 16-24'} stroke="#deb092" strokeWidth="14" fill="none" strokeLinecap="round"/>
     <circle cx="4" cy="-78" r="19" fill="#d5a180"/><path d="M-15 -80q4-22 24-20l17 15-36 9z" fill="#243855"/>
    </g>
    {canShoot&&trail.length>3&&<polyline className="rh-trail" points={trail.filter((_,i)=>i%3===0).map(v=>v.x.toFixed(1)+','+v.y.toFixed(1)).join(' ')} fill="none" stroke="#fff1ac" strokeDasharray="6 12" strokeWidth="4" pointerEvents="none"/>}
    <ellipse cx={ball.x} cy={HOOPS.floorY+4} rx={Math.max(12,39-Math.max(0,HOOPS.floorY-ball.y)*.07)} ry="8" fill="#1b153b44"/>
    <g transform={'translate('+ball.x+' '+ball.y+')'}><g className={inFlight?'rh-ball-spin':''}><circle r="16" fill="url(#rh-ball)" stroke="#8a4128" strokeWidth="2"/><path d="M-15 0H15M0-15V15M-11-11q22 11 0 22M11-11q-22 11 0 22" stroke="#7d3928" fill="none" strokeWidth="2.4"/></g></g>
    <path d={'M'+(rimX-HOOPS.hoopHalf)+' '+HOOPS.rimY+'h'+(HOOPS.hoopHalf*2)} stroke="#fd9151" strokeWidth="6" strokeLinecap="round" pointerEvents="none"/>
    <rect x="19" y="22" width="216" height="54" rx="12" fill="#19233ddc" stroke="#ffe0a799"/>
    <text x="36" y="44" fontSize="14" fontWeight="900" letterSpacing="1.4" fill="#fff4d7">ROOFTOP LEAGUE</text>
    <text x="36" y="64" fontSize="12" fontWeight="800" fill="#ffdcac">SHOT {round} / {SHOTS} · GET THE ARC</text>
    {feedback&&phase==='play'&&<g><rect x="357" y="105" width="285" height="85" rx="15" fill="#182843e3" stroke="#ffe29e" strokeWidth="3"/><text x="500" y="159" textAnchor="middle" fontWeight="900" fontSize="34" fill="#fff5ce">{feedback}</text></g>}
   </svg>
   {(phase==='ready'||phase==='paused'||phase==='done')&&<div className="rooftop-curtain">
    <span className="rooftop-intro-tag">{phase==='done'?'FINAL BUZZER':phase==='paused'?'TIME OUT':'YOUR COURT. YOUR SHOT.'}</span>
    <h2>{phase==='done'?'GAME COMPLETE':phase==='paused'?'PAUSED':'TAKE THE SHOT.'}</h2>
    <p>{phase==='done'?'Ten shots complete. You earned '+score+' points. Personal best: '+best+'.':phase==='paused'?'Your shot is frozen. Resume to continue.':'Swipe upwards toward the hoop, watch the ball arc, hear the rim and build a hot streak.'}</p>
    <button type="button" className="rooftop-start" disabled={!loaded} onClick={phase==='paused'?()=>setPhase('play'):start}>{phase==='paused'?'▶ RESUME':phase==='done'?'↻ PLAY AGAIN':'🏀 START SHOOTOUT'}</button>
   </div>}
  </div>
  <div className="rooftop-bottom">
   <div className="rooftop-controls" role="group" aria-label="Basketball shot controls">
    <label>ARC <strong>{angle}°</strong><input type="range" min="27" max="78" value={angle} disabled={!canShoot} aria-label="Shot arc angle" onChange={e=>setAngle(Number(e.target.value))}/></label>
    <label>POWER <strong>{Math.round((power-460)/710*100)}%</strong><input type="range" min="460" max="1170" step="10" value={power} disabled={!canShoot} aria-label="Shot power" onChange={e=>setPower(Number(e.target.value))}/></label>
    <button type="button" className="rooftop-shoot" disabled={!canShoot} onClick={()=>shoot()}>{inFlight?'BALL FLYING':canShoot?'🏀 SHOOT':'WAIT…'}</button>
   </div>
   <div className="rooftop-commentary" role="status" aria-live="polite"><strong>{dragging?'RELEASE TO SHOOT':feedback||'YOUR NEXT SHOT'}</strong><span>{dragging?'Flick upward and toward the hoop.':message}</span></div>
  </div>
  <p className="rooftop-help">Swipe diagonally upward on the court, or adjust arc and power then press SHOOT. Keyboard: ↑↓ angle · ←→ power · Space shoot · Esc pause. Original court art and simulated basketball physics. Sound on by default; mute anytime.</p>
 </main>;
}
