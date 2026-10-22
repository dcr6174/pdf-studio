/** Original pin-collision simulation. Points are pixel positions in a 500×350 game stage. */
export type PegPoint={x:number;y:number};
export const pegLocations:PegPoint[]=Array.from({length:24},(_,i)=>({
 x:55+(i%6)*78+(Math.floor(i/6)%2)*38,
 y:78+Math.floor(i/6)*60
}));
export function simulatePegDrop(lane:number,number:number):{positions:PegPoint[];pocket:number;points:number}{
 const width=500,height=350,radius=9;
 let x=50+Math.max(0,Math.min(4,lane))*100,y=10,vx=((number*7+3)%5-2)*.04,vy=.1;
 const positions=[{x,y}];
 for(let step=0;step<1100;step++){
  vy=Math.min(8,vy+.12);vx*=.997;
  x+=vx;y+=vy;
  if(x<radius){x=radius;vx=Math.abs(vx)*.85;}
  if(x>width-radius){x=width-radius;vx=-Math.abs(vx)*.85;}
  for(let i=0;i<pegLocations.length;i++){
   const pin=pegLocations[i],dx=x-pin.x,dy=y-pin.y,d=Math.hypot(dx,dy);
   if(d>=radius+7)continue;
   const nx=d>0?dx/d:(i%2?1:-1),ny=d>0?dy/d:-1;
   x=pin.x+nx*(radius+7+.1);y=pin.y+ny*(radius+7+.1);
   const incoming=vx*nx+vy*ny;
   if(incoming<0){vx-=1.77*incoming*nx;vy-=1.77*incoming*ny;vx+=(i%2?-.085:.085);}
  }
  if(step%2===0)positions.push({x,y});
  if(y>=height-27)break;
 }
 const pocket=Math.max(0,Math.min(4,Math.floor(x/100)));
 return{positions,pocket,points:[25,50,100,50,25][pocket]};
}
