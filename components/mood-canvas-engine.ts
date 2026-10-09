export type Point = {x:number;y:number};
export type Mark = {kind:'brush'|'eraser';color:string;size:number;points:Point[]} | {kind:'stamp';emoji:string;point:Point};

// Retain marks rather than a bitmap so resizing never clears the day's work.
export function renderMoodCanvas(canvas:HTMLCanvasElement, marks:Mark[], width:number, height:number, dpr:number){
  const pixelWidth=Math.round(width*dpr),pixelHeight=Math.round(height*dpr);
  if(canvas.width!==pixelWidth||canvas.height!==pixelHeight){canvas.width=pixelWidth;canvas.height=pixelHeight;}
  const ctx=canvas.getContext('2d');if(!ctx)return;
  ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.setTransform(dpr,0,0,dpr,0,0);
  for(const mark of marks){
    ctx.globalCompositeOperation=mark.kind==='eraser'?'destination-out':'source-over';
    if(mark.kind==='stamp'){
      ctx.font='42px "Apple Color Emoji","Segoe UI Emoji",sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
      ctx.fillText(mark.emoji,mark.point.x*width,mark.point.y*height);continue;
    }
    ctx.strokeStyle=mark.color;ctx.fillStyle=mark.color;ctx.lineWidth=mark.size;ctx.lineCap='round';ctx.lineJoin='round';
    const first=mark.points[0];if(!first)continue;
    if(mark.points.length===1){ctx.beginPath();ctx.arc(first.x*width,first.y*height,mark.size/2,0,Math.PI*2);ctx.fill();continue;}
    ctx.beginPath();ctx.moveTo(first.x*width,first.y*height);
    for(let i=1;i<mark.points.length;i++){
      const p=mark.points[i],next=mark.points[i+1];
      if(next)ctx.quadraticCurveTo(p.x*width,p.y*height,(p.x+next.x)*width/2,(p.y+next.y)*height/2);
      else ctx.lineTo(p.x*width,p.y*height);
    }
    ctx.stroke();
  }
  ctx.globalCompositeOperation='source-over';
}
