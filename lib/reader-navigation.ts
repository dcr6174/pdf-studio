import type {PDFDocumentProxy} from 'pdfjs-dist';

export type ReaderOutline={id:string;title:string;page?:number;children:ReaderOutline[]};

/** Resolve local destinations only; remote URLs and actions are never executed. */
export async function loadReaderOutline(document:PDFDocumentProxy):Promise<ReaderOutline[]>{
 const rows=await document.getOutline();let remaining=5000;
 const walk=async(items:NonNullable<typeof rows>,prefix='',depth=0):Promise<ReaderOutline[]>=>{
  if(depth>32)return [];
  const result:ReaderOutline[]=[];
  for(let i=0;i<items.length&&remaining>0;i++){
   remaining--;const item=items[i],id=prefix+i;let page:number|undefined;
   try{const dest=typeof item.dest==='string'?await document.getDestination(item.dest):item.dest;
    if(Array.isArray(dest)){const index=typeof dest[0]==='number'?dest[0]:await document.getPageIndex(dest[0]);if(Number.isInteger(index)&&index>=0&&index<document.numPages)page=index+1;}
   }catch{/* Keep the heading and its children when a destination cannot be resolved. */}
   result.push({id,title:item.title||'Untitled bookmark',page,children:await walk(item.items??[],id+'.',depth+1)});
  }
  return result;
 };
 return walk(rows??[]);
}

/** Retain ancestors for context; matching a parent retains its whole chapter. */
export function filterReaderOutline(rows:ReaderOutline[],query:string):ReaderOutline[]{
 const needle=query.trim().toLocaleLowerCase();if(!needle)return rows;
 return rows.flatMap(row=>{if(row.title.toLocaleLowerCase().includes(needle))return [row];const children=filterReaderOutline(row.children,needle);return children.length?[{...row,children}]:[];});
}

export function readerPageLabel(page:number,labels:readonly string[]):string{
 const label=labels[page-1];return label&&label!==String(page)?`${label} · Page ${page}`:`Page ${page}`;
}
