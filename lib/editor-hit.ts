import {lineSegments} from './shape-geometry';
import type {Mark} from './pdf-engine';
function segmentDistance(x:number,y:number,ax:number,ay:number,bx:number,by:number){const dx=bx-ax,dy=by-ay,t=Math.max(0,Math.min(1,((x-ax)*dx+(y-ay)*dy)/(dx*dx+dy*dy||1)));return Math.hypot(x-ax-t*dx,y-ay-t*dy);}
export function hitsAddedMark(m:Mark,x:number,y:number,width:number,height:number){
 const px=(x-m.x)*width,py=(y-m.y)*height,w=m.w*width,h=m.h*height,t=Math.max(8,(m.strokeWidth??2)/2+4);
 if(px< -t||py< -t||px>w+t||py>h+t)return false;
 if(m.sketch){const points=m.sketch.points;return points.some((p,i)=>{const a=points[Math.max(0,i-1)];return segmentDistance(px,py,a.x*w,a.y*h,p.x*w,p.y*h)<=t;});}
 if(m.kind==='line'||m.kind==='arrow'){return lineSegments(m.lineStart,m.lineEnd,w,h,m.kind==='arrow').some(s=>segmentDistance(px,py,s.start.x,s.start.y,s.end.x,s.end.y)<=t);}
 if(m.kind==='rectangle')return Math.min(Math.abs(px),Math.abs(py),Math.abs(px-w),Math.abs(py-h))<=t;
 if(m.kind==='ellipse'){const d=Math.hypot((px-w/2)/(w/2||1),(py-h/2)/(h/2||1));return Math.abs(d-1)*Math.min(w,h)/2<=t;}
 return px>=0&&py>=0&&px<=w&&py<=h;
}
