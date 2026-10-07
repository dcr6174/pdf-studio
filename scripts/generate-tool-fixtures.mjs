import fs from 'node:fs/promises';
import ts from 'typescript';
import {PDFDocument,StandardFonts,PDFName,PDFHexString,rgb} from 'pdf-lib';
import JSZip from 'jszip';
import {createCanvas} from '@napi-rs/canvas';
import {Document,Packer,Paragraph} from 'docx';
import XLSX from 'xlsx';
const source=ts.transpileModule(await fs.readFile('lib/tools.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.ES2022,target:ts.ScriptTarget.ES2022}}).outputText;
const {tools}=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
const directory='public/test-fixtures';await fs.mkdir(directory,{recursive:true});
const zip=new JSZip(),manifest=[];
async function save(name,bytes){await fs.writeFile(`${directory}/${name}`,bytes);zip.file(name,bytes);}
const scan=createCanvas(1200,1600),ctx=scan.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,1200,1600);ctx.fillStyle='#111';ctx.font='54px sans-serif';ctx.fillText('PDF STUDIO OCR TEST',80,150);ctx.font='32px sans-serif';ctx.fillText('Alpha Bravo Charlie Delta',80,240);await save('scan.png',scan.toBuffer('image/png'));await save('scan.jpg',scan.toBuffer('image/jpeg'));
await save('source.txt',Buffer.from('Alpha chapter\nA reusable PDF Studio test.\nDelta chapter\nKeep the original filename.'));
await save('source.md',Buffer.from('# Test heading\n\n**Bold text**, *italic text*, and ***both***.\n\n- First item\n- Second item'));
await save('source.docx',await Packer.toBuffer(new Document({sections:[{children:[new Paragraph('Alpha chapter'),new Paragraph('PDF Studio Word conversion test.'),new Paragraph('Delta chapter')]}]})));
const workbook=XLSX.utils.book_new();XLSX.utils.book_append_sheet(workbook,XLSX.utils.aoa_to_sheet([['Item','Quantity'],['Alpha',3],['Delta',2]]),'Test');await save('source.xlsx',XLSX.write(workbook,{type:'buffer',bookType:'xlsx'}));
const ebook=new JSZip();ebook.file('mimetype','application/epub+zip',{compression:'STORE'});ebook.file('META-INF/container.xml','<?xml version="1.0"?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="book.opf" media-type="application/oebps-package+xml"/></rootfiles></container>');ebook.file('book.opf','<package xmlns="http://www.idpf.org/2007/opf" version="2.0" unique-identifier="id"><metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:title>Alpha and Delta</dc:title><dc:identifier id="id">studio-fixture</dc:identifier></metadata><manifest><item id="chapter" href="chapter.xhtml" media-type="application/xhtml+xml"/></manifest><spine><itemref idref="chapter"/></spine></package>');ebook.file('chapter.xhtml','<html xmlns="http://www.w3.org/1999/xhtml"><head><title>Alpha</title></head><body><h1>Alpha</h1><p>PDF Studio EPUB test.</p><h2>Delta</h2></body></html>');await save('source.epub',await ebook.generateAsync({type:'nodebuffer'}));
function outline(doc){const root=doc.context.obj({Type:'Outlines',Count:2}),rootRef=doc.context.register(root);const entries=[0,3].map((n,i)=>doc.context.obj({Title:PDFHexString.fromText(i?'Delta':'Alpha'),Parent:rootRef,Dest:[doc.getPage(n).ref,'Fit']})),refs=entries.map(e=>doc.context.register(e));entries[0].set(PDFName.of('Next'),refs[1]);entries[1].set(PDFName.of('Prev'),refs[0]);root.set(PDFName.of('First'),refs[0]);root.set(PDFName.of('Last'),refs[1]);doc.catalog.set(PDFName.of('Outlines'),rootRef);}
async function make(id,label,count=6){const doc=await PDFDocument.create(),font=await doc.embedFont(StandardFonts.Helvetica);doc.setTitle(`${label} verification`);doc.setAuthor('PDF Studio synthetic fixture');for(let i=0;i<count;i++){const page=doc.addPage([595.28,841.89]);page.drawText(`${label} - Page ${i+1}`,{x:40,y:780,font,size:22});page.drawText(`PAGE-ID: ${id.toUpperCase()}-${i+1}`,{x:40,y:730,font,size:14});page.drawText('Alpha Bravo Charlie Delta 1234567890',{x:40,y:690,font,size:14});}return doc;}
const checks={
 'split-chapters':'Expect two chapters (pages 1-3 and 4-6). Insert a blank page after page 1 and repeat; remove it and repeat. Alpha/Delta destinations must still map to the current order.',
 'blank-check':'Expect candidate page 2 only. Page 3 has faint selectable text; page 4 has faint scanned text. Review candidates, exclude any page, then optionally delete selected pages.',
 'remove-links':'Explicit URI and internal Link annotations must disappear. Printed abc.com text must remain; some external readers auto-detect URLs.',
 'remove-annotations':'Text notes, highlights, stamps and links must disappear; the Name form widget and its value must remain.',
 'remove-attachments':'Embedded source.txt and FileAttachment references must be removed. Check page text remains.',
 'remove-bookmarks':'Alpha/Delta outline must be absent; pages and visible text remain.',
 'reader':'Check page 1, 30, 100 and 120; continuous scrolling, search, zoom, thumbnails and reading focus. Viewing must not change original bytes.',
 'viewer':'Switch Single page/Two columns and inspect the main preview. Export and inspect PageLayout in a reader that honors it.',
 'rotate':'Rotate page 2 only, then test 90, 180 and 270 degrees. Page order and other pages must remain unchanged.',
 'nup':'Test 2/4/6/9 pages per sheet. Check incomplete final sheet, output count, margins and scrollability.',
 'ocr':'Scan has no selectable text. Expect searchable Alpha Bravo Charlie Delta after recognition/review/export; inspect visible scan fidelity.',
 'pdf-to-handwriting':'Selectable text should import; images/layout are not preserved. Scan input must explain OCR prerequisite. Sidebar typing must retain the previous preview while updating.',
 'workflow':'Run Rotate + Watermark. All intended pages must rotate and contain the configured watermark. Test mobile Run action.',
 'compare':'Use this fixture and compare-revised.pdf. The revised page has different visible text; check both scrollable previews.',
 'form':'Fill Name with Test User and confirm logical field value, widget appearance and editability after reopening.',
 'decrypt':'Use encrypted-aes256-r6.pdf with password Test1234!. Wrong password must fail; correct output must reopen without a password.',
 'compress':'Compare source/output size and verify retained text, links and form widgets in image/repack modes. Raster mode must disclose losses. An unsuccessful target must remain visible.',
 'merge':'Use merge.pdf and stack-b.pdf. Check chosen file order, page count, additive file picker and desktop sorting.',
 'interleave':'Use interleave.pdf (A1-A6) and stack-b.pdf (B1-B3). Expect A1 B1 A2 B2 A3 B3 A4 A5 A6.',
};
for(const tool of tools){const doc=await make(tool.id,tool.name,tool.id==='reader'?120:6);
 if(['split-chapters','remove-bookmarks','reader','bookmarks'].includes(tool.id))outline(doc);
 if(tool.id==='blank-check'){doc.removePage(1);doc.insertPage(1,[595.28,841.89]);doc.removePage(2);const p=doc.insertPage(2,[595.28,841.89]);p.drawText('Faint text must remain',{x:45,y:740,size:10,color:rgb(.98,.98,.98)});const faint=createCanvas(595,842),f=faint.getContext('2d');f.fillStyle='#fff';f.fillRect(0,0,595,842);f.fillStyle='#fcfcfc';f.font='24px sans-serif';f.fillText('Faint scan must remain',40,120);const image=await doc.embedPng(faint.toBuffer('image/png'));doc.removePage(3);doc.insertPage(3,[595.28,841.89]).drawImage(image,{x:0,y:0,width:595.28,height:841.89});}
 if(['remove-links','remove-annotations','compress'].includes(tool.id)){const p=doc.getPage(0),entries=[doc.context.obj({Type:'Annot',Subtype:'Link',Rect:[40,650,220,680],A:{Type:'Action',S:'URI',URI:PDFHexString.fromText('https://abc.com')}}),doc.context.obj({Type:'Annot',Subtype:'Link',Rect:[40,600,220,630],Dest:[doc.getPage(1).ref,'Fit']})];if(tool.id==='remove-annotations')for(const type of ['Text','Highlight','Stamp'])entries.push(doc.context.obj({Type:'Annot',Subtype:type,Rect:[40,500,180,530],Contents:PDFHexString.fromText(type+' test'),QuadPoints:[40,530,180,530,40,500,180,500]}));p.node.set(PDFName.of('Annots'),doc.context.obj(entries.map(e=>doc.context.register(e))));p.drawText('abc.com',{x:40,y:660,size:14});}
 if(['form','remove-annotations','compress','flatten'].includes(tool.id)){const field=doc.getForm().createTextField('Name');field.setText('Original value');field.addToPage(doc.getPage(0),{x:40,y:100,width:200,height:30});}
 if(tool.id==='remove-attachments')await doc.attach(Buffer.from('Attachment fixture'),'source.txt',{mimeType:'text/plain',description:'Synthetic attachment'});
 if(tool.id==='ocr'){while(doc.getPageCount())doc.removePage(0);const image=await doc.embedPng(scan.toBuffer('image/png'));doc.addPage([595.28,841.89]).drawImage(image,{x:0,y:0,width:595.28,height:841.89});}
 await save(`${tool.id}.pdf`,await doc.save());
 const input=({docx:'source.docx',sheet:'source.xlsx',ebook:'source.epub',images:'scan.png',scan:'scan.jpg',create:'source.txt',markdown:'source.md',decrypt:'encrypted-aes256-r6.pdf'})[tool.id]??`${tool.id}.pdf`;
 manifest.push({tool:tool.id,name:tool.name,input,additionalInput:['merge','interleave','compare'].includes(tool.id)?tool.id==='compare'?'compare-revised.pdf':'stack-b.pdf':null,expected:checks[tool.id]??`Complete ${tool.name}. Inspect output content, page count, ordering, filename and all configured options. Check validation and both desktop/mobile controls. ${tool.note??''}`,status:'not yet manually verified'});
}
const stack=await make('b','B',3);await save('stack-b.pdf',await stack.save());const revised=await make('revised','Revised',6);revised.getPage(1).drawText('CHANGED PARAGRAPH',{x:40,y:500,size:20});await save('compare-revised.pdf',await revised.save());await save('encrypted-aes256-r6.pdf',await fs.readFile('checks/fixtures/aes256-r6.pdf'));
await save('manifest.json',Buffer.from(JSON.stringify(manifest,null,2)+'\n'));await save('README.txt',Buffer.from('PDF Studio synthetic test fixtures\n\nAll data is synthetic. manifest.json maps every tool to its input and expected checks. A fixture is not a passing test.\nEncrypted fixture password: Test1234!\nScan: Alpha Bravo Charlie Delta.\n\n'+manifest.map(m=>`${m.name}\nInput: ${m.input}${m.additionalInput?' + '+m.additionalInput:''}\nExpected: ${m.expected}\n`).join('\n')));
await fs.writeFile(`${directory}/pdf-studio-test-pack.zip`,await zip.generateAsync({type:'nodebuffer',compression:'DEFLATE'}));console.log(`Prepared ${manifest.length} tool mappings and individual files plus direct ZIP.`);
