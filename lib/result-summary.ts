export type Tone='good'|'bad'|'same'|'neutral';
/** Describe how the size changed. Only Compress treats smaller as "good" and larger as a warning. */
export function describeChange(before:number,after:number,compress:boolean):{pct:number;tone:Tone;headline:string}{
 if(!(before>0)||!(after>=0))return {pct:0,tone:'neutral',headline:''};
 const delta=(after-before)/before,pct=delta<0&&after>0?Math.min(99.9,Math.round(Math.abs(delta)*1000)/10):Math.round(Math.abs(delta)*100);
 if(Math.abs(delta)<.01)return {pct:0,tone:compress?'same':'neutral',headline:'About the same size'};
 if(delta<0)return {pct,tone:compress?'good':'neutral',headline:`${pct}% smaller`};
 return {pct,tone:compress?'bad':'neutral',headline:`${pct}% larger`};
}
/** Bar lengths scale to the bigger of the two, so the comparison is honest. */
export function barWidths(before:number,after:number){
 const max=Math.max(before,after,1);
 return {before:Math.max(2,Math.round(before/max*100)),after:Math.max(2,Math.round(after/max*100))};
}
export function plural(n:number,one:string,many=one+'s'){return `${n} ${n===1?one:many}`;}

