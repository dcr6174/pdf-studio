/** Rectangle drawn from any corner, clamped to the normalized visible page. */
export function regionBox(ax:number,ay:number,bx:number,by:number){
 const clamp=(n:number)=>Math.max(0,Math.min(1,n));
 const x1=clamp(ax),y1=clamp(ay),x2=clamp(bx),y2=clamp(by);
 return {x:Math.min(x1,x2),y:Math.min(y1,y2),w:Math.abs(x2-x1),h:Math.abs(y2-y1)};
}
