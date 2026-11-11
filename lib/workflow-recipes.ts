export const workflowChoices=[['merge','Merge input PDFs'],['rotate','Rotate pages'],['watermark','Add watermark'],['remove','Remove pages'],['reorder','Reorder pages'],['crop','Crop PDF'],['reverse','Reverse page order'],['duplicate','Duplicate pages'],['blank','Insert blank page'],['resize','Resize pages'],['numbers','Page numbers'],['bates','Bates numbers'],['headers','Headers and footers'],['flatten','Lock form fields'],['flip','Mirror pages'],['clean','Clear standard metadata'],['compress','Compress PDF'],['extract','Keep selected pages'],['odd','Keep odd pages'],['even','Keep even pages'],['interleave','Alternate PDFs'],['halve','Split wide pages'],['nup','Pages per sheet'],['viewer','Reading layout'],['metadata','Set document details'],['bookmarks','Add bookmarks'],['remove-links','Remove clickable links'],['remove-bookmarks','Remove bookmarks'],['remove-attachments','Remove embedded files'],['remove-annotations','Remove comments']] as const;
export const workflowOperations=workflowChoices.map(([id])=>id);
export type WorkflowStepSettings={angle?:string;watermarkColor?:string;watermarkOpacity?:string;watermarkSize?:string;watermarkPosition?:string;watermarkFont?:string;quality?:string;resizeSize?:string;resizeOrientation?:string;range?:string;margin?:string;cropTop?:string;cropRight?:string;cropBottom?:string;cropLeft?:string;text?:string;footer?:string;start?:string;numberPosition?:string;numberFormat?:string;labelFontSize?:string;labelFont?:string;labelOpacity?:string;labelColor?:string;headerPosition?:string;footerPosition?:string;labelMargin?:string;batesDigits?:string;batesSuffix?:string;flipAxis?:string;blankAt?:string;columns?:string;title?:string;author?:string;subject?:string};
export type WorkflowRecipe={version?:1;name:string;steps:string[];disabled:number[];settings?:WorkflowStepSettings[]};
export function workflowSettings(step:string,value:unknown):WorkflowStepSettings{
 const raw=value&&typeof value==='object'?value as Record<string,unknown>:{};
 const pick=(key:string,allowed:string[],fallback:string)=>{const v=raw[key]??fallback;if(typeof v!=='string'||!allowed.includes(v))throw new Error('This recipe contains an invalid '+key+' setting.');return v;};
 const text=(key:string,fallback='',max=240)=>{const v=raw[key]??fallback;if(typeof v!=='string'||v.length>max)throw new Error('Invalid '+key+' in recipe.');return v;};
 const num=(key:string,fallback:string,min:number,max:number)=>{const v=text(key,fallback);if(!Number.isFinite(Number(v))||Number(v)<min||Number(v)>max)throw new Error('Invalid '+key+' in recipe.');return v;};
 if(step==='watermark'){const watermarkColor=text('watermarkColor','#1a293b');if(!/^#[0-9a-f]{6}$/i.test(watermarkColor))throw new Error('Choose a valid watermark color.');return {text:text('text','DRAFT',120),angle:num('angle','45',-180,180),watermarkColor,watermarkFont:pick('watermarkFont',['noto','helvetica','times','courier'],'noto'),watermarkOpacity:num('watermarkOpacity','22',1,100),watermarkSize:num('watermarkSize','32',6,96),watermarkPosition:pick('watermarkPosition',['top-left','top-center','top-right','middle-left','middle-center','middle-right','bottom-left','bottom-center','bottom-right'],'middle-center')};}
 if(step==='rotate')return {angle:pick('angle',['0','90','180','270'],'90')};
 if(step==='compress')return {quality:pick('quality',['compact','images','image-small'],'compact')};
 if(step==='resize')return {resizeSize:pick('resizeSize',['a4','letter'],'a4'),resizeOrientation:pick('resizeOrientation',['portrait','landscape'],'portrait')};
 if(step==='remove'||step==='reorder'||step==='extract')return {range:text('range')};
 if(step==='nup')return {columns:pick('columns',['2','4','6','9'],'2')};
 if(step==='viewer')return {columns:pick('columns',['1','2'],'1')};
 if(step==='metadata')return {title:text('title'),author:text('author'),subject:text('subject')};
 if(step==='bookmarks')return {text:text('text','',8000)};
 if(step==='blank')return {blankAt:num('blankAt','1',1,5000)};
 if(step==='crop'){const margin=num('margin','20',0,500);return {margin,cropTop:num('cropTop',margin,0,500),cropRight:num('cropRight',margin,0,500),cropBottom:num('cropBottom',margin,0,500),cropLeft:num('cropLeft',margin,0,500)};}
 if(step==='flip')return {flipAxis:pick('flipAxis',['horizontal','vertical'],'horizontal')};
 if(['numbers','bates','headers'].includes(step)){const labelColor=text('labelColor','#333340');if(!/^#[0-9a-f]{6}$/i.test(labelColor))throw new Error('Choose a valid text color.');return {labelColor,labelFont:pick('labelFont',['noto','helvetica','times','courier'],step==='numbers'?'helvetica':'noto'),labelOpacity:num('labelOpacity','100',1,100),headerPosition:pick('headerPosition',['left','center','right'],'left'),footerPosition:pick('footerPosition',['left','center','right'],'left'),text:text('text',step==='bates'?'DOC-':''),footer:text('footer'),start:num('start','1',1,999999999),numberPosition:pick('numberPosition',['top-left','top-center','top-right','middle-left','middle-center','middle-right','bottom-left','bottom-center','bottom-right'],'bottom-center'),numberFormat:pick('numberFormat',['decimal','roman','alpha','page','total'],'decimal'),labelFontSize:num('labelFontSize','11',6,72),labelMargin:num('labelMargin','24',5,200),batesDigits:num('batesDigits','6',1,12),batesSuffix:text('batesSuffix')};}
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
 if(step==='remove'||step==='reorder'||step==='extract'){
  if(!s.range?.trim())return step==='remove'?'Enter the pages to remove.':step==='extract'?'Enter the pages to keep.':'Enter the complete page order.';
  const order:number[]=[];
  for(const part of s.range.split(',')){const m=/^\s*(\d+)(?:\s*-\s*(\d+))?\s*$/.exec(part);if(!m)return 'Use page numbers or ranges, such as 1, 3-5.';const a=Number(m[1]),b=Number(m[2]??m[1]);if(a<1||b<a||b>(pages||5000))return `Choose pages within 1-${pages||400}.`;for(let n=a;n<=b;n++)order.push(n);}
  if(pages&&step==='remove'&&new Set(order).size>=pages)return 'Keep at least one page.';
  if(pages&&step==='reorder'&&(new Set(order).size!==pages||order.length!==pages))return 'Include every page exactly once.';
 }
 if(step==='even'&&pages===1)return 'There are no even pages. Add more pages or remove this action.';
 if(step==='interleave'&&(files<2||index>0))return index?'Alternate PDFs must be the first step.':'Add a second PDF to alternate pages.';
 if(step==='bookmarks'){
  const rows=(s.text??'').split('\n').map(v=>v.trim()).filter(Boolean);
  if(!rows.length)return 'Enter a page number and bookmark title, one per line.';
  if(rows.length>100)return 'Use at most 100 bookmarks.';
  if(rows.some(row=>{const m=/^(\d+)\s+(.+)$/.exec(row);return !m||Number(m[1])<1||Number(m[1])>(pages||5000);}))return 'Use a valid page number and title, such as 1 Introduction.';
 }
 if(step==='metadata'&&![s.title,s.author,s.subject].some(v=>v?.trim()))return 'Enter a title, author or subject.';
 if(step==='blank'&&pages&&Number(s.blankAt??1)>pages+1)return `Insert at a position from 1 to ${pages+1}.`;
 return '';
}

