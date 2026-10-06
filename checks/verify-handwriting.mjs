import fs from 'node:fs';
import assert from 'node:assert/strict';
import {build} from 'vite';
import {PDFDocument,decodePDFRawStream} from 'pdf-lib';
import {execFileSync} from 'node:child_process';
import {createCanvas,GlobalFonts,loadImage} from '@napi-rs/canvas';
await build({configFile:false,logLevel:'error',build:{ssr:'lib/handwriting.ts',outDir:'.handwriting-check',emptyOutDir:true,rollupOptions:{output:{entryFileNames:'handwriting.mjs'}}}});
const {createHandwritingPDF,handwritingFonts,handwritingDefaults}=await import('../.handwriting-check/handwriting.mjs');
const root=new URL('../',import.meta.url),font=id=>new Uint8Array(fs.readFileSync(new URL('public/fonts/handwriting/'+id+'.ttf',root)));
const contents=doc=>doc.getPages().map(page=>page.node.Contents().asArray().map(ref=>Buffer.from(decodePDFRawStream(doc.context.lookup(ref)).decode()).toString()).join(''));
assert.equal(handwritingFonts.length,20);
for(const [id] of handwritingFonts){assert.match(fs.readFileSync(new URL('public/fonts/handwriting/'+id+'-OFL.txt',root),'utf8'),/SIL OPEN FONT LICENSE/);const output=await createHandwritingPDF('Hello notebook! 0123456789',handwritingDefaults,'text-to-handwriting',font(id));const doc=await PDFDocument.load(output.bytes);assert.equal(doc.getPageCount(),1);fs.writeFileSync(new URL('.handwriting-check/font-'+id+'.pdf',root),output.bytes);assert.match(contents(doc)[0],/BT/);assert.match(contents(doc)[0],/Tj|TJ/);assert.ok(doc.getPage(0).node.Resources().get('Font')||contents(doc)[0].includes('Tf'));}
// Independent raster check: compare visible ink to the original font. Text extraction
// alone missed dropped glyph outlines in Allura, Caveat, Caveat Brush and Kalam.
for(const [id] of handwritingFonts){
 const file=new URL('.handwriting-check/font-'+id,root).pathname;
 execFileSync('pdftoppm',['-singlefile','-scale-to','1200','-png',file+'.pdf',file]);
 const rendered=await loadImage(file+'.png');const canvas=createCanvas(1000,160),ctx=canvas.getContext('2d');
 ctx.fillStyle='white';ctx.fillRect(0,0,1000,160);ctx.drawImage(rendered,-55,-58);
 const count=()=>{const data=ctx.getImageData(0,0,725,82).data;let pixels=0;for(let i=0;i<data.length;i+=4)if(data[i]*.299+data[i+1]*.587+data[i+2]*.114<190)pixels++;return pixels;};
 const actual=count();GlobalFonts.registerFromPath(new URL('public/fonts/handwriting/'+id+'.ttf',root).pathname,'Check-'+id);
 ctx.fillStyle='white';ctx.fillRect(0,0,1000,160);ctx.fillStyle='#243c80';ctx.font=`${18*1200/841.89}px "Check-${id}"`;ctx.fillText('Hello notebook! 0123456789',0,50);
 const expected=count();assert.ok(expected>100);assert.ok(actual>expected*.45,`${id}: exported glyphs missing (${actual}/${expected} pixels)`);
}
const body=Array.from({length:90},(_,i)=>'Paragraph '+i+': '+('Readable handwritten notes preserve every word. '.repeat(5))).join('\n\n');
const output=await createHandwritingPDF(body,handwritingDefaults,'pdf-to-handwriting',font('patrickhand'));
assert.ok(output.pages>1);const doc=await PDFDocument.load(output.bytes);assert.equal(output.pages,doc.getPageCount());assert.ok(contents(doc).every(c=>c.includes('BT')));
fs.writeFileSync(new URL('.handwriting-check/notes.pdf',root),output.bytes);
const extracted=execFileSync('pdftotext',[new URL('.handwriting-check/notes.pdf',root).pathname,'-']).toString();assert.ok(extracted.includes('Paragraph 0'));assert.ok(extracted.includes('Paragraph 89'));assert.equal((extracted.replace(/\s+/g,' ').match(/Readable handwritten notes preserve every word/g)||[]).length,450);
for(const paper of ['plain','ruled','wide','double','grid','dots']){const output=await createHandwritingPDF('',{...handwritingDefaults,paper,blankPages:3},'notebook-maker',font('caveat'));const doc=await PDFDocument.load(output.bytes);assert.equal(doc.getPageCount(),3);assert.ok(contents(doc).every(c=>c.includes(' rg')&&c.includes('f')));}
const practice=await createHandwritingPDF('Practise your letters',{...handwritingDefaults},'handwriting-practice',font('patrickhand'));assert.match(contents(await PDFDocument.load(practice.bytes))[0],/gs/);
const longWord=await createHandwritingPDF('abcdefghij'.repeat(500),handwritingDefaults,'text-to-handwriting',font('patrickhand'));assert.ok(longWord.pages>1);
await assert.rejects(()=>createHandwritingPDF('🦄',handwritingDefaults,'text-to-handwriting',font('caveat')),/cannot write/);
await assert.rejects(()=>createHandwritingPDF('x'.repeat(200001),handwritingDefaults,'text-to-handwriting',font('caveat')),/200,000/);
await assert.rejects(()=>createHandwritingPDF('text',{...handwritingDefaults,size:NaN},'text-to-handwriting',font('caveat')),/invalid/);
await assert.rejects(()=>createHandwritingPDF('text',{...handwritingDefaults,ink:'red'},'text-to-handwriting',font('caveat')),/invalid/);
await assert.rejects(()=>createHandwritingPDF('\n'.repeat(5000),handwritingDefaults,'text-to-handwriting',font('caveat')),/100 pages/);
const stop=new AbortController();stop.abort();await assert.rejects(()=>createHandwritingPDF('text',handwritingDefaults,'text-to-handwriting',font('caveat'),stop.signal),{name:'AbortError'});
const midway=new AbortController();setTimeout(()=>midway.abort(),0);await assert.rejects(()=>createHandwritingPDF(body,handwritingDefaults,'text-to-handwriting',font('caveat'),midway.signal),{name:'AbortError'});
console.log('PASS: 20 licensed fonts, text integrity across pages, six paper styles, practice, long-word wrapping, validation and cancellation.');
