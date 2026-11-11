import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import ts from 'typescript';
import vm from 'node:vm';
const exports={};vm.runInNewContext(ts.transpile(readFileSync('lib/accent-theme.ts','utf8'),{module:ts.ModuleKind.CommonJS}),{exports});
const {accentThemes,accentLuminance,accessibleAccent}=exports;
assert.equal(accentThemes.length,10);for(const t of accentThemes)assert.equal(t.name.split(' ').length,2);
for(const raw of [...accentThemes.map(t=>t.color),'#ffffff','#000000','#ffff00','#00ffff','#ff00ff'])for(const dark of [false,true]){
 const selected=accessibleAccent(raw,dark),lum=accentLuminance(selected),bg=dark?.025:.98,contrast=(Math.max(bg,lum)+.05)/(Math.min(bg,lum)+.05),text=lum>.179?0:1,button=(Math.max(text,lum)+.05)/(Math.min(text,lum)+.05);
 assert.ok(contrast>=4.5,raw+' accent readability');assert.ok(button>=4.5,raw+' button readability');
}
console.log('PASS: ten two-word themes and custom color extremes meet 4.5:1 accent/background and button-text contrast in light/dark. Browser keyboard and animation need separate checks.');
