import assert from 'node:assert/strict';
import {canonicalSitemapEntries} from '../scripts/canonical-sitemap.mjs';
const aliases={'pdf-editor':'edit-pdf','jpg-to-pdf':'images-to-pdf'};
const entries=[
 {path:'/lab/sketch-pdf',lastmod:'2026-10-12'},
 {path:'/tools/pdf-editor',lastmod:'2026-10-12'},
 {path:'/tools/edit-pdf',lastmod:'2026-10-09'},
 {path:'/tools/edit-pdf',lastmod:'2026-10-10'},
 {path:'/tools/jpg-to-pdf'},
 {path:'/guides/jpg-to-pdf',lastmod:'2026-10-04'},
 {path:'/lab/image-crop'},
];
const result=canonicalSitemapEntries(entries,aliases);
assert.deepEqual(result,[
 {path:'/tools/edit-pdf',lastmod:'2026-10-09'},
 {path:'/guides/jpg-to-pdf',lastmod:'2026-10-04'},
 {path:'/lab/image-crop'},
 {path:'/tools/sketch-over-pdf'},
 {path:'/tools/images-to-pdf'},
]);
assert.equal(new Set(result.map(e=>e.path)).size,result.length);
assert.deepEqual(canonicalSitemapEntries(result,aliases),result);
assert.deepEqual(canonicalSitemapEntries([]),[]);
console.log('PASS: redirects become canonical URLs, duplicates disappear, canonical lastmod is retained, distinct guides and Lab tools remain, generation is idempotent.');

// Exercise the real generator's assembly block, including fixed information pages.
const {readFile} = await import('node:fs/promises');
const {createHash} = await import('node:crypto');
const source = await readFile(new URL('../scripts/generate-site-assets.mjs',import.meta.url),'utf8');
const assembly = source.slice(source.indexOf('const entries=pages.map'));
assert(assembly.startsWith('const entries=pages.map'));
const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
let xml;
await new AsyncFunction('pages','createHash','state','old','today','base','imageTools','canonicalToolRoutes','canonicalSitemapEntries','writeFile','stateURL','root','seoPages','conversionGuides','console',assembly)(
 [{path:'/tools/sketch-over-pdf',content:'sketch'}],createHash,{}, {}, '2026-10-12','https://pdf-studio.in',
 [{slug:'image-crop'},{slug:'image-size-reducer'}],aliases,canonicalSitemapEntries,
 async(path,body)=>{if(String(path).endsWith('/sitemap.xml'))xml=body;},'state.json',new URL('../',import.meta.url),[],[],{log(){}}
);
const locations=[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
assert(locations.includes('https://pdf-studio.in/faq'));
assert(locations.includes('https://pdf-studio.in/lab/image-crop'));
assert(locations.includes('https://pdf-studio.in/tools/sketch-over-pdf'));
assert(!locations.includes('https://pdf-studio.in/lab/sketch-pdf'));
assert.equal(new Set(locations).size,locations.length);
console.log('PASS: real generator assembly accepts article/tool records, Lab/image entries and fixed information pages, and writes deduplicated canonical XML.');
