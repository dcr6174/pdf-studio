import {PDFDict,PDFName,PDFNumber} from 'pdf-lib';

/** PDF 1.7 PNG/TIFF predictors, restricted to bounded 8-bit RGB/gray samples. */
export function imageSamples(data:Uint8Array,width:number,height:number,channels:number,params?:PDFDict){
 const number=(key:string,fallback:number)=>{const value=params?.lookup(PDFName.of(key));return value instanceof PDFNumber?value.asNumber():fallback;};
 const predictor=number('Predictor',1),columns=number('Columns',1),colors=number('Colors',1),bits=number('BitsPerComponent',8),row=width*channels;
 if(predictor!==1&&(columns!==width||colors!==channels||bits!==8))throw new Error('Unsupported image predictor.');
 if(![1,2,10,11,12,13,14,15].includes(predictor))throw new Error('Unsupported image predictor.');
 const stride=row+(predictor>=10?1:0);if(data.length!==stride*height)throw new Error('Unexpected image samples.');
 const result=new Uint8Array(row*height);
 for(let y=0;y<height;y++){
  const filter=predictor>=10?data[y*stride]:predictor===2?1:0;if(filter>4)throw new Error('Unsupported PNG filter.');
  for(let x=0;x<row;x++){
   const at=y*row+x,left=x>=channels?result[at-channels]:0,up=y?result[at-row]:0,corner=y&&x>=channels?result[at-row-channels]:0;
   let prediction=0;
   if(filter===1)prediction=left;else if(filter===2)prediction=up;else if(filter===3)prediction=Math.floor((left+up)/2);else if(filter===4){const p=left+up-corner,a=Math.abs(p-left),b=Math.abs(p-up),c=Math.abs(p-corner);prediction=a<=b&&a<=c?left:b<=c?up:corner;}
   result[at]=(data[y*stride+x+(predictor>=10?1:0)]+prediction)&255;
  }
 }
 return result;
}
