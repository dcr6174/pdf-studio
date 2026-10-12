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
