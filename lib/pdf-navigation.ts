import {PDFDocument,PDFDict,PDFArray,PDFName,PDFString,PDFHexString,PDFRef,PDFNumber,PDFNull,type PDFObject} from 'pdf-lib';

const key=PDFName.of;
export type OutlineEntry={title:string;page?:number;children:OutlineEntry[];dest?:PDFArray};
/** Copy only standard view parameters; never retain references into another document. */
function destinationView(doc:PDFDocument,dest:PDFArray|undefined,page:number):PDFArray{
 const fallback=()=>doc.context.obj([doc.getPage(page).ref,'Fit']);
 if(!dest)return fallback();
 const mode=dest.lookup(1);if(!(mode instanceof PDFName))return fallback();
 const lengths:Record<string,number>={XYZ:5,Fit:2,FitH:3,FitV:3,FitR:6,FitB:2,FitBH:3,FitBV:3};
 if(dest.size()!==lengths[mode.decodeText()])return fallback();
 const values:PDFObject[]=[doc.getPage(page).ref,mode];
 for(let i=2;i<dest.size();i++){const value=dest.lookup(i);if(value!==PDFNull&&!(value instanceof PDFNumber&&Number.isFinite(value.asNumber())))return fallback();values.push(value);}
 return doc.context.obj(values);
}

/** Flatten bounded page-label number trees into independent per-page descriptors. */
export function preservePageLabels(out:PDFDocument,sources:Map<string,PDFDocument>,order:{fileId:string;index:number}[]){
 const labels=new Map<string,{start:number;style?:string;prefix:string;number:number}[]>();
 for(const [id,source] of sources){
  const rows:{start:number;style?:string;prefix:string;number:number}[]=[];
  const seen=new Set<PDFDict>();let budget=1000;
  const walk=(node:PDFDict,depth=0)=>{if(depth>32||budget--<=0||seen.has(node))return;seen.add(node);
   const nums=node.lookup(key('Nums'));
   if(nums instanceof PDFArray)for(let i=0;i+1<nums.size()&&budget>0;i+=2){budget--;const start=nums.lookup(i),value=nums.lookup(i+1);if(!(start instanceof PDFNumber)||!(value instanceof PDFDict))continue;
    const n=start.asNumber();if(!Number.isInteger(n)||n<0||n>=source.getPageCount())continue;
    const s=value.lookup(key('S')),p=value.lookup(key('P')),st=value.lookup(key('St'));
    const style=s instanceof PDFName?s.decodeText():undefined;
    if(s&&(!style||!['D','R','r','A','a'].includes(style)))continue;
    const number=st instanceof PDFNumber?st.asNumber():1;if(!Number.isSafeInteger(number)||number<1||number>1e9)continue;
    rows.push({start:n,style,prefix:p instanceof PDFString||p instanceof PDFHexString?p.decodeText():'',number});
   }
   const kids=node.lookup(key('Kids'));if(kids instanceof PDFArray)for(let i=0;i<kids.size()&&budget>0;i++){budget--;const child=kids.lookup(i);if(child instanceof PDFDict)walk(child,depth+1);}
  };
  const root=source.catalog.lookup(key('PageLabels'));if(root instanceof PDFDict)walk(root);if(rows.length)labels.set(id,rows.sort((a,b)=>a.start-b.start));
 }
 if(!labels.size)return;
 const nums=out.context.obj([]);
 order.forEach((item,index)=>{const row=labels.get(item.fileId)?.filter(row=>row.start<=item.index).at(-1);
  const descriptor=out.context.obj({});
  if(row){if(row.style){descriptor.set(key('S'),key(row.style));descriptor.set(key('St'),PDFNumber.of(row.number+item.index-row.start));}if(row.prefix)descriptor.set(key('P'),PDFHexString.fromText(row.prefix));}
  else{descriptor.set(key('S'),key('D'));descriptor.set(key('St'),PDFNumber.of(index+1));}
  nums.push(PDFNumber.of(index));nums.push(descriptor);
 });
 out.catalog.set(key('PageLabels'),out.context.obj({Nums:nums}));
}
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
 const write=(entries:OutlineEntry[],parent:PDFRef):{first:PDFRef;last:PDFRef;count:number}=>{const nodes=entries.map(row=>doc.context.obj({Title:PDFHexString.fromText(row.title),Parent:parent})),refs=nodes.map(node=>doc.context.register(node));let count=entries.length;nodes.forEach((node,i)=>{const row=entries[i];if(i)node.set(key('Prev'),refs[i-1]);if(i+1<refs.length)node.set(key('Next'),refs[i+1]);if(row.page!==undefined&&row.page>=0&&row.page<doc.getPageCount())node.set(key('Dest'),destinationView(doc,row.dest,row.page));if(row.children.length){const child=write(row.children,refs[i]);node.set(key('First'),child.first);node.set(key('Last'),child.last);node.set(key('Count'),PDFNumber.of(child.count));count+=child.count;}});return {first:refs[0],last:refs[refs.length-1],count};};
 const tree=write(rows,rootRef);root.set(key('First'),tree.first);root.set(key('Last'),tree.last);root.set(key('Count'),PDFNumber.of(tree.count));doc.catalog.set(key('Outlines'),rootRef);doc.catalog.set(key('PageMode'),key('UseOutlines'));
}

/** Rebuild outline targets using the first retained copy of each source page. */
export function preserveOutlines(out:PDFDocument,sources:Map<string,PDFDocument>,order:{fileId:string;index:number}[]){
 const rows:OutlineEntry[]=[];
 for(const [fileId,source] of sources){const remap=(entries:OutlineEntry[]):OutlineEntry[]=>entries.flatMap(row=>{const page=row.page===undefined?undefined:order.findIndex(item=>item.fileId===fileId&&item.index===row.page),children=remap(row.children);if(page===undefined||page<0)return children.length?[{title:row.title,children}]:[];return [{title:row.title,page,children,dest:row.dest}];});rows.push(...remap(readOutline(source)));}
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
