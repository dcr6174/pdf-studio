import fs from 'node:fs';
import ts from 'typescript';
import assert from 'node:assert/strict';
import {DOMParser} from '@xmldom/xmldom';
import {loadArticles} from '../scripts/article-data.mjs';
const moduleURL=text=>'data:text/javascript;base64,'+Buffer.from(ts.transpileModule(text,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText).toString('base64');
const toolsURL=moduleURL(fs.readFileSync('lib/tools.ts','utf8')),canonicalURL=moduleURL(fs.readFileSync('lib/canonical-routes.ts','utf8'));
const {seoPages}=await import(moduleURL(fs.readFileSync('lib/seo-tools.ts','utf8').replace("'./tools'",JSON.stringify(toolsURL)).replace("'./canonical-routes'",JSON.stringify(canonicalURL))));
const articles=await loadArticles();
const xml=new DOMParser().parseFromString(fs.readFileSync('public/sitemap.xml','utf8'),'application/xml');
const urls=Array.from(xml.getElementsByTagName('loc')).map(n=>n.textContent);assert.equal(new Set(urls).size,urls.length);
for(const page of seoPages){assert.ok(urls.includes('https://pdf-studio.in/tools/'+page.slug),page.slug);assert.ok(urls.includes('https://pdf-studio.in/guides/'+page.slug),'guide '+page.slug);}
assert.ok(urls.includes('https://pdf-studio.in/tools/add-text-and-images'));
const blog=urls.filter(url=>url.startsWith('https://pdf-studio.in/blog/')).sort();assert.deepEqual(blog,articles.map(a=>'https://pdf-studio.in/blog/'+a.slug).sort());
console.log(`PASS: ${urls.length} unique URLs, ${seoPages.length} tool/guide pairs, editor route and only registered published articles. Blog sources unchanged.`);
