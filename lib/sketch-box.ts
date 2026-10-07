export type SketchPoint={x:number;y:number};
export function sketchBox(points:SketchPoint[],width:number,height:number,padding=4){
 if(!points.length||width<=0||height<=0)return null;
 const xs=points.map(p=>Math.max(0,Math.min(1,p.x))*width),ys=points.map(p=>Math.max(0,Math.min(1,p.y))*height);
 const left=Math.max(0,Math.floor(Math.min(...xs)-padding)),top=Math.max(0,Math.floor(Math.min(...ys)-padding));
 const right=Math.min(width,Math.ceil(Math.max(...xs)+padding)),bottom=Math.min(height,Math.ceil(Math.max(...ys)+padding));
 return {left,top,width:Math.max(1,right-left),height:Math.max(1,bottom-top),x:left/width,y:top/height,w:Math.max(1,right-left)/width,h:Math.max(1,bottom-top)/height};
}
export function sketchStroke(points:SketchPoint[],width:number,height:number,createCanvas:()=>HTMLCanvasElement=()=>document.createElement('canvas'),color='#1a293b',thickness=3){
 const box=sketchBox(points,width,height,Math.max(14,thickness/2+2));if(!box)return null;
 const canvas=createCanvas(),scale=2;canvas.width=Math.ceil(box.width*scale);canvas.height=Math.ceil(box.height*scale);
 const ctx=canvas.getContext('2d');if(!ctx)throw new Error('Drawing is unavailable in this browser.');
 try{ctx.scale(scale,scale);ctx.strokeStyle=color;ctx.fillStyle=color;ctx.lineWidth=thickness;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();points.forEach((p,i)=>{const x=p.x*width-box.left,y=p.y*height-box.top;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);});ctx.stroke();
 if(points.every(p=>p.x===points[0].x&&p.y===points[0].y)){ctx.beginPath();ctx.arc(points[0].x*width-box.left,points[0].y*height-box.top,thickness/2,0,Math.PI*2);ctx.fill();}
 return {x:box.x,y:box.y,w:box.w,h:box.h,sketch:{points:points.map(p=>({x:(p.x*width-box.left)/box.width,y:(p.y*height-box.top)/box.height})),width:box.width,height:box.height},image:canvas.toDataURL('image/png')};
 }finally{canvas.width=0;canvas.height=0;}
}
export function repaintSketch(sketch:{points:SketchPoint[];width:number;height:number},color:string,thickness:number){
 const canvas=document.createElement('canvas');canvas.width=Math.ceil(sketch.width*2);canvas.height=Math.ceil(sketch.height*2);const ctx=canvas.getContext('2d');if(!ctx)throw new Error('Drawing is unavailable.');
 try{ctx.scale(2,2);ctx.strokeStyle=color;ctx.fillStyle=color;ctx.lineWidth=thickness;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();sketch.points.forEach((p,i)=>{if(i)ctx.lineTo(p.x*sketch.width,p.y*sketch.height);else ctx.moveTo(p.x*sketch.width,p.y*sketch.height);});ctx.stroke();if(sketch.points.every(p=>p.x===sketch.points[0].x&&p.y===sketch.points[0].y)){ctx.beginPath();ctx.arc(sketch.points[0].x*sketch.width,sketch.points[0].y*sketch.height,thickness/2,0,Math.PI*2);ctx.fill();}return canvas.toDataURL('image/png');}finally{canvas.width=0;canvas.height=0;}
}
