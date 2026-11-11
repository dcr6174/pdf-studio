'use client';
import {useEffect,useState} from 'react';
import {Loader2,FileText,Layers,Check} from 'lucide-react';
import {Progress} from '@/components/ui/progress';
import {workflowChoices} from '@/lib/workflow-recipes';
import {taskProgressLabel} from '@/lib/task-progress-label';
import './task-progress.css';
export function TaskProgress({tool,progress,onStop,steps=[],detail}:{detail?:string;tool:string;progress:number;onStop:()=>void;steps?:string[]}){
 const [started]=useState(()=>Date.now()),[elapsed,setElapsed]=useState(0);
 useEffect(()=>{const timer=setInterval(()=>setElapsed((Date.now()-started)/1000),1000);return()=>clearInterval(timer);},[started]);
 const left=progress>5&&progress<90&&elapsed>5?Math.max(1,Math.round(elapsed*(100-progress)/progress)):null;
 const measured=progress>0&&progress<100;
 const current=Math.max(0,Math.min(steps.length-1,Math.floor(Math.max(0,Math.min(100,progress))*steps.length/100)));
 const name=workflowChoices.find(([id])=>id===steps[current])?.[1]??'Applying your changes';
 return <section className="task-progress-screen" aria-label="Document processing">{tool==='workflow'?<div className="workflow-progress-flow" aria-hidden="true"><span className="workflow-progress-file"><FileText size={28}/><small>PDF</small></span><span className="workflow-progress-connection"/><span className="workflow-progress-operation"><Layers size={30}/></span><span className="workflow-progress-connection"/><span className="workflow-progress-file workflow-progress-output"><FileText size={28}/><Check size={16}/></span></div>:<div className="task-progress-art" aria-hidden="true"><span>PDF</span><Loader2 className="spin" size={28}/></div>}<div role="status" aria-live="polite"><h1>{tool==='workflow'?'Running your workflow':taskProgressLabel(tool)}</h1>{tool==='workflow'&&steps.length>0&&<p className="workflow-progress-step">{progress>=100?'Finishing your PDF…':`Step ${current+1} of ${steps.length} · ${name}`}</p>}{detail&&<p className="processing-detail">{detail}</p>}{left!==null&&<p>About {left<60?`${left} seconds`:`${Math.ceil(left/60)} minutes`} remaining (estimate)</p>}<p>Your files stay on this device. Please keep this page open.</p></div>{measured?<div className="task-progress-meter"><Progress value={progress} aria-label="Processing progress"/><span>{Math.round(progress)}%</span></div>:<div className="task-progress-track" aria-hidden="true"><span/></div>}<button type="button" className="secondary" onClick={onStop}>Stop processing</button><small>Your originals are retained. Processing stops at the next safe step.</small></section>;
}
