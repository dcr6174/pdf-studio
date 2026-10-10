import {Document,Packer,Paragraph,TextRun,ImageRun,SectionType,ExternalHyperlink,Table,TableRow,TableCell,WidthType,TableLayoutType,BorderStyle} from 'docx';
import {renderer,type Options,type Output} from './pdf-engine';
import {wordGeometry,ruledTables,graphicRegions,taggedTables,preserveRegionContent,boxesOverlap,inside,type Box,type WordTable} from './word-layout';
import {canvasPNG,decodedImage,wordCanvas} from './word-images';
import {OPS} from 'pdfjs-dist';
import {pixelsHaveInk} from './output-integrity';
export type WordRun={text:string;x:number;y:number;width:number;size:number;font:string;bold:boolean;italic:boolean;rtl:boolean;marked?:string[];link?:string};
export type WordPage={width:number;height:number;runs:WordRun[];tables?:WordTable[];directImages?:number;scan?:Uint8Array;graphics?:{box:Box;data:Uint8Array}[]};
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
   const text=new TextRun({text:space+r.text,size:Math.round(Math.max(4,Math.min(144,r.size))*2),font:r.font,bold:r.bold,italics:r.italic,rightToLeft:r.rtl});return [r.link?new ExternalHyperlink({link:r.link,children:[text]}):text];
  })
 }));
}
export function wordBlocks(page:WordPage):(Paragraph|Table)[]{
 const tables=page.tables??[],graphics=page.graphics??[],marginX=Math.min(36,page.width/8),marginY=Math.min(36,page.height/8),contentWidth=Math.max(1,page.width-marginX*2),contentHeight=Math.max(1,page.height-marginY*2-28);
 const tableRuns=new Set(tables.flatMap(t=>t.cells.flat(2)));
 const runs=page.runs.filter(r=>!tableRuns.has(r)&&!graphics.some(g=>inside(r,g.box)));
 const blocks:{y:number;node:Paragraph|Table}[]=wordRows(runs).map(row=>({y:row[0].y,node:wordParagraphs({...page,runs:row})[0]}));
 for(const t of tables)blocks.push({y:t.box.y,node:new Table({layout:TableLayoutType.FIXED,width:{size:Math.round(Math.min(t.box.width,contentWidth)*20),type:WidthType.DXA},columnWidths:t.columns.map(w=>Math.round(w*Math.min(1,(contentWidth)/t.box.width)*20)),rows:t.cells.map(row=>new TableRow({cantSplit:true,children:row.map((cell,i)=>new TableCell({width:{size:Math.round(t.columns[i]*Math.min(1,(contentWidth)/t.box.width)*20),type:WidthType.DXA},children:cell.length?wordParagraphs({...page,runs:cell}):[new Paragraph('')]}))}))})});
 const graphicParagraph=(g:NonNullable<WordPage['graphics']>[number],maxWidth:number)=>{const scale=Math.min(1,maxWidth/g.box.width,(contentHeight)/g.box.height);return new Paragraph({spacing:{after:60},children:[new ImageRun({type:'png',data:g.data,transformation:{width:g.box.width*scale*96/72,height:g.box.height*scale*96/72},altText:{name:'PDF artwork',title:'Preserved PDF graphic',description:'Original visual region; text within this graphic is not editable.'}})]});};
 const used=new Set<number>();
 for(let i=0;i<graphics.length;i++){if(used.has(i))continue;const g=graphics[i],pair=graphics.findIndex((b,j)=>j>i&&!used.has(j)&&Math.abs(b.box.y-g.box.y)<8&&b.box.x>=g.box.x+g.box.width&&g.box.width+b.box.width<=contentWidth);
  if(pair<0)blocks.push({y:g.box.y,node:graphicParagraph(g,contentWidth)});
  else{used.add(pair);const b=graphics[pair],widths=[g.box.width,b.box.width],none={style:BorderStyle.NONE,size:0,color:'FFFFFF'};blocks.push({y:g.box.y,node:new Table({layout:TableLayoutType.FIXED,width:{size:Math.round(widths.reduce((a,b)=>a+b,0)*20),type:WidthType.DXA},columnWidths:widths.map(w=>Math.round(w*20)),borders:{top:none,bottom:none,left:none,right:none,insideHorizontal:none,insideVertical:none},rows:[new TableRow({cantSplit:true,children:[g,b].map((v,j)=>new TableCell({width:{size:Math.round(widths[j]*20),type:WidthType.DXA},margins:{top:0,bottom:0,left:0,right:0},children:[graphicParagraph(v,widths[j]-2)]}))})]})});}
 }
 const result=blocks.sort((a,b)=>a.y-b.y).map(b=>b.node);
 if(page.scan){const scale=Math.min((contentWidth)/page.width,(contentHeight)/page.height);result.push(new Paragraph({children:[new TextRun({text:'Original scanned page',size:18,italics:true})]}),new Paragraph({children:[new ImageRun({type:'png',data:page.scan,transformation:{width:page.width*scale*96/72,height:page.height*scale*96/72},altText:{name:'Original scanned PDF page',description:'Visual reference for checking recognized text.'}})]}));}
 return result;
}
export async function packWordPages(pages:WordPage[]):Promise<Blob>{
 return Packer.toBlob(new Document({sections:pages.map(page=>{const children=wordBlocks(page);return {properties:{type:SectionType.NEXT_PAGE,page:{size:{width:Math.round(page.width*20),height:Math.round(page.height*20)},margin:{top:Math.round(Math.min(36,page.height/8)*20),bottom:Math.round(Math.min(36,page.height/8)*20),left:Math.round(Math.min(36,page.width/8)*20),right:Math.round(Math.min(36,page.width/8)*20)}}},children:children.length?children:[new Paragraph('')]};})}));
}
export async function convertWord(bytes:Uint8Array,name:string,options:Options,progress:(n:number)=>void,signal?:AbortSignal,expectedPages?:number):Promise<Output>{
 signal?.throwIfAborted();
 const source=await renderer(bytes),pages:WordPage[]=[],images:{data:Uint8Array;width:number;height:number}[]=[],missing:number[]=[],blank:number[]=[];
 const appearance=options.wordMode==='appearance';
 try{
  if(expectedPages!==undefined&&source.numPages!==expectedPages)throw new Error(`Conversion stopped: expected ${expectedPages} pages, but the PDF reader found ${source.numPages}. No incomplete Word file was exported.`);
  for(let index=0;index<source.numPages;index++){
   signal?.throwIfAborted();const page=await source.getPage(index+1),viewport=page.getViewport({scale:1});
   if(viewport.width*20>31680||viewport.height*20>31680)throw new Error(`Page ${index+1} exceeds Word's page-size limit. Resize the PDF before converting.`);
   const model:WordPage={width:viewport.width,height:viewport.height,runs:[]};pages.push(model);
   if(appearance){
    const canvas=await wordCanvas(page,signal,1.5);
    try{const blob=await new Promise<Blob>((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('Could not render a Word page.')),'image/png'));images.push({data:new Uint8Array(await blob.arrayBuffer()),width:viewport.width,height:viewport.height});}finally{canvas.width=0;canvas.height=0;}
   }else{
    // Loading operators makes the original font names available for style detection.
    const operators=await page.getOperatorList();const content=await page.getTextContent({includeMarkedContent:true}),marked:string[]=[];
    for(const item of content.items){if(!('str' in item)){if(item.type==='endMarkedContent')marked.pop();else marked.push(item.id??'');continue;}if(!item.str.trim())continue;
     const [x,y]=viewport.convertToViewportPoint(item.transform[4],item.transform[5]);
     const size=Math.max(4,Math.hypot(item.transform[2],item.transform[3])||item.height||11);
     const font=page.commonObjs.has(item.fontName)?page.commonObjs.get(item.fontName) as {name?:string}:undefined;
     const fontName=font?.name??content.styles[item.fontName]?.fontFamily??'Arial';
     const family=/times|serif/i.test(fontName)&&!/sans/i.test(fontName)?'Times New Roman':/courier|mono/i.test(fontName)?'Courier New':'Arial';
     model.runs.push({text:item.str,x,y,width:item.width,size,font:family,bold:/bold|black|heavy|demi/i.test(fontName),italic:/italic|oblique/i.test(fontName),rtl:item.dir==='rtl',marked:[...marked]});
    }
    const geometry=wordGeometry(operators,OPS,viewport.transform,viewport.width,viewport.height);
    const annotations=await page.getAnnotations();
    for(const a of annotations){if(!a.url||!/^https?:|^mailto:/i.test(a.url)||!a.rect)continue;const rect=viewport.convertToViewportRectangle(a.rect);const linkBox={x:Math.min(rect[0],rect[2]),y:Math.min(rect[1],rect[3]),width:Math.abs(rect[2]-rect[0]),height:Math.abs(rect[3]-rect[1])};for(const r of model.runs)if(inside(r,linkBox))r.link=a.url;}
    model.tables=taggedTables(await page.getStructTree(),model.runs);
    for(const table of ruledTables(geometry.segments,model.runs))if(!model.tables.some(t=>boxesOverlap(table.box,t.box)))model.tables.push(table);
    // Tables containing pictures are retained visually until cell-level image placement is reliable.
    model.tables=model.tables.filter(t=>!geometry.images.some(i=>boxesOverlap(i.box,t.box))&&!geometry.boxes.some(b=>b.width>8&&b.height>8&&b.x>t.box.x+3&&b.y>t.box.y+3&&b.x+b.width<t.box.x+t.box.width-3&&b.y+b.height<t.box.y+t.box.height-3));
    const regions=preserveRegionContent(graphicRegions(geometry.boxes,model.tables,model.width,model.height),model.runs,model.tables,model.width,model.height);
    model.tables=model.tables.filter(t=>!regions.some(b=>b.x<=t.box.x&&b.y<=t.box.y&&b.x+b.width>=t.box.x+t.box.width&&b.y+b.height>=t.box.y+t.box.height));
    if(regions.length&&model.runs.length){
     const canvas=await wordCanvas(page,signal),scale=canvas.width/model.width;model.graphics=[];model.directImages=0;
     try{for(const box of regions){signal?.throwIfAborted();const original=geometry.images.find(i=>i.direct&&Math.abs(i.box.x-box.x)<=3&&Math.abs(i.box.y-box.y)<=3&&Math.abs(i.box.width-box.width)<=5&&Math.abs(i.box.height-box.height)<=5&&!model.runs.some(r=>inside(r,i.box)));if(original){const data=await decodedImage(page,original.id);if(data){model.graphics.push({box:original.box,data});model.directImages++;continue;}}const crop=document.createElement('canvas');crop.width=Math.max(1,Math.ceil(box.width*scale));crop.height=Math.max(1,Math.ceil(box.height*scale));try{const ctx=crop.getContext('2d');if(!ctx)throw new Error('Could not preserve PDF artwork.');ctx.drawImage(canvas,box.x*scale,box.y*scale,box.width*scale,box.height*scale,0,0,crop.width,crop.height);model.graphics.push({box,data:await canvasPNG(crop)});}finally{crop.width=0;crop.height=0;}}}finally{canvas.width=0;canvas.height=0;}
    }
    if(!model.runs.length){const canvas=await wordCanvas(page,signal,.25);try{const ctx=canvas.getContext('2d');if(!ctx)throw new Error('Could not inspect this PDF page.');if(pixelsHaveInk(ctx.getImageData(0,0,canvas.width,canvas.height).data)){const full=await wordCanvas(page,signal);try{const data=await canvasPNG(full);if(!geometry.hasRaster&&geometry.boxes.length){model.graphics=[{box:{x:0,y:0,width:model.width,height:model.height},data}];}else{model.scan=data;missing.push(index);}}finally{full.width=0;full.height=0;}}else blank.push(index);}finally{canvas.width=0;canvas.height=0;}}
   }
   progress(Math.round((index+1)/source.numPages*70));page.cleanup();
  }
 }finally{await source.destroy();}
 if(!appearance&&missing.length){
  if(options.wordOCR==='off')throw new Error(`Pages ${missing.map(i=>i+1).join(', ')} have no selectable text. Enable scan recognition or choose Page appearance. No incomplete Word file was exported.`);
  const {recognizePages}=await import('./ocr-document');
  const recognized=await recognizePages(bytes,missing,{language:options.wordLanguage||'eng',scale:2,skipText:false,signal,progress:()=>progress(75)});
  for(const p of recognized){if(!p.rows.length)continue;pages[p.index].runs=p.rows.map(row=>({text:row.text,x:row.x,y:row.y+row.size,width:row.width,size:row.size,font:'Arial',bold:false,italic:false,rtl:/[\u0590-\u08ff]/.test(row.text)}));}
 }
 signal?.throwIfAborted();progress(90);
 const unread=missing.filter(i=>!pages[i].runs.length);
 let blob:Blob;
 if(appearance){blob=await Packer.toBlob(new Document({sections:images.map(p=>({properties:{type:SectionType.NEXT_PAGE,page:{size:{width:Math.round(p.width*20),height:Math.round(p.height*20)},margin:{top:0,bottom:0,left:0,right:0}}},children:[new Paragraph({spacing:{before:0,after:0},children:[new ImageRun({type:'png',data:p.data,transformation:{width:p.width*96/72,height:p.height*96/72},floating:{horizontalPosition:{relative:'page',offset:0},verticalPosition:{relative:'page',offset:0},behindDocument:true}})]})]}))}));}
 else blob=await packWordPages(pages);
 signal?.throwIfAborted();progress(100);
 const report=appearance?`${pages.length} pages retained as images in Word. Text inside those images is not editable.`:`${pages.length} source pages converted to editable text with page sizes, page boundaries, font sizes, basic styles and external links. ${missing.length} scanned pages processed with OCR and their originals retained for review; ${blank.length} blank pages retained. ${unread.length} scanned pages had no recognized words and retain their original visual. ${pages.reduce((n,p)=>n+(p.tables?.length??0),0)} tagged or ruled tables rebuilt; ${pages.reduce((n,p)=>n+(p.graphics?.length??0),0)} visual regions preserved, including ${pages.reduce((n,p)=>n+(p.directImages??0),0)} images from source pixels. Text inside preserved artwork is not editable. Untagged borderless, merged, illustrated or scanned tables and complex columns may require cleanup. Word may reflow content onto extra pages; review against the PDF.`;
 return {blob,name:`${name}.docx`,report,warnings:appearance?['Page images retain appearance; their text cannot be edited.']:[...(unread.length?[`No words recognized on pages ${unread.map(i=>i+1).join(', ')}; original scans retained.`]:[]),'Artwork is retained as region images. Complex or borderless tables, reading order, page reflow and OCR require review.']};
}
