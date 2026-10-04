import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=path=>fs.readFileSync(new URL('../'+path,import.meta.url),'utf8');
const css=read('app/studio-brand.css');
const luminance=hex=>{const full=hex.length===4?'#'+[...hex.slice(1)].map(c=>c+c).join(''):hex;return [0.2126,0.7152,0.0722].reduce((sum,w,i)=>{const c=parseInt(full.slice(1+i*2,3+i*2),16)/255;return sum+w*(c<=0.04045?c/12.92:((c+0.055)/1.055)**2.4);},0);};
const ratio=(a,b)=>(Math.max(luminance(a),luminance(b))+0.05)/(Math.min(luminance(a),luminance(b))+0.05);
for(const selector of [':root','[data-theme=dark]']){
 const block=css.slice(css.indexOf(selector+'{')).split('}')[0];
 const color=name=>block.match(new RegExp('--'+name+':(#[a-fA-F0-9]+)'))[1];
 for(const background of ['card','soft'])assert.ok(ratio(color('foreground'),color(background))>=4.5,`${selector}: ${background}`);
 console.log(`${selector}: category text/count contrast ${ratio(color('foreground'),color('card')).toFixed(2)}:1; hover ${ratio(color('foreground'),color('soft')).toFixed(2)}:1; selected uses inverse colours.`);
}
assert.ok(css.includes('.home-toolbox .filters .count{font-size:.78rem;opacity:1;color:inherit}'));
for(const file of ['app/page.tsx','components/site-header.tsx'])assert.ok(read(file).includes('src="/brand/pdf-studio-logo-v5.svg" alt="" width="22" height="22" loading="lazy"'));
const svg=read('public/brand/pdf-studio-logo-v5.svg');assert.ok(!/<image|href=/i.test(svg));assert.ok(Buffer.byteLength(svg)<3000);
console.log('PASS: category contrast and small vector footer logo. These are source checks, not a new Lighthouse measurement.');
