import {preserveOutlines,remapPageLinks,preservePageLabels} from './pdf-navigation';
import {PDFDocument,PDFName,PDFArray,PDFDict,PDFHexString,PDFNumber,PDFRef,rgb,StandardFonts} from 'pdf-lib';
export function addBookmarks(doc:PDFDocument,input:string,mode:'append'|'replace'='append'){const rows=input.split('\n').map(v=>v.trim()).filter(Boolean);if(!rows.length)throw new Error('Add at least one bookmark: page number followed by a title.');if(rows.length>100)throw new Error('Use at most 100 bookmarks.');const parsed=rows.map(line=>{const m=line.match(/^(\d+)\s+(.+)$/);if(!m||Number(m[1])<1||Number(m[1])>doc.getPageCount())throw new Error('Each bookmark needs a valid page number and title, such as 1 Introduction.');return{page:Number(m[1])-1,title:m[2]};});const existing=mode==='append'?doc.catalog.lookupMaybe(PDFName.of('Outlines'),PDFDict):undefined;const root=existing??doc.context.obj({Type:'Outlines',Count:0}),rootRef=existing?(doc.catalog.get(PDFName.of('Outlines')) instanceof PDFDict?doc.context.register(root):doc.catalog.get(PDFName.of('Outlines'))!):doc.context.register(root),nodes=parsed.map(v=>doc.context.obj({Title:PDFHexString.fromText(v.title),Parent:rootRef,Dest:[doc.getPage(v.page).ref,'Fit']})),refs=nodes.map(n=>doc.context.register(n));nodes.forEach((n,i)=>{if(i)n.set(PDFName.of('Prev'),refs[i-1]);if(i+1<refs.length)n.set(PDFName.of('Next'),refs[i+1]);});const last=root.lookupMaybe(PDFName.of('Last'),PDFDict);if(last){last.set(PDFName.of('Next'),refs[0]);nodes[0].set(PDFName.of('Prev'),root.get(PDFName.of('Last'))!);}else root.set(PDFName.of('First'),refs[0]);root.set(PDFName.of('Last'),refs[refs.length-1]);const prior=root.lookupMaybe(PDFName.of('Count'),PDFNumber)?.asNumber()??0;root.set(PDFName.of('Count'),PDFNumber.of(Math.abs(prior)+parsed.length));doc.catalog.set(PDFName.of('Outlines'),rootRef);doc.catalog.set(PDFName.of('PageMode'),PDFName.of('UseOutlines'));}
export function removeAnnotations(doc:PDFDocument){let removed=0;for(const p of doc.getPages()){const a=p.node.lookupMaybe(PDFName.of('Annots'),PDFArray);if(!a)continue;for(let i=a.size()-1;i>=0;i--){const entry=a.lookup(i,PDFDict);if(entry.get(PDFName.of('Subtype'))?.toString()!=='/Widget'){a.remove(i);removed++;}}}return removed;}
export async function halvePages(doc:PDFDocument){
 if(doc.getPageCount()*2>5000)throw new Error('Splitting in half would exceed 5000 pages.');
 const out=await PDFDocument.create();
 for(let i=0;i<doc.getPageCount();i++){
  const source=doc.getPage(i),b=source.getCropBox(),r=((source.getRotation().angle%360)+360)%360;
  for(let side=0;side<2;side++){
   const p=(await out.copyPages(doc,[i]))[0],part=r===180||r===270?1-side:side;
   if(r%180)p.setCropBox(b.x,b.y+part*b.height/2,b.width,b.height/2);else p.setCropBox(b.x+part*b.width/2,b.y,b.width/2,b.height);
   out.addPage(p);
  }
 }
 const sources=new Map([['source',doc]]),order=Array.from({length:out.getPageCount()},(_,i)=>({fileId:'source',index:Math.floor(i/2)}));
 remapPageLinks(out,sources,order);preserveOutlines(out,sources,order);preservePageLabels(out,sources,order);
 for(const p of out.getPages()){
  const crop=p.getCropBox(),annots=p.node.lookupMaybe(PDFName.of('Annots'),PDFArray);if(!annots)continue;
  for(let n=annots.size()-1;n>=0;n--){
   const a=annots.lookup(n);if(!(a instanceof PDFDict)||a.get(PDFName.of('Subtype'))?.toString()!=='/Link')continue;
   const rect=a.lookupMaybe(PDFName.of('Rect'),PDFArray);if(!rect||rect.size()!==4)continue;
   const values=rect.asArray().map(v=>v instanceof PDFNumber?v.asNumber():NaN);if(values.some(v=>!Number.isFinite(v)))continue;
   const x1=Math.max(crop.x,Math.min(values[0],values[2])),y1=Math.max(crop.y,Math.min(values[1],values[3])),x2=Math.min(crop.x+crop.width,Math.max(values[0],values[2])),y2=Math.min(crop.y+crop.height,Math.max(values[1],values[3]));
   if(x2<=x1||y2<=y1)annots.remove(n);else {a.set(PDFName.of('Rect'),out.context.obj([x1,y1,x2,y2]));a.delete(PDFName.of('QuadPoints'));}
  }
 }
 return out;
}
export async function createForm(input:string){const names=input.split('\n').map(s=>s.trim()).filter(Boolean);if(!names.length)throw new Error('Enter a field label on each line.');if(names.length>60)throw new Error('Use at most 60 fields.');if(names.some(n=>n.length>80||!/^[\x20-\x7e]+$/.test(n)))throw new Error('Use English field labels of up to 80 characters.');const d=await PDFDocument.create(),font=await d.embedFont(StandardFonts.Helvetica),form=d.getForm();const seen=new Map<string,number>();let page=d.addPage([595.28,841.89]),y=755;page.drawText('Fillable form',{x:40,y:790,size:22,font});for(let i=0;i<names.length;i++){if(y<85){page=d.addPage([595.28,841.89]);y=755;}page.drawText(names[i].replace(/^\[checkbox\]\s*/i,''),{x:40,y,size:12,font,color:rgb(.14,.12,.25)});const baseName=names[i].replace(/^\[checkbox\]\s*/i,'').replace(/\./g,' ').trim()||'Field';const occurrence=(seen.get(baseName)??0)+1;seen.set(baseName,occurrence);const fieldName=occurrence===1?baseName:baseName+' ['+occurrence+']';const checkbox=/^\[checkbox\]\s*/i.test(names[i]);const field=checkbox?form.createCheckBox(fieldName):form.createTextField(fieldName);field.addToPage(page,{x:40,y:y-40,width:checkbox?22:515,height:checkbox?22:28,backgroundColor:undefined,borderWidth:1,borderColor:rgb(.6,.55,.75)});y-=85;}form.updateFieldAppearances(font);return d;}

/** Remove only the requested reachable PDF structures; this is not secure redaction. */
export function cleanupPDF(doc:PDFDocument,kind:'remove-bookmarks'|'remove-links'|'remove-attachments'){
 let removed=0;
 if(kind==='remove-bookmarks'){
  if(doc.catalog.has(PDFName.of('Outlines'))){doc.catalog.delete(PDFName.of('Outlines'));removed++;}
  if(doc.catalog.get(PDFName.of('PageMode'))?.toString()==='/UseOutlines')doc.catalog.delete(PDFName.of('PageMode'));
  return removed;
 }
 const stripAssociated=(dict:PDFDict)=>{if(dict.has(PDFName.of('AF'))){dict.delete(PDFName.of('AF'));removed++;}};
 const payload=new Set<PDFRef>();
 const collectSpec=(spec:PDFDict|undefined)=>{if(!spec)return;const ef=spec.lookupMaybe(PDFName.of('EF'),PDFDict);if(!ef)return;for(const key of ['F','UF','DOS','Mac','Unix']){const ref=ef.get(PDFName.of(key));if(ref instanceof PDFRef)payload.add(ref);}};
 const collectTree=(node:PDFDict)=>{const entries=node.lookupMaybe(PDFName.of('Names'),PDFArray);if(entries)for(let i=1;i<entries.size();i+=2){const ref=entries.get(i);if(ref instanceof PDFRef){payload.add(ref);const spec=doc.context.lookup(ref);if(spec instanceof PDFDict)collectSpec(spec);}else if(ref instanceof PDFDict)collectSpec(ref);}const kids=node.lookupMaybe(PDFName.of('Kids'),PDFArray);if(kids)for(let i=0;i<kids.size();i++){const kid=kids.get(i);if(kid instanceof PDFRef){const dict=doc.context.lookup(kid);if(dict instanceof PDFDict)collectTree(dict);}}};
 if(kind==='remove-attachments'){
  const names=doc.catalog.lookupMaybe(PDFName.of('Names'),PDFDict);
  const tree=names?.lookupMaybe(PDFName.of('EmbeddedFiles'),PDFDict);
  if(tree)collectTree(tree);
  if(names?.has(PDFName.of('EmbeddedFiles'))){names.delete(PDFName.of('EmbeddedFiles'));removed++;}
  for(const [,object] of doc.context.enumerateIndirectObjects())if(object instanceof PDFDict)stripAssociated(object);
  stripAssociated(doc.catalog);
 }
 for(const page of doc.getPages()){
  if(kind==='remove-attachments')stripAssociated(page.node);
  const annots=page.node.lookupMaybe(PDFName.of('Annots'),PDFArray);if(!annots)continue;
  for(let i=annots.size()-1;i>=0;i--){const entry=annots.lookup(i,PDFDict);
   const subtype=entry.get(PDFName.of('Subtype'))?.toString();
   if(subtype===(kind==='remove-links'?'/Link':'/FileAttachment')){if(kind==='remove-attachments'){const fs=entry.get(PDFName.of('FS'));if(fs instanceof PDFRef){payload.add(fs);const spec=doc.context.lookup(fs);if(spec instanceof PDFDict)collectSpec(spec);}else if(fs instanceof PDFDict)collectSpec(fs);}annots.remove(i);removed++;}
  }
 }
 if(kind==='remove-attachments')for(const ref of payload)doc.context.delete(ref);
 return removed;
}

