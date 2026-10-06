import type {OnlineTextDocument} from './online-text-engine';
export type TextDraft={page:number;index:number;value:string;fit:boolean;indices?:number[];width?:number;moveBelow?:boolean;fallbackFont?:Uint8Array};
/** Used before switching modes: validate and save pending typing, or retain exact saved bytes. */
export function commitTextDraft(document:Pick<OnlineTextDocument,'replace'|'replaceParagraph'|'replaceFlow'|'save'>,bytes:Uint8Array,draft?:TextDraft){
 if(!draft)return bytes;
 if(draft.width!==undefined)document.replaceFlow(draft.page,draft.indices??[draft.index],draft.value,{width:draft.width,moveBelow:draft.moveBelow,fallbackFont:draft.fallbackFont});else if(draft.indices&&draft.indices.length>1)document.replaceParagraph(draft.page,draft.indices,draft.value);else document.replace(draft.page,draft.index,draft.value,draft.fit);
 return document.save();
}
