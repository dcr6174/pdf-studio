/** Keep indexed URLs canonical; never borrow an alias's lastmod. */
export function canonicalSitemapEntries(entries, toolAliases = {}) {
  const redirects = { '/lab/sketch-pdf': '/tools/sketch-over-pdf' };
  const canonical = path => {
    const match = path.match(/^\/tools\/([^/]+)$/);
    return redirects[path] ?? (match && toolAliases[match[1]] ? '/tools/' + toolAliases[match[1]] : path);
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
