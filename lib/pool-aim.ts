/** Directional cue ray: first cushion or object-ball contact. Pure geometry, no assets. */
export type RayBall={id:number;x:number;y:number;potted:boolean};
export function cueGuide(cue:{x:number;y:number},angle:number,balls:readonly RayBall[],radius=21.5){
 const ux=Math.cos(angle),uy=Math.sin(angle);
 const candidates=[
  ux>0?(599-cue.x)/ux:ux<0?(41-cue.x)/ux:Infinity,
  uy>0?(320-cue.y)/uy:uy<0?(40-cue.y)/uy:Infinity
 ].filter(x=>x>=0&&Number.isFinite(x));
 let distance=Math.min(520,...candidates),hitId:number|null=null;
 for(const b of balls){
  if(b.id===0||b.potted)continue;
  const dx=b.x-cue.x,dy=b.y-cue.y,along=dx*ux+dy*uy;
  if(along<=0||along>=distance+radius)continue;
  const perp2=dx*dx+dy*dy-along*along;
  if(perp2>radius*radius)continue;
  const contact=along-Math.sqrt(Math.max(0,radius*radius-perp2));
  if(contact>=0&&contact<distance){distance=contact;hitId=b.id;}
 }
 const end={x:cue.x+ux*distance,y:cue.y+uy*distance};
 return{...end,distance,hitId,objectHit:hitId!==null};
}
