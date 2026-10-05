import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {PDFDocument} from 'pdf-lib';
import {build} from 'vite';
await build({configFile:false,logLevel:'error',build:{ssr:'lib/pdf-engine.ts',outDir:'.form-engine-check',emptyOutDir:true,rollupOptions:{output:{entryFileNames:'engine.mjs'}}}});
const {assemble}=await import('../.form-engine-check/engine.mjs');
const source=await PDFDocument.create(),page=source.addPage([400,600]),form=source.getForm();
const name=form.createTextField('Name');name.setText('Sample form');name.addToPage(page,{x:20,y:400,width:200,height:30});
const checked=form.createCheckBox('Accepted');checked.addToPage(page,{x:20,y:350,width:20,height:20});checked.check();
const select=form.createDropdown('Choice');select.addOptions(['First','Second']);select.select('Second');select.addToPage(page,{x:20,y:280,width:200,height:30});
form.updateFieldAppearances();const bytes=await source.save(),file={id:'one',name:'fixture.pdf',bytes,size:bytes.length,pages:1,doc:source},second={...file,id:'two'};
const out=await assemble([file,second],[{id:'p1',fileId:'one',index:0,rotation:0},{id:'p2',fileId:'two',index:0,rotation:0}],undefined,true),result=await out.save();
await mkdir('.form-fixture-check',{recursive:true});await writeFile('.form-fixture-check/source.pdf',bytes);await writeFile('.form-fixture-check/merged.pdf',result);
function render(args){const result=spawnSync('pdftoppm',args,{encoding:'utf8'});if(result.error)throw result.error;assert.equal(result.status,0,result.stderr);assert.ok(!/Syntax Error|Invalid XRef/.test(result.stderr),result.stderr);}
render(['-r','72','-singlefile','-f','1','.form-fixture-check/source.pdf','.form-fixture-check/source']);
const original=await readFile('.form-fixture-check/source.ppm');
for(let i=1;i<=2;i++){render(['-r','72','-singlefile','-f',String(i),'.form-fixture-check/merged.pdf',`.form-fixture-check/merged-${i}`]);const rendered=await readFile(`.form-fixture-check/merged-${i}.ppm`);assert.equal(rendered.length,original.length);let different=0;for(let n=0;n<original.length;n++)if(rendered[n]!==original[n])different++;assert.equal(different,0,`page ${i}: flattened form appearance pixels differ`);}
assert.equal(source.getForm().getFields().length,3);
console.log('PASS: independent Poppler raster equality for filled text, checkbox and selected dropdown on both merged pages; original fields retained. Signature widgets and unusual appearances remain unverified.');
