import {PDFDocument,PDFRawStream,PDFName,PDFNumber,PDFDict,PDFArray,decodePDFRawStream} from 'pdf-lib';
import {decodePhoto} from './mobile-image';
import {imageSamples} from './pdf-image-samples';
export type JPEGOptimization={quality?:number;maxDimension?:number;onProgress?:(done:number,total:number)=>void};
/** Resolve a dictionary entry written as a name, an indirect name, or a single-element array of either. */
function singleName(doc:PDFDocument,dict:PDFDict,key:string){
 const value=dict.get(PDFName.of(key)),entries=value instanceof PDFArray?value.asArray():[value];
 if(entries.length!==1)return undefined;
 const resolved=doc.context.lookup(entries[0]);
 return resolved instanceof PDFName?resolved.toString():undefined;
}
/** Resolve a Filter entry written as a name, an indirect name, or an array of either, preserving chain order. */
function filterChain(doc:PDFDocument,dict:PDFDict){
 const value=dict.get(PDFName.of('Filter')),entries=value instanceof PDFArray?value.asArray():[value];
 if(!entries.length)return undefined;
 const names:string[]=[];
 for(const entry of entries){const resolved=doc.context.lookup(entry);if(!(resolved instanceof PDFName))return undefined;names.push(resolved.toString());}
 return names;
}
/** Generators such as ReportLab wrap binary image data in ASCII85/ASCIIHex before the real filter. Decode that wrapper; the replacement is always rewritten as plain DCTDecode, so the chain is never reproduced. */
function unwrapAscii(bytes:Uint8Array,wrappers:string[]){
 let out=bytes;
 for(const filter of wrappers){
  if(filter==='/ASCIIHexDecode'){
   const digits:number[]=[];
   for(const byte of out){if(byte===0x3E)break;const nibble=byte>=48&&byte<=57?byte-48:byte>=65&&byte<=70?byte-55:byte>=97&&byte<=102?byte-87:-1;if(nibble>=0)digits.push(nibble);}
   const next=new Uint8Array(Math.ceil(digits.length/2));
   for(let i=0;i<digits.length;i+=2)next[i/2]=(digits[i]<<4)|(i+1<digits.length?digits[i+1]:0);
   out=next;
  }else if(filter==='/ASCII85Decode'){
   const decoded:number[]=[];let group:number[]=[];
   const flush=()=>{if(!group.length)return;const count=group.length;while(group.length<5)group.push(84);let value=0;for(const digit of group)value=value*85+digit;const full=[Math.floor(value/16777216)%256,Math.floor(value/65536)%256,Math.floor(value/256)%256,value%256];decoded.push(...full.slice(0,count-1));group=[];};
   for(const byte of out){
    if(byte===0x7A&&!group.length){decoded.push(0,0,0,0);continue;}
    if(byte===0x7E)break; // '~>' end-of-data marker
    if(byte<=32)continue;
    const digit=byte-33;if(digit<0||digit>84)break;
    group.push(digit);if(group.length===5)flush();
   }
   flush();out=new Uint8Array(decoded);
  }
 }
 return out;
}
/** Color spaces whose samples the canvas pipeline can decode and re-encode: device RGB/gray, or ICC profiles declaring the same channel counts. */
function supportedColorSpace(doc:PDFDocument,dict:PDFDict):'rgb'|'gray'|undefined{
 const value=dict.get(PDFName.of('ColorSpace'));
 if(value instanceof PDFArray){
  const entries=value.asArray(),kind=entries.length?doc.context.lookup(entries[0]):undefined;
  if(kind instanceof PDFName&&kind.toString()==='/ICCBased'&&entries.length===2){
   const profile=doc.context.lookup(entries[1]),n=profile instanceof PDFRawStream?profile.dict.lookupMaybe(PDFName.of('N'),PDFNumber)?.asNumber():undefined;
   if(n===3)return 'rgb';if(n===1)return 'gray';
  }
  return undefined;
 }
 const name=singleName(doc,dict,'ColorSpace');
 return name==='/DeviceRGB'?'rgb':name==='/DeviceGray'?'gray':undefined;
}
/** Channel count from the JPEG SOF marker: 1 is gray, 3 is YCbCr/RGB. CMYK and other channel counts are unsafe to re-encode through the canvas. */
function jpegComponents(bytes:Uint8Array){
 if(bytes.length<4||bytes[0]!==0xFF||bytes[1]!==0xD8)return undefined;
 let at=2;
 while(at+1<bytes.length){
  if(bytes[at]!==0xFF){at++;continue;}
  const marker=bytes[at+1];
  if(marker===0xD8||marker===0x01||marker>=0xD0&&marker<=0xD7){at+=2;continue;}
  if(at+3>=bytes.length)return undefined;
  const length=bytes[at+2]<<8|bytes[at+3];
  if(length<2)return undefined;
  if(marker>=0xC0&&marker<=0xCF&&marker!==0xC4&&marker!==0xC8&&marker!==0xCC)return at+9<bytes.length?bytes[at+9]:undefined;
  at+=2+length;
 }
 return undefined;
}
/** Optimize embedded RGB/gray JPEG and 8-bit Flate images without rasterizing pages. */
export async function optimizeJPEGImages(doc:PDFDocument,signal?:AbortSignal,options:JPEGOptimization={}){
 const quality=options.quality??.76,limit=options.maxDimension??2400;
 if(!Number.isFinite(quality)||quality<.1||quality>.95)throw new Error('JPEG quality must be between 0.1 and 0.95.');
 if(!Number.isFinite(limit)||limit<1)throw new Error('Image dimension must be positive.');
 let changed=0;
 const objects=doc.context.enumerateIndirectObjects();const total=objects.filter(([,obj])=>obj instanceof PDFRawStream&&singleName(doc,obj.dict,'Subtype')==='/Image').length;let seen=0;
 for(const [ref,obj] of objects){
  signal?.throwIfAborted();if(!(obj instanceof PDFRawStream))continue;
  if(singleName(doc,obj.dict,'Subtype')==='/Image')options.onProgress?.(++seen,total);
  const dict=obj.dict,chain=filterChain(doc,dict),filter=chain?.[chain.length-1],wrappers=chain?.slice(0,-1)??[];
  if(singleName(doc,dict,'Subtype')!=='/Image'||filter!=='/DCTDecode'&&filter!=='/FlateDecode'||wrappers.some(f=>f!=='/ASCII85Decode'&&f!=='/ASCIIHexDecode')||dict.has(PDFName.of('SMask'))||dict.has(PDFName.of('Mask'))||dict.has(PDFName.of('Decode'))||dict.has(PDFName.of('ImageMask')))continue;
  const space=supportedColorSpace(doc,dict);
  if(dict.has(PDFName.of('ColorSpace'))&&!space)continue;
  let contents=obj.contents;
  if(filter==='/DCTDecode'){
   if(wrappers.length)contents=unwrapAscii(obj.contents,wrappers);
   const components=jpegComponents(contents);
   if(components!==1&&components!==3)continue;
  }else if(!space)continue;
  const w=dict.lookupMaybe(PDFName.of('Width'),PDFNumber)?.asNumber()??0,h=dict.lookupMaybe(PDFName.of('Height'),PDFNumber)?.asNumber()??0;
  if(!Number.isInteger(w)||!Number.isInteger(h)||w<128||h<128||w*h<65536||w*h>22000000)continue;
  let decoded:Awaited<ReturnType<typeof decodePhoto>>|undefined,canvas:HTMLCanvasElement|undefined,sampleCanvas:HTMLCanvasElement|undefined;
  try{
   let source:CanvasImageSource;
   if(filter==='/DCTDecode'){
    if(dict.has(PDFName.of('DecodeParms')))continue;
    decoded=await decodePhoto(new File([contents.slice().buffer as ArrayBuffer],'image.jpg',{type:'image/jpeg'}));
    if(decoded.width!==w||decoded.height!==h)continue;source=decoded.source;
   }else{
    if(dict.lookupMaybe(PDFName.of('BitsPerComponent'),PDFNumber)?.asNumber()!==8)continue;
    const channels=space==='rgb'?3:1,params=dict.lookupMaybe(PDFName.of('DecodeParms'),PDFDict);
    const max=(w*channels+1)*h,raw=decodePDFRawStream(obj).getBytes(max+1),samples=imageSamples(raw,w,h,channels,params);
    sampleCanvas=document.createElement('canvas');sampleCanvas.width=w;sampleCanvas.height=h;
    const ctx=sampleCanvas.getContext('2d');if(!ctx)continue;const pixels=ctx.createImageData(w,h);
    for(let i=0;i<w*h;i++){const at=i*channels;pixels.data[i*4]=samples[at];pixels.data[i*4+1]=samples[at+(channels===3?1:0)];pixels.data[i*4+2]=samples[at+(channels===3?2:0)];pixels.data[i*4+3]=255;}
    ctx.putImageData(pixels,0,0);source=sampleCanvas;
   }
   signal?.throwIfAborted();const ratio=Math.min(1,limit/Math.max(w,h)),width=Math.max(1,Math.round(w*ratio)),height=Math.max(1,Math.round(h*ratio));
   canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;const ctx=canvas.getContext('2d');if(!ctx)continue;
   ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';ctx.drawImage(source,0,0,width,height);
   const blob=await new Promise<Blob|null>(resolve=>canvas!.toBlob(resolve,'image/jpeg',quality));
   signal?.throwIfAborted();if(!blob||blob.type!=='image/jpeg')continue;
   const bytes=new Uint8Array(await blob.arrayBuffer());if(bytes.length>=contents.length)continue;
   const replacement=dict.clone();replacement.set(PDFName.of('Length'),PDFNumber.of(bytes.length));replacement.set(PDFName.of('Width'),PDFNumber.of(width));replacement.set(PDFName.of('Height'),PDFNumber.of(height));replacement.set(PDFName.of('Filter'),PDFName.of('DCTDecode'));replacement.set(PDFName.of('ColorSpace'),PDFName.of('DeviceRGB'));replacement.set(PDFName.of('BitsPerComponent'),PDFNumber.of(8));replacement.delete(PDFName.of('DecodeParms'));
   doc.context.assign(ref,PDFRawStream.of(replacement,bytes));changed++;
  }catch(error){signal?.throwIfAborted();if(error instanceof Error&&error.name==='AbortError')throw error;}
  finally{decoded?.close();for(const c of [canvas,sampleCanvas])if(c){c.width=0;c.height=0;}}
  await new Promise(resolve=>setTimeout(resolve,0));
 }
 return changed;
}
