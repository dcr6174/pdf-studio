/** Hands one file from the homepage to the tool page that opens next. Stored only in this browser (IndexedDB), used once, expires after three minutes. */
const DB='pdf-studio-handoff',STORE='f',KEY='next',FLAG='pdf-studio.handoff',TTL=3*60*1000;
function open():Promise<IDBDatabase>{return new Promise((res,rej)=>{const r=indexedDB.open(DB,1);r.onupgradeneeded=()=>r.result.createObjectStore(STORE);r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error);});}
export async function putHandoff(file:File){
 const db=await open();
 await new Promise<void>((res,rej)=>{const tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).put({file,at:Date.now()},KEY);tx.oncomplete=()=>res();tx.onerror=()=>rej(tx.error);});
 db.close();try{sessionStorage.setItem(FLAG,String(Date.now()));}catch{/* private mode */}
}
export function hasHandoff(){try{const t=Number(sessionStorage.getItem(FLAG));return !!t&&Date.now()-t<TTL;}catch{return false;}}
export async function takeHandoff():Promise<File|null>{
 try{sessionStorage.removeItem(FLAG);}catch{/* ignore */}
 const db=await open();
 const row=await new Promise<{file:File;at:number}|undefined>((res,rej)=>{const tx=db.transaction(STORE,'readwrite'),s=tx.objectStore(STORE),g=s.get(KEY);g.onsuccess=()=>{s.delete(KEY);res(g.result);};g.onerror=()=>rej(g.error);});
 db.close();
 return row&&Date.now()-row.at<TTL?row.file:null;
}
