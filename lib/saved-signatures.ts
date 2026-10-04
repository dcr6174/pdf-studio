export type SavedSignature={id:string;image:string;createdAt:number};
export function validSignatureImage(image:unknown):image is string{return typeof image==='string'&&image.length<=1500000&&/^data:image\/png;base64,[A-Za-z0-9+/]+=*$/.test(image);}
export async function savedSignatures(action:'list'|'save'|'delete',value?:string):Promise<SavedSignature[]>{
 const db=await new Promise<IDBDatabase>((resolve,reject)=>{const req=indexedDB.open('pdf-studio-signatures',1);req.onupgradeneeded=()=>req.result.createObjectStore('signatures',{keyPath:'id'});req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(Error('Signature storage is unavailable.'));});
 try{
 return await new Promise((resolve,reject)=>{const tx=db.transaction('signatures',action==='list'?'readonly':'readwrite'),store=tx.objectStore('signatures');let rows:SavedSignature[]=[];
 const all=store.getAll();all.onsuccess=()=>{rows=(all.result as SavedSignature[]).filter(r=>validSignatureImage(r.image));if(action==='save'){if(!validSignatureImage(value)){tx.abort();return;}if(rows.length>=5){tx.abort();return;}const row={id:crypto.randomUUID(),image:value,createdAt:Date.now()};store.put(row);rows.push(row);}else if(action==='delete'&&value){store.delete(value);rows=rows.filter(r=>r.id!==value);}};
 tx.oncomplete=()=>resolve(rows.sort((a,b)=>b.createdAt-a.createdAt));tx.onerror=tx.onabort=()=>reject(Error('Could not save changes. Keep up to five signatures; large images may need resizing.'));
 });
 }finally{db.close();}
}
