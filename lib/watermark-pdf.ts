import {PDFDocument, rgb, pushGraphicsState, popGraphicsState, concatTransformationMatrix} from 'pdf-lib';
import {pageGeometry} from './page-geometry';
import {flattenFormSafely, hasFormWidgets} from './form-safe';

export type WatermarkSettings={text:string;size:number;opacity:number;color:string;angle:number;position:'center'|'top'|'bottom';scope:'all'|'custom';range:string;flatten:boolean};
export const defaultWatermark:WatermarkSettings={text:'DRAFT',size:56,opacity:25,color:'#64748b',angle:45,position:'center',scope:'all',range:'',flatten:false};
export function watermarkPages(settings:WatermarkSettings,count:number){
 if(!settings.text.trim())throw new Error('Enter your watermark text.');
 if(settings.text.trim().length>120)throw new Error('Keep your watermark to 120 characters or fewer.');
 if(!Number.isFinite(settings.size)||settings.size<12||settings.size>120||!Number.isFinite(settings.opacity)||settings.opacity<1||settings.opacity>100||!Number.isFinite(settings.angle)||Math.abs(settings.angle)>90||!/^#[a-f\d]{6}$/i.test(settings.color))throw new Error('Check the watermark appearance settings.');
 if(settings.scope==='all')return Array.from({length:count},(_,i)=>i);
 if(!settings.range.trim())throw new Error('Enter pages such as 1, 3-5.');
 const selected=new Set<number>();
 for(const token of settings.range.split(',')){const match=/^\s*(\d+)(?:\s*-\s*(\d+))?\s*$/.exec(token);if(!match)throw new Error('Use page numbers such as 1, 3-5.');const from=Number(match[1]),to=Number(match[2]??match[1]);if(from<1||to<from||to>count)throw new Error(`Choose pages between 1 and ${count}.`);for(let i=from-1;i<to;i++)selected.add(i);}
 return [...selected].sort((a,b)=>a-b);
}
/** Preview and export draw with the same PDF geometry, font metrics and settings. */
export async function watermarkPDF(bytes:Uint8Array,settings:WatermarkSettings,signal?:AbortSignal,previewPage?:number){
 signal?.throwIfAborted();const doc=await PDFDocument.load(bytes,{updateMetadata:false});const selected=watermarkPages(settings,doc.getPageCount());
 if(settings.flatten&&hasFormWidgets(doc))flattenFormSafely(doc);
 const targets=previewPage===undefined?selected:selected.includes(previewPage)?[previewPage]:[];
 if(targets.length){
  const fontkit=(await import('@pdf-lib/fontkit')).default;doc.registerFontkit(fontkit);
  const response=await fetch('/fonts/NotoSans-Regular.ttf',{signal});if(!response.ok)throw new Error('The watermark font could not load. Please try again.');
  const font=await doc.embedFont(await response.arrayBuffer(),{subset:true});const text=settings.text.trim();
  const supported=new Set(font.getCharacterSet()),unsupported=[...new Set([...text].filter(c=>!supported.has(c.codePointAt(0)!)))];if(unsupported.length)throw new Error('This font cannot display some characters in your watermark. Try different text.');
  const hex=settings.color.slice(1),color=rgb(parseInt(hex.slice(0,2),16)/255,parseInt(hex.slice(2,4),16)/255,parseInt(hex.slice(4,6),16)/255),theta=settings.angle*Math.PI/180,c=Math.cos(theta),s=Math.sin(theta);
  for(const index of targets){signal?.throwIfAborted();const page=doc.getPage(index),g=pageGeometry(page);const unitWidth=font.widthOfTextAtSize(text,1),unitHeight=font.heightAtSize(1,{descender:true});
   const availableHeight=settings.position==='center'?g.height*.72:g.height*.18;
   const size=Math.min(settings.size,g.width*.82/(Math.abs(c)*unitWidth+Math.abs(s)*unitHeight),availableHeight/(Math.abs(s)*unitWidth+Math.abs(c)*unitHeight));
   const width=unitWidth*size,height=unitHeight*size,centerY=settings.position==='top'?g.height*.86:settings.position==='bottom'?g.height*.14:g.height*.5;
   page.pushOperators(pushGraphicsState(),concatTransformationMatrix(...g.matrix as [number,number,number,number,number,number]),concatTransformationMatrix(c,s,-s,c,g.width/2,centerY));
   page.drawText(text,{x:-width/2,y:-height/2+height-font.heightAtSize(size,{descender:false}),size,font,color,opacity:settings.opacity/100});page.pushOperators(popGraphicsState());
  }
 }
 signal?.throwIfAborted();const output=await doc.save();signal?.throwIfAborted();return output;
}
