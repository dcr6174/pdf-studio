import assert from 'node:assert/strict';
import {resolve} from 'node:path';
import {build} from 'vite';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const input={};for(const name of ['about','privacy','contact','check-it-yourself','tools'])input[name]='app/'+name+'/page.tsx';input.frame='components/site-frame.tsx';input.conversion='components/conversion-guide.tsx';input.conversions='lib/conversion-guides.ts';
await build({configFile:false,logLevel:'error',resolve:{alias:{'@':resolve('.')}},build:{ssr:true,outDir:'.chrome-check',emptyOutDir:true,rollupOptions:{input,output:{entryFileNames:'[name].mjs'}}}});
function verify(html,name){
 assert.equal((html.match(/class="studio-header studio-shared"/g)||[]).length,1,name+' one shared header');
 assert.equal((html.match(/class="site-footer pdf-site-footer"/g)||[]).length,1,name+' one shared footer');
 assert(html.includes('class="site-frame"'),name+' full-width frame');
 assert(html.includes('class="studio-brand-row '),name+' brand and theme share a row');
 const company=html.split('<h2>Company</h2>')[1].split('</div>')[0];
 assert(company.indexOf('Contact')<company.indexOf('Donate'),name+' donate last under Company');
 assert(company.includes('lucide-heart'),name+' heart icon');
 assert(html.includes('Privacy settings')&&html.includes('Report issue'),name+' shared footer actions');
}
for(const name of ['about','privacy','contact','check-it-yourself','tools']){const {default:Page}=await import('../.chrome-check/'+name+'.mjs');verify(renderToStaticMarkup(createElement(Page)),name);}
const {SiteFrame}=await import('../.chrome-check/frame.mjs');verify(renderToStaticMarkup(createElement(SiteFrame,null,createElement('main',null,'Owner content'))),'owner frame');
const {ConversionGuide}=await import('../.chrome-check/conversion.mjs'),{conversionGuides}=await import('../.chrome-check/conversions.mjs');for(const guide of conversionGuides)verify(renderToStaticMarkup(createElement(ConversionGuide,{guide})),guide.slug);
console.log('PASS: info pages, tools directory, owner frame and every conversion guide have one full-width shared header/footer, shared footer actions and Donate with a heart last under Company.');
