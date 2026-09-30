import type { Metadata } from 'next';
export const metadata: Metadata = {title:'Owner dashboard',robots:{index:false,follow:false}};
export default function AnalyticsLayout({children}:{children:React.ReactNode}){return children;}
