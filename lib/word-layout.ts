import type {WordRun} from './word-conversion';
export type Box={x:number;y:number;width:number;height:number};
export type WordTable={box:Box;cells:WordRun[][][];columns:number[]};
export type Segment={x1:number;y1:number;x2:number;y2:number};
type Matrix=number[];
const mul=(a:Matrix,b:Matrix):Matrix=>[a[0]*b[0]+a[2]*b[1],a[1]*b[0]+a[3]*b[1],a[0]*b[2]+a[2]*b[3],a[1]*b[2]+a[3]*b[3],a[0]*b[4]+a[2]*b[5]+a[4],a[1]*b[4]+a[3]*b[5]+a[5]];
export const inside=(r:WordRun,b:Box)=>r.x+r.width/2>=b.x-2&&r.x+r.width/2<=b.x+b.width+2&&r.y-r.size/2>=b.y-2&&r.y-r.size/2<=b.y+b.height+2;
const intersects=(a:Box,b:Box,p=0)=>a.x<=b.x+b.width+p&&a.x+a.width+p>=b.x&&a.y<=b.y+b.height+p&&a.y+a.height+p>=b.y;
const union=(a:Box,b:Box):Box=>({x:Math.min(a.x,b.x),y:Math.min(a.y,b.y),width:Math.max(a.x+a.width,b.x+b.width)-Math.min(a.x,b.x),height:Math.max(a.y+a.height,b.y+b.height)-Math.min(a.y,b.y)});
/** Read public PDF.js operator geometry; retain clipped/masked artwork by rendering its region. */
export function wordGeometry(list:{fnArray:number[];argsArray:unknown[][]},ops:Record<string,number>,viewport:number[],width:number,height:number){
 let matrix:Matrix=[1,0,0,1,0,0];const stack:Matrix[]=[],boxes:Box[]=[],segments:Segment[]=[],images:{box:Box;id:unknown;direct:boolean}[]=[];let clipped=false,hasRaster=false;const clips:boolean[]=[];
 const point=(x:number,y:number)=>{const m=mul(viewport,matrix);return [m[0]*x+m[2]*y+m[4],m[1]*x+m[3]*y+m[5]];};
 const box=(x1:number,y1:number,x2:number,y2:number)=>{const pts=[point(x1,y1),point(x2,y1),point(x1,y2),point(x2,y2)],xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]);return {x:Math.min(...xs),y:Math.min(...ys),width:Math.max(...xs)-Math.min(...xs),height:Math.max(...ys)-Math.min(...ys)};};
 const line=(x1:number,y1:number,x2:number,y2:number)=>{const a=point(x1,y1),b=point(x2,y2);segments.push({x1:a[0],y1:a[1],x2:b[0],y2:b[1]});};
 let pending:Box|undefined,pendingLines:Segment[]=[];
 for(let i=0;i<list.fnArray.length;i++){
  const fn=list.fnArray[i],a=list.argsArray[i];
  if(fn===ops.save){stack.push([...matrix]);clips.push(clipped);}else if(fn===ops.restore){matrix=stack.pop()??matrix;clipped=clips.pop()??false;}
  else if(fn===ops.paintFormXObjectEnd){matrix=stack.pop()??matrix;clipped=clips.pop()??false;}
  else if(fn===ops.transform||fn===ops.paintFormXObjectBegin){if(fn===ops.paintFormXObjectBegin){stack.push([...matrix]);clips.push(clipped);if(a[1])clipped=true;}const m=fn===ops.transform?a:a[0];if((Array.isArray(m)||ArrayBuffer.isView(m))&&(m as number[]).length===6)matrix=mul(matrix,Array.from(m as number[]));}
  else if(fn===ops.clip||fn===ops.eoClip||fn===ops.setGState)clipped=true;
  else if(fn===ops.constructPath){const paths=a[0] as number[],coords=a[1] as number[],bounds=a[2] as number[];if(bounds?.length===4&&bounds.every(Number.isFinite)){const b=box(...bounds as [number,number,number,number]);pending=pending?union(pending,b):b;}const start=segments.length;let j=0,x=0,y=0,sx=0,sy=0;
   for(const op of paths){if(op===ops.rectangle){const [rx,ry,w,h]=coords.slice(j,j+4);j+=4;line(rx,ry,rx+w,ry);line(rx+w,ry,rx+w,ry+h);line(rx+w,ry+h,rx,ry+h);line(rx,ry+h,rx,ry);}
    else if(op===ops.moveTo){x=coords[j++];y=coords[j++];sx=x;sy=y;}
    else if(op===ops.lineTo){const nx=coords[j++],ny=coords[j++];line(x,y,nx,ny);x=nx;y=ny;}
    else if(op===ops.closePath)line(x,y,sx,sy);
    else if(op===ops.curveTo){x=coords[j+4];y=coords[j+5];j+=6;}
    else if(op===ops.curveTo2||op===ops.curveTo3){x=coords[j+2];y=coords[j+3];j+=4;}}
   pendingLines.push(...segments.splice(start));
  }else if([ops.stroke,ops.closeStroke,ops.fill,ops.eoFill,ops.fillStroke,ops.eoFillStroke,ops.closeFillStroke,ops.closeEOFillStroke].includes(fn)){
   if(pending&&!(pending.x<=1&&pending.y<=1&&pending.width>=width-2&&pending.height>=height-2))boxes.push(pending);
   if([ops.stroke,ops.closeStroke,ops.fillStroke,ops.eoFillStroke,ops.closeFillStroke,ops.closeEOFillStroke].includes(fn))segments.push(...pendingLines);pending=undefined;pendingLines=[];
  }else if(fn===ops.endPath){pending=undefined;pendingLines=[];}
  else if([ops.paintImageXObject,ops.paintInlineImageXObject,ops.paintImageMaskXObject].includes(fn)){hasRaster=true;const b=box(0,0,1,1),m=mul(viewport,matrix);boxes.push(b);images.push({box:b,id:a[0],direct:!clipped&&fn!==ops.paintImageMaskXObject&&Math.abs(m[1])<.01&&Math.abs(m[2])<.01&&m[0]>0&&m[3]<0});}
  else if(fn===ops.paintImageXObjectRepeat){hasRaster=true;const old=matrix,positions=a[3] as number[];for(let j=0;j<positions.length;j+=2){matrix=mul(old,[a[1] as number,0,0,a[2] as number,positions[j],positions[j+1]]);boxes.push(box(0,0,1,1));}matrix=old;}
  else if(fn===ops.paintImageMaskXObjectRepeat||fn===ops.paintImageMaskXObjectGroup||fn===ops.paintInlineImageXObjectGroup||fn===ops.shadingFill){if(fn!==ops.shadingFill)hasRaster=true;boxes.push({x:0,y:0,width,height});}
 }
 return {boxes,segments,images,hasRaster};
}
const unique=(values:number[])=>values.sort((a,b)=>a-b).filter((v,i,a)=>!i||v-a[i-1]>3);
export function ruledTables(segments:Segment[],runs:WordRun[]):WordTable[]{
 const hs=segments.filter(s=>Math.abs(s.y1-s.y2)<1.5&&Math.abs(s.x1-s.x2)>30),vs=segments.filter(s=>Math.abs(s.x1-s.x2)<1.5&&Math.abs(s.y1-s.y2)>20),tables:WordTable[]=[];
 for(const edge of vs){const top=Math.min(edge.y1,edge.y2),bottom=Math.max(edge.y1,edge.y2),verticals=vs.filter(v=>Math.abs(Math.min(v.y1,v.y2)-top)<3&&Math.abs(Math.max(v.y1,v.y2)-bottom)<3),xs=unique(verticals.map(v=>v.x1));if(xs.length<3||xs.length>20)continue;
  const left=xs[0],right=xs[xs.length-1],ys=unique(hs.filter(h=>h.y1>=top-3&&h.y1<=bottom+3&&Math.abs(Math.min(h.x1,h.x2)-left)<3&&Math.abs(Math.max(h.x1,h.x2)-right)<3).map(h=>h.y1));
  if(ys.length<3||ys.length>100||Math.abs(ys[0]-top)>3||Math.abs(ys[ys.length-1]-bottom)>3)continue;
  const b={x:left,y:top,width:right-left,height:bottom-top};if(tables.some(t=>intersects(t.box,b)))continue;
  const cells=ys.slice(0,-1).map(()=>xs.slice(0,-1).map(()=>[] as WordRun[]));
  for(const r of runs){const cx=r.x+r.width/2,cy=r.y-r.size/2,col=xs.findIndex((x,i)=>i<xs.length-1&&cx>=x&&cx<xs[i+1]),row=ys.findIndex((y,i)=>i<ys.length-1&&cy>=y&&cy<ys[i+1]);if(row>=0&&col>=0)cells[row][col].push(r);}
  if(cells.flat().filter(c=>c.length).length<4)continue;tables.push({box:b,cells,columns:xs.slice(1).map((x,i)=>x-xs[i])});
 }
 return tables;
}
export function graphicRegions(boxes:Box[],tables:WordTable[],width:number,height:number):Box[]{
 const groups:Box[]=[];
 for(const raw of boxes){const b={x:Math.max(0,raw.x-2),y:Math.max(0,raw.y-2),width:Math.min(width,raw.x+raw.width+2)-Math.max(0,raw.x-2),height:Math.min(height,raw.y+raw.height+2)-Math.max(0,raw.y-2)};
  if(b.width<3||b.height<3||tables.some(t=>b.x>=t.box.x-4&&b.y>=t.box.y-4&&b.x+b.width<=t.box.x+t.box.width+4&&b.y+b.height<=t.box.y+t.box.height+4))continue;
  let merged=b,changed=true;while(changed){changed=false;for(let i=groups.length-1;i>=0;i--)if(intersects(groups[i],merged,5)){merged=union(groups[i],merged);groups.splice(i,1);changed=true;}}groups.push(merged);
 }
 return groups.filter(b=>b.width>=8&&b.height>=8).sort((a,b)=>a.y-b.y||a.x-b.x);
}
export type StructureNode={role?:string;id?:string;children?:StructureNode[]};
/** Tagged tables are preferable to geometric guesses, including borderless tables. */
export function taggedTables(tree:StructureNode|null,runs:WordRun[]):WordTable[]{
 const tables:WordTable[]=[];
 const ids=(n:StructureNode):string[]=>[...(n.id?[n.id]:[]),...(n.children??[]).flatMap(ids)];
 const rows=(n:StructureNode):StructureNode[]=>n.role==='TR'?[n]:(n.children??[]).flatMap(rows);
 const cells=(n:StructureNode):StructureNode[]=>['TD','TH'].includes(n.role??'')?[n]:(n.children??[]).flatMap(cells);
 const visit=(n:StructureNode)=>{if(n.role==='Table'){
  const grid=rows(n).map(row=>cells(row).map(cell=>{const refs=new Set(ids(cell));return runs.filter(r=>r.marked?.some(id=>refs.has(id)));}));
  if(grid.length<2||grid[0]?.length<2||grid.some(row=>row.length!==grid[0].length)||grid.flat().some(cell=>!cell.length))return;
  const members=grid.flat(2);if(new Set(members).size!==members.length)return;
  const all=grid.flat(2),x=Math.min(...all.map(r=>r.x)),y=Math.min(...all.map(r=>r.y-r.size)),right=Math.max(...all.map(r=>r.x+r.width)),bottom=Math.max(...all.map(r=>r.y+2));
  const starts=grid[0].map((_,i)=>Math.min(...grid.flatMap(row=>row[i].map(r=>r.x))));
  if(starts.some((v,i)=>i>0&&v<=starts[i-1]))return;
  tables.push({box:{x:x-2,y:y-2,width:right-x+4,height:bottom-y+4},cells:grid,columns:starts.map((v,i)=>(starts[i+1]??right+2)-v)});
 }else(n.children??[]).forEach(visit);};if(tree)visit(tree);return tables;
}

/** A visual fallback must retain complete intersecting words and tables, never crop their content. */
export function preserveRegionContent(regions:Box[],runs:WordRun[],tables:WordTable[],width:number,height:number):Box[]{
 let result=regions.map(b=>({...b})),changed=true;
 const textBox=(r:WordRun):Box=>({x:r.x-1,y:r.y-r.size-2,width:r.width+2,height:r.size+5});
 const candidates=[...runs.map(textBox),...tables.map(t=>t.box)];
 const bounded=(b:Box):Box=>{const x=Math.max(0,b.x),y=Math.max(0,b.y);return {x,y,width:Math.max(0,Math.min(width,b.x+b.width)-x),height:Math.max(0,Math.min(height,b.y+b.height)-y)};};
 while(changed){changed=false;
  for(let i=0;i<result.length;i++){let b=result[i];for(const candidate of candidates)if(intersects(b,candidate)){const next=bounded(union(b,candidate));if(next.x!==b.x||next.y!==b.y||next.width!==b.width||next.height!==b.height){b=next;changed=true;}}result[i]=b;}
  for(let i=0;i<result.length;i++)for(let j=result.length-1;j>i;j--)if(intersects(result[i],result[j])){result[i]=bounded(union(result[i],result[j]));result.splice(j,1);changed=true;}
 }
 return result.sort((a,b)=>a.y-b.y||a.x-b.x);
}
export const boxesOverlap=(a:Box,b:Box)=>a.x<b.x+b.width&&a.x+a.width>b.x&&a.y<b.y+b.height&&a.y+a.height>b.y;
