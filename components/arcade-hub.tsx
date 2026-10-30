'use client';
import {useEffect,useState} from 'react';
import Link from '@/components/browser-link';
import {activeArcadeGames} from '@/lib/arcade-active';
import {dailySlug,dayKey,levelFromXp,parseProgress,type Progress} from '@/lib/arcade-progress';
import {recentSlugs} from '@/lib/arcade-preferences';
import './game-frame.css';
import './arcade-hub.css';
type Game=typeof activeArcadeGames[number];
const bySlug=new Map<string,Game>(activeArcadeGames.map(g=>[g.slug,g]));
const pick=(test:(g:Game)=>boolean,n=10)=>activeArcadeGames.filter(test).slice(0,n);
const rows:{title:string;games:Game[]}[]=[
 {title:'Quick 1-minute games',games:pick(g=>['Quick','Timing','Arcade','Aim'].includes(g.genre))},
 {title:'Sports',games:pick(g=>g.genre==='Sports'||g.genre==='Driving')},
 {title:'Brain games',games:pick(g=>['Think','Puzzle','Word'].includes(g.genre))},
 {title:'2-player & board',games:pick(g=>g.genre==='Board')},
];
function Row({title,games,best}:{title:string;games:Game[];best:Record<string,number>}){
 if(!games.length)return null;
 return <section className="hub-row" aria-label={title}><h2>{title}</h2><div className="hub-scroll">{games.map(g=><Link key={g.slug} href={'/lab/arcade/'+g.slug+'?play=1'} className="hub-card"><span className="hub-card-genre">{g.genre}</span><strong>{g.name}</strong>{best[g.slug]?<span className="hub-card-best">Best {best[g.slug]}</span>:<span className="hub-card-best hub-new">Not played yet</span>}</Link>)}</div></section>;
}
/** Lobby header: level, streak, daily challenge, surprise me and streaming-style rows. Device-local only. */
export function ArcadeHub(){
 const [data,setData]=useState<{p:Progress;daily:Game;recent:Game[];best:Record<string,number>;dailyBest?:number}|null>(null);
 useEffect(()=>{const t=setTimeout(()=>{let p:Progress=parseProgress(null),recent:string[]=[];const best:Record<string,number>={};
  try{p=parseProgress(localStorage.getItem('studio-arcade:progress:v1'));recent=recentSlugs(localStorage.getItem('studio-arcade:recent'));for(const g of activeArcadeGames){const v=Number(localStorage.getItem('studio-arcade:best:'+g.slug));if(v>0)best[g.slug]=v;}}catch{/* Storage is optional. */}
  const day=dayKey(new Date()),daily=bySlug.get(dailySlug(day,activeArcadeGames.map(g=>g.slug)))!;
  setData({p,daily,recent:recent.map(s=>bySlug.get(s)).filter((g):g is Game=>!!g),best,dailyBest:p.dailyBest[day]});},0);return()=>clearTimeout(t);},[]);
 if(!data)return <div className="hub hub-loading" aria-hidden="true"/>;
 const {p,daily,recent,best}=data,lv=levelFromXp(p.xp);
 const most=Object.entries(p.plays).sort((a,b)=>b[1]-a[1]).map(([s])=>bySlug.get(s)).filter((g):g is Game=>!!g).slice(0,10);
 const surprise=()=>{const g=activeArcadeGames[Math.floor(Math.random()*activeArcadeGames.length)];window.location.href='/lab/arcade/'+g.slug+'?play=1';};
 return <div className="hub">
  <div className="hub-top">
   <Link className="hub-daily" href={'/lab/arcade/'+daily.slug+'?play=1'}><span className="hub-kicker">★ Today’s challenge · +20 XP</span><strong>{daily.name}</strong><span>{data.dailyBest!==undefined?'Your best today: '+data.dailyBest:'Same game for everyone today. Set your score.'}</span><span className="hub-go">Play now →</span></Link>
   <div className="hub-player"><span className="hub-kicker">Player level</span><strong>Level {lv.level}</strong><div className="gf-meter"><i style={{width:Math.round(lv.into/lv.need*100)+'%'}}/></div><span>{lv.into} / {lv.need} XP · {p.rounds} rounds played</span><span className="hub-streak">{p.streak>0?'🔥 '+p.streak+'-day streak':'Play today to start a streak'}</span></div>
   <div className="hub-actions">{recent[0]&&<Link className="hub-continue" href={'/lab/arcade/'+recent[0].slug+'?play=1'}>▶ Continue: {recent[0].name}</Link>}<button type="button" className="hub-surprise" onClick={surprise}>🎲 Surprise me</button></div>
  </div>
  {most.length>0&&<Row title="Your most played" games={most} best={best}/>}
  {rows.map(r=><Row key={r.title} title={r.title} games={r.games} best={best}/>)}
 </div>;
}
