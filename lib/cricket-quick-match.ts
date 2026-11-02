import {makeDelivery,type Difficulty,type Innings,type StrokeResult} from './cricket-engine';
export type QuickConfig={team:string;opponent:string;color:string;opponentColor:string;overs:1|2|5;difficulty:Difficulty;order:'first'|'chase';practice:boolean};
export const defaultQuickConfig:QuickConfig={team:'Midnight XI',opponent:'Coastal Kings',color:'#b6ed40',opponentColor:'#ffb56e',overs:2,difficulty:'easy',order:'first',practice:false};
export type QuickBall=StrokeResult&{ball:number;total:number;wickets:number};
export type QuickInnings={player:boolean;runs:number;wickets:number;balls:number;fours:number;sixes:number;dots:number;fifty:number|null;history:QuickBall[]};
export type QuickMatch={id:string;config:QuickConfig;status:'playing'|'interval'|'complete';index:0|1;innings:[QuickInnings,QuickInnings];target:number|null;serial:number;pending:number|null;winner:'player'|'computer'|'tie'|'practice'|null};
const fresh=(player:boolean):QuickInnings=>({player,runs:0,wickets:0,balls:0,fours:0,sixes:0,dots:0,fifty:null,history:[]});
export function newQuickMatch(config:QuickConfig,id=String(Date.now())):QuickMatch{
 const first=config.practice||config.order==='first';return{id,config:{...config,team:config.team.trim().slice(0,24)||'Midnight XI',opponent:config.opponent.trim().slice(0,24)||'Coastal Kings'},status:'playing',index:0,innings:[fresh(first),fresh(!first)],target:null,serial:0,pending:null,winner:null};
}
export const currentQuickInnings=(m:QuickMatch)=>m.innings[m.index];
export function prepareQuickDelivery(m:QuickMatch):QuickMatch{if(m.status!=='playing'||m.pending!==null)return m;return{...m,serial:m.serial+1,pending:m.serial+1};}
export function applyQuickBall(m:QuickMatch,id:number,r:StrokeResult):QuickMatch{
 if(m.status!=='playing'||m.pending!==id)return m;
 if(![0,1,2,3,4,6].includes(r.runs)||r.wicket&&r.runs!==0)throw Error('Invalid legal-ball outcome');
 const previous=currentQuickInnings(m),runs=previous.runs+r.runs,balls=previous.balls+1,wickets=previous.wickets+Number(r.wicket);
 const a:QuickInnings={...previous,runs,balls,wickets,fours:previous.fours+Number(r.runs===4),sixes:previous.sixes+Number(r.runs===6),dots:previous.dots+Number(r.runs===0&&!r.wicket),fifty:previous.fifty??(runs>=50?balls:null),history:[...previous.history,{...r,ball:balls,total:runs,wickets}]};
 const innings:[QuickInnings,QuickInnings]=m.index===0?[a,m.innings[1]]:[m.innings[0],a];
 const next:QuickMatch={...m,innings,pending:null};
 const reached=m.index===1&&runs>=(m.target??Infinity),ended=reached||balls>=m.config.overs*6||wickets>=10;
 if(!ended)return next;
 if(m.config.practice)return{...next,status:'complete',winner:'practice'};
 if(m.index===0)return{...next,status:'interval',target:runs+1};
 const first=innings[0];return{...next,status:'complete',winner:first.runs===a.runs?'tie':(first.runs>a.runs?first:a).player?'player':'computer'};
}
export function beginQuickChase(m:QuickMatch):QuickMatch{return m.status==='interval'?{...m,index:1,status:'playing',pending:null}:m;}
export const quickOvers=(balls:number)=>Math.floor(balls/6)+'.'+balls%6;
export const quickRate=(runs:number,balls:number)=>balls>0?(runs*6/balls).toFixed(2):'0.00';
export const quickStrikeRate=(runs:number,balls:number)=>balls>0?(runs*100/balls).toFixed(1):'0.0';
export function quickRequired(m:QuickMatch){const a=currentQuickInnings(m),balls=Math.max(0,m.config.overs*6-a.balls),runs=Math.max(0,(m.target??0)-a.runs);return{balls,runs,rate:balls?quickRate(runs,balls):runs?'—':'0.00'};}
/** Quick rules intentionally exclude LBW; the legacy chase engine remains available. */
export function quickStroke(r:StrokeResult):StrokeResult{return r.out==='lbw'?{...r,wicket:false,out:null,label:'·',comment:'Beaten by the delivery. No run. This quick match omits LBW.'}:r;}
export function aiQuickOutcome(m:QuickMatch,random=Math.random):StrokeResult{
 const weights=m.config.difficulty==='easy'?[.28,.31,.18,.04,.12,.03,.04]:m.config.difficulty==='club'?[.21,.29,.19,.05,.16,.05,.05]:[.16,.25,.20,.05,.20,.08,.06];
 const values=[0,1,2,3,4,6,'W'] as const;let sum=0,value:typeof values[number]=0;const roll=random();for(let n=0;n<values.length;n++){sum+=weights[n];if(roll<sum){value=values[n];break;}}
 const wicket=value==='W',runs=wicket?0:value as number;const d=makeDelivery(m.serial,m.config.difficulty,43);
 return{runs,wicket,out:wicket?'caught':null,label:wicket?'W':runs?String(runs):'·',grade:'good',contact:.8,flight:runs===6?1:.35,direction:d.line<0?'leg':d.line>0?'off':'straight',comment:wicket?'Caught in the deep!':runs===6?'SIX! Over the rope.':runs===4?'FOUR! Races across the outfield.':runs?runs+' runs added.':'Defended. No run.',timingError:0,targetLine:d.line,impactX:runs>=4?730:490,impactY:230,interceptedBy:wicket?'Deep cover':null};
}
export type CricketRecords={best:number;sixes:number;fours:number;fifty:number|null;wins:number;matches:number;ids:string[];recent:{team:string;opponent:string;score:string;other:string;winner:QuickMatch['winner'];date:string}[]};
export const emptyCricketRecords=():CricketRecords=>({best:0,sixes:0,fours:0,fifty:null,wins:0,matches:0,ids:[],recent:[]});
export function readCricketRecords(raw:string|null):CricketRecords{
 try{const v=JSON.parse(raw??'null');if(!v||typeof v!=='object')return emptyCricketRecords();const r=emptyCricketRecords();for(const k of ['best','sixes','fours','wins','matches'] as const)r[k]=Number.isFinite(v[k])&&v[k]>=0?Math.floor(v[k]):0;r.fifty=Number.isFinite(v.fifty)&&v.fifty>0?Math.floor(v.fifty):null;r.ids=Array.isArray(v.ids)?v.ids.filter((s:unknown)=>typeof s==='string').slice(0,100):[];r.recent=Array.isArray(v.recent)?v.recent.filter((x:unknown)=>x&&typeof x==='object'&&['team','opponent','score','other','date'].every(k=>typeof (x as Record<string,unknown>)[k]==='string')).slice(0,10):[];return r;}catch{return emptyCricketRecords();}
}
export function saveQuickRecord(records:CricketRecords,m:QuickMatch,date=new Date().toISOString()):CricketRecords{
 if(m.status!=='complete'||m.config.practice||records.ids.includes(m.id))return records;
 const a=m.innings.find(i=>i.player)!,b=m.innings.find(i=>!i.player)!;
 return{best:Math.max(records.best,a.runs),sixes:Math.max(records.sixes,a.sixes),fours:Math.max(records.fours,a.fours),fifty:a.fifty===null?records.fifty:Math.min(records.fifty??Infinity,a.fifty),wins:records.wins+Number(m.winner==='player'),matches:records.matches+1,ids:[m.id,...records.ids].slice(0,100),recent:[{team:m.config.team,opponent:m.config.opponent,score:a.runs+'/'+a.wickets,other:b.runs+'/'+b.wickets,winner:m.winner,date},...records.recent].slice(0,10)};
}
/** Adapter retains the established over-history presentation contract. */
export function quickInningsView(m:QuickMatch):Innings{const a=currentQuickInnings(m);return{runs:a.runs,wickets:a.wickets,balls:a.balls,target:m.target??0,overs:m.config.overs,won:m.winner==='player',ended:m.status!=='playing',history:a.history.map(b=>b.label),last:a.history.at(-1)??null};}
