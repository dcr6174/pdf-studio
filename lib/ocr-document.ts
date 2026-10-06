import {PDFDocument,rgb} from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import {render,renderer} from './pdf-engine';
import {wrapParagraph} from './text-paragraph';
export type OCRRow={id:string;text:string;originalText:string;x:number;y:number;width:number;height:number;size:number;confidence:number;background:string;rects:{x:number;y:number;width:number;height:number}[]};
export type OCRPage={index:number;width:number;height:number;image:string;rows:OCRRow[]};
export type OCROptions={language:string;scale:number;skipText:boolean;signal?:AbortSignal;progress?:(message:string)=>void};
export async function recognizePages(bytes:Uint8Array,indices:number[],options:OCROptions):Promise<OCRPage[]>{
 const {createWorker}=await import('tesseract.js');let worker:Awaited<ReturnType<typeof createWorker>>|undefined;
 let current=0;const results:OCRPage[]=[];const source=await renderer(bytes);
 const cancel=()=>{void worker?.terminate();};options.signal?.addEventListener('abort',cancel,{once:true});
 try{
  worker=await createWorker(options.language,1,{logger:m=>{if(m.status==='recognizing text')options.progress?.(`Reading page ${current+1}: ${Math.round(m.progress*100)}%`);}});
  for(const index of indices){options.signal?.throwIfAborted();current=index;const page=await source.getPage(index+1);if(options.skipText){const text=await page.getTextContent();if(text.items.some(t=>'str' in t&&t.str.trim())){options.progress?.(`Skipped page ${index+1}: existing text`);continue;}}
   const viewport=page.getViewport({scale:1}),scale=Math.min(options.scale,Math.sqrt(16000000/(viewport.width*viewport.height))),canvas=await render(bytes,index,scale,undefined,0,options.signal);
   try{const {data}=await worker.recognize(canvas,{}, {blocks:true});options.signal?.throwIfAborted();const rows:OCRRow[]=[];
    for(const block of data.blocks??[])for(const paragraph of block.paragraphs)for(const line of paragraph.lines){if(!line.text.trim())continue;const b=line.bbox,h=(b.y1-b.y0)/scale;
     rows.push({id:`${index}-${rows.length}`,text:line.text.trim(),originalText:line.text.trim(),x:b.x0/scale,y:b.y0/scale,width:(b.x1-b.x0)/scale,height:h,size:Math.max(6,h/0.85),confidence:line.confidence,background:'#ffffff',rects:line.words.map(w=>({x:w.bbox.x0/scale-1,y:w.bbox.y0/scale-1,width:(w.bbox.x1-w.bbox.x0)/scale+2,height:(w.bbox.y1-w.bbox.y0)/scale+2}))});}
    results.push({index,width:viewport.width,height:viewport.height,image:canvas.toDataURL('image/png'),rows});
   }finally{canvas.width=0;canvas.height=0;}
  }return results;
 }finally{options.signal?.removeEventListener('abort',cancel);await worker?.terminate().catch(()=>{});await source.destroy();}
}
export function changedOCR(page:OCRPage){return page.rows.some(row=>row.text!==row.originalText);}
export async function exportOCR(bytes:Uint8Array,pages:OCRPage[],moveBelow=false):Promise<Uint8Array>{
 const source=await PDFDocument.load(bytes),out=await PDFDocument.create();out.registerFontkit(fontkit);const response=await fetch('/fonts/NotoSans-Regular.ttf');if(!response.ok)throw new Error('Unicode OCR font could not load.');const font=await out.embedFont(await response.arrayBuffer(),{subset:true}),recognized=new Map(pages.map(p=>[p.index,p]));
 for(let index=0;index<source.getPageCount();index++){const model=recognized.get(index);if(!model){const [copy]=await out.copyPages(source,[index]);out.addPage(copy);continue;}
  if(!changedOCR(model)){const [copy]=await out.copyPages(source,[index]);out.addPage(copy);for(const row of model.rows)copy.drawText(row.text,{x:row.x,y:model.height-row.y-row.size*.85,size:row.size,font,color:rgb(0,0,0),opacity:0});continue;}
  const canvas=document.createElement('canvas'),scale=Math.min(2,Math.sqrt(16000000/(model.width*model.height)));canvas.width=Math.ceil(model.width*scale);canvas.height=Math.ceil(model.height*scale);const context=canvas.getContext('2d')!;const image=new Image();image.src=model.image;await image.decode();context.drawImage(image,0,0,canvas.width,canvas.height);
  const shifts:{x:number;width:number;bottom:number;delta:number}[]=[];const layout=[...model.rows].sort((a,b)=>a.y-b.y||a.x-b.x).map(row=>{const lines=row.text.trim()?wrapParagraph(row.text,row.width,t=>font.widthOfTextAtSize(t,row.size),1000):[],lineHeight=row.size*1.25,offset=shifts.filter(s=>row.y>=s.bottom-1&&Math.min(row.x+row.width,s.x+s.width)-Math.max(row.x,s.x)>Math.min(row.width,s.width)*.5).reduce((n,s)=>n+s.delta,0),y=row.y+offset,changed=row.text!==row.originalText,moved=Math.abs(offset)>.1;const height=lines.length*lineHeight;
   if(y+height>model.height-5)throw new Error(`Edited text exceeds page ${index+1}. Shorten it or use fixed layout.`);
   if(changed&&moveBelow)shifts.push({x:row.x,width:row.width,bottom:row.y+row.height,delta:height-row.height});
   if(changed&&!moveBelow&&height>row.height+row.size*.5&&model.rows.some(next=>next.y>row.y&&next.y<y+height&&next.x<row.x+row.width&&next.x+next.width>row.x))throw new Error('The edited OCR row overlaps another row. Enable movement or shorten it.');
   return {row,lines,lineHeight,y,changed,moved};});
  for(const item of layout)if(item.changed||item.moved){context.fillStyle=item.row.background;for(const r of item.row.rects)context.fillRect(r.x*scale,r.y*scale,r.width*scale,r.height*scale);}
  for(const item of layout)if(item.changed||item.moved){context.font=`${item.row.size*scale}px "OpenPDF Noto",sans-serif`;context.textBaseline='top';context.fillStyle='#172033';item.lines.forEach((line,n)=>context.fillText(line,item.row.x*scale,(item.y+n*item.lineHeight)*scale));}
  const page=out.addPage([model.width,model.height]),png=await out.embedPng(canvas.toDataURL('image/png'));page.drawImage(png,{x:0,y:0,width:model.width,height:model.height});
  for(const item of layout){item.lines.forEach((line,n)=>page.drawText(line,{x:item.row.x,y:model.height-item.y-item.row.size*.85-n*item.lineHeight,size:item.row.size,font,color:rgb(0,0,0),opacity:0}));}
  canvas.width=0;canvas.height=0;
 }return out.save();
}
