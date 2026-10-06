import Link from '@/components/browser-link';
import {toolMeta,fullTitle} from '@/lib/seo-meta';
import {FormLanding} from '@/components/form-landing';
import {conversionGuides} from '@/lib/conversion-guides';
import {ConversionGuide} from '@/components/conversion-guide';
import {searchGuidance} from '@/lib/search-guidance';
import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import Studio from '@/app/page';
import {SiteHeader} from '@/components/site-header';
import {HandwritingStudio} from '@/components/handwriting-studio';
import '@/app/creative/creative.css';
import {tools,accepted} from '@/lib/tools';
import {seoPages,seoTools} from '@/lib/seo-tools';
import {toolGuidance} from '@/lib/tool-guidance';
import {Spotlight} from '@/components/spotlight';

export function generateStaticParams(){return [...seoPages,...conversionGuides].map(t=>({slug:t.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
 const {slug}=await params, t=[...seoPages,...conversionGuides].find(t=>t.slug===slug);if(!t)return {};
 const image={url:'/social/'+t.slug+'.png',width:1200,height:630,alt:t.title+' — PDF Studio'};
 const meta=toolMeta[slug]??{title:t.title+('id' in t?' — Free Online':''),description:t.intro};
 return {title:{absolute:fullTitle(meta.title)},description:meta.description,alternates:{canonical:'/tools/'+t.slug},twitter:{card:'summary_large_image',images:[image.url],title:fullTitle(meta.title),description:meta.description},openGraph:{images:[image],title:fullTitle(meta.title),description:meta.description,url:'https://pdf-studio.in/tools/'+t.slug}};
}
export default async function ToolPage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;if(slug==='pdf-to-handwriting')return <div className="creative-shell"><SiteHeader/><HandwritingStudio mode="pdf-to-handwriting"/></div>;const conversion=conversionGuides.find(g=>g.slug===slug);if(conversion)return <ConversionGuide guide={conversion}/>;const t=seoPages.find(t=>t.slug===slug);if(!t)notFound();
 const tool=tools.find(x=>x.id===t.id)!,guidance=searchGuidance[t.slug]??toolGuidance[t.id];
 const formats=accepted(t.id).replaceAll('.','').toUpperCase();
 const faq:[string,string][]=[...guidance.faq,
  ['Which files can I use?',`Supported inputs: ${formats}. ${tool.note??tool.description}`],
  ['Is this free?','Core tools require no account or subscription and add no watermark.'],
  ['Do my documents leave my device?','Document processing runs in your browser. PDF Studio does not upload document files. Explicitly saved drafts and My files remain in this browser until deleted. Read aloud may use network-backed browser voices.']
 ];
 const url='https://pdf-studio.in/tools/'+t.slug;
 const schema={"@context":"https://schema.org","@graph":[
  {"@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:'PDF Studio',item:'https://pdf-studio.in/'},{"@type":"ListItem",position:2,name:t.title,item:url}]},
  {"@type":"WebApplication",name:t.title+' | PDF Studio',url,description:t.intro,applicationCategory:'UtilitiesApplication',operatingSystem:'Web browser',browserRequirements:'JavaScript enabled; a modern browser',offers:{"@type":"Offer",price:'0',priceCurrency:'INR'}},
  {"@type":"HowTo",name:t.heading,description:t.intro,step:guidance.steps.map((text,i)=>({"@type":"HowToStep",position:i+1,name:'Step '+(i+1),text}))},
  {"@type":"FAQPage",mainEntity:faq.map(([name,text])=>({"@type":"Question",name,acceptedAnswer:{"@type":"Answer",text}}))}
 ]};
 const popular=['merge','compress','native-text','organize','sign','split','images','word','rotate','encrypt','decrypt','ocr'];
 const rank=(id:string)=>{const i=popular.indexOf(id);return i<0?popular.length:i;};
 const related=[...seoPages.filter(x=>x.id===t.id&&x.slug!==t.slug),...seoTools.filter(x=>x.id!==t.id&&x.group===tool.group).sort((a,b)=>rank(a.id)-rank(b.id))].slice(0,6);
 const guide=t.id==='form'?<FormLanding faq={faq}/>:<section className="tool-instructions" aria-labelledby="tool-guide-title">
   <h2 id="tool-guide-title">{t.heading}</h2><p>{t.intro}</p>
   <h3>How it works</h3><ol>{guidance.steps.map(step=><li key={step}>{step}</li>)}</ol><p>{t.detail}</p>
   <h3>When to use this tool</h3><p>{guidance.useCase}</p>
   <h3>What to check before sharing</h3><p>{guidance.checks}</p>
   <h3>Supported files</h3><p>{tool.note??tool.description}</p><p>Inputs: {formats}. Performance depends on your device. Download important work before closing the browser; local storage is not a backup.</p>
   <h3>Troubleshooting</h3><p>{searchGuidance[t.slug]?guidance.faq.map(([question,answer])=>`${question} ${answer}`).join(" "):"If the file will not open, check it in another PDF reader. If it is password-protected, use Remove a PDF password with a password you know. For scans that need selectable text, run Make a PDF searchable first."}</p>
   <h3>Common questions</h3><div className="tool-faq">{faq.map(([question,answer])=><details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div>
   <h3>Related tools</h3><Spotlight as="nav" className="related-tools" item="a" aria-label="Related PDF tools">{related.map(x=><Link key={x.slug} href={'/tools/'+x.slug}><b>{x.title}</b><span>{x.intro}</span></Link>)}</Spotlight>
   <p className="back-to-tool"><a className="secondary" href="#studio-content">Back to {t.title}</a></p>
  </section>;
 return <div className="tool-page">
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,'\\u003c')}}/>
  <Studio initialTool={t.id} initialHeading={t.title} guide={guide}/>
 </div>;
}


