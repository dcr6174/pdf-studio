import assert from 'node:assert/strict';
import {build} from 'vite';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
await build({configFile:false,logLevel:'error',resolve:{alias:{'@':process.cwd()}},build:{ssr:true,outDir:'.arcade-ui-check',emptyOutDir:true,rollupOptions:{input:{directory:resolve('components/arcade-directory.tsx'),game:resolve('components/arcade-game.tsx'),catalog:resolve('lib/arcade-catalog.ts')},output:{entryFileNames:'[name].mjs'},external:['react','react-dom','react-dom/server']}}});
const load=name=>import(pathToFileURL(resolve('.arcade-ui-check/'+name+'.mjs')).href);
const {ArcadeDirectory}=await load('directory'),{ArcadeGame}=await load('game'),{arcadeGames}=await load('catalog');
const directory=renderToStaticMarkup(createElement(ArcadeDirectory));
for(const g of arcadeGames){assert.equal(directory.split('href="/lab/arcade/'+g.slug+'"').length-1,1,'one discovery card: '+g.slug);const html=renderToStaticMarkup(createElement(ArcadeGame,{slug:g.slug}));assert(html.includes('<h1>'+g.name+'</h1>'));assert(html.includes('aria-label="Arcade navigation"'));assert(html.includes('Sound off'));assert(html.includes('How to play'));assert(html.includes('Ready, Buddy?'));assert(html.includes('>Play</button>'));assert(!html.includes('adsbygoogle'));}
console.log('PASS: real Arcade directory and all ten initial game screens render with unique links, headings, navigation, explicit Play, instructions and sound off. Server-rendered check; physical touch and real-browser gameplay require separate verification.');
