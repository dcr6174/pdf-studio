'use client';
import {useCallback,useEffect,useRef,useState} from 'react';
import Link from '@/components/browser-link';
import {GameEmblem} from '@/components/game-emblem';
import {freshGame,type FreshSlug,type FreshKind} from '@/lib/fresh-catalog';
import {expansionGame,type ExpansionSlug,type ExpansionKind} from '@/lib/expansion-catalog';
import {ExpansionMotion} from '@/components/expansion-motion';
import {HillRider} from '@/components/hill-rider';
import {TenPinBowling} from '@/components/tenpin-bowling';
import {SurfaceStudio} from '@/components/surface-studio';
import {SandPour} from '@/components/granular-sand';
import {ExpansionSatisfy} from '@/components/expansion-satisfy';
import {ExpansionMind} from '@/components/expansion-mind';
import {ExpansionSkill} from '@/components/expansion-skill';
import {FreshCasual} from '@/components/fresh-casual';
import {FreshSports} from '@/components/fresh-sports';
import {FreshOneTap} from '@/components/fresh-one-tap';
import {playArcadeSound,type ArcadeEffect} from '@/lib/arcade-audio';

export function FreshGame({slug}:{slug:FreshSlug|ExpansionSlug}){
 const game=freshGame(slug)??expansionGame(slug)!;
 const [phase,setPhase]=useState<'ready'|'play'|'paused'|'finished'>(game.kind==='cricket'?'play':'ready');
 const [session,setSession]=useState(game.kind==='cricket'?1:0),[score,setScore]=useState(0),[best,setBest]=useState(0);
 const [comfort,setComfort]=useState(false),[sound,setSound]=useState(false),[loaded,setLoaded]=useState(false),[result,setResult]=useState({won:false,message:''}),[help,setHelp]=useState(false);
 const lastSound=useRef(0),stageRef=useRef<HTMLElement|null>(null);
 useEffect(()=>{const timer=setTimeout(()=>{try{const recent=JSON.parse(localStorage.getItem('studio-arcade:recent')||'[]');localStorage.setItem('studio-arcade:recent',JSON.stringify([slug,...(Array.isArray(recent)?recent:[]).filter(v=>typeof v==='string'&&v!==slug)].slice(0,4)));const value=Number(localStorage.getItem('studio-arcade:best:'+slug));if(Number.isFinite(value))setBest(Math.max(0,value));setComfort(localStorage.getItem('studio-arcade:comfort')==='true');setSound(localStorage.getItem('studio-arcade:sound')==='true');}catch{/* Browser storage is optional. */}setLoaded(true);},0);return()=>clearTimeout(timer);},[slug]);
 useEffect(()=>{const pause=()=>{if(document.hidden)setPhase(p=>p==='play'?'paused':p);};document.addEventListener('visibilitychange',pause);return()=>document.removeEventListener('visibilitychange',pause);},[]);
 const onScore=useCallback((n:number)=>{setScore(n);setBest(old=>{if(n<=old)return old;try{localStorage.setItem('studio-arcade:best:'+slug,String(n));}catch{}return n;});},[slug]);
 const onFinish=useCallback((won:boolean,message:string)=>{setResult({won,message});setPhase('finished');},[]);
 const onSound=useCallback((effect:ArcadeEffect)=>{if(!sound)return;const now=Date.now();if(effect==='bounce'&&now-lastSound.current<100)return;lastSound.current=now;playArcadeSound(game.kind,effect);},[sound,game.kind]);
 const restart=()=>{setScore(0);setResult({won:false,message:''});setSession(i=>i+1);setPhase('play');};
 const toggleSound=()=>{setSound(s=>{try{localStorage.setItem('studio-arcade:sound',String(!s));}catch{}return !s;});};
 const toggleComfort=()=>{setComfort(s=>{try{localStorage.setItem('studio-arcade:comfort',String(!s));}catch{}return !s;});};
 const expansion=!!expansionGame(slug);
 const motion=['highway','metro','jungle','hill','drift','snow','river','rocket','traffic','prix'].includes(game.kind);
 const satisfy=['wrap','clean','paint','rings','sand','untangle','screws','polish','shapes','shelf'].includes(game.kind);
 const mind=['laser','lights','pegball','meteor','falling','balance','oneline','path','count','math'].includes(game.kind);
 const isSport=['cricket','volleyball','pool'].includes(game.kind);
 const isOneTap=['spiral','hop'].includes(game.kind);
 const settings=<div className="fresh-preferences"><button aria-pressed={comfort} onClick={toggleComfort}>👓 Comfort Mode: {comfort?'On':'Off'}</button><button aria-pressed={sound} onClick={toggleSound}>{sound?'🔊 Sound on':'🔇 Sound off'}</button></div>;
 return <main className="fresh-main" data-comfort={comfort} data-game-kind={game.kind}>
 <nav className="fresh-top-nav"><Link href="/lab/arcade">← All games</Link><span>PLAY STUDIO</span><Link href="/lab">Studio Lab</Link></nav>
 <header className="fresh-heading"><div className="fresh-title-mark"><GameEmblem slug={slug} compact/></div><div><span className="arcade-kicker">{game.genre} · TOUCH-FRIENDLY PLAY</span><h1>{game.name}</h1><p>{game.description}</p></div></header>
 <div className="fresh-layout"><section ref={stageRef} className="fresh-play-shell" aria-label={game.name+' play area'}>
 <div className="fresh-game-bar"><div className="fresh-stats"><span>Score <b>{score}</b></span><span>Best <b>{best}</b></span><span aria-live="polite">{phase==='paused'?'Paused':phase==='finished'?'Finished':phase==='play'?'Playing':'Ready'}</span></div><div className="fresh-quick-actions"><button disabled={phase!=='play'&&phase!=='paused'} onClick={()=>setPhase(p=>p==='play'?'paused':'play')}>{phase==='paused'?'▶ Resume':'⏸ Pause'}</button><button onClick={restart}>↻ Restart</button><button aria-expanded={help} aria-controls="fresh-game-help" onClick={()=>setHelp(v=>!v)}>ⓘ Help</button><button onClick={()=>{const el=stageRef.current;if(el&&document.fullscreenElement!==el){void el.requestFullscreen?.().catch(()=>{});}else if(document.fullscreenElement){void document.exitFullscreen?.().catch(()=>{});}}}>⛶ Full screen</button></div></div>
 <div className="fresh-play-viewport">
 {session>0&&<div className="fresh-active-scene" inert={phase!=='play'}>{expansion?(motion?(game.kind==='hill'?<HillRider key={session} active={phase==='play'} comfort={comfort} onScore={onScore} onFinish={onFinish} onSound={onSound}/>:<ExpansionMotion key={session} kind={game.kind as ExpansionKind} active={phase==='play'} comfort={comfort} onScore={onScore} onFinish={onFinish} onSound={onSound}/>):satisfy?(game.kind==='sand'?<SandPour key={session} active={phase==='play'} comfort={comfort} onScore={onScore} onFinish={onFinish} onSound={onSound}/>:['clean','polish'].includes(game.kind)?<SurfaceStudio key={session} kind={game.kind as 'clean'|'polish'} active={phase==='play'} comfort={comfort} onScore={onScore} onFinish={onFinish} onSound={onSound}/>:<ExpansionSatisfy key={session} kind={game.kind as ExpansionKind} active={phase==='play'} comfort={comfort} onScore={onScore} onFinish={onFinish} onSound={onSound}/>):mind?<ExpansionMind key={session} seed={session} kind={game.kind as ExpansionKind} active={phase==='play'} comfort={comfort} onScore={onScore} onFinish={onFinish} onSound={onSound}/>:game.kind==='bowling'?<TenPinBowling key={session} active={phase==='play'} comfort={comfort} onScore={onScore} onFinish={onFinish} onSound={onSound}/>:<ExpansionSkill key={session} kind={game.kind as ExpansionKind} active={phase==='play'} comfort={comfort} onScore={onScore} onFinish={onFinish} onSound={onSound}/>):isSport?<FreshSports key={session} kind={game.kind as FreshKind} active={phase==='play'} comfort={comfort} onScore={onScore} onFinish={onFinish} onSound={onSound}/>:isOneTap?<FreshOneTap key={session} kind={game.kind as FreshKind} active={phase==='play'} comfort={comfort} onScore={onScore} onFinish={onFinish} onSound={onSound}/>:<FreshCasual key={session} seed={session} kind={game.kind as FreshKind} active={phase==='play'} comfort={comfort} onScore={onScore} onFinish={onFinish} onSound={onSound}/>}</div>}
 {phase==='ready'&&<div className="fresh-curtain"><GameEmblem slug={slug} compact/><h2>Ready to play?</h2><p>{game.instructions}</p><button className="fresh-primary" disabled={!loaded} onClick={restart}>▶ Play now</button><p className="fresh-curtain-extra">No account required. Take your time.</p></div>}
 {phase==='paused'&&<div className="fresh-curtain"><h2>Game paused</h2><p>Your current round is paused. Leaving the page does not save this round.</p><button className="fresh-primary" onClick={()=>setPhase('play')}>▶ Resume</button></div>}
 {phase==='finished'&&<div className="fresh-curtain" role="status"><h2>{result.won?(game.kind==='cricket'?'CHASE WON!':'You did it!'):(game.kind==='cricket'?'CHASE COMPLETE':'Round finished')}</h2><p>{result.message}</p><p>{game.kind==='cricket'?'Runs': 'Score'}: <b>{score}</b> · Best: <b>{best}</b></p><button className="fresh-primary" onClick={restart}>↻ Play again</button><Link href="/lab/arcade">Choose another game →</Link></div>}
 </div>
 <div className="fresh-actions"><details className="fresh-settings"><summary>⚙ Sound and Comfort Mode</summary>{settings}</details><Link href="/lab/arcade">← Back to game library</Link></div>
 {help&&<div id="fresh-game-help" className="fresh-help" role="region" aria-label="Game rules"><h2>How to play</h2><p>{game.instructions}</p><p>Use your finger, mouse or the large on-screen buttons. Pausing never costs points. Comfort Mode uses slower or more forgiving controls where available.</p></div>}
 </section>
 </div>
 <p className="fresh-storage-note">Personal bests and preferences stay in this browser. Clearing browser storage clears them. Sound starts off unless you enable it.</p>
 </main>;
}
