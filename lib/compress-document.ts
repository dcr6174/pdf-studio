import {PDFDocument} from 'pdf-lib';
import {optimizeJPEGImages} from './optimize-jpeg';
import {compactStreams} from './compact-streams';
import {deduplicateStreams} from './deduplicate-streams';
const cache=new WeakMap<Uint8Array,Map<string,{bytes:Uint8Array;images:number;streams:number;duplicates:number}>>();
export async function compressDocument(source:Uint8Array,quality:string,jpeg?:number,maxDimension?:number,signal?:AbortSignal,progress?:(n:number,detail?:string)=>void){
 signal?.throwIfAborted();const key=JSON.stringify([quality,jpeg,maxDimension]),cached=cache.get(source)?.get(key);if(cached)return cached;
 progress?.(1,'Opening PDF for compression');
 const doc=await PDFDocument.load(source,{updateMetadata:false});progress?.(3,'Repacking streams');const streams=await compactStreams(doc,signal);
 const images=quality==='compact'?0:await optimizeJPEGImages(doc,signal,{quality:jpeg??(quality==='image-small'?.5:.76),maxDimension:maxDimension??(quality==='image-small'?1600:2400),onProgress:(done,total)=>progress?.(5+done/Math.max(1,total)*80,`Image ${done} of ${total}`)});
 progress?.(87,'Checking duplicate streams');const duplicates=await deduplicateStreams(doc,signal);progress?.(93,'Saving compressed PDF');const output=await doc.save({useObjectStreams:true,updateFieldAppearances:false});signal?.throwIfAborted();
 progress?.(100,'Compression complete');const result={bytes:output.length<source.length?output:source,images:output.length<source.length?images:0,streams:output.length<source.length?streams:0,duplicates:output.length<source.length?duplicates:0};
 let entries=cache.get(source);if(!entries){entries=new Map();cache.set(source,entries);}if(entries.size>=3)entries.delete(entries.keys().next().value!);entries.set(key,result);return result;
}
