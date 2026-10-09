import {textEngine} from './online-text-engine';

type Engine = Awaited<ReturnType<typeof textEngine>>;
export type WatermarkObject = {index:number;kind:'text'|'image';label:string;key:string;left:number;top:number;width:number;height:number};
export type WatermarkSelection = WatermarkObject & {page:number};
export type WatermarkView = {width:number;height:number;rgba:Uint8ClampedArray;objects:WatermarkObject[];hasForms:boolean};

/** Only top-level text/image objects are selectable. Never paints over page content. */
export class WatermarkDocument {
 private pointer:number; private doc:number; private closed=false;
 constructor(private m:Engine,bytes:Uint8Array){
  this.pointer=m.pdfium.wasmExports.malloc(bytes.length);
  m.pdfium.HEAPU8.set(bytes,this.pointer);
  this.doc=m.FPDF_LoadMemDocument(this.pointer,bytes.length,'');
  if(!this.doc){m.pdfium.wasmExports.free(this.pointer);throw Error('This PDF could not be opened. Unlock encrypted PDFs first, or choose another file.');}
 }
 get pageCount(){return this.m.FPDF_GetPageCount(this.doc);}
 private alloc(n:number){return this.m.pdfium.wasmExports.malloc(n);}
 private free(n:number){this.m.pdfium.wasmExports.free(n);}
 private page(index:number){if(this.closed)throw Error('This document is closed.');if(!Number.isInteger(index)||index<0||index>=this.pageCount)throw Error('Choose a valid page.');const p=this.m.FPDF_LoadPage(this.doc,index);if(!p)throw Error('This page could not be opened.');return p;}
 private objects(p:number,width:number,height:number){
  const m=this.m,t=m.FPDFText_LoadPage(p),q=this.alloc(32),objects:WatermarkObject[]=[];let hasForms=false;
  try{for(let i=0;i<m.FPDFPage_CountObjects(p);i++){
   const o=m.FPDFPage_GetObject(p,i),type=m.FPDFPageObj_GetType(o);if(type===5)hasForms=true;if(type!==1&&type!==3)continue;
   if(!m.FPDFPageObj_GetBounds(o,q,q+4,q+8,q+12))continue;
   const [l,b,r,top]=Array.from(m.pdfium.HEAPF32.slice(q/4,q/4+4));
   const points:number[][]=[];for(const [x,y]of [[l,b],[l,top],[r,b],[r,top]]){if(!m.FPDF_PageToDevice(p,0,0,width,height,0,x,y,q+16,q+20))throw Error('The page position could not be read.');points.push([m.pdfium.HEAP32[q/4+4]/width,m.pdfium.HEAP32[q/4+5]/height]);}
   const left=Math.min(...points.map(v=>v[0])),ytop=Math.min(...points.map(v=>v[1])),w=Math.max(...points.map(v=>v[0]))-left,h=Math.max(...points.map(v=>v[1]))-ytop;
   if(w<=0||h<=0)continue;
   let label='Image '+(objects.filter(v=>v.kind==='image').length+1),identity='image:'+i;
   if(type===1){const n=m.FPDFTextObj_GetText(o,t,0,0);if(n<2)continue;const s=this.alloc(n);try{m.FPDFTextObj_GetText(o,t,s,n);label=m.pdfium.UTF16ToString(s);}finally{this.free(s);}if(!label.trim())continue;
    const font=m.FPDFTextObj_GetFont(o),len=m.FPDFFont_GetBaseFontName(font,0,0),fp=this.alloc(Math.max(len,1));let name='';try{m.FPDFFont_GetBaseFontName(font,fp,len);name=m.pdfium.UTF8ToString(fp);}finally{this.free(fp);}m.FPDFTextObj_GetFontSize(o,q+24);
    identity=JSON.stringify([label,name,Math.round(m.pdfium.HEAPF32[q/4+6]*100)/100]);
   }
   // Matching text must have the same text, font, size and displayed position.
   const key=JSON.stringify([identity,...[left,ytop,w,h].map(v=>Math.round(v*1000)/1000)]);
   objects.push({index:i,kind:type===1?'text':'image',label,key,left,top:ytop,width:w,height:h});
  }return {objects,hasForms};}finally{if(t)m.FPDFText_ClosePage(t);this.free(q);}
 }
 list(index:number){const p=this.page(index);try{return this.objects(p,100000,100000);}finally{this.m.FPDF_ClosePage(p);}}
 inspect(index:number,scale=1.3):WatermarkView{
  const m=this.m,p=this.page(index);let bitmap=0;
  try{const pw=m.FPDF_GetPageWidth(p),ph=m.FPDF_GetPageHeight(p);if(!Number.isFinite(pw)||!Number.isFinite(ph)||pw<=0||ph<=0)throw Error('This page has an invalid size.');const safeScale=Math.min(scale,1800/Math.max(pw,ph)),width=Math.max(1,Math.ceil(pw*safeScale)),height=Math.max(1,Math.ceil(ph*safeScale));bitmap=m.FPDFBitmap_Create(width,height,1);if(!bitmap)throw Error('This page is too large to preview.');m.FPDFBitmap_FillRect(bitmap,0,0,width,height,0xffffffff);m.FPDF_RenderPageBitmap(bitmap,p,0,0,width,height,0,1);
   const buffer=m.FPDFBitmap_GetBuffer(bitmap),stride=m.FPDFBitmap_GetStride(bitmap),rgba=new Uint8ClampedArray(width*height*4);
   for(let y=0;y<height;y++)for(let x=0;x<width;x++){const i=buffer+y*stride+x*4,j=(y*width+x)*4;rgba[j]=m.pdfium.HEAPU8[i+2];rgba[j+1]=m.pdfium.HEAPU8[i+1];rgba[j+2]=m.pdfium.HEAPU8[i];rgba[j+3]=m.pdfium.HEAPU8[i+3];}
   // Stable keys use high-resolution coordinates independent of preview size.
   return {width,height,rgba,...this.objects(p,100000,100000)};
  }finally{if(bitmap)m.FPDFBitmap_Destroy(bitmap);m.FPDF_ClosePage(p);}
 }
 remove(selections:WatermarkSelection[]){
  if(!selections.length)throw Error('Select a watermark first.');const grouped=new Map<number,WatermarkSelection[]>();
  for(const s of selections){const rows=grouped.get(s.page)??[];if(rows.some(o=>o.index===s.index))throw Error('A selection was repeated.');rows.push(s);grouped.set(s.page,rows);}
  // Validate every selection before changing any page. Call on a fresh copy.
  for(const [page,rows]of grouped){const available=this.list(page).objects;for(const row of rows){const found=available.find(o=>o.index===row.index);if(!found||found.key!==row.key||found.kind!==row.kind)throw Error('The selection no longer matches this PDF. Please select it again.');}}
  for(const [index,rows]of grouped){const p=this.page(index);try{for(const s of rows.sort((a,b)=>b.index-a.index)){const o=this.m.FPDFPage_GetObject(p,s.index);if(!this.m.FPDFPage_RemoveObject(p,o))throw Error('This object could not be removed. Your original file is unchanged.');this.m.FPDFPageObj_Destroy(o);}if(!this.m.FPDFPage_GenerateContent(p))throw Error('The changed page could not be saved. Your original file is unchanged.');}finally{this.m.FPDF_ClosePage(p);}}
 }
 save(){const m=this.m,w=m.PDFiumExt_OpenFileWriter();if(!w)throw Error('The PDF export could not start.');let p=0;try{if(!m.FPDF_SaveAsCopy(this.doc,w,2))throw Error('The edited PDF could not be saved.');const n=m.PDFiumExt_GetFileWriterSize(w);if(!n)throw Error('The export was empty.');p=this.alloc(n);m.PDFiumExt_GetFileWriterData(w,p,n);return m.pdfium.HEAPU8.slice(p,p+n);}finally{if(p)this.free(p);m.PDFiumExt_CloseFileWriter(w);}}
 close(){if(!this.closed){this.m.FPDF_CloseDocument(this.doc);this.free(this.pointer);this.closed=true;}}
}
export async function openWatermarkDocument(bytes:Uint8Array){return new WatermarkDocument(await textEngine(),bytes);}
