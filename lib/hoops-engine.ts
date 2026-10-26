/** Original Rooftop Hoops physics: coordinates and scoring all share one model. */
export type HoopsEvent='release'|'rim'|'glass'|'floor'|'swish'|'settled';
export type HoopsCourt={width:number;height:number;ground:number;rimY:number;rimLeft:number;rimRight:number;boardX:number;boardTop:number;boardBottom:number;radius:number;gravity:number;launchY:number};
export type HoopsBall={
 court:HoopsCourt;
 x:number;y:number;vx:number;vy:number;rotation:number;elapsed:number;
 rimHits:number;floorHits:number;scored:boolean;finished:boolean;events:HoopsEvent[];
};
export const HOOPS:HoopsCourt={width:960,height:540,ground:475,rimY:240,rimLeft:723,rimRight:820,boardX:843,boardTop:130,boardBottom:252,radius:16,gravity:885,launchY:390};
export const MOBILE_HOOPS:HoopsCourt={width:540,height:710,ground:655,rimY:285,rimLeft:411,rimRight:493,boardX:511,boardTop:176,boardBottom:302,radius:14,gravity:930,launchY:555};
export const HOOPS_SHOTS=12;
export const HOOPS_SPOTS=[170,270,360,210,315,155,285,365,190,300,240,340] as const;
export const MOBILE_HOOPS_SPOTS=[105,155,205,125,190,100,170,215,120,205,145,200] as const;
export function releaseHoopsBall(startX:number,angleDeg:number,power:number,court:HoopsCourt=HOOPS):HoopsBall{
 const a=Math.max(22,Math.min(82,angleDeg))*Math.PI/180;
 const speed=490+Math.max(10,Math.min(100,power))*5.2;
 return{court,x:startX,y:court.launchY,vx:Math.cos(a)*speed,vy:-Math.sin(a)*speed,rotation:0,elapsed:0,
  rimHits:0,floorHits:0,scored:false,finished:false,events:['release']};
}
function rimCollision(ball:HoopsBall,rx:number,ry:number){
 const dx=ball.x-rx,dy=ball.y-ry,dist=Math.hypot(dx,dy),minDist=ball.court.radius+7.5;
 if(dist>=minDist||dist<.001)return false;
 const nx=dx/dist,ny=dy/dist,normal=ball.vx*nx+ball.vy*ny;
 ball.x=rx+nx*minDist;ball.y=ry+ny*minDist;
 if(normal<0){ball.vx-=1.62*normal*nx;ball.vy-=1.62*normal*ny;ball.vx*=.89;ball.vy*=.89;ball.rotation+=.25;ball.rimHits++;ball.events.push('rim');}
 return true;
}
/** Mutates the provided *independent* step-state, to avoid allocations each frame. */
export function stepHoopsBall(ball:HoopsBall,dt:number):HoopsBall{
 if(ball.finished||dt<=0)return ball;
 ball.events=[];
 const steps=Math.max(1,Math.ceil(Math.min(dt,.06)/.008)),h=Math.min(dt,.06)/steps;
 for(let k=0;k<steps&&!ball.finished;k++){
  const previousY=ball.y,previousX=ball.x;
  ball.elapsed+=h;
  ball.vy+=ball.court.gravity*h;
  ball.x+=ball.vx*h;ball.y+=ball.vy*h;
  ball.rotation+=(ball.vx/(ball.court.radius*1.5))*h;
  // A basket is scored only when the centre of the ball passes DOWN through the rim gap.
  const edge=ball.court.radius+3;
  const crossing=previousY<ball.court.rimY&&ball.y>=ball.court.rimY&&ball.vy>0;
  if(!ball.scored&&crossing){
   const fraction=(ball.court.rimY-previousY)/(ball.y-previousY||1);
   const crossedX=previousX+(ball.x-previousX)*fraction;
   if(crossedX>ball.court.rimLeft+edge&&crossedX<ball.court.rimRight-edge){
    ball.scored=true;ball.events.push('swish');
   }
  }
  // Backboard and front-facing glass; ball reacts visibly instead of clipping through it.
  if(ball.x+ball.court.radius>=ball.court.boardX&&previousX+ball.court.radius<ball.court.boardX&&
     ball.y>ball.court.boardTop-ball.court.radius&&ball.y<ball.court.boardBottom+ball.court.radius){
   ball.x=ball.court.boardX-ball.court.radius;
   ball.vx=-Math.abs(ball.vx)*.72;
   ball.vy*=.91;ball.events.push('glass');
  }
  if(!ball.scored){
   rimCollision(ball,ball.court.rimLeft,ball.court.rimY);
   rimCollision(ball,ball.court.rimRight,ball.court.rimY);
  }
  if(ball.x>ball.court.width+70||ball.x<-70||ball.elapsed>4.2){ball.finished=true;ball.events.push('settled');break;}
  if(ball.y+ball.court.radius>ball.court.ground){
   ball.y=ball.court.ground-ball.court.radius;
   if(ball.floorHits===0)ball.events.push('floor');
   ball.floorHits++;
   if(ball.scored||Math.abs(ball.vy)<110||ball.floorHits>4){
    ball.finished=true;ball.vy=0;ball.events.push('settled');
   }else{ball.vy=-Math.abs(ball.vy)*.38;ball.vx*=.66;}
  }
 }
 return ball;
}
export function traceHoopsShot(startX:number,angle:number,power:number,court:HoopsCourt=HOOPS){
 const shot=releaseHoopsBall(startX,angle,power,court);
 const points:{x:number;y:number}[]=[];
 for(let i=0;i<230&&!shot.finished;i++){
  if(i%4===0)points.push({x:shot.x,y:shot.y});
  stepHoopsBall(shot,1/90);
  if(shot.scored){points.push({x:shot.x,y:shot.y});break;}
 }
 return points;
}
export function hoopsPoints(startX:number,swish:boolean,rimHits:number,court:HoopsCourt=HOOPS){
 // Further shooting spots award three; all other made baskets score two.
 const far=court.rimLeft-startX>(court.width*.53);
 return far&&swish&&rimHits===0?3:2;
}
export function hoopsResultText(ball:HoopsBall,points:number){
 if(ball.scored)return ball.rimHits?'BANK SHOT! +'+points:points===3?'NOTHING BUT NET! +3':'SWISH! +2';
 return ball.rimHits?'RIM OUT! Try a softer arc.':'MISSED! Adjust your angle and power.';
}
