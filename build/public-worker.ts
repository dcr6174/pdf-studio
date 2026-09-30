import handler from 'vinext/server/fetch-handler';
import { publicOwnerBoundary } from '../lib/public-owner';

export default {
  fetch(request: Request, env: Cloudflare.Env, ctx: ExecutionContext) {
    return publicOwnerBoundary(request, env, clean => handler.fetch(clean, env, ctx));
  },
  async scheduled(_event: ScheduledEvent, env: Cloudflare.Env) {
    if (!env.DB) return;
    const cutoff = Date.now() - 48 * 60 * 60 * 1000;
    await env.DB.batch([
      env.DB.prepare('DELETE FROM analytics_events WHERE received_at < ?').bind(cutoff),
      env.DB.prepare('DELETE FROM analytics_visitors WHERE last_activity < ?').bind(cutoff),
    ]);
  },
};
