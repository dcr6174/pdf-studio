import {analyticsDb} from '@/lib/analytics-db';
import {readActivityRequest,recordActivity,AnalyticsRejected} from '@/lib/analytics-server';
export const dynamic='force-dynamic';
export async function POST(request:Request){
 try{
  const batch=await readActivityRequest(request);
  if(/bot\b|crawler|spider|headless|lighthouse/i.test(request.headers.get('user-agent')??''))return Response.json({accepted:batch.events.map(e=>e.id)},{headers:{'Cache-Control':'no-store'}});
  return Response.json(await recordActivity(analyticsDb(),batch),{headers:{'Cache-Control':'no-store'}});
 }catch(e){if(e instanceof AnalyticsRejected)return Response.json({error:e.message},{status:e.status,headers:{'Cache-Control':'no-store'}});console.error('Analytics collection failed');return Response.json({error:'Analytics is temporarily unavailable.'},{status:503,headers:{'Cache-Control':'no-store','Retry-After':'30'}});}
}
