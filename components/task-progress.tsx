'use client';
import {useEffect,useState} from 'react';
import {LiquidProgress} from '@/components/liquid-progress';
import {workflowChoices} from '@/lib/workflow-recipes';
import {taskProgressLabel} from '@/lib/task-progress-label';
import './task-progress.css';
export function TaskProgress({tool,progress,onStop,steps=[],detail}:{detail?:string;tool:string;progress:number;onStop:()=>void;steps?:string[]}){
 const [started]=useState(()=>Date.now()),[elapsed,setElapsed]=useState(0);
 useEffect(()=>{const timer=setInterval(()=>setElapsed((Date.now()-started)/1000),1000);return()=>clearInterval(timer);},[started]);
 const left=progress>5&&progress<90&&elapsed>5?Math.max(1,Math.round(elapsed*(100-progress)/progress)):null;
 const measured=progress>0;
 const current=Math.max(0,Math.min(steps.length-1,Math.floor(Math.max(0,Math.min(100,progress))*steps.length/100)));
 const name=workflowChoices.find(([id])=>id===steps[current])?.[1]??'Applying your changes';
 return <section className="task-progress-screen" aria-label="Document processing"><LiquidProgress value={measured?progress:undefined}/><div role="status" aria-live="polite"><h1>{tool==='workflow'?'Running your workflow':taskProgressLabel(tool)}</h1>{tool==='workflow'&&steps.length>0&&<p className="workflow-progress-step">{progress>=100?'Finishing your PDF…':`Step ${current+1} of ${steps.length} · ${name}`}</p>}{detail&&<p className="processing-detail">{detail}</p>}<p className="task-progress-eta" aria-hidden={left===null}>{left!==null?<>About {left<60?`${left} seconds`:`${Math.ceil(left/60)} minutes`} remaining (estimate)</>:'\u00a0'}</p><p>Your files stay on this device. Please keep this page open.</p></div><button type="button" className="secondary" onClick={onStop}>Stop processing</button><small>Your originals are retained. Processing stops at the next safe step.</small></section>;
}
