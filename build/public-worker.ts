import {publicPageCache} from '../lib/public-page-cache';
import {purgeAudience} from '../lib/audience';
import handler from 'vinext/server/fetch-handler';
import { publicOwnerBoundary } from '../lib/public-owner';

export default {
  async fetch(request: Request, env: Cloudflare.Env, ctx: ExecutionContext) {
    const response=await publicOwnerBoundary(request, env, clean => { const url=new URL(clean.url); if((clean.method==='GET'||clean.method==='HEAD')&&url.pathname.replace(/\/$/,'')==='/prove-it'){url.pathname='/check-it-yourself';return Promise.resolve(Response.redirect(url.toString(),301));} return handler.fetch(clean, env, ctx); });
    return publicPageCache(request,response);
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

