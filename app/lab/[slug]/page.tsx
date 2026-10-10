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
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const tool=[...labTools,...experiments,...utilityTools,...printableTools,...funTools,...imageTools].find(t=>t.slug===slug);if(!tool)return {};const m=labMeta[slug]??{title:tool.title+' — free online',description:tool.description};return {...pageMeta('/lab/'+slug,fullTitle(m.title),m.description),title:{absolute:fullTitle(m.title)}};}
export default async function CreativeTool({params}:{params:Promise<{slug:string}>}){const {slug}=await params;if(slug==='image-size-reducer')return <ImageSizeStudio/>;if(imageTools.some(t=>t.slug===slug))return <ImageLabStudio mode={slug as ImageToolSlug}/>;if(funTools.some(t=>t.slug===slug))return <FunLab mode={slug as FunMode}/>;if(slug==='sketch-pdf')redirect('/tools/sketch-over-pdf');if(printableTools.some(t=>t.slug===slug))return <div className="creative-shell"><SiteHeader/><LabPrintableStudio mode={slug as PrintableMode}/></div>;if(utilityTools.some(t=>t.slug===slug))return <LabUtility mode={slug as UtilityMode}/>;const tool=[...labTools,...experiments,...utilityTools,...printableTools,...funTools].find(t=>t.slug===slug);if(!tool)notFound();return <div className="creative-shell"><SiteHeader/>{['poster-collage','pdf-to-gif','sketch-pdf'].includes(slug)?<LabVisualStudio mode={slug as 'poster-collage'|'pdf-to-gif'|'sketch-pdf'}/>:experiments.some(t=>t.slug===slug)?<LabExperiment mode={slug as 'flipbook'|'word-cloud'|'page-palette'|'whiteboard'}/>:<HandwritingStudio mode={tool.slug as (typeof labTools)[number]['slug']}/>}</div>;}

