import {LabExperiment} from '@/components/lab-experiment';
import {experiments} from '@/lib/lab-tools';
import '../lab.css';
import {notFound} from 'next/navigation';
import {SiteHeader,SiteFooter} from '@/components/site-header';
import {HandwritingStudio} from '@/components/handwriting-studio';
import {labTools} from '@/lib/handwriting';
import {pageMeta} from '@/lib/page-meta';
import '../../creative/creative.css';
export function generateStaticParams(){return [...labTools,...experiments].map(t=>({slug:t.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const tool=[...labTools,...experiments].find(t=>t.slug===slug);return tool?pageMeta('/lab/'+slug,tool.title+' — free online',tool.description):{};}
export default async function CreativeTool({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const tool=[...labTools,...experiments].find(t=>t.slug===slug);if(!tool)notFound();return <div className="creative-shell"><SiteHeader/>{experiments.some(t=>t.slug===slug)?<LabExperiment mode={slug as (typeof experiments)[number]['slug']}/>:<HandwritingStudio mode={tool.slug as (typeof labTools)[number]['slug']}/>}<SiteFooter/></div>;}
