export const MAX_BYTES=150*1024*1024,MAX_PAGES=400,MAX_BATCH=20;
export function validateSelection(files:{name:string;size:number}[],extensions:string,multiple:boolean,existingBytes=0){
 if(!files.length)throw new Error('Choose at least one file.');
 if(files.some(f=>!extensions.split(',').some(ext=>f.name.toLowerCase().endsWith(ext))))throw new Error(`Choose ${extensions} files for this tool.`);
 if(!multiple&&files.length>1)throw new Error('This tool accepts one file at a time.');
 if(files.reduce((n,f)=>n+f.size,existingBytes)>MAX_BYTES)throw new Error('Choose files below 150 MiB in total to keep this browser session reliable.');
}
export function validatePages(count:number){if(count>MAX_PAGES)throw new Error('Choose up to 400 pages to keep the workspace responsive.');}
