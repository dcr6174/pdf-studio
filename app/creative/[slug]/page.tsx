import {notFound} from 'next/navigation';
import {SiteHeader,SiteFooter} from '@/components/site-header';
import {HandwritingStudio} from '@/components/handwriting-studio';
import {creativeTools} from '@/lib/handwriting';
import {pageMeta} from '@/lib/page-meta';
import '../creative.css';
export function generateStaticParams(){return creativeTools.map(t=>({slug:t.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const tool=creativeTools.find(t=>t.slug===slug);return tool?pageMeta('/creative/'+slug,tool.title+' — free online',tool.description):{};}
export default async function CreativeTool({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const tool=creativeTools.find(t=>t.slug===slug);if(!tool)notFound();return <div className="creative-shell"><SiteHeader/><HandwritingStudio mode={tool.slug}/><SiteFooter/></div>;}
