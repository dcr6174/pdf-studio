import {readFile} from 'node:fs/promises';
import ts from 'typescript';

const root=new URL('../lib/',import.meta.url);
const asModule=text=>'data:text/javascript;base64,'+Buffer.from(ts.transpileModule(text,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText).toString('base64');
/** Load the editorial registry consistently in dependency-light asset/check scripts. */
export async function loadArticles(){
 const revisions=asModule(await readFile(new URL('article-worked-examples.ts',root),'utf8'));
 const source=(await readFile(new URL('articles.ts',root),'utf8')).replace("'./article-worked-examples'",JSON.stringify(revisions));
 return (await import(asModule(source))).articles;
}
