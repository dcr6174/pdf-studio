import {PDFArray,PDFDict,PDFDocument,PDFObject,PDFRawStream,PDFRef} from 'pdf-lib';

/** Share only byte-identical streams with identical dictionaries; retain all referring objects. */
export async function deduplicateStreams(doc:PDFDocument,signal?:AbortSignal){
 const buckets=new Map<string,{ref:PDFRef;stream:PDFRawStream}[]>(),replacements=new Map<string,PDFRef>();
 for(const [ref,obj] of doc.context.enumerateIndirectObjects()){
  signal?.throwIfAborted();if(!(obj instanceof PDFRawStream)||obj.contents.length<1024||obj.contents.length>16*1024*1024)continue;
  const dict=obj.dict.entries().map(([k,v])=>[k.toString(),v.toString()]).sort(([a],[b])=>a.localeCompare(b));
  const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',obj.contents.slice().buffer as ArrayBuffer))).map(n=>n.toString(16).padStart(2,'0')).join('');signal?.throwIfAborted();
  const key=JSON.stringify(dict)+hash,bucket=buckets.get(key)??[],same=bucket.find(x=>x.stream.contents.length===obj.contents.length&&x.stream.contents.every((v,i)=>v===obj.contents[i]));
  if(same)replacements.set(ref.toString(),same.ref);else{bucket.push({ref,stream:obj});buckets.set(key,bucket);}
 }
 if(!replacements.size)return 0;
 const pending:PDFObject[]=doc.context.enumerateIndirectObjects().map(([,obj])=>obj),seen=new WeakSet<PDFObject>();
 while(pending.length){signal?.throwIfAborted();const obj=pending.pop()!;if(seen.has(obj))continue;seen.add(obj);
  if(obj instanceof PDFRawStream)pending.push(obj.dict);
  else if(obj instanceof PDFDict){for(const [key,value] of obj.entries()){const replace=value instanceof PDFRef?replacements.get(value.toString()):undefined;if(replace)obj.set(key,replace);else if(!(value instanceof PDFRef))pending.push(value);}}
  else if(obj instanceof PDFArray){for(let i=0;i<obj.size();i++){const value=obj.get(i),replace=value instanceof PDFRef?replacements.get(value.toString()):undefined;if(replace)obj.set(i,replace);else if(!(value instanceof PDFRef))pending.push(value);}}
 }
 for(const [ref] of doc.context.enumerateIndirectObjects())if(replacements.has(ref.toString()))doc.context.delete(ref);
 return replacements.size;
}
