export type SketchPoint={x:number;y:number};
export function sketchBox(points:SketchPoint[],width:number,height:number,padding=4){
 if(!points.length||width<=0||height<=0)return null;
 const xs=points.map(p=>Math.max(0,Math.min(1,p.x))*width),ys=points.map(p=>Math.max(0,Math.min(1,p.y))*height);
 const left=Math.max(0,Math.floor(Math.min(...xs)-padding)),top=Math.max(0,Math.floor(Math.min(...ys)-padding));
 const right=Math.min(width,Math.ceil(Math.max(...xs)+padding)),bottom=Math.min(height,Math.ceil(Math.max(...ys)+padding));
 return {left,top,width:Math.max(1,right-left),height:Math.max(1,bottom-top),x:left/width,y:top/height,w:Math.max(1,right-left)/width,h:Math.max(1,bottom-top)/height};
}
export function sketchStroke(points:SketchPoint[],width:number,height:number,createCanvas:()=>HTMLCanvasElement=()=>document.createElement('canvas')){
 const box=sketchBox(points,width,height);if(!box)return null;
 const canvas=createCanvas(),scale=2;canvas.width=Math.ceil(box.width*scale);canvas.height=Math.ceil(box.height*scale);
 const ctx=canvas.getContext('2d');if(!ctx)throw new Error('Drawing is unavailable in this browser.');
 try{ctx.scale(scale,scale);ctx.strokeStyle='#1a293b';ctx.fillStyle='#1a293b';ctx.lineWidth=3;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();points.forEach((p,i)=>{const x=p.x*width-box.left,y=p.y*height-box.top;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);});ctx.stroke();
 if(points.every(p=>p.x===points[0].x&&p.y===points[0].y)){ctx.beginPath();ctx.arc(points[0].x*width-box.left,points[0].y*height-box.top,1.5,0,Math.PI*2);ctx.fill();}
 return {x:box.x,y:box.y,w:box.w,h:box.h,image:canvas.toDataURL('image/png')};
 }finally{canvas.width=0;canvas.height=0;}
}
