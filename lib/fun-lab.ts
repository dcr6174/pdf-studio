export const funTools=[
 {slug:'photo-strip',title:'Quick Photo Strip',description:'Rearrange your photos into one downloadable PNG strip.',kind:'Fun & Play'},
 {slug:'flashcards',title:'Study Flashcards',description:'Write question-and-answer cards, practise, shuffle and print.',kind:'Fun & Play'},
 {slug:'decision-wheel',title:'Decision Wheel',description:'Spin your choices, pick a winner and optionally eliminate it.',kind:'Fun & Play'},
];
export type FunMode=(typeof funTools)[number]['slug'];
export function wheelChoices(text:string){return [...new Set(text.split('\n').map(s=>s.trim()).filter(Boolean))].slice(0,20)}
export function randomIndex(length:number){if(!Number.isInteger(length)||length<1||length>10000)throw Error('Invalid choice count');const a=new Uint32Array(1),limit=Math.floor(4294967296/length)*length;do{crypto.getRandomValues(a)}while(a[0]>=limit);return a[0]%length}
export function shuffleCards<T>(cards:T[]){const result=[...cards];for(let i=result.length-1;i>0;i--){const j=randomIndex(i+1);[result[i],result[j]]=[result[j],result[i]]}return result}

export function cardLines(text:string,measure:(s:string)=>number,width=510){
 const lines:string[]=[];
 for(const paragraph of text.split('\n')){let line='';for(const character of paragraph){const next=line+character;if(measure(next)>width&&line){const split=line.lastIndexOf(' ');if(split>line.length/2){lines.push(line.slice(0,split));line=line.slice(split+1)+character}else{lines.push(line);line=character}}else line=next}lines.push(line)}
 if(lines.length>12)throw Error('Keep each card side to 12 printed lines. Remove extra line breaks or shorten the text.');
 return lines;
}
