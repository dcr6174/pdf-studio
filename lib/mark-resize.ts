export const resizeHandles = ['nw','n','ne','e','se','s','sw','w'] as const;
export type ResizeHandle = typeof resizeHandles[number];
type Box = {x:number;y:number;w:number;h:number};
const clamp=(v:number,lo:number,hi:number)=>Math.max(lo,Math.min(hi,v));
/** Normalized displayed-page coordinates; opposite edges stay anchored. */
export function resizeBox<T extends Box>(b:T,handle:ResizeHandle,dx:number,dy:number,proportional=false):T {
 const west=handle.includes('w'),east=handle.includes('e'),north=handle.includes('n'),south=handle.includes('s');
 if(proportional&&(west||east)&&(north||south)){
  const sx=west?-1:1,sy=north?-1:1;
  const change=Math.abs(dx/b.w)>=Math.abs(dy/b.h)?sx*dx/b.w:sy*dy/b.h;
  const maxW=west?b.x+b.w:1-b.x,maxH=north?b.y+b.h:1-b.y;
  const scale=clamp(1+change,Math.max(.03/b.w,.02/b.h),Math.min(maxW/b.w,maxH/b.h));
  const w=b.w*scale,h=b.h*scale;
  return {...b,x:west?b.x+b.w-w:b.x,y:north?b.y+b.h-h:b.y,w,h};
 }
 const left=west?clamp(b.x+dx,0,b.x+b.w-.03):b.x;
 const top=north?clamp(b.y+dy,0,b.y+b.h-.02):b.y;
 const right=east?clamp(b.x+b.w+dx,b.x+.03,1):b.x+b.w;
 const bottom=south?clamp(b.y+b.h+dy,b.y+.02,1):b.y+b.h;
 return {...b,x:left,y:top,w:right-left,h:bottom-top};
}
