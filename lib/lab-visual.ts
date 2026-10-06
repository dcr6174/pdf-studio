import type {PDFDocumentProxy} from 'pdfjs-dist';
export type SketchStroke={points:{x:number;y:number}[];color:string;width:number;opacity:number};
export function labPages(value:string,count:number,max:number){
 if(!Number.isInteger(count)||count<1)throw new Error('Open a PDF first.');
 const result:number[]=[];
 for(const token of (value.trim()||`1-${count}`).split(',')){
  const m=/^\s*(\d+)(?:\s*-\s*(\d+))?\s*$/.exec(token);if(!m)throw new Error('Use page numbers such as 1, 3-5.');
  const start=Number(m[1]),end=Number(m[2]??m[1]);if(start<1||end<start||end>count)throw new Error(`Choose pages between 1 and ${count}.`);
  for(let n=start;n<=end;n++){if(!result.includes(n-1))result.push(n-1);if(result.length>max)throw new Error(`This experiment supports up to ${max} selected pages. Choose a smaller range.`);}
 }
 return result;
}
export function collageLayout(count:number,columns:number,width:number,ratio:number,gap:number){
 if(!Number.isInteger(count)||count<1||count>16||![1,2,3,4].includes(columns)||width<400||width>2400||![1,Math.SQRT2,1/Math.SQRT2].includes(ratio)||gap<0||gap>80)throw new Error('Choose supported poster settings.');
 const height=Math.round(width*ratio),rows=Math.ceil(count/columns),cellWidth=(width-gap*(columns+1))/columns,cellHeight=(height-gap*(rows+1))/rows;
 if(cellWidth<20||cellHeight<20)throw new Error('Reduce spacing, add columns or choose a larger poster.');
 return {width,height,cells:Array.from({length:count},(_,i)=>({x:gap+(i%columns)*(cellWidth+gap),y:gap+Math.floor(i/columns)*(cellHeight+gap),width:cellWidth,height:cellHeight}))};
}
export function fitImage(sw:number,sh:number,box:{x:number;y:number;width:number;height:number}){const scale=Math.min(box.width/sw,box.height/sh);return{x:box.x+(box.width-sw*scale)/2,y:box.y+(box.height-sh*scale)/2,width:sw*scale,height:sh*scale};}
export async function labCanvas(doc:PDFDocumentProxy,index:number,maxDimension:number,signal:AbortSignal){
 signal.throwIfAborted();const page=await doc.getPage(index+1),base=page.getViewport({scale:1});if(!Number.isFinite(base.width+base.height)||base.width<=0||base.height<=0)throw new Error('This PDF page has unsupported dimensions.');
 const viewport=page.getViewport({scale:Math.min(2,maxDimension/Math.max(base.width,base.height))}),canvas=document.createElement('canvas');canvas.width=Math.ceil(viewport.width);canvas.height=Math.ceil(viewport.height);
 const ctx=canvas.getContext('2d');if(!ctx)throw new Error('The browser could not create a page preview.');
 const task=page.render({canvasContext:ctx,viewport,background:'rgb(255,255,255)'}),cancel=()=>task.cancel();signal.addEventListener('abort',cancel,{once:true});
 try{await task.promise;signal.throwIfAborted();return canvas;}catch(e){canvas.width=canvas.height=0;throw e;}finally{signal.removeEventListener('abort',cancel);page.cleanup();}
}
export function paintStrokes(ctx:CanvasRenderingContext2D,strokes:SketchStroke[],width:number,height:number){
 for(const stroke of strokes){ctx.save();ctx.strokeStyle=ctx.fillStyle=stroke.color;ctx.lineWidth=stroke.width*width;ctx.lineCap='round';ctx.globalAlpha=stroke.opacity;
  if(stroke.points.length===1){const p=stroke.points[0];ctx.beginPath();ctx.arc(p.x*width,p.y*height,ctx.lineWidth/2,0,Math.PI*2);ctx.fill();}
  else for(let i=1;i<stroke.points.length;i++){ctx.beginPath();ctx.moveTo(stroke.points[i-1].x*width,stroke.points[i-1].y*height);ctx.lineTo(stroke.points[i].x*width,stroke.points[i].y*height);ctx.stroke();}
  ctx.restore();
 }
}
export async function sketchPDF(source:Uint8Array,strokes:Record<number,SketchStroke[]>,flatten=false,signal?:AbortSignal){
 if(!Object.values(strokes).some(s=>s.length))return source.slice();
 const {PDFDocument,rgb,LineCapStyle,pushGraphicsState,popGraphicsState,concatTransformationMatrix}=await import('pdf-lib');
 const {pageGeometry}=await import('./page-geometry');const {hasFormWidgets,flattenFormSafely}=await import('./form-safe');
 const doc=await PDFDocument.load(source,{updateMetadata:false});if(hasFormWidgets(doc)){if(!flatten)throw new Error('This PDF has fillable fields that can cover your sketch. Enable Make fields read-only before exporting, or keep your sketch as a PNG.');flattenFormSafely(doc);}
 for(const [key,lines]of Object.entries(strokes)){await new Promise(resolve=>setTimeout(resolve,0));signal?.throwIfAborted();const index=Number(key);if(!Number.isInteger(index)||index<0||index>=doc.getPageCount())throw new Error('A sketch refers to a missing page.');const page=doc.getPage(index),g=pageGeometry(page);
  page.pushOperators(pushGraphicsState(),concatTransformationMatrix(...g.matrix as [number,number,number,number,number,number]));
  for(const line of lines){if(!/^#[\da-f]{6}$/i.test(line.color)||line.width<=0||line.width>.1||line.opacity<=0||line.opacity>1||!line.points.length||line.points.some(p=>!Number.isFinite(p.x+p.y)||p.x<0||p.x>1||p.y<0||p.y>1))throw new Error('A sketch has invalid drawing data.');const color=rgb(...[1,3,5].map(i=>parseInt(line.color.slice(i,i+2),16)/255) as [number,number,number]);
   if(line.points.length===1){const p=line.points[0];page.drawCircle({x:p.x*g.width,y:(1-p.y)*g.height,size:line.width*g.width/2,color,opacity:line.opacity});}
   for(let i=1;i<line.points.length;i++){const a=line.points[i-1],b=line.points[i];page.drawLine({start:{x:a.x*g.width,y:(1-a.y)*g.height},end:{x:b.x*g.width,y:(1-b.y)*g.height},color,thickness:line.width*g.width,opacity:line.opacity,lineCap:LineCapStyle.Round});}
  }page.pushOperators(popGraphicsState());
 }return new Uint8Array(await doc.save());
}

export async function posterPNG(doc:PDFDocumentProxy,selected:number[],options:{columns:number;width:number;ratio:number;gap:number;background:string},signal:AbortSignal,onPage:(done:number,total:number)=>void){
 signal.throwIfAborted();if(!/^#[\da-f]{6}$/i.test(options.background))throw new Error('Choose a valid background color.');
 const layout=collageLayout(selected.length,options.columns,options.width,options.ratio,options.gap),canvas=document.createElement('canvas');canvas.width=layout.width;canvas.height=layout.height;const ctx=canvas.getContext('2d')!;ctx.fillStyle=options.background;ctx.fillRect(0,0,canvas.width,canvas.height);
 try{for(let i=0;i<selected.length;i++){onPage(i+1,selected.length);const image=await labCanvas(doc,selected[i],Math.ceil(Math.max(layout.cells[i].width,layout.cells[i].height)*1.5),signal),box=fitImage(image.width,image.height,layout.cells[i]);ctx.drawImage(image,box.x,box.y,box.width,box.height);image.width=image.height=0;}signal.throwIfAborted();return await new Promise<Blob>((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error('This browser could not export the poster.')),'image/png'));}finally{canvas.width=canvas.height=0;}
}
