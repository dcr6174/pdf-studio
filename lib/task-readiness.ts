import type {Options} from './pdf-engine';
import {workflowOperations,workflowSettings,workflowStepIssue} from './workflow-recipes';
/** Shared by the action button and the processing entry point. */
export function taskInputIssue(id:string,fileCount:number,o:Pick<Options,'text'|'recipe'|'workflowSteps'|'workflowDisabled'> & Partial<Options>,batch=false,pageCount=0):string {
 if(['create','markdown'].includes(id)&&!o.text.trim())return 'Type some text first.';
 if(id==='create-form'&&!o.text.trim())return 'Add at least one field label, one per line.';
 if(id==='bookmarks'&&!o.text.trim())return 'Add at least one bookmark with its page number.';
 if(id==='merge'&&fileCount<2)return fileCount?'Add a second PDF to merge.':'Add at least two PDFs to merge.';
 if(id==='encrypt'){
  if((o.password??'').length<8)return 'Use a password of at least 8 characters.';
  if(o.passwordConfirm!==undefined&&o.passwordConfirm!==o.password)return 'Confirm the same password in both fields.';
 }
 if(id==='workflow'){
  const names=o.recipe==='custom'?(o.workflowSteps??[]):o.recipe==='rotate-compact'?['rotate','compress']:o.recipe==='metadata-compact'||o.recipe==='share-ready'?['clean','compress']:o.recipe==='clean-scan'?['ocr']:o.recipe==='email-ready'?['compress']:o.recipe==='print-ready'?['resize']:['merge','compress'];
  const enabled=names.map((name,i)=>({name,index:i})).filter(s=>o.recipe!=='custom'||!o.workflowDisabled?.includes(s.index));
  if(!enabled.length)return 'Add at least one enabled workflow step.';
  if(names.length>8)return 'Use at most eight workflow steps.';
  let count=pageCount;
  for(let n=0;n<enabled.length;n++){
   const {name,index}=enabled[n];if(!workflowOperations.includes(name as typeof workflowOperations[number])&&name!=='ocr')return 'Choose a supported workflow step.';
   if(name==='merge'&&batch)return 'Merge needs One document mode.';
   try{const settings=workflowSettings(name,o.recipe==='custom'?o.workflowSettings?.[index]:undefined),issue=workflowStepIssue(name,settings,count,fileCount,n);if(issue)return `Step ${index+1}: ${issue}`;
    if(name==='duplicate')count*=2;if(name==='blank')count++;if(name==='remove'&&count){const removed=new Set<number>();for(const part of (settings.range??'').split(',')){const [a,b]=part.split('-').map(Number);for(let i=a;i<=(b||a);i++)removed.add(i);}count-=removed.size;}if(count>400)return `Step ${index+1} would exceed the 400-page limit.`;
   }catch(e){return `Step ${index+1}: ${(e as Error).message}`;}
  }
 }
 return '';
}
