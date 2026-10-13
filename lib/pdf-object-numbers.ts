import {PDFArray,PDFDict,PDFRef,PDFStream,type PDFDocument,type PDFObject} from 'pdf-lib';
/** Keep all object versions while giving duplicate object numbers unique references for serialization. */
export function normalizePDFObjectNumbers(doc:PDFDocument):boolean{
 const entries=doc.context.enumerateIndirectObjects(),groups=new Map<number,typeof entries>(),replacements=new Map<PDFRef,PDFRef>();
 for(const entry of entries){const group=groups.get(entry[0].objectNumber)??[];group.push(entry);groups.set(entry[0].objectNumber,group);}
 for(const group of groups.values()){if(group.length<2)continue;group.sort((a,b)=>b[0].generationNumber-a[0].generationNumber);for(const [ref,object] of group.slice(1)){const next=doc.context.nextRef();replacements.set(ref,next);doc.context.assign(next,object);doc.context.delete(ref);}}
 if(!replacements.size)return false;
 const visited=new Set<PDFObject>();
 function rewrite(object:PDFObject):PDFObject{
  if(object instanceof PDFRef)return replacements.get(object)??object;
  if(visited.has(object))return object;visited.add(object);
  if(object instanceof PDFDict){for(const [key,value] of object.entries())object.set(key,rewrite(value));}
  else if(object instanceof PDFArray){for(let i=0;i<object.size();i++)object.set(i,rewrite(object.get(i)));}
  else if(object instanceof PDFStream)rewrite(object.dict);
  return object;
 }
 for(const [,object] of doc.context.enumerateIndirectObjects())rewrite(object);
 const trailer=doc.context.trailerInfo;
 for(const key of ['Root','Info','Encrypt','ID'] as const){const value=trailer[key];if(value)trailer[key]=rewrite(value);}
 return true;
}
