import {tools} from './tools';
import type {Options} from './pdf-engine';
export function conversionNotice(id:string,o:Partial<Options>={}):string|undefined{
 if(id==='word')return o.wordMode==='appearance'?'Pages become images in Word. Their existing text is not editable.':'Word may reflow pages. Review complex tables, columns and any OCR text.';
 if(id==='docx')return 'Text-only conversion. Word images, tables and original layout are not preserved.';
 const tool=tools.find(t=>t.id===id);
 return tool?.group==='Convert'&&tool.note?tool.note:undefined;
}
export function splitOutputHint(mode:string='one'){
 return mode==='groups'?'Use semicolons between groups, such as 1-3; 4,6. Each group becomes a PDF in a ZIP.':mode==='separate'?'Choose pages, such as 1, 3-5. Each selected page becomes a PDF in a ZIP.':'Choose pages, such as 1, 3-5. All selected pages are saved together in one PDF.';
}
