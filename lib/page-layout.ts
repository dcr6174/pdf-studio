/** Explicit page sizing in points; custom dimensions are entered in millimetres. */
export function resizeSheet(options:{resizeSize?:string;resizeWidth?:string;resizeHeight?:string;resizeOrientation?:string}) {
 const custom=options.resizeSize==='custom';
 const mm=[Number(options.resizeWidth),Number(options.resizeHeight)];
 if(custom&&mm.some(n=>!Number.isFinite(n)||n<20||n>2000))throw new Error('Enter a custom width and height between 20 and 2000 mm.');
 const sheet=custom?mm.map(n=>n*72/25.4):options.resizeSize==='letter'?[612,792]:[595.28,841.89];
 if(!custom&&options.resizeOrientation==='landscape')sheet.reverse();
 return sheet as [number,number];
}
export function resizePlacement(width:number,height:number,sheet:[number,number],fill=false){
 const margin=fill?0:20, scale=(fill?Math.max:Math.min)((sheet[0]-margin*2)/width,(sheet[1]-margin*2)/height);
 return {x:(sheet[0]-width*scale)/2,y:(sheet[1]-height*scale)/2,width:width*scale,height:height*scale};
}
/** Semicolons separate PDFs; comma/range syntax selects pages inside each PDF. */
export function splitGroups(value:string,count:number):number[][]{
 if(!value.trim())throw new Error('Enter page groups, for example 1-3; 4,6. Each semicolon starts a new PDF.');
 const groups=value.split(';').map(group=>{if(!group.trim())throw new Error('Remove empty page groups.');const result:number[]=[];for(const token of group.split(',')){const match=token.trim().match(/^(\d+)(?:\s*-\s*(\d+))?$/);if(!match)throw new Error('Use page numbers, ranges and semicolons, for example 1-3; 4,6.');const start=Number(match[1]),end=Number(match[2]??match[1]);if(start<1||end<start||end>count)throw new Error(`Choose page groups within pages 1–${count}.`);for(let p=start-1;p<end;p++)if(!result.includes(p))result.push(p);}return result;});
 if(groups.reduce((n,g)=>n+g.length,0)>2000)throw new Error('These groups would export more than 2000 pages. Choose fewer or smaller groups.');
 return groups;
}
