import assert from 'node:assert/strict';
import {build} from 'vite';
import {PDFDocument,StandardFonts,PDFName,PDFArray,PDFRawStream,decodePDFRawStream} from 'pdf-lib';
await build({configFile:false,logLevel:'error',build:{ssr:'lib/native-text.ts',outDir:'work/native-text',rollupOptions:{output:{entryFileNames:'native.mjs'}}}});
const {replaceExistingText}=await import('../work/native-text/native.mjs');
async function fixture(fontName=StandardFonts.Helvetica){const d=await PDFDocument.create();const f=await d.embedFont(fontName);d.addPage([400,600]).drawText('Original text',{x:30,y:500,font:f,size:16});return PDFDocument.load(await d.save());}
const d=await fixture();assert.equal(await replaceExistingText(d,'Original','Edited'),1);const saved=await PDFDocument.load(await d.save());const contents=saved.getPage(0).node.Contents();assert(contents instanceof PDFArray);const stream=contents.lookup(0);assert(stream instanceof PDFRawStream);const decoded=String.fromCharCode(...decodePDFRawStream(stream).decode());assert(decoded.includes('(Edited text)'));assert(!decoded.includes('4F726967696E616C'));assert.equal(saved.getPageCount(),1);
await assert.rejects(()=>replaceExistingText(awaitableDummy(),'x','y'));
function awaitableDummy(){return {getPages:()=>[]};}
await assert.rejects(()=>replaceExistingText(d,'Edited','Replacement that is far too wide'),/wider/);
await assert.rejects(()=>replaceExistingText(d,'absent','short'),/No supported match/);
await assert.rejects(()=>replaceExistingText(d,'Edited','తెలుగు'),/English/);
const custom=await fixture();const resources=custom.getPage(0).node.Resources().lookup(PDFName.of('Font'));const dict=resources.lookup(resources.keys()[0]);dict.set(PDFName.of('Encoding'),custom.context.obj({Type:'Encoding'}));await assert.rejects(()=>replaceExistingText(custom,'Original','Edited'),/unsupported font/);
console.log('PASS: real operand replacement, saved PDF integrity, width guard, missing match and Unicode rejection');
