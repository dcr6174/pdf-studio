import {PDFDocument,PDFName,PDFRef,PDFArray,PDFField,PDFTextField,PDFCheckBox,PDFDropdown,PDFRadioGroup,PDFOptionList,StandardFonts,rgb,degrees,BlendMode,PDFPage} from 'pdf-lib';
import type {NewTool,Ctx} from './types';
import {openPdf,pdfResult,textResult,num,inRange,pageList,hexColor,MM,embedImage,pdfBytesToDoc,visualSize,boxOrigin} from './shared';
import {renderer} from '../pdf-client';

const insertPdf:NewTool={
 id:'insert-pdf-pages',action:'Insert pages',
 extra:{label:'The PDF to insert',accept:'.pdf,application/pdf',required:true},
 fields:[
  {key:'at',label:'Insert after page',type:'number',def:1,min:0,max:5000,help:'Use 0 to insert at the very start. Use the last page number to add at the end.'},
  {key:'range',label:'Pages to take from the inserted PDF',type:'text',def:'',placeholder:'All pages',help:'For example 1, 3-5.'},
 ],
 async run({bytes,extra,v}){
  const base=await openPdf(bytes),add=await pdfBytesToDoc(extra[0].bytes,'The PDF to insert'),n=base.getPageCount();
  const at=inRange(num(v,'at'),0,n,`Insert after page`),idx=pageList(String(v.range),add.getPageCount());
  if(n+idx.length>3000)throw new Error('The result would pass 3,000 pages.');
  const copied=await base.copyPages(add,idx);
  copied.forEach((p,i)=>base.insertPage(at+i,p));
  return pdfResult(await base.save(),`Inserted ${idx.length} page${idx.length===1?'':'s'} from ${extra[0].name} after page ${at}. The PDF now has ${base.getPageCount()} pages. Form fields with the same name in both files may share a value.`);
 }
};

async function overlay(ctx:Ctx,under:boolean){
 const {bytes,extra,v}=ctx,doc=await openPdf(bytes),top=await pdfBytesToDoc(extra[0].bytes,under?'The background PDF':'The overlay PDF');
 const idx=pageList(String(v.pages),doc.getPageCount()),opacity=under?1:inRange(num(v,'opacity'),5,100,'Opacity')/100,mode=String(v.use),topCount=top.getPageCount();
 const embedded=await doc.embedPdf(top,Array.from({length:topCount},(_,i)=>i));
 let k=0;
 for(const i of idx){
  const page=doc.getPage(i),vs=visualSize(page),ee=mode==='first'?embedded[0]:mode==='pair'?embedded[Math.min(k,topCount-1)]:embedded[k%topCount];k++;
  const s=Math.min(vs.w/ee.width,vs.h/ee.height),w=ee.width*s,h=ee.height*s,o=boxOrigin(page,vs.w/2,vs.h/2,w,h,0);
  if(!under)page.drawPage(ee,{x:o.x,y:o.y,width:w,height:h,rotate:degrees(o.angle),opacity});
  else{
   page.node.normalize();
   const t=o.angle*Math.PI/180,sx=w/ee.width,sy=h/ee.height,name=page.node.newXObject('PdfStudioBg',ee.ref),c=doc.context;
   const bg=c.register(c.stream(`q ${[sx*Math.cos(t),sx*Math.sin(t),-sy*Math.sin(t),sy*Math.cos(t),o.x,o.y].map(n=>n.toFixed(5)).join(' ')} cm /${name.toString().slice(1)} Do Q\n`));
   const open=c.register(c.stream('q\n')),close=c.register(c.stream('Q\n')),contents=page.node.Contents();
   if(!(contents instanceof PDFArray))throw new Error('This page has unusual content that cannot take a background.');
   contents.insert(0,bg);contents.insert(1,open);contents.push(close);
  }
 }
 return pdfResult(await doc.save(),`${under?'Placed':'Laid'} ${extra[0].name} ${under?'behind':'over'} ${idx.length} page${idx.length===1?'':'s'}, scaled to fit each page. ${under?'The original page content, links and form fields are untouched.':'The overlay is drawn on top of the page.'}`);
}
const overlayPdf:NewTool={
 id:'overlay-pdf',action:'Overlay PDF',
 extra:{label:'The PDF to lay on top',accept:'.pdf,application/pdf',required:true},
 fields:[
  {key:'use',label:'Which overlay page to use',type:'select',def:'first',options:[['first','Its first page on every page'],['pair','Page by page (1 on 1, 2 on 2...)'],['cycle','Repeat all its pages in turn']]},
  {key:'opacity',label:'Opacity (%)',type:'number',def:100,min:5,max:100},
  {key:'pages',label:'Pages',type:'text',def:'',placeholder:'All pages'},
 ],
 run:c=>overlay(c,false)
};
const letterhead:NewTool={
 id:'add-pdf-background',action:'Add background',
 extra:{label:'The background or letterhead PDF',accept:'.pdf,application/pdf',required:true},
 fields:[
  {key:'use',label:'Which background page to use',type:'select',def:'first',options:[['first','Its first page behind every page'],['pair','Page by page (1 behind 1, 2 behind 2...)'],['cycle','Repeat all its pages in turn']]},
  {key:'pages',label:'Pages',type:'text',def:'',placeholder:'All pages'},
 ],
 run:c=>overlay(c,true)
};

const STAMPS:Record<string,string>={draft:'DRAFT',approved:'APPROVED',confidential:'CONFIDENTIAL',copy:'COPY',void:'VOID',paid:'PAID',final:'FINAL',review:'FOR REVIEW'};
const stampPdf:NewTool={
 id:'stamp-pdf',action:'Add stamp',
 fields:[
  {key:'stamp',label:'Stamp',type:'select',def:'draft',options:[...Object.entries(STAMPS).map(([k,t])=>[k,t] as [string,string]),['custom','Custom text']]},
  {key:'text',label:'Custom text',type:'text',def:'',placeholder:'e.g. RECEIVED',when:v=>v.stamp==='custom'},
  {key:'date',label:'Add today\u2019s date under the stamp',type:'checkbox',def:false},
  {key:'color',label:'Colour',type:'color',def:'#d94c4c'},
  {key:'where',label:'Position',type:'select',def:'center',options:[['center','Centre, diagonal'],['top-right','Top right'],['top-left','Top left'],['bottom-right','Bottom right'],['bottom-left','Bottom left']]},
  {key:'size',label:'Size (% of page width)',type:'number',def:45,min:10,max:90},
  {key:'opacity',label:'Opacity (%)',type:'number',def:70,min:10,max:100},
  {key:'pages',label:'Pages',type:'text',def:'',placeholder:'All pages'},
 ],
 async run({bytes,v}){
  const doc=await openPdf(bytes),font=await doc.embedFont(StandardFonts.HelveticaBold),text=(v.stamp==='custom'?String(v.text).trim():STAMPS[String(v.stamp)]).toUpperCase();
  if(!text)throw new Error('Enter the custom stamp text.');
  if(/[^\u0020-\u00ff]/.test(text))throw new Error('Use letters, numbers and common punctuation (Latin characters) in the stamp.');
  const c=hexColor(String(v.color)),color=rgb(c.r,c.g,c.b),opacity=inRange(num(v,'opacity'),10,100,'Opacity')/100,pct=inRange(num(v,'size'),10,90,'Size')/100,idx=pageList(String(v.pages),doc.getPageCount());
  const date=new Date().toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'});
  for(const i of idx){
   const p=doc.getPage(i),vs=visualSize(p),size=12*(vs.w*pct)/font.widthOfTextAtSize(text,12),tw=font.widthOfTextAtSize(text,size),th=font.heightAtSize(size,{descender:false}),pad=size*0.25,bw=tw+pad*2,bh=th+pad*2;
   const right=String(v.where).endsWith('right'),top=String(v.where).startsWith('top');
   const c0=v.where==='center'?{x:vs.w/2,y:vs.h/2,ang:30}:{x:right?vs.w-24-bw/2:24+bw/2,y:top?vs.h-24-bh/2:24+bh/2,ang:0};
   const box=boxOrigin(p,c0.x,c0.y,bw,bh,c0.ang),t=box.angle*Math.PI/180;
   p.drawRectangle({x:box.x,y:box.y,width:bw,height:bh,rotate:degrees(box.angle),borderColor:color,borderWidth:Math.max(1.5,size/14),borderOpacity:opacity,opacity:0});
   const lx=pad,ly=pad+th*0.1;
   p.drawText(text,{x:box.x+lx*Math.cos(t)-ly*Math.sin(t),y:box.y+lx*Math.sin(t)+ly*Math.cos(t),size,font,color,opacity,rotate:degrees(box.angle)});
   if(v.date){const f2=Math.max(8,size/4),dw=font.widthOfTextAtSize(date,f2),dx=(bw-dw)/2,dy=-f2*1.3;p.drawText(date,{x:box.x+dx*Math.cos(t)-dy*Math.sin(t),y:box.y+dx*Math.sin(t)+dy*Math.cos(t),size:f2,font,color,opacity,rotate:degrees(box.angle)});}
  }
  return pdfResult(await doc.save(),`Stamped "${text}" on ${idx.length} page${idx.length===1?'':'s'}. The stamp is drawn on top of the page and cannot be moved afterwards, so keep your original.`);
 }
};

const addLogo:NewTool={
 id:'add-logo-to-pdf',action:'Add image to pages',
 extra:{label:'Logo or image (PNG, JPG or WebP)',accept:'image/png,image/jpeg,image/webp,.png,.jpg,.jpeg,.webp',required:true},
 fields:[
  {key:'where',label:'Position',type:'select',def:'top-right',options:[['top-left','Top left'],['top-center','Top centre'],['top-right','Top right'],['middle-left','Middle left'],['center','Centre'],['middle-right','Middle right'],['bottom-left','Bottom left'],['bottom-center','Bottom centre'],['bottom-right','Bottom right']]},
  {key:'size',label:'Width (% of page width)',type:'number',def:18,min:3,max:100},
  {key:'margin',label:'Distance from edge (mm)',type:'number',def:10,min:0,max:100},
  {key:'opacity',label:'Opacity (%)',type:'number',def:100,min:5,max:100},
  {key:'pages',label:'Pages',type:'text',def:'',placeholder:'All pages'},
 ],
 async run({bytes,extra,v}){
  const doc=await openPdf(bytes),img=await embedImage(doc,extra[0]),idx=pageList(String(v.pages),doc.getPageCount()),pct=inRange(num(v,'size'),3,100,'Width')/100,m=inRange(num(v,'margin'),0,100,'Distance')*MM,opacity=inRange(num(v,'opacity'),5,100,'Opacity')/100;
  const [vy,vx]=String(v.where)==='center'?['middle','center']:String(v.where).split('-');
  for(const i of idx){
   const p=doc.getPage(i),vs=visualSize(p),w=vs.w*pct,h=w*img.height/img.width;
   const x=vx==='left'?m:vx==='right'?vs.w-m-w:(vs.w-w)/2,y=vy==='top'?vs.h-m-h:vy==='bottom'?m:(vs.h-h)/2,o=boxOrigin(p,x+w/2,y+h/2,w,h,0);
   p.drawImage(img,{x:o.x,y:o.y,width:w,height:h,rotate:degrees(o.angle),opacity});
  }
  return pdfResult(await doc.save(),`Placed the image on ${idx.length} page${idx.length===1?'':'s'}, ${v.where}.`);
 }
};

const highlightText:NewTool={
 id:'highlight-text-in-pdf',action:'Highlight text',
 fields:[
  {key:'terms',label:'Words or phrases to highlight',type:'textarea',def:'',placeholder:'One per line',help:'Matches text you can select in the PDF. Scans need OCR first.'},
  {key:'color',label:'Highlight colour',type:'color',def:'#ffe14d'},
  {key:'case',label:'Match upper and lower case exactly',type:'checkbox',def:false},
 ],
 async run({bytes,v,progress}){
  const terms=String(v.terms).split('\n').map(s=>s.trim()).filter(Boolean);
  if(!terms.length)throw new Error('Enter at least one word or phrase.');
  if(terms.length>50)throw new Error('Use at most 50 terms.');
  const doc=await openPdf(bytes),c=hexColor(String(v.color)),color=rgb(c.r,c.g,c.b),reader=await renderer(bytes);let hits=0;const per:Record<string,number>={};
  const meas=document.createElement('canvas').getContext('2d')!;
  try{
   for(let pn=1;pn<=reader.numPages;pn++){
    const page=await reader.getPage(pn),content=await page.getTextContent(),pdfPage=doc.getPage(pn-1);
    for(const item of content.items){
     if(!('str' in item)||!item.str.trim())continue;
     const hay=v.case?item.str:item.str.toLowerCase(),style=content.styles[item.fontName];
     for(const term of terms){
      const needle=v.case?term:term.toLowerCase();let from=0,at;
      while((at=hay.indexOf(needle,from))>=0){
       from=at+needle.length;
       meas.font=`100px ${style?.fontFamily??'sans-serif'}`;
       const total=meas.measureText(item.str).width||1,x0=meas.measureText(item.str.slice(0,at)).width/total,x1=meas.measureText(item.str.slice(0,at+needle.length)).width/total;
       const tr=item.transform,fs=Math.hypot(tr[2],tr[3])||item.height,ux=Math.hypot(tr[0],tr[1])||1,dx=tr[0]/ux,dy=tr[1]/ux,w=item.width;
       const sx=tr[4]+dx*w*x0,sy=tr[5]+dy*w*x0,len=w*(x1-x0);
       pdfPage.drawRectangle({x:sx+dy*fs*0.2,y:sy-dx*fs*0.2,width:len,height:fs*1.05,color,blendMode:BlendMode.Multiply,rotate:degrees(Math.atan2(dy,dx)*180/Math.PI)});
       hits++;per[term]=(per[term]??0)+1;
      }
     }
    }
    progress(Math.round(pn/reader.numPages*100));
   }
  }finally{await reader.destroy();}
  if(!hits)throw new Error('None of those words were found in the selectable text. If this is a scan, run Searchable PDF (OCR) first.');
  return pdfResult(await doc.save(),`Highlighted ${hits} match${hits===1?'':'es'}:\n`+terms.map(t=>`- ${t}: ${per[t]??0}`).join('\n'));
 }
};

function fieldsOf(doc:PDFDocument){try{return doc.getForm().getFields();}catch{return [] as PDFField[];}}
const flattenForm:NewTool={
 id:'flatten-form-fields',action:'Flatten form fields',fields:[],
 async run({bytes}){
  const doc=await openPdf(bytes),form=doc.getForm(),n=form.getFields().length;
  if(!n)throw new Error('This PDF has no fillable form fields to flatten.');
  const font=await doc.embedFont(StandardFonts.Helvetica);
  try{form.updateFieldAppearances(font);}catch{/* keep existing appearances */}
  form.flatten();
  return pdfResult(await doc.save(),`Flattened ${n} form field${n===1?'':'s'}. Their current values are now part of the page and can no longer be edited. Text and the rest of the page stay as real, selectable content.`);
 }
};
const lockForm:NewTool={
 id:'lock-form-fields',action:'Lock form fields',fields:[],
 async run({bytes}){
  const doc=await openPdf(bytes),fields=fieldsOf(doc);
  if(!fields.length)throw new Error('This PDF has no fillable form fields to lock.');
  fields.forEach(f=>f.enableReadOnly());
  return pdfResult(await doc.save(),`Locked ${fields.length} form field${fields.length===1?'':'s'} as read-only. People can still see the values but cannot change them in a normal PDF reader. This is not password protection.`);
 }
};
const exportForm:NewTool={
 id:'export-pdf-form-data',action:'Export form data',
 fields:[{key:'format',label:'Format',type:'select',def:'json',options:[['json','JSON'],['csv','CSV']]}],
 async run({bytes,v}){
  const doc=await openPdf(bytes),fields=fieldsOf(doc);
  if(!fields.length)throw new Error('This PDF has no fillable form fields.');
  const rows=fields.map(f=>{
   let type='other',value:string|boolean|string[]='';
   if(f instanceof PDFTextField){type='text';value=f.getText()??'';}
   else if(f instanceof PDFCheckBox){type='checkbox';value=f.isChecked();}
   else if(f instanceof PDFDropdown){type='dropdown';value=f.getSelected().join('; ');}
   else if(f instanceof PDFRadioGroup){type='radio';value=f.getSelected()??'';}
   else if(f instanceof PDFOptionList){type='list';value=f.getSelected().join('; ');}
   return {name:f.getName(),type,value};
  });
  if(v.format==='csv'){
   const q=(s:unknown)=>{const t=String(s);return /[",\n]/.test(t)?'"'+t.replace(/"/g,'""')+'"':t;};
   return textResult('name,type,value\n'+rows.map(r=>[r.name,r.type,r.value].map(q).join(',')).join('\n')+'\n','csv','text/csv',`${rows.length} fields exported.`);
  }
  return textResult(JSON.stringify(Object.fromEntries(rows.map(r=>[r.name,r.value])),null,2),'json','application/json',`${rows.length} fields exported.`);
 }
};
void PDFName;void PDFRef;void (null as unknown as PDFPage);
export const editTools:NewTool[]=[insertPdf,overlayPdf,letterhead,stampPdf,addLogo,highlightText,flattenForm,lockForm,exportForm];
