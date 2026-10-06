export const workflowOperations=['merge','rotate','reverse','clean','compress','resize'] as const;
export type WorkflowStepSettings={angle?:string;quality?:string;resizeSize?:string;resizeOrientation?:string};
export type WorkflowRecipe={name:string;steps:string[];disabled:number[];settings?:WorkflowStepSettings[]};
export function workflowSettings(step:string,value:unknown):WorkflowStepSettings{
 const raw=value&&typeof value==='object'?value as Record<string,unknown>:{};
 const pick=(key:string,allowed:string[],fallback:string)=>{const v=raw[key]??fallback;if(typeof v!=='string'||!allowed.includes(v))throw new Error('This recipe contains an invalid '+key+' setting.');return v;};
 if(step==='rotate')return {angle:pick('angle',['90','180','270'],'90')};
 if(step==='compress')return {quality:pick('quality',['compact','images'],'compact')};
 if(step==='resize')return {resizeSize:pick('resizeSize',['a4','letter'],'a4'),resizeOrientation:pick('resizeOrientation',['portrait','landscape'],'portrait')};
 return {};
}

export function readWorkflowRecipe(value:unknown):WorkflowRecipe{
 if(!value||typeof value!=='object')throw new Error('Choose a PDF Studio workflow recipe.');
 const r=value as Record<string,unknown>;
 if(typeof r.name!=='string'||!r.name.trim()||r.name.length>80||!Array.isArray(r.steps)||r.steps.length>8||!r.steps.length||r.steps.some(s=>typeof s!=='string'||!(workflowOperations as readonly string[]).includes(s)))throw new Error('Recipes need a name and one to eight supported steps.');
 const steps=r.steps as string[];
 const disabled=Array.isArray(r.disabled)?r.disabled:[];
 if(disabled.some(i=>!Number.isInteger(i)||i<0||i>=steps.length))throw new Error('This recipe has invalid disabled steps.');
 // Explicit allowlist: never retain passwords, filenames or document bytes from imported JSON.
 if(r.settings!==undefined&&(!Array.isArray(r.settings)||r.settings.length!==steps.length))throw new Error('Recipe settings must match its steps.');
 const settings=Array.isArray(r.settings)?steps.map((step,i)=>workflowSettings(step,(r.settings as unknown[])[i])):undefined;
 return {name:r.name.trim(),steps:[...steps],disabled:[...new Set(disabled)],...(settings?{settings}:{})};
}
