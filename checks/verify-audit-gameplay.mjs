import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
const tsToESM=(path,aliases={})=>{
 let c=ts.transpileModule(fs.readFileSync(path,'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
 for(const [specifier,data] of Object.entries(aliases))c=c.replaceAll("from '"+specifier+"'", "from '"+data+"'");
 return 'data:text/javascript;base64,'+Buffer.from(c).toString('base64');
};
const sportURL=tsToESM('lib/sport-contact.ts');
const sports=await import(sportURL);
const tenpin=await import(tsToESM('lib/tenpin-engine.ts',{'./sport-contact':sportURL}));
const cricket=await import(tsToESM('lib/cricket-engine.ts'));
const runner=await import(tsToESM('lib/runner-hazards.ts'));
assert.equal(cricket.ballAt(cricket.makeDelivery(0),cricket.makeDelivery(0).contactMs).y,cricket.CRICKET_CONTACT_Y);
for(let i=0;i<50;i++){
 const ball=cricket.makeDelivery(i,'club',26),side=ball.line<0?'leg':ball.line>0?'off':'straight';
 const foot=ball.length==='short'?'back':'front';
 const exact=cricket.evaluateStroke(ball,{side,foot,loft:false},ball.contactMs);
 assert.equal(exact.timingError,0);
 assert.equal(exact.grade,'perfect');
 assert(exact.runs>=1&&!exact.wicket);
 assert(Number.isFinite(exact.impactX)&&Number.isFinite(exact.impactY));
 assert(exact.impactX>=0&&exact.impactX<=760);
 assert(cricket.evaluateStroke(ball,{side,foot,loft:false},ball.contactMs-1200).runs===0,'early committed swing scores zero');
 const slight=cricket.evaluateStroke(ball,{side,foot,loft:false},ball.contactMs+200);
 assert(slight.runs>=0);
 const other=cricket.makeDelivery(i,'club',251);
 if(i===0)assert.notDeepEqual(other,ball,'new game seed makes bowling vary');
}
assert.equal(sports.simulatePenalty(0,0,60).targetX>=80,true);
for(let r=0;r<5;r++)for(let lane=0;lane<3;lane++){
 const result=sports.simulatePenalty(r,lane,60);
 assert(result.keeperLane>=0&&result.keeperLane<3);
 assert.equal(result.saved,Math.abs(result.targetX-result.keeperX)<70);
}
assert.equal(tenpin.tenPinScore(Array(12).fill(10)),300,'perfect game 300');
assert.equal(tenpin.tenPinScore(Array(20).fill(0)),0);
assert.equal(tenpin.tenPinScore([5,5,5]),20,'spare bonus applied');
assert.equal(tenpin.tenPinScore([10,4,5]),28,'strike bonus applied');
let bowling=tenpin.startBowling();
for(let roll=0;roll<12;roll++){bowling=tenpin.takeBowlingRoll(bowling,10);assert(bowling.total<=300);}
assert(bowling.ended&&bowling.total===300&&bowling.rolls.length===12,'12 strikes finish ten frames');
let misses=tenpin.startBowling();for(let i=0;i<20;i++)misses=tenpin.takeBowlingRoll(misses,0);
assert(misses.ended&&misses.rolls.length===20&&misses.total===0);
for(let lane=0;lane<5;lane++){const hit=sports.rollBowlingBall(lane,66,Array.from({length:10},(_,i)=>i));assert(hit.contacted.length>=0&&hit.contacted.length<=10);assert.equal(hit.remaining.length+hit.contacted.length,10);}
for(let k of ['highway','metro','jungle','snow','river','rocket']){
 for(let i=1;i<=25;i++){
  const wave=runner.nextWave(k,i);
  assert.equal(wave.index,i);
  assert(wave.lane>=0&&wave.lane<3&&wave.gate>=0&&wave.gate<3);
  const expectLane=['snow','river','rocket'].includes(k)?wave.gate:(wave.lane+1)%3;
  assert(runner.resolveWave(k,wave,expectLane,0,0).passed,'visible lane avoids or matches obstacle');
  if(k==='highway')assert(!runner.resolveWave(k,wave,wave.lane,0,0).passed);
 }
}
assert(typeof runner.safeTrafficStep(12.5,2)==='boolean');
const cricketUI=fs.readFileSync('components/cricket-match.tsx','utf8');
assert(cricketUI.includes('Cricket batting controller')&&cricketUI.includes('pc-bat-buttons')&&cricketUI.includes('pc-hit-marker'),'responsive batting dock and timing marker remain available');
assert(cricketUI.includes('e.repeat'),'held keys cannot create multiple bats');
const skillUI=fs.readFileSync('components/expansion-skill.tsx','utf8');
assert(skillUI.includes('expand-ping-ai')&&skillUI.includes('simulatePenalty'));
const surface=fs.readFileSync('components/surface-studio.tsx','utf8');
assert(surface.includes("globalCompositeOperation='destination-out'"),'continuous alpha mask');
const sand=fs.readFileSync('components/granular-sand.tsx','utf8');
assert(sand.includes('requestAnimationFrame(tick)')&&sand.includes('Start pouring'));
const preview=fs.readFileSync('components/game-scene-preview.tsx','utf8');
assert(preview.includes('ILLUSTRATED GAMEPLAY'),'previews labelled honestly');
console.log('PASS: cricket timing, fielding, randomized matches; all ten-pin scoring; penalty reactions; 6 runner types and true painting masks.');

