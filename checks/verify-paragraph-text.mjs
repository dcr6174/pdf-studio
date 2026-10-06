import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {build} from 'vite';
import {PDFDocument,StandardFonts,degrees} from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import {spawnSync} from 'node:child_process';
await build({configFile:false,logLevel:'error',build:{ssr:'lib/online-text-engine.ts',outDir:'.paragraph-check',emptyOutDir:true,rollupOptions:{output:{entryFileNames:'engine.mjs'}}}});
const wasm=await readFile('node_modules/@embedpdf/pdfium/dist/pdfium.wasm');globalThis.fetch=async()=>new Response(wasm);
const {OnlineTextDocument,textEngine}=await import('../.paragraph-check/engine.mjs');
await build({configFile:false,logLevel:'error',build:{ssr:'lib/text-paragraph.ts',outDir:'.paragraph-group-check',emptyOutDir:true,rollupOptions:{output:{entryFileNames:'groups.mjs'}}}});
const {paragraphFor}=await import('../.paragraph-group-check/groups.mjs'),m=await textEngine();
for(const rotation of [0,90,180,270]){
 const pdf=await PDFDocument.create(),font=await pdf.embedFont(StandardFonts.Helvetica),page=pdf.addPage([500,700]);page.setRotation(degrees(rotation));
 for(const [i,line]of ['First original paragraph sentence.','Second original paragraph sentence.','Final original paragraph sentence.'].entries())page.drawText(line,{x:50,y:600-i*24,size:16,font});page.drawText('Unchanged footer',{x:50,y:60,size:12,font});
 const source=await pdf.save(),d=new OnlineTextDocument(m,source),view=d.inspect(0),rows=paragraphFor(view.objects,view.objects.find(o=>o.text.startsWith('First')).index);assert.equal(rows.length,3,'three aligned lines group at every page rotation');const ids=rows.map(o=>o.index),replacement='A rewritten paragraph flows across the existing lines. Original words are removed.';
 d.replaceParagraph(0,ids,replacement);const output=d.save(),reopened=new OnlineTextDocument(m,output),after=reopened.inspect(0),text=after.objects.map(o=>o.text).join(' ');assert.ok(text.includes('A rewritten paragraph'));assert.ok(!text.includes('original paragraph'));assert.ok(text.includes('Unchanged footer'));assert.equal(reopened.pageCount,1);
 if(rotation===0){await writeFile('/tmp/paragraph-edited.pdf',output);await writeFile('/tmp/paragraph-original.pdf',source);}
 const beforeRollback=text;assert.throws(()=>d.replaceParagraph(0,ids,'Too many words '.repeat(100)),/more lines/);const rollback=new OnlineTextDocument(m,d.save());assert.equal(rollback.inspect(0).objects.map(o=>o.text).join(' '),beforeRollback,'overflow rolls every object back');rollback.close();
 d.replaceParagraph(0,ids,'Short paragraph.');const short=new OnlineTextDocument(m,d.save());assert.equal(short.inspect(0).objects.filter(o=>o.text.includes('paragraph')).length,1,'unused original lines are emptied');short.close();reopened.close();d.close();
}
// Embedded fonts exercise the actual save/reopen path, not browser-only text.
const embedded=await PDFDocument.create();embedded.registerFontkit(fontkit);const ef=await embedded.embedFont(await readFile('public/fonts/NotoSans-Regular.ttf'),{subset:true}),ep=embedded.addPage([500,700]);
for(const [i,line]of ['First original paragraph sentence.','Second original paragraph sentence.','Final original paragraph sentence.'].entries())ep.drawText(line,{x:50,y:600-i*24,size:16,font:ef});
ep.drawText('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz .,',{x:10,y:20,size:5,font:ef,opacity:0});
const eb=await embedded.save(),ed=new OnlineTextDocument(m,eb),ev=ed.inspect(0),eg=paragraphFor(ev.objects,ev.objects.find(o=>o.text.startsWith('First')).index);assert.equal(eg.length,3);ed.replaceParagraph(0,eg.map(o=>o.index),'A rewritten paragraph flows across the existing lines. Original words are removed.');const eo=ed.save();await writeFile('/tmp/paragraph-embedded.pdf',eo);const er=new OnlineTextDocument(m,eo);assert.ok(er.inspect(0).objects.some(o=>o.text.startsWith('A rewritten')));assert.ok(!er.inspect(0).objects.some(o=>o.text.startsWith('First original')));er.close();ed.close();
const independent=spawnSync('pdftotext',['-layout','/tmp/paragraph-embedded.pdf','-'],{encoding:'utf8'});assert.equal(independent.status,0,independent.stderr);assert.ok(independent.stdout.includes('A rewritten paragraph'));assert.ok(!independent.stdout.includes('First original paragraph'));
const obj=(index,left,top,key='font')=>({index,text:'line',font:'Helvetica',left:0,top:0,width:.3,height:.03,layout:{left,right:left+150,top,bottom:top-16,height:16,key}});
assert.equal(paragraphFor([obj(0,50,600),obj(1,250,600),obj(2,50,576),obj(3,250,576)],0).length,1,'side-by-side columns never combine');
assert.equal(paragraphFor([obj(0,50,600),obj(1,50,576,'other')],0).length,1,'mixed font lines never combine');
console.log('PASS: paragraph reflow, searchable replacement, old text removal, shortened lines, unchanged footer, overflow rollback, four rotations, column and mixed-font isolation.');
// Opt-in flow creates real text objects and moves following page content.
const flowPDF=await PDFDocument.create(),flowFont=await flowPDF.embedFont(StandardFonts.Helvetica),flowPage=flowPDF.addPage([500,700]);for(const [i,line]of ['First original paragraph sentence.','Second original paragraph sentence.','Final original paragraph sentence.'].entries())flowPage.drawText(line,{x:50,y:600-i*24,size:16,font:flowFont});flowPage.drawText('Following content',{x:50,y:350,size:12,font:flowFont});const fd=new OnlineTextDocument(m,await flowPDF.save()),fv=fd.inspect(0),fg=paragraphFor(fv.objects,fv.objects.find(o=>o.text.startsWith('First')).index),following=fv.objects.find(o=>o.text==='Following content');fd.replaceParagraph(0,fg.map(o=>o.index),'First new line.\nSecond new line.\nThird new line.\nFourth new line.',true);const fr=new OnlineTextDocument(m,fd.save()),fafter=fr.inspect(0);assert.ok(fafter.objects.some(o=>o.text==='Fourth new line.'));assert.ok(fafter.objects.find(o=>o.text==='Following content').layout.top<following.layout.top-20);assert.ok(!fafter.objects.some(o=>o.text.includes('original paragraph')));fr.close();fd.close();
const overflowDoc=new OnlineTextDocument(m,await flowPDF.save()),ov=overflowDoc.inspect(0),og=paragraphFor(ov.objects,ov.objects.find(o=>o.text.startsWith('First')).index),before=ov.objects.map(o=>o.text).join('|');assert.throws(()=>overflowDoc.replaceParagraph(0,og.map(o=>o.index),'New line.\n'.repeat(40),true),/page/);assert.equal(overflowDoc.inspect(0).objects.map(o=>o.text).join('|'),before);overflowDoc.close();console.log('PASS: opt-in paragraph growth, explicit newlines, following content movement and page-overflow rollback.');
