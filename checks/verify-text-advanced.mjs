import assert from 'node:assert/strict';import {readFile} from 'node:fs/promises';import {PDFDocument,StandardFonts,degrees} from 'pdf-lib';import {createRequire} from 'node:module';import {build} from 'vite';import fontkit from '@pdf-lib/fontkit';
await build({configFile:false,logLevel:'error',build:{ssr:'lib/advanced-text-edit.ts',outDir:'.text-advanced-check',emptyOutDir:true,rollupOptions:{output:{entryFileNames:'engine.mjs'}}}});
await build({configFile:false,logLevel:'error',build:{ssr:'lib/online-text-engine.ts',outDir:'.text-advanced-check',emptyOutDir:false,rollupOptions:{output:{entryFileNames:'native.mjs'}}}});
const require=createRequire(import.meta.url);globalThis.crypto??=require('node:crypto').webcrypto;globalThis.fetch=async url=>{try{return new Response(await readFile(String(url).includes('pdfium')?'node_modules/@embedpdf/pdfium/dist/pdfium.wasm':'public'+url));}catch{return new Response('',{status:404});}};
const {editText}=await import('../.text-advanced-check/engine.mjs');const {OnlineTextDocument,textEngine}=await import('../.text-advanced-check/native.mjs');const m=await textEngine();
const pdf=await PDFDocument.create(),font=await pdf.embedFont(StandardFonts.Helvetica),page=pdf.addPage([612,792]);page.drawText('Original text',{x:50,y:640,size:20,font});page.drawText('Unchanged content',{x:50,y:580,size:20,font});const bytes=await pdf.save();
for(const value of ['Updated text','Updated café','नमस्ते दुनिया','தமிழ் மொழி','مرحبا بالعالم','English العربية 123','বাংলা ভাষা','తెలుగు భాష','ಕನ್ನಡ ಭಾಷೆ','മലയാളം ഭാഷ','ગુજરાતી ભાષા','ਪੰਜਾਬੀ ਭਾਸ਼ਾ']){const doc=new OnlineTextDocument(m,bytes),o=doc.objects(0).find(o=>o.text==='Original text');try{const result=await editText(bytes,0,[o.index],value,{fit:true});const reopened=new OnlineTextDocument(m,result.bytes);const view=reopened.objects(0);assert(view.some(o=>o.text===value),JSON.stringify(view.map(o=>o.text)));assert(view.some(o=>o.text==='Unchanged content'));console.log('PASS',value,result.fontStatus);reopened.close();}catch(e){console.log('FAIL',value,e.message);throw e;}finally{doc.close();}}

// A shaped line remains a single selectable region and can be changed/deleted again.
const first=new OnlineTextDocument(m,bytes),target=first.objects(0)[0];first.close();
const shaped=await editText(bytes,0,[target.index],'مرحبا بالعالم',{fit:true});
const grouped=new OnlineTextDocument(m,shaped.bytes),group=grouped.objects(0).find(o=>o.text==='مرحبا بالعالم');assert.ok(group.members.length>1);grouped.close();
const deleted=await editText(shaped.bytes,0,[group.index],'',{fit:true});const clean=new OnlineTextDocument(m,deleted.bytes);assert.ok(!clean.objects(0).some(o=>o.text.includes('مرحبا')));assert.ok(clean.objects(0).some(o=>o.text==='Unchanged content'));clean.close();
const upload={id:'uploaded',name:'Uploaded sans',bytes:new Uint8Array(await readFile('public/fonts/NotoSans-Regular.ttf'))};
const uploaded=await editText(bytes,0,[target.index],'Uploaded font',{fit:true,font:upload});assert.ok(uploaded.fontStatus.includes('Uploaded sans'));
await assert.rejects(()=>editText(bytes,0,[target.index],'Too long '.repeat(100),{fit:true}),/too small/);
await assert.rejects(()=>editText(new TextEncoder().encode('broken'),0,[0],'x',{fit:true}),/cannot be opened/);
const full=await PDFDocument.create();full.registerFontkit(fontkit);const ef=await full.embedFont(upload.bytes,{subset:false});full.addPage([612,792]).drawText('Original',{x:50,y:650,size:20,font:ef});const fullDoc=new OnlineTextDocument(m,await full.save());assert.deepEqual(fullDoc.missingCharacters(0,fullDoc.objects(0)[0].index,'ZéЖ'),[]);fullDoc.close();
console.log('PASS grouped glyph re-edit/delete, uploaded font, unused embedded cmap coverage, overflow and malformed input');

{const source=await PDFDocument.create(),f=await source.embedFont(StandardFonts.Helvetica);for(const rotation of [0,90,180,270]){const p=source.addPage([612,792]);p.setRotation(degrees(rotation));p.drawText('First paragraph line goes here',{x:50,y:680,size:16,font:f});p.drawText('Second paragraph line goes here',{x:50,y:658,size:16,font:f});p.drawText('Last paragraph line goes here',{x:50,y:636,size:16,font:f});p.drawText('Unchanged content',{x:50,y:580,size:20,font:f});}const paragraphBytes=await source.save();
for(let page=0;page<4;page++){const d=new OnlineTextDocument(m,paragraphBytes),rows=d.objects(page).filter(o=>o.text.includes('paragraph'));const r=await editText(paragraphBytes,page,rows.map(o=>o.index),'A revised paragraph with enough words to wrap across the original selected area.',{fit:true,paragraph:true});const out=new OnlineTextDocument(m,r.bytes);assert(!out.objects(page).some(o=>o.text.includes('First paragraph')));assert(out.objects(page).some(o=>o.text==='Unchanged content'));assert(out.objects((page+1)%4).some(o=>o.text.includes('First paragraph')));out.close();d.close();console.log('PASS paragraph',page);}
}

{const formSource=await PDFDocument.create(),p=formSource.addPage([240,150]),font=await formSource.embedFont(StandardFonts.Helvetica);p.drawText('Nested original',{x:20,y:85,size:20,font});const formsPDF=await PDFDocument.create(),[embedded]=await formsPDF.embedPdf(await formSource.save()),page=formsPDF.addPage([612,792]);page.drawPage(embedded,{x:30,y:500});page.drawPage(embedded,{x:30,y:250});const formBytes=await formsPDF.save();const formDoc=new OnlineTextDocument(m,formBytes),objects=formDoc.objects(0);assert.equal(objects.length,2);const result=await editText(formBytes,0,[objects[0].index],'Nested updated',{fit:true});const check=new OnlineTextDocument(m,result.bytes);assert.equal(check.objects(0).filter(o=>o.text==='Nested original').length,1);assert.equal(check.objects(0).filter(o=>o.text==='Nested updated').length,1);check.close();formDoc.close();console.log('PASS repeated form instances edited independently');
}

// A line break must survive export without replacing neighbouring text.
for(const value of ['First\nSecond','नमस्ते\nदुनिया']){
 const source=new OnlineTextDocument(m,bytes),selected=source.objects(0).find(o=>o.text==='Original text');
 const result=await editText(bytes,0,[selected.index],value,{fit:true,multiline:true});
 const reopened=new OnlineTextDocument(m,result.bytes),objects=reopened.objects(0),lines=value.split('\n');
 assert(lines.every(line=>objects.some(o=>o.text===line)));
 assert(objects.find(o=>o.text===lines[1]).top>objects.find(o=>o.text===lines[0]).top);
 assert(objects.some(o=>o.text==='Unchanged content'));
 assert(!objects.some(o=>o.text==='Original text'));
 reopened.close();source.close();console.log('PASS exported line breaks',value);
}
{
 const source=new OnlineTextDocument(m,bytes),selected=source.objects(0).find(o=>o.text==='Original text');
 await assert.rejects(()=>editText(bytes,0,[selected.index],'One\nTwo\nThree\nFour',{fit:true,multiline:true}),/overlaps/);
 assert(source.objects(0).some(o=>o.text==='Original text'));
 source.close();console.log('PASS line breaks reject overlap and retain original document');
}
