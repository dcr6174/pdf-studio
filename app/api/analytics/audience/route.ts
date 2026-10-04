import {analyticsDb,analyticsOwnerEmail} from '@/lib/analytics-db';
import {isOwner} from '@/lib/analytics-server';
import {audienceReport} from '@/lib/audience';
export const dynamic='force-dynamic';
export async function GET(request:Request){
 const headers={'Cache-Control':'no-store'};
 if(!isOwner(request.headers,analyticsOwnerEmail()))return Response.json({error:'Owner access is required.'},{status:403,headers});
 try{return Response.json(await audienceReport(analyticsDb(),new URL(request.url).searchParams.get('period')==='1h'?1:24),{headers});}catch{return Response.json({error:'Audience reports are unavailable. Check the DB binding.'},{status:503,headers});}
}
