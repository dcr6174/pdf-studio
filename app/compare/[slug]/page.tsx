import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {Spotlight} from '@/components/spotlight';
import Link from '@/components/browser-link';
import {SiteHeader,SiteFooter} from '@/components/site-header';
import {comparisons,COMPARISONS_CHECKED} from '@/lib/comparisons';

export function generateStaticParams(){return comparisons.map(c=>({slug:c.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
 const {slug}=await params,c=comparisons.find(x=>x.slug===slug);if(!c)return {};
 return {title:c.title+' (what each publishes)',description:c.description,alternates:{canonical:'/compare/'+c.slug},openGraph:{title:c.title,description:c.description,url:'https://pdf-studio.in/compare/'+c.slug,images:[{url:'/social/home.png',width:1200,height:630,alt:'PDF Studio'}]},twitter:{card:'summary_large_image',title:c.title,description:c.description,images:['/social/home.png']}};
}
export default async function ComparePage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params,c=comparisons.find(x=>x.slug===slug);if(!c)notFound();
 const url='https://pdf-studio.in/compare/'+c.slug;
 const schema={'@context':'https://schema.org','@graph':[{'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'PDF Studio',item:'https://pdf-studio.in/'},{'@type':'ListItem',position:2,name:'Guides',item:'https://pdf-studio.in/guides'},{'@type':'ListItem',position:3,name:c.title,item:url}]},{'@type':'Article',headline:c.title,description:c.description,dateModified:'2026-10-04',author:{'@type':'Organization',name:'PDF Studio'}}]};
 return <div className="seo-page"><SiteHeader/><main className="tool-instructions compare-page">
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,'\\u003c')}}/>
  <nav className="page-crumbs" aria-label="Breadcrumb"><Link href="/guides">Guides</Link> / Comparison</nav>
  <h1>{c.title}</h1><p className="lead">{c.summary}</p>
  <p className="checked"><b>How to read this page.</b> We have not tested {c.name}. This summarises what {c.name} and, where noted, third parties publish, checked on {COMPARISONS_CHECKED}. Plans, limits and features change, so confirm on the sources below before you decide.</p>
  <div className="table-scroll"><table className="compare-table"><thead><tr><th scope="col">&nbsp;</th><th scope="col">PDF Studio</th><th scope="col">{c.name}</th></tr></thead>
   <tbody>{c.rows.map(r=><tr key={r.topic}><th scope="row">{r.topic}</th><td data-label="PDF Studio">{r.studio}</td><td data-label={c.name}>{r.other}{r.source&&<sup className="src-ref"><a href={'#source-'+r.source} aria-label={'Source '+r.source}>[{r.source}]</a></sup>}</td></tr>)}</tbody></table></div>
  <h2>{c.name} may suit you if</h2><ul>{c.otherSuits.map(x=><li key={x}>{x}</li>)}</ul>
  <h2>PDF Studio may suit you if</h2><ul>{c.studioSuits.map(x=><li key={x}>{x}</li>)}</ul>
  <h2>Try it</h2><Spotlight as="nav" className="related-tools" item="a" aria-label="Popular tools"><Link href="/tools/edit-pdf-text"><b>Edit PDF text</b><span>Change existing text in your browser.</span></Link><Link href="/tools/compress-pdf"><b>Compress PDF</b><span>Make a PDF smaller for email and portals.</span></Link><Link href="/tools/merge-pdf"><b>Merge PDF files</b><span>Combine PDFs in the order you choose.</span></Link></Spotlight>
  <h2>Sources</h2><ol className="source-list">{c.sources.map((src,i)=><li key={src.url} id={'source-'+(i+1)}><a href={src.url} rel="noreferrer nofollow">{src.label}</a> ({src.kind==='vendor'?'the company’s own page':'third-party listing'}. Checked {COMPARISONS_CHECKED})</li>)}</ol>
  <p className="checked">Other comparisons: {comparisons.filter(x=>x.slug!==c.slug).map((x,i)=><span key={x.slug}>{i>0?' · ':''}<Link href={'/compare/'+x.slug}>{x.title}</Link></span>)}</p>
 </main><SiteFooter/></div>;
}
