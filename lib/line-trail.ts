/** Authored Euler-trail puzzles: every edge can be traced exactly once from the marked start. */
export type TrailPoint={x:number;y:number};
export type TrailEdge=[number,number];
const trails=[
 [0,1,2,3,0,4,2],
 [0,1,2,3,4,0,5,2,6,4],
 [0,1,2,3,0,4,5,2,6,1,7,4],
 [0,1,2,3,4,5,0,6,2,7,4,8,6,5],
 [0,1,2,3,4,5,0,6,2,7,4,8,6,9,5,7,1]
];
export const TRAIL_LEVELS=trails.length;
export const trailKey=(a:number,b:number)=>Math.min(a,b)+','+Math.max(a,b);
export function trailLevel(index:number,seed=0){
 const trail=trails[Math.min(TRAIL_LEVELS-1,Math.max(0,index))];
 const count=Math.max(...trail)+1;
 const points=Array.from({length:count},(_,i):TrailPoint=>{
  const angle=(i/count)*2*Math.PI-Math.PI/2+Math.min(0.24,Math.abs(seed)%5*.035);
  const radius=130+(i%2)*17;
  return{x:240+radius*Math.cos(angle),y:171+(radius*.82)*Math.sin(angle)};
 });
 const edges:TrailEdge[]=trail.slice(1).map((n,i)=>[trail[i],n]);
 return{points,edges,trail:[...trail],start:trail[0],end:trail.at(-1)};
}
export function isLegalTrailStep(edges:readonly TrailEdge[],used:ReadonlySet<string>,from:number,to:number){
 const key=trailKey(from,to);
 return from!==to&&!used.has(key)&&edges.some(([a,b])=>trailKey(a,b)===key);
}
export function trailComplete(edges:readonly TrailEdge[],used:ReadonlySet<string>){
 return used.size===edges.length&&edges.every(([a,b])=>used.has(trailKey(a,b)));
}
