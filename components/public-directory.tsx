import Link from '@/components/browser-link';
import {canonicalPublicPath} from '@/lib/canonical-routes';
import './public-directory.css';

/** Real HTML links keep filtered and interactive catalogues fully discoverable. */
export function PublicDirectory({title,entries}:{title:string;entries:{path:string;title:string}[]}){
 const unique=[...new Map(entries.map(entry=>{
  const path=canonicalPublicPath(entry.path);
  return [path,{...entry,path}] as const;
 })).values()].sort((a,b)=>a.title.localeCompare(b.title,'en'));
 return <details className="public-directory">
  <summary>{title} ({unique.length})</summary>
  <nav aria-label={title}><ul>{unique.map(entry=><li key={entry.path}><Link href={entry.path}>{entry.title}</Link></li>)}</ul></nav>
 </details>;
}
