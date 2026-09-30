import { PDFDocument, PDFName, PDFDict, PDFArray, PDFRawStream, PDFString, PDFHexString, decodePDFRawStream, StandardFonts } from 'pdf-lib';
type Token={start:number;end:number;raw:string;text?:string};
function tokens(s:string):Token[]{
 const out:Token[]=[];let i=0;
 while(i<s.length){if(/\s/.test(s[i])){i++;continue;}if(s[i]==='%'){while(i<s.length&&!/[\r\n]/.test(s[i]))i++;continue;}const start=i;
 if(s[i]==='('){let depth=1;i++;while(i<s.length&&depth){if(s[i]==='\\'){i+=2;continue;}if(s[i]==='(')depth++;if(s[i]===')')depth--;i++;}if(depth)throw Error('Malformed PDF text string.');const raw=s.slice(start,i);out.push({start,end:i,raw,text:/[\\()]/.test(raw.slice(1,-1))?undefined:raw.slice(1,-1)});continue;}
 if(s[i]==='<'&&s[i+1]!=='<'){i++;while(i<s.length&&s[i]!=='>')i++;if(i===s.length)throw Error('Malformed PDF hex string.');i++;const raw=s.slice(start,i);out.push({start,end:i,raw,text:PDFHexString.of(raw.slice(1,-1).replace(/\s/g,'')).decodeText()});continue;}
 if('[]<>'.includes(s[i])){i++;out.push({start,end:i,raw:s.slice(start,i)});continue;}
 if(s[i]==='/'){i++;while(i<s.length&&!/[\s()[\]<>/%]/.test(s[i]))i++;}else{while(i<s.length&&!/[\s()[\]<>/%]/.test(s[i]))i++;if(i===start)i++;}
 const raw=s.slice(start,i);if(raw==='BI')throw Error('Inline-image streams are not supported by existing-text replacement.');out.push({start,end:i,raw});
 }return out;
}
/** Changes text-show operands, never hides content with an overlay. Conservative subset only. */
export async function replaceExistingText(doc:PDFDocument,find:string,replacement:string){
 if(!find||!replacement||!/^\x20*[\x20-\x7e]+$/.test(find)||!/[\x20-\x7e]/.test(replacement)||/[^\x20-\x7e]/.test(replacement))throw Error('Enter nonempty printable English text. Unicode and scanned text are not supported.');
 let count=0;const changes:{arr:PDFArray;index:number;source:string}[]=[];
 for(const page of doc.getPages()){
 const fonts=page.node.Resources()?.lookup(PDFName.of('Font'),PDFDict);const contents=page.node.Contents();if(!contents)continue;
 const arr=contents instanceof PDFArray?contents:doc.context.obj([contents]);
 for(let n=0;n<arr.size();n++){const stream=arr.lookup(n);if(!(stream instanceof PDFRawStream))throw Error('Unsupported content stream.');const s=Array.from(decodePDFRawStream(stream).decode(),b=>String.fromCharCode(b)).join('');const ts=tokens(s);let font='';const stack:string[]=[];const edits:{start:number;end:number;value:string}[]=[];
 for(let j=0;j<ts.length;j++){const t=ts[j];if(t.raw==='q')stack.push(font);if(t.raw==='Q')font=stack.pop()??'';if(t.raw==='Tf')font=ts[j-2]?.raw.slice(1)??'';
 if(t.raw!=='Tj')continue;const text=ts[j-1];if(text?.text===undefined||!text.text.includes(find))continue;
 const fd=fonts?.lookup(PDFName.of(font),PDFDict);const base=fd?.lookup(PDFName.of('BaseFont'));const encoding=fd?.lookup(PDFName.of('Encoding'));const name=base instanceof PDFName?base.decodeText():'';
 if(!fd||fd.lookup(PDFName.of('Subtype'))?.toString()!=='/Type1'||!Object.values(StandardFonts).includes(name as StandardFonts)||['Symbol','ZapfDingbats'].includes(name)||(encoding&&encoding.toString()!=='/WinAnsiEncoding')||fd.has(PDFName.of('ToUnicode')))throw Error('This match uses an embedded, custom or unsupported font. Original text was not changed.');
 if(/[^\x20-\x7e]/.test(text.text))throw Error('Non-ASCII text operands are not supported.');
 const changed=text.text.split(find).join(replacement);const f=await doc.embedFont(name as StandardFonts);if(f.widthOfTextAtSize(changed,1)>f.widthOfTextAtSize(text.text,1)+.001)throw Error('Replacement is wider than the original text. Use shorter text; this tool does not reflow paragraphs.');
 count+=text.text.split(find).length-1;edits.push({start:text.start,end:text.end,value:PDFString.of(changed).toString()});
 }let source=s;for(const e of edits.reverse())source=source.slice(0,e.start)+e.value+source.slice(e.end);if(edits.length)changes.push({arr,index:n,source});
 }page.node.set(PDFName.of('Contents'),arr);
 }
 if(!count)throw Error('No supported match found. Text split across operators, scanned pages and embedded fonts are not supported.');
 for(const c of changes)c.arr.set(c.index,doc.context.register(doc.context.flateStream(Uint8Array.from(c.source,x=>x.charCodeAt(0)))));
 return count;
}
