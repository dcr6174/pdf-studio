/** Device-local arcade progression: XP, levels, unlocks, missions, daily challenge, streaks and hall of fame. Pure functions only. */
export type Fame={initials:string;score:number;date:string};
export type ScoreKind='points'|'strokes'|'outcome';
export type Progress={xp:number;rounds:number;plays:Record<string,number>;wins:Record<string,number>;streak:number;lastDay:string;dailyBest:Record<string,number>;missions:Record<string,number[]>};
export const emptyProgress=():Progress=>({xp:0,rounds:0,plays:{},wins:{},streak:0,lastDay:'',dailyBest:{},missions:{}});
const num=(v:unknown,max=1e9)=>typeof v==='number'&&Number.isFinite(v)&&v>=0?Math.min(Math.floor(v),max):0;
const slugOk=(k:string)=>/^[a-z0-9-]{1,80}$/.test(k);
export function parseProgress(raw:string|null):Progress{
 const p=emptyProgress();
 try{const v:unknown=JSON.parse(raw??'{}');if(!v||typeof v!=='object'||Array.isArray(v))return p;const o=v as Record<string,unknown>;
  p.xp=num(o.xp);p.rounds=num(o.rounds);p.streak=num(o.streak,10000);p.lastDay=typeof o.lastDay==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(o.lastDay)?o.lastDay:'';
  for(const [key,target] of [['plays',p.plays],['wins',p.wins],['dailyBest',p.dailyBest]] as const){const m=o[key];if(m&&typeof m==='object'&&!Array.isArray(m))for(const [k,n] of Object.entries(m as Record<string,unknown>))if(k.length<=80&&(slugOk(k)||/^\d{4}-\d{2}-\d{2}$/.test(k)))target[k]=num(n);}
  const ms=o.missions;if(ms&&typeof ms==='object'&&!Array.isArray(ms))for(const [k,arr] of Object.entries(ms as Record<string,unknown>))if(slugOk(k)&&Array.isArray(arr))p.missions[k]=arr.filter(i=>i===0||i===1||i===2);
 }catch{/* Corrupt progress starts fresh. */}
 return p;
}
/** Level n needs 100*n*(n+1)/2 total XP: 100, 300, 600, 1000… */
export function levelFromXp(xp:number){let level=1;while(100*level*(level+1)/2<=xp)level++;const floor=100*(level-1)*level/2,next=100*level*(level+1)/2;return {level,into:xp-floor,need:next-floor};}
/** XP for a finished round. Points: 10 + up to 40 for score + 25 for a new best. Strokes: 25 + 25 for a new best (fewer). Outcome: 10, or 40 for a win. */
export function roundXp(score:number,previousBest:number,kind:ScoreKind='points',won:boolean|null=null){
 if(kind==='outcome')return won?40:10;
 if(kind==='strokes')return 25+(score>0&&(previousBest<=0||score<previousBest)?25:0);
 const s=Math.max(0,score);return 10+Math.min(40,Math.round(Math.sqrt(s)*4))+(s>previousBest&&s>0?25:0);
}
export const unlocks=[
 {level:2,id:'trail-sky',label:'Sky score trail'},
 {level:3,id:'theme-sunset',label:'Sunset arcade theme'},
 {level:4,id:'trail-gold',label:'Gold score trail'},
 {level:5,id:'retro',label:'Retro scanline mode'},
 {level:6,id:'theme-midnight',label:'Midnight arcade theme'},
 {level:8,id:'trail-rainbow',label:'Rainbow score trail'},
 {level:10,id:'theme-champion',label:'Champion gold frame'},
] as const;
export type UnlockId=typeof unlocks[number]['id'];
export const unlockedAt=(level:number)=>unlocks.filter(u=>u.level<=level);
export const newUnlocks=(before:number,after:number)=>unlocks.filter(u=>u.level>before&&u.level<=after);
export type Mission={id:0|1|2;label:string;target:number};
/** Three small goals per game that fit how the game is scored, scaled to the player's record so they stay reachable. */
export function missionsFor(best:number,kind:ScoreKind='points'):readonly Mission[]{
 if(kind==='outcome')return [{id:0,label:'Finish 3 games',target:3},{id:1,label:'Win a game',target:1},{id:2,label:'Win 3 games',target:3}];
 if(kind==='strokes'){const par=best>0?best+Math.max(1,Math.ceil(best*.1)):0;return [{id:0,label:'Finish 3 rounds',target:3},{id:1,label:par?'Finish in '+par+' strokes or fewer':'Finish a full round',target:par},{id:2,label:'Beat your best (fewer strokes)',target:best}];}
 const target=Math.max(5,Math.ceil(best*.6/5)*5);return [{id:0,label:'Finish 3 rounds',target:3},{id:1,label:'Score '+target+' in one round',target},{id:2,label:'Beat your best score',target:best}];
}
export type RoundResult={slug:string;score:number;previousBest:number;day:string;kind?:ScoreKind;won?:boolean|null};
export function dayKey(d:Date){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
function prevDay(day:string){const [y,m,d]=day.split('-').map(Number);return dayKey(new Date(y,m-1,d-1));}
/** Same game for everyone on a given date. */
export function dailySlug(day:string,slugs:readonly string[]){let h=2166136261;for(const c of day)h=Math.imul(h^c.charCodeAt(0),16777619)>>>0;return slugs[h%slugs.length];}
const improves=(kind:ScoreKind,score:number,best:number)=>kind==='strokes'?score>0&&best>0&&score<best:kind==='points'&&best>0&&score>best;
export function recordRound(p:Progress,r:RoundResult,dailyGame:string){
 const kind=r.kind??'points',won=r.won??null;
 const next:Progress={...p,plays:{...p.plays},wins:{...p.wins},dailyBest:{...p.dailyBest},missions:{...p.missions}};
 const before=levelFromXp(p.xp).level;let xp=roundXp(r.score,r.previousBest,kind,won);
 const done=new Set(next.missions[r.slug]??[]);const fresh:string[]=[];
 const plays=(next.plays[r.slug]??0)+1;next.plays[r.slug]=plays;next.rounds=p.rounds+1;
 const wins=(next.wins[r.slug]??0)+(won?1:0);if(won)next.wins[r.slug]=wins;
 const ms=missionsFor(r.previousBest,kind);
 const hit=[plays>=3,
  kind==='outcome'?wins>=1:kind==='strokes'?r.score>0&&(ms[1].target===0||r.score<=ms[1].target):r.score>=ms[1].target,
  kind==='outcome'?wins>=3:improves(kind,r.score,r.previousBest)];
 for(const m of ms)if(hit[m.id]&&!done.has(m.id)){done.add(m.id);fresh.push(m.label);}
 xp+=fresh.length*30;next.missions[r.slug]=[...done].sort();
 let daily=false;
 if(r.slug===dailyGame){daily=true;xp+=20;const old=next.dailyBest[r.day];const better=kind==='strokes'?old===undefined||r.score<old:r.score>(old??-1);if(better&&(kind!=='strokes'||r.score>0))next.dailyBest[r.day]=r.score;}
 if(next.lastDay!==r.day){next.streak=next.lastDay===prevDay(r.day)?p.streak+1:1;next.lastDay=r.day;}
 next.xp=p.xp+xp;
 const after=levelFromXp(next.xp).level;
 const keep=Object.keys(next.dailyBest).sort().slice(-30);next.dailyBest=Object.fromEntries(keep.map(k=>[k,next.dailyBest[k]]));
 return {progress:next,xp,missions:fresh,levelUp:after>before?after:0,unlocked:newUnlocks(before,after).map(u=>u.label),daily};
}
/** Encouraging near-miss text when a round lands just short of the best. Never shown for win/lose games. */
export function nearMiss(score:number,best:number,kind:ScoreKind='points'){
 if(best<=0||kind==='outcome')return '';
 if(kind==='strokes'){if(score<=best)return '';const gap=score-best;return gap<=Math.max(2,Math.ceil(best*.1))?'So close! '+gap+(gap===1?' stroke':' strokes')+' off your best.':'';}
 if(score>=best)return '';const gap=best-score;return gap<=Math.max(3,best*.15)?'So close! '+gap+' short of your best.':'';
}
export function parseFame(raw:string|null):Fame[]{try{const v:unknown=JSON.parse(raw??'[]');if(!Array.isArray(v))return [];return v.filter((e):e is Fame=>!!e&&typeof e==='object'&&/^[A-Z]{3}$/.test((e as Fame).initials)&&Number.isFinite((e as Fame).score)&&typeof (e as Fame).date==='string').slice(0,5);}catch{return [];}}
const order=(lower:boolean)=>(a:Fame,b:Fame)=>lower?a.score-b.score:b.score-a.score;
/** Five-entry device-local table. Strokes games rank fewest first. */
export const qualifies=(fame:Fame[],score:number,lower=false)=>score>0&&(fame.length<5||(lower?score<fame[fame.length-1].score:score>fame[fame.length-1].score));
export function cleanInitials(s:string){return (s.toUpperCase().replace(/[^A-Z]/g,'')+'AAA').slice(0,3);}
export function addFame(fame:Fame[],entry:Fame,lower=false){return [...fame,{...entry,initials:cleanInitials(entry.initials)}].sort(order(lower)).slice(0,5);}
