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


/** Arrowhead in local top-left normalized coordinates; shared by preview and PDF export. */
export function arrowHead(width:number,height:number){const len=Math.hypot(width,height),ux=width/len,uy=height/len,head=Math.min(10,len/3,width*.6,height*.6);return [-1,1].map(side=>({x:Math.max(0,Math.min(1,(width-ux*head-uy*head*.5*side)/width)),y:Math.max(0,Math.min(1,(height-uy*head+ux*head*.5*side)/height))}));}
export function arrowPreview(width:number,height:number){return arrowHead(width,height).map(p=>`M ${p.x*100} ${p.y*100} L 100 100`).join(' ');}
