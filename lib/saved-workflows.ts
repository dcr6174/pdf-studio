import {readWorkflowRecipe,type WorkflowRecipe} from './workflow-recipes';
export type SavedWorkflow={id:string;recipe:WorkflowRecipe;updatedAt:string};
const key='pdf-studio-saved-workflows-v1',event='pdf-studio-saved-workflows-changed';
export function savedWorkflowSnapshot(){try{return window.localStorage.getItem(key)??'';}catch{return '';}}
export function subscribeSavedWorkflows(notify:()=>void){const changed=(e:StorageEvent)=>{if(e.key===key||e.key===null)notify();};window.addEventListener('storage',changed);window.addEventListener(event,notify);return ()=>{window.removeEventListener('storage',changed);window.removeEventListener(event,notify);};}
export function readSavedWorkflows(raw:string):SavedWorkflow[]{
 try{const values:unknown=JSON.parse(raw||'[]');if(!Array.isArray(values))return [];
 const result:SavedWorkflow[]=[];
 for(const value of values){try{if(!value||typeof value!=='object')continue;const item=value as Record<string,unknown>;if(typeof item.id!=='string'||!item.id||typeof item.updatedAt!=='string'||result.some(v=>v.id===item.id))continue;result.push({id:item.id,updatedAt:item.updatedAt,recipe:readWorkflowRecipe(item.recipe)});}catch{/* A damaged entry does not hide the other saved workflows. */}}
 return result;
 }catch{return [];}
}
export function saveWorkflow(value:WorkflowRecipe,existingId?:string,storage:Pick<Storage,'getItem'|'setItem'>=window.localStorage):SavedWorkflow{
 const recipe=readWorkflowRecipe({...value,name:value.name.trim()});
 const workflows=readSavedWorkflows(storage.getItem(key)??'');
 if(workflows.some(v=>v.id!==existingId&&v.recipe.name.toLocaleLowerCase()===recipe.name.toLocaleLowerCase()))throw new Error('That name is already saved. Choose a different name.');
 const saved={id:existingId??crypto.randomUUID(),recipe,updatedAt:new Date().toISOString()};
 const next=[saved,...workflows.filter(v=>v.id!==saved.id)];
 try{storage.setItem(key,JSON.stringify(next));}catch{throw new Error('Your browser could not save this workflow. Free some browser storage or allow site storage, then try again.');}
 if(typeof window!=='undefined')window.dispatchEvent(new Event(event));
 return saved;
}
export function savedWorkflowState(recipe:WorkflowRecipe,fileCount:number){
 const validated=readWorkflowRecipe(recipe),disabled=validated.disabled,first=validated.steps.find((_,i)=>!disabled.includes(i));
 const combine=fileCount>1&&!['merge','interleave'].includes(first??'');
 return {steps:combine?['merge',...validated.steps]:[...validated.steps],disabled:combine?disabled.map(i=>i+1):[...disabled],settings:combine?[{},...(validated.settings??[])]:validated.settings??[]};
}
