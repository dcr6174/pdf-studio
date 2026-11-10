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
export default function NotFound(){return <div><SiteHeader/><main className="nf-page"><section className="nf-hero"><span className="nf-code">404</span><h1>This page could not be found.</h1><p>The link may be old or mistyped. Pick a tool below, or head back home.</p><div className="nf-actions"><Link className="nf-primary" href="/">Back to home</Link><Link className="nf-secondary" href="/tools">Browse all tools</Link></div></section><ToolsDirectory/></main><SiteFooter/></div>;}
