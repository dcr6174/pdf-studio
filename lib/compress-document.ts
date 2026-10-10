import {PDFDocument} from 'pdf-lib';
import {optimizeJPEGImages} from './optimize-jpeg';
import {compactStreams} from './compact-streams';
const cache=new WeakMap<Uint8Array,Map<string,{bytes:Uint8Array;images:number;streams:number}>>();
export async function compressDocument(source:Uint8Array,quality:string,jpeg?:number,maxDimension?:number,signal?:AbortSignal){
 signal?.throwIfAborted();const key=JSON.stringify([quality,jpeg,maxDimension]),cached=cache.get(source)?.get(key);if(cached)return cached;
 const doc=await PDFDocument.load(source,{updateMetadata:false}),streams=await compactStreams(doc,signal);
 const images=quality==='compact'?0:await optimizeJPEGImages(doc,signal,{quality:jpeg??(quality==='image-small'?.5:.76),maxDimension:maxDimension??(quality==='image-small'?1600:2400)});
 const output=await doc.save({useObjectStreams:true,updateFieldAppearances:false});signal?.throwIfAborted();
 const result={bytes:output.length<source.length?output:source,images:output.length<source.length?images:0,streams:output.length<source.length?streams:0};
 let entries=cache.get(source);if(!entries){entries=new Map();cache.set(source,entries);}if(entries.size>=3)entries.delete(entries.keys().next().value!);entries.set(key,result);return result;
}
