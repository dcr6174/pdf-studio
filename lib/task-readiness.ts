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
  const first=workflowInputIssues(names,o.recipe==='custom'?(o.workflowSettings??[]):[],o.recipe==='custom'?(o.workflowDisabled??[]):[],fileCount,pageCount,batch)[0];
  if(first)return `Step ${first.index+1}: ${first.message}`;
 }
 return '';
}

/** Report each action's missing details while tracking the pages produced by earlier actions. */
export function workflowInputIssues(names:string[],stepSettings:NonNullable<Options['workflowSettings']>,disabled:number[],fileCount:number,pageCount:number,batch=false){
 const enabled=names.map((name,index)=>({name,index})).filter(s=>!disabled.includes(s.index));
  let count=pageCount;
  const issues:{index:number;message:string}[]=[];
  for(let n=0;n<enabled.length;n++){
   const {name,index}=enabled[n];if(!workflowOperations.includes(name as typeof workflowOperations[number])&&name!=='ocr'){issues.push({index,message:'Choose a supported workflow step.'});continue;}
   if(name==='merge'&&batch){issues.push({index,message:'Merge needs One document mode.'});continue;}
   try{const settings=workflowSettings(name,stepSettings[index]),issue=workflowStepIssue(name,settings,count,fileCount,n);if(issue){issues.push({index,message:issue});if(['remove','blank','duplicate'].includes(name))count=0;continue;}
    if(name==='duplicate'&&count)count*=2;if(name==='blank'&&count)count++;if(name==='remove'&&count){const removed=new Set<number>();for(const part of (settings.range??'').split(',')){const [a,b]=part.split('-').map(Number);for(let i=a;i<=(b||a);i++)removed.add(i);}count-=removed.size;}if(count>400){issues.push({index,message:'This step would exceed the 400-page limit.'});count=0;}
   }catch(e){issues.push({index,message:workflowSettingMessage((e as Error).message)});if(['remove','blank','duplicate'].includes(name))count=0;}
  }
 return issues;
}

function workflowSettingMessage(message:string){
 const labels:Record<string,string>={start:'starting number (1–999999999)',blankAt:'insertion position (1–400)',margin:'trim amount (0–500 points)',batesDigits:'number of digits (1–12)',angle:'rotation angle',text:'text',footer:'footer text',batesSuffix:'suffix',labelFontSize:'font size (6–72)',labelMargin:'label margin (5–200)'};
 const key=/Invalid (\w+) in recipe\./.exec(message)?.[1];
 return key&&labels[key]?'Enter a valid '+labels[key]+'.':message;
}
