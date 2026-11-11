import {tools} from '@/lib/tools';
const prefix='pdf-studio.in - ';
const labels:Record<string,string>={merge:'Merged',sign:'Signed',edit:'Edited', 'native-text':'Edited',compress:'Compressed',rotate:'Rotated',split:'Split pages','split-all':'Split pages',encrypt:'Protected',decrypt:'Unlocked',organize:'Organized',workflow:'Workflow',form:'Filled',create:'Created',markdown:'Markdown to PDF',images:'Images to PDF',scan:'Scanned',watermark:'Watermarked',numbers:'Page numbers',clean:'Cleaned',zip:'Documents'};
function clean(value:string){return value.replace(/[<>:"/\\|?*\u0000-\u001f]/g,' ').replace(/\s+/g,' ').trim().replace(/[. ]+$/,'')||'Export';}
function extension(name:string){return /\.([a-z\d]{1,12})$/i.exec(name)?.[1].toLowerCase()??'pdf';}
function sourceStem(name:string){return clean(name.replace(/\.[^.]+$/,'').replace(/ - pdf-studio\.in - .*$/i,'').replace(/^pdf-studio\.in - /i,'').replace(/^pdf[-_]studio[-_]?/i,'')).slice(0,120);}
export function exportFilename(action:string,previousName:string,detail='',sourceName=previousName){
 const label=labels[action]??tools.find(tool=>tool.id===action)?.name??action.replace(/[-_]+/g,' ');
 return sourceStem(sourceName)+' - '+prefix+clean(label).slice(0,60)+(detail?' - '+clean(detail).slice(0,32):'')+'.'+extension(previousName);
}
export function brandDownloadName(name:string){
 if(/ - pdf-studio\.in - /i.test(name))return clean(name.replace(/\.[^.]+$/,''))+'.'+extension(name);
 const action=/^pdf[-_]studio[-_]/i.test(name)?sourceStem(name).replace(/[-_]+/g,' '):'Export';
 return exportFilename(action.charAt(0).toUpperCase()+action.slice(1),name);
}
