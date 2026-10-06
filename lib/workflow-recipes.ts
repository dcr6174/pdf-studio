export const workflowOperations=['merge','rotate','reverse','clean','compress','resize'] as const;
export type WorkflowRecipe={name:string;steps:string[];disabled:number[]};
export function readWorkflowRecipe(value:unknown):WorkflowRecipe{
 if(!value||typeof value!=='object')throw new Error('Choose a PDF Studio workflow recipe.');
 const r=value as Record<string,unknown>;
 if(typeof r.name!=='string'||!r.name.trim()||r.name.length>80||!Array.isArray(r.steps)||r.steps.length>8||!r.steps.length||r.steps.some(s=>typeof s!=='string'||!(workflowOperations as readonly string[]).includes(s)))throw new Error('Recipes need a name and one to eight supported steps.');
 const steps=r.steps as string[];
 const disabled=Array.isArray(r.disabled)?r.disabled:[];
 if(disabled.some(i=>!Number.isInteger(i)||i<0||i>=steps.length))throw new Error('This recipe has invalid disabled steps.');
 // Explicit allowlist: never retain passwords, filenames or document bytes from imported JSON.
 return {name:r.name.trim(),steps:[...steps],disabled:[...new Set(disabled)]};
}
