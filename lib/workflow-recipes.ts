export const workflowChoices=[['merge','Merge input PDFs'],['rotate','Rotate pages'],['watermark','Add watermark'],['remove','Remove pages'],['reorder','Reorder pages'],['crop','Crop margins'],['reverse','Reverse page order'],['duplicate','Duplicate pages'],['blank','Insert blank page'],['resize','Resize pages'],['numbers','Page numbers'],['bates','Bates numbers'],['headers','Headers and footers'],['flatten','Lock form fields'],['flip','Mirror pages'],['clean','Clear standard metadata'],['compress','Compress PDF']] as const;
export const workflowOperations=workflowChoices.map(([id])=>id);
export type WorkflowStepSettings={angle?:string;quality?:string;resizeSize?:string;resizeOrientation?:string;range?:string;margin?:string;text?:string;footer?:string;start?:string;numberPosition?:string;numberFormat?:string;labelFontSize?:string;labelMargin?:string;batesDigits?:string;batesSuffix?:string;flipAxis?:string;blankAt?:string};
export type WorkflowRecipe={version?:1;name:string;steps:string[];disabled:number[];settings?:WorkflowStepSettings[]};
export function workflowSettings(step:string,value:unknown):WorkflowStepSettings{
 const raw=value&&typeof value==='object'?value as Record<string,unknown>:{};
 const pick=(key:string,allowed:string[],fallback:string)=>{const v=raw[key]??fallback;if(typeof v!=='string'||!allowed.includes(v))throw new Error('This recipe contains an invalid '+key+' setting.');return v;};
 const text=(key:string,fallback='',max=240)=>{const v=raw[key]??fallback;if(typeof v!=='string'||v.length>max)throw new Error('Invalid '+key+' in recipe.');return v;};
 const num=(key:string,fallback:string,min:number,max:number)=>{const v=text(key,fallback);if(!Number.isFinite(Number(v))||Number(v)<min||Number(v)>max)throw new Error('Invalid '+key+' in recipe.');return v;};
 if(step==='watermark')return {text:text('text','DRAFT',120),angle:num('angle','45',-180,180)};
 if(step==='rotate')return {angle:pick('angle',['90','180','270'],'90')};
 if(step==='compress')return {quality:pick('quality',['compact','images'],'compact')};
 if(step==='resize')return {resizeSize:pick('resizeSize',['a4','letter'],'a4'),resizeOrientation:pick('resizeOrientation',['portrait','landscape'],'portrait')};
 if(step==='remove'||step==='reorder')return {range:text('range')};
 if(step==='blank')return {blankAt:num('blankAt','1',1,400)};
 if(step==='crop')return {margin:num('margin','20',0,500)};
 if(step==='flip')return {flipAxis:pick('flipAxis',['horizontal','vertical'],'horizontal')};
 if(['numbers','bates','headers'].includes(step))return {text:text('text',step==='bates'?'DOC-':''),footer:text('footer'),start:num('start','1',1,999999999),numberPosition:pick('numberPosition',['top-left','top-center','top-right','middle-left','middle-center','middle-right','bottom-left','bottom-center','bottom-right'],'bottom-center'),numberFormat:pick('numberFormat',['decimal','roman','alpha','page','total'],'decimal'),labelFontSize:num('labelFontSize','11',6,72),labelMargin:num('labelMargin','24',5,200),batesDigits:num('batesDigits','6',1,12),batesSuffix:text('batesSuffix')};
 return {};
}
export function readWorkflowRecipe(value:unknown):WorkflowRecipe{
 if(!value||typeof value!=='object')throw new Error('That file is not a PDF Studio workflow recipe.');
 const r=value as Record<string,unknown>;
 if(r.version!==undefined&&r.version!==1)throw new Error('This recipe uses an unsupported version.');
 if(typeof r.name!=='string'||!r.name.trim()||r.name.length>80||!Array.isArray(r.steps)||!r.steps.length||r.steps.some(s=>typeof s!=='string'||!workflowOperations.includes(s as typeof workflowOperations[number])))throw new Error('Recipes need a name and at least one supported step.');
 const steps=r.steps as string[],disabled=Array.isArray(r.disabled)?r.disabled:[];
 if(disabled.some(i=>!Number.isInteger(i)||i<0||i>=steps.length))throw new Error('This recipe has invalid disabled steps.');
 if(r.settings!==undefined&&(!Array.isArray(r.settings)||r.settings.length!==steps.length))throw new Error('Recipe settings must match its steps.');
 const settings=steps.map((step,i)=>workflowSettings(step,Array.isArray(r.settings)?r.settings[i]:undefined));
 return {version:1,name:r.name.trim(),steps:[...steps],disabled:[...new Set(disabled)],settings};
}
export function workflowStepIssue(step:string,s:WorkflowStepSettings,pages:number,files:number,index:number):string{
 if(step==='watermark'&&!s.text?.trim())return 'Enter watermark text.';
 if(step==='merge'&&(files<2||index>0))return index?'Merge must be the first step.':'Add a second PDF to merge.';
 if(step==='remove'||step==='reorder'){
  if(!s.range?.trim())return step==='remove'?'Enter the pages to remove.':'Enter the complete page order.';
  const order:number[]=[];
  for(const part of s.range.split(',')){const m=/^\s*(\d+)(?:\s*-\s*(\d+))?\s*$/.exec(part);if(!m)return 'Use page numbers or ranges, such as 1, 3-5.';const a=Number(m[1]),b=Number(m[2]??m[1]);if(a<1||b<a||b>(pages||400))return `Choose pages within 1-${pages||400}.`;for(let n=a;n<=b;n++)order.push(n);}
  if(pages&&step==='remove'&&new Set(order).size>=pages)return 'Keep at least one page.';
  if(pages&&step==='reorder'&&(new Set(order).size!==pages||order.length!==pages))return 'Include every page exactly once.';
 }
 if(step==='blank'&&pages&&Number(s.blankAt??1)>pages+1)return `Insert at a position from 1 to ${pages+1}.`;
 return '';
}

