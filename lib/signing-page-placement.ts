export type SigningPageScope='current'|'all'|'all-except-last'|'last'|'custom';
type IdentifiedPage={id:string};
type SigningMark={id:string;pageId:string;signatureGroup?:string;[key:string]:unknown};

export function resolveSigningPages<T extends IdentifiedPage>(pages:readonly T[],sourcePageId:string,scope:SigningPageScope,range:string):T[]{
  let targets:T[];
  if(scope==='current')targets=pages.filter(page=>page.id===sourcePageId);
  else if(scope==='all')targets=[...pages];
  else if(scope==='all-except-last')targets=pages.slice(0,-1);
  else if(scope==='last')targets=pages.slice(-1);
  else {
    if(!range.trim())throw new Error('Enter page numbers such as 1, 3-5.');
    const wanted=new Set<number>();
    for(const token of range.split(',')){
      const match=/^\\s*(\\d+)(?:\\s*-\\s*(\\d+))?\\s*$/.exec(token);
      if(!match)throw new Error('Enter page numbers such as 1, 3-5.');
      const from=Number(match[1]),to=Number(match[2]??match[1]);
      if(from<1||to<from||to>pages.length)throw new Error('Choose pages between 1 and '+pages.length+'.');
      for(let page=from;page<=to;page++)wanted.add(page);
    }
    targets=pages.filter((_,index)=>wanted.has(index+1));
  }
  if(!targets.length)throw new Error('Choose at least one page for this field.');
  return targets;
}

export function copySigningMark<T extends SigningMark>(marks:readonly T[],mark:T,pages:readonly IdentifiedPage[],scope:SigningPageScope,range:string,createId:()=>string=()=>crypto.randomUUID()):{marks:T[];pageCount:number}{
  const targets=resolveSigningPages(pages,mark.pageId,scope,range);
  const group=mark.signatureGroup??mark.id;
  const source={...mark,signatureGroup:group} as T;
  const copies=targets.filter(page=>page.id!==mark.pageId).map(page=>({...source,id:createId(),pageId:page.id}) as T);
  return {marks:[...marks.filter(item=>item.signatureGroup!==group&&item.id!==mark.id),source,...copies],pageCount:targets.length};
}
