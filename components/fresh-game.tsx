'use client';
import {useCallback,useEffect,useRef,useState} from 'react';
import Link from '@/components/browser-link';
import {GameEmblem} from '@/components/game-emblem';
import {freshGame,type FreshSlug} from '@/lib/fresh-catalog';
import {FreshCasual} from '@/components/fresh-casual';
import {FreshSports} from '@/components/fresh-sports';
import {playArcadeSound,type ArcadeEffect} from '@/lib/arcade-audio';

export function FreshGame({slug}:{slug:FreshSlug}){
 const game=freshGame(slug)!;
 const [phase,setPhase]=useState<'ready'|'play'|'paused'|'finished'>('ready');
 const [session,setSession]=useState(0),[score,setScore]=useState(0),[best,setBest]=useState(0);
 const [comfort,setComfort]=useState(false),[sound,setSound]=useState(false),[loaded,setLoaded]=useState(false),[result,setResult]=useState({won:false,message:''}),[help,setHelp]=useState(false);
 const effects=useRef({sound:false,kind:game.kind,last:0});effects.current.sound=sound;effects.current.kind=game.kind;
 useEffect(()=>{try{const recent=JSON.parse(localStorage.getItem('studio-arcade:recent')||'[]');localStorage.setItem('studio-arcade:recent',JSON.stringify([slug,...(Array.isArray(recent)?recent:[]).filter(v=>typeof v==='string'&&v!==slug)].slice(0,4)));const value=Number(localStorage.getItem('studio-arcade:best:'+slug));if(Number.isFinite(value))setBest(Math.max(0,value));setComfort(localStorage.getItem('studio-arcade:comfort')==='true');setSound(localStorage.getItem('studio-arcade:sound')==='true');}catch{/* Browser storage is optional. */}setLoaded(true);},[slug]);
 useEffect(()=>{const pause=()=>{if(document.hidden)setPhase(p=>p==='play'?'paused':p);};document.addEventListener('visibilitychange',pause);return()=>document.removeEventListener('visibilitychange',pause);},[]);
 const onScore=useCallback((n:number)=>{setScore(n);setBest(old=>{if(n<=old)return old;try{localStorage.setItem('studio-arcade:best:'+slug,String(n));}catch{}return n;});},[slug]);
 const onFinish=useCallback((won:boolean,message:string)=>{setResult({won,message});setPhase('finished');},[]);
 const onSound=useCallback((effect:ArcadeEffect)=>{const s=effects.current;if(!s.sound)return;const now=Date.now();if(effect==='bounce'&&now-s.last<100)return;s.last=now;playArcadeSound(s.kind,effect);},[]);
 const restart=()=>{setScore(0);setResult({won:false,message:''});setSession(i=>i+1);setPhase('play');};
 const toggleSound=()=>{setSound(s=>{try{localStorage.setItem('studio-arcade:sound',String(!s));}catch{}return !s;});};
 const toggleComfort=()=>{setComfort(s=>{try{localStorage.setItem('studio-arcade:comfort',String(!s));}catch{}return !s;});};
 const isSport=['cricket','volleyball','pool'].includes(game.kind);
 const settings=<div className="fresh-preferences"><button aria-pressed={comfort} onClick={toggleComfort}>👓 Comfort Mode: {comfort?'On':'Off'}</button><button aria-pressed={sound} onClick={toggleSound}>{sound?'🔊 Sound on':'🔇 Sound off'}</button></div>;
 return <main className="fresh-main">
 <nav className="fresh-top-nav"><Link href="/lab/arcade">← All games</Link><span>STUDIO ARCADE</span><Link href="/lab">Studio Lab</Link></nav>
 <header className="fresh-heading"><div className="fresh-title-mark"><GameEmblem slug={slug} compact/></div><div><span className="arcade-kicker">{game.genre} · SIMPLE CONTROLS · NO AD BREAKS</span><h1>{game.name}</h1><p>{game.description}</p></div></header>
 <div className="fresh-layout"><section className="fresh-play-shell" aria-label={game.name+' play area'}>
 <div className="fresh-stats"><span>Score <b>{score}</b></span><span>Personal best <b>{best}</b></span><span>{phase==='paused'?'Paused':phase==='finished'?'Finished':phase==='play'?'Playing':'Ready'}</span></div>
 <div className="fresh-play-viewport">
 {session>0&&<div className="fresh-active-scene" inert={phase!=='play'}>{isSport?<FreshSports key={session} kind={game.kind} active={phase==='play'} comfort={comfort} onScore={onScore} onFinish={onFinish} onSound={onSound}/>:<FreshCasual key={session} kind={game.kind} active={phase==='play'} comfort={comfort} onScore={onScore} onFinish={onFinish} onSound={onSound}/>}</div>}
 {phase==='ready'&&<div className="fresh-curtain"><GameEmblem slug={slug} compact/><h2>Ready to play?</h2><p>{game.instructions}</p><button className="fresh-primary" disabled={!loaded} onClick={restart}>▶ Play now</button><p className="fresh-curtain-extra">No account required. Take your time.</p></div>}
 {phase==='paused'&&<div className="fresh-curtain"><h2>Game paused</h2><p>Your place is saved while you take a break.</p><button className="fresh-primary" onClick={()=>setPhase('play')}>▶ Resume</button></div>}
 {phase==='finished'&&<div className="fresh-curtain" role="status"><h2>{result.won?'Nicely played!':'Another round?'}</h2><p>{result.message}</p><p>Score: <b>{score}</b> · Best: <b>{best}</b></p><button className="fresh-primary" onClick={restart}>↻ Play again</button><Link href="/lab/arcade">Choose another game →</Link></div>}
 </div>
 <div className="fresh-actions"><button disabled={phase!=='play'&&phase!=='paused'} onClick={()=>setPhase(p=>p==='play'?'paused':'play')}>{phase==='paused'?'▶ Resume':'⏸ Pause'}</button><button onClick={restart}>↻ Restart</button><button aria-expanded={help} onClick={()=>setHelp(v=>!v)}>ⓘ {help?'Hide rules':'How to play'}</button></div>
 {help&&<div className="fresh-help" role="region" aria-label="Game rules"><h2>How to play</h2><p>{game.instructions}</p><p>Use your finger, mouse or the large on-screen buttons. Pausing never costs points. Comfort Mode uses slower or more forgiving controls where available.</p></div>}
 </section>
 <aside className="fresh-sidebar"><h2>Simple. Satisfying. Yours.</h2><p>Every game starts with a short explanation. Controls are large enough for fingers, and there is no paid progression or forced timer in the puzzle games.</p>{settings}<div className="fresh-how"><h3>Controls at a glance</h3><p>{game.instructions}</p></div><Link href="/lab/arcade">Explore the other games →</Link></aside></div>
 <p className="fresh-storage-note">Personal bests and preferences stay in this browser. Clearing browser storage clears them. Sound starts off unless you enable it.</p>
 </main>;
}
