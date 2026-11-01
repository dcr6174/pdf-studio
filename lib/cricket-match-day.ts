import {evaluateStroke,makeDelivery,type BowledBall,type BowlingStyle,type Difficulty,type Innings,type Length,type ShotSide} from './cricket-engine';
export const cricketTeams=[
 {id:'ind',name:'India',code:'IND',color:'#2584e8',accent:'#ffb64d'},
 {id:'aus',name:'Australia',code:'AUS',color:'#edc44b',accent:'#17694e'},
 {id:'eng',name:'England',code:'ENG',color:'#b43e57',accent:'#e8eaf1'},
 {id:'pak',name:'Pakistan',code:'PAK',color:'#25845c',accent:'#d1ed8a'},
 {id:'nz',name:'New Zealand',code:'NZ',color:'#465364',accent:'#dfe7ed'},
 {id:'sa',name:'South Africa',code:'SA',color:'#178e85',accent:'#edcd59'},
 {id:'sl',name:'Sri Lanka',code:'SL',color:'#4052c7',accent:'#f0b34c'},
 {id:'wi',name:'West Indies',code:'WI',color:'#903d5e',accent:'#f1b749'},
] as const;
export type CricketTeam=typeof cricketTeams[number];
export type BowlingPlan={line:number;length:Length;style:BowlingStyle};
export function cricketRandom(seed:number){let x=seed|0;x=Math.imul(x^(x>>>16),0x45d9f3b);x=Math.imul(x^(x>>>16),0x45d9f3b);return ((x^(x>>>16))>>>0)/4294967296;}
export function cricketToss(seed:number,call:'heads'|'tails'){
 const face=cricketRandom(seed)>.5?'heads':'tails';
 return {face,won:face===call,computerChoice:cricketRandom(seed+91)>.5?'bat':'bowl'} as const;
}
export function cricketSwipe(dx:number,dy:number):ShotSide|null{
 if(Math.max(Math.abs(dx),Math.abs(dy))<24)return null;
 if(Math.abs(dx)>Math.abs(dy)*.65)return dx<0?'leg':'off';
 return dy<0?'straight':null;
}
export function pitchSelection(x:number,y:number):Pick<BowlingPlan,'line'|'length'>{
 x=Number.isFinite(x)?x:.5;y=Number.isFinite(y)?y:.5;
 const line=Math.max(-3,Math.min(3,Math.round((Math.max(0,Math.min(1,x))-.5)*6)));
 const lengths:Length[]=['short','good','full','yorker'];
 return {line,length:lengths[Math.min(3,Math.floor(Math.max(0,Math.min(.999,y))*4))]};
}
export function playerDelivery(index:number,plan:BowlingPlan,difficulty:Difficulty,seed:number):BowledBall{
 const ball=makeDelivery(index,difficulty,seed),speed=plan.style==='spin'?82:plan.style==='swing'?125:142;
 const level=difficulty==='easy'?1.27:difficulty==='pro'?.87:1;
 const contactMs=Math.round((2650-speed*7.2+(plan.style==='spin'?195:0))*level);
 const bounce={short:.47,good:.59,full:.73,yorker:.79}[plan.length];
 return {...ball,line:plan.line,length:plan.length,style:plan.style,speed,contactMs,bounce,releaseMs:Math.round(contactMs*.14),leadMs:Math.round(contactMs*.31),swing:plan.style==='pace'?0:plan.style==='swing'?.16:-.24};
}
export function bowlingOutcome(ball:BowledBall,plan:BowlingPlan,precision:number,difficulty:Difficulty,seed:number,repeated:number){
 precision=Number.isFinite(precision)?precision:0;
 const error=Math.abs(Math.max(0,Math.min(1,precision))-.5);
 const extra:'no-ball'|'wide'|null=error>.46?'no-ball':Math.abs(plan.line)>=3?'wide':null;
 const side:ShotSide=ball.line<0?'leg':ball.line>0?'off':'straight';
 // Better release/variation makes computer timing harder; repeated identical deliveries get read.
 const quality=1-Math.min(1,error/.46),random=cricketRandom(seed+ball.id*137);
 const difficultyHelp=difficulty==='easy'?110:difficulty==='pro'?-60:0;
 const offset=55+quality*245+random*210+difficultyHelp-Math.min(4,repeated)*65;
 const stroke={side,foot:ball.length==='short'?'back' as const:'front' as const,loft:random>.66};
 const result=evaluateStroke(ball,stroke,ball.contactMs+(random>.5?1:-1)*offset,'club');
 return {extra,outcome:result,quality};
}
export function matchVerdict(player:CricketTeam,opponent:CricketTeam,first:Innings,second:Innings,playerBatsFirst:boolean){
 const battingWinner=second.runs>first.runs?'second':second.runs<first.runs?'first':'tie';
 const won=battingWinner!=='tie'&&((battingWinner==='first')===playerBatsFirst);
 const winner=won?player:opponent;
 const margin=battingWinner==='second'?`${second.maxWickets-second.wickets} wickets`:`${first.runs-second.runs} runs`;
 return {won,tied:battingWinner==='tie',message:battingWinner==='tie'?`MATCH TIED · ${first.runs} runs each.`:`${winner.name} win by ${margin}.`,playerRuns:playerBatsFirst?first.runs:second.runs};
}
