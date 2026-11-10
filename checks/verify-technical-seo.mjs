import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {build} from 'vite';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {canonicalSitemapEntries} from '../scripts/canonical-sitemap.mjs';
import {legacyMetadataTarget,protected404Paths,unapprovedMetadataPaths} from './legacy-metadata-expectations.mjs';

await build({
 configFile:false,logLevel:'error',resolve:{alias:{'@':resolve('.')}},
 build:{ssr:'checks/seo-policy-entry.ts',outDir:'.seo-policy-check',emptyOutDir:true,rollupOptions:{output:{entryFileNames:'entry.mjs'}}}
});
const seo=await import('../.seo-policy-check/entry.mjs');
const {canonicalPublicPath:path,canonicalPublicRedirect:redirect}=seo;
assert.equal(seo.legacyMetadataPaths.length,220,'only the approved export addresses');
assert.equal(new Set(seo.legacyMetadataPaths).size,220,'no duplicate allowlist entries');
for(const input of seo.legacyMetadataPaths){
 const expected=legacyMetadataTarget(input);
 assert.equal(path(input),expected,'verified historical address: '+input);
 assert.equal(path(input+'/'),expected,'no trailing-slash redirect chain');
 assert.equal(path(input.replace(':','%3A')),expected,'encoded colon variant');
 assert.equal(path(expected),expected,'canonical destination is final');
 for(const method of ['GET','HEAD']){
  const result=redirect(new Request('https://pdf-studio.in'+input+'?source=gsc&mode=read',{method}));
  assert.equal(result.href,'https://pdf-studio.in'+expected+'?source=gsc&mode=read','preserve queries: '+input);
 }
 assert.equal(redirect(new Request('https://pdf-studio.in'+input,{method:'POST'})),null,'never redirect writes');
}
for(const input of [...protected404Paths,...unapprovedMetadataPaths]){
 assert.equal(path(input),input,'do not redirect excluded/unknown addresses');
 assert.equal(redirect(new Request('https://pdf-studio.in'+input)),null);
}
for(const input of protected404Paths){
 assert(seo.isPermanentlyRemovedPath(input),'exported permanent removal: '+input);
 for(const method of ['GET','HEAD']){
  const response=seo.permanentlyRemovedResponse(new Request('https://pdf-studio.in'+input+'?from=gsc',{method}));
  assert.equal(response.status,410);
  assert.match(response.headers.get('x-robots-tag'),/noindex/);
  assert.equal(response.headers.get('location'),null,'gone URLs do not redirect');
 }
 assert.equal(seo.permanentlyRemovedResponse(new Request('https://pdf-studio.in'+input,{method:'POST'})),null);
}
assert.equal(seo.isPermanentlyRemovedPath('/test-fixtures/%'),false,'invalid URI escapes cannot crash the worker');
for(const input of [...seo.legacyMetadataPaths,...unapprovedMetadataPaths,'/tools/merge-pdf','/test-fixtures/source.pdf']){
 assert.equal(seo.isPermanentlyRemovedPath(input),false,'unrelated and working addresses are preserved');
}
const cases={
 '/tools/pdf-editor':'/tools/add-text-and-images',
 '/tools/edit-pdf':'/tools/add-text-and-images',
 '/guides/pdf-editor/':'/guides/add-text-and-images',
 '/tools/resize-to-a4':'/tools/resize-pages',
 '/tools/jpg-to-pdf':'/tools/images-to-pdf',
 '/tools/html-to-pdf':'/guides/html-to-pdf',
 '/tools/powerpoint-to-pdf/':'/guides/powerpoint-to-pdf',
 '/creative/pdf-to-handwriting':'/tools/pdf-to-handwriting',
 '/lab/sketch-pdf':'/tools/sketch-over-pdf',
 '/prove-it/':'/check-it-yourself',
 '/tools/merge-pdf/':'/tools/merge-pdf',
 '/':'/',
};
for(const [input,expected] of Object.entries(cases)){
 assert.equal(path(input),expected,input);
 assert.equal(path(path(input)),expected,'canonical paths are idempotent');
}
for(const [alias,target] of Object.entries(seo.canonicalToolRoutes)){
 assert(seo.seoPages.some(p=>p.slug===target),'redirect target is a real tool: '+alias);
}
const destination=redirect(new Request('http://www.pdf-studio.in/tools/pdf-editor/?utm_source=test#open'));
assert.equal(destination.href,'https://pdf-studio.in/tools/add-text-and-images?utm_source=test#open');
assert.equal(redirect(new Request('https://pdf-studio.in/tools/merge-pdf')),null);
assert.equal(redirect(new Request('https://pdf-studio.in/api/analytics/collect',{method:'POST'})),null);
assert.equal(redirect(new Request('https://pdf-studio.in/tools/pdf-editor',{method:'POST'})),null);
assert.equal(redirect(new Request('http://localhost:5173/tools/merge-pdf')),null,'local development is not redirected');
const html=renderToStaticMarkup(createElement(seo.Link,{href:'/tools/edit-pdf?mode=annotate#open'},'Edit PDF'));
assert(html.includes('/tools/add-text-and-images?mode=annotate#open'),'native links avoid redirect chains');
assert(renderToStaticMarkup(createElement(seo.Link,{href:'/lab/pomodoro:1ql3syo?mode=read#timer'},'Timer')).includes('/lab/pomodoro?mode=read#timer'),'historical links normalize without losing query or fragment');
assert(renderToStaticMarkup(createElement(seo.Link,{href:'https://example.org/tools/edit-pdf'},'External')).includes('https://example.org/tools/edit-pdf'));

const descriptions=new Set(),titles=new Set();
for(const page of seo.seoPages){
 const meta=seo.guideMeta(page.slug,page.title,page.intro,'/social/'+page.slug+'.png');
 assert.equal(meta.alternates.canonical,'/guides/'+page.slug);
 assert.equal(meta.openGraph.url,'https://pdf-studio.in/guides/'+page.slug);
 assert.equal(meta.twitter.title,meta.title.absolute);
 assert.equal(meta.openGraph.title,meta.title.absolute);
 assert.equal(meta.openGraph.description,meta.description);
 assert(meta.description.length<=160,'guide snippet fits without arbitrary keyword stuffing');
 assert.notEqual(meta.description,seo.toolMeta[page.slug]?.description,'tool and guide have different intent');
 assert(!descriptions.has(meta.description),'unique guide description: '+page.slug);
 assert(!titles.has(meta.title.absolute),'unique guide title: '+page.slug);
 descriptions.add(meta.description);titles.add(meta.title.absolute);
}
for(const page of seo.creativeTools){
 const meta=seo.guideMeta(page.slug,page.title,page.description);
 assert.equal(meta.openGraph.url,'https://pdf-studio.in/guides/'+page.slug,'handwriting guides must not share homepage URL');
}
assert.deepEqual(seo.pageMeta('/lab/remove-watermark','Remove Watermark | PDF Studio','Description').title,{absolute:'Remove Watermark | PDF Studio'});
assert.equal(seo.notFoundMetadata.robots.index,false);
assert.equal(seo.notFoundMetadata.alternates.canonical,null);
assert.match(seo.notFoundMetadata.title.absolute,/not found/i);
const rootLayout=await readFile('app/layout.tsx','utf8');
assert(!/robots:\s*\{\s*index:\s*true/.test(rootLayout),'root must not contradict automatic noindex on errors');
const worker=await readFile('build/public-worker.ts','utf8');
assert(worker.includes("headers.set('X-Robots-Tag','noindex, follow')"),'error responses have a crawler-visible header');

const directory=renderToStaticMarkup(createElement(seo.PublicDirectory,{
 title:'All games',entries:seo.activeArcadeGames.map(game=>({path:'/lab/arcade/'+game.slug,title:game.name}))
}));
assert.equal((directory.match(/<a /g)||[]).length,100,'all playable games have SSR anchors before filters are used');
for(const [Component,heading,mainCount] of [[seo.HandwritingStudio,'h1',1],[seo.EmbeddedHandwritingStudio,'h2',0]]){
 const output=renderToStaticMarkup(createElement(Component,{mode:'handwriting-practice'}));
 assert.equal((output.match(/<main\b/g)||[]).length,mainCount,'embedded worksheets do not nest main landmarks');
 assert(output.includes('<'+heading+'>Handwriting practice</'+heading+'>'));
 assert.equal((output.match(/<h1\b/g)||[]).length,heading==='h1'?1:0);
}
const home=await readFile('app/page.tsx','utf8');
assert(home.includes('<h1 className="sr-only">Free PDF tools to edit, merge, compress and sign</h1>'));
for(const file of ['components/home-motion-hero.tsx','components/mobile-home-explorer.tsx'])assert(!(await readFile(file,'utf8')).includes('<h1'),'responsive decoration must not duplicate the main heading');

const sitemap=await readFile('public/sitemap.xml','utf8');
const locations=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
assert.equal(new Set(locations).size,locations.length);
for(const url of locations){
 const u=new URL(url);
 assert.equal(u.origin,'https://pdf-studio.in');
 assert.equal(path(u.pathname),u.pathname,'sitemap contains no redirected path: '+u.pathname);
 assert(!/\/(analytics|test-files|brand-options)(\/|$)/.test(u.pathname),'private and test pages stay out of sitemap');
}
const aliases=canonicalSitemapEntries([
 {path:'/guides/jpg-to-pdf',lastmod:'2026-10-01'},
 {path:'/guides/images-to-pdf',lastmod:'2026-10-02'},
 {path:'/tools/html-to-pdf'}, {path:'/prove-it'}, {path:'/tools/merge-pdf/'}
],seo.canonicalToolRoutes);
assert.deepEqual(aliases,[
 {path:'/guides/images-to-pdf',lastmod:'2026-10-02'},
 {path:'/guides/html-to-pdf'}, {path:'/check-it-yourself'}, {path:'/tools/merge-pdf'}
]);
console.log(`PASS: canonical redirects and native links, ${seo.seoPages.length} distinct guide snippets/social URLs, 404 policy, 100 SSR game links, responsive headings, nested worksheet semantics and ${locations.length} canonical sitemap entries.`);
