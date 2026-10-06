import type {OnlineTextDocument} from './online-text-engine';
export type TextDraft={page:number;index:number;value:string;fit:boolean;indices?:number[];horizontal?:boolean;moveBelow?:boolean};
/** Used before switching modes: validate and save pending typing, or retain exact saved bytes. */
export function commitTextDraft(document:Pick<OnlineTextDocument,'replace'|'replaceParagraph'|'save'> & Partial<Pick<OnlineTextDocument,'replaceLine'>>,bytes:Uint8Array,draft?:TextDraft){
 if(!draft)return bytes;
 if(draft.horizontal&&draft.indices&&draft.indices.length>1&&document.replaceLine)document.replaceLine(draft.page,draft.indices,draft.value,draft.fit);else if(draft.indices&&draft.indices.length>1)document.replaceParagraph(draft.page,draft.indices,draft.value,draft.moveBelow);else document.replace(draft.page,draft.index,draft.value,draft.fit);
 return document.save();
}
