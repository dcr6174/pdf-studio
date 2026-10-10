import fs from 'node:fs';
import assert from 'node:assert/strict';
import ts from 'typescript';
const moduleURL=text=>'data:text/javascript;base64,'+Buffer.from(ts.transpileModule(text,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText).toString('base64');
const {imageGuides}=await import(moduleURL(fs.readFileSync('lib/image-guides.ts','utf8')));
const {imageTools}=await import(moduleURL(fs.readFileSync('lib/image-tools.ts','utf8')));
const slugs=new Set(imageGuides.map(g=>g.slug)),toolSlugs=new Set(imageTools.map(t=>t.slug));
assert.equal(slugs.size,imageGuides.length,'Guide URLs must be unique');
assert.equal(new Set(imageGuides.map(g=>g.title)).size,imageGuides.length,'Titles must be distinct');
const xml=fs.readFileSync('public/sitemap.xml','utf8'),urls=[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
assert.equal(new Set(urls).size,urls.length,'Sitemap URLs must be unique');
assert(urls.includes('https://pdf-studio.in/lab/guides'),'Guide directory must be indexed');
for(const tool of imageTools){const g=imageGuides.find(g=>g.slug===tool.slug);assert(g,`Missing dedicated guide: ${tool.slug}`);assert.equal(g.kind,'Tool guide');assert(g.tools.includes(tool.slug));}
for(const legacy of ['image-size-reducer','image-formats','resize-or-crop','safe-svg','favicon-generator','signature-cleaner','image-background-remover'])assert(slugs.has(legacy),'Preserve existing guide URL: '+legacy);
for(const g of imageGuides){
 assert(g.title&&g.description&&g.intro,'Missing editorial fields: '+g.slug);
 assert(g.steps.length>=3&&g.sections.length>=3&&g.checks.length>=2&&g.limitations.length>=2&&g.faq.length>=2,'Incomplete guide: '+g.slug);
 assert.equal(new Set(g.sections.map(s=>s.title)).size,g.sections.length,'Duplicate headings: '+g.slug);
 const body=[g.intro,...g.steps,...g.sections.map(s=>s.text),...Object.values(g.example),...g.checks,...g.limitations,...g.faq.flatMap(f=>[f.question,f.answer])].join(' ');
 assert(body.trim().split(/\s+/).length>=300,'Review short or incomplete content: '+g.slug);
 assert(g.example.input&&g.example.settings&&g.example.expected,'Missing example: '+g.slug);
 for(const slug of g.tools)assert(toolSlugs.has(slug),'Unknown tool link: '+slug);
 for(const slug of g.related)assert(slugs.has(slug)&&slug!==g.slug,'Broken related guide: '+slug);
 assert(!Number.isNaN(Date.parse(g.published))&&!Number.isNaN(Date.parse(g.updated)),'Invalid date: '+g.slug);
 assert(g.updated>=g.published,'Modification predates publication');
 assert(urls.includes('https://pdf-studio.in/lab/guides/'+g.slug),'Missing guide sitemap entry: '+g.slug);
 for(const source of g.sources)assert.equal(new URL(source.url).protocol,'https:');
}
const studio=fs.readFileSync('components/image-lab-studio.tsx','utf8');assert(studio.includes('help={"/lab/guides/" + slug}'),'Every image tool needs its dedicated Help link');
const blog=fs.readFileSync('app/blog/page.tsx','utf8');assert(blog.includes('imageGuides.map'),'Image articles must be discoverable in the blog');
console.log(`PASS: ${imageTools.length} tools covered, ${imageGuides.length} substantive guides, existing URLs preserved, related links and sitemap valid.`);
