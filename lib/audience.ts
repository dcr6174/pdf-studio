export type AudienceRow={country:string;device:string;os:string;browser:string;visitors:number};
export function classifyAudience(request:Request){
 const ua=(request.headers.get('user-agent')??'').slice(0,1024);
 const cf=(request as Request & {cf?:{country?:string}}).cf;
 const raw=cf?.country??request.headers.get('cf-ipcountry')??'';
 const country=/^[A-Z]{2}$/.test(raw)&&raw!=='XX'?raw:'Unknown';
 const os=/Android/i.test(ua)?'Android':/iPhone|iPad|iPod/i.test(ua)?'iOS':/Windows/i.test(ua)?'Windows':/Macintosh/i.test(ua)?'macOS':/CrOS/i.test(ua)?'ChromeOS':/Linux/i.test(ua)?'Linux':'Unknown';
 const device=/iPad|Tablet/i.test(ua)||(/Android/i.test(ua)&&!/Mobile/i.test(ua))?'Tablet':/Mobile|iPhone|iPod/i.test(ua)?'Mobile':ua?'Desktop':'Unknown';
 const browser=/Edg\//i.test(ua)?'Edge':/OPR\//i.test(ua)?'Opera':/Firefox|FxiOS/i.test(ua)?'Firefox':/Chrome|CriOS/i.test(ua)?'Chrome':/Safari/i.test(ua)?'Safari':'Other';
 return {country,device,os,browser};
}
const ready=new WeakMap<D1Database,Promise<unknown>>();
async function initialize(db:D1Database){let p=ready.get(db);if(!p){p=db.prepare('CREATE TABLE IF NOT EXISTS analytics_context (visitor_id TEXT PRIMARY KEY,country TEXT NOT NULL,device TEXT NOT NULL,os TEXT NOT NULL,browser TEXT NOT NULL,updated_at INTEGER NOT NULL)').run();ready.set(db,p);try{await p;}catch(e){ready.delete(db);throw e;}}else await p;}
export async function recordAudience(db:D1Database,id:string,request:Request,now=Date.now()){
 await initialize(db);const a=classifyAudience(request);
 await db.batch([db.prepare('INSERT INTO analytics_context VALUES (?,?,?,?,?,?) ON CONFLICT(visitor_id) DO UPDATE SET country=excluded.country,device=excluded.device,os=excluded.os,browser=excluded.browser,updated_at=excluded.updated_at').bind(id,a.country,a.device,a.os,a.browser,now),db.prepare('DELETE FROM analytics_context WHERE updated_at < ?').bind(now-48*3600000)]);
}
export async function audienceReport(db:D1Database,hours:number,now=Date.now()){
 await initialize(db);
 await db.prepare('DELETE FROM analytics_context WHERE updated_at < ?').bind(now-48*3600000).run();
 const result=await db.prepare('SELECT c.country,c.device,c.os,c.browser,COUNT(*) AS visitors FROM analytics_context c JOIN analytics_visitors v ON v.id=c.visitor_id WHERE v.last_activity >= ? GROUP BY c.country,c.device,c.os,c.browser ORDER BY visitors DESC LIMIT 1000').bind(now-hours*3600000).all<AudienceRow>();
 return {updatedAt:now,rows:result.results,truncated:result.results.length===1000};
}

export async function purgeAudience(db:D1Database,now=Date.now()){await initialize(db);await db.prepare('DELETE FROM analytics_context WHERE updated_at < ?').bind(now-48*3600000).run();}
