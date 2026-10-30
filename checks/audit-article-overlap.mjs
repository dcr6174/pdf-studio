import fs from 'node:fs';
import ts from 'typescript';
import assert from 'node:assert/strict';
import {build} from 'vite';

// Exact-repeat flags are an editorial triage signal, not a ranking/content score.
const source=fs.readFileSync('lib/articles.ts','utf8');
const baseline=source.replace(/^import .*article-worked-examples.*\n/m,'').replace('articleDrafts.map(reviseArticle)','articleDrafts');
const js=ts.transpileModule(baseline,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const {articles:before}=await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'));
await build({configFile:false,logLevel:'error',build:{ssr:'lib/articles.ts',outDir:'.guide-content-check',emptyOutDir:true,rollupOptions:{output:{entryFileNames:'articles.mjs'}}}});
const {articles:after}=await import('../.guide-content-check/articles.mjs');
assert.deepEqual(after.map(a=>a.slug),before.map(a=>a.slug),'all article routes and their order retained');
function analyse(articles){
 const groups=Map.groupBy(articles,a=>a.toolId);
 return [...groups].map(([toolId,group])=>{
  const pairs=[];
  for(let i=0;i<group.length;i++)for(let j=i+1;j<group.length;j++){
   const a=group[i],b=group[j];
   const paragraphs=a.sections?.flatMap(s=>s.paragraphs)||[];
   const other=new Set(b.sections?.flatMap(s=>s.paragraphs)||[]);
   pairs.push({routes:['/blog/'+a.slug,'/blog/'+b.slug],sameSteps:JSON.stringify(a.steps)===JSON.stringify(b.steps),sameFAQ:JSON.stringify(a.faq)===JSON.stringify(b.faq),sharedParagraphs:paragraphs.filter(p=>other.has(p)).length,sameEvidence:!!a.evidence&&JSON.stringify(a.evidence)===JSON.stringify(b.evidence)});
  }
  return {toolId,articles:group.length,flaggedPairs:pairs.filter(p=>p.sameSteps||p.sameFAQ||p.sharedParagraphs>=2).length,pairs};
 });
}
const old=analyse(before),current=analyse(after);
const report={method:'Exact steps/FAQ equality and repeated section paragraphs within each tool family. This flags potential intent overlap, not search demand, rankings or semantic plagiarism. Bespoke templates and guides require manual inspection.',articles:after.length,before:old,after:current};
fs.writeFileSync('docs/article-overlap-inventory.json',JSON.stringify(report,null,2)+'\n');
for(const id of ['split','reverse']){
 const group=current.find(g=>g.toolId===id);
 assert.equal(group.flaggedPairs,0,'prioritized articles no longer share complete steps/FAQ or multiple paragraphs: '+id);
 for(const a of after.filter(a=>a.toolId===id)){
  assert(a.workedExample&&!a.evidence,'scenario-specific evidence replaces generic evidence');
  assert(a.check!==a.limit,'acceptance check differs from limitation');
  const root='public/examples/guide-intent/'+a.workedExample.id;
  assert(fs.existsSync(root+'-input.pdf'));
  assert(fs.existsSync(root+'-result.'+(a.workedExample.id==='invoice-groups'?'zip':'pdf')));
 }
}
console.log(JSON.stringify({articles:after.length,groups:current.length,flaggedGroupsBefore:old.filter(g=>g.flaggedPairs).length,flaggedGroupsAfter:current.filter(g=>g.flaggedPairs).length,flaggedPairsBefore:old.reduce((n,g)=>n+g.flaggedPairs,0),flaggedPairsAfter:current.reduce((n,g)=>n+g.flaggedPairs,0)}));
