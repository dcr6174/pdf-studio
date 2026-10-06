import {PDFDocument,StandardFonts} from 'pdf-lib';
export type OCRWord={text:string;confidence:number;x:number;y:number;width:number;height:number};
export type OCRReviewPage={width:number;height:number;image:string;words:OCRWord[]}|null;
/** Replace the searchable layer; the original visible scan is never painted over. */
export async function rebuildReviewedOCR(blob:Blob,pages:OCRReviewPage[]){
 const source=await PDFDocument.load(await blob.arrayBuffer()),out=await PDFDocument.create(),font=await out.embedFont(StandardFonts.Helvetica);let omitted=0;
 for(let i=0;i<pages.length;i++){const review=pages[i];if(!review){const [page]=await out.copyPages(source,[i]);out.addPage(page);continue;}const page=out.addPage([review.width,review.height]),image=await out.embedJpg(review.image);page.drawImage(image,{x:0,y:0,width:review.width,height:review.height});for(const word of review.words){const text=Array.from(word.text).filter(c=>{try{font.encodeText(c);return true;}catch{omitted++;return false;}}).join('');if(!text.trim())continue;const size=Math.max(3,word.height),width=font.widthOfTextAtSize(text,size);page.drawText(text,{font,size:width>word.width?Math.max(1,size*word.width/width):size,x:word.x,y:review.height-word.y-word.height,opacity:0});}}
 const bytes=await out.save();return {blob:new Blob([bytes.slice().buffer as ArrayBuffer],{type:'application/pdf'}),omitted};
}
