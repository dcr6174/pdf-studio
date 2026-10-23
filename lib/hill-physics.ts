/** Original lightweight 2D hill-driving simulation. Units: px, seconds and normalized physics. */
export type HillTrack='meadow'|'canyon'|'ridge';
export type HillInput={gas:boolean;brake:boolean;jump:boolean;tilt:-1|0|1};
export type HillModel={x:number;y:number;vx:number;vy:number;angle:number;spin:number;fuel:number;damage:number;best:number;time:number;airborne:boolean;collected:number[];hazards:number[];done:boolean};
export type HillEvent='none'|'jump'|'fuel'|'collision'|'finished'|'empty'|'wrecked';
export const hillGoal=1500;
const clamp=(v:number,a:number,b:number)=>Math.min(b,Math.max(a,v));
export const hillFuelStations=[210,465,735,1000,1260];
export const hillRocks=[345,630,945,1180,1400];
export function hillHeight(x:number,track:HillTrack='meadow'){
 const h=track==='meadow'?0:track==='canyon'?1:2;
 const amplitude=[27,45,55][h],frequency=[72,54,47][h];
 return 273+Math.sin(x/frequency)*amplitude+Math.sin(x/(26-h*3))*[8,13,17][h]+Math.sin(x/198)*24;
}
export function hillSlope(x:number,track:HillTrack='meadow'){
 return (hillHeight(x+3,track)-hillHeight(x-3,track))/6;
}
export function createHill(track:HillTrack='meadow'):HillModel{
 const x=55;return{x,y:hillHeight(x,track)-28,vx:0,vy:0,angle:0,spin:0,fuel:100,damage:0,best:x,time:0,airborne:false,collected:[],hazards:[],done:false};
}
export function stepHill(model:HillModel,input:HillInput,dt:number,track:HillTrack='meadow'):{state:HillModel;event:HillEvent}{
 if(model.done)return{state:model,event:'none'};
 const t=clamp(dt,0,0.05),s={...model,collected:[...model.collected],hazards:[...model.hazards]};
 s.time+=t;
 const slope=hillSlope(s.x,track),hasFuel=s.fuel>0;
 const drive=input.gas&&hasFuel?108:0,brake=input.brake?140:0;
 const friction=s.vx>0?14:s.vx<0?-14:0;
 const slopeForce=clamp(slope*70,-73,73);
 let a=drive-slopeForce-friction;
 if(input.brake)a-=Math.sign(s.vx||1)*brake;
 s.vx=clamp(s.vx+a*t,-22,127);
 if(!input.gas&&Math.abs(s.vx)<2)s.vx=0;
 if(input.gas&&hasFuel)s.fuel=Math.max(0,s.fuel-6.5*t);
 s.x=Math.max(5,s.x+s.vx*t);
 s.best=Math.max(s.best,s.x);
 const ground=hillHeight(s.x,track)-29;
 let event:HillEvent='none';
 if(input.jump&&!s.airborne&&s.vx>8){s.vy=-218;s.airborne=true;event='jump';}
 if(s.airborne){
  s.vy=clamp(s.vy+430*t,-300,365);
  s.y+=s.vy*t;
  s.spin=clamp(s.spin+input.tilt*1.5*t,-2.6,2.6);
  s.angle+=s.spin*t;
  if(s.y>=ground&&s.vy>=0){
   s.y=ground;s.vy=0;s.airborne=false;
   if(Math.abs(s.angle-Math.atan(slope))>1.14&&Math.abs(s.vx)>20){s.damage++;event='collision';s.vx*=.35;}
  }
 }else{
  s.y=ground;
  const target=Math.atan(slope);
  s.spin=clamp(s.spin+(target-s.angle)*10*t+input.tilt*2*t-s.spin*6*t,-3,3);
  s.angle=clamp(s.angle+s.spin*t,-1.5,1.5);
 }
 for(const p of hillFuelStations)if(!s.collected.includes(p)&&Math.abs(s.x-p)<11){
  s.collected.push(p);s.fuel=Math.min(100,s.fuel+35);event='fuel';
 }
 for(const rock of hillRocks)if(!s.hazards.includes(rock)&&Math.abs(s.x-rock)<12){
  s.hazards.push(rock);
  if(!s.airborne&&Math.abs(s.vx)>18){s.damage++;s.vx*=.45;event='collision';}
 }
 if(s.best>=hillGoal){s.done=true;event='finished';}
 else if(s.damage>=3){s.done=true;event='wrecked';}
 else if(s.fuel<=0&&Math.abs(s.vx)<3){s.done=true;event='empty';}
 return{state:s,event};
}
