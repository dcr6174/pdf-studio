/** Deterministic bowling-lane collision approximation used by the visible mini-game. */
export type BowlingPin={id:number;x:number;y:number};
export type BowlingShot={knocked:number[];trajectory:{x:number;y:number}[];pins:number;endX:number};
export const bowlingPins:BowlingPin[]=Array.from({length:10},(_,id)=>{
 const row=Math.floor((Math.sqrt(8*id+1)-1)/2),col=id-row*(row+1)/2;
 return{id,x:250+(col-row/2)*34,y:40+row*21};
});
export function simulateBowling(aim:number,power:number):BowlingShot{
 const targetX=250+(Math.max(0,Math.min(4,aim))-2)*36;
 const speed=5.5+Math.max(10,Math.min(100,power))*.025;
 const x0=250,y0=231,trajectory=[{x:x0,y:y0}];
 const fallen=new Set<number>(),momentum=new Map<number,number>();
 let x=x0,y=y0;
 for(let frame=0;frame<78;frame++){
  const p=Math.min(1,frame/64),steer=(targetX-x)*.065;
  x+=steer;y-=speed*.55;
  trajectory.push({x,y});
  for(const pin of bowlingPins){
   if(fallen.has(pin.id))continue;
   const distance=Math.hypot(x-pin.x,y-pin.y);
   if(distance<15){fallen.add(pin.id);momentum.set(pin.id,Math.max(.7,1.7*(1-p))); }
  }
  if(y<-5)break;
 }
 // Transfer energy to physically neighbouring pins. Individual pins can only fall once.
 for(let pass=0;pass<3;pass++){
  for(const pin of bowlingPins){
   if(fallen.has(pin.id))continue;
   let strongest=0;
   for(const other of bowlingPins){
    if(!fallen.has(other.id))continue;
    const d=Math.hypot(pin.x-other.x,pin.y-other.y);
    if(d<41)strongest=Math.max(strongest,(momentum.get(other.id)??0)*(1-d/95));
   }
   if(strongest>.55){fallen.add(pin.id);momentum.set(pin.id,strongest*.69);}
  }
 }
 const knocked=[...fallen].sort((a,b)=>a-b);
 return{knocked,trajectory,pins:knocked.length,endX:x};
}
