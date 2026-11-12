'use client';
import {useState} from 'react';
import {SiteHeader} from '@/components/site-header';
import {EmbeddedHandwritingStudio as HandwritingStudio} from '@/components/handwriting-studio';
import {utilityTools,type UtilityMode} from '@/lib/lab-utilities';
import Link from '@/components/browser-link';
import '@/app/lab/utilities.css';
import '@/app/creative/creative.css';
export function LabUtility({mode}:{mode:UtilityMode}){
 const tool=utilityTools.find(t=>t.slug===mode)!;
 const [paper,setPaper]=useState<'handwriting-practice'|'notebook-maker'>('handwriting-practice');
 return <div className="creative-shell"><SiteHeader/><main className="lab-utility-main"><Link href="/lab/creative-studio">← Creative Studio</Link><header><h1>{tool.title}</h1><p>{tool.description}</p></header><div className="lab-utility-options">{(['handwriting-practice','notebook-maker'] as const).map(m=><button key={m} aria-pressed={paper===m} onClick={()=>{if(m!==paper&&window.confirm('Switch paper mode? Download any unsaved sheets first.'))setPaper(m)}}>{m==='handwriting-practice'?'Tracing practice':'Blank notebooks'}</button>)}</div><HandwritingStudio key={paper} mode={paper}/></main></div>;
}
