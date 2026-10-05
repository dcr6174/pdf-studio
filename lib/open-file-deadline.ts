/** Bounds async opening; does not claim to cancel synchronous parser work. */
export async function openingDeadline<T>(work:Promise<T>,ms=60000):Promise<T>{
 let timer:ReturnType<typeof setTimeout>|undefined;
 try{return await Promise.race([work,new Promise<never>((_,reject)=>{timer=setTimeout(()=>reject(new Error('Opening this file took too long. Your existing document is kept. Try a smaller file or a JPG/PNG copy of a photo, then choose files again.')),ms);})]);}
 finally{if(timer!==undefined)clearTimeout(timer);}
}
