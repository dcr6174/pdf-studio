import assert from 'node:assert/strict';
import fs from 'node:fs';
const shortcuts=[['app/arcade/page.tsx','/arcade'],['app/games/page.tsx','/games']];
for(const [page,route] of shortcuts){
  assert(fs.existsSync(page),'shortcut page exists: '+route);
  const src=fs.readFileSync(page,'utf8');
  assert(src.includes("from 'next/navigation'"),route+' uses the Next redirect helper');
  assert(src.includes("permanentRedirect('/lab/arcade')"),route+' permanently redirects to the arcade directory');
}
assert(fs.existsSync('app/lab/arcade/page.tsx'),'arcade directory page still exists');
console.log('PASS: /arcade and /games shortcuts permanently redirect to /lab/arcade.');
