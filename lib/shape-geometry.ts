export type ShapePoint={x:number;y:number};
export type DrawShape='line'|'arrow'|'rectangle'|'ellipse';
export function shapeFromDrag(kind:DrawShape,start:ShapePoint,end:ShapePoint){
 const clamp=(p:ShapePoint)=>({x:Math.max(0,Math.min(1,p.x)),y:Math.max(0,Math.min(1,p.y))});
 start=clamp(start);end=clamp(end);if(Math.hypot(end.x-start.x,end.y-start.y)<.002)return null;
 const x=Math.min(start.x,end.x,.998),y=Math.min(start.y,end.y,.998),w=Math.max(.002,Math.abs(end.x-start.x)),h=Math.max(.002,Math.abs(end.y-start.y));
 const width=Math.min(w,1-x),height=Math.min(h,1-y);if(width<=0||height<=0)return null;
 return {kind,x,y,w:width,h:height,...(['line','arrow'].includes(kind)?{lineStart:{x:(start.x-x)/width,y:(start.y-y)/height},lineEnd:{x:(end.x-x)/width,y:(end.y-y)/height}}:{})};
}
export function lineSegments(start:ShapePoint={x:0,y:0},end:ShapePoint={x:1,y:1},width:number,height:number,arrow=false){
 const a={x:start.x*width,y:start.y*height},b={x:end.x*width,y:end.y*height};const segments=[{start:a,end:b}];
 if(arrow){const dx=b.x-a.x,dy=b.y-a.y,length=Math.hypot(dx,dy);if(length>0){const size=Math.min(12,length*.3),ux=dx/length,uy=dy/length;for(const side of [-1,1])segments.push({start:b,end:{x:b.x-ux*size+side*uy*size*.5,y:b.y-uy*size-side*ux*size*.5}});}}
 return segments;
}
