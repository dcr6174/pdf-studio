import type {TextObject} from './online-text-engine';
/** Join only adjacent objects on a horizontal baseline; never climb a column. */
export function horizontalRow(objects:TextObject[],selected:number):TextObject[]{
 const first=objects.find(o=>o.index===selected);if(!first)return [];
 if(!first.layout)return [first];
 const baseline=first.layout.baseline??first.layout.bottom;
 const candidates=objects.filter(o=>o.layout&&Math.abs((o.layout.baseline??o.layout.bottom)-baseline)<=Math.min(o.layout.height,first.layout!.height)*.45&&Math.max(o.layout.height,first.layout!.height)/Math.min(o.layout.height,first.layout!.height)<1.8).sort((a,b)=>a.layout!.left-b.layout!.left);
 const at=candidates.indexOf(first);let start=at,end=at;
 const neighbours=(a:TextObject,b:TextObject)=>b.layout!.left>=a.layout!.right-2&&b.layout!.left-a.layout!.right<=Math.max(a.layout!.height,b.layout!.height)*1.8;
 while(start>0&&neighbours(candidates[start-1],candidates[start]))start--;
 while(end<candidates.length-1&&neighbours(candidates[end],candidates[end+1]))end++;
 return candidates.slice(start,end+1);
}
export function rowText(rows:TextObject[]){return rows.map((o,i)=>{const prev=rows[i-1];return (i&&prev.layout&&o.layout&&o.layout.left-prev.layout.right>o.layout.height*.1?' ':'')+o.text.trim();}).join('');}
