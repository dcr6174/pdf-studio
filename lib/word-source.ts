import {PDFDocument} from 'pdf-lib';
import {assemble,applyMarks,type Loaded,type PageItem,type Mark} from './pdf-engine';
/** Preserve incremental-update catalogues on unchanged inputs; new page trees use fresh refs. */
export async function wordSource(files:Loaded[],items:PageItem[],marks:Mark[],signal?:AbortSignal):Promise<Uint8Array>{
 signal?.throwIfAborted();
 if(files.length===1&&!files[0].image&&!marks.length&&items.length===files[0].pages&&items.every((p,i)=>p.fileId===files[0].id&&p.index===i&&p.rotation===0))return files[0].bytes;
 const assembled=await assemble(files,items,signal),fresh=await PDFDocument.create();
 for(const page of await fresh.copyPages(assembled,assembled.getPageIndices())){signal?.throwIfAborted();fresh.addPage(page);}
 await applyMarks(fresh,items,marks,signal);
 signal?.throwIfAborted();return fresh.save();
}
