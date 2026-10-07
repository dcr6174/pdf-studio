import Link from '@/components/browser-link';
import {SiteHeader,SiteFooter} from '@/components/site-header';
import {pageMeta} from '@/lib/page-meta';
import {articles} from '@/lib/articles';
import './blog.css';
export const metadata=pageMeta('/blog','PDF help and practical guides','Practical answers for PDF compression, signing, page organization, OCR and privacy. Clear steps and honest limitations.');
export default function Blog(){return <div className="blog-shell"><SiteHeader/><main className="blog-main"><nav aria-label="Breadcrumb"><Link href="/">PDF Studio</Link> / Learn</nav><h1>Make your next PDF task easier.</h1><p className="blog-intro">Practical guides with clear steps, checks and limitations. Written by PDF Studio · 7 October 2026.</p><nav className="learn-nav"><Link href="/guides">Browse tool instructions</Link><Link href="/check-it-yourself">Check document privacy</Link></nav><section className="native-blog-grid" aria-label="PDF problem guides">{articles.map(a=><Link key={a.slug} href={'/blog/'+a.slug} className="native-blog-card"><small>{a.category}</small><h2>{a.title}</h2><p>{a.summary}</p><span>Read the guide →</span></Link>)}</section></main><SiteFooter/></div>;}
