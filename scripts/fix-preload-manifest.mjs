import {readFileSync,writeFileSync,existsSync} from 'node:fs';
// Rolldown can elide the JS stub of a CSS-only import after the RSC preload
// manifest is collected. Keep its stylesheet, but do not preload a nonexistent JS file.
const file='dist/server/__vite_rsc_assets_manifest.js';
const prefix='export default ';
const source=readFileSync(file,'utf8');
const manifest=JSON.parse(source.slice(prefix.length).trim().replace(/;$/,''));
const client=JSON.parse(readFileSync('dist/client/.vite/manifest.json','utf8'));
const cssOnly=new Set(Object.values(client).filter(e=>e.file?.endsWith('.css')).map(e=>e.file.split('/').pop().split('.')[0]));
let removed=0;
for(const entry of Object.values(manifest.clientReferenceDeps)){
 entry.js=entry.js.filter(path=>{
  if(existsSync('dist/client'+path))return true;
  const stem=/\/([^/]+)-[^/]+\.js$/.exec(path)?.[1];
  if(!stem||!cssOnly.has(stem))throw new Error('Missing executable preload: '+path);
  removed++;return false;
 });
}
writeFileSync(file,prefix+JSON.stringify(manifest,null,2)+';\n');
console.log('Removed '+removed+' elided CSS-only JS preload references; all executable preloads exist.');
