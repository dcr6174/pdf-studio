/** Readable, reproducible sports contacts. Renderer consumes exactly these positions. */
export type PenaltyOutcome={
 targetX:number;targetY:number;keeperX:number;keeperLane:number;saved:boolean;reason:string;
};
export function simulatePenalty(round:number,lane:number,power:number):PenaltyOutcome{
 const lanes=[110,250,390];
 const aim=Math.max(0,Math.min(2,Math.floor(lane)));
 const kick=Math.max(0,Math.min(100,power));
 // Goalkeeper starts in the center, then reacts to the moving ball, not a pre-shown correct lane.
 const keeperLane=(Math.imul(round+1,73)+Math.floor(kick/17))%3;
 const keeperX=lanes[keeperLane];
 const targetX=lanes[aim]+((round*7)%13-6);
 const targetY=kick>75?71:kick>40?105:135;
 const spread=kick<20;
 const saved=!spread&&Math.abs(targetX-keeperX)<(kick>=78?31:70);
 const reason=spread?'The kick lacked enough power to reach the goal.':saved?'The keeper reached the ball.':'Ball passed the diving keeper.';
 return{targetX,targetY,keeperX,keeperLane,saved,reason};
}
export type Pin={id:number;x:number;y:number};
export const tenPins:Pin[]=Array.from({length:10},(_,i)=>{
 const row=Math.floor((Math.sqrt(8*i+1)-1)/2);
 const col=i-row*(row+1)/2;
 return{id:i,x:250+(col-row/2)*31,y:62+row*20};
});
/** Project a rolling ball across the drawn pin rack, resolving physical contact plus nearby pin-to-pin topple. */
export function rollBowlingBall(aim:number,power:number,standing:readonly number[],hook=0){
 const lane=(Math.max(0,Math.min(4,aim))-2)*37;
 const strength=Math.max(0,Math.min(100,power));
 const launchX=250+lane;
 const endX=launchX+hook*26+(strength-55)*.32;
 const radius=10+strength*.045;
 const contacted:number[]=[];
 const remaining=new Set(standing);
 // Rack is resolved from the near row back towards the head pin.
 const byApproach=tenPins.filter(p=>remaining.has(p.id)).sort((a,b)=>b.y-a.y);
 for(const pin of byApproach){
  const progress=(226-pin.y)/170;
  const bx=250+(endX-250)*progress;
  if(Math.abs(bx-pin.x)<radius+8){
   remaining.delete(pin.id);contacted.push(pin.id);
   if(strength>45){
    for(const neighbour of tenPins){
     if(remaining.has(neighbour.id)&&Math.hypot(neighbour.x-pin.x,neighbour.y-pin.y)<34&&((pin.id+neighbour.id+strength)%5<3)){
      remaining.delete(neighbour.id);contacted.push(neighbour.id);
     }
    }
   }
  }
 }
 return{contacted:[...new Set(contacted)],endX,launchX,track:tenPins.map(p=>({x:250+(endX-250)*((226-p.y)/170),y:p.y})),remaining:[...remaining]};
}
