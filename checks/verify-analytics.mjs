import fs from 'node:fs';
import ts from 'typescript';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
const tmp=[];const stamp=Date.now();
function compile(name,replace={}){let src=fs.readFileSync(new URL(`../lib/${name}.ts`,import.meta.url),'utf8');for(const [a,b] of Object.entries(replace))src=src.replaceAll(a,b);const target=new URL(`../lib/.verify-analytics-${name}.mjs`,import.meta.url);tmp.push(target);fs.writeFileSync(target,ts.transpileModule(src,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText);return target;}
try{
compile('tools');compile('analytics-contract',{"'./tools'":"'./.verify-analytics-tools.mjs'"});const modulePath=compile('analytics-server',{"'./analytics-contract'":"'./.verify-analytics-analytics-contract.mjs'"});const {getAnalytics,recordActivity,readActivityRequest,isOwner}=await import(modulePath.href+'?'+stamp);const {parseActivity}=await import(new URL('../lib/.verify-analytics-analytics-contract.mjs',import.meta.url));
const sql=new DatabaseSync(':memory:');for(const migration of fs.readdirSync(new URL('../drizzle',import.meta.url)).filter(n=>n.endsWith('.sql')).sort())sql.exec(fs.readFileSync(new URL('../drizzle/'+migration,import.meta.url),'utf8'));
const db={prepare(query){let values=[];return {bind(...args){values=args;return this;},async first(){return sql.prepare(query).get(...values)??null;},_execute(){const s=sql.prepare(query);return /^\s*SELECT/i.test(query)?{results:s.all(...values),success:true}:{results:[],success:true,meta:s.run(...values)};}};},async batch(statements){sql.exec('BEGIN');try{const result=statements.map(s=>s._execute());sql.exec('COMMIT');return result;}catch(e){sql.exec('ROLLBACK');throw e;}}};
const now=Date.parse('2026-09-30T04:30:00Z'),hour=3_600_000,day=24*hour;const v1=crypto.randomUUID(),v2=crypto.randomUUID(),v3=crypto.randomUUID(),v4=crypto.randomUUID(),v5=crypto.randomUUID();const event=(kind='process_success',toolId='merge')=>({id:crypto.randomUUID(),kind,toolId});const batch=(v,events=[],visible=true,toolId='merge')=>({visitorId:v,events,visible,toolId});
let metrics=await getAnalytics(db,now);assert.equal(metrics.liveOnline,0);assert.equal(metrics.last24Hours.completed,0);
await recordActivity(db,batch(v5,[event()]),now-49*hour);
await recordActivity(db,batch(v4,[event()]),now-25*hour);
await recordActivity(db,batch(v2,[event()]),now-23*hour);
await recordActivity(db,batch(v3,[event('process_error','split')]),now-90_001);
const completion=event();const payload=batch(v1,[completion,event('download')]);await recordActivity(db,payload,now-10_000);await recordActivity(db,payload,now-5_000);
metrics=await getAnalytics(db,now);assert.equal(metrics.liveOnline,1);assert.equal(metrics.lastHour.visitors,2);assert.equal(metrics.last24Hours.visitors,3);assert.equal(metrics.last24Hours.completed,2);assert.equal(metrics.lastHour.completed,1);assert.equal(metrics.last24Hours.failed,1);assert.equal(metrics.last24Hours.downloads,1);assert.equal(metrics.tools.find(t=>t.toolId==='merge').uniqueVisitors,2);
assert.equal(sql.prepare('SELECT COUNT(*) AS n FROM analytics_events WHERE visitor_id=?').get(v5).n,0);
await recordActivity(db,batch(v1,[],true,'sign'),now);metrics=await getAnalytics(db,now);assert.equal(metrics.liveOnline,1);assert.equal(metrics.liveTools[0].toolId,'sign');assert.equal(metrics.last24Hours.completed,2);
metrics=await getAnalytics(db,now+90_001);assert.equal(metrics.liveOnline,0);assert.equal(metrics.lastHour.visitors,2);
const request=(payload,origin='https://studio.test')=>new Request('https://studio.test/api/analytics/collect',{method:'POST',headers:{'content-type':'application/json',origin},body:JSON.stringify(payload)});
assert.equal((await readActivityRequest(request(payload))).visitorId,v1);
await assert.rejects(()=>readActivityRequest(request({...payload,filename:'private.pdf'})),e=>e.status===400);
await assert.rejects(()=>readActivityRequest(request(payload,'https://attacker.test')),e=>e.status===403);
assert.throws(()=>parseActivity({...payload,events:[{...completion,toolId:'unknown-tool'}]}));
await assert.rejects(()=>readActivityRequest(request({...payload,events:Array(21).fill(completion)})),e=>e.status===400);
await assert.rejects(()=>readActivityRequest(new Request('https://studio.test/api/analytics/collect',{method:'POST',headers:{origin:'https://studio.test','content-type':'application/json'},body:' '.repeat(9000)})),e=>e.status===413);
const owner=new Headers({'oai-authenticated-user-id':'trusted-id','oai-authenticated-user-email':'owner@example.com'});assert.equal(isOwner(owner,'owner@example.com'),true);assert.equal(isOwner(owner,'someone@example.com'),false);assert.equal(isOwner(new Headers({'oai-authenticated-user-email':'owner@example.com'}),'owner@example.com'),false);assert.equal(isOwner(owner,undefined),false);
const rateVisitor=crypto.randomUUID();for(let i=0;i<120;i++)await recordActivity(db,batch(rateVisitor,[]),now);await assert.rejects(()=>recordActivity(db,batch(rateVisitor,[]),now),e=>e.status===429);
const plans=sql.prepare('EXPLAIN QUERY PLAN SELECT * FROM analytics_events WHERE received_at >= ?').all(now-day);assert.ok(plans.some(p=>p.detail.includes('analytics_events_time_kind_idx')));
console.log('PASS: analytics checks cover empty-state counts, rolling windows, 90-second expiry, duplicate retries, cross-tab visitor deduplication, latest visible tool, event totals, 48-hour retention, payload validation, same-origin protection, body limits, owner-only access and rate limiting.');sql.close();
}finally{for(const file of tmp)fs.unlinkSync(file);}
