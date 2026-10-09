import type {EditingFont} from './text-fonts';import type {TextEditOptions,TextEditResult} from './advanced-text-edit';import type {TextObject} from './online-text-engine';
export type TextView={width:number;height:number;rgba:Uint8ClampedArray;objects:TextObject[];pageCount:number};
export type TextJob={id:number;method:'inspect'|'objects'|'edit'|'validate'|'font'|'validateFont';bytes:Uint8Array;page?:number;scale?:number;indices?:number[];value?:string;options?:TextEditOptions;expectedPages?:number};
export type TextJobValue=TextView|TextObject[]|TextEditResult|EditingFont|Uint8Array|undefined|boolean;
export type WorkerReply={id:number;value?:TextJobValue;error?:string};
export type {EditingFont,TextEditOptions,TextEditResult,TextObject};
