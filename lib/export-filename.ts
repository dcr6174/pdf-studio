import {tools} from '@/lib/tools';
const labels:Record<string,string>={merge:'Merged',sign:'Signed',edit:'Edited', 'native-text':'Edited',compress:'Compressed',rotate:'Rotated',split:'Split pages','split-all':'Split pages',encrypt:'Protected',decrypt:'Unlocked',organize:'Organized',workflow:'Workflow',form:'Filled',create:'Created',markdown:'Markdown to PDF',images:'Images to PDF',scan:'Scanned',watermark:'Watermarked',numbers:'Page numbers',clean:'Cleaned',zip:'Documents'};
function clean(value:string){return value.replace(/[<>:"/\\|?*\u0000-\u001f]/g,' ').replace(/\s+/g,' ').trim().replace(/[. ]+$/,'')||'Export';}
function extension(name:string){return /\.([a-z\d]{1,12})$/i.exec(name)?.[1].toLowerCase()??'pdf';}
function sourceStem(name:string){return clean(name.replace(/\.[^.]+$/,'').replace(/ - pdf-studio\.in - .*$/i,'').replace(/^pdf-studio\.in - /i,'').replace(/^pdf[-_]studio[-_]?/i,'')).slice(0,120);}
function suffix(value:string){return clean(value).toLowerCase().replace(/[^\p{L}\p{N}]+/gu,'-').replace(/^-+|-+$/g,'')||'export';}
export function exportFilename(action:string,previousName:string,detail='',sourceName=previousName){
 const label=labels[action]??tools.find(tool=>tool.id===action)?.name??action.replace(/[-_]+/g,' ');
 let stem=sourceStem(sourceName);
 // Replacing an action on an already exported file must not stack suffixes.
 const known=[...Object.values(labels),...tools.map(t=>t.name)].map(suffix).sort((a,b)=>b.length-a.length);
 for(const ending of arguments.length<4?known:[]){if(stem.toLowerCase().endsWith('-'+ending)){stem=stem.slice(0,-ending.length-1);break;}}
 return stem+'-'+suffix(label).slice(0,60)+(detail?'-'+suffix(detail).slice(0,32):'')+'.'+extension(previousName);
}
export function brandDownloadName(name:string){
 const legacy=/^(.*?) - pdf-studio\.in - (.*)\.([a-z\d]{1,12})$/i.exec(name);
 if(legacy)return sourceStem(legacy[1]+'.pdf')+'-'+suffix(legacy[2])+'.'+legacy[3].toLowerCase();
 return sourceStem(name)+'.'+extension(name);
}
