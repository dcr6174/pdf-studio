import assert from 'node:assert/strict';
import {readFile,writeFile,mkdtemp,rm} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import ts from 'typescript';
import {PDFDocument,StandardFonts,degrees} from 'pdf-lib';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const directory=await mkdtemp(path.join(root,'checks','.watermark-'));
const originalFetch=globalThis.fetch;
try{
 for(const name of ['watermark-pdf','page-geometry','form-safe']){
  const source=await readFile(path.join(root,'lib',name+'.ts'),'utf8');
  const js=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText.replace(/from '(\.\/[^']+)'/g,"from '$1.mjs'");
  await writeFile(path.join(directory,name+'.mjs'),js);
 }
 const {watermarkPDF,watermarkPages,defaultWatermark}=await import(pathToFileURL(path.join(directory,'watermark-pdf.mjs')).href);
 const fontBytes=await readFile(path.join(root,'public/fonts/NotoSans-Regular.ttf'));
 globalThis.fetch=async(url)=>{assert.equal(url,'/fonts/NotoSans-Regular.ttf');return new Response(fontBytes);};
 const source=await PDFDocument.create(),font=await source.embedFont(StandardFonts.Helvetica);
 source.setTitle('Watermark regression');
 for(let i=0;i<3;i++){const page=source.addPage([612,792]);page.drawText('Original page '+(i+1),{font,x:40,y:50,size:14});if(i===1){page.setRotation(degrees(90));page.setCropBox(20,30,560,730);}}
 const input=await source.save();
 assert.deepEqual(watermarkPages(defaultWatermark,3),[0,1,2]);
 assert.deepEqual(watermarkPages({...defaultWatermark,scope:'custom',range:'3, 1-2, 2'},3),[0,1,2]);
 for(const range of ['', '0','4','2-1','1,,2','one'])assert.throws(()=>watermarkPages({...defaultWatermark,scope:'custom',range},3));
 assert.throws(()=>watermarkPages({...defaultWatermark,text:' '},3));
 assert.throws(()=>watermarkPages({...defaultWatermark,opacity:0},3));
 const canvas=await import('@napi-rs/canvas');
 globalThis.DOMMatrix=canvas.DOMMatrix;globalThis.ImageData=canvas.ImageData;globalThis.Path2D=canvas.Path2D;
 const {getDocument}=await import('pdfjs-dist/legacy/build/pdf.mjs');
 const standardFontDataUrl=path.join(root,'node_modules/pdfjs-dist/standard_fonts/')+path.sep;
 async function texts(bytes){const doc=await getDocument({data:bytes.slice(),useSystemFonts:false,standardFontDataUrl}).promise;try{const result=[];for(let i=1;i<=doc.numPages;i++)result.push((await (await doc.getPage(i)).getTextContent()).items.map(item=>item.str).join(' '));return result;}finally{await doc.destroy();}}
 for(const position of ['center','top','bottom'])for(const angle of [45,0,-45]){
  const bytes=await watermarkPDF(input,{...defaultWatermark,text:'CONFIDENTIAL — Review',position,angle});const out=await PDFDocument.load(bytes);
  assert.equal(out.getPageCount(),3);assert.equal(out.getTitle(),'Watermark regression');assert.equal(out.getPage(1).getRotation().angle,90);assert.deepEqual(out.getPage(1).getCropBox(),{x:20,y:30,width:560,height:730});
  assert((await texts(bytes)).every(text=>text.includes('Original page')&&text.includes('CONFIDENTIAL')));
 }
 const custom={...defaultWatermark,scope:'custom',range:'2'};
 const output=await watermarkPDF(input,custom),result=await texts(output);
 assert(!result[0].includes('DRAFT'));assert(result[1].includes('DRAFT'));assert(!result[2].includes('DRAFT'));
 const preview=await watermarkPDF(input,custom,undefined,1);
 async function pixels(bytes){const doc=await getDocument({data:bytes.slice(),useSystemFonts:false,standardFontDataUrl}).promise;try{const page=await doc.getPage(2),viewport=page.getViewport({scale:.7}),surface=canvas.createCanvas(viewport.width,viewport.height);await page.render({canvasContext:surface.getContext('2d'),viewport}).promise;return surface.toBuffer('image/png');}finally{await doc.destroy();}}
 assert.deepEqual(await pixels(output),await pixels(preview));
 assert((await texts(await watermarkPDF(input,{...defaultWatermark,text:'A long watermark '.repeat(7).trim(),size:120}))).every(text=>text.includes('A long watermark')));
 await assert.rejects(()=>watermarkPDF(input,{...defaultWatermark,text:'🚀'}),/cannot display/);
 const form=await PDFDocument.create(),page=form.addPage([612,792]),field=form.getForm().createTextField('name');field.setText('Alice');field.addToPage(page,{x:150,y:330,width:300,height:35});
 const formBytes=await form.save(),kept=await PDFDocument.load(await watermarkPDF(formBytes,defaultWatermark));assert.equal(kept.getForm().getTextField('name').getText(),'Alice');
 const flattened=await PDFDocument.load(await watermarkPDF(formBytes,{...defaultWatermark,flatten:true}));assert.equal(flattened.getForm().getFields().length,0);
 const controller=new AbortController();controller.abort();await assert.rejects(()=>watermarkPDF(input,defaultWatermark,controller.signal));
 console.log('Watermark checks passed: page targeting, text preservation, rotation/crops, fitting, preview/export pixels, forms and cancellation.');
}finally{globalThis.fetch=originalFetch;await rm(directory,{recursive:true,force:true});}
