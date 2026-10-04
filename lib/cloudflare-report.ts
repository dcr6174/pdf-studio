export type CloudflareReport={status:'ready'|'not_configured'|'unavailable';message?:string;updatedAt?:number;requests?:number;bytes?:number;visits?:number;countries?:{label:string;count:number}[];devices?:{label:string;count:number}[]};
type Group={count:number;sum?:{edgeResponseBytes?:number;visits?:number};dimensions?:{clientCountryName?:string;clientDeviceType?:string}};
export async function cloudflareReport(token:string|undefined,zone:string|undefined,hours:number,fetcher:typeof fetch=fetch):Promise<CloudflareReport>{
 if(!token||!zone)return {status:'not_configured',message:'Add CLOUDFLARE_ANALYTICS_TOKEN (read-only Analytics token) and CLOUDFLARE_ZONE_ID to Worker runtime settings.'};
 if(!/^[a-f0-9]{32}$/i.test(zone))return {status:'unavailable',message:'Check the Cloudflare Zone ID.'};
 const end=new Date(),start=new Date(end.getTime()-hours*3600000);
 const filter='datetime_geq:$start,datetime_lt:$end,requestSource:"eyeball",clientRequestHTTPHost:"pdf-studio.in"';
 const query=`query Report($zone:string,$start:Time,$end:Time){viewer{zones(filter:{zoneTag:$zone}){totals:httpRequestsAdaptiveGroups(limit:1,filter:{${filter}}){count sum{edgeResponseBytes visits}} countries:httpRequestsAdaptiveGroups(limit:20,orderBy:[count_DESC],filter:{${filter}}){count dimensions{clientCountryName}} devices:httpRequestsAdaptiveGroups(limit:10,orderBy:[count_DESC],filter:{${filter}}){count dimensions{clientDeviceType}}}}}`;
 try{
 const response=await fetcher('https://api.cloudflare.com/client/v4/graphql',{method:'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},body:JSON.stringify({query,variables:{zone,start:start.toISOString(),end:end.toISOString()}}),signal:AbortSignal.timeout(12000)});
 if(!response.ok)throw new Error('API rejected');
 const body=await response.json() as {errors?:unknown[];data?:{viewer?:{zones?:{totals:Group[];countries:Group[];devices:Group[]}[]}}};
 const data=body.data?.viewer?.zones?.[0];if(body.errors?.length||!data)throw new Error('Dataset unavailable');
 return {status:'ready',updatedAt:Date.now(),requests:data.totals[0]?.count??0,bytes:data.totals[0]?.sum?.edgeResponseBytes??0,visits:data.totals[0]?.sum?.visits??0,countries:data.countries.map(g=>({label:g.dimensions?.clientCountryName??'Unknown',count:g.count})),devices:data.devices.map(g=>({label:g.dimensions?.clientDeviceType??'Unknown',count:g.count}))};
 }catch{return {status:'unavailable',message:'Cloudflare did not provide this dataset. Check token permissions, zone access, plan availability, and try again.'};}
}
