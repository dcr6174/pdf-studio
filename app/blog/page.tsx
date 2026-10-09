import {BlogDirectory} from '@/components/blog-directory';
import Link from '@/components/browser-link';
import {SiteHeader,SiteFooter} from '@/components/site-header';
import {pageMeta} from '@/lib/page-meta';
import {articles} from '@/lib/articles';
import './blog.css';
export const metadata=pageMeta('/blog','PDF help and practical guides','Practical answers for PDF compression, signing, page organization, OCR and privacy. Clear steps and honest limitations.');
export default function Blog(){return <div className="blog-shell"><SiteHeader/><main className="blog-main blog-directory-main"><nav aria-label="Breadcrumb"><Link href="/">PDF Studio</Link> / Learn</nav><h1>Make your next PDF task easier.</h1><p className="blog-intro">Practical guides with clear steps, checks and limitations. Three focused guides for each of our 66 tools. Written by PDF Studio.</p><nav className="learn-nav"><Link href="/guides">Browse tool instructions</Link><Link href="/check-it-yourself">Check document privacy</Link></nav><BlogDirectory articles={articles.map(({slug,title,summary,category,intent,tags})=>({slug,title,summary,category,intent,tags}))}/></main><SiteFooter/></div>;}
