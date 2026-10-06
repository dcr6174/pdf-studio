import {tools} from './tools';
/** Name the result-producing action, including the separate-file batch mode. */
export function taskActionLabel(id:string,fileCount:number,batch=false):string {
 if(batch)return 'Process files · download ZIP';
 if(id==='merge')return `Merge ${fileCount} files`;
 const labels:Record<string,string>={
 compress:'Compress PDF',split:'Extract selected pages','split-all':'Split into files',rotate:'Rotate PDF',redact:'Apply redaction',sign:'Export signed PDF',edit:'Export edited PDF',create:'Create PDF',markdown:'Create PDF',privacy:'Scan document',audio:'Read aloud',hash:'Calculate fingerprint',workflow:'Run workflow',organize:'Save page order',watermark:'Apply watermark',form:'Export filled PDF','create-form':'Create fillable PDF',word:'Convert to Word',text:'Extract text',pptx:'Convert to PowerPoint',xlsx:'Extract spreadsheet',jpg:'Create JPG images',png:'Create PNG images',webp:'Create WebP images',zip:'Download ZIP',resize:'Resize PDF',nup:'Create multi-page sheets',encrypt:'Protect PDF',decrypt:'Remove password',metadata:'Save metadata',images:'Create PDF',scan:'Create scanned PDF',docx:'Convert Word to PDF',sheet:'Convert spreadsheet to PDF',ebook:'Convert EPUB to PDF'
 };
 return labels[id]??tools.find(tool=>tool.id===id)?.name??'Create result';
}
