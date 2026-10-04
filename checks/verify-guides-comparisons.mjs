import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {existsSync} from 'node:fs';
import {build} from 'vite';
import {renderToStaticMarkup} from 'react-dom/server';

for (const [entry,dir] of [['app/guides/page.tsx','.guides-check'],['app/compare/[slug]/page.tsx','.comparisons-check'],['app/contact/page.tsx','.contact-check'],['app/prove-it/page.tsx','.proof-check']]) {
 await build({configFile:false,logLevel:'error',resolve:{alias:{'@':resolve('.')}},build:{ssr:entry,outDir:dir,emptyOutDir:true,rollupOptions:{output:{entryFileNames:'page.mjs'}}}});
}
const {default:Guides}=await import('../.guides-check/page.mjs');
const {default:Compare,generateStaticParams,generateMetadata}=await import('../.comparisons-check/page.mjs');
const {generateStaticParams:toolParams}=await import('../.seo-check/page.mjs');
const comparisons=generateStaticParams();
const destinations=new Set(['/', '/guides', '/privacy', '/about', '/contact', '/prove-it',...toolParams().map(p=>'/tools/'+p.slug),...comparisons.map(p=>'/compare/'+p.slug)]);
const sitemap=await readFile('public/sitemap.xml','utf8');
const check=html=>{
 assert.equal((html.match(/<h1>/g)||[]).length,1);
 assert.ok(!/157\.3 MB|50 MB|100 pages|400 pages|22 megapixels|20 files/.test(html),'numeric validation caps stay out of public page copy');
 for(const [,href] of html.matchAll(/href="(\/[^"?#]*)"/g))assert.ok(destinations.has(href)||existsSync(resolve('public','.'+href)),'working internal destination: '+href);
 assert.ok(html.includes('aria-label="PDF Studio home"'),'brand link retains accessible name');
};
check(renderToStaticMarkup(Guides()));
assert.equal(comparisons.length,4);
for(const params of comparisons){
 const html=renderToStaticMarkup(await Compare({params:Promise.resolve(params)}));check(html);
 const metadata=await generateMetadata({params:Promise.resolve(params)});
 assert.equal(metadata.alternates.canonical,'/compare/'+params.slug);
 assert.ok(sitemap.includes('https://pdf-studio.in/compare/'+params.slug));
 assert.ok(html.includes('scope="row"')&&html.includes('scope="col"'));
 assert.ok(html.includes('Sources')&&html.includes('Checked'));
 for(const [,schema]of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g))JSON.parse(schema);
 if(params.slug.includes('adobe'))assert.ok(html.includes('India'),'regional Adobe offer is disclosed');
}
await assert.rejects(()=>Compare({params:Promise.resolve({slug:'missing-comparison'})}));
console.log('PASS: guides hub and all four comparison pages render, internal links resolve, schemas parse, canonicals match, brand links have names, and upfront validation caps remain hidden.');

for(const [slug,dir] of [['contact','.contact-check'],['prove-it','.proof-check']]){const page=await import('../'+dir+'/page.mjs');check(renderToStaticMarkup(page.default()));assert.equal(page.metadata.alternates.canonical,'/'+slug);assert.ok(sitemap.includes('https://pdf-studio.in/'+slug));}
console.log('PASS: Contact and Prove it render with valid destinations and canonicals.');
