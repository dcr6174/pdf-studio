import {applyStroke,createInnings,evaluateStroke,makeDelivery,missedDelivery,type BowledBall,type Difficulty,type Innings,type ShotSide,type StrokeResult} from './cricket-engine';
export type QuickConfig={team:string;opponent:string;color:string;rivalColor:string;overs:1|2|5;difficulty:Difficulty;batFirst:boolean;practice:boolean};
export const defaultQuickConfig:QuickConfig={team:'India',opponent:'Australia',color:'#2886ef',rivalColor:'#edc54b',overs:1,difficulty:'easy',batFirst:true,practice:false};
export type QuickScreen='loading'|'home'|'setup'|'tutorial'|'rules'|'records'|'settings'|'match'|'break'|'result';
export type QuickState={screen:QuickScreen;config:QuickConfig;seed:number;inning:1|2;innings:Innings;first:Innings|null;human:Innings|null;computer:Innings|null;phase:'ready'|'delivery'|'flight'|'result';ball:BowledBall;result:StrokeResult|null;side:ShotSide;loft:boolean;elapsed:number;committed:boolean;serial:number};
export const quickRandom=(seed:number)=>{let x=seed|0;x=Math.imul(x^(x>>>16),0x45d9f3b);x=Math.imul(x^(x>>>16),0x45d9f3b);return((x^(x>>>16))>>>0)/4294967296;};
export const playerBatting=(s:QuickState)=>s.config.practice||((s.inning===1)===s.config.batFirst);
export function freshQuick(screen:QuickScreen='loading'):QuickState{return {screen,config:{...defaultQuickConfig},seed:19,inning:1,innings:createInnings(1,null,10),first:null,human:null,computer:null,phase:'ready',ball:makeDelivery(0,'easy'),result:null,side:'straight',loft:false,elapsed:0,committed:false,serial:0};}
export function startQuick(config:QuickConfig,seed:number):QuickState{return {...freshQuick('match'),config,seed,innings:createInnings(config.overs,null,10),ball:makeDelivery(0,config.difficulty,seed)};}
/** Public quick-match subset: bowled/caught only. Deterministic variation keeps perfect lofts from guaranteeing six. */
export function quickStroke(ball:BowledBall,side:ShotSide,loft:boolean,time:number,difficulty:Difficulty,seed:number):StrokeResult{
 let result=time<0?missedDelivery(ball):evaluateStroke(ball,{side,loft,foot:ball.length==='short'?'back':'front'},time,difficulty);
 if(result.out==='lbw')result={...result,wicket:false,out:null,label:'·',comment:'Defended off the pads. Dot ball.'};
 if(result.runs===6&&quickRandom(seed+ball.id*139)<.28)result={...result,runs:4,flight:.35,label:'4',comment:'FOUR! One bounce over the rope.'};
 if(result.runs===4)result={...result,flight:.35,comment:'FOUR! A grounded shot races over the rope.'};
 const shot=side==='off'?'Cover drive':side==='leg'?'Pull shot':result.runs<=1?'Defensive shot':'Straight drive';
 return {...result,comment:result.wicket?result.comment:result.contact===0?'Missed. Watch the ball reach the bat.':shot+'. '+result.comment};
}
export function computerStroke(s:QuickState):StrokeResult{
 const r=quickRandom(s.seed+s.innings.balls*1709+s.inning*77),level=s.config.difficulty;
 const side:ShotSide=s.ball.line<0?'leg':s.ball.line>0?'off':'straight';
 const offset=(level==='easy'?230:level==='pro'?70:155)+r*(level==='easy'?430:level==='pro'?240:350);
 return quickStroke(s.ball,side,r>.57,s.ball.contactMs+(r>.5?offset:-offset),level,s.seed+51);
}
export function quickStats(i:Innings){const ballsLeft=Math.max(0,i.overs*6-i.balls),need=i.target===null?0:Math.max(0,i.target-i.runs);return {ballsLeft,need,runRate:i.balls?i.runs*6/i.balls:0,required:ballsLeft?need*6/ballsLeft:0,strikeRate:i.balls?i.runs*100/i.balls:0,fours:i.history.filter(x=>x==='4').length,sixes:i.history.filter(x=>x==='6').length,dots:i.history.filter(x=>x==='·').length};}
export function quickVerdict(s:QuickState){const h=s.human,c=s.computer;if(!h||(!c&&!s.config.practice))return null;if(s.config.practice)return {won:false,tied:false,message:'Practice complete',winner:s.config.team};const tied=h.runs===c!.runs,won=h.runs>c!.runs;return {won,tied,message:tied?'MATCH TIED':(won?s.config.team:s.config.opponent)+' WIN',winner:tied?'Honours even':won?s.config.team:s.config.opponent};}
export type QuickAction={type:'screen';screen:QuickScreen}|{type:'start';config:QuickConfig;seed:number}|{type:'next'}|{type:'aim';side:ShotSide}|{type:'loft';value:boolean}|{type:'swing';time:number}|{type:'cpu'}|{type:'commit'}|{type:'chase'};
export function quickReducer(s:QuickState,a:QuickAction):QuickState{
 if(a.type==='screen')return {...s,screen:a.screen};
 if(a.type==='start')return startQuick(a.config,a.seed);
 if(a.type==='chase'){if(s.screen!=='break'||!s.first)return s;return {...s,screen:'match',inning:2,innings:createInnings(s.config.overs,s.first.runs+1,10),phase:'ready',result:null,elapsed:0,committed:false};}
 if(s.screen!=='match'||s.innings.ended)return s;
 if(a.type==='aim')return {...s,side:a.side};
 if(a.type==='loft')return {...s,loft:a.value};
 if(a.type==='next'){if(s.phase!=='ready'&&s.phase!=='result')return s;return {...s,phase:'delivery',ball:makeDelivery(s.innings.balls,s.config.difficulty,s.seed+s.inning*17),result:null,elapsed:0,committed:false,serial:s.serial+1};}
 if(a.type==='swing'||a.type==='cpu'){if(s.phase!=='delivery'||s.committed)return s;const result=a.type==='cpu'?computerStroke(s):quickStroke(s.ball,s.side,s.loft,a.time,s.config.difficulty,s.seed);return {...s,phase:'flight',result,committed:true};}
 if(a.type==='commit'){if(s.phase!=='flight'||!s.result)return s;const innings=applyStroke(s.innings,s.result),human=playerBatting(s)?innings:s.human,computer=playerBatting(s)?s.computer:innings;
  if(innings.ended)return {...s,innings,human,computer,phase:'result',screen:s.config.practice||s.inning===2?'result':'break',first:s.inning===1?innings:s.first};
  return {...s,innings,human,computer,phase:'result'};
 }
 return s;
}
export type QuickSettings={music:number;sfx:number;muted:boolean;reduced:boolean;quality:'auto'|'low'|'high';vibration:boolean};
export const defaultQuickSettings:QuickSettings={music:.22,sfx:.7,muted:false,reduced:false,quality:'auto',vibration:false};
export type QuickRecord={id:string;date:string;team:string;opponent:string;score:number;wickets:number;balls:number;opponentScore:number;fours:number;sixes:number;fifty:number|null;won:boolean;tied:boolean};
export type QuickRecords={best:number;fours:number;sixes:number;fastestFifty:number|null;wins:number;recent:QuickRecord[]};
export const emptyQuickRecords=():QuickRecords=>({best:0,fours:0,sixes:0,fastestFifty:null,wins:0,recent:[]});
export const SETTINGS_KEY='studio-cricket:settings:v2',RECORDS_KEY='studio-cricket:records:v2';
const number=(v:unknown,fallback=0)=>typeof v==='number'&&Number.isFinite(v)&&v>=0?v:fallback;
export function parseQuickSettings(raw:string|null):QuickSettings{try{const x=JSON.parse(raw??'null');if(!x||typeof x!=='object')return {...defaultQuickSettings};return {music:Math.min(1,number(x.music,.22)),sfx:Math.min(1,number(x.sfx,.7)),muted:x.muted===true,reduced:x.reduced===true,vibration:x.vibration===true,quality:['auto','low','high'].includes(x.quality)?x.quality:'auto'};}catch{return {...defaultQuickSettings};}}
export function parseQuickRecords(raw:string|null):QuickRecords{try{const x=JSON.parse(raw??'null');if(!x||typeof x!=='object')return emptyQuickRecords();const recent=Array.isArray(x.recent)?x.recent.filter((r:QuickRecord)=>r&&typeof r.id==='string'&&typeof r.team==='string'&&typeof r.opponent==='string'&&typeof r.date==='string'&&Number.isFinite(r.score)&&Number.isFinite(r.balls)&&r.balls>0).slice(0,12):[];return {best:number(x.best),fours:number(x.fours),sixes:number(x.sixes),fastestFifty:x.fastestFifty===null?null:number(x.fastestFifty)||null,wins:number(x.wins),recent};}catch{return emptyQuickRecords();}}
export function recordQuick(records:QuickRecords,s:QuickState,id:string,date:string):QuickRecords{if(s.screen!=='result'||s.config.practice||!s.human||!s.computer||records.recent.some(r=>r.id===id))return records;const h=s.human,stats=quickStats(h),v=quickVerdict(s)!;let total=0,fifty:number|null=null;for(let i=0;i<h.events.length;i++){total+=h.events[i].runs;if(total>=50){fifty=i+1;break;}}const r:QuickRecord={id,date,team:s.config.team,opponent:s.config.opponent,score:h.runs,wickets:h.wickets,balls:h.balls,opponentScore:s.computer.runs,fours:stats.fours,sixes:stats.sixes,fifty,won:v.won,tied:v.tied};return {best:Math.max(records.best,h.runs),fours:Math.max(records.fours,stats.fours),sixes:Math.max(records.sixes,stats.sixes),fastestFifty:fifty===null?records.fastestFifty:Math.min(records.fastestFifty??Infinity,fifty),wins:records.wins+Number(v.won),recent:[r,...records.recent].slice(0,12)};}
