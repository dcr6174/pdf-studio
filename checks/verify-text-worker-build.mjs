import assert from 'node:assert/strict';
import {readdir, readFile} from 'node:fs/promises';
import {join, basename} from 'node:path';
import {runInNewContext} from 'node:vm';
import ts from 'typescript';

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
  const parsed = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
  function visit(node) {
    if (ts.isNewExpression(node) && node.expression.getText(parsed) === 'Worker') {
      const argument = node.arguments?.[0]?.getText(parsed);
      if (argument?.includes('text-edit.worker-')) {
        references++;
        // Evaluate the actual emitted URL, including any rewritten import.meta base.
        const browserModule = 'https://pdf-studio.in/_next/static/chunks/editor.js';
        const expression = argument.replaceAll('import.meta.url', JSON.stringify(browserModule));
        const value = runInNewContext(expression, {URL}, {timeout: 1000});
        const url = new URL(String(value), browserModule);
        assert.equal(url.origin, 'https://pdf-studio.in', `${path}: worker must load from the page origin, not file://`);
        assert(workerAssets.some(asset => basename(asset) === basename(url.pathname)), `Missing worker asset: ${url.pathname}`);
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(parsed);
}
assert(references, 'The client bundle must reference the emitted text editor worker');
console.log('Text editor worker: same-origin URL and emitted client asset verified');
