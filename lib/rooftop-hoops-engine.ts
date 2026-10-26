/** The actual 2D flight and contact rules used by Rooftop Hoops. No fake shot outcomes. */
export const HOOPS = {width:1000,height:600,rimY:263,hoopHalf:38,ballRadius:15,gravity:830,floorY:523};
export type HoopsPoint={x:number;y:number};
export type HoopsBall={x:number;y:number;vx:number;vy:number;age:number;rimHits:number;scored:boolean;grounded:boolean;done:boolean;settle:number};
export type HoopsEvent='swish'|'rim'|'board'|'bounce'|'miss'|null;
export type HoopsStep={ball:HoopsBall;event:HoopsEvent};
const clamp=(n:number,low:number,high:number)=>Math.max(low,Math.min(high,n));
export function hoopPosition(round:number){return 775+((round%3)-1)*24;}
export function shooterPosition(round:number){return 174+(Math.floor(round/3)%3)*34;}
export const launchY=440;
export function makeHoopsBall(angle:number,power:number,fromX:number):HoopsBall{
 const a=clamp(angle,26,78)*Math.PI/180;
 const speed=clamp(power,460,1170);
 return{x:fromX,y:launchY,vx:Math.cos(a)*speed,vy:-Math.sin(a)*speed,
  age:0,rimHits:0,scored:false,grounded:false,done:false,settle:0};
}
export function stepHoops(input:HoopsBall,dt:number,rimX:number):HoopsStep{
 const b={...input};
 if(b.done||dt<=0)return{ball:b,event:null};
 let event:HoopsEvent=null;
 const count=Math.max(1,Math.ceil(Math.min(.06,dt)/(.008)));
 const h=Math.min(dt,.06)/count;
 for(let i=0;i<count&&!b.done;i++){
  const previousY=b.y;
  b.age+=h;
  b.vy+=HOOPS.gravity*h;
  b.x+=b.vx*h;b.y+=b.vy*h;
  if(!b.scored&&b.vy>0&&previousY<HOOPS.rimY&&b.y>=HOOPS.rimY
   &&b.x>rimX-HOOPS.hoopHalf+HOOPS.ballRadius+2
   &&b.x<rimX+HOOPS.hoopHalf-HOOPS.ballRadius-2){
   b.scored=true;
   event='swish';b.vx*=.35;b.vy=Math.max(95,b.vy*.45);
  }
  if(!b.scored){
   // Backboard: a rectangular collision with a visible backboard at the right of the rim.
   const wallX=rimX+54;
   if(b.x+HOOPS.ballRadius>wallX&&b.x-HOOPS.ballRadius<wallX+10
    &&b.y>126&&b.y<HOOPS.rimY-4&&b.vx>0){
    b.x=wallX-HOOPS.ballRadius-.25;
    b.vx=-Math.abs(b.vx)*.66;
    event='board';
   }
   for(const px of [rimX-HOOPS.hoopHalf,rimX+HOOPS.hoopHalf]){
    const dx=b.x-px,dy=b.y-HOOPS.rimY,d=Math.hypot(dx,dy),limit=HOOPS.ballRadius+6;
    if(d>=limit||d<.01)continue;
    const nx=dx/d,ny=dy/d,dot=b.vx*nx+b.vy*ny;
    b.x=px+nx*(limit+.1);b.y=HOOPS.rimY+ny*(limit+.1);
    if(dot<0){b.vx-=1.72*dot*nx;b.vy-=1.72*dot*ny;b.rimHits++;
     event='rim';
    }
   }
  }
  if(b.y+HOOPS.ballRadius>=HOOPS.floorY){
   b.y=HOOPS.floorY-HOOPS.ballRadius;
   if(!b.grounded)event=b.scored?'bounce':'miss';
   b.grounded=true;
   if(Math.abs(b.vy)>34)b.vy=-Math.abs(b.vy)*.37;else b.vy=0;
   b.vx*=.84;b.settle+=h;
   if(b.settle>.38){b.done=true;b.vx=0;b.vy=0;}
  }
  if(b.x>1070||b.x<-65||b.age>4.1)b.done=true;
 }
 return{ball:b,event};
}
export function previewHoops(angle:number,power:number,fromX:number,rimX:number):HoopsPoint[]{
 let shot=makeHoopsBall(angle,power,fromX);
 const path:HoopsPoint[]=[{x:shot.x,y:shot.y}];
 for(let i=0;i<102&&!shot.done;i++){shot=stepHoops(shot,.027,rimX).ball;if(i%2===0)path.push({x:shot.x,y:shot.y});if(shot.scored)break;}
 return path;
}
export function evaluateHoopsScore(ball:HoopsBall,streak:number):number{
 if(!ball.scored)return 0;
 return(ball.rimHits===0?3:2)+(streak>=2?1:0);
}
