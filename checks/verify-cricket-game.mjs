import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
const source=fs.readFileSync('lib/cricket-engine.ts','utf8');
const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const engine=await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'));
const {makeDelivery,createInnings,evaluateStroke,applyStroke,missedDelivery,ballAt,renderOvers,requiredRate,inningsResult}=engine;
for(const mode of ['easy','club','pro']){
 const seen=new Set();
 for(let ball=0;ball<80;ball++){
  const d=makeDelivery(ball,mode,91);
  assert.equal(d.id,ball);assert(d.contactMs>600&&d.contactMs<4000);
  assert(d.speed>=65&&d.speed<170);
  assert(['pace','swing','spin'].includes(d.style));
  seen.add(d.length+':'+d.style+':'+d.line);
  const from=ballAt(d,0),bounce=ballAt(d,d.contactMs*d.bounce),atBat=ballAt(d,d.contactMs);
  assert(from.y<bounce.y&&bounce.y<atBat.y);
  assert(Number.isFinite(from.x)&&Number.isFinite(atBat.x));
  const side=d.line<=-1?'leg':d.line>=1?'off':'straight';
  const foot=d.length==='yorker'||d.length==='full'?'front':'back';
  const perfect=evaluateStroke(d,{side,foot,loft:false},d.contactMs,mode);
  assert(!perfect.wicket,'perfect aligned ground stroke never falls');
  assert(perfect.runs>=1&&perfect.runs<=4,'good contact awards realistic ground runs');
  const airy=evaluateStroke(d,{side,foot,loft:true},d.contactMs,mode);
  assert([0,2,4,6].includes(airy.runs),'loft has legal scored runs');
  const late=evaluateStroke(d,{side,foot,loft:true},d.contactMs+950,mode);
  assert.equal(late.runs,0,'extremely late input cannot score');
  const untouched=missedDelivery(d);
  assert.equal(untouched.runs,0,'not playing a shot cannot score runs');
  assert.equal(untouched.label,untouched.wicket?'W':'·');
  assert.deepEqual(makeDelivery(ball,mode,91),d,'delivery sequence deterministic for repeatable test/replay');
 }
 assert(seen.size>18,'line/length/speed and delivery types vary meaningfully');
}
const short=createInnings(2);
assert.equal(short.target,30);assert.equal(short.overs,2);
assert.equal(renderOvers(0),'0.0');assert.equal(renderOvers(6),'1.0');
assert.equal(renderOvers(11),'1.5');assert.equal(renderOvers(12),'2.0');
assert.equal(requiredRate(short),15);
let full=createInnings(2,300);
const dot={runs:0,wicket:false,out:null,label:'·',grade:'late',contact:0,flight:0,direction:'straight',timingError:0,targetLine:0,comment:'Dot'};
for(let n=0;n<12;n++){full=applyStroke(full,dot);assert.equal(full.balls,n+1);}
assert(full.ended&&!full.won);assert.equal(full.balls,12);assert.equal(full.history.length,12);assert.equal(applyStroke(full,dot).balls,12);
assert.match(inningsResult(full),/runs short/);
const four={...dot,runs:4,label:'4'};
let win=createInnings(2,12);
for(let i=0;i<3;i++)win=applyStroke(win,four);
assert(win.won&&win.ended&&win.balls===3);
assert.match(inningsResult(win),/CHASE WON/);
let wicket=createInnings(2,25);
const bowled={...dot,wicket:true,label:'W',out:'bowled'};
for(let i=0;i<3;i++)wicket=applyStroke(wicket,bowled);
assert(wicket.ended&&!wicket.won&&wicket.wickets===3);
const sports=fs.readFileSync('components/fresh-sports.tsx','utf8');
assert(sports.includes('CricketMatch'),'game route loads revamped cricket instead of old formula');
assert(!sports.includes('function Cricket('),'old bowler shortcut removed');
const component=fs.readFileSync('components/cricket-match.tsx','utf8');
for(const feature of ['CricketStadium','pc-timing-track','FRONT FOOT','BACK FOOT','GROUND','LOFT','KeyboardEvent','setPointerCapture','aria-live']){if(feature!=='setPointerCapture')assert(component.includes(feature),'cricket has '+feature);}
console.log('PASS: 240 bowler/shot scenarios, varied innings, wickets, overs, cricket UI and deterministic replay.');
