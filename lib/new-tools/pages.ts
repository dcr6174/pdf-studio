import {PDFDocument,PDFName,PDFArray,PDFDict,PDFRef,PDFRawStream,PDFString,PDFHexString,decodePDFRawStream,rgb,degrees} from 'pdf-lib';
import JSZip from 'jszip';
import type {NewTool} from './types';
import {openPdf,pdfResult,num,inRange,pageList,hexColor,stem,MM,PAGE_SIZES} from './shared';

const addBlankPages:NewTool={
 id:'add-blank-pages',action:'Add blank pages',
 fields:[
  {key:'where',label:'Where to add them',type:'select',def:'end',options:[['end','At the end'],['start','At the start'],['after','After chosen pages'],['every','After every N pages']]},
  {key:'pages',label:'After which pages',type:'text',def:'',placeholder:'1, 4-6',help:'Page numbers in the original PDF.',when:v=>v.where==='after'},
  {key:'every',label:'N (pages between blanks)',type:'number',def:2,min:1,max:100,when:v=>v.where==='every'},
  {key:'count',label:'Blank pages per spot',type:'number',def:1,min:1,max:20},
  {key:'size',label:'Blank page size',type:'select',def:'match',options:[['match','Same as neighbouring page'],['a4','A4'],['letter','US Letter']]},
 ],
 async run({bytes,v}){
  const doc=await openPdf(bytes),n=doc.getPageCount(),count=inRange(num(v,'count'),1,20,'Blank pages per spot');
  let spots:number[]=[];// insert before this original index (n = end)
  if(v.where==='end')spots=[n];else if(v.where==='start')spots=[0];
  else if(v.where==='after'){const list=pageList(String(v.pages),n);if(!String(v.pages).trim())throw new Error('Enter the page numbers to add blanks after.');spots=list.map(i=>i+1);}
  else{const e=inRange(num(v,'every'),1,100,'N');for(let i=e;i<=n;i+=e)spots.push(i);if(!spots.length)throw new Error(`The PDF has only ${n} pages, so no blank page fits after every ${e}.`);}
  const total=n+spots.length*count;if(total>5000)throw new Error('The result would pass 5,000 pages. Add fewer blank pages.');
  const dims=doc.getPages().map(p=>{const b=p.getCropBox();return [b.width,b.height] as [number,number];});
  for(const at of [...spots].sort((a,b)=>b-a)){
   for(let c=0;c<count;c++){
    const size=v.size==='match'?dims[Math.min(Math.max(at-1,0),n-1)]:PAGE_SIZES[String(v.size)];
    doc.insertPage(at,size);
   }
  }
  return pdfResult(await doc.save(),`Added ${spots.length*count} blank page${spots.length*count===1?'':'s'}. The PDF now has ${doc.getPageCount()} pages.`);
 }
};

const splitEveryN:NewTool={
 id:'split-by-page-count',action:'Split into files',
 fields:[
  {key:'mode',label:'Split by',type:'select',def:'size',options:[['size','Pages per file'],['parts','Number of equal files']]},
  {key:'n',label:'Value',type:'number',def:5,min:1,max:500,help:'Pages in each file, or how many files to make.'},
 ],
 async run({bytes,v,name,progress}){
  const src=await openPdf(bytes),total=src.getPageCount(),n=inRange(num(v,'n'),1,500,'Value');
  const per=v.mode==='parts'?Math.ceil(total/Math.min(n,total)):n;
  if(per>=total)throw new Error(`The PDF has ${total} pages, so this setting makes just one file. Choose a smaller value.`);
  const zip=new JSZip(),files=Math.ceil(total/per),pad=String(files).length;
  for(let f=0;f<files;f++){
   const start=f*per,end=Math.min(total,start+per),part=await PDFDocument.create();
   (await part.copyPages(src,Array.from({length:end-start},(_,i)=>start+i))).forEach(p=>part.addPage(p));
   zip.file(`${stem(name)}-part-${String(f+1).padStart(pad,'0')}-pages-${start+1}-${end}.pdf`,await part.save());
   progress(Math.round((f+1)/files*100));
  }
  return {blob:await zip.generateAsync({type:'blob'}),ext:'zip',report:`Made ${files} PDF files of up to ${per} pages each from ${total} pages, packed in one ZIP.`};
 }
};

const oddEven:NewTool={
 id:'odd-even-pages',action:'Extract pages',
 fields:[
  {key:'which',label:'Pages to keep',type:'select',def:'odd',options:[['odd','Odd pages (1, 3, 5...)'],['even','Even pages (2, 4, 6...)'],['both','Both, as two separate PDFs']]},
  {key:'reverse',label:'Reverse the order of the extracted pages',type:'checkbox',def:false,help:'Handy when you feed paper back into a printer by hand for double-sided printing.'},
 ],
 async run({bytes,v,name}){
  const src=await openPdf(bytes),total=src.getPageCount();
  if(total<2)throw new Error('This PDF has only one page, so there is nothing to separate.');
  const build=async(parity:0|1)=>{
   let idx=Array.from({length:total},(_,i)=>i).filter(i=>i%2===parity);
   if(v.reverse)idx=idx.reverse();
   const out=await PDFDocument.create();(await out.copyPages(src,idx)).forEach(p=>out.addPage(p));
   return {bytes:await out.save(),count:idx.length};
  };
  if(v.which==='both'){
   const o=await build(0),e=await build(1),zip=new JSZip();
   zip.file(`${stem(name)}-odd-pages.pdf`,o.bytes);zip.file(`${stem(name)}-even-pages.pdf`,e.bytes);
   return {blob:await zip.generateAsync({type:'blob'}),ext:'zip',report:`Odd pages: ${o.count}. Even pages: ${e.count}. Both PDFs are in the ZIP.`};
  }
  const r=await build(v.which==='odd'?0:1);
  return pdfResult(r.bytes,`Kept ${r.count} ${v.which} pages out of ${total}${v.reverse?', in reverse order':''}.`);
 }
};

const pageBorder:NewTool={
 id:'add-page-border',action:'Add border',
 fields:[
  {key:'pages',label:'Pages',type:'text',def:'',placeholder:'All pages',help:'Leave empty for every page, or enter 1, 3-5.'},
  {key:'color',label:'Border colour',type:'color',def:'#191927'},
  {key:'width',label:'Line width (pt)',type:'number',def:1.5,min:0.25,max:20,step:0.25},
  {key:'inset',label:'Distance from page edge (mm)',type:'number',def:8,min:0,max:60,step:0.5},
  {key:'style',label:'Line style',type:'select',def:'solid',options:[['solid','Solid'],['dashed','Dashed'],['double','Double']]},
  {key:'round',label:'Rounded corners',type:'checkbox',def:false},
 ],
 async run({bytes,v}){
  const doc=await openPdf(bytes),idx=pageList(String(v.pages),doc.getPageCount()),w=inRange(num(v,'width'),0.25,20,'Line width'),inset=inRange(num(v,'inset'),0,60,'Distance')*MM,c=hexColor(String(v.color)),color=rgb(c.r,c.g,c.b);
  for(const i of idx){
   const page=doc.getPage(i),b=page.getCropBox(),draw=(gap:number,lw:number)=>{
    const x=b.x+gap,y=b.y+gap,width=b.width-gap*2,height=b.height-gap*2;
    if(width<=lw*2||height<=lw*2)throw new Error('The border does not fit. Reduce the distance from the edge.');
    if(v.round){
     const r=Math.min(24,width/4,height/4);
     page.drawSvgPath(`M ${r} 0 L ${width-r} 0 Q ${width} 0 ${width} ${r} L ${width} ${height-r} Q ${width} ${height} ${width-r} ${height} L ${r} ${height} Q 0 ${height} 0 ${height-r} L 0 ${r} Q 0 0 ${r} 0 Z`,{x,y:y+height,borderColor:color,borderWidth:lw,borderDashArray:v.style==='dashed'?[lw*4,lw*3]:undefined});
    }else page.drawRectangle({x,y,width,height,borderColor:color,borderWidth:lw,borderDashArray:v.style==='dashed'?[lw*4,lw*3]:undefined});
   };
   draw(inset,w);if(v.style==='double')draw(inset+w*3+2,Math.max(0.5,w/2));
  }
  return pdfResult(await doc.save(),`Added a ${v.style} border to ${idx.length} page${idx.length===1?'':'s'}. Existing text, links and form fields are untouched.`);
 }
};

/** Visual margins -> the page's unrotated sides. */
function sideMap(m:{t:number;r:number;b:number;l:number},rot:number){return rot===0?{l:m.l,b:m.b,r:m.r,t:m.t}:rot===90?{l:m.t,t:m.r,r:m.b,b:m.l}:rot===180?{l:m.r,t:m.b,r:m.l,b:m.t}:{l:m.b,t:m.l,r:m.t,b:m.r};}
const addMargins:NewTool={
 id:'add-pdf-margins',action:'Add margins',
 fields:[
  {key:'mode',label:'How to add space',type:'select',def:'grow',options:[['grow','Make each page bigger (content stays the same size)'],['fit','Keep the page size (shrink the content)']]},
  {key:'top',label:'Top (mm)',type:'number',def:20,min:0,max:200,step:1},
  {key:'right',label:'Right (mm)',type:'number',def:20,min:0,max:200,step:1},
  {key:'bottom',label:'Bottom (mm)',type:'number',def:20,min:0,max:200,step:1},
  {key:'left',label:'Left (mm)',type:'number',def:20,min:0,max:200,step:1},
  {key:'pages',label:'Pages',type:'text',def:'',placeholder:'All pages'},
 ],
 async run({bytes,v}){
  const doc=await openPdf(bytes),idx=pageList(String(v.pages),doc.getPageCount()),m={t:inRange(num(v,'top'),0,200,'Top')*MM,r:inRange(num(v,'right'),0,200,'Right')*MM,b:inRange(num(v,'bottom'),0,200,'Bottom')*MM,l:inRange(num(v,'left'),0,200,'Left')*MM};
  if(!m.t&&!m.r&&!m.b&&!m.l)throw new Error('Enter a margin above 0 on at least one side.');
  if(v.mode==='grow'){
   for(const i of idx){
    const page=doc.getPage(i),b=page.getCropBox(),rot=((page.getRotation().angle%360)+360)%360;
    const u=sideMap(m,rot);
    const x=b.x-u.l,y=b.y-u.b,w=b.width+u.l+u.r,h=b.height+u.t+u.b;
    page.setMediaBox(x,y,w,h);page.setCropBox(x,y,w,h);page.setBleedBox(x,y,w,h);page.setTrimBox(x,y,w,h);page.setArtBox(x,y,w,h);
   }
   return pdfResult(await doc.save(),`Added margins to ${idx.length} page${idx.length===1?'':'s'}. Pages are now larger; text, links and form fields are unchanged.`);
  }
  const out=await PDFDocument.create(),chosen=new Set(idx);
  for(let i=0;i<doc.getPageCount();i++){
   if(!chosen.has(i)){out.addPage((await out.copyPages(doc,[i]))[0]);continue;}
   const src=doc.getPage(i),b=src.getCropBox(),rot=((src.getRotation().angle%360)+360)%360;
   const u=sideMap(m,rot),aw=b.width-u.l-u.r,ah=b.height-u.t-u.b;
   if(aw<=20||ah<=20)throw new Error('The margins leave no room for the content. Use smaller margins.');
   const k=Math.min(aw/b.width,ah/b.height),embedded=await out.embedPage(src,{left:b.x,bottom:b.y,right:b.x+b.width,top:b.y+b.height}),page=out.addPage([b.width,b.height]);
   const dw=b.width*k,dh=b.height*k;
   page.drawPage(embedded,{x:u.l+(aw-dw)/2,y:u.b+(ah-dh)/2,width:dw,height:dh});
   if(rot)page.setRotation(degrees(rot));
  }
  return pdfResult(await out.save(),`Shrank the content of ${idx.length} page${idx.length===1?'':'s'} to fit inside the margins. Page size is unchanged. Links and form fields on those pages are not carried over.`);
 }
};

function safeName(name:string,used:Set<string>){
 const base=name.replace(/[\\/:*?"<>|\u0000-\u001f]/g,'_').trim()||'attachment';let n=base,i=1;
 while(used.has(n)){const dot=base.lastIndexOf('.');n=dot>0?`${base.slice(0,dot)} (${++i})${base.slice(dot)}`:`${base} (${++i})`;}
 used.add(n);return n;
}
const textOf=(o:unknown)=>o instanceof PDFString||o instanceof PDFHexString?o.decodeText():'';
const extractAttachments:NewTool={
 id:'extract-pdf-attachments',action:'Extract attachments',fields:[],
 async run({bytes,progress}){
  const doc=await openPdf(bytes),found:{name:string;data:Uint8Array}[]=[],seen=new Set<PDFRef>(),used=new Set<string>();
  const take=(specRef:unknown)=>{
   const spec=specRef instanceof PDFRef?doc.context.lookup(specRef):specRef;if(!(spec instanceof PDFDict))return;
   const ef=spec.lookupMaybe(PDFName.of('EF'),PDFDict);if(!ef)return;
   const ref=ef.get(PDFName.of('UF'))??ef.get(PDFName.of('F'));if(!(ref instanceof PDFRef)||seen.has(ref))return;
   const stream=doc.context.lookup(ref);if(!(stream instanceof PDFRawStream))return;seen.add(ref);
   const name=textOf(spec.get(PDFName.of('UF')))||textOf(spec.get(PDFName.of('F')))||`attachment-${found.length+1}`;
   found.push({name:safeName(name,used),data:decodePDFRawStream(stream).decode()});
  };
  const walk=(node:PDFDict,depth=0)=>{
   if(depth>12)return;const names=node.lookupMaybe(PDFName.of('Names'),PDFArray);
   if(names)for(let i=1;i<names.size();i+=2)take(names.get(i));
   const kids=node.lookupMaybe(PDFName.of('Kids'),PDFArray);
   if(kids)for(let i=0;i<kids.size();i++){const k=kids.lookup(i);if(k instanceof PDFDict)walk(k,depth+1);}
  };
  const tree=doc.catalog.lookupMaybe(PDFName.of('Names'),PDFDict)?.lookupMaybe(PDFName.of('EmbeddedFiles'),PDFDict);
  if(tree)walk(tree);
  doc.getPages().forEach((page,pi)=>{
   const annots=page.node.lookupMaybe(PDFName.of('Annots'),PDFArray);if(!annots)return;
   for(let i=0;i<annots.size();i++){const a=annots.lookup(i);if(a instanceof PDFDict&&a.get(PDFName.of('Subtype'))?.toString()==='/FileAttachment')take(a.get(PDFName.of('FS')));}
   progress(Math.round((pi+1)/doc.getPageCount()*100));
  });
  if(!found.length)throw new Error('No embedded files were found in this PDF. Attachments are files stored inside the PDF, shown in a reader\u2019s attachment panel.');
  const zip=new JSZip();found.forEach(f=>zip.file(f.name,f.data));
  return {blob:await zip.generateAsync({type:'blob'}),ext:'zip',report:`Extracted ${found.length} file${found.length===1?'':'s'}:\n`+found.map(f=>`- ${f.name} (${(f.data.length/1024).toFixed(1)} KB)`).join('\n')};
 }
};
export const pageTools:NewTool[]=[addBlankPages,splitEveryN,oddEven,pageBorder,addMargins,extractAttachments];
