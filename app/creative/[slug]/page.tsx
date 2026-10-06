import {redirect,notFound} from 'next/navigation';
import {creativeTools} from '@/lib/handwriting';
export function generateStaticParams(){return creativeTools.map(t=>({slug:t.slug}));}
export default async function LegacyCreative({params}:{params:Promise<{slug:string}>}){const {slug}=await params;if(!creativeTools.some(t=>t.slug===slug))notFound();redirect(slug==='pdf-to-handwriting'?'/tools/pdf-to-handwriting':'/lab/'+slug);}
