'use client';
import {splitGroups} from '@/lib/page-layout';
export function SplitPlan({range,count}:{range:string;count:number}){
 if(!range.trim())return null;let groups:number[][];try{groups=splitGroups(range,count);}catch{groups=[];}if(!groups.length)return <p className="muted">Review your groups before exporting. Use semicolons between PDFs.</p>;return <details className="split-plan"><summary>{groups.length} {groups.length===1?'PDF':'PDFs'} in the ZIP · review filenames and pages</summary><ol>{groups.map((pages,i)=><li key={i}><b>group-{i+1}.pdf</b> · {pages.length} {pages.length===1?'page':'pages'}: {pages.map(n=>n+1).join(', ')}</li>)}</ol></details>;
}
