import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import ts from 'typescript';
import {canonicalSitemapEntries} from './canonical-sitemap.mjs';
import {createCanvas,loadImage,GlobalFonts} from '@napi-rs/canvas';
const root=new URL('../',import.meta.url);
const source=await readFile(new URL('lib/tools.ts',root),'utf8');
const asModule=text=>'data:text/javascript;base64,'+Buffer.from(ts.transpileModule(text,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText).toString('base64');
const toolsModule=asModule(source);
const canonicalModule=asModule(await readFile(new URL('lib/canonical-routes.ts',root),'utf8'));
const seoSource=await readFile(new URL('lib/seo-tools.ts',root),'utf8');
const {tools}=await import(toolsModule);
const {canonicalToolRoutes}=await import(canonicalModule);
const {toolGuidance}=await import(asModule(await readFile(new URL('lib/tool-guidance.ts',root),'utf8')));
const {seoPages}=await import(asModule(seoSource.replace("'./tools'",JSON.stringify(toolsModule)).replace("'./canonical-routes'",JSON.stringify(canonicalModule))));
const {conversionGuides}=await import(asModule(await readFile(new URL('lib/conversion-guides.ts',root),'utf8')));
const {searchGuidance}=await import(asModule(await readFile(new URL('lib/search-guidance.ts',root),'utf8')));
const {articles}=await import(asModule(await readFile(new URL('lib/articles.ts',root),'utf8')));
const {imageGuides}=await import(asModule(await readFile(new URL('lib/image-guides.ts',root),'utf8')));
const {imageTools}=await import(asModule(await readFile(new URL('lib/image-tools.ts',root),'utf8')));
const {comparisons}=await import(asModule(await readFile(new URL('lib/comparisons.ts',root),'utf8')));
GlobalFonts.registerFromPath(new URL('public/fonts/NotoSans-Regular.ttf',root).pathname,'Studio Sans');
const logo=await loadImage(new URL('public/brand/pdf-studio-logo-v5.png',root).pathname);
await mkdir(new URL('public/social/',root),{recursive:true});
const colors={'Pages':'#5B3DF5','Edit & sign':'#ac482c','Convert':'#116e60','Privacy':'#345caa'};
for(const page of [{slug:'home',title:'Free PDF tools',intro:'Edit, merge, compress and sign. No account needed.',group:'Pages'},...seoPages,...conversionGuides.map(g=>({...g,group:'Export guide'}))]){
 const canvas=createCanvas(1200,630),c=canvas.getContext('2d');
 c.fillStyle='#f7f8fc';c.fillRect(0,0,1200,630);c.fillStyle=colors[page.group]??'#5B3DF5';c.fillRect(0,0,18,630);
 c.drawImage(logo,68,62,72,72);c.fillStyle='#25243b';c.font='32px "Studio Sans"';c.fillText('PDF Studio',160,111);
 c.fillStyle=colors[page.group]??'#5B3DF5';c.font='24px "Studio Sans"';c.fillText(page.group+(page.group==='Export guide'?'':' · Free online'),72,202);
 c.fillStyle='#25243b';c.font='56px "Studio Sans"';
 const lines=[];let line='';for(const word of page.title.split(' ')){const next=line?line+' '+word:word;if(c.measureText(next).width>1040&&line){lines.push(line);line=word;}else line=next;}if(line)lines.push(line);
 lines.forEach((line,i)=>c.fillText(line,72,288+i*74));
 c.font='25px "Studio Sans"';c.fillStyle='#55596d';
 const intro=[];line='';for(const word of page.intro.split(' ')){const next=line?line+' '+word:word;if(c.measureText(next).width>1020&&line){intro.push(line);line=word;}else line=next;}if(line)intro.push(line);intro.slice(0,2).forEach((line,i)=>c.fillText(line,72,410+i*40));
 c.fillStyle='#5B3DF5';c.font='23px "Studio Sans"';c.fillText(page.group==='Export guide'?'Export instructions · Finish your PDF in the studio':'On-device documents · No added watermark',72,557);
 await writeFile(new URL('public/social/'+page.slug+'.png',root),canvas.toBuffer('image/png'));
}
// Persist content fingerprints: a rebuild alone never advances lastmod.
const stateURL=new URL('scripts/site-assets-state.json',root);let old={};try{old=JSON.parse(await readFile(stateURL,'utf8'));}catch{}
const state={},today=new Date().toISOString().slice(0,10),base='https://pdf-studio.in';
const shared=await Promise.all(['app/tools/[slug]/page.tsx'].map(path=>readFile(new URL(path,root),'utf8')));
const guidanceComponent=await readFile(new URL('components/conversion-guide.tsx',root),'utf8');
const pages=[...articles.map(a=>({path:'/blog/'+a.slug,content:JSON.stringify(a)})),{path:'/blog',content:(await readFile(new URL('app/blog/page.tsx',root),'utf8'))+(await readFile(new URL('app/blog/blog.css',root),'utf8'))},{path:'/',content:await readFile(new URL('app/page.tsx',root),'utf8')},{path:'/privacy',content:await readFile(new URL('app/privacy/page.tsx',root),'utf8')},...seoPages.map(page=>({path:'/tools/'+page.slug,content:JSON.stringify(page)+JSON.stringify(searchGuidance[page.slug]??toolGuidance[page.id])+JSON.stringify(tools.find(tool=>tool.id===page.id))+shared.join('')})),...conversionGuides.map(g=>({path:'/guides/'+g.slug,content:JSON.stringify(g)+shared.join('')+JSON.stringify(guidanceComponent)})),{path:'/tools',content:(await readFile(new URL('app/tools/page.tsx',root),'utf8'))+(await readFile(new URL('components/tools-directory.tsx',root),'utf8'))},{path:'/guides',content:(await readFile(new URL('app/guides/page.tsx',root),'utf8'))+JSON.stringify(seoPages.map(p=>[p.slug,p.title,p.intro]))+JSON.stringify(comparisons.map(c=>c.slug))},...comparisons.map(c=>({path:'/compare/'+c.slug,content:JSON.stringify(c)}))];
const toolGuideSource=await readFile(new URL('app/guides/[slug]/page.tsx',root),'utf8');
pages.push(...seoPages.map(page=>({path:'/guides/'+page.slug,content:JSON.stringify(page)+JSON.stringify(searchGuidance[page.slug]??toolGuidance[page.id])+toolGuideSource})));
pages.push(...['text-to-handwriting','notebook-maker','handwriting-practice'].map(slug=>({path:'/guides/'+slug,content:toolGuideSource})));
pages.push({path:'/lab/guides',content:(await readFile(new URL('app/lab/guides/page.tsx',root),'utf8'))+(await readFile(new URL('components/image-guide-directory.tsx',root),'utf8'))+JSON.stringify(imageGuides)});
pages.push(...imageGuides.map(g=>({path:'/lab/guides/'+g.slug,content:JSON.stringify(g)+JSON.stringify(imageTools.filter(t=>g.tools.includes(t.slug)))+''})));
const entries=pages.map(page=>{const hash=createHash('sha256').update(page.content).digest('hex');state[page.path]={hash,lastmod:old[page.path]?.hash===hash?old[page.path].lastmod:today};return {path:page.path,lastmod:state[page.path].lastmod};});
entries.push(...['/lab','/lab/image-size-reducer','/lab/remove-watermark','/lab/mini-zine-maker','/lab/photo-booth-strips','/lab/custom-bingo','/lab/giant-poster','/lab/photo-coloring-page','/lab/printable-flashcards','/lab/daily-mood-canvas','/lab/photo-strip','/lab/flashcards','/lab/decision-wheel','/lab/pomodoro','/lab/calculator','/lab/finance-calculator','/lab/practice-sheets','/lab/text-to-handwriting','/lab/notebook-maker','/lab/handwriting-practice','/lab/flipbook','/lab/word-cloud','/lab/page-palette','/lab/whiteboard','/lab/poster-collage','/lab/pdf-to-gif','/lab/sketch-pdf'].map(path=>({path})));
entries.push(...imageTools.filter(t=>t.slug!=='image-size-reducer').map(t=>({path:'/lab/'+t.slug})));
entries.push(...['/about','/contact','/check-it-yourself','/help','/terms','/faq'].map(path=>({path})));
const urls=canonicalSitemapEntries(entries,canonicalToolRoutes).map(({path,lastmod})=>`<url><loc>${base+path}</loc>${lastmod?`<lastmod>${lastmod}</lastmod>`:''}</url>`);
await writeFile(stateURL,JSON.stringify(state,null,2)+'\n');
await writeFile(new URL('public/sitemap.xml',root),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+urls.join('\n')+'\n</urlset>\n');
console.log(`Generated ${seoPages.length+conversionGuides.length+1} social images and ${urls.length} sitemap URLs with content-tracked lastmod.`);


