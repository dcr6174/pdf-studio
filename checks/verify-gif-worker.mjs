// Run after npm run build:public: exercise the emitted URL and real GIF encoder.
import assert from 'node:assert/strict';
import {readdir,readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import vm from 'node:vm';
const root=resolve('dist/client'), chunks=resolve(root,'_next/static/chunks');
const name=(await readdir(chunks)).find(n=>/^lab-gif-.*\.js$/.test(n));
assert(name,'Build the public application first.');
const source=await readFile(resolve(chunks,name),'utf8');
assert(!source.includes('file:///'),'The browser worker must never use a filesystem base.');
const workerPath=source.match(/\/_next\/static\/lab-gif\.worker-[\w-]+\.js/)?.[0];
assert(workerPath,'The build must emit a hashed GIF worker asset.');
const workerSource=await readFile(resolve(root,'.'+workerPath),'utf8');
let terminated=false;
globalThis.window={location:{origin:'https://pdf-studio.in'}};
globalThis.Worker=class {
 constructor(url){
  assert.equal(url.origin,window.location.origin);
  assert.equal(url.pathname,workerPath);
  this.scope={postMessage:data=>queueMicrotask(()=>this.onmessage?.({data}))};
  vm.runInNewContext(workerSource,{self:this.scope,Uint8Array,Uint8ClampedArray,Uint32Array,ArrayBuffer,DataView}, {timeout:5000});
 }
 postMessage(data){this.scope.onmessage({data});}
 terminate(){terminated=true;}
};
try{
 const {gifWorker}=await import(pathToFileURL(resolve(chunks,name)));
 const controller=new AbortController(), encoder=gifWorker(controller.signal);
 await encoder.start();
 for(const color of [[255,0,0],[0,0,255]]){
  const rgba=new Uint8ClampedArray(4*4*4);
  for(let i=0;i<rgba.length;i+=4)rgba.set([...color,255],i);
  await encoder.frame(rgba,4,4,150,true);
 }
 const blob=await encoder.finish(),bytes=new Uint8Array(await blob.arrayBuffer());
 assert.equal(blob.type,'image/gif');
 assert.equal(Buffer.from(bytes.slice(0,6)).toString(),'GIF89a');
 assert.equal(bytes[6]|bytes[7]<<8,4);
 assert.equal(bytes[8]|bytes[9]<<8,4);
 assert.equal(bytes.at(-1),0x3b);
 encoder.close();assert(terminated);
 const cancelled=new AbortController();cancelled.abort();
 const stopped=gifWorker(cancelled.signal);
 await assert.rejects(stopped.start(),e=>e.name==='AbortError');stopped.close();
 console.log('PASS: production worker uses HTTPS origin, emitted encoder creates a two-frame GIF, and aborted work is rejected.');
}finally{delete globalThis.window;delete globalThis.Worker;}
