'use client';
import {useEffect,useState} from 'react';
import {compressDocument} from '../lib/compress-document';
import type {Options} from '../lib/pdf-engine';
import './compression-settings.css';
const presets=[{value:'compact',name:'Keep quality',hint:'Lossless repacking. Original image quality.'},{value:'images',name:'Balanced',hint:'Smaller images. Text stays selectable.'},{value:'image-small',name:'Smaller file',hint:'Stronger image reduction. Check fine print.'}];
export function CompressionSettings({options,onChange,source,originalSize}:{source?:Uint8Array;originalSize?:number;options:Options;onChange:(update:(current:Options)=>Options)=>void}){
 const selected=presets.some(p=>p.value===options.quality)?options.quality:'images';
 const [estimate,setEstimate]=useState<{key:string;size:number;source:Uint8Array}|undefined>();
 const estimateKey=selected+':'+(options.compressJPEG??'')+':'+(options.compressMaxDimension??'');
 useEffect(()=>{if(!source||source.length>20*1024*1024||options.compressTarget)return;const controller=new AbortController();const timeout=setTimeout(()=>{void compressDocument(source,selected,options.compressJPEG,options.compressMaxDimension,controller.signal).then(result=>{if(!controller.signal.aborted)setEstimate({key:estimateKey,size:result.bytes.length,source});}).catch(()=>{});},450);return()=>{clearTimeout(timeout);controller.abort();};},[source,selected,options.compressJPEG,options.compressMaxDimension,options.compressTarget,estimateKey]);
 const size=estimate?.key===estimateKey&&estimate.source===source?estimate.size:undefined;
 return <section className="compression-settings" aria-label="Compression settings">
  <fieldset className="compression-levels"><legend>Compression level</legend>{presets.map(p=><label key={p.value} className={'compression-level'+(selected===p.value?' is-selected':'')}><input type="radio" name="compression-level" value={p.value} checked={selected===p.value} onChange={()=>onChange(o=>({...o,quality:p.value,compressJPEG:undefined,compressMaxDimension:undefined}))}/><span><b>{p.name}{p.value==='images'&&<small>Recommended</small>}</b><span>{p.hint}</span></span></label>)}</fieldset>
  <details className="compression-more"><summary>Optional size limit</summary><label className="field"><span>Keep below (KB)</span><input type="number" min="1" step="1" inputMode="numeric" value={options.compressTarget??''} onChange={e=>onChange(o=>({...o,compressTarget:e.target.value}))} placeholder="For example, 200"/><small>Best effort. Try Smaller file for a strict limit.</small></label></details>
  {!!originalSize&&<div className="compression-size-panel" role="status"><span>{size!==undefined&&!options.compressTarget?'Expected file size':'Original file size'}</span><b>{((size??originalSize)/1000).toFixed(1)} KB {size!==undefined&&!options.compressTarget&&<><s>{(originalSize/1000).toFixed(1)} KB</s><small>{Math.round((1-size/originalSize)*100)}% smaller</small></>}</b>{size!==undefined&&!options.compressTarget?<progress value={Math.max(.01,1-size/originalSize)} max="1"/>:<small>{source&&source.length<=20*1024*1024&&!options.compressTarget?'Checking this level…':'Final size is checked after compression.'}</small>}</div>}
  <p className="compression-retained">Text, links and forms stay intact.</p>

 </section>;
}
