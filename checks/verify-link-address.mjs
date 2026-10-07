import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import ts from 'typescript';
import vm from 'node:vm';
const source=await readFile('lib/page-geometry.ts','utf8');const exports={};vm.runInNewContext(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,{exports,URL});const {safeLink}=exports;
for(const [input,output] of [['abc.com','https://abc.com/'],[' ABC.COM ','https://abc.com/'],['www.abc.com/help?q=pdf','https://www.abc.com/help?q=pdf'],['https://abc.com/docs','https://abc.com/docs'],['http://abc.com','http://abc.com/'],['mailto:hello@abc.com','mailto:hello@abc.com']])assert.equal(safeLink(input),output);
for(const input of ['abc','a b.com','javascript:alert(1)','data:text/html,test','file:///test','user:pass@abc.com','abc..com','-abc.com','abc.123',''])assert.equal(safeLink(input),undefined,input);
console.log('PASS: bare domains normalize to HTTPS; existing web/mail links work; malformed and unsafe addresses are rejected.');
