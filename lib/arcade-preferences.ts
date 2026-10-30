/** Device-local settings only; existing game progress remains in its own stores. */
export type SavedPreferences=Record<string,string|boolean>;
export function parsePreferences(raw:string|null):SavedPreferences {
 try {const value:unknown=JSON.parse(raw??'{}');if(!value||typeof value!=='object'||Array.isArray(value))return {};return Object.fromEntries(Object.entries(value).filter(([k,v])=>k.length<100&&(typeof v==='boolean'||typeof v==='string'&&v.length<80)));}catch{return {};}
}
export function recentSlugs(raw:string|null):string[] {
 try {const value:unknown=JSON.parse(raw??'[]');return Array.isArray(value)?[...new Set(value.filter((v):v is string=>typeof v==='string'&&/^[a-z0-9-]{1,80}$/.test(v)))].slice(0,5):[];}catch{return [];}
}
export function rememberGame(storage:Pick<Storage,'getItem'|'setItem'>,slug:string) {
 try{storage.setItem('studio-arcade:recent',JSON.stringify([slug,...recentSlugs(storage.getItem('studio-arcade:recent')).filter(v=>v!==slug)].slice(0,5)));}catch{/* Optional browser storage. */}
}
export function validSelect(value:unknown,options:readonly string[]):value is string{return typeof value==='string'&&options.includes(value);}
