import Link from '@/components/browser-link';
import {SiteHeader,SiteFooter} from '@/components/site-header';
import {ToolsDirectory} from '@/components/tools-directory';
export default function NotFound(){return <div><SiteHeader/><main style={{maxWidth:1200,margin:'auto',padding:'32px 16px'}}><h1>This page could not be found.</h1><p>Choose a tool below, or <Link href="/">return to PDF Studio</Link>.</p><ToolsDirectory/></main><SiteFooter/></div>;}
