import type {PageItem} from './pdf-engine';
/** Group retained pages by the explicitly chosen file order; retain each file's page edits. */
export function orderMergePages(pages:PageItem[],fileIds:string[]):PageItem[]{
 const rank=new Map(fileIds.map((id,i)=>[id,i]));
 return [...pages].sort((a,b)=>(rank.get(a.fileId)??fileIds.length)-(rank.get(b.fileId)??fileIds.length));
}
