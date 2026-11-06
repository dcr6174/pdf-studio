import {CreativePdfWorkspace} from '@/components/creative-pdf-workspace';
import {LabVisualStudio} from '@/components/lab-visual-studio';
import '@/app/lab/lab.css';
import {canonicalToolRoutes} from '@/lib/canonical-routes';
import {redirect} from 'next/navigation';
import {toolMeta,fullTitle} from '@/lib/seo-meta';
import {conversionGuides} from '@/lib/conversion-guides';
import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import Studio from '@/app/page';
import {SiteHeader,SiteFooter} from '@/components/site-header';
import {OCRStudio} from '@/components/ocr-studio';
import {HandwritingStudio} from '@/components/handwriting-studio';
import '@/app/creative/creative.css';
import {seoPages} from '@/lib/seo-tools';

export function generateStaticParams(){return [...seoPages,...conversionGuides].map(t=>({slug:t.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
 const {slug}=await params, t=[...seoPages,...conversionGuides].find(t=>t.slug===slug);if(!t)return {};
 const image={url:'/social/'+t.slug+'.png',width:1200,height:630,alt:t.title+' — PDF Studio'};
 const meta=toolMeta[slug]??{title:t.title+('id' in t?' — Free Online':''),description:t.intro};
 return {title:{absolute:fullTitle(meta.title)},description:meta.description,alternates:{canonical:'/tools/'+t.slug},twitter:{card:'summary_large_image',images:[image.url],title:fullTitle(meta.title),description:meta.description},openGraph:{images:[image],title:fullTitle(meta.title),description:meta.description,url:'https://pdf-studio.in/tools/'+t.slug}};
}
export default async function ToolPage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;if(canonicalToolRoutes[slug])redirect('/tools/'+canonicalToolRoutes[slug]);if(slug==='pdf-to-handwriting')return <div className="creative-shell"><SiteHeader/><HandwritingStudio mode="pdf-to-handwriting"/></div>;const conversion=conversionGuides.find(g=>g.slug===slug);if(conversion)redirect('/guides/'+slug);const t=seoPages.find(t=>t.slug===slug);if(!t)notFound();
 const url='https://pdf-studio.in/tools/'+t.slug;
 const schema={"@context":"https://schema.org","@graph":[
  {"@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:'PDF Studio',item:'https://pdf-studio.in/'},{"@type":"ListItem",position:2,name:t.title,item:url}]},
  {"@type":"WebApplication",name:t.title+' | PDF Studio',url,description:t.intro,applicationCategory:'UtilitiesApplication',operatingSystem:'Web browser',browserRequirements:'JavaScript enabled; a modern browser',offers:{"@type":"Offer",price:'0',priceCurrency:'INR'}},
 ]};
 return <div className="tool-page">
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,'\\u003c')}}/>
  {['cut-collect','fold-lab','attachment-map'].includes(t.id)?<CreativePdfWorkspace mode={t.id as 'cut-collect'|'fold-lab'|'attachment-map'}/>:t.id==='sketch-pdf'?<div className="creative-shell"><SiteHeader/><LabVisualStudio mode="sketch-pdf" mainTool/></div>:t.id==='ocr'?<><SiteHeader/><OCRStudio/><SiteFooter tool="Searchable PDF"/></>:<Studio initialTool={t.id} initialHeading={t.title} initialActionLabel={t.slug==='delete-pdf-pages'?'Delete pages & download':undefined} initialOptions={t.slug==='compress-pdf-to-100kb'?{compressTarget:'100'}:undefined}/>}
 </div>;
}
