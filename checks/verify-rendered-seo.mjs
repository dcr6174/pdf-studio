import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {unstable_dev} from 'wrangler';
import {legacyMetadataTarget,protected404Paths,unapprovedMetadataPaths} from './legacy-metadata-expectations.mjs';

// Execute the actual built Cloudflare worker locally. No Cloudflare deployment,
// remote database, API keys, production writes or persistent local DB are used.
const worker=await unstable_dev('dist/server/index.js',{
 config:'dist/server/wrangler.json',local:true,persist:false,port:0,logLevel:'error',
 experimental:{disableExperimentalWarning:true,watch:false,testMode:true,forceLocal:true}
});
const origin='https://pdf-studio.in';
const decode=s=>s.replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#(?:x([a-f\d]+)|(\d+));/gi,(_,h,d)=>String.fromCodePoint(parseInt(h||d,h?16:10))).replace(/&apos;|&#39;/g,"'");
const attrs=tag=>Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*["']([^"']*)["']/g)].map(m=>[m[1].toLowerCase(),decode(m[2])]));
const pathname=url=>new URL(url,origin).pathname.replace(/\/+$/,'')||'/';
const parse=html=>{
 const document=html.replace(/<svg\b[\s\S]*?<\/svg>/gi,'');
 const metas=[...document.matchAll(/<meta\b[^>]*>/gi)].map(m=>attrs(m[0]));
 const links=[...document.matchAll(/<link\b[^>]*>/gi)].map(m=>attrs(m[0]));
 const canonical=links.find(l=>l.rel==='canonical')?.href;
 const structured=[...document.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map(m=>JSON.parse(m[1]));
 return {
  titles:[...document.matchAll(/<title>([\s\S]*?)<\/title>/gi)].map(m=>decode(m[1].trim())),
  description:metas.find(m=>m.name==='description')?.content,
  robots:metas.filter(m=>m.name==='robots').map(m=>m.content),
  ogUrl:metas.find(m=>m.property==='og:url')?.content,
  ogTitle:metas.find(m=>m.property==='og:title')?.content,
  canonical,structured,
  h1:(document.match(/<h1\b/gi)||[]).length,
  hrefs:[...document.matchAll(/<a\b[^>]*>/gi)].map(m=>attrs(m[0]).href).filter(Boolean)
 };
};

try{
 const aliases={
  '/tools/pdf-editor?utm_source=seo-test':'/tools/add-text-and-images?utm_source=seo-test',
  '/tools/edit-pdf':'/tools/add-text-and-images',
  '/tools/resize-to-a4':'/tools/resize-pages',
  '/guides/jpg-to-pdf/':'/guides/images-to-pdf',
  '/tools/html-to-pdf':'/guides/html-to-pdf',
  '/tools/powerpoint-to-pdf':'/guides/powerpoint-to-pdf',
  '/lab/sketch-pdf':'/tools/sketch-over-pdf',
  '/prove-it':'/check-it-yourself',
  '/creative/pdf-to-handwriting':'/tools/pdf-to-handwriting'
 };
 // Read the literal data list without requiring a second TypeScript runtime.
 const metadataSource=await readFile('lib/legacy-metadata-paths.ts','utf8');
 const metadataPaths=[...metadataSource.matchAll(/^ '([^']+)',?$/gm)].map(match=>match[1]);
 assert.equal(metadataPaths.length,317,'all approved historical addresses are tested');
 for(const path of metadataPaths)aliases[path]=legacyMetadataTarget(path);
 for(const [path,target] of Object.entries(aliases)){
  const response=await worker.fetch(path,{redirect:'manual'});
  assert.equal(response.status,308,'permanent canonical redirect: '+path);
  const location=new URL(response.headers.get('location'));
  assert.equal(location.pathname+location.search,target,'one-hop destination');
  const destination=await worker.fetch(target,{redirect:'manual'});
  assert.equal(destination.status,200,'redirect resolves to a real page: '+path);
 }
 const missingPaths=['/tools/not-a-real-tool','/guides/not-a-real-guide','/blog/not-a-real-article','/not-a-real-page',...protected404Paths,...unapprovedMetadataPaths.filter(path=>!path.startsWith('/api/'))];
 for(const path of missingPaths){
  const response=await worker.fetch(path,{redirect:'manual'}),page=parse(await response.text());
  assert.equal(response.status,404,'real error status: '+path);
  assert.match(response.headers.get('x-robots-tag')||'',/noindex/);
  assert(page.robots.every(r=>!/(^|[,\s])index([,\s]|$)/i.test(r)),'no conflicting index directive: '+path);
  assert(page.robots.some(r=>r.includes('noindex')),'noindex in rendered metadata: '+path);
  assert.equal(page.canonical,undefined,'errors must not canonicalize to the homepage: '+path);
  assert(page.titles.some(t=>/not found/i.test(t)),'error-specific title: '+path);
 }

 const sitemap=await readFile('public/sitemap.xml','utf8');
 const urls=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>decode(m[1]));
 const rows=[],incoming=new Set();
 let next=0;
 await Promise.all(Array.from({length:4},async()=>{
  while(next<urls.length){
   const url=urls[next++],path=new URL(url).pathname;
   const response=await worker.fetch(path,{redirect:'manual'}),page=parse(await response.text());
   assert.equal(response.status,200,'sitemap page: '+path);
   assert.equal(page.titles.length,1,'one document title (excluding SVG labels): '+path);
   assert(page.titles[0]&&page.description,'search metadata: '+path);
   assert.equal(pathname(page.canonical||'/missing-canonical'),pathname(url),'self canonical: '+path);
   assert.equal(new URL(page.canonical).origin,origin,'production canonical hostname');
   assert(!page.robots.some(r=>r.includes('noindex')),'indexable sitemap page: '+path);
   assert.equal(page.h1,1,'one primary heading: '+path);
   assert.equal(pathname(page.ogUrl||'/missing-og-url'),pathname(url),'page-specific Open Graph URL: '+path);
   for(const href of page.hrefs){
    const target=new URL(href,url);
    if(target.origin===origin&&pathname(target.href)!==pathname(url))incoming.add(pathname(target.href));
   }
   rows.push({path:pathname(url),title:page.titles[0],description:page.description,structured:page.structured});
   if(rows.length%100===0)console.log(`Verified ${rows.length}/${urls.length} built pages`);
  }
 }));
 for(const key of ['title','description']){
  const groups=new Map();
  for(const row of rows){
   const paths=groups.get(row[key])||[];paths.push(row.path);groups.set(row[key],paths);
  }
  assert.deepEqual([...groups.values()].filter(paths=>paths.length>1),[],'no duplicate '+key+' among sitemap pages');
 }
 const orphans=rows.filter(row=>row.path!=='/'&&!incoming.has(row.path)).map(row=>row.path);
 assert.deepEqual(orphans,[],'every sitemap page has an incoming HTML anchor');
 for(const row of rows.filter(row=>row.path.startsWith('/blog/'))){
  const types=row.structured.flatMap(value=>value['@graph']||[value]).map(value=>value['@type']);
  assert(types.includes('Article'),'article structured data: '+row.path);
  assert(types.includes('BreadcrumbList'),'article breadcrumb structured data: '+row.path);
 }
 console.log(`PASS: ${urls.length} built HTTP pages, unique metadata, canonical/social URLs, one H1, valid JSON-LD, no HTML-orphan pages; ${Object.keys(aliases).length} permanent redirects and ${missingPaths.length} noindex 404s.`);
}finally{
 await worker.stop();
}
