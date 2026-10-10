'use client';
import {useEffect,useState} from 'react';
import type {Loaded,Options} from '@/lib/pdf-client';

export function SpreadsheetSheets({file,options,onChange}:{file?:Loaded;options:Options;onChange:(o:Options|((prev:Options)=>Options))=>void}){
 const [state,setState]=useState<{id:string;names:string[];error?:string}>();
 useEffect(()=>{if(!file)return;let active=true;onChange(prev=>({...prev,sheetNames:undefined}));import('xlsx').then(x=>{const names=x.read(file.bytes,{bookSheets:true}).SheetNames;if(active)setState({id:file.id,names});}).catch(()=>{if(active)setState({id:file.id,names:[],error:'Could not read sheet names. Choose a readable XLSX, XLS or CSV.'});});return()=>{active=false;};},[file,onChange]);
 if(!file)return null;
 if(state?.id!==file.id)return <p role="status">Reading spreadsheet sheets…</p>;
 if(state.error)return <p role="alert">{state.error}</p>;
 const selected=options.sheetNames??state.names;
 return <fieldset className="sheet-selection"><legend>Sheets to include</legend>{state.names.map(name=><label key={name}><input type="checkbox" checked={selected.includes(name)} onChange={e=>onChange(prev=>{const current=prev.sheetNames??state.names;return {...prev,sheetNames:e.target.checked?[...current,name]:current.filter(n=>n!==name)};})}/>{name}</label>)}<p className="muted">{selected.length} of {state.names.length} sheets selected. Export uses text rows; charts, images and original styling are not included.</p></fieldset>;
}
