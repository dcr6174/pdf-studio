/** Keep indexed URLs canonical; never borrow an alias's lastmod. */
export function canonicalSitemapEntries(entries, toolAliases = {}) {
  const redirects = {
    '/lab/sketch-pdf': '/tools/sketch-over-pdf',
    '/tools/html-to-pdf': '/guides/html-to-pdf',
    '/tools/powerpoint-to-pdf': '/guides/powerpoint-to-pdf',
    '/prove-it': '/check-it-yourself',
  };
  const canonical = path => {
    const clean = path === '/' ? path : path.replace(/\/+$/, '');
    const match = clean.match(/^\/(tools|guides)\/([^/]+)$/);
    return redirects[clean] ?? (match && toolAliases[match[2]] ? '/' + match[1] + '/' + toolAliases[match[2]] : clean);
  };
  const result = new Map();
  for (const entry of entries) {
    if (canonical(entry.path) === entry.path && !result.has(entry.path)) result.set(entry.path, entry);
  }
  for (const entry of entries) {
    const path = canonical(entry.path);
    if (!result.has(path)) result.set(path, {path});
  }
  return [...result.values()];
}
