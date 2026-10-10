import {PDFDocument,PDFRawStream,PDFName,PDFNumber,decodePDFRawStream} from 'pdf-lib';

/** Re-encode the same decoded bytes; keep predictors and every stream dictionary. */
export async function compactStreams(doc:PDFDocument,signal?:AbortSignal){
 if(typeof CompressionStream==='undefined')return 0;
 let changed=0;
 for(const [ref,obj] of doc.context.enumerateIndirectObjects()){
  signal?.throwIfAborted();
  if(!(obj instanceof PDFRawStream)||obj.contents.length<1024)continue;
  const filter=obj.dict.get(PDFName.of('Filter'));
  if(filter&&filter.toString()!=='/FlateDecode')continue;
  if(!filter&&(obj.contents.length>16*1024*1024||obj.dict.has(PDFName.of('DecodeParms'))))continue;
  try{
   const decoded=filter?decodePDFRawStream(obj).getBytes(16*1024*1024+1):obj.contents;if(decoded.length>16*1024*1024)continue;
   const encoded=new Uint8Array(await new Response(new Blob([decoded.slice().buffer as ArrayBuffer]).stream().pipeThrough(new CompressionStream('deflate'))).arrayBuffer());
   signal?.throwIfAborted();if(encoded.length>=obj.contents.length)continue;
   const dict=obj.dict.clone();if(!filter)dict.set(PDFName.of('Filter'),PDFName.of('FlateDecode'));dict.set(PDFName.of('Length'),PDFNumber.of(encoded.length));doc.context.assign(ref,PDFRawStream.of(dict,encoded));changed++;
  }catch(error){signal?.throwIfAborted();if(error instanceof Error&&error.name==='AbortError')throw error;}
  await new Promise(resolve=>setTimeout(resolve,0));
 }
 return changed;
}
