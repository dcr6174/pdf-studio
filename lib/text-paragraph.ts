import type {TextObject} from './online-text-engine';
/** Conservative grouping: a split paragraph is preferable to merging columns. */
export function paragraphFor(objects:TextObject[],selected:number){
 const first=objects.find(o=>o.index===selected);if(!first)return [];
 const compatible=(a:TextObject,b:TextObject)=>!!a.layout&&!!b.layout&&a.layout.key===b.layout.key&&Math.abs(a.layout.left-b.layout.left)<=2&&a.layout.top>b.layout.top&&a.layout.top-b.layout.top<=a.layout.height*2.2&&a.layout.top-b.layout.top>=a.layout.height*.85;
 const ordered=objects.filter(o=>o.layout?.key===first.layout?.key).sort((a,b)=>(b.layout?.top??0)-(a.layout?.top??0));const at=ordered.indexOf(first);let start=at,end=at;while(start>0&&compatible(ordered[start-1],ordered[start]))start--;while(end+1<ordered.length&&compatible(ordered[end],ordered[end+1]))end++;
 const group=ordered.slice(start,end+1);if(group.length<2||group.length>40)return [first];
 const left=Math.min(...group.map(o=>o.layout!.left)),right=Math.max(...group.map(o=>o.layout!.right)),top=group[0].layout!.top,bottom=group.at(-1)!.layout!.bottom;
 if(objects.some(o=>!group.includes(o)&&o.layout&&o.layout.left<right&&o.layout.right>left&&o.layout.top>bottom&&o.layout.bottom<top))return [first];return group;
}
export function wrapParagraph(text:string,width:number,measure:(value:string)=>number,maxLines:number){
 if(text.length>20000)throw new Error('This paragraph is too long. Edit a smaller section.');
 if(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(text))throw new Error('Remove unsupported control characters.');
 const lines:string[]=[];const add=(s:string)=>{lines.push(s.trimEnd());if(lines.length>maxLines)throw new Error('The paragraph needs more lines than its original area. Shorten it; nearby content has not been moved.');};
 for(const part of text.replace(/\r\n?/g,'\n').replace(/\t/g,'    ').split('\n')){let line='';for(const word of part.split(/\s+/).filter(Boolean)){const next=line?line+' '+word:word;if(measure(next)<=width+.25){line=next;continue;}if(line){add(line);line='';}for(const char of word){if(measure(line+char)>width+.25){if(!line)throw new Error('A character cannot fit inside this paragraph.');add(line);line='';}line+=char;}}add(line);}return lines;
}
