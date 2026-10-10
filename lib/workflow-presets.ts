import {workflowSettings,type WorkflowStepSettings} from './workflow-recipes';
export type WorkflowPreset={id:string;label:string;description:string;steps:{id:string;settings?:WorkflowStepSettings}[]};
export const workflowPresets:WorkflowPreset[]=[
 {id:'draft',label:'Draft copy',description:'Add a diagonal DRAFT watermark.',steps:[{id:'watermark',settings:{text:'DRAFT',angle:'45'}}]},
 {id:'print',label:'For printing',description:'Fit every page to A4 paper.',steps:[{id:'resize'}]},
 {id:'compact',label:'Smaller file',description:'Compress while keeping selectable text.',steps:[{id:'compress'}]},
 {id:'share',label:'Ready to share',description:'Clear standard metadata and compress.',steps:[{id:'clean'},{id:'compress'}]},
 {id:'number',label:'Number pages',description:'Add page numbers from 1.',steps:[{id:'numbers',settings:{start:'1',numberPosition:'bottom-center'}}]},
 {id:'print-number',label:'Print & number',description:'Fit to A4, then add page numbers.',steps:[{id:'resize'},{id:'numbers'}]},
 {id:'confidential',label:'Confidential copy',description:'Add CONFIDENTIAL and clear standard metadata.',steps:[{id:'watermark',settings:{text:'CONFIDENTIAL',angle:'45'}},{id:'clean'}]},
 {id:'filled-form',label:'Save filled form',description:'Make form fields read-only, clear metadata and compress.',steps:[{id:'flatten'},{id:'clean'},{id:'compress'}]}
];
export function workflowPresetState(preset:WorkflowPreset,fileCount:number){
 const chosen=fileCount>1?[{id:'merge'},...preset.steps]:preset.steps;
 return {steps:chosen.map(s=>s.id),disabled:[] as number[],settings:chosen.map(s=>workflowSettings(s.id,s.settings))};
}
