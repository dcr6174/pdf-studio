/** Spatial puzzle rules. Pure/testable: canvas gestures never determine correctness. */
export type Point={x:number;y:number};
export type Edge=[number,number];
export type UntangleLevel={points:Point[];solution:Point[];edges:Edge[]};
const ringLevels=[5,6,7,8,9] as const;
export function properIntersection(a:Point,b:Point,c:Point,d:Point):boolean{
 const orientation=(p:Point,q:Point,r:Point)=>(q.x-p.x)*(r.y-p.y)-(q.y-p.y)*(r.x-p.x);
 const a1=orientation(a,b,c),a2=orientation(a,b,d),b1=orientation(c,d,a),b2=orientation(c,d,b);
 return a1*a2<-.001&&b1*b2<-.001;
}
export function crossingCount(points:readonly Point[],edges:readonly Edge[]):number{
 let count=0;
 for(let i=0;i<edges.length;i++)for(let j=i+1;j<edges.length;j++){
  const [a,b]=edges[i],[c,d]=edges[j];
  if(a===c||a===d||b===c||b===d)continue;
  if(properIntersection(points[a],points[b],points[c],points[d]))count++;
 }
 return count;
}
export function generateUntangle(level:number,seed=0):UntangleLevel{
 const n=ringLevels[Math.max(0,Math.min(4,level))],solution:Point[]=[];
 for(let i=0;i<n;i++){
  const angle=2*Math.PI*i/n-Math.PI/2;
  solution.push({x:250+149*Math.cos(angle),y:187+135*Math.sin(angle)});
 }
 solution.push({x:250,y:187});
 const center=n,edges:Edge[]=[];
 for(let i=0;i<n;i++){edges.push([i,(i+1)%n]);edges.push([i,center]);}
 let points:Point[]=solution.map(p=>({...p}));
 for(let variant=0;variant<20;variant++){
  const order=Array.from({length:n+1},(_,i)=>i);
  let s=(((seed+1)*2654435761)^((level+3+variant)*194723))>>>0;
  for(let i=order.length-1;i>0;i--){s=(Math.imul(s,1664525)+1013904223)>>>0;const j=s%(i+1);[order[i],order[j]]=[order[j],order[i]];}
  points=order.map(i=>({...solution[i]}));
  if(crossingCount(points,edges)>=Math.min(3,level+2))break;
 }
 return{points,solution,edges};
}
export type PackingTile={id:string;cells:Point[];x:number;y:number};
export type PackingPlacement={id:string;x:number;y:number;turns:number};
export type PackingLevel={name:string;pieces:PackingTile[]};
const templates:{name:string;pieces:[string,[number,number][],number,number][]}[]=[
 {name:'Garden mosaic',pieces:[
 ['F',[[0,0],[0,1],[1,1],[1,2],[2,1]],0,0],
 ['L',[[0,0],[1,0],[2,0],[3,0],[3,1]],1,0],
 ['P',[[0,0],[0,1],[0,2],[1,1],[1,2]],3,1],
 ['U',[[0,0],[0,1],[1,1],[2,0],[2,1]],0,2],
 ['I',[[0,0],[1,0],[2,0],[3,0],[4,0]],0,4]
 ]},
 {name:'Harbor blocks',pieces:[
 ['F',[[0,0],[0,1],[1,1],[1,2],[2,1]],0,0],
 ['Y',[[0,0],[1,0],[2,0],[2,1],[3,0]],1,0],
 ['T',[[0,1],[1,1],[2,0],[2,1],[2,2]],2,1],
 ['L',[[0,0],[0,1],[1,1],[2,1],[3,1]],0,2],
 ['I',[[0,0],[1,0],[2,0],[3,0],[4,0]],0,4]
 ]},
 {name:'Mountain quilt',pieces:[
 ['F',[[0,0],[0,1],[1,1],[1,2],[2,1]],0,0],
 ['V',[[0,0],[1,0],[2,0],[2,1],[2,2]],1,0],
 ['I',[[0,0],[0,1],[0,2],[0,3],[0,4]],4,0],
 ['U',[[0,0],[0,1],[1,1],[2,0],[2,1]],0,2],
 ['L',[[0,1],[1,1],[2,1],[3,0],[3,1]],0,3]
 ]},
 {name:'Sunset terrace',pieces:[
 ['I',[[0,0],[0,1],[0,2],[0,3],[0,4]],0,0],
 ['L',[[0,0],[0,1],[1,0],[2,0],[3,0]],1,0],
 ['U',[[0,0],[0,2],[1,0],[1,1],[1,2]],3,1],
 ['Y',[[0,1],[1,0],[1,1],[2,1],[3,1]],1,3],
 ['F',[[0,1],[0,2],[1,0],[1,1],[2,1]],1,1]
 ]}
];
export const PACKING_LEVEL_COUNT=templates.length;
export function packingLevel(level:number):PackingLevel{
 const t=templates[Math.max(0,Math.min(PACKING_LEVEL_COUNT-1,level))];
 return{name:t.name,pieces:t.pieces.map(([id,cells,x,y])=>({id,cells:cells.map(([x,y])=>({x,y})),x,y}))};
}
export function rotatePacking(cells:readonly Point[],turns:number):Point[]{
 let current=cells.map(c=>({...c}));
 for(let i=0;i<((turns%4)+4)%4;i++)current=current.map(({x,y})=>({x:-y,y:x}));
 const x=Math.min(...current.map(p=>p.x)),y=Math.min(...current.map(p=>p.y));
 return current.map(p=>({x:p.x-x,y:p.y-y}));
}
export function occupiedPacking(level:PackingLevel,placements:readonly PackingPlacement[],exclude?:string):Set<string>{
 const occupied=new Set<string>();
 for(const place of placements){
  if(place.id===exclude)continue;
  const tile=level.pieces.find(p=>p.id===place.id);
  if(!tile)continue;
  for(const p of rotatePacking(tile.cells,place.turns))occupied.add((p.x+place.x)+','+(p.y+place.y));
 }
 return occupied;
}
export function validPackingMove(level:PackingLevel,placements:readonly PackingPlacement[],candidate:PackingPlacement):boolean{
 const tile=level.pieces.find(p=>p.id===candidate.id);
 if(!tile)return false;
 const used=occupiedPacking(level,placements,candidate.id);
 return rotatePacking(tile.cells,candidate.turns).every(p=>{
  const x=p.x+candidate.x,y=p.y+candidate.y;
  return x>=0&&x<5&&y>=0&&y<5&&!used.has(x+','+y);
 });
}
export function packingComplete(level:PackingLevel,placements:readonly PackingPlacement[]):boolean{
 if(placements.length!==level.pieces.length)return false;
 if(new Set(placements.map(p=>p.id)).size!==placements.length)return false;
 return placements.every(p=>validPackingMove(level,placements,p))&&occupiedPacking(level,placements).size===25;
}
