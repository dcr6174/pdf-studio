import assert from 'node:assert/strict';
import {build} from 'vite';
import {createCanvas,loadImage} from '@napi-rs/canvas';
import {mkdir,writeFile} from 'node:fs/promises';
await build({configFile:false,logLevel:'error',build:{ssr:'lib/image-size.ts',outDir:'.image-size-check',emptyOutDir:true,rollupOptions:{output:{entryFileNames:'fit.mjs'}}}});
const {fitImage}=await import('../.image-size-check/fit.mjs');
globalThis.document={createElement(){const c=createCanvas(1,1),ctx=c.getContext('2d'),draw=ctx.drawImage.bind(ctx);ctx.drawImage=(image,...args)=>draw(image.image??image,...args);c.toBlob=(callback,type,quality)=>callback(new Blob([c.toBuffer(type,type==='image/jpeg'?Math.round(quality*100):undefined)],{type}));return c;}};
globalThis.createImageBitmap=async file=>{const image=await loadImage(Buffer.from(await file.arrayBuffer()));return{width:image.width,height:image.height,image,close(){}};};
const canvas=createCanvas(1800,2400),ctx=canvas.getContext('2d'),pixels=ctx.createImageData(1800,2400);let seed=123;
for(let i=0;i<pixels.data.length;i+=4){seed=(Math.imul(seed,1664525)+1013904223)>>>0;pixels.data[i]=seed&255;pixels.data[i+1]=seed>>>8&255;pixels.data[i+2]=seed>>>16&255;pixels.data[i+3]=255;}ctx.putImageData(pixels,0,0);
const original=new File([canvas.toBuffer('image/jpeg',100)],'photo.jpg',{type:'image/jpeg'});
for(const limitKB of [50,200,300]){const result=await fitImage(original,{limitKB,format:'jpeg'});assert.equal(result.met,true);assert.ok(result.blob.size<limitKB*1000);assert.ok(result.width<=1800&&result.height<=2400);assert.ok(Math.abs(result.width/result.height-.75)<.01);const decoded=await loadImage(Buffer.from(await result.blob.arrayBuffer()));assert.equal(decoded.width,result.width);assert.equal(decoded.height,result.height);console.log(`PASS JPG <${limitKB} KB: ${original.size} -> ${result.blob.size} bytes (${result.width} x ${result.height})`);}
const sized=await fitImage(original,{limitKB:300,format:'jpeg',maxWidth:400,maxHeight:400});assert.ok(sized.width<=400&&sized.height<=400);
const small=createCanvas(300,100),sc=small.getContext('2d');sc.strokeStyle='#5636cf';sc.lineWidth=4;sc.beginPath();sc.moveTo(20,70);sc.quadraticCurveTo(150,-20,280,70);sc.stroke();
const signature=new File([small.toBuffer('image/png')],'signature.png',{type:'image/png'}),kept=await fitImage(signature,{limitKB:200,format:'png'});assert.equal(kept.original,true);assert.equal(kept.blob,signature);
const resized=await fitImage(signature,{limitKB:20,format:'png',maxWidth:150});const transparent=await loadImage(Buffer.from(await resized.blob.arrayBuffer()));const probe=createCanvas(resized.width,resized.height);probe.getContext('2d').drawImage(transparent,0,0);assert.equal(probe.getContext('2d').getImageData(0,0,1,1).data[3],0);assert.equal(resized.blob.type,'image/png');
await assert.rejects(()=>fitImage(original,{limitKB:0,format:'jpeg'}),/size limit/);await assert.rejects(()=>fitImage(new File(['x'],'x.pdf',{type:'application/pdf'}),{limitKB:200,format:'jpeg'}),/JPG/);const controller=new AbortController();controller.abort();await assert.rejects(()=>fitImage(original,{limitKB:200,format:'jpeg'},controller.signal),{name:'AbortError'});
await mkdir('.compression-fixtures',{recursive:true});await writeFile('.compression-fixtures/photo.jpg',Buffer.from(await original.arrayBuffer()));await writeFile('.compression-fixtures/signature.png',Buffer.from(await signature.arrayBuffer()));
console.log('PASS pixel limits, aspect ratio, unchanged already-small source, PNG transparency, invalid input and cancellation.');
