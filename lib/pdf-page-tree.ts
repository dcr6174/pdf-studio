import {PDFArray,PDFDict,PDFName,PDFNumber,type PDFDocument} from 'pdf-lib';
/** Repair stale /Count entries without rebuilding pages, forms, links or outlines. */
export function repairPageTreeCounts(doc:PDFDocument):boolean{
 const seen=new Set<PDFDict>();let changed=false;
 function visit(node:PDFDict,depth:number):number{
  if(depth>500||seen.has(node))throw new Error('This PDF has an invalid page tree. Open a readable copy.');
  seen.add(node);
  if(node.lookupMaybe(PDFName.of('Type'),PDFName)===PDFName.of('Page'))return 1;
  const kids=node.lookup(PDFName.of('Kids'),PDFArray);let count=0;
  for(const kid of kids.asArray())count+=visit(doc.context.lookup(kid,PDFDict),depth+1);
  const stored=node.lookupMaybe(PDFName.of('Count'),PDFNumber)?.asNumber();
  if(stored!==count){node.set(PDFName.of('Count'),PDFNumber.of(count));changed=true;}
  return count;
 }
 visit(doc.catalog.Pages(),0);return changed;
}
