export type Value=string|number|boolean;
export type Values=Record<string,Value>;
export type FieldDef={key:string;label:string;type:'text'|'number'|'select'|'checkbox'|'textarea'|'color';options?:[string,string][];def:Value;min?:number;max?:number;step?:number;help?:string;placeholder?:string;when?:(v:Values)=>boolean};
export type Extra={name:string;bytes:Uint8Array;type:string};
export type Ctx={bytes:Uint8Array;name:string;pages:number;extra:Extra[];v:Values;progress:(percent:number)=>void};
/** A finished export. ext is the download extension; report is shown under What changed. */
export type Result={blob:Blob;ext:string;report?:string};
export type ExtraInput={label:string;accept:string;multiple?:boolean;required?:boolean;hint?:string};
export type NewTool={id:string;action:string;fields:FieldDef[];extra?:ExtraInput;run:(c:Ctx)=>Promise<Result>};
