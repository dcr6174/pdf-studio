import {exportFilename} from '@/lib/export-filename';
import {lineSegments,type ShapePoint} from './shape-geometry';
import {formattedNumber,labelText} from './task-labels';
import {workflowOperations,workflowStepIssue} from './workflow-recipes';
import {ocrWorkerOptions} from './ocr-worker-options';
import {taskInputIssue} from './task-readiness';
import {readFormFields,applyFormValues,flattenVisibleForm,type FormValue} from './pdf-forms';
import {markRotation} from './mark-rotation';
import {workflowSettings,type WorkflowStepSettings} from './workflow-recipes';
import {resizeSheet,resizePlacement,splitGroups} from './page-layout';
import {pixelsHaveInk,rejectBlankOutput} from './output-integrity';
import {textToPDF} from './text-document';
import {flattenFormSafely,hasFormWidgets,hasOverlappingWidgets} from './form-safe';
import {optimizeJPEGImages} from './optimize-jpeg';
import {decodePhoto,normalizeCameraFile} from './mobile-image';
import {addBookmarks,cleanupPDF,removeAnnotations,halvePages,createForm} from './extra-pdf';
import {replaceExistingText} from './native-text';
import { PDFDocument, StandardFonts, rgb, degrees, pushGraphicsState, popGraphicsState, concatTransformationMatrix, PDFName, PDFString, PDFArray, PDFDict } from 'pdf-lib';
import JSZip from 'jszip';
import {sensitiveTextCandidates} from './sensitive-text';
import {pageGeometry,displayPoint,safeLink} from './page-geometry';
export type Loaded = {
    id: string;
    name: string;
    bytes: Uint8Array;
    size: number;
    pages: number;
    doc?: PDFDocument;
    image?: string;
    readerOnly?:boolean;
};
export type PageItem = {
    id: string;
    fileId: string;
    index: number;
    rotation: number;
};
export type Mark = {
    id: string;
    pageId: string;
    signatureGroup?:string;
    signingField?:'signature'|'initials'|'name'|'date'|'text'|'stamp';
    lineStart?:ShapePoint;
    lineEnd?:ShapePoint;
    kind: 'text' | 'image' | 'highlight' | 'redact' | 'rectangle' | 'ellipse' | 'link' | 'line' | 'arrow' | 'whiteout';
    x: number;
    y: number;
    w: number;
    h: number;
    text?: string;
    url?: string;
    image?: string;
    readerOnly?:boolean;
    strokeWidth?:number;
    sketch?:{points:ShapePoint[];width:number;height:number};
    color: string;
    fontSize: number;
    opacity?:number;
    watermark?:boolean;
    angle?:number;
    underline?: boolean;
    strike?:boolean;
    fontFamily?: 'noto'|'helvetica'|'times'|'courier';
    bold?:boolean;
    italic?:boolean;
    align?:'left'|'center'|'right';
};
export type Options = {
    splitOutput?:string;
    resizeSize?:string;
    resizeOrientation?:string;
    resizeWidth?:string;
    resizeHeight?:string;
    resizeMode?:string;
    resizeRange?:string;
    findText?: string;
    replaceText?: string;
    range: string;
    text: string;
    title: string;
    author: string;
    subject: string;
    password: string;
    quality: string;
    compressTarget?:string;
    compressJPEG?:number;
    compressMaxDimension?:number;
    angle: string;
    margin: string;
    start: string;
    columns: string;
    fields: Record<string, FormValue>;
    textFontSize?:string;
    textPageSize?:string;
    recipe?:string;
    workflowSteps?:string[];
    workflowDisabled?:number[];
    workflowSettings?:WorkflowStepSettings[];
    templateFields?:import('./template-document').TemplateField[];
    ocrLanguage?:string;
    ocrRange?:string;
    ocrSkipText?:boolean;
    ocrPreprocess?:string;
    flattenForm?:boolean;
    flattenMode?:'forms'|'image';
    footer?:string;
    keywords?:string;creator?:string;producer?:string;passwordConfirm?:string;
    numberPosition?:string;numberFormat?:string;labelFontSize?:string;labelMargin?:string;batesDigits?:string;batesSuffix?:string;
    headerCenter?:string;headerRight?:string;footerCenter?:string;footerRight?:string;
    cropTop?:string;cropBottom?:string;cropLeft?:string;cropRight?:string;flipAxis?:string;
    blankAt?:string;imagePaper?:string;imageMargin?:string;imageOrientation?:string;
};
export type Output = {
    blob: Blob;
    name: string;
    report?: string;
    inputSize?: number;
    blankCandidates?:number[];
    warnings?:string[];
    target?:{requestedKB:number;met:boolean};
    ocrReview?:import('./ocr-review').OCRReviewPage[];
};
let pdfjsPromise: Promise<typeof import('pdfjs-dist')> | undefined;
export async function pdfjs() { if (!pdfjsPromise)
    pdfjsPromise = import('pdfjs-dist').then(m => { m.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'; return m; }); return pdfjsPromise; }
export async function renderer(bytes: Uint8Array, password?: string) { const task=(await pdfjs()).getDocument({ data: bytes.slice(), password, cMapUrl: '/cmaps/', cMapPacked: true, standardFontDataUrl: '/standard_fonts/', isEvalSupported: false });try{return await task.promise;}catch(e){try{await task.destroy();}catch{}throw e;} }
async function renderPage(bytes: Uint8Array, index: number, scale = 1, password?: string, rotation=0, signal?:AbortSignal, shared?:Awaited<ReturnType<typeof renderer>>) { signal?.throwIfAborted(); const d = shared??await renderer(bytes, password); try {
    const p = await d.getPage(index + 1);
    const v = p.getViewport({ scale, rotation:(p.rotate+rotation)%360 });
    if (v.width * v.height > 22000000)
        throw new Error('This page is too large to render. Choose a lower resolution.');
    const c = document.createElement('canvas');
    c.width = Math.ceil(v.width);
    c.height = Math.ceil(v.height);
    const task=p.render({canvasContext:c.getContext('2d')!,viewport:v});
    const cancel=()=>task.cancel();signal?.addEventListener('abort',cancel,{once:true});
    try{await task.promise;signal?.throwIfAborted();}finally{signal?.removeEventListener('abort',cancel);}
    return c;
}
finally {
    if(!shared)await d.destroy();
} }
let activeRenders = 0;
const renderQueue: (() => void)[] = [];
export async function render(bytes: Uint8Array, index: number, scale = 1, password?: string, rotation=0, signal?:AbortSignal) { if (activeRenders >= 2)
    await new Promise<void>(resolve => renderQueue.push(resolve)); activeRenders++; try {
    return await renderPage(bytes, index, scale, password,rotation,signal);
}
finally {
    activeRenders--;
    renderQueue.shift()?.();
} }
export async function textPages(bytes: Uint8Array, password?: string) { const d = await renderer(bytes, password); try {
    const result: string[] = [];
    for (let i = 1; i <= d.numPages; i++) {
        const c = await (await d.getPage(i)).getTextContent();
        let line = '';
        let lastY: number | undefined;
        for (const item of c.items) {
            if (!('str' in item))
                continue;
            const y = item.transform[5];
            if (lastY !== undefined && Math.abs(y - lastY) > 3)
                line += '\n';
            line += item.str + (item.hasEOL ? '\n' : ' ');
            lastY = y;
        }
        result.push(line.trim());
    }
    return result;
}
finally {
    await d.destroy();
} }
export async function loadFile(file: File,allowEncryptedReader=false): Promise<Loaded> { file=normalizeCameraFile(file); const bytes = new Uint8Array(await file.arrayBuffer()); const base = { id: crypto.randomUUID(), name: file.name, bytes, size: file.size, pages: 0 }; if (/\.pdf$/i.test(file.name)) {
    if(!new TextDecoder().decode(bytes.slice(0,1024)).includes('%PDF-'))throw new Error('This file is not a PDF. Choose a valid PDF document.');
    let doc:PDFDocument;try{doc=await PDFDocument.load(bytes,{updateMetadata:false});}catch(e){if(String(e).toLowerCase().includes('encrypt')&&allowEncryptedReader)return {...base,readerOnly:true};if(String(e).toLowerCase().includes('encrypt'))throw new Error('This PDF is password protected. Use Remove password with a password you know, then continue editing.');throw new Error('This PDF could not be read. It may be damaged. Try a readable copy or another PDF reader.');}
    if(!doc.getPageCount())throw new Error('This PDF has no readable pages. Choose another PDF.');
    return { ...base, doc, pages: doc.getPageCount() };
} if (/\.(png|jpe?g|webp)$/i.test(file.name)) {
    // PNG dimensions can be checked before decoding; all formats are checked before canvas allocation.
    const maxPixels=22000000;
    if(bytes.length>=24&&bytes[0]===137&&bytes[1]===80&&bytes[2]===78&&bytes[3]===71){
        const dimensions=new DataView(bytes.buffer,bytes.byteOffset+16,8);
        if(dimensions.getUint32(0)*dimensions.getUint32(4)>maxPixels)throw new Error('Choose an image below 22 megapixels. Resize it before opening.');
    }
    const b = await decodePhoto(file);
    let c:HTMLCanvasElement|undefined;
    try{
        if(b.width*b.height>maxPixels)throw new Error('Choose an image below 22 megapixels. Resize it before opening.');
        c = document.createElement('canvas');
        c.width = b.width;c.height = b.height;
        const context=c.getContext('2d');if(!context)throw new Error('Your browser could not prepare this photo. Try a smaller JPG or PNG.');context.drawImage(b.source, 0, 0);
        return { ...base, pages: 1, image: c.toDataURL('image/png') };
    }finally{b.close();if(c){c.width=0;c.height=0;}}
} return base; }
export function ranges(value: string, count: number) { if (!value.trim())
    return Array.from({ length: count }, (_, i) => i); const out: number[] = []; for (const token of value.split(',')) {
    const m = token.trim().match(/^(\d+)(?:\s*-\s*(\d+))?$/);
    if (!m)
        throw new Error('Use page numbers such as 1, 3-5.');
    const a = Number(m[1]), b = m[2] ? Number(m[2]) : a;
    if (a < 1 || b < a || b > count)
        throw new Error(`Page ranges must be between 1 and ${count}.`);
    for (let n = a; n <= b; n++)
        out.push(n - 1);
} return [...new Set(out)]; }
function blob(bytes: Uint8Array | string, type = 'application/pdf') { return new Blob([typeof bytes === 'string' ? bytes : bytes.slice().buffer as ArrayBuffer], { type }); }
const result = (b: Uint8Array | string, name: string, type?: string, report?: string, inputSize?: number): Output => ({ blob: blob(b, type), name, report, inputSize });
export async function assemble(files: Loaded[], items: PageItem[], signal?:AbortSignal, flattenForms=false) { if(files.length===1&&!files[0].image&&items.length===files[0].pages&&items.every((p,i)=>p.fileId===files[0].id&&p.index===i)){const d=await PDFDocument.load(files[0].bytes,{updateMetadata:false});for(const item of items){signal?.throwIfAborted();const p=d.getPage(item.index);p.setRotation(degrees((p.getRotation().angle+item.rotation)%360));}if(flattenForms&&hasFormWidgets(d))flattenFormSafely(d);return d;} const sources=new Map<string,PDFDocument>();for(const f of files){if(f.image)continue;const src=await PDFDocument.load(f.bytes,{updateMetadata:false});if(src.getForm().getFields().length||hasFormWidgets(src)){if(!flattenForms)throw new Error('This PDF contains fillable fields. Copying or rearranging these pages safely requires read-only fields. Choose “Make fields read-only” in the action panel, or use Flatten PDF first. Your originals are unchanged.');try{flattenFormSafely(src);}catch{throw new Error('These form appearances could not be flattened safely. Fill and save the PDF in its original form editor, then try again.');}}sources.set(f.id,src);}const out = await PDFDocument.create(); for (const item of items) {
    signal?.throwIfAborted();await new Promise(resolve=>setTimeout(resolve,0));
    const f = files.find(f => f.id === item.fileId);
    if (!f)
        throw new Error('A source file is missing.');
    if (f.image) {
        const img = await out.embedPng(f.image);
        const p = out.addPage([img.width, img.height]);
        p.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
        p.setRotation(degrees(item.rotation));
    }
    else {
        const src = sources.get(f.id)!;
        const [p] = await out.copyPages(src, [item.index]);
        p.setRotation(degrees((p.getRotation().angle + item.rotation) % 360));
        out.addPage(p);
    }
} if(files.length===1&&files[0].doc){const d=files[0].doc;out.setTitle(d.getTitle()??'');out.setAuthor(d.getAuthor()??'');out.setSubject(d.getSubject()??'');out.setKeywords((d.getKeywords()??'').split(/,\s*/));} return out; }
export const fields = readFormFields;
async function plainPDF(text: string, markdown = false) { if(markdown)return (await import('./markdown-pdf')).markdownPDF(text); const { jsPDF } = await import('jspdf'); const p = new jsPDF(); const font = await fetch('/fonts/NotoSans-Regular.ttf'); if (!font.ok)
    throw new Error('The document font could not be loaded. Please try again.'); const arr = new Uint8Array(await font.arrayBuffer()); let binary = ''; for (let i = 0; i < arr.length; i++)
    binary += String.fromCharCode(arr[i]); p.addFileToVFS('NotoSans.ttf', btoa(binary)); p.addFont('NotoSans.ttf', 'NotoSans', 'normal'); p.setFont('NotoSans'); p.setFontSize(11); let y = 23; for (const raw of text.split('\n')) {
    const heading = markdown && /^#{1,3} /.test(raw);
    p.setFontSize(heading ? 17 : 11);
    const clean = markdown ? raw.replace(/^#{1,6}\s/, '').replace(/\*\*([^*]+)\*\*/g, '$1').replace(/^[-*] /, '•  ') : raw;
    const lines = p.splitTextToSize(clean, 168);
    for (const line of lines) {
        if (y > 273) {
            p.addPage();
            y = 23;
        }
        p.text(line, 21, y);
        y += heading ? 9 : 6;
    }
    y += 2;
} return new Uint8Array(p.output('arraybuffer')); }
async function processPDFUnchecked(id: string, files: Loaded[], items: PageItem[], marks: Mark[], o: Options, progress: (n: number) => void, signal?:AbortSignal, previewContext?:{offset:number;total:number}): Promise<Output> {
    signal?.throwIfAborted();const reportProgress=progress;progress=(n)=>{signal?.throwIfAborted();reportProgress(n);};
    let first = files[0];
    const inputIssue=taskInputIssue(id,files.length,o,false,items.length);if(inputIssue)throw new Error(inputIssue);
    if(id==='workflow'){
      const names=o.recipe==='custom'?(o.workflowSteps??[]):o.recipe==='rotate-compact'?['rotate','compress']:o.recipe==='metadata-compact'||o.recipe==='share-ready'?['clean','compress']:o.recipe==='clean-scan'?['ocr']:o.recipe==='email-ready'?['compress']:o.recipe==='print-ready'?['resize']:['merge','compress'];
      const steps=names.map((id,index)=>({id,settings:workflowSettings(id,o.recipe==='custom'?o.workflowSettings?.[index]:undefined)})).filter((_,index)=>o.recipe!=='custom'||!o.workflowDisabled?.includes(index));
      if(!steps.length)throw new Error('Add at least one workflow step.');if(steps.length>8)throw new Error('This workflow supports up to 8 steps. Remove extra steps and retry.');if(steps.some(s=>!workflowOperations.includes(s.id as typeof workflowOperations[number])&&s.id!=='ocr'))throw new Error('This workflow includes an unsupported step. Choose a listed operation.');
      let currentFiles=files,currentPages=items,currentMarks=marks;let output:Output|undefined;const reports:string[]=[],timings:string[]=[];
      for(let i=0;i<steps.length;i++){
        signal?.throwIfAborted();const step=steps[i],started=Date.now();const issue=workflowStepIssue(step.id,step.settings,currentPages.length,currentFiles.length,i);if(issue)throw new Error(`Step ${i+1}: ${issue}`);
        let target=step.id,stepPages=currentPages,stepFiles=currentFiles;
        if(step.id==='remove'){const removed=new Set(ranges(step.settings.range??'',currentPages.length));stepPages=currentPages.filter((_,n)=>!removed.has(n));target='organize';}
        if(step.id==='reorder'){stepPages=ranges(step.settings.range??'',currentPages.length).map(n=>currentPages[n]);target='organize';}
        if(step.id==='blank'){const d=await assemble(currentFiles,currentPages,signal,o.flattenForm);const at=Number(step.settings.blankAt??1)-1;d.insertPage(at,[595.28,841.89]);const bytes=await d.save(),file:Loaded={...currentFiles[0],id:crypto.randomUUID(),bytes,size:bytes.length,pages:d.getPageCount(),doc:d};stepFiles=[file];stepPages=Array.from({length:file.pages},(_,index)=>({id:crypto.randomUUID(),fileId:file.id,index,rotation:0}));target='organize';}
        const stepMarks=step.id==='watermark'?[...currentMarks,...stepPages.map(page=>({id:crypto.randomUUID(),pageId:page.id,kind:'text' as const,x:.175,y:.44,w:.65,h:.12,text:step.settings.text??'DRAFT',color:'#1a293b',fontSize:32,opacity:.22,watermark:true,angle:Number(step.settings.angle??45)}))]:currentMarks;
        try{output=await processPDF(target,stepFiles,stepPages,stepMarks,{...o,range:'',resizeRange:'',quality:'compact',angle:'90',...step.settings},n=>progress(Math.round((i*100+n)/steps.length)),signal);}catch(e){if(signal?.aborted)throw e;throw new Error(`Step ${i+1} (${step.id}) failed: ${e instanceof Error?e.message:'Could not process this step.'} Your original workspace is retained.`);}
        timings.push(`Step ${i+1}: ${step.id} - completed in ${((Date.now()-started)/1000).toFixed(1)}s`);if(output.report)reports.push(output.report);
        const bytes=new Uint8Array(await output.blob.arrayBuffer()),doc=await PDFDocument.load(bytes,{updateMetadata:false}),file:Loaded={id:crypto.randomUUID(),name:output.name,bytes,size:bytes.length,pages:doc.getPageCount(),doc};currentFiles=[file];currentPages=Array.from({length:file.pages},(_,index)=>({id:crypto.randomUUID(),fileId:file.id,index,rotation:0}));currentMarks=[];
      }
      return {...output!,name:(files[0]?.name??'document.pdf').replace(/\.pdf$/i,'')+'-workflow.pdf',inputSize:files.reduce((n,f)=>n+f.size,0),report:`Completed: ${steps.map(s=>s.id).join(' → ')}. Original workspace retained.\n${timings.join('\n')}\n${reports.join('\n')}`};
    }
    if(id==='merge'&&files.length<2)throw new Error('Add at least two PDF files to merge.');
    const unchanged = files.length===1 && !first.image && !marks.length && items.length===first.pages && items.every((p,i)=>p.fileId===first.id&&p.index===i&&p.rotation===0);
    if(unchanged&&!(o.flattenForm&&['edit','sign','form','organize'].includes(id))&&(['organize','edit','sign','merge'].includes(id)||(id==='form'&&!o.flattenForm&&!Object.keys(o.fields).length))){progress(100);return result(first.bytes,first.name,undefined,'No changes: downloaded the original file without rebuilding it.');}
    if(['remove-bookmarks','remove-links','remove-attachments'].includes(id)){
      if(!unchanged)throw new Error('Use the original single PDF for this cleanup. Export other workspace changes first.');
      const d=await PDFDocument.load(first.bytes,{updateMetadata:false});
      const count=cleanupPDF(d,id as 'remove-bookmarks'|'remove-links'|'remove-attachments');progress(100);
      return result(count?await d.save():first.bytes,first.name.replace(/\.pdf$/i,'')+'-'+id+'.pdf',undefined,count?(id==='remove-links'?`${count} explicit PDF link annotations removed. Printed URLs remain; some readers detect URLs independently.`:id==='remove-bookmarks'?'Document bookmarks removed. Page content and links remain.':`${count} reachable attachment references removed. This is not secure redaction.`):'Nothing to remove: original bytes retained.');
    }
    if(id==='create'){const response=await fetch('/fonts/NotoSans-Regular.ttf');if(!response.ok)throw new Error('The local document font could not load. Retry when online.');const bytes=await textToPDF(o.text,new Uint8Array(await response.arrayBuffer()),{size:Number(o.textFontSize??'11'),paper:o.textPageSize??'a4',signal});progress(100);return result(bytes,'pdf-studio-text.pdf');}
    if(id==='create-form'){const d=await createForm(o.text);return result(await d.save(),'fillable-form.pdf');}
    if(id==='remove-annotations'){if(files.length!==1||marks.length||items.length!==first.pages||items.some((p,i)=>p.index!==i||p.rotation))throw new Error('Remove annotations on the original single PDF. Export other workspace changes first.');const d=await PDFDocument.load(first.bytes);const count=removeAnnotations(d);return result(await d.save(),'pdf-studio-clean-annotations.pdf',undefined,`${count} non-form annotations removed, including comments, highlights, stamps and links. Fillable fields and their values were kept.`);}
    if(['text','word','html','epub','csv','xlsx','audio','privacy','encrypt'].includes(id)&&items.length){const d=await assemble(files,items,signal);await applyMarks(d,items,marks,signal);const bytes=await d.save();first={...first,bytes,doc:d,pages:d.getPageCount(),size:bytes.length};}
    const filename = (first?.name ?? 'document').replace(/\.[^.]+$/, '');
    if (['create', 'markdown', 'docx', 'sheet', 'ebook'].includes(id)) {
        let txt = o.text;
        if (id === 'docx') {
            const mammoth = await import('mammoth/mammoth.browser.js');
            txt = (await mammoth.extractRawText({ arrayBuffer: first.bytes.slice().buffer as ArrayBuffer })).value;
        }
        if (id === 'sheet') {
            const x = await import('xlsx');
            const w = x.read(first.bytes);
            txt = x.utils.sheet_to_csv(w.Sheets[w.SheetNames[0]]);
        }
        if (id === 'ebook') {
            const z = await JSZip.loadAsync(first.bytes);
            const opf = Object.keys(z.files).find(n => n.endsWith('.opf'));
            if (!opf)
                throw new Error('The EPUB has no package manifest.');
            const xml = new DOMParser().parseFromString(await z.file(opf)!.async('string'), 'application/xml');
            const dir = opf.includes('/') ? opf.slice(0, opf.lastIndexOf('/') + 1) : '';
            const entries = Array.from(xml.getElementsByTagName('item'));
            const ids = Array.from(xml.getElementsByTagName('itemref')).map(e => e.getAttribute('idref'));
            const chunks = [];
            for (const n of ids) {
                const item = entries.find(e => e.getAttribute('id') === n);
                const href = item?.getAttribute('href');
                if (href && z.file(dir + decodeURIComponent(href))) {
                    const html = await z.file(dir + decodeURIComponent(href))!.async('string');
                    chunks.push(new DOMParser().parseFromString(html, 'text/html').body.textContent ?? '');
                }
            }
            txt = chunks.join('\n\n');
        }
        if (!txt.trim())
            throw new Error('Add some text or choose a document with readable text.');
        return result(await plainPDF(txt, id === 'markdown'), `${filename}.pdf`);
    }
    if (id === 'hash') {
        const h = await crypto.subtle.digest('SHA-256', first.bytes.slice().buffer as ArrayBuffer);
        const report = Array.from(new Uint8Array(h), b => b.toString(16).padStart(2, '0')).join('');
        return result(`${first.name}\nSHA-256: ${report}\n`, `${filename}-sha256.txt`, 'text/plain', report);
    }
    if (['encrypt', 'decrypt'].includes(id)) {
        if(id==='decrypt'){const {unlockPDF}=await import('./unlock-pdf');return result(await unlockPDF(first.bytes,o.password),`${filename}-unlocked.pdf`);}
        const { PDF } = await import('@libpdf/core');
        const p = await PDF.load(first.bytes, { credentials: o.password });
        if (p.isEncrypted && !p.isAuthenticated)
            throw new Error('The password is incorrect. Please try again.');
        if (o.password.length < 8)throw new Error('Use a password with at least 8 characters.');
        p.setProtection({userPassword:o.password,ownerPassword:crypto.randomUUID(),algorithm:'AES-256'});
        return result(await p.save(),`${filename}-protected.pdf`);
    }
    if (id === 'zip') {
        const z = new JSZip();
        files.forEach((f, i) => z.file(exportFilename(id,f.name,String(i+1)), f.bytes));
        return { blob: await z.generateAsync({ type: 'blob' }), name: 'documents.zip' };
    }
    if (['text', 'word', 'html', 'epub', 'csv', 'xlsx', 'audio', 'privacy'].includes(id)) {
        const texts = await textPages(first.bytes);
        signal?.throwIfAborted();
        const text = texts.join('\n\n');
        if (id === 'privacy') {
            const d = first.doc??await PDFDocument.load(first.bytes);
            const meta = { title: d.getTitle(), author: d.getAuthor(), subject: d.getSubject(), keywords: d.getKeywords(), creator: d.getCreator(), producer: d.getProducer() };
            const findings = sensitiveTextCandidates(text);
            const report = JSON.stringify({ standardMetadata: meta, possibleSensitiveText: [...new Set(findings)], note: 'Pattern matching is incomplete. Review the source before sharing.' }, null, 2);
            return result(report, `${filename}-privacy.json`, 'application/json', report);
        }
        if (!text.trim())
            throw new Error('No selectable text found. Try the OCR tool first.');
        if (id === 'text' || id === 'audio')
            return result(text, `${filename}.txt`, 'text/plain', text);
        if (id === 'word') {
            const { Document, Packer, Paragraph, TextRun } = await import('docx');
            const d = new Document({ sections: [{ children: text.split('\n').map(t => new Paragraph({ children: [new TextRun(t)] })) }] });
            return { blob: await Packer.toBlob(d), name: `${filename}.docx` };
        }
        const esc = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        if (id === 'html')
            return result(`<!doctype html><html lang="en"><meta charset="utf-8"><title>${esc(filename)}</title><style>body{max-width:760px;margin:40px auto;padding:20px;font:18px/1.7 system-ui}section{white-space:pre-wrap;border-bottom:1px solid #ddd;padding:30px 0}</style>${texts.map(t => `<section>${esc(t)}</section>`).join('')}</html>`, `${filename}.html`, 'text/html',text.slice(0,3000));
        if (id === 'epub') {
            const z = new JSZip();
            z.file('mimetype', 'application/epub+zip', { compression: 'STORE' });
            z.file('META-INF/container.xml', '<?xml version="1.0"?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles></container>');
            z.file('OEBPS/book.xhtml', `<html xmlns="http://www.w3.org/1999/xhtml"><head><title>${esc(filename)}</title></head><body>${texts.map(t => `<p>${esc(t).replace(/\n/g, '<br/>')}</p>`).join('')}</body></html>`);
            z.file('OEBPS/nav.xhtml', '<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops"><head><title>Contents</title></head><body><nav epub:type="toc"><ol><li><a href="book.xhtml">Document</a></li></ol></nav></body></html>');
            z.file('OEBPS/content.opf', `<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="id"><metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:identifier id="id">urn:uuid:${crypto.randomUUID()}</dc:identifier><dc:title>${esc(o.title||filename)}</dc:title><dc:creator>${esc(o.author||'')}</dc:creator><dc:language>en</dc:language><meta property="dcterms:modified">${new Date().toISOString().slice(0, 19)}Z</meta></metadata><manifest><item id="book" href="book.xhtml" media-type="application/xhtml+xml"/><item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/></manifest><spine><itemref idref="book"/></spine></package>`);
            return { blob: await z.generateAsync({ type: 'blob', mimeType: 'application/epub+zip' }), name: `${filename}.epub` };
        }
        const x = await import('xlsx');
        const rows = text.split('\n').filter(Boolean).map(l => l.trim().split(/\s{2,}|\t/));
        const sheet = x.utils.aoa_to_sheet(rows);
        const readable=texts.filter(page=>page.trim()).length;
        const report=`Heuristic text extraction: ${rows.length} rows from ${readable} of ${texts.length} pages with selectable text.\n${readable<texts.length?'Some pages had no selectable text; inspect them and run OCR if needed.\n':''}Columns and table structure may need manual cleanup. Verify totals, dates and identifiers against the source. Formulas and original formatting are not reconstructed.\nFirst extracted rows (review before sharing):\n${rows.slice(0,8).map(row=>row.join(' | ')).join('\n')}`;
        if (id === 'csv')
            return result(x.utils.sheet_to_csv(sheet), `${filename}.csv`, 'text/csv',report);
        const w = x.utils.book_new();
        x.utils.book_append_sheet(w, sheet, 'Extracted text');
        return {...result(new Uint8Array(x.write(w, { type: 'array', bookType: 'xlsx' })), `${filename}.xlsx`, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',report),warnings:[rows.some(row=>row.length>1)?'Possible table columns detected. This is heuristic extraction; verify all rows and totals.':'No table columns detected. The spreadsheet contains extracted text lines, not reconstructed tables.']};
    }
    if (!items.length && files.some(f => f.pages > 0) && id !== 'form')
        throw new Error('Keep at least one page in your document.');
    let order = items.length ? items : files.flatMap(f => Array.from({ length: f.pages }, (_, i) => ({ id: `${f.id}-${i}`, fileId: f.id, index: i, rotation: 0 })));
    if (id === 'reverse')
        order = [...order].reverse();
    if (id === 'duplicate')
        order = order.flatMap(p => [p, p]);
    if(id==='interleave'){const stacks=files.map(f=>order.filter(p=>p.fileId===f.id));order=[];for(let n=0;n<Math.max(...stacks.map(p=>p.length));n++)for(const stack of stacks)if(stack[n])order.push(stack[n]);}
    if (id === 'split'&&o.splitOutput!=='groups')
        order = ranges(o.range, order.length).map(i => order[i]);
    if (!order.length)
        throw new Error('Keep at least one page in your document.');
    if(order.length>400)throw new Error('This operation would exceed the 400-page workspace limit. Choose fewer pages.');
    const out = id==='form'?await PDFDocument.load(first.bytes,{updateMetadata:false}):await assemble(files, order,signal,['merge','organize','edit','sign','watermark'].includes(id)&&o.flattenForm);
    if(['images','scan'].includes(id)&&o.imagePaper&&o.imagePaper!=='original'){const sheet=resizeSheet({resizeSize:o.imagePaper,resizeOrientation:o.imageOrientation}),margin=Number(o.imageMargin??20);if(!Number.isFinite(margin)||margin<0||margin>100)throw new Error('Choose an image margin between 0 and 100 pt.');const d=await PDFDocument.create();for(const item of order){const f=files.find(f=>f.id===item.fileId);if(!f?.image)throw new Error('Choose images for this conversion.');const image=await d.embedPng(f.image),p=d.addPage(sheet),scale=Math.min((sheet[0]-margin*2)/image.width,(sheet[1]-margin*2)/image.height);p.drawImage(image,{x:(sheet[0]-image.width*scale)/2,y:(sheet[1]-image.height*scale)/2,width:image.width*scale,height:image.height*scale});p.setRotation(degrees(item.rotation));}return result(await d.save(),`${filename}-images.pdf`,undefined,`${d.getPageCount()} image pages on ${o.imagePaper} sheets. Text recognition was not performed.`);}
    if(id==='split-chapters'){
      if(out.getForm().getFields().length)throw new Error('Flatten fillable fields before splitting chapters, then reopen the result. Editable fields cannot safely be copied into chapter files.');
      const starts=new Set<number>([0]);let bookmarkCount=0;for(const source of files){if(source.image)continue;const sourceReader=await renderer(source.bytes);try{const outline=await sourceReader.getOutline();bookmarkCount+=outline?.length??0;for(const row of outline??[]){signal?.throwIfAborted();let dest=row.dest;if(typeof dest==='string')dest=await sourceReader.getDestination(dest);if(!Array.isArray(dest))continue;const n=typeof dest[0]==='number'?dest[0]:await sourceReader.getPageIndex(dest[0]);const mapped=order.findIndex(page=>page.fileId===source.id&&page.index===n);if(mapped>=0)starts.add(mapped);}}finally{await sourceReader.destroy();}}if(!bookmarkCount)throw new Error('This PDF has no top-level bookmarks. Add bookmarks first, or use Split with page ranges.');if(starts.size===1)throw new Error('No usable chapter boundaries were found. Use Split with page ranges instead.');const bounds=[...starts].sort((a,b)=>a-b);bounds.push(out.getPageCount());const zip=new JSZip();for(let i=0;i<bounds.length-1;i++){const part=await PDFDocument.create();const copied=await part.copyPages(out,Array.from({length:bounds[i+1]-bounds[i]},(_,n)=>bounds[i]+n));copied.forEach(p=>part.addPage(p));zip.file(exportFilename(id,'chapter.pdf',`Chapter ${i+1} pages ${bounds[i]+1}-${bounds[i+1]}`),await part.save());progress(Math.round((i+1)/(bounds.length-1)*100));}return{blob:await zip.generateAsync({type:'blob'}),name:`${filename}-chapters.zip`,report:'Split at supported top-level bookmark destinations. Inspect chapter boundaries before sharing.'};
    }
    if(id==='blank-check'){
      const bytes=unchanged?first.bytes:await out.save(),candidates:number[]=[];
      const review=await renderer(bytes);
      try{for(let i=0;i<review.numPages;i++){
        signal?.throwIfAborted();const page=await review.getPage(i+1),text=await page.getTextContent();
        if(text.items.some(item=>'str' in item&&item.str.trim().length>0)){progress(Math.round((i+1)/review.numPages*100));continue;}
        const viewport=page.getViewport({scale:1}),scale=Math.min(1,Math.sqrt(16000000/(viewport.width*viewport.height)));
        const c=await renderPage(bytes,i,scale,undefined,0,signal,review);
        try{const data=c.getContext('2d')!.getImageData(0,0,c.width,c.height).data;let visible=0;
          for(let n=0;n<data.length;n+=4){if(data[n]<254||data[n+1]<254||data[n+2]<254)visible++;}
          // Conservative: scan noise keeps a page for review rather than risking faint content.
          if(visible===0)candidates.push(i+1);
        }finally{c.width=0;c.height=0;}
        progress(Math.round((i+1)/review.numPages*100));
      }}finally{await review.destroy();}
      return {...result(bytes,`${filename}-blank-review.pdf`,undefined,candidates.length?`Possible blank pages: ${candidates.join(', ')}. No pages were deleted. Text and faint visible pixels are retained. Review each candidate before deleting it.`:'No blank candidates found. No pages were deleted. Faint text and scan noise are treated conservatively as content.'),blankCandidates:candidates};
    }
    if(id==='native-text'){await replaceExistingText(out,o.findText??'',o.replaceText??'');}
    if(['edit','sign','watermark'].includes(id)&&hasOverlappingWidgets(out,order,marks))throw new Error('An added element overlaps a fillable field and could be hidden. Choose Make fields read-only before exporting, or move the element outside the field. Your original remains unchanged.');
    if(id!=='form')await applyMarks(out,order,marks,signal);
    if(id==='bookmarks'){addBookmarks(out,o.text);return result(await out.save(),`${filename}-bookmarks.pdf`);}
    if(id==='halve'){const d=await halvePages(out);return result(await d.save(),`${filename}-halves.pdf`);}
    if(id==='viewer'){out.catalog.set(PDFName.of('PageLayout'),PDFName.of(o.columns==='2'?'TwoColumnLeft':'SinglePage'));return result(await out.save(),`${filename}-viewer.pdf`);}
    if(id==='split'&&o.splitOutput==='groups'){
        if(out.getForm().getFields().length||hasFormWidgets(out))throw new Error('This PDF has fillable fields. Make them read-only in Flatten PDF first, then split the result.');
        const groups=splitGroups(o.range,out.getPageCount()),zip=new JSZip();
        for(let i=0;i<groups.length;i++){signal?.throwIfAborted();const part=await PDFDocument.create();const copied=await part.copyPages(out,groups[i]);copied.forEach(page=>part.addPage(page));zip.file(exportFilename(id,`group-${i+1}.pdf`,`Group ${i+1}`),await part.save());progress(Math.round((i+1)/groups.length*100));}
        return {blob:await zip.generateAsync({type:'blob'}),name:`${filename}-groups.zip`,report:`${groups.length} PDF groups. Repeated pages across different groups are included in each group.`};
    }
    if (id === 'split-all'||id==='split'&&o.splitOutput==='separate') {
        if(out.getForm().getFields().length||hasFormWidgets(out))throw new Error('This PDF has fillable fields. Make them read-only in Flatten PDF first, then split the result.');
        const z = new JSZip();
        for (let i = 0; i < out.getPageCount(); i++) {
            const d = await PDFDocument.create();
            d.addPage((await d.copyPages(out, [i]))[0]);
            z.file(exportFilename(id,'page.pdf',`Page ${id==='split'?items.indexOf(order[i])+1:i+1}`), await d.save());
        }
        return { blob: await z.generateAsync({ type: 'blob' }), name: `${filename}-pages.zip` };
    }
    if (id === 'form') {
        if(files.length!==1||marks.length||items.length!==files[0].pages||items.some((p,i)=>p.index!==i||p.rotation))throw new Error('Fill forms on the original PDF. Export page changes first and continue with the result.');
        const d = await PDFDocument.load(first.bytes);
        await applyFormValues(d,o.fields);
        if(o.flattenForm)flattenVisibleForm(d);
        return result(await d.save(), `${filename}-filled.pdf`);
    }
    if(id==='compress'&&o.compressTarget?.trim()){
        const requested=Number(o.compressTarget)*1000;const target=Math.ceil(requested)-1;if(!Number.isFinite(requested)||requested<=0)throw new Error('Enter a positive target size in KB.');
        const source=unchanged?first.bytes:await out.save();let best:Output=result(source,`${filename}-compress.pdf`,undefined,undefined,source.length);
        if(source.length>target){const raster=!['compact','images'].includes(o.quality),attempts=o.quality==='compact'?[{quality:'compact'}]:[{quality:'compact'},{quality:'images',compressJPEG:.86},{quality:'images',compressJPEG:.78,compressMaxDimension:2400},{quality:'images',compressJPEG:.68,compressMaxDimension:2000},{quality:'images',compressJPEG:.58,compressMaxDimension:1600},{quality:'images',compressJPEG:.45,compressMaxDimension:1200},...(raster?[{quality:o.quality,compressJPEG:o.quality==='small'?.45:o.quality==='balanced'?.72:.9},{quality:o.quality,compressJPEG:.35},{quality:o.quality,compressJPEG:.2}]:[])];
        for(let i=0;i<attempts.length;i++){signal?.throwIfAborted();const candidate=await processPDF('compress',files,items,marks,{...o,compressTarget:undefined,...attempts[i]},n=>progress(Math.round((i*100+n)/attempts.length)),signal);if(candidate.blob.size<best.blob.size)best=candidate;if(best.blob.size<=target)break;}}
        return {...best,name:`${filename}-${o.compressTarget}kb.pdf`,target:{requestedKB:Number(o.compressTarget),met:best.blob.size<=target},report:`${best.blob.size<=target?'Target reached.':'Target not reached; smallest tested result retained.'} Requested ${o.compressTarget} KB; result ${(best.blob.size/1000).toFixed(1)} KB. ${best.report??'Original source retained unchanged.'} Best-effort size targeting cannot guarantee readability or a specific size; inspect the preview.`};
    }
    if(id==='compress'&&o.quality==='images'){const source=unchanged?first.bytes:await out.save();const d=await PDFDocument.load(source,{updateMetadata:false});const changed=await optimizeJPEGImages(d,signal,{quality:o.compressJPEG,maxDimension:o.compressMaxDimension});progress(95);const bytes=changed?await d.save({useObjectStreams:true}):source;return result(bytes.length<source.length?bytes:source,`${filename}-images-optimized.pdf`,undefined,bytes.length<source.length?`Optimized ${changed} supported RGB JPEG images. Text, links and form structure retained. JPEG quality is reduced${o.compressMaxDimension?`; images limited to ${o.compressMaxDimension} pixels on the longest side`:""}; inspect small image details.`:'No smaller result: original source retained. Only unmasked RGB JPEG streams are supported by this mode.',source.length);}
    if(id==='compress'&&o.quality==='compact'){progress(90);const baseline=unchanged?first.bytes:await out.save();const compact=unchanged?await PDFDocument.load(first.bytes,{updateMetadata:false}):out;const bytes=await compact.save({useObjectStreams:true});signal?.throwIfAborted();const smaller=bytes.length<baseline.length;return result(smaller?bytes:baseline,`${filename}-compact.pdf`,undefined,smaller?`Reduced from ${baseline.length} to ${bytes.length} bytes. Text and links retained.`:'No size reduction: kept the source unchanged. Try Recommended to optimize supported JPEGs while retaining text, links and forms.',baseline.length);}
    if(id==='flatten'&&o.flattenMode!=='image'){const count=out.getForm().getFields().length;flattenFormSafely(out);progress(100);return result(await out.save(),`${filename}-flatten.pdf`,undefined,`${count} form fields made read-only. Selectable text and page sizes retained. Other annotations remain; choose image mode to flatten the entire appearance.`,first.size);}
    if (['jpg', 'png', 'webp', 'compress', 'flatten', 'redact', 'grayscale', 'invert', 'ocr', 'pptx'].includes(id)) {
        const source = id==='compress'&&unchanged?first.bytes:await out.save();
        const raster = await PDFDocument.create();
        const z = new JSZip();
        let ppt: InstanceType<typeof import('pptxgenjs').default> | undefined;
        if (id === 'pptx') {
            const P = (await import('pptxgenjs')).default;
            ppt = new P();
            ppt.layout = 'LAYOUT_WIDE';
        }
        let omittedGlyphs=0;const ocrReview:import('./ocr-review').OCRReviewPage[]=[];
        const ocrSelected=id==='ocr'&&o.ocrRange?new Set(ranges(o.ocrRange,order.length)):undefined;
        let worker: Awaited<ReturnType<typeof import('tesseract.js').createWorker>> | undefined;
        const compressionReader=id==='compress'?await renderer(source):undefined;
        try {
            const font = id === 'ocr' ? await raster.embedFont(StandardFonts.Helvetica) : undefined;
            for (let i = 0; i < order.length; i++) {
                signal?.throwIfAborted();await new Promise(resolve=>setTimeout(resolve,0));
                if(id==='ocr'){let skip=!!ocrSelected&&!ocrSelected.has(i);if(!skip&&o.ocrSkipText!==false){const reader=await renderer(source);try{const text=await (await reader.getPage(i+1)).getTextContent();skip=text.items.some(item=>'str' in item&&item.str.trim().length>0);}finally{await reader.destroy();}}if(skip){const [copied]=await raster.copyPages(out,[i]);raster.addPage(copied);ocrReview.push(null);progress(10+Math.round((i+1)/order.length*85));continue;}}
                const scale = id === 'compress' ? (o.quality === 'small' ? 150/72 : o.quality === 'balanced' ? 200/72 : 300/72) : ['jpg','png','webp'].includes(id) ? Number(o.quality) || 2 : ['flatten','redact','grayscale','invert'].includes(id)?150/72:1.5;
                const c = compressionReader?await renderPage(source,i,scale,undefined,0,signal,compressionReader):await render(source, i, scale,undefined,0,signal);
                const ctx = c.getContext('2d')!;
                if (id === 'redact') {
                    marks.filter(m => m.pageId === order[i].id && m.kind === 'redact').forEach(m => { ctx.fillStyle = '#000'; ctx.fillRect(m.x * c.width, m.y * c.height, m.w * c.width, m.h * c.height); });
                }
                if (id === 'grayscale' || id === 'invert') {
                    const px = ctx.getImageData(0, 0, c.width, c.height);
                    for (let p = 0; p < px.data.length; p += 4) {
                        if (id === 'grayscale') {
                            const g = .2126 * px.data[p] + .7152 * px.data[p + 1] + .0722 * px.data[p + 2];
                            px.data[p] = px.data[p + 1] = px.data[p + 2] = g;
                        }
                        else {
                            px.data[p] = 255 - px.data[p];
                            px.data[p + 1] = 255 - px.data[p + 1];
                            px.data[p + 2] = 255 - px.data[p + 2];
                        }
                    }
                    ctx.putImageData(px, 0, 0);
                }
                const jpg = ['jpg','png','webp','pptx'].includes(id)?c.toDataURL(id === 'png' ? 'image/png' : id==='webp'?'image/webp':'image/jpeg', .92):'';
                if (['jpg','png','webp'].includes(id)) {
                    if(id==='webp'&&!jpg.startsWith('data:image/webp'))throw new Error('This browser cannot encode WebP. Choose PDF to PNG or JPG instead.');
                    z.file(exportFilename(id,`page.${id}`,`Page ${i+1}`), jpg.split(',')[1], { base64: true });
                }
                else if (ppt) {
                    const s = ppt.addSlide();
                    const ratio = Math.min(13.333 / c.width, 7.5 / c.height), w = c.width * ratio, h = c.height * ratio;
                    s.addImage({ data: jpg, x: (13.333 - w) / 2, y: (7.5 - h) / 2, w, h });
                }
                else {
                    const img = await raster.embedJpg(c.toDataURL('image/jpeg', id === 'compress' ? Math.max(.1,Math.min(.95,o.compressJPEG??(o.quality === 'small' ? .45 : o.quality === 'balanced' ? .72 : .9))) : .9));
                    const visible=pageGeometry(out.getPage(i));
                    const page = raster.addPage([visible.width,visible.height]);
                    page.drawImage(img, { x: 0, y: 0, width: page.getWidth(), height: page.getHeight() });
                    if (id==='ocr' && font) {
                        if(!worker)worker = await (await import('tesseract.js')).createWorker(['eng','fra','deu','spa','ita','por'].includes(o.ocrLanguage??'eng')?(o.ocrLanguage??'eng'):'eng', 1, { ...ocrWorkerOptions,logger: m => { if (m.status === 'recognizing text')
                        reportProgress(Math.round(m.progress * 80) + 10); } });

                        const review:NonNullable<import('./ocr-review').OCRReviewPage>={width:page.getWidth(),height:page.getHeight(),image:c.toDataURL('image/jpeg',.9),words:[]};ocrReview.push(review);
                        if(o.ocrPreprocess==='grayscale'||o.ocrPreprocess==='threshold'){const pixels=ctx.getImageData(0,0,c.width,c.height);for(let k=0;k<pixels.data.length;k+=4){const gray=.2126*pixels.data[k]+.7152*pixels.data[k+1]+.0722*pixels.data[k+2],v=o.ocrPreprocess==='threshold'?(gray<160?0:255):gray;pixels.data[k]=pixels.data[k+1]=pixels.data[k+2]=v;}ctx.putImageData(pixels,0,0);}
                        const r = await worker.recognize(c, {}, { blocks: true });
                        signal?.throwIfAborted();
                        const blocks = r.data.blocks ?? [];
                        for (const b of blocks)
                            for (const par of b.paragraphs)
                                for (const line of par.lines)
                                    for (const word of line.words) {
                                        review.words.push({text:word.text,confidence:word.confidence,x:word.bbox.x0/scale,y:word.bbox.y0/scale,width:(word.bbox.x1-word.bbox.x0)/scale,height:(word.bbox.y1-word.bbox.y0)/scale});
                                        const t = Array.from(word.text).filter(character=>{try{font.encodeText(character);return true;}catch{omittedGlyphs++;return false;}}).join('');
                                        if (!t)
                                            continue;
                                        page.drawText(t, { x: word.bbox.x0 / scale, y: page.getHeight() - word.bbox.y1 / scale, size: Math.max(3, (word.bbox.y1 - word.bbox.y0) / scale), font, opacity: 0 });
                                    }
                    }
                }
                c.width = 0;
                c.height = 0;
                progress(10 + Math.round((i + 1) / order.length * 85));
            }
            if (['jpg','png','webp'].includes(id))
                return { blob: await z.generateAsync({ type: 'blob' }), name: `${filename}-${id}.zip` };
            if (ppt)
                return { blob: await ppt.write({ outputType: 'blob' }) as Blob, name: `${filename}.pptx` };
            const bytes=await raster.save();
            const noSaving=id==='compress'&&bytes.length>=source.length;
            const warning=id==='ocr'?`OCR language: ${o.ocrLanguage??'eng'}. Recognition can be wrong; review names and numbers.${omittedGlyphs?` ${omittedGlyphs} characters could not be included in the searchable layer; visible scan retained.`:''}`:id==='compress'?(noSaving?'No size reduction: kept the source instead of the larger raster output.':`Reduced from ${source.length} to ${bytes.length} bytes. Image-based output: searchable text, links and forms are lost.`):undefined;
            return {...result(noSaving?source:bytes, `${filename}-${id}.pdf`,undefined,warning,id==='compress'?source.length:files.reduce((total,file)=>total+file.size,0)),...(['flatten','redact','grayscale','invert'].includes(id)?{warnings:['Image-based output: selectable text, links and editable forms are removed. Inspect the result before sharing.']}:{}),...(id==='ocr'?{ocrReview}:{})};
        }
        finally {
            try{await worker?.terminate();}finally{await compressionReader?.destroy();}
        }
    }
    if (id === 'resize' || id === 'nup' || id === 'flip') {
        await out.flush();
        const fresh = await PDFDocument.create();
        const normalized=await PDFDocument.create();
        for(const page of out.getPages()){if(!page.node.Contents())page.pushOperators(pushGraphicsState(),popGraphicsState());const box=page.getCropBox(),g=pageGeometry(page);const e=await normalized.embedPage(page,{left:box.x,bottom:box.y,right:box.x+box.width,top:box.y+box.height});const q=normalized.addPage([g.width,g.height]);q.drawPage(e,{x:g.rotation===180||g.rotation===270?g.width:0,y:g.rotation===90||g.rotation===180?g.height:0,rotate:degrees(-g.rotation)});}
        await normalized.flush();
        const embeds=await fresh.embedPages(normalized.getPages());
        if (id === 'resize') {
            if(out.getForm().getFields().length||hasFormWidgets(out))throw new Error('Resize would lose fillable fields. Make them read-only in Flatten PDF first, then resize the result.');
            const sheet=resizeSheet(o),selected=new Set(ranges(o.resizeRange??'',embeds.length));
            for(let i=0;i<embeds.length;i++){
                signal?.throwIfAborted();
                if(!selected.has(i)){fresh.addPage((await fresh.copyPages(out,[i]))[0]);continue;}
                const e=embeds[i],p=fresh.addPage(sheet),placement=resizePlacement(e.width,e.height,sheet,o.resizeMode==='fill');
                p.drawPage(e,placement);
            }
        }
        else if (id === 'flip') {
            for (const e of embeds) {
                const p = fresh.addPage([e.width, e.height]);
                p.drawPage(e,o.flipAxis==='vertical'?{x:0,y:e.height,xScale:1,yScale:-1}:{x:e.width,y:0,xScale:-1,yScale:1});
            }
        }
        else {
            const n = Number(o.columns) || 2;
            if(![2,4,6,9].includes(n))throw new Error('Choose 2, 4, 6 or 9 pages per sheet.');const cols=n===9?3:2,rows=Math.ceil(n/cols);const sheet:[number,number]=o.resizeOrientation==='portrait'?[595.28,841.89]:[841.89,595.28],margin=Number(o.labelMargin??20);if(!Number.isFinite(margin)||margin<0||margin>100)throw new Error('Choose a sheet margin from 0 to 100 pt.');
            for (let i = 0; i < embeds.length; i += n) {
                const p = fresh.addPage(sheet);
                for (let j = 0; j < n && i + j < embeds.length; j++) {
                    const e = embeds[i + j], cw = (sheet[0]-margin*2) / cols, ch = (sheet[1]-margin*2) / rows, s = Math.min((cw - 16) / e.width, (ch - 16) / e.height);
                    p.drawPage(e, { x: margin + (j % cols) * cw + (cw - e.width * s) / 2, y: margin + (rows - 1 - Math.floor(j / cols)) * ch + (ch - e.height * s) / 2, width: e.width * s, height: e.height * s });
                }
            }
        }
        return result(await fresh.save(), `${filename}-${id==='nup'?(o.columns+'-per-sheet'):id==='flip'?'mirrored':id}.pdf`);
    }
    let font = await out.embedFont(StandardFonts.Helvetica);
    if (['edit', 'sign', 'watermark', 'headers', 'bates'].includes(id)) {
        const fontkit = (await import('@pdf-lib/fontkit')).default;
        out.registerFontkit(fontkit);
        const response = await fetch('/fonts/NotoSans-Regular.ttf');
        if (!response.ok)
            throw new Error('The editor font could not be loaded. Please try again.');
        font = await out.embedFont(await response.arrayBuffer(), { subset: true });
    }
    const rotatePages=id==='rotate'?new Set(ranges(o.range,out.getPageCount())):undefined;
    for (let i = 0; i < out.getPageCount(); i++) {
        const p = out.getPage(i);
        if (id === 'rotate'&&rotatePages?.has(i))
            p.setRotation(degrees((p.getRotation().angle + Number(o.angle)) % 360));
        if (id === 'crop') {
            const box=p.getCropBox(),left=Number(o.cropLeft??o.margin),right=Number(o.cropRight??o.margin),top=Number(o.cropTop??o.margin),bottom=Number(o.cropBottom??o.margin);
            if([left,right,top,bottom].some(n=>!Number.isFinite(n)||n<0)||left+right>=box.width||top+bottom>=box.height)throw new Error('Choose smaller crop margins; at least part of the page must remain.');
            p.setCropBox(box.x+left,box.y+bottom,box.width-left-right,box.height-top-bottom);
        }
        if (id === 'watermark' && !marks.some(m=>m.watermark)) {
            throw new Error('Place a watermark on the page before exporting.');
        }
        if (['numbers', 'bates', 'headers'].includes(id)) {
            if(!ranges(o.range,out.getPageCount()).includes(i))continue;
            const labelIndex=i+(previewContext?.offset??0),labelTotal=previewContext?.total??out.getPageCount();
            const n=labelIndex+(Number(o.start)||1),g=pageGeometry(p),size=Number(o.labelFontSize??11),margin=Number(o.labelMargin??24);
            if(!Number.isFinite(size)||size<6||size>72||!Number.isFinite(margin)||margin<5||margin>200)throw new Error('Use font size 6-72 pt and inset margin 5-200 pt.');
            const digits=Number(o.batesDigits??6);if(id==='bates'&&(!Number.isInteger(digits)||digits<1||digits>12))throw new Error('Use 1-12 Bates digits.');
            const t=id==='numbers'?formattedNumber(n,o.numberFormat,labelTotal):id==='bates'?`${o.text||'DOC-'}${String(n).padStart(digits,'0')}${o.batesSuffix??''}`:labelText(o.text,labelIndex+1,labelTotal);
            p.pushOperators(pushGraphicsState(),concatTransformationMatrix(...g.matrix as [number,number,number,number,number,number]));
            const draw=(text:string,position:string)=>{if(!text)return;const width=font.widthOfTextAtSize(text,size),x=position.endsWith('right')?g.width-margin-width:position.endsWith('center')?(g.width-width)/2:margin,y=position.startsWith('top')?g.height-margin-size:position.startsWith('middle')?g.height/2:margin;if(x<0||x+width>g.width||y<0||y+size>g.height)throw new Error('The label does not fit this page. Shorten it or reduce the font size.');p.drawText(text,{x,y,size,font,color:rgb(.2,.2,.25)});};
            if(id==='headers'){draw(t,'top-left');draw(labelText(o.headerCenter??'',labelIndex+1,labelTotal),'top-center');draw(labelText(o.headerRight??'',labelIndex+1,labelTotal),'top-right');draw(labelText(o.footer??'',labelIndex+1,labelTotal),'bottom-left');draw(labelText(o.footerCenter??'',labelIndex+1,labelTotal),'bottom-center');draw(labelText(o.footerRight??'',labelIndex+1,labelTotal),'bottom-right');}else draw(t,o.numberPosition??'bottom-center');
            p.pushOperators(popGraphicsState());
        }
        progress(10+Math.round((i+1)/out.getPageCount()*85));
    }
    if (id === 'metadata') {
        out.setTitle(o.title);
        out.setAuthor(o.author);
        out.setSubject(o.subject);out.setKeywords((o.keywords??'').split(',').map(s=>s.trim()).filter(Boolean));out.setCreator(o.creator??'');out.setProducer(o.producer??'');
    }
    if (id === 'clean') {
        out.setTitle('');
        out.setAuthor('');
        out.setSubject('');
        out.setKeywords([]);
        out.setCreator('');
        out.setProducer('');
        const info=out.context.lookup(out.context.trailerInfo.Info,PDFDict);info.delete(PDFName.of('CreationDate'));info.delete(PDFName.of('ModDate'));out.catalog.delete(PDFName.of('Metadata'));
    }
    signal?.throwIfAborted();return result(await out.save(), `${filename}-${id}.pdf`);
}

// Annotation coordinates are measured on the displayed CropBox, including rotation.
export async function applyMarks(out:PDFDocument,order:PageItem[],marks:Mark[],signal?:AbortSignal){
 const usable=marks.filter(m=>m.kind!=='redact');if(!usable.length)return;
 const fontkit=(await import('@pdf-lib/fontkit')).default;out.registerFontkit(fontkit);
 const response=await fetch('/fonts/NotoSans-Regular.ttf',{signal});if(!response.ok)throw new Error('The editor font could not be loaded. Please try again.');
 const font=await out.embedFont(await response.arrayBuffer(),{subset:true});
 const fontCache=new Map<string,typeof font>();
 for(let i=0;i<out.getPageCount();i++){
  const p=out.getPage(i),g=pageGeometry(p);signal?.throwIfAborted();
  for(const m of usable.filter(m=>m.pageId===order[i].id)){
   const {x,y,w,h}=m;if(![x,y,w,h].every(Number.isFinite)||x<0||y<0||w<=0||h<=0||x+w>1.001||y+h>1.001)throw new Error('An element is outside the page. Move or resize it before exporting.');
   const xx=x*g.width,yy=(1-y-h)*g.height,ww=w*g.width,hh=h*g.height;
   const hex=/^#[0-9a-f]{6}$/i.test(m.color)?m.color.slice(1):'172638',color=rgb(parseInt(hex.slice(0,2),16)/255,parseInt(hex.slice(2,4),16)/255,parseInt(hex.slice(4,6),16)/255);
   p.pushOperators(pushGraphicsState(),concatTransformationMatrix(...g.matrix as [number,number,number,number,number,number]));
   if(m.watermark&&m.angle)p.pushOperators(concatTransformationMatrix(...markRotation(m.angle,xx,yy,ww,hh)));
   if(m.kind==='text'){
    let markFont=font;if(m.fontFamily&&m.fontFamily!=='noto'){const family=m.fontFamily==='times'?'TimesRoman':m.fontFamily==='courier'?'Courier':'Helvetica';const variant=family==='TimesRoman'?(m.bold?(m.italic?'TimesRomanBoldItalic':'TimesRomanBold'):(m.italic?'TimesRomanItalic':'TimesRoman')):family+(m.bold?(m.italic?'BoldOblique':'Bold'):(m.italic?'Oblique':''));let cached=fontCache.get(variant);if(!cached){cached=await out.embedFont(StandardFonts[variant as keyof typeof StandardFonts]);fontCache.set(variant,cached);}markFont=cached;}
    let lines:string[];try{lines=wrapText(m.text??'',markFont,m.fontSize,ww);}catch{throw new Error('This font cannot display some characters. Choose Unicode (Noto Sans).');}const lineHeight=m.fontSize*1.2;
    if(lines.length*lineHeight>hh+1)throw new Error('A text box is too small for its text. Increase its height or reduce the font size.');
    for(let n=0;n<lines.length;n++){const text=lines[n],width=markFont.widthOfTextAtSize(text,m.fontSize),offset=m.align==='center'?(ww-width)/2:m.align==='right'?ww-width:0,baseline=yy+hh-m.fontSize-n*lineHeight;p.drawText(text,{x:xx+offset,y:baseline,size:m.fontSize,font:markFont,color,opacity:Math.max(0,Math.min(1,m.opacity??1))});if(m.strike&&text)p.drawLine({start:{x:xx+offset,y:baseline+m.fontSize*.3},end:{x:xx+offset+width,y:baseline+m.fontSize*.3},thickness:Math.max(.5,m.fontSize/16),color});if(m.underline&&text)p.drawLine({start:{x:xx+offset,y:baseline-m.fontSize*.12},end:{x:xx+offset+width,y:baseline-m.fontSize*.12},thickness:Math.max(.5,m.fontSize/16),color});}
   }else if(m.kind==='highlight')p.drawRectangle({x:xx,y:yy,width:ww,height:hh,color,opacity:Math.max(.1,Math.min(.9,m.opacity??.25))});
   else if(m.kind==='whiteout')p.drawRectangle({x:xx,y:yy,width:ww,height:hh,color});
   else if(m.kind==='line'||m.kind==='arrow'){
    for(const segment of lineSegments(m.lineStart,m.lineEnd,ww,hh,m.kind==='arrow'))p.drawLine({start:{x:xx+segment.start.x,y:yy+hh-segment.start.y},end:{x:xx+segment.end.x,y:yy+hh-segment.end.y},thickness:Math.max(.5,Math.min(24,m.strokeWidth??2)),color});
   }
   else if(m.kind==='rectangle')p.drawRectangle({x:xx,y:yy,width:ww,height:hh,borderColor:color,borderWidth:Math.max(.5,Math.min(24,m.strokeWidth??2))});
   else if(m.kind==='ellipse')p.drawEllipse({x:xx+ww/2,y:yy+hh/2,xScale:ww/2,yScale:hh/2,borderColor:color,borderWidth:Math.max(.5,Math.min(24,m.strokeWidth??2))});
   else if(m.kind==='image'&&m.image){const image=await out.embedPng(m.image);p.drawImage(image,{x:xx,y:yy,width:ww,height:hh});}
   else if(m.kind==='link')p.drawRectangle({x:xx,y:yy,width:ww,height:hh,borderColor:color,borderWidth:1});
   p.pushOperators(popGraphicsState());
   if(m.kind==='link'){
    const url=safeLink(m.url??'');if(!url)throw new Error('Use a complete https://, http:// or mailto: link.');
    const corners=[displayPoint(p,x,y),displayPoint(p,x+w,y+h)];
    const ref=out.context.register(out.context.obj({Type:'Annot',Subtype:'Link',Rect:[Math.min(...corners.map(c=>c.x)),Math.min(...corners.map(c=>c.y)),Math.max(...corners.map(c=>c.x)),Math.max(...corners.map(c=>c.y))],Border:[0,0,0],A:{Type:'Action',S:'URI',URI:PDFString.of(url)}}));
    let annots=p.node.lookupMaybe(PDFName.of('Annots'),PDFArray);if(!annots){annots=out.context.obj([]);p.node.set(PDFName.of('Annots'),annots);}annots.push(ref);
   }
  }
 }
}
export function wrapText(text:string,font:{widthOfTextAtSize:(v:string,s:number)=>number},size:number,width:number){
 const lines:string[]=[];for(const para of text.split('\n')){let line='';for(const char of para){if(line&&font.widthOfTextAtSize(line+char,size)>width){lines.push(line);line='';}line+=char;}lines.push(line);}return lines;
}


/** Do not report success for invalid PDF bytes or complete unexpected blank output. */
export async function processPDF(id:string,files:Loaded[],items:PageItem[],marks:Mark[],o:Options,progress:(n:number)=>void,signal?:AbortSignal):Promise<Output>{
 const rawOutput=await processPDFUnchecked(id,files,items,marks,o,progress,signal);
 const output={...rawOutput,name:exportFilename(id,rawOutput.name,'',files[0]?.name??rawOutput.name)};
 if(output.blob.type!=='application/pdf'||id==='encrypt')return output;
 signal?.throwIfAborted();
 const bytes=new Uint8Array(await output.blob.arrayBuffer());
 if(!new TextDecoder().decode(bytes.slice(0,1024)).includes('%PDF-'))throw new Error('Export did not produce a valid PDF. Your original is still in the workspace.');
 const doc=await PDFDocument.load(bytes,{updateMetadata:false});
 if(!doc.getPageCount())throw new Error('Export produced no pages. Your original is still in the workspace.');
 const same=files.length===1&&!files[0].image&&bytes.length===files[0].bytes.length&&bytes.every((b,i)=>b===files[0].bytes[i]);
 // Pixel checks run only in a browser. Intentional removal/covering can legitimately erase content.
 if(same||typeof document==='undefined'||['invert','crop','remove-annotations','decrypt','create','markdown','create-form'].includes(id)||marks.some(m=>m.kind==='whiteout'))return output;
 type ProbePage={bytes:Uint8Array;index:number;rotation:number;image?:string};
 const outputPages:ProbePage[]=doc.getPages().map((_,index)=>({bytes,index,rotation:0}));
 const chosen=id==='split'?ranges(o.range,items.length).map(i=>items[i]):items;
 const sourcePages:ProbePage[]=chosen.map(p=>{const f=files.find(f=>f.id===p.fileId);if(!f)throw new Error('A source file is missing.');return{bytes:f.bytes,index:p.index,rotation:p.rotation,image:f.image};});
 const probe=async(page:ProbePage)=>{
  signal?.throwIfAborted();let canvas:HTMLCanvasElement|undefined;
  try{
   if(page.image){
    const imageBytes=Uint8Array.from(atob(page.image.split(',')[1]),c=>c.charCodeAt(0));const photo=await decodePhoto(new File([imageBytes.buffer],'source.png',{type:'image/png'}));
    try{canvas=document.createElement('canvas');canvas.width=Math.min(180,photo.width);canvas.height=Math.max(1,Math.round(photo.height*canvas.width/photo.width));if(canvas.width*canvas.height>2000000)throw new Error('This source is too large to verify.');const ctx=canvas.getContext('2d');if(!ctx)throw new Error('Your browser could not verify this export.');ctx.drawImage(photo.source,0,0,canvas.width,canvas.height);}finally{photo.close();}
   }else canvas=await render(page.bytes,page.index,.18,undefined,page.rotation,signal);
   const ctx=canvas.getContext('2d');if(!ctx)throw new Error('Your browser could not verify this export.');
   return pixelsHaveInk(ctx.getImageData(0,0,canvas.width,canvas.height).data);
  }finally{if(canvas){canvas.width=0;canvas.height=0;}}
 };
 await rejectBlankOutput(outputPages,sourcePages,probe,signal);
 return output;
}


/** Bounded, disposable preview. Uses the export transformations without changing source files. */
export async function previewPDF(id:string,files:Loaded[],items:PageItem[],o:Options,offset:number,total:number,signal?:AbortSignal):Promise<Output>{
 if(['remove-attachments','remove-links','remove-bookmarks','remove-annotations','split-chapters','blank-check','bookmarks','split','webp','jpg','png','compress','reverse','duplicate','split-all'].includes(id))return processPDFUnchecked('rotate',files,items,[],{...o,range:'',angle:'0'},()=>{},signal,{offset,total});
 if(!['crop','nup','numbers','bates','headers','flip','grayscale','invert','rotate','halve','viewer'].includes(id))throw new Error('Unsupported preview.');
 if(items.length>(id==='nup'?9:id==='viewer'?2:1))throw new Error('Preview page limit exceeded.');
 const labels=['numbers','bates','headers','rotate'].includes(id);
 const selected=!labels||ranges(o.range,total).includes(offset);
 return processPDFUnchecked(selected?id:'rotate',files,items,[],{...o,range:'',...(!selected?{angle:'0'}:{})},()=>{},signal,{offset,total});
}
