import {ToolArticle} from '@/components/tool-article';
import {MergeArticle} from '@/components/merge-article';
import {InterleaveCompanionArticle} from '@/components/interleave-companion-article';
import {InterleaveArticle} from '@/components/interleave-article';
import {notFound} from 'next/navigation';
import {pageMeta} from '@/lib/page-meta';
import {articles} from '@/lib/articles';
import '../blog.css';
export function generateStaticParams(){return articles.map(a=>({slug:a.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params,a=articles.find(a=>a.slug===slug);
 if(!a)return {};
 const meta=pageMeta('/blog/'+slug,a.title,a.summary);
 return {...meta,openGraph:{...meta.openGraph,type:'article' as const,publishedTime:a.published,modifiedTime:a.updated??a.published,authors:['https://pdf-studio.in/about']}};
}
export default async function Article({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params,a=articles.find(a=>a.slug===slug);
 if(!a)notFound();
 const Content=a.toolId==='merge'?MergeArticle:a.slug==='how-to-alternate-and-mix'?InterleaveArticle:['combine-front-and-back-pdf-scans','fix-alternating-pdf-page-order'].includes(a.slug)?InterleaveCompanionArticle:ToolArticle;
 const breadcrumbs={'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[
  {'@type':'ListItem',position:1,name:'PDF Studio',item:'https://pdf-studio.in/'},
  {'@type':'ListItem',position:2,name:'Learn',item:'https://pdf-studio.in/blog'},
  {'@type':'ListItem',position:3,name:a.title,item:'https://pdf-studio.in/blog/'+a.slug}
 ]};
 return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(breadcrumbs).replace(/</g,'\\u003c')}}/><Content article={a}/></>;
}
