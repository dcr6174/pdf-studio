import {Loader2} from 'lucide-react';
import {Progress} from '@/components/ui/progress';
import {taskProgressLabel} from '@/lib/task-progress-label';
import './task-progress.css';
export function TaskProgress({tool,progress,onStop}:{tool:string;progress:number;onStop:()=>void}){
 const measured=progress>0&&progress<100;
 return <section className="task-progress-screen" aria-label="Document processing"><div className="task-progress-art" aria-hidden="true"><span>PDF</span><Loader2 className="spin" size={28}/></div><div role="status" aria-live="polite"><h1>{taskProgressLabel(tool)}</h1><p>Your files stay on this device. Please keep this page open.</p></div>{measured?<div className="task-progress-meter"><Progress value={progress} aria-label="Processing progress"/><span>{Math.round(progress)}%</span></div>:<div className="task-progress-track" aria-hidden="true"><span/></div>}<button type="button" className="secondary" onClick={onStop}>Stop processing</button><small>Your originals are retained. Processing stops at the next safe step.</small></section>;
}
