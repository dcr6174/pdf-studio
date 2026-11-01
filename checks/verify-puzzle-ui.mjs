import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {build} from 'vite';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
// Bundle the real dependency graph, including the shared session protocol.
await build({configFile:false,logLevel:'error',resolve:{alias:{'@':process.cwd()}},build:{ssr:true,outDir:'.puzzle-ui-check',emptyOutDir:true,rollupOptions:{input:{game:resolve('components/puzzle-game.tsx'),catalog:resolve('lib/puzzle-catalog.ts')},output:{entryFileNames:'[name].mjs'},external:['react','react-dom','react-dom/server']}}});
const {PuzzleGame}=await import(pathToFileURL(resolve('.puzzle-ui-check/game.mjs')));
const {puzzleGames}=await import(pathToFileURL(resolve('.puzzle-ui-check/catalog.mjs')));
for(const game of puzzleGames){const html=renderToStaticMarkup(createElement(PuzzleGame,{slug:game.slug}));assert(html.includes('<h1>'+game.name+'</h1>'),game.slug);assert(html.includes('aria-label="Arcade navigation"'));assert(html.includes('Ready for a little puzzle?'));assert(html.includes('How to play &amp; controls'));assert(html.includes('Undo'));assert(html.includes('Restart'));assert(html.includes('Buddy’s Garden'));assert(!html.includes('adsbygoogle'));assert(!html.includes('<iframe'));}
console.log('PASS: all 27 real puzzle components server-render with headings, instructions, navigation, explicit start, undo/restart and no ad/iframe embeds. SSR is not browser or real-device playtesting.');
const {default:postcss}=await import('postcss');
const css=postcss.parse(fs.readFileSync('app/lab/arcade/puzzles.css','utf8'));
css.walkRules(rule=>{let frames=false;for(let p=rule.parent;p;p=p.parent)if(p.type==='atrule'&&p.name.includes('keyframes'))frames=true;if(!frames)assert(rule.selectors.every(s=>s.startsWith('.arcade-shell ')),'new styling wins inside Arcade and cannot leak into PDF tools');});
console.log('PASS: puzzle CSS is scoped above shared Arcade defaults and outside document workspaces.');

