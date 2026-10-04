import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import Link from '@/components/browser-link';
import {SiteHeader,SiteFooter} from '@/components/site-header';
import {comparisons,COMPARISONS_CHECKED} from '@/lib/comparisons';

export function generateStaticParams(){return comparisons.map(c=>({slug:c.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
 const {slug}=await params,c=comparisons.find(x=>x.slug===slug);if(!c)return {};
 return {title:c.title+': free, private alternative',description:c.description,alternates:{canonical:'/compare/'+c.slug},openGraph:{title:c.title,description:c.description,url:'https://pdf-studio.in/compare/'+c.slug,images:[{url:'/social/home.png',width:1200,height:630,alt:'PDF Studio'}]},twitter:{card:'summary_large_image',title:c.title,description:c.description,images:['/social/home.png']}};
}
export default async function ComparePage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params,c=comparisons.find(x=>x.slug===slug);if(!c)notFound();
 const url='https://pdf-studio.in/compare/'+c.slug;
 const schema={'@context':'https://schema.org','@graph':[{'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'PDF Studio',item:'https://pdf-studio.in/'},{'@type':'ListItem',position:2,name:'Guides',item:'https://pdf-studio.in/guides'},{'@type':'ListItem',position:3,name:c.title,item:url}]},{'@type':'Article',headline:c.title,description:c.description,dateModified:'2026-10-04',author:{'@type':'Organization',name:'PDF Studio'}}]};
 return <div className="seo-page"><SiteHeader/><main className="tool-instructions compare-page">
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,'\\u003c')}}/>
  <nav className="page-crumbs" aria-label="Breadcrumb"><Link href="/guides">Guides</Link> / Comparison</nav>
  <h1>{c.title}</h1><p className="lead">{c.summary}</p>
  <p className="checked">Checked {COMPARISONS_CHECKED}. {c.name} changes its plans from time to time; confirm current limits on the source linked below.</p>
  <div className="table-scroll"><table className="compare-table"><thead><tr><th scope="col">&nbsp;</th><th scope="col">PDF Studio</th><th scope="col">{c.name}</th></tr></thead>
   <tbody>{c.rows.map(([topic,ours,theirs])=><tr key={topic}><th scope="row">{topic}</th><td data-label="PDF Studio">{ours}</td><td data-label={c.name}>{theirs}</td></tr>)}</tbody></table></div>
  <h2>Choose {c.name} if</h2><ul>{c.theyAreBetter.map(x=><li key={x}>{x}</li>)}</ul>
  <h2>Choose PDF Studio if</h2><ul>{c.weAreBetter.map(x=><li key={x}>{x}</li>)}</ul>
  <h2>Try it</h2><nav className="related-tools" aria-label="Popular tools"><Link href="/tools/edit-pdf-text"><b>Edit PDF text</b><span>Change existing text in your browser.</span></Link><Link href="/tools/compress-pdf"><b>Compress PDF</b><span>Make a PDF smaller for email and portals.</span></Link><Link href="/tools/merge-pdf"><b>Merge PDF files</b><span>Combine PDFs in the order you choose.</span></Link></nav>
  <h2>Sources</h2><ul>{c.sources.map(s=><li key={s.url}><a href={s.url} rel="noreferrer nofollow">{s.label}</a></li>)}</ul>
  <p className="checked">Other comparisons: {comparisons.filter(x=>x.slug!==c.slug).map((x,i)=><span key={x.slug}>{i>0?' · ':''}<Link href={'/compare/'+x.slug}>{x.title}</Link></span>)}</p>
 </main><SiteFooter/></div>;
}
