'use client';
import {useRef,useState,type SetStateAction} from 'react';
import type {Loaded,PageItem,Mark} from './pdf-engine';
import {WorkspaceHistory} from './workspace-history';
export type DocumentState={files:Loaded[];pages:PageItem[];marks:Mark[]};
const empty=():DocumentState=>({files:[],pages:[],marks:[]});
export function useWorkspace(){
  const history=useRef(new WorkspaceHistory(empty()));
  const [snapshot,render]=useState(()=>({state:empty(),canUndo:false,canRedo:false}));
  const publish=()=>render({state:history.current.current,canUndo:history.current.past.length>0,canRedo:history.current.future.length>0});
  function change<K extends keyof DocumentState>(key:K,next:SetStateAction<DocumentState[K]>){
    const previous=history.current.current;
    const value=typeof next==='function'?(next as (v:DocumentState[K])=>DocumentState[K])(previous[key]):next;
    history.current.set({...previous,[key]:value},key);publish();
  }
  return {...snapshot.state,getFiles:()=>history.current.current.files,setFiles:(v:SetStateAction<Loaded[]>)=>change('files',v),setPages:(v:SetStateAction<PageItem[]>)=>change('pages',v),setMarks:(v:SetStateAction<Mark[]>)=>change('marks',v),
    undo:()=>{history.current.undo();publish();},redo:()=>{history.current.redo();publish();},canUndo:snapshot.canUndo,canRedo:snapshot.canRedo,
    replace:(v:DocumentState)=>{history.current.set(v);publish();},
    clear:()=>{history.current.reset(empty());publish();}};
}
// Explicit save only. No credentials or tool options are persisted.
export async function draft(action:'get'|'save'|'delete',state?:DocumentState):Promise<DocumentState|undefined>{
  const db=await new Promise<IDBDatabase>((resolve,reject)=>{const r=indexedDB.open('openpdf-draft',1);r.onupgradeneeded=()=>r.result.createObjectStore('draft');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});
  try{return await new Promise((resolve,reject)=>{const tx=db.transaction('draft',action==='get'?'readonly':'readwrite'),store=tx.objectStore('draft');let value:DocumentState|undefined;
    if(action==='save'&&state)store.put({...state,files:state.files.map(file=>({id:file.id,name:file.name,bytes:file.bytes,size:file.size,pages:file.pages,image:file.image}))},'workspace');
    else if(action==='delete')store.delete('workspace');
    else {const r=store.get('workspace');r.onsuccess=()=>value=r.result;}
    tx.oncomplete=()=>resolve(value);tx.onerror=tx.onabort=()=>reject(tx.error);
  });}finally{db.close();}
}

