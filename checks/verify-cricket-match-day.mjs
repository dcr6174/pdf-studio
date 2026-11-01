import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
const moduleURL=(file,imports={})=>{let source=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;for(const [key,value] of Object.entries(imports))source=source.replaceAll("from '"+key+"'","from '"+value+"'");return 'data:text/javascript;base64,'+Buffer.from(source).toString('base64');};
const engineURL=moduleURL('lib/cricket-engine.ts'),engine=await import(engineURL);
const match=await import(moduleURL('lib/cricket-match-day.ts',{'./cricket-engine':engineURL}));
const {createInnings,applyStroke,applyExtra,makeDelivery,evaluateStroke,requiredRate}=engine;
const ball=makeDelivery(0),base=evaluateStroke(ball,{side:'straight',foot:'front',loft:false},ball.contactMs);
const dot={...base,runs:0,wicket:false,out:null,label:'·'},one={...dot,runs:1,label:'1'},four={...dot,runs:4,label:'4'},wicket={...dot,wicket:true,out:'bowled',label:'W'};
let first=createInnings(2,null,10);assert.equal(requiredRate(first),0);
for(let i=0;i<9;i++){first=applyStroke(first,wicket);assert(!first.ended);}
first=applyStroke(first,wicket);assert(first.ended&&!first.won&&first.wickets===10);assert.equal(first.batters.filter(b=>b.out).length,10);assert.equal(applyStroke(first,four),first);
let chase=createInnings(2,1,10);chase=applyExtra(chase,'wide');assert(chase.won&&chase.ended&&chase.balls===0&&chase.runs===1);
let rotation=createInnings(2,null,10);rotation=applyStroke(rotation,one);assert.equal(rotation.striker,1);assert.equal(rotation.batters[0].runs,1);
for(let i=0;i<5;i++)rotation=applyStroke(rotation,dot);assert.equal(rotation.striker,0,'over changes strike');assert.equal(rotation.balls,6);
let extras=createInnings(2,null,10);extras=applyExtra(extras,'no-ball',four);assert.equal(extras.runs,5);assert.equal(extras.extras,1);assert.equal(extras.balls,0);assert.equal(extras.batters[0].runs,4);assert(extras.freeHit);
extras=applyExtra(extras,'wide');assert(extras.freeHit&&extras.balls===0&&extras.runs===6,'wide preserves the pending free hit');
extras=applyStroke(extras,wicket);assert.equal(extras.wickets,0,'free hit prevents supported dismissal');assert.equal(extras.balls,1);assert(!extras.freeHit);
extras=applyStroke(extras,wicket);assert.equal(extras.wickets,1,'next legal ball can take a wicket');assert.equal(extras.striker,2);
assert.equal(extras.runs,extras.batters.reduce((n,b)=>n+b.runs,0)+extras.extras,'scorecard reconciles');
let full=createInnings(2,null,10);for(let i=0;i<12;i++){if(i%3===0)full=applyExtra(full,'wide');full=applyStroke(full,one);}assert(full.ended&&full.balls===12&&full.events.length===16&&full.runs===16);
const [player,opponent]=match.cricketTeams;assert.equal(new Set(match.cricketTeams.map(t=>t.id)).size,8);
assert(match.matchVerdict(player,opponent,{...full,runs:12},{...full,runs:11},true).won);
assert(match.matchVerdict(player,opponent,{...full,runs:12},{...full,runs:13,wickets:4},false).message.includes('6 wickets'));
assert(match.matchVerdict(player,opponent,{...full,runs:12},{...full,runs:12},true).tied);
for(let seed=0;seed<100;seed++){const a=match.cricketToss(seed,'heads'),b=match.cricketToss(seed,'tails');assert.notEqual(a.won,b.won);assert.equal(a.face,b.face);}
for(const [x,y,expected] of [[-30,0,'leg'],[30,0,'off'],[0,-30,'straight'],[0,30,null],[5,5,null]])assert.equal(match.cricketSwipe(x,y),expected);
for(const [x,y] of [[0,0],[1,1],[NaN,NaN],[-5,8]]){const p=match.pitchSelection(x,y);assert(p.line>=-3&&p.line<=3);assert(['short','good','full','yorker'].includes(p.length));}
for(const style of ['pace','swing','spin'])for(const length of ['short','good','full','yorker'])for(let line=-3;line<=3;line++){
 const plan={style,length,line},delivery=match.playerDelivery(3,plan,'club',91);
 assert.equal(delivery.style,style);assert.equal(delivery.length,length);assert.equal(delivery.line,line);assert(delivery.releaseMs<delivery.contactMs);
 assert.deepEqual(match.bowlingOutcome(delivery,plan,.5,'club',91,0),match.bowlingOutcome(delivery,plan,.5,'club',91,0));
 assert.equal(match.bowlingOutcome(delivery,plan,0,'club',91,0).extra,'no-ball','no-ball overrides wide');
 assert.equal(match.bowlingOutcome(delivery,plan,.5,'club',91,0).extra,Math.abs(line)===3?'wide':null);
}
console.log('PASS: 11-player/10-wicket innings, legal balls, extras/free hits, strike/scorecard reconciliation, chase/tie/margins, 100 toss seeds, swipes/pitch aiming and 84 bowling plans.');
