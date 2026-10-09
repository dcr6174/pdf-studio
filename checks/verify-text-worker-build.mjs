import assert from 'node:assert/strict';
import {readdir, readFile} from 'node:fs/promises';
import {join, basename} from 'node:path';

// Check the real vinext client build, rather than an isolated adapter.
async function files(directory) {
  const entries = await readdir(directory, {withFileTypes: true});
  return (await Promise.all(entries.map(entry => entry.isDirectory()
    ? files(join(directory, entry.name)) : join(directory, entry.name)))).flat();
}
const assets = await files('dist/client');
const workerAssets = assets.filter(path => /^text-edit\.worker-.*\.js$/.test(basename(path)));
assert(workerAssets.length, 'The text editor worker must be emitted to the client build');
let references = 0;
for (const path of assets.filter(path => path.endsWith('.js'))) {
  const source = await readFile(path, 'utf8');
  assert(!/file:\/\/[^"\s]*text-edit\.worker/.test(source), `${path}: worker URL must not use file://`);
  for (const match of source.matchAll(/"([^"\s]*text-edit\.worker-[^"\s]+\.js)"/g)) {
    references++;
    assert(match[1].startsWith('/') && !match[1].startsWith('//'), `Worker must use a same-origin public path: ${match[1]}`);
    assert(workerAssets.some(asset => basename(asset) === basename(match[1])), `Missing worker asset: ${match[1]}`);
  }
}
assert(references, 'The client bundle must reference the emitted text editor worker');
console.log('Text editor worker: same-origin URL and emitted client asset verified');
