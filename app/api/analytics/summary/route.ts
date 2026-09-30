import {analyticsDb,analyticsOwnerEmail} from '@/lib/analytics-db';
import {isOwner,getAnalytics} from '@/lib/analytics-server';
export const dynamic='force-dynamic';
export async function GET(request:Request){
 if(!isOwner(request.headers,analyticsOwnerEmail()))return Response.json({error:'Owner access is required.'},{status:403,headers:{'Cache-Control':'no-store'}});
 try{return Response.json(await getAnalytics(analyticsDb()),{headers:{'Cache-Control':'no-store'}});}catch{console.error('Analytics summary failed');return Response.json({error:'Analytics is temporarily unavailable. Please try again.'},{status:503,headers:{'Cache-Control':'no-store'}});}
}
