import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
const moduleURL=text=>'data:text/javascript;base64,'+Buffer.from(ts.transpileModule(text,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText).toString('base64');
const {arcadeGames}=await import(moduleURL(fs.readFileSync('lib/arcade-catalog.ts','utf8')));
const {puzzleGames}=await import(moduleURL(fs.readFileSync('lib/puzzle-catalog.ts','utf8')));
const {clubGames}=await import(moduleURL(fs.readFileSync('lib/club-catalog.ts','utf8')));
const allGames=[...arcadeGames,...puzzleGames,...clubGames];
assert.equal(allGames.length,60);
const xml=fs.readFileSync('public/sitemap.xml','utf8'),urls=[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
for(const route of ['/lab/arcade',...allGames.map(g=>'/lab/arcade/'+g.slug)])assert.equal(urls.filter(u=>u==='https://pdf-studio.in'+route).length,1,'canonical indexed route: '+route);
const {imageTools}=await import(moduleURL(fs.readFileSync('lib/image-tools.ts','utf8')));
const imageModule=moduleURL('export const imageTools='+JSON.stringify(imageTools));
const {isAdvertisingPage}=await import(moduleURL(fs.readFileSync('lib/advertising.ts','utf8').replace("'./image-tools'",JSON.stringify(imageModule))));
assert(!isAdvertisingPage('/lab/arcade'));for(const g of allGames)assert(!isAdvertisingPage('/lab/arcade/'+g.slug));assert(isAdvertisingPage('/blog'),'existing editorial ads remain enabled');
console.log('PASS: Arcade directory and all 60 games are indexed exactly once; Arcade ad loader is disabled without changing editorial ad eligibility.');

