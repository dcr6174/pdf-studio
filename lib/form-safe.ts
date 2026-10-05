import {PDFDocument,PDFDict,PDFName} from 'pdf-lib';
/** Flatten owned fields, then remove their actual widget references.
 * pdf-lib 1.17.1 removeField can leave deleted widget refs in page Annots. */
export function flattenFormSafely(document:PDFDocument){
 const form=document.getForm(),fields=form.getFields();
 const owned=new Set(fields.flatMap(field=>field.acroField.getWidgets().map(widget=>widget.dict)));
 const retained=document.getPages().map(page=>{const annotations=page.node.Annots();const keep=[];if(annotations)for(let i=0;i<annotations.size();i++){const ref=annotations.get(i),dict=document.context.lookup(ref);if(dict instanceof PDFDict&&dict.get(PDFName.of('Subtype'))===PDFName.of('Widget')){if(!owned.has(dict))throw new Error('An unattached form widget cannot be flattened safely. Save the PDF in its original form editor first.');}else keep.push(ref);}return keep;});
 form.flatten();
 document.getPages().forEach((page,i)=>{if(retained[i].length)page.node.set(PDFName.of('Annots'),document.context.obj(retained[i]));else page.node.delete(PDFName.of('Annots'));});
 if(form.getFields().length)throw new Error('Not all fields could be flattened.');
 document.catalog.delete(PDFName.of('AcroForm'));
}

export function hasFormWidgets(document:PDFDocument){return document.getPages().some(page=>{const annotations=page.node.Annots();if(!annotations)return false;for(let i=0;i<annotations.size();i++){const dict=document.context.lookup(annotations.get(i));if(dict instanceof PDFDict&&dict.get(PDFName.of('Subtype'))===PDFName.of('Widget'))return true;}return false;});}
