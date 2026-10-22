import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
const js=ts.transpileModule(fs.readFileSync('lib/expansion-rules.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const rules=await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'));
const {RING_PAR_MOVES,ringSolveScore,mazeCompletionScore,mazeStepScore,PENALTY_ROUNDS,penaltySummary,skillRoundLabel,dartsAfterThrow,tennisScoreAfterRally}=rules;
assert.equal(RING_PAR_MOVES,15);
assert.equal(mazeStepScore(),0);
assert.equal(mazeCompletionScore(20),mazeCompletionScore(20));
assert(mazeCompletionScore(16)>mazeCompletionScore(40),'long maze routes cannot earn extra points');
for(let i=0;i<300;i++)assert.equal(mazeStepScore(i),0,'backtracking cannot earn scores');
assert(ringSolveScore(15)>ringSolveScore(24),'optimum beats slow solves');
assert.equal(ringSolveScore(17),ringSolveScore(17),'replay scoring deterministic');
assert(ringSolveScore(500)>=0);
const loss=penaltySummary(0,5);
assert.deepEqual({won:loss.won,goals:loss.goals,complete:loss.complete,played:loss.played},{won:false,goals:0,complete:true,played:5});
assert.match(loss.message,/0\/5/);
assert(penaltySummary(3,5).won);
assert(!penaltySummary(4,4).won,'win only after five kicks');
assert.equal(penaltySummary(0,600).played,PENALTY_ROUNDS);
for(let played=0;played<25;played++)assert(skillRoundLabel(played,5)<=5,'HUD never displays 6/5');
let attempts=0,hits=[];
const miss=dartsAfterThrow(attempts,hits,0,7);
assert.equal(miss.hit,false);assert.deepEqual(miss.hits,[]);assert.equal(miss.attempts,1);
const hit=dartsAfterThrow(miss.attempts,miss.hits,7,7);
assert.equal(hit.hit,true);assert.deepEqual(hit.hits,[7]);
assert.deepEqual(tennisScoreAfterRally(0,0,'player'),{player:1,computer:0,won:false,lost:false});
assert(tennisScoreAfterRally(6,3,'player').won);
assert(tennisScoreAfterRally(4,6,'computer').lost);
const skill=fs.readFileSync('components/expansion-skill.tsx','utf8');
assert.match(skill,/useState\(0\),\[enemy,setEnemy\]=useState\(0\)/,'tennis starts at 0–0');
assert.match(skill,/setMazeMoves/);
assert.match(skill,/mazeCompletionScore/);
assert(!/setMarble\(n\);add\(2\)/.test(skill),'no rewards for repeating maze steps');
assert.match(skill,/setAttempts\(outcome\.attempts\)/);
assert.match(skill,/penaltySummary\(nextGoals,round\+1\)/);
const satisfy=fs.readFileSync('components/expansion-satisfy.tsx','utf8');
assert.match(satisfy,/ringSolveScore\(moves\+1\)/);
assert(!/tally\(\(moves\+1\)\*5\)/.test(satisfy),'ring undo/farming score removed');
assert.match(satisfy,/Undo last move/);
const motion=fs.readFileSync('lib/expansion-catalog.ts','utf8');
assert(!motion.includes('Collect 20 stars.'),'Metro objective must agree with obstacle goal');
const directory=fs.readFileSync('components/arcade-directory.tsx','utf8');
assert(directory.includes('Recently played'),'avoid suggesting unimplemented session-resume');
const importTS=async path=>{const code=ts.transpileModule(fs.readFileSync(path,'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;return import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));};
const puzzle=await importTS('lib/play-studio-puzzles.ts');
assert.equal(puzzle.fallingShapes.length,4);
for(let shape=0;shape<4;shape++)for(let spin=0;spin<4;spin++){
 const rotated=puzzle.rotatedCells(shape,spin);
 assert.equal(rotated.length,4);
 assert.equal(new Set(rotated.map(p=>p.x+','+p.y)).size,4,'no overlapping piece squares');
 assert(rotated.every(p=>p.x>=0&&p.y>=0),'normalized rotated geometry');
}
for(let i=0;i<5;i++){const placed=puzzle.droppedCells([],0,0,i);assert(placed&&placed.length===4);assert(placed.every(p=>p.y<=8));}
const board=Array.from({length:7},(_,x)=>({x,y:8}));
assert.equal(puzzle.settleRows(board).cleared,1);
assert(puzzle.droppedCells(board,1,0,0),'a tall piece fits from top');
for(let level=0;level<20;level++){
 const p=puzzle.countingBoard(level,1);assert.equal(p.icons.length,12);assert(p.count>=1);
 assert.equal(p.count,p.icons.filter(x=>x===p.target).length);
 const m=puzzle.arithmeticPrompt(level,2);
 assert(Number.isFinite(m.answer)&&m.answer>=0);
}
assert.equal(puzzle.balanceChallenges.length,4);
assert.equal(new Set(puzzle.balanceChallenges.map(x=>x.weight+','+x.distance)).size,4);
const peg=await importTS('lib/peg-physics.ts');
assert.equal(peg.pegLocations.length,24);
for(let lane=0;lane<5;lane++)for(let seed=0;seed<10;seed++){
 const result=peg.simulatePegDrop(lane,seed);
 assert(result.positions.length>15,'trajectory contains bouncing simulation steps');
 assert(result.positions.every(p=>p.x>=0&&p.x<=500),'ball stays inside stage');
 assert(result.pocket>=0&&result.pocket<5);
 assert(result.points>0);
 assert.equal(result.pocket,peg.simulatePegDrop(lane,seed).pocket,'repeatable physics');
}
const mind=fs.readFileSync('components/expansion-mind.tsx','utf8');
assert(mind.includes('droppedCells(blocks,shape,orientation,previewColumn)'));
assert(mind.includes('prize(points);win('),'Path Connect scores only on goal');
assert(mind.includes('pegLocations.map('),'Peg Bounce renders real pins');
const scenes=fs.readFileSync('components/fresh-illustrated-scenes.tsx','utf8');
const skillStage=fs.readFileSync('components/skill-aim-stage.tsx','utf8');
assert(skillStage.includes('role="group"')&&skillStage.includes('onAim(i)'));
assert(skillStage.includes('popped.includes(i)'),'popped balloons disappear from sporting artwork');
assert(fs.readFileSync('components/expansion-skill.tsx','utf8').includes('<SkillAimStage'),'sports render aim preview');
assert(scenes.includes('DifferenceVillage')&&scenes.includes('HiddenObjectGarden'));

console.log('PASS: anti-farming, penalty win/loss, round HUD, darts misses, tennis score and truthful discovery checks.');
