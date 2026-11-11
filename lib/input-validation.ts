export const SOFT_BYTES=150*1024*1024,MAX_BYTES=Number.MAX_SAFE_INTEGER,MAX_PAGES=5000,MAX_BATCH=20;
export function validateSelection(files:{name:string;size:number}[],extensions:string,multiple:boolean,existingBytes=0){
 if(!files.length)throw new Error('Choose at least one file.');
 if(files.some(f=>!extensions.split(',').some(ext=>f.name.toLowerCase().endsWith(ext))))throw new Error(`Choose ${extensions} files for this tool.`);
 if(!multiple&&files.length>1)throw new Error('This tool accepts one file at a time.');
 const total=files.reduce((n,f)=>n+f.size,existingBytes);
 return total>SOFT_BYTES?`These files total ${(total/1e6).toFixed(0)} MB. Large files can be slow or run out of memory on phones. Processing will still be attempted.`:'';
}
export function validatePages(count:number){if(count>MAX_PAGES)throw new Error(`This would create ${count} pages. The workspace accepts up to ${MAX_PAGES} pages. Choose fewer pages or split the document first.`);}


export function validateBatch(count:number){if(count>MAX_BATCH)throw new Error(`You selected ${count} files. Batch processing accepts up to ${MAX_BATCH} files. Remove some files and try again.`);}
export function validateTextInput(bytes:number,pages=0){
 if(bytes>MAX_BYTES)throw new Error(`This document is ${(bytes/1e6).toFixed(1)} MB. Existing-text editing accepts up to 150 MiB. Choose a smaller PDF or split it first.`);
 if(pages>MAX_PAGES)throw new Error(`This document has ${pages} pages. Existing-text editing accepts up to ${MAX_PAGES} pages. Split the document first.`);
}
