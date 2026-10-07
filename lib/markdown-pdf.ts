import {PDFDocument,StandardFonts,rgb,degrees,type PDFFont} from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
export type InlineRun={text:string;bold:boolean;italic:boolean};
/** Parse basic inline emphasis; unmatched markers remain readable literal text. */
export function inlineMarkdown(text:string,bold=false,italic=false):InlineRun[]{
 const runs:InlineRun[]=[];let plain='';const flush=()=>{if(plain){runs.push({text:plain,bold,italic});plain='';}};
 for(let i=0;i<text.length;){
  if(text[i]==='\\'&&i+1<text.length){plain+=text[i+1];i+=2;continue;}
  if(text[i]==='*'||text[i]==='_'){
   const marker=text.slice(i,i+3)==='***'||text.slice(i,i+3)==='___'?text.slice(i,i+3):text.slice(i,i+2)==='**'||text.slice(i,i+2)==='__'?text.slice(i,i+2):text[i];
   const close=text.indexOf(marker,i+marker.length);
   if(close>i+marker.length){flush();runs.push(...inlineMarkdown(text.slice(i+marker.length,close),bold||marker.length>=2,italic||marker.length!==2));i=close+marker.length;continue;}
  }
  plain+=text[i++];
 }flush();return runs;
}
export async function markdownPDF(text:string){
 const doc=await PDFDocument.create();doc.registerFontkit(fontkit);
 const fonts=await Promise.all([StandardFonts.Helvetica,StandardFonts.HelveticaBold,StandardFonts.HelveticaOblique,StandardFonts.HelveticaBoldOblique].map(name=>doc.embedFont(name)));
 let unicode:PDFFont|undefined;const fontFor=async(run:InlineRun)=>{const font=fonts[Number(run.bold)+Number(run.italic)*2];try{font.encodeText(run.text);return {font,fallback:false};}catch{if(!unicode){const response=await fetch('/fonts/NotoSans-Regular.ttf');if(!response.ok)throw new Error('The document font could not load. Please retry.');unicode=await doc.embedFont(await response.arrayBuffer(),{subset:true});}return {font:unicode,fallback:true};}};
 let page=doc.addPage([595.28,841.89]),x=60,y=780;const right=535,lineHeight=18;
 const nextLine=(height=lineHeight)=>{x=60;y-=height;if(y<60){if(doc.getPageCount()>=400)throw new Error('This document exceeds 400 pages. Split it into smaller documents.');page=doc.addPage([595.28,841.89]);y=780;}};
 for(const raw of text.replace(/\r\n?/g,'\n').split('\n')){
  const heading=/^(#{1,6})\s+/.exec(raw),size=heading?Math.max(12,22-heading[1].length*2):11;
  const content=raw.replace(/^#{1,6}\s+/,'').replace(/^\s*[-*+]\s+/,'• ');
  for(const run of inlineMarkdown(content,!!heading)){
   const {font,fallback}=await fontFor(run);
   for(const token of run.text.split(/(\s+)/).filter(Boolean)){
    if(!token.trim()){if(x>60)x+=font.widthOfTextAtSize(token,size);continue;}
    const width=font.widthOfTextAtSize(token,size);if(x+width>right&&x>60)nextLine(size*1.6);
    const draw=(word:string)=>{const w=font.widthOfTextAtSize(word,size);page.drawText(word,{x,y,font,size,color:rgb(.1,.14,.2),...(fallback&&run.italic?{xSkew:degrees(12)}:{})});if(fallback&&run.bold)page.drawText(word,{x:x+.35,y,font,size,color:rgb(.1,.14,.2),...(run.italic?{xSkew:degrees(12)}:{})});x+=w;};
    if(width<=right-60)draw(token);else for(const char of token){if(x+font.widthOfTextAtSize(char,size)>right)nextLine(size*1.6);draw(char);}
   }
  }nextLine(size*1.6+4);
 }return doc.save();
}
