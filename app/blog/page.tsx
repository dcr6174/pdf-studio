import Link from '@/components/browser-link';
import {SiteHeader,SiteFooter} from '@/components/site-header';
import {BlogDirectory} from '@/components/blog-directory';
import {articles} from '@/lib/articles';
import {pageMeta} from '@/lib/page-meta';
import './blog.css';
export const metadata=pageMeta('/blog','PDF guides, tips and practical fixes','Learn to merge, compress, sign, convert and organize PDFs with step-by-step guides, useful tips and clear tool limitations.');
export default function Blog(){return <div className="blog-shell"><SiteHeader/><main className="blog-main"><nav className="blog-breadcrumb" aria-label="Breadcrumb"><Link href="/">PDF Studio</Link><span>/</span><span aria-current="page">Learn</span></nav><header className="blog-directory-hero"><span className="blog-eyebrow">A little help. A better PDF.</span><h1>Less PDF drama.<br/>More getting things done.</h1><p className="blog-intro">Find the steps, learn the tricks, then jump straight into your tool.</p><Link className="blog-primary-action" href="/tools">Already know the drill? Pick a tool →</Link></header><BlogDirectory guides={articles.map(({slug,title,summary,category})=>({slug,title,summary,category}))}/></main><SiteFooter/></div>;}
