import {openingDeadline} from './open-file-deadline';
/** Camera providers sometimes supply valid photos without a usable extension. */
export function normalizeCameraFile(file:File){
 if(/\.(png|jpe?g|webp)$/i.test(file.name))return file;
 const ext=({'image/jpeg':'jpg','image/png':'png','image/webp':'webp'} as Record<string,string>)[file.type.toLowerCase()];
 if(!ext)return file;
 return new File([file],`${file.name.replace(/\.[^.]*$/,'')||'photo'}.${ext}`,{type:file.type,lastModified:file.lastModified});
}
/** Bitmap fast path plus an HTML image fallback for browsers/camera decoders. */
export async function decodePhoto(file:File):Promise<{source:CanvasImageSource;width:number;height:number;close:()=>void}>{
 if(typeof createImageBitmap==='function'){
  try{const bitmap=await openingDeadline(createImageBitmap(file),20000);return {source:bitmap,width:bitmap.width,height:bitmap.height,close:()=>bitmap.close()};}catch{/* Try the browser image decoder next. */}
 }
 const url=URL.createObjectURL(file);
 const image=new Image();
 try{
  await openingDeadline(new Promise<void>((resolve,reject)=>{image.onload=()=>resolve();image.onerror=()=>reject(new Error('This photo could not be opened. Save it as JPG or PNG and try again.'));image.src=url;}),20000);
  return {source:image,width:image.naturalWidth,height:image.naturalHeight,close:()=>{image.onload=null;image.onerror=null;image.src='';URL.revokeObjectURL(url);}};
 }catch(error){image.onload=null;image.onerror=null;image.src='';URL.revokeObjectURL(url);throw error;}
}
