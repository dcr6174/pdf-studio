import {canonicalPublicRedirect} from '../lib/canonical-routes';
import {withSecurityHeaders} from '../lib/security-headers';
import {publicPageCache} from '../lib/public-page-cache';
import {purgeAudience} from '../lib/audience';
import handler from 'vinext/server/fetch-handler';
import { publicOwnerBoundary } from '../lib/public-owner';

export default {
  async fetch(request: Request, env: Cloudflare.Env, ctx: ExecutionContext) {
    const canonical=canonicalPublicRedirect(request);
    if(canonical)return withSecurityHeaders(Response.redirect(canonical.toString(),308),canonical.pathname);
    const response=await publicOwnerBoundary(request, env, clean => handler.fetch(clean, env, ctx));
    if(response.status>=400&&response.headers.get('content-type')?.includes('text/html')){
      const headers=new Headers(response.headers);
      headers.set('X-Robots-Tag','noindex, follow');
      return withSecurityHeaders(new Response(response.body,{status:response.status,statusText:response.statusText,headers}),new URL(request.url).pathname);
    }
    return withSecurityHeaders(await publicPageCache(request,response),new URL(request.url).pathname);
  },
  async scheduled(_event: ScheduledEvent, env: Cloudflare.Env) {
    if (!env.DB) return;
    const cutoff = Date.now() - 48 * 60 * 60 * 1000;
    await env.DB.batch([
      env.DB.prepare('DELETE FROM analytics_events WHERE received_at < ?').bind(cutoff),
      env.DB.prepare('DELETE FROM analytics_visitors WHERE last_activity < ?').bind(cutoff),
    ]);
    await purgeAudience(env.DB);
  },
};
