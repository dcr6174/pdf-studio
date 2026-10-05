export function decodeTextFile(bytes:Uint8Array){
 let encoding='utf-8';if(bytes[0]===0xff&&bytes[1]===0xfe)encoding='utf-16le';else if(bytes[0]===0xfe&&bytes[1]===0xff)encoding='utf-16be';
 try{const text=new TextDecoder(encoding,{fatal:true}).decode(bytes);if(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(text))throw new Error('Binary content');return text;}catch{throw new Error('This text file is not supported Unicode text. Save it as UTF-8, or UTF-16 with a byte-order mark, then try again. Your current workspace is retained.');}
}
export async function textToPDF(text:string,fontBytes:Uint8Array,options:{size?:number;paper?:string;signal?:AbortSignal}={}){
 options.signal?.throwIfAborted();if(text.length>5000000)throw new Error('This text is too large for browser conversion. Use fewer than 5 million characters or split it into smaller documents.');
 if(!text.trim())throw new Error('Type some text or open a text file before creating your PDF.');
 if(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(text))throw new Error('Remove unsupported control characters from the text.');
 const size=options.size??11;if(!Number.isFinite(size)||size<6||size>36)throw new Error('Choose a font size from 6 to 36 points.');
 const {PDFDocument,rgb}=await import('pdf-lib');const {default:fontkit}=await import('@pdf-lib/fontkit');const doc=await PDFDocument.create();doc.registerFontkit(fontkit);const font=await doc.embedFont(fontBytes,{subset:true}),characters=new Set(font.getCharacterSet());
 const missing=[...new Set([...text].filter(c=>!['\n','\r','\t'].includes(c)&&!characters.has(c.codePointAt(0)!)))];if(missing.length)throw new Error('The document font does not support these characters: '+missing.slice(0,20).join(' ')+'. Use supported text; automatic font fallback is not available.');
 const [width,height]=options.paper==='letter'?[612,792]:[595.28,841.89],margin=50,lineHeight=size*1.4,maxWidth=width-2*margin;let page=doc.addPage([width,height]),y=height-margin-size;
 const draw=(line:string)=>{if(y<margin){if(doc.getPageCount()>=400)throw new Error('This text produces more than 400 pages. Shorten it or split it into smaller documents.');page=doc.addPage([width,height]);y=height-margin-size;}if(line)page.drawText(line,{x:margin,y,size,font,color:rgb(.12,.12,.16)});y-=lineHeight;};
 let paragraphs=0;for(const paragraph of text.replace(/\r\n?/g,'\n').replace(/\t/g,'    ').split('\n')){options.signal?.throwIfAborted();if(++paragraphs%32===0)await new Promise<void>(resolve=>setTimeout(resolve,0));let line='';for(const token of paragraph.split(/(\s+)/)){if(font.widthOfTextAtSize(line+token,size)<=maxWidth){line+=token;continue;}if(line){draw(line.trimEnd());line='';}if(/^\s+$/.test(token))continue;for(const char of token){if(font.widthOfTextAtSize(line+char,size)>maxWidth){draw(line);line='';}line+=char;}}draw(line.trimEnd());}
 return doc.save();
}
