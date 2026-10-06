import {analyticsDb,analyticsOwnerEmail} from '@/lib/analytics-db';
import {isOwner,getAnalytics,getOwnerHistory} from '@/lib/analytics-server';
export const dynamic='force-dynamic';
export async function GET(request:Request){
 if(!isOwner(request.headers,analyticsOwnerEmail()))return Response.json({error:'Owner access is required.'},{status:403,headers:{'Cache-Control':'no-store'}});
 try{const value=new URL(request.url).searchParams.get("period")??"24h";if(!["1h","24h","1m","5m","1y","all"].includes(value))return Response.json({error:"Invalid period"},{status:400});const db=analyticsDb();const [summary,history]=await Promise.all([getAnalytics(db),getOwnerHistory(db,value as import("@/lib/analytics-contract").OwnerPeriod)]);return Response.json({...summary,history},{headers:{'Cache-Control':'no-store'}});}catch{console.error('Analytics summary failed');return Response.json({error:'Analytics is temporarily unavailable. Please try again.'},{status:503,headers:{'Cache-Control':'no-store'}});}
}

