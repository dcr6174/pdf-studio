import assert from 'node:assert/strict';
import {build} from 'vite';
import {ImageData} from '@napi-rs/canvas';
import {pathToFileURL} from 'node:url';
await build({configFile:false,logLevel:'error',build:{ssr:'lib/scan-perspective.ts',outDir:'.perspective-check',rollupOptions:{output:{entryFileNames:'scan-perspective.mjs'}}}});
globalThis.ImageData=ImageData;
const {perspectiveMap,warpScan}=await import(pathToFileURL(process.cwd()+'/.perspective-check/scan-perspective.mjs'));
for(const corners of [[{x:0,y:0},{x:100,y:0},{x:100,y:80},{x:0,y:80}],[{x:20,y:10},{x:90,y:20},{x:100,y:90},{x:5,y:80}]]){
 const map=perspectiveMap(corners);for(const [i,[u,v]] of [[0,0],[1,0],[1,1],[0,1]].entries()){const p=map(u,v);assert.ok(Math.abs(p.x-corners[i].x)<1e-6&&Math.abs(p.y-corners[i].y)<1e-6);}
 for(let v=0;v<=1;v+=.1)for(let u=0;u<=1;u+=.1){const p=map(u,v);assert.ok(Number.isFinite(p.x)&&Number.isFinite(p.y));}
}
assert.throws(()=>perspectiveMap([{x:0,y:0},{x:10,y:10},{x:10,y:0},{x:0,y:10}]));
assert.throws(()=>perspectiveMap([{x:0,y:0},{x:0,y:0},{x:10,y:10},{x:0,y:10}]));
console.log('PASS: projective corner mapping, finite interior coordinates, crossed and degenerate corner rejection. Camera and pixel fidelity require browser/device checks.');

const pixels=new ImageData(3,3);for(let i=0;i<pixels.data.length;i++)pixels.data[i]=(i*17)%256;const identity=await warpScan(pixels,[{x:0,y:0},{x:2,y:0},{x:2,y:2},{x:0,y:2}],3,3);assert.deepEqual(identity.data,pixels.data);const abort=new AbortController();abort.abort();await assert.rejects(()=>warpScan(pixels,[{x:0,y:0},{x:2,y:0},{x:2,y:2},{x:0,y:2}],3,3,abort.signal));console.log('PASS: identity pixel preservation and cancellation before warping.');
