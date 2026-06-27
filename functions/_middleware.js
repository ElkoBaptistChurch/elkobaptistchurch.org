// Cloudflare Pages Function — runs on every request before static assets are served.
// _headers is path-based only, so it can't scope a noindex rule to a single
// preview hostname. This checks the request host instead.
const NOINDEX_HOSTS = new Set(['demo.elkobaptistchurch.org']);

export async function onRequest(context) {
  const response = await context.next();
  const hostname = new URL(context.request.url).hostname;

  if (NOINDEX_HOSTS.has(hostname)) {
    const headers = new Headers(response.headers);
    headers.set('X-Robots-Tag', 'noindex, nofollow');
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }

  return response;
}
