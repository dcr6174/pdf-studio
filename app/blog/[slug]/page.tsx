import {ToolArticle} from '@/components/tool-article';
import {MergeArticle} from '@/components/merge-article';
import {InterleaveCompanionArticle} from '@/components/interleave-companion-article';
import {InterleaveArticle} from '@/components/interleave-article';
import {notFound} from 'next/navigation';
import {pageMeta} from '@/lib/page-meta';
import {articles} from '@/lib/articles';
import '../blog.css';
export function generateStaticParams(){return articles.map(a=>({slug:a.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params,a=articles.find(a=>a.slug===slug);return a?pageMeta('/blog/'+slug,a.title,a.summary):{};}
export default async function Article({params}:{params:Promise<{slug:string}>}){const {slug}=await params,a=articles.find(a=>a.slug===slug);if(!a)notFound();if(a.toolId==='merge')return <MergeArticle article={a}/>;if(a.slug==='how-to-alternate-and-mix')return <InterleaveArticle article={a}/>;if(['combine-front-and-back-pdf-scans','fix-alternating-pdf-page-order'].includes(a.slug))return <InterleaveCompanionArticle article={a}/>;return <ToolArticle article={a}/>;}
