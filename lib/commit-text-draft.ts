import type {OnlineTextDocument} from './online-text-engine';
export type TextDraft={page:number;index:number;value:string;fit:boolean;indices?:number[];horizontal?:boolean;width?:number;moveBelow?:boolean;fallbackFont?:Uint8Array};
/** Validate and retain pending typing before switching tools. */
export function commitTextDraft(document:Pick<OnlineTextDocument,'replace'|'replaceParagraph'|'save'> & Partial<Pick<OnlineTextDocument,'replaceLine'|'replaceFlow'>>,bytes:Uint8Array,draft?:TextDraft){
 if(!draft)return bytes;
 if(draft.width!==undefined&&document.replaceFlow)document.replaceFlow(draft.page,draft.indices??[draft.index],draft.value,{width:draft.width,moveBelow:draft.moveBelow,fallbackFont:draft.fallbackFont});
 else if(draft.horizontal&&draft.indices&&draft.indices.length>1&&document.replaceLine)document.replaceLine(draft.page,draft.indices,draft.value,draft.fit);
 else if(draft.indices&&draft.indices.length>1)document.replaceParagraph(draft.page,draft.indices,draft.value,draft.moveBelow);
 else document.replace(draft.page,draft.index,draft.value,draft.fit);
 return document.save();
}
