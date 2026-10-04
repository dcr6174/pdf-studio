import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
// Wording rules for pages that talk about limits, other products or privacy checks.
const files=['lib/comparisons.ts','app/compare/[slug]/page.tsx','app/check-it-yourself/page.tsx','app/guides/page.tsx','app/contact/page.tsx','app/about/page.tsx'];
const text={};for(const f of files)text[f]=await readFile(f,'utf8');
const all=Object.values(text).join('\n');

// 1. No visible numeric limits (same rule your homepage and guide checks already enforce)
assert.ok(!/157\.3 ?MB|\b50 ?MB|\b100 pages|\b400 pages|22 megapixels|\b20 files|Actual processing limits/.test(all),'no upfront numeric limits on comparison, privacy-check, guide, contact or about pages');
// 2. No absolutes or superiority claims about PDF Studio or others
assert.ok(!/\bno (?:task|daily|hourly|batch)[^.]{0,20}limits?\b|\bunlimited\b|\bnever (?:leave|leaves|left|upload)|\b100% (?:private|safe|secure)|\bbest\b|\bbetter than\b|\bwe beat\b/i.test(text['lib/comparisons.ts']+text['app/compare/[slug]/page.tsx']),'comparisons make no absolute or superiority claims');
// 3. Every comparison is attributed and dated
const cmp=text['lib/comparisons.ts'];
assert.ok(cmp.includes("COMPARISONS_CHECKED='4 October 2026'"));
const blocks=cmp.split("{slug:'").slice(1);assert.equal(blocks.length,4,'four comparisons');
for(const b of blocks){assert.ok(/sources:\[\{label:/.test(b),'has sources: '+b.slice(0,24));assert.ok(/source:\d/.test(b),'rows cite a source: '+b.slice(0,24));assert.ok(/We have not tested|we have not tested/.test(b),'says it did not test the other service: '+b.slice(0,24));}
assert.ok(text['app/compare/[slug]/page.tsx'].includes('We have not tested')&&text['app/compare/[slug]/page.tsx'].includes('confirm on the sources'),'page tells readers to confirm on the source');
assert.ok(!/Choose PDF Studio if|Choose \{c\.name\} if/.test(text['app/compare/[slug]/page.tsx']),'neutral headings');
// 4. The privacy-check page says what it cannot prove
const chk=text['app/check-it-yourself/page.tsx'];
for(const must of ['not a guarantee','not conclusive','What these checks cannot show','good sign','designed to','content-delivery hosts'])assert.ok(chk.includes(must),'check page says: '+must);
for(const bad of ['Prove it','The search finds nothing','means the word, and therefore your document','nothing needed a server','you do not have to take our word','is itself proof','The server accepts nothing else','Not included in any request'])assert.ok(!chk.includes(bad),'check page must not say: '+bad);
assert.ok(!/\bproof\b|\bprove\b/i.test(chk.replace(/className="[^"]*"/g,'').replace(/Do these checks prove that no file is ever uploaded\?|cannot prove it for every browser|They are not a guarantee/gi,'')),'no proof language');
console.log('PASS: no numeric limits or absolutes on the comparison, check-it-yourself, guides, contact and about pages; each comparison is sourced, dated, untested-by-us and neutral; the privacy-check page states its limits and the OCR host caveat.');

// Social and search tags are page-specific, and the moved page still redirects
const meta=await readFile('lib/page-meta.ts','utf8'),worker=await readFile('build/public-worker.ts','utf8');
assert.ok(meta.includes('og:url')||meta.includes("url,title,description"),'page-meta sets its own og:url');
for(const f of ['app/guides/page.tsx','app/contact/page.tsx','app/check-it-yourself/page.tsx','app/about/page.tsx','app/privacy/page.tsx'])assert.ok((await readFile(f,'utf8')).includes('pageMeta('),f+' sets page-specific Open Graph tags');
assert.ok(worker.includes("==='/prove-it'")&&worker.includes("url.pathname='/check-it-yourself'")&&worker.includes('301'),'old /prove-it address redirects');
console.log('PASS: page-specific Open Graph tags on guides, contact, check-it-yourself, about and privacy; /prove-it redirects permanently.');
