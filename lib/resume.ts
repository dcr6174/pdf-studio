/** A saved draft is only worth offering when there is something to get back: at least one file and one page. */
export type DraftLike={files?:{name:string}[];pages?:unknown[]}|null|undefined;
export type Recoverable={names:string[];pages:number};
export function recoverableDraft(d:DraftLike):Recoverable|null{
 if(!d||!Array.isArray(d.files)||d.files.length===0)return null;
 const pages=Array.isArray(d.pages)?d.pages.length:0;
 if(pages===0)return null;
 return {names:d.files.map(f=>String(f.name)),pages};
}
