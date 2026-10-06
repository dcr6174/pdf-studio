import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import ts from 'typescript';
const code=ts.transpileModule(await readFile('lib/navigation-metadata.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const {syncNavigationMetadata}=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
class Element{
 constructor(tag){this.tagName=tag;this.attributes={};this.dataset={};this.textContent='';}
 setAttribute(key,value){this.attributes[key]=value;}
 remove(){if(this.parentNode){this.parentNode.children=this.parentNode.children.filter(n=>n!==this);this.parentNode=null;}}
}
const head={children:[],appendChild(node){node.parentNode=this;this.children.push(node);},querySelectorAll(selector){const [,tag,attribute,value]=/^(\w+)\[([^=]+)="([^"]+)"\]$/.exec(selector);return this.children.filter(n=>n.tagName===tag&&(n.attributes[attribute]??n[attribute])===value);}};
globalThis.document={head,title:'Home',createElement:tag=>new Element(tag),querySelectorAll:selector=>head.querySelectorAll(selector)};
for(let i=0;i<2;i++){const link=new Element('link');link.rel='canonical';link.href='https://pdf-studio.in/';head.appendChild(link);}
const schema=new Element('script');schema.type='application/ld+json';schema.textContent=JSON.stringify({'@graph':[{'@type':'Organization',name:'PDF Studio'},{'@type':'FAQPage',name:'Old home FAQ'}]});head.appendChild(schema);
for(const slug of ['pdf-to-word','merge-pdf','']){
 const url='https://pdf-studio.in/'+(slug?'tools/'+slug:'');
 syncNavigationMetadata({title:slug||'Home',description:slug+' description',url,image:url+'.png'});
 assert.equal(head.querySelectorAll('link[rel="canonical"]').length,1);
 assert.equal(head.querySelectorAll('link[rel="canonical"]')[0].href,url);
 assert.equal(head.querySelectorAll('meta[name="description"]')[0].content,slug+' description');
 assert.equal(head.querySelectorAll('meta[property="og:url"]')[0].content,url);
 assert.equal(head.querySelectorAll('meta[name="twitter:title"]')[0].content,slug||'Home');
 assert.equal(document.title,slug||'Home');
 const schemas=head.querySelectorAll('script[type="application/ld+json"]').map(n=>JSON.parse(n.textContent));
 assert.equal(schemas.filter(s=>s['@type']==='WebApplication').length,1);
 assert(!JSON.stringify(schemas).includes('Old home FAQ'));
 assert(JSON.stringify(schemas).includes('Organization'));
}
console.log('PASS: metadata updates across tool/home transitions, canonical deduplication, social metadata, stale route schema removal and site schema retention.');
