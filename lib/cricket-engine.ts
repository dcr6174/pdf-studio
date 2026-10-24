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
 bounce:number;swing:number;releaseMs:number;contactMs:number;leadMs:number;
};
export type StrokeResult={
 runs:number;wicket:boolean;out:'bowled'|'caught'|'lbw'|null;
 label:string;grade:'perfect'|'good'|'late'|'miss'|'edge';
 contact:number; flight:number; direction:ShotSide;
 comment:string; timingError:number; targetLine:number;
 impactX:number;impactY:number;interceptedBy:string|null;
};
export type Innings={
 runs:number;wickets:number;balls:number;target:number;overs:number;
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
 {x:460,y:162,name:'Mid off'},{x:573,y:371,name:'Cover'},{x:668,y:248,name:'Deep point'},{x:378,y:82,name:'Long off'}
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
export function createInnings(overs=2,target=inningsTarget(overs)):Innings{
 const bounded=clamp(Math.floor(overs),1,10);
 return{runs:0,wickets:0,balls:0,target:Math.max(1,Math.floor(target)),overs:bounded,won:false,ended:false,history:[],last:null};
}
export function renderOvers(balls:number):string{return Math.floor(balls/6)+'.'+(balls%6);}
export function requiredRate(innings:Innings):number{
 const remaining=innings.overs*6-innings.balls;
 return remaining<=0?0:Math.max(0,innings.target-innings.runs)*6/remaining;
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
  return result(0,out,out?'edge':'late',out?'Top edge taken by '+landing.interceptedBy+'.':error<0?'Too early — wait until the ball reaches the bat.':'Late contact. No run.');
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
export function applyStroke(innings:Innings,outcome:StrokeResult):Innings{
 if(innings.ended)return innings;
 const balls=innings.balls+1,runs=innings.runs+outcome.runs,wickets=innings.wickets+Number(outcome.wicket);
 const won=runs>=innings.target;
 const ended=won||balls>=innings.overs*6||wickets>=3;
 return{...innings,runs,balls,wickets,won,ended,last:outcome,history:[...innings.history,outcome.label]};
}
export function inningsResult(innings:Innings):string{
 const summary=innings.runs+'/'+innings.wickets+' in '+renderOvers(innings.balls)+' overs';
 return innings.won?'CHASE WON! '+summary+'. Target '+innings.target+' reached.':
 'Innings complete: '+summary+'. Target '+innings.target+'. '+Math.max(0,innings.target-innings.runs)+' runs short.';
}
