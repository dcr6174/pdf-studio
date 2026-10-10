import {ImageKind,type PDFPageProxy} from 'pdfjs-dist';
export async function canvasPNG(canvas:HTMLCanvasElement):Promise<Uint8Array>{const blob=await new Promise<Blob>((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error('Could not export PDF artwork.')),'image/png'));return new Uint8Array(await blob.arrayBuffer());}
/** Use decoded source pixels for simple images; composite/rotated/clipped artwork uses a rendered crop. */
export async function decodedImage(page:PDFPageProxy,id:unknown):Promise<Uint8Array|undefined>{
 const store=typeof id==='string'&&id.startsWith('g_')?page.commonObjs:page.objs;
 const image=typeof id==='string'?(store.has(id)?store.get(id):undefined):id;
 if(!image||typeof image!=='object')return;
 const {width,height,bitmap,data,kind}=image as {width:number;height:number;bitmap?:ImageBitmap;data?:Uint8Array;kind?:number};
 if(!Number.isInteger(width)||!Number.isInteger(height)||width<=0||height<=0||width*height>16000000)return;
 const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;
 try{const ctx=canvas.getContext('2d');if(!ctx)return;
  if(bitmap)ctx.drawImage(bitmap,0,0);else if(data){const pixels=ctx.createImageData(width,height),out=pixels.data;
   if(kind===ImageKind.RGBA_32BPP){if(data.length!==width*height*4)return;out.set(data);}
   else if(kind===ImageKind.RGB_24BPP){if(data.length!==width*height*3)return;for(let i=0,j=0;i<out.length;i+=4,j+=3){out[i]=data[j];out[i+1]=data[j+1];out[i+2]=data[j+2];out[i+3]=255;}}
   else if(kind===ImageKind.GRAYSCALE_1BPP){const stride=Math.ceil(width/8);if(data.length!==stride*height)return;for(let y=0;y<height;y++)for(let x=0;x<width;x++){const v=data[y*stride+(x>>3)]&(128>>(x&7))?255:0,i=(y*width+x)*4;out[i]=out[i+1]=out[i+2]=v;out[i+3]=255;}}
   else return;ctx.putImageData(pixels,0,0);
  }else return;
  return await canvasPNG(canvas);
 }finally{canvas.width=0;canvas.height=0;}
}
export async function wordCanvas(page:PDFPageProxy,signal?:AbortSignal,scale=2):Promise<HTMLCanvasElement>{
 signal?.throwIfAborted();const base=page.getViewport({scale:1}),v=page.getViewport({scale:Math.min(scale,Math.sqrt(8000000/(base.width*base.height)))}),canvas=document.createElement('canvas');canvas.width=Math.ceil(v.width);canvas.height=Math.ceil(v.height);const ctx=canvas.getContext('2d');if(!ctx)throw new Error('Could not render PDF artwork.');const task=page.render({canvasContext:ctx,viewport:v});const cancel=()=>task.cancel();signal?.addEventListener('abort',cancel,{once:true});try{await task.promise;signal?.throwIfAborted();return canvas;}catch(e){canvas.width=0;canvas.height=0;throw e;}finally{signal?.removeEventListener('abort',cancel);}
}
