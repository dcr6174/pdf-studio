import Link from 'next/link';
import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import Studio from '@/app/page';
import {tools,accepted} from '@/lib/tools';
import {seoPages,seoTools} from '@/lib/seo-tools';
import {toolGuidance} from '@/lib/tool-guidance';

export function generateStaticParams(){return seoPages.map(t=>({slug:t.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
 const {slug}=await params, t=seoPages.find(t=>t.slug===slug);if(!t)return {};
 const image={url:'/social/'+t.slug+'.png',width:1200,height:630,alt:t.title+' — PDF Studio'};
 return {title:t.title+' — Free Online',description:t.intro,alternates:{canonical:'/tools/'+t.slug},twitter:{card:'summary_large_image',images:[image.url],title:t.title+' | PDF Studio',description:t.intro},openGraph:{images:[image],title:t.title+' | PDF Studio',description:t.intro,url:'https://pdf-studio.in/tools/'+t.slug}};
}
export default async function ToolPage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params,t=seoPages.find(t=>t.slug===slug);if(!t)notFound();
 const tool=tools.find(x=>x.id===t.id)!,guidance=toolGuidance[t.id];
 const formats=accepted(t.id).replaceAll('.','').toUpperCase();
 const limits=t.id==='native-text'?'50 MB and 100 pages':t.id==='images'?'157.3 MB total, with each image below 22 megapixels':'157.3 MB total and 400 pages';
 const faq:[string,string][]=[...guidance.faq,
  ['Which files can I use?',`Supported inputs: ${formats}. ${tool.note??tool.description}`],
  ['Is this free, and what are the limits?',`Core tools require no account or subscription and add no watermark. This workflow supports ${limits}. Available device memory can impose a lower practical limit.`],
  ['Do my documents leave my device?','Document processing runs in your browser. PDF Studio does not upload document files. Explicitly saved drafts and My files remain in this browser until deleted. Read aloud may use network-backed browser voices.']
 ];
 const url='https://pdf-studio.in/tools/'+t.slug;
 const schema={"@context":"https://schema.org","@graph":[
  {"@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:'PDF Studio',item:'https://pdf-studio.in/'},{"@type":"ListItem",position:2,name:t.title,item:url}]},
  {"@type":"WebApplication",name:t.title+' | PDF Studio',url,description:t.intro,applicationCategory:'UtilitiesApplication',operatingSystem:'Web browser',browserRequirements:'JavaScript enabled; a modern browser',offers:{"@type":"Offer",price:'0',priceCurrency:'INR'}},
  {"@type":"HowTo",name:t.heading,description:t.intro,step:guidance.steps.map((text,i)=>({"@type":"HowToStep",position:i+1,name:'Step '+(i+1),text}))},
  {"@type":"FAQPage",mainEntity:faq.map(([name,text])=>({"@type":"Question",name,acceptedAnswer:{"@type":"Answer",text}}))}
 ]};
 return <div className="seo-page">
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,'\\u003c')}}/>
  <nav className="tool-breadcrumbs" aria-label="Breadcrumb"><Link href="/">PDF Studio</Link><span aria-hidden="true"> / </span><span aria-current="page">{t.title}</span></nav>
  <Studio initialTool={t.id}/>
  <section className="tool-instructions">
   <h2>{t.heading}</h2><p>{t.intro}</p><Link className="primary" href="#studio-content">Go to {t.title}</Link>
   <h2>How it works</h2><ol>{guidance.steps.map(step=><li key={step}>{step}</li>)}</ol><p>{t.detail}</p>
   <h2>When to use this tool</h2><p>{guidance.useCase}</p>
   <h2>What to check before sharing</h2><p>{guidance.checks}</p>
   <h2>Supported inputs and limitations</h2><p>Inputs: {formats}.</p><p>{tool.note??tool.description}</p><p>Technical cap: {limits}. Performance depends on your device. Download important work before closing the browser; local storage is not a backup.</p>
   <h2>Troubleshooting</h2><p>{guidance.checks} If the source cannot open, check it in another reader. Use Remove password only with a password you know. For scans needing selectable text, run English OCR and inspect the recognition result.</p>
   <h2>Common questions</h2>{faq.map(([question,answer])=><details key={question}><summary>{question}</summary><p>{answer}</p></details>)}
   <h2>Choose a related workflow</h2><nav aria-label="Related PDF tools">{[...seoPages.filter(x=>x.id===t.id&&x.slug!==t.slug),...seoTools.filter(x=>x.id!==t.id&&x.group===tool.group)].slice(0,5).map(x=><Link key={x.slug} href={'/tools/'+x.slug}><b>{x.title}</b><span>{x.intro}</span></Link>)}</nav>
  </section>
 </div>;
}
