'use client';
import type {Options} from '../lib/pdf-engine';

export function CompressionSettings({options,onChange}:{options:Options;onChange:(update:(current:Options)=>Options)=>void}) {
 const raster=['small','balanced','high'].includes(options.quality);
 return <section className="compression-settings" aria-label="Compression settings">
  <label className="field"><span>Compression method</span><select value={raster?'small':options.quality} onChange={e=>onChange(o=>({...o,quality:e.target.value}))}>
   <option value="images">Recommended · keep text and forms</option>
   <option value="compact">Light · preserve image quality</option>
   <option value="small">Smaller file · page images</option>
  </select></label>
  <label className="field"><span>Target size (KB, optional)</span><input type="number" min="1" step="1" inputMode="numeric" value={options.compressTarget??''} onChange={e=>onChange(o=>({...o,compressTarget:e.target.value}))} placeholder="No size limit" aria-describedby="compression-size-help"/><small id="compression-size-help">Best effort. Check the final size and readability.</small></label>
  {raster&&<p className="compression-warning" role="status">Page-image output removes searchable text, links and editable fields.</p>}
  <details className="settings-help"><summary>How compression works</summary><p>Recommended reduces supported JPEG images while keeping text, links and editable fields.</p><p>Targets are best effort. Some documents need a larger limit to remain readable. Check the exported PDF before sharing.</p><p>If compression makes the file larger, the original is retained.</p></details>
 </section>;
}
