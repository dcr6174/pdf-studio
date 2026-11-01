import assert from 'node:assert/strict';
import fs from 'node:fs';
import {build} from 'vite';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
const sources={"game": "components/club-game.tsx", "catalog": "lib/club-catalog.ts", "emblem": "components/game-emblem.tsx", "arcade": "lib/arcade-catalog.ts", "puzzle": "lib/puzzle-catalog.ts"};
await build({configFile:false,logLevel:"error",resolve:{alias:{"@":process.cwd()}},build:{ssr:true,outDir:".club-ui-check",emptyOutDir:true,rollupOptions:{input:Object.fromEntries(Object.entries(sources).map(([key,path])=>[key,resolve(path)])),output:{entryFileNames:"[name].mjs"},external:["react","react-dom","react-dom/server"]}}});
const load=name=>import(pathToFileURL(resolve(".club-ui-check/"+name+".mjs")).href);
const {ClubGame}=await load("game"),{clubGames}=await load("catalog"),{GameEmblem}=await load("emblem");
for(const game of clubGames){const html=renderToStaticMarkup(createElement(ClubGame,{slug:game.slug}));assert(html.includes('<h1>'+game.name.replaceAll('&','&amp;')+'</h1>'));assert(html.includes('How to play'));assert(html.includes('Restart'));assert(html.includes('Buddy’s Garden'));assert(html.includes('Loading…'));assert(html.includes('club-curtain'));assert(!html.includes('adsbygoogle'));assert(!html.includes('<iframe'));}
const {arcadeGames}=await load("arcade"),{puzzleGames}=await load("puzzle"),all=[...arcadeGames,...puzzleGames,...clubGames];assert.equal(all.length,60);const marks=new Set();for(const g of all){const html=renderToStaticMarkup(createElement(GameEmblem,{slug:g.slug}));const shape=html.replace(/<defs>.*?<\/defs>/,'').replace(/url\(#[^)]+\)/g,'url(#id)');assert(!marks.has(shape),'individually drawn mark: '+g.slug);marks.add(shape);}assert.equal(marks.size,60);
const {default:postcss}=await import('postcss');const css=postcss.parse(fs.readFileSync('app/lab/arcade/club.css','utf8'));css.walkRules(rule=>assert(rule.selectors.every(s=>s.startsWith('.arcade-shell ')),'all new styles scoped to Arcade'));
console.log('PASS: all 23 new game screens render with instructions and safe start controls; all 60 original SVG emblems differ; CSS stays scoped to Arcade. Not a browser/touch playtest.');

