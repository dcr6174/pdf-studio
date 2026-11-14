import {cacheablePublicRequest} from './public-page-cache';
/**
 * Serve anonymous public HTML from the colo's Cache API before running the page renderer.
 * The renderer is the expensive part of a request; when it exceeds the Worker CPU limit the
 * visitor sees Cloudflare error 1102. A cache hit skips it. Entries are refreshed in the
 * background after FRESH_SECONDS and dropped after MAX_SECONDS, which also bounds how long
 * HTML can point at assets from a previous deploy.
 */
const FRESH_SECONDS=45,MAX_SECONDS=180;
function cacheKey(request:Request){const u=new URL(request.url);u.search='';u.hash='';return new Request(u.toString(),{method:'GET'});}
function storable(r:Response){return r.status===200&&!!r.headers.get('content-type')?.includes('text/html')&&!r.headers.has('set-cookie')&&!/no-store|private/i.test(r.headers.get('cache-control')??'');}
export async function edgeCachedHtml(request:Request,ctx:{waitUntil(p:Promise<unknown>):void},render:()=>Promise<Response>){
 if(!cacheablePublicRequest(request))return render();
 const store=(caches as unknown as {default?:Cache}).default;
 if(!store)return render();
 const key=cacheKey(request);
 const save=async(r:Response)=>{try{const h=new Headers(r.headers);h.set('X-Edge-Stored-At',String(Date.now()));h.set('Cache-Control',`public, max-age=0, s-maxage=${MAX_SECONDS}`);await store.put(key,new Response(r.body,{status:r.status,statusText:r.statusText,headers:h}));}catch{}};
 const refresh=async()=>{try{const r=await render();if(storable(r))await save(r.clone());}catch{}};
 let hit:Response|undefined;
 try{hit=await store.match(key);}catch{}
 if(hit){
  const age=(Date.now()-Number(hit.headers.get('X-Edge-Stored-At')))/1000;
  if(age>=0&&age<MAX_SECONDS){
   if(age>FRESH_SECONDS)ctx.waitUntil(refresh());
   const h=new Headers(hit.headers);h.set('X-Edge-Cache','HIT');h.set('Cache-Control','public, max-age=0, s-maxage=60');
   return new Response(hit.body,{status:hit.status,statusText:hit.statusText,headers:h});
  }
 }
 const r=await render();
 if(storable(r))ctx.waitUntil(save(r.clone()));
 return r;
}
