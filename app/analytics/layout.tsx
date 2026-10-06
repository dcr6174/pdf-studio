import {SiteFrame} from '@/components/site-frame';
import type { Metadata } from 'next';
export const metadata: Metadata = {title:'Owner dashboard',robots:{index:false,follow:false}};
export default function AnalyticsLayout({children}:{children:React.ReactNode}){return <SiteFrame tool="Owner dashboard">{children}</SiteFrame>;}
