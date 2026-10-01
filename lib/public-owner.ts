// Standalone hosting boundary. Never trust visitor-supplied Sites identity headers.
const cookieName = '__Host-pdf-studio-owner';
const lifetime = 8 * 60 * 60;
const encoder = new TextEncoder();
export type OwnerEnv = { OWNER_PASSWORD?: string; ANALYTICS_OWNER_EMAIL?: string };
const protectedPath = (path: string) => path === '/analytics' || path.startsWith('/analytics/') || path === '/api/analytics/summary' || path === '/api/analytics/access';
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
async function validBasic(request: Request, secret: string) {
  const auth = request.headers.get('authorization');
  if (!auth?.startsWith('Basic ') || auth.length > 2048) return false;
  try {
    const raw = atob(auth.slice(6));
    // Require a password-manager generated ASCII password. Compare fixed-size digests.
    const actual = await signature(raw, secret), expected = await signature('owner:' + secret, secret);
    let different = 0; for (let i = 0; i < expected.length; i++) different |= actual[i] ^ expected[i];
    return different === 0;
  } catch { return false; }
}
export async function publicOwnerBoundary(request: Request, env: OwnerEnv, next: (request: Request) => Promise<Response>, now = Math.floor(Date.now() / 1000)) {
  const url = new URL(request.url), headers = new Headers(request.headers);
  if(url.hostname==='www.pdf-studio.in'){url.hostname='pdf-studio.in';url.protocol='https:';return Response.redirect(url.toString(),308);}
  for (const name of [...headers.keys()]) if (name.startsWith('oai-authenticated-user-')) headers.delete(name);
  // Credentials must never reach the application, analytics, or request logs.
  headers.delete('authorization');
  let owner = false, fresh = false;
  if (configured(env)) {
    owner = await validCookie(request, env.OWNER_PASSWORD!, now);
    if (!owner && url.pathname === '/analytics' && url.protocol === 'https:') {
      owner = await validBasic(request, env.OWNER_PASSWORD!); fresh = owner;
    }
  }
  const responseHeaders = { 'X-Robots-Tag': 'noindex, nofollow', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'same-origin' };
  if (protectedPath(url.pathname) && !owner) {
    if (url.pathname.startsWith('/api/')) return Response.json({ error: 'Owner access is required.' }, { status: 403, headers: responseHeaders });
    if (!configured(env)) return new Response('Owner dashboard is not configured. The public PDF tools are available at /.', { status: 503, headers: responseHeaders });
    if (url.protocol !== 'https:') return new Response('HTTPS is required for owner sign-in.', { status: 403, headers: responseHeaders });
    return new Response('PDF Studio owner dashboard. Sign in with username owner and your owner password. Public PDF tools need no sign-in: return to /.', { status: 401, headers: { ...responseHeaders, 'WWW-Authenticate': 'Basic realm="PDF Studio owner", charset="UTF-8"' } });
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
  if (protectedPath(url.pathname) || owner) {response.headers.set('Cache-Control', 'no-store');response.headers.set('X-Robots-Tag','noindex, nofollow');}
  if (fresh) {
    const expires = String(now + lifetime);
    const hash = [...await signature('pdf-studio-owner:' + expires, env.OWNER_PASSWORD!)].map(v => v.toString(16).padStart(2, '0')).join('');
    response.headers.append('Set-Cookie', `${cookieName}=${expires}.${hash}; Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age=${lifetime}`);
  }
  return response;
}

