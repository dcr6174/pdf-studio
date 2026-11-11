import {brandDownloadName} from '../export-filename';
import {PDFDocument,PDFName} from 'pdf-lib';
import JSZip from 'jszip';
import type {NewTool} from './types';
import {openPdf,pdfResult,textResult,num,inRange,PAGE_SIZES} from './shared';
import {renderer} from '../pdf-client';

type Line={text:string;size:number;y:number};
async function pdfjsLib(){const m=await import('../pdf-engine');return m.pdfjs();}
async function pageLines(page:Awaited<ReturnType<Awaited<ReturnType<typeof renderer>>['getPage']>>):Promise<Line[]>{
 const c=await page.getTextContent(),rows:{y:number;size:number;items:{x:number;s:string}[]}[]=[];
 for(const it of c.items){
  if(!('str' in it)||!it.str.trim())continue;
  const y=it.transform[5],size=Math.hypot(it.transform[2],it.transform[3])||it.height,x=it.transform[4];
  const row=rows.find(r=>Math.abs(r.y-y)<size*0.4);
  if(row)row.items.push({x,s:it.str});else rows.push({y,size,items:[{x,s:it.str}]});
 }
 rows.sort((a,b)=>b.y-a.y);
 return rows.map(r=>({y:r.y,size:Math.max(...[r.size]),text:r.items.sort((a,b)=>a.x-b.x).map(i=>i.s).join(' ').replace(/\s+/g,' ').trim()}));
}
async function allText(bytes:Uint8Array,progress:(n:number)=>void){
 const r=await renderer(bytes),pages:Line[][]=[];
 try{for(let i=1;i<=r.numPages;i++){pages.push(await pageLines(await r.getPage(i)));progress(Math.round(i/r.numPages*100));}}finally{await r.destroy();}
 return pages;
}
const noText='No selectable text was found. If this is a scan, run Searchable PDF (OCR) first.';

const links:NewTool={
 id:'extract-pdf-links',action:'Extract links',
 fields:[{key:'format',label:'Format',type:'select',def:'txt',options:[['txt','Plain list'],['csv','CSV (page, link)']]}],
 async run({bytes,v,progress}){
  const r=await renderer(bytes),rows:[number,string][]=[];
  try{for(let i=1;i<=r.numPages;i++){const a=await (await r.getPage(i)).getAnnotations();for(const x of a)if(x.subtype==='Link'&&(x.url||x.unsafeUrl))rows.push([i,String(x.url||x.unsafeUrl)]);progress(Math.round(i/r.numPages*100));}}finally{await r.destroy();}
  if(!rows.length)throw new Error('This PDF has no web links.');
  const unique=new Set(rows.map(r=>r[1])).size;
  const rep=`Found ${rows.length} link${rows.length===1?'':'s'} (${unique} unique).`;
  if(v.format==='csv')return textResult('page,link\n'+rows.map(([p,u])=>`${p},"${u.replace(/"/g,'""')}"`).join('\n')+'\n','csv','text/csv',rep);
  return textResult(rows.map(([p,u])=>`${u}  (page ${p})`).join('\n')+'\n','txt','text/plain',rep+'\n'+rows.slice(0,40).map(([p,u])=>`p${p}: ${u}`).join('\n'));
 }
};

type Node={title:string;items:Node[]};
const bookmarks:NewTool={
 id:'extract-pdf-bookmarks',action:'Extract bookmarks',
 fields:[{key:'format',label:'Format',type:'select',def:'txt',options:[['txt','Indented outline'],['json','JSON']]}],
 async run({bytes,v}){
  const r=await renderer(bytes);let out:Node[]|null;
  try{out=await r.getOutline() as Node[]|null;}finally{await r.destroy();}
  if(!out||!out.length)throw new Error('This PDF has no bookmarks (outline).');
  let n=0;const lines:string[]=[];const walk=(a:Node[],d:number)=>{for(const x of a){n++;lines.push('  '.repeat(d)+x.title);walk(x.items??[],d+1);}};walk(out,0);
  const strip=(a:Node[]):unknown[]=>a.map(x=>({title:x.title,children:strip(x.items??[])}));
  if(v.format==='json')return textResult(JSON.stringify(strip(out),null,2),'json','application/json',`Exported ${n} bookmarks.`);
  return textResult(lines.join('\n')+'\n','txt','text/plain',`Exported ${n} bookmarks.\n`+lines.slice(0,40).join('\n'));
 }
};

const STOP=new Set('the a an and or of to in is it that for on as with was are be by this at from not have has had but they you we i he she his her its our their will would can could if so no do does did been were than then there which who what when where how all any more most other some such into over also'.split(' '));
const words:NewTool={
 id:'pdf-word-counter',action:'Count words',fields:[],
 async run({bytes,progress,name}){
  const pages=await allText(bytes,progress),texts=pages.map(p=>p.map(l=>l.text).join(' '));
  const all=texts.join(' ').trim();if(!all)throw new Error(noText);
  const w=all.split(/\s+/).filter(Boolean),freq=new Map<string,number>();
  for(const x of w){const k=x.toLowerCase().replace(/^[^a-z0-9]+|[^a-z0-9]+$/g,'');if(k.length>2&&!STOP.has(k))freq.set(k,(freq.get(k)??0)+1);}
  const top=[...freq].sort((a,b)=>b[1]-a[1]).slice(0,10),sentences=(all.match(/[.!?](\s|$)/g)||[]).length||1;
  const mins=Math.max(1,Math.round(w.length/230));
  const out=[`Word count for ${name}`,'',`Pages: ${pages.length}`,`Words: ${w.length}`,`Characters (with spaces): ${all.length}`,`Characters (no spaces): ${all.replace(/\s/g,'').length}`,`Sentences: ${sentences}`,`Average words per page: ${Math.round(w.length/pages.length)}`,`Reading time: about ${mins} minute${mins===1?'':'s'}`,'','Most used words:',...top.map(([k,c])=>`  ${k}: ${c}`),'','Words per page:',...texts.map((t,i)=>`  Page ${i+1}: ${t.split(/\s+/).filter(Boolean).length}`)].join('\n');
  return textResult(out+'\n','txt','text/plain',out);
 }
};

const info:NewTool={
 id:'pdf-document-info',action:'Read document info',fields:[],
 async run({bytes,name}){
  const header=new TextDecoder('latin1').decode(bytes.slice(0,16)).match(/%PDF-(\d\.\d)/)?.[1]??'unknown';
  let doc:PDFDocument,locked=false;
  try{doc=await PDFDocument.load(bytes,{updateMetadata:false});}catch{doc=await PDFDocument.load(bytes,{ignoreEncryption:true,updateMetadata:false});locked=true;}
  const sizes=new Map<string,number>();
  doc.getPages().forEach(p=>{const{width,height}=p.getSize();const k=`${(width/72*25.4).toFixed(0)} x ${(height/72*25.4).toFixed(0)} mm (${width.toFixed(0)} x ${height.toFixed(0)} pt)`;sizes.set(k,(sizes.get(k)??0)+1);});
  let fields=0;try{fields=doc.getForm().getFields().length;}catch{/* none */}
  const attachments=(()=>{try{const n=doc.catalog.lookup(PDFName.of('Names'));return n?'yes':'no';}catch{return 'unknown';}})();
  const d=(x?:Date)=>x?x.toISOString().slice(0,19).replace('T',' ')+' UTC':'not set';
  const lines=[`Document information for ${name}`,'',`File size: ${(bytes.length/1024).toFixed(1)} KB`,`PDF version: ${header}`,`Pages: ${doc.getPageCount()}`,`Encrypted: ${locked?'yes':'no'}`,`Title: ${doc.getTitle()??'not set'}`,`Author: ${doc.getAuthor()??'not set'}`,`Subject: ${doc.getSubject()??'not set'}`,`Keywords: ${doc.getKeywords()??'not set'}`,`Creator: ${doc.getCreator()??'not set'}`,`Producer: ${doc.getProducer()??'not set'}`,`Created: ${d(doc.getCreationDate())}`,`Modified: ${d(doc.getModificationDate())}`,`Form fields: ${fields}`,`Has name tree (attachments or destinations): ${attachments}`,'','Page sizes:',...[...sizes].map(([k,c])=>`  ${c} page${c===1?'':'s'}: ${k}`)];
  return textResult(lines.join('\n')+'\n','txt','text/plain',lines.join('\n'));
 }
};

const markdown:NewTool={
 id:'pdf-to-markdown',action:'Convert to Markdown',fields:[],
 async run({bytes,progress}){
  const pages=await allText(bytes,progress),sizes=pages.flat().map(l=>l.size).sort((a,b)=>a-b);
  if(!sizes.length)throw new Error(noText);
  const body=sizes[Math.floor(sizes.length/2)],out:string[]=[];
  pages.forEach((lines,pi)=>{
   let para:string[]=[];const flush=()=>{if(para.length){out.push(para.join(' '));para=[];}};
   let prevY=0;
   for(const l of lines){
    const ratio=l.size/body;
    if(ratio>=1.5){flush();out.push('# '+l.text);}
    else if(ratio>=1.25){flush();out.push('## '+l.text);}
    else if(ratio>=1.1&&l.text.length<80){flush();out.push('### '+l.text);}
    else if(/^([-•*·▪●]|\d+[.)])\s+/.test(l.text)){flush();out.push(l.text.replace(/^[•*·▪●]\s+/,'- ').replace(/^(\d+)\)\s+/,'$1. '));}
    else{if(para.length&&prevY-l.y>l.size*1.9)flush();para.push(l.text);}
    prevY=l.y;
   }
   flush();if(pi<pages.length-1)out.push('---');
  });
  const text=out.join('\n\n')+'\n';
  return textResult(text,'md','text/markdown',`Converted ${pages.length} pages. Headings are guessed from font size, so check them.\n\n`+text.slice(0,1500));
 }
};

const json:NewTool={
 id:'pdf-to-json',action:'Convert to JSON',
 fields:[{key:'lines',label:'Keep text as separate lines',type:'checkbox',def:false}],
 async run({bytes,v,progress,name}){
  const pages=await allText(bytes,progress);if(!pages.flat().length)throw new Error(noText);
  const data={file:name,pageCount:pages.length,pages:pages.map((p,i)=>({page:i+1,...(v.lines?{lines:p.map(l=>l.text)}:{text:p.map(l=>l.text).join('\n')})}))};
  return textResult(JSON.stringify(data,null,2),'json','application/json',`Exported ${pages.length} pages of text as JSON.`);
 }
};

async function renderGray(page:Awaited<ReturnType<Awaited<ReturnType<typeof renderer>>['getPage']>>,scale:number){
 const vp=page.getViewport({scale}),c=document.createElement('canvas');c.width=Math.max(1,Math.ceil(vp.width));c.height=Math.max(1,Math.ceil(vp.height));
 const ctx=c.getContext('2d',{willReadFrequently:true})!;ctx.fillStyle='#fff';ctx.fillRect(0,0,c.width,c.height);
 await page.render({canvasContext:ctx,viewport:vp,canvas:c} as never).promise;
 return {ctx,w:c.width,h:c.height,vp};
}
const blank:NewTool={
 id:'remove-blank-pages',action:'Remove blank pages',
 fields:[{key:'level',label:'How strict',type:'select',def:'normal',options:[['strict','Strict (only truly empty pages)'],['normal','Normal (ignore specks and scan noise)'],['loose','Loose (also near-empty pages)']]}],
 async run({bytes,v,progress}){
  const limit={strict:0.00002,normal:0.0006,loose:0.004}[String(v.level)]??0.0006;
  const r=await renderer(bytes),drop:number[]=[];
  try{
   for(let i=1;i<=r.numPages;i++){
    const{ctx,w,h}=await renderGray(await r.getPage(i),0.4),d=ctx.getImageData(0,0,w,h).data;let ink=0;
    const mx=Math.floor(w*0.03),my=Math.floor(h*0.03);
    for(let y=my;y<h-my;y++)for(let x=mx;x<w-mx;x++){const k=(y*w+x)*4;if(d[k]<225||d[k+1]<225||d[k+2]<225)ink++;}
    if(ink/((w-2*mx)*(h-2*my))<=limit)drop.push(i-1);
    progress(Math.round(i/r.numPages*100));
   }
  }finally{await r.destroy();}
  const doc=await openPdf(bytes),n=doc.getPageCount();
  if(!drop.length)throw new Error('No blank pages were found, so nothing was removed. Try a looser setting if you expect some.');
  if(drop.length===n)throw new Error('Every page looks blank at this setting. Try a stricter setting.');
  [...drop].reverse().forEach(i=>doc.removePage(i));
  return pdfResult(await doc.save(),`Removed ${drop.length} blank page${drop.length===1?'':'s'} (pages ${drop.map(i=>i+1).join(', ')}). ${doc.getPageCount()} pages remain.`);
 }
};

const crop:NewTool={
 id:'crop-pdf-to-content',action:'Crop to content',
 fields:[{key:'pad',label:'Space around the content (mm)',type:'number',def:5,min:0,max:50},{key:'same',label:'Use one crop for every page',type:'checkbox',def:false,help:'Uses the largest content area found, so all pages keep the same size.'}],
 async run({bytes,v,progress}){
  const pad=inRange(num(v,'pad'),0,50,'Space around the content')*72/25.4;
  const r=await renderer(bytes),boxes:({x0:number;y0:number;x1:number;y1:number}|null)[]=[];
  try{
   for(let i=1;i<=r.numPages;i++){
    const page=await r.getPage(i),sc=1.5,{ctx,w,h,vp}=await renderGray(page,sc),d=ctx.getImageData(0,0,w,h).data;
    let x0=w,y0=h,x1=-1,y1=-1;
    for(let y=0;y<h;y++)for(let x=0;x<w;x++){const k=(y*w+x)*4;if(d[k]<240||d[k+1]<240||d[k+2]<240){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y;}}
    if(x1<0){boxes.push(null);}
    else{const a=vp.convertToPdfPoint(x0,y0),b=vp.convertToPdfPoint(x1+1,y1+1);boxes.push({x0:Math.min(a[0],b[0]),x1:Math.max(a[0],b[0]),y0:Math.min(a[1],b[1]),y1:Math.max(a[1],b[1])});}
    progress(Math.round(i/r.numPages*100));
   }
  }finally{await r.destroy();}
  const doc=await openPdf(bytes);let n=0;
  const found=boxes.filter(Boolean) as NonNullable<(typeof boxes)[number]>[];
  if(!found.length)throw new Error('All pages look blank, so there is nothing to crop to.');
  const u=v.same?{x0:Math.min(...found.map(b=>b.x0)),y0:Math.min(...found.map(b=>b.y0)),x1:Math.max(...found.map(b=>b.x1)),y1:Math.max(...found.map(b=>b.y1))}:null;
  boxes.forEach((b,i)=>{const bb=u??b;if(!bb)return;const p=doc.getPage(i),m=p.getMediaBox();
   const x=Math.max(m.x,bb.x0-pad),y=Math.max(m.y,bb.y0-pad),x2=Math.min(m.x+m.width,bb.x1+pad),y2=Math.min(m.y+m.height,bb.y1+pad);
   if(x2-x>5&&y2-y>5){p.setCropBox(x,y,x2-x,y2-y);n++;}});
  return pdfResult(await doc.save(),`Cropped ${n} page${n===1?'':'s'} to the visible content with ${num(v,'pad')} mm of space. The hidden area is only masked, not deleted.`);
 }
};

const attach:NewTool={
 id:'add-pdf-attachment',action:'Attach files',
 extra:{label:'Files to attach',accept:'*/*',multiple:true,required:true,hint:'Up to 10 files, 20 MB in total.'},
 fields:[],
 async run({bytes,extra}){
  if(extra.length>10)throw new Error('Attach at most 10 files at once.');
  if(extra.reduce((a,e)=>a+e.bytes.length,0)>20*1048576)throw new Error('The files are over 20 MB in total.');
  const doc=await openPdf(bytes);
  for(const e of extra)await doc.attach(e.bytes,e.name,{mimeType:e.type||'application/octet-stream',description:`Attached with PDF Studio`,creationDate:new Date(),modificationDate:new Date()});
  return pdfResult(await doc.save(),`Attached ${extra.length} file${extra.length===1?'':'s'}: ${extra.map(e=>e.name).join(', ')}. Open the PDF's attachments panel in a reader to see them.`);
 }
};

type PdfImg={width:number;height:number;data?:Uint8ClampedArray;bitmap?:ImageBitmap};
const images:NewTool={
 id:'extract-pdf-images',action:'Extract images',
 fields:[{key:'min',label:'Skip images smaller than (pixels wide)',type:'number',def:48,min:1,max:2000,help:'Raises or lowers the filter for icons and tiny decorations.'}],
 async run({bytes,v,progress,name}){
  const minW=num(v,'min'),pdfjs=await pdfjsLib(),OPS=pdfjs.OPS,r=await renderer(bytes),zip=new JSZip(),seen=new Set<string>();let n=0;
  const get=(store:{get:(k:string,cb?:(x:unknown)=>void)=>unknown;has:(k:string)=>boolean},key:string)=>new Promise<PdfImg|null>(res=>{try{store.get(key,res as never);}catch{res(null);}});
  try{
   for(let i=1;i<=r.numPages;i++){
    const page=await r.getPage(i),ops=await page.getOperatorList();
    for(let k=0;k<ops.fnArray.length;k++){
     const fn=ops.fnArray[k];if(fn!==OPS.paintImageXObject&&fn!==OPS.paintInlineImageXObject)continue;
     const arg=ops.argsArray[k][0];let img:PdfImg|null=null,key=`${i}`;
     if(fn===OPS.paintInlineImageXObject)img=arg as PdfImg;
     else{key=String(arg);if(seen.has(key))continue;seen.add(key);img=await get(key.startsWith('g_')?page.commonObjs as never:page.objs as never,key);}
     if(!img||!(img.width>=minW))continue;
     const c=document.createElement('canvas');c.width=img.width;c.height=img.height;const ctx=c.getContext('2d')!;
     if(img.bitmap)ctx.drawImage(img.bitmap,0,0);
     else if(img.data){
      const out=ctx.createImageData(img.width,img.height),d=img.data,o=out.data,px=img.width*img.height;
      if(d.length===px*4)o.set(d);
      else if(d.length===px*3)for(let j=0,q=0;j<px;j++){o[q++]=d[j*3];o[q++]=d[j*3+1];o[q++]=d[j*3+2];o[q++]=255;}
      else if(d.length===px)for(let j=0;j<px;j++){o[j*4]=o[j*4+1]=o[j*4+2]=d[j];o[j*4+3]=255;}
      else continue;
      ctx.putImageData(out,0,0);
     }else continue;
     const blob:Blob|null=await new Promise(res=>c.toBlob(res,'image/png'));if(!blob)continue;
     n++;zip.file(brandDownloadName(`image-${String(n).padStart(3,'0')}-page-${i}.png`),blob);
    }
    progress(Math.round(i/r.numPages*100));
   }
  }finally{await r.destroy();}
  if(!n)throw new Error('No embedded images were found. Pages that are drawn as vector graphics or text have nothing to extract.');
  return {blob:await zip.generateAsync({type:'blob'}),ext:'zip',report:`Extracted ${n} image${n===1?'':'s'} from ${name} as PNG files in one ZIP.`};
 }
};

const booklet:NewTool={
 id:'pdf-booklet',action:'Make booklet',
 fields:[
  {key:'sheet',label:'Sheet size',type:'select',def:'auto',options:[['auto','Two pages side by side (same size)'],['a4','A4 landscape'],['letter','US Letter landscape']]},
  {key:'gap',label:'Gap in the middle (mm)',type:'number',def:0,min:0,max:30},
 ],
 async run({bytes,v}){
  const src=await openPdf(bytes),n=src.getPageCount(),total=Math.ceil(n/4)*4;
  const out=await PDFDocument.create(),emb=await out.embedPdf(src,Array.from({length:n},(_,i)=>i)),gap=num(v,'gap')*72/25.4;
  const first=src.getPage(0).getSize(),sheet=String(v.sheet);
  let W=first.width*2+gap,H=first.height;
  if(sheet!=='auto'){const s=PAGE_SIZES[sheet];W=s[1];H=s[0];}
  const half=(W-gap)/2;
  const place=(p:ReturnType<typeof out.addPage>,idx:number,left:boolean)=>{
   if(idx>=n)return;const e=emb[idx],s=Math.min(half/e.width,H/e.height),w=e.width*s,h=e.height*s;
   const x0=left?0:half+gap,x=x0+(half-w)/2,y=(H-h)/2;p.drawPage(e,{x,y,width:w,height:h});
  };
  for(let s=0;s<total/4;s++){
   const f=out.addPage([W,H]);place(f,total-1-2*s,true);place(f,2*s,false);
   const b=out.addPage([W,H]);place(b,2*s+1,true);place(b,total-2-2*s,false);
  }
  return pdfResult(await out.save(),`Made a booklet of ${total/4} sheet${total===4?'':'s'} (${total/2} sides) from ${n} pages${total>n?`, padded with ${total-n} blank page${total-n===1?'':'s'}`:''}. Print double-sided, flip on the short edge, then fold the stack in half.`);
 }
};

async function matchPages(bytes:Uint8Array,term:string,exact:boolean,progress:(n:number)=>void){
 const needle=exact?term:term.toLowerCase(),r=await renderer(bytes),hit:number[]=[];
 try{for(let i=1;i<=r.numPages;i++){const t=(await (await r.getPage(i)).getTextContent()).items.map(x=>'str' in x?x.str:'').join(' ');if((exact?t:t.toLowerCase()).includes(needle))hit.push(i-1);progress(Math.round(i/r.numPages*100));}}finally{await r.destroy();}
 return hit;
}
const kwFields=[{key:'term',label:'Word or phrase',type:'text' as const,def:'',placeholder:'For example CONFIDENTIAL'},{key:'case',label:'Match upper and lower case exactly',type:'checkbox' as const,def:false}];
const keep:NewTool={
 id:'extract-pages-by-keyword',action:'Extract matching pages',fields:kwFields,
 async run({bytes,v,progress}){
  const term=String(v.term).trim();if(!term)throw new Error('Enter a word or phrase to look for.');
  const hit=await matchPages(bytes,term,!!v.case,progress);
  if(!hit.length)throw new Error('No page contains that text. If this is a scan, run Searchable PDF (OCR) first.');
  const src=await openPdf(bytes),out=await PDFDocument.create();(await out.copyPages(src,hit)).forEach(p=>out.addPage(p));
  return pdfResult(await out.save(),`Kept ${hit.length} page${hit.length===1?'':'s'} containing "${term}": ${hit.map(i=>i+1).join(', ')}.`);
 }
};
const drop:NewTool={
 id:'delete-pages-by-keyword',action:'Delete matching pages',fields:kwFields,
 async run({bytes,v,progress}){
  const term=String(v.term).trim();if(!term)throw new Error('Enter a word or phrase to look for.');
  const hit=await matchPages(bytes,term,!!v.case,progress);
  if(!hit.length)throw new Error('No page contains that text, so nothing was deleted.');
  const doc=await openPdf(bytes);if(hit.length===doc.getPageCount())throw new Error('Every page contains that text. At least one page must remain.');
  [...hit].reverse().forEach(i=>doc.removePage(i));
  return pdfResult(await doc.save(),`Deleted ${hit.length} page${hit.length===1?'':'s'} containing "${term}": ${hit.map(i=>i+1).join(', ')}. ${doc.getPageCount()} remain.`);
 }
};

const contacts:NewTool={
 id:'extract-emails-phones',action:'Extract contacts',
 fields:[
  {key:'what',label:'Find',type:'select',def:'both',options:[['both','Emails and phone numbers'],['emails','Emails only'],['phones','Phone numbers only']]},
  {key:'format',label:'Format',type:'select',def:'txt',options:[['txt','Plain list'],['csv','CSV (type, value, page)']]},
 ],
 async run({bytes,v,progress}){
  const pages=await allText(bytes,progress),rows:[string,string,number][]=[];
  pages.forEach((lines,i)=>{
   const text=lines.map(l=>l.text).join('\n');
   if(v.what!=='phones')for(const m of text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi)??[])rows.push(['email',m,i+1]);
   if(v.what!=='emails')for(const m of text.match(/(?:\+\d{1,3}[\s.-]?)?(?:\(\d{1,4}\)[\s.-]?)?\d[\d\s.-]{6,}\d/g)??[]){const d=m.replace(/\D/g,'');if(d.length>=8&&d.length<=15&&!/^(19|20)\d{2}[\s.-]\d{2}[\s.-]\d{2}$/.test(m.trim()))rows.push(['phone',m.trim(),i+1]);}
  });
  if(!rows.length)throw new Error(pages.every(p=>!p.length)?noText:'No email addresses or phone numbers were found in the selectable text.');
  const seen=new Set<string>(),uniq=rows.filter(r=>{const k=r[0]+r[1].toLowerCase();if(seen.has(k))return false;seen.add(k);return true;});
  const rep=`Found ${uniq.length} unique contact detail${uniq.length===1?'':'s'} (${rows.length} mentions).`;
  if(v.format==='csv')return textResult('type,value,page\n'+uniq.map(([t,x,p])=>`${t},"${x.replace(/"/g,'""')}",${p}`).join('\n')+'\n','csv','text/csv',rep);
  return textResult(uniq.map(([t,x,p])=>`${x}  (${t}, page ${p})`).join('\n')+'\n','txt','text/plain',rep+'\n'+uniq.slice(0,40).map(([t,x,p])=>`p${p} ${t}: ${x}`).join('\n'));
 }
};

const sizes:NewTool={
 id:'pdf-page-sizes',action:'Report page sizes',
 fields:[
  {key:'unit',label:'Unit',type:'select',def:'mm',options:[['mm','Millimetres'],['in','Inches'],['pt','Points']]},
  {key:'format',label:'Format',type:'select',def:'txt',options:[['txt','Plain report'],['csv','CSV']]},
 ],
 async run({bytes,v,progress}){
  const doc=await openPdf(bytes),n=doc.getPageCount(),k=v.unit==='in'?1/72:v.unit==='pt'?1:25.4/72,d=v.unit==='mm'?1:2;
  const names:[string,number,number][]=[['A3',841.89,1190.55],['A4',595.28,841.89],['A5',419.53,595.28],['Letter',612,792],['Legal',612,1008],['Tabloid',792,1224]];
  const rows=doc.getPages().map((p,i)=>{
   const b=p.getCropBox(),rot=((p.getRotation().angle%360)+360)%360,w=rot%180?b.height:b.width,h=rot%180?b.width:b.height;
   const hit=names.find(([,a,b2])=>(Math.abs(w-a)<3&&Math.abs(h-b2)<3)||(Math.abs(w-b2)<3&&Math.abs(h-a)<3));
   progress(Math.round((i+1)/n*100));
   return {page:i+1,w:(w*k).toFixed(d),h:(h*k).toFixed(d),name:hit?hit[0]:'Custom',orient:w>h+1?'Landscape':w<h-1?'Portrait':'Square',rot};
  });
  const groups=new Map<string,number>();rows.forEach(r=>{const key=`${r.w} x ${r.h} ${v.unit} (${r.name}, ${r.orient})`;groups.set(key,(groups.get(key)??0)+1);});
  const summary=[...groups].map(([a,c])=>`${c} page${c===1?'':'s'}: ${a}`).join('\n');
  const rep=`${n} page${n===1?'':'s'}, ${groups.size} different size${groups.size===1?'':'s'}.\n`+summary;
  if(v.format==='csv')return textResult('page,width,height,size,orientation,rotation\n'+rows.map(r=>`${r.page},${r.w},${r.h},${r.name},${r.orient},${r.rot}`).join('\n')+'\n','csv','text/csv',rep);
  return textResult(rep+'\n\n'+rows.map(r=>`Page ${r.page}: ${r.w} x ${r.h} ${v.unit} - ${r.name}, ${r.orient}${r.rot?`, rotated ${r.rot}`:''}`).join('\n')+'\n','txt','text/plain',rep);
 }
};

const textPages:NewTool={
 id:'pdf-text-by-page',action:'Export text by page',
 fields:[
  {key:'mode',label:'Output',type:'select',def:'zip',options:[['zip','One text file per page (ZIP)'],['one','One text file with page markers']]},
 ],
 async run({bytes,v,progress}){
  const pages=await allText(bytes,progress);
  if(pages.every(p=>!p.length))throw new Error(noText);
  const texts=pages.map(l=>l.map(x=>x.text).join('\n')),empty=texts.filter(t=>!t.trim()).length;
  const rep=`${pages.length} page${pages.length===1?'':'s'} exported${empty?`, ${empty} with no selectable text`:''}.`;
  if(v.mode==='one')return textResult(texts.map((t,i)=>`--- Page ${i+1} ---\n${t}\n`).join('\n'),'txt','text/plain',rep);
  const zip=new JSZip(),pad=String(pages.length).length;
  texts.forEach((t,i)=>zip.file(brandDownloadName(`page-${String(i+1).padStart(pad,'0')}.txt`),t+'\n'));
  return {blob:await zip.generateAsync({type:'blob'}),ext:'zip',report:rep};
 }
};

const openView:NewTool={
 id:'set-pdf-open-view',action:'Set how the PDF opens',
 fields:[
  {key:'page',label:'Open on page',type:'number',def:1,min:1,max:99999,step:1},
  {key:'zoom',label:'Zoom',type:'select',def:'fit',options:[['fit','Fit whole page'],['width','Fit page width'],['100','100%'],['default','Viewer default']]},
  {key:'layout',label:'Page layout',type:'select',def:'continuous',options:[['continuous','Continuous scroll'],['single','Single page'],['two','Two pages side by side'],['default','Viewer default']]},
  {key:'panel',label:'Side panel',type:'select',def:'none',options:[['none','Closed'],['bookmarks','Bookmarks'],['thumbs','Page thumbnails']]},
  {key:'title',label:'Show the document title in the window bar',type:'checkbox',def:true},
  {key:'full',label:'Open in full screen',type:'checkbox',def:false},
 ],
 async run({bytes,v}){
  const doc=await openPdf(bytes),n=doc.getPageCount(),pg=inRange(num(v,'page'),1,n,'Page'),ref=doc.getPage(pg-1).ref,ctx=doc.context,cat=doc.catalog;
  if(v.zoom!=='default')cat.set(PDFName.of('OpenAction'),ctx.obj(v.zoom==='fit'?[ref,PDFName.of('Fit')]:v.zoom==='width'?[ref,PDFName.of('FitH'),null]:[ref,PDFName.of('XYZ'),null,null,1]));
  else if(pg>1)cat.set(PDFName.of('OpenAction'),ctx.obj([ref,PDFName.of('XYZ'),null,null,null]));
  const lay={continuous:'OneColumn',single:'SinglePage',two:'TwoColumnLeft'}[String(v.layout)];
  if(lay)cat.set(PDFName.of('PageLayout'),PDFName.of(lay));else cat.delete(PDFName.of('PageLayout'));
  cat.set(PDFName.of('PageMode'),PDFName.of(v.full?'FullScreen':v.panel==='bookmarks'?'UseOutlines':v.panel==='thumbs'?'UseThumbs':'UseNone'));
  cat.set(PDFName.of('ViewerPreferences'),ctx.obj({DisplayDocTitle:!!v.title}));
  const rep=`Opens on page ${pg} of ${n}${v.zoom==='default'?'':', zoom: '+({fit:'fit page',width:'fit width','100':'100%'} as Record<string,string>)[String(v.zoom)]}${v.full?', full screen':''}.`+(v.title?'\nThe window bar shows the document title. Set one with the PDF metadata tool if it is empty.':'');
  return pdfResult(await doc.save(),rep);
 }
};

export const convertTools:NewTool[]=[contacts,sizes,textPages,openView,links,bookmarks,words,info,markdown,json,blank,crop,attach,images,booklet,keep,drop];
