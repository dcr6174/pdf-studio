const KEY='pdf-studio-recent';
const MAX=6;
/** Tool ids you opened recently. Stored only in this browser's local storage. */
export function getRecent():string[]{
 try{const v=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(v)?v.filter((x):x is string=>typeof x==='string').slice(0,MAX):[];}catch{return [];}
}
export function addRecent(id:string):string[]{
 const next=[id,...getRecent().filter(x=>x!==id)].slice(0,MAX);
 try{localStorage.setItem(KEY,JSON.stringify(next));}catch{/* storage blocked: the list just lasts for this visit */}
 return next;
}
export function clearRecent(){try{localStorage.removeItem(KEY);}catch{/* ignore */}}
