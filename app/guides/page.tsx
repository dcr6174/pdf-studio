import type {Metadata} from 'next';
import {pageMeta} from '@/lib/page-meta';
import {Spotlight} from '@/components/spotlight';
import Link from '@/components/browser-link';
import {SiteHeader,SiteFooter} from '@/components/site-header';
import {seoPages} from '@/lib/seo-tools';
import {conversionGuides} from '@/lib/conversion-guides';
import {comparisons} from '@/lib/comparisons';
import {groups} from '@/lib/tools';

export const metadata:Metadata=pageMeta('/guides','PDF guides: how to edit, merge, compress, sign and scan PDFs free','Step-by-step guides for every PDF Studio tool, popular tasks like compressing a PDF to 100 KB or editing a CV, and honest comparisons with iLovePDF, Smallpdf, Sejda and Adobe.');

const popular=['edit-cv-pdf','compress-pdf-to-100kb','scan-to-pdf','jpg-to-pdf','delete-pdf-pages','pdf-to-excel'];

export default function Guides(){
 const bySlug=new Map(seoPages.map(p=>[p.slug,p]));
 const tasks=popular.map(s=>bySlug.get(s)).filter((p):p is NonNullable<typeof p>=>!!p);
 return <div className="seo-page"><SiteHeader/><main className="tool-instructions guides-hub">
  <h1>PDF guides</h1>
  <p className="lead">How to do common PDF jobs for free in your browser, with the limits stated plainly. Every guide opens the tool on the same page.</p>
  <h2>Popular tasks</h2>
  <Spotlight as="nav" className="related-tools" item="a" aria-label="Popular PDF tasks">{tasks.map(t=><Link key={t.slug} href={'/tools/'+t.slug}><b>{t.title}</b><span>{t.intro}</span></Link>)}</Spotlight>
  {groups.filter(g=>!['All tools','My files'].includes(g)).map(g=><section key={g}><h2>{g}</h2>
   <ul className="guide-list">{seoPages.filter(p=>p.group===g).map(p=><li key={p.slug}><Link href={'/tools/'+p.slug}>{p.title}</Link><span>{p.intro}</span></li>)}</ul></section>)}
  <h2>Export guides</h2>
  <ul className="guide-list">{conversionGuides.map(g=><li key={g.slug}><Link href={'/tools/'+g.slug}>{g.title}</Link><span>{g.intro}</span></li>)}</ul>
  <h2>Trust and privacy</h2>
  <ul className="guide-list"><li><Link href="/check-it-yourself">Check it yourself: what PDF Studio sends</Link><span>Four checks you can run in your own browser, and what they can and cannot show.</span></li><li><Link href="/privacy">Privacy policy</Link><span>What is stored on your device and what, if anything, is sent.</span></li><li><Link href="/contact">Contact</Link><span>Questions, problems and suggestions.</span></li></ul>
  <h2>Compared with other tools (what each publishes)</h2>
  <ul className="guide-list">{comparisons.map(c=><li key={c.slug}><Link href={'/compare/'+c.slug}>{c.title}</Link><span>{c.summary}</span></li>)}</ul>
 </main><SiteFooter/></div>;
}
