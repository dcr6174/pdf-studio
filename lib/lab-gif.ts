/** One frame at a time; terminating the worker makes quantization cancellable. */
export function gifWorker(signal:AbortSignal){
 const worker=new Worker(new URL('./lab-gif.worker.ts',import.meta.url),{type:'module'});
 let pending:((reason:unknown)=>void)|undefined;
 const cancel=()=>{worker.terminate();pending?.(new DOMException('GIF export cancelled','AbortError'));};signal.addEventListener('abort',cancel,{once:true});
 async function request(data:unknown,transfer:Transferable[]=[]){signal.throwIfAborted();return new Promise<{bytes?:Uint8Array}>((resolve,reject)=>{pending=reject;worker.onmessage=event=>{pending=undefined;if(event.data.error)reject(new Error(event.data.error));else resolve(event.data);};worker.onerror=()=>{pending=undefined;reject(new Error('GIF worker could not load. Reload after saving your work.'));};worker.postMessage(data,transfer);});}
 return {start:()=>request({type:'start'}),frame:(rgba:Uint8ClampedArray,width:number,height:number,delay:number,loop:boolean)=>request({type:'frame',rgba,width,height,delay,loop},[rgba.buffer as ArrayBuffer]),finish:async()=>{const result=await request({type:'finish'});if(!result.bytes)throw new Error('GIF encoder returned no file.');return new Blob([result.bytes.slice().buffer as ArrayBuffer],{type:'image/gif'});},close:()=>{signal.removeEventListener('abort',cancel);worker.terminate();}};
}
