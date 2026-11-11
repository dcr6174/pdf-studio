import {PDFDocument,rgb,type PDFFont} from 'pdf-lib';
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
 // Always embed the app fonts. Referencing PDF standard fonts left width
 // selection to the viewer, and its substituted metrics collapsed the
 // measured space after wide words (e.g. "MDWATCH Heading").
 const load=async(path:string)=>{const response=await fetch(path);if(!response.ok)throw new Error('The document font could not load. Please retry.');return doc.embedFont(await response.arrayBuffer(),{subset:true});};
 const fonts=await Promise.all(['/fonts/NotoSans-Regular.ttf','/fonts/editing/NotoSans-Bold.ttf','/fonts/editing/NotoSans-Italic.ttf','/fonts/editing/NotoSans-BoldItalic.ttf'].map(load));
 const fontFor=(run:InlineRun):PDFFont=>fonts[Number(run.bold)+Number(run.italic)*2];
 let page=doc.addPage([595.28,841.89]),x=60,y=780;const right=535,lineHeight=18;
 const nextLine=(height=lineHeight)=>{x=60;y-=height;if(y<60){if(doc.getPageCount()>=2000)throw new Error('This document exceeds 2000 pages. Split it into smaller documents.');page=doc.addPage([595.28,841.89]);y=780;}};
 for(const raw of text.replace(/\r\n?/g,'\n').split('\n')){
  const heading=/^(#{1,6})\s+/.exec(raw),size=heading?Math.max(12,22-heading[1].length*2):11;
  const content=raw.replace(/^#{1,6}\s+/,'').replace(/^\s*[-*+]\s+/,'• ');
  for(const run of inlineMarkdown(content,!!heading)){
   const font=fontFor(run);
   for(const token of run.text.split(/(\s+)/).filter(Boolean)){
    if(!token.trim()){if(x>60)x+=font.widthOfTextAtSize(token,size);continue;}
    const width=font.widthOfTextAtSize(token,size);if(x+width>right&&x>60)nextLine(size*1.6);
    const draw=(word:string)=>{const w=font.widthOfTextAtSize(word,size);page.drawText(word,{x,y,font,size,color:rgb(.1,.14,.2)});x+=w;};
    if(width<=right-60)draw(token);else for(const char of token){if(x+font.widthOfTextAtSize(char,size)>right)nextLine(size*1.6);draw(char);}
   }
  }nextLine(size*1.6+4);
 }return doc.save();
}
