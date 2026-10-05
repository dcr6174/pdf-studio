let active=0;
const waiting:(()=>void)[]=[];
/** Bound simultaneous canvas work across visible pages. */
export function acquireReaderRender(signal:AbortSignal):Promise<()=>void>{
 signal.throwIfAborted();return new Promise((resolve,reject)=>{
 const abort=()=>{const index=waiting.indexOf(start);if(index>=0)waiting.splice(index,1);reject(signal.reason??new DOMException('Cancelled','AbortError'));};
 const start=()=>{signal.removeEventListener('abort',abort);if(signal.aborted){reject(signal.reason);return;}active++;let released=false;resolve(()=>{if(released)return;released=true;active--;waiting.shift()?.();});};
 if(active<2)start();else{waiting.push(start);signal.addEventListener('abort',abort,{once:true});}
 });
}
