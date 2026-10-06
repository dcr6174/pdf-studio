import Link from '@/components/browser-link';
import {headers} from 'next/headers';
import {getChatGPTUser} from '@/app/chatgpt-auth';
import {analyticsOwnerEmail} from '@/lib/analytics-db';
import {isOwner} from '@/lib/analytics-server';
import AnalyticsDashboard from './dashboard';
export const dynamic='force-dynamic';
export const metadata={title:'Analytics — PDF Studio',robots:{index:false,follow:false}};
export default async function AnalyticsPage(){const user=await getChatGPTUser();if(!user)return <main className="analytics-denied"><h1>Owner analytics</h1><p>This dashboard is available only to the authenticated site owner.</p><Link href="/" className="secondary">Back to PDF Studio</Link></main>;if(!isOwner(await headers(),analyticsOwnerEmail()))return <main className="analytics-denied"><h1>Owner access required</h1><p>This dashboard is private to the site owner.</p><Link href="/" className="secondary">Back to PDF Studio</Link></main>;return <AnalyticsDashboard/>;}

