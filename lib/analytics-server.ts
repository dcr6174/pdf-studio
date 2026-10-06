import {parseActivity,LIVE_MS,HOUR_MS,DAY_MS,RETENTION_MS,type ActivityBatch,type MetricsWindow,type AnalyticsSummary} from './analytics-contract';
export class AnalyticsRejected extends Error{constructor(public status:number,message:string){super(message);}}
export function isOwner(headers:Headers,ownerEmail:unknown){const email=headers.get('oai-authenticated-user-email');return typeof ownerEmail==='string'&&ownerEmail.length>0&&!!headers.get('oai-authenticated-user-id')&&email?.toLowerCase()===ownerEmail.trim().toLowerCase();}
export async function readActivityRequest(request:Request):Promise<ActivityBatch>{
 const origin=request.headers.get('origin');if(origin!==new URL(request.url).origin)throw new AnalyticsRejected(403,'Same-origin requests only.');
 const site=request.headers.get('sec-fetch-site');if(site&&site!=='same-origin'&&site!=='none')throw new AnalyticsRejected(403,'Same-origin requests only.');
 if(!request.headers.get('content-type')?.toLowerCase().startsWith('application/json'))throw new AnalyticsRejected(415,'JSON is required.');
 const size=Number(request.headers.get('content-length')??0);if(size>8192)throw new AnalyticsRejected(413,'Batch is too large.');
 const reader=request.body?.getReader();if(!reader)throw new AnalyticsRejected(400,'A batch is required.');let total=0;const chunks:Uint8Array[]=[];
 try{while(true){const chunk=await reader.read();if(chunk.done)break;total+=chunk.value.byteLength;if(total>8192){await reader.cancel();throw new AnalyticsRejected(413,'Batch is too large.');}chunks.push(chunk.value);}}finally{reader.releaseLock();}
 const all=new Uint8Array(total);let cursor=0;for(const c of chunks){all.set(c,cursor);cursor+=c.length;}try{return parseActivity(JSON.parse(new TextDecoder().decode(all)));}catch{throw new AnalyticsRejected(400,'Invalid activity batch.');}
}
export async function recordActivity(db:D1Database,batch:ActivityBatch,now=Date.now()){
 await ensureHistory(db);
 const minute=Math.floor(now/60_000);const previous=await db.prepare('SELECT rate_window, rate_count FROM analytics_visitors WHERE id = ?').bind(batch.visitorId).first<{rate_window:number;rate_count:number}>();
 if(previous&&previous.rate_window===minute&&previous.rate_count>=120)throw new AnalyticsRejected(429,'Too many events.');
 const statements=[db.prepare(`INSERT INTO analytics_visitors (id,last_activity,last_visible,tool_id,rate_window,rate_count) VALUES (?,?,?,?,?,?)
 ON CONFLICT(id) DO UPDATE SET last_activity=MAX(last_activity,excluded.last_activity),last_visible=CASE WHEN ? THEN MAX(last_visible,excluded.last_visible) ELSE last_visible END,tool_id=CASE WHEN ? THEN excluded.tool_id ELSE tool_id END,rate_count=CASE WHEN rate_window=excluded.rate_window THEN rate_count+excluded.rate_count ELSE excluded.rate_count END,rate_window=excluded.rate_window`).bind(batch.visitorId,now,batch.visible?now:0,batch.toolId,minute,Math.max(1,batch.events.length),batch.visible?1:0,batch.visible?1:0),...batch.events.map(e=>db.prepare('INSERT INTO analytics_events (id,visitor_id,kind,tool_id,received_at) VALUES (?,?,?,?,?) ON CONFLICT(id) DO NOTHING').bind(e.id,batch.visitorId,e.kind,e.toolId,now))];
 // Indexed, bounded retention keeps only the data required for the rolling windows.
 statements.push(db.prepare('DELETE FROM analytics_events WHERE received_at < ?').bind(now-RETENTION_MS),db.prepare('DELETE FROM analytics_visitors WHERE last_activity < ?').bind(now-RETENTION_MS));
 await db.batch(statements);
 return {accepted:batch.events.map(e=>e.id)};
}
export async function getAnalytics(db:D1Database,now=Date.now()):Promise<AnalyticsSummary>{
 const eventTotals=(cutoff:number)=>db.prepare(`SELECT COALESCE(SUM(kind='process_start'),0) AS starts,COALESCE(SUM(kind='process_success'),0) AS completed,COALESCE(SUM(kind='process_error'),0) AS failed,COALESCE(SUM(kind='download'),0) AS downloads FROM analytics_events WHERE received_at>=? AND received_at<=?`).bind(cutoff,now);
 const responses=await db.batch([
 db.prepare(`SELECT SUM(last_visible>=? AND last_visible<=?) AS online,SUM(last_activity>=? AND last_activity<=?) AS hour,SUM(last_activity>=? AND last_activity<=?) AS day FROM analytics_visitors`).bind(now-LIVE_MS,now,now-HOUR_MS,now,now-DAY_MS,now),
 eventTotals(now-HOUR_MS),eventTotals(now-DAY_MS),
 db.prepare('SELECT tool_id AS toolId,COUNT(*) AS visitors FROM analytics_visitors WHERE last_visible>=? AND last_visible<=? GROUP BY tool_id ORDER BY visitors DESC').bind(now-LIVE_MS,now),
 db.prepare(`SELECT tool_id AS toolId,SUM(kind='tool_open') AS opens,SUM(kind='process_success') AS completed,SUM(kind='process_error') AS failed,SUM(kind='download') AS downloads,COUNT(DISTINCT visitor_id) AS uniqueVisitors FROM analytics_events WHERE received_at>=? AND received_at<=? AND tool_id IS NOT NULL GROUP BY tool_id ORDER BY completed DESC,opens DESC`).bind(now-DAY_MS,now),
 db.prepare(`SELECT CAST(received_at / ? AS INTEGER)*? AS hour,COUNT(*) AS completed FROM analytics_events WHERE kind='process_success' AND received_at>=? AND received_at<=? GROUP BY hour ORDER BY hour`).bind(HOUR_MS,HOUR_MS,now-DAY_MS,now),
 db.prepare('SELECT MIN(received_at) AS first FROM analytics_events')
 ]);
 const counts=responses[0].results[0] as unknown as {online:number|null;hour:number|null;day:number|null};const metrics=(row:unknown,visitors:number|null):MetricsWindow=>({...row as Omit<MetricsWindow,'visitors'>,visitors:visitors??0});
 return {updatedAt:now,liveOnline:counts?.online??0,lastHour:metrics(responses[1].results[0],counts?.hour),last24Hours:metrics(responses[2].results[0],counts?.day),liveTools:responses[3].results as AnalyticsSummary['liveTools'],tools:responses[4].results as AnalyticsSummary['tools'],activity:responses[5].results as AnalyticsSummary['activity'],firstRecordedAt:(responses[6].results[0] as {first:number|null})?.first??null};
}


const historyReady=new WeakMap<D1Database,Promise<unknown>>();
function ensureHistory(db:D1Database){let promise=historyReady.get(db);if(!promise){promise=db.batch([
 db.prepare("CREATE TABLE IF NOT EXISTS analytics_daily (day INTEGER NOT NULL,tool_id TEXT NOT NULL,kind TEXT NOT NULL,total INTEGER NOT NULL,PRIMARY KEY(day,tool_id,kind))"),
 db.prepare("INSERT INTO analytics_daily(day,tool_id,kind,total) SELECT CAST(received_at/86400000 AS INTEGER)*86400000,COALESCE(tool_id,''),kind,COUNT(*) FROM analytics_events GROUP BY 1,2,3 ON CONFLICT(day,tool_id,kind) DO NOTHING"),
 db.prepare("CREATE TRIGGER IF NOT EXISTS analytics_daily_insert AFTER INSERT ON analytics_events BEGIN INSERT INTO analytics_daily(day,tool_id,kind,total) VALUES(CAST(NEW.received_at/86400000 AS INTEGER)*86400000,COALESCE(NEW.tool_id,''),NEW.kind,1) ON CONFLICT(day,tool_id,kind) DO UPDATE SET total=total+1; END")
 ]).catch(error=>{historyReady.delete(db);throw error;});historyReady.set(db,promise);}return promise;}
export async function getOwnerHistory(db:D1Database,period:import('./analytics-contract').OwnerPeriod,now=Date.now()):Promise<import('./analytics-contract').OwnerHistory>{
 await ensureHistory(db);
 const months=period==='1m'?1:period==='5m'?5:period==='1y'?12:0;const start=new Date(now);if(months)start.setUTCMonth(start.getUTCMonth()-months);
 const since=period==='1h'?now-HOUR_MS:period==='24h'?now-DAY_MS:period==='all'?0:Math.floor(start.getTime()/DAY_MS)*DAY_MS;
 const short=period==='1h'||period==='24h';const source=short?'analytics_events':'analytics_daily';const count=short?'1':'total';const time=short?'received_at':'day';
 const rows=await db.batch([
 db.prepare(`SELECT COALESCE(SUM(CASE WHEN kind='visit' THEN ${count} ELSE 0 END),0) AS visits,COALESCE(SUM(CASE WHEN kind='process_start' THEN ${count} ELSE 0 END),0) AS starts,COALESCE(SUM(CASE WHEN kind='process_success' THEN ${count} ELSE 0 END),0) AS completed,COALESCE(SUM(CASE WHEN kind='process_error' THEN ${count} ELSE 0 END),0) AS failed,COALESCE(SUM(CASE WHEN kind='download' THEN ${count} ELSE 0 END),0) AS downloads FROM ${source} WHERE ${time}>=? AND ${time}<=?`).bind(since,now),
 db.prepare(`SELECT tool_id AS toolId,SUM(CASE WHEN kind='tool_open' THEN ${count} ELSE 0 END) AS opens,SUM(CASE WHEN kind='process_success' THEN ${count} ELSE 0 END) AS completed,SUM(CASE WHEN kind='process_error' THEN ${count} ELSE 0 END) AS failed,SUM(CASE WHEN kind='download' THEN ${count} ELSE 0 END) AS downloads FROM ${source} WHERE ${time}>=? AND ${time}<=? AND tool_id IS NOT NULL AND tool_id!='' GROUP BY tool_id ORDER BY opens DESC,completed DESC`).bind(since,now),
 db.prepare(`SELECT CAST(${time}/? AS INTEGER)*? AS time,SUM(CASE WHEN kind='process_success' THEN ${count} ELSE 0 END) AS completed,SUM(CASE WHEN kind='process_error' THEN ${count} ELSE 0 END) AS failed FROM ${source} WHERE ${time}>=? AND ${time}<=? GROUP BY 1 ORDER BY 1`).bind(short?HOUR_MS:DAY_MS,short?HOUR_MS:DAY_MS,since,now),
 db.prepare('SELECT MIN(day) AS first FROM analytics_daily')
 ]);
 return {period,since,firstRecordedAt:(rows[3].results[0] as {first:number|null})?.first??null,totals:rows[0].results[0] as import('./analytics-contract').OwnerHistory['totals'],tools:rows[1].results as import('./analytics-contract').OwnerHistory['tools'],activity:rows[2].results as import('./analytics-contract').OwnerHistory['activity']};
}
