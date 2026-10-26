import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import ts from 'typescript';
const source=readFileSync('lib/hoops-engine.ts','utf8');
const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const mod=await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'));
const {HOOPS,MOBILE_HOOPS,HOOPS_SHOTS,HOOPS_SPOTS,MOBILE_HOOPS_SPOTS,releaseHoopsBall,stepHoopsBall,traceHoopsShot,hoopsPoints}=mod;
assert.equal(HOOPS_SHOTS,12);
assert.equal(HOOPS_SPOTS.length,HOOPS_SHOTS);
assert.equal(MOBILE_HOOPS_SPOTS.length,HOOPS_SHOTS);
for(const [name,court,spots] of [['desktop',HOOPS,HOOPS_SPOTS],['portrait',MOBILE_HOOPS,MOBILE_HOOPS_SPOTS]]){
 assert(court.rimLeft+court.radius*2<court.rimRight,'basket must fit basketball');
 assert(court.boardX>court.rimRight,'glass sits behind rim');
 let scored=0,misses=0,glass=0,rims=0,floor=0;
 for(const angle of [30,36,42,48,52,56,60,64,70,76]){
  for(const power of [25,33,41,49,57,65,69,73,77,85,93]){
   const s=releaseHoopsBall(spots[0],angle,power,court);
   for(let n=0;n<550&&!s.finished;n++){
    stepHoopsBall(s,1/90);
    if(s.events.includes('glass'))glass++;
    if(s.events.includes('rim'))rims++;
    if(s.events.includes('floor'))floor++;
    if(s.scored)break;
   }
   if(s.scored)scored++;else misses++;
   assert(Number.isFinite(s.x)&&Number.isFinite(s.y),'ball position must remain finite');
   assert(!s.scored||s.y>=court.rimY,'scoring happens after ball crosses hoop');
  }
 }
 assert(scored>4,name+' must have achievable made baskets, got '+scored);
 assert(misses>25,name+' must reward skill rather than auto-score');
 assert(rims>0,name+' must actually collide with ring');
 assert(glass>0,name+' must actually hit backboard');
 assert(floor>0,name+' must visually bounce or land on court');
 const preview=traceHoopsShot(spots[0],60,70,court);
 assert(preview.length>5&&preview.every(p=>Number.isFinite(p.x)&&Number.isFinite(p.y)),'trajectory guide must be derived from the engine');
 console.log('PASS: '+name+' physics — '+scored+' makes, '+misses+' misses, '+rims+' rim hits, '+glass+' glass hits, '+floor+' floor bounces.');
}
assert.equal(hoopsPoints(170,true,0,HOOPS),3);
assert.equal(hoopsPoints(360,true,0,HOOPS),2);
assert.equal(hoopsPoints(170,true,1,HOOPS),2);
const club=readFileSync('components/club-game.tsx','utf8');
assert(club.includes("slug==='rooftop-hoops'")&&club.includes('<RooftopHoops/>'),'Rooftop Hoops routes to full-stage game');
const cricket=readFileSync('components/cricket-match.tsx','utf8');
for(const cue of ['cricket-bowler','cricket-pitch','cricket-bat','cricket-four','cricket-six','cricket-stumps'])assert(cricket.includes(cue),'cricket cues '+cue);
const master=readFileSync('components/fresh-game.tsx','utf8');
assert(master.includes('studio-arcade:cricket:sound')&&master.includes('pc-sound-switch'),'default-on cricket sound preference has a visible toggle');
const sound=readFileSync('lib/sports-audio.ts','utf8');
assert(sound.includes('unlockSportsAudio')&&sound.includes('AudioContext'),'audio must be gesture unlocked and browser native');
console.log('PASS: 12 shot positions, shared collision physics, cricket sounds, UI routes and native AudioContext.');
