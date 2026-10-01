import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {build} from 'vite';
import {renderToStaticMarkup} from 'react-dom/server';
import {createElement} from 'react';
await build({configFile:false,logLevel:'error',build:{ssr:'components/browser-link.tsx',outDir:'.browser-links-check',emptyOutDir:true,rollupOptions:{output:{entryFileNames:'link.mjs'}}}});
const {default:BrowserLink}=await import('../.browser-links-check/link.mjs');
for(const href of ['/','/privacy','/about','/tools/compress-pdf','#studio-content','/#shelf']){
 const html=renderToStaticMarkup(createElement(BrowserLink,{href,target:'_blank',rel:'noopener','aria-label':'Open'},'Open'));
 assert.ok(html.includes(`href="${href}"`));assert.ok(html.startsWith('<a '));assert.ok(html.includes('target="_blank"'));assert.ok(html.includes('rel="noopener"'));
}
let called=false;const handler=e=>{called=true;e.preventDefault();};const element=BrowserLink({href:'/',onClick:handler});let prevented=false;element.props.onClick({preventDefault:()=>{prevented=true;}});assert.ok(called&&prevented,'workspace handlers remain attached');
for(const path of ['app/page.tsx','app/tools/[slug]/page.tsx','app/about/page.tsx','app/privacy/page.tsx','components/site-header.tsx','app/analytics/page.tsx','app/analytics/dashboard.tsx']){const source=await readFile(resolve(path),'utf8');assert.ok(!source.includes("from 'next/link'"),'broken framework Link removed: '+path);assert.ok(source.includes("from '@/components/browser-link'"));}
console.log('PASS: native route/hash links, new-tab attributes, workspace event handlers and no failing framework Link imports. Live click verification requires deployment.');

const menu=await readFile('components/tools-menu.tsx','utf8');
const click=menu.match(/onClick=\{e=>setOpen\(v=>(.*?)\)\}/);assert.ok(click);
const update=new Function('e','pointerKind','v',`return (${click[1]});`);
assert.equal(update({detail:1},{current:'mouse'},true),true,'hover then click keeps menu open');
assert.equal(update({detail:1},{current:'mouse'},false),true);
assert.equal(update({detail:1},{current:'touch'},true),false);
assert.equal(update({detail:1},{current:'touch'},false),true);
assert.equal(update({detail:0},{current:'mouse'},true),false,'keyboard toggles');
console.log('PASS: mouse hover/click, touch toggle and keyboard menu policy.');

assert.ok((await readFile('app/page.tsx','utf8')).includes("if (id==='shelf'||tools.some(t => t.id === id))"),'My files hash works on full page load');
