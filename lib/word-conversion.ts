import {Document,Packer,Paragraph,TextRun,ImageRun,SectionType} from 'docx';
import {renderer,render,type Options,type Output} from './pdf-engine';
import {pixelsHaveInk} from './output-integrity';
export type WordRun={text:string;x:number;y:number;width:number;size:number;font:string;bold:boolean;italic:boolean;rtl:boolean};
export type WordPage={width:number;height:number;runs:WordRun[]};
/** Geometric row grouping also handles PDFs whose drawing order differs from reading order. */
export function wordRows(runs:WordRun[]):WordRun[][]{
 const rows:WordRun[][]=[];
 for(const run of [...runs].sort((a,b)=>a.y-b.y||a.x-b.x)){
  const row=rows.find(row=>Math.abs(row[0].y-run.y)<=Math.max(2,Math.min(row[0].size,run.size)*.3));
  if(row)row.push(run);else rows.push([run]);
 }
 return rows.map(row=>row.sort((a,b)=>row[0].rtl?b.x-a.x:a.x-b.x));
}
export function wordParagraphs(page:WordPage):Paragraph[]{
 return wordRows(page.runs).map(row=>new Paragraph({
  bidirectional:row.some(r=>r.rtl),spacing:{after:60,line:Math.round(Math.max(...row.map(r=>r.size))*24)},
  children:row.flatMap((r,i)=>{
   const previous=row[i-1],gap=previous&&!r.rtl?r.x-previous.x-previous.width:0;
   const space=previous&&!previous.text.endsWith(' ')&&!r.text.startsWith(' ')&&gap>r.size*.12?' ':'';
   return [new TextRun({text:space+r.text,size:Math.round(Math.max(4,Math.min(144,r.size))*2),font:r.font,bold:r.bold,italics:r.italic,rightToLeft:r.rtl})];
  })
 }));
}
export async function packWordPages(pages:WordPage[]):Promise<Blob>{
 return Packer.toBlob(new Document({sections:pages.map(page=>({properties:{type:SectionType.NEXT_PAGE,page:{size:{width:Math.round(page.width*20),height:Math.round(page.height*20)},margin:{top:720,bottom:720,left:720,right:720}}},children:wordParagraphs(page).length?wordParagraphs(page):[new Paragraph('')]}))}));
}
export async function convertWord(bytes:Uint8Array,name:string,options:Options,progress:(n:number)=>void,signal?:AbortSignal):Promise<Output>{
 const source=await renderer(bytes),pages:WordPage[]=[],images:{data:Uint8Array;width:number;height:number}[]=[],missing:number[]=[],blank:number[]=[];
 const appearance=options.wordMode==='appearance';
 try{
  for(let index=0;index<source.numPages;index++){
   signal?.throwIfAborted();const page=await source.getPage(index+1),viewport=page.getViewport({scale:1});
   if(viewport.width*20>31680||viewport.height*20>31680)throw new Error(`Page ${index+1} exceeds Word's page-size limit. Resize the PDF before converting.`);
   const model:WordPage={width:viewport.width,height:viewport.height,runs:[]};pages.push(model);
   if(appearance){
    const scale=Math.min(1.5,Math.sqrt(8000000/(viewport.width*viewport.height))),canvas=await render(bytes,index,scale,undefined,0,signal);
    try{const blob=await new Promise<Blob>((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('Could not render a Word page.')),'image/png'));images.push({data:new Uint8Array(await blob.arrayBuffer()),width:viewport.width,height:viewport.height});}finally{canvas.width=0;canvas.height=0;}
   }else{
    // Loading operators makes the original font names available for style detection.
    await page.getOperatorList();const content=await page.getTextContent();
    for(const item of content.items){if(!('str' in item)||!item.str.trim())continue;
     const [x,y]=viewport.convertToViewportPoint(item.transform[4],item.transform[5]);
     const size=Math.max(4,Math.hypot(item.transform[2],item.transform[3])||item.height||11);
     const font=page.commonObjs.has(item.fontName)?page.commonObjs.get(item.fontName) as {name?:string}:undefined;
     const fontName=font?.name??content.styles[item.fontName]?.fontFamily??'Arial';
     const family=/times|serif/i.test(fontName)&&!/sans/i.test(fontName)?'Times New Roman':/courier|mono/i.test(fontName)?'Courier New':'Arial';
     model.runs.push({text:item.str,x,y,width:item.width,size,font:family,bold:/bold|black|heavy|demi/i.test(fontName),italic:/italic|oblique/i.test(fontName),rtl:item.dir==='rtl'});
    }
    if(!model.runs.length){const canvas=await render(bytes,index,.25,undefined,0,signal);try{const ctx=canvas.getContext('2d');if(!ctx)throw new Error('Could not inspect this PDF page.');if(pixelsHaveInk(ctx.getImageData(0,0,canvas.width,canvas.height).data))missing.push(index);else blank.push(index);}finally{canvas.width=0;canvas.height=0;}}
   }
   progress(Math.round((index+1)/source.numPages*70));page.cleanup();
  }
 }finally{await source.destroy();}
 if(!appearance&&missing.length){
  if(options.wordOCR==='off')throw new Error(`Pages ${missing.map(i=>i+1).join(', ')} have no selectable text. Enable scan recognition or choose Page appearance. No incomplete Word file was exported.`);
  const {recognizePages}=await import('./ocr-document');
  const recognized=await recognizePages(bytes,missing,{language:options.wordLanguage||'eng',scale:2,skipText:false,signal,progress:()=>progress(75)});
  for(const p of recognized){if(!p.rows.length)throw new Error(`No words could be recognized on page ${p.index+1}. Choose Page appearance to retain its artwork, or try another recognition language.`);pages[p.index].runs=p.rows.map(row=>({text:row.text,x:row.x,y:row.y+row.size,width:row.width,size:row.size,font:'Arial',bold:false,italic:false,rtl:/[\u0590-\u08ff]/.test(row.text)}));}
 }
 signal?.throwIfAborted();progress(90);
 let blob:Blob;
 if(appearance){blob=await Packer.toBlob(new Document({sections:images.map(p=>({properties:{type:SectionType.NEXT_PAGE,page:{size:{width:Math.round(p.width*20),height:Math.round(p.height*20)},margin:{top:0,bottom:0,left:0,right:0}}},children:[new Paragraph({spacing:{before:0,after:0},children:[new ImageRun({type:'png',data:p.data,transformation:{width:p.width*96/72,height:p.height*96/72},floating:{horizontalPosition:{relative:'page',offset:0},verticalPosition:{relative:'page',offset:0},behindDocument:true}})]})]}))}));}
 else blob=await packWordPages(pages);
 signal?.throwIfAborted();progress(100);
 const report=appearance?`${pages.length} pages retained as images in Word. Text inside those images is not editable.`:`${pages.length} source pages converted to editable text with page sizes, page boundaries, font sizes and basic styles. ${missing.length} pages recognized with OCR; ${blank.length} blank pages retained. Images, diagrams, table structure and complex columns are not reconstructed. Review reading order and recognized words against the PDF.`;
 return {blob,name:`${name}.docx`,report,warnings:appearance?['Page images retain appearance; their text cannot be edited.']:['Complex layouts and OCR require review. Images and table structure are not reconstructed.']};
}
