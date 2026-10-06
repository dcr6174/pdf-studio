export function pixelsHaveInk(data:Uint8ClampedArray|Uint8Array){
 for(let i=0;i<data.length;i+=4){
  const alpha=data[i+3]/255;
  if(alpha>0&&((255-data[i])*alpha>7||(255-data[i+1])*alpha>7||(255-data[i+2])*alpha>7))return true;
 }
 return false;
}
/** Reject complete visible-content loss, while allowing genuinely blank sources. */
export async function rejectBlankOutput<T>(output:T[],source:T[],probe:(page:T)=>Promise<boolean>,signal?:AbortSignal){
 for(const page of output){signal?.throwIfAborted();if(await probe(page))return;}
 for(const page of source){signal?.throwIfAborted();if(await probe(page))throw new Error('Export stopped because the result is blank but your source contains visible content. Your original is still in the workspace. Try another setting or download the original.');}
}

