import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import ts from 'typescript';
import {createCanvas,loadImage} from '@napi-rs/canvas';
import {PDFDocument,StandardFonts,PDFName,PDFArray} from 'pdf-lib';
await mkdir('.creative-check',{recursive:true});
for(const name of ['creative-pdf','lab-utilities'])await writeFile(`.creative-check/${name}.mjs`,ts.transpileModule(await readFile(`lib/${name}.ts`,'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText);
const {bookletPlan,collectPDF,foldPDF,attachmentMapPDF}=await import('../.creative-check/creative-pdf.mjs');
const {calculate,financeEstimate}=await import('../.creative-check/lab-utilities.mjs');
assert.equal(calculate('(1200+350)/5'),310);assert.equal(calculate('-3*-2+1'),7);assert.throws(()=>calculate('1/0'));assert.throws(()=>calculate('process.exit()'));assert.throws(()=>calculate('1+'));
assert.equal(financeEstimate('emi',12000,0,1).payment,1000);assert.equal(financeEstimate('sip',100,0,1).total,1200);assert(Math.abs(financeEstimate('compound',100,10,2).total-121)<1e-7);assert(Math.abs(financeEstimate('emi',100000,12,1).payment-8884.8788678)<.001);
assert.deepEqual(bookletPlan(6),[{front:[0,1],back:[2,0]},{front:[6,3],back:[4,5]}]);assert.throws(()=>bookletPlan(0));
const dir='public/examples/new-tools';await mkdir(dir,{recursive:true});const font=await readFile('public/fonts/NotoSans-Regular.ttf');
async function source(label,count){const d=await PDFDocument.create(),f=await d.embedFont(StandardFonts.Helvetica);for(let i=0;i<count;i++){const p=d.addPage([595.28,841.89]);p.drawText(`${label} / PAGE ${i+1}`,{x:42,y:750,size:28,font:f});p.drawText('Synthetic practice document. No personal data.',{x:42,y:700,size:14,font:f});}return new Uint8Array(await d.save());}
const main=await source('ALPHA',6),support=await source('BETA',1);await writeFile(`${dir}/alpha-six-pages.pdf`,main);await writeFile(`${dir}/beta-support.pdf`,support);
execFileSync('pdftoppm',['-scale-to','900','-png',`${dir}/alpha-six-pages.pdf`,'.creative-check/alpha']);
const images=[];for(let i=1;i<=6;i++){const im=await loadImage(`.creative-check/alpha-${i}.png`),c=createCanvas(im.width,im.height);c.getContext('2d').drawImage(im,0,0);images.push({image:c.toDataURL('image/png'),width:im.width,height:im.height,page:i});}
const folded=await foldPDF(images,'booklet',font),cards=await foldPDF(images,'cards',font);await writeFile(`${dir}/folded-booklet.pdf`,folded);await writeFile(`${dir}/four-cards.pdf`,cards);assert.equal((await PDFDocument.load(folded)).getPageCount(),4);assert.equal((await PDFDocument.load(cards)).getPageCount(),2);
const first=await loadImage('.creative-check/alpha-1.png'),clip=createCanvas(first.width,200);clip.getContext('2d').drawImage(first,0,40,first.width,200,0,0,first.width,200);
const collected=await collectPDF([{image:clip.toDataURL('image/png'),source:'alpha-six-pages.pdf',page:1,note:'A useful excerpt'}],font);await writeFile(`${dir}/collected-reference.pdf`,collected);assert.equal((await PDFDocument.load(collected)).getPageCount(),1);
const mapped=await attachmentMapPDF([{bytes:main,name:'Alpha main',section:'',mainPage:1},{bytes:support,name:'Beta evidence',section:'Supports chapter 2',mainPage:2}],font);await writeFile(`${dir}/mapped-pack.pdf`,mapped);const d=await PDFDocument.load(mapped);assert.equal(d.getPageCount(),8);const links=d.getPage(0).node.lookup(PDFName.of('Annots'),PDFArray);assert.equal(links.size(),3);const destinations=Array.from({length:links.size()},(_,i)=>d.context.lookup(links.get(i)).lookup(PDFName.of('Dest'),PDFArray).get(0).toString());assert.deepEqual(destinations,[d.getPage(1).ref.toString(),d.getPage(7).ref.toString(),d.getPage(2).ref.toString()]);
await assert.rejects(()=>attachmentMapPDF([{bytes:main,name:'Main',section:'',mainPage:1},{bytes:support,name:'Support',section:'Wrong',mainPage:99}],font));
for(const n of ['collected-reference','folded-booklet','four-cards','mapped-pack']){execFileSync('pdftoppm',['-f','1','-singlefile','-scale-to','900','-png',`${dir}/${n}.pdf`,`.creative-check/${n}`]);execFileSync('pdftotext',[`${dir}/${n}.pdf`,`.creative-check/${n}.txt`]);}
assert((await readFile('.creative-check/collected-reference.txt','utf8')).includes('alpha-six-pages.pdf / page 1'));assert((await readFile('.creative-check/mapped-pack.txt','utf8')).includes('BETA / PAGE 1'));
console.log('PASS: calculator parsing, rejected code and zero division; zero and positive-rate finance formulas; padded booklet imposition; collection references; 8-page pack with all 3 internal destinations; invalid references; PDF reopen and independent Poppler renders.');
