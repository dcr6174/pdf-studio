import type {Metadata} from 'next';
import {pageMeta} from './page-meta';
import {fullTitle} from './seo-meta';

/** Instructions have a different search intent from the interactive tool. */
export function guideMeta(slug:string,title:string,detail:string,imagePath='/social/home.png'):Metadata{
 const description=(title+': step-by-step instructions, settings and download checks. '+detail).replace(/\s+/g,' ').trim();
 const summary=description.length<=160?description:description.slice(0,157).replace(/\s+\S*$/,'')+'…';
 const heading=fullTitle(title+' guide');
 const meta=pageMeta('/guides/'+slug,heading,summary);
 const image={url:imagePath,width:1200,height:630,alt:title+' guide — PDF Studio'};
 return {...meta,title:{absolute:heading},openGraph:{...meta.openGraph,title:heading,description:summary,images:[image]},twitter:{card:'summary_large_image',title:heading,description:summary,images:[imagePath]}};
}
