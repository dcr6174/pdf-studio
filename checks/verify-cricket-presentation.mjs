import assert from 'node:assert/strict';
import {build} from 'vite';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';

await build({configFile:false,logLevel:'error',resolve:{alias:{'@':process.cwd()}},build:{ssr:true,outDir:'.cricket-presentation-check',emptyOutDir:true,rollupOptions:{input:{engine:resolve('lib/cricket-engine.ts'),presentation:resolve('lib/cricket-presentation.ts')},output:{entryFileNames:'[name].mjs'}}}});
const engine=await import(pathToFileURL(resolve('.cricket-presentation-check/engine.mjs')).href);
const view=await import(pathToFileURL(resolve('.cricket-presentation-check/presentation.mjs')).href);
const {makeDelivery,evaluateStroke,createInnings,applyStroke}=engine;
const {cricketTimingFeedback,cricketOverHistory,cricketBallWorld,cricketShotWorld,cricketFieldWorld}=view;
for(const difficulty of ['easy','club','pro'])for(let i=0;i<80;i++){
 const ball=makeDelivery(i,difficulty,91);
 const side=ball.line<0?'leg':ball.line>0?'off':'straight';
 const foot=ball.length==='short'?'back':'front';
 for(const error of [-250,-150,0,150,250]){
  const result=evaluateStroke(ball,{side,foot,loft:false},ball.contactMs+error,difficulty);
  const timing=cricketTimingFeedback(result);
  assert.equal(timing.label,error===0?'Perfect':Math.abs(error)<220?'Good':error<0?'Early':'Late');
 }
 const release=cricketBallWorld(ball,0),bounce=cricketBallWorld(ball,ball.contactMs*ball.bounce),contact=cricketBallWorld(ball,ball.contactMs);
 assert(release.z>bounce.z&&bounce.z>contact.z);
 assert.equal(contact.z,-10.5);assert(Math.abs(bounce.y-.16)<1e-9);
 const shot=evaluateStroke(ball,{side,foot,loft:true},ball.contactMs,difficulty);
 const first=cricketShotWorld(ball,shot,0);
 assert(Math.hypot(first.x-contact.x,first.y-contact.y,first.z-contact.z)<1e-9,'outgoing flight starts at the judged contact point');
 for(const p of [0,.25,.5,.75,1])assert(Object.values(cricketShotWorld(ball,shot,p)).every(Number.isFinite));
 if(!shot.wicket&&shot.runs>0){const end=cricketShotWorld(ball,shot,1),landing=cricketFieldWorld(shot.impactX,shot.impactY);assert(Math.abs(end.x-landing.x)<1e-9);assert(Math.abs(end.z-landing.z)<1e-9);}
}
// Reproduce the live -417 ms early shot previously labelled LATE.
const short={...makeDelivery(0),line:1,length:'short'};
const early=evaluateStroke(short,{side:'off',foot:'front',loft:false},short.contactMs-417);
assert.equal(cricketTimingFeedback(early).label,'Early');assert.match(early.comment,/early/i);
const wrongFoot=evaluateStroke(short,{side:'off',foot:'front',loft:false},short.contactMs-150);
assert.equal(cricketTimingFeedback(wrongFoot).label,'Good');assert.doesNotMatch(wrongFoot.comment,/late contact|too early/i);
let innings=createInnings(2,100);
for(let i=0;i<6;i++)innings=applyStroke(innings,{...early,runs:1,label:'1',wicket:false,out:null});
assert.deepEqual(cricketOverHistory(innings),['1','1','1','1','1','1']);
assert.deepEqual(cricketOverHistory(innings,true),['—','—','—','—','—','—']);
innings=applyStroke(innings,{...early,runs:4,label:'4',wicket:false,out:null});
assert.deepEqual(cricketOverHistory(innings),['4','—','—','—','—','—']);
console.log('PASS: 1,200 signed timing outcomes, 240 synchronized 3D trajectories, early-shot regression and complete-over history.');
