'use client';
import {compressionPresets} from '@/lib/compression-presets';
/** Existing task settings surfaced in the compact toolbar; no processing logic. */
export function MobileToolPrimaryControls({tool,quality,range,onQuality,onRange,disabled}:{tool:string;quality:string;range:string;onQuality:(value:string)=>void;onRange:(value:string)=>void;disabled:boolean}){
 if(tool==='compress')return <select className="mobile-toolbar-choice" aria-label="Compression level" title="Compression level" disabled={disabled} value={compressionPresets.some(p=>p.value===quality)?quality:'images'} onChange={e=>onQuality(e.target.value)}>{compressionPresets.map(p=><option key={p.value} value={p.value}>{p.name}</option>)}</select>;
 if(tool==='split')return <input className="mobile-toolbar-range" aria-label="Pages to extract" title="Pages to extract" placeholder="Pages: 1, 3-5" disabled={disabled} value={range} onChange={e=>onRange(e.target.value)}/>;
 if(['jpg','png','webp'].includes(tool))return <select className="mobile-toolbar-choice" aria-label="Image resolution" title="Image resolution" disabled={disabled} value={quality} onChange={e=>onQuality(e.target.value)}><option value="1">72 DPI · screen</option><option value="2">144 DPI · standard</option><option value="4.1666667">300 DPI · print</option></select>;
 return null;
}
