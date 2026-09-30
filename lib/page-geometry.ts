import type {PDFPage} from 'pdf-lib';
export function pageGeometry(p:PDFPage,extra=0){
  const box=p.getCropBox(),r=((p.getRotation().angle+extra)%360+360)%360;
  const width=r%180?box.height:box.width,height=r%180?box.width:box.height;
  // Display coordinates use bottom-left origin; translate to the visible CropBox.
  const matrix=r===90?[0,1,-1,0,box.x+box.width,box.y]:r===180?[-1,0,0,-1,box.x+box.width,box.y+box.height]:r===270?[0,-1,1,0,box.x,box.y+box.height]:[1,0,0,1,box.x,box.y];
  return {width,height,rotation:r,matrix};
}
export function displayPoint(p:PDFPage,u:number,v:number){const g=pageGeometry(p),[a,b,c,d,e,f]=g.matrix,x=u*g.width,y=(1-v)*g.height;return {x:a*x+c*y+e,y:b*x+d*y+f};}
export function safeLink(value:string){try{const u=new URL(value);return ['http:','https:','mailto:'].includes(u.protocol)?u.href:undefined;}catch{return undefined;}}
