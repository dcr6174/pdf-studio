/** Allow the loading state to paint before CPU-heavy PDF work begins. */
export function paintProgress():Promise<void>{
 return new Promise(resolve=>requestAnimationFrame(()=>setTimeout(resolve,0)));
}
