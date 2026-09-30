import {analyticsOwnerEmail} from '@/lib/analytics-db';
import {isOwner} from '@/lib/analytics-server';
export const dynamic='force-dynamic';
export async function GET(request:Request){return new Response(null,{status:isOwner(request.headers,analyticsOwnerEmail())?204:403,headers:{'Cache-Control':'no-store'}});}
