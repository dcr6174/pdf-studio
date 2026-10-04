import {analyticsOwnerEmail} from '@/lib/analytics-db';
import {isOwner} from '@/lib/analytics-server';
export const dynamic='force-dynamic';
export async function GET(request:Request){return Response.json({owner:isOwner(request.headers,analyticsOwnerEmail())},{headers:{'Cache-Control':'no-store','X-Robots-Tag':'noindex, nofollow'}});}
