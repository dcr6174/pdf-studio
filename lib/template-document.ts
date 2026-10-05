export type TemplateField={id:string;text:string;x:number;y:number;width:number;height:number;size:number;page:number};
export function validateTemplate(fields:TemplateField[]){
 if(!fields.length)throw new Error('Add a text field to your template.');
 if(fields.length>100)throw new Error('This template supports up to 100 fields. Remove extra fields and retry.');
 for(const f of fields){if(!Number.isInteger(f.page)||f.page<1||f.page>20||![f.x,f.y,f.width,f.height,f.size].every(Number.isFinite)||f.x<0||f.y<0||f.width<=0||f.height<=0||f.size<6||f.size>72||f.x+f.width>595.28||f.y+f.height>841.89)throw new Error('A field falls outside its A4 page or has invalid dimensions. Check its position, size and page number.');if(typeof f.text!=='string'||/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(f.text))throw new Error('Remove unsupported control characters from template text.');}
}
export async function createTemplatePDF(fields:TemplateField[],fontBytes:Uint8Array){
 validateTemplate(fields);const {PDFDocument,rgb}=await import('pdf-lib');const document=await PDFDocument.create();const {default:fontkit}=await import('@pdf-lib/fontkit');document.registerFontkit(fontkit);const font=await document.embedFont(fontBytes,{subset:true}),charset=new Set(font.getCharacterSet());
 const count=Math.max(...fields.map(f=>f.page));for(let i=0;i<count;i++)document.addPage([595.28,841.89]);
 for(const f of fields){const missing=[...new Set([...f.text].filter(c=>c!=='\n'&&c!=='\r'&&c!=='\t'&&!charset.has(c.codePointAt(0)!)))];if(missing.length)throw new Error('The template font does not contain these characters: '+missing.join(' ')+'. Choose supported text; automatic font fallback is not available.');
 const lines:string[]=[];for(const paragraph of f.text.replace(/\t/g,'    ').split(/\r?\n/)){let line='';for(const char of paragraph){const next=line+char;if(font.widthOfTextAtSize(next,f.size)>f.width){if(!line)throw new Error('A field is too narrow for its text. Increase its width.');lines.push(line);line=char;}else line=next;}lines.push(line);}
 const lineHeight=f.size*1.3;if(lines.length*lineHeight>f.height)throw new Error('Text overflows a template field. Increase its height, reduce the font size or shorten its text.');
 const page=document.getPage(f.page-1);lines.forEach((line,i)=>page.drawText(line,{x:f.x,y:841.89-f.y-f.size-i*lineHeight,size:f.size,font,color:rgb(.12,.12,.18)}));
 }
 return document.save();
}
