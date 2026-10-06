
'use client';
import {signatureStyles,type SignatureStyle} from '@/lib/signatures';
export function SignatureSettings({style,ink,onStyle,onInk}:{style:SignatureStyle;ink:string;pen:number;onStyle:(s:SignatureStyle)=>void;onInk:(c:string)=>void;onPen:(w:number)=>void}){
 return <div className="sign-settings-body"><label className="field">Signature style<select value={style} onChange={e=>onStyle(e.target.value as SignatureStyle)}>{signatureStyles.map(d=><option key={d.id} value={d.id}>{d.label}</option>)}</select></label><label className="field">Ink colour<input type="color" value={ink} onChange={e=>onInk(e.target.value)}/></label></div>;
}
