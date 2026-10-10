import {rgb,pushGraphicsState,popGraphicsState,concatTransformationMatrix,type PDFDocument,type PDFFont} from 'pdf-lib';
import {pageGeometry} from './page-geometry';
import {workflowSettings,type WorkflowStepSettings} from './workflow-recipes';

/** Place text in displayed page coordinates, accounting for crop boxes and page rotation. */
export function drawWorkflowWatermark(doc:PDFDocument,font:PDFFont,raw:WorkflowStepSettings){
 const s=workflowSettings('watermark',raw),text=s.text!.trim(),radians=Number(s.angle)*Math.PI/180,c=Math.cos(radians),sn=Math.sin(radians);
 const hex=s.watermarkColor!.slice(1),color=rgb(parseInt(hex.slice(0,2),16)/255,parseInt(hex.slice(2,4),16)/255,parseInt(hex.slice(4,6),16)/255);
 for(const page of doc.getPages()){
  const g=pageGeometry(page),pad=Math.min(24,g.width*.06,g.height*.06);
  let size=Number(s.watermarkSize),width=font.widthOfTextAtSize(text,size),height=font.heightAtSize(size);
  const bw=Math.abs(c)*width+Math.abs(sn)*height,bh=Math.abs(sn)*width+Math.abs(c)*height;
  const scale=Math.min(1,(g.width-2*pad)/Math.max(1,bw),(g.height-2*pad)/Math.max(1,bh));
  size*=scale;width*=scale;height*=scale;
  const halfW=(Math.abs(c)*width+Math.abs(sn)*height)/2,halfH=(Math.abs(sn)*width+Math.abs(c)*height)/2;
  const [vertical,horizontal]=s.watermarkPosition!.split('-');
  const x=horizontal==='left'?pad+halfW:horizontal==='right'?g.width-pad-halfW:g.width/2;
  const y=vertical==='top'?g.height-pad-halfH:vertical==='bottom'?pad+halfH:g.height/2;
  const ascent=font.heightAtSize(size,{descender:false}),descent=height-ascent;
  page.pushOperators(pushGraphicsState(),concatTransformationMatrix(...g.matrix as [number,number,number,number,number,number]),concatTransformationMatrix(c,sn,-sn,c,x,y));
  page.drawText(text,{x:-width/2,y:(descent-ascent)/2,size,font,color,opacity:Number(s.watermarkOpacity)/100});
  page.pushOperators(popGraphicsState());
 }
}
