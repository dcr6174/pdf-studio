import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

// These are the project's existing public sources. A new source requires review.
const publicSources=new Set(['registry.npmjs.org','cdn.sheetjs.com']);
function verifyDownload(value,name){
 const url=new URL(value);
 assert.equal(url.protocol,'https:','Dependency downloads require HTTPS: '+name);
 assert(publicSources.has(url.hostname),'Non-portable or unreviewed dependency source: '+name+' ('+url.hostname+')');
 assert.equal(url.username+url.password,'','Credentials must never be committed in dependency URLs');
}
const lock=JSON.parse(await readFile(new URL('../package-lock.json',import.meta.url),'utf8'));
let checked=0;
for(const [name,pkg] of Object.entries(lock.packages)){
 if(!pkg.resolved)continue;
 verifyDownload(pkg.resolved,name);checked++;
 assert(pkg.integrity,'Retain the integrity checksum for '+name);
}
// Regression cases do not require network access or installed dependencies.
for(const url of ['http://registry.npmjs.org/a.tgz','https://localhost/a.tgz','https://package-firewall.replit.internal/npm/a.tgz','https://user:password@registry.npmjs.org/a.tgz']){
 assert.throws(()=>verifyDownload(url,'regression fixture'));
}
const manifest=JSON.parse(await readFile(new URL('../package.json',import.meta.url),'utf8'));
assert.match(manifest.packageManager,/^npm@\d+\.\d+\.\d+$/,'Pin an exact npm version for Cloudflare automatic dependency installation');
console.log(`PASS: ${checked} public HTTPS dependency downloads, preserved integrity checksums, no internal registry addresses, exact npm version pinned.`);
