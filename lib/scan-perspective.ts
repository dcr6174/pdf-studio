export type Point={x:number;y:number};
/** Map an output rectangle onto a convex source quadrilateral using a homography. */
export function perspectiveMap(corners:Point[]){
 if(corners.length!==4||corners.some(p=>!Number.isFinite(p.x)||!Number.isFinite(p.y)))throw new Error('Choose four valid corners.');
 const cross=corners.map((p,i)=>{const q=corners[(i+1)%4],r=corners[(i+2)%4];return(q.x-p.x)*(r.y-q.y)-(q.y-p.y)*(r.x-q.x);});
 if(cross.some(v=>v<=1e-6))throw new Error('Corners must form a clockwise, non-overlapping document rectangle.');
 const matrix:number[][]=[];for(let i=0;i<4;i++){const [u,v]=[[0,0],[1,0],[1,1],[0,1]][i],{x,y}=corners[i];matrix.push([u,v,1,0,0,0,-u*x,-v*x,x],[0,0,0,u,v,1,-u*y,-v*y,y]);}
 for(let col=0;col<8;col++){let pivot=col;for(let row=col+1;row<8;row++)if(Math.abs(matrix[row][col])>Math.abs(matrix[pivot][col]))pivot=row;[matrix[col],matrix[pivot]]=[matrix[pivot],matrix[col]];const d=matrix[col][col];if(Math.abs(d)<1e-10)throw new Error('The selected corners are too close together.');for(let j=col;j<9;j++)matrix[col][j]/=d;for(let row=0;row<8;row++){if(row===col)continue;const f=matrix[row][col];for(let j=col;j<9;j++)matrix[row][j]-=f*matrix[col][j];}}
 const h=matrix.map(r=>r[8]);return(u:number,v:number)=>{const d=h[6]*u+h[7]*v+1;return{x:(h[0]*u+h[1]*v+h[2])/d,y:(h[3]*u+h[4]*v+h[5])/d};};
}
export async function warpScan(source:ImageData,corners:Point[],width:number,height:number,signal?:AbortSignal){
 const map=perspectiveMap(corners),out=new ImageData(width,height);
 for(let y=0;y<height;y++){signal?.throwIfAborted();for(let x=0;x<width;x++){const p=map(width===1?0:x/(width-1),height===1?0:y/(height-1)),sx=Math.max(0,Math.min(source.width-1,p.x)),sy=Math.max(0,Math.min(source.height-1,p.y)),x0=Math.floor(sx),y0=Math.floor(sy),x1=Math.min(source.width-1,x0+1),y1=Math.min(source.height-1,y0+1),fx=sx-x0,fy=sy-y0;
 for(let c=0;c<4;c++){const a=source.data[(y0*source.width+x0)*4+c],b=source.data[(y0*source.width+x1)*4+c],d=source.data[(y1*source.width+x0)*4+c],e=source.data[(y1*source.width+x1)*4+c];out.data[(y*width+x)*4+c]=Math.round((a*(1-fx)+b*fx)*(1-fy)+(d*(1-fx)+e*fx)*fy);}}
 if(y%32===0)await new Promise<void>(resolve=>setTimeout(resolve,0));}
 return out;
}
