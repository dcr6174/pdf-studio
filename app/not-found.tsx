import Link from '@/components/browser-link';
import {SiteHeader,SiteFooter} from '@/components/site-header';
import {ToolsDirectory} from '@/components/tools-directory';
import type {Metadata} from 'next';

export const metadata:Metadata={
 title:{absolute:'Page not found | PDF Studio'},
 description:'This page does not exist. Browse the PDF Studio tools or return to the homepage.',
 robots:{index:false,follow:true},
 alternates:{canonical:null},
 openGraph:{title:'Page not found | PDF Studio',description:'This page does not exist.',type:'website',siteName:'PDF Studio'},
 twitter:{title:'Page not found | PDF Studio',description:'This page does not exist.'}
};
export default function NotFound(){return <div><SiteHeader/><main style={{maxWidth:1200,margin:'auto',padding:'32px 16px'}}><h1>This page could not be found.</h1><p>Choose a tool below, or <Link href="/">return to PDF Studio</Link>.</p><ToolsDirectory/></main><SiteFooter/></div>;}
