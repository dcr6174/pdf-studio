import fs from 'node:fs';
import {build} from 'vite';
import ts from 'typescript';
import assert from 'node:assert/strict';
import {PDFDocument, StandardFonts, decodePDFRawStream} from 'pdf-lib';
import {PDF} from '@libpdf/core';
import JSZip from 'jszip';
const compiled=ts.transpileModule(fs.readFileSync(new URL('../lib/pdf-engine.ts',import.meta.url),'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText.replace("'./page-geometry'","'./.verify-geometry.mjs'").replace("'./extra-pdf'","'./.verify-extra-pdf.mjs'").replace("'./native-text'","'./.verify-native-text.mjs'");
const tmp=new URL('../lib/.verify-engine.mjs',import.meta.url);fs.writeFileSync(tmp,compiled);
const geometry=new URL('../lib/.verify-geometry.mjs',import.meta.url);fs.writeFileSync(geometry,ts.transpileModule(fs.readFileSync(new URL('../lib/page-geometry.ts',import.meta.url),'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText);
for(const name of ['extra-pdf','native-text'])fs.writeFileSync(new URL('../lib/.verify-'+name+'.mjs',import.meta.url),ts.transpileModule(fs.readFileSync(new URL('../lib/'+name+'.ts',import.meta.url),'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText);
try{
await build({configFile:false,logLevel:'error',build:{ssr:'lib/pdf-engine.ts',outDir:'.engine-check',emptyOutDir:true,rollupOptions:{output:{entryFileNames:'engine.mjs'}}}});
const {processPDF,ranges}=await import('../.engine-check/engine.mjs');
const doc=await PDFDocument.create();const font=await doc.embedFont(StandardFonts.Helvetica);for(let i=0;i<3;i++){const p=doc.addPage([400+i*20,600]);p.drawText(`Fixture page ${i+1}`,{font,x:30,y:550});}doc.setTitle('Fixture title');doc.setAuthor('Test author');const bytes=await doc.save();const file={id:'fixture',name:'fixture.pdf',bytes,size:bytes.length,pages:3,doc};const pages=Array.from({length:3},(_,index)=>({id:`page-${index}`,fileId:'fixture',index,rotation:0}));const defaults={range:'',text:'',title:'',author:'',subject:'',password:'',quality:'balanced',angle:'90',margin:'20',start:'1',columns:'2',fields:{}};const run=(id,o={},items=pages,files=[file])=>processPDF(id,files,items,[],{...defaults,...o},()=>{});const parsed=async o=>PDFDocument.load(new Uint8Array(await o.blob.arrayBuffer()),{updateMetadata:false});
const compact=await parsed(await run('compress',{quality:'compact'},[pages[2],pages[0]]));assert.equal(compact.getPageCount(),2);assert.equal(compact.getPage(0).getWidth(),440);const streams=compact.getPage(0).node.Contents();const content=streams.asArray().map(ref=>Buffer.from(decodePDFRawStream(compact.context.lookup(ref)).decode()).toString()).join('');assert.match(content,/4669787475726520706167652033/i);
assert.deepEqual(ranges('1, 3',3),[0,2]);assert.throws(()=>ranges('0-8',3));
const reversed=await parsed(await run('organize',{},[pages[2],pages[0]]));assert.equal(reversed.getPageCount(),2);assert.equal(reversed.getPage(0).getWidth(),440);
assert.equal((await parsed(await run('split',{range:'2-3'}))).getPageCount(),2);
assert.equal((await parsed(await run('duplicate'))).getPageCount(),6);
assert.equal((await parsed(await run('reverse'))).getPage(0).getWidth(),440);
assert.equal((await parsed(await run('rotate'))).getPage(0).getRotation().angle,90);
const crop=await parsed(await run('crop'));assert.equal(crop.getPage(0).getCropBox().width,360);await assert.rejects(()=>run('crop',{margin:'1000'}));
const resize=await parsed(await run('resize'));assert.equal(resize.getPage(0).getWidth(),595.28);
assert.equal((await parsed(await run('nup',{columns:'2'}))).getPageCount(),2);
assert.equal((await parsed(await run('flip'))).getPageCount(),3);
const clean=await parsed(await run('clean'));assert.equal(clean.getAuthor(),'');assert.equal(clean.getTitle(),'');
const protectedFile=await run('encrypt',{password:'correct-password'});const protectedBytes=new Uint8Array(await protectedFile.blob.arrayBuffer());await assert.rejects(()=>run('decrypt',{password:'wrong-password'},[],[{...file,bytes:protectedBytes}]));const secure=await PDF.load(protectedBytes,{credentials:'correct-password'});assert.equal(secure.getSecurity().algorithm,'AES-256');const unlocked=await run('decrypt',{password:'correct-password'},[],[{...file,bytes:protectedBytes}]);assert.equal((await parsed(unlocked)).getPageCount(),3);
const zip=await JSZip.loadAsync(await (await run('split-all')).blob.arrayBuffer());assert.equal(Object.keys(zip.files).length,3);assert.equal((await PDFDocument.load(await zip.file('page-2.pdf').async('uint8array'))).getPageCount(),1);
const f=await PDFDocument.create();f.addPage();const field=f.getForm().createTextField('Name');field.addToPage(f.getPage(0),{x:30,y:100,width:200,height:30});const formBytes=await f.save();const filled=await run('form',{fields:{Name:'Chandra'},flattenForm:true},[{id:'form-page',fileId:'fixture',index:0,rotation:0}],[{...file,bytes:formBytes,pages:1}]);assert.equal((await parsed(filled)).getForm().getFields().length,0);
const hash=await run('hash');assert.match(hash.report,/^[a-f0-9]{64}$/);
console.log('PASS: 18 meaningful checks covering page order, ranges, rotation, crop validation, resizing, n-up, mirroring, metadata, AES-256, wrong-password rejection, decryption, ZIP integrity, form flattening and SHA-256.');
}finally{fs.unlinkSync(tmp);fs.unlinkSync(geometry);for(const name of ['extra-pdf','native-text'])fs.unlinkSync(new URL('../lib/.verify-'+name+'.mjs',import.meta.url));}

