import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
const moduleURL=text=>'data:text/javascript;base64,'+Buffer.from(ts.transpileModule(text,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText).toString('base64');
const catalogPaths=['arcade','puzzle','club','fresh','expansion'].map(name=>'lib/'+(name==='arcade'?'arcade-catalog':name+'-catalog')+'.ts');
const moduleURLs=catalogPaths.map(path=>moduleURL(fs.readFileSync(path,'utf8')));
const [{arcadeGames},{puzzleGames},{clubGames},{freshGames},{expansionGames}]=await Promise.all(moduleURLs.map(url=>import(url)));
const activeSource=fs.readFileSync('lib/arcade-active.ts','utf8')
 .replace("'./arcade-catalog'",JSON.stringify(moduleURLs[0]))
 .replace("'./puzzle-catalog'",JSON.stringify(moduleURLs[1]))
 .replace("'./club-catalog'",JSON.stringify(moduleURLs[2]))
 .replace("'./fresh-catalog'",JSON.stringify(moduleURLs[3]))
 .replace("'./expansion-catalog'",JSON.stringify(moduleURLs[4]));
const {activeArcadeGames,retiredArcadeSlugs}=await import(moduleURL(activeSource));
const all=[...arcadeGames,...puzzleGames,...clubGames,...freshGames,...expansionGames];
assert.equal(all.length,118,'118 authored concepts including 18 retired duplicates');
assert.equal(retiredArcadeSlugs.length,18);
assert.equal(activeArcadeGames.length,100,'exactly 100 playable games');
assert.equal(new Set(activeArcadeGames.map(g=>g.slug)).size,100,'each game has unique slug');
assert.equal(new Set(activeArcadeGames.map(g=>g.name)).size,100,'each game has a distinct visible name');
assert(activeArcadeGames.every(g=>g.name&&g.description&&g.instructions&&g.color),'every game includes description, instructions and theme');
assert(!activeArcadeGames.some(g=>retiredArcadeSlugs.includes(g.slug)),'no retired game is advertised');
const xml=fs.readFileSync('public/sitemap.xml','utf8'),urls=[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
for(const route of ['/lab','/lab/image-studio','/lab/arcade',...activeArcadeGames.map(g=>'/lab/arcade/'+g.slug)])assert.equal(urls.filter(u=>u==='https://pdf-studio.in'+route).length,1,'canonical indexed route: '+route);
for(const slug of retiredArcadeSlugs)assert(!urls.includes('https://pdf-studio.in/lab/arcade/'+slug),'retired route removed from sitemap: '+slug);
const {imageTools}=await import(moduleURL(fs.readFileSync('lib/image-tools.ts','utf8')));
const imageModule=moduleURL('export const imageTools='+JSON.stringify(imageTools));
const {isAdvertisingPage}=await import(moduleURL(fs.readFileSync('lib/advertising.ts','utf8').replace("'./image-tools'",JSON.stringify(imageModule))));
assert(!isAdvertisingPage('/lab/arcade'));
for(const game of activeArcadeGames)assert(!isAdvertisingPage('/lab/arcade/'+game.slug));
assert(isAdvertisingPage('/blog'),'editorial ad eligibility remains unchanged');
const routeSource=fs.readFileSync('app/lab/arcade/[slug]/page.tsx','utf8');
assert(routeSource.includes('expansionGame(slug)'),'new games route into the actual playable component');
assert(routeSource.includes('activeArcadeGames.map'),'static path list follows active catalogue');
console.log('PASS: 100 unique active mini games, 18 retired routes excluded, Image Studio route, canonical sitemap and Arcade ad policy.');
