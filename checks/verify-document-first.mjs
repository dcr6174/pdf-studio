import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {build} from 'vite';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
async function bundle(entry,name){await build({configFile:false,logLevel:'error',resolve:{alias:{'@':resolve('.')}},build:{ssr:entry,outDir:'.document-'+name+'-check',emptyOutDir:true,rollupOptions:{output:{entryFileNames:'entry.mjs'}}}});return import('../.document-'+name+'-check/entry.mjs');}
const {ToolsDirectory}=await bundle('components/tools-directory.tsx','tools');
const html=renderToStaticMarkup(createElement(ToolsDirectory));
const destinations=[...html.matchAll(/href="(\/tools\/[^\"]+)"/g)].map(m=>m[1]);assert.equal(destinations.length,57);assert.equal(new Set(destinations).size,57);assert.ok(html.includes('type="search"'));for(const group of ['Pages','Edit &amp; sign','Convert','Privacy'])assert.ok(html.includes('<h2>'+group+'</h2>'));
const {SignaturePicker}=await bundle('components/signature-picker.tsx','sign');
const sign=renderToStaticMarkup(createElement(SignaturePicker,{onSave:()=>{}}));assert.equal((sign.match(/role="tab"/g)||[]).length,4);assert.equal((sign.match(/aria-selected="true"/g)||[]).length,1);assert.ok(sign.includes('signature-tab-camera'));assert.ok(sign.includes('capture="environment"'));assert.ok(sign.includes('signature-panel-draw'));assert.ok(sign.includes('hidden="" role="tabpanel" id="signature-panel-draw"'));
const css=await readFile('app/studio-brand.css','utf8');
const lum=hex=>{if(hex.length===4)hex='#'+[...hex.slice(1)].map(c=>c+c).join('');return [0.2126,0.7152,0.0722].reduce((sum,w,i)=>{const v=parseInt(hex.slice(i*2+1,i*2+3),16)/255;return sum+w*(v<=.04045?v/12.92:((v+.055)/1.055)**2.4);},0);};
function palette(selector){const values={};for(const line of css.split('\n'))if(line.startsWith(selector+'{')){const block=line.slice(line.indexOf('{')+1,line.indexOf('}'));for(const [,name,value]of block.matchAll(/--([\w-]+):(#[0-9a-fA-F]+)/g))values[name]=value;}return values;}
for(const selector of [':root','[data-theme=dark]']){const p=palette(selector);for(const [text,bg]of [['foreground','card'],['error-text','error-bg'],['success-text','success-bg']]){const ratio=(Math.max(lum(p[text]),lum(p[bg]))+.05)/(Math.min(lum(p[text]),lum(p[bg]))+.05);assert.ok(ratio>=4.5,`${selector} ${text} ${ratio}`);console.log(`${selector} ${text}: ${ratio.toFixed(2)}:1`);}}
console.log('PASS: 57 unique directory destinations, categorized searchable SSR content, four accessible signature tabs and light/dark text/error/success palette contrast. Real browser/touch/keyboard integration is not simulated.');
