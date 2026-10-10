import assert from 'node:assert/strict';
import {build} from 'vite';
import {createCanvas,loadImage,ImageData} from '@napi-rs/canvas';
await build({configFile:false,logLevel:'error',build:{ssr:'lib/image-lab.ts',outDir:'.image-lab-check',emptyOutDir:true,rollupOptions:{output:{entryFileNames:'engine.mjs'}}}});
const lab=await import('../.image-lab-check/engine.mjs');
Object.assign(globalThis,{ImageData,document:{createElement(){const canvas=createCanvas(1,1);canvas.toBlob=(callback,type,quality)=>callback(new Blob([canvas.toBuffer(type,type==='image/jpeg'||type==='image/webp'?Math.round(quality*100):undefined)],{type}));return canvas;}}});
const source=createCanvas(400,240),ctx=source.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,400,240);ctx.fillStyle='#e04030';ctx.fillRect(100,60,200,120);
const file=new File([source.toBuffer('image/png')],'fixture.png',{type:'image/png'}),settings={...lab.defaultImageSettings,width:120,height:120,rect:{x:100,y:60,width:100,height:80},point:{x:0,y:0}};
const decode=async blob=>loadImage(Buffer.from(await blob.arrayBuffer()));
for(const slug of ['image-resizer','image-crop','image-rotate','image-blur','image-pixelate','image-grayscale','image-background-remover','jpg-to-png','png-to-jpg','image-to-webp','image-watermark','image-metadata-remover','signature-cleaner','image-id-card','image-adjustments','image-sharpen','image-compressor']){
 const outputs=await lab.imageOutputs(source,file,slug,{...settings,amount:slug==='image-grayscale'?100:30,angle:slug==='image-rotate'?90:0,format:slug==='image-compressor'?'jpeg':'png'});
 assert(outputs[0].blob.size>0,slug);const image=await decode(outputs[0].blob);
 if(slug==='image-crop')assert.deepEqual([image.width,image.height],[100,80]);
 if(slug==='image-resizer')assert.deepEqual([image.width,image.height],[120,120]);
 if(slug==='image-rotate')assert.deepEqual([image.width,image.height],[240,400]);
 if(slug==='image-background-remover'){const probe=createCanvas(400,240),p=probe.getContext('2d');p.drawImage(image,0,0);assert.equal(p.getImageData(0,0,1,1).data[3],0);assert.equal(p.getImageData(150,100,1,1).data[3],255);}
 if(slug==='image-grayscale'){const probe=createCanvas(400,240),p=probe.getContext('2d');p.drawImage(image,0,0);const pixel=p.getImageData(150,100,1,1).data;assert.equal(pixel[0],pixel[1]);assert.equal(pixel[1],pixel[2]);}
}
const portrait=await lab.imageOutputs(source,file,'passport-photo',settings);assert.deepEqual([portrait[0].width,portrait[0].height],[413,531]);
const icons=await lab.imageOutputs(source,file,'favicon-generator',settings);assert.equal(icons.length,10);const ico=new DataView(await icons.find(o=>o.name==='favicon.ico').blob.arrayBuffer());assert.equal(ico.getUint16(2,true),1);assert.equal(ico.getUint16(4,true),4);
const secret='Unicode secret: दुनिया 🌈',encrypted=await lab.encryptText(secret,'test password');assert.equal(await lab.decryptText(encrypted,'test password'),secret);await assert.rejects(()=>lab.decryptText(encrypted,'wrong'),/incorrect/);
const carrier=createCanvas(400,240),c=carrier.getContext('2d');c.drawImage(source,0,0);c.clearRect(0,0,50,240);const pixels=c.getImageData(0,0,400,240);lab.embedMessage(pixels,encrypted);c.putImageData(pixels,0,0);const encoded=await lab.encodeCanvas(carrier),decoded=await decode(encoded);c.clearRect(0,0,400,240);c.drawImage(decoded,0,0);assert.equal(await lab.decryptText(lab.extractMessage(c.getImageData(0,0,400,240)),'test password'),secret);assert.equal(c.getImageData(0,0,1,1).data[3],0);
assert.throws(()=>lab.makeCanvas(8192,8192),/24 megapixels/);assert.throws(()=>lab.makeCanvas(0,1));assert.throws(()=>lab.extractMessage(ctx.getImageData(0,0,400,240)),/No Studio Lab/);assert.throws(()=>lab.embedMessage(new ImageData(1,1),encrypted),/too large/);
assert.deepEqual(lab.clampRect({x:390,y:230,width:100,height:100},400,240),{x:390,y:230,width:10,height:10});
console.log('PASS: image formats, crop/resize/rotation dimensions, background transparency, grayscale pixels, passport dimensions, ICO directory, AES-GCM wrong-password rejection, PNG steganography roundtrip with transparent pixels, invalid selection and memory limits. SVG cleanup and interactive/batch layouts are separately verified in a real browser.');
