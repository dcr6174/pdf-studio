import {ADS_ENABLED,isAdvertisingPage} from './advertising';
export function withSecurityHeaders(response:Response,path:string){
 const headers=new Headers(response.headers);
 const ads=ADS_ENABLED&&isAdvertisingPage(path)?' https://*.googlesyndication.com https://*.doubleclick.net https://*.googleadservices.com https://www.google.com':'';
 headers.set('X-Content-Type-Options','nosniff');
 headers.set('Referrer-Policy','strict-origin-when-cross-origin');
 headers.set('Permissions-Policy','camera=(self), microphone=(), geolocation=(), payment=()');
 headers.set('Content-Security-Policy',"default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' https://static.cloudflareinsights.com"+ads+"; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:"+ads+"; font-src 'self' data:; worker-src 'self' blob:; connect-src 'self' https://cdn.jsdelivr.net https://tessdata.projectnaptha.com https://cloudflareinsights.com"+ads+"; frame-src 'self' blob:"+ads+"; form-action 'self'");
 if(path.startsWith('/analytics')||path.startsWith('/api/analytics'))headers.set('X-Robots-Tag','noindex, nofollow');
 return new Response(response.body,{status:response.status,statusText:response.statusText,headers});
}
