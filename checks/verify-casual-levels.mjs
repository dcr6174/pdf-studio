import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
const raw=fs.readFileSync('lib/casual-levels.ts','utf8');
const transpiled=ts.transpileModule(raw,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const lib=await import('data:text/javascript;base64,'+Buffer.from(transpiled).toString('base64'));
const {hangmanPacks,ladderPacks,ladderChoices,oneLetterApart,colorLevel,legalTubeMove,moveTube,tubesSolved,parkingLevel,slideParking,parkingHint,parkingSolved}=lib;
assert(hangmanPacks.length>=20);
assert.equal(new Set(hangmanPacks.map(x=>x[0])).size,hangmanPacks.length);
assert(hangmanPacks.every(x=>/^[A-Z]+$/.test(x[0])&&x[1].length>10));
assert(ladderPacks.length>=10);
for(const [index,words] of ladderPacks.entries()){
 assert(words.length>=4,'meaningful multistep ladder '+index);
 for(let step=0;step<words.length-1;step++){
  assert(oneLetterApart(words[step],words[step+1]),'valid edit at ladder '+index+' step '+step);
  const options=ladderChoices(words,step,index);
  assert.equal(options.length,3,'three choices');
  assert.equal(new Set(options).size,3,'unique answers');
  assert(options.includes(words[step+1]),'correct route visible');
 }
}
for(let seed=0;seed<20;seed++){
 const level=colorLevel(seed);
 assert.equal(level.tubes.length,6);
 assert.equal(level.tubes.flat().length,16);
 for(let color=0;color<4;color++)assert.equal(level.tubes.flat().filter(x=>x===color).length,4);
 assert(level.tubes.every(t=>t.length<=4));
 let tubes=level.tubes;
 for(const move of level.solution){
  assert(legalTubeMove(tubes,move.from,move.to),'reverse-generated proof uses legal moves seed '+seed);
  tubes=moveTube(tubes,move.from,move.to);
  assert(tubes);
 }
 assert(tubesSolved(tubes),'generated sorting level is solvable seed '+seed);
}
for(let index=0;index<5;index++){
 const cars=parkingLevel(index);
 assert.equal(cars.length,5);
 assert(!parkingSolved(cars),'start is not finished');
 const cells=new Set();
 for(const car of cars){
  for(let i=0;i<car.length;i++){
   const x=car.x+(car.axis==='h'?i:0),y=car.y+(car.axis==='v'?i:0);
   assert(x>=0&&x<6&&y>=0&&y<6,'car inside board');
   const p=x+6*y;assert(!cells.has(p),'cars do not overlap');cells.add(p);
  }
 }
 let board=cars;
 for(let count=0;count<40&&!parkingSolved(board);count++){
  const hint=parkingHint(board);
  assert(hint,'level '+index+' is solvable within search limit');
  const next=slideParking(board,hint.index,hint.delta);
  assert(next);board=next;
 }
 assert(parkingSolved(board),'parking level '+index+' can be completed using hints');
}
const casual=fs.readFileSync('components/fresh-casual.tsx','utf8');
assert(casual.includes('seed=0'));
assert(casual.includes('tubeHistory')&&casual.includes('undoTube'));
assert(casual.includes('carPointer')&&casual.includes('parkingHint(cars)'));
assert(casual.includes('Eight different garden words discovered'));
assert(casual.includes('Six authored word ladders completed'));
console.log('PASS: 24 hangman clues, 12 validated ladders, 20 provably solvable tube boards and 5 parking levels.');
