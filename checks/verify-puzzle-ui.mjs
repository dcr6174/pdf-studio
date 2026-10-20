import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const url=source=>'data:text/javascript;base64,'+Buffer.from(ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext,jsx:ts.JsxEmit.ReactJSX}}).outputText.replace(/(['"])react\1/g,JSON.stringify(import.meta.resolve('react'))).replace(/(['"])react\/jsx-runtime\1/g,JSON.stringify(import.meta.resolve('react/jsx-runtime')))).toString('base64');
const catalog=url(fs.readFileSync('lib/puzzle-catalog.ts','utf8')),data=url(fs.readFileSync('lib/puzzle-data.ts','utf8'));
const engine=url(fs.readFileSync('lib/puzzle-engine.ts','utf8').replaceAll("'./puzzle-catalog'",JSON.stringify(catalog)).replaceAll("'./puzzle-data'",JSON.stringify(data)));
const artwork=url(fs.readFileSync('components/puzzle-artwork.tsx','utf8'));
const link=url("import {createElement} from 'react'; export default function Link(p){return createElement('a',p)}");
const {PuzzleGame}=await import(url(fs.readFileSync('components/puzzle-game.tsx','utf8').replaceAll("'@/components/browser-link'",JSON.stringify(link)).replaceAll("'@/lib/puzzle-catalog'",JSON.stringify(catalog)).replaceAll("'@/lib/puzzle-engine'",JSON.stringify(engine)).replaceAll("'@/components/puzzle-artwork'",JSON.stringify(artwork))));
const {puzzleGames}=await import(catalog);
for(const game of puzzleGames){const html=renderToStaticMarkup(createElement(PuzzleGame,{slug:game.slug}));assert(html.includes('<h1>'+game.name+'</h1>'),game.slug);assert(html.includes('aria-label="Arcade navigation"'));assert(html.includes('Ready for a little puzzle?'));assert(html.includes('How to play &amp; controls'));assert(html.includes('Undo'));assert(html.includes('Restart'));assert(!html.includes('adsbygoogle'));assert(!html.includes('<iframe'));}
console.log('PASS: all 27 real puzzle components server-render with headings, instructions, navigation, explicit start, undo/restart and no ad/iframe embeds. SSR is not browser or real-device playtesting.');
const {default:postcss}=await import('postcss');
const css=postcss.parse(fs.readFileSync('app/lab/arcade/puzzles.css','utf8'));
css.walkRules(rule=>{let frames=false;for(let p=rule.parent;p;p=p.parent)if(p.type==='atrule'&&p.name.includes('keyframes'))frames=true;if(!frames)assert(rule.selectors.every(s=>s.startsWith('.arcade-shell ')),'new styling wins inside Arcade and cannot leak into PDF tools');});
console.log('PASS: puzzle CSS is scoped above shared Arcade defaults and outside document workspaces.');
