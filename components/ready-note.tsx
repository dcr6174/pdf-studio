import Image from '@/components/browser-image';

/** "Your PDF" for PDFs, otherwise the closest plain word. */
export function readyNoun(name:string){
 const ext=(name.split('.').pop()||'').toLowerCase();
 return ({pdf:'PDF',zip:'ZIP file',docx:'Word document',xlsx:'spreadsheet',pptx:'presentation',csv:'CSV file',txt:'text file',html:'HTML file',epub:'EPUB',jpg:'image',jpeg:'image',png:'image',wav:'audio file',md:'text file'} as Record<string,string>)[ext]??'file';
}

/** Small, one-time celebration after an export. Download stays the strongest action next to it. */
export function ReadyNote({name,detail}:{name:string;detail:string}){
 return <>
  <span className="success-icon buddy-success"><Image unoptimized src="/brand/buddy/buddy-success.svg" alt="" width="52" height="52"/><i className="spark spark-a" aria-hidden="true"/><i className="spark spark-b" aria-hidden="true"/><i className="spark spark-c" aria-hidden="true"/></span>
  <div><h3 role="status">Nicely done. Your {readyNoun(name)} is ready.</h3><p>{detail}</p></div>
 </>;
}
