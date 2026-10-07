'use client';
import {useEffect,useRef} from 'react';
import {usePathname} from 'next/navigation';
import {ADS_ENABLED,AD_CLIENT,AD_SLOT,isAdvertisingPage} from '@/lib/advertising';
import './site-ad.css';

function AdSlot(){
 const host=useRef<HTMLModElement>(null),requested=useRef(false);
 useEffect(()=>{
  const node=host.current;if(!node)return;
  const initialize=()=>{
   if(requested.current||!node.isConnected||node.getBoundingClientRect().width===0)return;
   if(node.dataset.adsbygoogleStatus){requested.current=true;return;}
   requested.current=true;
   if(!document.getElementById('pdf-studio-adsense')){
    const script=document.createElement('script');script.id='pdf-studio-adsense';script.async=true;script.crossOrigin='anonymous';
    script.src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client='+AD_CLIENT;
    document.head.appendChild(script);
   }
   const adsWindow=window as Window & {adsbygoogle?:{push:(request:Record<string,never>)=>unknown}};
   try{(adsWindow.adsbygoogle=adsWindow.adsbygoogle||([] as Record<string,never>[])).push({});}catch{/* Ad blockers or unavailable inventory must not interrupt PDF tools. */}
  };
  const observer=typeof ResizeObserver==='undefined'?null:new ResizeObserver(initialize);observer?.observe(node);initialize();
  return()=>observer?.disconnect();
 },[]);
 return <section className="site-ad" aria-label="Advertisement"><span className="site-ad-label">Advertisement</span><ins ref={host} className="adsbygoogle" style={{display:'block'}} data-ad-client={AD_CLIENT} data-ad-slot={AD_SLOT} data-ad-format="auto" data-full-width-responsive="true"/></section>;
}
export function SiteAd(){
 const pathname=usePathname()||'/';
 if(!ADS_ENABLED||!isAdvertisingPage(pathname))return null;
 return <AdSlot key={pathname}/>;
}
