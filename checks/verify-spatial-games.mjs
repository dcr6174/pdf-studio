import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
const code=ts.transpileModule(fs.readFileSync('lib/spatial-puzzles.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const geometry=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
const {properIntersection,crossingCount,generateUntangle,packingLevel,rotatePacking,validPackingMove,packingComplete,occupiedPacking,PACKING_LEVEL_COUNT}=geometry;
assert(properIntersection({x:0,y:0},{x:10,y:10},{x:0,y:10},{x:10,y:0}));
assert(!properIntersection({x:0,y:0},{x:10,y:0},{x:0,y:20},{x:10,y:20}));
for(let level=0;level<5;level++)for(let seed=0;seed<10;seed++){
 const board=generateUntangle(level,seed);
 assert.equal(board.points.length,level+6,'progressive knot counts');
 assert(board.edges.length>=10,'enough lines to untangle');
 assert.equal(crossingCount(board.solution,board.edges),0,'canonical solved geometry has no intersections');
 assert(crossingCount(board.points,board.edges)>0,'initial layout actually tangled');
 assert.deepEqual(generateUntangle(level,seed),board,'puzzle positions replay deterministically');
}
assert.equal(PACKING_LEVEL_COUNT,4);
for(let stage=0;stage<PACKING_LEVEL_COUNT;stage++){
 const level=packingLevel(stage);
 assert.equal(level.pieces.length,5,'five actual polyominoes per level');
 const placements=level.pieces.map(p=>({id:p.id,x:p.x,y:p.y,turns:0}));
 assert.equal(new Set(placements.map(p=>p.id)).size,5);
 assert(packingComplete(level,placements),'published level '+stage+' has complete 25-cell solution');
 assert.equal(occupiedPacking(level,placements).size,25,'no overlaps on authored solution');
 assert(!packingComplete(level,placements.slice(1)),'partial layout does not win');
 for(const p of level.pieces){
  assert.equal(p.cells.length,5);
  for(let rotation=0;rotation<4;rotation++){
   const oriented=rotatePacking(p.cells,rotation);
   assert.equal(new Set(oriented.map(({x,y})=>x+','+y)).size,5);
   assert(oriented.every(({x,y})=>x>=0&&y>=0));
  }
  assert(!validPackingMove(level,placements,{id:p.id,x:-1,y:0,turns:0}),'out of board rejected');
 }
 const first=placements[0],second=placements[1];
 assert(!validPackingMove(level,placements,{...second,id:first.id}),'a duplicate piece cannot overlap placed neighbours');
}
for(const path of ['components/untangle-studio.tsx','components/shape-packing-studio.tsx']){
 const content=fs.readFileSync(path,'utf8');
 assert(content.includes('onPointerDown')&&content.includes('onPointerUp'),'actual pointer gesture in '+path);
 assert(content.includes('onScore')&&content.includes('onFinish'),'progression and win in '+path);
}
const trailCode=ts.transpileModule(fs.readFileSync('lib/line-trail.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const trails=await import('data:text/javascript;base64,'+Buffer.from(trailCode).toString('base64'));
assert.equal(trails.TRAIL_LEVELS,5);
for(let level=0;level<trails.TRAIL_LEVELS;level++){
 const graph=trails.trailLevel(level,0),used=new Set();
 assert(graph.edges.length>=6+level);
 assert(graph.trail.length===graph.edges.length+1);
 assert.equal(graph.trail[0],graph.start);
 for(let step=1;step<graph.trail.length;step++){
  const before=graph.trail[step-1],after=graph.trail[step],key=trails.trailKey(before,after);
  assert(trails.isLegalTrailStep(graph.edges,used,before,after),'authored path step is legal');
  used.add(key);
  assert(!trails.isLegalTrailStep(graph.edges,used,before,after),'used line cannot be repeated');
 }
 assert(trails.trailComplete(graph.edges,used),'every line can be traced exactly once');
 assert.equal(used.size,graph.edges.length,'no duplicate lines');
}
const traceUI=fs.readFileSync('components/one-line-studio.tsx','utf8');
assert(traceUI.includes('onPointerMove')&&traceUI.includes('isLegalTrailStep'),'actual line tracing and legal steps');

const router=fs.readFileSync('components/fresh-game.tsx','utf8');
assert(router.includes("game.kind==='untangle'?<UntangleStudio"));
assert(router.includes("game.kind==='shapes'?<ShapePackingStudio"));
console.log('PASS: 50 provably untangleable starts, five Euler trace puzzles and four exact 25-cell packing tilings, collision logic, and tactile game routing.');
