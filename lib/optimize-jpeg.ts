import {PDFDocument,PDFRawStream,PDFName,PDFNumber} from 'pdf-lib';
import {decodePhoto} from './mobile-image';

export type JPEGOptimization = {quality?:number;maxDimension?:number};

/** Only plain RGB JPEG streams. Masks, custom decoding and other codecs stay intact. */
export async function optimizeJPEGImages(doc:PDFDocument,signal?:AbortSignal,options:JPEGOptimization={}) {
 const quality=options.quality??.78,limit=options.maxDimension;
 if(!Number.isFinite(quality)||quality<.1||quality>.95)throw new Error('JPEG quality must be between 0.1 and 0.95.');
 if(limit!==undefined&&(!Number.isFinite(limit)||limit<1))throw new Error('Image dimension must be positive.');
 let changed=0;
 for(const [ref,obj] of doc.context.enumerateIndirectObjects()) {
  signal?.throwIfAborted();
  if(!(obj instanceof PDFRawStream))continue;
  const dict=obj.dict;
  if(dict.get(PDFName.of('Subtype'))?.toString()!=='/Image'||dict.get(PDFName.of('Filter'))?.toString()!=='/DCTDecode'||dict.get(PDFName.of('ColorSpace'))?.toString()!=='/DeviceRGB'||dict.has(PDFName.of('SMask'))||dict.has(PDFName.of('Mask'))||dict.has(PDFName.of('Decode'))||dict.has(PDFName.of('DecodeParms')))continue;
  const w=dict.lookup(PDFName.of('Width'),PDFNumber).asNumber(),h=dict.lookup(PDFName.of('Height'),PDFNumber).asNumber();
  if(!w||!h||w*h>22000000)continue;
  let decoded:Awaited<ReturnType<typeof decodePhoto>>|undefined,canvas:HTMLCanvasElement|undefined;
  try {
   decoded=await decodePhoto(new File([obj.contents.slice().buffer as ArrayBuffer],'image.jpg',{type:'image/jpeg'}));
   signal?.throwIfAborted();if(decoded.width!==w||decoded.height!==h)continue;
   const ratio=limit?Math.min(1,limit/Math.max(w,h)):1;
   const width=Math.max(1,Math.round(w*ratio)),height=Math.max(1,Math.round(h*ratio));
   canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;
   const ctx=canvas.getContext('2d');if(!ctx)continue;
   ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';ctx.drawImage(decoded.source,0,0,width,height);
   const blob=await new Promise<Blob|null>(resolve=>canvas!.toBlob(resolve,'image/jpeg',quality));
   signal?.throwIfAborted();if(!blob||blob.type!=='image/jpeg')continue;
   const bytes=new Uint8Array(await blob.arrayBuffer());if(bytes.length>=obj.contents.length)continue;
   signal?.throwIfAborted();
   const replacement=dict.clone();
   replacement.set(PDFName.of('Length'),PDFNumber.of(bytes.length));
   replacement.set(PDFName.of('Width'),PDFNumber.of(width));
   replacement.set(PDFName.of('Height'),PDFNumber.of(height));
   doc.context.assign(ref,PDFRawStream.of(replacement,bytes));changed++;
  } catch(e) {
   signal?.throwIfAborted();if(e instanceof Error&&e.name==='AbortError')throw e;
   // Unsupported images retain their original streams.
  } finally {
   decoded?.close();if(canvas){canvas.width=0;canvas.height=0;}
  }
  await new Promise(resolve=>setTimeout(resolve,0));
 }
 return changed;
}
