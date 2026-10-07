export function fittedTextBox(text:string,fontSize:number,pageWidth:number,pageHeight:number,x=0,y=0,measure?:(text:string)=>number){
 const available=Math.max(8,(1-x)*pageWidth),size=Math.max(6,fontSize);
 const metric=(line:string)=>measure?measure(line):Array.from(line).reduce((sum,c)=>sum+(c.charCodeAt(0)>255?size:size*.62),0);
 const paragraphs=(text||' ').split('\n'),widths=paragraphs.map(metric);
 const width=Math.min(available,Math.max(size,Math.max(...widths)*1.08+4));
 let lines=0;for(const paragraph of paragraphs){let line='';for(const char of paragraph){if(line&&metric(line+char)*1.08>Math.max(1,width-4)){lines++;line='';}line+=char;}lines++;}
 const height=Math.max(size*1.3+4,lines*size*1.3+4);
 return {w:width/pageWidth,h:Math.min(Math.max(.001,1-y),height/pageHeight)};
}
export function fitPageZoom(mode:'width'|'height',containerWidth:number,containerHeight:number,pageWidth:number,pageHeight:number){
 if(containerWidth<=0||containerHeight<=0||pageWidth<=0||pageHeight<=0)return 1;
 return mode==='width'?1:Math.max(.05,Math.min(3,containerHeight/(containerWidth*pageHeight/pageWidth)));
}
