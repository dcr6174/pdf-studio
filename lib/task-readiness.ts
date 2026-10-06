import type {Options} from './pdf-engine';

/** Shared by the visible action and processing entry point. Empty means ready. */
export function taskInputIssue(id:string,fileCount:number,o:Pick<Options,'text'|'recipe'|'workflowSteps'|'workflowDisabled'>,batch=false):string {
 if(['create','markdown'].includes(id)&&!o.text.trim())return 'Type some text first.';
 if(id==='create-form'&&!o.text.trim())return 'Add at least one field label, one per line.';
 if(id==='bookmarks'&&!o.text.trim())return 'Add at least one bookmark with its page number.';
 if(id==='merge'&&fileCount<2)return fileCount?'Add one more PDF to merge.':'Add at least two PDFs to merge.';
 if(id==='workflow'){
  const names=o.recipe==='custom'?(o.workflowSteps??['merge','compress']).filter((_,i)=>!o.workflowDisabled?.includes(i)):o.recipe==='rotate-compact'?['rotate','compress']:o.recipe==='metadata-compact'||o.recipe==='share-ready'?['clean','compress']:o.recipe==='clean-scan'?['ocr']:o.recipe==='email-ready'?['compress']:o.recipe==='print-ready'?['resize']:['merge','compress'];
  if(!names.length)return 'Add at least one enabled workflow step.';
  if(names.length>8)return 'Use at most eight workflow steps.';
  if(names.some(n=>!['merge','rotate','reverse','clean','compress','resize','ocr'].includes(n)))return 'Choose a supported workflow step.';
  if(names.includes('merge')&&(fileCount<2||batch))return 'Add at least two PDFs and choose One document for a merge workflow.';
  if(names.indexOf('merge')>0)return 'Move Merge to the first step; later steps process one document.';
 }
 return '';
}

