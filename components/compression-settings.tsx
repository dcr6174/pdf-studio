'use client';
import {useState} from 'react';
import type {Options} from '../lib/pdf-engine';

export function CompressionSettings({options,onChange}:{options:Options;onChange:(update:(current:Options)=>Options)=>void}) {
 const target=options.compressTarget?.trim()??'';
 const [custom,setCustom]=useState(!!target&&!['100','200'].includes(target));
 const preset=custom?'custom':['100','200'].includes(target)?target:target?'custom':'none';
 const raster=['small','balanced','high'].includes(options.quality);
 return <section className="compression-settings" aria-label="Compression settings">
  <label className="field"><span>Compression method</span><select value={options.quality} onChange={e=>onChange(o=>({...o,quality:e.target.value}))}>
   <option value="images">Recommended · keep text and forms</option>
   <option value="compact">Light · preserve image quality</option>
   <option value="small">Strong · convert pages to images</option>
   <option value="balanced">Balanced · convert pages to images</option>
   <option value="high">High quality · convert pages to images</option>
  </select></label>
  <label className="field"><span>Upload size limit</span><select value={preset} onChange={e=>{const value=e.target.value;setCustom(value==='custom');onChange(o=>({...o,compressTarget:['100','200'].includes(value)?value:'',...(['100','200'].includes(value)?{quality:'images'}:{})}));}} aria-describedby="compression-size-help">
   <option value="none">No target size</option>
   <optgroup label="CV upload limits"><option value="100">Below 100 KB</option><option value="200">Below 200 KB</option></optgroup>
   <option value="custom">Custom limit…</option>
  </select><small id="compression-size-help">Best effort. The result shows whether your limit was reached.</small></label>
  {preset==='custom'&&<label className="field"><span>Custom limit (KB)</span><input type="number" min="1" step="1" inputMode="numeric" value={options.compressTarget??''} onChange={e=>onChange(o=>({...o,compressTarget:e.target.value}))} placeholder="e.g. 150"/></label>}
  {raster&&<p className="compression-warning" role="status">Page-image output removes searchable text, links and editable fields.</p>}
  <details className="settings-help"><summary>How compression works</summary><p>Recommended reduces supported JPEG images while keeping text, links and editable fields.</p><p>Targets are best effort. Some documents need a larger limit to remain readable. Check the exported PDF before sharing.</p><p>If compression makes the file larger, the original is retained.</p></details>
 </section>;
}
