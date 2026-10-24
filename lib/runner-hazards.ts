/** The same wave definition powers runner rendering, controls and collision checks. */
export type RunningKind='highway'|'metro'|'jungle'|'snow'|'river'|'rocket';
export type Wave={lane:number;gate:number;type:'car'|'crate'|'overhead'|'log'|'vine'|'slalom'|'buoy'|'ring';index:number};
export function nextWave(kind:RunningKind,index:number):Wave{
 const n=Math.max(1,Math.floor(index));
 const lane=(n*7+Math.floor(n/3)+1)%3,gate=(n*5+2)%3;
 const high=(n*11+1)%4<2;
 return{index:n,lane,gate,type:kind==='highway'?'car':kind==='metro'?high?'crate':'overhead':kind==='jungle'?high?'log':'vine':kind==='snow'?'slalom':kind==='river'?'buoy':'ring'};
}
export function resolveWave(kind:RunningKind,wave:Wave,lane:number,jump:number,duck:number){
 if(kind==='snow'||kind==='river'||kind==='rocket')return{passed:lane===wave.gate,nearMiss:false,reason:lane===wave.gate?'Gate passed.':'You missed the marked gate.'};
 if(lane!==wave.lane)return{passed:true,nearMiss:kind==='highway'&&Math.abs(lane-wave.lane)===1,reason:'Avoided the obstacle.'};
 const avoided=kind==='metro'||kind==='jungle'?(wave.type==='crate'||wave.type==='log'?jump>0:duck>0):false;
 return{passed:avoided,nearMiss:false,reason:avoided?'Timed '+(wave.type==='crate'||wave.type==='log'?'jump':'slide')+' cleared the '+wave.type+'.':'Collided with '+wave.type+'.'};
}
export function nextTrafficX(time:number,lane:number){
 return((time*67+lane*127+59)%430)-35;
}
export function safeTrafficStep(time:number,lane:number){
 return Math.abs(nextTrafficX(time,lane)-180)>52;
}
