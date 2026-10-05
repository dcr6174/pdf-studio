import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import ts from 'typescript';
const source=ts.transpileModule(await readFile('lib/reader-render-queue.ts','utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText;
const {acquireReaderRender}=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
const a=await acquireReaderRender(new AbortController().signal),b=await acquireReaderRender(new AbortController().signal);let started=false;const wait=acquireReaderRender(new AbortController().signal).then(release=>{started=true;return release;});await Promise.resolve();assert.equal(started,false);a();const c=await wait;assert.equal(started,true);const controller=new AbortController();const cancelled=acquireReaderRender(controller.signal);controller.abort();await assert.rejects(()=>cancelled);b();c();c();const again=await acquireReaderRender(new AbortController().signal);again();console.log('PASS: two-render concurrency bound, queue progress, cancelled wait removal and idempotent release.');
