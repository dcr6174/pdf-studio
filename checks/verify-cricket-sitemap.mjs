/** Exercise the actual asset generator: a cricket layout change must update only
 * cricket's fingerprint/lastmod, while a rebuild alone preserves its date. */
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
const paths=['components/cricket-screen.css','scripts/site-assets-state.json','public/sitemap.xml'];
const originals=paths.map(p=>readFileSync(p));
const generate=()=>execFileSync(process.execPath,['scripts/generate-site-assets.mjs'],{stdio:'pipe'});
const state=()=>JSON.parse(readFileSync(paths[1],'utf8'));
const cricket='/lab/arcade/boundary-cricket';
try{
 generate();const baseline=state();baseline[cricket].lastmod='2000-01-01';writeFileSync(paths[1],JSON.stringify(baseline));
 generate();const unchanged=state();assert.equal(unchanged[cricket].lastmod,'2000-01-01','rebuild does not fake a new content date');
 writeFileSync(paths[0],originals[0].toString()+'\n/* synthetic layout revision for sitemap regression */\n');
 generate();const revised=state();assert.notEqual(revised[cricket].hash,unchanged[cricket].hash);assert.notEqual(revised[cricket].lastmod,'2000-01-01','cricket layout revision advances its content date');
 for(const [path,value] of Object.entries(unchanged))if(path!==cricket)assert.deepEqual(revised[path],value,'unrelated page unchanged: '+path);
 console.log('PASS: real generator tracks 3D cricket layout edits, preserves dates on rebuild, and leaves other page fingerprints/dates unchanged.');
}finally{paths.forEach((p,i)=>writeFileSync(p,originals[i]));}
