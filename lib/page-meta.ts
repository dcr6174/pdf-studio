import type {Metadata} from 'next';
/** Page-specific search and social tags. Without this, a page inherits the home page's og:url/og:title and every share shows the home page. */
export function pageMeta(path:string,title:string,description:string):Metadata{
 const url='https://pdf-studio.in'+path;
 const image={url:'/social/home.png',width:1200,height:630,alt:'PDF Studio: free online PDF tools'};
 return {
  title,description,alternates:{canonical:path},
  openGraph:{type:'website',siteName:'PDF Studio',locale:'en_IN',url,title,description,images:[image]},
  twitter:{card:'summary_large_image',title,description,images:[image.url]},
 };
}
