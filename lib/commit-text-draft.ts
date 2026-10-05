import type {OnlineTextDocument} from './online-text-engine';
export type TextDraft={page:number;index:number;value:string;fit:boolean};
/** Used before switching modes: validate and save pending typing, or retain exact saved bytes. */
export function commitTextDraft(document:Pick<OnlineTextDocument,'replace'|'save'>,bytes:Uint8Array,draft?:TextDraft){
 if(!draft)return bytes;
 document.replace(draft.page,draft.index,draft.value,draft.fit);
 return document.save();
}
