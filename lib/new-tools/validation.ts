import type {FieldDef,Values} from './types';
/** Validate only visible controls and their declared constraints, not tool-specific intent. */
export function validateToolFields(fields:FieldDef[],values:Values):Record<string,string>{
 const errors:Record<string,string>={};
 for(const f of fields){
  if(f.when&&!f.when(values))continue;
  if(f.type==='number'){
   const raw=values[f.key],n=Number(raw);
   if(raw===''||typeof raw==='boolean'||!Number.isFinite(n)){errors[f.key]='Enter a number.';continue;}
   if(f.min!==undefined&&n<f.min){errors[f.key]=`Use ${f.min} or more.`;continue;}
   if(f.max!==undefined&&n>f.max){errors[f.key]=`Use ${f.max} or less.`;continue;}
   const step=f.step??1,base=f.min??0;
   if(Math.abs((n-base)/step-Math.round((n-base)/step))>1e-7)errors[f.key]=step===1?'Use a whole number.':`Use steps of ${step}, starting at ${base}.`;
  }else if(f.type==='select'&&f.options&&!f.options.some(([value])=>value===String(values[f.key])))errors[f.key]='Choose an option from this list.';
 }
 return errors;
}
