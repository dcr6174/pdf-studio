// Raster tests need @napi-rs/canvas (also used by verify-studio.mjs).
import assert from 'node:assert/strict';
import {build} from 'vite';
import {createCanvas,loadImage} from '@napi-rs/canvas';
import {PDFDocument} from 'pdf-lib';
await build({configFile:false,logLevel:'error',build:{ssr:'lib/signatures.ts',outDir:'.signature-check',emptyOutDir:true,rollupOptions:{output:{entryFileNames:'signatures.mjs'}}}});
globalThis.document={createElement(tag){assert.equal(tag,'canvas');return createCanvas(1,1);}};
globalThis.createImageBitmap=async file=>{const image=await loadImage(Buffer.from(await file.arrayBuffer()));image.close=()=>{};return image;};
const {signatureFromName,trimSignature,signatureFromFile}=await import('../.signature-check/signatures.mjs');
for(const name of ['Chandra','A very long signature that should still fit the available width']){const png=signatureFromName(name),image=await loadImage(png);assert.ok(image.width<=916&&image.height<=276);assert.ok(image.width>16&&image.height>16);const d=await PDFDocument.create(),sig=await d.embedPng(png);const p=d.addPage();p.drawImage(sig,{x:50,y:50,width:200,height:200*sig.height/sig.width});assert.equal((await PDFDocument.load(await d.save())).getPageCount(),1);}
const blank=createCanvas(100,100);assert.throws(()=>trimSignature(blank),/visible/);const c=createCanvas(200,100);c.getContext('2d').fillRect(60,40,70,20);const trimmed=await loadImage(trimSignature(c));assert.equal(trimmed.width,86);assert.equal(trimmed.height,36);
const file=(bytes,name)=>new File([bytes],name);const upload=await signatureFromFile(file(c.toBuffer('image/png'),'signature.png'));assert.equal((await loadImage(upload)).width,86);await assert.rejects(()=>signatureFromFile(file('x','signature.svg')),/PNG/);await assert.rejects(()=>signatureFromFile(file(new Uint8Array(10*1024*1024+1),'huge.png')),/10.5/);await assert.rejects(()=>signatureFromFile(file('not an image','broken.png')));await assert.rejects(()=>signatureFromFile(file(blank.toBuffer('image/png'),'empty.png')),/visible/);
for(const style of ['serif','sans-serif','monospace'])for(const color of ['#172638','#ee0000','#0000ee']){const img=await loadImage(signatureFromName('Chandra',style,color));assert.ok(img.width>16);}
console.log('PASS: typed and long signature rasterization, transparent cropping, image upload, blank/malformed/unsupported/oversize rejection, PDF embedding and saved output integrity.');
