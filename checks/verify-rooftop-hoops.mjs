import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
const text=fs.readFileSync('lib/rooftop-hoops-engine.ts','utf8');
const javascript=ts.transpileModule(text,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const engine=await import('data:text/javascript;base64,'+Buffer.from(javascript).toString('base64'));
const {HOOPS,makeHoopsBall,stepHoops,previewHoops,hoopPosition,shooterPosition,evaluateHoopsScore}=engine;
assert.equal(HOOPS.width,1000);
assert.equal(HOOPS.height,600);
assert.equal(HOOPS.ballRadius,15);
function run(angle,power,round){
 const x=shooterPosition(round),hoop=hoopPosition(round);
 let ball=makeHoopsBall(angle,power,x),scored=0,contacts=0,elapsed=0;
 for(let t=0;t<720&&!ball.done;t++){
  const step=stepHoops(ball,.008,hoop);
  ball=step.ball;elapsed+=.008;
  if(step.event==='swish')scored++;
  if(step.event==='rim'||step.event==='board')contacts++;
  assert(Number.isFinite(ball.x)&&Number.isFinite(ball.y),'No NaN or infinity flight at '+round);
 }
 assert(ball.done,'Projectile should always resolve and allow another attempt');
 assert(scored<=1,'A ball cannot score twice');
 assert(ball.age<4.3,'Must settle rather than trap the next ball forever');
 assert.equal(Boolean(scored),ball.scored,'Renderable score state agrees with event');
 return{scored,contacts,ball,elapsed};
}
assert(run(51,820,0).scored===1,'Default first shot needs to be learnable and make the basket');
assert(run(28,460,0).scored===0,'A weak misplaced throw cannot get free points');
let rimContacts=0;
for(let round=0;round<10;round++){
 let hits=0,misses=0;
 for(let angle=37;angle<=70;angle+=2){
  for(let power=590;power<=1100;power+=20){
   const result=run(angle,power,round);
   if(result.scored)hits++;else misses++;
   if(result.contacts>0)rimContacts++;
  }
 }
 assert(hits>0,'Every shot location has at least one valid skill-based goal at round '+round);
 assert(misses>0,'Not every shot is guaranteed at round '+round);
 const guide=previewHoops(51,820,shooterPosition(round),hoopPosition(round));
 assert(guide.length>6,'Visible trajectory guide should be long enough to aim');
 assert(guide.every(p=>Number.isFinite(p.x)&&Number.isFinite(p.y)),'Preview must be finite');
}
assert(rimContacts>8,'Rim and backboard should genuinely collide with shots');
assert.equal(evaluateHoopsScore({scored:true,rimHits:0},0),3);
assert.equal(evaluateHoopsScore({scored:true,rimHits:2},0),2);
assert.equal(evaluateHoopsScore({scored:true,rimHits:0},2),4);
assert.equal(evaluateHoopsScore({scored:false,rimHits:0},9),0);
const route=fs.readFileSync('app/lab/arcade/[slug]/page.tsx','utf8');
assert(route.includes("slug==='rooftop-hoops'")&&route.includes('<RooftopHoops/>'),'Actual live route uses new arena, not the generic tiny club stage');
const ui=fs.readFileSync('components/rooftop-hoops.tsx','utf8');
for(const feature of ['onPointerDown','onPointerUp','rooftop-court','rooftop-shoot','rooftop-scoreline','playStadiumSound','sound','aria-label']){
 assert(ui.includes(feature),'Rooftop game missing critical '+feature);
}
const styles=fs.readFileSync('app/lab/arcade/rooftop-hoops.css','utf8');
assert(styles.includes('aspect-ratio:5 / 3')&&styles.includes('width:100%')&&styles.includes('max-height:min(77dvh'),'Court must dominate rather than render as a tiny card');
assert(ui.includes('data-camera={portrait?"portrait":"landscape"}')&&ui.includes('viewBox={viewBox}')&&ui.includes('getScreenCTM'),
 'Portrait court must pan with the traveling basketball while preserving accurate touch coordinates');
assert(ui.includes('rooftop-hit-callout')&&ui.includes('rh-celebrate-burst'),
 'A basket needs readable feedback and animated celebration');
assert(styles.includes('max-width:680px')&&styles.includes('height:clamp(285px,calc(100dvh - 265px),655px)'),
 'Portrait stage should occupy roughly the full available phone viewport, not retain a tiny 5:3 strip');
const cricket=fs.readFileSync('components/cricket-match.tsx','utf8');
const frame=fs.readFileSync('components/game-frame-core.ts','utf8');
assert(frame.includes('gf-sound')&&frame.includes('Stadium sound')&&cricket.includes('unlockStadiumAudio')&&cricket.includes('startCricketAmbience')&&cricket.includes("onSound('bounce')"),
 'Shared controls must expose cricket sound; chase audio must unlock on a player gesture and preserve crowd/bounce cues');
const sound=fs.readFileSync('lib/arcade-audio.ts','utf8');
assert(sound.includes("kind==='cricket'")&&sound.includes('playStadiumSound')&&sound.includes("effect==='miss'?'miss'"),'Cricket misses must not sound like wickets');
assert(cricket.includes("playStadiumSound('cricket','wicket')"),'A wicket must trigger its distinct stadium sound effect');
console.log('PASS: Rooftop physics 10 positions × 18 arcs × 26 strengths, real collisions, playable scoring, arena routing and visible cricket sounds.');

assert(fs.readFileSync('lib/stadium-audio.ts','utf8').includes('startCricketAmbience'),'Original filtered cricket ambient audio must exist.');
