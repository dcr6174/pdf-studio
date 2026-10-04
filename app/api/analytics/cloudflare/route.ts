import {env} from 'cloudflare:workers';
import {analyticsOwnerEmail} from '@/lib/analytics-db';
import {isOwner} from '@/lib/analytics-server';
import {cloudflareReport,type CloudflareReport} from '@/lib/cloudflare-report';
export const dynamic='force-dynamic';
const cached=new Map<number,{expires:number;value:Promise<CloudflareReport>}>();
export async function GET(request:Request){
 const headers={'Cache-Control':'no-store'};
 if(!isOwner(request.headers,analyticsOwnerEmail()))return Response.json({error:'Owner access is required.'},{status:403,headers});
 const hours=new URL(request.url).searchParams.get('period')==='1h'?1:24;
 const config=env as unknown as {CLOUDFLARE_ANALYTICS_TOKEN?:string;CLOUDFLARE_ZONE_ID?:string};
 let entry=cached.get(hours);if(!entry||entry.expires<Date.now()){entry={expires:Date.now()+60000,value:cloudflareReport(config.CLOUDFLARE_ANALYTICS_TOKEN,config.CLOUDFLARE_ZONE_ID,hours)};cached.set(hours,entry);}
 return Response.json(await entry.value,{headers});
}
