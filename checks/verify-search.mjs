import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import ts from 'typescript';
const mod=text=>'data:text/javascript;base64,'+Buffer.from(ts.transpileModule(text,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText).toString('base64');
const toolsUrl=mod(await readFile('lib/tools.ts','utf8'));
const {tools}=await import(toolsUrl);
const {searchToolsDetailed,searchTools,toolKeywords}=await import(mod((await readFile('lib/tool-search.ts','utf8')).replace("'./tools'",JSON.stringify(toolsUrl))));
// every tool has keywords, and no keyword entry points at a missing tool
for(const t of tools)assert.ok(toolKeywords[t.id],'keywords missing for '+t.id);
for(const id of Object.keys(toolKeywords))assert.ok(tools.some(t=>t.id===id),'keywords for unknown tool '+id);
const first=(q)=>searchTools(q)[0]?.id;
const cases=[
 ['merge','merge'],['combine pdf','merge'],['join','merge'],
 ['reduce size','compress'],['shrink pdf','compress'],['under 100kb','compress'],['compres','compress'],['compress resume','compress'],
 ['jpg to pdf','images'],['png to pdf','images'],['photo to pdf','images'],['pdf to jpg','jpg'],['pdf to image','jpg'],
 ['camera','scan'],['scan to pdf','scan'],
 ['edit text','native-text'],['edit resume','native-text'],['fix typo','native-text'],['mrege','merge'],
 ['unlock','decrypt'],['remove password','decrypt'],['add password','encrypt'],
 ['delete page','organize'],['remove pages','organize'],['extract pages','split'],
 ['sign','sign'],['signature','sign'],['esign','sign'],
 ['word to pdf','docx'],['pdf to word','word'],['excel to pdf','sheet'],['pdf to excel','xlsx'],
 ['ocr','ocr'],['searchable','ocr'],['scanned','ocr'],
 ['page numbers','numbers'],['watermark','watermark'],['black out','redact'],['sideways','rotate'],['rotate','rotate'],
 ['corrupted','repair'],['dark mode','invert'],['listen','audio'],['compare','compare'],['checksum','hash'],['zip','zip'],['trim margins','crop'],['a4','resize'],
];
for(const [q,expected] of cases)assert.equal(first(q),expected,`"${q}" should find ${expected}, got ${first(q)}`);
assert.equal(searchToolsDetailed('').mode,'empty');assert.equal(searchTools('').length,tools.length);
assert.equal(searchTools('pdf').length,tools.length,'a generic word alone shows everything');
assert.equal(searchToolsDetailed('qzxqzx').mode,'none');assert.equal(searchTools('qzxqzx').length,0);
assert.equal(searchToolsDetailed('merge banana').mode,'any','partial matches are labelled');
assert.equal(searchTools('merge banana')[0].id,'merge');
console.log(`PASS: ${cases.length} search intents, typos, direction (jpg to pdf vs pdf to jpg), partial and empty results, and keywords for all ${tools.length} tools.`);
