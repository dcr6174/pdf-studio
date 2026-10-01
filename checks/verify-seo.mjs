import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {build} from 'vite';
import {renderToStaticMarkup} from 'react-dom/server';
await build({configFile:false,logLevel:'error',resolve:{alias:{'@':resolve('.')}},build:{ssr:'app/tools/[slug]/page.tsx',outDir:'.seo-check',emptyOutDir:true,rollupOptions:{output:{entryFileNames:'page.mjs'}}}});
const {default:ToolPage,generateStaticParams,generateMetadata}=await import('../.seo-check/page.mjs');
const pages=generateStaticParams(),sitemap=await readFile('public/sitemap.xml','utf8'),robots=await readFile('public/robots.txt','utf8');assert.equal(new Set(pages.map(p=>p.slug)).size,pages.length);assert.equal(pages.length,56);
for(const params of pages){assert.match(params.slug,/^[a-z0-9-]+$/);const metadata=await generateMetadata({params:Promise.resolve(params)});assert.equal(metadata.alternates.canonical,'/tools/'+params.slug);assert.ok(metadata.description.length>30);const html=renderToStaticMarkup(await ToolPage({params:Promise.resolve(params)}));assert.equal((html.match(/<h1>/g)||[]).length,1,'one task heading');assert.ok(html.includes('studio-content'),'workspace is embedded');assert.ok(html.includes('type="file"'),'real file picker is present');assert.ok(html.includes('BreadcrumbList'));assert.ok(html.includes('href="#studio-content"'));assert.ok(sitemap.includes('https://pdf-studio.in/tools/'+params.slug));if(params.slug==='edit-pdf-text')assert.ok(html.includes('50 MB and 100 pages'));}
assert.ok(sitemap.includes('https://pdf-studio.in/privacy'));assert.ok(sitemap.includes('https://pdf-studio.in/about'));assert.ok(!sitemap.includes('#'));assert.ok(!sitemap.includes('/analytics'));assert.ok(robots.includes('Disallow: /api/'));assert.ok(robots.includes('Disallow: /analytics'));await assert.rejects(()=>ToolPage({params:Promise.resolve({slug:'unsupported-conversion'})}));
console.log('PASS: 56 server-rendered tool guides, unique routes, per-page canonicals/descriptions, breadcrumbs, valid tool links, accurate text-editor limits, sitemap/privacy/about and private-path exclusions.');
