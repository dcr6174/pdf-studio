'use client';
import {useEffect} from 'react';
import './mobile-home-polish.css';

/** Progressive mobile decoration: links stay visible if motion or JS is unavailable. */
export function MobileHomePolish(){
 useEffect(()=>{
  const host=document.querySelector('.home-shell');if(!host)return;
  const media=matchMedia('(max-width:767px) and (prefers-reduced-motion:no-preference)');
  let observer:IntersectionObserver|undefined,changes:MutationObserver|undefined;
  const seen=new WeakSet<Element>();
  const stop=()=>{observer?.disconnect();changes?.disconnect();host.querySelectorAll('[data-mobile-enter]').forEach(node=>node.removeAttribute('data-mobile-enter'));};
  const sync=()=>{stop();if(!media.matches||typeof IntersectionObserver==='undefined')return;
   observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.setAttribute('data-mobile-enter','true');observer?.unobserve(entry.target);}},{threshold:.08});
   const scan=()=>host.querySelectorAll('.mobile-home-explorer .mobile-catalogue-card').forEach(node=>{if(!seen.has(node)){seen.add(node);observer?.observe(node);}});
   scan();changes=new MutationObserver(scan);changes.observe(host,{childList:true,subtree:true});
  };
  sync();media.addEventListener('change',sync);return()=>{stop();media.removeEventListener('change',sync);};
 },[]);
 return null;
}

