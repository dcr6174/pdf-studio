import {PDFDocument,PDFDict,PDFArray,PDFName,PDFString,PDFHexString,PDFRef,PDFNumber,type PDFObject} from 'pdf-lib';

const key=PDFName.of;
export type OutlineEntry={title:string;page?:number;children:OutlineEntry[];dest?:PDFArray};
/** Read local outline destinations with bounds and cycle guards. Never execute actions. */
export function localDestination(doc:PDFDocument,value:PDFObject|undefined):PDFArray|undefined{
 const named=(name:string):PDFObject|undefined=>{
  const old=doc.catalog.lookupMaybe(key('Dests'),PDFDict)?.get(key(name));if(old)return doc.context.lookup(old);
  const tree=doc.catalog.lookupMaybe(key('Names'),PDFDict)?.lookupMaybe(key('Dests'),PDFDict);let visited=0;
  const find=(node:PDFDict):PDFObject|undefined=>{if(++visited>1000)return;const names=node.lookupMaybe(key('Names'),PDFArray);if(names)for(let i=0;i+1<names.size();i+=2){const n=names.lookup(i);if((n instanceof PDFString||n instanceof PDFHexString)&&n.decodeText()===name)return names.lookup(i+1);}const kids=node.lookupMaybe(key('Kids'),PDFArray);if(kids)for(let i=0;i<kids.size();i++){const k=kids.lookup(i);if(k instanceof PDFDict){const result=find(k);if(result)return result;}}};return tree?find(tree):undefined;
 };
 const resolve=(value:PDFObject|undefined):PDFArray|undefined=>{if(!value)return;let dest=doc.context.lookup(value);if(dest instanceof PDFName)dest=named(dest.decodeText())!;else if(dest instanceof PDFString||dest instanceof PDFHexString)dest=named(dest.decodeText())!;if(dest instanceof PDFDict)dest=dest.lookup(key('D'));return dest instanceof PDFArray?dest:undefined;};

 return resolve(value);
}
export function readOutline(doc:PDFDocument):OutlineEntry[]{
 const pages=new Map(doc.getPages().map((p,i)=>[p.ref.toString(),i]));
 const seen=new Set<PDFDict>();let count=0;
 const walk=(first:PDFObject|undefined,depth=0):OutlineEntry[]=>{const rows:OutlineEntry[]=[];if(depth>32)return rows;let cursor=first;while(cursor&&count++<10000){const node=doc.context.lookup(cursor);if(!(node instanceof PDFDict)||seen.has(node))break;seen.add(node);const title=node.lookup(key('Title'));const action=node.lookupMaybe(key('A'),PDFDict);const dest=localDestination(doc,node.get(key('Dest'))??(action?.get(key('S'))?.toString()==='/GoTo'?action.get(key('D')):undefined));const target=dest?.get(0);const page=target instanceof PDFRef?pages.get(target.toString()):target instanceof PDFNumber?target.asNumber():undefined;rows.push({title:title instanceof PDFString||title instanceof PDFHexString?title.decodeText():'Untitled bookmark',page,children:walk(node.get(key('First')),depth+1),dest});cursor=node.get(key('Next'));}return rows;};
 return walk(doc.catalog.lookupMaybe(key('Outlines'),PDFDict)?.get(key('First')));
}

export function writeOutline(doc:PDFDocument,rows:OutlineEntry[]){
 if(!rows.length){doc.catalog.delete(key('Outlines'));return;}
 const root=doc.context.obj({Type:'Outlines'}),rootRef=doc.context.register(root);
 const write=(entries:OutlineEntry[],parent:PDFRef):{first:PDFRef;last:PDFRef;count:number}=>{const nodes=entries.map(row=>doc.context.obj({Title:PDFHexString.fromText(row.title),Parent:parent})),refs=nodes.map(node=>doc.context.register(node));let count=entries.length;nodes.forEach((node,i)=>{const row=entries[i];if(i)node.set(key('Prev'),refs[i-1]);if(i+1<refs.length)node.set(key('Next'),refs[i+1]);if(row.page!==undefined&&row.page>=0&&row.page<doc.getPageCount())node.set(key('Dest'),doc.context.obj([doc.getPage(row.page).ref,'Fit']));if(row.children.length){const child=write(row.children,refs[i]);node.set(key('First'),child.first);node.set(key('Last'),child.last);node.set(key('Count'),PDFNumber.of(child.count));count+=child.count;}});return {first:refs[0],last:refs[refs.length-1],count};};
 const tree=write(rows,rootRef);root.set(key('First'),tree.first);root.set(key('Last'),tree.last);root.set(key('Count'),PDFNumber.of(tree.count));doc.catalog.set(key('Outlines'),rootRef);doc.catalog.set(key('PageMode'),key('UseOutlines'));
}

/** Rebuild outline targets using the first retained copy of each source page. */
export function preserveOutlines(out:PDFDocument,sources:Map<string,PDFDocument>,order:{fileId:string;index:number}[]){
 const rows:OutlineEntry[]=[];
 for(const [fileId,source] of sources){const remap=(entries:OutlineEntry[]):OutlineEntry[]=>entries.flatMap(row=>{const page=row.page===undefined?undefined:order.findIndex(item=>item.fileId===fileId&&item.index===row.page),children=remap(row.children);if(page===undefined||page<0)return children.length?[{title:row.title,children}]:[];return [{title:row.title,page,children}];});rows.push(...remap(readOutline(source)));}
 writeOutline(out,rows);
}

/** Internal page links follow retained page references, rather than detached copied pages. */
export function remapPageLinks(out:PDFDocument,sources:Map<string,PDFDocument>,order:{fileId:string;index:number}[]){
 for(let i=0;i<order.length;i++){
  const item=order[i],source=sources.get(item.fileId);if(!source)continue;
  const original=source.getPage(item.index).node.lookupMaybe(key('Annots'),PDFArray),copied=out.getPage(i).node.lookupMaybe(key('Annots'),PDFArray);if(!original||!copied)continue;
  for(let n=Math.min(original.size(),copied.size())-1;n>=0;n--){const before=original.lookup(n),after=copied.lookup(n);if(!(before instanceof PDFDict)||!(after instanceof PDFDict)||before.get(key('Subtype'))?.toString()!=='/Link')continue;
   const action=before.lookupMaybe(key('A'),PDFDict);const value=before.get(key('Dest'))??(action?.get(key('S'))?.toString()==='/GoTo'?action.get(key('D')):undefined);if(!value)continue;
   const dest=localDestination(source,value),target=dest?.get(0);const page=target instanceof PDFRef?source.getPages().findIndex(p=>p.ref.toString()===target.toString()):target instanceof PDFNumber?target.asNumber():-1;
   const mapped=order.findIndex(p=>p.fileId===item.fileId&&p.index===page);
   if(!dest||mapped<0){copied.remove(n);continue;}
   const next=dest.clone(out.context);next.set(0,out.getPage(mapped).ref);
   if(before.has(key('Dest')))after.set(key('Dest'),next);else {const a=after.lookupMaybe(key('A'),PDFDict);a?.set(key('D'),next);}
  }
 }
}
