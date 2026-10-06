'use client';
import {useRef,useState,type SetStateAction} from 'react';
import type {Loaded,PageItem,Mark} from './pdf-engine';
import {WorkspaceHistory} from './workspace-history';
export type DocumentState={files:Loaded[];pages:PageItem[];marks:Mark[]};
const empty=():DocumentState=>({files:[],pages:[],marks:[]});
export function useWorkspace(){
  const history=useRef(new WorkspaceHistory(empty()));
  const [snapshot,render]=useState(()=>({state:empty(),canUndo:false,canRedo:false,versions:['Original'],versionIndex:0}));
  const publish=()=>render({state:history.current.current,canUndo:history.current.past.length>0,canRedo:history.current.future.length>0,versions:[...history.current.pastLabels,history.current.label,...history.current.futureLabels.slice().reverse()],versionIndex:history.current.past.length});
  function change<K extends keyof DocumentState>(key:K,next:SetStateAction<DocumentState[K]>){
    const previous=history.current.current;
    const value=typeof next==='function'?(next as (v:DocumentState[K])=>DocumentState[K])(previous[key]):next;
    history.current.set({...previous,[key]:value},key,Date.now(),{files:'Files opened',pages:'Pages organized',marks:'Annotations edited'}[key]);publish();
  }
  return {...snapshot.state,getFiles:()=>history.current.current.files,getSnapshot:()=>history.current.current,setFiles:(v:SetStateAction<Loaded[]>)=>change('files',v),setPages:(v:SetStateAction<PageItem[]>)=>change('pages',v),setMarks:(v:SetStateAction<Mark[]>)=>change('marks',v),
    undo:()=>{history.current.undo();publish();},redo:()=>{history.current.redo();publish();},canUndo:snapshot.canUndo,canRedo:snapshot.canRedo,versions:snapshot.versions,versionIndex:snapshot.versionIndex,restoreVersion:(index:number)=>{if(!Number.isInteger(index)||index<0||index>=snapshot.versions.length)return;while(history.current.past.length>index)history.current.undo();while(history.current.past.length<index)history.current.redo();publish();},
    replace:(v:DocumentState,label='Document replaced')=>{history.current.set(v,'',Date.now(),label);publish();},
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


