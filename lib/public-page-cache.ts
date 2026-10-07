/** Only anonymous public HTML is eligible. API, owner, RSC and cookie responses remain private. */
export function cacheablePublicRequest(request:Request){
 const u=new URL(request.url);
 return request.method==='GET'&&!u.search&&!request.headers.has('cookie')&&!request.headers.has('authorization')&&!request.headers.has('rsc')&&!request.headers.has('next-router-state-tree')&&(!request.headers.has('accept')||request.headers.get('accept')!.includes('text/html'))&&!u.pathname.startsWith('/api/')&&!u.pathname.startsWith('/analytics')&&/^\/(?:$|tools(?:\/|$)|blog(?:\/|$)|guides$|help$|about$|privacy$|terms$|faq$|contact$|check-it-yourself$|compare\/)/.test(u.pathname);
}
export async function publicPageCache(request:Request,response:Response){
 if(!cacheablePublicRequest(request)||response.status!==200||!response.headers.get('content-type')?.includes('text/html')||response.headers.has('set-cookie')||/no-store/i.test(response.headers.get('cache-control')??''))return response;
 const headers=new Headers(response.headers);headers.set('Cache-Control','public, max-age=0, s-maxage=60, stale-while-revalidate=120');
 return new Response(response.body,{status:response.status,statusText:response.statusText,headers});
}
