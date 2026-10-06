import {PDFDocument,PDFDict,PDFName,PDFArray} from 'pdf-lib';
import {displayPoint} from './page-geometry';
import type {Mark,PageItem} from './pdf-engine';
/** Widgets render above page content, regardless of mark creation order. */
export function hasOverlappingWidgets(document:PDFDocument,order:PageItem[],marks:Mark[]){
 return document.getPages().some((page,i)=>{
  const annotations=page.node.Annots();if(!annotations)return false;
  const regions=marks.filter(m=>m.pageId===order[i]?.id&&m.kind!=='redact').map(m=>{
   const corners=[[m.x,m.y],[m.x+m.w,m.y],[m.x,m.y+m.h],[m.x+m.w,m.y+m.h]].map(([u,v])=>displayPoint(page,u,v));
   return {left:Math.min(...corners.map(p=>p.x)),right:Math.max(...corners.map(p=>p.x)),bottom:Math.min(...corners.map(p=>p.y)),top:Math.max(...corners.map(p=>p.y))};
  });
  for(let n=0;n<annotations.size();n++){
   const widget=document.context.lookup(annotations.get(n));if(!(widget instanceof PDFDict)||widget.get(PDFName.of('Subtype'))!==PDFName.of('Widget'))continue;
   const rect=widget.lookup(PDFName.of('Rect'));if(!(rect instanceof PDFArray))continue;
   const a=rect.asArray().map(v=>Number(v.toString()));if(a.length!==4||!a.every(Number.isFinite))continue;
   const [left,bottom,right,top]=a;if(regions.some(r=>r.left<right&&r.right>left&&r.bottom<top&&r.top>bottom))return true;
  }return false;
 });
}
/** Flatten owned fields, then remove their actual widget references.
 * pdf-lib 1.17.1 removeField can leave deleted widget refs in page Annots. */
export function flattenFormSafely(document:PDFDocument){
 const form=document.getForm(),fields=form.getFields();
 const owned=new Set(fields.flatMap(field=>field.acroField.getWidgets().map(widget=>widget.dict)));
 const retained=document.getPages().map(page=>{const annotations=page.node.Annots();const keep=[];if(annotations)for(let i=0;i<annotations.size();i++){const ref=annotations.get(i),dict=document.context.lookup(ref);if(dict instanceof PDFDict&&dict.get(PDFName.of('Subtype'))===PDFName.of('Widget')){if(!owned.has(dict))throw new Error('An unattached form widget cannot be flattened safely. Save the PDF in its original form editor first.');}else keep.push(ref);}return keep;});
 form.flatten();
 document.getPages().forEach((page,i)=>{if(retained[i].length)page.node.set(PDFName.of('Annots'),document.context.obj(retained[i]));else page.node.delete(PDFName.of('Annots'));});
 if(form.getFields().length)throw new Error('Not all fields could be flattened.');
 document.catalog.delete(PDFName.of('AcroForm'));
}

export function hasFormWidgets(document:PDFDocument){return document.getPages().some(page=>{const annotations=page.node.Annots();if(!annotations)return false;for(let i=0;i<annotations.size();i++){const dict=document.context.lookup(annotations.get(i));if(dict instanceof PDFDict&&dict.get(PDFName.of('Subtype'))===PDFName.of('Widget'))return true;}return false;});}
