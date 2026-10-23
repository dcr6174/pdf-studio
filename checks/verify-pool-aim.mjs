import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
const s=fs.readFileSync('lib/pool-aim.ts','utf8');
const js=ts.transpileModule(s,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const {cueGuide}=await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'));
const cue={x:164,y:180};
let line=cueGuide(cue,0,[]);
assert(line.distance>350&&Math.abs(line.y-180)<.001);
assert(line.x<=599.001);
line=cueGuide(cue,0,[{id:1,x:300,y:180,potted:false}]);
assert(line.objectHit&&line.hitId===1,'cue detects object ahead');
assert(Math.abs(line.x-(300-21.5))<.01,'collision point is at ball rim');
line=cueGuide(cue,Math.PI/2,[{id:2,x:300,y:180,potted:false}]);
assert(!line.objectHit,'no false hit off aim direction');
line=cueGuide(cue,0,[{id:1,x:300,y:180,potted:true}]);
assert(!line.objectHit,'potted balls are ignored');
for(let a=0;a<100;a++){
 const angle=a*Math.PI/50;
 const v=cueGuide(cue,angle,[{id:1,x:330,y:180,potted:false},{id:2,x:410,y:280,potted:false}]);
 assert(Number.isFinite(v.x)&&Number.isFinite(v.y)&&v.distance>=0);
 assert(v.x>=40&&v.x<=600&&v.y>=39&&v.y<=321);
}
const comp=fs.readFileSync('components/fresh-sports.tsx','utf8');
assert(comp.includes('cueGuide(cue,angle,balls)'));
console.log('PASS: pool cue aiming intersections, cushion stops and potted-ball handling.');
