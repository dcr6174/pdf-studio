import fs from 'node:fs';
import ts from 'typescript';
import assert from 'node:assert/strict';
const temporary=new URL('../lib/.verify-analytics-client.mjs',import.meta.url),toolModule=new URL('../lib/.verify-analytics-tools.mjs',import.meta.url);
const compile=s=>ts.transpileModule(s,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;
class MemoryStorage{map=new Map();getItem(k){return this.map.get(k)??null;}setItem(k,v){this.map.set(k,String(v));}}
const original={navigator:Object.getOwnPropertyDescriptor(globalThis,'navigator'),fetch:globalThis.fetch,setTimeout:globalThis.setTimeout,clearTimeout:globalThis.clearTimeout,setInterval:globalThis.setInterval,clearInterval:globalThis.clearInterval};
let interval,requests=[],rejectOnce=true;
try{
fs.writeFileSync(toolModule,compile(fs.readFileSync(new URL('../lib/tools.ts',import.meta.url),'utf8')));fs.writeFileSync(temporary,compile(fs.readFileSync(new URL('../lib/activity-client.ts',import.meta.url),'utf8').replace("'./tools'","'./.verify-analytics-tools.mjs'"))+'\nexport {start,flush};');
Object.defineProperty(globalThis,'navigator',{configurable:true,value:{onLine:true,doNotTrack:'0',sendBeacon:()=>true}});globalThis.document=new EventTarget();document.visibilityState='visible';globalThis.window=new EventTarget();globalThis.localStorage=new MemoryStorage();globalThis.sessionStorage=new MemoryStorage();globalThis.setTimeout=()=>1;globalThis.clearTimeout=()=>{};globalThis.setInterval=fn=>{interval=fn;return 1;};globalThis.clearInterval=()=>{};
globalThis.fetch=async(url,options)=>{assert.equal(url,'/api/analytics/collect');const payload=JSON.parse(options.body);requests.push(payload);if(rejectOnce){rejectOnce=false;return new Response('{}',{status:503});}return Response.json({accepted:payload.events.map(e=>e.id)});};
const {start,flush,trackActivity}=await import(temporary.href+'?'+Date.now());let stop=start();trackActivity('process_success','merge');await flush();await flush();assert.equal(requests.length,2);assert.deepEqual(requests[0].events,requests[1].events);assert.equal(requests[1].events.length,2);assert.deepEqual(Object.keys(requests[1]).sort(),['events','toolId','visible','visitorId']);assert.deepEqual(Object.keys(requests[1].events[1]).sort(),['id','kind','toolId']);assert.equal(JSON.parse(sessionStorage.getItem('openpdf-analytics-queue')).length,0);
const firstVisitor=requests[0].visitorId;document.visibilityState='hidden';const before=requests.length;interval();await Promise.resolve();assert.equal(requests.length,before);document.visibilityState='visible';interval();await new Promise(resolve=>original.setTimeout(resolve,0));assert.equal(requests.at(-1).visible,true);assert.equal(requests.at(-1).events.length,0);stop();
stop=start();await flush();assert.equal(requests.at(-1).visitorId,firstVisitor);stop();localStorage.setItem('openpdf-analytics-disabled','1');const disabledCount=requests.length;stop=start();trackActivity('process_success','merge');await flush();assert.equal(requests.length,disabledCount);stop();localStorage.setItem('openpdf-analytics-disabled','0');navigator.doNotTrack='1';stop=start();await flush();assert.equal(requests.length,disabledCount);stop();
console.log('PASS: tracker retains event IDs on retry, clears acknowledged events, sends no document data, deduplicates browser identity, pauses hidden-tab heartbeats, and respects opt-out and Do Not Track.');
}finally{
fs.unlinkSync(temporary);fs.unlinkSync(toolModule);Object.defineProperty(globalThis,'navigator',original.navigator);for(const key of ['fetch','setTimeout','clearTimeout','setInterval','clearInterval'])globalThis[key]=original[key];for(const key of ['document','window','localStorage','sessionStorage'])delete globalThis[key];
}
