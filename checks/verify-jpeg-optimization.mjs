import assert from 'node:assert/strict';
import {build} from 'vite';
import {PDFDocument,StandardFonts,PDFRawStream,PDFName} from 'pdf-lib';
import {createCanvas,loadImage} from '@napi-rs/canvas';
await build({configFile:false,logLevel:'error',build:{ssr:'lib/optimize-jpeg.ts',outDir:'.jpeg-check',emptyOutDir:true,rollupOptions:{output:{entryFileNames:'optimize.mjs'}}}});
const {optimizeJPEGImages}=await import('../.jpeg-check/optimize.mjs');
globalThis.document={createElement:()=>createCanvas(1,1)};globalThis.createImageBitmap=async file=>{const image=await loadImage(Buffer.from(await file.arrayBuffer()));return{width:image.width,height:image.height,close(){},image};};
// Canvas decoder wrapper supplies the native source; all PDF rewriting remains real.
const native=createCanvas(500,600);const c=native.getContext('2d');const px=c.createImageData(500,600);let seed=31;for(let i=0;i<px.data.length;i+=4){seed=(Math.imul(seed,1664525)+1013904223)>>>0;px.data[i]=seed&255;px.data[i+1]=seed>>>8&255;px.data[i+2]=seed>>>16&255;px.data[i+3]=255;}c.putImageData(px,0,0);
const originalCreate=globalThis.document.createElement;globalThis.document.createElement=()=>{const canvas=originalCreate();canvas.toBlob=(callback,type,quality)=>callback(new Blob([canvas.toBuffer(type,Math.round(quality*100))],{type}));const ctx=canvas.getContext('2d');const originalDraw=ctx.drawImage.bind(ctx);ctx.drawImage=(image,...args)=>originalDraw(image.image??image,...args);return canvas;};
const d=await PDFDocument.create();const jpeg=await d.embedJpg(native.toBuffer('image/jpeg',100));const page=d.addPage([500,600]);page.drawImage(jpeg,{x:0,y:0,width:500,height:600});const font=await d.embedFont(StandardFonts.Helvetica);page.drawText('Selectable text retained',{x:20,y:580,font,size:12});const name=d.getForm().createTextField('Name');name.setText('Kept field');name.addToPage(page,{x:20,y:20,width:160,height:20});const before=await d.save();const opened=await PDFDocument.load(before);const changed=await optimizeJPEGImages(opened);assert.equal(changed,1);const after=await opened.save();assert.ok(after.length<before.length);const check=await PDFDocument.load(after);assert.equal(check.getForm().getTextField('Name').getText(),'Kept field');assert.equal(check.getPageCount(),1);assert.ok(check.getPage(0).node.Contents());const imageStreams=check.context.enumerateIndirectObjects().filter(([,o])=>o instanceof PDFRawStream&&o.dict.get(PDFName.of('Subtype'))?.toString()==='/Image');assert.equal(imageStreams.length,1);const decoder=await loadImage(Buffer.from(imageStreams[0][1].contents));assert.equal(decoder.width,500);assert.equal(decoder.height,600);
console.log(`PASS: supported JPEG stream reduced PDF ${before.length} → ${after.length} bytes, reopened/decode dimensions correct, text content stream and editable form retained. Pixel quality and real browser decoding not benchmarked.`);


// PNG/Flate scans previously skipped completely. Exercise both raw and all PNG predictors.
const {imageSamples}=await import('../.jpeg-check/optimize.mjs').then(async()=>{await build({configFile:false,logLevel:'error',build:{ssr:'lib/pdf-image-samples.ts',outDir:'.predictor-check',emptyOutDir:true,rollupOptions:{output:{entryFileNames:'samples.mjs'}}}});return import('../.predictor-check/samples.mjs');});
const {pushGraphicsState,popGraphicsState,concatTransformationMatrix,drawObject}=await import('pdf-lib');const {deflateSync}=await import('node:zlib');const {writeFile,mkdir}=await import('node:fs/promises');
const width=400,height=500,channels=3,row=width*channels,samples=new Uint8Array(row*height);for(let i=0;i<samples.length;i++)samples[i]=(i*17+(i>>8)*31)&255;
const paeth=(a,b,c)=>{const p=a+b-c,pa=Math.abs(p-a),pb=Math.abs(p-b),pc=Math.abs(p-c);return pa<=pb&&pa<=pc?a:pb<=pc?b:c;};
for(const filter of [0,1,2,3,4]){
 const encoded=new Uint8Array((row+1)*height);
 for(let y=0;y<height;y++){encoded[y*(row+1)]=filter;for(let x=0;x<row;x++){const at=y*row+x,a=x>=3?samples[at-3]:0,b=y?samples[at-row]:0,c=y&&x>=3?samples[at-row-3]:0,prediction=[0,a,b,Math.floor((a+b)/2),paeth(a,b,c)][filter];encoded[y*(row+1)+x+1]=(samples[at]-prediction)&255;}}
 const doc=await PDFDocument.create(),params=doc.context.obj({Predictor:15,Colors:3,Columns:width,BitsPerComponent:8});assert.deepEqual(imageSamples(encoded,width,height,channels,params),samples);
 const stream=PDFRawStream.of(doc.context.obj({Type:'XObject',Subtype:'Image',Width:width,Height:height,ColorSpace:'DeviceRGB',BitsPerComponent:8,Filter:'FlateDecode',DecodeParms:params}),new Uint8Array(deflateSync(encoded,{level:0}))),ref=doc.context.register(stream);
 const page=doc.addPage([width,height]);page.node.setXObject(PDFName.of('Scan'),ref);page.drawText('PNG scan with selectable caption',{x:20,y:height-20});page.pushOperators(pushGraphicsState(),concatTransformationMatrix(width,0,0,height,0,0),drawObject('Scan'),popGraphicsState());
 const bytes=await doc.save(),opened=await PDFDocument.load(bytes);assert.equal(await optimizeJPEGImages(opened,undefined,{quality:.7,maxDimension:300}),1);
 const updated=opened.context.enumerateIndirectObjects().map(([,o])=>o).find(o=>o instanceof PDFRawStream&&o.dict.get(PDFName.of('Subtype'))?.toString()==='/Image');assert.equal(updated.dict.get(PDFName.of('Filter')).toString(),'/DCTDecode');assert.equal(updated.dict.has(PDFName.of('DecodeParms')),false);
 const decoded=await loadImage(Buffer.from(updated.contents));assert.equal(decoded.width,240);assert.equal(decoded.height,300);assert.ok((await opened.save()).length<bytes.length);
 if(filter===4){await mkdir('.compression-fixtures',{recursive:true});await writeFile('.compression-fixtures/png-scan.pdf',bytes);}
}
const unsupported=await PDFDocument.create(),img=await unsupported.embedJpg(native.toBuffer('image/jpeg',100));unsupported.addPage([500,600]).drawImage(img);await unsupported.save();const obj=unsupported.context.lookup(img.ref);obj.dict.set(PDFName.of('SMask'),unsupported.context.register(unsupported.context.obj({})));const saved=obj.contents.slice();assert.equal(await optimizeJPEGImages(unsupported),0);assert.deepEqual(obj.contents,saved);
assert.throws(()=>imageSamples(new Uint8Array(1),width,height,channels),/Unexpected image/);
console.log('PASS Flate scans, all five PNG prediction filters, resized JPEG dictionaries and masked-image preservation.');
