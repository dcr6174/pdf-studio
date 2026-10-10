import {decodePhoto} from './mobile-image';
export type ImageSizeOptions={limitKB:number;format:'jpeg'|'png';maxWidth?:number;maxHeight?:number};
export type SizedImage={blob:Blob;width:number;height:number;met:boolean;quality?:number;original:boolean};
export async function fitImage(file:File,options:ImageSizeOptions,signal?:AbortSignal):Promise<SizedImage>{
 const {limitKB,format,maxWidth,maxHeight}=options;
 if(!Number.isFinite(limitKB)||limitKB<1||limitKB>10000)throw new Error('Choose a size limit from 1 to 10,000 KB.');
 for(const n of [maxWidth,maxHeight])if(n!==undefined&&(!Number.isInteger(n)||n<32||n>10000))throw new Error('Dimensions must be whole numbers from 32 to 10,000 pixels.');
 if(!['image/jpeg','image/png','image/webp'].includes(file.type))throw new Error('Choose a JPG, PNG or WebP image.');
 if(file.size>25*1024*1024)throw new Error('Choose an image smaller than 25 MB.');
 signal?.throwIfAborted();const image=await decodePhoto(file),canvas=document.createElement('canvas'),mime='image/'+format,target=Math.ceil(limitKB*1000)-1;
 try{
  if(image.width*image.height>40000000)throw new Error('This image is too large. Use an image below 40 megapixels.');
  const ratio=Math.min(1,(maxWidth??image.width)/image.width,(maxHeight??image.height)/image.height,4096/Math.max(image.width,image.height));
  let width=Math.max(1,Math.round(image.width*ratio)),height=Math.max(1,Math.round(image.height*ratio));
  if(file.type===mime&&file.size<=target&&ratio===1)return{blob:file,width,height,met:true,original:true};
  const ctx=canvas.getContext('2d');if(!ctx)throw new Error('Image processing is unavailable in this browser.');
  let best:SizedImage|undefined;
  const encode=async(q:number)=>{signal?.throwIfAborted();const blob=await new Promise<Blob|null>(resolve=>canvas.toBlob(resolve,mime,q));signal?.throwIfAborted();if(!blob||blob.type!==mime)throw new Error('This browser cannot create the selected format.');return blob;};
  for(let pass=0;pass<18;pass++){
   canvas.width=width;canvas.height=height;ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
   if(format==='jpeg'){ctx.fillStyle='#ffffff';ctx.fillRect(0,0,width,height);}ctx.drawImage(image.source,0,0,width,height);
   let quality=.95,blob=await encode(quality);
   if(format==='jpeg'&&blob.size>target){
    const lowBlob=await encode(.4);blob=lowBlob;quality=.4;
    if(lowBlob.size<=target){let low=.4,high=.95;for(let i=0;i<7;i++){const mid=(low+high)/2,candidate=await encode(mid);if(candidate.size<=target){low=mid;blob=candidate;quality=mid;}else high=mid;}}
   }
   const result={blob,width,height,met:blob.size<=target,quality:format==='jpeg'?quality:undefined,original:false};
   if(!best||blob.size<best.blob.size)best=result;
   if(result.met)return result;
   if(Math.max(width,height)<=96)break;
   const shrink=Math.min(.85,Math.max(.5,Math.sqrt(target/blob.size)*.95));
   const floor=Math.min(1,96/Math.max(width,height)),scale=Math.max(floor,shrink);width=Math.max(1,Math.round(width*scale));height=Math.max(1,Math.round(height*scale));
   await new Promise(resolve=>setTimeout(resolve,0));
  }
  if(!best)throw new Error('No image could be created.');return best;
 }finally{image.close();canvas.width=0;canvas.height=0;}
}
