import assert from 'node:assert/strict';
import {build} from 'vite';
await build({configFile:false,logLevel:'error',build:{ssr:'lib/cricket-quick-match.ts',outDir:'.cricket-quick-check',emptyOutDir:true,rollupOptions:{output:{entryFileNames:'quick.mjs'}}}});
const q=await import('../.cricket-quick-check/quick.mjs');
const r=(runs=0,wicket=false)=>({runs,wicket,out:wicket?'bowled':null,label:wicket?'W':runs?String(runs):'·',grade:'good',contact:1,flight:.3,direction:'straight',comment:'Test legal delivery',timingError:0,targetLine:0,impactX:500,impactY:250,interceptedBy:null});
function ball(m,runs=0,wicket=false){const p=q.prepareQuickDelivery(m);return q.applyQuickBall(p,p.pending,r(runs,wicket));}
for(const order of ['first','chase'])for(const overs of [1,2,5]){
 let m=q.newQuickMatch({...q.defaultQuickConfig,overs,order},order+overs);
 while(m.status==='playing')m=ball(m,1);
 assert.equal(m.status,'interval');assert.equal(m.target,overs*6+1);assert.equal(m.innings[0].balls,overs*6);
 m=q.beginQuickChase(m);while(m.status==='playing')m=ball(m,2);
 assert.equal(m.status,'complete');assert.equal(m.winner,order==='chase'?'player':'computer');assert(m.innings[1].balls<=overs*6);assert(m.innings[1].runs>=m.target);
 assert.strictEqual(q.prepareQuickDelivery(m),m);assert.strictEqual(q.applyQuickBall(m,999,r(6)),m);
}
let m=q.newQuickMatch({...q.defaultQuickConfig,overs:5});
for(let n=0;n<9;n++)m=ball(m,0,true);assert.equal(m.status,'playing');assert.equal(m.innings[0].wickets,9);m=ball(m,0,true);assert.equal(m.status,'interval');assert.equal(m.innings[0].wickets,10);assert.equal(m.target,1);m=q.beginQuickChase(m);m=ball(m,1);assert.equal(m.status,'complete');assert.equal(m.innings[1].balls,1);
for(const order of ['first','chase']){let tie=q.newQuickMatch({...q.defaultQuickConfig,overs:1,order});for(let n=0;n<6;n++)tie=ball(tie,1);tie=q.beginQuickChase(tie);for(let n=0;n<6;n++)tie=ball(tie,1);assert.equal(tie.winner,'tie');assert.equal(tie.status,'complete');}
let p=q.prepareQuickDelivery(q.newQuickMatch(q.defaultQuickConfig));assert.strictEqual(q.prepareQuickDelivery(p),p);const scored=q.applyQuickBall(p,p.pending,r(4));assert.strictEqual(q.applyQuickBall(scored,p.pending,r(4)),scored);assert.equal(scored.innings[0].runs,4);assert.equal(scored.innings[0].fours,1);
assert.equal(q.quickOvers(5),'0.5');assert.equal(q.quickOvers(6),'1.0');assert.equal(q.quickOvers(30),'5.0');assert.equal(q.quickRate(0,0),'0.00');assert.equal(q.quickStrikeRate(0,0),'0.0');assert.equal(q.quickRequired({...scored,target:20,innings:[{...scored.innings[0],balls:12},scored.innings[1]]}).rate,'—');
let practice=q.newQuickMatch({...q.defaultQuickConfig,practice:true,overs:1});for(let n=0;n<6;n++)practice=ball(practice,6);assert.equal(practice.winner,'practice');assert.deepEqual(q.saveQuickRecord(q.emptyCricketRecords(),practice),q.emptyCricketRecords());
let fifty=q.newQuickMatch({...q.defaultQuickConfig,overs:2,order:'chase'},'fifty');for(let n=0;n<12;n++)fifty=ball(fifty,6);fifty=q.beginQuickChase(fifty);for(let n=0;n<12;n++)fifty=ball(fifty,6);assert.equal(fifty.innings[1].fifty,9);let rec=q.saveQuickRecord(q.emptyCricketRecords(),fifty);assert.equal(rec.fifty,9);assert.equal(rec.matches,1);assert.deepEqual(q.saveQuickRecord(rec,fifty),rec);assert.deepEqual(q.readCricketRecords('{bad json'),q.emptyCricketRecords());assert.equal(q.readCricketRecords('{"best":-10,"wins":"oops"}').best,0);
const timingErrors=[];
for(const difficulty of ['easy','club','pro']){
 let error=0;const outcomes=new Set();
 for(let n=0;n<1000;n++){
  const game=q.prepareQuickDelivery(q.newQuickMatch({...q.defaultQuickConfig,difficulty}));
  // Exercise the actual public delivery generator separately from the AI.
  const delivery={id:n,speed:110+(n%35),line:n%5-2,length:['full','short','good'][n%3],style:'pace',bounce:.65,swing:0,releaseMs:200,contactMs:1500,leadMs:500};
  const o=q.aiQuickOutcome(game,delivery,n+137);assert.deepEqual(q.aiQuickOutcome(game,delivery,n+137),o,'skip/animation speed cannot reroll the result');
  assert([0,1,2,3,4,6].includes(o.runs));assert(!o.wicket||o.runs===0);assert.notEqual(o.out,'lbw');
  assert.equal(o.targetLine,delivery.line,'AI uses the displayed delivery rather than a fabricated ball');
  for(const k of ['timingError','impactX','impactY','flight'])assert(Number.isFinite(o[k]));
  outcomes.add(o.label);error+=Math.abs(o.timingError);
 }
 assert(outcomes.size>2,'AI produces varied legal results');timingErrors.push(error/1000);
}
assert(timingErrors[0]>timingErrors[1]&&timingErrors[1]>timingErrors[2],'higher difficulty improves computer timing');

assert.equal(q.quickStroke({...r(0,true),out:'lbw'}).wicket,false);
console.log('PASS: both batting orders at 1/2/5 overs, ten-wicket innings, immediate chase, ties, six-ball overs, duplicate delivery/scoring rejection, finite rates, practice exclusion, fifty/records persistence and 3,000 valid AI outcomes.');
