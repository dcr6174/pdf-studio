import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir,rm} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import ts from 'typescript';
import {createCanvas,Image,loadImage} from '@napi-rs/canvas';
import {PDFDocument} from 'pdf-lib';

const temp='.printables-check';await mkdir(temp,{recursive:true});
const transpile=source=>ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
await writeFile('lib/.verify-printables-model.mjs',transpile(await readFile('lib/lab-printables.ts','utf8')));
await writeFile('lib/.verify-printables-render.mjs',transpile((await readFile('lib/lab-printables-render.ts','utf8')).replace("'./lab-printables'","'./.verify-printables-model.mjs'")));
const m=await import('../lib/.verify-printables-model.mjs'),r=await import('../lib/.verify-printables-render.mjs');
// Use real raster canvases in Node; browser UI checks are a separate step.
globalThis.document={createElement:tag=>{assert.equal(tag,'canvas');return createCanvas(1,1);}};
Image.prototype.decode=function(){return this.complete?Promise.resolve():new Promise((resolve,reject)=>{this.onload=resolve;this.onerror=reject;});};globalThis.Image=Image;
const signal=new AbortController().signal;
try{
 const words=m.bingoWords(m.sampleBingoWords),boards=m.bingoBoards(words,40,17,true);
 assert.equal(new Set(boards.map(b=>JSON.stringify(b))).size,40);boards.forEach(b=>{assert.equal(b.length,25);assert.equal(b[12],'FREE');assert.equal(new Set(b).size,25);});
 assert.deepEqual(boards,m.bingoBoards(words,40,17,true));assert.notDeepEqual(boards,m.bingoBoards(words,40,18,true));
 assert.throws(()=>m.bingoBoards(['one'],2,1,true));assert.throws(()=>m.bingoBoards(words,1.5,1,true));
 assert.equal(m.bingoWords('same\nsame\n other ').length,2);
 assert.deepEqual(m.zinePanels.map(p=>p.page),[4,3,2,1,5,6,7,0]);assert(m.zinePanels.slice(0,4).every(p=>p.turn));assert(m.zinePanels.slice(4).every(p=>!p.turn));
 assert.deepEqual(m.flashcardBackSlots('long'),[1,0,3,2,5,4]);assert.deepEqual(m.flashcardBackSlots('short'),[4,5,2,3,0,1]);
 for(const flip of ['long','short'])for(let i=0;i<6;i++){const opposite=flip==='long'?Math.floor(i/2)*2+1-i%2:(2-Math.floor(i/2))*2+i%2;assert.equal(m.flashcardBackSlots(flip)[opposite],i);}
 const settings=m.defaultPrintableSettings(),plan=m.posterPlan(720,900,{...settings,posterWidth:300});assert.equal(plan.tiles.length,4);
 assert.equal(plan.tileWidth-plan.stepX,settings.overlap);assert.equal(plan.tileHeight-plan.stepY,settings.overlap);
 assert(plan.cols*plan.stepX+settings.overlap>=plan.width);assert(plan.rows*plan.stepY+settings.overlap>=plan.height);
 assert.throws(()=>m.posterPlan(100,10000,{...settings,posterWidth:2000}));
 const blank=new Uint8ClampedArray(32*32*4).fill(255),plain=m.coloringPixels(blank,32,32,80,1,1);assert(plain.every(v=>v===255));
 const transparent=new Uint8ClampedArray(32*32*4);assert(m.coloringPixels(transparent,32,32,80,1,0).every(v=>v===255));
 const square=blank.slice();for(let y=8;y<24;y++)for(let x=8;x<24;x++){const i=(y*32+x)*4;square[i]=square[i+1]=square[i+2]=0;}
 const edges=m.coloringPixels(square,32,32,80,1,0);assert.equal(edges[(8*32+8)*4],0);assert.equal(edges[(16*32+16)*4],255);assert.equal(edges[(2*32+2)*4],255);
 const bold=m.coloringPixels(square,32,32,80,3,0);assert(bold.filter(v=>v===0).length>edges.filter(v=>v===0).length);
 for(const mode of m.printableTools.map(t=>t.slug)){
   const count=mode==='mini-zine-maker'?8:mode==='photo-booth-strips'?4:1,pictures=r.samplePictures(count);
   const s={...settings,bingoCount:3,posterWidth:300};const result=await r.renderPrintable(mode,pictures,s,signal);
   const expected={'mini-zine-maker':1,'photo-booth-strips':1,'custom-bingo':3,'giant-poster':4,'photo-coloring-page':1,'printable-flashcards':2}[mode];assert.equal(result.sheets.length,expected);
   const bytes=await r.printablePDF(result,signal),pdf=await PDFDocument.load(bytes);assert.equal(pdf.getPageCount(),expected);
   const first=result.sheets[0];assert(Math.abs(pdf.getPage(0).getWidth()-first.width*72/25.4)<.001);
   await writeFile(`${temp}/${mode}.pdf`,bytes);await writeFile(`${temp}/${mode}.png`,first.canvas.toBuffer('image/png'));
   // Independent PDF rasterizer checks actual exported content, not just metadata.
   execFileSync('pdftoppm',['-f','1','-singlefile','-scale-to','500','-png',`${temp}/${mode}.pdf`,`${temp}/${mode}-rendered`]);
   const rendered=await loadImage(`${temp}/${mode}-rendered.png`),canvas=createCanvas(rendered.width,rendered.height),c=canvas.getContext('2d');c.drawImage(rendered,0,0);const pixels=c.getImageData(0,0,canvas.width,canvas.height).data;let ink=0;for(let i=0;i<pixels.length;i+=4)if(pixels[i]<220||pixels[i+1]<220||pixels[i+2]<220)ink++;assert(ink>100,`${mode} must export visible content`);
   r.releaseResult(result);console.log('PASS:',mode,'real PDF, page count, dimensions and independent raster');
 }
 await assert.rejects(r.renderPrintable('mini-zine-maker',[],settings,signal),/eight/);
 await assert.rejects(r.renderPrintable('photo-booth-strips',r.samplePictures(3),settings,signal),/four/);
 await assert.rejects(r.renderPrintable('printable-flashcards',[],{...settings,cards:[{question:'',answer:'x'}]},signal),/question and answer/);
 const abort=new AbortController();abort.abort();await assert.rejects(r.renderPrintable('custom-bingo',[],settings,abort.signal));
 for(const duplex of ['long','short']){const partial=await r.renderPrintable('printable-flashcards',[],{...settings,duplex,cards:[...settings.cards,{question:'Seven?',answer:'Seven.'}]},signal);assert.equal(partial.sheets.length,4);const pdf=await PDFDocument.load(await r.printablePDF(partial,signal));assert.equal(pdf.getPageCount(),4);r.releaseResult(partial);}
 console.log('PASS: seeded unique bingo, zine orientation, duplex mapping, poster coverage/overlap, edge filtering, validation, cancellation and partial flashcard sheets');
}finally{await rm('lib/.verify-printables-model.mjs',{force:true});await rm('lib/.verify-printables-render.mjs',{force:true});}
