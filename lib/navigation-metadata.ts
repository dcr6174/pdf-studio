export type NavigationMetadata={title:string;description:string;url:string;image:string};
/** Keep history-based workspace navigation consistent with direct route metadata. */
export function syncNavigationMetadata(meta:NavigationMetadata){
 document.title=meta.title;
 const setMeta=(attribute:'name'|'property',key:string,value:string)=>{
  const existing=Array.from(document.head.querySelectorAll<HTMLMetaElement>('meta['+attribute+'="'+key+'"]'));
  const node=existing.shift()??document.createElement('meta');
  node.setAttribute(attribute,key);node.content=value;if(!node.parentNode)document.head.appendChild(node);
  for(const duplicate of existing)duplicate.remove();
 };
 const links=Array.from(document.head.querySelectorAll<HTMLLinkElement>('link[rel="canonical"]'));
 const canonical=links.shift()??document.createElement('link');canonical.rel='canonical';canonical.href=meta.url;
 if(!canonical.parentNode)document.head.appendChild(canonical);for(const duplicate of links)duplicate.remove();
 setMeta('name','description',meta.description);
 for(const [key,value] of [['og:title',meta.title],['og:description',meta.description],['og:url',meta.url],['og:image',meta.image]])setMeta('property',key,value);
 for(const [key,value] of [['twitter:title',meta.title],['twitter:description',meta.description],['twitter:image',meta.image]])setMeta('name',key,value);
 // Remove route-specific schemas that describe the page we have left.
 const routeTypes=new Set(['WebApplication','HowTo','FAQPage','BreadcrumbList']);
 for(const script of document.querySelectorAll<HTMLScriptElement>('script[type="application/ld+json"]')){
  try{const data=JSON.parse(script.textContent??'null');if(!data)continue;
   if(Array.isArray(data['@graph'])){const kept=data['@graph'].filter((item:{'@type'?:string})=>!routeTypes.has(item['@type']??''));if(kept.length){data['@graph']=kept;script.textContent=JSON.stringify(data);}else script.remove();}
   else if(routeTypes.has(data['@type']))script.remove();
  }catch{/* Leave unrelated or non-JSON scripts untouched. */}
 }
 const schema=document.createElement('script');schema.type='application/ld+json';schema.dataset.navigationMetadata='true';
 schema.textContent=JSON.stringify({'@context':'https://schema.org','@type':'WebApplication',name:meta.title,url:meta.url,description:meta.description,applicationCategory:'UtilitiesApplication',operatingSystem:'Web browser'});
 document.head.appendChild(schema);
}
