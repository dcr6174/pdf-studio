import {ImageSizeStudio} from '@/components/image-size-studio';
import {ImageLabStudio} from '@/components/image-lab-studio';
import {imageTools,type ImageToolSlug} from '@/lib/image-tools';
import {LabPrintableStudio} from '@/components/lab-printable-studio';
import {printableTools,type PrintableMode} from '@/lib/lab-printables';
import {FunLab} from '@/components/fun-lab';
import {funTools,type FunMode} from '@/lib/fun-lab';
import {redirect} from 'next/navigation';
import {LabUtility} from '@/components/lab-utility';
import {utilityTools,type UtilityMode} from '@/lib/lab-utilities';
import {LabVisualStudio} from '@/components/lab-visual-studio';
import {LabExperiment} from '@/components/lab-experiment';
import {experiments} from '@/lib/lab-tools';
import '../lab.css';
import {notFound} from 'next/navigation';
import {SiteHeader} from '@/components/site-header';
import {HandwritingStudio} from '@/components/handwriting-studio';
import {labTools} from '@/lib/handwriting';
import {labMeta,fullTitle} from '@/lib/seo-meta';
import {pageMeta} from '@/lib/page-meta';
import '../../creative/creative.css';
export function generateStaticParams(){return [...new Set([...labTools,...experiments,...utilityTools,...printableTools,...funTools,...imageTools].map(t=>t.slug))].map(slug=>({slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const tool=[...labTools,...experiments,...utilityTools,...printableTools,...funTools,...imageTools].find(t=>t.slug===slug);if(!tool)return {};if(imageTools.some(t=>t.slug===slug)){const title=fullTitle(tool.title+' — free online'),description=tool.description,meta=pageMeta('/lab/'+slug,title,description),image={url:'/social/image-studio.png',width:1200,height:630,alt:tool.title+' in PDF Studio Lab'};return {...meta,title:{absolute:title},openGraph:{...meta.openGraph,images:[image]},twitter:{card:'summary_large_image',title,description,images:[image.url]}};}const m=labMeta[slug]??{title:tool.title+' — free online',description:tool.description};return {...pageMeta('/lab/'+slug,fullTitle(m.title),m.description),title:{absolute:fullTitle(m.title)}};}
export default async function CreativeTool({params}:{params:Promise<{slug:string}>}){const {slug}=await params;if(imageTools.some(t=>t.slug===slug)){const tool=imageTools.find(t=>t.slug===slug)!;return <>{slug==='image-size-reducer'?<ImageSizeStudio/>:<ImageLabStudio mode={slug as ImageToolSlug}/>}<script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({'@context':'https://schema.org','@type':'WebApplication',name:tool.title,description:tool.description,url:'https://pdf-studio.in/lab/'+slug,applicationCategory:'MultimediaApplication',operatingSystem:'Web browser',offers:{'@type':'Offer',price:'0',priceCurrency:'USD'}}).replace(/</g,'\\u003c')}}/></>;}if(funTools.some(t=>t.slug===slug))return <FunLab mode={slug as FunMode}/>;if(slug==='sketch-pdf')redirect('/tools/sketch-over-pdf');if(printableTools.some(t=>t.slug===slug))return <div className="creative-shell"><SiteHeader/><LabPrintableStudio mode={slug as PrintableMode}/></div>;if(utilityTools.some(t=>t.slug===slug))return <LabUtility mode={slug as UtilityMode}/>;const tool=[...labTools,...experiments,...utilityTools,...printableTools,...funTools].find(t=>t.slug===slug);if(!tool)notFound();return <div className="creative-shell"><SiteHeader/>{['poster-collage','pdf-to-gif','sketch-pdf'].includes(slug)?<LabVisualStudio mode={slug as 'poster-collage'|'pdf-to-gif'|'sketch-pdf'}/>:experiments.some(t=>t.slug===slug)?<LabExperiment mode={slug as 'flipbook'|'word-cloud'|'page-palette'|'whiteboard'}/>:<HandwritingStudio mode={tool.slug as (typeof labTools)[number]['slug']}/>}</div>;}

