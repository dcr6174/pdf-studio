import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
const raw=fs.readFileSync('lib/hill-physics.ts','utf8');
const out=ts.transpileModule(raw,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const rules=await import('data:text/javascript;base64,'+Buffer.from(out).toString('base64'));
const {createHill,stepHill,hillHeight,hillSlope,hillGoal,hillFuelStations,hillRocks}=rules;
assert(hillGoal>1000);
for(const track of ['meadow','canyon','ridge']){
 const initial=createHill(track);assert.equal(initial.fuel,100);assert.equal(initial.damage,0);
 let state=initial;
 for(let t=0;t<500&&!state.done;t++){
  const move=stepHill(state,{gas:true,brake:false,jump:t%50===10,tilt:0},.03,track);
  state=move.state;
  assert(Number.isFinite(state.x)&&Number.isFinite(state.y)&&Number.isFinite(state.vx));
  assert(state.fuel>=0&&state.fuel<=100&&state.damage<=3);
  assert(state.x>=0);assert(Number.isFinite(hillHeight(state.x,track))&&Number.isFinite(hillSlope(state.x,track)));
 }
 assert(state.best>initial.best+35,'holding gas accelerates across terrain '+track);
 const copy=createHill(track);
 assert.deepEqual(stepHill(copy,{gas:true,brake:false,jump:false,tilt:0},.016,track),
  stepHill(copy,{gas:true,brake:false,jump:false,tilt:0},.016,track),'physics is repeatable');
 const zero=stepHill(copy,{gas:false,brake:false,jump:false,tilt:0},0,track);
 assert(zero.state.x===copy.x);
}
let car=createHill('meadow');
for(let k=0;k<60;k++)car=stepHill(car,{gas:true,brake:false,jump:false,tilt:0},.03,'meadow').state;
const pre=car.vx;
for(let k=0;k<35;k++)car=stepHill(car,{gas:false,brake:true,jump:false,tilt:0},.03,'meadow').state;
assert(car.vx<pre,'braking slows vehicle');
let down=createHill('meadow');down={...down,x:hillFuelStations[0]-6,y:hillHeight(hillFuelStations[0]-6,'meadow')-29,fuel:20,vx:48};
const refilled=stepHill(down,{gas:false,brake:false,jump:false,tilt:0},.04,'meadow');
assert(refilled.state.fuel>down.fuel,'driving across fuel restores energy');
assert(refilled.state.collected.includes(hillFuelStations[0]),'fuel not collected twice');
let rock=createHill('meadow');rock={...rock,x:hillRocks[0]-8,y:hillHeight(hillRocks[0]-8,'meadow')-29,vx:65};
const struck=stepHill(rock,{gas:false,brake:false,jump:false,tilt:0},.04,'meadow');
assert(struck.state.damage===1,'rock impact causes damage');
const source=fs.readFileSync('components/hill-rider.tsx','utf8');
for(const feature of ['play-hill-stage','HOLD GAS','HOLD BRAKE','jump','hillHeight','onPointerDown','Comfort Mode'])assert(source.includes(feature),'Hill Rider offers '+feature);
assert(fs.readFileSync('components/fresh-game.tsx','utf8').includes('<HillRider'),'Hill Rider replaces formula-only mode');
console.log('PASS: 3 driving tracks, slopes, deterministic physics, braking, fuel, rock impact and touch UI.');
