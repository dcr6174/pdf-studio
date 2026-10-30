import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { imageSize } from 'image-size';
import PptxGenJS from 'pptxgenjs';
import JSZip from 'jszip';
import { chunk, sortBy, merge, escape, template, unset, omit } from 'lodash-es';
import {
  invocationSchema, driverMessageSchema, grantsSchema, sessionOptionsSchema,
} from '../scripts/connector-preview/protocol.mjs';

// These records used Zod 3's one-argument record API. Check both the valid
// Guard the lodash-es bad-release replacement and safe object-path handling.
assert.deepEqual(chunk([1, 2, 3], 2), [[1, 2], [3]]);
assert.deepEqual(sortBy([{ n: 2 }, { n: 1 }], 'n'), [{ n: 1 }, { n: 2 }]);
assert.deepEqual(merge({}, { a: { b: 1 } }), { a: { b: 1 } });
assert.equal(escape('<script>'), '&lt;script&gt;');
assert.equal(template('Hello <%= name %>')({ name: 'Studio' }), 'Hello Studio');
assert.throws(() => template('test', { imports: { 'x){};throw new Error("unsafe");//': 1 } }));
const inherited = { kept: true };
const object = Object.create(inherited);
unset(object, ['__proto__', 'kept']);
assert.equal(inherited.kept, true);
omit(object, [['__proto__', 'kept']]);
assert.equal(inherited.kept, true);

// envelope and strict rejection behavior after moving to the patched Zod 4.
const fields = { connectorId: 'documents', actionName: 'read' };
const args = { file: 'example.pdf', pages: [1, 2], nested: { enabled: true } };
assert.deepEqual(invocationSchema.parse({ ...fields, arguments: args }).arguments, args);
assert.equal(invocationSchema.safeParse({ ...fields, arguments: args, accountId: 'unexpected' }).success, false);
assert.equal(invocationSchema.safeParse({ ...fields, arguments: [] }).success, false);
assert.equal(grantsSchema.safeParse([{ ...fields, readOnly: false }]).success, false);
assert.deepEqual(grantsSchema.parse([{ ...fields, readOnly: true }]), [{ ...fields, readOnly: true }]);
assert.equal(sessionOptionsSchema.parse({}).timeoutMs, 120000);
assert.equal(sessionOptionsSchema.safeParse({ maxConcurrent: 0 }).success, false);
const result = { content: [{ type: 'text', text: 'ok' }] };
assert.deepEqual(driverMessageSchema.parse({
  jsonrpc: '2.0', id: 'b1f36d65-3f16-4c57-b9c7-e76d61f415aa', result,
}).result, result);
assert.equal(driverMessageSchema.safeParse({ jsonrpc: '2.0', id: 'invalid', result }).success, false);

// Excalidraw pins Nano ID releases. Both consumers use the same named ESM API;
// exercise their actual resolved versions, not an unrelated top-level copy.
for (const parent of ['@excalidraw/excalidraw', '@excalidraw/mermaid-to-excalidraw']) {
  const requireFromParent = createRequire(createRequire(import.meta.url).resolve(parent));
  const { nanoid } = await import(pathToFileURL(requireFromParent.resolve('nanoid')).href);
  const ids = new Set(Array.from({ length: 100 }, () => nanoid()));
  assert.equal(ids.size, 100);
  for (const id of ids) assert.match(id, /^[\w-]{21}$/);
  assert.equal(nanoid(12).length, 12);
}

// image-size 2 drops path-string input and the callable CommonJS default.
// PptxGenJS 4.0.1 ships image-size as an unused dependency. Guard that assumption
// explicitly; do not carry this cross-major override onto a future consumer
// that starts invoking the old API.
const require = createRequire(import.meta.url);
const pptxSource = await readFile(require.resolve('pptxgenjs'), 'utf8');
assert.doesNotMatch(pptxSource, /(?:require\s*\(\s*|from\s*)['"]image-size['"]/);
const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aX1kAAAAASUVORK5CYII=', 'base64');
assert.deepEqual(imageSize(png), { height: 1, width: 1, type: 'png' });
const deck = new PptxGenJS();
const slide = deck.addSlide();
slide.addText('Dependency compatibility', { x: 1, y: 1, w: 5, h: 1 });
slide.addImage({ data: `image/png;base64,${png.toString('base64')}`, x: 1, y: 2, w: 1, h: 1 });
const zip = await JSZip.loadAsync(await deck.write({ outputType: 'nodebuffer' }));
assert(zip.file('ppt/slides/slide1.xml'));
assert(Object.keys(zip.files).some(path => path.startsWith('ppt/media/') && path.endsWith('.png')));
console.log('PASS: Zod connector envelopes, both Nano ID consumers, image dimensions and PowerPoint text/image export.');
