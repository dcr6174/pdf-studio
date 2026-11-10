import {PDFDocument} from 'pdf-lib';
import type {Values} from './types';
/** Open a PDF for editing; protected files get a clear instruction instead of a stack trace. */
export async function openPdf(bytes:Uint8Array){
 try{return await PDFDocument.load(bytes,{updateMetadata:false});}
 catch(e){
  const message=e instanceof Error?e.message:'';
  if(/encrypt/i.test(message))throw new Error('This PDF is password protected. Use Remove password first, then open the unlocked copy here.');
  throw new Error('This file could not be read as a PDF. Try Repair readable PDF first.');
 }
}
export function pdfResult(bytes:Uint8Array,report?:string){return {blob:new Blob([bytes.slice().buffer as ArrayBuffer],{type:'application/pdf'}),ext:'pdf',report};}
export function textResult(text:string,ext='txt',type='text/plain',report?:string){return {blob:new Blob([text],{type:type+';charset=utf-8'}),ext,report:report??text.slice(0,4000)};}
export const num=(v:Values,key:string)=>Number(v[key]);
export function inRange(value:number,min:number,max:number,label:string){if(!Number.isFinite(value)||value<min||value>max)throw new Error(`${label} must be between ${min} and ${max}.`);return value;}
/** Parse "1, 3-5" into zero-based page indexes. Empty text means every page. */
export function pageList(spec:string,count:number){
 if(!spec.trim())return Array.from({length:count},(_,i)=>i);
 const out:number[]=[];
 for(const token of spec.split(',')){
  const m=token.trim().match(/^(\d+)(?:\s*-\s*(\d+))?$/);
  if(!m)throw new Error('Use page numbers such as 1, 3-5.');
  const a=Number(m[1]),b=m[2]?Number(m[2]):a;
  if(a<1||b<a||b>count)throw new Error(`Page numbers must be between 1 and ${count}.`);
  for(let n=a;n<=b;n++)out.push(n-1);
 }
 return [...new Set(out)];
}
export function hexColor(hex:string){const m=/^#?([0-9a-f]{6})$/i.exec(hex);if(!m)return {r:0,g:0,b:0};const n=parseInt(m[1],16);return {r:(n>>16&255)/255,g:(n>>8&255)/255,b:(n&255)/255};}
export function stem(name:string){return name.replace(/\.[^.]+$/,'');}
export const MM=72/25.4;
export const PAGE_SIZES:Record<string,[number,number]>={a4:[595.28,841.89],letter:[612,792],legal:[612,1008],a3:[841.89,1190.55],a5:[419.53,595.28]};
