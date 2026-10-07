import {textEngine} from './online-text-engine';

/** Authenticate in PDFium, then write a fresh copy without its security handler. */
export async function unlockPDF(bytes:Uint8Array,password:string){
 const m=await textEngine(),pointer=m.pdfium.wasmExports.malloc(bytes.length);
 if(!pointer)throw new Error('Not enough memory to open this PDF. Choose a smaller file.');
 let doc=0,writer=0,buffer=0;
 try{
  m.pdfium.HEAPU8.set(bytes,pointer);doc=m.FPDF_LoadMemDocument(pointer,bytes.length,password);
  if(!doc){const error=m.FPDF_GetLastError();throw new Error(error===4?'The password is incorrect. Please try again.':error===5?'This PDF uses an unsupported security method. Certificate encryption cannot be removed here.':'This PDF could not be read. Choose a valid, readable PDF.');}
  const count=m.FPDF_GetPageCount(doc);if(count<1)throw new Error('This PDF has no readable pages. Choose another copy.');
  writer=m.PDFiumExt_OpenFileWriter();if(!writer||!m.FPDF_SaveAsCopy(doc,writer,3))throw new Error('The unlocked PDF could not be saved. Your original is unchanged.');
  const size=m.PDFiumExt_GetFileWriterSize(writer);if(!size)throw new Error('The unlocked PDF is empty. No file was exported.');
  buffer=m.pdfium.wasmExports.malloc(size);if(!buffer)throw new Error('Not enough memory to save this PDF.');
  m.PDFiumExt_GetFileWriterData(writer,buffer,size);return m.pdfium.HEAPU8.slice(buffer,buffer+size);
 }finally{if(buffer)m.pdfium.wasmExports.free(buffer);if(writer)m.PDFiumExt_CloseFileWriter(writer);if(doc)m.FPDF_CloseDocument(doc);m.pdfium.wasmExports.free(pointer);}
}
