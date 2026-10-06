import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';
const source=await readFile('lib/mark-rotation.ts','utf8');
const compiled=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
const exports={};vm.runInNewContext(compiled,{exports});
const {markRotation}=exports;
const near=(a,b)=>assert(Math.abs(a-b)<1e-8,`${a} != ${b}`);
const point=(m,x,y)=>[m[0]*x+m[2]*y+m[4],m[1]*x+m[3]*y+m[5]];
// Box center is (160,225); CSS clockwise 90° moves its right edge down in PDF coordinates.
const clockwise=markRotation(90,100,200,120,50);
point(clockwise,160,225).forEach((v,i)=>near(v,[160,225][i]));
point(clockwise,220,225).forEach((v,i)=>near(v,[160,165][i]));
const counter=markRotation(-90,100,200,120,50);
point(counter,220,225).forEach((v,i)=>near(v,[160,285][i]));
for(const angle of [-180,-73.5,-45,0,45,137,180]){
 const matrix=markRotation(angle,100,200,120,50);
 const center=point(matrix,160,225),edge=point(matrix,220,225);
 near(center[0],160);near(center[1],225);
 near(Math.hypot(edge[0]-center[0],edge[1]-center[1]),60);
}
assert.throws(()=>markRotation(NaN,0,0,10,10));
console.log('PASS: watermark rotation preserves its center and scale, matches CSS clockwise direction, and supports arbitrary angles.');
