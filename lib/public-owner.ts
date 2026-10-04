import {ownerLoginResponse} from './owner-login';
// Standalone hosting boundary. Never trust visitor-supplied Sites identity headers.
const cookieName = '__Host-pdf-studio-owner';
const lifetime = 8 * 60 * 60;
const encoder = new TextEncoder();
export type OwnerEnv = { OWNER_PASSWORD?: string; ANALYTICS_OWNER_EMAIL?: string };
const protectedPath = (path: string) => path === '/analytics' || path.startsWith('/analytics/') || (path.startsWith('/api/analytics/') && path !== '/api/analytics/collect');
const configured = (env: OwnerEnv) => typeof env.OWNER_PASSWORD === 'string' && env.OWNER_PASSWORD.length >= 32 && !!env.ANALYTICS_OWNER_EMAIL;
async function key(secret: string) { return crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']); }
async function signature(message: string, secret: string) {
  return new Uint8Array(await crypto.subtle.sign('HMAC', await key(secret), encoder.encode(message)));
}
async function validCookie(request: Request, secret: string, now: number) {
  const value = request.headers.get('cookie')?.split(';').map(v => v.trim()).find(v => v.startsWith(cookieName + '='))?.slice(cookieName.length + 1);
  if (!value || value.length > 150) return false;
  const [expires, hash, extra] = value.split('.');
  if (extra || !/^\d+$/.test(expires) || !/^[a-f0-9]{64}$/.test(hash ?? '')) return false;
  const expiry = Number(expires);
  if (expiry <= now || expiry > now + lifetime) return false;
  const bytes = Uint8Array.from(hash.match(/../g)!, v => parseInt(v, 16));
  return crypto.subtle.verify('HMAC', await key(secret), bytes, encoder.encode('pdf-studio-owner:' + expires));
}
async function validPassword(password:string,secret:string){
 const actual=await signature(password,secret),expected=await signature(secret,secret);
 let difference=0;for(let i=0;i<expected.length;i++)difference|=actual[i]^expected[i];return difference===0;
}
async function sessionCookie(secret:string,now:number){
 const expires=String(now+lifetime);const hash=[...await signature('pdf-studio-owner:'+expires,secret)].map(v=>v.toString(16).padStart(2,'0')).join('');
 return `${cookieName}=${expires}.${hash}; Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age=${lifetime}`;
}
const attempts=new Map<string,{count:number;until:number}>();
async function boundedBody(request:Request){
 const reader=request.body?.getReader();if(!reader)return '';let text='',size=0;const decoder=new TextDecoder();
 try{while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>2048){await reader.cancel();throw new Error('body limit');}text+=decoder.decode(value,{stream:true});}return text+decoder.decode();}finally{reader.releaseLock();}
}
export async function publicOwnerBoundary(request: Request, env: OwnerEnv, next: (request: Request) => Promise<Response>, now = Math.floor(Date.now() / 1000)) {
  const url = new URL(request.url), headers = new Headers(request.headers);
  if(url.hostname==='www.pdf-studio.in'||url.hostname.endsWith('.workers.dev')){url.hostname='pdf-studio.in';url.protocol='https:';return Response.redirect(url.toString(),308);}
  // Owner-authorized canonical redirect: preserve path/query and request method (308).
  for (const name of [...headers.keys()]) if (name.startsWith('oai-authenticated-user-')) headers.delete(name);
  // Credentials must never reach the application, analytics, or request logs.
  headers.delete('authorization');
  let owner = false;
  if (configured(env)) {
    owner = await validCookie(request, env.OWNER_PASSWORD!, now);

  }
  const responseHeaders = { 'X-Robots-Tag': 'noindex, nofollow', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'same-origin' };
  if(url.pathname==='/api/owner/login'||url.pathname==='/api/owner/logout'){
    const reply=(error:string,status:number)=>Response.json({error},{status,headers:responseHeaders});
    if(url.protocol!=='https:')return reply('HTTPS is required for owner sign-in.',403);
    if(request.method!=='POST')return reply('Use POST.',405);
    if(request.headers.get('origin')!==url.origin)return reply('Sign in from this website.',403);
    if(url.pathname.endsWith('/logout'))return Response.json({ok:true},{headers:{...responseHeaders,'Set-Cookie':`${cookieName}=; Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age=0`}});
    if(!configured(env))return reply('Owner sign-in is not configured. Check the runtime secrets and deploy.',503);
    const ip=await signature(request.headers.get('cf-connecting-ip')??'unknown',env.OWNER_PASSWORD!);const client=Array.from(ip).join('.');
    for(const [id,entry]of attempts)if(entry.until<=now)attempts.delete(id);
    const entry=attempts.get(client)??{count:0,until:now+60};
    if(entry.count>=8||(!attempts.has(client)&&attempts.size>=1000))return new Response(JSON.stringify({error:'Too many attempts. Wait one minute and try again.'}),{status:429,headers:{...responseHeaders,'Content-Type':'application/json','Retry-After':'60'}});
    entry.count++;attempts.set(client,entry);
    if(!request.headers.get('content-type')?.startsWith('application/json'))return reply('Use a JSON request.',415);
    let body:unknown;try{body=JSON.parse(await boundedBody(request));}catch{return reply('Invalid sign-in request.',400);}
    const password=(body as {password?:unknown}|null)?.password;
    if(typeof password!=='string'||password.length>1024)return reply('Enter your owner password.',400);
    if(!await validPassword(password,env.OWNER_PASSWORD!))return reply('Incorrect password. Please try again.',401);
    return Response.json({ok:true},{headers:{...responseHeaders,'Set-Cookie':await sessionCookie(env.OWNER_PASSWORD!,now)}});
  }
  if (protectedPath(url.pathname) && !owner) {
    if (url.pathname.startsWith('/api/')) return Response.json({ error: 'Owner access is required.' }, { status: 403, headers: responseHeaders });

    if (url.protocol !== 'https:') return new Response('HTTPS is required for owner sign-in.', { status: 403, headers: responseHeaders });
    return ownerLoginResponse(configured(env));
  }
  if (owner) {
    headers.set('oai-authenticated-user-id', 'pdf-studio-owner');
    headers.set('oai-authenticated-user-email', env.ANALYTICS_OWNER_EMAIL!);
  }
  const upstream = await next(new Request(request, { headers }));
  const response = new Response(upstream.body, upstream);
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'same-origin');
  response.headers.set('X-Frame-Options', 'DENY');
  if (url.protocol === 'https:') response.headers.set('Strict-Transport-Security', 'max-age=31536000');
  if(url.hostname.endsWith('.workers.dev')) response.headers.set('X-Robots-Tag','noindex, nofollow');
  if (protectedPath(url.pathname) || owner) {response.headers.set('Cache-Control', 'no-store');response.headers.set('X-Robots-Tag','noindex, nofollow');}
  return response;
}
