import {creativeTools} from '@/lib/handwriting';
import {HandwritingHelp} from '@/components/handwriting-help';
import {canonicalToolRoutes} from '@/lib/canonical-routes';
import {redirect} from 'next/navigation';
import Link from '@/components/browser-link';
import {guideMeta} from '@/lib/guide-meta';
import {FormLanding} from '@/components/form-landing';
import {conversionGuides} from '@/lib/conversion-guides';
import {ConversionGuide} from '@/components/conversion-guide';
import {searchGuidance} from '@/lib/search-guidance';
import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {SiteHeader,SiteFooter} from '@/components/site-header';
import {tools,accepted} from '@/lib/tools';
import {seoPages,seoTools} from '@/lib/seo-tools';
import {toolGuidance} from '@/lib/tool-guidance';
import {Spotlight} from '@/components/spotlight';

export function generateStaticParams(){return [...seoPages,...conversionGuides,...creativeTools.filter(c=>!seoPages.some(p=>p.slug===c.slug))].map(t=>({slug:t.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
 const {slug}=await params, creative=creativeTools.find(c=>c.slug===slug);if(creative)return guideMeta(slug,creative.title,creative.description);const t=[...seoPages,...conversionGuides].find(t=>t.slug===slug);if(!t)return {};
 return guideMeta(t.slug,t.title,t.intro,'/social/'+t.slug+'.png');
}
export default async function ToolGuidePage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;if(canonicalToolRoutes[slug])redirect('/guides/'+canonicalToolRoutes[slug]);const creative=creativeTools.find(c=>c.slug===slug);if(creative)return <div className="tool-guide-page"><SiteHeader/><main className="tool-instructions"><nav aria-label="Breadcrumb"><Link href="/guides">All guides</Link></nav><h1>{creative.title}: guide</h1><p>{creative.description}</p><HandwritingHelp mode={creative.slug}/><Link className="primary" href={(slug==='pdf-to-handwriting'?'/tools/':'/lab/')+slug}>Open {creative.title}</Link></main><SiteFooter/></div>;const conversion=conversionGuides.find(g=>g.slug===slug);if(conversion)return <ConversionGuide guide={conversion}/>;const t=seoPages.find(t=>t.slug===slug);if(!t)notFound();
 const tool=tools.find(x=>x.id===t.id)!,guidance=searchGuidance[t.slug]??toolGuidance[t.id];
 const formats=accepted(t.id).replaceAll('.','').toUpperCase();
 const faq:[string,string][]=[...guidance.faq,
  ['Which files can I use?',`Supported inputs: ${formats}. ${tool.note??tool.description}`],
  ['Is this free?','Core tools require no account or subscription and add no watermark.'],
  ['Do my documents leave my device?','Document processing runs in your browser. PDF Studio does not upload document files. Explicitly saved drafts and My files remain in this browser until deleted. Read aloud may use network-backed browser voices.']
 ];
 const url='https://pdf-studio.in/guides/'+t.slug;
 const schema={"@context":"https://schema.org","@graph":[
  {"@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:'PDF Studio',item:'https://pdf-studio.in/'},{"@type":"ListItem",position:2,name:t.title,item:url}]},
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
   <p className="back-to-tool"><Link className="secondary" href={'/tools/'+t.slug}>Open {t.title}</Link></p>
  </section>;
 return <div className="tool-guide-page"><SiteHeader/>
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,'\\u003c')}}/>
  <main><header className="tool-instructions"><nav aria-label="Breadcrumb"><Link href="/guides">All guides</Link></nav><h1>{t.title}: guide</h1><Link className="primary" href={'/tools/'+t.slug}>Open {t.title}</Link></header>{guide}</main><SiteFooter/>
 </div>;
}
