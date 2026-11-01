/**
 * Original Play Studio arcade-cricket rules.
 *
 * Accessibility goal: two directional inputs are enough to start batting;
 * direction, footwork, loft and shot placement add optional mastery.
 * No artwork, commentary, rule implementations or assets from third parties.
 */
export type ShotSide='leg'|'straight'|'off';
export type Footwork='front'|'back';
export type Stroke={side:ShotSide;foot:Footwork;loft:boolean};
export type Length='yorker'|'full'|'good'|'short';
export type BowlingStyle='pace'|'swing'|'spin';
export type Difficulty='easy'|'club'|'pro';
export type BowledBall={
 id:number;speed:number;line:number;length:Length;style:BowlingStyle;
 bounce:number;swing:number;releaseMs:number;contactMs:number;leadMs:number;extra?:'wide'|'no-ball';
};
export type StrokeResult={
 runs:number;wicket:boolean;out:'bowled'|'caught'|'lbw'|null;
 label:string;grade:'perfect'|'good'|'late'|'miss'|'edge';
 contact:number; flight:number; direction:ShotSide;
 comment:string; timingError:number; targetLine:number;
 impactX:number;impactY:number;interceptedBy:string|null;
};
export type BatterRecord={runs:number;balls:number;fours:number;sixes:number;out:boolean};
export type CricketEvent={ball:number;type:'ball'|'wide'|'no-ball';runs:number;batRuns:number;wicket:boolean;label:string;direction:ShotSide;impactX:number;impactY:number};
export type Innings={
 runs:number;wickets:number;balls:number;target:number|null;overs:number;
 maxWickets:number;extras:number;wides:number;noBalls:number;freeHit:boolean;
 striker:number;nonStriker:number;nextBatter:number;batters:readonly BatterRecord[];events:readonly CricketEvent[];
 won:boolean;ended:boolean;history:readonly string[];last:StrokeResult|null;
};
const lengths:Length[]=['yorker','full','good','short'];
const styles:BowlingStyle[]=['pace','swing','spin'];
const sideOffset:Record<ShotSide,number>={leg:-1,straight:0,off:1};
/** All pitch rendering and judgement use the SAME instant of bat contact. */
export const CRICKET_CONTACT_Y=465;
export const CRICKET_PERFECT_MS=100;
export const cricketFielders=[
 {x:85,y:268,name:'Deep square'},{x:157,y:379,name:'Square leg'},{x:243,y:178,name:'Midwicket'},
 {x:460,y:162,name:'Mid off'},{x:573,y:371,name:'Cover'},{x:668,y:248,name:'Deep point'},{x:378,y:82,name:'Long off'}, {x:453,y:430,name:'Slip'}, {x:227,y:452,name:'Fine leg'}
] as const;
const clamp=(v:number,min:number,max:number)=>Math.min(max,Math.max(min,v));
function hash(n:number){let x=n|0;x^=x>>>16;x=Math.imul(x,0x7feb352d);x^=x>>>15;x=Math.imul(x,0x846ca68b);return(x^(x>>>16))>>>0;}
export function makeDelivery(index:number,difficulty:Difficulty='club',seed=19):BowledBall{
 const n=Math.max(0,Math.floor(index)),h=hash(n*1297+seed*811),t=hash(n*2459+seed*619);
 const style=styles[(h>>>4)%3],length=lengths[(h>>>9)%4];
 const line=((h>>>16)%5)-2;
 const speed=style==='spin'?74+(t%20):style==='swing'?114+(t%24):125+(t%24);
 const level=difficulty==='easy'?1.27:difficulty==='pro'?.87:1;
 const contactMs=Math.round((2650-speed*7.2+(style==='spin'?195:0))*level);
 const bounce=length==='yorker'?.79:length==='full'?.73:length==='good'?.59:.47;
 const swing=style==='spin'?(((t>>>8)%5)-2)*.12:(((t>>>6)%5)-2)*.08;
 return{id:n,speed,line,length,style,bounce,swing,releaseMs:Math.round(contactMs*.14),contactMs,
  leadMs:Math.max(500,Math.round(contactMs*.31))};
}
export const inningsTarget=(overs:number)=>overs===2?30:overs===5?77:overs===10?158:Math.ceil(Math.max(1,overs)*15);
export function createInnings(overs=2,target:number|null=inningsTarget(overs),maxWickets=3):Innings{
 const bounded=clamp(Math.floor(overs),1,10);
 return{runs:0,wickets:0,balls:0,target:target===null?null:Math.max(1,Math.floor(target)),overs:bounded,
 maxWickets:clamp(Math.floor(maxWickets),1,10),extras:0,wides:0,noBalls:0,freeHit:false,striker:0,nonStriker:1,nextBatter:2,batters:Array.from({length:11},()=>({runs:0,balls:0,fours:0,sixes:0,out:false})),events:[],won:false,ended:false,history:[],last:null};
}
export function renderOvers(balls:number):string{return Math.floor(balls/6)+'.'+(balls%6);}
export function requiredRate(innings:Innings):number{
 const remaining=innings.overs*6-innings.balls;
 return remaining<=0||innings.target===null?0:Math.max(0,innings.target-innings.runs)*6/remaining;
}
export function ballAt(delivery:BowledBall,elapsedMs:number){
 const p=clamp(elapsedMs/delivery.contactMs,0,1);
 // Camera is behind the striker; ball grows as it approaches from the bowler.
 const sway=Math.sin(p*Math.PI)*(delivery.swing*36);
 const x=360+delivery.line*37*(.3+.7*p)+sway;
 const y=56+(CRICKET_CONTACT_Y-56)*p;
 const bounceP=delivery.bounce;
 const z=p<bounceP?(1-p/bounceP)*28:Math.sin((p-bounceP)/(1-bounceP)*Math.PI)*19;
 return{x,y,z,p,bounced:p>=bounceP};
}
/** Shot landing and fielder interception share the positions drawn on the pitch. */
export function cricketShotLanding(delivery:BowledBall,stroke:Stroke,quality:number){
 const salt=hash(delivery.id*13+delivery.speed*7+stroke.side.length*31);
 const lane=sideOffset[stroke.side];
 const long=quality>=3?1:quality>=2?.78:quality>=1?.52:.3;
 const sideways=lane*(170+long*167);
 const noise=((salt%101)-50)*.72;
 const x=clamp(380+sideways+noise,12,748);
 const y=clamp(363-(stroke.loft?160:112)*long+(((salt>>>9)%73)-36),28,485);
 const fielder=cricketFielders.find(f=>Math.hypot(f.x-x,f.y-y)<(stroke.loft?40:26))??null;
 const boundary=Math.pow((x-380)/350,2)+Math.pow((y-363)/162,2)>=1;
 return{x,y,interceptedBy:fielder?.name??null,boundary};
}
export function evaluateStroke(
 delivery:BowledBall,stroke:Stroke,contactElapsedMs:number,difficulty:Difficulty='club'
):StrokeResult{
 const error=Math.round(contactElapsedMs-delivery.contactMs),delta=Math.abs(error);
 const window=difficulty==='easy'?550:difficulty==='pro'?360:445;
 const intended=delivery.line<=-1?'leg':delivery.line>=1?'off':'straight';
 const align=Math.abs(sideOffset[stroke.side]-sideOffset[intended]);
 const frontPreferred=delivery.length==='yorker'||delivery.length==='full';
 const backPreferred=delivery.length==='short';
 const footMismatch=(frontPreferred&&stroke.foot!=='front')||(backPreferred&&stroke.foot!=='back');
 const timingQuality=delta<CRICKET_PERFECT_MS?3:delta<220?2:delta<window?1:0;
 const quality=timingQuality-(footMismatch?1:0)-align;
 const salt=hash(delivery.id*13+delivery.speed*7+stroke.side.length*31);
 const targetLine=clamp(delivery.line+delivery.swing*2,-2.5,2.5);
 const landing=cricketShotLanding(delivery,stroke,quality);
 const tag=stroke.side==='leg'?'leg side':stroke.side==='off'?'off side':'straight';
 const result=(runs:number,out:StrokeResult['out'],grade:StrokeResult['grade'],comment:string):StrokeResult=>({
  runs,wicket:out!==null,out,grade,comment,direction:stroke.side,timingError:error,
  label:out?'W':runs===0?'·':String(runs),contact:timingQuality/3,
  flight:stroke.loft?1:.35,targetLine,impactX:landing.x,impactY:landing.y,interceptedBy:landing.interceptedBy
 });
 if(delta>window+260||quality<=-1){
  const bowled=(delivery.line===0||delivery.length==='yorker')&&(salt%5!==0);
  const out=bowled?'bowled':delivery.line===0?'lbw':null;
  return result(0,out,'miss',bowled?'BOWLED! The ball beat the bat.':out?'LBW! The ball struck the pads.':'Beaten by the delivery. Dot ball.');
 }
 if(timingQuality===0||quality===0){
  const out=stroke.loft&&landing.interceptedBy?'caught':null;
  const advice=delta>=220?(error<0?'Too early — wait until the ball reaches the bat.':'Late contact. No run.'):
   footMismatch?'Good timing, wrong footwork for this length. Try automatic footwork.':'Good timing, but the shot direction missed the gap. No run.';
  return result(0,out,out?'edge':'late',out?'Top edge taken by '+landing.interceptedBy+'.':advice);
 }
 if(stroke.loft){
  if(landing.interceptedBy&&quality<=2)return result(0,'caught','edge','Caught by '+landing.interceptedBy+'! The high shot was within reach.');
  if(quality<=1)return result(2,null,'late','Top edge drops short of the boundary. Two runs.');
  if(landing.boundary&&quality>=3)return result(6,null,'perfect','SIX! Cleared the boundary over '+tag+'!');
  if(landing.boundary)return result(4,null,'good','FOUR! The lofted ball clears the rope after bouncing.');
  return result(2,null,'good','Lifted into a gap. Two runs.');
 }
 if(landing.boundary&&quality>=2)return result(4,null,quality>=3?'perfect':'good','FOUR! Along the ground through the '+tag+' gap.');
 if(quality>=3)return result(3,null,'perfect','Excellent placement. Three hard-run runs.');
 if(quality>=2)return result(2,null,'good','Placed beyond the infield for two.');
 return result(1,null,'late','A controlled nudge earns a single.');
}
export function missedDelivery(delivery:BowledBall):StrokeResult{
 const hitsStumps=Math.abs(delivery.line+delivery.swing)<1.15;
 return{runs:0,wicket:hitsStumps,out:hitsStumps?'bowled':null,label:hitsStumps?'W':'·',
  grade:'miss',contact:0,flight:0,direction:'straight',timingError:950,targetLine:delivery.line,
  comment:hitsStumps?'BOWLED! You let the ball hit middle stump.':'Beaten outside off stump. Dot ball. Watch the ball right to the bat.',
  impactX:ballAt(delivery,delivery.contactMs).x,impactY:CRICKET_CONTACT_Y,interceptedBy:null};
}
/** Apply one legal delivery. Free hits suppress the dismissals supported by this arcade engine. */
export function applyStroke(innings:Innings,outcome:StrokeResult):Innings{
 if(innings.ended)return innings;
 const effective=innings.freeHit&&outcome.wicket?{...outcome,wicket:false,out:null,label:'·',comment:'Free hit. No dismissal; dot ball.'}:outcome;
 const balls=innings.balls+1,runs=innings.runs+effective.runs,wickets=innings.wickets+Number(effective.wicket);
 const won=innings.target!==null&&runs>=innings.target;
 const ended=won||balls>=innings.overs*6||wickets>=innings.maxWickets;
 const batters=innings.batters.map(b=>({...b}));
 const batter=batters[innings.striker];batter.balls++;batter.runs+=effective.runs;batter.fours+=Number(effective.runs===4);batter.sixes+=Number(effective.runs===6);batter.out=effective.wicket;
 let striker=innings.striker,nonStriker=innings.nonStriker,nextBatter=innings.nextBatter;
 if(effective.wicket&&!ended){striker=nextBatter;nextBatter++;}
 if(effective.runs%2===1)[striker,nonStriker]=[nonStriker,striker];
 if(balls%6===0)[striker,nonStriker]=[nonStriker,striker];
 const event:CricketEvent={ball:balls,type:'ball',runs:effective.runs,batRuns:effective.runs,wicket:effective.wicket,label:effective.label,direction:effective.direction,impactX:effective.impactX,impactY:effective.impactY};
 return{...innings,runs,balls,wickets,won,ended,freeHit:false,striker,nonStriker,nextBatter,batters,last:effective,history:[...innings.history,effective.label],events:[...innings.events,event]};
}
/** Wides/no-balls score one extra and never consume a legal ball. A no-ball grants a free hit. */
export function applyExtra(innings:Innings,type:'wide'|'no-ball',batOutcome?:StrokeResult):Innings{
 if(innings.ended)return innings;
 const batRuns=type==='no-ball'?batOutcome?.runs??0:0,runs=innings.runs+1+batRuns,won=innings.target!==null&&runs>=innings.target;
 const batters=innings.batters.map(b=>({...b}));
 if(type==='no-ball'){const b=batters[innings.striker];b.balls++;b.runs+=batRuns;b.fours+=Number(batRuns===4);b.sixes+=Number(batRuns===6);}
 let striker=innings.striker,nonStriker=innings.nonStriker;if(batRuns%2)[striker,nonStriker]=[nonStriker,striker];
 const event:CricketEvent={ball:innings.balls,type,runs:1+batRuns,batRuns,wicket:false,label:type==='wide'?'Wd':'Nb'+(batRuns?'+'+batRuns:''),direction:batOutcome?.direction??'straight',impactX:batOutcome?.impactX??380,impactY:batOutcome?.impactY??465};
 const last=batOutcome?{...batOutcome,wicket:false,out:null,label:event.label}:innings.last;
 return{...innings,runs,extras:innings.extras+1,wides:innings.wides+Number(type==='wide'),noBalls:innings.noBalls+Number(type==='no-ball'),freeHit:innings.freeHit||type==='no-ball',won,ended:won,batters,striker,nonStriker,last,events:[...innings.events,event]};
}
export function inningsResult(innings:Innings):string{
 const summary=innings.runs+'/'+innings.wickets+' in '+renderOvers(innings.balls)+' overs';
 if(innings.target===null)return 'INNINGS COMPLETE: '+summary+'.';
 return innings.won?'CHASE WON! '+summary+'. Target '+innings.target+' reached.':
 'Innings complete: '+summary+'. Target '+innings.target+'. '+Math.max(0,innings.target-innings.runs)+' runs short.';
}
