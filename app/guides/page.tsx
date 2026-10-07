import type {Metadata} from 'next';
import {pageMeta} from '@/lib/page-meta';
import {GuideDirectory} from '@/components/guide-directory';
import {BookOpen} from 'lucide-react';
import './guides.css';
import Link from '@/components/browser-link';
import {SiteHeader,SiteFooter} from '@/components/site-header';
import {seoPages} from '@/lib/seo-tools';
import {conversionGuides} from '@/lib/conversion-guides';
import {comparisons} from '@/lib/comparisons';


export const metadata:Metadata=pageMeta('/guides','PDF guides: how to edit, merge, compress, sign and scan PDFs free','Step-by-step guides for every PDF Studio tool, popular tasks like compressing a PDF to 100 KB or editing a CV, and honest comparisons with iLovePDF, Smallpdf, Sejda and Adobe.');

const popular=['edit-cv-pdf','compress-pdf-to-100kb','scan-to-pdf','jpg-to-pdf','delete-pdf-pages','pdf-to-excel'];

export default function Guides(){
 const bySlug=new Map(seoPages.map(p=>[p.slug,p]));
 const tasks=popular.map(s=>bySlug.get(s)).filter((p):p is NonNullable<typeof p>=>!!p);
 return <div className="guides-page"><SiteHeader/><main className="guides-main">
  <header className="guides-hero"><h1>A little guidance.<br/>A better PDF.</h1><p>Learn how to edit, organize, sign and convert your PDFs. Choose a guide, follow the steps, and use the tool on the same page.</p></header>
  <GuideDirectory guides={seoPages.map(p=>({id:p.id,slug:p.slug,title:p.title,intro:p.intro,group:p.group}))}/>
  <p><Link href="/blog">Learn: 20 practical answers to common PDF problems</Link></p>
  <section className="guides-popular" aria-labelledby="popular-guides-title"><div className="guide-section-heading"><h2 id="popular-guides-title">Popular PDF guides</h2><p>A helpful place to start.</p></div><div className="guides-popular-grid">{tasks.map(t=><Link className="guide-card" key={t.slug} href={'/tools/'+t.slug}><span className="guide-card-icon" aria-hidden="true"><BookOpen size={22}/></span><span><h3>{t.title}</h3><p>{t.intro.replace(' Configure the available options, inspect the result and download it from your browser.','')}</p></span></Link>)}</div></section>

  <section className="guides-resources" aria-label="More resources"><div><h2>Export guides</h2><ul>{conversionGuides.map(g=><li key={g.slug}><Link href={'/tools/'+g.slug}>{g.title}</Link><p>{g.intro}</p></li>)}</ul></div><div><h2>Trust and privacy</h2><ul><li><Link href="/check-it-yourself">Check file privacy yourself</Link><p>Checks you can run in your own browser.</p></li><li><Link href="/privacy">Privacy policy</Link></li><li><Link href="/contact">Questions and feedback</Link></li></ul></div><div><h2>Tool comparisons</h2><p>Compare published capabilities and limitations.</p><ul>{comparisons.map(c=><li key={c.slug}><Link href={'/compare/'+c.slug}>{c.title}</Link></li>)}</ul></div></section>
 </main><SiteFooter/></div>;
}
