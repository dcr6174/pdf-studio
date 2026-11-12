'use client';
import {useEffect,useRef,useState} from 'react';
import {usePathname} from 'next/navigation';
import {ADS_ENABLED,AD_CLIENT,AD_SLOT,isAdvertisingPage} from '@/lib/advertising';
import './site-ad.css';

function AdSlot(){
 const section=useRef<HTMLElement>(null),[filled,setFilled]=useState(false);
 useEffect(()=>{
  const root=section.current;if(!root)return;
  // The ad unit lives outside React's rendered tree: AdSense rewrites the <ins>
  // as soon as its script lands, and a server/client DOM mismatch here can take
  // the whole page down during hydration on some browsers.
  const node=document.createElement('ins');
  node.className='adsbygoogle';node.style.display='block';
  node.setAttribute('data-ad-client',AD_CLIENT);node.setAttribute('data-ad-slot',AD_SLOT);
  node.setAttribute('data-ad-format','auto');node.setAttribute('data-full-width-responsive','true');
  root.appendChild(node);
  let requested=false;
  const initialize=()=>{
   if(requested||!node.isConnected||node.getBoundingClientRect().width===0)return;
   if(node.dataset.adsbygoogleStatus){requested=true;return;}
   requested=true;
   if(!document.getElementById('pdf-studio-adsense')){
    const script=document.createElement('script');script.id='pdf-studio-adsense';script.async=true;script.crossOrigin='anonymous';
    script.src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client='+AD_CLIENT;
    document.head.appendChild(script);
   }
   const adsWindow=window as Window & {adsbygoogle?:{push:(request:Record<string,never>)=>unknown}};
   try{(adsWindow.adsbygoogle=adsWindow.adsbygoogle||([] as Record<string,never>[])).push({});}catch{/* Ad blockers or unavailable inventory must not interrupt PDF tools. */}
  };
  // Defer the AdSense loader until the page has fully loaded and gone idle.
  // Auto Ads can rewrite body-level DOM; if the script lands while React is
  // still hydrating on a slow device, that injection fails hydration (#418).
  const whenIdle=(run:()=>void)=>{const go=()=>{const w=window as Window&{requestIdleCallback?:(cb:()=>void)=>number};if(typeof w.requestIdleCallback==='function')w.requestIdleCallback(run);else setTimeout(run,1200);};if(document.readyState==='complete')go();else window.addEventListener('load',go,{once:true});};
  const deferred=()=>whenIdle(initialize);
  const status=new MutationObserver(()=>{if(node.dataset.adStatus==='filled')setFilled(true)});
  status.observe(node,{attributes:true,attributeFilter:['data-ad-status']});
  const observer=typeof ResizeObserver==='undefined'?null:new ResizeObserver(deferred);observer?.observe(node);deferred();
  return()=>{observer?.disconnect();status.disconnect();node.remove();};
 },[]);
 return <section ref={section} className="site-ad" data-filled={filled||undefined} aria-label="Advertisement"><span className="site-ad-label">Advertisement</span></section>;
}
export function SiteAd(){
 const pathname=usePathname()||'/';
 if(!ADS_ENABLED||!isAdvertisingPage(pathname))return null;
 return <AdSlot key={pathname}/>;
}
