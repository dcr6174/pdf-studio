export const handwritingFonts = [
 ['caveat','Casual'],['patrickhand','Neat print'],['kalam','Soft pen'],['indieflower','Notebook'],
 ['shadowsintolight','Tall pen'],['architectsdaughter','Architect'],['handlee','Rounded'],['pangolin','Friendly'],
 ['coveredbyyourgrace','School notes'],['gloriahallelujah','Loose print'],['gochihand','Bold pen'],['petemoss','Narrow'],
 ['badscript','Everyday'],['reeniebeanie','Quick notes'],['nothingyoucoulddo','Personal'],['caveatbrush','Marker'],
 ['cedarvillecursive','Joined script'],['dancingscript','Flowing'],['allura','Elegant'],['sacramento','Light cursive'],
] as const;
export type CreativeMode='text-to-handwriting'|'pdf-to-handwriting'|'notebook-maker'|'handwriting-practice';
export const creativeTools:{slug:CreativeMode;title:string;description:string}[]=[
 {slug:'text-to-handwriting',title:'Text to handwriting',description:'Type or paste text onto a live notebook and download a handwritten-style PDF.'},
 {slug:'pdf-to-handwriting',title:'PDF to handwriting',description:'Extract selectable PDF text, review it, and reflow it into handwritten notes.'},
 {slug:'notebook-maker',title:'Notebook maker',description:'Create printable ruled, dotted, grid or plain paper.'},
 {slug:'handwriting-practice',title:'Handwriting practice',description:'Create light tracing lines with space to practise underneath.'},
];
export const labTools=creativeTools.filter(t=>t.slug!=='pdf-to-handwriting');
export type HandwritingOptions={font:string;size:number;spacing:number;margin:number;paper:'ruled'|'wide'|'double'|'grid'|'dots'|'plain';pageSize:'a4'|'letter';ink:string;cream:boolean;variation:number;seed:number;blankPages:number};
export const handwritingDefaults:HandwritingOptions={font:'caveat',size:18,spacing:1.7,margin:48,paper:'ruled',pageSize:'a4',ink:'#243c80',cream:false,variation:0,seed:1,blankPages:1};
const fontRequests=new Map<string,Promise<Uint8Array>>();
export async function handwritingFontBytes(id:string){
 if(!handwritingFonts.some(f=>f[0]===id))throw new Error('Choose a handwriting style from the list.');
 let pending=fontRequests.get(id);if(!pending){pending=fetch('/fonts/handwriting/'+id+'.ttf').then(async r=>{if(!r.ok)throw new Error('The handwriting font could not load. Reconnect and retry.');return new Uint8Array(await r.arrayBuffer());});fontRequests.set(id,pending);pending.catch(()=>fontRequests.delete(id));}return pending;
}
/** One vector PDF is used for both preview and download. No screenshot export. */
export async function createHandwritingPDF(text:string,options:HandwritingOptions,mode:CreativeMode,fontBytes:Uint8Array,signal?:AbortSignal){
 signal?.throwIfAborted();
 if(text.length>200000)throw new Error('This text is too long for the live notebook. Use fewer than 200,000 characters or split it into smaller notes.');
 if(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(text))throw new Error('Remove unsupported control characters from your text.');
 if(![options.size,options.spacing,options.margin,options.variation,options.seed,options.blankPages].every(Number.isFinite)||options.size<10||options.size>32||options.spacing<1.2||options.spacing>2.5||options.margin<24||options.margin>80||options.variation<0||options.variation>1||!Number.isInteger(options.blankPages)||options.blankPages<1||options.blankPages>100||!/^#[a-f\d]{6}$/i.test(options.ink)||!['a4','letter'].includes(options.pageSize)||!['ruled','wide','double','grid','dots','plain'].includes(options.paper))throw new Error('Some notebook settings are invalid. Restore the default settings and try again.');
 const {PDFDocument,rgb,degrees}=await import('pdf-lib');const {default:fontkit}=await import('@pdf-lib/fontkit');
 const doc=await PDFDocument.create();doc.registerFontkit(fontkit);
 // Subsetting drops outlines in some bundled fonts; embed the full font for reliable visible glyphs.
 // Disable optional ligatures: full-font ToUnicode maps their glyphs incorrectly in several styles.
 const font=await doc.embedFont(fontBytes,{subset:false,features:{liga:false,clig:false,dlig:false,calt:false}});
 const normalized=text.replace(/\r\n?/g,'\n').replace(/\t/g,'    ');
 const charset=new Set(font.getCharacterSet());const missing=[...new Set([...normalized].filter(c=>c!=='\n'&&!charset.has(c.codePointAt(0)!)))];
 if(mode!=='notebook-maker'&&missing.length)throw new Error('This style cannot write: '+missing.slice(0,12).join(' ')+'. Choose another style or import a font that supports these characters. Your text is retained.');
 const [width,height]=options.pageSize==='letter'?[612,792]:[595.28,841.89];
 const margin=options.margin;const lineHeight=options.size*options.spacing*(options.paper==='wide'?1.25:1);const top=height-margin-options.size;
 const color=rgb(parseInt(options.ink.slice(1,3),16)/255,parseInt(options.ink.slice(3,5),16)/255,parseInt(options.ink.slice(5,7),16)/255);
 const paperColor=options.cream?rgb(1,.98,.92):rgb(1,1,1);const rule=rgb(.79,.84,.89);
 const newPage=()=>{if(doc.getPageCount()>=100)throw new Error('These notes exceed 100 pages. Shorten the text or split it into smaller documents.');const page=doc.addPage([width,height]);page.drawRectangle({x:0,y:0,width,height,color:paperColor});
  if(['ruled','wide','double'].includes(options.paper))for(let y=top-3;y>=margin;y-=lineHeight){page.drawLine({start:{x:margin-14,y},end:{x:width-margin,y},thickness:.35,color:rule});if(options.paper==='double')page.drawLine({start:{x:margin-14,y:y+options.size*.55},end:{x:width-margin,y:y+options.size*.55},thickness:.25,color:rule});}
  if(options.paper==='grid'){for(let x=margin-14;x<=width-margin;x+=18)page.drawLine({start:{x,y:margin},end:{x,y:height-margin},thickness:.3,color:rule});for(let y=margin;y<=height-margin;y+=18)page.drawLine({start:{x:margin-14,y},end:{x:width-margin,y},thickness:.3,color:rule});}
  if(options.paper==='dots')for(let x=margin-14;x<=width-margin;x+=18)for(let y=margin;y<=height-margin;y+=18)page.drawCircle({x,y,size:.55,color:rule});
  if(options.paper!=='plain')page.drawLine({start:{x:margin-10,y:margin},end:{x:margin-10,y:height-margin},thickness:.5,color:rgb(.89,.64,.68)});
  return page;
 };
 if(mode==='notebook-maker'){for(let i=0;i<options.blankPages;i++){signal?.throwIfAborted();newPage();await new Promise<void>(r=>setTimeout(r,0));}return {bytes:await doc.save(),pages:doc.getPageCount()};}
 let page=newPage(),y=top,lineIndex=0,work=0;const maxWidth=width-2*margin-8;
 const draw=async(line:string)=>{signal?.throwIfAborted();if(y<margin+options.size*.4){page=newPage();y=top;}const variation=((Math.imul(lineIndex+options.seed,2654435761)>>>0)%1000/1000-.5)*options.variation;
  if(line)page.drawText(line,{x:margin+variation*2,y:y+variation,size:options.size,font,color,opacity:mode==='handwriting-practice'?.25:1,rotate:degrees(variation*.7)});
  y-=lineHeight*(mode==='handwriting-practice'?2:1);lineIndex++;if(lineIndex%32===0)await new Promise<void>(r=>setTimeout(r,0));
 };
 for(const paragraph of normalized.split('\n')){let line='';for(const token of paragraph.split(/(\s+)/)){signal?.throwIfAborted();if(++work%256===0)await new Promise<void>(r=>setTimeout(r,0));if(font.widthOfTextAtSize(line+token,options.size)<=maxWidth){line+=token;continue;}if(line){await draw(line.trimEnd());line='';}if(/^\s+$/.test(token))continue;for(const char of token){if(font.widthOfTextAtSize(line+char,options.size)>maxWidth){if(!line)throw new Error('A character is too wide for this page. Reduce the text size.');await draw(line);line='';}line+=char;}}await draw(line.trimEnd());}
 signal?.throwIfAborted();const bytes=await doc.save();signal?.throwIfAborted();return {bytes,pages:doc.getPageCount()};
}
