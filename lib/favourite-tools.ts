const KEY='pdf-studio-favourites';

/** Tools the user starred. Stored only in this browser's local storage. */
export function getFavourites():string[]{
 try{const v=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(v)?v.filter((x):x is string=>typeof x==='string'):[];}catch{return [];}
}
export function isFavourite(id:string):boolean{return getFavourites().includes(id);}
export function toggleFavourite(id:string):string[]{
 const current=getFavourites();
 const next=current.includes(id)?current.filter(x=>x!==id):[id,...current].slice(0,12);
 try{localStorage.setItem(KEY,JSON.stringify(next));}catch{/* storage blocked: lasts for this visit */}
 return next;
}
