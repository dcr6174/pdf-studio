import {pageMeta} from '@/lib/page-meta';
import {SiteHeader,SiteFooter} from '@/components/site-header';
import {ToolsDirectory} from '@/components/tools-directory';
export const metadata=pageMeta('/tools','All free PDF tools — edit, sign, organize and convert','Search PDF Studio tools by task or category. Open a tool directly to edit, sign, merge, compress or convert your document.');
export default function ToolsPage(){return <div className="site-frame"><SiteHeader/><main className="tool-instructions tools-directory-page"><h1>Find your PDF tool</h1><p>Choose a task. Open your file inside the tool.</p><ToolsDirectory/></main><SiteFooter/></div>;}
