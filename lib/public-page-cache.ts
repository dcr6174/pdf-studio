/** Revalidate the anonymous homepage; never cache owner or API responses. */
export async function publicPageCache(request:Request,response:Response){
 const url=new URL(request.url);
 if(!['GET','HEAD'].includes(request.method)||url.pathname!=='/'||url.search||response.status!==200||!response.headers.get('content-type')?.includes('text/html')||response.headers.has('set-cookie')||/no-store/i.test(response.headers.get('cache-control')??''))return response;
 const bytes=await response.arrayBuffer();
 const digest=await crypto.subtle.digest('SHA-256',bytes);
 const tag='"'+Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,'0')).join('')+'"';
 const headers=new Headers(response.headers);
 headers.set('Cache-Control','private, max-age=0, must-revalidate');
 headers.set('ETag',tag);
 headers.delete('Content-Length');
 const candidates=request.headers.get('if-none-match')?.split(',').map(s=>s.trim().replace(/^W\//,''))??[];
 if(candidates.includes(tag)||candidates.includes('*'))return new Response(null,{status:304,headers});
 return new Response(request.method==='HEAD'?null:bytes,{status:200,headers});
}
