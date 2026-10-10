import {decodePhoto} from './mobile-image';
import type {ImageToolSlug} from './image-tools';
export type Rect={x:number;y:number;width:number;height:number};
export type ImageSettings={width:number;height:number;fit:'contain'|'cover'|'stretch';format:'png'|'jpeg'|'webp';quality:number;amount:number;contrast:number;saturation:number;angle:number;flipX:boolean;flipY:boolean;rect:Rect;point:{x:number;y:number};background:string;text:string;detail:string;opacity:number;tiled:boolean;transparent:boolean;columns:number;mmWidth:number;mmHeight:number;dpi:number;password:string;extract:boolean};
export const defaultImageSettings:ImageSettings={width:1080,height:1080,fit:'contain',format:'png',quality:90,amount:30,contrast:100,saturation:100,angle:0,flipX:false,flipY:false,rect:{x:0,y:0,width:100,height:100},point:{x:0,y:0},background:'#ffffff',text:'Made by me',detail:'Member · 001',opacity:60,tiled:false,transparent:true,columns:3,mmWidth:35,mmHeight:45,dpi:300,password:'',extract:false};
export type ImageOutput={blob:Blob;name:string;width?:number;height?:number;note?:string};
export function makeCanvas(width:number,height:number){
 if(!Number.isInteger(width)||!Number.isInteger(height)||width<1||height<1||width>8192||height>8192||width*height>24000000)throw Error('Use dimensions up to 8,192 pixels and 24 megapixels in total.');
 const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;return canvas;
}
function context(canvas:HTMLCanvasElement){const ctx=canvas.getContext('2d',{willReadFrequently:true});if(!ctx)throw Error('Your browser cannot open an image canvas.');return ctx;}
export async function encodeCanvas(canvas:HTMLCanvasElement,format:ImageSettings['format']='png',quality=90){const mime='image/'+format;const blob=await new Promise<Blob|null>(resolve=>canvas.toBlob(resolve,mime,quality/100));if(!blob||blob.type!==mime)throw Error('Your browser cannot export '+format.toUpperCase()+'. Choose PNG or JPG.');return blob;}
export async function openImage(file:File){
 if(file.size>25*1024*1024)throw Error('Choose an image below 25 MB.');
 if(!/^image\/(jpeg|png|webp|gif|bmp|avif|svg\+xml)$/.test(file.type)&&! /\.(jpe?g|png|webp|gif|bmp|avif|svg)$/i.test(file.name))throw Error('Choose JPG, PNG, WebP, GIF, BMP, AVIF or a self-contained SVG.');
 const safe=/\.svg$/i.test(file.name)||file.type==='image/svg+xml'?new File([cleanSVG(await file.text())],file.name,{type:'image/svg+xml'}):file;
 const image=await decodePhoto(safe);try{const canvas=makeCanvas(image.width,image.height);context(canvas).drawImage(image.source,0,0);return canvas;}finally{image.close();}
}
/** Conservative cleanup, not a geometry optimizer. Never embeds the source in HTML. */
export function cleanSVG(source:string){
 const doc=new DOMParser().parseFromString(source,'image/svg+xml');if(doc.querySelector('parsererror')||doc.documentElement.localName!=='svg')throw Error('This is not a valid SVG document.');
 const remove=['script','foreignObject','metadata','iframe','object','embed','animate','animateTransform','set'];
 for(const el of [...doc.querySelectorAll('*')]){
  if(remove.includes(el.localName)){el.remove();continue;}
  for(const attr of [...el.attributes]){
   const value=attr.value.trim();
   if(/^on/i.test(attr.name)||((attr.localName==='href'||attr.localName==='src')&&!value.startsWith('#'))||/url\(\s*['"]?(?!#)/i.test(value)||/@import/i.test(value))el.removeAttributeNode(attr);
  }
  if(el.localName==='style'&&(/@import|url\(\s*['"]?(?!#)/i.test(el.textContent||'')))el.remove();
 }
 const walker=doc.createTreeWalker(doc,128);const comments:Node[]=[];while(walker.nextNode())comments.push(walker.currentNode);comments.forEach(n=>n.parentNode?.removeChild(n));
 return new XMLSerializer().serializeToString(doc.documentElement);
}
export function clampRect(rect:Rect,width:number,height:number):Rect{const x=Math.max(0,Math.min(width-1,Math.round(rect.x))),y=Math.max(0,Math.min(height-1,Math.round(rect.y)));return{x,y,width:Math.max(1,Math.min(width-x,Math.round(rect.width))),height:Math.max(1,Math.min(height-y,Math.round(rect.height)))};}
export function drawFit(ctx:CanvasRenderingContext2D,source:HTMLCanvasElement,x:number,y:number,width:number,height:number,fit:ImageSettings['fit']){if(fit==='stretch'){ctx.drawImage(source,x,y,width,height);return;}const scale=(fit==='cover'?Math.max:Math.min)(width/source.width,height/source.height),w=source.width*scale,h=source.height*scale;ctx.save();ctx.beginPath();ctx.rect(x,y,width,height);ctx.clip();ctx.drawImage(source,x+(width-w)/2,y+(height-h)/2,w,h);ctx.restore();}
export function removeConnectedBackground(data:ImageData,x:number,y:number,tolerance:number){
 const {width,height}=data,pixels=data.data,start=(Math.min(height-1,Math.max(0,Math.round(y)))*width+Math.min(width-1,Math.max(0,Math.round(x))))*4;
 const color=[pixels[start],pixels[start+1],pixels[start+2]],visited=new Uint8Array(width*height),queue=new Int32Array(width*height);let head=0,tail=0;const first=start/4;queue[tail++]=first;visited[first]=1;
 while(head<tail){const p=queue[head++],i=p*4;if(Math.max(...color.map((v,c)=>Math.abs(v-pixels[i+c])))>tolerance)continue;pixels[i+3]=0;const px=p%width;for(const n of [px>0?p-1:-1,px<width-1?p+1:-1,p>=width?p-width:-1,p<width*(height-1)?p+width:-1])if(n>=0&&!visited[n]){visited[n]=1;queue[tail++]=n;}}
 return data;
}
export function sharpenPixels(data:ImageData,amount:number){const src=new Uint8ClampedArray(data.data),w=data.width,h=data.height,a=amount/100;for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){const i=(y*w+x)*4;for(let c=0;c<3;c++)data.data[i+c]=src[i+c]*(1+4*a)-a*(src[i-4+c]+src[i+4+c]+src[i-w*4+c]+src[i+w*4+c]);}return data;}
function blurPixels(data:ImageData,radius:number){
 // Separable box blur with sliding sums: works without Canvas filter support.
 const {width:w,height:h}=data,r=Math.max(1,Math.round(radius)),source=new Uint8ClampedArray(data.data),tmp=new Uint8ClampedArray(source.length);
 for(let y=0;y<h;y++)for(let c=0;c<4;c++){let sum=0;for(let x=-r;x<=r;x++)sum+=source[(y*w+Math.max(0,Math.min(w-1,x)))*4+c];for(let x=0;x<w;x++){tmp[(y*w+x)*4+c]=sum/(r*2+1);sum+=source[(y*w+Math.min(w-1,x+r+1))*4+c]-source[(y*w+Math.max(0,x-r))*4+c];}}
 for(let x=0;x<w;x++)for(let c=0;c<4;c++){let sum=0;for(let y=-r;y<=r;y++)sum+=tmp[(Math.max(0,Math.min(h-1,y))*w+x)*4+c];for(let y=0;y<h;y++){data.data[(y*w+x)*4+c]=sum/(r*2+1);sum+=tmp[(Math.min(h-1,y+r+1)*w+x)*4+c]-tmp[(Math.max(0,y-r)*w+x)*4+c];}}return data;
}
export function renderImage(source:HTMLCanvasElement,slug:ImageToolSlug,s:ImageSettings,logo?:HTMLCanvasElement){
 const rect=clampRect(s.rect,source.width,source.height);let w=source.width,h=source.height;
 if(['image-resizer','svg-to-image'].includes(slug)){w=s.width;h=s.height;}
 if(slug==='image-crop'){w=rect.width;h=rect.height;}
 if(slug==='passport-photo'){w=Math.round(s.mmWidth*s.dpi/25.4);h=Math.round(s.mmHeight*s.dpi/25.4);}
 if(slug==='image-id-card'){w=1011;h=638;}
 if(slug==='image-rotate'){const angle=s.angle*Math.PI/180;w=Math.max(1,Math.ceil(Math.abs(source.width*Math.cos(angle))+Math.abs(source.height*Math.sin(angle))-1e-8));h=Math.max(1,Math.ceil(Math.abs(source.width*Math.sin(angle))+Math.abs(source.height*Math.cos(angle))-1e-8));}
 const canvas=makeCanvas(w,h),ctx=context(canvas);ctx.imageSmoothingQuality='high';
 if(!s.transparent||s.format==='jpeg'||['png-to-jpg','passport-photo','image-id-card'].includes(slug)){ctx.fillStyle=s.background;ctx.fillRect(0,0,w,h);}
 if(slug==='image-crop')ctx.drawImage(source,rect.x,rect.y,rect.width,rect.height,0,0,w,h);
 else if(slug==='image-rotate'){ctx.save();ctx.translate(w/2,h/2);ctx.rotate(s.angle*Math.PI/180);ctx.scale(s.flipX?-1:1,s.flipY?-1:1);ctx.drawImage(source,-source.width/2,-source.height/2);ctx.restore();}
 else if(slug==='passport-photo'){const cropW=Math.min(rect.width,rect.height*w/h),cropH=Math.min(rect.height,rect.width*h/w);ctx.drawImage(source,rect.x+(rect.width-cropW)/2,rect.y+(rect.height-cropH)/2,cropW,cropH,0,0,w,h);}
 else if(slug==='image-id-card'){ctx.fillStyle='#f2f0ff';ctx.fillRect(0,0,w,h);drawFit(ctx,source,48,70,320,460,'cover');ctx.fillStyle='#31276a';ctx.font='bold 42px system-ui';ctx.fillText(s.text.slice(0,30),410,245,550);ctx.font='26px system-ui';ctx.fillText(s.detail.slice(0,55),410,300,550);ctx.font='20px system-ui';ctx.fillText('MEMBERSHIP',410,160);}
 else drawFit(ctx,source,0,0,w,h,['image-resizer','svg-to-image'].includes(slug)?s.fit:'stretch');
 if(slug==='image-background-remover'){const pixels=removeConnectedBackground(ctx.getImageData(0,0,w,h),s.point.x,s.point.y,s.amount);ctx.clearRect(0,0,w,h);ctx.putImageData(pixels,0,0);if(!s.transparent){ctx.globalCompositeOperation='destination-over';ctx.fillStyle=s.background;ctx.fillRect(0,0,w,h);ctx.globalCompositeOperation='source-over';}}
 if(['image-grayscale','image-adjustments','image-sharpen','signature-cleaner'].includes(slug)){
  let pixels=ctx.getImageData(0,0,w,h);const d=pixels.data;
  if(slug==='image-sharpen')pixels=sharpenPixels(pixels,s.amount);
  else for(let i=0;i<d.length;i+=4){const gray=.2126*d[i]+.7152*d[i+1]+.0722*d[i+2];for(let c=0;c<3;c++){if(slug==='image-grayscale')d[i+c]=d[i+c]+(gray-d[i+c])*s.amount/100;else if(slug==='signature-cleaner')d[i+c]=gray>255-s.amount*2?255:Math.max(0,(gray-35)*1.15);else d[i+c]=((gray+(d[i+c]-gray)*s.saturation/100-128)*s.contrast/100+128)*s.amount/100;}}
  ctx.putImageData(pixels,0,0);
  if(slug==='signature-cleaner'){let minX=w,minY=h,maxX=-1,maxY=-1;for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=(y*w+x)*4;if(d[i+3]>0&&d[i]<160){minX=Math.min(minX,x);minY=Math.min(minY,y);maxX=Math.max(maxX,x);maxY=Math.max(maxY,y);}}if(maxX<0)throw Error('No dark signature was found. Lower the cleanup threshold or choose a clearer scan.');const pad=8,r=clampRect({x:minX-pad,y:minY-pad,width:maxX-minX+1+pad*2,height:maxY-minY+1+pad*2},w,h),cropped=makeCanvas(r.width,r.height);context(cropped).drawImage(canvas,r.x,r.y,r.width,r.height,0,0,r.width,r.height);canvas.width=0;return cropped;}
 }
 if(slug==='image-blur'){ctx.putImageData(blurPixels(ctx.getImageData(rect.x,rect.y,rect.width,rect.height),s.amount/4),rect.x,rect.y);}
 if(slug==='image-pixelate'){const block=Math.max(2,s.amount),tiny=makeCanvas(Math.max(1,Math.ceil(rect.width/block)),Math.max(1,Math.ceil(rect.height/block)));context(tiny).drawImage(source,rect.x,rect.y,rect.width,rect.height,0,0,tiny.width,tiny.height);ctx.imageSmoothingEnabled=false;ctx.drawImage(tiny,rect.x,rect.y,rect.width,rect.height);tiny.width=0;}
 if(slug==='image-watermark'){
  const size=Math.max(12,Math.round(Math.min(w,h)*s.amount/300));ctx.globalAlpha=s.opacity/100;ctx.fillStyle=s.background;ctx.font='bold '+size+'px system-ui';ctx.textAlign='center';ctx.textBaseline='middle';
  const stamp=(x:number,y:number)=>{ctx.save();ctx.translate(x,y);ctx.rotate(s.angle*Math.PI/180);if(logo){const lw=Math.max(20,w*s.amount/100);ctx.drawImage(logo,-lw/2,-lw*logo.height/logo.width/2,lw,lw*logo.height/logo.width);}else ctx.fillText(s.text.slice(0,100),0,0,w*.9);ctx.restore();};
  if(s.tiled){const stepX=Math.max(80,w/3),stepY=Math.max(60,h/4);for(let y=stepY/2;y<h;y+=stepY)for(let x=stepX/2;x<w;x+=stepX)stamp(x,y);}else stamp(s.point.x,s.point.y);ctx.globalAlpha=1;
 }
 return canvas;
}
function opaqueCapacity(data:ImageData){let n=0;for(let p=3;p<data.data.length;p+=4)if(data.data[p]===255)n+=3;return Math.floor(n/8);}
export function embedMessage(data:ImageData,payload:Uint8Array){if(payload.length+8>opaqueCapacity(data))throw Error('Message is too large for the opaque pixels in this image. Use a larger PNG.');const packet=new Uint8Array(payload.length+8);packet.set([83,76,65,66]);new DataView(packet.buffer).setUint32(4,payload.length);packet.set(payload,8);let bit=0;for(let p=0;p<data.data.length&&bit<packet.length*8;p+=4)if(data.data[p+3]===255)for(let c=0;c<3&&bit<packet.length*8;c++,bit++)data.data[p+c]=(data.data[p+c]&254)|((packet[bit>>3]>>(7-bit%8))&1);return data;}
export function extractMessage(data:ImageData){const max=opaqueCapacity(data);if(max<8)throw Error('No Studio Lab message was found in this image.');const read=(length:number)=>{const bytes=new Uint8Array(length);let bit=0;for(let p=0;p<data.data.length&&bit<length*8;p+=4)if(data.data[p+3]===255)for(let c=0;c<3&&bit<length*8;c++,bit++)bytes[bit>>3]|=(data.data[p+c]&1)<<(7-bit%8);return bytes;};const header=read(8);if([83,76,65,66].some((v,i)=>header[i]!==v))throw Error('No Studio Lab message was found in this image.');const length=new DataView(header.buffer).getUint32(4);if(length>max-8)throw Error('The hidden message is damaged.');return read(length+8).slice(8);}
async function passwordKey(password:string,salt:Uint8Array){if(!password)throw Error('Enter a password to protect or read the message.');const raw=await crypto.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveKey']);return crypto.subtle.deriveKey({name:'PBKDF2',salt:new Uint8Array(salt).buffer,iterations:150000,hash:'SHA-256'},raw,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);}
export async function encryptText(text:string,password:string){if(!text)throw Error('Enter a message first.');const salt=crypto.getRandomValues(new Uint8Array(16)),iv=crypto.getRandomValues(new Uint8Array(12)),key=await passwordKey(password,salt);const encrypted=new Uint8Array(await crypto.subtle.encrypt({name:'AES-GCM',iv},key,new TextEncoder().encode(text)));const result=new Uint8Array(28+encrypted.length);result.set(salt);result.set(iv,16);result.set(encrypted,28);return result;}
export async function decryptText(payload:Uint8Array,password:string){if(payload.length<44)throw Error('The hidden message is damaged.');const key=await passwordKey(password,payload.slice(0,16));try{const plain=await crypto.subtle.decrypt({name:'AES-GCM',iv:payload.slice(16,28)},key,payload.slice(28));return new TextDecoder().decode(plain);}catch{throw Error('The password is incorrect or the message has been modified.');}}
export function icoFile(images:Uint8Array[],sizes:number[]){const length=6+16*images.length+images.reduce((n,a)=>n+a.length,0),bytes=new Uint8Array(length),view=new DataView(bytes.buffer);view.setUint16(2,1,true);view.setUint16(4,images.length,true);let offset=6+16*images.length;images.forEach((img,i)=>{const at=6+i*16;bytes[at]=sizes[i]===256?0:sizes[i];bytes[at+1]=bytes[at];view.setUint16(at+4,1,true);view.setUint16(at+6,32,true);view.setUint32(at+8,img.length,true);view.setUint32(at+12,offset,true);bytes.set(img,offset);offset+=img.length;});return new Blob([bytes],{type:'image/x-icon'});}
export async function imageOutputs(source:HTMLCanvasElement,file:File,slug:ImageToolSlug,s:ImageSettings,logo?:HTMLCanvasElement):Promise<ImageOutput[]>{
 const stem=file.name.replace(/\.[^.]+$/,'');
 if(slug==='svg-to-image'&&file.type!=='image/svg+xml'&&!/\.svg$/i.test(file.name))throw Error('Choose an SVG file for this tool.');
 if(slug==='svg-cleaner'){if(file.type!=='image/svg+xml'&&!/\.svg$/i.test(file.name))throw Error('Choose an SVG file for this tool.');return[{blob:new Blob([cleanSVG(await file.text())],{type:'image/svg+xml'}),name:stem+'-clean.svg',note:'Conservative cleanup; paths are preserved. External resources are removed.'}];}
 if(slug==='image-secret-message'){const canvas=makeCanvas(source.width,source.height),ctx=context(canvas);ctx.drawImage(source,0,0);const pixels=ctx.getImageData(0,0,canvas.width,canvas.height);try{if(s.extract){const text=await decryptText(extractMessage(pixels),s.password);return[{blob:new Blob([text],{type:'text/plain'}),name:stem+'-message.txt',note:text}];}ctx.putImageData(embedMessage(pixels,await encryptText(s.text,s.password)),0,0);return[{blob:await encodeCanvas(canvas),name:stem+'-secret.png',width:canvas.width,height:canvas.height,note:'Keep this PNG unchanged. Resizing or JPEG conversion destroys the hidden message.'}];}finally{canvas.width=0;}}
 if(slug==='favicon-generator'){const outputs:ImageOutput[]=[],icoImages:Uint8Array[]=[],icoSizes=[16,32,48,256];for(const size of [16,32,48,180,192,256,512]){const c=makeCanvas(size,size);drawFit(context(c),source,0,0,size,size,'contain');const blob=await encodeCanvas(c);outputs.push({blob,name:'icon-'+size+'.png',width:size,height:size});if(icoSizes.includes(size))icoImages.push(new Uint8Array(await blob.arrayBuffer()));c.width=0;}outputs.push({blob:icoFile(icoImages,icoSizes),name:'favicon.ico'},{blob:new Blob([JSON.stringify({name:s.text,icons:[192,512].map(size=>({src:'icon-'+size+'.png',sizes:size+'x'+size,type:'image/png'}))},null,2)],{type:'application/manifest+json'}),name:'site.webmanifest'},{blob:new Blob(['<link rel="icon" href="favicon.ico">\n<link rel="apple-touch-icon" href="icon-180.png">\n<link rel="manifest" href="site.webmanifest">'],{type:'text/plain'}),name:'head-snippet.txt'});return outputs;}
 const canvas=renderImage(source,slug,s,logo);try{const format=slug==='jpg-to-png'?'png':slug==='png-to-jpg'?'jpeg':slug==='image-to-webp'?'webp':s.format;const blob=await encodeCanvas(canvas,format,s.quality);return[{blob,name:stem+'-'+slug+'.'+(format==='jpeg'?'jpg':format),width:canvas.width,height:canvas.height,note:slug==='image-metadata-remover'?'Pixels re-encoded: source EXIF, GPS and camera metadata are not copied. Color profiles and animation are not preserved.':undefined}];}finally{canvas.width=0;}
}
export async function contactSheet(files:File[],s:ImageSettings):Promise<ImageOutput>{const cols=Math.max(1,Math.min(6,s.columns)),cell=Math.max(100,Math.min(1200,s.width)),rows=Math.ceil(files.length/cols),canvas=makeCanvas(cols*cell,rows*(cell+32)),ctx=context(canvas);ctx.fillStyle=s.background;ctx.fillRect(0,0,canvas.width,canvas.height);try{for(let i=0;i<files.length;i++){const source=await openImage(files[i]);try{const x=(i%cols)*cell,y=Math.floor(i/cols)*(cell+32);drawFit(ctx,source,x+8,y+8,cell-16,cell-16,'contain');ctx.fillStyle='#242234';ctx.font='14px system-ui';ctx.fillText(files[i].name.slice(0,45),x+8,y+cell+20,cell-16);}finally{source.width=0;}}return{blob:await encodeCanvas(canvas),name:'contact-sheet.png',width:canvas.width,height:canvas.height};}finally{canvas.width=0;}}
