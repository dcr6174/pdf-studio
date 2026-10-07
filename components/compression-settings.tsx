'use client';
import type {Options} from '../lib/pdf-engine';

export function CompressionSettings({options,onChange}:{options:Options;onChange:(update:(current:Options)=>Options)=>void}) {
 const raster=['small','balanced','high'].includes(options.quality);
 return <section className="compression-settings" aria-label="Compression settings">
  <label className="field"><span>Compression method</span><select value={raster?'small':options.quality} onChange={e=>onChange(o=>({...o,quality:e.target.value}))}>
   <option value="images">Optimize images · keep text and forms</option>
   <option value="compact">Repack PDF · keep image quality</option>
   <option value="small">Rebuild as images · smaller file</option>
  </select></label>
  {options.quality==='images'&&<fieldset className="compression-presets"><legend>Image quality</legend>{[{name:'Clear',quality:.86,size:3000},{name:'Balanced',quality:.72,size:2400},{name:'Compact',quality:.5,size:1600}].map(p=><button type="button" key={p.name} className="secondary" aria-pressed={(options.compressJPEG??.72)===p.quality} onClick={()=>onChange(o=>({...o,compressJPEG:p.quality,compressMaxDimension:p.size}))}>{p.name}</button>)}<small>Only supported JPEG images change. Check fine print and image detail.</small></fieldset>}
  <label className="field"><span>Target size (KB, optional)</span><input type="number" min="1" step="1" inputMode="numeric" value={options.compressTarget??''} onChange={e=>onChange(o=>({...o,compressTarget:e.target.value}))} placeholder="No size limit" aria-describedby="compression-size-help"/><small id="compression-size-help">Best effort. Check the final size and readability.</small></label>
  {raster&&<p className="compression-warning" role="status">Page-image output removes searchable text, links and editable fields.</p>}
  <details className="settings-help"><summary>How compression works</summary><p>Recommended reduces supported JPEG images while keeping text, links and editable fields.</p><p>Targets are best effort. Some documents need a larger limit to remain readable. Check the exported PDF before sharing.</p><p>If compression makes the file larger, the original is retained.</p></details>
 </section>;
}
