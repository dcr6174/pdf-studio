import assert from 'node:assert/strict';
import {readFile,mkdir} from 'node:fs/promises';
import {build} from 'vite';
import {PDFDocument,PDFName,PDFNumber,PDFHexString,PDFArray,PDFNull} from 'pdf-lib';
import {pathToFileURL} from 'node:url';

await mkdir('.reader-navigation-check',{recursive:true});
await build({configFile:false,logLevel:'error',build:{ssr:true,outDir:'.reader-navigation-check',emptyOutDir:true,lib:{entry:['lib/reader-navigation.ts','lib/pdf-navigation.ts'],formats:['es']},rollupOptions:{external:['pdf-lib'],output:{entryFileNames:'[name].mjs'}}}});
const {loadReaderOutline,filterReaderOutline,readerPageLabel}=await import('../.reader-navigation-check/reader-navigation.mjs');
const {preserveOutlines,readOutline,preservePageLabels}=await import('../.reader-navigation-check/pdf-navigation.mjs');
const rows=await loadReaderOutline({numPages:4,getOutline:async()=>[
 {title:'Part one',dest:null,items:[{title:'Introduction',dest:'intro',items:[]},{title:'Broken destination',dest:[{num:999}],items:[]}]},
 {title:'Final',dest:[3],items:[]},{title:'Invalid',dest:[99],items:[]},
],getDestination:async()=>[{num:1}],getPageIndex:async ref=>{if(ref.num===1)return 0;throw Error('bad reference');}});
assert.equal(rows[0].children[0].page,1);assert.equal(rows[0].children[1].page,undefined);assert.equal(rows[1].page,4);assert.equal(rows[2].page,undefined);
assert.equal(filterReaderOutline(rows,' INTRO ')[0].children.length,1);assert.equal(filterReaderOutline(rows,'Part one')[0].children.length,2);assert.deepEqual(filterReaderOutline(rows,'absent'),[]);assert.equal(filterReaderOutline(rows,''),rows);
assert.equal(readerPageLabel(1,['i','ii']), 'i · Page 1');assert.equal(readerPageLabel(3,['i','ii','3']),'Page 3');
const loop={title:'loop',items:[]};loop.items.push(loop);const bounded=await loadReaderOutline({numPages:1,getOutline:async()=>[loop]});assert(bounded.length);

const source=await PDFDocument.create();source.addPage();source.addPage();source.addPage();
const name=PDFName.of;
const first=source.context.obj({Title:PDFHexString.fromText('Precise view'),Dest:source.context.obj([source.getPage(1).ref,'XYZ',12,345,null])});
source.catalog.set(name('Outlines'),source.context.obj({First:source.context.register(first)}));
const labels=source.context.obj({Nums:source.context.obj([0,source.context.obj({S:'r'}),2,source.context.obj({S:'D',P:PDFHexString.fromText('Chapter '),St:7})])});source.catalog.set(name('PageLabels'),labels);
// A cyclic number-tree edge cannot hang preservation.
labels.set(name('Kids'),source.context.obj([source.context.register(labels)]));
const plain=await PDFDocument.create();plain.addPage();
const sources=new Map([['a',source],['b',plain]]),order=[{fileId:'a',index:2},{fileId:'a',index:1},{fileId:'a',index:0},{fileId:'b',index:0}];
const out=await PDFDocument.create();for(const item of order){const [page]=await out.copyPages(sources.get(item.fileId),[item.index]);out.addPage(page);}
preserveOutlines(out,sources,order);preservePageLabels(out,sources,order);
const reopened=await PDFDocument.load(await out.save());const outline=readOutline(reopened);
assert.equal(outline[0].page,1);assert.equal(outline[0].dest.lookup(1).toString(),'/XYZ');assert.equal(outline[0].dest.lookup(2,PDFNumber).asNumber(),12);assert.equal(outline[0].dest.lookup(3,PDFNumber).asNumber(),345);assert.equal(outline[0].dest.lookup(4),PDFNull);
const tree=reopened.catalog.lookup(name('PageLabels')).lookup(name('Nums'),PDFArray);
assert.equal(tree.size(),8);assert.equal(tree.lookup(1).lookup(name('P')).decodeText(),'Chapter ');assert.equal(tree.lookup(1).lookup(name('St'),PDFNumber).asNumber(),7);assert.equal(tree.lookup(3).lookup(name('St'),PDFNumber).asNumber(),2);assert.equal(tree.lookup(5).lookup(name('St'),PDFNumber).asNumber(),1);assert.equal(tree.lookup(7).lookup(name('St'),PDFNumber).asNumber(),4);
const pdfjs=await import('pdfjs-dist');pdfjs.GlobalWorkerOptions.workerSrc=pathToFileURL(process.cwd()+'/node_modules/pdfjs-dist/build/pdf.worker.mjs').href;
const independent=await pdfjs.getDocument({data:await out.save()}).promise;
assert.deepEqual(await independent.getPageLabels(),['Chapter 7','ii','i','4']);
const resolved=await loadReaderOutline(independent);assert.equal(resolved[0].page,2);await independent.destroy();
// Missing destinations remain readable headings; unsupported view parameters fall back to Fit.
first.set(name('Dest'),source.context.obj([source.getPage(1).ref,'UnknownView',12]));preserveOutlines(out,sources,order);assert.equal(readOutline(out)[0].dest.lookup(1).toString(),'/Fit');
const ui=await readFile('components/pdf-reader.tsx','utf8');assert(ui.includes('ReaderOutlinePanel'));assert(ui.includes('width={thumbnailWidth}'));assert(ui.includes('readerPageLabel(n,pageLabels)'));
console.log('PASS: nested bookmark search, destination bounds, bounded cycles, page labels, and precise bookmark views survive reordered PDF save/reopen.');
